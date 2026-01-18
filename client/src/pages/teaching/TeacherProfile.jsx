import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../../components/HeroAnimated';
import Loading from '../../components/Loading';
import '../../styles/teaching.css';

function TeacherProfile() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teachers/${id}`);
      if (!res.ok) throw new Error('Teacher not found');
      const data = await res.json();
      setTeacher(data.teacher);
      setPackages(data.packages || []);
      setReviews(data.reviews || []);
      setCertificates(data.certificates || []);
      setAvailability(data.availability || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="error-page">
      <h2>Teacher Not Found</h2>
      <p>{error}</p>
      <Link to="/teachers" className="btn-primary">Browse Teachers</Link>
    </div>
  );
  if (!teacher) return null;

  const groupedAvailability = availability.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {});

  return (
    <div className="teacher-profile-page">
      <Helmet>
        <title>{teacher.name} - Quran Teacher | QuranDeen</title>
        <meta name="description" content={`Learn Quran with ${teacher.name}. ${teacher.headline || 'Experienced Quran teacher.'}`} />
      </Helmet>

      <HeroAnimated
        icon="👨‍🏫"
        title={teacher.name}
        subtitle={teacher.headline || 'Quran Teacher'}
        stats={[
          teacher.country || 'Online',
          `${teacher.years_experience || 0} Years Experience`,
          `⭐ ${teacher.average_rating?.toFixed(1) || '0.0'} Rating`
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Teachers', href: '/teachers' },
          { name: teacher.name }
        ]}
      />

      <div className="container">
        <div className="teacher-profile-layout">
          <div className="teacher-profile-main">
            <div className="profile-header-card">
              <div className="profile-avatar-large">
                {teacher.profile_image ? (
                  <img src={teacher.profile_image} alt={teacher.name} />
                ) : (
                  <span>{teacher.name?.charAt(0) || '?'}</span>
                )}
                {teacher.is_verified && <span className="verified-badge-large">✓ Verified</span>}
              </div>
              <div className="profile-header-info">
                <h1>{teacher.name}</h1>
                <p className="headline">{teacher.headline}</p>
                <div className="profile-meta">
                  <span>📍 {teacher.city ? `${teacher.city}, ` : ''}{teacher.country || 'Online'}</span>
                  <span>🕐 {teacher.timezone}</span>
                </div>
                <div className="profile-languages">
                  {(teacher.languages || []).map((lang, i) => (
                    <span key={i} className="language-tag">{lang}</span>
                  ))}
                </div>
                <div className="profile-specialties">
                  {(teacher.specialties || []).map((s, i) => (
                    <span key={i} className="specialty-badge">{s}</span>
                  ))}
                </div>
              </div>
              <div className="profile-stats-card">
                <div className="stat">
                  <span className="stat-value">{teacher.total_students || 0}</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{Math.round(teacher.total_hours_taught || 0)}</span>
                  <span className="stat-label">Hours</span>
                </div>
                <div className="stat">
                  <span className="stat-value">⭐ {teacher.average_rating?.toFixed(1) || '0.0'}</span>
                  <span className="stat-label">{teacher.total_reviews || 0} Reviews</span>
                </div>
              </div>
            </div>

            <div className="profile-tabs">
              <button 
                className={activeTab === 'about' ? 'active' : ''} 
                onClick={() => setActiveTab('about')}
              >About</button>
              <button 
                className={activeTab === 'packages' ? 'active' : ''} 
                onClick={() => setActiveTab('packages')}
              >Packages</button>
              <button 
                className={activeTab === 'availability' ? 'active' : ''} 
                onClick={() => setActiveTab('availability')}
              >Availability</button>
              <button 
                className={activeTab === 'reviews' ? 'active' : ''} 
                onClick={() => setActiveTab('reviews')}
              >Reviews</button>
            </div>

            {activeTab === 'about' && (
              <div className="tab-content">
                <div className="about-section">
                  <h3>About Me</h3>
                  <p>{teacher.bio || 'No bio provided yet.'}</p>
                </div>
                {certificates.length > 0 && (
                  <div className="certificates-section">
                    <h3>Certificates & Credentials</h3>
                    <div className="certificates-list">
                      {certificates.map(cert => (
                        <div key={cert.id} className="certificate-item">
                          <span className="cert-icon">📜</span>
                          <div>
                            <strong>{cert.title}</strong>
                            {cert.issuer && <span className="cert-issuer"> - {cert.issuer}</span>}
                            {cert.is_verified && <span className="cert-verified">✓ Verified</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="tab-content">
                <h3>Class Packages</h3>
                {packages.length === 0 ? (
                  <p className="no-data">No packages available yet.</p>
                ) : (
                  <div className="packages-grid">
                    {packages.map(pkg => (
                      <div key={pkg.id} className="package-card">
                        <div className="package-header">
                          <h4>{pkg.name}</h4>
                          <span className="package-specialty">{pkg.specialty}</span>
                        </div>
                        <p className="package-description">{pkg.description}</p>
                        <div className="package-details">
                          <span>⏱ {pkg.duration_minutes} min/session</span>
                          <span>📚 {pkg.sessions_count} sessions</span>
                          <span>📅 Valid {pkg.validity_days} days</span>
                        </div>
                        <div className="package-footer">
                          <span className="package-price">${pkg.price}</span>
                          <button className="btn-book">Book Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="tab-content">
                <h3>Weekly Availability</h3>
                <p className="timezone-note">Times shown in {teacher.timezone}</p>
                {availability.length === 0 ? (
                  <p className="no-data">No availability set.</p>
                ) : (
                  <div className="availability-grid">
                    {Object.entries(groupedAvailability).map(([day, slots]) => (
                      <div key={day} className="availability-day">
                        <h4>{dayNames[day]}</h4>
                        <div className="time-slots">
                          {slots.map((slot, i) => (
                            <span key={i} className="time-slot">
                              {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content">
                <h3>Student Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="no-data">No reviews yet.</p>
                ) : (
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.profile_image ? (
                                <img src={review.profile_image} alt={review.name} />
                              ) : (
                                <span>{review.name?.charAt(0) || '?'}</span>
                              )}
                            </div>
                            <div>
                              <strong>{review.name}</strong>
                              <span className="review-date">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <p className="review-text">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="teacher-profile-sidebar">
            <div className="booking-card">
              <div className="hourly-rate-large">
                <span className="rate">${teacher.hourly_rate || '0'}</span>
                <span className="per-hour">/hour</span>
              </div>
              <button className="btn-primary btn-large">Book a Trial Class</button>
              <button className="btn-secondary btn-large">Send Message</button>
              <p className="booking-note">Free 15-minute introductory session available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
