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
  const [blogForm, setBlogForm] = useState({ 
    title: '', content: '', excerpt: '', published: false,
    category_id: '', featured_image: '', featured_image_alt: '',
    meta_description: '', meta_keywords: '', og_title: '', og_description: '',
    twitter_title: '', twitter_description: '', robots_index: true, robots_follow: true
  });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', city: '', country: '', role: 'user' });
  const [userAction, setUserAction] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacherStats, setTeacherStats] = useState({ pending: 0, verified: 0, total: 0, platformEarnings: 0 });
  
  // Advanced user management state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [passwordModal, setPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [userStats, setUserStats] = useState({});
  
  // AI Blog generation state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGenerating, setAIGenerating] = useState(false);
  const [aiTopic, setAITopic] = useState('');
  const [aiTone, setAITone] = useState('informative');
  const [aiLength, setAILength] = useState('medium');
  const [aiKeywords, setAIKeywords] = useState('');
  const [aiTargetAudience, setAITargetAudience] = useState('');
  const [aiFeaturedImage, setAIFeaturedImage] = useState(null);
  const [aiFeaturedImagePreview, setAIFeaturedImagePreview] = useState('');
  const [aiFeaturedImageAlt, setAIFeaturedImageAlt] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Blog categories state
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', parent_id: '', description: '' });
  const [blogSubSection, setBlogSubSection] = useState('posts'); // 'posts' | 'categories' | 'settings'
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState({});
  const [defaultPrompt, setDefaultPrompt] = useState('');

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
      const [blogsRes, usersRes, donationsRes, teachersRes, categoriesRes, settingsRes] = await Promise.all([
        axios.get('/api/admin/blogs'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/donations'),
        axios.get('/api/admin/teachers').catch(() => ({ data: { teachers: [], stats: {} } })),
        axios.get('/api/admin/blog-categories').catch(() => ({ data: { data: [] } })),
        axios.get('/api/admin/settings').catch(() => ({ data: { data: {} } }))
      ]);
      setBlogs(blogsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setDonations(donationsRes.data.data || []);
      setDonationStats(donationsRes.data.stats || {});
      setTeachers(teachersRes.data.teachers || []);
      setTeacherStats(teachersRes.data.stats || {});
      setCategories(categoriesRes.data.data || []);
      setSiteSettings(settingsRes.data.data || {});
      setDefaultPrompt(settingsRes.data.data?.ai_blog_default_prompt || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const res = await axios.get('/api/admin/users/stats');
      setUserStats(res.data.data || {});
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUserStats();
    }
  }, [user]);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch = userSearch === '' || 
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/admin/users', newUserForm);
      setShowAddUserForm(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
      fetchData();
      fetchUserStats();
      alert('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.error || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  // Set user password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await axios.post(`/api/admin/users/${passwordModal.id}/set-password`, { password: newPassword });
      setPasswordModal(null);
      setNewPassword('');
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error setting password:', error);
      alert(error.response?.data?.error || 'Failed to set password');
    } finally {
      setSaving(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const selectableUsers = filteredUsers.filter(u => u.id !== user?.id);
  
  const toggleSelectAll = () => {
    if (selectedUsers.length === selectableUsers.length && selectableUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(selectableUsers.map(u => u.id));
    }
  };

  // Bulk role change
  const handleBulkRoleChange = async (role) => {
    if (selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }
    if (!confirm(`Change role of ${selectedUsers.length} users to "${role}"?`)) return;
    
    try {
      await axios.post('/api/admin/users/bulk-role', { userIds: selectedUsers, role });
      setSelectedUsers([]);
      fetchData();
      fetchUserStats();
      alert(`Updated ${selectedUsers.length} users to ${role} role`);
    } catch (error) {
      console.error('Error bulk updating roles:', error);
      alert(error.response?.data?.error || 'Failed to update roles');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }
    if (!confirm(`DELETE ${selectedUsers.length} users? This cannot be undone!`)) return;
    
    try {
      await axios.post('/api/admin/users/bulk-delete', { userIds: selectedUsers });
      setSelectedUsers([]);
      fetchData();
      fetchUserStats();
      alert(`Deleted ${selectedUsers.length} users`);
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert(error.response?.data?.error || 'Failed to delete users');
    }
  };

  // AI Blog Generation
  const handleGenerateBlog = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic');
      return;
    }
    setAIGenerating(true);
    try {
      // Upload featured image first if selected
      let featuredImageUrl = '';
      if (aiFeaturedImage) {
        featuredImageUrl = await handleImageUpload(aiFeaturedImage);
      }

      const res = await axios.post('/api/admin/blogs/generate', {
        topic: aiTopic,
        tone: aiTone,
        length: aiLength,
        keywords: aiKeywords,
        targetAudience: aiTargetAudience
      });
      const generated = res.data.data;
      setBlogForm({
        title: generated.title || '',
        content: generated.content || '',
        excerpt: generated.excerpt || '',
        published: false,
        category_id: '',
        featured_image: featuredImageUrl || '',
        featured_image_alt: aiFeaturedImageAlt || generated.featured_image_alt || '',
        meta_description: generated.meta_description || generated.excerpt || '',
        meta_keywords: generated.meta_keywords || '',
        og_title: generated.og_title || generated.title || '',
        og_description: generated.og_description || generated.excerpt || '',
        twitter_title: generated.twitter_title || generated.title || '',
        twitter_description: generated.twitter_description || generated.excerpt || '',
        robots_index: true,
        robots_follow: true
      });
      setShowAIGenerator(false);
      setShowForm(true);
      setBlogSubSection('posts');
      // Reset AI form
      setAITopic('');
      setAIKeywords('');
      setAITargetAudience('');
      setAIFeaturedImage(null);
      setAIFeaturedImagePreview('');
      setAIFeaturedImageAlt('');
      alert('Blog generated with SEO metadata! Review and edit before publishing.');
    } catch (error) {
      console.error('Error generating blog:', error);
      alert(error.response?.data?.error || 'Failed to generate blog');
    } finally {
      setAIGenerating(false);
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
      resetBlogForm();
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
      published: blog.published,
      category_id: blog.category_id || '',
      featured_image: blog.featured_image || '',
      featured_image_alt: blog.featured_image_alt || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      og_title: blog.og_title || '',
      og_description: blog.og_description || '',
      twitter_title: blog.twitter_title || '',
      twitter_description: blog.twitter_description || '',
      robots_index: blog.robots_index !== false,
      robots_follow: blog.robots_follow !== false
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

  const resetBlogForm = () => {
    setBlogForm({ 
      title: '', content: '', excerpt: '', published: false,
      category_id: '', featured_image: '', featured_image_alt: '',
      meta_description: '', meta_keywords: '', og_title: '', og_description: '',
      twitter_title: '', twitter_description: '', robots_index: true, robots_follow: true
    });
    setAIFeaturedImage(null);
    setAIFeaturedImagePreview('');
    setAIFeaturedImageAlt('');
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetBlogForm();
  };

  // Category management functions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/admin/blog-categories/${editingCategory.id}`, categoryForm);
      } else {
        await axios.post('/api/admin/blog-categories', categoryForm);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', parent_id: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      parent_id: category.parent_id || '',
      description: category.description || ''
    });
    setShowCategoryModal(true);
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/api/admin/blog-categories/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.error || 'Failed to delete category');
    }
  };

  // Save default prompt
  const saveDefaultPrompt = async () => {
    try {
      await axios.put('/api/admin/settings/ai_blog_default_prompt', { value: defaultPrompt });
      alert('Default prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Failed to save prompt');
    }
  };

  // Handle featured image upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/admin/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.data.url;
      setBlogForm(prev => ({ ...prev, featured_image: imageUrl }));
      setAIFeaturedImagePreview(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Get main categories (no parent)
  const mainCategories = categories.filter(c => !c.parent_id);
  
  // Get subcategories for a parent
  const getSubcategories = (parentId) => categories.filter(c => c.parent_id === parentId);

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
              {/* Category Modal */}
              {showCategoryModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                    <form onSubmit={handleCategorySubmit}>
                      <div className="form-group">
                        <label>Category Name *</label>
                        <input
                          type="text"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="Enter category name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Parent Category (Optional - leave empty for main category)</label>
                        <select 
                          value={categoryForm.parent_id} 
                          onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                        >
                          <option value="">-- Main Category (No Parent) --</option>
                          {mainCategories.filter(c => c.id !== editingCategory?.id).map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Brief description of this category"
                          rows={2}
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => {
                          setShowCategoryModal(false);
                          setEditingCategory(null);
                          setCategoryForm({ name: '', parent_id: '', description: '' });
                        }}>Cancel</button>
                        <button type="submit" className="save-btn">
                          {editingCategory ? 'Update Category' : 'Add Category'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* AI Blog Generator Modal - Enhanced */}
              {showAIGenerator && (
                <div className="modal-overlay">
                  <div className="modal-content ai-modal ai-modal-large">
                    <h3>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                        <path d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                        <path d="M16.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                      </svg>
                      AI Blog Generator (SEO Optimized)
                    </h3>
                    
                    <div className="ai-form-section">
                      <h4>Content Settings</h4>
                      <div className="form-group">
                        <label>Topic / Title *</label>
                        <input
                          type="text"
                          value={aiTopic}
                          onChange={(e) => setAITopic(e.target.value)}
                          placeholder="e.g., The Virtues of Surah Al-Kahf, Benefits of Daily Dhikr..."
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tone</label>
                          <select value={aiTone} onChange={(e) => setAITone(e.target.value)}>
                            <option value="informative">Informative</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="educational">Educational</option>
                            <option value="reflective">Reflective</option>
                            <option value="conversational">Conversational</option>
                            <option value="scholarly">Scholarly</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Length</label>
                          <select value={aiLength} onChange={(e) => setAILength(e.target.value)}>
                            <option value="short">Short (300-500 words)</option>
                            <option value="medium">Medium (600-800 words)</option>
                            <option value="long">Long (1000-1500 words)</option>
                            <option value="extra-long">Extra Long (1500-2500 words)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="ai-form-section">
                      <h4>SEO Settings</h4>
                      <div className="form-group">
                        <label>Focus Keywords (comma-separated)</label>
                        <input
                          type="text"
                          value={aiKeywords}
                          onChange={(e) => setAIKeywords(e.target.value)}
                          placeholder="e.g., Surah Al-Kahf, Friday recitation, Islamic teachings, Quran benefits"
                        />
                        <span className="form-hint">AI will naturally incorporate these keywords for SEO</span>
                      </div>
                      <div className="form-group">
                        <label>Target Audience</label>
                        <input
                          type="text"
                          value={aiTargetAudience}
                          onChange={(e) => setAITargetAudience(e.target.value)}
                          placeholder="e.g., Muslim youth, new converts, parents, scholars"
                        />
                      </div>
                    </div>

                    <div className="ai-form-section">
                      <h4>Featured Image</h4>
                      <div className="form-group">
                        <label>Upload Featured Image</label>
                        <div className="image-upload-area">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setAIFeaturedImage(file);
                                setAIFeaturedImagePreview(URL.createObjectURL(file));
                              }
                            }}
                            id="ai-featured-image"
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="ai-featured-image" className="upload-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            {aiFeaturedImage ? 'Change Image' : 'Choose Image'}
                          </label>
                          {aiFeaturedImagePreview && (
                            <div className="image-preview">
                              <img src={aiFeaturedImagePreview} alt="Preview" />
                              <button type="button" className="remove-image" onClick={() => {
                                setAIFeaturedImage(null);
                                setAIFeaturedImagePreview('');
                              }}>Remove</button>
                            </div>
                          )}
                        </div>
                      </div>
                      {aiFeaturedImage && (
                        <div className="form-group">
                          <label>Image Alt Text (for SEO & accessibility)</label>
                          <input
                            type="text"
                            value={aiFeaturedImageAlt}
                            onChange={(e) => setAIFeaturedImageAlt(e.target.value)}
                            placeholder="Describe the image content for accessibility"
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => {
                        setShowAIGenerator(false);
                        setAITopic('');
                        setAIKeywords('');
                        setAITargetAudience('');
                        setAIFeaturedImage(null);
                        setAIFeaturedImagePreview('');
                        setAIFeaturedImageAlt('');
                      }}>Cancel</button>
                      <button 
                        type="button" 
                        className="save-btn ai-generate-btn" 
                        onClick={handleGenerateBlog}
                        disabled={aiGenerating || uploadingImage || !aiTopic.trim()}
                      >
                        {aiGenerating || uploadingImage ? (
                          <>
                            <span className="spinner"></span>
                            {uploadingImage ? 'Uploading...' : 'Generating...'}
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                            </svg>
                            Generate SEO Blog
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Management Tabs */}
              <div className="blog-tabs">
                <button 
                  className={`tab-btn ${blogSubSection === 'posts' ? 'active' : ''}`}
                  onClick={() => { setBlogSubSection('posts'); setShowForm(false); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                  Posts ({blogs.length})
                </button>
                <button 
                  className={`tab-btn ${blogSubSection === 'categories' ? 'active' : ''}`}
                  onClick={() => { setBlogSubSection('categories'); setShowForm(false); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h7v7H3z"/>
                    <path d="M14 3h7v7h-7z"/>
                    <path d="M3 14h7v7H3z"/>
                    <path d="M14 14h7v7h-7z"/>
                  </svg>
                  Categories ({categories.length})
                </button>
                <button 
                  className={`tab-btn ${blogSubSection === 'settings' ? 'active' : ''}`}
                  onClick={() => { setBlogSubSection('settings'); setShowForm(false); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  AI Settings
                </button>
              </div>

              {/* Categories Sub-Section */}
              {blogSubSection === 'categories' && !showForm && (
                <>
                  <div className="section-header">
                    <h2>Blog Categories</h2>
                    <button className="add-btn" onClick={() => setShowCategoryModal(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Category
                    </button>
                  </div>
                  
                  <div className="categories-grid">
                    {mainCategories.length === 0 ? (
                      <div className="empty-state">
                        <p>No categories yet. Add your first category!</p>
                      </div>
                    ) : (
                      mainCategories.map(mainCat => (
                        <div key={mainCat.id} className="category-card main-category">
                          <div className="category-header">
                            <h3>{mainCat.name}</h3>
                            <span className="blog-count">{mainCat.blog_count} blogs</span>
                          </div>
                          {mainCat.description && <p className="category-desc">{mainCat.description}</p>}
                          <div className="category-actions">
                            <button className="edit-btn" onClick={() => editCategory(mainCat)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteCategory(mainCat.id)}>Delete</button>
                          </div>
                          
                          {/* Subcategories */}
                          {getSubcategories(mainCat.id).length > 0 && (
                            <div className="subcategories">
                              <h4>Subcategories:</h4>
                              {getSubcategories(mainCat.id).map(subCat => (
                                <div key={subCat.id} className="subcategory-item">
                                  <span className="subcat-name">{subCat.name}</span>
                                  <span className="subcat-count">{subCat.blog_count} blogs</span>
                                  <div className="subcat-actions">
                                    <button onClick={() => editCategory(subCat)}>Edit</button>
                                    <button onClick={() => deleteCategory(subCat.id)}>Delete</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* Settings Sub-Section */}
              {blogSubSection === 'settings' && !showForm && (
                <>
                  <div className="section-header">
                    <h2>AI Blog Generator Settings</h2>
                  </div>
                  
                  <div className="settings-section">
                    <div className="setting-card">
                      <h3>Default AI Prompt</h3>
                      <p className="setting-description">
                        This prompt will be used as the base instruction for the AI when generating blog posts.
                        Customize it to match your content style and requirements.
                      </p>
                      <div className="form-group">
                        <textarea
                          value={defaultPrompt}
                          onChange={(e) => setDefaultPrompt(e.target.value)}
                          rows={8}
                          placeholder="Enter your custom AI prompt..."
                        />
                      </div>
                      <div className="form-actions">
                        <button className="save-btn" onClick={saveDefaultPrompt}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                          </svg>
                          Save Default Prompt
                        </button>
                      </div>
                    </div>
                    
                    <div className="setting-card">
                      <h3>Prompt Tips</h3>
                      <ul className="tips-list">
                        <li>Specify the writing style (formal, conversational, scholarly)</li>
                        <li>Include requirements for Quran/Hadith citations</li>
                        <li>Define content structure preferences (headings, bullet points)</li>
                        <li>Set guidelines for SEO optimization</li>
                        <li>Mention target audience characteristics</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Posts Sub-Section */}
              {blogSubSection === 'posts' && !showForm ? (
                <>
                  <div className="section-header">
                    <h2>All Blog Posts ({blogs.length})</h2>
                    <div className="header-actions">
                      <button className="ai-btn" onClick={() => setShowAIGenerator(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        AI Generate
                      </button>
                      <button className="add-btn" onClick={() => setShowForm(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        New Blog Post
                      </button>
                    </div>
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
                  <form onSubmit={handleBlogSubmit} className="blog-form blog-form-enhanced">
                    {/* Basic Info Section */}
                    <div className="form-section">
                      <h4>Basic Information</h4>
                      <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                          type="text"
                          id="title"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="Enter blog title (50-60 characters ideal for SEO)"
                          required
                        />
                        <span className="char-count">{blogForm.title.length}/60 characters</span>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="category">Category</label>
                          <select
                            id="category"
                            value={blogForm.category_id}
                            onChange={(e) => setBlogForm({ ...blogForm, category_id: e.target.value })}
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name}
                              </option>
                            ))}
                          </select>
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
                      </div>

                      <div className="form-group">
                        <label htmlFor="excerpt">Excerpt (Short Description)</label>
                        <textarea
                          id="excerpt"
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          placeholder="Brief description for blog listing (under 160 characters)"
                          rows={2}
                        />
                        <span className="char-count">{blogForm.excerpt.length}/160 characters</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="content">Content *</label>
                        <textarea
                          id="content"
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          placeholder="Write your blog content here (HTML supported)..."
                          rows={15}
                          required
                        />
                      </div>
                    </div>

                    {/* Featured Image Section */}
                    <div className="form-section">
                      <h4>Featured Image</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Upload Image</label>
                          <div className="image-upload-area">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) {
                                    setAIFeaturedImagePreview(url);
                                  }
                                }
                              }}
                              id="blog-featured-image"
                              style={{ display: 'none' }}
                            />
                            <label htmlFor="blog-featured-image" className="upload-btn">
                              {uploadingImage ? 'Uploading...' : (blogForm.featured_image ? 'Change Image' : 'Choose Image')}
                            </label>
                            {blogForm.featured_image && (
                              <div className="image-preview">
                                <img src={blogForm.featured_image} alt="Preview" />
                                <button type="button" className="remove-image" onClick={() => {
                                  setBlogForm({ ...blogForm, featured_image: '', featured_image_alt: '' });
                                  setAIFeaturedImagePreview('');
                                }}>Remove</button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="featured_image_alt">Image Alt Text (SEO)</label>
                          <input
                            type="text"
                            id="featured_image_alt"
                            value={blogForm.featured_image_alt}
                            onChange={(e) => setBlogForm({ ...blogForm, featured_image_alt: e.target.value })}
                            placeholder="Describe the image for accessibility"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SEO Section */}
                    <div className="form-section">
                      <h4>SEO & Meta Tags</h4>
                      <div className="form-group">
                        <label htmlFor="meta_description">Meta Description</label>
                        <textarea
                          id="meta_description"
                          value={blogForm.meta_description}
                          onChange={(e) => setBlogForm({ ...blogForm, meta_description: e.target.value })}
                          placeholder="SEO meta description (150-160 characters ideal)"
                          rows={2}
                        />
                        <span className="char-count">{blogForm.meta_description.length}/160 characters</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="meta_keywords">Meta Keywords</label>
                        <input
                          type="text"
                          id="meta_keywords"
                          value={blogForm.meta_keywords}
                          onChange={(e) => setBlogForm({ ...blogForm, meta_keywords: e.target.value })}
                          placeholder="Comma-separated keywords (e.g., Quran, Islamic studies, prayer)"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={blogForm.robots_index}
                              onChange={(e) => setBlogForm({ ...blogForm, robots_index: e.target.checked })}
                            />
                            Allow indexing (robots: index)
                          </label>
                        </div>
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={blogForm.robots_follow}
                              onChange={(e) => setBlogForm({ ...blogForm, robots_follow: e.target.checked })}
                            />
                            Allow following links (robots: follow)
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Social Sharing Section */}
                    <div className="form-section">
                      <h4>Social Sharing (Open Graph & Twitter)</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="og_title">OG Title (Facebook/LinkedIn)</label>
                          <input
                            type="text"
                            id="og_title"
                            value={blogForm.og_title}
                            onChange={(e) => setBlogForm({ ...blogForm, og_title: e.target.value })}
                            placeholder="Leave empty to use blog title"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="twitter_title">Twitter Title</label>
                          <input
                            type="text"
                            id="twitter_title"
                            value={blogForm.twitter_title}
                            onChange={(e) => setBlogForm({ ...blogForm, twitter_title: e.target.value })}
                            placeholder="Leave empty to use blog title"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="og_description">OG Description</label>
                          <textarea
                            id="og_description"
                            value={blogForm.og_description}
                            onChange={(e) => setBlogForm({ ...blogForm, og_description: e.target.value })}
                            placeholder="Leave empty to use excerpt"
                            rows={2}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="twitter_description">Twitter Description</label>
                          <textarea
                            id="twitter_description"
                            value={blogForm.twitter_description}
                            onChange={(e) => setBlogForm({ ...blogForm, twitter_description: e.target.value })}
                            placeholder="Leave empty to use excerpt"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                      <button type="submit" className="save-btn" disabled={saving || uploadingImage}>
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
              {/* User Stats */}
              <div className="user-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1a5f3c 0%, #0d3d28 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p className="stat-value">{userStats.total || users.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Admins</h3>
                    <p className="stat-value">{userStats.admins || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Teachers</h3>
                    <p className="stat-value">{userStats.teachers || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>New This Week</h3>
                    <p className="stat-value">{userStats.new_this_week || 0}</p>
                  </div>
                </div>
              </div>

              {/* Header with Add User Button */}
              <div className="section-header">
                <h2>User Management ({filteredUsers.length} of {users.length})</h2>
                <button className="add-btn" onClick={() => setShowAddUserForm(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add User
                </button>
              </div>

              {/* Search and Filters */}
              <div className="user-filters">
                <div className="search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="role-filter"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="bulk-actions">
                  <span>{selectedUsers.length} selected</span>
                  <button className="bulk-btn" onClick={() => handleBulkRoleChange('user')}>Make User</button>
                  <button className="bulk-btn" onClick={() => handleBulkRoleChange('teacher')}>Make Teacher</button>
                  <button className="bulk-btn" onClick={() => handleBulkRoleChange('admin')}>Make Admin</button>
                  <button className="bulk-btn delete" onClick={handleBulkDelete}>Delete Selected</button>
                  <button className="bulk-btn cancel" onClick={() => setSelectedUsers([])}>Clear</button>
                </div>
              )}

              {/* Add User Form Modal */}
              {showAddUserForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Add New User</h3>
                    <form onSubmit={handleCreateUser}>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          placeholder="Enter email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                          placeholder="Minimum 6 characters"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          value={newUserForm.role}
                          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                        >
                          <option value="user">User</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowAddUserForm(false)}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={saving}>
                          {saving ? 'Creating...' : 'Create User'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Password Modal */}
              {passwordModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Set Password for {passwordModal.name || passwordModal.email}</h3>
                    <form onSubmit={handleSetPassword}>
                      <div className="form-group">
                        <label>New Password *</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => { setPasswordModal(null); setNewPassword(''); }}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={saving}>
                          {saving ? 'Updating...' : 'Set Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit User Form */}
              {editingUser && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Edit User: {editingUser.name || editingUser.email}</h3>
                    <form onSubmit={handleUserSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            value={userForm.city}
                            onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Country</label>
                          <input
                            type="text"
                            value={userForm.country}
                            onChange={(e) => setUserForm({ ...userForm, country: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        >
                          <option value="user">User</option>
                          <option value="teacher">Teacher</option>
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
                </div>
              )}
              
              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <h3>{users.length === 0 ? 'No Users Yet' : 'No Matching Users'}</h3>
                  <p>{users.length === 0 ? 'Users will appear here once they register' : 'Try adjusting your search or filters'}</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th className="checkbox-col">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.length > 0 && selectedUsers.length === selectableUsers.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className={selectedUsers.includes(u.id) ? 'selected' : ''}>
                          <td className="checkbox-col">
                            {u.id !== user?.id && (
                              <input 
                                type="checkbox" 
                                checked={selectedUsers.includes(u.id)}
                                onChange={() => toggleUserSelection(u.id)}
                              />
                            )}
                          </td>
                          <td className="user-cell">
                            <div className="user-avatar-small">{(u.name || u.email)[0].toUpperCase()}</div>
                            <span>{u.name || 'Anonymous'}</span>
                            {u.id === user?.id && <span className="you-badge">You</span>}
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
                              className="action-btn password" 
                              onClick={() => setPasswordModal(u)}
                              title="Set password"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                              </svg>
                            </button>
                            <button 
                              className="action-btn reset" 
                              onClick={() => handleResetPassword(u.id, u.name, u.email)}
                              disabled={userAction === u.id}
                              title="Email reset link"
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
