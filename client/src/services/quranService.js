import axios from 'axios';
import { getCachedData, setCachedData, STORES } from './cacheService';

let memoryCache = {
  surahs: {},
  translations: null,
  tafsirs: null,
  wordByWord: {},
  tafsirContent: {}
};

export const fetchSurah = async (surahNumber, translationId, scriptType, reciterId) => {
  const cacheKey = `surah_${surahNumber}_${translationId}_${scriptType}`;
  
  if (memoryCache.surahs[cacheKey]) {
    return memoryCache.surahs[cacheKey];
  }

  const cachedData = await getCachedData(STORES.QURAN_TEXT, cacheKey);
  if (cachedData) {
    memoryCache.surahs[cacheKey] = cachedData;
    return { ...cachedData, fromCache: true };
  }

  try {
    const response = await axios.get(`/api/surah/${surahNumber}?translation=${translationId}&script=${scriptType}&reciter=${reciterId}`);
    const data = response.data;
    
    memoryCache.surahs[cacheKey] = data;
    await setCachedData(STORES.QURAN_TEXT, cacheKey, data);
    
    return { ...data, fromCache: false };
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

export const fetchTranslations = async () => {
  const cacheKey = 'translations_list';
  
  if (memoryCache.translations) {
    return memoryCache.translations;
  }

  const cachedData = await getCachedData(STORES.TRANSLATIONS, cacheKey);
  if (cachedData) {
    memoryCache.translations = cachedData;
    return cachedData;
  }

  try {
    const response = await axios.get('/api/translations');
    const data = response.data;
    
    memoryCache.translations = data;
    await setCachedData(STORES.TRANSLATIONS, cacheKey, data, 168);
    
    return data;
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
};

export const fetchTafsirs = async () => {
  const cacheKey = 'tafsirs_list';
  
  if (memoryCache.tafsirs) {
    return memoryCache.tafsirs;
  }

  const cachedData = await getCachedData(STORES.TAFSIR, cacheKey);
  if (cachedData) {
    memoryCache.tafsirs = cachedData;
    return cachedData;
  }

  try {
    const response = await axios.get('/api/tafsirs');
    const data = response.data;
    
    memoryCache.tafsirs = data;
    await setCachedData(STORES.TAFSIR, cacheKey, data, 168);
    
    return data;
  } catch (error) {
    console.error('Error fetching tafsirs:', error);
    throw error;
  }
};

export const fetchTafsirContent = async (surahNumber, ayahNumber, tafsirSlug) => {
  const cacheKey = `tafsir_${surahNumber}_${ayahNumber}_${tafsirSlug}`;
  
  if (memoryCache.tafsirContent[cacheKey]) {
    return memoryCache.tafsirContent[cacheKey];
  }

  const cachedData = await getCachedData(STORES.TAFSIR, cacheKey);
  if (cachedData) {
    memoryCache.tafsirContent[cacheKey] = cachedData;
    return cachedData;
  }

  try {
    const response = await axios.get(`/api/tafsir/${surahNumber}/${ayahNumber}?slug=${tafsirSlug}`);
    const data = response.data;
    
    memoryCache.tafsirContent[cacheKey] = data;
    await setCachedData(STORES.TAFSIR, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching tafsir content:', error);
    throw error;
  }
};

export const fetchWordByWord = async (surahNumber, ayahNumber) => {
  const cacheKey = `wbw_${surahNumber}_${ayahNumber}`;
  
  if (memoryCache.wordByWord[cacheKey]) {
    return memoryCache.wordByWord[cacheKey];
  }

  const cachedData = await getCachedData(STORES.WORD_BY_WORD, cacheKey);
  if (cachedData) {
    memoryCache.wordByWord[cacheKey] = cachedData;
    return cachedData;
  }

  try {
    const response = await axios.get(`/api/word-by-word/${surahNumber}/${ayahNumber}`);
    const data = response.data;
    
    memoryCache.wordByWord[cacheKey] = data;
    await setCachedData(STORES.WORD_BY_WORD, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching word-by-word:', error);
    throw error;
  }
};

export const fetchFullSurahWordByWord = async (surahNumber) => {
  const cacheKey = `wbw_surah_${surahNumber}`;
  
  const cachedData = await getCachedData(STORES.WORD_BY_WORD, cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`/api/word-by-word/surah/${surahNumber}`);
    const data = response.data;
    
    await setCachedData(STORES.WORD_BY_WORD, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching full surah word-by-word:', error);
    throw error;
  }
};

export const fetchAyah = async (surahNumber, ayahNumber, translationId, scriptType, reciterId) => {
  const cacheKey = `ayah_${surahNumber}_${ayahNumber}_${translationId}_${scriptType}`;
  
  if (memoryCache.surahs[cacheKey]) {
    return memoryCache.surahs[cacheKey];
  }

  const cachedData = await getCachedData(STORES.QURAN_TEXT, cacheKey);
  if (cachedData) {
    memoryCache.surahs[cacheKey] = cachedData;
    return { ...cachedData, fromCache: true };
  }

  try {
    const response = await axios.get(`/api/ayah/${surahNumber}/${ayahNumber}?translation=${translationId}&script=${scriptType}&reciter=${reciterId}`);
    const data = response.data;
    
    memoryCache.surahs[cacheKey] = data;
    await setCachedData(STORES.QURAN_TEXT, cacheKey, data);
    
    return { ...data, fromCache: false };
  } catch (error) {
    console.error(`Error fetching ayah ${surahNumber}:${ayahNumber}:`, error);
    throw error;
  }
};

export const clearQuranCache = () => {
  memoryCache = {
    surahs: {},
    translations: null,
    tafsirs: null,
    wordByWord: {},
    tafsirContent: {}
  };
};
