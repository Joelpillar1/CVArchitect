import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Crown } from 'lucide-react';
import { PLANS } from '../utils/pricingConfig';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PricingPage() {
    const navigate = useNavigate();

    const displayPlans = [
        PLANS.free,
        PLANS.week_pass,
        PLANS.pro_quarterly,
        PLANS.lifetime,
    ];

    const getPrice = (plan: typeof PLANS.free) => {
        if (plan.id === 'free') return 'Free';
        if (plan.id === 'lifetime') return `$${plan.price.lifetime}`;
        if (plan.id === 'pro_quarterly') return '$9.60/mo';
        return `$${plan.price.monthly}`;
    };

    const getBillingNote = (plan: typeof PLANS.free) => {
        if (plan.id === 'free') return 'Forever free';
        if (plan.id === 'lifetime') return 'One-time payment';
        if (plan.id === 'week_pass') return 'For 7 days access';
        if (plan.id === 'pro_quarterly') return 'Billed $29 every 3 months';
        return 'Billed monthly';
    };

    const handleSelectPlan = (planId: string) => {
        // Navigate to register with plan selection
        navigate('/register?plan=' + planId);
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            <PublicHeader />

            {/* Header */}
            <div className="bg-gradient-to-r from-brand-dark to-gray-800 p-8 pt-32 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan for your career journey. No hidden fees.
                    </p>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="flex-1 p-4 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-xl flex flex-col bg-white ${plan.popular
                                ? 'border-brand-green shadow-lg scale-105 z-10'
                                : 'border-gray-200'
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

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-brand-dark mb-2">{plan.name}</h3>
                                <div className="text-3xl font-extrabold text-brand-dark mb-1">
                                    {getPrice(plan)}
                                </div>
                                <p className="text-xs text-gray-500 font-medium">{getBillingNote(plan)}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-sm">
                                    <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                                    <span>
                                        {plan.id === 'free' ? '3 Trial Credits' :
                                            plan.id === 'week_pass' ? 'Unlimited AI (Cap: 75)' :
                                                plan.id === 'pro_quarterly' ? 'Unlimited AI (Cap: 300/mo)' :
                                                    'Unlimited AI (Cap: 100/mo)'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                                    <span>
                                        {plan.id === 'free' ? 'Export without watermark' : 'Clean PDF Exports'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 text-sm">
                                    <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                                    <span>
                                        {plan.id === 'free' ? '1 Basic Template' : 'All Premium Templates'}
                                    </span>
                                </li>
                                {plan.id !== 'free' && (
                                    <li className="flex items-start gap-3 text-sm">
                                        <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                                        <span>
                                            {plan.id === 'week_pass' ? '10 AI Cover Letters' : '50 AI Cover Letters / mo'}
                                        </span>
                                    </li>
                                )}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`w-full py-3 rounded-lg font-bold transition-all text-base mt-auto ${plan.popular
                                    ? 'bg-brand-green text-brand-dark hover:bg-green-600 shadow-md'
                                    : 'bg-brand-dark text-white hover:bg-gray-800'
                                    }`}
                            >
                                {plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
