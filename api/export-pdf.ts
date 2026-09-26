import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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
  pageSize?: 'A4' | 'Letter';
  filename?: string;
  /** The Vite dev server origin, e.g. http://localhost:5173 */
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
    const { exportPayload, pageSize = 'A4', filename = 'resume.pdf' } = body;

    if (!exportPayload || typeof exportPayload !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing or invalid "exportPayload" property.' }));
      return;
    }

    // Determine the origin of the Vite dev server (passed by client, or guess localhost:5173)
    const origin = (body.origin || 'http://localhost:5173').replace(/\/$/, '');
    const printUrl = `${origin}/print-resume`;

    // Determine Chromium executable path
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

    // First navigate to the print page so the React app initialises and sets up its router
    await page.goto(printUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Inject the resume payload into sessionStorage so PrintResumePage can read it
    await page.evaluate((payload: string) => {
      sessionStorage.setItem('__pdf_export_data__', payload);
    }, exportPayload);

    // Reload so the React component picks up the sessionStorage data
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 });

    // Wait until the page signals it is fully rendered (window.__PRINT_READY__ = true)
    // Timeout after 20 seconds just in case
    await page.waitForFunction('window.__PRINT_READY__ === true', { timeout: 20000 });

    // Additional breathing room for final layout / font rendering
    await new Promise<void>((r) => setTimeout(r, 300));

    const pdfBuffer = await page.pdf({
      format: pageSize === 'Letter' ? 'Letter' : 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', Buffer.byteLength(pdfBuffer));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
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
