import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component that handles Whop payment redirects
 * Whop redirects to root with query params like:
 * ?checkout_status=success&payment_id=pay_xxx&receipt_id=pay_xxx&status=success
 */
export default function WhopRedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // Check if this is a Whop redirect
        const checkoutStatus = params.get('checkout_status');
        const paymentId = params.get('payment_id');
        const receiptId = params.get('receipt_id');
        const status = params.get('status');

        const isWhopRedirect = checkoutStatus || paymentId || receiptId;

        if (isWhopRedirect) {
            console.log('Whop redirect detected:', { checkoutStatus, paymentId, receiptId, status });

            if (checkoutStatus === 'success' || status === 'success') {
                // Successful payment - redirect to activation page
                navigate('/activate-license', { replace: true });
            } else if (checkoutStatus === 'cancelled' || status === 'cancelled') {
                // Cancelled payment - redirect to pricing
                navigate('/pricing', { replace: true });
            }
        }
    }, [location, navigate]);

    return null; // This component doesn't render anything
}
