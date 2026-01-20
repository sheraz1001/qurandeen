import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import '../styles/tools.css';

function Tools() {
  const tools = [
    {
      id: 'share-card',
      title: 'Quran Share Card Generator',
      description: 'Create beautiful image cards of Quran verses to share on social media',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      path: '/islamic-resources/share-card',
      color: '#2ea043'
    },
    {
      id: 'verse-of-day',
      title: 'Quran Verse of the Day',
      description: 'Daily ayah with translation, reflection, and easy sharing',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      path: '/islamic-resources/verse-of-day',
      color: '#0969da'
    },
    {
      id: 'hijri-converter',
      title: 'Hijri-Gregorian Calendar',
      description: 'Convert dates between Hijri and Gregorian calendars with Islamic events',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      path: '/islamic-resources/hijri-converter',
      color: '#8250df'
    },
    {
      id: 'azkaar',
      title: 'Daily Azkaar & Duas',
      description: 'Complete Hisnul Muslim collection with 300+ authentic duas in 24 categories',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
      path: '/azkaar',
      color: '#bf8700'
    },
    {
      id: 'names-of-allah',
      title: '99 Names of Allah',
      description: 'Explore the beautiful names with meanings, verses and audio',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      path: '/islamic-resources/names-of-allah',
      color: '#cf222e'
    },
    {
      id: 'hadith-of-day',
      title: 'Hadith of the Day',
      description: 'Curated authentic hadith from Bukhari & Muslim with explanation',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      path: '/islamic-resources/hadith-of-day',
      color: '#1f6feb'
    },
    {
      id: 'prayer-times',
      title: 'Prayer Times',
      description: 'Accurate salah times for your location with next prayer countdown',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6v6l4 2"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
        </svg>
      ),
      path: '/islamic-resources/prayer-times',
      color: '#16a34a'
    },
    {
      id: 'qibla-direction',
      title: 'Qibla Direction Finder',
      description: 'Find the direction to the Kaaba with compass and distance calculation',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="12,2 14,10 12,8 10,10" fill="currentColor"/>
          <polygon points="12,22 10,14 12,16 14,14" fill="currentColor"/>
        </svg>
      ),
      path: '/islamic-resources/qibla-direction',
      color: '#0891b2'
    },
    {
      id: 'ramadan-calendar',
      title: 'Ramadan Calendar',
      description: 'Complete Ramadan timetable with Suhoor and Iftar times',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <path d="M12 8v4l2 2"/>
        </svg>
      ),
      path: '/islamic-resources/ramadan-calendar',
      color: '#7c3aed'
    }
  ];

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Islamic Resources' }
  ];

  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Islamic Resources & Tools",
    "description": "Free Islamic tools and resources for Muslims worldwide",
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
    <div className="tools-page">
      <SEO 
        title="Free Islamic Resources - Quran Share Card, Hijri Calendar, Adhkar, 99 Names of Allah"
        description="Free Islamic resources including Quran Share Card Generator, Hijri-Gregorian Calendar Converter, Morning & Evening Adhkar, 99 Names of Allah Explorer, Hadith of the Day, and more."
        canonical="https://qurandeen.com/islamic-resources"
        keywords="Islamic resources, Quran tools, Hijri calendar, Adhkar, 99 Names of Allah, Hadith, Islamic tools, Quran share card"
        breadcrumbs={breadcrumbs}
        schema={toolsSchema}
      />
      <HeroAnimated
        icon="🛠️"
        title="Islamic Resources"
        subtitle="Free tools to help you in your daily Islamic practice and learning"
        stats={['9 Tools', 'Free Forever', 'No Ads']}
        breadcrumbs={breadcrumbs}
      />

      <div className="tools-grid">
        {tools.map(tool => (
          <Link to={tool.path} key={tool.id} className="tool-card" style={{ '--tool-color': tool.color }}>
            <div className="tool-icon">
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <span className="tool-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Tools;
