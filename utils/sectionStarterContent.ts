import type { ResumeData } from '../types';
import type { ResumeSectionType, SectionDefinition } from '../types/resumeSections';
import { SECTION_REGISTRY, hasSectionContent } from './sectionRegistry';

export type CustomStarterContentType = 'text' | 'bullets' | 'key_value';

/**
 * Starter content for custom sections so a freshly added section renders in
 * the preview immediately. Used by the editor's Add Section flow; the agent
 * page's add flow writes the same sample content inline. User content is
 * never overwritten: callers only apply this while empty.
 */
export function getCustomStarterContent(
  contentType: CustomStarterContentType
): string | string[] | Array<{ id: string; label: string; value: string }> {
  switch (contentType) {
    case 'bullets':
      return ['Key achievement or highlight in this custom section', 'Additional project milestone or accomplishment'];
    case 'key_value':
      return [{ id: Date.now().toString(), label: 'Item', value: 'Details' }];
    case 'text':
    default:
      return 'Add descriptive overview or notes for this section.';
  }
}

/**
 * Starter content per renderer kind for standard sections, so a section added
 * from the editor's Add Section modal shows up in the preview right away
 * instead of staying hidden until the user types into it. Values mirror the
 * agent page's long-standing add flow.
 */
export function getStarterContent(
  sectionType: ResumeSectionType,
  def: SectionDefinition
): unknown | undefined {
  switch (def.rendererKind) {
    case 'experience':
      return [
        {
          id: Date.now().toString(),
          role: `${def.defaultTitle} Lead / Member`,
          company: 'Organization / Institution',
          startDate: '2023',
          endDate: 'Present',
          description:
            '• Led key initiatives and collaborated with cross-functional partners\n• Achieved quantifiable results and streamlined operational workflow',
        },
      ];
    case 'projects':
      return [
        {
          id: Date.now().toString(),
          name: `${def.defaultTitle} Highlight`,
          technologies: 'React, TypeScript, Tailwind CSS',
          link: '',
          description:
            '• Designed and built high-impact features improving user engagement\n• Implemented automated workflows and delivered scalable architecture',
        },
      ];
    case 'certifications':
      return [
        {
          id: Date.now().toString(),
          name: `${def.defaultTitle} Credential`,
          issuer: 'Accrediting Organization',
          date: '2024',
        },
      ];
    case 'languages':
      return [
        { id: '1', language: 'English', proficiency: 'Native / Bilingual' },
        { id: '2', language: 'Spanish', proficiency: 'Professional Working' },
      ];
    case 'skills':
      return 'JavaScript, TypeScript, React, Node.js, Python, Git, Problem Solving, Team Leadership';
    case 'bullets':
      return '• Key milestone or contribution delivering measurable impact\n• Published research or presentation delivered to target audience';
    case 'key_value':
      return [
        { id: '1', label: 'Availability', value: 'Immediate' },
        { id: '2', label: 'Work Authorization', value: 'Authorized to work' },
      ];
    case 'coursework':
      return [
        {
          id: Date.now().toString(),
          courseName: 'Data Structures, Distributed Systems & Machine Learning',
          institution: '',
          year: '',
          skills: '',
          description: [''],
        },
      ];
    case 'text':
      if (sectionType === 'references') return 'Available upon request.';
      if (sectionType === 'interests')
        return 'Open source development, competitive chess, distance running, technology podcasts.';
      if (sectionType === 'thesis')
        return 'Optimizing Distributed Consensus in High-Throughput Edge Computing Architectures.';
      if (sectionType === 'security_clearance') return 'Active Top Secret / SCI Security Clearance.';
      return 'Accomplished professional with a track record of delivering impactful results and driving innovation.';
    default:
      return undefined;
  }
}

/**
 * Writes starter content into a resume for a section whose field is still
 * empty, so the section renders in the preview immediately after being added.
 * Returns the same object unchanged when the section already has real content
 * (user content is never replaced) or when no starter applies.
 */
export function applySectionStarterContent(
  data: ResumeData,
  sectionType: ResumeSectionType
): ResumeData {
  const def = SECTION_REGISTRY[sectionType];
  if (!def) return data;
  if (hasSectionContent(data, sectionType)) return data;

  const starter = getStarterContent(sectionType, def);
  if (starter === undefined) return data;

  const next: ResumeData = { ...data };
  (next as any)[def.dataField] = starter;
  return next;
}
