import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css'
import MissionsPage from './pages/MissionsPage';

function App() {
  return (
    <main className="app-root-container">
      <Sidebar />
      <MissionsPage />
    </main>
  );
}

export default App