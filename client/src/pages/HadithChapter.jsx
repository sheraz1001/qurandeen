import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaBook, FaArrowLeft, FaArrowRight, FaSpinner, FaChevronRight, FaCopy, FaCheck, FaGlobe, FaBookmark, FaShareAlt } from 'react-icons/fa';
import { getCollectionById } from '../data/hadithData';
import { fetchCollection, getHadithsByChapter, extractChaptersFromCollection, fetchBanglaHadiths } from '../services/hadithService';
import { supportedLanguages } from '../data/hadithData';

const HadithChapter = () => {
  const { collectionId, chapterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [copiedId, setCopiedId] = useState(null);
  const [banglaData, setBanglaData] = useState(null);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('hadith_font_size') || 'medium');

  const collection = getCollectionById(collectionId);
  const chapterNum = parseInt(chapterId);

  useEffect(() => {
    if (!collection) {
      navigate('/hadith');
      return;
    }

    const loadChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const collectionData = await fetchCollection(collectionId);
        const allChapters = extractChaptersFromCollection(collectionData);
        setChapters(allChapters);
        
        const chapterHadiths = getHadithsByChapter(collectionData, chapterNum);
        setHadiths(chapterHadiths);
        
        const currentChapter = allChapters.find(c => c.id === chapterNum);
        setChapterInfo(currentChapter);

        if (selectedLang === 'bn') {
          const bangla = await fetchBanglaHadiths(collectionId, chapterNum);
          setBanglaData(bangla);
        }
      } catch (err) {
        setError('Failed to load hadiths. Please try again.');
        console.error(err);
      }
      setLoading(false);
    };

    loadChapter();
  }, [collectionId, chapterNum, collection, navigate, selectedLang]);

  useEffect(() => {
    localStorage.setItem('hadith_font_size', fontSize);
  }, [fontSize]);

  const handleCopy = async (hadith) => {
    const text = `${hadith.arabic}\n\n${hadith.english?.narrator}: ${hadith.english?.text}\n\n- ${collection?.name}, Hadith ${hadith.id}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (hadith) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hadith from ${collection?.name}`,
          text: `${hadith.english?.text?.substring(0, 200)}...`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const prevChapter = chapters.find(c => c.id === chapterNum - 1);
  const nextChapter = chapters.find(c => c.id === chapterNum + 1);

  const fontSizeClasses = {
    small: { arabic: 'text-xl', english: 'text-sm' },
    medium: { arabic: 'text-2xl', english: 'text-base' },
    large: { arabic: 'text-3xl', english: 'text-lg' }
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Hadith', href: '/hadith' },
    { name: collection?.name || 'Collection', href: `/hadith/${collectionId}` },
    { name: chapterInfo?.english || `Chapter ${chapterId}` }
  ];

  const schema = collection && chapterInfo ? [
    {
      "@context": "https://schema.org",
      "@type": "Chapter",
      "name": chapterInfo.english || `Chapter ${chapterId}`,
      "isPartOf": {
        "@type": "Book",
        "name": collection.name
      },
      "url": `https://qurandeen.com/hadith/${collectionId}/${chapterId}`
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
        <title>{chapterInfo?.english || `Chapter ${chapterId}`} - {collection.name} | QuranDeen</title>
        <meta name="description" content={`Read ${hadiths.length} hadiths from ${chapterInfo?.english || `Chapter ${chapterId}`} of ${collection.name}. Arabic text with English translation.`} />
        <link rel="canonical" href={`https://qurandeen.com/hadith/${collectionId}/${chapterId}`} />
        <meta property="og:title" content={`${chapterInfo?.english || `Chapter ${chapterId}`} - ${collection.name}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm flex-wrap">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <FaChevronRight className="mx-2 text-emerald-200 text-xs" />}
                    {item.href ? (
                      <Link to={item.href} className="text-emerald-100 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-emerald-100 text-sm mb-1">{collection.name}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {chapterInfo?.english || `Chapter ${chapterId}`}
                </h1>
                {chapterInfo?.arabic && (
                  <p className="text-xl text-emerald-100 font-arabic mt-2">
                    {chapterInfo.arabic}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-white/50"
                >
                  {supportedLanguages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-gray-900">
                      {lang.nameNative}
                    </option>
                  ))}
                </select>

                <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-2 text-sm ${fontSize === size ? 'bg-white text-emerald-700' : 'text-white hover:bg-white/20'}`}
                    >
                      {size === 'small' ? 'A' : size === 'medium' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-4xl text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading hadiths...</p>
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
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">
                  {hadiths.length} hadith{hadiths.length !== 1 ? 's' : ''} in this chapter
                </p>
              </div>

              <div className="space-y-6">
                {hadiths.map((hadith, index) => (
                  <article
                    key={hadith.id}
                    id={`hadith-${hadith.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {hadith.id}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Hadith #{hadith.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(hadith)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                          title="Copy hadith"
                        >
                          {copiedId === hadith.id ? <FaCheck className="text-green-500" /> : <FaCopy />}
                        </button>
                        <button
                          onClick={() => handleShare(hadith)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                          title="Share hadith"
                        >
                          <FaShareAlt />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className={`text-right leading-loose font-arabic text-gray-900 dark:text-white ${fontSizeClasses[fontSize].arabic}`} dir="rtl">
                        {hadith.arabic}
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {selectedLang === 'en' && hadith.english && (
                        <div className={`text-gray-700 dark:text-gray-300 ${fontSizeClasses[fontSize].english}`}>
                          {hadith.english.narrator && (
                            <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                              {hadith.english.narrator}
                            </p>
                          )}
                          <p className="leading-relaxed">{hadith.english.text}</p>
                        </div>
                      )}

                      {selectedLang === 'ar' && (
                        <div className={`text-gray-700 dark:text-gray-300 text-right font-arabic ${fontSizeClasses[fontSize].english}`} dir="rtl">
                          <p className="leading-relaxed">العربية فقط - Arabic text shown above</p>
                        </div>
                      )}

                      {selectedLang === 'ur' && (
                        <div className={`text-gray-700 dark:text-gray-300 text-right ${fontSizeClasses[fontSize].english}`} dir="rtl">
                          <p className="text-amber-600 dark:text-amber-400 mb-2">اردو ترجمہ</p>
                          <p className="leading-relaxed font-urdu">
                            {hadith.english?.text ? (
                              <span className="text-gray-500">Urdu translation coming soon. English: {hadith.english.text}</span>
                            ) : (
                              <span className="text-gray-500">Translation not available</span>
                            )}
                          </p>
                        </div>
                      )}

                      {selectedLang === 'bn' && (
                        <div className={`text-gray-700 dark:text-gray-300 ${fontSizeClasses[fontSize].english}`}>
                          <p className="text-amber-600 dark:text-amber-400 mb-2">বাংলা অনুবাদ</p>
                          {banglaData?.hadiths?.[index]?.hadithBengali ? (
                            <p className="leading-relaxed">{banglaData.hadiths[index].hadithBengali}</p>
                          ) : (
                            <p className="leading-relaxed text-gray-500">
                              Bengali translation available for major collections. English: {hadith.english?.text}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {hadiths.length === 0 && (
                <div className="text-center py-12">
                  <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No hadiths found in this chapter
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                {prevChapter ? (
                  <Link
                    to={`/hadith/${collectionId}/${prevChapter.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                  >
                    <FaArrowLeft />
                    <span className="hidden sm:inline">Previous Chapter</span>
                  </Link>
                ) : <div />}
                
                <Link
                  to={`/hadith/${collectionId}`}
                  className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  All Chapters
                </Link>

                {nextChapter ? (
                  <Link
                    to={`/hadith/${collectionId}/${nextChapter.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                  >
                    <span className="hidden sm:inline">Next Chapter</span>
                    <FaArrowRight />
                  </Link>
                ) : <div />}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HadithChapter;
