import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

app.use(cors());
app.use(express.json());

app.use('/fonts', express.static(path.join(__dirname, '../client/public/fonts')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

app.get('/api/translations', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition/type/translation`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching translations:', error.message);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

app.get('/api/reciters', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition?format=audio&type=versebyverse`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch reciters' });
  }
});

app.get('/api/mp3-reciters', async (req, res) => {
  try {
    const response = await axios.get('https://www.mp3quran.net/api/v3/reciters?language=eng');
    const reciters = response.data.reciters || [];
    
    const formattedReciters = reciters
      .filter(r => r.moshaf && r.moshaf.length > 0)
      .map(r => {
        const moshaf = r.moshaf[0];
        const surahList = moshaf.surah_list ? moshaf.surah_list.split(',').map(Number) : [];
        return {
          id: r.id,
          name: r.name,
          server: moshaf.server,
          style: moshaf.name,
          availableSurahs: surahList,
          surahCount: moshaf.surah_total
        };
      })
      .filter(r => r.availableSurahs.length > 0)
      .sort((a, b) => b.surahCount - a.surahCount);
    
    res.json({ code: 200, data: formattedReciters });
  } catch (error) {
    console.error('Error fetching MP3 reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch MP3 reciters' });
  }
});

app.get('/api/scripts', async (req, res) => {
  try {
    const scripts = [
      { identifier: 'quran-uthmani', englishName: 'Uthmani', name: 'العثماني', description: 'Classic Uthmani script' },
      { identifier: 'quran-simple', englishName: 'Simple', name: 'بسيط', description: 'Simplified Arabic with diacritics' },
      { identifier: 'quran-simple-clean', englishName: 'Simple Clean', name: 'بسيط نظيف', description: 'Simplified without diacritics' },
      { identifier: 'quran-tajweed', englishName: 'Tajweed', name: 'تجويد', description: 'Color-coded tajweed rules' }
    ];
    res.json({ code: 200, data: scripts });
  } catch (error) {
    console.error('Error fetching scripts:', error.message);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

const TAFSIR_API_RAW = 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir';

app.get('/api/tafsirs', async (req, res) => {
  try {
    const response = await axios.get(`${TAFSIR_API_RAW}/editions.json`);
    const tafsirs = response.data.map(t => ({
      identifier: t.slug,
      id: t.id,
      name: t.name,
      englishName: t.name,
      author: t.author_name,
      language: t.language_name,
      source: t.source
    }));
    res.json({ code: 200, data: tafsirs });
  } catch (error) {
    console.error('Error fetching tafsirs:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsirs' });
  }
});

app.get('/api/tafsir/:surah/:ayah', async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const { slug } = req.query;
    
    if (slug) {
      const response = await axios.get(`${TAFSIR_API_RAW}/${slug}/${surah}/${ayah}.json`);
      res.json({ 
        code: 200, 
        data: { 
          text: response.data.text,
          surah: surah,
          ayah: ayah
        } 
      });
    } else {
      const response = await axios.get(`${QURAN_API_BASE}/ayah/${surah}:${ayah}/ar.muyassar`);
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error fetching tafsir:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsir' });
  }
});

app.get('/api/juz/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const response = await axios.get(`${QURAN_API_BASE}/juz/${number}/quran-uthmani`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching juz:', error.message);
    res.status(500).json({ error: 'Failed to fetch juz' });
  }
});

app.get('/api/sajda', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/sajda/quran-uthmani`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching sajda:', error.message);
    res.status(500).json({ error: 'Failed to fetch sajda verses' });
  }
});

app.get('/api/surahs', async (req, res) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/surah`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching surahs:', error.message);
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

app.get('/api/surah/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const { translation = 'en.asad', script = 'quran-uthmani', reciter = 'ar.alafasy' } = req.query;
    const [arabicRes, translationRes, audioRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${number}/${script}`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/${translation}`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/${reciter}`)
    ]);
    
    res.json({
      arabic: arabicRes.data,
      translation: translationRes.data,
      audio: audioRes.data
    });
  } catch (error) {
    console.error('Error fetching surah:', error.message);
    res.status(500).json({ error: 'Failed to fetch surah details' });
  }
});

app.get('/api/random-ayah', async (req, res) => {
  try {
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    const surahRes = await axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/en.asad`);
    const ayahs = surahRes.data.data.ayahs;
    const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
    res.json({
      data: {
        ...randomAyah,
        surah: {
          number: surahRes.data.data.number,
          name: surahRes.data.data.name,
          englishName: surahRes.data.data.englishName
        }
      }
    });
  } catch (error) {
    console.error('Error fetching random ayah:', error.message);
    res.status(500).json({ error: 'Failed to fetch random ayah' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
    const response = await axios.get(`${QURAN_API_BASE}/search/${keyword}/all/en.asad`);
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      res.json({ code: 200, data: { count: 0, matches: [] } });
    } else {
      console.error('Error searching:', error.message);
      res.status(500).json({ error: 'Search failed' });
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
