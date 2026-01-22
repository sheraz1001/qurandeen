import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/megamenu.css';

function Header({ darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (paths) => paths.some(p => location.pathname.startsWith(p));

  const handleMouseEnter = (dropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const quranLinks = [
    { 
      path: '/quran-juz-browser', 
      label: 'Quran Juz Browser', 
      icon: '📖',
      description: 'Browse all 30 Juz of the Quran'
    },
    { 
      path: '/quran-mp3-audio', 
      label: 'Quran Audio', 
      icon: '🎧',
      description: '150+ reciters with full surah audio'
    },
  ];

  const resourceCategories = {
    collections: {
      title: 'Islamic Collections',
      icon: '📚',
      links: [
        { path: '/hadith', label: 'Hadith Collections', icon: '📕', description: '17 books with 50,000+ authentic hadiths' },
        { path: '/azkaar', label: 'Daily Azkaar & Duas', icon: '🤲', description: '134 categories from Hisnul Muslim' },
        { path: '/islamic-resources/names-of-allah', label: '99 Names of Allah', icon: '✨', description: 'Asma ul Husna with meanings' },
      ]
    },
    dailyContent: {
      title: 'Daily Inspiration',
      icon: '🌟',
      links: [
        { path: '/islamic-resources/verse-of-day', label: 'Verse of the Day', icon: '📖', description: 'Daily Quranic verse with reflection' },
        { path: '/islamic-resources/hadith-of-day', label: 'Hadith of the Day', icon: '📜', description: 'Daily authentic hadith selection' },
        { path: '/islamic-resources/adhkar', label: 'Morning & Evening Adhkar', icon: '🌅', description: 'Daily remembrance duas' },
      ]
    },
    prayerTools: {
      title: 'Prayer & Worship',
      icon: '🕌',
      links: [
        { path: '/islamic-resources/prayer-times', label: 'Prayer Times', icon: '🕐', description: 'Accurate times for your location' },
        { path: '/islamic-resources/qibla-direction', label: 'Qibla Direction', icon: '🧭', description: 'Find Qibla from anywhere' },
        { path: '/islamic-resources/ramadan-calendar', label: 'Ramadan Calendar', icon: '🌙', description: 'Suhoor & Iftar timings' },
      ]
    },
    calendarTools: {
      title: 'Calendar & Dates',
      icon: '📅',
      links: [
        { path: '/hijri-calendar', label: 'Hijri-Gregorian Calendar', icon: '📅', description: 'Full Islamic calendar with events' },
        { path: '/islamic-resources/hijri-converter', label: 'Date Converter', icon: '🔄', description: 'Convert between calendars' },
        { path: '/islamic-resources/historical-dates', label: 'Historical Dates', icon: '📜', description: 'Explore major Islamic events' },
      ]
    },
    creativeTools: {
      title: 'Creative Tools',
      icon: '🎨',
      links: [
        { path: '/islamic-resources/share-card', label: 'Quran Share Card', icon: '🖼️', description: 'Create beautiful verse images' },
        { path: '/islamic-ai-scholar', label: 'AI Islamic Scholar', icon: '🤖', description: 'Ask Islamic questions' },
      ]
    },
    content: {
      title: 'Content & Learning',
      icon: '📝',
      links: [
        { path: '/blogs', label: 'Islamic Blog', icon: '📝', description: 'Articles on Islamic knowledge' },
        { path: '/teachers', label: 'Find Quran Teachers', icon: '👨‍🏫', description: 'Learn from verified teachers' },
      ]
    }
  };

  const allResourceLinks = Object.values(resourceCategories).flatMap(cat => cat.links);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <div className="social-icons">
              <a href="https://www.facebook.com/qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/qurandeencom/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <span className="top-bar-text">Read, Listen & Learn the Holy Quran</span>
          </div>
          <div className="top-bar-right">
            <Link to="/bookmarks" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Bookmarks</span>
            </Link>
            <Link to="/settings" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Settings</span>
            </Link>
            <Link to="/contact" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Contact</span>
            </Link>
            <Link to="/donate" className="top-bar-link donate-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Donate</span>
            </Link>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="top-bar-link profile-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{user.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="top-bar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="top-bar-link signup-link">
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            <button 
              className="theme-toggle-top" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img 
              src="/logo.png" 
              alt="Quran Deen - Online Quran Explorer and AI Scholar" 
              className="logo-image"
            />
          </Link>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>

              <li 
                className={`nav-item has-dropdown ${activeDropdown === 'quran' ? 'dropdown-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('quran')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`nav-link dropdown-trigger ${isActiveGroup(['/quran-juz-browser', '/quran-mp3-audio', '/surah']) ? 'active' : ''}`}
                  aria-expanded={activeDropdown === 'quran'}
                  aria-haspopup="true"
                >
                  Quran
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    <div className="mega-dropdown-section">
                      <h3 className="mega-section-title">
                        <span className="title-icon">📖</span>
                        Explore the Quran
                      </h3>
                      <div className="mega-links">
                        {quranLinks.map((link) => (
                          <Link 
                            key={link.path}
                            to={link.path} 
                            className={`mega-link ${isActive(link.path) ? 'active' : ''}`}
                          >
                            <span className="mega-link-icon">{link.icon}</span>
                            <div className="mega-link-content">
                              <span className="mega-link-title">{link.label}</span>
                              <span className="mega-link-desc">{link.description}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mega-dropdown-featured">
                      <div className="featured-card">
                        <div className="featured-icon">🕌</div>
                        <h4>Start Reading</h4>
                        <p>Begin your Quran journey with Surah Al-Fatihah</p>
                        <Link to="/surah/1-al-fatihah" className="featured-btn">Read Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li 
                className={`nav-item has-dropdown ${activeDropdown === 'resources' ? 'dropdown-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/islamic-resources"
                  className={`nav-link dropdown-trigger ${isActiveGroup(['/islamic-resources', '/azkaar', '/blogs', '/hadith', '/hijri-calendar']) ? 'active' : ''}`}
                  aria-expanded={activeDropdown === 'resources'}
                  aria-haspopup="true"
                >
                  Resources
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </Link>
                <div className="mega-dropdown mega-dropdown-full">
                  <div className="mega-dropdown-content mega-grid-layout">
                    {Object.entries(resourceCategories).map(([key, category]) => (
                      <div key={key} className="mega-dropdown-column">
                        <h3 className="mega-section-title">
                          <span className="title-icon">{category.icon}</span>
                          {category.title}
                        </h3>
                        <div className="mega-links">
                          {category.links.map((link) => (
                            <Link 
                              key={link.path}
                              to={link.path} 
                              className={`mega-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                              <span className="mega-link-icon">{link.icon}</span>
                              <div className="mega-link-content">
                                <span className="mega-link-title">{link.label}</span>
                                <span className="mega-link-desc">{link.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mega-dropdown-footer-full">
                      <Link to="/islamic-resources" className="view-all-link">
                        View All Islamic Resources
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link 
                  to="/islamic-ai-scholar" 
                  className={`nav-link ${isActive('/islamic-ai-scholar') ? 'active' : ''}`}
                >
                  AI Scholar
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  to="/teachers" 
                  className={`nav-link nav-link-highlight ${isActiveGroup(['/teachers', '/teach-with-us', '/become-teacher']) ? 'active' : ''}`}
                >
                  Quran Classes
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search ayahs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>

            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="mobile-nav-section">
              <span className="mobile-nav-section-title">Quran</span>
              {quranLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`mobile-nav-link mobile-nav-sublink ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </li>
            {Object.entries(resourceCategories).map(([key, category]) => (
              <li key={key} className="mobile-nav-section">
                <span className="mobile-nav-section-title">{category.icon} {category.title}</span>
                {category.links.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`mobile-nav-link mobile-nav-sublink ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </li>
            ))}
            <li>
              <Link 
                to="/islamic-ai-scholar" 
                className={`mobile-nav-link ${isActive('/islamic-ai-scholar') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Scholar
              </Link>
            </li>
            <li>
              <Link 
                to="/teachers" 
                className={`mobile-nav-link highlight ${isActive('/teachers') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Quran Classes
              </Link>
            </li>
            <li>
              <Link 
                to="/bookmarks" 
                className={`mobile-nav-link ${isActive('/bookmarks') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Bookmarks
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`mobile-nav-link ${isActive('/settings') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </li>
          </ul>
          <form className="mobile-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search the Quran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">Search</button>
          </form>
          <div className="mobile-auth">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="mobile-auth-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-auth-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="mobile-auth-link signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
