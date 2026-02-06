import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* You can replace this emoji with an <img src="..." /> tag if you have a logo file */}
        <div className="app-logo-large">💰</div>
        
        <h1 className="app-name">SmartSpend <span className="highlight">AI</span></h1>
        <p className="app-tagline">Stop guessing. Start saving with AI-powered financial advice.</p>
        
        <div className="landing-buttons">
          <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-secondary" onClick={() => navigate('/register')}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;