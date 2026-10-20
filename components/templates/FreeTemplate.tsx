import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Phone, Mail, Linkedin, Send, Github, Globe } from 'lucide-react';
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
  formatContactText,
  formatLocationDisplay,
  formatLinkedInDisplay,
  getLinkedInHref,
  formatGitHubDisplay,
  getGitHubHref,
  formatPortfolioDisplay,
  getPortfolioHref,
  formatNameDisplay,
  formatJobTitleDisplay,
  formatSectionTitle,
  isTitleFirst,
  parseExpertSkillItems,
  CONTACT_SEPARATOR,
  renderCourseworkBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder, isSectionExplicitlyAdded } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

export default function FreeTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
  };

  const bodySize = fontSizes?.body || 8.5;
  const bodyStyle: React.CSSProperties = {
    fontSize: `${bodySize}pt`,
    lineHeight: data.lineHeight || 1.32,
  };

  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-1.5 ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header font-bold uppercase tracking-wider text-gray-900 m-0 p-0"
        style={{
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          color: accentColor,
          margin: 0,
          padding: 0,
          marginBottom: '2px',
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase || 'uppercase')}
      </h2>
      <div
        className="section-divider w-full h-[1.5px]"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-gray-800 text-justify whitespace-pre-line leading-snug" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  // Bullet list using standard list-disc matching the application bullet system
  const renderDotBullets = (bullets: string[], basePath: string) => {
    if (bullets.length === 0) return null;
    return (
      <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800 text-justify" style={bodyStyle}>
        {bullets.map((bullet, i) => (
          <li key={i} data-path={`${basePath}.${i}`}>
            <RichText text={bullet ? bullet.replace(/^([•·-]\s*)+/, '') : ''} />
          </li>
        ))}
      </ul>
    );
  };

  const renderSkillsBlock = (title: string, items: any, basePath: string = 'skills') => {
    const parsed = parseExpertSkillItems(items);
    if (parsed.length === 0) return null;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1 text-gray-800" style={bodyStyle}>
          {parsed.map((item, index) => {
            const hasCategory = Boolean(item.category?.trim());
            const catText = item.category?.trim() || '';
            const catClean = catText.endsWith(':') ? catText : `${catText}:`;
            return (
              <p key={item.id || index} className="leading-snug m-0">
                {hasCategory ? (
                  <>
                    <span data-path={`${basePath}.${index}.category`} className="font-normal text-gray-900">
                      <RichText text={catClean} />
                      {' '}
                    </span>
                    <span data-path={`${basePath}.${index}.skills`} className="text-gray-800">
                      <RichText text={item.skills ?? ''} />
                    </span>
                  </>
                ) : (
                  <span data-path={`${basePath}.${index}.skills`} className="text-gray-800">
                    <RichText text={item.skills ?? ''} />
                  </span>
                )}
              </p>
            );
          })}
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
        {renderDotBullets(achievements, basePath)}
      </section>
    );
  };

  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    const sectionGapIn = getSectionGapIn(data);
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year) return null;
            const details = [edu.school, edu.location, edu.year].filter(Boolean);
            const bullets = parseDescriptionBullets(edu.description);
            return (
              <div
                key={edu.id || index}
                className="break-inside-avoid leading-snug"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {edu.degree && (
                  <h3 className="font-bold text-gray-900 leading-snug" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.degree`}>
                      <RichText text={edu.degree} />
                    </span>
                  </h3>
                )}
                {details.length > 0 && (
                  <div className="text-gray-800 leading-snug" style={bodyStyle}>
                    {details.map((part, pIdx) => (
                      <React.Fragment key={pIdx}>
                        {pIdx > 0 && <span className="mx-2 text-gray-500 font-normal">•</span>}
                        <span
                          data-path={
                            pIdx === 0 && edu.school
                              ? `${basePath}.${index}.school`
                              : pIdx === 1 && edu.location
                              ? `${basePath}.${index}.location`
                              : `${basePath}.${index}.year`
                          }
                        >
                          <RichText text={part} />
                        </span>
                      </React.Fragment>
                    ))}
                    {edu.gpa && (
                      <span className="ml-2 text-gray-600">
                        (GPA: <span data-path={`${basePath}.${index}.gpa`}><RichText text={edu.gpa} /></span>)
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <div style={{ marginTop: '0.02in' }}>
                    {renderDotBullets(bullets, `${basePath}.${index}.description`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    const sectionGapIn = getSectionGapIn(data);
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((exp, index) => {
            const dateRange = [formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' – ');
            const bullets = parseDescriptionBullets(exp.description);
            if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

            return (
              <div
                key={exp.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {/* Line 1: Role (bold) */}
                {exp.role && (
                  <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.role`}>
                      <RichText text={exp.role} />
                    </span>
                  </h3>
                )}
                {/* Line 2: Company (left) | Dates + Location (right) */}
                {(exp.company || dateRange || exp.location) && (
                  <div className="flex justify-between items-baseline leading-snug mb-0.5 gap-3" style={bodyStyle}>
                    <span className="text-gray-800 min-w-0" data-path={`${basePath}.${index}.company`}>
                      <RichText text={exp.company ?? ''} />
                    </span>
                    {(dateRange || exp.location) && (
                      <span className="text-gray-800 shrink-0 font-normal text-right">
                        {dateRange && <RichText text={dateRange} />}
                        {exp.location && (
                          <span data-path={`${basePath}.${index}.location`}>
                            {dateRange ? ', ' : ''}
                            <RichText text={exp.location} />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <div style={{ marginTop: '0.02in' }}>
                    {renderDotBullets(bullets, `${basePath}.${index}.description`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderLeadershipBlock = (title: string, items: Experience[], basePath: string = 'involvement') => {
    if (!items || items.length === 0) return null;
    const sectionGapIn = getSectionGapIn(data);
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((lead, index) => {
            const dateRange = [formatMonthYear(lead.startDate), formatMonthYear(lead.endDate)].filter(Boolean).join(' – ');
            // Involvement line 2: School/Org • Club/Company • Dates
            const schoolOrg = lead.location || lead.organization || '';
            const clubName = lead.company || '';
            const bullets = parseDescriptionBullets(lead.description);
            if (!lead.role && !schoolOrg && !clubName && !dateRange && bullets.length === 0) return null;

            const metaParts = [schoolOrg, clubName, dateRange].filter(
              (part, idx, arr) => part && arr.indexOf(part) === idx
            );

            return (
              <div
                key={lead.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {/* Line 1: Role (bold) */}
                {lead.role && (
                  <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.role`}>
                      <RichText text={lead.role} />
                    </span>
                  </h3>
                )}
                {/* Line 2: School/Org • Club/Company • Dates */}
                {metaParts.length > 0 && (
                  <div className="text-gray-800 leading-snug mb-0.5" style={bodyStyle}>
                    {metaParts.map((part, mIdx) => (
                      <React.Fragment key={mIdx}>
                        {mIdx > 0 && <span className="mx-2 text-gray-500 font-normal">•</span>}
                        {part === schoolOrg ? (
                          <span data-path={`${basePath}.${index}.location`}>
                            <RichText text={part} />
                          </span>
                        ) : part === clubName ? (
                          <span data-path={`${basePath}.${index}.company`}>
                            <RichText text={part} />
                          </span>
                        ) : (
                          <RichText text={part} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {bullets.length > 0 && (
                  <div style={{ marginTop: '0.02in' }}>
                    {renderDotBullets(bullets, `${basePath}.${index}.description`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
    const sectionGapIn = getSectionGapIn(data);
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((project, index) => {
            const bullets = parseDescriptionBullets(project.description);
            if (!project.name && !project.technologies && bullets.length === 0) return null;

            return (
              <div
                key={project.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="font-bold text-gray-900 leading-snug" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.name`}>
                      <RichText text={project.name} />
                    </span>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 font-normal italic text-gray-600 hover:underline"
                      >
                        Link
                      </a>
                    )}
                  </div>
                  {project.date && (
                    <span className="text-gray-800 shrink-0 ml-4 font-normal" style={bodyStyle}>
                      <RichText text={project.date} />
                    </span>
                  )}
                </div>
                {project.technologies && (
                  <div data-path={`${basePath}.${index}.technologies`} className="italic text-gray-600" style={bodyStyle}>
                    <RichText text={project.technologies} />
                  </div>
                )}
                {bullets.length > 0 && (
                  <div style={{ marginTop: '0.02in' }}>
                    {renderDotBullets(bullets, `${basePath}.${index}.description`)}
                  </div>
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
        <div className="space-y-1.5 text-gray-800" style={bodyStyle}>
          {validItems.map((cert, index) => (
            <div key={cert.id || index} className="flex justify-between items-baseline leading-snug">
              <div>
                <span data-path={`${basePath}.${index}.name`} className="font-bold text-gray-900">
                  <RichText text={cert.name ?? ''} />
                </span>
                {cert.issuer && (
                  <span className="text-gray-700 ml-2">
                    {' • '}
                    <span data-path={`${basePath}.${index}.issuer`}>
                      <RichText text={cert.issuer} />
                    </span>
                  </span>
                )}
              </div>
              {cert.date && (
                <span data-path={`${basePath}.${index}.date`} className="text-gray-800 shrink-0 ml-4 font-normal">
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
        <div className="space-y-1 text-gray-800" style={bodyStyle}>
          {validItems.map((lang, index) => (
            <div key={lang.id || index} className="leading-snug">
              <span data-path={`${basePath}.${index}.language`} className="font-bold text-gray-900">
                <RichText text={lang.language} />
              </span>
              {lang.proficiency && (
                <span className="italic text-gray-600 ml-2">
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
        <div className="space-y-1 text-gray-800" style={bodyStyle}>
          {validItems.map((item, index) => (
            <div key={item.id || index} className="leading-snug">
              <span data-path={`${basePath}.${index}.label`} className="font-bold text-gray-900">
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

    // CareerCraft is an entry-level / student template: no professional summary
    // or achievements by default — but an explicit user add (sidebar, canvas +
    // dock, or the hidden-content notice banner) still wins and renders them.
    if (
      (resolved.type === 'summary' ||
        resolved.type === 'achievements' ||
        id === 'summary' ||
        id === 'keyAchievements' ||
        id === 'achievements') &&
      !isSectionExplicitlyAdded(data, id)
    ) {
      return null;
    }

    let sectionTitle = resolved.title;
    if (resolved.type === 'involvement' || resolved.id === 'involvement') {
      const customTitle = data.sectionTitles?.involvement;
      sectionTitle = customTitle && customTitle !== 'Involvement' ? customTitle : 'INVOLVEMENT';
    } else if (resolved.type === 'skills') {
      const customTitle = data.sectionTitles?.skills;
      sectionTitle = customTitle && customTitle !== 'Skills & Interests' && customTitle !== 'Expert-Level Skills'
        ? customTitle
        : 'SKILLS';
    } else if (resolved.type === 'education') {
      const customTitle = data.sectionTitles?.education;
      sectionTitle = customTitle || 'EDUCATION';
    } else if (resolved.type === 'experience') {
      const customTitle = data.sectionTitles?.experience;
      sectionTitle = customTitle || 'EXPERIENCE';
    }

    switch (resolved.rendererKind) {
      case 'text':
        return renderTextBlock(sectionTitle, resolved.content as string, resolved.id);
      case 'skills':
      case 'expert_skills':
        return renderSkillsBlock(sectionTitle, resolved.content as any, resolved.id);
      case 'bullets':
        return renderBulletsBlock(sectionTitle, resolved.content as string[] | string, resolved.id);
      case 'experience':
        if (resolved.id === 'involvement' || resolved.type === 'involvement') {
          return renderLeadershipBlock(sectionTitle, resolved.content as Experience[], resolved.id);
        }
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
          bodyStyle: { fontSize: `${bodySize}pt`, lineHeight: data.lineHeight || 1.32 },
        });
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  const getCareerCraftSectionOrder = (): string[] => {
    return getResolvedSectionOrder(data);
  };

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.32,
        fontSize: `${bodySize}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
        fontFamily: data.font || 'Merriweather, serif',
      }}
    >
      {/* Header */}
      <header
        className="break-inside-avoid w-full"
        style={{ marginBottom: `${getHeaderGapIn(data)}in`, width: '100%' }}
      >
        <h1
          data-path="fullName"
          className={`font-bold tracking-normal uppercase w-full ${
            data.headerAlignment === 'left'
              ? 'text-left'
              : data.headerAlignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
          style={{
            width: '100%',
            fontSize: `${fontSizes?.header || 18}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.2,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {/* Job Title (if Title First) */}
        {isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={`tracking-wider text-gray-700 w-full ${
              data.jobTitleAlignment === 'left'
                ? 'text-left'
                : data.jobTitleAlignment === 'right'
                ? 'text-right'
                : data.jobTitleAlignment === 'center'
                ? 'text-center'
                : data.headerAlignment === 'left'
                ? 'text-left'
                : data.headerAlignment === 'right'
                ? 'text-right'
                : 'text-center'
            }`}
            style={{
              width: '100%',
              fontSize: `${fontSizes?.jobTitle || 10.5}pt`,
              color: accentColor,
              marginBottom: `${getHeaderContactGapIn(data)}in`,
              lineHeight: 1.25,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}

        {/* Contact Information */}
        {(() => {
          const showIcons = data.showContactIcons ?? false;
          const contactItems: React.ReactNode[] = [];

          if (data.location || data.address) {
            contactItems.push(
              <span key="loc" className="inline-flex items-center gap-1">
                {showIcons && <MapPin size={11} className="shrink-0" color={accentColor} />}
                <span data-path="location">
                  <RichText text={formatLocationDisplay(data.location || data.address || '')} />
                </span>
              </span>
            );
          }

          if (data.phone) {
            contactItems.push(
              <span key="ph" className="inline-flex items-center gap-1">
                {showIcons && <Phone size={11} className="shrink-0" color={accentColor} />}
                <span data-path="phone">
                  <RichText text={formatContactText(data.phone)} />
                </span>
              </span>
            );
          }

          if (data.email) {
            contactItems.push(
              <span key="em" className="inline-flex items-center gap-1">
                {showIcons && <Mail size={11} className="shrink-0" color={accentColor} />}
                <a
                  data-path="email"
                  href={`mailto:${formatContactText(data.email)}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <RichText text={formatContactText(data.email)} />
                </a>
              </span>
            );
          }

          if (data.linkedin) {
            contactItems.push(
              <span key="li" className="inline-flex items-center gap-1">
                {showIcons && <Linkedin size={11} className="shrink-0" color={accentColor} />}
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

          if (data.github) {
            contactItems.push(
              <span key="gh" className="inline-flex items-center gap-1">
                {showIcons && <Github size={11} className="shrink-0" color={accentColor} />}
                <a
                  data-path="github"
                  href={getGitHubHref(data.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: 'inherit' }}
                >
                  <RichText text={formatGitHubDisplay(data.github)} />
                </a>
              </span>
            );
          }

          if (data.portfolio) {
            contactItems.push(
              <span key="port" className="inline-flex items-center gap-1">
                {showIcons && <Globe size={11} className="shrink-0" color={accentColor} />}
                <a
                  data-path="portfolio"
                  href={getPortfolioHref(data.portfolio)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: 'inherit' }}
                >
                  <RichText text={formatPortfolioDisplay(data.portfolio)} />
                </a>
              </span>
            );
          }

          if (data.atHandle) {
            contactItems.push(
              <span key="at" className="inline-flex items-center gap-1">
                {showIcons && <Send size={11} className="shrink-0" color={accentColor} />}
                <span data-path="atHandle">
                  <RichText text={data.atHandle} />
                </span>
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className={`flex flex-wrap items-center w-full mx-auto ${
                showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-2 gap-y-1'
              } text-gray-700 ${
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
                ...bodyStyle,
                width: '100%',
                marginBottom:
                  !isTitleFirst(data, false) && data.jobTitle ? `${getHeaderContactGapIn(data)}in` : undefined,
              }}
            >
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item}
                  {!showIcons && idx < contactItems.length - 1 && (
                    <span className="mx-1 text-gray-500 font-normal select-none">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })()}

        {/* Job Title (if Contact First) */}
        {!isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={`tracking-wider text-gray-700 w-full ${
              data.jobTitleAlignment === 'left'
                ? 'text-left'
                : data.jobTitleAlignment === 'right'
                ? 'text-right'
                : data.jobTitleAlignment === 'center'
                ? 'text-center'
                : data.headerAlignment === 'left'
                ? 'text-left'
                : data.headerAlignment === 'right'
                ? 'text-right'
                : 'text-center'
            }`}
            style={{
              width: '100%',
              fontSize: `${fontSizes?.jobTitle || 10.5}pt`,
              color: accentColor,
              lineHeight: 1.25,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}
      </header>

      {/* Dynamic Sections */}
      {getCareerCraftSectionOrder().map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
