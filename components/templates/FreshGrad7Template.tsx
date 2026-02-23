import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { MapPin, Mail, Smartphone, Linkedin } from 'lucide-react';

interface FreshGrad7TemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
};

const FreshGrad7Template: React.FC<FreshGrad7TemplateProps> = ({ data }) => {
    const { fontSizes } = data;
    const bodySize = fontSizes?.body || 10.5;
    const smallSize = bodySize * 0.9;

    // The user image showed a gray background block at the top with dark text.
    const headerBgColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : '#858991';

    const renderSectionHeader = (title: string) => (
        <div className="mb-2">
            <h2
                className="uppercase text-gray-900"
                style={{ fontSize: `${fontSizes?.sectionTitle || 13}pt`, fontFamily: "Georgia, 'Times New Roman', serif" }}
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
                lineHeight: data.lineHeight || 1.4,
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
            }}
        >
            {/* Full Width Header Container */}
            <div
                className="w-full text-center py-6 px-8 flex flex-col items-center justify-center break-inside-avoid"
                style={{ backgroundColor: headerBgColor }}
            >
                <h1
                    className="font-bold text-gray-900"
                    style={{
                        fontSize: `${fontSizes?.header || 28}pt`,
                    }}
                >
                    {data.fullName || 'Name'}
                </h1>
                <div
                    className="mt-2 text-gray-900 font-sans"
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
            </div>

            {/* Main Content Area (padding matches other templates) */}
            <div
                className="flex-1"
                style={{
                    paddingLeft: `${data.margins?.horizontal || 0.75}in`,
                    paddingRight: `${data.margins?.horizontal || 0.75}in`,
                    paddingTop: `${data.margins?.vertical || 0.5}in`,
                    paddingBottom: `${data.margins?.vertical || 0.5}in`,
                }}
            >

                {/* EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <section className="mb-4 break-inside-avoid">
                        {renderSectionHeader('Education')}
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                        <div className="font-semibold">
                                            {edu.degree || 'Degree'} {edu.relevantCourses && `| ${edu.relevantCourses}`}
                                        </div>
                                        <div>
                                            {edu.gpa && `・ ${edu.gpa} `} {edu.year && `・ ${edu.year}`}
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
                    <section className="mb-4 break-inside-avoid">
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
                                            className="text-gray-800 font-sans"
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
                    <section className="mb-4 break-inside-avoid">
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
                                            className="text-gray-800 font-sans"
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
                    <section className="break-inside-avoid">
                        {renderSectionHeader('Skills & Interests')}
                        <div className="space-y-1">
                            {data.skills && (
                                <div className="text-gray-900 font-sans" style={{ fontSize: `${bodySize}pt` }}>
                                    <span className="font-semibold">Technical Skills:</span> {data.skills}
                                </div>
                            )}
                            {data.additionalInfo?.filter((item) => item.label.trim() && item.value.trim()).map((item) => (
                                <div
                                    key={item.id}
                                    className="text-gray-900 font-sans"
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
