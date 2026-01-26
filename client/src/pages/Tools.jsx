import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import '../styles/tools.css';

function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', label: 'All Resources', icon: '🌟' },
    { id: 'quran', label: 'Quran', icon: '📖' },
    { id: 'hadith', label: 'Hadith', icon: '📚' },
    { id: 'prayer', label: 'Prayer & Worship', icon: '🕌' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'learning', label: 'Learning', icon: '📝' },
  ];

  const tools = [
    {
      id: 'hadith-collections',
      title: 'Hadith Collections',
      description: 'Access 17 authentic hadith books including Bukhari, Muslim, Tirmidhi, Abu Dawud, and more with 50,000+ verified hadiths',
      icon: '📕',
      path: '/hadith',
      category: 'hadith',
      stats: { value: '50,000+', label: 'Hadiths' },
      featured: true,
      gradient: 'linear-gradient(135deg, #c0392b 0%, #8e2121 100%)'
    },
    {
      id: 'azkaar',
      title: 'Daily Azkaar & Duas',
      description: 'Complete Hisnul Muslim collection with 134 categories and 298+ authentic duas for every occasion',
      icon: '🤲',
      path: '/azkaar',
      category: 'prayer',
      stats: { value: '298+', label: 'Authentic Duas' },
      featured: true,
      gradient: 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)'
    },
    {
      id: 'hijri-calendar',
      title: 'Hijri-Gregorian Calendar',
      description: 'Interactive Islamic calendar with date conversion, Islamic events tracking, age calculator, and event countdowns',
      icon: '📅',
      path: '/hijri-calendar',
      category: 'calendar',
      stats: { value: '12+', label: 'Islamic Events' },
      featured: true,
      gradient: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)'
    },
    {
      id: 'islamic-events',
      title: 'Islamic Events & Holidays',
      description: 'Discover upcoming Islamic holidays like Ramadan, Eid, Mawlid, Ashura with countdown timers and yearly calendar',
      icon: '🎉',
      path: '/islamic-events',
      category: 'calendar',
      stats: { value: '20+', label: 'Annual Events' },
      gradient: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)'
    },
    {
      id: 'prayer-times',
      title: 'Prayer Times',
      description: 'Accurate salah times based on your GPS location with countdown to next prayer and multiple calculation methods',
      icon: '🕐',
      path: '/islamic-resources/prayer-times',
      category: 'prayer',
      stats: { value: '5', label: 'Daily Prayers' },
      gradient: 'linear-gradient(135deg, #16a085 0%, #0e6655 100%)'
    },
    {
      id: 'qibla-direction',
      title: 'Qibla Direction Finder',
      description: 'Find the exact direction to the Kaaba from anywhere in the world with GPS-powered compass and distance calculation',
      icon: '🧭',
      path: '/islamic-resources/qibla-direction',
      category: 'prayer',
      gradient: 'linear-gradient(135deg, #3498db 0%, #1a5276 100%)'
    },
    {
      id: 'ramadan-calendar',
      title: 'Ramadan Calendar',
      description: 'Complete Ramadan timetable with Suhoor and Iftar times for your location throughout the blessed month',
      icon: '🌙',
      path: '/islamic-resources/ramadan-calendar',
      category: 'calendar',
      gradient: 'linear-gradient(135deg, #9b59b6 0%, #6c3483 100%)'
    },
    {
      id: 'names-of-allah',
      title: '99 Names of Allah',
      description: 'Explore Asma ul Husna - the 99 beautiful names of Allah with Arabic text, transliteration, meanings, and Quran references',
      icon: '✨',
      path: '/islamic-resources/names-of-allah',
      category: 'learning',
      stats: { value: '99', label: 'Divine Names' },
      gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    },
    {
      id: 'verse-of-day',
      title: 'Quran Verse of the Day',
      description: 'Daily Quranic verse with Arabic text, translation, tafsir commentary, and easy social media sharing',
      icon: '📖',
      path: '/islamic-resources/verse-of-day',
      category: 'quran',
      gradient: 'linear-gradient(135deg, #2980b9 0%, #1a5276 100%)'
    },
    {
      id: 'hadith-of-day',
      title: 'Hadith of the Day',
      description: 'Curated authentic hadith from major collections with Arabic text, translation, and explanation',
      icon: '📜',
      path: '/islamic-resources/hadith-of-day',
      category: 'hadith',
      gradient: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)'
    },
    {
      id: 'share-card',
      title: 'Quran Share Card Generator',
      description: 'Create beautiful, customizable image cards of Quran verses to share on social media with multiple themes',
      icon: '🖼️',
      path: '/islamic-resources/share-card',
      category: 'quran',
      gradient: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)'
    },
    {
      id: 'hijri-converter',
      title: 'Date Converter',
      description: 'Instantly convert dates between Hijri (Islamic) and Gregorian calendars with Arabic month names',
      icon: '🔄',
      path: '/islamic-resources/hijri-converter',
      category: 'calendar',
      gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
    },
    {
      id: 'adhkar',
      title: 'Morning & Evening Adhkar',
      description: 'Daily remembrance duas with recitation counter and progress tracking for spiritual growth',
      icon: '🌅',
      path: '/islamic-resources/adhkar',
      category: 'prayer',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
    },
    {
      id: 'ai-scholar',
      title: 'AI Islamic Scholar',
      description: 'Ask Islamic questions and get answers with Quran verses, hadith citations, and scholarly references',
      icon: '🤖',
      path: '/islamic-ai-scholar',
      category: 'learning',
      stats: { value: '24/7', label: 'Available' },
      gradient: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)'
    },
    {
      id: 'blogs',
      title: 'Islamic Blog',
      description: 'Educational articles on Quran, Hadith, Islamic history, and contemporary topics for spiritual growth',
      icon: '📝',
      path: '/blogs',
      category: 'learning',
      gradient: 'linear-gradient(135deg, #1abc9c 0%, #148f77 100%)'
    },
    {
      id: 'teachers',
      title: 'Find Quran Teachers',
      description: 'Connect with verified Quran teachers worldwide for personalized online classes and learning',
      icon: '👨‍🏫',
      path: '/teachers',
      category: 'learning',
      gradient: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)'
    },
    {
      id: 'islamic-events',
      title: 'Islamic Events & Holidays',
      description: 'Complete Islamic holidays calendar with Ramadan, Eid, Mawlid, Ashura dates and countdown to upcoming events',
      icon: '🎊',
      path: '/islamic-events',
      category: 'calendar',
      stats: { value: '20+', label: 'Annual Events' },
      gradient: 'linear-gradient(135deg, #8e44ad 0%, #5b2c6f 100%)'
    },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTools = tools.filter(t => t.featured);

  const platformStats = [
    { value: '114', label: 'Surahs', icon: '📖' },
    { value: '150+', label: 'Reciters', icon: '🎧' },
    { value: '17', label: 'Hadith Books', icon: '📚' },
    { value: '50,000+', label: 'Hadiths', icon: '📜' },
    { value: '298+', label: 'Duas', icon: '🤲' },
    { value: '15+', label: 'Free Tools', icon: '🛠️' },
  ];

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Islamic Resources' }
  ];

  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Islamic Resources & Tools - QuranDeen",
    "description": "Free comprehensive Islamic tools and resources for Muslims worldwide",
    "url": "https://qurandeen.com/islamic-resources",
    "numberOfItems": tools.length,
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": tool.title,
      "description": tool.description,
      "url": `https://qurandeen.com${tool.path}`
    }))
  };

  return (
    <div className="resources-page">
      <SEO 
        title="Free Islamic Resources - Hadith, Azkaar, Prayer Times, Hijri Calendar | QuranDeen"
        description="Access free Islamic resources: 17 Hadith collections with 50,000+ hadiths, 298+ authentic duas, prayer times, Qibla finder, Hijri calendar, 99 Names of Allah, AI Islamic scholar, and more."
        canonical="https://qurandeen.com/islamic-resources"
        keywords="Islamic resources, Quran tools, Hijri calendar, Adhkar, 99 Names of Allah, Hadith collections, prayer times, Qibla direction, Ramadan calendar, Islamic tools"
        breadcrumbs={breadcrumbs}
        schema={toolsSchema}
      />

      <section className={`resources-hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🕌</span>
            <span>Free Islamic Platform</span>
          </div>
          <h1>Islamic Resources & Tools</h1>
          <p className="hero-subtitle">
            Your comprehensive destination for Quran, Hadith, prayers, and Islamic utilities. 
            All tools are free, ad-free, and designed for your daily spiritual journey.
          </p>
          <div className="hero-stats">
            {platformStats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <span className="stat-icon">{stat.icon}</span>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Resources</h2>
            <p>Most popular tools used by our community</p>
          </div>
          <div className="featured-grid">
            {featuredTools.map((tool, index) => (
              <Link 
                to={tool.path} 
                key={tool.id} 
                className={`featured-card ${isVisible ? 'visible' : ''}`}
                style={{ '--delay': `${index * 0.1}s`, background: tool.gradient }}
              >
                <div className="featured-icon">{tool.icon}</div>
                <div className="featured-content">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  {tool.stats && (
                    <div className="featured-stat">
                      <span className="stat-num">{tool.stats.value}</span>
                      <span className="stat-text">{tool.stats.label}</span>
                    </div>
                  )}
                </div>
                <div className="featured-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="tools-section">
        <div className="section-container">
          <div className="tools-header">
            <div className="tools-header-content">
              <h2>All Islamic Tools</h2>
              <p>Explore our complete collection of Islamic resources</p>
            </div>
            <div className="tools-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input 
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span className="tab-label">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="tools-grid">
            {filteredTools.map((tool, index) => (
              <Link 
                to={tool.path} 
                key={tool.id} 
                className={`tool-card ${isVisible ? 'visible' : ''}`}
                style={{ '--delay': `${index * 0.05}s` }}
              >
                <div className="tool-icon-wrapper" style={{ background: tool.gradient }}>
                  <span className="tool-icon">{tool.icon}</span>
                </div>
                <div className="tool-content">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  {tool.stats && (
                    <div className="tool-stat">
                      <span className="tool-stat-value">{tool.stats.value}</span>
                      <span className="tool-stat-label">{tool.stats.label}</span>
                    </div>
                  )}
                </div>
                <div className="tool-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No resources found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Start Your Quran Journey Today</h2>
              <p>Read, listen, and learn the Holy Quran with 150+ world-class reciters and 100+ translations in 40+ languages</p>
              <div className="cta-buttons">
                <Link to="/" className="cta-btn primary">
                  <span>Read Quran</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/quran-mp3-audio" className="cta-btn secondary">
                  <span>Listen to Reciters</span>
                </Link>
              </div>
            </div>
            <div className="cta-decoration">
              <span className="cta-icon">📖</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Tools;
