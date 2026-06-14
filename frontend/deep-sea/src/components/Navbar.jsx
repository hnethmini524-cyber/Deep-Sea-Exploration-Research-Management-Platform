import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar({ user, onSignOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close the context menu if user clicks outside its container boundaries
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close the dropdown view frame automatically upon routing transitions
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  return (
    <header className="global-app-navbar-wrapper">
      <div className="navbar-internal-container d-flex justify-content-between align-items-center">
        
        <div className="navbar-brand-block" onClick={() => navigate('/')}>
          <h1 className="brand-primary-text font-monospace">OCEAN<span className="brand-accent">EXPLORE</span></h1>
          <span className="brand-subtext-ticker">DEEP SEA REGISTRY DEPLOYMENT</span>
        </div>

        <nav className="navbar-actions-portal">
          {!user ? (
            // Unauthenticated public grid mode
            <div className="d-flex align-items-center gap-3">
              <button 
                type="button" 
                className="btn-nav-link monospace-text"
                onClick={() => navigate('/signin')}
              >
                SIGN IN
              </button>
              <button 
                type="button" 
                className="btn-nav-action-accent monospace-text"
                onClick={() => navigate('/signup')}
              >
                REGISTER
              </button>
            </div>
          ) : (
            // Authenticated session mode
            <div className="authenticated-user-hub" ref={dropdownRef}>
              <div 
                className="user-profile-trigger-badge d-flex align-items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-avatar-frame">
                  <span className="avatar-initials-token">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'OP'}
                  </span>
                  <div className="online-pulse-indicator"></div>
                </div>
                <span className="profile-identity-label monospace-text d-none d-md-inline">
                  {user.role || 'OPERATOR'}
                </span>
                <i className={`dropdown-chevron-arrow ${isDropdownOpen ? 'arrow-rotated' : ''}`}>▼</i>
              </div>

              {/* Micro-Dropdown menu */}
              {isDropdownOpen && (
                <div className="navbar-profile-dropdown-portal">
                  <div className="dropdown-identity-header-card">
                    <p className="user-display-fullname text-truncate">{user.name || 'Anonymous Agent'}</p>
                    <p className="user-display-email font-monospace text-truncate">{user.email || 'sec.ledger@node.local'}</p>
                  </div>
                  
                  <div className="dropdown-divider-dashed"></div>
                  
                  <ul className="dropdown-menu-links-list">
                    <li onClick={() => navigate('/profile')}>
                      <span className="link-icon-bracket">&gt;</span> Profile Dossier
                    </li>
                    <li onClick={() => navigate('/dashboard')}>
                      <span className="link-icon-bracket">&gt;</span> Core Dashboard
                    </li>
                  </ul>

                  <div className="dropdown-divider-dashed"></div>

                  <button 
                    type="button" 
                    className="btn-dropdown-signout w-100 text-start font-monospace"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

      </div>
    </header>
  );
}