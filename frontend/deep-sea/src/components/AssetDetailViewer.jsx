import React, { useState, useEffect } from 'react';
import '../styles/asset_detail_viewer.css';

export default function AssetDetailViewer({ isOpen, onClose, assetData }) {
  if (!isOpen || !assetData) return null;

  // Determine context configuration: 'species' | 'sample' | 'mission' | 'research_area'
  const currentContext = assetData.dataType || 'mission';
  
  // Handling component header layout labels
  const nameLabel = assetData.codeName || assetData.areaName || assetData.name || assetData.missionName || "Active Sector";

  // Define dynamic navigation tabs for each domain registry view
  const getTabsByContext = () => {
    switch (currentContext) {
      case 'species':
      case 'sample':
        return ['Overview', 'Observations'];
      case 'research_area':
        return ['Overview'];
      case 'mission':
      default:
        return ['Overview', 'Researchers', 'Species Observed', 'Samples Collected'];
    }
  };

  const tabs = getTabsByContext();
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  useEffect(() => {
    setActiveSubTab('Overview');
  }, [assetData]);

  const renderTabContent = () => {
    switch (activeSubTab) {
      case 'Overview':
        return (
          <p className="dossier-narrative">
            {assetData.description || assetData.desc || "No comprehensive profile summary registered inside the active matrix configuration."}
          </p>
        );
      
      case 'Observations':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Field Operational Record Log:</p>
            <p className="monospace-text">{assetData.observations || "No real-time environmental telemetry data logged."}</p>
          </div>
        );

      case 'Researchers':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Assigned Command Staff:</p>
            <div className="p-3 border border-secondary rounded bg-dark bg-opacity-40 font-monospace">
              <div className="mb-2">
                <span className="text-muted small d-block" style={{ fontSize: '10px' }}>&gt; LEAD RESEARCHER</span>
                <span className="text-white fw-bold fs-6">{assetData.leadResearcherName || "NO PERSONNEL ASSIGNED"}</span>
              </div>
              {assetData.leadResearcherId && (
                <div className="text-muted" style={{ fontSize: '11px', opacity: 0.7 }}>
                  UUID: {assetData.leadResearcherId}
                </div>
              )}
            </div>
          </div>
        );

      case 'Species Observed':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Biological Description:</p>
            {assetData.species && assetData.species.length > 0 ? (
              <div className="d-flex flex-column gap-2 overflow-auto pe-1" style={{ maxHeight: '200px' }}>
                {assetData.species.map((specimen) => (
                  <div key={specimen.id} className="p-2 border border-secondary rounded bg-black bg-opacity-30 d-flex justify-content-between align-items-center font-monospace">
                    <div>
                      <span className="text-info d-block fw-bold" style={{ fontSize: '13px' }}>{specimen.commonName}</span>
                      <span className="text-muted small italic"><i>{specimen.scientificName}</i></span>
                    </div>
                    {specimen.category && (
                      <span className="badge bg-secondary text-uppercase" style={{ fontSize: '10px' }}>{specimen.category}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="monospace-text text-muted">
                No localized biotope samples recorded yet inside bounds of node: {nameLabel}.
              </p>
            )}
          </div>
        );

      case 'Samples Collected':
        return (
          <div className="dossier-sub-list">
            <p className="text-info-cyan fw-bold mb-2">✦ Core Sample Ledger Logs:</p>
            {assetData.samples && assetData.samples.length > 0 ? (
              <div className="table-responsive border border-secondary rounded overflow-hidden" style={{ maxHeight: '200px' }}>
                <table className="table table-dark table-sm font-monospace m-0 align-middle" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="text-muted bg-black bg-opacity-50" style={{ fontSize: '10px' }}>
                      <th className="p-2">CODE</th>
                      <th className="p-2">CLASSIFICATION</th>
                      <th className="p-2 text-end">DEPTH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetData.samples.map((sample) => (
                      <tr key={sample.sampleId || sample.id} title={sample.description} className="border-top border-secondary">
                        <td className="p-2 text-warning fw-bold">{sample.sampleCode}</td>
                        <td className="p-2"><span className="badge bg-dark border border-secondary text-light">{sample.type}</span></td>
                        <td className="p-2 text-end text-info">{sample.depth}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="monospace-text text-muted">
                No structural sample extractions archived for sector: {nameLabel}.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="asset-dossier-overlay-backdrop" onClick={onClose}>
      <div className="asset-dossier-master-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top header pathway */}
        <div className="dossier-header-strip d-flex justify-content-between align-items-center">
          <div className="dossier-pathway-title monospace-text">
            \\ {currentContext.replace('_', ' ').toUpperCase()} REGISTRY \ {nameLabel.toUpperCase()}
          </div>
          <button type="button" className="btn-close-dossier" onClick={onClose}>✕</button>
        </div>

        {/* Tab navigation menu option */}
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

            {/* Dynamic metadata technical ledger grid */}
            <div className="dossier-metadata-table-wrapper mt-4">
              
              {/* === Layout for missions === */}
              {currentContext === 'mission' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">MISSION CODE NAME</span>
                    <span className="meta-ledger-value text-info fw-bold text-truncate">
                      [{assetData.codeName || assetData.missionName || assetData.name || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">START DATE</span>
                    <span className="meta-ledger-value">
                      [{assetData.launchDate || assetData.startDate || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">END DATE</span>
                    <span className="meta-ledger-value">
                      [{assetData.completionDate || assetData.endDate || "—"}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">STATUS FLAG</span>
                    <span className="meta-ledger-value text-success fw-bold">
                      [{(assetData.status || "PENDING").toUpperCase()}]
                    </span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">OPERATIONAL ZONE</span>
                    <span className="meta-ledger-value text-warning fw-bold text-truncate">
                      [{assetData.researchAreaName || assetData.researchArea || "UNASSIGNED"}]
                    </span>
                  </div>
                </>
              )}

              {/* === Layout for species === */}
              {currentContext === 'species' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">COMMON PROFILE NAME</span>
                    <span className="meta-ledger-value text-truncate">[{assetData.commonName}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">SCIENTIFIC NOMENCLATURE</span>
                    <span className="meta-ledger-value">[{assetData.scientificName || "N/A"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">RECORDED EXTRACTION DEPTH</span>
                    <span className="meta-ledger-value text-warning fw-bold">[{assetData.depth || "0"}m]</span>
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
                    <span className="meta-ledger-value text-truncate">[{assetData.sampleCode}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">MATERIAL CLASSIFICATION</span>
                    <span className="meta-ledger-value">[{assetData.type || "Raw Core"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">RECORDED EXTRACTION DEPTH</span>
                    <span className="meta-ledger-value text-warning fw-bold">[{assetData.depth || "0"}m]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">COLLECTION DATE STAMP</span>
                    <span className="meta-ledger-value">[{assetData.collectionDate || "—"}]</span>
                  </div>
                </>
              )}

              {/* === Layout for research areas === */}
              {currentContext === 'research_area' && (
                <>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">AREA NAME</span>
                    <span className="meta-ledger-value text-truncate">[{assetData.areaName || assetData.name || "—"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">GEOGRAPHIC REGION</span>
                    <span className="meta-ledger-value">[{assetData.region || "—"}]</span>
                  </div>
                  <div className="meta-ledger-row">
                    <span className="meta-ledger-key">TARGET GPS COORDINATES</span>
                    <span className="meta-ledger-value text-info font-monospace">
                      [{assetData.latitude !== undefined && assetData.longitude !== undefined ? `${assetData.latitude}° N, ${assetData.longitude}° E` : "0.000° N, 0.000° E"}]
                    </span>
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
                srcSet={assetData.imageUrl ? undefined : undefined}
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