import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEO from './SEO';
import { PlanId } from '../types/pricing';
import { PLANS } from '../utils/pricingConfig';
import AuthHeroShowcase from './AuthHeroShowcase';
import {
    applyPendingPlanFromSearch,
    getPendingPlanLabel,
    redirectToPendingCheckoutIfAny,
    setPendingCheckoutPlan,
} from '../utils/pendingCheckout';

export default function SignIn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
    const { signIn, signInWithGoogle } = useAuth();

    useEffect(() => {
        setPendingPlan(applyPendingPlanFromSearch(window.location.search));
    }, [searchParams]);

    const selectedPlan = pendingPlan ? PLANS[pendingPlan] : null;
    const planQuery = pendingPlan ? `?plan=${pendingPlan}` : '';

    const handlePostAuthNavigation = async () => {
        try {
            const redirected = await redirectToPendingCheckoutIfAny();
            if (redirected) return;
        } catch (checkoutError) {
            console.error('Checkout redirect failed:', checkoutError);
            setError(
                checkoutError instanceof Error
                    ? checkoutError.message
                    : 'Signed in, but checkout could not start. Try upgrading from the dashboard.'
            );
            return;
        }

        navigate(redirectTo && redirectTo.startsWith('/dashboard') ? redirectTo : '/dashboard', { replace: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await signIn(email, password);
            if (error) throw error;

            if (!data?.session) {
                setError('Please verify your email address before signing in.');
                return;
            }

            await handlePostAuthNavigation();
        } catch (err: unknown) {
            console.error('Sign in error:', err);
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            if (pendingPlan) {
                setPendingCheckoutPlan(pendingPlan);
            }
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white font-sans selection:bg-brand-green/30">
            <SEO
                title="Sign In — CV Architect | AI Resume Builder"
                description="Sign in to your CV Architect account to continue building, editing, and tailoring your ATS-optimized resumes and cover letters."
                canonicalPath="/login"
            />

            {/* Left Column: Form (Full Height) */}
            <div className="lg:col-span-6 xl:col-span-5 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white z-10">
                {/* Top Bar: Brand & Back link */}
                <div className="flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/images/logo icon.png"
                            alt="CV Architect"
                            className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="font-bold text-xl tracking-tight text-brand-dark">
                            CV Architect
                        </span>
                    </a>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <ArrowLeft size={15} />
                        <span>Home</span>
                    </button>
                </div>

                {/* Center Form Container */}
                <div className="w-full max-w-[400px] mx-auto my-auto py-8">
                    {/* Header */}
                    <div className="mb-7 text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                            {selectedPlan
                                ? `Sign in to proceed to ${getPendingPlanLabel(pendingPlan!)} checkout`
                                : 'Enter your details to access your resume workspace'}
                        </p>
                    </div>

                    {selectedPlan && (
                        <div className="mb-5 flex items-center gap-3 rounded-xl border border-brand-green/50 bg-brand-green/10 px-3.5 py-2.5">
                            <Zap size={16} className="text-brand-dark shrink-0 fill-brand-green" />
                            <div className="text-xs text-brand-dark text-left">
                                <span className="font-bold">{selectedPlan.name}</span>
                                <span className="text-gray-600"> — {selectedPlan.billingLabel}</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-3.5 py-2.5 rounded-xl text-xs text-left animate-fadeIn">
                            {error}
                        </div>
                    )}

                    {/* Google OAuth Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-brand-dark py-3 px-4 rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                            <span className="px-3 bg-white text-gray-400">or sign in with email</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-sm text-brand-dark placeholder:text-gray-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-xs text-gray-500 hover:text-brand-dark font-medium transition-colors cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-sm text-brand-dark placeholder:text-gray-400"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-3 bg-brand-green hover:bg-brand-greenHover active:scale-[0.99] text-brand-dark py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>{loading ? 'Signing in...' : selectedPlan ? 'Sign In & Continue' : 'Sign in'}</span>
                        </button>
                    </form>

                    {/* Switcher to Sign Up */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        Don&apos;t have an account?{' '}
                        <button
                            onClick={() => navigate(`/signup${planQuery}`)}
                            className="text-brand-dark font-bold hover:underline cursor-pointer ml-1"
                        >
                            Create account
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center text-[11px] text-gray-400 pt-4 border-t border-gray-100">
                    <span>© {new Date().getFullYear()} CV Architect</span>
                </div>
            </div>

            {/* Right Column: Hero Showcase (Full Height) */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full min-h-screen sticky top-0">
                <AuthHeroShowcase headlineTop="Simple & Powerful" headlineBottom="Tailoring & Managing" />
            </div>
        </div>
    );
}


