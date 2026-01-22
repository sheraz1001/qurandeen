import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/hijri-calendar.css';

function HijriCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [activeTab, setActiveTab] = useState('calendar');
  const [converterMode, setConverterMode] = useState('gregorian-to-hijri');
  const [gregorianInput, setGregorianInput] = useState(new Date().toISOString().split('T')[0]);
  const [hijriInput, setHijriInput] = useState({ day: 1, month: 1, year: 1446 });
  const [ageInput, setAgeInput] = useState({ gregorian: '', hijri: { day: 1, month: 1, year: 1400 } });
  const [ageResult, setAgeResult] = useState(null);
  const [countdownEvent, setCountdownEvent] = useState(null);

  const hijriMonths = [
    { name: 'Muharram', arabic: 'محرم', days: 30 },
    { name: 'Safar', arabic: 'صفر', days: 29 },
    { name: 'Rabi al-Awwal', arabic: 'ربيع الأول', days: 30 },
    { name: 'Rabi al-Thani', arabic: 'ربيع الآخر', days: 29 },
    { name: 'Jumada al-Awwal', arabic: 'جمادى الأولى', days: 30 },
    { name: 'Jumada al-Thani', arabic: 'جمادى الآخرة', days: 29 },
    { name: 'Rajab', arabic: 'رجب', days: 30 },
    { name: 'Shaban', arabic: 'شعبان', days: 29 },
    { name: 'Ramadan', arabic: 'رمضان', days: 30 },
    { name: 'Shawwal', arabic: 'شوال', days: 29 },
    { name: 'Dhul Qadah', arabic: 'ذو القعدة', days: 30 },
    { name: 'Dhul Hijjah', arabic: 'ذو الحجة', days: 29 }
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const islamicEvents = [
    { day: 1, month: 1, name: 'Islamic New Year', arabic: 'رأس السنة الهجرية', type: 'major', description: 'Beginning of the new Islamic calendar year' },
    { day: 10, month: 1, name: 'Day of Ashura', arabic: 'يوم عاشوراء', type: 'major', description: 'Day of fasting, commemorating when Allah saved Moses and the Israelites' },
    { day: 12, month: 3, name: 'Mawlid al-Nabi', arabic: 'المولد النبوي', type: 'major', description: "Birthday of Prophet Muhammad (Peace Be Upon Him)" },
    { day: 27, month: 7, name: 'Isra and Miraj', arabic: 'الإسراء والمعراج', type: 'major', description: "The Night Journey and Ascension of Prophet Muhammad (PBUH)" },
    { day: 15, month: 8, name: 'Shab-e-Barat', arabic: 'ليلة البراءة', type: 'blessed', description: 'Night of Fortune and Forgiveness' },
    { day: 1, month: 9, name: 'First of Ramadan', arabic: 'بداية رمضان', type: 'major', description: 'Beginning of the blessed month of fasting' },
    { day: 21, month: 9, name: 'Last 10 Nights Begin', arabic: 'العشر الأواخر', type: 'blessed', description: 'Beginning of the most blessed nights of Ramadan' },
    { day: 27, month: 9, name: 'Laylat al-Qadr', arabic: 'ليلة القدر', type: 'major', description: 'Night of Power - better than a thousand months' },
    { day: 1, month: 10, name: 'Eid al-Fitr', arabic: 'عيد الفطر', type: 'eid', description: 'Festival of Breaking the Fast' },
    { day: 8, month: 12, name: 'Day of Tarwiyah', arabic: 'يوم التروية', type: 'hajj', description: 'First day of Hajj rituals' },
    { day: 9, month: 12, name: 'Day of Arafah', arabic: 'يوم عرفة', type: 'major', description: 'Most important day of Hajj - fasting highly recommended' },
    { day: 10, month: 12, name: 'Eid al-Adha', arabic: 'عيد الأضحى', type: 'eid', description: 'Festival of Sacrifice' },
    { day: 11, month: 12, name: 'Days of Tashreeq', arabic: 'أيام التشريق', type: 'hajj', description: 'Days of celebrating Eid (11-13 Dhul Hijjah)' }
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

    return new Date(gYear, gMonth - 1, gDay);
  };

  const todayHijri = useMemo(() => gregorianToHijri(new Date()), []);
  const selectedHijri = useMemo(() => gregorianToHijri(selectedDate), [selectedDate]);

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, isPrev: true });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const hijri = gregorianToHijri(date);
      const event = islamicEvents.find(e => e.day === hijri.day && e.month === hijri.month);
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        date,
        hijri,
        event,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, isNext: true });
    }
    
    return days;
  };

  const monthDays = useMemo(() => 
    getMonthDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isCurrentMonth && dayInfo.date) {
      setSelectedDate(dayInfo.date);
    }
  };

  const calculateAge = () => {
    let birthDate;
    if (ageInput.gregorian) {
      birthDate = new Date(ageInput.gregorian);
    } else {
      birthDate = hijriToGregorian(ageInput.hijri);
    }
    
    const today = new Date();
    const birthHijri = gregorianToHijri(birthDate);
    const todayHijriCalc = gregorianToHijri(today);
    
    let gregorianYears = today.getFullYear() - birthDate.getFullYear();
    let gregorianMonths = today.getMonth() - birthDate.getMonth();
    let gregorianDays = today.getDate() - birthDate.getDate();
    
    if (gregorianDays < 0) {
      gregorianMonths--;
      gregorianDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (gregorianMonths < 0) {
      gregorianYears--;
      gregorianMonths += 12;
    }
    
    let hijriYears = todayHijriCalc.year - birthHijri.year;
    let hijriMonthsDiff = todayHijriCalc.month - birthHijri.month;
    let hijriDaysDiff = todayHijriCalc.day - birthHijri.day;
    
    if (hijriDaysDiff < 0) {
      hijriMonthsDiff--;
      hijriDaysDiff += 30;
    }
    if (hijriMonthsDiff < 0) {
      hijriYears--;
      hijriMonthsDiff += 12;
    }
    
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    
    setAgeResult({
      gregorian: { years: gregorianYears, months: gregorianMonths, days: gregorianDays },
      hijri: { years: hijriYears, months: hijriMonthsDiff, days: hijriDaysDiff },
      totalDays,
      birthGregorian: birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      birthHijri: `${birthHijri.day} ${hijriMonths[birthHijri.month - 1]?.name} ${birthHijri.year} AH`
    });
  };

  useEffect(() => {
    const today = new Date();
    const todayH = gregorianToHijri(today);
    
    let upcomingEvents = [];
    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      islamicEvents.forEach(event => {
        const eventHijri = { day: event.day, month: event.month, year: todayH.year + yearOffset };
        const eventGregorian = hijriToGregorian(eventHijri);
        if (eventGregorian > today) {
          const daysUntil = Math.ceil((eventGregorian - today) / (1000 * 60 * 60 * 24));
          upcomingEvents.push({ ...event, date: eventGregorian, daysUntil, hijriYear: eventHijri.year });
        }
      });
    }
    
    upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil);
    if (upcomingEvents.length > 0) {
      setCountdownEvent(upcomingEvents[0]);
    }
  }, []);

  const getUpcomingEvents = () => {
    const today = new Date();
    const todayH = gregorianToHijri(today);
    
    let upcomingEvents = [];
    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      islamicEvents.forEach(event => {
        const eventHijri = { day: event.day, month: event.month, year: todayH.year + yearOffset };
        const eventGregorian = hijriToGregorian(eventHijri);
        if (eventGregorian > today) {
          const daysUntil = Math.ceil((eventGregorian - today) / (1000 * 60 * 60 * 24));
          upcomingEvents.push({ ...event, date: eventGregorian, daysUntil, hijriYear: eventHijri.year });
        }
      });
    }
    
    return upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 10);
  };

  const upcomingEvents = useMemo(() => getUpcomingEvents(), []);

  const getEventTypeClass = (type) => {
    switch (type) {
      case 'eid': return 'event-eid';
      case 'major': return 'event-major';
      case 'blessed': return 'event-blessed';
      case 'hajj': return 'event-hajj';
      default: return 'event-default';
    }
  };

  const currentHijriMonth = gregorianToHijri(currentDate);

  return (
    <div className="hijri-calendar-page">
      <Helmet>
        <title>Hijri-Gregorian Islamic Calendar - Date Converter & Islamic Events | QuranDeen</title>
        <meta name="description" content="Advanced Islamic Hijri calendar with Gregorian date converter, Islamic events, age calculator, and countdown to important dates like Ramadan, Eid, and more." />
        <meta name="keywords" content="hijri calendar, islamic calendar, gregorian to hijri, hijri converter, islamic events, ramadan calendar, eid dates, islamic new year" />
      </Helmet>

      <div className="hijri-hero">
        <div className="hijri-hero-content">
          <h1>Hijri-Gregorian Islamic Calendar</h1>
          <p>Comprehensive Islamic calendar with date conversion, events, and tools</p>
          
          <div className="today-display">
            <div className="today-gregorian">
              <span className="today-label">Today (Gregorian)</span>
              <span className="today-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="today-divider">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16l5-5 5 5M7 8l5 5 5-5" />
              </svg>
            </div>
            <div className="today-hijri">
              <span className="today-label">Today (Hijri)</span>
              <span className="today-date">{todayHijri.day} {hijriMonths[todayHijri.month - 1]?.name} {todayHijri.year} AH</span>
              <span className="today-arabic">{todayHijri.day} {hijriMonths[todayHijri.month - 1]?.arabic} {todayHijri.year}</span>
            </div>
          </div>

          {countdownEvent && (
            <div className="countdown-banner">
              <div className="countdown-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="countdown-info">
                <span className="countdown-label">Next Islamic Event</span>
                <span className="countdown-event">{countdownEvent.name}</span>
                <span className="countdown-days">{countdownEvent.daysUntil} days remaining</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hijri-tabs">
        <button 
          className={`hijri-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Calendar
        </button>
        <button 
          className={`hijri-tab ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          Date Converter
        </button>
        <button 
          className={`hijri-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Islamic Events
        </button>
        <button 
          className={`hijri-tab ${activeTab === 'age' ? 'active' : ''}`}
          onClick={() => setActiveTab('age')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Age Calculator
        </button>
      </div>

      <div className="hijri-content">
        {activeTab === 'calendar' && (
          <div className="calendar-section">
            <div className="calendar-main">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <button onClick={() => navigateYear(-1)} className="nav-btn" title="Previous Year">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="11 17 6 12 11 7" />
                      <polyline points="18 17 13 12 18 7" />
                    </svg>
                  </button>
                  <button onClick={() => navigateMonth(-1)} className="nav-btn" title="Previous Month">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                </div>
                
                <div className="calendar-title">
                  <h2>{gregorianMonths[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                  <span className="hijri-title">
                    {hijriMonths[currentHijriMonth.month - 1]?.name} {currentHijriMonth.year} AH
                  </span>
                </div>
                
                <div className="calendar-nav">
                  <button onClick={() => navigateMonth(1)} className="nav-btn" title="Next Month">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <button onClick={() => navigateYear(1)} className="nav-btn" title="Next Year">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="13 17 18 12 13 7" />
                      <polyline points="6 17 11 12 6 7" />
                    </svg>
                  </button>
                  <button onClick={goToToday} className="today-btn">Today</button>
                </div>
              </div>

              <div className="calendar-grid">
                <div className="weekdays">
                  {weekDays.map(day => (
                    <div key={day} className={`weekday ${day === 'Fri' ? 'friday' : ''}`}>{day}</div>
                  ))}
                </div>
                <div className="days">
                  {monthDays.map((dayInfo, index) => (
                    <div 
                      key={index}
                      className={`day ${dayInfo.isCurrentMonth ? 'current-month' : 'other-month'} ${dayInfo.isToday ? 'today' : ''} ${dayInfo.event ? getEventTypeClass(dayInfo.event.type) : ''} ${selectedDate.toDateString() === dayInfo.date?.toDateString() ? 'selected' : ''}`}
                      onClick={() => handleDateClick(dayInfo)}
                    >
                      <span className="gregorian-day">{dayInfo.day}</span>
                      {dayInfo.hijri && (
                        <span className="hijri-day">{dayInfo.hijri.day}</span>
                      )}
                      {dayInfo.event && (
                        <div className="event-dot" title={dayInfo.event.name}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot today-dot"></span>
                  <span>Today</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot event-eid"></span>
                  <span>Eid</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot event-major"></span>
                  <span>Major Event</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot event-blessed"></span>
                  <span>Blessed Night</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot event-hajj"></span>
                  <span>Hajj Days</span>
                </div>
              </div>
            </div>

            <div className="calendar-sidebar">
              <div className="selected-date-info">
                <h3>Selected Date</h3>
                <div className="date-details">
                  <div className="detail-row">
                    <span className="detail-label">Gregorian</span>
                    <span className="detail-value">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Hijri</span>
                    <span className="detail-value">{selectedHijri.day} {hijriMonths[selectedHijri.month - 1]?.name} {selectedHijri.year} AH</span>
                  </div>
                  <div className="detail-row arabic-date">
                    <span className="detail-value">{selectedHijri.day} {hijriMonths[selectedHijri.month - 1]?.arabic} {selectedHijri.year}</span>
                  </div>
                </div>
                
                {islamicEvents.find(e => e.day === selectedHijri.day && e.month === selectedHijri.month) && (
                  <div className="selected-event">
                    <h4>Islamic Event</h4>
                    <div className="event-info">
                      <span className="event-name">{islamicEvents.find(e => e.day === selectedHijri.day && e.month === selectedHijri.month)?.name}</span>
                      <span className="event-arabic">{islamicEvents.find(e => e.day === selectedHijri.day && e.month === selectedHijri.month)?.arabic}</span>
                      <p className="event-desc">{islamicEvents.find(e => e.day === selectedHijri.day && e.month === selectedHijri.month)?.description}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="upcoming-events-sidebar">
                <h3>Upcoming Events</h3>
                <div className="events-list">
                  {upcomingEvents.slice(0, 5).map((event, index) => (
                    <div key={index} className={`event-item ${getEventTypeClass(event.type)}`}>
                      <div className="event-date">
                        <span className="event-day">{event.day}</span>
                        <span className="event-month">{hijriMonths[event.month - 1]?.name.substring(0, 3)}</span>
                      </div>
                      <div className="event-details">
                        <span className="event-name">{event.name}</span>
                        <span className="event-countdown">{event.daysUntil} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'converter' && (
          <div className="converter-section">
            <div className="converter-toggle">
              <button 
                className={converterMode === 'gregorian-to-hijri' ? 'active' : ''}
                onClick={() => setConverterMode('gregorian-to-hijri')}
              >
                Gregorian → Hijri
              </button>
              <button 
                className={converterMode === 'hijri-to-gregorian' ? 'active' : ''}
                onClick={() => setConverterMode('hijri-to-gregorian')}
              >
                Hijri → Gregorian
              </button>
            </div>

            {converterMode === 'gregorian-to-hijri' ? (
              <div className="converter-form">
                <div className="form-group">
                  <label>Gregorian Date</label>
                  <input 
                    type="date" 
                    value={gregorianInput}
                    onChange={(e) => setGregorianInput(e.target.value)}
                  />
                </div>
                <div className="converter-result">
                  <div className="result-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                  <div className="result-display">
                    <span className="result-label">Hijri Date</span>
                    <span className="result-value">
                      {gregorianToHijri(gregorianInput).day} {hijriMonths[gregorianToHijri(gregorianInput).month - 1]?.name} {gregorianToHijri(gregorianInput).year} AH
                    </span>
                    <span className="result-arabic">
                      {gregorianToHijri(gregorianInput).day} {hijriMonths[gregorianToHijri(gregorianInput).month - 1]?.arabic} {gregorianToHijri(gregorianInput).year}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="converter-form">
                <div className="form-group hijri-inputs">
                  <label>Hijri Date</label>
                  <div className="hijri-selects">
                    <select 
                      value={hijriInput.day}
                      onChange={(e) => setHijriInput({...hijriInput, day: parseInt(e.target.value)})}
                    >
                      {[...Array(30)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select 
                      value={hijriInput.month}
                      onChange={(e) => setHijriInput({...hijriInput, month: parseInt(e.target.value)})}
                    >
                      {hijriMonths.map((month, i) => (
                        <option key={i + 1} value={i + 1}>{month.name}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      value={hijriInput.year}
                      onChange={(e) => setHijriInput({...hijriInput, year: parseInt(e.target.value)})}
                      min="1"
                      max="1500"
                    />
                  </div>
                </div>
                <div className="converter-result">
                  <div className="result-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                  <div className="result-display">
                    <span className="result-label">Gregorian Date</span>
                    <span className="result-value">
                      {hijriToGregorian(hijriInput).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="quick-reference">
              <h3>Quick Reference</h3>
              <div className="reference-grid">
                <div className="reference-card">
                  <h4>Hijri Months</h4>
                  <ul>
                    {hijriMonths.map((month, i) => (
                      <li key={i}>
                        <span className="month-num">{i + 1}.</span>
                        <span className="month-name">{month.name}</span>
                        <span className="month-arabic">{month.arabic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="reference-card">
                  <h4>About the Islamic Calendar</h4>
                  <p>The Islamic (Hijri) calendar is a lunar calendar consisting of 12 months in a year of 354 or 355 days. It began on July 16, 622 CE, the date of the Hijra (migration) of Prophet Muhammad (PBUH) from Mecca to Medina.</p>
                  <ul className="calendar-facts">
                    <li>Based on lunar cycles</li>
                    <li>12 months per year</li>
                    <li>354-355 days per year</li>
                    <li>Each month starts with new moon sighting</li>
                    <li>About 11 days shorter than Gregorian year</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <h2>Islamic Events & Holidays</h2>
            <p className="events-intro">Important dates in the Islamic calendar for the current and upcoming Hijri year</p>
            
            <div className="events-grid">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`event-card ${getEventTypeClass(event.type)}`}>
                  <div className="event-card-header">
                    <div className="event-type-badge">{event.type}</div>
                    <div className="event-countdown-badge">{event.daysUntil} days</div>
                  </div>
                  <div className="event-card-body">
                    <h3>{event.name}</h3>
                    <span className="event-arabic-name">{event.arabic}</span>
                    <p className="event-description">{event.description}</p>
                  </div>
                  <div className="event-card-footer">
                    <div className="event-dates">
                      <div className="hijri-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        {event.day} {hijriMonths[event.month - 1]?.name} {event.hijriYear} AH
                      </div>
                      <div className="gregorian-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'age' && (
          <div className="age-section">
            <h2>Islamic Age Calculator</h2>
            <p className="age-intro">Calculate your age in both Gregorian and Hijri calendars</p>
            
            <div className="age-calculator">
              <div className="age-input-section">
                <h3>Enter Your Birth Date</h3>
                <div className="age-tabs">
                  <button 
                    className={ageInput.gregorian || !ageInput.hijri.day ? 'active' : ''}
                    onClick={() => setAgeInput({ ...ageInput, gregorian: ageInput.gregorian || new Date().toISOString().split('T')[0] })}
                  >
                    Gregorian Date
                  </button>
                  <button 
                    className={!ageInput.gregorian && ageInput.hijri.day ? 'active' : ''}
                    onClick={() => setAgeInput({ ...ageInput, gregorian: '' })}
                  >
                    Hijri Date
                  </button>
                </div>
                
                {ageInput.gregorian !== '' || !ageInput.hijri.day ? (
                  <div className="form-group">
                    <input 
                      type="date" 
                      value={ageInput.gregorian}
                      onChange={(e) => setAgeInput({ ...ageInput, gregorian: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="form-group hijri-inputs">
                    <div className="hijri-selects">
                      <select 
                        value={ageInput.hijri.day}
                        onChange={(e) => setAgeInput({...ageInput, hijri: {...ageInput.hijri, day: parseInt(e.target.value)}})}
                      >
                        {[...Array(30)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select 
                        value={ageInput.hijri.month}
                        onChange={(e) => setAgeInput({...ageInput, hijri: {...ageInput.hijri, month: parseInt(e.target.value)}})}
                      >
                        {hijriMonths.map((month, i) => (
                          <option key={i + 1} value={i + 1}>{month.name}</option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        value={ageInput.hijri.year}
                        onChange={(e) => setAgeInput({...ageInput, hijri: {...ageInput.hijri, year: parseInt(e.target.value)}})}
                        min="1300"
                        max="1500"
                        placeholder="Year"
                      />
                    </div>
                  </div>
                )}
                
                <button className="calculate-btn" onClick={calculateAge}>
                  Calculate Age
                </button>
              </div>

              {ageResult && (
                <div className="age-results">
                  <div className="birth-info">
                    <h4>Your Birth Date</h4>
                    <div className="birth-dates">
                      <span className="gregorian">{ageResult.birthGregorian}</span>
                      <span className="hijri">{ageResult.birthHijri}</span>
                    </div>
                  </div>
                  
                  <div className="age-cards">
                    <div className="age-card gregorian-age">
                      <div className="age-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Gregorian Age</span>
                      </div>
                      <div className="age-values">
                        <div className="age-value">
                          <span className="number">{ageResult.gregorian.years}</span>
                          <span className="label">Years</span>
                        </div>
                        <div className="age-value">
                          <span className="number">{ageResult.gregorian.months}</span>
                          <span className="label">Months</span>
                        </div>
                        <div className="age-value">
                          <span className="number">{ageResult.gregorian.days}</span>
                          <span className="label">Days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="age-card hijri-age">
                      <div className="age-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        <span>Hijri Age</span>
                      </div>
                      <div className="age-values">
                        <div className="age-value">
                          <span className="number">{ageResult.hijri.years}</span>
                          <span className="label">Years</span>
                        </div>
                        <div className="age-value">
                          <span className="number">{ageResult.hijri.months}</span>
                          <span className="label">Months</span>
                        </div>
                        <div className="age-value">
                          <span className="number">{ageResult.hijri.days}</span>
                          <span className="label">Days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="total-days">
                    <span>You have lived for</span>
                    <strong>{ageResult.totalDays.toLocaleString()}</strong>
                    <span>days</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Link to="/" className="back-home-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}

export default HijriCalendar;
