import React, { useState, useEffect } from 'react';
import { Mail, Briefcase, Building2, UserCircle, Edit2, Zap, Target } from 'lucide-react';
import UnifiedEditModal from '../components/UnifiedEditModal';
import { apiService } from '../service/ApiService';

const FIELD_ICONS = {
  name: <UserCircle size={18} className="text-white-50" />,
  email: <Mail size={18} className="text-info" />,
  speacial: <Zap size={18} className="text-warning" />,
  institution: <Building2 size={18} className="text-success" />
};

export default function ProfilePage() {
  const [operatorData, setOperatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEditField, setActiveEditField] = useState({ key: '', label: '', value: '' });

  // Parse out localStorage safely to access native fields
  const getSessionUser = () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse session profile vector context.", e);
      return null;
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      const sessionUser = getSessionUser();

      console.log("SESSION USER =", sessionUser);
      
      if (!sessionUser) {
        setError('Authorization parameters are missing. Please sign in again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiService.fetchUserProfile();
        setOperatorData(data);
      } catch (err) {
        setError(err?.message || 'Failed to sync dossier parameters.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleOpenEditModal = (key, label, value) => {
    setActiveEditField({ key, label, value });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveEditField({ key: '', label: '', value: '' });
  };

  const handleSaveParameterUpdate = async (key, newValue) => {
    try {
      const updatedPayload = { 
        ...operatorData, 
        [key]: newValue 
      };
      
      const updatedData = await apiService.updateUserProfile(updatedPayload);
      
      setOperatorData(updatedData);
      handleCloseModal();
    } catch (err) {
      console.error("Profile synchronization breakdown:", err);
      alert(err?.message || "Dossier update execution fault.");
    }
};

  if (isLoading) {
    return (
      <div className="profile-viewport-root d-flex align-items-center justify-content-center p-5 font-monospace text-info">
        &gt; ESTABLISHING SECURE DATALINK MATRIX...
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-viewport-root d-flex align-items-center justify-content-center p-5 font-monospace text-danger">
        !! CRITICAL DOSSIER TELEMETRY SYNC ERROR: {error} !!
      </div>
    );
  }

  return (
    <div className="profile-viewport-root">
      
      <div className="glass-panel-card dossier-frame w-100 p-5 mb-5 position-relative">
        
        <div className="dossier-header d-flex justify-content-between align-items-center mb-5 pb-3">
          <div className="panel-header-segment">
            <h3 className="panel-main-title">Personal Operational Dossier</h3>
            <p className="panel-sub-label">
              <span className="text-success">{operatorData?.role || 'FIELD OPERATOR'}</span>
              <span className="text-muted mx-2">|</span>
              <span className="text-muted-dim font-monospace">SESSION INDEX: ACTIVE</span>
            </p>
          </div>
          <Target className="text-white-50 opacity-10" size={60} />
        </div>

        <div className="d-flex flex-column gap-3">
          
          {[
            { key: 'name', label: 'Operator Full Name', editable: false},
            { key: 'email', label: 'Email Address', editable: true },
            { key: 'speacial', label: 'Primary Specialization', editable: false },
            { key: 'institution', label: 'Institutions Assigned', editable: true }
          ].map((field) => {
            const currentValue = operatorData?.[field.key] || '';
            
            return (
              <div key={field.key} className="form-group-node profile-data-item w-100">
                <label className="form-label font-monospace text-muted small mb-1 d-block">
                  {field.label}
                </label>
                
                <div className={`dossier-parameter-view w-100 d-flex justify-content-between align-items-center ${field.editable ? 'editable-node' : 'disabled-node'}`}>
                  
                  <div className="d-flex align-items-center gap-3 w-100 text-truncate">
                    {FIELD_ICONS[field.key]}
                    <span className="parameter-value-text font-monospace text-white flex-grow-1 text-truncate">
                      {currentValue || 'N/A'}
                    </span>
                  </div>

                  {field.editable && (
                    <button 
                      type="button" 
                      className="btn-edit-operational-vector d-flex align-items-center justify-content-center p-2 rounded-circle"
                      onClick={() => handleOpenEditModal(field.key, field.label, currentValue)}
                    >
                      <Edit2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>

      {isModalOpen && (
        <UnifiedEditModal
          isOpen={isModalOpen}
          fieldLabel={activeEditField.label}
          currentValue={activeEditField.value}
          onClose={handleCloseModal}
          onSave={(newValue) => handleSaveParameterUpdate(activeEditField.key, newValue)}
        />
      )}

    </div>
  );
}