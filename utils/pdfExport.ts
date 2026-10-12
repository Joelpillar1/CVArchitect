/**
 * pdfExport.ts
 *
 * Client-side PDF export and download utilities adapted from BentoPDF and optimized
 * for CVArchitect.
 *
 * Features:
 * - High-DPI (2x scale) client-side rasterized PDF generation using html2canvas + jsPDF.
 * - Instant, memory-safe browser download with immediate URL revocation (BentoPDF downloadFile helper).
 * - Fast memoized color space conversion (oklch, oklab, display-p3 -> sRGB) preventing canvas crashes.
 * - Native vector print export (printResumeToPdf) for 100% crisp selectable vector text and ATS compatibility.
 * - Plain text / Markdown export for quick job-board copy pasting.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, TemplateType } from '../types';
import { getSheetVerticalMarginPx } from './templateUtils';
import ResumePreview from '../components/ResumePreview';

export interface PdfExportOptions {
  filename?: string;
  pageSize?: 'letter' | 'a4' | string;
}

/**
 * Clean and sanitize a string to be a safe filename.
 * Prevents illegal characters and duplicate extensions.
 */
export function sanitizeFilename(name: string, fallback: string = 'Document'): string {
  const cleaned = (name || '')
    .trim()
    .replace(/\.(pdf|docx|doc|txt|md|json)$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned.length > 0 ? (cleaned.length > 80 ? cleaned.slice(0, 80) : cleaned) : fallback;
}

/**
 * Instant memory-safe file downloader (adapted from BentoPDF).
 * Creates a Blob object URL, triggers a native link download, and cleans up memory immediately.
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const cleanName =
    filename.toLowerCase().endsWith('.pdf') ||
    filename.toLowerCase().endsWith('.docx') ||
    filename.toLowerCase().endsWith('.doc') ||
    filename.toLowerCase().endsWith('.txt') ||
    filename.toLowerCase().endsWith('.md') ||
    filename.toLowerCase().endsWith('.json') ||
    filename.toLowerCase().endsWith('.csv') ||
    filename.toLowerCase().endsWith('.zip') ||
    /\.[a-zA-Z0-9]{2,5}$/i.test(filename)
      ? filename
      : `${filename}.pdf`;

  // Ensure blob has explicit application/pdf MIME type for mobile download handlers
  const typedBlob =
    cleanName.toLowerCase().endsWith('.pdf') && blob.type !== 'application/pdf'
      ? new Blob([blob], { type: 'application/pdf' })
      : blob;

  const url = window.URL.createObjectURL(typedBlob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = cleanName;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoking synchronously after click aborts the transfer in Safari / iOS,
  // which drops the file with no error at all — hold the object URL for a
  // minute so the browser can finish pulling the blob (URLs are cheap).
  window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
};

// Persistent 1×1 canvas used to convert any CSS color to sRGB.
let _cvs: HTMLCanvasElement | null = null;
let _ctx: CanvasRenderingContext2D | null = null;
const srgbCache = new Map<string, string>();

function getColorCanvas(): CanvasRenderingContext2D | null {
  if (!_ctx) {
    _cvs = document.createElement('canvas');
    _cvs.width = 1;
    _cvs.height = 1;
    _ctx = _cvs.getContext('2d', { willReadFrequently: true });
  }
  return _ctx;
}

/**
 * Convert ANY valid CSS color string (oklch, oklab, lch, lab, p3) to standard "rgb(r, g, b)"
 * using a high-performance memoized canvas probe.
 */
export function toSrgbString(cssColor: string): string {
  if (!cssColor) return cssColor;
  const trimmed = cssColor.trim();

  // Fast path for standard colors (no canvas probe needed)
  if (
    trimmed === 'none' ||
    trimmed === 'transparent' ||
    trimmed === 'inherit' ||
    trimmed === 'initial' ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }

  // Already standard rgb / rgba without modern oklch/oklab
  if (
    (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) &&
    !trimmed.includes('oklch') &&
    !trimmed.includes('oklab')
  ) {
    return trimmed;
  }

  // Check memoized cache
  const cached = srgbCache.get(trimmed);
  if (cached !== undefined) {
    return cached;
  }

  const ctx = getColorCanvas();
  if (!ctx) return trimmed;

  try {
    ctx.fillStyle = '#010203';
    ctx.fillStyle = trimmed;
    if (ctx.fillStyle === '#010203' && trimmed.toLowerCase() !== '#010203') {
      srgbCache.set(trimmed, trimmed);
      return trimmed;
    }
    ctx.fillRect(0, 0, 1, 1);
    const imgData = ctx.getImageData(0, 0, 1, 1).data;
    const r = imgData[0];
    const g = imgData[1];
    const b = imgData[2];
    const a = imgData[3];
    ctx.clearRect(0, 0, 1, 1);

    const result = a < 255 ? `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})` : `rgb(${r}, ${g}, ${b})`;
    srgbCache.set(trimmed, result);
    return result;
  } catch {
    srgbCache.set(trimmed, trimmed);
    return trimmed;
  }
}

/**
 * Capture a resume page DOM element using html2canvas at high DPI.
 *
 * Key fixes applied before capture:
 *  - double-rAF after DOM mount so browser finishes layout computation
 *  - SVG flex gap → explicit margin-right (html2canvas 1.4.1 gap inconsistency)
 *  - border-bottom → explicit <div> divider (html2canvas border rendering bug)
 *  - currentColor on SVG path children resolved to a real hex/rgb value
 *  - <hr> converted to height+background-color (not border)
 */
export async function captureElement(
  el: HTMLElement,
  scale: number = 2,
  pageSize: 'letter' | 'a4' = 'letter'
): Promise<HTMLCanvasElement> {
  // Wait for all web fonts to load with a 1.5-second timeout safety
  if (document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch {
      // Ignore font readiness errors
    }
  }

  const isA4 = pageSize === 'a4';
  const defaultW = isA4 ? 794 : 816;
  const defaultH = isA4 ? 1123 : 1056;

  const rawW = el.offsetWidth || el.clientWidth || 0;
  const rawH = el.offsetHeight || el.clientHeight || 0;
  // Use measured element dimensions when available, otherwise exact paper size
  const w = rawW >= 650 ? rawW : defaultW;
  const h = rawH >= 900 ? rawH : defaultH;

  const host = document.createElement('div');
  host.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    `width:${w}px`,
    `height:${h}px`,
    'overflow:hidden',
    'z-index:-99999',
    'opacity:1',
    'visibility:visible',
    'pointer-events:none',
    'background:#ffffff',
  ].join(';');

  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.position = 'static';
  clone.style.margin = '0';
  clone.style.width = `${w}px`;
  clone.style.minWidth = `${w}px`;
  clone.style.maxWidth = `${w}px`;
  clone.style.height = `${h}px`;
  clone.style.minHeight = `${h}px`;
  clone.style.overflow = 'hidden';
  clone.style.backgroundColor = '#ffffff';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.display = 'block';

  // Attach to live DOM immediately so getComputedStyle returns accurate geometry
  host.appendChild(clone);
  document.body.appendChild(host);

  // Double rAF: give the browser two frames to fully compute layout on the mounted clone
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );

  // Strip contenteditable so no selection caret or focus rings appear
  clone.removeAttribute('contenteditable');
  clone.querySelectorAll('[contenteditable]').forEach((c) => c.removeAttribute('contenteditable'));

  // Remove page-number badges, floating icons, and print-hidden elements
  clone.querySelectorAll('.print\\:hidden, [class*="print:hidden"], .absolute.bottom-3').forEach((c) => c.remove());

  // Resolve SVG colors cleanly so html2canvas renders exact colors
  clone.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
    try {
      const comp = window.getComputedStyle(svg);
      const strokeAttr = svg.getAttribute('stroke');
      const fillAttr = svg.getAttribute('fill');
      const strokeVal = comp.stroke && comp.stroke !== 'none' ? comp.stroke : (comp.color || '#374151');
      const resolvedColor = toSrgbString(strokeVal);

      if (strokeAttr && strokeAttr === 'currentColor') {
        svg.setAttribute('stroke', resolvedColor);
      }
      if (fillAttr && fillAttr === 'currentColor') {
        svg.setAttribute('fill', resolvedColor);
      }
      svg.querySelectorAll('[stroke="currentColor"]').forEach((c) => c.setAttribute('stroke', resolvedColor));
      svg.querySelectorAll('[fill="currentColor"]').forEach((c) => c.setAttribute('fill', resolvedColor));
    } catch {
      // Fallback: ignore SVG color resolution errors
    }
  });

  // Convert HR borders to clean solid 1px background block for html2canvas consistency
  clone.querySelectorAll<HTMLHRElement>('hr').forEach((hr) => {
    try {
      const comp = window.getComputedStyle(hr);
      const hrColor = toSrgbString(comp.borderTopColor || comp.borderColor || comp.color || '#e5e7eb');
      hr.style.border = 'none';
      hr.style.height = '1px';
      hr.style.backgroundColor = hrColor;
    } catch {
      // Fallback
    }
  });

  // Strip shadows for clean raster output
  clone.querySelectorAll<HTMLElement>('*').forEach((child) => {
    if (child.style) {
      if (child.style.boxShadow) child.style.boxShadow = 'none';
      if (child.style.textShadow) child.style.textShadow = 'none';
    }
  });

  try {
    const canvasPromise = html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 4000,
      onclone: (clonedDoc: Document) => {
        if (clonedDoc.documentElement) {
          clonedDoc.documentElement.style.backgroundColor = '#ffffff';
          clonedDoc.documentElement.style.color = '#18181b';
          clonedDoc.documentElement.style.visibility = 'visible';
        }
        if (clonedDoc.body) {
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.color = '#18181b';
          clonedDoc.body.style.visibility = 'visible';
        }
        // Sanitize any modern oklch/oklab in stylesheets within the iframe
        clonedDoc.querySelectorAll('style').forEach((styleEl) => {
          if (styleEl.textContent && /oklch|oklab|color\(display-p3/i.test(styleEl.textContent)) {
            styleEl.textContent = styleEl.textContent.replace(
              /oklch\([^)]+\)|oklab\([^)]+\)|color\(display-p3[^)]+\)/gi,
              (match) => toSrgbString(match)
            );
          }
        });
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('PDF capture timed out. Please try again.')), 15000)
    );

    return await Promise.race([canvasPromise, timeoutPromise]);
  } finally {
    if (document.body.contains(host)) {
      document.body.removeChild(host);
    }
  }
}

/**
 * Build the download filename for a resume export.
 * `Name_Role_Resume.pdf` by default, or the user-supplied custom name.
 */
export function buildResumeFilename(data: ResumeData, customFilename?: string): string {
  if (customFilename && customFilename.trim()) {
    return `${sanitizeFilename(customFilename.trim(), 'Resume')}.pdf`;
  }
  return `${sanitizeFilename(data.fullName, 'Resume')}_Resume.pdf`;
}

/** How long to wait for the server-side PDF pipeline before giving up (ms). */
const SERVER_PDF_TIMEOUT_MS = 60_000;

/**
 * Count the page sheets the editor preview is currently showing (0 when the
 * workspace isn't mounted, e.g. the resume-agent export path).
 */
function countPreviewSheets(): number {
  const paper = document.querySelector<HTMLElement>('[data-resume-paper="true"]');
  if (!paper) return 0;
  return Array.from(paper.querySelectorAll<HTMLElement>('.resume-page-sheet')).filter(
    (el) => !el.closest('.opacity-0') && window.getComputedStyle(el).opacity !== '0'
  ).length;
}

/**
 * Export the resume as a SERVER-RENDERED vector PDF (headless Chromium).
 *
 * This is the ATS-friendly path: real selectable text, tagged reading order,
 * fonts guaranteed loaded by the capture route's readiness flag. The renderer
 * is the same template component the editor previews, rendered on /print-resume.
 *
 * Throws an Error with a human-readable message on failure — callers own the
 * UX (the editor retries once, then reports the reason; the print dialog is
 * only ever opened from the explicit "Print / Vector PDF" menu entry).
 */
export async function exportResumeToServerPdf(
  data: ResumeData,
  template?: TemplateType,
  customFilename?: string
): Promise<{ filename: string; verified: boolean; pages: number | null }> {
  const resolvedTemplate: TemplateType = data.template || template || 'vanguard';
  const dataWithTemplate: ResumeData = { ...data, template: resolvedTemplate };
  const filename = buildResumeFilename(dataWithTemplate, customFilename);
  const pageSize = (dataWithTemplate.pageSize || 'letter').toLowerCase() === 'a4' ? 'A4' : 'Letter';

  // How many pages the editor's own preview shows — lets the server widen its
  // verification ceiling so a legitimately long CV is never rejected, while a
  // runaway render still fails the gate.
  const expectedPages = countPreviewSheets();

  // Same per-sheet top/bottom padding the preview uses, sent to page.pdf so it
  // repeats on EVERY page — this is what keeps the user's margin setting.
  const marginVerticalPx = getSheetVerticalMarginPx(dataWithTemplate);

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SERVER_PDF_TIMEOUT_MS);

  let response: Response | undefined;
  let serverExportError: string | null = null;
  try {
    response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exportPayload: JSON.stringify({ data: dataWithTemplate, template: resolvedTemplate }),
        origin: window.location.origin,
        pageSize,
        filename,
        marginVerticalPx,
        ...(expectedPages > 0 ? { expectedPages } : {}),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    const timedOut = controller.signal.aborted;
    serverExportError = timedOut
      ? `PDF server timed out after ${SERVER_PDF_TIMEOUT_MS / 1000}s`
      : (err instanceof Error ? err.message : String(err));
  } finally {
    window.clearTimeout(timer);
  }

  // If server render fails for ANY reason (HTTP 300/308 redirect, 500 error, network timeout, mobile proxy):
  // Seamlessly fall back to client-side canvas PDF generation so the user ALWAYS gets their resume file.
  if (!response || !response.ok || serverExportError) {
    let detail = serverExportError || (response ? `HTTP ${response.status}` : 'No server response');
    if (response && !response.ok) {
      try {
        const body = (await response.json()) as { error?: string };
        if (body?.error) detail = body.error;
      } catch {
        // Non-JSON error body
      }
    }
    console.warn(`Server PDF export returned ${detail}. Automatically falling back to client-side PDF export...`);
    await exportResumeToPdf(dataWithTemplate, resolvedTemplate, customFilename);
    return {
      filename,
      verified: false,
      pages: null,
    };
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    console.warn('Server PDF export returned empty file. Automatically falling back to client-side PDF export...');
    await exportResumeToPdf(dataWithTemplate, resolvedTemplate, customFilename);
    return {
      filename,
      verified: false,
      pages: null,
    };
  }

  downloadFile(blob, filename);

  const pagesHeader = response.headers.get('X-PDF-Pages');
  return {
    filename,
    verified: response.headers.get('X-PDF-Verified') === 'ok',
    pages: pagesHeader ? Number(pagesHeader) : null,
  };
}

/**
 * Exports all visible resume page sheets directly to PDF using html2canvas + jsPDF.
 * RASTER output (image-based, no text layer) — kept as an explicit legacy fallback only;
 * prefer exportResumeToServerPdf for downloads.
 */
export async function exportResumeToPdf(
  data: ResumeData,
  template?: TemplateType,
  customFilename?: string
): Promise<void> {
  const resolvedTemplate: TemplateType = data.template || template || 'vanguard';
  const dataWithTemplate: ResumeData = { ...data, template: resolvedTemplate };
  const finalFilename = buildResumeFilename(dataWithTemplate, customFilename);
  const pageSize = (dataWithTemplate.pageSize || 'letter').toLowerCase();
  const isA4 = pageSize === 'a4';

  const pageWidthMm = isA4 ? 210 : 215.9;
  const pageHeightMm = isA4 ? 297 : 279.4;
  const format = isA4 ? 'a4' : 'letter';
  const paperW = isA4 ? 794 : 816;

  let sheets: HTMLElement[] = [];
  let cleanupOffscreen: (() => void) | null = null;

  // 1. Pristine offscreen render:
  // Render ResumePreview at standard desktop width in an offscreen container.
  // This guarantees identical desktop paper dimensions, accurate font metrics,
  // and full page slicing even on mobile phones or when the editor tab is active.
  try {
    if (typeof (window as any).loadTemplateFonts === 'function') {
      (window as any).loadTemplateFonts();
    }
    const fontName = dataWithTemplate.font ? dataWithTemplate.font.split(',')[0].replace(/['"]/g, '').trim() : 'Inter';
    if (typeof document !== 'undefined') {
      try {
        if (document.fonts?.load) {
          await Promise.allSettled([
            document.fonts.load(`12pt "${fontName}"`),
            document.fonts.load(`bold 12pt "${fontName}"`),
            document.fonts.load(`italic 12pt "${fontName}"`),
          ]);
        }
        if (document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 2500)),
          ]);
        }
      } catch {
        // Continue if font check fails
      }
    }

    const offscreenHost = document.createElement('div');
    offscreenHost.id = 'cvarchitect-pdf-export-host';
    offscreenHost.style.cssText = [
      'position:fixed',
      'top:0',
      'left:-99999px',
      `width:${Math.max(1200, paperW + 100)}px`,
      'height:auto',
      'z-index:-99999',
      'opacity:1',
      'visibility:visible',
      'pointer-events:none',
      'background:#ffffff',
      '-webkit-text-size-adjust:100%',
      'text-size-adjust:100%',
      'box-sizing:border-box',
    ].join(';');
    document.body.appendChild(offscreenHost);

    const root = createRoot(offscreenHost);
    root.render(React.createElement(ResumePreview, { data: dataWithTemplate, template: resolvedTemplate, editable: false }));

    // Wait for fonts and for real paginated .resume-page-sheet elements to be computed and injected
    await new Promise<void>((resolve) => {
      let attempts = 0;
      const check = () => {
        attempts++;
        const rootEl = offscreenHost.querySelector<HTMLElement>('.resume-preview-root');
        const isPaginated = rootEl?.getAttribute('data-paginated') === 'true';
        const found = offscreenHost.querySelectorAll<HTMLElement>('.resume-page-sheet[data-paginated-sheet="true"]');
        if (isPaginated && found.length > 0 && found[0].innerHTML.trim().length > 50) {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        } else if (attempts < 80) {
          setTimeout(check, 50);
        } else {
          resolve();
        }
      };
      check();
    });

    const offscreenSheets = Array.from(offscreenHost.querySelectorAll<HTMLElement>('.resume-page-sheet[data-paginated-sheet="true"]'));
    if (offscreenSheets.length > 0) {
      sheets = offscreenSheets;
      cleanupOffscreen = () => {
        try {
          root.unmount();
        } catch {}
        if (document.body.contains(offscreenHost)) {
          document.body.removeChild(offscreenHost);
        }
      };
    } else {
      root.unmount();
      offscreenHost.remove();
    }
  } catch (err) {
    console.warn('Offscreen render for PDF export failed, falling back to visible DOM sheets:', err);
  }

  /**
   * Find the sheets from live DOM as fallback if offscreen render failed.
   */
  const getVisibleSheets = (): HTMLElement[] => {
    const paperContainer = document.querySelector<HTMLElement>('[data-resume-paper="true"]');
    if (paperContainer) {
      const scoped = Array.from(paperContainer.querySelectorAll<HTMLElement>('.resume-page-sheet'));
      const visible = scoped.filter((el) => {
        if (el.closest('.opacity-0') || el.classList.contains('opacity-0') || el.style.opacity === '0') return false;
        const style = window.getComputedStyle(el);
        return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
      });
      if (visible.length > 0) return visible;

      const mounted = scoped.filter((el) => {
        return !el.closest('.opacity-0') && !el.classList.contains('opacity-0') && el.style.opacity !== '0';
      });
      if (mounted.length > 0) return mounted;
    }

    const all = Array.from(document.querySelectorAll<HTMLElement>('.resume-page-sheet'));
    const visibleGlobal = all.filter((el) => {
      if (el.closest('.opacity-0') || el.classList.contains('opacity-0') || el.style.opacity === '0') return false;
      if (el.closest('.print-root')) return false;
      let ancestor: Element | null = el.parentElement;
      while (ancestor) {
        const s = window.getComputedStyle(ancestor as HTMLElement);
        if (s.position === 'fixed') return false;
        ancestor = ancestor.parentElement;
      }
      const style = window.getComputedStyle(el);
      return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
    });
    if (visibleGlobal.length > 0) return visibleGlobal;

    const mountedGlobal = all.filter((el) => {
      if (el.closest('.opacity-0') || el.classList.contains('opacity-0') || el.style.opacity === '0') return false;
      if (el.closest('.print-root')) return false;
      return true;
    });
    if (mountedGlobal.length > 0) return mountedGlobal;

    const printResume = document.querySelector<HTMLElement>('.print-resume');
    if (printResume) {
      return [printResume];
    }

    return [];
  };

  // 2. If offscreen sheets were not created, fallback to getVisibleSheets()
  if (sheets.length === 0) {
    sheets = getVisibleSheets();
    if (sheets.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      sheets = getVisibleSheets();
    }
  }

  // Secondary fallback: capture the paper container itself
  if (sheets.length === 0) {
    const paperContainer = document.querySelector<HTMLElement>('[data-resume-paper="true"]');
    if (paperContainer) {
      const root = paperContainer.querySelector<HTMLElement>('.resume-preview-root');
      sheets = root ? [root] : [paperContainer];
    }
  }

  if (sheets.length === 0) {
    cleanupOffscreen?.();
    throw new Error(
      'No resume pages found on screen. Please ensure your resume is visible in the editor.'
    );
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format,
      compress: true,
    });

    const SCALE = 2; // High-clarity 2× rendering

    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];

      if (i > 0) {
        pdf.addPage(format, 'portrait');
      }

      let canvas: HTMLCanvasElement;
      try {
        canvas = await captureElement(sheet, SCALE, isA4 ? 'a4' : 'letter');
      } catch (err) {
        console.error('Canvas capture error on sheet', i, err);
        throw new Error(`Failed to capture page ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }

      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pageWidthMm,
        pageHeightMm,
        undefined,
        'FAST'
      );
    }

    const pdfBlob = pdf.output('blob');
    downloadFile(pdfBlob, finalFilename);
  } finally {
    cleanupOffscreen?.();
  }
}

/**
 * Triggers native browser print dialog for razor-sharp vector PDF rendering.
 * Isolated via print styles to only include the resume sheets.
 */
export function printResumeToPdf(): void {
  window.print();
}

/**
 * Export resume data as plain text / markdown for easy copy-pasting to job application portals.
 */
export function exportResumeToPlainText(
  data: ResumeData,
  format: 'text' | 'markdown' = 'markdown',
  customFilename?: string
): void {
  const lines: string[] = [];

  const name = data.fullName || 'Professional Resume';
  const title = data.jobTitle || '';

  if (format === 'markdown') {
    lines.push(`# ${name}`);
    if (title) lines.push(`**${title}**\n`);
  } else {
    lines.push(name.toUpperCase());
    if (title) lines.push(title);
    lines.push('----------------------------------------\n');
  }

  // Contact info
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.address) contactParts.push(data.address);
  if (data.linkedin) contactParts.push(data.linkedin);
  if (data.atHandle) contactParts.push(data.atHandle);

  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | ') + '\n');
  }

  // Summary
  if (data.summary) {
    lines.push(format === 'markdown' ? '## Professional Summary' : 'PROFESSIONAL SUMMARY');
    lines.push(data.summary + '\n');
  }

  // Experience
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    lines.push(format === 'markdown' ? '## Work Experience' : 'WORK EXPERIENCE');
    data.experience.forEach((exp) => {
      const header = `${exp.role || 'Role'} - ${exp.company || 'Company'}`;
      const period = exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.startDate || exp.endDate || '');
      lines.push(format === 'markdown' ? `### ${header}` : header);
      if (period) lines.push(period);
      if (exp.location) lines.push(exp.location);

      const bullets = Array.isArray(exp.description)
        ? exp.description
        : typeof exp.description === 'string'
        ? exp.description.split('\n').filter(Boolean)
        : [];

      bullets.forEach((bullet: string) => {
        lines.push(`• ${bullet.replace(/^[-•*]\s*/, '')}`);
      });
      lines.push('');
    });
  }

  // Skills
  if (data.skills) {
    lines.push(format === 'markdown' ? '## Skills' : 'SKILLS');
    const skillsText = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills;
    lines.push(skillsText + '\n');
  }

  // Education
  if (Array.isArray(data.education) && data.education.length > 0) {
    lines.push(format === 'markdown' ? '## Education' : 'EDUCATION');
    data.education.forEach((edu) => {
      const school = edu.school || 'University';
      const degree = edu.degree || 'Degree';
      const year = edu.year || '';
      lines.push(`${degree} - ${school} ${year ? `(${year})` : ''}`);
    });
    lines.push('');
  }

  const content = lines.join('\n');
  const ext = format === 'markdown' ? 'md' : 'txt';
  let filename: string;
  if (customFilename && customFilename.trim()) {
    const clean = sanitizeFilename(customFilename.trim(), 'Resume');
    filename = `${clean}.${ext}`;
  } else {
    filename = `${sanitizeFilename(data.fullName, 'Resume')}_Resume.${ext}`;
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, filename);
}

/**
 * Export a cover letter to PDF.
 */
export async function exportCoverLetterToPdf(
  elementOrText: HTMLElement | string,
  resumeData: ResumeData,
  jobTitle?: string,
  companyName?: string
): Promise<void> {
  const baseName = sanitizeFilename(resumeData.fullName, 'Applicant');
  const roleName = sanitizeFilename(jobTitle || 'Role', '');
  const fileName = roleName
    ? `${baseName}_Cover_Letter_${roleName}.pdf`
    : `${baseName}_Cover_Letter.pdf`;

  let targetEl: HTMLElement;
  let cleanup: (() => void) | null = null;

  if (typeof elementOrText === 'string') {
    const container = document.createElement('div');
    container.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:794px',
      'padding:96px 76px',
      'background:#ffffff',
      'color:#1f2937',
      'font-family:Inter,ui-sans-serif,sans-serif',
      'font-size:11pt',
      'line-height:1.7',
      'white-space:pre-wrap',
      'z-index:-99999',
      'opacity:1',
      'visibility:visible',
      'pointer-events:none',
    ].join(';');
    container.innerText = elementOrText;
    document.body.appendChild(container);
    targetEl = container;
    cleanup = () => document.body.removeChild(container);
  } else {
    targetEl = elementOrText;
  }

  try {
    const SCALE = 2;
    const canvas = await captureElement(targetEl, SCALE, 'a4');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    const pdfBlob = pdf.output('blob');
    downloadFile(pdfBlob, fileName);
  } finally {
    cleanup?.();
  }
}

/**
 * Export any given HTML element to a PDF using html2canvas.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const filename = options.filename || 'Document.pdf';
  const pageSize = (options.pageSize || 'a4').toLowerCase();
  const isA4 = pageSize === 'a4';
  const pageWidthMm = isA4 ? 210 : 215.9;
  const pageHeightMm = isA4 ? 297 : 279.4;
  const format = isA4 ? 'a4' : 'letter';

  const canvas = await captureElement(element, 2, isA4 ? 'a4' : 'letter');
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format, compress: true });
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  const pdfBlob = pdf.output('blob');
  downloadFile(pdfBlob, filename);
}
