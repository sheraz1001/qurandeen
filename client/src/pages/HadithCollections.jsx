import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaSearch, FaArrowRight, FaQuran, FaMosque } from 'react-icons/fa';
import { hadithCollections, hadithCategories, getCollectionsByCategory } from '../data/hadithData';

const HadithCollections = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = searchQuery
    ? hadithCollections.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameArabic.includes(searchQuery) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hadithCollections;

  const groupedCollections = searchQuery
    ? { search: { name: 'Search Results', collections: filteredCollections } }
    : Object.keys(hadithCategories).reduce((acc, catKey) => {
        acc[catKey] = {
          ...hadithCategories[catKey],
          collections: getCollectionsByCategory(catKey)
        };
        return acc;
      }, {});

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Hadith Collections' }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Hadith Collections - Complete Hadith Library",
      "description": "Browse 17 authentic Hadith collections including Sahih Bukhari, Sahih Muslim, Sunan Abu Dawud, and more with 50,000+ hadiths.",
      "url": "https://qurandeen.com/hadith",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": hadithCollections.map((col, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": col.name,
          "url": `https://qurandeen.com/hadith/${col.id}`
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.href ? `https://qurandeen.com${item.href}` : undefined
      }))
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hadith Collections - Sahih Bukhari, Muslim, Abu Dawud & More | QuranDeen</title>
        <meta name="description" content="Access complete Hadith collections including Sahih Bukhari, Sahih Muslim, Sunan Abu Dawud, Tirmidhi, and 13 more books. Read 50,000+ authentic hadiths in Arabic, English, Urdu, and Bengali." />
        <meta name="keywords" content="hadith, sahih bukhari, sahih muslim, hadith collections, islamic hadith, prophet muhammad sayings, sunnah" />
        <link rel="canonical" href="https://qurandeen.com/hadith" />
        <meta property="og:title" content="Hadith Collections - Complete Hadith Library | QuranDeen" />
        <meta property="og:description" content="Browse 17 authentic Hadith collections with 50,000+ hadiths in multiple languages." />
        <meta property="og:url" content="https://qurandeen.com/hadith" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-emerald-200">/</span>}
                    {item.href ? (
                      <Link to={item.href} className="text-emerald-100 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">{item.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <FaBook className="text-5xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Hadith Collections
              </h1>
              <p className="text-xl text-emerald-100 mb-2 font-arabic">
                مجموعة الأحاديث النبوية الشريفة
              </p>
              <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
                Explore 17 authentic Hadith collections containing over 50,000 sayings and actions 
                of Prophet Muhammad (peace be upon him)
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search collections by name or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">17</div>
              <div className="text-gray-600 dark:text-gray-300">Collections</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Hadiths</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
              <div className="text-gray-600 dark:text-gray-300">Languages</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Authentic</div>
            </div>
          </div>

          {Object.entries(groupedCollections).map(([catKey, category]) => (
            <div key={catKey} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h2>
                {category.nameArabic && (
                  <p className="text-lg text-emerald-600 dark:text-emerald-400 font-arabic">
                    {category.nameArabic}
                  </p>
                )}
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{category.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/hadith/${collection.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{collection.icon}</div>
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm rounded-full">
                          {collection.totalHadith.toLocaleString()} hadiths
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-lg text-emerald-600 dark:text-emerald-400 font-arabic mb-2">
                        {collection.nameArabic}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        by {collection.author}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {collection.description}
                      </p>

                      <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Read Collection</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <FaMosque className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                No collections found matching "{searchQuery}"
              </h3>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              What is Hadith?
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Hadith refers to the recorded sayings, actions, and approvals of Prophet Muhammad 
              (peace be upon him). These collections serve as the second most important source 
              of Islamic law and guidance after the Holy Quran. The hadith literature provides 
              practical examples of how to implement Quranic teachings in daily life.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HadithCollections;
