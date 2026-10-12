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
  formatGitHubDisplay,
  getGitHubHref,
  formatPortfolioDisplay,
  getPortfolioHref,
  formatNameDisplay,
  formatJobTitleDisplay,
  formatSectionTitle,
  getItemGapIn,
  splitSkillsList,
  CONTACT_SEPARATOR,
  parseExpertSkillItems,
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

  const HEADING_MARGIN_BOTTOM = '0.09in';
  const ENTRY_GAP = `${getItemGapIn(data, 0.16)}in`;
  // Header→contact and contact→rule gaps: honor explicit user settings, else
  // this template's measured design values.
  const NAME_TO_CONTACT = `${getHeaderItemGapIn(data)}in`;
  const CONTACT_TO_RULE = `${data.headerGap !== undefined ? getHeaderGapIn(data) : 0.08}in`;
  const BULLET_TOP = '0.03in';

  const getSectionHeaderAlignment = () => {
    // Regent Serif: Section header is always centered by default.
    const align =
      data.sectionHeaderAlignment ||
      (data.bodyHeaderAlignment && data.bodyHeaderAlignment !== 'left' ? data.bodyHeaderAlignment : undefined);
    if (align === 'left') return 'text-left';
    if (align === 'right') return 'text-right';
    return 'text-center';
  };

  const getTextAlignment = () => {
    if (data.headerAlignment === 'left') return 'text-left';
    if (data.headerAlignment === 'right') return 'text-right';
    return 'text-center';
  };

  /** Centered heading with top and bottom 1px horizontal lines matching reference image. */
  const renderSectionHeader = (title: string) => (
    <div className={`section-header-wrap break-inside-avoid w-full text-center ${getSectionHeaderAlignment()}`} style={{ marginBottom: HEADING_MARGIN_BOTTOM }}>
      <h2
        className={`section-header font-bold leading-tight w-full text-center ${getSectionHeaderAlignment()}`}
        style={{
          width: '100%',
          fontSize: `${fontSizes?.sectionTitle || 11}pt`,
          color: accentColor,
          borderTop: `1px solid ${accentColor}`,
          borderBottom: `1px solid ${accentColor}`,
          paddingTop: '0.04in',
          paddingBottom: '0.04in',
          margin: 0,
        }}
      >
        {formatSectionTitle(title, data.sectionHeaderCase || 'titlecase')}
      </h2>
    </div>
  );

  const sectionStyle: React.CSSProperties = {
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
        {labelValue.map((row, i) => {
          const rawLabel = (row.label || '').replace(/[:\-–—\s]+$/, '').trim();
          const displayLabel = rawLabel ? `${rawLabel}:` : '';
          return (
            <React.Fragment key={keyOf(i)}>
              <span className="font-bold" style={{ whiteSpace: 'nowrap' }}>
                <RichText text={displayLabel} />
              </span>
              <span>
                <RichText text={row.value} />
              </span>
            </React.Fragment>
          );
        })}
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

  /**
   * Reference template's "Core Competencies" 2-column layout:
   * Left: Bold category label without colon (e.g. Languages, Frameworks, Tools, Cloud & Infrastructure, Dev Practices)
   * Right: Comma-separated skills aligned neatly in the second column
   */
  const renderCoreCompetenciesGrid = (
    items: { category: string; skills: string }[],
    basePath: string = 'skills'
  ) => {
    const valid = items
      .map((it) => {
        const rawCat = (it.category || '').replace(/[:\-–—\s]+$/, '').trim();
        return {
          category: rawCat ? `${rawCat}:` : '',
          skills: (it.skills || '').trim(),
        };
      })
      .filter((it) => it.category || it.skills);

    if (valid.length === 0) return null;

    // If none of the rows have a category label, render as clean comma-separated list
    const hasCategoryLabels = valid.some((r) => r.category);
    if (!hasCategoryLabels) {
      return (
        <p className="text-gray-900 leading-normal" style={bodyStyle}>
          {valid.map((row, i) => (
            <React.Fragment key={i}>
              {i > 0 && ', '}
              <span data-path={`${basePath}.${i}.skills`}>
                <RichText text={row.skills} />
              </span>
            </React.Fragment>
          ))}
        </p>
      );
    }

    return (
      <div
        className="grid text-gray-900"
        style={{
          ...bodyStyle,
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          columnGap: '1.25rem',
          rowGap: '2px',
          alignItems: 'baseline',
        }}
      >
        {valid.map((row, idx) => (
          <React.Fragment key={idx}>
            <div
              className="font-bold text-gray-900 select-none"
              style={{ whiteSpace: 'nowrap' }}
              data-path={`${basePath}.${idx}.category`}
            >
              <RichText text={row.category} />
            </div>
            <div
              className="text-gray-900 leading-normal text-left"
              data-path={`${basePath}.${idx}.skills`}
            >
              <RichText text={row.skills} />
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const categorizeSkillsString = (skillsStr: string): { category: string; skills: string }[] => {
    if (!skillsStr || !skillsStr.trim()) return [];

    // Check if skillsStr contains multiple categorized lines (newline, bullet, or semicolon separated with colons)
    let rawItems: string[] = [];
    if (skillsStr.includes('\n')) {
      rawItems = skillsStr.split('\n').map((l) => l.trim()).filter(Boolean);
    } else if (skillsStr.includes('•') && skillsStr.includes(':')) {
      rawItems = skillsStr.split('•').map((l) => l.trim()).filter(Boolean);
    } else if (skillsStr.includes(';') && skillsStr.includes(':')) {
      rawItems = skillsStr.split(';').map((l) => l.trim()).filter(Boolean);
    }

    if (rawItems.length > 0) {
      const explicitRows: { category: string; skills: string }[] = [];
      for (const item of rawItems) {
        const colonIdx = item.indexOf(':');
        if (colonIdx !== -1) {
          explicitRows.push({
            category: item.slice(0, colonIdx).trim(),
            skills: item.slice(colonIdx + 1).trim(),
          });
        } else {
          const match = item.match(/^([A-Za-z\s&/]{2,25})\s{2,}(.+)$/);
          if (match) {
            explicitRows.push({
              category: match[1].trim(),
              skills: match[2].trim(),
            });
          } else {
            explicitRows.push({
              category: '',
              skills: item.replace(/^[•-]\s*/, '').trim(),
            });
          }
        }
      }
      if (explicitRows.some((r) => r.category)) {
        return explicitRows;
      }
    }

    // Check for single categorized string "Category: Skill1, Skill2..."
    const colonIdx = skillsStr.indexOf(':');
    if (colonIdx !== -1) {
      return [
        {
          category: skillsStr.slice(0, colonIdx).trim(),
          skills: skillsStr.slice(colonIdx + 1).trim(),
        },
      ];
    }

    // Flat comma-delimited list of skills -> auto-categorize into reference categories
    const skillsList = splitSkillsList(skillsStr);
    if (skillsList.length === 0) return [];

    const KNOWN_CATEGORIES: { id: string; category: string; test: (s: string) => boolean }[] = [
      {
        id: 'strategy_product',
        category: 'Strategy & Product',
        test: (s) =>
          /(product strategy|product management|roadmap|go-to-market|gtm|feature prioritization|product lifecycle|okrs?|kpis?|growth strategy|business development)/i.test(s),
      },
      {
        id: 'methodologies',
        category: 'Methodologies',
        test: (s) =>
          /(agile|scrum|kanban|sprint|lean|waterfall|ci\/cd|continuous integration|continuous deployment|tdd|test-driven|devops)/i.test(s),
      },
      {
        id: 'analytics_research',
        category: 'Data & Analytics',
        test: (s) =>
          /(data analysis|sql|a\/b test|experimentation|analytics|metrics|business intelligence|tableau|power bi|mixpanel|amplitude)/i.test(s),
      },
      {
        id: 'design_ux',
        category: 'Design & UX',
        test: (s) =>
          /(ui\/ux|ux\/ui|design principles|user research|wirefram|prototyp|figma|usability|design thinking|information architecture)/i.test(s),
      },
      {
        id: 'leadership',
        category: 'Leadership',
        test: (s) =>
          /(cross-functional leadership|leadership|team management|stakeholder management|mentoring|strategic planning|people management)/i.test(s),
      },
      {
        id: 'languages_prog',
        category: 'Languages',
        test: (s) =>
          /^(javascript|typescript|python|java|c\+\+|c#|c|sql|go|golang|rust|ruby|php|swift|kotlin|r|scala|dart|html|html5|css|css3|sass|scss|bash|shell|powershell|perl|matlab)$/i.test(s),
      },
      {
        id: 'frameworks',
        category: 'Frameworks',
        test: (s) =>
          /^(react|react\.js|react native|angular|angularjs|vue|vue\.js|node\.js|node|express|express\.js|spring|spring boot|django|flask|fastapi|next\.js|nuxt\.js|svelte|asp\.net|laravel|ruby on rails|rails|tailwind|tailwind css|bootstrap|jquery)$/i.test(s),
      },
      {
        id: 'cloud_infra',
        category: 'Cloud & Infrastructure',
        test: (s) =>
          /^(google cloud platform|gcp|aws|amazon web services|azure|microsoft azure|firebase|docker swarm|terraform|cloud computing|cloudflare|heroku|digitalocean|openstack|ansible)$/i.test(s),
      },
      {
        id: 'tools',
        category: 'Tools',
        test: (s) =>
          /^(git|docker|jenkins|kubernetes|k8s|webpack|babel|vite|npm|yarn|pnpm|jira|confluence|postman|insomnia|github|gitlab|bitbucket|vs code|visual studio|figma)$/i.test(s),
      },
      {
        id: 'languages_spoken',
        category: 'Languages',
        test: (s) =>
          /^(english|spanish|french|german|mandarin|chinese|japanese|russian|portuguese|arabic|hindi|italian|korean)$/i.test(s),
      },
    ];

    const buckets: { [id: string]: string[] } = {};
    const unassigned: string[] = [];

    for (const skill of skillsList) {
      const trimmed = skill.trim();
      let matched = false;
      for (const cat of KNOWN_CATEGORIES) {
        if (cat.test(trimmed.toLowerCase())) {
          if (!buckets[cat.id]) buckets[cat.id] = [];
          buckets[cat.id].push(trimmed);
          matched = true;
          break;
        }
      }
      if (!matched) {
        unassigned.push(trimmed);
      }
    }

    const result: { category: string; skills: string }[] = [];
    for (const cat of KNOWN_CATEGORIES) {
      if (buckets[cat.id] && buckets[cat.id].length > 0) {
        result.push({
          category: cat.category,
          skills: buckets[cat.id].join(', '),
        });
      }
    }

    if (unassigned.length > 0) {
      if (result.length > 0) {
        result.push({
          category: 'Key Competencies',
          skills: unassigned.join(', '),
        });
      } else {
        result.push({
          category: 'Key Competencies',
          skills: unassigned.join(', '),
        });
      }
    }

    return result;
  };

  const renderSkillsBlock = (title: string, skillsStr: string) => {
    if (!skillsStr || !skillsStr.trim()) return null;
    const categorized = categorizeSkillsString(skillsStr);
    if (categorized.length === 0) return null;

    return (
      <section className="skills-section break-inside-avoid" style={sectionStyle}>
        {renderSectionHeader(title)}
        {renderCoreCompetenciesGrid(categorized, 'skills')}
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

  /** Education: **School**, Degree, Dates on one line, then coursework & description bullets. */
  const renderEducationBlock = (title: string, items: Education[], basePath: string = 'education') => {
    if (!items || items.length === 0) return null;
    return (
      <section style={sectionStyle}>
        {renderSectionHeader(title)}
        {items.map((edu, index) => {
          if (!edu.school && !edu.degree && !edu.year) return null;
          const formattedYear = formatDate(edu.year) || edu.year;
          const courseItems = (Array.isArray(edu.relevantCourses)
            ? edu.relevantCourses
            : typeof edu.relevantCourses === 'string'
              ? edu.relevantCourses.split('\n')
              : []
          )
            .map(c => c.replace(/^[•\-\*]\s*/, '').replace(/^(?:Relevant\s+Coursework|Relevant\s+Courses?):\s*/i, '').trim())
            .filter(Boolean);
          const bullets = parseDescriptionBullets(edu.description);
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
              {(courseItems.length > 0 || bullets.length > 0) && (
                <ul className="list-disc list-outside ml-5 space-y-0.5" style={{ marginTop: BULLET_TOP }}>
                  {courseItems.map((course, i) => (
                    <li key={`rc-${i}`} data-path={`${basePath}.${index}.relevantCourses.${i}`}>
                      <RichText text={course} />
                    </li>
                  ))}
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
    if (resolved.type === 'skills' || resolved.id === 'skills') {
      const isDefaultSkills =
        !resolved.title ||
        resolved.title === 'Technical Skills' ||
        resolved.title === 'Skills' ||
        resolved.title === t.technicalSkills;
      sectionTitle = isDefaultSkills ? 'Core Competencies' : resolved.title;
    }
    if (resolved.type === 'experience') sectionTitle = t.experienceTitle || resolved.title;
    if (resolved.type === 'education') sectionTitle = t.educationTitle || resolved.title;
    if (resolved.type === 'certifications') sectionTitle = t.certifications || resolved.title;

    switch (resolved.rendererKind) {
      case 'text':
        return renderTextBlock(sectionTitle, resolved.content as string, resolved.id);
      case 'skills':
        return renderSkillsBlock(sectionTitle, resolved.content as string);
      case 'expert_skills': {
        return null;
      }
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
        fontFamily: data.font || '"Times New Roman", Times, Georgia, serif',
        lineHeight: data.lineHeight || 1.45,
        fontSize: `${bodyPt}pt`,
      }}
    >
      {/* ── Header: name, contact line, thick horizontal rule ── */}
      <header className="break-inside-avoid w-full" style={{ width: '100%' }}>
        <h1
          data-path="fullName"
          className={`font-bold tracking-normal w-full ${getTextAlignment()}`}
          style={{
            fontSize: `${fontSizes?.header || 16}pt`,
            marginBottom: NAME_TO_CONTACT,
            lineHeight: 1.15,
            width: '100%',
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
          if (data.github) {
            contactItems.push(
              <a
                key="gh"
                data-path="github"
                href={getGitHubHref(data.github)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'inherit' }}
              >
                <RichText text={formatGitHubDisplay(data.github)} />
              </a>
            );
          }
          if (data.portfolio) {
            contactItems.push(
              <a
                key="port"
                data-path="portfolio"
                href={getPortfolioHref(data.portfolio)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'inherit' }}
              >
                <RichText text={formatPortfolioDisplay(data.portfolio)} />
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
              className={`flex flex-wrap items-center w-full mx-auto gap-x-1.5 gap-y-1 text-gray-800 ${getTextAlignment()} ${data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center'
                }`}
              style={{ ...bodyStyle, width: '100%' }}
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

        {/* ── Horizontal Line Under Contact (Thick 2.5px solid rule) ── */}
        <hr
          data-contact-rule
          className="w-full border-0 break-inside-avoid"
          style={{
            border: 'none',
            borderTop: `2.5px solid ${accentColor || '#000000'}`,
            width: '100%',
            marginTop: CONTACT_TO_RULE,
            marginBottom: '0.14in',
          }}
        />
      </header>

      {/* ── Job title heading (no underline) + justified summary ── */}
      {showTitleBlock && (
        <section
          className="break-inside-avoid w-full"
          style={{ marginBottom: `${getSectionGapIn(data)}in`, width: '100%' }}
        >
          {data.jobTitle ? (
            <h2
              data-path="jobTitle"
              className={`font-bold leading-normal text-center w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                color: accentColor,
                marginBottom: '0.08in',
                width: '100%',
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
