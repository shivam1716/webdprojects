import { Router } from 'express'
import { getProjects, createProject, updateProject, deleteProject, getStats, getActivity } from '../controllers/projectController.js'
import { protect, checkProjectOwnership } from '../middleware/authMiddleware.js'
import { createProjectLimiter, deleteProjectLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/stats', protect, getStats)
router.get('/activity', protect, getActivity)
router.get('/', protect, getProjects)
router.post('/', protect, createProjectLimiter, createProject)
router.patch('/:projectId', protect, checkProjectOwnership, updateProject)
router.delete('/:projectId', protect, checkProjectOwnership, deleteProjectLimiter, deleteProject)

export default router
