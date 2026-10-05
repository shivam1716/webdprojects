import { Router } from 'express'
import { getAnalysis, runAnalysis } from '../controllers/analysisController.js'
import { protect, checkProjectOwnership } from '../middleware/authMiddleware.js'
import { analysisLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/:projectId', protect, checkProjectOwnership, getAnalysis)
router.get('/:projectId', protect, checkProjectOwnership, getAnalysis)
router.post('/run', protect, analysisLimiter, checkProjectOwnership, runAnalysis)

export default router
