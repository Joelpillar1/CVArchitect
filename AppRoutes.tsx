import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Page Components
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import RefundPolicy from './components/RefundPolicy';
import PricingPage from './components/PricingPage';

// New dashboard with nested routing
import Dashboard from './pages/Dashboard';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        const redirectUrl = location.pathname + location.search;
        return <Navigate to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} replace />;
    }

    return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already logged in)
interface PublicRouteProps {
    children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

// Reset Password Route Component (allows authenticated users for password reset flow)
interface ResetPasswordRouteProps {
    children: React.ReactNode;
}

function ResetPasswordRoute({ children }: ResetPasswordRouteProps) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Allow both authenticated and unauthenticated users to access reset password page
    // The ResetPassword component will handle validation of the reset token
    return <>{children}</>;
}

// Wrapper components for legal pages that need onBack prop
function PrivacyPolicyWrapper() {
    const navigate = useNavigate();
    return <PrivacyPolicy onBack={() => navigate(-1)} />;
}

function TermsOfServiceWrapper() {
    const navigate = useNavigate();
    return <TermsOfService onBack={() => navigate(-1)} />;
}

// Wrapper component for ResetPassword that provides onSuccess callback
function ResetPasswordWrapper() {
    const navigate = useNavigate();
    return <ResetPassword onSuccess={() => navigate('/login', { replace: true })} />;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPasswordRoute><ResetPasswordWrapper /></ResetPasswordRoute>} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicyWrapper />} />
            <Route path="/terms" element={<TermsOfServiceWrapper />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Protected Route - Dashboard with nested routes */}
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
