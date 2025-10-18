# Vercel Environment Variable Setup

After deploying your API, you need to update your Vercel dashboard to use the production API URL.

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

