import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { hadithCollections, hadithCategories, getCollectionsByCategory } from '../data/hadithData';
import '../styles/hadith.css';

const HadithCollections = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = searchQuery
    ? hadithCollections.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameArabic.includes(searchQuery) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hadithCollections;

  const groupedCollections = searchQuery
    ? { search: { name: 'Search Results', collections: filteredCollections } }
    : Object.keys(hadithCategories).reduce((acc, catKey) => {
        acc[catKey] = {
          ...hadithCategories[catKey],
          collections: getCollectionsByCategory(catKey)
        };
        return acc;
      }, {});

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Hadith Collections - Complete Hadith Library",
      "description": "Browse 17 authentic Hadith collections including Sahih Bukhari, Sahih Muslim, Sunan Abu Dawud, and more with 50,000+ hadiths.",
      "url": "https://qurandeen.com/hadith",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": hadithCollections.map((col, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": col.name,
          "url": `https://qurandeen.com/hadith/${col.id}`
        }))
      }
    }
  ];

  return (
    <div className="hadith-page">
      <Helmet>
        <title>Hadith Collections - Sahih Bukhari, Muslim, Abu Dawud & More | QuranDeen</title>
        <meta name="description" content="Access complete Hadith collections including Sahih Bukhari, Sahih Muslim, Sunan Abu Dawud, Tirmidhi, and 13 more books. Read 50,000+ authentic hadiths in Arabic, English, Urdu, and Bengali." />
        <meta name="keywords" content="hadith, sahih bukhari, sahih muslim, hadith collections, islamic hadith, prophet muhammad sayings, sunnah" />
        <link rel="canonical" href="https://qurandeen.com/hadith" />
        <meta property="og:title" content="Hadith Collections - Complete Hadith Library | QuranDeen" />
        <meta property="og:description" content="Browse 17 authentic Hadith collections with 50,000+ hadiths in multiple languages." />
        <meta property="og:url" content="https://qurandeen.com/hadith" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="hadith-hero">
        <div className="container">
          <div className="hadith-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Hadith Collections</span>
          </div>

          <div className="hadith-hero-content">
            <div className="hadith-hero-icon">📚</div>
            <h1>Hadith Collections</h1>
            <p className="arabic-title">مجموعة الأحاديث النبوية الشريفة</p>
            <p className="subtitle">
              Explore 17 authentic Hadith collections containing over 50,000 sayings and actions 
              of Prophet Muhammad (peace be upon him)
            </p>
          </div>
        </div>
      </div>

      <div className="hadith-search-wrapper">
        <div className="hadith-search-box">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search collections by name or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="hadith-container">
        <div className="hadith-stats">
          <div className="hadith-stat-card">
            <div className="number">17</div>
            <div className="label">Collections</div>
          </div>
          <div className="hadith-stat-card">
            <div className="number">50K+</div>
            <div className="label">Hadiths</div>
          </div>
          <div className="hadith-stat-card">
            <div className="number">4</div>
            <div className="label">Languages</div>
          </div>
          <div className="hadith-stat-card">
            <div className="number">100%</div>
            <div className="label">Authentic</div>
          </div>
        </div>

        {Object.entries(groupedCollections).map(([catKey, category]) => (
          <div key={catKey} className="hadith-section">
            <div className="hadith-section-header">
              <h2>{category.name}</h2>
              {category.nameArabic && (
                <p className="arabic">{category.nameArabic}</p>
              )}
              {category.description && (
                <p>{category.description}</p>
              )}
            </div>

            <div className="hadith-grid">
              {category.collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/hadith/${collection.id}`}
                  className="hadith-card"
                >
                  <div className="hadith-card-header">
                    <span className="hadith-card-icon">{collection.icon}</span>
                    <span className="hadith-card-badge">
                      {collection.totalHadith.toLocaleString()} hadiths
                    </span>
                  </div>
                  
                  <h3>{collection.name}</h3>
                  <p className="arabic-name">{collection.nameArabic}</p>
                  <p className="author">by {collection.author}</p>
                  <p className="description">{collection.description}</p>

                  <div className="hadith-card-footer">
                    <span>Read Collection</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredCollections.length === 0 && (
          <div className="hadith-empty">
            <div className="hadith-empty-icon">🕌</div>
            <p>No collections found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')}>Clear search</button>
          </div>
        )}
      </div>

      <div className="hadith-info-section">
        <h2>What is Hadith?</h2>
        <p>
          Hadith refers to the recorded sayings, actions, and approvals of Prophet Muhammad 
          (peace be upon him). These collections serve as the second most important source 
          of Islamic law and guidance after the Holy Quran. The hadith literature provides 
          practical examples of how to implement Quranic teachings in daily life.
        </p>
      </div>
    </div>
  );
};

export default HadithCollections;
