import { getCollectionById } from '../data/hadithData';

const HADITH_JSON_CDN = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db';
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
  riyadussalihin: 'other_books/riyadussalihin',
  shamail: 'other_books/shamail',
  bulugh: 'other_books/bulugh',
  adab: 'other_books/adab',
  mishkat: 'other_books/mishkat',
  nawawi40: 'forties/nawawi40',
  qudsi40: 'forties/qudsi40',
  waliullah40: 'forties/shahwaliullah40'
};

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

let collectionsCache = {};
let chaptersCache = {};

export const fetchCollection = async (collectionSlug) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) {
    throw new Error(`Unknown collection: ${collectionSlug}`);
  }
  
  const apiId = collection.apiId;
  
  if (collectionsCache[apiId]) {
    return collectionsCache[apiId];
  }

  const filePath = collectionFileMap[apiId];
  if (!filePath) {
    throw new Error(`Unknown collection API ID: ${apiId}`);
  }

  try {
    const response = await fetch(`${HADITH_JSON_CDN}/by_book/${filePath}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.status}`);
    }
    const data = await response.json();
    collectionsCache[apiId] = data;
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
  const cacheKey = `${apiId}_${chapterId}`;
  
  if (chaptersCache[cacheKey]) {
    return chaptersCache[cacheKey];
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
    chaptersCache[cacheKey] = data;
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

  try {
    const response = await fetch(`${ALQURANBD_API}/chapter/${bookId}/${chapterId}/${page}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
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

  try {
    const response = await fetch(`${ALQURANBD_API}/chapters/${bookId}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Bangla chapters:', error);
    return null;
  }
};

let urduCache = {};
let hadithApiCache = {};

export const fetchUrduHadiths = async (collectionSlug) => {
  const collection = getCollectionById(collectionSlug);
  if (!collection) return null;
  
  const editionId = urduEditionMap[collection.apiId];
  if (!editionId) {
    return null;
  }

  if (urduCache[editionId]) {
    return urduCache[editionId];
  }

  try {
    const response = await fetch(`${URDU_HADITH_CDN}/${editionId}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    urduCache[editionId] = data;
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
  
  const cacheKey = `${collectionSlug}_${chapterNum}`;
  if (hadithApiCache[cacheKey]) {
    return hadithApiCache[cacheKey];
  }

  try {
    const response = await fetch(`/api/hadith/${collectionSlug}/hadiths?chapter=${chapterNum}&paginate=100`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    hadithApiCache[cacheKey] = data;
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
  collectionsCache = {};
  chaptersCache = {};
};
