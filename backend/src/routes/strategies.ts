import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { requireRole, authenticateToken } from '../middleware/auth'
import { complianceMiddleware } from '../middleware/compliance'

const router = Router()
const prisma = new PrismaClient()

// Get all strategies with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      creatorId,
      minSuccessRate,
      maxRisk
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}

    if (status) where.status = status
    if (creatorId) where.creatorId = creatorId
    if (minSuccessRate) {
      where.successRate = {
        gte: Number(minSuccessRate)
      }
    }
    if (maxRisk) {
      where.riskLevel = {
        lte: Number(maxRisk)
      }
    }

    const strategies = await prisma.strategy.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        },
        _count: {
          select: { executions: true, followers: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.strategy.count({ where })

    res.json({
      strategies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Get strategies error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get strategy by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const strategy = await prisma.strategy.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        },
        executions: {
          include: {
            match: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        followers: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { executions: true, followers: true }
        }
      }
    })

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' })
    }

    res.json({ strategy })
  } catch (error) {
    logger.error('Get strategy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new strategy
router.post('/', authenticateToken, complianceMiddleware('sportsbook'), async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const {
      name,
      description,
      rules,
      riskLevel,
      minBetAmount,
      maxBetAmount,
      targetSuccessRate,
      isPublic
    } = req.body

    // Validate user can create strategies
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user?.userType === 'REGULAR') {
      return res.status(403).json({ error: 'Premium users can only create strategies' })
    }

    const strategy = await prisma.strategy.create({
      data: {
        name,
        description,
        rules,
        riskLevel,
        minBetAmount,
        maxBetAmount,
        targetSuccessRate,
        isPublic,
        creatorId: userId,
        status: 'ACTIVE',
        successRate: 0,
        totalExecutions: 0,
        successfulExecutions: 0
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Strategy created successfully',
      strategy
    })
  } catch (error) {
    logger.error('Create strategy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update strategy
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId
    const updateData = req.body

    // Check if user owns the strategy
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      select: { creatorId: true }
    })

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' })
    }

    if (strategy.creatorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this strategy' })
    }

    const updatedStrategy = await prisma.strategy.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        }
      }
    })

    res.json({
      message: 'Strategy updated successfully',
      strategy: updatedStrategy
    })
  } catch (error) {
    logger.error('Update strategy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Follow/Unfollow strategy
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    // Check if already following
    const existingFollow = await prisma.strategyFollower.findUnique({
      where: {
        userId_strategyId: {
          userId,
          strategyId: id
        }
      }
    })

    if (existingFollow) {
      // Unfollow
      await prisma.strategyFollower.delete({
        where: {
          userId_strategyId: {
            userId,
            strategyId: id
          }
        }
      })

      res.json({ message: 'Strategy unfollowed successfully' })
    } else {
      // Follow
      await prisma.strategyFollower.create({
        data: {
          userId,
          strategyId: id
        }
      })

      res.json({ message: 'Strategy followed successfully' })
    }
  } catch (error) {
    logger.error('Follow strategy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Execute strategy
router.post('/:id/execute', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId
    const { matchId, betAmount } = req.body

    // Get strategy
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      include: { rules: true }
    })

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' })
    }

    // Check if user is following the strategy
    const isFollowing = await prisma.strategyFollower.findUnique({
      where: {
        userId_strategyId: {
          userId,
          strategyId: id
        }
      }
    })

    if (!isFollowing) {
      return res.status(403).json({ error: 'Must follow strategy to execute' })
    }

    // Validate bet amount
    if (betAmount < strategy.minBetAmount || betAmount > strategy.maxBetAmount) {
      return res.status(400).json({ 
        error: `Bet amount must be between ${strategy.minBetAmount} and ${strategy.maxBetAmount}` 
      })
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    })

    if (!user || user.balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Create strategy execution
    const execution = await prisma.strategyExecution.create({
      data: {
        strategyId: id,
        userId,
        matchId,
        betAmount,
        status: 'PENDING'
      }
    })

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: betAmount } }
    })

    res.status(201).json({
      message: 'Strategy executed successfully',
      execution
    })
  } catch (error) {
    logger.error('Execute strategy error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get strategy performance
router.get('/:id/performance', async (req, res) => {
  try {
    const { id } = req.params
    const { period = '30' } = req.query

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - Number(period))

    const executions = await prisma.strategyExecution.findMany({
      where: {
        strategyId: id,
        createdAt: {
          gte: daysAgo
        }
      },
      include: {
        match: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => e.status === 'WON').length
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0

    const totalBetAmount = executions.reduce((sum, e) => sum + e.betAmount, 0)
    const totalWinnings = executions
      .filter(e => e.status === 'WON')
      .reduce((sum, e) => sum + (e.winnings || 0), 0)

    const roi = totalBetAmount > 0 ? ((totalWinnings - totalBetAmount) / totalBetAmount) * 100 : 0

    res.json({
      period: Number(period),
      totalExecutions,
      successfulExecutions,
      successRate,
      totalBetAmount,
      totalWinnings,
      roi,
      executions
    })
  } catch (error) {
    logger.error('Get strategy performance error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user's followed strategies (for Sportsbook frontend)
router.get('/my/following', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const followedStrategies = await prisma.strategyFollower.findMany({
      where: { userId },
      include: {
        strategy: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                userType: true
              }
            },
            _count: {
              select: { executions: true, followers: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.strategyFollower.count({
      where: { userId }
    });

    res.json({
      followedStrategies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get followed strategies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's created strategies (for Sportsbook frontend)
router.get('/my/created', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const strategies = await prisma.strategy.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        },
        _count: {
          select: { executions: true, followers: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.strategy.count({
      where: { creatorId: userId }
    });

    res.json({
      strategies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get created strategies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get strategy statistics (for Sportsbook frontend)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStrategies = await prisma.strategy.count({
      where: { status: 'ACTIVE' }
    });

    const totalFollowers = await prisma.strategyFollower.count();

    const totalExecutions = await prisma.strategyExecution.count();

    const successfulExecutions = await prisma.strategyExecution.count({
      where: { status: 'WON' }
    });

    const avgSuccessRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    res.json({
      totalStrategies,
      totalFollowers,
      totalExecutions,
      successfulExecutions,
      avgSuccessRate: Math.round(avgSuccessRate * 100) / 100
    });
  } catch (error) {
    logger.error('Get strategy stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's betting statistics (for Sportsbook frontend)
router.get('/my/betting-stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    // Get all user's bets (from strategy executions and direct bets)
    const strategyBets = await prisma.strategyExecution.findMany({
      where: { userId },
      include: {
        strategy: true,
        match: true
      }
    });

    const directBets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: true
      }
    });

    const allBets = [...strategyBets, ...directBets];

    const totalBets = allBets.length;
    const totalBetAmount = allBets.reduce((sum, bet) => sum + bet.betAmount, 0);
    const wonBets = allBets.filter(bet => bet.status === 'WON').length;
    const successRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;

    const totalWinnings = allBets
      .filter(bet => bet.status === 'WON')
      .reduce((sum, bet) => sum + (bet.winnings || 0), 0);

    const totalProfit = totalWinnings - totalBetAmount;

    res.json({
      totalBets,
      totalBetAmount,
      wonBets,
      successRate: Math.round(successRate * 100) / 100,
      totalWinnings,
      totalProfit
    });
  } catch (error) {
    logger.error('Get betting stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's betting history (for Sportsbook frontend)
router.get('/my/betting-history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    if (status) where.status = status;

    // Get strategy executions
    const strategyBets = await prisma.strategyExecution.findMany({
      where,
      include: {
        strategy: {
          select: {
            id: true,
            name: true
          }
        },
        match: {
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            league: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    // Get direct bets
    const directBets = await prisma.bet.findMany({
      where,
      include: {
        match: {
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            league: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    // Combine and sort by date
    const allBets = [...strategyBets, ...directBets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, Number(limit));

    const total = await prisma.strategyExecution.count({ where }) + 
                  await prisma.bet.count({ where });

    res.json({
      bets: allBets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get betting history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router 