import { useState } from 'react'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css'
import ObservationPage from './pages/ObservationPage';

function App() {
  return (
    <main className="app-root-container">
      <Sidebar />
      <ObservationPage />
    </main>
  );
}

export default App