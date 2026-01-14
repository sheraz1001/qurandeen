# Quran Deen (QuranDeen.com)

## Overview
A comprehensive web application for reading and listening to the Holy Quran. Built with Node.js/Express backend and React frontend. Uses the free Al Quran Cloud API for Quran data.

## Features
- **Home Page**: Lists all 114 surahs with Arabic and English names
- **Daily Ayah**: Shows a random inspiring ayah on the home page (cached daily)
- **Surah Page**: Displays ayahs with Arabic text, translation, and audio playback
- **Bookmarks**: Save favorite ayahs to a bookmarks page (stored in browser)
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
- `GET /api/surahs` - List all 114 surahs
- `GET /api/surah/:number?translation=&script=&reciter=` - Get surah details with Juz/Page/Ruku/Sajda info
- `GET /api/translations` - List all available translations
- `GET /api/reciters` - List all available audio reciters (23+)
- `GET /api/scripts` - List available Arabic script styles
- `GET /api/random-ayah` - Get a random ayah for daily inspiration
- `GET /api/search?keyword=` - Search ayahs by keyword
- `GET /api/juz/:number` - Get all ayahs in a specific juz
- `GET /api/tafsir/:surah/:ayah` - Get tafsir for a specific ayah

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
- **Al Majeed Quranic**: IndoPak Nastaleeq style (local)
- **IndoPak Nastaleeq**: Tarteel CDN font

## Recent Changes
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
