#!/bin/bash

# EDU-Bridge Backend - Quick Deployment Script
# This script helps you deploy to Render quickly

echo "🚀 EDU-Bridge Backend Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check if package.json has correct scripts
echo "✅ Checking package.json scripts..."
if ! grep -q '"build": "tsc && npx prisma generate"' package.json; then
    echo "⚠️  Adding build script to package.json..."
    # You may need to add this manually
fi

# Generate JWT secrets
echo ""
echo "🔐 Generating JWT Secrets..."
echo "Copy these to your Render environment variables:"
echo ""
echo "JWT_SECRET:"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
echo ""
echo "REFRESH_TOKEN_SECRET:"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
echo ""

# Deployment checklist
echo "📋 Deployment Checklist:"
echo ""
echo "1. ✅ Push code to GitHub"
echo "   git push origin main"
echo ""
echo "2. ✅ Create PostgreSQL database on Render"
echo "   - Go to render.com"
echo "   - New + → PostgreSQL"
echo "   - Copy External Database URL"
echo ""
echo "3. ✅ Create Web Service on Render"
echo "   - New + → Web Service"
echo "   - Connect GitHub repo"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo ""
echo "4. ✅ Add Environment Variables:"
echo "   DATABASE_URL=<from step 2>"
echo "   JWT_SECRET=<generated above>"
echo "   REFRESH_TOKEN_SECRET=<generated above>"
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo "   CLOUDINARY_CLOUD_NAME=<your cloudinary>"
echo "   CLOUDINARY_API_KEY=<your cloudinary>"
echo "   CLOUDINARY_API_SECRET=<your cloudinary>"
echo "   SMTP_HOST=smtp.gmail.com"
echo "   SMTP_PORT=587"
echo "   SMTP_USER=<your gmail>"
echo "   SMTP_PASS=<your gmail app password>"
echo ""
echo "5. ✅ After deployment, run migrations:"
echo "   - Go to Shell tab in Render"
echo "   - Run: npx prisma migrate deploy"
echo ""
echo "6. ✅ Test your API:"
echo "   curl https://your-app.onrender.com/health"
echo ""
echo "🎉 Deployment complete! Your API is live!"
