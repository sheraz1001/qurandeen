import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '../../styles/tools.css';

const SOCIAL_SIZES = [
  { id: 'instagram-square', name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'instagram-story', name: 'Instagram/WhatsApp Story', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'facebook', name: 'Facebook Post', width: 1200, height: 630, ratio: '1.91:1' },
  { id: 'twitter', name: 'Twitter/X Post', width: 1200, height: 675, ratio: '16:9' },
  { id: 'pinterest', name: 'Pinterest Pin', width: 1000, height: 1500, ratio: '2:3' },
  { id: 'youtube', name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9' },
];

const ARABIC_FONTS = [
  { id: 'uthmani', name: 'Uthmani', family: "'KFGQPC Uthmani Script HAFS', 'Amiri', serif" },
  { id: 'naskh', name: 'Naskh', family: "'Amiri', 'Scheherazade New', serif" },
  { id: 'nastaliq', name: 'Nastaliq (IndoPak)', family: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" },
  { id: 'modern', name: 'Modern', family: "'Noto Naskh Arabic', 'Droid Arabic Naskh', sans-serif" },
];

const TRANSLATIONS = [
  { id: 'en.asad', name: 'English - Muhammad Asad' },
  { id: 'en.pickthall', name: 'English - Pickthall' },
  { id: 'en.yusufali', name: 'English - Yusuf Ali' },
  { id: 'en.sahih', name: 'English - Sahih International' },
  { id: 'ur.jalandhry', name: 'Urdu - Jalandhry' },
  { id: 'ur.ahmedali', name: 'Urdu - Ahmed Ali' },
  { id: 'ar.muyassar', name: 'Arabic - Tafsir Muyassar' },
  { id: 'fr.hamidullah', name: 'French - Hamidullah' },
  { id: 'de.bubenheim', name: 'German - Bubenheim' },
  { id: 'es.cortes', name: 'Spanish - Cortes' },
  { id: 'tr.diyanet', name: 'Turkish - Diyanet' },
  { id: 'id.indonesian', name: 'Indonesian' },
  { id: 'bn.bengali', name: 'Bengali' },
  { id: 'ru.kuliev', name: 'Russian - Kuliev' },
  { id: 'zh.majian', name: 'Chinese - Ma Jian' },
];

const BACKGROUNDS = [
  { id: 'green', name: 'Emerald', gradient: 'linear-gradient(135deg, #2ea043 0%, #1a5c3a 100%)' },
  { id: 'blue', name: 'Ocean', gradient: 'linear-gradient(135deg, #0969da 0%, #1f6feb 100%)' },
  { id: 'purple', name: 'Royal', gradient: 'linear-gradient(135deg, #8250df 0%, #a371f7 100%)' },
  { id: 'gold', name: 'Golden', gradient: 'linear-gradient(135deg, #bf8700 0%, #d4a72c 100%)' },
  { id: 'teal', name: 'Teal', gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' },
  { id: 'rose', name: 'Rose', gradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)' },
  { id: 'dark', name: 'Dark', gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' },
  { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
];

function ShareCardGenerator() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [verseData, setVerseData] = useState(null);
  const [background, setBackground] = useState('green');
  const [selectedSize, setSelectedSize] = useState('instagram-square');
  const [selectedFont, setSelectedFont] = useState('uthmani');
  const [selectedTranslation, setSelectedTranslation] = useState('en.asad');
  const [fontSize, setFontSize] = useState(28);
  const [showLogo, setShowLogo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

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
    }
  }, [selectedSurah, surahs]);

  useEffect(() => {
    if (selectedSurah && selectedAyah) {
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
  }, [selectedSurah, selectedAyah, selectedTranslation]);

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
      link.download = `quran-verse-${verseData?.surahNumber}-${verseData?.ayahNumber}-${selectedSize}.png`;
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
      pdf.save(`quran-verse-${verseData?.surahNumber}-${verseData?.ayahNumber}.pdf`);
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

  return (
    <div className="tools-page">
      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Tools
        </Link>
        <h1>Quran Share Card Generator</h1>
        <p>Create beautiful, customizable verse cards for social media</p>
      </div>

      <div className="tool-content">
        <div className="card-generator-advanced">
          <div className="generator-grid">
            <div className="generator-controls">
              <div className="control-section">
                <h3>Select Verse</h3>
                <div className="control-row">
                  <select 
                    value={selectedSurah} 
                    onChange={(e) => setSelectedSurah(Number(e.target.value))}
                  >
                    {surahs.map(surah => (
                      <option key={surah.number} value={surah.number}>
                        {surah.number}. {surah.englishName}
                      </option>
                    ))}
                  </select>
                  <select 
                    value={selectedAyah} 
                    onChange={(e) => setSelectedAyah(Number(e.target.value))}
                  >
                    {ayahs.map(num => (
                      <option key={num} value={num}>Ayah {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="control-section">
                <h3>Card Size</h3>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="full-width"
                >
                  {SOCIAL_SIZES.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.name} ({size.ratio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-section">
                <h3>Translation</h3>
                <select 
                  value={selectedTranslation} 
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                  className="full-width"
                >
                  {TRANSLATIONS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-section">
                <h3>Arabic Font</h3>
                <select 
                  value={selectedFont} 
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="full-width"
                >
                  {ARABIC_FONTS.map(font => (
                    <option key={font.id} value={font.id}>{font.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-section">
                <h3>Font Size: {fontSize}px</h3>
                <input 
                  type="range" 
                  min="18" 
                  max="48" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="font-slider"
                />
              </div>

              <div className="control-section">
                <h3>Background</h3>
                <div className="bg-options-grid">
                  {BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      className={`bg-option-btn ${background === bg.id ? 'active' : ''}`}
                      style={{ background: bg.gradient }}
                      onClick={() => setBackground(bg.id)}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              <div className="control-section">
                <label className="toggle-option">
                  <input 
                    type="checkbox" 
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                  />
                  <span>Show QuranDeen Logo</span>
                </label>
              </div>
            </div>

            <div className="generator-preview">
              <div 
                ref={cardRef}
                className="card-canvas"
                style={getPreviewStyle()}
              >
                <div className="card-inner-content">
                  {loading ? (
                    <div className="card-loading">Loading verse...</div>
                  ) : verseData ? (
                    <>
                      <div className="card-decorative-top">
                        <span className="decorative-line"></span>
                        <span className="decorative-icon">✦</span>
                        <span className="decorative-line"></span>
                      </div>
                      <div 
                        className="card-arabic"
                        style={{ 
                          fontFamily: getCurrentFont().family,
                          fontSize: `${calculateDynamicFontSize(verseData.arabic, fontSize, true)}px`
                        }}
                      >
                        {verseData.arabic}
                      </div>
                      <div className="card-divider">
                        <span className="divider-ornament">❋</span>
                      </div>
                      <div 
                        className="card-translation"
                        style={{ 
                          fontSize: `${calculateDynamicFontSize(verseData.translation, 14, false)}px`
                        }}
                      >
                        "{verseData.translation}"
                      </div>
                      <div className="card-reference">
                        <span className="ref-surah">{verseData.surahName}</span>
                        <span className="ref-ayah">{verseData.surahNumber}:{verseData.ayahNumber}</span>
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
                  ) : (
                    <div className="card-placeholder">Select a verse to preview</div>
                  )}
                </div>
              </div>

              <div className="download-actions">
                <button 
                  className="download-btn primary"
                  onClick={downloadAsImage}
                  disabled={downloading || !verseData}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  {downloading ? 'Processing...' : 'Download PNG'}
                </button>
                <button 
                  className="download-btn secondary"
                  onClick={downloadAsPDF}
                  disabled={downloading || !verseData}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Download PDF
                </button>
              </div>

              <div className="share-actions">
                <button className="share-btn twitter" onClick={shareOnTwitter}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Share on X
                </button>
                <button className="share-btn whatsapp" onClick={shareOnWhatsApp}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button className="share-btn copy" onClick={copyToClipboard}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareCardGenerator;
