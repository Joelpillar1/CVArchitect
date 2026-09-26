import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Phone, Mail, Linkedin, Send } from 'lucide-react';
import {
  formatDate,
  formatDateRange,
  formatMonthYear,
  parseDescriptionBullets,
  parseAchievementBullets,
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
  CONTACT_SEPARATOR,
  formatJobTitleDisplay,
  formatSectionTitle,
  isTitleFirst,
  splitSkillsList,
  renderCourseworkBlockHelper,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import { CustomSectionData } from '../../types/resumeSections';

interface ClassicTemplateProps {
  data: ResumeData;
  fontSizes?: Record<string, number>;
}

export default function ClassicTemplate({ data, fontSizes }: ClassicTemplateProps) {
  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const t = getTranslation((data.language as Language) || 'en');

  const bodyStyle = {
    fontSize: `${fontSizes?.body || data.fontSizes?.body || 9}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  const sectionHeaderStyle = {
    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
    color: data.accentColor || '#000000',
  };

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-2 ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header text-lg font-bold leading-normal"
        style={sectionHeaderStyle}
      >
        {formatSectionTitle(title, data.sectionHeaderCase)}
      </h2>
      <div
        className="section-divider"
        style={{
          width: '100%',
          height: '1.5px',
          backgroundColor: '#9ca3af',
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
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <ul
          data-skills-grid
          className={`text-gray-800 list-none pl-2.5 grid gap-x-8 gap-y-1 ${
            data.skillsColumnCount === 2
              ? 'grid-cols-2'
              : data.skillsColumnCount === 4
              ? 'grid-cols-4'
              : 'grid-cols-3'
          }`}
          style={bodyStyle}
        >
          {skillsList.map((skill, i) => (
            <li key={i} data-skill-cell className="flex items-baseline gap-1.5 min-w-0">
              <span data-bullet aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none">
                •
              </span>
              <span className="flex-1" style={{ lineHeight: 'inherit' }}>
                <RichText text={skill} />
              </span>
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
        <ul className="text-gray-800 list-disc list-outside ml-5 space-y-1" style={bodyStyle}>
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
          const dateRange = formatDateRange(exp.startDate, exp.endDate);
          const primaryTitle = exp.role || exp.company;
          const subtitle = exp.role && exp.company ? exp.company : '';
          const bullets = parseDescriptionBullets(exp.description);

          if (!primaryTitle && !dateRange && !exp.location && bullets.length === 0) return null;

          return (
            <div
              key={exp.id}
              className="break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              {(primaryTitle || dateRange) && (
                <div className="flex justify-between items-center mb-1" style={bodyStyle}>
                  {primaryTitle ? (
                    <h3 className="font-bold text-gray-900">
                      <span data-path={exp.role ? `${basePath}.${index}.role` : `${basePath}.${index}.company`}>
                        <RichText text={primaryTitle} />
                      </span>
                    </h3>
                  ) : <div />}
                  {dateRange && (
                    <span className="font-bold text-gray-600 shrink-0 ml-4">
                      <RichText text={dateRange} />
                    </span>
                  )}
                </div>
              )}
              {(subtitle || exp.location) && (
                <p className="font-semibold italic text-gray-700 mb-2" style={bodyStyle}>
                  {subtitle && (
                    <span data-path={`${basePath}.${index}.company`}>
                      <RichText text={subtitle} />
                    </span>
                  )}
                  {exp.location && (
                    <span className="not-italic font-normal">
                      {subtitle ? ' • ' : ''}
                      <span data-path={`${basePath}.${index}.location`}>
                        <RichText text={exp.location} />
                      </span>
                    </span>
                  )}
                </p>
              )}
              {bullets.length > 0 && (
                <ul className="text-gray-800 list-disc list-outside ml-5 space-y-1" style={bodyStyle}>
                  {bullets.map((line, i) => (
                    <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                      <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
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
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          const dateStr = formatMonthYear(edu.year);
          if (!edu.school && !edu.degree && !dateStr) return null;

          return (
            <div
              key={edu.id}
              className="flex justify-between break-inside-avoid"
              style={{
                ...bodyStyle,
                marginBottom: index === items.length - 1 ? 0 : itemGap,
              }}
            >
              <div>
                {edu.school && (
                  <span data-path={`${basePath}.${index}.school`} className="font-bold block text-gray-900">
                    <RichText text={edu.school ?? ''} />
                  </span>
                )}
                {edu.degree && (
                  <span data-path={`${basePath}.${index}.degree`} className="italic text-gray-700">
                    <RichText text={edu.degree ?? ''} />
                  </span>
                )}
              </div>
              {dateStr && (
                <span data-path={`${basePath}.${index}.year`} className="font-bold text-gray-600 shrink-0 ml-4">
                  <RichText text={dateStr} />
                </span>
              )}
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
              {project.name && (
                <div className="flex justify-between items-center mb-1" style={bodyStyle}>
                  <h3 className="font-bold text-gray-900">
                    <span data-path={`${basePath}.${index}.name`}>
                      <RichText text={project.name} />
                    </span>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 font-normal text-gray-500 hover:underline"
                      >
                        Link
                      </a>
                    )}
                  </h3>
                </div>
              )}
              {project.technologies && (
                <p className="font-semibold italic text-gray-700 mb-2" style={bodyStyle}>
                  <span data-path={`${basePath}.${index}.technologies`}>
                    <RichText text={project.technologies} />
                  </span>
                </p>
              )}
              {bullets.length > 0 && (
                <ul className="text-gray-800 list-disc list-outside ml-5 space-y-1" style={bodyStyle}>
                  {bullets.map((line, i) => (
                    <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                      <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
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
        <div className="space-y-2">
          {validItems.map((cert, index) => (
            <div key={cert.id} className="flex justify-between" style={bodyStyle}>
              <div>
                <span data-path={`${basePath}.${index}.name`} className="font-bold block text-gray-900">
                  <RichText text={cert.name ?? ''} />
                </span>
                {cert.issuer && (
                  <span data-path={`${basePath}.${index}.issuer`} className="italic text-gray-700">
                    <RichText text={cert.issuer ?? ''} />
                  </span>
                )}
              </div>
              {cert.date && (
                <span data-path={`${basePath}.${index}.date`} className="font-bold text-gray-600 shrink-0 ml-4">
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
                <span className="ml-2 italic text-gray-600">
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

    // Use translation if default title matches standard key, or resolved.title
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
          bodyStyle: { fontSize: `${fontSizes?.body || 9}pt`, lineHeight: data.lineHeight || 1.5 },
        });
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  const titleFirst = isTitleFirst(data, false);
  const jobTitleBlock = data.jobTitle ? (
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
      style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000', lineHeight: 1.25 }}
    >
      <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
    </p>
  ) : null;

  const showIcons = data.showContactIcons ?? true;
  const contactItems: React.ReactNode[] = [];
  const locationText = data.location || data.address;
  if (locationText) {
    contactItems.push(
      <span key="loc" className="inline-flex items-center gap-1">
        {showIcons && <MapPin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
        <span data-path="location">
          <RichText text={formatLocationDisplay(locationText)} />
        </span>
      </span>
    );
  }
  if (data.phone) {
    contactItems.push(
      <span key="phone" className="inline-flex items-center gap-1">
        {showIcons && <Phone size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
        <span data-path="phone">
          <RichText text={formatContactText(data.phone)} />
        </span>
      </span>
    );
  }
  if (data.email) {
    contactItems.push(
      <span key="email" className="inline-flex items-center gap-1">
        {showIcons && <Mail size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
        <a
          data-path="email"
          href={`mailto:${formatContactText(data.email)}`}
          style={{ textDecoration: 'none', color: data.accentColor || '#000000' }}
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
          className="text-gray-600"
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

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.5,
        fontSize: `${fontSizes?.body || data.fontSizes?.body || 9}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      <div
        className="break-inside-avoid"
        style={{ marginBottom: `${getHeaderGapIn(data)}in` }}
      >
        <h1
          data-path="fullName"
          className={`text-5xl font-bold ${
            data.headerAlignment === 'left' ? 'text-left' :
            data.headerAlignment === 'right' ? 'text-right' :
            'text-center'
          }`}
          style={{ fontSize: `${fontSizes?.header || 18}pt`, marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.15 }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>
        {titleFirst && jobTitleBlock}
        {contactItems.length > 0 && (
          <div
            className={`text-sm flex flex-wrap items-center ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} ${
              data.contactAlignment === 'left' ? 'justify-start text-left' :
              data.contactAlignment === 'right' ? 'justify-end text-right' :
              data.contactAlignment === 'center' ? 'justify-center text-center' :
              data.headerAlignment === 'left' ? 'justify-start text-left' :
              data.headerAlignment === 'right' ? 'justify-end text-right' :
              'justify-center text-center'
            }`}
            style={{ ...bodyStyle, marginBottom: `${getHeaderContactGapIn(data)}in` }}
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
        )}
        {!titleFirst && jobTitleBlock}
      </div>

      {/* Dynamic Sections */}
      {getResolvedSectionOrder(data).map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
