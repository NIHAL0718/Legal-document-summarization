import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I\'m your AI assistant. Ask me anything about the document.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { summary = '', extractedText = '' } = location.state || {};

  useEffect(() => {
    if (!summary && !extractedText) {
      navigate('/summarize');
    }
  }, [summary, extractedText, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setIsLoading(true);
    const userMessage = { from: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);

    const requestBody = {
      question: String(trimmedInput),
      summary: String(summary),
      extracted_text: String(extractedText)
    };

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();
      const botMessage = { from: 'bot', text: data.answer || 'No response received.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorText = error.message.includes('Failed to fetch')
        ? 'Cannot connect to the server. Please make sure the backend is running.'
        : 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, { from: 'bot', text: errorText }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chat-header">
          <div className="ai-avatar">
            <div className="avatar-pulse"></div>
            <div className="avatar-icon">AI</div>
          </div>
          <div className="header-content">
            <h1 className="chatbot-heading">Document Assistant</h1>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.from === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask about your document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className="send-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
          <div className="hint-text">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;