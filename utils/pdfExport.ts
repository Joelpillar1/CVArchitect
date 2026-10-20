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
 * Normalize section headers before html2canvas capture.
 *
 * html2canvas renders an element's border box without its vertical padding, so
 * bordered section headers (e.g. Regent's top+bottom-ruled titles) capture with
 * the rule drawn up through the heading text even though the live preview is
 * correct. For headers that carry border rules we:
 *   - keep padding and line-height untouched (the padding IS the visible gap
 *     between text and rule — stripping it produced the strike-through),
 *   - keep the border widths so layout stays pixel-identical, but make the
 *     borders transparent, and
 *   - paint the rules ourselves as absolutely-positioned background bars pinned
 *     to the element's true geometry with an explicit `top` in px (never
 *     `bottom`, which would inherit html2canvas's mis-computed box height).
 *
 * Headers without border rules keep the legacy lock (margin/padding flattened) —
 * other templates rely on that behaviour.
 */
function lockHeadingGeometry(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.section-header, h2, h3, .section-header-wrap').forEach((el) => {
    el.style.boxSizing = 'border-box';
    // Already converted in an earlier pass — re-converting would re-measure
    if (el.dataset.ruleLock === '1') return;
    const cs = window.getComputedStyle(el);
    const borderT = parseFloat(cs.borderTopWidth) || 0;
    const borderB = parseFloat(cs.borderBottomWidth) || 0;
    if (borderT > 0 || borderB > 0) {
      // Measure the TRUE (padded) geometry first — the rules must be pinned to
      // where the preview draws them.
      const boxH = el.getBoundingClientRect().height;
      const colorT = toSrgbString(cs.borderTopColor || '#111111');
      const colorB = toSrgbString(cs.borderBottomColor || '#111111');
      el.dataset.ruleLock = '1';
      el.style.position = 'relative';
      el.style.borderTopColor = 'transparent';
      el.style.borderBottomColor = 'transparent';
      // Position bars in padding-box coordinates
      const addBar = (topPx: number, heightPx: number, color: string) => {
        if (heightPx <= 0) return;
        const bar = document.createElement('div');
        bar.setAttribute('data-rule-bar', '');
        bar.style.cssText = `position:absolute;left:0;right:0;top:${topPx}px;height:${heightPx}px;background:${color};`;
        el.appendChild(bar);
      };
      addBar(-borderT, borderT, colorT);
      addBar(boxH - borderT - borderB, borderB, colorB);
      // Keep existing padding intact so text is not squished against the rule bars
      el.style.marginTop = '0px';
      el.style.margin = '0px';
      el.style.lineHeight = '1.25';
    }
  });
}

// ---------------------------------------------------------------------------
// SVG foreignObject capture (primary path)
// ---------------------------------------------------------------------------
//
// html2canvas 1.4.1 paints text, borders and flex children at positions that
// differ from the browser (names shifted into contact rows, section rules
// cutting through headings, ...). The foreignObject path serializes the element
// plus the page's CSS into an SVG image and lets Chrome rasterize it — same
// layout engine, same paint as the live preview.
//
// SVG-image context quirks handled below:
//  - there is no <html> element, so `:root` custom-property rules are
//    re-pointed at the wrapper div (`#fo-root`);
//  - every element IS a descendant of <svg>, so `:not(svg *)` would exclude
//    everything and silently disable its rule — the exclusion is stripped;
//  - @media queries evaluate against the SVG viewport, which is sized to the
//    real window so responsive rules match the preview;
//  - HTML named entities (`&nbsp;`) are invalid XML — they are translated to
//    numeric character references;
//  - external resources (@font-face url()s, background images, <img> src) are
//    inlined as data URLs because SVG images may not fetch anything.

const XML_BASIC_ENTITIES = new Set(['amp', 'lt', 'gt', 'quot', 'apos']);

/** Translate HTML named entities (e.g. `&nbsp;`) to numeric references XML understands. */
function translateNamedEntitiesForXml(html: string): string {
  const cache: Record<string, string> = {};
  return html.replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (match, name: string) => {
    if (XML_BASIC_ENTITIES.has(name)) return match;
    if (!(name in cache)) {
      try {
        const probe = document.createElement('span');
        probe.innerHTML = match;
        const text = probe.textContent;
        const code = text && text !== match ? text.codePointAt(0) : undefined;
        cache[name] = code !== undefined ? `&#${code};` : match;
      } catch {
        cache[name] = match;
      }
    }
    return cache[name];
  });
}

/** Escape raw text (`&`, `<`, `>`) for use inside XML. Decodes back on parse. */
function escapeXmlRawText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Fetch a URL and return it as a data URL, or null on any failure. */
async function fetchDataUrl(url: string, timeoutMs: number): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

let foreignObjectCssCache: { key: string; css: string } | null = null;

/**
 * Build the stylesheet bundle for a foreignObject capture: every inline
 * `<style>` tag plus fetched `<link>` stylesheets, with the `@font-face`
 * url()s of fonts the element actually uses inlined as data URLs (fonts that
 * fail to embed abort the attempt so the html2canvas fallback can run), the
 * SVG-image selector fixes, and a cache keyed on stylesheet identity.
 */
async function buildForeignObjectCss(el: HTMLElement): Promise<string> {
  const usedFamilies = new Set<string>();
  const nodes: Element[] = [el];
  nodes.push(...Array.from(el.querySelectorAll('*')));
  for (const node of nodes) {
    try {
      const family = window.getComputedStyle(node).fontFamily || '';
      family.split(',').forEach((part) => {
        const name = part.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
        if (name) usedFamilies.add(name);
      });
    } catch {
      // Skip elements we cannot read
    }
  }

  const styleTexts: string[] = [];
  document.querySelectorAll('style').forEach((s) => styleTexts.push(s.textContent || ''));
  const linkHrefs: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
    const href = (l as HTMLLinkElement).href;
    if (href) linkHrefs.push(href);
  });

  const cacheKey = JSON.stringify({
    s: styleTexts.map((t) => t.length),
    l: linkHrefs,
    f: Array.from(usedFamilies).sort(),
  });
  if (foreignObjectCssCache && foreignObjectCssCache.key === cacheKey) {
    return foreignObjectCssCache.css;
  }

  const parts = [...styleTexts];
  await Promise.all(
    linkHrefs.map(async (href) => {
      try {
        const res = await fetch(href, { mode: 'cors' });
        if (res.ok) parts.push(await res.text());
      } catch {
        // Stylesheet unavailable; missing @font-face blocks trigger the
        // html2canvas fallback if a used font ends up unresolvable.
      }
    })
  );
  let css = parts.join('\n');

  // @font-face blocks whose family this element uses → embed their files.
  const fontFaceRe = /@font-face\s*\{[^}]*\}/g;
  const urlRe = /url\(([^)]+)\)/g;
  const usedFontUrls: string[] = [];
  for (const block of css.match(fontFaceRe) || []) {
    const famMatch = /font-family\s*:\s*([^;]+);/i.exec(block);
    const family = famMatch ? famMatch[1].trim().replace(/^['"]|['"]$/g, '').toLowerCase() : '';
    if (!usedFamilies.has(family)) continue;
    urlRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = urlRe.exec(block))) {
      const url = m[1].trim().replace(/^['"]|['"]$/g, '');
      if (!url.startsWith('data:')) usedFontUrls.push(url);
    }
  }
  // Non-font resources (background images) referenced anywhere in the CSS.
  const assetUrls: string[] = [];
  const withoutFaces = css.replace(fontFaceRe, '');
  urlRe.lastIndex = 0;
  let am: RegExpExecArray | null;
  while ((am = urlRe.exec(withoutFaces))) {
    const url = am[1].trim().replace(/^['"]|['"]$/g, '');
    if (!url.startsWith('data:')) assetUrls.push(url);
  }

  for (const url of Array.from(new Set(usedFontUrls))) {
    const dataUrl = await fetchDataUrl(url, 8000);
    // Fonts are mandatory — without them the render would silently fall back
    // to a system font and diverge from the preview.
    if (!dataUrl) throw new Error(`Unable to embed font for foreignObject capture: ${url}`);
    css = css.split(url).join(dataUrl);
  }
  await Promise.all(
    Array.from(new Set(assetUrls)).map(async (url) => {
      const dataUrl = await fetchDataUrl(url, 4000);
      if (dataUrl) css = css.split(url).join(dataUrl);
    })
  );
  // Anything still external is blanked so the SVG never attempts a fetch.
  css = css.replace(/url\((?!data:)[^)]+\)/g, 'url()');

  // SVG-image context selector fixes (see block comment above).
  css = css.split(':root').join('#fo-root');
  css = css.split(':not(svg *)').join('');

  foreignObjectCssCache = { key: cacheKey, css };
  return css;
}

/**
 * Capture a DOM element by serializing it into an SVG `foreignObject` image
 * and rasterizing it with Chrome's own renderer — pixel-identical to how the
 * same markup lays out and paints in the page. Throws on any failure so the
 * caller can fall back to html2canvas.
 */
async function captureElementForeignObject(
  el: HTMLElement,
  w: number,
  h: number,
  scale: number
): Promise<HTMLCanvasElement> {
  const css = await buildForeignObjectCss(el);

  // Clone with the same paper-box forces and strips as the html2canvas path —
  // but none of its layout hacks: Chrome renders flex/gap/borders natively.
  const clone = el.cloneNode(true) as HTMLElement;
  clone.removeAttribute('contenteditable');
  clone.querySelectorAll('[contenteditable]').forEach((c) => c.removeAttribute('contenteditable'));
  clone.querySelectorAll('.print\\:hidden, [class*="print:hidden"], .absolute.bottom-3').forEach((c) => c.remove());
  clone.style.transform = 'none';
  clone.style.position = 'static';
  clone.style.margin = '0';
  clone.style.width = `${w}px`;
  clone.style.minWidth = `${w}px`;
  clone.style.maxWidth = `${w}px`;
  clone.style.height = `${h}px`;
  clone.style.minHeight = `${h}px`;
  clone.style.boxSizing = 'border-box';
  clone.style.overflow = 'hidden';
  clone.style.backgroundColor = '#ffffff';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.display = 'block';

  // Inline <img> resources as data URLs (SVG images cannot fetch).
  await Promise.all(
    Array.from(clone.querySelectorAll('img')).map(async (img) => {
      const src = img.getAttribute('src') || '';
      if (!src || src.startsWith('data:')) return;
      const dataUrl = await fetchDataUrl(src, 6000);
      if (dataUrl) img.setAttribute('src', dataUrl);
    })
  );

  // Recreate the `.resume-preview-root` context: heading/line-height rules and
  // the `--resume-*` custom properties live on that ancestor, not the sheet.
  let serialized: string;
  const ctx = el.closest('.resume-preview-root');
  if (ctx) {
    const wrap = ctx.cloneNode(false) as HTMLElement;
    wrap.appendChild(clone);
    serialized = wrap.outerHTML;
  } else {
    serialized = clone.outerHTML;
  }

  // Nested <style> blocks serialize as raw text; they must be escaped for XML
  // *before* the entity pass so nothing gets double-escaped.
  serialized = serialized.replace(
    /<style(\s[^>]*)?>([\s\S]*?)<\/style>/g,
    (_m: string, attrs: string, text: string) => `<style${attrs || ''}>${escapeXmlRawText(text)}</style>`
  );
  serialized = translateNamedEntitiesForXml(serialized);
  // Escape any remaining bare '&' (e.g. in text or attributes) for XML.
  serialized = serialized.replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');

  // HTML void elements serialize without a closing tag (`<hr>`, `<img>`, `<br>`),
  // which is invalid XML — self-close them so templates using <hr> rules or
  // <img> photos don't fail the SVG decode and fall back to html2canvas.
  serialized = serialized.replace(
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)((?:\s+[^<>]*?)?)\s*\/?>/gi,
    '<$1$2 />'
  );

  const bodyStyle = window.getComputedStyle(document.body);
  const rootStyle = [
    `width:${w}px`,
    `height:${h}px`,
    'overflow:hidden',
    'background:#ffffff',
    'margin:0',
    'padding:0',
    'font-size:16px',
    'line-height:24px',
    `font-family:${(bodyStyle.fontFamily || 'sans-serif').replace(/"/g, "'")}`,
    `color:${bodyStyle.color || '#111111'}`,
    '-webkit-text-size-adjust:100%',
    'text-size-adjust:100%',
  ].join(';');

  // Size the SVG viewport like the real window so @media queries behave as
  // they do in the preview; the paper box stays `w`-wide at the left edge and
  // is cropped back out when drawing.
  const viewportW = Math.max(w, document.documentElement.clientWidth || window.innerWidth || w);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${viewportW}" height="${h}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" id="fo-root" style="${rootStyle}">` +
    `<style>${escapeXmlRawText(css)}</style>${serialized}</div></foreignObject></svg>`;

  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('foreignObject SVG failed to decode'));
    img.src = src;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) throw new Error('2d canvas context unavailable');
  ctx2d.fillStyle = '#ffffff';
  ctx2d.fillRect(0, 0, canvas.width, canvas.height);
  // Crop the paper box out of the window-wide viewport and scale to target.
  ctx2d.drawImage(img, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Capture a resume page DOM element to a canvas at high DPI.
 *
 * Primary path: SVG foreignObject — Chrome rasterizes the serialized element
 * with its own layout/paint engine, so the output matches the preview
 * exactly. If that fails for any reason (fonts, decoding, CORS), this falls
 * back to html2canvas with the fixes it needs:
 *
 * Key fixes applied before html2canvas capture:
 *  - double-rAF after DOM mount so browser finishes layout computation
 *  - SVG flex gap → explicit margin-right (html2canvas 1.4.1 gap inconsistency)
 *  - bordered section headers → transparent borders + explicit background bars
 *    at the true rule positions (html2canvas draws borders against a
 *    padding-less box, which shifted rules up through the heading text)
 *  - currentColor on SVG path children resolved to a real hex/rgb value
 *  - <hr> converted to height+background-color (not border), preserving the
 *    source rule thickness
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

  const rawH = el.offsetHeight || el.clientHeight || 0;
  // Always use exact paper width (816 for Letter, 794 for A4) to prevent right-edge clipping
  const w = defaultW;
  const h = rawH > defaultH ? rawH : defaultH;

  // Primary path: serialize into an SVG foreignObject and let Chrome rasterize
  // it — pixel-identical to the preview. Any failure falls through to the
  // html2canvas path below (which carries its own layout fixes).
  try {
    return await captureElementForeignObject(el, w, h, scale);
  } catch (foError) {
    try {
      console.warn('[cv] foreignObject capture failed; falling back to html2canvas', foError);
    } catch {
      // console unavailable
    }
  }

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
  clone.style.boxSizing = 'border-box';
  clone.style.overflow = 'hidden';
  clone.style.backgroundColor = '#ffffff';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.display = 'block';

  // Attach to live DOM immediately so getComputedStyle returns accurate geometry
  host.appendChild(clone);
  document.body.appendChild(host);

  // Double rAF: give the browser two frames to fully compute layout on the mounted clone.
  // rAF never fires in hidden/background tabs, so race a timeout fallback — otherwise an
  // export started in a background tab hangs forever at "Downloading...".
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    setTimeout(resolve, 500);
  });

  // Strip contenteditable so no selection caret or focus rings appear
  clone.removeAttribute('contenteditable');
  clone.querySelectorAll('[contenteditable]').forEach((c) => c.removeAttribute('contenteditable'));

  // Remove page-number badges, floating icons, and print-hidden elements
  clone.querySelectorAll('.print\\:hidden, [class*="print:hidden"], .absolute.bottom-3').forEach((c) => c.remove());

  // Helper to align SVGs and add physical right margin so html2canvas never overlaps icon with text
  const formatSvgIcons = (root: ParentNode) => {
    root.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
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

        // In html2canvas, vertical-align: -0.15em aligns the SVG icon's optical center
        // with the text cap/x-height baseline, completely eliminating upward floating icons.
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = '-0.15em';
        svg.style.flexShrink = '0';
        svg.style.position = 'relative';
        svg.style.transform = 'none';

        const parent = svg.parentElement;
        if (parent) {
          parent.style.display = 'inline-block';
          parent.style.verticalAlign = 'baseline';
        }

        // html2canvas ignores flex 'gap'. Set explicit margin-right if followed by text or sibling
        const nextSibling = svg.nextElementSibling as HTMLElement | null;
        if (nextSibling || (parent && parent.textContent && parent.textContent.trim().length > 0)) {
          svg.style.margin = '0 5px 0 0';
          if (nextSibling) {
            nextSibling.style.display = 'inline-block';
            nextSibling.style.verticalAlign = 'baseline';
          }
        } else {
          svg.style.margin = '0';
        }
      } catch {
        // Fallback: ignore SVG color resolution errors
      }
    });
  };

  // Emulate flex gaps with explicit margins for html2canvas (which ignores gap/gap-x/gap-y)
  const emulateFlexGaps = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>('.flex, [class*="gap-"]').forEach((container) => {
      let colGap = 0;
      let rowGap = 0;
      const classNames = container.className || '';

      if (classNames.includes('gap-x-1.5')) colGap = 6;
      else if (classNames.includes('gap-x-1')) colGap = 4;
      else if (classNames.includes('gap-x-2')) colGap = 8;
      else if (classNames.includes('gap-x-3')) colGap = 12;
      else if (classNames.includes('gap-x-4')) colGap = 16;
      else if (classNames.includes('gap-x-6')) colGap = 24;

      if (classNames.includes('gap-y-1.5')) rowGap = 6;
      else if (classNames.includes('gap-y-1')) rowGap = 4;
      else if (classNames.includes('gap-y-2')) rowGap = 8;
      else if (classNames.includes('gap-y-3')) rowGap = 12;
      else if (classNames.includes('gap-y-4')) rowGap = 16;

      if (classNames.includes('gap-1')) { colGap = colGap || 4; rowGap = rowGap || 4; }
      else if (classNames.includes('gap-2')) { colGap = colGap || 8; rowGap = rowGap || 8; }
      else if (classNames.includes('gap-3')) { colGap = colGap || 12; rowGap = rowGap || 12; }
      else if (classNames.includes('gap-4')) { colGap = colGap || 16; rowGap = rowGap || 16; }

      try {
        const cs = window.getComputedStyle(container);
        const compCol = parseFloat(cs.columnGap);
        const compRow = parseFloat(cs.rowGap);
        if (!isNaN(compCol) && compCol > 0) colGap = compCol;
        if (!isNaN(compRow) && compRow > 0) rowGap = compRow;
      } catch {}

      if (colGap > 0 || rowGap > 0) {
        const children = Array.from(container.children) as HTMLElement[];
        children.forEach((child, idx) => {
          if (colGap > 0 && idx < children.length - 1) {
            const currentR = parseFloat(child.style.marginRight) || 0;
            if (currentR < colGap) {
              child.style.marginRight = `${colGap}px`;
            }
          }
          if (rowGap > 0) {
            const currentB = parseFloat(child.style.marginBottom) || 0;
            if (currentB < rowGap) {
              child.style.marginBottom = `${rowGap}px`;
            }
          }
        });
      }
    });
  };

  // Emulate grid columns with percentage widths for html2canvas (which ignores display: grid)
  const emulateGridColumns = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>('.grid, [data-skills-grid]').forEach((gridEl) => {
      const cls = gridEl.className || '';
      const cols = cls.includes('grid-cols-4') ? 4 : cls.includes('grid-cols-3') ? 3 : cls.includes('grid-cols-2') ? 2 : 0;
      if (cols > 1) {
        gridEl.style.display = 'block';
        gridEl.style.width = '100%';
        gridEl.style.boxSizing = 'border-box';
        const items = Array.from(gridEl.children) as HTMLElement[];
        const pct = (100 / cols);
        items.forEach((item) => {
          item.style.display = 'inline-block';
          item.style.verticalAlign = 'top';
          item.style.width = `${pct}%`;
          item.style.boxSizing = 'border-box';
          item.style.paddingRight = '8px';
          item.style.paddingBottom = '3px';
        });
      }
    });
  };

  formatSvgIcons(clone);
  emulateFlexGaps(clone);
  emulateGridColumns(clone);

  // Lock section headers, wrappers and dividers so text never separates from
  // backgrounds or borders (bordered headers get the bar treatment — see
  // lockHeadingGeometry).
  lockHeadingGeometry(clone);

  // Convert HR borders to clean solid background block for html2canvas consistency,
  // preserving the source rule's thickness (e.g. Regent's 2.5px contact rule).
  clone.querySelectorAll<HTMLHRElement>('hr').forEach((hr) => {
    try {
      const comp = window.getComputedStyle(hr);
      const hrColor = toSrgbString(comp.borderTopColor || comp.borderColor || comp.color || '#e5e7eb');
      hr.style.border = 'none';
      hr.style.height = `${Math.max(1, parseFloat(comp.borderTopWidth) || 1)}px`;
      hr.style.backgroundColor = hrColor;
    } catch {
      // Fallback
    }
  });

  // Strip shadows and force letter-spacing normal to prevent html2canvas double-rendering bug
  clone.querySelectorAll<HTMLElement>('*').forEach((child) => {
    if (child.style) {
      if (child.style.boxShadow) child.style.boxShadow = 'none';
      if (child.style.textShadow) child.style.textShadow = 'none';
      child.style.letterSpacing = 'normal';
    }
  });

  // Prevent mobile text autosizing / font boosting
  clone.style.webkitTextSizeAdjust = '100%';
  (clone.style as any).textSizeAdjust = '100%';

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
        if (clonedDoc.defaultView) {
          try {
            clonedDoc.defaultView.scrollTo(0, 0);
          } catch {}
        }
        if (clonedDoc.documentElement) {
          clonedDoc.documentElement.scrollTop = 0;
          clonedDoc.documentElement.scrollLeft = 0;
          clonedDoc.documentElement.style.backgroundColor = '#ffffff';
          clonedDoc.documentElement.style.color = '#18181b';
          clonedDoc.documentElement.style.visibility = 'visible';
          clonedDoc.documentElement.style.webkitTextSizeAdjust = '100%';
          (clonedDoc.documentElement.style as any).textSizeAdjust = '100%';
        }
        if (clonedDoc.body) {
          clonedDoc.body.scrollTop = 0;
          clonedDoc.body.scrollLeft = 0;
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.color = '#18181b';
          clonedDoc.body.style.visibility = 'visible';
          clonedDoc.body.style.webkitTextSizeAdjust = '100%';
          (clonedDoc.body.style as any).textSizeAdjust = '100%';
        }

        // Inject global override inside clonedDoc iframe to completely prevent html2canvas letterSpacing double-render bug and ensure contact links underline
        try {
          const resetStyle = clonedDoc.createElement('style');
          resetStyle.textContent = `
            * {
              letter-spacing: normal !important;
              text-shadow: none !important;
              box-shadow: none !important;
            }
            a[data-path="linkedin"],
            a[data-path="portfolio"],
            a[data-path="github"] {
              text-decoration: underline !important;
            }
          `;
          clonedDoc.head?.appendChild(resetStyle);
        } catch {}

        // Copy fonts and font links into clonedDoc iframe
        if (typeof document !== 'undefined') {
          if (document.fonts && (clonedDoc as any).fonts) {
            document.fonts.forEach((font) => {
              try {
                (clonedDoc as any).fonts.add(font);
              } catch {}
            });
          }
          document.querySelectorAll<HTMLLinkElement>('link[rel*="stylesheet"]').forEach((link) => {
            if (!clonedDoc.head?.querySelector(`link[href="${link.href}"]`)) {
              try {
                const l = clonedDoc.createElement('link');
                l.rel = 'stylesheet';
                l.href = link.href;
                clonedDoc.head?.appendChild(l);
              } catch {}
            }
          });
        }

        // Lock all SVGs inside cloned document with explicit margin
        formatSvgIcons(clonedDoc);

        // Emulate flex gaps and grid tracks inside cloned document
        emulateFlexGaps(clonedDoc);
        emulateGridColumns(clonedDoc);

        // Lock all headings and section headers inside cloned document
        lockHeadingGeometry(clonedDoc);

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

    const timeoutMs = scale <= 2 ? 15000 : Math.round(scale * 8000);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('PDF capture timed out. Please try again.')), timeoutMs)
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
 * Resolve the resume page elements to capture, plus a cleanup fn for any
 * offscreen render it created.
 *
 * 1. Pristine offscreen render: ResumePreview rendered at standard desktop
 *    width in an offscreen container — guarantees identical desktop paper
 *    dimensions, accurate font metrics, and full page slicing even on mobile
 *    phones or when the editor tab is active.
 * 2. Fallback: progressively looser searches of the live DOM.
 *
 * Throws if no pages can be found at all.
 */
async function resolveExportSheets(
  dataWithTemplate: ResumeData,
  resolvedTemplate: TemplateType,
  paperW: number
): Promise<{ sheets: HTMLElement[]; cleanup: () => void }> {
  let sheets: HTMLElement[] = [];
  let cleanupOffscreen: (() => void) | null = null;

  // 1. Pristine offscreen render
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
        const allSheets = offscreenHost.querySelectorAll<HTMLElement>('.resume-page-sheet');
        if (isPaginated && found.length > 0 && found[0].innerHTML.trim().length > 50) {
          // Double-rAF confirms layout has settled; rAF never fires in hidden tabs,
          // so race a timeout fallback or a backgrounded export hangs forever.
          new Promise<void>((r) => {
            requestAnimationFrame(() => requestAnimationFrame(() => r()));
            setTimeout(r, 500);
          }).then(resolve);
        } else if (allSheets.length > 0 && allSheets[0].innerHTML.trim().length > 50 && attempts > 8) {
          // Single-page physical sheet (data-paginated-sheet="false") settled
          new Promise<void>((r) => {
            requestAnimationFrame(() => requestAnimationFrame(() => r()));
            setTimeout(r, 500);
          }).then(resolve);
        } else if (attempts < 80) {
          setTimeout(check, 50);
        } else {
          resolve();
        }
      };
      check();
    });

    const paginatedSheets = Array.from(offscreenHost.querySelectorAll<HTMLElement>('.resume-page-sheet[data-paginated-sheet="true"]'));
    const offscreenSheets = paginatedSheets.length > 0
      ? paginatedSheets
      : Array.from(offscreenHost.querySelectorAll<HTMLElement>('.resume-page-sheet'));
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

  return { sheets, cleanup: cleanupOffscreen ?? (() => {}) };
}

/**
 * Exports all visible resume page sheets directly to PDF using html2canvas + jsPDF.
 * RASTER output (image-based, no text layer) — kept as an explicit legacy fallback only;
 * prefer exportResumeToServerPdf for downloads.
 *
 * `scale` controls raster resolution (CSS px × scale = image px; ×96 = DPI):
 * 2 ≈ 192 DPI standard, 3.125 = exactly 300 DPI for print-grade samples.
 */
export async function exportResumeToPdf(
  data: ResumeData,
  template?: TemplateType,
  customFilename?: string,
  scale: number = 2
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

  const { sheets, cleanup } = await resolveExportSheets(dataWithTemplate, resolvedTemplate, paperW);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format,
      compress: true,
    });

    const SCALE = Math.max(1, scale);

    // The raster page is a flat image, so anchors can't stay live on their
    // own — carry their rectangles over as PDF link annotations so contact
    // links (email, LinkedIn, GitHub, portfolio) stay clickable in exports.
    const collectLinkRects = (sheet: HTMLElement) => {
      const links: Array<{ x: number; y: number; w: number; h: number; url: string }> = [];
      const sheetBox = sheet.getBoundingClientRect();
      const layoutW = sheet.offsetWidth || sheetBox.width || paperW;
      const layoutH = sheet.offsetHeight || sheetBox.height;
      // The sheet may carry a preview transform; divide it back out so the
      // measured rects land in the same coordinate space as the capture.
      const zx = sheetBox.width ? sheetBox.width / layoutW : 1;
      const zy = sheetBox.height ? sheetBox.height / layoutH : 1;
      const pxToMm = pageWidthMm / layoutW;
      sheet.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.length > 2048) return;
        const rects = Array.from(a.getClientRects());
        const box = rects.length
          ? rects.reduce(
              (acc, r) => ({
                left: Math.min(acc.left, r.left),
                top: Math.min(acc.top, r.top),
                right: Math.max(acc.right, r.right),
                bottom: Math.max(acc.bottom, r.bottom),
              }),
              { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
            )
          : a.getBoundingClientRect();
        if (!isFinite(box.left) || box.right <= box.left || box.bottom <= box.top) return;
        links.push({
          x: ((box.left - sheetBox.left) / zx) * pxToMm,
          y: ((box.top - sheetBox.top) / zy) * pxToMm,
          w: ((box.right - box.left) / zx) * pxToMm,
          h: ((box.bottom - box.top) / zy) * pxToMm,
          url: href,
        });
      });
      return links;
    };

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

      for (const link of collectLinkRects(sheet)) {
        pdf.link(link.x, link.y, link.w, link.h, { url: link.url });
      }
    }

    const pdfBlob = pdf.output('blob');
    downloadFile(pdfBlob, finalFilename);
  } finally {
    cleanup();
  }
}

export type ImageExportFormat = 'png' | 'jpeg' | 'jpg';

/**
 * Export the resume as a single high-quality image (PNG or JPG).
 *
 * Uses pristine offscreen rendering + html2canvas capture.
 * Multi-page resumes are stitched into a single tall image with a clean white gap between pages.
 * A solid white background canvas is always guaranteed so JPEG never turns transparent areas black.
 *
 * `scale` controls image resolution (CSS px × scale = image px; ×96 = DPI):
 * 3.125 = exactly 300 DPI for print-grade samples.
 */
export async function exportResumeToImage(
  data: ResumeData,
  template?: TemplateType,
  customFilename?: string,
  scale: number = 3.125,
  format: ImageExportFormat = 'png',
  quality: number = 0.95
): Promise<void> {
  const isJpeg = format.toLowerCase() === 'jpeg' || format.toLowerCase() === 'jpg';
  const ext = isJpeg ? 'jpg' : 'png';
  const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
  const resolvedTemplate: TemplateType = data.template || template || 'vanguard';
  const dataWithTemplate: ResumeData = { ...data, template: resolvedTemplate };
  const baseName = customFilename && customFilename.trim()
    ? sanitizeFilename(customFilename.trim(), 'Resume')
    : `${sanitizeFilename(dataWithTemplate.fullName, 'Resume')}_Resume`;
  const finalFilename = `${baseName}.${ext}`;
  const pageSize = (dataWithTemplate.pageSize || 'letter').toLowerCase();
  const isA4 = pageSize === 'a4';
  const paperW = isA4 ? 794 : 816;

  const { sheets, cleanup } = await resolveExportSheets(dataWithTemplate, resolvedTemplate, paperW);

  try {
    const SCALE = Math.max(1, scale);
    const canvases: HTMLCanvasElement[] = [];

    for (let i = 0; i < sheets.length; i++) {
      try {
        canvases.push(await captureElement(sheets[i], SCALE, isA4 ? 'a4' : 'letter'));
      } catch (err) {
        console.error('Canvas capture error on sheet', i, err);
        throw new Error(`Failed to capture page ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (canvases.length === 0) {
      throw new Error('No pages captured for image export.');
    }

    // Always create a clean white-background canvas to ensure JPEG never turns unfilled areas black
    const gapPx = Math.round(16 * SCALE);
    const width = Math.max(...canvases.map((c) => c.width));
    const height = canvases.length === 1
      ? canvases[0].height
      : canvases.reduce((sum, c) => sum + c.height, 0) + gapPx * (canvases.length - 1);

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = height;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not create image canvas. Please try again.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    let y = 0;
    for (const c of canvases) {
      ctx.drawImage(c, Math.round((width - c.width) / 2), y);
      y += c.height + gapPx;
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      finalCanvas.toBlob(resolve, mimeType, isJpeg ? quality : undefined)
    );
    if (!blob) throw new Error(`${ext.toUpperCase()} encoding failed. Please try again.`);
    downloadFile(blob, finalFilename);
  } finally {
    cleanup();
  }
}

/**
 * Backward compatibility wrapper for PNG image export.
 */
export async function exportResumeToImagePng(
  data: ResumeData,
  template?: TemplateType,
  customFilename?: string,
  scale: number = 3.125
): Promise<void> {
  return exportResumeToImage(data, template, customFilename, scale, 'png');
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
