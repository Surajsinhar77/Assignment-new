# Project Structure for Cloud Deployment

This document explains the folder structure and what each part does for Netlify + Render deployment.

---

## 📁 Complete Folder Structure

```
Assignment-new/                                  # Root project folder
│
├── 📁 backend/                                  # DEPLOYED ON RENDER
│   ├── main.py                                 # FastAPI app entry point
│   ├── config.py                               # Configuration (reads environment)
│   ├── database.py                             # Database connection
│   ├── models.py                               # Database models (SQLAlchemy)
│   ├── schemas.py                              # Request/response validation
│   ├── routes_products.py                      # Product API endpoints
│   ├── routes_customers.py                     # Customer API endpoints
│   ├── routes_orders.py                        # Order API endpoints
│   ├── routes_stats.py                         # Statistics endpoints
│   ├── requirements.txt                        # Python dependencies (Render uses this)
│   ├── Dockerfile                              # Docker image definition
│   ├── .dockerignore                           # Files to exclude from Docker
│   ├── .env.production                         # Environment template (reference)
│   └── .env                                    # Local dev environment
│
├── 📁 frontend/                                 # DEPLOYED ON NETLIFY
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx                   # Dashboard page
│   │   │   ├── Products.jsx                    # Product management page
│   │   │   ├── Customers.jsx                   # Customer management page
│   │   │   └── Orders.jsx                      # Order management page
│   │   ├── 📁 services/
│   │   │   └── api.js                          # API client (calls Render backend)
│   │   ├── 📁 styles/
│   │   │   ├── Products.css
│   │   │   ├── Customers.css
│   │   │   ├── Orders.css
│   │   │   └── Dashboard.css
│   │   ├── App.jsx                             # Main App component
│   │   ├── main.jsx                            # React entry point
│   │   └── index.css                           # Global CSS
│   ├── index.html                              # HTML template (Netlify serves this)
│   ├── package.json                            # Node dependencies
│   ├── vite.config.js                          # Vite build config
│   ├── Dockerfile                              # Docker image (for local testing)
│   ├── .dockerignore                           # Docker exclusions
│   ├── .env                                    # Local dev: http://localhost:8000
│   ├── .env.local                              # Local dev (Netlify ignores)
│   ├── .env.production                         # Production: https://backend.onrender.com
│   └── .gitignore                              # Git exclusions
│
├── 🐳 DOCKER SETUP (LOCAL DEVELOPMENT ONLY)
│   ├── docker-compose.yml                      # Runs all services locally
│   ├── Dockerfile (backend & frontend)         # Container definitions
│   └── PostgreSQL volume                       # Local database
│
├── ☁️ NETLIFY DEPLOYMENT
│   ├── netlify.toml                            # Netlify config (build + redirects)
│   ├── frontend/.env.production                # API URL pointing to Render
│   └── frontend/vite.config.js                 # Vite builds to 'dist' folder
│
├── ☁️ RENDER DEPLOYMENT
│   ├── render.yaml                             # Render config (reference)
│   ├── backend/requirements.txt                # Dependencies (Render installs)
│   ├── backend/main.py                         # Runs on Render
│   └── backend/.env.production                 # Environment template
│
├── 📚 DOCUMENTATION
│   ├── README.md                               # Main documentation
│   ├── SETUP.md                                # Local setup guide
│   ├── INDEX.md                                # Documentation index
│   ├── PROJECT_STRUCTURE.md                    # Architecture overview
│   ├── API_EXAMPLES.md                         # API usage examples
│   ├── DEPLOYMENT.md                           # General deployment info
│   ├── NETLIFY_RENDER_DEPLOYMENT.md            # Step-by-step guide
│   ├── DEPLOYMENT_COMMANDS.md                  # Quick commands reference
│   ├── COMPLETION_SUMMARY.md                   # Project summary
│   └── PROJECT_STRUCTURE_DEPLOYMENT.md         # This file
│
├── 🛠️ SCRIPTS & CONFIG
│   ├── Makefile                                # Make commands
│   ├── quickstart.sh                           # Quick start script
│   ├── setup-dev.sh                            # Dev setup
│   ├── cleanup.sh                              # Cleanup utility
│   ├── db-manage.sh                            # Database management
│   ├── .env                                    # Root environment config
│   ├── .gitignore                              # Git exclusions (SECRET)
│   └── .git/                                   # Git repository
```

---

## 🎯 File Purpose by Context

### For Netlify Frontend Deployment

**Required Files:**
- `frontend/package.json` - Netlify installs dependencies
- `frontend/vite.config.js` - Netlify runs: `npm run build` → builds to `dist/`
- `frontend/index.html` - Entry HTML file
- `frontend/src/` - React components and code
- `netlify.toml` - Netlify configuration for build and redirects

**Environment Variables:**
- `frontend/.env.production` - Production API URL (Render backend)
- Set in Netlify Dashboard: `VITE_API_URL=https://your-app-name.onrender.com`

**Not Used:**
- `frontend/Dockerfile` - Only for local Docker testing
- `frontend/docker-compose.yml` - Only for local testing

---

### For Render Backend Deployment

**Required Files:**
- `backend/requirements.txt` - Render installs Python dependencies
- `backend/main.py` - Render runs: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- `backend/` - All Python files and logic
- `render.yaml` - Render configuration (reference)

**Environment Variables:**
- Set in Render Dashboard:
  - `DATABASE_URL` - Render PostgreSQL connection string
  - `ENVIRONMENT=production`
  - `PYTHONUNBUFFERED=1`
  - `CORS_ORIGINS=https://your-app.netlify.app`

**Not Used:**
- `backend/Dockerfile` - Only for local Docker testing
- `backend/docker-compose.yml` - Only for local testing

---

### For Local Docker Development

**Used Files:**
- `docker-compose.yml` - Defines all services
- `frontend/Dockerfile` - Frontend container
- `backend/Dockerfile` - Backend container
- `.env` - Local environment variables
- `frontend/.env` or `frontend/.env.local` - Frontend API URL
- `backend/.env` - Backend database URL

**Not Needed for Local Docker:**
- `netlify.toml` - Netlify-specific
- `render.yaml` - Render-specific
- `.env.production` files - For cloud, not local

---

## 🚀 Deployment Flow

### Step 1: Local Development (Docker Compose)
```
Code → Docker Compose → Local Services
├── Frontend: http://localhost:3000
├── Backend: http://localhost:8000
└── Database: localhost:5432
```

### Step 2: Push to GitHub
```
git push origin main
```

### Step 3: Netlify Frontend Auto-Deploys
```
GitHub Push
  ↓
Netlify Webhook Triggered
  ↓
Runs: cd frontend && npm install && npm run build
  ↓
Outputs to: dist/
  ↓
Serves on: https://your-app.netlify.app
```

### Step 4: Render Backend Auto-Deploys
```
GitHub Push
  ↓
Render Webhook Triggered
  ↓
Runs: pip install -r requirements.txt
  ↓
Runs: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
  ↓
Connects to: PostgreSQL on Render
  ↓
Serves on: https://your-app-name.onrender.com
```

### Step 5: Communication
```
Frontend (Netlify)
  ↓ HTTPS Request
  ├─ URL from: VITE_API_URL=https://your-app-name.onrender.com
  ↓
Backend (Render)
  ├─ Database: PostgreSQL (Render)
  ↓
Response sent back to Frontend
```

---

## 📊 Environment Variables Mapping

### Local Development
```
frontend/.env or .env.local:
  VITE_API_URL=http://localhost:8000

backend/.env:
  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
  ENVIRONMENT=development
```

### Production (Cloud)
```
Netlify Environment Variables:
  VITE_API_URL=https://your-app-name.onrender.com

Render Environment Variables:
  DATABASE_URL=postgresql://user:pass@dpg-xxxxx.onrender.com/inventory_db
  ENVIRONMENT=production
  PYTHONUNBUFFERED=1
  CORS_ORIGINS=https://your-app.netlify.app
```

---

## 🔄 File Dependencies

```
Frontend Depends On:
  ├── frontend/src/services/api.js uses VITE_API_URL
  ├── VITE_API_URL points to Backend on Render
  └── Backend must be running and CORS enabled

Backend Depends On:
  ├── backend/config.py uses DATABASE_URL
  ├── DATABASE_URL points to PostgreSQL on Render
  ├── CORS_ORIGINS should match Netlify URL
  └── CORS middleware needs frontend URL for requests

PostgreSQL Depends On:
  ├── Created automatically by Render
  ├── Connection string provided by Render
  └── Backend connects via DATABASE_URL
```

---

## 📝 File Size Overview

| Component | Size | Notes |
|-----------|------|-------|
| Backend Python | ~50 KB | Fast to install |
| Frontend build | ~500 KB | Optimized Vite build |
| Frontend dev dependencies | ~300 MB | Not deployed (only source) |
| Backend Python dependencies | ~100 MB | Not stored (installed at deploy) |

---

## 🎯 What Goes Where

### Netlify Gets
- `frontend/` folder
- `npm install && npm run build` output (dist folder)
- `.env` variables (VITE_API_URL)
- Serves static files + SPA routing

### Render Gets
- `backend/` folder
- `pip install -r requirements.txt` output
- PostgreSQL database (auto-created)
- Runs Python ASGI server

### GitHub Gets
- Complete source code
- `.gitignore` prevents secrets
- Webhooks trigger deployments

### Local Docker Gets
- Everything (for development/testing)
- Own PostgreSQL instance
- All services in isolated containers

---

## 🔐 Secrets Management

### Never Commit
```
❌ Database passwords
❌ API keys
❌ Secrets
```

### Use Environment Variables Instead
```
✅ Set in Netlify Dashboard
✅ Set in Render Dashboard
✅ Use .env files locally (git ignored)
```

### .gitignore Protects
```
.env                 → Local secrets
.env.local           → Local overrides
.env.production      → Template only (no secrets)
node_modules/        → Too large
dist/                → Build artifact
__pycache__/         → Python cache
```

---

## 📊 Typical Request Flow in Production

```
1. User opens: https://your-app.netlify.app
   ↓
2. Netlify serves React frontend (dist/index.html)
   ↓
3. React loads with VITE_API_URL=https://your-app-name.onrender.com
   ↓
4. User clicks "Create Product"
   ↓
5. Frontend makes request:
   POST https://your-app-name.onrender.com/products
   ↓
6. Render backend receives request
   ↓
7. Backend validates and saves to PostgreSQL
   ↓
8. Backend returns JSON response
   ↓
9. Frontend updates UI with response
   ↓
10. User sees "Product Created!"
```

---

## ✅ Deployment Checklist by File

### Frontend (Netlify)
- [ ] `package.json` - Has build scripts
- [ ] `vite.config.js` - Outputs to `dist`
- [ ] `index.html` - Entry template exists
- [ ] `src/` - React components present
- [ ] `netlify.toml` - Configuration present
- [ ] `.env.production` - API URL updated
- [ ] `frontend/src/services/api.js` - Uses VITE_API_URL
- [ ] `.gitignore` - Protects secrets

### Backend (Render)
- [ ] `requirements.txt` - All dependencies listed
- [ ] `main.py` - Entry point exists
- [ ] `config.py` - Reads environment variables
- [ ] `.env.production` - Template exists
- [ ] CORS configured - Allow Netlify URL
- [ ] Database connection - Works with Render PostgreSQL
- [ ] `.gitignore` - Protects .env

### Configuration
- [ ] `.env` root - For local development
- [ ] `.gitignore` - Secrets are protected
- [ ] `docker-compose.yml` - Local setup still works
- [ ] GitHub repo - Code pushed and accessible

---

## 🚀 Quick Deployment Map

```
┌─ DEVELOPMENT (Local Docker)
│  └─ docker-compose up
│     ├─ Frontend: localhost:3000
│     ├─ Backend: localhost:8000
│     └─ Database: localhost:5432

┌─ PRODUCTION (Cloud)
├─ Netlify (Frontend)
│  └─ https://your-app.netlify.app
│     ├─ Reads: VITE_API_URL env var
│     └─ Points to: Render backend
├─ Render (Backend)
│  └─ https://your-app-name.onrender.com
│     ├─ Reads: DATABASE_URL env var
│     ├─ Reads: CORS_ORIGINS env var
│     └─ Connects to: Render PostgreSQL
└─ Render (Database)
   └─ PostgreSQL 15
      └─ Accessed by: Backend only
```

---

## 📚 Related Documentation

- [NETLIFY_RENDER_DEPLOYMENT.md](NETLIFY_RENDER_DEPLOYMENT.md) - Step-by-step guide
- [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md) - Quick commands
- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment info
- [README.md](README.md) - Main documentation

---

**Everything is organized and ready for cloud deployment! 🚀**
