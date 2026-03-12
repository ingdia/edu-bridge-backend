# 🚀 Quick Deployment Steps

## Choose Your Platform

### ✅ Render (Easiest - Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **Go to [render.com](https://render.com)** and sign up

3. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `edubridge-db`
   - Region: Europe (Frankfurt) - closest to Rwanda
   - Plan: Free
   - Click "Create Database"
   - **Copy the External Database URL**

4. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Name: `edubridge-api`
   - Region: Same as database
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

5. **Add Environment Variables** (in Render dashboard):
   ```
   DATABASE_URL=<paste from step 3>
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate with command below>
   JWT_EXPIRES_IN=7d
   REFRESH_TOKEN_SECRET=<generate with command below>
   REFRESH_TOKEN_EXPIRES_IN=30d
   CLOUDINARY_CLOUD_NAME=<your cloudinary>
   CLOUDINARY_API_KEY=<your cloudinary>
   CLOUDINARY_API_SECRET=<your cloudinary>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your gmail>
   SMTP_PASS=<your gmail app password>
   ```

   **Generate secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. **Deploy**: Click "Create Web Service"

7. **Run Migrations** (after deployment):
   - Go to Shell tab in Render
   - Run: `npx prisma migrate deploy`

8. **Test**: Visit `https://your-app.onrender.com/health`

---

### ✅ Railway (Alternative)

1. **Push to GitHub** (same as above)

2. **Go to [railway.app](https://railway.app)** and sign up

3. **New Project** → "Deploy from GitHub repo"

4. **Add PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
   - DATABASE_URL is auto-created

5. **Add Environment Variables** (same as Render)

6. **Generate Domain**:
   - Settings → Generate Domain

7. **Deploy**: Automatic on push

---

## 🔧 Setup External Services

### Cloudinary (File Storage)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free)
3. Dashboard → Copy Cloud Name, API Key, API Secret

### Gmail SMTP (Emails)
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Enable
3. Security → App passwords → Generate for "Mail"
4. Use this password in SMTP_PASS

---

## ✅ Post-Deployment

1. **Test Health**:
   ```bash
   curl https://your-app-url.com/health
   ```

2. **Create Admin User**:
   ```bash
   curl -X POST https://your-app-url.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@edubridge.rw",
       "password": "SecurePassword123!",
       "role": "ADMIN"
     }'
   ```

3. **Test Login**:
   ```bash
   curl -X POST https://your-app-url.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@edubridge.rw",
       "password": "SecurePassword123!"
     }'
   ```

---

## 🎉 Done!

Your API is live at: `https://your-app-name.onrender.com`

**Next**: Build the frontend and connect to this API!

---

## 🐛 Troubleshooting

**Build fails**: Check logs in dashboard
**Database error**: Verify DATABASE_URL
**App crashes**: Check environment variables
**Migrations fail**: Run `npx prisma migrate deploy` in Shell

**Need help?** Check DEPLOYMENT_GUIDE.md for detailed instructions.
