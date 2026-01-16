import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function ShareCardGenerator() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [verseData, setVerseData] = useState(null);
  const [background, setBackground] = useState('green');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

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
      fetch(`/api/surah/${selectedSurah}`)
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
              ayahNumber: selectedAyah
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedSurah, selectedAyah]);

  const backgrounds = [
    { id: 'green', class: 'bg-gradient-green' },
    { id: 'blue', class: 'bg-gradient-blue' },
    { id: 'purple', class: 'bg-gradient-purple' },
    { id: 'gold', class: 'bg-gradient-gold' },
    { id: 'islamic', class: 'bg-pattern-islamic' }
  ];

  const getShareText = () => {
    if (!verseData) return '';
    return `"${verseData.arabic}"\n\n"${verseData.translation}"\n\n— Surah ${verseData.surahName} (${verseData.surahNumber}:${verseData.ayahNumber})\n\nvia QuranDeen.com`;
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
        <p>Create beautiful verse cards to share on social media</p>
      </div>

      <div className="tool-content">
        <div className="share-card-generator">
          <div className="verse-selector">
            <select 
              value={selectedSurah} 
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
            >
              {surahs.map(surah => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.englishName} ({surah.name})
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

          <div 
            ref={cardRef}
            className={`card-preview ${backgrounds.find(b => b.id === background)?.class}`}
          >
            {loading ? (
              <p>Loading verse...</p>
            ) : verseData ? (
              <>
                <div className="arabic-text">{verseData.arabic}</div>
                <div className="translation-text">"{verseData.translation}"</div>
                <div className="verse-reference">
                  Surah {verseData.surahName} ({verseData.surahNumber}:{verseData.ayahNumber})
                </div>
              </>
            ) : (
              <p>Select a verse to preview</p>
            )}
          </div>

          <div className="background-options">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                className={`bg-option ${bg.id} ${background === bg.id ? 'active' : ''}`}
                onClick={() => setBackground(bg.id)}
                title={bg.id.charAt(0).toUpperCase() + bg.id.slice(1)}
              />
            ))}
          </div>

          <div className="share-buttons">
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
  );
}

export default ShareCardGenerator;
