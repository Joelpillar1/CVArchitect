// Supabase Edge Function: ai-generate
// This function handles all AI operations securely on the backend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        // Get OpenAI API key from environment (set in Supabase Dashboard)
        const openaiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openaiKey) {
            throw new Error('OpenAI API key not configured in Supabase')
        }

        // Parse request body
        const { prompt, model = 'gpt-4o', temperature = 0.7, responseFormat = 'text' } = await req.json()

        if (!prompt) {
            throw new Error('Prompt is required')
        }

        // Prepare OpenAI request
        const openaiRequest: any = {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature,
        }

        // Add response format if JSON is requested
        if (responseFormat === 'json') {
            openaiRequest.response_format = { type: 'json_object' }
        }

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(openaiRequest),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
        }

        const data = await response.json()
        const result = data.choices[0]?.message?.content || ''

        return new Response(
            JSON.stringify({ result }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error: any) {
        console.error('Edge Function Error:', error)

        return new Response(
            JSON.stringify({
                error: error.message || 'An error occurred processing your request',
                result: ''
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200  // Return 200 to avoid CORS issues
            }
        )
    }
})
