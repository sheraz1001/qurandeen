import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../components/HeroAnimated';
import { azkaarCategories } from '../data/azkaarData';
import '../styles/azkaar.css';

function Azkaar() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = azkaarCategories.filter(cat => 
    cat.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.nameAr.includes(searchTerm) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCategoryIds = ['morning-evening', 'after-prayer', 'before-sleep', 'waking-up', 'anxiety-sorrow', 'distress', 'istikhara', 'travel'];
  const featured = azkaarCategories.filter(c => featuredCategoryIds.includes(c.id));
  const other = filteredCategories.filter(c => !featuredCategoryIds.includes(c.id));

  return (
    <div className="azkaar-page">
      <Helmet>
        <title>Daily Azkaar & Duas | Hisnul Muslim - QuranDeen</title>
        <meta name="description" content="Complete collection of authentic Islamic duas and azkaar from Hisnul Muslim (Fortress of the Muslim). Morning, evening, prayer, sleep, and protection supplications with Arabic, transliteration and English translation." />
        <meta name="keywords" content="azkaar, adhkar, duas, supplications, hisnul muslim, fortress of the muslim, morning adhkar, evening adhkar, islamic prayers, dhikr" />
        <link rel="canonical" href="https://qurandeen.com/azkaar" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Daily Azkaar & Duas",
            "description": "Complete collection of authentic Islamic duas and azkaar from Hisnul Muslim",
            "url": "https://qurandeen.com/azkaar",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": azkaarCategories.map((cat, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": cat.nameEn,
                "url": `https://qurandeen.com/azkaar/${cat.id}`
              }))
            }
          })}
        </script>
      </Helmet>

      <HeroAnimated
        icon="🤲"
        title="Daily Azkaar & Duas"
        subtitle="Authentic supplications from Hisnul Muslim (Fortress of the Muslim)"
        stats={[
          `${azkaarCategories.length} Categories`,
          '300+ Duas',
          'Arabic & English'
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Islamic Resources', href: '/islamic-resources' },
          { name: 'Azkaar & Duas' }
        ]}
      />

      <div className="container">
        <div className="azkaar-intro">
          <p>
            Hisnul Muslim (حصن المسلم) or "Fortress of the Muslim" is a compilation of authentic duas and azkaar 
            from the Quran and Sunnah. Regular recitation of these supplications strengthens one's connection 
            with Allah and provides protection, blessings, and peace of mind.
          </p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search duas and azkaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>
        </div>

        {!searchTerm && (
          <section className="featured-section">
            <h2>Essential Daily Azkaar</h2>
            <p className="section-subtitle">Most important supplications for your daily routine</p>
            <div className="featured-grid">
              {featured.map(category => (
                <Link to={`/azkaar/${category.id}`} key={category.id} className="featured-card">
                  <div className="featured-icon">{category.icon}</div>
                  <div className="featured-content">
                    <h3>{category.nameEn}</h3>
                    <p className="arabic-name">{category.nameAr}</p>
                    <p className="description">{category.description}</p>
                    <span className="dua-count">{category.count} duas</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="all-categories">
          <h2>{searchTerm ? 'Search Results' : 'All Categories'}</h2>
          {searchTerm && <p className="section-subtitle">Found {filteredCategories.length} categories</p>}
          
          <div className="categories-grid">
            {(searchTerm ? filteredCategories : other).map(category => (
              <Link to={`/azkaar/${category.id}`} key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.nameEn}</h3>
                  <p className="arabic-name">{category.nameAr}</p>
                  <span className="dua-count">{category.count} duas</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <p>No categories found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="btn-secondary">Clear Search</button>
            </div>
          )}
        </section>

        <section className="benefits-section">
          <h2>Benefits of Regular Dhikr</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🛡️</span>
              <h3>Protection</h3>
              <p>Regular recitation provides protection from harm, evil eye, and negative influences.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">💚</span>
              <h3>Peace of Mind</h3>
              <p>Dhikr calms the heart and brings tranquility, reducing anxiety and stress.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">✨</span>
              <h3>Barakah</h3>
              <p>Blessings in your time, wealth, health, and all aspects of life.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🌟</span>
              <h3>Rewards</h3>
              <p>Immense rewards from Allah for every word of remembrance and supplication.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Start Your Daily Practice</h2>
          <p>Begin with the morning and evening adhkar - the most essential supplications for protection throughout the day and night.</p>
          <div className="cta-buttons">
            <Link to="/azkaar/morning" className="btn-primary btn-large">Morning Adhkar 🌅</Link>
            <Link to="/azkaar/evening" className="btn-secondary btn-large">Evening Adhkar 🌙</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Azkaar;
