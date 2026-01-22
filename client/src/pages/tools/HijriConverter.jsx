import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../../styles/hijri-calendar.css';
import '../../styles/hijri-converter.css';

const HIJRI_MONTHS = [
  { id: 1, name: 'Muharram', arabic: 'محرم', days: 30 },
  { id: 2, name: 'Safar', arabic: 'صفر', days: 29 },
  { id: 3, name: 'Rabi al-Awwal', arabic: 'ربيع الأول', days: 30 },
  { id: 4, name: 'Rabi al-Thani', arabic: 'ربيع الثاني', days: 29 },
  { id: 5, name: 'Jumada al-Awwal', arabic: 'جمادى الأولى', days: 30 },
  { id: 6, name: 'Jumada al-Thani', arabic: 'جمادى الثانية', days: 29 },
  { id: 7, name: 'Rajab', arabic: 'رجب', days: 30 },
  { id: 8, name: 'Shaban', arabic: 'شعبان', days: 29 },
  { id: 9, name: 'Ramadan', arabic: 'رمضان', days: 30 },
  { id: 10, name: 'Shawwal', arabic: 'شوال', days: 29 },
  { id: 11, name: 'Dhul Qadah', arabic: 'ذو القعدة', days: 30 },
  { id: 12, name: 'Dhul Hijjah', arabic: 'ذو الحجة', days: 29 },
];

const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year', date: { day: 1, month: 1 }, hijri: '1 Muharram', description: 'Beginning of the Islamic calendar year', icon: '🌙', category: 'holy' },
  { name: 'Day of Ashura', date: { day: 10, month: 1 }, hijri: '10 Muharram', description: 'Day of fasting, commemorating Moses and the Israelites', icon: '🤲', category: 'fasting' },
  { name: 'Mawlid al-Nabi', date: { day: 12, month: 3 }, hijri: '12 Rabi al-Awwal', description: "Prophet Muhammad's (PBUH) birthday celebration", icon: '🕌', category: 'celebration' },
  { name: 'Isra and Miraj', date: { day: 27, month: 7 }, hijri: '27 Rajab', description: 'Night Journey and Ascension of Prophet Muhammad (PBUH)', icon: '✨', category: 'miracle' },
  { name: 'Shab-e-Barat', date: { day: 15, month: 8 }, hijri: '15 Shaban', description: 'Night of Fortune and Forgiveness', icon: '🌟', category: 'holy' },
  { name: 'First of Ramadan', date: { day: 1, month: 9 }, hijri: '1 Ramadan', description: 'Beginning of the blessed month of fasting', icon: '🌙', category: 'fasting' },
  { name: 'Laylat al-Qadr', date: { day: 27, month: 9 }, hijri: '27 Ramadan', description: 'Night of Power - better than 1000 months', icon: '⭐', category: 'holy' },
  { name: 'Eid al-Fitr', date: { day: 1, month: 10 }, hijri: '1 Shawwal', description: 'Festival of Breaking the Fast', icon: '🎉', category: 'eid' },
  { name: 'Day of Arafah', date: { day: 9, month: 12 }, hijri: '9 Dhul Hijjah', description: 'Most important day of Hajj pilgrimage', icon: '🕋', category: 'hajj' },
  { name: 'Eid al-Adha', date: { day: 10, month: 12 }, hijri: '10 Dhul Hijjah', description: 'Festival of Sacrifice', icon: '🐑', category: 'eid' },
  { name: 'Days of Tashreeq', date: { day: 11, month: 12 }, hijri: '11-13 Dhul Hijjah', description: 'Days of eating, drinking, and remembering Allah', icon: '🍖', category: 'celebration' },
];

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function HijriConverter() {
  const [gregorianDate, setGregorianDate] = useState(new Date().toISOString().split('T')[0]);
  const [hijriDate, setHijriDate] = useState({ day: 1, month: 1, year: 1446 });
  const [activeTab, setActiveTab] = useState('converter');
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState(null);
  const [historicalYear, setHistoricalYear] = useState('');
  const [historicalResult, setHistoricalResult] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [conversionDirection, setConversionDirection] = useState('g2h');

  const gregorianToHijri = (gDate) => {
    const date = new Date(gDate);
    const jd = Math.floor((date.getTime() - new Date(Date.UTC(1970, 0, 1)).getTime()) / 86400000) + 2440588;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const remaining = l - 10631 * n + 354;
    const j = Math.floor((10985 - remaining) / 5316) * Math.floor((50 * remaining) / 17719) + 
              Math.floor(remaining / 5670) * Math.floor((43 * remaining) / 15238);
    const adjustedRemaining = remaining - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - 
                               Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * adjustedRemaining) / 709);
    const day = adjustedRemaining - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    return { day, month, year };
  };

  const hijriToGregorian = (hDate) => {
    const { day, month, year } = hDate;
    const jd = Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - 
               Math.floor((month - 1) / 2) + day + 1948440 - 385;
    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const remaining = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (remaining + 1)) / 1461001);
    const adjusted = remaining - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * adjusted) / 2447);
    const gDay = adjusted - Math.floor((2447 * j) / 80);
    const finalAdjusted = Math.floor(j / 11);
    const gMonth = j + 2 - 12 * finalAdjusted;
    const gYear = 100 * (n - 49) + i + finalAdjusted;
    return new Date(gYear, gMonth - 1, gDay).toISOString().split('T')[0];
  };

  const calculateAge = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const today = new Date();
    const hijriBirth = gregorianToHijri(birthDate);
    const hijriToday = gregorianToHijri(today.toISOString().split('T')[0]);

    let gregYears = today.getFullYear() - birth.getFullYear();
    let gregMonths = today.getMonth() - birth.getMonth();
    let gregDays = today.getDate() - birth.getDate();

    if (gregDays < 0) {
      gregMonths--;
      gregDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (gregMonths < 0) {
      gregYears--;
      gregMonths += 12;
    }

    let hijriYears = hijriToday.year - hijriBirth.year;
    let hijriMonths = hijriToday.month - hijriBirth.month;
    let hijriDays = hijriToday.day - hijriBirth.day;

    if (hijriDays < 0) {
      hijriMonths--;
      hijriDays += 30;
    }
    if (hijriMonths < 0) {
      hijriYears--;
      hijriMonths += 12;
    }

    const totalGregorianDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    const totalHijriDays = Math.floor(totalGregorianDays * (354 / 365.25));

    setAgeResult({
      gregorian: { years: gregYears, months: gregMonths, days: gregDays },
      hijri: { years: hijriYears, months: hijriMonths, days: hijriDays },
      totalGregorianDays,
      totalHijriDays,
      hijriBirthDate: hijriBirth
    });
  };

  const calculateHistoricalDate = () => {
    if (!historicalYear) return;
    const year = parseInt(historicalYear);
    if (year > 0 && year <= 2000) {
      const hijriDate = { day: 1, month: 1, year };
      const gregDate = hijriToGregorian(hijriDate);
      const date = new Date(gregDate);
      setHistoricalResult({
        hijriYear: year,
        gregorianYear: date.getFullYear(),
        fullDate: gregDate,
        era: date.getFullYear() < 0 ? 'BCE' : 'CE'
      });
    }
  };

  const handleGregorianChange = (e) => {
    const newDate = e.target.value;
    setGregorianDate(newDate);
    if (conversionDirection === 'g2h') {
      setHijriDate(gregorianToHijri(newDate));
    }
  };

  const handleHijriChange = (field, value) => {
    const newHijri = { ...hijriDate, [field]: parseInt(value) || 1 };
    setHijriDate(newHijri);
    if (conversionDirection === 'h2g') {
      try {
        setGregorianDate(hijriToGregorian(newHijri));
      } catch (e) {
        console.error('Invalid date');
      }
    }
  };

  const swapDirection = () => {
    setConversionDirection(prev => prev === 'g2h' ? 'h2g' : 'g2h');
  };

  const getEventGregorianDate = (event) => {
    const currentHijriYear = hijriDate.year;
    const eventHijri = { ...event.date, year: currentHijriYear };
    try {
      return hijriToGregorian(eventHijri);
    } catch {
      return null;
    }
  };

  const formatGregorianDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    setHijriDate(gregorianToHijri(gregorianDate));
  }, []);

  const getCurrentHijriMonth = () => HIJRI_MONTHS.find(m => m.id === hijriDate.month) || HIJRI_MONTHS[0];

  return (
    <div className="hijri-converter-page">
      <Helmet>
        <title>Hijri-Gregorian Date Converter - Islamic Calendar Tool | QuranDeen</title>
        <meta name="description" content="Advanced Hijri to Gregorian date converter. Calculate Islamic age, find important Islamic dates, explore the lunar calendar. Free Islamic calendar converter tool." />
      </Helmet>

      <div className="hijri-hero converter-hero-style">
        <div className="hijri-hero-content">
          <h1>Hijri-Gregorian Converter</h1>
          <p>Convert between Islamic Hijri and Gregorian calendars, calculate your Islamic age, and explore important Islamic dates</p>
          
          <div className="today-display">
            <div className="today-gregorian">
              <span className="today-label">Gregorian</span>
              <span className="today-date">{formatGregorianDate(gregorianDate)}</span>
            </div>
            <div className="today-divider">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16l5-5 5 5M7 8l5 5 5-5" />
              </svg>
            </div>
            <div className="today-hijri">
              <span className="today-label">Hijri</span>
              <span className="today-date">{hijriDate.day} {getCurrentHijriMonth().name} {hijriDate.year} AH</span>
              <span className="today-arabic">{getCurrentHijriMonth().arabic}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="converter-container">
        <div className="tool-tabs">
          <button 
            className={`tool-tab ${activeTab === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveTab('converter')}
          >
            <span>🔄</span> Date Converter
          </button>
          <button 
            className={`tool-tab ${activeTab === 'age' ? 'active' : ''}`}
            onClick={() => setActiveTab('age')}
          >
            <span>🎂</span> Age Calculator
          </button>
          <button 
            className={`tool-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span>📆</span> Islamic Events
          </button>
          <button 
            className={`tool-tab ${activeTab === 'historical' ? 'active' : ''}`}
            onClick={() => setActiveTab('historical')}
          >
            <span>📜</span> Historical Dates
          </button>
        </div>

        <div className="tool-content">
          {activeTab === 'converter' && (
            <div className="converter-tab">
              <div className="direction-toggle">
                <button 
                  className={`dir-btn ${conversionDirection === 'g2h' ? 'active' : ''}`}
                  onClick={() => setConversionDirection('g2h')}
                >
                  Gregorian → Hijri
                </button>
                <button 
                  className={`dir-btn ${conversionDirection === 'h2g' ? 'active' : ''}`}
                  onClick={() => setConversionDirection('h2g')}
                >
                  Hijri → Gregorian
                </button>
              </div>

              <div className="converter-cards">
                <div className={`date-card ${conversionDirection === 'g2h' ? 'input-card' : 'output-card'}`}>
                  <div className="card-header">
                    <span className="card-icon">🌍</span>
                    <h3>Gregorian Date</h3>
                    {conversionDirection === 'g2h' && <span className="input-badge">Input</span>}
                  </div>
                  <div className="card-content">
                    <input 
                      type="date" 
                      value={gregorianDate}
                      onChange={handleGregorianChange}
                      disabled={conversionDirection !== 'g2h'}
                      className="date-input"
                    />
                    <div className="date-display">
                      {formatGregorianDate(gregorianDate)}
                    </div>
                  </div>
                </div>

                <div className="swap-button" onClick={swapDirection}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
                  </svg>
                </div>

                <div className={`date-card ${conversionDirection === 'h2g' ? 'input-card' : 'output-card'}`}>
                  <div className="card-header">
                    <span className="card-icon">🌙</span>
                    <h3>Hijri Date</h3>
                    {conversionDirection === 'h2g' && <span className="input-badge">Input</span>}
                  </div>
                  <div className="card-content">
                    <div className="hijri-selectors">
                      <select 
                        value={hijriDate.day}
                        onChange={(e) => handleHijriChange('day', e.target.value)}
                        disabled={conversionDirection !== 'h2g'}
                        className="hijri-select day"
                      >
                        {Array.from({ length: 30 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select 
                        value={hijriDate.month}
                        onChange={(e) => handleHijriChange('month', e.target.value)}
                        disabled={conversionDirection !== 'h2g'}
                        className="hijri-select month"
                      >
                        {HIJRI_MONTHS.map((month) => (
                          <option key={month.id} value={month.id}>{month.name}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        value={hijriDate.year}
                        onChange={(e) => handleHijriChange('year', e.target.value)}
                        disabled={conversionDirection !== 'h2g'}
                        min="1"
                        max="2000"
                        className="hijri-input year"
                      />
                    </div>
                    <div className="date-display hijri">
                      <span className="arabic-date">{getCurrentHijriMonth().arabic} {hijriDate.year}</span>
                      <span>{hijriDate.day} {getCurrentHijriMonth().name} {hijriDate.year} AH</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <span className="info-icon">📖</span>
                  <h4>About the Hijri Calendar</h4>
                  <p>The Islamic calendar (Hijri) is a lunar calendar with 12 months totaling 354 or 355 days. It began on July 16, 622 CE, marking the Prophet Muhammad's (PBUH) migration from Mecca to Medina.</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">🌙</span>
                  <h4>Lunar vs Solar</h4>
                  <p>The Hijri year is approximately 11 days shorter than the Gregorian year, causing Islamic dates to shift through the seasons over a 33-year cycle.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'age' && (
            <div className="age-tab">
              <div className="age-intro">
                <h3>Calculate Your Islamic Age</h3>
                <p>Find out your age in both Gregorian and Hijri calendars</p>
              </div>

              <div className="age-input-section">
                <label className="input-label">Enter Your Birth Date (Gregorian)</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="birth-input"
                  max={new Date().toISOString().split('T')[0]}
                />
                <button 
                  className="calculate-btn"
                  onClick={calculateAge}
                  disabled={!birthDate}
                >
                  <span>🎂</span> Calculate My Age
                </button>
              </div>

              {ageResult && (
                <div className="age-results">
                  <div className="result-card gregorian">
                    <div className="result-header">
                      <span className="result-icon">🌍</span>
                      <h4>Gregorian Age</h4>
                    </div>
                    <div className="result-age">
                      <span className="age-number">{ageResult.gregorian.years}</span>
                      <span className="age-unit">years</span>
                    </div>
                    <div className="result-detail">
                      {ageResult.gregorian.months} months, {ageResult.gregorian.days} days
                    </div>
                    <div className="result-total">
                      Total: {ageResult.totalGregorianDays.toLocaleString()} days
                    </div>
                  </div>

                  <div className="result-card hijri">
                    <div className="result-header">
                      <span className="result-icon">🌙</span>
                      <h4>Hijri Age</h4>
                    </div>
                    <div className="result-age">
                      <span className="age-number">{ageResult.hijri.years}</span>
                      <span className="age-unit">years</span>
                    </div>
                    <div className="result-detail">
                      {ageResult.hijri.months} months, {ageResult.hijri.days} days
                    </div>
                    <div className="result-total">
                      ≈ {ageResult.totalHijriDays.toLocaleString()} lunar days
                    </div>
                  </div>

                  <div className="birth-info">
                    <h4>Your Birth Date in Hijri Calendar</h4>
                    <div className="birth-hijri">
                      {ageResult.hijriBirthDate.day} {HIJRI_MONTHS[ageResult.hijriBirthDate.month - 1]?.name} {ageResult.hijriBirthDate.year} AH
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-tab">
              <div className="events-header">
                <h3>Important Islamic Dates in {hijriDate.year} AH</h3>
                <p>Approximate Gregorian equivalents for this Hijri year</p>
              </div>

              <div className="events-grid">
                {ISLAMIC_EVENTS.map((event, index) => {
                  const gregDate = getEventGregorianDate(event);
                  return (
                    <div 
                      key={index} 
                      className={`event-card ${event.category} ${selectedEvent === index ? 'expanded' : ''}`}
                      onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                    >
                      <div className="event-icon">{event.icon}</div>
                      <div className="event-info">
                        <h4 className="event-name">{event.name}</h4>
                        <div className="event-dates">
                          <span className="hijri-date">{event.hijri}</span>
                          {gregDate && (
                            <span className="greg-date">{formatGregorianDate(gregDate)}</span>
                          )}
                        </div>
                        {selectedEvent === index && (
                          <p className="event-desc">{event.description}</p>
                        )}
                      </div>
                      <div className="event-expand">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                          <polyline points={selectedEvent === index ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="events-legend">
                <div className="legend-item holy"><span></span> Holy Days</div>
                <div className="legend-item fasting"><span></span> Fasting</div>
                <div className="legend-item eid"><span></span> Eid</div>
                <div className="legend-item hajj"><span></span> Hajj</div>
                <div className="legend-item celebration"><span></span> Celebration</div>
              </div>
            </div>
          )}

          {activeTab === 'historical' && (
            <div className="historical-tab">
              <div className="historical-intro">
                <h3>Explore Historical Hijri Years</h3>
                <p>Enter a Hijri year to find its Gregorian equivalent</p>
              </div>

              <div className="historical-input">
                <label className="input-label">Hijri Year (1-2000)</label>
                <div className="input-row">
                  <input 
                    type="number" 
                    value={historicalYear}
                    onChange={(e) => setHistoricalYear(e.target.value)}
                    placeholder="e.g., 1"
                    min="1"
                    max="2000"
                    className="year-input"
                  />
                  <span className="ah-label">AH</span>
                  <button 
                    className="calculate-btn"
                    onClick={calculateHistoricalDate}
                    disabled={!historicalYear}
                  >
                    Find Date
                  </button>
                </div>
              </div>

              {historicalResult && (
                <div className="historical-result">
                  <div className="result-box">
                    <h4>1 Muharram {historicalResult.hijriYear} AH</h4>
                    <div className="equals">=</div>
                    <div className="greg-result">
                      <span className="year">{Math.abs(historicalResult.gregorianYear)} {historicalResult.era}</span>
                      <span className="full">{formatGregorianDate(historicalResult.fullDate)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="historical-highlights">
                <h4>Notable Hijri Years</h4>
                <div className="highlights-grid">
                  <div className="highlight-item" onClick={() => { setHistoricalYear('1'); calculateHistoricalDate(); }}>
                    <span className="year">1 AH</span>
                    <span className="event">Hijra to Medina (622 CE)</span>
                  </div>
                  <div className="highlight-item" onClick={() => { setHistoricalYear('2'); calculateHistoricalDate(); }}>
                    <span className="year">2 AH</span>
                    <span className="event">Battle of Badr</span>
                  </div>
                  <div className="highlight-item" onClick={() => { setHistoricalYear('8'); calculateHistoricalDate(); }}>
                    <span className="year">8 AH</span>
                    <span className="event">Conquest of Mecca</span>
                  </div>
                  <div className="highlight-item" onClick={() => { setHistoricalYear('11'); calculateHistoricalDate(); }}>
                    <span className="year">11 AH</span>
                    <span className="event">Prophet's (PBUH) passing</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="month-reference">
          <h3>Hijri Months Reference</h3>
          <div className="months-grid">
            {HIJRI_MONTHS.map(month => (
              <div key={month.id} className={`month-item ${month.id === hijriDate.month ? 'current' : ''}`}>
                <span className="month-num">{month.id}</span>
                <span className="month-name">{month.name}</span>
                <span className="month-arabic">{month.arabic}</span>
                <span className="month-days">{month.days} days</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="back-nav">
        <Link to="/islamic-resources" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Islamic Resources
        </Link>
      </div>
    </div>
  );
}

export default HijriConverter;
