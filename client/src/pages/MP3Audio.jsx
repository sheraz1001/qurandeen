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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      const sortedReciters = recitersData.sort((a, b) => a.name.localeCompare(b.name));
      setReciters(sortedReciters);
      const youssef = sortedReciters.find(r => r.name.toLowerCase().includes('youssef'));
      setSelectedReciter(youssef || sortedReciters[0]);
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

  const selectReciter = (reciter) => {
    setSelectedReciter(reciter);
    setDropdownOpen(false);
    setSearchQuery('');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSurah(null);
  };

  const filteredReciters = reciters.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedReciters = filteredReciters.reduce((acc, reciter) => {
    const letter = reciter.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(reciter);
    return acc;
  }, {});

  if (loading) return <Loading />;

  return (
    <div className="mp3-audio-page">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div className="page-header">
        <h1 className="page-title">🎧 MP3 Quran Audio</h1>
        <p className="page-subtitle">Listen to complete surah recitations</p>
        
        <div className="mp3-features">
          <div className="feature-stat">
            <span className="stat-number">{reciters.length}+</span>
            <span className="stat-label">Reciters</span>
          </div>
          <div className="feature-stat">
            <span className="stat-number">114</span>
            <span className="stat-label">Surahs</span>
          </div>
          <div className="feature-stat">
            <span className="stat-number">Full</span>
            <span className="stat-label">Surah Audio</span>
          </div>
          <div className="feature-stat">
            <span className="stat-number">Free</span>
            <span className="stat-label">Unlimited</span>
          </div>
        </div>
        
        <div className="mp3-features-list">
          <span className="feature-item">Hafs an Asim</span>
          <span className="feature-item">Warsh</span>
          <span className="feature-item">Murattal</span>
          <span className="feature-item">Mujawwad</span>
          <span className="feature-item">High Quality MP3</span>
        </div>
      </div>

      <div className="reciter-dropdown-container" ref={dropdownRef}>
        <label className="dropdown-label">Select Reciter:</label>
        <div className="custom-dropdown">
          <button 
            className={`dropdown-trigger ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="selected-reciter">
              {selectedReciter ? (
                <>
                  <span className="reciter-avatar">{selectedReciter.name.charAt(0)}</span>
                  <div className="reciter-details">
                    <span className="reciter-name">{selectedReciter.name}</span>
                    <span className="reciter-meta">{selectedReciter.availableSurahs.length} Surahs • {selectedReciter.style?.split(' - ')[0] || 'Murattal'}</span>
                  </div>
                </>
              ) : (
                <span>Select a reciter...</span>
              )}
            </div>
            <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-search">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search reciters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
                )}
              </div>
              
              <div className="dropdown-list">
                {Object.keys(groupedReciters).length === 0 ? (
                  <div className="no-results">No reciters found</div>
                ) : (
                  Object.entries(groupedReciters).sort(([a], [b]) => a.localeCompare(b)).map(([letter, letterReciters]) => (
                    <div key={letter} className="letter-group">
                      <div className="letter-header">{letter}</div>
                      {letterReciters.map(reciter => (
                        <button
                          key={reciter.id}
                          className={`dropdown-item ${selectedReciter?.id === reciter.id ? 'selected' : ''}`}
                          onClick={() => selectReciter(reciter)}
                        >
                          <span className="item-avatar">{reciter.name.charAt(0)}</span>
                          <div className="item-details">
                            <span className="item-name">{reciter.name}</span>
                            <span className="item-meta">{reciter.availableSurahs.length} Surahs</span>
                          </div>
                          {selectedReciter?.id === reciter.id && <span className="check-mark">✓</span>}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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
