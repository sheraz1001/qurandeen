import axios from 'axios';
import { getCachedData, setCachedData, STORES } from './cacheService';

const API_BASE_URL = '/api/aladhan';

let memoryCache = {
  nextHoliday: null,
  yearlyCalendar: {},
  monthlyCalendar: {}
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
    console.error('Error fetching next Hijri holiday:', error);
    throw error;
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
    console.error(`Error fetching yearly holidays for ${year}:`, error);
    throw error;
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
    console.error('Error fetching current Islamic date:', error);
    throw error;
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
