import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlanId, UserSubscription } from '../types/pricing';
import {
    PLANS,
    formatPlanPrice,
    isPaidPlan,
} from '../utils/pricingConfig';
import { upgradeToPlan } from '../services/dodoPaymentsService';
import { setPendingCheckoutPlan } from '../utils/pendingCheckout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';

type ComparisonCellType = 'check' | 'dash' | 'text';
interface ComparisonCell {
    type: ComparisonCellType;
    text?: string;
}

function PricingCell({ cell, emphasize }: { cell: ComparisonCell; emphasize?: boolean }) {
    if (cell.type === 'check') {
        return (
            <span className="flex justify-center">
                <Check size={18} className="text-brand-dark" strokeWidth={2.5} />
            </span>
        );
    }
    if (cell.type === 'dash') {
        return <span className="text-center text-sm text-brand-dark/30">-</span>;
    }
    return (
        <span className={`text-center text-xs sm:text-sm ${emphasize ? 'font-bold text-brand-dark' : 'font-semibold text-brand-dark'}`}>
            {cell.text}
        </span>
    );
}

const comparisonSections: { title: string; rows: { label: string; cells: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell] }[] }[] = [
    {
        title: 'AI Resume Agent & Matching',
        rows: [
            { label: 'AI Tailored Resumes', cells: [{ type: 'text', text: '1 Resume' }, { type: 'text', text: 'Unlimited*' }, { type: 'text', text: 'Unlimited*' }, { type: 'text', text: 'Unlimited*' }] },
            { label: 'Job Description Match & Score', cells: [{ type: 'text', text: 'Basic' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'AI Bullet Optimizer & Metrics', cells: [{ type: 'text', text: '1 Rewrite' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'AI Summary & Skill Extraction', cells: [{ type: 'text', text: '1 Resume' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Grounded Evidence Verification', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Editor & Customization',
        rows: [
            { label: 'Interactive Drag & Drop Editor', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Custom & Reorderable Sections', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'ATS Resume Templates', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Custom Fonts, Colors & Spacing', cells: [{ type: 'text', text: 'Basic' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Multi-Page Page Break Control', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Career & Application Suite',
        rows: [
            { label: 'Saved Resume Versions', cells: [{ type: 'text', text: '1 Version' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }] },
            { label: 'Cover Letter Builder', cells: [{ type: 'dash' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Interview Prep & Q&A', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Job Search Feed & 1-Click Tailor', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Exports & Downloads',
        rows: [
            { label: 'Pixel-Perfect PDF Export', cells: [{ type: 'text', text: '1 Download' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }] },
            { label: 'Editable Word (.DOCX) Export', cells: [{ type: 'dash' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Plain Text (.TXT) Export', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
];

const DISPLAY_PLANS: PlanId[] = ['free', 'sprint', 'build', 'lifetime'];

function normalizePlanIdForPicker(planId: string): string {
    if (planId === 'week_pass') return 'sprint';
    if (planId === 'pro_monthly') return 'build';
    return planId;
}

interface PricingPlansProps {
    onFreeClick?: () => void;
    compact?: boolean;
}

export default function PricingPlans({ onFreeClick, compact = false }: PricingPlansProps) {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);

    React.useEffect(() => {
        if (!user) {
            setSubscription(null);
            return;
        }

        let cancelled = false;
        subscriptionService.getSubscription(user.id).then((sub) => {
            if (!cancelled) setSubscription(sub);
        });

        return () => {
            cancelled = true;
        };
    }, [user]);

    const currentPlanId = subscription ? normalizePlanIdForPicker(subscription.planId) : 'free';
    const isPaidSubscriber = subscription ? isPaidPlan(subscription.planId) : false;

    const handlePlanAction = async (planId: PlanId) => {
        if (planId === 'free') {
            if (onFreeClick) {
                onFreeClick();
                return;
            }
            navigate(user ? '/dashboard' : '/signup');
            return;
        }

        if (authLoading) return;

        if (!user) {
            setPendingCheckoutPlan(planId);
            navigate(`/signup?plan=${planId}`);
            return;
        }

        setLoadingPlanId(planId);
        try {
            if (isPaidSubscriber) {
                const result = await upgradeToPlan(planId, {
                    hasDodoSubscription: Boolean(subscription?.dodoSubscriptionId),
                });

                if (!result.usedCheckout) {
                    showToast(
                        result.scheduled
                            ? result.message || 'Plan change scheduled for your next billing date.'
                            : result.message || 'Plan updated successfully.',
                        'success'
                    );
                    const refreshed = await subscriptionService.getSubscription(user.id);
                    if (refreshed) setSubscription(refreshed);
                    setLoadingPlanId(null);
                }
                return;
            }

            const result = await upgradeToPlan(planId, { hasDodoSubscription: false });
            if (!result.usedCheckout) {
                setLoadingPlanId(null);
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
        }
    };

    return (
        <div className="w-full">
            {!compact && (
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                        Pay when you're ready to apply
                    </h2>
                    <p className="text-brand-dark/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Start free with one AI-tailored resume. Upgrade for unlimited tailoring, every template, and unlimited exports. Cancel anytime.
                    </p>
                </div>
            )}

            {/* Comparison Table */}
            <div className="max-w-5xl mx-auto overflow-x-auto">
                <div className="min-w-[640px]">
                    {/* Header  -  Plan name, big price, full-width CTA per column */}
                    <div className="grid grid-cols-[1.2fr_repeat(4,1fr)] gap-x-3 sm:gap-x-6 mb-8 items-end">
                        <div aria-hidden="true" />
                        {DISPLAY_PLANS.map((planId) => {
                            const plan = PLANS[planId];
                            const { amount, period } = formatPlanPrice(plan);
                            const isCurrent = isPaidSubscriber ? currentPlanId === planId : planId === 'free';
                            const isLoading = loadingPlanId === planId;

                            return (
                                <div key={planId} className="text-center">
                                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-brand-dark">{plan.name}</h3>
                                    <div className="mt-1 flex items-baseline justify-center">
                                        <span className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-brand-dark">
                                            {amount}
                                        </span>
                                        {period && (
                                            <span className="text-xs sm:text-sm font-semibold text-brand-dark/70 ml-1">
                                                {period}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handlePlanAction(planId)}
                                        disabled={isLoading || (isPaidSubscriber && isCurrent)}
                                        className={`mt-4 w-full py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                                            isPaidSubscriber && isCurrent
                                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                                : 'bg-brand-green hover:bg-brand-greenHover text-brand-dark'
                                        } disabled:opacity-75`}
                                    >
                                        {isLoading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : isPaidSubscriber && isCurrent ? (
                                            'Current plan'
                                        ) : (
                                            'Get started'
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Feature Groups */}
                    {comparisonSections.map((section) => (
                        <div key={section.title} className="mb-10 last:mb-0">
                            <h4 className="text-base sm:text-lg font-semibold text-brand-dark mb-4">{section.title}</h4>
                            <div>
                                {section.rows.map((row, i) => (
                                    <div
                                        key={row.label}
                                        className={`grid grid-cols-[1.2fr_repeat(4,1fr)] gap-x-3 sm:gap-x-6 items-center px-4 sm:px-5 py-3.5 rounded-lg ${
                                            i % 2 === 0 ? 'bg-brand-secondary' : ''
                                        }`}
                                    >
                                        <span className="text-xs sm:text-sm text-brand-dark/85">{row.label}</span>
                                        {row.cells.map((cell, cIdx) => (
                                            <PricingCell key={cIdx} cell={cell} emphasize={cell.type === 'text'} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Bottom CTA buttons below all comparison features */}
                    <div className="grid grid-cols-[1.2fr_repeat(4,1fr)] gap-x-3 sm:gap-x-6 items-center pt-8 border-t border-brand-border mt-8">
                        <div aria-hidden="true" />
                        {DISPLAY_PLANS.map((planId) => {
                            const isCurrent = isPaidSubscriber ? currentPlanId === planId : planId === 'free';
                            const isLoading = loadingPlanId === planId;

                            return (
                                <div key={planId} className="text-center">
                                    <button
                                        onClick={() => handlePlanAction(planId)}
                                        disabled={isLoading || (isPaidSubscriber && isCurrent)}
                                        className={`w-full py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                                            isPaidSubscriber && isCurrent
                                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                                : 'bg-brand-green hover:bg-brand-greenHover text-brand-dark'
                                        } disabled:opacity-75`}
                                    >
                                        {isLoading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : isPaidSubscriber && isCurrent ? (
                                            'Current plan'
                                        ) : (
                                            'Get started'
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-8 text-center text-xs text-brand-dark/50">
                        * Unlimited AI tailoring is subject to standard fair use guidelines to ensure service reliability for all users. Free plan includes full editor preview and 1 AI tailoring credit without requiring a credit card.
                    </p>
                </div>
            </div>
        </div>
    );
}
