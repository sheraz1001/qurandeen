import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  fetchNextHijriHoliday, 
  fetchYearlyIslamicHolidays, 
  fetchCurrentIslamicDate,
  getHolidayIcon,
  getHolidayDescription
} from '../services/islamicEventsService';
import Loading from '../components/Loading';
import '../styles/islamic-events.css';

function IslamicEvents() {
  const [nextHoliday, setNextHoliday] = useState(null);
  const [yearlyHolidays, setYearlyHolidays] = useState([]);
  const [currentHijri, setCurrentHijri] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [nextHolidayData, hijriDate] = await Promise.all([
          fetchNextHijriHoliday(),
          fetchCurrentIslamicDate()
        ]);
        setNextHoliday(nextHolidayData);
        setCurrentHijri(hijriDate);
      } catch (err) {
        console.error('Error loading Islamic events:', err);
        setError('Unable to load Islamic events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadYearlyHolidays = async () => {
      try {
        const holidays = await fetchYearlyIslamicHolidays(selectedYear);
        setYearlyHolidays(holidays);
      } catch (err) {
        console.error('Error loading yearly holidays:', err);
      }
    };
    loadYearlyHolidays();
  }, [selectedYear]);

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    const targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isPastDate = (dateStr) => {
    const parts = dateStr.split('-');
    const targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
  };

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  if (loading) return <Loading />;

  return (
    <div className="islamic-events-page">
      <Helmet>
        <title>{`Islamic Events & Holidays Calendar ${selectedYear} - QuranDeen`}</title>
        <meta name="description" content={`Complete Islamic events and holidays calendar for ${selectedYear}. Find dates for Ramadan, Eid al-Fitr, Eid al-Adha, Mawlid, Ashura, Laylat al-Qadr and more Islamic occasions.`} />
        <meta name="keywords" content="Islamic holidays, Muslim events, Ramadan dates, Eid dates, Islamic calendar, Hijri calendar, Mawlid, Ashura, Laylat al-Qadr" />
        <link rel="canonical" href="https://qurandeen.com/islamic-events" />
      </Helmet>

      <div className="events-header">
        <div className="events-header-content">
          <h1>Islamic Events & Holidays</h1>
          <p>Discover upcoming Islamic holidays and important dates in the Hijri calendar</p>
          {currentHijri && (
            <div className="current-date-badge">
              <span className="hijri-date">
                {currentHijri.day} {currentHijri.month.en} {currentHijri.year} AH
              </span>
              <span className="gregorian-date">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="events-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {nextHoliday && (
        <section className="next-holiday-section">
          <div className="next-holiday-card">
            <div className="holiday-icon-large">
              {getHolidayIcon(nextHoliday.name)}
            </div>
            <div className="next-holiday-info">
              <span className="next-label">Next Islamic Holiday</span>
              <h2 className="holiday-name">{nextHoliday.name}</h2>
              <p className="holiday-description">
                {getHolidayDescription(nextHoliday.name)}
              </p>
              <div className="holiday-dates">
                <div className="date-item">
                  <span className="date-label">Gregorian Date</span>
                  <span className="date-value">
                    {nextHoliday.gregorian?.weekday?.en}, {nextHoliday.gregorian?.day} {nextHoliday.gregorian?.month?.en} {nextHoliday.gregorian?.year}
                  </span>
                </div>
                <div className="date-item">
                  <span className="date-label">Hijri Date</span>
                  <span className="date-value">
                    {nextHoliday.hijri?.day} {nextHoliday.hijri?.month?.en} {nextHoliday.hijri?.year} AH
                  </span>
                </div>
              </div>
              {nextHoliday.gregorian?.date && (
                <div className="countdown-badge">
                  <span className="countdown-number">{getDaysUntil(nextHoliday.gregorian.date)}</span>
                  <span className="countdown-label">days remaining</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="yearly-holidays-section">
        <div className="section-header">
          <h2>Islamic Holidays Calendar</h2>
          <div className="year-selector">
            <label htmlFor="year-select">Year:</label>
            <select 
              id="year-select"
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {yearlyHolidays.length > 0 ? (
          <div className="holidays-timeline">
            {yearlyHolidays.map((holiday, index) => {
              const isPast = isPastDate(holiday.gregorianDate);
              return (
                <div 
                  key={`${holiday.name}-${index}`} 
                  className={`holiday-timeline-item ${isPast ? 'past' : 'upcoming'}`}
                >
                  <div className="timeline-marker">
                    <span className="holiday-icon">{getHolidayIcon(holiday.name)}</span>
                  </div>
                  <div className="timeline-content">
                    <h3 className="holiday-title">{holiday.name}</h3>
                    <p className="holiday-desc">{getHolidayDescription(holiday.name)}</p>
                    <div className="holiday-meta">
                      <span className="gregorian">
                        {holiday.weekday}, {holiday.gregorianReadable}
                      </span>
                      <span className="hijri">
                        {holiday.hijriReadable}
                      </span>
                    </div>
                    {!isPast && getDaysUntil(holiday.gregorianDate) !== null && (
                      <span className="days-badge">
                        {getDaysUntil(holiday.gregorianDate) === 0 
                          ? 'Today!' 
                          : getDaysUntil(holiday.gregorianDate) === 1 
                            ? 'Tomorrow' 
                            : `${getDaysUntil(holiday.gregorianDate)} days`}
                      </span>
                    )}
                    {isPast && <span className="past-badge">Passed</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-holidays">
            <p>Loading holidays for {selectedYear}...</p>
          </div>
        )}
      </section>

      <section className="events-related-tools">
        <h2>Related Islamic Tools</h2>
        <div className="events-tools-grid">
          <Link to="/hijri-calendar" className="events-tool-card">
            <span className="events-tool-icon">📅</span>
            <h3>Hijri Calendar</h3>
            <p>Full Islamic calendar with date conversion</p>
          </Link>
          <Link to="/islamic-resources/ramadan-calendar" className="events-tool-card">
            <span className="events-tool-icon">🌙</span>
            <h3>Ramadan Calendar</h3>
            <p>Suhoor and Iftar times for Ramadan</p>
          </Link>
          <Link to="/islamic-resources/prayer-times" className="events-tool-card">
            <span className="events-tool-icon">🕌</span>
            <h3>Prayer Times</h3>
            <p>Accurate prayer times for your location</p>
          </Link>
          <Link to="/islamic-resources/hijri-converter" className="events-tool-card">
            <span className="events-tool-icon">🔄</span>
            <h3>Date Converter</h3>
            <p>Convert between Hijri and Gregorian dates</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default IslamicEvents;
