import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { trackAICrawlerRequest } = vi.hoisted(() => ({
  trackAICrawlerRequest: vi.fn(),
}));

vi.mock('@datafast/ai-crawl', () => ({ trackAICrawlerRequest }));
vi.mock('@vercel/edge', () => ({
  next: vi.fn(() => new Response(null, { status: 200 })),
}));

import middleware, { config } from '../middleware';

describe('DataFast AI crawler middleware', () => {
  beforeEach(() => {
    trackAICrawlerRequest.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('schedules DataFast tracking for matched requests', () => {
    const request = new Request('https://cvarchitect.app/pricing', {
      headers: { 'user-agent': 'Mozilla/5.0' },
    });
    const event = { waitUntil: vi.fn() };

    const response = middleware(request, event);

    expect(trackAICrawlerRequest).toHaveBeenCalledOnce();
    expect(trackAICrawlerRequest).toHaveBeenCalledWith(request, event, {
      websiteId: 'dfid_uuo5wQV0LNgIEGIq31PAC',
    });
    expect(response.status).toBe(200);
  });

  it('records Minilytics bot traffic for AI crawler requests', () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    vi.stubGlobal('fetch', fetchMock);

    const request = new Request('https://cvarchitect.app/pricing', {
      headers: { 'user-agent': 'GPTBot/1.0' },
    });
    const event = { waitUntil: vi.fn() };

    middleware(request, event);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://minilytics.trackkit.workers.dev/api/sites/356o4a4v4p576t1e/bot',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'GPTBot/1.0' },
        body: JSON.stringify({ path: '/pricing' }),
      }
    );
    expect(event.waitUntil).toHaveBeenCalledOnce();
  });

  it('keeps crawler discovery files trackable while skipping API routes', () => {
    expect(config.matcher).toEqual(['/((?!api|assets/|images/|favicon.ico).*)']);
  });
});
