# 🚀 Deployment Guide - Netlify + Railway# 🚀 Quick Deployment Guide



## ArchitectureDeploy InsightX on **Render** (hosts both frontend and backend for free).

- **Frontend:** Netlify (Static Site) - Free

- **Backend:** Railway (Python API) - $5/month with 500 hours free trial---



---## ⚡ Quick Setup (5 Steps)



## 📦 Prerequisites### Step 1: Setup Git LFS for Models

```bash

1. GitHub account with InsightX repository# Install and configure Git LFS

2. [Netlify account](https://netlify.com) (free)git lfs install

3. [Railway account](https://railway.app) (free trial)git lfs track "*.h5"

4. Git LFS configured (already done)git lfs track "*.pth"



---# Add everything to git

git add .

## 🔧 Backend Deployment (Railway)git commit -m "Ready for deployment"

git push origin master

### Step 1: Deploy to Railway```



1. Go to [Railway Dashboard](https://railway.app/dashboard)### Step 2: Create Render Account

2. Click **"New Project"**- Go to [render.com](https://render.com)

3. Select **"Deploy from GitHub repo"**- Sign up (free tier available)

4. Choose `Chanu716/InsightX`- Connect your GitHub account

5. Railway will auto-detect Python and deploy!

### Step 3: Deploy Backend

### Step 2: Configure Environment (Optional)1. Click **"New +"** → **"Web Service"**

2. Select your repository: `Chanu716/InsightX`

Railway auto-detects everything, but you can verify:3. Configure:

- **Build Command:** Auto-detected (pip install)   - **Name:** `insightx-backend`

- **Start Command:** From Procfile   - **Build Command:** `./build.sh`

- **Python Version:** From runtime.txt (3.11.9)   - **Start Command:** `gunicorn app:app`

   - **Instance:** Free

### Step 3: Get Backend URL4. Click **"Create Web Service"**

5. Wait 5-10 minutes for deployment

1. Go to your Railway project6. **Copy your backend URL** (e.g., `https://insightx-backend.onrender.com`)

2. Click **Settings** → **Networking**

3. Click **Generate Domain**### Step 4: Update Frontend Config

4. Copy your backend URL (e.g., `https://insightx-production.up.railway.app`)1. Open `config.js`

2. Replace this line:

### Step 4: Test Backend   ```javascript

   : 'https://insightx-backend.onrender.com', // Replace with your actual URL

```bash   ```

curl https://YOUR-RAILWAY-URL/api/health   With your actual backend URL from Step 3

# Should return: {"status":"healthy","message":"InsightX AI Backend is running"}

```3. Commit and push:

   ```bash

---   git add config.js

   git commit -m "Update backend URL"

## 🌐 Frontend Deployment (Netlify)   git push

   ```

### Step 1: Update Backend URL

### Step 5: Deploy Frontend

1. Open `config.js` in your project1. Click **"New +"** → **"Static Site"**

2. Update line 8 with your Railway backend URL:2. Select same repository

3. Configure:

```javascript   - **Name:** `insightx-frontend`

BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'   - **Publish Directory:** `.`

    ? 'http://localhost:5000'4. Click **"Create Static Site"**

    : 'https://YOUR-RAILWAY-URL',  // ← Update this!5. Done! Visit your frontend URL to use the app

```

---

3. Commit and push:

```bash## ✅ Test Your Deployment

git add config.js

git commit -m "Update backend URL for Railway"**Test Backend:**

git push origin main```bash

```curl https://YOUR-BACKEND-URL.onrender.com/api/health

```

### Step 2: Deploy to Netlify

**Test Frontend:**

**Option A: Netlify Dashboard**- Visit your frontend URL

1. Go to [Netlify Dashboard](https://app.netlify.com)- Upload a test medical image

2. Click **"Add new site"** → **"Import an existing project"**- Get predictions!

3. Choose **GitHub** and select `Chanu716/InsightX`

4. Configure:---

   - **Branch:** `main`

   - **Build command:** Leave blank## 💡 Important Notes

   - **Publish directory:** `.` (dot)

5. Click **"Deploy site"****Free Tier:**

- Backend sleeps after 15 min inactivity

**Option B: Netlify CLI**- First request takes 30-60 seconds to wake up

```bash- 512MB RAM (may struggle with all 4 models)

npm install -g netlify-cli

netlify login**For Better Performance:**

netlify deploy --prod- Upgrade to Starter plan ($7/month)

```- 2GB RAM, always-on

- Recommended for production use

### Step 3: Custom Domain (Optional)

**Model Files:**

1. In Netlify, go to **Site settings** → **Domain management**- Using Git LFS (already configured)

2. Click **"Add custom domain"**- Models automatically deployed with your code

3. Follow DNS configuration instructions- Total size: 277MB



------



## 🎯 Quick Deploy Checklist## 🐛 Troubleshooting



- [ ] Railway backend deployed and running**Models not loading?**

- [ ] Railway domain generated- Check Render logs (click on service → Logs)

- [ ] `config.js` updated with Railway URL- Free tier RAM might be insufficient

- [ ] Changes committed and pushed to GitHub- Consider upgrading plan

- [ ] Netlify frontend deployed

- [ ] Test: Frontend can call backend API**CORS errors?**

- Update `app.py` CORS settings with your frontend URL

---- Redeploy backend



## 💰 Cost Comparison**Frontend can't connect?**

- Verify backend URL in `config.js`

| Platform | Frontend | Backend | Total/Month |- Check backend is running (visit `/api/health`)

|----------|----------|---------|-------------|

| **Netlify + Railway** | Free | $5 (after trial) | **$5** |---

| Render | Free | Free* | Free |

| Vercel + Railway | Free | $5 | $5 |## 📖 Alternative: One-Click Deploy



*Render free tier: Slower, sleeps after inactivityUse the `render.yaml` blueprint:

1. Click **"New +"** → **"Blueprint"**

---2. Select repository

3. Click **"Apply"**

## 🔍 Troubleshooting4. Both services deploy together!



### Frontend can't reach backend---

- Check `config.js` has correct Railway URL

- Verify CORS is enabled (already done in `app.py`)**That's it! Your AI medical imaging platform is live! 🎉**

- Check Railway backend is running (not crashed)

### Backend deployment fails
- Check Railway logs for errors
- Ensure Git LFS is working (models should download)
- Verify `requirements.txt` is compatible

### Frontend shows CORS errors
- Railway URL must be HTTPS (not HTTP)
- Check Railway deployment logs for startup errors

---

## 📊 Performance

**Railway (Backend):**
- ✅ Always on (no cold starts)
- ✅ Fast deployment (~5-10 min first time, ~2-3 min updates)
- ✅ Better memory (8GB free tier)
- ✅ Faster CPU

**Netlify (Frontend):**
- ✅ Global CDN (super fast loading)
- ✅ Instant deployment (~30 seconds)
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month free

---

## 🚀 Deploy Now!

1. **Backend:** [Deploy on Railway](https://railway.app/new)
2. **Frontend:** [Deploy on Netlify](https://app.netlify.com/start)

That's it! Your medical AI platform will be live in ~10 minutes! 🎉
