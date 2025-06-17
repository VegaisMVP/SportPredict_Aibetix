#!/bin/bash

echo "🚀 Starting LegalityCheck_KYC Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check environment variable file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

# Start service
echo "🌟 Starting service..."
npm run dev 