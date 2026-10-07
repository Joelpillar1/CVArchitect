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
  getMarginHorizontalIn,
  getMarginVerticalIn,
  formatContactText, formatLocationDisplay,
  formatLinkedInDisplay,
  getLinkedInHref,
  formatNameDisplay,
  formatJobTitleDisplay,
  formatSectionTitle,
  getItemGapIn,
  splitSkillsList,
  CONTACT_SEPARATOR,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

/**
 * Regent — a centered serif ATS template cloned from a reference layout:
 *
 *   Name (centered, bold serif)
 *   phone • email • location • LinkedIn          (centered, no icons)
 *   ═══════════════ thick rule (3px) ═══════════════
 *   Job Title (centered, bold — no underline)
 *   justified summary
 *   ──────────────── section separator (1px)
 *   SECTION HEADING (centered, bold) + underline (1px)
 *   content …                                    + separator (1px)
 *
 * Geometry comes from measuring the reference screenshot (A4): content
 * margins ≈0.40in, section padding 0.09in top / 0.21in bottom, heading
 * underline gap 0.09in, heading→content 0.24in. All of it still defers to the
 * user's design settings (font, sizes, line height, margins, alignment,
 * accent color, section order) so the export matches the editor exactly.
 */
export default function RegentTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const bodyPt = fontSizes?.body || 9.5;
  const bodyStyle = {
    fontSize: `${bodyPt}pt`,
    lineHeight: data.lineHeight || 1.45,
  };

  // Horizontal padding: honor an explicit user margin, otherwise this
  // template's own design margin (≈0.40in, measured from the reference).
  const hPadIn = data.margins?.horizontal !== undefined ? getMarginHorizontalIn(data) : 0.4;
  const vPadIn = getMarginVerticalIn(data);

  const SECTION_PAD_TOP = '0.09in';
  const SECTION_PAD_BOTTOM = '0.21in';
  const HEADING_PAD_BOTTOM = '0.09in';
  const HEADING_MARGIN_BOTTOM = '0.24in';
  const ENTRY_GAP = `${getItemGapIn(data, 0.24)}in`;
  // Header→contact and contact→rule gaps: honor explicit user settings, else
  // this template's measured design values.
  const NAME_TO_CONTACT = `${getHeaderItemGapIn(data)}in`;
  const CONTACT_TO_RULE = `${data.headerGap !== undefined ? getHeaderGapIn(data) : 0.23}in`;
  const BULLET_TOP = '0.04in';

  const getSectionHeaderAlignment = () => {
    // Native default for this template is centered; user settings still win.
    const align = data.sectionHeaderAlignment || data.bodyHeaderAlignment;
    if (align === 'left') return 'text-left';
    if (align === 'right') return 'text-right';
    return 'text-center';
  };

  const getTextAlignment = () => {
    if (data.headerAlignment === 'left') return 'text-left';
    if (data.headerAlignment === 'right') return 'text-right';
    return 'text-center';
  };

  /** Centered heading with the reference's 1px underline. */
  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header font-bold leading-normal"
        style={{
          width: '100%',
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          color: accentColor,
          paddingBottom: HEADING_PAD_BOTTOM,
          marginBottom: HEADING_MARGIN_BOTTOM,
          // The reference's 1px underline. NOTE: only the border — the heading
          // must never inherit a background fill (an earlier version spread the
          // hairline rule's backgroundColor here and painted a solid block).
          borderBottom: `1px solid ${accentColor}`,
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
    </div>
  );

  const sectionStyle: React.CSSProperties = {
    paddingTop: SECTION_PAD_TOP,
    paddingBottom: SECTION_PAD_BOTTOM,
    borderBottom: `1px solid ${accentColor}`,
    marginBottom: `${getSectionGapIn(data)}in`,
  };

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-justify whitespace-pre-line text-gray-900" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  /**
   * Label/value rows (the reference's "Core Competencies": **Languages** Java…).
   * Accepts newline-separated `Label: value` lines; a plain comma list falls
   * back to an inline list.
   */
  const renderLabelValueRows = (labelValue: { label: string; value: string }[], keyOf: (i: number) => string) => {
    if (labelValue.length === 0) return null;
    const hasLabels = labelValue.some((r) => r.label);
    if (!hasLabels) {
      return (
        <p className="text-gray-900" style={bodyStyle}>
          {labelValue.map((row, i) => (
            <React.Fragment key={keyOf(i)}>
              {i > 0 && ', '}
              <RichText text={row.value} />
            </React.Fragment>
          ))}
        </p>
      );
    }
    return (
      <div className="text-gray-900" style={{ ...bodyStyle, display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: '1.1em', rowGap: '2px' }}>
        {labelValue.map((row, i) => (
          <React.Fragment key={keyOf(i)}>
            <span className="font-bold" style={{ whiteSpace: 'nowrap' }}>
              <RichText text={row.label} />
            </span>
            <span>
              <RichText text={row.value} />
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const parseLabelValueLines = (content: string): { label: string; value: string }[] => {
    const lines = (content || '').split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    return lines.map((line) => {
      const m = line.match(/^(.+?)\s*[:\-–—]\s*(.+)$/);
      if (m) return { label: m[1].trim(), value: m[2].trim() };
      return { label: '', value: line };
    });
  };

  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    // Newline-separated `Label: value` → the reference's two-column rows.
    if (skillsStr.includes('\n')) {
      const rows = parseLabelValueLines(skillsStr);
      if (rows.length > 0) {
        return (
          <section style={sectionStyle}>
            {renderSectionHeader(title)}
            {renderLabelValueRows(rows, (i) => `skills-row-${i}`)}
          </section>
        );
      }
    }
    const skillsList = splitSkillsList(skillsStr);
    if (skillsList.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        <p className="text-gray-900" style={bodyStyle} data-skills-grid>
          {skillsList.map((skill, i) => (
            <React.Fragment key={i}>
              {i > 0 && ', '}
              <span data-skill-cell><RichText text={skill} /></span>
            </React.Fragment>
          ))}
        </p>
      </section>
    );
  };

  const renderBulletsBlock = (title: string, content: string[] | string, basePath: string = 'keyAchievements') => {
    const rawAchievements = Array.isArray(content) ? content : parseAchievementBullets(content || '');
    const achievements = rawAchievements.map((line) => (typeof line === 'string' ? line : ''));
    if (achievements.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-900" style={bodyStyle}>
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
   * Experience: company (bold) + dates (bold, right-aligned) on one line,
   * role (bold) on the next, then bullets — the reference's exact structure.
   */
  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        {items.map((exp, index) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate);
          const bullets = parseDescriptionBullets(exp.description);
          if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

          return (
            <div
              key={exp.id || index}
              className="break-inside-avoid text-gray-900"
              style={{ marginBottom: index === items.length - 1 ? 0 : ENTRY_GAP }}
            >
              <div className="flex justify-between items-baseline gap-4" style={bodyStyle}>
                <span className="font-bold" data-path={`${basePath}.${index}.company`}>
                  <RichText text={exp.company || exp.role || ''} />
                </span>
                {dateRange && (
                  <span className="font-bold shrink-0" data-path={`${basePath}.${index}.dates`}>
                    <RichText text={dateRange} />
                  </span>
                )}
              </div>
              {exp.role && exp.company && (
                <div className="font-bold" style={bodyStyle} data-path={`${basePath}.${index}.role`}>
                  <RichText text={exp.role} />
                </div>
              )}
              {exp.location && (
                <div className="text-gray-700" style={bodyStyle} data-path={`${basePath}.${index}.location`}>
                  <RichText text={exp.location} />
                </div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-0.5 text-gray-900" style={{ ...bodyStyle, marginTop: BULLET_TOP }}>
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
      </section>
    );
  };

  /** Education: **School**, Degree, Dates on one line, then coursework bullets. */
  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          if (!edu.school && !edu.degree && !edu.year) return null;
          const formattedYear = formatDate(edu.year) || edu.year;
          const courses = (edu.relevantCourses || '').trim();
          return (
            <div
              key={edu.id || index}
              className="break-inside-avoid text-gray-900"
              style={{ ...bodyStyle, marginBottom: index === items.length - 1 ? 0 : ENTRY_GAP }}
            >
              <div>
                {edu.school && (
                  <span className="font-bold" data-path={`${basePath}.${index}.school`}>
                    <RichText text={edu.school} />
                  </span>
                )}
                {edu.degree && (
                  <span>
                    {edu.school ? ', ' : ''}
                    <span data-path={`${basePath}.${index}.degree`}><RichText text={edu.degree} /></span>
                  </span>
                )}
                {formattedYear && (
                  <span data-path={`${basePath}.${index}.year`}>
                    {', '}
                    <RichText text={formattedYear} />
                  </span>
                )}
                {edu.gpa && (
                  <span className="text-gray-700"> • GPA: <RichText text={edu.gpa} /></span>
                )}
              </div>
              {courses && (
                <ul className="list-disc list-outside ml-5 space-y-0.5" style={{ marginTop: BULLET_TOP }}>
                  <li data-path={`${basePath}.${index}.relevantCourses`}>
                    <span className="italic">Relevant coursework:</span> <RichText text={courses} />
                  </li>
                </ul>
              )}
            </div>
          );
        })}
      </section>
    );
  };

  /**
   * Projects: bold lead (the first comma-delimited segment, so
   * "Google, Automated Deployment Pipeline" renders exactly like the
   * reference) with dates right-aligned, then bullets.
   */
  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        {items.map((project, index) => {
          const bullets = parseDescriptionBullets(project.description);
          if (!project.name && bullets.length === 0) return null;
          const withDates = project as Project & { startDate?: string; endDate?: string };
          const dateRange = formatDateRange(withDates.startDate, withDates.endDate);
          const commaAt = (project.name || '').indexOf(',');
          const lead = commaAt > 0 ? project.name.slice(0, commaAt).trim() : (project.name || '');
          const rest = commaAt > 0 ? project.name.slice(commaAt + 1).trim() : '';

          return (
            <div
              key={project.id || index}
              className="break-inside-avoid text-gray-900"
              style={{ marginBottom: index === items.length - 1 ? 0 : ENTRY_GAP }}
            >
              <div className="flex justify-between items-baseline gap-4" style={bodyStyle}>
                <div>
                  <span className="font-bold" data-path={`${basePath}.${index}.name`}>
                    <RichText text={lead} />
                  </span>
                  {rest && (
                    <span>
                      {', '}
                      <span data-path={`${basePath}.${index}.name`}><RichText text={rest} /></span>
                    </span>
                  )}
                  {project.link && (
                    <a
                      href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 italic underline"
                    >
                      Link
                    </a>
                  )}
                </div>
                {dateRange && <span className="font-bold shrink-0"><RichText text={dateRange} /></span>}
              </div>
              {project.technologies && (
                <div data-path={`${basePath}.${index}.technologies`} className="italic text-gray-700" style={bodyStyle}>
                  <RichText text={project.technologies} />
                </div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-0.5" style={{ ...bodyStyle, marginTop: BULLET_TOP }}>
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
      </section>
    );
  };

  const renderCertificationsBlock = (title: string, items: Certification[], basePath: string = 'certifications') => {
    if (!items || items.length === 0) return null;
    const validItems = items.filter((c) => c?.name?.trim() || c?.issuer?.trim() || c?.date?.trim());
    if (validItems.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={sectionStyle}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((cert, index) => {
            const formattedDate = formatDate(cert.date) || cert.date;
            return (
              <div
                key={cert.id || index}
                className="flex justify-between items-baseline text-gray-900 gap-4"
                style={{ marginBottom: index === validItems.length - 1 ? 0 : ENTRY_GAP }}
              >
                <div>
                  <span className="font-bold" data-path={`${basePath}.${index}.name`}>
                    <RichText text={cert.name ?? ''} />
                  </span>
                  {cert.issuer && (
                    <span>
                      {', '}
                      <span data-path={`${basePath}.${index}.issuer`}><RichText text={cert.issuer} /></span>
                    </span>
                  )}
                </div>
                {formattedDate && (
                  <span className="shrink-0" data-path={`${basePath}.${index}.date`}>
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
      <section className="break-inside-avoid" style={sectionStyle}>
        {renderSectionHeader(title)}
        <div style={bodyStyle}>
          {validItems.map((lang, index) => (
            <div
              key={lang.id || index}
              className="text-gray-900"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : ENTRY_GAP }}
            >
              <span className="font-bold" data-path={`${basePath}.${index}.language`}>
                <RichText text={lang.language} />
              </span>
              {lang.proficiency && (
                <span className="ml-2">(<span data-path={`${basePath}.${index}.proficiency`}><RichText text={lang.proficiency} /></span>)</span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  /** Reference's Core Competencies rows: **Label**  value. */
  const renderKeyValueBlock = (title: string, items: AdditionalInfoItem[], basePath: string = 'additionalInfo') => {
    const validItems = (items || []).filter((item) => item?.label?.trim() && item?.value?.trim());
    if (validItems.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={sectionStyle}>
        {renderSectionHeader(title)}
        {renderLabelValueRows(
          validItems.map((item) => ({ label: item.label, value: item.value })),
          (i) => `kv-${validItems[i].id || i}`
        )}
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
          items: resolved.content as never,
          basePath: resolved.id,
          renderSectionHeader,
          bodyStyle,
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
          bodyStyle,
        });
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  // The reference renders the job title as the heading above the summary, so
  // `summary` is handled in the header block instead of the section loop.
  const summaryResolved = resolveSection(data, 'summary');
  const showSummary = Boolean(summaryResolved && summaryResolved.visible && summaryResolved.hasContent);
  const showTitleBlock = Boolean(data.jobTitle) || showSummary;

  return (
    <div
      className="resume-content text-gray-900 w-full box-border"
      style={{
        paddingLeft: `${hPadIn}in`,
        paddingRight: `${hPadIn}in`,
        paddingTop: `${vPadIn}in`,
        paddingBottom: `${vPadIn}in`,
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        lineHeight: data.lineHeight || 1.45,
        fontSize: `${bodyPt}pt`,
      }}
    >
      {/* ── Header: name, contact line, thick rule ── */}
      <header className="break-inside-avoid" style={{ marginBottom: CONTACT_TO_RULE }}>
        <h1
          data-path="fullName"
          className={`font-bold tracking-normal ${getTextAlignment()}`}
          style={{
            fontSize: `${fontSizes?.header || 16}pt`,
            marginBottom: NAME_TO_CONTACT,
            lineHeight: 1.15,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {(() => {
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
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <RichText text={formatContactText(data.email)} />
              </a>
            );
          }
          if (data.location || data.address) {
            contactItems.push(
              <span key="loc" data-path="location">
                <RichText text={formatLocationDisplay(data.location || data.address || '')} />
              </span>
            );
          }
          if (data.linkedin) {
            // Left unstyled on purpose: the reference shows the profile link in
            // the browser's link color while everything else stays black.
            contactItems.push(
              <a key="li" data-path="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer">
                <RichText text={formatLinkedInDisplay(data.linkedin)} />
              </a>
            );
          }
          if (data.atHandle) {
            contactItems.push(
              <span key="at" data-path="atHandle">
                <RichText text={data.atHandle} />
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-gray-800 ${getTextAlignment()} ${
                data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center'
              }`}
              style={bodyStyle}
            >
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item}
                  {idx < contactItems.length - 1 && (
                    <span className="mx-1 select-none" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {CONTACT_SEPARATOR}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </header>

      {/* ── Thick rule (measured 3px at A4 scale) ── */}
      <div className="break-inside-avoid" style={{ width: '100%', height: '3px', backgroundColor: accentColor }} />

      {/* ── Job title heading (no underline) + justified summary ── */}
      {showTitleBlock && (
        <section
          className="break-inside-avoid"
          style={{ marginTop: '0.18in', paddingBottom: SECTION_PAD_BOTTOM, borderBottom: `1px solid ${accentColor}` }}
        >
          {data.jobTitle ? (
            <h2
              data-path="jobTitle"
              className={`font-bold leading-normal ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                color: accentColor,
                marginBottom: '0.19in',
              }}
            >
              <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
            </h2>
          ) : (
            renderSectionHeader(t.professionalSummary || summaryResolved?.title || 'Professional Summary')
          )}
          {showSummary && (
            <p data-path="summary" className="text-justify whitespace-pre-line text-gray-900" style={bodyStyle}>
              <RichText text={(summaryResolved?.content as string) ?? ''} />
            </p>
          )}
        </section>
      )}

      {/* ── Dynamic sections (summary handled above) ── */}
      {getResolvedSectionOrder(data)
        .filter((id) => id !== 'summary' && id !== 'contact')
        .map((id) => (
          <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
        ))}
    </div>
  );
}
