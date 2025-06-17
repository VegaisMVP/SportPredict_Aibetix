import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
import { AuthenticatedRequest } from './auth';

const prisma = new PrismaClient();

export interface PermissionOptions {
  minType?: UserType;
  requirePremium?: boolean;
  requireStaked?: boolean;
  allowGuest?: boolean;
}

export function permission(options: PermissionOptions) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Guest user
    if (!req.user) {
      if (options.allowGuest) return next();
      return res.status(401).json({ error: 'Please login first' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(401).json({ error: 'User does not exist' });

    // User type level
    const typeOrder = [UserType.GUEST, UserType.REGISTERED, UserType.PREMIUM, UserType.DESIGNER];
    const userLevel = typeOrder.indexOf(user.userType as UserType);
    const minLevel = options.minType ? typeOrder.indexOf(options.minType) : 0;
    if (userLevel < minLevel) {
      return res.status(403).json({ error: 'Your account level is insufficient to access this feature' });
    }

    // Premium membership validation
    if (options.requirePremium && (!user.isPremium || (user.premiumExpireAt && user.premiumExpireAt < new Date()))) {
      return res.status(403).json({ error: 'Please upgrade to premium membership first' });
    }

    // Staking validation
    if (options.requireStaked && !user.hasStaked) {
      return res.status(403).json({ error: 'Please stake $VEGAIS first to unlock this feature' });
    }

    // Strategy designer identity validation
    if (options.minType === UserType.DESIGNER && !user.isDesigner) {
      return res.status(403).json({ error: 'Please complete staking and successfully publish a strategy first' });
    }

    next();
  };
} 