import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { createClient } from 'redis'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import { authMiddleware } from './middleware/auth'

// Routes
import authRoutes from './routes/auth'
import matchRoutes from './routes/matches'
import strategyRoutes from './routes/strategies'
import etfRoutes from './routes/etf'
import userRoutes from './routes/users'
import aiRoutes from './routes/ai'
import aiChatRoutes from './routes/ai-chat'
import walletRoutes from './routes/wallet'
import complianceRoutes from './routes/compliance'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Database and Redis clients
export const prisma = new PrismaClient()
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

// CORS configuration for multiple frontend applications
const allowedOrigins = [
  'http://localhost:3000',  // Original frontend
  'http://localhost:3001',  // Sports Predict
  'http://localhost:3002',  // Sportsbook
  'http://localhost:3003',  // ETF
  process.env.FRONTEND_URL
].filter(Boolean)

// Middleware
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(compression())
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use(rateLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/matches', matchRoutes) // Public access for viewing matches
app.use('/api/strategies', strategyRoutes) // Public access for viewing strategies
app.use('/api/etf', etfRoutes) // Public access for viewing ETFs
app.use('/api/users', userRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/ai-chat', aiChatRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/compliance', complianceRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
async function startServer() {
  try {
    await redis.connect()
    await prisma.$connect()
    
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`)
      logger.info(`CORS enabled for origins: ${allowedOrigins.join(', ')}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  await redis.quit()
  process.exit(0)
})

startServer() 