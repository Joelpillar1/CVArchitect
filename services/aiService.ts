import { supabase } from '../lib/supabase';

/**
 * Service to call Supabase Edge Functions for AI operations
 * This keeps API keys secure on the backend
 */

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface AIRequest {
    action: string;
    prompt: string;
    model?: string;
    temperature?: number;
    responseFormat?: 'text' | 'json';
}

interface AIResponse {
    result: string;
    error?: string;
}

/**
 * Call the Supabase Edge Function for AI operations
 */
export const callAIFunction = async (request: AIRequest): Promise<string> => {
    try {
        // Get the current session token
        const { data: { session } } = await supabase.auth.getSession();

        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Edge Function expects: { prompt, model, temperature, responseFormat }
        const requestBody = {
            prompt: request.prompt,
            model: request.model || 'gpt-4o',
            temperature: request.temperature || 0.7,
            responseFormat: request.responseFormat || 'text',
        };

        const response = await fetch(`${EDGE_FUNCTION_URL}/ai-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token || supabaseKey}`,
                'apikey': supabaseKey,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data: AIResponse = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data.result;
    } catch (error: any) {
        console.error('AI Function Call Error:', error);
        throw new Error(error.message || 'Failed to call AI function');
    }
};

/**
 * Helper function to call AI with text response
 */
export const callAIText = async (
    prompt: string,
    model: string = 'gpt-4o',
    temperature: number = 0.7
): Promise<string> => {
    return callAIFunction({
        action: 'generate',
        prompt,
        model,
        temperature,
        responseFormat: 'text',
    });
};

/**
 * Helper function to call AI with JSON response
 */
export const callAIJSON = async (
    prompt: string,
    model: string = 'gpt-4o',
    temperature: number = 0.7
): Promise<any> => {
    const result = await callAIFunction({
        action: 'generate',
        prompt,
        model,
        temperature,
        responseFormat: 'json',
    });

    try {
        return JSON.parse(result);
    } catch (error) {
        console.error('Failed to parse JSON response:', error);
        throw new Error('Invalid JSON response from AI');
    }
};
