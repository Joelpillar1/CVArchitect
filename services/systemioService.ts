// System.io Email Marketing Service
// Handles adding subscribers to System.io email lists/sequences

import { supabase } from '../lib/supabase';

interface SystemIoSubscriber {
    email: string;
    first_name?: string;
    last_name?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
}

/**
 * Add a subscriber to System.io via Supabase Edge Function
 * This is called after successful signup
 * 
 * @param subscriber - Subscriber information
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function addSubscriberToSystemIo(subscriber: SystemIoSubscriber): Promise<boolean> {
    try {
        // Get Supabase project URL from environment
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
            console.error('VITE_SUPABASE_URL not configured');
            return false;
        }

        // Get anon key for Edge Function call
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!anonKey) {
            console.error('VITE_SUPABASE_ANON_KEY not configured');
            return false;
        }

        // Construct Edge Function URL
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/systemio-subscribe`;

        // Call Edge Function
        const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`,
            },
            body: JSON.stringify(subscriber),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Failed to add subscriber to System.io:', errorData);
            return false;
        }

        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error('Error adding subscriber to System.io:', error);
        // Fail silently - don't break signup if email service fails
        return false;
    }
}

/**
 * Helper function to parse full name into first and last name
 */
export function parseName(fullName: string): { first_name: string; last_name: string } {
    const parts = fullName.trim().split(' ');
    return {
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' ') || '',
    };
}

/**
 * Add a new signup to System.io
 * Call this after successful user registration
 */
export async function addNewSignupToSystemIo(
    email: string,
    fullName?: string,
    userId?: string
): Promise<void> {
    const { first_name, last_name } = fullName ? parseName(fullName) : { first_name: '', last_name: '' };

    await addSubscriberToSystemIo({
        email,
        first_name,
        last_name,
        tags: ['new-signup', 'cv-architect-user'],
        custom_fields: {
            signup_date: new Date().toISOString(),
            ...(userId && { user_id: userId }),
        },
    });
}
