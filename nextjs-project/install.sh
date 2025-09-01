#!/bin/bash

echo "🚀 Setting up JupitLunar GEO Content Engine..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your actual configuration values"
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p src/components/geo
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/utils

echo "✅ Project directories created"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Edit .env.local with your Supabase and Firebase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
