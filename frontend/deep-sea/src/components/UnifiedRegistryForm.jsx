import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Edit3, PlusCircle } from 'lucide-react';

export default function UnifiedRegistryForm({ 
  headline = "REGISTRY NODE OPERATION",
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

  function CustomMultiSelect({ field, value, onChange }) {

    const toggleOption = (optionId) => {

      const isSelected = value.includes(optionId);

      if (isSelected) {
        onChange(
          value.filter(id => id !== optionId)
        );
      } else {
        onChange([
          ...value,
          optionId
        ]);
      }
    };

    return (
      <div className="custom-multiselect-wrapper">

        <div className="custom-multiselect-list">

          {field.options && field.options.length > 0 ? (

            field.options.map(opt => {

              const optionId =
                typeof opt === 'object'
                  ? opt.id
                  : opt;

              const optionLabel =
                typeof opt === 'object'
                  ? opt.name
                  : opt;

              const isSelected =
                value.includes(optionId);

              return (

                <button
                  type="button"
                  key={optionId}
                  className={`custom-multiselect-option ${
                    isSelected
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    toggleOption(optionId)
                  }
                >

                  <span className="custom-option-checkbox">
                    {isSelected ? '✓' : ''}
                  </span>

                  <span>
                    {optionLabel}
                  </span>

                </button>

              );

            })

          ) : (

            <div className="text-muted text-center py-3">
              -- No active telemetry nodes detected --
            </div>

          )}

        </div>

        <small className="text-muted font-monospace d-block mt-1 ps-1">
          {value.length} item{value.length !== 1 ? 's' : ''} selected
        </small>

      </div>
    );
  }

  return (
    <div className="profile-drawer-backdrop" onClick={onClose}>
      <div className="profile-drawer-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Dynamic context header */}
        <div className="drawer-header d-flex justify-content-between align-items-start p-3">
          <h5 className="pt-2 mb-0 d-flex align-items-center">
            {isEditMode ? <Edit3 size={14} className="text-warning me-2" /> : <PlusCircle size={14} className="text-info me-2" />}
            {isEditMode ? `MODIFY ${headline}` : `INITIALIZE ${headline}`}
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

                    {/* Custom Multi-Select */}
                  {field.type === 'multiselect' && (
                      <CustomMultiSelect
                        field={field}
                        value={formData[field.name] || []}
                        onChange={(value) =>
                          handleInputChange(field.name, value)
                        }
                      />
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