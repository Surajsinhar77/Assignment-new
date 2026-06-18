# Inventory & Order Management System

A production-ready full-stack application for managing products, customers, and orders with containerized deployment using Docker and Docker Compose.

## Features

✨ **Product Management**
- Create, read, update, and delete products
- Unique SKU/code per product
- Real-time inventory tracking
- Low stock alerts

📦 **Customer Management**
- Create, read, and delete customers
- Unique email validation
- Customer contact information
- Order history tracking

📋 **Order Management**
- Create and manage orders
- Multi-item orders support
- Automatic inventory deduction
- Automatic total calculation
- Order cancellation with inventory restoration

📊 **Dashboard**
- Real-time statistics (products, customers, orders)
- Low stock alerts
- Inventory value calculation
- Visual summary cards

🐳 **Containerization**
- Production-ready Docker setup
- Docker Compose orchestration
- PostgreSQL persistence with named volumes
- Health checks for all services

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL with Alpine base

## Project Structure

```
.
├── backend/                          # FastAPI application
│   ├── main.py                      # Application entry point
│   ├── config.py                    # Configuration
│   ├── database.py                  # Database setup
│   ├── models.py                    # SQLAlchemy models
│   ├── schemas.py                   # Pydantic schemas
│   ├── routes_products.py           # Product endpoints
│   ├── routes_customers.py          # Customer endpoints
│   ├── routes_orders.py             # Order endpoints
│   ├── routes_stats.py              # Statistics endpoints
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend container
│   └── .dockerignore               # Docker build exclusions
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Dashboard page
│   │   │   ├── Products.jsx         # Products page
│   │   │   ├── Customers.jsx        # Customers page
│   │   │   └── Orders.jsx           # Orders page
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── styles/                  # Component styles
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/                       # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── .env                         # Environment variables
│   ├── Dockerfile                   # Frontend container
│   └── .dockerignore               # Docker build exclusions
│
├── docker-compose.yml               # Docker Compose configuration
├── .env                             # Environment variables
├── .gitignore                       # Git exclusions
└── README.md                        # This file
```

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Assignment-new
```

### 2. Configure Environment Variables
The `.env` file is pre-configured with default values. You can modify it as needed:

```bash
# For production, update these values:
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_password@db:5432/inventory_db
```

### 3. Build and Start Services
```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## API Endpoints

### Products
- `GET /products` - Retrieve all products
- `GET /products/{id}` - Retrieve a specific product
- `POST /products` - Create a new product
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product

### Customers
- `GET /customers` - Retrieve all customers
- `GET /customers/{id}` - Retrieve a specific customer
- `POST /customers` - Create a new customer
- `DELETE /customers/{id}` - Delete a customer

### Orders
- `GET /orders` - Retrieve all orders
- `GET /orders/{id}` - Retrieve order details
- `POST /orders` - Create a new order
- `DELETE /orders/{id}` - Cancel an order

### Statistics
- `GET /stats/dashboard` - Get dashboard statistics

### Health
- `GET /health` - Health check endpoint

## Database Schema

### Products Table
```sql
- id: Integer (Primary Key)
- name: String (255)
- sku: String (100, Unique)
- price: Numeric (10,2)
- quantity: Integer
- created_at: DateTime
- updated_at: DateTime
```

### Customers Table
```sql
- id: Integer (Primary Key)
- name: String (255)
- email: String (255, Unique)
- phone: String (20)
- created_at: DateTime
- updated_at: DateTime
```

### Orders Table
```sql
- id: Integer (Primary Key)
- customer_id: Integer (Foreign Key)
- total_amount: Numeric (10,2)
- status: String (50)
- created_at: DateTime
- updated_at: DateTime
```

### Order Items Table
```sql
- id: Integer (Primary Key)
- order_id: Integer (Foreign Key)
- product_id: Integer (Foreign Key)
- quantity: Integer
- unit_price: Numeric (10,2)
- subtotal: Numeric (10,2)
```

## Business Logic Rules

✅ **Implemented Validations:**
- ✓ Product SKU must be unique
- ✓ Customer email must be unique
- ✓ Product quantity cannot be negative
- ✓ Orders cannot be placed if inventory is insufficient
- ✓ Creating an order automatically reduces available stock
- ✓ Total order amount is calculated automatically by the backend
- ✓ All APIs include proper error handling
- ✓ Appropriate HTTP status codes are used
- ✓ All request data is validated before processing
- ✓ Order cancellation restores inventory

## Docker Compose Services

### Database Service (db)
- Image: `postgres:15-alpine`
- Container Name: `inventory_db`
- Port: 5432
- Volume: `postgres_data` (persisted)
- Health Check: Enabled

### Backend Service (backend)
- Build: `./backend/Dockerfile`
- Container Name: `inventory_backend`
- Port: 8000
- Depends On: `db` (with health check)
- Health Check: HTTP endpoint
- Volumes: Live reload enabled

### Frontend Service (frontend)
- Build: `./frontend/Dockerfile`
- Container Name: `inventory_frontend`
- Port: 3000
- Depends On: `backend`
- Volumes: Live reload enabled

## Common Commands

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Remove volumes (including database)
docker-compose down -v

# Rebuild images
docker-compose build

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec db psql -U postgres

# View logs
docker-compose logs -f
docker-compose logs -f backend

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

## Development

### Backend Development
```bash
# Access backend container
docker-compose exec backend sh

# Run tests (if implemented)
docker-compose exec backend pytest

# Access Python shell
docker-compose exec backend python
```

### Frontend Development
```bash
# Access frontend container
docker-compose exec frontend sh

# Run development server (runs by default)
npm run dev

# Build for production
npm run build
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U postgres -d inventory_db

# Useful queries
SELECT * FROM products;
SELECT * FROM customers;
SELECT * FROM orders;
SELECT * FROM order_items;
```

## Deployment

### Environment Configuration for Production
```bash
POSTGRES_PASSWORD=strong_password_here
DATABASE_URL=postgresql://postgres:strong_password_here@db:5432/inventory_db
ENVIRONMENT=production
```

### Deployment Steps
1. Update `.env` with production values
2. Build images: `docker-compose build`
3. Push to container registry
4. Deploy using docker-compose or Kubernetes

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Security Considerations

⚠️ **For Production:**
- Change default PostgreSQL password
- Use environment variables for sensitive data
- Enable HTTPS
- Implement authentication and authorization
- Use secrets management (AWS Secrets Manager, Vault, etc.)
- Implement rate limiting
- Add request validation middleware
- Use CORS carefully (currently allows localhost:3000)

## Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=8001
DB_PORT=5433
```

### Database Connection Error
```bash
# Check database service health
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Cannot Connect to Backend
```bash
# Verify backend is running and healthy
curl http://localhost:8000/health

# Check VITE_API_URL environment variable in frontend .env
```