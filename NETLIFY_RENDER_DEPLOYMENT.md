# Deployment Guide: Netlify + Render

Complete guide to deploy the Inventory & Order Management System with:
- **Frontend** on Netlify (Free)
- **Backend** on Render (Free)

---

## 📊 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    USER BROWSERS                         │
└────────────────────────┬─────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼───────────────┐      ┌─────────▼──────────┐
   │    NETLIFY         │      │      RENDER        │
   │  (Frontend)        │      │    (Backend API)   │
   │                    │      │                    │
   │ Your-app.         │      │ Your-app-backend.  │
   │ netlify.app       │◄────►│ onrender.com       │
   │                    │      │                    │
   │ React + Vite      │      │ FastAPI + Python   │
   │ Build: npm build  │      │ PostgreSQL (Render)│
   │                    │      │                    │
   └────────────────────┘      └────────────────────┘
```

---

## 🚀 Deployment Steps

### STEP 1: Prepare Your Code

#### 1a. Initialize Git Repository
```bash
cd /Users/surajkumar/Documents/Assignment/Assignment-new
git init
git add .
git commit -m "Initial commit: Inventory Management System"
```

#### 1b. Create GitHub Repository
1. Go to https://github.com/new
2. Create repository name: `inventory-management`
3. Do NOT initialize with README (you have one)
4. Click "Create repository"

#### 1c. Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/inventory-management.git
git branch -M main
git push -u origin main
```

---

## 📱 STEP 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### 2.2 Create PostgreSQL Database
1. On Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name**: `inventory-db`
   - **Database**: `inventory_db`
   - **User**: `postgres`
   - **Region**: Choose closest region
   - **Plan**: Free
4. Click "Create Database"
5. **Wait** for database to be created (2-5 minutes)
6. Once created, **copy the connection string** (you'll need it)

Example connection string:
```
postgresql://postgres:XXXXXXXXXXXX@dpg-xxxx-xxxxx.onrender.com/inventory_db
```

### 2.3 Create Backend Web Service
1. On Render dashboard, click "New +"
2. Select "Web Service"
3. Connect to GitHub repository
4. Configure:
   - **Name**: `inventory-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### 2.4 Configure Environment Variables for Backend
1. In Web Service settings, go to "Environment"
2. Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Paste PostgreSQL connection string | From step 2.2 |
| `ENVIRONMENT` | `production` | |
| `PYTHONUNBUFFERED` | `1` | |
| `CORS_ORIGINS` | `https://your-app.netlify.app` | Update after frontend deployment |

**⚠️ IMPORTANT**: Update `CORS_ORIGINS` after you get your Netlify URL

### 2.5 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, your backend URL will be:
   ```
   https://your-app-name.onrender.com
   ```

**Note**: Save this URL - you'll need it for frontend deployment

### 2.6 Test Backend
```bash
# Health check
curl https://your-app-name.onrender.com/health

# API Documentation
https://your-app-name.onrender.com/docs
```

---

## 🎨 STEP 3: Deploy Frontend on Netlify

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### 3.2 Update Frontend Environment Variable
1. Open `frontend/.env.production`
2. Update with your Render backend URL:
   ```bash
   VITE_API_URL=https://your-app-name.onrender.com
   ```
3. Commit and push to GitHub:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL for production"
   git push origin main
   ```

### 3.3 Create Netlify Site
1. On Netlify dashboard, click "Add new site"
2. Select "Import an existing project"
3. Connect to GitHub
4. Select your `inventory-management` repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18.16.0`

### 3.4 Configure Netlify Environment Variables
1. Go to Site settings → Build & Deploy → Environment
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app-name.onrender.com`

### 3.5 Deploy Frontend
1. Click "Deploy site"
2. Wait for deployment (2-5 minutes)
3. Once deployed, your frontend URL will be:
   ```
   https://your-app.netlify.app
   ```

### 3.6 Test Frontend
```bash
# Open in browser
https://your-app.netlify.app
```

---

## 🔄 STEP 4: Connect Frontend and Backend

### 4.1 Update Backend CORS
1. Go to Render → Backend service
2. Edit environment variables
3. Update `CORS_ORIGINS` to your Netlify URL:
   ```
   https://your-app.netlify.app
   ```
4. Click "Save"
5. Service will auto-redeploy

### 4.2 Verify Connection
1. Open frontend: https://your-app.netlify.app
2. Try creating a product
3. Should work without errors
4. Check browser console for any errors

---

## 🧪 STEP 5: Testing

### Test Checklist
- [ ] Frontend loads without errors
- [ ] Dashboard shows statistics
- [ ] Can create a product
- [ ] Can create a customer
- [ ] Can create an order
- [ ] Order reduces inventory
- [ ] Can view orders
- [ ] Can delete items

### Quick Test Flow
1. Create Product: Name="Laptop", SKU="SKU-001", Price=999.99, Qty=50
2. Create Customer: Name="John Doe", Email="john@example.com", Phone="+1234567890"
3. Create Order: Select customer, add product (qty 2)
4. Verify: Product quantity reduced to 48
5. View Dashboard: Should show stats

---

## 🐛 Troubleshooting

### Frontend Loads but Shows Errors

**Error**: "API is down" or network errors

**Solution**:
1. Check backend is running on Render
2. Verify `VITE_API_URL` in frontend environment
3. Check browser console for exact error
4. Verify CORS settings in backend

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
1. Go to Render backend service
2. Edit environment: Update `CORS_ORIGINS`
3. Ensure it matches your Netlify URL
4. Redeploy

### Database Connection Error

**Error**: "could not connect to server"

**Solution**:
1. Verify `DATABASE_URL` on Render
2. Check PostgreSQL service is running
3. Copy full connection string (including password)
4. Restart backend service

### Build Failures

**Frontend build failed**:
1. Check build command: `npm install && npm run build`
2. Verify `package.json` has correct scripts
3. Check Node version: 18.16.0

**Backend build failed**:
1. Check `requirements.txt` has all dependencies
2. Verify start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Check Python version: 3.11

---

## 📝 Environment Variable Reference

### Backend (Render)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
ENVIRONMENT=production
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://your-app.netlify.app
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-app-name.onrender.com
```

### Local Development
```
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
ENVIRONMENT=development

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## 🔐 Security Checklist

- [ ] Database password is strong
- [ ] No secrets committed to GitHub
- [ ] `.env` files in `.gitignore`
- [ ] CORS restricted to Netlify domain
- [ ] Database backups enabled (Render)
- [ ] HTTPS enforced (automatic on both platforms)

---

## 📊 Monitoring

### Render Logs
1. Go to Web Service
2. Click "Logs" to view real-time logs
3. Check for errors

### Netlify Logs
1. Go to Site → Deploys
2. Click recent deployment
3. View build logs

### Health Checks
```bash
# Backend health
curl https://your-app-name.onrender.com/health

# Frontend (should load without errors)
https://your-app.netlify.app
```

---

## 🚀 Auto-Deployment

Both platforms support auto-deployment:

### Netlify
- Automatically deploys when you push to `main` branch
- You can see deployment status on https://app.netlify.com

### Render
- Automatically deploys when you push to `main` branch
- You can see deployment status on Render dashboard

**Workflow**:
```bash
# Make changes locally
vim backend/routes_products.py

# Commit and push
git add .
git commit -m "Fix bug in products endpoint"
git push origin main

# Both services auto-deploy!
```

---

## 📈 Free Tier Limitations

### Render (Free)
- Backend service spins down after 15 minutes of inactivity
- PostgreSQL database has 1 GB storage
- Limited bandwidth

**Note**: First request may take 30 seconds (cold start)

### Netlify (Free)
- 100 GB bandwidth/month
- Unlimited builds
- Full CI/CD pipeline

---

## 💰 Cost After Free Tier

### Render
- Backend web service: $7/month (upgrade from free)
- PostgreSQL: $15/month (upgrade from free)
- Estimated: ~$22/month for production

### Netlify
- Stays free for most use cases
- Advanced features: $19/month

### Alternative Free Platforms
If you need always-on backend:
- Railway: https://railway.app (free tier available)
- Fly.io: https://fly.io (free tier available)

---

## 📚 Useful Links

| Platform | Links |
|----------|-------|
| **Netlify** | [Dashboard](https://app.netlify.com) • [Docs](https://docs.netlify.com) |
| **Render** | [Dashboard](https://dashboard.render.com) • [Docs](https://render.com/docs) |
| **GitHub** | [Your Repo](https://github.com/YOUR_USERNAME/inventory-management) |

---

## 🔄 Common Tasks After Deployment

### Update Backend Code
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-deploys!
```

### Update Frontend Code
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Netlify auto-deploys!
```

### Update Environment Variables
1. Go to platform dashboard
2. Edit environment variables
3. Service auto-redeploys

### Database Backup
1. Render PostgreSQL → Backups
2. Automatic daily backups enabled
3. Manual backup: Export connection string

---

## ✅ Deployment Checklist

- [ ] Code committed to GitHub
- [ ] GitHub repository created and pushed
- [ ] Render account created
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed on Render
- [ ] Backend environment variables configured
- [ ] Backend tested (health check working)
- [ ] Netlify account created
- [ ] Frontend environment variable updated
- [ ] Frontend deployed on Netlify
- [ ] Frontend tested (loads without errors)
- [ ] Backend CORS updated with Netlify URL
- [ ] Full end-to-end testing completed
- [ ] Application working in production

---

## 🎉 You're Done!

Your application is now live! 

**Access:**
- Frontend: https://your-app.netlify.app
- Backend API: https://your-app-name.onrender.com
- API Docs: https://your-app-name.onrender.com/docs

**Share with others:**
```
Frontend: https://your-app.netlify.app
Backend: https://your-app-name.onrender.com
```

---

## 💡 Next Steps

1. Monitor applications (check logs regularly)
2. Set up error tracking (e.g., Sentry)
3. Implement authentication
4. Add email notifications
5. Optimize performance
6. Scale to production tier when needed

---

**Happy Deploying! 🚀**
