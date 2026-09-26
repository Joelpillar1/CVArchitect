import { supabase } from '../lib/supabase';

/**
 * Service to call Supabase Edge Functions for AI operations.
 * Uses the Supabase Client SDK directly to invoke the 'ai-generate' function.
 */

interface AIRequest {
    action: string;
    prompt: string;
    model?: string;
    temperature?: number;
    responseFormat?: 'text' | 'json';
}

/**
 * Call the Supabase Edge Function for AI operations directly via Supabase SDK
 */
export const callAIFunction = async (request: AIRequest): Promise<string> => {
    try {
        const requestBody = {
            prompt: request.prompt,
            model: request.model || 'gpt-4o',
            temperature: request.temperature || 0.7,
            responseFormat: request.responseFormat || 'text',
        };

        const { data, error } = await supabase.functions.invoke('ai-generate', {
            body: requestBody,
        });

        if (error) {
            console.error('Supabase function error:', error);
            let msg = error.message || 'Failed to call Supabase AI function';
            try {
                const errContext = (error as any)?.context;
                if (errContext && typeof errContext.json === 'function') {
                    const json = await errContext.json();
                    if (json?.error) msg = json.error;
                }
            } catch (_) {
                /* ignore */
            }
            throw new Error(msg);
        }

        if (data?.error) {
            throw new Error(data.error);
        }

        if (typeof data?.result === 'string') {
            return data.result;
        }

        throw new Error('Invalid response format from Supabase Edge Function');
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
