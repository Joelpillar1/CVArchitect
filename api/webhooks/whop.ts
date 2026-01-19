import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import WhopSDK from '@whop/sdk';

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const event = req.body;
        const { action, data } = event;

        console.log('Received Whop Webhook:', action, data.id);

        // TODO: Verify webhook signature using process.env.WHOP_WEBHOOK_SECRET
        // if (!verifySignature(req)) return res.status(401).json({ error: 'Invalid signature' });

        switch (action) {
            case 'membership_activated':
            case 'payment_succeeded':
                await handleMembershipActive(data);
                break;

            case 'membership_deactivated':
                await handleMembershipInactive(data);
                break;

            default:
                console.log(`Unhandled event type: ${action}`);
        }

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleMembershipActive(data: any) {
    const { user_id, plan_id, id: membership_id, valid, expiration_date } = data;

    // 1. Get user email from Whop payload
    const email = data.email || data.user?.email;

    if (!email) {
        console.error('No email found in webhook data');
        return;
    }

    // 2. Resolve User ID from Email using Supabase Admin Auth
    // We need to find the internal UUID to update the subscriptions table
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users list:', userError);
        throw userError;
    }

    const user = userData.users.find(u => u.email === email);

    if (!user) {
        console.error(`User with email ${email} not found in Supabase Auth`);
        return;
    }

    // Determine internal plan type based on Whop plan_id
    const internalPlanId = mapWhopPlanToInternal(plan_id);

    // 3. Update the SUBSCRIPTIONS table
    const { error } = await supabase
        .from('subscriptions')
        .update({
            whop_membership_id: membership_id,
            whop_plan_id: plan_id,
            plan_id: internalPlanId,
            is_active: true,
            subscription_status: 'active', // If column exists, otherwise just rely on plan_id/is_active
            subscription_end: expiration_date ? new Date(expiration_date * 1000).toISOString() : null,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating user subscription:', error);
        throw error;
    }
}

async function handleMembershipInactive(data: any) {
    const { id: membership_id } = data;

    // Update SUBSCRIPTIONS table based on Whop Membership ID
    const { error } = await supabase
        .from('subscriptions')
        .update({
            is_active: false,
            plan_id: 'free',
            updated_at: new Date().toISOString()
        })
        .eq('whop_membership_id', membership_id);

    if (error) {
        console.error('Error downgrading user subscription:', error);
        throw error;
    }
}

function mapWhopPlanToInternal(whopPlanId: string): string {
    const sprintPlanId = process.env.NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID;
    const marathonPlanId = process.env.NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID;

    if (whopPlanId === sprintPlanId) return 'week_pass';
    if (whopPlanId === marathonPlanId) return 'pro_monthly';
    return 'free';
}
