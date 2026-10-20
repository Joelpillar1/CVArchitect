import React from 'react';
import RichText from '../RichText';
import { ResumeData, Experience, Education, Project, Certification, LanguageItem, AdditionalInfoItem } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Phone, Mail, Linkedin, Send, Github, Globe } from 'lucide-react';
import {
  formatDate,
  formatDateRange,
  parseDescriptionBullets,
  parseAchievementBullets,
  getSectionGapIn,
  getHeaderGapIn,
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
  formatSectionTitle,
  splitSkillsList,
  renderExpertSkillsBlockHelper,
} from '../../utils/templateUtils';
import { resolveSection, getResolvedSectionOrder } from '../../utils/sectionRegistry';
import type { CustomSectionData } from '../../types/resumeSections';

/**
 * Finance Template (formerly Modern)
 * Cloned precisely to match executive finance & banking resume typography:
 * - Professional serif typeface with deep black headings
 * - Centered name & contact header with clean inline icons
 * - Professional title omitted from header by default
 * - Solid black section underlines with no grey horizontal dividers
 * - "Professional Summary" and "Work Experience" default naming
 * - Right-aligned dates and locations on role headers
 */
export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const accentColor = data.accentColor || '#1a1a1a';
  const t = getTranslation((data.language as Language) || 'en');

  const bodyStyle: React.CSSProperties = {
    fontSize: `${fontSizes?.body || 9}pt`,
    lineHeight: data.lineHeight || 1.45,
  };

  const renderSectionHeader = (title: string) => (
    <div className="section-header-wrap mb-2">
      <h2
        className={`section-header font-bold uppercase tracking-wider text-gray-900 ${getSectionHeaderAlignment()}`}
        style={{
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          color: accentColor,
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase || 'uppercase')}
      </h2>
      <div
        className="h-[1.5px] w-full mt-0.5"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );

  const renderTextBlock = (title: string, text: string, path: string = 'summary') => {
    if (!text || !text.trim()) return null;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        <p data-path={path} className="text-gray-800 text-justify leading-relaxed whitespace-pre-line" style={bodyStyle}>
          <RichText text={text ?? ''} />
        </p>
      </section>
    );
  };

  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const lines = skillsStr.split('\n').map((l) => l.trim()).filter(Boolean);
    const hasColonLines = lines.some((l) => l.includes(':'));

    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {hasColonLines ? (
          <div className="space-y-1.5 text-gray-800 leading-relaxed" style={bodyStyle}>
            {lines.map((line, idx) => {
              const colonIndex = line.indexOf(':');
              if (colonIndex !== -1) {
                const label = line.slice(0, colonIndex + 1);
                const rest = line.slice(colonIndex + 1);
                return (
                  <div key={idx} data-path={`skills.${idx}`}>
                    <span className="font-bold text-gray-900"><RichText text={label} /></span>
                    <span><RichText text={rest} /></span>
                  </div>
                );
              }
              return (
                <div key={idx} data-path={`skills.${idx}`}>
                  <RichText text={line} />
                </div>
              );
            })}
          </div>
        ) : (
          <p data-path="skills" className="text-gray-800 leading-relaxed" style={bodyStyle}>
            <RichText text={skillsStr} />
          </p>
        )}
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
        <ul className="list-disc list-outside ml-4 space-y-1 text-gray-800" style={bodyStyle}>
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
          const locationStr = exp.location ? formatLocationDisplay(exp.location) : '';
          const bullets = parseDescriptionBullets(exp.description);
          if (!exp.role && !exp.company && !dateRange && !locationStr && bullets.length === 0) return null;

          return (
            <div
              key={exp.id || index}
              className="break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              {/* Line 1: Role on left, Country/Location right-aligned */}
              <div className="flex justify-between items-baseline" style={bodyStyle}>
                <div>
                  {exp.role && (
                    <span data-path={`${basePath}.${index}.role`} className="font-bold text-gray-900 text-[10pt]">
                      <RichText text={exp.role} />
                    </span>
                  )}
                </div>
                {locationStr && (
                  <span data-path={`${basePath}.${index}.location`} className="text-gray-800 font-normal shrink-0 ml-4">
                    <RichText text={locationStr} />
                  </span>
                )}
              </div>

              {/* Line 2: Company on left, Date range right-aligned */}
              {(exp.company || dateRange) && (
                <div className="flex justify-between items-baseline mb-1" style={bodyStyle}>
                  {exp.company ? (
                    <div data-path={`${basePath}.${index}.company`} className="text-gray-800 font-normal">
                      <RichText text={exp.company} />
                    </div>
                  ) : (
                    <span />
                  )}
                  {dateRange && (
                    <span className="text-gray-800 font-normal shrink-0 ml-4">
                      <RichText text={dateRange} />
                    </span>
                  )}
                </div>
              )}

              {/* Bullets */}
              {bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-800" style={bodyStyle}>
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
    const itemGap = `${Math.max(0.12, getSectionGapIn(data))}in`;
    return (
      <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          const dateStr = formatDate(edu.year);
          if (!edu.school && !edu.degree && !dateStr) return null;
          const locStr = edu.location ? formatLocationDisplay(edu.location) : '';
          const subDetails = [edu.school, locStr, dateStr].filter(Boolean).join('  •  ');

          return (
            <div
              key={edu.id || index}
              className="break-inside-avoid"
              style={{
                ...bodyStyle,
                marginBottom: index === items.length - 1 ? 0 : itemGap,
              }}
            >
              {edu.degree && (
                <div data-path={`${basePath}.${index}.degree`} className="font-bold text-gray-900 text-[10pt]">
                  <RichText text={edu.degree} />
                </div>
              )}
              {subDetails && (
                <div className="text-gray-800 font-normal">
                  <RichText text={subDetails} />
                  {edu.gpa && (
                    <span className="text-gray-700 ml-2">
                      • GPA: <RichText text={edu.gpa} />
                    </span>
                  )}
                </div>
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
        {items.map((proj, index) => {
          const bullets = Array.isArray(proj.description)
            ? proj.description
            : typeof proj.description === 'string' && proj.description.trim()
            ? parseDescriptionBullets(proj.description)
            : [];

          return (
            <div
              key={proj.id || index}
              className="break-inside-avoid"
              style={{ marginBottom: index === items.length - 1 ? 0 : itemGap }}
            >
              <div className="flex justify-between items-baseline" style={bodyStyle}>
                <div className="font-bold text-gray-900 text-[10pt]">
                  <span data-path={`${basePath}.${index}.name`}>
                    <RichText text={proj.name} />
                  </span>
                  {proj.technologies && (
                    <span className="font-normal italic text-gray-700 ml-2">
                      ({proj.technologies})
                    </span>
                  )}
                </div>
                {proj.date && (
                  <span className="text-gray-800 font-normal shrink-0 ml-4">
                    <RichText text={proj.date} />
                  </span>
                )}
              </div>

              {bullets.length > 0 ? (
                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-800" style={bodyStyle}>
                  {bullets.map((b, i) => (
                    <li key={i} data-path={`${basePath}.${index}.description.${i}`}>
                      <RichText text={b ? b.replace(/^[•-]\s*/, '') : ''} />
                    </li>
                  ))}
                </ul>
              ) : typeof proj.description === 'string' && proj.description.trim() ? (
                <p data-path={`${basePath}.${index}.description`} className="text-gray-800" style={bodyStyle}>
                  <RichText text={proj.description} />
                </p>
              ) : null}
            </div>
          );
        })}
      </section>
    );
  };

  const renderCertificationsBlock = (title: string, items: Certification[], basePath: string = 'certifications') => {
    if (!items || items.length === 0) return null;
    const itemGap = `${getItemGapIn(data)}in`;
    return (
      <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
        {renderSectionHeader(title)}
        {items.map((cert, index) => {
          return (
            <div
              key={cert.id || index}
              className="break-inside-avoid flex justify-between items-baseline"
              style={{
                ...bodyStyle,
                marginBottom: index === items.length - 1 ? 0 : itemGap,
              }}
            >
              <div>
                <span data-path={`${basePath}.${index}.name`} className="font-bold text-gray-900">
                  <RichText text={cert.name} />
                </span>
                {cert.issuer && (
                  <span className="text-gray-700 ml-2">
                    — <span data-path={`${basePath}.${index}.issuer`}><RichText text={cert.issuer} /></span>
                  </span>
                )}
              </div>
              {cert.date && (
                <span data-path={`${basePath}.${index}.date`} className="text-gray-800 font-normal shrink-0 ml-4">
                  <RichText text={cert.date} />
                </span>
              )}
            </div>
          );
        })}
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
            <div key={lang.id || index}>
              <span data-path={`${basePath}.${index}.language`} className="font-bold">
                <RichText text={lang.language} />
              </span>
              {lang.proficiency && (
                <span className="italic text-gray-700 ml-2">
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
            <div key={item.id || index}>
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
    // The Finance template strictly renders only the core executive sections: Summary, Experience, Education, Skills
    if (!['summary', 'experience', 'education', 'skills'].includes(resolved.type)) return null;

    let sectionTitle = resolved.title;
    if (resolved.type === 'summary') sectionTitle = data.sectionTitles?.summary || t.professionalSummary || 'Professional Summary';
    if (resolved.type === 'experience') sectionTitle = data.sectionTitles?.experience || t.experienceTitle || 'Work Experience';
    if (resolved.type === 'education') sectionTitle = data.sectionTitles?.education || t.educationTitle || 'Education';
    if (resolved.type === 'skills') sectionTitle = data.sectionTitles?.skills || t.technicalSkills || 'Skills';
    if (resolved.type === 'certifications') sectionTitle = data.sectionTitles?.certifications || t.certifications || 'Certifications';
    if (resolved.type === 'projects') sectionTitle = data.sectionTitles?.projects || t.projects || 'Projects';

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
      case 'custom':
        return renderCustomBlock(sectionTitle, resolved.content as CustomSectionData, resolved.id);
      default:
        return null;
    }
  };

  return (
    <div
      className="modern-template bg-white text-gray-900 font-serif leading-normal mx-auto shadow-sm print:shadow-none print:m-0 print:p-0 min-h-[11in]"
      style={{
        padding: `${getMarginVerticalIn(data)}in ${getMarginHorizontalIn(data)}in`,
        fontFamily: data.font || 'Merriweather, Georgia, serif',
        fontSize: `${fontSizes?.body || 9}pt`,
        lineHeight: data.lineHeight || 1.45,
        color: '#1a1a1a',
      }}
    >
      {/* Header */}
      <header
        className="text-center"
        style={{ marginBottom: `${getHeaderGapIn(data)}in` }}
      >
        <h1
          data-path="fullName"
          className="font-bold tracking-normal text-gray-900 mb-1.5"
          style={{
            fontSize: `${fontSizes?.header || 22}pt`,
            lineHeight: 1.15,
            color: accentColor,
          }}
        >
          <RichText text={formatNameDisplay(data.fullName, data.headerCase)} />
        </h1>

        {/* Note: Professional title removed from the top as requested */}

        {/* Contact Information */}
        {(() => {
          const showIcons = data.showContactIcons ?? true;
          const contactItems: React.ReactNode[] = [];

          if (data.location || data.address) {
            contactItems.push(
              <span key="loc" className="inline-flex items-center gap-1">
                {showIcons && <MapPin size={12} className="shrink-0" color={accentColor} />}
                <span data-path="location">
                  <RichText text={formatLocationDisplay(data.location || data.address || '')} />
                </span>
              </span>
            );
          }

          if (data.email) {
            contactItems.push(
              <span key="em" className="inline-flex items-center gap-1">
                {showIcons && <Mail size={12} className="shrink-0" color={accentColor} />}
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

          if (data.phone) {
            contactItems.push(
              <span key="ph" className="inline-flex items-center gap-1">
                {showIcons && <Phone size={12} className="shrink-0" color={accentColor} />}
                <span data-path="phone">
                  <RichText text={formatContactText(data.phone)} />
                </span>
              </span>
            );
          }

          if (data.linkedin) {
            contactItems.push(
              <span key="li" className="inline-flex items-center gap-1">
                {showIcons && <Linkedin size={12} className="shrink-0" color={accentColor} />}
                <a
                  data-path="linkedin"
                  href={getLinkedInHref(data.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: 'inherit' }}
                >
                  <RichText text={formatLinkedInDisplay(data.linkedin)} />
                </a>
              </span>
            );
          }

          if (data.github) {
            contactItems.push(
              <span key="gh" className="inline-flex items-center gap-1">
                {showIcons && <Github size={12} className="shrink-0" color={accentColor} />}
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
              <span key="portfolio" className="inline-flex items-center gap-1">
                {showIcons && <Globe size={12} className="shrink-0" color={accentColor} />}
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
                {showIcons && <Send size={12} className="shrink-0" color={accentColor} />}
                <span data-path="atHandle">
                  <RichText text={data.atHandle} />
                </span>
              </span>
            );
          }

          if (contactItems.length === 0) return null;

          return (
            <div
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-700 mx-auto"
              style={bodyStyle}
            >
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </header>

      {/* Dynamic Sections */}
      {getResolvedSectionOrder(data).map((id) => (
        <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
      ))}
    </div>
  );
}
