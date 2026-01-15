import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bahrain", "Bangladesh", "Belgium", "Bosnia and Herzegovina",
  "Brazil", "Brunei", "Canada", "China", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "Hong Kong", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Lebanon", "Libya", "Malaysia",
  "Maldives", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Philippines",
  "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "Singapore", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Thailand", "Tunisia", "Turkey", "UAE", "Uganda", "UK", "Ukraine", "USA", "Uzbekistan", "Yemen"
];

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.name, formData.email, formData.password, formData.city, formData.country);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join QuranDeen to track your Quran reading journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
