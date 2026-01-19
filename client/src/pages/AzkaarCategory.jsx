import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../components/HeroAnimated';
import { azkaarCategories, getAllAzkaar } from '../data/azkaarData';
import '../styles/azkaar.css';

function AzkaarCategory() {
  const { categoryId } = useParams();
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [counters, setCounters] = useState({});
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [completedDuas, setCompletedDuas] = useState([]);

  const category = azkaarCategories.find(c => c.id === categoryId);
  const duas = getAllAzkaar(categoryId);

  useEffect(() => {
    const initialCounters = {};
    duas.forEach(dua => {
      initialCounters[dua.id] = 0;
    });
    setCounters(initialCounters);
    setCurrentDuaIndex(0);
    setCompletedDuas([]);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="error-page">
        <h2>Category Not Found</h2>
        <p>The azkaar category you're looking for doesn't exist.</p>
        <Link to="/azkaar" className="btn-primary">Browse All Azkaar</Link>
      </div>
    );
  }

  if (duas.length === 0) {
    return (
      <div className="azkaar-category-page">
        <Helmet>
          <title>{category.nameEn} | Azkaar - QuranDeen</title>
        </Helmet>
        <HeroAnimated
          icon={category.icon}
          title={category.nameEn}
          subtitle={category.nameAr}
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Azkaar', href: '/azkaar' },
            { name: category.nameEn }
          ]}
        />
        <div className="container">
          <div className="coming-soon-card">
            <h2>Coming Soon</h2>
            <p>We're currently adding duas for this category. Please check back soon!</p>
            <Link to="/azkaar" className="btn-primary">Browse Available Categories</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentDua = duas[currentDuaIndex];
  const currentCount = counters[currentDua?.id] || 0;
  const isCompleted = currentCount >= (currentDua?.repeat || 1);
  const progress = (completedDuas.length / duas.length) * 100;

  const handleCount = () => {
    if (!currentDua) return;
    
    const newCount = currentCount + 1;
    setCounters(prev => ({ ...prev, [currentDua.id]: newCount }));
    
    if (newCount >= currentDua.repeat) {
      if (!completedDuas.includes(currentDua.id)) {
        setCompletedDuas(prev => [...prev, currentDua.id]);
      }
      if (currentDuaIndex < duas.length - 1) {
        setTimeout(() => {
          setCurrentDuaIndex(prev => prev + 1);
        }, 500);
      }
    }
  };

  const handlePrevious = () => {
    if (currentDuaIndex > 0) {
      setCurrentDuaIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentDuaIndex < duas.length - 1) {
      setCurrentDuaIndex(prev => prev + 1);
    }
  };

  const resetCounter = () => {
    if (currentDua) {
      setCounters(prev => ({ ...prev, [currentDua.id]: 0 }));
      setCompletedDuas(prev => prev.filter(id => id !== currentDua.id));
    }
  };

  const resetAll = () => {
    const initialCounters = {};
    duas.forEach(dua => {
      initialCounters[dua.id] = 0;
    });
    setCounters(initialCounters);
    setCompletedDuas([]);
    setCurrentDuaIndex(0);
  };

  const fontSizeClass = fontSize === 'small' ? 'font-small' : fontSize === 'large' ? 'font-large' : '';

  return (
    <div className="azkaar-category-page">
      <Helmet>
        <title>{category.nameEn} - {category.nameAr} | Azkaar - QuranDeen</title>
        <meta name="description" content={`${category.description}. Complete collection with Arabic text, transliteration, and English translation from Hisnul Muslim.`} />
        <link rel="canonical" href={`https://qurandeen.com/azkaar/${categoryId}`} />
      </Helmet>

      <HeroAnimated
        icon={category.icon}
        title={category.nameEn}
        subtitle={category.nameAr}
        stats={[
          `${duas.length} Duas`,
          `${completedDuas.length}/${duas.length} Completed`,
          `${Math.round(progress)}% Progress`
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Azkaar', href: '/azkaar' },
          { name: category.nameEn }
        ]}
      />

      <div className="container">
        <div className="category-description">
          <p>{category.description}</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{completedDuas.length} of {duas.length} completed</span>
        </div>

        <div className="controls-bar">
          <div className="display-controls">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={showTransliteration} 
                onChange={() => setShowTransliteration(!showTransliteration)} 
              />
              <span>Transliteration</span>
            </label>
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={showTranslation} 
                onChange={() => setShowTranslation(!showTranslation)} 
              />
              <span>Translation</span>
            </label>
          </div>
          <div className="font-controls">
            <span>Font Size:</span>
            <button 
              className={fontSize === 'small' ? 'active' : ''} 
              onClick={() => setFontSize('small')}
            >A</button>
            <button 
              className={fontSize === 'medium' ? 'active' : ''} 
              onClick={() => setFontSize('medium')}
            >A</button>
            <button 
              className={fontSize === 'large' ? 'active' : ''} 
              onClick={() => setFontSize('large')}
            >A</button>
          </div>
          <button className="btn-reset" onClick={resetAll}>Reset All</button>
        </div>

        <div className="dua-navigation">
          <button 
            className="nav-btn" 
            onClick={handlePrevious} 
            disabled={currentDuaIndex === 0}
          >
            ← Previous
          </button>
          <span className="dua-position">{currentDuaIndex + 1} / {duas.length}</span>
          <button 
            className="nav-btn" 
            onClick={handleNext} 
            disabled={currentDuaIndex === duas.length - 1}
          >
            Next →
          </button>
        </div>

        {currentDua && (
          <div className={`dua-card ${isCompleted ? 'completed' : ''} ${fontSizeClass}`}>
            <div className="dua-header">
              <span className="dua-number">Dua #{currentDuaIndex + 1}</span>
              {isCompleted && <span className="completed-badge">✓ Completed</span>}
            </div>

            <div className="dua-arabic" dir="rtl">
              {currentDua.arabic}
            </div>

            {showTransliteration && currentDua.transliteration && (
              <div className="dua-transliteration">
                {currentDua.transliteration}
              </div>
            )}

            {showTranslation && currentDua.translation && (
              <div className="dua-translation">
                {currentDua.translation}
              </div>
            )}

            <div className="dua-meta">
              {currentDua.reference && (
                <div className="reference">
                  <strong>Reference:</strong> {currentDua.reference}
                </div>
              )}
              {currentDua.virtue && (
                <div className="virtue">
                  <strong>Virtue:</strong> {currentDua.virtue}
                </div>
              )}
            </div>

            <div className="counter-section">
              <div className="repeat-info">
                Recite <strong>{currentDua.repeat}</strong> time{currentDua.repeat > 1 ? 's' : ''}
              </div>
              
              <button 
                className={`counter-btn ${isCompleted ? 'completed' : ''}`}
                onClick={handleCount}
                disabled={isCompleted}
              >
                <span className="count-display">{currentCount}</span>
                <span className="count-label">/ {currentDua.repeat}</span>
              </button>

              <button className="reset-btn" onClick={resetCounter}>
                Reset Counter
              </button>
            </div>
          </div>
        )}

        <div className="dua-list">
          <h3>All Duas in this Category</h3>
          <div className="dua-list-grid">
            {duas.map((dua, index) => (
              <button
                key={dua.id}
                className={`dua-list-item ${index === currentDuaIndex ? 'active' : ''} ${completedDuas.includes(dua.id) ? 'completed' : ''}`}
                onClick={() => setCurrentDuaIndex(index)}
              >
                <span className="item-number">{index + 1}</span>
                {completedDuas.includes(dua.id) && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="category-nav">
          <Link to="/azkaar" className="btn-secondary">← Back to All Categories</Link>
        </div>
      </div>
    </div>
  );
}

export default AzkaarCategory;
