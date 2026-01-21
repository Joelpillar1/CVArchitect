import { supabase } from '../lib/supabase';
import { ResumeData } from '../types';

export interface SavedResume {
    id: string;
    user_id: string;
    title: string;
    content: ResumeData | string; // Can be object (JSONB) or string
    created_at: string;
    updated_at: string;
}

export const resumeService = {
    async getResumes(userId: string): Promise<SavedResume[]> {
        try {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching resumes:', error);
                throw error;
            }
            
            console.log(`Fetched ${data?.length || 0} resumes for user ${userId}`);
            return data || [];
        } catch (error) {
            console.error('Error fetching resumes:', error);
            return [];
        }
    },

    async saveResume(userId: string, title: string, content: ResumeData): Promise<string> {
        try {
            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: userId,
                    title,
                    content,
                })
                .select()
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error('Error saving resume:', error);
            throw error;
        }
    },

    async updateResume(resumeId: string, title: string, content: ResumeData): Promise<void> {
        try {
            const { error } = await supabase
                .from('resumes')
                .update({
                    title,
                    content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', resumeId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating resume:', error);
            throw error;
        }
    },

    async deleteResume(resumeId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('resumes')
                .delete()
                .eq('id', resumeId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting resume:', error);
            throw error;
        }
    },

    // Alias for saveResume (some parts of the app call it createResume)
    async createResume(userId: string, title: string, content: ResumeData): Promise<string> {
        return this.saveResume(userId, title, content);
    },
};
