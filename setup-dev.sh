#!/bin/bash

# Development setup script
# Run this once to set up the development environment

echo "🔧 Setting up development environment..."

# Make scripts executable
chmod +x quickstart.sh

# Install pre-commit hooks (optional)
if command -v git &> /dev/null; then
    echo "📌 Initializing Git repository..."
    git init || true
    git add . || true
fi

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Run ./quickstart.sh to start the application"
echo "2. Or use: docker-compose up -d --build"
echo "3. Access http://localhost:3000"
