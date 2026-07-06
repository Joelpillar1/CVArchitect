import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlanId } from '../types/pricing';
import {
    PLANS,
    PAID_PLAN_FEATURES,
    FOUNDATION_FEATURES,
    PAID_PLAN_IDS,
    formatPlanPrice,
} from '../utils/pricingConfig';
import { redirectToCheckout } from '../services/dodoPaymentsService';
import { setPendingCheckoutPlan } from '../utils/pendingCheckout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface PricingPlansProps {
    onFreeClick?: () => void;
    compact?: boolean;
}

export default function PricingPlans({ onFreeClick, compact = false }: PricingPlansProps) {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);

    const handleFree = () => {
        if (onFreeClick) {
            onFreeClick();
            return;
        }
        navigate(user ? '/dashboard' : '/signup');
    };

    const handlePaidPlan = async (planId: PlanId) => {
        if (authLoading) return;

        if (!user) {
            setPendingCheckoutPlan(planId);
            navigate(`/signup?plan=${planId}`);
            return;
        }

        setLoadingPlanId(planId);
        try {
            await redirectToCheckout(planId);
        } catch (error) {
            console.error('Checkout failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
        }
    };

    const timelineLabels = ['1 WEEK', '1 MONTH', '3 MONTHS'];

    return (
        <div className={compact ? '' : 'relative'}>
            {!compact && (
                <div className="text-center mb-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4" style={{ fontFamily: 'Graphik, sans-serif' }}>
                        Plans & Pricing
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Pick the plan that matches how long you&apos;re job hunting. Every plan starts after you&apos;ve seen your first AI-tailored resume — free, no card required.
                    </p>
                </div>
            )}

            {/* Timeline */}
            <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto mb-6 px-2">
                {timelineLabels.map((label) => (
                    <div key={label} className="text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                        {label}
                    </div>
                ))}
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch"
            >
                {PAID_PLAN_IDS.map((planId) => {
                    const plan = PLANS[planId];
                    const { amount, period } = formatPlanPrice(plan);
                    const isHighlighted = plan.highlight;

                    return (
                        <motion.div
                            key={planId}
                            variants={fadeInUp}
                            className={`relative rounded-2xl p-6 md:p-7 flex flex-col border transition-all bg-white ${
                                isHighlighted
                                    ? 'border-brand-green shadow-float ring-2 ring-brand-green/25'
                                    : 'border-brand-border shadow-soft hover:border-brand-green/40 hover:shadow-float'
                            }`}
                        >
                            {isHighlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                                    Start here
                                </div>
                            )}

                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isHighlighted ? 'text-brand-dark' : 'text-gray-400'}`}>
                                {plan.tagline}
                            </p>
                            <h3 className="text-2xl font-bold mb-1 text-brand-dark">
                                {plan.name}
                            </h3>

                            <div className="mt-3 mb-1 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-brand-dark">
                                    {amount}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {period}
                                </span>
                            </div>
                            <p className="text-xs mb-5 text-gray-500">
                                {plan.renewalNote}
                            </p>

                            <ul className="space-y-2.5 mb-6 flex-1">
                                {PAID_PLAN_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                {planId === 'build' && (
                                    <li className="flex items-start gap-2 text-sm font-medium text-brand-dark">
                                        <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                                        <span>Cheaper than 4 weeks of Sprint</span>
                                    </li>
                                )}
                            </ul>

                            <button
                                onClick={() => handlePaidPlan(planId)}
                                disabled={!!loadingPlanId}
                                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
                                    isHighlighted
                                        ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark shadow-lg'
                                        : 'bg-brand-dark hover:opacity-90 text-white'
                                }`}
                            >
                                {loadingPlanId === planId ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Redirecting...
                                    </>
                                ) : (
                                    plan.ctaLabel
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Foundation (free) */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="max-w-5xl mx-auto mt-8 rounded-2xl border border-brand-border bg-brand-secondary p-6 md:p-8"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark mb-1">{PLANS.free.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{PLANS.free.description}</p>
                        <ul className="space-y-2">
                            {FOUNDATION_FEATURES.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={15} className="text-brand-green shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={handleFree}
                        className="shrink-0 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                    >
                        {PLANS.free.ctaLabel} →
                    </button>
                </div>
            </motion.div>

            {/* Comparison hints */}
            <div className="max-w-5xl mx-auto mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
                <span>Applying this week only? → <span className="text-brand-dark font-medium">Sprint</span></span>
                <span>Searching 3+ weeks? <span className="text-brand-dark font-medium">Build costs less than Sprint</span></span>
                <span>Focused 3-month push? → <span className="text-brand-dark font-medium">Blueprint Pass</span></span>
            </div>
        </div>
    );
}
