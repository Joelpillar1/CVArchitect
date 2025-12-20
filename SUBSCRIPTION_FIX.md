# Subscription Persistence Issue - Fix Required

## 🔴 Problem
When you upgrade to a paid plan and reload the page, it resets back to the free plan. The subscription isn't being saved to Supabase.

## 🔍 Root Cause
The `handleSelectPlan` function is missing from `App.tsx`. This function should:
1. Update the local state (`userSubscription`)
2. Save the subscription to Supabase database
3. Close the pricing modal

## ✅ Solution

### **Add this function to App.tsx** (around line 350-400):

```typescript
// Handle plan selection from pricing modal
const handleSelectPlan = async (planId: PlanId, billingCycle?: 'monthly' | 'yearly') => {
  if (!user) return;

  try {
    // Get the selected plan details
    const selectedPlan = PLANS.find(p => p.id === planId);
    if (!selectedPlan) return;

    // Calculate credits based on plan
    let credits = selectedPlan.creditRules.startingCredits;
    if (billingCycle === 'yearly' && selectedPlan.creditRules.lifetimeCredits) {
      credits = selectedPlan.creditRules.lifetimeCredits;
    } else if (selectedPlan.creditRules.monthlyCredits) {
      credits = selectedPlan.creditRules.monthlyCredits;
    }

    // Calculate subscription dates
    const subscriptionStart = new Date();
    let subscriptionEnd: Date | undefined;
    
    if (planId !== 'lifetime') {
      subscriptionEnd = new Date();
      if (billingCycle === 'yearly') {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      } else {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      }
    }

    // Update Supabase database
    await subscriptionService.updateSubscription(user.id, {
      plan_id: planId,
      credits: credits,
      billing_cycle: billingCycle,
      subscription_start: subscriptionStart.toISOString(),
      subscription_end: subscriptionEnd?.toISOString(),
      is_active: true,
    } as any);

    // Update local state
    setUserSubscription({
      userId: user.id,
      planId: planId,
      credits: credits,
      billingCycle: billingCycle,
      subscriptionStart: subscriptionStart,
      subscriptionEnd: subscriptionEnd,
      isActive: true,
      usageHistory: userSubscription.usageHistory || [],
    });

    // Close modal
    setShowPricingModal(false);

    // Show success message
    setToast({
      message: `Successfully upgraded to ${selectedPlan.name}!`,
      type: 'success'
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    setToast({
      message: 'Failed to update subscription. Please try again.',
      type: 'error'
    });
  }
};
```

### **Import PLANS at the top of App.tsx:**

Make sure this import exists:
```typescript
import { PLANS } from './utils/pricingConfig';
```

---

## 🔧 Additional Fixes Needed

### **1. Update subscriptionService.ts**

The `updateSubscription` function needs to handle the correct column names:

```typescript
async updateSubscription(userId: string, updates: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        plan_id: updates.plan_id,
        credits: updates.credits,
        billing_cycle: updates.billing_cycle,
        subscription_start: updates.subscription_start,
        subscription_end: updates.subscription_end,
        is_active: updates.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
},
```

---

## 📋 Testing Steps

After adding the function:

1. **Sign up** with a new account
2. **Check Supabase** → Table Editor → subscriptions
   - Should see 1 row with `plan_id: 'free'`, `credits: 3`
3. **Upgrade** to a paid plan (e.g., Week Pass)
4. **Check Supabase** again
   - Should see `plan_id: 'week_pass'`, `credits: 50`
5. **Reload the page** (F5)
6. **Check if plan persists** ✅

---

## 🎯 Summary

**Missing:** `handleSelectPlan` function in App.tsx
**Impact:** Subscriptions not saved to database
**Fix:** Add the function above to App.tsx

Once this is added, subscriptions will persist across page reloads! 🚀
