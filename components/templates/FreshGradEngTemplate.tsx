import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';

interface FreshGradEngTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradEngTemplate: React.FC<FreshGradEngTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const bodySize = fontSizes?.body || 10.5;
  const smallSize = bodySize * 0.85;
  const sectionGap = data.sectionGap || 0.18;

  const renderSectionHeader = (title: string) => (
    <h2
      className="uppercase font-bold tracking-[0.14em] text-xs border-b border-black pb-1 mb-2"
      style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.25,
        paddingLeft: `${data.margins?.horizontal || 0.75}in`,
        paddingRight: `${data.margins?.horizontal || 0.75}in`,
        paddingTop: `${data.margins?.vertical || 0.7}in`,
        paddingBottom: `${data.margins?.vertical || 0.7}in`,
        fontFamily: data.font || "Times New Roman, serif",
      }}
    >
      {/* Header */}
      <header className="text-center mb-4">
        <h1
          className="font-bold tracking-wide"
          style={{ fontSize: `${fontSizes?.header || 24}pt` }}
        >
          {data.fullName || 'NAME'}
        </h1>
        <div
          className="mt-1 text-gray-900"
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
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Education')}

          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="font-semibold text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.school}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {edu.year}
                  </div>
                </div>
                {edu.degree && (
                  <div
                    className="italic text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.degree}
                  </div>
                )}
                {edu.gpa && edu.gpa.trim() && (
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.gpa}
                  </div>
                )}
                {edu.relevantCourses && edu.relevantCourses.trim() && (
                  <div
                    className="mt-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold italic">
                      Relevant Courses:
                    </span>{' '}
                    {edu.relevantCourses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ENGINEERING EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Engineering Experience')}

          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">
                      {exp.company}
                    </span>
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt` }}
                  >
                    {formatMonthYear(exp.startDate)} –{' '}
                    {formatMonthYear(exp.endDate)}
                  </div>
                </div>
                {exp.role && (
                  <div
                    className="italic text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {exp.role}
                  </div>
                )}
                {exp.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(exp.description).map(
                      (line, i) =>
                        line.trim() && (
                          <li key={i}>
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <section className="break-inside-avoid">
          {renderSectionHeader('Skills')}

          <div
            className="space-y-1 text-gray-900"
            style={{ fontSize: `${bodySize}pt` }}
          >
            {data.additionalInfo
              .filter((item) => item.label.trim() && item.value.trim())
              .map((item) => (
                <div key={item.id}>
                  <span className="font-semibold italic">
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

export default FreshGradEngTemplate;

