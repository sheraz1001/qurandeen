import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    nationality: '',
    country: '',
    gender: '',
    phone: '',
    educationLevel: '',
    ijazahDetails: '',
    teachingExperience: '',
    videoIntroUrl: '',
    yearsExperience: '',
    hourlyRate: '',
    languages: [],
    specialties: [],
    teachingStyles: [],
    availabilityNotes: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bahrain', 'Bangladesh', 'Belgium', 'Bosnia and Herzegovina', 'Brazil',
    'Brunei', 'Canada', 'China', 'Denmark', 'Egypt', 'Ethiopia',
    'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Lebanon', 'Libya',
    'Malaysia', 'Maldives', 'Mali', 'Mauritania', 'Mexico', 'Morocco',
    'Netherlands', 'New Zealand', 'Niger', 'Nigeria', 'Norway', 'Oman',
    'Pakistan', 'Palestine', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Russia', 'Saudi Arabia', 'Senegal', 'Singapore', 'Somalia', 'South Africa',
    'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland',
    'Syria', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uzbekistan', 'Vietnam', 'Yemen', 'Other'
  ];

  const languageOptions = [
    'Arabic', 'English', 'Urdu', 'Hindi', 'Bengali', 'Indonesian',
    'Malay', 'Turkish', 'Persian (Farsi)', 'Pashto', 'French', 'German',
    'Spanish', 'Portuguese', 'Dutch', 'Russian', 'Somali', 'Swahili',
    'Hausa', 'Amharic', 'Tamil', 'Telugu', 'Punjabi', 'Gujarati',
    'Thai', 'Vietnamese', 'Chinese (Mandarin)', 'Japanese', 'Korean', 'Other'
  ];

  const educationLevels = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree (PhD)',
    'Islamic Studies Diploma',
    'Alim/Alima Certification',
    'Hafiz/Hafiza Certification',
    'Ijazah in Quran',
    'Other Religious Certification'
  ];

  const teachingStyleOptions = [
    'One-on-One Sessions',
    'Group Classes',
    'Structured Curriculum',
    'Flexible Learning',
    'Interactive Learning',
    'Recitation Practice',
    'Memorization Drills',
    'Discussion-Based',
    'Visual Learning Aids',
    'Audio-Based Learning'
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
    { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
    { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
    { value: 'America/Toronto', label: 'Toronto, Canada' },
    { value: 'Europe/London', label: 'London, UK' },
    { value: 'Europe/Paris', label: 'Paris, France' },
    { value: 'Europe/Berlin', label: 'Berlin, Germany' },
    { value: 'Europe/Istanbul', label: 'Istanbul, Turkey' },
    { value: 'Europe/Moscow', label: 'Moscow, Russia' },
    { value: 'Asia/Dubai', label: 'Dubai, UAE' },
    { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia' },
    { value: 'Asia/Karachi', label: 'Karachi, Pakistan' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh' },
    { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia' },
    { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur, Malaysia' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Shanghai', label: 'China (Beijing Time)' },
    { value: 'Asia/Tokyo', label: 'Tokyo, Japan' },
    { value: 'Africa/Cairo', label: 'Cairo, Egypt' },
    { value: 'Africa/Lagos', label: 'Lagos, Nigeria' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa' },
    { value: 'Australia/Sydney', label: 'Sydney, Australia' },
    { value: 'Pacific/Auckland', label: 'Auckland, New Zealand' }
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

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
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
    switch (step) {
      case 1:
        return formData.nationality && formData.country && formData.gender;
      case 2:
        return formData.headline.length >= 20 && formData.bio.length >= 100;
      case 3:
        return formData.languages.length > 0 && formData.specialties.length > 0;
      case 4:
        return formData.yearsExperience && formData.educationLevel;
      case 5:
        return formData.hourlyRate && formData.timezone;
      default:
        return true;
    }
  };

  const getStepProgress = () => {
    return (step / 6) * 100;
  };

  if (isAlreadyTeacher) {
    return (
      <div className="become-teacher-page">
        <HeroAnimated
          title="You're Already a Teacher"
          subtitle="You already have a teacher profile"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Become a Teacher', path: '/become-teacher' }
          ]}
        />
        <div className="container">
          <div className="already-teacher-card">
            <div className="success-icon">✅</div>
            <h2>You're Already Registered!</h2>
            <p>You have already registered as a teacher on QuranDeen. Access your dashboard to manage your profile, classes, and earnings.</p>
            <button onClick={() => navigate('/teacher-dashboard')} className="btn-primary btn-large">
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
        <title>Become a Quran Teacher - Apply Now | QuranDeen</title>
        <meta name="description" content="Join QuranDeen as a Quran teacher. Complete our simple registration to start teaching students worldwide. Teach Tajweed, Hifz, Tafsir and more." />
        <link rel="canonical" href="https://qurandeen.com/become-teacher" />
      </Helmet>

      <HeroAnimated
        title="Teacher Registration"
        subtitle="Complete your profile to start teaching on QuranDeen"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Teach With Us', path: '/teach-with-us' },
          { label: 'Apply Now', path: '/become-teacher' }
        ]}
      />

      <div className="container">
        <div className="registration-wrapper">
          <div className="registration-sidebar">
            <div className="progress-section">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36">
                  <path
                    className="progress-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progress-fill"
                    strokeDasharray={`${getStepProgress()}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="progress-text">{step}/6</span>
              </div>
              <p className="progress-label">Registration Progress</p>
            </div>

            <div className="steps-list">
              <div className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-number">{step > 1 ? '✓' : '1'}</span>
                <span className="step-label">Personal Info</span>
              </div>
              <div className={`step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="step-number">{step > 2 ? '✓' : '2'}</span>
                <span className="step-label">Profile Details</span>
              </div>
              <div className={`step-item ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                <span className="step-number">{step > 3 ? '✓' : '3'}</span>
                <span className="step-label">Languages & Expertise</span>
              </div>
              <div className={`step-item ${step === 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>
                <span className="step-number">{step > 4 ? '✓' : '4'}</span>
                <span className="step-label">Experience & Education</span>
              </div>
              <div className={`step-item ${step === 5 ? 'active' : ''} ${step > 5 ? 'completed' : ''}`}>
                <span className="step-number">{step > 5 ? '✓' : '5'}</span>
                <span className="step-label">Pricing & Availability</span>
              </div>
              <div className={`step-item ${step === 6 ? 'active' : ''}`}>
                <span className="step-number">6</span>
                <span className="step-label">Review & Submit</span>
              </div>
            </div>

            <div className="sidebar-help">
              <h4>Need Help?</h4>
              <p>Visit our <Link to="/teach-with-us">Teach With Us</Link> page for FAQs and detailed information about becoming a teacher.</p>
            </div>
          </div>

          <div className="registration-form">
            {error && <div className="error-message">{error}</div>}

            {step === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Personal Information</h2>
                  <p>Tell us about yourself. This information helps students know more about you.</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nationality <span className="required">*</span></label>
                    <select name="nationality" value={formData.nationality} onChange={handleInputChange}>
                      <option value="">Select your nationality</option>
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Country of Residence <span className="required">*</span></label>
                    <select name="country" value={formData.country} onChange={handleInputChange}>
                      <option value="">Select your country</option>
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender <span className="required">*</span></label>
                    <div className="radio-group">
                      <label className={`radio-item ${formData.gender === 'male' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-label">Male</span>
                      </label>
                      <label className={`radio-item ${formData.gender === 'female' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-label">Female</span>
                      </label>
                    </div>
                    <p className="field-note">Students may prefer teachers of the same gender.</p>
                  </div>
                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <p className="field-note">For account verification purposes only. Never shared with students.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Professional Profile</h2>
                  <p>Create a compelling profile that showcases your teaching experience and style.</p>
                </div>

                <div className="form-group">
                  <label>Professional Headline <span className="required">*</span></label>
                  <input
                    type="text"
                    name="headline"
                    placeholder="e.g., Certified Quran Teacher with 10+ Years of Experience in Tajweed & Hifz"
                    value={formData.headline}
                    onChange={handleInputChange}
                    maxLength={200}
                  />
                  <div className="field-footer">
                    <p className="field-note">Write a catchy headline that highlights your expertise (minimum 20 characters)</p>
                    <span className={`char-count ${formData.headline.length < 20 ? 'warning' : ''}`}>
                      {formData.headline.length}/200
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>About You <span className="required">*</span></label>
                  <textarea
                    name="bio"
                    placeholder="Tell students about your teaching journey, qualifications, teaching methodology, and what makes you unique as a Quran teacher. Include any certifications, Ijazah, or special achievements..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={8}
                    maxLength={2000}
                  />
                  <div className="field-footer">
                    <p className="field-note">Minimum 100 characters. A detailed bio helps students choose you.</p>
                    <span className={`char-count ${formData.bio.length < 100 ? 'warning' : ''}`}>
                      {formData.bio.length}/2000
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Introduction Video URL (Optional)</label>
                  <input
                    type="url"
                    name="videoIntroUrl"
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    value={formData.videoIntroUrl}
                    onChange={handleInputChange}
                  />
                  <p className="field-note">A video introduction significantly increases your booking rate. Upload to YouTube or Vimeo and paste the link here.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Languages & Expertise</h2>
                  <p>Select the languages you can teach in and your areas of specialization.</p>
                </div>

                <div className="form-group">
                  <label>Languages You Teach In <span className="required">*</span></label>
                  <p className="field-note">Select all languages you're fluent in and can teach with.</p>
                  <div className="checkbox-grid">
                    {languageOptions.map(lang => (
                      <label key={lang} className={`checkbox-item ${formData.languages.includes(lang) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={() => toggleArrayItem('languages', lang)}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                  {formData.languages.length > 0 && (
                    <p className="selection-count">{formData.languages.length} language(s) selected</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Teaching Specialties <span className="required">*</span></label>
                  <p className="field-note">Select all subjects you're qualified to teach.</p>
                  <div className="checkbox-grid specialty-grid">
                    {specialties.map(spec => (
                      <label key={spec.id} className={`checkbox-item specialty-item ${formData.specialties.includes(spec.name) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(spec.name)}
                          onChange={() => toggleArrayItem('specialties', spec.name)}
                        />
                        <span className="specialty-icon">{spec.icon}</span>
                        <span className="specialty-name">{spec.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.specialties.length > 0 && (
                    <p className="selection-count">{formData.specialties.length} specialty(ies) selected</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Teaching Styles (Optional)</label>
                  <p className="field-note">How do you prefer to teach?</p>
                  <div className="checkbox-grid">
                    {teachingStyleOptions.map(style => (
                      <label key={style} className={`checkbox-item ${formData.teachingStyles.includes(style) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.teachingStyles.includes(style)}
                          onChange={() => toggleArrayItem('teachingStyles', style)}
                        />
                        <span>{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Experience & Education</h2>
                  <p>Share your teaching experience and educational background.</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Years of Teaching Experience <span className="required">*</span></label>
                    <input
                      type="number"
                      name="yearsExperience"
                      placeholder="e.g., 5"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="form-group">
                    <label>Highest Education Level <span className="required">*</span></label>
                    <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange}>
                      <option value="">Select education level</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Teaching Experience Details (Optional)</label>
                  <textarea
                    name="teachingExperience"
                    placeholder="Describe your teaching experience in detail. Include information about where you've taught, the types of students you've worked with, and any notable achievements..."
                    value={formData.teachingExperience}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Ijazah / Certifications Details (Optional)</label>
                  <textarea
                    name="ijazahDetails"
                    placeholder="If you have an Ijazah (chain of transmission) or other certifications, please describe them here. Include the name of your teacher/sheikh, the type of Ijazah, and the year received..."
                    value={formData.ijazahDetails}
                    onChange={handleInputChange}
                    rows={4}
                  />
                  <p className="field-note">Having an Ijazah significantly increases your credibility and booking rate.</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Pricing & Availability</h2>
                  <p>Set your hourly rate and availability preferences.</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hourly Rate (USD) <span className="required">*</span></label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        name="hourlyRate"
                        placeholder="25"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        min="5"
                        max="500"
                        className="price-input"
                      />
                      <span className="price-suffix">/hour</span>
                    </div>
                    {formData.hourlyRate && (
                      <div className="earnings-preview">
                        <p>Your earnings per hour: <strong>${(formData.hourlyRate * 0.8).toFixed(2)}</strong></p>
                        <p className="platform-fee">Platform fee: 20% (${(formData.hourlyRate * 0.2).toFixed(2)})</p>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Your Timezone <span className="required">*</span></label>
                    <select name="timezone" value={formData.timezone} onChange={handleInputChange}>
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                    <p className="field-note">Students will see class times in their local timezone.</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Availability Notes (Optional)</label>
                  <textarea
                    name="availabilityNotes"
                    placeholder="Any specific notes about your availability? e.g., 'Available weekdays after 5 PM EST' or 'Flexible schedule on weekends'"
                    value={formData.availabilityNotes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="pricing-tips">
                  <h4>Pricing Tips</h4>
                  <ul>
                    <li>New teachers typically start at $10-20/hour to build reviews</li>
                    <li>Experienced teachers with Ijazah can charge $30-50+/hour</li>
                    <li>You can adjust your rate anytime from your dashboard</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>Review Your Application</h2>
                  <p>Please review your information before submitting.</p>
                </div>

                <div className="review-sections">
                  <div className="review-section">
                    <h3>Personal Information</h3>
                    <div className="review-grid">
                      <div className="review-item">
                        <label>Nationality</label>
                        <p>{formData.nationality || 'Not specified'}</p>
                      </div>
                      <div className="review-item">
                        <label>Country</label>
                        <p>{formData.country || 'Not specified'}</p>
                      </div>
                      <div className="review-item">
                        <label>Gender</label>
                        <p>{formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Professional Profile</h3>
                    <div className="review-item full-width">
                      <label>Headline</label>
                      <p>{formData.headline}</p>
                    </div>
                    <div className="review-item full-width">
                      <label>About</label>
                      <p className="bio-preview">{formData.bio.substring(0, 200)}{formData.bio.length > 200 ? '...' : ''}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Languages & Expertise</h3>
                    <div className="review-item">
                      <label>Languages</label>
                      <p>{formData.languages.join(', ') || 'None selected'}</p>
                    </div>
                    <div className="review-item">
                      <label>Specialties</label>
                      <p>{formData.specialties.join(', ') || 'None selected'}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Experience & Pricing</h3>
                    <div className="review-grid">
                      <div className="review-item">
                        <label>Experience</label>
                        <p>{formData.yearsExperience} years</p>
                      </div>
                      <div className="review-item">
                        <label>Education</label>
                        <p>{formData.educationLevel || 'Not specified'}</p>
                      </div>
                      <div className="review-item">
                        <label>Hourly Rate</label>
                        <p>${formData.hourlyRate}/hour</p>
                      </div>
                      <div className="review-item">
                        <label>Your Earnings</label>
                        <p className="earnings-highlight">${(formData.hourlyRate * 0.8).toFixed(2)}/hour</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="auth-notice">
                    <div className="auth-icon">🔐</div>
                    <h4>Login Required</h4>
                    <p>You need to be logged in to submit your application.</p>
                    <button onClick={() => navigate('/login?redirect=/become-teacher')} className="btn-secondary">
                      Login or Sign Up
                    </button>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="submit-notice">
                    <div className="notice-icon">📋</div>
                    <h4>Ready to Submit?</h4>
                    <p>By clicking submit, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>. Your application will be reviewed within 24-48 hours.</p>
                  </div>
                )}
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button className="btn-outline" onClick={() => setStep(step - 1)}>
                  ← Previous
                </button>
              )}
              <div className="nav-spacer"></div>
              {step < 6 ? (
                <button 
                  className="btn-primary" 
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next Step →
                </button>
              ) : (
                <button 
                  className="btn-primary btn-submit" 
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
    </div>
  );
}

export default BecomeTeacher;
