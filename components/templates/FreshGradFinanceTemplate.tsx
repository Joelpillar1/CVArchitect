import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';

interface FreshGradFinanceTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradFinanceTemplate: React.FC<FreshGradFinanceTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };
  const bodySize = fontSizes?.body || 9.5;
  const smallSize = bodySize * 0.85;

  const sectionGap = data.sectionGap || 0.18;

  const renderSectionHeader = (title: string) => (
    <h2
      className={`uppercase font-bold tracking-[0.14em] text-xs border-b leading-tight border-black pb-0.5 mb-2 ${getSectionHeaderAlignment()}`}
      style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt` , color: data.accentColor ||"#000000", borderColor: data.accentColor ||"#000000"}}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="resume-content text-gray-900"
      style={{
        lineHeight: data.lineHeight || 1.7,
        paddingLeft: `${getMarginHorizontalIn(data)}in`,
        paddingRight: `${getMarginHorizontalIn(data)}in`,
        paddingTop: `${getMarginVerticalIn(data)}in`,
        paddingBottom: `${getMarginVerticalIn(data)}in`,
        fontFamily: data.font ||"Times New Roman, serif",
      }}
    >
      {/* Header */}
      <header className="text-center" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          className="font-bold"
          style={{ marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1, 
            fontSize: `${fontSizes?.header || 18}pt`,
          }}
        >
          {formatNameDisplay(data.fullName, data.headerCase) || 'Name'}
        </h1>
        <div
          className="text-gray-900"
          style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
        >
          {[
            formatContactText(data.location || data.address) || undefined,
            formatContactText(data.email) || undefined,
            formatContactText(data.phone) || undefined,
            formatLinkedInDisplay(data.linkedin) || undefined,
          ]
            .filter(Boolean)
            .join(' | ')}
        </div>
        {data.jobTitle && (
          <p
            style={{
              fontSize: `${fontSizes?.jobTitle || 11}pt`,
              color: data.accentColor || '#000000',
              }}
          >
            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
          </p>
        )}
      </header>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Education')}

          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="break-inside-avoid">
                {/* School + Location / Date */}
                <div className="flex justify-between items-baseline">
                  <div
                    className="font-semibold text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.school}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                  >
                    {/* Right-aligned graduation/location text driven by Graduation Year field */}
                    {edu.year}
                  </div>
                </div>

                {/* Degree line */}
                <div
                  className="italic text-gray-900"
                  style={{ fontSize: `${bodySize}pt` }}
                >
                  {edu.degree || 'Bachelor of Arts in Major; Minor in Field'}
                </div>
                {edu.gpa && edu.gpa.trim() && (
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {edu.gpa}
                  </div>
                )}

                {/* Relevant Courses for any education item that has it filled */}
                {edu.relevantCourses && edu.relevantCourses.trim() && (
                  <div
                    className="mt-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold italic">Relevant Courses:</span>{' '}
                    {edu.relevantCourses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FINANCIAL EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Financial Experience')}

          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">{exp.company}</span>
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                  >
                    {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                  </div>
                </div>
                {exp.role && (
                  <div
                    className="italic text-gray-900 mb-0.5"
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
                    {parseDescriptionBullets(exp.description).map((line, i) =>
                      line.trim() ? (
                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
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
        <section
          className="mb-3 break-inside-avoid"
          style={{ marginBottom: `${sectionGap}in` }}
        >
          {renderSectionHeader('Leadership')}

          <div className="space-y-3">
            {data.leadership.map((lead) => (
              <div key={lead.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    <span className="font-semibold">{lead.company}</span>
                    {lead.location && `, ${lead.location}`}
                  </div>
                  <div
                    className="text-gray-900"
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                  >
                    {formatMonthYear(lead.startDate)} – {formatMonthYear(lead.endDate)}
                  </div>
                </div>
                {lead.role && (
                  <div
                    className="italic text-gray-900 mb-0.5"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {lead.role}
                  </div>
                )}
                {lead.description && (
                  <ul
                    className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                    style={{ fontSize: `${bodySize}pt` }}
                  >
                    {parseDescriptionBullets(lead.description).map((line, i) =>
                      line.trim() ? (
                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS AND INTERESTS */}
      {data.additionalInfo && data.additionalInfo.length > 0 && (
        <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
          {renderSectionHeader('Skills and Interests')}

          <div className="space-y-1">
            {data.additionalInfo
              .filter((item) => item.label.trim() && item.value.trim())
              .map((item) => (
                <div
                  key={item.id}
                  className="text-gray-900"
                  style={{ fontSize: `${bodySize}pt` }}
                >
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

export default FreshGradFinanceTemplate;

