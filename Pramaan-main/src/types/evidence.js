/**
 * @typedef {Object} EvidenceObservation
 * @property {string} id - Observation unique ID
 * @property {string} projectId - Associated Project ID
 * @property {string} claim - Concise verifiable claim (e.g. "Riparian buffer re-vegetation documented")
 * @property {string} activityId - Associated activity
 * @property {string} locationId - Site code or location identifier
 * @property {string} locationName - Human-readable location
 * @property {import('./media').MediaAsset} beforeAsset - Verified baseline media asset
 * @property {import('./media').MediaAsset} afterAsset - Verified post-intervention media asset
 * @property {number} evidenceStrength - Computed evidence confidence (0-100) based on ground-truth coverage
 * @property {string[]} observations - List of specific visual markers detected
 * @property {string} analysisDate - Timestamp of analysis
 * @property {string} source - Origin of raw observation
 */

/**
 * @typedef {Object} EvidenceGap
 * @property {string} id - Gap identifier
 * @property {('missing_post_completion'|'missing_location_evidence'|'missing_recent_visit'|'insufficient_before_after')} gapType - Category of missing evidence
 * @property {string} title - Human readable gap title
 * @property {string} description - Explicit description of the missing proof
 * @property {('high'|'medium'|'low')} severity - Gap severity for audit readiness
 * @property {string} targetEntity - Activity or location affected
 * @property {string} requiredAction - Action needed to resolve gap (e.g. "Request field visit")
 */

export const validateEvidence = (item) => {
  if (!item || !item.id) {
    throw new Error('Invalid evidence entry');
  }
  return true;
};
