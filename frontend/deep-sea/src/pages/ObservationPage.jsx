import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import AssetDetailViewer from '../components/AssetDetailViewer';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { apiService } from '../service/apiService'; 
import { FORM_SCHEMAS } from '../formSchemas';
import '../styles/missions_page.css'; 

export default function ObservationPage() {
  // Data matrix array lists
  const [speciesList, setSpeciesList] = useState([]);
  const [samplesList, setSamplesList] = useState([]);
  
  // Independent paging controls
  const [speciesPage, setSpeciesPage] = useState(1);
  const [samplesPage, setSamplesPage] = useState(1);
  const [totalSpeciesPages, setTotalSpeciesPages] = useState(1);
  const [totalSamplesPages, setTotalSamplesPages] = useState(1);
  
  // Metric counts tracked this quarter
  const [totalSpeciesElements, setTotalSpeciesElements] = useState(0);
  const [totalSamplesElements, setTotalSamplesElements] = useState(0);
  
  // Runtime operational status indicators
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formConfig, setFormConfig] = useState({ headline: '', schema: [], type: '' });

  const rowsPerPage = 5;

  const fetchSpeciesData = async () => {
    setLoadingSpecies(true);
    try {
      // Requests content page array index shifted safely to match 0-based index parameters
      const data = await apiService.getSpecies(speciesPage - 1, rowsPerPage);
      setSpeciesList(data.content || []);
      setTotalSpeciesPages(data.totalPages || 1);
      setTotalSpeciesElements(data.totalElements || 0);
    } catch (err) {
      console.error("❌ Species registry data pipeline drop:", err);
      setError("Failed to coordinate species catalog sync with master ledger.");
    } finally {
      setLoadingSpecies(false);
    }
  };

  const fetchSamplesData = async () => {
    setLoadingSamples(true);
    try {
      const data = await apiService.getSamples(samplesPage - 1, rowsPerPage);
      setSamplesList(data.content || []);
      setTotalSamplesPages(data.totalPages || 1);
      setTotalSamplesElements(data.totalElements || 0);
    } catch (err) {
      console.error("❌ Physical samples registry data pipeline drop:", err);
      setError("Failed to coordinate physical samples ledger sync with master ledger.");
    } finally {
      setLoadingSamples(false);
    }
  };

  // Trigger telemetry synchronizers on pagination variance changes
  useEffect(() => {
    fetchSpeciesData();
  }, [speciesPage]);

  useEffect(() => {
    fetchSamplesData();
  }, [samplesPage]);

  const handleRowClick = (item, entityType) => {
    const completeAssetPayload = {
      ...item,
      dataType: entityType
    };
    setSelectedAsset(completeAssetPayload);
    setIsViewerOpen(true);
  };

  const handleOpenSpeciesForm = () => {
    setFormConfig({
      headline: 'SPECIES_RECORD',
      schema: FORM_SCHEMAS.SPECIES,
      type: 'SPECIES'
    });
    setIsFormOpen(true);
  };

  const handleOpenSampleForm = () => {
    setFormConfig({
      headline: 'SAMPLE_RECORD',
      schema: FORM_SCHEMAS.SAMPLE,
      type: 'SAMPLE'
    });
    setIsFormOpen(true);
  };

  const handleRegistrySubmit = async (formData) => {
  setError(null);
  try {
    
      let uploadedImageUrl = null;

      if (formData.imageUrl instanceof File) {
              uploadedImageUrl =
                  await apiService.uploadImageDirectlyToCloudinary(
                      formData.imageUrl
                  );
      }
      if (formConfig.type === 'SPECIES') {
      const speciesPayload = {
        commonName: formData.commonName || 'Unspecified Common Name',
        scientificName: formData.scientificName || 'Unknown sp.',
        category: formData.category || 'Unclassified',
        depth: formData.depth ? parseInt(formData.depth, 10) : 0,
        description: formData.description || 'No baseline telemetry data registered.',
        imageUrl: uploadedImageUrl, 
        observations:formData.observations|| 'No baseline telemetry data registered.'
      };

      await apiService.createSpecies(speciesPayload);
      setSpeciesPage(1);
      await fetchSpeciesData();
      
    } else if (formConfig.type === 'SAMPLE') {
      const samplePayload = {
        sampleCode: formData.sampleCode || 'Specific name code',
        type: formData.type || 'Raw Compound',
        collectionDate: formData.collectionDate ? new Date(formData.collectionDate).toISOString() : new Date().toISOString(),
        depth: formData.depth ? parseInt(formData.depth, 10) : 0,
        description: formData.description || 'No chemical assessment logged.',
        imageUrl: uploadedImageUrl
      };

      await apiService.createSample(samplePayload);
      setSamplesPage(1);
      await fetchSamplesData();
    }
    
    setIsFormOpen(false);
  } catch (err) {
    console.error("❌ Target operation persistence failure:", err);
    
    // Safely pull the structural message parameter out of our intercepted object layout
    const failureText = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    setError(failureText);
  }
};

  return (
    <div className="missions-registry-viewport">
      
      {error && (
        <div className="alert alert-danger font-monospace small mb-4 bg-dark text-danger border-danger">
          ⚠️ PIPELINE ERROR DETECTED: {error}
        </div>
      )}
      
      {/* Species layer */}
      <div className="glass-panel-card w-100 p-4 mb-5 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Species Catalog</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {totalSpeciesElements} unique taxonomic profiles indexed this session
            </p>
          </div>
          <button type="button" className="btn-add-action-node" onClick={handleOpenSpeciesForm}>
            Add New Species
          </button>
        </div>

        <div className="table-responsive">
          <table className="tabular-element text-white w-100 m-0">
            <thead>
              <tr className="table-head-row">
                <th className="table-head-cell" style={{ width: '22%' }}>Common Name</th>
                <th className="table-head-cell" style={{ width: '22%' }}>Scientific Name</th>
                <th className="table-head-cell" style={{ width: '15%' }}>Category</th>
                <th className="table-head-cell" style={{ width: '13%' }}>Depth</th>
                <th className="table-head-cell" style={{ width: '28%' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {loadingSpecies ? (
                <tr>
                  <td colSpan="5" className="text-center font-monospace text-info py-4">
                    📡 FETCHING ECOSYSTEM MATRIX CORES...
                  </td>
                </tr>
              ) : speciesList.length > 0 ? (
                speciesList.map((species) => (
                  <tr key={species.id} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowClick(species, 'species')}>
                    <td className="table-body-cell fw-bold text-white py-3">{species.commonName || species.name}</td>
                    <td className="table-body-cell text-info font-monospace">{species.scientificName}</td>
                    <td className="table-body-cell text-muted">{species.category}</td>
                    <td className="table-body-cell text-warning fw-bold">
                      {typeof species.depth === 'number' ? `${species.depth}m` : species.depth}
                    </td>
                    <td className="table-body-cell data-cell-truncate text-muted">{species.description || species.desc}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No taxonomic biological indices verified.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalSpeciesPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination currentPage={speciesPage} totalPages={totalSpeciesPages} onPageChange={setSpeciesPage} />
          </div>
        )}
      </div>

      {/* Samples layer */}
      <div className="glass-panel-card w-100 p-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Physical Samples Ledger</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {totalSamplesElements} deep-sea isolates locked in secure containment vessels
            </p>
          </div>
          <button type="button" className="btn-add-action-node" onClick={handleOpenSampleForm}>
            Add New Sample
          </button>
        </div>

        <div className="table-responsive">
          <table className="tabular-element text-white w-100 m-0">
            <thead>
              <tr className="table-head-row">
                <th className="table-head-cell" style={{ width: '15%' }}>Sample Code</th>
                <th className="table-head-cell" style={{ width: '20%' }}>Type</th>
                <th className="table-head-cell" style={{ width: '15%' }}>Collection Date</th>
                <th className="table-head-cell" style={{ width: '12%' }}>Depth</th>
                <th className="table-head-cell" style={{ width: '20%' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {loadingSamples ? (
                <tr>
                  <td colSpan="5" className="text-center font-monospace text-info py-4">
                    📡 SYNCING PRESSURIZED CONTAINMENT LOGS...
                  </td>
                </tr>
              ) : samplesList.length > 0 ? (
                samplesList.map((sample) => (
                  <tr key={sample.sampleId} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowClick(sample, 'sample')}>
                    <td className="table-body-cell fw-bold text-white">{sample.sampleCode || sample.code}</td>
                    <td className="table-body-cell fw-bold text-white">{sample.type || sample.name}</td>
                    <td className="table-body-cell text-muted">{sample.collectionDate || sample.date}</td>
                    <td className="table-body-cell text-info fw-bold">
                      {typeof sample.depth === 'number' ? `${sample.depth}m` : sample.depth}
                    </td>
                    <td className="table-body-cell data-cell-truncate text-muted">{sample.description || sample.desc}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No solid/fluid material profiles captured in sector fields.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalSamplesPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination currentPage={samplesPage} totalPages={totalSamplesPages} onPageChange={setSamplesPage} />
          </div>
        )}
      </div>

      {/* Detail overlay panel node */}
      <AssetDetailViewer 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        assetData={selectedAsset} 
      />

      {isFormOpen && (
        <UnifiedRegistryForm
          headline={formConfig.headline}
          schema={formConfig.schema}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleRegistrySubmit}
        />
      )}

    </div>
  );
}