import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Star, X, Zap, Lock } from 'lucide-react';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    feature: 'templates' | 'job-match' | 'general' | 'credits' | 'export';
    currentPlan?: string;
}

export default function PaywallModal({ isOpen, onClose, onUpgrade, feature, currentPlan = 'free' }: PaywallModalProps) {
    if (!isOpen) return null;

    const getContent = () => {
        switch (feature) {
            case 'templates':
                return {
                    title: "Unlock Premium Templates",
                    description: "Access our entire collection of ATS-optimized, designer-crafted templates.",
                    icon: <Star className="text-brand-dark fill-brand-dark" size={32} />,
                };
            case 'job-match':
                return {
                    title: "Unlimited AI Job Match",
                    description: "Optimize your resume for every single job application with unlimited AI analysis.",
                    icon: <Zap className="text-brand-dark fill-brand-dark" size={32} />,
                };
            case 'credits':
                return {
                    title: "Out of Credits",
                    description: currentPlan === 'lifetime'
                        ? "Purchase a credit pack to continue using AI features."
                        : "Upgrade to Pro for unlimited AI rewrites or buy a credit pack.",
                    icon: <Lock className="text-brand-dark" size={32} />,
                };
            case 'export':
                return {
                    title: "Premium Template",
                    description: "This template requires a Career Sprint or Marathon pass to export.",
                    icon: <Star className="text-brand-dark fill-brand-dark" size={32} />,
                };
            default:
                return {
                    title: "Upgrade to Pro",
                    description: "Unlock all premium features and unlimited AI power.",
                    icon: <Star className="text-brand-dark fill-brand-dark" size={32} />,
                };
        }
    };

    const content = getContent();

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-brand-green/20 max-h-[90vh] flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 text-gray-700 shadow-md flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"
                        aria-label="Close paywall"
                    >
                        <X size={20} />
                    </button>

                    <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2"></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg relative z-10 rotate-3">
                            {content.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-white relative z-10">{content.title}</h2>
                        <p className="text-gray-300 text-sm mt-2 relative z-10">{content.description}</p>
                    </div>

                    <div className="p-8 overflow-y-auto">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Check size={14} className="text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Access to all Premium Templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Check size={14} className="text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Unlimited AI Job Match Analysis</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Check size={14} className="text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Unlimited AI Rewrites & Enhancements</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <Check size={14} className="text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Priority Processing & Support</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={onUpgrade}
                                className="w-full py-4 bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                            >
                                <Zap size={20} className="group-hover:fill-current" />
                                {feature === 'credits' && currentPlan === 'lifetime' ? 'Buy Credits' : 'View Pricing'}
                            </button>

                            {/* Explicit cancel/close button for clarity, especially on mobile */}
                            <button
                                onClick={onClose}
                                className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                No thanks, continue with Free plan
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                7-day money-back guarantee • Cancel anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
