import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css'
import ResearcherPage from './pages/ResearcherPage';

function App() {
  return (
    <main className="app-root-container">
      <Sidebar />
      <ResearcherPage />
    </main>
  );
}

export default App