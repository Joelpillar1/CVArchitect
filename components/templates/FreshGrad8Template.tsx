import React from 'react';
import { ResumeData } from '../../types';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil } from '../../utils/templateUtils';
import { MapPin, Mail, Smartphone, Linkedin } from 'lucide-react';

interface FreshGrad8TemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
};

const FreshGrad8Template: React.FC<FreshGrad8TemplateProps> = ({ data }) => {
    const { fontSizes } = data;
    const bodySize = fontSizes?.body || 10.5;
    const smallSize = bodySize * 0.95;

    const renderSectionHeader = (title: string) => (
        <div className="mb-2 mt-4 break-inside-avoid">
            <h2
                className="uppercase text-gray-900 font-serif"
                style={{ fontSize: `${fontSizes?.sectionTitle || 13}pt`, letterSpacing: '0.05em' }}
            >
                {title}
            </h2>
            <hr className="border-gray-800 mt-1" style={{ borderTopWidth: '1.5px' }} />
        </div>
    );

    return (
        <div
            className="resume-content flex flex-col w-full h-full bg-white relative"
            style={{
                lineHeight: data.lineHeight || 1.4,
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
                paddingLeft: `${data.margins?.horizontal || 0.75}in`,
                paddingRight: `${data.margins?.horizontal || 0.75}in`,
                paddingTop: `${data.margins?.vertical || 0.5}in`,
                paddingBottom: `${data.margins?.vertical || 0.5}in`,
            }}
        >
            {/* Header Container */}
            <div className="w-full text-center mb-4 break-inside-avoid">
                <h1
                    className="font-bold text-gray-900 font-serif"
                    style={{
                        fontSize: `${fontSizes?.header || 26}pt`,
                    }}
                >
                    {data.fullName || 'First Last'}
                </h1>
                <div
                    className="mt-1 text-gray-700 flex flex-wrap justify-center items-center gap-3 font-sans"
                    style={{ fontSize: `${smallSize}pt` }}
                >
                    {data.location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-gray-700" /> {data.location}
                        </span>
                    )}
                    {data.email && (
                        <span className="flex items-center gap-1">
                            <Mail size={10} className="text-gray-700" /> {data.email}
                        </span>
                    )}
                    {data.phone && (
                        <span className="flex items-center gap-1">
                            <Smartphone size={10} className="text-gray-700" /> {data.phone}
                        </span>
                    )}
                    {data.linkedin && (
                        <span className="flex items-center gap-1">
                            <Linkedin size={10} className="text-gray-700" /> {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}
                        </span>
                    )}
                </div>
            </div>

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    {renderSectionHeader('Education')}
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="break-inside-avoid">
                                <div className="font-semibold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                    {edu.degree || 'Degree'} {edu.relevantCourses && `| ${edu.relevantCourses}`}
                                </div>
                                <div className="text-gray-800" style={{ fontSize: `${bodySize}pt` }}>
                                    {edu.school} {edu.gpa && ` • ${edu.gpa} `} {edu.year && ` • ${edu.year}`}
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
                                <div className="font-semibold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                    {exp.role}
                                </div>
                                <div className="flex justify-between items-baseline text-gray-800 mb-1" style={{ fontSize: `${bodySize}pt` }}>
                                    <div>{exp.company}</div>
                                    <div>
                                        {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}{exp.location ? `, ${exp.location}` : ''}
                                    </div>
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

            {/* INVOLVEMENT (Leadership data) */}
            {data.leadership && data.leadership.length > 0 && (
                <section className="mb-4 break-inside-avoid">
                    {renderSectionHeader('Leadership')}
                    <div className="space-y-3">
                        {data.leadership.map((lead) => (
                            <div key={lead.id} className="break-inside-avoid">
                                <div className="font-semibold text-gray-900" style={{ fontSize: `${bodySize}pt` }}>
                                    {lead.role}
                                </div>
                                <div className="text-gray-800 mb-1" style={{ fontSize: `${bodySize}pt` }}>
                                    {[lead.location, lead.company, lead.startDate || lead.endDate ? `${formatMonthYear(lead.startDate)} – ${formatMonthYear(lead.endDate)}` : ''].filter(Boolean).join(' • ')}
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
                    {renderSectionHeader('Skills')}
                    <div className="space-y-1">
                        {data.skills && (
                            <div className="text-gray-800 font-serif" style={{ fontSize: `${bodySize}pt` }}>
                                {data.skills}
                            </div>
                        )}
                        {data.additionalInfo?.filter((item) => item.label.trim() && item.value.trim()).map((item) => (
                            <div
                                key={item.id}
                                className="text-gray-800 font-serif"
                                style={{ fontSize: `${bodySize}pt` }}
                            >
                                {item.label}:{' '}
                                <span className="text-gray-600">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default FreshGrad8Template;
