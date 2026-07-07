import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ToolsDropdown from './ToolsDropdown';

interface PublicHeaderProps {
    variant?: 'default' | 'floating';
}

export default function PublicHeader({ variant = 'default' }: PublicHeaderProps) {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleNavigation = (path: string) => {
        if (path.startsWith('/#')) {
            navigate('/');
            setTimeout(() => {
                const id = path.substring(2);
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            navigate(path);
        }
        setIsMobileMenuOpen(false);
    };

    const handleGoogleSignIn = async () => {
        const { error } = await signInWithGoogle();
        if (error) console.error('Google sign in failed:', error);
    };

    const navLinks = [
        { label: 'Features', path: '/#features' },
        { label: 'The Difference', path: '/#the-difference' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'Blog', path: '/blog' },
    ];

    const isFloating = variant === 'floating';

    const navContent = (
        <>
            <button onClick={() => navigate('/')} className="flex shrink-0 items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="/images/logo icon.png" alt="CV Architect Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold tracking-tight text-brand-dark md:text-xl">CV Architect</span>
            </button>

            <div className={`hidden items-center gap-6 lg:flex ${isFloating ? 'flex-1 justify-center' : 'absolute left-1/2 -translate-x-1/2'}`}>
                {navLinks.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleNavigation(item.path)}
                        className="text-sm font-medium text-gray-600 hover:text-brand-dark transition-colors relative group whitespace-nowrap"
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full" />
                    </button>
                ))}
                <ToolsDropdown />
            </div>

            <div className="hidden shrink-0 items-center gap-2 md:flex">
                {user ? (
                    <>
                        <div className="flex max-w-[140px] items-center gap-2 rounded-full bg-brand-secondary px-3 py-1.5">
                            <User size={16} className="shrink-0 text-gray-600" />
                            <span className="truncate text-sm font-medium text-gray-700">
                                {user.user_metadata?.full_name || user.email}
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGetStarted}
                            className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover whitespace-nowrap"
                        >
                            Dashboard →
                        </motion.button>
                    </>
                ) : (
                    <>
                        {!isFloating && (
                            <button
                                onClick={handleSignIn}
                                className="text-sm font-medium text-brand-dark transition-colors hover:text-brand-green whitespace-nowrap"
                            >
                                Sign in
                            </button>
                        )}
                        {isFloating && (
                            <button
                                onClick={handleGoogleSignIn}
                                className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-secondary whitespace-nowrap"
                            >
                                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="hidden xl:inline">Join with Google</span>
                                <span className="xl:hidden">Google</span>
                            </button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGetStarted}
                            className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-brand-dark shadow-sm transition-colors hover:bg-brand-greenHover whitespace-nowrap"
                        >
                            {isFloating ? 'Try it free →' : 'Get Started'}
                        </motion.button>
                    </>
                )}
            </div>

            <button
                className="shrink-0 p-2 text-brand-dark md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </>
    );

    if (isFloating) {
        return (
            <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
                <motion.nav
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full max-w-6xl"
                >
                    <div className="flex h-16 w-full items-center justify-between gap-3 rounded-2xl border border-brand-border/70 bg-white/95 px-4 backdrop-blur-xl md:px-5">
                        {navContent}
                    </div>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 overflow-hidden rounded-2xl border border-brand-border/70 bg-white md:hidden"
                            >
                                <div className="flex flex-col gap-6 p-6">
                                    {navLinks.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleNavigation(item.path)}
                                            className="border-b border-gray-50 py-2 text-left text-lg font-bold text-brand-dark last:border-0 hover:text-brand-green"
                                        >
                                            {item.label}
                                        </button>
                                    ))}

                                    <ToolsDropdown isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />

                                    <div className="flex flex-col gap-3 pt-2">
                                        {user ? (
                                            <button
                                                onClick={handleGetStarted}
                                                className="w-full rounded-xl bg-brand-green py-3 font-bold text-brand-dark shadow-sm"
                                            >
                                                Go to Dashboard
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleGoogleSignIn}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border py-3 font-semibold text-brand-dark hover:bg-brand-secondary"
                                                >
                                                    Join with Google
                                                </button>
                                                <button
                                                    onClick={handleGetStarted}
                                                    className="w-full rounded-xl bg-brand-green py-3 font-bold text-brand-dark shadow-sm hover:bg-brand-greenHover"
                                                >
                                                    Try it free →
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </div>
        );
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md"
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {navContent}
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            {navLinks.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleNavigation(item.path)}
                                    className="text-lg font-bold text-brand-dark hover:text-brand-green text-left py-2 border-b border-gray-50 last:border-0"
                                >
                                    {item.label}
                                </button>
                            ))}

                            <ToolsDropdown isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />

                            <div className="pt-4 flex flex-col gap-4">
                                {user ? (
                                    <button
                                        onClick={handleGetStarted}
                                        className="w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold shadow-sm"
                                    >
                                        Go to Dashboard
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleGoogleSignIn}
                                            className="w-full flex items-center justify-center gap-2 border border-brand-border text-brand-dark py-3 rounded-xl font-semibold hover:bg-brand-secondary"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Join with Google
                                        </button>
                                        <button
                                            onClick={handleGetStarted}
                                            className="w-full bg-brand-green text-brand-dark py-3 rounded-xl font-bold shadow-sm hover:bg-brand-greenHover"
                                        >
                                            Try it free →
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
