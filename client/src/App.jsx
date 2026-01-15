import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Surah from './pages/Surah';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Juz from './pages/Juz';
import MP3Audio from './pages/MP3Audio';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { BlogList, BlogPost } from './pages/Blog';
import { useAuth } from './hooks/use-auth';

function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
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

  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('selectedFont') || 'uthmani';
  });

  const [selectedTafsir, setSelectedTafsir] = useState(() => {
    return localStorage.getItem('selectedTafsir') || 'ur-tafseer-ibn-e-kaseer';
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

  useEffect(() => {
    localStorage.setItem('selectedFont', selectedFont);
    const fontFamilies = {
      'uthmani': "'KFGQPC Uthmani', 'Amiri', serif",
      'indopak': "'Al Majeed Quranic', 'IndoPak Nastaleeq', 'Amiri', serif",
      'simple': "'Amiri', serif"
    };
    document.documentElement.style.setProperty('--arabic-font-family', fontFamilies[selectedFont] || fontFamilies.uthmani);
  }, [selectedFont]);

  useEffect(() => {
    localStorage.setItem('selectedTafsir', selectedTafsir);
  }, [selectedTafsir]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="app">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        user={user}
        isAuthenticated={isAuthenticated}
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
              selectedTafsir={selectedTafsir}
            />
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks fontSize={fontSize} />} />
          <Route path="/juz" element={<Juz />} />
          <Route path="/mp3" element={<MP3Audio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
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
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              selectedTafsir={selectedTafsir}
              setSelectedTafsir={setSelectedTafsir}
            />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
