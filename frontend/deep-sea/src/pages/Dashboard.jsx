import React, { useEffect, useState } from 'react';
import { apiService } from '../service/apiService';
import { Wallet, Globe, FileText, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import MissionHeroBanner from '../components/Banner';
import MissionsTable from '../components/MissionsTable';
import '../styles/dashboard.css';

export default function Dashboard({ allMissions = [] }) {
  
  const handleLaunchMission = () => console.log('Initiating tracking launch form...');
  const handleExportTelemetry = () => console.log('Compiling systems ledger parameters...');
  const handleAssignPersonnel = (mission) => console.log('Opening assignment mapping for:', mission);
  const [dashboardData, setDashboardData] = useState({
    summary: {
        totalMissions: 0,
        totalResearchers: 0,
        totalSpecies: 0,
        totalResearchAreas: 0
    },
    missionsPerMonth: [],
    sampleTypes: []
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiService.getDashboard();
        console.log(response);
        setDashboardData(response);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-info py-5 font-monospace">Loading dashboard...</div>

    );
  }
  console.log(dashboardData);

  const STATE_WIDGET_DATA = [
    {
        id:1,
        label:"Total Missions",
        metric:dashboardData.summary.totalMissions,
        icon:Wallet
    },

    {
        id:2,
        label:"Total Researchers",
        metric:dashboardData.summary.totalResearchers,
        icon:Globe
    },

    {
        id:3,
        label:"Total Species",
        metric:dashboardData.summary.totalSpecies,
        icon:FileText
    },

    {
        id:4,
        label:"Research Areas",
        metric:dashboardData.summary.totalResearchAreas,
        icon:Database
    }

  ];

  const TELEMETRY_TIMELINE_DATA =
  dashboardData.missionsPerMonth.map(item => ({

      name:item.month,

      metrics:item.count

  }));

  const BAR_DISTRIBUTION_DATA =
  dashboardData.sampleTypes.map(item => ({

      group:item.type,

      volume:item.count

  }));

  return (
    <div className="dashboard-page-viewport">
    <div className="container-fluid p-4">
      
      {/* Hero section */}
      <div className="row mb-4">
        <div className="col-12">
          <MissionHeroBanner 
            onCreateMissionClick={handleLaunchMission} 
            onExportReportClick={handleExportTelemetry} 
          />
        </div>
      </div>

      {/* State card row */}
      <div className="row g-4 mb-4">
        {STATE_WIDGET_DATA.map((card) => {
          const CardIcon = card.icon;
          return (
            <div key={card.id} className="col-12 col-md-6 col-xl-3">
              <div className="glass-panel-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="card-metric-label">{card.label}</span>
                    <h3 className="card-metric-value mb-0 mt-1">
                      {card.metric}
                      <span className={`variance-tag ${card.status === 'positive' ? 'text-success' : 'text-danger'}`}>
                        {card.variance}
                      </span>
                    </h3>
                  </div>
                  <div className="icon-cyan-bubble">
                    <CardIcon size={18} color="#fff" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart layer */}
      <div className="row g-4 mb-4">
        
        <div className="col-12 col-lg-8">
          <div className="glass-panel-card h-100">
            <div className="mb-3">
              <span className="text-success small fw-bold">Mission launches grouped by month</span>
              <h4 className="card-title-header m-0">Missions overview</h4>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={TELEMETRY_TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#a0aec0" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a0aec0" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#060b28', borderColor: 'rgba(26, 35, 90, 0.6)', color: '#fff' }} />
                  <Area type="monotone" dataKey="metrics" stroke="#00f2fe" fill="rgba(0, 242, 254, 0.12)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vertical distribution bar grid chart */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel-card h-100 d-flex flex-column justify-content-between">
            <div className="inner-dark-chart-container mb-3">
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                  <BarChart data={BAR_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <XAxis dataKey="group" stroke="#fff" fontSize={10} tickLine={false} />
                    <YAxis stroke="#fff" fontSize={10} tickLine={false} />
                    <Bar dataKey="volume" fill="#fff" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="card-title-header m-0">Sample Types</h4>
              <span className="text-muted small">Distribution of collected samples</span>
            </div>
          </div>
        </div>

      </div>

      <div className="row">
        <div className="col-12">
          {/* Renders the custom MissionsTable component*/}
          <MissionsTable 
            missionsData={allMissions} 
            maxRows={10} 
            onAssignResearcher={handleAssignPersonnel}
          />
        </div>
      </div>

    </div>
  </div>
  );
}