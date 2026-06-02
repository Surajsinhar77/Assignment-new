# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Install Git](https://git-scm.com/downloads)
- **macOS Users**: You may need to install additional tools
- **Windows Users**: Consider using WSL 2 for better compatibility

## Step-by-Step Setup Instructions

### 1. Clone or Extract the Project

```bash
# Navigate to your workspace
cd /path/to/your/workspace

# Clone if using git
git clone <repository-url> Assignment-new

# Or extract the zip file if you have it
```

### 2. Navigate to Project Directory

```bash
cd Assignment-new
```

### 3. Verify Project Structure

```bash
# On macOS/Linux
ls -la

# You should see:
# backend/
# frontend/
# docker-compose.yml
# .env
# .gitignore
# README.md
# SETUP.md
```

### 4. Configure Database Connection

The project comes with a pre-configured `.env` file. For local development, the defaults should work:

```bash
# View current .env
cat .env

# For local setup, defaults are fine:
# DATABASE_URL=postgresql://postgres:postgres@db:5432/inventory_db
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=postgres
# POSTGRES_DB=inventory_db
```

**For Production**, update the `.env` file:
```bash
# Edit .env
nano .env
# or use your preferred editor
vim .env
```

Change at minimum:
```
POSTGRES_PASSWORD=your_very_secure_password_here
DATABASE_URL=postgresql://postgres:your_very_secure_password_here@db:5432/inventory_db
```

### 5. Build and Start Services

```bash
# Build images and start all services
docker-compose up --build

# Or start in detached mode (background)
docker-compose up -d --build

# Monitor logs
docker-compose logs -f
```

**What's happening:**
- Docker builds the backend image (Python + FastAPI)
- Docker builds the frontend image (Node.js + React)
- PostgreSQL database starts with persistent storage
- All services connect to the same network

### 6. Verify Services are Running

In a new terminal:

```bash
# Check running containers
docker-compose ps

# Expected output:
# NAME                COMMAND                  SERVICE      STATUS       PORTS
# inventory_db        postgres                 db           Up (healthy) 5432
# inventory_backend   uvicorn main:app         backend      Up (healthy) 8000
# inventory_frontend  serve -s dist           frontend     Up           3000
```

### 7. Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

### 8. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Get all products
curl http://localhost:8000/products

# Get all customers
curl http://localhost:8000/customers

# Get dashboard stats
curl http://localhost:8000/stats/dashboard
```

See [API_EXAMPLES.md](API_EXAMPLES.md) for detailed API examples.

## First Time Usage

### 1. Create a Product

**Via Frontend:**
1. Navigate to http://localhost:3000
2. Click "Products" in the navigation
3. Click "Add Product"
4. Fill in:
   - Product Name: e.g., "Laptop"
   - SKU: e.g., "SKU-001"
   - Price: e.g., "999.99"
   - Quantity: e.g., "50"
5. Click "Create Product"

**Via API:**
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "SKU-001",
    "price": 999.99,
    "quantity": 50
  }'
```

### 2. Create a Customer

**Via Frontend:**
1. Click "Customers" in the navigation
2. Click "Add Customer"
3. Fill in:
   - Full Name: e.g., "John Doe"
   - Email: e.g., "john@example.com"
   - Phone: e.g., "+1234567890"
4. Click "Create Customer"

### 3. Create an Order

**Via Frontend:**
1. Click "Orders" in the navigation
2. Click "Create Order"
3. Select a customer from the dropdown
4. Add items:
   - Select a product
   - Enter quantity
5. Click "Create Order"

The order will automatically:
- Calculate the total amount
- Check inventory availability
- Reduce product stock
- Show success message

## Useful Docker Commands

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs                    # All services
docker-compose logs backend            # Backend only
docker-compose logs frontend           # Frontend only
docker-compose logs db                 # Database only
docker-compose logs -f backend         # Follow logs

# Execute commands in containers
docker-compose exec backend sh          # Backend shell
docker-compose exec frontend sh         # Frontend shell
docker-compose exec db psql -U postgres # Database shell

# Stop services
docker-compose stop                    # Graceful stop
docker-compose down                    # Stop and remove containers
docker-compose down -v                 # Stop, remove, and delete volumes

# Restart services
docker-compose restart                 # Restart all services
docker-compose restart backend         # Restart backend only

# Build without starting
docker-compose build

# Remove all containers/networks
docker-compose down -v

# View specific container logs
docker-compose logs --tail=50 backend  # Last 50 lines
docker-compose logs -f backend         # Follow in real-time
```

## Database Management

### Access PostgreSQL Console

```bash
# Open PostgreSQL command line
docker-compose exec db psql -U postgres -d inventory_db
```

### Common Database Commands

```sql
-- List all tables
\dt

-- View products
SELECT * FROM products;

-- View customers
SELECT * FROM customers;

-- View orders
SELECT * FROM orders;

-- View order items
SELECT * FROM order_items;

-- Count products
SELECT COUNT(*) FROM products;

-- Exit psql
\q
```

### Backup Database

```bash
# Create a backup
docker-compose exec db pg_dump -U postgres inventory_db > backup.sql

# Restore from backup
cat backup.sql | docker-compose exec -T db psql -U postgres inventory_db
```

## Troubleshooting

### Issue: "Port already in use"

**Error Message:**
```
Error response from daemon: Ports are not available: listen tcp 0.0.0.0:8000: bind: address already in use
```

**Solution:**
```bash
# Option 1: Stop other services using the port
lsof -i :8000  # Find what's using port 8000
kill -9 <PID>  # Kill the process

# Option 2: Use different ports
# Edit .env:
BACKEND_PORT=8001
FRONTEND_PORT=3001
DB_PORT=5433

# Then restart
docker-compose down
docker-compose up -d --build
```

### Issue: "Frontend cannot connect to backend"

**Solution:**
```bash
# Check if backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Test backend connectivity
curl http://localhost:8000/health

# If that doesn't work, restart
docker-compose restart backend
```

### Issue: "Database connection error"

**Error Message:**
```
ERROR: could not translate host name "db" to address
```

**Solution:**
```bash
# Ensure PostgreSQL is healthy
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Verify connection parameters in .env
```

### Issue: "Changes not reflecting"

**Solution:**
```bash
# Rebuild images
docker-compose down -v
docker-compose up --build

# Or if just code changes:
docker-compose restart backend
docker-compose restart frontend
```

## Development Workflow

### Making Backend Changes

```bash
# Edit backend code
# Changes are auto-reflected due to volume mount

# To apply changes:
docker-compose restart backend

# Or check logs if something's wrong:
docker-compose logs -f backend
```

### Making Frontend Changes

```bash
# Edit frontend code
# Changes are auto-reflected due to Vite hot reload

# If needed, restart:
docker-compose restart frontend

# Clear browser cache if needed:
# Ctrl + Shift + Delete (Windows/Linux)
# Cmd + Shift + Delete (macOS)
```

### Making Database Schema Changes

```bash
# Edit models.py

# Then drop and recreate tables:
docker-compose restart backend

# Or manually:
docker-compose exec db psql -U postgres
# DROP TABLE order_items;
# DROP TABLE orders;
# DROP TABLE customers;
# DROP TABLE products;
# \q

# Restart backend to recreate tables:
docker-compose restart backend
```

## Performance Tips

1. **Use Alpine Images**: Already configured for smaller size
2. **Clean Up Old Images**: `docker image prune`
3. **Limit Logs**: Use `docker-compose logs --tail=100`
4. **Resource Limits**: Modify docker-compose.yml if needed
5. **Database Optimization**: Add indexes for frequently queried columns

## Next Steps

1. ✅ Application is running
2. 📖 Read [README.md](README.md) for full documentation
3. 🔧 Check [API_EXAMPLES.md](API_EXAMPLES.md) for API usage examples
4. 🚀 Deploy to production (see README.md)
5. 🔐 Implement authentication and authorization
6. 📊 Add monitoring and logging

## Getting Help

- Check [README.md](README.md) for feature documentation
- Review [API_EXAMPLES.md](API_EXAMPLES.md) for usage examples
- Check logs: `docker-compose logs -f`
- Verify .env configuration
- Ensure Docker and Docker Compose are properly installed

## Quick Reference

```bash
# Development workflow
docker-compose up -d --build        # Start
docker-compose logs -f              # Monitor
docker-compose exec backend sh       # Debug backend
docker-compose exec frontend sh      # Debug frontend
docker-compose down                 # Clean up

# Production deployment
# See README.md for detailed instructions
```

Happy developing! 🚀
