import { useState, useRef, useEffect } from 'react';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import '../styles/chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef(null);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    if (latestMessageRef.current && !isStreaming) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length, isStreaming]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantMessage };
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('###')) {
        return <h4 key={i} className="chat-heading">{line.replace(/^###\s*/, '')}</h4>;
      }
      if (line.startsWith('##')) {
        return <h3 key={i} className="chat-heading">{line.replace(/^##\s*/, '')}</h3>;
      }
      if (line.startsWith('#')) {
        return <h2 key={i} className="chat-heading">{line.replace(/^#\s*/, '')}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="chat-list-item">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={i} className="chat-list-item">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      if (line.startsWith('>')) {
        return <blockquote key={i} className="chat-quote">{line.slice(1).trim()}</blockquote>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
      }
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      return line ? <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} /> : <br key={i} />;
    });
  };

  const suggestedQuestions = [
    "What does the Quran say about patience?",
    "How to perform Salah correctly?",
    "What are the benefits of fasting?",
    "Explain Surah Al-Fatiha",
    "How to deal with anxiety in Islam?",
    "What is the importance of Zakat?"
  ];

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'AI Scholar' }
  ];

  return (
    <div className="chat-page">
      <SEO 
        title="Islamic Scholar AI - Ask Questions about Quran & Hadith"
        description="Chat with our AI Islamic Scholar for answers based on Quran and authentic Hadith. Get guidance on Islamic teachings, Salah, fasting, Zakat, and more with source citations."
        canonical="https://qurandeen.com/islamic-ai-scholar"
        keywords="Islamic AI, Ask about Quran, Hadith questions, Islamic guidance, AI scholar, Islamic chat, Quran AI, Muslim AI assistant"
        breadcrumbs={breadcrumbs}
      />
      <HeroAnimated
        icon="🤖"
        title="Islamic Scholar AI"
        subtitle="Ask questions about Quran, Hadith & Islamic guidance"
        stats={['Quran-based', 'Authentic Hadith', 'Source Citations']}
        breadcrumbs={breadcrumbs}
      />
      
      <div className="chat-main-content">
        {messages.length > 0 && (
          <div className="chat-header">
            <button onClick={clearChat} className="clear-chat-btn" title="Start new conversation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              New Conversation
            </button>
          </div>
        )}

        <div className="chat-messages-area">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon">
                <span className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              </div>
              <h2>Welcome to Islamic Scholar AI</h2>
              <p>
                I am here to help you understand the Holy Quran, authentic Hadith, and provide 
                Islamic guidance for your questions. All answers are based on Quran and Sunnah.
              </p>
              <div className="suggested-questions">
                <h3>Suggested Questions</h3>
                <div className="suggestions-grid">
                  {suggestedQuestions.map((question, i) => (
                    <button 
                      key={i} 
                      className="suggestion-btn"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`chat-message ${message.role}`}
                ref={index === messages.length - 1 ? latestMessageRef : null}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  )}
                </div>
                <div className="message-content">
                  {message.role === 'assistant' ? (
                    <div className="formatted-content">
                      {formatMessage(message.content)}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="chat-message assistant">
              <div className="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-section">
          <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about Quran, Hadith, or Islamic guidance..."
                rows={1}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="send-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <p className="chat-disclaimer">
              Responses are AI-generated based on Islamic sources. For legal rulings (Fatwa), please consult a qualified scholar.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
