import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahs();
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

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurahs} />;

  return (
    <div className="home">
      <div className="hero">
        <h1>The Holy Quran</h1>
        <p>Read, listen, and explore the divine words</p>
      </div>
      
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
    </div>
  );
}

export default Home;
