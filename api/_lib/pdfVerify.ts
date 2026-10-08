/**
 * pdfVerify.ts — the post-render verification gate for server-generated PDFs.
 *
 * Ported discipline from MadsLorentzen/ai-job-search `tools/verify_pdf.py`:
 * never hand a user a PDF that has not been checked mechanically. A render can
 * "succeed" and still be broken — truncated output, zero pages of text, or an
 * image-only file — and an ATS parser reads the embedded *text layer*, not the
 * rendered page, so a visually perfect but empty-text PDF is a silent failure.
 *
 * Degradation rule (mirrors the upstream exit-2 semantics): if the verifier
 * itself cannot run, we report `skipped`, never `ok`. Callers decide whether a
 * skipped gate still ships the file.
 *
 * pdfjs is loaded LAZILY (dynamic `import()` inside verifyPdfBuffer), never as
 * a static module-scope import. A top-level import of the pure-ESM `pdf.mjs`
 * takes down the whole serverless function during module init on Vercel
 * (`FUNCTION_INVOCATION_FAILED` — every request, including GETs, dies before
 * the handler can answer), while a call-time `import()` runs through the native
 * ESM loader and, failing that, is caught here and degraded to `skipped`.
 */
export interface PdfGateOptions {
  /** Sanity ceiling for page count — catches runaway pagination, not a product page policy. */
  maxPages?: number;
  /** Minimum extractable characters; below this the PDF is empty or image-only. */
  minChars?: number;
  /** Strings that must appear in the text layer, matched space-insensitively. */
  requiredText?: string[];
}

export interface PdfGateResult {
  ok: boolean;
  /** null when the verifier could not read the file at all. */
  pages: number | null;
  chars: number;
  /** 'ok' | 'failed' | 'skipped' — 'skipped' is degraded mode, never a pass. */
  status: 'ok' | 'failed' | 'skipped';
  reason?: string;
}

/**
 * Normalization for keyword matching, mirroring upstream's verify_pdf.py
 * pre-checks: extractors insert spaces around punctuation
 * (`adewale @ example . com`), and templates legitimately restyle text
 * (`formatContactText` lowercases emails, name casing follows headerCase) —
 * the gate checks that CONTENT survived into the text layer, not its casing.
 */
function compact(text: string): string {
  return text.replace(/\s+/g, '').toLowerCase();
}

/**
 * Verify a generated PDF buffer: readable, sane page count, real text layer,
 * and the candidate's key strings present as literal text.
 *
 * Never throws — a verifier crash degrades to `status: 'skipped'`.
 */
export async function verifyPdfBuffer(buf: Buffer, opts: PdfGateOptions = {}): Promise<PdfGateResult> {
  const maxPages = opts.maxPages ?? 3;
  const minChars = opts.minChars ?? 50;

  try {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(buf); // copy: pdfjs detaches the input buffer
    const doc = await getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
    }).promise;

    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    const chars = text.trim().length;
    const pages = doc.numPages;
    await doc.destroy();

    if (pages < 1) {
      return { ok: false, pages, chars, status: 'failed', reason: 'PDF has no pages.' };
    }
    if (pages > maxPages) {
      return {
        ok: false,
        pages,
        chars,
        status: 'failed',
        reason: `PDF rendered ${pages} pages (ceiling ${maxPages}) — pagination likely ran away.`,
      };
    }
    if (chars < minChars) {
      return {
        ok: false,
        pages,
        chars,
        status: 'failed',
        reason: `PDF text layer has only ${chars} characters (minimum ${minChars}) — likely image-only or blank.`,
      };
    }

    const haystack = compact(text);
    const missing = (opts.requiredText || [])
      .map((needle) => needle.trim())
      .filter((needle) => needle.length > 0)
      .filter((needle) => !haystack.includes(compact(needle)));
    if (missing.length > 0) {
      return {
        ok: false,
        pages,
        chars,
        status: 'failed',
        reason: `Text missing from PDF: ${missing.join(', ')}`,
      };
    }

    return { ok: true, pages, chars, status: 'ok' };
  } catch (err) {
    // Degraded mode: the tool broke, not the PDF. Never reported as a pass.
    return {
      ok: false,
      pages: null,
      chars: 0,
      status: 'skipped',
      reason: `verifier unavailable: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
