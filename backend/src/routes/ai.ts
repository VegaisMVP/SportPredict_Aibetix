import { Router } from 'express'
import { prisma } from '../index'
import { logger } from '../utils/logger'

const router = Router()

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // TODO: Integrate with AI service (Python FastAPI)
    // This would call the AI service to get a response
    const aiResponse = await callAIService(message)

    // Save chat history
    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId,
        message,
        response: aiResponse
      }
    })

    res.json({
      message: chatMessage.message,
      response: chatMessage.response,
      timestamp: chatMessage.createdAt
    })
  } catch (error) {
    logger.error('AI chat error:', error)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
})

// Get chat history
router.get('/chat/history', async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    })

    const total = await prisma.chatMessage.count({
      where: { userId }
    })

    res.json({
      messages: messages.reverse(), // Show oldest first
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    logger.error('Get chat history error:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

// Get AI prediction for match
router.get('/prediction/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params

    // Check if prediction already exists
    let prediction = await prisma.prediction.findFirst({
      where: { matchId },
      orderBy: { createdAt: 'desc' }
    })

    if (!prediction) {
      // TODO: Call AI service to generate prediction
      prediction = await generatePrediction(matchId)
    }

    res.json(prediction)
  } catch (error) {
    logger.error('Get AI prediction error:', error)
    res.status(500).json({ error: 'Failed to fetch prediction' })
  }
})

// Generate betting strategy recommendation
router.post('/strategy/recommend', async (req, res) => {
  try {
    const { matchId, riskLevel, budget } = req.body

    if (!matchId || !riskLevel || !budget) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // TODO: Call AI service to generate strategy recommendation
    const recommendation = await generateStrategyRecommendation(matchId, riskLevel, budget)

    res.json(recommendation)
  } catch (error) {
    logger.error('Generate strategy recommendation error:', error)
    res.status(500).json({ error: 'Failed to generate recommendation' })
  }
})

// Helper functions
async function callAIService(message: string): Promise<string> {
  // TODO: Implement actual AI service call
  // This would make a request to the Python FastAPI service
  
  // Mock response for now
  const responses = [
    "Based on the current data, I recommend focusing on teams with strong recent form.",
    "The odds suggest this match could go either way, but historical data favors the home team.",
    "Consider the weather conditions and any recent injuries when making your decision.",
    "This looks like a high-scoring game based on both teams' recent performances."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

async function generatePrediction(matchId: string) {
  // TODO: Implement actual prediction generation
  // This would call the AI service to generate predictions
  
  const prediction = await prisma.prediction.create({
    data: {
      matchId,
      homeWinProb: 0.45,
      drawProb: 0.25,
      awayWinProb: 0.30,
      homeScore: 1,
      awayScore: 1,
      confidence: 0.75,
      model: 'xg_elo_ensemble'
    }
  })

  return prediction
}

async function generateStrategyRecommendation(matchId: string, riskLevel: string, budget: number) {
  // TODO: Implement actual strategy recommendation
  // This would analyze odds, predictions, and user preferences
  
  return {
    matchId,
    riskLevel,
    budget,
    recommendation: {
      betType: 'match_winner',
      selection: 'home_win',
      stake: budget * 0.1,
      expectedReturn: budget * 0.15,
      confidence: 0.7
    },
    reasoning: "Based on recent form and head-to-head statistics, the home team has a strong advantage."
  }
}

export default router 