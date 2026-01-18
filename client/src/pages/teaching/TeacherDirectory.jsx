import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../../components/HeroAnimated';
import Loading from '../../components/Loading';
import '../../styles/teaching.css';

function TeacherDirectory() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [filters, setFilters] = useState({
    specialty: '',
    language: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const languages = [
    'Arabic', 'English', 'Urdu', 'Indonesian', 'Malay', 'French', 
    'Turkish', 'Bengali', 'Hindi', 'Persian', 'Pashto', 'Somali'
  ];

  useEffect(() => {
    fetchSpecialties();
    fetchTeachers();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/api/teaching/specialties');
      const data = await res.json();
      setSpecialties(data.specialties || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.language) params.append('language', filters.language);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`/api/teachers?${params}`);
      const data = await res.json();
      setTeachers(data.teachers || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchTeachers(1);
  };

  const clearFilters = () => {
    setFilters({ specialty: '', language: '', minPrice: '', maxPrice: '', search: '' });
    setTimeout(() => fetchTeachers(1), 0);
  };

  return (
    <div className="teacher-directory-page">
      <Helmet>
        <title>Find Quran Teachers - Online Quran Classes | QuranDeen</title>
        <meta name="description" content="Find qualified Quran teachers for online classes. Learn Tajweed, Hifz, Tafsir, and more with experienced tutors from around the world." />
      </Helmet>

      <HeroAnimated
        icon="👨‍🏫"
        title="Find Your Quran Teacher"
        subtitle="Connect with qualified teachers for personalized Quran learning"
        stats={[`${pagination.total} Teachers`, 'All Levels', 'Multiple Languages']}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Find Teachers' }
        ]}
      />

      <div className="container">
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Specialty</label>
              <select value={filters.specialty} onChange={(e) => handleFilterChange('specialty', e.target.value)}>
                <option value="">All Specialties</option>
                {specialties.map(s => (
                  <option key={s.id} value={s.name}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Language</label>
              <select value={filters.language} onChange={(e) => handleFilterChange('language', e.target.value)}>
                <option value="">All Languages</option>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="$100"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-primary" onClick={applyFilters}>Apply Filters</button>
            <button className="btn-secondary" onClick={clearFilters}>Clear</button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : teachers.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No teachers found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <div className="teachers-grid">
              {teachers.map(teacher => (
                <Link to={`/teachers/${teacher.id}`} key={teacher.id} className="teacher-card">
                  <div className="teacher-card-header">
                    <div className="teacher-avatar">
                      {teacher.profile_image ? (
                        <img src={teacher.profile_image} alt={teacher.name} />
                      ) : (
                        <span>{teacher.name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    {teacher.is_verified && <span className="verified-badge" title="Verified Teacher">✓</span>}
                  </div>
                  <div className="teacher-card-body">
                    <h3>{teacher.name}</h3>
                    <p className="teacher-headline">{teacher.headline || 'Quran Teacher'}</p>
                    <div className="teacher-location">
                      <span>📍</span> {teacher.country || 'Online'}
                    </div>
                    <div className="teacher-specialties">
                      {(teacher.specialties || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="specialty-tag">{s}</span>
                      ))}
                    </div>
                    <div className="teacher-stats">
                      <span className="rating">
                        ⭐ {teacher.average_rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="students">
                        👥 {teacher.total_students || 0} students
                      </span>
                    </div>
                  </div>
                  <div className="teacher-card-footer">
                    <span className="hourly-rate">
                      ${teacher.hourly_rate || '0'}/hr
                    </span>
                    <span className="view-profile">View Profile →</span>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchTeachers(pagination.page - 1)}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.pages}</span>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchTeachers(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherDirectory;
