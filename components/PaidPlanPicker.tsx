import React, { useState } from 'react';
import { PlanId } from '../types/pricing';
import { isPaidPlan } from '../utils/pricingConfig';
import { upgradeToPlan } from '../services/creemPaymentsService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PricingSection from './ui/pricing';
import LifetimeUpgradeModal from './LifetimeUpgradeModal';

interface PaidPlanPickerProps {
    currentPlanId?: string;
    creemSubscriptionId?: string;
    dodoSubscriptionId?: string;
    onPlanChanged?: () => void;
    showLifetime?: boolean;
}

export default function PaidPlanPicker({
    currentPlanId = 'free',
    creemSubscriptionId,
    dodoSubscriptionId,
    onPlanChanged,
    showLifetime = true,
}: PaidPlanPickerProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
    const [showLifetimeConfirm, setShowLifetimeConfirm] = useState(false);

    const normalizedCurrentPlan =
        currentPlanId === 'week_pass' || currentPlanId === 'sprint' || currentPlanId === 'pro_monthly' || currentPlanId === 'blueprint'
            ? 'build'
            : currentPlanId;

    const isPaidSubscriber = isPaidPlan(currentPlanId);

    const executePlanUpgrade = async (planId: PlanId) => {
        setLoadingPlanId(planId);
        try {
            const result = await upgradeToPlan(planId, {
                hasCreemSubscription: Boolean(creemSubscriptionId || dodoSubscriptionId),
            });

            if (!result.usedCheckout) {
                showToast(
                    result.scheduled
                        ? result.message || 'Plan change scheduled for your next billing date.'
                        : result.message || 'Plan updated successfully.',
                    'success'
                );
                onPlanChanged?.();
                setLoadingPlanId(null);
                setShowLifetimeConfirm(false);
            }
        } catch (error) {
            console.error('Plan change failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to update plan. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
            setShowLifetimeConfirm(false);
        }
    };

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            showToast('Please sign in to manage your plan', 'error');
            return;
        }

        if (planId === currentPlanId || planId === normalizedCurrentPlan) return;

        // If user is on Lifetime, prevent selecting lower plans
        if (normalizedCurrentPlan === 'lifetime') {
            showToast('You already have active Lifetime access.', 'info');
            return;
        }

        // Intercept when user on Build clicks Lifetime to confirm the switch
        if (normalizedCurrentPlan === 'build' && planId === 'lifetime') {
            setShowLifetimeConfirm(true);
            return;
        }

        await executePlanUpgrade(planId);
    };

    return (
        <div className="w-full">
            <PricingSection
                onSelectPlan={handlePlanSelect}
                loadingPlanId={loadingPlanId}
                currentPlanId={currentPlanId}
                isLoggedIn={Boolean(user)}
                isPaidSubscriber={isPaidSubscriber}
                compact={true}
                showLifetime={showLifetime}
            />

            {/* Confirmation card when upgrading from Build to Lifetime */}
            <LifetimeUpgradeModal
                isOpen={showLifetimeConfirm}
                onClose={() => setShowLifetimeConfirm(false)}
                onConfirm={() => executePlanUpgrade('lifetime')}
                isLoading={loadingPlanId === 'lifetime'}
            />
        </div>
    );
}
