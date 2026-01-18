import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';

function MP3Audio() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Audio Quran' }
  ];
  const [surahs, setSurahs] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingSurah, setPlayingSurah] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [playlistMode, setPlaylistMode] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [playlistRepeat, setPlaylistRepeat] = useState(1);
  const [currentPlaylistRepeat, setCurrentPlaylistRepeat] = useState(0);
  const [showPlaylistPanel, setShowPlaylistPanel] = useState(false);
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
    
    setPlaylistMode(false);
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
    if (playlistMode && playlist.length > 0) {
      const currentItem = playlist[currentPlaylistIndex];
      if (currentRepeat + 1 < currentItem.repeat) {
        setCurrentRepeat(prev => prev + 1);
        audioRef.current?.play();
      } else {
        setCurrentRepeat(0);
        if (currentPlaylistIndex + 1 < playlist.length) {
          playPlaylistItem(currentPlaylistIndex + 1);
        } else {
          if (currentPlaylistRepeat + 1 < playlistRepeat) {
            setCurrentPlaylistRepeat(prev => prev + 1);
            playPlaylistItem(0);
          } else {
            setPlaylistMode(false);
            setPlayingSurah(null);
            setCurrentPlaylistIndex(0);
            setCurrentPlaylistRepeat(0);
          }
        }
      }
    } else {
      setPlayingSurah(null);
    }
  };

  const selectReciter = (reciter) => {
    setSelectedReciter(reciter);
    setDropdownOpen(false);
    setSearchQuery('');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSurah(null);
    setPlaylist([]);
  };

  const addToPlaylist = (surah) => {
    if (!isSurahAvailable(surah.number)) return;
    const exists = playlist.find(p => p.surah.number === surah.number);
    if (!exists) {
      setPlaylist([...playlist, { surah, repeat: 1 }]);
    }
  };

  const removeFromPlaylist = (surahNumber) => {
    setPlaylist(playlist.filter(p => p.surah.number !== surahNumber));
  };

  const updateSurahRepeat = (surahNumber, repeat) => {
    setPlaylist(playlist.map(p => 
      p.surah.number === surahNumber ? { ...p, repeat: Math.max(1, Math.min(10, repeat)) } : p
    ));
  };

  const moveInPlaylist = (index, direction) => {
    const newPlaylist = [...playlist];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < playlist.length) {
      [newPlaylist[index], newPlaylist[newIndex]] = [newPlaylist[newIndex], newPlaylist[index]];
      setPlaylist(newPlaylist);
    }
  };

  const playPlaylistItem = (index) => {
    if (index >= 0 && index < playlist.length) {
      const item = playlist[index];
      setCurrentPlaylistIndex(index);
      setPlayingSurah(item.surah.number);
      const audioUrl = getAudioUrl(item.surah.number);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  };

  const startPlaylist = () => {
    if (playlist.length === 0) return;
    setPlaylistMode(true);
    setCurrentPlaylistIndex(0);
    setCurrentRepeat(0);
    setCurrentPlaylistRepeat(0);
    playPlaylistItem(0);
  };

  const stopPlaylist = () => {
    setPlaylistMode(false);
    setPlayingSurah(null);
    audioRef.current?.pause();
  };

  const isInPlaylist = (surahNumber) => {
    return playlist.some(p => p.surah.number === surahNumber);
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
      <SEO 
        title="MP3 Quran Audio - Listen to 150+ Reciters Online Free"
        description="Listen to full Quran recitations from 150+ world-renowned reciters. Stream high-quality MP3 audio for all 114 Surahs including Mishary Rashid, Abdul Basit, and more."
        canonical="https://qurandeen.com/audio"
        keywords="Quran MP3, Quran audio, Quran recitation, listen Quran online, Quran reciters, Mishary Rashid, Abdul Basit, full Quran audio"
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="🎧"
        title="Audio Quran"
        subtitle="Listen to complete surah recitations from world-renowned Qaris"
        stats={[`${reciters.length}+ Reciters`, '114 Surahs', 'Free & Unlimited']}
        breadcrumbs={breadcrumbs}
      />
      <audio ref={audioRef} onEnded={handleAudioEnded} />

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

      <div className="playlist-toggle">
        <button 
          className={`playlist-btn ${showPlaylistPanel ? 'active' : ''}`}
          onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
        >
          📋 Playlist {playlist.length > 0 && <span className="playlist-count">{playlist.length}</span>}
        </button>
      </div>

      {showPlaylistPanel && (
        <div className="playlist-panel">
          <div className="playlist-header">
            <h3>🎵 Your Playlist</h3>
            <div className="playlist-repeat-control">
              <label>Repeat Playlist:</label>
              <div className="repeat-input-group">
                <button onClick={() => setPlaylistRepeat(Math.max(1, playlistRepeat - 1))}>−</button>
                <span className="repeat-value">{playlistRepeat}x</span>
                <button onClick={() => setPlaylistRepeat(Math.min(10, playlistRepeat + 1))}>+</button>
              </div>
            </div>
          </div>
          
          {playlist.length === 0 ? (
            <div className="playlist-empty">
              <p>No surahs in playlist</p>
              <p className="hint">Click the + button on any surah to add it</p>
            </div>
          ) : (
            <>
              <div className="playlist-items">
                {playlist.map((item, index) => (
                  <div 
                    key={item.surah.number} 
                    className={`playlist-item ${playlistMode && currentPlaylistIndex === index ? 'playing' : ''}`}
                  >
                    <div className="playlist-item-order">
                      <button 
                        className="move-btn" 
                        onClick={() => moveInPlaylist(index, -1)}
                        disabled={index === 0}
                      >▲</button>
                      <span className="order-num">{index + 1}</span>
                      <button 
                        className="move-btn" 
                        onClick={() => moveInPlaylist(index, 1)}
                        disabled={index === playlist.length - 1}
                      >▼</button>
                    </div>
                    <div className="playlist-item-info">
                      <span className="surah-name">{item.surah.englishName}</span>
                      <span className="surah-arabic">{item.surah.name}</span>
                    </div>
                    <div className="playlist-item-repeat">
                      <label>Repeat:</label>
                      <div className="repeat-input-group small">
                        <button onClick={() => updateSurahRepeat(item.surah.number, item.repeat - 1)}>−</button>
                        <span className="repeat-value">{item.repeat}x</span>
                        <button onClick={() => updateSurahRepeat(item.surah.number, item.repeat + 1)}>+</button>
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromPlaylist(item.surah.number)}
                    >✕</button>
                  </div>
                ))}
              </div>
              
              <div className="playlist-controls">
                {!playlistMode ? (
                  <button className="play-playlist-btn" onClick={startPlaylist}>
                    ▶ Play Playlist
                  </button>
                ) : (
                  <button className="stop-playlist-btn" onClick={stopPlaylist}>
                    ⏹ Stop Playlist
                  </button>
                )}
                <button className="clear-playlist-btn" onClick={() => { setPlaylist([]); stopPlaylist(); }}>
                  🗑 Clear All
                </button>
              </div>
              
              {playlistMode && (
                <div className="playlist-progress">
                  <span>Playing: {playlist[currentPlaylistIndex]?.surah.englishName}</span>
                  <span>Repeat {currentRepeat + 1}/{playlist[currentPlaylistIndex]?.repeat}</span>
                  <span>Playlist Loop {currentPlaylistRepeat + 1}/{playlistRepeat}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

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
          const inPlaylist = isInPlaylist(surah.number);
          
          return (
            <div 
              key={surah.number} 
              className={`surah-audio-card ${available ? '' : 'unavailable'} ${isPlaying ? 'playing' : ''} ${inPlaylist ? 'in-playlist' : ''}`}
            >
              <div className="surah-number">{surah.number}</div>
              <div className="surah-info">
                <h3 className="surah-name-ar">{surah.name}</h3>
                <p className="surah-name-en">{surah.englishName}</p>
                <p className="surah-meta">{surah.numberOfAyahs} Ayahs</p>
              </div>
              <div className="surah-actions">
                <button 
                  className={`play-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={() => playSurah(surah.number)}
                  disabled={!available}
                  title={available ? (isPlaying ? 'Pause' : 'Play Surah') : 'Not available'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button 
                  className={`add-playlist-btn ${inPlaylist ? 'added' : ''}`}
                  onClick={() => inPlaylist ? removeFromPlaylist(surah.number) : addToPlaylist(surah)}
                  disabled={!available}
                  title={inPlaylist ? 'Remove from playlist' : 'Add to playlist'}
                >
                  {inPlaylist ? '✓' : '+'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {playingSurah && (
        <div className="now-playing-bar">
          <div className="now-playing-info">
            <span className="now-playing-label">{playlistMode ? 'Playlist:' : 'Now Playing:'}</span>
            <span className="now-playing-surah">
              {surahs.find(s => s.number === playingSurah)?.englishName || `Surah ${playingSurah}`}
            </span>
            <span className="now-playing-reciter">by {selectedReciter?.name}</span>
            {playlistMode && (
              <span className="playlist-status">
                ({currentPlaylistIndex + 1}/{playlist.length}) Rep {currentRepeat + 1}/{playlist[currentPlaylistIndex]?.repeat}
              </span>
            )}
          </div>
          <button className="stop-btn" onClick={() => { audioRef.current?.pause(); setPlayingSurah(null); setPlaylistMode(false); }}>
            ⏹ Stop
          </button>
        </div>
      )}
    </div>
  );
}

export default MP3Audio;
