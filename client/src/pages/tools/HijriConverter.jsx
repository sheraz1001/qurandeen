import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/tools.css';

function HijriConverter() {
  const [gregorianDate, setGregorianDate] = useState(new Date().toISOString().split('T')[0]);
  const [hijriDate, setHijriDate] = useState({ day: 1, month: 1, year: 1446 });

  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
  ];

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

  const handleGregorianChange = (e) => {
    const newDate = e.target.value;
    setGregorianDate(newDate);
    setHijriDate(gregorianToHijri(newDate));
  };

  const handleHijriChange = (field, value) => {
    const newHijri = { ...hijriDate, [field]: parseInt(value) };
    setHijriDate(newHijri);
    try {
      setGregorianDate(hijriToGregorian(newHijri));
    } catch (e) {
      console.error('Invalid date');
    }
  };

  useState(() => {
    setHijriDate(gregorianToHijri(gregorianDate));
  }, []);

  const islamicEvents = [
    { name: 'Islamic New Year (1 Muharram)', hijri: '1 Muharram', importance: 'Beginning of the Islamic calendar year' },
    { name: 'Ashura (10 Muharram)', hijri: '10 Muharram', importance: 'Day of fasting, commemorating Moses and the Israelites' },
    { name: 'Mawlid al-Nabi (12 Rabi al-Awwal)', hijri: '12 Rabi al-Awwal', importance: "Prophet Muhammad's (PBUH) birthday" },
    { name: 'Isra and Miraj (27 Rajab)', hijri: '27 Rajab', importance: 'Night Journey and Ascension' },
    { name: 'Shab-e-Barat (15 Shaban)', hijri: '15 Shaban', importance: 'Night of Fortune and Forgiveness' },
    { name: 'First of Ramadan', hijri: '1 Ramadan', importance: 'Beginning of the blessed month of fasting' },
    { name: 'Laylat al-Qadr (27 Ramadan)', hijri: '27 Ramadan', importance: 'Night of Power/Decree - better than 1000 months' },
    { name: 'Eid al-Fitr (1 Shawwal)', hijri: '1 Shawwal', importance: 'Festival of Breaking the Fast' },
    { name: 'Day of Arafah (9 Dhul Hijjah)', hijri: '9 Dhul Hijjah', importance: 'Most important day of Hajj' },
    { name: 'Eid al-Adha (10 Dhul Hijjah)', hijri: '10 Dhul Hijjah', importance: 'Festival of Sacrifice' }
  ];

  return (
    <div className="tools-page">
      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Tools
        </Link>
        <h1>Hijri-Gregorian Calendar Converter</h1>
        <p>Convert dates between Islamic (Hijri) and Gregorian calendars</p>
      </div>

      <div className="tool-content">
        <div className="hijri-converter">
          <div className="converter-section">
            <div className="date-input-group">
              <label>Gregorian Date</label>
              <input 
                type="date" 
                value={gregorianDate}
                onChange={handleGregorianChange}
              />
            </div>

            <div className="converter-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            <div className="date-input-group">
              <label>Hijri Date</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={hijriDate.day}
                  onChange={(e) => handleHijriChange('day', e.target.value)}
                  style={{ flex: 1 }}
                >
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select 
                  value={hijriDate.month}
                  onChange={(e) => handleHijriChange('month', e.target.value)}
                  style={{ flex: 2 }}
                >
                  {hijriMonths.map((month, i) => (
                    <option key={i + 1} value={i + 1}>{month}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  value={hijriDate.year}
                  onChange={(e) => handleHijriChange('year', e.target.value)}
                  min="1"
                  max="2000"
                  style={{ flex: 1, textAlign: 'center' }}
                />
              </div>
            </div>
          </div>

          <div className="islamic-events">
            <h3>Important Islamic Dates</h3>
            <div className="events-list">
              {islamicEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div>
                    <div className="event-name">{event.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {event.importance}
                    </div>
                  </div>
                  <div className="event-date">{event.hijri}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HijriConverter;
