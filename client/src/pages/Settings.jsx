import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import '../styles/settings.css';

function Settings({ 
  darkMode, 
  toggleDarkMode, 
  fontSize, 
  setFontSize,
  selectedTranslation,
  setSelectedTranslation,
  selectedReciter,
  setSelectedReciter,
  selectedScript,
  setSelectedScript
}) {
  const [translations, setTranslations] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [translationsRes, recitersRes, scriptsRes] = await Promise.all([
          axios.get('/api/translations'),
          axios.get('/api/reciters'),
          axios.get('/api/scripts')
        ]);
        setTranslations(translationsRes.data.data || []);
        setReciters(recitersRes.data.data || []);
        setScripts(scriptsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const arabicReciters = reciters.filter(r => r.language === 'ar');
  const otherReciters = reciters.filter(r => r.language !== 'ar');

  const currentReciter = reciters.find(r => r.identifier === selectedReciter);
  const currentTranslation = translations.find(t => t.identifier === selectedTranslation);
  const currentScript = scripts.find(s => s.identifier === selectedScript);

  if (loading) return <Loading />;

  return (
    <div className="settings-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2>Appearance</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Dark Mode</span>
            <span className="setting-description">Toggle between light and dark themes</span>
          </div>
          <button 
            className={`toggle-btn ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
          >
            <span className="toggle-slider"></span>
          </button>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Arabic Font Size</span>
            <span className="setting-description">Adjust the size of Arabic text</span>
          </div>
          <div className="font-size-control">
            <button 
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              disabled={fontSize <= 16}
            >
              −
            </button>
            <span className="font-size-value">{fontSize}px</span>
            <button 
              onClick={() => setFontSize(Math.min(48, fontSize + 2))}
              disabled={fontSize >= 48}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Arabic Script Style</h2>
        <div className="setting-item script-selector">
          <div className="script-options">
            {scripts.map((script) => (
              <button
                key={script.identifier}
                className={`script-btn ${selectedScript === script.identifier ? 'active' : ''}`}
                onClick={() => setSelectedScript(script.identifier)}
              >
                <span className="script-name">{script.englishName}</span>
                <span className="script-arabic">{script.name}</span>
              </button>
            ))}
          </div>
        </div>
        {currentScript && (
          <p className="setting-note">{currentScript.description}</p>
        )}
      </div>

      <div className="settings-section">
        <h2>Reciter</h2>
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Selected Reciter</span>
            <span className="setting-description">
              {currentReciter ? currentReciter.englishName : 'Choose a reciter'}
            </span>
          </div>
        </div>
        
        <div className="reciters-list">
          <h3>Arabic Reciters ({arabicReciters.length})</h3>
          <div className="reciter-grid">
            {arabicReciters.map((reciter) => (
              <button
                key={reciter.identifier}
                className={`reciter-btn ${selectedReciter === reciter.identifier ? 'active' : ''}`}
                onClick={() => setSelectedReciter(reciter.identifier)}
              >
                <span className="reciter-name">{reciter.englishName}</span>
                <span className="reciter-arabic">{reciter.name}</span>
              </button>
            ))}
          </div>
          
          {otherReciters.length > 0 && (
            <>
              <h3>Other Languages ({otherReciters.length})</h3>
              <div className="reciter-grid">
                {otherReciters.map((reciter) => (
                  <button
                    key={reciter.identifier}
                    className={`reciter-btn ${selectedReciter === reciter.identifier ? 'active' : ''}`}
                    onClick={() => setSelectedReciter(reciter.identifier)}
                  >
                    <span className="reciter-name">{reciter.englishName}</span>
                    <span className="reciter-lang">{getLanguageName(reciter.language)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h2>Translation</h2>
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Selected Translation</span>
            <span className="setting-description">
              {currentTranslation ? `${currentTranslation.englishName} (${getLanguageName(currentTranslation.language)})` : 'Choose a translation'}
            </span>
          </div>
        </div>
        
        <div className="translation-selector-settings">
          <select 
            value={selectedTranslation}
            onChange={(e) => setSelectedTranslation(e.target.value)}
            className="translation-dropdown"
          >
            {Object.entries(groupedTranslations)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([language, editions]) => (
                <optgroup key={language} label={language}>
                  {editions.map((edition) => (
                    <option key={edition.identifier} value={edition.identifier}>
                      {edition.englishName}
                    </option>
                  ))}
                </optgroup>
              ))}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Preview</h2>
        <div className="preview-box">
          <p className="preview-arabic" style={{ fontSize: `${fontSize}px` }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="preview-translation">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
