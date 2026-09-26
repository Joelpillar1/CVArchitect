import path from 'path';
import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only middleware that runs the Vercel Node functions under `api/` inside the Vite
 * dev server, so `npm run dev` serves the app AND the serverless endpoints (e.g. the
 * streaming agent at /api/agent/run) on one origin — no `vercel dev` required.
 *
 * It mirrors Vercel's file-based routing (`/api/agent/run` → `api/agent/run.ts`) and
 * shims the two Vercel-specific response helpers the handlers use (`res.status().json()`
 * / `res.send()`) plus JSON body parsing. Handlers themselves are unchanged. Only active
 * in `serve` mode — production still runs the real Vercel functions.
 */
function devApiRoutes(): Plugin {
  return {
    name: 'dev-api-routes',
    apply: 'serve',
    configureServer(server) {
      const readBody = async (req: IncomingMessage): Promise<unknown> => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        if (!chunks.length) return undefined;
        const raw = Buffer.concat(chunks).toString('utf8');
        const ct = String(req.headers['content-type'] || '');
        if (ct.includes('application/json')) {
          try {
            return JSON.parse(raw);
          } catch {
            return undefined;
          }
        }
        return raw;
      };

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) return next();

        // Resolve the route to a function file. Shared helpers under api/lib are never routes.
        const routePath = url.split('?')[0].replace(/\/+$/, '');
        if (routePath.startsWith('/api/lib/')) return next();

        const candidates = [
          path.join(__dirname, `${routePath}.ts`),
          path.join(__dirname, `${routePath}.js`),
          path.join(__dirname, routePath, 'index.ts'),
        ];
        const file = candidates.find((f) => fs.existsSync(f));
        if (!file) return next();

        // ── Shim the Vercel req/res surface the handlers rely on ──
        const anyReq = req as unknown as { query: Record<string, string>; body: unknown };
        anyReq.query = Object.fromEntries(new URL(url, 'http://localhost').searchParams);
        if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
          anyReq.body = await readBody(req);
        }

        const anyRes = res as unknown as {
          status: (code: number) => typeof anyRes;
          json: (obj: unknown) => typeof anyRes;
          send: (data: unknown) => typeof anyRes;
        };
        anyRes.status = (code: number) => {
          res.statusCode = code;
          return anyRes;
        };
        anyRes.json = (obj: unknown) => {
          if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(obj));
          return anyRes;
        };
        anyRes.send = (data: unknown) => {
          if (data !== null && typeof data === 'object') return anyRes.json(data);
          if (!res.headersSent) res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(data == null ? '' : String(data));
          return anyRes;
        };

        try {
          const id = '/' + path.relative(__dirname, file).replace(/\\/g, '/');
          const mod = await server.ssrLoadModule(id);
          const handler = (mod as { default?: unknown }).default;
          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `api/${routePath} has no default export handler.` }));
            return;
          }
          await (handler as (rq: IncomingMessage, rs: ServerResponse) => unknown)(req, res);
        } catch (err) {
          server.config.logger.error(
            `[dev-api-routes] ${routePath} threw: ${err instanceof Error ? err.stack || err.message : String(err)}`,
          );
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
          }
          if (!res.writableEnded) {
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Dev API error' }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Make non-VITE_ vars from .env visible to the dev API handlers (they read process.env).
  // Only fill gaps — never clobber real system env.
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      watch: {
        ignored: ['**/reactive-resume-main/**'],
      },
    },
    plugins: [react(), devApiRoutes()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    test: {
      globals: true,
      exclude: ['**/node_modules/**', '**/dist/**', '**/reactive-resume-main/**', '**/bentopdf-main/**'],
    }
  };
});
