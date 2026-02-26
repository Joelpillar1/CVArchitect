import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Detect brand-new Google OAuth signups and fire welcome email + Loops
            if (_event === 'SIGNED_IN' && session?.user) {
                const u = session.user;
                const isOAuth = u.app_metadata?.provider === 'google';
                const createdAt = new Date(u.created_at).getTime();
                const lastSignIn = new Date(u.last_sign_in_at ?? u.created_at).getTime();
                const isNewUser = Math.abs(lastSignIn - createdAt) < 10_000; // within 10 seconds
                const dedupeKey = `welcome_sent_${u.id}`;

                if (isOAuth && isNewUser && !localStorage.getItem(dedupeKey)) {
                    localStorage.setItem(dedupeKey, '1');
                    const name = u.user_metadata?.full_name || u.user_metadata?.name || '';
                    fetch('/api/welcome', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email: u.email }),
                    }).catch(err => console.warn('Welcome email (Google) failed (non-critical):', err));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
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
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
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
        await supabase.auth.signOut();
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
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
