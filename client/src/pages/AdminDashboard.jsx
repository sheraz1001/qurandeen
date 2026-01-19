import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', published: false });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', city: '', country: '', role: 'user' });
  const [userAction, setUserAction] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacherStats, setTeacherStats] = useState({ pending: 0, verified: 0, total: 0, platformEarnings: 0 });

  useEffect(() => {
    if (authLoading) return; // Wait for auth check to complete
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [blogsRes, usersRes, donationsRes, teachersRes] = await Promise.all([
        axios.get('/api/admin/blogs'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/donations'),
        axios.get('/api/admin/teachers').catch(() => ({ data: { teachers: [], stats: {} } }))
      ]);
      setBlogs(blogsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setDonations(donationsRes.data.data || []);
      setDonationStats(donationsRes.data.stats || {});
      setTeachers(teachersRes.data.teachers || []);
      setTeacherStats(teachersRes.data.stats || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyTeacher = async (teacherId, action) => {
    try {
      await axios.put(`/api/admin/teachers/${teacherId}/verify`, { action });
      fetchData();
      alert(`Teacher ${action === 'approve' ? 'verified' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error verifying teacher:', error);
      alert('Failed to update teacher verification status');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSyncDonations = async () => {
    setSyncing(true);
    try {
      const res = await axios.post('/api/admin/sync-stripe-donations');
      alert(`Synced ${res.data.synced} donations from Stripe`);
      fetchData();
    } catch (error) {
      console.error('Error syncing donations:', error);
      alert('Failed to sync donations from Stripe');
    } finally {
      setSyncing(false);
    }
  };

  const startEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      city: u.city || '',
      country: u.country || '',
      role: u.role || 'user'
    });
  };

  const cancelEditUser = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', city: '', country: '', role: 'user' });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/admin/users/${editingUser.id}`, userForm);
      setEditingUser(null);
      setUserForm({ name: '', email: '', city: '', country: '', role: 'user' });
      fetchData();
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    setUserAction(userId);
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchData();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setUserAction(null);
    }
  };

  const handleResetPassword = async (userId, userName, userEmail) => {
    if (!confirm(`Reset password for "${userName}" (${userEmail})? A new password will be emailed to them.`)) {
      return;
    }
    setUserAction(userId);
    try {
      await axios.post(`/api/admin/users/${userId}/reset-password`);
      alert('Password reset successfully. New password sent via email.');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setUserAction(null);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBlog) {
        await axios.put(`/api/admin/blogs/${editingBlog.id}`, blogForm);
      } else {
        await axios.post('/api/admin/blogs', blogForm);
      }
      setShowForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', content: '', excerpt: '', published: false });
      fetchData();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      published: blog.published
    });
    setShowForm(true);
    setActiveSection('blogs');
  };

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`/api/admin/blogs/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingBlog(null);
    setBlogForm({ title: '', content: '', excerpt: '', published: false });
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { id: 'blogs', label: 'Blog Posts', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M16 13H8"/>
        <path d="M16 17H8"/>
        <path d="M10 9H8"/>
      </svg>
    )},
    { id: 'users', label: 'Users', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { id: 'donations', label: 'Donations', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    )},
    { id: 'teachers', label: 'Teachers', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { id: 'analytics', label: 'Analytics', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10"/>
        <path d="M12 20V4"/>
        <path d="M6 20v-6"/>
      </svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    )}
  ];

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return 'Admin Overview';
      case 'blogs': return 'Blog Management';
      case 'users': return 'User Management';
      case 'donations': return 'Donation Management';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Admin Settings';
      default: return 'Admin Dashboard';
    }
  };

  if (authLoading || loading) return <Loading />;

  return (
    <div className="dashboard-layout admin-layout">
      <aside className={`dashboard-sidebar admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar admin-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15l-2-2m0 0l2-2m-2 2h12M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <h3>{user?.name}</h3>
              <span className="admin-badge">Administrator</span>
            </div>
          )}
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <path d="M9 18l6-6-6-6"/>
              ) : (
                <path d="M15 18l-6-6 6-6"/>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Dashboard</span>}
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => { setActiveSection(item.id); setShowForm(false); }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="nav-divider"></div>

          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">System</span>}
            <button
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
              title={sidebarCollapsed ? 'Settings' : ''}
            >
              <span className="nav-icon">{navItems[4].icon}</span>
              {!sidebarCollapsed && <span className="nav-label">Settings</span>}
            </button>
            <Link to="/dashboard" className="nav-item" title={sidebarCollapsed ? 'User Dashboard' : ''}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              {!sidebarCollapsed && <span className="nav-label">User Dashboard</span>}
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <h1 className="page-title">{getSectionTitle()}</h1>
            <span className="greeting">Welcome back, {user?.name}</span>
          </div>
          <div className="topbar-actions">
            <Link to="/" className="topbar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Home
            </Link>
          </div>
        </div>

        <div className="dashboard-content">
          {activeSection === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid admin-stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{blogs.length}</div>
                    <div className="stat-label">Total Blog Posts</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{blogs.filter(b => b.published).length}</div>
                    <div className="stat-label">Published</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{blogs.filter(b => !b.published).length}</div>
                    <div className="stat-label">Drafts</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{users.length}</div>
                    <div className="stat-label">Registered Users</div>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <button className="action-card" onClick={() => { setActiveSection('blogs'); setShowForm(true); }}>
                    <div className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                    <span>New Blog Post</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveSection('blogs')}>
                    <div className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                      </svg>
                    </div>
                    <span>Manage Blogs</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveSection('users')}>
                    <div className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <span>View Users</span>
                  </button>
                  <Link to="/blogs" className="action-card">
                    <div className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </div>
                    <span>View Public Blog</span>
                  </Link>
                </div>
              </div>

              <div className="recent-activity">
                <div className="section-header">
                  <h2>Recent Blog Posts</h2>
                  <button className="view-all-btn" onClick={() => setActiveSection('blogs')}>View All</button>
                </div>
                <div className="activity-list">
                  {blogs.slice(0, 5).map(blog => (
                    <div key={blog.id} className="activity-item">
                      <div className="activity-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M14 2v6h6"/>
                        </svg>
                      </div>
                      <div className="activity-content">
                        <h4>{blog.title}</h4>
                        <span className="activity-meta">
                          <span className={`status-dot ${blog.published ? 'published' : 'draft'}`}></span>
                          {blog.published ? 'Published' : 'Draft'} • {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="activity-action" onClick={() => editBlog(blog)}>Edit</button>
                    </div>
                  ))}
                  {blogs.length === 0 && (
                    <div className="empty-activity">
                      <p>No blog posts yet. Create your first post!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'blogs' && (
            <div className="blogs-section">
              {!showForm ? (
                <>
                  <div className="section-header">
                    <h2>All Blog Posts ({blogs.length})</h2>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      New Blog Post
                    </button>
                  </div>
                  
                  {blogs.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M14 2v6h6"/>
                          <path d="M12 18v-6"/>
                          <path d="M9 15h6"/>
                        </svg>
                      </div>
                      <h3>No Blog Posts Yet</h3>
                      <p>Create your first blog post to share Islamic knowledge</p>
                      <button className="browse-btn" onClick={() => setShowForm(true)}>Create First Post</button>
                    </div>
                  ) : (
                    <div className="blogs-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((blog) => (
                            <tr key={blog.id}>
                              <td className="blog-title-cell">
                                <strong>{blog.title}</strong>
                                {blog.excerpt && <span className="blog-excerpt-preview">{blog.excerpt.substring(0, 60)}...</span>}
                              </td>
                              <td>
                                <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                                  {blog.published ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                              <td className="actions-cell">
                                <button className="edit-btn" onClick={() => editBlog(blog)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Edit
                                </button>
                                <button className="delete-btn" onClick={() => deleteBlog(blog.id)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="blog-form-section">
                  <div className="form-header">
                    <h2>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                    <button className="back-btn" onClick={cancelEdit}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5"/>
                        <polyline points="12,19 5,12 12,5"/>
                      </svg>
                      Back to List
                    </button>
                  </div>
                  <form onSubmit={handleBlogSubmit} className="blog-form">
                    <div className="form-group">
                      <label htmlFor="title">Title *</label>
                      <input
                        type="text"
                        id="title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        placeholder="Enter blog title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="excerpt">Excerpt (Short Description)</label>
                      <textarea
                        id="excerpt"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        placeholder="Brief description for blog listing"
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="content">Content *</label>
                      <textarea
                        id="content"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write your blog content here..."
                        rows={15}
                        required
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={blogForm.published}
                          onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                        />
                        Publish immediately
                      </label>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                      <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? 'Saving...' : (editingBlog ? 'Update Post' : 'Create Post')}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>Registered Users ({users.length})</h2>
              </div>
              
              {editingUser && (
                <div className="edit-user-form">
                  <h3>Edit User: {editingUser.name || editingUser.email}</h3>
                  <form onSubmit={handleUserSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="userName">Name</label>
                        <input
                          type="text"
                          id="userName"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="userEmail">Email</label>
                        <input
                          type="email"
                          id="userEmail"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="userCity">City</label>
                        <input
                          type="text"
                          id="userCity"
                          value={userForm.city}
                          onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="userCountry">Country</label>
                        <input
                          type="text"
                          id="userCountry"
                          value={userForm.country}
                          onChange={(e) => setUserForm({ ...userForm, country: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="userRole">Role</label>
                      <select
                        id="userRole"
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={cancelEditUser}>Cancel</button>
                      <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {users.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <h3>No Users Yet</h3>
                  <p>Users will appear here once they register</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="user-cell">
                            <div className="user-avatar-small">{(u.name || u.email)[0].toUpperCase()}</div>
                            <span>{u.name || 'Anonymous'}</span>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.city && u.country ? `${u.city}, ${u.country}` : '-'}</td>
                          <td>
                            <span className={`role-badge ${u.role}`}>{u.role}</span>
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="actions-cell">
                            <button 
                              className="action-btn edit" 
                              onClick={() => startEditUser(u)}
                              title="Edit user"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button 
                              className="action-btn reset" 
                              onClick={() => handleResetPassword(u.id, u.name, u.email)}
                              disabled={userAction === u.id}
                              title="Reset password"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            </button>
                            {u.id !== user?.id && (
                              <button 
                                className="action-btn delete" 
                                onClick={() => handleDeleteUser(u.id, u.name || u.email)}
                                disabled={userAction === u.id}
                                title="Delete user"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'donations' && (
            <div className="donations-section">
              <div className="donation-stats-grid">
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Total Donations</h3>
                    <p className="stat-value">${parseFloat(donationStats.total_amount || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>One-Time Donations</h3>
                    <p className="stat-value">${parseFloat(donationStats.onetime_amount || 0).toFixed(2)}</p>
                    <span className="stat-count">{donationStats.onetime_count || 0} donations</span>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Monthly Subscriptions</h3>
                    <p className="stat-value">${parseFloat(donationStats.monthly_amount || 0).toFixed(2)}</p>
                    <span className="stat-count">{donationStats.monthly_count || 0} active</span>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Total Donors</h3>
                    <p className="stat-value">{donationStats.total_count || 0}</p>
                  </div>
                </div>
              </div>

              <div className="section-header">
                <h2>Recent Donations</h2>
                <button 
                  className="sync-btn" 
                  onClick={handleSyncDonations}
                  disabled={syncing}
                >
                  {syncing ? 'Syncing...' : 'Sync from Stripe'}
                </button>
              </div>
              
              {donations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <h3>No Donations Yet</h3>
                  <p>Donations will appear here once they are received via Stripe webhook</p>
                </div>
              ) : (
                <div className="donations-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Donor Details</th>
                        <th>Location</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d.id}>
                          <td className="donor-cell">
                            <div className="donor-avatar">{(d.first_name || d.donor_name || d.donor_email || 'A')[0].toUpperCase()}</div>
                            <div className="donor-info">
                              <span className="donor-name">
                                {d.first_name && d.last_name 
                                  ? `${d.first_name} ${d.last_name}` 
                                  : d.donor_name || 'Anonymous'}
                              </span>
                              <span className="donor-email">{d.donor_email || '-'}</span>
                            </div>
                          </td>
                          <td className="location-cell">
                            {d.city || d.country ? (
                              <span className="location-text">
                                {[d.city, d.country].filter(Boolean).join(', ')}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="amount-cell">${parseFloat(d.amount).toFixed(2)}</td>
                          <td>
                            <span className={`type-badge ${d.donation_type}`}>
                              {d.donation_type === 'monthly' ? 'Monthly' : 'One-Time'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${d.status}`}>{d.status}</span>
                          </td>
                          <td className="message-cell">{d.message || '-'}</td>
                          <td>{new Date(d.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'teachers' && (
            <div className="teachers-section">
              <div className="donation-stats-grid">
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Total Teachers</h3>
                    <p className="stat-value">{teacherStats.total || 0}</p>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Pending Verification</h3>
                    <p className="stat-value">{teacherStats.pending || 0}</p>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Verified Teachers</h3>
                    <p className="stat-value">{teacherStats.verified || 0}</p>
                  </div>
                </div>
                <div className="stat-card donation-stat">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Platform Earnings</h3>
                    <p className="stat-value">${parseFloat(teacherStats.platformEarnings || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="section-header">
                <h2>Teacher Management</h2>
              </div>

              {teachers.length === 0 ? (
                <div className="empty-state">
                  <p>No teachers registered yet.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Teacher</th>
                        <th>Headline</th>
                        <th>Rate</th>
                        <th>Students</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t) => (
                        <tr key={t.id}>
                          <td className="donor-cell">
                            <div className="donor-avatar">
                              {t.profile_image ? (
                                <img src={t.profile_image} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                              ) : (
                                (t.name || 'T')[0].toUpperCase()
                              )}
                            </div>
                            <div className="donor-info">
                              <span className="donor-name">{t.name}</span>
                              <span className="donor-email">{t.email}</span>
                            </div>
                          </td>
                          <td>{t.headline || '-'}</td>
                          <td>${parseFloat(t.hourly_rate || 0).toFixed(2)}/hr</td>
                          <td>{t.total_students || 0}</td>
                          <td>
                            {t.average_rating ? (
                              <span>⭐ {parseFloat(t.average_rating).toFixed(1)}</span>
                            ) : '-'}
                          </td>
                          <td>
                            <span className={`status-badge ${t.is_verified ? 'completed' : 'pending'}`}>
                              {t.is_verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            {!t.is_verified && (
                              <div className="action-buttons">
                                <button 
                                  className="action-btn approve"
                                  onClick={() => verifyTeacher(t.id, 'approve')}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="action-btn reject"
                                  onClick={() => verifyTeacher(t.id, 'reject')}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            <Link to={`/teachers/${t.id}`} className="view-link">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="analytics-section">
              <div className="coming-soon">
                <div className="coming-soon-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 20V10"/>
                    <path d="M12 20V4"/>
                    <path d="M6 20v-6"/>
                  </svg>
                </div>
                <h2>Analytics Coming Soon</h2>
                <p>Track blog views, user engagement, and site metrics</p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="admin-settings-section">
              <div className="settings-card">
                <div className="card-header">
                  <h2>Admin Settings</h2>
                  <p>Manage site-wide settings and configurations</p>
                </div>
                <div className="settings-options">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Site Name</h4>
                      <p>QuranDeen.com</p>
                    </div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Admin Email</h4>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Total Content</h4>
                      <p>{blogs.length} blog posts, {users.length} users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <div className="card-header">
                  <h2>Quick Links</h2>
                </div>
                <div className="quick-links-grid">
                  <Link to="/" className="quick-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    View Home Page
                  </Link>
                  <Link to="/blogs" className="quick-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    </svg>
                    View Public Blog
                  </Link>
                  <Link to="/features" className="quick-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    View Features
                  </Link>
                  <Link to="/dashboard" className="quick-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    User Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
