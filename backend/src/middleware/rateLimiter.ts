import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { redis } from '../index'

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'middleware',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
})

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.'
    })
  }
} 