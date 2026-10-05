import { Router } from 'express'
import multer from 'multer'
import { uploadFiles, getUploads } from '../controllers/uploadController.js'
import { protect, checkProjectOwnership } from '../middleware/authMiddleware.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Basic multer setup with size limit and file type filtering
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, TXT, PDF, and DOCX are allowed.'));
    }
  }
})

router.post('/', protect, uploadLimiter, upload.array('files', 10), checkProjectOwnership, uploadFiles)
router.get('/:projectId', protect, checkProjectOwnership, getUploads)

export default router
