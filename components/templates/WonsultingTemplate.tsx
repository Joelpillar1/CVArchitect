import React from 'react';
import { ResumeData } from '../../types';
import { getTranslation, Language } from '../../i18n/translations';

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

export default function WonsultingTemplate({ data }: { data: ResumeData }) {
    const { fontSizes } = data;

    const t = getTranslation(data.language as Language || 'en');

    const getSectionHeaderAlignment = () => {
        // Wonsulting usually centers or left aligns. Let's respect the user setting but default to left if not specified.
        if (data.bodyHeaderAlignment === 'center') return 'text-center';
        if (data.bodyHeaderAlignment === 'right') return 'text-right';
        return 'text-left';
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return data.summary && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        {/* No title for summary in some Wonsulting variants, but let's check the image. 
                 The image starts at "WORK EXPERIENCE', no summary visible. 
                 However, if summary exists, we should show it. I'll follow the style of other headers. 
             */}
                        <p className="text-justify leading-relaxed text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{data.summary}</p>
                    </section>
                );

            case 'skills':
                return data.skills && data.skills.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            {t.technicalSkills} & Interests
                        </h2>
                        <div className="text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                            <span className="font-bold">Skills: </span>
                            {data.skills.split(',').map(s => s.trim()).join(' | ')}
                        </div>
                    </section>
                );

            case 'achievements':
                return data.keyAchievements && data.keyAchievements.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            Key Achievements
                        </h2>
                        <div className="text-gray-900 pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                            {data.keyAchievements.split('\n').map((line, i) => (
                                line.trim() ? <div key={i} className="mb-1 relative pl-2">
                                    <span className="absolute left-[-1rem]">•</span>
                                    {line.replace(/^[•-]\s*/, '')}
                                </div> : null
                            ))}
                        </div>
                    </section>
                );

            case 'experience':
                return data.experience.length > 0 && (
                    <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            {t.experienceTitle}
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    {/* Company and Location */}
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.company}</h3>
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.location}</span>
                                    </div>
                                    {/* Role and Date */}
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.role}</div>
                                        <span className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                        </span>
                                    </div>

                                    <div className="text-gray-900 pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() ? <div key={i} className="relative pl-2">
                                                <span className="absolute left-[-1rem]">•</span>
                                                {line.replace(/^[•-]\s*/, '')}
                                            </div> : null
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'projects':
                return data.projects && data.projects.length > 0 && (
                    <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                            {project.name}
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 font-normal text-blue-600 hover:underline">
                                                    [Link]
                                                </a>
                                            )}
                                        </h3>
                                    </div>
                                    {project.technologies && (
                                        <p className="italic text-gray-900 mb-1" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                            {project.technologies}
                                        </p>
                                    )}
                                    <div className="text-gray-900 pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                        <div className="relative pl-2 whitespace-pre-line">
                                            <span className="absolute left-[-1rem]">•</span>
                                            {project.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'certifications':
                return data.certifications && data.certifications.length > 0 && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        {/* Reusing experience-like header if appropriate, or simpler list */}
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            {t.certifications}
                        </h2>
                        <div className="space-y-2">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between">
                                    <div>
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.name}</span>
                                        {cert.issuer && <span className="italic text-gray-900 ml-2" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>| {cert.issuer}</span>}
                                    </div>
                                    {cert.date && <span className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{cert.date}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                return data.education.length > 0 && (
                    <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            {t.educationTitle}
                        </h2>
                        <div className="space-y-2">
                            {data.education.map(edu => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.school}</span>
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{/* Location if we had it, using year for now in next line usually but let's see image */}</span>
                                        {/* Image puts location on right for work, assume same for Edu */}
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.degree}</span>
                                        <span className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{edu.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'additionalInfo':
                return data.additionalInfo && data.additionalInfo.length > 0 && data.additionalInfo.some(item => item.label.trim() && item.value.trim()) && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            Additional Information
                        </h2>
                        <div className="space-y-1" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                            {data.additionalInfo.filter(item => item.label.trim() && item.value.trim()).map((item) => (
                                <div key={item.id} className="text-gray-900">
                                    <span className="font-bold">{item.label}:</span> <span className="">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'leadership':
                return data.leadership && data.leadership.length > 0 && (
                    <div style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 break-inside-avoid ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            LEADERSHIP EXPERIENCE
                        </h2>
                        <div className="space-y-4">
                            {data.leadership.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.company}</h3>
                                        <span className="font-bold text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.location}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{exp.role}</div>
                                        <span className="italic text-gray-900" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                            {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
                                        </span>
                                    </div>
                                    <div className="text-gray-900 pl-4" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() ? <div key={i} className="relative pl-2">
                                                <span className="absolute left-[-1rem]">•</span>
                                                {line.replace(/^[•-]\s*/, '')}
                                            </div> : null
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'references':
                return data.referee && data.referee.trim() && (
                    <section className="break-inside-avoid" style={{ marginBottom: `${data.sectionGap || 0.14}in` }}>
                        <h2
                            className={`font-bold uppercase border-b-2 border-black mb-2 ${getSectionHeaderAlignment()}`}
                            style={{ fontSize: `${fontSizes?.sectionTitle || 12}pt`, borderColor: 'black' }}
                        >
                            References
                        </h2>
                        <p className="text-justify leading-relaxed text-gray-900 whitespace-pre-line" style={{ fontSize: `${fontSizes?.body || 10.5}pt` }}>{data.referee}</p>
                    </section>
                );

            default:
                return null;
        }
    };

    // Header Info Construction
    const headerInfo = [
        data.location || data.address,
        data.linkedin && `LinkedIn`, // Simplified as per image style usually just saying "LinkedIn" or URL. Image says "LinkedIn".
        data.phone,
        data.email
    ].filter(Boolean);

    return (
        <div
            className="resume-content text-gray-900 font-sans"
            style={{
                lineHeight: data.lineHeight || 1.3,
                paddingLeft: `${data.margins?.horizontal || 0.5}in`,
                paddingRight: `${data.margins?.horizontal || 0.5}in`,
                paddingTop: `${data.margins?.vertical || 0.5}in`,
                paddingBottom: `${data.margins?.vertical || 0.5}in`,
                fontFamily: "'Times New Roman', Times, serif" // Wonsulting Wendy often uses Serif fonts like Times New Roman or similar. The image looks like Serif.
            }}
        >
            {/* Header */}
            <div className={`mb-6 break-inside-avoid ${data.headerAlignment === 'left' ? 'text-left' : data.headerAlignment === 'right' ? 'text-right' : 'text-center'}`} style={{ marginBottom: `${data.headerGap || 0.15}in` }}>
                <h1 className="font-bold text-gray-900 mb-1" style={{ fontSize: `${fontSizes?.header || 24}pt` }}>{data.fullName}</h1>
                {/* We can merge title if needed, but standard is separate line. Image: "Wonsulting Wendy [Professional]" looks like name. */}
                {data.jobTitle && <div className="" style={{ fontSize: `${fontSizes?.jobTitle || 14}pt` }}>{data.jobTitle}</div>}

                <div className="flex flex-wrap justify-center gap-1 text-gray-900 mt-1" style={{ fontSize: `${fontSizes?.body || 10.5}pt`, justifyContent: data.headerAlignment === 'left' ? 'flex-start' : data.headerAlignment === 'right' ? 'flex-end' : 'center' }}>
                    {/* Custom joining with | */}
                    {data.location && <span>{data.location} |</span>}
                    {data.linkedin && (
                        <span>
                            <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">LinkedIn</a> |
                        </span>
                    )}
                    {data.phone && <span>{data.phone} |</span>}
                    {data.email && <a href={`mailto:${data.email}`} className="text-blue-700 underline">{data.email}</a>}
                </div>
            </div>

            {/* Dynamic Sections */}
            {(() => {
                let sectionOrder = data.sectionOrder || ['experience', 'leadership', 'education', 'skills', 'projects', 'certifications', 'achievements', 'additionalInfo', 'references'];

                // Fallback: If sectionOrder exists but doesn't include leadership (e.g. old save), but we have leadership data
                if (data.leadership && data.leadership.length > 0 && !sectionOrder.includes('leadership')) {
                    const newOrder = [...sectionOrder];
                    const expIndex = newOrder.indexOf('experience');
                    if (expIndex !== -1) {
                        newOrder.splice(expIndex + 1, 0, 'leadership');
                    } else {
                        newOrder.push('leadership');
                    }
                    sectionOrder = newOrder;
                }

                return sectionOrder.map(id => (
                    <React.Fragment key={id}>
                        {renderSection(id)}
                    </React.Fragment>
                ));
            })()}
        </div>
    );
}
