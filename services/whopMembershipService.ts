/**
 * Whop Membership Verification Service
 * 
 * Checks if a user has an active Whop membership and grants access accordingly.
 * This is more reliable than webhooks for ensuring users get access.
 */

const WHOP_API_KEY = (import.meta as any).env?.VITE_WHOP_API_KEY;
const WHOP_COMPANY_ID = 'biz_9h9h8iTu9euuKx'; // Your Whop company ID

export interface WhopMembership {
    id: string;
    status: 'active' | 'completed' | 'cancelled' | 'expired';
    plan: {
        id: string;
        name?: string;
    };
    user: {
        id: string;
        email: string;
        name?: string;
    };
    valid: boolean;
    cancel_at_period_end: boolean;
    created_at: string;
}

/**
 * Check if a user has an active Whop membership by email
 */
export async function checkWhopMembership(userEmail: string): Promise<WhopMembership | null> {
    try {
        console.log('Checking Whop membership for:', userEmail);

        // Call Whop API to get all memberships for your company
        const response = await fetch(`https://api.whop.com/api/v2/memberships?company_id=${WHOP_COMPANY_ID}`, {
            headers: {
                'Authorization': `Bearer ${WHOP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Whop API error:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Whop API response:', data);

        // Find membership for this user's email
        const memberships = data.data || [];
        const userMembership = memberships.find((m: any) =>
            m.user?.email?.toLowerCase() === userEmail.toLowerCase() &&
            (m.status === 'active' || m.status === 'completed') &&
            m.valid === true
        );

        if (userMembership) {
            console.log('✅ Found active Whop membership:', userMembership.id);
            return {
                id: userMembership.id,
                status: userMembership.status,
                plan: {
                    id: userMembership.plan?.id || '',
                    name: userMembership.plan?.name
                },
                user: {
                    id: userMembership.user?.id || '',
                    email: userMembership.user?.email || userEmail,
                    name: userMembership.user?.name
                },
                valid: userMembership.valid,
                cancel_at_period_end: userMembership.cancel_at_period_end || false,
                created_at: userMembership.created_at
            };
        }

        console.log('❌ No active Whop membership found for:', userEmail);
        return null;

    } catch (error) {
        console.error('Error checking Whop membership:', error);
        return null;
    }
}

/**
 * Map Whop plan ID to internal plan ID
 */
export function mapWhopPlanToInternal(whopPlanId: string): 'week_pass' | 'pro_monthly' | 'free' {
    const planMapping: Record<string, 'week_pass' | 'pro_monthly'> = {
        'plan_DTNT5Oh5vIuPN': 'week_pass',      // Career Sprint
        'plan_FPwExhvfWN9OH': 'week_pass',      // Career Sprint (old)
        'plan_Sr2CjRgtctFpD': 'week_pass',      // Career Sprint (oldest)
        'plan_h4ga7XhsUpzx9': 'pro_monthly',    // Career Marathon
    };

    return planMapping[whopPlanId] || 'free';
}

/**
 * Get credits for a plan
 */
export function getCreditsForPlan(planId: 'week_pass' | 'pro_monthly' | 'free'): number {
    const creditsMap = {
        'week_pass': 999999,      // Unlimited for week pass
        'pro_monthly': 9999,      // High limit for monthly
        'free': 10                // Limited for free
    };

    return creditsMap[planId];
}

/**
 * Calculate subscription end date
 */
export function calculateSubscriptionEnd(planId: 'week_pass' | 'pro_monthly' | 'free'): Date {
    const now = new Date();

    if (planId === 'week_pass') {
        // 7 days from now
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (planId === 'pro_monthly') {
        // 30 days from now
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
        // Free tier - no expiration
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
}

/**
 * Sync user's Whop membership to Supabase
 * Call this on login or periodically
 */
export async function syncWhopMembership(
    userId: string,
    userEmail: string,
    supabase: any
): Promise<{ success: boolean; membership?: WhopMembership; error?: string }> {
    try {
        console.log('Syncing Whop membership for user:', userId, userEmail);

        // Check if user has active Whop membership
        const membership = await checkWhopMembership(userEmail);

        if (!membership) {
            console.log('No Whop membership found - keeping current subscription');
            return { success: true };
        }

        // Map Whop plan to internal plan
        const internalPlanId = mapWhopPlanToInternal(membership.plan.id);
        const credits = getCreditsForPlan(internalPlanId);
        const subscriptionEnd = calculateSubscriptionEnd(internalPlanId);

        console.log('Granting access:', { internalPlanId, credits });

        // Update subscription in Supabase
        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan_id: internalPlanId,
                credits: credits,
                billing_cycle: internalPlanId === 'week_pass' ? 'lifetime' : 'monthly',
                subscription_start: new Date().toISOString(),
                subscription_end: subscriptionEnd.toISOString(),
                is_active: true,
                whop_membership_id: membership.id,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error updating subscription:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Successfully synced Whop membership!');
        return { success: true, membership };

    } catch (error) {
        console.error('Error syncing Whop membership:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
