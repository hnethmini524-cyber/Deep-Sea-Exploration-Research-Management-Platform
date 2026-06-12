import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css'

function App() {
  return (
    <main className="app-root-container">
      <Sidebar />
      <Dashboard />
    </main>
  );
}

export default App