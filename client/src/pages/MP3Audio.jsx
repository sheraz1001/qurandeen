import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

function MP3Audio() {
  const [surahs, setSurahs] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingSurah, setPlayingSurah] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [surahsRes, recitersRes] = await Promise.all([
        axios.get('/api/surahs'),
        axios.get('/api/mp3-reciters')
      ]);
      setSurahs(surahsRes.data.data || []);
      const recitersData = recitersRes.data.data || [];
      setReciters(recitersData);
      if (recitersData.length > 0) {
        setSelectedReciter(recitersData[0]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isSurahAvailable = (surahNumber) => {
    if (!selectedReciter) return false;
    return selectedReciter.availableSurahs.includes(surahNumber);
  };

  const getAudioUrl = (surahNumber) => {
    if (!selectedReciter) return null;
    const paddedNum = String(surahNumber).padStart(3, '0');
    return `${selectedReciter.server}${paddedNum}.mp3`;
  };

  const playSurah = (surahNumber) => {
    if (!isSurahAvailable(surahNumber)) return;
    
    const audioUrl = getAudioUrl(surahNumber);
    if (playingSurah === surahNumber) {
      audioRef.current?.pause();
      setPlayingSurah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingSurah(surahNumber);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingSurah(null);
  };

  const handleReciterChange = (e) => {
    const reciter = reciters.find(r => r.id === parseInt(e.target.value));
    setSelectedReciter(reciter);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSurah(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="mp3-audio-page">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div className="page-header">
        <h1 className="page-title">🎧 MP3 Quran Audio</h1>
        <p className="page-subtitle">Listen to complete surah recitations</p>
      </div>

      <div className="reciter-selector">
        <label htmlFor="mp3-reciter">Select Reciter:</label>
        <select 
          id="mp3-reciter"
          value={selectedReciter?.id || ''}
          onChange={handleReciterChange}
        >
          {reciters.map(reciter => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name} ({reciter.availableSurahs.length} Surahs)
            </option>
          ))}
        </select>
      </div>

      {selectedReciter && (
        <div className="reciter-info">
          <span className="reciter-name">{selectedReciter.name}</span>
          <span className="reciter-style">{selectedReciter.style}</span>
          <span className="surah-count">{selectedReciter.availableSurahs.length} surahs available</span>
        </div>
      )}

      <div className="surah-grid">
        {surahs.map((surah) => {
          const available = isSurahAvailable(surah.number);
          const isPlaying = playingSurah === surah.number;
          
          return (
            <div 
              key={surah.number} 
              className={`surah-audio-card ${available ? '' : 'unavailable'} ${isPlaying ? 'playing' : ''}`}
            >
              <div className="surah-number">{surah.number}</div>
              <div className="surah-info">
                <h3 className="surah-name-ar">{surah.name}</h3>
                <p className="surah-name-en">{surah.englishName}</p>
                <p className="surah-meta">{surah.numberOfAyahs} Ayahs</p>
              </div>
              <button 
                className={`play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => playSurah(surah.number)}
                disabled={!available}
                title={available ? (isPlaying ? 'Pause' : 'Play Surah') : 'Not available'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          );
        })}
      </div>

      {playingSurah && (
        <div className="now-playing-bar">
          <div className="now-playing-info">
            <span className="now-playing-label">Now Playing:</span>
            <span className="now-playing-surah">
              {surahs.find(s => s.number === playingSurah)?.englishName || `Surah ${playingSurah}`}
            </span>
            <span className="now-playing-reciter">by {selectedReciter?.name}</span>
          </div>
          <button className="stop-btn" onClick={() => { audioRef.current?.pause(); setPlayingSurah(null); }}>
            ⏹ Stop
          </button>
        </div>
      )}
    </div>
  );
}

export default MP3Audio;
