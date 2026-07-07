import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';

interface StudentTemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'short');
};

const StudentTemplate: React.FC<StudentTemplateProps> = ({ data }) => {
    const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };
    const bodySize = fontSizes?.body || 9.5;
    const smallSize = bodySize * 0.9;
    const accentColor = data.accentColor || '#000000';

    const renderSectionHeader = (title: string) => (
        <h2
            className={`uppercase font-bold border-b leading-tight border-black pb-0.5 mb-2 mt-4 ${getSectionHeaderAlignment()}`}
            style={{ color: accentColor, fontSize: `${fontSizes?.sectionTitle || 11}pt` , borderColor: data.accentColor ||"#000000"}}
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
            <header className="text-center" style={{ marginBottom: `${getHeaderGapIn(data)}in` }}>
                <h1
                    className="mb-1"
                    style={{ marginBottom: `${getHeaderItemGapIn(data)}in`, lineHeight: 1.1, 
                        fontSize: `${fontSizes?.header || 18}pt`,
                    }}
                >
                    {formatNameDisplay(data.fullName, data.headerCase) || 'YOUR NAME'}
                </h1>
                <div
                    className="text-gray-700"
                    style={{ fontSize: `${bodySize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                >
                    {[
                        formatContactText(data.location || data.address) || undefined,
                        formatContactText(data.phone) || undefined,
                        formatContactText(data.email) || undefined,
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
                <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                    {renderSectionHeader('Education')}
                    <div className="space-y-2">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="break-inside-avoid">
                                <div style={{ fontSize: `${bodySize}pt` }}>
                                    <span className="font-bold">{edu.degree}</span>
                                    {edu.relevantCourses && <span className="font-bold">: {edu.relevantCourses}</span>}
                                </div>
                                <div className="text-gray-600" style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                                    {edu.school} | {edu.year}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* WORK EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
                <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                    {renderSectionHeader('Experience')}
                    <div className="space-y-3">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div style={{ fontSize: `${bodySize}pt` }}>
                                        <span className="font-bold">{exp.role}</span>
                                        {exp.company && <span className="italic">, {exp.company}</span>}
                                    </div>
                                    <div style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                    </div>
                                </div>
                                {exp.description && (
                                    <ul
                                        className="list-disc list-outside ml-5 space-y-0.5 text-gray-700"
                                        style={{ fontSize: `${bodySize}pt` }}
                                    >
                                        {parseDescriptionBullets(exp.description).map((line, i) =>
                                            line.trim() ? (
                                                <li key={i} className="pl-1 marker:text-gray-500">
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
                <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                    {renderSectionHeader('Leadership')}
                    <div className="space-y-3">
                        {data.leadership.map((lead) => (
                            <div key={lead.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div style={{ fontSize: `${bodySize}pt` }}>
                                        <span className="font-bold">{lead.role}</span>
                                        {lead.company && <span className="italic">, {lead.company}</span>}
                                    </div>
                                    <div style={{ fontSize: `${smallSize}pt`, marginBottom: `${getHeaderContactGapIn(data)}in` }}>
                                        {formatMonthYear(lead.startDate)} – {formatMonthYear(lead.endDate)}
                                    </div>
                                </div>
                                {lead.description && (
                                    <ul
                                        className="list-disc list-outside ml-5 space-y-0.5 text-gray-700"
                                        style={{ fontSize: `${bodySize}pt` }}
                                    >
                                        {parseDescriptionBullets(lead.description).map((line, i) =>
                                            line.trim() ? (
                                                <li key={i} className="pl-1 marker:text-gray-500">
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

            {/* SKILLS */}
            {(data.skills || (data.additionalInfo && data.additionalInfo.length > 0)) && (
                <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                    {renderSectionHeader('Skills')}
                    <div className="space-y-1">
                        {/* If skills are defined as a single string, parse or show it */}
                        {data.skills && (
                            <div style={{ fontSize: `${bodySize}pt` }} className="text-gray-700">
                                {data.skills}
                            </div>
                        )}

                        {/* Show additional info which translates well to"Category: skills" */}
                        {data.additionalInfo && data.additionalInfo
                            .filter(item => item.label?.trim() && item.value?.trim())
                            .map((item) => (
                                <div key={item.id} style={{ fontSize: `${bodySize}pt` }} className="text-gray-700">
                                    <span className="font-bold text-gray-900">{item.label}:</span>{' '}
                                    <span>{item.value}</span>
                                </div>
                            ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default StudentTemplate;
