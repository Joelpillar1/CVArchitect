/**
 * Whop Payment Configuration
 * 
 * This file contains the configuration for Whop checkout integration.
 * Plan IDs are stored in environment variables for security.
 */

export const WHOP_CONFIG = {
    // Plan IDs from Whop Dashboard
    SPRINT_PLAN_ID: (import.meta as any).env?.VITE_WHOP_SPRINT_PLAN_ID || 'plan_DTNT5Oh5vIuPN',
    MARATHON_PLAN_ID: (import.meta as any).env?.VITE_WHOP_MARATHON_PLAN_ID || 'plan_h4ga7XhsUpzx9',

    // Checkout URLs
    SPRINT_CHECKOUT_URL: `https://whop.com/checkout/${(import.meta as any).env?.VITE_WHOP_SPRINT_PLAN_ID || 'plan_DTNT5Oh5vIuPN'}`,
    MARATHON_CHECKOUT_URL: `https://whop.com/checkout/${(import.meta as any).env?.VITE_WHOP_MARATHON_PLAN_ID || 'plan_h4ga7XhsUpzx9'}`,
} as const;

/**
 * Opens Whop checkout in a new window
 * @param planId - The Whop plan ID to checkout
 * @param userEmail - Optional user email to pre-fill
 * @param userId - Optional user ID for metadata
 */
export const openWhopCheckout = (
    planId: string,
    userEmail?: string,
    userId?: string
) => {
    // Build checkout URL with optional parameters
    const baseUrl = `https://whop.com/checkout/${planId}`;
    const params = new URLSearchParams();

    if (userEmail) {
        params.append('email', userEmail);
    }

    if (userId) {
        params.append('metadata[user_id]', userId);
    }

    // Add success and cancel URLs
    const currentUrl = window.location.origin;
    params.append('success_url', `${currentUrl}?payment=success&plan=${planId}`);
    params.append('cancel_url', `${currentUrl}?payment=cancelled`);

    const checkoutUrl = params.toString()
        ? `${baseUrl}?${params.toString()}`
        : baseUrl;

    // Open checkout in new window
    const width = 600;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
        checkoutUrl,
        'whop-checkout',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
};

/**
 * Get plan ID by internal plan name
 */
export const getWhopPlanId = (planName: 'week_pass' | 'pro_monthly'): string => {
    switch (planName) {
        case 'week_pass':
            return WHOP_CONFIG.SPRINT_PLAN_ID;
        case 'pro_monthly':
            return WHOP_CONFIG.MARATHON_PLAN_ID;
        default:
            throw new Error(`Unknown plan: ${planName}`);
    }
};
