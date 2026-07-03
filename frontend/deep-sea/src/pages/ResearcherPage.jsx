import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Terminal, UserCheck, ShieldAlert, MoreVertical, Trash2 } from 'lucide-react';
import Pagination from '../components/Pagination';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { FORM_SCHEMAS } from '../formSchemas';
import { apiService } from '../service/ApiService'; 
import '../styles/missions_page.css'; 

function RowActionsMenu({ userId, email, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative d-inline-block" ref={menuRef}>
      <button 
        type="button" 
        className="btn p-1 text-muted border-0 bg-transparent opacity-75 hover-opacity-100"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
      >
        <MoreVertical size={18} className="text-white-50" />
      </button>

      {isOpen && (
        <div 
          className="position-absolute end-0 bg-dark border border-secondary rounded shadow-lg py-1" 
          style={{ zIndex: 1050, minWidth: '120px', top: '100%', border: '1px solid rgba(255,255,255,0.15) !important' }}
        >
          <button
            type="button"
            className="dropdown-item btn text-danger w-100 text-start px-3 py-2 d-flex align-items-center gap-2 small bg-transparent border-0"
            onClick={() => {
              onDelete(userId, email);
              setIsOpen(false);
            }}
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.15)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Trash2 size={12} />
            <span>Delete User</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResearcherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [researchers, setResearchers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const rowsPerPage = 6; 
  const [userRole] = useState('ADMIN'); 

  // Fetch matrix execution handler
  const loadResearchersRegistry = async () => {
    try {
      setIsLoading(true);
      setError('');
      const pageIndex = currentPage - 1;
      const data = await apiService.fetchResearchers(pageIndex, rowsPerPage);
      
      if (data && Array.isArray(data.content)) {
        setResearchers(data.content);
        setTotalElements(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setResearchers(data);
        setTotalElements(data.length);
      }
    } catch (err) {
      setError(err?.message || 'Error executing secure telemetry pipeline retrieval.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResearchersRegistry();
  }, [currentPage]);

  const handleDeleteUser = async (id, email) => {
    if (!id) {
      alert("Structural clearance rejected: Primary operational ID missing.");
      return;
    }
    if (window.confirm(`Execute structural clearance for user with email: ${email}?`)) {
      try {
        await apiService.deleteUser(id);
        loadResearchersRegistry();
      } catch (err) {
        alert(err?.message || "Execution error clearing system credentials context.");
      }
    }
  };

  const handleCreateResearcherSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email || 'unknown@domain.com',
        speacial: formData.speacial || 'General Systems',
        role: formData.role || 'Unassigned Field Asset',
        institution: formData.institution || 'Independent Agent'
      };

      await apiService.inviteResearcher(payload);
      setIsFormOpen(false);
      setCurrentPage(1); // Return index view to primary sector
      loadResearchersRegistry();
    } catch (err) {
      alert(err?.message || "Error deploying new researcher registration matrix context.");
    }
  };

  // Safe grouping pipeline parsing arrays coming from backend schemas
  const groupedResearchers = Object.values(
    researchers.reduce((acc, current) => {
      const fieldEmail = current.email || 'unknown@domain.com';
      if (!acc[fieldEmail]) {
        acc[fieldEmail] = {
          ...current,
          missionsArray: current.assigns ? [current.assigns] : (current.assignedMissions || [])
        };
      } else {
        if (current.assigns && !acc[fieldEmail].missionsArray.includes(current.assigns)) {
          acc[fieldEmail].missionsArray.push(current.assigns);
        }
      }
      return acc;
    }, {})
  );

  // Client-side search layer filter fallback mapping
  const filteredResearchers = groupedResearchers.filter(r =>
    (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.missionsArray || []).some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(totalElements / rowsPerPage);

  return (
    <div className="missions-registry-viewport researcher-page-scope">
      
      <div className="registry-top-utility-bar d-flex justify-content-between align-items-center mb-4">
        <div className="search-input-wrapper position-relative">
          <input 
            type="text" 
            className="registry-search-field"
            placeholder="Search researcher or mission node..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
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
            <span className="text-success-glow-dot">✓</span> {totalElements} unique operators identified inside active sector matrix indexes
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
                <th className="table-head-cell text-center">Account Status</th>
                {userRole === 'ADMIN' && <th className="table-head-cell text-end" style={{ width: '50px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? "8" : "7"} className="text-center font-monospace text-info py-5">
                    &gt; FETCHING OPERATIONAL DATALINK VALUES...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? "8" : "7"} className="text-center font-monospace text-danger py-5">
                    !! SERVER MATRIX ERROR: {error} !!
                  </td>
                </tr>
              ) : filteredResearchers.length > 0 ? (
                filteredResearchers.map((researcher) => (
                  <tr key={researcher.id} className="table-body-row">
                    <td className="table-body-cell fw-bold text-white py-3">{researcher.name}</td>
                    <td className="table-body-cell data-cell-truncate text-muted">{researcher.email}</td>
                    <td className="table-body-cell text-muted">{researcher.speacial || researcher.specialization}</td>
                    <td className="table-body-cell text-muted">{researcher.role}</td>
                    <td className="table-body-cell text-info fw-bold">{researcher.institution}</td>
                    
                    {/* Status column */}
                    <td className="table-body-cell text-center align-middle">
                      {researcher.enabled ? (
                        <div className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded bg-success bg-opacity-10 border border-success border-opacity-20 text-success font-monospace small">
                          <UserCheck size={12} />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded bg-warning bg-opacity-10 border border-warning border-opacity-20 text-warning font-monospace small">
                          <ShieldAlert size={12} />
                          <span>PENDING</span>
                        </div>
                      )}
                    </td>

                    {/* Conditional rendering for Admin Actions column */}
                    {userRole === 'ADMIN' && (
                      <td className="table-body-cell text-end align-middle">
                        <RowActionsMenu 
                          userId={researcher.id} 
                          email={researcher.email} 
                          onDelete={handleDeleteUser} 
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? "8" : "7"} className="text-center text-muted py-5">
                    No matching deployment parameters registered inside the active search matrix index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalPages > 1 && (
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