import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import Loading from '../components/Loading';
import '../styles/dashboard.css';

function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setStatsLoading(true);
      const [statsRes, bookmarksRes, progressRes] = await Promise.all([
        fetch('/api/user/stats', { credentials: 'include' }),
        fetch('/api/user/bookmarks', { credentials: 'include' }),
        fetch('/api/user/progress', { credentials: 'include' })
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
      
      if (bookmarksRes.ok) {
        const bookmarksData = await bookmarksRes.json();
        setBookmarks(bookmarksData.data || []);
      }
      
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      const res = await fetch(`/api/user/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setBookmarks(bookmarks.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="auth-prompt">
          <h1>Welcome to Quran Deen</h1>
          <p>Sign in to access your personal dashboard, track your reading progress, and save bookmarks.</p>
          <a href="/api/login" className="login-btn">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          {user?.profileImageUrl && (
            <img src={user.profileImageUrl} alt="Profile" className="user-avatar" />
          )}
          <div>
            <h1>Welcome, {user?.firstName || 'Reader'}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <a href="/api/logout" className="logout-btn">Logout</a>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card stats-card">
          <h2>Reading Progress</h2>
          {statsLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.completedSurahs}</span>
                <span className="stat-label">Completed Surahs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.inProgressSurahs}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.percentComplete}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
            </div>
          ) : (
            <p>Start reading to track your progress!</p>
          )}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats?.percentComplete || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-card resources-card">
          <h2>Free Resources</h2>
          <ul className="resources-list">
            <li>
              <Link to="/">Complete Quran with Translations</Link>
            </li>
            <li>
              <Link to="/mp3">Audio Recitations (150+ Reciters)</Link>
            </li>
            <li>
              <Link to="/juz">Browse by Juz/Para</Link>
            </li>
            <li>
              <Link to="/settings">Customize Your Experience</Link>
            </li>
          </ul>
        </div>

        <div className="dashboard-card bookmarks-card">
          <h2>My Bookmarks ({bookmarks.length})</h2>
          {bookmarks.length === 0 ? (
            <p className="empty-message">No bookmarks yet. Start reading and bookmark your favorite ayahs!</p>
          ) : (
            <ul className="bookmarks-list">
              {bookmarks.slice(0, 5).map((bookmark) => (
                <li key={bookmark.id} className="bookmark-item">
                  <Link to={`/surah/${bookmark.surahNumber}`}>
                    <span className="bookmark-ref">
                      {bookmark.surahName} ({bookmark.surahNumber}:{bookmark.ayahNumber})
                    </span>
                  </Link>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteBookmark(bookmark.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {bookmarks.length > 5 && (
            <Link to="/bookmarks" className="view-all-link">View All Bookmarks</Link>
          )}
        </div>

        <div className="dashboard-card tracker-card">
          <h2>Quran Read Tracker</h2>
          <p className="tracker-desc">Track which surahs you've read and completed.</p>
          {progress.length === 0 ? (
            <p className="empty-message">Start reading surahs to track your progress!</p>
          ) : (
            <div className="recent-progress">
              <h3>Recent Activity</h3>
              <ul className="progress-list">
                {progress.slice(0, 5).map((p) => (
                  <li key={p.id} className="progress-item">
                    <Link to={`/surah/${p.surahNumber}`}>
                      Surah {p.surahNumber}
                    </Link>
                    <span className={`status ${p.completed ? 'completed' : 'in-progress'}`}>
                      {p.completed ? 'Completed' : `Ayah ${p.lastAyahRead}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
