import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageSquareHeart, ShieldCheck, ArrowRight, Sparkles, Sprout } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper {
          --bg-cream: #F9F7F2;
          --text-espresso: #2C241F;
          --text-mocha: #5D4037;
          --text-muted: #8C6B5D;
          --border-latte: #E6D5C3;
          --white-glass: rgba(255, 255, 255, 0.85);
          
          min-height: 100vh;
          background-color: var(--bg-cream);
          color: var(--text-espresso);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          padding: 8rem 2rem 4rem;
          text-align: center;
          position: relative;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          z-index: 0;
        }
        .blob-1 { top: -10%; right: 10%; width: 400px; height: 400px; background: #E6D5C3; }

        .hero-content { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; }
        
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-espresso);
        }

        .hero-p {
          font-size: 1.25rem;
          color: var(--text-mocha);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--white-glass);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-latte);
          padding: 2.5rem;
          border-radius: 32px;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: var(--text-muted);
        }

        .icon-circle {
          width: 50px;
          height: 50px;
          background: #F2EBE4;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        h3 { font-family: 'Playfair Display', serif; font-size: 1.75rem; margin-bottom: 1rem; }
        .feature-p { color: var(--text-mocha); line-height: 1.6; font-size: 0.95rem; }

        /* CTA Buttons */
        .cta-group { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
        
        .btn-main {
          background: var(--text-espresso);
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .btn-main:hover { background: #43302B; transform: translateY(-2px); }

        /* Stats Section */
        .info-strip {
          background: #2C241F;
          color: #F9F7F2;
          padding: 4rem 2rem;
          margin-top: 4rem;
          text-align: center;
        }

        .stats-grid {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .stat-item h4 { font-size: 2.5rem; font-family: 'Playfair Display', serif; margin-bottom: 0.5rem; }
        .stat-item p { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }

        @media (max-width: 768px) {
          h1 { font-size: 2.5rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .cta-group { flex-direction: column; }
        }
      `}</style>

      <div className="blob blob-1"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#E6D5C3', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', color: '#2C241F', marginBottom: '1.5rem' }}>
            <Sparkles size={14} />
            <span>AI-POWERED MENTAL WELLNESS</span>
          </div>
          <h1>Finding clarity in the <br /><i>quiet moments.</i></h1>
          <p className="hero-p">
          Nakujali AI combines advanced predictive modeling with compassionate artificial intelligence to provide a safe space for your mental health journey.
          </p>
          <div className="cta-group">
            <Link to="/assessment" className="btn-main">
              Start Screening <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Diagram Placeholder for Mental Health Support Flow */}
      

      {/* Features Grid */}
      <section className="features-section">
        <div className="feature-card">
          <div className="icon-circle">
            <Brain color="#2C241F" size={24} />
          </div>
          <h3>Risk Assessment</h3>
          <p className="feature-p">
            Utilizing XGBoost and LightGBM models to analyze behavioral patterns and identify potential risks for depression with clinical-grade accuracy.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-circle">
            <MessageSquareHeart color="#2C241F" size={24} />
          </div>
          <h3>Specialized Chat</h3>
          <p className="feature-p">
            A dedicated AI companion trained strictly for mental health support. No distractions—just a safe space for your emotional well-being.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-circle">
            <ShieldCheck color="#2C241F" size={24} />
          </div>
          <h3>Privacy First</h3>
          <p className="feature-p">
            Your data is handled with the highest standards of security. We provide tools for self-reflection without judgment or exposure.
          </p>
        </div>
      </section>

      {/* Why it Matters Section */}
      <section className="info-strip">
        <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ color: '#F9F7F2', marginBottom: '1rem' }}>The Power of Early Detection</h2>
          <p style={{ opacity: '0.8' }}>
            Mental health challenges affect 1 in 4 people globally. Early intervention through AI-assisted screening can significantly improve long-term wellness outcomes.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>90%</h4>
            <p>Model Accuracy</p>
          </div>
          <div className="stat-item">
            <h4>24/7</h4>
            <p>AI Availability</p>
          </div>
          <div className="stat-item">
            <h4>100%</h4>
            <p>Private & Secure</p>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <Sprout size={32} color="#8C6B5D" style={{ marginBottom: '1rem' }} />
        <p style={{ color: '#8C6B5D', fontSize: '0.9rem' }}>© 2026 Nakujali AI Project. Built for better minds.</p>
      </footer>
    </div>
  );
}