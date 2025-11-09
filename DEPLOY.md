# 🚀 Quick Deployment Guide

Deploy InsightX on **Render** (hosts both frontend and backend for free).

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Setup Git LFS for Models
```bash
# Install and configure Git LFS
git lfs install
git lfs track "*.h5"
git lfs track "*.pth"

# Add everything to git
git add .
git commit -m "Ready for deployment"
git push origin master
```

### Step 2: Create Render Account
- Go to [render.com](https://render.com)
- Sign up (free tier available)
- Connect your GitHub account

### Step 3: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Select your repository: `Chanu716/InsightX`
3. Configure:
   - **Name:** `insightx-backend`
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn app:app`
   - **Instance:** Free
4. Click **"Create Web Service"**
5. Wait 5-10 minutes for deployment
6. **Copy your backend URL** (e.g., `https://insightx-backend.onrender.com`)

### Step 4: Update Frontend Config
1. Open `config.js`
2. Replace this line:
   ```javascript
   : 'https://insightx-backend.onrender.com', // Replace with your actual URL
   ```
   With your actual backend URL from Step 3

3. Commit and push:
   ```bash
   git add config.js
   git commit -m "Update backend URL"
   git push
   ```

### Step 5: Deploy Frontend
1. Click **"New +"** → **"Static Site"**
2. Select same repository
3. Configure:
   - **Name:** `insightx-frontend`
   - **Publish Directory:** `.`
4. Click **"Create Static Site"**
5. Done! Visit your frontend URL to use the app

---

## ✅ Test Your Deployment

**Test Backend:**
```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/health
```

**Test Frontend:**
- Visit your frontend URL
- Upload a test medical image
- Get predictions!

---

## 💡 Important Notes

**Free Tier:**
- Backend sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- 512MB RAM (may struggle with all 4 models)

**For Better Performance:**
- Upgrade to Starter plan ($7/month)
- 2GB RAM, always-on
- Recommended for production use

**Model Files:**
- Using Git LFS (already configured)
- Models automatically deployed with your code
- Total size: 277MB

---

## 🐛 Troubleshooting

**Models not loading?**
- Check Render logs (click on service → Logs)
- Free tier RAM might be insufficient
- Consider upgrading plan

**CORS errors?**
- Update `app.py` CORS settings with your frontend URL
- Redeploy backend

**Frontend can't connect?**
- Verify backend URL in `config.js`
- Check backend is running (visit `/api/health`)

---

## 📖 Alternative: One-Click Deploy

Use the `render.yaml` blueprint:
1. Click **"New +"** → **"Blueprint"**
2. Select repository
3. Click **"Apply"**
4. Both services deploy together!

---

**That's it! Your AI medical imaging platform is live! 🎉**
