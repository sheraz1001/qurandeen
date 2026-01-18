import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import { getSurahByNumber } from '../data/surahData';

function Bookmarks({ fontSize }) {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Bookmarks' }
  ];
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)));
  };

  const removeBookmark = (surah, ayah) => {
    const updated = bookmarks.filter(b => !(b.surah === surah && b.ayah === ayah));
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      setBookmarks([]);
      localStorage.setItem('bookmarks', JSON.stringify([]));
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-page">
        <SEO 
          title="Your Bookmarks - Saved Quran Verses"
          description="View and manage your saved Quran bookmarks. Keep track of your favorite ayahs and return to them anytime."
          canonical="https://qurandeen.com/bookmarks"
          breadcrumbs={breadcrumbs}
          noindex={true}
        />
        <HeroAnimated
          icon="🔖"
          title="Your Bookmarks"
          subtitle="Save and organize your favorite ayahs"
          breadcrumbs={breadcrumbs}
        />
        <div className="empty-bookmarks">
          <p>No bookmarks yet</p>
          <p className="empty-hint">While reading, tap the bookmark icon on any ayah to save it here.</p>
          <Link to="/" className="back-link">Browse Surahs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <SEO 
        title="Your Bookmarks - Saved Quran Verses"
        description="View and manage your saved Quran bookmarks. Keep track of your favorite ayahs and return to them anytime."
        canonical="https://qurandeen.com/bookmarks"
        breadcrumbs={breadcrumbs}
        noindex={true}
      />
      <HeroAnimated
        icon="🔖"
        title="Your Bookmarks"
        subtitle={`${bookmarks.length} saved ayahs`}
        breadcrumbs={breadcrumbs}
      />
      <div className="bookmarks-header">
        <button className="clear-btn" onClick={clearAllBookmarks}>
          Clear All
        </button>
      </div>

      <div className="bookmarks-list">
        {bookmarks.map((bookmark, index) => (
          <div key={index} className="bookmark-card">
            <div className="bookmark-header">
              <Link to={`/surah/${getSurahByNumber(bookmark.surah)?.slug || bookmark.surah}`} className="bookmark-ref">
                {bookmark.surahName} ({bookmark.surah}:{bookmark.ayah})
              </Link>
              <button 
                className="remove-btn"
                onClick={() => removeBookmark(bookmark.surah, bookmark.ayah)}
                title="Remove bookmark"
              >
                ✕
              </button>
            </div>
            <p className="bookmark-arabic" style={{ fontSize: `${fontSize / 16}rem` }}>
              {bookmark.arabicText}
            </p>
            <p className="bookmark-translation">{bookmark.translationText}</p>
            <span className="bookmark-date">
              Saved on {new Date(bookmark.savedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookmarks;
