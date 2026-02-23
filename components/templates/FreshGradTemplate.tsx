import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';

interface FreshGradTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradTemplate: React.FC<FreshGradTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const bodySize = fontSizes?.body || 10.5;
  const smallSize = bodySize * 0.85;
  const accentColor = data.accentColor || '#000000';

  const renderSectionHeader = (title: string) => (
    <h2
      className="uppercase font-bold tracking-[0.16em] text-xs border-b border-black pb-1 mb-2"
      style={{ color: accentColor, fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.4,
        paddingLeft: `${data.margins?.horizontal || 0.9}in`,
        paddingRight: `${data.margins?.horizontal || 0.9}in`,
        paddingTop: `${data.margins?.vertical || 0.7}in`,
        paddingBottom: `${data.margins?.vertical || 0.7}in`,
        fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
      }}
    >
      {/* Header */}
      <header className="text-center mb-6">
        <h1
          className="font-bold tracking-wide"
          style={{
            fontSize: `${fontSizes?.header || 26}pt`,
            letterSpacing: '0.08em',
          }}
        >
          {data.fullName || 'NAME'}
        </h1>
        <div
          className="mt-1 text-gray-800"
          style={{ fontSize: `${smallSize}pt` }}
        >
          {[
            data.location || data.address,
            data.email,
            data.phone,
            data.linkedin ? data.linkedin.replace(/https?:\/\/(www\.)?/, '') : undefined,
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </header>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-4 break-inside-avoid">
          {renderSectionHeader('Education')}
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                    {edu.school}
                  </div>
                  <div
                    className="text-gray-800"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {edu.year}
                  </div>
                </div>
                {edu.degree && (
                  <div
                    className="italic text-gray-800"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.degree}
                  </div>
                )}
                {edu.gpa && edu.gpa.trim() && (
                  <div
                    className="text-gray-800"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-4 break-inside-avoid">
          {renderSectionHeader('Work Experience')}
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span>, {exp.location}</span>
                    )}
                    {exp.role && (
                      <span className="italic">, {exp.role}</span>
                    )}
                  </div>
                  <div
                    className="text-gray-800"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {formatMonthYear(exp.startDate)}{' '}
                    – {formatMonthYear(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(exp.description).map((line, i) =>
                      line.trim() ? (
                        <li key={i}>
                          {line.replace(/^[•-]\s*/, '')}
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LEADERSHIP */}
      {data.leadership && data.leadership.length > 0 && (
        <section className="mb-4 break-inside-avoid">
          {renderSectionHeader('Leadership')}
          <div className="space-y-3">
            {data.leadership.map((lead) => (
              <div key={lead.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">
                      {lead.company}
                    </span>
                    {lead.role && (
                      <span className="italic">, {lead.role}</span>
                    )}
                  </div>
                  <div
                    className="text-gray-800"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {formatMonthYear(lead.startDate)}{' '}
                    – {formatMonthYear(lead.endDate)}
                  </div>
                </div>
                {lead.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(lead.description).map((line, i) =>
                      line.trim() ? (
                        <li key={i}>
                          {line.replace(/^[•-]\s*/, '')}
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS & INTERESTS */}
      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <section className="break-inside-avoid">
          {renderSectionHeader('Skills & Interests')}
          <div className="space-y-1">
            {data.additionalInfo
              .filter(item => item.label.trim() && item.value.trim())
              .map((item) => (
                <div
                  key={item.id}
                  className="text-gray-900"
                  style={{ fontSize: `${bodySize}pt` }}
                >
                  <span className="italic">
                    {item.label}:
                  </span>{' '}
                  <span>{item.value}</span>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FreshGradTemplate;

