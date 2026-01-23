import { getCollectionById } from '../data/hadithData';
import { getCachedData, setCachedData, STORES } from './cacheService';

const HADITH_JSON_CDN = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db';
const LOCAL_HADITH_PATH = '/data/hadith';
const ALQURANBD_API = 'https://alquranbd.com/api/hadith';
const URDU_HADITH_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

const collectionFileMap = {
  bukhari: 'the_9_books/bukhari',
  muslim: 'the_9_books/muslim',
  abudawud: 'the_9_books/abudawud',
  tirmidhi: 'the_9_books/tirmidhi',
  nasai: 'the_9_books/nasai',
  ibnmajah: 'the_9_books/ibnmajah',
  malik: 'the_9_books/malik',
  ahmad: 'the_9_books/ahmad',
  darimi: 'the_9_books/darimi',
  riyadussalihin: 'other_books/riyad_assalihin',
  shamail: 'other_books/shamail_muhammadiyah',
  bulugh: 'other_books/bulugh_almaram',
  adab: 'other_books/aladab_almufrad',
  mishkat: 'other_books/mishkat_almasabih',
  nawawi40: 'forties/nawawi40',
  qudsi40: 'forties/qudsi40',
  waliullah40: 'forties/shahwaliullah40'
};

const cdnOnlyCollections = ['ahmad'];

const alQuranBDBookMap = {
  bukhari: 1,
  muslim: 2,
  abudawud: 3,
  tirmidhi: 4,
  nasai: 5,
  ibnmajah: 6
};

const urduEditionMap = {
  bukhari: 'urd-bukhari',
  muslim: 'urd-muslim',
  abudawud: 'urd-abudawud',
  tirmidhi: 'urd-tirmidhi',
  nasai: 'urd-nasai',
  ibnmajah: 'urd-ibnmajah',
  malik: 'urd-malik',
  nawawi40: 'urd-nawawi'
};

let memoryCache = {
  collections: {},
  chapters: {},
  urdu: {},
  hadithApi: {}
};

export const fetchCollection = async (collectionSlug) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) {
    throw new Error(`Unknown collection: ${collectionSlug}`);
  }
  
  const apiId = collection.apiId;
  const cacheKey = `collection_${apiId}`;
  
  if (memoryCache.collections[apiId]) {
    return memoryCache.collections[apiId];
  }

  const cachedData = await getCachedData(STORES.HADITH_COLLECTIONS, cacheKey);
  if (cachedData) {
    memoryCache.collections[apiId] = cachedData;
    return cachedData;
  }

  const filePath = collectionFileMap[apiId];
  if (!filePath) {
    throw new Error(`Unknown collection API ID: ${apiId}`);
  }

  const useCdnOnly = cdnOnlyCollections.includes(apiId);
  
  try {
    let response;
    
    if (!useCdnOnly) {
      response = await fetch(`${LOCAL_HADITH_PATH}/${filePath}.json`);
    }
    
    if (useCdnOnly || !response || !response.ok) {
      console.log(`Fetching ${apiId} from CDN...`);
      response = await fetch(`${HADITH_JSON_CDN}/by_book/${filePath}.json`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.status}`);
    }
    const data = await response.json();
    
    memoryCache.collections[apiId] = data;
    await setCachedData(STORES.HADITH_COLLECTIONS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionSlug}:`, error);
    throw error;
  }
};

export const getChaptersFromCollection = (collectionData) => {
  if (!collectionData || !collectionData.chapters) {
    return [];
  }
  
  const hadithCounts = {};
  if (collectionData.hadiths) {
    collectionData.hadiths.forEach(h => {
      hadithCounts[h.chapterId] = (hadithCounts[h.chapterId] || 0) + 1;
    });
  }
  
  return collectionData.chapters.map(ch => ({
    id: ch.id,
    arabic: ch.arabic,
    english: ch.english,
    hadithCount: hadithCounts[ch.id] || 0
  }));
};

export const fetchChapter = async (collectionSlug, chapterId) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) {
    throw new Error(`Unknown collection: ${collectionSlug}`);
  }
  
  const apiId = collection.apiId;
  const cacheKey = `chapter_${apiId}_${chapterId}`;
  
  if (memoryCache.chapters[cacheKey]) {
    return memoryCache.chapters[cacheKey];
  }

  const cachedData = await getCachedData(STORES.HADITH_CHAPTERS, cacheKey);
  if (cachedData) {
    memoryCache.chapters[cacheKey] = cachedData;
    return cachedData;
  }

  const filePath = collectionFileMap[apiId];
  if (!filePath) {
    throw new Error(`Unknown collection: ${apiId}`);
  }

  try {
    const response = await fetch(`${HADITH_JSON_CDN}/by_chapter/${filePath}/${chapterId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.status}`);
    }
    const data = await response.json();
    
    memoryCache.chapters[cacheKey] = data;
    await setCachedData(STORES.HADITH_CHAPTERS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching chapter ${chapterId} from ${collectionSlug}:`, error);
    throw error;
  }
};

export const extractChaptersFromCollection = (collectionData) => {
  return getChaptersFromCollection(collectionData);
};

export const getHadithsByChapter = (collectionData, chapterId) => {
  if (!collectionData || !collectionData.hadiths) {
    return [];
  }
  return collectionData.hadiths.filter(h => h.chapterId === chapterId);
};

export const fetchBanglaHadiths = async (collectionSlug, chapterId, page = 1) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) return null;
  
  const bookId = alQuranBDBookMap[collection.apiId];
  if (!bookId) {
    return null;
  }

  const cacheKey = `bangla_${bookId}_${chapterId}_${page}`;
  
  const cachedData = await getCachedData(STORES.HADITH_CHAPTERS, cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${ALQURANBD_API}/chapter/${bookId}/${chapterId}/${page}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    
    await setCachedData(STORES.HADITH_CHAPTERS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Bangla hadiths:', error);
    return null;
  }
};

export const fetchBanglaChapters = async (collectionSlug) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) return null;
  
  const bookId = alQuranBDBookMap[collection.apiId];
  if (!bookId) {
    return null;
  }

  const cacheKey = `bangla_chapters_${bookId}`;
  
  const cachedData = await getCachedData(STORES.HADITH_CHAPTERS, cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${ALQURANBD_API}/chapters/${bookId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    
    await setCachedData(STORES.HADITH_CHAPTERS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Bangla chapters:', error);
    return null;
  }
};

export const fetchUrduHadiths = async (collectionSlug) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) return null;
  
  const editionId = urduEditionMap[collection.apiId];
  if (!editionId) {
    return null;
  }

  const cacheKey = `urdu_${editionId}`;

  if (memoryCache.urdu[editionId]) {
    return memoryCache.urdu[editionId];
  }

  const cachedData = await getCachedData(STORES.HADITH_COLLECTIONS, cacheKey);
  if (cachedData) {
    memoryCache.urdu[editionId] = cachedData;
    return cachedData;
  }

  try {
    const response = await fetch(`${URDU_HADITH_CDN}/${editionId}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    
    memoryCache.urdu[editionId] = data;
    await setCachedData(STORES.HADITH_COLLECTIONS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Urdu hadiths:', error);
    return null;
  }
};

export const getUrduHadithByNumber = (urduData, hadithNumber) => {
  if (!urduData || !urduData.hadiths) return null;
  return urduData.hadiths.find(h => h.hadithnumber === hadithNumber);
};

export const fetchHadithApiData = async (collectionSlug, chapterNum) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) return null;
  
  const cacheKey = `hadithapi_${collectionSlug}_${chapterNum}`;
  
  if (memoryCache.hadithApi[cacheKey]) {
    return memoryCache.hadithApi[cacheKey];
  }

  const cachedData = await getCachedData(STORES.HADITH_CHAPTERS, cacheKey);
  if (cachedData) {
    memoryCache.hadithApi[cacheKey] = cachedData;
    return cachedData;
  }

  try {
    const response = await fetch(`/api/hadith/${collectionSlug}/hadiths?chapter=${chapterNum}&paginate=100`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    
    memoryCache.hadithApi[cacheKey] = data;
    await setCachedData(STORES.HADITH_CHAPTERS, cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching from Hadith API:', error);
    return null;
  }
};

export const getHadithApiUrduText = (hadithApiData, hadithNumber) => {
  if (!hadithApiData?.hadiths?.data) return null;
  const hadith = hadithApiData.hadiths.data.find(h => 
    h.hadithNumber === hadithNumber || 
    h.hadithNumber === String(hadithNumber)
  );
  return hadith?.hadithUrdu || null;
};

export const searchHadiths = async (collectionData, query) => {
  if (!collectionData || !query) return [];
  
  const lowerQuery = query.toLowerCase();
  return collectionData.filter(hadith => {
    const englishText = hadith.english?.text?.toLowerCase() || '';
    const narrator = hadith.english?.narrator?.toLowerCase() || '';
    const arabic = hadith.arabic || '';
    
    return englishText.includes(lowerQuery) || 
           narrator.includes(lowerQuery) ||
           arabic.includes(query);
  });
};

export const getRandomHadith = async (collectionSlug = 'sahih-bukhari') => {
  try {
    const collection = await fetchCollection(collectionSlug);
    if (collection && collection.hadiths && collection.hadiths.length > 0) {
      const randomIndex = Math.floor(Math.random() * collection.hadiths.length);
      return {
        ...collection.hadiths[randomIndex],
        collectionSlug
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting random hadith:', error);
    return null;
  }
};

export const clearCache = () => {
  memoryCache = {
    collections: {},
    chapters: {},
    urdu: {},
    hadithApi: {}
  };
};
