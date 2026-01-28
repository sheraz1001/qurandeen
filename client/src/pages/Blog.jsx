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

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "QuranDeen Islamic Blog",
    "description": "Read inspiring Islamic articles covering Quran, Hadith, Islamic history, spirituality, and practical guidance for Muslims.",
    "url": "https://qurandeen.com/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "QuranDeen",
      "url": "https://qurandeen.com"
    },
    "blogPost": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt,
      "url": `https://qurandeen.com/blog/${blog.slug}`,
      "datePublished": blog.created_at,
      "author": {
        "@type": "Person",
        "name": blog.author_name || "Admin"
      }
    }))
  };

  return (
    <div className="blog-page">
      <SEO 
        title="Islamic Knowledge Blog - Articles to Strengthen Your Faith"
        description="Read inspiring Islamic articles covering Quran, Hadith, Islamic history, spirituality, and practical guidance for Muslims. Expert insights to strengthen your faith."
        canonical="https://qurandeen.com/blogs"
        keywords="Islamic blog, Islamic articles, Quran blog, Muslim knowledge, Islamic spirituality, faith articles"
        breadcrumbs={breadcrumbs}
        schema={blogSchema}
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
              {blog.featured_image && (
                <div className="blog-card-image">
                  <img src={blog.featured_image} alt={blog.featured_image_alt || blog.title} loading="lazy" />
                </div>
              )}
              <div className="blog-card-content">
                {blog.category_name && <span className="blog-card-category">{blog.category_name}</span>}
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
  if (error) return <div className="error-page"><h2>{error}</h2><Link to="/blogs">Back to Blog</Link></div>;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blogs' },
    { name: blog.title }
  ];

  const baseUrl = 'https://qurandeen.com';
  const blogUrl = `${baseUrl}/blog/${blog.slug}`;
  const featuredImage = blog.featured_image ? `${baseUrl}${blog.featured_image}` : `${baseUrl}/icons/icon-512.png`;
  const metaDescription = blog.meta_description || blog.excerpt || blog.title;
  const ogTitle = blog.og_title || blog.title;
  const ogDescription = blog.og_description || blog.excerpt || metaDescription;
  const twitterTitle = blog.twitter_title || blog.title;
  const twitterDescription = blog.twitter_description || blog.excerpt || metaDescription;
  const robotsContent = `${blog.robots_index !== false ? 'index' : 'noindex'}, ${blog.robots_follow !== false ? 'follow' : 'nofollow'}`;

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": metaDescription,
    "image": featuredImage,
    "url": blogUrl,
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "author": {
      "@type": "Person",
      "name": blog.author_name || "QuranDeen"
    },
    "publisher": {
      "@type": "Organization",
      "name": "QuranDeen",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icons/icon-512.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blogUrl
    }
  };

  return (
    <div className="blog-post-page">
      <SEO 
        title={`${blog.title} - QuranDeen Islamic Blog`}
        description={metaDescription}
        canonical={blogUrl}
        keywords={blog.meta_keywords || 'Islamic blog, Quran, Muslim knowledge'}
        breadcrumbs={breadcrumbs}
        schema={blogPostSchema}
        additionalMeta={[
          { name: 'robots', content: robotsContent },
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          { property: 'og:title', content: ogTitle },
          { property: 'og:description', content: ogDescription },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: blogUrl },
          { property: 'og:image', content: featuredImage },
          { property: 'og:image:width', content: '1920' },
          { property: 'og:image:height', content: '1080' },
          { property: 'og:site_name', content: 'QuranDeen.com Online Quran Explorer and Quran Classes' },
          { property: 'article:published_time', content: blog.created_at },
          { property: 'article:modified_time', content: blog.updated_at || blog.created_at },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: twitterTitle },
          { name: 'twitter:description', content: twitterDescription },
          { name: 'twitter:image', content: featuredImage }
        ]}
      />
      <Link to="/blogs" className="back-link">← Back to Blog</Link>
      <article className="blog-article">
        <header className="article-header">
          {blog.featured_image && (
            <div className="article-featured-image">
              <img 
                src={blog.featured_image} 
                alt={blog.featured_image_alt || blog.title}
                loading="lazy"
              />
            </div>
          )}
          <h1>{blog.title}</h1>
          <div className="article-meta">
            <span>By {blog.author_name || 'Admin'}</span>
            <span>•</span>
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            {blog.category_name && (
              <>
                <span>•</span>
                <span className="article-category">{blog.category_name}</span>
              </>
            )}
          </div>
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
}

export { BlogList, BlogPost };
