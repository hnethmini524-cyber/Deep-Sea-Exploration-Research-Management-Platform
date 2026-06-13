import React, { useState } from 'react';
import Pagination from '../components/Pagination';
import '../styles/missions_page.css';

// --- MOCK EXTENDED OCEANIC DATA ARRAY MATRIX ---
const EXTENDED_MOCK_MISSIONS = [
  { id: 1, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-A1'},
  { id: 2, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-B4'},
  { id: 3, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'CORE-SYS'},
  { id: 4, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'MOBILE-SST'},
  { id: 5, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'SUBSYS-7'},
  { id: 6, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-E2'},
  { id: 7, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-D1'}
];

export default function ResearcherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  // Search filter configuration layer
  const filteredMissions = EXTENDED_MOCK_MISSIONS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.assigns && m.assigns.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination processing allocations
  const totalPages = Math.ceil(filteredMissions.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMissions.slice(indexOfFirstRow, indexOfLastRow);

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
        <button type="button" className="btn-add-action-node">
          Add New Researcher
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
                <th className="table-head-cell">Researcher Name</th>
                <th className="table-head-cell">Email</th>
                <th className="table-head-cell">Specialization</th>
                <th className="table-head-cell">Role</th>
                <th className="table-head-cell">Institution</th>
                <th className="table-head-cell">Assigned Missions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((researcher) => (
                  <tr key={researcher.id} className="table-body-row">
                    <td className="table-body-cell fw-bold text-white py-3">{researcher.name}</td>
                    <td className="table-body-cell data-cell-truncate text-muted">{researcher.email}</td>
                    <td className="table-body-cell text-muted">{researcher.speacial}</td>
                    <td className="table-body-cell text-muted">{researcher.role}</td>
                    <td className="table-body-cell text-info fw-bold">{researcher.institution}</td>
                    <td className="table-body-cell text-info fw-bold">{researcher.assigns}</td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(pageNum) => setCurrentPage(pageNum)}
          />
        )}
      </div>

    </div>
  );
}