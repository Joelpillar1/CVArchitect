import { supabase } from '../utils/supabase';
import { ResumeData } from '../types';

export interface ResumeVersion {
    id: string;
    resume_id: string;
    user_id: string;
    version_number: number;
    version_name: string | null;
    title: string;
    content: ResumeData;
    created_at: string;
}

export interface Resume {
    id: string;
    user_id: string;
    title: string;
    content: ResumeData;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    version_number: number;
    version_name: string | null;
    parent_resume_id: string | null;
}

export const versionService = {
    /**
     * Get all versions of a resume
     */
    async getVersions(resumeId: string): Promise<ResumeVersion[]> {
        const { data, error } = await supabase
            .from('resume_versions')
            .select('*')
            .eq('resume_id', resumeId)
            .order('version_number', { ascending: false });

        if (error) throw error;
        return data as ResumeVersion[];
    },

    /**
     * Get a specific version
     */
    async getVersion(versionId: string): Promise<ResumeVersion> {
        const { data, error } = await supabase
            .from('resume_versions')
            .select('*')
            .eq('id', versionId)
            .single();

        if (error) throw error;
        return data as ResumeVersion;
    },

    /**
     * Restore a specific version (creates new version from old one)
     */
    async restoreVersion(resumeId: string, versionId: string): Promise<Resume> {
        // Get the version to restore
        const version = await this.getVersion(versionId);

        // Update the resume with the version's content
        const { data, error } = await supabase
            .from('resumes')
            .update({
                content: version.content,
                title: version.title,
                updated_at: new Date().toISOString(),
            })
            .eq('id', resumeId)
            .select()
            .single();

        if (error) throw error;
        return data as Resume;
    },

    /**
     * Name/tag a specific version
     */
    async nameVersion(versionId: string, name: string): Promise<ResumeVersion> {
        const { data, error } = await supabase
            .from('resume_versions')
            .update({ version_name: name })
            .eq('id', versionId)
            .select()
            .single();

        if (error) throw error;
        return data as ResumeVersion;
    },

    /**
     * Name the current version of a resume
     */
    async nameCurrentVersion(resumeId: string, name: string): Promise<Resume> {
        const { data, error } = await supabase
            .from('resumes')
            .update({ version_name: name })
            .eq('id', resumeId)
            .select()
            .single();

        if (error) throw error;
        return data as Resume;
    },

    /**
     * Delete a specific version
     */
    async deleteVersion(versionId: string): Promise<void> {
        const { error } = await supabase
            .from('resume_versions')
            .delete()
            .eq('id', versionId);

        if (error) throw error;
    },

    /**
     * Create a manual snapshot/version
     */
    async createSnapshot(resumeId: string, versionName?: string): Promise<ResumeVersion> {
        // Get current resume
        const { data: resume, error: resumeError } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', resumeId)
            .single();

        if (resumeError) throw resumeError;

        // Create version snapshot
        const { data, error } = await supabase
            .from('resume_versions')
            .insert({
                resume_id: resumeId,
                user_id: resume.user_id,
                version_number: resume.version_number,
                version_name: versionName || resume.version_name,
                title: resume.title,
                content: resume.content,
            })
            .select()
            .single();

        if (error) throw error;

        // Increment version number on resume
        await supabase
            .from('resumes')
            .update({
                version_number: resume.version_number + 1,
                version_name: null,
            })
            .eq('id', resumeId);

        return data as ResumeVersion;
    },

    /**
     * Get version count for a resume
     */
    async getVersionCount(resumeId: string): Promise<number> {
        const { count, error } = await supabase
            .from('resume_versions')
            .select('*', { count: 'exact', head: true })
            .eq('resume_id', resumeId);

        if (error) throw error;
        return count || 0;
    },

    /**
     * Compare two versions
     */
    async compareVersions(versionId1: string, versionId2: string): Promise<{
        version1: ResumeVersion;
        version2: ResumeVersion;
        differences: string[];
    }> {
        const [version1, version2] = await Promise.all([
            this.getVersion(versionId1),
            this.getVersion(versionId2),
        ]);

        // Simple difference detection (can be enhanced)
        const differences: string[] = [];

        if (version1.title !== version2.title) {
            differences.push('Title changed');
        }

        if (JSON.stringify(version1.content) !== JSON.stringify(version2.content)) {
            differences.push('Content changed');
        }

        return { version1, version2, differences };
    },
};
