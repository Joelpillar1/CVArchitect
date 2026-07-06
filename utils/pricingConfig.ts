import { Plan, CreditPack, PlanId } from '../types/pricing';

// ========================================================
// SHARED COPY
// ========================================================

export const PAID_PLAN_FEATURES = [
    'Unlimited AI tailoring',
    'All templates unlocked',
    'Unlimited downloads',
];

export const FOUNDATION_FEATURES = [
    '1 free AI-tailored resume',
    'Base template included',
    'Full download included',
];

export const PAID_PLAN_IDS: PlanId[] = ['sprint', 'build', 'blueprint'];

/** @deprecated Legacy paid plan IDs still stored for some users */
export const LEGACY_PAID_PLAN_IDS = ['week_pass', 'pro_monthly'];

// ========================================================
// PLAN CONFIGURATIONS
// ========================================================

export const PLANS: Record<string, Plan> = {
    free: {
        id: 'free',
        name: 'Foundation',
        tagline: 'Try before you pay',
        description: 'Try the tailoring before you pay for anything.',
        price: { monthly: 0 },
        billingLabel: 'Free',
        renewalNote: 'No credit card required.',
        ctaLabel: 'Try it free',
        features: {
            resumeUploads: 1,
            resumeAnalyses: 1,
            aiRewrites: 1,
            jobMatches: 1,
            coverLetterGeneration: 0,
            bulletOptimizations: 1,
            cvRegenerations: 0,
            pdfExport: true,
            watermarkFree: false,
            allTemplates: false,
            templateAccess: 'free',
            maxResumePages: 1,
            priorityProcessing: false,
            multipleVersions: false,
            liveEditing: true,
        },
        creditRules: {
            usesCredits: true,
            startingCredits: 1,
            monthlyCredits: 0,
            creditsReset: false,
            creditCosts: {
                fullRewrite: 1,
                cvRegeneration: 1,
                resumeUpload: 1,
                coverLetter: 1,
                bulletOptimization: 1,
                keywordEnhancement: 1,
            },
        },
    },
    sprint: {
        id: 'sprint',
        name: 'Sprint',
        tagline: 'For a quick push',
        description: 'Unlimited AI tailoring for 7 days.',
        price: { weekly: 2.99 },
        billingLabel: '$2.99 / week',
        renewalNote: 'Renews weekly at $2.99. Cancel anytime.',
        ctaLabel: 'Start this week',
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
            liveEditing: true,
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
                keywordEnhancement: 0,
            },
        },
    },
    build: {
        id: 'build',
        name: 'Build',
        tagline: 'For an active search',
        description: 'Unlimited AI tailoring, every month.',
        price: { monthly: 9.99 },
        billingLabel: '$9.99 / month',
        renewalNote: 'Renews monthly at $9.99. Cancel anytime.',
        ctaLabel: 'Start monthly',
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
            liveEditing: true,
        },
        creditRules: {
            usesCredits: false,
            startingCredits: 999999,
            monthlyCredits: 999999,
            creditsReset: true,
            creditCosts: {
                fullRewrite: 0,
                cvRegeneration: 0,
                resumeUpload: 0,
                coverLetter: 0,
                bulletOptimization: 0,
                keywordEnhancement: 0,
            },
        },
        popular: true,
        highlight: true,
    },
    blueprint: {
        id: 'blueprint',
        name: 'Blueprint Pass',
        tagline: 'For one focused push',
        description: 'Unlimited AI tailoring for 3 months.',
        price: { quarterly: 29 },
        billingLabel: '$29 / 3 months',
        renewalNote: 'Renews every 3 months at $29. Cancel anytime.',
        ctaLabel: 'Start 3-month plan',
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
            liveEditing: true,
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
                keywordEnhancement: 0,
            },
        },
    },
};

export const CREDIT_PACKS: CreditPack[] = [];

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
    'freshgrad7',
    'freshgrad8',
    'sage',
    'student',
];

export const getPlanById = (planId: string): Plan | undefined => {
    return PLANS[planId];
};

export const getPlanDisplayName = (planId?: string): string => {
    if (!planId) return 'Foundation';
    const plan = PLANS[planId];
    if (plan) return plan.name;
    if (planId === 'week_pass') return 'Sprint (legacy)';
    if (planId === 'pro_monthly') return 'Build (legacy)';
    return 'Foundation';
};

export const isPaidPlan = (planId: string): boolean => {
    return PAID_PLAN_IDS.includes(planId as PlanId) || LEGACY_PAID_PLAN_IDS.includes(planId);
};

/** @deprecated Use isPaidPlan */
export const isPro = (planId: string): boolean => isPaidPlan(planId);

export const getTemplatesForPlan = (planId: string): string[] => {
    const plan = getPlanById(planId);
    if (!plan) {
        if (isPaidPlan(planId)) return ALL_TEMPLATES;
        return FREE_TEMPLATES;
    }

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

export const formatPlanPrice = (plan: Plan): { amount: string; period: string } => {
    if (plan.price.weekly != null) return { amount: '$2.99', period: '/ week' };
    if (plan.price.monthly != null && plan.price.monthly > 0) {
        return { amount: `$${plan.price.monthly.toFixed(2).replace(/\.00$/, '')}`, period: '/ month' };
    }
    if (plan.price.quarterly != null) return { amount: '$29', period: '/ 3 months' };
    return { amount: '$0', period: '' };
};
