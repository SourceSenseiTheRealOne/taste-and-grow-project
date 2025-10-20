# JWT User ID Fix - 500 Error Resolution

## Problem

When trying to update or delete users/schools from the admin dashboard, a **500 Internal Server Error** occurred:

```
PATCH http://localhost:3000/auth/users/c2e93331-11b9-459c-b3ea-00e75a3dc037 500 (Internal Server Error)
```

## Root Cause

The controllers were accessing `req.user.sub` to get the user ID, but the JWT strategy's `validate()` method returns a user object with `id`, not `sub`.

### The Issue in Detail

**JWT Strategy (jwt.strategy.ts):**
```typescript
async validate(payload: any) {
  const user = await this.authService.validateUser(payload.sub);
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;  // Returns user object from validateUser
}
```

**ValidateUser Method (auth.service.ts):**
```typescript
async validateUser(userId: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
  return {
    id: user.id,           // ✅ Returns 'id'
    email: user.email,
    name: user.name,
    role: user.role,
    // ... other fields
    // ❌ NO 'sub' property!
  };
}
```

**Controllers Were Using (WRONG):**
```typescript
@UseGuards(JwtAuthGuard)
@Patch('users/:id')
async updateUser(@Request() req, @Param('id') id: string, @Body() updateDto) {
  return this.authService.updateUser(req.user.sub, id, updateDto);
  //                                   ^^^^^^^^^^^
  //                                   UNDEFINED!
}
```

When `req.user.sub` was undefined, it caused the service methods to fail with 500 errors.

## Solution

Changed all occurrences of `req.user.sub` to `req.user.id` in the controllers.

### Files Modified

#### 1. `src/auth/auth.controller.ts`

**Before:**
```typescript
@UseGuards(JwtAuthGuard)
@Patch('users/:id')
async updateUser(@Request() req, @Param('id') id: string, @Body() updateDto) {
  return this.authService.updateUser(req.user.sub, id, updateDto);
}

@UseGuards(JwtAuthGuard)
@Delete('users/:id')
async deleteUser(@Request() req, @Param('id') id: string) {
  return this.authService.deleteUser(req.user.sub, id);
}
```

**After:**
```typescript
@UseGuards(JwtAuthGuard)
@Patch('users/:id')
async updateUser(@Request() req, @Param('id') id: string, @Body() updateDto) {
  return this.authService.updateUser(req.user.id, id, updateDto);
}

@UseGuards(JwtAuthGuard)
@Delete('users/:id')
async deleteUser(@Request() req, @Param('id') id: string) {
  return this.authService.deleteUser(req.user.id, id);
}
```

#### 2. `src/school/school.controller.ts`

**Before:**
```typescript
@UseGuards(JwtAuthGuard)
@Post('register')
registerSchool(@Request() req, @Body() registerSchoolDto) {
  return this.schoolService.registerSchool(req.user.sub, registerSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Post()
create(@Request() req, @Body() createSchoolDto) {
  return this.schoolService.create(req.user.sub, createSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(@Request() req, @Param('id') id: string, @Body() updateSchoolDto) {
  return this.schoolService.update(req.user.sub, id, updateSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(@Request() req, @Param('id') id: string) {
  return this.schoolService.remove(req.user.sub, id);
}
```

**After:**
```typescript
@UseGuards(JwtAuthGuard)
@Post('register')
registerSchool(@Request() req, @Body() registerSchoolDto) {
  return this.schoolService.registerSchool(req.user.id, registerSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Post()
create(@Request() req, @Body() createSchoolDto) {
  return this.schoolService.create(req.user.id, createSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(@Request() req, @Param('id') id: string, @Body() updateSchoolDto) {
  return this.schoolService.update(req.user.id, id, updateSchoolDto);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(@Request() req, @Param('id') id: string) {
  return this.schoolService.remove(req.user.id, id);
}
```

## What Now Works

### ✅ User Management (Admin Dashboard)
- Update user information ✓
- Delete users ✓
- All operations properly identify the requesting admin

### ✅ School Management (Admin Dashboard)
- Register schools ✓
- Create schools (admin) ✓
- Update school information ✓
- Delete schools ✓
- All operations properly identify the requesting admin

### ✅ Authorization Checks
- Admin-only operations now work correctly ✓
- User identity properly passed to service methods ✓
- Proper error messages for unauthorized attempts ✓

## Technical Details

### JWT Authentication Flow

```
1. User logs in
   ↓
2. JWT token generated with payload: { sub: userId, email: userEmail }
   ↓
3. Client sends request with token in Authorization header
   ↓
4. JwtAuthGuard validates token
   ↓
5. JwtStrategy.validate() is called with decoded payload
   ↓
6. validate() calls authService.validateUser(payload.sub)
   ↓
7. validateUser() returns user object with 'id' property
   ↓
8. User object attached to request as req.user
   ↓
9. Controller can access req.user.id (NOT req.user.sub)
```

### Request Object Structure After Authentication

```typescript
req.user = {
  id: "c2e93331-11b9-459c-b3ea-00e75a3dc037",  // ✅ Available
  email: "admin@example.com",
  name: "Admin User",
  role: "ADMIN",
  phone: "+1234567890",
  preferredLanguage: "en",
  schoolId: null,
  schoolAccessCode: null,
  parentsLink: null
}

// req.user.sub = undefined  ❌ Not available
```

## Testing

### Test User Update
1. Login to dashboard as admin
2. Go to Users page
3. Click edit on any user
4. Update name/email/role
5. Click "Update"
6. ✅ Should succeed with 200 OK

### Test User Delete
1. Go to Users page
2. Click delete on a user
3. Confirm deletion
4. ✅ Should succeed with 200 OK

### Test School Update
1. Go to Schools page
2. Click edit on a school
3. Update information
4. Click "Update"
5. ✅ Should succeed with 200 OK

### Test School Delete
1. Go to Schools page
2. Click delete on a school
3. Confirm deletion
4. ✅ Should succeed with 200 OK

### Test Authorization
1. Try updating a user as a non-admin (if implemented)
2. ✅ Should get "Only admins can update users" error

## Affected Endpoints

| Endpoint | Method | What Was Fixed |
|----------|--------|----------------|
| `/auth/users/:id` | PATCH | req.user.sub → req.user.id |
| `/auth/users/:id` | DELETE | req.user.sub → req.user.id |
| `/schools/register` | POST | req.user.sub → req.user.id |
| `/schools` | POST | req.user.sub → req.user.id |
| `/schools/:id` | PATCH | req.user.sub → req.user.id |
| `/schools/:id` | DELETE | req.user.sub → req.user.id |

## Prevention

To prevent this issue in the future:

### 1. Use TypeScript Interfaces
```typescript
// Create an interface for the authenticated user
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  // ... other fields
}

// Use in controllers
@UseGuards(JwtAuthGuard)
@Patch('users/:id')
async updateUser(
  @Request() req: { user: AuthenticatedUser },
  @Param('id') id: string,
  @Body() updateDto: any
) {
  return this.authService.updateUser(req.user.id, id, updateDto);
  //                                   ^^^^^^^^^^^
  //                                   TypeScript will validate this!
}
```

### 2. Create Custom Decorator
```typescript
// Create a custom decorator to extract user ID
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);

// Use in controllers
@UseGuards(JwtAuthGuard)
@Patch('users/:id')
async updateUser(
  @CurrentUserId() currentUserId: string,  // Clean and type-safe!
  @Param('id') id: string,
  @Body() updateDto: any
) {
  return this.authService.updateUser(currentUserId, id, updateDto);
}
```

### 3. Add Validation in JWT Strategy
```typescript
async validate(payload: any) {
  const user = await this.authService.validateUser(payload.sub);
  if (!user) {
    throw new UnauthorizedException();
  }
  
  // Add validation to ensure 'id' exists
  if (!user.id) {
    throw new UnauthorizedException('User ID is missing');
  }
  
  return user;
}
```

## Summary

**Problem**: Controllers accessing `req.user.sub` which was undefined

**Cause**: JWT strategy returns user object with `id` property, not `sub`

**Solution**: Changed all `req.user.sub` to `req.user.id` in controllers

**Impact**: Fixed 500 errors for all update/delete operations in admin dashboard

**Files Changed**:
- ✅ `src/auth/auth.controller.ts` (2 endpoints)
- ✅ `src/school/school.controller.ts` (4 endpoints)

**Status**: ✅ Fixed and ready for testing

---

**Note**: Restart your API server after these changes:
```bash
cd backend/api
npm run start:dev
```

Then test the update/delete operations in the dashboard - they should now work perfectly! ✨

