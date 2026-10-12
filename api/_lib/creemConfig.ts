/** Resolve Creem configuration in Node.js / Vercel serverless environment */

export type CreemEnvironment = 'test' | 'production';

export function normalizeCreemEnvironment(raw: string | undefined): CreemEnvironment {
  const value = (raw || 'test').trim().replace(/^["']|["']$/g, '').toLowerCase();
  if (['production', 'prod', 'live', 'live_mode'].includes(value)) {
    return 'production';
  }
  return 'test';
}

function getEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export type CreemPlanId = 'build' | 'lifetime';

export interface CreemConfig {
  apiKey: string;
  environment: CreemEnvironment;
  webhookSecret: string;
  buildProductId: string;
  lifetimeProductId: string;
  appUrl: string;
  supabaseUrl: string;
  serviceRoleKey: string;
}

export function getCreemConfig(): CreemConfig {
  return {
    apiKey: getEnv('CREEM_API_KEY', 'CREEM_KEY', 'CREEM_SECRET_KEY'),
    environment: normalizeCreemEnvironment(
      getEnv('CREEM_ENVIRONMENT', 'CREEM_ENV', 'NODE_ENV')
    ),
    webhookSecret: getEnv('CREEM_WEBHOOK_SECRET', 'CREEM_SIGNING_SECRET', 'CREEM_WEBHOOK_KEY'),
    buildProductId: getEnv('CREEM_BUILD_PRODUCT_ID', 'CREEM_PRODUCT_BUILD', 'CREEM_MONTHLY_PRODUCT_ID'),
    lifetimeProductId: getEnv('CREEM_LIFETIME_PRODUCT_ID', 'CREEM_PRODUCT_LIFETIME'),
    appUrl: getEnv('APP_URL', 'VITE_APP_URL', 'SITE_URL') || 'https://cvarchitect.app',
    supabaseUrl: getEnv('SUPABASE_URL'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY'),
  };
}

export function getCreemApiBaseUrl(environment: CreemEnvironment): string {
  return environment === 'production'
    ? 'https://api.creem.io/v1'
    : 'https://test-api.creem.io/v1';
}

export function getProductIdForPlan(
  planId: CreemPlanId,
  config: CreemConfig
): string {
  const map: Record<CreemPlanId, string> = {
    build: config.buildProductId,
    lifetime: config.lifetimeProductId,
  };
  return map[planId] || '';
}

export function isCreemCheckoutConfigured(config: CreemConfig, planId?: CreemPlanId): boolean {
  if (!config.apiKey || !config.supabaseUrl || !config.serviceRoleKey) {
    return false;
  }
  if (planId) {
    return Boolean(getProductIdForPlan(planId, config));
  }
  return Boolean(config.buildProductId && config.lifetimeProductId);
}
