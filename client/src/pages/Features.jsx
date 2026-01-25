import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/features.css';

function Features() {
  const quranFeatures = [
    {
      icon: '📖',
      title: 'Complete Quran Text',
      description: 'Access all 114 Surahs with accurate Arabic text in multiple scripts including Uthmani, IndoPak, Nastaliq, Naskh Nastaleeq, and Me Quran styles.',
      highlights: ['114 Surahs', '6,236 Ayahs', '30 Juz']
    },
    {
      icon: '🎧',
      title: '150+ World-Class Reciters',
      description: 'Listen to beautiful Quran recitations from over 150 world-renowned reciters including Mishary Rashid, Abdul Rahman Al-Sudais, and many more.',
      highlights: ['Full Surah Audio', 'Verse-by-Verse', 'MP3 Downloads']
    },
    {
      icon: '🌍',
      title: '100+ Translations',
      description: 'Read the Quran in your preferred language with translations available in over 100 editions across 40+ languages worldwide.',
      highlights: ['40+ Languages', 'English', 'Urdu', 'Bengali', 'Turkish']
    },
    {
      icon: '📚',
      title: 'Comprehensive Tafsir',
      description: 'Understand verses deeply with scholarly Tafsir commentary including Al-Muyassar, Ibn Kathir, and more in multiple languages.',
      highlights: ['Arabic Tafsir', 'English Commentary', 'Urdu & Bengali']
    },
    {
      icon: '🔤',
      title: 'Word-by-Word Quran',
      description: 'Learn Arabic with our interactive word-by-word mode. Hover or tap any word to see its individual translation and transliteration.',
      highlights: ['Word Translation', 'Word Audio', 'Transliteration']
    },
    {
      icon: '✏️',
      title: 'Multiple Arabic Scripts',
      description: 'Choose from 5 different Arabic font styles to match your reading preference and regional familiarity.',
      highlights: ['Uthmani', 'IndoPak Nastaliq', 'Naskh Nastaleeq', 'Me Quran', 'Simple']
    }
  ];

  const hadithFeatures = [
    {
      icon: '📕',
      title: '17 Authentic Collections',
      description: 'Access the most comprehensive Hadith library with 17 major collections from trusted scholars.',
      collections: ['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan Abu Dawud', 'Jami at-Tirmidhi', 'Sunan an-Nasai', 'Sunan Ibn Majah', 'Muwatta Malik', 'Musnad Ahmad']
    },
    {
      icon: '📊',
      title: '50,000+ Hadiths',
      description: 'Browse through over 50,000 authenticated hadiths organized by book and chapter for easy navigation and study.',
      highlights: ['Organized by Books', 'Chapter Navigation', 'Search Functionality']
    },
    {
      icon: '🌐',
      title: '4 Language Support',
      description: 'Read hadiths in English, Arabic, Urdu (via hadithapi.com), and Bengali translations for global accessibility.',
      highlights: ['English', 'Arabic', 'Urdu', 'Bengali']
    },
    {
      icon: '📋',
      title: 'Interactive Features',
      description: 'Copy, share, and bookmark your favorite hadiths. Adjustable font sizes and clean reading interface.',
      highlights: ['Copy to Clipboard', 'Share Hadiths', 'Font Controls']
    }
  ];

  const azkaarFeatures = [
    {
      icon: '🤲',
      title: '134 Dua Categories',
      description: 'Complete collection of authentic duas from Hisnul Muslim (Fortress of the Muslim) covering every aspect of daily life.',
      highlights: ['Morning Adhkar', 'Evening Adhkar', 'Prayer Duas', 'Travel Duas']
    },
    {
      icon: '📿',
      title: '298+ Authentic Duas',
      description: 'Access over 298 verified supplications with Arabic text, transliteration, and translations from authentic Islamic sources.',
      highlights: ['Arabic Text', 'Transliteration', 'English Translation']
    },
    {
      icon: '🔢',
      title: 'Interactive Counter',
      description: 'Built-in recitation counter to help you track your dhikr and duas. Progress is saved automatically.',
      highlights: ['Tap to Count', 'Progress Tracking', 'Auto-Save']
    },
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Quickly find any dua with our powerful search. Filter by category, situation, or keyword.',
      highlights: ['Category Filter', 'Keyword Search', 'Quick Access']
    }
  ];

  const islamicTools = [
    {
      icon: '🕌',
      title: 'Prayer Times',
      description: 'Accurate prayer times based on your location using the Aladhan API. Supports multiple calculation methods.',
      link: '/islamic-resources/prayer-times'
    },
    {
      icon: '🧭',
      title: 'Qibla Direction',
      description: 'Find the exact Qibla direction from anywhere in the world using GPS-based compass technology.',
      link: '/islamic-resources/qibla-direction'
    },
    {
      icon: '📅',
      title: 'Hijri-Gregorian Calendar',
      description: 'Interactive Islamic calendar with date conversion, events, and age calculator.',
      link: '/hijri-calendar'
    },
    {
      icon: '🔄',
      title: 'Date Converter',
      description: 'Convert dates between Hijri and Gregorian calendars instantly for any date in history.',
      link: '/islamic-resources/hijri-converter'
    },
    {
      icon: '🌙',
      title: 'Ramadan Calendar',
      description: 'Complete Ramadan schedule with Suhoor and Iftar times for your location throughout the blessed month.',
      link: '/islamic-resources/ramadan-calendar'
    },
    {
      icon: '✨',
      title: '99 Names of Allah',
      description: 'Explore the beautiful names of Allah (Asma ul Husna) with Arabic, transliteration, and meanings.',
      link: '/islamic-resources/names-of-allah'
    },
    {
      icon: '🌅',
      title: 'Verse of the Day',
      description: 'Start your day with inspiration. A new Quranic verse is featured daily with translation and tafsir.',
      link: '/islamic-resources/verse-of-day'
    },
    {
      icon: '📜',
      title: 'Hadith of the Day',
      description: 'Daily authentic hadith selections from major collections to guide and inspire your day.',
      link: '/islamic-resources/hadith-of-day'
    }
  ];

  const teachingPlatform = [
    {
      icon: '👨‍🏫',
      title: 'Verified Teachers',
      description: 'Connect with qualified, verified Quran teachers from around the world. Each teacher undergoes thorough verification.'
    },
    {
      icon: '📦',
      title: 'Flexible Packages',
      description: 'Choose from various class packages - single sessions, weekly plans, or monthly subscriptions to fit your schedule.'
    },
    {
      icon: '🎥',
      title: 'Video Classes',
      description: 'Attend live Quran classes via integrated Jitsi Meet video conferencing. No additional software required.'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Safe and secure payment processing via Stripe. Automated commission handling and instant payouts.'
    },
    {
      icon: '💬',
      title: 'Real-Time Messaging',
      description: 'Direct messaging system between students and teachers for scheduling, questions, and class coordination.'
    },
    {
      icon: '⭐',
      title: 'Reviews & Ratings',
      description: 'Make informed decisions with student reviews and ratings. Teachers build reputation through quality teaching.'
    }
  ];

  const additionalFeatures = [
    { icon: '🖼️', title: 'Quran Share Card Generator', description: 'Create beautiful, customizable images of Quranic verses to share on social media' },
    { icon: '🤖', title: 'AI Islamic Scholar', description: 'Get answers to Islamic questions with citations from authentic sources' },
    { icon: '📝', title: 'Islamic Blog', description: 'Educational articles on Quran, Hadith, and Islamic knowledge' },
    { icon: '🔖', title: 'Bookmarks & History', description: 'Save your favorite ayahs and track your reading progress' },
    { icon: '🌙', title: 'Dark Mode', description: 'Comfortable reading experience in low-light environments' },
    { icon: '📱', title: 'Fully Responsive', description: 'Perfect experience on desktop, tablet, and mobile devices' },
    { icon: '⚡', title: 'PWA Support', description: 'Install as an app on your device for offline access and push notifications' },
    { icon: '🔍', title: 'Advanced Search', description: 'Search any word or phrase across all 6,236 verses instantly' },
    { icon: '📊', title: 'Reading Statistics', description: 'Track your Quran completion journey with detailed statistics' },
    { icon: '🔗', title: 'Social Sharing', description: 'Share verses and hadiths directly to social media platforms' },
    { icon: '🕌', title: 'Sajda Markers', description: 'Visual indicators for the 15 obligatory prostration verses' },
    { icon: '🔤', title: 'Adjustable Font Size', description: 'Customize Arabic and translation text size for comfortable reading' }
  ];

  const platformStats = [
    { value: '114', label: 'Surahs', description: 'Complete Quran' },
    { value: '150+', label: 'Reciters', description: 'World-class Qaris' },
    { value: '100+', label: 'Translations', description: '40+ Languages' },
    { value: '17', label: 'Hadith Books', description: '50,000+ Hadiths' },
    { value: '134', label: 'Dua Categories', description: '298+ Duas' }
  ];

  const technicalFeatures = [
    { icon: '🚀', title: 'SEO Optimized', description: 'Structured sitemaps for Quran, Hadith, and Azkaar sections' },
    { icon: '🔒', title: 'Secure Authentication', description: 'JWT-based auth with Google OAuth integration for secure user accounts' },
    { icon: '📡', title: 'Real-Time APIs', description: 'Integration with Al-Quran Cloud, MP3Quran.net, Quran.com, and Aladhan APIs' },
    { icon: '💾', title: 'Local Storage', description: 'Preferences, bookmarks, and reading history saved locally for fast access' },
    { icon: '📱', title: 'Progressive Web App', description: 'Installable PWA with offline caching, push notifications, and app shortcuts' },
    { icon: '🎨', title: 'Modern UI/UX', description: 'Clean, accessible design optimized for readability across all devices' }
  ];

  return (
    <div className="features-page">
      <Helmet>
        <title>Features - QuranDeen | Complete Quran, Hadith & Islamic Resources Platform</title>
        <meta name="description" content="Explore QuranDeen features: 114 Surahs, 150+ reciters, 100+ translations, 17 Hadith collections, 298+ duas, prayer times, AI Scholar, and Quran teaching platform." />
      </Helmet>

      <section className="features-hero">
        <div className="hero-content">
          <span className="hero-badge">Complete Islamic Platform</span>
          <h1>Your All-in-One Destination for<br/><span className="highlight">Quran, Hadith & Islamic Knowledge</span></h1>
          <p className="hero-description">
            QuranDeen brings together the world's most comprehensive Quranic resources, authentic Hadith collections, 
            daily duas, Islamic utilities, and a Quran teaching marketplace - all in one beautiful, accessible platform.
          </p>
          <div className="hero-actions">
            <Link to="/" className="hero-btn primary">Start Reading Quran</Link>
            <Link to="/hadith" className="hero-btn secondary">Explore Hadith</Link>
          </div>
        </div>
      </section>

      <section className="stats-banner">
        <div className="section-container">
          <div className="stats-grid">
            {platformStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-desc">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-section quran-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Quran Features</span>
            <h2>Complete Quran Experience</h2>
            <p>Everything you need to read, listen, understand, and memorize the Holy Quran</p>
          </div>
          <div className="feature-cards-grid">
            {quranFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-card-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-highlights">
                  {feature.highlights.map((h, i) => (
                    <span key={i} className="highlight-tag">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/" className="section-link">Browse All 114 Surahs →</Link>
            <Link to="/quran-mp3-audio" className="section-link">Listen to Reciters →</Link>
          </div>
        </div>
      </section>

      <section className="feature-section hadith-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Hadith Library</span>
            <h2>17 Authentic Hadith Collections</h2>
            <p>Access over 50,000 authenticated hadiths from the most trusted Islamic scholars</p>
          </div>
          <div className="hadith-showcase">
            <div className="hadith-main">
              {hadithFeatures.map((feature, index) => (
                <div key={index} className="hadith-feature-card">
                  <span className="feature-card-icon">{feature.icon}</span>
                  <div className="hadith-feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    {feature.highlights && (
                      <div className="feature-highlights">
                        {feature.highlights.map((h, i) => (
                          <span key={i} className="highlight-tag">{h}</span>
                        ))}
                      </div>
                    )}
                    {feature.collections && (
                      <div className="collection-tags">
                        {feature.collections.map((c, i) => (
                          <span key={i} className="collection-tag">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-cta">
            <Link to="/hadith" className="section-link">Explore All 17 Collections →</Link>
          </div>
        </div>
      </section>

      <section className="feature-section azkaar-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Daily Azkaar & Duas</span>
            <h2>Hisnul Muslim Collection</h2>
            <p>Complete fortress of the Muslim with 134 categories and 298+ authentic duas</p>
          </div>
          <div className="feature-cards-grid cols-4">
            {azkaarFeatures.map((feature, index) => (
              <div key={index} className="feature-card compact">
                <span className="feature-card-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-highlights">
                  {feature.highlights.map((h, i) => (
                    <span key={i} className="highlight-tag small">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/azkaar" className="section-link">Browse All Duas →</Link>
          </div>
        </div>
      </section>

      <section className="feature-section tools-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Islamic Utilities</span>
            <h2>Essential Islamic Tools</h2>
            <p>Prayer times, Qibla direction, calendars, and more - powered by Aladhan API</p>
          </div>
          <div className="tools-grid">
            {islamicTools.map((tool, index) => (
              <Link key={index} to={tool.link} className="tool-card">
                <span className="tool-icon">{tool.icon}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <span className="tool-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-section teaching-section highlight-bg">
        <div className="section-container">
          <div className="section-header light">
            <span className="section-badge light">Quran Teaching Platform</span>
            <h2>Learn Quran with Verified Teachers</h2>
            <p>Connect with qualified Quran teachers worldwide for personalized one-on-one classes</p>
          </div>
          <div className="teaching-grid">
            {teachingPlatform.map((feature, index) => (
              <div key={index} className="teaching-card">
                <span className="teaching-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="section-cta light">
            <Link to="/teachers" className="hero-btn primary">Find a Teacher</Link>
            <Link to="/teach-with-us" className="hero-btn secondary">Become a Teacher</Link>
          </div>
        </div>
      </section>

      <section className="feature-section ai-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">AI-Powered Islamic Guidance</span>
            <h2>Islamic Scholar AI Chatbot</h2>
            <p>Your intelligent companion for Islamic knowledge, powered by advanced AI trained on authentic sources</p>
          </div>
          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <span className="ai-feature-icon">📖</span>
              <h3>Quran Verse Citations</h3>
              <p>Get precise Quran verse references with Arabic text, transliteration, and translation for every answer.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">📜</span>
              <h3>Hadith References</h3>
              <p>Answers backed by authentic hadith from Bukhari, Muslim, and other major collections with proper citations.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">🌍</span>
              <h3>Multilingual Support</h3>
              <p>Ask questions and receive answers in English, Arabic, Urdu, and other major languages.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">📚</span>
              <h3>Tafsir Explanations</h3>
              <p>Detailed explanations from classical Tafsir including Ibn Kathir, Al-Muyassar, and other scholars.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">⚖️</span>
              <h3>Fiqh Guidance</h3>
              <p>Islamic jurisprudence answers covering all four major madhabs with scholarly consensus when available.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">🤲</span>
              <h3>Dua Recommendations</h3>
              <p>Suggests relevant duas and adhkar for your specific situations with proper Arabic and translations.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">📝</span>
              <h3>Islamic History</h3>
              <p>Learn about the lives of Prophets, Companions, and significant events in Islamic history.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">🕌</span>
              <h3>Prayer & Worship</h3>
              <p>Guidance on Salah, Wudu, Fasting, Zakat, Hajj and all aspects of Islamic worship.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">💬</span>
              <h3>Conversational Interface</h3>
              <p>Natural conversation flow - ask follow-up questions and get contextual responses.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">✅</span>
              <h3>Authentic Sources Only</h3>
              <p>All answers are grounded in authentic Islamic sources - no fabricated or weak narrations.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">🔒</span>
              <h3>Private & Secure</h3>
              <p>Your conversations are private and not stored. Ask anything without hesitation.</p>
            </div>
            <div className="ai-feature-card">
              <span className="ai-feature-icon">⚡</span>
              <h3>Instant Responses</h3>
              <p>Get immediate answers to your Islamic questions 24/7, anytime you need guidance.</p>
            </div>
          </div>
          <div className="ai-demo-section">
            <div className="ai-demo-content">
              <h3>See It In Action</h3>
              <div className="ai-chat-preview">
                <div className="chat-bubble user">What is the importance of Salah in Islam?</div>
                <div className="chat-bubble ai">
                  <strong>Salah is the second pillar of Islam</strong> and holds immense importance:<br/><br/>
                  The Prophet ﷺ said: <em>"The first matter that the slave will be brought to account for on the Day of Judgment is the prayer."</em><br/><br/>
                  Salah is mentioned over 700 times in the Quran. Allah says:<br/>
                  <em>"Indeed, prayer prohibits immorality and wrongdoing"</em> (29:45)<br/>
                  <span className="source">📖 Surah Al-Ankabut 29:45 | Sunan an-Nasa'i 465</span>
                </div>
              </div>
            </div>
          </div>
          <div className="section-cta">
            <Link to="/islamic-ai-scholar" className="section-btn">Ask the AI Scholar Now →</Link>
          </div>
        </div>
      </section>

      <section className="feature-section additional-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">More Features</span>
            <h2>Everything Else You Need</h2>
            <p>Additional features to enhance your Islamic learning experience</p>
          </div>
          <div className="additional-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="additional-card">
                <span className="additional-icon">{feature.icon}</span>
                <div className="additional-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Begin Your Journey with QuranDeen</h2>
            <p>
              Join Muslims worldwide who use QuranDeen daily for Quran reading, Hadith study, 
              daily duas, and Islamic learning. Start your spiritual journey today.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="cta-btn primary">Create Free Account</Link>
              <Link to="/" className="cta-btn secondary">Start Reading Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
