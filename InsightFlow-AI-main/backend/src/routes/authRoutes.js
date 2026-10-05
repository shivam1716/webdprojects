import { Router } from 'express'
import { login, register, getMe, logout, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/login', authLimiter, login)
router.post('/register', authLimiter, register)
router.get('/me', protect, getMe)
router.patch('/me', protect, updateProfile)
router.post('/logout', logout)

export default router
