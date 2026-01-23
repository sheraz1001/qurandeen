import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import { getCacheStats, getCacheSizeEstimate, clearAllCache, clearStore, STORES } from '../services/cacheService';
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
    { id: 'uthmani', name: 'Uthmani (KFGQPC)', arabic: 'العثماني', desc: 'Classic Uthmanic script' },
    { id: 'indopak', name: 'IndoPak (PDMS Saleem)', arabic: 'ہندوپاک', desc: 'Professional Pakistani style' },
    { id: 'nastaliq', name: 'Nastaliq (Tarteel)', arabic: 'نستعلیق', desc: 'Beautiful calligraphic style' },
    { id: 'naskh', name: 'Naskh Nastaleeq', arabic: 'نسخ نستعلیق', desc: 'Quran.com IndoPak style' },
    { id: 'mequran', name: 'Me Quran', arabic: 'قرآن', desc: 'Modern IndoPak font' },
    { id: 'simple', name: 'Simple (Amiri)', arabic: 'بسيط', desc: 'Clean readable style' }
  ];

  const [translations, setTranslations] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [tafsirs, setTafsirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appearance');
  const [cacheStats, setCacheStats] = useState({});
  const [cacheSize, setCacheSize] = useState(null);
  const [clearingCache, setClearingCache] = useState(false);

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
    loadCacheStats();
  }, []);

  const loadCacheStats = async () => {
    const stats = await getCacheStats();
    const size = await getCacheSizeEstimate();
    setCacheStats(stats);
    setCacheSize(size);
  };

  const handleClearAllCache = async () => {
    if (!confirm('This will clear all cached data. You will need internet to reload content. Continue?')) return;
    setClearingCache(true);
    await clearAllCache();
    await loadCacheStats();
    setClearingCache(false);
  };

  const handleClearStore = async (storeName, displayName) => {
    if (!confirm(`Clear all cached ${displayName}?`)) return;
    setClearingCache(true);
    await clearStore(storeName);
    await loadCacheStats();
    setClearingCache(false);
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

  const currentReciter = reciters.find(r => r.identifier === selectedReciter);
  const currentTranslation = translations.find(t => t.identifier === selectedTranslation);
  const currentTafsir = tafsirs.find(t => t.identifier === selectedTafsir);

  if (loading) return <Loading />;

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'audio', label: 'Audio', icon: '🎧' },
    { id: 'text', label: 'Text', icon: '📖' },
    { id: 'storage', label: 'Storage', icon: '💾' },
  ];

  const cacheStoreInfo = [
    { store: STORES.QURAN_TEXT, name: 'Quran Text', key: 'QURAN_TEXT', icon: '📖' },
    { store: STORES.TRANSLATIONS, name: 'Translations', key: 'TRANSLATIONS', icon: '🌐' },
    { store: STORES.WORD_BY_WORD, name: 'Word-by-Word', key: 'WORD_BY_WORD', icon: '📝' },
    { store: STORES.HADITH_COLLECTIONS, name: 'Hadith Collections', key: 'HADITH_COLLECTIONS', icon: '📚' },
    { store: STORES.HADITH_CHAPTERS, name: 'Hadith Chapters', key: 'HADITH_CHAPTERS', icon: '📑' },
    { store: STORES.TAFSIR, name: 'Tafsir', key: 'TAFSIR', icon: '📜' },
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
                        fontFamily: font.id === 'indopak' ? "'PDMS Saleem', 'Al Majeed Quranic', serif" : 
                                   font.id === 'uthmani' ? "'KFGQPC Uthmani', serif" :
                                   font.id === 'nastaliq' ? "'IndoPak Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Amiri', serif" 
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
                {selectedScript === 'quran-tajweed' && (
                  <div className="tajweed-legend">
                    <h4 className="legend-title">Tajweed Color Guide</h4>
                    <div className="legend-grid">
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#3B82F6'}}></span>
                        <span className="legend-label">Ghunnah (nasal sound)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#F97316'}}></span>
                        <span className="legend-label">Ikhfa (concealment)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#A855F7'}}></span>
                        <span className="legend-label">Qalqalah (echoing)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#EF4444'}}></span>
                        <span className="legend-label">Madd (prolongation)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#14B8A6'}}></span>
                        <span className="legend-label">Idgham (merging)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#EAB308'}}></span>
                        <span className="legend-label">Iqlab (conversion)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#22C55E'}}></span>
                        <span className="legend-label">Lam Shamsiyyah (assimilation)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#9CA3AF'}}></span>
                        <span className="legend-label">Silent letters</span>
                      </div>
                    </div>
                  </div>
                )}
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
                {['urdu', 'arabic', 'english', 'bengali'].map(lang => {
                  const langTafsirs = tafsirs.filter(t => t.language?.toLowerCase() === lang);
                  if (langTafsirs.length === 0) return null;
                  return (
                    <div key={lang} className="tafsir-language-group">
                      <h4 className="tafsir-language-title">{lang.charAt(0).toUpperCase() + lang.slice(1)} ({langTafsirs.length})</h4>
                      <div className="tafsir-grid">
                        {langTafsirs.map((tafsir) => (
                          <button
                            key={tafsir.identifier}
                            className={`tafsir-btn ${selectedTafsir === tafsir.identifier ? 'active' : ''}`}
                            onClick={() => setSelectedTafsir(tafsir.identifier)}
                          >
                            <div className="tafsir-info">
                              <span className="tafsir-name">{tafsir.englishName}</span>
                              <span className="tafsir-author">{tafsir.author}</span>
                            </div>
                            {selectedTafsir === tafsir.identifier && <span className="check-icon">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <p className="tafsir-note">
                  Choose your preferred tafsir language and scholar
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="settings-panel">
            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">💾</span>
                <h3>Offline Cache</h3>
              </div>
              <div className="card-content">
                <p className="cache-description">
                  Content you view is automatically cached for faster loading and offline access. 
                  Cached data loads instantly on repeat visits without needing internet.
                </p>
                
                {cacheSize && (
                  <div className="cache-usage">
                    <div className="usage-bar">
                      <div 
                        className="usage-fill" 
                        style={{ width: `${Math.min(parseFloat(cacheSize.percentUsed), 100)}%` }}
                      />
                    </div>
                    <div className="usage-text">
                      <span>{cacheSize.usageFormatted} used</span>
                      <span>of {cacheSize.quotaFormatted}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <span className="card-icon">📊</span>
                <h3>Cached Content</h3>
              </div>
              <div className="card-content">
                <div className="cache-stores-list">
                  {cacheStoreInfo.map(info => (
                    <div key={info.key} className="cache-store-item">
                      <div className="store-info">
                        <span className="store-icon">{info.icon}</span>
                        <span className="store-name">{info.name}</span>
                        <span className="store-count">{cacheStats[info.key] || 0} items</span>
                      </div>
                      <button 
                        className="clear-store-btn"
                        onClick={() => handleClearStore(info.store, info.name)}
                        disabled={clearingCache || !cacheStats[info.key]}
                      >
                        Clear
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="settings-card danger-zone">
              <div className="card-header">
                <span className="card-icon">⚠️</span>
                <h3>Clear All Cache</h3>
              </div>
              <div className="card-content">
                <p className="danger-text">
                  This will remove all cached Quran text, translations, hadiths, and other content. 
                  You will need an internet connection to reload content after clearing.
                </p>
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAllCache}
                  disabled={clearingCache}
                >
                  {clearingCache ? 'Clearing...' : 'Clear All Cached Data'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
