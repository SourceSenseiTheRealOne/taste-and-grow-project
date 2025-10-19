# Database Schema & API Updates

## Overview

This document outlines all the database schema updates and new API endpoints added to support user registration with roles, school registration, and management features.

## Database Schema Changes

### 1. User Model - Enhanced with Role Support

**New Fields:**
- `phone` (String, optional) - User's phone number
- `role` (UserRole, default: USER) - User's role in the system
- `preferredLanguage` (String, optional, default: "en") - User's preferred language
- `schoolId` (String, optional) - Foreign key to School table
- `schoolAccessCode` (String, unique, optional) - Auto-generated access code for their school
- `parentsLink` (String, unique, optional) - Auto-generated shareable link for parents

**Relationships:**
- One user can belong to one school
- One school can have many users

**Migration Changes:**
- Added columns: phone, role, preferred_language, school_id, school_access_code, parents_link
- Added index on school_id for better query performance
- Added unique constraints on school_access_code and parents_link

### 2. School Model - Restructured with New Fields

**Removed Fields:**
- `name` → renamed to `schoolName`
- `address` → removed
- `city` → renamed to `cityRegion`
- `country` → removed

**New Fields:**
- `schoolName` (String) - Name of the school
- `cityRegion` (String) - City and/or region
- `contactName` (String) - Primary contact name at the school
- `email` (String, optional) - School email
- `phone` (String, optional) - School phone number
- `studentCount` (Integer, optional) - Number of students
- `schoolCode` (String, unique) - Auto-generated unique code for the school

**Relationships:**
- One school has many users
- One school has many teachers
- One school has many experiences
- One school has many school activations

### 3. New Models Added

#### Experience Model
Stores information about activities/experiences offered by schools.

**Fields:**
- `id` (UUID, primary key)
- `schoolId` (UUID, foreign key) - Links to school
- `name` (String) - Experience name
- `description` (String, optional) - Experience description
- `basePrice` (Float) - Base price for the experience
- `itemsIncluded` (String array) - Array of included items
- `active` (Boolean, default: true) - Whether the experience is active
- `createdAt`, `updatedAt` (Timestamps)

**Relationships:**
- One school has many experiences
- One experience has many school activations

#### SchoolActivation Model
Tracks when a school activates an experience with event details.

**Fields:**
- `id` (UUID, primary key)
- `schoolId` (UUID, foreign key) - Links to school
- `experienceId` (UUID, foreign key) - Links to experience
- `eventDate` (DateTime) - Date of the event
- `fundraiserAmount` (Float, default: 0) - Optional fundraiser component
- `totalRaised` (Float, default: 0) - Total amount raised
- `parentQrCode` (String, unique) - QR code for parents
- `teacherQrCode` (String, unique) - QR code for teachers
- `status` (String, default: "pending") - Status: pending, active, delivered
- `createdAt`, `updatedAt` (Timestamps)

**Relationships:**
- One school has many activations
- One experience has many activations

### 4. User Roles Enum

```typescript
enum UserRole {
  TEACHER       // Can register a school
  COORDINATOR   // Coordinator role
  PRINCIPAL     // Principal role
  ADMIN         // Full administrative access
  USER          // Default role
}
```

## API Endpoints

### Authentication

#### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "phone": "+1234567890",           // Optional
  "role": "TEACHER",                // Optional, defaults to USER
  "preferredLanguage": "en"         // Optional, defaults to "en"
}
```

**Response:**
- Returns user object with auto-generated fields
- Returns JWT token

#### 2. Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response:**
- Includes schoolAccessCode and parentsLink if user has registered a school
- Returns JWT token

### Schools

#### 3. User: Register a School
```
POST /schools/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "schoolName": "Central Elementary",
  "cityRegion": "New York, NY",
  "contactName": "Jane Smith",
  "email": "jane@school.edu",       // Optional
  "phone": "+1987654321",           // Optional
  "studentCount": 500               // Optional
}
```

**Features:**
- Links school to the authenticated user
- Auto-generates unique school code
- Auto-generates school access code
- Auto-generates parent share link
- Ensures user can only register one school

**Response:**
- Returns created school object
- Returns updated user object with access code and parent link

#### 4. Admin: Create a School
```
POST /schools
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "schoolName": "Downtown High School",
  "cityRegion": "Los Angeles, CA",
  "contactName": "Bob Johnson",
  "email": "bob@school.edu",        // Optional
  "phone": "+1555555555",           // Optional
  "studentCount": 1200              // Optional
}
```

**Features:**
- Admin-only endpoint
- Auto-generates school code
- No user linking required

#### 5. Admin: Get All Schools
```
GET /schools
Authorization: Bearer {admin-token}
```

**Features:**
- Admin-only endpoint
- Includes users and teachers for each school
- Returns all schools with full details

#### 6. Get School by Access Code
```
GET /schools/access-code/{accessCode}
```

**Features:**
- Public endpoint (no authentication)
- Retrieves school by its generated access code
- Used by parents to access school information

#### 7. Get School by ID
```
GET /schools/{id}
```

**Features:**
- Public endpoint
- Returns school with users and teachers

#### 8. Admin: Update School
```
PATCH /schools/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "schoolName": "Updated Name",
  "phone": "+1999999999"            // Any field can be updated
}
```

#### 9. Admin: Delete School
```
DELETE /schools/{id}
Authorization: Bearer {admin-token}
```

**Features:**
- Admin-only endpoint
- Cascades delete to users if needed

## Code Generation Utilities

### 1. generateSchoolAccessCode(schoolId: string)
- Creates unique access code from school ID
- Format: XXXX-XXXX-XXXX
- Used for one-time sharing with teachers

### 2. generateParentsLink(userId: string, schoolId: string)
- Creates unique shareable URL for parents
- Format: /parent-link/[encoded-base64]
- Used for parent registration and information

### 3. generateQRCode()
- Generates unique QR code identifier
- Used for parent and teacher QR codes

## Relationships Summary

```
User (1) -------- (Many) School
  |
  ├---- Phone Number
  ├---- Role (TEACHER, COORDINATOR, PRINCIPAL, ADMIN, USER)
  ├---- Preferred Language
  ├---- School Access Code (Unique)
  └---- Parents Link (Unique)

School (1) -------- (Many) User
  |
  ├---- School Code (Unique)
  ├---- School Name
  ├---- Contact Name
  ├---- Phone & Email
  ├---- Student Count
  |
  ├---- (1) -------- (Many) Experience
  ├---- (1) -------- (Many) SchoolActivation
  └---- (1) -------- (Many) Teacher

Experience (1) -------- (Many) SchoolActivation
  |
  ├---- Name & Description
  ├---- Base Price
  ├---- Items Included
  └---- Active Status

SchoolActivation (1) ---- (1) Experience
  |
  ├---- Event Date
  ├---- Fundraiser Amount
  ├---- QR Codes (Parent & Teacher)
  ├---- Status (pending, active, delivered)
  └---- Total Raised
```

## Migration Instructions

### Step 1: Create Migration
```bash
cd backend/api
npx prisma migrate dev --name add_user_roles_and_school_registration
```

### Step 2: Apply Migration to Production
```bash
npx prisma migrate deploy
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

## Security Considerations

1. **Access Codes:** School access codes and parent links are unique and cryptographically generated
2. **Role-Based Access:** All admin endpoints verify user role before allowing access
3. **Password Security:** All passwords are hashed with bcrypt before storage
4. **JWT Authentication:** Protected endpoints require valid JWT tokens
5. **Cascade Deletes:** Deleting a school cascades to maintain referential integrity

## Backward Compatibility

### Breaking Changes
- School table restructured (field names changed)
- User table extended (new required/optional fields)
- All existing data will need migration script

### Non-Breaking Additions
- New Experience and SchoolActivation tables
- New endpoints don't affect existing functionality
- Existing endpoints enhanced with new parameters

## Next Steps

1. **Create Migration:**
   ```bash
   npx prisma migrate dev --name initial_schema
   ```

2. **Test Endpoints:**
   - Register a user
   - Login to get token
   - Register a school
   - Verify access code generation

3. **Frontend Integration:**
   - Update registration form to include role, phone, language
   - Update school registration flow
   - Display access codes to users

4. **Production Deployment:**
   - Update environment variables
   - Run migrations on production database
   - Test all endpoints

## Sample Data

### Creating a Test User with School

```bash
# 1. Register user as teacher
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Teacher",
    "email": "john@school.com",
    "password": "Test123!",
    "phone": "+1234567890",
    "role": "TEACHER"
  }'

# 2. Login to get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@school.com",
    "password": "Test123!"
  }'

# 3. Register a school
curl -X POST http://localhost:3000/schools/register \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Central Elementary",
    "cityRegion": "New York, NY",
    "contactName": "John Teacher",
    "email": "central@school.edu",
    "phone": "+1555555555",
    "studentCount": 500
  }'
```

## Troubleshooting

### Common Issues

1. **"User already has a registered school"**
   - A user can only register one school
   - Solution: Delete the previous school or create a new user

2. **"Only admins can create schools"**
   - Non-admin users must use `/schools/register` endpoint
   - Solution: Use the correct endpoint for your role

3. **"School not found with this access code"**
   - Access code is incorrect or school wasn't registered
   - Solution: Verify the access code from login response

## Support

For questions or issues, refer to:
- API_SETUP.md - General API documentation
- Prisma Documentation - https://www.prisma.io/docs/
- NestJS Documentation - https://docs.nestjs.com/
