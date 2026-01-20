import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaSearch, FaArrowLeft, FaArrowRight, FaSpinner, FaChevronRight } from 'react-icons/fa';
import { getCollectionById, hadithCollections } from '../data/hadithData';
import { fetchCollection, extractChaptersFromCollection } from '../services/hadithService';

const HadithBook = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionData, setCollectionData] = useState(null);

  const collection = getCollectionById(collectionId);

  useEffect(() => {
    if (!collection) {
      navigate('/hadith');
      return;
    }

    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCollection(collectionId);
        setCollectionData(data);
        const extractedChapters = extractChaptersFromCollection(data);
        setChapters(extractedChapters);
      } catch (err) {
        setError('Failed to load collection. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    loadCollection();
  }, [collectionId, collection, navigate]);

  const filteredChapters = searchQuery
    ? chapters.filter(ch => 
        ch.english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.arabic?.includes(searchQuery)
      )
    : chapters;

  const currentIndex = hadithCollections.findIndex(c => c.id === collectionId);
  const prevCollection = currentIndex > 0 ? hadithCollections[currentIndex - 1] : null;
  const nextCollection = currentIndex < hadithCollections.length - 1 ? hadithCollections[currentIndex + 1] : null;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Hadith Collections', href: '/hadith' },
    { name: collection?.name || 'Collection' }
  ];

  const schema = collection ? [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": collection.name,
      "alternateName": collection.nameArabic,
      "author": {
        "@type": "Person",
        "name": collection.author
      },
      "description": collection.description,
      "inLanguage": ["ar", "en"],
      "url": `https://qurandeen.com/hadith/${collectionId}`
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
  ] : [];

  if (!collection) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{collection.name} - Read All Chapters & Hadiths | QuranDeen</title>
        <meta name="description" content={`Read ${collection.name} (${collection.nameArabic}) - ${collection.totalHadith.toLocaleString()} hadiths compiled by ${collection.author}. ${collection.description}`} />
        <meta name="keywords" content={`${collection.name}, ${collection.nameArabic}, ${collection.author}, hadith, islamic hadith`} />
        <link rel="canonical" href={`https://qurandeen.com/hadith/${collectionId}`} />
        <meta property="og:title" content={`${collection.name} - Complete Hadith Book | QuranDeen`} />
        <meta property="og:description" content={collection.description} />
        <meta property="og:url" content={`https://qurandeen.com/hadith/${collectionId}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm flex-wrap">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <FaChevronRight className="mx-2 text-emerald-200 text-xs" />}
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{collection.icon}</div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {collection.name}
                    </h1>
                    <p className="text-2xl text-emerald-100 font-arabic mt-1">
                      {collection.nameArabic}
                    </p>
                  </div>
                </div>
                <p className="text-emerald-100 mb-2">by {collection.author}</p>
                <p className="text-emerald-50 max-w-2xl">{collection.description}</p>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-white">{collection.totalHadith.toLocaleString()}</div>
                  <div className="text-emerald-100 text-sm">Total Hadiths</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-white">{chapters.length}</div>
                  <div className="text-emerald-100 text-sm">Chapters</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-4xl text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading chapters...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {filteredChapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    to={`/hadith/${collectionId}/${chapter.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all p-5 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{chapter.id}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {chapter.english || `Chapter ${chapter.id}`}
                          </h3>
                          {chapter.arabic && (
                            <p className="text-emerald-600 dark:text-emerald-400 font-arabic mt-1">
                              {chapter.arabic}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {chapter.hadithCount} hadiths
                          </p>
                        </div>
                      </div>
                      <FaArrowRight className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>

              {filteredChapters.length === 0 && (
                <div className="text-center py-12">
                  <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No chapters found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            {prevCollection ? (
              <Link
                to={`/hadith/${prevCollection.id}`}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <FaArrowLeft />
                <span>{prevCollection.name}</span>
              </Link>
            ) : <div />}
            
            {nextCollection && (
              <Link
                to={`/hadith/${nextCollection.id}`}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <span>{nextCollection.name}</span>
                <FaArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HadithBook;
