import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';
import { PLANS } from '../utils/pricingConfig';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PricingPage() {
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        navigate('/register?plan=' + planId);
    };

    const sharedFeatures = [
        'Unlimited resume uploads & analyses',
        'Unlimited AI rewrites & bullet optimizations',
        'Unlimited Job Match reports',
        'Unlimited cover letter generation',
        'Access to every premium template',
        'Up to 10-page resumes',
        'Priority processing & unlimited versions',
    ];

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
            <PublicHeader />

            {/* Hero Section */}
            <div className="bg-brand-dark pt-32 pb-20 px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-brand-green px-4 py-1.5 rounded-full text-sm font-medium">
                        <Zap size={14} className="fill-current" />
                        New: The 7-Day Career Sprint
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        Don't subscribe.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">Just get hired.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Most resume builders want you to pay for months. We built a tool to get you a job in days.
                    </p>
                </div>
            </div>

            {/* Pricing Options */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">

                    {/* SPRINT PLAN (Focus) */}
                    <div className="relative bg-white border-2 border-brand-green rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-green/10 max-w-sm w-full mx-auto flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center justify-between gap-3 mb-1">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark whitespace-nowrap">The Career Sprint</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-green text-brand-dark text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                                    Most popular
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">Best for focused 7-day job search sprints.</p>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-6xl font-extrabold text-brand-dark">$9</span>
                                <span className="text-gray-500 font-medium">/ 7 days</span>
                            </div>
                            <p className="text-sm text-gray-500 font-semibold mt-3 text-brand-green">
                                One-time payment, no auto-renew.
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {sharedFeatures.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check size={16} className="text-brand-green mt-0.5" />
                                    <span className={i === 0 ? 'font-semibold' : ''}>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-2">
                            <button
                                onClick={() => handleSelectPlan('week_pass')}
                                className="w-full py-4 rounded-full bg-brand-green hover:opacity-90 text-brand-dark text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                Start 7-day access
                            </button>
                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                <Shield size={14} className="text-brand-green" />
                                <p>Backed by a 7-day money-back guarantee.</p>
                            </div>
                        </div>
                    </div>


                    {/* MARATHON PLAN */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 max-w-sm w-full mx-auto flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center justify-between gap-3 mb-1">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark whitespace-nowrap">The Career Marathon</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-green text-brand-dark text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                                    Best deal
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">Best for ongoing applications and long-term career moves.</p>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-brand-dark">$19</span>
                                <span className="text-gray-500 font-medium">/ month</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mt-3">Recurring subscription. Cancel anytime.</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <ul className="space-y-3">
                                {sharedFeatures.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <Check size={16} className="text-brand-green mt-0.5" />
                                        <span className={i === 0 ? 'font-semibold' : ''}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-2">
                            <button
                                onClick={() => handleSelectPlan('pro_monthly')}
                                className="w-full py-4 rounded-full bg-brand-green hover:opacity-90 text-brand-dark text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                Start monthly access
                            </button>
                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                <Shield size={14} className="text-brand-green" />
                                <p>Cancel anytime. Your changes are always saved.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
