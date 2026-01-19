import WhopSDK from "@whop/sdk";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_WHOP_APP_ID) {
    console.warn('⚠️ NEXT_PUBLIC_WHOP_APP_ID is not set. Whop integration will not work.');
}

if (!process.env.WHOP_API_KEY) {
    console.warn('⚠️ WHOP_API_KEY is not set. Whop integration will not work.');
}

// Initialize Whop SDK client
// Note: The exact initialization may need to be updated based on Whop SDK version
// Check https://github.com/whopio/whopsdk-typescript for latest API
export const whopSdk = new WhopSDK({
    appID: process.env.NEXT_PUBLIC_WHOP_APP_ID || '',
    apiKey: process.env.WHOP_API_KEY || '',
});

// Export a function to check if Whop is properly configured
export function isWhopConfigured(): boolean {
    return !!(process.env.NEXT_PUBLIC_WHOP_APP_ID && process.env.WHOP_API_KEY);
}
