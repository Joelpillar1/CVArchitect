import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay, isTitleFirst } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';
import { MapPin, Mail, Phone, Linkedin, Globe } from 'lucide-react';

// CVArchitect Pro palette: slate body/heading text with black emphasis + rules.
const REZI_SLATE = '#2e3d50';
const REZI_INK = '#000000';

// Explicit weight scale so print/PDF export renders identically (no reliance on
// a "light" 300 weight that many fonts don't ship).
const W_BODY = 400;
const W_MEDIUM = 500;
const W_SEMIBOLD = 600;
const W_BOLD = 700;

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ReziTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const bodyPt = fontSizes?.body || 9.5;
  const sectionTitlePt = fontSizes?.sectionTitle || 11;
  // Keep all body copy (bullets, meta lines, contact, section text) at one uniform size.
  const metaPt = bodyPt;
  // Body copy follows the user's line-height control (fallback to the template default).
  const bodyLineHeight = data.lineHeight || 1.6;

  const headingColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : REZI_SLATE;

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const t = getTranslation((data.language as Language) || 'en');

  // Uppercase section title + full-width black underline, matching the Rezi layout.
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div style={{ marginBottom: '0.06in' }}>
      <h2
        className={`uppercase leading-tight ${getSectionHeaderAlignment()}`}
        style={{ fontSize: `${sectionTitlePt}pt`, fontWeight: W_BOLD, color: headingColor, letterSpacing: '0.02em' }}
      >
        {children}
      </h2>
      <hr className="mt-px border-0 border-b" style={{ borderColor: REZI_INK }} />
    </div>
  );

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>{t.professionalSummary}</SectionTitle>
            <p className="whitespace-pre-line" style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
              {data.summary}
            </p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>{t.technicalSkills}</SectionTitle>
            <p style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
              {data.skills.split(',').map(s => s.trim()).filter(Boolean).join(', ')}
            </p>
          </section>
        );

      case 'keyAchievements':
      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>Key Achievements</SectionTitle>
            <ul className="list-disc pl-5" style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
              {achievements.map((line, i) => (
                line.trim() ? <li key={i} className="pl-1 mb-0.5">{line.replace(/^[•-]\s*/, '')}</li> : null
              ))}
            </ul>
          </section>
        );
      }

      case 'experience':
        return data.experience.length > 0 && (
          <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>{t.experienceTitle}</SectionTitle>
            <div className="flex flex-col" style={{ gap: `${getSectionGapIn(data) * 0.7}in` }}>
              {data.experience.map((exp) => {
                const bullets = descriptionToString(exp.description).split('\n').filter(l => l.trim());
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>{exp.role}</div>
                    <div className="flex justify-between gap-2" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, lineHeight: 1.3 }}>
                      <span style={{ fontWeight: W_SEMIBOLD }}>{exp.company}</span>
                      <span className="flex flex-wrap justify-end text-right" style={{ fontWeight: W_BODY }}>
                        {[formatMonthYear(exp.startDate), formatMonthYear(exp.endDate)].filter(Boolean).join(' - ')}
                        {exp.location ? `, ${exp.location}` : ''}
                      </span>
                    </div>
                    {bullets.length > 0 && (
                      <ul className="list-disc pl-5 mt-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
                        {bullets.map((line, i) => (
                          <li key={i} className="pl-1 mb-0.5">{line.replace(/^[•-]\s*/, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>Projects</SectionTitle>
            <div className="flex flex-col" style={{ gap: `${getSectionGapIn(data) * 0.7}in` }}>
              {data.projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <div style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>
                    {project.name}
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 underline"
                        style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}
                      >
                        Link
                      </a>
                    )}
                  </div>
                  {project.technologies && (
                    <div style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_MEDIUM, lineHeight: 1.3 }}>{project.technologies}</div>
                  )}
                  {project.description && (
                    <ul className="list-disc pl-5 mt-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>
                      {parseDescriptionBullets(project.description).map((line, i) => (
                        line.trim() ? <li key={i} className="pl-1 mb-0.5">{line.replace(/^[•-]\s*/, '')}</li> : null
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>{t.educationTitle}</SectionTitle>
            <div className="flex flex-col gap-2">
              {data.education.map(edu => {
                const meta = [edu.school, edu.gpa ? `GPA: ${edu.gpa}` : '', edu.year].filter(Boolean).join('  •  ');
                return (
                  <div key={edu.id} className="break-inside-avoid">
                    <div style={{ fontSize: `${bodyPt}pt`, color: REZI_INK, fontWeight: W_BOLD, lineHeight: 1.3 }}>{edu.degree}</div>
                    {meta && <div style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: 1.3 }}>{meta}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>{t.certifications}</SectionTitle>
            <div className="flex flex-col gap-1">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between gap-2" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}>
                  <span>
                    <span style={{ color: REZI_INK, fontWeight: W_BOLD }}>{cert.name}</span>
                    {cert.issuer && <span>{`  •  ${cert.issuer}`}</span>}
                  </span>
                  {cert.date && <span className="text-right whitespace-nowrap">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>Additional Information</SectionTitle>
            <div className="flex flex-col gap-1" style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY }}>
              {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                <div key={item.id}>
                  <span style={{ color: REZI_INK, fontWeight: W_SEMIBOLD }}>{item.label}:</span>
                  <span className="ml-1">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'references':
        return data.referee && data.referee.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <SectionTitle>References</SectionTitle>
            <p className="whitespace-pre-line" style={{ fontSize: `${bodyPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, lineHeight: bodyLineHeight }}>{data.referee}</p>
          </section>
        );

      default:
        return null;
    }
  };

  const headerAlignClass = data.headerAlignment === 'left' ? 'items-start text-left' : data.headerAlignment === 'right' ? 'items-end text-right' : 'items-center text-center';
  const contactJustify = data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center';

  const titleFirst = isTitleFirst(data, true);

  const jobTitleBlock = data.jobTitle ? (
    <p style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: headingColor, fontWeight: W_SEMIBOLD, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
      {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
    </p>
  ) : null;

  const contactBlock = (
    <div
      className={`flex flex-row flex-wrap items-center gap-x-3 gap-y-1 ${contactJustify}`}
      style={{ fontSize: `${metaPt}pt`, color: REZI_SLATE, fontWeight: W_BODY, marginBottom: `${getHeaderContactGapIn(data)}in` }}
    >
      {(data.location || data.address) && (
        <span className="flex flex-row items-center gap-1">
          <MapPin size="0.9em" style={{ color: REZI_SLATE }} />
          <span>{formatContactText(data.location || data.address || '')}</span>
        </span>
      )}
      {data.email && (
        <span className="flex flex-row items-center gap-1">
          <Mail size="0.9em" style={{ color: REZI_SLATE }} />
          <a href={`mailto:${formatContactText(data.email)}`} style={{ color: REZI_SLATE, textDecoration: 'none' }}>{formatContactText(data.email)}</a>
        </span>
      )}
      {data.phone && (
        <span className="flex flex-row items-center gap-1">
          <Phone size="0.9em" style={{ color: REZI_SLATE }} />
          <span>{formatContactText(data.phone)}</span>
        </span>
      )}
      {data.linkedin && (
        <span className="flex flex-row items-center gap-1">
          <Linkedin size="0.9em" style={{ color: REZI_SLATE }} />
          <a href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: REZI_SLATE, textDecoration: 'none' }}>
            {formatLinkedInDisplay(data.linkedin)}
          </a>
        </span>
      )}
      {data.atHandle && (
        <span className="flex flex-row items-center gap-1">
          <Globe size="0.9em" style={{ color: REZI_SLATE }} />
          <span>{data.atHandle}</span>
        </span>
      )}
    </div>
  );

  return (
    <div
      className="resume-content"
      style={{
        color: REZI_SLATE,
        lineHeight: data.lineHeight || 1.7,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      {/* Header */}
      <header className={`flex flex-col break-inside-avoid ${headerAlignClass}`} style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          style={{ fontSize: `${fontSizes?.header || 18}pt`, color: REZI_INK, fontFamily: 'Merriweather, serif', fontWeight: W_BOLD, lineHeight: 1.2, marginBottom: `${getHeaderItemGapIn(data)}in` }}
        >
          {formatNameDisplay(data.fullName, data.headerCase)}
        </h1>

        {titleFirst ? (<>{jobTitleBlock}{contactBlock}</>) : (<>{contactBlock}{jobTitleBlock}</>)}
      </header>

      {/* Dynamic Sections */}
      {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}
