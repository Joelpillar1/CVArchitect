/** Node/Vercel env mapping — mirrors supabase/functions/_shared/dodoConfig.ts */

export type DodoEnvironment = 'test_mode' | 'live_mode';

/** Normalize env values; defaults to test_mode (safe for development). */
export function normalizeDodoEnvironment(raw: string | undefined): DodoEnvironment {
  const value = (raw || 'test_mode').trim().replace(/^["']|["']$/g, '').toLowerCase();
  if (['live_mode', 'live', 'production', 'prod'].includes(value)) {
    return 'live_mode';
  }
  return 'test_mode';
}

function getEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export interface DodoConfig {
  apiKey: string;
  environment: DodoEnvironment;
  webhookKey: string;
  sprintProductId: string;
  buildProductId: string;
  blueprintProductId: string;
  appUrl: string;
  supabaseUrl: string;
  serviceRoleKey: string;
}

export function getDodoConfig(): DodoConfig {
  return {
    apiKey: getEnv('DODO_PAYMENTS_API_KEY', 'DODO_API_KEY'),
    environment: normalizeDodoEnvironment(
      getEnv('DODO_PAYMENTS_ENVIRONMENT', 'DODO_ENVIRONMENT') || 'test_mode'
    ),
    webhookKey: getEnv(
      'DODO_PAYMENTS_WEBHOOK_KEY',
      'DODO_WEBHOOK_SECRET',
      'DODO_WEBHOOK_KEY'
    ),
    sprintProductId: getEnv('DODO_SPRINT_PRODUCT_ID'),
    buildProductId: getEnv('DODO_BUILD_PRODUCT_ID', 'DODO_MARATHON_PRODUCT_ID'),
    blueprintProductId: getEnv(
      'DODO_BLUEPRINT_PRODUCT_ID',
      'DODO_QUARTERLY_PRODUCT_ID'
    ),
    appUrl: getEnv('APP_URL', 'VITE_APP_URL', 'SITE_URL') || 'https://cvarchitect.app',
    supabaseUrl: getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY'),
  };
}

export function getDodoApiBaseUrl(environment: DodoEnvironment): string {
  return environment === 'live_mode'
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com';
}

export function getProductIdForPlan(
  planId: 'sprint' | 'build' | 'blueprint',
  config: DodoConfig
): string {
  const map: Record<'sprint' | 'build' | 'blueprint', string> = {
    sprint: config.sprintProductId,
    build: config.buildProductId,
    blueprint: config.blueprintProductId,
  };
  return map[planId];
}

export function isDodoCheckoutConfigured(config: DodoConfig): boolean {
  return !!(
    config.apiKey &&
    config.sprintProductId &&
    config.buildProductId &&
    config.blueprintProductId &&
    config.supabaseUrl &&
    config.serviceRoleKey
  );
}
