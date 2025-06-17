# SportPredict Platform

> **Security Notice:**
> - All private keys, secrets, API Keys and other sensitive information must be obtained securely through KMS (Key Management Service) or third-party APIs. It is strictly prohibited to store or submit them in plain text to code repositories, environment variables, frontend, or anywhere else.
> - Code repositories, .env files, configuration files, and frontend must not contain any private keys, secrets, or API Keys in plain text.
> - All on-chain signing, fund operations, and other sensitive operations must be completed through secure backend services or third-party APIs. Frontend and open-source backend code only initiate requests and do not directly hold or operate private keys.

---

## Environment Variables Security Example

```env
# JWT secret not configured here, backend obtains dynamically through KMS/Secrets Manager
# JWT_SECRET=（Do not store or submit in plain text anywhere）

# Solana private key not configured here, all on-chain signing operations please complete through secure APIs or KMS services
# SOLANA_PRIVATE_KEY=（Do not store or submit in plain text anywhere）

# AI service API Key not configured here, AI service obtains through KMS
# OPENAI_API_KEY=（Do not store or submit in plain text anywhere）
# ANTHROPIC_API_KEY=（Do not store or submit in plain text anywhere）
```

---

A comprehensive sports prediction and betting platform built on Solana blockchain, featuring AI-powered predictions, automated betting strategies, and ETF-style investment products.

## Platform Overview

The SportPredict Platform consists of three independent frontend applications, each serving different user needs:

### 🌐 Frontend Applications

1. **Vegais Sports Predict** (Port 3001)
   - Sports information and news platform
   - AI-powered match predictions
   - Real-time sports data and analytics
   - User-friendly interface for sports enthusiasts

2. **Vegais Sportsbook** (Port 3002)
   - Betting and strategy platform
   - Create and follow automated betting strategies
   - Real-time odds and betting management
   - Advanced strategy analytics and performance tracking

3. **Vegais ETF** (Port 3003)
   - Sports betting ETF investment platform
   - Pool-based investment products
   - Portfolio management and performance tracking
   - Passive investment opportunities

## Features

- **AI-Powered Predictions**: Machine learning models for sports outcome predictions
- **Automated Betting Strategies**: Create and follow automated betting strategies
- **ETF-Style Investment**: Pool-based investment products for sports betting
- **Blockchain Integration**: Solana-based smart contracts for transparent betting
- **Real-time Data**: Live sports data and odds integration
- **User Management**: Multi-tier user system with different access levels
- **Multi-Product Architecture**: Three independent frontend applications

## Tech Stack

### Frontend (All Three Applications)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Axios** for API communication
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **Redis** for caching and rate limiting
- **JWT** for authentication

### AI Service
- **Python** with FastAPI
- **Machine Learning** models for predictions
- **External AI APIs** integration

### Blockchain
- **Solana** blockchain
- **Anchor** framework for smart contracts
- **SPL Token** for token management

## Project Structure

```
SportPredictGithub/
├── frontend/                 # Vegais Sports Predict (Port 3001)
├── frontend-sportsbook/      # Vegais Sportsbook (Port 3002)
├── frontend-etf/            # Vegais ETF (Port 3003)
├── backend/                  # Node.js backend API (Port 8000)
├── ai-service/              # Python AI prediction service (Port 8001)
├── blockchain/              # Solana smart contracts
├── env.example              # Environment variables template
├── start.sh                 # Platform startup script
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL
- Redis
- Solana CLI tools

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SportPredictGithub
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Install all dependencies**
   ```bash
   npm run install:all
   ```

4. **Set up database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start all services**
   ```bash
   # Using the startup script (recommended)
   chmod +x start.sh
   ./start.sh
   
   # Or using npm scripts
   npm run dev
   ```

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Sports Predict | 3001 | Sports information and predictions |
| Sportsbook | 3002 | Betting and strategies |
| ETF | 3003 | Investment products |
| Backend API | 8000 | Main backend service |
| AI Service | 8001 | AI prediction service |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache and rate limiting |

## Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sportpredict"
REDIS_URL="redis://localhost:6379"

# JWT secret not configured here, backend obtains dynamically through KMS/Secrets Manager
# JWT_SECRET=（Do not store or submit in plain text anywhere）

# Solana private key not configured here, all on-chain signing operations please complete through secure APIs or KMS services
# SOLANA_PRIVATE_KEY=（Do not store or submit in plain text anywhere）

# AI service API Key not configured here, AI service obtains through KMS
# OPENAI_API_KEY=（Do not store or submit in plain text anywhere）
# ANTHROPIC_API_KEY=（Do not store or submit in plain text anywhere）

# Other third-party API Keys please obtain through KMS/Secrets Manager
# SPORTS_API_KEY=（Do not store or submit in plain text anywhere）
# ODDS_API_KEY=（Do not store or submit in plain text anywhere）
```

## API Documentation

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Matches
- `GET /matches` - Get all matches
- `GET /matches/:id` - Get specific match
- `POST /matches/:id/bet` - Place a bet

### Strategies
- `GET /strategies` - Get all strategies
- `POST /strategies` - Create a strategy
- `PUT /strategies/:id` - Update a strategy
- `POST /strategies/:id/follow` - Follow a strategy

### ETF
- `GET /etfs` - Get all ETF products
- `POST /etfs` - Create ETF product
- `POST /etfs/:id/buy` - Buy ETF shares
- `POST /etfs/:id/sell` - Sell ETF shares
- `GET /etfs/holdings` - Get user holdings
- `GET /etfs/transactions` - Get transaction history

### AI Chat
- `GET /ai-chat/history` - Get chat history
- `POST /ai-chat/send` - Send message to AI
- `POST /ai-chat/betting-advice` - Get betting advice

## Smart Contracts

### Sport Predict Program
Handles betting logic and token transfers for sports predictions.

### VegaIS Vault Program
Manages ETF-style investment pools and token vaults.

## Development Commands

### Frontend Development
```bash
# Sports Predict
npm run dev:frontend

# Sportsbook
npm run dev:sportsbook

# ETF
npm run dev:etf
```

### Backend Development
```bash
npm run dev:backend
```

### AI Service Development
```bash
npm run dev:ai
```

### Testing
```bash
# Run all tests
npm run test

# Run specific frontend tests
npm run test:frontend
npm run test:sportsbook
npm run test:etf

# Run backend tests
npm run test:backend
```

### Linting
```bash
# Run all linters
npm run lint

# Fix linting issues
npm run lint:fix
```

## Security Features

- **Rate Limiting**: API rate limiting to prevent abuse
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input validation
- **Error Handling**: Secure error handling without information leakage
- **Audit Logging**: All sensitive operations are logged
- **Multi-Frontend Isolation**: Each frontend application is isolated and secure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository. 