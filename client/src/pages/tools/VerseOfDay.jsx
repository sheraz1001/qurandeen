import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function VerseOfDay() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVerseOfDay = async () => {
      try {
        const cached = localStorage.getItem('verseOfDay');
        const cachedDate = localStorage.getItem('verseOfDayDate');
        const today = new Date().toDateString();

        if (cached && cachedDate === today) {
          setVerse(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await fetch('/api/random-ayah');
        const result = await response.json();
        const data = result.data;
        
        const verseData = {
          arabic: data.arabic,
          translation: data.english,
          surahName: data.surah?.englishName || 'Unknown',
          surahNameArabic: data.surah?.name || '',
          surahNumber: data.surah?.number,
          ayahNumber: data.numberInSurah,
          revelationType: data.surah?.revelationType || 'Meccan',
          juz: data.juz || 1,
          page: data.page || 1
        };

        localStorage.setItem('verseOfDay', JSON.stringify(verseData));
        localStorage.setItem('verseOfDayDate', today);
        setVerse(verseData);
      } catch (error) {
        console.error('Error fetching verse:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerseOfDay();
  }, []);

  const getReflection = () => {
    const reflections = [
      "Take a moment to contemplate this verse and how it applies to your daily life.",
      "Reflect on the wisdom in these words and how they guide us towards righteousness.",
      "Consider how this divine message can inspire positive change in your actions today.",
      "Meditate on the meaning and let it strengthen your connection with Allah.",
      "Think about how you can implement the teachings of this verse in your life."
    ];
    const index = new Date().getDate() % reflections.length;
    return reflections[index];
  };

  const getFullShareText = () => {
    if (!verse) return '';
    return `Quran Verse of the Day\n\n${verse.arabic}\n\n"${verse.translation}"\n\n📖 Surah ${verse.surahName} (${verse.surahNameArabic})\n📍 Ayah ${verse.ayahNumber} of Surah ${verse.surahNumber}\n📚 Juz ${verse.juz} | ${verse.revelationType}\n\n🌐 QuranDeen.com`;
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getFullShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getFullShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getFullShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getNewVerse = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/random-ayah');
      const result = await response.json();
      const data = result.data;
      
      const verseData = {
        arabic: data.arabic,
        translation: data.english,
        surahName: data.surah?.englishName || 'Unknown',
        surahNameArabic: data.surah?.name || '',
        surahNumber: data.surah?.number,
        ayahNumber: data.numberInSurah,
        revelationType: data.surah?.revelationType || 'Meccan',
        juz: data.juz || 1,
        page: data.page || 1
      };

      setVerse(verseData);
    } catch (error) {
      console.error('Error fetching verse:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="tools-page">
      <div className="tool-page-header">
        <Link to="/islamic-resources" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Resources
        </Link>
        <h1>Quran Verse of the Day</h1>
        <p>Start your day with divine guidance from the Holy Quran</p>
      </div>

      <div className="tool-content">
        {loading ? (
          <div className="votd-container">
            <div className="votd-content" style={{ textAlign: 'center', padding: '4rem' }}>
              <p>Loading today's verse...</p>
            </div>
          </div>
        ) : verse ? (
          <div className="votd-container">
            <div className="votd-header">
              <div className="votd-date">{today}</div>
              <div className="votd-title">Verse of the Day</div>
            </div>

            <div className="votd-content">
              <div className="votd-arabic">{verse.arabic}</div>
              <div className="votd-translation">"{verse.translation}"</div>
              
              <div className="votd-reference">
                <span>
                  Surah {verse.surahName} ({verse.surahNumber}:{verse.ayahNumber}) | Juz {verse.juz}
                </span>
              </div>

              <div className="votd-reflection">
                <h3>Daily Reflection</h3>
                <p>{getReflection()}</p>
              </div>

              <div className="votd-actions">
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
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="share-btn download" onClick={getNewVerse}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  New Verse
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Unable to load verse. Please try again.</p>
        )}
      </div>
    </div>
  );
}

export default VerseOfDay;
