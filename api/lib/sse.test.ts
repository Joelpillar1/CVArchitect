import { describe, it, expect } from 'vitest';
import type { VercelResponse } from '@vercel/node';
import { createSSE } from './sse';
import type { AgentSSEEvent } from '../../types/resumeOperations';

/**
 * SSE writer tests — instruction.md §36 (streaming: text, status, operation,
 * completion, cancellation safety). The writer is a thin frame layer over the
 * Vercel response; the protocol shape it emits is what the client parser
 * (services/agentClient.ts) depends on.
 */

function fakeRes() {
  const chunks: string[] = [];
  const headers: Record<string, string> = {};
  const res = {
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    write: (c: string) => {
      chunks.push(c);
      return true;
    },
    end: () => {},
    flushHeaders: () => {},
    flush: () => {},
  } as unknown as VercelResponse;
  return { chunks, headers, res };
}

describe('createSSE', () => {
  it('writes each event as a single data: JSON frame followed by a blank line', () => {
    const { chunks, res } = fakeRes();
    const sse = createSSE(res);
    sse.send({ type: 'run_started', agentRunId: 'run_1' });
    sse.send({ type: 'chat_delta', text: 'hello' });
    expect(chunks).toEqual([
      'data: {"type":"run_started","agentRunId":"run_1"}\n\n',
      'data: {"type":"chat_delta","text":"hello"}\n\n',
    ]);
  });

  it('sets streaming headers and flushes them immediately', () => {
    const { headers, res } = fakeRes();
    createSSE(res);
    expect(headers['Content-Type']).toBe('text/event-stream; charset=utf-8');
    expect(headers['Cache-Control']).toContain('no-transform');
    expect(headers['X-Accel-Buffering']).toBe('no');
  });

  it('stops sending after close() (disconnect/cancellation safety)', () => {
    const { chunks, res } = fakeRes();
    const sse = createSSE(res);
    sse.send({ type: 'operation', op: {} as never });
    sse.close();
    expect(sse.closed).toBe(true);
    // A late send (e.g. a race between a tool emit and teardown) must be a no-op.
    sse.send({ type: 'run_completed', agentRunId: 'run_1' });
    sse.close();
    expect(chunks).toHaveLength(1);
  });

  it('survives a response that throws on write (torn-down connection)', () => {
    const res = {
      setHeader: () => {},
      write: () => {
        throw new Error('socket hang up');
      },
      end: () => {},
      flushHeaders: () => {},
      flush: () => {},
    } as unknown as VercelResponse;
    const sse = createSSE(res);
    expect(() => sse.send({ type: 'chat_delta', text: 'x' } as AgentSSEEvent)).not.toThrow();
    expect(sse.closed).toBe(true);
  });
});
