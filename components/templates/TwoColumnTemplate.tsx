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
import { Phone, Mail, MapPin, Linkedin, Send } from 'lucide-react';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const SIDEBAR_SECTION_TYPES = new Set(['skills', 'education', 'certifications', 'languages', 'key_value']);

export default function TwoColumnTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const accentColor = data.accentColor || '#1e3a5f';
  const t = getTranslation((data.language as Language) || 'en');

  const bodyStyle = {
    fontSize: `${fontSizes?.body || 9}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-2 ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header font-bold tracking-wider leading-normal"
        style={{
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          color: accentColor,
          marginBottom: '2px',
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: accentColor,
          marginTop: '2px',
          marginBottom: '2px',
        }}
      />
    </div>
  );

  const horizontalMargin = getMarginHorizontalIn(data);
  const verticalMargin = getMarginVerticalIn(data);
  const sectionGap = getSectionGapIn(data);

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-justify text-gray-800 whitespace-pre-line" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const skillsList = splitSkillsList(skillsStr);
    if (skillsList.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <ul data-skills-grid className="list-none pl-1 space-y-1 text-gray-700" style={bodyStyle}>
          {skillsList.map((skill, i) => (
            <li key={i} data-skill-cell className="flex gap-1.5 items-baseline min-w-0">
              <span data-bullet aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none" style={{ color: accentColor }}>•</span>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <ul className="list-disc ml-5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
          {achievements.map((highlight, i) => (
            <li key={i} data-path={`${basePath}.${i}`}>
              <RichText text={highlight.replace(/^[•-]\s*/, '')} />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((exp, index) => {
            const dateRange = [formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' – ');
            const bullets = parseDescriptionBullets(exp.description || '');
            if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

            return (
              <div
                key={exp.id}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <div className="font-bold text-gray-900" style={bodyStyle}>
                    {exp.role && (
                      <span data-path={`${basePath}.${index}.role`}>
                        <RichText text={exp.role} />
                      </span>
                    )}
                  </div>
                  {dateRange && (
                    <span className="text-gray-500 shrink-0 italic" style={bodyStyle}>
                      <RichText text={dateRange} />
                    </span>
                  )}
                </div>
                {(exp.company || exp.location) && (
                  <div className="italic text-gray-700 mb-1" style={bodyStyle}>
                    {exp.company && (
                      <span data-path={`${basePath}.${index}.company`}>
                        <RichText text={exp.company} />
                      </span>
                    )}
                    {exp.location && (
                      <span className="text-gray-600">
                        {exp.company ? ' · ' : ''}
                        <span data-path={`${basePath}.${index}.location`}>
                          <RichText text={exp.location} />
                        </span>
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                        <RichText text={bullet.replace(/^[•-]\s*/, '')} />
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
    const itemGap = `${Math.max(0.14, getSectionGapIn(data))}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year) return null;
            return (
              <div
                key={edu.id}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {edu.school && (
                  <div className="font-bold" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.school`}>
                      <RichText text={edu.school} />
                    </span>
                  </div>
                )}
                {edu.degree && (
                  <div className="italic text-gray-700" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.degree`}>
                      <RichText text={edu.degree} />
                    </span>
                  </div>
                )}
                {edu.gpa && (
                  <div className="text-gray-600" style={bodyStyle}>
                    GPA: <RichText text={edu.gpa} />
                  </div>
                )}
                {edu.year && (
                  <div data-path={`${basePath}.${index}.year`} className="text-gray-600" style={bodyStyle}>
                    <RichText text={edu.year} />
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
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div>
          {items.map((project, index) => {
            const bullets = parseDescriptionBullets(project.description);
            if (!project.name && !project.technologies && bullets.length === 0) return null;

            return (
              <div
                key={project.id}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                <div className="font-bold" style={{ ...bodyStyle, color: accentColor }}>
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
                {project.technologies && (
                  <div data-path={`${basePath}.${index}.technologies`} className="text-gray-600 italic mb-0.5" style={bodyStyle}>
                    <RichText text={project.technologies} />
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                        <RichText text={bullet.replace(/^[•-]\s*/, '')} />
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1.5">
          {validItems.map((cert, index) => (
            <div key={cert.id}>
              <div className="font-semibold" style={bodyStyle}>
                <span data-path={`${basePath}.${index}.name`}>
                  <RichText text={cert.name ?? ''} />
                </span>
              </div>
              {cert.issuer && (
                <div data-path={`${basePath}.${index}.issuer`} className="text-gray-600" style={bodyStyle}>
                  <RichText text={cert.issuer} />
                </div>
              )}
              {cert.date && (
                <div data-path={`${basePath}.${index}.date`} className="text-gray-500" style={bodyStyle}>
                  <RichText text={cert.date} />
                </div>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1.5 text-gray-800" style={bodyStyle}>
          {validItems.map((lang, index) => (
            <div key={lang.id}>
              <span data-path={`${basePath}.${index}.language`} className="font-bold">
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1.5 text-gray-800" style={bodyStyle}>
          {validItems.map((item, index) => (
            <div key={item.id}>
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
          bodyStyle: { fontSize: `${fontSizes?.body || 9}pt`, lineHeight: data.lineHeight || 1.5 },
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

  const allOrderedSections = getResolvedSectionOrder(data);
  const sidebarSectionIds = allOrderedSections.filter((id) => {
    const resolved = resolveSection(data, id);
    if (!resolved) return false;
    return SIDEBAR_SECTION_TYPES.has(resolved.rendererKind) || ['education', 'skills', 'certifications', 'languages', 'additionalInfo'].includes(resolved.type);
  });
  const mainSectionIds = allOrderedSections.filter((id) => !sidebarSectionIds.includes(id));

  return (
    <div
      className="w-full bg-white text-gray-900 resume-content"
      style={{
        fontFamily: data.font || 'Arial, Helvetica, sans-serif',
        fontSize: `${fontSizes?.body || 9}pt`,
        paddingTop: `${verticalMargin}in`,
        paddingBottom: `${verticalMargin}in`,
        paddingLeft: `${horizontalMargin}in`,
        paddingRight: `${horizontalMargin}in`,
        lineHeight: data.lineHeight || 1.5,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {/* Header */}
      <header
        className="text-center break-inside-avoid border-b-2 pb-3"
        style={{ marginBottom: `${getHeaderGapIn(data)}in`, borderColor: accentColor }}
      >
        <h1
          data-path="fullName"
          className="font-bold text-gray-900"
          style={{
            fontSize: `${fontSizes?.header || 20}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
            lineHeight: 1.15,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase) || 'YOUR NAME'} />
        </h1>

        {isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={`font-semibold ${
              data.jobTitleAlignment === 'left' ? 'text-left' :
              data.jobTitleAlignment === 'right' ? 'text-right' :
              data.jobTitleAlignment === 'center' ? 'text-center' :
              data.headerAlignment === 'left' ? 'text-left' :
              data.headerAlignment === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: accentColor,
              lineHeight: 1.25,
              marginBottom: `${getHeaderContactGapIn(data)}in`,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}

        {(() => {
          const showIcons = data.showContactIcons ?? true;
          const items: React.ReactNode[] = [];
          const locationText = data.location || data.address;
          if (locationText) items.push(
            <span key="location" className="inline-flex items-center gap-1">
              {showIcons && <MapPin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="location"><RichText text={formatLocationDisplay(locationText)} /></span>
            </span>
          );
          if (data.phone) items.push(
            <span key="phone" className="inline-flex items-center gap-1">
              {showIcons && <Phone size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="phone"><RichText text={formatContactText(data.phone)} /></span>
            </span>
          );
          if (data.email) items.push(
            <span key="email" className="inline-flex items-center gap-1">
              {showIcons && <Mail size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <a data-path="email" href={`mailto:${formatContactText(data.email)}`} className="text-gray-900 no-underline break-all">
                <RichText text={formatContactText(data.email)} />
              </a>
            </span>
          );
          if (data.linkedin) items.push(
            <span key="linkedin" className="inline-flex items-center gap-1">
              {showIcons && <Linkedin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <a
                data-path="linkedin"
                href={getLinkedInHref(data.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 no-underline break-all"
              >
                <RichText text={formatLinkedInDisplay(data.linkedin)} />
              </a>
            </span>
          );
          if (data.atHandle) items.push(
            <span key="at" className="inline-flex items-center gap-1">
              {showIcons && <Send size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
              <span data-path="atHandle"><RichText text={data.atHandle} /></span>
            </span>
          );
          if (items.length === 0) return null;
          return (
            <div
              className={`flex flex-wrap items-center ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} text-gray-600 ${
                data.contactAlignment === 'left' ? 'justify-start text-left' :
                data.contactAlignment === 'right' ? 'justify-end text-right' :
                data.contactAlignment === 'center' ? 'justify-center text-center' :
                data.headerAlignment === 'center' ? 'justify-center text-center' :
                data.headerAlignment === 'right' ? 'justify-end text-right' :
                'justify-start text-left'
              }`}
              style={{ ...bodyStyle, marginBottom: `${getHeaderContactGapIn(data)}in` }}
            >
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {!showIcons && index > 0 && <span className="mx-1 select-none text-gray-400">{CONTACT_SEPARATOR}</span>}
                  {item}
                </React.Fragment>
              ))}
            </div>
          );
        })()}

        {!isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={`font-semibold ${
              data.jobTitleAlignment === 'left' ? 'text-left' :
              data.jobTitleAlignment === 'right' ? 'text-right' :
              data.jobTitleAlignment === 'center' ? 'text-center' :
              data.headerAlignment === 'left' ? 'text-left' :
              data.headerAlignment === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: accentColor,
              lineHeight: 1.25,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-[32%_68%] gap-5">
        <aside
          className="space-y-4 break-inside-avoid pr-3"
          style={{
            backgroundColor: `${accentColor}0a`,
            padding: '0.12in',
            borderRadius: '2px',
          }}
        >
          {sidebarSectionIds.map((id) => (
            <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
          ))}
        </aside>

        <main className="space-y-4 pl-1">
          {mainSectionIds.map((id) => (
            <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
          ))}
        </main>
      </div>
    </div>
  );
}
