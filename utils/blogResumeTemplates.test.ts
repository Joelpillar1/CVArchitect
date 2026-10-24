import { describe, it, expect } from 'vitest';
import { getPostBySlug, blogPosts } from './blogData';
import { JUNIOR_ACCOUNTANT_RESUME_DATA } from './juniorAccountantData';

const SLUG = 'best-resume-templates-2026';

const ALLOWED_SECTION_TYPES = new Set([
    'paragraph',
    'heading',
    'subheading',
    'list',
    'quote',
    'tip',
    'image',
    'templatePreview',
    'bulletShowcase',
    'keyTakeaways',
    'comparisonTable',
    'faq',
    'callToAction',
]);

describe('best-resume-templates-2026 blog post', () => {
    const post = getPostBySlug(SLUG);

    it('exists and is flagged as materially revised', () => {
        expect(post).toBeDefined();
        expect(post?.updatedDate).toBe('2026-10-24');
        expect(post?.metaTitle.length).toBeGreaterThan(0);
        expect(post?.metaDescription.length).toBeGreaterThan(0);
    });

    it('ships the conversion blocks', () => {
        const types = (post?.content ?? []).map((section) => section.type);
        expect(types).toContain('keyTakeaways');
        expect(types).toContain('comparisonTable');
        expect(types).toContain('callToAction');
        expect(types).toContain('faq');
    });

    it('has a usable FAQ set for FAQPage schema', () => {
        const faqs = (post?.content ?? []).flatMap((section) =>
            section.type === 'faq' ? section.faqs ?? [] : []
        );
        expect(faqs.length).toBeGreaterThanOrEqual(5);
        for (const faq of faqs) {
            expect(faq.q.trim().length).toBeGreaterThan(8);
            expect(faq.a.trim().length).toBeGreaterThan(40);
        }
    });

    it('gives every template preview a template id and benefits', () => {
        const previews = (post?.content ?? []).filter((section) => section.type === 'templatePreview');
        expect(previews.length).toBeGreaterThanOrEqual(4);
        for (const preview of previews) {
            expect(preview.templateId).toBeTruthy();
            expect((preview.benefits ?? []).length).toBeGreaterThanOrEqual(2);
        }
    });

    it('has a table of contents worth rendering', () => {
        const headings = (post?.content ?? []).filter((section) => section.type === 'heading');
        expect(headings.length).toBeGreaterThanOrEqual(3);
    });
});

describe('blog content model integrity', () => {
    it('only uses known section types and fills required fields', () => {
        for (const post of blogPosts) {
            for (const section of post.content) {
                expect(ALLOWED_SECTION_TYPES.has(section.type)).toBe(true);

                if (section.type === 'comparisonTable') {
                    expect((section.columns ?? []).length).toBeGreaterThan(1);
                    expect((section.rows ?? []).length).toBeGreaterThan(0);
                }
                if (section.type === 'faq') {
                    expect((section.faqs ?? []).length).toBeGreaterThan(0);
                }
                if (section.type === 'keyTakeaways') {
                    expect((section.items ?? []).length).toBeGreaterThan(0);
                }
            }
        }
    });
});

describe('blog template previews render dark, not brand blue', () => {
    it('uses a dark accent for the shared preview resume', () => {
        expect(JUNIOR_ACCOUNTANT_RESUME_DATA.accentColor).toBe('#333C4D');
        expect(JUNIOR_ACCOUNTANT_RESUME_DATA.accentColor).not.toBe('#0870b8');
    });
});

describe('best-resume-format-2026 blog post', () => {
    const post = getPostBySlug('best-resume-format-2026');

    it('exists and is flagged as materially revised', () => {
        expect(post).toBeDefined();
        expect(post?.updatedDate).toBe('2026-10-24');
    });

    it('shows real resume samples instead of stock photos', () => {
        const content = post?.content ?? [];
        const samples = content.filter((section) => section.type === 'templatePreview');
        expect(samples.length).toBeGreaterThanOrEqual(2);
        for (const sample of samples) {
            expect(sample.templateId).toBeTruthy();
            expect((sample.benefits ?? []).length).toBeGreaterThanOrEqual(2);
        }
        const stockPhotos = content.filter(
            (section) => section.type === 'image' && (section.src ?? '').includes('unsplash')
        );
        expect(stockPhotos.length).toBe(0);
    });

    it('demonstrates the hybrid format with a skills-forward section order', () => {
        const hybrid = (post?.content ?? []).find((section) =>
            section.type === 'templatePreview' && (section.sectionOrder ?? []).includes('skills')
        );
        expect(hybrid).toBeDefined();
        expect(hybrid?.sectionOrder?.[0]).toBe('summary');
        expect(hybrid?.sectionOrder?.indexOf('skills')).toBeLessThan(
            hybrid?.sectionOrder?.indexOf('experience') ?? -1
        );
    });

    it('ships comparison tables, key takeaways, a CTA, and a schema FAQ', () => {
        const content = post?.content ?? [];
        const types = content.map((section) => section.type);
        expect(types).toContain('comparisonTable');
        expect(types).toContain('keyTakeaways');
        expect(types).toContain('callToAction');
        expect(types).toContain('faq');
        const faqs = content.flatMap((section) => (section.type === 'faq' ? section.faqs ?? [] : []));
        expect(faqs.length).toBeGreaterThanOrEqual(5);
    });
});

