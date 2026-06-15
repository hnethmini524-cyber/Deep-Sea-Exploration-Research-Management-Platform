export const FORM_SCHEMAS = {
  MISSION: {
    title: "Mission Configuration",
    fields: [
      { name: 'name', label: 'Mission Name', type: 'text', placeholder: 'e.g., Abyss-Alpha-2026', required: true },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter telemetry deployment parameters...' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Planning', 'Active', 'Completed', 'Canceled'], required: true },
      { name: 'researchArea', label: 'Research Area', type: 'select', options: [] }, 
      { name: 'assignedResearchers', label: 'Assign Researchers', type: 'select', options: [] }, 
      { name: 'speciesObserved', label: 'Species Observed', type: 'multiselect', options: [] },
      { name: 'samplesCollected', label: 'Samples Collected', type: 'multiselect', options: [] },
      { name: 'image', label: 'Telemetry/Map Image Attachment', type: 'file' }
    ]
  },
  RESEARCHER: [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g., Dr. Arthur Vance', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'vance@deepsea.org', required: true },
    { name: 'speacial', label: 'Field Specialization', type: 'text', placeholder: 'e.g., Hydrothermal Dynamics', required: true },
    { name: 'role', label: 'Operational Role', type: 'text', placeholder: 'e.g., Lead Telemetry Analyst', required: true },
    { name: 'institution', label: 'Affiliated Institution Base', type: 'text', placeholder: 'e.g., UK Campus', required: true },
    { name: 'missionsArray', label: 'Assigned Missions Tracks', type: 'multiselect', options: [] }
  ],
  SPECIES: [
    { name: 'commonName', label: 'Common Name', type: 'text', placeholder: 'e.g., Ghost Shark', required: true },
    { name: 'scientificName', label: 'Scientific Name', type: 'text', placeholder: 'e.g., Chimaera monstrosa', required: true },
    { name: 'category', label: 'Category Classification', type: 'select', options: ['Benthos', 'Pelagic', 'Microbial', 'Anomalous'], required: true },
    { name: 'description', label: 'Biological Description', type: 'textarea' },
    { name: 'depth', label: 'Observed Depth Range (m)', type: 'number', placeholder: 'e.g., 3000' },
    { name: 'missionName', label: 'Discovery Mission Source', type: 'select', options: [] },
    { name: 'image', label: 'Specimen Capture Imagery', type: 'file' }
  ],
  SAMPLE: [
    { name: 'sampleId', label: 'Core Sample ID Signature', type: 'text', placeholder: 'e.g., SMP-77-A1', required: true },
    { name: 'type', label: 'Material Composition Type', type: 'text', placeholder: 'e.g., Basaltic Crust', required: true },
    { name: 'collectionDate', label: 'Extraction Timestamp', type: 'date', required: true },
    { name: 'depth', label: 'Extraction Depth Layer (m)', type: 'number', required: true },
    { name: 'missionName', label: 'Associated Mission Node', type: 'select', options: [] },
    { name: 'description', label: 'Status description', type: 'textarea' }
  ],
  AREA: [
    { name: 'name', label: 'Sector / Area Designation Name', type: 'text', placeholder: 'e.g., Mariana North Vent Sector', required: true },
    { name: 'region', label: 'Geographical Region Basin', type: 'text', placeholder: 'e.g., Western Pacific Ocean', required: true },
    { name: 'coordinates', label: 'Coordinate Vectors Matrix', type: 'text', placeholder: 'e.g., 11.3493° N, 142.1996° E', required: true },
    { name: 'description', label: 'Environmental Conditions Log', type: 'textarea' },
    { name: 'missionName', label: 'Active Operational Overlord Mission', type: 'select', options: [] },
    { name: 'speciesFound', label: 'Cataloged Native Species', type: 'multiselect', options: [] },
    { name: 'samplesCollected', label: 'Extracted Sample Ledgers', type: 'multiselect', options: [] }
  ]
};