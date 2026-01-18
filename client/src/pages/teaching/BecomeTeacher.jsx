import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroAnimated from '../../components/HeroAnimated';
import { useAuth } from '../../context/AuthContext';
import '../../styles/teaching.css';

function BecomeTeacher() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [isAlreadyTeacher, setIsAlreadyTeacher] = useState(false);

  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    yearsExperience: '',
    hourlyRate: '',
    languages: [],
    specialties: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const languageOptions = [
    'Arabic', 'English', 'Urdu', 'Indonesian', 'Malay', 'French',
    'Turkish', 'Bengali', 'Hindi', 'Persian', 'Pashto', 'Somali',
    'Spanish', 'German', 'Dutch', 'Swahili'
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London',
    'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata',
    'Asia/Jakarta', 'Asia/Kuala_Lumpur', 'Africa/Cairo', 'Australia/Sydney'
  ];

  useEffect(() => {
    fetchSpecialties();
    if (isAuthenticated) {
      checkTeacherStatus();
    }
  }, [isAuthenticated]);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/api/teaching/specialties');
      const data = await res.json();
      setSpecialties(data.specialties || []);
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const checkTeacherStatus = async () => {
    try {
      const res = await fetch('/api/teacher/check', { credentials: 'include' });
      const data = await res.json();
      if (data.isTeacher) {
        setIsAlreadyTeacher(true);
      }
    } catch (err) {
      console.error('Error checking teacher status:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleSpecialty = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/become-teacher');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/teacher/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create teacher profile');
      }

      navigate('/teacher-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.headline && formData.bio;
    }
    if (step === 2) {
      return formData.languages.length > 0 && formData.specialties.length > 0;
    }
    if (step === 3) {
      return formData.yearsExperience && formData.hourlyRate;
    }
    return true;
  };

  if (isAlreadyTeacher) {
    return (
      <div className="become-teacher-page">
        <HeroAnimated
          icon="✅"
          title="You're Already a Teacher"
          subtitle="You already have a teacher profile"
          breadcrumbs={[
            { name: 'Home', href: '/' },
            { name: 'Become a Teacher' }
          ]}
        />
        <div className="container">
          <div className="already-teacher-card">
            <p>You have already registered as a teacher on QuranDeen.</p>
            <button onClick={() => navigate('/teacher-dashboard')} className="btn-primary">
              Go to Teacher Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="become-teacher-page">
      <Helmet>
        <title>Become a Quran Teacher | QuranDeen</title>
        <meta name="description" content="Join QuranDeen as a Quran teacher. Share your knowledge, teach students worldwide, and earn by teaching Quran online." />
      </Helmet>

      <HeroAnimated
        icon="🎓"
        title="Become a Quran Teacher"
        subtitle="Share your knowledge and teach students from around the world"
        stats={['Flexible Schedule', 'Teach Online', 'Earn 80% Commission']}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Become a Teacher' }
        ]}
      />

      <div className="container">
        <div className="registration-form">
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Profile</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Expertise</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Pricing</div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Submit</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <div className="form-step">
              <h2>Tell us about yourself</h2>
              <div className="form-group">
                <label>Professional Headline</label>
                <input
                  type="text"
                  name="headline"
                  placeholder="e.g., Certified Quran Teacher with 10+ Years Experience"
                  value={formData.headline}
                  onChange={handleInputChange}
                  maxLength={200}
                />
                <span className="char-count">{formData.headline.length}/200</span>
              </div>
              <div className="form-group">
                <label>About You</label>
                <textarea
                  name="bio"
                  placeholder="Tell students about your teaching experience, qualifications, and teaching style..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select name="timezone" value={formData.timezone} onChange={handleInputChange}>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Your Expertise</h2>
              <div className="form-group">
                <label>Languages You Teach In</label>
                <div className="checkbox-grid">
                  {languageOptions.map(lang => (
                    <label key={lang} className={`checkbox-item ${formData.languages.includes(lang) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Teaching Specialties</label>
                <div className="checkbox-grid">
                  {specialties.map(spec => (
                    <label key={spec.id} className={`checkbox-item ${formData.specialties.includes(spec.name) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(spec.name)}
                        onChange={() => toggleSpecialty(spec.name)}
                      />
                      {spec.icon} {spec.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Experience & Pricing</h2>
              <div className="form-group">
                <label>Years of Teaching Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  placeholder="5"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                />
              </div>
              <div className="form-group">
                <label>Hourly Rate (USD)</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    placeholder="25"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="5"
                    max="500"
                  />
                  <span className="per-hour">/hour</span>
                </div>
                <p className="price-note">You will receive 80% of this amount. Platform fee is 20%.</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <h2>Review & Submit</h2>
              <div className="review-summary">
                <div className="review-item">
                  <label>Headline:</label>
                  <p>{formData.headline}</p>
                </div>
                <div className="review-item">
                  <label>Languages:</label>
                  <p>{formData.languages.join(', ')}</p>
                </div>
                <div className="review-item">
                  <label>Specialties:</label>
                  <p>{formData.specialties.join(', ')}</p>
                </div>
                <div className="review-item">
                  <label>Experience:</label>
                  <p>{formData.yearsExperience} years</p>
                </div>
                <div className="review-item">
                  <label>Hourly Rate:</label>
                  <p>${formData.hourlyRate}/hour (You earn ${(formData.hourlyRate * 0.8).toFixed(2)})</p>
                </div>
              </div>
              {!isAuthenticated && (
                <div className="auth-notice">
                  <p>You need to be logged in to submit your application.</p>
                  <button onClick={() => navigate('/login?redirect=/become-teacher')} className="btn-secondary">
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="form-navigation">
            {step > 1 && (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                Previous
              </button>
            )}
            {step < 4 ? (
              <button 
                className="btn-primary" 
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={loading || !isAuthenticated}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomeTeacher;
