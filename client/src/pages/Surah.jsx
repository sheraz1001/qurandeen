import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import WordByWord from '../components/WordByWord';

function Surah({ fontSize, selectedTranslation, setSelectedTranslation, selectedReciter, selectedScript, selectedTafsir, selectedFont }) {
  const { number } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [translationsLoading, setTranslationsLoading] = useState(true);
  const [openTafsir, setOpenTafsir] = useState(null);
  const [tafsirData, setTafsirData] = useState({});
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirs, setTafsirs] = useState([]);
  const [wordByWordMode, setWordByWordMode] = useState(() => {
    return localStorage.getItem('wordByWordMode') === 'true';
  });
  const [wordByWordData, setWordByWordData] = useState({});
  const [wbwLoading, setWbwLoading] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    fetchTranslations();
    fetchTafsirs();
  }, []);

  useEffect(() => {
    setTafsirData({});
    setOpenTafsir(null);
  }, [selectedTafsir]);

  useEffect(() => {
    fetchSurah();
    loadBookmarks();
  }, [number, selectedTranslation, selectedReciter, selectedScript]);

  useEffect(() => {
    if (surahData) {
      updateReadingHistory(surahData.arabic.data);
    }
  }, [surahData]);

  const fetchTranslations = async () => {
    try {
      setTranslationsLoading(true);
      const response = await axios.get('/api/translations');
      setTranslations(response.data.data || []);
    } catch (err) {
      console.error('Error fetching translations:', err);
    } finally {
      setTranslationsLoading(false);
    }
  };

  const fetchTafsirs = async () => {
    try {
      const response = await axios.get('/api/tafsirs');
      setTafsirs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tafsirs:', err);
    }
  };

  const getCurrentTafsirName = () => {
    const current = tafsirs.find(t => t.identifier === selectedTafsir);
    return current ? current.englishName : 'Tafsir';
  };

  const fetchSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/surah/${number}?translation=${selectedTranslation}&script=${selectedScript}&reciter=${selectedReciter}`);
      setSurahData(response.data);
    } catch (err) {
      setError('Failed to load surah. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved);
  };

  const updateReadingHistory = (surahInfo) => {
    const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    const existing = history.findIndex(h => h.number === surahInfo.number);
    if (existing > -1) {
      history.splice(existing, 1);
    }
    history.unshift({
      number: surahInfo.number,
      name: surahInfo.name,
      englishName: surahInfo.englishName,
      lastRead: new Date().toISOString()
    });
    localStorage.setItem('readingHistory', JSON.stringify(history.slice(0, 20)));
  };

  const isBookmarked = (surahNum, ayahNum) => {
    return bookmarks.some(b => b.surah === surahNum && b.ayah === ayahNum);
  };

  const toggleBookmark = (surahNum, ayahNum, arabicText, translationText, surahName) => {
    let updated;
    if (isBookmarked(surahNum, ayahNum)) {
      updated = bookmarks.filter(b => !(b.surah === surahNum && b.ayah === ayahNum));
    } else {
      updated = [...bookmarks, {
        surah: surahNum,
        ayah: ayahNum,
        arabicText,
        translationText,
        surahName,
        savedAt: new Date().toISOString()
      }];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const shareAyah = (platform, text, surahName, verseRef) => {
    const shareText = `"${text}" - ${surahName} (${verseRef})`;
    const url = `${window.location.origin}/surah/${number}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

  const playAudio = (ayah, audioUrl) => {
    if (playingAyah === ayah) {
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAyah(ayah);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingAyah(null);
  };

  const handleTranslationChange = (e) => {
    setSelectedTranslation(e.target.value);
  };

  const toggleTafsir = async (ayahNumber) => {
    if (openTafsir === ayahNumber) {
      setOpenTafsir(null);
      return;
    }
    
    setOpenTafsir(ayahNumber);
    
    if (!tafsirData[ayahNumber]) {
      setTafsirLoading(true);
      try {
        const response = await axios.get(`/api/tafsir/${number}/${ayahNumber}?slug=${selectedTafsir}`);
        setTafsirData(prev => ({
          ...prev,
          [ayahNumber]: response.data.data?.text || 'Tafsir not available'
        }));
      } catch (err) {
        setTafsirData(prev => ({
          ...prev,
          [ayahNumber]: 'Failed to load tafsir'
        }));
      } finally {
        setTafsirLoading(false);
      }
    }
  };

  const toggleWordByWordMode = () => {
    const newMode = !wordByWordMode;
    setWordByWordMode(newMode);
    localStorage.setItem('wordByWordMode', newMode.toString());
  };

  const fetchWordByWord = async (ayahNumber) => {
    if (wordByWordData[ayahNumber] || wbwLoading[ayahNumber]) return;
    
    setWbwLoading(prev => ({ ...prev, [ayahNumber]: true }));
    try {
      const response = await axios.get(`/api/word-by-word/${number}/${ayahNumber}`);
      setWordByWordData(prev => ({
        ...prev,
        [ayahNumber]: response.data.data?.words || []
      }));
    } catch (err) {
      console.error('Failed to fetch word-by-word:', err);
    } finally {
      setWbwLoading(prev => ({ ...prev, [ayahNumber]: false }));
    }
  };

  useEffect(() => {
    if (wordByWordMode && surahData) {
      const ayahs = surahData.arabic.data.ayahs;
      const loadBatch = async (startIndex, batchSize) => {
        const batch = ayahs.slice(startIndex, startIndex + batchSize);
        await Promise.all(batch.map(ayah => fetchWordByWord(ayah.numberInSurah)));
        if (startIndex + batchSize < ayahs.length) {
          setTimeout(() => loadBatch(startIndex + batchSize, batchSize), 100);
        }
      };
      loadBatch(0, 10);
    }
  }, [wordByWordMode, surahData, number]);

  const getFontFamily = () => {
    switch (selectedFont) {
      case 'indopak':
        return "'PDMS Saleem', 'Al Majeed Quranic', serif";
      case 'nastaliq':
        return "'IndoPak Nastaleeq', 'Noto Nastaliq Urdu', serif";
      case 'uthmani':
        return "'KFGQPC Uthmani', serif";
      default:
        return "'Amiri', serif";
    }
  };

  const getLanguageName = (langCode) => {
    const languages = {
      'en': 'English', 'ar': 'Arabic', 'ur': 'Urdu', 'bn': 'Bengali', 'fa': 'Persian',
      'tr': 'Turkish', 'id': 'Indonesian', 'ms': 'Malay', 'fr': 'French', 'de': 'German',
      'es': 'Spanish', 'it': 'Italian', 'nl': 'Dutch', 'pt': 'Portuguese', 'ru': 'Russian',
      'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean', 'hi': 'Hindi', 'ta': 'Tamil',
      'th': 'Thai', 'vi': 'Vietnamese', 'pl': 'Polish', 'cs': 'Czech', 'sq': 'Albanian',
      'az': 'Azerbaijani', 'bs': 'Bosnian', 'dv': 'Dhivehi', 'ha': 'Hausa', 'ku': 'Kurdish',
      'ml': 'Malayalam', 'no': 'Norwegian', 'ps': 'Pashto', 'ro': 'Romanian', 'sd': 'Sindhi',
      'so': 'Somali', 'sv': 'Swedish', 'sw': 'Swahili', 'tg': 'Tajik', 'tt': 'Tatar',
      'ug': 'Uyghur', 'uz': 'Uzbek', 'am': 'Amharic', 'bg': 'Bulgarian', 'my': 'Burmese'
    };
    return languages[langCode] || langCode.toUpperCase();
  };

  const groupedTranslations = translations.reduce((acc, t) => {
    const lang = getLanguageName(t.language);
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(t);
    return acc;
  }, {});

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurah} />;
  if (!surahData) return null;

  const { arabic, translation, audio } = surahData;
  const surahInfo = arabic.data;
  const ayahs = surahInfo.ayahs;
  const translationAyahs = translation.data.ayahs;
  const audioAyahs = audio.data.ayahs;
  const currentTranslationInfo = translation.data;

  return (
    <div className="surah-page">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      
      <div className="surah-header">
        <Link to="/" className="back-link">← Back to Surahs</Link>
        <div className="surah-title">
          <h1 className="surah-name-arabic-large">{surahInfo.name}</h1>
          <h2>{surahInfo.englishName}</h2>
          <p className="surah-subtitle">
            {surahInfo.englishNameTranslation} • {surahInfo.revelationType} • {surahInfo.numberOfAyahs} Ayahs
          </p>
        </div>
      </div>

      <div className="surah-controls">
        <div className="translation-selector">
          <label htmlFor="translation-select">Translation:</label>
          <select 
            id="translation-select"
            value={selectedTranslation}
            onChange={handleTranslationChange}
            disabled={translationsLoading}
          >
            {translationsLoading ? (
              <option>Loading...</option>
            ) : (
              Object.entries(groupedTranslations)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([language, editions]) => (
                  <optgroup key={language} label={language}>
                    {editions.map((edition) => (
                      <option key={edition.identifier} value={edition.identifier}>
                        {edition.englishName}
                      </option>
                    ))}
                  </optgroup>
                ))
            )}
          </select>
          <span className="current-translation">
            by {currentTranslationInfo.edition?.englishName || 'Unknown'}
          </span>
        </div>

        <div className="wbw-mode-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={wordByWordMode}
              onChange={toggleWordByWordMode}
            />
            <span>Word-by-Word Mode</span>
          </label>
          {wordByWordMode && (
            <span className="wbw-mode-info">Click any word to hear pronunciation</span>
          )}
        </div>
      </div>

      {surahInfo.number !== 1 && surahInfo.number !== 9 && (
        <div className="bismillah" style={{ fontFamily: getFontFamily() }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      )}

      <div className="ayahs-list">
        {ayahs.map((ayah, index) => (
          <div key={ayah.numberInSurah} className={`ayah-card ${ayah.sajda ? 'has-sajda' : ''}`}>
            <div className="ayah-header">
              <div className="ayah-number-container">
                <span className="ayah-number">{ayah.numberInSurah}</span>
                {ayah.sajda && (
                  <span className="sajda-marker" title={`Sajda ${ayah.sajda.obligatory ? '(Obligatory)' : '(Recommended)'}`}>
                    🕌
                  </span>
                )}
              </div>
              <div className="ayah-meta">
                <span className="meta-item" title="Juz (Para)">Juz {ayah.juz}</span>
                <span className="meta-item" title="Page">Page {ayah.page}</span>
                <span className="meta-item" title="Ruku">Ruku {ayah.ruku}</span>
              </div>
              <div className="ayah-actions">
                <button 
                  className={`action-btn bookmark-btn ${isBookmarked(surahInfo.number, ayah.numberInSurah) ? 'bookmarked' : ''}`}
                  onClick={() => toggleBookmark(
                    surahInfo.number, 
                    ayah.numberInSurah, 
                    ayah.text, 
                    translationAyahs[index]?.text,
                    surahInfo.englishName
                  )}
                  title={isBookmarked(surahInfo.number, ayah.numberInSurah) ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {isBookmarked(surahInfo.number, ayah.numberInSurah) ? '🔖' : '📑'}
                </button>
                <button 
                  className="action-btn share-action-btn"
                  onClick={() => shareAyah('twitter', translationAyahs[index]?.text, surahInfo.englishName, `${surahInfo.number}:${ayah.numberInSurah}`)}
                  title="Share on Twitter"
                >
                  𝕏
                </button>
                <button 
                  className="action-btn share-action-btn"
                  onClick={() => shareAyah('whatsapp', translationAyahs[index]?.text, surahInfo.englishName, `${surahInfo.number}:${ayah.numberInSurah}`)}
                  title="Share on WhatsApp"
                >
                  💬
                </button>
                <button 
                  className="action-btn share-action-btn"
                  onClick={() => shareAyah('copy', translationAyahs[index]?.text, surahInfo.englishName, `${surahInfo.number}:${ayah.numberInSurah}`)}
                  title="Copy"
                >
                  📋
                </button>
                {audioAyahs[index]?.audio && (
                  <button 
                    className={`action-btn play-btn ${playingAyah === ayah.numberInSurah ? 'playing' : ''}`}
                    onClick={() => playAudio(ayah.numberInSurah, audioAyahs[index].audio)}
                  >
                    {playingAyah === ayah.numberInSurah ? '⏸' : '▶'}
                  </button>
                )}
              </div>
            </div>
            {ayah.sajda && (
              <div className="sajda-notice">
                <span className="sajda-icon">🕌</span>
                <span>Sajda {ayah.sajda.obligatory ? '(Obligatory Prostration)' : '(Recommended Prostration)'}</span>
              </div>
            )}
            
            {wordByWordMode ? (
              <div className="ayah-word-by-word">
                {wbwLoading[ayah.numberInSurah] ? (
                  <div className="wbw-loading">Loading word-by-word...</div>
                ) : wordByWordData[ayah.numberInSurah] ? (
                  <WordByWord 
                    words={wordByWordData[ayah.numberInSurah]} 
                    selectedFont={selectedFont}
                    fontSize={fontSize}
                  />
                ) : (
                  <div 
                    className="wbw-loading"
                    onClick={() => fetchWordByWord(ayah.numberInSurah)}
                    onTouchStart={() => fetchWordByWord(ayah.numberInSurah)}
                  >
                    Tap to load word-by-word...
                  </div>
                )}
              </div>
            ) : (
              <p className="ayah-arabic" style={{ fontSize: `${fontSize / 16}rem`, fontFamily: getFontFamily() }}>{ayah.text}</p>
            )}
            <p className="ayah-translation">{translationAyahs[index]?.text}</p>
            
            <div className="ayah-footer">
              <button 
                className={`tafsir-toggle ${openTafsir === ayah.numberInSurah ? 'active' : ''}`}
                onClick={() => toggleTafsir(ayah.numberInSurah)}
              >
                {openTafsir === ayah.numberInSurah ? 'Hide Tafsir' : 'Show Tafsir'}
              </button>
            </div>
            
            {openTafsir === ayah.numberInSurah && (
              <div className="tafsir-content">
                <div className="tafsir-header">
                  <span className="tafsir-title">{getCurrentTafsirName()}</span>
                </div>
                {tafsirLoading ? (
                  <p>Loading tafsir...</p>
                ) : (
                  <p className="tafsir-text">{tafsirData[ayah.numberInSurah]}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="surah-navigation">
        {parseInt(number) > 1 && (
          <Link to={`/surah/${parseInt(number) - 1}`} className="nav-btn prev">
            ← Previous Surah
          </Link>
        )}
        {parseInt(number) < 114 && (
          <Link to={`/surah/${parseInt(number) + 1}`} className="nav-btn next">
            Next Surah →
          </Link>
        )}
      </div>
    </div>
  );
}

export default Surah;
