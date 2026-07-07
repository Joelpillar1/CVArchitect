import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';

interface FreshGradTemplateProps {
  data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
  return formatMonthYearUtil(dateString, 'short');
};

const FreshGradTemplate: React.FC<FreshGradTemplateProps> = ({ data }) => {
  const { fontSizes } = data;
  const bodySize = fontSizes?.body || 9.5;
  const smallSize = bodySize * 0.85;
  const accentColor = data.accentColor || '#000000';

  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };

  const renderSectionHeader = (title: string) => (
    <h2
      className={`uppercase font-bold tracking-[0.16em] text-xs border-b leading-tight border-black pb-0.5 mb-2 ${getSectionHeaderAlignment()}`}
      style={{ color: accentColor, borderColor: accentColor, fontSize: `${fontSizes?.sectionTitle || 11}pt` }}
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
        fontFamily: data.font ||"Georgia, 'Times New Roman', Times, serif",
      }}
    >
      {/* Header */}
      <header className={`text-center ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
        <h1
          className="font-bold"
          style={{
            fontSize: `${fontSizes?.header || 18}pt`,
            marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1
          }}
        >
          {formatNameDisplay(data.fullName, data.headerCase) || 'NAME'}
        </h1>
        <div
          className="text-gray-800"
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
              color: accentColor,
              }}
          >
            {formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)}
          </p>
        )}
      </header>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
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
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
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
        <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
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
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
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
        <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
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
                    style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
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
        <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
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

