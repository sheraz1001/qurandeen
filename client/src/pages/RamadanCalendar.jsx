import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import './RamadanCalendar.css';

export default function RamadanCalendar() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [ramadanData, setRamadanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(2);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ramadanInfo, setRamadanInfo] = useState(null);
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  const [todayIndex, setTodayIndex] = useState(-1);

  const CALCULATION_METHODS = [
    { id: 0, name: 'Shia Ithna-Ansari' },
    { id: 1, name: 'University of Islamic Sciences, Karachi' },
    { id: 2, name: 'Islamic Society of North America (ISNA)' },
    { id: 3, name: 'Muslim World League' },
    { id: 4, name: 'Umm Al-Qura University, Makkah' },
    { id: 5, name: 'Egyptian General Authority of Survey' },
    { id: 8, name: 'Gulf Region' },
    { id: 9, name: 'Kuwait' },
    { id: 10, name: 'Qatar' },
    { id: 13, name: 'Diyanet Isleri Baskanligi, Turkey' }
  ];

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
      fetchRamadanCalendar();
    }
  }, [location, method, selectedYear]);

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

  const fetchRamadanCalendar = async () => {
    if (!location) return;
    setLoading(true);
    
    try {
      const hijriResponse = await fetch(
        `https://api.aladhan.com/v1/gToH?date=01-03-${selectedYear}`
      );
      const hijriData = await hijriResponse.json();
      const currentHijriYear = hijriData.data?.hijri?.year || 1446;
      
      let url;
      if (location.lat && location.lng) {
        url = `https://api.aladhan.com/v1/hijriCalendar/${currentHijriYear}/9?latitude=${location.lat}&longitude=${location.lng}&method=${method}`;
      } else {
        url = `https://api.aladhan.com/v1/hijriCalendarByCity/${currentHijriYear}/9?city=${location.city}&country=${location.country}&method=${method}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setRamadanData(data.data);
        
        if (data.data.length > 0) {
          const firstDay = data.data[0];
          const lastDay = data.data[data.data.length - 1];
          setRamadanInfo({
            startDate: firstDay.date.gregorian.date,
            endDate: lastDay.date.gregorian.date,
            hijriYear: currentHijriYear,
            totalDays: data.data.length
          });
        }
        
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        const idx = data.data.findIndex(day => day.date.gregorian.date === todayStr);
        setTodayIndex(idx);
        
        setError(null);
      } else {
        setError('Failed to fetch Ramadan calendar');
      }
    } catch (err) {
      console.error('Error fetching Ramadan calendar:', err);
      setError('Failed to fetch Ramadan calendar. Please try again.');
    }
    
    setLoading(false);
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
  };

  const cleanTime = (time) => {
    if (!time) return '';
    return time.replace(/\s*\(.*\)/, '').trim();
  };

  const formatTime = (time) => {
    if (!time) return '';
    const clean = cleanTime(time);
    const [hours, minutes] = clean.split(':');
    const h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  const calculateFastingDuration = (fajr, maghrib) => {
    if (!fajr || !maghrib) return '';
    const cleanFajr = cleanTime(fajr);
    const cleanMaghrib = cleanTime(maghrib);
    const [fH, fM] = cleanFajr.split(':').map(Number);
    const [mH, mM] = cleanMaghrib.split(':').map(Number);
    const fajrMinutes = fH * 60 + fM;
    const maghribMinutes = mH * 60 + mM;
    const diff = maghribMinutes - fajrMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Islamic Resources', href: '/islamic-resources' },
    { name: 'Ramadan Calendar' }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Ramadan Calendar & Fasting Times - QuranDeen",
      "description": "Complete Ramadan calendar with Suhoor and Iftar times for any location. Plan your fasting schedule for the holy month.",
      "url": "https://qurandeen.com/islamic-resources/ramadan-calendar",
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
    <div className="ramadan-calendar-page">
      <SEO
        title="Ramadan Calendar - Suhoor & Iftar Times | QuranDeen"
        description="Complete Ramadan calendar with accurate Suhoor (Fajr) and Iftar (Maghrib) times for your location. Plan your fasting schedule for the blessed month."
        keywords="ramadan calendar, suhoor time, iftar time, ramadan fasting times, ramadan timetable, ramadan schedule, sehri time"
        url="https://qurandeen.com/islamic-resources/ramadan-calendar"
        schema={schema}
      />

      <HeroAnimated
        icon="🌙"
        title="Ramadan Calendar"
        subtitle="Suhoor & Iftar times for the blessed month"
        breadcrumbs={breadcrumbs}
      />

      <div className="ramadan-container">
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

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Ramadan calendar...</p>
          </div>
        )}

        {!loading && ramadanData.length > 0 && (
          <>
            <div className="location-header">
              <div className="location-info">
                <span className="location-icon">📍</span>
                <span className="location-name">{locationName}</span>
                <button onClick={getLocation} className="refresh-btn" title="Refresh Location">
                  🔄
                </button>
              </div>
            </div>

            {ramadanInfo && (
              <div className="ramadan-info-banner">
                <div className="ramadan-title">
                  <span className="moon-icon">🌙</span>
                  Ramadan {ramadanInfo.hijriYear} AH
                </div>
                <div className="ramadan-dates">
                  {ramadanInfo.startDate} - {ramadanInfo.endDate}
                </div>
                <div className="ramadan-stats">
                  <div className="stat">
                    <span className="stat-value">{ramadanInfo.totalDays}</span>
                    <span className="stat-label">Days</span>
                  </div>
                  {todayIndex >= 0 && (
                    <div className="stat highlight">
                      <span className="stat-value">Day {todayIndex + 1}</span>
                      <span className="stat-label">Today</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {todayIndex >= 0 && ramadanData[todayIndex] && (
              <div className="today-times-card">
                <div className="today-header">
                  <h3>Today's Fasting Times</h3>
                  <span className="today-date">
                    {ramadanData[todayIndex].date.gregorian.weekday.en}, {ramadanData[todayIndex].date.readable}
                  </span>
                </div>
                <div className="today-times">
                  <div className="time-block suhoor">
                    <div className="time-icon">🌅</div>
                    <div className="time-label">Suhoor Ends (Fajr)</div>
                    <div className="time-value">{formatTime(ramadanData[todayIndex].timings.Fajr)}</div>
                  </div>
                  <div className="fasting-duration">
                    <span className="duration-icon">⏱️</span>
                    <span>{calculateFastingDuration(ramadanData[todayIndex].timings.Fajr, ramadanData[todayIndex].timings.Maghrib)}</span>
                  </div>
                  <div className="time-block iftar">
                    <div className="time-icon">🌇</div>
                    <div className="time-label">Iftar (Maghrib)</div>
                    <div className="time-value">{formatTime(ramadanData[todayIndex].timings.Maghrib)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-row">
              <div className="setting-item">
                <label>Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() + i - 1;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
              <div className="setting-item">
                <label>Calculation Method</label>
                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(parseInt(e.target.value));
                    localStorage.setItem('prayerMethod', e.target.value);
                  }}
                >
                  {CALCULATION_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="calendar-table-wrapper">
              <table className="ramadan-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Suhoor Ends</th>
                    <th>Iftar</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {ramadanData.map((day, index) => (
                    <tr key={index} className={index === todayIndex ? 'today' : ''}>
                      <td className="day-cell">
                        <span className="ramadan-day">{index + 1}</span>
                      </td>
                      <td className="date-cell">
                        <div className="gregorian">{day.date.gregorian.date}</div>
                        <div className="weekday">{day.date.gregorian.weekday.en.slice(0, 3)}</div>
                      </td>
                      <td className="time-cell suhoor">{formatTime(day.timings.Fajr)}</td>
                      <td className="time-cell iftar">{formatTime(day.timings.Maghrib)}</td>
                      <td className="duration-cell">
                        {calculateFastingDuration(day.timings.Fajr, day.timings.Maghrib)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ramadan-tips">
              <h3>Ramadan Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <span className="tip-icon">🍽️</span>
                  <h4>Suhoor</h4>
                  <p>Eat a nutritious pre-dawn meal. Include complex carbs, protein, and plenty of water.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🌙</span>
                  <h4>Iftar</h4>
                  <p>Break your fast with dates and water following the Sunnah, then pray Maghrib before the main meal.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">📖</span>
                  <h4>Quran</h4>
                  <p>Aim to complete the Quran during Ramadan. Read a Juz daily to finish by Eid.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🤲</span>
                  <h4>Dua</h4>
                  <p>Make dua before breaking your fast - it's a time when prayers are especially accepted.</p>
                </div>
              </div>
            </div>

            <div className="quick-links">
              <Link to="/islamic-resources/prayer-times" className="quick-link-card">
                <span className="icon">🕌</span>
                <span>Prayer Times</span>
              </Link>
              <Link to="/islamic-resources/qibla-direction" className="quick-link-card">
                <span className="icon">🧭</span>
                <span>Qibla Direction</span>
              </Link>
              <Link to="/azkaar" className="quick-link-card">
                <span className="icon">📿</span>
                <span>Daily Duas</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
