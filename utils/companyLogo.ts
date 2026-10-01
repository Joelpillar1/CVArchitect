export const KNOWN_COMPANY_DOMAINS: Record<string, string> = {
  notion: 'notion.so',
  monzo: 'monzo.com',
  suno: 'suno.com',
  duolingo: 'duolingo.com',
  discord: 'discord.com',
  openai: 'openai.com',
  stripe: 'stripe.com',
  figma: 'figma.com',
  reddit: 'reddit.com',
  vercel: 'vercel.com',
  linear: 'linear.app',
  spotify: 'spotify.com',
  airbnb: 'airbnb.com',
  scale: 'scale.com',
  'scale ai': 'scale.com',
  anthropic: 'anthropic.com',
  databricks: 'databricks.com',
  coinbase: 'coinbase.com',
  ramp: 'ramp.com',
  brex: 'brex.com',
  asana: 'asana.com',
  gitlab: 'gitlab.com',
  github: 'github.com',
  palantir: 'palantir.com',
  cloudflare: 'cloudflare.com',
  dropbox: 'dropbox.com',
  pinterest: 'pinterest.com',
  gusto: 'gusto.com',
  chime: 'chime.com',
  affirm: 'affirm.com',
  instacart: 'instacart.com',
  lyft: 'lyft.com',
  mongodb: 'mongodb.com',
  twilio: 'twilio.com',
  samsara: 'samsara.com',
  flexport: 'flexport.com',
  squarespace: 'squarespace.com',
  bereal: 'bereal.com',
  partiful: 'partiful.com',
  substack: 'substack.com',
  opal: 'opal.so',
  granola: 'granola.so',
  gamma: 'gamma.app',
  runna: 'runna.com',
  saturn: 'joinsaturn.com',
  'flo health': 'flo.health',
  wise: 'wise.com',
  assemblyai: 'assemblyai.com',
};

export function getCompanyDomain(companyName: string, websiteUrl?: string): string {
  if (websiteUrl) {
    const cleanUrl = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
    if (cleanUrl.includes('.')) return cleanUrl;
  }
  const cleanName = (companyName || '').toLowerCase().trim();
  if (KNOWN_COMPANY_DOMAINS[cleanName]) {
    return KNOWN_COMPANY_DOMAINS[cleanName];
  }
  // Try stripped name without spaces or punctuation
  const stripped = cleanName.replace(/[^a-z0-9]/g, '');
  if (KNOWN_COMPANY_DOMAINS[stripped]) {
    return KNOWN_COMPANY_DOMAINS[stripped];
  }
  return `${stripped || 'company'}.com`;
}

export function getCompanyLogoUrl(companyName: string, existingLogo?: string | null, websiteUrl?: string): string {
  if (existingLogo && existingLogo.startsWith('http')) {
    return existingLogo;
  }
  const domain = getCompanyDomain(companyName, websiteUrl);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}
