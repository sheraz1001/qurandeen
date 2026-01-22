import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/megamenu.css';

function Header({ darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (paths) => paths.some(p => location.pathname.startsWith(p));

  const handleMouseEnter = (dropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const quranTools = [
    { 
      path: '/quran-juz-browser', 
      label: 'Quran Juz Browser', 
      icon: '📖',
      description: 'Browse all 30 Juz of the Quran'
    },
    { 
      path: '/quran-mp3-audio', 
      label: 'Quran Audio', 
      icon: '🎧',
      description: '150+ reciters with full surah audio'
    },
  ];

  const surahs = [
    { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', meaning: 'The Opening', verses: 7, type: 'Meccan' },
    { number: 2, name: 'Al-Baqarah', arabic: 'البقرة', meaning: 'The Cow', verses: 286, type: 'Medinan' },
    { number: 3, name: 'Al-Imran', arabic: 'آل عمران', meaning: 'Family of Imran', verses: 200, type: 'Medinan' },
    { number: 4, name: 'An-Nisa', arabic: 'النساء', meaning: 'The Women', verses: 176, type: 'Medinan' },
    { number: 5, name: 'Al-Maidah', arabic: 'المائدة', meaning: 'The Table', verses: 120, type: 'Medinan' },
    { number: 6, name: 'Al-Anam', arabic: 'الأنعام', meaning: 'The Cattle', verses: 165, type: 'Meccan' },
    { number: 7, name: 'Al-Araf', arabic: 'الأعراف', meaning: 'The Heights', verses: 206, type: 'Meccan' },
    { number: 8, name: 'Al-Anfal', arabic: 'الأنفال', meaning: 'The Spoils of War', verses: 75, type: 'Medinan' },
    { number: 9, name: 'At-Tawbah', arabic: 'التوبة', meaning: 'The Repentance', verses: 129, type: 'Medinan' },
    { number: 10, name: 'Yunus', arabic: 'يونس', meaning: 'Jonah', verses: 109, type: 'Meccan' },
    { number: 11, name: 'Hud', arabic: 'هود', meaning: 'Hud', verses: 123, type: 'Meccan' },
    { number: 12, name: 'Yusuf', arabic: 'يوسف', meaning: 'Joseph', verses: 111, type: 'Meccan' },
    { number: 13, name: 'Ar-Rad', arabic: 'الرعد', meaning: 'The Thunder', verses: 43, type: 'Medinan' },
    { number: 14, name: 'Ibrahim', arabic: 'إبراهيم', meaning: 'Abraham', verses: 52, type: 'Meccan' },
    { number: 15, name: 'Al-Hijr', arabic: 'الحجر', meaning: 'The Rocky Tract', verses: 99, type: 'Meccan' },
    { number: 16, name: 'An-Nahl', arabic: 'النحل', meaning: 'The Bee', verses: 128, type: 'Meccan' },
    { number: 17, name: 'Al-Isra', arabic: 'الإسراء', meaning: 'The Night Journey', verses: 111, type: 'Meccan' },
    { number: 18, name: 'Al-Kahf', arabic: 'الكهف', meaning: 'The Cave', verses: 110, type: 'Meccan' },
    { number: 19, name: 'Maryam', arabic: 'مريم', meaning: 'Mary', verses: 98, type: 'Meccan' },
    { number: 20, name: 'Ta-Ha', arabic: 'طه', meaning: 'Ta-Ha', verses: 135, type: 'Meccan' },
    { number: 21, name: 'Al-Anbiya', arabic: 'الأنبياء', meaning: 'The Prophets', verses: 112, type: 'Meccan' },
    { number: 22, name: 'Al-Hajj', arabic: 'الحج', meaning: 'The Pilgrimage', verses: 78, type: 'Medinan' },
    { number: 23, name: 'Al-Muminun', arabic: 'المؤمنون', meaning: 'The Believers', verses: 118, type: 'Meccan' },
    { number: 24, name: 'An-Nur', arabic: 'النور', meaning: 'The Light', verses: 64, type: 'Medinan' },
    { number: 25, name: 'Al-Furqan', arabic: 'الفرقان', meaning: 'The Criterion', verses: 77, type: 'Meccan' },
    { number: 26, name: 'Ash-Shuara', arabic: 'الشعراء', meaning: 'The Poets', verses: 227, type: 'Meccan' },
    { number: 27, name: 'An-Naml', arabic: 'النمل', meaning: 'The Ant', verses: 93, type: 'Meccan' },
    { number: 28, name: 'Al-Qasas', arabic: 'القصص', meaning: 'The Stories', verses: 88, type: 'Meccan' },
    { number: 29, name: 'Al-Ankabut', arabic: 'العنكبوت', meaning: 'The Spider', verses: 69, type: 'Meccan' },
    { number: 30, name: 'Ar-Rum', arabic: 'الروم', meaning: 'The Romans', verses: 60, type: 'Meccan' },
    { number: 31, name: 'Luqman', arabic: 'لقمان', meaning: 'Luqman', verses: 34, type: 'Meccan' },
    { number: 32, name: 'As-Sajdah', arabic: 'السجدة', meaning: 'The Prostration', verses: 30, type: 'Meccan' },
    { number: 33, name: 'Al-Ahzab', arabic: 'الأحزاب', meaning: 'The Confederates', verses: 73, type: 'Medinan' },
    { number: 34, name: 'Saba', arabic: 'سبإ', meaning: 'Sheba', verses: 54, type: 'Meccan' },
    { number: 35, name: 'Fatir', arabic: 'فاطر', meaning: 'The Originator', verses: 45, type: 'Meccan' },
    { number: 36, name: 'Ya-Sin', arabic: 'يس', meaning: 'Ya-Sin', verses: 83, type: 'Meccan' },
    { number: 37, name: 'As-Saffat', arabic: 'الصافات', meaning: 'Those Ranged in Ranks', verses: 182, type: 'Meccan' },
    { number: 38, name: 'Sad', arabic: 'ص', meaning: 'Sad', verses: 88, type: 'Meccan' },
    { number: 39, name: 'Az-Zumar', arabic: 'الزمر', meaning: 'The Groups', verses: 75, type: 'Meccan' },
    { number: 40, name: 'Ghafir', arabic: 'غافر', meaning: 'The Forgiver', verses: 85, type: 'Meccan' },
    { number: 41, name: 'Fussilat', arabic: 'فصلت', meaning: 'Explained in Detail', verses: 54, type: 'Meccan' },
    { number: 42, name: 'Ash-Shura', arabic: 'الشورى', meaning: 'The Consultation', verses: 53, type: 'Meccan' },
    { number: 43, name: 'Az-Zukhruf', arabic: 'الزخرف', meaning: 'The Ornaments', verses: 89, type: 'Meccan' },
    { number: 44, name: 'Ad-Dukhan', arabic: 'الدخان', meaning: 'The Smoke', verses: 59, type: 'Meccan' },
    { number: 45, name: 'Al-Jathiyah', arabic: 'الجاثية', meaning: 'The Kneeling', verses: 37, type: 'Meccan' },
    { number: 46, name: 'Al-Ahqaf', arabic: 'الأحقاف', meaning: 'The Wind-Curved Sandhills', verses: 35, type: 'Meccan' },
    { number: 47, name: 'Muhammad', arabic: 'محمد', meaning: 'Muhammad', verses: 38, type: 'Medinan' },
    { number: 48, name: 'Al-Fath', arabic: 'الفتح', meaning: 'The Victory', verses: 29, type: 'Medinan' },
    { number: 49, name: 'Al-Hujurat', arabic: 'الحجرات', meaning: 'The Rooms', verses: 18, type: 'Medinan' },
    { number: 50, name: 'Qaf', arabic: 'ق', meaning: 'Qaf', verses: 45, type: 'Meccan' },
    { number: 51, name: 'Adh-Dhariyat', arabic: 'الذاريات', meaning: 'The Scatterers', verses: 60, type: 'Meccan' },
    { number: 52, name: 'At-Tur', arabic: 'الطور', meaning: 'The Mount', verses: 49, type: 'Meccan' },
    { number: 53, name: 'An-Najm', arabic: 'النجم', meaning: 'The Star', verses: 62, type: 'Meccan' },
    { number: 54, name: 'Al-Qamar', arabic: 'القمر', meaning: 'The Moon', verses: 55, type: 'Meccan' },
    { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', meaning: 'The Most Merciful', verses: 78, type: 'Medinan' },
    { number: 56, name: 'Al-Waqiah', arabic: 'الواقعة', meaning: 'The Inevitable', verses: 96, type: 'Meccan' },
    { number: 57, name: 'Al-Hadid', arabic: 'الحديد', meaning: 'The Iron', verses: 29, type: 'Medinan' },
    { number: 58, name: 'Al-Mujadila', arabic: 'المجادلة', meaning: 'The Pleading Woman', verses: 22, type: 'Medinan' },
    { number: 59, name: 'Al-Hashr', arabic: 'الحشر', meaning: 'The Exile', verses: 24, type: 'Medinan' },
    { number: 60, name: 'Al-Mumtahanah', arabic: 'الممتحنة', meaning: 'The Woman Tested', verses: 13, type: 'Medinan' },
    { number: 61, name: 'As-Saff', arabic: 'الصف', meaning: 'The Row', verses: 14, type: 'Medinan' },
    { number: 62, name: 'Al-Jumuah', arabic: 'الجمعة', meaning: 'Friday', verses: 11, type: 'Medinan' },
    { number: 63, name: 'Al-Munafiqun', arabic: 'المنافقون', meaning: 'The Hypocrites', verses: 11, type: 'Medinan' },
    { number: 64, name: 'At-Taghabun', arabic: 'التغابن', meaning: 'Mutual Disillusion', verses: 18, type: 'Medinan' },
    { number: 65, name: 'At-Talaq', arabic: 'الطلاق', meaning: 'The Divorce', verses: 12, type: 'Medinan' },
    { number: 66, name: 'At-Tahrim', arabic: 'التحريم', meaning: 'The Prohibition', verses: 12, type: 'Medinan' },
    { number: 67, name: 'Al-Mulk', arabic: 'الملك', meaning: 'The Sovereignty', verses: 30, type: 'Meccan' },
    { number: 68, name: 'Al-Qalam', arabic: 'القلم', meaning: 'The Pen', verses: 52, type: 'Meccan' },
    { number: 69, name: 'Al-Haqqah', arabic: 'الحاقة', meaning: 'The Inevitable', verses: 52, type: 'Meccan' },
    { number: 70, name: 'Al-Maarij', arabic: 'المعارج', meaning: 'The Ascending Stairways', verses: 44, type: 'Meccan' },
    { number: 71, name: 'Nuh', arabic: 'نوح', meaning: 'Noah', verses: 28, type: 'Meccan' },
    { number: 72, name: 'Al-Jinn', arabic: 'الجن', meaning: 'The Jinn', verses: 28, type: 'Meccan' },
    { number: 73, name: 'Al-Muzzammil', arabic: 'المزمل', meaning: 'The Enshrouded One', verses: 20, type: 'Meccan' },
    { number: 74, name: 'Al-Muddaththir', arabic: 'المدثر', meaning: 'The Cloaked One', verses: 56, type: 'Meccan' },
    { number: 75, name: 'Al-Qiyamah', arabic: 'القيامة', meaning: 'The Resurrection', verses: 40, type: 'Meccan' },
    { number: 76, name: 'Al-Insan', arabic: 'الإنسان', meaning: 'The Human', verses: 31, type: 'Medinan' },
    { number: 77, name: 'Al-Mursalat', arabic: 'المرسلات', meaning: 'Those Sent Forth', verses: 50, type: 'Meccan' },
    { number: 78, name: 'An-Naba', arabic: 'النبإ', meaning: 'The Tidings', verses: 40, type: 'Meccan' },
    { number: 79, name: 'An-Naziat', arabic: 'النازعات', meaning: 'Those Who Drag Forth', verses: 46, type: 'Meccan' },
    { number: 80, name: 'Abasa', arabic: 'عبس', meaning: 'He Frowned', verses: 42, type: 'Meccan' },
    { number: 81, name: 'At-Takwir', arabic: 'التكوير', meaning: 'The Overthrowing', verses: 29, type: 'Meccan' },
    { number: 82, name: 'Al-Infitar', arabic: 'الإنفطار', meaning: 'The Cleaving', verses: 19, type: 'Meccan' },
    { number: 83, name: 'Al-Mutaffifin', arabic: 'المطففين', meaning: 'The Defrauders', verses: 36, type: 'Meccan' },
    { number: 84, name: 'Al-Inshiqaq', arabic: 'الانشقاق', meaning: 'The Sundering', verses: 25, type: 'Meccan' },
    { number: 85, name: 'Al-Buruj', arabic: 'البروج', meaning: 'The Great Stars', verses: 22, type: 'Meccan' },
    { number: 86, name: 'At-Tariq', arabic: 'الطارق', meaning: 'The Night Comer', verses: 17, type: 'Meccan' },
    { number: 87, name: 'Al-Ala', arabic: 'الأعلى', meaning: 'The Most High', verses: 19, type: 'Meccan' },
    { number: 88, name: 'Al-Ghashiyah', arabic: 'الغاشية', meaning: 'The Overwhelming', verses: 26, type: 'Meccan' },
    { number: 89, name: 'Al-Fajr', arabic: 'الفجر', meaning: 'The Dawn', verses: 30, type: 'Meccan' },
    { number: 90, name: 'Al-Balad', arabic: 'البلد', meaning: 'The City', verses: 20, type: 'Meccan' },
    { number: 91, name: 'Ash-Shams', arabic: 'الشمس', meaning: 'The Sun', verses: 15, type: 'Meccan' },
    { number: 92, name: 'Al-Layl', arabic: 'الليل', meaning: 'The Night', verses: 21, type: 'Meccan' },
    { number: 93, name: 'Ad-Duhaa', arabic: 'الضحى', meaning: 'The Morning Hours', verses: 11, type: 'Meccan' },
    { number: 94, name: 'Ash-Sharh', arabic: 'الشرح', meaning: 'The Relief', verses: 8, type: 'Meccan' },
    { number: 95, name: 'At-Tin', arabic: 'التين', meaning: 'The Fig', verses: 8, type: 'Meccan' },
    { number: 96, name: 'Al-Alaq', arabic: 'العلق', meaning: 'The Clot', verses: 19, type: 'Meccan' },
    { number: 97, name: 'Al-Qadr', arabic: 'القدر', meaning: 'The Power', verses: 5, type: 'Meccan' },
    { number: 98, name: 'Al-Bayyinah', arabic: 'البينة', meaning: 'The Clear Proof', verses: 8, type: 'Medinan' },
    { number: 99, name: 'Az-Zalzalah', arabic: 'الزلزلة', meaning: 'The Earthquake', verses: 8, type: 'Medinan' },
    { number: 100, name: 'Al-Adiyat', arabic: 'العاديات', meaning: 'The Courser', verses: 11, type: 'Meccan' },
    { number: 101, name: 'Al-Qariah', arabic: 'القارعة', meaning: 'The Calamity', verses: 11, type: 'Meccan' },
    { number: 102, name: 'At-Takathur', arabic: 'التكاثر', meaning: 'The Rivalry', verses: 8, type: 'Meccan' },
    { number: 103, name: 'Al-Asr', arabic: 'العصر', meaning: 'The Time', verses: 3, type: 'Meccan' },
    { number: 104, name: 'Al-Humazah', arabic: 'الهمزة', meaning: 'The Traducer', verses: 9, type: 'Meccan' },
    { number: 105, name: 'Al-Fil', arabic: 'الفيل', meaning: 'The Elephant', verses: 5, type: 'Meccan' },
    { number: 106, name: 'Quraysh', arabic: 'قريش', meaning: 'Quraysh', verses: 4, type: 'Meccan' },
    { number: 107, name: 'Al-Maun', arabic: 'الماعون', meaning: 'The Small Kindnesses', verses: 7, type: 'Meccan' },
    { number: 108, name: 'Al-Kawthar', arabic: 'الكوثر', meaning: 'The Abundance', verses: 3, type: 'Meccan' },
    { number: 109, name: 'Al-Kafirun', arabic: 'الكافرون', meaning: 'The Disbelievers', verses: 6, type: 'Meccan' },
    { number: 110, name: 'An-Nasr', arabic: 'النصر', meaning: 'The Divine Support', verses: 3, type: 'Medinan' },
    { number: 111, name: 'Al-Masad', arabic: 'المسد', meaning: 'The Palm Fiber', verses: 5, type: 'Meccan' },
    { number: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', meaning: 'The Sincerity', verses: 4, type: 'Meccan' },
    { number: 113, name: 'Al-Falaq', arabic: 'الفلق', meaning: 'The Daybreak', verses: 5, type: 'Meccan' },
    { number: 114, name: 'An-Nas', arabic: 'الناس', meaning: 'Mankind', verses: 6, type: 'Meccan' },
  ];

  const resourceCategories = {
    collections: {
      title: 'Islamic Collections',
      icon: '📚',
      links: [
        { path: '/hadith', label: 'Hadith Collections', icon: '📕', description: '17 books with 50,000+ authentic hadiths' },
        { path: '/azkaar', label: 'Daily Azkaar & Duas', icon: '🤲', description: '134 categories from Hisnul Muslim' },
        { path: '/islamic-resources/names-of-allah', label: '99 Names of Allah', icon: '✨', description: 'Asma ul Husna with meanings' },
      ]
    },
    dailyContent: {
      title: 'Daily Inspiration',
      icon: '🌟',
      links: [
        { path: '/islamic-resources/verse-of-day', label: 'Verse of the Day', icon: '📖', description: 'Daily Quranic verse with reflection' },
        { path: '/islamic-resources/hadith-of-day', label: 'Hadith of the Day', icon: '📜', description: 'Daily authentic hadith selection' },
        { path: '/islamic-resources/adhkar', label: 'Morning & Evening Adhkar', icon: '🌅', description: 'Daily remembrance duas' },
      ]
    },
    prayerTools: {
      title: 'Prayer & Worship',
      icon: '🕌',
      links: [
        { path: '/islamic-resources/prayer-times', label: 'Prayer Times', icon: '🕐', description: 'Accurate times for your location' },
        { path: '/islamic-resources/qibla-direction', label: 'Qibla Direction', icon: '🧭', description: 'Find Qibla from anywhere' },
        { path: '/islamic-resources/ramadan-calendar', label: 'Ramadan Calendar', icon: '🌙', description: 'Suhoor & Iftar timings' },
      ]
    },
    calendarTools: {
      title: 'Calendar & Dates',
      icon: '📅',
      links: [
        { path: '/hijri-calendar', label: 'Hijri-Gregorian Calendar', icon: '📅', description: 'Full Islamic calendar with events' },
        { path: '/islamic-resources/hijri-converter', label: 'Date Converter', icon: '🔄', description: 'Convert between calendars' },
        { path: '/islamic-resources/historical-dates', label: 'Historical Dates', icon: '📜', description: 'Explore major Islamic events' },
      ]
    },
    creativeTools: {
      title: 'Creative Tools',
      icon: '🎨',
      links: [
        { path: '/islamic-resources/share-card', label: 'Quran Share Card', icon: '🖼️', description: 'Create beautiful verse images' },
        { path: '/islamic-ai-scholar', label: 'AI Islamic Scholar', icon: '🤖', description: 'Ask Islamic questions' },
      ]
    },
    content: {
      title: 'Content & Learning',
      icon: '📝',
      links: [
        { path: '/blogs', label: 'Islamic Blog', icon: '📝', description: 'Articles on Islamic knowledge' },
        { path: '/teachers', label: 'Find Quran Teachers', icon: '👨‍🏫', description: 'Learn from verified teachers' },
      ]
    }
  };

  const allResourceLinks = Object.values(resourceCategories).flatMap(cat => cat.links);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <div className="social-icons">
              <a href="https://www.facebook.com/qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://x.com/qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/qurandeencom/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@qurandeencom" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <span className="top-bar-text">Read, Listen & Learn the Holy Quran</span>
          </div>
          <div className="top-bar-right">
            <Link to="/bookmarks" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Bookmarks</span>
            </Link>
            <Link to="/settings" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Settings</span>
            </Link>
            <Link to="/contact" className="top-bar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Contact</span>
            </Link>
            <Link to="/donate" className="top-bar-link donate-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Donate</span>
            </Link>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="top-bar-link profile-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{user.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="top-bar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="top-bar-link signup-link">
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            <button 
              className="theme-toggle-top" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img 
              src="/logo.png" 
              alt="Quran Deen - Online Quran Explorer and AI Scholar" 
              className="logo-image"
            />
          </Link>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>

              <li 
                className={`nav-item has-dropdown ${activeDropdown === 'quran' ? 'dropdown-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('quran')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`nav-link dropdown-trigger ${isActiveGroup(['/quran-juz-browser', '/quran-mp3-audio', '/surah']) ? 'active' : ''}`}
                  aria-expanded={activeDropdown === 'quran'}
                  aria-haspopup="true"
                >
                  Quran
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="mega-dropdown quran-mega-dropdown">
                  <div className="mega-dropdown-content quran-mega-content">
                    <div className="quran-mega-header">
                      <div className="quran-mega-title">
                        <span className="quran-mega-icon">📖</span>
                        <div>
                          <h3>The Holy Quran</h3>
                          <p>114 Surahs • 6,236 Ayahs • 30 Juz</p>
                        </div>
                      </div>
                      <div className="quran-mega-tools">
                        {quranTools.map((tool) => (
                          <Link 
                            key={tool.path}
                            to={tool.path}
                            className="quran-tool-btn"
                          >
                            <span>{tool.icon}</span>
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="surah-grid-container">
                      <div className="surah-grid">
                        {surahs.map((surah) => (
                          <Link 
                            key={surah.number}
                            to={`/surah/${surah.number}`}
                            className="surah-card"
                          >
                            <span className="surah-number">{surah.number}</span>
                            <div className="surah-info">
                              <span className="surah-name">{surah.name}</span>
                              <span className="surah-arabic">{surah.arabic}</span>
                            </div>
                            <div className="surah-meta">
                              <span className={`surah-type ${surah.type.toLowerCase()}`}>{surah.type}</span>
                              <span className="surah-verses">{surah.verses} Ayahs</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="quran-mega-footer">
                      <Link to="/" className="view-all-link">
                        View Full Quran Index
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li 
                className={`nav-item has-dropdown ${activeDropdown === 'resources' ? 'dropdown-open' : ''}`}
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/islamic-resources"
                  className={`nav-link dropdown-trigger ${isActiveGroup(['/islamic-resources', '/azkaar', '/blogs', '/hadith', '/hijri-calendar']) ? 'active' : ''}`}
                  aria-expanded={activeDropdown === 'resources'}
                  aria-haspopup="true"
                >
                  Resources
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </Link>
                <div className="mega-dropdown mega-dropdown-full">
                  <div className="mega-dropdown-content mega-grid-layout">
                    {Object.entries(resourceCategories).map(([key, category]) => (
                      <div key={key} className="mega-dropdown-column">
                        <h3 className="mega-section-title">
                          <span className="title-icon">{category.icon}</span>
                          {category.title}
                        </h3>
                        <div className="mega-links">
                          {category.links.map((link) => (
                            <Link 
                              key={link.path}
                              to={link.path} 
                              className={`mega-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                              <span className="mega-link-icon">{link.icon}</span>
                              <div className="mega-link-content">
                                <span className="mega-link-title">{link.label}</span>
                                <span className="mega-link-desc">{link.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mega-dropdown-footer-full">
                      <Link to="/islamic-resources" className="view-all-link">
                        View All Islamic Resources
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link 
                  to="/islamic-ai-scholar" 
                  className={`nav-link ${isActive('/islamic-ai-scholar') ? 'active' : ''}`}
                >
                  AI Scholar
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  to="/teachers" 
                  className={`nav-link nav-link-highlight ${isActiveGroup(['/teachers', '/teach-with-us', '/become-teacher']) ? 'active' : ''}`}
                >
                  Quran Classes
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search ayahs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>

            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="mobile-nav-section">
              <span className="mobile-nav-section-title">Quran</span>
              {quranLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`mobile-nav-link mobile-nav-sublink ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </li>
            {Object.entries(resourceCategories).map(([key, category]) => (
              <li key={key} className="mobile-nav-section">
                <span className="mobile-nav-section-title">{category.icon} {category.title}</span>
                {category.links.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`mobile-nav-link mobile-nav-sublink ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </li>
            ))}
            <li>
              <Link 
                to="/islamic-ai-scholar" 
                className={`mobile-nav-link ${isActive('/islamic-ai-scholar') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Scholar
              </Link>
            </li>
            <li>
              <Link 
                to="/teachers" 
                className={`mobile-nav-link highlight ${isActive('/teachers') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Quran Classes
              </Link>
            </li>
            <li>
              <Link 
                to="/bookmarks" 
                className={`mobile-nav-link ${isActive('/bookmarks') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Bookmarks
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`mobile-nav-link ${isActive('/settings') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </li>
          </ul>
          <form className="mobile-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search the Quran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">Search</button>
          </form>
          <div className="mobile-auth">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="mobile-auth-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-auth-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="mobile-auth-link signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
