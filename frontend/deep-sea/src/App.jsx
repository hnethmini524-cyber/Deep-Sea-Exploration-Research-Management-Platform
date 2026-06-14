import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ResearchAreasPage from './pages/ResearchAreasPage';
import MissionsPage from './pages/MissionsPage';
import ResearcherPage from './pages/ResearcherPage';
import ObservationPage from './pages/ObservationPage';
import './index.css';

export default function App() {
  // Global session state wrapper
  const [user, setUser] = useState({
    name: "Operator Delta-9",
    email: "delta9@node.local",
    role: "COMMANDER"
  });

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app-layout-shell">
      <Navbar user={user} onSignOut={handleSignOut} />

      <main className="app-root-container">
        {/* Persistent side navigation panel */}
        <Sidebar />
        
        <div className="app-content-viewport">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Core Application Page Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/researchers" element={<ResearcherPage />} />
            <Route path="/observations" element={<ObservationPage />} />
            <Route path="/research-areas" element={<ResearchAreasPage />} />
            
            {/* Optional placeholders for authentication routes */}
            <Route path="/signin" element={<div className="p-4 text-white">Sign In Interface Panel</div>} />
            <Route path="/signup" element={<div className="p-4 text-white">Registration Portal Terminal</div>} />
            
            <Route path="*" element={<div className="p-5 font-monospace text-danger">!! ERROR_404: ROUTE NOT DEPLOYED !!</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}