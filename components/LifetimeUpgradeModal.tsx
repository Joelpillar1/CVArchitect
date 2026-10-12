import React from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Zap, ShieldCheck, ArrowRight, Infinity as InfinityIcon } from 'lucide-react';
import { Loader } from './ui/Loader';

interface LifetimeUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LifetimeUpgradeModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LifetimeUpgradeModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-4 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden relative border border-brand-green/20 max-h-[92vh] flex flex-col animate-scaleIn my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 text-gray-700 shadow-sm flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header - Compact & Mobile-Responsive */}
        <div className="bg-brand-dark px-5 py-4 sm:px-6 sm:py-5 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-green/20 rounded-full blur-2xl -translate-y-1/2 pointer-events-none" />
          <div className="w-11 h-11 bg-gradient-to-br from-brand-green to-emerald-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md relative z-10 rotate-3">
            <InfinityIcon className="text-brand-dark stroke-[2.5]" size={22} />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white relative z-10 tracking-tight leading-snug">
            Switch to Lifetime Access
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-0.5 relative z-10 font-medium">
            Upgrade from monthly Build to permanent access.
          </p>
        </div>

        {/* Card Body - Streamlined and Compact */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {/* Step Explanation Callout */}
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-3 mb-3.5 text-left">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="text-emerald-700 shrink-0 mt-0.5" size={17} />
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                Pay <strong>$99 once</strong>. Your recurring <strong>$10/mo</strong> Build subscription will be cancelled automatically—no further renewals.
              </p>
            </div>
          </div>

          {/* Compact Checklist */}
          <div className="space-y-2 mb-4 text-xs sm:text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check size={12} className="text-green-600" strokeWidth={2.5} />
              </div>
              <span>Auto-cancel $10/mo recurring renewal</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check size={12} className="text-green-600" strokeWidth={2.5} />
              </div>
              <span>Permanent unlimited AI tailoring & ATS scoring</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check size={12} className="text-green-600" strokeWidth={2.5} />
              </div>
              <span>All present & future ATS templates forever</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check size={12} className="text-green-600" strokeWidth={2.5} />
              </div>
              <span>Unlimited PDF & Word exports with zero fees</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-brand-dark font-extrabold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Loader size="xs" variant="contrast" />
                  <span>Connecting to checkout...</span>
                </div>
              ) : (
                <>
                  <Zap size={16} className="fill-brand-dark" />
                  <span>Confirm & Pay $99 (Lifetime)</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
            >
              Keep my current $10/mo plan
            </button>

            <p className="text-center text-[11px] text-gray-400 font-medium pt-0.5">
              One-time payment • Never billed again • Secured by Creem
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
