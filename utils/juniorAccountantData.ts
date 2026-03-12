import { ResumeData } from '../types';

export const JUNIOR_ACCOUNTANT_RESUME_DATA: ResumeData = {
    fullName: "William Clarkson",
    jobTitle: "Junior Accountant",
    email: "williamclarkson@email.com",
    phone: "(555) 555-1234",
    atHandle: "",
    linkedin: "LinkedIn",
    location: "Davis, CA",
    address: "",
    summary: "Results-driven Junior Accountant with a Bachelor of Business Administration in Accounting and ongoing pursuit of CPA certification. Demonstrated expertise in financial analysis, reporting, and accounting software implementation. Proven track record of delivering measurable results, including a 10% reduction in unnecessary expenses through strategic analysis and a 20% increase in efficiency through software integration. Recognized for accuracy, efficiency, and commitment to compliance with GAAP and regulatory standards.",
    experience: [
        {
            id: '1',
            company: 'Green Balance',
            role: 'Junior Accountant',
            location: 'Davis, CA',
            startDate: '2022-04',
            endDate: 'Present',
            description: [
                'Conducted monthly financial analysis to identify variances and trends, resulting in a 10% reduction in unnecessary expenses.',
                'Assisted in the preparation of quarterly financial statements, ensuring accuracy and compliance with regulatory standards.',
                'Implemented new accounting software, resulting in a 20% increase in efficiency in financial reporting processes.',
                'Managed accounts payable and accounts receivable functions, reducing outstanding balances by 15% within six months.',
                'Reconciled bank statements and resolved discrepancies, leading to a 98% accuracy rate in financial records.'
            ]
        },
        {
            id: '2',
            company: 'FinoPro',
            role: 'Accounting Assistant',
            location: 'Davis, CA',
            startDate: '2018-05',
            endDate: '2022-04',
            description: [
                'Assisted senior accountants in preparing tax returns for clients, resulting in a 20% decrease in errors compared to the previous year.',
                'Conducted audits of financial transactions to ensure compliance with internal policies and regulatory requirements.',
                'Provided support in month-end closing activities, including journal entries and balance sheet reconciliations.'
            ]
        }
    ],
    education: [
        {
            id: '1',
            school: 'University of California, Davis',
            degree: 'Bachelor of Business Administration Accounting',
            year: 'Apr 2018'
        }
    ],
    skills: "Account Monitoring, Financial Modeling, Tax Planning, Accounts Payable, Cost Accounting, Financial Reporting, Account Analysis, Account Reconciliation, Financial Analysis, Accounts Receivable, Invoicing, Payroll, Auditing, Excel, QuickBooks, Organizational Skills, Problem-Solving, Communication Skills, Generally Accepted Accounting Principles (GAAP), Analytical Skills, Data Visualization, ADP Workforce Now, Expensify",
    certifications: [
        {
            id: '1',
            name: 'Certified Public Accountant (CPA)',
            issuer: 'In-Progress',
            date: '2026',
            link: ''
        },
        {
            id: '2',
            name: 'Certified Management Accountant (CMA)',
            issuer: 'In-Progress',
            date: '2026',
            link: ''
        }
    ],
    projects: [],
    leadership: [],
    additionalInfo: [],
    keyAchievements: [],
    jobDescription: "",
    referee: "Available upon request",
    font: 'Inter, sans-serif',
    fontSizes: {
        header: 22,
        jobTitle: 12,
        sectionTitle: 14,
        body: 10,
    },
    lineHeight: 1.5,
    sectionGap: 0.18,
    headerGap: 0.20,
    headerItemGap: 0.10,
    margins: {
        horizontal: 0.5,
        vertical: 0.5,
    },
    currentTag: 'accountant-sample',
    language: 'en',
    accentColor: '#0870b8',
    headerAlignment: 'center',
    bodyHeaderAlignment: 'left',
    contentAlignment: 'left',
    skillsColumnCount: 3,
    sectionOrder: [
        'summary',
        'education',
        'experience',
        'skills',
        'certifications'
    ],
    source: 'scratch',
    hasJobMatchRun: false,
};
