# Teachers and Schools Implementation Summary

This document summarizes the implementation of the Teachers and Schools features for the Taste & Grow project.

## Backend (API) Changes

### Database Schema (Prisma)

Added two new models to `api/prisma/schema.prisma`:

1. **School Model**
   - Fields: id, name, address, city, country, phone, email, timestamps
   - Has many teachers (one-to-many relationship)

2. **Teacher Model**
   - Fields: id, name, email, password, schoolId, timestamps
   - Belongs to one school (many-to-one relationship)
   - Has unique email constraint

### API Endpoints

#### School Endpoints (`/schools`)
- `POST /schools` - Create a new school
- `GET /schools` - Get all schools with their teachers
- `GET /schools/:id` - Get a specific school
- `PATCH /schools/:id` - Update a school
- `DELETE /schools/:id` - Delete a school

#### Teacher Endpoints (`/teachers`)
- `POST /teachers/register` - Register a new teacher (returns JWT token)
- `POST /teachers/login` - Login as a teacher (returns JWT token)
- `POST /teachers` - Create a new teacher
- `GET /teachers` - Get all teachers with their schools
- `GET /teachers/:id` - Get a specific teacher
- `PATCH /teachers/:id` - Update a teacher
- `DELETE /teachers/:id` - Delete a teacher

### Modules Created

1. **School Module** (`api/src/school/`)
   - `school.module.ts` - Module definition
   - `school.controller.ts` - REST API controller
   - `school.service.ts` - Business logic
   - `dto/create-school.dto.ts` - Create validation
   - `dto/update-school.dto.ts` - Update validation

2. **Teacher Module** (`api/src/teacher/`)
   - `teacher.module.ts` - Module definition with JWT
   - `teacher.controller.ts` - REST API controller
   - `teacher.service.ts` - Business logic with authentication
   - `dto/create-teacher.dto.ts` - Create validation
   - `dto/update-teacher.dto.ts` - Update validation
   - `dto/teacher-login.dto.ts` - Login validation

### Security Features

- Password hashing using bcrypt (for teacher login/register endpoints)
- Passwords never returned in API responses
- Email uniqueness validation
- School relationship validation
- Open API endpoints for CMS operations (no authentication required for internal use)

## Frontend (Dashboard) Changes

### New Pages

1. **Schools Page** (`dashboard/src/pages/Schools.tsx`)
   - Table view of all schools
   - Create new school dialog
   - Edit school dialog
   - Delete school confirmation
   - Shows number of teachers per school
   - Displays: name, city, country, email, phone

2. **Teachers Page** (`dashboard/src/pages/Teachers.tsx`)
   - Table view of all teachers
   - Create new teacher dialog with school selection
   - Edit teacher dialog
   - Delete teacher confirmation
   - Password field (optional when editing)
   - Displays: name, email, school

### Navigation

Updated `dashboard/src/components/AppSidebar.tsx`:
- Added "Teachers" menu item with GraduationCap icon
- Added "Schools" menu item with School icon
- Both placed between "Reward Cards" and "Settings"

Updated `dashboard/src/App.tsx`:
- Added `/teachers` route
- Added `/schools` route

### UI Features

- Responsive tables with shadcn/ui components
- Modal dialogs for create/edit operations
- Confirmation dialogs for delete operations
- Toast notifications for success/error messages
- Form validation
- Loading states
- Empty states when no data exists

## Database Migration

A new migration was created and applied:
- `api/prisma/migrations/20251018145551_add_school_and_teacher_models/migration.sql`

## Relationships

- **One School → Many Teachers**: One school can have multiple teachers
- **Many Teachers → One School**: Each teacher belongs to exactly one school
- **Cascade Delete**: When a school is deleted, all associated teachers are also deleted

## API Base URL

The frontend is configured to make API requests to:
- `http://localhost:3000`

Make sure the API is running on this port, or update the API URL in:
- `dashboard/src/pages/Schools.tsx`
- `dashboard/src/pages/Teachers.tsx`

## Dashboard Access

The dashboard is designed as an internal CMS tool with direct API access. No authentication is required to view and manage schools and teachers through the dashboard.

## Getting Started

### Backend
```bash
cd api
npm install
npx prisma migrate deploy  # Apply migrations in production
npm run start:dev          # Start development server
```

### Frontend
```bash
cd dashboard
npm install
npm run dev                # Start development server
```

## Testing the Features

1. Start both the API and dashboard
2. Open the dashboard in your browser (usually http://localhost:5173)
3. Navigate to "Schools" to view, create, edit, and delete schools
4. Navigate to "Teachers" to view, create, edit, and delete teachers
5. Create at least one school before creating teachers (teachers must be assigned to a school)
6. Teachers can also register independently via the `/teachers/register` endpoint

## Notes

- Teachers must be associated with a valid school
- Email addresses must be unique for teachers
- Passwords must be at least 6 characters long (used for teacher login/register endpoints)
- All teacher passwords are securely hashed using bcrypt
- The dashboard operates as an internal CMS tool without authentication
- The teacher authentication system (login/register) is separate and can be used for future features

