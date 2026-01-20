import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Zap, Crown, Star, Clock } from 'lucide-react';
import { PLANS } from '../utils/pricingConfig';
import { PlanId } from '../types/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan: (planId: PlanId, billingCycle?: 'monthly' | 'yearly' | 'lifetime') => void;
    currentPlanId?: string;
}

export default function PricingModal({ isOpen, onClose, onSelectPlan, currentPlanId = 'free' }: PricingModalProps) {
    const [loading, setLoading] = useState(false);
    const [processingPlan, setProcessingPlan] = useState<PlanId | null>(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    if (!isOpen) return null;

    const sprintPlan = PLANS.week_pass;
    const marathonPlan = PLANS.pro_monthly;

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            showToast('Please sign in to upgrade your plan', 'error');
            return;
        }

        // Just call the onSelectPlan callback
        onSelectPlan(planId);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4 overflow-y-auto">
            <div className="bg-brand-bg rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleIn relative flex flex-col md:flex-row min-h-[600px]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Panel: The Outcome */}
                <div className="w-full md:w-2/5 bg-brand-dark p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-green/20 via-transparent to-transparent opacity-50"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Zap size={12} className="fill-current" />
                            Stop Wasting Time
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Get Hired <br /><span className="text-brand-green">This Week.</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Most users fix their resume and apply to their dream jobs in just 7 days. Why pay for a subscription you don't need?
                        </p>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                                    <Crown size={16} />
                                </div>
                                <span className="text-gray-300 font-medium">Unlimited AI Rewrites</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                                    <Star size={16} />
                                </div>
                                <span className="text-gray-300 font-medium">ATS-Optimized Templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                                    <Clock size={16} />
                                </div>
                                <span className="text-gray-300 font-medium">One-Time Payment. No Auto-renew.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: The Plans */}
                <div className="w-full md:w-3/5 bg-white p-6 md:p-12 flex flex-col justify-center gap-6">

                    {/* SPRINT PLAN (HERO) */}
                    <div className={`relative group border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${currentPlanId === 'week_pass' ? 'border-brand-green bg-green-50/50' : 'border-brand-green shadow-lg ring-4 ring-brand-green/5'}`}
                        onClick={() => handlePlanSelect('week_pass')}>

                        <div className="absolute -top-4 left-6 bg-brand-green text-brand-dark px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide shadow-lg flex items-center gap-1.5">
                            <Zap size={12} className="fill-current" />
                            RECOMMENDED FOR YOU
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark">The Career Sprint</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">7 Days of Unlimited Power</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-brand-dark">$14</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">One-time payment</div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Get in, fix your resume, export perfectly, and get back to your life. No recurring fees.
                            </p>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-brand-dark hover:bg-black text-white font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processingPlan === 'week_pass' ? 'Processing...' : 'Start My 7-Day Sprint'}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or for long-term seekers</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* MARATHON PLAN (SECONDARY) */}
                    <div className={`group border border-gray-200 rounded-xl p-5 hover:border-brand-dark/30 transition-all cursor-pointer ${currentPlanId === 'pro_monthly' ? 'bg-gray-50 border-gray-300' : 'bg-white'}`}
                        onClick={() => handlePlanSelect('pro_monthly')}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-dark">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark">The Career Marathon</h3>
                                    <p className="text-xs text-gray-500">Monthly subscription. Cancel anytime.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-brand-dark">$29<span className="text-sm font-normal text-gray-400">/mo</span></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}
