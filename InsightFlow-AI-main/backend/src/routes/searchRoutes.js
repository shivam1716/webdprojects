import { Router } from 'express'
import { globalSearch } from '../controllers/searchController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, globalSearch)

export default router
