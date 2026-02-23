import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';

interface StudentTemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'short');
};

const StudentTemplate: React.FC<StudentTemplateProps> = ({ data }) => {
    const { fontSizes } = data;
    const bodySize = fontSizes?.body || 10.5;
    const smallSize = bodySize * 0.9;
    const accentColor = data.accentColor || '#000000';

    const renderSectionHeader = (title: string) => (
        <h2
            className="uppercase font-bold border-b border-black pb-1 mb-2 mt-4"
            style={{ color: accentColor, fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
        >
            {title}
        </h2>
    );

    return (
        <div
            className="resume-content text-gray-900"
            style={{
                lineHeight: data.lineHeight || 1.3,
                paddingLeft: `${data.margins?.horizontal || 0.8}in`,
                paddingRight: `${data.margins?.horizontal || 0.8}in`,
                paddingTop: `${data.margins?.vertical || 0.8}in`,
                paddingBottom: `${data.margins?.vertical || 0.8}in`,
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
            }}
        >
            {/* Header */}
            <header className="text-center mb-6">
                <h1
                    className="uppercase mb-1"
                    style={{
                        fontSize: `${fontSizes?.header || 24}pt`,
                    }}
                >
                    {data.fullName || 'YOUR NAME'}
                </h1>
                <div
                    className="text-gray-700"
                    style={{ fontSize: `${smallSize}pt` }}
                >
                    {[
                        data.location || data.address,
                        data.phone,
                        data.email,
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
                    <div className="space-y-2">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="break-inside-avoid">
                                <div style={{ fontSize: `${bodySize}pt` }}>
                                    <span className="font-bold">{edu.degree}</span>
                                    {edu.relevantCourses && <span className="font-bold">: {edu.relevantCourses}</span>}
                                </div>
                                <div className="text-gray-600" style={{ fontSize: `${smallSize}pt` }}>
                                    {edu.school} | {edu.year}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* WORK EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    {renderSectionHeader('Experience')}
                    <div className="space-y-3">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div style={{ fontSize: `${bodySize}pt` }}>
                                        <span className="font-bold">{exp.role}</span>
                                        {exp.company && <span className="italic">, {exp.company}</span>}
                                    </div>
                                    <div style={{ fontSize: `${smallSize}pt` }}>
                                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                    </div>
                                </div>
                                {exp.description && (
                                    <ul
                                        className="list-disc list-outside ml-6 space-y-0.5 text-gray-700"
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
                <section className="mb-4 break-inside-avoid">
                    {renderSectionHeader('Leadership')}
                    <div className="space-y-3">
                        {data.leadership.map((lead) => (
                            <div key={lead.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div style={{ fontSize: `${bodySize}pt` }}>
                                        <span className="font-bold">{lead.role}</span>
                                        {lead.company && <span className="italic">, {lead.company}</span>}
                                    </div>
                                    <div style={{ fontSize: `${smallSize}pt` }}>
                                        {formatMonthYear(lead.startDate)} – {formatMonthYear(lead.endDate)}
                                    </div>
                                </div>
                                {lead.description && (
                                    <ul
                                        className="list-disc list-outside ml-6 space-y-0.5 text-gray-700"
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
                <section className="break-inside-avoid">
                    {renderSectionHeader('Skills')}
                    <div className="space-y-1">
                        {/* If skills are defined as a single string, parse or show it */}
                        {data.skills && (
                            <div style={{ fontSize: `${bodySize}pt` }} className="text-gray-700">
                                {data.skills}
                            </div>
                        )}

                        {/* Show additional info which translates well to "Category: skills" */}
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
