/**
 * Checks if a line segment intersects with a circle.
 * 
 * @param {number} startX - Line start X
 * @param {number} startY - Line start Y
 * @param {number} endX - Line end X
 * @param {number} endY - Line end Y
 * @param {number} circleX - Circle center X
 * @param {number} circleY - Circle center Y
 * @param {number} radius - Circle radius
 * @returns {boolean} True if intersecting
 */
export function lineIntersectsCircle(startX, startY, endX, endY, circleX, circleY, radius) {
  const dx = endX - startX;
  const dy = endY - startY;
  
  // Calculate the length of the line segment
  const lengthSquared = dx * dx + dy * dy;
  
  // If line is just a point, do a point-circle collision
  if (lengthSquared === 0) {
    const distToPoint = Math.sqrt(Math.pow(circleX - startX, 2) + Math.pow(circleY - startY, 2));
    return distToPoint <= radius;
  }
  
  // Calculate the projection of the circle center onto the line
  let t = ((circleX - startX) * dx + (circleY - startY) * dy) / lengthSquared;
  
  // Constrain t to the segment [0, 1]
  t = Math.max(0, Math.min(1, t));
  
  // Find the closest point on the segment to the circle center
  const closestX = startX + t * dx;
  const closestY = startY + t * dy;
  
  // Calculate the distance from the closest point to the circle center
  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  
  return distanceSquared <= radius * radius;
}
