import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import HeroAnimated from '../../components/HeroAnimated';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import '../../styles/teaching.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ clientSecret, onSuccess, onError, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-wrapper">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': { color: '#9ca3af' }
            }
          }
        }} />
      </div>
      <button type="submit" disabled={!stripe || processing} className="btn-pay">
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

function BookClass() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [packages, setPackages] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/book-class/${id}`);
      return;
    }
    fetchTeacherData();
  }, [id, isAuthenticated, navigate]);

  const fetchTeacherData = async () => {
    try {
      const [teacherRes, availRes] = await Promise.all([
        axios.get(`/api/teachers/${id}`),
        axios.get(`/api/teachers/${id}/availability`)
      ]);
      setTeacher(teacherRes.data);
      setPackages(teacherRes.data.packages || []);
      setAvailability(availRes.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setError('Failed to load teacher information');
    } finally {
      setLoading(false);
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      const hasSlots = availability.some(slot => slot.day_of_week === dayOfWeek);
      if (hasSlots) {
        dates.push({
          date: date.toISOString().split('T')[0],
          dayName: dayNames[dayOfWeek],
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  const getTimeSlotsForDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    return availability.filter(slot => slot.day_of_week === dayOfWeek);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const initiatePayment = async () => {
    if (!selectedSlot || !selectedDate) {
      setError('Please select a date and time slot');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot.start_time}`);
      
      const response = await axios.post('/api/payments/create-intent', {
        teacherId: teacher.id,
        packageId: selectedPackage?.id || null,
        scheduledAt: scheduledAt.toISOString()
      });
      
      setClientSecret(response.data.clientSecret);
      setPaymentAmount(response.data.amount);
      setBookingStep(4);
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error.response?.data?.error || 'Failed to create payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot.start_time}`);
      
      await axios.post('/api/payments/confirm', {
        paymentIntentId,
        teacherId: teacher.id,
        packageId: selectedPackage?.id || null,
        scheduledAt: scheduledAt.toISOString(),
        notes
      });

      navigate('/student-dashboard?booked=true');
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError(error.response?.data?.error || 'Payment succeeded but booking failed. Please contact support.');
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return <Loading message="Loading booking information..." />;
  }

  if (!teacher) {
    return (
      <div className="teaching-page">
        <div className="error-state">
          <h2>Teacher Not Found</h2>
          <Link to="/teachers">Browse Teachers</Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Find Teachers', path: '/teachers' },
    { label: teacher.name, path: `/teachers/${id}` },
    { label: 'Book Class', path: `/book-class/${id}` }
  ];

  const availableDates = getAvailableDates();

  return (
    <div className="teaching-page">
      <Helmet>
        <title>Book Class with {teacher.name} | Quran Deen</title>
        <meta name="description" content={`Book a Quran class with ${teacher.name}. Select your preferred time slot and start learning.`} />
      </Helmet>

      <HeroAnimated
        title="Book Your Class"
        subtitle={`Schedule a session with ${teacher.name}`}
        icon="📅"
        breadcrumbItems={breadcrumbItems}
        stats={[
          { value: `$${teacher.hourly_rate}`, label: 'Per Hour' },
          { value: packages.length, label: 'Packages Available' },
          { value: availability.length, label: 'Weekly Slots' }
        ]}
      />

      <div className="booking-container">
        <div className="booking-progress">
          <div className={`progress-step ${bookingStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Package</span>
          </div>
          <div className={`progress-step ${bookingStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Schedule</span>
          </div>
          <div className={`progress-step ${bookingStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
          <div className={`progress-step ${bookingStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {bookingStep === 1 && (
          <div className="booking-step">
            <h2>Choose a Package (Optional)</h2>
            <p className="step-description">Select a package for discounted rates, or book a single session at ${teacher.hourly_rate}/hour.</p>
            
            <div className="package-options">
              <div 
                className={`package-option ${selectedPackage === null ? 'selected' : ''}`}
                onClick={() => setSelectedPackage(null)}
              >
                <div className="package-icon">🎯</div>
                <h4>Single Session</h4>
                <p className="package-price">${teacher.hourly_rate}</p>
                <p className="package-desc">Pay per class</p>
              </div>
              
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`package-option ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="package-icon">📦</div>
                  <h4>{pkg.name}</h4>
                  <p className="package-price">${pkg.price}</p>
                  <p className="package-desc">{pkg.total_classes} classes</p>
                  {pkg.description && <p className="package-features">{pkg.description}</p>}
                </div>
              ))}
            </div>

            <div className="booking-actions">
              <button className="btn-next" onClick={() => setBookingStep(2)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="booking-step">
            <h2>Select Date & Time</h2>
            <p className="step-description">Choose when you'd like to have your class.</p>
            
            <div className="date-picker">
              <h4>Available Dates</h4>
              <div className="date-grid">
                {availableDates.length > 0 ? (
                  availableDates.map((d) => (
                    <button
                      key={d.date}
                      className={`date-btn ${selectedDate === d.date ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(d.date);
                        setSelectedSlot(null);
                      }}
                    >
                      <span className="date-day">{d.dayName}</span>
                      <span className="date-num">{d.displayDate}</span>
                    </button>
                  ))
                ) : (
                  <p className="no-dates">No available dates in the next 2 weeks.</p>
                )}
              </div>
            </div>

            {selectedDate && (
              <div className="time-picker">
                <h4>Available Times on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                <div className="time-grid">
                  {getTimeSlotsForDate(selectedDate).map((slot) => (
                    <button
                      key={slot.id}
                      className={`time-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="booking-actions">
              <button className="btn-back" onClick={() => setBookingStep(1)}>Back</button>
              <button 
                className="btn-next" 
                onClick={() => setBookingStep(3)}
                disabled={!selectedSlot || !selectedDate}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="booking-step">
            <h2>Confirm Your Booking</h2>
            
            <div className="booking-summary">
              <div className="summary-card">
                <div className="summary-teacher">
                  <img 
                    src={teacher.profile_image || '/default-avatar.png'} 
                    alt={teacher.name}
                    className="teacher-avatar"
                  />
                  <div>
                    <h4>{teacher.name}</h4>
                    <p>{teacher.headline}</p>
                  </div>
                </div>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Package</span>
                    <span className="summary-value">{selectedPackage?.name || 'Single Session'}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Date</span>
                    <span className="summary-value">
                      {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Time</span>
                    <span className="summary-value">
                      {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">${selectedPackage?.price || teacher.hourly_rate}</span>
                  </div>
                </div>

                <div className="notes-section">
                  <label htmlFor="notes">Notes for teacher (optional)</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific topics you'd like to cover or questions you have..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn-back" onClick={() => setBookingStep(2)}>Back</button>
              <button 
                className="btn-next" 
                onClick={initiatePayment}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 4 && clientSecret && (
          <div className="booking-step">
            <h2>Complete Payment</h2>
            <p className="step-description">Enter your card details to complete the booking.</p>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Amount to pay:</span>
                <span className="amount">${paymentAmount}</span>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                amount={paymentAmount}
              />
            </Elements>

            <div className="booking-actions">
              <button className="btn-back" onClick={() => setBookingStep(3)}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookClass;
