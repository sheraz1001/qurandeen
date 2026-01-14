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
  setSelectedScript,
  selectedFont,
  setSelectedFont,
  selectedTafsir,
  setSelectedTafsir
}) {
  const fonts = [
    { id: 'uthmani', name: 'Uthmani', arabic: 'العثماني' },
    { id: 'indopak', name: 'IndoPak', arabic: 'ہندوپاک' },
    { id: 'simple', name: 'Simple', arabic: 'بسيط' }
  ];

  const [translations, setTranslations] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [tafsirs, setTafsirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [translationsRes, recitersRes, scriptsRes, tafsirsRes] = await Promise.all([
          axios.get('/api/translations'),
          axios.get('/api/reciters'),
          axios.get('/api/scripts'),
          axios.get('/api/tafsirs')
        ]);
        setTranslations(translationsRes.data.data || []);
        setReciters(recitersRes.data.data || []);
        setScripts(scriptsRes.data.data || []);
        setTafsirs(tafsirsRes.data.data || []);
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

  const currentReciter = reciters.find(r => r.identifier === selectedReciter);
  const currentTranslation = translations.find(t => t.identifier === selectedTranslation);
  const currentTafsir = tafsirs.find(t => t.identifier === selectedTafsir);

  if (loading) return <Loading />;

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'audio', label: 'Audio', icon: '🎧' },
    { id: 'text', label: 'Text', icon: '📖' },
  ];

  return (
    <div className="settings-page-new">
      <div className="settings-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1 className="settings-title">
          <span className="settings-icon">⚙️</span>
          Settings
        </h1>
        <p className="settings-subtitle">Customize your reading experience</p>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'appearance' && (
          <div className="settings-panel">
            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">🌓</span>
                <h3>Theme</h3>
              </div>
              <div className="card-content">
                <div className="theme-toggle-row">
                  <div className="theme-option">
                    <button 
                      className={`theme-btn ${!darkMode ? 'active' : ''}`}
                      onClick={() => darkMode && toggleDarkMode()}
                    >
                      <span className="theme-emoji">☀️</span>
                      <span>Light</span>
                    </button>
                  </div>
                  <div className="theme-option">
                    <button 
                      className={`theme-btn ${darkMode ? 'active' : ''}`}
                      onClick={() => !darkMode && toggleDarkMode()}
                    >
                      <span className="theme-emoji">🌙</span>
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">🔤</span>
                <h3>Arabic Font Size</h3>
              </div>
              <div className="card-content">
                <div className="font-size-slider">
                  <span className="size-label small">A</span>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="slider"
                  />
                  <span className="size-label large">A</span>
                  <span className="size-value">{fontSize}px</span>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">✨</span>
                <h3>Arabic Font Style</h3>
              </div>
              <div className="card-content">
                <div className="font-style-grid">
                  {fonts.map((font) => (
                    <button
                      key={font.id}
                      className={`font-style-btn ${selectedFont === font.id ? 'active' : ''}`}
                      onClick={() => setSelectedFont(font.id)}
                    >
                      <span className="font-preview" style={{ 
                        fontFamily: font.id === 'indopak' ? "'Al Majeed Quranic', serif" : 
                                   font.id === 'uthmani' ? "'KFGQPC Uthmani', serif" : "'Amiri', serif" 
                      }}>
                        {font.arabic}
                      </span>
                      <span className="font-name">{font.name}</span>
                      {selectedFont === font.id && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-card">
              <div className="preview-label">Preview</div>
              <p className="preview-arabic" style={{ fontSize: `${fontSize}px`, fontFamily: 'var(--arabic-font-family)' }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="preview-translation">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="settings-panel">
            <div className="settings-card full-width">
              <div className="card-header">
                <span className="card-icon">🎙️</span>
                <h3>Select Reciter</h3>
                {currentReciter && (
                  <span className="current-selection">{currentReciter.englishName}</span>
                )}
              </div>
              <div className="card-content">
                <div className="reciter-compact-grid">
                  {reciters.filter(r => r.language === 'ar').map((reciter) => (
                    <button
                      key={reciter.identifier}
                      className={`reciter-compact-btn ${selectedReciter === reciter.identifier ? 'active' : ''}`}
                      onClick={() => setSelectedReciter(reciter.identifier)}
                    >
                      <span className="reciter-initial">{reciter.englishName.charAt(0)}</span>
                      <div className="reciter-info">
                        <span className="reciter-name">{reciter.englishName}</span>
                        <span className="reciter-arabic">{reciter.name}</span>
                      </div>
                      {selectedReciter === reciter.identifier && <span className="check-icon">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="settings-panel">
            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">📜</span>
                <h3>Arabic Script Style</h3>
              </div>
              <div className="card-content">
                <div className="script-compact-grid">
                  {scripts.map((script) => (
                    <button
                      key={script.identifier}
                      className={`script-compact-btn ${selectedScript === script.identifier ? 'active' : ''}`}
                      onClick={() => setSelectedScript(script.identifier)}
                    >
                      <span className="script-name">{script.englishName}</span>
                      {selectedScript === script.identifier && <span className="check-icon">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="settings-card full-width">
              <div className="card-header">
                <span className="card-icon">🌍</span>
                <h3>Translation</h3>
                {currentTranslation && (
                  <span className="current-selection">{currentTranslation.englishName}</span>
                )}
              </div>
              <div className="card-content">
                <select 
                  value={selectedTranslation}
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                  className="translation-select"
                >
                  {Object.entries(groupedTranslations)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([language, editions]) => (
                      <optgroup key={language} label={`${language} (${editions.length})`}>
                        {editions.map((edition) => (
                          <option key={edition.identifier} value={edition.identifier}>
                            {edition.englishName}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                </select>
                <div className="translation-stats">
                  <span className="stat">{Object.keys(groupedTranslations).length} Languages</span>
                  <span className="stat-divider">•</span>
                  <span className="stat">{translations.length} Translations</span>
                </div>
              </div>
            </div>

            <div className="settings-card full-width">
              <div className="card-header">
                <span className="card-icon">📚</span>
                <h3>Tafsir (Commentary)</h3>
                {currentTafsir && (
                  <span className="current-selection">{currentTafsir.englishName}</span>
                )}
              </div>
              <div className="card-content">
                <div className="tafsir-grid">
                  {tafsirs.map((tafsir) => (
                    <button
                      key={tafsir.identifier}
                      className={`tafsir-btn ${selectedTafsir === tafsir.identifier ? 'active' : ''}`}
                      onClick={() => setSelectedTafsir(tafsir.identifier)}
                    >
                      <div className="tafsir-info">
                        <span className="tafsir-name">{tafsir.englishName}</span>
                        <span className="tafsir-arabic">{tafsir.name}</span>
                      </div>
                      {selectedTafsir === tafsir.identifier && <span className="check-icon">✓</span>}
                    </button>
                  ))}
                </div>
                <p className="tafsir-note">
                  Tafsir provides scholarly commentary and explanation of Quranic verses
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
