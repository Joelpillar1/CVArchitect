import { describe, it, expect } from 'vitest';
import type { ResumeData, TemplateType } from '../types';
import {
  getTemplateDefaultSectionOrder,
  getTemplateDefaultSectionTitles,
  applyTemplateSectionDefaults,
  findSectionsHiddenByDefaults,
} from '../utils/templateSectionDefaults';
import { getTemplatePreviewData } from '../utils/sampleResumeData';
import {
  getResolvedSectionOrder,
  normalizeSectionType,
  SECTION_REGISTRY,
} from '../utils/sectionRegistry';
import { sanitizeResumeData } from '../utils/resumeSanitizer';
import { mapResumeToTemplate } from '../utils/templateResumeMapper';
import { TEMPLATE_CONFIG } from '../utils/templateConfig';

/**
 * Every template's default sections must equal exactly what its gallery
 * preview renders — the gallery promise. This literal map is pinned so any
 * accidental edit to preview data (or the defaults derivation) fails loudly
 * and the change has to be made deliberately in BOTH places.
 *
 * When adding a template: add its id + preview order here.
 */
const DEFAULT_SECTION_ORDERS: Record<string, string[]> = {
  vanguard: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  elevate: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  prime: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  impact: ['summary', 'experience', 'projects', 'skills'],
  free: ['education', 'experience', 'involvement', 'skills'],
  simplepro: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  dev: ['summary', 'education', 'experience', 'projects', 'involvement', 'skills'],
  modern: ['summary', 'experience', 'education', 'skills'],
  executive: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  classic: ['summary', 'experience', 'education', 'certifications', 'skills'],
  elite: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  apex: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  wonsulting: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  styled: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  smart: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  elegant: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  minimalist: ['education', 'experience', 'projects', 'leadership', 'skills'],
  professional: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  times: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  jake: ['summary', 'skills', 'achievements', 'experience', 'projects', 'education', 'certifications', 'additionalInfo'],
  scholar: ['education', 'skills', 'projects', 'experience', 'certifications'],
  gaurav: ['summary', 'skills', 'experience', 'education', 'certifications'],
  regent: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  twocolumn: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  freshgrad1: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad2: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad3: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad4: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad5: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad6: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad7: ['education', 'experience', 'projects', 'leadership', 'skills'],
  freshgrad8: ['education', 'experience', 'projects', 'coursework', 'skills'],
  sage: ['summary', 'skills', 'achievements', 'experience', 'leadership', 'projects', 'education', 'certifications', 'additionalInfo'],
  rezi: ['education', 'experience', 'leadership', 'skills'],
  student: ['education', 'experience', 'projects', 'leadership', 'skills'],
  intern: ['summary', 'experience', 'projects', 'education', 'coursework', 'skills'],
};

const ALL_TEMPLATE_IDS = Object.keys(DEFAULT_SECTION_ORDERS) as TemplateType[];

describe('Template default sections = gallery preview (the gallery promise)', () => {
  it('pins every template in the gallery config to a literal default order', () => {
    const pinned = Object.keys(DEFAULT_SECTION_ORDERS);
    expect(pinned.length).toBe(36);
    for (const tpl of TEMPLATE_CONFIG) {
      expect(pinned, `add template '${tpl.id}' to the pinned map`).toContain(tpl.id);
    }
  });

  it('every template default equals its gallery preview sectionOrder', () => {
    for (const id of ALL_TEMPLATE_IDS) {
      expect(getTemplateDefaultSectionOrder(id), `defaults for '${id}'`).toEqual(
        DEFAULT_SECTION_ORDERS[id]
      );
      expect(getTemplatePreviewData(id).sectionOrder, `preview data for '${id}'`).toEqual(
        DEFAULT_SECTION_ORDERS[id]
      );
    }
  });

  it('default orders are free of duplicates and only contain renderable section ids', () => {
    for (const id of ALL_TEMPLATE_IDS) {
      const order = getTemplateDefaultSectionOrder(id);
      const norms = order.map((s) => normalizeSectionType(s) || s);
      expect(new Set(norms).size, `duplicate canonical ids in '${id}'`).toBe(order.length);
      for (const sid of order) {
        const canonical = normalizeSectionType(sid);
        expect(
          canonical !== null || sid.startsWith('custom_'),
          `'${id}' default '${sid}' is not a known section`
        ).toBe(true);
        if (canonical) {
          expect(SECTION_REGISTRY[canonical], `'${id}' default '${sid}' not registered`).toBeTruthy();
        }
      }
    }
  });

  it('default titles equal the titles the gallery preview shows', () => {
    const dev = getTemplatePreviewData('dev');
    const devTitles = getTemplateDefaultSectionTitles('dev');
    expect(devTitles.summary).toBe(dev.sectionTitles?.summary); // Professional Summary
    expect(devTitles.experience).toBe(dev.sectionTitles?.experience); // Work Experience
    expect(devTitles.education).toBe(dev.sectionTitles?.education); // Education
  });
});

describe('applyTemplateSectionDefaults (template switch / upload snap)', () => {
  const vanguardBase = (): ResumeData => ({
    ...getTemplatePreviewData('vanguard'),
    template: 'vanguard',
  });

  it('snaps order to the new template defaults and keeps content untouched', () => {
    const doc = vanguardBase();
    const before = {
      summary: doc.summary,
      experience: JSON.parse(JSON.stringify(doc.experience)),
      education: JSON.parse(JSON.stringify(doc.education)),
      projects: JSON.parse(JSON.stringify(doc.projects)),
      certifications: JSON.parse(JSON.stringify(doc.certifications)),
    };

    const snapped = applyTemplateSectionDefaults(doc, 'dev');

    expect(snapped.template).toBe('dev');
    expect(snapped.sectionOrder).toEqual(DEFAULT_SECTION_ORDERS.dev);
    // Nothing is ever deleted — content is byte-identical.
    expect(snapped.summary).toBe(before.summary);
    expect(snapped.experience).toEqual(before.experience);
    expect(snapped.education).toEqual(before.education);
    expect(snapped.projects).toEqual(before.projects);
    expect(snapped.certifications).toEqual(before.certifications);
  });

  it('drops template-owned sections the new template lacks (content stays, order does not)', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      // 'achievements' and 'additionalInfo' are in vanguard's defaults but not dev's.
      sectionOrder: ['summary', 'achievements', 'experience', 'additionalInfo', 'education', 'skills'],
    };
    const snapped = applyTemplateSectionDefaults(doc, 'dev');
    expect(snapped.sectionOrder).not.toContain('achievements');
    expect(snapped.sectionOrder).not.toContain('additionalInfo');
    expect((snapped.additionalInfo || []).length).toBeGreaterThan(0); // content kept
  });

  it('keeps user-added sections (tracked provenance) appended after the new defaults', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      sectionOrder: ['summary', 'experience', 'references', 'skills'],
      userAddedSections: ['references'],
      sectionVisibility: { references: true },
    };
    const snapped = applyTemplateSectionDefaults(doc, 'dev');
    expect(snapped.sectionOrder.slice(0, DEFAULT_SECTION_ORDERS.dev.length)).toEqual(
      DEFAULT_SECTION_ORDERS.dev
    );
    expect(snapped.sectionOrder).toContain('references');
    expect(snapped.userAddedSections).toEqual(['references']);
  });

  it('never duplicates a default reached via an alias id', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      userAddedSections: ['additional_information'], // alias of gallery's 'additionalInfo'
    };
    // 'elevate' shares vanguard's gallery-default order, so the snap runs.
    const snapped = applyTemplateSectionDefaults(doc, 'elevate');
    const norms = snapped.sectionOrder.map((s) => normalizeSectionType(s) || s);
    expect(new Set(norms).size).toBe(norms.length);
  });

  it('keeps custom sections (user-created by definition)', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      customSections: {
        custom_patents_1: { id: 'custom_patents_1', title: 'Patents', contentType: 'bullets', content: ['Granted one'] },
      },
    } as ResumeData;
    const snapped = applyTemplateSectionDefaults(doc, 'free');
    expect(snapped.sectionOrder).toContain('custom_patents_1');
    expect(snapped.customSections?.custom_patents_1?.title).toBe('Patents');
  });

  it('snapshots section titles to the new template while preserving custom titles', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      sectionTitles: { skills: 'Tech Stack' },
      userAddedSections: ['references'],
    };
    const snapped = applyTemplateSectionDefaults(doc, 'dev');
    // Default sections take the preview titles.
    expect(snapped.sectionTitles?.summary).toBe('Professional Summary');
    expect(snapped.sectionTitles?.experience).toBe('Work Experience');
    expect(snapped.sectionTitles?.skills).toBe('Skills'); // 'Tech Stack' was template-owned
  });

  it('keeps a user-added section visible even when the new template hides it by default', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      userAddedSections: ['references'], // globally hidden by default
    };
    const snapped = applyTemplateSectionDefaults(doc, 'dev');
    expect(snapped.sectionVisibility?.references).toBe(true);
  });

  it('persists explicit visibility flags (eye toggle is a user decision)', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      sectionVisibility: { education: false },
    };
    const snapped = applyTemplateSectionDefaults(doc, 'dev');
    expect(snapped.sectionVisibility?.education).toBe(false);
  });

  it('is a no-op when re-selecting the active template with an explicit order', () => {
    const doc: ResumeData = {
      ...vanguardBase(),
      sectionOrder: ['skills', 'experience', 'summary'], // manual reorder
      sectionTitles: { experience: 'My Experience' }, // manual rename
    };
    const same = applyTemplateSectionDefaults(doc, 'vanguard');
    expect(same.sectionOrder).toEqual(['skills', 'experience', 'summary']);
    expect(same.sectionTitles?.experience).toBe('My Experience');
  });
});

describe('mapResumeToTemplate (upload + switch enforcement point)', () => {
  const parsedUpload = () => ({
    fullName: 'Jordan Blake',
    jobTitle: 'Backend Engineer',
    email: 'jordan@example.com',
    phone: '+1 555 0100',
    skills: 'TypeScript, Go, Kafka',
    summary: 'Engineer with a decade of distributed-systems experience.',
    experience: [{ id: 'e1', company: 'Acme', role: 'Engineer', startDate: '2019', endDate: '2024', description: ['Built things.'] }],
    education: [{ id: 'ed1', school: 'State U', degree: 'BS CS', year: '2015' }],
    leadership: [{ id: 'l1', company: 'Code for Good', role: 'Mentor', startDate: '2020', endDate: '2022', description: ['Mentored students.'] }],
    certifications: [{ id: 'c1', name: 'AWS Solutions Architect', issuer: 'AWS', date: '2023' }],
  });

  it('upload snaps strictly to the target template defaults (content outside them is stored, not shown)', () => {
    const mapped = mapResumeToTemplate(parsedUpload() as Partial<ResumeData>, 'dev');
    expect(mapped.template).toBe('dev');
    expect(mapped.sectionOrder).toEqual(DEFAULT_SECTION_ORDERS.dev);
    // Stored, never deleted: 'dev' surfaces involvement natively, so the parsed
    // leadership history lands there; certifications stay in their own field.
    expect(mapped.involvement?.length).toBe(1);
    expect(mapped.certifications?.length).toBe(1);
    // ...and surfaced by the one-time notice instead of silently rendering:
    const hiddenIds = findSectionsHiddenByDefaults(mapped).map((s) => s.id);
    expect(hiddenIds).toContain('certifications');
    expect(hiddenIds).not.toContain('involvement'); // in dev's defaults — rendered
    // Standard sections with content outside the order never render:
    expect(getResolvedSectionOrder(mapped)).toContain('involvement');
    expect(getResolvedSectionOrder(mapped)).not.toContain('certifications');
  });

  it('re-mapping an already-mapped document (same template) does not disturb the order', () => {
    const mapped = mapResumeToTemplate(parsedUpload() as Partial<ResumeData>, 'dev');
    const again = mapResumeToTemplate(mapped, 'dev');
    expect(again.sectionOrder).toEqual(mapped.sectionOrder);
  });

  it('switching templates keeps user-added sections and re-snaps the rest', () => {
    const doc: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      userAddedSections: ['references'],
      sectionVisibility: { references: true },
    };
    const mapped = mapResumeToTemplate(doc, 'gaurav');
    expect(mapped.sectionOrder.slice(0, DEFAULT_SECTION_ORDERS.gaurav.length)).toEqual(
      DEFAULT_SECTION_ORDERS.gaurav
    );
    expect(mapped.sectionOrder).toContain('references');
  });

  it('Finance keeps its strict 4-section promise', () => {
    const doc: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      certifications: [{ id: 'c9', name: 'CFA Level III', issuer: 'CFA Institute', date: '2022' }],
    };
    const mapped = mapResumeToTemplate(doc, 'modern');
    expect(mapped.sectionOrder).toEqual(['summary', 'experience', 'education', 'skills']);
    // Finance folds certifications into education instead of dropping them.
    expect(mapped.education.some((e) => /CFA/.test(e.degree || ''))).toBe(true);
  });
});

describe('findSectionsHiddenByDefaults (the one-time notice)', () => {
  it('lists populated sections outside the order, skipping explicit user hides', () => {
    const data: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      sectionOrder: ['summary', 'experience', 'education', 'skills'],
      sectionVisibility: { certifications: false },
      certifications: [{ id: 'c1', name: 'PMP', issuer: 'PMI', date: '2021' }],
      referee: 'Ref available on request',
    };
    const hidden = findSectionsHiddenByDefaults(data);
    const ids = hidden.map((s) => s.id);
    expect(ids).toContain('references');
    expect(ids).not.toContain('certifications'); // user hid it deliberately
    expect(ids).not.toContain('summary'); // in the order
    expect(hidden.find((s) => s.id === 'references')?.title).toBeTruthy();
  });

  it('lists populated custom sections that fell outside the order', () => {
    const data: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      sectionOrder: ['summary'],
      customSections: {
        custom_patents_1: { id: 'custom_patents_1', title: 'Patents', contentType: 'bullets', content: ['Granted one'] },
      },
    } as ResumeData;
    const hidden = findSectionsHiddenByDefaults(data);
    expect(hidden.some((s) => s.id === 'custom_patents_1' && s.isCustom)).toBe(true);
  });
});

describe('sanitizeResumeData (load-time behavior)', () => {
  it('missing order falls back to the template defaults, not the generic registry order', () => {
    const clean = sanitizeResumeData({
      fullName: 'Legacy User',
      template: 'rezi',
      experience: [{ id: 'e1', company: 'Acme', role: 'Analyst', startDate: '2019', endDate: '2021', description: ['Did analyst work.'] }],
    } as Partial<ResumeData>);
    expect(clean.sectionOrder).toEqual(DEFAULT_SECTION_ORDERS.rezi);
  });

  it('appends template-default sections that hold content but predate the order (legacy saves)', () => {
    const clean = sanitizeResumeData({
      fullName: 'Legacy CareerCraft User',
      template: 'free',
      experience: [{ id: 'e1', company: 'Acme', role: 'Designer', startDate: '2018', endDate: '2021', description: ['Designed things.'] }],
      involvement: [{ id: 'i1', company: 'Design Club', role: 'Organizer', startDate: '2020', endDate: '2021', description: ['Ran meetups.'] }],
      // Generic legacy order — no 'involvement', though the template defaults include it.
      sectionOrder: ['summary', 'achievements', 'skills', 'experience', 'education', 'projects', 'certifications'],
    } as Partial<ResumeData>);
    expect(clean.sectionOrder).toContain('involvement');
    expect(getResolvedSectionOrder(clean)).toContain('involvement');
  });

  it('normalizes userAddedSections and defaults it to []', () => {
    const clean = sanitizeResumeData({
      fullName: 'X',
      userAddedSections: ['references', 'references', 42, ''] as unknown as string[],
    } as Partial<ResumeData>);
    expect(clean.userAddedSections).toEqual(['references']);
    const fresh = sanitizeResumeData({ fullName: 'Y' } as Partial<ResumeData>);
    expect(fresh.userAddedSections).toEqual([]);
  });
});

describe('getResolvedSectionOrder gating', () => {
  it('content alone never creates a standard section when an explicit order exists', () => {
    const data: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      sectionOrder: ['summary', 'experience', 'education', 'skills'],
      // populated but outside the order:
      leadership: [{ id: 'l1', company: 'Club', role: 'Lead', startDate: '2020', endDate: '2021', description: ['Led.'] }],
    };
    const resolved = getResolvedSectionOrder(data);
    expect(resolved).not.toContain('leadership');
    expect(resolved).toEqual(['summary', 'experience', 'education', 'skills']);
  });

  it('custom sections outside the order are still rendered (user-created)', () => {
    const data: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      sectionOrder: ['summary', 'experience'],
      customSections: {
        custom_patents_1: { id: 'custom_patents_1', title: 'Patents', contentType: 'bullets', content: ['Granted one'] },
      },
    } as ResumeData;
    expect(getResolvedSectionOrder(data)).toContain('custom_patents_1');
  });

  it('documents without an explicit order keep the legacy discovery behavior', () => {
    const data: ResumeData = {
      ...getTemplatePreviewData('vanguard'),
      template: 'vanguard',
      sectionOrder: [],
      leadership: [{ id: 'l1', company: 'Club', role: 'Lead', startDate: '2020', endDate: '2021', description: ['Led.'] }],
    };
    expect(getResolvedSectionOrder(data)).toContain('leadership');
  });
});
