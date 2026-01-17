import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './legal.css';

function TermsOfUse() {
  useEffect(() => {
    document.title = 'Terms of Use - QuranDeen.com';
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = 'January 17, 2026';

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Terms of Use</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to QuranDeen.com. By accessing or using our website and services, you agree to be 
              bound by these Terms of Use ("Terms"), our Privacy Policy, and all applicable laws and 
              regulations. If you do not agree with any of these Terms, you are prohibited from using 
              or accessing this site.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and QuranDeen.com regarding 
              your use of our Quran reading, listening, and learning platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Services</h2>
            <p>QuranDeen.com provides a free, comprehensive platform for:</p>
            <ul>
              <li>Reading the Holy Quran in Arabic with multiple script styles</li>
              <li>Accessing translations in 40+ languages</li>
              <li>Listening to verse-by-verse and full surah audio recitations from 150+ reciters</li>
              <li>Word-by-word Quran reading with transliteration and meanings</li>
              <li>Tafsir (commentary) in multiple languages</li>
              <li>Islamic Scholar AI chatbot for questions about Quran, Hadith, and Islamic knowledge</li>
              <li>Islamic tools including Hijri calendar converter, Adhkar, and 99 Names of Allah</li>
              <li>Personal features such as bookmarks, reading progress tracking, and user dashboard</li>
              <li>Educational blog content on Islamic topics</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Accounts</h2>
            
            <h3>3.1 Account Creation</h3>
            <p>
              To access certain features, you may create an account by providing accurate, complete, 
              and current information. You may register using email/password or through Google OAuth.
            </p>

            <h3>3.2 Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access or security breach</li>
              <li>Ensuring the information in your account remains accurate and up-to-date</li>
            </ul>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion if you 
              violate these Terms or engage in conduct that we deem harmful to other users or our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Acceptable Use Policy</h2>
            <p>When using QuranDeen.com, you agree NOT to:</p>
            <ul>
              <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to gain unauthorized access to any part of the service or its systems</li>
              <li>Interfere with or disrupt the service or servers connected to it</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Scrape, harvest, or collect data from our website without permission</li>
              <li>Use automated systems (bots, scrapers) to access the service excessively</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Post or transmit any content that is defamatory, obscene, or offensive</li>
              <li>Use the service in any way that could damage, disable, or impair our platform</li>
              <li>Attempt to reverse engineer or decompile any software on our website</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Quranic Content and Accuracy</h2>
            
            <h3>5.1 Source of Content</h3>
            <p>
              The Quranic text, translations, and audio content on QuranDeen.com are sourced from 
              reputable third-party APIs and databases, including Al Quran Cloud API, MP3Quran.net, 
              and Quran.com API.
            </p>

            <h3>5.2 Accuracy Disclaimer</h3>
            <p>
              While we strive to ensure the accuracy of all Quranic content, translations, and tafsir, 
              we encourage users to verify content with scholarly sources. Translations are interpretations 
              by scholars and may vary. For religious rulings and spiritual guidance, please consult 
              qualified Islamic scholars.
            </p>

            <h3>5.3 Respect for Sacred Text</h3>
            <p>
              We expect all users to treat the Quranic content with the utmost respect and dignity 
              befitting the Holy Quran. Any misuse or disrespectful treatment of the content is 
              strictly prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. AI Chatbot Disclaimer</h2>
            <p>
              The Islamic Scholar AI chatbot is provided as an educational tool and should not be 
              considered a substitute for advice from qualified Islamic scholars. The AI provides 
              information based on Quran and authentic Hadith sources but may contain errors or 
              limitations. Always verify important religious matters with knowledgeable scholars.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Intellectual Property Rights</h2>
            
            <h3>7.1 Our Content</h3>
            <p>
              The QuranDeen.com website design, logos, graphics, and original content are the property 
              of QuranDeen.com and are protected by intellectual property laws. You may not reproduce, 
              distribute, or create derivative works without our express written permission.
            </p>

            <h3>7.2 Quranic Content</h3>
            <p>
              The Holy Quran is the word of Allah and is not subject to copyright. Translations and 
              tafsir may be subject to their respective authors' copyrights. We provide these materials 
              for educational and religious purposes under fair use principles.
            </p>

            <h3>7.3 User Content</h3>
            <p>
              Any content you submit (such as blog comments or feedback) may be used by us to improve 
              our services. You retain ownership of your content but grant us a license to use it in 
              connection with our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Third-Party Services and Links</h2>
            <p>
              Our website may contain links to third-party websites or integrate with external services. 
              We are not responsible for the content, privacy practices, or availability of these 
              third-party services. Your use of third-party services is at your own risk and subject 
              to their respective terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              QuranDeen.com is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul>
              <li>Implied warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of any content</li>
            </ul>
            <p>
              We do not warrant that defects will be corrected or that our servers are free of 
              viruses or other harmful components.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, QuranDeen.com and its operators shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to:
            </p>
            <ul>
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruptions or system failures</li>
              <li>Errors or inaccuracies in content</li>
              <li>Personal injury or property damage from use of our services</li>
              <li>Unauthorized access to or alteration of your data</li>
            </ul>
            <p>
              Our total liability for any claim arising from these Terms shall not exceed the amount 
              you paid us (if any) in the twelve months preceding the claim.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless QuranDeen.com, its operators, affiliates, 
              and their respective officers, directors, employees, and agents from any claims, damages, 
              losses, or expenses (including reasonable legal fees) arising from:
            </p>
            <ul>
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of a third party</li>
              <li>Any content you submit or transmit through our platform</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting to this page. Your continued use of QuranDeen.com after changes are posted 
              constitutes your acceptance of the modified Terms. We encourage you to review these Terms 
              periodically.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our services at any 
              time without prior notice. We shall not be liable to you or any third party for any 
              modification, suspension, or discontinuation of the service.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without 
              regard to conflict of law principles. Any disputes arising from these Terms or your use 
              of our services shall be resolved in the appropriate courts of competent jurisdiction.
            </p>
          </section>

          <section className="legal-section">
            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, the 
              remaining provisions shall continue in full force and effect. The invalid provision shall 
              be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section className="legal-section">
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between 
              you and QuranDeen.com regarding your use of our services. These Terms supersede any prior 
              agreements or understandings between you and us.
            </p>
          </section>

          <section className="legal-section">
            <h2>17. Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms of Use, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:legal@qurandeen.com">legal@qurandeen.com</a></p>
              <p><strong>Website:</strong> <Link to="/contact">QuranDeen.com/contact</Link></p>
            </div>
          </section>
        </div>

        <div className="legal-footer">
          <p>
            By using QuranDeen.com, you acknowledge that you have read, understood, and agree to be 
            bound by these Terms of Use.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/">Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfUse;
