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
  formatLocationDisplay,
  getLinkedInHref,
  getGitHubHref,
  getPortfolioHref,
  formatNameDisplay,
  formatSectionTitle,
  normalizeUrl,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { parseSkillCategories } from '../../utils/skillCategorization';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

/**
 * Scholar Template — an academic CV clone built on the app's own font:
 * - Bold centered name with a gap-separated contact line beneath it (location,
 *   email, phone, LinkedIn, GitHub) — LinkedIn/GitHub/Portfolio render as
 *   accent-colored LABEL links (href opens the profile directly), no
 *   banner/background behind the contact. No job-title line.
 * - Serif body throughout (the app font, data.font → Merriweather fallback);
 *   uppercase section titles with a full-width rule underneath.
 * - Sections arranged Education → Skills → Projects → Experience →
 *   Certifications. Professional Summary, Key Achievements, Leadership,
 *   Additional Information and References are hidden by default — users can
 *   still add them explicitly (Add Section / visibility toggles), after which
 *   they render normally.
 * - Education: bold school + right location on line 1, italic degree +
 *   right-aligned italic date on line 2.
 * - Skills: plain bold "Category: value" rows (no bullets).
 * - Projects: bold name + right-aligned italic date on line 1, italic
 *   technologies on line 2, disc bullets below.
 * - Experience: bold company + right location on line 1, italic role +
 *   right-aligned italic date on line 2, disc bullets below.
 * - Certifications: bold issuer + ": " + name.
 */
export default function ScholarTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const bodyPt = fontSizes?.body || 9.5;

  const bodyStyle = {
    fontSize: `${bodyPt}pt`,
    lineHeight: data.lineHeight || 1.4,
  };
  const compactItemGap = `${Math.max(0.04, Math.min(0.06, getSectionGapIn(data) * 0.35))}in`;

  const renderSectionHeader = (title: string) => (
    <div className="section-header-wrap break-inside-avoid w-full mb-1.5">
      <h2
        className="section-header leading-normal m-0 p-0"
        style={{
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          fontWeight: 700,
          color: accentColor,
          margin: 0,
          padding: 0,
          marginBottom: '2px',
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase || 'uppercase')}
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
   * Skills rendered as plain bold "Label: value" rows — no bullets. Labeled
   * input ("Languages: Java, …") is kept as-is; a plain comma list is bucketed
   * into categories automatically so skills always show in category form.
   */
  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const items = parseSkillCategories(skillsStr);
    if (items.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div data-path="skills" style={bodyStyle}>
          {items.map((item, index) => (
            <p key={item.id || index} className="text-gray-900 leading-snug m-0">
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
            </p>
          ))}
        </div>
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
   * Experience: bold company + right-aligned location on line 1, italic role +
   * right-aligned italic date range on line 2, disc bullets below.
   */
  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
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
              {(exp.role || dateRange) && (
                <div className="flex justify-between items-baseline italic text-gray-800" style={bodyStyle}>
                  <div>
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
      </section>
    );
  };

  /**
   * Education: bold school + right-aligned location on line 1, italic degree +
   * right-aligned italic date on line 2.
   */
  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          if (!edu.school && !edu.degree && !edu.year) return null;
          const rawYear = (edu.year || '').trim();
          // Keep plain years ("2021") exactly as typed; only format parseable dates.
          const displayYear = /^\d{4}$/.test(rawYear) ? rawYear : (formatDate(edu.year) || edu.year);
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
              className="break-inside-avoid text-gray-900"
              style={{
                ...bodyStyle,
                marginBottom: index === items.length - 1 ? 0 : (hasDetails ? '0.08in' : compactItemGap),
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
            </div>
          );
        })}
      </section>
    );
  };

  /**
   * Projects: bold name with the right-aligned italic date on line 1, italic
   * technologies on line 2, disc bullets below.
   */
  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
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
                </div>
                {(project.date || (!project.date && project.link)) && (
                  <span data-path={`${basePath}.${index}.date`} className="italic shrink-0 ml-4">
                    {project.date ? (
                      <RichText text={project.date} />
                    ) : (
                      <a
                        href={project.link!.startsWith('http') ? project.link! : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-normal italic"
                        style={{ color: accentColor }}
                      >
                        Link
                      </a>
                    )}
                  </span>
                )}
              </div>
              {project.technologies && (
                <div className="italic text-gray-800" style={bodyStyle}>
                  <span data-path={`${basePath}.${index}.technologies`}>
                    <RichText text={project.technologies} />
                  </span>
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
      </section>
    );
  };

  /**
   * Certifications: bold issuer + ": " + name (matches the reference's
   * "Hugging Face: The LLM Course …" online-courses row).
   */
  const renderCertificationsBlock = (title: string, items: Certification[], basePath: string = 'certifications') => {
    if (!items || items.length === 0) return null;
    const validItems = items.filter((c) => c?.name?.trim() || c?.issuer?.trim() || c?.date?.trim());
    if (validItems.length === 0) return null;

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
                style={{ marginBottom: index === validItems.length - 1 ? 0 : compactItemGap }}
              >
                <div>
                  {cert.issuer && (
                    <span data-path={`${basePath}.${index}.issuer`} className="font-bold">
                      <RichText text={cert.issuer} />
                      {': '}
                    </span>
                  )}
                  <span data-path={`${basePath}.${index}.name`}>
                    <RichText text={cert.name ?? ''} />
                  </span>
                </div>
                {formattedDate && (
                  <span data-path={`${basePath}.${index}.date`} className="italic shrink-0 ml-4">
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

    // Explicit sectionTitles[] overrides (e.g. the reference's "Certifications
    // & Online Courses") win; only fall back to the translated defaults when
    // the document didn't set a custom title.
    const explicitTitle =
      data.sectionTitles?.[resolved.id]?.trim() || data.sectionTitles?.[resolved.type]?.trim();
    let sectionTitle = resolved.title;
    if (!explicitTitle) {
      if (resolved.type === 'summary') sectionTitle = t.professionalSummary || resolved.title;
      // English keeps the registry default "Skills" (the reference's title) —
      // only non-English locales swap in the translated "Technical Skills".
      if (resolved.type === 'skills' && data.language && data.language !== 'en') {
        sectionTitle = t.technicalSkills || resolved.title;
      }
      if (resolved.type === 'experience') sectionTitle = t.experienceTitle || resolved.title;
      if (resolved.type === 'education') sectionTitle = t.educationTitle || resolved.title;
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

  const getScholarSectionOrder = (): string[] => {
    return getResolvedSectionOrder(data);
  };

  // The header: centered bold name in the app font, with the gap-separated
  // contact line (location · email · phone · linkedin · github) directly beneath
  // it — links tinted with the accent color, no banner/background.
  const contactItems: React.ReactNode[] = [];

  if (data.location) {
    contactItems.push(
      <span key="loc" data-path="location">
        <RichText text={formatLocationDisplay(data.location)} />
      </span>
    );
  }

  if (data.email) {
    contactItems.push(
      <a
        key="em"
        data-path="email"
        href={`mailto:${formatContactText(data.email)}`}
        style={{ color: accentColor, textDecoration: 'none' }}
      >
        <RichText text={formatContactText(data.email)} />
      </a>
    );
  }

  if (data.phone) {
    contactItems.push(
      <span key="ph" data-path="phone">
        <RichText text={formatContactText(data.phone)} />
      </span>
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
        style={{ color: accentColor, textDecoration: 'underline' }}
      >
        {/* Label instead of the whole URL — the href still opens the profile */}
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
        style={{ color: accentColor, textDecoration: 'underline' }}
      >
        GitHub
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
        style={{ color: accentColor, textDecoration: 'underline' }}
      >
        Portfolio
      </a>
    );
  }

  if (data.atHandle) {
    // Skip an at-handle that just repeats the GitHub profile — the "GitHub"
    // label link above already points at it (same rule as AnalystTemplate).
    const atRaw = data.atHandle.trim().toLowerCase();
    const stripGh = (v: string) =>
      v.toLowerCase().replace(/^https?:\/\/(www\.)?github\.com\/?/i, '').replace(/\/$/, '');
    const isDuplicateGithub =
      !!data.github &&
      (atRaw === data.github.trim().toLowerCase() || stripGh(atRaw) === stripGh(data.github));

    if (!isDuplicateGithub) {
      // Linkify URL-like handles (github.com/robinks13) with the same accent
      // tint as the other links; plain text otherwise.
      contactItems.push(
        data.atHandle.includes('.') ? (
          <a
            key="at"
            data-path="atHandle"
            href={normalizeUrl(data.atHandle)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accentColor, textDecoration: 'none' }}
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
        // The app font (data.font → Merriweather fallback), not a hardcoded face.
        fontFamily: data.font || 'Merriweather, serif',
        ...getPagePaddingStyle(data),
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
            fontSize: `${fontSizes?.header || 20}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.15,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </div>

        {/* Contact line: location · email · phone · LinkedIn · GitHub — plain
            text under the name, no banner/background; LinkedIn/GitHub/Portfolio
            render as accent-colored LABEL links whose href opens the profile
            directly in a new tab. (No job-title line: the header is name +
            contact.) */}
        {contactItems.length > 0 && (
          <div
            className={`flex flex-wrap items-center w-full mx-auto gap-x-4 gap-y-1 text-gray-900 ${
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
              <React.Fragment key={idx}>{item}</React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Sections in the academic CV's arrangement */}
      {getScholarSectionOrder().map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
