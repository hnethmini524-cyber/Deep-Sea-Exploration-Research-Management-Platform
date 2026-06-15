import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log("Authenticating operator parameters:", { name, email, password });
  };

  return (
    <div className="vision-auth-viewport-root">
      <div className="auth-split-layout-container">
        
        {/* Image panel */}
        <div className="auth-showcase-panel">
          <div className="showcase-overlay-gradient"></div>
          <div className="showcase-branding-wrapper">
            <p className="branding-sub-tag">INSPIRED BY OCEAN EXPLORER:</p>
            <h1 className="branding-main-title">DEEP SEA EXPLORATION</h1>
          </div>
        </div>

        {/* Sign up form */}
        <div className="auth-form-panel">
          <div className="form-workspace-card">
            
            <div className="form-header-block">
              <h2 className="form-main-heading">Nice to see you!</h2>
              <p className="form-subtitle-caption">Enter your details to sign up</p>
            </div>

            <form onSubmit={handleSignInSubmit} className="interactive-auth-form">

              <div className="auth-input-group">
                <label className="auth-input-label">User Name</label>
                <input 
                  type="name" 
                  className="auth-terminal-field"
                  placeholder="Your name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="auth-input-group">
                <label className="auth-input-label">Email</label>
                <input 
                  type="email" 
                  className="auth-terminal-field"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <input 
                  type="password" 
                  className="auth-terminal-field"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-deploy-action">
                SIGN UP
              </button>

            </form>

            <div className="auth-footer-navigation font-monospace">
              <span className="text-muted-dim">Do you have an account? </span>
              <NavLink to="/signin" className="auth-redirect-link">Sign in</NavLink>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}