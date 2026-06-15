import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import AssetDetailViewer from '../components/AssetDetailViewer';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { FORM_SCHEMAS } from '../formSchemas';
import '../styles/missions_page.css'; 

const INITIAL_SPECIES = [
  { 
    id: 1, 
    name: 'Magnapinna Squid',
    scientificName: 'Magnapinna sp.', 
    category: 'Cephalopoda', 
    depth: '6,200m', 
    desc: 'Ultra-rare squid characterized by massive, angular terminal fins and ultra-elongated tentacles.',
    missionName: 'Abyssal Sweep Alpha',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    observations: 'Observed floating passively in a vertical orientation near the benthic boundary layers. Highly responsive to nearby illumination changes.'
  },
  { 
    id: 2, 
    name: 'Benthocodon Jelly', 
    scientificName: 'Benthocodon pedunculatus', 
    category: 'Medusozoa', 
    depth: '3,400m', 
    desc: 'A deep-red medusa jelly that stays near the sea floor to mask its bioluminescent stomach contents from predators.',
    missionName: 'Operation Red Shield',
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1000&q=80',
    observations: 'Exhibited brief bursts of rhythmic swimming when approached by the ROV telemetry array. Light-absorbent pigmentation confirmed.'
  }
];

const INITIAL_SAMPLES = [
  { 
    id: 1, 
    sampleId: 'SMP-902', 
    name: 'Sulfide Chimney Crust',
    type: 'Mineral Crust',
    date: '2026-04-12', 
    depth: '2,900m', 
    missionName: 'Hydrothermal Vent Probe',
    desc: 'Crystalline metal sulfide deposits extracted directly from the outer rim of an active, venting sulfide tower segment.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    observations: 'Rich multi-spectral crystalline layering observed under magnifying lenses. Traces of hyperthermophilic micro-fauna filaments detected on outer crust.'
  },
  { 
    id: 2, 
    sampleId: 'SMP-903', 
    name: 'Abyssal Brine Matrix',
    type: 'Hypersaline Liquid', 
    date: '2026-05-19', 
    depth: '4,100m', 
    missionName: 'Anoxic Basin Scan',
    desc: 'Pressurized liquid core capture maintaining dense chemical brine compositions from sub-surface under-sea lake pools.',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80',
    observations: 'Extremely dense density fluid gradient separation verified at pressurized containment cell. Completely anaerobic macro-environment.'
  }
];

export default function ObservationPage() {
  const [speciesList, setSpeciesList] = useState(INITIAL_SPECIES);
  const [samplesList, setSamplesList] = useState(INITIAL_SAMPLES);
  const [speciesPage, setSpeciesPage] = useState(1);
  const [samplesPage, setSamplesPage] = useState(1);
  
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formConfig, setFormConfig] = useState({ headline: '', schema: [], type: '' });

  const rowsPerPage = 5;

  const totalSpeciesPages = Math.ceil(speciesList.length / rowsPerPage);
  const currentSpeciesRows = speciesList.slice((speciesPage - 1) * rowsPerPage, speciesPage * rowsPerPage);

  const totalSamplesPages = Math.ceil(samplesList.length / rowsPerPage);
  const currentSamplesRows = samplesList.slice((samplesPage - 1) * rowsPerPage, samplesPage * rowsPerPage);

  const handleRowClick = (item, entityType) => {
    const completeAssetPayload = {
      ...item,
      dataType: entityType
    };
    setSelectedAsset(completeAssetPayload);
    setIsViewerOpen(true);
  };

  // Triggers the drawer for Species Mode
  const handleOpenSpeciesForm = () => {
    setFormConfig({
      headline: 'SPECIES_RECORD',
      schema: FORM_SCHEMAS.SPECIES,
      type: 'SPECIES'
    });
    setIsFormOpen(true);
  };

  // Triggers the drawer for Sample Mode
  const handleOpenSampleForm = () => {
    setFormConfig({
      headline: 'SAMPLE_RECORD',
      schema: FORM_SCHEMAS.SAMPLE,
      type: 'SAMPLE'
    });
    setIsFormOpen(true);
  };

  // Unified submit router
  const handleRegistrySubmit = (formData) => {
    if (formConfig.type === 'SPECIES') {
      const newSpecies = {
        id: Date.now(),
        name: formData.commonName || 'Unspecified Common Name',
        scientificName: formData.scientificName || 'Unknown sp.',
        category: formData.category || 'Unclassified',
        depth: formData.depth ? `${formData.depth}m` : '0m',
        desc: formData.description || 'No baseline telemetry data registered.',
        missionName: formData.missionName || 'Independent Entry',
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
        observations: formData.description || 'N/A'
      };
      setSpeciesList([newSpecies, ...speciesList]);
    } else if (formConfig.type === 'SAMPLE') {
      const newSample = {
        id: Date.now(),
        sampleId: formData.sampleId || `SMP-${Math.floor(Math.random() * 900) + 100}`,
        name: formData.type || 'Unspecified Core',
        type: formData.type || 'Raw Compound',
        date: formData.collectionDate || new Date().toISOString().split('T')[0],
        depth: formData.depth ? `${formData.depth}m` : '0m',
        missionName: formData.missionName || 'Independent Extraction',
        desc: formData.description || 'No chemical assessment logged.',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
        observations: formData.description || 'N/A'
      };
      setSamplesList([newSample, ...samplesList]);
    }
    
    setIsFormOpen(false);
  };

  return (
    <div className="missions-registry-viewport">
      
      {/* pecies layer */}
      <div className="glass-panel-card w-100 p-4 mb-5 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Species Catalog</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {speciesList.length} unique taxonomic profiles indexed this session
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
              {currentSpeciesRows.map((species) => (
                <tr key={species.id} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowClick(species, 'species')}>
                  <td className="table-body-cell fw-bold text-white py-3">{species.name}</td>
                  <td className="table-body-cell text-info font-monospace">{species.scientificName}</td>
                  <td className="table-body-cell text-muted">{species.category}</td>
                  <td className="table-body-cell text-warning fw-bold">{species.depth}</td>
                  <td className="table-body-cell data-cell-truncate text-muted">{species.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Pagination currentPage={speciesPage} totalPages={totalSpeciesPages} onPageChange={setSpeciesPage} />
        </div>
      </div>

      {/* samples layer */}
      <div className="glass-panel-card w-100 p-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Physical Samples Ledger</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {samplesList.length} deep-sea isolates locked in secure containment vessels
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
                <th className="table-head-cell" style={{ width: '15%' }}>Sample ID</th>
                <th className="table-head-cell" style={{ width: '20%' }}>Type</th>
                <th className="table-head-cell" style={{ width: '15%' }}>Collection Date</th>
                <th className="table-head-cell" style={{ width: '12%' }}>Depth</th>
                <th className="table-head-cell" style={{ width: '18%' }}>Mission</th>
                <th className="table-head-cell" style={{ width: '20%' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {currentSamplesRows.map((sample) => (
                <tr key={sample.id} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowClick(sample, 'sample')}>
                  <td className="table-body-cell text-warning fw-bold py-3">{sample.sampleId}</td>
                  <td className="table-body-cell fw-bold text-white">{sample.name}</td>
                  <td className="table-body-cell text-muted">{sample.date}</td>
                  <td className="table-body-cell text-info fw-bold">{sample.depth}</td>
                  <td className="table-body-cell text-muted font-monospace">{sample.missionName}</td>
                  <td className="table-body-cell data-cell-truncate text-muted">{sample.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Pagination currentPage={samplesPage} totalPages={totalSamplesPages} onPageChange={setSamplesPage} />
        </div>
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