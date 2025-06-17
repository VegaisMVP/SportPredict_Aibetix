import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@sportpredict.com' },
      update: {},
      create: {
        email: 'admin@sportpredict.com',
        username: 'admin',
        password: hashedPassword,
        userType: 'ADMIN',
        walletAddress: '11111111111111111111111111111111',
        balance: 10000,
      },
    }),
    prisma.user.upsert({
      where: { email: 'manager@sportpredict.com' },
      update: {},
      create: {
        email: 'manager@sportpredict.com',
        username: 'fundmanager',
        password: hashedPassword,
        userType: 'MANAGER',
        walletAddress: '22222222222222222222222222222222',
        balance: 5000,
      },
    }),
    prisma.user.upsert({
      where: { email: 'strategist@sportpredict.com' },
      update: {},
      create: {
        email: 'strategist@sportpredict.com',
        username: 'prostrategist',
        password: hashedPassword,
        userType: 'STRATEGIST',
        walletAddress: '33333333333333333333333333333333',
        balance: 3000,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@sportpredict.com' },
      update: {},
      create: {
        email: 'user@sportpredict.com',
        username: 'regularuser',
        password: hashedPassword,
        userType: 'REGULAR',
        walletAddress: '44444444444444444444444444444444',
        balance: 1000,
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  // Create test matches
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        league: 'Premier League',
        sport: 'Football',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'UPCOMING',
      },
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Barcelona',
        awayTeam: 'Real Madrid',
        league: 'La Liga',
        sport: 'Football',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: 'UPCOMING',
      },
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        league: 'NBA',
        sport: 'Basketball',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'UPCOMING',
      },
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Patriots',
        awayTeam: 'Chiefs',
        league: 'NFL',
        sport: 'American Football',
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'UPCOMING',
      },
    }),
  ]);

  console.log('✅ Matches created:', matches.length);

  // Create odds for matches
  const oddsPromises = matches.flatMap((match) => [
    prisma.odds.create({
      data: {
        matchId: match.id,
        type: 'HOME_WIN',
        value: 2.5,
        isActive: true,
      },
    }),
    prisma.odds.create({
      data: {
        matchId: match.id,
        type: 'AWAY_WIN',
        value: 2.8,
        isActive: true,
      },
    }),
    prisma.odds.create({
      data: {
        matchId: match.id,
        type: 'DRAW',
        value: 3.2,
        isActive: true,
      },
    }),
  ]);

  const odds = await Promise.all(oddsPromises);
  console.log('✅ Odds created:', odds.length);

  // Create test strategies
  const strategies = await Promise.all([
    prisma.strategy.create({
      data: {
        name: 'Conservative Football Strategy',
        description: 'A conservative betting strategy focused on football matches with high probability outcomes.',
        rules: {
          conditions: [
            'Home team has >60% win rate',
            'Odds > 1.5 and < 2.5',
            'No more than 2 goals conceded in last 5 matches'
          ],
          betAmount: '2% of balance',
          maxBets: 3
        },
        riskLevel: 2,
        minBetAmount: 10,
        maxBetAmount: 100,
        targetSuccessRate: 65,
        isPublic: true,
        creatorId: users[2].id, // strategist
        status: 'ACTIVE',
      },
    }),
    prisma.strategy.create({
      data: {
        name: 'Aggressive NBA Strategy',
        description: 'High-risk, high-reward strategy for NBA games with strong offensive teams.',
        rules: {
          conditions: [
            'Both teams average >110 points per game',
            'Total over/under >220 points',
            'Home team has >55% win rate'
          ],
          betAmount: '5% of balance',
          maxBets: 2
        },
        riskLevel: 4,
        minBetAmount: 20,
        maxBetAmount: 200,
        targetSuccessRate: 55,
        isPublic: true,
        creatorId: users[2].id, // strategist
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ Strategies created:', strategies.length);

  // Create test ETFs
  const etfs = await Promise.all([
    prisma.eTF.create({
      data: {
        name: 'Conservative Sports Fund',
        description: 'A conservative ETF focused on low-risk sports betting opportunities.',
        strategy: {
          allocation: {
            football: 60,
            basketball: 25,
            other: 15
          },
          riskManagement: 'Maximum 2% per bet',
          diversification: 'Minimum 10 different matches'
        },
        riskLevel: 2,
        minInvestment: 100,
        maxInvestment: 10000,
        annualReturn: 15,
        managementFee: 2,
        performanceFee: 10,
        managerId: users[1].id, // manager
        status: 'ACTIVE',
      },
    }),
    prisma.eTF.create({
      data: {
        name: 'Growth Sports Fund',
        description: 'A growth-oriented ETF targeting higher returns through aggressive betting strategies.',
        strategy: {
          allocation: {
            football: 40,
            basketball: 40,
            other: 20
          },
          riskManagement: 'Maximum 5% per bet',
          diversification: 'Minimum 5 different matches'
        },
        riskLevel: 4,
        minInvestment: 200,
        maxInvestment: 20000,
        annualReturn: 25,
        managementFee: 3,
        performanceFee: 15,
        managerId: users[1].id, // manager
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ ETFs created:', etfs.length);

  // Create some test bets
  const bets = await Promise.all([
    prisma.bet.create({
      data: {
        userId: users[3].id, // regular user
        matchId: matches[0].id,
        oddsId: odds[0].id, // HOME_WIN
        amount: 50,
        prediction: 'HOME_WIN',
        status: 'PENDING',
        potentialWinnings: 125,
      },
    }),
    prisma.bet.create({
      data: {
        userId: users[3].id, // regular user
        matchId: matches[1].id,
        oddsId: odds[4].id, // AWAY_WIN
        amount: 30,
        prediction: 'AWAY_WIN',
        status: 'PENDING',
        potentialWinnings: 84,
      },
    }),
  ]);

  console.log('✅ Bets created:', bets.length);

  // Create some test predictions
  const predictions = await Promise.all([
    prisma.prediction.create({
      data: {
        matchId: matches[0].id,
        userId: users[2].id, // strategist
        prediction: 'HOME_WIN',
        confidence: 0.75,
        reasoning: 'Manchester United has strong home form and Liverpool has been inconsistent away from home.',
        model: 'ensemble_model_v1',
      },
    }),
    prisma.prediction.create({
      data: {
        matchId: matches[1].id,
        userId: users[2].id, // strategist
        prediction: 'AWAY_WIN',
        confidence: 0.65,
        reasoning: 'Real Madrid has been in excellent form and Barcelona has defensive issues.',
        model: 'ensemble_model_v1',
      },
    }),
  ]);

  console.log('✅ Predictions created:', predictions.length);

  // Create some test chat messages
  const chatMessages = await Promise.all([
    prisma.chatMessage.create({
      data: {
        userId: users[3].id, // regular user
        content: 'What do you think about the Manchester United vs Liverpool match?',
        role: 'USER',
        context: 'match_analysis',
      },
    }),
    prisma.chatMessage.create({
      data: {
        userId: users[3].id, // regular user
        content: 'Based on recent form and head-to-head statistics, Manchester United has a slight advantage at home. However, Liverpool\'s attacking prowess makes this a close match. I\'d recommend a conservative approach.',
        role: 'ASSISTANT',
        context: 'match_analysis',
        metadata: {
          model: 'gpt-4',
          tokens: 45,
          processing_time: 1.2
        },
      },
    }),
  ]);

  console.log('✅ Chat messages created:', chatMessages.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 