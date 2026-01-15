import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracker');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [progressRes, bookmarksRes, surahsRes] = await Promise.all([
        axios.get('/api/user/reading-progress'),
        axios.get('/api/user/bookmarks'),
        axios.get('/api/surahs')
      ]);
      setReadingProgress(progressRes.data.data || []);
      setBookmarks(bookmarksRes.data.data || []);
      setSurahs(surahsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markSurahRead = async (surahNumber, completed) => {
    try {
      await axios.post('/api/user/reading-progress', { surahNumber, completed });
      fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const removeBookmark = async (surah, ayah) => {
    try {
      await axios.delete(`/api/user/bookmarks/${surah}/${ayah}`);
      fetchData();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const completedSurahs = readingProgress.filter(p => p.completed).length;
  const progressPercent = Math.round((completedSurahs / 114) * 100);

  if (loading) return <Loading />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Assalamu Alaikum, {user?.name}</h1>
          <p>{user?.city && user?.country ? `${user.city}, ${user.country}` : 'Welcome to your Quran reading dashboard'}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{completedSurahs}</div>
          <div className="stat-label">Surahs Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{114 - completedSurahs}</div>
          <div className="stat-label">Surahs Remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{bookmarks.length}</div>
          <div className="stat-label">Bookmarks</div>
        </div>
        <div className="stat-card progress-card">
          <div className="progress-circle">
            <svg viewBox="0 0 36 36">
              <path
                className="progress-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="progress-fill"
                strokeDasharray={`${progressPercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="progress-text">{progressPercent}%</span>
          </div>
          <div className="stat-label">Overall Progress</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          Quran Read Tracker
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          My Bookmarks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Free Resources
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'tracker' && (
          <div className="tracker-section">
            <h2>Track Your Quran Reading</h2>
            <p className="section-desc">Mark surahs as completed as you read through the Quran</p>
            <div className="surah-tracker-grid">
              {surahs.map((surah) => {
                const progress = readingProgress.find(p => p.surah_number === surah.number);
                const isCompleted = progress?.completed;
                return (
                  <div key={surah.number} className={`tracker-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="tracker-info">
                      <span className="tracker-number">{surah.number}</span>
                      <div className="tracker-names">
                        <span className="tracker-english">{surah.englishName}</span>
                        <span className="tracker-arabic">{surah.name}</span>
                      </div>
                    </div>
                    <div className="tracker-actions">
                      <Link to={`/surah/${surah.number}`} className="read-btn">Read</Link>
                      <button 
                        className={`mark-btn ${isCompleted ? 'completed' : ''}`}
                        onClick={() => markSurahRead(surah.number, !isCompleted)}
                      >
                        {isCompleted ? '✓' : '○'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="bookmarks-section">
            <h2>Your Bookmarked Ayahs</h2>
            {bookmarks.length === 0 ? (
              <div className="empty-state">
                <p>You haven't bookmarked any ayahs yet.</p>
                <Link to="/" className="browse-btn">Browse Surahs</Link>
              </div>
            ) : (
              <div className="bookmarks-list">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="bookmark-card">
                    <div className="bookmark-ref">
                      Surah {bookmark.surah_number}, Ayah {bookmark.ayah_number}
                    </div>
                    {bookmark.arabic_text && (
                      <p className="bookmark-arabic">{bookmark.arabic_text}</p>
                    )}
                    {bookmark.translation && (
                      <p className="bookmark-translation">{bookmark.translation}</p>
                    )}
                    <div className="bookmark-actions">
                      <Link to={`/surah/${bookmark.surah_number}`} className="view-btn">View Surah</Link>
                      <button 
                        className="remove-btn"
                        onClick={() => removeBookmark(bookmark.surah_number, bookmark.ayah_number)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            <h2>Free Islamic Resources</h2>
            <div className="resources-grid">
              <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">📖</div>
                <h3>Quran.com</h3>
                <p>Read Quran with multiple translations and tafsirs</p>
              </a>
              <a href="https://sunnah.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">📚</div>
                <h3>Sunnah.com</h3>
                <p>Explore authentic Hadith collections</p>
              </a>
              <a href="https://islamqa.info" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">❓</div>
                <h3>IslamQA</h3>
                <p>Get answers to Islamic questions</p>
              </a>
              <a href="https://islamicfinder.org/prayer-times/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">🕌</div>
                <h3>Prayer Times</h3>
                <p>Find accurate prayer times for your location</p>
              </a>
              <a href="https://99namesofallah.name" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">✨</div>
                <h3>99 Names of Allah</h3>
                <p>Learn the beautiful names of Allah</p>
              </a>
              <a href="https://myislam.org/dua/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">🤲</div>
                <h3>Daily Duas</h3>
                <p>Collection of authentic duas for daily life</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
