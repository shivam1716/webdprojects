import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler.js'

// Import Routes (To be created)
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import analysisRoutes from './routes/analysisRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import searchRoutes from './routes/searchRoutes.js'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InsightFlow AI Backend Running',
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/search', searchRoutes)

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' })
})

// Centralized Error Handler
app.use(errorHandler)

export default app
