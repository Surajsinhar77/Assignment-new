# 🚀 Getting Started: Deploy Your App

This guide will help you deploy your Inventory Management System to **Netlify** (frontend) and **Render** (backend) in 30 minutes.

---

## 📋 What You Have

✅ Complete React Frontend (Netlify-ready)
✅ Complete FastAPI Backend (Render-ready)  
✅ Production Docker Setup (Local testing)
✅ Full Documentation (11 guides)

---

## 🎯 Quick Start: 5 Steps to Production

### Step 1️⃣: Setup GitHub (5 minutes)

This is required for both Netlify and Render to auto-deploy your code.

```bash
# Navigate to your project
cd /Users/surajkumar/Documents/Assignment/Assignment-new

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Inventory Management System"

# Create a new repository on GitHub:
# 1. Go to https://github.com/new
# 2. Name it: inventory-management
# 3. Click "Create repository"
# 4. Copy the URL shown (looks like: https://github.com/YOUR_USERNAME/inventory-management.git)

# Then run these commands (replace with your URL):
git remote add origin https://github.com/YOUR_USERNAME/inventory-management.git
git branch -M main
git push -u origin main

# ✅ Your code is now on GitHub!
```

---

### Step 2️⃣: Deploy Backend on Render (15 minutes)

#### A. Create PostgreSQL Database

1. Go to https://render.com (sign up with GitHub)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `inventory-db`
   - **Database**: `inventory_db`
   - **User**: `postgres`
   - **Region**: Pick closest to you
   - **Plan**: **Free** ✅
4. Click **"Create Database"**
5. ⏳ Wait 2-5 minutes
6. When ready, click the database and copy the **"Internal Database URL"**
   - Looks like: `postgresql://user:password@dpg-xxxxx.onrender.com/inventory_db`
   - **Save this!** You need it in Step 2B

#### B. Deploy Backend Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect Repository"** and select your GitHub repo
3. Fill in:
   - **Name**: `inventory-backend`
   - **Environment**: `Python 3`
   - **Region**: Same as database
   - **Build Command**: 
     ```
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: **Free** ✅
4. Click **"Create Web Service"**

#### C. Add Environment Variables

1. After service is created, go to **"Settings"** → **"Environment"**
2. Add these variables (click "Add Environment Variable" for each):

```
DATABASE_URL=<paste the PostgreSQL URL from Step A>
ENVIRONMENT=production
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://your-app.netlify.app
```

3. ⏳ **Wait 5-10 minutes** for deployment to complete

#### D. Get Your Backend URL

Once deployed:
1. Go to top of the Web Service page
2. Find the URL (looks like: `https://inventory-backend-xxxx.onrender.com`)
3. **Save this!** You need it for Step 3

**Test it:**
```bash
curl https://inventory-backend-xxxx.onrender.com/health
# Should return: {"status": "healthy"}
```

---

### Step 3️⃣: Deploy Frontend on Netlify (10 minutes)

#### A. Update Frontend Environment

1. Edit `frontend/.env.production`
2. Replace the URL with your Render backend URL:
   ```
   VITE_API_URL=https://inventory-backend-xxxx.onrender.com
   ```
3. Save and commit:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL for production"
   git push origin main
   ```

#### B. Deploy on Netlify

1. Go to https://netlify.com (sign up with GitHub)
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"** and authorize
4. Select your `inventory-management` repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**
7. ⏳ **Wait 2-5 minutes** for build to complete

#### C. Add Environment Variable

1. After deployment, go to **"Site settings"** → **"Build & deploy"** → **"Environment"**
2. Click **"Edit variables"**
3. Add:
   ```
   VITE_API_URL=https://inventory-backend-xxxx.onrender.com
   ```
4. Click **"Save"**

#### D. Get Your Frontend URL

Once deployed:
1. Go to your Netlify site dashboard
2. Find your site URL (looks like: `https://your-app-name.netlify.app`)
3. **Save this!** You need it for Step 4

**Test it:**
```bash
curl https://your-app-name.netlify.app | head -20
# Should return HTML
```

---

### Step 4️⃣: Final Connection (2 minutes)

Now update your backend to allow requests from your frontend:

1. Go to **Render Dashboard**
2. Click your **Web Service** → **Settings** → **Environment**
3. Find `CORS_ORIGINS` and update it to your Netlify URL:
   ```
   CORS_ORIGINS=https://your-app-name.netlify.app
   ```
4. Click **"Save"**
5. ⏳ Backend auto-redeploys (2-5 minutes)

---

### Step 5️⃣: Test Your App! (5 minutes)

1. Open https://your-app-name.netlify.app in your browser
2. You should see the Inventory Management System dashboard
3. Try these actions:

   **Create a Product:**
   - Click "Products"
   - Fill in: Name, SKU, Price, Quantity
   - Click "Add Product"
   - Should see "Product added successfully"

   **Create a Customer:**
   - Click "Customers"
   - Fill in: Name, Email, Phone
   - Click "Add Customer"
   - Should see "Customer added successfully"

   **Create an Order:**
   - Click "Orders"
   - Select a customer
   - Add a product and quantity
   - Click "Create Order"
   - Should see "Order created successfully"

4. ✅ **You're live!** 🎉

---

## 📚 Documentation Guide

After deployment, these docs will help:

| Document | Purpose | When to Use |
|----------|---------|------------|
| [NETLIFY_RENDER_CHEATSHEET.md](NETLIFY_RENDER_CHEATSHEET.md) | Quick copy-paste commands | After deployment, making updates |
| [DEPLOYMENT_COMMANDS.md](DEPLOYMENT_COMMANDS.md) | Command reference | Quick lookup |
| [PROJECT_STRUCTURE_DEPLOYMENT.md](PROJECT_STRUCTURE_DEPLOYMENT.md) | File structure explained | Understanding folder organization |
| [README.md](README.md) | Full documentation | API reference, features |
| [SETUP.md](SETUP.md) | Local development | Running locally with Docker |

---

## 🔄 Making Updates After Deployment

### Update Backend Code

```bash
# Make your changes
vim backend/routes_products.py

# Commit and push
git add backend/
git commit -m "Fix: bug description"
git push origin main

# ✅ Render auto-deploys automatically!
```

### Update Frontend Code

```bash
# Make your changes
vim frontend/src/pages/Dashboard.jsx

# Commit and push
git add frontend/
git commit -m "Update: improvement description"
git push origin main

# ✅ Netlify auto-deploys automatically!
```

### Update Environment Variables

**For Backend (Render):**
- Go to Render Dashboard → Web Service → Settings → Environment
- Edit the variable
- Click Save
- Auto-redeploys in 2-5 minutes

**For Frontend (Netlify):**
- Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment
- Edit the variable
- Click Save
- Auto-redeploys on next build

---

## 🐛 Troubleshooting

### ❌ "API is not responding"
```bash
# 1. Check backend is running:
curl https://inventory-backend-xxxx.onrender.com/health

# 2. Check CORS_ORIGINS on Render matches your Netlify URL exactly

# 3. Check browser console (F12) for specific error
```

### ❌ "Build failed on Netlify"
```bash
# 1. Check build command: npm install && npm run build
# 2. Check base directory: frontend
# 3. Check publish directory: dist
# 4. View logs in Netlify Dashboard → Deploys
```

### ❌ "Build failed on Render"
```bash
# 1. Check requirements.txt exists in backend/
# 2. Check build command: pip install -r requirements.txt
# 3. Check start command contains: cd backend &&
# 4. View logs in Render Dashboard → Logs
```

### ❌ "Database connection error"
```bash
# 1. Copy full DATABASE_URL from Render PostgreSQL
# 2. Make sure password is included!
# 3. Paste into Render Web Service environment variable
# 4. Restart service
```

---

## 🎯 Your URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://your-app-name.netlify.app |
| **Backend API** | https://inventory-backend-xxxx.onrender.com |
| **API Docs** | https://inventory-backend-xxxx.onrender.com/docs |
| **GitHub** | https://github.com/YOUR_USERNAME/inventory-management |

---

## ⏱️ Timeline

| Step | Time | Notes |
|------|------|-------|
| Step 1: GitHub Setup | 5 min | One-time only |
| Step 2: Render Backend | 15 min | Wait for deployment |
| Step 3: Netlify Frontend | 10 min | Wait for build |
| Step 4: Connect Services | 2 min | Update CORS |
| Step 5: Test | 5 min | Verify everything works |
| **Total** | **~37 min** | First time only |

**After first deployment:**
- Updates: 2-5 minutes via `git push`
- No manual redeployment needed

---

## ✅ Deployment Checklist

Use this to track your progress:

- [ ] GitHub repository created and code pushed
- [ ] Render PostgreSQL database created
- [ ] Render Web Service deployed (backend running)
- [ ] Backend environment variables set
- [ ] Backend health check working: `curl.../health`
- [ ] Netlify frontend deployed (build completed)
- [ ] Frontend environment variables set
- [ ] Frontend loads in browser
- [ ] Backend CORS_ORIGINS updated to Netlify URL
- [ ] Backend redeploy completed
- [ ] Create product test: ✅
- [ ] Create customer test: ✅
- [ ] Create order test: ✅
- [ ] Dashboard shows stats: ✅

---

## 🚀 You're Ready!

Your application is now deployed to production! 

**What happens next:**
1. ✅ Netlify hosts your React frontend
2. ✅ Render hosts your FastAPI backend
3. ✅ Render hosts your PostgreSQL database
4. ✅ Both auto-deploy when you push to GitHub

**Share your app:** 
- Send https://your-app-name.netlify.app to users
- They can use your app immediately!

---

## 💡 Pro Tips

1. **Check deployment status anytime:**
   - Render: Dashboard → Web Service → Logs
   - Netlify: Dashboard → Deploys → (Latest)

2. **Rollback if needed:**
   - Render: Restart button or redeploy previous commit
   - Netlify: Click "Publish deploy" on previous version

3. **Monitor performance:**
   - Render: Analytics (free tier has basic stats)
   - Netlify: Analytics (free tier has basic stats)

4. **Keep your .env files safe:**
   - Never commit .env files
   - Use .gitignore (already configured)
   - Set sensitive variables in dashboard, not code

---

## 🎉 Success!

Your Inventory Management System is live! 🎊

```
┌─ Your App is Live! ─────────────────┐
│                                     │
│  🌐 https://your-app.netlify.app    │
│  🔗 https://backend.onrender.com    │
│  💾 PostgreSQL on Render             │
│                                     │
│  Auto-deploys on git push! ✨       │
└─────────────────────────────────────┘
```

---

## ❓ Questions?

- **Detailed deployment guide:** Read [NETLIFY_RENDER_DEPLOYMENT.md](NETLIFY_RENDER_DEPLOYMENT.md)
- **Quick reference:** See [NETLIFY_RENDER_CHEATSHEET.md](NETLIFY_RENDER_CHEATSHEET.md)
- **API documentation:** Visit `https://your-backend.onrender.com/docs`
- **Project structure:** Check [PROJECT_STRUCTURE_DEPLOYMENT.md](PROJECT_STRUCTURE_DEPLOYMENT.md)

---

**Happy coding and deployment! 🚀**

Need help? All your documentation is in the root folder. Start with the guide that matches your question!
