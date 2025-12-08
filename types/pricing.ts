// Pricing and Subscription Type Definitions

export type PlanId = 'free' | 'week_pass' | 'pro_quarterly' | 'lifetime';

export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';

export interface PlanPrice {
    monthly?: number;
    yearly?: number;
    lifetime?: number;
}

export interface PlanFeatures {
    resumeUploads: number | 'unlimited';
    resumeAnalyses: number | 'unlimited';
    aiRewrites: number | 'unlimited';
    jobMatches: number | 'unlimited';
    coverLetterGeneration: number | 'unlimited';
    bulletOptimizations: number | 'unlimited';
    cvRegenerations: number | 'unlimited';
    pdfExport: boolean;
    watermarkFree: boolean;
    allTemplates: boolean;
    templateAccess: 'free' | 'basic' | 'all';
    maxResumePages: number;
    priorityProcessing: boolean;
    multipleVersions: boolean;
    liveEditing: boolean;
}

export interface CreditRules {
    usesCredits: boolean;
    startingCredits: number;
    monthlyCredits?: number;
    lifetimeCredits?: number;
    creditsReset: boolean;
    creditCosts: {
        fullRewrite: number;
        cvRegeneration: number;
        resumeUpload: number;
        coverLetter: number;
        bulletOptimization: number;
        keywordEnhancement: number;
    };
}

export interface Plan {
    id: PlanId;
    name: string;
    description: string;
    price: PlanPrice;
    features: PlanFeatures;
    creditRules: CreditRules;
    popular?: boolean;
}

export interface CreditPack {
    credits: number;
    price: number;
    label: string;
    description?: string;
    savings?: string | null;
}

export interface UserSubscription {
    userId: string;
    planId: PlanId;
    credits: number;
    billingCycle?: BillingCycle;
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
    isActive: boolean;
    usageHistory: UsageRecord[];
}

export interface UsageRecord {
    timestamp: Date;
    action: string;
    creditsCost: number;
    remainingCredits: number;
}

export type FeatureAction =
    | 'resume_upload'
    | 'resume_analysis'
    | 'job_match'
    | 'ai_rewrite'
    | 'cv_regeneration'
    | 'cover_letter'
    | 'bullet_optimization'
    | 'keywordEnhancement'
    | 'pdf_export'
    | 'template_access';
