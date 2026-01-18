import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';

function BlogList() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog' }
  ];
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs');
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="blog-page">
      <SEO 
        title="Islamic Knowledge Blog - Articles to Strengthen Your Faith"
        description="Read inspiring Islamic articles covering Quran, Hadith, Islamic history, spirituality, and practical guidance for Muslims. Expert insights to strengthen your faith."
        canonical="https://qurandeen.com/blog"
        keywords="Islamic blog, Islamic articles, Quran blog, Muslim knowledge, Islamic spirituality, faith articles"
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="📝"
        title="Islamic Blog"
        subtitle="Articles and insights to strengthen your faith"
        stats={[`${blogs.length} Articles`, 'Expert Authors', 'Free to Read']}
        breadcrumbs={breadcrumbs}
      />

      {blogs.length === 0 ? (
        <div className="empty-blog">
          <p>No blog posts available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} className="blog-card">
              <div className="blog-card-content">
                <h2>{blog.title}</h2>
                {blog.excerpt && <p className="blog-excerpt">{blog.excerpt}</p>}
                <div className="blog-meta">
                  <span className="blog-author">By {blog.author_name || 'Admin'}</span>
                  <span className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
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
      const response = await axios.get(`/api/blogs/${slug}`);
      setBlog(response.data.data);
    } catch (error) {
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error-page"><h2>{error}</h2><Link to="/blog">Back to Blog</Link></div>;

  return (
    <div className="blog-post-page">
      <Link to="/blog" className="back-link">← Back to Blog</Link>
      <article className="blog-article">
        <header className="article-header">
          <h1>{blog.title}</h1>
          <div className="article-meta">
            <span>By {blog.author_name || 'Admin'}</span>
            <span>•</span>
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          </div>
        </header>
        <div className="article-content">
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export { BlogList, BlogPost };
