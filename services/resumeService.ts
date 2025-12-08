import { supabase } from '../utils/supabase';
import { ResumeData } from '../types';

export interface SavedResume {
    id: string;
    user_id: string;
    title: string;
    content: ResumeData;
    created_at: string;
    updated_at: string;
    is_public: boolean;
}

export const resumeService = {
    async createResume(userId: string, title: string, content: ResumeData) {
        const { data, error } = await supabase
            .from('resumes')
            .insert([
                { user_id: userId, title, content }
            ])
            .select()
            .single();

        if (error) throw error;
        return data as SavedResume;
    },

    async getResumes(userId: string) {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as SavedResume[];
    },

    async getResume(id: string) {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as SavedResume;
    },

    async updateResume(id: string, content: ResumeData, title?: string) {
        const updates: any = {
            content,
            updated_at: new Date().toISOString(),
        };

        if (title) {
            updates.title = title;
        }

        const { data, error } = await supabase
            .from('resumes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as SavedResume;
    },

    async deleteResume(id: string) {
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
