# Fix: Blank Screen on Button Clicks

## Issue
When clicking "Delete", "Add More", or "Rewrite" buttons in the experience form, the screen goes blank.

## Root Cause
**Array Mutation Problem**: The handlers were directly mutating the description arrays instead of creating new arrays. React uses reference equality to detect changes, so when we mutate an array in place, React doesn't realize the data has changed and fails to re-render properly.

### Problematic Code:
```typescript
// ❌ BAD - Mutates the array
const bullets = getDescriptionArray(exp.description);
bullets.push('');  // Mutates original array
handleChange(expId, 'description', bullets);  // React doesn't detect change

// ❌ BAD - Mutates the array
bullets[bulletIndex] = value;  // Mutates original array
handleChange(expId, 'description', bullets);

// ❌ BAD - Mutates the array
bullets.splice(bulletIndex, 1);  // Mutates original array
handleChange(expId, 'description', bullets);
```

## Solution
Create **new arrays** instead of mutating existing ones. This ensures React properly detects changes.

### Fixed Code:

#### 1. handleBulletChange (typing in input)
```typescript
// ✅ GOOD - Creates new array
const bullets = getDescriptionArray(exp.description);
const newBullets = [...bullets];  // Create new array
newBullets[bulletIndex] = value;
handleChange(expId, 'description', newBullets);
```

#### 2. handleAddBullet (Add More button)
```typescript
// ✅ GOOD - Creates new array with spread operator
const bullets = getDescriptionArray(exp.description);
handleChange(expId, 'description', [...bullets, '']);
```

#### 3. handleRemoveBullet (Delete button)
```typescript
// ✅ GOOD - Creates new array with filter
const bullets = getDescriptionArray(exp.description);
const newBullets = bullets.filter((_, index) => index !== bulletIndex);
handleChange(expId, 'description', newBullets);
```

## Why This Matters

React's change detection works like this:
```typescript
// React compares references
oldArray === newArray  // true if same reference (mutation)
                       // false if new array (immutable update)
```

When we mutate an array:
- `oldArray === newArray` → `true` (same reference)
- React thinks: "No change detected, skip re-render"
- Result: Blank screen or no update

When we create a new array:
- `oldArray === newArray` → `false` (different reference)
- React thinks: "Change detected, re-render!"
- Result: UI updates correctly ✅

## Files Modified
- `components/ExperienceForm.tsx`
  - Fixed `handleBulletChange` (line 54-63)
  - Fixed `handleAddBullet` (line 65-71)
  - Fixed `handleRemoveBullet` (line 73-82)

## Testing
After this fix:
- ✅ Typing in bullet inputs works
- ✅ "Add More" button works
- ✅ Delete (X) button works
- ✅ "Rewrite" button works
- ✅ No more blank screens

## React Best Practice
**Always create new arrays/objects when updating state:**
```typescript
// ✅ Good patterns
setState([...array, newItem])           // Add
setState(array.filter(item => ...))     // Remove
setState(array.map(item => ...))        // Update
setState({ ...object, key: value })     // Object update

// ❌ Bad patterns
array.push(newItem); setState(array)    // Mutation
array.splice(i, 1); setState(array)     // Mutation
object.key = value; setState(object)    // Mutation
```

This is a fundamental React principle: **Immutability** 🎯
