# Authentication Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Opens Dashboard                         │
│                    (http://localhost:5173)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │  App.tsx Loads      │
            │  with AuthProvider  │
            └──────────┬──────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ AuthContext Checks   │
            │ localStorage for:    │
            │ - authToken          │
            │ - authUser           │
            └──────────┬───────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
      ┌────▼─────┐          ┌─────▼────┐
      │  Found   │          │Not Found │
      │  Token   │          │  Token   │
      └────┬─────┘          └─────┬────┘
           │                      │
           │                      ▼
           │           ┌──────────────────────┐
           │           │ ProtectedRoute       │
           │           │ Redirects to /login  │
           │           └──────────┬───────────┘
           │                      │
           │                      ▼
           │           ┌──────────────────────┐
           │           │   LOGIN PAGE         │
           │           │                      │
           │           │  ┌──────────────┐   │
           │           │  │ Email Field  │   │
           │           │  ├──────────────┤   │
           │           │  │Password Field│   │
           │           │  ├──────────────┤   │
           │           │  │ Login Button │   │
           │           │  └──────────────┘   │
           │           └──────────┬───────────┘
           │                      │
           │                      │ User Submits
           │                      ▼
           │           ┌─────────────────────┐
           │           │ POST /auth/login    │
           │           │ to API Server       │
           │           └──────────┬──────────┘
           │                      │
           │          ┌───────────┴────────────┐
           │          │                        │
           │     ┌────▼────┐            ┌─────▼─────┐
           │     │ SUCCESS │            │   ERROR   │
           │     │Role=ADMIN            │Wrong Pass/│
           │     │         │            │Non-Admin  │
           │     └────┬────┘            └─────┬─────┘
           │          │                       │
           │          │                       ▼
           │          │            ┌──────────────────┐
           │          │            │ Show Error Msg   │
           │          │            │ Stay on /login   │
           │          │            └──────────────────┘
           │          │
           │          ▼
           │   ┌──────────────────┐
           │   │ Store in         │
           │   │ localStorage:    │
           │   │ - authToken      │
           │   │ - authUser       │
           │   └────────┬─────────┘
           │            │
           │            ▼
           │   ┌──────────────────┐
           │   │ Navigate to "/"  │
           │   │ (Dashboard)      │
           │   └────────┬─────────┘
           │            │
           └────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │      DASHBOARD LOADS          │
         │                               │
         │  ┌──────────────────────┐    │
         │  │    SIDEBAR (Left)    │    │
         │  │  - Analytics         │    │
         │  │  - Website           │    │
         │  │  - Game              │    │
         │  │  - Settings          │    │
         │  └──────────────────────┘    │
         │                               │
         │  ┌──────────────────────┐    │
         │  │  HEADER (Top Right)  │    │
         │  │  ┌──────────────┐    │    │
         │  │  │ Admin User   │    │    │
         │  │  │ ADMIN ▼      │    │    │
         │  │  └──────┬───────┘    │    │
         │  │         │            │    │
         │  │    Click Avatar      │    │
         │  │         │            │    │
         │  │         ▼            │    │
         │  │  ┌─────────────┐    │    │
         │  │  │ Dropdown    │    │    │
         │  │  │ - Profile   │    │    │
         │  │  │ - Log out   │◄───┼────┼──┐
         │  │  └─────────────┘    │    │  │
         │  └──────────────────────┘    │  │
         │                               │  │
         │  ┌──────────────────────┐    │  │
         │  │   MAIN CONTENT       │    │  │
         │  │   (Current Page)     │    │  │
         │  └──────────────────────┘    │  │
         └──────────────────────────────┘  │
                                           │
                        User Clicks Logout │
                                           │
                        ┌──────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  Clear Session  │
              │  - Remove Token │
              │  - Remove User  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Navigate to     │
              │    /login       │
              └─────────────────┘
                       │
                       ▼
                   [LOOP BACK TO TOP]
```

## Component Hierarchy

```
App.tsx
├── AuthProvider (Context)
│   └── Provides: { user, token, login, logout, isLoading }
│
├── BrowserRouter
    ├── Route: /login
    │   └── Login.tsx
    │       ├── Uses: useAuth()
    │       └── Calls: login(email, password)
    │
    └── Route: / (Protected)
        └── ProtectedRoute
            ├── Checks: user exists
            └── Layout.tsx
                ├── Sidebar (AppSidebar.tsx)
                │   └── Navigation Links
                │
                ├── Header.tsx
                │   ├── Uses: useAuth()
                │   ├── Shows: user.name, user.role
                │   └── Dropdown with logout button
                │
                └── Outlet (Nested Routes)
                    ├── Analytics
                    ├── Users
                    ├── Schools
                    ├── SchoolCodes
                    ├── Corridors
                    ├── Cards
                    └── Settings
```

## Data Flow

### Login Flow
```
User Input (email, password)
    ↓
Login.tsx → login(email, password)
    ↓
AuthContext → fetch POST /auth/login
    ↓
API Response → { user, token }
    ↓
Check user.role === 'ADMIN'
    ↓ YES
Store in localStorage
    ↓
Update Context State
    ↓
Navigate to Dashboard
```

### Protected Route Check
```
User tries to access protected route
    ↓
ProtectedRoute component
    ↓
useAuth() → check user exists
    ↓
┌───────┴────────┐
│                │
User Exists    No User
    ↓              ↓
Render         Redirect
Children       to /login
```

### Logout Flow
```
User clicks "Log out"
    ↓
Header.tsx → logout()
    ↓
AuthContext → Clear localStorage
    ↓
Update State: user = null, token = null
    ↓
ProtectedRoute detects no user
    ↓
Redirect to /login
```

## State Management

```javascript
// AuthContext State
{
  user: {
    id: "uuid",
    email: "admin@tasteandgrow.com",
    name: "Admin User",
    role: "ADMIN",
    phone: "+1234567890"
  },
  token: "eyJhbGciOiJIUzI1NiIs...",
  isLoading: false
}

// localStorage Keys
{
  "authToken": "eyJhbGciOiJIUzI1NiIs...",
  "authUser": "{...JSON stringified user object...}"
}
```

## API Integration Points

### 1. Login
```
Frontend                          Backend
   │                                │
   │  POST /auth/login              │
   │  { email, password }           │
   ├───────────────────────────────>│
   │                                │ Validate credentials
   │                                │ Check role === ADMIN
   │                                │ Generate JWT token
   │                                │
   │  { user, token }               │
   │<───────────────────────────────┤
   │                                │
Store token & user
Navigate to dashboard
```

### 2. Protected API Calls (Future)
```
Frontend                          Backend
   │                                │
   │  GET /api/users                │
   │  Authorization: Bearer {token} │
   ├───────────────────────────────>│
   │                                │ Verify JWT token
   │                                │ Check user role
   │                                │ Process request
   │                                │
   │  { data }                      │
   │<───────────────────────────────┤
   │                                │
```

## Security Checkpoints

```
1. Login Page
   └─> Validate ADMIN role

2. ProtectedRoute
   └─> Check user exists in context

3. localStorage
   └─> Store token & user data

4. API Calls (if implemented)
   └─> Send token in Authorization header

5. Header Component
   └─> Display user info
   └─> Provide logout option
```

## Error Handling Flow

```
Login Attempt
    ↓
API Call
    ↓
┌───────┴───────┐
│               │
Success      Error
│               │
│               ├─> Wrong Credentials
│               │   └─> Show: "Invalid credentials"
│               │
│               ├─> Non-Admin User
│               │   └─> Show: "Only administrators..."
│               │
│               └─> Network Error
│                   └─> Show: "Failed to login..."
│
└─> Redirect to Dashboard
```

## Session Persistence

```
App Startup
    ↓
AuthContext useEffect
    ↓
Check localStorage
    ↓
┌────────┴─────────┐
│                  │
Token Found     No Token
│                  │
├─> Parse user     └─> user = null
├─> Set token          token = null
├─> Set user           isLoading = false
└─> isLoading = false
    │
    ↓
ProtectedRoute checks user
    │
    ├─> User exists → Render Dashboard
    └─> No user → Redirect to /login
```

---

This diagram shows the complete authentication flow from initial page load through login, protected route access, and logout. All components work together to provide a secure admin dashboard experience.

