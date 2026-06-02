# Netlify & Render Deployment Cheat Sheet

Quick copy-paste commands for deploying to Netlify (Frontend) and Render (Backend).

---

## 🚀 Phase 1: GitHub Setup (First Time)

```bash
# Navigate to project
cd /Users/surajkumar/Documents/Assignment/Assignment-new

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Inventory Management System"

# Create GitHub repo at https://github.com/new
# Name: inventory-management
# Then copy the remote URL and run:

git remote add origin https://github.com/YOUR_USERNAME/inventory-management.git
git branch -M main
git push -u origin main

# ✅ Code is now on GitHub!
```

---

## ☁️ Phase 2: Render Backend Setup

### 2.1 Create PostgreSQL Database

**On Render Dashboard:**
1. Click "New +" → Select "PostgreSQL"
2. Name: `inventory-db`
3. Database: `inventory_db`
4. User: `postgres`
5. Plan: Free
6. Click "Create Database"
7. ⏳ Wait 2-5 minutes
8. 📋 Copy the connection string (looks like):
   ```
   postgresql://postgres:XXXXX@dpg-xxxxx.onrender.com/inventory_db
   ```

### 2.2 Deploy Backend Web Service

**On Render Dashboard:**
1. Click "New +" → Select "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - Name: `inventory-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free

### 2.3 Add Backend Environment Variables

**In Render Dashboard - Web Service Settings → Environment:**

```bash
DATABASE_URL=postgresql://postgres:XXXXX@dpg-xxxxx.onrender.com/inventory_db
ENVIRONMENT=production
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://your-app.netlify.app
```

⏳ **Wait 5-10 minutes for deployment**

### 2.4 Get Your Backend URL

After deployment, your backend URL is:
```
https://your-app-name.onrender.com
```

**Test it:**
```bash
curl https://your-app-name.onrender.com/health
# Should return: {"status": "healthy"}
```

---

## 🎨 Phase 3: Netlify Frontend Setup

### 3.1 Update Frontend Configuration

**Edit `frontend/.env.production`:**
```bash
VITE_API_URL=https://your-app-name.onrender.com
```

**Commit and push:**
```bash
cd /Users/surajkumar/Documents/Assignment/Assignment-new
git add frontend/.env.production
git commit -m "Update backend URL for production"
git push origin main
```

### 3.2 Deploy on Netlify

**On Netlify Dashboard:**
1. Click "Add new site" → "Import an existing project"
2. Connect your GitHub account
3. Select `inventory-management` repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Node version: `18.16.0`

### 3.3 Add Frontend Environment Variables

**In Netlify Dashboard - Site Settings → Build & Deploy → Environment:**

```bash
VITE_API_URL=https://your-app-name.onrender.com
```

⏳ **Wait 2-5 minutes for deployment**

### 3.4 Get Your Frontend URL

After deployment, your frontend URL is:
```
https://your-app.netlify.app
```

**Test it:**
```bash
curl https://your-app.netlify.app | head -20
# Should return HTML with page
```

---

## 🔄 Phase 4: Final Connection

### Update Backend CORS (After Frontend Deployment)

**In Render Dashboard - Web Service Environment Variables:**

Update `CORS_ORIGINS` to your Netlify URL:
```
CORS_ORIGINS=https://your-app.netlify.app
```

⏳ **Render auto-redeploys** (2-5 minutes)

---

## ✅ Phase 5: Testing

### Test Backend Health
```bash
curl https://your-app-name.onrender.com/health
# Response: {"status": "healthy"}
```

### Test Frontend Load
```bash
open https://your-app.netlify.app
# Should load without errors
```

### Test Full Integration
1. Open https://your-app.netlify.app
2. Create a Product:
   - Name: Laptop
   - SKU: SKU-001
   - Price: 999.99
   - Quantity: 50
3. Create a Customer:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
4. Create an Order:
   - Select customer
   - Add product (qty 2)
5. ✅ Should work without errors!

---

## 📤 Phase 6: Making Updates After Deployment

### Update Backend Code

```bash
# Make changes
vim backend/routes_products.py

# Push to GitHub
git add backend/
git commit -m "Fix: bug in products endpoint"
git push origin main

# ✅ Render auto-deploys!
# Check at: https://your-app-name.onrender.com/docs
```

### Update Frontend Code

```bash
# Make changes
vim frontend/src/pages/Dashboard.jsx

# Push to GitHub
git add frontend/
git commit -m "Improve: dashboard UI"
git push origin main

# ✅ Netlify auto-deploys!
# Check at: https://your-app.netlify.app
```

### Update Environment Variable

**For Backend (Render):**
1. Go to Render Dashboard
2. Web Service → Settings → Environment Variables
3. Edit variable
4. Click "Save"
5. Auto-redeploys (2-5 min)

**For Frontend (Netlify):**
1. Go to Netlify Dashboard
2. Site Settings → Build & Deploy → Environment
3. Edit variable
4. Click "Save"
5. Manually trigger deploy or auto-redeploys

---

## 🧪 Continuous Testing Commands

### Monitor Backend Logs
```bash
# Via Render Dashboard: 
# Web Service → Logs (real-time)

# Or curl to test:
curl https://your-app-name.onrender.com/health
curl https://your-app-name.onrender.com/products
curl https://your-app-name.onrender.com/stats/dashboard
```

### Monitor Frontend Logs
```bash
# Via Netlify Dashboard:
# Deploys → (select deployment) → Logs

# Or open in browser and check console:
open https://your-app.netlify.app
# Ctrl+Shift+J (or Cmd+Option+J on Mac) to open console
```

### Test CORS
```bash
# If you see CORS errors:
# 1. Check CORS_ORIGINS in Render environment
# 2. Verify it matches your Netlify URL exactly
# 3. Check browser console for exact error

curl -H "Origin: https://your-app.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  https://your-app-name.onrender.com/products
```

---

## 🐛 Troubleshooting Quick Fixes

### Frontend Shows "API Error"
```bash
# 1. Check VITE_API_URL in Netlify environment
# 2. Check backend is running:
curl https://your-app-name.onrender.com/health

# 3. Check browser console for exact error
# 4. Verify CORS_ORIGINS on Render backend
```

### Build Fails on Netlify
```bash
# Check build command:
# Should be: npm install && npm run build

# Check base directory: frontend

# Check publish directory: dist

# View logs in Netlify Dashboard
```

### Build Fails on Render
```bash
# Check build command:
# Should be: pip install -r requirements.txt

# Check start command:
# Should be: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT

# Check requirements.txt exists

# View logs in Render Dashboard
```

### Database Connection Error
```bash
# 1. Verify DATABASE_URL is correct
# 2. Copy full URL from Render PostgreSQL service
# 3. Include password!
# 4. Restart backend service
```

---

## 📊 URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://your-app.netlify.app | Main app |
| Backend API | https://your-app-name.onrender.com | REST API |
| API Docs | https://your-app-name.onrender.com/docs | Swagger UI |
| ReDoc | https://your-app-name.onrender.com/redoc | Alternative docs |
| GitHub Repo | https://github.com/YOUR_USERNAME/inventory-management | Source code |
| Render Dashboard | https://dashboard.render.com | Backend management |
| Netlify Dashboard | https://app.netlify.com | Frontend management |

---

## 🔑 Environment Variables Quick Reference

### On Render (Backend)
```
DATABASE_URL                    = postgresql://user:pass@host:5432/db
ENVIRONMENT                     = production
PYTHONUNBUFFERED               = 1
CORS_ORIGINS                   = https://your-app.netlify.app
```

### On Netlify (Frontend)
```
VITE_API_URL                   = https://your-app-name.onrender.com
```

### Locally (Development)
```
# frontend/.env:
VITE_API_URL=http://localhost:8000

# backend/.env:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
ENVIRONMENT=development
```

---

## ⚡ One-Command Updates

After initial setup, one-line updates:

```bash
# Update backend only
git add backend/ && git commit -m "Update backend" && git push origin main

# Update frontend only
git add frontend/ && git commit -m "Update frontend" && git push origin main

# Update both
git add . && git commit -m "Update: both frontend and backend" && git push origin main

# ✅ Both auto-deploy!
```

---

## 📱 Mobile Testing

After deployment, test on mobile:

```bash
# Get your IP address:
# macOS:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Then on mobile phone on same WiFi:
https://your-ip-address:3000
# (Only works if you've created local HTTPS certificate - for production just use deployed URL)

# Better: Just test the deployed URL
https://your-app.netlify.app
```

---

## 🔄 Deployment Timeline

| Task | Time |
|------|------|
| GitHub setup | 5 min |
| Render PostgreSQL | 2-5 min |
| Render backend deploy | 10 min |
| Netlify frontend deploy | 2-5 min |
| Connect & test | 5 min |
| **Total** | ~30 min |

Subsequent updates: **2-5 minutes** via git push

---

## ✅ Final Checklist

After deployment, verify:

- [ ] Backend URL returns health check: `curl https://your-app-name.onrender.com/health`
- [ ] Frontend loads: `https://your-app.netlify.app`
- [ ] Can create product in frontend
- [ ] Can create customer in frontend
- [ ] Can create order in frontend
- [ ] Order reduces inventory
- [ ] Dashboard shows statistics
- [ ] No errors in browser console
- [ ] API documentation works: `https://your-app-name.onrender.com/docs`
- [ ] Both services accessible from public internet

---

## 🎉 Success!

You're live! 🚀

```
Your Application is Live! 🎉

Frontend: https://your-app.netlify.app
Backend: https://your-app-name.onrender.com

Share these URLs with users!
```

---

**Questions?** Check [NETLIFY_RENDER_DEPLOYMENT.md](NETLIFY_RENDER_DEPLOYMENT.md) for detailed guide.

**Update something?** Just `git push origin main` - auto-deploy happens!

---

**Happy Coding! 🚀**
