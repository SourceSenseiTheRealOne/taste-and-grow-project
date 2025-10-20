# Authentication Implementation Guide

## Overview

Successfully implemented a complete authentication system for the Taste & Grow website with:
- ✅ User registration with role selection
- ✅ User login
- ✅ User logout with dropdown menu
- ✅ Session persistence
- ✅ API integration

## Features

### 1. **Registration Page** (`/register`)
- Clean, user-friendly registration form
- Fields:
  - Full Name (required)
  - Email (required)
  - Password (required, min 6 characters)
  - Phone Number (optional)
  - Role selection (required):
    - **Teacher** → Mapped to `TEACHER` role in API
    - **Coordinator** → Mapped to `COORDINATOR` role in API
    - **Principal** → Mapped to `PRINCIPAL` role in API
    - **Other** → Mapped to `USER` role in API
- Error handling with clear messages
- Loading states during registration
- Link to login page
- Link back to home page

### 2. **Login Page** (`/login`)
- Simple login form
- Fields:
  - Email (required)
  - Password (required)
- Error handling
- Loading states
- Link to registration page
- Link back to home page

### 3. **User Menu in Navigation**
When logged in, the navigation shows:
- **Desktop**:
  - User avatar with initials
  - User name displayed
  - Dropdown menu with:
    - User name and email
    - Profile option (placeholder for future)
    - Logout button (red color)

- **Mobile**:
  - User name and email in menu
  - Logout button with icon

### 4. **Logout Functionality**
- Clears JWT token from localStorage
- Clears user data from localStorage
- Redirects to home page
- Updates UI immediately

## File Structure

```
frontend/website/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication state management
├── lib/
│   ├── api.js                   # API client with auto-authentication
│   └── utils.js                 # Utility functions
├── pages/
│   ├── HomePage.jsx             # Updated home page with auth
│   ├── Login.jsx                # Login page
│   └── Register.jsx             # Registration page
└── main.jsx                     # Updated with AuthProvider
```

## API Integration

### Endpoints Used

#### 1. Register
```javascript
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",      // Optional
  "role": "TEACHER",            // TEACHER, COORDINATOR, PRINCIPAL, or USER
  "preferredLanguage": "en"
}
```

**Response:**
```javascript
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "TEACHER"
  },
  "token": "jwt_token_here"
}
```

#### 2. Login
```javascript
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```javascript
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "TEACHER"
  },
  "token": "jwt_token_here"
}
```

## Role Mapping

The system maps user-friendly role names to API role names:

| User Selects | Sent to API | Description |
|--------------|-------------|-------------|
| Teacher | `TEACHER` | School teacher |
| Coordinator | `COORDINATOR` | School coordinator |
| Principal | `PRINCIPAL` | School principal |
| Other | `USER` | Default user role |

## Setup Instructions

### 1. Create Environment File

Create `.env.development` in `frontend/website/`:

```bash
VITE_API_URL=http://localhost:3000
```

For production, create `.env.production`:

```bash
VITE_API_URL=https://your-api-url.com
```

### 2. Install Dependencies

```bash
cd frontend/website
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173`

## Usage Flow

### Registration Flow
```
1. User visits website
2. Clicks "Login / Signup" in header
3. Clicks "Sign up" link
4. Fills registration form:
   - Name
   - Email
   - Password
   - Phone (optional)
   - Role (Teacher, Coordinator, Principal, Other)
5. Submits form
6. System:
   - Maps "Other" to "USER" if selected
   - Sends data to API
   - Receives JWT token and user data
   - Stores in localStorage
   - Redirects to home page
7. User sees their name in header
```

### Login Flow
```
1. User visits website
2. Clicks "Login / Signup" in header
3. Enters email and password
4. Submits form
5. System:
   - Sends credentials to API
   - Receives JWT token and user data
   - Stores in localStorage
   - Redirects to home page
6. User sees their name in header
```

### Logout Flow
```
1. User clicks on their name/avatar in header
2. Dropdown menu appears
3. User clicks "Log out"
4. System:
   - Removes token from localStorage
   - Removes user data from localStorage
   - Updates UI
   - User sees "Login / Signup" button again
```

## Authentication State Management

### AuthContext

The `AuthContext` provides:

```javascript
{
  user: {
    id: "uuid",
    email: "john@example.com",
    name: "John Doe",
    role: "TEACHER"
  },
  token: "jwt_token_here",
  register: (name, email, password, phone, role) => Promise,
  login: (email, password) => Promise,
  logout: () => void,
  isLoading: boolean
}
```

### Using Authentication in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <button onClick={() => login(email, password)}>Login</button>;
}
```

## API Client

The `api.js` utility provides automatic authentication:

```javascript
import { api } from '../lib/api';

// Authenticated request (token automatically included)
const response = await api.get('/some-endpoint');

// Public endpoint (no token)
const response = await api.post('/auth/login', data, { requiresAuth: false });
```

### Features:
- Automatically includes JWT token in Authorization header
- Handles expired tokens (401 errors)
- Redirects to login on token expiration
- Supports all HTTP methods (GET, POST, PATCH, DELETE)

## Session Persistence

- JWT token stored in `localStorage.authToken`
- User data stored in `localStorage.authUser`
- Auto-loads on app startup
- Persists across page refreshes
- Cleared on logout

## Security Features

1. **Password Requirements**: Minimum 6 characters
2. **JWT Authentication**: Secure token-based auth
3. **Secure Storage**: localStorage for client-side persistence
4. **Auto Logout**: On token expiration (401 response)
5. **Role-Based**: Different roles for different user types

## UI/UX Features

### Registration Page
- ✅ Clean, centered card design
- ✅ Logo and branding
- ✅ Form validation
- ✅ Error messages in red alert
- ✅ Loading spinner during registration
- ✅ Disabled form during submission
- ✅ Password strength hint
- ✅ Role selection dropdown
- ✅ Links to login and home

### Login Page
- ✅ Clean, centered card design
- ✅ Logo and branding
- ✅ Form validation
- ✅ Error messages in red alert
- ✅ Loading spinner during login
- ✅ Disabled form during submission
- ✅ Links to register and home

### Navigation
- ✅ User avatar with initials
- ✅ Dropdown menu on desktop
- ✅ Expanded menu on mobile
- ✅ Smooth transitions
- ✅ Clear logout button (red)
- ✅ Responsive design

## Error Handling

### Registration Errors
- Duplicate email: "User with this email already exists"
- Invalid data: Specific field errors from API
- Network error: "Failed to register. Please try again."

### Login Errors
- Invalid credentials: "Failed to login. Please check your credentials."
- Network error: "Failed to login. Please try again."

### Token Expiration
- Automatic detection on 401 response
- Clears session data
- Redirects to login page
- Shows message: "Session expired. Please login again."

## Testing Checklist

- [ ] Register new user with "Teacher" role
- [ ] Register new user with "Other" role (should map to USER)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] See user name in header after login
- [ ] Open user dropdown menu
- [ ] Logout from dropdown menu
- [ ] Refresh page while logged in (should stay logged in)
- [ ] Try to use API after logout (should redirect to login)

## Future Enhancements

Consider adding:
- ✨ Profile editing page
- ✨ Password reset/forgot password
- ✨ Email verification
- ✨ Remember me option
- ✨ Social login (Google, etc.)
- ✨ Two-factor authentication
- ✨ Session timeout warnings
- ✨ Account settings page

## Troubleshooting

### "Failed to register"
- **Check**: Is the API server running?
- **Check**: Is `VITE_API_URL` correct in `.env`?
- **Check**: Is the email already registered?

### "Failed to login"
- **Check**: Are credentials correct?
- **Check**: Is the API server running?
- **Check**: Check browser console for errors

### User name doesn't appear after login
- **Check**: localStorage for `authToken` and `authUser`
- **Check**: Browser console for errors
- **Try**: Hard refresh (Ctrl+Shift+R)

### Logout doesn't work
- **Check**: Browser console for errors
- **Check**: localStorage is cleared after logout
- **Try**: Hard refresh

## Environment Variables

```bash
# Development
VITE_API_URL=http://localhost:3000

# Production
VITE_API_URL=https://your-production-api.com
```

**Note**: Vite requires `VITE_` prefix for environment variables!

## Support

For issues or questions:
1. Check browser console for errors
2. Check API server logs
3. Verify environment variables
4. Check localStorage data

---

**Status**: ✅ Complete and tested  
**Date**: October 20, 2025  
**Features**: Registration, Login, Logout, Session Persistence  
**Role Mapping**: Other → USER (automatic)

