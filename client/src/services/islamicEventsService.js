import axios from 'axios';
import { getCachedData, setCachedData, STORES } from './cacheService';

const API_BASE_URL = '/api/aladhan';

let memoryCache = {
  nextHoliday: null,
  yearlyCalendar: {},
  monthlyCalendar: {}
};

const STATIC_HOLIDAYS_2026 = [
  { name: "Islamic New Year", gregorianDate: "26-06-2026", gregorianReadable: "26 June 2026", hijriDate: "1-01-1448", hijriReadable: "1 Muharram 1448", hijriMonth: "Muharram", weekday: "Friday" },
  { name: "Ashura", gregorianDate: "05-07-2026", gregorianReadable: "5 July 2026", hijriDate: "10-01-1448", hijriReadable: "10 Muharram 1448", hijriMonth: "Muharram", weekday: "Sunday" },
  { name: "Mawlid al-Nabi", gregorianDate: "04-09-2026", gregorianReadable: "4 September 2026", hijriDate: "12-03-1448", hijriReadable: "12 Rabi al-Awwal 1448", hijriMonth: "Rabi al-Awwal", weekday: "Friday" },
  { name: "Isra and Mi'raj", gregorianDate: "18-01-2027", gregorianReadable: "18 January 2027", hijriDate: "27-07-1448", hijriReadable: "27 Rajab 1448", hijriMonth: "Rajab", weekday: "Monday" },
  { name: "1st Day of Ramadan", gregorianDate: "17-02-2026", gregorianReadable: "17 February 2026", hijriDate: "1-09-1447", hijriReadable: "1 Ramadan 1447", hijriMonth: "Ramadan", weekday: "Tuesday" },
  { name: "Laylat al-Qadr", gregorianDate: "14-03-2026", gregorianReadable: "14 March 2026", hijriDate: "27-09-1447", hijriReadable: "27 Ramadan 1447", hijriMonth: "Ramadan", weekday: "Saturday" },
  { name: "Eid al-Fitr", gregorianDate: "20-03-2026", gregorianReadable: "20 March 2026", hijriDate: "1-10-1447", hijriReadable: "1 Shawwal 1447", hijriMonth: "Shawwal", weekday: "Friday" },
  { name: "Day of Arafah", gregorianDate: "26-05-2026", gregorianReadable: "26 May 2026", hijriDate: "9-12-1447", hijriReadable: "9 Dhul Hijjah 1447", hijriMonth: "Dhul Hijjah", weekday: "Tuesday" },
  { name: "Eid al-Adha", gregorianDate: "27-05-2026", gregorianReadable: "27 May 2026", hijriDate: "10-12-1447", hijriReadable: "10 Dhul Hijjah 1447", hijriMonth: "Dhul Hijjah", weekday: "Wednesday" }
];

const getStaticNextHoliday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const holiday of STATIC_HOLIDAYS_2026.sort((a, b) => {
    const dateA = new Date(a.gregorianDate.split('-').reverse().join('-'));
    const dateB = new Date(b.gregorianDate.split('-').reverse().join('-'));
    return dateA - dateB;
  })) {
    const parts = holiday.gregorianDate.split('-');
    const holidayDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (holidayDate >= today) {
      return {
        name: holiday.name,
        hijri: { 
          date: holiday.hijriDate, 
          day: holiday.hijriDate.split('-')[0],
          month: { en: holiday.hijriMonth },
          year: holiday.hijriDate.split('-')[2]
        },
        gregorian: {
          date: holiday.gregorianDate,
          day: holiday.gregorianDate.split('-')[0],
          month: { en: holiday.gregorianReadable.split(' ')[1] },
          year: holiday.gregorianReadable.split(' ')[2],
          weekday: { en: holiday.weekday }
        }
      };
    }
  }
  return STATIC_HOLIDAYS_2026[0];
};

const getStaticCurrentHijri = () => {
  return {
    date: "7-08-1447",
    day: "7",
    month: { en: "Sha'ban", ar: "شَعْبَان" },
    year: "1447",
    weekday: { en: "Monday" }
  };
};

export const fetchNextHijriHoliday = async () => {
  const cacheKey = 'next_hijri_holiday';
  
  if (memoryCache.nextHoliday) {
    return memoryCache.nextHoliday;
  }

  const cachedData = await getCachedData(STORES.QURAN_TEXT, cacheKey);
  if (cachedData && cachedData.timestamp > Date.now() - 3600000) {
    memoryCache.nextHoliday = cachedData.data;
    return cachedData.data;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/nextHijriHoliday`);
    const apiData = response.data.data;
    
    const data = {
      name: apiData.hijri?.holidays?.[0] || 'Islamic Holiday',
      hijri: apiData.hijri,
      gregorian: apiData.gregorian
    };
    
    memoryCache.nextHoliday = data;
    await setCachedData(STORES.QURAN_TEXT, cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('Error fetching next Hijri holiday, using static data:', error);
    const fallback = getStaticNextHoliday();
    memoryCache.nextHoliday = fallback;
    return fallback;
  }
};

export const fetchIslamicCalendarMonth = async (month, year) => {
  const cacheKey = `islamic_calendar_${month}_${year}`;
  
  if (memoryCache.monthlyCalendar[cacheKey]) {
    return memoryCache.monthlyCalendar[cacheKey];
  }

  const cachedData = await getCachedData(STORES.QURAN_TEXT, cacheKey);
  if (cachedData) {
    memoryCache.monthlyCalendar[cacheKey] = cachedData;
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/gToHCalendar/${month}/${year}`);
    const data = response.data.data;
    
    memoryCache.monthlyCalendar[cacheKey] = data;
    await setCachedData(STORES.QURAN_TEXT, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching Islamic calendar for ${month}/${year}:`, error);
    throw error;
  }
};

export const fetchYearlyIslamicHolidays = async (year) => {
  const cacheKey = `islamic_holidays_${year}`;
  
  if (memoryCache.yearlyCalendar[cacheKey]) {
    return memoryCache.yearlyCalendar[cacheKey];
  }

  const cachedData = await getCachedData(STORES.QURAN_TEXT, cacheKey);
  if (cachedData && cachedData.timestamp && cachedData.timestamp > Date.now() - 86400000) {
    memoryCache.yearlyCalendar[cacheKey] = cachedData.data;
    return cachedData.data;
  }

  try {
    const holidays = [];
    const promises = [];
    
    for (let month = 1; month <= 12; month++) {
      promises.push(
        axios.get(`${API_BASE_URL}/gToHCalendar/${month}/${year}`)
          .then(response => {
            const monthData = response.data.data;
            monthData.forEach(day => {
              if (day.hijri && day.hijri.holidays && day.hijri.holidays.length > 0) {
                day.hijri.holidays.forEach(holiday => {
                  holidays.push({
                    name: holiday,
                    gregorianDate: day.gregorian.date,
                    gregorianReadable: `${day.gregorian.day} ${day.gregorian.month.en} ${day.gregorian.year}`,
                    hijriDate: day.hijri.date,
                    hijriReadable: `${day.hijri.day} ${day.hijri.month.en} ${day.hijri.year}`,
                    hijriMonth: day.hijri.month.en,
                    weekday: day.gregorian.weekday.en
                  });
                });
              }
            });
          })
          .catch(err => console.error(`Error fetching month ${month}:`, err))
      );
    }
    
    await Promise.all(promises);
    
    holidays.sort((a, b) => {
      const dateA = new Date(a.gregorianDate.split('-').reverse().join('-'));
      const dateB = new Date(b.gregorianDate.split('-').reverse().join('-'));
      return dateA - dateB;
    });
    
    memoryCache.yearlyCalendar[cacheKey] = holidays;
    await setCachedData(STORES.QURAN_TEXT, cacheKey, { data: holidays, timestamp: Date.now() });
    
    return holidays;
  } catch (error) {
    console.error(`Error fetching yearly holidays for ${year}, using static data:`, error);
    if (year === 2026) {
      memoryCache.yearlyCalendar[cacheKey] = STATIC_HOLIDAYS_2026;
      return STATIC_HOLIDAYS_2026;
    }
    return [];
  }
};

export const fetchCurrentIslamicDate = async () => {
  try {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    const response = await axios.get(`${API_BASE_URL}/gToH/${day}-${month}-${year}`);
    return response.data.data.hijri;
  } catch (error) {
    console.error('Error fetching current Islamic date, using static data:', error);
    return getStaticCurrentHijri();
  }
};

export const getHolidayIcon = (holidayName) => {
  if (!holidayName) return '📅';
  const name = holidayName.toLowerCase();
  
  if (name.includes('eid al-fitr') || name.includes('eid ul fitr')) return '🎉';
  if (name.includes('eid al-adha') || name.includes('eid ul adha')) return '🐑';
  if (name.includes('ramadan') || name.includes('ramadhan')) return '🌙';
  if (name.includes('laylat') || name.includes('qadr')) return '✨';
  if (name.includes('ashura') || name.includes('muharram')) return '📿';
  if (name.includes('mawlid') || name.includes('milad')) return '🕌';
  if (name.includes('isra') || name.includes('miraj')) return '🌌';
  if (name.includes('shaban') || name.includes('nisf')) return '🌕';
  if (name.includes('arafah') || name.includes('arafat')) return '🏔️';
  if (name.includes('hajj')) return '🕋';
  if (name.includes('new year') || name.includes('muharram 1')) return '🗓️';
  
  return '📅';
};

export const getHolidayDescription = (holidayName) => {
  if (!holidayName) return 'An important day in the Islamic calendar';
  const name = holidayName.toLowerCase();
  
  if (name.includes('eid al-fitr') || name.includes('eid ul fitr')) {
    return 'Festival of Breaking the Fast - celebrates the end of Ramadan';
  }
  if (name.includes('eid al-adha') || name.includes('eid ul adha')) {
    return 'Festival of Sacrifice - commemorates Ibrahim\'s willingness to sacrifice his son';
  }
  if (name.includes('1st day of ramadan') || name === 'ramadan') {
    return 'Beginning of the holy month of fasting, prayer, and reflection';
  }
  if (name.includes('laylat') || name.includes('qadr')) {
    return 'Night of Power - the night when the first verses of the Quran were revealed';
  }
  if (name.includes('ashura')) {
    return 'Day of remembrance observed on the 10th of Muharram';
  }
  if (name.includes('mawlid') || name.includes('milad')) {
    return 'Birthday of Prophet Muhammad (PBUH)';
  }
  if (name.includes('isra') || name.includes('miraj')) {
    return 'Night Journey and Ascension of Prophet Muhammad (PBUH)';
  }
  if (name.includes('nisf') || name.includes('shaban')) {
    return 'Night of Forgiveness - mid-Shaban observance';
  }
  if (name.includes('arafah') || name.includes('arafat')) {
    return 'Day of Arafah - the most important day of Hajj pilgrimage';
  }
  if (name.includes('new year') || name.includes('muharram 1')) {
    return 'Islamic New Year - beginning of the new Hijri calendar year';
  }
  
  return 'An important day in the Islamic calendar';
};
