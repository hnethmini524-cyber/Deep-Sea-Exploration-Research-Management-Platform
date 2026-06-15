import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import Pagination from '../components/Pagination';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { FORM_SCHEMAS } from '../formSchemas';
import '../styles/missions_page.css'; 

const EXTENDED_MOCK_MISSIONS = [
  { id: 1, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-A1'},
  { id: 2, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-B4'},
  { id: 3, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'CORE-SYS'},
  { id: 4, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'MOBILE-SST'},
  { id: 5, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'SUBSYS-7'},
  { id: 6, name: 'John Doe', email: 'abd@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-E2'},
  { id: 7, name: 'John Watson', email: 'john@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-E2'},
  { id: 8, name: 'John Watson', email: 'john@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-D1'},
  { id: 9, name: 'Peter Johnson', email: 'peter@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-E2'},
  { id: 10, name: 'Alan Watson', email: 'alan@gmail.com', speacial: 'deep-sea', role: 'Main researcher', institution: 'UK Campus', assigns: 'ZONE-D1'}
];

function MissionsDropdownCell({ missions }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!missions || missions.length === 0) {
    return <span className="text-muted font-monospace">NONE</span>;
  }
  if (missions.length === 1) {
    return <span className="single-mission-text font-monospace text-info fw-bold">{missions[0]}</span>;
  }

  return (
    <div className="inline-mission-dropdown-cell" ref={dropdownRef}>
      <button 
        type="button" 
        className={`btn-mission-cell-trigger font-monospace ${isOpen ? 'active-trigger' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{missions[0]}</span>
        <span className="badge-mission-count">+{missions.length - 1} More</span>
        {isOpen ? <ChevronUp size={14} className="text-primary ms-1" /> : <ChevronDown size={14} className="text-muted ms-1" />}
      </button>

      {isOpen && (
        <div className="cell-missions-floating-portal">
          <div className="portal-headline font-monospace">// ASSIGNED_TRACKS</div>
          <ul className="portal-items-list-pane">
            {missions.map((mission, index) => (
              <li key={index} className="portal-mission-row font-monospace">
                <Terminal size={12} className="text-info me-2 flex-shrink-0" />
                <span className="text-truncate text-white">{mission}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ResearcherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [researchersRawList, setResearchersRawList] = useState(EXTENDED_MOCK_MISSIONS);
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  const rowsPerPage = 5;

  const handleCreateResearcherSubmit = (formData) => {
    const commonBaseId = Date.now();
    const assignedMissionsArray = formData.assignedMissions || [];
    
    // Create rows for each assigned track to match the reduction engine parsing
    if (assignedMissionsArray.length === 0) {
      const fallbackRow = {
        id: commonBaseId,
        name: formData.researcherName || 'Anonymous Operator',
        email: formData.email || 'unknown@domain.com',
        speacial: formData.specialization || 'General Systems',
        role: formData.role || 'Unassigned Field Asset',
        institution: formData.institution || 'Independent Agent',
        assigns: 'CORE-SYS'
      };
      setResearchersRawList([fallbackRow, ...researchersRawList]);
    } else {
      const generatedRows = assignedMissionsArray.map((missionCode, index) => ({
        id: commonBaseId + index,
        name: formData.researcherName || 'Anonymous Operator',
        email: formData.email || 'unknown@domain.com',
        speacial: formData.specialization || 'General Systems',
        role: formData.role || 'Unassigned Field Asset',
        institution: formData.institution || 'Independent Agent',
        assigns: missionCode
      }));
      setResearchersRawList([...generatedRows, ...researchersRawList]);
    }

    setIsFormOpen(false);
  };

  const groupedResearchers = Object.values(
    researchersRawList.reduce((acc, current) => {
      if (!acc[current.email]) {
        acc[current.email] = {
          ...current,
          missionsArray: [current.assigns]
        };
      } else {
        if (!acc[current.email].missionsArray.includes(current.assigns)) {
          acc[current.email].missionsArray.push(current.assigns);
        }
      }
      return acc;
    }, {})
  );

  const filteredResearchers = groupedResearchers.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.missionsArray.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredResearchers.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredResearchers.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="missions-registry-viewport researcher-page-scope">
      
      <div className="registry-top-utility-bar d-flex justify-content-between align-items-center mb-4">
        <div className="search-input-wrapper position-relative">
          <input 
            type="text" 
            className="registry-search-field"
            placeholder="Search researcher or mission node..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button 
          type="button" 
          className="btn-add-action-node" 
          onClick={() => setIsFormOpen(true)}
        >
          Add New Researcher
        </button>
      </div>

      <div className="glass-panel-card w-100 p-4">
        <div className="panel-header-segment mb-3">
          <h3 className="panel-main-title">Researchers Registry</h3>
          <p className="panel-sub-label">
            <span className="text-success-glow-dot">✓</span> {filteredResearchers.length} unique operators identified inside active sector matrix indexes
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
                    
                    <td className="table-body-cell visual-dropdown-overflow-cell">
                      <MissionsDropdownCell missions={researcher.missionsArray} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    No matching deployment parameters registered inside the active search matrix index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(pageNum) => setCurrentPage(pageNum)}
          />
        )}
      </div>

      {isFormOpen && (
        <UnifiedRegistryForm 
          headline="RESEARCHER_RECORD"
          schema={FORM_SCHEMAS.RESEARCHER}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateResearcherSubmit}
        />
      )}

    </div>
  );
}