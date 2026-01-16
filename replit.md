# Quran Deen (QuranDeen.com)

## Overview
A comprehensive web application for reading and listening to the Holy Quran. Built with Node.js/Express backend and React frontend. Uses the free Al Quran Cloud API for Quran data.

## Features
- **Features Page**: Comprehensive showcase of all platform features, Quran stats, and facts
- **Tools Section**: Free Islamic tools collection including:
  - Advanced Quran Share Card Generator:
    - 6 social media size presets (Instagram Post/Story, Facebook, Twitter, Pinterest, YouTube)
    - 4 Arabic font styles (Uthmani, Naskh, Nastaliq, Modern)
    - 15+ translation languages with API integration
    - Font size slider control (24-64px)
    - 8 gradient background options
    - QuranDeen.com logo/watermark toggle
    - Download as PNG (high resolution using html2canvas)
    - Download as PDF (crisp exports using jsPDF)
    - Share on Twitter/WhatsApp and copy text
  - Quran Verse of the Day: Daily random ayah with translation, reflection, and share buttons
  - Hijri-Gregorian Calendar Converter: Date conversion with important Islamic dates
  - Morning & Evening Adhkar: Authentic duas with Arabic, transliteration, translation
  - 99 Names of Allah Explorer: Interactive list with meanings, Quranic verses, and reflections
  - Hadith of the Day: Curated authentic hadith from Bukhari/Muslim with explanations
- **Home Page**: Lists all 114 surahs with Arabic and English names
- **Daily Ayah**: Shows Arabic, English, and Urdu translations (cached daily)
- **Surah Page**: Displays ayahs with Arabic text, translation, and audio playback
- **MP3 Audio Page**: Full surah audio playback with 150+ reciters including Youssef Edghouch (from MP3Quran.net API)
- **Islamic Scholar AI Chatbot**: Advanced AI assistant for Quran, Hadith, and Tafsir queries
  - Answers based strictly on Quran and authentic Hadith (Sahih Bukhari, Muslim, etc.)
  - Provides source citations (Surah:Ayah, Hadith collection)
  - Multilingual support (responds in user's language)
  - Streaming responses with markdown formatting
  - Suggested questions for quick start
- **Bookmarks**: Save favorite ayahs to a bookmarks page (stored in browser)
- **Reading History**: Automatically tracks recently read surahs, shown on home page
- **User Authentication**: Standalone signup/login system with email/password
  - Signup collects: Name, Email, Password, City, Country
  - JWT-based session management with bcrypt password hashing
  - Admin user: admin@qurandeen.com / admin123
- **User Dashboard**: Personal dashboard for logged-in users
  - Quran Read Tracker: Mark surahs as completed, track progress
  - Synced Bookmarks: Cloud-saved bookmarks across devices
  - My Profile: Edit name, city, country; change password; view account info
  - Free Resources: Curated Islamic resources (Quran.com, Sunnah.com, etc.)
  - Progress statistics and visualization
- **Admin Dashboard**: Admin-only management panel
  - Blog Management: Create, edit, publish, delete blog posts
  - User List: View all registered users
- **Islamic Blog**: Public blog page for Islamic knowledge articles
- **Settings Page**: Comprehensive settings for customization:
  - Arabic Font Style: Uthmani, IndoPak (Al Majeed Quranic font), Simple
  - Arabic Script Data: Uthmani, Simple, Simple Clean, Tajweed
  - Font Size Controls: Adjust Arabic text size (16-48px)
  - Reciter Selection: 23+ audio reciters including Mishary Rashid al-Afasy, Abdul Samad, Sudais, etc.
  - Translation Selection: 100+ translations in 40+ languages
  - Dark Mode Toggle
- **Share Buttons**: Share ayahs on Twitter, WhatsApp, or copy to clipboard
- **Search**: Search ayahs by keyword across the entire Quran
- **Juz Browser**: Browse all 30 Juz with surahs grouped by juz
- **Ayah Metadata**: Juz, Page, and Ruku information displayed for each ayah
- **Sajda Markers**: Visual indicators for prostration verses (obligatory/recommended)
- **Tafsir (Commentary)**: Toggle to show Tafsir al-Muyassar for each ayah
- **Responsive**: Works on desktop and mobile

## Project Structure
```
/
├── server/
│   └── index.js          # Express backend with API routes
├── client/
│   ├── src/
│   │   ├── components/   # React components (Header, Loading, ErrorMessage)
│   │   ├── pages/        # Page components (Home, Surah, Search, Bookmarks, Settings)
│   │   ├── styles/       # CSS styles (index.css, settings.css)
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/fonts/     # Custom fonts (Al Majeed Quranic)
│   └── dist/             # Built production files
└── package.json          # Root package config
```

## API Endpoints
### Quran APIs
- `GET /api/surahs` - List all 114 surahs
- `GET /api/surah/:number?translation=&script=&reciter=` - Get surah details with Juz/Page/Ruku/Sajda info
- `GET /api/translations` - List all available translations
- `GET /api/reciters` - List all available audio reciters (23+ verse-by-verse)
- `GET /api/mp3-reciters` - List all MP3 reciters (150+ full surah audio from MP3Quran.net)
- `GET /api/scripts` - List available Arabic script styles
- `GET /api/random-ayah` - Get a random ayah for daily inspiration (Arabic, English, Urdu)
- `GET /api/search?keyword=` - Search ayahs by keyword
- `GET /api/juz/:number` - Get all ayahs in a specific juz
- `GET /api/tafsir/:surah/:ayah` - Get tafsir for a specific ayah

### Auth APIs
- `POST /api/auth/signup` - Register new user (name, email, password, city, country)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info (protected)

### User APIs (protected)
- `GET /api/user/reading-progress` - Get user's reading progress
- `POST /api/user/reading-progress` - Update reading progress
- `GET /api/user/bookmarks` - Get user's bookmarks
- `POST /api/user/bookmarks` - Add bookmark
- `DELETE /api/user/bookmarks/:surah/:ayah` - Remove bookmark

### Blog APIs
- `GET /api/blogs` - List published blogs
- `GET /api/blogs/:slug` - Get single blog post

### Admin APIs (protected, admin only)
- `GET /api/admin/blogs` - List all blogs
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog
- `GET /api/admin/users` - List all users

## Running the Project
- **Production**: `NODE_ENV=production node server/index.js` (serves built React app on port 5000)
- **Development**: `npm run dev` (runs backend and frontend dev servers concurrently)

## External API
Uses Al Quran Cloud API (https://api.alquran.cloud/v1/)

## Local Storage
- `darkMode` - Theme preference
- `fontSize` - Arabic text size preference
- `bookmarks` - Saved ayahs
- `readingHistory` - Recently read surahs
- `dailyAyah` - Cached daily ayah
- `selectedTranslation` - Preferred translation edition
- `selectedReciter` - Preferred audio reciter
- `selectedScript` - Preferred Arabic script data
- `selectedFont` - Preferred Arabic font style (uthmani, indopak, simple)

## Custom Fonts
- **KFGQPC Uthmani**: Classic Uthmanic script (CDN)
- **PDMS Saleem**: Professional IndoPak style (local) - matches Quran.com style
- **IndoPak Nastaleeq**: Tarteel CDN font (Nastaliq style)
- **Al Majeed Quranic**: Alternative IndoPak style (local)

## Recent Changes
- January 16, 2026: Added Word-by-Word Quran mode using Quran.com API:
  - Clickable words with per-word audio playback
  - Hover tooltips showing translation and transliteration
  - Auto-loads all ayahs in batches when mode is enabled
  - Mobile/touch friendly with tap support
  - Playing state highlights active word
- January 16, 2026: Added professional PDMS Saleem IndoPak font (Quran.com style)
- January 16, 2026: Added comprehensive Islamic Tools section with 6 free tools:
  - Quran Share Card Generator: Create verse cards with multiple backgrounds for social sharing
  - Quran Verse of the Day: Daily cached ayah with full metadata and share functionality
  - Hijri-Gregorian Calendar Converter: Date conversion with list of important Islamic dates
  - Morning & Evening Adhkar: Authentic duas with Arabic, transliteration, translation
  - 99 Names of Allah Explorer: Interactive list with meanings, Quranic verses, search
  - Hadith of the Day: Curated authentic hadiths with explanations and share options
- January 16, 2026: Enhanced random-ayah API to include juz, page, and revelationType metadata
- January 15, 2026: Added professional two-tier header with top utility bar (social icons, Bookmarks, Settings, Profile)
- January 15, 2026: Added Islamic Scholar AI Chatbot for Quran, Hadith, and Tafsir queries (with streaming responses)
- January 15, 2026: Added user authentication with signup/login (collects name, email, password, city, country)
- January 15, 2026: Added User Dashboard with Quran Read Tracker, synced bookmarks, and free resources
- January 15, 2026: Added Admin Dashboard with blog management (create, edit, publish, delete)
- January 15, 2026: Added public Islamic Blog page
- January 15, 2026: Updated Ayah of the Day to show Arabic, English, and Urdu translations
- January 15, 2026: Added MP3 Audio page with 150+ reciters including Youssef Edghouch for full surah playback
- January 15, 2026: Added multilingual Tafsir support (Urdu, Arabic, English, Bengali) via Tafsir API
- January 15, 2026: Renamed website to Quran Deen (QuranDeen.com)
- January 14, 2026: Added Juz browser page with navigation and surah grouping
- January 14, 2026: Added Juz/Para, Page, and Ruku information badges to each ayah
- January 14, 2026: Added Sajda (prostration) markers with pulsing animation
- January 14, 2026: Added Tafsir (commentary) toggle feature using Tafsir al-Muyassar
- January 14, 2026: Added browse links on home page (Juz, Bookmarks, Settings)
- January 14, 2026: Added Settings page with Arabic font styles (Uthmani, IndoPak, Simple), 23+ reciters, script data options
- January 14, 2026: Added Al Majeed Quranic font for IndoPak style
- January 14, 2026: Added multi-language translation selector with 100+ options
- January 14, 2026: Added bookmarks, reading history, font controls, share buttons, and daily ayah features
- January 14, 2026: Initial build with all core features
