import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  Waves, 
  Map, 
  Info 
} from 'lucide-react';
import '../styles/sidebar.css';

// System navigations mapping to matches defined in App.jsx routing paths
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'missions', label: 'Missions Search', icon: Compass, path: '/missions' },
  { id: 'researchers', label: 'Researchers', icon: Users, path: '/researchers' },
  { id: 'observations', label: 'Observations', icon: Waves, path: '/observations' },
  { id: 'areas', label: 'Research Areas', icon: Map, path: '/research-areas' }, // Path match key
  { id: 'about', label: 'System Info', icon: Info, path: '/about' },
];

export default function Sidebar() {
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

          return (
            <NavLink
              key={item.id}
              to={item.path}
              /* We destruct isActive from NavLink's inner render state 
                to dynamically append your existing .active CSS class properties.
              */
              className={({ isActive }) => `nav-link-button ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
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
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* --- Footer Container --- */}
      <div className="footer-container">
        <p className="footer-text">
          Powered by Deep-Sea <br />
          Telemetry Core System
        </p>
      </div>

    </aside>
  );
}
