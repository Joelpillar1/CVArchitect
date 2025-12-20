# Fix Sign-Up & Sign-In Issues

## Problem
Users cannot sign up - getting 500 Internal Server Error from Supabase.

## Root Cause
The database tables and triggers are not properly set up in your Supabase database.

---

## Solution: Set Up Database Schema

### Step 1: Go to Supabase Dashboard

1. Visit: https://app.supabase.com/
2. Sign in to your account
3. Select your CV Architect project

---

### Step 2: Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click **+ New Query** button

---

### Step 3: Run the Schema

1. Open the file: `c:\Users\dhonl\Downloads\cv-architect\supabase\schema.sql`
2. Copy **ALL** the content (Ctrl+A, then Ctrl+C)
3. Paste it into the SQL Editor in Supabase
4. Click **Run** (or press Ctrl+Enter)

---

### Step 4: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `resumes`

3. Click on `profiles` table
4. You should see columns:
   - `id` (uuid)
   - `updated_at` (timestamp)
   - `full_name` (text)
   - `avatar_url` (text)
   - `website` (text)

---

### Step 5: Verify the Trigger

1. In Supabase Dashboard, go to **Database** → **Triggers**
2. You should see:
   - ✅ Trigger name: `on_auth_user_created`
   - ✅ Table: `auth.users`
   - ✅ Function: `handle_new_user()`

---

### Step 6: Test Sign-Up

1. Go to your app: http://localhost:5173
2. Click **Get Started** → **Sign up**
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - ✅ Check "I agree to Terms..."
4. Click **Create Account**

**Expected Result:**
- ✅ Success message: "Account created! Please check your email..."
- ✅ User appears in Supabase Dashboard → Authentication → Users
- ✅ Profile created in `profiles` table

---

## Troubleshooting

### Error: "relation 'profiles' already exists"

This is okay! It means the table already exists. The schema uses `create table if not exists` so it won't fail.

### Error: "trigger 'on_auth_user_created' already exists"

The updated schema drops existing triggers before creating new ones, so this shouldn't happen. If it does:

1. Go to **Database** → **Triggers**
2. Find `on_auth_user_created`
3. Click **Delete**
4. Run the schema again

### Error: "permission denied for schema auth"

You need to be the database owner. Make sure you're logged in as the project owner in Supabase Dashboard.

### Sign-up still fails after running schema

1. **Check Supabase Logs:**
   - Dashboard → **Logs** → **Postgres Logs**
   - Look for errors related to the trigger

2. **Disable Email Confirmation (for testing):**
   - Dashboard → **Authentication** → **Settings**
   - Scroll to **Email Auth**
   - Toggle OFF: "Enable email confirmations"
   - Try signing up again

3. **Check Auth Settings:**
   - Dashboard → **Authentication** → **Settings**
   - Make sure **Email** provider is enabled
   - Check **Site URL** is set to `http://localhost:5173`

---

## Google Sign-In Setup

If Google sign-in isn't working:

### Step 1: Enable Google Provider

1. Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click **Enable**

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   ```
   https://nykhslfkeipvnhidmbzg.supabase.co/auth/v1/callback
   ```
7. Copy **Client ID** and **Client Secret**

### Step 3: Add to Supabase

1. Back in Supabase → **Authentication** → **Providers** → **Google**
2. Paste:
   - **Client ID**
   - **Client Secret**
3. Click **Save**

### Step 4: Test Google Sign-In

1. Go to your app
2. Click **Sign up with Google**
3. Should redirect to Google login
4. After login, redirects back to your app ✅

---

## Verification Checklist

After running the schema, verify:

- [ ] `profiles` table exists
- [ ] `resumes` table exists
- [ ] `on_auth_user_created` trigger exists
- [ ] Can sign up with email
- [ ] User appears in Authentication → Users
- [ ] Profile created in `profiles` table
- [ ] Can sign in after sign-up
- [ ] Session persists on page reload

---

## Next Steps

After fixing sign-up:

1. Test creating a resume
2. Test saving a resume
3. Test AI features
4. Deploy to production

---

## Support

If you still have issues:

1. Check Supabase **Logs** for detailed errors
2. Verify all tables have RLS policies enabled
3. Make sure you're using the correct Supabase URL and anon key in `.env`
4. Try signing up with a different email address
