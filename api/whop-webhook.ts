/**
 * Whop Webhook Handler
 * 
 * This serverless function handles webhook events from Whop when:
 * - A payment is successful
 * - A subscription is created/updated/cancelled
 * - A membership is activated/deactivated
 * 
 * Deployed to: https://cvarchitect.app/api/whop-webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (server-side with service role key)
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // We'll need to add this
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Whop webhook secret for signature verification
const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET!;

/**
 * Verify webhook signature from Whop
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
    // TODO: Implement Whop signature verification
    // For now, we'll skip verification in development
    // In production, you MUST verify the signature
    if (process.env.NODE_ENV === 'production' && !WHOP_WEBHOOK_SECRET) {
        console.error('WHOP_WEBHOOK_SECRET not set in production!');
        return false;
    }

    // Whop uses HMAC SHA-256 for signature verification
    // The signature is in the 'x-whop-signature' header
    // We'll implement this after getting the secret from Whop

    return true; // Temporarily allow all webhooks for testing
}

/**
 * Map Whop plan ID to internal plan ID
 */
function mapWhopPlanToInternal(whopPlanId: string): string {
    const planMapping: Record<string, string> = {
        'plan_DTNT5Oh5vIuPN': 'week_pass',      // Career Sprint (NEWEST)
        'plan_FPwExhvfWN9OH': 'week_pass',      // Career Sprint (NEW)
        'plan_Sr2CjRgtctFpD': 'week_pass',      // Career Sprint (OLD - for backwards compatibility)
        'plan_h4ga7XhsUpzx9': 'pro_monthly',    // Career Marathon
    };

    return planMapping[whopPlanId] || 'free';
}

/**
 * Calculate subscription end date based on plan
 */
function calculateSubscriptionEnd(planId: string): Date {
    const now = new Date();

    if (planId === 'week_pass') {
        // 7 days from now
        now.setDate(now.getDate() + 7);
    } else if (planId === 'pro_monthly') {
        // 1 month from now
        now.setMonth(now.getMonth() + 1);
    }

    return now;
}

/**
 * Get credits for a plan
 */
function getCreditsForPlan(planId: string): number {
    const creditMapping: Record<string, number> = {
        'week_pass': 999999,    // Unlimited for 7 days
        'pro_monthly': 9999,    // Unlimited monthly
        'free': 10,             // Free tier
    };

    return creditMapping[planId] || 10;
}

/**
 * Main webhook handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get webhook signature from headers
        const signature = req.headers['x-whop-signature'] as string;
        const payload = JSON.stringify(req.body);

        // Verify webhook signature
        if (!verifyWebhookSignature(payload, signature)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Parse webhook event
        const event = req.body;
        const eventType = event.action || event.type;

        console.log('Received Whop webhook:', eventType, event);

        // Handle different event types
        switch (eventType) {
            case 'membership_activated':
            case 'payment_succeeded':
            case 'invoice_paid':
                await handlePaymentSuccess(event);
                break;

            case 'membership_deactivated':
            case 'payment_failed':
            case 'refund_created':
                await handleSubscriptionCancelled(event);
                break;

            default:
                console.log('Unhandled webhook event type:', eventType);
        }

        // Always return 200 to acknowledge receipt
        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
}

/**
 * Handle successful payment and grant access
 */
async function handlePaymentSuccess(event: any) {
    try {
        // Extract data from Whop webhook
        const membershipId = event.data?.id || event.id;
        const userEmail = event.data?.email || event.email;
        const whopPlanId = event.data?.plan_id || event.plan_id;
        const userId = event.data?.metadata?.user_id; // We pass this during checkout

        console.log('Processing payment success:', {
            membershipId,
            userEmail,
            whopPlanId,
            userId
        });

        // Map Whop plan to internal plan
        const internalPlanId = mapWhopPlanToInternal(whopPlanId);
        const credits = getCreditsForPlan(internalPlanId);
        const subscriptionEnd = calculateSubscriptionEnd(internalPlanId);

        // Find user by email if userId not provided
        let targetUserId = userId;
        if (!targetUserId && userEmail) {
            const { data: authUser } = await supabase.auth.admin.listUsers();
            const user = authUser?.users?.find(u => u.email === userEmail);
            targetUserId = user?.id;
        }

        if (!targetUserId) {
            console.error('Could not find user for email:', userEmail);
            return;
        }

        // Update or create subscription
        const { error: upsertError } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: targetUserId,
                plan_id: internalPlanId,
                credits: credits,
                billing_cycle: internalPlanId === 'week_pass' ? 'lifetime' : 'monthly',
                subscription_start: new Date().toISOString(),
                subscription_end: subscriptionEnd.toISOString(),
                is_active: true,
                whop_membership_id: membershipId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (upsertError) {
            console.error('Error updating subscription:', upsertError);
            throw upsertError;
        }

        console.log('Successfully granted access to user:', targetUserId);

        // TODO: Send confirmation email to user

    } catch (error) {
        console.error('Error handling payment success:', error);
        throw error;
    }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(event: any) {
    try {
        const membershipId = event.data?.id || event.id;

        console.log('Processing subscription cancellation:', membershipId);

        // Find subscription by Whop membership ID
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('whop_membership_id', membershipId)
            .single();

        if (!subscription) {
            console.error('Subscription not found for membership:', membershipId);
            return;
        }

        // Revert to free plan
        const { error } = await supabase
            .from('subscriptions')
            .update({
                plan_id: 'free',
                credits: 10,
                billing_cycle: null,
                is_active: false,
                subscription_end: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', subscription.user_id);

        if (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }

        console.log('Successfully cancelled subscription for user:', subscription.user_id);

    } catch (error) {
        console.error('Error handling subscription cancellation:', error);
        throw error;
    }
}
