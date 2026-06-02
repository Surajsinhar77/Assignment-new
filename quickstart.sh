#!/bin/bash

# Inventory & Order Management System - Quick Start Script
# This script sets up and starts the application

set -e  # Exit on error

echo "🚀 Inventory & Order Management System - Quick Start"
echo "=================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker from https://docker.com"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install from https://docker.com/compose"
    exit 1
fi

echo "✓ Docker is installed"
echo "✓ Docker Compose is installed"
echo ""

# Check if containers are already running
echo "🔍 Checking for existing containers..."
if docker-compose ps | grep -q "inventory_backend"; then
    echo "⚠️  Application is already running"
    echo ""
    echo "Available commands:"
    echo "  docker-compose logs -f     # View logs"
    echo "  docker-compose stop        # Stop services"
    echo "  make health-check          # Check health"
    echo ""
    exit 0
fi

echo ""

# Build images
echo "🔨 Building Docker images..."
docker-compose build --no-cache

echo ""

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 5

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ Backend is healthy"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
        sleep 2
    fi
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Backend failed to start. Check logs:"
    docker-compose logs backend
    exit 1
fi

echo ""
echo "✅ Application started successfully!"
echo ""
echo "=================================================="
echo "📱 Access the Application:"
echo "=================================================="
echo ""
echo "🌐 Frontend:       http://localhost:3000"
echo "🔌 Backend API:    http://localhost:8000"
echo "📚 API Docs:       http://localhost:8000/docs"
echo "📖 ReDoc:          http://localhost:8000/redoc"
echo ""
echo "=================================================="
echo "📚 Useful Commands:"
echo "=================================================="
echo ""
echo "View logs:         docker-compose logs -f"
echo "Stop services:     docker-compose stop"
echo "Restart services:  docker-compose restart"
echo "Backend shell:     docker-compose exec backend sh"
echo "Database shell:    docker-compose exec db psql -U postgres -d inventory_db"
echo "Backup database:   docker-compose exec -T db pg_dump -U postgres inventory_db > backup.sql"
echo "Health check:      make health-check"
echo ""
echo "For more commands, run:  make help"
echo ""
echo "📖 Documentation:"
echo "  - README.md         - Complete documentation"
echo "  - SETUP.md          - Detailed setup guide"
echo "  - API_EXAMPLES.md   - API usage examples"
echo "  - DEPLOYMENT.md     - Deployment guide"
echo ""
echo "Happy coding! 🎉"
