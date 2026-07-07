import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets, parseAchievementBullets, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';

export default function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;

  const getSectionHeaderClass = () => {
    const base ="font-black text-gray-900 uppercase tracking-[0.2em] leading-tight mb-4";
    if (data.bodyHeaderAlignment === 'center') return `${base} text-center border-b pb-0.5`;
    if (data.bodyHeaderAlignment === 'right') return `${base} text-right border-r-2 pr-3`;
    return `${base} border-l-2 pl-3`;
  };

  const t = getTranslation(data.language as Language || 'en');

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>{t.professionalSummary}</h2>
            <p className="text-gray-700  text-justify" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{data.summary}</p>
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
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>{t.technicalSkills}</h2>
            <div className={`grid gap-x-6 ${columnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {skillColumns.map((column, colIndex) => (
                <ul key={colIndex} className="list-disc ml-5 space-y-2 text-gray-700">
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

      case 'keyAchievements':
      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>Key Achievements</h2>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
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
          <div style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={`${getSectionHeaderClass()} break-inside-avoid`} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>{t.experienceTitle}</h2>
            <div>
              {data.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="relative break-inside-avoid"
                  style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{exp.role}</h3>
                    <span className="font-bold text-gray-500" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mb-4 text-gray-600 italic" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                    <span className="font-semibold">{exp.company}</span>
                    {exp.location && <span> • {exp.location}</span>}
                  </div>
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
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
          <div style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={`${getSectionHeaderClass()} break-inside-avoid`} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>Projects</h2>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="relative break-inside-avoid">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
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
                  <div className="text-gray-700  space-y-2">
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
          <section className="break-inside-avoid mt-8" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>{t.certifications}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{cert.name}</div>
                  {cert.issuer && <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{cert.issuer}</div>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>{t.educationTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.education.map(edu => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.school}</div>
                  <div className="font-medium" style={{ color: data.accentColor || '#000000' }}>{edu.degree}</div>
                  <div className="text-gray-400 mt-2" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2 className={getSectionHeaderClass()} style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}>Additional Information</h2>
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
          <section className="break-inside-avoid mt-8" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={getSectionHeaderClass()}
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, borderColor: data.accentColor || '#000000' }}
            >
              References
            </h2>
            <div
              className="text-gray-700  whitespace-pre-line pl-3"
              style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}
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
        lineHeight: data.lineHeight || 1.7,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      <div
        className="break-inside-avoid"
        style={{ marginBottom: `${getHeaderGapIn(data)}in` }}
      >
        <div className={`${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`}>
          <h1
            className="font-extrabold text-gray-900"
            style={{ fontSize: `${fontSizes?.header || 18}pt`, marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1, color: data.accentColor || '#1a1a2e' }}
          >
            {formatNameDisplay(data.fullName, data.headerCase)}
          </h1>
        </div>
        <div
          className={`flex flex-wrap gap-x-4 gap-y-1 text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}
          style={{ fontSize: `${fontSizes?.body || 9.5}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
        >
          {data.location && <span>{formatContactText(data.location)}</span>}
          {data.email && (
            <a href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {formatContactText(data.email)}
            </a>
          )}
          {data.phone && <span>{formatContactText(data.phone)}</span>}
          {data.linkedin && (
            <a
              href={getLinkedInHref(data.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {formatLinkedInDisplay(data.linkedin)}
            </a>
          )}
        </div>
        <p
          className={`font-semibold text-gray-900 ${data.headerAlignment === 'center' ? 'text-center' : data.headerAlignment === 'right' ? 'text-right' : 'text-left'}`}
          style={{ fontSize: `${fontSizes?.jobTitle || 11}pt` }}
        >
          {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
        </p>
      </div>

      {/* Dynamic Sections */}
      {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'skills', 'achievements', 'experience', 'projects', 'certifications', 'education', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}