import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { prisma } from '../index'
import { logger } from '../utils/logger'

const router = Router()

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, username, password } = value

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role: 'USER',
        maxDailyViews: 3
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        dailyViews: true,
        maxDailyViews: true
      }
    })

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user
    })
  } catch (error) {
    logger.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, password } = value

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        role: true,
        dailyViews: true,
        maxDailyViews: true
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const { passwordHash, ...userWithoutPassword } = user

    res.json({
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        dailyViews: true,
        maxDailyViews: true
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    res.json(user)
  } catch (error) {
    logger.error('Get user error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router 