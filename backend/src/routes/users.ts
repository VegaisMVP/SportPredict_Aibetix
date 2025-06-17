import { Router } from 'express'
import { prisma } from '../index'
import { logger } from '../utils/logger'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const prismaClient = new PrismaClient()

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body

    // Check if user already exists
    const existingUser = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { walletAddress }
        ]
      }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        walletAddress,
        userType: 'REGULAR',
        balance: 0,
        isActive: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        userType: user.userType,
        balance: user.balance
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        userType: user.userType,
        balance: user.balance
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        walletAddress: true,
        userType: true,
        balance: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = (req as any).user.id

    // Get user's betting statistics
    const executions = await prisma.execution.findMany({
      where: { userId },
      include: {
        strategy: true,
        match: true
      }
    })

    const totalBets = executions.length
    const wins = executions.filter(e => e.result === 'WIN').length
    const totalProfit = executions.reduce((sum, e) => sum + (e.profit || 0), 0)
    const hitRate = totalBets > 0 ? (wins / totalBets) * 100 : 0

    // Get user's strategy statistics
    const strategies = await prisma.strategy.findMany({
      where: { creatorId: userId }
    })

    const totalStrategies = strategies.length
    const activeStrategies = strategies.filter(s => s.status === 'ACTIVE').length
    const totalAdoptions = strategies.reduce((sum, s) => sum + s.adoptions, 0)

    // Get ETF statistics if user has an account
    const etfAccount = await prisma.eTFAccount.findUnique({
      where: { userId }
    })

    res.json({
      betting: {
        totalBets,
        wins,
        totalProfit,
        hitRate
      },
      strategies: {
        total: totalStrategies,
        active: activeStrategies,
        totalAdoptions
      },
      etf: etfAccount ? {
        totalDeposited: etfAccount.totalDeposited,
        currentBalance: etfAccount.currentBalance,
        totalEarnings: etfAccount.totalEarnings,
        dailyReturn: etfAccount.dailyReturn
      } : null
    })
  } catch (error) {
    logger.error('Get user stats error:', error)
    res.status(500).json({ error: 'Failed to fetch user statistics' })
  }
})

// Get user's execution history
router.get('/executions', async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const executions = await prisma.execution.findMany({
      where: { userId },
      include: {
        strategy: true,
        match: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.execution.count({
      where: { userId }
    })

    res.json({
      executions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Get user executions error:', error)
    res.status(500).json({ error: 'Failed to fetch execution history' })
  }
})

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { username, email, walletAddress } = req.body

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        walletAddress
      },
      select: {
        id: true,
        username: true,
        email: true,
        walletAddress: true,
        userType: true,
        balance: true,
        isActive: true,
        updatedAt: true
      }
    })

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Reset daily views (for testing)
router.post('/reset-views', async (req, res) => {
  try {
    const userId = (req as any).user.id

    await prisma.user.update({
      where: { id: userId },
      data: { dailyViews: 0 }
    })

    res.json({ message: 'Daily views reset successfully' })
  } catch (error) {
    logger.error('Reset views error:', error)
    res.status(500).json({ error: 'Failed to reset views' })
  }
})

// Get user balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ balance: user.balance })
  } catch (error) {
    console.error('Get balance error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user betting history
router.get('/betting-history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { page = 1, limit = 10 } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    const bets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.bet.count({
      where: { userId }
    })

    res.json({
      bets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get betting history error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 