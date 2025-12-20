# Fresh Supabase Setup Guide

## ✅ Step 1: Create New Supabase Project

1. Go to https://app.supabase.com/
2. Click **"New project"**
3. Fill in:
   - **Name:** CV Architect
   - **Database Password:** (create a strong password and SAVE IT!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for project to be ready

---

## ✅ Step 2: Get Your Credentials

1. Once project is ready, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## ✅ Step 3: Update .env File

1. Open `.env` file in your project root
2. Update with your NEW credentials:

```env
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-key-here
```

3. Save the file

---

## ✅ Step 4: Run Database Schema

1. In Supabase Dashboard, click **SQL Editor**
2. Click **"New query"**
3. Open file: `supabase/schema.sql`
4. Copy ALL content (Ctrl+A, Ctrl+C)
5. Paste into SQL Editor
6. Click **RUN** (or Ctrl+Enter)
7. Should see: "Success. No rows returned"

---

## ✅ Step 5: Verify Tables Created

1. Click **Table Editor** in Supabase
2. You should see:
   - ✅ `profiles`
   - ✅ `resumes`

---

## ✅ Step 6: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. **Email Auth** section:
   - Toggle **OFF**: "Enable email confirmations" (for testing)
3. **Site URL:**
   - Set to: `http://localhost:5173`
4. **Redirect URLs:**
   - Add: `http://localhost:5173/**`
5. Click **Save**

---

## ✅ Step 7: Test Signup

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Go to http://localhost:5173
4. Click "Get Started" → "Sign up"
5. Fill in the form and submit
6. Should work! ✅

---

## ✅ Step 8: Verify User Created

After successful signup:

1. Supabase Dashboard → **Authentication** → **Users**
2. You should see your new user
3. Go to **Table Editor** → **profiles**
4. Should have 1 row with your user data

---

## 🎉 Done!

Your fresh Supabase setup is complete. The app should now work properly with:
- ✅ User signup
- ✅ User signin  
- ✅ Session persistence
- ✅ Profile creation

---

## 🔧 Troubleshooting

### Signup still fails?

1. Check browser console for errors
2. Check Supabase **Logs** → **Postgres Logs**
3. Make sure `.env` has correct credentials
4. Make sure you restarted dev server after updating `.env`

### Can't see tables?

- Make sure you ran the schema SQL
- Check for errors in SQL Editor

### Session not persisting?

- Clear browser cache
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
