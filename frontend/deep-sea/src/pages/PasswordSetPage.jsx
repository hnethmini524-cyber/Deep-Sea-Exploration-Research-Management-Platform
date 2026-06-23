import React, { useState } from 'react';
import { useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import { apiService } from '../service/ApiService'; 

export default function PasswordSetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteToken = searchParams.get('token');
  const userEmail = searchParams.get('email') || 'your registered email';

  const handlePasswordSetupSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMsg("!! ERROR: Passwords do not match !!");
      return;
    }
    
    if (!inviteToken) {
      setErrorMsg("!! ERROR: Operational security token is missing !!");
      return;
    }

    try {
      setErrorMsg('');
      setIsSubmitting(true);

      // Matches backend structure: token payload initialization mapping
      await apiService.confirmPassword({
        token: inviteToken,
        password: password
      });

      // Navigate to sign-in matrix upon successful ingestion
      navigate('/signin');
    } catch (err) {
      setErrorMsg(err?.message || "!! ERROR: Telemetry submission failed !!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vision-auth-viewport-root">
      <div className="auth-split-layout-container">
        
        {/* Left panel */}
        <div className="auth-showcase-panel">
          <div className="showcase-overlay-gradient"></div>
          <div className="showcase-branding-wrapper">
            <p className="branding-sub-tag">INSPIRED BY OCEAN EXPLORER:</p>
            <h1 className="branding-main-title">DEEP SEA EXPLORATION</h1>
          </div>
        </div>

        {/* Password configuration panel */}
        <div className="auth-form-panel">
          <div className="form-workspace-card">
            
            <div className="form-header-block">
              <h2 className="form-main-heading">Account Activation</h2>
              <p className="form-subtitle-caption">
                Initialize your master password for <span className="text-info font-monospace">{userEmail}</span>
              </p>
            </div>

            <form onSubmit={handlePasswordSetupSubmit} className="interactive-auth-form">
              
              {/* Error warning */}
              {errorMsg && (
                <div className="p-3 bg-danger bg-opacity-10 border border-danger text-danger font-monospace small rounded">
                  {errorMsg}
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-input-label">Choose Password</label>
                <input 
                  type="password" 
                  className="auth-terminal-field text-field-glow"
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-input-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="auth-terminal-field text-field-glow"
                  placeholder="Re-enter password to verify"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-auth-deploy-action" disabled={isSubmitting}>
                {isSubmitting ? "ACTIVATING..." : "ACTIVATE ACCOUNT"}
              </button>

            </form>

            <div className="auth-footer-navigation font-monospace">
              <span className="text-muted-dim">Already configured? </span>
              <NavLink to="/signin" className="auth-redirect-link">Go to Sign In</NavLink>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}