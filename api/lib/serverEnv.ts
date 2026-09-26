/**
 * Server-side environment access for Vercel Node functions.
 *
 * Mirrors the first-non-empty lookup pattern used in `dodoConfig.ts`, but scoped to
 * the shared Supabase admin credentials + the OpenAI agent settings. Never imported
 * by client code — these values (service-role key, OpenAI key) must never reach the
 * browser bundle.
 */

/** First non-empty, trimmed value among the given env keys (or '' if none set). */
export function getEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export interface SupabaseAdminConfig {
  url: string;
  serviceRoleKey: string;
}

/** Supabase URL + service-role key used to verify a caller's access token. */
export function getSupabaseAdminConfig(): SupabaseAdminConfig {
  return {
    url: getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY'),
  };
}

export function isSupabaseAdminConfigured(config: SupabaseAdminConfig): boolean {
  return !!(config.url && config.serviceRoleKey);
}

export interface OpenAIConfig {
  apiKey: string;
  /** Default kept on the GPT-4o family per product decision; override via OPENAI_MODEL. */
  model: string;
}

export function getOpenAIConfig(): OpenAIConfig {
  return {
    apiKey: getEnv('OPENAI_API_KEY'),
    model: getEnv('OPENAI_MODEL') || 'gpt-4o-mini',
  };
}
