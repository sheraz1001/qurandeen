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
import Chat from './pages/Chat';
import Features from './pages/Features';
import Tools from './pages/Tools';
import ShareCardGenerator from './pages/tools/ShareCardGenerator';
import VerseOfDay from './pages/tools/VerseOfDay';
import HijriConverter from './pages/tools/HijriConverter';
import Adhkar from './pages/tools/Adhkar';
import NamesOfAllah from './pages/tools/NamesOfAllah';
import HadithOfDay from './pages/tools/HadithOfDay';
import PrayerTimes from './pages/PrayerTimes';
import QiblaDirection from './pages/QiblaDirection';
import RamadanCalendar from './pages/RamadanCalendar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { BlogList, BlogPost } from './pages/Blog';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TeacherDirectory from './pages/teaching/TeacherDirectory';
import TeacherProfile from './pages/teaching/TeacherProfile';
import BecomeTeacher from './pages/teaching/BecomeTeacher';
import TeachWithUs from './pages/teaching/TeachWithUs';
import TeacherDashboard from './pages/teaching/TeacherDashboard';
import StudentDashboard from './pages/teaching/StudentDashboard';
import BookClass from './pages/teaching/BookClass';
import Azkaar from './pages/Azkaar';
import AzkaarCategory from './pages/AzkaarCategory';
import HadithCollections from './pages/HadithCollections';
import HadithBook from './pages/HadithBook';
import HadithChapter from './pages/HadithChapter';
import { AuthProvider } from './context/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

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
      'indopak': "'PDMS Saleem', 'Al Majeed Quranic', serif",
      'nastaliq': "'IndoPak Nastaleeq', 'Noto Nastaliq Urdu', serif",
      'naskh': "'Naskh Nastaleeq', 'PDMS Saleem', serif",
      'mequran': "'Me Quran', 'Al Majeed Quranic', serif",
      'simple': "'Amiri', serif"
    };
    document.documentElement.style.setProperty('--arabic-font-family', fontFamilies[selectedFont] || fontFamilies.uthmani);
  }, [selectedFont]);

  useEffect(() => {
    localStorage.setItem('selectedTafsir', selectedTafsir);
  }, [selectedTafsir]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AuthProvider>
      <div className="app">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:identifier" element={
              <Surah 
                fontSize={fontSize} 
                selectedTranslation={selectedTranslation}
                setSelectedTranslation={setSelectedTranslation}
                selectedReciter={selectedReciter}
                selectedScript={selectedScript}
                selectedTafsir={selectedTafsir}
                selectedFont={selectedFont}
              />
            } />
            <Route path="/search" element={<Search />} />
            <Route path="/bookmarks" element={<Bookmarks fontSize={fontSize} />} />
            <Route path="/quran-juz-browser" element={<Juz />} />
            <Route path="/quran-mp3-audio" element={<MP3Audio />} />
            <Route path="/islamic-ai-scholar" element={<Chat />} />
            <Route path="/features" element={<Features />} />
            <Route path="/islamic-resources" element={<Tools />} />
            <Route path="/islamic-resources/share-card" element={<ShareCardGenerator />} />
            <Route path="/islamic-resources/verse-of-day" element={<VerseOfDay />} />
            <Route path="/islamic-resources/hijri-converter" element={<HijriConverter />} />
            <Route path="/islamic-resources/adhkar" element={<Adhkar />} />
            <Route path="/islamic-resources/names-of-allah" element={<NamesOfAllah />} />
            <Route path="/islamic-resources/hadith-of-day" element={<HadithOfDay />} />
            <Route path="/islamic-resources/prayer-times" element={<PrayerTimes />} />
            <Route path="/islamic-resources/qibla-direction" element={<QiblaDirection />} />
            <Route path="/islamic-resources/ramadan-calendar" element={<RamadanCalendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/teachers" element={<TeacherDirectory />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/become-teacher" element={<BecomeTeacher />} />
            <Route path="/teach-with-us" element={<TeachWithUs />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/book-class/:id" element={<BookClass />} />
            <Route path="/azkaar" element={<Azkaar />} />
            <Route path="/azkaar/:categoryId" element={<AzkaarCategory />} />
            <Route path="/hadith" element={<HadithCollections />} />
            <Route path="/hadith/:collectionId" element={<HadithBook />} />
            <Route path="/hadith/:collectionId/:chapterSlug" element={<HadithChapter />} />
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
        <PWAInstallPrompt />
      </div>
    </AuthProvider>
  );
}

export default App;
