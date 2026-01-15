import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/juz', label: 'Juz', icon: '📖' },
    { path: '/mp3', label: 'MP3', icon: '🎧' },
    { path: '/blog', label: 'Blog', icon: '📝' },
    { path: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          <Link to="/" className="logo">
            <img 
              src="/logo.png" 
              alt="Quran Deen" 
              className="logo-image"
            />
          </Link>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link 
                    to={link.path} 
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                  </Link>
                </li>
              ))}
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
              className="theme-toggle" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-icon">{darkMode ? '☀️' : '🌙'}</span>
            </button>

            {user ? (
              <div className="user-menu">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="user-btn"
                  title="Dashboard"
                >
                  <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}

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
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
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
