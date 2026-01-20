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
    getUserPlan(): PlanId {
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
        const plan = PLANS[this.subscription.planId];
        if (!plan) {
            return { allowed: false, reason: 'Invalid plan' };
        }

        switch (feature) {
            case 'resume_upload':
                // Check if Pro (Unlimited)
                if (plan.features.resumeUploads === 'unlimited') {
                    // But if plan uses credits (Basic), we might still want to charge?
                    // The business logic says: Paid users (Basic) pay 1 credit.
                    // If plan uses credits, check if they have enough
                    if (plan.creditRules.usesCredits && plan.creditRules.creditCosts.resumeUpload > 0) {
                        if (this.subscription.credits < plan.creditRules.creditCosts.resumeUpload) {
                            return { allowed: false, reason: 'Insufficient credits for AI Resume Parsing.' };
                        }
                        return { allowed: true };
                    }
                    return { allowed: true };
                }

                // For Free plan (limited count)
                const uploadCount = this.getUsageCount('resume_upload');
                if (uploadCount >= plan.features.resumeUploads) {
                    return { allowed: false, reason: 'Upload limit reached. Upgrade to continue.' };
                }
                return { allowed: true };

            case 'resume_analysis':
                if (plan.features.resumeAnalyses === 'unlimited') return { allowed: true };
                const analysisCount = this.getUsageCount('resume_analysis');
                if (analysisCount >= plan.features.resumeAnalyses) {
                    return { allowed: false, reason: 'Analysis limit reached. Upgrade for unlimited analyses.' };
                }
                return { allowed: true };

            case 'job_match':
                if (plan.features.jobMatches === 'unlimited') return { allowed: true };
                const matchCount = this.getUsageCount('job_match');
                if (matchCount >= plan.features.jobMatches) {
                    return { allowed: false, reason: 'Job match limit reached. Upgrade to Pro for unlimited matching.' };
                }
                return { allowed: true };

            case 'ai_rewrite':
            case 'cv_regeneration':
            case 'cover_letter':
            case 'bullet_optimization':
            case 'keywordEnhancement':
                // Pro users have unlimited access
                if (this.isPro()) return { allowed: true };

                // Check if plan uses credits
                if (!plan.creditRules.usesCredits) {
                    return { allowed: false, reason: 'Upgrade to unlock AI rewriting features.' };
                }

                // Check credit balance
                if (this.subscription.credits <= 0) {
                    return {
                        allowed: false,
                        reason: 'Out of credits. Upgrade to Career Sprint or Marathon for unlimited access.'
                    };
                }

                return { allowed: true };

            case 'pdf_export':
                if (!plan.features.pdfExport) {
                    return { allowed: false, reason: 'Upgrade to export your resume as PDF.' };
                }
                return { allowed: true };

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

        // If plan doesn't use credits (Sprint / Marathon), treat as free action but still log usage
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
        this.subscription.usageHistory.unshift(record);
    }

    /**
     * Get usage count for a specific action
     */
    private getUsageCount(action: string): number {
        return this.subscription.usageHistory.filter(record => record.action === action).length;
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
        credits: 10, // Updated to match new free tier allocation
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
    billingCycle?: 'monthly' | 'yearly' | 'lifetime'
): UserSubscription => {
    const newPlan = PLANS[newPlanId];
    if (!newPlan) return subscription;

    return {
        ...subscription,
        planId: newPlanId,
        credits: newPlan.creditRules.startingCredits,
        billingCycle,
        subscriptionStart: new Date(),
        subscriptionEnd: newPlanId === 'week_pass'
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : newPlan.price.lifetime ? undefined : new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
        isActive: true,
    };
};
