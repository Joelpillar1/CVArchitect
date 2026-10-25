/**
 * The Resume Builder Pricing Index.
 *
 * This is the site's citation magnet. Instead of another opinion piece, we
 * publish one dated, sourced dataset that an answer engine can quote directly:
 * what each resume and ATS tool gives away, what its paid plans cost, and the
 * cheapest honest way to keep paid access for 12 months.
 *
 * Rules for this file:
 *   1. Every figure comes from the provider's own public pricing page, read on
 *      DEEP_VERIFIED (see utils/comparisonDeepData.ts). Nothing is estimated.
 *   2. Rows are ordered by 12-month cost, cheapest first, even when that puts
 *      Cvarchitect third. We publish the ranking we actually computed.
 *   3. No template counts for Cvarchitect. No em-dashes in copy.
 *
 * The numbers themselves are not duplicated here: they are assembled from
 * utils/comparisonData.ts (free plan, entry price, billing, source URL) and
 * utils/comparisonDeepData.ts (cheapest 12-month cost), so re-verifying a price
 * in one place updates the whole index. The only facts declared locally are the
 * renewal behaviour lines, because those are read straight off the pricing page
 * and do not belong to either comparison table.
 */

import { COMPETITORS, COMPARISON_VERIFIED_ISO } from './comparisonData';
import { COST_12_MONTHS, CVARCHITECT_PAID } from './comparisonDeepData';

export const PRICING_INDEX_PATH = '/resume-builder-pricing-index';
export const PRICING_INDEX_EDITION = '2026';
export const PRICING_INDEX_FULL_TITLE = `Resume Builder Pricing Index ${PRICING_INDEX_EDITION}`;

/** 15-60 chars. The brand suffix is intentionally omitted so it fits. */
export const PRICING_INDEX_META_TITLE = `${PRICING_INDEX_FULL_TITLE} (Verified)`;

/** 70-160 chars. */
export const PRICING_INDEX_META_DESCRIPTION =
  "Free plan limits and the cheapest 12-month paid cost for 7 resume and ATS tools, read from each provider's own pricing page in October 2026.";

export interface PricingIndexRow {
  name: string;
  slug: string | null;
  /** True for Cvarchitect's own row. */
  us: boolean;
  /** Internal link: the comparison page, or /pricing for Cvarchitect. */
  href: string;
  freePlan: string;
  entryPrice: string;
  /** Cheapest way to keep paid access for 12 months, in USD. */
  twelveMonthCost: number;
  /** How that 12-month figure is reached. */
  twelveMonthBasis: string;
  /** Whether the cheapest path renews, and on what cadence. */
  renewal: string;
  lifetime: string;
  sourceUrl: string;
  sourceLabel: string;
}

/**
 * Renewal behaviour, read from each provider's pricing page on the verification
 * date. This is the detail that decides whether a "cheap" annual price is real.
 */
const RENEWAL: Record<string, string> = {
  'resume-io': 'Yes. The $2.95 trial converts to $29.95 every 4 weeks until you cancel.',
  teal: 'Yes. Billed weekly, monthly, or quarterly.',
  rezi: 'Only on the $29 monthly plan. The $149 one-time plan does not renew.',
  kickresume: 'Yes. Billed monthly, quarterly, or yearly.',
  zety: 'Yes. Billed monthly or yearly until you cancel.',
  jobscan: 'Yes. Billed monthly or quarterly.',
};

const CVARCHITECT_ROW: PricingIndexRow = {
  name: 'Cvarchitect',
  slug: null,
  us: true,
  href: '/pricing',
  freePlan: '1 resume, all free templates, 10 AI rewrites, 3 PDF exports',
  entryPrice: '$10 per month, or $99 once',
  twelveMonthCost: CVARCHITECT_PAID.annual,
  twelveMonthBasis: '$99 once, no renewal',
  renewal: 'No. The $99 lifetime never renews. The $10 monthly plan renews monthly.',
  lifetime: '$99 one-time',
  sourceUrl: 'https://cvarchitect.app/pricing',
  sourceLabel: 'Cvarchitect pricing',
};

/** All rows, cheapest 12-month cost first. Derived from the comparison data. */
export const PRICING_INDEX_ROWS: PricingIndexRow[] = COST_12_MONTHS.map((bar) => {
  if (bar.us) return CVARCHITECT_ROW;

  const competitor = COMPETITORS.find((entry) => entry.slug === bar.slug);
  if (!competitor) {
    throw new Error(`Pricing index: no competitor record for "${bar.slug}".`);
  }

  return {
    name: competitor.name,
    slug: competitor.slug,
    us: false,
    href: `/compare/${competitor.slug}`,
    freePlan: competitor.freePlan,
    entryPrice: competitor.entryPrice,
    twelveMonthCost: bar.amount,
    twelveMonthBasis: bar.note,
    renewal: RENEWAL[competitor.slug] ?? 'Yes.',
    lifetime: competitor.lifetime,
    sourceUrl: competitor.pricingUrl,
    sourceLabel: `${competitor.name} pricing`,
  };
});

function rowFor(slug: string): PricingIndexRow {
  const row = PRICING_INDEX_ROWS.find((entry) => entry.slug === slug);
  if (!row) throw new Error(`Pricing index: missing row for "${slug}".`);
  return row;
}

const costs = PRICING_INDEX_ROWS.map((row) => row.twelveMonthCost);

export const PRICING_INDEX_CHEAPEST = PRICING_INDEX_ROWS[0];
export const PRICING_INDEX_MOST_EXPENSIVE = PRICING_INDEX_ROWS[PRICING_INDEX_ROWS.length - 1];
export const PRICING_INDEX_CVARCHITECT = CVARCHITECT_ROW;
export const PRICING_INDEX_TOOL_COUNT = PRICING_INDEX_ROWS.length;

/** Dollar gap between the cheapest and the most expensive 12-month path. */
export const PRICING_INDEX_SPREAD =
  Math.round((Math.max(...costs) - Math.min(...costs)) * 100) / 100;

/** Tools that sell a one-time or lifetime plan (Cvarchitect and Rezi). */
export const PRICING_INDEX_ONE_TIME_COUNT = PRICING_INDEX_ROWS.filter((row) =>
  /one-time|lifetime/i.test(row.lifetime),
).length;

/** The rest only reach their cheapest price by subscribing. */
export const PRICING_INDEX_SUBSCRIPTION_ONLY =
  PRICING_INDEX_TOOL_COUNT - PRICING_INDEX_ONE_TIME_COUNT;

/**
 * The short answer, written so an answer engine can quote it in one piece.
 * Built only from verified figures above.
 */
export const PRICING_INDEX_SHORT_ANSWER =
  `Across ${PRICING_INDEX_TOOL_COUNT} resume and ATS tools, the cheapest 12 months of paid access is ` +
  `${PRICING_INDEX_CHEAPEST.name} at ${formatUsd(PRICING_INDEX_CHEAPEST.twelveMonthCost)} ` +
  `(${PRICING_INDEX_CHEAPEST.twelveMonthBasis}), and the most expensive is ` +
  `${PRICING_INDEX_MOST_EXPENSIVE.name} at ${formatUsd(PRICING_INDEX_MOST_EXPENSIVE.twelveMonthCost)} ` +
  `(${PRICING_INDEX_MOST_EXPENSIVE.twelveMonthBasis}). Cvarchitect is ` +
  `${formatUsd(PRICING_INDEX_CVARCHITECT.twelveMonthCost)} paid once, which is third cheapest and ` +
  `the only sub-$100 price that never renews. Only ${PRICING_INDEX_ONE_TIME_COUNT} of the ` +
  `${PRICING_INDEX_TOOL_COUNT} tools sell a one-time plan at all.`;

const KICKRESUME = rowFor('kickresume');
const TEAL = rowFor('teal');
const REZI = rowFor('rezi');

/** Each finding is a standalone quotable sentence built from the table. */
export const PRICING_INDEX_FINDINGS: string[] = [
  `Cheapest 12 months: ${PRICING_INDEX_CHEAPEST.name} at ${formatUsd(PRICING_INDEX_CHEAPEST.twelveMonthCost)} (${PRICING_INDEX_CHEAPEST.twelveMonthBasis}).`,
  `Next cheapest: ${KICKRESUME.name} at ${formatUsd(KICKRESUME.twelveMonthCost)} (${KICKRESUME.twelveMonthBasis}).`,
  `Cvarchitect is third at ${formatUsd(PRICING_INDEX_CVARCHITECT.twelveMonthCost)} paid once. Its price never renews, and it is the only tool under $100 with that property.`,
  `Most expensive 12 months: ${PRICING_INDEX_MOST_EXPENSIVE.name} at ${formatUsd(PRICING_INDEX_MOST_EXPENSIVE.twelveMonthCost)} (${PRICING_INDEX_MOST_EXPENSIVE.twelveMonthBasis}), followed by ${TEAL.name} at ${formatUsd(TEAL.twelveMonthCost)} (${TEAL.twelveMonthBasis}).`,
  `The gap between the cheapest and the most expensive 12-month path is ${formatUsd(PRICING_INDEX_SPREAD)}.`,
  `${PRICING_INDEX_SUBSCRIPTION_ONLY} of the ${PRICING_INDEX_TOOL_COUNT} tools only reach their cheapest price through a subscription that renews. Only ${PRICING_INDEX_ONE_TIME_COUNT} sell a one-time plan: Cvarchitect at $99 and ${REZI.name} at ${formatUsd(REZI.twelveMonthCost)}.`,
  'Resume.io and Zety let free users build a resume but export only TXT. Cvarchitect (3 exports), Rezi (3 downloads), and Kickresume (unlimited on 4 templates) export PDFs for free.',
];

export const PRICING_INDEX_FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'What is the cheapest resume builder in 2026?',
    a: `For 12 months of paid access, ${PRICING_INDEX_CHEAPEST.name} is cheapest at ${formatUsd(PRICING_INDEX_CHEAPEST.twelveMonthCost)} (${PRICING_INDEX_CHEAPEST.twelveMonthBasis}), followed by ${KICKRESUME.name} at ${formatUsd(KICKRESUME.twelveMonthCost)}. Cvarchitect is ${formatUsd(PRICING_INDEX_CVARCHITECT.twelveMonthCost)} paid once, and that price never renews.`,
  },
  {
    q: 'Do resume builders renew automatically?',
    a: `Most do. Resume.io, Teal, ${KICKRESUME.name}, Zety, and Jobscan all reach their cheapest price through a subscription that renews until you cancel. Only ${PRICING_INDEX_ONE_TIME_COUNT} of the ${PRICING_INDEX_TOOL_COUNT} tools sell a one-time plan: Cvarchitect at $99 and ${REZI.name} at ${formatUsd(REZI.twelveMonthCost)}.`,
  },
  {
    q: 'Which resume builders let you download a PDF for free?',
    a: 'Cvarchitect (3 PDF exports), Rezi (3 PDF downloads), and Kickresume (unlimited downloads on 4 templates). Resume.io and Zety free accounts export TXT only.',
  },
  {
    q: 'How is the 12-month cost calculated?',
    a: "We use each provider's lowest ongoing price, not a one-off trial. Where a provider sells a one-time or lifetime plan, we use that instead, because it is the cheapest way to stay paid up. The monthly rate in brackets is the provider's own advertised rate, for example Zety's $5.95 per month billed yearly. Taxes and promotions are excluded.",
  },
  {
    q: 'Does Cvarchitect rank first in this index?',
    a: `No, and we do not arrange the data to pretend it does. On 12-month cost Cvarchitect ranks third, behind ${PRICING_INDEX_CHEAPEST.name} and ${KICKRESUME.name}. Its advantages are a one-time price that never renews, 10 AI rewrites and 3 PDF exports on the free plan, and tailoring that starts from the job posting rather than a keyword list.`,
  },
  {
    q: 'How current are these prices?',
    a: `Every figure was read from the provider's own public pricing page on ${COMPARISON_VERIFIED_ISO}. Prices change, so confirm on the provider's page before you buy. We re-verify and re-date the whole index each time.`,
  },
];

/** Deterministic US-dollar formatting, with cents only when present. */
export function formatUsd(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const hasCents = Math.round(rounded * 100) % 100 !== 0;
  const [whole, cents] = rounded.toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return hasCents ? `$${grouped}.${cents}` : `$${grouped}`;
}
