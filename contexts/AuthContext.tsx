import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getPendingCheckoutPlan } from '../utils/pendingCheckout';
import { getAppUrl } from '../utils/appUrl';
import { getAttributionMetadata, trackSignupAttribution } from '../utils/attribution';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const hasAuthParams = typeof window !== 'undefined' && (
            window.location.hash.includes('access_token') ||
            window.location.search.includes('code=') ||
            window.location.hash.includes('refresh_token')
        );

        // Safety fallback timer if OAuth callback takes too long or fails
        let timeoutId: any = null;
        if (hasAuthParams) {
            timeoutId = setTimeout(() => {
                if (isMounted) {
                    setLoading(false);
                }
            }, 6000);
        }

        // If there is a PKCE code in query string, exchange it for a session
        if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            if (code) {
                supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
                    if (!isMounted) return;
                    if (data?.session) {
                        setSession(data.session);
                        setUser(data.session.user);
                        setLoading(false);
                        if (timeoutId) clearTimeout(timeoutId);
                    } else if (error) {
                        console.warn('exchangeCodeForSession error:', error);
                    }
                }).catch(err => {
                    console.warn('exchangeCodeForSession exception:', err);
                });
            }
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            if (session) {
                setSession(session);
                setUser(session.user);
                setLoading(false);
                if (timeoutId) clearTimeout(timeoutId);
            } else if (!hasAuthParams) {
                // Only mark loading as false if we aren't waiting for an in-flight OAuth exchange
                setSession(null);
                setUser(null);
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (timeoutId) clearTimeout(timeoutId);

            // Detect brand-new Google OAuth signups and fire welcome email fallback via Supabase Edge Function
            if (_event === 'SIGNED_IN' && session?.user) {
                const u = session.user;
                const isOAuth = u.app_metadata?.provider === 'google';
                const createdAt = new Date(u.created_at).getTime();
                const lastSignIn = new Date(u.last_sign_in_at ?? u.created_at).getTime();
                // Brand new user if last sign in is within 60 seconds of user creation
                const isNewUser = Math.abs(lastSignIn - createdAt) < 60_000;
                const dedupeKey = `welcome_sent_${u.id}`;

                if (isOAuth && isNewUser && !localStorage.getItem(dedupeKey)) {
                    localStorage.setItem(dedupeKey, '1');
                    const name = u.user_metadata?.full_name || u.user_metadata?.name || '';
                    supabase.functions
                        .invoke('resend-email', {
                            body: {
                                type: 'welcome',
                                email: u.email,
                                name,
                            },
                        })
                        .catch((err) => console.warn('Welcome email (Google fallback) failed (non-critical):', err));
                }

                // OAuth signups never pass through the signup form, so attach the
                // first-party attribution captured on arrival to the new account.
                if (isOAuth && isNewUser) {
                    const attributionKey = `attribution_sent_${u.id}`;
                    if (!u.user_metadata?.signup_source && !localStorage.getItem(attributionKey)) {
                        const attribution = getAttributionMetadata();
                        if (Object.keys(attribution).length > 0) {
                            localStorage.setItem(attributionKey, '1');
                            supabase.auth.updateUser({ data: attribution }).catch((err) => {
                                console.warn('Attribution backfill failed (non-critical):', err);
                            });
                        }
                    }
                    trackSignupAttribution('google');
                }
            }
        });

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        ...getAttributionMetadata(),
                    },
                },
            });

            if (error) throw error;

            // Supabase behavior: when an email is already registered, signUp may return
            // no error but an existing user with empty identities[]. Treat this as a
            // duplicate-email error so the UI can show a clear message.
            const identities = (data as any)?.user?.identities as any[] | undefined;
            if (identities && identities.length === 0) {
                throw new Error('This email is already registered.');
            }

            trackSignupAttribution('email');

            // Fire-and-forget welcome email via Supabase Edge Function + Resend.
            // Any failure here is logged but never blocks signup.
            supabase.functions
                .invoke('resend-email', {
                    body: {
                        type: 'welcome',
                        email,
                        name: fullName,
                    },
                })
                .catch((err) => {
                    console.error('Failed to send welcome email via Resend:', err);
                });

            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    };

    const signInWithGoogle = async () => {
        try {
            const pendingPlan = getPendingCheckoutPlan();
            const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
            const redirectParam = searchParams?.get('redirect');

            let targetPath = '/dashboard';
            if (pendingPlan) {
                targetPath = `/dashboard?plan=${pendingPlan}`;
            } else if (redirectParam) {
                targetPath = redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`;
            }

            const redirectTo = getAppUrl(targetPath);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const signOut = async () => {
        try {
            // Clear all user-specific and cached data from localStorage to prevent cross-account bleeding
            if (typeof localStorage !== 'undefined') {
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (
                        key &&
                        (key.startsWith('cv_architect_') ||
                         key.startsWith('cv_agent_') ||
                         key.startsWith('cv_app_') ||
                         key.startsWith('editor_') ||
                         key.startsWith('sb-') === false) // preserve supabase auth session handling if needed, remove app data
                    ) {
                        if (
                            key.startsWith('cv_architect_') ||
                            key.startsWith('cv_agent_') ||
                            key.startsWith('cv_app_') ||
                            key.startsWith('editor_')
                        ) {
                            keysToRemove.push(key);
                        }
                    }
                }
                keysToRemove.forEach((k) => localStorage.removeItem(k));
            }
        } catch (e) {
            console.warn('Failed to clear local storage on signOut:', e);
        }
        await supabase.auth.signOut();
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: getAppUrl('/reset-password'),
            });

            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
