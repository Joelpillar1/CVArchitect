import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { resolveReturnOrigin } from './_lib/resolveReturnOrigin';
import { verifyPdfBuffer } from './_lib/pdfVerify';

// Chromium launch + two page loads (goto, reload) + render wait. Well above the
// typical warm-path latency but bounded so a hung browser can't pin the function.
export const maxDuration = 60;

/**
 * Strip anything unsafe from a client-provided filename before it reaches the
 * Content-Disposition header (header injection) or a download dialog.
 */
function sanitizePdfFilename(raw: string | undefined): string {
  const base = (raw || 'resume')
    .replace(/\.pdf$/i, '')
    .replace(/[^a-zA-Z0-9 _.-]+/g, '_')
    .replace(/[ _]*$/g, '')
    .slice(0, 80);
  return `${base || 'resume'}.pdf`;
}

// Common paths for Chrome / Edge across Windows, macOS, Linux in local development
function getLocalExecutablePath(): string | undefined {
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

    const candidates = [
      `${programFiles}\\Google\\Chrome\\Application\\chrome.exe`,
      `${programFilesX86}\\Google\\Chrome\\Application\\chrome.exe`,
      `${localAppData}\\Google\\Chrome\\Application\\chrome.exe`,
      `${programFilesX86}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${programFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${localAppData}\\Microsoft\\Edge\\Application\\msedge.exe`,
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } else if (process.platform === 'darwin') {
    const candidates = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    const candidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

interface ExportPdfBody {
  /** JSON-stringified { data: ResumeData, template: string } — Puppeteer injects into the page's sessionStorage */
  exportPayload: string;
  /** Case-insensitive; normalized to Puppeteer's 'A4' | 'Letter'. Defaults to A4. */
  pageSize?: string;
  filename?: string;
  /** Page count the editor preview showed — widens the verification gate's ceiling. */
  expectedPages?: number;
  /** The app origin the capture route lives on, e.g. http://localhost:5173 — validated against an allowlist. */
  origin?: string;
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  let browser;
  try {
    const body = (req.body || {}) as ExportPdfBody;
    const { exportPayload } = body;

    if (!exportPayload || typeof exportPayload !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing or invalid "exportPayload" property.' }));
      return;
    }

    // Resolve the app origin the headless browser will load /print-resume from.
    // Client-supplied origins are validated against the allowlist in _lib/resolveReturnOrigin;
    // the fallback is the deployed preview URL (VERCEL_URL) or the local dev server.
    const fallbackOrigin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173';
    const origin = resolveReturnOrigin(body.origin, fallbackOrigin);
    const printUrl = `${origin}/print-resume`;

    const format: 'A4' | 'Letter' =
      String(body.pageSize || 'A4').toLowerCase() === 'letter' ? 'Letter' : 'A4';
    const pdfFilename = sanitizePdfFilename(body.filename);
    const expectedPages =
      typeof body.expectedPages === 'number' && Number.isFinite(body.expectedPages)
        ? Math.max(0, Math.floor(body.expectedPages))
        : 0;
    // NOTE: per-page margins are NOT set here. Chromium's printToPDF margin
    // fields are overridden by the global `@page { margin: 0mm }` in index.css,
    // so the capture route injects its own later `@page { margin }` rule derived
    // from data.margins — the same single source of truth the preview uses.

    // Determine Chromium executable path
    const tStart = Date.now();
    let executablePath = getLocalExecutablePath();
    if (!executablePath) {
      executablePath = await chromium.executablePath();
    }

    browser = await puppeteer.launch({
      args: chromium.args || [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      defaultViewport: null, // let the page decide its own size
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    const t0 = Date.now(); // page phases; launch time = t0 - tStart

    // First navigate to the print page so the React app initialises and sets up its router
    await page.goto(printUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const tGoto = Date.now() - t0;

    // Inject the resume payload into sessionStorage so PrintResumePage can read it
    await page.evaluate((payload: string) => {
      sessionStorage.setItem('__pdf_export_data__', payload);
    }, exportPayload);

    // Reload so the React component picks up the sessionStorage data
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 });

    // Wait until the page signals it is fully painted (fonts + images + layout)
    // OR reports that it cannot render. Timeout after 20 seconds just in case.
    await page.waitForFunction(
      'window.__PRINT_READY__ === true || typeof window.__PRINT_ERROR__ === "string"',
      { timeout: 20000 }
    );

    const printError = await page.evaluate(
      () => (window as unknown as { __PRINT_ERROR__?: string }).__PRINT_ERROR__ ?? null
    );
    if (printError) {
      // The capture route knows exactly what went wrong — surface it instead of
      // photographing the error page or timing out with a generic message.
      res.statusCode = 422;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: printError }));
      return;
    }
    const tReady = Date.now() - t0 - tGoto;

    // Additional breathing room for final layout / font rendering
    await new Promise<void>((r) => setTimeout(r, 300));

    const pdfBuffer = await page.pdf({
      format,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    console.log(
      `[export-pdf] total=${Date.now() - tStart}ms launch=${t0 - tStart}ms goto=${tGoto}ms reload+ready=${tReady}ms pdf=${
        Date.now() - t0 - tGoto - tReady
      }ms origin=${origin} size=${format} expectedPages=${expectedPages}`
    );

    // ── Verification gate (never hand over an unchecked PDF) ──
    // requiredText comes from the payload we were asked to render: the candidate's
    // name and email must survive into the text layer as literal text.
    let requiredText: string[] = [];
    try {
      const parsed = JSON.parse(exportPayload) as {
        data?: { fullName?: string; email?: string };
      };
      requiredText = [parsed?.data?.fullName, parsed?.data?.email].filter(
        (s): s is string => typeof s === 'string' && s.trim().length > 0
      );
    } catch {
      // Unparseable payload can't produce expected strings — the page-count and
      // text-layer checks below still run.
    }

    const gate = await verifyPdfBuffer(pdfBuffer, {
      // Page count is the USER'S choice — a long CV may legitimately run to many
      // pages. The ceiling only exists to catch a runaway render (content
      // looping/overflowing); it widens further when the preview's own count is
      // known.
      maxPages: Math.max(30, expectedPages + 2),
      requiredText,
    });

    if (gate.status === 'failed') {
      console.error(`[export-pdf] verification FAILED: ${gate.reason}`);
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          error: `Generated PDF failed verification: ${gate.reason}`,
          pages: gate.pages,
        })
      );
      return;
    }

    if (gate.status === 'skipped') {
      // Degraded mode — explicitly NOT a pass (upstream's exit-2 rule).
      console.warn(`[export-pdf] verification SKIPPED: ${gate.reason}`);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', Buffer.byteLength(pdfBuffer));
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
    res.setHeader('X-PDF-Verified', gate.status);
    if (gate.pages !== null) res.setHeader('X-PDF-Pages', String(gate.pages));
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Puppeteer PDF generation error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate PDF with Puppeteer.',
      })
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
