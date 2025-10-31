# Dashboard Quick Start Guide

## What's New? 🎉

The website now has a **complete dashboard system** for teachers, coordinators, and principals!

## Quick Overview

### ✅ What Was Added

1. **Dashboard Page** (`/dashboard`)
   - View school information
   - See analytics (teachers count, upcoming events, funds raised)
   - Manage school team
   - Access quick actions

2. **School Registration Page** (`/register-school`)
   - Easy form to register your school
   - Required and optional fields
   - Automatic access code generation

3. **Updated Navigation**
   - Dashboard link in header for authenticated users
   - Works on desktop and mobile

4. **Smart Redirects**
   - Not logged in? → Login page
   - Logged in but no school? → School registration
   - Logged in with school? → Dashboard

## How to Use

### For Teachers/Coordinators/Principals

1. **Sign Up**
   ```
   Go to: /register
   Select role: TEACHER, COORDINATOR, or PRINCIPAL
   Fill in your details and submit
   ```

2. **Login**
   ```
   Go to: /login
   Enter your credentials
   ```

3. **Register Your School**
   ```
   You'll be automatically redirected to /register-school
   Fill in:
   - School Name *
   - City/Region *
   - Contact Name * (pre-filled)
   - Optional: Email, Phone, Student Count
   Submit the form
   ```

4. **Access Dashboard**
   ```
   After registration, you'll see your dashboard!
   Or click "Dashboard" in the header anytime
   ```

### Dashboard Features You Can Use Now

✅ **View School Info**
- See all your school details
- Copy access codes with one click
- Share parent links via email

✅ **See Your Team**
- View all registered teachers
- See their roles with color badges

✅ **Quick Stats**
- Total teachers count
- Placeholder for future analytics

✅ **Quick Actions**
- Share parent link button (works now!)
- Create Experience (coming soon)
- Invite Teachers (coming soon)

## Running the Project

### Frontend (Website)
```bash
cd frontend/website
npm install
npm run dev
```
Website will run on: `http://localhost:5173`

### Backend (API)
```bash
cd backend/api
npm install
npm run start:dev
```
API will run on: `http://localhost:3000`

## Test It Out!

### Quick Test Steps

1. **Start both servers** (frontend + backend)

2. **Go to website**: `http://localhost:5173`

3. **Click "Login / Signup"** in the header

4. **Register a new user**:
   - Name: Test Teacher
   - Email: test@teacher.com
   - Password: Test123!
   - Role: TEACHER

5. **Login** with those credentials

6. **Register a school**:
   - School Name: Test Elementary
   - City: Test City, TC
   - Contact Name: (auto-filled)
   - Click "Register School"

7. **Boom! You're in the dashboard!** 🎉

## What Roles Can Access the Dashboard?

✅ **Can Access:**
- TEACHER
- COORDINATOR
- PRINCIPAL
- ADMIN

❌ **Cannot Access:**
- USER (regular users/parents)

## Files Modified/Created

### New Files
- `src/pages/Dashboard.jsx` - Main dashboard page
- `src/pages/RegisterSchool.jsx` - School registration form

### Modified Files
- `src/main.jsx` - Added new routes
- `src/pages/HomePage.jsx` - Added dashboard link in header

### Existing Files (Used)
- `src/contexts/AuthContext.jsx` - Authentication
- `src/lib/api.js` - API calls

## Common Questions

### Q: I don't see the Dashboard link?
**A:** Make sure you're logged in and your role is TEACHER, COORDINATOR, PRINCIPAL, or ADMIN

### Q: I'm redirected to school registration?
**A:** This is normal! You need to register your school first. Fill in the form and submit.

### Q: Can I register multiple schools?
**A:** No, each user can only register one school.

### Q: How do I invite other teachers?
**A:** Share your school access code with them (found in the dashboard). This feature will be enhanced soon!

### Q: Where are the analytics?
**A:** The dashboard shows teacher count now. Other analytics (funds raised, active experiences, events) will be populated as you use the platform!

## Future Features 🚀

Coming soon to the dashboard:
- ✨ Create food kit experiences
- ✨ Invite teachers via email
- ✨ Real-time fundraising analytics
- ✨ Event calendar and scheduling
- ✨ Parent portal access
- ✨ Generate QR codes
- ✨ Detailed reports

## Need Help?

Check these files for more details:
- `DASHBOARD_FEATURE.md` - Complete technical documentation
- Backend API: `backend/api/DATABASE_SCHEMA.md` - Database schema
- Backend API: `backend/api/README.md` - API documentation

## Summary

You now have a fully functional dashboard system! Teachers, coordinators, and principals can:
1. ✅ Register their schools
2. ✅ View school information and team
3. ✅ Access analytics (more coming soon!)
4. ✅ Share parent links
5. ✅ Manage their profile

The foundation is set for future features like experience creation, fundraising tracking, and much more!

---

**Enjoy your new dashboard!** 🌱

