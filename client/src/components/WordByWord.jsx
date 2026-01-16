import { useState, useRef, useEffect } from 'react';
import '../styles/word-by-word.css';

function WordByWord({ words, selectedFont, fontSize }) {
  const [playingWordId, setPlayingWordId] = useState(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const audioRef = useRef(null);

  const getFontFamily = () => {
    switch (selectedFont) {
      case 'indopak':
        return "'PDMS Saleem', 'Al Majeed Quranic', serif";
      case 'nastaliq':
        return "'IndoPak Nastaleeq', 'Noto Nastaliq Urdu', serif";
      case 'uthmani':
        return "'KFGQPC Uthmani', serif";
      default:
        return "'Amiri', serif";
    }
  };

  const playWordAudio = async (word) => {
    if (!word.audio_url) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setPlayingWordId(word.id);
    
    const audio = new Audio(word.audio_url);
    audioRef.current = audio;
    
    audio.onended = () => {
      setPlayingWordId(null);
    };
    
    audio.onerror = () => {
      setPlayingWordId(null);
      console.error('Failed to play word audio');
    };
    
    try {
      await audio.play();
    } catch (err) {
      setPlayingWordId(null);
      console.error('Audio playback failed:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!words || words.length === 0) {
    return <div className="wbw-loading">Loading word-by-word...</div>;
  }

  return (
    <div className="word-by-word-container">
      <div className="wbw-words" style={{ fontFamily: getFontFamily() }}>
        {words.map((word) => {
          if (word.char_type === 'end') {
            return (
              <span key={word.id} className="wbw-ayah-number">
                {word.text_uthmani}
              </span>
            );
          }
          
          const isPlaying = playingWordId === word.id;
          const isHovered = hoveredWord === word.id;
          
          return (
            <div
              key={word.id}
              className={`wbw-word ${isPlaying ? 'playing' : ''} ${word.audio_url ? 'has-audio' : ''}`}
              onClick={() => playWordAudio(word)}
              onMouseEnter={() => setHoveredWord(word.id)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              <span 
                className="wbw-arabic"
                style={{ fontSize: `${fontSize || 28}px` }}
              >
                {selectedFont === 'indopak' ? word.text_indopak : word.text_uthmani}
              </span>
              
              {isHovered && word.translation && (
                <div className="wbw-tooltip">
                  <div className="tooltip-translation">{word.translation}</div>
                  {word.transliteration && (
                    <div className="tooltip-transliteration">{word.transliteration}</div>
                  )}
                  {word.audio_url && (
                    <div className="tooltip-hint">Click to hear pronunciation</div>
                  )}
                </div>
              )}
              
              {isPlaying && (
                <div className="wbw-playing-indicator">
                  <span className="sound-wave"></span>
                  <span className="sound-wave"></span>
                  <span className="sound-wave"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WordByWord;
