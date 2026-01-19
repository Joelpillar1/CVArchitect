import { whopSdk, isWhopConfigured } from '../lib/whop-sdk';

/**
 * Create a checkout URL for a Whop plan
 * This is a simplified version - will be updated with actual SDK methods
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
    if (!isWhopConfigured()) {
        throw new Error('Whop is not configured. Please set WHOP_APP_ID and WHOP_API_KEY environment variables.');
    }

    try {
        // For now, return the direct Whop checkout URL with email pre-filled
        // This will be updated once we have the correct SDK API
        const checkoutUrl = `https://whop.com/checkout/${planId}?email=${encodeURIComponent(userEmail)}`;

        console.log('Creating checkout session for:', { planId, userId, userEmail });

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
    const SPRINT_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
    const MARATHON_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

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
    const SPRINT_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
    const MARATHON_PLAN_ID = process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

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
