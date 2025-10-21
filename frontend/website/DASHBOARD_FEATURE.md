# Dashboard Feature Documentation

## Overview

The Taste & Grow website now includes a comprehensive dashboard system for teachers, coordinators, principals, and administrators. This feature allows authenticated users to manage their schools, view analytics, and access important information.

## Features Added

### 1. **Dashboard Page** (`/dashboard`)
A full-featured dashboard that displays:

#### School Information Card
- School name and location
- Contact details (name, email, phone)
- Student count
- School registration date
- Unique school code
- School access code (shareable with teachers)
- Parent link (shareable with parents)

#### Analytics Cards
- **Total Teachers**: Number of registered teachers at the school
- **Active Experiences**: Count of active food kit experiences (coming soon)
- **Funds Raised**: Total fundraising amount (coming soon)
- **Upcoming Events**: Number of scheduled activities (coming soon)

#### School Team Section
- List of all teachers and staff registered at the school
- Display of each team member's role with color-coded badges
- User avatars with initials

#### Quick Actions
- Create Experience (coming soon)
- Invite Teachers (coming soon)
- Share Parent Link (functional - opens email client)

### 2. **School Registration Page** (`/register-school`)
A dedicated page for users to register their school with:

#### Required Fields
- School Name
- City/Region
- Contact Name (pre-filled with user's name)

#### Optional Fields
- School Email
- School Phone
- Number of Students

#### Features
- Clean, user-friendly form interface
- Success confirmation with auto-redirect
- Information cards explaining benefits
- Validation and error handling

### 3. **Updated Navigation**

#### Header Changes
- Dashboard link appears for authenticated users with roles: TEACHER, COORDINATOR, PRINCIPAL, or ADMIN
- Available in both desktop and mobile navigation
- Seamless integration with existing navigation

### 4. **Protected Routes**
Automatic redirects based on user state:
- Unauthenticated users → `/login`
- Authenticated users without school → `/register-school`
- Authenticated users with school → `/dashboard`

## User Flow

### For New Users (Teachers/Coordinators/Principals)
1. Sign up at `/register` with role selection
2. Login at `/login`
3. Automatically redirected to `/register-school`
4. Fill in school information
5. Success! Redirected to `/dashboard`
6. Access dashboard anytime from homepage header

### For Existing Users
1. Login at `/login`
2. If school already registered → goes to `/dashboard`
3. If no school → redirected to `/register-school`

### For Regular Users/Parents
- No dashboard access
- Standard website experience remains unchanged

## API Integration

### Endpoints Used

#### School Registration
```javascript
POST /schools/register
Headers: Authorization: Bearer {token}
Body: {
  schoolName: string,
  cityRegion: string,
  contactName: string,
  email?: string,
  phone?: string,
  studentCount?: number
}
```

#### Get School Details
```javascript
GET /schools/{schoolId}
Response: {
  id: string,
  schoolName: string,
  cityRegion: string,
  contactName: string,
  email?: string,
  phone?: string,
  studentCount?: number,
  schoolCode: string,
  users: Array<User>,
  teachers: Array<Teacher>,
  createdAt: string
}
```

## Role-Based Access

### Roles with Dashboard Access
- **TEACHER**: Can register school and view dashboard
- **COORDINATOR**: Can register school and view dashboard
- **PRINCIPAL**: Can register school and view dashboard
- **ADMIN**: Full access to all features

### Roles without Dashboard Access
- **USER**: Standard users (parents) - no dashboard access

## Styling & Design

### Color Scheme
- **Green (#16a34a)**: Primary actions, school branding
- **Blue (#2563eb)**: Teachers, team members
- **Amber (#d97706)**: Premium features
- **Purple (#9333ea)**: Administrative functions
- **Red (#dc2626)**: Logout, destructive actions

### Components Used
All components from `shadcn/ui`:
- Card, CardHeader, CardContent, CardTitle, CardDescription
- Button
- Avatar, AvatarFallback
- Badge
- Alert, AlertDescription
- DropdownMenu
- Separator
- Input, Label

### Icons (lucide-react)
- Sprout, School, Users, TrendingUp
- Building2, Mail, Phone, MapPin
- QrCode, LinkIcon, BookOpen
- DollarSign, Calendar
- LogOut, User, Menu, X
- Loader2, CheckCircle2, AlertCircle

## File Structure

```
frontend/website/src/
├── pages/
│   ├── Dashboard.jsx          # Main dashboard page
│   ├── RegisterSchool.jsx     # School registration form
│   ├── HomePage.jsx           # Updated with dashboard link
│   ├── Login.jsx              # Existing login page
│   └── Register.jsx           # Existing user registration
├── contexts/
│   └── AuthContext.jsx        # Authentication context (existing)
├── lib/
│   └── api.js                 # API client (existing)
└── main.jsx                   # Updated with new routes
```

## Security Features

### Authentication Guards
- All dashboard routes check for authentication
- Automatic redirect to login if not authenticated
- Token-based API authentication

### Authorization
- Role-based access control
- Dashboard only visible to specific roles
- API endpoints protected with JWT

### Data Privacy
- School access codes are unique and cryptographically generated
- Parent links are encoded and secure
- Clipboard copy for sharing sensitive information

## Future Enhancements (Coming Soon)

### Planned Features
1. **Create Experiences**: Teachers can create food kit experiences
2. **Invite Teachers**: System to invite other teachers to the school
3. **Active Experiences**: View and manage ongoing food kit programs
4. **Fundraising Analytics**: Real-time tracking of funds raised
5. **Event Calendar**: Schedule and manage school events
6. **Parent Portal**: Separate dashboard for parents
7. **QR Code Generation**: Generate scannable codes for events
8. **Reports & Analytics**: Detailed insights and reports

## Testing the Dashboard

### Test User Creation
```javascript
// 1. Register a new user with teacher role
POST /auth/register
{
  "name": "Test Teacher",
  "email": "teacher@test.com",
  "password": "Test123!",
  "role": "TEACHER"
}

// 2. Login
POST /auth/login
{
  "email": "teacher@test.com",
  "password": "Test123!"
}

// 3. Register school (from UI or API)
POST /schools/register
{
  "schoolName": "Test Elementary",
  "cityRegion": "Test City, TC",
  "contactName": "Test Teacher",
  "studentCount": 100
}
```

### Navigation Flow
1. Go to website: `http://localhost:5173`
2. Click "Login / Signup" → Register
3. Select "Teacher" role
4. Login with credentials
5. You'll be redirected to `/register-school`
6. Fill in school details
7. Submit form
8. Redirected to `/dashboard`
9. Explore dashboard features

## Environment Variables

No additional environment variables needed. The dashboard uses the existing API configuration:

```env
VITE_API_URL=http://localhost:3000
```

## Dependencies

All dependencies are already included in the project:
- `react-router-dom` - Routing
- `lucide-react` - Icons
- `@radix-ui/*` - UI components (shadcn/ui)
- `tailwindcss` - Styling

## Troubleshooting

### Dashboard not showing
- Verify user role is TEACHER, COORDINATOR, PRINCIPAL, or ADMIN
- Check that user is authenticated (token in localStorage)
- Ensure backend is running on correct port

### School registration failing
- Check backend API is accessible
- Verify JWT token is valid
- Check console for error messages
- Ensure all required fields are filled

### Can't see school information
- Verify user has `schoolId` in their user object
- Check API response in network tab
- Ensure school exists in database

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend logs
3. Review API responses in Network tab
4. Check authentication state in localStorage

## Summary

The dashboard system provides a complete solution for school management within the Taste & Grow platform. It seamlessly integrates with the existing authentication system and provides a foundation for future features like experience creation, event management, and detailed analytics.

