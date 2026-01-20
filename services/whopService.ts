import { whopSdk, isWhopConfigured } from '../lib/whop-sdk';

/**
 * Create a checkout URL for a Whop plan
 * @param planId - Whop plan ID (e.g., plan_xxxxx)
 * @param userId - Internal user ID
 * @param userEmail - User's email address
 * @returns Checkout URL to redirect user to
 */
export async function createCheckoutSession(
    planId: string,
    userId: string,
    userEmail: string
): Promise<string> {
    // For client-side checkout, we don't need the API key
    // We just need the plan ID to construct the checkout URL
    if (!planId) {
        throw new Error('Plan ID is required for checkout.');
    }

    try {
        // Get the current origin for redirect URLs
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cvarchitect.app';

        // Construct Whop checkout URL with success/cancel redirects
        // After successful payment, redirect to activation page
        const successUrl = `${origin}/activate-license`;
        const cancelUrl = `${origin}/pricing`;

        const checkoutUrl = `https://whop.com/checkout/${planId}?` +
            `email=${encodeURIComponent(userEmail)}&` +
            `success_url=${encodeURIComponent(successUrl)}&` +
            `cancel_url=${encodeURIComponent(cancelUrl)}`;

        console.log('Creating checkout session for:', {
            planId,
            userId,
            userEmail,
            checkoutUrl,
            successUrl,
            cancelUrl
        });

        return checkoutUrl;
    } catch (error) {
        console.error('Whop checkout creation failed:', error);
        throw new Error('Failed to create checkout session. Please try again.');
    }
}

/**
 * Check if user has active Whop membership
 * @param whopUserId - Whop user ID
 * @returns Boolean indicating if user has active access
 */
export async function checkUserMembership(whopUserId: string): Promise<boolean> {
    if (!isWhopConfigured()) {
        console.warn('Whop not configured, skipping membership check');
        return false;
    }

    try {
        // TODO: Implement with actual SDK method once API is confirmed
        console.log('Checking membership for:', whopUserId);
        return false;
    } catch (error) {
        console.error('Whop access check failed:', error);
        return false;
    }
}

/**
 * Get user's membership details from Whop
 * @param membershipId - Whop membership ID
 * @returns Membership object or null if not found
 */
export async function getUserMembership(membershipId: string): Promise<any | null> {
    if (!isWhopConfigured()) {
        console.warn('Whop not configured, skipping membership retrieval');
        return null;
    }

    try {
        // TODO: Implement with actual SDK method once API is confirmed
        console.log('Retrieving membership:', membershipId);
        return null;
    } catch (error) {
        console.error('Failed to retrieve membership:', error);
        return null;
    }
}

/**
 * Map Whop plan ID to internal CVArchitect plan ID
 * @param whopPlanId - Whop plan ID
 * @returns Internal plan ID ('free', 'week_pass', or 'pro_monthly')
 */
export function mapWhopPlanToInternal(whopPlanId: string): string {
    // @ts-ignore - Vite env variables
    const SPRINT_PLAN_ID = import.meta.env.VITE_WHOP_SPRINT_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
    // @ts-ignore - Vite env variables
    const MARATHON_PLAN_ID = import.meta.env.VITE_WHOP_MARATHON_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

    if (whopPlanId === SPRINT_PLAN_ID) return 'week_pass';
    if (whopPlanId === MARATHON_PLAN_ID) return 'pro_monthly';

    // Default to free if unknown plan
    return 'free';
}

/**
 * Map internal CVArchitect plan ID to Whop plan ID
 * @param internalPlanId - Internal plan ID
 * @returns Whop plan ID or null if not a paid plan
 */
export function mapInternalPlanToWhop(internalPlanId: string): string | null {
    // @ts-ignore - Vite env variables
    const SPRINT_PLAN_ID = import.meta.env.VITE_WHOP_SPRINT_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
    // @ts-ignore - Vite env variables
    const MARATHON_PLAN_ID = import.meta.env.VITE_WHOP_MARATHON_PLAN_ID || process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

    if (internalPlanId === 'week_pass') return SPRINT_PLAN_ID || null;
    if (internalPlanId === 'pro_monthly') return MARATHON_PLAN_ID || null;

    // Free plan doesn't have a Whop equivalent
    return null;
}

/**
 * Get plan name for display
 * @param planId - Internal or Whop plan ID
 * @returns Human-readable plan name
 */
export function getPlanDisplayName(planId: string): string {
    const internalPlanId = planId.startsWith('plan_')
        ? mapWhopPlanToInternal(planId)
        : planId;

    switch (internalPlanId) {
        case 'week_pass':
            return 'Career Sprint';
        case 'pro_monthly':
            return 'Career Marathon';
        case 'free':
        default:
            return 'Free Tier';
    }
}
