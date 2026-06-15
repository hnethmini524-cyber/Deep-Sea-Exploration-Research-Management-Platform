import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function UnifiedEditModal({ isOpen, fieldLabel, currentValue, onClose, onSave }) {
  const [newValue, setNewValue] = useState(currentValue);

  useEffect(() => {
    setNewValue(currentValue);
  }, [currentValue]);

  if (!isOpen) return null;

  return (
    <div className="popup-modal-backdrop" onClick={onClose}>
      {/* Centered dialog card container */}
      <div className="popup-dialog-card p-4" onClick={(e) => e.stopPropagation()}>
        
        {/* Header block */}
        <div className="popup-modal-header d-flex justify-content-between align-items-center mb-4">
          <h5 className="modal-title-text font-monospace text-info m-0">
            &gt; OVERWRITE PARAMETER
          </h5>
          <button type="button" className="btn-popup-close d-flex align-items-center justify-content-center" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        {/* Input configuration field */}
        <div className="popup-modal-body mb-4">
          <div className="auth-input-group">
            <label className="auth-input-label font-monospace label-dim mb-2">
              Editing: <span className="text-white">{fieldLabel}</span>
            </label>
            <input
              type="text"
              className="auth-terminal-field text-field-glow w-100"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Actions */}
        <div className="popup-modal-actions d-flex justify-content-end gap-3">
          <button 
            type="button" 
            className="btn-popup-action btn-popup-cancel font-monospace"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            className="btn-popup-action btn-popup-commit font-monospace d-flex align-items-center gap-2"
            onClick={() => onSave(newValue)}
          >
            <Save size={14} />
            Edit
          </button>
        </div>

      </div>
    </div>
  );
}