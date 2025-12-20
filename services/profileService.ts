import { supabase } from '../lib/supabase';

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

export const profileService = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },
};
