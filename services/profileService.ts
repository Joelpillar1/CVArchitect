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
    async deleteUser(userId: string): Promise<void> {
        try {
            // Step 1: Try to use the complete deletion function (deletes data + auth user)
            const { data, error: rpcError } = await supabase.rpc('delete_user_account_complete');

            if (!rpcError) {
                console.log('Account completely deleted via RPC:', data);
                // Sign out the user
                await supabase.auth.signOut();
                return;
            }

            console.warn('Complete RPC delete failed, trying data-only delete:', rpcError);

            // Step 2: Fallback to data-only deletion
            const { error: dataRpcError } = await supabase.rpc('delete_user_account');

            if (dataRpcError) {
                console.warn('Data RPC delete failed, falling back to manual delete:', dataRpcError);

                // Fallback: Delete data manually
                await Promise.all([
                    supabase.from('resumes').delete().eq('user_id', userId),
                    supabase.from('cover_letters').delete().eq('user_id', userId),
                    supabase.from('usage_logs').delete().eq('user_id', userId),
                    supabase.from('billing_history').delete().eq('user_id', userId),
                    supabase.from('subscriptions').delete().eq('user_id', userId),
                ]);

                // Finally delete the profile
                const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', userId);

                if (error) throw error;
            }

            console.log('User data deleted successfully for:', userId);

            // Step 3: Sign out the user (auth user may still exist if complete delete failed)
            await supabase.auth.signOut();

        } catch (error) {
            console.error('Error deleting user account:', error);
            throw error;
        }
    },
};
