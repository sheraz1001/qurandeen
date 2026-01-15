import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupAuth, registerAuthRoutes, isAuthenticated } from './replit_integrations/auth/index.js';
import { db } from './db.js';
import { blogs, bookmarks, readingProgress, users } from '../shared/schema.js';
import { eq, and, desc } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const TAFSIR_API_RAW = 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir';

app.use(cors());
app.use(express.json());

app.use('/fonts', express.static(path.join(__dirname, '../client/public/fonts')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Setup authentication
await setupAuth(app);
registerAuthRoutes(app);

// Middleware to check if user is admin
const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || !req.user?.claims?.sub) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = req.user.claims.sub;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  
  next();
};

// ============ QURAN API ROUTES ============

app.get('/api/translations', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition/type/translation`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching translations:', error.message);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

app.get('/api/reciters', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/edition?format=audio&type=versebyverse`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch reciters' });
  }
});

app.get('/api/mp3-reciters', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://www.mp3quran.net/api/v3/reciters?language=eng');
    const reciters = response.data.reciters || [];
    
    const formattedReciters = reciters
      .filter((r: any) => r.moshaf && r.moshaf.length > 0)
      .map((r: any) => {
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
      .filter((r: any) => r.availableSurahs.length > 0)
      .sort((a: any, b: any) => b.surahCount - a.surahCount);
    
    res.json({ code: 200, data: formattedReciters });
  } catch (error: any) {
    console.error('Error fetching MP3 reciters:', error.message);
    res.status(500).json({ error: 'Failed to fetch MP3 reciters' });
  }
});

app.get('/api/scripts', async (req: Request, res: Response) => {
  try {
    const scripts = [
      { identifier: 'quran-uthmani', englishName: 'Uthmani', name: 'العثماني', description: 'Classic Uthmani script' },
      { identifier: 'quran-simple', englishName: 'Simple', name: 'بسيط', description: 'Simplified Arabic with diacritics' },
      { identifier: 'quran-simple-clean', englishName: 'Simple Clean', name: 'بسيط نظيف', description: 'Simplified without diacritics' },
      { identifier: 'quran-tajweed', englishName: 'Tajweed', name: 'تجويد', description: 'Color-coded tajweed rules' }
    ];
    res.json({ code: 200, data: scripts });
  } catch (error: any) {
    console.error('Error fetching scripts:', error.message);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

app.get('/api/tafsirs', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${TAFSIR_API_RAW}/editions.json`);
    const tafsirs = response.data.map((t: any) => ({
      identifier: t.slug,
      id: t.id,
      name: t.name,
      englishName: t.name,
      author: t.author_name,
      language: t.language_name,
      source: t.source
    }));
    res.json({ code: 200, data: tafsirs });
  } catch (error: any) {
    console.error('Error fetching tafsirs:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsirs' });
  }
});

app.get('/api/tafsir/:surah/:ayah', async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Error fetching tafsir:', error.message);
    res.status(500).json({ error: 'Failed to fetch tafsir' });
  }
});

app.get('/api/juz/:number', async (req: Request, res: Response) => {
  try {
    const { number } = req.params;
    const response = await axios.get(`${QURAN_API_BASE}/juz/${number}/quran-uthmani`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching juz:', error.message);
    res.status(500).json({ error: 'Failed to fetch juz' });
  }
});

app.get('/api/sajda', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/sajda/quran-uthmani`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching sajda:', error.message);
    res.status(500).json({ error: 'Failed to fetch sajda verses' });
  }
});

app.get('/api/surahs', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${QURAN_API_BASE}/surah`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching surahs:', error.message);
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

app.get('/api/surah/:number', async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Error fetching surah:', error.message);
    res.status(500).json({ error: 'Failed to fetch surah details' });
  }
});

app.get('/api/random-ayah', async (req: Request, res: Response) => {
  try {
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    
    const [arabicRes, englishRes, urduRes] = await Promise.all([
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/quran-uthmani`),
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/en.asad`),
      axios.get(`${QURAN_API_BASE}/surah/${randomSurah}/ur.jalandhry`)
    ]);
    
    const ayahCount = arabicRes.data.data.ayahs.length;
    const randomIndex = Math.floor(Math.random() * ayahCount);
    
    const arabicAyah = arabicRes.data.data.ayahs[randomIndex];
    const englishAyah = englishRes.data.data.ayahs[randomIndex];
    const urduAyah = urduRes.data.data.ayahs[randomIndex];
    
    res.json({
      data: {
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        arabic: arabicAyah.text,
        english: englishAyah.text,
        urdu: urduAyah.text,
        surah: {
          number: arabicRes.data.data.number,
          name: arabicRes.data.data.name,
          englishName: arabicRes.data.data.englishName
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching random ayah:', error.message);
    res.status(500).json({ error: 'Failed to fetch random ayah' });
  }
});

app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
    const response = await axios.get(`${QURAN_API_BASE}/search/${keyword}/all/en.asad`);
    res.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      res.json({ code: 200, data: { count: 0, matches: [] } });
    } else {
      console.error('Error searching:', error.message);
      res.status(500).json({ error: 'Search failed' });
    }
  }
});

// ============ USER BOOKMARKS ROUTES ============

app.get('/api/user/bookmarks', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const userBookmarks = await db.select().from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));
    res.json({ data: userBookmarks });
  } catch (error: any) {
    console.error('Error fetching bookmarks:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

app.post('/api/user/bookmarks', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const { surahNumber, ayahNumber, surahName, surahNameArabic, ayahText } = req.body;
    
    const [bookmark] = await db.insert(bookmarks).values({
      userId,
      surahNumber,
      ayahNumber,
      surahName,
      surahNameArabic,
      ayahText
    }).returning();
    
    res.json({ data: bookmark });
  } catch (error: any) {
    console.error('Error adding bookmark:', error.message);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

app.delete('/api/user/bookmarks/:id', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const { id } = req.params;
    
    await db.delete(bookmarks).where(
      and(eq(bookmarks.id, id), eq(bookmarks.userId, userId))
    );
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting bookmark:', error.message);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// ============ READING PROGRESS ROUTES ============

app.get('/api/user/progress', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const progress = await db.select().from(readingProgress)
      .where(eq(readingProgress.userId, userId))
      .orderBy(desc(readingProgress.updatedAt));
    res.json({ data: progress });
  } catch (error: any) {
    console.error('Error fetching progress:', error.message);
    res.status(500).json({ error: 'Failed to fetch reading progress' });
  }
});

app.post('/api/user/progress', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const { surahNumber, lastAyahRead, completed } = req.body;
    
    const [progress] = await db.insert(readingProgress).values({
      userId,
      surahNumber,
      lastAyahRead,
      completed,
      completedAt: completed ? new Date() : null
    }).onConflictDoUpdate({
      target: [readingProgress.userId, readingProgress.surahNumber],
      set: {
        lastAyahRead,
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      }
    }).returning();
    
    res.json({ data: progress });
  } catch (error: any) {
    console.error('Error updating progress:', error.message);
    res.status(500).json({ error: 'Failed to update reading progress' });
  }
});

app.get('/api/user/stats', isAuthenticated, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const progress = await db.select().from(readingProgress)
      .where(eq(readingProgress.userId, userId));
    
    const completedSurahs = progress.filter(p => p.completed).length;
    const inProgressSurahs = progress.filter(p => !p.completed && (p.lastAyahRead ?? 0) > 0).length;
    
    res.json({
      data: {
        completedSurahs,
        inProgressSurahs,
        totalProgress: progress.length,
        percentComplete: Math.round((completedSurahs / 114) * 100)
      }
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// ============ BLOG ROUTES (PUBLIC) ============

app.get('/api/blogs', async (req: Request, res: Response) => {
  try {
    const publishedBlogs = await db.select().from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.createdAt));
    res.json({ data: publishedBlogs });
  } catch (error: any) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    
    if (!blog || !blog.published) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json({ data: blog });
  } catch (error: any) {
    console.error('Error fetching blog:', error.message);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// ============ ADMIN BLOG ROUTES ============

app.get('/api/admin/blogs', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    res.json({ data: allBlogs });
  } catch (error: any) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.post('/api/admin/blogs', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    const { title, slug, content, excerpt, featuredImage, category, published } = req.body;
    
    const [blog] = await db.insert(blogs).values({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      published: published || false,
      authorId: userId
    }).returning();
    
    res.json({ data: blog });
  } catch (error: any) {
    console.error('Error creating blog:', error.message);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

app.put('/api/admin/blogs/:id', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, featuredImage, category, published } = req.body;
    
    const [blog] = await db.update(blogs)
      .set({
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        category,
        published,
        updatedAt: new Date()
      })
      .where(eq(blogs.id, id))
      .returning();
    
    res.json({ data: blog });
  } catch (error: any) {
    console.error('Error updating blog:', error.message);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/api/admin/blogs/:id', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(blogs).where(eq(blogs.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog:', error.message);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ============ ADMIN USER ROUTES ============

app.get('/api/admin/users', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    res.json({ data: allUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id/role', isAuthenticated, isAdmin, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    res.json({ data: user });
  } catch (error: any) {
    console.error('Error updating user role:', error.message);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ============ STATIC FILES ============

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
