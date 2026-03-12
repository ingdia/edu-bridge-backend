# EDU-Bridge Backend - Complete Deployment Guide

## 🚀 Deployment Options

Choose one of these platforms:
1. **Render** (Recommended - Free tier available, easy setup)
2. **Railway** (Alternative - Free tier, simple deployment)
3. **Heroku** (Popular but paid)
4. **AWS/DigitalOcean** (Advanced - Full control)

---

## Option 1: Deploy to Render (Recommended)

### Step 1: Prepare Your Code

1. **Create a build script** in `package.json`:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc && npx prisma generate",
    "postinstall": "npx prisma generate"
  }
}
```

2. **Create `.gitignore`** (if not exists):
```
node_modules/
dist/
.env
*.log
```

3. **Commit and push to GitHub**:
```bash
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

### Step 2: Setup Database on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `edubridge-db`
   - **Database**: `edubridge`
   - **User**: `edubridge_user`
   - **Region**: Choose closest to Rwanda (Europe - Frankfurt)
   - **Plan**: Free
4. Click **"Create Database"**
5. **Copy the External Database URL** (starts with `postgres://`)

### Step 3: Deploy Backend on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `edubridge-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"

   ```
   DATABASE_URL=<paste your Render PostgreSQL URL>
   
   JWT_SECRET=<generate random string - see below>
   JWT_EXPIRES_IN=7d
   
   REFRESH_TOKEN_SECRET=<generate another random string>
   REFRESH_TOKEN_EXPIRES_IN=30d
   
   NODE_ENV=production
   PORT=5000
   
   CLOUDINARY_CLOUD_NAME=<your cloudinary name>
   CLOUDINARY_API_KEY=<your cloudinary key>
   CLOUDINARY_API_SECRET=<your cloudinary secret>
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your gmail>
   SMTP_PASS=<your gmail app password>
   ```

   **Generate JWT Secrets**:
   ```bash
   # Run in terminal
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. Click **"Create Web Service"**

### Step 4: Run Database Migrations

1. After deployment, go to your service dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Step 5: Test Your API

Your API will be available at: `https://edubridge-api.onrender.com`

Test:
```bash
curl https://edubridge-api.onrender.com/health
```

---

## Option 2: Deploy to Railway

### Step 1: Setup Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your repository

### Step 2: Add PostgreSQL

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically create `DATABASE_URL` variable

### Step 3: Configure Environment Variables

1. Click on your service
2. Go to **"Variables"** tab
3. Add all environment variables (same as Render above)

### Step 4: Deploy

1. Railway will auto-deploy on every push
2. Click **"Settings"** → **"Generate Domain"** to get public URL

### Step 5: Run Migrations

1. Click **"Settings"** → **"Deploy"** → **"Custom Start Command"**
2. Set: `npx prisma migrate deploy && npm start`

---

## Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI

```bash
# Windows
winget install Heroku.HerokuCLI

# Or download from heroku.com/cli
```

### Step 2: Login and Create App

```bash
heroku login
heroku create edubridge-api
```

### Step 3: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

### Step 4: Set Environment Variables

```bash
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set REFRESH_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set NODE_ENV=production
heroku config:set CLOUDINARY_CLOUD_NAME=your_name
heroku config:set CLOUDINARY_API_KEY=your_key
heroku config:set CLOUDINARY_API_SECRET=your_secret
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email
heroku config:set SMTP_PASS=your_app_password
```

### Step 5: Deploy

```bash
git push heroku main
heroku run npx prisma migrate deploy
```

---

## 🔧 Setup External Services

### 1. Cloudinary (File Storage)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to **Dashboard**
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Add to environment variables

### 2. Gmail SMTP (Email Notifications)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Enable **2-Step Verification**
3. Go to **Security** → **App passwords**
4. Generate app password for "Mail"
5. Use this password in `SMTP_PASS`

---

## 📝 Post-Deployment Setup

### 1. Create Admin User

Use your API to create the first admin:

```bash
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@edubridge.rw",
    "password": "SecurePassword123!",
    "role": "ADMIN"
  }'
```

### 2. Test All Endpoints

```bash
# Health check
curl https://your-api-url.com/health

# Detailed health
curl https://your-api-url.com/api/health

# Login
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@edubridge.rw",
    "password": "SecurePassword123!"
  }'
```

### 3. Setup Monitoring

**Render/Railway**: Built-in monitoring in dashboard

**External Monitoring**:
1. [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
2. [Sentry](https://sentry.io) - Error tracking
3. [LogRocket](https://logrocket.com) - Session replay

---

## 🔒 Security Checklist

- [x] HTTPS enabled (automatic on Render/Railway/Heroku)
- [x] Environment variables set (not in code)
- [x] Strong JWT secrets generated
- [x] CORS configured for production domain
- [x] Rate limiting enabled
- [x] Helmet security headers active
- [x] Database connection encrypted
- [x] Audit logging enabled

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module 'typescript'`
```bash
# Add to package.json devDependencies
npm install --save-dev typescript @types/node
```

**Error**: `Prisma Client not generated`
```bash
# Add postinstall script to package.json
"postinstall": "npx prisma generate"
```

### Database Connection Fails

**Error**: `Can't reach database server`
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure database is in same region as app
- Check database is running

### Migrations Fail

**Error**: `Migration failed`
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or deploy specific migration
npx prisma migrate deploy
```

### App Crashes on Start

**Check logs**:
```bash
# Render: Dashboard → Logs
# Railway: Dashboard → Deployments → View Logs
# Heroku: heroku logs --tail
```

Common issues:
- Missing environment variables
- Port binding (use `process.env.PORT`)
- Database not migrated

---

## 📊 Monitoring Your Deployment

### Check Health

```bash
curl https://your-api-url.com/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-25T10:00:00.000Z",
    "services": {
      "database": { "status": "healthy" },
      "cloudinary": { "status": "healthy" },
      "email": { "status": "healthy" }
    },
    "system": {
      "uptime": { "seconds": 3600, "formatted": "1h 0m" },
      "memory": { "rss": "150MB", "heapUsed": "80MB" }
    }
  }
}
```

### Monitor Performance

1. **Response Times**: Check in platform dashboard
2. **Error Rate**: Monitor logs for errors
3. **Database Performance**: Check query times
4. **Memory Usage**: Ensure < 512MB (free tier limit)

---

## 🚀 Quick Deploy Commands

### Render (via CLI)

```bash
# Install Render CLI
npm install -g @render/cli

# Deploy
render deploy
```

### Railway (via CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Heroku

```bash
# Deploy
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

---

## 🎯 Next Steps After Deployment

1. **Update Frontend**:
   - Set API URL to your deployed backend
   - Update CORS settings in backend for frontend domain

2. **Test with Real Data**:
   - Create test students
   - Upload test modules
   - Test all features

3. **Setup Backups**:
   - Enable automatic database backups
   - Export data regularly

4. **Monitor Usage**:
   - Track API calls
   - Monitor error rates
   - Check performance metrics

5. **Scale as Needed**:
   - Upgrade to paid tier when needed
   - Add more resources
   - Setup CDN for static files

---

## 📞 Support

If you encounter issues:

1. Check logs in your platform dashboard
2. Review environment variables
3. Test database connection
4. Check API health endpoint
5. Review error messages

---

## ✅ Deployment Complete!

Your EDU-Bridge backend is now live and ready to serve students at GS Ruyenzi!

**API URL**: `https://your-app-name.onrender.com` (or your chosen platform)

**Next**: Start building the frontend! 🎨
