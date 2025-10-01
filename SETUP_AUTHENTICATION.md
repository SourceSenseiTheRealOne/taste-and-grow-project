# JWT Authentication Setup Guide

This guide will help you set up JWT authentication for your Kids Game API and Dashboard.

## Prerequisites

1. **PostgreSQL Database**: Make sure you have PostgreSQL installed and running locally
2. **Node.js**: Ensure you have Node.js installed
3. **pgAdmin**: For database management (optional but recommended)

## Step 1: Database Setup

### 1.1 Create Database
1. Open pgAdmin or connect to PostgreSQL via command line
2. Create a new database named `kids_game_db`:

```sql
CREATE DATABASE kids_game_db;
```

### 1.2 Update Database Credentials
Edit the `.env` file in `api/api/.env` with your PostgreSQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=kids_game_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Step 2: Start the API Server

1. Navigate to the API directory:
```bash
cd api/api
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

The API will:
- Connect to your PostgreSQL database
- Automatically create the users table
- Create an admin user with credentials:
  - Email: `admin@kidsgame.com`
  - Password: `admin123`

## Step 3: Start the Dashboard

1. Navigate to the dashboard directory:
```bash
cd dashboard
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Step 4: Test Authentication

1. Open your browser and go to `http://localhost:5173`
2. You should be redirected to the login page
3. Use the admin credentials:
   - Email: `admin@kidsgame.com`
   - Password: `admin123`
4. After successful login, you'll be redirected to the dashboard

## API Endpoints

### Authentication Endpoints

- `POST /auth/login` - Login with email and password
- `GET /auth/profile` - Get current user profile (requires authentication)
- `GET /auth/verify` - Verify JWT token (requires authentication)

### Example API Usage

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kidsgame.com","password":"admin123"}'

# Access protected endpoint
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **Password Hashing**: Passwords are hashed using bcrypt
3. **Role-based Access**: Admin role required for dashboard access
4. **CORS Protection**: Configured for specific origins
5. **Token Expiration**: Tokens expire after 24 hours (configurable)

## File Structure

### API Files Added/Modified:
- `src/config/database.config.ts` - Database configuration
- `src/config/jwt.config.ts` - JWT configuration
- `src/entities/user.entity.ts` - User entity
- `src/auth/` - Authentication module
  - `auth.module.ts` - Auth module
  - `auth.service.ts` - Authentication service
  - `auth.controller.ts` - Auth endpoints
  - `strategies/` - Passport strategies
  - `guards/` - Route guards

### Dashboard Files Added/Modified:
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/pages/Login.tsx` - Login page
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/components/AppSidebar.tsx` - Updated with user info
- `src/App.tsx` - Updated with auth routing

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database `kids_game_db` exists

2. **CORS Error**:
   - Check API server is running on port 3001
   - Verify CORS configuration in `main.ts`

3. **Token Verification Failed**:
   - Check JWT secret matches between API and dashboard
   - Verify token hasn't expired

4. **Login Not Working**:
   - Check API server is running
   - Verify admin user was created (check console logs)
   - Check network tab for API errors

## Next Steps

1. **Change Default Credentials**: Update the admin password in production
2. **Environment Variables**: Use proper environment variables for production
3. **HTTPS**: Enable HTTPS for production deployment
4. **User Management**: Add user management features if needed
5. **Password Reset**: Implement password reset functionality

## Production Considerations

1. Change the JWT secret to a strong, random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Set up proper database backups
5. Consider using a more robust user management system
6. Implement rate limiting for login attempts
