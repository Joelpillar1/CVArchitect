/**
 * /api/export-cover-letter-pdf
 *
 * Generates a PDF from raw HTML + injected CSS styles via Puppeteer.
 * Used for cover letters and other non-template documents where
 * the HTML content is simple enough to be self-contained.
 */
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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

interface ExportCoverLetterBody {
  html: string;
  pageSize?: 'A4' | 'Letter';
  styles?: string[];
  filename?: string;
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  let browser;
  try {
    const body = (req.body || {}) as ExportCoverLetterBody;
    const { html, pageSize = 'A4', styles = [], filename = 'cover_letter.pdf' } = body;

    if (!html || typeof html !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing or invalid "html" property.' }));
      return;
    }

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
      defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 2 },
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    const injectedStyles = styles.join('\n');
    const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>${injectedStyles}</style>
    <style>
      @page { margin: 0; size: ${pageSize === 'Letter' ? 'letter' : 'A4'} portrait; }
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #ffffff !important;
      }
    </style>
  </head>
  <body>${html}</body>
</html>`;

    await page.setContent(fullHtml, { waitUntil: ['domcontentloaded', 'load'], timeout: 15000 });

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch { /* ignore */ }
      }
    });

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
    console.error('Cover letter PDF generation error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate cover letter PDF.',
      })
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
