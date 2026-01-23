const DB_NAME = 'QuranDeenCache';
const DB_VERSION = 1;

const STORES = {
  QURAN_TEXT: 'quranText',
  TRANSLATIONS: 'translations',
  WORD_BY_WORD: 'wordByWord',
  HADITH_COLLECTIONS: 'hadithCollections',
  HADITH_CHAPTERS: 'hadithChapters',
  TAFSIR: 'tafsir',
  METADATA: 'metadata'
};

let dbInstance = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORES.QURAN_TEXT)) {
        db.createObjectStore(STORES.QURAN_TEXT, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.TRANSLATIONS)) {
        db.createObjectStore(STORES.TRANSLATIONS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.WORD_BY_WORD)) {
        db.createObjectStore(STORES.WORD_BY_WORD, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.HADITH_COLLECTIONS)) {
        db.createObjectStore(STORES.HADITH_COLLECTIONS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.HADITH_CHAPTERS)) {
        db.createObjectStore(STORES.HADITH_CHAPTERS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.TAFSIR)) {
        db.createObjectStore(STORES.TAFSIR, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };
  });
};

export const getCachedData = async (storeName, key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.data) {
          if (result.expiry && result.expiry < Date.now()) {
            resolve(null);
          } else {
            resolve(result.data);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Cache read error:', request.error);
        resolve(null);
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
};

export const setCachedData = async (storeName, key, data, expiryHours = null) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const record = {
        key,
        data,
        timestamp: Date.now(),
        expiry: expiryHours ? Date.now() + (expiryHours * 60 * 60 * 1000) : null
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Cache write error:', request.error);
        resolve(false);
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return false;
  }
};

export const deleteCachedData = async (storeName, key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Cache delete error:', request.error);
        resolve(false);
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return false;
  }
};

export const clearStore = async (storeName) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Cache clear error:', request.error);
        resolve(false);
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return false;
  }
};

export const clearAllCache = async () => {
  try {
    const db = await openDB();
    const storeNames = Object.values(STORES);
    
    for (const storeName of storeNames) {
      await clearStore(storeName);
    }
    return true;
  } catch (error) {
    console.error('Clear all cache error:', error);
    return false;
  }
};

export const getCacheStats = async () => {
  try {
    const db = await openDB();
    const stats = {};

    for (const [name, storeName] of Object.entries(STORES)) {
      stats[name] = await new Promise((resolve) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
    }

    return stats;
  } catch (error) {
    console.error('Cache stats error:', error);
    return {};
  }
};

export const getCacheSizeEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usageFormatted: formatBytes(estimate.usage || 0),
        quotaFormatted: formatBytes(estimate.quota || 0),
        percentUsed: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Storage estimate error:', error);
    }
  }
  return null;
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export { STORES };
