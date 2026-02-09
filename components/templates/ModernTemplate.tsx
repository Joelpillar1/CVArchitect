import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets, parseAchievementBullets } from '../../utils/templateUtils';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const accentColor = data.accentColor || '#000000';

  const t = getTranslation(data.language as Language || 'en');

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              {t.professionalSummary}
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              {t.technicalSkills}
            </h2>
            <div className={`grid gap-2 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {data.skills.split(',').map((skill, i) => (
                <div key={i} className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-sm text-center">
                  {skill.trim()}
                </div>
              ))}
            </div>
          </section>
        );

      case 'experience':
        return data.experience.length > 0 && (
          <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`font-bold tracking-wider border-b-2 border-gray-300 pb-2 mb-6 break-inside-avoid ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              {t.experienceTitle}
            </h2>

            {data.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="mb-4 break-inside-avoid"
                style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${data.sectionGap || 0.14}in` }}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{exp.company}</h3>
                  <span className="text-gray-500 italic" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-3" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                  {exp.role}
                  {exp.location && (
                    <span className="text-gray-500 font-normal"> • {exp.location}</span>
                  )}
                </p>
                <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                  {parseDescriptionBullets(exp.description).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-6 break-inside-avoid ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              Projects
            </h2>

            {data.projects.map((project) => (
              <div key={project.id} className="mb-4 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {project.name}
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-500 text-sm hover:underline">
                        Link
                      </a>
                    )}
                  </h3>
                </div>
                {project.technologies && (
                  <p className="text-sm text-gray-500 italic mb-2">
                    {project.technologies}
                  </p>
                )}
                <p className="text-gray-700 whitespace-pre-line text-justify">
                  {project.description}
                </p>
              </div>
            ))}
          </section>
        );

      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              Key Achievements
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
              {achievements.map((line, i) => (
                line.trim() && (
                  <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                )
              ))}
            </ul>
          </section>
        );
      }

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              {t.certifications}
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="text-gray-700">
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.date && <span className="text-gray-500 text-sm"> ({cert.date})</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              {t.educationTitle}
            </h2>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between">
                  <span className="font-bold">{edu.school}</span>
                  <span className="italic text-gray-500" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{edu.year}</span>
                </div>
                <p className="text-gray-700">{edu.degree}</p>
              </div>
            ))}
          </section>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
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
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`text-xl font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-2 mb-4 ${getSectionHeaderAlignment()}`}
              style={{ fontSize: `${fontSizes?.sectionTitle || 20}pt`, color: accentColor }}
            >
              References
            </h2>
            <p
              className="leading-relaxed text-gray-700 whitespace-pre-line"
              style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
            >
              {data.referee}
            </p>
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
      <header className={`border-b-2 border-gray-300 pb-4 break-inside-avoid ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
        <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900" style={{ marginBottom: `${data.headerItemGap || 0.08}in`, color: accentColor }}>{data.fullName}</h1>
        <p className="font-medium text-gray-600 tracking-wider" style={{ fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.jobTitle}</p>
        <div className={`flex flex-wrap gap-2 text-sm text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {data.address && (
            <>
              <span>{data.address}</span>
              {(data.phone || data.email || data.linkedin) && <span className="text-gray-300 mx-1">|</span>}
            </>
          )}

          {data.phone && (
            <>
              <span>{data.phone}</span>
              {(data.email || data.linkedin) && <span className="text-gray-300 mx-1">|</span>}
            </>
          )}

          {data.email && (
            <>
              <a
                href={`mailto:${data.email}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {data.email}
              </a>
              {data.linkedin && <span className="text-gray-300 mx-1">|</span>}
            </>
          )}

          {data.linkedin && (
            <a
              href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {data.linkedin.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      {/* Dynamic Sections */}
      {(data.sectionOrder || ['summary', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}