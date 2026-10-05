/**
 * @typedef {Object} MediaCoordinates
 * @property {number} lat
 * @property {number} lng
 * @property {number} [altitude]
 */

/**
 * @typedef {Object} MediaAsset
 * @property {string} assetId - Unique Cloudinary public ID or identifier
 * @property {string} projectId - Project identifier linked to this asset
 * @property {string} locationId - Location identifier
 * @property {string} locationName - Descriptive name of the capture site
 * @property {string} activityId - Linked project activity
 * @property {string} activityName - Name of the activity documented
 * @property {string} url - Direct Cloudinary media URL
 * @property {string} thumbnailUrl - Optimized thumbnail URL via Cloudinary transforms
 * @property {string} resourceType - 'image' | 'video'
 * @property {number} width - Pixel width
 * @property {number} height - Pixel height
 * @property {number} bytes - File size in bytes
 * @property {string} captureDate - Date recorded by EXIF / field tablet
 * @property {string} uploadDate - Date ingested to media repository
 * @property {MediaCoordinates|null} coordinates - Geotag coordinates if available
 * @property {string[]} tags - Cloudinary tags applied
 * @property {string} source - Media provider ('Cloudinary')
 * @property {string} retrievedAt - ISO timestamp of query
 */

export const validateMediaAsset = (asset) => {
  if (!asset || !asset.assetId || !asset.url) {
    throw new Error('Invalid media asset: missing assetId or url');
  }
  return true;
};
