import { UserSubscription, FeatureAction, UsageRecord, PlanId } from '../types/pricing';
import { PLANS, isPro, canAccessTemplate } from './pricingConfig';

// ========================================================
// SUBSCRIPTION MANAGER
// ========================================================

export class SubscriptionManager {
    private subscription: UserSubscription;

    constructor(subscription: UserSubscription) {
        this.subscription = subscription;
    }

    // ========================================================
    // CORE FUNCTIONS
    // ========================================================

    /**
     * Get current user plan
     */
    getUserPlan(): UserSubscription['planId'] {
        return this.subscription.planId;
    }

    /**
     * Get current credit balance
     */
    getCreditBalance(): number {
        return this.subscription.credits;
    }

    /**
     * Check if user is on Pro plan (unlimited access)
     */
    isPro(): boolean {
        return isPro(this.subscription.planId);
    }

    /**
     * Check if user can use a specific feature
     */
    canUseFeature(feature: FeatureAction): { allowed: boolean; reason?: string } {
        // Legacy plans (week_pass, pro_monthly) are not in the PLANS config object
        // but are still valid paid plans — grant full access before plan lookup.
        if (this.isPro()) {
            // Pro / legacy-paid users have unlimited access to all AI features
            // (feature-gated items like pdf_export are still allowed on paid plans)
            return { allowed: true };
        }

        const plan = PLANS[this.subscription.planId];
        if (!plan) {
            return { allowed: false, reason: 'Invalid plan' };
        }

        switch (feature) {
            case 'resume_upload':
                if (this.isPro() || plan.features.resumeUploads === 'unlimited') {
                    return { allowed: true };
                }
                const uploadCount = this.getUsageCount('resume_upload');
                if (uploadCount >= (plan.features.resumeUploads as number)) {
                    return { 
                        allowed: false, 
                        reason: 'You have used your 1 free resume import. Upgrade to Build for unlimited resume imports.' 
                    };
                }
                return { allowed: true };

            case 'resume_analysis':
                if (this.isPro() || plan.features.resumeAnalyses === 'unlimited') return { allowed: true };
                const analysisCount = this.getUsageCount('resume_analysis');
                if (analysisCount >= (plan.features.resumeAnalyses as number)) {
                    return { allowed: false, reason: 'Analysis limit reached. Upgrade for unlimited analyses.' };
                }
                return { allowed: true };

            case 'job_match':
                if (this.isPro() || plan.features.jobMatches === 'unlimited') return { allowed: true };
                const matchCount = this.getUsageCount('job_match');
                if (matchCount >= (plan.features.jobMatches as number)) {
                    return { 
                        allowed: false, 
                        reason: 'You have used your 1 free job tailoring pass. Upgrade to Build for unlimited job matching.' 
                    };
                }
                return { allowed: true };

            case 'cover_letter':
                if (this.isPro()) return { allowed: true };
                return { 
                    allowed: false, 
                    reason: 'Cover letter generation is a Pro feature. Upgrade to Build or Lifetime.' 
                };

            case 'ai_rewrite':
            case 'cv_regeneration':
            case 'bullet_optimization':
            case 'keywordEnhancement':
                if (this.isPro()) return { allowed: true };

                // Check credit balance (free tier gets 10 credits)
                if (this.subscription.credits <= 0) {
                    return {
                        allowed: false,
                        reason: 'You have used your 10 free AI rewrites. Upgrade to Build or Lifetime for unlimited AI rewrites.'
                    };
                }

                return { allowed: true };

            case 'pdf_export':
                if (this.isPro()) return { allowed: true };
                if (!plan.features.pdfExport) {
                    return { allowed: false, reason: 'Upgrade to export your resume as PDF.' };
                }
                const pdfLimit = typeof plan.features.pdfExports === 'number' ? plan.features.pdfExports : 3;
                const pdfCount = this.getUsageCount('pdf_export');
                if (pdfCount >= pdfLimit) {
                    return {
                        allowed: false,
                        reason: `You have used all ${pdfLimit} free PDF downloads. Upgrade to Build for unlimited downloads.`
                    };
                }
                return { allowed: true };

            case 'docx_export':
                if (this.isPro()) return { allowed: true };
                return {
                    allowed: false,
                    reason: 'Word (.DOCX) export is a Pro feature. Upgrade to Build or Lifetime to download editable Word documents.'
                };

            case 'template_access':
                // This is checked separately via canAccessTemplate
                return { allowed: true };

            default:
                return { allowed: false, reason: 'Unknown feature' };
        }
    }

    /**
     * Deduct credits for an action
     */
    deductCredit(action: FeatureAction): { success: boolean; remainingCredits: number; error?: string } {
        // Legacy paid plans (week_pass, pro_monthly) are not in PLANS config —
        // treat them as unlimited (no credit cost).
        if (this.isPro()) {
            this.logUsage(action, 0);
            return { success: true, remainingCredits: this.subscription.credits };
        }

        const plan = PLANS[this.subscription.planId];
        if (!plan) {
            return { success: false, remainingCredits: this.subscription.credits, error: 'Invalid plan' };
        }


        // Get credit cost for action
        let cost = 0;
        switch (action) {
            case 'ai_rewrite':
                cost = plan.creditRules.creditCosts.fullRewrite;
                break;
            case 'cv_regeneration':
                cost = plan.creditRules.creditCosts.cvRegeneration;
                break;
            case 'cover_letter':
                cost = plan.creditRules.creditCosts.coverLetter;
                break;
            case 'resume_upload':
                cost = plan.creditRules.creditCosts.resumeUpload;
                break;
            case 'bullet_optimization':
                cost = plan.creditRules.creditCosts.bulletOptimization;
                break;
            default:
                cost = 0;
        }

        // If plan doesn't use credits, treat as free action but still log usage
        if (!plan.creditRules.usesCredits || this.isPro()) {
            this.logUsage(action, 0);
            return { success: true, remainingCredits: this.subscription.credits };
        }

        // Check if enough credits for credit-based plans (Free)
        if (this.subscription.credits < cost) {
            return {
                success: false,
                remainingCredits: this.subscription.credits,
                error: 'Insufficient credits'
            };
        }

        // Deduct credits
        this.subscription.credits = Math.max(0, this.subscription.credits - cost);

        // Log usage
        this.logUsage(action, cost);

        return { success: true, remainingCredits: this.subscription.credits };
    }

    /**
     * Add credits to user account
     */
    addCredits(amount: number): number {
        this.subscription.credits += amount;
        return this.subscription.credits;
    }

    /**
     * Reset monthly credits (for Basic plan)
     */
    resetMonthlyCredits(): void {
        const plan = PLANS[this.subscription.planId];
        if (plan && plan.creditRules.creditsReset && plan.creditRules.monthlyCredits) {
            this.subscription.credits = plan.creditRules.monthlyCredits;
            this.logUsage('credit_reset', 0);
        }
    }

    /**
     * Check if user can access a specific template
     */
    canAccessTemplate(templateId: string): boolean {
        return canAccessTemplate(this.subscription.planId, templateId);
    }

    /**
     * Log usage action
     */
    private logUsage(action: string, creditsCost: number): void {
        const record: UsageRecord = {
            timestamp: new Date(),
            action,
            creditsCost,
            remainingCredits: this.subscription.credits,
        };
        // Stored/legacy subscription objects may lack usageHistory — initialize
        // lazily instead of throwing mid-flow (e.g. right after a PDF export).
        if (!Array.isArray(this.subscription.usageHistory)) {
            this.subscription.usageHistory = [];
        }
        this.subscription.usageHistory.unshift(record);
    }

    /**
     * Get usage count for a specific action
     */
    getUsageCount(action: string): number {
        const history = this.subscription?.usageHistory;
        return Array.isArray(history) ? history.filter(record => record.action === action).length : 0;
    }

    /**
     * Get updated subscription object
     */
    getSubscription(): UserSubscription {
        return this.subscription;
    }
}

// ========================================================
// HELPER FUNCTIONS FOR FRONTEND
// ========================================================

/**
 * Create a new user subscription (default: FREE plan)
 */
export const createDefaultSubscription = (userId: string): UserSubscription => {
    return {
        userId,
        planId: 'free',
        credits: 10,
        isActive: true,
        usageHistory: [],
    };
};

/**
 * Upgrade user to a new plan
 */
export const upgradePlan = (
    subscription: UserSubscription,
    newPlanId: PlanId,
    billingCycle?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime'
): UserSubscription => {
    const newPlan = PLANS[newPlanId];
    if (!newPlan) return subscription;

    const now = Date.now();
    let subscriptionEnd: Date | undefined;

    if (newPlanId === 'sprint') {
        subscriptionEnd = new Date(now + 7 * 24 * 60 * 60 * 1000);
    } else if (newPlanId === 'build') {
        subscriptionEnd = new Date(now);
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    } else if (newPlanId === 'blueprint') {
        subscriptionEnd = new Date(now);
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3);
    }

    return {
        ...subscription,
        planId: newPlanId,
        credits: newPlan.creditRules.startingCredits,
        billingCycle,
        subscriptionStart: new Date(),
        subscriptionEnd,
        isActive: true,
    };
};
