import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyAyah, setDailyAyah] = useState(null);
  const [dailyAyahLoading, setDailyAyahLoading] = useState(true);
  const [readingHistory, setReadingHistory] = useState([]);

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
        // Check if cache is valid and has new format (arabic, english, urdu)
        if (parsed.date === today && parsed.ayah && parsed.ayah.arabic) {
          setDailyAyah(parsed.ayah);
          setDailyAyahLoading(false);
          return;
        }
      }
      // Clear old cache and fetch fresh data
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

  const shareAyah = (platform, text, surahName, verseRef) => {
    const shareText = `"${text}" - ${surahName} (${verseRef})`;
    const url = window.location.origin;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurahs} />;

  return (
    <div className="home">
      <div className="hero">
        <h1>The Holy Quran</h1>
        <p>Read, listen, and explore the divine words</p>
      </div>

      <div className="browse-links">
        <Link to="/juz" className="browse-link">
          <span>📖</span> Browse by Juz
        </Link>
        <Link to="/bookmarks" className="browse-link">
          <span>🔖</span> My Bookmarks
        </Link>
        <Link to="/settings" className="browse-link">
          <span>⚙️</span> Settings
        </Link>
      </div>

      {dailyAyah && (
        <div className="daily-ayah-section">
          <h2 className="section-title">Ayah of the Day</h2>
          <div className="daily-ayah-card">
            <p className="daily-ayah-arabic">{dailyAyah.arabic}</p>
            <div className="daily-ayah-translations">
              <p className="daily-ayah-english">{dailyAyah.english}</p>
              <p className="daily-ayah-urdu">{dailyAyah.urdu}</p>
            </div>
            <div className="daily-ayah-ref">
              <Link to={`/surah/${dailyAyah.surah.number}`}>
                {dailyAyah.surah.englishName} ({dailyAyah.surah.number}:{dailyAyah.numberInSurah})
              </Link>
            </div>
            <div className="share-buttons">
              <button 
                className="share-btn"
                onClick={() => shareAyah('twitter', dailyAyah.english, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Share on Twitter"
              >
                𝕏
              </button>
              <button 
                className="share-btn whatsapp"
                onClick={() => shareAyah('whatsapp', dailyAyah.english, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Share on WhatsApp"
              >
                💬
              </button>
              <button 
                className="share-btn"
                onClick={() => shareAyah('copy', `${dailyAyah.arabic}\n\n${dailyAyah.english}\n\n${dailyAyah.urdu}`, dailyAyah.surah.englishName, `${dailyAyah.surah.number}:${dailyAyah.numberInSurah}`)}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      )}

      {readingHistory.length > 0 && (
        <div className="reading-history-section">
          <h2 className="section-title">Continue Reading</h2>
          <div className="history-list">
            {readingHistory.map((item) => (
              <Link to={`/surah/${item.number}`} key={item.number} className="history-item">
                <span className="history-number">{item.number}</span>
                <div className="history-info">
                  <span className="history-name">{item.englishName}</span>
                  <span className="history-date">{new Date(item.lastRead).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <h2 className="section-title">All Surahs</h2>
      <div className="surahs-grid">
        {surahs.map((surah) => (
          <Link to={`/surah/${surah.number}`} key={surah.number} className="surah-card">
            <div className="surah-number">{surah.number}</div>
            <div className="surah-info">
              <h3 className="surah-name-arabic">{surah.name}</h3>
              <h4 className="surah-name-english">{surah.englishName}</h4>
              <p className="surah-translation">{surah.englishNameTranslation}</p>
              <span className="surah-meta">
                {surah.revelationType} • {surah.numberOfAyahs} Ayahs
              </span>
            </div>
          </Link>
        ))}
      </div>

      <section className="about-section">
        <div className="about-header">
          <h2 className="about-title">Welcome to QuranDeen</h2>
          <p className="about-subtitle">Your Complete Digital Companion for Quran Study</p>
          <p className="about-intro">
            QuranDeen is a comprehensive platform designed to help Muslims around the world read, listen, 
            learn, and understand the Holy Quran. Whether you're a beginner or an advanced learner, 
            our platform provides all the tools you need for a meaningful Quran study experience.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-number">114</div>
            <div className="stat-label">Surahs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-number">6,236</div>
            <div className="stat-label">Ayahs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">30</div>
            <div className="stat-label">Juz (Parts)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">100+</div>
            <div className="stat-label">Translations</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎙️</div>
            <div className="stat-number">150+</div>
            <div className="stat-label">Reciters</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔤</div>
            <div className="stat-number">77,430</div>
            <div className="stat-label">Words</div>
          </div>
        </div>

        <div className="features-section">
          <h3 className="features-title">Platform Features</h3>
          
          <div className="feature-category">
            <h4 className="category-title">Reading & Study</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📜</div>
                <h5>Multiple Arabic Scripts</h5>
                <p>Choose from Uthmani, IndoPak, Simple, or Color-Coded Tajweed scripts to match your reading preference.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔤</div>
                <h5>Beautiful Fonts</h5>
                <p>5 Arabic font styles including PDMS Saleem, Nastaliq, Naskh Nastaleeq, and Me Quran for authentic reading.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h5>Tajweed Colors</h5>
                <p>Learn proper recitation with color-coded Tajweed rules highlighting Ghunnah, Ikhfa, Qalqalah, Madd, and more.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔠</div>
                <h5>Word-by-Word Mode</h5>
                <p>Clickable words with individual audio, translation tooltips, and transliteration for deep understanding.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📖</div>
                <h5>Juz Browser</h5>
                <p>Navigate the Quran by Juz (parts), with all 30 sections organized for easy access and tracking.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📑</div>
                <h5>Ayah Metadata</h5>
                <p>View Juz, Page, Ruku, and Sajda information for each verse with visual prostration markers.</p>
              </div>
            </div>
          </div>

          <div className="feature-category">
            <h4 className="category-title">Audio & Recitation</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎧</div>
                <h5>Verse-by-Verse Audio</h5>
                <p>Listen to individual ayahs with 23+ reciters including Mishary Rashid, Abdul Samad, and Al-Sudais.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h5>Full Surah Audio</h5>
                <p>Stream complete surah recitations from 150+ world-renowned Qaris via MP3Quran.net integration.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔊</div>
                <h5>Word Audio</h5>
                <p>In Word-by-Word mode, tap any word to hear its individual pronunciation for learning Tajweed.</p>
              </div>
            </div>
          </div>

          <div className="feature-category">
            <h4 className="category-title">Translations & Tafsir</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h5>100+ Translations</h5>
                <p>Access translations in 40+ languages including English, Urdu, Bengali, Turkish, Indonesian, and more.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h5>Multilingual Tafsir</h5>
                <p>In-depth commentary from renowned scholars in Arabic, Urdu, English, and Bengali.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h5>AI Scholar</h5>
                <p>Ask questions about Quran, Hadith, and Islamic topics with AI-powered answers citing authentic sources.</p>
              </div>
            </div>
          </div>

          <div className="feature-category">
            <h4 className="category-title">Personal Features</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔖</div>
                <h5>Bookmarks</h5>
                <p>Save your favorite ayahs and access them anytime. Synced across devices when logged in.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h5>Reading Progress</h5>
                <p>Track which surahs you've completed and monitor your Quran reading journey.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h5>Search</h5>
                <p>Search for any word or phrase across the entire Quran with instant results.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📤</div>
                <h5>Share Ayahs</h5>
                <p>Share beautiful verses on Twitter, WhatsApp, or copy to clipboard with one click.</p>
              </div>
            </div>
          </div>

          <div className="feature-category">
            <h4 className="category-title">Islamic Resources</h4>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🖼️</div>
                <h5>Share Card Generator</h5>
                <p>Create beautiful verse cards for social media with custom backgrounds, fonts, and translations.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌙</div>
                <h5>Verse of the Day</h5>
                <p>Daily inspiring ayah with Arabic, English, and Urdu translations for spiritual reflection.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h5>Hijri Calendar</h5>
                <p>Convert between Hijri and Gregorian dates with important Islamic dates highlighted.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤲</div>
                <h5>Morning & Evening Adhkar</h5>
                <p>Authentic daily supplications with Arabic text, transliteration, and translation.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h5>99 Names of Allah</h5>
                <p>Explore the beautiful names of Allah with meanings, Quranic verses, and reflections.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📿</div>
                <h5>Hadith of the Day</h5>
                <p>Curated authentic hadiths from Bukhari and Muslim with explanations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="quran-facts">
          <h3 className="facts-title">Interesting Facts About the Quran</h3>
          <div className="facts-grid">
            <div className="fact-card">
              <div className="fact-icon">📜</div>
              <h5>Revelation Period</h5>
              <p>The Quran was revealed over approximately 23 years to Prophet Muhammad (PBUH) in Makkah and Madinah.</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🕌</div>
              <h5>Meccan & Medinan</h5>
              <p>86 surahs were revealed in Makkah (focusing on faith) and 28 in Madinah (focusing on law and guidance).</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">📖</div>
              <h5>Longest & Shortest</h5>
              <p>Surah Al-Baqarah is the longest (286 ayahs) and Surah Al-Kawthar is the shortest (3 ayahs).</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">✍️</div>
              <h5>Unique Letters</h5>
              <p>The Quran contains 323,015 letters. Some surahs begin with mysterious letters called "Muqatta'at".</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🌟</div>
              <h5>Heart of Quran</h5>
              <p>Surah Ya-Sin is often called the "Heart of the Quran" and Surah Al-Fatiha is recited in every prayer.</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🛡️</div>
              <h5>Preserved Unchanged</h5>
              <p>The Quran is the only religious scripture that has remained completely unchanged for over 1,400 years.</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">🌍</div>
              <h5>Most Memorized</h5>
              <p>Millions of Muslims (Huffaz) have memorized the entire Quran, making it the most memorized book in history.</p>
            </div>
            <div className="fact-card">
              <div className="fact-icon">📿</div>
              <h5>Prostration Verses</h5>
              <p>There are 15 verses of prostration (Sajdah) in the Quran where Muslims prostrate when reading or hearing them.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>Start Your Journey Today</h3>
          <p>Explore the divine guidance of the Holy Quran with our comprehensive tools and features.</p>
          <div className="cta-buttons">
            <Link to="/surah/1" className="cta-btn primary">Start Reading</Link>
            <Link to="/tools" className="cta-btn secondary">Explore Resources</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
