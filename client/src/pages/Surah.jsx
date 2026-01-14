import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Surah({ fontSize, selectedTranslation, setSelectedTranslation, selectedReciter, selectedScript }) {
  const { number } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [translationsLoading, setTranslationsLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchTranslations();
  }, []);

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

  const fetchSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/surah/${number}?translation=${selectedTranslation}`);
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

      {surahInfo.number !== 1 && surahInfo.number !== 9 && (
        <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      )}

      <div className="ayahs-list">
        {ayahs.map((ayah, index) => (
          <div key={ayah.numberInSurah} className="ayah-card">
            <div className="ayah-header">
              <span className="ayah-number">{ayah.numberInSurah}</span>
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
            <p className="ayah-arabic" style={{ fontSize: `${fontSize / 16}rem` }}>{ayah.text}</p>
            <p className="ayah-translation">{translationAyahs[index]?.text}</p>
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
