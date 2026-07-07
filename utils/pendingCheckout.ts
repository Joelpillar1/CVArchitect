import { redirectToCheckout } from '../services/dodoPaymentsService';
import { PlanId } from '../types/pricing';
import { PAID_PLAN_IDS, getPlanDisplayName } from './pricingConfig';

const STORAGE_KEY = 'cvarchitect_pending_checkout_plan';

export function isCheckoutPlanId(value: string | null | undefined): value is PlanId {
    return !!value && PAID_PLAN_IDS.includes(value as PlanId);
}

function writePlanToStorage(planId: PlanId): void {
    try {
        sessionStorage.setItem(STORAGE_KEY, planId);
    } catch {
        // ignore
    }
}

function readPlanFromStorage(): PlanId | null {
    try {
        const value = sessionStorage.getItem(STORAGE_KEY);
        if (isCheckoutPlanId(value)) return value;
    } catch {
        // ignore
    }
    return null;
}

export function setPendingCheckoutPlan(planId: PlanId): void {
    writePlanToStorage(planId);
}

export function getPendingCheckoutPlan(): PlanId | null {
    return readPlanFromStorage();
}

export function clearPendingCheckoutPlan(): void {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}

/** Plan from ?plan= only — does not read session storage. */
export function getPlanFromSearch(search: string): PlanId | null {
    const fromUrl = new URLSearchParams(search).get('plan');
    return isCheckoutPlanId(fromUrl) ? fromUrl : null;
}

/**
 * Auth pages: persist plan when ?plan= is present; clear stale checkout state otherwise.
 */
export function applyPendingPlanFromSearch(search: string): PlanId | null {
    const fromUrl = getPlanFromSearch(search);
    if (fromUrl) {
        setPendingCheckoutPlan(fromUrl);
        return fromUrl;
    }
    clearPendingCheckoutPlan();
    return null;
}

/** Read ?plan= from URL, persist if valid, otherwise return stored pending plan. */
export function syncPendingPlanFromSearch(search: string): PlanId | null {
    const fromUrl = getPlanFromSearch(search);
    if (fromUrl) {
        setPendingCheckoutPlan(fromUrl);
        return fromUrl;
    }
    return getPendingCheckoutPlan();
}

export function getPendingPlanLabel(planId: PlanId): string {
    return getPlanDisplayName(planId);
}

/** Redirect to Dodo checkout if a paid plan is pending. Returns true if redirect started. */
export async function redirectToPendingCheckoutIfAny(): Promise<boolean> {
    const plan = getPendingCheckoutPlan();
    if (!plan) return false;

    try {
        await redirectToCheckout(plan);
        clearPendingCheckoutPlan();
        return true;
    } catch (error) {
        // Keep pending plan so dashboard/sign-in can retry
        throw error;
    }
}
