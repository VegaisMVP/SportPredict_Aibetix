import { Router } from 'express'
import { prisma } from '../index'
import { logger } from '../utils/logger'
import { authenticateToken } from '../middleware/auth'
import { complianceMiddleware } from '../middleware/compliance'

const router = Router()

// Get ETF balance
router.get('/balance', async (req, res) => {
  try {
    const userId = (req as any).user.id

    let account = await prisma.eTFAccount.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!account) {
      // Create account if it doesn't exist
      account = await prisma.eTFAccount.create({
        data: {
          userId,
          allocation: {
            football: 30,
            basketball: 40,
            tennis: 20,
            other: 10
          }
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })
    }

    res.json(account)
  } catch (error) {
    logger.error('Get ETF balance error:', error)
    res.status(500).json({ error: 'Failed to fetch ETF balance' })
  }
})

// Deposit to ETF
router.post('/deposit', authenticateToken, complianceMiddleware('etf'), async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    // TODO: Integrate with Solana blockchain for actual deposit
    // This would involve calling the Vault contract

    let account = await prisma.eTFAccount.findUnique({
      where: { userId }
    })

    if (!account) {
      account = await prisma.eTFAccount.create({
        data: {
          userId,
          totalDeposited: amount,
          currentBalance: amount,
          allocation: {
            football: 30,
            basketball: 40,
            tennis: 20,
            other: 10
          }
        }
      })
    } else {
      account = await prisma.eTFAccount.update({
        where: { userId },
        data: {
          totalDeposited: account.totalDeposited + amount,
          currentBalance: account.currentBalance + amount
        }
      })
    }

    // Create transaction record
    const transaction = await prisma.eTFTransaction.create({
      data: {
        accountId: account.id,
        type: 'DEPOSIT',
        amount,
        status: 'COMPLETED'
      }
    })

    res.json({
      account,
      transaction
    })
  } catch (error) {
    logger.error('ETF deposit error:', error)
    res.status(500).json({ error: 'Failed to process deposit' })
  }
})

// Withdraw from ETF
router.post('/withdraw', authenticateToken, complianceMiddleware('etf'), async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const account = await prisma.eTFAccount.findUnique({
      where: { userId }
    })

    if (!account) {
      return res.status(404).json({ error: 'ETF account not found' })
    }

    if (account.currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // TODO: Check withdrawal cooldown period
    // TODO: Integrate with Solana blockchain for actual withdrawal

    const updatedAccount = await prisma.eTFAccount.update({
      where: { userId },
      data: {
        currentBalance: account.currentBalance - amount
      }
    })

    // Create transaction record
    const transaction = await prisma.eTFTransaction.create({
      data: {
        accountId: account.id,
        type: 'WITHDRAW',
        amount,
        status: 'COMPLETED'
      }
    })

    res.json({
      account: updatedAccount,
      transaction
    })
  } catch (error) {
    logger.error('ETF withdraw error:', error)
    res.status(500).json({ error: 'Failed to process withdrawal' })
  }
})

// Get transaction history
router.get('/history', async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const account = await prisma.eTFAccount.findUnique({
      where: { userId }
    })

    if (!account) {
      return res.json({
        transactions: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0
        }
      })
    }

    const transactions = await prisma.eTFTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.eTFTransaction.count({
      where: { accountId: account.id }
    })

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Get ETF history error:', error)
    res.status(500).json({ error: 'Failed to fetch transaction history' })
  }
})

// Get ETF performance
router.get('/performance', async (req, res) => {
  try {
    const userId = (req as any).user.id

    const account = await prisma.eTFAccount.findUnique({
      where: { userId }
    })

    if (!account) {
      return res.json({
        totalReturn: 0,
        dailyReturn: 0,
        weeklyReturn: 0,
        monthlyReturn: 0,
        allocation: {
          football: 30,
          basketball: 40,
          tennis: 20,
          other: 10
        }
      })
    }

    // Calculate returns
    const totalReturn = account.totalEarnings / account.totalDeposited * 100

    // TODO: Calculate time-based returns from historical data

    res.json({
      totalReturn,
      dailyReturn: account.dailyReturn,
      weeklyReturn: 0, // TODO: Calculate from historical data
      monthlyReturn: 0, // TODO: Calculate from historical data
      allocation: account.allocation
    })
  } catch (error) {
    logger.error('Get ETF performance error:', error)
    res.status(500).json({ error: 'Failed to fetch performance data' })
  }
})

// Get all ETFs with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      minReturn,
      maxRisk
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status) where.status = status;
    if (minReturn) {
      where.annualReturn = {
        gte: Number(minReturn)
      };
    }
    if (maxRisk) {
      where.riskLevel = {
        lte: Number(maxRisk)
      };
    }

    const etfs = await prisma.eTF.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        },
        _count: {
          select: { investments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.eTF.count({ where });

    res.json({
      etfs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get ETFs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ETF by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const etf = await prisma.eTF.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        },
        investments: {
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
          select: { investments: true }
        }
      }
    });

    if (!etf) {
      return res.status(404).json({ error: 'ETF not found' });
    }

    res.json({ etf });
  } catch (error) {
    console.error('Get ETF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new ETF
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const {
      name,
      description,
      strategy,
      riskLevel,
      minInvestment,
      maxInvestment,
      annualReturn,
      managementFee,
      performanceFee
    } = req.body;

    // Validate user can create ETFs
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.userType !== 'MANAGER') {
      return res.status(403).json({ error: 'Only managers can create ETFs' });
    }

    const etf = await prisma.eTF.create({
      data: {
        name,
        description,
        strategy,
        riskLevel,
        minInvestment,
        maxInvestment,
        annualReturn,
        managementFee,
        performanceFee,
        managerId: userId,
        status: 'ACTIVE',
        totalValue: 0,
        totalInvestors: 0,
        currentReturn: 0
      },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            userType: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'ETF created successfully',
      etf
    });
  } catch (error) {
    console.error('Create ETF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invest in ETF
router.post('/:id/invest', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { amount } = req.body;

    // Get ETF
    const etf = await prisma.eTF.findUnique({
      where: { id }
    });

    if (!etf) {
      return res.status(404).json({ error: 'ETF not found' });
    }

    if (etf.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'ETF is not accepting investments' });
    }

    // Validate investment amount
    if (amount < etf.minInvestment || amount > etf.maxInvestment) {
      return res.status(400).json({ 
        error: `Investment amount must be between ${etf.minInvestment} and ${etf.maxInvestment}` 
      });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check if user already has an investment
    const existingInvestment = await prisma.eTFInvestment.findFirst({
      where: {
        userId,
        etfId: id
      }
    });

    if (existingInvestment) {
      return res.status(400).json({ error: 'Already invested in this ETF' });
    }

    // Create investment
    const investment = await prisma.eTFInvestment.create({
      data: {
        userId,
        etfId: id,
        amount,
        shares: amount / etf.totalValue || 1, // Calculate shares based on current NAV
        status: 'ACTIVE'
      }
    });

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });

    // Update ETF total value and investor count
    await prisma.eTF.update({
      where: { id },
      data: {
        totalValue: { increment: amount },
        totalInvestors: { increment: 1 }
      }
    });

    res.status(201).json({
      message: 'Investment successful',
      investment
    });
  } catch (error) {
    console.error('Invest in ETF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redeem from ETF
router.post('/:id/redeem', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { shares } = req.body;

    // Get user's investment
    const investment = await prisma.eTFInvestment.findFirst({
      where: {
        userId,
        etfId: id
      },
      include: {
        etf: true
      }
    });

    if (!investment) {
      return res.status(404).json({ error: 'No investment found in this ETF' });
    }

    if (shares > investment.shares) {
      return res.status(400).json({ error: 'Insufficient shares to redeem' });
    }

    // Calculate redemption amount
    const redemptionAmount = (shares / investment.shares) * investment.amount;
    const newShares = investment.shares - shares;

    // Update investment
    if (newShares === 0) {
      // Full redemption
      await prisma.eTFInvestment.delete({
        where: { id: investment.id }
      });
    } else {
      // Partial redemption
      await prisma.eTFInvestment.update({
        where: { id: investment.id },
        data: {
          shares: newShares,
          amount: investment.amount - redemptionAmount
        }
      });
    }

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: redemptionAmount } }
    });

    // Update ETF total value and investor count
    const updateData: any = {
      totalValue: { decrement: redemptionAmount }
    };

    if (newShares === 0) {
      updateData.totalInvestors = { decrement: 1 };
    }

    await prisma.eTF.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Redemption successful',
      redemptionAmount,
      remainingShares: newShares
    });
  } catch (error) {
    console.error('Redeem from ETF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ETF performance
router.get('/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

    const etf = await prisma.eTF.findUnique({
      where: { id },
      include: {
        investments: {
          where: {
            createdAt: {
              gte: daysAgo
            }
          }
        }
      }
    });

    if (!etf) {
      return res.status(404).json({ error: 'ETF not found' });
    }

    const totalInvestments = etf.investments.length;
    const totalInvestmentAmount = etf.investments.reduce((sum, inv) => sum + inv.amount, 0);
    const averageInvestment = totalInvestments > 0 ? totalInvestmentAmount / totalInvestments : 0;

    // Calculate performance metrics
    const performance = {
      period: Number(period),
      totalValue: etf.totalValue,
      totalInvestors: etf.totalInvestors,
      currentReturn: etf.currentReturn,
      annualReturn: etf.annualReturn,
      totalInvestments,
      totalInvestmentAmount,
      averageInvestment
    };

    res.json(performance);
  } catch (error) {
    console.error('Get ETF performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's ETF investments
router.get('/my/investments', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const investments = await prisma.eTFInvestment.findMany({
      where: { userId },
      include: {
        etf: {
          select: {
            id: true,
            name: true,
            description: true,
            currentReturn: true,
            annualReturn: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalValue = investments.reduce((sum, inv) => {
      const etfReturn = inv.etf.currentReturn / 100;
      return sum + (inv.amount * (1 + etfReturn));
    }, 0);

    res.json({
      investments,
      totalInvested,
      totalValue,
      totalReturn: totalValue - totalInvested
    });
  } catch (error) {
    console.error('Get user ETF investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's ETF holdings (for ETF frontend)
router.get('/holdings', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const investments = await prisma.eTFInvestment.findMany({
      where: { userId },
      include: {
        etf: {
          select: {
            id: true,
            name: true,
            description: true,
            currentReturn: true,
            annualReturn: true,
            totalValue: true,
            totalInvestors: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalValue = investments.reduce((sum, inv) => {
      const etfReturn = inv.etf.currentReturn / 100;
      return sum + (inv.amount * (1 + etfReturn));
    }, 0);

    res.json({
      holdings: investments,
      summary: {
        totalInvested,
        totalValue,
        totalReturn: totalValue - totalInvested,
        totalReturnPercentage: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0
      }
    });
  } catch (error) {
    logger.error('Get ETF holdings error:', error);
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

// Get ETF transactions (for ETF frontend)
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const account = await prisma.eTFAccount.findUnique({
      where: { userId }
    });

    if (!account) {
      return res.json({
        transactions: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0
        }
      });
    }

    const transactions = await prisma.eTFTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.eTFTransaction.count({
      where: { accountId: account.id }
    });

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get ETF transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Buy ETF shares (for ETF frontend)
router.post('/:id/buy', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get ETF
    const etf = await prisma.eTF.findUnique({
      where: { id }
    });

    if (!etf) {
      return res.status(404).json({ error: 'ETF not found' });
    }

    if (etf.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'ETF is not accepting investments' });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check if user already has an investment
    let investment = await prisma.eTFInvestment.findFirst({
      where: {
        userId,
        etfId: id
      }
    });

    if (investment) {
      // Update existing investment
      investment = await prisma.eTFInvestment.update({
        where: { id: investment.id },
        data: {
          amount: investment.amount + amount,
          shares: investment.shares + (amount / etf.totalValue || 1)
        }
      });
    } else {
      // Create new investment
      investment = await prisma.eTFInvestment.create({
        data: {
          userId,
          etfId: id,
          amount,
          shares: amount / etf.totalValue || 1,
          status: 'ACTIVE'
        }
      });

      // Update ETF investor count
      await prisma.eTF.update({
        where: { id },
        data: {
          totalInvestors: { increment: 1 }
        }
      });
    }

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });

    // Update ETF total value
    await prisma.eTF.update({
      where: { id },
      data: {
        totalValue: { increment: amount }
      }
    });

    res.json({
      message: 'ETF purchase successful',
      investment
    });
  } catch (error) {
    logger.error('Buy ETF error:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

// Sell ETF shares (for ETF frontend)
router.post('/:id/sell', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get user's investment
    const investment = await prisma.eTFInvestment.findFirst({
      where: {
        userId,
        etfId: id
      },
      include: {
        etf: true
      }
    });

    if (!investment) {
      return res.status(404).json({ error: 'No investment found in this ETF' });
    }

    if (amount > investment.amount) {
      return res.status(400).json({ error: 'Insufficient shares to sell' });
    }

    // Calculate shares to sell
    const sharesToSell = (amount / investment.amount) * investment.shares;
    const newAmount = investment.amount - amount;
    const newShares = investment.shares - sharesToSell;

    if (newShares === 0) {
      // Full sale
      await prisma.eTFInvestment.delete({
        where: { id: investment.id }
      });

      // Update ETF investor count
      await prisma.eTF.update({
        where: { id },
        data: {
          totalInvestors: { decrement: 1 }
        }
      });
    } else {
      // Partial sale
      await prisma.eTFInvestment.update({
        where: { id: investment.id },
        data: {
          shares: newShares,
          amount: newAmount
        }
      });
    }

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } }
    });

    // Update ETF total value
    await prisma.eTF.update({
      where: { id },
      data: {
        totalValue: { decrement: amount }
      }
    });

    res.json({
      message: 'ETF sale successful',
      soldAmount: amount,
      remainingAmount: newAmount,
      remainingShares: newShares
    });
  } catch (error) {
    logger.error('Sell ETF error:', error);
    res.status(500).json({ error: 'Failed to process sale' });
  }
});

// Get ETF history data (for ETF frontend)
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

    const etf = await prisma.eTF.findUnique({
      where: { id }
    });

    if (!etf) {
      return res.status(404).json({ error: 'ETF not found' });
    }

    // Get historical data (mock data for now)
    const history = [];
    const baseValue = etf.totalValue;
    const baseReturn = etf.currentReturn;

    for (let i = Number(period); i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate daily fluctuations
      const dailyChange = (Math.random() - 0.5) * 0.02; // ±1% daily change
      const value = baseValue * (1 + dailyChange);
      const returnRate = baseReturn + (dailyChange * 100);

      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
        return: Math.round(returnRate * 100) / 100
      });
    }

    res.json({
      etfId: id,
      period: Number(period),
      history
    });
  } catch (error) {
    logger.error('Get ETF history error:', error);
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
});

export default router 