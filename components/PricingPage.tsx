import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { PLANS } from '../utils/pricingConfig';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PricingPage() {
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        navigate('/register?plan=' + planId);
    };

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
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

                    {/* SPRINT PLAN (Focus) */}
                    <div className="relative bg-white border-2 border-brand-green rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-green/10 transform md:-translate-y-12">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg uppercase">
                            Best for 90% of Users
                        </div>

                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold text-brand-dark mb-2">The Career Sprint</h3>
                            <div className="flex justify-center items-baseline gap-1">
                                <span className="text-6xl font-extrabold text-brand-dark">$9</span>
                                <span className="text-gray-500 font-medium">/ 7 days</span>
                            </div>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-4 text-brand-green">One-time payment. No auto-renew.</p>
                        </div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3">
                                <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-700" /></div>
                                <span className="text-gray-700 font-medium">Unlimited AI Rewrites</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-700" /></div>
                                <span className="text-gray-700 font-medium">Unlimited PDF Exports</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-700" /></div>
                                <span className="text-gray-700 font-medium">Access All Premium Templates</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-green-100 p-1 rounded-full"><Check size={16} className="text-green-700" /></div>
                                <span className="text-gray-700 font-medium">Job Match Analysis</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSelectPlan('week_pass')}
                            className="w-full py-5 rounded-2xl bg-brand-dark hover:bg-black text-white text-lg font-bold transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
                        >
                            Start My 7-Day Sprint
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">7-Day Money-Back Guarantee</p>
                    </div>


                    {/* MARATHON PLAN */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold text-brand-dark mb-2">The Career Marathon</h3>
                            <div className="flex justify-center items-baseline gap-1">
                                <span className="text-5xl font-bold text-brand-dark">$19</span>
                                <span className="text-gray-500 font-medium">/ month</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mt-4">Recurring subscription. Cancel anytime.</p>
                        </div>

                        <div className="space-y-4 mb-10">
                            <p className="text-gray-600 leading-relaxed text-center">
                                Perfect for long-term career planning, freelancers, or passive job seekers who want to keep their options open.
                            </p>
                            <div className="h-px bg-gray-100 w-full my-6"></div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check size={16} className="text-gray-400" />
                                    <span>Everything in Sprint</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <Check size={16} className="text-gray-400" />
                                    <span>Continuous Access</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => handleSelectPlan('pro_monthly')}
                            className="w-full py-4 rounded-xl bg-white border-2 border-brand-dark text-brand-dark font-bold hover:bg-gray-50 transition-all"
                        >
                            Start Monthly Subscription
                        </button>
                    </div>

                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
