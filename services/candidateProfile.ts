import { supabase } from '../lib/supabase';

/**
 * Candidate fact store — memory SEPARATE from the rendered resume.
 *
 * The agent records grounded facts the candidate supplies in chat (e.g. answers to
 * clarifying questions) so it can (a) avoid re-asking and (b) cite them as evidence
 * for future edits — WITHOUT those facts silently becoming resume content. Facts only
 * enter the resume when an accepted `propose_operation` places them there.
 *
 * MVP persistence = localStorage, keyed by user id (falls back to an anon bucket when
 * signed out). The schema is intentionally shaped to mirror a future Supabase
 * `candidate_profile` table (RLS on `user_id`); `syncFactsToBackend` is a no-op seam
 * for that migration so callers don't change when it lands.
 */

export interface CandidateFact {
  id: string;
  topic: string;
  value: string;
  source: 'user' | 'resume';
  createdAt: number;
}

/** The minimal shape the server agent needs (no ids/timestamps). */
export interface CandidateFactSeed {
  topic: string;
  value: string;
}

const KEY_PREFIX = 'cv_architect_candidate_facts';

function storageKey(userId?: string | null): string {
  return `${KEY_PREFIX}:${userId || 'anon'}`;
}

function genId(): string {
  return `fact_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function loadFacts(userId?: string | null): CandidateFact[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (f): f is CandidateFact => f && typeof f.topic === 'string' && typeof f.value === 'string',
    );
  } catch {
    return [];
  }
}

function persist(userId: string | null | undefined, facts: CandidateFact[]): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(facts));
  } catch (e) {
    console.warn('candidateProfile: failed to persist facts', e);
  }
}

/**
 * Upsert a fact. If a fact with the same (case-insensitive) topic exists, its value is
 * updated in place; otherwise a new fact is appended. Returns the full updated list.
 */
export function saveFact(
  userId: string | null | undefined,
  seed: CandidateFactSeed & { source?: CandidateFact['source'] },
): CandidateFact[] {
  const topic = (seed.topic || '').trim();
  const value = (seed.value || '').trim();
  if (!topic || !value) return loadFacts(userId);

  const facts = loadFacts(userId);
  const idx = facts.findIndex((f) => f.topic.toLowerCase() === topic.toLowerCase());
  if (idx >= 0) {
    facts[idx] = { ...facts[idx], value, source: seed.source ?? facts[idx].source };
  } else {
    facts.push({ id: genId(), topic, value, source: seed.source ?? 'user', createdAt: Date.now() });
  }
  persist(userId, facts);
  if (userId) {
    void syncFactsToBackend(userId, facts);
  }
  return facts;
}

/** Reduce to the seed shape sent to the server agent for a run. */
export function factsForRun(facts: CandidateFact[]): CandidateFactSeed[] {
  return facts.map((f) => ({ topic: f.topic, value: f.value }));
}

/**
 * Mirror facts into Supabase `profiles.candidate_facts` (RLS on user_id).
 */
export async function syncFactsToBackend(userId: string, facts: CandidateFact[]): Promise<void> {
  if (!userId) return;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        candidate_facts: facts,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.warn('candidateProfile: failed to sync facts to Supabase', error);
    }
  } catch (e) {
    console.warn('candidateProfile: Supabase sync error', e);
  }
}

/**
 * Fetch candidate facts from Supabase backend on login/mount.
 */
export async function loadFactsFromBackend(userId: string): Promise<CandidateFact[]> {
  if (!userId) return loadFacts(userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('candidate_facts')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return loadFacts(userId);
    }

    if (Array.isArray(data.candidate_facts) && data.candidate_facts.length > 0) {
      persist(userId, data.candidate_facts);
      return data.candidate_facts;
    }

    return loadFacts(userId);
  } catch {
    return loadFacts(userId);
  }
}

