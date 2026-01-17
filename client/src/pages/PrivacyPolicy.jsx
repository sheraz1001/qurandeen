import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './legal.css';

function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - QuranDeen.com';
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = 'January 17, 2026';

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to QuranDeen.com ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you visit our website and use 
              our services.
            </p>
            <p>
              By accessing or using QuranDeen.com, you agree to the terms of this Privacy Policy. If you 
              do not agree with the practices described herein, please do not use our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>When you create an account or interact with our services, we may collect:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password (encrypted), city, and country</li>
              <li><strong>Authentication Data:</strong> Google account information if you choose to sign in with Google</li>
              <li><strong>Profile Information:</strong> Any additional information you choose to provide</li>
            </ul>

            <h3>2.2 Usage Information</h3>
            <p>We automatically collect certain information when you use our services:</p>
            <ul>
              <li><strong>Reading Progress:</strong> Surahs you have read or completed</li>
              <li><strong>Bookmarks:</strong> Ayahs you have saved for later reference</li>
              <li><strong>Preferences:</strong> Language settings, font preferences, selected reciters, and display options</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, pages viewed, and referring URLs</li>
            </ul>

            <h3>2.3 Cookies and Local Storage</h3>
            <p>We use cookies and browser local storage to:</p>
            <ul>
              <li>Remember your preferences (dark mode, font size, selected reciter)</li>
              <li>Maintain your session and authentication status</li>
              <li>Store bookmarks and reading history locally on your device</li>
              <li>Improve website performance and user experience</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our Quran reading and learning platform</li>
              <li><strong>Personalization:</strong> To customize your experience based on your preferences and reading history</li>
              <li><strong>Account Management:</strong> To create and manage your user account</li>
              <li><strong>Communication:</strong> To respond to your inquiries and provide customer support</li>
              <li><strong>Security:</strong> To protect against unauthorized access and ensure the safety of our platform</li>
              <li><strong>Analytics:</strong> To understand how users interact with our services and improve functionality</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website (hosting, analytics, authentication services like Google OAuth)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our users</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement security measures to protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of passwords using bcrypt hashing algorithms</li>
              <li>Secure connections via our hosting provider's infrastructure</li>
              <li>JWT (JSON Web Token) for secure session management</li>
              <li>HttpOnly cookies to prevent cross-site scripting attacks</li>
              <li>Access controls limiting who can view user data</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the Internet 
              is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Third-Party Services</h2>
            <p>Our website integrates with the following third-party services:</p>
            <ul>
              <li><strong>Al Quran Cloud API:</strong> For Quran text, translations, and verse-by-verse audio</li>
              <li><strong>MP3Quran.net API:</strong> For full surah audio recitations</li>
              <li><strong>Quran.com API:</strong> For word-by-word features</li>
              <li><strong>Google OAuth:</strong> For optional social login functionality</li>
              <li><strong>OpenAI:</strong> For the Islamic Scholar AI chatbot feature</li>
            </ul>
            <p>
              These third-party services have their own privacy policies, and we encourage you to review them. 
              We are not responsible for the privacy practices of these external services.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information through your dashboard</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Opt-Out:</strong> Disable cookies through your browser settings</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@qurandeen.com">privacy@qurandeen.com</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              QuranDeen.com is designed for users of all ages seeking to learn and read the Holy Quran. 
              We do not knowingly collect personal information from children under 13 without parental consent. 
              If you believe we have collected information from a child under 13, please contact us immediately, 
              and we will take steps to delete such information.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide 
              you services. If you delete your account, we will delete or anonymize your personal information 
              within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. International Users</h2>
            <p>
              QuranDeen.com is operated globally. If you are accessing our services from outside the country 
              where our servers are located, your information may be transferred to, stored, and processed 
              in a different jurisdiction. By using our services, you consent to this transfer.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              applicable laws. We will notify you of any material changes by posting the updated policy 
              on this page with a new "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
              practices, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:privacy@qurandeen.com">privacy@qurandeen.com</a></p>
              <p><strong>Website:</strong> <Link to="/contact">QuranDeen.com/contact</Link></p>
            </div>
          </section>
        </div>

        <div className="legal-footer">
          <p>
            By using QuranDeen.com, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="legal-links">
            <Link to="/terms">Terms of Use</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/">Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
