import { describe, it, expect } from 'vitest';
import { jsPDF } from 'jspdf';
import { verifyPdfBuffer } from './pdfVerify';

/** Build a PDF buffer with the given draw function. */
function makePdf(render: (doc: jsPDF) => void): Buffer {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  render(doc);
  return Buffer.from(doc.output('arraybuffer'));
}

describe('verifyPdfBuffer — the post-render gate', () => {
  it('passes a PDF whose text layer contains the required strings', async () => {
    const buf = makePdf((doc) => {
      doc.setFontSize(11);
      doc.text('Adewale Ojo', 50, 60);
      doc.text('adewale@example.com', 50, 80);
      doc.text('Senior Frontend Engineer', 50, 100);
    });

    const result = await verifyPdfBuffer(buf, {
      requiredText: ['Adewale Ojo', 'adewale@example.com'],
    });

    expect(result.status).toBe('ok');
    expect(result.ok).toBe(true);
    expect(result.pages).toBe(1);
    expect(result.chars).toBeGreaterThan(20);
  });

  it('rejects a PDF with no extractable text (image-only / blank render)', async () => {
    const buf = makePdf(() => {
      // deliberately renders nothing
    });

    const result = await verifyPdfBuffer(buf, { minChars: 50 });

    expect(result.status).toBe('failed');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/text layer/i);
  });

  it('rejects a PDF missing a required string (wrong resume rendered)', async () => {
    const buf = makePdf((doc) => {
      doc.text('Someone Completely Different', 50, 60);
      doc.text('lots of other extractable text so the length check passes', 50, 80);
    });

    const result = await verifyPdfBuffer(buf, { requiredText: ['Adewale Ojo'] });

    expect(result.status).toBe('failed');
    expect(result.reason).toContain('Adewale Ojo');
  });

  it('matches required text regardless of display casing (contact values are lowercased by templates)', async () => {
    const buf = makePdf((doc) => {
      // formatContactText() renders emails lowercased in every template.
      doc.text('emma.123@gmail.com', 50, 60);
      doc.text('EMMA GATES', 50, 80); // headerCase can uppercase the name
      doc.text('enough additional text to clear the minimum character threshold', 50, 100);
    });

    const result = await verifyPdfBuffer(buf, {
      requiredText: ['Emma.123@gmail.com', 'Emma Gates'],
    });

    expect(result.status).toBe('ok');
  });

  it('reports the gate as skipped — never ok — when the verifier cannot read the file', async () => {
    const result = await verifyPdfBuffer(Buffer.from('this is definitely not a pdf'));

    expect(result.status).toBe('skipped');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/verifier unavailable/i);
  });

  it('rejects only a runaway page count — any user-chosen length within the ceiling passes', async () => {
    const buf = makePdf((doc) => {
      doc.text('Adewale Ojo', 50, 60);
      for (let i = 0; i < 5; i++) doc.addPage(); // 6 pages total
    });

    const runaway = await verifyPdfBuffer(buf, {
      maxPages: 3,
      minChars: 1,
      requiredText: ['Adewale Ojo'],
    });
    expect(runaway.status).toBe('failed');
    expect(runaway.pages).toBe(6);
    expect(runaway.reason).toMatch(/ceiling/);

    // Same 6-page resume inside the real ceiling (page count is the user's choice)
    const allowed = await verifyPdfBuffer(buf, {
      maxPages: 30,
      minChars: 1,
      requiredText: ['Adewale Ojo'],
    });
    expect(allowed.status).toBe('ok');
    expect(allowed.pages).toBe(6);
  });

  it('matches required text despite extractor spacing around punctuation', async () => {
    const buf = makePdf((doc) => {
      // pdfjs reports this as "adewale @ example . com" — the gate must still match.
      doc.text('adewale@example.com', 50, 60);
      doc.text('Adewale Ojo', 50, 80);
      doc.text('enough additional text to clear the minimum character threshold', 50, 100);
    });

    const result = await verifyPdfBuffer(buf, { requiredText: ['adewale@example.com'] });

    expect(result.status).toBe('ok');
  });
});
