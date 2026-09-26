import React from 'react';
import { ResumeData } from '../../types';
import { MapPin, Phone, Mail, Linkedin, Send } from 'lucide-react';
import { parseDescriptionBullets, formatMonthYear as formatMonthYearUtil, getSectionGapIn, getHeaderGapIn, getHeaderItemGapIn, getHeaderContactGapIn, getItemGapIn, getMarginHorizontalIn, getMarginVerticalIn, formatContactText, formatLocationDisplay, formatLinkedInDisplay, getLinkedInHref, formatNameDisplay, formatJobTitleDisplay, formatSectionTitle, splitSkillsList, CONTACT_SEPARATOR, renderExpertSkillsBlockHelper } from '../../utils/templateUtils';
import RichText from '../RichText';

interface FreshGrad7TemplateProps {
    data: ResumeData;
}

const formatMonthYear = (dateString: string | null | undefined) => {
    return formatMonthYearUtil(dateString, 'long');
};

const FreshGrad7Template: React.FC<FreshGrad7TemplateProps> = ({ data }) => {
    const { fontSizes } = data;
    const getSectionHeaderAlignment = () => {
        const align = data.bodyHeaderAlignment || data.sectionHeaderAlignment || 'left';
        if (align === 'center') return 'text-center';
        if (align === 'right') return 'text-right';
        return 'text-left';
    };
    const bodySize = fontSizes?.body || 9.5;
    const bodyStyle = {
        fontSize: `${bodySize}pt`,
        lineHeight: data.lineHeight || 1.5,
    };

    // The user image showed a gray background block at the top with dark text.
    const headerBgColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : '#858991';

    const renderSectionHeader = (title: string) => (
        <div className={`section-header-wrap break-inside-avoid w-full mb-2 ${getSectionHeaderAlignment()}`}>
            <h2
                className={`section-header text-gray-900 leading-normal font-bold ${getSectionHeaderAlignment()}`}
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 11}pt`,
                    color: data.accentColor || "#000000",
                    marginBottom: '3px',
                }}
            >
                {formatSectionTitle(title, data.sectionHeaderCase)}
            </h2>
            <div
                className="section-divider"
                style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#9ca3af',
                    marginTop: '3px',
                    marginBottom: '4px',
                }}
            />
        </div>
    );

    return (
        <div
            className="resume-content flex flex-col w-full h-full bg-white relative"
            style={{
                lineHeight: data.lineHeight || 1.5,
                fontSize: `${bodySize}pt`,
                fontFamily: data.font || "Georgia, 'Times New Roman', Times, serif",
            }}
        >
            {/* Full Width Header Container */}
            <div
                className="w-full py-6 px-8 flex flex-col break-inside-avoid"
                style={{ backgroundColor: headerBgColor }}
            >
                <h1
                    className={`font-bold text-gray-900 ${
                        data.headerAlignment === 'left' ? 'text-left' :
                        data.headerAlignment === 'right' ? 'text-right' :
                        'text-center'
                    }`}
                    style={{
                        marginBottom: `${getHeaderItemGapIn(data)}in`,
                        lineHeight: 1.15,
                        fontSize: `${fontSizes?.header || 18}pt`,
                    }}
                >
                    <RichText text={formatNameDisplay(data.fullName, data.headerCase) || 'Name'} />
                </h1>
                {(() => {
                    const showIcons = data.showContactIcons ?? true;
                    const items: React.ReactNode[] = [];
                    const loc = data.location || data.address;
                    if (loc) items.push(
                        <span key="loc" className="inline-flex items-center gap-1">
                            {showIcons && <MapPin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                            <span data-path="location"><RichText text={formatLocationDisplay(loc)} /></span>
                        </span>
                    );
                    if (data.email) items.push(
                        <span key="email" className="inline-flex items-center gap-1">
                            {showIcons && <Mail size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                            <a data-path="email" href={`mailto:${formatContactText(data.email)}`} className="text-inherit no-underline">
                                <RichText text={formatContactText(data.email)} />
                            </a>
                        </span>
                    );
                    if (data.phone) items.push(
                        <span key="phone" className="inline-flex items-center gap-1">
                            {showIcons && <Phone size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                            <span data-path="phone"><RichText text={formatContactText(data.phone)} /></span>
                        </span>
                    );
                    if (data.linkedin) items.push(
                        <span key="li" className="inline-flex items-center gap-1">
                            {showIcons && <Linkedin size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                            <a data-path="linkedin" href={getLinkedInHref(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline">
                                <RichText text={formatLinkedInDisplay(data.linkedin)} />
                            </a>
                        </span>
                    );
                    if (data.atHandle) items.push(
                        <span key="at" className="inline-flex items-center gap-1">
                            {showIcons && <Send size={12} className="shrink-0" color={data.accentColor || '#000000'} />}
                            <span data-path="atHandle"><RichText text={data.atHandle} /></span>
                        </span>
                    );
                    if (items.length === 0) return null;

                    return (
                        <div
                            className={`text-gray-900 flex flex-wrap ${showIcons ? 'gap-x-3 gap-y-1' : 'gap-x-1.5 gap-y-1'} ${
                                data.contactAlignment === 'left' ? 'justify-start text-left' :
                                data.contactAlignment === 'right' ? 'justify-end text-right' :
                                data.contactAlignment === 'center' ? 'justify-center text-center' :
                                data.headerAlignment === 'left' ? 'justify-start text-left' :
                                data.headerAlignment === 'right' ? 'justify-end text-right' :
                                'justify-center text-center'
                            }`}
                            style={{ ...bodyStyle, marginBottom: `${getHeaderContactGapIn(data)}in` }}
                        >
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    {!showIcons && index > 0 && <span className="mx-1 select-none text-gray-400">{CONTACT_SEPARATOR}</span>}
                                    {item}
                                </React.Fragment>
                            ))}
                        </div>
                    );
                })()}
                {data.jobTitle && (
                    <p
                        className={
                            data.jobTitleAlignment === 'left' ? 'text-left' :
                            data.jobTitleAlignment === 'right' ? 'text-right' :
                            data.jobTitleAlignment === 'center' ? 'text-center' :
                            data.headerAlignment === 'left' ? 'text-left' :
                            data.headerAlignment === 'right' ? 'text-right' :
                            'text-center'
                        }
                        style={{
                            fontSize: `${fontSizes?.jobTitle || 11}pt`,
                            color: data.accentColor || '#000000',
                            lineHeight: 1.25,
                        }}
                    >
                        <RichText text={formatJobTitleDisplay(data.jobTitle, data.jobTitleCase)} />
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
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        {renderSectionHeader('Education')}
                        <div className="flex flex-col" style={{ gap: `${Math.max(0.14, getSectionGapIn(data))}in` }}>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid" style={bodyStyle}>
                                    <div className="flex justify-between items-baseline text-gray-900">
                                        <div className="font-semibold">
                                            <RichText text={edu.degree || 'Degree'} /> {edu.relevantCourses && <RichText text={`| ${edu.relevantCourses}`} />}
                                        </div>
                                        <div>
                                            {edu.gpa && <RichText text={`・ ${edu.gpa}`} />} {edu.year && <RichText text={`・ ${edu.year}`} />}
                                        </div>
                                    </div>
                                    <div className="text-gray-800">
                                        <RichText text={edu.school ?? ''} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE */}
                {data.experience && data.experience.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        {renderSectionHeader('Experience')}
                        <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid" style={bodyStyle}>
                                    <div className="flex justify-between items-baseline text-gray-900">
                                        <div className="text-[11pt] font-semibold"><RichText text={exp.role ?? ''} /></div>
                                        <div className="font-semibold text-[10.5pt]">
                                            <RichText text={formatMonthYear(exp.startDate)} /> – <RichText text={formatMonthYear(exp.endDate)} />{exp.location ? <RichText text={`, ${exp.location}`} /> : ''}
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-900 mb-1">
                                        <RichText text={exp.company ?? ''} />
                                    </div>
                                    {exp.description && (
                                        <ul
                                            className="list-disc list-outside ml-5 space-y-1 text-gray-800"
                                            style={bodyStyle}
                                        >
                                            {parseDescriptionBullets(exp.description).map((line, i) => (
                                                <li key={i}>
                                                    <RichText text={line.replace(/^[•-]\s*/, '')} />
                                                </li>
                                            ))}
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
                        <div className="flex flex-col" style={{ gap: `${getItemGapIn(data)}in` }}>
                            {data.leadership.map((lead) => (
                                <div key={lead.id} className="break-inside-avoid" style={bodyStyle}>
                                    <div className="text-gray-900 font-semibold text-[11pt]">
                                        <RichText text={lead.role ?? ''} />
                                    </div>
                                    <div className="text-gray-900 mb-1">
                                        <span className="font-semibold"><RichText text={lead.company ?? ''} /></span>
                                        {(lead.location || lead.startDate || lead.endDate) && (
                                            <span>
                                                {lead.location ? <RichText text={` ・ ${lead.location}`} /> : ''}
                                                {(lead.startDate || lead.endDate) ? <RichText text={` ・ ${formatMonthYear(lead.startDate)} – ${formatMonthYear(lead.endDate)}`} /> : ''}
                                            </span>
                                        )}
                                    </div>
                                    {lead.description && (
                                        <ul
                                            className="list-disc list-outside ml-5 space-y-1 text-gray-800"
                                            style={bodyStyle}
                                        >
                                            {parseDescriptionBullets(lead.description).map((line, i) => (
                                                <li key={i}>
                                                    <RichText text={line.replace(/^[•-]\s*/, '')} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERT-LEVEL SKILLS */}
                {data.expertSkills && (
                    renderExpertSkillsBlockHelper({
                        data,
                        title: (data.sectionTitles && data.sectionTitles['expert_skills']) || 'Expert-Level Skills',
                        items: data.expertSkills,
                        basePath: 'expertSkills',
                        renderSectionHeader,
                        bodyStyle,
                    })
                )}

                {/* SKILLS & INTERESTS */}
                {((data.additionalInfo && data.additionalInfo.length > 0) || data.skills) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        {renderSectionHeader('Skills & Interests')}
                        {data.skills && (() => {
                            const skillsList = splitSkillsList(data.skills);
                            if (skillsList.length === 0) return null;
                            const columnCount = data.skillsColumnCount === 2 ? 2 : (data.skillsColumnCount === 4 ? 4 : 3);
                            return (
                                <ul
                                    data-skills-grid
                                    className={`list-none pl-2.5 grid gap-x-8 gap-y-1 text-gray-900 mb-2 ${columnCount === 2 ? 'grid-cols-2' : (columnCount === 4 ? 'grid-cols-4' : 'grid-cols-3')}`}
                                    style={bodyStyle}
                                >
                                    {skillsList.map((skill, i) => (
                                        <li key={`skill-${i}`} data-skill-cell className="flex items-baseline gap-1.5 min-w-0">
                                            <span data-bullet aria-hidden="true" className="shrink-0 select-none pointer-events-none leading-none">•</span>
                                            <span className="flex-1" style={{ lineHeight: 'inherit' }}><RichText text={skill} /></span>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()}
                        {data.additionalInfo && data.additionalInfo.length > 0 && (
                            <ul
                                className="list-disc list-outside ml-5 space-y-1 text-gray-900"
                                style={bodyStyle}
                            >
                                {data.additionalInfo?.filter((item) => item.label.trim() && item.value.trim()).map((item) => (
                                    <li key={item.id}>
                                        <span className="font-semibold"><RichText text={item.label} />:</span>{' '}
                                        <span><RichText text={item.value} /></span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {/* REFERENCES */}
                {data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${getSectionGapIn(data)}in` }}>
                        {renderSectionHeader('References')}
                        <p className="italic text-gray-800 whitespace-pre-line" style={bodyStyle}>
                            <RichText text={data.referee ?? ''} />
                        </p>
                    </section>
                )}

            </div>
        </div>
    );
};

export default FreshGrad7Template;
