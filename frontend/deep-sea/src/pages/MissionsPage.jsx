import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import AssetDetailViewer from '../components/AssetDetailViewer';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { FORM_SCHEMAS } from '../formSchemas';
import '../styles/missions_page.css';

const EXTENDED_MOCK_MISSIONS = [
  { id: 1, name: 'Chakra Soft UI Version', desc: 'Deep sea diagnostic check on core UI framework elements.', start: '2026-01-10', end: '2026-02-15', status: 'Working', area: 'ZONE-A1', completion: 60 },
  { id: 2, name: 'Add Progress Track', desc: 'Integrating continuous telemetry mapping for abyssal tools.', start: '2026-02-18', end: '2026-03-01', status: 'Canceled', area: 'ZONE-B4', completion: 10 },
  { id: 3, name: 'Fix Platform Errors', desc: 'Patching relational database constraints and bugs.', start: '2026-03-05', end: '2026-03-12', status: 'Done', area: 'CORE-SYS', completion: 100 },
  { id: 4, name: 'Launch our Mobile App', desc: 'Deploying compressed telemetry stream receivers to devices.', start: '2026-04-01', end: '2026-05-10', status: 'Done', area: 'MOBILE-SST', completion: 100 },
  { id: 5, name: 'Add the New Pricing Page', desc: 'Formulating premium content ledger categorizations.', start: '2026-05-15', end: '—', status: 'Working', area: 'SUBSYS-7', completion: 25 },
  { id: 6, name: 'Redesign New Online Shop', desc: 'Upgrading storefront core nodes and assets repository.', start: '2026-06-01', end: '—', status: 'Working', area: 'ZONE-E2', completion: 40 },
  { id: 7, name: 'Bathymetric Mapping', desc: 'Sonar topography sweeps across Mariana Trench segment.', start: '2026-06-12', end: '2026-07-20', status: 'Working', area: 'ZONE-D1', completion: 15 }
];

export default function MissionsPage() {
  const [missionsList, setMissionsList] = useState(EXTENDED_MOCK_MISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const rowsPerPage = 5;

  const filteredMissions = missionsList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMissions.length / rowsPerPage);
  const currentRows = filteredMissions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleRowSelection = (mission) => {
    setSelectedMission({
      ...mission,
      dataType: 'mission',
      missionName: mission.name,
      startDate: mission.start,
      endDate: mission.end,
      researchArea: mission.area
    });
    setIsDossierOpen(true);
  };

  const handleFormSubmit = (payload) => {
    const newMission = {
    id: Date.now(),
    name: payload.name,
    desc: payload.description || 'No descriptions logged.',
    start: payload.startDate,
    end: payload.endDate || '—',
    status: payload.status,
    area: payload.researchArea || 'UNASSIGNED',
    completion: payload.status === 'Completed' || payload.status === 'Done' ? 100 : 0
  };
    setMissionsList([newMission, ...missionsList]);
    setIsFormOpen(false);
  };

  return (
    <div className="missions-registry-viewport">
      <div className="registry-top-utility-bar d-flex justify-content-between align-items-center mb-4">
        <div className="search-input-wrapper position-relative">
          <input 
            type="text" 
            className="registry-search-field"
            placeholder="Type here & Enter to filter missions..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button type="button" className="btn-add-action-node" onClick={() => setIsFormOpen(true)}>
          ADD A NEW MISSION
        </button>
      </div>

      <div className="glass-panel-card w-100 p-4">
        <div className="panel-header-segment mb-3">
          <h3 className="panel-main-title">Missions Registry</h3>
          <p className="panel-sub-label">
            <span className="text-success-glow-dot">✓</span> {filteredMissions.length} active configurations tracked this quarter
          </p>
        </div>

        <div className="table-responsive">
          <table className="table tabular-element text-white w-100 m-0">
            <thead>
              <tr className="table-head-row">
                <th className="table-head-cell">Mission Name</th>
                <th className="table-head-cell">Description</th>
                <th className="table-head-cell">Start Date</th>
                <th className="table-head-cell">End Date</th>
                <th className="table-head-cell">Status</th>
                <th className="table-head-cell">Research Area</th>
                <th className="table-head-cell text-center">View Details</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((mission) => (
                  <tr key={mission.id} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowSelection(mission)}>
                    <td className="table-body-cell fw-bold text-white py-3">{mission.name}</td>
                    <td className="table-body-cell data-cell-truncate text-muted">{mission.desc}</td>
                    <td className="table-body-cell text-muted">{mission.start}</td>
                    <td className="table-body-cell text-muted">{mission.end}</td>
                    <td className="table-body-cell">
                      <span className={`status-badge ${mission.status === 'Done' ? 'done-glow' : mission.status === 'Canceled' ? 'canceled-glow' : 'working-glow'}`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="table-body-cell text-info fw-bold">{mission.area}</td>
                    <td className="table-body-cell text-center" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="btn-assign-researcher-node" onClick={() => handleRowSelection(mission)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    No matching deployment parameters registered inside the active search matrix index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>

      <AssetDetailViewer 
        isOpen={isDossierOpen} 
        onClose={() => { setIsDossierOpen(false); setSelectedMission(null); }} 
        assetData={selectedMission} 
      />

      {isFormOpen && (
        <UnifiedRegistryForm 
          headline="MISSION_RECORD"
          schema={FORM_SCHEMAS.MISSION}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}