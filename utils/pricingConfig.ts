import { Plan, CreditPack } from '../types/pricing';

// ========================================================
// PLAN CONFIGURATIONS
// ========================================================

export const PLANS: Record<string, Plan> = {
    free: {
        id: 'free',
        name: 'Free Tier',
        description: 'Explore the builder.',
        price: { monthly: 0 },
        features: {
            resumeUploads: 1,
            resumeAnalyses: 10,
            aiRewrites: 10,
            jobMatches: 1,
            coverLetterGeneration: 0,
            bulletOptimizations: 10,
            cvRegenerations: 0,
            pdfExport: true,
            watermarkFree: false,
            allTemplates: false,
            templateAccess: 'free',
            maxResumePages: 1,
            priorityProcessing: false,
            multipleVersions: false,
            liveEditing: true
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 10,
            monthlyCredits: 0,
            creditsReset: false,
            creditCosts: {
                fullRewrite: 1,
                cvRegeneration: 1,
                resumeUpload: 1,
                coverLetter: 1,
                bulletOptimization: 1,
                keywordEnhancement: 1
            }
        }
    },
    week_pass: {
        id: 'week_pass',
        name: 'Career Sprint',
        description: 'Get hired fast. 7 days of unlimited power.',
        price: { lifetime: 14.00 }, // Using lifetime key for one-time payment
        features: {
            resumeUploads: 'unlimited',
            resumeAnalyses: 'unlimited',
            aiRewrites: 'unlimited',
            jobMatches: 'unlimited',
            coverLetterGeneration: 'unlimited',
            bulletOptimizations: 'unlimited',
            cvRegenerations: 'unlimited',
            pdfExport: true,
            watermarkFree: true,
            allTemplates: true,
            templateAccess: 'all',
            maxResumePages: 10,
            priorityProcessing: true,
            multipleVersions: true,
            liveEditing: true
        },
        creditRules: {
            usesCredits: false,
            startingCredits: 999999,
            creditsReset: true,
            creditCosts: {
                fullRewrite: 0,
                cvRegeneration: 0,
                resumeUpload: 0,
                coverLetter: 0,
                bulletOptimization: 0,
                keywordEnhancement: 0
            }
        },
        popular: true
    },
    pro_monthly: {
        id: 'pro_monthly',
        name: 'Career Marathon',
        description: 'For the long-term career strategist.',
        price: { monthly: 29.00 },
        features: {
            resumeUploads: 'unlimited',
            resumeAnalyses: 'unlimited',
            aiRewrites: 'unlimited',
            jobMatches: 'unlimited',
            coverLetterGeneration: 'unlimited',
            bulletOptimizations: 'unlimited',
            cvRegenerations: 'unlimited',
            pdfExport: true,
            watermarkFree: true,
            allTemplates: true,
            templateAccess: 'all',
            maxResumePages: 10,
            priorityProcessing: true,
            multipleVersions: true,
            liveEditing: true
        },
        creditRules: {
            usesCredits: false,
            startingCredits: 9999,
            monthlyCredits: 9999,
            creditsReset: true,
            creditCosts: {
                fullRewrite: 0,
                cvRegeneration: 0,
                resumeUpload: 0,
                coverLetter: 0,
                bulletOptimization: 0,
                keywordEnhancement: 0
            }
        }
    }
};

// Credit packs are deprecated in favor of the Sprint/Marathon model
export const CREDIT_PACKS: CreditPack[] = [];

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

export const FREE_TEMPLATES = ['free', 'simplepro', 'minimalist', 'twocolumn', 'freshgrad1'];

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
    'professional',
    'freshgrad2',
    'freshgrad3',
    'freshgrad4',
    'freshgrad5',
    'freshgrad6',
];

// ========================================================
// HELPER FUNCTIONS
// ========================================================

export const getPlanById = (planId: string): Plan | undefined => {
    return PLANS[planId];
};

export const isPro = (planId: string): boolean => {
    return planId === 'week_pass' || planId === 'pro_monthly';
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
