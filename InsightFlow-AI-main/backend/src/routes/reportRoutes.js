import { Router } from 'express'
import { getReports, generateReport, deleteReport } from '../controllers/reportController.js'
import { protect } from '../middleware/authMiddleware.js'
import { reportLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/', protect, getReports)
router.get('/', protect, getReports)
router.post('/generate', protect, reportLimiter, generateReport)
router.delete('/:id', protect, deleteReport)

export default router
