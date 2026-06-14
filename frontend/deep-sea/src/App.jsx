import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css'
import ResearchAreasPage from './pages/ResearchAreasPage';

function App() {
  return (
    <main className="app-root-container">
      <Sidebar />
      <ResearchAreasPage />
    </main>
  );
}

export default App