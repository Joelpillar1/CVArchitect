import { describe, it, expect } from 'vitest';
import {
  cleanHtmlToText,
  retrieveJobUrl,
  generateEvidencePatterns,
  fallbackJobIntelligence,
} from '../services/jobDescriptionService';
import { JobDescriptionSchema } from '../types/agentContract';

describe('Phase 4: Job Description Intelligence Engine', () => {
  // 1. HTML Boilerplate Cleaning
  it('strips navigation, scripts, styles, and footers while preserving core job text', () => {
    const rawHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>.navbar { color: red; }</style>
          <script>console.log('tracking');</script>
        </head>
        <body>
          <nav><a href="/careers">Careers Home</a> <button>Apply Now</button></nav>
          <header>Company Logo & Header</header>
          <main>
            <h1>Staff Software Engineer — Payments</h1>
            <p>Stripe is hiring a Staff Software Engineer to lead payment orchestration.</p>
            <h3>Responsibilities</h3>
            <ul>
              <li>Design distributed payment state machines handling 100k TPS</li>
              <li>Collaborate with product and engineering teams on roadmap</li>
            </ul>
          </main>
          <footer>Copyright 2026 Stripe &bull; Privacy Policy</footer>
        </body>
      </html>
    `;

    const cleaned = cleanHtmlToText(rawHtml);

    expect(cleaned).toContain('Staff Software Engineer — Payments');
    expect(cleaned).toContain('Design distributed payment state machines');
    expect(cleaned).toContain('Collaborate with product and engineering teams');
    expect(cleaned).not.toContain('Careers Home');
    expect(cleaned).not.toContain('Copyright 2026');
    expect(cleaned).not.toContain('navbar { color: red; }');
  });

  // 2. URL Retrieval and Structured Error Handling
  it('returns structured error on invalid or unreachable URLs allowing UI fallback', async () => {
    // Invalid URL format
    const invalidRes = await retrieveJobUrl('not_a_valid_url');
    expect(invalidRes.ok).toBe(false);
    expect(invalidRes.code).toBe('invalid_url');
    expect(invalidRes.error).toContain('valid URL');

    // Unreachable non-existent URL
    const unreachableRes = await retrieveJobUrl('https://localhost.invalid.domain.9999/job');
    expect(unreachableRes.ok).toBe(false);
    expect(unreachableRes.code).toBe('url_fetch_failed');
    expect(unreachableRes.error).toContain('Please paste the job text directly');
  });

  // 3. Evidence Demonstration Pattern Generation
  it('generates rich, actionable evidence patterns for collaboration and architecture requirements', () => {
    const collabPatterns = generateEvidencePatterns(
      'Collaborate with product and engineering teams to define MVP',
      'cross_functional_collaboration'
    );
    expect(collabPatterns).toContain('working with cross-functional engineering and design partners');
    expect(collabPatterns).toContain('product planning and requirement reviews');
    expect(collabPatterns).toContain('feature prioritization with stakeholders');

    const archPatterns = generateEvidencePatterns(
      'Design distributed high-throughput event processing pipelines',
      'technical_architecture'
    );
    expect(archPatterns).toContain('system architecture diagrams and technical RFCs');
    expect(archPatterns).toContain('scaling microservices or database queries under load');
  });

  // 4. Structured Intelligence Decomposition
  it('parses raw job text into a fully weighted, categorized JobDescription model', () => {
    const rawJd = `
      Senior Backend Engineer — Real-time Infrastructure
      Stripe | San Francisco, CA | Remote
      
      About the Role:
      We are looking for a Senior Backend Engineer to architect real-time payment streaming systems.
      
      Requirements:
      • Must have 5+ years of experience with TypeScript, Node.js, and Redis
      • Experience designing distributed microservices handling high concurrency
      • Collaborate with product managers and frontend teams to deliver core APIs
      • Bachelor's degree in Computer Science or equivalent
    `;

    const job = fallbackJobIntelligence(rawJd, 'https://example.com/job/123');

    expect(job.title).toContain('Senior Backend Engineer');
    expect(job.seniority).toBe('senior');
    expect(job.sourceUrl).toBe('https://example.com/job/123');
    expect(job.requirements.length).toBeGreaterThanOrEqual(3);

    // Requirement weight & categorization check
    const toolReq = job.requirements.find((r) => r.category === 'tool');
    expect(toolReq).toBeDefined();
    expect(toolReq?.importance).toBe('must_have');
    expect(toolReq?.weight).toBe(1.0);
    expect(toolReq?.origin).toBe('explicit_jd_requirement');

    // Strategic hiring signal insight check
    expect(job.hiringSignalInsights.length).toBeGreaterThan(0);
    const insight = job.hiringSignalInsights[0];
    expect(insight.signal).toBeDefined();
    expect(insight.inference).toBeDefined();
    expect(insight.strategicAdvice).toBeDefined();

    // Strict schema compliance
    const validated = JobDescriptionSchema.safeParse(job);
    expect(validated.success).toBe(true);
  });
});
