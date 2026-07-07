import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getPendingCheckoutPlan, syncPendingPlanFromSearch } from '../utils/pendingCheckout';

async function waitForOAuthSession(timeoutMs = 8000): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * After Google OAuth, Supabase may land on Site URL (/) with #access_token in the hash.
 * Parse the session, strip tokens from the URL, and route to dashboard with any pending plan.
 */
export default function OAuthRedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.includes('access_token=')) return;

        let cancelled = false;

        (async () => {
            await waitForOAuthSession();
            if (cancelled) return;

            syncPendingPlanFromSearch(location.search);
            const plan = getPendingCheckoutPlan();
            const planQuery = plan ? `?plan=${plan}` : '';

            const onDashboard = location.pathname.startsWith('/dashboard');
            const targetPath = onDashboard
                ? `${location.pathname}${location.search || planQuery}`
                : `/dashboard${planQuery}`;

            window.history.replaceState(null, '', targetPath);

            if (!onDashboard || location.search !== (planQuery || '')) {
                navigate(targetPath, { replace: true });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [location.pathname, location.search, navigate]);

    return null;
}
