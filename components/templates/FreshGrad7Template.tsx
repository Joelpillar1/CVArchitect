import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getMarginHorizontalIn, getMarginVerticalIn, getPagePaddingStyle, sectionMarginBottom, BULLET_LIST_CLASS, formatContactText, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay} from '../../utils/templateUtils';
import { MapPin, Mail, Smartphone, Linkedin } from 'lucide-react';

interface FreshGrad7TemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
};

const FreshGrad7Template: React.FC<FreshGrad7TemplateProps> = ({ data }) => {
    const { fontSizes } = data;
  const getSectionHeaderAlignment = () => {
    if (data.bodyHeaderAlignment === 'center') return 'text-center';
    if (data.bodyHeaderAlignment === 'right') return 'text-right';
    return 'text-left';
  };
    const bodySize = fontSizes?.body || 9.5;
    const smallSize = bodySize * 0.9;

    // The user image showed a gray background block at the top with dark text.
    const headerBgColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : '#858991';

    const renderSectionHeader = (title: string) => (
        <div className="mb-2">
            <h2
                className={`uppercase text-gray-900 ${getSectionHeaderAlignment()}`}
                style={{ fontSize: `${fontSizes?.sectionTitle || 11}pt`, color: data.accentColor ||"#000000"}}
            >
                {title}
            </h2>
            <hr className="border-gray-400 my-1" style={{ borderTopWidth: '1px' }} />
        </div>
    );

    return (
        <div
            className="resume-content flex flex-col w-full h-full bg-white relative"
            style={{
                lineHeight: data.lineHeight || 1.7,
                fontFamily: data.font ||"Georgia, 'Times New Roman', Times, serif",
            }}
        >
            {/* Full Width Header Container */}
            <div
                className="w-full text-center py-6 px-8 flex flex-col items-center justify-center break-inside-avoid"
                style={{ backgroundColor: headerBgColor }}
            >
                <h1
                    className="font-bold text-gray-900"
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
            </div>

            {/* Main Content Area (padding matches other templates) */}
            <div
                className="flex-1"
                style={{
                    paddingLeft: `${getMarginHorizontalIn(data)}in`,
                    paddingRight: `${getMarginHorizontalIn(data)}in`,
                    paddingTop: `${getMarginVerticalIn(data)}in`,
                    paddingBottom: `${getMarginVerticalIn(data)}in`,
                }}
            >

                {/* EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                        {renderSectionHeader('Education')}
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                        <div className="font-semibold">
                                            {edu.degree || 'Degree'} {edu.relevantCourses && `| ${edu.relevantCourses}`}
                                        </div>
                                        <div>
                                            {edu.gpa && `・ ${edu.gpa}`} {edu.year && `・ ${edu.year}`}
                                        </div>
                                    </div>
                                    <div className="text-gray-800" style={{ fontSize: `${bodySize}pt` }}>
                                        {edu.school}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE */}
                {data.experience && data.experience.length > 0 && (
                    <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                        {renderSectionHeader('Experience')}
                        <div className="space-y-3">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                        <div className="text-[11pt]">{exp.role}</div>
                                        <div className="font-semibold text-[10.5pt]">
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}{exp.location ? `, ${exp.location}` : ''}
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-900 mb-1" style={{ fontSize: `${bodySize}pt` }}>
                                        {exp.company}
                                    </div>
                                    {exp.description && (
                                        <div
                                            className="text-gray-800"
                                            style={{ fontSize: `${bodySize}pt`, paddingLeft: '0.25rem' }}
                                        >
                                            {parseDescriptionBullets(exp.description).map((line, i) =>
                                                line.trim() ? (
                                                    <div key={i} className="flex relative items-start mb-0.5">
                                                        <span className="mr-2 text-gray-600">・</span>
                                                        <span>{line.replace(/^[•-]\s*/, '')}</span>
                                                    </div>
                                                ) : null
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* LEADERSHIP (Instead of Involvement) */}
                {data.leadership && data.leadership.length > 0 && (
                    <section className="break-inside-avoid" style={sectionMarginBottom(data)}>
                        {renderSectionHeader('Leadership')}
                        <div className="space-y-3">
                            {data.leadership.map((lead) => (
                                <div key={lead.id} className="break-inside-avoid">
                                    <div className="text-gray-900 text-[11pt]" style={{ fontSize: `${bodySize}pt` }}>
                                        {lead.role}
                                    </div>
                                    <div className="text-gray-900 mb-1" style={{ fontSize: `${bodySize}pt` }}>
                                        <span className="font-semibold">{lead.company}</span>
                                        {(lead.location || lead.startDate || lead.endDate) && (
                                            <span>
                                                {lead.location ? ` ・ ${lead.location}` : ''}
                                                {(lead.startDate || lead.endDate) ? ` ・ ${formatMonthYear(lead.startDate)} – ${formatMonthYear(lead.endDate)}` : ''}
                                            </span>
                                        )}
                                    </div>
                                    {lead.description && (
                                        <div
                                            className="text-gray-800"
                                            style={{ fontSize: `${bodySize}pt`, paddingLeft: '0.25rem' }}
                                        >
                                            {parseDescriptionBullets(lead.description).map((line, i) =>
                                                line.trim() ? (
                                                    <div key={i} className="flex relative items-start mb-0.5">
                                                        <span className="mr-2 text-gray-600">・</span>
                                                        <span>{line.replace(/^[•-]\s*/, '')}</span>
                                                    </div>
                                                ) : null
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SKILLS & INTERESTS */}
                {((data.additionalInfo && data.additionalInfo.length > 0) || data.skills) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        {renderSectionHeader('Skills & Interests')}
                        <div className="space-y-1">
                            {data.skills && (
                                <div className="text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                    <span className="font-semibold">Technical Skills:</span> {data.skills}
                                </div>
                            )}
                            {data.additionalInfo?.filter((item) => item.label.trim() && item.value.trim()).map((item) => (
                                <div
                                    key={item.id}
                                    className="text-gray-900"
                                    style={{ fontSize: `${bodySize}pt` }}
                                >
                                    <span className="font-semibold">{item.label}:</span>{' '}
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default FreshGrad7Template;
