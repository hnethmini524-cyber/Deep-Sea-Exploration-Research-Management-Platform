import React, { useState } from 'react';
import '../styles/asset_detail_viewer.css';

export default function AssetDetailViewer({ isOpen, onClose, assetData }) {
  if (!isOpen || !assetData) return null;

  const [activeSubTab, setActiveSubTab] = useState('Overview');

  const tabs = ['Overview', 'Researchers', 'Species Observed', 'Samples Collected'];

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'Overview':
        return <p className="dossier-narrative">{assetData.description || assetData.desc}</p>;
      case 'Researchers':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Assigned Command Staff:</p>
            <p className="monospace-text">{assetData.assignedResearcher || "Dr. Alan Watson (Lead Hydro-Biologist)"}</p>
          </div>
        );
      case 'Species Observed':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Biological Marine Log:</p>
            <p className="monospace-text">{assetData.speciesObserved || "Bathypelagic Siphonophore clusters detected near ventilation vents."}</p>
          </div>
        );
      case 'Samples Collected':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Core Sample Ledger Logs:</p>
            <p className="monospace-text">{assetData.samplesCollected || "Sample-ID #7792: 4.2L Sulfide-rich fluid matrix extraction."}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="asset-dossier-overlay-backdrop">
      <div className="asset-dossier-master-card">
        
        <div className="dossier-header-strip d-flex justify-content-between align-items-center">
          <div className="dossier-pathway-title monospace-text">
            \\ {assetData.systemCode || "DEEP-SEA-SYSTEM"} \ {assetData.name?.toUpperCase() || assetData.missionName?.toUpperCase()}
          </div>
          <button type="button" className="btn-close-dossier" onClick={onClose}>✕</button>
        </div>

        <div className="dossier-tab-navigation-bar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`dossier-nav-tab-item ${activeSubTab === tab ? 'active-dossier-tab' : ''}`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="dossier-workspace-split">
          
          {/* Metadata Grid Ledger */}
          <div className="dossier-text-manifest-pane">
            <div className="narrative-scroller-box">
              {renderTabContent()}
            </div>

            <button type="button" className="btn-dossier-download-node monospace-text">
              &gt; DOWNLOAD TELEMETRY MANIFEST
            </button>

            {/* Technical Metadata Grid Ledger */}
            <div className="dossier-metadata-table-wrapper mt-4">
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">ASSET FILE NAME</span>
                <span className="meta-ledger-value text-truncate">[{assetData.name || assetData.missionName}]</span>
              </div>
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">DEPLOYMENT REGION</span>
                <span className="meta-ledger-value">[{assetData.area || assetData.researchArea || "N/A"}]</span>
              </div>
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">COMMISSION DATE</span>
                <span className="meta-ledger-value">[{assetData.start || assetData.startDate || "—"}]</span>
              </div>
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">DECOMMISSION DATE</span>
                <span className="meta-ledger-value">[{assetData.end || assetData.endDate || "—"}]</span>
              </div>
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">OPERATIONAL STATUS</span>
                <span className="meta-ledger-value">[{assetData.status?.toUpperCase() || "PENDING"}]</span>
              </div>
              <div className="meta-ledger-row">
                <span className="meta-ledger-key">COMPLETION SCALE</span>
                <span className="meta-ledger-value">[{assetData.completion || "0"}%]</span>
              </div>
            </div>
          </div>

          {/* Main Imagery/Telemetry Graphic Screen */}
          <div className="dossier-imagery-visualization-pane">
            <div className="dossier-image-frame-container">
              <img 
                src={assetData.imageUrl || "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1000&q=80"} 
                alt="Sub-surface operational visualization sonar chart data" 
                className="dossier-main-display-graphic"
              />
              <div className="dossier-image-stamp-watermark monospace-text">SECRET</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}