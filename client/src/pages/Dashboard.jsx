import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { getSurahByNumber } from '../data/surahData';

function Dashboard() {
  const { user, logout, checkAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [profileForm, setProfileForm] = useState({ name: '', city: '', country: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [donations, setDonations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(null);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [newPasswordForce, setNewPasswordForce] = useState('');
  const [confirmPasswordForce, setConfirmPasswordForce] = useState('');
  const [forcePasswordError, setForcePasswordError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
    checkForcePasswordChange();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (activeSection === 'billing') {
      fetchBillingData();
    }
  }, [activeSection]);

  const checkForcePasswordChange = async () => {
    try {
      const res = await axios.get('/api/user/force-password-change');
      if (res.data.forcePasswordChange) {
        setForcePasswordChange(true);
      }
    } catch (error) {
      console.error('Error checking password status:', error);
    }
  };

  const fetchBillingData = async () => {
    setBillingLoading(true);
    try {
      const [donationsRes, subscriptionsRes] = await Promise.all([
        axios.get('/api/user/donations'),
        axios.get('/api/user/subscriptions')
      ]);
      setDonations(donationsRes.data.data || []);
      setSubscriptions(subscriptionsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this monthly donation? This action cannot be undone.')) {
      return;
    }
    setCancellingSubscription(subscriptionId);
    try {
      await axios.post(`/api/user/subscriptions/${subscriptionId}/cancel`);
      fetchBillingData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancellingSubscription(null);
    }
  };

  const handleForcePasswordSubmit = async (e) => {
    e.preventDefault();
    setForcePasswordError('');
    
    if (newPasswordForce !== confirmPasswordForce) {
      setForcePasswordError('Passwords do not match');
      return;
    }
    if (newPasswordForce.length < 6) {
      setForcePasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await axios.post('/api/user/complete-password-change', { newPassword: newPasswordForce });
      setForcePasswordChange(false);
      setNewPasswordForce('');
      setConfirmPasswordForce('');
    } catch (error) {
      setForcePasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

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

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { id: 'tracker', label: 'Quran Tracker', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )},
    { id: 'bookmarks', label: 'My Bookmarks', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    )},
    { id: 'resources', label: 'QuranDeen Tools', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )},
    { id: 'divider1', type: 'divider' },
    { id: 'profile', label: 'Edit Profile', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )},
    { id: 'account', label: 'Account Info', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    )},
    { id: 'billing', label: 'Billing & Donations', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )},
  ];

  if (authLoading || loading) return <Loading />;

  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <h3>{user?.name}</h3>
              <span>{user?.email}</span>
            </div>
          )}
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              {sidebarCollapsed ? (
                <polyline points="9 18 15 12 9 6"/>
              ) : (
                <polyline points="15 18 9 12 15 6"/>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Dashboard</span>}
            {menuItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="nav-divider"></div>

          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Account</span>}
            {menuItems.slice(5).map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" title={sidebarCollapsed ? 'Logout' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {activeSection === 'overview' && 'Dashboard Overview'}
              {activeSection === 'tracker' && 'Quran Read Tracker'}
              {activeSection === 'bookmarks' && 'My Bookmarks'}
              {activeSection === 'resources' && 'QuranDeen Tools & Resources'}
              {activeSection === 'profile' && 'Edit Profile'}
              {activeSection === 'security' && 'Security Settings'}
              {activeSection === 'account' && 'Account Information'}
              {activeSection === 'billing' && 'Billing & Donations'}
            </h1>
          </div>
          <div className="topbar-right">
            <span className="greeting">Assalamu Alaikum, {user?.name?.split(' ')[0]}</span>
          </div>
        </div>

        <div className="dashboard-content">
          {activeSection === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{completedSurahs}</span>
                    <span className="stat-label">Surahs Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{114 - completedSurahs}</span>
                    <span className="stat-label">Surahs Remaining</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{bookmarks.length}</span>
                    <span className="stat-label">Saved Bookmarks</span>
                  </div>
                </div>
                <div className="stat-card progress">
                  <div className="progress-ring">
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
                  <span className="stat-label">Overall Progress</span>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <Link to="/" className="action-card">
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    <span>Read Quran</span>
                  </Link>
                  <Link to="/juz" className="action-card">
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                      </svg>
                    </div>
                    <span>Browse Juz</span>
                  </Link>
                  <Link to="/audio" className="action-card">
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                    </div>
                    <span>Audio Quran</span>
                  </Link>
                  <Link to="/ai-scholar" className="action-card">
                    <div className="action-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <span>AI Scholar</span>
                  </Link>
                </div>
              </div>

              {bookmarks.length > 0 && (
                <div className="recent-bookmarks">
                  <div className="section-header">
                    <h2>Recent Bookmarks</h2>
                    <button className="view-all-btn" onClick={() => setActiveSection('bookmarks')}>View All</button>
                  </div>
                  <div className="bookmarks-preview">
                    {bookmarks.slice(0, 3).map((bookmark) => (
                      <div key={bookmark.id} className="bookmark-preview-card">
                        <div className="bookmark-ref">
                          Surah {bookmark.surah_number}, Ayah {bookmark.ayah_number}
                        </div>
                        {bookmark.arabic_text && (
                          <p className="bookmark-arabic">{bookmark.arabic_text.substring(0, 100)}...</p>
                        )}
                        <Link to={`/surah/${getSurahByNumber(bookmark.surah_number)?.slug || bookmark.surah_number}`} className="view-link">View</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'tracker' && (
            <div className="tracker-section">
              <div className="tracker-header">
                <p className="section-desc">Mark surahs as completed as you progress through the Holy Quran</p>
                <div className="tracker-stats">
                  <span className="completed-count">{completedSurahs} of 114 completed</span>
                </div>
              </div>
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
                        <Link to={`/surah/${getSurahByNumber(surah.number)?.slug || surah.number}`} className="read-btn">Read</Link>
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

          {activeSection === 'bookmarks' && (
            <div className="bookmarks-section">
              {bookmarks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <h3>No Bookmarks Yet</h3>
                  <p>You haven't bookmarked any ayahs yet. Start reading and save your favorite verses.</p>
                  <Link to="/" className="browse-btn">Browse Surahs</Link>
                </div>
              ) : (
                <div className="bookmarks-list">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="bookmark-card">
                      <div className="bookmark-header">
                        <span className="bookmark-ref">
                          Surah {bookmark.surah_number}, Ayah {bookmark.ayah_number}
                        </span>
                        <button 
                          className="remove-btn"
                          onClick={() => removeBookmark(bookmark.surah_number, bookmark.ayah_number)}
                          title="Remove bookmark"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      {bookmark.arabic_text && (
                        <p className="bookmark-arabic">{bookmark.arabic_text}</p>
                      )}
                      {bookmark.translation && (
                        <p className="bookmark-translation">{bookmark.translation}</p>
                      )}
                      <Link to={`/surah/${getSurahByNumber(bookmark.surah_number)?.slug || bookmark.surah_number}`} className="view-btn">View in Surah</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'resources' && (
            <div className="resources-section">
              <div className="resources-intro">
                <p>Access all QuranDeen tools and resources to enhance your Islamic learning journey.</p>
              </div>
              
              <div className="resources-category">
                <h3>Quran Reading & Learning</h3>
                <div className="resources-grid">
                  <Link to="/" className="resource-card internal">
                    <div className="resource-icon">📖</div>
                    <div className="resource-content">
                      <h4>Read Quran</h4>
                      <p>Browse all 114 Surahs with multiple translations and Arabic scripts</p>
                    </div>
                  </Link>
                  <Link to="/juz" className="resource-card internal">
                    <div className="resource-icon">📚</div>
                    <div className="resource-content">
                      <h4>Juz Browser</h4>
                      <p>Navigate the Quran by Juz (Para) with easy navigation</p>
                    </div>
                  </Link>
                  <Link to="/audio" className="resource-card internal">
                    <div className="resource-icon">🎧</div>
                    <div className="resource-content">
                      <h4>Audio Quran</h4>
                      <p>Listen to full Surah recitations from 150+ world-renowned reciters</p>
                    </div>
                  </Link>
                  <Link to="/bookmarks" className="resource-card internal">
                    <div className="resource-icon">🔖</div>
                    <div className="resource-content">
                      <h4>Bookmarks</h4>
                      <p>View and manage your saved ayahs and favorite verses</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="resources-category">
                <h3>Islamic Tools</h3>
                <div className="resources-grid">
                  <Link to="/tools/share-card" className="resource-card internal">
                    <div className="resource-icon">🎨</div>
                    <div className="resource-content">
                      <h4>Quran Share Card</h4>
                      <p>Create beautiful verse cards for social media sharing</p>
                    </div>
                  </Link>
                  <Link to="/tools/verse-of-day" className="resource-card internal">
                    <div className="resource-icon">✨</div>
                    <div className="resource-content">
                      <h4>Verse of the Day</h4>
                      <p>Daily inspiration with a random Quran verse</p>
                    </div>
                  </Link>
                  <Link to="/tools/hijri-converter" className="resource-card internal">
                    <div className="resource-icon">📅</div>
                    <div className="resource-content">
                      <h4>Hijri Calendar</h4>
                      <p>Convert between Hijri and Gregorian dates</p>
                    </div>
                  </Link>
                  <Link to="/tools/adhkar" className="resource-card internal">
                    <div className="resource-icon">🤲</div>
                    <div className="resource-content">
                      <h4>Morning & Evening Adhkar</h4>
                      <p>Authentic duas for morning and evening remembrance</p>
                    </div>
                  </Link>
                  <Link to="/tools/names-of-allah" className="resource-card internal">
                    <div className="resource-icon">💫</div>
                    <div className="resource-content">
                      <h4>99 Names of Allah</h4>
                      <p>Explore the beautiful names with meanings and references</p>
                    </div>
                  </Link>
                  <Link to="/tools/hadith" className="resource-card internal">
                    <div className="resource-icon">📜</div>
                    <div className="resource-content">
                      <h4>Hadith of the Day</h4>
                      <p>Curated authentic hadiths with explanations</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="resources-category">
                <h3>AI & Knowledge</h3>
                <div className="resources-grid">
                  <Link to="/ai-scholar" className="resource-card internal featured">
                    <div className="resource-icon">🤖</div>
                    <div className="resource-content">
                      <h4>AI Islamic Scholar</h4>
                      <p>Ask questions about Quran, Hadith, and Islamic teachings</p>
                    </div>
                  </Link>
                  <Link to="/blogs" className="resource-card internal">
                    <div className="resource-icon">📝</div>
                    <div className="resource-content">
                      <h4>Islamic Blog</h4>
                      <p>Read articles on Islamic knowledge and spirituality</p>
                    </div>
                  </Link>
                  <Link to="/features" className="resource-card internal">
                    <div className="resource-icon">🌟</div>
                    <div className="resource-content">
                      <h4>All Features</h4>
                      <p>Explore all QuranDeen features and capabilities</p>
                    </div>
                  </Link>
                  <Link to="/settings" className="resource-card internal">
                    <div className="resource-icon">⚙️</div>
                    <div className="resource-content">
                      <h4>Settings</h4>
                      <p>Customize fonts, translations, reciters, and more</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal details</p>
                </div>
                
                {profileMessage.text && (
                  <div className={`message ${profileMessage.type}`}>
                    {profileMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="form-input disabled"
                    />
                    <small className="form-hint">Email address cannot be changed</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your full name"
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
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="security-section">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Change Password</h2>
                  <p>Keep your account secure with a strong password</p>
                </div>
                
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
                    <small className="form-hint">Minimum 6 characters required</small>
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
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              <div className="security-tips">
                <h3>Security Tips</h3>
                <ul>
                  <li>Use a unique password that you don't use on other websites</li>
                  <li>Include a mix of letters, numbers, and special characters</li>
                  <li>Avoid using personal information like birthdays or names</li>
                  <li>Change your password periodically for better security</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="account-section">
              <div className="account-card">
                <div className="card-header">
                  <h2>Account Details</h2>
                  <p>Your account information and status</p>
                </div>
                
                <div className="account-details">
                  <div className="detail-row">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {user?.city && user?.country ? `${user.city}, ${user.country}` : 'Not specified'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Account Type</span>
                    <span className="detail-value account-type">
                      {user?.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Surahs Completed</span>
                    <span className="detail-value">{completedSurahs} of 114</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Saved Bookmarks</span>
                    <span className="detail-value">{bookmarks.length}</span>
                  </div>
                </div>
              </div>

              <div className="account-actions-card">
                <h3>Quick Links</h3>
                <div className="account-links">
                  <button onClick={() => setActiveSection('profile')} className="account-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profile
                  </button>
                  <button onClick={() => setActiveSection('security')} className="account-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Change Password
                  </button>
                  <Link to="/settings" className="account-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    App Settings
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="billing-section">
              {billingLoading ? (
                <div className="billing-loading">Loading billing information...</div>
              ) : (
                <>
                  {subscriptions.length > 0 && (
                    <div className="billing-card">
                      <div className="card-header">
                        <h2>Active Subscriptions</h2>
                        <p>Manage your monthly donations</p>
                      </div>
                      <div className="subscriptions-list">
                        {subscriptions.map((sub) => (
                          <div key={sub.stripe_subscription_id} className="subscription-item">
                            <div className="subscription-info">
                              <span className="subscription-amount">${parseFloat(sub.amount).toFixed(2)}/month</span>
                              <span className={`subscription-status ${sub.stripe_status || 'active'}`}>
                                {sub.cancel_at_period_end ? 'Cancelling' : (sub.stripe_status || 'active')}
                              </span>
                            </div>
                            <div className="subscription-details">
                              {sub.current_period_end && (
                                <span className="next-billing">
                                  Next billing: {new Date(sub.current_period_end * 1000).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {!sub.cancel_at_period_end && sub.stripe_status === 'active' && (
                              <button 
                                className="cancel-subscription-btn"
                                onClick={() => handleCancelSubscription(sub.stripe_subscription_id)}
                                disabled={cancellingSubscription === sub.stripe_subscription_id}
                              >
                                {cancellingSubscription === sub.stripe_subscription_id ? 'Cancelling...' : 'Cancel Subscription'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="billing-card">
                    <div className="card-header">
                      <h2>Donation History</h2>
                      <p>Your contribution record</p>
                    </div>
                    {donations.length > 0 ? (
                      <div className="donations-table-wrapper">
                        <table className="donations-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Type</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {donations.map((donation) => (
                              <tr key={donation.id || donation.stripe_payment_id}>
                                <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                                <td className="amount-cell">${parseFloat(donation.amount).toFixed(2)}</td>
                                <td>
                                  <span className={`donation-type-badge ${donation.donation_type}`}>
                                    {donation.donation_type === 'monthly' ? 'Monthly' : 'One-Time'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-badge ${donation.status}`}>
                                    {donation.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="no-donations">
                        <p>No donation history found.</p>
                        <Link to="/donate" className="donate-link-btn">Make Your First Donation</Link>
                      </div>
                    )}
                  </div>

                  <div className="billing-info-card">
                    <h3>JazakAllah Khair for Your Support</h3>
                    <p>Your generous contributions help us maintain and improve QuranDeen.com, spreading the light of the Holy Quran to Muslims worldwide.</p>
                    <Link to="/donate" className="donate-again-btn">Make Another Donation</Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {forcePasswordChange && (
        <div className="force-password-modal-overlay">
          <div className="force-password-modal">
            <h2>Password Change Required</h2>
            <p>For security reasons, please set a new password for your account.</p>
            
            {forcePasswordError && (
              <div className="message error">{forcePasswordError}</div>
            )}
            
            <form onSubmit={handleForcePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="newPasswordForce">New Password</label>
                <input
                  type="password"
                  id="newPasswordForce"
                  value={newPasswordForce}
                  onChange={(e) => setNewPasswordForce(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input"
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPasswordForce">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPasswordForce"
                  value={confirmPasswordForce}
                  onChange={(e) => setConfirmPasswordForce(e.target.value)}
                  placeholder="Confirm new password"
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="save-btn">Set New Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
