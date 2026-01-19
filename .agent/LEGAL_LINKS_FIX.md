# Legal Links Navigation Fix ✅

## Issue Fixed
**Problem:** Terms of Service and Privacy Policy links on SignUp page weren't routing to their respective pages.

## Solution
Added `onClick` handlers to the Terms and Privacy buttons in `SignUp.tsx`:

```typescript
// Terms of Service button
<button 
    type="button" 
    onClick={() => navigate('/terms')} 
    className="text-brand-green hover:text-green-700 font-medium"
>
    Terms of Service
</button>

// Privacy Policy button
<button 
    type="button" 
    onClick={() => navigate('/privacy')} 
    className="text-brand-green hover:text-green-700 font-medium"
>
    Privacy Policy
</button>
```

---

## What Works Now

✅ **Terms of Service** link navigates to `/terms`
✅ **Privacy Policy** link navigates to `/privacy`
✅ Users can read legal documents before signing up
✅ Browser back button returns to signup page

---

## Test It

1. Go to `/signup`
2. Click "Terms of Service" → Should navigate to `/terms`
3. Click back button → Returns to `/signup`
4. Click "Privacy Policy" → Should navigate to `/privacy`
5. Click back button → Returns to `/signup`

All legal links now work! 🎉
