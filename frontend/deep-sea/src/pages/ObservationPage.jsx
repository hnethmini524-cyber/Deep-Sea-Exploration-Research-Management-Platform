import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import AssetDetailViewer from '../components/AssetDetailViewer';
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

  const rowsPerPage = 5;

  const totalSpeciesPages = Math.ceil(speciesList.length / rowsPerPage);
  const currentSpeciesRows = speciesList.slice((speciesPage - 1) * rowsPerPage, speciesPage * rowsPerPage);

  const totalSamplesPages = Math.ceil(samplesList.length / rowsPerPage);
  const currentSamplesRows = samplesList.slice((samplesPage - 1) * rowsPerPage, samplesPage * rowsPerPage);

  const handleRowClick = (item, entityType) => {
    const completeAssetPayload = {
      ...item,
      dataType: entityType // Explicit binding identifier route: 'species' | 'sample'
    };
    setSelectedAsset(completeAssetPayload);
    setIsViewerOpen(true);
  };

  const handleAddNewSpecies = () => {
    const name = prompt("Enter Species Common Name:");
    if (!name) return;
    const newEntry = {
      id: Date.now(),
      name,
      scientificName: prompt("Enter Scientific Name:") || 'Unknown sp.',
      category: prompt("Enter Category:") || 'Unclassified',
      depth: prompt("Enter Operating Depth:") || '0m',
      desc: prompt("Enter Description Summary:") || 'No baseline telemetry data registered.',
      missionName: prompt("Enter Assigned Mission Context:") || 'Standalone Entry',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      observations: prompt("Enter Environmental Observations Field:") || 'N/A'
    };
    setSpeciesList([newEntry, ...speciesList]);
  };

  const handleAddNewSample = () => {
    const sampleId = prompt("Enter Sample Identification ID String:");
    if (!sampleId) return;
    const newEntry = {
      id: Date.now(),
      sampleId,
      name: prompt("Enter Material Variant Type:") || 'Unspecified Core',
      type: prompt("Enter Detailed Classification Type:") || 'Raw Compound',
      date: new Date().toISOString().split('T')[0],
      depth: prompt("Enter Extraction Depth:") || '0m',
      missionName: prompt("Enter Core Mission Origin:") || 'Independent Extraction',
      desc: prompt("Enter Composition Brief Details:") || 'No chemical assessment logged.',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
      observations: prompt("Enter Laboratory Observations Summary:") || 'N/A'
    };
    setSamplesList([newEntry, ...samplesList]);
  };

  return (
    <div className="missions-registry-viewport">
      
      {/* Layer 1: species layer */}
      <div className="glass-panel-card w-100 p-4 mb-5 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Species Catalog</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {speciesList.length} unique taxonomic profiles indexed this session
            </p>
          </div>
          <button type="button" className="btn-add-action-node" onClick={handleAddNewSpecies}>
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

      {/* Layer 2: samples layer */}
      <div className="glass-panel-card w-100 p-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Physical Samples Ledger</h3>
            <p className="panel-sub-label">
              <span className="text-success-glow-dot">✓</span> {samplesList.length} deep-sea isolates locked in secure containment vessels
            </p>
          </div>
          <button type="button" className="btn-add-action-node" onClick={handleAddNewSample}>
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

      <AssetDetailViewer 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        assetData={selectedAsset} 
      />

    </div>
  );
}