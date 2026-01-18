import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import './donate.css';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100, 250];

function DonateForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [donationType, setDonationType] = useState('one-time');

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    const numValue = parseFloat(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setCustomAmount(value);
      if (numValue > 0) {
        setAmount(numValue);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) {
      setError('Please enter a valid donation amount (minimum $1)');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!donorEmail.trim()) {
      setError('Email address is required');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      if (donationType === 'monthly') {
        const { data } = await axios.post('/api/stripe/create-subscription', {
          amount: finalAmount,
          firstName,
          lastName,
          donorEmail,
          city,
          country,
          message
        });

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${firstName} ${lastName}`,
                email: donorEmail
              }
            }
          }
        );

        if (stripeError) {
          setError(stripeError.message);
        } else if (paymentIntent.status === 'succeeded') {
          await axios.post('/api/stripe/finalize-subscription', {
            customerId: data.customerId,
            priceId: data.priceId,
            paymentMethodId: paymentIntent.payment_method
          });
          onSuccess(finalAmount, true);
        } else {
          setError('Payment processing. Please wait...');
        }
      } else {
        const { data } = await axios.post('/api/stripe/create-payment-intent', {
          amount: finalAmount,
          firstName,
          lastName,
          donorEmail,
          city,
          country,
          message
        });

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${firstName} ${lastName}`,
                email: donorEmail
              }
            }
          }
        );

        if (stripeError) {
          setError(stripeError.message);
        } else if (paymentIntent.status === 'succeeded') {
          onSuccess(finalAmount, false);
        } else {
          setError('Payment processing. Please wait...');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#333',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        '::placeholder': {
          color: '#999'
        }
      },
      invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donate-form">
      <div className="form-section">
        <label className="form-label">Donation Type</label>
        <div className="donation-type-toggle">
          <button
            type="button"
            className={`type-btn ${donationType === 'one-time' ? 'active' : ''}`}
            onClick={() => setDonationType('one-time')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            One-Time
          </button>
          <button
            type="button"
            className={`type-btn ${donationType === 'monthly' ? 'active' : ''}`}
            onClick={() => setDonationType('monthly')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Monthly
          </button>
        </div>
        {donationType === 'monthly' && (
          <p className="recurring-note">Your card will be charged monthly. You can cancel anytime.</p>
        )}
      </div>

      <div className="form-section">
        <label className="form-label">Select Donation Amount {donationType === 'monthly' && '(per month)'}</label>
        <div className="amount-grid">
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className={`amount-btn ${amount === value && !customAmount ? 'active' : ''}`}
              onClick={() => handleAmountSelect(value)}
            >
              ${value}
            </button>
          ))}
        </div>
        <div className="custom-amount-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="custom-amount-input"
            min="1"
            step="0.01"
          />
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Your Information <span className="required">*</span></label>
        <div className="form-row">
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email Address *"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          className="form-input"
          required
        />
        <div className="form-row">
          <input
            type="text"
            placeholder="City (optional)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="form-input"
          />
        </div>
        <textarea
          placeholder="Leave a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-section">
        <label className="form-label">Payment Details</label>
        <div className="card-element-wrapper">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && <div className="donate-error">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="donate-submit-btn"
      >
        {processing ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {donationType === 'monthly' ? `Donate $${customAmount || amount}/month` : `Donate $${customAmount || amount}`}
          </>
        )}
      </button>

      <div className="secure-notice">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
        <span>Secured by Stripe. Your payment information is encrypted and secure.</span>
      </div>
    </form>
  );
}

function Donate() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Donate' }
  ];
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState('');
  const [success, setSuccess] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    axios.get('/api/stripe/config')
      .then(({ data }) => {
        setStripePromise(loadStripe(data.publishableKey));
        setLoading(false);
      })
      .catch((err) => {
        setConfigError(err.response?.data?.error || 'Donation system is temporarily unavailable');
        setLoading(false);
      });
  }, []);

  const handleSuccess = (amount, recurring = false) => {
    setDonatedAmount(amount);
    setIsRecurring(recurring);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (success) {
    return (
      <div className="donate-page">
        <div className="donate-success">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>JazakAllah Khair!</h1>
          <p className="success-message">
            {isRecurring ? (
              <>Your monthly donation of <strong>${donatedAmount.toFixed(2)}/month</strong> has been set up successfully.</>
            ) : (
              <>Your generous donation of <strong>${donatedAmount.toFixed(2)}</strong> has been received successfully.</>
            )}
          </p>
          {isRecurring && (
            <p className="recurring-confirmation">
              Your card will be charged ${donatedAmount.toFixed(2)} monthly. You can manage or cancel your subscription anytime through your email receipt.
            </p>
          )}
          <p className="success-dua">
            May Allah (SWT) accept your contribution and bless you abundantly. Your support helps us continue spreading the message of the Holy Quran.
          </p>
          <div className="success-verse">
            <p className="arabic">"مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ"</p>
            <p className="translation">"The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains."</p>
            <p className="reference">— Surah Al-Baqarah (2:261)</p>
          </div>
          <a href="/" className="back-home-btn">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-page">
      <SEO 
        title="Donate to QuranDeen - Support Free Quran Access for All"
        description="Support QuranDeen with your donation. Help us maintain free Quran access, 150+ reciters, 100+ translations, and Islamic tools for Muslims worldwide. Sadaqah Jariyah."
        canonical="https://qurandeen.com/donate"
        keywords="Donate to QuranDeen, Islamic charity, Sadaqah Jariyah, support Quran website, Islamic donation"
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="❤️"
        title="Support QuranDeen"
        subtitle="Help us spread the light of the Holy Quran to millions worldwide"
        stats={['Sadaqah Jariyah', 'Secure Payment', 'Tax Deductible']}
        breadcrumbs={breadcrumbs}
      />

      <div className="donate-container">
        <div className="donate-info">
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p>
              QuranDeen.com is dedicated to making the Holy Quran accessible to everyone, 
              everywhere, at any time. We believe that the divine guidance should be freely 
              available to all Muslims and those seeking to learn about Islam.
            </p>
          </div>

          <div className="why-donate">
            <h2>Why Your Donation Matters</h2>
            <p>
              Your generous contribution helps us maintain and improve our services. 
              As a Sadaqah Jariyah (ongoing charity), your donation continues to earn 
              rewards as long as people benefit from our platform.
            </p>
          </div>

          <div className="donation-uses">
            <h2>Your Donation Supports</h2>
            <ul className="features-list">
              <li>
                <span className="feature-icon">📖</span>
                <div>
                  <strong>Quranic Text & Audio</strong>
                  <p>Maintaining 150+ reciters and multiple Arabic scripts for authentic Quran recitation</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">🌍</span>
                <div>
                  <strong>100+ Translations</strong>
                  <p>Supporting translations in 40+ languages to reach global audiences</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">🤖</span>
                <div>
                  <strong>AI Islamic Scholar</strong>
                  <p>Providing authentic Islamic guidance powered by advanced AI technology</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">🔧</span>
                <div>
                  <strong>Islamic Tools</strong>
                  <p>Developing Hijri calendar, Adhkar, 99 Names of Allah, and more</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">💾</span>
                <div>
                  <strong>Server & Infrastructure</strong>
                  <p>Keeping the platform fast, reliable, and accessible 24/7</p>
                </div>
              </li>
              <li>
                <span className="feature-icon">🚀</span>
                <div>
                  <strong>New Features</strong>
                  <p>Continuously improving and adding new features for better user experience</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="hadith-section">
            <h3>The Prophet (ﷺ) said:</h3>
            <p className="hadith-text">
              "When a person dies, their deeds come to an end except for three: 
              Sadaqah Jariyah (ongoing charity), beneficial knowledge, or a righteous 
              child who prays for them."
            </p>
            <p className="hadith-reference">— Sahih Muslim</p>
          </div>
        </div>

        <div className="donate-form-section">
          <div className="form-header">
            <h2>Make a Donation</h2>
            <p>Every contribution, big or small, makes a difference</p>
          </div>

          {loading ? (
            <div className="donate-loading">
              <div className="spinner"></div>
              <p>Loading payment system...</p>
            </div>
          ) : configError ? (
            <div className="donate-config-error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>{configError}</p>
              <p className="config-error-sub">Please check back later or contact us for assistance.</p>
            </div>
          ) : stripePromise && (
            <Elements stripe={stripePromise}>
              <DonateForm onSuccess={handleSuccess} />
            </Elements>
          )}

          <div className="payment-methods">
            <p>Accepted Payment Methods</p>
            <div className="payment-icons">
              <svg viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <path d="M15.132 15.584h-2.038l1.275-7.854h2.038l-1.275 7.854z" fill="#fff"/>
                <path d="M22.233 7.878c-.403-.159-.935-.329-1.65-.329-1.82 0-3.101.966-3.113 2.35-.012 1.023.914 1.594 1.612 1.935.716.349 .957.572.954.884-.005.477-.572.696-1.101.696-.736 0-1.127-.108-1.732-.373l-.237-.113-.258 1.595c.43.199 1.225.371 2.05.38 1.936 0 3.195-.955 3.211-2.433.008-.811-.484-1.428-1.546-1.937-.644-.33-.938-.55-.934-.884 0-.296.302-.613.953-.613.545-.009 .94.116 1.248.247l.149.074.227-1.379z" fill="#fff"/>
                <path d="M25.22 7.73h-1.423c-.441 0-.771.127-.965.591l-2.737 6.53h1.935s.316-.877.388-1.07h2.364c.055.249.225 1.07.225 1.07h1.71L25.22 7.73zm-2.276 4.904c.153-.412.736-1.998.736-1.998-.011.019.152-.414.245-.682l.125.616s.354 1.704.428 2.064h-1.534z" fill="#fff"/>
                <path d="M11.22 7.73l-1.802 5.358-.192-.989c-.335-1.137-1.382-2.37-2.552-2.987l1.65 6.238h1.949l2.896-7.62h-1.949z" fill="#fff"/>
                <path d="M7.576 7.73H4.573l-.024.146c2.311.59 3.84 2.015 4.474 3.729l-.645-3.271c-.112-.449-.437-.587-.802-.604z" fill="#F9A533"/>
              </svg>
              <svg viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#fff" stroke="#E6E6E6"/>
                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 17.5a7 7 0 010-11 7 7 0 000 11z" fill="#FF5F00"/>
              </svg>
              <svg viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#006FCF"/>
                <path d="M8 17V7h6l.7 1.5L16 7h6v10h-6l-.7-1.5L14 17H8z" fill="#fff"/>
                <path d="M10 9v6h2.5l1.5-3 1.5 3H18V9h-2.5l-1.5 3-1.5-3H10z" fill="#006FCF"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="donate-footer">
        <p>
          QuranDeen.com is committed to transparency. All donations are used solely for 
          maintaining and improving our Quranic services. For questions about donations, 
          please <a href="/contact">contact us</a>.
        </p>
      </div>
    </div>
  );
}

export default Donate;
