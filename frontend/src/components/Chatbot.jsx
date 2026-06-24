import { useState, useRef, useEffect } from 'react';
import { contentAPI } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am the AI-Solutions virtual assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await contentAPI.chatbot(userMessage);
      setMessages((prev) => [...prev, { type: 'bot', text: res.data.data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Sorry, I am having trouble connecting. Please try again or visit our Contact page.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (window.location.pathname.startsWith('/admin')) return null;

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            AI-Solutions Assistant
            <button
              className="btn btn-sm btn-link text-white float-end p-0"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <span className="spinner-border spinner-border-sm" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Open chat">
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;
