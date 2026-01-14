import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Surah() {
  const { number } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAyah, setPlayingAyah] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSurah();
  }, [number]);

  const fetchSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/surah/${number}`);
      setSurahData(response.data);
    } catch (err) {
      setError('Failed to load surah. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (ayah, audioUrl) => {
    if (playingAyah === ayah) {
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAyah(ayah);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingAyah(null);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSurah} />;
  if (!surahData) return null;

  const { arabic, translation, audio } = surahData;
  const surahInfo = arabic.data;
  const ayahs = surahInfo.ayahs;
  const translationAyahs = translation.data.ayahs;
  const audioAyahs = audio.data.ayahs;

  return (
    <div className="surah-page">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      
      <div className="surah-header">
        <Link to="/" className="back-link">← Back to Surahs</Link>
        <div className="surah-title">
          <h1 className="surah-name-arabic-large">{surahInfo.name}</h1>
          <h2>{surahInfo.englishName}</h2>
          <p className="surah-subtitle">
            {surahInfo.englishNameTranslation} • {surahInfo.revelationType} • {surahInfo.numberOfAyahs} Ayahs
          </p>
        </div>
      </div>

      {surahInfo.number !== 1 && surahInfo.number !== 9 && (
        <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      )}

      <div className="ayahs-list">
        {ayahs.map((ayah, index) => (
          <div key={ayah.numberInSurah} className="ayah-card">
            <div className="ayah-header">
              <span className="ayah-number">{ayah.numberInSurah}</span>
              {audioAyahs[index]?.audio && (
                <button 
                  className={`play-btn ${playingAyah === ayah.numberInSurah ? 'playing' : ''}`}
                  onClick={() => playAudio(ayah.numberInSurah, audioAyahs[index].audio)}
                >
                  {playingAyah === ayah.numberInSurah ? '⏸' : '▶'}
                </button>
              )}
            </div>
            <p className="ayah-arabic">{ayah.text}</p>
            <p className="ayah-translation">{translationAyahs[index]?.text}</p>
          </div>
        ))}
      </div>

      <div className="surah-navigation">
        {parseInt(number) > 1 && (
          <Link to={`/surah/${parseInt(number) - 1}`} className="nav-btn prev">
            ← Previous Surah
          </Link>
        )}
        {parseInt(number) < 114 && (
          <Link to={`/surah/${parseInt(number) + 1}`} className="nav-btn next">
            Next Surah →
          </Link>
        )}
      </div>
    </div>
  );
}

export default Surah;
