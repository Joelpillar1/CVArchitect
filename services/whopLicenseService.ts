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
        // @ts-ignore - Vite env variables
        const apiKey = import.meta.env.VITE_WHOP_API_KEY || process.env.WHOP_API_KEY;

        if (!apiKey) {
            throw new Error('Whop API key not configured');
        }

        console.log('Validating license key:', { licenseKey, userId, userEmail });

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
            const error = await response.json().catch(() => ({ message: 'Invalid license key' }));
            throw new Error(error.message || 'Invalid license key');
        }

        const membership: WhopLicenseValidationResponse = await response.json();

        console.log('License validation response:', membership);

        // Check if license is valid
        if (!membership.valid) {
            throw new Error('License key is not valid');
        }

        if (membership.status !== 'active' && membership.status !== 'trialing') {
            throw new Error(`License key status is ${membership.status}. Only active licenses can be activated.`);
        }

        // Map Whop plan to internal plan
        const internalPlan = mapWhopPlanToInternal(membership.plan);

        if (internalPlan === 'free') {
            throw new Error('This license key is not for a valid plan');
        }

        // Calculate subscription dates
        const subscriptionStart = membership.renewal_period_start
            ? new Date(membership.renewal_period_start * 1000)
            : new Date();

        const subscriptionEnd = membership.renewal_period_end
            ? new Date(membership.renewal_period_end * 1000)
            : membership.expires_at
                ? new Date(membership.expires_at * 1000)
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

        console.log('Activating subscription:', {
            internalPlan,
            subscriptionStart,
            subscriptionEnd,
            whopMembershipId: membership.id,
        });

        // Update subscription in Supabase
        const { error: dbError } = await supabase
            .from('subscriptions')
            .update({
                plan_id: internalPlan,
                credits: 999999, // Unlimited credits for paid plans
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

        console.log('Subscription activated successfully!');

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

    console.log('Mapping Whop plan:', { whopPlanId, SPRINT_PLAN_ID, MARATHON_PLAN_ID });

    if (whopPlanId === SPRINT_PLAN_ID) return 'week_pass';
    if (whopPlanId === MARATHON_PLAN_ID) return 'pro_monthly';

    return 'free';
}

/**
 * Check if a license key is already activated by another user
 */
export async function checkLicenseStatus(licenseKey: string): Promise<{
    activated: boolean;
    userId?: string;
    email?: string;
}> {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('whop_membership_id', licenseKey)
            .maybeSingle();

        if (error) {
            console.error('Error checking license status:', error);
            return { activated: false };
        }

        if (!data) {
            return { activated: false };
        }

        // Get user email
        const { data: userData } = await supabase
            .from('auth.users')
            .select('email')
            .eq('id', data.user_id)
            .single();

        return {
            activated: true,
            userId: data.user_id,
            email: userData?.email,
        };
    } catch (error) {
        console.error('Error checking license status:', error);
        return { activated: false };
    }
}
