# Environment Configuration Guide

## Overview

This dashboard is configured to automatically use the correct API URL based on your environment:

### 🔧 Development (Local)
- **API URL**: `http://localhost:3000`
- **Config File**: `.env.development`
- **Run with**: `npm run dev`

### 🚀 Production (Vercel)
- **API URL**: `https://taste-and-grow-project-1.onrender.com`
- **Config File**: `.env.production`
- **Built with**: `npm run build` or automatic Vercel deployment

## How It Works

Vite automatically loads the correct environment file:
- Local development → uses `.env.development`
- Production build → uses `.env.production`

**No manual configuration needed!** ✅

---

## Optional: Override API URL in Vercel

If you want to use a different API URL in production:

## Step 1: Get Your API URL

After deploying to Render/Railway/Fly.io, you'll get a URL like:
- Render: `https://taste-and-grow-api.onrender.com`
- Railway: `https://taste-and-grow-api.railway.app`
- Fly.io: `https://taste-and-grow-api.fly.dev`

## Step 2: Update Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-api-url.onrender.com` (replace with your actual API URL)
   - **Environment**: Production (check all environments if you want)
5. Click **Save**

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Or just push a new commit to trigger a deployment

## Alternative: Manual Update

If you prefer not to use environment variables, you can edit the API URL directly:

In `dashboard/src/config/api.ts`:
```typescript
export const API_URL = 'https://your-api-url.onrender.com';
```

Then commit and push to trigger a Vercel deployment.

## Testing

After deployment:
1. Open your Vercel dashboard URL
2. Navigate to Schools or Teachers
3. You should see the data from your production API!

