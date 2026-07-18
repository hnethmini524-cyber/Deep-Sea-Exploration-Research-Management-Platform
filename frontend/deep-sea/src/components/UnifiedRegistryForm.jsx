import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Edit3, PlusCircle } from 'lucide-react';

export default function UnifiedRegistryForm({ 
  headline = "REGISTRY_NODE_OPERATION",
  schema = [], 
  initialData = null, 
  onClose, 
  onSubmit 
}) {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({});
  const fieldsArray = Array.isArray(schema) ? schema : schema?.fields || [];

  // Synchronize layout fields
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults = {};
      fieldsArray.forEach(field => {
        defaults[field.name] = field.type === 'multiselect' ? [] : '';
      });
      setFormData(defaults);
    }
  }, [fieldsArray, initialData]);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="profile-drawer-backdrop" onClick={onClose}>
      <div className="profile-drawer-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Dynamic context header */}
        <div className="drawer-header d-flex justify-content-between align-items-center">
          <h5>
            {isEditMode ? <Edit3 size={14} className="text-warning me-2" /> : <PlusCircle size={14} className="text-info me-2" />}
            {isEditMode ? `MODIFY_${headline}` : `INITIALIZE_${headline}`}
          </h5>
          <button type="button" className="btn-close-dossier" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        {/* Render engine */}
        <form className="drawer-body-profile p-4" onSubmit={handleFormSubmit}>
          <div className="d-flex flex-column gap-3">
            {fieldsArray.map((field) => {
              return (
                <div key={field.name} className="form-group-node mb-3">
                  <label className="form-label font-monospace text-white small mb-1 text-white">
                    {field.label} {field.required && <span className="text-danger">*</span>}
                  </label>

                  {/* Textarea rendering blocks */}
                  {field.type === 'textarea' && (
                    <textarea
                      className="registry-search-field w-100"
                      style={{ height: '80px', resize: 'none' }}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}

                  {/* Select box blocks */}
                  {field.type === 'select' && (
                    <select
                      className="registry-search-field w-100 form-select bg-dark text-white"
                      value={formData[field.name] || ''}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    >
                      <option value="">-- SELECT PARAMETER (OPTIONAL) --</option>
                      {field.options.map(opt => {
                        // Check if options are objects containing structured payload keys (e.g., id and name)
                        const optionId = typeof opt === 'object' ? opt.id : opt;
                        const optionLabel = typeof opt === 'object' ? opt.name : opt;
                        
                        return (
                          <option key={optionId} value={optionId}>
                            {optionLabel}
                          </option>
                        );
                      })}
                    </select>
                  )}

                  {/* File attachment */}
                  {field.type === 'file' && (
                    <div className="custom-file-upload-wrapper position-relative">
                      <label className="btn-mission-cell-trigger w-100 justify-content-center py-2 font-monospace" style={{ cursor: 'pointer' }}>
                        <Upload size={14} className="me-2" /> 
                        {formData[field.name] ? 'Replace Selected Media Asset' : 'Upload Image File'}
                        <input 
                          type="file" 
                          className="d-none" 
                          accept="image/*" // Restricts input nodes to valid media files only
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleInputChange(field.name, e.target.files[0]);
                            }
                          }} 
                        />
                      </label>
                      
                      {formData[field.name] && (
                        <div className="text-success text-center small font-monospace mt-1">
                          ✓ {typeof formData[field.name] === 'string' 
                              ? "Current_Stored_Asset_URL" 
                              : (formData[field.name]?.name || "Attached_Asset_Stream")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multiselect blocks */}
                  {field.type === 'multiselect' && (
                    <div className="multiselect-group-wrapper position-relative">
                      <select
                        multiple
                        className="registry-search-field w-100 form-select bg-dark text-white"
                        
                        value={formData[field.name] || []}
                        required={field.required}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                          handleInputChange(field.name, selectedOptions);
                        }}
                      >
                        {field.options && field.options.length > 0 ? (
                          field.options.map(opt => {
                            const optionId = typeof opt === "object" ? opt.id : opt;
                            const optionLabel = typeof opt === "object" ? opt.name : opt;

                            return (
                              <option key={optionId} value={optionId}>
                                {optionLabel}
                              </option>
                            );
                          })
                        ) : (
                          <option disabled className="text-muted italic small text-center pt-4">
                            -- No active telemetry nodes detected --
                          </option>
                        )}
                      </select>
                      <small className="text-muted font-monospace d-block mt-1 ps-1" style={{ fontSize: '10px', opacity: 0.6 }}>
                        * Hold Ctrl (or Cmd) to isolate multiple items.
                      </small>
                    </div>
                  )}

                  {['text', 'email', 'date', 'number'].includes(field.type) && (
                    <input
                      type={field.type}
                      className="registry-search-field w-100"
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <button type="submit" className="btn-add-action-node w-100 mt-4 py-2 font-monospace fw-bold d-flex align-items-center justify-content-center gap-2">
            <Save size={16} />
            {isEditMode ? 'Commit Operations Overwrites' : 'Deploy Records to Core System'}
          </button>
        </form>

      </div>
    </div>
  );
}