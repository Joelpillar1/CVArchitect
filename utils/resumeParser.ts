import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { ResumeData } from '../types';
import { callAIJSON } from '../services/aiService';
import { getSkillExtractionService } from '../services/skillExtractionService';
import { formatAllResumeBullets, ensureBulletEndsWithPeriod } from './templateUtils';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const parseResume = async (file: File, onProgress?: (progress: number) => void): Promise<Partial<ResumeData>> => {
    let text = '';
    const extractStart = performance.now();
    console.log('Starting resume parsing for file:', file.name, file.type, 'Size:', file.size);

    try {
        if (file.type === 'application/pdf') {
            text = await extractTextFromPDF(file);
            console.log('Extracted text length from PDF:', text.length);

            // If PDF extraction yielded minimal text, try OCR
            if (text.trim().length < 100) {
                console.log('PDF text extraction yielded minimal text. Attempting OCR...');
                onProgress?.(30);
                const ocrText = await extractTextWithOCR(file, onProgress);
                if (ocrText.length > text.length) {
                    console.log('OCR found more text:', ocrText.length, 'chars');
                    text = ocrText;
                }
            }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            text = await extractTextFromDocx(file);
            console.log('Extracted text length from DOCX:', text.length);
        } else if (file.type.startsWith('image/')) {
            // Direct image upload - use OCR
            console.log('Image file detected, using OCR...');
            text = await extractTextWithOCR(file, onProgress);
            console.log('OCR extracted text length:', text.length);
        } else {
            throw new Error('Unsupported file type. Please upload a PDF, DOCX, or image file.');
        }

        if (!text.trim()) {
            throw new Error('No text could be extracted from the file. Please ensure the file contains readable text.');
        }

        console.log('Text extraction completed in', (performance.now() - extractStart).toFixed(2), 'ms');
        onProgress?.(80);

        // Try AI parsing first (more accurate)
        try {
            console.log('Attempting AI-powered resume parsing...');
            const aiData = await parseWithAI(text);
            console.log('AI parsing succeeded!');
            onProgress?.(100);
            return formatAllResumeBullets(aiData);
        } catch (aiError) {
            console.warn('AI parsing failed, falling back to regex parser:', aiError);
            onProgress?.(90);
            // Fallback to regex-based parser
            const fallbackData = parseTextToResumeData(text);
            onProgress?.(100);
            return formatAllResumeBullets(fallbackData);
        }
    } catch (error) {
        console.error('Resume parsing failed:', error);
        throw error;
    }
};

/**
 * Extract text from PDF file using PDF.js
 */
const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText;
};

/**
 * Extract text from DOCX file using Mammoth
 */
const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

/**
 * Extract text using Tesseract OCR (for scanned PDFs or images)
 */
const extractTextWithOCR = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    try {
        let imageUrls: string[] = [];

        if (file.type === 'application/pdf') {
            imageUrls = await convertPDFToImages(file);
        } else {
            imageUrls = [URL.createObjectURL(file)];
        }

        let allText = '';
        const totalImages = imageUrls.length;

        for (let i = 0; i < totalImages; i++) {
            const result = await Tesseract.recognize(
                imageUrls[i],
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            const imageProgress = m.progress || 0;
                            const totalProgress = 30 + Math.round(((i + imageProgress) / totalImages) * 40);
                            onProgress?.(totalProgress);
                        }
                    }
                }
            );
            allText += result.data.text + '\n\n';
        }

        // Clean up blob URLs
        imageUrls.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });

        return allText;
    } catch (error) {
        console.error('OCR extraction failed:', error);
        throw new Error('OCR processing failed. The image quality may be too low or the file is corrupted.');
    }
};

/**
 * Convert PDF pages to images for OCR processing
 */
const convertPDFToImages = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageUrls: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
        }).promise;

        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });

        imageUrls.push(URL.createObjectURL(blob));
    }

    return imageUrls;
};


// AI-Powered Parsing using Edge Function
const parseWithAI = async (text: string): Promise<Partial<ResumeData>> => {
    const prompt = `You are an expert resume parser. Extract ALL information from this resume and return it in a structured JSON format. Pay meticulous attention to EVERY section present in the resume without dropping or skipping any content.

Resume Text:
${text}

Extract the following information and return ONLY valid JSON (no markdown, no code blocks):

{
  "fullName": "Full name of the person",
  "email": "Email address",
  "phone": "Phone number",
  "linkedin": "LinkedIn profile URL or handle (if present, else empty string)",
  "location": "City, State/Country (if present, else empty string)",
  "jobTitle": "Current or most recent job title (if present, else empty string)",
  "summary": "Professional summary or objective or profile (if present, else empty string)",
  "skills": "Comma-separated list of individual discrete skill entities from explicit skills/competencies sections (e.g. 'Figma, SQL, React, Product Strategy'). Do NOT include full sentences, paragraphs, or responsibilities as skills.",
  "keyAchievements": "Bullet-pointed list or array of key achievements / career highlights if present under sections named 'Career Highlights', 'Career Highlight', 'Key Achievements', 'Professional Highlights', 'Core Highlights', 'Accomplishments', 'Key Accomplishments', 'Selected Achievements', 'Notable Achievements', 'Milestones', or 'Executive Highlights' (use • for bullets or return array of bullet strings, else empty string)",
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "location": "City, State",
      "startDate": "Start date (format: Month Year)",
      "endDate": "End date (format: Month Year or 'Present')",
      "description": "Bullet points of responsibilities and achievements (use • for bullets)"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School/University name",
      "location": "City, State",
      "graduationDate": "Graduation date (format: Month Year)",
      "gpa": "GPA if mentioned",
      "relevantCourses": "Relevant courses if mentioned"
    }
  ],
  "certifications": [
    {
      "name": "Certification or license name",
      "issuer": "Issuing organization",
      "date": "Date obtained (format: Month Year)"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description / bullet points (use • for bullets)",
      "technologies": "Technologies used",
      "link": "Project link if available"
    }
  ],
  "leadership": [
    {
      "role": "Leadership or volunteer role title",
      "company": "Organization name",
      "location": "City, State",
      "startDate": "Start date",
      "endDate": "End date",
      "description": "Bullet points of leadership/volunteer contributions (use • for bullets)"
    }
  ],
  "languages": "Comma-separated list of spoken/written languages if explicitly present (else empty string)",
  "awards": "Bullet-pointed list of awards / honors if present (use • for bullets, else empty string)",
  "publications": "Bullet-pointed list of publications / speaking / papers if present (use • for bullets, else empty string)",
  "coursework": [
    {
      "courseName": "Course name",
      "institution": "Institution name (if present)",
      "year": "Year (if present)",
      "skills": "Skills / topics covered (if present)",
      "description": "Course description (if present)"
    }
  ],
  "additionalInfo": [
    {
      "label": "Custom section title (e.g. Volunteer Experience, Publications, Awards, Interests, Affiliations)",
      "value": "Content of the custom section"
    }
  ],
  "references": "References information if present (else empty string)"
}

CRITICAL RULES:
- ONLY extract information that is EXPLICITLY present in the resume text. Do NOT hallucinate, invent, or add default/placeholder information.
- If a section or field is not present in the resume, return an empty string "" or empty array [].
- ALWAYS extract 'Career Highlights', 'Career Highlight', 'Highlights', 'Key Achievements', 'Accomplishments' into 'keyAchievements'. Do NOT drop this section!
- Extract discrete skill entities only (e.g., 'Web3', 'DeFi', 'Solana', 'Figma', 'TypeScript').
- DO NOT extract full sentences, paragraphs, or responsibilities as skills.
- DO NOT copy narrative text from Professional Experience or Summary into skills.
- Format dates consistently.
- Ensure each and every bullet point in experience descriptions, projects, key achievements/career highlights, leadership, and custom sections ends with a full-stop (period '.').
- Return ONLY valid JSON.`;

    // Call Edge Function for AI parsing
    const parsed = await callAIJSON(prompt, 'gpt-4o', 0.1);

    // Run Two-Stage Skill Extraction service on raw text as ground-truth validation
    const skillService = getSkillExtractionService();
    const docSkills = skillService.extractSkills(text);

    let finalSkills = '';
    if (docSkills.allSkills.length > 0) {
        finalSkills = docSkills.allSkills.join(', ');
    } else if (parsed.skills) {
        // Sanitize AI-extracted skills through the strict validator
        const rawAiSkills = typeof parsed.skills === 'string' ? parsed.skills.split(',') : (Array.isArray(parsed.skills) ? parsed.skills : []);
        const validated = rawAiSkills
            .map((s: string) => skillService.validateAndCleanSkill(s))
            .filter((s: string | null): s is string => Boolean(s));
        finalSkills = validated.join(', ');
    }

    // Comprehensive Fallback Extraction for Key Achievements / Career Highlights
    let rawAchievements: any =
        parsed.keyAchievements ||
        parsed.careerHighlights ||
        parsed.careerHighlight ||
        parsed.highlights ||
        parsed.keyHighlights ||
        parsed.professionalHighlights ||
        parsed.coreHighlights ||
        parsed.achievements ||
        parsed.accomplishments ||
        parsed.keyAccomplishments ||
        parsed.majorAccomplishments ||
        parsed.notableAchievements ||
        parsed.selectedAchievements ||
        parsed.milestones ||
        parsed.executiveHighlights ||
        '';

    // Scan additionalInfo for trapped Career Highlights / Key Achievements
    let filteredAdditionalInfo: any[] = Array.isArray(parsed.additionalInfo) ? [...parsed.additionalInfo] : [];

    if (Array.isArray(filteredAdditionalInfo)) {
        const highlightIndices: number[] = [];
        filteredAdditionalInfo.forEach((info: any, idx: number) => {
            if (!info || typeof info.label !== 'string') return;
            const label = info.label.toLowerCase().trim();
            if (
                /^(career\s*highlights?|key\s*highlights?|professional\s*highlights?|core\s*highlights?|highlights?|key\s*achievements?|achievements?|accomplishments?|key\s*accomplishments?|major\s*accomplishments?|notable\s*achievements?|selected\s*achievements?|executive\s*highlights?|milestones?)$/i.test(label)
            ) {
                if (!rawAchievements || (typeof rawAchievements === 'string' && !rawAchievements.trim()) || (Array.isArray(rawAchievements) && rawAchievements.length === 0)) {
                    rawAchievements = info.value;
                }
                highlightIndices.push(idx);
            }
        });

        // Remove trapped highlight items from additionalInfo
        if (highlightIndices.length > 0) {
            filteredAdditionalInfo = filteredAdditionalInfo.filter((_, idx) => !highlightIndices.includes(idx));
        }
    }

    // Normalize rawAchievements to string or string array
    let normalizedAchievements: string | string[] = '';
    if (Array.isArray(rawAchievements)) {
        normalizedAchievements = rawAchievements
            .map((item: any) => {
                if (typeof item === 'string') return item.trim();
                if (item && typeof item === 'object') {
                    return (item.text || item.description || item.achievement || item.highlight || item.title || '').trim();
                }
                return '';
            })
            .filter(Boolean);
    } else if (typeof rawAchievements === 'string') {
        normalizedAchievements = rawAchievements.trim();
    }

    // Preserve custom section title for achievements if original resume used "Career Highlights"
    const sectionTitles: Record<string, string> = {};
    if (
        parsed.careerHighlights ||
        parsed.careerHighlight ||
        /career\s*highlights?/i.test(text.slice(0, 3000))
    ) {
        sectionTitles.achievements = 'Career Highlights';
    }

    // Transform to match ResumeData structure
    const resumeData: Partial<ResumeData> = {
        fullName: parsed.fullName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        linkedin: parsed.linkedin || '',
        location: parsed.location || '',
        address: parsed.location || '',
        jobTitle: parsed.jobTitle || '',
        summary: parsed.summary || '',
        skills: finalSkills,
        keyAchievements: normalizedAchievements,
        experience: (parsed.experience || []).map((exp: any, index: number) => ({
            id: `exp_${Date.now()}_${index}`,
            role: exp.role || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || '',
        })),
        education: (parsed.education || []).map((edu: any, index: number) => ({
            id: `edu_${Date.now()}_${index}`,
            degree: edu.degree || '',
            school: edu.school || edu.institution || edu.university || '',
            year: edu.year || edu.graduationDate || edu.date || '',
            gpa: edu.gpa || '',
            relevantCourses: edu.relevantCourses || edu.courses || '',
        })),
        certifications: (parsed.certifications || []).map((cert: any, index: number) => ({
            id: `cert_${Date.now()}_${index}`,
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
        })),
        projects: (parsed.projects || []).map((proj: any, index: number) => ({
            id: `proj_${Date.now()}_${index}`,
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            link: proj.link || '',
        })),
        leadership: (parsed.leadership || []).map((lead: any, index: number) => ({
            id: `lead_${Date.now()}_${index}`,
            role: lead.role || '',
            company: lead.company || '',
            location: lead.location || '',
            startDate: lead.startDate || '',
            endDate: lead.endDate || '',
            description: lead.description || '',
        })),
        awards: parsed.awards || '',
        publications: parsed.publications || '',
        coursework: (parsed.coursework || []).map((cw: any, index: number) => ({
            id: `cw_${Date.now()}_${index}`,
            courseName: cw.courseName || '',
            institution: cw.institution || '',
            year: cw.year || '',
            skills: cw.skills || '',
            description: cw.description || '',
        })),
        additionalInfo: filteredAdditionalInfo
            .filter((info: any) => info && (info.label?.trim() || info.value?.trim()))
            .map((info: any, index: number) => ({
                id: `info_${Date.now()}_${index}`,
                label: info.label?.trim() || '',
                value: info.value?.trim() || '',
            })),
        referee: parsed.references || '',
        sectionTitles: Object.keys(sectionTitles).length > 0 ? sectionTitles : undefined,
    };

    // Handle languages if parsed explicitly and not already present in additionalInfo
    if (parsed.languages && typeof parsed.languages === 'string' && parsed.languages.trim()) {
        const hasLangInAdditional = (resumeData.additionalInfo || []).some(
            item => item.label.toLowerCase().includes('language')
        );
        if (!hasLangInAdditional) {
            resumeData.additionalInfo = resumeData.additionalInfo || [];
            resumeData.additionalInfo.push({
                id: `lang_${Date.now()}`,
                label: 'Languages',
                value: parsed.languages.trim()
            });
        }
    }

    return formatAllResumeBullets(resumeData);
};

/**
 * Recognized section header synonyms for Career Highlights / Key Achievements
 */
export const ACHIEVEMENT_SECTION_SYNONYMS = [
    'career highlights',
    'career highlight',
    'key achievements',
    'key achievement',
    'achievements',
    'achievement',
    'key highlights',
    'key highlight',
    'professional highlights',
    'professional highlight',
    'core highlights',
    'core highlight',
    'highlights',
    'highlight',
    'accomplishments',
    'accomplishment',
    'key accomplishments',
    'key accomplishment',
    'major accomplishments',
    'major accomplishment',
    'selected achievements',
    'notable achievements',
    'notable accomplishments',
    'executive highlights',
    'milestones',
    'career milestones',
    'career summary & highlights',
    'highlights of qualifications',
    'highlights & achievements',
    'achievements & awards',
];

/**
 * Recognized section header synonyms for Skills across resume formats.
 */
export const SKILL_SECTION_SYNONYMS = [
    'skills',
    'skill',
    'core competencies',
    'core competency',
    'core competence',
    'key competencies',
    'technical competencies',
    'technical competence',
    'technical skills',
    'key skills',
    'professional skills',
    'specialized skills',
    'skills & proficiencies',
    'skills and proficiencies',
    'proficiencies',
    'proficiency',
    'areas of expertise',
    'area of expertise',
    'expertise',
    'technologies',
    'technologies & tools',
    'tools & technologies',
    'tools and technologies',
    'technical stack',
    'tech stack',
    'tools and frameworks',
    'tools & frameworks',
    'frameworks & libraries',
    'languages & frameworks',
    'programming languages',
    'domain expertise',
    'functional expertise',
    'key strengths',
    'core capabilities',
    'capabilities',
    'skillset',
    'skill set',
    'specializations',
    'specialities',
    'technical qualifications',
    'core qualifications',
    'qualifications & skills',
];

// Helper to detect section headers
export const isSectionHeader = (line: string): boolean => {
    const baseKeywords = [
        'experience', 'work experience', 'employment', 'employment history', 'work history', 'career history', 'professional experience',
        'education', 'academic background', 'academics', 'academic history',
        'summary', 'professional summary', 'executive summary', 'profile', 'personal profile', 'objective', 'about me',
        'projects', 'personal projects', 'key projects', 'technical projects', 'selected projects',
        'certifications', 'licenses', 'certificates', 'credentials', 'certifications & licenses', 'certifications and licenses',
        'leadership', 'volunteering', 'volunteer experience', 'community involvement',
        'awards', 'honors', 'awards & honors', 'awards and honors',
        'publications', 'papers', 'presentations',
        'languages', 'language proficiency',
        'coursework', 'relevant coursework',
        'interests', 'references', 'referees',
        'additional information',
        ...ACHIEVEMENT_SECTION_SYNONYMS,
        ...SKILL_SECTION_SYNONYMS,
    ];
    const lower = line.toLowerCase().trim().replace(/[:\-_|]+$/, '');
    return baseKeywords.some(k => lower === k) ||
        (line === line.toUpperCase() && line.length < 35 && baseKeywords.some(k => lower.includes(k)));
};

// Fallback: Comprehensive regex and block-based parsing
const parseTextToResumeData = (text: string): Partial<ResumeData> => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const data: Partial<ResumeData> = {
        additionalInfo: [],
        certifications: [],
        projects: [],
        experience: [],
        education: [],
        leadership: [],
        keyAchievements: [],
        referee: '',
    };

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) data.email = emailMatch[0];

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) data.phone = phoneMatch[0];

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
    if (linkedinMatch) {
        data.linkedin = linkedinMatch[0];
    }

    // Extract name (assume first non-empty line that isn't a label)
    if (lines.length > 0) {
        const firstLine = lines[0];
        if (!firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('curriculum')) {
            data.fullName = firstLine;
        } else if (lines.length > 1) {
            data.fullName = lines[1];
        }
    }

    // Helper to find section start index
    const findSectionStart = (keywords: string[], startIndex = 0) => {
        return lines.findIndex((line, index) => {
            if (index < startIndex) return false;
            const lower = line.toLowerCase().trim().replace(/[:\-_|]+$/, '');
            return keywords.some(k =>
                lower === k ||
                lower === k + ':' ||
                lower.startsWith(k + ':') ||
                lower.startsWith(k + ' -') ||
                lower.startsWith(k + ' |') ||
                lower.endsWith(k)
            );
        });
    };

    // Extract Summary
    const summaryKeywords = ['summary', 'professional summary', 'executive summary', 'profile', 'personal profile', 'about me', 'career objective', 'objective'];
    const summaryStart = findSectionStart(summaryKeywords);

    if (summaryStart !== -1) {
        const summaryLines: string[] = [];
        for (let i = summaryStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            summaryLines.push(line);
        }
        data.summary = summaryLines.join(' ');
    }

    // Extract Career Highlights / Key Achievements
    const achieveStart = findSectionStart(ACHIEVEMENT_SECTION_SYNONYMS);
    if (achieveStart !== -1) {
        const achieveBullets: string[] = [];
        const headerLine = lines[achieveStart].toLowerCase();
        if (headerLine.includes('career highlight')) {
            data.sectionTitles = { ...(data.sectionTitles || {}), achievements: 'Career Highlights' };
        }

        for (let i = achieveStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            const cleaned = line.replace(/^[•\-\*\u2022\u2023\u25E6\u2043\u2219]\s*/, '').trim();
            if (cleaned.length > 3) {
                achieveBullets.push(ensureBulletEndsWithPeriod(cleaned));
            }
        }
        if (achieveBullets.length > 0) {
            data.keyAchievements = achieveBullets;
        }
    }

    // Extract Skills using Two-Stage Skill Extraction Pipeline
    const skillResult = getSkillExtractionService().extractSkills(text);
    if (skillResult.allSkills.length > 0) {
        data.skills = skillResult.allSkills.join(', ');
    }

    // Extract Experience (Block Extraction)
    const expKeywords = ['experience', 'work experience', 'employment history', 'work history', 'professional experience', 'career history'];
    const expStart = findSectionStart(expKeywords);

    if (expStart !== -1) {
        data.experience = [];
        let currentExp: any = null;
        let capturingDescription = false;

        for (let i = expStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;

            const dateMatch = line.match(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)/i);

            if (dateMatch) {
                if (currentExp && (currentExp.company || currentExp.role)) {
                    currentExp.id = `exp_${Date.now()}_${data.experience.length}`;
                    data.experience.push(currentExp);
                }

                currentExp = {
                    startDate: dateMatch[1],
                    endDate: dateMatch[3],
                    description: '',
                    role: '',
                    company: '',
                };

                if (i > expStart + 1) {
                    const prevLine = lines[i - 1];
                    if (prevLine && !isSectionHeader(prevLine)) {
                        const parts = prevLine.split(/ at | - |,|\|/);
                        if (parts.length > 1) {
                            currentExp.role = parts[0].trim();
                            currentExp.company = parts[1].trim();
                        } else {
                            currentExp.role = prevLine.trim();
                            currentExp.company = 'Company Name';
                        }
                    }
                }
                capturingDescription = true;
            } else if (capturingDescription && currentExp) {
                if (line.length > 3) {
                    const cleanLine = line.replace(/^[•\-\*\u2022\u2023\u25E6\u2043\u2219]\s*/, '').trim();
                    currentExp.description = (currentExp.description || '') + '• ' + ensureBulletEndsWithPeriod(cleanLine) + '\n';
                }
            }
        }
        if (currentExp && (currentExp.company || currentExp.role)) {
            currentExp.id = `exp_${Date.now()}_${data.experience.length}`;
            data.experience.push(currentExp);
        }
    }

    // Extract Education
    const eduKeywords = ['education', 'academic background', 'academics', 'academic history', 'qualifications'];
    const eduStart = findSectionStart(eduKeywords);
    if (eduStart !== -1) {
        data.education = [];
        for (let i = eduStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;

            const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/);
            const degreeMatch = line.match(/(Bachelor|Master|Doctor|Ph\.?D|B\.?S|B\.?A|M\.?S|M\.?A|B\.?Tech|M\.?Tech|Associate|Diploma|Degree)/i);

            if (degreeMatch || yearMatch || line.includes('University') || line.includes('College') || line.includes('School') || line.includes('Institute')) {
                const parts = line.split(/,|-|\|/);
                data.education.push({
                    id: `edu_${Date.now()}_${data.education.length}`,
                    degree: parts[0]?.trim() || line,
                    school: parts[1]?.trim() || (parts[0]?.trim() || 'University'),
                    year: yearMatch ? yearMatch[0] : '',
                });
            }
        }
    }

    // Extract Certifications
    const certKeywords = ['certifications', 'licenses', 'certificates', 'credentials', 'certifications & licenses'];
    const certStart = findSectionStart(certKeywords);
    if (certStart !== -1) {
        data.certifications = [];
        for (let i = certStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            const cleaned = line.replace(/^[•\-\*\u2022\u2023\u25E6\u2043\u2219]\s*/, '').trim();
            if (cleaned.length > 2) {
                const dateMatch = cleaned.match(/\b(19\d{2}|20\d{2})\b/);
                data.certifications.push({
                    id: `cert_${Date.now()}_${data.certifications.length}`,
                    name: cleaned.replace(/\b(19\d{2}|20\d{2})\b/, '').trim(),
                    issuer: '',
                    date: dateMatch ? dateMatch[0] : '',
                });
            }
        }
    }

    // Extract Projects
    const projKeywords = ['projects', 'key projects', 'personal projects', 'technical projects', 'selected projects'];
    const projStart = findSectionStart(projKeywords);
    if (projStart !== -1) {
        data.projects = [];
        for (let i = projStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            const cleaned = line.replace(/^[•\-\*\u2022\u2023\u25E6\u2043\u2219]\s*/, '').trim();
            if (cleaned.length > 3) {
                data.projects.push({
                    id: `proj_${Date.now()}_${data.projects.length}`,
                    name: cleaned.split(/[:\-–]/)[0]?.trim() || 'Project',
                    description: ensureBulletEndsWithPeriod(cleaned),
                    technologies: '',
                });
            }
        }
    }

    // Extract Languages
    const langKeywords = ['languages', 'language proficiency'];
    const langStart = findSectionStart(langKeywords);
    if (langStart !== -1) {
        const langLines: string[] = [];
        for (let i = langStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            langLines.push(line.replace(/^[•\-\*\u2022\u2023\u25E6\u2043\u2219]\s*/, '').trim());
        }
        if (langLines.length > 0) {
            data.additionalInfo = data.additionalInfo || [];
            data.additionalInfo.push({
                id: `lang_${Date.now()}`,
                label: 'Languages',
                value: langLines.join(', ')
            });
        }
    }

    return formatAllResumeBullets(data);
};

