import { supabase } from '../lib/supabase';
import { GeneratedCoverLetter } from '../components/utils/aiEnhancer';

export interface SavedCoverLetter {
    id: string;
    user_id: string;
    title: string;
    content: GeneratedCoverLetter;
    job_title?: string;
    company_name?: string;
    job_description?: string; // Stored in content metadata, not in DB column
    created_at: string;
    updated_at: string;
}

export const coverLetterService = {
    async getCoverLetters(userId: string): Promise<SavedCoverLetter[]> {
        try {
            const { data, error } = await supabase
                .from('cover_letters')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Supabase error fetching cover letters:', error);
                throw error;
            }

            // Transform the data to match our interface
            return (data || []).map((row: any) => {
                const content = row.content || {};
                return {
                    id: row.id,
                    user_id: row.user_id,
                    title: row.title,
                    content: content,
                    job_title: row.job_title,
                    company_name: row.company_name,
                    job_description: content.job_description || content.metadata?.job_description || null,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                };
            });
        } catch (error) {
            console.error('Error fetching cover letters:', error);
            return [];
        }
    },

    async createCoverLetter(
        userId: string,
        title: string,
        content: GeneratedCoverLetter,
        metadata?: { jobTitle?: string; companyName?: string; jobDescription?: string }
    ): Promise<string> {
        try {
            // Store job_description in content metadata since it's not a DB column
            const contentWithMetadata = {
                ...content,
                metadata: {
                    job_description: metadata?.jobDescription || null,
                }
            };

            const { data, error } = await supabase
                .from('cover_letters')
                .insert({
                    user_id: userId,
                    title,
                    content: contentWithMetadata,
                    job_title: metadata?.jobTitle || null,
                    company_name: metadata?.companyName || null,
                })
                .select()
                .single();

            if (error) {
                console.error('Supabase error creating cover letter:', error);
                throw error;
            }

            return data.id;
        } catch (error) {
            console.error('Error creating cover letter:', error);
            throw error;
        }
    },

    async updateCoverLetter(id: string, content: GeneratedCoverLetter): Promise<void> {
        try {
            const { error } = await supabase
                .from('cover_letters')
                .update({
                    content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) {
                console.error('Supabase error updating cover letter:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error updating cover letter:', error);
            throw error;
        }
    },

    async deleteCoverLetter(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('cover_letters')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Supabase error deleting cover letter:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error deleting cover letter:', error);
            throw error;
        }
    },

    // Alias for createCoverLetter (for backward compatibility)
    async saveCoverLetter(userId: string, title: string, content: any): Promise<string> {
        return this.createCoverLetter(userId, title, content);
    },
};
