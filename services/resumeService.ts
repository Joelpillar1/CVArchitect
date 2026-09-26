import { supabase } from '../lib/supabase';
import { ResumeData } from '../types';
import { versionService } from './versionService';

export interface SavedResume {
    id: string;
    user_id: string;
    title: string;
    content: ResumeData | string; // Can be object (JSONB) or string
    job_data?: unknown;
    task_state?: unknown;
    created_at: string;
    updated_at: string;
}

// Primary table for all saved resumes
const PRIMARY_TABLE = 'saved_resumes';
// Fallback table for legacy backwards compatibility
const FALLBACK_TABLE = 'resumes';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUUID(id: string | null | undefined): boolean {
    if (!id || typeof id !== 'string') return false;
    return UUID_REGEX.test(id);
}

function isTableNotFoundError(error: any): boolean {
    if (!error) return false;
    return (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        (typeof error.message === 'string' && error.message.includes('Could not find the table'))
    );
}

/**
 * Safely sanitizes any payload for JSON serialization and DB persistence.
 * Drops DOM Nodes (HTMLSpanElement, etc.), React Fiber internals, functions,
 * symbols, and circular references so JSON.stringify never throws.
 */
export function cleanSerializableObject<T>(obj: T, seen = new WeakSet()): T {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') {
        if (typeof obj === 'function' || typeof obj === 'symbol') return undefined as any;
        return obj;
    }

    if (
        (typeof Node !== 'undefined' && obj instanceof Node) ||
        (typeof Element !== 'undefined' && obj instanceof Element) ||
        (typeof Window !== 'undefined' && obj instanceof Window) ||
        (obj as any).$$typeof ||
        (obj as any)._reactInternals ||
        (obj as any).stateNode
    ) {
        return undefined as any;
    }

    if (seen.has(obj as any)) {
        return undefined as any;
    }
    seen.add(obj as any);

    if (Array.isArray(obj)) {
        const arr: any[] = [];
        for (const item of obj) {
            const cleaned = cleanSerializableObject(item, seen);
            if (cleaned !== undefined) {
                arr.push(cleaned);
            }
        }
        return arr as any;
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (
            key.startsWith('__reactFiber') ||
            key.startsWith('_react') ||
            typeof value === 'function' ||
            typeof value === 'symbol'
        ) {
            continue;
        }
        const cleaned = cleanSerializableObject(value, seen);
        if (cleaned !== undefined) {
            result[key] = cleaned;
        }
    }
    return result as T;
}

export const resumeService = {
    async getResumes(userId: string): Promise<SavedResume[]> {
        try {
            // 1. Try fetching from primary saved_resumes table
            const { data, error } = await supabase
                .from(PRIMARY_TABLE)
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (!error && data) {
                console.log(`[resumeService] Fetched ${data.length} resumes from ${PRIMARY_TABLE} for user ${userId}`);
                if (data.length > 0) {
                    return data;
                }
            } else if (error) {
                console.warn(`[resumeService] Error fetching from ${PRIMARY_TABLE}, checking fallback:`, error.message);
            }

            // 2. If saved_resumes is empty or table had issues, check legacy resumes table
            const { data: legacyData, error: legacyError } = await supabase
                .from(FALLBACK_TABLE)
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (legacyError) {
                if (!isTableNotFoundError(legacyError)) {
                    console.error('[resumeService] Error fetching legacy resumes:', legacyError);
                }
                return data || [];
            }

            console.log(`[resumeService] Fetched ${legacyData?.length || 0} resumes from ${FALLBACK_TABLE} for user ${userId}`);
            return legacyData || data || [];
        } catch (error) {
            console.error('[resumeService] Error fetching resumes:', error);
            return [];
        }
    },

    async saveResume(userId: string, title: string, content: ResumeData): Promise<string> {
        const cleanContent = cleanSerializableObject(content);
        const now = new Date().toISOString();
        const clientGeneratedId =
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : undefined;

        // 1. Attempt insert into primary saved_resumes table
        try {
            const insertPayload: Record<string, unknown> = {
                user_id: userId,
                title,
                content: cleanContent,
                created_at: now,
                updated_at: now,
            };
            if (clientGeneratedId) {
                insertPayload.id = clientGeneratedId;
            }

            const { data, error } = await supabase
                .from(PRIMARY_TABLE)
                .insert(insertPayload)
                .select()
                .single();

            if (!error && data) {
                console.log(`[resumeService] saveResume created new resume id=${data.id} in ${PRIMARY_TABLE}`);
                return data.id;
            }

            if (error) {
                console.warn(`[resumeService] ${PRIMARY_TABLE} save failed (${error.message}), trying fallback:`, error);
            }
        } catch (primaryErr) {
            console.warn(`[resumeService] ${PRIMARY_TABLE} exception, trying fallback:`, primaryErr);
        }

        // 2. Fallback to legacy resumes table
        try {
            const { data: fallbackData, error: fallbackError } = await supabase
                .from(FALLBACK_TABLE)
                .insert({
                    user_id: userId,
                    title,
                    content: cleanContent,
                })
                .select()
                .single();

            if (fallbackError) {
                console.error('[resumeService] Fallback saveResume error:', fallbackError);
                throw fallbackError;
            }
            if (fallbackData) {
                console.log(`[resumeService] saveResume created new resume id=${fallbackData.id} in ${FALLBACK_TABLE}`);
                return fallbackData.id;
            }
            throw new Error('Failed to persist resume in both primary and fallback tables');
        } catch (fallbackCatch) {
            console.error('[resumeService] Error saving resume in fallback:', fallbackCatch);
            throw fallbackCatch;
        }
    },

    async updateResume(resumeId: string, title: string, content: ResumeData): Promise<boolean> {
        const cleanContent = cleanSerializableObject(content);
        const now = new Date().toISOString();

        // 1. If valid UUID, try updating in primary saved_resumes
        if (isValidUUID(resumeId)) {
            try {
                const { data, error } = await supabase
                    .from(PRIMARY_TABLE)
                    .update({
                        title,
                        content: cleanContent,
                        updated_at: now,
                    })
                    .eq('id', resumeId)
                    .select('id');

                if (error) {
                    console.warn(`[resumeService] ${PRIMARY_TABLE} update error:`, error.message);
                } else if (data && data.length > 0) {
                    console.log(`[resumeService] updateResume id=${resumeId} success in ${PRIMARY_TABLE} (${data.length} row(s) updated)`);
                    return true;
                } else {
                    // PostgREST returned no error but also no rows — the row either
                    // doesn't exist in this table or RLS silently blocked the update.
                    console.warn(`[resumeService] ${PRIMARY_TABLE} update matched 0 rows for id=${resumeId}, trying fallback`);
                }
            } catch (err) {
                console.warn(`[resumeService] ${PRIMARY_TABLE} update exception:`, err);
            }
        }

        // 2. Try legacy table
        try {
            const { data: legacyData, error: legacyError } = await supabase
                .from(FALLBACK_TABLE)
                .update({
                    title,
                    content: cleanContent,
                    updated_at: now,
                })
                .eq('id', resumeId)
                .select('id');

            if (!legacyError && legacyData && legacyData.length > 0) {
                console.log(`[resumeService] updateResume id=${resumeId} success in ${FALLBACK_TABLE} (${legacyData.length} row(s) updated)`);
                return true;
            }
            if (legacyError && !isTableNotFoundError(legacyError)) {
                console.warn(`[resumeService] ${FALLBACK_TABLE} update error:`, legacyError.message);
            }
            if (!legacyError && (!legacyData || legacyData.length === 0)) {
                console.warn(`[resumeService] ${FALLBACK_TABLE} update matched 0 rows for id=${resumeId}`);
            }
            return false;
        } catch (error) {
            console.error('[resumeService] Error updating resume in fallback:', error);
            return false;
        }
    },

    async updateResumeWithMetadata(
        resumeId: string,
        title: string,
        content: ResumeData,
        metadata?: { taskState?: unknown; jobData?: unknown }
    ): Promise<void> {
        try {
            const updates: Record<string, unknown> = {
                title,
                content,
                updated_at: new Date().toISOString(),
            };
            if (metadata?.taskState !== undefined) updates.task_state = metadata.taskState;
            if (metadata?.jobData !== undefined) updates.job_data = metadata.jobData;

            const { error } = await supabase
                .from(PRIMARY_TABLE)
                .update(updates)
                .eq('id', resumeId);

            if (error) {
                if (isTableNotFoundError(error)) {
                    await supabase
                        .from(FALLBACK_TABLE)
                        .update(updates)
                        .eq('id', resumeId);
                    return;
                }
                throw error;
            }
        } catch (error) {
            console.error('[resumeService] Error updating resume with metadata:', error);
            throw error;
        }
    },

    async createVersion(resumeId: string, content: ResumeData, versionName?: string, changeSummary?: string): Promise<void> {
        try {
            await versionService.createVersion(resumeId, content, versionName, changeSummary);
        } catch (error) {
            console.error('[resumeService] Error creating resume version:', error);
        }
    },

    async getVersions(resumeId: string): Promise<Array<{ id: string; version_number: number; version_name?: string; change_summary?: string; content: ResumeData; created_at: string }>> {
        try {
            return await versionService.getVersions(resumeId);
        } catch (error) {
            console.error('[resumeService] Error fetching resume versions:', error);
            return [];
        }
    },

    async deleteResume(resumeId: string): Promise<void> {
        try {
            // Delete from saved_resumes
            const { error } = await supabase
                .from(PRIMARY_TABLE)
                .delete()
                .eq('id', resumeId);

            // Also delete from legacy resumes if exists
            await supabase
                .from(FALLBACK_TABLE)
                .delete()
                .eq('id', resumeId);

            if (error && !isTableNotFoundError(error)) {
                throw error;
            }
        } catch (error) {
            console.error('[resumeService] Error deleting resume:', error);
            throw error;
        }
    },

    // Alias for saveResume
    async createResume(userId: string, title: string, content: ResumeData): Promise<string> {
        return this.saveResume(userId, title, content);
    },
};
