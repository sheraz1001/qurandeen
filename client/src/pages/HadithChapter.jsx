import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCollectionById, supportedLanguages, legacyCollectionRedirects, parseChapterSlug, generateChapterSlug } from '../data/hadithData';
import { fetchCollection, getHadithsByChapter, extractChaptersFromCollection, fetchBanglaHadiths } from '../services/hadithService';
import '../styles/hadith.css';

const HadithChapter = () => {
  const { collectionId, chapterSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [copiedId, setCopiedId] = useState(null);
  const [banglaData, setBanglaData] = useState(null);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('hadith_font_size') || 'medium');

  const chapterNum = parseChapterSlug(chapterSlug);

  useEffect(() => {
    if (legacyCollectionRedirects[collectionId]) {
      const newCollectionId = legacyCollectionRedirects[collectionId];
      navigate(`/hadith/${newCollectionId}/${chapterSlug}`, { replace: true });
      return;
    }
  }, [collectionId, chapterSlug, navigate]);

  const collection = getCollectionById(collectionId);

  useEffect(() => {
    if (!collection || !chapterNum || legacyCollectionRedirects[collectionId]) {
      if (!legacyCollectionRedirects[collectionId] && !chapterNum) {
        navigate(`/hadith/${collectionId}`);
      }
      return;
    }

    const loadChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const collectionData = await fetchCollection(collectionId);
        const allChapters = extractChaptersFromCollection(collectionData);
        setChapters(allChapters);
        
        const chapterHadiths = getHadithsByChapter(collectionData, chapterNum);
        setHadiths(chapterHadiths);
        
        const currentChapter = allChapters.find(c => c.id === chapterNum);
        setChapterInfo(currentChapter);

        if (currentChapter) {
          const expectedSlug = generateChapterSlug(currentChapter.id, currentChapter.english);
          if (chapterSlug !== expectedSlug && chapterSlug !== String(chapterNum)) {
            navigate(`/hadith/${collectionId}/${expectedSlug}`, { replace: true });
            return;
          }
          if (chapterSlug === String(chapterNum) && currentChapter.english) {
            navigate(`/hadith/${collectionId}/${expectedSlug}`, { replace: true });
            return;
          }
        }

        if (selectedLang === 'bn') {
          const bangla = await fetchBanglaHadiths(collectionId, chapterNum);
          setBanglaData(bangla);
        }
      } catch (err) {
        setError('Failed to load hadiths. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    loadChapter();
  }, [collectionId, chapterNum, chapterSlug, collection, navigate, selectedLang]);

  useEffect(() => {
    localStorage.setItem('hadith_font_size', fontSize);
  }, [fontSize]);

  const handleCopy = async (hadith) => {
    const text = `${hadith.arabic}\n\n${hadith.english?.narrator}: ${hadith.english?.text}\n\n- ${collection?.name}, Hadith ${hadith.id}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (hadith) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hadith from ${collection?.name}`,
          text: `${hadith.english?.text?.substring(0, 200)}...`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const prevChapter = chapters.find(c => c.id === chapterNum - 1);
  const nextChapter = chapters.find(c => c.id === chapterNum + 1);

  const canonicalSlug = chapterInfo ? generateChapterSlug(chapterInfo.id, chapterInfo.english) : chapterSlug;

  const schema = collection && chapterInfo ? [
    {
      "@context": "https://schema.org",
      "@type": "Chapter",
      "name": chapterInfo.english || `Chapter ${chapterNum}`,
      "isPartOf": {
        "@type": "Book",
        "name": collection.name
      },
      "url": `https://qurandeen.com/hadith/${collectionId}/${canonicalSlug}`
    }
  ] : [];

  if (!collection || legacyCollectionRedirects[collectionId]) {
    return null;
  }

  return (
    <div className={`hadith-page font-${fontSize}`}>
      <Helmet>
        <title>{chapterInfo?.english || `Chapter ${chapterNum}`} - {collection.name} | QuranDeen</title>
        <meta name="description" content={`Read ${hadiths.length} hadiths from ${chapterInfo?.english || `Chapter ${chapterNum}`} of ${collection.name}. Arabic text with English translation.`} />
        <link rel="canonical" href={`https://qurandeen.com/hadith/${collectionId}/${canonicalSlug}`} />
        <meta property="og:title" content={`${chapterInfo?.english || `Chapter ${chapterNum}`} - ${collection.name}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="hadith-hero">
        <div className="container">
          <div className="hadith-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/hadith">Hadith</Link>
            <span>/</span>
            <Link to={`/hadith/${collectionId}`}>{collection.name}</Link>
            <span>/</span>
            <span className="current">{chapterInfo?.english || `Chapter ${chapterNum}`}</span>
          </div>

          <div className="hadith-book-header">
            <div className="hadith-book-info">
              <p className="author">{collection.name}</p>
              <h1>{chapterInfo?.english || `Chapter ${chapterNum}`}</h1>
              {chapterInfo?.arabic && <p className="arabic">{chapterInfo.arabic}</p>}
            </div>
            <div className="hadith-controls">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="hadith-lang-select"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nameNative}
                  </option>
                ))}
              </select>

              <div className="hadith-font-controls">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`hadith-font-btn ${fontSize === size ? 'active' : ''}`}
                  >
                    {size === 'small' ? 'A' : size === 'medium' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hadith-container" style={{ maxWidth: '900px' }}>
        {loading ? (
          <div className="hadith-loading">
            <div className="hadith-spinner"></div>
            <p>Loading hadiths...</p>
          </div>
        ) : error ? (
          <div className="hadith-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {hadiths.length} hadith{hadiths.length !== 1 ? 's' : ''} in this chapter
            </p>

            {hadiths.map((hadith, index) => (
              <article key={hadith.id} id={`hadith-${hadith.id}`} className="hadith-text-card">
                <div className="hadith-text-header">
                  <div className="hadith-text-number">
                    <span className="hadith-text-badge">{hadith.idInBook || hadith.id}</span>
                    <span className="hadith-text-label">Hadith #{hadith.idInBook || hadith.id}</span>
                  </div>
                  <div className="hadith-text-actions">
                    <button onClick={() => handleCopy(hadith)} className="hadith-action-btn" title="Copy hadith">
                      {copiedId === hadith.id ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <button onClick={() => handleShare(hadith)} className="hadith-action-btn" title="Share hadith">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="hadith-text-content">
                  <div className="hadith-arabic-text">{hadith.arabic}</div>
                  
                  <div className="hadith-divider"></div>

                  {selectedLang === 'en' && hadith.english && (
                    <>
                      {hadith.english.narrator && (
                        <p className="hadith-narrator">{hadith.english.narrator}</p>
                      )}
                      <p className="hadith-english-text">{hadith.english.text}</p>
                    </>
                  )}

                  {selectedLang === 'ar' && (
                    <p className="hadith-english-text" style={{ textAlign: 'right', direction: 'rtl' }}>
                      العربية فقط - Arabic text shown above
                    </p>
                  )}

                  {selectedLang === 'ur' && (
                    <div style={{ textAlign: 'right', direction: 'rtl' }}>
                      <p style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>اردو ترجمہ</p>
                      <p className="hadith-english-text">
                        {hadith.english?.text ? (
                          <span style={{ color: 'var(--text-muted)' }}>Urdu translation coming soon. English: {hadith.english.text}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Translation not available</span>
                        )}
                      </p>
                    </div>
                  )}

                  {selectedLang === 'bn' && (
                    <>
                      <p style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>বাংলা অনুবাদ</p>
                      {banglaData?.hadiths?.[index]?.hadithBengali ? (
                        <p className="hadith-english-text">{banglaData.hadiths[index].hadithBengali}</p>
                      ) : (
                        <p className="hadith-english-text" style={{ color: 'var(--text-muted)' }}>
                          Bengali translation available for major collections. English: {hadith.english?.text}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}

            {hadiths.length === 0 && (
              <div className="hadith-empty">
                <div className="hadith-empty-icon">📖</div>
                <p>No hadiths found in this chapter</p>
              </div>
            )}

            <div className="hadith-chapter-nav">
              {prevChapter ? (
                <Link to={`/hadith/${collectionId}/${generateChapterSlug(prevChapter.id, prevChapter.english)}`} className="hadith-chapter-nav-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </Link>
              ) : <div />}
              
              <Link to={`/hadith/${collectionId}`} className="hadith-all-chapters-link">
                All Chapters
              </Link>

              {nextChapter ? (
                <Link to={`/hadith/${collectionId}/${generateChapterSlug(nextChapter.id, nextChapter.english)}`} className="hadith-chapter-nav-btn">
                  <span>Next</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : <div />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HadithChapter;
