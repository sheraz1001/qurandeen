import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', published: false });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [blogsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/blogs'),
        axios.get('/api/admin/users')
      ]);
      setBlogs(blogsRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-welcome">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{blogs.length}</div>
          <div className="stat-label">Total Blogs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{blogs.filter(b => b.published).length}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'blogs' && (
          <div className="blogs-section">
            {!showForm ? (
              <>
                <div className="section-header">
                  <h2>Blog Posts</h2>
                  <button className="add-btn" onClick={() => setShowForm(true)}>
                    + New Blog Post
                  </button>
                </div>
                
                {blogs.length === 0 ? (
                  <div className="empty-state">
                    <p>No blog posts yet. Create your first post!</p>
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
                            <td>{blog.title}</td>
                            <td>
                              <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                            <td className="actions-cell">
                              <button className="edit-btn" onClick={() => editBlog(blog)}>Edit</button>
                              <button className="delete-btn" onClick={() => deleteBlog(blog.id)}>Delete</button>
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
                <h2>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
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

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Registered Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name || '-'}</td>
                      <td>{u.email}</td>
                      <td>{u.city && u.country ? `${u.city}, ${u.country}` : '-'}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
