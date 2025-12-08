import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Zap, Crown, Sparkles, Star } from 'lucide-react';
import { PLANS, CREDIT_PACKS } from '../utils/pricingConfig';
import { PlanId } from '../types/pricing';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (planId: PlanId, billingCycle?: 'monthly' | 'yearly') => void;
    currentPlanId?: string;
}

export default function PricingModal({ isOpen, onClose, onSelectPlan, currentPlanId = 'free' }: PricingModalProps) {
    const [showCreditPacks, setShowCreditPacks] = useState(false);

    if (!isOpen) return null;

    const displayPlans = [
        PLANS.free,
        PLANS.week_pass,
        PLANS.pro_quarterly,
        PLANS.lifetime,
    ];

    const getPrice = (plan: typeof PLANS.free) => {
        if (plan.id === 'free') return 'Free';
        if (plan.id === 'lifetime') return `$${plan.price.lifetime}`;
        if (plan.id === 'pro_quarterly') return '$9.60/mo'; // Marketing price
        return `$${plan.price.monthly}`;
    };

    const getBillingNote = (plan: typeof PLANS.free) => {
        if (plan.id === 'free') return 'Forever free';
        if (plan.id === 'lifetime') return 'One-time payment';
        if (plan.id === 'week_pass') return 'For 7 days access';
        if (plan.id === 'pro_quarterly') return 'Billed $29 every 3 months';
        return 'Billed monthly';
    };

    const getPlanName = (plan: typeof PLANS.free) => {
        return plan.name;
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden animate-scaleIn my-8 max-h-[95vh] flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-brand-dark to-gray-800 p-6 md:p-8 text-white relative overflow-hidden shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2">Choose Your Access Pass</h2>
                        <p className="text-gray-300 text-sm md:text-lg">Flexible options for every stage of your career</p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Plans Grid */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {displayPlans.map((plan) => {
                            const isCurrentPlan = currentPlanId === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-xl border-2 p-4 md:p-6 transition-all hover:shadow-xl flex flex-col ${plan.popular
                                        ? 'border-brand-green bg-green-50/50 shadow-lg scale-105 z-10'
                                        : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star size={12} className="fill-current" />
                                            MOST POPULAR
                                        </div>
                                    )}

                                    {plan.id === 'lifetime' && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Crown size={12} className="fill-current" />
                                            BEST VALUE
                                        </div>
                                    )}

                                    <div className="text-center mb-4 md:mb-6">
                                        <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-2">{getPlanName(plan)}</h3>
                                        <div className="text-2xl md:text-3xl font-extrabold text-brand-dark mb-1">
                                            {getPrice(plan)}
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">{getBillingNote(plan)}</p>
                                    </div>

                                    <ul className="space-y-2 md:space-y-3 mb-6 flex-1">
                                        {/* Dynamic Features Listing */}
                                        <li className="flex items-start gap-2 text-sm">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span>
                                                {plan.id === 'free' ? '3 Trial Credits' :
                                                    plan.id === 'week_pass' ? 'Unlimited AI (Cap: 75)' :
                                                        plan.id === 'pro_quarterly' ? 'Unlimited AI (Cap: 300/mo)' :
                                                            'Unlimited AI (Cap: 100/mo)'}
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span>
                                                {plan.id === 'free' ? 'Export without watermark' : 'Clean PDF Exports'}
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span>
                                                {plan.id === 'free' ? '1 Basic Template' : 'All Premium Templates'}
                                            </span>
                                        </li>
                                        {plan.id !== 'free' && (
                                            <li className="flex items-start gap-2 text-sm">
                                                <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                                <span>
                                                    {plan.id === 'week_pass' ? '10 AI Cover Letters' : '50 AI Cover Letters / mo'}
                                                </span>
                                            </li>
                                        )}
                                    </ul>

                                    <button
                                        onClick={() => {
                                            if (plan.id === 'free') return;
                                            // Pass appropriate cycle
                                            const cycle = plan.id === 'lifetime' ? 'lifetime' :
                                                plan.id === 'pro_quarterly' ? 'monthly' :
                                                    'monthly';
                                            onSelectPlan(plan.id as PlanId, cycle as any);
                                        }}
                                        disabled={isCurrentPlan}
                                        className={`w-full py-2 md:py-3 rounded-lg font-bold transition-all text-sm md:text-base mt-auto ${isCurrentPlan
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : plan.popular
                                                ? 'bg-brand-green text-brand-dark hover:bg-green-600 shadow-lg'
                                                : 'bg-brand-dark text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Current Plan' : 'Select Plan'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-brand-dark text-white p-4 md:p-6 text-center shrink-0">
                    <p className="text-xs md:text-sm text-gray-300">
                        *Fair use policy applies to unlimited plans to prevent abuse. 7-day money-back guarantee.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
