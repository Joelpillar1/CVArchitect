# Whop Integration Setup - Environment Variables

## Action Required: Update Your .env File

Please add the following lines to your `.env` file:

```bash
# Whop Payment Configuration
VITE_WHOP_SPRINT_PLAN_ID=plan_Sr2CjRgtctFpD
VITE_WHOP_MARATHON_PLAN_ID=plan_h4ga7XhsUpzx9
```

## Complete .env File Should Look Like:

```bash
VITE_OPENAI_API_KEY=your_actual_openai_key
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_key

# Whop Payment Configuration
VITE_WHOP_SPRINT_PLAN_ID=plan_Sr2CjRgtctFpD
VITE_WHOP_MARATHON_PLAN_ID=plan_h4ga7XhsUpzx9
```

## After Adding These Variables:

1. **Restart your dev server** for the environment variables to take effect:
   - Stop the current `npm run dev` (Ctrl+C)
   - Run `npm run dev` again

2. **Test the checkout flow**:
   - Open your app
   - Click on "Upgrade" or open the pricing modal
   - Click "Start My 7-Day Sprint" - it should open a Whop checkout window
   - Click "Career Marathon" - it should open a Whop checkout window

## What Happens Now:

When users click on either plan:
1. A new window opens with the Whop checkout page
2. The user's email is pre-filled (if they're logged in)
3. User enters payment details
4. After successful payment, they're redirected back to your app with `?payment=success&plan=plan_xxx`
5. After cancellation, they're redirected with `?payment=cancelled`

## Next Steps:

We still need to:
1. Handle the success/cancel redirects in your App.tsx
2. Set up webhooks to automatically grant access after payment
3. Update the database when payment is successful

But for now, the checkout integration is complete! 🎉
