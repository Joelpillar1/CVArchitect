import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Loader2, Check } from 'lucide-react';
import { PLANS, PAID_PLAN_FEATURES, PAID_PLAN_IDS, formatPlanPrice } from '../utils/pricingConfig';
import { PlanId } from '../types/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { redirectToCheckout } from '../services/dodoPaymentsService';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (planId: PlanId, billingCycle?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime') => void;
    currentPlanId?: string;
}

export default function PricingModal({ isOpen, onClose, onSelectPlan, currentPlanId = 'free' }: PricingModalProps) {
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            showToast('Please sign in to upgrade your plan', 'error');
            return;
        }

        setLoadingPlanId(planId);

        try {
            onSelectPlan(planId);
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

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4 overflow-y-auto">
            <div className="bg-brand-dark rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleIn relative">

                <button
                    onClick={onClose}
                    disabled={!!loadingPlanId}
                    className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/10 text-white shadow-md flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                    aria-label="Close pricing"
                >
                    <X size={20} />
                </button>

                <div className="p-6 md:p-10">
                    <div className="text-center mb-8 pr-8">
                        <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap size={12} className="fill-current" />
                            Upgrade your plan
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Pick your job hunt timeline
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Unlimited AI tailoring, all templates, and unlimited downloads on every paid plan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PAID_PLAN_IDS.map((planId) => {
                            const plan = PLANS[planId];
                            const { amount, period } = formatPlanPrice(plan);
                            const isCurrent = currentPlanId === planId;
                            const isHighlighted = plan.highlight;

                            return (
                                <button
                                    key={planId}
                                    type="button"
                                    onClick={() => !loadingPlanId && handlePlanSelect(planId)}
                                    disabled={!!loadingPlanId || isCurrent}
                                    className={`relative text-left rounded-2xl p-5 border transition-all flex flex-col ${
                                        isHighlighted
                                            ? 'border-brand-green bg-white shadow-float ring-2 ring-brand-green/25'
                                            : 'border-brand-border bg-brand-secondary hover:border-brand-green/40'
                                    } ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {isHighlighted && (
                                        <span className="absolute -top-2.5 left-4 bg-brand-green text-brand-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                            Start here
                                        </span>
                                    )}

                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isHighlighted ? 'text-brand-dark' : 'text-gray-400'}`}>
                                        {plan.tagline}
                                    </p>
                                    <h3 className={`text-lg font-bold mb-1 ${isHighlighted ? 'text-brand-dark' : 'text-white'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className={`text-2xl font-extrabold ${isHighlighted ? 'text-brand-dark' : 'text-white'}`}>
                                            {amount}
                                        </span>
                                        <span className={`text-xs ${isHighlighted ? 'text-gray-500' : 'text-slate-400'}`}>
                                            {period}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] mb-4 ${isHighlighted ? 'text-gray-500' : 'text-slate-400'}`}>
                                        {plan.renewalNote}
                                    </p>

                                    <ul className="space-y-1.5 mb-4 flex-1">
                                        {PAID_PLAN_FEATURES.map((f) => (
                                            <li key={f} className={`flex items-center gap-1.5 text-xs ${isHighlighted ? 'text-gray-600' : 'text-slate-300'}`}>
                                                <Check size={12} className="text-brand-green" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={`w-full py-2.5 rounded-lg text-center text-sm font-bold ${
                                        isHighlighted
                                            ? 'bg-brand-green text-brand-dark'
                                            : 'bg-slate-700 text-white'
                                    }`}>
                                        {loadingPlanId === planId ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 size={14} className="animate-spin" />
                                                Redirecting...
                                            </span>
                                        ) : isCurrent ? (
                                            'Current plan'
                                        ) : (
                                            plan.ctaLabel
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
