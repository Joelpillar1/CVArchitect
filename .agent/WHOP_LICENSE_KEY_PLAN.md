# Whop License Key Integration - Implementation Plan

**Date:** January 20, 2026  
**Approach:** License Key Validation (Simpler & More Reliable than Webhooks)

---

## 🎯 **Why License Keys Are Better**

### **Current Problem with Webhooks:**
- ❌ Webhooks can fail silently
- ❌ Requires server endpoint configuration
- ❌ Depends on Whop successfully delivering events
- ❌ Email matching issues between Whop and Supabase
- ❌ Difficult to debug when things go wrong

### **Benefits of License Keys:**
- ✅ **User-controlled**: Users enter their license key themselves
- ✅ **Instant validation**: Real-time API call to verify
- ✅ **No webhooks needed**: Direct API validation
- ✅ **Better UX**: Users see immediate feedback
- ✅ **Easier debugging**: Clear error messages
- ✅ **Works offline**: Can cache validation results

---

## 📋 **How It Works**

### **User Flow:**

```
1. User clicks "Upgrade to Career Sprint"
   ↓
2. Redirected to Whop checkout
   ↓
3. User completes payment on Whop
   ↓
4. Whop shows license key: "mem_ABC123XYZ"
   ↓
5. User copies license key
   ↓
6. User returns to CVArchitect
   ↓
7. User pastes license key in "Activate License" modal
   ↓
8. App validates license key with Whop API
   ↓
9. If valid: Activate subscription in Supabase
   ↓
10. User gets unlimited access! 🎉
```

---

## 🔧 **Technical Implementation**

### **1. Whop API Endpoint**

**Endpoint:** `POST https://api.whop.com/api/v2/memberships/{license_key}/validate_license`

**Headers:**
```
Authorization: Bearer {WHOP_API_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "metadata": {
    "user_id": "supabase_user_id",
    "email": "user@example.com",
    "activated_at": "2026-01-20T10:45:00Z"
  }
}
```

**Success Response (201):**
```json
{
  "id": "mem_ABC123XYZ",
  "plan": "plan_DTNT5Oh5vIuPN",
  "user": "user_whop123",
  "email": "user@example.com",
  "status": "active",
  "valid": true,
  "license_key": "mem_ABC123XYZ",
  "metadata": {
    "user_id": "supabase_user_id",
    "email": "user@example.com",
    "activated_at": "2026-01-20T10:45:00Z"
  },
  "renewal_period_start": 1705747200,
  "renewal_period_end": 1706352000,
  "created_at": 1705747200
}
```

**Error Response (400):**
```json
{
  "error": "Invalid license key"
}
```

---

## 💻 **Code Implementation**

### **File Structure:**
```
services/
  ├── whopLicenseService.ts  (NEW - License validation)
  └── subscriptionService.ts (EXISTING - Update subscription)

components/
  ├── LicenseActivationModal.tsx (NEW - UI for entering license)
  └── PricingModal.tsx (UPDATE - Add "Enter License Key" option)
```

---

### **Step 1: Create License Validation Service**

**File:** `services/whopLicenseService.ts`

```typescript
import { supabase } from '../lib/supabase';

const WHOP_API_BASE = 'https://api.whop.com/api/v2';

interface WhopLicenseValidationResponse {
  id: string;
  plan: string;
  user: string;
  email: string;
  status: 'trialing' | 'active' | 'past_due' | 'completed' | 'canceled' | 'expired';
  valid: boolean;
  license_key: string;
  metadata?: Record<string, any>;
  renewal_period_start?: number;
  renewal_period_end?: number;
  expires_at?: number;
  created_at: number;
}

/**
 * Validate a Whop license key and activate subscription
 */
export async function validateAndActivateLicense(
  licenseKey: string,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string; plan?: string }> {
  try {
    // Get API key from environment
    const apiKey = import.meta.env.VITE_WHOP_API_KEY || process.env.WHOP_API_KEY;
    
    if (!apiKey) {
      throw new Error('Whop API key not configured');
    }

    // Validate license key with Whop API
    const response = await fetch(
      `${WHOP_API_BASE}/memberships/${licenseKey}/validate_license`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata: {
            user_id: userId,
            email: userEmail,
            activated_at: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid license key');
    }

    const membership: WhopLicenseValidationResponse = await response.json();

    // Check if license is valid
    if (!membership.valid || membership.status !== 'active') {
      throw new Error('License key is not active or has expired');
    }

    // Map Whop plan to internal plan
    const internalPlan = mapWhopPlanToInternal(membership.plan);

    // Calculate subscription dates
    const subscriptionStart = membership.renewal_period_start 
      ? new Date(membership.renewal_period_start * 1000)
      : new Date();
    
    const subscriptionEnd = membership.renewal_period_end
      ? new Date(membership.renewal_period_end * 1000)
      : membership.expires_at
      ? new Date(membership.expires_at * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

    // Update subscription in Supabase
    const { error: dbError } = await supabase
      .from('subscriptions')
      .update({
        plan_id: internalPlan,
        credits: internalPlan === 'week_pass' ? 999999 : 999999,
        is_active: true,
        subscription_start: subscriptionStart.toISOString(),
        subscription_end: subscriptionEnd.toISOString(),
        whop_membership_id: membership.id,
        whop_plan_id: membership.plan,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (dbError) {
      console.error('Failed to update subscription:', dbError);
      throw new Error('Failed to activate subscription in database');
    }

    return {
      success: true,
      plan: internalPlan,
    };
  } catch (error: any) {
    console.error('License validation failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to validate license key',
    };
  }
}

/**
 * Map Whop plan ID to internal plan ID
 */
function mapWhopPlanToInternal(whopPlanId: string): string {
  // @ts-ignore - Vite env variables
  const SPRINT_PLAN_ID = import.meta.env.VITE_WHOP_SPRINT_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
  // @ts-ignore - Vite env variables
  const MARATHON_PLAN_ID = import.meta.env.VITE_WHOP_MARATHON_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

  if (whopPlanId === SPRINT_PLAN_ID) return 'week_pass';
  if (whopPlanId === MARATHON_PLAN_ID) return 'pro_monthly';
  
  return 'free';
}

/**
 * Check if a license key is already activated
 */
export async function checkLicenseStatus(licenseKey: string): Promise<{
  activated: boolean;
  userId?: string;
  email?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('user_id, users!inner(email)')
      .eq('whop_membership_id', licenseKey)
      .single();

    if (error || !data) {
      return { activated: false };
    }

    return {
      activated: true,
      userId: data.user_id,
      email: (data as any).users?.email,
    };
  } catch (error) {
    return { activated: false };
  }
}
```

---

### **Step 2: Create License Activation Modal**

**File:** `components/LicenseActivationModal.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateAndActivateLicense } from '../services/whopLicenseService';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LicenseActivationModal({
  isOpen,
  onClose,
  onSuccess,
}: LicenseActivationModalProps) {
  const { user } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!user) {
      setError('You must be logged in to activate a license');
      return;
    }

    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setLoading(true);
    setError('');

    const result = await validateAndActivateLicense(
      licenseKey.trim(),
      user.id,
      user.email || ''
    );

    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to activate license');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Activate License Key</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="modal-body">
          <p className="text-gray-600 mb-4">
            Enter the license key you received after purchasing on Whop.
          </p>

          <div className="form-group">
            <label htmlFor="license-key">License Key</label>
            <input
              id="license-key"
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="mem_ABC123XYZ..."
              className="input-field"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="help-text">
            <p>Where to find your license key:</p>
            <ol>
              <li>Check your email from Whop</li>
              <li>Or go to <a href="https://whop.com/hub" target="_blank" rel="noopener noreferrer">whop.com/hub</a></li>
              <li>Click on "CVArchitect"</li>
              <li>Copy your license key</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleActivate} className="btn-primary" disabled={loading}>
            {loading ? 'Activating...' : 'Activate License'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### **Step 3: Update Pricing Modal**

Add "Already have a license key?" option to `PricingModal.tsx`:

```typescript
// Add state
const [showLicenseModal, setShowLicenseModal] = useState(false);

// Add button in modal
<div className="license-key-option">
  <p>Already purchased on Whop?</p>
  <button 
    onClick={() => {
      onClose();
      setShowLicenseModal(true);
    }}
    className="btn-link"
  >
    Enter License Key
  </button>
</div>

// Add modal
<LicenseActivationModal
  isOpen={showLicenseModal}
  onClose={() => setShowLicenseModal(false)}
  onSuccess={() => {
    showToast('License activated successfully!', 'success');
    // Refresh subscription
  }}
/>
```

---

## 🎨 **User Experience**

### **Option 1: New Purchase**
1. User clicks "Upgrade"
2. Clicks "Start My 7-Day Sprint"
3. Redirected to Whop checkout
4. Completes payment
5. Whop shows license key
6. User copies key
7. Returns to app
8. Clicks "Enter License Key"
9. Pastes key
10. Subscription activated!

### **Option 2: Already Purchased**
1. User clicks "Upgrade"
2. Clicks "Already have a license key?"
3. Enters license key
4. Subscription activated!

---

## ⚙️ **Environment Variables**

Add to `.env` and Vercel:

```
# Whop License Key Integration
WHOP_API_KEY=apik_vefUK68yNIZaC_A2024784_C_6e594681319d733d0cf2bd5b6be7478b2e218ae3cc7496833ed853fa2866a2
VITE_WHOP_SPRINT_PLAN_ID=plan_DTNT5Oh5vIuPN
VITE_WHOP_MARATHON_PLAN_ID=plan_h4ga7XhsUpzx9
```

---

## 🚀 **Deployment Checklist**

- [ ] Create `whopLicenseService.ts`
- [ ] Create `LicenseActivationModal.tsx`
- [ ] Update `PricingModal.tsx` to show license option
- [ ] Add `WHOP_API_KEY` to environment variables
- [ ] Test license validation locally
- [ ] Deploy to Vercel
- [ ] Make test purchase on Whop
- [ ] Test license activation
- [ ] Update user documentation

---

## 🎯 **Advantages Over Webhooks**

| Feature | Webhooks | License Keys |
|---------|----------|--------------|
| **Reliability** | Can fail silently | User-controlled, instant feedback |
| **Setup** | Complex server config | Simple API call |
| **Debugging** | Hard to trace failures | Clear error messages |
| **User Control** | Automatic (can fail) | User activates manually |
| **Email Matching** | Required | Not required |
| **Offline Support** | No | Can cache validation |
| **User Experience** | Invisible (when working) | Transparent and clear |

---

## 📝 **Next Steps**

1. **Implement license validation service**
2. **Create activation modal UI**
3. **Update pricing flow**
4. **Test end-to-end**
5. **Deploy and verify**

---

**Status:** 🟢 Ready to implement! This approach is simpler, more reliable, and gives users better control.
