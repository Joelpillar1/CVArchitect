import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

import {
  formatDate,
  formatDateRange,
  parseDescriptionBullets,
  parseAchievementBullets,
  getSectionGapIn,
  getHeaderGapIn,
  getHeaderItemGapIn,
  getHeaderContactGapIn,
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
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

export default function VanguardTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  // Split skills based on column count
  const columnCount = data.skillsColumnCount === 2 ? 2 : data.skillsColumnCount === 4 ? 4 : 3;

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const getGridColsClass = (cols: number) => {
    if (cols === 2) return 'grid-cols-2';
    if (cols === 4) return 'grid-cols-4';
    return 'grid-cols-3';
  };

  const bodyStyle = {
    fontSize: `${fontSizes?.body || 8}pt`,
    lineHeight: data.lineHeight || 1.5,
  };

  const sectionHeaderStyle = {
    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
    borderColor: accentColor,
    color: accentColor,
  };

  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full mb-2.5 ${getSectionHeaderAlignment()}`}>
      <h2
        className="section-header font-bold tracking-widest leading-normal"
        style={{
          fontSize: `${fontSizes?.sectionTitle || 10.5}pt`,
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
          height: '1px',
          backgroundColor: accentColor,
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
        <p data-path={path} className="text-justify whitespace-pre-line text-gray-800" style={bodyStyle}>
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
          className={`list-none grid gap-x-6 gap-y-1 text-gray-800 ${getGridColsClass(columnCount)}`}
          style={bodyStyle}
        >
          {skillsList.map((skill, index) => (
            <li key={index} data-skill-cell className="flex items-baseline gap-2 min-w-0">
              <span
                data-bullet
                aria-hidden="true"
                className="shrink-0 select-none pointer-events-none text-gray-700 leading-none"
              >
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
        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800" style={bodyStyle}>
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
    const itemGap = `${Math.max(0.16, getSectionGapIn(data) * 1.15)}in`;

    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((exp, index) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate);
          const primaryRole = exp.role ?? '';
          const companyStr = exp.company ?? '';
          const bullets = parseDescriptionBullets(exp.description);

          if (!primaryRole && !companyStr && !dateRange && !exp.location && bullets.length === 0) {
            return null;
          }

          return (
            <div
              key={exp.id}
              className="w-full break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              {/* Role & Location on top line */}
              {(primaryRole || exp.location) && (
                <div className="flex justify-between items-baseline mb-0.5 leading-snug">
                  {primaryRole && (
                    <div
                      data-path={`${basePath}.${index}.role`}
                      className="font-semibold"
                      style={{
                        color: accentColor,
                        fontSize: `${(fontSizes?.body || 8) * 1.05}pt`,
                      }}
                    >
                      <RichText text={primaryRole} />
                    </div>
                  )}
                  {exp.location && (
                    <span
                      data-path={`${basePath}.${index}.location`}
                      className="text-gray-700 font-normal text-right shrink-0 ml-4"
                      style={bodyStyle}
                    >
                      <RichText text={exp.location} />
                    </span>
                  )}
                </div>
              )}

              {/* Company & Date on second line */}
              {(companyStr || dateRange) && (
                <div className="flex justify-between items-baseline mb-1" style={bodyStyle}>
                  {companyStr && (
                    <span data-path={`${basePath}.${index}.company`} className="font-bold text-gray-900">
                      <RichText text={companyStr} />
                    </span>
                  )}
                  {dateRange && (
                    <span className="text-gray-700 font-normal text-right shrink-0 ml-4">
                      <RichText text={dateRange} />
                    </span>
                  )}
                </div>
              )}

              {/* Bullets */}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800" style={bodyStyle}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          const dateStr = formatDate(edu.year);
          if (!edu.school && !edu.degree && !dateStr) return null;

          return (
            <div
              key={edu.id}
              className="break-inside-avoid w-full"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              {edu.degree && (
                <div
                  data-path={`${basePath}.${index}.degree`}
                  className="font-semibold mb-0.5 leading-snug"
                  style={{
                    color: accentColor,
                    fontSize: `${(fontSizes?.body || 8) * 1.05}pt`,
                  }}
                >
                  <RichText text={edu.degree} />
                </div>
              )}
              <div className="flex justify-between items-baseline" style={bodyStyle}>
                <div>
                  {edu.school && (
                    <span data-path={`${basePath}.${index}.school`} className="font-bold text-gray-900">
                      <RichText text={edu.school} />
                    </span>
                  )}
                  {edu.gpa && (
                    <span className="text-gray-600 ml-2">
                      • GPA: <RichText text={edu.gpa} />
                    </span>
                  )}
                </div>
                {dateStr && (
                  <span data-path={`${basePath}.${index}.year`} className="text-gray-700 font-normal shrink-0 ml-4">
                    <RichText text={dateStr} />
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
    const itemGap = `${Math.max(0.16, getSectionGapIn(data) * 1.15)}in`;

    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((project, index) => {
          const bullets = parseDescriptionBullets(project.description);

          if (!project.name && !project.technologies && bullets.length === 0) return null;

          return (
            <div
              key={project.id}
              className="w-full break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              {project.name && (
                <div
                  data-path={`${basePath}.${index}.name`}
                  className="font-semibold mb-0.5 leading-snug"
                  style={{
                    color: accentColor,
                    fontSize: `${(fontSizes?.body || 8) * 1.05}pt`,
                  }}
                >
                  <RichText text={project.name} />
                  {project.link && (
                    <a
                      href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-normal italic text-gray-600 hover:underline text-xs"
                    >
                      Link
                    </a>
                  )}
                </div>
              )}
              {project.technologies && (
                <div className="italic text-gray-600 mb-1" style={bodyStyle}>
                  <span data-path={`${basePath}.${index}.technologies`}>
                    <RichText text={project.technologies} />
                  </span>
                </div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800" style={bodyStyle}>
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
        <div className="space-y-2 text-gray-800" style={bodyStyle}>
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
                      <RichText text={cert.issuer ?? ''} />
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
        <div className="space-y-2 text-gray-800" style={bodyStyle}>
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
        <div className="space-y-2 text-gray-800" style={bodyStyle}>
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

  const renderCourseworkBlock = (title: string, items: CourseworkItem[] | string, basePath: string = 'coursework') => {
    if (!items) return null;
    if (typeof items === 'string') {
      if (!items.trim()) return null;
      return renderTextBlock(title, items, basePath);
    }
    if (!Array.isArray(items) || items.length === 0) return null;

    const validItems = items.filter((c) => c?.courseName?.trim() || c?.institution?.trim() || c?.skills?.trim() || c?.description);
    if (validItems.length === 0) return null;

    const itemGap = `${Math.max(0.14, getSectionGapIn(data) * 1.15)}in`;

    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {validItems.map((item, index) => {
          const bullets = parseDescriptionBullets(item.description || '');

          return (
            <div
              key={item.id || index}
              className="w-full break-inside-avoid"
              style={{ marginBottom: index === validItems.length - 1 ? 0 : itemGap }}
            >
              {/* Header Row: Course Name + Institution on left, Year on right */}
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="flex flex-wrap items-baseline">
                  {item.courseName?.trim() && (
                    <span
                      data-path={`${basePath}.${index}.courseName`}
                      className="font-semibold leading-snug"
                      style={{
                        color: accentColor,
                        fontSize: `${(fontSizes?.body || 8) * 1.05}pt`,
                      }}
                    >
                      <RichText text={item.courseName} />
                    </span>
                  )}
                  {item.institution?.trim() && (
                    <span className="font-normal italic text-gray-700 ml-1.5" style={bodyStyle}>
                      {item.courseName?.trim() ? ' — ' : ''}
                      <span data-path={`${basePath}.${index}.institution`}>
                        <RichText text={item.institution} />
                      </span>
                    </span>
                  )}
                </div>
                {item.year?.trim() && (
                  <div
                    data-path={`${basePath}.${index}.year`}
                    className="text-right whitespace-nowrap text-gray-600 pl-2 font-normal"
                    style={bodyStyle}
                  >
                    <RichText text={item.year} />
                  </div>
                )}
              </div>

              {/* Skills Covered: Dedicated leading line */}
              {item.skills?.trim() && (
                <div className="text-gray-700 mb-1 leading-snug" style={bodyStyle}>
                  <span className="font-semibold text-gray-800">Skills Covered: </span>
                  <span data-path={`${basePath}.${index}.skills`}>
                    <RichText text={item.skills} />
                  </span>
                </div>
              )}

              {/* Applied Bullets */}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-800" style={bodyStyle}>
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
          bodyStyle: { fontSize: `${fontSizes?.body || 8}pt`, lineHeight: data.lineHeight || 1.5 },
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
        return renderCourseworkBlock(sectionTitle, resolved.content as CourseworkItem[] | string, resolved.id);
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
        fontSize: `${fontSizes?.body || 8}pt`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      <header
        className="break-inside-avoid"
        style={{ marginBottom: `${getHeaderGapIn(data)}in` }}
      >
        <h1
          data-path="fullName"
          className={`font-bold tracking-wider leading-none ${
            data.headerAlignment === 'left'
              ? 'text-left'
              : data.headerAlignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
          style={{
            fontSize: `${fontSizes?.header || 18}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {/* Job Title (if Title First) */}
        {isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className={
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
            }
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
          const iconSize = 11.5;

          if (data.location || data.address) {
            contactItems.push(
              <span key="location" className="inline-flex items-center gap-1.5 align-middle" style={{ verticalAlign: 'middle' }}>
                {showIcons && (
                  <span className="inline-flex items-center justify-center shrink-0" style={{ verticalAlign: 'middle' }}>
                    <MapPin size={iconSize} className="shrink-0" color={accentColor} />
                  </span>
                )}
                <span data-path="location" className="inline-block align-middle">
                  <RichText text={formatLocationDisplay(data.location || data.address || '')} />
                </span>
              </span>
            );
          }

          if (data.phone) {
            contactItems.push(
              <span key="phone" className="inline-flex items-center gap-1.5 align-middle" style={{ verticalAlign: 'middle' }}>
                {showIcons && (
                  <span className="inline-flex items-center justify-center shrink-0" style={{ verticalAlign: 'middle' }}>
                    <Phone size={iconSize} className="shrink-0" color={accentColor} />
                  </span>
                )}
                <span data-path="phone" className="inline-block align-middle">
                  <RichText text={formatContactText(data.phone)} />
                </span>
              </span>
            );
          }

          if (data.email) {
            contactItems.push(
              <span key="email" className="inline-flex items-center gap-1.5 align-middle" style={{ verticalAlign: 'middle' }}>
                {showIcons && (
                  <span className="inline-flex items-center justify-center shrink-0" style={{ verticalAlign: 'middle' }}>
                    <Mail size={iconSize} className="shrink-0" color={accentColor} />
                  </span>
                )}
                <a data-path="email" href={`mailto:${formatContactText(data.email)}`} className="inline-block align-middle" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <RichText text={formatContactText(data.email)} />
                </a>
              </span>
            );
          }

          if (data.linkedin) {
            contactItems.push(
              <span key="linkedin" className="inline-flex items-center gap-1.5 align-middle" style={{ verticalAlign: 'middle' }}>
                {showIcons && (
                  <span className="inline-flex items-center justify-center shrink-0" style={{ verticalAlign: 'middle' }}>
                    <Linkedin size={iconSize} className="shrink-0" color={accentColor} />
                  </span>
                )}
                <a
                  data-path="linkedin"
                  href={getLinkedInHref(data.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block align-middle"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <RichText text={formatLinkedInDisplay(data.linkedin)} />
                </a>
              </span>
            );
          }

          if (data.atHandle) {
            contactItems.push(
              <span key="athandle" className="inline-flex items-center gap-1.5 align-middle" style={{ verticalAlign: 'middle' }}>
                {showIcons && (
                  <span className="inline-flex items-center justify-center shrink-0" style={{ verticalAlign: 'middle' }}>
                    <Send size={iconSize} className="shrink-0" color={accentColor} />
                  </span>
                )}
                <span data-path="atHandle" className="inline-block align-middle">
                  <RichText text={data.atHandle} />
                </span>
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className={`flex flex-wrap items-center ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} break-inside-avoid text-gray-700 ${
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
            className={
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
            }
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

      <hr
        className="border-t"
        style={{ borderColor: accentColor, marginBottom: `${getSectionGapIn(data)}in` }}
      />

      {/* Dynamic Sections */}
      {getResolvedSectionOrder(data).map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}