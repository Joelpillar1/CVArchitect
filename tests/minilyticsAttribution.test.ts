import { describe, expect, it } from 'vitest';
import { getMinilyticsAttribution } from '../api/_lib/minilyticsAttribution';

describe('Minilytics checkout attribution', () => {
  it('prefers ids sent in the request body', () => {
    expect(
      getMinilyticsAttribution('ml_vid=cookie-visitor; ml_sid=cookie-session', {
        ml_visitor_id: 'body-visitor',
        ml_session_id: 'body-session',
      })
    ).toEqual({ visitorId: 'body-visitor', sessionId: 'body-session' });
  });

  it('falls back to first-party cookies', () => {
    expect(getMinilyticsAttribution('ml_vid=visitor-123; ml_sid=session-456')).toEqual({
      visitorId: 'visitor-123',
      sessionId: 'session-456',
    });
  });

  it('accepts camelCase body keys', () => {
    expect(
      getMinilyticsAttribution(undefined, {
        mlVisitorId: 'camel-visitor',
        mlSessionId: 'camel-session',
      })
    ).toEqual({ visitorId: 'camel-visitor', sessionId: 'camel-session' });
  });

  it('returns empty strings when no ids are available', () => {
    expect(getMinilyticsAttribution(undefined)).toEqual({ visitorId: '', sessionId: '' });
  });
});
