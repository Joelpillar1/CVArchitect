// Supabase Edge Function: systemio-subscribe
// Adds new users to System.io email marketing platform

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SystemIoSubscriber {
    email: string;
    first_name?: string;
    last_name?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders,
            status: 200
        })
    }

    try {
        // Get System.io API credentials from environment
        const systemIoApiKey = Deno.env.get('SYSTEMIO_API_KEY')
        const systemIoListId = Deno.env.get('SYSTEMIO_LIST_ID') || Deno.env.get('SYSTEMIO_SEQUENCE_ID')

        if (!systemIoApiKey) {
            console.error('System.io API key not configured')
            // Don't throw error - fail silently so signup doesn't break
            return new Response(
                JSON.stringify({ success: false, message: 'System.io not configured' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                }
            )
        }

        // Parse request body
        const { email, first_name, last_name, tags, custom_fields }: SystemIoSubscriber = await req.json()

        if (!email) {
            throw new Error('Email is required')
        }

        // System.io API endpoint
        // Documentation: https://system.io/api-docs/
        const systemIoUrl = `https://api.system.io/v1/subscribers`

        // Prepare subscriber data for System.io
        const subscriberData: any = {
            email: email,
            status: 'active', // or 'unconfirmed' if you want double opt-in
        }

        // Add name if provided
        if (first_name) {
            subscriberData.first_name = first_name
        }
        if (last_name) {
            subscriberData.last_name = last_name
        }

        // Add tags if provided (e.g., ['new-signup', 'cv-architect-user'])
        if (tags && tags.length > 0) {
            subscriberData.tags = tags
        }

        // Add custom fields if provided
        if (custom_fields) {
            subscriberData.custom_fields = custom_fields
        }

        // If list/sequence ID is provided, add subscriber to specific list
        if (systemIoListId) {
            subscriberData.list_id = systemIoListId
        }

        // Call System.io API
        const response = await fetch(systemIoUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${systemIoApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriberData),
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('System.io API error:', errorData)
            // Don't throw - fail silently so signup doesn't break
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    message: 'Failed to add to System.io',
                    error: errorData 
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                }
            )
        }

        const data = await response.json()

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: 'Subscriber added to System.io',
                data: data 
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error: any) {
        console.error('Edge Function Error:', error)
        
        // Fail silently - don't break signup if email service fails
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message || 'An error occurred',
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200  // Return 200 to avoid breaking signup flow
            }
        )
    }
})
