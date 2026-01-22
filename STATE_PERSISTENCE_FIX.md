# State Persistence Fix - Prevent Data Loss on Tab Switch

## Problem
When switching between tabs (Editor, Settings, Cover Letter, etc.), pages would reload and cause loss of content. This happened because:
1. State was only persisted in `useEffect`, causing delays
2. React Router unmounts/remounts components on route changes
3. State wasn't restored from localStorage when components remounted

## Solution
Implemented immediate state persistence with automatic restoration to prevent data loss.

---

## Changes Made

### 1. Created State Persistence Utilities (`utils/statePersistence.ts`)
- `saveToStorage()` - Immediate synchronous save
- `debouncedSaveToStorage()` - Debounced save for frequent updates (300-500ms)
- `loadFromStorage()` - Load with type safety
- Prevents performance issues from too-frequent localStorage writes

### 2. Updated Dashboard (`pages/Dashboard.tsx`)
- **Immediate Persistence**: State changes now save immediately to localStorage
- **Wrapper Functions**: `setResumeData`, `setSelectedTemplate`, `setCurrentResumeId` now persist automatically
- **Debounced Saves**: Resume data uses 300ms debounce (frequent updates during typing)
- **Template Changes**: Saved immediately (less frequent)

**Key Changes:**
```typescript
// Before: State persisted only in useEffect (delayed)
const [resumeData, setResumeData] = useState(...);
useEffect(() => {
  localStorage.setItem('cv_app_data', JSON.stringify(resumeData));
}, [resumeData]); // Delayed save

// After: Immediate persistence on every change
const setResumeData = useCallback((data) => {
  setResumeDataState(prev => {
    const newData = typeof data === 'function' ? data(prev) : data;
    debouncedSaveToStorage('cv_app_data', newData, 300); // Immediate
    return newData;
  });
}, []);
```

### 3. Updated Editor (`components/Editor.tsx`)
- **Tab State Persistence**: Active tab (personal, summary, etc.) is preserved
- **Zoom Level Persistence**: Zoom level is preserved
- **Mobile Tab Persistence**: Mobile view tab (editor/preview/design) is preserved
- All restored from localStorage on mount

### 4. Updated Settings (`components/Settings.tsx`)
- **Form Field Persistence**: First name, last name, email, avatar URL are preserved
- **Active Tab Persistence**: Which settings tab is active is preserved
- **Debounced Saves**: Form fields use 500ms debounce to avoid excessive writes
- **Smart Restoration**: Only restores from userProfile if no saved values exist

### 5. Updated Cover Letter Page (`pages/CoverLetterPage.tsx`)
- **Form State Persistence**: Job title, company name, job description preserved
- **Generated Letter Persistence**: Generated cover letter is preserved
- **Template Selection**: Selected template (modern/bold/impact) is preserved
- **Edit State Persistence**: Edited text and structured edits are preserved
- **Step Persistence**: Current step (input/generating/result) is preserved

---

## How It Works

### Immediate Persistence Pattern
```typescript
// 1. Create state with localStorage initializer
const [value, setValueState] = useState(() => {
  return loadFromStorage<T>('key', defaultValue);
});

// 2. Create wrapper that persists immediately
const setValue = useCallback((newValue: T) => {
  setValueState(newValue);
  saveToStorage('key', newValue); // Immediate save
}, []);

// 3. Use wrapper instead of setter directly
```

### Debounced Persistence (for frequent updates)
```typescript
const setValue = useCallback((newValue: T) => {
  setValueState(newValue);
  debouncedSaveToStorage('key', newValue, 300); // Debounced (300ms)
}, []);
```

### State Restoration
- State is loaded from localStorage in `useState` initializers
- Components automatically restore state on mount
- No need for separate restoration logic

---

## What's Preserved

### Editor
- ✅ Resume data (all form fields)
- ✅ Selected template
- ✅ Active tab (personal, summary, experience, etc.)
- ✅ Zoom level
- ✅ Mobile view tab (editor/preview/design)
- ✅ Current resume ID

### Settings
- ✅ First name, last name
- ✅ Email
- ✅ Avatar URL
- ✅ Active tab (account/subscription/usage/preferences)
- ✅ Form edits (not lost when switching tabs)

### Cover Letter Page
- ✅ Job title, company name, job description
- ✅ Generated cover letter
- ✅ Selected template (modern/bold/impact)
- ✅ Edited text
- ✅ Structured edits (opening, skills, closing)
- ✅ Current step (input/generating/result)

---

## Performance Considerations

### Debouncing Strategy
- **Resume Data**: 300ms debounce (frequent updates during typing)
- **Form Fields**: 500ms debounce (less frequent)
- **Template/Step Changes**: Immediate (infrequent, important)

### Why Debouncing?
- localStorage writes are synchronous and can block the UI
- Debouncing batches rapid changes into single writes
- Prevents performance issues during fast typing

---

## Testing

To verify the fix works:

1. **Editor Test:**
   - Go to Editor
   - Fill in some resume fields
   - Switch to Settings tab
   - Switch back to Editor
   - ✅ Resume data should still be there

2. **Settings Test:**
   - Go to Settings
   - Edit first name or email
   - Switch to Editor
   - Switch back to Settings
   - ✅ Form fields should still have your edits

3. **Cover Letter Test:**
   - Go to Cover Letter page
   - Enter job title and company
   - Generate a letter
   - Switch to Editor
   - Switch back to Cover Letter
   - ✅ Generated letter should still be there

---

## Technical Details

### localStorage Keys Used
- `cv_app_data` - Resume data
- `cv_app_template` - Selected template
- `cv_app_resume_id` - Current resume ID
- `editor_activeTab` - Editor active tab
- `editor_zoom` - Editor zoom level
- `editor_activeMobileTab` - Mobile view tab
- `settings_activeTab` - Settings active tab
- `settings_firstName`, `settings_lastName`, etc. - Settings form fields
- `cover_letter_*` - All cover letter state

### Error Handling
- All localStorage operations are wrapped in try-catch
- Graceful fallback to defaults if localStorage fails
- No errors thrown to user (logged to console)

---

## Benefits

✅ **No Data Loss**: Content is preserved when switching tabs
✅ **Better UX**: Users don't lose their work
✅ **Performance**: Debouncing prevents UI blocking
✅ **Automatic**: No manual save required
✅ **Transparent**: Works seamlessly in the background

---

## Future Improvements

Potential enhancements:
1. Add visual indicator when state is being saved
2. Add "unsaved changes" warning before navigation
3. Sync state across browser tabs (using storage events)
4. Add state versioning for rollback capability
