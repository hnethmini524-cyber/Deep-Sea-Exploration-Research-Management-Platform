import React, { useState, useRef, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { MoreVertical, Edit3 } from 'lucide-react';
import AssetDetailViewer from '../components/AssetDetailViewer';
import UnifiedRegistryForm from '../components/UnifiedRegistryForm';
import { apiService } from '../service/apiService';
import { FORM_SCHEMAS } from '../formSchemas';
import '../styles/missions_page.css';

// Context Menu Sub-Component for individual rows
function RowActionsMenu({ mission, onEdit }) {
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
        onClick={(e) => {
          e.stopPropagation(); 
          setIsOpen(!isOpen);
        }}
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
            className="dropdown-item btn text-info w-100 text-start px-3 py-2 d-flex align-items-center gap-2 small bg-transparent border-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(mission);
              setIsOpen(false);
            }}
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(23, 162, 184, 0.15)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Edit3 size={12} />
            <span>Edit</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function MissionsPage() {
  const [missionsList, setMissionsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMission, setSelectedMission] = useState(null);
  const [editingMission, setEditingMission] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customSchema, setCustomSchema] = useState(FORM_SCHEMAS.MISSION);
  const [missionSchema, setMissionSchema] = useState(FORM_SCHEMAS.MISSION);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const rowsPerPage = 5;

  const fetchMissionsFromBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery.trim()) {
        data = await apiService.searchMissions(searchQuery, currentPage - 1, rowsPerPage);
      } else {
        data = await apiService.getMissions(currentPage - 1, rowsPerPage);
      }

      setMissionsList(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("❌ Failed to pull telemetry stream array:", err);
      setError(err.message || "Failed to synchronize configurations matrix with core operational ledger.");
    } finally {
      setLoading(false);
    }
  };

  const prepareDynamicFormSchema = async () => {
    try {
      const response = await apiService.getResearchAreasList(); 
      const areasData = response?.content || response || [];

      const formattedOptions = areasData.map(area => ({
        id: area.id,
        name: area.areaName || area.name
      }));

      // Inject research areas into the structural schema layout
      const updatedFields = FORM_SCHEMAS.MISSION.fields.map(field => {
        if (field.name === 'researchArea') {
          return { ...field, options: formattedOptions };
        }
        return field;
      });

      setCustomSchema({ ...FORM_SCHEMAS.MISSION, fields: updatedFields });
    } catch (err) {
      console.warn("⚠️ Research Areas unavailable for options fallback:", err);
      setCustomSchema(FORM_SCHEMAS.MISSION); // Fallback to raw layout matrix
    }
  };

  useEffect(() => {
    fetchMissionsFromBackend();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    prepareDynamicFormSchema();
  }, []);

  useEffect(() => {
  const loadDropdownData = async () => {
    try {
      const [researchers, areas, species, samples] = await Promise.all([
        apiService.fetchResearchers(0, 100),
        apiService.getResearchAreas(0, 100),
        apiService.getSpecies(0, 100),
        apiService.getSamples(0, 100)
      ]);

      const updatedSchema = {
        ...FORM_SCHEMAS.MISSION,
        fields: FORM_SCHEMAS.MISSION.fields.map(field => {

          if (field.name === "leadResearcherId") {
            return {
              ...field,
              options: researchers.content.map(r => ({
                id: r.id,
                name: r.name
              }))
            };
          }

          if (field.name === "researchAreaId") {
            return {
              ...field,
              options: areas.content.map(a => ({
                id: a.id,
                name: a.areaName
              }))
            };
          }

          if (field.name === "speciesIds") {
            return {
              ...field,
              options: species.content.map(s => ({
                id: s.id,
                name: s.commonName
              }))
            };
          }

          if (field.name === "sampleIds") {
            return {
              ...field,
              options: samples.content.map(s => ({
                id: s.sampleId,
                name: s.sampleCode
              }))
            };
          }

          return field;
        })
      };

      setMissionSchema(updatedSchema);

    } catch (err) {
      console.error(err);
    }
  };
  loadDropdownData();
  }, []);

  const handleRowSelection = (mission) => {
    setSelectedMission({
      ...mission,
      dataType: 'mission',
      codeName: mission.codeName,
      startDate: mission.launchDate || mission.startDate, 
      endDate: mission.endDate,
      researchArea: mission.researchAreaName || mission.researchArea
    });
    setIsDossierOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setError(null);
    try {
      let uploadedImageUrl = null;
      
      if (payload && payload.imageUrl) {
        uploadedImageUrl = await apiService.uploadImage(payload.imageUrl);
      }

      if (editingMission && selectedMission) {
        const updatePayload = {
          codeName: payload.codeName,
          description: payload.description || 'No descriptions logged.',
          startDate: payload.startDate,
          endDate: payload.endDate || null,
          status: payload.status
        };

        await apiService.updateMission(selectedMission.id, updatePayload);
      } else {
        const createPayload = {
          codeName: payload.codeName,
          description: payload.description || 'No descriptions logged.',
          launchDate: payload.launchDate,
          completionDate: payload.completionDate || null,
          status: payload.status || 'PLANNING',
          researchAreaId: payload.researchAreaId || null,
          leadResearcherId: payload.leadResearcherId,
          speciesIds: payload.speciesIds,
          sampleIds: payload.sampleIds,
          imageUrl: uploadedImageUrl
        };

        await apiService.createMission(createPayload);
      }

      setIsFormOpen(false);
      setEditingMission(null);
      setSelectedMission(null);
      setCurrentPage(1);
      fetchMissionsFromBackend();
    } catch (err) {
      console.error("❌ Persistence exception intercepted:", err);
      setError(err.message || "Could not execute data mutation workflow on remote server registry.");
    }
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingMission(null);
    setSelectedMission(null);
  };

  const handleEditClick = (mission) => {
    setEditingMission({
      name: mission.codeName,
      description: mission.description,
      startDate: mission.launchDate || mission.startDate,
      endDate: mission.endDate || '',
      status: mission.status,
      researchAreaId: mission.researchAreaId || mission.researchArea
    });
    setSelectedMission(mission); 
    setIsFormOpen(true);
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

      {error && (
        <div className="alert alert-danger font-monospace small mb-4 bg-dark text-danger border-danger">
          ⚠️ CORE RUNTIME EXCEPTION: {error}
        </div>
      )}

      <div className="glass-panel-card w-100 p-4">
        <div className="panel-header-segment mb-3">
          <h3 className="panel-main-title">Missions Registry</h3>
          <p className="panel-sub-label">
            <span className="text-success-glow-dot">✓</span> {totalElements} active configurations tracked this quarter
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
                <th className="table-head-cell text-end" style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center font-monospace text-info py-5">
                    📡 DOWNLINK SYSTEM ACTIVE: RETRIEVING LIVE ENGINE METRICS...
                  </td>
                </tr>
              ) : missionsList.length > 0 ? (
                missionsList.map((mission) => (
                  <tr key={mission.id} className="table-body-row" style={{ cursor: 'pointer' }} onClick={() => handleRowSelection(mission)}>
                    <td className="table-body-cell fw-bold text-white py-3">{mission.codeName}</td>
                    <td className="table-body-cell data-cell-truncate text-muted">{mission.description}</td>
                    <td className="table-body-cell text-muted">{mission.launchDate || mission.startDate}</td>
                    <td className="table-body-cell text-muted">{mission.completionDate || '—'}</td>
                    <td className="table-body-cell">
                      <span className={`status-badge ${(mission.status === 'COMPLETED') ? 'done-glow' : mission.status === 'CANCELLED' ? 'canceled-glow' : 'working-glow'}`}>
                        {mission.status}
                      </span>
                    </td>
                    <td className="table-body-cell text-info fw-bold">{mission.researchAreaName || 'UNASSIGNED'}</td>
                    <td className="table-body-cell text-center" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="btn-assign-researcher-node" onClick={() => handleRowSelection(mission)}>
                        View
                      </button>
                    </td>
                    <td className="table-body-cell text-end align-middle">
                      {mission.status?.toLowerCase() === 'active' || mission.status?.toLowerCase() === 'planning' ? (
                        <RowActionsMenu mission={mission} onEdit={handleEditClick} />
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-5">
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
          headline={editingMission ? "MISSION_RECORD" : "MISSION_RECORD"}
          schema={missionSchema}
          initialData={editingMission} 
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}