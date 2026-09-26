// Supabase Edge Function: ai-generate
// Handles secure AI text and JSON generation via OpenAI API.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders,
            status: 200
        })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey =
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
        return new Response(
            JSON.stringify({ error: 'Server auth is not configured on Supabase.', result: '' }),
            { headers: jsonHeaders, status: 500 }
        )
    }

    const authHeader = req.headers.get('Authorization')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('ANON_KEY')
    const apiKeyHeader = req.headers.get('apikey')
    
    let isAuthorized = false

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim()
        
        // 1. Check if token matches anon key or service role key
        if ((anonKey && token === anonKey) || token === serviceRoleKey) {
            isAuthorized = true
        } else {
            // 2. Otherwise verify if it is a valid user access token
            try {
                const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
                const { data: authData } = await supabaseAdmin.auth.getUser(token)
                if (authData?.user) {
                    isAuthorized = true
                }
            } catch (_) {
                /* ignore */
            }
        }
    } else if (apiKeyHeader && anonKey && apiKeyHeader === anonKey) {
        isAuthorized = true
    }

    if (!isAuthorized) {
        return new Response(
            JSON.stringify({ error: 'Invalid or expired session. Please sign in.', result: '' }),
            { headers: jsonHeaders, status: 401 }
        )
    }

    try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY')

        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY secret is not configured in Supabase Edge Function Secrets')
        }

        const { prompt, model = 'gpt-4o', temperature = 0.7, responseFormat = 'text' } = await req.json()

        if (!prompt) {
            throw new Error('Prompt is required')
        }

        const openaiRequest: any = {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature,
        }

        if (responseFormat === 'json') {
            openaiRequest.response_format = { type: 'json_object' }
        }

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
                headers: jsonHeaders,
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
                headers: jsonHeaders,
                status: 200
            }
        )
    }
})
