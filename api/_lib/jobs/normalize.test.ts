import { describe, it, expect } from 'vitest';
import {
  bucketSections,
  buildJobId,
  companyTokensFromDomain,
  decodeHtmlEntities,
  detectWorkplaceType,
  extractBullets,
  extractSkills,
  htmlToText,
  inferExperienceLevel,
  logoUrlForDomain,
  mapDepartment,
  mapJobType,
  parseAshbyCompensation,
  parseIntervalToPeriod,
  parseSalarySummary,
  splitHtmlSections,
  toIsoString,
} from './normalize';
import { fingerprintCareersHtml } from './discovery';
import { normalizeGreenhouseJobs } from './providers/greenhouse';
import { normalizeLeverJobs } from './providers/lever';
import { normalizeAshbyJobs } from './providers/ashby';

/**
 * Normalizer tests.
 *
 * These cover the mapping decisions that are easy to get subtly wrong and expensive to
 * catch in production — Greenhouse's double-escaped bodies, remote-status precedence, and
 * the refusal to fabricate a salary or seniority level that the source never supplied.
 * Payload shapes mirror real responses captured from the live board APIs.
 */

const COMPANY = { name: 'Vercel', domain: 'vercel.com' };

describe('html handling', () => {
  it('decodes entities before stripping tags', () => {
    // Greenhouse returns HTML-escaped HTML; decoding must happen first or every
    // description reads as literal tag soup.
    const escaped = '&lt;div class=&quot;content-intro&quot;&gt;&lt;h2&gt;About Vercel:&lt;/h2&gt;';
    expect(decodeHtmlEntities(escaped)).toBe('<div class="content-intro"><h2>About Vercel:</h2>');
    expect(htmlToText(escaped)).toBe('About Vercel:');
  });

  it('decodes numeric and hex entities', () => {
    expect(decodeHtmlEntities('Caf&#233; &#x2014; bar')).toBe('Café — bar');
  });

  it('does not throw on out-of-range code points', () => {
    expect(() => decodeHtmlEntities('x&#999999999;y')).not.toThrow();
  });

  it('turns block tags into line breaks and lists into bullets', () => {
    const text = htmlToText('<p>First</p><ul><li>One</li><li>Two</li></ul>');
    expect(text).toContain('First');
    expect(text).toContain('• One');
  });

  it('extracts list items from real markup', () => {
    const html = '<ul><li>Build things</li><li>Ship things</li></ul>';
    expect(extractBullets(html)).toEqual(['Build things', 'Ship things']);
  });

  it('ignores fragments that are too short to be real bullets', () => {
    expect(extractBullets('<li>a</li><li>A real requirement sentence</li>')).toEqual([
      'A real requirement sentence',
    ]);
  });
});

describe('splitHtmlSections / bucketSections', () => {
  it('splits a job body into heading-delimited sections', () => {
    const html = '<p>Intro text that is long enough to keep.</p><h2>What you will do</h2><ul><li>Ship features</li></ul>';
    const sections = splitHtmlSections(html);
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections.some((s) => s.heading === 'What you will do')).toBe(true);
  });

  it('buckets sections by heading keyword', () => {
    const html = `
      <h2>What you will do</h2><ul><li>Write code</li><li>Review PRs</li></ul>
      <h2>Requirements</h2><ul><li>5 years experience</li></ul>
      <h2>Perks and Benefits</h2><ul><li>Unlimited PTO</li></ul>
    `;
    const { responsibilities, requirements, benefits } = bucketSections(splitHtmlSections(html));
    expect(responsibilities).toContain('Write code');
    expect(requirements).toContain('5 years experience');
    expect(benefits).toContain('Unlimited PTO');
  });

  it('de-duplicates repeated bullets across sections', () => {
    const html = '<h2>Requirements</h2><ul><li>Same</li><li>Same</li></ul>';
    const { requirements } = bucketSections(splitHtmlSections(html));
    expect(requirements).toEqual(['Same']);
  });
});

describe('detectWorkplaceType', () => {
  it('trusts a provider-declared workplace type over text sniffing', () => {
    // Lever reports "hybrid" while the location says Remote-friendly — the field wins.
    expect(detectWorkplaceType({ workplaceType: 'hybrid', location: 'Remote - US' })).toBe('Hybrid');
    expect(detectWorkplaceType({ workplaceType: 'onsite' })).toBe('On-site');
  });

  it('uses isRemote when no workplace type is declared', () => {
    expect(detectWorkplaceType({ isRemote: true, location: 'San Francisco' })).toBe('Remote');
  });

  it('reads Greenhouse-style free-text locations', () => {
    expect(detectWorkplaceType({ location: 'Hybrid - London' })).toBe('Hybrid');
    expect(detectWorkplaceType({ location: 'Remote - EMEA' })).toBe('Remote');
  });

  it('returns null rather than defaulting to Remote when nothing signals it', () => {
    // Defaulting to Remote would overstate the feed; unknown must stay unknown.
    expect(detectWorkplaceType({ location: 'San Francisco, CA' })).toBeNull();
  });
});

describe('mapJobType', () => {
  it('maps ATS employment types onto the UI enum', () => {
    expect(mapJobType('FullTime')).toBe('Full-time');
    expect(mapJobType('full-time')).toBe('Full-time');
    expect(mapJobType('Part-time')).toBe('Part-time');
    expect(mapJobType('Contract')).toBe('Contract');
    expect(mapJobType('Contractor')).toBe('Contract');
    expect(mapJobType('Internship')).toBe('Internship');
    expect(mapJobType('Intern')).toBe('Internship');
  });

  it('returns null for unknown or missing values', () => {
    expect(mapJobType(null)).toBeNull();
    expect(mapJobType('')).toBeNull();
    expect(mapJobType('Executive')).toBeNull();
  });
});

describe('inferExperienceLevel', () => {
  it('infers seniority from the title', () => {
    expect(inferExperienceLevel('Senior Software Engineer')).toBe('Senior');
    expect(inferExperienceLevel('Staff Engineer')).toBe('Lead / Staff');
    expect(inferExperienceLevel('Principal Architect')).toBe('Lead / Staff');
    expect(inferExperienceLevel('Engineering Manager')).toBe('Lead / Staff');
    expect(inferExperienceLevel('Vice President of Sales')).toBe('Executive');
    expect(inferExperienceLevel('Software Engineering Intern')).toBe('Entry Level');
    expect(inferExperienceLevel('Junior Developer')).toBe('Entry Level');
  });

  it('does not let an intern title fall through to the senior branch', () => {
    // "Intern" wins even though other keywords could match later.
    expect(inferExperienceLevel('Senior Engineering Intern')).toBe('Entry Level');
  });

  it('returns null when the title carries no seniority signal', () => {
    expect(inferExperienceLevel('Software Engineer')).toBeNull();
    expect(inferExperienceLevel('Product Designer')).toBeNull();
  });

  it('does not treat staff-level "partner" roles as executive', () => {
    // Caught by a live run: Palantir's "Administrative Business Partner" was being
    // labelled Executive, which would have misfiled ordinary admin postings.
    expect(inferExperienceLevel('Administrative Business Partner')).not.toBe('Executive');
    expect(inferExperienceLevel('People Partner')).not.toBe('Executive');
    expect(inferExperienceLevel('Managing Partner')).toBe('Executive');
  });

  it('lets an explicit seniority adjective outrank a management function word', () => {
    expect(inferExperienceLevel('Senior Technical Program Manager')).toBe('Senior');
    expect(inferExperienceLevel('Senior Engineering Manager')).toBe('Senior');
    // ...but a pure management title still lands in Lead / Staff.
    expect(inferExperienceLevel('Engineering Manager')).toBe('Lead / Staff');
  });
});

describe('mapDepartment', () => {
  it('assigns data roles to AI & Data before the engineering rule can claim them', () => {
    // "Data Engineer" matches both rules; order decides, and AI & Data is intended.
    expect(mapDepartment('Data Engineering')).toBe('AI & Data');
    expect(mapDepartment('', 'Machine Learning Engineer')).toBe('AI & Data');
  });

  it('maps common ATS department labels', () => {
    expect(mapDepartment('Engineering')).toBe('Engineering');
    expect(mapDepartment('Design')).toBe('Design & UX');
    expect(mapDepartment('Marketing')).toBe('Marketing');
    expect(mapDepartment('Finance')).toBe('Finance');
    expect(mapDepartment('Sales')).toBe('Sales & Growth');
    expect(mapDepartment('Administrative')).toBe('Operations');
  });

  it('falls back to Other instead of mislabelling unrelated roles', () => {
    expect(mapDepartment('Legal')).toBe('Operations');
    expect(mapDepartment('Jedi Council')).toBe('Other');
    expect(mapDepartment(null, null)).toBe('Other');
  });
});

describe('salary parsing', () => {
  it('extracts a structured range from Ashby compensation components', () => {
    const { salary, summary } = parseAshbyCompensation({
      compensationTierSummary: '$257K – $335K • Offers Equity',
      compensationTiers: [
        {
          components: [
            {
              compensationType: 'Salary',
              interval: '1 YEAR',
              currencyCode: 'USD',
              minValue: 257000,
              maxValue: 335000,
            },
            // Equity must NOT be folded into the salary range.
            { compensationType: 'EquityCashValue', minValue: null, maxValue: null },
          ],
        },
      ],
    });

    expect(salary).toEqual({ min: 257000, max: 335000, currency: 'USD', period: 'yearly' });
    expect(summary).toBe('$257K – $335K • Offers Equity');
  });

  it('returns a null salary but keeps the summary when no numeric pay exists', () => {
    const { salary, summary } = parseAshbyCompensation({
      compensationTierSummary: 'Offers Equity',
      compensationTiers: [{ components: [{ compensationType: 'EquityCashValue' }] }],
    });
    expect(salary).toBeNull();
    expect(summary).toBe('Offers Equity');
  });

  it('handles missing compensation entirely', () => {
    expect(parseAshbyCompensation(null)).toEqual({ salary: null, summary: null });
    expect(parseAshbyCompensation(undefined)).toEqual({ salary: null, summary: null });
  });

  it('maps pay intervals to periods', () => {
    expect(parseIntervalToPeriod('1 YEAR')).toBe('yearly');
    expect(parseIntervalToPeriod('1 HOUR')).toBe('hourly');
    expect(parseIntervalToPeriod('1 MONTH')).toBe('monthly');
    expect(parseIntervalToPeriod(null)).toBe('yearly');
  });

  it('parses a prose pay range when a provider only publishes text', () => {
    expect(parseSalarySummary('$91,000–$120,000 YEAR')).toMatchObject({
      min: 91000,
      max: 120000,
      currency: 'USD',
      period: 'yearly',
    });
  });

  it('parses abbreviated ranges and non-USD currencies', () => {
    expect(parseSalarySummary('£70k - £90k per year')).toMatchObject({
      min: 70000,
      max: 90000,
      currency: 'GBP',
    });
    expect(parseSalarySummary('€50 - €70 per hour')).toMatchObject({
      min: 50,
      max: 70,
      currency: 'EUR',
      period: 'hourly',
    });
  });

  it('declines to parse text that is not a range', () => {
    expect(parseSalarySummary('Competitive salary')).toBeNull();
    expect(parseSalarySummary('')).toBeNull();
  });
});

describe('extractSkills', () => {
  it('finds vocabulary skills in the title and description', () => {
    const skills = extractSkills(
      'Senior React Engineer',
      'You will use TypeScript, PostgreSQL and AWS daily.',
    );
    expect(skills).toContain('React');
    expect(skills).toContain('TypeScript');
    expect(skills).toContain('PostgreSQL');
    expect(skills).toContain('AWS');
  });

  it('matches skills containing regex metacharacters literally', () => {
    // "C++", "Next.js" and "CI/CD" would break a naive unescaped regex.
    const skills = extractSkills('C++ developer', 'Node.js, Next.js and CI/CD pipelines');
    expect(skills).toContain('C++');
    expect(skills).toContain('Next.js');
    expect(skills).toContain('CI/CD');
  });

  it('returns an empty array when nothing matches', () => {
    expect(extractSkills('Barista needed', 'Serve coffee politely.')).toEqual([]);
  });
});

describe('timestamp handling', () => {
  it('converts ISO strings', () => {
    expect(toIsoString('2026-08-06T12:50:10-04:00')).toBe('2026-08-06T16:50:10.000Z');
  });

  it('converts Lever epoch milliseconds', () => {
    expect(toIsoString(1711403416463)).toBe('2024-03-25T21:50:16.463Z');
  });

  it('returns null for junk instead of an Invalid Date', () => {
    expect(toIsoString(null)).toBeNull();
    expect(toIsoString('')).toBeNull();
    expect(toIsoString('not a date')).toBeNull();
  });
});

describe('identifiers and tokens', () => {
  it('namespaces ids by provider to avoid cross-provider collisions', () => {
    expect(buildJobId('greenhouse', '123')).toBe('greenhouse:123');
    expect(buildJobId('lever', '123')).not.toBe(buildJobId('greenhouse', '123'));
  });

  it('derives candidate board tokens from a domain', () => {
    expect(companyTokensFromDomain('openai.com')).toContain('openai');
    expect(companyTokensFromDomain('www.notion.so')).toContain('notion');
    expect(companyTokensFromDomain('jobs.acme.com')).toContain('acme');
  });

  it('only produces a logo URL for a real domain', () => {
    expect(logoUrlForDomain('vercel.com')).toContain('vercel.com');
    expect(logoUrlForDomain('')).toBeNull();
    expect(logoUrlForDomain(null)).toBeNull();
    expect(logoUrlForDomain('localhost')).toBeNull();
  });
});

describe('fingerprintCareersHtml', () => {
  it('detects a Greenhouse board and its token', () => {
    const html = '<script src="https://boards.greenhouse.io/vercel"></script>';
    expect(fingerprintCareersHtml(html)).toContainEqual({ provider: 'greenhouse', slug: 'vercel' });
  });

  it('detects Ashby and Lever boards', () => {
    expect(fingerprintCareersHtml('<a href="https://jobs.ashbyhq.com/ramp">')).toContainEqual({
      provider: 'ashby',
      slug: 'ramp',
    });
    expect(fingerprintCareersHtml('<a href="https://jobs.lever.co/palantir">')).toContainEqual({
      provider: 'lever',
      slug: 'palantir',
    });
  });

  it('ignores non-board path segments', () => {
    // /embed and /job_board appear in every Greenhouse embed but are not company tokens.
    const found = fingerprintCareersHtml('https://boards.greenhouse.io/embed/job_board/js');
    expect(found.every((entry) => !['embed', 'job_board', 'js'].includes(entry.slug))).toBe(true);
  });

  it('finds nothing in a page without an ATS', () => {
    expect(fingerprintCareersHtml('<html><body>Careers at Acme</body></html>')).toEqual([]);
  });
});

describe('greenhouse adapter', () => {
  const payload = {
    jobs: [
      {
        id: 6136160004,
        title: 'Account Executive, Commercial',
        absolute_url: 'https://job-boards.greenhouse.io/vercel/jobs/6136160004',
        company_name: 'Vercel',
        location: { name: 'Hybrid - London' },
        departments: [{ name: 'Sales' }],
        first_published: '2026-08-06T12:50:10-04:00',
        content: '&lt;h2&gt;What you will do&lt;/h2&gt;&lt;ul&gt;&lt;li&gt;Own a territory&lt;/li&gt;&lt;/ul&gt;',
        metadata: [{ name: 'Pay Range', value: '$91,000–$120,000' }],
      },
    ],
  };

  it('normalizes a posting end to end', () => {
    const [job] = normalizeGreenhouseJobs(payload, COMPANY, 'vercel');
    expect(job.id).toBe('greenhouse:6136160004');
    expect(job.company).toBe('Vercel');
    expect(job.workplaceType).toBe('Hybrid');
    expect(job.department).toBe('Sales & Growth');
    expect(job.sourceDepartment).toBe('Sales');
    expect(job.postedAt).toBe('2026-08-06T16:50:10.000Z');
    expect(job.responsibilities).toContain('Own a territory');
    expect(job.salary).toMatchObject({ min: 91000, max: 120000 });
    expect(job.companyLogo).toContain('vercel.com');
    // Greenhouse exposes no employment type at all.
    expect(job.jobType).toBeNull();
  });

  it('skips malformed entries without throwing', () => {
    const jobs = normalizeGreenhouseJobs(
      { jobs: [{ id: 1 }, { title: 'No id' }, { id: 2, title: 'Valid' }] },
      COMPANY,
      'vercel',
    );
    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toBe('Valid');
  });

  it('tolerates a missing jobs array', () => {
    expect(normalizeGreenhouseJobs({}, COMPANY, 'vercel')).toEqual([]);
  });
});

describe('lever adapter', () => {
  const payload = [
    {
      id: 'abc-123',
      text: 'Forward Deployed Engineer',
      createdAt: 1711403416463,
      hostedUrl: 'https://jobs.lever.co/palantir/abc-123',
      applyUrl: 'https://jobs.lever.co/palantir/abc-123/apply',
      workplaceType: 'hybrid',
      categories: { location: 'London, United Kingdom', team: 'Engineering', commitment: 'Full-time' },
      descriptionPlain: 'Build things for customers.',
      lists: [
        { text: 'What We Require', content: '<li>Strong TypeScript</li>' },
        { text: 'What We Value', content: '<li>Curiosity</li>' },
      ],
    },
  ];

  it('normalizes a posting end to end', () => {
    const [job] = normalizeLeverJobs(payload, { name: 'Palantir', domain: 'palantir.com' }, 'palantir');
    expect(job.id).toBe('lever:abc-123');
    expect(job.jobType).toBe('Full-time');
    expect(job.workplaceType).toBe('Hybrid');
    expect(job.requirements).toContain('Strong TypeScript');
    expect(job.postedAt).toBe('2024-03-25T21:50:16.463Z');
    expect(job.applyUrl).toContain('/apply');
  });

  it('returns an empty array for a non-array payload', () => {
    expect(normalizeLeverJobs({ postings: [] }, COMPANY, 'x')).toEqual([]);
    expect(normalizeLeverJobs(null, COMPANY, 'x')).toEqual([]);
  });
});

describe('ashby adapter', () => {
  const payload = {
    jobs: [
      {
        id: '8fb1615c-34bf-47c4-a1d1-b7b2f836bbd3',
        title: 'Senior Technical Program Manager',
        department: 'Technical Program Management',
        employmentType: 'FullTime',
        location: 'San Francisco',
        publishedAt: '2026-03-12T16:38:15.322+00:00',
        isListed: true,
        isRemote: false,
        jobUrl: 'https://jobs.ashbyhq.com/openai/8fb1615c',
        applyUrl: 'https://jobs.ashbyhq.com/openai/8fb1615c/apply',
        descriptionHtml: '<h2>Requirements</h2><ul><li>5+ years experience</li></ul>',
        compensation: {
          compensationTierSummary: '$257K – $335K • Offers Equity',
          compensationTiers: [
            {
              components: [
                {
                  compensationType: 'Salary',
                  interval: '1 YEAR',
                  currencyCode: 'USD',
                  minValue: 257000,
                  maxValue: 335000,
                },
              ],
            },
          ],
        },
      },
    ],
  };

  it('normalizes a posting end to end', () => {
    const [job] = normalizeAshbyJobs(payload, { name: 'OpenAI', domain: 'openai.com' }, 'openai');
    expect(job.id).toBe('ashby:8fb1615c-34bf-47c4-a1d1-b7b2f836bbd3');
    expect(job.experienceLevel).toBe('Senior');
    expect(job.jobType).toBe('Full-time');
    expect(job.department).toBe('Product');
    expect(job.requirements).toContain('5+ years experience');
    expect(job.salary).toEqual({ min: 257000, max: 335000, currency: 'USD', period: 'yearly' });
  });

  it('drops postings the employer has unlisted', () => {
    const unlisted = { jobs: [{ ...payload.jobs[0], id: 'gone', isListed: false }] };
    expect(normalizeAshbyJobs(unlisted, COMPANY, 'openai')).toEqual([]);
  });

  it('handles string-serialized booleans from older boards', () => {
    const stringly = { jobs: [{ ...payload.jobs[0], id: 'str', isListed: 'False' }] };
    expect(normalizeAshbyJobs(stringly, COMPANY, 'openai')).toEqual([]);
  });

  it('joins primary and secondary locations', () => {
    const withSecondary = {
      jobs: [{ ...payload.jobs[0], secondaryLocations: [{ location: 'New York' }] }],
    };
    const [job] = normalizeAshbyJobs(withSecondary, COMPANY, 'openai');
    expect(job.location).toBe('San Francisco, New York');
  });
});
