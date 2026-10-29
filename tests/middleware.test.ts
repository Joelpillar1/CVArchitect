import { beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('keeps crawler discovery files trackable while skipping API routes', () => {
    expect(config.matcher).toEqual(['/((?!api|assets/|images/|favicon.ico).*)']);
  });
});
