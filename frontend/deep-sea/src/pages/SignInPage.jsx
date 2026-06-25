import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiService } from '../service/ApiService';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      
      // Persist access token context safely
      const response = await apiService.login({ email, password });

        localStorage.setItem('token', response.token);

          localStorage.setItem(
            'user',
            JSON.stringify({
              id: response.id, 
              name: response.name,
              email: response.email,
              role: response.role
            })
          );

      navigate('/researchers'); 
    } catch (err) {
      setError(err?.message || "Authentication rejected: Invalid operational credentials.");
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

        {/* Sign in form */}
        <div className="auth-form-panel">
          <div className="form-workspace-card">
            
            <div className="form-header-block">
              <h2 className="form-main-heading">Nice to see you!</h2>
              <p className="form-subtitle-caption">Enter your email and password to sign in</p>
            </div>

            {error && (
              <div className="alert alert-danger font-monospace text-center py-2 small bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger rounded mb-3">
                !! AUTH_FAILURE: {error} !!
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="interactive-auth-form">
              
              <div className="auth-input-group">
                <label className="auth-input-label">Email</label>
                <input 
                  type="email" 
                  className="auth-terminal-field"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
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
                  disabled={isLoading}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-auth-deploy-action" 
                disabled={isLoading}
              >
                {isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}
              </button>

            </form>

            <div className="auth-footer-navigation font-monospace">
              <span className="text-muted-dim">Don't have an account? </span>
              <NavLink to="/signup" className="auth-redirect-link">Sign up</NavLink>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}