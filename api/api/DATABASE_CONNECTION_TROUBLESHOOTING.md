# 🔧 Database Connection Troubleshooting

## ❌ Error: Can't Reach Database Server

You're getting:
```
Error: P1001
Can't reach database server at `aws-1-us-east-1.pooler.supabase.com:5432`
```

This means Prisma cannot connect to your Supabase database. Here's how to fix it:

---

## ✅ Step 1: Check if Supabase Project is ACTIVE (Most Common Issue!)

### Is Your Project Paused?

1. Go to: https://app.supabase.com
2. Look at your project
3. **If you see a "Resume Project" button** - Your project is PAUSED ⏸️
4. **Click "Resume Project"** to activate it

⚠️ **Supabase pauses projects after 7 days of inactivity on the free tier!**

---

## ✅ Step 2: Verify Your Credentials Are Correct

### Method A: Check Supabase Console

1. Go to: https://app.supabase.com
2. Click on your project
3. Go to **Settings** → **Database**
4. Look for:
   - **Host**: Should contain `aws-1-us-east-1`
   - **Port**: Should show `5432` (and `6543` for pooling)
   - **Database**: Should be `postgres`
   - **User**: Should be `postgres.yorotjehnjscerexjtrb`
   - **Password**: Click "Reveal" to see it

### Your Current Credentials

**Project ID**: `postgres.yorotjehnjscerexjtrb`  
**Password**: `123456`  
**Region**: `aws-1-us-east-1`

**❓ Does this match what you see in Supabase Console?**

If NOT, update your `.env` file with the correct values.

---

## ✅ Step 3: Test with a Simple Connection

Try connecting with psql if you have PostgreSQL installed:

```bash
# Replace with your actual values
psql "postgresql://postgres.yorotjehnjscerexjtrb:123456@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

If this works, your connection is good. If not, see Step 4.

---

## ✅ Step 4: Check for Network/Firewall Issues

### Is Your Internet Working?

```bash
# Test internet connection
ping google.com
```

### Is the Supabase Server Reachable?

```bash
# Test Supabase host
Test-NetConnection -ComputerName aws-1-us-east-1.pooler.supabase.com -Port 5432
```

**What to look for:**
- If it says `TcpTestSucceeded : True` - Good! ✅
- If it says `TcpTestSucceeded : False` - Firewall blocked it ❌

### If Blocked by Firewall

- Try connecting from a different network (mobile hotspot, different WiFi)
- Check if your company/ISP blocks port 5432
- Supabase usually whitelist IPs automatically, but there might be delays

---

## ✅ Step 5: Verify Password Reset

If you're not sure about the password:

### Reset in Supabase

1. Go to: https://app.supabase.com
2. Click your project
3. Go to **Settings** → **Database**
4. Click **"Reset Password"**
5. Copy the new password
6. Update your `.env` file:

```env
DATABASE_URL="postgresql://postgres.yorotjehnjscerexjtrb:NEW_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.yorotjehnjscerexjtrb:NEW_PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

---

## ✅ Step 6: Check Your .env File

Make sure your `.env` file has BOTH connection strings:

```bash
# Check what's in .env
type .env
```

Should output:
```
DATABASE_URL="postgresql://postgres.yorotjehnjscerexjtrb:123456@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.yorotjehnjscerexjtrb:123456@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
PORT=3001
NODE_ENV=development
```

---

## ✅ Step 7: Try These Fixes in Order

### Fix 1: Clear Prisma Cache

```bash
cd api/api
rm -r node_modules/.prisma
npm run prisma:generate
```

### Fix 2: Retry the Migration

```bash
npm run prisma:migrate
```

### Fix 3: Test Connection First

```bash
# This won't modify anything, just tests
npx prisma db execute --stdin
```

Type `SELECT 1;` and press Enter. If it returns `1`, connection works!

### Fix 4: Use Connection Pooling First

Try using DATABASE_URL (port 6543) instead of DIRECT_URL:

```bash
# Update DIRECT_URL to use DATABASE_URL temporarily
npx prisma migrate deploy
```

---

## 🆘 Common Scenarios

### Scenario 1: "Supabase project is paused"

**Solution:**
1. Go to https://app.supabase.com
2. Click your project name
3. Click "Resume" button
4. Wait 30 seconds
5. Try migration again

### Scenario 2: "Password is wrong"

**Solution:**
1. Go to Supabase Console
2. Settings → Database
3. Click "Reset password"
4. Copy new password
5. Update `.env`
6. Try again

### Scenario 3: "Network/Firewall issue"

**Solution:**
1. Try from different WiFi/network
2. Check with IT if on corporate network
3. Contact Supabase support if persistent

### Scenario 4: "Project doesn't exist"

**Solution:**
1. Go to https://supabase.com
2. Create new project
3. Get credentials
4. Update `.env`
5. Try migration

---

## 📋 Verification Checklist

Before trying migration again, verify:

- [ ] Supabase project is ACTIVE (not paused)
- [ ] Project ID is correct: `postgres.yorotjehnjscerexjtrb`
- [ ] Password is correct: `123456` (or whatever you set)
- [ ] `.env` file has both `DATABASE_URL` and `DIRECT_URL`
- [ ] Connection string format is correct
- [ ] You can reach Supabase website (https://app.supabase.com)
- [ ] Internet connection is working

---

## 🔄 Try This Now

```bash
# 1. Go to api/api folder
cd "C:\Users\OleksiyTolkunov\Documents\DEV\freelance\taste_and_grow\api\api"

# 2. Clear Prisma cache
rm -r node_modules/.prisma

# 3. Regenerate client
npm run prisma:generate

# 4. Try migration again
npm run prisma:migrate
```

---

## 📞 Still Not Working?

1. **Check Supabase Status**: https://status.supabase.com
2. **Check Your Project**: https://app.supabase.com
3. **Contact Supabase Support**: support@supabase.com
4. **Check Network**: Are you connected to internet?

---

## ⚡ Quick Commands

```bash
# Test Supabase connection
psql "postgresql://postgres.yorotjehnjscerexjtrb:123456@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Check .env file
type .env

# Clear Prisma
rm -r node_modules/.prisma

# Regenerate
npm run prisma:generate

# Migrate
npm run prisma:migrate
```

---

**Most Common Fix**: Resume your Supabase project if it's paused! ⏸️ → ▶️
