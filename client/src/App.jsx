import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Surah from './pages/Surah';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseInt(saved) : 28;
  });

  const [selectedTranslation, setSelectedTranslation] = useState(() => {
    return localStorage.getItem('selectedTranslation') || 'en.asad';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
    document.documentElement.style.setProperty('--arabic-font-size', `${fontSize / 16}rem`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('selectedTranslation', selectedTranslation);
  }, [selectedTranslation]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="app">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:number" element={
            <Surah 
              fontSize={fontSize} 
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
            />
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks fontSize={fontSize} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
