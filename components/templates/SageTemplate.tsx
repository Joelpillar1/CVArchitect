import React from 'react';
import { ResumeData } from '../../types';
import {
    parseDescriptionBullets,
    descriptionToString,
    parseAchievementBullets,
    formatMonthYear as formatMonthYearUtil,
} from '../../utils/templateUtils';
import { getTranslation, Language } from '../../i18n/translations';

const formatDate = (dateString: string | null | undefined) =>
    formatMonthYearUtil(dateString, 'long');

const ACCENT = '#2c4770'; // Dark navy — matches the image's section header color

export default function SageTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation((data.language as Language) || 'en');

    const accentColor = data.accentColor && data.accentColor !== '#000000' ? data.accentColor : ACCENT;

    /* ──────────────────────── helpers ──────────────────────── */
    const headerAlign =
        data.headerAlignment === 'left'
            ? 'text-left'
            : data.headerAlignment === 'right'
                ? 'text-right'
                : 'text-center';

    /** Section header row: ALL-CAPS bold label + full-width bottom border */
    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <div
            style={{
                borderBottom: `1px solid #000000`,
                marginBottom: '0.35em',
                paddingBottom: '0.1em',
            }}
        >
            <h2
                className="font-bold tracking-wide uppercase"
                style={{
                    fontSize: `${fontSizes?.sectionTitle || 12}pt`,
                    color: accentColor,
                    letterSpacing: '0.04em',
                }}
            >
                {children}
            </h2>
        </div>
    );

    /* ──────────────────────── section renderers ──────────────────────── */
    const renderSection = (id: string): React.ReactNode => {
        switch (id) {
            /* ── SUMMARY ── */
            case 'summary':
                return data.summary ? (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>Professional Summary</SectionTitle>
                        <p
                            className="text-gray-900 leading-relaxed"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
                            {data.summary}
                        </p>
                    </section>
                ) : null;

            /* ── EXPERIENCE ── */
            case 'experience':
                return data.experience.length > 0 ? (
                    <div style={{ marginBottom: `${data.sectionGap || 0.16}in` }}>
                        <SectionTitle>Professional Experience</SectionTitle>
                        <div>
                            {data.experience.map((exp, idx) => (
                                <div
                                    key={exp.id}
                                    className="break-inside-avoid"
                                    style={{
                                        marginBottom:
                                            idx < data.experience.length - 1
                                                ? `${(data.sectionGap || 0.16) * 0.75}in`
                                                : 0,
                                    }}
                                >
                                    {/* Row 1: Role (bold) | Date range aligned right */}
                                    <div className="flex justify-between items-baseline">
                                        <span
                                            className="font-bold text-gray-900"
                                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                        >
                                            {exp.role}
                                        </span>
                                        <span
                                            className="text-gray-700 shrink-0 ml-2"
                                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                        >
                                            {formatDate(exp.startDate)}
                                            {exp.startDate && exp.endDate ? '—' : ''}
                                            {formatDate(exp.endDate)}&nbsp;&nbsp;
                                            {exp.location}
                                        </span>
                                    </div>
                                    {/* Row 2: Company (italic) */}
                                    <div
                                        className="italic text-gray-700"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {exp.company}
                                    </div>

                                    {/* Bullet points */}
                                    <div
                                        className="text-gray-900 pl-4 mt-0.5"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {descriptionToString(exp.description)
                                            .split('\n')
                                            .map((line, i) =>
                                                line.trim() ? (
                                                    <div key={i} className="relative pl-2 leading-relaxed">
                                                        <span className="absolute left-[-1rem] text-gray-600">·</span>
                                                        {line.replace(/^[•·\-*]\s*/, '')}
                                                    </div>
                                                ) : null
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null;

            /* ── CONSULTANCY / LEADERSHIP ── */
            case 'leadership':
                return data.leadership && data.leadership.length > 0 ? (
                    <div style={{ marginBottom: `${data.sectionGap || 0.16}in` }}>
                        <SectionTitle>Consultancy</SectionTitle>
                        <div>
                            {data.leadership.map((exp, idx) => (
                                <div
                                    key={exp.id}
                                    className="break-inside-avoid"
                                    style={{
                                        marginBottom:
                                            idx < (data.leadership?.length ?? 0) - 1
                                                ? `${(data.sectionGap || 0.16) * 0.5}in`
                                                : 0,
                                    }}
                                >
                                    {/* Row 1: Role (bold) */}
                                    <div
                                        className="font-bold text-gray-900"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {exp.role}
                                    </div>
                                    {/* Row 2: Company · Date */}
                                    <div
                                        className="text-gray-700"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {exp.company}
                                        {exp.startDate
                                            ? ` · ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
                                            : ''}
                                    </div>
                                    {/* Description */}
                                    <div
                                        className="text-gray-900 pl-4"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {descriptionToString(exp.description)
                                            .split('\n')
                                            .map((line, i) =>
                                                line.trim() ? (
                                                    <div key={i} className="relative pl-2 leading-relaxed">
                                                        <span className="absolute left-[-1rem] text-gray-600">·</span>
                                                        {line.replace(/^[•·\-*]\s*/, '')}
                                                    </div>
                                                ) : null
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null;

            /* ── EDUCATION ── */
            case 'education':
                return data.education.length > 0 ? (
                    <div style={{ marginBottom: `${data.sectionGap || 0.16}in` }}>
                        <SectionTitle>Education</SectionTitle>
                        <div className="space-y-1">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    {/* Degree (bold) */}
                                    <div
                                        className="font-bold text-gray-900"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {edu.degree}
                                    </div>
                                    {/* School · Scholarship · Year */}
                                    <div
                                        className="text-gray-700"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {edu.school}
                                        {edu.year ? ` · ${edu.year}` : ''}
                                        {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                                    </div>
                                    {edu.relevantCourses && (
                                        <div
                                            className="text-gray-600 italic"
                                            style={{ fontSize: `${(fontSizes?.body || 10.5) * 0.9}pt` }}
                                        >
                                            {edu.relevantCourses}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null;

            /* ── SKILLS ── */
            case 'skills':
                if (!data.skills || !data.skills.trim()) return null;

                const columnCount = data.skillsColumnCount || 1;
                const skillsList = data.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);

                // If only 1 column, render strictly vertically (original behavior)
                // If more columns, distribute items
                const itemsPerColumn = Math.ceil(skillsList.length / columnCount);
                const skillColumns: string[][] = [];

                for (let i = 0; i < columnCount; i++) {
                    skillColumns.push(skillsList.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
                }

                return (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>Expert-Level Skills</SectionTitle>
                        <div
                            style={{
                                fontSize: `${fontSizes?.body || 10.5}pt`,
                                display: columnCount > 1 ? 'grid' : 'block',
                                gridTemplateColumns:
                                    columnCount > 1 ? `repeat(${columnCount}, minmax(0, 1fr))` : undefined,
                                gap: columnCount > 1 ? '0.25in' : undefined,
                            }}
                        >
                            {columnCount > 1
                                ? skillColumns.map((col, colIndex) => (
                                    <div key={colIndex}>
                                        {col.map((skill, i) => {
                                            const colonIdx = skill.indexOf(':');
                                            if (colonIdx !== -1) {
                                                const label = skill.slice(0, colonIdx).trim();
                                                const value = skill.slice(colonIdx + 1).trim();
                                                return (
                                                    <div key={i} className="text-gray-900 mb-0.5">
                                                        <span className="font-bold">{label}: </span>
                                                        <span>{value}</span>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={i} className="text-gray-900 mb-0.5">
                                                    {skill}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                                : skillsList.map((skill, i) => {
                                    const colonIdx = skill.indexOf(':');
                                    if (colonIdx !== -1) {
                                        const label = skill.slice(0, colonIdx).trim();
                                        const value = skill.slice(colonIdx + 1).trim();
                                        return (
                                            <div key={i} className="text-gray-900 mb-0.5">
                                                <span className="font-bold">{label}: </span>
                                                <span>{value}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={i} className="text-gray-900 mb-0.5">
                                            {skill}
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                );

            /* ── ACHIEVEMENTS ── */
            case 'achievements': {
                const achievements = parseAchievementBullets(data.keyAchievements || '');
                return achievements.length > 0 ? (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>Key Achievements</SectionTitle>
                        <div
                            className="text-gray-900 pl-4"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
                            {achievements.map((line, i) =>
                                line.trim() ? (
                                    <div key={i} className="relative pl-2 leading-relaxed">
                                        <span className="absolute left-[-1rem] text-gray-600">·</span>
                                        {line.replace(/^[•·\-*]\s*/, '')}
                                    </div>
                                ) : null
                            )}
                        </div>
                    </section>
                ) : null;
            }

            /* ── PROJECTS ── */
            case 'projects':
                return data.projects && data.projects.length > 0 ? (
                    <div style={{ marginBottom: `${data.sectionGap || 0.16}in` }}>
                        <SectionTitle>Projects</SectionTitle>
                        <div className="space-y-2">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div
                                        className="font-bold text-gray-900"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        {project.name}
                                        {project.link && (
                                            <a
                                                href={
                                                    project.link.startsWith('http')
                                                        ? project.link
                                                        : `https://${project.link}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 font-normal text-blue-600 hover:underline"
                                            >
                                                [Link]
                                            </a>
                                        )}
                                    </div>
                                    {project.technologies && (
                                        <div
                                            className="italic text-gray-600"
                                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                        >
                                            {project.technologies}
                                        </div>
                                    )}
                                    <div
                                        className="text-gray-900 pl-4"
                                        style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                    >
                                        <div className="relative pl-2">
                                            <span className="absolute left-[-1rem] text-gray-600">·</span>
                                            {project.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null;

            /* ── CERTIFICATIONS ── */
            case 'certifications':
                return data.certifications && data.certifications.length > 0 ? (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>{t.certifications}</SectionTitle>
                        <div className="space-y-1">
                            {data.certifications.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="flex justify-between"
                                    style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                                >
                                    <div>
                                        <span className="font-bold text-gray-900">{cert.name}</span>
                                        {cert.issuer && (
                                            <span className="italic text-gray-700 ml-2">
                                                | {cert.issuer}
                                            </span>
                                        )}
                                    </div>
                                    {cert.date && (
                                        <span className="italic text-gray-700">{cert.date}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            /* ── ADDITIONAL INFO ── */
            case 'additionalInfo':
                return data.additionalInfo &&
                    data.additionalInfo.length > 0 &&
                    data.additionalInfo.some((item) => item.label.trim() && item.value.trim()) ? (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>Additional Information</SectionTitle>
                        <div
                            className="space-y-0.5"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
                            {data.additionalInfo
                                .filter((item) => item.label.trim() && item.value.trim())
                                .map((item) => (
                                    <div key={item.id} className="text-gray-900">
                                        <span className="font-bold">{item.label}: </span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                        </div>
                    </section>
                ) : null;

            /* ── REFERENCES ── */
            case 'references':
                return data.referee && data.referee.trim() ? (
                    <section
                        className="break-inside-avoid"
                        style={{ marginBottom: `${data.sectionGap || 0.16}in` }}
                    >
                        <SectionTitle>References</SectionTitle>
                        <p
                            className="text-gray-900 leading-relaxed whitespace-pre-line"
                            style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}
                        >
                            {data.referee}
                        </p>
                    </section>
                ) : null;

            default:
                return null;
        }
    };

    /* ──────────────────────── header contact info ──────────────────────── */
    const contactParts: string[] = [];
    if (data.location || data.address) contactParts.push(data.location || data.address || '');
    if (data.email) contactParts.push(data.email);
    if (data.phone) contactParts.push(data.phone);
    if (data.linkedin) contactParts.push(data.linkedin);
    if (data.atHandle) contactParts.push(data.atHandle);

    /* ──────────────────────── section order ──────────────────────── */
    const defaultOrder = [
        'summary',
        'experience',
        'leadership',
        'education',
        'skills',
        'achievements',
        'projects',
        'certifications',
        'additionalInfo',
        'references',
    ];

    let sectionOrder = data.sectionOrder && data.sectionOrder.length > 0 ? data.sectionOrder : defaultOrder;

    // Ensure leadership is included if data exists
    if (
        data.leadership &&
        data.leadership.length > 0 &&
        !sectionOrder.includes('leadership')
    ) {
        const newOrder = [...sectionOrder];
        const expIdx = newOrder.indexOf('experience');
        newOrder.splice(expIdx !== -1 ? expIdx + 1 : 0, 0, 'leadership');
        sectionOrder = newOrder;
    }

    /* ──────────────────────── render ──────────────────────── */
    return (
        <div
            className="resume-content text-gray-900"
            style={{
                fontFamily: data.font || "'Georgia', 'Times New Roman', serif",
                lineHeight: data.lineHeight || 1.4,
                paddingLeft: `${data.margins?.horizontal || 0.55}in`,
                paddingRight: `${data.margins?.horizontal || 0.55}in`,
                paddingTop: `${data.margins?.vertical || 0.45}in`,
                paddingBottom: `${data.margins?.vertical || 0.45}in`,
            }}
        >
            {/* ── Header ── */}
            <div
                className={`break-inside-avoid ${headerAlign}`}
                style={{ marginBottom: `${data.headerGap || 0.18}in` }}
            >
                {/* Name */}
                <h1
                    className="font-bold tracking-tight"
                    style={{
                        fontSize: `${fontSizes?.header || 26}pt`,
                        color: accentColor,
                        marginBottom: `${data.headerItemGap || 0.04}in`,
                    }}
                >
                    {data.fullName}
                </h1>

                {/* Job title (optional) */}
                {data.jobTitle && (
                    <div
                        className="text-gray-600 italic"
                        style={{
                            fontSize: `${fontSizes?.jobTitle || 11}pt`,
                            marginBottom: `${data.headerItemGap || 0.04}in`,
                        }}
                    >
                        {data.jobTitle}
                    </div>
                )}

                {/* Contact line — all items separated by a small centered dot */}
                {contactParts.length > 0 && (
                    <div
                        className="flex flex-wrap items-center gap-1 text-gray-700"
                        style={{
                            fontSize: `${(fontSizes?.body || 10.5) * 0.92}pt`,
                            justifyContent:
                                data.headerAlignment === 'left'
                                    ? 'flex-start'
                                    : data.headerAlignment === 'right'
                                        ? 'flex-end'
                                        : 'center',
                        }}
                    >
                        {contactParts.map((part, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span className="text-gray-400 mx-0.5">■</span>}
                                {part.includes('@') ? (
                                    <a
                                        href={`mailto:${part}`}
                                        className="hover:underline"
                                        style={{ color: 'inherit' }}
                                    >
                                        {part}
                                    </a>
                                ) : part.includes('linkedin') || part.includes('in/') ? (
                                    <a
                                        href={part.startsWith('http') ? part : `https://${part}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                        style={{ color: 'inherit' }}
                                    >
                                        {part}
                                    </a>
                                ) : (
                                    <span>{part}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Body sections (dynamic order) ── */}
            {/* ── Body sections (dynamic order) ── */}
            {sectionOrder.map((id) => (
                <React.Fragment key={id}>{renderSection(id)}</React.Fragment>
            ))}
        </div>
    );
}
