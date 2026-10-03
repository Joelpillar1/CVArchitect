import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { useToast } from '../contexts/ToastContext';

export const JPN_SARAH_JENKINS_DATA: ResumeData = {
    fullName: "Sarah Jenkins",
    jobTitle: "SENIOR PRODUCT DESIGNER",
    email: "sarahjenkins@gmail.com",
    phone: "+1 (555) 000-0000",
    address: "",
    location: "",
    linkedin: "in/sarahjenkins",
    atHandle: "",
    referee: "",
    language: "en",
    font: "Merriweather, serif",
    template: "apex",
    source: "upload",
    currentTag: "JPN Resume",
    resumeTitle: "JPN Resume",
    accentColor: "#000000",
    headerAlignment: "center",
    contactAlignment: "center",
    jobTitleAlignment: "center",
    bodyHeaderAlignment: "left",
    isTitleFirst: false,
    showContactIcons: true,
    skillsColumnCount: 3,
    headerGap: 0.12,
    sectionGap: 0.14,
    headerItemGap: 0.06,
    headerContactGap: 0.06,
    lineHeight: 1.45,
    margins: {
        vertical: 0.5,
        horizontal: 0.55
    },
    fontSizes: {
        body: 7,
        header: 22,
        jobTitle: 10,
        sectionTitle: 11
    },
    summary: "Senior Product Designer with extensive experience in crafting user-centered digital solutions in fintech and emerging technologies. Expert in enhancing user experience and prototyping, particularly in the finance and corporate spending sectors, by transforming complex challenges into intuitive designs. Proven ability to collaborate with cross-functional teams and drive product strategy, ensuring alignment with both user needs and business objectives.",
    keyAchievements: [
        "Revolutionized the product design strategy at AmigoXchange, leveraging cutting-edge prototyping and user experience methodologies to innovate fintech solutions, driving a 30% surge in user engagement and enhancing corporate spending insights.",
        "Orchestrated seamless cross-functional collaboration among diverse teams, aligning design objectives with corporate spending goals, which resulted in a 25% boost in project execution efficiency and supported sustained growth.",
        "Designed customer satisfaction by implementing a user-centered design philosophy, integrating comprehensive user research and usability testing, thus refining product decisions and ensuring an unparalleled user experience.",
        "Developed robust and advanced design systems that enhanced product consistency and quality across platforms, significantly improving design uniformity and setting a new standard for excellence in the finance sector."
    ],
    skills: "Product Design, User Experience, User Interface, Prototyping, Mock-ups, Customer Experience, Fintech Solutions, Implementation, Design Leadership",
    experience: [
        {
            id: "exp_1",
            role: "Senior Product Designer",
            company: "AmigoXchange",
            startDate: "Mar 2025",
            endDate: "Present",
            location: "",
            description: [
                "Conceptualized the end-to-end design process at AmigoXchange, leveraging prototype-driven methodologies to enhance corporate spending solutions, resulting in a 30% surge in user engagement and satisfaction.",
                "Engineered a robust design system to elevate product consistency and quality across platforms, utilizing innovative user experience principles to support the finance sector's nuanced requirements.",
                "Architected a user-centered design approach by conducting comprehensive research and usability testing, enabling a seamless user experience and driving customer-obsessed innovation within the fintech landscape.",
                "Accelerated cross-functional collaboration with strategic alignment on design objectives, increasing project efficiency by 25% and fostering growth in the development of intuitive financial products at Float."
            ]
        },
        {
            id: "exp_2",
            role: "Lead Product Designer",
            company: "NanoPay",
            startDate: "May 2024",
            endDate: "Jan 2025",
            location: "",
            description: [
                "Spearheaded five major product updates at NanoPay, enhancing user experience and increasing user retention by 15%, through a customer-obsessed approach focused on finance and corporate spending innovation.",
                "Prototyped data-driven design decisions by collaborating closely with cross-functional teams, resulting in enhanced user satisfaction and aligning product designs with corporate finance objectives.",
                "Wireframed cross-functional collaboration with product managers and engineers, delivering user-centric solutions that harmonized with NanoPay's business goals and product vision."
            ]
        }
    ],
    education: [
        {
            id: "edu_1",
            school: "Rhode Island School of Design",
            degree: "B.F.A. Industrial Design",
            year: "2019",
            gpa: "",
            relevantCourses: ""
        }
    ],
    certifications: [
        {
            id: "cert_1",
            name: "NN/g UX Master Certified",
            issuer: "Nielsen Norman Group",
            date: "2023"
        }
    ],
    projects: [],
    leadership: [],
    additionalInfo: [],
    sectionOrder: [
        "summary",
        "keyAchievements",
        "skills",
        "experience",
        "education",
        "certifications",
        "projects",
        "additionalInfo",
        "references"
    ],
    sectionTitles: {
        summary: "PROFESSIONAL SUMMARY",
        keyAchievements: "CAREER HIGHLIGHTS",
        achievements: "CAREER HIGHLIGHTS",
        skills: "TECHNICAL SKILLS",
        experience: "EXPERIENCE"
    },
    hasJobMatchRun: true,
    jobDescription: "Senior Product Designer at Spark - Fintech & Design Systems",
    agentMessages: [
        {
            id: "msg_tailor_exp",
            sender: "agent",
            timestamp: Date.now() - 60000,
            type: "text",
            text: "...quality and fostering a culture of growth and innovation, directly contributing to the successful launch of multiple high impact projects.\n\nAll 3 work experiences have been tailored with Google XYZ impact bullets and target keywords.",
            actionPrompt: {
                label: "Proceed to Core Skills",
                stepDescription: "Would you like to proceed to **Harmonize Core Skills** to align your domain competencies for ATS algorithms?",
                onClickType: "harmonize_skills"
            }
        },
        {
            id: "msg_skills_strat",
            sender: "agent",
            timestamp: Date.now() - 30000,
            type: "proposal",
            text: "Here is your **Skills Strategy**: Harmonized your skills list to match the target job priorities for **Senior Product Designer**:",
            proposal: {
                section: "skills",
                title: "Harmonized Core Skills & ATS Competencies",
                proposed: "Figma, Product Design, User Experience, User Interface, Prototyping, Mock-ups, Customer Experience, Fintech Solutions, Implementation, Design Leadership",
                proposedSkills: "Figma, Product Design, User Experience, User Interface, Prototyping, Mock-ups, Customer Experience, Fintech Solutions, Implementation, Design Leadership",
                applied: true
            }
        },
        {
            id: "msg_done",
            sender: "agent",
            timestamp: Date.now() - 10000,
            type: "text",
            text: "All Step-by-Step Tailoring Actions Complete!\n\nYour resume is now fully aligned with the target role and optimized for ATS algorithms and executive recruiters."
        }
    ] as any
};

export default function ScreenshotEditorPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Load Sarah Jenkins JPN Resume data directly
    const [resumeData, setResumeDataState] = useState<ResumeData>(JPN_SARAH_JENKINS_DATA);

    // Selected template: apex
    const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>('apex');

    // Full pro subscription so all templates, features, and export buttons are unlocked
    const proSubscription: UserSubscription = {
        id: 'screenshot_sub',
        userId: 'screenshot_user',
        planId: 'lifetime',
        status: 'active',
        credits: 999999,
        maxResumes: 999,
        unlimitedTailoring: true,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3650).toISOString(),
    };

    const setResumeData = useCallback((data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
        setResumeDataState((prev) => {
            return typeof data === 'function' ? data(prev) : data;
        });
    }, []);

    const setSelectedTemplate = useCallback((template: TemplateType | ((prev: TemplateType) => TemplateType)) => {
        setSelectedTemplateState((prev) => {
            return typeof template === 'function' ? template(prev) : template;
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-brand-bg text-brand-dark flex flex-col">
            <Editor
                data={resumeData}
                onChange={(newData) => {
                    setResumeData(newData);
                }}
                template={selectedTemplate}
                onTemplateChange={(template) => {
                    setSelectedTemplate(template);
                    const updatedData = { ...resumeData, template };
                    setResumeData(updatedData);
                }}
                onBack={() => {
                    navigate('/');
                }}
                onSave={(data) => {
                    if (data) setResumeData(data);
                    showToast('Resume saved successfully', 'success');
                }}
                onSaveAsTemplate={(data) => {
                    if (data) setResumeData(data);
                    showToast('Saved as template', 'success');
                }}
                userSubscription={proSubscription}
                onAIAction={() => true}
                onShowPaywall={() => {}}
            />
        </div>
    );
}
