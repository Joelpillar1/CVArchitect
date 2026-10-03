import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import { ResumeData, TemplateType } from '../types';
import { UserSubscription } from '../types/pricing';
import { useToast } from '../contexts/ToastContext';

export const JPN_RESUME_DATA: ResumeData = {
    fullName: "Joel Pillar",
    jobTitle: "Senior Product Designer",
    email: "joelpillar51@gmail.com",
    phone: "",
    address: "",
    location: "",
    linkedin: "linkedin.com/in/joelpillar",
    atHandle: "",
    referee: "",
    language: "en",
    font: "Helvetica, Arial, sans-serif",
    template: "styled",
    source: "upload",
    currentTag: "JP N SPD",
    resumeTitle: "JP N SPD",
    accentColor: "#000000",
    headerAlignment: "center",
    contentAlignment: "left",
    bodyHeaderAlignment: "left",
    skillsColumnCount: 3,
    headerGap: 0.15,
    sectionGap: 0.14,
    headerItemGap: 0.08,
    lineHeight: 1.4,
    margins: {
        vertical: 0.1,
        horizontal: 0.1
    },
    fontSizes: {
        body: 8.5,
        header: 20,
        jobTitle: 10,
        sectionTitle: 13
    },
    summary: "Dynamic Senior Product Designer with over 5 years of expertise in creating innovative and impactful brand solutions for digital and print mediums. Skilled in transforming complex ideas into engaging designs with a contemporary edge, I am committed to advancing B2B marketing efforts within the medical technology industry. Known for my strategic conceptual thinking and meticulous execution, I am passionate about driving brand growth and delivering exceptional visual experiences.",
    keyAchievements: "• Led the design and execution of a brand campaign that successfully launched to over 10,000 healthcare professionals, meeting all defined objectives.\n• Developed a comprehensive product launch toolkit, including brandmarks and landing pages, that streamlined marketing processes and enhanced brand consistency.\n• Executed a series of high-impact digital ad campaigns, improving client engagement and conversion rates significantly.\n• Spearheaded design solutions that supported a 15% reduction in project timelines by optimizing team workflows and processes.",
    skills: "Adobe InDesign, Adobe Illustrator, Adobe Photoshop, Figma, Adobe After Effects, Email Campaign Builders, Motion Design, HTML and CSS",
    experience: [
        {
            id: "exp_1",
            role: "Lead Product Designer",
            company: "Superteam",
            startDate: "Apr 2024",
            endDate: "2026-01",
            location: "",
            description: "• Directed a team of 5 designers at Superteam, fostering innovation through user-centered methodologies and improving design quality across the Solana ecosystem.\n• Conducted comprehensive user research and usability testing, advancing product usability and transforming user experience through strategic insights.\n• Spearheaded multiple innovative product concepts, aligning them with business objectives and cultivating a culture of continuous learning.\n• Redesigned core workflows at Nanopay, significantly reducing user errors and support tickets, enhancing overall user satisfaction and efficiency."
        },
        {
            id: "exp_2",
            role: "Senior UI/UX Designer",
            company: "Nanopay",
            startDate: "Jul 2024",
            endDate: "Apr 2025",
            location: "",
            description: "• Crafted an extensive design system with 60+ components at Nanopay, reducing design inconsistencies and expediting project handoffs to cross-functional teams.\n• Collaborated with teams to deliver responsive applications to over 5,000 daily active users, ensuring timely and within-scope feature delivery.\n• Managed the design of a blockchain-powered real estate product at MyPropOutAI, meeting strategic goals and all roadmap milestones.\n• Developed Web3 concepts that drove adoption and engagement, blending usability for new and advanced users."
        },
        {
            id: "exp_3",
            role: "Lead Product Designer",
            company: "MyPropOutAI",
            startDate: "Dec 2023",
            endDate: "May 2024",
            location: "",
            description: "• Led a team of 4 designers at MyPropOutAI, elevating design outputs and maintaining strategic alignment with business objectives.\n• Designed intuitive web and mobile interfaces at GameStar Exchange using Figma, significantly improving user satisfaction and reducing bounce rates.\n• Created detailed personas and journey maps for 10+ product features, enhancing task completion rates and user engagement.\n• Facilitated smooth design-to-development handoffs, ensuring design consistency and reducing delivery time."
        },
        {
            id: "exp_4",
            role: "UI/UX Designer",
            company: "GameStar Exchange",
            startDate: "Sept 2022",
            endDate: "Jan 2024",
            location: "",
            description: "• Designed intuitive web and mobile interfaces using Figma, resulting in a significant improvement in user satisfaction and reduced bounce rates.\n• Created detailed personas, journey maps, and prototypes for over 10 product features, enhancing task completion rates and user engagement.\n• Partnered with developers to ensure smooth design-to-development handoffs, maintaining design consistency and reducing delivery time."
        }
    ],
    education: [
        {
            id: "edu_1",
            school: "Ahmadu Bello University",
            degree: "B.Sc Computer Science",
            year: "2026",
            gpa: "",
            relevantCourses: ""
        },
        {
            id: "edu_2",
            school: "Bayero University",
            degree: "B.Sc Mathematics",
            year: "2023",
            gpa: "",
            relevantCourses: ""
        }
    ],
    certifications: [
        {
            id: "cert_1",
            name: "Google UX Design",
            issuer: "Google",
            date: "2024"
        },
        {
            id: "cert_2",
            name: "Graphic Design Certificate",
            issuer: "DesignersDAO",
            date: "2023"
        }
    ],
    projects: [],
    leadership: [],
    additionalInfo: [
        {
            id: "add_1",
            label: "Languages",
            value: "English (Native), Spanish (Fluent)"
        },
        {
            id: "add_2",
            label: "Interests",
            value: "Open Source Contributing, Tech Blogging, Hiking"
        }
    ],
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
    hasJobMatchRun: true,
    jobDescription: "At Spark, we deliver brand solutions that build consistent, impactful brand perceptions across all consumer touchpoints. We’re on the hunt for a confident and outgoing Senior Designer with 5+ years of experience to join our team, supporting B2B marketing initiatives primarily in the medical technology sector."
};

export default function ScreenshotEditorPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Load JPN Resume data directly
    const [resumeData, setResumeDataState] = useState<ResumeData>(JPN_RESUME_DATA);

    // Selected template defaults to the resume's template ("styled")
    const [selectedTemplate, setSelectedTemplateState] = useState<TemplateType>(
        (JPN_RESUME_DATA.template as TemplateType) || 'styled'
    );

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
