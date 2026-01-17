import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qurandeen.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@qurandeen.com';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
  console.log('Email service configured with host:', SMTP_HOST, 'port:', SMTP_PORT);
} else {
  console.log('Email service not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable emails.');
}

async function sendEmail(to, subject, html, text) {
  if (!transporter) {
    console.log('Email not sent (not configured):', { to, subject });
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"QuranDeen" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text
    });
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return false;
  }
}

async function sendDonationReceipt(donation) {
  const { donor_email, first_name, last_name, amount, donation_type, created_at } = donation;
  if (!donor_email) return false;

  const donorName = `${first_name || ''} ${last_name || ''}`.trim() || 'Donor';
  const date = new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isMonthly = donation_type === 'monthly';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .amount { font-size: 32px; font-weight: bold; color: #1a5f3c; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        .verse { background: #f0f7f4; padding: 20px; border-left: 4px solid #1a5f3c; margin: 20px 0; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JazakAllah Khair!</h1>
          <p>Thank you for your generous donation</p>
        </div>
        <div class="content">
          <p>Dear ${donorName},</p>
          <p>We are deeply grateful for your ${isMonthly ? 'monthly' : ''} donation to QuranDeen.com.</p>
          
          <div class="amount">$${parseFloat(amount).toFixed(2)}${isMonthly ? '/month' : ''}</div>
          
          <div class="details">
            <p><strong>Receipt Details:</strong></p>
            <p>Date: ${date}</p>
            <p>Type: ${isMonthly ? 'Monthly Recurring' : 'One-Time Donation'}</p>
            <p>Donor: ${donorName}</p>
          </div>
          
          ${isMonthly ? '<p>Your monthly donation will continue until you choose to cancel. You can manage your subscription from your dashboard.</p>' : ''}
          
          <div class="verse">
            <p>"The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains."</p>
            <p>— Surah Al-Baqarah (2:261)</p>
          </div>
          
          <p>May Allah reward you abundantly for your generosity.</p>
          
          <div class="footer">
            <p>QuranDeen.com - Spreading the Light of the Holy Quran</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `JazakAllah Khair!\n\nDear ${donorName},\n\nThank you for your ${isMonthly ? 'monthly' : ''} donation of $${parseFloat(amount).toFixed(2)} to QuranDeen.com.\n\nDate: ${date}\nType: ${isMonthly ? 'Monthly Recurring' : 'One-Time'}\n\nMay Allah reward you abundantly.\n\nQuranDeen.com`;

  return sendEmail(donor_email, 'Thank You for Your Donation - QuranDeen', html, text);
}

async function sendNewAccountEmail(email, password, firstName) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #1a5f3c; }
        .warning { color: #dc3545; font-weight: bold; }
        .button { display: inline-block; background: #1a5f3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to QuranDeen!</h1>
          <p>Your account has been created</p>
        </div>
        <div class="content">
          <p>Assalamu Alaikum ${firstName || 'Dear Donor'},</p>
          <p>An account has been created for you on QuranDeen.com to manage your donations and access exclusive features.</p>
          
          <div class="credentials">
            <p><strong>Your Login Credentials:</strong></p>
            <p>Email: ${email}</p>
            <p>Temporary Password: <code>${password}</code></p>
          </div>
          
          <p class="warning">Please change your password after logging in for security.</p>
          
          <p>With your account, you can:</p>
          <ul>
            <li>View your donation history</li>
            <li>Manage recurring donations</li>
            <li>Save bookmarks and reading progress</li>
            <li>Access personalized features</li>
          </ul>
          
          <a href="https://qurandeen.com/login" class="button">Login to Your Account</a>
          
          <p>JazakAllah Khair for supporting QuranDeen!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Welcome to QuranDeen!\n\nAssalamu Alaikum ${firstName || 'Dear Donor'},\n\nYour account has been created.\n\nEmail: ${email}\nTemporary Password: ${password}\n\nPlease login and change your password.\n\nQuranDeen.com`;

  return sendEmail(email, 'Your QuranDeen Account Has Been Created', html, text);
}

async function sendAdminNotification(donation) {
  const { first_name, last_name, donor_email, amount, donation_type, city, country, message } = donation;
  const donorName = `${first_name || ''} ${last_name || ''}`.trim() || 'Anonymous';

  const html = `
    <h2>New Donation Received!</h2>
    <p><strong>Amount:</strong> $${parseFloat(amount).toFixed(2)}${donation_type === 'monthly' ? '/month (Recurring)' : ' (One-Time)'}</p>
    <p><strong>Donor:</strong> ${donorName}</p>
    <p><strong>Email:</strong> ${donor_email || 'Not provided'}</p>
    <p><strong>Location:</strong> ${city || '-'}, ${country || '-'}</p>
    ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
    <p><a href="https://qurandeen.com/admin">View Admin Dashboard</a></p>
  `;

  const text = `New Donation: $${parseFloat(amount).toFixed(2)} from ${donorName} (${donor_email})`;

  return sendEmail(ADMIN_EMAIL, `New ${donation_type === 'monthly' ? 'Monthly' : 'One-Time'} Donation: $${parseFloat(amount).toFixed(2)}`, html, text);
}

async function sendSubscriptionCancelledAdmin(subscription) {
  const html = `
    <h2>Subscription Cancelled</h2>
    <p>A monthly donation subscription has been cancelled.</p>
    <p><strong>Email:</strong> ${subscription.donor_email}</p>
    <p><strong>Amount:</strong> $${parseFloat(subscription.amount).toFixed(2)}/month</p>
    <p><a href="https://qurandeen.com/admin">View Admin Dashboard</a></p>
  `;

  return sendEmail(ADMIN_EMAIL, 'Subscription Cancelled', html, html);
}

async function sendPasswordResetEmail(email, resetToken, firstName) {
  const resetLink = `https://qurandeen.com/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Assalamu Alaikum ${firstName || 'Dear User'},</p>
          
          <p>We received a request to reset the password for your QuranDeen account. Click the button below to set a new password:</p>
          
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Your Password</a>
          </p>
          
          <div class="warning">
            <strong>Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email - your account is safe.
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1a5f3c;">${resetLink}</p>
          
          <div class="footer">
            <p>QuranDeen.com - Read, Listen & Learn the Holy Quran</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Password Reset Request\n\nAssalamu Alaikum ${firstName || 'Dear User'},\n\nWe received a request to reset your password. Visit this link to reset it:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nQuranDeen.com`;

  return sendEmail(email, 'Reset Your QuranDeen Password', html, text);
}

async function sendAdminPasswordChangeNotification(email, firstName, newPassword) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .password { font-size: 24px; font-weight: bold; color: #1a5f3c; font-family: monospace; }
        .button { display: inline-block; background: linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Password Has Been Changed</h1>
        </div>
        <div class="content">
          <p>Assalamu Alaikum ${firstName || 'Dear User'},</p>
          
          <p>Your QuranDeen account password has been changed by an administrator. Here is your new password:</p>
          
          <div class="credentials">
            <p class="password">${newPassword}</p>
          </div>
          
          <p>Please login with this new password and change it to something you can remember.</p>
          
          <p style="text-align: center;">
            <a href="https://qurandeen.com/login" class="button">Login Now</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Your Password Has Been Changed\n\nYour QuranDeen password has been changed by an administrator.\n\nNew Password: ${newPassword}\n\nPlease login and change it.\n\nQuranDeen.com`;

  return sendEmail(email, 'Your QuranDeen Password Has Been Changed', html, text);
}

export {
  sendEmail,
  sendDonationReceipt,
  sendNewAccountEmail,
  sendAdminNotification,
  sendSubscriptionCancelledAdmin,
  sendPasswordResetEmail,
  sendAdminPasswordChangeNotification
};
