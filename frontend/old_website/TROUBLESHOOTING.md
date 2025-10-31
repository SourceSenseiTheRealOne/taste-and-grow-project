# Troubleshooting Guide - ERR_BLOCKED_BY_CLIENT

## Quick Fix Checklist ✅

If you're getting `ERR_BLOCKED_BY_CLIENT` errors, follow these steps:

### 1. Check Browser Extensions (Most Common Cause)

The `ERR_BLOCKED_BY_CLIENT` error is **usually caused by browser extensions**:

**Disable these extensions temporarily:**
- ❌ Ad blockers (uBlock Origin, Adblock Plus, etc.)
- ❌ Privacy extensions (Privacy Badger, Ghostery, etc.)
- ❌ Security extensions (HTTPS Everywhere, etc.)
- ❌ Content blockers

**How to test:**
1. Open browser in **Incognito/Private mode** (extensions disabled by default)
2. Try login/register again
3. If it works → Extension is the problem

**Solution:**
- Whitelist `localhost:5173` and `localhost:3000` in your extension settings
- Or disable extensions when developing

### 2. Restart Dev Server (After Adding .env Files)

**Important:** After adding `.env.development` and `.env.production` files, you MUST restart the Vite dev server!

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
cd frontend/website
npm run dev
```

The server needs to reload to pick up the new environment variables.

### 3. Verify Backend is Running

Make sure your backend API is running on port 3000:

```bash
cd backend/api
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3000
```

**Test backend directly:**
```bash
# In a new terminal or browser
curl http://localhost:3000/auth/users
# or visit http://localhost:3000/auth/users in browser
```

### 4. Check Environment Variables

Open browser console and look for this log message:
```
🔧 API Configuration: {
  VITE_API_URL: "http://localhost:3000",
  API_URL: "http://localhost:3000",
  MODE: "development"
}
```

**If you don't see this or if API_URL is wrong:**

1. Make sure `.env.development` exists:
   ```bash
   cd frontend/website
   cat .env.development
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

### 5. Clear Browser Cache

Sometimes cached requests cause issues:

1. Open DevTools (F12)
2. Right-click on reload button
3. Select "Empty Cache and Hard Reload"
4. Try again

### 6. Check CORS Configuration

The backend should now have proper CORS configured. If you still have CORS issues:

**Verify backend CORS is enabled:**
- Check `backend/api/src/main.ts`
- Should include `localhost:5173` in allowed origins

**Test CORS:**
```bash
# In terminal
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/auth/login
```

Should return CORS headers.

## Detailed Debugging Steps

### Step 1: Open Browser DevTools

1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Look for these log messages:

**Good (Working):**
```
🔧 API Configuration: { ... }
📡 API Request: { method: "POST", url: "http://localhost:3000/auth/login" }
```

**Bad (Not Working):**
```
❌ API Request Failed: { ... }
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

### Step 2: Check Network Tab

1. Go to **Network** tab in DevTools
2. Try to login/register
3. Look at the failed request

**If you see:**
- Status: `(blocked:other)` or `(failed)` → Browser extension blocking
- Status: `(cancelled)` → CORS issue
- Status: `404` → Backend not running
- Status: `500` → Backend error

### Step 3: Check Request Details

Click on the failed request in Network tab:

**Headers tab:**
- Check `Request URL` - Should be `http://localhost:3000/auth/login`
- Check `Request Method` - Should be `POST`

**If URL is wrong:**
- Environment variable not loaded
- Restart dev server

## Common Error Scenarios

### Scenario 1: Extension Blocking

**Symptoms:**
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

**Solution:**
- Test in Incognito mode
- Disable ad blockers
- Whitelist localhost

### Scenario 2: Backend Not Running

**Symptoms:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution:**
```bash
cd backend/api
npm run start:dev
```

### Scenario 3: CORS Error

**Symptoms:**
```
Access to fetch at 'http://localhost:3000/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Backend CORS is already configured
- Restart backend server
- Check backend logs for CORS errors

### Scenario 4: Wrong API URL

**Symptoms:**
- Requests going to wrong URL
- 404 errors

**Solution:**
1. Check `.env.development`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Check console logs for API configuration

## Production Deployment

### For Production Build:

Make sure `.env.production` exists:
```
VITE_API_URL=https://taste-and-grow-project-1.onrender.com
VITE_ENVIRONMENT=production
```

**Build and test:**
```bash
cd frontend/website
npm run build
npm run preview
```

### Verify Production API:

Test your production API:
```bash
curl https://taste-and-grow-project-1.onrender.com/auth/users
```

Should return JSON response.

## Quick Reference

### Dev Server Commands

```bash
# Frontend
cd frontend/website
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend/api
npm run start:dev    # Start development server
npm run start:prod   # Start production server
```

### Environment Files

**.env.development** (for `npm run dev`):
```
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

**.env.production** (for `npm run build`):
```
VITE_API_URL=https://taste-and-grow-project-1.onrender.com
VITE_ENVIRONMENT=production
```

### Port Configuration

- **Frontend (Vite):** `http://localhost:5173`
- **Backend (NestJS):** `http://localhost:3000`

### Testing Checklist

Before testing, ensure:
- [ ] Backend is running (`npm run start:dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] `.env.development` file exists
- [ ] Dev servers restarted after adding .env files
- [ ] Browser extensions disabled or incognito mode
- [ ] No VPN or proxy interfering

## Still Not Working?

### 1. Complete Reset

```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend/api
rm -rf node_modules
npm install
npm run start:dev

# Frontend (new terminal)
cd frontend/website
rm -rf node_modules dist
npm install
npm run dev
```

### 2. Check Firewall/Antivirus

Some antivirus or firewall software blocks localhost connections:
- Temporarily disable
- Add exception for localhost:3000 and localhost:5173

### 3. Try Different Browser

Test in different browsers:
- Chrome
- Firefox
- Edge

### 4. Check Logs

**Backend logs:**
- Should show incoming requests
- No CORS errors

**Frontend console:**
- Should show API configuration
- Should show request logs

### 5. Manual API Test

Test API directly with curl or Postman:

```bash
# Test registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "TEACHER"
  }'

# Should return JSON with user and token
```

If this works, the API is fine → Issue is in frontend/browser.

## Summary

**Most Common Causes (90% of cases):**
1. 🚫 Browser extensions (ad blockers)
2. 🔄 Dev server not restarted after .env changes
3. ⚠️ Backend not running

**Quick Fix:**
1. Test in Incognito mode
2. Restart dev server: `npm run dev`
3. Restart backend: `npm run start:dev`

**For More Help:**
- Check browser console for detailed error messages
- Check backend terminal for API logs
- Review Network tab in DevTools

