# Quran Deen (QuranDeen.com)

## Overview
Quran Deen is a comprehensive web application designed for reading and listening to the Holy Quran. It aims to provide a rich, interactive, and educational platform for Muslims worldwide. The project integrates advanced features for Quranic study, spiritual reflection, and practical Islamic tools, making QuranDeen.com a central hub for engaging with the Quran and Islamic knowledge. Key capabilities include a powerful Quranic text and audio browser, an AI-powered Islamic scholar, and a suite of Islamic utilities.

## User Preferences
I prefer detailed explanations and iterative development. Ask before making major architectural changes or introducing new external dependencies. I value clean code and clear documentation.

## System Architecture
The application follows a client-server architecture with a Node.js/Express backend and a React frontend.

**UI/UX Decisions:**
- Professional, clean design with a focus on readability and ease of navigation.
- Responsive design ensuring full functionality across desktop and mobile devices.
- Consistent branding with a distinct red accent theme for admin interfaces.
- Customizable settings for user preferences (dark mode, font styles, reciters, translations).
- Sidebar-based dashboards for both users and administrators for organized navigation.

**Technical Implementations & Feature Specifications:**
- **Quranic Display & Audio:** Displays all 114 surahs, individual ayahs with Arabic text, multiple script styles (Uthmani, IndoPak, Nastaliq, Naskh Nastaleeq, Me Quran), and font size controls. Integrates over 150 full surah audio reciters and 23+ verse-by-verse reciters. Supports word-by-word Quran mode with clickable words for audio and translation tooltips.
- **Translations & Tafsir:** Offers 100+ translations in 40+ languages and includes Tafsir al-Muyassar for ayah commentary.
- **Interactive Tools:**
    - **Quran Share Card Generator:** Customizable tool for creating shareable Quranic verse images for social media with various presets, fonts, backgrounds, and download options (PNG/PDF).
    - **Daily Content:** Features "Quran Verse of the Day" with translation and reflection, and "Hadith of the Day" from authentic sources.
    - **Islamic Utilities:** Includes a Hijri-Gregorian Calendar Converter, Morning & Evening Adhkar, and an interactive "99 Names of Allah Explorer."
- **Search & Navigation:** Advanced search functionality for ayahs by keyword, Juz browser for navigating the 30 Juz, and displays ayah metadata (Juz, Page, Ruku, Sajda markers).
- **AI Chatbot:** An "Islamic Scholar AI Chatbot" provides answers based on Quran and authentic Hadith, offers source citations, multilingual support, and streaming responses.
- **User Management:**
    - **Authentication:** Secure signup/login with email/password (JWT-based sessions, bcrypt hashing) and Google OAuth integration.
    - **User Dashboard:** Personalized dashboard for tracking Quran reading progress, managing cloud-synced bookmarks, editing profiles, and accessing internal tools.
- **Admin Management:**
    - **Admin Dashboard:** Dedicated panel for managing blog posts (create, edit, publish, delete) and user accounts.
- **Content Management:**
    - **Islamic Blog:** A public blog for Islamic knowledge articles.
    - **Contact Us Page:** Professional contact form with FAQs, social links, and mission statement.
    - **Legal Pages:** Comprehensive Privacy Policy and Terms of Use.
- **Data Storage:** Utilizes local storage for user preferences (dark mode, font size, selected reciter/translation/script/font), bookmarks, reading history, and cached daily ayah.
- **SEO Optimization:**
    - **SEO-Friendly URLs:** All 114 Surah pages use numbered slug-based URLs (e.g., `/surah/1-al-fatihah`, `/surah/2-al-baqarah`). Old numeric URLs (`/surah/1`) and old slug URLs (`/surah/al-fatihah`) automatically redirect to the canonical numbered slugs.
    - **Keyword-Rich Route Names:** Main navigation routes use descriptive SEO-friendly slugs:
        - `/quran-juz-browser` - Browse Quran by Juz (Para)
        - `/quran-mp3-audio` - Full Surah audio recitations
        - `/islamic-resources` - Islamic tools hub (replaces `/tools`)
        - `/islamic-ai-scholar` - AI Islamic Scholar chatbot
        - `/blogs` - Islamic blog articles
        - Tool subpages: `/islamic-resources/share-card`, `/islamic-resources/verse-of-day`, etc.
    - **Automatic Redirects:** Intelligent redirect system handles legacy URLs:
        - Numeric: `/surah/1` → `/surah/1-al-fatihah`
        - Old slugs: `/surah/al-fatihah` → `/surah/1-al-fatihah`
    - **Dynamic Meta Tags:** Uses react-helmet-async for unique title, description, canonical, Open Graph, and Twitter Card meta tags on each page.
    - **JSON-LD Schema Markup:** Implements Article, Book, and BreadcrumbList schema following schema.org best practices.
    - **Animated Hero Headers:** All major pages feature animated hero sections with breadcrumb navigation.
    - **Sitemap.xml:** Server-generated sitemap includes all 114 Surah numbered slugs and key pages with proper priority and changefreq settings.
    - **Robots.txt:** Configured to allow all crawlers while blocking private routes (admin, dashboard, login).
    - **Surah Data Module:** Central `client/src/data/surahData.js` contains all 114 Surah numbered slugs, names, meanings, metadata, and redirect mappings.

## External Dependencies
- **Al Quran Cloud API:** Used for fetching Quranic text, translations, surah information, and reciter data.
- **MP3Quran.net API:** Provides access to over 150 full surah audio recitations.
- **Quran.com API:** Utilized for word-by-word Quran data.
- **Google OAuth:** For user authentication via Google accounts.
- **html2canvas:** For client-side rendering of HTML elements to canvas, used in the Share Card Generator for PNG downloads.
- **jsPDF:** For generating client-side PDF documents, used in the Share Card Generator for crisp PDF exports.

## Quran Teaching Platform (NEW - In Development)
A marketplace connecting Quran teachers with students worldwide, similar to Preply/Italki but focused on Quran education.

**Core Features:**
- **User Roles:** Students, Teachers, and Admin
- **Teacher Profiles:** Bio, headline, languages, specialties (Tajweed, Hifz, Tafsir, etc.), hourly rates, certificates, availability
- **Teacher Directory:** Browse/search teachers with filters (specialty, language, price, country, rating)
- **Class Packages:** Teachers create packages (single sessions, weekly/monthly plans)
- **Booking System:** Students book classes based on teacher availability
- **Commission Model:** Platform takes 20% commission, teacher receives 80%

**Database Tables:**
- `teacher_profiles` - Teacher information linked to users
- `teacher_certificates` - Uploaded credentials/Ijazah
- `teaching_specialties` - Lookup table for teaching categories
- `teacher_availability` - Weekly schedule slots
- `class_packages` - Pricing packages created by teachers
- `bookings` - Scheduled class sessions
- `student_subscriptions` - Student package purchases
- `platform_payments` - Payment records with commission split
- `teacher_reviews` - Student ratings and reviews
- `messages` - Student-teacher communication

**Routes:**
- `/teach-with-us` - Comprehensive teacher landing page (10+ sections, 10 FAQs with JSON-LD schema)
- `/teachers` - Teacher directory with search/filters
- `/teachers/:id` - Individual teacher profile page
- `/become-teacher` - Teacher registration form (4-step)
- `/teacher-dashboard` - Teacher's management dashboard
- `/student-dashboard` - Student's learning dashboard
- `/book-class/:id` - Book a class with a teacher (4-step with payment)

**Implemented Features:**
- Student Dashboard with upcoming classes, subscriptions, payment history, and messages interface
- Booking System with 4-step flow: package selection → date/time picker → review → Stripe payment
- Payment Processing with 20% platform / 80% teacher commission split
- Review System allowing students to rate teachers after completed classes (updates teacher rating)
- Teacher Booking Management (view, confirm, complete bookings)
- Race Condition Protection:
  - Pre-validation in payment intent creation (checks availability before Stripe is called)
  - Database unique constraint on `(teacher_id, scheduled_at)` for active bookings
  - Automatic Stripe refund if booking conflict occurs during confirmation
- **Jitsi Meet Video Integration:** Automatic meeting room generation on booking confirmation, Join Class buttons in both student and teacher dashboards with direct links to meet.jit.si
- **Real-time Messaging System:** Full chat interface with conversation list, message display, 5-second polling for updates, unread message badges, and seamless student-teacher communication
- **Admin Teacher Verification Dashboard:** Dedicated section for managing teachers with stats (total, pending, verified, platform earnings), approve/reject functionality, and verification status management

**Future Enhancements:**
- Consider Stripe manual capture (hold payment, only capture after booking confirmed) for even tighter race-condition control
- Reservation/hold system that locks a timeslot before payment is initiated
- WebSocket-based messaging for instant real-time updates (currently uses polling)
- Push notifications for new messages and upcoming classes