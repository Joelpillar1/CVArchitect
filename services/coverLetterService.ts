import { supabase } from '../utils/supabase';
import { GeneratedCoverLetter } from '../components/utils/aiEnhancer';

export interface SavedCoverLetter {
    id: string;
    user_id: string;
    title: string;
    job_title: string;
    company_name: string;
    job_description?: string;
    content: GeneratedCoverLetter;
    created_at: string;
    updated_at: string;
}

export const coverLetterService = {
    async createCoverLetter(userId: string, title: string, content: GeneratedCoverLetter, metadata: {
        jobTitle: string;
        companyName: string;
        jobDescription?: string;
    }) {
        const { data, error } = await supabase
            .from('cover_letters')
            .insert([
                {
                    user_id: userId,
                    title,
                    content,
                    job_title: metadata.jobTitle,
                    company_name: metadata.companyName,
                    job_description: metadata.jobDescription
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data as SavedCoverLetter;
    },

    async getCoverLetters(userId: string) {
        const { data, error } = await supabase
            .from('cover_letters')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as SavedCoverLetter[];
    },

    async getCoverLetter(id: string) {
        const { data, error } = await supabase
            .from('cover_letters')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as SavedCoverLetter;
    },

    async updateCoverLetter(id: string, content: GeneratedCoverLetter, title?: string) {
        const updates: any = {
            content,
            updated_at: new Date().toISOString(),
        };

        if (title) {
            updates.title = title;
        }

        const { data, error } = await supabase
            .from('cover_letters')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as SavedCoverLetter;
    },

    async deleteCoverLetter(id: string) {
        const { error } = await supabase
            .from('cover_letters')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
