#!/bin/bash
# ╔══════════════════════════════════════════════════╗
# ║         Self-Orbit — Development Setup           ║
# ╚══════════════════════════════════════════════════╝

set -e

echo "🧠 Self-Orbit Development Environment Setup"
echo "============================================"

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
    echo "✅ $1 found"
}

echo ""
echo "📋 Checking prerequisites..."
check_command docker
check_command dotnet
check_command python3
check_command node
check_command npm

echo ""
echo "🐍 Setting up AI Infrastructure..."
cd ai-infrastructure
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env
cd ..

echo ""
echo "🔧 Restoring .NET packages..."
cd backend
dotnet restore SelfOrbit.sln
cd ..

echo ""
echo "⚛️  Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🐳 Starting infrastructure services..."
docker compose up -d postgres

echo ""
echo "✅ Setup complete!"
echo ""
echo "  Start all services:     docker compose up -d"
echo "  Start frontend only:    cd frontend && npm run dev"
echo "  Run .NET tests:         cd backend && dotnet test"
echo "  Run Python tests:       cd ai-infrastructure && pytest"
echo ""
