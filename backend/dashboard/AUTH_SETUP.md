# Authentication Setup Guide

This guide explains the authentication system for the Taste & Grow Dashboard.

## Overview

The dashboard now has a secure login/logout system that:
- ✅ Only allows **ADMIN** users to access the dashboard
- ✅ Uses JWT token-based authentication
- ✅ Stores session data in localStorage for persistence
- ✅ Displays admin username in the header with a dropdown menu
- ✅ Provides a logout button to end the session
- ✅ Protects all dashboard routes from unauthorized access

## Setup Instructions

### 1. Create Environment Variables

Create a `.env.development` file in the `backend/dashboard` directory:

```bash
# Development API Configuration
VITE_API_URL=http://localhost:3000
```

For production, create a `.env.production` file:

```bash
# Production API Configuration
VITE_API_URL=https://your-api-url.com
```

### 2. Create an Admin User

You need to create an admin user in your database. Use the API to register:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@tasteandgrow.com",
    "password": "YourSecurePassword123!",
    "role": "ADMIN"
  }'
```

Or use Prisma Studio / Database GUI to manually update a user's role to "ADMIN".

### 3. Start the Dashboard

```bash
cd backend/dashboard
npm install
npm run dev
```

### 4. Login

Navigate to `http://localhost:5173/login` and enter your admin credentials.

## Features

### Login Page (`/login`)
- Clean, modern login form
- Email and password authentication
- Error handling for invalid credentials
- Admin role verification (non-admins cannot login)
- Loading states during authentication

### Protected Routes
- All dashboard routes require authentication
- Unauthenticated users are redirected to `/login`
- Authentication state persists across page refreshes

### Header Component
- Displays in the top-right corner of the dashboard
- Shows the admin's name and role
- Avatar with user initials
- Dropdown menu with:
  - User profile information
  - Profile link (placeholder)
  - Logout button

### Authentication Context
- Manages global authentication state
- Handles login/logout operations
- Provides user data to all components
- Stores JWT token in localStorage
- Auto-loads saved session on app start

## File Structure

```
backend/dashboard/src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   ├── Header.tsx               # Top header with user info & logout
│   ├── ProtectedRoute.tsx       # Route wrapper for authentication
│   └── Layout.tsx               # Updated with Header component
├── pages/
│   └── Login.tsx                # Login page with form
└── App.tsx                      # Updated with AuthProvider & routes
```

## API Integration

The authentication system uses the following API endpoints:

### POST `/auth/login`
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN",
    "phone": "+1234567890",
    "preferredLanguage": "en"
  },
  "token": "jwt_token_here"
}
```

## Security Features

1. **Role-Based Access**: Only ADMIN users can login to the dashboard
2. **JWT Authentication**: Secure token-based authentication
3. **Protected Routes**: All routes require valid authentication
4. **Secure Storage**: Tokens stored in localStorage
5. **Session Persistence**: Login persists across page refreshes
6. **Error Handling**: Clear error messages for failed login attempts

## Logout

Click on the avatar/username in the top-right corner and select "Log out" from the dropdown menu. This will:
1. Remove the JWT token from localStorage
2. Clear the user session
3. Redirect to the login page

## API Client

The dashboard uses an authenticated API client (`src/lib/api-client.ts`) that automatically:
- Includes JWT token in all API requests
- Handles expired tokens by redirecting to login
- Provides convenient methods for all HTTP verbs

### Usage
```typescript
import { api } from '@/lib/api-client';

// Authenticated request (default)
const response = await api.get('/auth/users');
const response = await api.patch('/auth/users/:id', data);
const response = await api.delete('/auth/users/:id');

// Public endpoint (no auth required)
const response = await api.get('/schools', { requiresAuth: false });
```

## Troubleshooting

### "Only administrators can access this dashboard"
- **Problem**: The user account doesn't have the ADMIN role
- **Solution**: Update the user's role in the database to "ADMIN"

### "Failed to login. Please check your credentials."
- **Problem**: Email or password is incorrect
- **Solution**: Verify credentials or reset password

### 401 Unauthorized when updating/deleting
- **Problem**: JWT token not being sent with request
- **Solution**: Make sure you're using the `api` client from `@/lib/api-client` instead of raw `fetch`
- **Note**: This has been fixed - all pages now use the authenticated API client

### "Session expired. Please login again."
- **Problem**: JWT token has expired or is invalid
- **Solution**: Login again - the dashboard will automatically redirect you

### API Connection Issues
- Check that `VITE_API_URL` in your `.env` file is correct
- Ensure the API server is running
- Check browser console for network errors
- Verify CORS settings in the API if requests are being blocked

## Development Notes

- The authentication context is at the root level of the app
- All protected routes are wrapped in `<ProtectedRoute>` component
- The Header component automatically hides when not authenticated
- Session data is stored in localStorage keys: `authToken` and `authUser`

## Next Steps

Consider adding:
- Password reset functionality
- Two-factor authentication
- Session timeout
- Refresh token rotation
- Audit logging for admin actions

