import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import {
  parseDescriptionBullets,
  parseAchievementBullets,
  formatMonthYear as formatMonthYearUtil,
  getSectionGapIn,
  getHeaderGapIn,
  getHeaderItemGapIn,
  getHeaderContactGapIn,
  getItemGapIn,
  getMarginHorizontalIn,
  getMarginVerticalIn,
  formatContactText, formatLocationDisplay,
  formatLinkedInDisplay,
  getLinkedInHref,
  formatNameDisplay,
  formatJobTitleDisplay,
  formatSectionTitle,
  isTitleFirst,
  splitSkillsList,
  CONTACT_SEPARATOR,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Mail, Phone, Linkedin, Globe } from 'lucide-react';

const REZI_SLATE = '#2e3d50';
const REZI_INK = '#000000';

const W_BODY = 400;
const W_MEDIUM = 500;
const W_SEMIBOLD = 600;
const W_BOLD = 700;

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ReziTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const bodyPt = fontSizes?.body || 9;
  const sectionTitlePt = fontSizes?.sectionTitle || 11;
  const metaPt = bodyPt;
  const bodyLineHeight = data.lineHeight || 1.5;

  const headingColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : REZI_SLATE;

  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const t = getTranslation((data.language as Language) || 'en');

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-2 ${getSectionHeaderAlignment()}`}>
      <h2
        className={`section-header leading-normal ${getSectionHeaderAlignment()}`}
        style={{
          fontSize: `${sectionTitlePt}pt`,
          fontWeight: W_BOLD,
          color: headingColor,
          letterSpacing: '0.02em',
          marginBottom: '3px',
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: REZI_INK,
          marginTop: '3px',
          marginBottom: '4px',
        }}
      />
    </div>
  );

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="whitespace-pre-line text-justify" style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const skillsList = splitSkillsList(skillsStr);
    if (skillsList.length === 0) return null;
    const columnCount = data.skillsColumnCount === 2 ? 2 : data.skillsColumnCount === 4 ? 4 : 3;
    const getGridClass = (cols: number) => {
      if (cols === 2) return 'grid-cols-2';
      if (cols === 4) return 'grid-cols-4';
      return 'grid-cols-3';
    };
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <ul
          data-skills-grid
          className={`list-none pl-2.5 grid gap-x-8 gap-y-1 ${getGridClass(columnCount)}`}
          style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}
        >
          {skillsList.map((skill, i) => (
            <li key={i} data-skill-cell className="flex items-baseline gap-1.5 min-w-0">
              <span data-bullet aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none">•</span>
              <span className="flex-1" style={{ lineHeight: 'inherit' }}><RichText text={skill} /></span>
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
        <ul className="list-disc list-outside ml-5" style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
          {achievements.map((line, i) => (
            <li key={i} data-path={`${basePath}.${i}`} className="mb-0.5">
              <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
          {items.map((exp, index) => {
            const bullets = parseDescriptionBullets(exp.description);
            const dateRange = [formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' - ');
            if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

            return (
              <div key={exp.id} className="break-inside-avoid">
                {exp.role && (
                  <div data-path={`${basePath}.${index}.role`} style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>
                    <RichText text={exp.role ?? ''} />
                  </div>
                )}
                <div className="flex justify-between gap-2" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, lineHeight: 1.3 }}>
                  <span style={{ fontWeight: W_SEMIBOLD }}>
                    <span data-path={`${basePath}.${index}.company`}>
                      <RichText text={exp.company ?? ''} />
                    </span>
                  </span>
                  <span className="text-right shrink-0 ml-4" style={{ fontWeight: W_BODY }}>
                    {dateRange && <RichText text={dateRange} />}
                    {dateRange && exp.location && <span>{',  '}</span>}
                    {exp.location && (
                      <span data-path={`${basePath}.${index}.location`}>
                        <RichText text={exp.location} />
                      </span>
                    )}
                  </span>
                </div>
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
                    {bullets.map((line, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="mb-0.5">
                        <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
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

  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col" style={{ gap: `${Math.max(0.14, getSectionGapIn(data))}in` }}>
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year) return null;
            return (
              <div key={edu.id} className="break-inside-avoid">
                {edu.degree && (
                  <div data-path={`${basePath}.${index}.degree`} style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>
                    <RichText text={edu.degree ?? ''} />
                  </div>
                )}
                <div className="flex justify-between items-baseline" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: 1.3 }}>
                  <div>
                    {edu.school && (
                      <span data-path={`${basePath}.${index}.school`}>
                        <RichText text={edu.school} />
                      </span>
                    )}
                    {edu.gpa && (
                      <span className="ml-2">
                        • GPA: <RichText text={edu.gpa} />
                      </span>
                    )}
                  </div>
                  {edu.year && (
                    <span data-path={`${basePath}.${index}.year`} className="text-right whitespace-nowrap">
                      <RichText text={edu.year} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
          {items.map((project, index) => {
            const bullets = parseDescriptionBullets(project.description);
            if (!project.name && !project.technologies && bullets.length === 0) return null;

            return (
              <div key={project.id} className="break-inside-avoid">
                {project.name && (
                  <div style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>
                    <span data-path={`${basePath}.${index}.name`}>
                      <RichText text={project.name} />
                    </span>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 underline font-normal"
                        style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE }}
                      >
                        Link
                      </a>
                    )}
                  </div>
                )}
                {project.technologies && (
                  <div data-path={`${basePath}.${index}.technologies`} style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_MEDIUM, lineHeight: 1.3 }}>
                    <RichText text={project.technologies} />
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
                    {bullets.map((line, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="mb-0.5">
                        <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
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

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col gap-1">
          {validItems.map((cert, index) => (
            <div key={cert.id} className="flex justify-between gap-2" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}>
              <span>
                <span data-path={`${basePath}.${index}.name`} style={{ color: REZI_INK, fontWeight: W_BOLD }}>
                  <RichText text={cert.name ?? ''} />
                </span>
                {cert.issuer && (
                  <span>
                    {'  •  '}
                    <span data-path={`${basePath}.${index}.issuer`}>
                      <RichText text={cert.issuer} />
                    </span>
                  </span>
                )}
              </span>
              {cert.date && (
                <span data-path={`${basePath}.${index}.date`} className="text-right whitespace-nowrap">
                  <RichText text={cert.date} />
                </span>
              )}
            </div>
          ))}
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
        <div className="flex flex-col gap-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}>
          {validItems.map((lang, index) => (
            <div key={lang.id}>
              <span data-path={`${basePath}.${index}.language`} style={{ color: REZI_INK, fontWeight: W_SEMIBOLD }}>
                <RichText text={lang.language} />
              </span>
              {lang.proficiency && (
                <span className="ml-1 text-gray-600">
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
        <div className="flex flex-col gap-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}>
          {validItems.map((item, index) => (
            <div key={item.id}>
              <span data-path={`${basePath}.${index}.label`} style={{ color: REZI_INK, fontWeight: W_SEMIBOLD }}>
                <RichText text={item.label} />:
              </span>
              <span data-path={`${basePath}.${index}.value`} className="ml-1">
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
          bodyStyle: { fontSize: `${bodyPt}pt`, lineHeight: bodyLineHeight },
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
          bodyStyle: { fontSize: `${fontSizes?.body || 9}pt`, lineHeight: data.lineHeight || 1.5 },
        });
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  const headerAlignClass =
    data.headerAlignment === 'left' ? 'items-start text-left' :
    data.headerAlignment === 'right' ? 'items-end text-right' :
    'items-center text-center';

  const titleFirst = isTitleFirst(data, false);

  const jobTitleBlock = data.jobTitle ? (
    <p
      data-path="jobTitle"
      className={`tracking-wide ${
        data.jobTitleAlignment === 'left' ? 'text-left' :
        data.jobTitleAlignment === 'right' ? 'text-right' :
        data.jobTitleAlignment === 'center' ? 'text-center' :
        data.headerAlignment === 'left' ? 'text-left' :
        data.headerAlignment === 'right' ? 'text-right' :
        'text-center'
      }`}
      style={{
        fontSize: `${fontSizes?.jobTitle || 11}pt`,
        color: headingColor,
        fontWeight: W_SEMIBOLD,
        lineHeight: 1.25,
        marginBottom: titleFirst ? `${getHeaderContactGapIn(data)}in` : undefined,
      }}
    >
      <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
    </p>
  ) : null;

  const contactBlock = (() => {
    const showIcons = data.showContactIcons ?? true;
    const contactItems: React.ReactNode[] = [];

    if (data.location || data.address) {
      contactItems.push(
        <span key="loc" className="flex flex-row items-center gap-1">
          {showIcons && <MapPin size="0.9em" style={{ color: REZI_SLATE }} />}
          <span data-path="location"><RichText text={formatLocationDisplay(data.location || data.address || '')} /></span>
        </span>
      );
    }
    if (data.phone) {
      contactItems.push(
        <span key="phone" className="flex flex-row items-center gap-1">
          {showIcons && <Phone size="0.9em" style={{ color: REZI_SLATE }} />}
          <span data-path="phone"><RichText text={formatContactText(data.phone)} /></span>
        </span>
      );
    }
    if (data.email) {
      contactItems.push(
        <span key="email" className="flex flex-row items-center gap-1">
          {showIcons && <Mail size="0.9em" style={{ color: REZI_SLATE }} />}
          <a data-path="email" href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <RichText text={formatContactText(data.email)} />
          </a>
        </span>
      );
    }
    if (data.linkedin) {
      contactItems.push(
        <span key="linkedin" className="flex flex-row items-center gap-1">
          {showIcons && <Linkedin size="0.9em" style={{ color: REZI_SLATE }} />}
          <a
            data-path="linkedin"
            href={getLinkedInHref(data.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <RichText text={formatLinkedInDisplay(data.linkedin)} />
          </a>
        </span>
      );
    }
    if (data.atHandle) {
      contactItems.push(
        <span key="atHandle" className="flex flex-row items-center gap-1">
          {showIcons && <Globe size="0.9em" style={{ color: REZI_SLATE }} />}
          <span data-path="atHandle"><RichText text={data.atHandle} /></span>
        </span>
      );
    }

    if (contactItems.length === 0) return null;

    return (
      <div
        className={`flex flex-wrap items-center ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} ${
          data.contactAlignment === 'left'
            ? 'justify-start text-left'
            : data.contactAlignment === 'right'
            ? 'justify-end text-right'
            : data.contactAlignment === 'center'
            ? 'justify-center text-center'
            : data.headerAlignment === 'left'
            ? 'justify-start text-left'
            : data.headerAlignment === 'right'
            ? 'justify-end text-right'
            : 'justify-center text-center'
        }`}
        style={{
          fontSize: `${bodyPt}pt`,
          fontWeight: W_BODY,
          lineHeight: 1.4,
          color: REZI_SLATE,
          marginBottom: !titleFirst && data.jobTitle ? `${getHeaderContactGapIn(data)}in` : undefined,
        }}
      >
        {contactItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {item}
            {!showIcons && idx < contactItems.length - 1 && (
              <span className="mx-1 text-gray-400 select-none">{CONTACT_SEPARATOR}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  })();

  return (
    <div
      className="resume-content"
      style={{
        color: REZI_SLATE,
        lineHeight: data.lineHeight || 1.5,
        fontSize: `${bodyPt}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      {/* Header */}
      <header className="flex flex-col break-inside-avoid" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          data-path="fullName"
          className={
            data.headerAlignment === 'left' ? 'text-left' :
            data.headerAlignment === 'right' ? 'text-right' :
            'text-center'
          }
          style={{ fontSize: `${fontSizes?.header || 18}pt`, color: REZI_INK, fontFamily: 'Merriweather, serif', fontWeight: W_BOLD, lineHeight: 1.2, marginBottom: `${getHeaderItemGapIn(data)}in` }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {titleFirst ? (<>{jobTitleBlock}{contactBlock}</>) : (<>{contactBlock}{jobTitleBlock}</>)}
      </header>

      {/* Dynamic Sections */}
      {getResolvedSectionOrder(data).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}
