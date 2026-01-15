import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import '../styles/blog.css';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      <p className="blog-subtitle">Islamic knowledge, Quran insights, and spiritual guidance</p>
      
      {blogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="blog-card">
              {blog.featuredImage && (
                <div className="blog-image">
                  <img src={blog.featuredImage} alt={blog.title} />
                </div>
              )}
              <div className="blog-content">
                {blog.category && <span className="blog-category">{blog.category}</span>}
                <h2><Link to={`/blog/${blog.slug}`}>{blog.title}</Link></h2>
                <p className="blog-excerpt">{blog.excerpt || blog.content.substring(0, 150)}...</p>
                <div className="blog-meta">
                  <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <Link to={`/blog/${blog.slug}`} className="read-more">Read More</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data.data);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="blog-container">
        <div className="error-message">{error}</div>
        <Link to="/blog" className="back-link">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <article className="blog-post">
        <Link to="/blog" className="back-link">Back to Blog</Link>
        
        {blog.featuredImage && (
          <div className="post-featured-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>
        )}
        
        <header className="post-header">
          {blog.category && <span className="blog-category">{blog.category}</span>}
          <h1>{blog.title}</h1>
          <div className="post-meta">
            <span className="post-date">
              Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
      </article>
    </div>
  );
}

export { BlogList, BlogPost };
