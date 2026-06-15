import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ResearchAreasPage from './pages/ResearchAreasPage';
import MissionsPage from './pages/MissionsPage';
import ResearcherPage from './pages/ResearcherPage';
import ObservationPage from './pages/ObservationPage';
import ProfilePage from './pages/ProfilePage';
import PasswordSetPage from './pages/PasswordSetPage';
import SystemInfoPage from './pages/SystemInfoPage';
import './index.css';

export default function App() {
  const location = useLocation();

  // Global session state wrapper
  const [user, setUser] = useState({
    name: "Operator Delta-9",
    email: "delta9@node.local",
    role: "COMMANDER"
  });

  const handleSignOut = () => {
    setUser(null);
  };

  const fullScreenRoutes = ['/signin', '/signup', '/password'];
  const isAuthPage = fullScreenRoutes.includes(location.pathname);

  return (
    <div className="app-layout-shell">
      {!isAuthPage && <Navbar user={user} onSignOut={handleSignOut} />}

      <main className="app-root-container">
        {!isAuthPage && <Sidebar />}
        
        <div className={isAuthPage ? "app-content-viewport auth-fullscreen" : "app-content-viewport"}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Core Application Page Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/researchers" element={<ResearcherPage />} />
            <Route path="/observations" element={<ObservationPage />} />
            <Route path="/research-areas" element={<ResearchAreasPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/password" element={<PasswordSetPage />} />
            <Route path="/info" element={<SystemInfoPage />} />
            
            {/* Authentication Routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route path="*" element={<div className="p-5 font-monospace text-danger">!! ERROR_404: ROUTE NOT DEPLOYED !!</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}