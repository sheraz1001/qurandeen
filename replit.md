# Quran Deen (QuranDeen.com)

## Overview
A comprehensive web application for reading and listening to the Holy Quran. Built with Node.js/Express backend (TypeScript) and React frontend. Uses the free Al Quran Cloud API for Quran data. Includes user authentication, personal dashboards, and admin blog management.

## Features
- **Home Page**: Lists all 114 surahs with Arabic and English names
- **Daily Ayah**: Shows a random inspiring ayah on the home page (cached daily)
- **Surah Page**: Displays ayahs with Arabic text, translation, and audio playback
- **MP3 Audio Page**: Full surah audio playback with 150+ reciters including Youssef Edghouch (from MP3Quran.net API)
- **User Authentication**: Sign in with Replit Auth (Google, GitHub, Apple, email)
- **User Dashboard**: Personal dashboard with Quran read tracker, cloud-synced bookmarks, and free resources
- **Admin Dashboard**: Blog management system with create/edit/publish/delete posts, user management with role control
- **Blog Page**: Public blog section for Islamic knowledge and Quran insights
- **Bookmarks**: Save favorite ayahs (synced to cloud when logged in, localStorage for guests)
- **Reading History**: Automatically tracks recently read surahs, shown on home page
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
│   ├── index.ts          # Express backend with API routes (TypeScript)
│   └── db.ts             # Database connection with Drizzle ORM
├── shared/
│   ├── schema.ts         # Database schema (users, blogs, bookmarks, reading_progress)
│   └── models/           # Auth, blogs, bookmarks, reading_progress models
├── client/
│   ├── src/
│   │   ├── components/   # React components (Header, Loading, ErrorMessage)
│   │   ├── pages/        # Page components (Home, Surah, Dashboard, AdminDashboard, Blog)
│   │   ├── hooks/        # Custom hooks (use-auth.ts for authentication)
│   │   ├── styles/       # CSS styles (index.css, settings.css)
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/fonts/     # Custom fonts (Al Majeed Quranic)
│   └── dist/             # Built production files
├── drizzle.config.ts     # Drizzle ORM configuration
└── package.json          # Root package config
```

## API Endpoints

### Quran Data
- `GET /api/surahs` - List all 114 surahs
- `GET /api/surah/:number?translation=&script=&reciter=` - Get surah details with Juz/Page/Ruku/Sajda info
- `GET /api/translations` - List all available translations
- `GET /api/reciters` - List all available audio reciters (23+ verse-by-verse)
- `GET /api/mp3-reciters` - List all MP3 reciters (150+ full surah audio from MP3Quran.net)
- `GET /api/scripts` - List available Arabic script styles
- `GET /api/random-ayah` - Get a random ayah for daily inspiration
- `GET /api/search?keyword=` - Search ayahs by keyword
- `GET /api/juz/:number` - Get all ayahs in a specific juz
- `GET /api/tafsir/:surah/:ayah` - Get tafsir for a specific ayah

### Authentication
- `GET /api/login` - Initiate Replit Auth login flow
- `GET /api/logout` - Log out current user
- `GET /api/auth/user` - Get current authenticated user info

### User (requires authentication)
- `GET /api/user/bookmarks` - Get user's bookmarks
- `POST /api/user/bookmarks` - Add a bookmark
- `DELETE /api/user/bookmarks/:id` - Remove a bookmark
- `GET /api/user/progress` - Get reading progress
- `POST /api/user/progress` - Update reading progress
- `GET /api/user/stats` - Get user statistics (surahs read, ayahs read)

### Admin (requires admin role)
- `GET /api/admin/blogs` - List all blog posts
- `POST /api/admin/blogs` - Create new blog post
- `PUT /api/admin/blogs/:id` - Update blog post
- `DELETE /api/admin/blogs/:id` - Delete blog post
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Change user role

### Public Blog
- `GET /api/blogs` - Get published blog posts

## Running the Project
- **Production**: `NODE_ENV=production tsx server/index.ts` (serves built React app on port 5000)
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
- **Al Majeed Quranic**: IndoPak Nastaleeq style (local)
- **IndoPak Nastaleeq**: Tarteel CDN font

## Database Tables
- **users**: id, username, email, role (user/admin), created_at
- **sessions**: id, user_id, expires_at (for session management)
- **blogs**: id, title, slug, content, excerpt, category, featured_image, published, author_id, created_at, updated_at
- **bookmarks**: id, user_id, surah_number, ayah_number, surah_name, ayah_text, translation, created_at
- **reading_progress**: id, user_id, surah_number, ayahs_read, completed, last_read_at

## User Roles
- **user**: Default role, can access dashboard, save bookmarks, track reading progress
- **admin**: Can manage blog posts and change user roles via admin dashboard

## Recent Changes
- January 15, 2026: Added User Authentication with Replit Auth (Google, GitHub, Apple, email)
- January 15, 2026: Added User Dashboard with Read Tracker, Bookmarks, Free Resources
- January 15, 2026: Added Admin Dashboard with Blog Management and User Role Control
- January 15, 2026: Added Blog page for public viewing of published posts
- January 15, 2026: Migrated server from JavaScript to TypeScript with Drizzle ORM
- January 15, 2026: Added PostgreSQL database with users, blogs, bookmarks, reading_progress tables
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
