import WhopSDK from "@whop/sdk";

// Get environment variables (Vite uses import.meta.env)
// @ts-ignore - Vite env variables
const WHOP_APP_ID = import.meta.env.VITE_WHOP_APP_ID || process.env.NEXT_PUBLIC_WHOP_APP_ID;
// @ts-ignore - Vite env variables
const WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY || process.env.WHOP_API_KEY;

// Validate environment variables
if (!WHOP_APP_ID) {
    console.warn('⚠️ WHOP_APP_ID is not set. Whop integration will not work.');
}

if (!WHOP_API_KEY) {
    console.warn('⚠️ WHOP_API_KEY is not set. Whop integration will not work.');
}

// Initialize Whop SDK client
// Note: The exact initialization may need to be updated based on Whop SDK version
// Check https://github.com/whopio/whopsdk-typescript for latest API
export const whopSdk = new WhopSDK({
    appID: WHOP_APP_ID || '',
    apiKey: WHOP_API_KEY || '',
});

// Export a function to check if Whop is properly configured
export function isWhopConfigured(): boolean {
    return !!(WHOP_APP_ID && WHOP_API_KEY);
}
