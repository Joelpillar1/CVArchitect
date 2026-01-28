import React from 'react';
import { ResumeData } from '../../types';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets, parseAchievementBullets } from '../../utils/templateUtils';

export default function VanguardTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation(data.language as Language || 'en');

  // Split skills based on column count
  const columnCount = data.skillsColumnCount || 3;
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(s => s);
  const itemsPerColumn = Math.ceil(skillsList.length / columnCount);
  const skillColumns = [];

  for (let i = 0; i < columnCount; i++) {
    skillColumns.push(skillsList.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
  }

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return data.summary && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.professionalSummary}
            </h2>
            <p className="leading-relaxed text-justify">{data.summary}</p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.technicalSkills}
            </h2>
            <div className={`grid gap-x-8 ${columnCount === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {skillColumns.map((col, i) => (
                <ul key={i} className="list-disc list-outside ml-4 space-y-1">
                  {col.map((skill, j) => <li key={j}>{skill}</li>)}
                </ul>
              ))}
            </div>
          </section>
        );

      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              Key Achievements
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1">
              {achievements.map((line, i) => (
                line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
              ))}
            </ul>
          </section>
        );
      }

      case 'experience':
        return data.experience.length > 0 && (
          <section style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.experienceTitle}
            </h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="w-full break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                    {exp.role} <span className="font-normal italic text-gray-700">- {exp.company}</span>{exp.location && <span className="font-normal italic text-gray-600">, {exp.location}</span>}
                  </div>
                  <span className="text-gray-500 font-medium italic shrink-0 ml-4" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
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
              className={`section-header font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              Projects
            </h2>
            {data.projects.map(project => (
              <div key={project.id} className="w-full break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-base font-bold">
                    {project.name}
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-600 text-sm hover:underline">
                        Link
                      </a>
                    )}
                  </div>
                </div>
                {project.technologies && (
                  <div className="text-sm text-gray-600 italic mb-1">
                    {project.technologies}
                  </div>
                )}
                <p className="text-gray-700 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            ))}
          </section>
        );

      case 'education':
        return data.education.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold uppercase tracking-widest border-b-2 pb-1 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.educationTitle}
            </h2>
            {data.education.map(edu => (
              <div key={edu.id} className="break-inside-avoid w-full" style={{ marginBottom: `${(data.sectionGap || 0.14) * 0.7}in` }}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold">{edu.degree}</h3>
                    <p className="italic text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-gray-500 font-medium" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>{edu.year}</span>
                </div>
              </div>
            ))}
          </section>
        );

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.certifications}
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1">
              {data.certifications.map((cert) => (
                <li key={cert.id}>
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.date && <span className="text-gray-600 text-sm"> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </section>
        );

      case 'additionalInfo':
        return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
          <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
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
          <section className="break-inside-avoid">
            <h2
              className={`section-header font-bold tracking-widest border-b-2 pb-1 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              References
            </h2>
            <p className="italic text-gray-600 whitespace-pre-line">{data.referee}</p>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="resume-content"
      style={{
        lineHeight: data.lineHeight || 1.4,
        paddingLeft: `${data.margins?.horizontal || 0.39}in`,
        paddingRight: `${data.margins?.horizontal || 0.39}in`,
        paddingTop: `${data.margins?.vertical || 0.45}in`,
        paddingBottom: `${data.margins?.vertical || 0.45}in`,
      }}
    >
      {/* Header */}
      <header className={`break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
        <h1
          className={`font-bold leading-none mb-2 ${data.headerCase || 'uppercase'}`}
          style={{
            fontSize: `${fontSizes?.header || 32}pt`,
            color: data.accentColor || '#000000'
          }}
        >
          {data.fullName}
        </h1>
        <p className="text-gray-600" style={{ fontSize: `${fontSizes?.body || fontSizes?.jobTitle || 10}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}>
          {data.jobTitle}
        </p>
      </header>

      <hr className="border-t-2" style={{ borderColor: data.accentColor || '#000000' }} />

      {/* Contact Info */}
      <section
        className={`flex flex-wrap items-center gap-2 text-xs break-inside-avoid text-gray-700 ${data.headerAlignment === 'left' ? 'justify-start text-left' : data.headerAlignment === 'right' ? 'justify-end text-right' : 'justify-center text-center'}`}
        style={{
          marginTop: `${(data.sectionGap || 0.14) / 2}in`,
          marginBottom: `${(data.sectionGap || 0.14) / 2}in`
        }}
      >
        {data.address && (
          <>
            <div className="flex items-center gap-1">
              <MapPin size={12} color={data.accentColor || '#000000'} />
              <span>{data.address}</span>
            </div>
            <span className="text-gray-400">|</span>
          </>
        )}
        {data.phone && (
          <>
            <div className="flex items-center gap-1">
              <Phone size={12} color={data.accentColor || '#000000'} />
              <span>{data.phone}</span>
            </div>
            <span className="text-gray-400">|</span>
          </>
        )}
        {data.email && (
          <>
            <div className="flex items-center gap-1">
              <Mail size={12} color={data.accentColor || '#000000'} />
              <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {data.email}
              </a>
            </div>
            <span className="text-gray-400">|</span>
          </>
        )}
        {data.linkedin && (
          <>
            <div className="flex items-center gap-1">
              <Linkedin size={12} color={data.accentColor || '#000000'} />
              <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {data.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </>
        )}
        {data.atHandle && (
          <>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1">
              <Send size={12} color={data.accentColor || '#000000'} />
              <span>{data.atHandle}</span>
            </div>
          </>
        )}
      </section>

      <hr className="border-t-2" style={{ borderColor: data.accentColor || '#000000', marginBottom: `${data.sectionGap || 0.14}in` }} />

      {/* Dynamic Sections */}
      {(data.sectionOrder || ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}