import React from 'react';
import { ResumeData } from '../../types';
import { Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { getTranslation, Language } from '../../i18n/translations';

export default function PrimeProfile({ data }: { data: ResumeData }) {
    const { fontSizes } = data;
    const t = getTranslation(data.language as Language || 'en');

    // Gold color extracted from the image style, or user selected color
    const accentColor = data.accentColor || '#000000';

    const formatMonthYear = (dateString: string) => {
        if (!dateString || dateString.toLowerCase() === 'present') {
            return 'Present';
        }
        try {
            const [year, month] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const getSectionHeaderAlignment = () => {
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            {t.professionalSummary}
                        </h2>
                        <p className="leading-relaxed text-justify text-gray-700">
                            {data.summary}
                        </p>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'achievements':
                return data.keyAchievements && data.keyAchievements.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            Key Achievements
                        </h2>
                        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                            {data.keyAchievements.split('\n').map((line, i) => (
                                line.trim() && (
                                    <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                )
                            ))}
                        </ul>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>{exp.company}{exp.location && <span className="font-normal italic text-gray-600"> • {exp.location}</span>}</div>
                                        <div className="italic text-gray-600" style={{ fontSize: '0.9em' }}>
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                        </div>
                                    </div>
                                    <div className="italic text-gray-800 mb-2">{exp.role}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-justify">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && <li key={i} className="pl-1">{line.replace(/^[•-]\s*/, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>
                                            {project.name}
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal italic text-gray-600 text-sm hover:underline">
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {project.technologies && (
                                        <div className="text-sm text-gray-600 italic mb-1">
                                            {project.technologies}
                                        </div>
                                    )}
                                    <p className="text-gray-700 whitespace-pre-line text-justify">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'skills':
                return data.skills && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            {t.technicalSkills}
                        </h2>
                        <div className={`grid gap-x-8 gap-y-1 text-gray-700 ${data.skillsColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {data.skills.split(',').map((skill, i) => (
                                <div key={i} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{skill.trim()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-4 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-black" style={{ fontSize: '1.1em' }}>{edu.school}</div>
                                        <div className="italic text-gray-600" style={{ fontSize: '0.9em' }}>{edu.year}</div>
                                    </div>
                                    <div className="italic text-gray-800">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            {t.certifications}
                        </h2>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700">
                            {data.certifications.map((cert) => (
                                <li key={cert.id}>
                                    <span className="font-bold">{cert.name}</span>
                                    {cert.issuer && <span> - {cert.issuer}</span>}
                                    {cert.date && <span className="text-gray-600 text-sm"> ({cert.date})</span>}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            Additional Information
                        </h2>
                        <div className="space-y-2">
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div key={item.id} className="text-gray-700">
                                    <span className="font-bold">{item.label}:</span>
                                    <span className="ml-2">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            case 'references':
                return data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase tracking-wide mb-3 text-black ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt` }}
                        >
                            References
                        </h2>
                        <div className="text-justify leading-relaxed text-gray-700 whitespace-pre-line">
                            {data.referee}
                        </div>
                        <div className="mt-6 h-px w-full" style={{ backgroundColor: accentColor }}></div>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="resume-content text-gray-900"
            style={{
                lineHeight: data.lineHeight || 1.4,
                paddingLeft: `${data.margins?.horizontal || 0.39}in`,
                paddingRight: `${data.margins?.horizontal || 0.39}in`,
                paddingTop: `${data.margins?.vertical || 0.45}in`,
                paddingBottom: `${data.margins?.vertical || 0.45}in`,
            }}
        >
            {/* Header */}
            <header className={`break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <h1
                    className="font-bold tracking-wide text-black"
                    style={{ fontSize: `${fontSizes?.header || 36}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}
                >
                    {data.fullName.toUpperCase()}
                </h1>
                <p
                    className="uppercase tracking-[0.2em] text-gray-600"
                    style={{ fontSize: `${fontSizes?.jobTitle || 14}pt`, marginBottom: `${data.headerItemGap || 0.08}in` }}
                >
                    {data.jobTitle}
                </p>

                {/* Contact Section with Gold Lines */}
                <div
                    className={`py-3 flex flex-wrap items-center gap-4 text-gray-600 ${data.headerAlignment === 'left' ? 'justify-start' : data.headerAlignment === 'right' ? 'justify-end' : 'justify-center'}`}
                    style={{
                        borderTop: `1px solid ${accentColor}`,
                        borderBottom: `1px solid ${accentColor}`,
                        fontSize: '0.85em'
                    }}
                >
                    {data.phone && (
                        <span>{data.phone}</span>
                    )}
                    {data.phone && data.email && <span className="text-gray-400">|</span>}

                    {data.email && (
                        <span>{data.email}</span>
                    )}
                    {data.email && (data.address || data.linkedin) && <span className="text-gray-400">|</span>}

                    {data.address && (
                        <span>{data.address}</span>
                    )}
                    {data.address && data.linkedin && <span className="text-gray-400">|</span>}

                    {data.linkedin && (
                        <span>{data.linkedin.replace(/^https?:\/\//, '')}</span>
                    )}
                </div>
            </header>

            {/* Dynamic Sections */}
            {(data.sectionOrder || ['summary', 'achievements', 'experience', 'projects', 'skills', 'education', 'certifications', 'additionalInfo', 'references']).map(id => (
                <React.Fragment key={id}>
                    {renderSection(id)}
                </React.Fragment>
            ))}
        </div>
    );
}
