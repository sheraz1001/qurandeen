import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyAyah, setDailyAyah] = useState(null);
  const [dailyAyahLoading, setDailyAyahLoading] = useState(true);
  const [readingHistory, setReadingHistory] = useState([]);

  useEffect(() => {
    fetchSurahs();
    fetchDailyAyah();
    loadReadingHistory();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/surahs');
      setSurahs(response.data.data);
    } catch (err) {
      setError('Failed to load surahs. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyAyah = async () => {
    try {
      setDailyAyahLoading(true);
      const today = new Date().toDateString();
      const cached = localStorage.getItem('dailyAyah');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is valid and has new format (arabic, english, urdu)
        if (parsed.date === today && parsed.ayah && parsed.ayah.arabic) {
          setDailyAyah(parsed.ayah);
          setDailyAyahLoading(false);
          return;
        }
      }
      // Clear old cache and fetch fresh data
      localStorage.removeItem('dailyAyah');
      const response = await axios.get('/api/random-ayah');
      const ayah = response.data.data;
      localStorage.setItem('dailyAyah', JSON.stringify({ date: today, ayah }));
      setDailyAyah(ayah);
    } catch (err) {
      console.error('Error fetching daily ayah:', err);
    } finally {
      setDailyAyahLoading(false);
    }
  };

  const loadReadingHistory = () => {
    const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    setReadingHistory(history.slice(0, 5));
  };

  const shareAyah = (platform, text, surahName, verseRef) => {
    const shareText = `"${text}" - ${surahName} (${verseRef})`;
    const url = window.location.origin;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurahs} />;

  return (
    <div className="home">
      <div className="hero">
        <h1>The Holy Quran</h1>
        <p>Read, listen, and explore the divine words</p>
      </div>

      <div className="browse-links">
        <Link to="/juz" className="browse-link">
          <span>📖</span> Browse by Juz
        </Link>
        <Link to="/bookmarks" className="browse-link">
          <span>🔖</span> My Bookmarks
        </Link>
        <Link to="/settings" className="browse-link">
          <span>⚙️</span> Settings
        </Link>
      </div>

      {dailyAyah && (
        <div className="daily-ayah-section">
          <h2 className="section-title">Ayah of the Day</h2>
          <div className="daily-ayah-card">
            <p className="daily-ayah-arabic">{dailyAyah.arabic}</p>
            <div className="daily-ayah-translations">
              <p className="daily-ayah-english">{dailyAyah.english}</p>
              <p className="daily-ayah-urdu">{dailyAyah.urdu}</p>
            </div>
            <div className="daily-ayah-ref">
              <Link to={`/surah/${dailyAyah.surah.number}`}>
                {dailyAyah.surah.englishName} ({dailyAyah.surah.number}:{dailyAyah.numberInSurah})
              </Link>
            </div>
            <div className="share-buttons">
              <button 
                className="share-btn"
                onClick={() => shareAyah('twitter', dailyAyah.english, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Share on Twitter"
              >
                𝕏
              </button>
              <button 
                className="share-btn whatsapp"
                onClick={() => shareAyah('whatsapp', dailyAyah.english, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Share on WhatsApp"
              >
                💬
              </button>
              <button 
                className="share-btn"
                onClick={() => shareAyah('copy', `${dailyAyah.arabic}\n\n${dailyAyah.english}\n\n${dailyAyah.urdu}`, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      )}

      {readingHistory.length > 0 && (
        <div className="reading-history-section">
          <h2 className="section-title">Continue Reading</h2>
          <div className="history-list">
            {readingHistory.map((item) => (
              <Link to={`/surah/${item.number}`} key={item.number} className="history-item">
                <span className="history-number">{item.number}</span>
                <div className="history-info">
                  <span className="history-name">{item.englishName}</span>
                  <span className="history-date">{new Date(item.lastRead).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <h2 className="section-title">All Surahs</h2>
      <div className="surahs-grid">
        {surahs.map((surah) => (
          <Link to={`/surah/${surah.number}`} key={surah.number} className="surah-card">
            <div className="surah-number">{surah.number}</div>
            <div className="surah-info">
              <h3 className="surah-name-arabic">{surah.name}</h3>
              <h4 className="surah-name-english">{surah.englishName}</h4>
              <p className="surah-translation">{surah.englishNameTranslation}</p>
              <span className="surah-meta">
                {surah.revelationType} • {surah.numberOfAyahs} Ayahs
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
