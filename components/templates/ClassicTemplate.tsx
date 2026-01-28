import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function ClassicTemplate({ data }: { data: ResumeData }) {
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
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              {t.professionalSummary}
            </h2>
            <p className="text-justify leading-relaxed text-gray-800" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{data.summary}</p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              {t.technicalSkills}
            </h2>
            <div className={`grid gap-x-8 gap-y-2 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
              {data.skills.split(',').map((skill, i) => (
                <div key={i} className="flex items-start pl-2">
                  <span className="mr-2">•</span>
                  <span className="text-gray-800">{skill.trim()}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              Key Achievements
            </h2>
            <div className="text-gray-800 pl-5" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
              {achievements.map((line, i) => (
                line.trim() ? <div key={i} className="mb-1 relative pl-2">
                  <span className="absolute left-[-1rem]">•</span>
                  {line.replace(/^[•-]\s*/, '')}
                </div> : null
              ))}
            </div>
          </section>
        );
      }

      case 'experience':
        return data.experience.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 break-inside-avoid ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              {t.experienceTitle}
            </h2>
            <div className="space-y-8 mb-8">
              {data.experience.map((exp) => {
                const desc = descriptionToString(exp.description);
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-lg text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.role}</h3>
                      <span className="text-sm font-bold text-gray-600" style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}>
                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </span>
                    </div>
                    <p className="font-semibold italic text-gray-700 mb-3" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                      {exp.company}
                      {exp.location && <span className="not-italic font-normal"> • {exp.location}</span>}
                    </p>
                    <div className="text-gray-800 pl-5" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                      {desc.split('\n').map((line, i) => (
                        line.trim() ? <div key={i} className="mb-1 relative pl-2">
                          <span className="absolute left-[-1rem]">•</span>
                          {line.replace(/^[•-]\s*/, '')}
                        </div> : null
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 break-inside-avoid ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              Projects
            </h2>
            <div className="space-y-8 mb-8">
              {data.projects.map((project) => (
                <div key={project.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                      {project.name}
                      {project.link && (
                        <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-gray-500 text-sm hover:underline">
                          Link
                        </a>
                      )}
                    </h3>
                  </div>
                  {project.technologies && (
                    <p className="font-semibold italic text-gray-700 mb-3" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                      {project.technologies}
                    </p>
                  )}
                  <div className="text-gray-800 pl-5" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                    <div className="mb-1 relative pl-2 whitespace-pre-line">
                      <span className="absolute left-[-1rem]">•</span>
                      {project.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid mt-8" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              {t.certifications}
            </h2>
            <div className="space-y-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="font-bold block text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.name}</span>
                    {cert.issuer && <span className="italic text-gray-700" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="font-bold text-sm text-gray-600" style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}>{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 break-inside-avoid ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              {t.educationTitle}
            </h2>
            <div className="mb-8">
              {data.education.map(edu => (
                <div key={edu.id} className="flex justify-between mb-3 break-inside-avoid">
                  <div>
                    <span className="font-bold block text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.school}</span>
                    <span className="italic text-gray-700" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.degree}</span>
                  </div>
                  <span className="font-bold text-gray-600" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              Additional Information
            </h2>
            <div className="space-y-2">
              {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                <div key={item.id} className="text-gray-700">
                  <span className="font-bold">{item.label}:</span>
                  <span className="ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'references':
        return data.referee && data.referee.trim() && (
          <section className="break-inside-avoid mt-8" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-lg font-bold uppercase border-b-2 border-gray-300 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, color: data.accentColor || '#000000' }}
            >
              References
            </h2>
            <p className="text-justify leading-relaxed text-gray-800 whitespace-pre-line" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{data.referee}</p>
          </section>
        );

      default:
        return null;
    }
  };
  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.4,
        paddingLeft: `${data.margins?.horizontal || 0.39}in`,
        paddingRight: `${data.margins?.horizontal || 0.39}in`,
        paddingTop: `${data.margins?.vertical || 0.45}in`,
        paddingBottom: `${data.margins?.vertical || 0.45}in`,
      }}
    >
      <div className={`border-b-2 border-gray-300 pb-6 break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
        <h1 className="text-5xl font-bold" style={{ fontSize: `${fontSizes?.header || 36}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.fullName}</h1>
        <p className="font-semibold" style={{ fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`, color: data.accentColor || '#000000', marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.jobTitle}</p>
        <div className="text-sm flex flex-wrap items-center justify-center gap-2" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
          {data.address && <span>{data.address}</span>}
          {data.address && (data.phone || data.email || data.linkedin) && (
            <span className="mx-1">•</span>
          )}

          {data.phone && <span>{data.phone}</span>}
          {data.phone && (data.email || data.linkedin) && (
            <span className="mx-1">•</span>
          )}

          {data.email && (
            <>
              <a
                href={`mailto:${data.email}`}
                style={{ textDecoration: 'none', color: data.accentColor || '#000000' }}
              >
                {data.email}
              </a>
              {data.linkedin && <span className="mx-1">•</span>}
            </>
          )}

          {data.linkedin && (
            <a
              href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
              className="text-gray-600"
            >
              {data.linkedin.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {(data.sectionOrder || ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}