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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, TemplateType } from '../types';

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

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = cleanName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
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
export async function captureElement(el: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Wait for all web fonts to load with a 1-second timeout safety
  if (document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch {
      // Ignore font readiness errors
    }
  }

  const w = el.offsetWidth || el.clientWidth || 794;
  const h = el.offsetHeight || el.clientHeight || 1123;

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
  clone.style.height = `${h}px`;
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

  // 1. Remove awkward stretched justification gaps across all templates
  clone.querySelectorAll<HTMLElement>('.text-justify, [style*="text-align: justify"], [style*="text-align:justify"]').forEach((node) => {
    node.classList.remove('text-justify');
    node.style.setProperty('text-align', 'left', 'important');
  });

  // 2. Convert list markers and ensure uniform bullet styling on export
  const activeBulletStyle =
    clone.getAttribute('data-bullet-style') ||
    el.closest('[data-bullet-style]')?.getAttribute('data-bullet-style') ||
    'disc';
  const bulletGlyph =
    activeBulletStyle === 'check' ? '✓' : activeBulletStyle === 'dash' ? '–' : activeBulletStyle === 'none' ? '' : '•';
  const bulletWeight =
    activeBulletStyle === 'check' || activeBulletStyle === 'dash' ? 'bold' : 'normal';

  clone.querySelectorAll<HTMLUListElement>('ul').forEach((ul) => {
    const isDisc = ul.classList.contains('list-disc') || ul.classList.contains('list-outside') || window.getComputedStyle(ul).listStyleType === 'disc';
    if (isDisc) {
      ul.classList.remove('list-disc', 'list-outside');
      ul.style.setProperty('list-style', 'none', 'important');
      ul.style.setProperty('padding-left', '0', 'important');
      ul.style.setProperty('margin-left', '0', 'important');

      Array.from(ul.children).forEach((child) => {
        if (child instanceof HTMLElement && !child.querySelector('[data-bullet]')) {
          child.style.setProperty('display', 'flex', 'important');
          child.style.setProperty('align-items', 'baseline', 'important');
          child.style.setProperty('gap', '0.5rem', 'important');
          child.style.setProperty('text-align', 'left', 'important');

          const dot = document.createElement('span');
          dot.setAttribute('data-bullet', 'true');
          dot.setAttribute('aria-hidden', 'true');
          dot.style.cssText = `flex-shrink:0;user-select:none;pointer-events:none;line-height:1;color:inherit;font-weight:${bulletWeight};`;
          dot.textContent = bulletGlyph;
          if (activeBulletStyle === 'none') {
            dot.style.display = 'none';
          }
          child.insertBefore(dot, child.firstChild);
        }
      });
    }
  });

  // Ensure all standard bullets (including skills grid and converted lists) have uniform glyph and weight
  clone.querySelectorAll<HTMLElement>('[data-bullet]').forEach((dot) => {
    dot.textContent = bulletGlyph;
    dot.style.fontWeight = bulletWeight;
    dot.style.setProperty('font-weight', bulletWeight, 'important');
    if (activeBulletStyle === 'none') {
      dot.style.display = 'none';
      dot.style.setProperty('display', 'none', 'important');
    }
  });

  // ─── PHASE 1: FullName Header spacing & line-height fix ──────────────────
  //
  //  h1 elements often have leading-none (line-height: 1) and small bottom margin
  //  (0.03in / ~3px). In html2canvas, this causes font descenders to collide with
  //  or overlap the contact row immediately beneath the candidate name.
  //
  // ─── PHASE 1: FullName Header spacing & line-height fix ──────────────────
  //
  //  h1 elements often have leading-none (line-height: 1) and small bottom margin
  //  (0.03in / ~3px). In html2canvas, this causes font descenders to collide with
  //  or overlap the contact row immediately beneath the candidate name.
  //
  const h1 = clone.querySelector<HTMLElement>('header h1, header [data-path="fullName"]');
  if (h1) {
    h1.style.lineHeight = '1.25';
    const compMb = parseFloat(window.getComputedStyle(h1).marginBottom || '0');
    if (compMb < 8) {
      h1.style.marginBottom = '8px';
    }
  }

  // ─── PHASE 2: Contact row centering & spacing ─────────────────────────────
  //
  //  html2canvas ignores CSS `gap` and fails to center `justify-content: center`
  //  on flex-wrap containers. We normalize the contact container into a block with
  //  explicit text-align (matching the computed alignment), and each contact item
  //  into an inline-block element with explicit horizontal margins.
  //
  const contactContainers = clone.querySelectorAll<HTMLElement>(
    'header > div[class*="flex"], header [class*="flex-wrap"], header .contact-info, [data-contact-row]'
  );
  contactContainers.forEach((container) => {
    // Only process top-level contact container divs, not individual items or inner spans
    if (container.tagName.toLowerCase() === 'span') return;
    if (container.getAttribute('data-pdf-contact-processed')) return;
    if (container.closest('[data-pdf-contact-processed]')) return;
    container.setAttribute('data-pdf-contact-processed', 'true');

    if (!container.querySelector('svg, img')) return;

    // Read computed alignment before stripping classes
    const comp = window.getComputedStyle(container);
    const jc = comp.justifyContent;
    let align: 'left' | 'center' | 'right' = 'center';
    if (jc === 'flex-start' || jc === 'start' || container.classList.contains('justify-start')) align = 'left';
    if (jc === 'flex-end' || jc === 'end' || container.classList.contains('justify-end')) align = 'right';

    // Remove problematic Tailwind classes that html2canvas misinterprets
    const toRemove: string[] = [];
    container.classList.forEach((cls) => {
      if (
        cls.startsWith('flex') ||
        cls.startsWith('gap-') ||
        cls.startsWith('gap_') ||
        cls.startsWith('items-') ||
        cls.startsWith('justify-')
      ) {
        toRemove.push(cls);
      }
    });
    toRemove.forEach((cls) => container.classList.remove(cls));

    Object.assign(container.style, {
      display:      'block',
      textAlign:    align,
      lineHeight:   '1.4',
      width:        '100%',
      marginBottom: '6px',
    });

    Array.from(container.children).forEach((item) => {
      if (item instanceof HTMLElement) {
        const spanClasses: string[] = [];
        item.classList.forEach((cls) => {
          if (
            cls.startsWith('inline-flex') ||
            cls.startsWith('flex') ||
            cls.startsWith('gap-') ||
            cls.startsWith('items-')
          ) {
            spanClasses.push(cls);
          }
        });
        spanClasses.forEach((cls) => item.classList.remove(cls));

        Object.assign(item.style, {
          display:       'inline-block',
          verticalAlign: 'middle',
          whiteSpace:    'nowrap',
          margin:        '2px 8px',
          lineHeight:    '1.3',
        });

        // Ensure inner span or anchor text elements also align vertically
        item.querySelectorAll<HTMLElement>('span, a').forEach((child) => {
          child.style.display = 'inline-block';
          child.style.verticalAlign = 'middle';
        });
      }
    });
  });

  // ─── PHASE 3: SVG Icons to High-Res Raster <img> Elements ─────────────────
  //
  //  html2canvas has well-documented rendering defects when parsing <svg> elements
  //  inside flex containers (icons jump upwards, drop, or overlap text).
  //  By rasterizing each SVG onto an offscreen canvas at 4× scale via a data URI
  //  (avoiding any blob/CORS errors) and replacing it with a native <img> element,
  //  html2canvas renders a standard image with pixel-perfect vertical alignment.
  //
  const svgs = Array.from(clone.querySelectorAll<SVGSVGElement>('svg'));
  for (const svg of svgs) {
    const attrW = parseFloat(svg.getAttribute('width') || '0');
    const attrH = parseFloat(svg.getAttribute('height') || '0');
    const comp  = window.getComputedStyle(svg);
    const svgW  = attrW > 0 ? attrW : (parseFloat(comp.width)  || 12);
    const svgH  = attrH > 0 ? attrH : (parseFloat(comp.height) || 12);

    // Resolve stroke color from explicit attribute or computed color
    const strokeAttr = svg.getAttribute('stroke') || '';
    const resolvedStroke =
      strokeAttr && strokeAttr !== 'currentColor'
        ? toSrgbString(strokeAttr)
        : toSrgbString(
            comp.stroke && comp.stroke !== 'none' ? comp.stroke : (comp.color || '#374151')
          );

    svg.setAttribute('width',  String(svgW));
    svg.setAttribute('height', String(svgH));
    svg.setAttribute('stroke', resolvedStroke);
    if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    svg.querySelectorAll<Element>('[stroke="currentColor"]').forEach((c) => c.setAttribute('stroke', resolvedStroke));
    svg.querySelectorAll<Element>('[fill="currentColor"]').forEach((c)   => c.setAttribute('fill',   resolvedStroke));

    try {
      const xml = new XMLSerializer().serializeToString(svg);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);

      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = dataUrl;
      });

      const RASTER_SCALE = 4;
      const cvs = document.createElement('canvas');
      cvs.width = Math.max(1, Math.round(svgW * RASTER_SCALE));
      cvs.height = Math.max(1, Math.round(svgH * RASTER_SCALE));
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
      }

      const pngDataUrl = cvs.toDataURL('image/png');

      const newImg = document.createElement('img');
      newImg.src = pngDataUrl;
      newImg.width = Math.round(svgW);
      newImg.height = Math.round(svgH);
      Object.assign(newImg.style, {
        width:           `${svgW}px`,
        height:          `${svgH}px`,
        display:         'inline-block',
        position:        'relative',
        top:             '1px',
        marginRight:     '4px',
        verticalAlign:   'middle',
        flexShrink:      '0',
      });

      svg.parentNode?.replaceChild(newImg, svg);
    } catch {
      // Fallback in case of XML serialization edge cases: preserve styled SVG
      Object.assign(svg.style, {
        width:         `${svgW}px`,
        height:        `${svgH}px`,
        display:       'inline-block',
        verticalAlign: 'middle',
        marginRight:   '4px',
      });
    }
  }

  // ─── PHASE 4: Section Dividers ─────────────────────────────────────────────
  //
  //  html2canvas often renders heading bottom borders cutting directly across the
  //  heading letters due to tight line-heights and subpixel baseline math.
  //  We remove border-b and inject an explicit <div> with identical color, height,
  //  and bottom margin immediately following the heading.
  //
  clone.querySelectorAll<HTMLElement>('h1, h2, h3, h4, .section-header').forEach((h) => {
    if (h.getAttribute('data-pdf-divider')) return;

    const comp = window.getComputedStyle(h);
    const borderBottomWidth = parseFloat(comp.borderBottomWidth || '0');
    const hasBorderB = borderBottomWidth > 0 || h.className.includes('border-b');

    // Strip border-b classes so html2canvas sees no competing rules
    const toRemove: string[] = [];
    h.classList.forEach((cls) => {
      if (
        cls.startsWith('border-b') ||
        cls.startsWith('border-gray') ||
        cls.startsWith('border-black') ||
        cls.startsWith('border-[')
      ) {
        toRemove.push(cls);
      }
    });
    h.style.setProperty('border', 'none', 'important');
    h.style.setProperty('border-bottom', 'none', 'important');

    if (!hasBorderB) return;

    h.style.setProperty('padding-bottom', '2px', 'important');
    h.style.setProperty('margin-bottom', '6px', 'important');
    h.style.setProperty('line-height', '1.3', 'important');

    const borderColor = toSrgbString(comp.borderBottomColor || comp.color || '#374151');
    const originalMb = comp.marginBottom || '8px';
    const borderWidth = Math.max(1, borderBottomWidth);

    const divider = document.createElement('div');
    divider.setAttribute('aria-hidden', 'true');
    divider.setAttribute('data-pdf-divider', 'true');
    divider.style.cssText = [
      `height:${borderWidth}px`,
      `background-color:${borderColor}`,
      'width:100%',
      'display:block',
      'margin-top:0px',
      `margin-bottom:${originalMb}`,
      'box-sizing:border-box',
      'clear:both',
    ].join(';');

    h.after(divider);
  });

  // Ensure all explicit section dividers maintain a clean 6px clearance below headings
  clone.querySelectorAll<HTMLElement>('.section-divider').forEach((div) => {
    const prev = div.previousElementSibling as HTMLElement | null;
    if (prev && (prev.tagName.startsWith('H') || prev.classList.contains('section-header'))) {
      prev.style.setProperty('margin-bottom', '6px', 'important');
      div.style.setProperty('margin-top', '0px', 'important');
    }
  });

  // ─── PHASE 5: HR elements ──────────────────────────────────────────────────
  //
  //  Native <hr> borders are inconsistently rendered by html2canvas.
  //  Convert to a clean 1px solid background block while preserving template margins.
  //
  clone.querySelectorAll<HTMLHRElement>('hr').forEach((hr) => {
    const comp       = window.getComputedStyle(hr);
    const hrColor    = toSrgbString(comp.borderTopColor || comp.borderColor || comp.color || '#374151');
    const originalMb = comp.marginBottom || '12px';
    const originalMt = comp.marginTop || '6px';
    Object.assign(hr.style, {
      border:          'none',
      height:          '1px',
      backgroundColor: hrColor,
      width:           '100%',
      display:         'block',
      marginTop:       originalMt,
      marginBottom:    originalMb,
    });
  });

  // ─── PHASE 5: Shadow removal + visibility ────────────────────────────────────
  // 8. Strip shadows and ensure children visibility
  clone.querySelectorAll<HTMLElement>('*').forEach((child) => {
    if (child.style) {
      if (child.style.boxShadow) child.style.boxShadow = 'none';
      if (child.style.textShadow) child.style.textShadow = 'none';
      if (child.style.visibility === 'hidden' && !child.classList.contains('print:hidden')) {
        child.style.visibility = 'visible';
      }
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
            styleEl.textContent = styleEl.textContent.replace(/oklch\([^)]+\)|oklab\([^)]+\)|color\(display-p3[^)]+\)/gi, (match) => {
              return toSrgbString(match);
            });
          }
        });
      },
    });

    // 10-second timeout safety harness so PDF generation never hangs indefinitely
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('PDF capture timed out. Please try again or use Print / Vector PDF.')), 10000)
    );

    return await Promise.race([canvasPromise, timeoutPromise]);
  } finally {
    if (document.body.contains(host)) {
      document.body.removeChild(host);
    }
  }
}

/**
 * Exports all visible resume page sheets directly to PDF using html2canvas + jsPDF.
 */
export async function exportResumeToPdf(
  data: ResumeData,
  template: TemplateType = 'vanguard',
  customFilename?: string
): Promise<void> {
  let finalFilename: string;
  if (customFilename && customFilename.trim()) {
    const clean = sanitizeFilename(customFilename.trim(), 'Resume');
    finalFilename = `${clean}.pdf`;
  } else {
    finalFilename = `${sanitizeFilename(data.fullName, 'Resume')}_Resume.pdf`;
  }

  /**
   * Find the sheets to export.
   *
   * Priority order:
   *  1. Sheets inside the main workspace paper container ([data-resume-paper="true"])
   *     — this is the single, non-fullscreen, non-print canvas the user sees.
   *  2. Global fallback filtered to exclude:
   *     - offscreen measurement containers (.opacity-0 ancestors)
   *     - fixed-position fullscreen overlays (z-50 preview modal)
   *     - the hidden print portal (.print-root)
   */
  const getVisibleSheets = (): HTMLElement[] => {
    // 1. Prefer sheets scoped to the main workspace paper container.
    //    [data-resume-paper="true"] is set on the paperRef div in ResumeWorkspace.
    const paperContainer = document.querySelector<HTMLElement>('[data-resume-paper="true"]');
    if (paperContainer) {
      const scoped = Array.from(paperContainer.querySelectorAll<HTMLElement>('.resume-page-sheet'));
      const visible = scoped.filter((el) => {
        // Skip the offscreen measurement container inside ResumePreview
        if (el.closest('.opacity-0') || el.classList.contains('opacity-0') || el.style.opacity === '0') return false;
        const style = window.getComputedStyle(el);
        return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
      });
      if (visible.length > 0) return visible;
    }

    // 2. Global fallback: exclude fixed-position overlays and hidden print portals.
    const all = Array.from(document.querySelectorAll<HTMLElement>('.resume-page-sheet'));
    return all.filter((el) => {
      // Exclude offscreen measurement containers
      if (el.closest('.opacity-0') || el.classList.contains('opacity-0') || el.style.opacity === '0') return false;
      // Exclude the hidden print portal rendered by Editor
      if (el.closest('.print-root')) return false;
      // Exclude sheets inside fixed-position fullscreen overlays
      let ancestor: Element | null = el.parentElement;
      while (ancestor) {
        const s = window.getComputedStyle(ancestor as HTMLElement);
        if (s.position === 'fixed') return false;
        ancestor = ancestor.parentElement;
      }
      const style = window.getComputedStyle(el);
      return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
    });
  };

  let sheets = getVisibleSheets();

  // If sheets are not yet in DOM (e.g. template just switched), wait for React to commit the new render.
  if (sheets.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    sheets = getVisibleSheets();
  }

  // Final retry with a longer wait in case of slow template renders
  if (sheets.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    sheets = getVisibleSheets();
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
    throw new Error(
      'No resume pages found on screen. Please ensure your resume is visible in the editor.'
    );
  }

  const pageSize = (data.pageSize || 'letter').toLowerCase();
  const isA4 = pageSize === 'a4';

  const pageWidthMm = isA4 ? 210 : 215.9;
  const pageHeightMm = isA4 ? 297 : 279.4;
  const format = isA4 ? 'a4' : 'letter';

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
      canvas = await captureElement(sheet, SCALE);
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
    const canvas = await captureElement(targetEl, SCALE);
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

  const canvas = await captureElement(element, 2);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format, compress: true });
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  const pdfBlob = pdf.output('blob');
  downloadFile(pdfBlob, filename);
}
