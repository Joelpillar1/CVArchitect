import { supabase } from '../utils/supabase';

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'expired' | 'past_due';
    current_period_start: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
    payment_method_last4: string | null;
    payment_method_brand: string | null;
    ai_credits: number;
    export_credits: number;
    metadata: Record<string, any>;
}

export interface BillingHistoryItem {
    id: string;
    user_id: string;
    subscription_id: string | null;
    amount: number;
    currency: string;
    status: 'succeeded' | 'failed' | 'pending' | 'refunded';
    description: string | null;
    invoice_url: string | null;
    receipt_url: string | null;
    created_at: string;
    payment_method_last4: string | null;
    payment_method_brand: string | null;
    metadata: Record<string, any>;
}

export interface UsageTracking {
    id: string;
    user_id: string;
    feature: string;
    count: number;
    period_start: string;
    period_end: string;
    created_at: string;
}

export const subscriptionService = {
    /**
     * Get user's subscription
     */
    async getSubscription(userId: string): Promise<Subscription | null> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No subscription found
            throw error;
        }
        return data as Subscription;
    },

    /**
     * Update subscription plan
     */
    /**
     * Update subscription plan
     */
    async updatePlan(userId: string, newPlanId: string): Promise<Subscription> {
        const { data, error } = await supabase.rpc('update_subscription_plan', {
            p_user_id: userId,
            p_new_plan_id: newPlanId
        });

        if (error) throw error;
        return data as Subscription;
    },

    /**
     * Cancel subscription (at period end)
     */
    async cancelSubscription(userId: string): Promise<Subscription> {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                cancel_at_period_end: true,
                cancelled_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Subscription;
    },

    /**
     * Reactivate cancelled subscription
     */
    async reactivateSubscription(userId: string): Promise<Subscription> {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                cancel_at_period_end: false,
                cancelled_at: null,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Subscription;
    },

    /**
     * Get billing history
     */
    async getBillingHistory(userId: string, limit: number = 10): Promise<BillingHistoryItem[]> {
        const { data, error } = await supabase
            .from('billing_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as BillingHistoryItem[];
    },

    /**
     * Add billing record
     */
    async addBillingRecord(record: Partial<BillingHistoryItem>): Promise<BillingHistoryItem> {
        const { data, error } = await supabase
            .from('billing_history')
            .insert(record)
            .select()
            .single();

        if (error) throw error;
        return data as BillingHistoryItem;
    },

    /**
     * Track feature usage
     */
    async trackUsage(userId: string, feature: string): Promise<void> {
        const { error } = await supabase.rpc('track_usage', {
            p_user_id: userId,
            p_feature: feature,
        });

        if (error) throw error;
    },

    /**
     * Get current usage for a feature
     */
    async getUsage(userId: string, feature: string): Promise<number> {
        const periodStart = new Date();
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('usage_tracking')
            .select('count')
            .eq('user_id', userId)
            .eq('feature', feature)
            .gte('period_start', periodStart.toISOString())
            .single();

        if (error) {
            if (error.code === 'PGRST116') return 0; // No usage found
            throw error;
        }

        return data?.count || 0;
    },

    /**
     * Get all usage for current period
     */
    async getAllUsage(userId: string): Promise<Record<string, number>> {
        const periodStart = new Date();
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('usage_tracking')
            .select('feature, count')
            .eq('user_id', userId)
            .gte('period_start', periodStart.toISOString());

        if (error) throw error;

        const usage: Record<string, number> = {};
        data?.forEach((item) => {
            usage[item.feature] = item.count;
        });

        return usage;
    },

    /**
     * Check if user can use a feature (based on limits)
     */
    async canUseFeature(userId: string, feature: string, limit: number): Promise<boolean> {
        const { data, error } = await supabase.rpc('check_usage_limit', {
            p_user_id: userId,
            p_feature: feature,
            p_limit: limit,
        });

        if (error) throw error;
        return data as boolean;
    },

    /**
     * Add credits to subscription
     */
    async addCredits(
        userId: string,
        aiCredits: number = 0,
        exportCredits: number = 0
    ): Promise<Subscription> {
        // Get current subscription
        const subscription = await this.getSubscription(userId);
        if (!subscription) throw new Error('No subscription found');

        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                ai_credits: subscription.ai_credits + aiCredits,
                export_credits: subscription.export_credits + exportCredits,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Subscription;
    },

    /**
     * Deduct credits from subscription
     */
    async deductCredits(
        userId: string,
        aiCredits: number = 0,
        exportCredits: number = 0
    ): Promise<Subscription> {
        // Get current subscription
        const subscription = await this.getSubscription(userId);
        if (!subscription) throw new Error('No subscription found');

        if (subscription.ai_credits < aiCredits || subscription.export_credits < exportCredits) {
            throw new Error('Insufficient credits');
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                ai_credits: subscription.ai_credits - aiCredits,
                export_credits: subscription.export_credits - exportCredits,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Subscription;
    },

    /**
     * Get subscription stats
     */
    async getSubscriptionStats(userId: string): Promise<{
        subscription: Subscription | null;
        usage: Record<string, number>;
        billingHistory: BillingHistoryItem[];
        daysRemaining: number | null;
    }> {
        const [subscription, usage, billingHistory] = await Promise.all([
            this.getSubscription(userId),
            this.getAllUsage(userId),
            this.getBillingHistory(userId, 5),
        ]);

        let daysRemaining: number | null = null;
        if (subscription?.current_period_end) {
            const endDate = new Date(subscription.current_period_end);
            const now = new Date();
            daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
            subscription,
            usage,
            billingHistory,
            daysRemaining,
        };
    },
};
