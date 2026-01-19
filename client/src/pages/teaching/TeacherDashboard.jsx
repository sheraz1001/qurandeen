import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import HeroAnimated from '../../components/HeroAnimated';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import '../../styles/teaching.css';

function TeacherDashboard() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [error, setError] = useState('');
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/teacher-dashboard');
      return;
    }
    fetchDashboard();
  }, [isAuthenticated]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/teacher/dashboard', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 404) {
          navigate('/become-teacher');
          return;
        }
        throw new Error('Failed to load dashboard');
      }
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'messages') {
      fetchConversations();
    }
  }, [activeSection]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.partner_id);
      const interval = setInterval(() => fetchMessages(selectedConversation.partner_id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const response = await axios.get(`/api/messages/${partnerId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      await axios.post('/api/messages', {
        receiverId: selectedConversation.partner_id,
        content: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages(selectedConversation.partner_id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) return null;
  if (loading) return <Loading />;
  if (error) return (
    <div className="error-page">
      <h2>Error</h2>
      <p>{error}</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );
  if (!dashboardData) return null;

  const { profile, upcomingBookings = [], recentReviews = [], totalStudents = 0 } = dashboardData;
  const monthlyEarnings = Number(dashboardData.monthlyEarnings) || 0;

  return (
    <div className="teacher-dashboard-page">
      <Helmet>
        <title>Teacher Dashboard | QuranDeen</title>
      </Helmet>

      <HeroAnimated
        icon="📊"
        title="Teacher Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Teacher'}`}
        stats={[
          profile.is_verified ? '✓ Verified' : '⏳ Pending Verification',
          `${totalStudents} Students`,
          `$${monthlyEarnings.toFixed(2)} This Month`
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Teacher Dashboard' }
        ]}
      />

      <div className="container">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <nav className="dashboard-nav">
              <button 
                className={activeSection === 'overview' ? 'active' : ''}
                onClick={() => setActiveSection('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={activeSection === 'profile' ? 'active' : ''}
                onClick={() => setActiveSection('profile')}
              >
                👤 My Profile
              </button>
              <button 
                className={activeSection === 'bookings' ? 'active' : ''}
                onClick={() => setActiveSection('bookings')}
              >
                📅 Bookings
              </button>
              <button 
                className={activeSection === 'packages' ? 'active' : ''}
                onClick={() => setActiveSection('packages')}
              >
                📦 Packages
              </button>
              <button 
                className={activeSection === 'availability' ? 'active' : ''}
                onClick={() => setActiveSection('availability')}
              >
                🕐 Availability
              </button>
              <button 
                className={activeSection === 'earnings' ? 'active' : ''}
                onClick={() => setActiveSection('earnings')}
              >
                💰 Earnings
              </button>
              <button 
                className={activeSection === 'reviews' ? 'active' : ''}
                onClick={() => setActiveSection('reviews')}
              >
                ⭐ Reviews
              </button>
              <button 
                className={activeSection === 'messages' ? 'active' : ''}
                onClick={() => setActiveSection('messages')}
              >
                💬 Messages
              </button>
            </nav>
            <div className="sidebar-profile-link">
              <Link to={`/teachers/${profile.id}`} className="btn-secondary btn-small">
                View Public Profile
              </Link>
            </div>
          </aside>

          <main className="dashboard-main">
            {activeSection === 'overview' && (
              <div className="dashboard-section">
                <h2>Overview</h2>
                
                {!profile.is_verified && (
                  <div className="alert alert-warning">
                    <strong>Pending Verification</strong>
                    <p>Your profile is under review. You'll be notified once verified and can start accepting students.</p>
                  </div>
                )}

                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                      <span className="stat-value">{totalStudents}</span>
                      <span className="stat-label">Total Students</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                      <span className="stat-value">${monthlyEarnings.toFixed(2)}</span>
                      <span className="stat-label">This Month</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <div className="stat-info">
                      <span className="stat-value">{profile.average_rating?.toFixed(1) || '0.0'}</span>
                      <span className="stat-label">Average Rating</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🕐</span>
                    <div className="stat-info">
                      <span className="stat-value">{Math.round(profile.total_hours_taught || 0)}</span>
                      <span className="stat-label">Hours Taught</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <h3>Upcoming Classes</h3>
                    {upcomingBookings.length === 0 ? (
                      <p className="no-data">No upcoming classes scheduled.</p>
                    ) : (
                      <ul className="booking-list">
                        {upcomingBookings.slice(0, 5).map(booking => (
                          <li key={booking.id} className="booking-item">
                            <div className="booking-student">
                              <span className="student-avatar">
                                {booking.student_image ? (
                                  <img src={booking.student_image} alt={booking.student_name} />
                                ) : (
                                  booking.student_name?.charAt(0) || '?'
                                )}
                              </span>
                              <span>{booking.student_name}</span>
                            </div>
                            <div className="booking-time">
                              {new Date(booking.scheduled_at).toLocaleString()}
                            </div>
                            <div className="booking-package">{booking.package_name}</div>
                            {booking.meeting_url && (
                              <a href={booking.meeting_url} className="btn-small btn-join" target="_blank" rel="noopener noreferrer">
                                🎥 Join
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="dashboard-card">
                    <h3>Recent Reviews</h3>
                    {recentReviews.length === 0 ? (
                      <p className="no-data">No reviews yet.</p>
                    ) : (
                      <ul className="review-list">
                        {recentReviews.map(review => (
                          <li key={review.id} className="review-item-small">
                            <div className="review-header">
                              <span>{review.name}</span>
                              <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p className="review-text-small">{review.review_text?.slice(0, 100)}...</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="dashboard-section">
                <h2>My Profile</h2>
                <ProfileEditor profile={profile} onUpdate={fetchDashboard} />
              </div>
            )}

            {activeSection === 'bookings' && (
              <div className="dashboard-section">
                <h2>My Bookings</h2>
                <BookingsList bookings={upcomingBookings} />
              </div>
            )}

            {activeSection === 'packages' && (
              <div className="dashboard-section">
                <h2>My Packages</h2>
                <PackageManager teacherId={profile.id} onUpdate={fetchDashboard} />
              </div>
            )}

            {activeSection === 'availability' && (
              <div className="dashboard-section">
                <h2>My Availability</h2>
                <AvailabilityEditor onUpdate={fetchDashboard} />
              </div>
            )}

            {activeSection === 'earnings' && (
              <div className="dashboard-section">
                <h2>Earnings</h2>
                <div className="earnings-summary">
                  <div className="earnings-card">
                    <h3>This Month</h3>
                    <span className="earnings-amount">${monthlyEarnings.toFixed(2)}</span>
                  </div>
                  <p className="earnings-note">Detailed earnings history coming soon. Payouts are processed via Stripe Connect.</p>
                </div>
              </div>
            )}

            {activeSection === 'reviews' && (
              <div className="dashboard-section">
                <h2>My Reviews</h2>
                {recentReviews.length === 0 ? (
                  <p className="no-data">No reviews yet. Start teaching to receive reviews from students!</p>
                ) : (
                  <div className="reviews-full-list">
                    {recentReviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-avatar">
                              {review.profile_image ? (
                                <img src={review.profile_image} alt={review.name} />
                              ) : (
                                review.name?.charAt(0) || '?'
                              )}
                            </span>
                            <div>
                              <strong>{review.name}</strong>
                              <span className="review-date">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                        </div>
                        <p className="review-text">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'messages' && (
              <section className="dashboard-section messages-section">
                <h2>Messages</h2>
                
                <div className="messaging-container">
                  <div className="conversations-sidebar">
                    <h3>Conversations</h3>
                    {conversations.length > 0 ? (
                      <div className="conversations-list">
                        {conversations.map((conv) => (
                          <div 
                            key={conv.partner_id} 
                            className={`conversation-item ${selectedConversation?.partner_id === conv.partner_id ? 'active' : ''}`}
                            onClick={() => setSelectedConversation(conv)}
                          >
                            <img 
                              src={conv.partner_image || '/default-avatar.png'} 
                              alt={conv.partner_name}
                              className="conv-avatar"
                            />
                            <div className="conv-content">
                              <div className="conv-header">
                                <span className="conv-name">{conv.partner_name}</span>
                                <span className="conv-time">{formatMessageTime(conv.last_message_at)}</span>
                              </div>
                              <p className="conv-preview">{conv.last_message?.substring(0, 40)}{conv.last_message?.length > 40 ? '...' : ''}</p>
                            </div>
                            {parseInt(conv.unread_count) > 0 && (
                              <span className="unread-badge">{conv.unread_count}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-conversations">
                        <p>No conversations yet</p>
                      </div>
                    )}
                  </div>

                  <div className="chat-area">
                    {selectedConversation ? (
                      <>
                        <div className="chat-header">
                          <img 
                            src={selectedConversation.partner_image || '/default-avatar.png'} 
                            alt={selectedConversation.partner_name}
                            className="chat-avatar"
                          />
                          <span className="chat-name">{selectedConversation.partner_name}</span>
                        </div>
                        <div className="messages-list">
                          {messages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`message ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                            >
                              <div className="message-content">
                                <p>{msg.content}</p>
                                <span className="message-time">{formatMessageTime(msg.created_at)}</span>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                        <form className="message-input-form" onSubmit={sendMessage}>
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sendingMessage}
                          />
                          <button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                            {sendingMessage ? 'Sending...' : 'Send'}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="no-chat-selected">
                        <span className="chat-icon">💬</span>
                        <p>Select a conversation to start messaging</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ profile, onUpdate }) {
  const [formData, setFormData] = useState({
    headline: profile.headline || '',
    bio: profile.bio || '',
    yearsExperience: profile.years_experience || '',
    hourlyRate: profile.hourly_rate || '',
    timezone: profile.timezone || 'UTC'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save');
      setMessage('Profile updated successfully!');
      onUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-editor">
      {message && <div className="message">{message}</div>}
      <div className="form-group">
        <label>Headline</label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) => setFormData({...formData, headline: e.target.value})}
          maxLength={200}
        />
      </div>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          rows={6}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Years Experience</label>
          <input
            type="number"
            value={formData.yearsExperience}
            onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Hourly Rate ($)</label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
          />
        </div>
      </div>
      <button className="btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function BookingsList({ bookings }) {
  if (bookings.length === 0) {
    return <p className="no-data">No upcoming bookings.</p>;
  }

  return (
    <div className="bookings-table">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Date & Time</th>
            <th>Package</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.student_name}</td>
              <td>{new Date(booking.scheduled_at).toLocaleString()}</td>
              <td>{booking.package_name || 'Single Session'}</td>
              <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
              <td>
                {booking.meeting_url && (
                  <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer" className="btn-small">
                    Join Class
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PackageManager({ teacherId, onUpdate }) {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', specialty: '', durationMinutes: 60, sessionsCount: 1, price: '', validityDays: 30
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/teacher/profile', { credentials: 'include' });
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/teacher/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: '', description: '', specialty: '', durationMinutes: 60, sessionsCount: 1, price: '', validityDays: 30 });
        fetchPackages();
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;
    try {
      await fetch(`/api/teacher/packages/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchPackages();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="package-manager">
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add Package'}
      </button>

      {showForm && (
        <div className="package-form">
          <div className="form-group">
            <label>Package Name</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Specialty</label>
              <input value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <input type="number" value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sessions</label>
              <input type="number" value={formData.sessionsCount} onChange={(e) => setFormData({...formData, sessionsCount: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>
          <button className="btn-primary" onClick={handleCreate}>Create Package</button>
        </div>
      )}

      <div className="packages-list">
        {packages.map(pkg => (
          <div key={pkg.id} className="package-item">
            <div className="package-info">
              <h4>{pkg.name}</h4>
              <p>{pkg.description}</p>
              <span>{pkg.sessions_count} sessions • {pkg.duration_minutes} min • ${pkg.price}</span>
            </div>
            <button className="btn-danger btn-small" onClick={() => handleDelete(pkg.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityEditor({ onUpdate }) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/teacher/profile', { credentials: 'include' });
      const data = await res.json();
      setSlots(data.availability || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addSlot = (dayOfWeek) => {
    setSlots([...slots, { dayOfWeek, startTime: '09:00', endTime: '17:00', isNew: true }]);
  };

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const formattedSlots = slots.map(s => ({
        dayOfWeek: s.dayOfWeek ?? s.day_of_week,
        startTime: s.startTime ?? s.start_time,
        endTime: s.endTime ?? s.end_time
      }));
      
      await fetch('/api/teacher/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ slots: formattedSlots })
      });
      onUpdate();
      fetchAvailability();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="availability-editor">
      <p className="availability-note">Set your weekly availability. Students will be able to book during these times.</p>
      
      {dayNames.map((day, dayIndex) => {
        const daySlots = slots.filter(s => (s.dayOfWeek ?? s.day_of_week) === dayIndex);
        return (
          <div key={dayIndex} className="day-availability">
            <div className="day-header">
              <span className="day-name">{day}</span>
              <button className="btn-small" onClick={() => addSlot(dayIndex)}>+ Add Time</button>
            </div>
            {daySlots.length === 0 ? (
              <span className="no-availability">Not available</span>
            ) : (
              <div className="time-slots-editor">
                {daySlots.map((slot, i) => {
                  const slotIndex = slots.indexOf(slot);
                  return (
                    <div key={i} className="time-slot-row">
                      <input
                        type="time"
                        value={slot.startTime ?? slot.start_time?.slice(0, 5)}
                        onChange={(e) => updateSlot(slotIndex, 'startTime', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={slot.endTime ?? slot.end_time?.slice(0, 5)}
                        onChange={(e) => updateSlot(slotIndex, 'endTime', e.target.value)}
                      />
                      <button className="btn-danger btn-small" onClick={() => removeSlot(slotIndex)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      <button className="btn-primary" onClick={saveAvailability} disabled={saving}>
        {saving ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  );
}

export default TeacherDashboard;
