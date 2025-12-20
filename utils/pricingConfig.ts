import { Plan, CreditPack } from '../types/pricing';

// ========================================================
// PLAN CONFIGURATIONS
// ========================================================

export const PLANS: Record<string, Plan> = {
    free: {
        id: 'free',
        name: 'Free Guest',
        description: 'Try CV Architect with basic features',
        price: {
            monthly: 0,
        },
        features: {
            resumeUploads: 1,
            resumeAnalyses: 1,
            aiRewrites: 0,
            jobMatches: 1,
            coverLetterGeneration: 0,
            bulletOptimizations: 0,
            cvRegenerations: 0,
            pdfExport: true,
            watermarkFree: true,
            allTemplates: false,
            templateAccess: 'free',
            maxResumePages: 1,
            priorityProcessing: false,
            multipleVersions: false,
            liveEditing: true,
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 3,
            monthlyCredits: 0,
            creditsReset: false,
            creditCosts: {
                fullRewrite: 3,
                cvRegeneration: 5,
                resumeUpload: 5,
                coverLetter: 3,
                bulletOptimization: 1,
                keywordEnhancement: 1,
            },
        },
    },

    week_pass: {
        id: 'week_pass',
        name: 'Week Pass (Sprint)',
        description: 'Unlimited access for 7 days',
        price: {
            monthly: 9, // One-time charge for 7 days
        },
        features: {
            resumeUploads: 'unlimited',
            resumeAnalyses: 'unlimited',
            aiRewrites: 'unlimited',
            jobMatches: 'unlimited',
            coverLetterGeneration: 10,
            bulletOptimizations: 'unlimited',
            cvRegenerations: 'unlimited',
            pdfExport: true,
            watermarkFree: true,
            allTemplates: true,
            templateAccess: 'all',
            maxResumePages: 3,
            priorityProcessing: true,
            multipleVersions: true,
            liveEditing: true,
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 75, // Cap for "Unlimited"
            creditsReset: false,
            creditCosts: {
                fullRewrite: 3,
                cvRegeneration: 5,
                resumeUpload: 5,
                coverLetter: 3,
                bulletOptimization: 1,
                keywordEnhancement: 1,
            },
        },
    },

    pro_quarterly: {
        id: 'pro_quarterly',
        name: 'Pro (3 Months)',
        description: 'Perfect for Serious Job Hunters',
        price: {
            monthly: 29, // Billed every 3 months. In UI show "Just $9.60/mo"
            yearly: 0
        },
        features: {
            resumeUploads: 'unlimited',
            resumeAnalyses: 'unlimited',
            aiRewrites: 'unlimited',
            jobMatches: 'unlimited',
            coverLetterGeneration: 50,
            bulletOptimizations: 'unlimited',
            cvRegenerations: 'unlimited',
            pdfExport: true,
            watermarkFree: true,
            allTemplates: true,
            templateAccess: 'all',
            maxResumePages: 10,
            priorityProcessing: true,
            multipleVersions: true,
            liveEditing: true,
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 300,
            monthlyCredits: 300, // Refills monthly
            creditsReset: true,
            creditCosts: {
                fullRewrite: 3,
                cvRegeneration: 5,
                resumeUpload: 5,
                coverLetter: 3,
                bulletOptimization: 1,
                keywordEnhancement: 1,
            },
        },
        popular: true,
    },

    lifetime: {
        id: 'lifetime',
        name: 'Lifetime Access',
        description: 'Pay once, use forever',
        price: {
            lifetime: 97,
        },
        features: {
            resumeUploads: 'unlimited',
            resumeAnalyses: 'unlimited',
            aiRewrites: 'unlimited',
            jobMatches: 'unlimited',
            coverLetterGeneration: 50, // Per month
            bulletOptimizations: 'unlimited',
            cvRegenerations: 'unlimited',
            pdfExport: true,
            watermarkFree: true,
            allTemplates: true,
            templateAccess: 'all',
            maxResumePages: 10,
            priorityProcessing: true,
            multipleVersions: true,
            liveEditing: true,
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 100, // Monthly allowance
            monthlyCredits: 100,
            lifetimeCredits: 100,
            creditsReset: true,
            creditCosts: {
                fullRewrite: 3,
                cvRegeneration: 5,
                resumeUpload: 5,
                coverLetter: 3,
                bulletOptimization: 1,
                keywordEnhancement: 1,
            },
        },
    },
};

// ========================================================
// CREDIT PACKS
// ========================================================

export const CREDIT_PACKS: CreditPack[] = [
    {
        credits: 25,
        price: 5,
        label: 'Starter Pack',
        description: '25 AI credits - Quick enhancements',
        savings: null,
    },
    {
        credits: 60,
        price: 9,
        label: 'Standard',
        description: '60 AI credits - Perfect for one resume',
        savings: '25% off',
    },
    {
        credits: 150,
        price: 19,
        label: 'Advanced',
        description: '150 AI credits - Major overhaul',
        savings: '35% off',
    },
    {
        credits: 300,
        price: 29,
        label: 'Pro Boost',
        description: '300 AI credits (Same cost as Pro Plan!)',
        savings: '40% off',
    },
];

// Export credit packs (separate from AI credits)
export const EXPORT_CREDIT_PACKS: CreditPack[] = [
    {
        credits: 10,
        price: 3,
        label: 'Basic',
        description: '10 PDF exports',
        savings: null,
    },
    {
        credits: 30,
        price: 7,
        label: 'Standard',
        description: '30 PDF exports',
        savings: '22% off',
    },
    {
        credits: 100,
        price: 20,
        label: 'Premium',
        description: '100 PDF exports',
        savings: '33% off',
    },
];

// ========================================================
// FREE TEMPLATES
// ========================================================

export const FREE_TEMPLATES = ['free', 'simplepro', 'minimalist'];

export const BASIC_TEMPLATES = [
    ...FREE_TEMPLATES,
    'vanguard',
    'elevate',
    'prime',
    'impact',
];

export const ALL_TEMPLATES = [
    ...BASIC_TEMPLATES,
    'dev',
    'elite',
    'apex',
    'modern',
    'executive',
    'classic',
    'wonsulting',
    'styled',
    'smart',
    'elegant',
];

// ========================================================
// HELPER FUNCTIONS
// ========================================================

export const getPlanById = (planId: string): Plan | undefined => {
    return PLANS[planId];
};

export const isPro = (planId: string): boolean => {
    return planId === 'pro_quarterly';
};

export const getTemplatesForPlan = (planId: string): string[] => {
    const plan = getPlanById(planId);
    if (!plan) return FREE_TEMPLATES;

    switch (plan.features.templateAccess) {
        case 'free':
            return FREE_TEMPLATES;
        case 'basic':
            return BASIC_TEMPLATES;
        case 'all':
            return ALL_TEMPLATES;
        default:
            return FREE_TEMPLATES;
    }
};

export const canAccessTemplate = (planId: string, templateId: string): boolean => {
    const allowedTemplates = getTemplatesForPlan(planId);
    return allowedTemplates.includes(templateId);
};
