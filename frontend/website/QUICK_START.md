# Quick Start - Website Authentication

## 🚀 Get Started in 3 Minutes

### Step 1: Create Environment File
Create `.env.development` in `frontend/website/`:
```bash
VITE_API_URL=http://localhost:3000
```

### Step 2: Start the Website
```bash
cd frontend/website
npm install  # If not already installed
npm run dev
```

### Step 3: Test It!
1. Open browser to `http://localhost:5173`
2. Click "Login / Signup" button
3. Click "Sign up"
4. Fill the form:
   - Name: Your Name
   - Email: your@email.com
   - Password: test123 (min 6 chars)
   - Role: Select "Teacher", "Coordinator", "Principal", or "Other"
5. Click "Create Account"
6. ✅ You're logged in! Your name appears in the top right

## Features

### ✨ What Works

**Registration (`/register`)**
- Full name, email, password, phone
- Role selection:
  - Teacher → TEACHER role
  - Coordinator → COORDINATOR role
  - Principal → PRINCIPAL role
  - **Other → USER role** (automatic mapping!)

**Login (`/login`)**
- Email and password
- Error messages for invalid credentials
- Redirects to home after success

**Logout**
- Click your name in the header
- Click "Log out" in dropdown
- Redirects to home
- Session cleared

**User Menu**
- Shows user name and avatar (initials)
- Dropdown with profile and logout
- Responsive (works on mobile too!)

## Test Scenarios

### ✅ Test 1: Register New User
1. Go to `/register`
2. Fill all fields
3. **Select "Other" for role**
4. Submit
5. Check: User logged in, name shows in header

### ✅ Test 2: Login Existing User
1. Go to `/login`
2. Enter credentials
3. Submit
4. Check: User logged in, name shows in header

### ✅ Test 3: Logout
1. Click on your name (top right)
2. Click "Log out"
3. Check: "Login / Signup" button appears again

### ✅ Test 4: Session Persistence
1. Login
2. Refresh page (F5)
3. Check: Still logged in

### ✅ Test 5: Role Mapping
1. Register with role "Other"
2. Check API response or database
3. **Should see role: "USER"** (not "OTHER")

## Role Mapping

| User Selects | API Receives |
|--------------|--------------|
| Teacher | TEACHER |
| Coordinator | COORDINATOR |
| Principal | PRINCIPAL |
| **Other** | **USER** |

## Troubleshooting

### Problem: Can't see login button
**Solution**: Check if you're already logged in. Try logging out first.

### Problem: Registration fails
**Check**:
- Is API running? (`cd backend/api && npm run dev`)
- Is VITE_API_URL correct in `.env.development`?
- Is email already registered?

### Problem: "Failed to register"
**Check**: Browser console (F12) for detailed error message

### Problem: Name doesn't appear after login
**Solution**: Hard refresh (Ctrl+Shift+R) or check localStorage

## Quick Commands

```bash
# Start API (Terminal 1)
cd backend/api
npm run dev

# Start Website (Terminal 2)
cd frontend/website
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

## API Endpoints Used

```
POST /auth/register  - Create new user
POST /auth/login     - Login user
```

## localStorage Keys

After login, check browser localStorage:
- `authToken` - JWT token
- `authUser` - User data (JSON)

## Next Steps

After authentication works:
1. Add profile editing page
2. Add password reset
3. Add email verification
4. Add "Remember me" option
5. Add social login

---

**Ready?** Just run `npm run dev` and visit `http://localhost:5173`! 🎉

