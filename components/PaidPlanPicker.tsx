import React, { useState } from 'react';
import { PlanId } from '../types/pricing';
import { isPaidPlan } from '../utils/pricingConfig';
import { upgradeToPlan } from '../services/dodoPaymentsService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PricingSection from './ui/pricing';

interface PaidPlanPickerProps {
    currentPlanId?: string;
    dodoSubscriptionId?: string;
    onPlanChanged?: () => void;
    showLifetime?: boolean;
}

export default function PaidPlanPicker({
    currentPlanId = 'free',
    dodoSubscriptionId,
    onPlanChanged,
    showLifetime = true,
}: PaidPlanPickerProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);

    const isPaidSubscriber = isPaidPlan(currentPlanId);

    const handlePlanSelect = async (planId: PlanId) => {
        if (!user) {
            showToast('Please sign in to manage your plan', 'error');
            return;
        }

        if (planId === currentPlanId) return;

        setLoadingPlanId(planId);
        try {
            const result = await upgradeToPlan(planId, {
                hasDodoSubscription: Boolean(dodoSubscriptionId),
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
            }
        } catch (error) {
            console.error('Plan change failed:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to update plan. Please try again.',
                'error'
            );
            setLoadingPlanId(null);
        }
    };

    return (
        <div className="w-full">
            <PricingSection
                onSelectPlan={handlePlanSelect}
                loadingPlanId={loadingPlanId}
                currentPlanId={currentPlanId}
                isPaidSubscriber={isPaidSubscriber}
                compact={true}
                showLifetime={showLifetime}
            />
        </div>
    );
}
