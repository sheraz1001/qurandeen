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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

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
    const [arabicRes, translationRes, audioRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${number}`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/en.asad`),
      axios.get(`${QURAN_API_BASE}/surah/${number}/ar.alafasy`)
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

app.get('/api/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
    const response = await axios.get(`${QURAN_API_BASE}/search/${encodeURIComponent(keyword)}/all/en.asad`);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching:', error.message);
    res.status(500).json({ error: 'Search failed' });
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
