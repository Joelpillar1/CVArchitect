/** Resolve Supabase/Dodo secrets with common alias fallbacks. */

function getEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = Deno.env.get(key);
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export interface DodoConfig {
  apiKey: string;
  environment: string;
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
    environment: getEnv('DODO_PAYMENTS_ENVIRONMENT', 'DODO_ENVIRONMENT') || 'test_mode',
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
    supabaseUrl: getEnv('SUPABASE_URL'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY'),
  };
}

export function getDodoApiBaseUrl(environment: string): string {
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
