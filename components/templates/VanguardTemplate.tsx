import React from 'react';
import { ResumeData } from '../../types';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

import { formatDate, parseDescriptionBullets, parseAchievementBullets, getNormalizedSectionOrder, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';

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
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.professionalSummary}
            </h2>
            <p className="text-justify" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{data.summary}</p>
          </section>
        );

      case 'skills':
        return data.skills && data.skills.trim() && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.technicalSkills}
            </h2>
            <div className={`grid gap-x-8 ${columnCount === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {skillColumns.map((col, i) => (
                <ul key={i} className="list-disc list-outside ml-5 space-y-1">
                  {col.map((skill, j) => <li key={j}>{skill}</li>)}
                </ul>
              ))}
            </div>
          </section>
        );

      case 'keyAchievements':
      case 'achievements': {
        const achievements = parseAchievementBullets(data.keyAchievements || '');
        return achievements.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              Key Achievements
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {achievements.map((line, i) => (
                line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
              ))}
            </ul>
          </section>
        );
      }

      case 'experience':
        return data.experience.length > 0 && (
          <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold uppercase tracking-widest border-b leading-tight pb-0.5 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.experienceTitle}
            </h2>
            {data.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="w-full break-inside-avoid"
                style={{ marginBottom: index === data.experience.length - 1 ? 0 : `${getSectionGapIn(data)}in` }}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                    {exp.role} <span className="font-normal italic text-gray-700">- {exp.company}</span>{exp.location && <span className="font-normal italic text-gray-600">, {exp.location}</span>}
                  </div>
                  <span className="text-gray-500 font-medium italic shrink-0 ml-4" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
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
          <section style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold uppercase tracking-widest border-b leading-tight pb-0.5 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              Projects
            </h2>
            {data.projects.map(project => (
              <div key={project.id} className="w-full break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
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
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold uppercase tracking-widest border-b leading-tight pb-0.5 mb-4 break-inside-avoid w-full ${getSectionHeaderAlignment()}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.educationTitle}
            </h2>
            {data.education.map(edu => (
              <div key={edu.id} className="break-inside-avoid w-full" style={{ marginBottom: `${(getSectionGapIn(data)) * 0.7}in` }}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.degree}</h3>
                    <p className="italic text-gray-600" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.school}</p>
                  </div>
                  <span className="text-gray-500 font-medium" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>{edu.year}</span>
                </div>
              </div>
            ))}
          </section>
        );

      case 'certifications':
        return data.certifications && data.certifications.length > 0 && (
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                borderColor: data.accentColor || '#000000',
                color: data.accentColor || '#000000'
              }}
            >
              {t.certifications}
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1">
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
          <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
            <h2
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
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
              className={`section-header font-bold tracking-widest border-b leading-tight pb-0.5 mb-3 ${getSectionHeaderAlignment()} ${data.sectionHeaderCase || 'uppercase'}`}
              style={{
                fontSize: `${fontSizes?.sectionTitle || 11}pt`,
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
        lineHeight: data.lineHeight || 1.7,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
      }}
    >
      {/* Header */}
      <header className={`break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          className={`font-bold leading-none ${data.headerCase === 'uppercase' ? 'uppercase' : data.headerCase === 'lowercase' ? 'lowercase' : ''}`}
          style={{
            fontSize: `${fontSizes?.header || 18}pt`,
            color: data.accentColor || '#000000',
            marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1,
          }}
        >
          {formatNameDisplay(data.fullName, data.headerCase)}
        </h1>

        {/* Contact Info */}
        <section
          className={`flex flex-wrap items-center gap-2 break-inside-avoid text-gray-700 ${data.headerAlignment === 'left' ? 'justify-start text-left' : data.headerAlignment === 'right' ? 'justify-end text-right' : 'justify-center text-center'}`}
          style={{ fontSize: `${fontSizes?.body || 9.5}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
        >
          {data.address && (
            <>
              <div className="flex items-center gap-1">
                <MapPin size={12} color={data.accentColor || '#000000'} />
                <span>{formatContactText(data.address)}</span>
              </div>
              <span className="text-gray-400">|</span>
            </>
          )}
          {data.phone && (
            <>
              <div className="flex items-center gap-1">
                <Phone size={12} color={data.accentColor || '#000000'} />
                <span>{formatContactText(data.phone)}</span>
              </div>
              <span className="text-gray-400">|</span>
            </>
          )}
          {data.email && (
            <>
              <div className="flex items-center gap-1">
                <Mail size={12} color={data.accentColor || '#000000'} />
                <a href={`mailto:${formatContactText(data.email)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {formatContactText(data.email)}
                </a>
              </div>
              <span className="text-gray-400">|</span>
            </>
          )}
          {data.linkedin && (
            <>
              <div className="flex items-center gap-1">
                <Linkedin size={12} color={data.accentColor || '#000000'} />
                <a href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {formatLinkedInDisplay(data.linkedin)}
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

        <p style={{ fontSize: `${fontSizes?.jobTitle || 11}pt`, color: data.accentColor || '#000000' }}>
          {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
        </p>
      </header>

      <hr className="border-t" style={{ borderColor: data.accentColor || '#000000', marginBottom: `${getSectionGapIn(data)}in` }} />

      {/* Dynamic Sections */}
      {getNormalizedSectionOrder(data.sectionOrder, ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'additionalInfo', 'references']).map(id => (
        <React.Fragment key={id}>
          {renderSection(id)}
        </React.Fragment>
      ))}
    </div>
  );
}