import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets } from '../../utils/templateUtils';

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const getSectionHeaderClass = () => {
    const base = "font-black text-gray-900 uppercase tracking-[0.2em] mb-4";
    if (data.bodyHeaderAlignment === 'center') return `${base} text-center border-b-2 pb-2`;
    if (data.bodyHeaderAlignment === 'right') return `${base} text-right border-r-4 pr-3`;
    return `${base} border-l-4 pl-3`;
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

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.technicalSkills}</h2>
            <div className={`grid gap-y-2 gap-x-4 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {data.skills.split(',').map((skill, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-gray-300 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 block"></span>
                  <span className="text-sm font-medium">{skill.trim()}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        return data.keyAchievements && data.keyAchievements.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>Key Achievements</h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              {data.keyAchievements.split('\n').map((line, i) => (
                line.trim() && (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gray-800"></span>
                    <div className="flex-1">{line.replace(/^[\s•\-\*]+/, '')}</div>
                  </div>
                )
              ))}
            </div>
          </section>
        );

      case 'experience':
        return data.experience.length > 0 && (
          <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2 className={`${getSectionHeaderClass()} break-inside-avoid`} style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: data.accentColor || '#000000' }}>{t.experienceTitle}</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative break-inside-avoid">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-sm font-bold text-gray-500">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="font-bold uppercase tracking-wider text-sm mb-4" style={{ color: data.accentColor || '#000000' }}>
                    {exp.company}
                    {exp.location && <span className="text-gray-500 normal-case tracking-normal"> • {exp.location}</span>}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700">
                    {parseDescriptionBullets(exp.description).map((line, i) => (
                      <li key={i}>{line}</li>
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
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.name}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-gray-500 text-sm hover:underline normal-case">
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
                  <div className="font-bold text-gray-900 text-lg">{cert.name}</div>
                  {cert.issuer && <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{cert.issuer}</div>}
                  {cert.date && <div className="text-gray-400 text-sm mt-2">{cert.date}</div>}
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
                  <div className="font-bold text-gray-900 text-lg">{edu.school}</div>
                  <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{edu.degree}</div>
                  <div className="text-gray-400 text-sm mt-2">{edu.year}</div>
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
      <div className={`border-b-4 border-gray-900 pb-6 break-inside-avoid ${data.headerAlignment === 'center' ? 'flex flex-col items-center text-center' : data.headerAlignment === 'right' ? 'flex flex-col items-end text-right' : 'flex justify-between items-end'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
        <div>
          <h1 className="font-extrabold tracking-tight text-gray-900 uppercase" style={{ fontSize: `${fontSizes?.header || 36}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.fullName.split(' ')[0]} <span className="text-gray-400">{data.fullName.split(' ').slice(1).join(' ')}</span></h1>
          <p className="font-bold tracking-wide" style={{ fontSize: `${fontSizes?.jobTitle || 14}pt`, color: data.accentColor || '#000000', marginBottom: `${data.headerItemGap || 0.08}in` }}>{data.jobTitle}</p>
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
      {(data.sectionOrder || ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}