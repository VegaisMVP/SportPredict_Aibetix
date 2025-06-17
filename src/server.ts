import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import complianceRoutes from './complianceRoutes'

dotenv.config()

const app = express()
const port = process.env.PORT || 9000

export const prisma = new PrismaClient()

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  process.env.FRONTEND_URL
].filter(Boolean)

// Middleware
app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
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
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'LegalityCheck_KYC'
  })
})

// API routes
app.use('/api/compliance', complianceRoutes)

// 404 handling
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// Start service
async function startServer() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
    
    app.listen(port, () => {
      console.log(`LegalityCheck_KYC service running on port ${port}`)
      console.log(`Health check: http://localhost:${port}/health`)
      console.log(`API docs: http://localhost:${port}/api/compliance`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

startServer() 