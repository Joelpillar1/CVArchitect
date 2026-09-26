import type { VercelResponse } from '@vercel/node';
import type { AgentSSEEvent } from '../../types/resumeOperations';

/**
 * Minimal Server-Sent-Events writer for the agent endpoint.
 *
 * One JSON object per `data:` line, framed by a blank line. We disable every layer
 * of buffering we can reach (Node, nginx via `X-Accel-Buffering`, Vercel via
 * `no-transform`) so operation/chat frames reach the browser the instant the agent
 * emits them — the streaming-first UX depends on this not being batched.
 */
export interface SSEWriter {
  send: (event: AgentSSEEvent) => void;
  close: () => void;
  readonly closed: boolean;
}

export function createSSE(res: VercelResponse): SSEWriter {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  // Flush the headers immediately so the client's reader unblocks before the first event.
  (res as unknown as { flushHeaders?: () => void }).flushHeaders?.();

  let closed = false;

  return {
    get closed() {
      return closed;
    },
    send(event: AgentSSEEvent) {
      if (closed) return;
      try {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        // @vercel/node's response may expose flush() (compression middleware); best-effort.
        (res as unknown as { flush?: () => void }).flush?.();
      } catch {
        closed = true;
      }
    },
    close() {
      if (closed) return;
      closed = true;
      try {
        res.end();
      } catch {
        /* already torn down */
      }
    },
  };
}
