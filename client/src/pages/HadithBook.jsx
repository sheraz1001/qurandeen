import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCollectionById, hadithCollections, legacyCollectionRedirects, generateChapterSlug } from '../data/hadithData';
import { fetchCollection, extractChaptersFromCollection } from '../services/hadithService';
import '../styles/hadith.css';

const HadithBook = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (legacyCollectionRedirects[collectionId]) {
      navigate(`/hadith/${legacyCollectionRedirects[collectionId]}`, { replace: true });
      return;
    }
  }, [collectionId, navigate]);

  const collection = getCollectionById(collectionId);

  useEffect(() => {
    if (!collection || legacyCollectionRedirects[collectionId]) {
      if (!legacyCollectionRedirects[collectionId]) {
        navigate('/hadith');
      }
      return;
    }

    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCollection(collectionId);
        const extractedChapters = extractChaptersFromCollection(data);
        setChapters(extractedChapters);
      } catch (err) {
        setError('Failed to load collection. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    loadCollection();
  }, [collectionId, collection, navigate]);

  const filteredChapters = searchQuery
    ? chapters.filter(ch => 
        ch.english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.arabic?.includes(searchQuery)
      )
    : chapters;

  const currentIndex = hadithCollections.findIndex(c => c.id === collectionId);
  const prevCollection = currentIndex > 0 ? hadithCollections[currentIndex - 1] : null;
  const nextCollection = currentIndex < hadithCollections.length - 1 ? hadithCollections[currentIndex + 1] : null;

  const schema = collection ? [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": collection.name,
      "alternateName": collection.nameArabic,
      "author": {
        "@type": "Person",
        "name": collection.author
      },
      "description": collection.description,
      "inLanguage": ["ar", "en"],
      "url": `https://qurandeen.com/hadith/${collectionId}`
    }
  ] : [];

  if (!collection || legacyCollectionRedirects[collectionId]) {
    return null;
  }

  return (
    <div className="hadith-page">
      <Helmet>
        <title>{collection.name} - Read All Chapters & Hadiths | QuranDeen</title>
        <meta name="description" content={`Read ${collection.name} (${collection.nameArabic}) - ${collection.totalHadith.toLocaleString()} hadiths compiled by ${collection.author}. ${collection.description}`} />
        <meta name="keywords" content={`${collection.name}, ${collection.nameArabic}, ${collection.author}, hadith, islamic hadith`} />
        <link rel="canonical" href={`https://qurandeen.com/hadith/${collectionId}`} />
        <meta property="og:title" content={`${collection.name} - Complete Hadith Book | QuranDeen`} />
        <meta property="og:description" content={collection.description} />
        <meta property="og:url" content={`https://qurandeen.com/hadith/${collectionId}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="hadith-hero">
        <div className="container">
          <div className="hadith-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/hadith">Hadith Collections</Link>
            <span>/</span>
            <span className="current">{collection.name}</span>
          </div>

          <div className="hadith-book-header">
            <div className="hadith-book-icon">{collection.icon}</div>
            <div className="hadith-book-info">
              <h1>{collection.name}</h1>
              <p className="arabic">{collection.nameArabic}</p>
              <p className="author">by {collection.author}</p>
              <p className="description">{collection.description}</p>
            </div>
            <div className="hadith-book-stats">
              <div className="hadith-book-stat">
                <div className="number">{collection.totalHadith.toLocaleString()}</div>
                <div className="label">Total Hadiths</div>
              </div>
              <div className="hadith-book-stat">
                <div className="number">{chapters.length}</div>
                <div className="label">Chapters</div>
              </div>
            </div>
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
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="hadith-container">
        {loading ? (
          <div className="hadith-loading">
            <div className="hadith-spinner"></div>
            <p>Loading chapters...</p>
          </div>
        ) : error ? (
          <div className="hadith-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="hadith-chapters-list">
              {filteredChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/hadith/${collectionId}/${generateChapterSlug(chapter.id, chapter.english)}`}
                  className="hadith-chapter-item"
                >
                  <div className="hadith-chapter-left">
                    <div className="hadith-chapter-number">{chapter.id}</div>
                    <div className="hadith-chapter-info">
                      <h3>{chapter.english || `Chapter ${chapter.id}`}</h3>
                      {chapter.arabic && <p className="arabic">{chapter.arabic}</p>}
                      <p className="count">{chapter.hadithCount} hadiths</p>
                    </div>
                  </div>
                  <svg className="hadith-chapter-arrow" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {filteredChapters.length === 0 && (
              <div className="hadith-empty">
                <div className="hadith-empty-icon">📖</div>
                <p>No chapters found matching "{searchQuery}"</p>
              </div>
            )}

            <div className="hadith-nav-buttons">
              {prevCollection ? (
                <Link to={`/hadith/${prevCollection.id}`} className="hadith-nav-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>{prevCollection.name}</span>
                </Link>
              ) : <div />}
              
              {nextCollection && (
                <Link to={`/hadith/${nextCollection.id}`} className="hadith-nav-btn">
                  <span>{nextCollection.name}</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HadithBook;
