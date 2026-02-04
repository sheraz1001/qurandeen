import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import IslamicDateBar from '../components/IslamicDateBar';
import { getSurahByNumber } from '../data/surahData';
import '../styles/home.css';

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyAyah, setDailyAyah] = useState(null);
  const [dailyAyahLoading, setDailyAyahLoading] = useState(true);
  const [readingHistory, setReadingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSurahs();
    fetchDailyAyah();
    loadReadingHistory();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/surahs');
      setSurahs(response.data.data);
    } catch (err) {
      setError('Failed to load surahs. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyAyah = async () => {
    try {
      setDailyAyahLoading(true);
      const today = new Date().toDateString();
      const cached = localStorage.getItem('dailyAyah');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.date === today && parsed.ayah && parsed.ayah.arabic) {
          setDailyAyah(parsed.ayah);
          setDailyAyahLoading(false);
          return;
        }
      }
      localStorage.removeItem('dailyAyah');
      const response = await axios.get('/api/random-ayah');
      const ayah = response.data.data;
      localStorage.setItem('dailyAyah', JSON.stringify({ date: today, ayah }));
      setDailyAyah(ayah);
    } catch (err) {
      console.error('Error fetching daily ayah:', err);
    } finally {
      setDailyAyahLoading(false);
    }
  };

  const loadReadingHistory = () => {
    const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    setReadingHistory(history.slice(0, 5));
  };

  const shareAyah = (platform, ayahData) => {
    const { arabic, english, surahName, verseRef } = ayahData;
    const url = 'https://qurandeen.com';
    const fullShareText = `${arabic}\n\n"${english}"\n\n— ${surahName} (${verseRef})\n\n${url}`;
    const twitterText = `${arabic}\n\n"${english}"\n\n— ${surahName} (${verseRef})`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(fullShareText)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(fullShareText);
      alert('Copied to clipboard!');
    }
  };

  const filteredSurahs = searchQuery
    ? surahs.filter(s => 
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.includes(searchQuery) ||
        s.number.toString() === searchQuery
      )
    : surahs;

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurahs} />;

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "QuranDeen",
      "alternateName": "Quran Deen",
      "url": "https://qurandeen.com",
      "description": "Read, listen, and study the Holy Quran online with translations, tafsir, and audio recitations.",
      "inLanguage": ["en", "ar"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://qurandeen.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "QuranDeen",
      "url": "https://qurandeen.com",
      "logo": "https://qurandeen.com/logo.png"
    }
  ];

  return (
    <div className="home-redesign">
      <SEO 
        title="QuranDeen - Read, Listen & Study the Holy Quran Online"
        description="Read the Holy Quran online with 100+ translations, 150+ audio reciters, Tafsir, word-by-word meaning, and Islamic tools. Access all 114 Surahs with Arabic text and translations."
        canonical="https://qurandeen.com"
        keywords="Quran online, Holy Quran, Quran reading, Quran audio, Quran translation, Quran tafsir, Islamic website"
        schema={homeSchemas}
      />

      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        
        <IslamicDateBar />
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">☪</span>
            <span>The Divine Scripture</span>
          </div>
          <h1 className="hero-title">
            <span className="title-arabic">القرآن الكريم</span>
            <span className="title-english">The Holy Quran</span>
          </h1>
          <p className="hero-description">
            Discover the beauty of Allah's words with our comprehensive platform featuring 
            translations in 40+ languages, 150+ renowned reciters, and powerful study tools.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">114</span>
              <span className="stat-label">Surahs</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">6,236</span>
              <span className="stat-label">Ayahs</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">100+</span>
              <span className="stat-label">Translations</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">150+</span>
              <span className="stat-label">Reciters</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/surah/1-al-fatihah" className="btn-primary">
              <span>Start Reading</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/quran-mp3-audio" className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span>Listen to Quran</span>
            </Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      <section className="quick-access">
        <div className="container">
          <div className="quick-cards">
            <Link to="/quran-juz-browser" className="quick-card">
              <div className="quick-icon">📖</div>
              <div className="quick-info">
                <h3>Browse by Juz</h3>
                <p>Navigate all 30 Juz</p>
              </div>
              <svg className="quick-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
            <Link to="/hadith" className="quick-card">
              <div className="quick-icon">📚</div>
              <div className="quick-info">
                <h3>Hadith Library</h3>
                <p>50,000+ Hadiths</p>
              </div>
              <svg className="quick-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
            <Link to="/azkaar" className="quick-card">
              <div className="quick-icon">🤲</div>
              <div className="quick-info">
                <h3>Daily Azkaar</h3>
                <p>298+ Duas</p>
              </div>
              <svg className="quick-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
            <Link to="/ai-scholar" className="quick-card featured">
              <div className="quick-icon">🤖</div>
              <div className="quick-info">
                <h3>AI Scholar</h3>
                <p>Ask Islamic questions</p>
              </div>
              <svg className="quick-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {dailyAyah && (
        <section className="ayah-of-day">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Daily Inspiration</span>
              <h2>Ayah of the Day</h2>
            </div>
            <div className="ayah-card">
              <div className="ayah-ornament top-left"></div>
              <div className="ayah-ornament top-right"></div>
              <p className="ayah-arabic">{dailyAyah.arabic}</p>
              <div className="ayah-divider">
                <span className="divider-ornament">❖</span>
              </div>
              <p className="ayah-english">"{dailyAyah.english}"</p>
              {dailyAyah.urdu && <p className="ayah-urdu">{dailyAyah.urdu}</p>}
              <div className="ayah-footer">
                <Link 
                  to={`/surah/${getSurahByNumber(dailyAyah.surah.number)?.slug || dailyAyah.surah.number}`}
                  className="ayah-reference"
                >
                  {dailyAyah.surah.englishName} ({dailyAyah.surah.number}:{dailyAyah.numberInSurah})
                </Link>
                <div className="ayah-share">
                  <button 
                    onClick={() => shareAyah('twitter', {
                      arabic: dailyAyah.arabic,
                      english: dailyAyah.english,
                      surahName: dailyAyah.surah.englishName,
                      verseRef: `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`
                    })}
                    title="Share on Twitter"
                    aria-label="Share this verse on Twitter"
                  >𝕏</button>
                  <button 
                    onClick={() => shareAyah('whatsapp', {
                      arabic: dailyAyah.arabic,
                      english: dailyAyah.english,
                      surahName: dailyAyah.surah.englishName,
                      verseRef: `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`
                    })}
                    title="Share on WhatsApp"
                    aria-label="Share this verse on WhatsApp"
                  >💬</button>
                  <button 
                    onClick={() => shareAyah('copy', {
                      arabic: dailyAyah.arabic,
                      english: dailyAyah.english,
                      surahName: dailyAyah.surah.englishName,
                      verseRef: `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`
                    })}
                    title="Copy to clipboard"
                    aria-label="Copy this verse to clipboard"
                  >📋</button>
                </div>
              </div>
              <div className="ayah-ornament bottom-left"></div>
              <div className="ayah-ornament bottom-right"></div>
            </div>
          </div>
        </section>
      )}

      {readingHistory.length > 0 && (
        <section className="continue-reading">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Your Progress</span>
              <h2>Continue Reading</h2>
            </div>
            <div className="history-cards">
              {readingHistory.map((item) => (
                <Link 
                  to={`/surah/${getSurahByNumber(item.number)?.slug || item.number}`} 
                  key={item.number} 
                  className="history-card"
                >
                  <div className="history-number">{item.number}</div>
                  <div className="history-details">
                    <h4>{item.englishName}</h4>
                    <span>{new Date(item.lastRead).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="surahs-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-badge">Complete Collection</span>
            <h2>All 114 Surahs</h2>
            <p>Begin your spiritual journey with any chapter of the Holy Quran</p>
          </div>
          
          <div className="surah-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, number, or Arabic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="surahs-grid">
            {filteredSurahs.map((surah) => (
              <Link 
                to={`/surah/${getSurahByNumber(surah.number)?.slug || surah.number}`} 
                key={surah.number} 
                className="surah-card"
              >
                <div className="surah-number-badge">
                  <span>{surah.number}</span>
                </div>
                <div className="surah-content">
                  <h3 className="surah-arabic">{surah.name}</h3>
                  <h4 className="surah-english">{surah.englishName}</h4>
                  <p className="surah-meaning">{surah.englishNameTranslation}</p>
                </div>
                <div className="surah-meta">
                  <span className={`revelation-type ${surah.revelationType.toLowerCase()}`}>
                    {surah.revelationType}
                  </span>
                  <span className="ayah-count">{surah.numberOfAyahs} Ayahs</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-badge">Why QuranDeen</span>
            <h2>Comprehensive Islamic Platform</h2>
            <p>Everything you need for Quran study in one place</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>📜</span>
              </div>
              <h3>Multiple Scripts</h3>
              <p>Uthmani, IndoPak, Nastaliq, and color-coded Tajweed scripts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🎧</span>
              </div>
              <h3>150+ Reciters</h3>
              <p>World-renowned Qaris with verse-by-verse and full surah audio</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🌐</span>
              </div>
              <h3>100+ Translations</h3>
              <p>Translations in 40+ languages including English, Urdu, Bengali</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🔤</span>
              </div>
              <h3>Word-by-Word</h3>
              <p>Interactive learning with audio, meaning, and transliteration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>📚</span>
              </div>
              <h3>Tafsir Library</h3>
              <p>In-depth commentary from renowned Islamic scholars</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🤖</span>
              </div>
              <h3>AI Scholar</h3>
              <p>Ask questions and get answers with authentic source citations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>📿</span>
              </div>
              <h3>Hadith Collection</h3>
              <p>17 authentic books with 50,000+ hadiths in multiple languages</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span>🤲</span>
              </div>
              <h3>Daily Azkaar</h3>
              <p>298+ authentic duas from Hisnul Muslim with counter</p>
            </div>
          </div>
        </div>
      </section>

      <section className="resources-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-badge">Islamic Tools</span>
            <h2>Explore More Resources</h2>
          </div>

          <div className="resources-grid">
            <Link to="/islamic-prayer-times" className="resource-card">
              <div className="resource-icon">🕌</div>
              <h3>Prayer Times</h3>
              <p>Accurate prayer times for your location</p>
            </Link>
            <Link to="/qibla-direction" className="resource-card">
              <div className="resource-icon">🧭</div>
              <h3>Qibla Direction</h3>
              <p>Find the direction of Makkah</p>
            </Link>
            <Link to="/hijri-calendar" className="resource-card">
              <div className="resource-icon">📅</div>
              <h3>Hijri Calendar</h3>
              <p>Convert dates and view Islamic events</p>
            </Link>
            <Link to="/99-names-of-allah" className="resource-card">
              <div className="resource-icon">✨</div>
              <h3>99 Names of Allah</h3>
              <p>Explore the beautiful names with meanings</p>
            </Link>
            <Link to="/share-card-generator" className="resource-card">
              <div className="resource-icon">🖼️</div>
              <h3>Share Card</h3>
              <p>Create beautiful verse cards</p>
            </Link>
            <Link to="/quran-classes" className="resource-card">
              <div className="resource-icon">👨‍🏫</div>
              <h3>Quran Classes</h3>
              <p>Learn with qualified teachers</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Begin Your Spiritual Journey</h2>
            <p>Join millions of Muslims worldwide who use QuranDeen to connect with the Holy Quran</p>
            <div className="cta-buttons">
              <Link to="/surah/1-al-fatihah" className="btn-primary">
                Start Reading Now
              </Link>
              <Link to="/signup" className="btn-outline">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
