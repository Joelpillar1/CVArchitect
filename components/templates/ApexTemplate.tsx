import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { MapPin, Phone, Mail, Linkedin, Send } from 'lucide-react';
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

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ApexTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation(data.language as Language || 'en');
  const accentColor = data.accentColor || '#000000';

  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const bodyStyle = {
    fontSize: `${fontSizes?.body || 9}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  const sectionHeaderStyle = {
    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
    color: accentColor,
  };

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-1.5 ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header font-bold tracking-wider leading-normal"
        style={sectionHeaderStyle}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#d1d5db',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      />
    </div>
  );

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-gray-700 text-justify whitespace-pre-line" style={bodyStyle}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <ul
          data-skills-grid
          className={`list-none pl-2.5 grid gap-x-8 gap-y-1 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : (data.skillsColumnCount === 4 ? 'grid-cols-4' : 'grid-cols-3')}`}
          style={bodyStyle}
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
        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={bodyStyle}>
          {achievements.map((line, i) => (
            <li key={i} data-path={`${basePath}.${i}`}>
              <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
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
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((exp, index) => {
          const dateRange = [formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' - ');
          const bullets = parseDescriptionBullets(exp.description);
          if (!exp.role && !exp.company && !dateRange && bullets.length === 0) return null;

          return (
            <div
              key={exp.id}
              className="break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-gray-900" style={bodyStyle}>
                  {exp.role && (
                    <span data-path={`${basePath}.${index}.role`}>
                      <RichText text={exp.role} />
                    </span>
                  )}
                  {exp.company && (
                    <span className="font-normal italic text-gray-700">
                      {exp.role ? ' - ' : ''}
                      <span data-path={`${basePath}.${index}.company`}>
                        <RichText text={exp.company} />
                      </span>
                    </span>
                  )}
                  {exp.location && (
                    <span className="font-normal italic text-gray-600">
                      {', '}
                      <span data-path={`${basePath}.${index}.location`}>
                        <RichText text={exp.location} />
                      </span>
                    </span>
                  )}
                </div>
                {dateRange && (
                  <span className="text-gray-500 font-medium italic shrink-0 ml-4" style={bodyStyle}>
                    <RichText text={dateRange} />
                  </span>
                )}
              </div>
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={bodyStyle}>
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

  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${Math.max(0.14, getSectionGapIn(data))}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          if (!edu.school && !edu.degree && !edu.year) return null;
          return (
            <div
              key={edu.id}
              className="break-inside-avoid"
              style={{
                ...bodyStyle,
                marginBottom: index === items.length - 1 ? 0 : itemGap,
              }}
            >
              <div className="flex justify-between items-baseline">
                <div>
                  {edu.degree && (
                    <h3 className="font-bold text-gray-900">
                      <span data-path={`${basePath}.${index}.degree`}>
                        <RichText text={edu.degree} />
                      </span>
                    </h3>
                  )}
                  {edu.school && (
                    <p className="italic text-gray-600">
                      <span data-path={`${basePath}.${index}.school`}>
                        <RichText text={edu.school} />
                      </span>
                    </p>
                  )}
                  {edu.gpa && (
                    <p className="text-gray-600">
                      GPA: <RichText text={edu.gpa} />
                    </p>
                  )}
                </div>
                {edu.year && (
                  <span data-path={`${basePath}.${index}.year`} className="text-gray-500 font-medium shrink-0 ml-4">
                    <RichText text={edu.year} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>
    );
  };

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
              key={project.id}
              className="break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-gray-900" style={bodyStyle}>
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
              </div>
              {project.technologies && (
                <div data-path={`${basePath}.${index}.technologies`} className="italic text-gray-600 mb-1" style={bodyStyle}>
                  <RichText text={project.technologies} />
                </div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={bodyStyle}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-2 text-gray-700" style={bodyStyle}>
          {validItems.map((cert, index) => (
            <div key={cert.id} className="flex justify-between items-baseline">
              <div>
                <span data-path={`${basePath}.${index}.name`} className="font-bold">
                  <RichText text={cert.name ?? ''} />
                </span>
                {cert.issuer && (
                  <span className="italic text-gray-600">
                    {' - '}
                    <span data-path={`${basePath}.${index}.issuer`}>
                      <RichText text={cert.issuer} />
                    </span>
                  </span>
                )}
              </div>
              {cert.date && (
                <span data-path={`${basePath}.${index}.date`} className="text-gray-500 font-medium shrink-0 ml-4">
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
        <div className="space-y-2 text-gray-700" style={bodyStyle}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-2 text-gray-700" style={bodyStyle}>
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

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.5,
        fontSize: `${fontSizes?.body || 9}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      {/* Header */}
      <header
        className="break-inside-avoid"
        style={{ marginBottom: `${getHeaderGapIn(data)}in` }}
      >
        <h1
          data-path="fullName"
          className={`font-bold tracking-tight text-gray-900 ${
            data.headerAlignment === 'left' ? 'text-left' :
            data.headerAlignment === 'right' ? 'text-right' :
            'text-center'
          }`}
          style={{
            fontSize: `${fontSizes?.header || 22}pt`,
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
            className={`tracking-wider font-semibold text-gray-700 ${
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
              marginBottom: `${getHeaderContactGapIn(data)}in`,
              lineHeight: 1.25,
            }}
          >
            <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
          </p>
        )}

        {/* Contact Information */}
        {(() => {
          const showIcons = data.showContactIcons ?? true;
          const contactItems: React.ReactNode[] = [];

          if (data.location || data.address) {
            contactItems.push(
              <span key="loc" className="inline-flex items-center gap-1">
                {showIcons && <MapPin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                <span data-path="location">
                  <RichText text={formatLocationDisplay(data.location || data.address || '')} />
                </span>
              </span>
            );
          }

          if (data.phone) {
            contactItems.push(
              <span key="ph" className="inline-flex items-center gap-1">
                {showIcons && <Phone size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                <span data-path="phone">
                  <RichText text={formatContactText(data.phone)} />
                </span>
              </span>
            );
          }

          if (data.email) {
            contactItems.push(
              <span key="em" className="inline-flex items-center gap-1">
                {showIcons && <Mail size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
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
                {showIcons && <Linkedin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
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
              <span key="at" className="inline-flex items-center gap-1">
                {showIcons && <Send size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                <span data-path="atHandle">
                  <RichText text={data.atHandle} />
                </span>
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className={`flex flex-wrap items-center ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} text-gray-600 ${
                data.contactAlignment === 'left' ? 'justify-start text-left' :
                data.contactAlignment === 'right' ? 'justify-end text-right' :
                data.contactAlignment === 'center' ? 'justify-center text-center' :
                data.headerAlignment === 'left' ? 'justify-start text-left' :
                data.headerAlignment === 'right' ? 'justify-end text-right' :
                'justify-center text-center'
              }`}
              style={{
                ...bodyStyle,
                marginBottom: !isTitleFirst(data, false) && data.jobTitle ? `${getHeaderContactGapIn(data)}in` : undefined,
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
        })()}

        {/* Job Title (if Contact First) */}
        {!isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={`tracking-wider font-semibold text-gray-700 ${
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

      {/* Dynamic Sections */}
      {getResolvedSectionOrder(data).map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
