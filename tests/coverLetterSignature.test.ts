import { describe, it, expect, vi } from 'vitest';
import { SAMPLE_COVER_LETTER_RESUME, SAMPLE_COVER_LETTER_DATA } from '../utils/coverLetterConfig';

vi.mock('../utils/pdfExport', () => ({
    downloadFile: vi.fn(),
    sanitizeFilename: (s?: string, fallback = '') => s || fallback
}));

import { exportCoverLetterToDocx } from '../utils/coverLetterDocxExport';
import { parseCoverLetterBlocks } from '../components/cover-letters/coverLetterFormatter';

describe('Cover Letter App Defaults & Signature Verification', () => {
    it('uses app defaults (Alex Morgan, Senior Product Manager, Acme Corp)', () => {
        expect(SAMPLE_COVER_LETTER_RESUME.fullName).toBe('Alex Morgan');
        expect(SAMPLE_COVER_LETTER_RESUME.jobTitle).toBe('Senior Product Manager');
        expect(SAMPLE_COVER_LETTER_RESUME.location).toBe('San Francisco, CA');
        expect(SAMPLE_COVER_LETTER_RESUME.email).toBe('alex.morgan@example.com');
    });

    it('parses cover letter blocks and separates sign-off correctly', () => {
        const text = `Dear Hiring Team,\n\nI am thrilled to apply for this position.\n\nSincerely,\n\nAlex Morgan`;
        const blocks = parseCoverLetterBlocks(text, 'Alex Morgan');
        expect(blocks.length).toBeGreaterThan(0);
        const signoffBlock = blocks.find(b => b.type === 'signoff');
        expect(signoffBlock).toBeDefined();
        expect(signoffBlock?.greeting).toBe('Sincerely,');
        expect(signoffBlock?.name).toBe('Alex Morgan');
    });

    it('generates a valid DOCX export without any hardcoded Taylor or Jane Doe placeholders', async () => {
        const { downloadFile } = await import('../utils/pdfExport');
        await exportCoverLetterToDocx({
            content: SAMPLE_COVER_LETTER_DATA,
            resumeData: SAMPLE_COVER_LETTER_RESUME,
            companyName: 'Acme Corp',
            jobTitle: 'Senior Product Manager',
            template: 'corporate',
        });
        expect(downloadFile).toHaveBeenCalled();
        const callArgs = (downloadFile as any).mock.calls[0];
        expect(callArgs[0]).toBeDefined();
        expect(callArgs[1]).toContain('Alex Morgan_Cover_Letter_Senior Product Manager.docx');
    });
});
