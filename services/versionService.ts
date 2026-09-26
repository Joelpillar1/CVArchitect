import { supabase } from '../lib/supabase';
import { ResumeData } from '../types';
import { cleanSerializableObject, isValidUUID } from './resumeService';

export interface ResumeVersion {
    id: string;
    resume_id: string;
    version_number: number;
    version_name?: string;
    change_summary?: string;
    content: ResumeData;
    created_at: string;
}

const VERSIONS_TABLE = 'resume_versions';

function getLocalVersionsKey(resumeId: string): string {
    return `cv_versions_${resumeId.trim()}`;
}

function getLocalVersions(resumeId: string): ResumeVersion[] {
    try {
        const raw = localStorage.getItem(getLocalVersionsKey(resumeId));
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to parse local resume versions:', e);
    }
    return [];
}

function saveLocalVersions(resumeId: string, versions: ResumeVersion[]): void {
    try {
        localStorage.setItem(getLocalVersionsKey(resumeId), JSON.stringify(versions));
    } catch (e) {
        console.warn('Failed to save local resume versions to localStorage:', e);
    }
}

export const versionService = {
    /**
     * Creates a new version snapshot in Supabase and local storage
     */
    async createVersion(
        resumeId: string,
        content: ResumeData,
        versionName?: string,
        changeSummary?: string
    ): Promise<ResumeVersion> {
        const cleanContent = cleanSerializableObject(content);
        const now = new Date().toISOString();
        const clientGeneratedId =
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : `ver_${Date.now()}`;

        // Get local version count for sequential numbering
        const localVersions = getLocalVersions(resumeId);
        const nextVersionNumber = localVersions.length > 0
            ? Math.max(...localVersions.map(v => v.version_number || 0)) + 1
            : 1;

        const versionRecord: ResumeVersion = {
            id: clientGeneratedId,
            resume_id: resumeId,
            version_number: nextVersionNumber,
            version_name: versionName || `Version ${nextVersionNumber}`,
            change_summary: changeSummary || 'Manual or AI snapshot',
            content: cleanContent,
            created_at: now,
        };

        // 1. Try Supabase if valid UUID
        if (isValidUUID(resumeId)) {
            try {
                const { data, error } = await supabase
                    .from(VERSIONS_TABLE)
                    .insert({
                        id: clientGeneratedId,
                        resume_id: resumeId,
                        version_number: nextVersionNumber,
                        version_name: versionRecord.version_name,
                        change_summary: versionRecord.change_summary,
                        content: cleanContent,
                        created_at: now,
                    })
                    .select()
                    .single();

                if (!error && data) {
                    const dbRecord: ResumeVersion = {
                        id: data.id,
                        resume_id: data.resume_id,
                        version_number: data.version_number,
                        version_name: data.version_name || versionRecord.version_name,
                        change_summary: data.change_summary || versionRecord.change_summary,
                        content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
                        created_at: data.created_at || now,
                    };
                    // Also sync to local cache
                    saveLocalVersions(resumeId, [dbRecord, ...localVersions.filter(v => v.id !== dbRecord.id)]);
                    return dbRecord;
                } else if (error) {
                    console.warn(`[versionService] Supabase ${VERSIONS_TABLE} insert error:`, error.message);
                }
            } catch (err) {
                console.warn(`[versionService] Supabase ${VERSIONS_TABLE} exception:`, err);
            }
        }

        // 2. Fallback to LocalStorage
        saveLocalVersions(resumeId, [versionRecord, ...localVersions]);
        return versionRecord;
    },

    /**
     * Fetches all version snapshots for a given resume
     */
    async getVersions(resumeId: string): Promise<ResumeVersion[]> {
        if (!resumeId) return [];

        const localVersions = getLocalVersions(resumeId);

        // Try Supabase if valid UUID
        if (isValidUUID(resumeId)) {
            try {
                const { data, error } = await supabase
                    .from(VERSIONS_TABLE)
                    .select('*')
                    .eq('resume_id', resumeId)
                    .order('created_at', { ascending: false });

                if (!error && Array.isArray(data)) {
                    const parsed = data.map((v) => ({
                        id: v.id,
                        resume_id: v.resume_id,
                        version_number: v.version_number,
                        version_name: v.version_name || `Version ${v.version_number}`,
                        change_summary: v.change_summary || '',
                        content: typeof v.content === 'string' ? JSON.parse(v.content) : v.content,
                        created_at: v.created_at,
                    }));
                    // Update local cache
                    saveLocalVersions(resumeId, parsed);
                    return parsed;
                } else if (error) {
                    console.warn(`[versionService] Error fetching from ${VERSIONS_TABLE}:`, error.message);
                }
            } catch (err) {
                console.warn(`[versionService] Exception fetching from ${VERSIONS_TABLE}:`, err);
            }
        }

        // Fallback to local versions
        return localVersions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    /**
     * Restores a version by ID
     */
    async restoreVersion(resumeId: string, versionId: string): Promise<ResumeData | null> {
        const versions = await this.getVersions(resumeId);
        const match = versions.find(v => v.id === versionId);
        if (match && match.content) {
            return match.content;
        }
        return null;
    },

    /**
     * Deletes a specific version snapshot
     */
    async deleteVersion(resumeId: string, versionId: string): Promise<boolean> {
        // Delete from local cache
        const localVersions = getLocalVersions(resumeId);
        const updated = localVersions.filter(v => v.id !== versionId);
        saveLocalVersions(resumeId, updated);

        // Delete from Supabase if valid
        if (isValidUUID(resumeId) && isValidUUID(versionId)) {
            try {
                const { error } = await supabase
                    .from(VERSIONS_TABLE)
                    .delete()
                    .eq('id', versionId);

                if (error) {
                    console.warn(`[versionService] Error deleting from ${VERSIONS_TABLE}:`, error.message);
                }
            } catch (err) {
                console.warn(`[versionService] Exception deleting from ${VERSIONS_TABLE}:`, err);
            }
        }

        return true;
    },
};
