import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '../../styles/share-card.css';

const SOCIAL_SIZES = [
  { id: 'instagram-square', name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1', icon: '📸' },
  { id: 'instagram-story', name: 'Instagram/WhatsApp Story', width: 1080, height: 1920, ratio: '9:16', icon: '📱' },
  { id: 'facebook', name: 'Facebook Post', width: 1200, height: 630, ratio: '1.91:1', icon: '👤' },
  { id: 'twitter', name: 'Twitter/X Post', width: 1200, height: 675, ratio: '16:9', icon: '🐦' },
  { id: 'pinterest', name: 'Pinterest Pin', width: 1000, height: 1500, ratio: '2:3', icon: '📌' },
  { id: 'youtube', name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9', icon: '▶️' },
  { id: 'desktop', name: 'Desktop Wallpaper', width: 1920, height: 1080, ratio: '16:9', icon: '🖥️' },
  { id: 'mobile', name: 'Mobile Wallpaper', width: 1080, height: 2340, ratio: '9:19.5', icon: '📲' },
];

const ARABIC_FONTS = [
  { id: 'uthmani', name: 'Uthmani', family: "'KFGQPC Uthmani Script HAFS', 'Amiri', serif", desc: 'Traditional Quran script' },
  { id: 'naskh', name: 'Naskh', family: "'Amiri', 'Scheherazade New', serif", desc: 'Classic Arabic style' },
  { id: 'nastaliq', name: 'Nastaliq', family: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", desc: 'IndoPak style' },
  { id: 'modern', name: 'Modern', family: "'Noto Naskh Arabic', 'Droid Arabic Naskh', sans-serif", desc: 'Clean & readable' },
];

const TRANSLATIONS = [
  { id: 'en.asad', name: 'Muhammad Asad', lang: 'English' },
  { id: 'en.pickthall', name: 'Pickthall', lang: 'English' },
  { id: 'en.yusufali', name: 'Yusuf Ali', lang: 'English' },
  { id: 'en.sahih', name: 'Sahih International', lang: 'English' },
  { id: 'ur.jalandhry', name: 'Jalandhry', lang: 'Urdu' },
  { id: 'ur.ahmedali', name: 'Ahmed Ali', lang: 'Urdu' },
  { id: 'ar.muyassar', name: 'Tafsir Muyassar', lang: 'Arabic' },
  { id: 'fr.hamidullah', name: 'Hamidullah', lang: 'French' },
  { id: 'de.bubenheim', name: 'Bubenheim', lang: 'German' },
  { id: 'es.cortes', name: 'Cortes', lang: 'Spanish' },
  { id: 'tr.diyanet', name: 'Diyanet', lang: 'Turkish' },
  { id: 'id.indonesian', name: 'Indonesian', lang: 'Indonesian' },
  { id: 'bn.bengali', name: 'Bengali', lang: 'Bengali' },
  { id: 'ru.kuliev', name: 'Kuliev', lang: 'Russian' },
  { id: 'zh.majian', name: 'Ma Jian', lang: 'Chinese' },
];

const BACKGROUNDS = [
  { id: 'emerald', name: 'Emerald', gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #059669 100%)', category: 'nature' },
  { id: 'ocean', name: 'Ocean Deep', gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0369a1 100%)', category: 'nature' },
  { id: 'royal', name: 'Royal Purple', gradient: 'linear-gradient(135deg, #581c87 0%, #9333ea 50%, #7c3aed 100%)', category: 'elegant' },
  { id: 'golden', name: 'Golden Hour', gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #f59e0b 100%)', category: 'warm' },
  { id: 'rose', name: 'Rose Garden', gradient: 'linear-gradient(135deg, #881337 0%, #e11d48 50%, #f43f5e 100%)', category: 'warm' },
  { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', category: 'dark' },
  { id: 'charcoal', name: 'Charcoal', gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)', category: 'dark' },
  { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)', category: 'warm' },
  { id: 'teal', name: 'Teal Mist', gradient: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 50%, #2dd4bf 100%)', category: 'nature' },
  { id: 'islamic', name: 'Islamic Green', gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 50%, #4ade80 100%)', category: 'nature' },
  { id: 'ramadan', name: 'Ramadan Night', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)', category: 'elegant' },
  { id: 'desert', name: 'Desert Sand', gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)', category: 'warm' },
];

const DECORATIONS = [
  { id: 'minimal', name: 'Minimal', icon: '○' },
  { id: 'classic', name: 'Classic', icon: '❋' },
  { id: 'ornate', name: 'Ornate', icon: '✦' },
  { id: 'geometric', name: 'Geometric', icon: '◇' },
];

function ShareCardGenerator() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(1);
  const [verseData, setVerseData] = useState(null);
  const [background, setBackground] = useState('emerald');
  const [selectedSize, setSelectedSize] = useState('instagram-square');
  const [selectedFont, setSelectedFont] = useState('uthmani');
  const [selectedTranslation, setSelectedTranslation] = useState('en.asad');
  const [fontSize, setFontSize] = useState(28);
  const [showLogo, setShowLogo] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showReference, setShowReference] = useState(true);
  const [decoration, setDecoration] = useState('classic');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [customText, setCustomText] = useState('');
  const [cardMode, setCardMode] = useState('verse');
  const [textAlign, setTextAlign] = useState('center');
  const [padding, setPadding] = useState(40);
  const [opacity, setOpacity] = useState(100);
  const cardRef = useRef(null);

  const stats = {
    totalVerses: 6236,
    totalSurahs: 114,
    translations: TRANSLATIONS.length,
    sizes: SOCIAL_SIZES.length,
    backgrounds: BACKGROUNDS.length
  };

  const calculateDynamicFontSize = (text, baseSize, isArabic = false) => {
    if (!text) return baseSize;
    const length = text.length;
    if (isArabic) {
      if (length > 400) return Math.max(14, baseSize * 0.4);
      if (length > 300) return Math.max(16, baseSize * 0.5);
      if (length > 200) return Math.max(18, baseSize * 0.6);
      if (length > 150) return Math.max(20, baseSize * 0.7);
      if (length > 100) return Math.max(22, baseSize * 0.8);
      if (length > 60) return Math.max(24, baseSize * 0.9);
      return baseSize;
    } else {
      if (length > 400) return Math.max(10, 14 * 0.6);
      if (length > 300) return Math.max(11, 14 * 0.7);
      if (length > 200) return Math.max(12, 14 * 0.8);
      if (length > 100) return Math.max(13, 14 * 0.9);
      return 14;
    }
  };

  useEffect(() => {
    fetch('/api/surahs')
      .then(res => res.json())
      .then(result => {
        const data = result.data || result;
        setSurahs(data);
        if (data[0]) {
          setAyahs(Array.from({ length: data[0].numberOfAyahs }, (_, i) => i + 1));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const surah = surahs.find(s => s.number === selectedSurah);
    if (surah) {
      setAyahs(Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1));
      setSelectedAyah(1);
      setEndAyah(1);
    }
  }, [selectedSurah, surahs]);

  useEffect(() => {
    if (selectedSurah && selectedAyah && cardMode === 'verse') {
      setLoading(true);
      fetch(`/api/surah/${selectedSurah}?translation=${selectedTranslation}`)
        .then(res => res.json())
        .then(result => {
          const arabicData = result.arabic?.data || result.arabic;
          const translationData = result.translation?.data || result.translation;
          const ayahArabic = arabicData?.ayahs?.find(a => a.numberInSurah === selectedAyah);
          const ayahTranslation = translationData?.ayahs?.find(a => a.numberInSurah === selectedAyah);
          if (ayahArabic) {
            setVerseData({
              arabic: ayahArabic.text,
              translation: ayahTranslation?.text || ayahArabic.text,
              surahName: arabicData.englishName,
              surahNameArabic: arabicData.name,
              surahNumber: selectedSurah,
              ayahNumber: selectedAyah,
              juz: ayahArabic.juz,
              page: ayahArabic.page
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedSurah, selectedAyah, selectedTranslation, cardMode]);

  const getCurrentSize = () => SOCIAL_SIZES.find(s => s.id === selectedSize) || SOCIAL_SIZES[0];
  const getCurrentFont = () => ARABIC_FONTS.find(f => f.id === selectedFont) || ARABIC_FONTS[0];
  const getCurrentBg = () => BACKGROUNDS.find(b => b.id === background) || BACKGROUNDS[0];

  const getPreviewStyle = () => {
    const size = getCurrentSize();
    const aspectRatio = size.width / size.height;
    return {
      aspectRatio: `${size.width} / ${size.height}`,
      maxWidth: aspectRatio > 1 ? '100%' : `${Math.min(400 * aspectRatio, 100)}%`,
      background: getCurrentBg().gradient,
      padding: `${padding}px`,
    };
  };

  const getShareText = () => {
    if (!verseData) return '';
    return `"${verseData.arabic}"\n\n"${verseData.translation}"\n\n— Surah ${verseData.surahName} (${verseData.surahNumber}:${verseData.ayahNumber})\n\nvia QuranDeen.com`;
  };

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const size = getCurrentSize();
      const scale = size.width / cardRef.current.offsetWidth;
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `quran-verse-${verseData?.surahNumber || 'custom'}-${verseData?.ayahNumber || 'card'}-${selectedSize}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const size = getCurrentSize();
      const scale = size.width / cardRef.current.offsetWidth;
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [size.width, size.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, size.width, size.height);
      pdf.save(`quran-verse-${verseData?.surahNumber || 'custom'}-${verseData?.ayahNumber || 'card'}.pdf`);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getDecorationElement = () => {
    switch (decoration) {
      case 'minimal': return { top: '—', divider: '•', bottom: '—' };
      case 'classic': return { top: '✦', divider: '❋', bottom: '✦' };
      case 'ornate': return { top: '۞', divider: '﴾ ﴿', bottom: '۞' };
      case 'geometric': return { top: '◇', divider: '◆', bottom: '◇' };
      default: return { top: '✦', divider: '❋', bottom: '✦' };
    }
  };

  const renderCardContent = () => {
    const dec = getDecorationElement();
    if (loading) {
      return <div className="card-loading">Loading verse...</div>;
    }
    if (cardMode === 'verse' && verseData) {
      return (
        <>
          <div className="card-decorative-top">
            <span className="decorative-line"></span>
            <span className="decorative-icon">{dec.top}</span>
            <span className="decorative-line"></span>
          </div>
          <div 
            className="card-arabic"
            style={{ 
              fontFamily: getCurrentFont().family,
              fontSize: `${calculateDynamicFontSize(verseData.arabic, fontSize, true)}px`,
              textAlign: textAlign,
              opacity: opacity / 100
            }}
          >
            {verseData.arabic}
          </div>
          {showTranslation && (
            <>
              <div className="card-divider">
                <span className="divider-ornament">{dec.divider}</span>
              </div>
              <div 
                className="card-translation"
                style={{ 
                  fontSize: `${calculateDynamicFontSize(verseData.translation, 14, false)}px`,
                  textAlign: textAlign,
                  opacity: opacity / 100
                }}
              >
                "{verseData.translation}"
              </div>
            </>
          )}
          {showReference && (
            <div className="card-reference">
              <span className="ref-surah">{verseData.surahName}</span>
              <span className="ref-ayah">{verseData.surahNumber}:{verseData.ayahNumber}</span>
            </div>
          )}
          {showLogo && (
            <div className="card-logo">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              QuranDeen.com
            </div>
          )}
        </>
      );
    } else if (cardMode === 'custom' && customText) {
      return (
        <>
          <div className="card-decorative-top">
            <span className="decorative-line"></span>
            <span className="decorative-icon">{dec.top}</span>
            <span className="decorative-line"></span>
          </div>
          <div 
            className="card-custom-text"
            style={{ 
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              opacity: opacity / 100
            }}
          >
            {customText}
          </div>
          {showLogo && (
            <div className="card-logo">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              QuranDeen.com
            </div>
          )}
        </>
      );
    }
    return <div className="card-placeholder">Select a verse or enter custom text</div>;
  };

  return (
    <div className="share-card-page">
      <Helmet>
        <title>Quran Share Card Generator - Create Beautiful Verse Images | QuranDeen</title>
        <meta name="description" content="Create stunning, shareable Quran verse cards for social media. Multiple sizes for Instagram, Facebook, Twitter, WhatsApp. 15+ translations, custom backgrounds, Arabic fonts." />
      </Helmet>

      <div className="share-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎨</span>
            Creative Tool
          </div>
          <h1>Quran Share Card Generator</h1>
          <p className="hero-subtitle">
            Create beautiful, shareable Quranic verse cards optimized for all social media platforms
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">📐</span>
              <span>{stats.sizes} Sizes</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🌍</span>
              <span>{stats.translations} Translations</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🎨</span>
              <span>{stats.backgrounds} Backgrounds</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">📖</span>
              <span>{stats.totalVerses.toLocaleString()} Verses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="share-container">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${cardMode === 'verse' ? 'active' : ''}`}
            onClick={() => setCardMode('verse')}
          >
            <span>📖</span> Quran Verse
          </button>
          <button 
            className={`mode-btn ${cardMode === 'custom' ? 'active' : ''}`}
            onClick={() => setCardMode('custom')}
          >
            <span>✏️</span> Custom Text
          </button>
        </div>

        <div className="generator-layout">
          <div className="controls-panel">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
                onClick={() => setActiveTab('design')}
              >
                <span>🎨</span> Design
              </button>
              <button 
                className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
              >
                <span>✍️</span> Text
              </button>
              <button 
                className={`tab-btn ${activeTab === 'size' ? 'active' : ''}`}
                onClick={() => setActiveTab('size')}
              >
                <span>📐</span> Size
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'design' && (
                <div className="design-tab">
                  <div className="control-group">
                    <label className="control-label">Background Theme</label>
                    <div className="bg-grid">
                      {BACKGROUNDS.map(bg => (
                        <button
                          key={bg.id}
                          className={`bg-swatch ${background === bg.id ? 'active' : ''}`}
                          style={{ background: bg.gradient }}
                          onClick={() => setBackground(bg.id)}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="control-group">
                    <label className="control-label">Decoration Style</label>
                    <div className="decoration-options">
                      {DECORATIONS.map(dec => (
                        <button
                          key={dec.id}
                          className={`decoration-btn ${decoration === dec.id ? 'active' : ''}`}
                          onClick={() => setDecoration(dec.id)}
                        >
                          <span className="dec-icon">{dec.icon}</span>
                          <span className="dec-name">{dec.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="control-group">
                    <label className="control-label">Padding: {padding}px</label>
                    <input 
                      type="range" 
                      min="20" 
                      max="80" 
                      value={padding}
                      onChange={(e) => setPadding(Number(e.target.value))}
                      className="range-slider"
                    />
                  </div>

                  <div className="control-group">
                    <label className="control-label">Text Opacity: {opacity}%</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="range-slider"
                    />
                  </div>

                  <div className="toggle-group">
                    <label className="toggle-item">
                      <input 
                        type="checkbox" 
                        checked={showTranslation}
                        onChange={(e) => setShowTranslation(e.target.checked)}
                      />
                      <span className="toggle-switch"></span>
                      Show Translation
                    </label>
                    <label className="toggle-item">
                      <input 
                        type="checkbox" 
                        checked={showReference}
                        onChange={(e) => setShowReference(e.target.checked)}
                      />
                      <span className="toggle-switch"></span>
                      Show Reference
                    </label>
                    <label className="toggle-item">
                      <input 
                        type="checkbox" 
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                      />
                      <span className="toggle-switch"></span>
                      Show Branding
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="text-tab">
                  {cardMode === 'verse' ? (
                    <>
                      <div className="control-group">
                        <label className="control-label">Select Surah</label>
                        <select 
                          value={selectedSurah} 
                          onChange={(e) => setSelectedSurah(Number(e.target.value))}
                          className="styled-select"
                        >
                          {surahs.map(surah => (
                            <option key={surah.number} value={surah.number}>
                              {surah.number}. {surah.englishName} ({surah.name})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label className="control-label">Select Ayah</label>
                        <select 
                          value={selectedAyah} 
                          onChange={(e) => setSelectedAyah(Number(e.target.value))}
                          className="styled-select"
                        >
                          {ayahs.map(num => (
                            <option key={num} value={num}>Ayah {num}</option>
                          ))}
                        </select>
                      </div>

                      <div className="control-group">
                        <label className="control-label">Translation</label>
                        <select 
                          value={selectedTranslation} 
                          onChange={(e) => setSelectedTranslation(e.target.value)}
                          className="styled-select"
                        >
                          {TRANSLATIONS.map(t => (
                            <option key={t.id} value={t.id}>{t.lang} - {t.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="control-group">
                      <label className="control-label">Custom Text</label>
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Enter your Islamic quote, dua, or custom text..."
                        className="styled-textarea"
                        rows={6}
                      />
                    </div>
                  )}

                  <div className="control-group">
                    <label className="control-label">Arabic Font Style</label>
                    <div className="font-options">
                      {ARABIC_FONTS.map(font => (
                        <button
                          key={font.id}
                          className={`font-btn ${selectedFont === font.id ? 'active' : ''}`}
                          onClick={() => setSelectedFont(font.id)}
                        >
                          <span className="font-name">{font.name}</span>
                          <span className="font-desc">{font.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="control-group">
                    <label className="control-label">Font Size: {fontSize}px</label>
                    <input 
                      type="range" 
                      min="18" 
                      max="48" 
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="range-slider"
                    />
                  </div>

                  <div className="control-group">
                    <label className="control-label">Text Alignment</label>
                    <div className="align-options">
                      <button 
                        className={`align-btn ${textAlign === 'left' ? 'active' : ''}`}
                        onClick={() => setTextAlign('left')}
                      >Left</button>
                      <button 
                        className={`align-btn ${textAlign === 'center' ? 'active' : ''}`}
                        onClick={() => setTextAlign('center')}
                      >Center</button>
                      <button 
                        className={`align-btn ${textAlign === 'right' ? 'active' : ''}`}
                        onClick={() => setTextAlign('right')}
                      >Right</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'size' && (
                <div className="size-tab">
                  <div className="control-group">
                    <label className="control-label">Card Size / Platform</label>
                    <div className="size-grid">
                      {SOCIAL_SIZES.map(size => (
                        <button
                          key={size.id}
                          className={`size-btn ${selectedSize === size.id ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size.id)}
                        >
                          <span className="size-icon">{size.icon}</span>
                          <span className="size-name">{size.name}</span>
                          <span className="size-ratio">{size.ratio}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="size-info">
                    <div className="info-item">
                      <span className="info-label">Resolution</span>
                      <span className="info-value">{getCurrentSize().width} x {getCurrentSize().height}px</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Aspect Ratio</span>
                      <span className="info-value">{getCurrentSize().ratio}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <span className="preview-size">{getCurrentSize().name}</span>
            </div>

            <div className="preview-container">
              <div 
                ref={cardRef}
                className="card-canvas"
                style={getPreviewStyle()}
              >
                <div className="card-inner-content">
                  {renderCardContent()}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <div className="download-row">
                <button 
                  className="action-btn primary"
                  onClick={downloadAsImage}
                  disabled={downloading || (!verseData && cardMode === 'verse') || (!customText && cardMode === 'custom')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  {downloading ? 'Processing...' : 'Download PNG'}
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={downloadAsPDF}
                  disabled={downloading || (!verseData && cardMode === 'verse') || (!customText && cardMode === 'custom')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  PDF
                </button>
              </div>

              <div className="share-row">
                <button className="share-btn twitter" onClick={shareOnTwitter}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button className="share-btn whatsapp" onClick={shareOnWhatsApp}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button className="share-btn copy" onClick={copyToClipboard}>
                  {copied ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="tips-section">
          <h3>Pro Tips for Better Cards</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">💡</span>
              <h4>Shorter Verses Work Best</h4>
              <p>For Instagram posts, choose ayahs with under 100 characters for better readability.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🎨</span>
              <h4>Contrast Matters</h4>
              <p>Dark backgrounds work great for quotes. Use the opacity slider for subtle effects.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📱</span>
              <h4>Platform-Specific Sizes</h4>
              <p>Use 9:16 ratio for Stories, 1:1 for feed posts, and 16:9 for YouTube thumbnails.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">✨</span>
              <h4>Keep It Simple</h4>
              <p>Minimal decoration often has the most impact. Let the words of Allah speak.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="back-nav">
        <Link to="/islamic-resources" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Islamic Resources
        </Link>
      </div>
    </div>
  );
}

export default ShareCardGenerator;
