import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import { getSurahByNumber } from '../data/surahData';

function Search() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Search' }
  ];
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (query) {
      searchQuran();
    }
  }, [query]);

  const searchQuran = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/search?keyword=${encodeURIComponent(query)}`);
      if (response.data.data && response.data.data.matches) {
        setResults(response.data.data.matches);
        setTotalCount(response.data.data.count);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.code === 404) {
        setResults([]);
        setTotalCount(0);
      } else {
        setError('Search failed. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="search-page">
        <SEO 
          title="Search the Holy Quran - Find Ayahs by Keyword"
          description="Search through the Holy Quran to find ayahs by keyword. Explore verses with translations and navigate directly to any surah."
          canonical="https://qurandeen.com/search"
          keywords="Search Quran, find ayah, Quran search, Islamic search, Quran verses"
          breadcrumbs={breadcrumbs}
        />
        <HeroAnimated
          icon="🔍"
          title="Search Quran"
          subtitle="Find ayahs by keyword across all 114 Surahs"
          stats={['6,236 Ayahs', 'Instant Results', 'Multiple Translations']}
          breadcrumbs={breadcrumbs}
        />
        <div className="search-empty">
          <p>Enter a keyword in the search bar above to find ayahs.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={searchQuran} />;

  return (
    <div className="search-page">
      <SEO 
        title={`Search Results for "${query}" - QuranDeen`}
        description={`Found ${totalCount} results for "${query}" in the Holy Quran. Browse matching ayahs with translations.`}
        canonical={`https://qurandeen.com/search?q=${encodeURIComponent(query)}`}
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="🔍"
        title="Search Results"
        subtitle={`Found ${totalCount} results for "${query}"`}
        breadcrumbs={breadcrumbs}
      />

      {results.length === 0 ? (
        <div className="no-results">
          <p>No ayahs found matching your search.</p>
          <Link to="/" className="back-link">Browse all Surahs</Link>
        </div>
      ) : (
        <div className="search-results">
          {results.map((match, index) => (
            <Link 
              to={`/surah/${getSurahByNumber(match.surah.number)?.slug || match.surah.number}`} 
              key={index} 
              className="search-result-card"
            >
              <div className="result-header">
                <span className="surah-badge">
                  {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                </span>
              </div>
              <p className="result-text">{match.text}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
