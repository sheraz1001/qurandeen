import { Link } from 'react-router-dom';
import '../styles/features.css';

function Features() {
  const mainFeatures = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
      title: 'Complete Quran',
      description: 'Access all 114 Surahs with Arabic text, transliteration, and translations in 40+ languages. Navigate easily through Juz, Page, and Ruku markers.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
      ),
      title: 'Audio Recitations',
      description: 'Listen to beautiful recitations from 150+ world-renowned reciters. Verse-by-verse audio for learning and full surah MP3 playback.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      title: 'AI Islamic Scholar',
      description: 'Get guidance on Quran, Hadith, and Tafsir from our AI assistant. Answers with authentic sources and citations from Islamic scholars.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
        </svg>
      ),
      title: 'Multi-Language Translations',
      description: 'Read translations in over 100 editions across 40+ languages including English, Urdu, Arabic Tafsir, French, German, Turkish, and more.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      title: 'Tafsir Commentary',
      description: 'Understand verses deeply with multilingual Tafsir including Ibn Kathir, Al-Muyassar, and more in Arabic, English, Urdu, and Bengali.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      ),
      title: 'Bookmarks & Progress',
      description: 'Save your favorite ayahs, track your reading progress, and sync across all your devices when logged in. Never lose your place.'
    }
  ];

  const additionalFeatures = [
    { icon: '📖', title: 'Juz Navigation', description: 'Browse all 30 Juz with organized surah groupings' },
    { icon: '🔍', title: 'Powerful Search', description: 'Search any word across all 6,236 verses instantly' },
    { icon: '🌙', title: 'Dark Mode', description: 'Comfortable reading in low-light environments' },
    { icon: '📱', title: 'Fully Responsive', description: 'Perfect experience on desktop, tablet, and mobile' },
    { icon: '🕌', title: 'Sajda Markers', description: 'Visual indicators for obligatory prostration verses' },
    { icon: '📝', title: 'Islamic Blog', description: 'Educational articles on Islamic knowledge' },
    { icon: '🔤', title: 'Multiple Arabic Fonts', description: 'Uthmani, IndoPak Nastaleeq, and Simple scripts' },
    { icon: '📊', title: 'Reading Statistics', description: 'Track your Quran completion journey' },
    { icon: '🔗', title: 'Share Ayahs', description: 'Share verses on social media or copy to clipboard' },
    { icon: '✨', title: 'Daily Ayah', description: 'Fresh inspiration with a new verse each day' },
    { icon: '👤', title: 'User Accounts', description: 'Personal dashboard with synced data' },
    { icon: '🎯', title: 'Adjustable Font Size', description: 'Customize Arabic text size for comfort' }
  ];

  const quranStats = [
    { value: '114', label: 'Surahs', sublabel: 'Chapters' },
    { value: '6,236', label: 'Ayahs', sublabel: 'Verses' },
    { value: '30', label: 'Juz', sublabel: 'Parts' },
    { value: '604', label: 'Pages', sublabel: 'Standard Mushaf' },
    { value: '558', label: 'Ruku', sublabel: 'Sections' },
    { value: '77,430', label: 'Words', sublabel: 'Total Count' }
  ];

  const platformStats = [
    { value: '150+', label: 'Reciters', description: 'World-renowned Qaris' },
    { value: '100+', label: 'Translations', description: 'In 40+ languages' },
    { value: '6', label: 'Tafsir Options', description: 'Multilingual commentary' },
    { value: '3', label: 'Arabic Scripts', description: 'Font styles available' }
  ];

  const quranFacts = [
    {
      title: 'Revelation Period',
      content: 'The Quran was revealed over approximately 23 years, from 610 CE to 632 CE.',
      icon: '📅'
    },
    {
      title: 'Longest Surah',
      content: 'Surah Al-Baqarah (The Cow) is the longest with 286 verses.',
      icon: '📏'
    },
    {
      title: 'Shortest Surah',
      content: 'Surah Al-Kawthar has only 3 verses, making it the shortest.',
      icon: '✂️'
    },
    {
      title: 'Most Repeated Word',
      content: 'Allah (الله) appears 2,699 times throughout the Quran.',
      icon: '🔢'
    },
    {
      title: 'Meccan & Medinan',
      content: '86 Surahs were revealed in Mecca, 28 in Medina.',
      icon: '🕋'
    },
    {
      title: 'Prostration Verses',
      content: 'There are 15 Sajda (prostration) verses in the Quran.',
      icon: '🤲'
    }
  ];

  return (
    <div className="features-page">
      <section className="features-hero">
        <div className="hero-content">
          <span className="hero-badge">Comprehensive Platform</span>
          <h1>Everything You Need to<br/><span className="highlight">Read, Listen & Learn</span></h1>
          <p className="hero-description">
            Discover the complete feature set of QuranDeen - your comprehensive companion 
            for exploring the Holy Quran with modern technology and authentic sources.
          </p>
          <div className="hero-actions">
            <Link to="/" className="hero-btn primary">Start Reading</Link>
            <Link to="/quran-mp3-audio" className="hero-btn secondary">Listen Now</Link>
          </div>
        </div>
      </section>

      <section className="quran-stats-section">
        <div className="section-container">
          <div className="section-header centered">
            <span className="section-badge">The Holy Quran</span>
            <h2>Quran at a Glance</h2>
            <p>Key statistics about the final revelation</p>
          </div>
          <div className="quran-stats-grid">
            {quranStats.map((stat, index) => (
              <div key={index} className="quran-stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sublabel">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="main-features-section">
        <div className="section-container">
          <div className="section-header centered">
            <span className="section-badge">Core Features</span>
            <h2>Powerful Tools for Your Journey</h2>
            <p>Everything you need for meaningful Quran engagement</p>
          </div>
          <div className="main-features-grid">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="main-feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-stats-section">
        <div className="section-container">
          <div className="platform-stats-content">
            <div className="platform-stats-text">
              <span className="section-badge light">Platform Highlights</span>
              <h2>Built for the Global<br/>Muslim Community</h2>
              <p>
                QuranDeen brings together the best resources from around the world, 
                making the Quran accessible to everyone regardless of language or location.
              </p>
              <Link to="/islamic-ai-scholar" className="platform-cta">Ask AI Scholar</Link>
            </div>
            <div className="platform-stats-grid">
              {platformStats.map((stat, index) => (
                <div key={index} className="platform-stat-card">
                  <div className="platform-stat-value">{stat.value}</div>
                  <div className="platform-stat-label">{stat.label}</div>
                  <div className="platform-stat-desc">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="facts-section">
        <div className="section-container">
          <div className="section-header centered">
            <span className="section-badge">Did You Know?</span>
            <h2>Fascinating Quran Facts</h2>
            <p>Discover interesting facts about the Holy Quran</p>
          </div>
          <div className="facts-grid">
            {quranFacts.map((fact, index) => (
              <div key={index} className="fact-card">
                <span className="fact-icon">{fact.icon}</span>
                <h3>{fact.title}</h3>
                <p>{fact.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="additional-features-section">
        <div className="section-container">
          <div className="section-header centered">
            <span className="section-badge">More Features</span>
            <h2>And Much More</h2>
            <p>Additional features to enhance your experience</p>
          </div>
          <div className="additional-features-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="additional-feature-card">
                <span className="additional-feature-icon">{feature.icon}</span>
                <div className="additional-feature-content">
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
            <h2>Begin Your Journey Today</h2>
            <p>
              Join thousands of Muslims worldwide who use QuranDeen to read, listen, 
              and understand the Holy Quran. Start your spiritual journey now.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="cta-btn primary">Create Free Account</Link>
              <Link to="/" className="cta-btn secondary">Browse Surahs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
