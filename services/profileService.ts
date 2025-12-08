import { supabase } from '../utils/supabase';

export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    website: string | null;
    updated_at: string | null;
}

export const profileService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...updates,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'
            })
            .select()
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    async uploadAvatar(userId: string, file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update profile with new avatar URL
        await this.updateProfile(userId, { avatar_url: data.publicUrl });

        return data.publicUrl;
    },

    async deleteUser(userId: string) {
        const { error } = await supabase.rpc('delete_user');

        if (error) {
            console.error('Account deletion RPC failed', error);
            // Fallback: Delete public profile data if RPC fails/doesn't exist
            // This relies on Cascade Delete for dependent tables
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (profileError) throw profileError;
        }
    }
};
