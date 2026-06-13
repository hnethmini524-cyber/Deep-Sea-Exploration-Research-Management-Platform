import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  Waves, 
  Beaker, 
  Map, 
  Info 
} from 'lucide-react';

// --- System navigations ---
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'missions', label: 'Missions Search', icon: Compass },
  { id: 'researchers', label: 'Researchers ', icon: Users },
  { id: 'species', label: 'Observations', icon: Waves },
  { id: 'areas', label: 'Research Areas', icon: Map },
  { id: 'about', label: 'System Info', icon: Info },
];

export default function Sidebar({ currentActivePage, onPageChange }) {
  const [activeItem, setActiveItem] = useState(currentActivePage || 'dashboard');

  const handleNavigation = (id) => {
    setActiveItem(id);
    if (onPageChange) {
      onPageChange(id);
    }
  };

  return (
    <aside className="sidebar-container">
      
      {/* --- Top header --- */}
      <div className="brand-header">
        <h2 className="brand-title">
          Ocean <span className="brand-accent">Explore</span>
        </h2>
        <span className="brand-subtitle">Deep Sea Registry Explorer</span>
      </div>

      {/* --- Main menu container --- */}
      <nav className="nav-menu">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`nav-link-button ${isActive ? 'active' : ''}`}
            >
              <div className="icon-flex-wrapper">
                <Icon 
                  size={18} 
                  color={isActive ? '#fff' : 'rgba(255, 255, 255, 0.65)'} 
                  style={{ transition: 'color 0.2s ease' }}
                />
              </div>
              <span className="link-text">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="footer-container">
        <p className="footer-text">
          Powered by Deep-Sea <br />
          Telemetry Core System
        </p>
      </div>

    </aside>
  );
}
