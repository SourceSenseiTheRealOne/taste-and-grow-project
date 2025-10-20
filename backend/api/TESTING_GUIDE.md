# Testing Guide - Admin Dashboard CRUD Operations

## Quick Test: Verify the 500 Error is Fixed

### Step 1: Restart the API Server
```bash
cd backend/api
# Stop the current server (Ctrl+C)
npm run start:dev
```

Wait for the server to fully start. You should see:
```
🚀 Application is running on: http://localhost:3000
```

### Step 2: Keep Dashboard Running
```bash
# In another terminal
cd backend/dashboard
npm run dev
```

### Step 3: Test User Update (Main Fix)

1. **Login** to dashboard at `http://localhost:5173/login`
   - Use your admin credentials

2. **Go to Users** page (click "Users" in sidebar)

3. **Edit a User**
   - Click the pencil icon on any user
   - Change the name (e.g., add "Updated" to the end)
   - Click "Update"

4. **Expected Result**: ✅
   - Success toast notification appears
   - Table refreshes with updated data
   - **No 500 error in browser console**

5. **Check Browser Console** (F12)
   - Should show: `PATCH http://localhost:3000/auth/users/... 200 (OK)`
   - NOT: ~~`500 (Internal Server Error)`~~

### Step 4: Test Other Operations

#### Test User Delete
1. Go to Users page
2. Click trash icon on a test user
3. Confirm deletion
4. ✅ Should succeed without errors

#### Test School Update
1. Go to Schools page
2. Click edit on a school
3. Change any field (e.g., phone number)
4. Click "Update"
5. ✅ Should succeed without errors

#### Test School Delete
1. Go to Schools page
2. Click delete on a test school
3. Confirm deletion
4. ✅ Should succeed without errors

## What Changed

**API Files Modified:**
- `backend/api/src/auth/auth.controller.ts`
- `backend/api/src/school/school.controller.ts`

**Change Made:**
- Changed `req.user.sub` → `req.user.id` (6 occurrences)

**Why:**
- JWT strategy returns user object with `id`, not `sub`
- Controllers were accessing undefined property
- Caused 500 errors in update/delete operations

## Troubleshooting

### Still Getting 500 Error?

**Check 1: API Server Restarted?**
```bash
# Make sure you restarted after the code changes
cd backend/api
npm run start:dev
```

**Check 2: Check API Server Logs**
Look for error messages in the terminal where the API is running.

**Check 3: Verify File Changes**
```bash
cd backend/api
grep "req.user.id" src/auth/auth.controller.ts
grep "req.user.id" src/school/school.controller.ts
```

Should show multiple matches with `req.user.id` (not `req.user.sub`)

### Getting Different Error?

**401 Unauthorized**
- Token expired or missing
- Solution: Logout and login again

**403 Forbidden**
- User doesn't have ADMIN role
- Solution: Update user role in database to ADMIN

**404 Not Found**
- User/School ID doesn't exist
- Solution: Verify the ID exists in database

## Success Indicators

### Browser Console
```
✅ PATCH http://localhost:3000/auth/users/[id] 200 (OK)
✅ DELETE http://localhost:3000/auth/users/[id] 200 (OK)
✅ PATCH http://localhost:3000/schools/[id] 200 (OK)
✅ DELETE http://localhost:3000/schools/[id] 200 (OK)
```

### Dashboard UI
- ✅ Success toast notifications
- ✅ Tables refresh with updated data
- ✅ No error messages
- ✅ Smooth user experience

### API Server Logs
No error messages, just normal request logs:
```
✅ [Nest] 12345  - 10/20/2025, 10:30:45 AM     LOG [RouterExplorer] Mapped {/auth/users/:id, PATCH} route
```

## Complete Test Checklist

- [ ] API server restarted
- [ ] Dashboard running
- [ ] Can login as admin
- [ ] Can update user successfully
- [ ] Can delete user successfully
- [ ] Can update school successfully
- [ ] Can delete school successfully
- [ ] Browser console shows 200 OK (not 500)
- [ ] No errors in API server logs
- [ ] Success toast notifications appear

## Expected Results Summary

| Operation | Endpoint | Previous | Now |
|-----------|----------|----------|-----|
| Update User | PATCH /auth/users/:id | ❌ 500 Error | ✅ 200 OK |
| Delete User | DELETE /auth/users/:id | ❌ 500 Error | ✅ 200 OK |
| Update School | PATCH /schools/:id | ❌ 500 Error | ✅ 200 OK |
| Delete School | DELETE /schools/:id | ❌ 500 Error | ✅ 200 OK |
| Register School | POST /schools/register | ❌ 500 Error | ✅ 200 OK |
| Create School | POST /schools | ❌ 500 Error | ✅ 200 OK |

---

If all tests pass: **🎉 The fix is working correctly!**

If any test fails: Check the [JWT_USER_ID_FIX.md](./JWT_USER_ID_FIX.md) for detailed troubleshooting.

