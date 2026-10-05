/**
 * @typedef {Object} ProjectActivity
 * @property {string} id - Unique activity identifier
 * @property {string} name - Activity title
 * @property {number|null} allocatedAmount - Financial allocation if reported by source, null if unavailable
 * @property {string} status - In Progress, Completed, Planned
 * @property {number} mediaCount - Count of linked media records
 * @property {string} sector - Sector classification
 */

/**
 * @typedef {Object} ProjectLocation
 * @property {string} id - Location ID
 * @property {string} name - Location name (e.g., State/District/Zone)
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {number} fieldVisitsCount - Number of verified visits
 * @property {number} mediaCount - Media assets captured at this coordinate
 * @property {string|null} lastVisitDate - ISO date of last field visit
 * @property {number} evidenceScore - Computed score (0-100) based on verified observations
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Official project ID (e.g. P178253)
 * @property {string} title - Full project title
 * @property {string} country - Country name
 * @property {string} countryCode - ISO Country code
 * @property {number} commitmentAmount - Total financial commitment in USD/reporting currency
 * @property {string} currency - Currency code (e.g. USD)
 * @property {string} sector - Primary sector (e.g. Environment, Water, Agriculture)
 * @property {string[]} themes - Array of theme names
 * @property {string} status - Active, Closed, Pipeline
 * @property {string} approvalDate - Project approval date ISO string
 * @property {string} closingDate - Project closing date ISO string
 * @property {string} sourceUrl - Direct link to official repository
 * @property {Array} documents - Official project documents & reports
 * @property {ProjectActivity[]} activities - Documented project activities
 * @property {ProjectLocation[]} locations - Associated geo-coordinates
 * @property {string} dataSource - Data source identifier (e.g. 'World Bank Projects API', 'data.gov.in')
 * @property {string} retrievedAt - ISO timestamp of retrieval
 */

export const validateProject = (data) => {
  if (!data || !data.id || !data.title) {
    throw new Error('Invalid project: missing required id or title');
  }
  return true;
};
