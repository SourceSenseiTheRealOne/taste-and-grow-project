# Taste & Grow API - Setup Documentation

## ✅ What Has Been Configured

### 1. Prisma & Supabase Integration
- **Prisma ORM** configured with PostgreSQL
- **Supabase** database connection established
- Connection pooling enabled for production performance
- Direct URL configured for migrations

### 2. User Model
Created a `User` table with the following fields:
- `id` (UUID, auto-generated)
- `email` (unique)
- `name`
- `password` (hashed with bcrypt)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### 3. JWT Authentication
Implemented complete authentication system:
- User registration endpoint
- User login endpoint
- Password hashing with bcrypt
- JWT token generation and validation
- Protected routes support with JWT Strategy

### 4. Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts    # Registration validation
│   │   └── login.dto.ts       # Login validation
│   ├── guards/
│   │   └── jwt-auth.guard.ts  # JWT protection guard
│   ├── strategies/
│   │   └── jwt.strategy.ts    # JWT validation strategy
│   ├── auth.controller.ts     # Auth endpoints
│   ├── auth.service.ts        # Auth business logic
│   └── auth.module.ts         # Auth module config
├── prisma/
│   ├── prisma.service.ts      # Database service
│   └── prisma.module.ts       # Prisma module
├── app.module.ts              # Main app module
└── main.ts                    # Application entry point

prisma/
├── schema.prisma              # Database schema
└── migrations/                # Database migrations
```

## 🚀 API Endpoints

### Authentication

#### Register a New User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔐 Using Protected Routes

To protect a route with JWT authentication:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedResource(@Request() req) {
  return req.user; // Contains user info from JWT
}
```

## 📝 Environment Variables

Make sure to set these in your `.env` file:

```env
# Database connection (pooling)
DATABASE_URL="postgresql://postgres.pviyhpaievlepjrhwrqg:tasteandgrow123456@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres.pviyhpaievlepjrhwrqg:tasteandgrow123456@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

## 🛠️ Available Commands

### Development
```bash
npm run start:dev     # Start in watch mode
```

### Build
```bash
npm run build         # Build the project
npm run start:prod    # Run production build
```

### Database
```bash
npx prisma generate           # Generate Prisma Client
npx prisma migrate dev        # Create and apply migration
npx prisma migrate deploy     # Apply migrations in production
npx prisma studio            # Open Prisma Studio (GUI)
```

## ✨ Test Results

**Database Connection:** ✅ Connected to Supabase successfully

**Test User Created:**
- ID: `cc76c83d-abdd-4eee-b7df-0d5f91d83073`
- Name: `John Doe`
- Email: `john.doe@example.com`
- Password: `password123` (hashed in database)

**Endpoints Tested:**
- ✅ POST /auth/register - Working
- ✅ POST /auth/login - Working
- ✅ JWT Token Generation - Working

## 🎯 Next Steps

1. **Add More User Features:**
   - Email verification
   - Password reset
   - Profile update
   - User roles

2. **Add More Entities:**
   - Create new models in `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name your_migration_name`

3. **Secure Your API:**
   - Change JWT_SECRET in production
   - Add rate limiting
   - Implement refresh tokens
   - Add request validation

4. **Deploy:**
   - Set environment variables in production
   - Use `DATABASE_URL` for connection pooling
   - Use `DIRECT_URL` for migrations only

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [JWT Documentation](https://jwt.io/)

