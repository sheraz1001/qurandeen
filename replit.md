# Quran Website

## Overview
A web application for reading and listening to the Holy Quran. Built with Node.js/Express backend and React frontend. Uses the free Al Quran Cloud API for Quran data.

## Features
- **Home Page**: Lists all 114 surahs with Arabic and English names
- **Surah Page**: Displays ayahs with Arabic text, English translation (en.asad edition), and audio playback (ar.alafasy edition)
- **Search**: Search ayahs by keyword across the entire Quran
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works on desktop and mobile

## Project Structure
```
/
├── server/
│   └── index.js          # Express backend with API routes
├── client/
│   ├── src/
│   │   ├── components/   # React components (Header, Loading, ErrorMessage)
│   │   ├── pages/        # Page components (Home, Surah, Search)
│   │   ├── styles/       # CSS styles
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── dist/             # Built production files
└── package.json          # Root package config
```

## API Endpoints
- `GET /api/surahs` - List all 114 surahs
- `GET /api/surah/:number` - Get surah details with Arabic text, translation, and audio
- `GET /api/search?keyword=` - Search ayahs by keyword

## Running the Project
- **Production**: `NODE_ENV=production node server/index.js` (serves built React app on port 5000)
- **Development**: `npm run dev` (runs backend and frontend dev servers concurrently)

## External API
Uses Al Quran Cloud API (https://api.alquran.cloud/v1/)

## Recent Changes
- January 14, 2026: Initial build with all features
