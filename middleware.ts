import { next } from '@vercel/edge';

const AI_BOT_RE = /chatgpt-user|gptbot|claudebot|claude-web|perplexitybot|google-extended|deepseek|bytespider|applebot/i;

export default function middleware(req: Request) {
  const ua = req.headers.get('user-agent') || '';
  const url = new URL(req.url);

  // Asynchronously record bot request without delaying your page response
  if (AI_BOT_RE.test(ua)) {
    fetch('http://minilytics.trackkit.workers.dev/api/sites/2u2g5r5q3q1i662p/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': ua },
      body: JSON.stringify({ path: url.pathname }),
    }).catch(() => {});
  }

  return next();
}

export const config = {
  matcher: ['/((?!assets/|images/|favicon.ico).*)'],
};
