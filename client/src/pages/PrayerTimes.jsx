import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import './PrayerTimes.css';

const CALCULATION_METHODS = [
  { id: 0, name: 'Shia Ithna-Ansari' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, name: 'Union Organization Islamic de France' },
  { id: 13, name: 'Diyanet Isleri Baskanligi, Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
  { id: 15, name: 'Moonsighting Committee Worldwide' }
];

const PRAYER_NAMES = {
  Fajr: { arabic: 'الفجر', icon: '🌙' },
  Sunrise: { arabic: 'الشروق', icon: '🌅' },
  Dhuhr: { arabic: 'الظهر', icon: '☀️' },
  Asr: { arabic: 'العصر', icon: '🌤️' },
  Maghrib: { arabic: 'المغرب', icon: '🌇' },
  Isha: { arabic: 'العشاء', icon: '🌃' }
};

export default function PrayerTimes() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [monthlyTimes, setMonthlyTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(2);
  const [viewMode, setViewMode] = useState('today');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');

  useEffect(() => {
    const savedMethod = localStorage.getItem('prayerMethod');
    if (savedMethod) setMethod(parseInt(savedMethod));
    
    const savedLocation = localStorage.getItem('prayerLocation');
    if (savedLocation) {
      const loc = JSON.parse(savedLocation);
      setLocation(loc);
      setLocationName(loc.name || '');
    } else {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
      if (viewMode === 'monthly') {
        fetchMonthlyTimes();
      }
    }
  }, [location, method, viewMode]);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
      const interval = setInterval(calculateNextPrayer, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            loc.name = `${data.city || data.locality}, ${data.countryName}`;
            setLocationName(loc.name);
          } catch (e) {
            loc.name = 'Your Location';
            setLocationName(loc.name);
          }
          
          setLocation(loc);
          localStorage.setItem('prayerLocation', JSON.stringify(loc));
          setLoading(false);
        },
        (err) => {
          setError('Location access denied. Please enter your city manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const fetchPrayerTimes = async () => {
    if (!location) return;
    
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      let url;
      if (location.lat && location.lng) {
        url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`;
      } else {
        url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${location.city}&country=${location.country}&method=${method}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        setError(null);
      } else {
        setError('Failed to fetch prayer times');
      }
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again.');
    }
  };

  const fetchMonthlyTimes = async () => {
    if (!location) return;
    
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      
      let url;
      if (location.lat && location.lng) {
        url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lng}&method=${method}`;
      } else {
        url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${location.city}&country=${location.country}&method=${method}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200) {
        setMonthlyTimes(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch monthly times:', err);
    }
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return [0, 0];
    const cleanTime = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [hours, minutes] = cleanTime.split(':').map(Number);
    return [hours || 0, minutes || 0];
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    
    const now = new Date();
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const prayer of prayers) {
      const [hours, minutes] = parseTime(prayerTimes.timings[prayer]);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);
      
      if (prayerTime > now) {
        setNextPrayer(prayer);
        const diff = prayerTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        return;
      }
    }
    
    setNextPrayer('Fajr');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = parseTime(prayerTimes.timings.Fajr);
    tomorrow.setHours(hours, minutes, 0, 0);
    const diff = tomorrow - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
  };

  const handleManualLocation = async (e) => {
    e.preventDefault();
    if (!manualCity || !manualCountry) return;
    
    setLoading(true);
    const loc = { city: manualCity, country: manualCountry, name: `${manualCity}, ${manualCountry}` };
    setLocation(loc);
    setLocationName(loc.name);
    localStorage.setItem('prayerLocation', JSON.stringify(loc));
    setError(null);
    setLoading(false);
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    localStorage.setItem('prayerMethod', newMethod.toString());
  };

  const formatTime = (time) => {
    if (!time) return '';
    const cleanTime = time.replace(/\s*\(.*\)/, '').trim();
    const [hours, minutes] = cleanTime.split(':');
    const h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Islamic Resources', href: '/islamic-resources' },
    { name: 'Prayer Times' }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Prayer Times Calculator - QuranDeen",
      "description": "Get accurate Islamic prayer times for any location worldwide. Features include Fajr, Dhuhr, Asr, Maghrib, and Isha times with multiple calculation methods.",
      "url": "https://qurandeen.com/islamic-resources/prayer-times",
      "applicationCategory": "ReligiousApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ];

  return (
    <div className="prayer-times-page">
      <SEO
        title="Prayer Times - Salah Times for Any Location | QuranDeen"
        description="Get accurate Islamic prayer times for Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha for any location worldwide. Multiple calculation methods available."
        keywords="prayer times, salah times, namaz times, fajr time, dhuhr time, asr time, maghrib time, isha time, islamic prayer times"
        url="https://qurandeen.com/islamic-resources/prayer-times"
        schema={schema}
      />

      <HeroAnimated
        icon="🕌"
        title="Prayer Times"
        subtitle="Accurate Salah times for your location"
        breadcrumbs={breadcrumbs}
      />

      <div className="prayer-times-container">
        {error && !location && (
          <div className="location-form-card">
            <h3>Enter Your Location</h3>
            <p>{error}</p>
            <form onSubmit={handleManualLocation}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City (e.g., London)"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Country (e.g., UK)"
                  value={manualCountry}
                  onChange={(e) => setManualCountry(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">Get Times</button>
              </div>
            </form>
            <button onClick={getLocation} className="btn-secondary">
              <span>📍</span> Try Location Again
            </button>
          </div>
        )}

        {loading && !prayerTimes && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Getting your prayer times...</p>
          </div>
        )}

        {prayerTimes && (
          <>
            <div className="location-header">
              <div className="location-info">
                <span className="location-icon">📍</span>
                <span className="location-name">{locationName}</span>
                <button onClick={getLocation} className="refresh-btn" title="Refresh Location">
                  🔄
                </button>
              </div>
              <div className="date-info">
                <div className="gregorian-date">
                  {prayerTimes.date.readable}
                </div>
                <div className="hijri-date">
                  {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} AH
                </div>
              </div>
            </div>

            {nextPrayer && (
              <div className="next-prayer-card">
                <div className="next-prayer-label">Next Prayer</div>
                <div className="next-prayer-name">
                  <span className="prayer-icon">{PRAYER_NAMES[nextPrayer]?.icon}</span>
                  <span>{nextPrayer}</span>
                  <span className="arabic-name">{PRAYER_NAMES[nextPrayer]?.arabic}</span>
                </div>
                <div className="countdown-timer">{countdown}</div>
                <div className="next-prayer-time">
                  at {formatTime(prayerTimes.timings[nextPrayer])}
                </div>
              </div>
            )}

            <div className="view-toggle">
              <button
                className={viewMode === 'today' ? 'active' : ''}
                onClick={() => setViewMode('today')}
              >
                Today
              </button>
              <button
                className={viewMode === 'monthly' ? 'active' : ''}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
            </div>

            {viewMode === 'today' && (
              <div className="prayer-times-grid">
                {Object.entries(PRAYER_NAMES).map(([prayer, { arabic, icon }]) => (
                  <div
                    key={prayer}
                    className={`prayer-time-card ${nextPrayer === prayer ? 'next' : ''}`}
                  >
                    <div className="prayer-icon">{icon}</div>
                    <div className="prayer-details">
                      <div className="prayer-name">{prayer}</div>
                      <div className="prayer-arabic">{arabic}</div>
                    </div>
                    <div className="prayer-time">
                      {formatTime(prayerTimes.timings[prayer])}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'monthly' && monthlyTimes.length > 0 && (
              <div className="monthly-table-wrapper">
                <table className="monthly-times-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Fajr</th>
                      <th>Sunrise</th>
                      <th>Dhuhr</th>
                      <th>Asr</th>
                      <th>Maghrib</th>
                      <th>Isha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTimes.map((day, index) => (
                      <tr key={index} className={new Date().getDate() === index + 1 ? 'today' : ''}>
                        <td>
                          <div className="date-cell">
                            <span className="day-num">{day.date.gregorian.day}</span>
                            <span className="day-name">{day.date.gregorian.weekday.en.slice(0, 3)}</span>
                          </div>
                        </td>
                        <td>{formatTime(day.timings.Fajr)}</td>
                        <td>{formatTime(day.timings.Sunrise)}</td>
                        <td>{formatTime(day.timings.Dhuhr)}</td>
                        <td>{formatTime(day.timings.Asr)}</td>
                        <td>{formatTime(day.timings.Maghrib)}</td>
                        <td>{formatTime(day.timings.Isha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="settings-section">
              <h3>Calculation Method</h3>
              <select
                value={method}
                onChange={(e) => handleMethodChange(parseInt(e.target.value))}
                className="method-select"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="quick-links">
              <Link to="/islamic-resources/qibla-direction" className="quick-link-card">
                <span className="icon">🧭</span>
                <span>Qibla Direction</span>
              </Link>
              <Link to="/islamic-resources/ramadan-calendar" className="quick-link-card">
                <span className="icon">🌙</span>
                <span>Ramadan Calendar</span>
              </Link>
              <Link to="/islamic-resources/hijri-calendar" className="quick-link-card">
                <span className="icon">📅</span>
                <span>Hijri Calendar</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
