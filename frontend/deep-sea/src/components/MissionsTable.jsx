import React from 'react';
import { MoreVertical, UserPlus, Eye } from 'lucide-react';

export default function MissionsTable({ missionsData = [], maxRows, onAssignResearcher, onViewDetails }) {
  
  const displayedMissions = maxRows ? missionsData.slice(0, maxRows) : missionsData;

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'working':
      case 'done':
        return 'bg-success-glow text-success';
      case 'planned':
        return 'bg-info-glow text-info';
      case 'canceled':
        return 'bg-danger-glow text-danger';
      default:
        return 'bg-secondary-glow text-muted';
    }
  };

  return (
    <div className="glass-panel-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="card-title-header mb-1">Mission Profiles</h4>
          <span className="text-muted small">
            Displaying {displayedMissions.length} of {missionsData.length} tracked deployments
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="tabular-element w-100">
          <thead>
            <tr className="table-head-row">
              <th className="table-head-cell">MISSION NAME</th>
              <th className="table-head-cell">DESCRIPTION</th>
              <th className="table-head-cell">START DATE</th>
              <th className="table-head-cell">END DATE</th>
              <th className="table-head-cell">STATUS</th>
              <th className="table-head-cell">RESEARCH AREA</th>
              <th className="table-head-cell text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayedMissions.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-body-cell text-center text-muted py-4">
                  No active oceanic deployments found in data ledger.
                </td>
              </tr>
            ) : (
              displayedMissions.map((mission) => (
                <tr key={mission.id || mission.missionId} className="table-body-row">
                  <td className="table-body-cell fw-bold text-white">
                    {mission.missionName || "Unnamed Deployment"}
                  </td>
                  
                  <td className="table-body-cell text-muted small data-cell-truncate" title={mission.description}>
                    {mission.description || "No telemetry summary recorded."}
                  </td>
                  
                  <td className="table-body-cell text-white small">
                    {mission.startDate || "N/A"}
                  </td>
                  
                  <td className="table-body-cell text-white small">
                    {mission.endDate || "In Progress"}
                  </td>
                  
                  <td className="table-body-cell">
                    <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(mission.status)}`}>
                      {mission.status || "Unknown"}
                    </span>
                  </td>
                  
                  <td className="table-body-cell font-monospace text-info small">
                    {mission.researchArea || "Unassigned"}
                  </td>
                  
                  <td className="table-body-cell text-end">
                    <div className="d-inline-flex gap-2">
                      <button 
                        className="btn btn-action-icon" 
                        onClick={() => onAssignResearcher?.(mission)}
                        title="Assign Researcher"
                      >
                        <UserPlus size={14} color="#a0aec0" />
                      </button>
                      <button 
                        className="btn btn-action-icon" 
                        onClick={() => onViewDetails?.(mission)}
                        title="View System Logs"
                      >
                        <Eye size={14} color="#00f2fe" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}