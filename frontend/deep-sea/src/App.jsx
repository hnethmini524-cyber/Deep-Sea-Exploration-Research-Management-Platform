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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  function ProtectedRoute({ user, children }) {
    if (!user) {
      return <Navigate to="/signin" replace />;
    }

    return children;
  }

  const fullScreenRoutes = ['/signin', '/signup', '/password'];
  const isAuthPage = fullScreenRoutes.includes(location.pathname);

  return (
    <div className="app-layout-shell">
      <Navbar user={user} onSignOut={handleSignOut} />

      <main className="app-root-container">
        {!isAuthPage && user && <Sidebar />}
        
        <div className={isAuthPage ? "app-content-viewport auth-fullscreen" : "app-content-viewport"}>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Core Application Page Routes */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>}/>
            <Route path="/missions" element={<ProtectedRoute user={user}><MissionsPage /></ProtectedRoute>}/>
            <Route path="/researchers" element={<ProtectedRoute user={user}><ResearcherPage /></ProtectedRoute>}/>
            <Route path="/observations" element={<ProtectedRoute user={user}><ObservationPage /></ProtectedRoute>}/>
            <Route path="/research-areas" element={<ProtectedRoute user={user}><ResearchAreasPage /></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage /></ProtectedRoute>}/>
            <Route path="/password" element={<ProtectedRoute user={user}><PasswordSetPage /></ProtectedRoute>}/>
            <Route path="/info" element={<ProtectedRoute user={user}><SystemInfoPage /></ProtectedRoute>}/>
            
            {/* Authentication Routes */}
            <Route path="/signin" element={<SignInPage onLogin={setUser} />}/>
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route path="*" element={<div className="p-5 font-monospace text-danger">!! ERROR_404: ROUTE NOT DEPLOYED !!</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}