import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem, CourseworkItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Phone, Mail, Linkedin, Globe, Github } from 'lucide-react';
import {
  parseDescriptionBullets,
  parseAchievementBullets,
  formatMonthYear as formatMonthYearUtil,
  getSectionGapIn,
  getItemGapIn,
  getHeaderGapIn,
  getHeaderItemGapIn,
  getHeaderContactGapIn,
  getMarginHorizontalIn,
  getMarginVerticalIn,
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
  renderCourseworkBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

interface InternTemplateProps {
  data: ResumeData;
}

export default function InternTemplate({ data }: InternTemplateProps) {
  const { fontSizes } = data;
  const t = getTranslation((data.language as Language) || 'en');
  const accentColor = data.accentColor || '#000000';

  const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
  };

  const bodySize = fontSizes?.body || 8.5;
  const bodyStyle: React.CSSProperties = {
    fontSize: `${bodySize}pt`,
    lineHeight: data.lineHeight || 1.34,
  };

  const sectionGapIn = getSectionGapIn(data);
  const itemGap = `${getItemGapIn(data)}in`;

  const getSectionHeaderAlignment = () => {
    const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  /**
   * Section Header for Student Intern:
   * 1. Thin top divider line (light grey) spanning full width
   * 2. Uppercase bold section title
   * 3. Solid black / accent color horizontal rule directly below
   */
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-gray-800 text-justify whitespace-pre-line leading-snug m-0" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  const renderSkillsBlock = (title: string, items: any, basePath: string = 'skills') => {
    const parsed = parseExpertSkillItems(items);
    if (parsed.length === 0) return null;

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1 text-gray-800 text-justify" style={bodyStyle}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
          {achievements.map((line, i) => (
            <li key={i} data-path={`${basePath}.${i}`} className="leading-snug">
              <RichText text={line ? line.replace(/^[•-]\s*/, '') : ''} />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((edu, index) => {
            if (!edu.school && !edu.degree && !edu.year) return null;
            // Build details line separated by middle dots
            const details: string[] = [];
            if (edu.relevantCourses) {
              const coursesStr = Array.isArray(edu.relevantCourses) ? edu.relevantCourses.join(', ') : edu.relevantCourses;
              if (coursesStr.trim()) details.push(coursesStr.trim());
            }
            if (edu.school) details.push(edu.school);
            if (edu.location) details.push(edu.location);
            if (edu.year) details.push(edu.year);
            if (edu.gpa) details.push(edu.gpa);

            const bullets = parseDescriptionBullets(edu.description);
            return (
              <div
                key={edu.id || index}
                className="break-inside-avoid leading-snug"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {edu.degree && (
                  <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.degree`}>
                      <RichText text={edu.degree} />
                    </span>
                  </h3>
                )}
                {details.length > 0 && (
                  <div className="text-gray-800 leading-snug mt-0.5" style={bodyStyle}>
                    {details.map((part, pIdx) => (
                      <React.Fragment key={pIdx}>
                        {pIdx > 0 && <span className="mx-1.5 text-gray-600 font-normal">·</span>}
                        <span>
                          <RichText text={part} />
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="leading-snug">
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

  const renderExperienceBlock = (title: string, items: Experience[], basePath: string = 'experience') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((exp, index) => {
            const dateRange = [formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' – ');
            const rightSide = [dateRange, exp.location].filter(Boolean).join(', ');
            const bullets = parseDescriptionBullets(exp.description);
            if (!exp.role && !exp.company && !rightSide && bullets.length === 0) return null;

            return (
              <div
                key={exp.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {/* Line 1: Role (bold) */}
                {exp.role && (
                  <div className="leading-snug" style={bodyStyle}>
                    <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                      <span data-path={`${basePath}.${index}.role`}>
                        <RichText text={exp.role} />
                      </span>
                    </h3>
                  </div>
                )}
                {/* Line 2: Company (left) | Date Range + Location (right) */}
                {(exp.company || rightSide) && (
                  <div className="flex justify-between items-baseline leading-snug mb-0.5" style={bodyStyle}>
                    <span className="text-gray-800" data-path={`${basePath}.${index}.company`}>
                      <RichText text={exp.company ?? ''} />
                    </span>
                    {rightSide && (
                      <span className="text-gray-800 shrink-0 ml-4 font-normal">
                        <RichText text={rightSide} />
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="leading-snug">
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

  const renderLeadershipBlock = (title: string, items: Experience[], basePath: string = 'leadership') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {items.map((lead, index) => {
            const dateRange = [formatMonthYear(lead.startDate), formatMonthYear(lead.endDate)].filter(Boolean).join(' – ');
            const orgLocation = lead.location || '';
            const orgName = lead.company || lead.organization || '';
            const rightSide = [dateRange, orgLocation].filter(Boolean).join(', ');
            const bullets = parseDescriptionBullets(lead.description);
            if (!lead.role && !orgName && !rightSide && bullets.length === 0) return null;

            return (
              <div
                key={lead.id || index}
                className="break-inside-avoid"
                style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
              >
                {lead.role && (
                  <div className="leading-snug" style={bodyStyle}>
                    <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                      <span data-path={`${basePath}.${index}.role`}>
                        <RichText text={lead.role} />
                      </span>
                    </h3>
                  </div>
                )}
                {(orgName || rightSide) && (
                  <div className="flex justify-between items-baseline leading-snug mb-0.5" style={bodyStyle}>
                    <span className="text-gray-800" data-path={`${basePath}.${index}.company`}>
                      <RichText text={orgName} />
                    </span>
                    {rightSide && (
                      <span className="text-gray-800 shrink-0 ml-4 font-normal">
                        <RichText text={rightSide} />
                      </span>
                    )}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="leading-snug">
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

  const renderProjectsBlock = (title: string, items: Project[], basePath: string = 'projects') => {
    if (!items || items.length === 0) return null;
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
                <div className="flex justify-between items-baseline leading-snug mb-0.5">
                  <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
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
                  </h3>
                  {project.date && (
                    <span className="text-gray-800 shrink-0 ml-4 font-normal" style={bodyStyle}>
                      <RichText text={project.date} />
                    </span>
                  )}
                </div>
                {project.technologies && (
                  <div data-path={`${basePath}.${index}.technologies`} className="italic text-gray-600 mb-0.5 leading-snug" style={bodyStyle}>
                    <RichText text={project.technologies} />
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="leading-snug">
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

  const renderCourseworkBlock = (title: string, items: CourseworkItem[] | string, basePath: string = 'coursework') => {
    if (!items) return null;
    if (typeof items === 'string') {
      if (!items.trim()) return null;
      return renderTextBlock(title, items, basePath);
    }
    if (!Array.isArray(items) || items.length === 0) return null;

    const validItems = items.filter(
      (c) => c?.courseName?.trim() || c?.institution?.trim() || c?.skills?.trim() || c?.description
    );
    if (validItems.length === 0) return null;

    return (
      <section style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="flex flex-col">
          {validItems.map((item, index) => {
            const bullets = parseDescriptionBullets(item.description || '');
            const details: string[] = [];
            if (item.institution?.trim()) details.push(item.institution.trim());
            if (item.year?.trim()) details.push(item.year.trim());
            if (item.skills?.trim()) details.push(item.skills.trim());

            return (
              <div
                key={item.id || index}
                className="break-inside-avoid leading-snug"
                style={{ marginBottom: index === validItems.length - 1 ? 0 : itemGap }}
              >
                {item.courseName && (
                  <h3 className="font-bold text-gray-900 leading-snug m-0 p-0" style={bodyStyle}>
                    <span data-path={`${basePath}.${index}.courseName`}>
                      <RichText text={item.courseName} />
                    </span>
                  </h3>
                )}
                {details.length > 0 && (
                  <div className="text-gray-800 leading-snug mt-0.5" style={bodyStyle}>
                    {details.map((part, pIdx) => (
                      <React.Fragment key={pIdx}>
                        {pIdx > 0 && <span className="mx-1.5 text-gray-600 font-normal">·</span>}
                        <span>
                          <RichText text={part} />
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-gray-800 text-justify" style={bodyStyle}>
                    {bullets.map((bullet, i) => (
                      <li key={i} data-path={`${basePath}.${index}.description.${i}`} className="leading-snug">
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

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
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
      <section className="break-inside-avoid" style={{ marginBottom: `${sectionGapIn}in` }}>
        {renderSectionHeader(title)}
        <div className="space-y-1 text-gray-800" style={bodyStyle}>
          {validItems.map((item, index) => (
            <p key={item.id || index} className="leading-snug m-0">
              <span data-path={`${basePath}.${index}.label`} className="font-bold text-gray-900">
                <RichText text={item.label} />:
              </span>{' '}
              <span data-path={`${basePath}.${index}.value`}>
                <RichText text={item.value} />
              </span>
            </p>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomBlock = (title: string, customSection: CustomSectionData, sectionId: string) => {
    if (!customSection) return null;
    const { contentType, content } = customSection;
    const basePath = `customSections.${sectionId}.content`;

    if (contentType === 'text' && typeof content === 'string') {
      return renderTextBlock(title, content, basePath);
    }
    if (contentType === 'bullets' && Array.isArray(content)) {
      return renderBulletsBlock(title, content, basePath);
    }
    if (contentType === 'key_value' && Array.isArray(content)) {
      return renderKeyValueBlock(title, content as AdditionalInfoItem[], basePath);
    }
    return null;
  };

  const renderSection = (sectionId: string) => {
    const resolved = resolveSection(data, sectionId);
    if (!resolved) return null;

    const sectionTitle = resolved.title;

    switch (resolved.type) {
      case 'summary':
        return renderTextBlock(sectionTitle, resolved.content as string);
      case 'experience':
        return renderExperienceBlock(sectionTitle, resolved.content as Experience[], 'experience');
      case 'education':
        return renderEducationBlock(sectionTitle, resolved.content as Education[], 'education');
      case 'skills':
        return renderSkillsBlock(sectionTitle, resolved.content, 'skills');
      case 'projects':
        return renderProjectsBlock(sectionTitle, resolved.content as Project[], 'projects');
      case 'coursework':
        return renderCourseworkBlock(sectionTitle, resolved.content as CourseworkItem[] | string, 'coursework');
      case 'leadership':
        return renderLeadershipBlock(sectionTitle, resolved.content as Experience[], 'leadership');
      case 'certifications':
        return renderCertificationsBlock(sectionTitle, resolved.content as Certification[], 'certifications');
      case 'languages':
        return renderLanguagesBlock(sectionTitle, resolved.content as LanguageItem[], 'languages');
      case 'additional_information':
        return renderKeyValueBlock(sectionTitle, resolved.content as AdditionalInfoItem[], 'additionalInfo');
      case 'achievements':
        return renderBulletsBlock(sectionTitle, resolved.content as string[] | string, 'keyAchievements');
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        // User-added sections (any canonical type) fall back to generic blocks
        // keyed by the registry's renderer kind so they render in the preview.
        switch (resolved.rendererKind) {
          case 'text':
            return renderTextBlock(sectionTitle, resolved.content as string, resolved.id);
          case 'bullets':
            return renderBulletsBlock(sectionTitle, resolved.content as string[] | string, resolved.id);
          case 'key_value':
            return renderKeyValueBlock(sectionTitle, resolved.content as AdditionalInfoItem[], resolved.id);
          case 'experience':
            return renderExperienceBlock(sectionTitle, resolved.content as Experience[], resolved.id);
          case 'education':
            return renderEducationBlock(sectionTitle, resolved.content as Education[], resolved.id);
          case 'skills':
            return renderSkillsBlock(sectionTitle, resolved.content, resolved.id);
          case 'projects':
            return renderProjectsBlock(sectionTitle, resolved.content as Project[], resolved.id);
          case 'certifications':
            return renderCertificationsBlock(sectionTitle, resolved.content as Certification[], resolved.id);
          case 'languages':
            return renderLanguagesBlock(sectionTitle, resolved.content as LanguageItem[], resolved.id);
          case 'coursework':
            return renderCourseworkBlock(sectionTitle, resolved.content as CourseworkItem[] | string, resolved.id);
          default:
            return null;
        }
    }
  };

  const getInternSectionOrder = (): string[] => {
    return getResolvedSectionOrder(data);
  };

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.34,
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
        className="break-inside-avoid w-full text-center"
        style={{ marginBottom: `${getHeaderGapIn(data)}in`, width: '100%' }}
      >
        <h1
          data-path="fullName"
          className="font-bold tracking-normal w-full text-center"
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
            className="tracking-wider text-gray-700 w-full text-center"
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

        {/* Contact Information with Icons */}
        {(() => {
          const contactItems: React.ReactNode[] = [];

          if (data.location) {
            contactItems.push(
              <span key="loc" className="inline-flex items-center gap-1">
                <MapPin size={12} className="shrink-0 text-gray-700" />
                <span data-path="location">
                  <RichText text={formatLocationDisplay(data.location, data.address)} />
                </span>
              </span>
            );
          }

          if (data.email) {
            contactItems.push(
              <span key="email" className="inline-flex items-center gap-1">
                <Mail size={12} className="shrink-0 text-gray-700" />
                <a href={`mailto:${data.email}`} data-path="email" className="hover:underline text-gray-800">
                  <RichText text={data.email} />
                </a>
              </span>
            );
          }

          if (data.phone) {
            contactItems.push(
              <span key="phone" className="inline-flex items-center gap-1">
                <Phone size={12} className="shrink-0 text-gray-700" />
                <a href={`tel:${data.phone}`} data-path="phone" className="hover:underline text-gray-800">
                  <RichText text={data.phone} />
                </a>
              </span>
            );
          }

          if (data.linkedin) {
            contactItems.push(
              <span key="linkedin" className="inline-flex items-center gap-1">
                <Linkedin size={12} className="shrink-0 text-gray-700" />
                <a
                  href={getLinkedInHref(data.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-path="linkedin"
                  className="hover:underline text-gray-800"
                >
                  <RichText text={formatLinkedInDisplay(data.linkedin)} />
                </a>
              </span>
            );
          }

          if (data.github) {
            contactItems.push(
              <span key="github" className="inline-flex items-center gap-1">
                <Github size={12} className="shrink-0 text-gray-700" />
                <a
                  href={getGitHubHref(data.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-path="github"
                  className="hover:underline text-gray-800"
                >
                  <RichText text={formatGitHubDisplay(data.github)} />
                </a>
              </span>
            );
          }

          if (data.portfolio) {
            contactItems.push(
              <span key="portfolio" className="inline-flex items-center gap-1">
                <Globe size={12} className="shrink-0 text-gray-700" />
                <a
                  href={getPortfolioHref(data.portfolio)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-path="portfolio"
                  className="hover:underline text-gray-800"
                >
                  <RichText text={formatPortfolioDisplay(data.portfolio)} />
                </a>
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-700"
              style={{
                fontSize: `${fontSizes?.body ? Math.max(7.5, fontSizes.body - 0.5) : 8}pt`,
                lineHeight: 1.25,
              }}
            >
              {contactItems}
            </div>
          );
        })()}

        {/* Job Title (if Contact First) */}
        {!isTitleFirst(data, false) && data.jobTitle && (
          <p
            data-path="jobTitle"
            className="tracking-wider text-gray-700 w-full text-center mt-1"
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
      {getInternSectionOrder().map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
