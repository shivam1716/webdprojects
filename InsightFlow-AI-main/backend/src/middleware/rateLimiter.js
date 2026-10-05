import rateLimit from 'express-rate-limit'

// Helper function to standardize the 429 response payload
const createLimiter = (options) => rateLimit({
  ...options,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait before trying again.'
    })
  }
})

// Authentication
// Login/Signup: 5 requests per minute per IP
export const authLimiter = createLimiter({
  windowMs: 1 * 60 * 1000, 
  max: 5,
})

// Password reset: 3 requests every 15 minutes per IP
export const resetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
})

// Projects
// Create Project: 30 requests per hour
export const createProjectLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
})

// Delete Project: 20 requests per hour
export const deleteProjectLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
})

// Uploads
// Upload files: 20 uploads per hour
export const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
})

// Analysis
// Run Analysis: 5 requests every 10 minutes
export const analysisLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
})

// Reports
// Generate Report: 10 requests every 10 minutes
export const reportLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
})

// AI Chat
// Chat endpoint: 20 requests per minute
export const chatLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,
  max: 20,
})
