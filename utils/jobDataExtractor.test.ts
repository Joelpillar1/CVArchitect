import { describe, it, expect } from 'vitest';
import { extractCompanyFromText, extractTitleFromText, isValidCompanyName } from './jobDataExtractor';

describe('isValidCompanyName', () => {
    it('rejects generic and invalid words', () => {
        expect(isValidCompanyName('FLOAT')).toBe(false);
        expect(isValidCompanyName('float')).toBe(false);
        expect(isValidCompanyName('remote')).toBe(false);
        expect(isValidCompanyName('hybrid')).toBe(false);
        expect(isValidCompanyName('the company')).toBe(false);
        expect(isValidCompanyName('target employer')).toBe(false);
        expect(isValidCompanyName('our team')).toBe(false);
        expect(isValidCompanyName('about the role')).toBe(false);
        expect(isValidCompanyName('the role')).toBe(false);
        expect(isValidCompanyName('who you are')).toBe(false);
    });

    it('accepts valid company names', () => {
        expect(isValidCompanyName('Google')).toBe(true);
        expect(isValidCompanyName('Stripe')).toBe(true);
        expect(isValidCompanyName('Acme Corp')).toBe(true);
        expect(isValidCompanyName('Linear')).toBe(true);
        expect(isValidCompanyName('Datadog Inc.')).toBe(true);
    });
});

describe('extractCompanyFromText', () => {
    it('extracts explicit label Company: Stripe', () => {
        const jd = `
Role: Senior Engineer
Company: Stripe
Location: Remote
We are building economic infrastructure...
`;
        expect(extractCompanyFromText(jd)).toBe('Stripe');
    });

    it('extracts explicit label Employer: Acme Technologies', () => {
        const jd = `
Employer: Acme Technologies
Job Title: Product Manager
Join us to lead our squad...
`;
        expect(extractCompanyFromText(jd)).toBe('Acme Technologies');
    });

    it('extracts from ATS URL boards.greenhouse.io/figma', () => {
        const jd = `
Apply online at https://boards.greenhouse.io/figma/jobs/12345
We are looking for a Senior Designer.
`;
        expect(extractCompanyFromText(jd)).toBe('Figma');
    });

    it('extracts from company email careers@linear.app', () => {
        const jd = `
Interested candidates please send your CV to careers@linear.app.
`;
        expect(extractCompanyFromText(jd)).toBe('Linear');
    });

    it('extracts "[Role] at [Company]" in headline', () => {
        const jd = `Senior Frontend Engineer at Datadog\nNew York, NY\nResponsibilities:...`;
        expect(extractCompanyFromText(jd)).toBe('Datadog');
    });

    it('extracts "About [Company]"', () => {
        const jd = `
Software Engineer
About Spotify:
Spotify is a digital music service...
`;
        expect(extractCompanyFromText(jd)).toBe('Spotify');
    });

    it('does NOT falsely extract "float" or section headers as company', () => {
        const jd = `
Senior Software Engineer
About the role:
We need someone who can float across multiple squads and lead frontend systems.
`;
        expect(extractCompanyFromText(jd)).not.toBe('FLOAT');
        expect(extractCompanyFromText(jd)).not.toBe('float');
        expect(extractCompanyFromText(jd)).not.toBe('the role');
    });
});

describe('extractTitleFromText', () => {
    it('extracts explicit role label', () => {
        const jd = `Job Title: Senior Product Manager\nCompany: Acme`;
        expect(extractTitleFromText(jd)).toBe('Senior Product Manager');
    });

    it('extracts title from first line', () => {
        const jd = `Lead DevOps Engineer\nRemote\nResponsibilities:...`;
        expect(extractTitleFromText(jd)).toBe('Lead DevOps Engineer');
    });
});
