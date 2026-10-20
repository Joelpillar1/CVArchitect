/**
 * PrintResumePage — a clean, standalone page used exclusively by Puppeteer
 * for PDF generation. It reads resume data + template from sessionStorage
 * (injected by the /api/export-pdf Puppeteer session), renders the selected
 * template, and sets window.__PRINT_READY__ = true only once fonts, images and
 * layout are fully painted — so Puppeteer never captures a half-rendered page.
 * If rendering is impossible (missing/invalid payload) it sets
 * window.__PRINT_ERROR__ so the endpoint can fail fast with a real message.
 *
 * SETTINGS PARITY: this wrapper applies exactly what ResumePreview's sheet
 * applies (font family, body size, line height, white-space, bullet style and
 * indent, skills casing) so the downloaded PDF matches what the user sees in
 * the editor. Vertical page margins are NOT padded here — they travel to
 * page.pdf via the API so they repeat on every page, mirroring the preview's
 * per-sheet padding.
 *
 * Route: /print-resume  (public, no auth required)
 */
import React, { useEffect, useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import ResumePreview from '../components/ResumePreview';

declare global {
  interface Window {
    /** Set true once the capture route is fully painted and safe to screenshot. */
    __PRINT_READY__: boolean;
    /** Set to a human-readable message when the capture route cannot render. */
    __PRINT_ERROR__?: string;
    /** Helper injected by index.html to force load template Google Fonts */
    loadTemplateFonts?: () => void;
  }
}

/**
 * Wait until everything the PDF depends on has actually landed:
 * 1. Web fonts are fully loaded via document.fonts.ready and document.fonts.load.
 * 2. `.resume-page-sheet[data-paginated-sheet="true"]` elements exist and contain measured, sliced content.
 * 3. Every <img> decoded — pixels available for render.
 * 4. Two animation frames — React's committed DOM has been laid out and painted.
 */
async function waitForFullPaint(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    // Font Loading API unavailable — proceed rather than hang the export.
  }

  // Poll until ResumePreview has completed measurement and sliced the real paginated sheets
  let attempts = 0;
  while (attempts < 80) {
    const root = document.querySelector<HTMLElement>('.resume-preview-root');
    const isPaginated = root?.getAttribute('data-paginated') === 'true';
    const paginatedSheets = document.querySelectorAll<HTMLElement>('.resume-page-sheet[data-paginated-sheet="true"]');
    if (isPaginated && paginatedSheets.length > 0 && paginatedSheets[0].innerHTML.trim().length > 50) {
      break;
    }
    // Fallback: if single-page mode explicitly finished
    const allSheets = document.querySelectorAll<HTMLElement>('.resume-page-sheet');
    if (attempts > 30 && allSheets.length > 0 && allSheets[0].innerHTML.trim().length > 50) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    attempts++;
  }

  await Promise.all(
    Array.from(document.images).map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return img.decode?.().catch(() => undefined) ?? Promise.resolve();
    })
  );

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export default function PrintResumePage() {
  const [state, setState] = useState<{
    data: ResumeData | null;
    template: TemplateType;
    error: string | null;
  }>({ data: null, template: 'vanguard', error: null });

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Apply clean-print body class so global CSS never hides the resume content
    document.body.classList.add('print-resume-mode');
    if (typeof window.loadTemplateFonts === 'function') {
      window.loadTemplateFonts();
    }
    return () => document.body.classList.remove('print-resume-mode');
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('__pdf_export_data__');
      if (!raw) {
        setState(s => ({ ...s, error: 'No resume data found in sessionStorage.' }));
        return;
      }
      const parsed = JSON.parse(raw) as { data: ResumeData; template: TemplateType };
      const resolvedTemplate = parsed.data?.template || parsed.template || 'vanguard';
      const dataWithTemplate = parsed.data ? { ...parsed.data, template: resolvedTemplate } : null;
      setState({ data: dataWithTemplate, template: resolvedTemplate, error: null });
    } catch (e) {
      setState(s => ({ ...s, error: 'Failed to parse resume data.' }));
    }
  }, []);

  // Ensure exact webfont is loaded and exact @page size is injected
  useEffect(() => {
    if (!state.data) return;

    // 1. Inject exact @page dimension rule matching the resume's paper format
    const isA4 = (state.data.pageSize || 'letter').toLowerCase() === 'a4';
    const existingStyle = document.getElementById('print-page-size-style');
    if (existingStyle) existingStyle.remove();
    const pageStyle = document.createElement('style');
    pageStyle.id = 'print-page-size-style';
    pageStyle.textContent = `@page { size: ${isA4 ? 'A4 portrait' : 'letter portrait'} !important; margin: 0mm !important; }`;
    document.head.appendChild(pageStyle);

    // 2. Ensure Google Fonts stylesheet is attached
    if (typeof window.loadTemplateFonts === 'function') {
      window.loadTemplateFonts();
    }

    // 3. Explicitly load font family and weights before layout measurement
    const fontName = state.data.font ? state.data.font.split(',')[0].replace(/['"]/g, '').trim() : 'Merriweather';
    const loadFont = async () => {
      try {
        if (typeof document !== 'undefined' && document.fonts?.load) {
          await Promise.allSettled([
            document.fonts.load(`12pt "${fontName}"`),
            document.fonts.load(`bold 12pt "${fontName}"`),
            document.fonts.load(`italic 12pt "${fontName}"`),
            document.fonts.load(`bold italic 12pt "${fontName}"`),
          ]);
        }
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch (err) {
        console.warn('Font load error in PrintResumePage:', err);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFont();

    return () => {
      const el = document.getElementById('print-page-size-style');
      if (el) el.remove();
    };
  }, [state.data]);

  // Signal Puppeteer once the template is fully painted (fonts + images + layout).
  // On failure, signal __PRINT_ERROR__ so the endpoint can fail fast with the
  // real reason instead of burning its 20s waitForFunction timeout.
  useEffect(() => {
    if (state.error) {
      window.__PRINT_ERROR__ = state.error;
      return;
    }
    if (!state.data || !fontsLoaded) return;

    let cancelled = false;
    waitForFullPaint()
      .then(() => {
        if (!cancelled) window.__PRINT_READY__ = true;
      })
      .catch((err) => {
        if (!cancelled) {
          window.__PRINT_ERROR__ =
            err instanceof Error ? err.message : 'Failed to paint the resume for export.';
        }
      });
    return () => {
      cancelled = true;
    };
  }, [state.data, state.error, fontsLoaded]);

  if (state.error) {
    return (
      <div style={{ padding: '2rem', color: 'red', fontFamily: 'sans-serif' }}>
        <strong>Print Error:</strong> {state.error}
      </div>
    );
  }

  if (!state.data || !fontsLoaded) {
    return (
      <div style={{ padding: '2rem', color: '#666', fontFamily: 'sans-serif' }}>
        Loading resume...
      </div>
    );
  }

  return (
    <div
      id="print-resume-root"
      data-bullet-style={state.data.bulletStyle || 'disc'}
      style={{
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
        width: '100%',
      }}
    >
      <ResumePreview
        data={state.data}
        template={state.template}
        editable={false}
      />
    </div>
  );
}
