import React from 'react';
import { Compass, FileBarChart2 } from 'lucide-react';

export default function MissionHeroBanner({ onCreateMissionClick, onExportReportClick }) {
  return (
    <div className="banner-container">
      
      {/* Background ambient radial glow layers */}
      <div className="ambient-orb-left" />
      <div className="ambient-orb-right" />

      {/* Main content layout */}
      <div className="content-wrapper">
        
        <div className="badge-row d-flex align-items-center">
          <Compass size={14} color="#00f2fe" className="badge-icon" />
          <span className="badge-text ms-1">Deep Sea Exploration</span>
        </div>

        <h1 className="main-title">
          Oceanic Mission <span className="title-gradient-text">Workspace</span>
        </h1>

        <p className="description-text">
          Access comprehensive telemetry matrices for active abyssal deployments, bathymetric sample profiles, 
          and biological deep-sea observations. Generate real-time dive records
          and predictive habitat maps.
        </p>

        {/* Action buttons */}
        <div className="action-button-group d-flex flex-wrap gap-3">
          <button 
            onClick={onCreateMissionClick} 
            className="btn-banner-primary"
          >
            Launch Operation <span className="ms-2">→</span>
          </button>
          
          <button 
            onClick={onExportReportClick} 
            className="btn-banner-secondary d-inline-flex align-items-center"
          >
            <FileBarChart2 size={16} className="me-2" />
            Generate Telemetry Report
          </button>
        </div>

      </div>
    </div>
  );
}

