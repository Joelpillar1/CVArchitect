# Account Deletion - Quick Reference

## Where to Find Delete Account Buttons

### Option 1: Account Tab
1. Go to **Settings**
2. Click on **Account** tab (first tab)
3. Scroll down to **Security** section
4. Click **Delete Account** button

### Option 2: Preferences Tab
1. Go to **Settings**
2. Click on **Preferences** tab (last tab)
3. Scroll to **Data & Privacy** section
4. Click **Delete All My Data** button

## What Happens When You Click Delete

1. **Confirmation Dialog**
   - A browser confirmation dialog appears
   - Message: "Are you absolutely sure? This action cannot be undone and will permanently delete your account and all data."

2. **Loading State**
   - Button shows a spinner animation
   - Text changes to "Deleting..."
   - Button is disabled to prevent multiple clicks

3. **Deletion Process**
   - All your data is deleted from the database:
     - Resumes
     - Cover letters
     - Usage logs
     - Billing history
     - Subscriptions
     - Profile
   - Your auth account is deleted (you cannot log in again)
   - You are automatically signed out

4. **After Deletion**
   - You are redirected to the home page
   - Your account and all data are permanently deleted
   - You cannot log in with the deleted credentials

## Important Notes

⚠️ **This action is PERMANENT and CANNOT be undone**

✅ **What gets deleted:**
- All resumes and resume versions
- All cover letters
- Usage history and logs
- Billing history
- Subscription information
- Profile information
- Auth account (login credentials)

❌ **What you CANNOT do after deletion:**
- Log in with the same email
- Recover any data
- Undo the deletion

## Error Handling

If deletion fails:
- An error message will appear: "Failed to delete account. Please try again or contact support."
- The button will be re-enabled
- You can try again or contact support

## For Developers

See these files for implementation details:
- `ACCOUNT_DELETION_SUMMARY.md` - Complete implementation summary
- `supabase/ACCOUNT_DELETION_SETUP.md` - Database setup instructions
- `supabase/delete_account_complete.sql` - SQL function to run in Supabase
