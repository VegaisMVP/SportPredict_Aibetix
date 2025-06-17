import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { requireRole, authenticateToken } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all matches with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sport,
      league,
      date
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}

    if (status) where.status = status
    if (sport) where.sport = sport
    if (league) where.league = league
    if (date) {
      const startDate = new Date(date as string)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.startTime = {
        gte: startDate,
        lt: endDate
      }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        odds: true,
        _count: {
          select: { bets: true }
        }
      },
      orderBy: { startTime: 'asc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.match.count({ where })

    res.json({
      matches,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Get matches error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        odds: true,
        bets: {
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
          select: { bets: true }
        }
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    res.json({ match })
  } catch (error) {
    logger.error('Get match error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Place a bet
router.post('/:id/bet', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId
    const { amount, oddsId, prediction } = req.body

    // Validate match exists and is open for betting
    const match = await prisma.match.findUnique({
      where: { id },
      include: { odds: true }
    })

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    if (match.status !== 'UPCOMING') {
      return res.status(400).json({ error: 'Betting is closed for this match' })
    }

    // Validate odds
    const selectedOdds = match.odds.find(odd => odd.id === oddsId)
    if (!selectedOdds) {
      return res.status(400).json({ error: 'Invalid odds selection' })
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    })

    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Create bet
    const bet = await prisma.bet.create({
      data: {
        userId,
        matchId: id,
        oddsId,
        amount,
        prediction,
        status: 'PENDING',
        potentialWinnings: amount * selectedOdds.value
      }
    })

    // Audit log
    logger.audit('bet_placed', { userId, matchId: id, oddsId, amount, prediction, betId: bet.id })

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    })

    res.status(201).json({
      message: 'Bet placed successfully',
      bet
    })
  } catch (error) {
    logger.error('Place bet error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get match statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params

    const stats = await prisma.bet.groupBy({
      by: ['prediction'],
      where: { matchId: id },
      _count: {
        prediction: true
      },
      _sum: {
        amount: true
      }
    })

    const totalBets = await prisma.bet.count({
      where: { matchId: id }
    })

    const totalAmount = await prisma.bet.aggregate({
      where: { matchId: id },
      _sum: { amount: true }
    })

    res.json({
      stats,
      totalBets,
      totalAmount: totalAmount._sum.amount || 0
    })
  } catch (error) {
    logger.error('Get match stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get live matches
router.get('/live/current', async (req, res) => {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    const liveMatches = await prisma.match.findMany({
      where: {
        startTime: {
          gte: oneHourAgo,
          lte: oneHourLater
        },
        status: 'LIVE'
      },
      include: {
        odds: true,
        _count: {
          select: { bets: true }
        }
      },
      orderBy: { startTime: 'asc' }
    })

    res.json({ matches: liveMatches })
  } catch (error) {
    logger.error('Get live matches error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get match prediction (for Sports Predict frontend)
router.get('/:id/prediction', async (req, res) => {
  try {
    const { id } = req.params

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        odds: true,
        predictions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    // Get AI prediction from AI service
    let aiPrediction = null
    try {
      const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/predict-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          league: match.league,
          sport: match.sport
        })
      })

      if (aiResponse.ok) {
        aiPrediction = await aiResponse.json()
      }
    } catch (error) {
      logger.error('AI prediction error:', error)
    }

    // Get historical predictions for this match
    const historicalPredictions = await prisma.prediction.findMany({
      where: { matchId: id },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    res.json({
      match,
      aiPrediction,
      historicalPredictions,
      latestPrediction: match.predictions[0] || null
    })
  } catch (error) {
    logger.error('Get match prediction error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get popular matches (for Sports Predict frontend)
router.get('/popular/current', async (req, res) => {
  try {
    const now = new Date()
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const popularMatches = await prisma.match.findMany({
      where: {
        startTime: {
          gte: now,
          lte: oneWeekLater
        },
        status: 'UPCOMING'
      },
      include: {
        odds: true,
        _count: {
          select: { bets: true, predictions: true }
        }
      },
      orderBy: [
        { _count: { bets: 'desc' } },
        { _count: { predictions: 'desc' } }
      ],
      take: 10
    })

    res.json({ matches: popularMatches })
  } catch (error) {
    logger.error('Get popular matches error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get match news and analysis (for Sports Predict frontend)
router.get('/:id/news', async (req, res) => {
  try {
    const { id } = req.params

    const match = await prisma.match.findUnique({
      where: { id },
      select: {
        id: true,
        homeTeam: true,
        awayTeam: true,
        league: true,
        sport: true
      }
    })

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    // Get news from external API or database
    const news = await prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: match.homeTeam, mode: 'insensitive' } },
          { title: { contains: match.awayTeam, mode: 'insensitive' } },
          { content: { contains: match.homeTeam, mode: 'insensitive' } },
          { content: { contains: match.awayTeam, mode: 'insensitive' } }
        ],
        category: 'SPORTS'
      },
      orderBy: { publishedAt: 'desc' },
      take: 10
    })

    // Get team statistics
    const homeTeamStats = await prisma.teamStats.findFirst({
      where: { teamName: match.homeTeam }
    })

    const awayTeamStats = await prisma.teamStats.findFirst({
      where: { teamName: match.awayTeam }
    })

    res.json({
      match,
      news,
      teamStats: {
        home: homeTeamStats,
        away: awayTeamStats
      }
    })
  } catch (error) {
    logger.error('Get match news error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user's betting history for matches (for Sports Predict frontend)
router.get('/my/betting-history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const bets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: {
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            league: true,
            sport: true,
            startTime: true
          }
        },
        odds: true
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
    logger.error('Get betting history error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get match recommendations (for Sports Predict frontend)
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const { limit = 5 } = req.query

    // Get user's betting history to understand preferences
    const userBets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: {
          select: {
            sport: true,
            league: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Analyze user preferences
    const sportPreferences = userBets.reduce((acc, bet) => {
      const sport = bet.match.sport
      acc[sport] = (acc[sport] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const leaguePreferences = userBets.reduce((acc, bet) => {
      const league = bet.match.league
      acc[league] = (acc[league] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get upcoming matches based on preferences
    const now = new Date()
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const recommendedMatches = await prisma.match.findMany({
      where: {
        startTime: {
          gte: now,
          lte: oneWeekLater
        },
        status: 'UPCOMING',
        OR: [
          { sport: { in: Object.keys(sportPreferences) } },
          { league: { in: Object.keys(leaguePreferences) } }
        ]
      },
      include: {
        odds: true,
        _count: {
          select: { bets: true, predictions: true }
        }
      },
      orderBy: { startTime: 'asc' },
      take: Number(limit)
    })

    res.json({
      recommendedMatches,
      userPreferences: {
        sports: sportPreferences,
        leagues: leaguePreferences
      }
    })
  } catch (error) {
    logger.error('Get match recommendations error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 