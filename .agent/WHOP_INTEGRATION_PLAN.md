# Whop Payment Integration - Updated Implementation Plan
## Based on Current CVArchitect Structure

---

## 📊 Current App Structure Analysis

### **Existing Components:**
1. ✅ **PaywallModal** (`components/PaywallModal.tsx`)
   - Triggers when users hit limits
   - Shows feature-specific messaging
   - Has "View Pricing" button that calls `onUpgrade()`

2. ✅ **PricingModal** (`components/PricingModal.tsx`)
   - Displays plan cards
   - Handles plan selection via `onSelectPlan(planId, billingCycle)`
   - Currently has placeholder for payment integration

3. ✅ **SubscriptionManager** (`utils/subscriptionManager.ts`)
   - Manages credit deduction
   - Checks feature access
   - Validates template access
   - Tracks usage history

4. ✅ **Pricing Config** (`utils/pricingConfig.ts`)
   - Defines 3 plans: `free`, `week_pass`, `pro_monthly`
   - Credit rules and costs
   - Template access tiers

### **Current Plans:**
```typescript
{
  free: {
    price: $0,
    credits: 10 (one-time),
    features: Limited templates, 1 job match, basic AI
  },
  week_pass: { // "Career Sprint"
    price: $14 (one-time, 7 days),
    credits: Unlimited,
    features: All templates, unlimited AI, priority support
  },
  pro_monthly: { // "Career Marathon"  
    price: $29/month,
    credits: Unlimited,
    features: All templates, unlimited AI, priority support
  }
}
```

### **User Flow:**
1. User triggers AI action → SubscriptionManager checks credits
2. If insufficient → Show PaywallModal
3. User clicks "View Pricing" → Show PricingModal
4. User selects plan → `handleSelectPlan()` called
5. **[MISSING]** Payment processing → **This is where Whop comes in!**

---

## 🎯 Whop Integration Strategy

### **Approach: Replace Payment Processing Logic**

We'll integrate Whop at the **payment processing step** in `PricingModal` and handle subscription management via webhooks.

---

## 🏗️ Updated Implementation Plan

### **Phase 1: Whop Account & Product Setup**

#### 1.1 Create Whop Account
- [ ] Sign up at [whop.com/sell](https://whop.com/dashboard/start/)
- [ ] Choose business name: "CVArchitect"
- [ ] Set custom URL: `cvarchitect.whop.com`

#### 1.2 Create Products (Match Current Plans)
Create 2 products in Whop Dashboard:

**Product 1: Career Sprint (7-Day Pass)**
- Name: "Career Sprint - 7 Day Unlimited Access"
- Price: $14.00 (one-time payment)
- Duration: 7 days
- Description: "Get hired fast with 7 days of unlimited AI power"
- Copy Plan ID: `plan_SPRINT_XXXXXXXXX`

**Product 2: Career Marathon (Monthly Subscription)**
- Name: "Career Marathon - Monthly Unlimited"
- Price: $29.00/month (recurring)
- Billing: Monthly
- Description: "Long-term career strategist with unlimited access"
- Copy Plan ID: `plan_MARATHON_XXXXXXXXX`

#### 1.3 Get API Credentials
- [ ] Go to [Developer Dashboard](https://whop.com/dashboard/developer)
- [ ] Create Company API Key
- [ ] Set permissions:
  - ✅ `Membership/Validate License`
  - ✅ `Membership/Retrieve Membership`
  - ✅ `Payments/Create Checkout Session`
- [ ] Copy API Key and App ID

---

### **Phase 2: Environment Setup**

#### 2.1 Update `.env` and `.env.example`

```env
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxxxxxxxxxx
WHOP_API_KEY=whop_xxxxxxxxxxxxxxxxxxxxx

# Whop Plan IDs
NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID=plan_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID=plan_xxxxxxxxxxxxx
```

#### 2.2 Install Whop SDK

```bash
npm install @whop/sdk
# or
pnpm add @whop/sdk
```

---

### **Phase 3: Core Integration Files**

#### 3.1 Create Whop SDK Client
**File**: `lib/whop-sdk.ts` (NEW)

```typescript
import { WhopServerSdk } from "@whop/sdk";

if (!process.env.NEXT_PUBLIC_WHOP_APP_ID || !process.env.WHOP_API_KEY) {
  throw new Error('Missing Whop credentials. Check your .env file.');
}

export const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
  appApiKey: process.env.WHOP_API_KEY!,
});
```

#### 3.2 Create Whop Service
**File**: `services/whopService.ts` (NEW)

```typescript
import { whopSdk } from '../lib/whop-sdk';
import { supabase } from '../lib/supabase';

/**
 * Create a checkout session for a plan
 */
export async function createCheckoutSession(
  planId: string,
  userId: string,
  userEmail: string,
  returnUrl: string = window.location.origin
) {
  try {
    const checkoutSession = await whopSdk.payments.createCheckoutSession({
      planId: planId,
      metadata: {
        userId: userId,
        email: userEmail,
        source: 'cvarchitect',
      },
      successUrl: `${returnUrl}?payment=success`,
      cancelUrl: `${returnUrl}?payment=cancelled`,
    });
    
    return checkoutSession.checkoutUrl;
  } catch (error) {
    console.error('Whop checkout creation failed:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Check if user has active Whop membership
 */
export async function checkUserMembership(whopUserId: string) {
  try {
    const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass(
      whopUserId
    );
    return hasAccess;
  } catch (error) {
    console.error('Whop access check failed:', error);
    return false;
  }
}

/**
 * Get user's membership details
 */
export async function getUserMembership(membershipId: string) {
  try {
    const membership = await whopSdk.memberships.retrieve(membershipId);
    return membership;
  } catch (error) {
    console.error('Failed to retrieve membership:', error);
    return null;
  }
}

/**
 * Map Whop plan ID to internal plan ID
 */
export function mapWhopPlanToInternal(whopPlanId: string): string {
  const SPRINT_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
  const MARATHON_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;
  
  if (whopPlanId === SPRINT_PLAN_ID) return 'week_pass';
  if (whopPlanId === MARATHON_PLAN_ID) return 'pro_monthly';
  
  return 'free';
}

/**
 * Map internal plan ID to Whop plan ID
 */
export function mapInternalPlanToWhop(internalPlanId: string): string | null {
  const SPRINT_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
  const MARATHON_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;
  
  if (internalPlanId === 'week_pass') return SPRINT_PLAN_ID!;
  if (internalPlanId === 'pro_monthly') return MARATHON_PLAN_ID!;
  
  return null;
}
```

---

### **Phase 4: Update PricingModal**

#### 4.1 Modify `components/PricingModal.tsx`

**Changes needed:**

```typescript
import { createCheckoutSession, mapInternalPlanToWhop } from '../services/whopService';

// Inside PricingModal component:
const handlePlanSelect = async (planId: PlanId) => {
  // Don't process free plan
  if (planId === 'free') {
    onClose();
    return;
  }

  try {
    // Map internal plan ID to Whop plan ID
    const whopPlanId = mapInternalPlanToWhop(planId);
    
    if (!whopPlanId) {
      throw new Error('Invalid plan selected');
    }

    // Create Whop checkout session
    const checkoutUrl = await createCheckoutSession(
      whopPlanId,
      user.id,
      user.email,
      window.location.origin
    );

    // Redirect to Whop checkout
    window.location.href = checkoutUrl;
    
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Failed to start checkout. Please try again.');
  }
};
```

---

### **Phase 5: Webhook Handler**

#### 5.1 Create Webhook Endpoint
**File**: `pages/api/webhooks/whop.ts` (NEW) or use Supabase Edge Function

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { mapWhopPlanToInternal } from '../../../services/whopService';
import { PLANS } from '../../../utils/pricingConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Verify webhook signature from Whop
  // const signature = req.headers['whop-signature'];
  // if (!verifySignature(signature, req.body)) {
  //   return res.status(401).json({ error: 'Invalid signature' });
  // }

  const event = req.body;

  try {
    switch (event.type) {
      case 'membership.created':
        await handleMembershipCreated(event.data);
        break;
      
      case 'membership.updated':
        await handleMembershipUpdated(event.data);
        break;
      
      case 'membership.deleted':
      case 'membership.cancelled':
        await handleMembershipCancelled(event.data);
        break;
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleMembershipCreated(membership: any) {
  const { metadata, id: membershipId, plan_id, expires_at } = membership;
  const { userId, email } = metadata;

  // Map Whop plan to internal plan
  const internalPlanId = mapWhopPlanToInternal(plan_id);
  const plan = PLANS[internalPlanId];

  if (!plan) {
    console.error('Unknown plan:', plan_id);
    return;
  }

  // Update user subscription in Supabase
  const { error } = await supabase
    .from('users')
    .update({
      whop_membership_id: membershipId,
      whop_plan_id: plan_id,
      plan_id: internalPlanId,
      credits: plan.creditRules.startingCredits,
      subscription_status: 'active',
      subscription_start: new Date().toISOString(),
      subscription_end: expires_at ? new Date(expires_at).toISOString() : null,
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update user subscription:', error);
    throw error;
  }

  console.log(`✅ Membership created for user ${userId}: ${internalPlanId}`);
}

async function handleMembershipUpdated(membership: any) {
  const { metadata, id: membershipId, status, expires_at } = membership;
  const { userId } = metadata;

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: status,
      subscription_end: expires_at ? new Date(expires_at).toISOString() : null,
    })
    .eq('whop_membership_id', membershipId);

  if (error) {
    console.error('Failed to update membership:', error);
    throw error;
  }

  console.log(`✅ Membership updated for user ${userId}`);
}

async function handleMembershipCancelled(membership: any) {
  const { metadata, id: membershipId } = membership;
  const { userId } = metadata;

  // Revert to free plan
  const freePlan = PLANS.free;

  const { error } = await supabase
    .from('users')
    .update({
      whop_membership_id: null,
      whop_plan_id: null,
      plan_id: 'free',
      credits: freePlan.creditRules.startingCredits,
      subscription_status: 'cancelled',
      subscription_end: new Date().toISOString(),
    })
    .eq('whop_membership_id', membershipId);

  if (error) {
    console.error('Failed to cancel membership:', error);
    throw error;
  }

  console.log(`✅ Membership cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(payment: any) {
  console.log('💰 Payment succeeded:', payment);
  // Additional payment logging if needed
}
```

#### 5.2 Register Webhook in Whop
- Go to Whop Dashboard → Developer → Webhooks
- Add webhook URL: `https://your-domain.com/api/webhooks/whop`
- Select events:
  - ✅ `membership.created`
  - ✅ `membership.updated`
  - ✅ `membership.deleted`
  - ✅ `membership.cancelled`
  - ✅ `payment.succeeded`

---

### **Phase 6: Database Schema Updates**

#### 6.1 Add Whop Fields to Users Table

```sql
-- Add Whop-related columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS whop_membership_id TEXT,
ADD COLUMN IF NOT EXISTS whop_plan_id TEXT,
ADD COLUMN IF NOT EXISTS plan_id TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_whop_membership 
ON users(whop_membership_id);
```

---

### **Phase 7: Handle Payment Success/Failure**

#### 7.1 Update App.tsx to Handle Return URLs

```typescript
// In App.tsx useEffect
useEffect(() => {
  // Check URL params for payment status
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get('payment');

  if (paymentStatus === 'success') {
    showToast('🎉 Payment successful! Your subscription is now active.', 'success');
    // Refresh user data to get updated subscription
    if (user) {
      fetchUserSubscription(user.id);
    }
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  } else if (paymentStatus === 'cancelled') {
    showToast('Payment cancelled. You can try again anytime.', 'info');
    window.history.replaceState({}, '', window.location.pathname);
  }
}, []);
```

---

### **Phase 8: Subscription Management**

#### 8.1 Add "Manage Subscription" Link

**In Account Settings or Profile:**

```typescript
{userSubscription.planId !== 'free' && (
  <a
    href="https://whop.com/@me/settings/memberships/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-brand-green hover:underline"
  >
    Manage Subscription on Whop →
  </a>
)}
```

---

## 🔄 Complete User Journey

### **Scenario 1: New User Upgrades**
1. User hits credit limit → PaywallModal shows
2. Clicks "View Pricing" → PricingModal shows
3. Selects "Career Sprint" → Redirects to Whop checkout
4. Completes payment on Whop
5. Whop sends `membership.created` webhook
6. Webhook updates user's plan_id to `week_pass` and credits to `999999`
7. User redirected back with `?payment=success`
8. App shows success toast and refreshes subscription data
9. User now has unlimited access for 7 days

### **Scenario 2: Subscription Expires**
1. 7 days pass for Career Sprint user
2. Whop sends `membership.deleted` webhook
3. Webhook reverts user to `free` plan with 10 credits
4. Next time user tries AI action → PaywallModal shows

### **Scenario 3: User Cancels Monthly**
1. User goes to Whop settings and cancels
2. Whop sends `membership.cancelled` webhook
3. Webhook updates status but keeps access until period end
4. At period end, Whop sends `membership.deleted`
5. User reverted to free plan

---

## 🧪 Testing Checklist

### **Local Testing:**
- [ ] Install Whop SDK
- [ ] Set up environment variables
- [ ] Test checkout URL generation
- [ ] Test plan mapping (internal ↔ Whop)

### **Whop Test Mode:**
- [ ] Create test products
- [ ] Test checkout flow
- [ ] Test webhook delivery
- [ ] Verify webhook processing
- [ ] Test subscription activation
- [ ] Test subscription cancellation

### **Production:**
- [ ] Create live products
- [ ] Update environment variables
- [ ] Deploy webhook endpoint
- [ ] Register webhook in Whop
- [ ] Test end-to-end flow
- [ ] Monitor webhook logs

---

## 📁 Files to Create/Modify

### **New Files:**
```
lib/
  └── whop-sdk.ts                    (Whop SDK client)

services/
  └── whopService.ts                 (Whop API functions)

pages/api/webhooks/
  └── whop.ts                        (Webhook handler)
```

### **Modified Files:**
```
.env                                  (Add Whop credentials)
.env.example                          (Add Whop placeholders)
components/PricingModal.tsx           (Update handlePlanSelect)
App.tsx                               (Handle payment return URLs)
MainApp.tsx                           (Handle payment return URLs)
```

### **Database:**
```
migrations/
  └── add_whop_fields.sql            (Add Whop columns)
```

---

## 🚀 Deployment Steps

1. **Setup Whop Account** (30 mins)
   - Create account
   - Create products
   - Get API keys

2. **Code Implementation** (2-3 hours)
   - Install SDK
   - Create whop-sdk.ts
   - Create whopService.ts
   - Update PricingModal
   - Create webhook handler

3. **Database Migration** (15 mins)
   - Run SQL migration
   - Verify columns added

4. **Deploy & Test** (1 hour)
   - Deploy to production
   - Register webhook
   - Test with Whop test mode
   - Verify webhook processing

5. **Go Live** (15 mins)
   - Switch to live mode
   - Update plan IDs
   - Final end-to-end test

**Total Estimated Time: 4-5 hours**

---

## 💡 Key Advantages of This Approach

1. ✅ **Minimal Code Changes** - Only update payment processing
2. ✅ **Keep Existing Logic** - SubscriptionManager stays the same
3. ✅ **Webhook-Driven** - Automatic subscription management
4. ✅ **Whop Handles** - Payment processing, recurring billing, cancellations
5. ✅ **We Handle** - Feature access, credit management, UI/UX
6. ✅ **Clean Separation** - Whop = payments, CVArchitect = features

---

## 🎯 Next Steps

1. **Create Whop account** and set up products
2. **Get API credentials** (App ID + API Key)
3. **Install @whop/sdk** package
4. **Implement Phase 3** (Core files)
5. **Test locally** with test mode
6. **Deploy & go live!**

Ready to start implementation? Let me know and I'll help you build each component! 🚀
