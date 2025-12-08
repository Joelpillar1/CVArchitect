import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import { ResumeData } from '../types';

// Initialize PDF.js worker
// Use local worker file copied to public directory for maximum reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Initialize OpenAI
const getOpenAI = () => {
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    if (!apiKey) {
        console.warn('VITE_OPENAI_API_KEY not found. Falling back to basic parsing.');
        return null;
    }
    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
};

export const parseResume = async (file: File): Promise<Partial<ResumeData>> => {
    let text = '';
    console.log('Starting resume parsing for file:', file.name, file.type);

    try {
        if (file.type === 'application/pdf') {
            text = await extractTextFromPDF(file);
            console.log('Extracted text length from PDF:', text.length);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            text = await extractTextFromDocx(file);
            console.log('Extracted text length from DOCX:', text.length);
        } else {
            throw new Error('Unsupported file type');
        }

        // Try AI-powered parsing first, fall back to regex if unavailable
        const openai = getOpenAI();
        console.log('OpenAI initialized:', !!openai);

        if (openai && text.length > 50) {
            console.log('Attempting AI parsing...');
            const result = await parseWithAI(text, openai);
            console.log('AI parsing result keys:', Object.keys(result));
            return result;
        } else {
            console.log('Falling back to regex parsing (No OpenAI or text too short)');
            return parseTextToResumeData(text);
        }
    } catch (error) {
        console.error('Error parsing resume:', error);
        // Fall back to basic parsing
        return parseTextToResumeData(text);
    }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
};

const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

// AI-Powered Parsing using OpenAI
const parseWithAI = async (text: string, openai: OpenAI): Promise<Partial<ResumeData>> => {
    try {
        const prompt = `You are an expert resume parser. Extract ALL information from this resume and return it in a structured JSON format.

Resume Text:
${text}

Extract the following information and return ONLY valid JSON (no markdown, no code blocks):

{
  "fullName": "Full name of the person",
  "email": "Email address",
  "phone": "Phone number",
  "location": "City, State/Country",
  "jobTitle": "Current or most recent job title",
  "summary": "Professional summary or objective (if present)",
  "skills": "Comma-separated list of all skills mentioned",
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
      "gpa": "GPA if mentioned"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "Date obtained (format: Month Year)"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "technologies": "Technologies used",
      "link": "Project link if available"
    }
  ],
  "keyAchievements": "Bullet-pointed list of key achievements (use • for bullets)",
  "languages": "Comma-separated list of languages",
  "references": "References information if present"
}

IMPORTANT:
- Extract ALL information present in the resume
- Use bullet points (•) for lists
- Format dates consistently
- If a field is not present, use empty string or empty array
- Return ONLY the JSON object, no explanations`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.1, // Low temperature for consistent extraction
        });

        const result = completion.choices[0].message.content?.trim() || '{}';
        const parsed = JSON.parse(result);

        // Transform to match ResumeData structure
        const resumeData: Partial<ResumeData> = {
            fullName: parsed.fullName || '',
            email: parsed.email || '',
            phone: parsed.phone || '',
            location: parsed.location || '',
            address: parsed.location || '',
            jobTitle: parsed.jobTitle || '',
            summary: parsed.summary || '',
            skills: parsed.skills || '',
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
                institution: edu.institution || '',
                location: edu.location || '',
                graduationDate: edu.graduationDate || '',
                gpa: edu.gpa || '',
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
            keyAchievements: parsed.keyAchievements || '',
            referee: parsed.references || '',
        };

        // Handle languages by adding to additional info
        if (parsed.languages) {
            resumeData.additionalInfo = resumeData.additionalInfo || [];
            resumeData.additionalInfo.push({
                id: `lang_${Date.now()}`,
                label: 'Languages',
                value: parsed.languages
            });
        }

        return resumeData;
    } catch (error) {
        console.error('AI parsing failed, falling back to regex:', error);
        return parseTextToResumeData(text);
    }
};

// Fallback: Basic regex-based parsing
const parseTextToResumeData = (text: string): Partial<ResumeData> => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const data: Partial<ResumeData> = {};

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) data.email = emailMatch[0];

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) data.phone = phoneMatch[0];

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
    if (linkedinMatch) {
        data.additionalInfo = data.additionalInfo || [];
        data.additionalInfo.push({
            id: `info_${Date.now()}`,
            label: 'LinkedIn',
            value: linkedinMatch[0]
        });
    }

    // Extract name (assume first non-empty line that isn't a label)
    if (lines.length > 0) {
        // Simple heuristic: First line is often the name
        // Avoid lines that look like "Resume", "Curriculum Vitae", etc.
        const firstLine = lines[0];
        if (!firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('curriculum')) {
            data.fullName = firstLine;
        } else if (lines.length > 1) {
            data.fullName = lines[1];
        }
    }

    // Helper to find section start index
    const findSectionStart = (keywords: string[], startIndex = 0) => {
        return lines.findIndex((line, index) =>
            index >= startIndex && keywords.some(k => line.toLowerCase() === k || line.toLowerCase().startsWith(k + ':') || line.toLowerCase().endsWith(k))
        );
    };

    // Extract Summary
    const summaryKeywords = ['summary', 'professional summary', 'profile', 'about me', 'objective'];
    const summaryStart = findSectionStart(summaryKeywords);

    if (summaryStart !== -1) {
        const summaryLines = [];
        for (let i = summaryStart + 1; i < lines.length; i++) {
            const line = lines[i];
            // Stop if we hit another section header (simple heuristic: short line, all caps or specific keywords)
            if (isSectionHeader(line)) break;
            summaryLines.push(line);
        }
        data.summary = summaryLines.join(' ');
    }

    // Extract Skills
    const skillsKeywords = ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'];
    const skillsStart = findSectionStart(skillsKeywords);

    if (skillsStart !== -1) {
        const skillsLines = [];
        for (let i = skillsStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;
            skillsLines.push(line);
        }
        // Clean up skills (remove bullet points, join)
        data.skills = skillsLines.join(', ').replace(/[•·-]/g, '').replace(/\s+/g, ' ').trim();
    }

    // Extract Experience (Simple Block Extraction)
    const expKeywords = ['experience', 'work experience', 'employment history', 'work history', 'professional experience'];
    const expStart = findSectionStart(expKeywords);

    if (expStart !== -1) {
        data.experience = [];
        let currentExp: any = {};
        let capturingDescription = false;

        for (let i = expStart + 1; i < lines.length; i++) {
            const line = lines[i];
            if (isSectionHeader(line)) break;

            // Heuristic: Date ranges often indicate a new job block
            // Matches: "Jan 2020 - Present", "2019-2021", "01/2020 - 02/2021"
            const dateMatch = line.match(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)/i);

            if (dateMatch) {
                // Save previous experience if exists
                if (currentExp.company || currentExp.role) {
                    currentExp.id = `exp_${Date.now()}_${data.experience.length}`;
                    data.experience.push(currentExp);
                }

                // Start new experience
                currentExp = {
                    startDate: dateMatch[1],
                    endDate: dateMatch[3],
                    description: ''
                };

                // Try to find role and company in previous line or current line
                // This is tricky with regex, so we'll just take the line before the date as the Role/Company
                if (i > expStart + 1) {
                    const prevLine = lines[i - 1];
                    if (prevLine && !isSectionHeader(prevLine)) {
                        // Split by " at " or " - " or "," to separate Role and Company
                        const parts = prevLine.split(/ at | - |,|\|/);
                        if (parts.length > 1) {
                            currentExp.role = parts[0].trim();
                            currentExp.company = parts[1].trim();
                        } else {
                            currentExp.role = prevLine.trim();
                            currentExp.company = "Company Name";
                        }
                    }
                }
                capturingDescription = true;
            } else if (capturingDescription) {
                if (line.length > 3) { // Ignore very short lines
                    currentExp.description = (currentExp.description || '') + '• ' + line + '\n';
                }
            }
        }
        // Push last experience
        if (currentExp.company || currentExp.role) {
            currentExp.id = `exp_${Date.now()}_${data.experience.length}`;
            data.experience.push(currentExp);
        }
    }

    // If no experience found, add a placeholder
    if (!data.experience || data.experience.length === 0) {
        data.experience = [{
            id: `exp_${Date.now()}`,
            role: 'Your Role',
            company: 'Company Name',
            location: 'City, Country',
            startDate: 'Start Date',
            endDate: 'Present',
            description: '• Responsibility 1\n• Responsibility 2',
        }];
    }

    return data;
};

// Helper to detect section headers
const isSectionHeader = (line: string): boolean => {
    const keywords = [
        'experience', 'work experience', 'employment', 'education', 'skills',
        'summary', 'profile', 'objective', 'projects', 'certifications',
        'awards', 'languages', 'interests', 'references'
    ];
    const lower = line.toLowerCase().trim();
    // Check if line is exactly a keyword, or starts with a keyword and ends with colon
    return keywords.some(k => lower === k || lower === k + ':') ||
        (line === line.toUpperCase() && line.length < 30 && keywords.some(k => lower.includes(k)));
};
