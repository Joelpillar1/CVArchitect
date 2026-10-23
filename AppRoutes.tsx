import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useHydrating } from './contexts/HydrationContext';
import { applyPendingPlanFromSearch, getPendingCheckoutPlan } from './utils/pendingCheckout';

// Page Components
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import RefundPolicy from './components/RefundPolicy';
import PricingPage from './components/PricingPage';
import CoverLetterLandingPage from './components/CoverLetterLandingPage';
import ResumeTemplatesPage from './components/ResumeTemplatesPage';
import BlogPage from './components/BlogPage';
import BlogPost from './components/BlogPost';
import Support from './components/Support';
import ResumeMatchChecker from './components/ResumeMatchChecker';
import ActionVerbs from './components/ActionVerbs';
import CompareHubPage from './components/CompareHubPage';
import RoleTemplatePage from './components/RoleTemplatePage';
import ComparisonPage from './components/ComparisonPage';
import BestResumeBuildersPage from './components/BestResumeBuildersPage';
import BestCoverLetterBuildersPage from './components/BestCoverLetterBuildersPage';
import BestAtsResumeCheckersPage from './components/BestAtsResumeCheckersPage';
import BestFirstTimeResumeBuildersPage from './components/BestFirstTimeResumeBuildersPage';
import AgentLandingPage from './components/AgentLandingPage';
import PrintResumePage from './pages/PrintResumePage';

// New dashboard with nested routing
import Dashboard from './pages/Dashboard';
import ResumeAgentPage from './pages/ResumeAgentPage';
import ScreenshotEditorPage from './pages/ScreenshotEditorPage';
import { LoadingScreen } from './components/ui/Loader';

// TEMP DEV HARNESS — remove before shipping
import AgentToolbarTestPage from './dev/AgentToolbarTestPage';
import TemplatesComparePage from './dev/TemplatesComparePage';
import RegentReferenceCheck from './dev/RegentReferenceCheck';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Check if an OAuth callback is currently in flight in the URL
    const hasOAuthParams =
        typeof window !== 'undefined' &&
        (window.location.hash.includes('access_token') ||
         window.location.search.includes('code=') ||
         window.location.hash.includes('refresh_token'));

    if (loading || (hasOAuthParams && !user)) {
        return <LoadingScreen />;
    }

    if (!user) {
        const redirectUrl = location.pathname + location.search;
        return <Navigate to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'} replace />;
    }

    return <>{children}</>;
}

// Public Route Component (optionally redirect authenticated users, e.g. login/signup)
interface PublicRouteProps {
    children: React.ReactNode;
    redirectIfAuthenticated?: boolean;
}

function PublicRoute({ children, redirectIfAuthenticated = true }: PublicRouteProps) {
    const { user, loading } = useAuth();
    const hydrating = useHydrating();
    const location = useLocation();

    const hasOAuthParams =
        typeof window !== 'undefined' &&
        (window.location.hash.includes('access_token') ||
         window.location.search.includes('code=') ||
         window.location.hash.includes('refresh_token'));

    // Do not block public content (landing page, public tools, etc.) on auth loading
    if (!redirectIfAuthenticated) {
        return <>{children}</>;
    }

    if ((loading && !hydrating) || (hasOAuthParams && !user)) {
        return <LoadingScreen />;
    }

    if (user && redirectIfAuthenticated) {
        const plan = applyPendingPlanFromSearch(location.search);
        const searchParams = new URLSearchParams(location.search);
        const redirectTarget = searchParams.get('redirect');
        const destination = redirectTarget || (plan ? `/dashboard?plan=${plan}` : '/dashboard');
        return <Navigate to={destination} replace />;
    }

    return <>{children}</>;
}

// Localhost / Development Only Route Component
function isLocalhostEnvironment(): boolean {
    if (typeof window === 'undefined') return Boolean(import.meta.env.DEV);
    const host = window.location.hostname;
    return (
        Boolean(import.meta.env.DEV) ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '[::1]' ||
        host.startsWith('192.168.') ||
        host.startsWith('10.') ||
        host.endsWith('.local')
    );
}

function DevOnlyRoute({ children }: { children: React.ReactNode }) {
    if (!isLocalhostEnvironment()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
}

// Auth Callback Component
function AuthCallback() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (user) {
                const plan = getPendingCheckoutPlan();
                const searchParams = new URLSearchParams(location.search);
                const redirectTarget = searchParams.get('redirect');
                navigate(redirectTarget || (plan ? `/dashboard?plan=${plan}` : '/dashboard'), { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [user, loading, navigate, location.search]);

    return <LoadingScreen />;
}

// Reset Password Route Component (allows authenticated users for password reset flow)
interface ResetPasswordRouteProps {
    children: React.ReactNode;
}

function ResetPasswordRoute({ children }: ResetPasswordRouteProps) {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen message="Verifying reset link..." description="Preparing secure password reset" />;
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

function RefundPolicyWrapper() {
    const navigate = useNavigate();
    return <RefundPolicy onBack={() => navigate(-1)} />;
}

// Wrapper component for ResetPassword that provides onSuccess callback
function ResetPasswordWrapper() {
    const navigate = useNavigate();
    return <ResetPassword onSuccess={() => navigate('/login', { replace: true })} />;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Landing & Content Routes */}
            <Route path="/" element={<AgentLandingPage />} />
            <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPasswordRoute><ResetPasswordWrapper /></ResetPasswordRoute>} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicyWrapper />} />
            <Route path="/terms" element={<TermsOfServiceWrapper />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund-policy" element={<RefundPolicyWrapper />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/cover-letter" element={<CoverLetterLandingPage />} />
            <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
            <Route path="/resume-templates/:role" element={<RoleTemplatePage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/resume-checker" element={<ResumeMatchChecker />} />
            <Route path="/action-words" element={<ActionVerbs />} />

            {/* Comparisons (AEO) */}
            <Route path="/compare" element={<CompareHubPage />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            <Route path="/best-ai-resume-builders" element={<BestResumeBuildersPage />} />
            <Route path="/best-cover-letter-builders" element={<BestCoverLetterBuildersPage />} />
            <Route path="/best-ats-resume-checkers" element={<BestAtsResumeCheckersPage />} />
            <Route path="/best-resume-builders-for-first-time-writers" element={<BestFirstTimeResumeBuildersPage />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* DEV HARNESS & SCREENSHOT ROUTES — only active on localhost / dev environments */}
            <Route path="/dev-agent-test" element={<DevOnlyRoute><AgentToolbarTestPage /></DevOnlyRoute>} />
            <Route path="/dev-templates" element={<DevOnlyRoute><TemplatesComparePage /></DevOnlyRoute>} />
            <Route path="/dev-regent" element={<DevOnlyRoute><RegentReferenceCheck /></DevOnlyRoute>} />

            {/* Protected Route - Resume Agent */}
            <Route path="/resume-agent" element={<ProtectedRoute><ResumeAgentPage /></ProtectedRoute>} />

            {/* Main /editor shortcut route */}
            <Route path="/editor" element={<Navigate to="/dashboard/editor" replace />} />

            {/* Protected Route - Dashboard with nested routes */}
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Screenshot route for editor captures — localhost only */}
            <Route path="/screenshot" element={<DevOnlyRoute><ScreenshotEditorPage /></DevOnlyRoute>} />

            {/* Print/PDF capture route — used by Puppeteer, no auth needed */}
            <Route path="/print-resume" element={<PrintResumePage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
