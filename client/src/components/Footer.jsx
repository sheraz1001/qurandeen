import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quranLinks = [
    { path: '/quran', label: 'Browse All Surahs' },
    { path: '/quran-juz-browser', label: 'Juz Browser' },
    { path: '/quran/word-by-word', label: 'Word by Word Quran' },
    { path: '/quran-share-card', label: 'Quran Share Card' },
    { path: '/bookmarks', label: 'My Bookmarks' },
    { path: '/settings', label: 'Reading Settings' },
  ];

  const popularSurahs = [
    { slug: '1-al-fatihah', name: 'Al-Fatiha' },
    { slug: '2-al-baqara', name: 'Al-Baqara' },
    { slug: '18-al-kahf', name: 'Al-Kahf' },
    { slug: '36-ya-sin', name: 'Ya-Sin' },
    { slug: '55-ar-rahman', name: 'Ar-Rahman' },
    { slug: '67-al-mulk', name: 'Al-Mulk' },
    { slug: '112-al-ikhlas', name: 'Al-Ikhlas' },
  ];

  const islamicResources = [
    { path: '/hadith', label: 'Hadith Collections' },
    { path: '/azkaar', label: 'Daily Azkaar & Duas' },
    { path: '/names-of-allah', label: '99 Names of Allah' },
    { path: '/prayer-times', label: 'Prayer Times' },
    { path: '/qibla', label: 'Qibla Direction' },
    { path: '/hijri-calendar', label: 'Hijri Calendar' },
    { path: '/ramadan-calendar', label: 'Ramadan Calendar' },
  ];

  const moreResources = [
    { path: '/hijri-converter', label: 'Hijri Converter' },
    { path: '/historical-dates', label: 'Islamic Historical Dates' },
    { path: '/ai-scholar', label: 'AI Islamic Scholar' },
    { path: '/quran-classes', label: 'Quran Classes' },
    { path: '/teach-with-us', label: 'Become a Teacher' },
    { path: '/blog', label: 'Islamic Blog' },
  ];

  const aboutLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Use' },
  ];

  return (
    <footer className="footer-modern">
      <div className="footer-top-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="footer-main-modern">
        <div className="footer-container-modern">
          <div className="footer-grid">
            <div className="footer-brand-section">
              <div className="footer-logo-modern">
                <img 
                  src="/logo.png" 
                  alt="Quran Deen" 
                  className="footer-logo-img"
                />
              </div>
              <p className="footer-tagline">
                Read, Listen & Learn the Holy Quran
              </p>
              <p className="footer-desc">
                Your comprehensive platform for Quranic studies with 114 surahs, 
                150+ reciters, 100+ translations, Hadith collections, and Islamic tools.
              </p>
              <div className="footer-stats-row">
                <div className="footer-stat">
                  <span className="stat-number">114</span>
                  <span className="stat-label">Surahs</span>
                </div>
                <div className="footer-stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Reciters</span>
                </div>
                <div className="footer-stat">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Translations</span>
                </div>
                <div className="footer-stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Hadiths</span>
                </div>
              </div>
              <div className="footer-social-modern">
                <a href="https://www.facebook.com/qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://x.com/qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.instagram.com/qurandeencom/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.youtube.com/@qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://whatsapp.com/channel/0029VbCLNSFL7UVT5sQNnS2Z" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-heading">Quran</h4>
              <ul className="footer-link-list">
                {quranLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-heading">Popular Surahs</h4>
              <ul className="footer-link-list">
                {popularSurahs.map((surah) => (
                  <li key={surah.slug}>
                    <Link to={`/surah/${surah.slug}`}>{surah.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-heading">Islamic Resources</h4>
              <ul className="footer-link-list">
                {islamicResources.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-heading">More Resources</h4>
              <ul className="footer-link-list">
                {moreResources.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-heading">About</h4>
              <ul className="footer-link-list">
                {aboutLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-modern">
        <div className="footer-container-modern">
          <div className="footer-bottom-grid">
            <p className="copyright-text">
              &copy; {currentYear} QuranDeen.com. All rights reserved.
            </p>
            <p className="developer-credit">
              Developed with <span className="heart">&#10084;</span> by{' '}
              <a href="https://webmaster.ae" target="_blank" rel="noopener noreferrer">
                Webmaster Technology
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
