.help:
	@echo "Inventory & Order Management System - Available Commands"
	@echo ""
	@echo "Getting Started:"
	@echo "  make build          - Build Docker images"
	@echo "  make start          - Start all services"
	@echo "  make stop           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View all service logs"
	@echo ""
	@echo "Development:"
	@echo "  make backend-shell  - Open backend container shell"
	@echo "  make frontend-shell - Open frontend container shell"
	@echo "  make db-shell       - Open database shell"
	@echo "  make db-backup      - Backup database"
	@echo ""
	@echo "Database:"
	@echo "  make db-reset       - Reset database (WARNING: Deletes data)"
	@echo "  make db-status      - Check database status"
	@echo ""
	@echo "Testing:"
	@echo "  make health-check   - Check service health"
	@echo "  make test-api       - Test API endpoints"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          - Stop and remove containers"
	@echo "  make clean-all      - Clean including volumes (WARNING: Deletes database)"
	@echo ""

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose stop

restart:
	docker-compose restart

logs:
	docker-compose logs -f

backend-logs:
	docker-compose logs -f backend

frontend-logs:
	docker-compose logs -f frontend

db-logs:
	docker-compose logs -f db

ps:
	docker-compose ps

backend-shell:
	docker-compose exec backend sh

frontend-shell:
	docker-compose exec frontend sh

db-shell:
	docker-compose exec db psql -U postgres -d inventory_db

db-backup:
	@mkdir -p backups
	docker-compose exec -T db pg_dump -U postgres inventory_db > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up successfully"

db-reset:
	@echo "WARNING: This will delete all data. Press Ctrl+C to cancel..."
	@sleep 3
	docker-compose down -v
	docker-compose up -d --build
	@echo "Database reset complete"

db-status:
	docker-compose exec db pg_isready -U postgres

health-check:
	@echo "Checking backend health..."
	@curl -f http://localhost:8000/health && echo "✓ Backend is healthy" || echo "✗ Backend is down"
	@echo ""
	@echo "Checking frontend..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✓ Frontend is running" || echo "✗ Frontend is down"
	@echo ""
	@echo "All services status:"
	@docker-compose ps

test-api:
	@echo "Testing API endpoints..."
	@echo ""
	@echo "1. Health check:"
	@curl -s http://localhost:8000/health | jq .
	@echo ""
	@echo "2. Get all products:"
	@curl -s http://localhost:8000/products | jq . || echo "No products yet"
	@echo ""
	@echo "3. Dashboard stats:"
	@curl -s http://localhost:8000/stats/dashboard | jq .

clean:
	docker-compose down

clean-all:
	@echo "WARNING: This will delete all containers and volumes including database!"
	@sleep 3
	docker-compose down -v

build-start:
	docker-compose up -d --build
	@echo ""
	@echo "✓ Application started successfully!"
	@echo ""
	@echo "Access the application:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo ""

version:
	@echo "Application Version: 1.0.0"
	@echo "Backend: FastAPI with Python 3.11"
	@echo "Frontend: React 18 with Vite"
	@echo "Database: PostgreSQL 15"

.PHONY: help build start stop restart logs backend-logs frontend-logs db-logs \
        ps backend-shell frontend-shell db-shell db-backup db-reset db-status \
        health-check test-api clean clean-all build-start version .help

help: .help
