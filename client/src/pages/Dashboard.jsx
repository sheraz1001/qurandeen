import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

function Dashboard() {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracker');
  
  const [profileForm, setProfileForm] = useState({ name: '', city: '', country: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        city: user.city || '',
        country: user.country || ''
      });
    }
  }, [user]);

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setSavingProfile(true);
    
    try {
      const res = await axios.put('/api/user/profile', profileForm);
      setProfileMessage({ type: 'success', text: res.data.message });
      if (checkAuth) checkAuth();
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const res = await axios.put('/api/user/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: res.data.message });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
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
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
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

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-grid">
              <div className="profile-card">
                <h2>Edit Profile</h2>
                <p className="section-desc">Update your personal information</p>
                
                {profileMessage.text && (
                  <div className={`message ${profileMessage.type}`}>
                    {profileMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="form-input disabled"
                    />
                    <small className="form-hint">Email cannot be changed</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your name"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="Enter your city"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        id="country"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        placeholder="Enter your country"
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="save-btn" disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
              
              <div className="profile-card">
                <h2>Change Password</h2>
                <p className="section-desc">Update your account password</p>
                
                {passwordMessage.text && (
                  <div className={`message ${passwordMessage.type}`}>
                    {passwordMessage.text}
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="form-input"
                      required
                      minLength={6}
                    />
                    <small className="form-hint">Minimum 6 characters</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="save-btn" disabled={changingPassword}>
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="account-info">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Account Type</span>
                  <span className="info-value">{user?.role === 'admin' ? 'Administrator' : 'Member'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email}</span>
                </div>
              </div>
            </div>
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
