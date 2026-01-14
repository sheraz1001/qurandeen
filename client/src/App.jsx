import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Surah from './pages/Surah';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';

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

  const [selectedReciter, setSelectedReciter] = useState(() => {
    return localStorage.getItem('selectedReciter') || 'ar.alafasy';
  });

  const [selectedScript, setSelectedScript] = useState(() => {
    return localStorage.getItem('selectedScript') || 'quran-uthmani';
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

  useEffect(() => {
    localStorage.setItem('selectedReciter', selectedReciter);
  }, [selectedReciter]);

  useEffect(() => {
    localStorage.setItem('selectedScript', selectedScript);
  }, [selectedScript]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="app">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:number" element={
            <Surah 
              fontSize={fontSize} 
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              selectedReciter={selectedReciter}
              selectedScript={selectedScript}
            />
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks fontSize={fontSize} />} />
          <Route path="/settings" element={
            <Settings 
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              fontSize={fontSize}
              setFontSize={setFontSize}
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              selectedReciter={selectedReciter}
              setSelectedReciter={setSelectedReciter}
              selectedScript={selectedScript}
              setSelectedScript={setSelectedScript}
            />
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
