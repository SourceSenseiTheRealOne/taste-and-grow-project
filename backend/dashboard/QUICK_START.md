# 🚀 Quick Start Guide - Admin Authentication

## Prerequisites
- ✅ API server running at `http://localhost:3000`
- ✅ Database with Prisma schema applied

## Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend/dashboard
npm install
```

### Step 2: Create Environment File
Create `.env.development` in `backend/dashboard/`:
```bash
VITE_API_URL=http://localhost:3000
```

### Step 3: Create Admin User

**Option A - Using curl:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@tasteandgrow.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

**Option B - Using PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Admin User","email":"admin@tasteandgrow.com","password":"Admin123!","role":"ADMIN"}'
```

**Option C - Using Postman/Insomnia:**
- Method: `POST`
- URL: `http://localhost:3000/auth/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@tasteandgrow.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### Step 4: Start Dashboard
```bash
npm run dev
```

### Step 5: Login
1. Open browser to `http://localhost:5173`
2. You'll be redirected to `/login`
3. Enter credentials:
   - Email: `admin@tasteandgrow.com`
   - Password: `Admin123!`
4. Click "Login"
5. You're in! 🎉

## What You'll See

### Login Page (`/login`)
- Taste & Grow logo and branding
- Email and password fields
- Login button
- Error messages if credentials are wrong

### Dashboard (after login)
- **Sidebar** (left): Navigation menu
- **Header** (top right): 
  - Your name and role
  - Avatar with your initials
  - Dropdown menu with logout option
- **Main content**: Analytics, Users, Schools, etc.

## Logout
1. Click your avatar/name in the top right
2. Click "Log out"
3. You'll be redirected to login page
4. Session is cleared

## Common Issues

### ❌ "Only administrators can access this dashboard"
**Problem**: User account doesn't have ADMIN role  
**Solution**: Make sure you set `"role": "ADMIN"` when creating the user

### ❌ "Failed to login. Please check your credentials."
**Problem**: Wrong email or password  
**Solution**: Double-check your credentials or create a new admin user

### ❌ Can't connect to API
**Problem**: API server not running or wrong URL  
**Solution**: 
1. Check API is running: `cd backend/api && npm run dev`
2. Verify `.env.development` has correct URL: `VITE_API_URL=http://localhost:3000`

### ❌ Login page doesn't show
**Problem**: Dashboard not running  
**Solution**: Run `npm run dev` in `backend/dashboard`

## Testing the Authentication

### Test Case 1: Valid Admin Login ✅
1. Go to `/login`
2. Enter valid admin credentials
3. Should redirect to dashboard
4. Should see your name in top right

### Test Case 2: Invalid Credentials ❌
1. Go to `/login`
2. Enter wrong password
3. Should show error message
4. Should stay on login page

### Test Case 3: Non-Admin User ❌
1. Create user with role "USER" or "TEACHER"
2. Try to login with those credentials
3. Should show "Only administrators" error

### Test Case 4: Protected Routes 🔒
1. Logout from dashboard
2. Try to access `http://localhost:5173/users` directly
3. Should redirect to `/login`

### Test Case 5: Session Persistence 💾
1. Login to dashboard
2. Refresh the page (F5)
3. Should stay logged in
4. Should not redirect to login

## Environment Variables

### Development (`.env.development`)
```bash
VITE_API_URL=http://localhost:3000
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://your-api-url.onrender.com
```

Or set in Vercel:
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-api-url.com`
4. Save and redeploy

## File Structure Overview

```
backend/dashboard/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state & login/logout logic
│   ├── components/
│   │   ├── Header.tsx               # Top bar with user info & logout
│   │   ├── ProtectedRoute.tsx       # Wraps routes requiring auth
│   │   └── Layout.tsx               # Main layout with sidebar & header
│   ├── pages/
│   │   ├── Login.tsx                # Login page
│   │   └── ...other pages
│   └── App.tsx                      # Main app with routes
└── .env.development                 # Environment variables
```

## Next Steps

After successful login, you can:
- 📊 View analytics
- 👥 Manage users
- 🏫 Manage schools
- 🔑 Generate school access codes
- 🎮 Configure game content
- ⚙️ Update settings

## Need Help?

- 📖 Detailed guide: [AUTH_SETUP.md](./AUTH_SETUP.md)
- 📋 All changes: [AUTHENTICATION_CHANGES.md](./AUTHENTICATION_CHANGES.md)
- 🌍 Environment setup: [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)
- 📚 General info: [README.md](./README.md)

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create new user |
| `/auth/login` | POST | Login and get JWT token |

Response from `/auth/login`:
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@tasteandgrow.com",
    "name": "Admin User",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Security Notes

- 🔐 JWT tokens stored in localStorage
- 🛡️ Only ADMIN role can access dashboard
- 🔒 All routes protected (except `/login`)
- 💾 Session persists across refreshes
- 🚪 Logout clears all session data

---

**Ready to go!** Follow the steps above and you'll be logged in within minutes. 🚀

