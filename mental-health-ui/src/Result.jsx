import { useState } from "react"; // Added useState
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, Activity, Share2, Calendar, MessageCircle, X } from "lucide-react";
import TherapyBot from "./Chatbot/TherapyBot";

export default function Result() {
  const { state } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle bot

  if (!state) {
    return (
        <div className="page-container center-content">
          <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500&display=swap');
              .page-container { min-height: 100vh; background: #F9F7F2; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; color: #4A3B32; }
              .empty-card { background: rgba(255,255,255,0.8); padding: 3rem; border-radius: 24px; text-align: center; border: 1px solid #E6D5C3; }
              .btn { background: #2C241F; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; display: inline-block; margin-top: 1rem; }
          `}</style>
          <div className="empty-card">
            <Activity size={48} color="#8C6B5D" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '0.5rem' }}>No Result Found</h2>
            <p>Please complete the assessment first.</p>
            <Link to="/" className="btn">Go to Home</Link>
          </div>
        </div>
      );
  }

  const isHighRisk = state.prediction === 1;
  const percentage = (state.risk_score * 100).toFixed(1);
  

  const resultConfig = isHighRisk
    ? {
        title: "High Risk Indicator",
        subtitle: "Our AI analysis suggests potential risk factors.",
        color: "#A65D57",
        bg: "rgba(166, 93, 87, 0.1)",
        icon: <AlertTriangle size={64} color="#A65D57" />,
        advice: "We strongly recommend scheduling a consultation with a specialist. Your well-being is the priority.",
      }
    : {
        title: "Low Risk Indicator",
        subtitle: "Your profile suggests a balanced state of mind.",
        color: "#5D8C6B",
        bg: "rgba(93, 140, 107, 0.1)",
        icon: <CheckCircle2 size={64} color="#5D8C6B" />,
        advice: "Keep up your current healthy habits. Regular check-ins are still encouraged to maintain balance.",
      };

  return (
    <div className="page-container">
      <style>{`
/* Import Fonts */
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
        .chat {
          margin-top: 40px;
          font-size: 12px;
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

        /* Card Container */
        .result-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          background: var(--white-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255, 0.6);
          border-radius: 32px;
          padding: 3rem 2rem;
          box-shadow: 0 25px 60px -15px rgba(74, 59, 50, 0.15);
          text-align: center;
          animation: fadeUp 0.8s ease-out;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Icon Wrapper */
        .icon-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: ${resultConfig.bg};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem auto;
          position: relative;
        }
        
        .icon-wrapper::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid ${resultConfig.color};
          opacity: 0.3;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        /* Typography */
        h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: var(--text-espresso);
        }
        
        .subtitle { color: var(--text-mocha); font-size: 1.1rem; margin-bottom: 2.5rem; }

        /* Metrics Section */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .metric-box {
          background: var(--bg-cream);
          border: 1px solid var(--border-latte);
          padding: 1.5rem;
          border-radius: 20px;
          text-align: left;
        }

        .metric-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 0.5rem; }
        .metric-value { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 600; color: var(--text-espresso); }

        /* Advice Section */
        .advice-box {
          background: rgba(44, 36, 31, 0.03);
          border-left: 4px solid ${resultConfig.color};
          padding: 1.5rem;
          text-align: left;
          border-radius: 8px;
          margin-bottom: 3rem;
        }
        .advice-text { font-size: 0.95rem; line-height: 1.6; color: var(--text-mocha); }

        /* Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-primary {
          background-color: var(--text-espresso);
          color: #fff;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-primary:hover { background-color: #43302B; transform: translateY(-2px); }

        .btn-secondary {
          background-color: transparent;
          color: var(--text-mocha);
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-latte);
          transition: all 0.2s;
        }
        .btn-secondary:hover { background-color: rgba(230, 213, 195, 0.3); }

        /* Mobile */
        @media (max-width: 600px) {
          .result-card { padding: 2rem 1.5rem; border-radius: 24px; }
          .metrics-grid { grid-template-columns: 1fr; }
          h2 { font-size: 2rem; }
          .action-buttons { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
        }
        /* FLOATING CHAT BUTTON */
        .fab-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .fab-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--text-espresso);
          color: white;
          border: none;
          box-shadow: 0 10px 25px rgba(44, 36, 31, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .fab-button:hover { transform: scale(1.1) translateY(-5px); }

        /* CHAT POPUP MODAL */
        .chat-popup {
          position: fixed;
          bottom: 6.5rem;
          right: 2rem;
          width: 400px;
          height: 600px;
          z-index: 1001;
          animation: slideIn 0.4s ease-out;
          transform-origin: bottom right;
        }

        

        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.5) translateY(50px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 500px) {
          .chat-popup {
            width: 90vw;
            right: 5vw;
            bottom: 5rem;
          }
          .fab-container { right: 1rem; bottom: 1rem; }
        }
      `}</style>

      {/* --- BACKGROUND BLOBS --- */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* --- CONTENT CARD --- */}
      <div className="result-card">
        <div className="icon-wrapper">{resultConfig.icon}</div>
        <h2>{resultConfig.title}</h2>
        <p className="subtitle">{resultConfig.subtitle}</p>

        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-label">AI Confidence</span>
            <div className="metric-value">{percentage}%</div>
          </div>
          <div className="metric-box">
            <span className="metric-label">Assessment Date</span>
            <div className="metric-value" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <Calendar size={18} color="#8C6B5D" />
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="advice-box">
          <p className="advice-text">
            <strong>Recommendation:</strong> {resultConfig.advice}
          </p>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <button className="btn-primary" onClick={() => window.print()}>
            <Share2 size={18} />
            <span>Save Report</span>
          </button>
          
        </div>
        <span className="chat" onClick={() => setIsChatOpen(!isChatOpen)}>
            <span>Chat with our therapy bot</span>
          </span>
      </div>

      {/* --- FLOATING CHATBOT INTERFACE --- */}
      <div className="fab-container">
        {isChatOpen && (
          <div className="chat-popup">
            <TherapyBot />
          </div>
        )}
        
        <button 
          className="fab-button" 
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Toggle Chat"
        >
          {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>
    </div>
  );
}