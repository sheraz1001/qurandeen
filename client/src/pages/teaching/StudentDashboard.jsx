import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import HeroAnimated from '../../components/HeroAnimated';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import '../../styles/teaching.css';

function StudentDashboard() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/student-dashboard');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-badge scheduled',
      completed: 'status-badge completed',
      cancelled: 'status-badge cancelled',
      active: 'status-badge active',
      expired: 'status-badge expired'
    };
    return <span className={statusClasses[status] || 'status-badge'}>{status}</span>;
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

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Student Dashboard', path: '/student-dashboard' }
  ];

  return (
    <div className="teaching-page">
      <Helmet>
        <title>Student Dashboard | Quran Deen</title>
        <meta name="description" content="Manage your Quran learning journey - view upcoming classes, track progress, and connect with teachers." />
      </Helmet>

      <HeroAnimated
        title="Student Dashboard"
        subtitle="Manage your Quran learning journey"
        icon="📖"
        breadcrumbItems={breadcrumbItems}
        stats={[
          { value: dashboardData?.upcomingClasses?.length || 0, label: 'Upcoming Classes' },
          { value: dashboardData?.activeSubscriptions?.length || 0, label: 'Active Plans' },
          { value: dashboardData?.completedClasses || 0, label: 'Classes Completed' }
        ]}
      />

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-btn ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="sidebar-icon">📊</span>
              Overview
            </button>
            <button 
              className={`sidebar-btn ${activeSection === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveSection('classes')}
            >
              <span className="sidebar-icon">📅</span>
              My Classes
            </button>
            <button 
              className={`sidebar-btn ${activeSection === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveSection('subscriptions')}
            >
              <span className="sidebar-icon">📦</span>
              Subscriptions
            </button>
            <button 
              className={`sidebar-btn ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              <span className="sidebar-icon">💳</span>
              Payment History
            </button>
            <button 
              className={`sidebar-btn ${activeSection === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveSection('messages')}
            >
              <span className="sidebar-icon">💬</span>
              Messages
            </button>
          </nav>

          <div className="sidebar-cta">
            <Link to="/teachers" className="btn-find-teacher">
              Find a Teacher
            </Link>
          </div>
        </aside>

        <main className="dashboard-main">
          {activeSection === 'overview' && (
            <section className="dashboard-section">
              <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <span className="stat-value">{dashboardData?.upcomingClasses?.length || 0}</span>
                    <span className="stat-label">Upcoming Classes</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <span className="stat-value">{dashboardData?.activeSubscriptions?.length || 0}</span>
                    <span className="stat-label">Active Plans</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <span className="stat-value">{dashboardData?.completedClasses || 0}</span>
                    <span className="stat-label">Classes Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <span className="stat-value">{dashboardData?.reviewsGiven || 0}</span>
                    <span className="stat-label">Reviews Given</span>
                  </div>
                </div>
              </div>

              {dashboardData?.upcomingClasses?.length > 0 && (
                <div className="upcoming-section">
                  <h3>Next Class</h3>
                  <div className="next-class-card">
                    <div className="class-teacher">
                      <img 
                        src={dashboardData.upcomingClasses[0].teacher_image || '/default-avatar.png'} 
                        alt={dashboardData.upcomingClasses[0].teacher_name}
                        className="teacher-avatar"
                      />
                      <div className="teacher-info">
                        <span className="teacher-name">{dashboardData.upcomingClasses[0].teacher_name}</span>
                        <span className="class-type">{dashboardData.upcomingClasses[0].package_name || 'Single Session'}</span>
                      </div>
                    </div>
                    <div className="class-time">
                      <span className="time-label">Scheduled for</span>
                      <span className="time-value">{formatDate(dashboardData.upcomingClasses[0].scheduled_at)}</span>
                    </div>
                    <div className="class-actions">
                      {dashboardData.upcomingClasses[0].meeting_url && (
                        <a href={dashboardData.upcomingClasses[0].meeting_url} className="btn-join-class" target="_blank" rel="noopener noreferrer">
                          🎥 Join Class
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(!dashboardData?.upcomingClasses || dashboardData.upcomingClasses.length === 0) && (
                <div className="empty-state">
                  <span className="empty-icon">📚</span>
                  <h3>No Upcoming Classes</h3>
                  <p>Find a teacher and book your first Quran lesson!</p>
                  <Link to="/teachers" className="btn-primary">Browse Teachers</Link>
                </div>
              )}
            </section>
          )}

          {activeSection === 'classes' && (
            <section className="dashboard-section">
              <h2>My Classes</h2>
              
              {dashboardData?.upcomingClasses?.length > 0 ? (
                <div className="classes-list">
                  {dashboardData.upcomingClasses.map((cls) => (
                    <div key={cls.id} className="class-item">
                      <div className="class-teacher">
                        <img 
                          src={cls.teacher_image || '/default-avatar.png'} 
                          alt={cls.teacher_name}
                          className="teacher-avatar-sm"
                        />
                        <div>
                          <span className="teacher-name">{cls.teacher_name}</span>
                          <span className="class-package">{cls.package_name || 'Single Session'}</span>
                        </div>
                      </div>
                      <div className="class-datetime">
                        {formatDate(cls.scheduled_at)}
                      </div>
                      <div className="class-status">
                        {getStatusBadge(cls.status)}
                      </div>
                      <div className="class-actions">
                        {cls.meeting_url && cls.status === 'scheduled' && (
                          <a href={cls.meeting_url} className="btn-small btn-join" target="_blank" rel="noopener noreferrer">
                            🎥 Join
                          </a>
                        )}
                        {cls.status === 'completed' && !cls.has_review && (
                          <button className="btn-small btn-review">Leave Review</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📅</span>
                  <h3>No Classes Yet</h3>
                  <p>Book your first class with a Quran teacher.</p>
                  <Link to="/teachers" className="btn-primary">Find a Teacher</Link>
                </div>
              )}
            </section>
          )}

          {activeSection === 'subscriptions' && (
            <section className="dashboard-section">
              <h2>My Subscriptions</h2>
              
              {dashboardData?.activeSubscriptions?.length > 0 ? (
                <div className="subscriptions-list">
                  {dashboardData.activeSubscriptions.map((sub) => (
                    <div key={sub.id} className="subscription-card">
                      <div className="sub-header">
                        <h4>{sub.package_name}</h4>
                        {getStatusBadge(sub.status)}
                      </div>
                      <div className="sub-teacher">
                        <img 
                          src={sub.teacher_image || '/default-avatar.png'} 
                          alt={sub.teacher_name}
                          className="teacher-avatar-sm"
                        />
                        <span>{sub.teacher_name}</span>
                      </div>
                      <div className="sub-details">
                        <div className="sub-stat">
                          <span className="sub-label">Classes Used</span>
                          <span className="sub-value">{sub.classes_used} / {sub.total_classes}</span>
                        </div>
                        <div className="sub-stat">
                          <span className="sub-label">Expires</span>
                          <span className="sub-value">{new Date(sub.expires_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="sub-progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${(sub.classes_used / sub.total_classes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <h3>No Active Subscriptions</h3>
                  <p>Purchase a class package to save on regular lessons.</p>
                  <Link to="/teachers" className="btn-primary">Browse Packages</Link>
                </div>
              )}
            </section>
          )}

          {activeSection === 'payments' && (
            <section className="dashboard-section">
              <h2>Payment History</h2>
              
              {dashboardData?.payments?.length > 0 ? (
                <div className="payments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Teacher</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                          <td>{payment.description}</td>
                          <td>{payment.teacher_name}</td>
                          <td>${payment.amount.toFixed(2)}</td>
                          <td>{getStatusBadge(payment.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">💳</span>
                  <h3>No Payment History</h3>
                  <p>Your payment history will appear here after your first purchase.</p>
                </div>
              )}
            </section>
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
  );
}

export default StudentDashboard;
