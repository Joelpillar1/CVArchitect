import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { PlanId } from '../types/pricing';
import { PLANS, PAID_PLAN_FEATURES, PAID_PLAN_IDS, formatPlanPrice } from '../utils/pricingConfig';
import { redirectToCheckout } from '../services/dodoPaymentsService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface PaidPlanPickerProps {
    currentPlanId?: string;
}

export default function PaidPlanPicker({ currentPlanId = 'free' }: PaidPlanPickerProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            showToast('Please sign in to upgrade your plan', 'error');
            return;
        }

        setLoadingPlanId(planId);
        try {
            await redirectToCheckout(planId);
        } catch (error) {
            console.error('Checkout redirect failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAID_PLAN_IDS.map((planId) => {
                const plan = PLANS[planId];
                const { amount, period } = formatPlanPrice(plan);
                const isCurrent = currentPlanId === planId;
                const isHighlighted = plan.highlight;

                return (
                    <div
                        key={planId}
                        className={`relative rounded-2xl p-6 flex flex-col border transition-all bg-white ${
                            isHighlighted
                                ? 'border-brand-green shadow-float ring-2 ring-brand-green/25'
                                : 'border-brand-border shadow-soft'
                        } ${isCurrent ? 'opacity-75' : ''}`}
                    >
                        {isHighlighted && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                                Start here
                            </span>
                        )}

                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isHighlighted ? 'text-brand-dark' : 'text-gray-400'}`}>
                            {plan.tagline}
                        </p>
                        <h3 className="text-2xl font-bold mb-1 text-brand-dark">{plan.name}</h3>

                        <div className="mt-3 mb-1 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-brand-dark">{amount}</span>
                            <span className="text-sm font-medium text-gray-500">{period}</span>
                        </div>
                        <p className="text-xs mb-5 text-gray-500">{plan.renewalNote}</p>

                        <ul className="space-y-2.5 mb-6 flex-1">
                            {PAID_PLAN_FEATURES.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check size={15} className="mt-0.5 shrink-0 text-brand-green" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => handlePlanSelect(planId)}
                            disabled={!!loadingPlanId || isCurrent}
                            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                                isCurrent
                                    ? 'bg-gray-100 text-gray-500'
                                    : isHighlighted
                                      ? 'bg-brand-green hover:bg-brand-greenHover text-brand-dark shadow-lg disabled:opacity-70'
                                      : 'bg-brand-dark hover:opacity-90 text-white disabled:opacity-70'
                            }`}
                        >
                            {loadingPlanId === planId ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Redirecting...
                                </>
                            ) : isCurrent ? (
                                'Current plan'
                            ) : (
                                plan.ctaLabel
                            )}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
