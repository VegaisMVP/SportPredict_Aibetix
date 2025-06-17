import { Request, Response, NextFunction } from 'express';
import { redis } from '../index';
import { AuthenticatedRequest } from './auth';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

const LIMITS = {
  GUEST: 1,
  REGISTERED: 3,
  PREMIUM: Infinity,
  DESIGNER: Infinity,
};

export async function aiPredictLimit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let userType = 'GUEST';
  let userId = 'guest:' + (req.ip || 'unknown');

  if (req.user) {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (user) {
      userType = user.userType;
      userId = user.id;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const key = `ai_predict_limit:${userType}:${userId}:${today}`;
  const limit = LIMITS[userType as keyof typeof LIMITS];

  if (limit === Infinity) return next();

  const used = parseInt((await redis.get(key)) || '0', 10);
  if (used >= limit) {
    return res.status(429).json({ error: `Daily AI prediction limit reached (${limit} times). Please upgrade membership or try again tomorrow.` });
  }

  await redis.incr(key);
  await redis.expire(key, 60 * 60 * 24); // 24 hours expiration

  next();
} 