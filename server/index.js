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
app.use(express.json());
app.use(cookieParser());

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
  
  const { code, error, state } = req.query;
  const storedState = req.cookies.oauth_state;
  
  console.log('OAuth callback - has code:', !!code, 'has state:', !!state, 'has stored state:', !!storedState);
  
  res.clearCookie('oauth_state');
  
  if (!storedState) {
    console.log('Warning: No stored OAuth state cookie found, proceeding without state validation');
  } else if (!state || state !== storedState) {
    console.log('OAuth state validation failed - state:', state, 'storedState:', storedState);
    return res.redirect('/login?error=google_invalid_state');
  }
  
  if (error) {
    console.log('OAuth error from Google:', error);
    return res.redirect('/login?error=google_cancelled');
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
    res.redirect('/login?error=google_failed');
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

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
