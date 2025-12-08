# Email Uniqueness - One Email Per User

## 🔒 **How It's Enforced:**

### **1. Supabase Auth Level (Primary Enforcement)**
Supabase Auth **automatically enforces** email uniqueness at the database level:
- Email addresses are stored in the `auth.users` table
- The `email` column has a **UNIQUE constraint**
- Attempting to sign up with an existing email will fail
- This applies to **both** email/password and OAuth (Google) signups

### **2. Application Level (User-Friendly Errors)**
We've added error handling in the SignUp component to provide clear feedback:

```typescript
// In SignUp.tsx
if (error.message.includes('already registered') || 
    error.message.includes('already exists')) {
    throw new Error('This email is already registered. Please sign in instead or use a different email.');
}
```

---

## 📋 **What Happens When Someone Tries to Use an Existing Email:**

### **Scenario 1: Email/Password Signup**
```
1. User enters email: john@example.com
   ↓
2. Email already exists in database
   ↓
3. Supabase returns error
   ↓
4. App shows: "This email is already registered. Please sign in instead or use a different email."
   ↓
5. Signup fails ❌
```

### **Scenario 2: Google OAuth**
```
1. User clicks "Sign in with Google"
   ↓
2. Google returns email: john@example.com
   ↓
3. Supabase checks if email exists
   ↓
4a. If NEW: Creates account ✅
4b. If EXISTS: Signs in to existing account ✅
```

**Note:** Google OAuth is smart - if the email already exists, it **signs the user in** instead of creating a duplicate!

---

## 🎯 **Database Schema:**

### **auth.users table (Supabase managed)**
```sql
CREATE TABLE auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,  -- ← UNIQUE constraint enforces one email per user
  encrypted_password text,
  email_confirmed_at timestamp,
  ...
);
```

### **profiles table (Our custom table)**
```sql
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  ...
);
```

The `profiles.id` references `auth.users.id`, ensuring **one profile per user**.

---

## ✅ **Guarantees:**

1. ✅ **One email = One account** (enforced by database)
2. ✅ **Email/password signups** cannot duplicate emails
3. ✅ **Google OAuth** reuses existing account if email matches
4. ✅ **Clear error messages** when email is already taken
5. ✅ **Profile table** linked 1:1 with auth user

---

## 🧪 **Testing:**

### **Test 1: Duplicate Email/Password Signup**
1. Sign up with `test@example.com`
2. Try to sign up again with `test@example.com`
3. **Expected:** Error message: "This email is already registered..."

### **Test 2: Google OAuth with Existing Email**
1. Sign up with email/password: `test@example.com`
2. Try to sign in with Google using `test@example.com`
3. **Expected:** Signs into existing account (no duplicate created)

### **Test 3: Multiple Google Signups**
1. Sign in with Google: `test@gmail.com`
2. Sign out
3. Sign in with Google again: `test@gmail.com`
4. **Expected:** Signs into same account (no duplicate created)

---

## 🔐 **Security Notes:**

- Email uniqueness is enforced at the **database level** (most secure)
- Cannot be bypassed through API calls
- Works for all authentication methods (email/password, OAuth)
- Prevents account hijacking through duplicate emails

---

## 📝 **Summary:**

**You don't need to worry about duplicate emails!** Supabase Auth handles this automatically:
- ✅ Database constraint prevents duplicates
- ✅ Application shows friendly error messages
- ✅ Google OAuth reuses existing accounts
- ✅ One email = One user (guaranteed)
