import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import WordByWord from '../components/WordByWord';
import { resolveSurahIdentifier, getSurahByNumber, getCanonicalSlug } from '../data/surahData';
import { 
  fetchAyah as fetchAyahCached,
  fetchTafsirContent as fetchTafsirCached,
  fetchWordByWord as fetchWordByWordCached
} from '../services/quranService';
import '../styles/ayah.css';

function Ayah({ fontSize, selectedTranslation, selectedReciter, selectedScript, selectedTafsir, selectedFont }) {
  const { surahIdentifier, ayahNumber } = useParams();
  const ayahNum = parseInt(ayahNumber);
  
  const resolved = useMemo(() => resolveSurahIdentifier(surahIdentifier), [surahIdentifier]);
  const shouldRedirect = resolved && resolved.redirect;
  const redirectSlug = shouldRedirect ? getCanonicalSlug(resolved.number) : null;
  const surahNumber = resolved ? resolved.number : null;

  const [ayahData, setAyahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirText, setTafsirText] = useState(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [wordByWordMode, setWordByWordMode] = useState(() => localStorage.getItem('wordByWordMode') === 'true');
  const [wbwData, setWbwData] = useState(null);
  const [wbwLoading, setWbwLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  const surahInfo = useMemo(() => surahNumber ? getSurahByNumber(surahNumber) : null, [surahNumber]);

  useEffect(() => {
    if (!surahNumber || !ayahNum) return;
    fetchAyah();
    loadBookmarks();
    setShowTafsir(false);
    setTafsirText(null);
    setWbwData(null);
  }, [surahNumber, ayahNum, selectedTranslation, selectedReciter, selectedScript]);

  useEffect(() => {
    if (wordByWordMode && surahNumber && ayahNum && !wbwData) {
      fetchWbw();
    }
  }, [wordByWordMode, surahNumber, ayahNum]);

  const fetchAyah = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAyahCached(surahNumber, ayahNum, selectedTranslation, selectedScript, selectedReciter);
      setAyahData(data);
    } catch (err) {
      setError('Failed to load ayah. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWbw = async () => {
    setWbwLoading(true);
    try {
      const data = await fetchWordByWordCached(surahNumber, ayahNum);
      setWbwData(data.data?.words || []);
    } catch (err) {
      console.error('Failed to fetch word-by-word:', err);
    } finally {
      setWbwLoading(false);
    }
  };

  const loadBookmarks = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved);
  };

  const isBookmarked = () => {
    return bookmarks.some(b => b.surah === surahNumber && b.ayah === ayahNum);
  };

  const toggleBookmark = () => {
    if (!ayahData) return;
    let updated;
    if (isBookmarked()) {
      updated = bookmarks.filter(b => !(b.surah === surahNumber && b.ayah === ayahNum));
    } else {
      updated = [...bookmarks, {
        surah: surahNumber,
        ayah: ayahNum,
        arabicText: ayahData.arabic?.data?.text,
        translationText: ayahData.translation?.data?.text,
        surahName: surahInfo?.englishName,
        savedAt: new Date().toISOString()
      }];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const toggleTafsir = async () => {
    if (showTafsir) {
      setShowTafsir(false);
      return;
    }
    setShowTafsir(true);
    if (!tafsirText) {
      setTafsirLoading(true);
      try {
        const data = await fetchTafsirCached(surahNumber, ayahNum, selectedTafsir);
        setTafsirText(data.data?.text || 'Tafsir not available');
      } catch (err) {
        setTafsirText('Failed to load tafsir');
      } finally {
        setTafsirLoading(false);
      }
    }
  };

  const playAudio = () => {
    if (!ayahData?.audio?.data?.audio) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = ayahData.audio.data.audio;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const shareAyah = (platform) => {
    if (!ayahData) return;
    const text = ayahData.translation?.data?.text || '';
    const ref = `${surahInfo?.englishName} ${surahNumber}:${ayahNum}`;
    const shareText = `"${text}" - ${ref}`;
    const url = `https://qurandeen.com/surah/${surahInfo?.slug}/ayah/${ayahNum}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText + '\n' + url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleWordByWord = () => {
    const newMode = !wordByWordMode;
    setWordByWordMode(newMode);
    localStorage.setItem('wordByWordMode', newMode.toString());
    if (newMode && !wbwData) fetchWbw();
  };

  const getFontFamily = () => {
    switch (selectedFont) {
      case 'indopak': return "'PDMS Saleem', 'Al Majeed Quranic', serif";
      case 'nastaliq': return "'IndoPak Nastaleeq', 'Noto Nastaliq Urdu', serif";
      case 'naskh': return "'Naskh Nastaleeq', 'PDMS Saleem', serif";
      case 'mequran': return "'Me Quran', 'Al Majeed Quranic', serif";
      case 'uthmani': return "'KFGQPC Uthmani', serif";
      default: return "'Amiri', serif";
    }
  };

  const getNextAyah = () => {
    if (!surahInfo) return null;
    if (ayahNum < surahInfo.ayahs) {
      return { surah: surahNumber, ayah: ayahNum + 1, slug: surahInfo.slug, surahName: surahInfo.englishName };
    }
    if (surahNumber < 114) {
      const nextSurah = getSurahByNumber(surahNumber + 1);
      return { surah: surahNumber + 1, ayah: 1, slug: nextSurah.slug, surahName: nextSurah.englishName };
    }
    return null;
  };

  const getPrevAyah = () => {
    if (!surahInfo) return null;
    if (ayahNum > 1) {
      return { surah: surahNumber, ayah: ayahNum - 1, slug: surahInfo.slug, surahName: surahInfo.englishName };
    }
    if (surahNumber > 1) {
      const prevSurah = getSurahByNumber(surahNumber - 1);
      return { surah: surahNumber - 1, ayah: prevSurah.ayahs, slug: prevSurah.slug, surahName: prevSurah.englishName };
    }
    return null;
  };

  if (shouldRedirect && redirectSlug) {
    return <Navigate to={`/surah/${redirectSlug}/ayah/${ayahNum}`} replace />;
  }

  if (!surahNumber || !ayahNum || isNaN(ayahNum)) {
    return <ErrorMessage message="Invalid ayah reference." />;
  }

  if (surahInfo && (ayahNum < 1 || ayahNum > surahInfo.ayahs)) {
    return <ErrorMessage message={`Surah ${surahInfo.englishName} has ${surahInfo.ayahs} ayahs. Ayah ${ayahNum} does not exist.`} />;
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAyah} title="Loading ayah" />;
  if (!ayahData) return null;

  const arabicText = ayahData.arabic?.data?.text || '';
  const translationText = ayahData.translation?.data?.text || '';
  const urduText = ayahData.urdu?.data?.text || '';
  const audioUrl = ayahData.audio?.data?.audio || '';
  const surahSlug = surahInfo?.slug || surahNumber;
  const surahMeaning = surahInfo?.meaning || '';
  const canonicalUrl = `https://qurandeen.com/surah/${surahSlug}/ayah/${ayahNum}`;

  const nextAyah = getNextAyah();
  const prevAyah = getPrevAyah();

  const seoTitle = `Surah ${surahInfo?.englishName} Ayah ${ayahNum} - ${surahInfo?.name} ${surahNumber}:${ayahNum} | QuranDeen`;
  const seoDesc = `Read Surah ${surahInfo?.englishName} (${surahInfo?.name}) Ayah ${ayahNum} - "${translationText.substring(0, 150)}${translationText.length > 150 ? '...' : ''}" with Arabic text, English & Urdu translation, Tafsir, audio, and word-by-word analysis.`;

  return (
    <div className="ayah-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={`Surah ${surahInfo?.englishName} Ayah ${ayahNum} - Arabic Text & Translation`} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="QuranDeen" />
        <meta property="og:image" content="https://qurandeen.com/og-image.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:section" content="Quran" />
        <meta property="article:tag" content={`Surah ${surahInfo?.englishName}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Surah ${surahInfo?.englishName} Ayah ${ayahNum}`} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content="https://qurandeen.com/og-image.png" />

        <meta name="keywords" content={`Surah ${surahInfo?.englishName} Ayah ${ayahNum}, ${surahInfo?.name} ${ayahNum}, Quran ${surahNumber}:${ayahNum}, ${surahInfo?.englishName} verse ${ayahNum}, Quran translation, Quran Arabic text, ${surahInfo?.englishName} tafsir, word by word Quran, Holy Quran online`} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="author" content="QuranDeen" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Surah ${surahInfo?.englishName} Ayah ${ayahNum} - ${surahMeaning}`,
            "description": seoDesc,
            "url": canonicalUrl,
            "image": "https://qurandeen.com/og-image.png",
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "author": { "@type": "Organization", "name": "QuranDeen", "url": "https://qurandeen.com" },
            "publisher": {
              "@type": "Organization",
              "name": "QuranDeen",
              "url": "https://qurandeen.com",
              "logo": { "@type": "ImageObject", "url": "https://qurandeen.com/og-image.png" }
            },
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
            "inLanguage": ["en", "ar", "ur"],
            "about": {
              "@type": "Book",
              "name": "The Holy Quran",
              "alternateName": "القرآن الكريم",
              "bookFormat": "EBook",
              "numberOfPages": 604,
              "hasPart": {
                "@type": "Chapter",
                "name": surahInfo?.englishName,
                "alternateName": surahInfo?.name,
                "position": surahNumber,
                "description": surahMeaning
              }
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": [".ayah-arabic-text", ".ayah-translation-text", ".ayah-urdu-text"]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://qurandeen.com" },
              { "@type": "ListItem", "position": 2, "name": "Quran", "item": "https://qurandeen.com" },
              { "@type": "ListItem", "position": 3, "name": `Surah ${surahInfo?.englishName}`, "item": `https://qurandeen.com/surah/${surahSlug}` },
              { "@type": "ListItem", "position": 4, "name": `Ayah ${ayahNum}`, "item": canonicalUrl }
            ]
          })}
        </script>
      </Helmet>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <nav className="ayah-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/">Quran</Link></li>
          <li><Link to={`/surah/${surahSlug}`}>Surah {surahInfo?.englishName}</Link></li>
          <li aria-current="page">Ayah {ayahNum}</li>
        </ol>
      </nav>

      <header className="ayah-header-section">
        <div className="ayah-surah-badge">
          <span className="badge-arabic">{surahInfo?.name}</span>
          <span className="badge-english">Surah {surahInfo?.englishName}</span>
          <span className="badge-meaning">{surahMeaning}</span>
        </div>
        <h1 className="ayah-page-title">
          Verse {ayahNum} <span className="ayah-ref">({surahNumber}:{ayahNum})</span>
        </h1>
        <div className="ayah-meta-badges">
          <span className="meta-badge">{surahInfo?.revelationType}</span>
          <span className="meta-badge">{surahInfo?.ayahs} Ayahs</span>
          <span className="meta-badge">Surah {surahNumber}</span>
        </div>
      </header>

      <article className="ayah-content-card">
        <div className="ayah-arabic-section">
          {wordByWordMode ? (
            <div className="ayah-wbw-container">
              {wbwLoading ? (
                <div className="wbw-loading">Loading word-by-word...</div>
              ) : wbwData ? (
                <WordByWord words={wbwData} selectedFont={selectedFont} fontSize={fontSize} />
              ) : (
                <button className="wbw-load-btn" onClick={fetchWbw}>Load word-by-word</button>
              )}
            </div>
          ) : (
            <p className="ayah-arabic-text" dir="rtl" lang="ar" style={{ fontSize: `${fontSize / 16}rem`, fontFamily: getFontFamily() }}>
              {arabicText}
            </p>
          )}
        </div>

        <div className="ayah-translations-section">
          <div className="translation-block english-translation">
            <h2 className="translation-label">English Translation</h2>
            <p className="ayah-translation-text" lang="en">{translationText}</p>
          </div>
          <div className="translation-block urdu-translation">
            <h2 className="translation-label">Urdu Translation</h2>
            <p className="ayah-urdu-text" dir="rtl" lang="ur">{urduText}</p>
          </div>
        </div>

        <div className="ayah-actions-bar">
          <button className={`ayah-action-btn ${isPlaying ? 'playing' : ''}`} onClick={playAudio} title={isPlaying ? 'Pause' : 'Play Audio'} disabled={!audioUrl}>
            <span className="action-icon">{isPlaying ? '⏸' : '▶'}</span>
            <span className="action-label">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button className={`ayah-action-btn ${wordByWordMode ? 'active' : ''}`} onClick={toggleWordByWord} title="Word by Word">
            <span className="action-icon">📖</span>
            <span className="action-label">Word by Word</span>
          </button>
          <button className={`ayah-action-btn ${isBookmarked() ? 'bookmarked' : ''}`} onClick={toggleBookmark} title={isBookmarked() ? 'Remove Bookmark' : 'Bookmark'}>
            <span className="action-icon">{isBookmarked() ? '🔖' : '📑'}</span>
            <span className="action-label">{isBookmarked() ? 'Saved' : 'Bookmark'}</span>
          </button>
          <button className={`ayah-action-btn ${showTafsir ? 'active' : ''}`} onClick={toggleTafsir} title="Tafsir">
            <span className="action-icon">📜</span>
            <span className="action-label">Tafsir</span>
          </button>
          <button className="ayah-action-btn" onClick={() => shareAyah('twitter')} title="Share on X">
            <span className="action-icon">𝕏</span>
            <span className="action-label">Share</span>
          </button>
          <button className="ayah-action-btn" onClick={() => shareAyah('whatsapp')} title="Share on WhatsApp">
            <span className="action-icon">💬</span>
            <span className="action-label">WhatsApp</span>
          </button>
          <button className={`ayah-action-btn ${copied ? 'copied' : ''}`} onClick={() => shareAyah('copy')} title="Copy">
            <span className="action-icon">{copied ? '✓' : '📋'}</span>
            <span className="action-label">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {showTafsir && (
          <div className="ayah-tafsir-section">
            <h3 className="tafsir-heading">Tafsir</h3>
            {tafsirLoading ? (
              <p className="tafsir-loading">Loading tafsir...</p>
            ) : (
              <p className="tafsir-content-text">{tafsirText}</p>
            )}
          </div>
        )}
      </article>

      <nav className="ayah-navigation" aria-label="Ayah navigation">
        {prevAyah ? (
          <Link to={`/surah/${prevAyah.slug}/ayah/${prevAyah.ayah}`} className="ayah-nav-btn prev">
            <span className="nav-arrow">←</span>
            <span className="nav-info">
              <span className="nav-label">Previous Ayah</span>
              <span className="nav-detail">{prevAyah.surahName} {prevAyah.surah}:{prevAyah.ayah}</span>
            </span>
          </Link>
        ) : <div />}
        <Link to={`/surah/${surahSlug}`} className="ayah-nav-btn center">
          <span className="nav-label">Full Surah</span>
          <span className="nav-detail">{surahInfo?.englishName}</span>
        </Link>
        {nextAyah ? (
          <Link to={`/surah/${nextAyah.slug}/ayah/${nextAyah.ayah}`} className="ayah-nav-btn next">
            <span className="nav-info">
              <span className="nav-label">Next Ayah</span>
              <span className="nav-detail">{nextAyah.surahName} {nextAyah.surah}:{nextAyah.ayah}</span>
            </span>
            <span className="nav-arrow">→</span>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}

export default Ayah;
