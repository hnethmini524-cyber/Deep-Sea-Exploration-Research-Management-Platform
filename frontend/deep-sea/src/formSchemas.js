export const FORM_SCHEMAS = {
  MISSION: {
    title: "Mission Configuration",
    fields: [
      { name: 'codeName', label: 'Mission Name', type: 'text', placeholder: 'e.g., Abyss-Alpha-2026', required: true },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter telemetry deployment parameters...' },
      { name: 'launchDate', label: 'Start Date', type: 'date', required: true },
      { name: 'completionDate', label: 'End Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Planning', 'Active', 'Completed', 'Canceled'], required: true },
      { name: 'researchAreaId', label: 'Research Area', type: 'select', options: [] }, 
      { name: 'leadResearcherId', label: 'Assign Researchers', type: 'select', options: [] }, 
      { name: 'speciesIds', label: 'Species Observed', type: 'multiselect', options: [] },
      { name: 'sampleIds', label: 'Samples Collected', type: 'multiselect', options: [] },
      { name: 'imageUrl', label: 'Telemetry/Map Image Attachment', type: 'file' }
    ]
  },
  RESEARCHER: [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g., Dr. Arthur Vance', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'vance@deepsea.org', required: true },
    { name: 'speacial', label: 'Field Specialization', type: 'text', placeholder: 'e.g., Hydrothermal Dynamics', required: true },
    { name: 'role', label: 'Operational Role', type: 'text', placeholder: 'e.g., Lead Telemetry Analyst', required: true },
    { name: 'institution', label: 'Affiliated Institution Base', type: 'text', placeholder: 'e.g., UK Campus', required: true }
  ],
  SPECIES: [
    { name: 'commonName', label: 'Common Name', type: 'text', placeholder: 'e.g., Ghost Shark', required: true },
    { name: 'scientificName', label: 'Scientific Name', type: 'text', placeholder: 'e.g., Chimaera monstrosa', required: true },
    { name: 'category', label: 'Category Classification', type: 'text', placeholder: 'e.g., Chimaera monstrosa', required: true },
    { name: 'description', label: 'Biological Description', type: 'textarea' },
    { name: 'depth', label: 'Observed Depth Range (m)', type: 'number', placeholder: 'e.g., 3000' },
    { name: 'imageUrl', label: 'Specimen Capture Imagery', type: 'file' },
    { name: 'observations', label: 'Biological observations', type: 'textarea' }
  ],
  SAMPLE: [
    { name: 'sampleCode', label: 'Common Name', type: 'text', placeholder: 'e.g., SAMP-2026-0042', required: true },
    { name: 'type', label: 'Material Composition Type', type: 'select', options: ['GEOLOGICAL', 'CHEMICAL', 'ARTIFACT'], required: true },
    { name: 'collectionDate', label: 'Extraction Timestamp', type: 'date', required: true },
    { name: 'depth', label: 'Extraction Depth Layer (m)', type: 'number', required: true },
    { name: 'description', label: 'Status description', type: 'textarea' },
    { name: 'imageUrl', label: 'Specimen Capture Imagery', type: 'file' }
  ],
  AREA: [
    { name: 'areaName', label: 'Sector / Area Designation Name', type: 'text', placeholder: 'e.g., Mariana North Vent Sector', required: true },
    { name: 'region', label: 'Geographical Region Basin', type: 'text', placeholder: 'e.g., Western Pacific Ocean', required: true },
    { name: 'latitude', label: 'Coordinate latitude Matrix', type: 'number', placeholder: 'e.g., 11.3493° N', required: true },
    { name: 'longitude', label: 'Coordinate longitude Matrix', type: 'number', placeholder: 'e.g., 142.1996° E', required: true },
    { name: 'description', label: 'Environmental Conditions Log', type: 'textarea' },
    { name: 'imageUrl', label: 'Area Capture Imagery', type: 'file' }
  ]
};