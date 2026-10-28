import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import {
  formatDate,
  parseDescriptionBullets,
  getSectionGapIn,
  getHeaderGapIn,
  getHeaderItemGapIn,
  getItemGapIn,
  getPagePaddingStyle,
  formatContactText,
  formatNameDisplay,
  formatSectionTitle,
  normalizeUrl,
  getLinkedInHref,
  getGitHubHref,
  getPortfolioHref,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { parseSkillCategories } from '../../utils/skillCategorization';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

/**
 * Analyst Template — a faithful clone of the source Data Analyst resume:
 * - Bold centered name in ALL CAPS (serif) with a plain pipe-separated contact
 *   line beneath it: phone | email | LinkedIn | GitHub — the LinkedIn and
 *   GitHub items render as underlined label links.
 * - Serif body throughout; section headers left-aligned exactly as authored
 *   ("PROFESSIONAL SUMMARY", "CORE SKILLS", …, "Certification") with a
 *   full-width rule underneath. An explicit user casing setting is honored;
 *   otherwise the title is rendered as typed.
 * - Sections arranged Summary → Core Skills → Professional Experience →
 *   Education → Certification, matching the source document. Key Achievements,
 *   Leadership, top-level Projects, Additional Information and References are
 *   hidden by default (users can still add them explicitly).
 * - No professional/role title line: the source header is name + contact only.
 * - Core Skills always render as bold "Label: value" rows.
 * - Experience: bold "Role — Company" with bold "MM/YYYY – MM/YYYY | Location"
 *   right-aligned on the same line, bullets below; entries may carry nested
 *   "Key Projects :-" sub-blocks: italic "Name | Technologies" with an
 *   underlined LINK on the right, bullets below.
 * - Education: bold program — institution on the left, "| CGPA: …" style
 *   detail right-aligned (leading pipe), one compact line per entry.
 * - Certification: bold name — issuer, right-aligned "| date | status".
 */
export default function AnalystTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const bodyPt = fontSizes?.body || 10;

  const bodyStyle = {
    fontSize: `${bodyPt}pt`,
    lineHeight: data.lineHeight || 1.4,
  };
  const compactItemGap = `${Math.max(0.04, Math.min(0.06, getSectionGapIn(data) * 0.35))}in`;

  /**
   * MM/YYYY from the stored month value ("2025-08" → "08/2025"), passing
   * through anything else (e.g. "Present") unchanged — the source resume
   * uses slash-formatted months.
   */
  const formatSlashMonth = (value?: string | null): string => {
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      const [year, month] = trimmed.split('-');
      return `${month}/${year}`;
    }
    return trimmed;
  };

  const formatExperienceRange = (startDate?: string | null, endDate?: string | null): string => {
    const start = formatSlashMonth(startDate);
    const end = formatSlashMonth(endDate);
    if (start && end) return `${start} – ${end}`;
    if (start) return start;
    if (end) return end;
    return '';
  };

  /**
   * Section titles render exactly as authored (the source mixes ALL CAPS
   * headers with a Title Case "Certification"); an explicit user casing
   * setting still wins.
   */
  const displaySectionTitle = (title: string) =>
    data.sectionHeaderCase ? formatSectionTitle(title, data.sectionHeaderCase) : title;

  const renderSectionHeader = (title: string) => (
    <div className="section-header-wrap break-inside-avoid w-full mb-1.5">
      <h2
        className="section-header leading-normal"
        style={{
          fontFamily: data.font || '"Times New Roman", Times, Georgia, serif',
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          fontWeight: 700,
          color: accentColor,
          marginBottom: '2px',
        }}
      >
        {displaySectionTitle(title)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: accentColor,
          marginTop: '2px',
        }}
      />
    </div>
  );

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <p
          data-path={path}
          className="whitespace-pre-line text-gray-900"
          style={{ ...bodyStyle, textAlign: 'justify' }}
        >
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  /**
   * Core Skills rendered as bold "Label: value" rows. Labeled input is kept
   * as-is; plain comma lists are bucketed into categories automatically.
   */
  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const items = parseSkillCategories(skillsStr);
    if (items.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <ul data-path="skills" className="list-disc list-outside ml-5 space-y-0.5 text-gray-900" style={bodyStyle}>
          {items.map((item, index) => (
            <li key={item.id || index} className="leading-snug">
              {item.category ? (
                <>
                  <span className="font-bold">
                    <RichText text={item.category.trim()} />:
                  </span>{' '}
                  <span>
                    <RichText text={item.skills ?? ''} />
                  </span>
                </>
              ) : (
                <span>
                  <RichText text={item.skills ?? ''} />
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderBulletsBlock = (title: string, content: string[] | string, basePath: string = 'keyAchievements') => {
    const rawAchievements = Array.isArray(content) ? content : parseDescriptionBullets(content || '');
    const achievements = rawAchievements.map((line) => (typeof line === 'string' ? line : ''));
    if (achievements.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <ul className="list-disc list-outside ml-5 space-y-0.5 text-gray-900" style={bodyStyle}>
          {achievements.map((line, i) => (
            <li key={i} data-path={`${basePath}.${i}`}>
              <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  /**
   * Nested "Key Projects :-" block inside an experience entry: italic
   * "Name | Technologies" with an underlined LINK right-aligned, bullets
   * below — exactly the source document's sub-structure.
   */
  const renderNestedProjects = (projects: Project[], basePath: string) => {
    const valid = projects.filter((p) => p?.name?.trim() || p?.technologies?.trim() || (p?.description || '').toString().trim());
    if (valid.length === 0) return null;
    const itemGap = `${getItemGapIn(data, 0.08)}in`;
    return (
      <div className="mt-1">
        <div className="font-bold italic underline text-gray-900" style={{ ...bodyStyle, marginBottom: '2px' }}>
          Key Projects :-
        </div>
        {valid.map((project, index) => {
          const bullets = parseDescriptionBullets(project.description);
          return (
            <div
              key={project.id || index}
              className="break-inside-avoid"
              style={{ marginBottom: index === valid.length - 1 ? 0 : itemGap }}
            >
              <div className="flex justify-between items-baseline text-gray-900" style={bodyStyle}>
                <div className="italic">
                  <span data-path={`${basePath}.${index}.name`} className="font-bold">
                    <RichText text={project.name} />
                  </span>
                  {project.technologies && (
                    <span className="font-normal italic">
                      {' | '}
                      <span data-path={`${basePath}.${index}.technologies`}>
                        <RichText text={project.technologies} />
                      </span>
                    </span>
                  )}
                </div>
                {project.link && (
                  <a
                    href={normalizeUrl(project.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 ml-4 underline"
                    style={{ color: '#1155CC' }}
                  >
                    LINK
                  </a>
                )}
              </div>
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5 text-gray-900" style={bodyStyle}>
                  {bullets.map((bullet, i) => (
                    <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                      <RichText text={bullet ? bullet.replace(/^[•-]\s*/, '') : ''} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Experience: bold "Role — Company" with bold "range | location" right on
   * the same line, bullets below, then any nested Key Projects.
   */
  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((exp, index) => {
            const dateRange = formatExperienceRange(exp.startDate, exp.endDate);
            const rawBullets = parseDescriptionBullets(exp.description);
            let nestedProjects = Array.isArray(exp.projects) ? exp.projects : [];
            let bullets = rawBullets;

            // If exp.projects is not explicitly populated, check if the user
            // typed/pasted a "Key Projects :-" header into the description bullets.
            if (nestedProjects.length === 0) {
              const keyProjIndex = rawBullets.findIndex((b) =>
                /^\s*Key\s+Projects\s*(?::-|:)?\s*$/i.test(b.trim())
              );
              if (keyProjIndex !== -1) {
                bullets = rawBullets.slice(0, keyProjIndex);
                const afterLines = rawBullets.slice(keyProjIndex + 1);
                const extractedProjects: Project[] = [];
                let currentProj: Project | null = null;
                let projBullets: string[] = [];

                for (const line of afterLines) {
                  const trimmed = line.trim();
                  const isBullet = /^[•\-\*▪▫·]\s*/.test(trimmed);
                  if (!isBullet && trimmed) {
                    if (currentProj) {
                      currentProj.description = projBullets.join('\n');
                      extractedProjects.push(currentProj);
                      projBullets = [];
                    }
                    const pipeIdx = trimmed.indexOf('|');
                    if (pipeIdx !== -1) {
                      currentProj = {
                        id: `p-${extractedProjects.length}`,
                        name: trimmed.slice(0, pipeIdx).trim(),
                        technologies: trimmed.slice(pipeIdx + 1).replace(/\s+LINK\s*$/i, '').trim(),
                        link: /\bLINK\b/i.test(trimmed) ? '#' : '',
                        description: '',
                      };
                    } else {
                      currentProj = {
                        id: `p-${extractedProjects.length}`,
                        name: trimmed,
                        description: '',
                      };
                    }
                  } else if (trimmed) {
                    projBullets.push(trimmed.replace(/^[•\-\*▪▫·]\s*/, ''));
                  }
                }
                if (currentProj) {
                  currentProj.description = projBullets.join('\n');
                  extractedProjects.push(currentProj);
                }
                nestedProjects = extractedProjects;
              }
            }

            if (!exp.role && !exp.company && !dateRange && bullets.length === 0 && nestedProjects.length === 0) return null;

            const rightLine = [dateRange, exp.location].filter(Boolean).join(' | ');

            return (
              <div
                key={exp.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="flex justify-between items-baseline font-bold text-gray-900" style={bodyStyle}>
                  <div>
                    {exp.role && (
                      <span data-path={`${basePath}.${index}.role`}>
                        <RichText text={exp.role} />
                      </span>
                    )}
                    {exp.company && (
                      <>
                        {', '}
                        <span data-path={`${basePath}.${index}.company`}>
                          <RichText text={exp.company} />
                        </span>
                      </>
                    )}
                  </div>
                  {rightLine && (
                    <span className="shrink-0 ml-4">
                      <RichText text={rightLine} />
                    </span>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5 text-gray-900" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                        <RichText text={bullet ? bullet.replace(/^[•-]\s*/, '') : ''} />
                      </li>
                    ))}
                  </ul>
                )}
                {nestedProjects.length > 0 &&
                  renderNestedProjects(nestedProjects, `${basePath}.${index}.projects`)}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  /**
   * Education: bold program — institution on the left, right column
   * "| CGPA: …" (leading pipe) — one compact line per entry, like the source.
   */
  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year && !edu.gpa) return null;
            const rightParts = [(edu.year || '').trim(), (edu.gpa || '').trim()].filter(Boolean);
            const courseItems = (Array.isArray(edu.relevantCourses)
              ? edu.relevantCourses
              : typeof edu.relevantCourses === 'string'
                ? edu.relevantCourses.split('\n')
                : []
            )
              .map(c => c.replace(/^[•\-\*]\s*/, '').replace(/^(?:Relevant\s+Coursework|Relevant\s+Courses?):\s*/i, '').trim())
              .filter(Boolean);
            const hasDetails = courseItems.length > 0;

            return (
              <div
                key={edu.id || index}
                className="break-inside-avoid flex justify-between items-baseline text-gray-900"
                style={{ ...bodyStyle, marginBottom: index === items.length - 1 ? 0 : (hasDetails ? '0.08in' : compactItemGap) }}
              >
                <div>
                  {edu.degree && (
                    <span className="font-bold" data-path={`${basePath}.${index}.degree`}>
                      <RichText text={edu.degree} />
                    </span>
                  )}
                  {edu.school && (
                    <>
                      {', '}
                      <span data-path={`${basePath}.${index}.school`}>
                        <RichText text={edu.school} />
                      </span>
                    </>
                  )}
                </div>
                {rightParts.length > 0 && (
                  <span className="shrink-0 ml-4" data-path={`${basePath}.${index}.year`}>
                    {'| '}
                    <RichText text={rightParts.join(' | ')} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderCertificationsBlock = (title: string, items: Certification[], basePath: string = 'certifications') => {
    if (!items || items.length === 0) return null;
    const validItems = items.filter((c) => c?.name?.trim() || c?.issuer?.trim() || c?.date?.trim());
    if (validItems.length === 0) return null;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((cert, index) => {
            // Free-text dates (e.g. "2026 | In Progress") pass through; real
            // dates are formatted for display.
            const formattedDate = formatDate(cert.date) || cert.date;
            return (
              <div
                key={cert.id || index}
                className="flex justify-between items-baseline text-gray-900"
                style={{ marginBottom: index === validItems.length - 1 ? 0 : compactItemGap }}
              >
                <div>
                  <span data-path={`${basePath}.${index}.name`} className="font-bold">
                    <RichText text={cert.name ?? ''} />
                  </span>
                  {cert.issuer && (
                    <span>
                      {', '}
                      <span data-path={`${basePath}.${index}.issuer`}>
                        <RichText text={cert.issuer} />
                      </span>
                    </span>
                  )}
                </div>
                {formattedDate && (
                  <span data-path={`${basePath}.${index}.date`} className="shrink-0 ml-4">
                    {'| '}
                    <RichText text={formattedDate} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderLanguagesBlock = (title: string, items: LanguageItem[], basePath: string = 'languages') => {
    if (!items || items.length === 0) return null;
    const validItems = items.filter((l) => l?.language?.trim());
    if (validItems.length === 0) return null;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((lang, index) => (
            <div
              key={lang.id || index}
              className="text-gray-900"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : compactItemGap }}
            >
              <span data-path={`${basePath}.${index}.language`} className="font-bold">
                <RichText text={lang.language} />
              </span>
              {lang.proficiency && (
                <span className="italic ml-2">
                  (<span data-path={`${basePath}.${index}.proficiency`}><RichText text={lang.proficiency} /></span>)
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderKeyValueBlock = (title: string, items: AdditionalInfoItem[], basePath: string = 'additionalInfo') => {
    const validItems = (items || []).filter((item) => item?.label?.trim() && item?.value?.trim());
    if (validItems.length === 0) return null;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((item, index) => (
            <div
              key={item.id || index}
              className="text-gray-900"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : compactItemGap }}
            >
              <span data-path={`${basePath}.${index}.label`} className="font-bold">
                <RichText text={item.label} />:
              </span>
              <span data-path={`${basePath}.${index}.value`} className="ml-2">
                <RichText text={item.value} />
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((project, index) => {
            const bullets = parseDescriptionBullets(project.description);
            if (!project.name && !project.technologies && bullets.length === 0) return null;

            return (
              <div
                key={project.id || index}
                className="break-inside-avoid text-gray-900"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="flex justify-between items-baseline" style={bodyStyle}>
                  <div className="font-bold">
                    <span data-path={`${basePath}.${index}.name`}>
                      <RichText text={project.name} />
                    </span>
                    {project.technologies && (
                      <span className="font-normal italic">
                        {' | '}
                        <span data-path={`${basePath}.${index}.technologies`}>
                          <RichText text={project.technologies} />
                        </span>
                      </span>
                    )}
                  </div>
                  {project.date && (
                    <span data-path={`${basePath}.${index}.date`} className="shrink-0 ml-4">
                      <RichText text={project.date} />
                    </span>
                  )}
                  {!project.date && project.link && (
                    <a
                      href={normalizeUrl(project.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 ml-4 font-normal italic underline"
                    >
                      LINK
                    </a>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5 text-gray-900" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                        <RichText text={bullet ? bullet.replace(/^[•-]\s*/, '') : ''} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderCustomBlock = (title: string, custom: CustomSectionData, id: string) => {
    if (!custom) return null;
    const basePath = `customSections.${id}`;
    if (custom.contentType === 'text') {
      return renderTextBlock(title, custom.content as string, `${basePath}.content`);
    }
    if (custom.contentType === 'bullets') {
      return renderBulletsBlock(title, custom.content as string[] | string, `${basePath}.content`);
    }
    if (custom.contentType === 'key_value') {
      return renderKeyValueBlock(title, custom.content as AdditionalInfoItem[], `${basePath}.content`);
    }
    return null;
  };

  const renderSection = (id: string) => {
    const resolved = resolveSection(data, id);
    if (!resolved || !resolved.visible || !resolved.hasContent) return null;

    // An explicit sectionTitles override (resolved.title) wins; otherwise
    // fall back to the translated label for well-known sections.
    const hasCustomTitle = Boolean(data.sectionTitles?.[resolved.id] || data.sectionTitles?.[resolved.type]);
    let sectionTitle = resolved.title;
    if (!hasCustomTitle) {
      if (resolved.type === 'summary') sectionTitle = t.professionalSummary || resolved.title;
      if (resolved.type === 'certifications') sectionTitle = t.certifications || resolved.title;
    }

    switch (resolved.rendererKind) {
      case 'text':
        return renderTextBlock(sectionTitle, resolved.content as string, resolved.id);
      case 'skills':
        return renderSkillsBlock(sectionTitle, resolved.content as string);
      case 'expert_skills':
        return renderExpertSkillsBlockHelper({
          data,
          title: sectionTitle,
          items: resolved.content as any,
          basePath: resolved.id,
          renderSectionHeader,
          bodyStyle: { fontSize: `${fontSizes?.body || 10}pt`, lineHeight: data.lineHeight || 1.4 },
        });
      case 'bullets':
        return renderBulletsBlock(sectionTitle, resolved.content as string[] | string, resolved.id);
      case 'experience':
        return renderExperienceBlock(sectionTitle, resolved.content as Experience[], resolved.id);
      case 'education':
        return renderEducationBlock(sectionTitle, resolved.content as Education[], resolved.id);
      case 'projects':
        return renderProjectsBlock(sectionTitle, resolved.content as Project[], resolved.id);
      case 'certifications':
        return renderCertificationsBlock(sectionTitle, resolved.content as Certification[], resolved.id);
      case 'languages':
        return renderLanguagesBlock(sectionTitle, resolved.content as LanguageItem[], resolved.id);
      case 'key_value':
        return renderKeyValueBlock(sectionTitle, resolved.content as AdditionalInfoItem[], resolved.id);
      case 'coursework':
        return renderCourseworkBlockHelper({
          data,
          title: sectionTitle,
          items: resolved.content as CourseworkItem[] | string,
          basePath: resolved.id,
          renderSectionHeader,
          renderTextBlock,
          bodyStyle: { fontSize: `${fontSizes?.body || 10}pt`, lineHeight: data.lineHeight || 1.4 },
        });
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  const getAnalystSectionOrder = (): string[] => {
    return getResolvedSectionOrder(data);
  };

  // The header: centered ALL CAPS serif name with the plain contact line
  // (phone | email | LinkedIn | GitHub) directly beneath it — LinkedIn and
  // GitHub render as underlined label links, matching the source document.
  const contactItems: React.ReactNode[] = [];

  if (data.phone) {
    contactItems.push(
      <span key="ph" data-path="phone">
        <RichText text={formatContactText(data.phone)} />
      </span>
    );
  }

  if (data.email) {
    contactItems.push(
      <a key="em" data-path="email" href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <RichText text={formatContactText(data.email)} />
      </a>
    );
  }

  if (data.linkedin) {
    contactItems.push(
      <a
        key="li"
        data-path="linkedin"
        href={getLinkedInHref(data.linkedin)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        LinkedIn
      </a>
    );
  }

  if (data.github) {
    contactItems.push(
      <a
        key="gh"
        data-path="github"
        href={getGitHubHref(data.github)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        GitHub
      </a>
    );
  }

  if (data.portfolio) {
    contactItems.push(
      <a
        key="port"
        data-path="portfolio"
        href={getPortfolioHref(data.portfolio)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        Portfolio
      </a>
    );
  }

  if (data.atHandle) {
    const isDuplicateGithub =
      data.github &&
      (data.atHandle.trim().toLowerCase() === data.github.trim().toLowerCase() ||
        data.atHandle.toLowerCase().replace(/^https?:\/\/(www\.)?github\.com\/?/i, '').replace(/\/$/, '') ===
          data.github.toLowerCase().replace(/^https?:\/\/(www\.)?github\.com\/?/i, '').replace(/\/$/, ''));

    if (!isDuplicateGithub) {
      contactItems.push(
        <a
          key="at"
          data-path="atHandle"
          href={normalizeUrl(data.atHandle)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          {data.github ? data.atHandle : 'GitHub'}
        </a>
      );
    }
  }

  const alignmentClass =
    data.headerAlignment === 'left'
      ? 'text-left'
      : data.headerAlignment === 'right'
        ? 'text-right'
        : 'text-center';

  return (
    <div
      className="resume-content text-gray-900 w-full box-border"
      style={{
        ...getPagePaddingStyle(data),
        fontFamily: data.font || '"Times New Roman", Times, Georgia, serif',
        lineHeight: data.lineHeight || 1.4,
        fontSize: `${bodyPt}pt`,
      }}
    >
      {/* Header */}
      <header className="break-inside-avoid w-full" style={{ marginBottom: `${getHeaderGapIn(data)}in`, width: '100%' }}>
        <div data-resume-name
          data-path="fullName"
          className={`font-bold tracking-normal w-full ${alignmentClass}`}
          style={{
            width: '100%',
            fontFamily: data.font || '"Times New Roman", Times, Georgia, serif',
            fontSize: `${fontSizes?.header || 22}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.15,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase || 'uppercase')} />
        </div>

        {/* Contact line: phone | email | LinkedIn | GitHub — plain text under
            the name; LinkedIn and GitHub underlined label links. (No job-title
            line: the source header is name + contact.) */}
        {contactItems.length > 0 && (
          <div
            className={`flex flex-wrap items-center w-full mx-auto text-gray-900 ${
              alignmentClass === 'text-left'
                ? 'justify-start text-left'
                : alignmentClass === 'text-right'
                  ? 'justify-end text-right'
                  : 'justify-center text-center'
            }`}
            style={{
              ...bodyStyle,
              width: '100%',
            }}
          >
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-1.5 select-none">|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Sections in the source resume's arrangement */}
      {getAnalystSectionOrder().map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
