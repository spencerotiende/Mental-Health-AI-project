import React, { useState, useRef, useEffect } from 'react';

export default function TherapyBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there. I’m here to listen. How are you feeling today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'die', 'end it all', 'hurt myself'];
  const [showCrisis, setShowCrisis] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (CRISIS_KEYWORDS.some(word => input.toLowerCase().includes(word))) {
      setShowCrisis(true);
      return; 
    }

    const newHistory = [...messages, { role: 'user', content: input }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Ensure this matches your FastAPI trailing slash configuration
      const response = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory }),
      });

      const data = await response.json();
      setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newHistory, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bot-page-wrapper">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

        /* Variables */
        :root {
          --bg-cream: #F9F7F2;
          --text-espresso: #2C241F;
          --text-mocha: #5D4037;
          --text-muted: #8C6B5D;
          --border-latte: #E6D5C3;
          --white-glass: rgba(255, 255, 255, 0.85);
        }

        /* Base Setup */
        * { box-sizing: border-box; }
        .page-container {
          min-height: 100vh;
          background-color: var(--bg-cream);
          font-family: 'Inter', sans-serif;
          color: var(--text-espresso);
          padding: 2rem 1rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Blobs Background */
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; }
        .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #E6D5C3; }
        .blob-2 { bottom: -10%; right: -10%; width: 500px; height: 500px; background: #D4C4B5; }

          
        .bot-page-wrapper {
          --bg-cream: #F9F7F2;
          --text-espresso: #2C241F;
          --text-mocha: #5D4037;
          --border-latte: #E6D5C3;
          --white-glass: rgba(255, 255, 255, 0.9);
          
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Inter', sans-serif;
          color: var(--text-espresso);
        }

        .chat-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 650px;
          background: var(--white-glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-latte);
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(74, 59, 50, 0.15);
          display: flex;
          flex-col: column;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid var(--border-latte);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin: 0;
          color: var(--text-espresso);
        }

        .header-title p {
          font-size: 0.7rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-mocha);
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(249, 247, 242, 0.5);
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }

        .bubble {
          max-width: 85%;
          padding: 1rem;
          font-size: 0.95rem;
          line-height: 1.5;
          border-radius: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .user .bubble {
          background: var(--text-espresso);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .assistant .bubble {
          background: #fff;
          color: var(--text-mocha);
          border: 1px solid var(--border-latte);
          border-bottom-left-radius: 4px;
        }

        .typing {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0.5rem 1rem;
        }

        .input-area {
          padding: 1.5rem;
          background: #fff;
          border-top: 1px solid var(--border-latte);
        }

        .input-wrapper {
          display: flex;
          gap: 0.75rem;
        }

        .chat-input {
          flex: 1;
          padding: 1rem;
          border-radius: 16px;
          border: 1px solid var(--border-latte);
          background: #FCFAF8;
          outline: none;
          transition: all 0.2s;
        }

        .chat-input:focus {
          border-color: var(--text-espresso);
          box-shadow: 0 0 0 3px rgba(44, 36, 31, 0.05);
        }

        .send-btn {
          background: var(--text-espresso);
          color: #fff;
          border: none;
          padding: 0 1.5rem;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .send-btn:hover { transform: translateY(-2px); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .disclaimer {
          text-align: center;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.75rem;
        }

        .crisis-overlay {
          position: absolute;
          inset: 0;
          z-index: 100;
          background: rgba(249, 247, 242, 0.98);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .crisis-btn {
          width: 100%;
          background: #BC4749;
          color: white;
          text-decoration: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: bold;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="chat-container">
        <div className="chat-header">
          <div className="header-title">
            <h2>Nakujali AI</h2>
            <p>Support Companion</p>
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role}`}>
              <div className="bubble">
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && <div className="typing">Nakujali is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {showCrisis && (
          <div className="crisis-overlay">
            <h3 style={{fontFamily: 'Playfair Display', fontSize: '1.8rem'}}>You are not alone.</h3>
            <p style={{margin: '1.5rem 0', color: '#5D4037'}}>
              It sounds like you are going through a very difficult time. Please reach out for human support.
            </p>
            <a href="tel:190" className="crisis-btn">Call 190 Kenya Suicide Prevention Helpline</a>
            <button 
              onClick={() => setShowCrisis(false)}
              style={{background: 'none', border: 'none', color: '#8C6B5D', cursor: 'pointer', textDecoration: 'underline'}}
            >
              Back to chat
            </button>
          </div>
        )}

        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="How are you feeling?"
            />
            <button 
              className="send-btn" 
              onClick={sendMessage}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
          <p className="disclaimer">AI Companion. Not a replacement for professional therapy.</p>
        </div>
      </div>
    </div>
  );
}