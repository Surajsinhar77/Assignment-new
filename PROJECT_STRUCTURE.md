# Project Structure & Architecture

## Overview

This is a full-stack Inventory & Order Management System with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│                    (Port: 3000)                             │
│  • Dashboard, Products, Customers, Orders Management       │
│  • Built with Vite + React Router                          │
│  • Responsive UI with CSS Grid/Flexbox                     │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST API (Axios)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  FastAPI Backend                            │
│                   (Port: 8000)                              │
│  • RESTful API endpoints                                    │
│  • Business logic & validation                             │
│  • SQLAlchemy ORM with PostgreSQL                          │
│  • CORS middleware for frontend integration                │
└────────────────┬────────────────────────────────────────────┘
                 │ SQL Queries
                 │
┌────────────────▼────────────────────────────────────────────┐
│               PostgreSQL Database                           │
│                 (Port: 5432)                               │
│  • Persistent volume storage                               │
│  • 4 main tables: Products, Customers, Orders, OrderItems  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
Assignment-new/                          # Root directory
│
├── backend/                              # FastAPI application
│   ├── main.py                          # FastAPI app entry point
│   ├── config.py                        # Configuration & settings
│   ├── database.py                      # Database connection setup
│   ├── models.py                        # SQLAlchemy ORM models
│   ├── schemas.py                       # Pydantic request/response schemas
│   ├── routes_products.py               # Product endpoints (/products)
│   ├── routes_customers.py              # Customer endpoints (/customers)
│   ├── routes_orders.py                 # Order endpoints (/orders)
│   ├── routes_stats.py                  # Statistics endpoints (/stats)
│   ├── requirements.txt                 # Python dependencies
│   ├── Dockerfile                       # Docker image for backend
│   ├── .dockerignore                    # Files to exclude from Docker build
│   └── .env                             # Environment variables (git ignored)
│
├── frontend/                             # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Dashboard page with statistics
│   │   │   ├── Products.jsx             # Products management page
│   │   │   ├── Customers.jsx            # Customers management page
│   │   │   └── Orders.jsx               # Orders management page
│   │   ├── services/
│   │   │   └── api.js                   # Axios API client & endpoints
│   │   ├── styles/
│   │   │   ├── Products.css
│   │   │   ├── Customers.css
│   │   │   ├── Orders.css
│   │   │   └── Dashboard.css
│   │   ├── App.jsx                      # Main App component with navigation
│   │   ├── main.jsx                     # Entry point & routing setup
│   │   └── index.css                    # Global styles
│   ├── public/                           # Static assets
│   ├── index.html                       # HTML template
│   ├── package.json                     # Node.js dependencies & scripts
│   ├── vite.config.js                   # Vite build configuration
│   ├── Dockerfile                       # Docker image for frontend
│   ├── .dockerignore                    # Files to exclude from Docker build
│   └── .env                             # Environment variables
│
├── docker-compose.yml                   # Docker Compose orchestration
├── .env                                 # Root environment variables
├── .gitignore                           # Git exclusions
│
├── README.md                            # Full documentation
├── SETUP.md                             # Detailed setup guide
├── API_EXAMPLES.md                      # API usage examples with curl
├── DEPLOYMENT.md                        # Deployment guide for various platforms
│
├── Makefile                             # Convenience commands
├── quickstart.sh                        # Quick start script (executable)
├── setup-dev.sh                         # Development setup script
├── cleanup.sh                           # Cleanup script
├── db-manage.sh                         # Database management script
│
└── PROJECT_STRUCTURE.md                 # This file
```

## Backend Architecture

### Models (SQLAlchemy ORM)

```
Product
├── id (Primary Key)
├── name
├── sku (Unique Index)
├── price
├── quantity
├── created_at
├── updated_at
└── order_items (Relationship)

Customer
├── id (Primary Key)
├── name
├── email (Unique Index)
├── phone
├── created_at
├── updated_at
└── orders (Relationship)

Order
├── id (Primary Key)
├── customer_id (Foreign Key)
├── total_amount
├── status
├── created_at
├── updated_at
├── customer (Relationship)
└── items (Relationship - OrderItem[])

OrderItem
├── id (Primary Key)
├── order_id (Foreign Key)
├── product_id (Foreign Key)
├── quantity
├── unit_price
├── subtotal
├── product (Relationship)
└── order (Relationship)
```

### API Endpoints Structure

```
/products
├── POST   - Create product
├── GET    - Get all products (paginated)
├── /{id}
│   ├── GET    - Get product by ID
│   ├── PUT    - Update product
│   └── DELETE - Delete product

/customers
├── POST   - Create customer
├── GET    - Get all customers (paginated)
├── /{id}
│   ├── GET    - Get customer by ID
│   └── DELETE - Delete customer

/orders
├── POST   - Create order
├── GET    - Get all orders (paginated)
├── /{id}
│   ├── GET    - Get order with details
│   └── DELETE - Cancel order (restore inventory)

/stats
└── /dashboard
    └── GET    - Get dashboard statistics

/health
└── GET    - Health check endpoint
```

### Request/Response Flow

```
Client Request
    ↓
FastAPI Route Handler
    ↓
Input Validation (Pydantic Schema)
    ↓
Business Logic Layer
    ↓
Database Query (SQLAlchemy)
    ↓
PostgreSQL Execute
    ↓
Result Processing
    ↓
Output Serialization (Pydantic Schema)
    ↓
JSON Response
    ↓
Client Receives Response
```

## Frontend Architecture

### Component Hierarchy

```
<BrowserRouter>
  └── <Routes>
      ├── <Dashboard />
      ├── <Products />
      ├── <Customers />
      └── <Orders />
```

### Page Components

1. **Dashboard.jsx**
   - Fetches stats from `/stats/dashboard`
   - Displays total products, customers, orders
   - Shows low stock alerts
   - Grid-based card layout

2. **Products.jsx**
   - CRUD operations for products
   - Add/Edit/Delete functionality
   - Table display with pagination support
   - Form validation

3. **Customers.jsx**
   - CRUD operations for customers
   - Add/Delete functionality
   - Table display with pagination support
   - Email uniqueness validation

4. **Orders.jsx**
   - Create orders with multiple items
   - Dynamic item selection
   - Inventory validation
   - Auto-calculated totals
   - Order viewing and cancellation

### API Integration

```javascript
// services/api.js
├── productsAPI
│   ├── getAll()
│   ├── getById()
│   ├── create()
│   ├── update()
│   └── delete()
├── customersAPI
│   ├── getAll()
│   ├── getById()
│   ├── create()
│   └── delete()
├── ordersAPI
│   ├── getAll()
│   ├── getById()
│   ├── create()
│   └── delete()
└── statsAPI
    └── getDashboard()
```

## Data Flow

### Creating a Product

```
Frontend (Products.jsx)
    ↓ form submission
Client-side Validation
    ↓ valid data
API Call: POST /products
    ↓
Backend (routes_products.py)
    ↓ input validation (Pydantic)
Check SKU Uniqueness
    ↓ SKU not in DB
Create Product Model
    ↓
Save to PostgreSQL
    ↓ success
Return Product JSON
    ↓
Frontend Updates State
    ↓
UI Re-renders with new product
```

### Creating an Order

```
Frontend (Orders.jsx)
    ↓ select customer & items
Client-side Validation
    ↓ valid order data
API Call: POST /orders
    ↓
Backend (routes_orders.py)
    ↓ input validation
Verify Customer Exists
    ↓
For Each Item:
  ├── Verify Product Exists
  ├── Check Inventory Sufficient
  └── Calculate Subtotal
    ↓
Calculate Total Amount
    ↓
Create Order in DB
    ↓
For Each Item:
  ├── Create OrderItem in DB
  └── Reduce Product Quantity
    ↓
Commit Transaction
    ↓
Return Order JSON
    ↓
Frontend Updates State
    ↓
UI Shows Success Message
```

## Database Schema Relationships

```
                      ┌──────────────┐
                      │  Customers   │
                      │   (id: PK)   │
                      │ (email: UQ)  │
                      └──────┬───────┘
                             │ 1
                             │
                          1:N │
                             │
                      ┌──────▼───────┐
                      │    Orders    │
                      │   (id: PK)   │
                      │ (cust_id: FK)│
                      └──────┬───────┘
                             │ 1
                             │
                          1:N │
                             │
                      ┌──────▼────────┐
                      │  OrderItems   │
                      │   (id: PK)    │
                      │ (order_id: FK)│
                      │(product_id: FK)
                      └──────┬────────┘
                             │ N
                             │
                          N:1 │
                             │
                      ┌──────▼──────┐
                      │  Products    │
                      │   (id: PK)   │
                      │  (sku: UQ)   │
                      └─────────────┘
```

## Deployment Architecture

### Docker Compose Services

```
┌─────────────────────────────────────────────────────────┐
│              Docker Compose Network                     │
│            (inventory-network - bridge)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │   Frontend       │  │    Backend       │          │
│  │  (React/Vite)    │  │  (FastAPI)       │          │
│  │  Port: 3000      │  │  Port: 8000      │          │
│  │  Volume: /app    │  │  Volume: /app    │          │
│  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                    │
│           │     HTTP/REST      │                    │
│           └──────────┬──────────┘                    │
│                      │                              │
│                      │                              │
│            ┌─────────▼─────────┐                   │
│            │    PostgreSQL     │                   │
│            │  (Port: 5432)     │                   │
│            │  Volume: postgres_data                │
│            └───────────────────┘                   │
│                                                    │
└─────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Backend Dependencies
- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **sqlalchemy**: ORM
- **psycopg2**: PostgreSQL adapter
- **pydantic**: Data validation
- **python-dotenv**: Environment variables
- **python-multipart**: Form data parsing

### Frontend Dependencies
- **react**: UI library
- **react-dom**: DOM rendering
- **react-router-dom**: Routing
- **axios**: HTTP client
- **vite**: Build tool

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Orchestration
- **PostgreSQL**: Database
- **Alpine Linux**: Lightweight OS base

## Performance Considerations

1. **Database Indexes**
   - SKU indexed for quick product lookup
   - Email indexed for customer lookup
   - Foreign keys automatically indexed

2. **Pagination**
   - All list endpoints support skip/limit
   - Reduces memory usage with large datasets

3. **Connection Pooling**
   - SQLAlchemy manages connection pool
   - Reuses database connections

4. **Caching** (Future Enhancement)
   - Could add Redis for frequently accessed data
   - Dashboard stats could be cached

5. **Image Optimization**
   - Alpine-based Docker images (small size)
   - Multi-stage builds for frontend

## Security Features

1. **Input Validation**
   - Pydantic schemas validate all requests
   - Email format validation
   - Type checking

2. **Error Handling**
   - No sensitive error details exposed
   - Proper HTTP status codes

3. **CORS**
   - Configured for specific origins
   - Can be restricted in production

4. **Database**
   - Parameterized queries prevent SQL injection
   - No hardcoded credentials

5. **Environment Secrets**
   - Sensitive data in .env
   - Not committed to git

## Scalability Path

### Current State (Single Instance)
- Suitable for small to medium deployments
- Single backend, single frontend, single database

### Horizontal Scaling
- Load balancer (nginx, HAProxy)
- Multiple backend instances
- Database replication
- Caching layer (Redis)

### Vertical Scaling
- Larger container resources
- Connection pool optimization
- Database optimization

### Geographic Scaling
- Multi-region deployment
- Database replication across regions
- CDN for static assets

## Monitoring & Logging (Future)

```
Application Logs
    ↓
Log Aggregation (ELK, Splunk, etc.)
    ↓
Monitoring Dashboard (Grafana, Datadog, etc.)
    ↓
Alerts & Notifications
```

## Development Workflow

```
Feature Branch
    ↓
Local Development (docker-compose)
    ↓
Testing
    ↓
Code Review
    ↓
Merge to Main
    ↓
CI/CD Pipeline (future)
    ↓
Auto Deploy
    ↓
Production
```

## File Sizes & Performance

- Frontend build: ~500KB (minified)
- Backend image: ~200MB
- Frontend image: ~150MB (with dependencies)
- Database: ~50MB (initial)

## Architecture Principles

1. **Separation of Concerns**: Backend logic, Frontend UI, Database
2. **RESTful Design**: Standard HTTP methods and status codes
3. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
4. **SOLID**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
5. **Container-First**: Everything runs in Docker
6. **Configuration as Code**: docker-compose.yml, environment files
7. **Health Checks**: All services have health endpoints
8. **Graceful Degradation**: Services handle failures gracefully

---

For more details, see:
- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Setup instructions
- [API_EXAMPLES.md](API_EXAMPLES.md) - API usage examples
