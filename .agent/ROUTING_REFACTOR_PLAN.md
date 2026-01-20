# URL Routing Refactor - Implementation Plan

**Goal:** Change from internal view state to React Router paths

---

## Current State
- All views use internal state: `currentView` (View.EDITOR, View.OVERVIEW, etc.)
- URL stays as `/dashboard` regardless of view
- Navigation uses `setCurrentView(View.EDITOR)`

## Target State
- Each view has its own URL path
- URL changes when navigating between views
- Navigation uses React Router's `navigate('/dashboard/editor')`

---

## URL Mapping

| View | Current URL | New URL |
|------|-------------|---------|
| OVERVIEW | `/dashboard` | `/dashboard` |
| EDITOR | `/dashboard` | `/dashboard/editor` |
| TEMPLATES | `/dashboard` | `/dashboard/templates` |
| MY_TEMPLATES | `/dashboard` | `/dashboard/my-templates` |
| MY_COVER_LETTERS | `/dashboard` | `/dashboard/cover-letters` |
| SETTINGS | `/dashboard` | `/dashboard/settings` |

---

## Implementation Steps

### 1. Update MainApp.tsx
- Remove `currentView` state
- Use `useLocation()` and `useNavigate()` from React Router
- Map URL path to view component
- Update all `setCurrentView()` calls to `navigate()`

### 2. Create Route Components
- Extract each view into its own component (if not already)
- OVERVIEW → OverviewScreen
- EDITOR → EditorScreen  
- TEMPLATES → TemplatesScreen
- etc.

### 3. Update AppRoutes.tsx
- Add nested routes under `/dashboard/*`
- Map each path to its component

### 4. Update Navigation
- Replace all `setCurrentView(View.X)` with `navigate('/dashboard/x')`
- Update sidebar/navigation to use `<Link>` or `navigate()`

---

## Files to Modify

1. ✅ `MainApp.tsx` - Main routing logic
2. ✅ `AppRoutes.tsx` - Add nested routes
3. ✅ All components that call `setCurrentView()`

---

## Benefits

✅ **Better UX** - Users can bookmark specific views
✅ **Browser history** - Back/forward buttons work correctly
✅ **Shareable URLs** - Can share direct links to editor, settings, etc.
✅ **SEO** - Better for search engines (if applicable)
✅ **Standard pattern** - Follows React Router best practices

---

Ready to implement!
