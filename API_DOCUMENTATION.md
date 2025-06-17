# SportPredict Platform API Documentation

## Overview

SportPredict Platform backend API supports three independent frontend applications:
- **Vegais Sports Predict** (Port 3001) - Sports information and news platform
- **Vegais Sportsbook** (Port 3002) - Betting and strategy platform
- **Vegais ETF** (Port 3003) - Sports betting ETF platform

## Basic Information

- **Base URL**: `http://localhost:8000`
- **API Prefix**: `/api`
- **Authentication**: JWT Bearer Token
- **Content Type**: `application/json`

## Authentication

### User Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User Information
```
GET /api/auth/me
Authorization: Bearer <token>
```

## Matches (Sports Predict Frontend)

### Get Match List
```
GET /api/matches?page=1&limit=20&status=upcoming&sport=football&league=premier-league
```

### Get Match Details
```
GET /api/matches/:id
```

### Get Match Prediction
```
GET /api/matches/:id/prediction
```

### Get Popular Matches
```
GET /api/matches/popular/current
```

### Get Match News and Analysis
```
GET /api/matches/:id/news
```

### Get User Betting History
```
GET /api/matches/my/betting-history?page=1&limit=20
Authorization: Bearer <token>
```

### Get Match Recommendations
```
GET /api/matches/recommendations?limit=5
Authorization: Bearer <token>
```

### Bet on Match
```
POST /api/matches/:id/bet
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "oddsId": "odds-id",
  "prediction": "home_win"
}
```

### Get Match Statistics
```
GET /api/matches/:id/stats
```

### Get Live Matches
```
GET /api/matches/live/current
```

## Strategies (Sportsbook Frontend)

### Get Strategy List
```
GET /api/strategies?page=1&limit=20&status=active&minSuccessRate=70&maxRisk=3
```

### Get Strategy Details
```
GET /api/strategies/:id
```

### Create Strategy
```
POST /api/strategies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Stable Return Strategy",
  "description": "Low-risk stable return strategy",
  "rules": {...},
  "riskLevel": 2,
  "minBetAmount": 10,
  "maxBetAmount": 1000,
  "targetSuccessRate": 75,
  "isPublic": true
}
```

### Update Strategy
```
PUT /api/strategies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Strategy Name",
  "description": "Updated description"
}
```

### Follow/Unfollow Strategy
```
POST /api/strategies/:id/follow
Authorization: Bearer <token>
```

### Execute Strategy
```
POST /api/strategies/:id/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "matchId": "match-id",
  "betAmount": 100
}
```

### Get Strategy Performance
```
GET /api/strategies/:id/performance?period=30
```

### Get User's Followed Strategies
```
GET /api/strategies/my/following?page=1&limit=20
Authorization: Bearer <token>
```

### Get User's Created Strategies
```
GET /api/strategies/my/created?page=1&limit=20
Authorization: Bearer <token>
```

### Get Strategy Statistics Overview
```
GET /api/strategies/stats/overview
```

### Get User Betting Statistics
```
GET /api/strategies/my/betting-stats
Authorization: Bearer <token>
```

### Get User Betting History
```
GET /api/strategies/my/betting-history?page=1&limit=20&status=won
Authorization: Bearer <token>
```

## ETF (ETF Frontend)

### Get ETF List
```
GET /api/etf?page=1&limit=20&status=active&minReturn=10&maxRisk=3
```

### Get ETF Details
```
GET /api/etf/:id
```

### Create ETF
```
POST /api/etf
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Stable Sports Fund",
  "description": "Low-risk sports investment portfolio",
  "strategy": "Diversified investment strategy",
  "riskLevel": 2,
  "minInvestment": 100,
  "maxInvestment": 10000,
  "annualReturn": 15,
  "managementFee": 1.5,
  "performanceFee": 10
}
```

### Invest in ETF
```
POST /api/etf/:id/invest
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

### Redeem ETF
```
POST /api/etf/:id/redeem
Authorization: Bearer <token>
Content-Type: application/json

{
  "shares": 10
}
```

### Buy ETF Shares (ETF Frontend Specific)
```
POST /api/etf/:id/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

### Sell ETF Shares (ETF Frontend Specific)
```
POST /api/etf/:id/sell
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

### Get ETF Historical Data
```
GET /api/etf/:id/history?period=30
```

### Get ETF Performance
```
GET /api/etf/:id/performance?period=30
```

### Get User ETF Investments
```
GET /api/etf/my/investments
Authorization: Bearer <token>
```

### Get User Holdings (ETF Frontend Specific)
```
GET /api/etf/holdings
Authorization: Bearer <token>
```

### Get Transaction History (ETF Frontend Specific)
```
GET /api/etf/transactions?page=1&limit=20
Authorization: Bearer <token>
```

### Get ETF Balance
```
GET /api/etf/balance
Authorization: Bearer <token>
```

### Deposit to ETF
```
POST /api/etf/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

### Withdraw from ETF
```
POST /api/etf/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

### Get ETF History
```
GET /api/etf/history?page=1&limit=20
Authorization: Bearer <token>
```

## Users

### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

### Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new-username",
  "email": "new-email@example.com"
}
```

### Get User Statistics
```
GET /api/users/stats
Authorization: Bearer <token>
```

## Wallet

### Get Wallet Balance
```
GET /api/wallet/balance
Authorization: Bearer <token>
```

### Deposit
```
POST /api/wallet/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

### Withdraw
```
POST /api/wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

### Get Transaction History
```
GET /api/wallet/transactions?page=1&limit=20
Authorization: Bearer <token>
```

## AI

### Get AI Predictions
```
GET /api/ai/predictions?matchId=123
```

### Get AI Chat History
```
GET /api/ai-chat/history?page=1&limit=20
Authorization: Bearer <token>
```

### Send AI Chat Message
```
POST /api/ai-chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Please analyze this match",
  "matchId": "123"
}
```

### Get Betting Advice
```
POST /api/ai-chat/betting-advice
Authorization: Bearer <token>
Content-Type: application/json

{
  "matchId": "123",
  "userPreferences": {
    "riskLevel": "low",
    "betAmount": 100
  }
}
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Operation successful",
  "status": "success"
}
```

### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Authentication

All APIs requiring authentication need to include JWT token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API implements rate limiting:
- Regular users: 100 requests/minute
- Premium users: 500 requests/minute
- Strategists: 1000 requests/minute

## CORS Configuration

Backend supports cross-origin requests from the following frontend domains:
- `http://localhost:3000` (Original frontend)
- `http://localhost:3001` (Sports Predict)
- `http://localhost:3002` (Sportsbook)
- `http://localhost:3003` (ETF)

## Environment Variables

Ensure the backend has the following environment variables configured:
- `DATABASE_URL` - PostgreSQL database connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - JWT secret
- `AI_SERVICE_URL` - AI service address
- `FRONTEND_URL` - Frontend URL 