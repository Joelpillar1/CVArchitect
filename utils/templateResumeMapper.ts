import { ResumeData, Experience, Project, Education, TemplateType, INITIAL_DATA } from '../types';
import { createDefaultSectionOrder } from './sectionRegistry';
import { applyTemplateSectionDefaults } from './templateSectionDefaults';
import { parseDescriptionBullets, formatAllResumeBullets } from './templateUtils';

/**
 * Robust boundary detector that checks if multiple distinct companies / positions
 * were mashed together into a single experience entry, and splits them into distinct entries.
 */
export function separateMergedPositions(experiences: Experience[]): Experience[] {
  if (!Array.isArray(experiences) || experiences.length === 0) return [];

  const result: Experience[] = [];

  for (const exp of experiences) {
    if (!exp) continue;

    const rawDesc = exp.description;
    const bullets = Array.isArray(rawDesc)
      ? rawDesc
      : typeof rawDesc === 'string'
      ? parseDescriptionBullets(rawDesc)
      : [];

    // Check if the description contains a mashed second company or position.
    // Common patterns:
    // "Company: XYZ | Role: ABC | 2018 - 2020"
    // "Senior Engineer at Acme Corp (2018 - 2020)"
    // Or bullet starting with a distinct Company / Date line
    const splitIndex = bullets.findIndex((b, idx) => {
      if (idx === 0) return false;
      const trimmed = b.trim();
      // Date range pattern inside bullet text
      const hasDateRange = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b(19\d{2}|20\d{2})\b)\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b(19\d{2}|20\d{2})\b|Present|Current)/i.test(trimmed);
      const hasCompanyIndicator = /\b(Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Technologies|Labs|Company|Co\.)\b/i.test(trimmed) || / at | \| /i.test(trimmed);
      return hasDateRange && hasCompanyIndicator;
    });

    if (splitIndex > 0) {
      // Split into first entry and second entry
      const firstBullets = bullets.slice(0, splitIndex);
      const remainingBullets = bullets.slice(splitIndex);
      const splitHeader = remainingBullets[0].trim();

      // Parse the second company / role from the split header line
      let secondRole = 'Position';
      let secondCompany = 'Company';
      let secondStart = '';
      let secondEnd = '';

      const dateMatch = splitHeader.match(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b(19\d{2}|20\d{2})\b)\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b(19\d{2}|20\d{2})\b|Present|Current)/i);
      if (dateMatch) {
        secondStart = dateMatch[1];
        secondEnd = dateMatch[4] || dateMatch[3] || '';
      }

      const textWithoutDates = splitHeader.replace(dateMatch ? dateMatch[0] : '', '').replace(/^[•\-\*|(),\s]+|[|(),\s]+$/g, '').trim();
      const parts = textWithoutDates.split(/ at | \| | - /i);
      if (parts.length >= 2) {
        secondRole = parts[0].trim();
        secondCompany = parts[1].trim();
      } else if (textWithoutDates) {
        secondCompany = textWithoutDates;
      }

      result.push({
        ...exp,
        id: exp.id || `exp_${Date.now()}_${result.length}`,
        description: firstBullets.length > 0 ? firstBullets : [''],
      });

      result.push({
        id: `exp_${Date.now()}_${result.length + 1}`,
        role: secondRole,
        company: secondCompany,
        startDate: secondStart,
        endDate: secondEnd,
        location: '',
        description: remainingBullets.slice(1).length > 0 ? remainingBullets.slice(1) : [''],
      });
    } else {
      result.push({
        ...exp,
        id: exp.id || `exp_${Date.now()}_${result.length}`,
        description: bullets.length > 0 ? bullets : [''],
      });
    }
  }

  return result;
}

/**
 * Intelligent comparison and mapping engine.
 * Takes the raw parsed resume data and the target template ID, then:
 * 1. Guarantees every employment period / role is a distinct position card (no mashing).
 * 2. Checks target template capabilities:
 *    - If template supports Projects/Leadership natively, routes them to dedicated sections.
 *    - If template does NOT support those sections, maps them cleanly into Work Experience as distinct entries.
 * 3. Formats all bullets and ensures valid structure.
 */
export function mapResumeToTemplate(
  parsed: Partial<ResumeData> | null | undefined,
  targetTemplateId?: TemplateType
): ResumeData {
  if (!parsed || typeof parsed !== 'object') {
    return applyTemplateSectionDefaults(
      { ...INITIAL_DATA, template: undefined },
      targetTemplateId || INITIAL_DATA.template || 'free'
    );
  }

  const templateId = (targetTemplateId || parsed.template || 'free') as TemplateType;

  // 1. Base clean experiences. This only repairs entries that were mashed
  // together during parsing; it never moves a section into another section.
  const rawExperiences = Array.isArray(parsed.experience) ? parsed.experience : [];
  const distinctExperiences = separateMergedPositions(rawExperiences);

  // 2. Projects stay projects. A template is a layout, not a reason to disguise
  // project work as employment.
  const rawProjects = Array.isArray(parsed.projects) ? parsed.projects : [];
  const targetProjects: Project[] = rawProjects.map((p, idx) => ({
    id: p.id || `proj_${Date.now()}_${idx}`,
    name: p.name || 'Project',
    description: typeof p.description === 'string'
      ? p.description
      : Array.isArray(p.description)
      ? p.description.join('\n')
      : '',
    technologies: p.technologies || '',
    link: p.link || '',
    date: p.date || '',
  }));

  // 3. Leadership and Involvement are distinct sections. Never read one into
  // the other, and never fold either into Work Experience.
  const normalizeEntrySection = (items: Experience[] | undefined, prefix: string): Experience[] =>
    (Array.isArray(items) ? items : []).map((item, idx) => ({
      ...item,
      id: item.id || `${prefix}_${Date.now()}_${idx}`,
      description: Array.isArray(item.description)
        ? item.description
        : parseDescriptionBullets(item.description || ''),
    }));

  const targetLeadership = normalizeEntrySection(parsed.leadership, 'lead');
  const targetInvolvement = normalizeEntrySection(parsed.involvement, 'inv');

  // 4. Education and Certifications stay in their own sections. Credentials are
  // never rewritten as degrees.
  const distinctEducation: Education[] = Array.isArray(parsed.education) ? [...parsed.education] : [];
  const rawCertifications = Array.isArray(parsed.certifications) ? parsed.certifications : [];

  // Carry the document's current order into the snap: applyTemplateSectionDefaults
  // uses it to preserve every content-bearing section after the template defaults.
  const baseOrder = Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
    ? parsed.sectionOrder
    : createDefaultSectionOrder();

  // Explicit user visibility decisions survive an upload. Core sections are not
  // force-enabled: the target template's default composition decides what a
  // fresh document starts with, and the snap appends any imported content that
  // falls outside that composition.
  const finalVisibility: Record<string, boolean> = { ...(parsed.sectionVisibility || {}) };

  // Assemble the mapped resume data
  const mappedData: ResumeData = {
    ...INITIAL_DATA,
    ...parsed,
    template: templateId,
    fullName: (parsed.fullName || '').trim(),
    jobTitle: (parsed.jobTitle || '').trim(),
    email: (parsed.email || '').trim(),
    phone: (parsed.phone || '').trim(),
    location: (parsed.location || (parsed as any).address || '').trim(),
    linkedin: (parsed.linkedin || '').trim(),
    github: (parsed.github || '').trim(),
    portfolio: (parsed.portfolio || '').trim(),
    summary: (parsed.summary || '').trim(),
    skills: typeof parsed.skills === 'string'
      ? parsed.skills
      : Array.isArray(parsed.skills)
      ? (parsed.skills as string[]).join(', ')
      : '',
    experience: distinctExperiences,
    education: distinctEducation,
    certifications: rawCertifications,
    projects: targetProjects,
    leadership: targetLeadership,
    involvement: targetInvolvement,
    sectionVisibility: finalVisibility,
    sectionOrder: baseOrder,
    sectionTitles: { ...(parsed.sectionTitles || {}) },
    source: 'upload',
  };

  // 5. Snap the section structure to the target template's default sections
  // (what its gallery preview shows), then append every imported section that
  // has content. force:true makes an upload to the same template behave the
  // same way as a template switch.
  return formatAllResumeBullets(
    applyTemplateSectionDefaults(mappedData, templateId, { force: true })
  );
}
