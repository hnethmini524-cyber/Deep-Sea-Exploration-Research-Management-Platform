import React, { useState, useEffect } from 'react';
import AssetDetailViewer from '../components/AssetDetailViewer';
import Pagination from '../components/Pagination'; 
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { FORM_SCHEMAS } from '../formSchemas';
import { apiService } from '../service/apiService';
import '../styles/research_areas_page.css';

export default function ResearchAreasPage() {
  const [researchAreas, setResearchAreas] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Server-side Pagination Configuration (Spring Boot pages start at index 0)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 6; 

  const fetchResearchAreasFromBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getResearchAreas(currentPage - 1, itemsPerPage, searchQuery);
      
      // Map the backend Page properties to frontend state variables
      setResearchAreas(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("❌ Failed to fetch telemetry from deployment engine:", err);
      setError("Failed to synchronize data matrix with database core.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchAreasFromBackend();
  }, [currentPage, searchQuery]);

  const handleCardClick = (area) => {
    setSelectedAsset({
      ...area,
      dataType: 'research_area', 
      areaName: area.areaName || area.name, 
      description: area.description
    });
    setIsDossierOpen(true);
  };

  const handleCreateAreaSubmit = async (formData) => {
    setError(null);
    try {
      let uploadedImageUrl = null;
      
            if (formData.imageUrl) {
                uploadedImageUrl = await apiService.uploadImage(formData.imageUrl);
            }
      
      const newPayload = {
        areaName: formData.areaName,
        region: formData.region,
        description: formData.description,
        latitude: parseFloat(formData.latitude) || 0.0,
        longitude: parseFloat(formData.longitude) || 0.0,
        imageUrl: uploadedImageUrl
      };

      await apiService.createResearchArea(newPayload);
    
      setIsFormOpen(false);
      setCurrentPage(1); 
      fetchResearchAreasFromBackend();
    } catch (err) {
      console.error("❌ Data save transmission failure:", err);
      setError("Could not write record block to remote ledger instance.");
    }
  };

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
                setCurrentPage(1); 
              }}
            />
            <button 
              type="button" 
              className="btn-add-new-node monospace-text"
              onClick={() => setIsFormOpen(true)}
            >
              ADD A NEW AREA
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger font-monospace small mb-4 bg-dark text-danger border-danger">
            ⚠️ SYSTEM ERROR: {error}
          </div>
        )}

        {/* Dashboard workspace grid */}
        <div className="areas-cards-dossier-grid">
          {loading ? (
            <div className="w-100 p-5 text-center font-monospace text-info animate-pulse">
              📡 DOWNLINK ACTIVE: STREAMING TARGET METRICS...
            </div>
          ) : (
            researchAreas.map((area) => (
              <div 
                key={area.id} 
                className="area-dossier-item-card"
                onClick={() => handleCardClick(area)}
              >
                <div className="card-header-accent-strip d-flex justify-content-between">
                  <span className="card-node-id font-monospace">RESEARCH AREA</span>
                  <span className="card-status-indicator-pill">SECURED LEDGER</span>
                </div>
                
                <div className="card-body-content-pane">
                  <h3 className="card-title-heading text-truncate">{area.areaName}</h3>
                  
                  <div className="metadata-ledger-row-compact">
                    <span className="compact-key">REGION:</span>
                    <span className="compact-value">{area.region}</span>
                  </div>
                  
                  <div className="metadata-ledger-row-compact">
                    <span className="compact-key">Latitude COORDINATES:</span>
                    <span className="compact-value text-info font-monospace">
                      {area.latitude}° N
                    </span>
                  </div>
                  <div className="metadata-ledger-row-compact">
                    <span className="compact-key">Longitude COORDINATES:</span>
                    <span className="compact-value text-info font-monospace">
                      {area.longitude}° E
                    </span>
                  </div>

                  <p className="card-narrative-summary-text">
                    {area.description}
                  </p>
                </div>

                <div className="card-footer-action-strip monospace-text">
                  &gt; VIEW DETAILED ENVIRONMENTAL DOSSIER
                </div>
              </div>
            ))
          )}

          {!loading && researchAreas.length === 0 && (
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

      {isFormOpen && (
        <UnifiedRegistryForm 
          headline="RESEARCH_AREA"
          schema={
            Array.isArray(FORM_SCHEMAS?.AREA)
              ? FORM_SCHEMAS.AREA
              : FORM_SCHEMAS?.AREA?.fields || []
          }
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateAreaSubmit}
        />
      )}
    </div>
  );
}