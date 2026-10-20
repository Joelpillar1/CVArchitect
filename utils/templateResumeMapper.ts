import { ResumeData, Experience, Project, Education, Certification, LanguageItem, TemplateType, INITIAL_DATA } from '../types';
import { TEMPLATE_HIDDEN_SECTION_TYPES, normalizeSectionType, createDefaultSectionOrder } from './sectionRegistry';
import { applyTemplateSectionDefaults } from './templateSectionDefaults';
import { parseDescriptionBullets, formatAllResumeBullets } from './templateUtils';

/**
 * Checks whether a given template natively supports / displays a section.
 */
export function templateSupportsSection(templateId: TemplateType | string | undefined, sectionKey: string): boolean {
  if (!templateId || !sectionKey) return true;
  const canonical = normalizeSectionType(sectionKey) || sectionKey;
  
  // Specific known template layout capabilities
  if (templateId === 'free') {
    // CareerCraft natively shows Education, Experience, Involvement, Leadership, Skills
    // It suppresses summary, achievements, references, and does not have dedicated projects by default
    if (['summary', 'achievements', 'references', 'projects'].includes(canonical)) {
      return false;
    }
    return true;
  }

  const hiddenList = TEMPLATE_HIDDEN_SECTION_TYPES[templateId];
  if (hiddenList && hiddenList.includes(canonical)) {
    return false;
  }

  return true;
}

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
  const supportsProjects = templateSupportsSection(templateId, 'projects');
  const supportsLeadership = templateSupportsSection(templateId, 'leadership');
  const supportsInvolvement = templateSupportsSection(templateId, 'involvement');

  // 1. Base clean experiences
  const rawExperiences = Array.isArray(parsed.experience) ? parsed.experience : [];
  let distinctExperiences = separateMergedPositions(rawExperiences);

  // 2. Handle Projects placement
  const rawProjects = Array.isArray(parsed.projects) ? parsed.projects : [];
  let targetProjects: Project[] = [];

  if (rawProjects.length > 0) {
    if (supportsProjects) {
      // Template natively supports Projects section
      targetProjects = rawProjects.map((p, idx) => ({
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
    } else {
      // Template does NOT have a dedicated Projects section:
      // Map each project cleanly into Work Experience as a distinct position card
      const mappedProjectExperiences: Experience[] = rawProjects.map((p, idx) => {
        const bullets = Array.isArray(p.description)
          ? p.description
          : typeof p.description === 'string' && p.description.trim()
          ? parseDescriptionBullets(p.description)
          : [''];

        const companyLabel = p.technologies
          ? `Project (${p.technologies})`
          : 'Independent / Technical Project';

        return {
          id: `proj_exp_${Date.now()}_${idx}`,
          role: p.name || 'Key Project',
          company: companyLabel,
          location: '',
          startDate: p.date || '',
          endDate: '',
          description: bullets.length > 0 ? bullets : [''],
        };
      });

      distinctExperiences = [...distinctExperiences, ...mappedProjectExperiences];
    }
  }

  // 3. Handle Leadership / Involvement placement
  const rawLeadership = Array.isArray(parsed.leadership)
    ? parsed.leadership
    : Array.isArray((parsed as any).involvement)
    ? (parsed as any).involvement
    : [];

  let targetLeadership: Experience[] = [];
  let targetInvolvement: Experience[] = [];

  if (rawLeadership.length > 0) {
    if (supportsInvolvement) {
      // Target template (e.g. CareerCraft) uses Involvement
      targetInvolvement = rawLeadership.map((item, idx) => ({
        ...item,
        id: item.id || `inv_${Date.now()}_${idx}`,
        description: Array.isArray(item.description)
          ? item.description
          : parseDescriptionBullets(item.description || ''),
      }));
    } else if (supportsLeadership) {
      // Target template uses Leadership
      targetLeadership = rawLeadership.map((item, idx) => ({
        ...item,
        id: item.id || `lead_${Date.now()}_${idx}`,
        description: Array.isArray(item.description)
          ? item.description
          : parseDescriptionBullets(item.description || ''),
      }));
    } else {
      // Neither is natively shown by this template:
      // Map each leadership role cleanly into Work Experience as a distinct position card
      const mappedLeadershipExperiences: Experience[] = rawLeadership.map((item, idx) => ({
        id: `lead_exp_${Date.now()}_${idx}`,
        role: item.role || 'Leadership Role',
        company: item.company || item.organization || 'Organization / Community',
        location: item.location || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        description: Array.isArray(item.description)
          ? item.description
          : parseDescriptionBullets(item.description || ''),
      }));

      distinctExperiences = [...distinctExperiences, ...mappedLeadershipExperiences];
    }
  }

  // 4. Handle certifications: if template does not support dedicated certifications section (e.g. Modern / Finance),
  // map certifications cleanly into Education entries so credentials (CFA, CPA, Series 7) are preserved
  let distinctEducation: Education[] = Array.isArray(parsed.education) ? [...parsed.education] : [];
  const rawCertifications = Array.isArray(parsed.certifications) ? parsed.certifications : [];
  if (templateId === 'modern') {
    if (rawCertifications.length > 0) {
      const mappedCertificationsAsEdu: Education[] = rawCertifications.map((c, idx) => ({
        id: c.id || `cert_edu_${Date.now()}_${idx}`,
        school: c.issuer || 'Credential / Institute',
        degree: c.name || 'Professional Certification',
        year: c.date || '',
        location: '',
      }));
      distinctEducation = [...distinctEducation, ...mappedCertificationsAsEdu];
    }
    // (The Finance strict 4-section layout — order + visibility — is applied
    // after the section-defaults snap below.)
  }

  // Carry the document's current order into the snap: applyTemplateSectionDefaults
  // uses it only to keep user-added sections in their previous relative order.
  const baseOrder = Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
    ? parsed.sectionOrder
    : createDefaultSectionOrder();

  // Core sections are opted in unless the user explicitly hid them (an explicit
  // false persists — the eye toggle is a user decision).
  const parsedVisibility = parsed.sectionVisibility || {};
  const finalVisibility: Record<string, boolean> = { ...parsedVisibility };
  for (const core of ['summary', 'experience', 'education', 'skills'] as const) {
    if (!(core in parsedVisibility)) finalVisibility[core] = true;
  }

  if (targetProjects.length > 0 && supportsProjects) {
    finalVisibility.projects = true;
  }
  if (targetInvolvement.length > 0 && supportsInvolvement) {
    finalVisibility.involvement = true;
  }
  if (targetLeadership.length > 0 && supportsLeadership) {
    finalVisibility.leadership = true;
  }

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
    certifications: templateId === 'modern' ? [] : rawCertifications,
    projects: targetProjects,
    leadership: targetLeadership,
    involvement: targetInvolvement,
    sectionVisibility: finalVisibility,
    sectionOrder: baseOrder,
    sectionTitles: { ...(parsed.sectionTitles || {}) },
    source: 'upload',
  };

  // 5. Snap the section structure to the target template's default sections
  // (what its gallery preview shows), keeping user-added + custom sections.
  // The carrier keeps `parsed.template` so a genuine template switch always
  // snaps, while re-running the mapper for an already-mapped document (same
  // template) is a no-op for section structure.
  let result = applyTemplateSectionDefaults(
    { ...mappedData, template: parsed.template } as ResumeData,
    templateId
  );

  // Finance: force the strict 4-section layout (Summary -> Experience ->
  // Education -> Skills) that its gallery preview promises.
  if (templateId === 'modern') {
    result = {
      ...result,
      sectionOrder: ['summary', 'experience', 'education', 'skills'],
      sectionVisibility: {
        ...result.sectionVisibility,
        projects: false,
        certifications: false,
        leadership: false,
        achievements: false,
        additionalInfo: false,
        references: false,
      },
    };
  }

  return formatAllResumeBullets(result);
}
