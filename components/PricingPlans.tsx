import React, { useState } from 'react';
import { Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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
import PricingSection from './ui/pricing';

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

const comparisonSections: { title: string; rows: { label: string; cells: [ComparisonCell, ComparisonCell, ComparisonCell] }[] }[] = [
    {
        title: 'AI Resume Agent & Matching',
        rows: [
            { label: 'AI Tailored Resumes', cells: [{ type: 'text', text: '1 Resume' }, { type: 'text', text: 'Unlimited*' }, { type: 'text', text: 'Unlimited*' }] },
            { label: 'Job Description Match & Score', cells: [{ type: 'text', text: 'Basic' }, { type: 'check' }, { type: 'check' }] },
            { label: 'AI Bullet Optimizer & Metrics', cells: [{ type: 'text', text: '1 Rewrite' }, { type: 'check' }, { type: 'check' }] },
            { label: 'AI Summary & Skill Extraction', cells: [{ type: 'text', text: '1 Resume' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Grounded Evidence Verification', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Editor & Customization',
        rows: [
            { label: 'Interactive Drag & Drop Editor', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Custom & Reorderable Sections', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'ATS Resume Templates', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Custom Fonts, Colors & Spacing', cells: [{ type: 'text', text: 'Basic' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Multi-Page Page Break Control', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Career & Application Suite',
        rows: [
            { label: 'Saved Resume Versions', cells: [{ type: 'text', text: '1 Version' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }] },
            { label: 'Cover Letter Builder', cells: [{ type: 'dash' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Interview Prep & Q&A', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
    {
        title: 'Exports & Downloads',
        rows: [
            { label: 'Pixel-Perfect PDF Export', cells: [{ type: 'text', text: '1 Download' }, { type: 'text', text: 'Unlimited' }, { type: 'text', text: 'Unlimited' }] },
            { label: 'Editable Word (.DOCX) Export', cells: [{ type: 'dash' }, { type: 'check' }, { type: 'check' }] },
            { label: 'Plain Text (.TXT) Export', cells: [{ type: 'check' }, { type: 'check' }, { type: 'check' }] },
        ],
    },
];

const ALL_DISPLAY_PLANS: PlanId[] = ['free', 'build', 'lifetime'];

function normalizePlanIdForPicker(planId: string): string {
    if (planId === 'week_pass' || planId === 'sprint') return 'build';
    if (planId === 'pro_monthly') return 'build';
    return planId;
}

interface PricingPlansProps {
    onFreeClick?: () => void;
    compact?: boolean;
    showLifetime?: boolean;
}

export default function PricingPlans({ onFreeClick, compact = false, showLifetime = false }: PricingPlansProps) {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [showComparison, setShowComparison] = useState(false);

    const activeDisplayPlans = showLifetime
        ? ALL_DISPLAY_PLANS
        : ALL_DISPLAY_PLANS.filter((p) => p !== 'lifetime');

    React.useEffect(() => {
        if (!user) {
            setSubscription(null);
            return;
        }

        let cancelled = false;
        subscriptionService.getSubscription(user.id).then((sub) => {
            if (!cancelled) {
                setSubscription(sub);
            }
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
            {/* Primary Pricing Cards Deck */}
            <PricingSection
                onSelectPlan={handlePlanAction}
                loadingPlanId={loadingPlanId}
                currentPlanId={currentPlanId}
                isPaidSubscriber={isPaidSubscriber}
                compact={compact}
                showLifetime={showLifetime}
            />

            {/* Expandable Detailed Feature Comparison Toggle */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-brand-border text-brand-dark font-bold text-xs sm:text-sm hover:border-brand-green/60 hover:bg-brand-secondary/50 transition-all cursor-pointer"
                >
                    <span>{showComparison ? 'Hide' : 'View'} Detailed Feature Comparison Matrix</span>
                    {showComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Comparison Table (Expandable) */}
            {showComparison && (
                <div className="mt-8 max-w-5xl mx-auto overflow-x-auto animate-fadeIn">
                    <div className="min-w-[560px] bg-white p-6 sm:p-8 rounded-xl border border-brand-border">
                        <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-brand-dark">
                                Side-by-Side Feature Matrix
                            </h3>
                            <p className="text-xs sm:text-sm text-brand-dark/60 mt-1">
                                Complete breakdown of what's included across {showLifetime ? 'Foundation, Build, and Lifetime.' : 'Foundation and Build.'}
                            </p>
                        </div>

                        {/* Matrix Header */}
                        <div className={`grid ${showLifetime ? 'grid-cols-[1.5fr_repeat(3,1fr)]' : 'grid-cols-[1.5fr_repeat(2,1fr)]'} gap-x-6 mb-6 items-end border-b border-brand-border pb-4`}>
                            <div className="text-xs font-bold uppercase tracking-wider text-brand-dark/50">Feature</div>
                            {activeDisplayPlans.map((planId) => {
                                const plan = PLANS[planId];
                                const { amount, period } = formatPlanPrice(plan);
                                return (
                                    <div key={planId} className="text-center">
                                        <h4 className="text-sm sm:text-base font-bold text-brand-dark">{plan.name}</h4>
                                        <div className="text-sm font-extrabold text-brand-dark mt-0.5">
                                            {amount}
                                            {period && <span className="text-xs font-normal text-brand-dark/60 ml-0.5">{period}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature Groups */}
                        {comparisonSections.map((section) => (
                            <div key={section.title} className="mb-8 last:mb-0">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-3 px-2">
                                    {section.title}
                                </h5>
                                <div className="space-y-1">
                                    {section.rows.map((row, i) => (
                                        <div
                                            key={row.label}
                                            className={`grid ${showLifetime ? 'grid-cols-[1.5fr_repeat(3,1fr)]' : 'grid-cols-[1.5fr_repeat(2,1fr)]'} gap-x-6 items-center px-4 py-3 rounded-xl transition-colors ${
                                                i % 2 === 0 ? 'bg-brand-secondary/60' : 'bg-transparent'
                                            }`}
                                        >
                                            <span className="text-xs sm:text-sm text-brand-dark/85 font-medium">{row.label}</span>
                                            {row.cells.slice(0, activeDisplayPlans.length).map((cell, cIdx) => (
                                                <PricingCell key={cIdx} cell={cell} emphasize={cell.type === 'text'} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <p className="mt-8 text-center text-xs text-brand-dark/50">
                            * Unlimited AI tailoring is subject to standard fair use guidelines. Free plan includes full editor preview and 1 credit without requiring a credit card.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

