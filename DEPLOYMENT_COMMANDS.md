# Deployment Quick Commands

## 🚀 Quick Reference for Netlify + Render Deployment

### 1. Setup GitHub Repository (First Time Only)

```bash
# Initialize git and create initial commit
cd /Users/surajkumar/Documents/Assignment/Assignment-new
git init
git add .
git commit -m "Initial commit: Inventory Management System"

# Add GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/inventory-management.git
git branch -M main
git push -u origin main
```

### 2. Backend Deployment on Render (One Time Setup)

```bash
# These are the commands you'll run in Render:

# Build command (automatic):
pip install -r requirements.txt

# Start command (automatic):
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables to set in Render Dashboard:**
```
DATABASE_URL=postgresql://user:password@host:5432/inventory_db  # From Render PostgreSQL
ENVIRONMENT=production
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://your-app.netlify.app  # After frontend deployment
```

### 3. Frontend Deployment on Netlify (One Time Setup)

```bash
# Update frontend environment with Render backend URL
# Edit: frontend/.env.production

VITE_API_URL=https://your-app-name.onrender.com
```

```bash
# Netlify will automatically run:
# Build command:
npm install && npm run build

# Publish directory:
dist
```

**Environment Variables to set in Netlify Dashboard:**
```
VITE_API_URL=https://your-app-name.onrender.com  # Your Render backend URL
```

---

## 📤 After Deployment: Making Updates

### Update Backend (After it's deployed)

```bash
# 1. Make changes to backend code
vim backend/routes_products.py

# 2. Commit and push
git add backend/
git commit -m "Update backend: fix bug in products"
git push origin main

# ✅ Render auto-deploys!
```

### Update Frontend (After it's deployed)

```bash
# 1. Make changes to frontend code
vim frontend/src/pages/Dashboard.jsx

# 2. Commit and push
git add frontend/
git commit -m "Update frontend: improve UI"
git push origin main

# ✅ Netlify auto-deploys!
```

### Update Environment Variables

**On Render Dashboard:**
1. Go to Web Service → Settings → Environment Variables
2. Edit the variable
3. Click Save
4. Service auto-redeploys

**On Netlify Dashboard:**
1. Go to Site Settings → Build & Deploy → Environment
2. Edit the variable
3. Click Save (or manually trigger deploy)

---

## 🧪 Testing After Deployment

### Test Backend is Running
```bash
# Health check
curl https://your-app-name.onrender.com/health

# Should return:
# {"status": "healthy"}
```

### Test Frontend is Running
```bash
# Open in browser (or curl)
curl https://your-app.netlify.app

# Should return HTML page
```

### Full Integration Test
1. Open https://your-app.netlify.app
2. Create a product
3. Create a customer
4. Create an order
5. Everything should work!

---

## 🐛 Quick Troubleshooting Commands

### Check Render Logs (Backend)
```bash
# On Render Dashboard:
# 1. Click Web Service → Logs
# 2. View real-time logs

# Or via curl (if you have Render API):
# Not typically needed - dashboard is easier
```

### Check Netlify Logs (Frontend)
```bash
# On Netlify Dashboard:
# 1. Go to Deploys
# 2. Click latest deployment
# 3. View build logs
```

### Test API Endpoints
```bash
# Get all products
curl https://your-app-name.onrender.com/products

# Get all customers
curl https://your-app-name.onrender.com/customers

# Get API documentation
curl https://your-app-name.onrender.com/docs
```

### Check CORS Issues
```bash
# If frontend can't reach backend, CORS might be wrong
# Check Render backend environment: CORS_ORIGINS
# Should match your Netlify URL exactly:
# https://your-app.netlify.app
```

---

## 📝 Important Files for Deployment

| File | Purpose | Location |
|------|---------|----------|
| `render.yaml` | Render config (reference) | Root |
| `netlify.toml` | Netlify config | Root |
| `frontend/.env.production` | Frontend production vars | frontend/ |
| `backend/.env.production` | Backend production vars (reference) | backend/ |
| `.gitignore` | Prevents committing secrets | Root |

---

## 🔑 Environment Variables Summary

### Backend (Render) - Set in Dashboard
```
DATABASE_URL              → From Render PostgreSQL
ENVIRONMENT              → production
PYTHONUNBUFFERED        → 1
CORS_ORIGINS            → https://your-app.netlify.app
```

### Frontend (Netlify) - Set in Dashboard
```
VITE_API_URL            → https://your-app-name.onrender.com
```

### Local Development - In `.env` files
```
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
ENVIRONMENT=development

# frontend/.env
VITE_API_URL=http://localhost:8000
```

---

## ⚡ Zero-Downtime Updates

Both platforms support zero-downtime deployments:

```bash
# Make any changes
vim backend/main.py
vim frontend/src/App.jsx

# Push to GitHub
git add .
git commit -m "Update: your message"
git push origin main

# ✅ Both auto-deploy with zero downtime!
# Old requests finish, new requests go to new version
```

---

## 🚨 If Deployment Fails

### Render Backend Won't Deploy
1. Check build command: `pip install -r requirements.txt`
2. Check start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Check environment variables are set
4. View logs in Render dashboard
5. Check Python version: 3.11

### Netlify Frontend Won't Deploy
1. Check build command: `npm install && npm run build`
2. Check base directory: `frontend`
3. Check publish directory: `dist`
4. Check Node version: 18.16.0
5. View logs in Netlify dashboard

### Backend and Frontend Can't Communicate
1. Check `VITE_API_URL` in Netlify environment
2. Check `CORS_ORIGINS` in Render environment
3. Check URLs are correct (https, no trailing slash)
4. Test with curl: `curl https://your-app-name.onrender.com/health`

---

## 📊 Status Checking

### Check Backend Status
```bash
# Visit in browser or curl
https://your-app-name.onrender.com/health
```

### Check Frontend Status
```bash
# Visit in browser
https://your-app.netlify.app
```

### View Real-time Logs

**Render:**
- Dashboard → Web Service → Logs (auto-refreshes)

**Netlify:**
- Dashboard → Deploys → (select deployment) → Logs

---

## 🔄 Version Control Best Practices

```bash
# Always work on feature branch
git checkout -b feature/my-feature

# Make changes
vim backend/main.py

# Commit with clear message
git commit -m "Add: new feature description"

# Push branch
git push origin feature/my-feature

# Merge to main via GitHub (PR)
# Or simply merge locally:
git checkout main
git merge feature/my-feature
git push origin main

# ✅ Auto-deploy happens automatically!
```

---

## 💡 Tips for Success

1. **Always test locally first**
   ```bash
   ./quickstart.sh
   ```

2. **Commit before deploying**
   ```bash
   git status  # Check all changes
   git add .
   git commit -m "Clear message"
   ```

3. **Watch the logs while deploying**
   - Render Dashboard → Logs
   - Netlify Dashboard → Deploys

4. **Test after deployment**
   - Frontend: https://your-app.netlify.app
   - Backend: https://your-app-name.onrender.com/health

5. **Keep environment variables organized**
   - Write them down somewhere safe
   - Don't hardcode in code
   - Use `.env` files locally

---

## 🎯 Deployment Timeline

| Step | Time | Notes |
|------|------|-------|
| GitHub setup | 5 min | One time only |
| Render backend | 10 min | Wait for database + service |
| Netlify frontend | 5 min | Auto-redeploys on changes |
| Connect backend | 2 min | Update CORS |
| Testing | 5 min | Create sample data |
| **Total** | **~30 min** | First time setup |

After setup, updates take 2-5 minutes via git push.

---

## ✅ Deployment Verification

```bash
# Step 1: Backend running?
curl https://your-app-name.onrender.com/health
# Expected: {"status": "healthy"}

# Step 2: Frontend loading?
curl https://your-app.netlify.app | grep -i "Inventory"
# Expected: HTML with page title

# Step 3: API working?
curl https://your-app-name.onrender.com/products
# Expected: JSON array (empty or with products)

# Step 4: Full flow working?
# Visit https://your-app.netlify.app
# Create product → Create customer → Create order
# Should work without errors!
```

---

## 🎉 You're Ready!

Everything is set up for:
- ✅ Local development (Docker)
- ✅ Production deployment (Netlify + Render)
- ✅ Auto-deployment on git push
- ✅ Easy environment management

**Next**: Follow NETLIFY_RENDER_DEPLOYMENT.md for step-by-step setup!

---

**Happy Deploying! 🚀**
