import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets, parseAchievementBullets } from '../../utils/templateUtils';

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const getSectionHeaderClass = () => {
    const base = "font-black text-gray-900 uppercase tracking-[0.2em] mb-4";
    if (data.bodyHeaderAlignment === 'center') return `${base} text-center border-b pb-2`;
    if (data.bodyHeaderAlignment === 'right') return `${base} text-right border-r-2 pr-3`;
    return `${base} border-l-2 pl-3`;
  };

  const t = getTranslation(data.language as Language || 'en');

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.professionalSummary}</h2>
            <p className="text-gray-700 leading-loose text-justify font-medium">{data.summary}</p>
          </section>
        );

      case 'skills': {
        if (!data.skills || !data.skills.trim()) return null;
        const skillsList = data.skills.split(',').map(s => s.trim()).filter(s => s);
        const columnCount = data.skillsColumnCount === 2 ? 2 : 3;
        const itemsPerColumn = Math.ceil(skillsList.length / columnCount);
        const skillColumns: string[][] = [];
        for (let i = 0; i < columnCount; i++) {
          skillColumns.push(skillsList.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
        }
        return (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.technicalSkills}</h2>
            <div className={`grid gap-x-6 ${columnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {skillColumns.map((column, colIndex) => (
                <ul key={colIndex} className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
                  {column.map((skill, index) => (
                    <li key={index} className="pl-1">
                      {skill}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </section>
        );
      }

      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>Key Achievements</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
              {achievements.map((line, i) => (
                line.trim() && (
                  <li key={i} className="pl-1">
                    {line.replace(/^[\s•\-\*]+/, '')}
                  </li>
                )
              ))}
            </ul>
          </section>
        );
      }

      case 'experience':
        return data.experience.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={`${getSectionHeaderClass()} break-inside-avoid`} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.experienceTitle}</h2>
            <div>
              {data.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="relative break-inside-avoid"
                  style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${data.sectionGap || 0.14}in` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{exp.role}</h3>
                    <span className="font-bold text-gray-500" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mb-4 text-gray-600 italic" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                    <span className="font-semibold">{exp.company}</span>
                    {exp.location && <span> • {exp.location}</span>}
                  </div>
                  <ul className="list-disc list-outside ml-6 space-y-1 text-gray-700" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                    {parseDescriptionBullets(exp.description).map((line, i) => (
                      <li key={i} className="pl-1">{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={`${getSectionHeaderClass()} break-inside-avoid`} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>Projects</h2>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="relative break-inside-avoid">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                      {project.name}
                      {project.link && (
                        <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-gray-500 text-sm hover:underline normal-case">
                          Link
                        </a>
                      )}
                    </h3>
                  </div>
                  {project.technologies && (
                    <div className="font-bold uppercase tracking-wider text-sm mb-2" style={{ color: data.accentColor || '#000000' }}>
                      {project.technologies}
                    </div>
                  )}
                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <div className="flex gap-3">
                      <span className="text-gray-300 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 block"></span>
                      <span className="flex-1 whitespace-pre-line">{project.description}</span>
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
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.certifications}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{cert.name}</div>
                  {cert.issuer && <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{cert.issuer}</div>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.educationTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.education.map(edu => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{edu.school}</div>
                  <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{edu.degree}</div>
                  <div className="text-gray-400 mt-2" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>Additional Information</h2>
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
              className={getSectionHeaderClass()}
              style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}
            >
              References
            </h2>
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line pl-3"
              style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
            >
              {data.referee}
            </div>
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
      <div className={`border-b border-gray-900 pb-6 break-inside-avoid ${data.headerAlignment === 'center' ? 'flex flex-col items-center text-center' : data.headerAlignment === 'right' ? 'flex flex-col items-end text-right' : 'flex justify-between items-end'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
        <div>
          <h1 className="font-extrabold tracking-tight text-gray-900 uppercase" style={{ fontSize: `${fontSizes?.header || 36}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.fullName.split(' ')[0]} <span className="text-gray-400">{data.fullName.split(' ').slice(1).join(' ')}</span></h1>
          <p className="font-bold tracking-wide" style={{ fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`, color: data.accentColor || '#000000', marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.jobTitle}</p>
        </div>
        <div className={`text-sm text-gray-600 font-medium ${data.headerAlignment === 'center' ? 'flex flex-wrap gap-4 justify-center mt-3' : data.headerAlignment === 'right' ? 'text-right space-y-1 mt-3' : 'text-right space-y-1'}`}>
          <p><a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a></p>
          {data.headerAlignment === 'center' && <span className="text-gray-400">•</span>}
          <p>{data.phone}</p>
          {data.linkedin && (
            <>
              {data.headerAlignment === 'center' && <span className="text-gray-400">•</span>}
              <p><a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{data.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></p>
            </>
          )}
          {data.address && (
            <>
              {data.headerAlignment === 'center' && <span className="text-gray-400">•</span>}
              <p>{data.address}</p>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {[...new Set((data.sectionOrder || ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(s => s === 'keyAchievements' ? 'achievements' : s))].map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}