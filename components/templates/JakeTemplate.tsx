import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import {
  formatDate,
  formatDateRange,
  parseDescriptionBullets,
  parseAchievementBullets,
  getSectionGapIn,
  getHeaderGapIn,
  getHeaderItemGapIn,
  getItemGapIn,
  getPagePaddingStyle,
  formatContactText,
  formatLinkedInDisplay,
  getLinkedInHref,
  formatGitHubDisplay,
  getGitHubHref,
  formatPortfolioDisplay,
  getPortfolioHref,
  formatNameDisplay,
  formatSectionTitle,
  normalizeUrl,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { parseSkillCategories } from '../../utils/skillCategorization';
import { resolveSection, getResolvedSectionOrder, isSectionHiddenByTemplateDefault } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

/**
 * Jake Template — a faithful clone of the source resume:
 * - Bold centered name in the template's serif face, with the plain contact
 *   line (phone | email | linkedin | handle) directly beneath it — links
 *   underlined, no banner/background behind the contact.
 * - Serif body throughout; section titles in small caps ("Education",
 *   "Technical Skills") with a full-width rule underneath.
 * - Sections arranged Education → Experience → Projects → Technical Skills,
 *   matching the source document. Professional Summary, Key Achievements,
 *   Certifications, Additional Information, Leadership and References are
 *   hidden by default — users can still add them explicitly (Add Section /
 *   visibility toggles), after which they render normally.
 * - No professional/role title line: the source resume's header is name +
 *   contact only, so data.jobTitle is never rendered on this template.
 * - Technical Skills always render as category rows: labeled input is kept
 *   as-is, and plain comma lists are bucketed into categories automatically.
 * - Section bodies indented slightly from the rule; bullets indented further.
 * - Education: bold school + right-aligned location on line 1, italic degree +
 *   right-aligned italic date on line 2.
 * - Experience: bold role + right-aligned date on line 1, italic company +
 *   italic location on line 2, disc bullets below.
 * - Projects: bold "Name | italic Technologies" with right-aligned date,
 *   disc bullets below.
 * - Technical Skills: bold "Label: value" rows.
 */
export default function JakeTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const bodyPt = fontSizes?.body || 10;

  const bodyStyle = {
    fontSize: `${bodyPt}pt`,
    lineHeight: data.lineHeight || 1.4,
  };

  /** Section bodies sit slightly in from the section rule in the source resume. */
  const ENTRY_INDENT: React.CSSProperties = { paddingLeft: '0.18in' };

  const renderSectionHeader = (title: string) => (
    <div className="section-header-wrap break-inside-avoid w-full mb-1.5">
      <h2
        className="section-header leading-normal m-0 p-0"
        style={{
          fontFamily: data.font || '"Times New Roman", Times, Georgia, serif',
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          fontWeight: 500,
          // The source resume renders section titles as small caps
          // ("Education" → EDUCATION with a full-size E) rather than the
          // legacy all-caps default — an explicit user casing setting wins.
          fontVariant: 'small-caps',
          color: accentColor,
          margin: 0,
          padding: 0,
          marginBottom: '2px',
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase || 'titlecase')}
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
        <p data-path={path} className="whitespace-pre-line text-gray-900" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  /**
   * Technical Skills rendered as category rows (bold "Label: value"). Labeled
   * input ("Languages: Java, …") is kept as-is; plain comma lists are bucketed
   * into categories automatically so skills always show in category form.
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
    const rawAchievements = Array.isArray(content) ? content : parseAchievementBullets(content || '');
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
   * Experience: bold role + right-aligned date range on line 1, italic company
   * + italic location right aligned on line 2, bullets below.
   */
  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={ENTRY_INDENT}>
          {items.map((exp, index) => {
            const dateRange = formatDateRange(exp.startDate, exp.endDate);
            const bullets = parseDescriptionBullets(exp.description);
            if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

            return (
              <div
                key={exp.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="flex justify-between items-baseline text-gray-900" style={bodyStyle}>
                  <div className="font-bold">
                    {exp.role && (
                      <span data-path={`${basePath}.${index}.role`}>
                        <RichText text={exp.role} />
                      </span>
                    )}
                  </div>
                  {dateRange && (
                    <span className="shrink-0 ml-4">
                      <RichText text={dateRange} />
                    </span>
                  )}
                </div>
                {(exp.company || exp.location) && (
                  <div className="flex justify-between items-baseline italic text-gray-800" style={bodyStyle}>
                    <div>
                      {exp.company && (
                        <span data-path={`${basePath}.${index}.company`}>
                          <RichText text={exp.company} />
                        </span>
                      )}
                    </div>
                    {exp.location && (
                      <span className="shrink-0 ml-4" data-path={`${basePath}.${index}.location`}>
                        <RichText text={exp.location} />
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-900" style={bodyStyle}>
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

  /**
   * Education: bold school + right-aligned location on line 1, italic degree +
   * right-aligned italic date on line 2.
   */
  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={ENTRY_INDENT}>
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year) return null;
            const rawYear = (edu.year || '').trim();
            // Keep plain years ("2021") exactly as typed; only format parseable dates.
            const displayYear = /^\d{4}$/.test(rawYear) ? rawYear : (formatDate(edu.year) || edu.year);
            return (
              <div
                key={edu.id || index}
                className="break-inside-avoid text-gray-900"
                style={{
                  ...bodyStyle,
                  marginBottom: index === items.length - 1 ? 0 : itemGap,
                }}
              >
                <div className="flex justify-between items-baseline leading-snug">
                  <div className="font-bold">
                    {edu.school && (
                      <span data-path={`${basePath}.${index}.school`}>
                        <RichText text={edu.school} />
                      </span>
                    )}
                  </div>
                  {edu.location && (
                    <span data-path={`${basePath}.${index}.location`} className="shrink-0 ml-4">
                      <RichText text={edu.location} />
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-baseline leading-snug">
                  <div className="italic">
                    {edu.degree && (
                      <span data-path={`${basePath}.${index}.degree`}>
                        <RichText text={edu.degree} />
                      </span>
                    )}
                    {edu.gpa && (
                      <span className="not-italic text-gray-700">
                        {' '}• GPA: <RichText text={edu.gpa} />
                      </span>
                    )}
                  </div>
                  {displayYear && (
                    <span data-path={`${basePath}.${index}.year`} className="italic shrink-0 ml-4">
                      <RichText text={displayYear} />
                    </span>
                  )}
                </div>
                {(() => {
                  const courseItems = (Array.isArray(edu.relevantCourses)
                    ? edu.relevantCourses
                    : typeof edu.relevantCourses === 'string'
                      ? edu.relevantCourses.split('\n')
                      : []
                  )
                    .map(c => c.replace(/^[•\-\*]\s*/, '').replace(/^(?:Relevant\s+Coursework|Relevant\s+Courses?):\s*/i, '').trim())
                    .filter(Boolean);

                  if (courseItems.length === 0) return null;

                  return (
                    <ul className="list-disc list-outside ml-5 mt-1">
                      {courseItems.map((item, i) => (
                        <li key={i} data-path={`${basePath}.${index}.relevantCourses.${i}`} className="mb-0.5">
                          <RichText text={item} />
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  /**
   * Projects: bold "Name | italic Technologies" row with the date right
   * aligned (project link as fallback), bullets below.
   */
  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={ENTRY_INDENT}>
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
                      href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 ml-4 font-normal italic underline"
                    >
                      Link
                    </a>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-900" style={bodyStyle}>
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

  const renderCertificationsBlock = (title: string, items: Certification[], basePath: string = 'certifications') => {
    if (!items || items.length === 0) return null;
    const validItems = items.filter((c) => c?.name?.trim() || c?.issuer?.trim() || c?.date?.trim());
    if (validItems.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((cert, index) => {
            const formattedDate = formatDate(cert.date) || cert.date;
            return (
              <div
                key={cert.id || index}
                className="flex justify-between items-baseline text-gray-900"
                style={{ marginBottom: index === validItems.length - 1 ? 0 : itemGap }}
              >
                <div>
                  <span data-path={`${basePath}.${index}.name`} className="font-bold">
                    <RichText text={cert.name ?? ''} />
                  </span>
                  {cert.issuer && (
                    <span className="italic">
                      {', '}
                      <span data-path={`${basePath}.${index}.issuer`}>
                        <RichText text={cert.issuer} />
                      </span>
                    </span>
                  )}
                </div>
                {formattedDate && (
                  <span data-path={`${basePath}.${index}.date`} className="shrink-0 ml-4">
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
    const itemGap = `${getItemGapIn(data)}in`;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((lang, index) => (
            <div
              key={lang.id || index}
              className="text-gray-900"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : itemGap }}
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
    const itemGap = `${getItemGapIn(data)}in`;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((item, index) => (
            <div
              key={item.id || index}
              className="text-gray-900"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : itemGap }}
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

    // Professional Summary, Key Achievements, Certifications, Additional
    // Information, Leadership and References are hidden by default on this
    // template (the source resume doesn't include them). Explicit opt-in via
    // sectionVisibility[id] = true — set by Add Section and visibility
    // toggles — renders them normally.
    if (isSectionHiddenByTemplateDefault('jake', resolved.id, data.sectionVisibility)) return null;

    let sectionTitle = resolved.title;
    if (resolved.type === 'summary') sectionTitle = t.professionalSummary || resolved.title;
    if (resolved.type === 'skills') sectionTitle = t.technicalSkills || resolved.title;
    if (resolved.type === 'experience') sectionTitle = t.experienceTitle || resolved.title;
    if (resolved.type === 'education') sectionTitle = t.educationTitle || resolved.title;
    if (resolved.type === 'certifications') sectionTitle = t.certifications || resolved.title;

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

  const getJakeSectionOrder = (): string[] => {
    return getResolvedSectionOrder(data);
  };

  // The header: centered name in the template's serif face, with the plain
  // contact line (phone | email | linkedin | handle) directly beneath it —
  // links underlined, no banner/background behind the contact.
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
      <a
        key="em"
        data-path="email"
        href={`mailto:${formatContactText(data.email)}`}
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
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
        <RichText text={formatLinkedInDisplay(data.linkedin)} />
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
        <RichText text={formatGitHubDisplay(data.github)} />
      </a>
    );
  }

  if (data.portfolio) {
    contactItems.push(
      <a
        key="portfolio"
        data-path="portfolio"
        href={getPortfolioHref(data.portfolio)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        <RichText text={formatPortfolioDisplay(data.portfolio)} />
      </a>
    );
  }

  if (data.atHandle) {
    // Linkify URL-like handles (github.com/jake) with the same underlined
    // treatment as the other links; plain text otherwise.
    contactItems.push(
      data.atHandle.includes('.') ? (
        <a
          key="at"
          data-path="atHandle"
          href={normalizeUrl(data.atHandle)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          <RichText text={data.atHandle} />
        </a>
      ) : (
        <span key="at" data-path="atHandle">
          <RichText text={data.atHandle} />
        </span>
      )
    );
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
        <h1
          data-path="fullName"
          className={`font-bold tracking-normal w-full ${alignmentClass}`}
          style={{
            // Name uses the template's own serif face (inherited from the
            // root style) — no separate sans-serif override.
            width: '100%',
            fontSize: `${fontSizes?.header || 20}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.15,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {/* Contact line: phone | email | linkedin | handle — plain text under
            the name, no banner/background; links underlined like the reference.
            (No job-title line: the source resume's header is name + contact.) */}
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
      {getJakeSectionOrder().map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
