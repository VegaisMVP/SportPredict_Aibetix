import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import axios from 'axios';
import { aiPredictLimit } from '../middleware/aiLimit';
import { permission } from '../middleware/permission';

const router = Router();
const prisma = new PrismaClient();

// Get chat history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.chatMessage.count({
      where: { userId }
    });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message to AI
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId,
        content: message,
        role: 'USER',
        context: context || 'general'
      }
    });

    // Get recent conversation context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Prepare context for AI
    const conversationContext = recentMessages
      .reverse()
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Call AI service
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/chat`, {
        message,
        context: conversationContext,
        user_context: context || 'general'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      });

      const aiMessage = await prisma.chatMessage.create({
        data: {
          userId,
          content: aiResponse.data.response,
          role: 'ASSISTANT',
          context: context || 'general',
          metadata: {
            model: aiResponse.data.model,
            tokens: aiResponse.data.tokens,
            processing_time: aiResponse.data.processing_time
          }
        }
      });

      res.json({
        message: 'Message sent successfully',
        userMessage,
        aiMessage
      });
    } catch (aiError) {
      console.error('AI service error:', aiError);
      
      // Save error message
      const errorMessage = await prisma.chatMessage.create({
        data: {
          userId,
          content: 'Sorry, I am currently unavailable. Please try again later.',
          role: 'ASSISTANT',
          context: context || 'general',
          metadata: {
            error: 'AI service unavailable'
          }
        }
      });

      res.status(503).json({
        message: 'AI service temporarily unavailable',
        userMessage,
        aiMessage: errorMessage
      });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get AI predictions for a match
router.post(
  '/predict-match',
  aiPredictLimit,
  permission({ allowGuest: true }),
  authenticateToken,
  async (req, res) => {
    try {
      const userId = (req as any).user?.userId;
      const { matchId, question } = req.body;

      if (!matchId) {
        return res.status(400).json({ error: 'Match ID is required' });
      }

      // Get match information
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          odds: true
        }
      });

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Prepare match context for AI
      const matchContext = `\n      Match: ${match.homeTeam} vs ${match.awayTeam}\n      League: ${match.league}\n      Sport: ${match.sport}\n      Start Time: ${match.startTime}\n      Status: ${match.status}\n      Current Odds: ${JSON.stringify(match.odds)}\n    `;

      // Call AI prediction service
      try {
        const predictionResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict-match`, {
          match_context: matchContext,
          question: question || 'What is your prediction for this match?',
          user_id: userId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
          }
        });

        // Save prediction
        const prediction = await prisma.prediction.create({
          data: {
            matchId,
            userId,
            prediction: predictionResponse.data.prediction,
            confidence: predictionResponse.data.confidence,
            reasoning: predictionResponse.data.reasoning,
            model: predictionResponse.data.model,
            metadata: {
              question,
              processing_time: predictionResponse.data.processing_time
            }
          }
        });

        res.json({
          message: 'Prediction generated successfully',
          prediction
        });
      } catch (aiError) {
        console.error('AI prediction service error:', aiError);
        res.status(503).json({ error: 'Prediction service temporarily unavailable' });
      }
    } catch (error) {
      console.error('Get match prediction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get betting advice
router.post('/betting-advice', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { strategy, riskLevel, budget, preferences } = req.body;

    // Get user's betting history
    const userBets = await prisma.bet.findMany({
      where: { userId },
      include: {
        match: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Prepare user context
    const userContext = {
      totalBets: userBets.length,
      successfulBets: userBets.filter(bet => bet.status === 'WON').length,
      totalAmount: userBets.reduce((sum, bet) => sum + bet.amount, 0),
      averageBetAmount: userBets.length > 0 ? userBets.reduce((sum, bet) => sum + bet.amount, 0) / userBets.length : 0,
      preferredSports: [...new Set(userBets.map(bet => bet.match.sport))],
      strategy,
      riskLevel,
      budget,
      preferences
    };

    // Call AI advice service
    try {
      const adviceResponse = await axios.post(`${process.env.AI_SERVICE_URL}/betting-advice`, {
        user_context: userContext,
        betting_history: userBets.map(bet => ({
          match: `${bet.match.homeTeam} vs ${bet.match.awayTeam}`,
          amount: bet.amount,
          prediction: bet.prediction,
          result: bet.status,
          winnings: bet.winnings
        }))
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`
        }
      });

      res.json({
        message: 'Betting advice generated successfully',
        advice: adviceResponse.data.advice,
        recommendations: adviceResponse.data.recommendations,
        riskAssessment: adviceResponse.data.risk_assessment
      });
    } catch (aiError) {
      console.error('AI advice service error:', aiError);
      res.status(503).json({ error: 'Advice service temporarily unavailable' });
    }
  } catch (error) {
    console.error('Get betting advice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear chat history
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    await prisma.chatMessage.deleteMany({
      where: { userId }
    });

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const totalMessages = await prisma.chatMessage.count({
      where: { userId }
    });

    const userMessages = await prisma.chatMessage.count({
      where: { 
        userId,
        role: 'USER'
      }
    });

    const aiMessages = await prisma.chatMessage.count({
      where: { 
        userId,
        role: 'ASSISTANT'
      }
    });

    const contextStats = await prisma.chatMessage.groupBy({
      by: ['context'],
      where: { userId },
      _count: {
        context: true
      }
    });

    res.json({
      totalMessages,
      userMessages,
      aiMessages,
      contextBreakdown: contextStats.map(stat => ({
        context: stat.context,
        count: stat._count.context
      }))
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 