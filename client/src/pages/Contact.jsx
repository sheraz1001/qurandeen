import { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactMethods = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      title: 'Email Us',
      description: 'Send us an email anytime',
      contact: 'info@qurandeen.com',
      link: 'mailto:info@qurandeen.com'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Our Location',
      description: 'Serving Muslims Worldwide',
      contact: 'Dubai, United Arab Emirates',
      link: null
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: 'Support Hours',
      description: 'We respond within 24 hours',
      contact: 'Sunday - Thursday: 9AM - 6PM GST',
      link: null
    }
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/qurandeencom',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'X (Twitter)', 
      url: 'https://x.com/qurandeencom',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/qurandeencom/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/@qurandeencom',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  const faqs = [
    {
      question: 'Is QuranDeen completely free to use?',
      answer: 'Yes! QuranDeen is 100% free. We believe everyone should have access to the Holy Quran without any barriers. All features including audio recitations, translations, and tools are available at no cost.'
    },
    {
      question: 'How can I report an error or issue?',
      answer: 'Please use the contact form on this page or email us directly. Include as much detail as possible about the issue, including the surah/ayah number if applicable, and we will address it promptly.'
    },
    {
      question: 'Can I suggest new features?',
      answer: 'Absolutely! We welcome all suggestions from our community. Please share your ideas through our contact form or social media channels. Your feedback helps us improve QuranDeen for everyone.'
    },
    {
      question: 'Which translations and reciters do you support?',
      answer: 'We offer 100+ translations in 40+ languages and audio recitations from 150+ renowned reciters worldwide. You can customize your experience in the Settings page.'
    },
    {
      question: 'How can I support QuranDeen?',
      answer: 'The best way to support us is by sharing QuranDeen with your family and friends, following us on social media, and providing feedback to help us improve. Your duas are also greatly appreciated!'
    },
    {
      question: 'Is my data secure on QuranDeen?',
      answer: 'Yes, we take privacy seriously. Your personal data is encrypted and never shared with third parties. Reading history and bookmarks are stored locally on your device unless you create an account for cloud sync.'
    }
  ];

  const quickLinks = [
    { label: 'Browse All Surahs', path: '/', icon: '📖' },
    { label: 'Browse by Juz', path: '/juz', icon: '📚' },
    { label: 'Audio Quran', path: '/mp3', icon: '🎧' },
    { label: 'Islamic Resources', path: '/tools', icon: '🛠️' },
    { label: 'AI Islamic Scholar', path: '/chat', icon: '🤖' },
    { label: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out with questions, feedback, or suggestions.</p>
        </div>
        <div className="contact-hero-pattern"></div>
      </div>

      <div className="contact-container">
        <div className="contact-methods-section">
          <div className="contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method-card">
                <div className="contact-method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <p className="contact-method-desc">{method.description}</p>
                {method.link ? (
                  <a href={method.link} className="contact-method-value">{method.contact}</a>
                ) : (
                  <span className="contact-method-value">{method.contact}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="contact-main">
          <div className="contact-form-section">
            <div className="section-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            {submitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>JazakAllah Khair for reaching out. We'll respond to your message within 24-48 hours.</p>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="bug">Report an Issue</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership & Collaboration</option>
                    <option value="content">Content Correction</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="contact-sidebar">
            <div className="social-connect-card">
              <h3>Connect With Us</h3>
              <p>Follow us on social media for updates, Islamic reminders, and more.</p>
              <div className="social-links-grid">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link-card"
                    title={social.name}
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="quick-links-card">
              <h3>Quick Links</h3>
              <div className="quick-links-list">
                {quickLinks.map((link, index) => (
                  <Link key={index} to={link.path} className="quick-link-item">
                    <span className="quick-link-icon">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="developer-card">
              <h3>Developed By</h3>
              <a href="https://webmaster.ae" target="_blank" rel="noopener noreferrer" className="developer-link">
                <div className="developer-info">
                  <span className="developer-name">Webmaster Technology</span>
                  <span className="developer-location">Dubai, UAE</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about QuranDeen</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <div className="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At QuranDeen, our mission is to make the Holy Quran accessible to everyone, anywhere in the world. 
              We strive to provide a beautiful, user-friendly platform that helps Muslims connect with the divine words of Allah.
            </p>
            <p>
              Whether you're a beginner learning to read Arabic, a student memorizing the Quran, or someone seeking 
              spiritual guidance, QuranDeen is designed to support your journey with the Book of Allah.
            </p>
            <div className="mission-features">
              <div className="mission-feature">
                <span className="feature-icon">🌍</span>
                <span>Serving Muslims Worldwide</span>
              </div>
              <div className="mission-feature">
                <span className="feature-icon">💚</span>
                <span>100% Free Forever</span>
              </div>
              <div className="mission-feature">
                <span className="feature-icon">🔒</span>
                <span>Privacy Focused</span>
              </div>
              <div className="mission-feature">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
