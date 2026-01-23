# Quran Deen (QuranDeen.com)

## Overview
Quran Deen is a comprehensive web application for reading and listening to the Holy Quran, aiming to be an interactive and educational platform for Muslims globally. It provides a central hub for engaging with the Quran and Islamic knowledge, featuring a powerful Quranic text and audio browser, an AI-powered Islamic scholar, and a suite of Islamic utilities. The project also includes a Quran teaching platform marketplace, a vast collection of authentic daily supplications (Azkaar & Duas), and an extensive Hadith library, all designed to be accessible via web and native mobile applications.

## User Preferences
I prefer detailed explanations and iterative development. Ask before making major architectural changes or introducing new external dependencies. I value clean code and clear documentation.

## System Architecture
The application follows a client-server architecture with a Node.js/Express backend and a React frontend.

**UI/UX Decisions:**
- Clean, professional, and responsive design optimized for readability across all devices.
- **Dark Theme Color Scheme:** Professional dark green (#0a1f15) background with gold (#c9a227) accents for highlights, CTAs, and decorative elements. Creates an elegant, Islamic-inspired aesthetic.
- Consistent branding with a red accent theme for admin interfaces.
- Customizable user settings (dark mode, font styles, reciters, translations).
- Sidebar-based navigation for both users and administrators.
- **Homepage Design:** Modern hero section with Arabic/English title, statistics panel, quick access cards, Ayah of the Day section, searchable surah grid, feature highlights, and resource cards.

**Technical Implementations & Feature Specifications:**
- **Quranic Display & Audio:** Displays all 114 surahs with multiple script styles (Uthmani, IndoPak, Nastaliq, Naskh Nastaleeq, Me Quran), font size controls, 150+ full surah reciters, and 23+ verse-by-verse reciters. Includes word-by-word Quran mode with audio and translation tooltips.
- **Translations & Tafsir:** Offers 100+ translations in 40+ languages and Tafsir al-Muyassar for ayah commentary.
- **Interactive Tools:**
    - **Quran Share Card Generator:** Customizable tool for creating shareable Quranic verse images.
    - **Daily Content:** Features "Quran Verse of the Day" and "Hadith of the Day."
    - **Islamic Utilities:** Includes Hijri-Gregorian Calendar Converter, Morning & Evening Adhkar, 99 Names of Allah Explorer, Prayer Times, Qibla Direction, and Ramadan Calendar.
- **Search & Navigation:** Advanced search, Juz browser, and ayah metadata display.
- **AI Chatbot:** An "Islamic Scholar AI Chatbot" provides answers with source citations and multilingual support.
- **User & Admin Management:** Secure authentication (email/password with JWT, Google OAuth), user dashboards for progress tracking and bookmarks, and admin dashboards for content and user management.
- **Content Management:** Public Islamic blog, contact page, and legal pages (Privacy Policy, Terms of Use).
- **Data Storage:** Local storage for user preferences, bookmarks, and reading history. IndexedDB-based smart caching for offline access to Quran text, translations, word-by-word data, Hadith collections/chapters, and Tafsir content.
- **SEO Optimization:** SEO-friendly URLs, keyword-rich route names, automatic redirects for legacy URLs, dynamic meta tags using react-helmet-async, JSON-LD schema markup, animated hero headers, server-generated sitemap.xml, and a robust robots.txt configuration.
- **Quran Teaching Platform:** A marketplace connecting Quran teachers and students with features like teacher profiles, class packages, booking system, commission model, payment processing (Stripe with commission split and race-condition protection), Jitsi Meet integration for video conferencing, and a real-time messaging system. An Admin Teacher Verification Dashboard is included.
- **Daily Azkaar & Duas Section:** Comprehensive collection from Hisnul Muslim with 134 categories and 298+ duas, including interactive recitation counter, progress tracking, font size controls, and search functionality. Data is stored locally for fast access.
- **Hadith Collections Section:** Library of 17 authentic Hadith books (50,000+ hadiths), supporting multiple languages (English, Arabic, Urdu, Bengali), font size controls, copy/share functionality, and chapter navigation. Data sourced from hadith-json CDN.
- **Progressive Web App (PWA) & Mobile App Support:** Configured as a PWA with features like installability, offline caching, push notifications, and app shortcuts. Utilizes Capacitor for native iOS and Android app distribution, with custom manifest and service worker implementations.

## External Dependencies
- **Al Quran Cloud API:** For Quranic text, translations, surah info, and reciter data.
- **MP3Quran.net API:** Provides full surah audio recitations.
- **Quran.com API:** Used for word-by-word Quran data.
- **Google OAuth:** For user authentication.
- **html2canvas:** For client-side rendering of HTML to images in the Share Card Generator.
- **jsPDF:** For client-side PDF generation in the Share Card Generator.
- **Aladhan API:** For Islamic prayer times, Hijri calendar, and Ramadan schedules.
- **Stripe:** Payment processing for the Quran Teaching Platform.
- **Jitsi Meet:** Video conferencing integration for classes.
- **jsDelivr (AhmedBaset/hadith-json):** CDN for Hadith data.
- **alQuranBD API:** Optional for Bengali Hadith translations.