import { useState, useEffect, useRef } from 'react';
import './IslamicDateBar.css';

const ISLAMIC_MONTHS = [
  { name: 'Muharram', arabic: 'مُحَرَّم', number: 1 },
  { name: 'Safar', arabic: 'صَفَر', number: 2 },
  { name: 'Rabi al-Awwal', arabic: 'رَبِيع الأَوَّل', number: 3 },
  { name: 'Rabi al-Thani', arabic: 'رَبِيع الثَّانِي', number: 4 },
  { name: 'Jumada al-Awwal', arabic: 'جُمَادَى الأُولَى', number: 5 },
  { name: 'Jumada al-Thani', arabic: 'جُمَادَى الثَّانِيَة', number: 6 },
  { name: 'Rajab', arabic: 'رَجَب', number: 7 },
  { name: 'Sha\'ban', arabic: 'شَعْبَان', number: 8 },
  { name: 'Ramadan', arabic: 'رَمَضَان', number: 9 },
  { name: 'Shawwal', arabic: 'شَوَّال', number: 10 },
  { name: 'Dhul Qi\'dah', arabic: 'ذُو القَعْدَة', number: 11 },
  { name: 'Dhul Hijjah', arabic: 'ذُو الحِجَّة', number: 12 }
];

const MONTH_INFO = {
  1: {
    name: 'Muharram',
    significance: 'First month of Islamic calendar. One of the four sacred months.',
    benefits: [
      'Fasting in Muharram is highly recommended, especially on the 10th (Ashura)',
      'Second best month for voluntary fasting after Ramadan',
      'Day of Ashura commemorates Moses being saved from Pharaoh'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ أَدْخِلْهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ',
        transliteration: 'Allahumma adkhilhu alayna bil-amni wal-iman was-salamati wal-islam',
        translation: 'O Allah, bring it upon us with security, faith, safety, and Islam'
      }
    ],
    recommendedActions: ['Fast on 9th and 10th of Muharram', 'Increase voluntary prayers', 'Give charity']
  },
  2: {
    name: 'Safar',
    significance: 'Second month of the Islamic calendar.',
    benefits: [
      'Month to seek protection from calamities',
      'Time for extra prayers and supplications',
      'Opportunity to dispel pre-Islamic superstitions about this month'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي صَفَر',
        transliteration: 'Allahumma barik lana fi Safar',
        translation: 'O Allah, bless us in Safar'
      }
    ],
    recommendedActions: ['Increase dhikr', 'Seek protection through morning/evening adhkar', 'Give sadaqah']
  },
  3: {
    name: 'Rabi al-Awwal',
    significance: 'Month of the Prophet\'s (ﷺ) birth (12th Rabi al-Awwal).',
    benefits: [
      'Blessed month marking the birth of Prophet Muhammad ﷺ',
      'Time to learn about the Seerah (Prophet\'s biography)',
      'Opportunity to increase salawat upon the Prophet ﷺ'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: 'Allahumma salli ala Muhammadin wa ala ali Muhammad',
        translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad'
      }
    ],
    recommendedActions: ['Send abundant salawat', 'Study the Seerah', 'Share the Prophet\'s teachings']
  },
  4: {
    name: 'Rabi al-Thani',
    significance: 'Fourth month of the Islamic calendar.',
    benefits: [
      'Continue the spiritual momentum from Rabi al-Awwal',
      'Time for self-reflection and improvement',
      'Opportunity for consistent worship'
    ],
    duas: [
      {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan',
        translation: 'Our Lord, give us good in this world and good in the Hereafter'
      }
    ],
    recommendedActions: ['Establish consistent daily worship', 'Strengthen family ties', 'Increase Quran recitation']
  },
  5: {
    name: 'Jumada al-Awwal',
    significance: 'Fifth month, named for the dry freeze in pre-Islamic Arabia.',
    benefits: [
      'Time for spiritual preparation for upcoming sacred months',
      'Opportunity to establish good habits',
      'Period for increasing knowledge of Islam'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
        transliteration: 'Allahumma-hdini wa saddidni',
        translation: 'O Allah, guide me and keep me on the right path'
      }
    ],
    recommendedActions: ['Seek Islamic knowledge', 'Practice patience', 'Help those in need']
  },
  6: {
    name: 'Jumada al-Thani',
    significance: 'Sixth month of the Islamic calendar.',
    benefits: [
      'Preparation time before the sacred months begin',
      'Opportunity for spiritual cleansing',
      'Time to set spiritual goals'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي',
        transliteration: 'Allahumma aslih li deeni alladhi huwa ismatu amri',
        translation: 'O Allah, rectify for me my religion which is the safeguard of my affairs'
      }
    ],
    recommendedActions: ['Prepare for Rajab', 'Increase acts of worship', 'Purify intentions']
  },
  7: {
    name: 'Rajab',
    significance: 'One of the four sacred months. Month of the Isra and Mi\'raj.',
    benefits: [
      'Sacred month when fighting was forbidden in pre-Islamic times',
      'Night Journey (Isra & Mi\'raj) occurred on 27th Rajab',
      'Excellent time for repentance and seeking forgiveness'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَب وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
        transliteration: 'Allahumma barik lana fi Rajab wa Sha\'ban wa ballighna Ramadan',
        translation: 'O Allah, bless us in Rajab and Sha\'ban, and let us reach Ramadan'
      }
    ],
    recommendedActions: ['Increase istighfar', 'Prepare spiritually for Ramadan', 'Fast voluntary fasts']
  },
  8: {
    name: 'Sha\'ban',
    significance: 'Month before Ramadan. The Prophet ﷺ fasted most of this month.',
    benefits: [
      'Prophet ﷺ fasted extensively in this month',
      'Deeds are raised to Allah in this month',
      'Laylat al-Bara\'ah (Night of Forgiveness) on 15th Sha\'ban',
      'Perfect preparation month for Ramadan'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي شَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
        transliteration: 'Allahumma barik lana fi Sha\'ban wa ballighna Ramadan',
        translation: 'O Allah, bless us in Sha\'ban and let us reach Ramadan'
      }
    ],
    recommendedActions: ['Fast frequently', 'Complete any missed Ramadan fasts', 'Increase night prayers', 'Read more Quran']
  },
  9: {
    name: 'Ramadan',
    significance: 'Holiest month. Month of fasting, Quran revelation, and Laylat al-Qadr.',
    benefits: [
      'Gates of Paradise are opened, gates of Hell are closed',
      'Shayateen (devils) are chained',
      'Laylat al-Qadr is better than 1000 months',
      'Fasting is obligatory for able Muslims',
      'Rewards for good deeds are multiplied'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: 'Allahumma innaka Afuwwun tuhibbul afwa fa\'fu anni',
        translation: 'O Allah, You are Forgiving and love forgiveness, so forgive me'
      }
    ],
    recommendedActions: ['Fast every day', 'Pray Taraweeh', 'Read entire Quran', 'Give Zakat', 'Seek Laylat al-Qadr']
  },
  10: {
    name: 'Shawwal',
    significance: 'Month of Eid ul-Fitr. Fasting 6 days is highly rewarded.',
    benefits: [
      'Eid ul-Fitr celebration on the 1st',
      'Fasting 6 days equals fasting the whole year',
      'Time of gratitude after Ramadan',
      'Opportunity to maintain Ramadan habits'
    ],
    duas: [
      {
        arabic: 'تَقَبَّلَ اللهُ مِنَّا وَمِنْكُم',
        transliteration: 'Taqabbal Allahu minna wa minkum',
        translation: 'May Allah accept from us and from you'
      }
    ],
    recommendedActions: ['Fast 6 days of Shawwal', 'Maintain Quran reading', 'Continue night prayers', 'Strengthen family bonds']
  },
  11: {
    name: 'Dhul Qi\'dah',
    significance: 'One of the four sacred months. Month before Hajj.',
    benefits: [
      'Sacred month when fighting was forbidden',
      'Time for spiritual preparation for Dhul Hijjah',
      'Pilgrims begin preparing for Hajj'
    ],
    duas: [
      {
        arabic: 'اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ',
        transliteration: 'Allahumma arina al-haqqa haqqan warzuqna ittiba\'ah',
        translation: 'O Allah, show us the truth as truth and grant us to follow it'
      }
    ],
    recommendedActions: ['Prepare for Dhul Hijjah', 'Increase worship', 'Plan for Qurbani/Udhiyah']
  },
  12: {
    name: 'Dhul Hijjah',
    significance: 'Month of Hajj and Eid ul-Adha. First 10 days are most blessed.',
    benefits: [
      'First 10 days are the best days of the year',
      'Hajj pilgrimage takes place',
      'Day of Arafah (9th) - fasting expiates sins of 2 years',
      'Eid ul-Adha on the 10th',
      'Days of Tashreeq (11th-13th) for additional worship'
    ],
    duas: [
      {
        arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
        transliteration: 'Labbayk Allahumma Labbayk',
        translation: 'Here I am, O Allah, here I am'
      }
    ],
    recommendedActions: ['Fast first 9 days, especially Arafah', 'Increase takbeer', 'Perform Qurbani', 'Give generously']
  }
};

const ISLAMIC_EVENTS = [
  { name: 'Ramadan', month: 9, day: 1, icon: '🌙', type: 'major' },
  { name: 'Laylat al-Qadr', month: 9, day: 27, icon: '✨', type: 'special' },
  { name: 'Eid ul-Fitr', month: 10, day: 1, icon: '🎉', type: 'major' },
  { name: 'Day of Arafah', month: 12, day: 9, icon: '🕋', type: 'special' },
  { name: 'Eid ul-Adha', month: 12, day: 10, icon: '🐑', type: 'major' },
  { name: 'Islamic New Year', month: 1, day: 1, icon: '🌟', type: 'major' },
  { name: 'Ashura', month: 1, day: 10, icon: '📿', type: 'special' },
  { name: 'Mawlid an-Nabi', month: 3, day: 12, icon: '💚', type: 'major' },
  { name: 'Isra & Mi\'raj', month: 7, day: 27, icon: '🌌', type: 'special' },
  { name: 'Laylat al-Bara\'ah', month: 8, day: 15, icon: '🤲', type: 'special' }
];

function getHijriDate() {
  const today = new Date();
  
  const numericFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric', 
    year: 'numeric'
  });
  const numericParts = numericFormatter.formatToParts(today);
  
  let day = 1, month = 1, year = 1446;
  
  numericParts.forEach(part => {
    if (part.type === 'day') day = parseInt(part.value);
    if (part.type === 'month') month = parseInt(part.value);
    if (part.type === 'year') year = parseInt(part.value);
  });

  if (month < 1 || month > 12) month = 1;

  return { day, month, year, monthName: ISLAMIC_MONTHS[month - 1]?.name || 'Unknown' };
}

function calculateDaysUntilEvent(currentMonth, currentDay, eventMonth, eventDay) {
  let daysUntil = 0;
  let m = currentMonth;
  let d = currentDay;
  
  const daysInMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  
  while (m !== eventMonth || d !== eventDay) {
    d++;
    if (d > daysInMonth[m - 1]) {
      d = 1;
      m++;
      if (m > 12) m = 1;
    }
    daysUntil++;
    if (daysUntil > 365) break;
  }
  
  return daysUntil;
}

function IslamicDateBar() {
  const [hijriDate, setHijriDate] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [monthInfo, setMonthInfo] = useState(null);
  const [activeSection, setActiveSection] = useState('events');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const date = getHijriDate();
    setHijriDate(date);
    setMonthInfo(MONTH_INFO[date.month]);

    const events = ISLAMIC_EVENTS.map(event => ({
      ...event,
      daysUntil: calculateDaysUntilEvent(date.month, date.day, event.month, event.day)
    }))
    .filter(e => e.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

    setUpcomingEvents(events);
  }, []);

  useEffect(() => {
    if (monthInfo?.duas?.length > 1) {
      const interval = setInterval(() => {
        setCurrentDuaIndex(prev => (prev + 1) % monthInfo.duas.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [monthInfo]);

  if (!hijriDate || !monthInfo) return null;

  const currentMonthData = ISLAMIC_MONTHS[hijriDate.month - 1];

  return (
    <div className={`islamic-date-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="idb-main">
        <div className="idb-date-section">
          <div className="idb-hijri-date">
            <div className="idb-date-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="idb-date-info">
              <span className="idb-date-day">{hijriDate.day}</span>
              <div className="idb-date-month">
                <span className="idb-month-name">{currentMonthData.name}</span>
                <span className="idb-month-arabic">{currentMonthData.arabic}</span>
              </div>
              <span className="idb-date-year">{hijriDate.year} AH</span>
            </div>
          </div>
        </div>

        <div className="idb-divider"></div>

        <div className="idb-events-section" ref={scrollRef}>
          <div className="idb-events-scroll">
            {[...upcomingEvents, ...upcomingEvents].map((event, index) => (
              <div key={index} className={`idb-event-pill ${event.type}`}>
                <span className="idb-event-icon">{event.icon}</span>
                <span className="idb-event-name">{event.name}</span>
                <span className="idb-event-days">
                  {event.daysUntil === 1 ? '1 day' : `${event.daysUntil} days`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="idb-divider mobile-hide"></div>

        <div className="idb-month-preview mobile-hide">
          <div className="idb-month-badge">
            <span className="idb-badge-icon">📖</span>
            <span className="idb-badge-text">{currentMonthData.name} Blessings</span>
          </div>
        </div>

        <button 
          className="idb-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isExpanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/>
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="idb-expanded-content">
          <div className="idb-tabs">
            <button 
              className={`idb-tab ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => setActiveSection('events')}
            >
              <span className="tab-icon">📅</span>
              <span>Upcoming Events</span>
            </button>
            <button 
              className={`idb-tab ${activeSection === 'month' ? 'active' : ''}`}
              onClick={() => setActiveSection('month')}
            >
              <span className="tab-icon">🌙</span>
              <span>{currentMonthData.name}</span>
            </button>
            <button 
              className={`idb-tab ${activeSection === 'dua' ? 'active' : ''}`}
              onClick={() => setActiveSection('dua')}
            >
              <span className="tab-icon">🤲</span>
              <span>Monthly Dua</span>
            </button>
          </div>

          <div className="idb-tab-content">
            {activeSection === 'events' && (
              <div className="idb-events-grid">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className={`idb-event-card ${event.type}`}>
                    <div className="event-card-header">
                      <span className="event-card-icon">{event.icon}</span>
                      <div className="event-card-countdown">
                        <span className="countdown-number">{event.daysUntil}</span>
                        <span className="countdown-label">days</span>
                      </div>
                    </div>
                    <h4 className="event-card-name">{event.name}</h4>
                    <p className="event-card-date">
                      {event.day} {ISLAMIC_MONTHS[event.month - 1]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'month' && (
              <div className="idb-month-info">
                <div className="month-header">
                  <h3 className="month-title">
                    <span className="month-arabic-large">{currentMonthData.arabic}</span>
                    <span className="month-english">{currentMonthData.name}</span>
                  </h3>
                  <p className="month-significance">{monthInfo.significance}</p>
                </div>

                <div className="month-sections">
                  <div className="month-section benefits">
                    <h4>
                      <span className="section-icon">✨</span>
                      Blessings & Benefits
                    </h4>
                    <ul>
                      {monthInfo.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="month-section actions">
                    <h4>
                      <span className="section-icon">📿</span>
                      Recommended Actions
                    </h4>
                    <div className="action-tags">
                      {monthInfo.recommendedActions.map((action, i) => (
                        <span key={i} className="action-tag">{action}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'dua' && monthInfo.duas && (
              <div className="idb-dua-section">
                <div className="dua-card">
                  <div className="dua-header">
                    <span className="dua-icon">🤲</span>
                    <span className="dua-label">Dua for {currentMonthData.name}</span>
                  </div>
                  <div className="dua-content">
                    <p className="dua-arabic">{monthInfo.duas[currentDuaIndex].arabic}</p>
                    <p className="dua-transliteration">{monthInfo.duas[currentDuaIndex].transliteration}</p>
                    <p className="dua-translation">"{monthInfo.duas[currentDuaIndex].translation}"</p>
                  </div>
                  {monthInfo.duas.length > 1 && (
                    <div className="dua-dots">
                      {monthInfo.duas.map((_, i) => (
                        <button 
                          key={i} 
                          className={`dua-dot ${i === currentDuaIndex ? 'active' : ''}`}
                          onClick={() => setCurrentDuaIndex(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="dua-benefits">
                  <h4>Why this Dua?</h4>
                  <p>{monthInfo.significance}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IslamicDateBar;
