import React, { useState, useEffect } from 'react';
import AssetDetailViewer from '../components/AssetDetailViewer';
import Pagination from '../components/Pagination'; 
import '../styles/research_areas_page.css';

// Mock data array 
const MOCK_AREAS = [
  {
    id: "AREA-01",
    name: "Mariana North Vent Sector",
    region: "Western Pacific Ocean",
    coordinates: "11.3493° N, 142.1996° E",
    description: "Deep-sea hydrothermal vent fields harboring specialized chemosynthetic ecosystems and anomalous mineral crust formations.",
    activeMissionsCount: 2,
    missions: "Operation Trench Run, Hydrothermal Vent Probe Alpha.",
    speciesFound: "Magnapinna sp., Alviniconcha scale-snails, Bathymodiolus clusters.",
    samplesCollected: "SMP-902 (Sulfide Chimney Crust), SMP-104 (Hydrothermal Fluid Entry).",
    imageUrl: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "AREA-02",
    name: "Abyssal Plain Sub-System 7",
    region: "Puerto Rico Trench Suffix",
    coordinates: "19.5000° N, 66.7500° W",
    description: "Flat pelagic sediment zones optimized for core soil extractions and micro-seismic acoustic monitoring arrays.",
    activeMissionsCount: 1,
    missions: "Anoxic Basin Scan Phase II.",
    speciesFound: "Benthocodon Jelly isolates, Abyssal Holothurians.",
    samplesCollected: "SMP-903 (Abyssal Brine Matrix).",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80"
  }

];

export default function ResearchAreasPage() {
  const [researchAreas, setResearchAreas] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination Config
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    setResearchAreas(MOCK_AREAS);
  }, []);

  const handleCardClick = (area) => {
    setSelectedAsset({
      ...area,
      dataType: 'research_area', 
      areaName: area.name        
    });
    setIsDossierOpen(true);
  };

  const filteredAreas = researchAreas.filter(area => 
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Computations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAreas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);

  return (
    <div className="research-areas-layout-root">
      <div className="areas-page-container">
        
        {/* Header panel */}
        <div className="areas-header-panel d-flex justify-content-between align-items-center mb-4">
          <div className="title-block">
            <h2 className="section-main-heading">Research Areas</h2>
            <p className="subtitle-caption text-success">✓ {researchAreas.length} core geographical operational sectors tracked</p>
          </div>
          <div className="action-interactive-group d-flex gap-3">
            <input 
              type="text" 
              className="search-filter-input monospace-text"
              placeholder="Type here to filter deployments..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on filter change
              }}
            />
            <button type="button" className="btn-add-new-node monospace-text">
              ADD A NEW AREA
            </button>
          </div>
        </div>

        {/* Dashboard workspace grid */}
        <div className="areas-cards-dossier-grid">
          {currentItems.map((area) => (
            <div 
              key={area.id} 
              className="area-dossier-item-card"
              onClick={() => handleCardClick(area)}
            >
              <div className="card-header-accent-strip d-flex justify-content-between">
                <span className="card-node-id font-monospace">{area.id}</span>
                <span className="card-status-indicator-pill">SECURED LEDGER</span>
              </div>
              
              <div className="card-body-content-pane">
                <h3 className="card-title-heading text-truncate">{area.name}</h3>
                
                <div className="metadata-ledger-row-compact">
                  <span className="compact-key">REGION:</span>
                  <span className="compact-value">{area.region}</span>
                </div>
                
                <div className="metadata-ledger-row-compact">
                  <span className="compact-key">COORDINATES:</span>
                  <span className="compact-value text-info font-monospace">{area.coordinates}</span>
                </div>

                <p className="card-narrative-summary-text">
                  {area.description}
                </p>
              </div>

              <div className="card-footer-action-strip monospace-text">
                &gt; VIEW DETAILED ENVIRONMENTAL DOSSIER
              </div>
            </div>
          ))}

          {filteredAreas.length === 0 && (
            <div className="empty-state-notice-box w-100 p-5 text-center font-monospace text-muted">
              !! NO REGISTRY MATCHES FOUND INSIDE ACTIVE ARCHIVE BUFFER !!
            </div>
          )}
        </div>

        {totalPages > 1 && (
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(pageNum) => setCurrentPage(pageNum)}
            />
        )}

      </div>

      <AssetDetailViewer 
        isOpen={isDossierOpen}
        onClose={() => {
          setIsDossierOpen(false);
          setSelectedAsset(null);
        }}
        assetData={selectedAsset}
      />
    </div>
  );
}