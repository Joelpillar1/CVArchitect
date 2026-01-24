import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const t = getTranslation(data.language as Language || 'en');

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <p className="text-justify leading-relaxed text-black" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{data.summary}</p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              SKILLS AND INTERESTS
            </h2>
            <div className="text-black" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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

      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: '0.5rem' }}>
            <h2
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              KEY ACHIEVEMENTS
            </h2>
            <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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
              className="text-base font-bold uppercase underline mb-2 break-inside-avoid text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              {t.experienceTitle || 'EXPERIENCE'}
            </h2>
            <div className="space-y-4 mb-4">
              {data.experience.map((exp) => {
                const desc = descriptionToString(exp.description);
                const bullets = parseDescriptionBullets(exp.description);
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    {/* Company Name (bold, left) and Location (regular, right) */}
                    <div className="flex justify-between items-center mb-0">
                      <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.company}</h3>
                      {exp.location && (
                        <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.location}</span>
                      )}
                    </div>
                    {/* Job Title (italic, left) and Dates (regular, right) */}
                    <div className="flex justify-between items-center mb-1">
                      <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.role}</p>
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    {/* Bullet points */}
                    {bullets.length > 0 && (
                      <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  {/* University Name (bold, left) - location can be added to school name if needed */}
                  <div className="flex justify-between items-center mb-0">
                    <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.school}</h3>
                  </div>
                  {/* Degree (italic, left) and Date (regular, right) */}
                  <div className="flex justify-between items-center mb-1">
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                      {edu.degree}
                    </p>
                    {edu.year && (
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
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
                      <h3 className="font-bold text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.company}</h3>
                      {exp.location && (
                        <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.location}</span>
                      )}
                    </div>
                    {/* Job Title (italic, left) and Dates (regular, right) */}
                    <div className="flex justify-between items-center mb-1">
                      <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.role}</p>
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    {/* Bullet points */}
                    {bullets.length > 0 && (
                      <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              CERTIFICATIONS
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.name}</span>
                    {cert.date && (
                      <span className="text-black text-right" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.date}</span>
                    )}
                  </div>
                  {cert.issuer && (
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.issuer}</p>
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
              className="text-base font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
            >
              PROJECTS
            </h2>
            <div className="space-y-2">
              {data.projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center mb-0">
                    <p className="italic text-black text-left" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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
                    <div className="text-black pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
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

  // Deduplicate and normalize section order handling aliases
  const uniqueSectionOrder = Array.from(new Set(sectionOrder.map(s =>
    s === 'achievements' ? 'keyAchievements' : s
  )));

  return (
    <div
      className="w-full bg-white text-black"
      style={{
        fontFamily: data.font || "Arial, Helvetica, sans-serif",
        fontSize: `${fontSizes?.body || 10.5}pt`,
        lineHeight: 1.4,
        paddingTop: `${data.margins?.vertical || 0.75}in`,
        paddingBottom: `${data.margins?.vertical || 0.75}in`,
        paddingLeft: `${data.margins?.horizontal || 0.75}in`,
        paddingRight: `${data.margins?.horizontal || 0.75}in`,
      }}
    >
      {/* Header - Name (largest, bold, centered) */}
      <div className="text-center mb-4">
        <h1
          className="font-bold text-black mb-2"
          style={{
            fontSize: `${fontSizes?.header || 24}pt`,
          }}
        >
          {data.fullName || "YOUR NAME"}
        </h1>
        {/* Contact Information (smaller, regular, centered, separated by •) */}
        <div className="text-black" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
          {data.phone && <span>{data.phone}</span>}
          {data.phone && data.email && <span className="mx-1">•</span>}
          {data.email && (
            <a href={`mailto:${data.email}`} className="text-black no-underline">
              {data.email}
            </a>
          )}
        </div>
      </div>

      {/* Dynamic Content */}
      {uniqueSectionOrder.map(section => renderSection(section))}
    </div>
  );
}
