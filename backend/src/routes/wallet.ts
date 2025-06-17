import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { logger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Initialize Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        balance: true, 
        walletAddress: true 
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get Solana wallet balance
    let solanaBalance = 0;
    if (user.walletAddress) {
      try {
        const publicKey = new PublicKey(user.walletAddress);
        const balance = await connection.getBalance(publicKey);
        solanaBalance = balance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error('Error getting Solana balance:', error);
      }
    }

    res.json({
      platformBalance: user.balance,
      solanaBalance,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deposit funds
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { amount, transactionHash } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!transactionHash) {
      return res.status(400).json({ error: 'Transaction hash is required' });
    }

    // Verify transaction on Solana
    try {
      const transaction = await connection.getTransaction(transactionHash);
      if (!transaction) {
        return res.status(400).json({ error: 'Invalid transaction hash' });
      }

      // Verify transaction is confirmed
      if (!transaction.meta?.err) {
        // Create deposit record
        const deposit = await prisma.transaction.create({
          data: {
            userId,
            type: 'DEPOSIT',
            amount,
            status: 'PENDING',
            transactionHash,
            metadata: {
              solanaTransaction: transaction
            }
          }
        });

        // Update user balance
        await prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: amount } }
        });

        // Update transaction status
        await prisma.transaction.update({
          where: { id: deposit.id },
          data: { status: 'COMPLETED' }
        });

        // Audit log
        logger.audit('deposit', { userId, amount, transactionHash });

        res.json({
          message: 'Deposit successful',
          deposit,
          newBalance: (await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true }
          }))?.balance
        });
      } else {
        return res.status(400).json({ error: 'Transaction failed on blockchain' });
      }
    } catch (error) {
      console.error('Transaction verification error:', error);
      return res.status(400).json({ error: 'Failed to verify transaction' });
    }
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Withdraw funds
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { amount, destinationAddress } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!destinationAddress) {
      return res.status(400).json({ error: 'Destination address is required' });
    }

    // Validate destination address
    try {
      new PublicKey(destinationAddress);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid destination address' });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal record
    const withdrawal = await prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        amount,
        status: 'PENDING',
        destinationAddress,
        metadata: {
          requestedAt: new Date().toISOString()
        }
      }
    });

    // Update user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });

    // TODO: Implement actual Solana transaction
    // This would involve creating and sending a transaction to the destination address
    // For now, we'll simulate the process

    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Update transaction status to completed
        await prisma.transaction.update({
          where: { id: withdrawal.id },
          data: { 
            status: 'COMPLETED',
            transactionHash: `simulated_${Date.now()}`,
            metadata: {
              ...withdrawal.metadata,
              completedAt: new Date().toISOString()
            }
          }
        });
      } catch (error) {
        console.error('Error updating withdrawal status:', error);
      }
    }, 5000);

    // Audit log
    logger.audit('withdraw', { userId, amount, destinationAddress });

    res.json({
      message: 'Withdrawal initiated',
      withdrawal,
      newBalance: user.balance - amount
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 20, type, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { userId };

    if (type) where.type = type;
    if (status) where.status = status;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.transaction.count({ where });

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
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction by ID
router.get('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate deposit address
router.post('/deposit-address', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return res.status(400).json({ error: 'User wallet address not set' });
    }

    // For now, return the user's wallet address
    // In a real implementation, you might generate a new address for each deposit
    res.json({
      depositAddress: user.walletAddress,
      network: 'Solana',
      memo: `User: ${userId}`
    });
  } catch (error) {
    console.error('Generate deposit address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wallet statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: daysAgo
        }
      }
    });

    const deposits = transactions.filter(t => t.type === 'DEPOSIT');
    const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL');

    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalDeposits - totalWithdrawals;

    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;

    res.json({
      period: Number(period),
      totalTransactions: transactions.length,
      completedTransactions,
      pendingTransactions,
      totalDeposits,
      totalWithdrawals,
      netFlow,
      averageTransactionAmount: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
        : 0
    });
  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update wallet address
router.put('/address', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Validate Solana address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid Solana address' });
    }

    // Check if address is already in use
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: 'Wallet address already in use' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { walletAddress },
      select: {
        id: true,
        username: true,
        walletAddress: true,
        balance: true
      }
    });

    res.json({
      message: 'Wallet address updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update wallet address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 