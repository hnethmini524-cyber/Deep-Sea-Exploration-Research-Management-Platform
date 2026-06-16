import React from 'react';
import { 
  HelpCircle, 
  Layers, 
  MapPin, 
  Compass, 
  Users, 
  ShieldAlert, 
  Info, 
  Terminal, 
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import '../styles/system_info.css';

export default function SystemInfoPage() {
  return (
    <div className="system-info-viewport font-monospace text-white">
      
      {/* --- PAGE HEADER SEGMENT --- */}
      <div className="info-header-block text-center mb-5 animate-fade-in">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <Terminal className="text-info" size={24} />
          <h1 className="system-main-title tracking-wider m-0">OceanExplore - Complete Guide</h1>
        </div>
        <p className="text-muted small">
          Comprehensive operational documentation for utilizing the abyssal deployment and telemetry configuration platform
        </p>
        <div className="d-flex justify-content-center gap-4 text-muted small mt-2 opacity-70">
          <span><Database size={14} className="me-1 text-info" /> Deep Sea Telemetry Matrix</span>
          <span>•</span>
          <span><Users size={14} className="me-1 text-success" /> Authorized Operators Only</span>
        </div>
      </div>

      {/* --- SECTION 1: SYSTEM CORE THESIS --- */}
      <div className="glass-info-card p-4 mb-4">
        <h4 className="section-title text-info mb-3 d-flex align-items-center gap-2">
          <Info size={18} /> 1. Operational System Thesis
        </h4>
        <p className="text-white-80 leading-relaxed mb-0">
          <strong>OceanExplore</strong> is a centralized data platform designed for the systematic management of deep-sea exploration campaigns. The application standardizes how bathymetric research zones are cataloged, tracks real-time mission parameters, maps biological sample discovery telemetry, and securely maintains researcher rosters. By providing clear permission boundaries, it guarantees data integrity during high-intensity abyssal tracking configurations.
        </p>
      </div>

      {/* --- SECTION 2: WORKFLOW PIPELINE ARCHITECTURE --- */}
      <div className="glass-info-card p-4 mb-4">
        <h4 className="section-title text-info mb-4 d-flex align-items-center gap-2">
          <Compass size={18} /> 2. Core Workflow Sequence Setup Guide
        </h4>
        <p className="text-muted small mb-4">
          To maintain relational database validation constraints, data deployment must strictly follow this sequential pipeline path:
        </p>

        <div className="row g-4 workflow-grid">
          
          {/* Step 1 */}
          <div className="col-md-4">
            <div className="workflow-step-node p-3 h-100 position-relative">
              <div className="step-badge">01</div>
              <h5 className="step-title d-flex align-items-center gap-2 text-warning mt-2">
                <MapPin size={16} /> Define Research Area
              </h5>
              <p className="step-desc text-muted small mb-0">
                All telemetry records depend on an environment context. You must initialize a distinct **Research Area** (e.g., <em>ZONE-A1</em>, <em>MOBILE-SST</em>) before mapping configurations.
              </p>
              <ArrowRight className="step-connector d-none d-md-block text-muted opacity-30" size={20} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-4">
            <div className="workflow-step-node p-3 h-100 position-relative">
              <div className="step-badge">02</div>
              <h5 className="step-title d-flex align-items-center gap-2 text-success mt-2">
                <Layers size={16} /> Initialize Missions
              </h5>
              <p className="step-desc text-muted small mb-0">
                Once an target zone is in the registry database, an administrator can generate a fresh **Mission Deployment Record** tied directly into that predefined research sector.
              </p>
              <ArrowRight className="step-connector d-none d-md-block text-muted opacity-30" size={20} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-4">
            <div className="workflow-step-node p-3 h-100">
              <div className="step-badge">03</div>
              <h5 className="step-title d-flex align-items-center gap-2 text-info mt-2">
                <Users size={16} /> Assign Roster Personnel
              </h5>
              <p className="step-desc text-muted small mb-0">
                Qualified operational **Researchers** are assigned to the active missions matrix, unlocking their secure access parameters to post diving observations and sample logs.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- SECTION 3: PRIVILEGE CONTROL MATRIX --- */}
      <div className="glass-info-card p-4">
        <h4 className="section-title text-info mb-3 d-flex align-items-center gap-2">
          <ShieldAlert size={18} /> 3. System Permission Matrix
        </h4>
        <p className="text-muted small mb-4">
          This system is restricted. Functional operations are securely bound strictly to these two recognized system roles:
        </p>

        <div className="row g-4">
          
          {/* Admin Row Context */}
          <div className="col-md-6">
            <div className="role-profile-box border-admin p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-danger text-white px-3 py-1 font-monospace">ROLE_ADMIN</span>
                <span className="text-muted small">// Root Authority</span>
              </div>
              <ul className="role-capabilities-list list-unstyled d-flex flex-column gap-2 text-muted small m-0 pt-2">
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-info mt-1 flex-shrink-0" />
                  <span>Register fresh personnel accounts into the central directory.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-info mt-1 flex-shrink-0" />
                  <span>Define and inject new high-level Research Areas.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-info mt-1 flex-shrink-0" />
                  <span>Deploy, alter, cancel, or structure Mission parameters.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Researcher Row Context */}
          <div className="col-md-6">
            <div className="role-profile-box border-researcher p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-primary text-white px-3 py-1 font-monospace">ROLE_RESEARCHER</span>
                <span className="text-muted small">// Field Operator</span>
              </div>
              <ul className="role-capabilities-list list-unstyled d-flex flex-column gap-2 text-muted small m-0 pt-2">
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-success mt-1 flex-shrink-0" />
                  <span>View authorized system dashboard views and tracking indices.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-success mt-1 flex-shrink-0" />
                  <span>Log dynamic telemetry samples, species counts, and data attachments.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={14} className="text-success mt-1 flex-shrink-0" />
                  <span>Safely maintain self-service contact points (Email, Institution) via profile panels.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}