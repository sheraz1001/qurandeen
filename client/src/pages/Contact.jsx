import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';

function Contact() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Contact Us' }
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us - QuranDeen | Get in Touch for Questions & Feedback';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact QuranDeen for questions, feedback, feature requests, or partnerships. We are dedicated to providing the best Quran reading and learning experience for Muslims worldwide.');
    }
  }, []);

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

  const socialLinks = [
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/qurandeencom',
      followers: '10K+ Followers',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'X (Twitter)', 
      url: 'https://x.com/qurandeencom',
      followers: 'Daily Updates',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/qurandeencom/',
      followers: 'Islamic Content',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/@qurandeencom',
      followers: 'Recitations',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      url: 'https://www.tiktok.com/@qurandeencom',
      followers: 'Short Videos',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    },
    { 
      name: 'Pinterest', 
      url: 'https://www.pinterest.com/qurandeencom/',
      followers: 'Islamic Pins',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/company/qurandeen/',
      followers: 'Professional',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: 'Threads', 
      url: 'https://www.threads.com/@qurandeencom',
      followers: 'Discussions',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.087-1.146 3.476-1.146.616 0 1.198.065 1.731.183-.034-1.187-.232-2.1-.593-2.73-.471-.822-1.236-1.233-2.27-1.22-.883.01-1.59.288-2.104.829-.511.538-.793 1.273-.84 2.19l-2.088-.085c.072-1.39.54-2.554 1.394-3.463 1.016-1.082 2.422-1.641 4.182-1.664h.044c1.94 0 3.407.724 4.364 2.155.812 1.213 1.205 2.905 1.169 5.035l.012.508c.036.756.082 1.386.347 2.073.247.639.62 1.154 1.108 1.531.926.713 2.088.883 3.017.464.928-.42 1.58-1.272 1.838-2.4.159-.698.17-1.487.033-2.346-.267-1.662-.913-3.073-1.92-4.196C20.4 4.846 18.515 3.784 16.135 3.3l.388-2.062c2.868.583 5.16 1.9 6.817 3.917 1.227 1.494 2.01 3.308 2.326 5.39.17 1.12.158 2.165-.036 3.108-.377 1.83-1.413 3.32-2.918 4.2-1.498.876-3.296.985-5.068.31-1.005-.383-1.857-.979-2.533-1.77-.127.322-.277.632-.45.927-.75 1.273-1.872 2.23-3.337 2.846-1.166.49-2.47.734-3.873.734zM11.17 12.886c-.94 0-1.746.258-2.328.747-.535.45-.805 1.026-.759 1.62.046.594.4 1.122.996 1.488.622.382 1.42.554 2.305.506 1.097-.06 1.933-.456 2.486-1.18.455-.595.718-1.39.783-2.368-.944-.511-2.063-.813-3.483-.813z"/>
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
      answer: 'Please use the contact form on this page or email us directly at info@qurandeen.com. Include as much detail as possible about the issue, including the surah/ayah number if applicable, and we will address it promptly.'
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
    },
    {
      question: 'Do you offer mobile apps?',
      answer: 'QuranDeen is a fully responsive web application that works seamlessly on all devices including smartphones and tablets. You can add it to your home screen for an app-like experience.'
    },
    {
      question: 'Can I use QuranDeen offline?',
      answer: 'While most features require an internet connection, we are working on offline capabilities for future releases. Stay tuned for updates on our social media channels.'
    }
  ];

  const platformFeatures = [
    { icon: '📖', title: '114 Surahs', desc: 'Complete Holy Quran' },
    { icon: '🎧', title: '150+ Reciters', desc: 'World-renowned Qaris' },
    { icon: '🌍', title: '100+ Translations', desc: '40+ Languages' },
    { icon: '📝', title: 'Tafsir', desc: 'Multilingual Commentary' },
    { icon: '🤖', title: 'AI Scholar', desc: 'Islamic Q&A' },
    { icon: '🔖', title: 'Bookmarks', desc: 'Save & Sync' }
  ];

  const whyContactUs = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'General Inquiries',
      description: 'Have questions about our platform? We are here to help you get started.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: 'Feature Requests',
      description: 'Share your ideas for new features. Your feedback shapes our roadmap.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      title: 'Bug Reports',
      description: 'Found an issue? Let us know so we can fix it and improve your experience.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Partnerships',
      description: 'Interested in collaborating? We welcome Islamic organizations and content creators.'
    }
  ];

  const contactSchema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact QuranDeen",
      "description": "Contact QuranDeen for questions, feedback, feature requests, or partnerships.",
      "url": "https://qurandeen.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "QuranDeen",
        "email": "info@qurandeen.com",
        "url": "https://qurandeen.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <div className="contact-page">
      <SEO 
        title="Contact Us - QuranDeen | Get in Touch for Questions & Feedback"
        description="Contact QuranDeen for questions, feedback, feature requests, or partnerships. We are dedicated to providing the best Quran reading and learning experience for Muslims worldwide."
        canonical="https://qurandeen.com/contact"
        keywords="Contact QuranDeen, QuranDeen support, Islamic website contact, Quran app feedback"
        breadcrumbs={breadcrumbs}
        schema={contactSchema}
      />
      <HeroAnimated
        icon="✉️"
        title="Contact Us"
        subtitle="We value your feedback and are here to help"
        stats={['24-48hr Response', 'info@qurandeen.com']}
        breadcrumbs={breadcrumbs}
      />

      <div className="contact-container">
        <section className="why-contact-section" aria-labelledby="why-contact-title">
          <div className="section-header">
            <h2 id="why-contact-title">How Can We Help You?</h2>
            <p>Choose a category that best describes your inquiry</p>
          </div>
          <div className="why-contact-grid">
            {whyContactUs.map((item, index) => (
              <div key={index} className="why-contact-card">
                <div className="why-contact-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="contact-main">
          <section className="contact-form-section" aria-labelledby="contact-form-title">
            <div className="section-header">
              <h2 id="contact-form-title">Send Us a Message</h2>
              <p>Fill out the form below and we will respond within 24-48 hours</p>
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
                <p>JazakAllah Khair for reaching out. We will respond to your message within 24-48 hours.</p>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
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
                    <option value="bug">Report a Bug or Issue</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership & Collaboration</option>
                    <option value="content">Content Correction</option>
                    <option value="translation">Translation Request</option>
                    <option value="technical">Technical Support</option>
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
                    placeholder="Please describe your inquiry in detail..."
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
          </section>

          <aside className="contact-sidebar">
            <div className="email-card">
              <div className="email-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3>Email Us Directly</h3>
              <p>Prefer email? Send us a message anytime.</p>
              <a href="mailto:info@qurandeen.com" className="email-link">
                info@qurandeen.com
              </a>
            </div>

            <div className="social-connect-card">
              <h3>Connect With Us</h3>
              <p>Follow us for daily Islamic reminders, updates, and Quran recitations.</p>
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
                    <div className="social-info">
                      <span className="social-name">{social.name}</span>
                      <span className="social-followers">{social.followers}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="response-time-card">
              <div className="response-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Quick Response</h3>
              <p>We typically respond within 24-48 hours. For urgent matters, please mention it in your message.</p>
            </div>
          </aside>
        </div>

        <section className="platform-overview" aria-labelledby="platform-title">
          <div className="section-header">
            <h2 id="platform-title">About QuranDeen Platform</h2>
            <p>A comprehensive Islamic platform serving Muslims worldwide</p>
          </div>
          <div className="platform-features-grid">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="platform-feature-card">
                <span className="platform-feature-icon">{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="section-header">
            <h2 id="faq-title">Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about QuranDeen</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <article key={index} className="faq-card">
                <div className="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mission-section" aria-labelledby="mission-title">
          <div className="mission-content">
            <h2 id="mission-title">Our Mission</h2>
            <p>
              At QuranDeen, our mission is to make the Holy Quran accessible to every Muslim around the world. 
              We strive to provide a beautiful, user-friendly platform that helps you connect with the divine words of Allah (SWT).
            </p>
            <p>
              Whether you are a beginner learning to read Arabic, a student memorizing the Quran, or someone seeking 
              spiritual guidance, QuranDeen is designed to support your journey with the Book of Allah.
            </p>
            <div className="mission-values">
              <div className="mission-value">
                <span className="value-icon">🌍</span>
                <div>
                  <h4>Global Access</h4>
                  <p>Free for Muslims everywhere, in every language</p>
                </div>
              </div>
              <div className="mission-value">
                <span className="value-icon">💚</span>
                <div>
                  <h4>Always Free</h4>
                  <p>No subscriptions, no hidden fees, ever</p>
                </div>
              </div>
              <div className="mission-value">
                <span className="value-icon">🔒</span>
                <div>
                  <h4>Privacy First</h4>
                  <p>Your data is secure and never sold</p>
                </div>
              </div>
              <div className="mission-value">
                <span className="value-icon">🕋</span>
                <div>
                  <h4>Authentic Sources</h4>
                  <p>Verified translations and recitations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section" aria-labelledby="cta-title">
          <h3 id="cta-title">Start Your Quran Journey Today</h3>
          <p>Experience the beauty of the Holy Quran with QuranDeen - completely free, forever.</p>
          <div className="cta-buttons">
            <Link to="/" className="cta-btn primary">Start Reading</Link>
            <Link to="/islamic-resources" className="cta-btn secondary">Explore Resources</Link>
          </div>
        </section>

        <div className="developer-section">
          <div className="developer-card-large">
            <div className="developer-header">
              <h3>Developed With Love</h3>
              <p>QuranDeen is proudly developed and maintained by</p>
            </div>
            <a href="https://webmaster.ae" target="_blank" rel="noopener noreferrer" className="developer-link-large">
              <div className="developer-info-large">
                <span className="developer-name-large">Webmaster Technology</span>
                <span className="developer-tagline">Web Development & Digital Solutions</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
