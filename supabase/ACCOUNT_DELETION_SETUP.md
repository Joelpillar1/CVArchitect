# Account Deletion Setup

This document explains how to set up the complete account deletion functionality.

## Overview

The account deletion feature allows users to permanently delete their account and all associated data from both the public database tables and the Supabase Auth system.

## Database Setup

You need to run the SQL function in your Supabase database to enable complete account deletion.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your project at https://supabase.com
   - Navigate to the SQL Editor

2. **Run the SQL Script**
   - Open the file: `supabase/delete_account_complete.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click "Run" to execute

3. **Verify Installation**
   - The function `delete_user_account_complete()` should now be available
   - You can verify by running:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name = 'delete_user_account_complete';
   ```

## How It Works

### Frontend Flow:
1. User clicks "Delete Account" button in Settings (Account tab or Preferences tab)
2. Confirmation dialog appears
3. Upon confirmation, `handleDeleteAccount()` is called
4. The function calls `profileService.deleteUser(userId)`
5. User is signed out and redirected to home page

### Backend Flow:
1. **Primary Method**: Calls `delete_user_account_complete()` RPC function
   - Deletes all user data from public tables (resumes, cover_letters, usage_logs, etc.)
   - Deletes the user from `auth.users` table
   - Returns success response

2. **Fallback Method 1**: If complete deletion fails, calls `delete_user_account()` RPC
   - Deletes only public table data
   - Auth user remains (user can still log in but with no data)

3. **Fallback Method 2**: If both RPCs fail, manual deletion
   - Deletes data from each table individually
   - Auth user remains

4. **Final Step**: Always calls `supabase.auth.signOut()` to log out the user

## Security

- The function uses `SECURITY DEFINER` to run with elevated privileges
- Only the authenticated user can delete their own account (verified via `auth.uid()`)
- All deletions are scoped to the requesting user's ID only
- Transaction-safe: if any step fails, the entire operation is rolled back

## Files Modified

1. **`supabase/delete_account_complete.sql`** (NEW)
   - SQL function for complete account deletion

2. **`services/profileService.ts`**
   - Updated `deleteUser()` to use new RPC function
   - Added proper fallback chain
   - Ensures user is signed out after deletion

3. **`components/Settings.tsx`**
   - Updated `handleDeleteAccount()` for better error handling
   - Added proper navigation after deletion
   - Improved user feedback during deletion process

## Testing

To test the account deletion:

1. Create a test account
2. Add some data (resumes, cover letters, etc.)
3. Go to Settings → Account tab or Preferences tab
4. Click "Delete Account"
5. Confirm the deletion
6. Verify:
   - User is logged out
   - Redirected to home page
   - Cannot log in with deleted credentials
   - All data is removed from database

## Troubleshooting

### If deletion fails:
- Check browser console for error messages
- Verify the SQL function is installed in Supabase
- Check Supabase logs for server-side errors
- Ensure RLS policies allow deletion

### If auth user is not deleted:
- The fallback methods will still delete all user data
- User can still log in but will have no data
- Contact support to manually delete the auth user

## Notes

- Account deletion is **permanent** and **cannot be undone**
- All user data is permanently deleted
- Users are warned with a confirmation dialog before deletion
- The process is designed to be fail-safe with multiple fallback methods
