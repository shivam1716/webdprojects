/**
 * Data Sources Configuration for PRAMAAN Platform
 * Configurable architecture allowing plugging in real public datasets and media services.
 */

export const DATA_SOURCES = {
  WORLD_BANK: {
    id: 'world_bank',
    key: 'WORLD_BANK',
    name: 'World Bank Projects API',
    shortName: 'World Bank API',
    tagline: 'Global Development Projects & Financing Registry',
    badgeColor: 'border-[#C8754A]/40 text-[#C8754A] bg-[#C8754A]/10',
    endpoint: '/api/worldbank',
    directEndpoint: 'https://search.worldbank.org/api/v2/projects',
    catalogUrl: 'https://datacatalog.worldbank.org/search/dataset/0037800/world-bank-projects-operations',
    status: 'connected',
    supportedEntities: ['projects', 'financing', 'sectors', 'country_records', 'documents'],
    limitations: 'Activity-level financial breakdown unavailable from top-level API unless specific sub-grant disclosure documents are processed.',
    attribution: 'World Bank Open Data (CC-BY 4.0)',
  },
  INDIA_DATA_GOV: {
    id: 'data_gov_in',
    key: 'INDIA_DATA_GOV',
    name: 'data.gov.in',
    shortName: 'data.gov.in',
    tagline: 'Open Government Data Platform India',
    badgeColor: 'border-[#D5A04B]/40 text-[#D5A04B] bg-[#D5A04B]/10',
    endpoint: 'https://api.data.gov.in/',
    catalogUrl: 'https://www.data.gov.in/',
    status: 'connected',
    supportedEntities: ['schemes', 'district_allocations', 'rural_works', 'state_metrics'],
    limitations: 'Schemes provide macro-level financial reports; visual media must be linked through designated field telemetry layers.',
    attribution: 'Government of India Open Data Policy (NDSAP)',
  },
  CLOUDINARY: {
    id: 'cloudinary',
    key: 'CLOUDINARY',
    name: 'Cloudinary Media Asset Layer',
    shortName: 'Cloudinary',
    tagline: 'Visual Field Media & Geotagged Evidence Repository',
    badgeColor: 'border-[#D77A8B]/40 text-[#D77A8B] bg-[#D77A8B]/10',
    endpoint: 'https://res.cloudinary.com',
    catalogUrl: 'https://cloudinary.com',
    status: 'connected', // Default to verified public environmental asset repository or user configured
    supportedEntities: ['images', 'videos', 'exif_metadata', 'gps_coordinates', 'transforms'],
    limitations: 'Only assets with authenticated or public signatures can be accessed. Missing credentials show explicit disconnected state.',
    attribution: 'Cloudinary Visual Intelligence Pipeline',
  }
};

export const getSourceDetails = (sourceKeyOrId) => {
  const normalized = (sourceKeyOrId || '').toLowerCase();
  if (normalized.includes('world bank') || normalized.includes('world_bank')) {
    return DATA_SOURCES.WORLD_BANK;
  }
  if (normalized.includes('data.gov') || normalized.includes('india') || normalized.includes('gov')) {
    return DATA_SOURCES.INDIA_DATA_GOV;
  }
  if (normalized.includes('cloudinary')) {
    return DATA_SOURCES.CLOUDINARY;
  }
  return {
    id: 'custom',
    name: sourceKeyOrId || 'External Data Source',
    shortName: sourceKeyOrId || 'Verified Source',
    tagline: 'External Audited Dataset',
    badgeColor: 'border-[#918A7D]/40 text-[#918A7D] bg-[#918A7D]/10',
    status: 'connected',
    attribution: 'Audited Public Data'
  };
};
