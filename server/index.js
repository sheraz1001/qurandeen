import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import OpenAI from 'openai';
import { OAuth2Client } from 'google-auth-library';
import Stripe from 'stripe';
import { sendEmail, sendDonationReceipt, sendNewAccountEmail, sendAdminNotification, sendSubscriptionCancelledAdmin, sendPasswordResetEmail, sendAdminPasswordChangeNotification } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? 'https://qurandeen.com/api/auth/google/callback'
  : `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`;

const googleOAuthClient = GOOGLE_CLIENT_ID ? new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
) : null;

if (GOOGLE_CLIENT_ID) {
  console.log(`Google OAuth configured. Callback URL: ${GOOGLE_REDIRECT_URI}`);
} else {
  console.log('Google OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET to enable.');
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

if (stripe) {
  console.log('Stripe payment processing configured.');
} else {
  console.log('Stripe not configured. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to enable donations.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const ISLAMIC_SCHOLAR_SYSTEM_PROMPT = `You are a highly knowledgeable Islamic scholar and advisor, specializing in the Holy Quran, authentic Hadith (Ahadees), and Quranic Tafsir (commentary). Your role is to help Muslims understand their faith and find guidance for their life problems strictly based on the Quran and Sunnah.

IMPORTANT GUIDELINES:
1. ONLY provide answers based on the Quran, authentic Hadith (from Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasai), and recognized Tafsir.
2. Always cite your sources - mention the Surah and Ayah number for Quranic references, and the Hadith collection and narrator for Ahadees.
3. When providing solutions to problems, always relate them back to Islamic teachings.
4. Be respectful, compassionate, and understanding. Remember that people come seeking guidance during difficult times.
5. If a question is outside the scope of Quran and Hadith, politely explain that you can only provide guidance based on Islamic sources.
6. For matters requiring legal Islamic rulings (Fatwa), advise consulting a local qualified scholar/Mufti.
7. Present different scholarly opinions when they exist, mentioning the major schools of thought (Hanafi, Maliki, Shafi'i, Hanbali) when relevant.
8. Always encourage good deeds, prayer, patience (Sabr), and trust in Allah (Tawakkul).
9. Use Arabic terms with their English translations where appropriate.
10. Format your responses clearly with proper structure using markdown.

You should respond in the same language the user writes in. If they write in Urdu, respond in Urdu. If they write in Arabic, respond in Arabic. If they write in English, respond in English.

Start responses with "Bismillah ir-Rahman ir-Raheem" (In the name of Allah, the Most Gracious, the Most Merciful) when appropriate.`;


app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));

// Use JSON parser for all routes EXCEPT the webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cookieParser());

// Stripe webhook with raw body parser
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const amount = paymentIntent.amount / 100;
        const metadata = paymentIntent.metadata || {};
        const donationType = metadata.type === 'monthly_donation_initial' ? 'monthly' : 'one_time';
        
        let userId = null;
        if (metadata.donorEmail) {
          const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [metadata.donorEmail]);
          if (existingUser.rows.length > 0) {
            userId = existingUser.rows[0].id;
          } else {
            const tempPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            const newUserId = crypto.randomUUID();
            await pool.query(
              `INSERT INTO users (id, name, email, password_hash, city, country, force_password_change) 
               VALUES ($1, $2, $3, $4, $5, $6, true)`,
              [newUserId, metadata.donorName || 'Donor', metadata.donorEmail, hashedPassword, metadata.city || null, metadata.country || null]
            );
            userId = newUserId;
            await sendNewAccountEmail(metadata.donorEmail, tempPassword, metadata.firstName);
            console.log('New user account created for donor:', metadata.donorEmail);
          }
        }
        
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, stripe_customer_id, donor_name, donor_email, first_name, last_name, city, country, amount, currency, donation_type, status, message, user_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (stripe_payment_id) DO UPDATE SET status = $12, updated_at = CURRENT_TIMESTAMP`,
          [
            paymentIntent.id,
            paymentIntent.customer,
            metadata.donorName || 'Anonymous',
            metadata.donorEmail || '',
            metadata.firstName || '',
            metadata.lastName || '',
            metadata.city || '',
            metadata.country || '',
            amount,
            paymentIntent.currency,
            donationType,
            'succeeded',
            metadata.message || '',
            userId
          ]
        );
        
        const donationData = {
          donor_email: metadata.donorEmail,
          first_name: metadata.firstName,
          last_name: metadata.lastName,
          amount,
          donation_type: donationType,
          city: metadata.city,
          country: metadata.country,
          message: metadata.message,
          created_at: new Date()
        };
        await sendDonationReceipt(donationData);
        await sendAdminNotification(donationData);
        
        console.log('Donation recorded:', paymentIntent.id);
        break;
      }
      
      case 'invoice.payment_succeeded':
      case 'invoice_payment.paid': {
        const invoice = event.data.object;
        const amount = (invoice.amount_paid || invoice.total) / 100;
        const customerEmail = invoice.customer_email || '';
        
        // Get customer details from Stripe if available
        let customerDetails = {};
        if (invoice.customer) {
          try {
            const customer = await stripe.customers.retrieve(invoice.customer);
            customerDetails = customer.metadata || {};
          } catch (e) {
            console.log('Could not retrieve customer details:', e.message);
          }
        }
        
        // Check/create user account for the donor
        let userId = null;
        if (customerEmail) {
          const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [customerEmail]);
          if (existingUser.rows.length > 0) {
            userId = existingUser.rows[0].id;
          } else {
            // Create new account for this donor
            const tempPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            const newUserId = crypto.randomUUID();
            const donorName = customerDetails.donorName || invoice.customer_name || 'Donor';
            await pool.query(
              `INSERT INTO users (id, name, email, password_hash, city, country, force_password_change) 
               VALUES ($1, $2, $3, $4, $5, $6, true)`,
              [newUserId, donorName, customerEmail, hashedPassword, customerDetails.city || null, customerDetails.country || null]
            );
            userId = newUserId;
            await sendNewAccountEmail(customerEmail, tempPassword, customerDetails.firstName || donorName.split(' ')[0]);
            console.log('New user account created for invoice donor:', customerEmail);
          }
        }
        
        const donationType = invoice.subscription ? 'monthly' : 'one_time';
        
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, stripe_customer_id, stripe_subscription_id, donor_name, donor_email, first_name, last_name, city, country, amount, currency, donation_type, status, user_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (stripe_payment_id) DO UPDATE SET status = $13, updated_at = CURRENT_TIMESTAMP`,
          [
            invoice.id,
            invoice.customer,
            invoice.subscription || null,
            customerDetails.donorName || invoice.customer_name || 'Anonymous',
            customerEmail,
            customerDetails.firstName || '',
            customerDetails.lastName || '',
            customerDetails.city || '',
            customerDetails.country || '',
            amount,
            invoice.currency,
            donationType,
            'succeeded',
            userId
          ]
        );
        
        // Send email notifications
        const donationData = {
          donor_email: customerEmail,
          first_name: customerDetails.firstName || invoice.customer_name?.split(' ')[0] || 'Donor',
          last_name: customerDetails.lastName || '',
          amount,
          donation_type: donationType,
          city: customerDetails.city || '',
          country: customerDetails.country || '',
          message: customerDetails.message || '',
          created_at: new Date()
        };
        await sendDonationReceipt(donationData);
        await sendAdminNotification(donationData);
        
        console.log('Invoice payment recorded:', invoice.id, 'Event type:', event.type);
        break;
      }
      
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const amount = session.amount_total / 100;
        const customerEmail = session.customer_email || session.customer_details?.email || '';
        
        // Check/create user account
        let userId = null;
        if (customerEmail) {
          const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [customerEmail]);
          if (existingUser.rows.length > 0) {
            userId = existingUser.rows[0].id;
          } else {
            const tempPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            const newUserId = crypto.randomUUID();
            await pool.query(
              `INSERT INTO users (id, name, email, password_hash, city, country, force_password_change) 
               VALUES ($1, $2, $3, $4, $5, $6, true)`,
              [newUserId, metadata.donorName || 'Donor', customerEmail, hashedPassword, metadata.city || null, metadata.country || null]
            );
            userId = newUserId;
            await sendNewAccountEmail(customerEmail, tempPassword, metadata.firstName || 'Donor');
            console.log('New user account created for checkout donor:', customerEmail);
          }
        }
        
        const donationType = session.mode === 'subscription' ? 'monthly' : 'one_time';
        
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, stripe_customer_id, stripe_subscription_id, donor_name, donor_email, first_name, last_name, city, country, amount, currency, donation_type, status, message, user_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (stripe_payment_id) DO UPDATE SET status = $13, updated_at = CURRENT_TIMESTAMP`,
          [
            session.id,
            session.customer,
            session.subscription || null,
            metadata.donorName || 'Anonymous',
            customerEmail,
            metadata.firstName || '',
            metadata.lastName || '',
            metadata.city || '',
            metadata.country || '',
            amount,
            session.currency,
            donationType,
            'succeeded',
            metadata.message || '',
            userId
          ]
        );
        
        const donationData = {
          donor_email: customerEmail,
          first_name: metadata.firstName || 'Donor',
          last_name: metadata.lastName || '',
          amount,
          donation_type: donationType,
          city: metadata.city || '',
          country: metadata.country || '',
          message: metadata.message || '',
          created_at: new Date()
        };
        await sendDonationReceipt(donationData);
        await sendAdminNotification(donationData);
        
        console.log('Checkout session completed:', session.id);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await pool.query(
          `UPDATE donations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
           WHERE stripe_subscription_id = $1`,
          [subscription.id]
        );
        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata || {};
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, donor_name, donor_email, amount, donation_type, status, message)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (stripe_payment_id) DO UPDATE SET status = $6, updated_at = CURRENT_TIMESTAMP`,
          [
            paymentIntent.id,
            metadata.donorName || 'Anonymous',
            metadata.donorEmail || '',
            paymentIntent.amount / 100,
            metadata.type === 'monthly_donation_initial' ? 'monthly' : 'one_time',
            'failed',
            metadata.message || ''
          ]
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, city, country } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password_hash, city, country, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, city, country, role',
      [id, name, email, passwordHash, city || null, country || null, 'user']
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google login. Please sign in with Google.' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, city: user.city, country: user.country, role: user.role },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Password Reset - Request
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await pool.query('SELECT id, name FROM users WHERE email = $1', [email]);
    
    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({ message: 'If an account exists with this email, a password reset link will be sent.' });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    await sendPasswordResetEmail(email, resetToken, user.name?.split(' ')[0]);

    res.json({ message: 'If an account exists with this email, a password reset link will be sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Password Reset - Verify Token
app.get('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const result = await pool.query(
      'SELECT id, email FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.json({ valid: true, email: result.rows[0].email });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

// Password Reset - Set New Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, force_password_change = false WHERE id = $2',
      [passwordHash, result.rows[0].id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.get('/api/auth/google', (req, res) => {
  if (!googleOAuthClient) {
    return res.status(503).json({ error: 'Google OAuth not configured' });
  }
  
  const state = crypto.randomBytes(32).toString('hex');
  res.cookie('oauth_state', state, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000 
  });
  
  const authUrl = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
    state: state
  });
  
  console.log('Google OAuth redirect URL:', GOOGLE_REDIRECT_URI);
  res.redirect(authUrl);
});

app.get('/api/auth/google/callback', async (req, res) => {
  if (!googleOAuthClient) {
    return res.redirect('/login?error=google_not_configured');
  }
  
  const { code, error, error_description, state } = req.query;
  const storedState = req.cookies.oauth_state;
  
  console.log('OAuth callback - full query:', JSON.stringify(req.query));
  console.log('OAuth callback - has code:', !!code, 'has state:', !!state, 'has stored state:', !!storedState);
  
  if (error) {
    console.log('Google returned error:', error, error_description);
    return res.redirect(`/login?error=google_cancelled&detail=${encodeURIComponent(error_description || error)}`);
  }
  
  res.clearCookie('oauth_state');
  
  if (!storedState) {
    console.log('Warning: No stored OAuth state cookie found, proceeding without state validation');
  } else if (!state || state !== storedState) {
    console.log('OAuth state validation failed - state:', state, 'storedState:', storedState);
    return res.redirect('/login?error=google_invalid_state');
  }
  
  if (!code) {
    return res.redirect('/login?error=google_no_code');
  }
  
  try {
    let tokens;
    try {
      const tokenResponse = await googleOAuthClient.getToken(code);
      tokens = tokenResponse.tokens;
    } catch (tokenError) {
      console.error('Token exchange failed:', tokenError.message);
      if (tokenError.message.includes('redirect_uri_mismatch')) {
        return res.redirect('/login?error=google_redirect_mismatch');
      }
      return res.redirect('/login?error=google_token_failed');
    }
    
    googleOAuthClient.setCredentials(tokens);
    
    let payload;
    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError.message);
      return res.redirect('/login?error=google_verify_failed');
    }
    
    const { sub: googleId, email, name, picture } = payload;
    
    if (!email) {
      return res.redirect('/login?error=google_no_email');
    }
    
    let user;
    try {
      user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    } catch (dbError) {
      console.error('Database query failed:', dbError.message);
      return res.redirect('/login?error=google_db_error');
    }
    
    try {
      if (user.rows.length === 0) {
        const id = crypto.randomUUID();
        const result = await pool.query(
          'INSERT INTO users (id, name, email, password_hash, google_id, profile_image, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, city, country, role',
          [id, name || email.split('@')[0], email, null, googleId, picture, 'user']
        );
        user = { rows: result.rows };
      } else {
        if (!user.rows[0].google_id) {
          await pool.query('UPDATE users SET google_id = $1, profile_image = $2 WHERE email = $3', [googleId, picture, email]);
        }
      }
    } catch (dbError) {
      console.error('Database insert/update failed:', dbError.message);
      return res.redirect('/login?error=google_db_error');
    }
    
    const dbUser = user.rows[0];
    if (!dbUser || !dbUser.id || !dbUser.email) {
      console.error('Invalid user data after DB operation:', JSON.stringify(dbUser));
      return res.redirect('/login?error=google_user_error');
    }
    
    try {
      const token = jwt.sign({ id: dbUser.id, email: dbUser.email, role: dbUser.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      console.log('Google OAuth successful for user:', dbUser.email);
      return res.redirect('/dashboard');
    } catch (jwtError) {
      console.error('JWT/Cookie error:', jwtError.message);
      return res.redirect('/login?error=google_session_error');
    }
  } catch (error) {
    console.error('Google OAuth unexpected error:', error.message || error, error.stack);
    const errorMsg = encodeURIComponent(error.message || 'Unknown error');
    res.redirect(`/login?error=google_failed&detail=${errorMsg}`);
  }
});

app.get('/api/auth/google/status', (req, res) => {
  res.json({ enabled: !!googleOAuthClient });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, city, country, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// User profile management
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, city, country } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await pool.query(
      'UPDATE users SET name = $1, city = $2, country = $3 WHERE id = $4 RETURNING id, name, email, city, country, role',
      [name.trim(), city || null, country || null, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0], message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.put('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, req.user.id]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// User reading progress routes
app.get('/api/user/reading-progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT surah_number, completed, last_read FROM reading_progress WHERE user_id = $1 ORDER BY last_read DESC',
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Reading progress error:', error);
    res.status(500).json({ error: 'Failed to get reading progress' });
  }
});

app.post('/api/user/reading-progress', authenticateToken, async (req, res) => {
  try {
    const { surahNumber, completed } = req.body;
    await pool.query(
      `INSERT INTO reading_progress (user_id, surah_number, completed, last_read) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
       ON CONFLICT (user_id, surah_number) 
       DO UPDATE SET completed = $3, last_read = CURRENT_TIMESTAMP`,
      [req.user.id, surahNumber, completed || false]
    );
    res.json({ message: 'Progress updated' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// User bookmarks routes
app.get('/api/user/bookmarks', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Bookmarks error:', error);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
});

app.post('/api/user/bookmarks', authenticateToken, async (req, res) => {
  try {
    const { surahNumber, ayahNumber, arabicText, translation } = req.body;
    await pool.query(
      `INSERT INTO user_bookmarks (user_id, surah_number, ayah_number, arabic_text, translation) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (user_id, surah_number, ayah_number) DO NOTHING`,
      [req.user.id, surahNumber, ayahNumber, arabicText, translation]
    );
    res.json({ message: 'Bookmark added' });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

app.delete('/api/user/bookmarks/:surah/:ayah', authenticateToken, async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    await pool.query(
      'DELETE FROM user_bookmarks WHERE user_id = $1 AND surah_number = $2 AND ayah_number = $3',
      [req.user.id, surah, ayah]
    );
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

// Blog routes (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.slug, b.excerpt, b.published, b.created_at, b.updated_at, u.name as author_name 
       FROM blogs b LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.published = true ORDER BY b.created_at DESC`
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Blogs error:', error);
    res.status(500).json({ error: 'Failed to get blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name as author_name 
       FROM blogs b LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.slug = $1 AND b.published = true`,
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: 'Failed to get blog' });
  }
});

// Admin blog routes
app.get('/api/admin/blogs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id ORDER BY b.created_at DESC`
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Admin blogs error:', error);
    res.status(500).json({ error: 'Failed to get blogs' });
  }
});

app.post('/api/admin/blogs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, published } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const result = await pool.query(
      `INSERT INTO blogs (title, slug, content, excerpt, author_id, published) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, slug, content, excerpt || null, req.user.id, published || false]
    );
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

app.put('/api/admin/blogs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, published } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const result = await pool.query(
      `UPDATE blogs SET title = $1, slug = $2, content = $3, excerpt = $4, published = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING *`,
      [title, slug, content, excerpt, published, req.params.id]
    );
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/api/admin/blogs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Admin users route
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, city, country, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Admin - Update user
app.put('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, city, country, role } = req.body;
    const userId = req.params.id;

    // Prevent admin from changing their own role
    if (userId === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change your own admin role' });
    }

    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, city = $3, country = $4, role = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING id, name, email, city, country, role`,
      [name, email, city || null, country || null, role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: result.rows[0], message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Admin - Delete user
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Admin - Reset user password
app.post('/api/admin/users/:id/reset-password', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const userResult = await pool.query('SELECT email, name FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const newPassword = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, force_password_change = true WHERE id = $2',
      [passwordHash, userId]
    );

    // Send email with new password
    await sendAdminPasswordChangeNotification(user.email, user.name?.split(' ')[0], newPassword);

    res.json({ message: 'Password reset successfully. New password sent to user via email.' });
  } catch (error) {
    console.error('Admin password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.use('/fonts', express.static(path.join(__dirname, '../client/public/fonts')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

app.get('/api/translations', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition/type/translation`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching translations:', error.message);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

app.get('/api/reciters', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition?format=audio&type=versebyverse`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch reciters' });
  }
});

app.get('/api/mp3-reciters', async (req, res) => {
  try {
    const response = await axios.get('https://www.mp3quran.net/api/v3/reciters?language=eng');
    const reciters = response.data.reciters || [];
    
    const formattedReciters = reciters
      .filter(r => r.moshaf && r.moshaf.length > 0)
      .map(r => {
        const moshaf = r.moshaf[0];
        const surahList = moshaf.surah_list ? moshaf.surah_list.split(',').map(Number) : [];
        return {
          id: r.id,
          name: r.name,
          server: moshaf.server,
          style: moshaf.name,
          availableSurahs: surahList,
          surahCount: moshaf.surah_total
        };
      })
      .filter(r => r.availableSurahs.length > 0)
      .sort((a, b) => b.surahCount - a.surahCount);
    
    res.json({ code: 200, data: formattedReciters });
  } catch (error) {
    console.error('Error fetching MP3 reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch MP3 reciters' });
  }
});

app.get('/api/scripts', async (req, res) => {
  try {
    const scripts = [
      { identifier: 'quran-uthmani', englishName: 'Uthmani', name: 'العثماني', description: 'Classic Uthmani script' },
      { identifier: 'quran-simple', englishName: 'Simple', name: 'بسيط', description: 'Simplified Arabic with diacritics' },
      { identifier: 'quran-simple-clean', englishName: 'Simple Clean', name: 'بسيط نظيف', description: 'Simplified without diacritics' },
      { identifier: 'quran-tajweed', englishName: 'Tajweed', name: 'تجويد', description: 'Color-coded tajweed rules' }
    ];
    res.json({ code: 200, data: scripts });
  } catch (error) {
    console.error('Error fetching scripts:', error.message);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

const TAFSIR_API_RAW = 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir';

app.get('/api/tafsirs', async (req, res) => {
  try {
    const response = await axios.get(`${TAFSIR_API_RAW}/editions.json`);
    const tafsirs = response.data.map(t => ({
      identifier: t.slug,
      id: t.id,
      name: t.name,
      englishName: t.name,
      author: t.author_name,
      language: t.language_name,
      source: t.source
    }));
    res.json({ code: 200, data: tafsirs });
  } catch (error) {
    console.error('Error fetching tafsirs:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsirs' });
  }
});

app.get('/api/tafsir/:surah/:ayah', async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const { slug } = req.query;
    
    if (slug) {
      const response = await axios.get(`${TAFSIR_API_RAW}/${slug}/${surah}/${ayah}.json`);
      res.json({ 
        code: 200, 
        data: { 
          text: response.data.text,
          surah: surah,
          ayah: ayah
        } 
      });
    } else {
      const response = await axios.get(`${QURAN_API_BASE}/ayah/${surah}:${ayah}/ar.muyassar`);
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error fetching tafsir:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsir' });
  }
});

app.get('/api/juz/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const response = await axios.get(`${QURAN_API_BASE}/juz/${number}/quran-uthmani`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching juz:', error.message);
    res.status(500).json({ error: 'Failed to fetch juz' });
  }
});

app.get('/api/sajda', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/sajda/quran-uthmani`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching sajda:', error.message);
    res.status(500).json({ error: 'Failed to fetch sajda verses' });
  }
});

// Word-by-word API using Quran.com API
const QURAN_COM_API = 'https://api.quran.com/api/v4';

app.get('/api/word-by-word/:surah/:ayah', async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const verseKey = `${surah}:${ayah}`;
    
    const response = await axios.get(`${QURAN_COM_API}/verses/by_key/${verseKey}`, {
      params: {
        words: true,
        word_fields: 'text_uthmani,text_indopak'
      }
    });
    
    const verse = response.data.verse;
    if (!verse || !verse.words) {
      return res.status(404).json({ error: 'Verse not found' });
    }
    
    const words = verse.words.map((word) => ({
      id: word.id,
      position: word.position,
      text_uthmani: word.text || word.text_uthmani || '',
      text_indopak: word.text || word.text_indopak || '',
      text_simple: word.text || '',
      translation: word.translation?.text || '',
      transliteration: word.transliteration?.text || '',
      audio_url: word.audio_url ? `https://audio.qurancdn.com/${word.audio_url}` : null,
      char_type: word.char_type_name
    }));
    
    res.json({
      code: 200,
      data: {
        verse_key: verseKey,
        words: words
      }
    });
  } catch (error) {
    console.error('Error fetching word-by-word:', error.message);
    res.status(500).json({ error: 'Failed to fetch word-by-word data' });
  }
});

// Get all words for a surah (for word-by-word mode)
app.get('/api/word-by-word/surah/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const { page = 1, per_page = 50 } = req.query;
    
    const response = await axios.get(`${QURAN_COM_API}/verses/by_chapter/${number}`, {
      params: {
        words: true,
        word_fields: 'text_uthmani,text_indopak',
        per_page: per_page,
        page: page
      }
    });
    
    const verses = response.data.verses.map(verse => ({
      verse_key: verse.verse_key,
      verse_number: verse.verse_number,
      words: verse.words.map(word => ({
        id: word.id,
        position: word.position,
        text_uthmani: word.text || word.text_uthmani || '',
        text_indopak: word.text || word.text_indopak || '',
        text_simple: word.text || '',
        translation: word.translation?.text || '',
        transliteration: word.transliteration?.text || '',
        audio_url: word.audio_url ? `https://audio.qurancdn.com/${word.audio_url}` : null,
        char_type: word.char_type_name
      }))
    }));
    
    res.json({
      code: 200,
      data: {
        verses: verses,
        pagination: response.data.pagination
      }
    });
  } catch (error) {
    console.error('Error fetching surah word-by-word:', error.message);
    res.status(500).json({ error: 'Failed to fetch word-by-word data' });
  }
});

app.get('/api/surahs', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/surah`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching surahs:', error.message);
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

app.get('/api/surah/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const { translation = 'en.asad', script = 'quran-uthmani', reciter = 'ar.alafasy' } = req.query;
    const [arabicRes, translationRes, audioRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${number}/${script}`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/${translation}`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/${reciter}`)
    ]);
    
    res.json({
      arabic: arabicRes.data,
      translation: translationRes.data,
      audio: audioRes.data
    });
  } catch (error) {
    console.error('Error fetching surah:', error.message);
    res.status(500).json({ error: 'Failed to fetch surah details' });
  }
});

app.get('/api/random-ayah', async (req, res) => {
  try {
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    
    // Fetch Arabic, English and Urdu translations in parallel
    const [arabicRes, englishRes, urduRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/quran-uthmani`),
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/en.asad`),
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/ur.jalandhry`)
    ]);
    
    const ayahCount = arabicRes.data.data.ayahs.length;
    const randomIndex = Math.floor(Math.random() * ayahCount);
    
    const arabicAyah = arabicRes.data.data.ayahs[randomIndex];
    const englishAyah = englishRes.data.data.ayahs[randomIndex];
    const urduAyah = urduRes.data.data.ayahs[randomIndex];
    
    res.json({
      data: {
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        juz: arabicAyah.juz,
        page: arabicAyah.page,
        arabic: arabicAyah.text,
        english: englishAyah.text,
        urdu: urduAyah.text,
        surah: {
          number: arabicRes.data.data.number,
          name: arabicRes.data.data.name,
          englishName: arabicRes.data.data.englishName,
          revelationType: arabicRes.data.data.revelationType
        }
      }
    });
  } catch (error) {
    console.error('Error fetching random ayah:', error.message);
    res.status(500).json({ error: 'Failed to fetch random ayah' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
    const response = await axios.get(`${QURAN_API_BASE}/search/${keyword}/all/en.asad`);
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      res.json({ code: 200, data: { count: 0, matches: [] } });
    } else {
      console.error('Error searching:', error.message);
      res.status(500).json({ error: 'Search failed' });
    }
  }
});

// Islamic Scholar AI Chatbot endpoint (streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: ISLAMIC_SCHOLAR_SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      stream: true,
      max_tokens: 2048,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Failed to get response' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Chat failed' });
    }
  }
});

// Stripe Donation Endpoints
app.get('/api/stripe/config', (req, res) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  res.json({ publishableKey: STRIPE_PUBLISHABLE_KEY });
});

app.post('/api/stripe/create-payment-intent', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { amount, firstName, lastName, donorEmail, city, country, message } = req.body;
    
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    if (!firstName || !lastName || !donorEmail) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const amountInCents = Math.round(amount * 100);
    const donorName = `${firstName} ${lastName}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        firstName: firstName,
        lastName: lastName,
        donorName: donorName,
        donorEmail: donorEmail,
        city: city || '',
        country: country || '',
        message: message || '',
        type: 'donation'
      },
      description: `Donation to QuranDeen.com from ${donorName}`
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment' });
  }
});

app.post('/api/stripe/create-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { amount, firstName, lastName, donorEmail, city, country, message } = req.body;
    
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    if (!firstName || !lastName || !donorEmail) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const amountInCents = Math.round(amount * 100);
    const donorName = `${firstName} ${lastName}`;

    let customer = await stripe.customers.list({ email: donorEmail, limit: 1 });
    if (customer.data.length > 0) {
      customer = customer.data[0];
    } else {
      customer = await stripe.customers.create({
        email: donorEmail,
        name: donorName,
        metadata: {
          source: 'QuranDeen Donation',
          firstName: firstName,
          lastName: lastName,
          donorName: donorName,
          donorEmail: donorEmail,
          city: city || '',
          country: country || '',
          message: message || ''
        }
      });
    }

    const product = await stripe.products.create({
      name: `QuranDeen Monthly Donation - $${amount}`,
      metadata: {
        type: 'recurring_donation'
      }
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amountInCents,
      currency: 'usd',
      recurring: {
        interval: 'month'
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: customer.id,
      setup_future_usage: 'off_session',
      metadata: {
        firstName: firstName,
        lastName: lastName,
        donorName: donorName,
        donorEmail: donorEmail,
        city: city || '',
        country: country || '',
        message: message || '',
        type: 'monthly_donation_initial',
        priceId: price.id
      },
      description: `QuranDeen Monthly Donation - $${amount}/month from ${donorName}`
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      priceId: price.id
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription' });
  }
});

app.post('/api/stripe/finalize-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { customerId, priceId, paymentMethodId } = req.body;
    
    if (!customerId || !priceId || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      metadata: { type: 'monthly_donation' }
    });

    res.json({ 
      subscriptionId: subscription.id,
      status: subscription.status
    });
  } catch (error) {
    console.error('Finalize subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to finalize subscription' });
  }
});

app.get('/api/stripe/payment-status/:paymentIntentId', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({ status: paymentIntent.status });
  } catch (error) {
    console.error('Stripe payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// Sync donations from Stripe (admin only)
app.post('/api/admin/sync-stripe-donations', authenticateToken, isAdmin, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  try {
    // Get payments from the last 7 days
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
    
    // Fetch successful payment intents
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: { gte: sevenDaysAgo }
    });

    // Fetch invoices (for subscriptions)
    const invoices = await stripe.invoices.list({
      limit: 100,
      created: { gte: sevenDaysAgo },
      status: 'paid'
    });

    let syncedCount = 0;

    // Process payment intents
    for (const pi of paymentIntents.data) {
      if (pi.status !== 'succeeded') continue;
      
      const metadata = pi.metadata || {};
      const amount = pi.amount / 100;
      
      // Check if already exists
      const existing = await pool.query(
        'SELECT id FROM donations WHERE stripe_payment_id = $1',
        [pi.id]
      );
      
      if (existing.rows.length === 0) {
        const donationType = metadata.type === 'monthly_donation_initial' ? 'monthly' : 'one_time';
        
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, stripe_customer_id, donor_name, donor_email, first_name, last_name, city, country, amount, currency, donation_type, status, message, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, to_timestamp($14))`,
          [
            pi.id,
            pi.customer,
            metadata.donorName || 'Anonymous',
            metadata.donorEmail || '',
            metadata.firstName || '',
            metadata.lastName || '',
            metadata.city || '',
            metadata.country || '',
            amount,
            pi.currency,
            donationType,
            'succeeded',
            metadata.message || '',
            pi.created
          ]
        );
        syncedCount++;
      }
    }

    // Process invoices
    for (const inv of invoices.data) {
      const amount = (inv.amount_paid || inv.total) / 100;
      
      // Check if already exists
      const existing = await pool.query(
        'SELECT id FROM donations WHERE stripe_payment_id = $1',
        [inv.id]
      );
      
      if (existing.rows.length === 0) {
        // Get customer metadata
        let customerDetails = {};
        if (inv.customer) {
          try {
            const customer = await stripe.customers.retrieve(inv.customer);
            customerDetails = customer.metadata || {};
          } catch (e) {}
        }
        
        await pool.query(
          `INSERT INTO donations (stripe_payment_id, stripe_customer_id, stripe_subscription_id, donor_name, donor_email, first_name, last_name, city, country, amount, currency, donation_type, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, to_timestamp($14))`,
          [
            inv.id,
            inv.customer,
            inv.subscription || null,
            customerDetails.donorName || inv.customer_name || 'Anonymous',
            inv.customer_email || '',
            customerDetails.firstName || '',
            customerDetails.lastName || '',
            customerDetails.city || '',
            customerDetails.country || '',
            amount,
            inv.currency,
            inv.subscription ? 'monthly' : 'one_time',
            'succeeded',
            inv.created
          ]
        );
        syncedCount++;
      }
    }

    res.json({ 
      success: true, 
      message: `Synced ${syncedCount} donations from Stripe`,
      synced: syncedCount
    });
  } catch (error) {
    console.error('Stripe sync error:', error);
    res.status(500).json({ error: 'Failed to sync donations from Stripe' });
  }
});

app.get('/api/admin/donations', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM donations ORDER BY created_at DESC LIMIT 100`
    );
    
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END), 0) as total_amount,
        COUNT(CASE WHEN donation_type = 'monthly' AND status = 'succeeded' THEN 1 END) as monthly_count,
        COUNT(CASE WHEN donation_type = 'one_time' AND status = 'succeeded' THEN 1 END) as onetime_count,
        COALESCE(SUM(CASE WHEN donation_type = 'monthly' AND status = 'succeeded' THEN amount ELSE 0 END), 0) as monthly_amount,
        COALESCE(SUM(CASE WHEN donation_type = 'one_time' AND status = 'succeeded' THEN amount ELSE 0 END), 0) as onetime_amount
      FROM donations
    `);

    res.json({ 
      data: result.rows,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Admin donations error:', error);
    res.status(500).json({ error: 'Failed to get donations' });
  }
});

app.get('/api/user/donations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM donations WHERE user_id = $1 OR donor_email = (SELECT email FROM users WHERE id = $1) ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (error) {
    console.error('User donations error:', error);
    res.status(500).json({ error: 'Failed to get donations' });
  }
});

app.get('/api/user/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userEmail = userResult.rows[0].email;

    const result = await pool.query(
      `SELECT DISTINCT ON (stripe_subscription_id) * FROM donations 
       WHERE (user_id = $1 OR donor_email = $2) 
       AND donation_type = 'monthly' 
       AND stripe_subscription_id IS NOT NULL 
       AND status != 'cancelled'
       ORDER BY stripe_subscription_id, created_at DESC`,
      [req.user.id, userEmail]
    );

    const subscriptions = await Promise.all(result.rows.map(async (row) => {
      if (stripe && row.stripe_subscription_id) {
        try {
          const sub = await stripe.subscriptions.retrieve(row.stripe_subscription_id);
          return {
            ...row,
            stripe_status: sub.status,
            current_period_end: sub.current_period_end,
            cancel_at_period_end: sub.cancel_at_period_end
          };
        } catch (e) {
          return { ...row, stripe_status: 'unknown' };
        }
      }
      return row;
    }));

    res.json({ data: subscriptions });
  } catch (error) {
    console.error('User subscriptions error:', error);
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

app.post('/api/user/subscriptions/:subscriptionId/cancel', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userEmail = userResult.rows[0].email;

    const donationResult = await pool.query(
      `SELECT * FROM donations 
       WHERE stripe_subscription_id = $1 
       AND (user_id = $2 OR donor_email = $3)`,
      [subscriptionId, req.user.id, userEmail]
    );

    if (donationResult.rows.length === 0) {
      return res.status(403).json({ error: 'Subscription not found or access denied' });
    }

    if (stripe) {
      await stripe.subscriptions.cancel(subscriptionId);
    }

    await pool.query(
      `UPDATE donations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE stripe_subscription_id = $1`,
      [subscriptionId]
    );

    await sendSubscriptionCancelledAdmin({
      donor_email: donationResult.rows[0].donor_email,
      amount: donationResult.rows[0].amount
    });

    res.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

app.get('/api/user/force-password-change', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT force_password_change FROM users WHERE id = $1', [req.user.id]);
    res.json({ forcePasswordChange: result.rows[0]?.force_password_change || false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check password status' });
  }
});

app.post('/api/user/complete-password-change', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, force_password_change = false WHERE id = $2',
      [hashedPassword, req.user.id]
    );
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.post('/api/admin/test-email', authenticateToken, isAdmin, async (req, res) => {
  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ error: 'Email address required' });
  }
  
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0;">QuranDeen Email Test</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Assalamu Alaikum!</p>
        <p>This is a test email from <strong>QuranDeen.com</strong>.</p>
        <p>If you received this email, your email service is configured correctly and working properly.</p>
        <p style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #1a5f3c;">
          <strong>Email Configuration:</strong><br>
          Server: ${process.env.SMTP_HOST}<br>
          Port: ${process.env.SMTP_PORT}<br>
          From: ${process.env.FROM_EMAIL}
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">QuranDeen.com - Spreading the Light of the Holy Quran</p>
      </div>
    </div>
  `;
  
  try {
    const result = await sendEmail(to, 'QuranDeen Email Test - Configuration Successful', html, 'This is a test email from QuranDeen.com. Your email service is configured correctly.');
    if (result) {
      res.json({ success: true, message: `Test email sent successfully to ${to}` });
    } else {
      res.status(500).json({ error: 'Email service not configured or failed to send' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message || 'Failed to send test email' });
  }
});

// ==========================================
// QURAN TEACHING PLATFORM API ROUTES
// ==========================================

// Get all teaching specialties
app.get('/api/teaching/specialties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teaching_specialties ORDER BY name');
    res.json({ specialties: result.rows });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ error: 'Failed to fetch specialties' });
  }
});

// Become a teacher - create teacher profile
app.post('/api/teacher/register', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if already a teacher
    const existing = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [userId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You already have a teacher profile' });
    }
    
    const { bio, headline, yearsExperience, hourlyRate, languages, specialties, timezone } = req.body;
    
    const result = await pool.query(`
      INSERT INTO teacher_profiles (user_id, bio, headline, years_experience, hourly_rate, languages, specialties, timezone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [userId, bio, headline, yearsExperience || 0, hourlyRate, languages || [], specialties || [], timezone || 'UTC']);
    
    // Update user role to teacher
    await pool.query("UPDATE users SET role = 'teacher' WHERE id = $1", [userId]);
    
    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    res.status(500).json({ error: 'Failed to create teacher profile' });
  }
});

// Get current user's teacher profile
app.get('/api/teacher/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tp.*, u.name, u.email, u.profile_image, u.country, u.city
      FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.user_id = $1
    `, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    // Get certificates
    const certs = await pool.query('SELECT * FROM teacher_certificates WHERE teacher_id = $1', [result.rows[0].id]);
    
    // Get class packages
    const packages = await pool.query('SELECT * FROM class_packages WHERE teacher_id = $1 AND is_active = true', [result.rows[0].id]);
    
    // Get availability
    const availability = await pool.query('SELECT * FROM teacher_availability WHERE teacher_id = $1 ORDER BY day_of_week, start_time', [result.rows[0].id]);
    
    res.json({ 
      profile: result.rows[0],
      certificates: certs.rows,
      packages: packages.rows,
      availability: availability.rows
    });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ error: 'Failed to fetch teacher profile' });
  }
});

// Update teacher profile
app.put('/api/teacher/profile', authenticateToken, async (req, res) => {
  try {
    const { bio, headline, yearsExperience, hourlyRate, languages, specialties, timezone, videoIntroUrl } = req.body;
    
    const result = await pool.query(`
      UPDATE teacher_profiles 
      SET bio = COALESCE($1, bio),
          headline = COALESCE($2, headline),
          years_experience = COALESCE($3, years_experience),
          hourly_rate = COALESCE($4, hourly_rate),
          languages = COALESCE($5, languages),
          specialties = COALESCE($6, specialties),
          timezone = COALESCE($7, timezone),
          video_intro_url = COALESCE($8, video_intro_url),
          updated_at = NOW()
      WHERE user_id = $9
      RETURNING *
    `, [bio, headline, yearsExperience, hourlyRate, languages, specialties, timezone, videoIntroUrl, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    res.status(500).json({ error: 'Failed to update teacher profile' });
  }
});

// Add certificate
app.post('/api/teacher/certificates', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const { title, issuer, issueDate, certificateUrl } = req.body;
    
    const result = await pool.query(`
      INSERT INTO teacher_certificates (teacher_id, title, issuer, issue_date, certificate_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [teacherProfile.rows[0].id, title, issuer, issueDate, certificateUrl]);
    
    res.json({ success: true, certificate: result.rows[0] });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
});

// Delete certificate
app.delete('/api/teacher/certificates/:id', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    await pool.query('DELETE FROM teacher_certificates WHERE id = $1 AND teacher_id = $2', [req.params.id, teacherProfile.rows[0].id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// Set teacher availability
app.post('/api/teacher/availability', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const { slots } = req.body; // Array of { dayOfWeek, startTime, endTime }
    const teacherId = teacherProfile.rows[0].id;
    
    // Clear existing availability and add new
    await pool.query('DELETE FROM teacher_availability WHERE teacher_id = $1', [teacherId]);
    
    for (const slot of slots) {
      await pool.query(`
        INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time)
        VALUES ($1, $2, $3, $4)
      `, [teacherId, slot.dayOfWeek, slot.startTime, slot.endTime]);
    }
    
    const result = await pool.query('SELECT * FROM teacher_availability WHERE teacher_id = $1 ORDER BY day_of_week, start_time', [teacherId]);
    res.json({ success: true, availability: result.rows });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ error: 'Failed to set availability' });
  }
});

// Create class package
app.post('/api/teacher/packages', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const { name, description, specialty, durationMinutes, sessionsCount, price, validityDays } = req.body;
    
    const result = await pool.query(`
      INSERT INTO class_packages (teacher_id, name, description, specialty, duration_minutes, sessions_count, price, validity_days)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [teacherProfile.rows[0].id, name, description, specialty, durationMinutes || 60, sessionsCount || 1, price, validityDays || 30]);
    
    res.json({ success: true, package: result.rows[0] });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// Update class package
app.put('/api/teacher/packages/:id', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const { name, description, specialty, durationMinutes, sessionsCount, price, validityDays, isActive } = req.body;
    
    const result = await pool.query(`
      UPDATE class_packages 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          specialty = COALESCE($3, specialty),
          duration_minutes = COALESCE($4, duration_minutes),
          sessions_count = COALESCE($5, sessions_count),
          price = COALESCE($6, price),
          validity_days = COALESCE($7, validity_days),
          is_active = COALESCE($8, is_active),
          updated_at = NOW()
      WHERE id = $9 AND teacher_id = $10
      RETURNING *
    `, [name, description, specialty, durationMinutes, sessionsCount, price, validityDays, isActive, req.params.id, teacherProfile.rows[0].id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    res.json({ success: true, package: result.rows[0] });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// Delete class package
app.delete('/api/teacher/packages/:id', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    await pool.query('DELETE FROM class_packages WHERE id = $1 AND teacher_id = $2', [req.params.id, teacherProfile.rows[0].id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// PUBLIC: Browse teachers with filters
app.get('/api/teachers', async (req, res) => {
  try {
    const { language, specialty, minPrice, maxPrice, country, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT tp.*, u.name, u.profile_image, u.country, u.city
      FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.is_active = true AND tp.is_verified = true
    `;
    const params = [];
    let paramIndex = 1;
    
    if (language) {
      query += ` AND $${paramIndex} = ANY(tp.languages)`;
      params.push(language);
      paramIndex++;
    }
    
    if (specialty) {
      query += ` AND $${paramIndex} = ANY(tp.specialties)`;
      params.push(specialty);
      paramIndex++;
    }
    
    if (minPrice) {
      query += ` AND tp.hourly_rate >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }
    
    if (maxPrice) {
      query += ` AND tp.hourly_rate <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }
    
    if (country) {
      query += ` AND LOWER(u.country) = LOWER($${paramIndex})`;
      params.push(country);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (LOWER(u.name) LIKE LOWER($${paramIndex}) OR LOWER(tp.headline) LIKE LOWER($${paramIndex}) OR LOWER(tp.bio) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Count total
    const countResult = await pool.query(`SELECT COUNT(*) FROM (${query}) AS filtered`, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Add ordering and pagination
    query += ` ORDER BY tp.average_rating DESC, tp.total_students DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      teachers: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// PUBLIC: Get single teacher profile
app.get('/api/teachers/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tp.*, u.name, u.profile_image, u.country, u.city
      FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.id = $1 AND tp.is_active = true
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Get certificates
    const certs = await pool.query('SELECT * FROM teacher_certificates WHERE teacher_id = $1 AND is_verified = true', [req.params.id]);
    
    // Get packages
    const packages = await pool.query('SELECT * FROM class_packages WHERE teacher_id = $1 AND is_active = true ORDER BY price', [req.params.id]);
    
    // Get availability
    const availability = await pool.query('SELECT * FROM teacher_availability WHERE teacher_id = $1 ORDER BY day_of_week, start_time', [req.params.id]);
    
    // Get reviews
    const reviews = await pool.query(`
      SELECT tr.*, u.name, u.profile_image
      FROM teacher_reviews tr
      JOIN users u ON tr.student_id = u.id
      WHERE tr.teacher_id = $1 AND tr.is_public = true
      ORDER BY tr.created_at DESC
      LIMIT 10
    `, [req.params.id]);
    
    res.json({
      teacher: result.rows[0],
      certificates: certs.rows,
      packages: packages.rows,
      availability: availability.rows,
      reviews: reviews.rows
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// ADMIN: Get pending teacher verifications
app.get('/api/admin/teachers/pending', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tp.*, u.name, u.email, u.profile_image, u.country
      FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.is_verified = false
      ORDER BY tp.created_at DESC
    `);
    
    // Get certificates for each teacher
    const teachers = await Promise.all(result.rows.map(async (teacher) => {
      const certs = await pool.query('SELECT * FROM teacher_certificates WHERE teacher_id = $1', [teacher.id]);
      return { ...teacher, certificates: certs.rows };
    }));
    
    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching pending teachers:', error);
    res.status(500).json({ error: 'Failed to fetch pending teachers' });
  }
});

// ADMIN: Verify teacher
app.post('/api/admin/teachers/:id/verify', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE teacher_profiles SET is_verified = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying teacher:', error);
    res.status(500).json({ error: 'Failed to verify teacher' });
  }
});

// ADMIN: Reject/unverify teacher
app.post('/api/admin/teachers/:id/reject', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE teacher_profiles SET is_verified = false, is_active = false WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting teacher:', error);
    res.status(500).json({ error: 'Failed to reject teacher' });
  }
});

// Teacher Dashboard Stats
app.get('/api/teacher/dashboard', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT * FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacherId = teacherProfile.rows[0].id;
    
    // Get upcoming bookings
    const upcomingBookings = await pool.query(`
      SELECT b.*, u.name as student_name, u.profile_image as student_image, cp.name as package_name
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      LEFT JOIN class_packages cp ON b.package_id = cp.id
      WHERE b.teacher_id = $1 AND b.scheduled_at > NOW() AND b.status = 'scheduled'
      ORDER BY b.scheduled_at
      LIMIT 10
    `, [teacherId]);
    
    // Get recent reviews
    const recentReviews = await pool.query(`
      SELECT tr.*, u.name, u.profile_image
      FROM teacher_reviews tr
      JOIN users u ON tr.student_id = u.id
      WHERE tr.teacher_id = $1
      ORDER BY tr.created_at DESC
      LIMIT 5
    `, [teacherId]);
    
    // Get earnings this month
    const monthlyEarnings = await pool.query(`
      SELECT COALESCE(SUM(teacher_amount), 0) as total
      FROM platform_payments
      WHERE teacher_id = $1 AND status = 'completed'
      AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `, [teacherId]);
    
    // Get total students (unique)
    const totalStudents = await pool.query(`
      SELECT COUNT(DISTINCT student_id) as count
      FROM student_subscriptions
      WHERE teacher_id = $1
    `, [teacherId]);
    
    res.json({
      profile: teacherProfile.rows[0],
      upcomingBookings: upcomingBookings.rows,
      recentReviews: recentReviews.rows,
      monthlyEarnings: parseFloat(monthlyEarnings.rows[0].total),
      totalStudents: parseInt(totalStudents.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Check if current user is a teacher
app.get('/api/teacher/check', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, is_verified, is_active FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    res.json({ 
      isTeacher: result.rows.length > 0,
      profile: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error checking teacher status:', error);
    res.status(500).json({ error: 'Failed to check teacher status' });
  }
});

// Student Dashboard Stats
app.get('/api/student/dashboard', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get upcoming classes
    const upcomingClasses = await pool.query(`
      SELECT b.*, tp.headline, u.name as teacher_name, u.profile_image as teacher_image, cp.name as package_name
      FROM bookings b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      LEFT JOIN class_packages cp ON b.package_id = cp.id
      WHERE b.student_id = $1 AND b.scheduled_at > NOW() AND b.status IN ('scheduled', 'confirmed')
      ORDER BY b.scheduled_at
      LIMIT 10
    `, [studentId]);
    
    // Get active subscriptions
    const activeSubscriptions = await pool.query(`
      SELECT ss.*, cp.name as package_name, cp.total_classes, u.name as teacher_name, u.profile_image as teacher_image
      FROM student_subscriptions ss
      JOIN class_packages cp ON ss.package_id = cp.id
      JOIN teacher_profiles tp ON ss.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      WHERE ss.student_id = $1 AND ss.status = 'active' AND ss.expires_at > NOW()
    `, [studentId]);
    
    // Get completed classes count
    const completedClasses = await pool.query(`
      SELECT COUNT(*) as count FROM bookings
      WHERE student_id = $1 AND status = 'completed'
    `, [studentId]);
    
    // Get reviews given count
    const reviewsGiven = await pool.query(`
      SELECT COUNT(*) as count FROM teacher_reviews
      WHERE student_id = $1
    `, [studentId]);
    
    // Get payment history
    const payments = await pool.query(`
      SELECT pp.*, u.name as teacher_name
      FROM platform_payments pp
      JOIN teacher_profiles tp ON pp.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      WHERE pp.student_id = $1
      ORDER BY pp.created_at DESC
      LIMIT 20
    `, [studentId]);
    
    // Get conversations
    const conversations = await pool.query(`
      SELECT DISTINCT ON (m.teacher_id) m.teacher_id, u.name as teacher_name, u.profile_image as teacher_image,
             m.content as last_message, m.created_at as last_message_at,
             (SELECT COUNT(*) FROM messages WHERE teacher_id = m.teacher_id AND student_id = $1 AND sender_type = 'teacher' AND is_read = false) as unread_count
      FROM messages m
      JOIN teacher_profiles tp ON m.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      WHERE m.student_id = $1
      ORDER BY m.teacher_id, m.created_at DESC
    `, [studentId]);
    
    res.json({
      upcomingClasses: upcomingClasses.rows,
      activeSubscriptions: activeSubscriptions.rows,
      completedClasses: parseInt(completedClasses.rows[0].count),
      reviewsGiven: parseInt(reviewsGiven.rows[0].count),
      payments: payments.rows,
      conversations: conversations.rows
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Book a class
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { teacherId, packageId, scheduledAt, notes } = req.body;
    const studentId = req.user.id;
    
    // Verify teacher exists
    const teacher = await pool.query('SELECT id, hourly_rate FROM teacher_profiles WHERE id = $1 AND is_active = true', [teacherId]);
    if (teacher.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Create booking
    const result = await pool.query(`
      INSERT INTO bookings (teacher_id, student_id, package_id, scheduled_at, notes, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [teacherId, studentId, packageId || null, scheduledAt, notes || '']);
    
    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Create payment intent for class booking
app.post('/api/payments/create-intent', authenticateToken, async (req, res) => {
  try {
    if (!stripe || !STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: 'Payment processing is not available. Please contact support.' });
    }
    
    const { teacherId, packageId, scheduledAt } = req.body;
    const studentId = req.user.id;
    
    // Pre-validate availability if scheduledAt is provided
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      const dayOfWeek = scheduledDate.getDay();
      const scheduledTime = scheduledDate.toTimeString().slice(0, 5);
      
      const availabilityCheck = await pool.query(`
        SELECT id FROM teacher_availability 
        WHERE teacher_id = $1 AND day_of_week = $2 AND is_available = true
        AND start_time <= $3 AND end_time > $3
      `, [teacherId, dayOfWeek, scheduledTime]);
      
      if (availabilityCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Selected time slot is not available' });
      }
      
      // Check for existing bookings
      const existingBooking = await pool.query(`
        SELECT id FROM bookings 
        WHERE teacher_id = $1 AND scheduled_at = $2 
        AND status IN ('scheduled', 'confirmed', 'pending')
      `, [teacherId, scheduledAt]);
      
      if (existingBooking.rows.length > 0) {
        return res.status(400).json({ error: 'This time slot is already booked' });
      }
    }
    
    // Get teacher info
    const teacher = await pool.query(`
      SELECT tp.*, u.name, u.email FROM teacher_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE tp.id = $1
    `, [teacherId]);
    
    if (teacher.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    let amount;
    let description;
    
    if (packageId) {
      // Get package price
      const pkg = await pool.query('SELECT * FROM class_packages WHERE id = $1 AND teacher_id = $2', [packageId, teacherId]);
      if (pkg.rows.length === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }
      amount = Math.round(pkg.rows[0].price * 100);
      description = `${pkg.rows[0].name} - ${pkg.rows[0].total_classes} classes with ${teacher.rows[0].name}`;
    } else {
      // Single session at hourly rate
      amount = Math.round(teacher.rows[0].hourly_rate * 100);
      description = `Single session with ${teacher.rows[0].name}`;
    }
    
    // Calculate commission split (20% platform, 80% teacher)
    const platformAmount = Math.round(amount * 0.20);
    const teacherAmount = amount - platformAmount;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        studentId: studentId.toString(),
        teacherId: teacherId.toString(),
        packageId: packageId?.toString() || '',
        bookingId: bookingId?.toString() || '',
        platformAmount: platformAmount.toString(),
        teacherAmount: teacherAmount.toString()
      },
      description
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100,
      platformFee: platformAmount / 100,
      teacherEarnings: teacherAmount / 100
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Confirm payment and create booking record
app.post('/api/payments/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, teacherId, packageId, scheduledAt, notes } = req.body;
    const studentId = req.user.id;
    
    // Verify payment with Stripe
    if (!stripe) {
      return res.status(500).json({ error: 'Payment processing not configured' });
    }
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    
    const amount = paymentIntent.amount / 100;
    const platformAmount = parseFloat(paymentIntent.metadata.platformAmount) / 100;
    const teacherAmount = parseFloat(paymentIntent.metadata.teacherAmount) / 100;
    
    // Start transaction with locking to prevent race conditions
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create booking if scheduledAt provided (with locking)
      let bookingId = null;
      if (scheduledAt) {
        const scheduledDate = new Date(scheduledAt);
        const dayOfWeek = scheduledDate.getDay();
        const scheduledTime = scheduledDate.toTimeString().slice(0, 5);
        
        // Check availability within transaction
        const availabilityCheck = await client.query(`
          SELECT id FROM teacher_availability 
          WHERE teacher_id = $1 AND day_of_week = $2 AND is_available = true
          AND start_time <= $3 AND end_time > $3
        `, [teacherId, dayOfWeek, scheduledTime]);
        
        if (availabilityCheck.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'Selected time slot is not available' });
        }
        
        // Check for existing bookings with FOR UPDATE to lock the row
        const existingBooking = await client.query(`
          SELECT id FROM bookings 
          WHERE teacher_id = $1 AND scheduled_at = $2 
          AND status IN ('scheduled', 'confirmed', 'pending')
          FOR UPDATE NOWAIT
        `, [teacherId, scheduledAt]);
        
        if (existingBooking.rows.length > 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'This time slot is already booked' });
        }
        
        const bookingResult = await client.query(`
          INSERT INTO bookings (teacher_id, student_id, package_id, scheduled_at, notes, status)
          VALUES ($1, $2, $3, $4, $5, 'scheduled')
          RETURNING id
        `, [teacherId, studentId, packageId || null, scheduledAt, notes || '']);
        bookingId = bookingResult.rows[0].id;
      }
      
      // If it's a package, create subscription
      if (packageId) {
        const pkg = await client.query('SELECT * FROM class_packages WHERE id = $1', [packageId]);
        if (pkg.rows.length === 0) {
          throw new Error('Package not found');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (pkg.rows[0].validity_days || 30));
        
        await client.query(`
          INSERT INTO student_subscriptions (student_id, teacher_id, package_id, classes_used, status, expires_at, stripe_subscription_id)
          VALUES ($1, $2, $3, 0, 'active', $4, $5)
        `, [studentId, teacherId, packageId, expiresAt, paymentIntentId]);
      }
      
      // Record payment with commission split
      await client.query(`
        INSERT INTO platform_payments (
          teacher_id, student_id, booking_id, stripe_payment_id,
          amount, platform_amount, teacher_amount, status, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', $8)
      `, [teacherId, studentId, bookingId, paymentIntentId, amount, platformAmount, teacherAmount, 
          packageId ? 'Package purchase' : 'Single session']);
      
      await client.query('COMMIT');
      
      res.json({ success: true, bookingId });
    } catch (err) {
      await client.query('ROLLBACK');
      
      // Check for unique constraint violation (duplicate booking)
      if (err.code === '23505' && err.constraint === 'bookings_teacher_scheduled_unique') {
        // Attempt to refund the payment since slot is no longer available
        try {
          await stripe.refunds.create({ payment_intent: paymentIntentId });
          console.log('Refund initiated for duplicate booking attempt:', paymentIntentId);
        } catch (refundErr) {
          console.error('Refund failed for payment:', paymentIntentId, refundErr);
        }
        return res.status(409).json({ 
          error: 'This time slot was just booked by someone else. Your payment will be refunded.',
          refunded: true
        });
      }
      
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment. Please contact support.' });
  }
});

// Get payment history for student
app.get('/api/student/payments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pp.*, u.name as teacher_name
      FROM platform_payments pp
      JOIN teacher_profiles tp ON pp.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      WHERE pp.student_id = $1
      ORDER BY pp.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get teacher earnings
app.get('/api/teacher/earnings', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    
    const teacherId = teacherProfile.rows[0].id;
    
    // Get earnings summary
    const [totalEarnings, monthlyEarnings, pendingEarnings, recentPayments] = await Promise.all([
      pool.query(`
        SELECT COALESCE(SUM(teacher_amount), 0) as total
        FROM platform_payments WHERE teacher_id = $1 AND status = 'completed'
      `, [teacherId]),
      pool.query(`
        SELECT COALESCE(SUM(teacher_amount), 0) as total
        FROM platform_payments 
        WHERE teacher_id = $1 AND status = 'completed'
        AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `, [teacherId]),
      pool.query(`
        SELECT COALESCE(SUM(teacher_amount), 0) as total
        FROM platform_payments WHERE teacher_id = $1 AND status = 'pending'
      `, [teacherId]),
      pool.query(`
        SELECT pp.*, u.name as student_name
        FROM platform_payments pp
        JOIN users u ON pp.student_id = u.id
        WHERE pp.teacher_id = $1
        ORDER BY pp.created_at DESC
        LIMIT 20
      `, [teacherId])
    ]);
    
    res.json({
      totalEarnings: parseFloat(totalEarnings.rows[0].total),
      monthlyEarnings: parseFloat(monthlyEarnings.rows[0].total),
      pendingEarnings: parseFloat(pendingEarnings.rows[0].total),
      recentPayments: recentPayments.rows
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// Get student's bookings
app.get('/api/student/bookings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, tp.headline, u.name as teacher_name, u.profile_image as teacher_image, cp.name as package_name
      FROM bookings b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      JOIN users u ON tp.user_id = u.id
      LEFT JOIN class_packages cp ON b.package_id = cp.id
      WHERE b.student_id = $1
      ORDER BY b.scheduled_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel a booking
app.put('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE bookings SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND student_id = $2 AND status IN ('pending', 'scheduled')
      RETURNING *
    `, [req.params.id, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    }
    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get teacher's availability for booking
app.get('/api/teachers/:id/availability', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM teacher_availability
      WHERE teacher_id = $1 AND is_available = true
      ORDER BY day_of_week, start_time
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Submit a review for a teacher
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { teacherId, bookingId, rating, comment } = req.body;
    const studentId = req.user.id;
    
    // Verify the student had a completed booking with this teacher
    const booking = await pool.query(`
      SELECT id FROM bookings 
      WHERE id = $1 AND student_id = $2 AND teacher_id = $3 AND status = 'completed'
    `, [bookingId, studentId, teacherId]);
    
    if (booking.rows.length === 0) {
      return res.status(400).json({ error: 'You can only review teachers after completing a class' });
    }
    
    // Check if already reviewed this booking
    const existingReview = await pool.query(
      'SELECT id FROM teacher_reviews WHERE booking_id = $1',
      [bookingId]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this class' });
    }
    
    // Create review
    const result = await pool.query(`
      INSERT INTO teacher_reviews (teacher_id, student_id, booking_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [teacherId, studentId, bookingId, rating, comment || '']);
    
    // Update teacher's average rating
    await pool.query(`
      UPDATE teacher_profiles 
      SET rating = (SELECT AVG(rating) FROM teacher_reviews WHERE teacher_id = $1),
          total_reviews = (SELECT COUNT(*) FROM teacher_reviews WHERE teacher_id = $1)
      WHERE id = $1
    `, [teacherId]);
    
    res.json({ success: true, review: result.rows[0] });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get reviews for a teacher
app.get('/api/teachers/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      pool.query(`
        SELECT tr.*, u.name, u.profile_image
        FROM teacher_reviews tr
        JOIN users u ON tr.student_id = u.id
        WHERE tr.teacher_id = $1
        ORDER BY tr.created_at DESC
        LIMIT $2 OFFSET $3
      `, [req.params.id, limit, offset]),
      pool.query('SELECT COUNT(*) FROM teacher_reviews WHERE teacher_id = $1', [req.params.id])
    ]);
    
    res.json({
      reviews: reviews.rows,
      total: parseInt(total.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(total.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Teacher accepts/confirms a booking
app.put('/api/teacher/bookings/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(403).json({ error: 'Not a teacher' });
    }
    
    const result = await pool.query(`
      UPDATE bookings SET status = 'scheduled', updated_at = NOW()
      WHERE id = $1 AND teacher_id = $2 AND status = 'pending'
      RETURNING *
    `, [req.params.id, teacherProfile.rows[0].id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

// Teacher marks a class as completed
app.put('/api/teacher/bookings/:id/complete', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(403).json({ error: 'Not a teacher' });
    }
    
    const result = await pool.query(`
      UPDATE bookings SET status = 'completed', completed_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND teacher_id = $2 AND status = 'scheduled'
      RETURNING *
    `, [req.params.id, teacherProfile.rows[0].id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // If booking uses a subscription, increment classes_used
    if (result.rows[0].package_id) {
      await pool.query(`
        UPDATE student_subscriptions 
        SET classes_used = classes_used + 1
        WHERE student_id = $1 AND teacher_id = $2 AND package_id = $3 AND status = 'active'
      `, [result.rows[0].student_id, teacherProfile.rows[0].id, result.rows[0].package_id]);
    }
    
    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({ error: 'Failed to complete booking' });
  }
});

// Get teacher's pending and upcoming bookings
app.get('/api/teacher/bookings', authenticateToken, async (req, res) => {
  try {
    const teacherProfile = await pool.query('SELECT id FROM teacher_profiles WHERE user_id = $1', [req.user.id]);
    if (teacherProfile.rows.length === 0) {
      return res.status(403).json({ error: 'Not a teacher' });
    }
    
    const result = await pool.query(`
      SELECT b.*, u.name as student_name, u.profile_image as student_image, cp.name as package_name
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      LEFT JOIN class_packages cp ON b.package_id = cp.id
      WHERE b.teacher_id = $1 AND b.status IN ('pending', 'scheduled')
      ORDER BY b.scheduled_at
    `, [teacherProfile.rows[0].id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ==========================================
// END QURAN TEACHING PLATFORM API ROUTES
// ==========================================

const surahSlugs = [
  '1-al-fatihah', '2-al-baqarah', '3-aali-imran', '4-an-nisa', '5-al-maidah', '6-al-anam', '7-al-araf', '8-al-anfal', '9-at-tawbah', '10-yunus',
  '11-hud', '12-yusuf', '13-ar-rad', '14-ibrahim', '15-al-hijr', '16-an-nahl', '17-al-isra', '18-al-kahf', '19-maryam', '20-ta-ha',
  '21-al-anbiya', '22-al-hajj', '23-al-muminun', '24-an-nur', '25-al-furqan', '26-ash-shuara', '27-an-naml', '28-al-qasas', '29-al-ankabut', '30-ar-rum',
  '31-luqman', '32-as-sajdah', '33-al-ahzab', '34-saba', '35-fatir', '36-ya-sin', '37-as-saffat', '38-sad', '39-az-zumar', '40-ghafir',
  '41-fussilat', '42-ash-shura', '43-az-zukhruf', '44-ad-dukhan', '45-al-jathiyah', '46-al-ahqaf', '47-muhammad', '48-al-fath', '49-al-hujurat', '50-qaf',
  '51-adh-dhariyat', '52-at-tur', '53-an-najm', '54-al-qamar', '55-ar-rahman', '56-al-waqiah', '57-al-hadid', '58-al-mujadila', '59-al-hashr', '60-al-mumtahanah',
  '61-as-saff', '62-al-jumuah', '63-al-munafiqun', '64-at-taghabun', '65-at-talaq', '66-at-tahrim', '67-al-mulk', '68-al-qalam', '69-al-haqqah', '70-al-maarij',
  '71-nuh', '72-al-jinn', '73-al-muzzammil', '74-al-muddaththir', '75-al-qiyamah', '76-al-insan', '77-al-mursalat', '78-an-naba', '79-an-naziat', '80-abasa',
  '81-at-takwir', '82-al-infitar', '83-al-mutaffifin', '84-al-inshiqaq', '85-al-buruj', '86-at-tariq', '87-al-ala', '88-al-ghashiyah', '89-al-fajr', '90-al-balad',
  '91-ash-shams', '92-al-layl', '93-ad-duhaa', '94-ash-sharh', '95-at-tin', '96-al-alaq', '97-al-qadr', '98-al-bayyinah', '99-az-zalzalah', '100-al-adiyat',
  '101-al-qariah', '102-at-takathur', '103-al-asr', '104-al-humazah', '105-al-fil', '106-quraysh', '107-al-maun', '108-al-kawthar', '109-al-kafirun', '110-an-nasr',
  '111-al-masad', '112-al-ikhlas', '113-al-falaq', '114-an-nas'
];

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://qurandeen.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/quran-juz-browser</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/quran-mp3-audio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-ai-scholar</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/share-card</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/verse-of-day</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/hijri-converter</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/adhkar</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/names-of-allah</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/islamic-resources/hadith-of-day</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/donate</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

  surahSlugs.forEach((slug, index) => {
    sitemap += `
  <url>
    <loc>${baseUrl}/surah/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /

Sitemap: https://qurandeen.com/sitemap.xml

Disallow: /api/
Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

const oldSlugsMap = {
  'al-fatihah': '1-al-fatihah', 'al-baqarah': '2-al-baqarah', 'aali-imran': '3-aali-imran', 
  'an-nisa': '4-an-nisa', 'al-maidah': '5-al-maidah', 'al-anam': '6-al-anam', 
  'al-araf': '7-al-araf', 'al-anfal': '8-al-anfal', 'at-tawbah': '9-at-tawbah', 
  'yunus': '10-yunus', 'hud': '11-hud', 'yusuf': '12-yusuf', 'ar-rad': '13-ar-rad', 
  'ibrahim': '14-ibrahim', 'al-hijr': '15-al-hijr', 'an-nahl': '16-an-nahl', 
  'al-isra': '17-al-isra', 'al-kahf': '18-al-kahf', 'maryam': '19-maryam', 
  'ta-ha': '20-ta-ha', 'al-anbiya': '21-al-anbiya', 'al-hajj': '22-al-hajj', 
  'al-muminun': '23-al-muminun', 'an-nur': '24-an-nur', 'al-furqan': '25-al-furqan', 
  'ash-shuara': '26-ash-shuara', 'an-naml': '27-an-naml', 'al-qasas': '28-al-qasas', 
  'al-ankabut': '29-al-ankabut', 'ar-rum': '30-ar-rum', 'luqman': '31-luqman', 
  'as-sajdah': '32-as-sajdah', 'al-ahzab': '33-al-ahzab', 'saba': '34-saba', 
  'fatir': '35-fatir', 'ya-sin': '36-ya-sin', 'as-saffat': '37-as-saffat', 
  'sad': '38-sad', 'az-zumar': '39-az-zumar', 'ghafir': '40-ghafir', 
  'fussilat': '41-fussilat', 'ash-shura': '42-ash-shura', 'az-zukhruf': '43-az-zukhruf', 
  'ad-dukhan': '44-ad-dukhan', 'al-jathiyah': '45-al-jathiyah', 'al-ahqaf': '46-al-ahqaf', 
  'muhammad': '47-muhammad', 'al-fath': '48-al-fath', 'al-hujurat': '49-al-hujurat', 
  'qaf': '50-qaf', 'adh-dhariyat': '51-adh-dhariyat', 'at-tur': '52-at-tur', 
  'an-najm': '53-an-najm', 'al-qamar': '54-al-qamar', 'ar-rahman': '55-ar-rahman', 
  'al-waqiah': '56-al-waqiah', 'al-hadid': '57-al-hadid', 'al-mujadila': '58-al-mujadila', 
  'al-hashr': '59-al-hashr', 'al-mumtahanah': '60-al-mumtahanah', 'as-saff': '61-as-saff', 
  'al-jumuah': '62-al-jumuah', 'al-munafiqun': '63-al-munafiqun', 'at-taghabun': '64-at-taghabun', 
  'at-talaq': '65-at-talaq', 'at-tahrim': '66-at-tahrim', 'al-mulk': '67-al-mulk', 
  'al-qalam': '68-al-qalam', 'al-haqqah': '69-al-haqqah', 'al-maarij': '70-al-maarij', 
  'nuh': '71-nuh', 'al-jinn': '72-al-jinn', 'al-muzzammil': '73-al-muzzammil', 
  'al-muddaththir': '74-al-muddaththir', 'al-qiyamah': '75-al-qiyamah', 'al-insan': '76-al-insan', 
  'al-mursalat': '77-al-mursalat', 'an-naba': '78-an-naba', 'an-naziat': '79-an-naziat', 
  'abasa': '80-abasa', 'at-takwir': '81-at-takwir', 'al-infitar': '82-al-infitar', 
  'al-mutaffifin': '83-al-mutaffifin', 'al-inshiqaq': '84-al-inshiqaq', 'al-buruj': '85-al-buruj', 
  'at-tariq': '86-at-tariq', 'al-ala': '87-al-ala', 'al-ghashiyah': '88-al-ghashiyah', 
  'al-fajr': '89-al-fajr', 'al-balad': '90-al-balad', 'ash-shams': '91-ash-shams', 
  'al-layl': '92-al-layl', 'ad-duhaa': '93-ad-duhaa', 'ash-sharh': '94-ash-sharh', 
  'at-tin': '95-at-tin', 'al-alaq': '96-al-alaq', 'al-qadr': '97-al-qadr', 
  'al-bayyinah': '98-al-bayyinah', 'az-zalzalah': '99-az-zalzalah', 'al-adiyat': '100-al-adiyat', 
  'al-qariah': '101-al-qariah', 'at-takathur': '102-at-takathur', 'al-asr': '103-al-asr', 
  'al-humazah': '104-al-humazah', 'al-fil': '105-al-fil', 'quraysh': '106-quraysh', 
  'al-maun': '107-al-maun', 'al-kawthar': '108-al-kawthar', 'al-kafirun': '109-al-kafirun', 
  'an-nasr': '110-an-nasr', 'al-masad': '111-al-masad', 'al-ikhlas': '112-al-ikhlas', 
  'al-falaq': '113-al-falaq', 'an-nas': '114-an-nas'
};

app.get('/surah/:identifier', (req, res, next) => {
  const identifier = req.params.identifier.toLowerCase();
  
  if (oldSlugsMap[identifier]) {
    return res.redirect(301, `/surah/${oldSlugsMap[identifier]}`);
  }
  
  if (/^\d+$/.test(identifier)) {
    const num = parseInt(identifier);
    if (num >= 1 && num <= 114) {
      const canonicalSlug = surahSlugs[num - 1];
      return res.redirect(301, `/surah/${canonicalSlug}`);
    }
  }
  
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
