import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Simple test endpoint to verify Vercel functions are working
 * Access at: https://your-domain.vercel.app/api/test-webhook
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    message: 'Vercel function is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    }
  });
}
