import { Router } from 'express'
import { sendMessage, getMessages, clearMessages } from '../controllers/chatController.js'
import { protect, checkProjectOwnership } from '../middleware/authMiddleware.js'
import { chatLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/:projectId', protect, checkProjectOwnership, getMessages)
router.delete('/:projectId', protect, checkProjectOwnership, clearMessages)
router.post('/', protect, chatLimiter, checkProjectOwnership, sendMessage)

export default router
