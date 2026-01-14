import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ darkMode, toggleDarkMode, fontSize, setFontSize }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFontControls, setShowFontControls] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const increaseFontSize = () => setFontSize(Math.min(fontSize + 4, 48));
  const decreaseFontSize = () => setFontSize(Math.max(fontSize - 4, 16));

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">&#9784;</span>
          <span className="logo-text">Quran Online</span>
        </Link>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search the Quran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <div className="header-actions">
          <Link to="/bookmarks" className="header-icon-btn" title="Bookmarks">
            🔖
          </Link>

          <div className="font-size-wrapper">
            <button 
              className="header-icon-btn"
              onClick={() => setShowFontControls(!showFontControls)}
              title="Font Size"
            >
              Aa
            </button>
            {showFontControls && (
              <div className="font-size-dropdown">
                <button onClick={decreaseFontSize} className="font-btn">A-</button>
                <span className="font-size-value">{fontSize}px</span>
                <button onClick={increaseFontSize} className="font-btn">A+</button>
              </div>
            )}
          </div>

          <button 
            className="header-icon-btn" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
