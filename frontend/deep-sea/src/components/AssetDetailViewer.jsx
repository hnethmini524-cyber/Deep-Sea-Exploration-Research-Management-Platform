import React, { useState, useEffect } from 'react';
import '../styles/asset_detail_viewer.css';

export default function AssetDetailViewer({ isOpen, onClose, assetData }) {
  if (!isOpen || !assetData) return null;

  // Determine context: 'species' | 'sample' | 'mission'
  const currentContext = assetData.dataType || 'mission';

  // Define dynamic sub-tabs for each separate layout view
  const getTabsByContext = () => {
    if (currentContext === 'species' || currentContext === 'sample') {
      return ['Overview', 'Observations'];
    }
    return ['Overview', 'Researchers', 'Species Observed', 'Samples Collected'];
  };

  const tabs = getTabsByContext();
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  // Reset tab active selection to 'Overview' whenever a new item card opens
  useEffect(() => {
    setActiveSubTab('Overview');
  }, [assetData]);

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'Overview':
        return (
          <p className="dossier-narrative">
            {assetData.description || assetData.desc || "No comprehensive profile summary registered."}
          </p>
        );
      
      case 'Observations':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Field Operational Record Log:</p>
            <p className="monospace-text">{assetData.observations || "No real-time environmental data logged."}</p>
          </div>
        );

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
            <p className="monospace-text">{assetData.speciesObserved || "Bathypelagic Siphonophore clusters detected."}</p>
          </div>
        );
      case 'Samples Collected':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Core Sample Ledger Logs:</p>
            <p className="monospace-text">{assetData.samplesCollected || "Sample-ID #7792: 4.2L Fluid matrix extraction."}</p>
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
            \\ {currentContext.toUpperCase()} REGISTRY \ {(assetData.missionName || assetData.name || assetData.sampleId)?.toUpperCase()}
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

        {/* Content workspace grid split */}
        <div className="dossier-workspace-split">
          
          <div className="dossier-text-manifest-pane">
            <div className="narrative-scroller-box">
              {renderTabContent()}
            </div>

            <button type="button" className="btn-dossier-download-node monospace-text">
              &gt; DOWNLOAD ENVIRONMENTAL TELEMETRY
            </button>

            {/* Dynamic metadata technical ledger grid */}
            <div className="dossier-metadata-table-wrapper mt-4">
              
              {/* === Layout for mission page */}
              {currentContext === 'mission' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">MISSION NAME</span>
                    <span className="meta-ledger-value text-truncate">
                      [{assetData.missionName || assetData.name || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">START DATE</span>
                    <span className="meta-ledger-value">
                      [{assetData.startDate || assetData.start || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">END DATE</span>
                    <span className="meta-ledger-value">
                      [{assetData.endDate || assetData.end || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">STATUS</span>
                    <span className="meta-ledger-value text-info fw-bold">
                      [{(assetData.status || "PENDING").toUpperCase()}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">RESEARCH AREA</span>
                    <span className="meta-ledger-value text-warning fw-bold">
                      [{assetData.researchArea || assetData.area || "—"}]
                    </span>
                  </div>
                </>
              )}

              {/* === Layout for species === */}
              {currentContext === 'species' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">COMMON PROFILE NAME</span>
                    <span className="meta-ledger-value text-truncate">[{assetData.name}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">SCIENTIFIC NOMENCLATURE</span>
                    <span className="meta-ledger-value">[{assetData.scientificName || "N/A"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">OPERATION MISSION</span>
                    <span className="meta-ledger-value text-info">[{assetData.missionName || "N/A"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">RECORDED EXTRACTION DEPTH</span>
                    <span className="meta-ledger-value text-warning fw-bold">[{assetData.depth || "0m"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">TAXONOMIC CATEGORY</span>
                    <span className="meta-ledger-value">[{assetData.category || "Unclassified"}]</span>
                  </div>
                </>
              )}

              {/* === Layout for samples === */}
              {currentContext === 'sample' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">CORE SAMPLE ID</span>
                    <span className="meta-ledger-value text-truncate">[{assetData.sampleId}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">MATERIAL CLASSIFICATION</span>
                    <span className="meta-ledger-value">[{assetData.name || "Raw Core"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">OPERATION MISSION</span>
                    <span className="meta-ledger-value text-info">[{assetData.missionName || "N/A"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">RECORDED EXTRACTION DEPTH</span>
                    <span className="meta-ledger-value text-warning fw-bold">[{assetData.depth || "0m"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">COLLECTION DATE STAMP</span>
                    <span className="meta-ledger-value">[{assetData.date || "—"}]</span>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Graphic display viewscreen */}
          <div className="dossier-imagery-visualization-pane">
            <div className="dossier-image-frame-container">
              <img 
                src={assetData.imageUrl || "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1000&q=80"} 
                alt="Operational telemetry visual capture" 
                className="dossier-main-display-graphic"
              />
              <div className="dossier-image-stamp-watermark monospace-text">SECURED RECORD</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}