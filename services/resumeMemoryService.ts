import { supabase } from '../lib/supabase';
import {
  ResumeAgentMemory,
  createEmptyResumeMemory,
  cloneResumeMemory,
} from '../utils/resumeAgentMemory';

const MEMORY_STORAGE_PREFIX = 'cv_architect_agent_memory';

function memoryStorageKey(resumeId?: string | null, userId?: string | null): string {
  const cleanId = (resumeId || 'draft').trim();
  const cleanUser = (userId || 'anon').trim();
  return `${MEMORY_STORAGE_PREFIX}_${cleanUser}_${cleanId}`;
}

/**
 * Loads the resume-scoped conversational memory for a specific resumeId.
 * Prioritizes local cache for zero-latency, then falls back to Supabase content.
 */
export async function getResumeAgentMemory(
  resumeId?: string | null,
  userId?: string | null
): Promise<ResumeAgentMemory> {
  const targetId = resumeId || 'draft';
  const key = memoryStorageKey(targetId, userId);

  // 1. Try local storage cache
  if (typeof localStorage !== 'undefined') {
    try {
      const cachedRaw = localStorage.getItem(key);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw) as ResumeAgentMemory;
        if (parsed && parsed.resumeId === targetId) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load resume memory from localStorage:', e);
    }
  }

  // 2. Try Supabase backend if user logged in and resumeId is a valid UUID
  if (userId && resumeId && !resumeId.startsWith('tmp_') && resumeId !== 'draft') {
    try {
      // Check saved_resumes first with user_id filter
      let { data, error } = await supabase
        .from('saved_resumes')
        .select('content')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        // Fallback to resumes table
        const fallback = await supabase
          .from('resumes')
          .select('content')
          .eq('id', resumeId)
          .eq('user_id', userId)
          .single();
        data = fallback.data;
        error = fallback.error;
      }

      if (!error && data?.content) {
        const resumeContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        if (resumeContent?.agentMemory) {
          const memory = resumeContent.agentMemory as ResumeAgentMemory;
          // Sync into localStorage cache
          if (typeof localStorage !== 'undefined') {
            try {
              localStorage.setItem(key, JSON.stringify(memory));
            } catch {
              /* ignore */
            }
          }
          return memory;
        }
      }
    } catch (e) {
      console.warn('Failed to load resume memory from Supabase:', e);
    }
  }

  return createEmptyResumeMemory(targetId);
}

/**
 * Persists the resume-scoped conversational memory both locally and to Supabase.
 */
export async function saveResumeAgentMemory(
  resumeId: string | null | undefined,
  memory: ResumeAgentMemory,
  userId?: string | null
): Promise<void> {
  const targetId = resumeId || 'draft';
  const key = memoryStorageKey(targetId, userId);
  const updatedMemory: ResumeAgentMemory = {
    ...memory,
    resumeId: targetId,
    updatedAt: Date.now(),
  };

  // 1. Save to LocalStorage immediately
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(updatedMemory));
    } catch (e) {
      console.warn('Failed to persist resume memory to localStorage:', e);
    }
  }

  // 2. Persist to Supabase if signed in and valid record
  if (userId && resumeId && !resumeId.startsWith('tmp_') && resumeId !== 'draft') {
    try {
      // Fetch current resume content to merge memory without overwriting other fields
      let { data, error } = await supabase
        .from('saved_resumes')
        .select('content')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();

      let targetTable = 'saved_resumes';
      if (error || !data) {
        const fallback = await supabase
          .from('resumes')
          .select('content')
          .eq('id', resumeId)
          .eq('user_id', userId)
          .single();
        data = fallback.data;
        targetTable = 'resumes';
      }

      if (data?.content) {
        const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        content.agentMemory = updatedMemory;

        await supabase
          .from(targetTable)
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resumeId)
          .eq('user_id', userId);
      }
    } catch (e) {
      console.warn('Failed to sync resume memory to Supabase:', e);
    }
  }
}

/**
 * Clones resume memory for a duplicated resume.
 * Ensures the clone is completely isolated and stored under the new resumeId.
 */
export function duplicateResumeAgentMemory(
  sourceResumeId: string,
  newResumeId: string,
  userId?: string | null
): ResumeAgentMemory {
  const sourceKey = memoryStorageKey(sourceResumeId, userId);
  let sourceMemory = createEmptyResumeMemory(sourceResumeId);

  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(sourceKey);
      if (raw) {
        sourceMemory = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read source memory for duplication:', e);
    }
  }

  const cloned = cloneResumeMemory(sourceMemory, newResumeId);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(memoryStorageKey(newResumeId, userId), JSON.stringify(cloned));
    } catch (e) {
      console.warn('Failed to save duplicated memory to localStorage:', e);
    }
  }

  return cloned;
}

/**
 * Removes local cached memory when a resume is deleted.
 */
export function removeResumeAgentMemory(resumeId: string, userId?: string | null): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(memoryStorageKey(resumeId, userId));
    } catch (e) {
      console.warn('Failed to remove resume memory:', e);
    }
  }
}
