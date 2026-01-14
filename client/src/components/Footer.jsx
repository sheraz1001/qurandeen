import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/juz', label: 'Browse Juz' },
    { path: '/bookmarks', label: 'My Bookmarks' },
    { path: '/settings', label: 'Settings' },
  ];

  const popularSurahs = [
    { number: 1, name: 'Al-Fatiha' },
    { number: 36, name: 'Ya-Sin' },
    { number: 55, name: 'Ar-Rahman' },
    { number: 67, name: 'Al-Mulk' },
    { number: 112, name: 'Al-Ikhlas' },
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 40 40" className="footer-logo-svg">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8 L20 32 M12 16 L28 16 M14 24 L26 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="footer-logo-text">Quran Online</span>
            </div>
            <p className="footer-description">
              A comprehensive platform for reading, listening, and studying the Holy Quran. 
              Access all 114 surahs with Arabic text, translations in 40+ languages, 
              and audio recitations from renowned reciters.
            </p>
            <div className="footer-features">
              <span className="feature-badge">114 Surahs</span>
              <span className="feature-badge">23+ Reciters</span>
              <span className="feature-badge">100+ Translations</span>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Popular Surahs</h3>
            <ul className="footer-links">
              {popularSurahs.map((surah) => (
                <li key={surah.number}>
                  <Link to={`/surah/${surah.number}`} className="footer-link">
                    {surah.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Features</h3>
            <ul className="footer-links">
              <li><span className="footer-text">Multiple Arabic Scripts</span></li>
              <li><span className="footer-text">Verse-by-Verse Audio</span></li>
              <li><span className="footer-text">Bookmarks & History</span></li>
              <li><span className="footer-text">Tafsir (Commentary)</span></li>
              <li><span className="footer-text">Juz Navigation</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">
            &copy; {currentYear} Quran Online. All rights reserved.
          </p>
          <p className="api-credit">
            Powered by <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer">Al Quran Cloud API</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
