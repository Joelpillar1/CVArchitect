import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, descriptionToString, parseAchievementBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';
import { Phone, Mail, MapPin, Linkedin } from 'lucide-react';

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

export default function TwoColumnTemplate({ data }: { data: ResumeData }) {
  const { fontSizes } = data;
  const t = getTranslation(data.language as Language || 'en');

  return (
    <div
      className="w-full bg-white text-black relative"
      style={{
        fontFamily: data.font || "Arial, Helvetica, sans-serif",
        fontSize: `${fontSizes?.body || 10}pt`,
        lineHeight: 1.4,
        paddingTop: `${data.margins?.vertical || 0.5}in`,
        paddingBottom: `${data.margins?.vertical || 0.5}in`,
        paddingLeft: `${data.margins?.horizontal || 0.5}in`,
        paddingRight: `${data.margins?.horizontal || 0.5}in`,
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {/* Subtle pink vertical borders */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-pink-300 opacity-40"></div>
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-pink-300 opacity-40"></div>

      {/* Header - Full Width, Centered */}
      <header className="text-center mb-6 break-inside-avoid pb-4 border-b border-gray-300">
        <h1
          className="font-bold uppercase text-black mb-1"
          style={{
            fontSize: `${fontSizes?.header || 28}pt`,
          }}
        >
          {data.fullName || "YOUR NAME"}
        </h1>
        <p
          className="text-black mb-3"
          style={{
            fontSize: `${fontSizes?.jobTitle || fontSizes?.body || 10}pt`,
          }}
        >
          {data.jobTitle || "Title Here"}
        </p>
      </header>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-[35%_65%] gap-6 relative">
        {/* Vertical divider line between columns */}
        <div className="absolute left-[calc(35%+0.75rem)] top-0 bottom-0 w-[1px] bg-gray-300"></div>
        {/* Left Column - Narrow */}
        <div className="space-y-5">
          {/* CONTACT Section */}
          <section className="break-inside-avoid">
            <h2
              className="font-bold uppercase underline mb-2 text-left text-black"
              style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
            >
              CONTACT
            </h2>
            <div className="space-y-1.5 text-black" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-black" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-black" />
                  <a href={`mailto:${data.email}`} className="text-black no-underline">
                    {data.email}
                  </a>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-black" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={12} className="text-black" />
                  <a
                    href={data.linkedin && typeof data.linkedin === 'string' && data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black no-underline"
                  >
                    {data.linkedin && typeof data.linkedin === 'string' ? data.linkedin.replace(/^https?:\/\/(www\.)?/, '') : ''}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* EDUCATION Section */}
          {data.education && data.education.length > 0 && (
            <section className="break-inside-avoid">
              <h2
                className="font-bold uppercase underline mb-2 text-left text-black"
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
              >
                EDUCATION
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <div className="font-bold text-black text-left mb-0.5" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                      {edu.school}
                    </div>
                    <div className="text-black text-left mb-0.5" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                      {edu.degree}
                    </div>
                    {edu.year && (
                      <div className="text-black text-left" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                        {edu.year}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CAREER HIGHLIGHTS Section */}
          {data.keyAchievements && (
            <section className="break-inside-avoid">
              <h2
                className="font-bold uppercase underline mb-2 text-left text-black"
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
              >
                CAREER HIGHLIGHTS
              </h2>
              <div className="space-y-3">
                {(parseAchievementBullets(data.keyAchievements || '') || []).slice(0, 3).map((highlight, i) => {
                  if (!highlight || typeof highlight !== 'string') return null;
                  const text = highlight.replace(/^[•-]\s*/, '');
                  const sentences = text.split('.').filter(s => s.trim());
                  if (sentences.length === 0) return null;
                  return (
                    <div key={i} className="break-inside-avoid">
                      <div className="text-black" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                        <span className="font-bold">Highlight: </span>
                        <span>{sentences[0]?.trim()}.</span>
                      </div>
                      {sentences.slice(1).map((phrase, j) => (
                        <div key={j} className="text-black mt-0.5" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                          {phrase.trim()}.
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* EXPERTISE Section */}
          {data.skills && data.skills.trim() && (
            <section className="break-inside-avoid">
              <h2
                className="font-bold uppercase underline mb-2 text-left text-black"
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
              >
                EXPERTISE
              </h2>
              <div className="space-y-1 text-black" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                {(typeof data.skills === 'string' ? data.skills.split(',') : []).slice(0, 6).map((skill, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-black mt-0.5">•</span>
                    <span>{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Wide */}
        <div className="space-y-5">
          {/* PROFESSIONAL SUMMARY Section */}
          {data.summary && (
            <section className="break-inside-avoid">
              <h2
                className="font-bold uppercase underline mb-2 text-left text-black"
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
              >
                PROFESSIONAL SUMMARY
              </h2>
              <p
                className="text-black text-justify leading-relaxed"
                style={{ fontSize: `${fontSizes?.body || 10}pt` }}
              >
                {data.summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE Section */}
          {data.experience && data.experience.length > 0 && (
            <section className="break-inside-avoid">
              <h2
                className="font-bold uppercase underline mb-2 text-left text-black"
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => {
                  if (!exp) return null;
                  const allLines = (descriptionToString(exp.description) || '').split('\n');
                  const bullets = parseDescriptionBullets(exp.description || '');
                  // Extract non-bullet lines as overview (first 1-2 lines that aren't bullets)
                  const overviewLines = allLines
                    .filter(line => line && line.trim() && !line.trim().startsWith('•') && !line.trim().startsWith('-'))
                    .slice(0, 2);
                  const overview = overviewLines.join(' ');
                  
                  return (
                    <div key={exp.id} className="break-inside-avoid">
                      {/* Company Name - Location */}
                      <div className="font-bold text-black text-left mb-0.5" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                        {exp.company || ''}
                        {exp.location && ` - ${exp.location}`}
                      </div>
                      {/* Job Title, Start Date – End Date */}
                      <div className="italic text-black text-left mb-1.5" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                        {exp.role || ''}, {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                      </div>
                      {/* Overview paragraph (if exists) */}
                      {overview.trim() && (
                        <p
                          className="text-black text-justify mb-2 leading-relaxed"
                          style={{ fontSize: `${fontSizes?.body || 10}pt` }}
                        >
                          {overview}
                        </p>
                      )}
                      {/* Bullet points with hanging indent */}
                      {bullets.length > 0 && (
                        <div className="text-black" style={{ fontSize: `${fontSizes?.body || 10}pt` }}>
                          {bullets.map((bullet, i) => (
                            bullet.trim() ? (
                              <div key={i} className="mb-1 relative pl-4">
                                <span className="absolute left-0">•</span>
                                <span className="block" style={{ paddingLeft: '0.25rem' }}>
                                  {bullet.replace(/^[•-]\s*/, '')}
                                </span>
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
          )}
        </div>
      </div>
    </div>
  );
}
