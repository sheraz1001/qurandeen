import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const quranLinks = [
    { path: '/quran', label: 'Browse Surahs' },
    { path: '/quran-juz-browser', label: 'Juz Browser' },
    { path: '/quran/word-by-word', label: 'Word by Word' },
    { path: '/quran-share-card', label: 'Share Card' },
    { path: '/bookmarks', label: 'Bookmarks' },
  ];

  const popularSurahs = [
    { slug: '1-al-fatihah', name: 'Al-Fatiha' },
    { slug: '2-al-baqara', name: 'Al-Baqara' },
    { slug: '36-ya-sin', name: 'Ya-Sin' },
    { slug: '55-ar-rahman', name: 'Ar-Rahman' },
    { slug: '67-al-mulk', name: 'Al-Mulk' },
  ];

  const resources = [
    { path: '/hadith', label: 'Hadith Library' },
    { path: '/azkaar', label: 'Azkaar & Duas' },
    { path: '/names-of-allah', label: '99 Names of Allah' },
    { path: '/prayer-times', label: 'Prayer Times' },
    { path: '/hijri-calendar', label: 'Hijri Calendar' },
  ];

  const moreLinks = [
    { path: '/ai-scholar', label: 'AI Scholar' },
    { path: '/quran-classes', label: 'Quran Classes' },
    { path: '/teach-with-us', label: 'Become Teacher' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const legalLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/settings', label: 'Settings' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/terms', label: 'Terms' },
  ];

  return (
    <footer className="footer-compact">
      <div className="footer-texture"></div>
      
      <div className="footer-content">
        <div className="footer-container-compact">
          <div className="footer-top-row">
            <div className="footer-brand-compact">
              <img src="/logo.png" alt="Quran Deen" className="footer-logo-sm" />
            </div>
            
            <div className="footer-stats-inline">
              <span className="stat-item"><strong>114</strong> Surahs</span>
              <span className="stat-divider">|</span>
              <span className="stat-item"><strong>150+</strong> Reciters</span>
              <span className="stat-divider">|</span>
              <span className="stat-item"><strong>100+</strong> Translations</span>
              <span className="stat-divider">|</span>
              <span className="stat-item"><strong>50K+</strong> Hadiths</span>
            </div>
            
            <div className="footer-social-compact">
              <a href="https://www.facebook.com/qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://x.com/qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/qurandeencom/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.youtube.com/@qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@qurandeencom" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/qurandeen/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://linkthread.com/quran" target="_blank" rel="noopener noreferrer" aria-label="LinkThread">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h5 className="footer-col-title">Quran</h5>
              <ul>
                {quranLinks.map((link) => (
                  <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-col-title">Popular Surahs</h5>
              <ul>
                {popularSurahs.map((surah) => (
                  <li key={surah.slug}><Link to={`/surah/${surah.slug}`}>{surah.name}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-col-title">Resources</h5>
              <ul>
                {resources.map((link) => (
                  <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-col-title">More</h5>
              <ul>
                {moreLinks.map((link) => (
                  <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-col-title">Site</h5>
              <ul>
                {legalLinks.map((link) => (
                  <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-compact">
        <div className="footer-container-compact">
          <p>&copy; {currentYear} QuranDeen.com</p>
          <p>Developed by <a href="https://webmaster.ae" target="_blank" rel="noopener noreferrer">Webmaster Technology</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
