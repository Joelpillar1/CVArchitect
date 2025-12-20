import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types/pricing';

/**
 * Subscription Service - Manages user subscriptions
 */

export const subscriptionService = {
    async getSubscription(userId: string): Promise<UserSubscription | null> {
        try {
            // Fetch subscription and usage data in parallel
            const [subResult, logsResult, statsResult] = await Promise.all([
                supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .single(),
                supabase
                    .from('usage_logs')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(50),
                supabase
                    .from('usage_logs')
                    .select('credits_cost', { count: 'exact' })
                    .eq('user_id', userId)
            ]);

            if (subResult.error) throw subResult.error;

            const subscription = subResult.data;

            // Map usage logs to UsageRecord format
            const usageHistory = (logsResult.data || []).map((log: any) => ({
                action: log.action,
                creditsCost: log.credits_cost,
                remainingCredits: log.remaining_credits,
                timestamp: new Date(log.created_at)
            }));

            // Calculate total credits used
            const totalCreditsUsed = (statsResult.data || []).reduce((sum: number, log: any) => sum + (log.credits_cost || 0), 0);
            const totalActions = statsResult.count || 0;

            return {
                userId: subscription.user_id,
                planId: subscription.plan_id,
                credits: subscription.credits,
                billingCycle: subscription.billing_cycle,
                subscriptionStart: subscription.subscription_start ? new Date(subscription.subscription_start) : undefined,
                subscriptionEnd: subscription.subscription_end ? new Date(subscription.subscription_end) : undefined,
                isActive: subscription.is_active,
                usageHistory,
                usageStats: {
                    totalActions,
                    totalCreditsUsed
                }
            } as UserSubscription;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }
    },

    async getUsageLogs(userId: string): Promise<any[]> {
        // Stub - return empty array for now
        return [];
    },

    async getUsageTotals(userId: string): Promise<any> {
        // Stub - return default values
        return {
            ai_credits_used: 0,
            templates_used: 0,
            job_matches_used: 0,
        };
    },

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

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    },

    async deductCredits(userId: string, amount: number): Promise<void> {
        try {
            // Get current subscription
            const { data: sub, error: fetchError } = await supabase
                .from('subscriptions')
                .select('credits')
                .eq('user_id', userId)
                .single();

            if (fetchError) throw fetchError;

            const newCredits = Math.max(0, (sub?.credits || 0) - amount);

            // Update credits
            const { error: updateError } = await supabase
                .from('subscriptions')
                .update({
                    credits: newCredits,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;
        } catch (error) {
            console.error('Error deducting credits:', error);
            throw error;
        }
    },

    async performAction(
        userId: string,
        action: string,
        creditsUsed: number
    ): Promise<{ success: boolean; newCredits: number }> {
        try {
            // Get current subscription
            const { data: sub, error: fetchError } = await supabase
                .from('subscriptions')
                .select('credits')
                .eq('user_id', userId)
                .single();

            if (fetchError) throw fetchError;

            const newCredits = Math.max(0, (sub?.credits || 0) - creditsUsed);

            // Update credits
            const { error: updateError } = await supabase
                .from('subscriptions')
                .update({
                    credits: newCredits,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            // Log usage
            const { error: logError } = await supabase
                .from('usage_logs')
                .insert({
                    user_id: userId,
                    action: action,
                    credits_cost: creditsUsed,
                    remaining_credits: newCredits,
                    created_at: new Date().toISOString(),
                });

            if (logError) {
                console.error('Error logging usage:', logError);
                // Don't throw - credits were already deducted
            }

            return { success: true, newCredits };
        } catch (error) {
            console.error('Error performing action:', error);
            return { success: false, newCredits: 0 };
        }
    },
};
