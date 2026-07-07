import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, parseAchievementBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay, isTitleFirst } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';
import { Phone, Mail, MapPin, Linkedin } from 'lucide-react';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function TwoColumnTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const accentColor = data.accentColor || '#1e3a5f';
  const t = getTranslation(data.language as Language || 'en');

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h2
      className={`font-bold uppercase tracking-wider mb-2 pb-0.5 border-b-2 leading-tight ${getSectionHeaderAlignment()}`}
      style={{
        fontSize: `${fontSizes?.sectionTitle || 11}pt`,
        color: accentColor,
        borderColor: accentColor,
      }}
    >
      {title}
    </h2>
  );

  const horizontalMargin = getMarginHorizontalIn(data);
  const verticalMargin = getMarginVerticalIn(data);
  const sectionGap = getSectionGapIn(data);

  return (
    <div
      className="w-full bg-white text-gray-900"
      style={{
        fontFamily: data.font || 'Arial, Helvetica, sans-serif',
        fontSize: `${fontSizes?.body || 9.5}pt`,
        paddingTop: `${verticalMargin}in`,
        paddingBottom: `${verticalMargin}in`,
        paddingLeft: `${horizontalMargin}in`,
        paddingRight: `${horizontalMargin}in`,
        lineHeight: data.lineHeight || 1.7,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      <header
        className="text-center break-inside-avoid border-b-2 pb-4"
        style={{ marginBottom: `${getHeaderGapIn(data)}in`, borderColor: accentColor }}
      >
        <h1
          className="font-bold text-gray-900"
          style={{
            fontSize: `${fontSizes?.header || 18}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1,
          }}
        >
          {formatNameDisplay(data.fullName, data.headerCase) || 'YOUR NAME'}
        </h1>
        {isTitleFirst(data, false) && data.jobTitle && (
          <p
            className="font-semibold"
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: accentColor,
            }}
          >
            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
          </p>
        )}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 text-gray-600 ${data.headerAlignment === 'center' ? 'justify-center' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}
          style={{ fontSize: `${fontSizes?.body || 9.5}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
        >
          {(() => {
            const items: React.ReactNode[] = [];
            if (data.location) items.push(<span key="location">{formatContactText(data.location)}</span>);
            if (data.phone) items.push(<span key="phone">{formatContactText(data.phone)}</span>);
            if (data.email) items.push(
              <a key="email" href={`mailto:${formatContactText(data.email)}`} className="text-gray-900 no-underline break-all">
                {formatContactText(data.email)}
              </a>
            );
            if (data.linkedin) items.push(
              <a
                key="linkedin"
                href={getLinkedInHref(data.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 no-underline break-all"
              >
                {formatLinkedInDisplay(data.linkedin)}
              </a>
            );
            return items.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-300">|</span>}
                {item}
              </React.Fragment>
            ));
          })()}
        </div>
        {!isTitleFirst(data, false) && data.jobTitle && (
          <p
            className="font-semibold"
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: accentColor,
            }}
          >
            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
          </p>
        )}
      </header>

      <div className="grid grid-cols-[32%_68%] gap-5">
        <aside
          className="space-y-4 break-inside-avoid pr-3"
          style={{
            backgroundColor: `${accentColor}0a`,
            padding: '0.12in',
            borderRadius: '2px',
          }}
        >
          <section style={{ marginBottom: `${sectionGap}in` }}>
            <SectionHeader title="Contact" />
            <div className="space-y-1.5" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} style={{ color: accentColor }} />
                  <span>{formatContactText(data.phone)}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail size={12} style={{ color: accentColor }} />
                  <a href={`mailto:${formatContactText(data.email)}`} className="text-gray-900 no-underline break-all">
                    {formatContactText(data.email)}
                  </a>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} style={{ color: accentColor }} />
                  <span>{formatContactText(data.location)}</span>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={12} style={{ color: accentColor }} />
                  <a
                    href={getLinkedInHref(data.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 no-underline break-all"
                  >
                    {formatLinkedInDisplay(data.linkedin)}
                  </a>
                </div>
              )}
            </div>
          </section>

          {data.education && data.education.length > 0 && (
            <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
              <SectionHeader title={t.educationTitle} />
              <div className="space-y-2.5">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                      {edu.school}
                    </div>
                    {edu.degree && (
                      <div className="italic text-gray-700" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}>
                        {edu.degree}
                      </div>
                    )}
                    {edu.year && (
                      <div className="text-gray-600" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt` }}>
                        {edu.year}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.trim() && (
            <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
              <SectionHeader title={t.technicalSkills} />
              <div className="space-y-1">
                {data.skills.split(',').map((skill, i) =>
                  skill.trim() ? (
                    <div key={i} className="flex items-start gap-1.5">
                      <span style={{ color: accentColor }}>•</span>
                      <span>{skill.trim()}</span>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
              <SectionHeader title={t.certifications} />
              <div className="space-y-1.5">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-semibold">{cert.name}</div>
                    {cert.issuer && (
                      <div className="text-gray-600" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt` }}>
                        {cert.issuer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.keyAchievements && parseAchievementBullets(data.keyAchievements).length > 0 && (
            <section className="break-inside-avoid">
              <SectionHeader title="Key Highlights" />
              <ul className="space-y-1.5 list-none">
                {parseAchievementBullets(data.keyAchievements).map((highlight, i) =>
                  highlight.trim() ? (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="shrink-0" style={{ color: accentColor }}>•</span>
                      <span style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.95}pt` }}>
                        {highlight.replace(/^[•-]\s*/, '')}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>
            </section>
          )}
        </aside>

        <main className="space-y-4 pl-1">
          {data.summary && (
            <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
              <SectionHeader title={t.professionalSummary} />
              <p className="text-justify text-gray-800" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                {data.summary}
              </p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section className="break-inside-avoid" style={{ marginBottom: `${sectionGap}in` }}>
              <SectionHeader title={t.experienceTitle} />
              <div className="space-y-3">
                {data.experience.map((exp) => {
                  const bullets = parseDescriptionBullets(exp.description || '');
                  return (
                    <div key={exp.id} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-2 mb-0.5">
                        <div className="font-bold" style={{ fontSize: `${(fontSizes?.body || 9.5) * 1.05}pt` }}>
                          {exp.role}
                        </div>
                        <span className="text-gray-500 shrink-0 italic" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt` }}>
                          {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                        </span>
                      </div>
                      <div className="italic text-gray-700 mb-1" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {exp.company}
                        {exp.location && ` · ${exp.location}`}
                      </div>
                      {bullets.length > 0 && (
                        <ul className="list-disc ml-5 space-y-0.5 text-gray-800">
                          {bullets.map((bullet, i) =>
                            bullet.trim() ? (
                              <li key={i}>{bullet.replace(/^[•-]\s*/, '')}</li>
                            ) : null
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section className="break-inside-avoid">
              <SectionHeader title="Projects" />
              <div className="space-y-2">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <div className="font-bold" style={{ color: accentColor }}>
                      {project.name}
                    </div>
                    {project.technologies && (
                      <div className="text-gray-600 italic mb-0.5" style={{ fontSize: `${(fontSizes?.body || 9.5) * 0.9}pt` }}>
                        {project.technologies}
                      </div>
                    )}
                    {project.description && (
                      <p className="text-gray-800" style={{ fontSize: `${fontSizes?.body || 9.5}pt` }}>
                        {typeof project.description === 'string'
                          ? project.description
                          : project.description.join(' ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
