import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAIConfig } from './lib/serverEnv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const openai = getOpenAIConfig();
  if (!openai.apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured.' });
  }

  try {
    const { prompt, model = 'gpt-4o', temperature = 0.7, responseFormat = 'text' } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const openaiRequest: any = {
      model: model || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature || 0.7,
    };

    if (responseFormat === 'json') {
      openaiRequest.response_format = { type: 'json_object' };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown OpenAI error' }));
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || '';

    return res.status(200).json({ result });
  } catch (err: any) {
    console.error('API ai-generate error:', err);
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
}
