import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Layers, MessageSquare, FileText, Zap, CheckCheck, ArrowRight } from 'lucide-react';
import { PlanId } from '../types/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { redirectToCheckout } from '../services/creemPaymentsService';
import { useNavigate } from 'react-router-dom';
import { setPendingCheckoutPlan } from '../utils/pendingCheckout';
import LifetimeUpgradeModal from './LifetimeUpgradeModal';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPlan?: (planId: PlanId, billingCycle?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime') => void;
    currentPlanId?: string;
    title?: string;
    description?: string;
}

export default function PricingModal({
    isOpen,
    onClose,
    onSelectPlan,
    currentPlanId = 'free',
    title = 'Upgrade to Unlock Premium Templates',
    description = 'Choose a plan to unlock all premium ATS-optimized templates, unlimited AI rewrites, and PDF exports.',
}: PricingModalProps) {
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
    const [showLifetimeConfirm, setShowLifetimeConfirm] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const normalizedCurrentPlan =
        currentPlanId === 'week_pass' || currentPlanId === 'sprint' || currentPlanId === 'pro_monthly' || currentPlanId === 'blueprint'
            ? 'build'
            : currentPlanId;

    const executeCheckout = async (planId: PlanId) => {
        setLoadingPlanId(planId);
        try {
            onSelectPlan?.(planId);
            await redirectToCheckout(planId);
        } catch (error) {
            console.error('Checkout redirect failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to start checkout. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
            setShowLifetimeConfirm(false);
        }
    };

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            setPendingCheckoutPlan(planId);
            showToast('Please sign in to complete your upgrade', 'info');
            onClose();
            navigate(`/login?redirect=${encodeURIComponent('/dashboard?plan=' + planId)}`);
            return;
        }

        // If user is on Build and clicking Lifetime, show confirmation card first
        if (normalizedCurrentPlan === 'build' && planId === 'lifetime') {
            setShowLifetimeConfirm(true);
            return;
        }

        await executeCheckout(planId);
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-brand-dark/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fadeIn">
            <div className="bg-brand-bg rounded-2xl w-full max-w-2xl overflow-hidden animate-scaleIn relative border border-brand-border p-4 sm:p-6 my-auto">
                {/* Connecting to Checkout Overlay */}
                {loadingPlanId && (
                    <div className="absolute inset-0 bg-brand-bg/85 backdrop-blur-xs z-40 flex flex-col items-center justify-center gap-3 animate-fadeIn">
                        <span className="loader loader-md" />
                        <span className="text-sm font-bold text-brand-dark animate-pulse">
                            Connecting to secure checkout...
                        </span>
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={!!loadingPlanId}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-brand-secondary text-brand-dark/70 hover:text-brand-dark border border-brand-border flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
                    aria-label="Close pricing modal"
                >
                    <X size={15} />
                </button>

                {/* Header */}
                <div className="text-center mb-4 sm:mb-6 pr-6 sm:pr-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-brand-green/20 text-brand-dark border border-brand-green/40 mb-2">
                        <Sparkles size={11} className="text-brand-dark fill-brand-dark" />
                        <span>UPGRADE YOUR PLAN</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto mt-1 leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {/* 2-Card Layout (Build & Lifetime) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                    {/* 1. BUILD PLAN (Monthly) */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-brand-green flex flex-col justify-between transition-colors relative">
                        <div>
                            {/* Card Header & Badge */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-base sm:text-lg font-extrabold text-brand-dark tracking-tight">
                                    Build
                                </div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-green text-brand-dark px-2 py-0.5 rounded-md">
                                    Popular
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1.5 mt-1.5 mb-0.5">
                                <span className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
                                    $10
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] sm:text-xs font-bold text-brand-dark leading-tight">
                                        per month
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight">
                                        billed monthly
                                    </span>
                                </div>
                            </div>

                            {/* Action CTA */}
                            <div className="my-3 sm:my-3.5">
                                <button
                                    type="button"
                                    onClick={() => !loadingPlanId && handlePlanSelect('build')}
                                    disabled={!!loadingPlanId || normalizedCurrentPlan === 'build' || normalizedCurrentPlan === 'lifetime'}
                                    data-ml-goal="checkout_click"
                                    data-ml-goal-plan="build"
                                    className="w-full py-2.5 sm:py-3 px-3 rounded-lg bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loadingPlanId === 'build' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="loader loader-sm" />
                                            <span>Redirecting...</span>
                                        </span>
                                    ) : normalizedCurrentPlan === 'lifetime' ? (
                                        <span className="flex items-center gap-1.5 text-brand-dark/70">
                                            <CheckCheck size={15} />
                                            <span>Included in Lifetime</span>
                                        </span>
                                    ) : normalizedCurrentPlan === 'build' ? (
                                        'Current plan'
                                    ) : (
                                        <>
                                            <span>Get started</span>
                                            <ArrowRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Features list */}
                            <ul className="space-y-2 text-xs sm:text-sm text-brand-dark/90">
                                <li className="flex items-center gap-2 font-medium">
                                    <div className="p-0.5 sm:p-1 rounded bg-brand-green/20 text-brand-dark shrink-0">
                                        <Sparkles size={13} />
                                    </div>
                                    <span>Unlimited AI tailoring & ATS scoring</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <div className="p-0.5 sm:p-1 rounded bg-brand-green/20 text-brand-dark shrink-0">
                                        <Layers size={13} />
                                    </div>
                                    <span>All 20+ ATS templates & styling</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <div className="p-0.5 sm:p-1 rounded bg-brand-green/20 text-brand-dark shrink-0">
                                        <MessageSquare size={13} />
                                    </div>
                                    <span>Cover Letters & Interview Question Prep</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <div className="p-0.5 sm:p-1 rounded bg-brand-green/20 text-brand-dark shrink-0">
                                        <FileText size={13} />
                                    </div>
                                    <span>Unlimited PDF & Word downloads</span>
                                </li>
                            </ul>
                        </div>

                        {/* Card Footer Note */}
                        <div className="mt-3.5 pt-2.5 border-t border-brand-border text-center">
                            <span className="text-[11px] text-gray-500 font-medium">
                                Renews at $10/mo · Cancel anytime
                            </span>
                        </div>
                    </div>

                    {/* 2. LIFETIME PLAN (One-time) */}
                    <div className="bg-brand-dark text-white rounded-xl p-4 sm:p-5 border border-brand-dark flex flex-col justify-between transition-colors relative">
                        <div>
                            {/* Card Header & Badge */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                                    Lifetime
                                </div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-brand-green border border-brand-green/40 px-2 py-0.5 rounded-md">
                                    Pay Once
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1.5 mt-1.5 mb-0.5">
                                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    $99
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] sm:text-xs font-bold text-white/90 leading-tight">
                                        one-time
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] text-white/50 font-medium leading-tight">
                                        pay once, keep forever
                                    </span>
                                </div>
                            </div>

                            {/* Action CTA */}
                            <div className="my-3 sm:my-3.5">
                                <button
                                    type="button"
                                    onClick={() => !loadingPlanId && handlePlanSelect('lifetime')}
                                    disabled={!!loadingPlanId || currentPlanId === 'lifetime'}
                                    data-ml-goal="checkout_click"
                                    data-ml-goal-plan="lifetime"
                                    className="w-full py-2.5 sm:py-3 px-3 rounded-lg bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
                                >
                                    {loadingPlanId === 'lifetime' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="loader loader-sm" />
                                            <span>Redirecting...</span>
                                        </span>
                                    ) : currentPlanId === 'lifetime' ? (
                                        'Current plan'
                                    ) : (
                                        <>
                                            <span>Get Lifetime Access</span>
                                            <ArrowRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Features list */}
                            <ul className="space-y-2 text-xs sm:text-sm text-white/90">
                                <li className="flex items-center gap-2 font-medium">
                                    <span className="h-4 w-4 rounded grid place-content-center shrink-0 bg-brand-green/20 border border-brand-green/40 text-brand-green">
                                        <CheckCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                                    </span>
                                    <span>All 20+ ATS templates & styling</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <span className="h-4 w-4 rounded grid place-content-center shrink-0 bg-brand-green/20 border border-brand-green/40 text-brand-green">
                                        <CheckCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                                    </span>
                                    <span>Unlimited AI tailoring & ATS scoring</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <span className="h-4 w-4 rounded grid place-content-center shrink-0 bg-brand-green/20 border border-brand-green/40 text-brand-green">
                                        <CheckCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                                    </span>
                                    <span>Cover Letters & Interview Question Prep</span>
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <span className="h-4 w-4 rounded grid place-content-center shrink-0 bg-brand-green/20 border border-brand-green/40 text-brand-green">
                                        <CheckCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                                    </span>
                                    <span>One-time payment · Zero renewals ever</span>
                                </li>
                            </ul>
                        </div>

                        {/* Card Footer Note */}
                        <div className="mt-3.5 pt-2.5 border-t border-white/10 text-center">
                            <span className="text-[11px] text-white/50 font-medium">
                                One-time payment · Lifetime access
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation card when upgrading from Build to Lifetime */}
            <LifetimeUpgradeModal
                isOpen={showLifetimeConfirm}
                onClose={() => setShowLifetimeConfirm(false)}
                onConfirm={() => executeCheckout('lifetime')}
                isLoading={loadingPlanId === 'lifetime'}
            />
        </div>,
        document.body
    );
}
