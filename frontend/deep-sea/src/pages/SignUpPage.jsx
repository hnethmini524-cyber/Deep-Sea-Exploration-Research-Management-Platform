import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiService } from '../service/ApiService'; 

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setSuccessMsg('');
      
      const payload = { name, email, password };
      await apiService.register(payload);
      
      setSuccessMsg('Registration parameters deployed successfully! Routing to checkpoint...');
      
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (err) {
      setError(err?.message || "Registration vector rejected by remote database matrix.");
    } finally {
      setIsLoading(false);
    }
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

            {error && (
              <div className="alert alert-danger font-monospace text-center py-2 small bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger rounded mb-3">
                !! REGISTER_FAILURE: {error} !!
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success font-monospace text-center py-2 small bg-success bg-opacity-10 border border-success border-opacity-20 text-success rounded mb-3">
                &gt;&gt; {successMsg}
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="interactive-auth-form">

              <div className="auth-input-group">
                <label className="auth-input-label">User Name</label>
                <input 
                  type="text" 
                  className="auth-terminal-field"
                  placeholder="Your name here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || successMsg}
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
                  disabled={isLoading || successMsg}
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
                  disabled={isLoading || successMsg}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-auth-deploy-action"
                disabled={isLoading || successMsg}
              >
                {isLoading ? 'DEPLOYING RECREATION RECORD...' : 'SIGN UP'}
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