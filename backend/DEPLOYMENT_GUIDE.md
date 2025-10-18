# Deployment Guide - NestJS API

## Option 1: Deploy to Render (Easiest) ⭐

### Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. Commit the `render.yaml` file in your `api` folder

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com/) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will auto-detect the `render.yaml` file
5. Configure:
   - **Name**: `taste-and-grow-api`
   - **Root Directory**: `api`
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:
```
DATABASE_URL=your_supabase_pooling_connection_string
DIRECT_URL=your_supabase_direct_connection_string
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes first time)
3. Your API will be live at: `https://your-service-name.onrender.com`

### Step 5: Update Dashboard
Update your dashboard API URL in:
- `dashboard/src/pages/Schools.tsx`
- `dashboard/src/pages/Teachers.tsx`

Replace `http://localhost:3000` with your Render URL.

---

## Option 2: Deploy to Railway

### Step 1: Deploy
1. Go to [railway.app](https://railway.app/) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect it's a Node.js app

### Step 2: Configure
1. Click on your service
2. Go to **Settings** → **Root Directory** → Set to `api`
3. Go to **Variables** and add:
   ```
   DATABASE_URL=your_supabase_pooling_connection_string
   DIRECT_URL=your_supabase_direct_connection_string
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   ```

### Step 3: Deploy
1. Railway will automatically deploy
2. Click **Settings** → **Generate Domain** to get your public URL
3. Your API will be live at: `https://your-app.railway.app`

---

## Option 3: Deploy to Fly.io

### Step 1: Install Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login and Initialize
```bash
cd api
fly auth login
fly launch
```

Follow the prompts:
- App name: `taste-and-grow-api`
- Region: Choose closest to your users
- PostgreSQL: No (we're using Supabase)
- Redis: No
- Deploy now: No

### Step 3: Set Environment Variables
```bash
fly secrets set DATABASE_URL="your_supabase_pooling_connection_string"
fly secrets set DIRECT_URL="your_supabase_direct_connection_string"
fly secrets set JWT_SECRET="your-secret-key-here"
fly secrets set NODE_ENV="production"
```

### Step 4: Deploy
```bash
fly deploy
```

Your API will be live at: `https://your-app.fly.dev`

---

## Environment Variables You Need

Get these from your Supabase project:

1. **DATABASE_URL** (Pooling Connection):
   - Go to Supabase Dashboard → Settings → Database
   - Connection Pooling → Connection string
   - Mode: Transaction
   - Example: `postgresql://postgres.xxx:password@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

2. **DIRECT_URL** (Direct Connection):
   - Go to Supabase Dashboard → Settings → Database
   - Connection Info → URI
   - Example: `postgresql://postgres.xxx:password@aws-1-eu-north-1.pooler.supabase.com:5432/postgres`

3. **JWT_SECRET**:
   - Generate a secure random string
   - Example: `openssl rand -base64 32` or any random string

---

## Update Dashboard for Production

### Option A: Environment Variable (Recommended)
Create `dashboard/.env` file:
```env
VITE_API_URL=https://your-api-url.onrender.com
```

Then update your pages to use:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Option B: Direct Update
Replace `http://localhost:3000` with your production API URL in:
- `dashboard/src/pages/Schools.tsx`
- `dashboard/src/pages/Teachers.tsx`

---

## Troubleshooting

### API not responding
- Check logs in your hosting provider dashboard
- Verify environment variables are set correctly
- Check if Prisma migrations ran: `npx prisma migrate deploy`

### CORS errors
- NestJS CORS is already enabled in `main.ts`
- If issues persist, specify your dashboard domain:
  ```typescript
  app.enableCors({
    origin: ['https://your-dashboard.vercel.app'],
    credentials: true,
  });
  ```

### Database connection issues
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Supabase connection pooling is enabled
- Ensure connection strings include passwords

---

## Cost Comparison

| Provider | Free Tier | Limitations | Best For |
|----------|-----------|-------------|----------|
| **Render** | 750 hrs/month | Sleeps after 15 min inactivity | Simple apps, demos |
| **Railway** | $5 credit/month | Credit-based | Active development |
| **Fly.io** | 3 shared VMs | Resource limits | Production-ready apps |

---

## Recommended: Render

For your use case, **Render is the easiest and most reliable option**:
1. Simple setup with `render.yaml`
2. Auto-deploy from GitHub
3. Free SSL certificates
4. Easy environment variable management
5. Good uptime even on free tier

Just follow the "Option 1: Deploy to Render" steps above! 🚀

