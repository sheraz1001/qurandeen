import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import { getSurahByNumber } from '../data/surahData';

function Juz() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Juz Browser' }
  ];
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [juzData, setJuzData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJuz();
  }, [selectedJuz]);

  const fetchJuz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/juz/${selectedJuz}`);
      setJuzData(response.data.data);
    } catch (err) {
      setError('Failed to load juz. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupBySurah = (ayahs) => {
    const grouped = {};
    ayahs.forEach(ayah => {
      const surahNum = ayah.surah.number;
      if (!grouped[surahNum]) {
        grouped[surahNum] = {
          surah: ayah.surah,
          ayahs: []
        };
      }
      grouped[surahNum].ayahs.push(ayah);
    });
    return Object.values(grouped);
  };

  return (
    <div className="juz-page">
      <SEO 
        title="Browse Quran by Juz (Para) - All 30 Parts"
        description="Navigate the Holy Quran by Juz (Para). Browse all 30 parts of the Quran with surah breakdown and ayah count for each Juz."
        canonical="https://qurandeen.com/juz"
        keywords="Quran Juz, Quran Para, 30 Juz, Quran parts, browse Quran, Juz browser"
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="📖"
        title="Juz Browser"
        subtitle="Navigate the Quran by Juz (Para)"
        stats={['30 Juz', 'All 114 Surahs', 'Easy Navigation']}
        breadcrumbs={breadcrumbs}
      />
      
      <div className="juz-selector">
        <label htmlFor="juz-select">Select Juz:</label>
        <select 
          id="juz-select"
          value={selectedJuz}
          onChange={(e) => setSelectedJuz(parseInt(e.target.value))}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>Juz {num}</option>
          ))}
        </select>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={fetchJuz} />}
      
      {juzData && !loading && (
        <div className="juz-content">
          <div className="juz-info">
            <h2>Juz {juzData.number}</h2>
            <p className="juz-stats">{juzData.ayahs?.length || 0} Ayahs</p>
          </div>
          
          <div className="juz-surahs">
            {groupBySurah(juzData.ayahs || []).map(({ surah, ayahs }) => (
              <div key={surah.number} className="juz-surah-card">
                <div className="juz-surah-header">
                  <Link to={`/surah/${getSurahByNumber(surah.number)?.slug || surah.number}`} className="surah-link">
                    <span className="surah-number-badge">{surah.number}</span>
                    <div className="surah-details">
                      <span className="surah-name">{surah.name}</span>
                      <span className="surah-english">{surah.englishName}</span>
                    </div>
                  </Link>
                  <span className="ayah-range">
                    Ayahs {ayahs[0]?.numberInSurah} - {ayahs[ayahs.length - 1]?.numberInSurah}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Juz;
