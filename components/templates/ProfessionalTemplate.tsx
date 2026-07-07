import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, CONTACT_SEPARATOR, formatJobTitleDisplay} from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const t = getTranslation(data.language as Language || 'en');

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              {t.professionalSummary || 'PROFESSIONAL SUMMARY'}
            </h2>
            <p
              className="text-justify  text-black"
              style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
            >
              {data.summary}
            </p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              SKILLS AND INTERESTS
            </h2>
            <div className="text-black" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
              <div className="mb-1">
                <span className="font-bold">Language: </span>
                <span>{(typeof data.skills === 'string' ? data.skills.split(',') : []).slice(0, 3).map(s => s.trim()).join(', ')}</span>
              </div>
              <div className="mb-1">
                <span className="font-bold">Computer: </span>
                <span>{(typeof data.skills === 'string' ? data.skills.split(',') : []).slice(3, 6).map(s => s.trim()).join(', ')}</span>
              </div>
              <div>
                <span className="font-bold">Interests: </span>
                <span>{(typeof data.skills === 'string' ? data.skills.split(',') : []).slice(6).map(s => s.trim()).join(', ') || 'Professional development, Industry trends'}</span>
              </div>
            </div>
          </section>
        );

      case 'keyAchievements':
      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              KEY ACHIEVEMENTS
            </h2>
            <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
              {achievements.map((line, i) => (
                line.trim() ? (
                  <div key={i} className="mb-1 relative pl-2">
                    <span className="absolute left-[-0.5rem]">•</span>
                    {line.replace(/^[•-]\s*/, '')}
                  </div>
                ) : null
              ))}
            </div>
          </section>
        );
      }

      case 'experience':
        return data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2 break-inside-avoid  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              {t.experienceTitle || 'EXPERIENCE'}
            </h2>
            <div className="mb-4">
              {data.experience.map((exp, index) => {
                const desc = descriptionToString(exp.description);
                const bullets = parseDescriptionBullets(exp.description);
                return (
                  <div
                    key={exp.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                  >
                    {/* Company Name (bold, left) and Location (regular, right) */}
                    <div className="flex justify-between items-center mb-0">
                      <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.company}</h3>
                      {exp.location && (
                        <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.location}</span>
                      )}
                    </div>
                    {/* Job Title (italic, left) and Dates (regular, right) */}
                    <div className="flex justify-between items-center mb-1">
                      <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.role}</p>
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    {/* Bullet points */}
                    {bullets.length > 0 && (
                      <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {bullets.map((bullet, i) => (
                          bullet.trim() ? (
                            <div key={i} className="mb-0.5 relative pl-2">
                              <span className="absolute left-[-0.5rem]">•</span>
                              {bullet.replace(/^[•-]\s*/, '')}
                            </div>
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'education':
        return data.education.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  {/* University Name (bold, left) - location can be added to school name if needed */}
                  <div className="flex justify-between items-center mb-0">
                    <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.school}</h3>
                  </div>
                  {/* Degree (italic, left) and Date (regular, right) */}
                  <div className="flex justify-between items-center mb-1">
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                      {edu.degree}
                    </p>
                    {edu.year && (
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {typeof edu.year === 'string' && (edu.year.includes('Expected') || edu.year.includes('May') || edu.year.includes('20')) ? edu.year : `Expected ${edu.year || ''}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'leadership':
        return data.leadership && data.leadership.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              LEADERSHIP
            </h2>
            <div className="space-y-4">
              {data.leadership.map((exp) => {
                const bullets = parseDescriptionBullets(exp.description);
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    {/* Company Name (bold, left) and Location (regular, right) */}
                    <div className="flex justify-between items-center mb-0">
                      <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.company}</h3>
                      {exp.location && (
                        <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.location}</span>
                      )}
                    </div>
                    {/* Job Title (italic, left) and Dates (regular, right) */}
                    <div className="flex justify-between items-center mb-1">
                      <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.role}</p>
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    {/* Bullet points */}
                    {bullets.length > 0 && (
                      <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {bullets.map((bullet, i) => (
                          bullet.trim() ? (
                            <div key={i} className="mb-0.5 relative pl-2">
                              <span className="absolute left-[-0.5rem]">•</span>
                              {bullet.replace(/^[•-]\s*/, '')}
                            </div>
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              CERTIFICATIONS
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{cert.name}</span>
                    {cert.date && (
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{cert.date}</span>
                    )}
                  </div>
                  {cert.issuer && (
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className={`text-base font-bold uppercase underline mb-2  text-black ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000"}}
            >
              PROJECTS
            </h2>
            <div className="space-y-2">
              {data.projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center mb-0">
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                      {project.name}
                      {project.link && typeof project.link === 'string' && (
                        <a 
                          href={project.link.startsWith('http') ? project.link : `https://${project.link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ml-2 not-italic underline text-black"
                        >
                          {project.link}
                        </a>
                      )}
                    </p>
                  </div>
                  {project.description && (
                    <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                      <div className="relative pl-2">
                        <span className="absolute left-[-0.5rem]">•</span>
                        {project.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const sectionOrder = data.sectionOrder || [
    'summary',
    'experience',
    'leadership',
    'education',
    'skills',
    'certifications',
    'projects',
    'achievements'
  ];

  const uniqueSectionOrder = getNormalizedSectionOrder(sectionOrder, [
    'summary',
    'experience',
    'leadership',
    'education',
    'skills',
    'certifications',
    'projects',
    'achievements'
  ]);

  return (
    <div
      className="w-full bg-white text-black"
      style={{
        fontFamily: data.font ||"Arial, Helvetica, sans-serif",
        fontSize: `${fontSizes?.body || 9.5}pt`,
        
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
      }}
    >
      {/* Header - Name, Professional Title, Contact */}
      <div className="text-center" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          className="font-bold text-black"
          style={{ marginBottom: `${getHeaderItemGapIn(data)}in`, 
            fontSize: `${fontSizes?.header || 18}pt`,
            lineHeight: 1.1,
          }}
        >
          {formatNameDisplay(data.fullName, data.headerCase) ||"YOUR NAME"}
        </h1>
        {/* Contact Information (smaller, regular, centered, separated by •) */}
        <div className="text-black" style={{ fontSize: `${fontSizes?.body || 9.5}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
          {(() => {
            const items: React.ReactNode[] = [];
            if (data.location || data.address) items.push(<span key="location">{formatContactText(data.location || data.address)}</span>);
            if (data.phone) items.push(<span key="phone">{formatContactText(data.phone)}</span>);
            if (data.email) items.push(
              <a key="email" href={`mailto:${formatContactText(data.email)}`} className="text-black no-underline">
                {formatContactText(data.email)}
              </a>
            );
            if (data.linkedin) items.push(
              <a key="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-black no-underline">
                {formatLinkedInDisplay(data.linkedin)}
              </a>
            );
            return items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-1">{CONTACT_SEPARATOR}</span>}
                {item}
              </React.Fragment>
            ));
          })()}
        </div>
        {/* Professional Title */}
        {data.jobTitle && (
          <p
            className="font-semibold"
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: data.accentColor || '#000000',
            }}
          >
            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
          </p>
        )}
      </div>

      {/* Dynamic Content */}
      {uniqueSectionOrder.map(section => renderSection(section))}
    </div>
  );
}
