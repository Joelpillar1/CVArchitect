import { describe, expect, it } from 'vitest';
import {
  parseBustemDetail,
  parseBustemFactBlock,
  parseBustemListing,
  type BustemListingEntry,
} from './bustem';

/**
 * The fact block Framer renders for every posting: labels and values separated by <br>
 * attributes. Trimmed down to the shape that matters, with the real attribute noise kept
 * because it is exactly what broke the first parser.
 */
const FACT_BLOCK = `<p dir="auto" style="--framer-font-weight:600" class="framer-text">Location<br class="framer-text">New York City<br class="framer-text"><br class="framer-text">Employment Type<br class="framer-text">Full time<br class="framer-text"><br class="framer-text">Department<br class="framer-text">Marketing<br class="framer-text"><br class="framer-text">Compensation<br class="framer-text">$100K – $130K base salary</p>`;

const INDEX_HTML = `
<div data-framer-name="Media Group Title"><h3 class="framer-text">MARKETING</h3></div>
<div data-framer-name="Media Job Cards">
  <a class="framer-card" href="./careers/content-lead">
    <h4><span class="framer-text">Content Lead</span></h4>
    <p class="framer-text">New York, NY · Full time · On-Site</p>
    <p class="framer-text">$100K – $130K</p>
  </a>
  <a class="framer-card" href="./careers/senior-software-engineer">
    <h4><span class="framer-text">Senior Software Engineer (Founding-Level)</span></h4>
    <p class="framer-text">New York, NY · Full time · On-Site</p>
    <p class="framer-text">$200K – $250K · Offers Equity</p>
  </a>
  <a href="./careers">Careers</a>
  <a href="/privacy">Privacy</a>
  <a href="./careers/content-lead">duplicate link</a>
</div>`;

function detailHtml(bodyHtml: string): string {
  return `
  <a href="../careers">Back to Careers</a>
  <div data-framer-name="Job Header">
    <div data-framer-name="Bustem Mark"><img src="logo.png"></div>
    <div><h2 class="framer-text" dir="auto">Content Lead</h2></div>
    <div><p>Bustem · Full Time, On-Site, New York City</p></div>
    <div>${FACT_BLOCK}</div>
  </div>
  <div data-framer-name="Job Overview">
    <div data-framer-name="Content Lead Description">${bodyHtml}</div>
  </div>
  <a data-framer-name="Apply Button">Apply now</a>
  <div data-framer-name="Footer"><p>unrelated footer prose</p></div>`;
}

const DETAIL_ENTRY: BustemListingEntry = {
  slug: 'content-lead',
  url: 'https://bustem.com/careers/content-lead',
  meta: 'New York, NY · Full time · On-Site',
  pay: '$100K – $130K',
};

describe('parseBustemListing', () => {
  it('keeps only real posting slugs and dedupes repeated links', () => {
    const entries = parseBustemListing(INDEX_HTML);

    expect(entries.map((e) => e.slug)).toEqual(['content-lead', 'senior-software-engineer']);
    expect(entries[0].url).toBe('https://bustem.com/careers/content-lead');
  });

  it('captures the index card meta and pay lines', () => {
    const entries = parseBustemListing(INDEX_HTML);

    expect(entries[0].meta).toBe('New York, NY · Full time · On-Site');
    expect(entries[0].pay).toBe('$100K – $130K');
    expect(entries[1].pay).toBe('$200K – $250K · Offers Equity');
  });

  it('returns an empty list when the page has no postings', () => {
    expect(parseBustemListing('<html><body><a href="./careers">careers</a></body></html>')).toEqual(
      [],
    );
  });
});

describe('parseBustemFactBlock', () => {
  it('splits labels from values despite <br> attributes', () => {
    expect(parseBustemFactBlock(FACT_BLOCK)).toEqual({
      Location: 'New York City',
      'Employment Type': 'Full time',
      Department: 'Marketing',
      Compensation: '$100K – $130K base salary',
    });
  });

  it('returns an empty object when the block is missing', () => {
    expect(parseBustemFactBlock('<p>Nothing here</p>')).toEqual({});
    expect(parseBustemFactBlock('')).toEqual({});
  });
});

describe('parseBustemDetail', () => {
  const body = `
    <p>We're hiring a Content Lead.</p>
    <h2>Who You Are</h2>
    <ul><li>2+ years creating short-form video</li></ul>
    <h2>What You'll Do</h2>
    <ul><li>Own the content engine</li></ul>`;

  it('reads the fact block out of the Job Header region', () => {
    const detail = parseBustemDetail(detailHtml(body), DETAIL_ENTRY);

    expect(detail).not.toBeNull();
    expect(detail!.title).toBe('Content Lead');
    expect(detail!.location).toBe('New York City');
    expect(detail!.employmentType).toBe('Full time');
    expect(detail!.department).toBe('Marketing');
    expect(detail!.compensation).toBe('$100K – $130K base salary');
  });

  it('captures the description body without the footer', () => {
    const detail = parseBustemDetail(detailHtml(body), DETAIL_ENTRY);

    expect(detail!.bodyHtml).toContain("We're hiring a Content Lead.");
    expect(detail!.bodyHtml).toContain('Own the content engine');
    expect(detail!.bodyHtml).not.toContain('unrelated footer prose');
  });

  it('rejects a page that has neither a title nor a body', () => {
    const broken = '<html><div data-framer-name="Job Overview"><div></div></div></html>';
    expect(parseBustemDetail(broken, DETAIL_ENTRY)).toBeNull();
  });
});