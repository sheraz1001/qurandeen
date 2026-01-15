import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import Loading from '../components/Loading';
import '../styles/admin.css';

function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    featuredImage: '',
    published: false
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, usersRes] = await Promise.all([
        fetch('/api/admin/blogs', { credentials: 'include' }),
        fetch('/api/admin/users', { credentials: 'include' })
      ]);
      
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData.data || []);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setBlogForm({
      ...blogForm,
      title,
      slug: generateSlug(title)
    });
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    try {
      const url = editingBlog 
        ? `/api/admin/blogs/${editingBlog.id}` 
        : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blogForm)
      });
      
      if (res.ok) {
        fetchData();
        setShowEditor(false);
        setEditingBlog(null);
        setBlogForm({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          category: '',
          featuredImage: '',
          published: false
        });
      }
    } catch (err) {
      console.error('Error saving blog:', err);
    }
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category || '',
      featuredImage: blog.featuredImage || '',
      published: blog.published
    });
    setShowEditor(true);
  };

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="auth-prompt">
          <h1>Admin Access Required</h1>
          <p>Please sign in to access the admin dashboard.</p>
          <a href="/api/login" className="login-btn">Sign In</a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="auth-prompt">
          <h1>Access Denied</h1>
          <p>You do not have admin privileges to access this page.</p>
          <a href="/dashboard" className="login-btn">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blogs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading />
      ) : (
        <div className="admin-content">
          {activeTab === 'blogs' && (
            <div className="blogs-section">
              <div className="section-header">
                <h2>Blog Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({
                      title: '',
                      slug: '',
                      content: '',
                      excerpt: '',
                      category: '',
                      featuredImage: '',
                      published: false
                    });
                    setShowEditor(true);
                  }}
                >
                  + New Blog Post
                </button>
              </div>

              {showEditor && (
                <div className="blog-editor">
                  <h3>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h3>
                  <form onSubmit={saveBlog}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={handleTitleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Slug (URL)</label>
                      <input
                        type="text"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Excerpt</label>
                      <textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="form-group">
                      <label>Content</label>
                      <textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        rows={10}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Featured Image URL</label>
                        <input
                          type="text"
                          value={blogForm.featuredImage}
                          onChange={(e) => setBlogForm({...blogForm, featuredImage: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={blogForm.published}
                          onChange={(e) => setBlogForm({...blogForm, published: e.target.checked})}
                        />
                        Published
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn">
                        {editingBlog ? 'Update' : 'Create'} Blog
                      </button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowEditor(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.category || '-'}</td>
                      <td>
                        <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="edit-btn" onClick={() => editBlog(blog)}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteBlog(blog.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {blogs.length === 0 && <p className="empty-message">No blog posts yet.</p>}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          {u.profileImageUrl && (
                            <img src={u.profileImageUrl} alt="" className="user-avatar-small" />
                          )}
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.id !== user.id && (
                          <button 
                            className="role-btn"
                            onClick={() => toggleUserRole(u.id, u.role)}
                          >
                            {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
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
    </div>
  );
}

export default AdminDashboard;
