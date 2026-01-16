# URL Routing Implementation Guide

## Current Status
Your app currently uses view states instead of URL routing. All pages show the same URL.

## What Needs to Be Done

### Files Created:
1. **AppRouter.tsx** - New router component with URL routes
2. **MainApp.tsx** - Copy of your current App.tsx (backup)

### To Implement Full Routing:

You need to refactor MainApp.tsx to:
1. Remove the `currentView` state system
2. Use `useLocation()` and `useNavigate()` from react-router-dom
3. Replace `setCurrentView(View.X)` with `navigate('/path')`
4. Use `<Routes>` and `<Route>` instead of switch/case

### URL Structure:
- `/` - Landing page
- `/login` - Sign in
- `/signup` - Sign up
- `/dashboard` - Main dashboard (Overview)
- `/templates` - Template selection
- `/editor` - Resume editor
- `/my-templates` - Saved resumes
- `/my-cover-letters` - Saved cover letters
- `/settings` - User settings
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/contact` - Contact page
- `/pricing` - Pricing page

### Estimated Time:
- Full refactor: 2-3 hours
- Testing: 1 hour

## To Revert:
If you want to revert to the original:
```bash
rm App.tsx AppRouter.tsx
mv MainApp.tsx App.tsx
```
