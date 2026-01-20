const HADITH_JSON_CDN = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db';
const ALQURANBD_API = 'https://alquranbd.com/api/hadith';

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
  shahwaliullah40: 'forties/shahwaliullah40'
};

const alQuranBDBookMap = {
  bukhari: 1,
  muslim: 2,
  abudawud: 3,
  tirmidhi: 4,
  nasai: 5,
  ibnmajah: 6
};

const hadithApiComBookMap = {
  bukhari: 'sahih-bukhari',
  muslim: 'sahih-muslim',
  abudawud: 'sunan-abu-dawud',
  tirmidhi: 'al-tirmidhi',
  nasai: 'sunan-nasai',
  ibnmajah: 'sunan-ibn-e-majah'
};

let collectionsCache = {};
let chaptersCache = {};

export const fetchCollection = async (collectionId) => {
  if (collectionsCache[collectionId]) {
    return collectionsCache[collectionId];
  }

  const filePath = collectionFileMap[collectionId];
  if (!filePath) {
    throw new Error(`Unknown collection: ${collectionId}`);
  }

  try {
    const response = await fetch(`${HADITH_JSON_CDN}/by_book/${filePath}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.status}`);
    }
    const data = await response.json();
    collectionsCache[collectionId] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionId}:`, error);
    throw error;
  }
};

export const fetchChapter = async (collectionId, chapterId) => {
  const cacheKey = `${collectionId}_${chapterId}`;
  if (chaptersCache[cacheKey]) {
    return chaptersCache[cacheKey];
  }

  const filePath = collectionFileMap[collectionId];
  if (!filePath) {
    throw new Error(`Unknown collection: ${collectionId}`);
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
    console.error(`Error fetching chapter ${chapterId} from ${collectionId}:`, error);
    throw error;
  }
};

export const extractChaptersFromCollection = (collectionData) => {
  if (!collectionData || !Array.isArray(collectionData)) {
    return [];
  }

  const chaptersMap = new Map();
  
  collectionData.forEach(hadith => {
    if (hadith.chapter && !chaptersMap.has(hadith.chapterId)) {
      chaptersMap.set(hadith.chapterId, {
        id: hadith.chapterId,
        arabic: hadith.chapter?.arabic || '',
        english: hadith.chapter?.english || '',
        hadithCount: 0
      });
    }
    if (chaptersMap.has(hadith.chapterId)) {
      chaptersMap.get(hadith.chapterId).hadithCount++;
    }
  });

  return Array.from(chaptersMap.values()).sort((a, b) => a.id - b.id);
};

export const getHadithsByChapter = (collectionData, chapterId) => {
  if (!collectionData || !Array.isArray(collectionData)) {
    return [];
  }
  return collectionData.filter(h => h.chapterId === chapterId);
};

export const fetchBanglaHadiths = async (collectionId, chapterId, page = 1) => {
  const bookId = alQuranBDBookMap[collectionId];
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

export const fetchBanglaChapters = async (collectionId) => {
  const bookId = alQuranBDBookMap[collectionId];
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

export const getRandomHadith = async (collectionId = 'bukhari') => {
  try {
    const collection = await fetchCollection(collectionId);
    if (collection && collection.length > 0) {
      const randomIndex = Math.floor(Math.random() * collection.length);
      return {
        ...collection[randomIndex],
        collectionId
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
