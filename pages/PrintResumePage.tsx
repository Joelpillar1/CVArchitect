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
  }
}

/**
 * Wait until everything the PDF depends on has actually landed:
 * 1. `document.fonts.ready` — webfonts are loaded so measurements are accurate.
 * 2. `.resume-page-sheet` elements exist and contain measured, rendered content.
 * 3. every <img> decoded — pixels available for render.
 * 4. two animation frames — React's committed DOM has been laid out and painted.
 */
async function waitForFullPaint(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    // Font Loading API unavailable — proceed rather than hang the export.
  }

  // Poll until .resume-page-sheet elements exist with rendered layout
  let attempts = 0;
  while (attempts < 60) {
    const sheets = document.querySelectorAll<HTMLElement>('.resume-page-sheet');
    if (sheets.length > 0 && sheets[0].innerHTML.trim().length > 50) {
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
    return () => document.body.classList.remove('print-resume-mode');
  }, []);

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true)).catch(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
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
