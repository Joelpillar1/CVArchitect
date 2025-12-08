import OpenAI from 'openai';
import { ResumeData } from '../../types';

// Initialize OpenAI
const getOpenAI = () => {
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    if (!apiKey) {
        console.warn('VITE_OPENAI_API_KEY not found. AI features will not work.');
        return null;
    }
    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
    });
};

export const enhanceDescription = async (
    description: string,
    role: string,
    company: string,
    context?: {
        index: number;
        totalCount: number;
    }
): Promise<string> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    const { index = 0, totalCount = 1 } = context || {};
    const isRecent = index <= 1; // Top 2 jobs
    const isOld = index >= 5; // Older jobs

    // Dynamic rules based on chronological position
    let structuralRule = "";
    if (isRecent) {
        structuralRule = `
        - **DEPTH**: This is a recent/current role. Provide 4-5 detailed bullet points.
        - **FOCUS**: Emphasize Strategy, Leadership, and Impact.
        - **ARCHETYPE 1**: Include at least one "Firefighting" bullet: Describe a specific crisis or difficult problem you resolved.
        - **ARCHETYPE 2**: Include at least one "Legacy" bullet: What system/process did you build that outlasted you?`;
    } else {
        structuralRule = `
        - **BALANCE**: Provide 3-4 strong bullet points.
        - **FOCUS**: Focus on significant milestones and core responsibilities.
        - **ARCHETYPE**: Include one "Problem/Solution" bullet that highlights efficiency or cost-saving.`;
    }

    try {
        const prompt = `You are a strict, senior hiring manager who hates "AI-sounding" resumes. Rewrite the following job description for a "${role}" position at "${company}".
        
        Current Description:
        "${description}"
        
        # STRATEGY: "Intentional Imperfection & Human Variety"
        1. **Analyze Seniority**: Infer if this is Junior, Mid, or Senior based on the title "${role}". Adjust tone accordingly (Junior = Execution, Senior = Strategy).
        2. **Semantic Variation (CRITICAL)**: Do NOT use the same opening verb twice. Do NOT use the same sentence structure twice. 
        3. **Bullet Point Archetypes**:
           - Use a mix of "Quantifiable Result" bullets (X% increase).
           - Use "Problem/Solution" bullets (Resolved X by doing Y).
           - Use "Scope" bullets (Managed team of X, Budget of Y).

        # CHRONOLOGICAL CONTEXT RULES:
        ${structuralRule}

        # FINAL OUTPUT RULES:
        - Return ONLY the rewritten bullet points.
        - Do not output introductory text.
        - Use standard bullet points (•).
        - No "fluff" or buzzwords without substance.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            temperature: 0.7, // Slight increase for creativity/variety
        });

        return completion.choices[0].message.content?.trim() || description;
    } catch (error) {
        console.error('AI Enhancement Error:', error);
        throw new Error('Failed to enhance description. Please check your API key and try again.');
    }
};

export const generateSummary = async (
    resumeData: ResumeData,
    targetRole: string
): Promise<string> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `Write a compelling professional summary for a resume based on the following details.
        
        Target Role: ${targetRole}
        
        Resume Details:
        - Name: ${resumeData.fullName}
        - Current Role: ${resumeData.jobTitle}
        - Experience: ${JSON.stringify(resumeData.experience)}
        - Skills: ${resumeData.skills}
        
        Instructions:
        - Keep it between 3-5 sentences.
        - Highlight key achievements and skills relevant to "${targetRole}".
        - Use a professional, confident tone.
        - Return ONLY the summary text.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        return completion.choices[0].message.content?.trim() || '';
    } catch (error) {
        console.error('AI Summary Generation Error:', error);
        throw new Error('Failed to generate summary.');
    }
};

export const generateBulletPoints = async (
    role: string,
    company: string,
    keywords: string
): Promise<string[]> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `Generate 3-4 high-impact resume bullet points for a "${role}" position at "${company}".
        
        Keywords/Context to include: ${keywords}
        
        Instructions:
        - Use strong action verbs.
        - Focus on achievements and metrics.
        - Return ONLY a JSON array of strings, e.g., ["bullet 1", "bullet 2"].`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content?.trim() || '{"bullets": []}';
        const parsed = JSON.parse(content);
        // Handle different potential JSON structures
        return Array.isArray(parsed) ? parsed : (parsed.bullets || parsed.points || []);
    } catch (error) {
        console.error('AI Bullet Generation Error:', error);
        throw new Error('Failed to generate bullet points.');
    }
};

export const tailorResumeToJob = async (
    resumeData: ResumeData,
    jobDescription: string
): Promise<{
    summary: string;
    experience: { description: string }[];
    skills: string;
    keyAchievements: string;
}> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `You are an expert ATS optimization specialist. Tailor this resume to perfectly match the provided Job Description.

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

CURRENT RESUME:
Summary: ${resumeData.summary}
Skills: ${resumeData.skills}
Experience: ${JSON.stringify(resumeData.experience.map(e => ({ role: e.role, company: e.company, desc: e.description })))}

TASK:
Rewrite the resume content to maximize ATS score and relevance for this specific job.

1. **PROFESSIONAL SUMMARY**:
   - Write a powerful 3-4 sentence hook.
   - Incorporate key job title and top 3 required skills from the JD.
   - Focus on value proposition.

2. **EXPERIENCE BULLETS**:
   - Rewrite the bullet points for the most recent 2-3 roles.
   - Infuse keywords from the JD naturally.
   - Focus on IMPACT and RESULTS, not just responsibilities.
   - 3-4 bullet points per role.
   - Each bullet: 1-2 lines maximum.

3. **SKILLS** (comma-separated):
   - Prioritize skills mentioned in the job description.
   - Include technical skills, tools, methodologies from the job posting.
   - Add relevant industry buzzwords.
   - **STRICT LIMIT: Top 8 most relevant skills ONLY**
   - Order by relevance to the job.

4. **KEY ACHIEVEMENTS** (3-4 bullet points):
   - Create powerful achievement statements using standard STAR method logic, but DO NOT use explicit labels like "Situation:" or "Result:".
   - Merge the Situation, Task, Action, and Result into a single, cohesive, high-impact sentence.
   - Start with a strong Power Verb.
   - EVERY achievement must have numbers/metrics but not always.
   - Align with the job's key requirements.
   - Show scope, scale, and business impact.
   - Use action verbs.
   - Use superlatives when truthful (first, largest, fastest, etc.).

RULES:
- Stay TRUTHFUL - enhance and reframe, don't fabricate.
- Use the EXACT terminology from the job description.
- Make every word count - no fluff.
- Use • for bullets.
- Be confident and assertive.
- Focus on what matters for THIS specific job.

Return your response in this EXACT JSON format:
{
  "summary": "enhanced professional summary here",
  "experience": [
    {"description": "enhanced bullet points for first role"},
    {"description": "enhanced bullet points for second role"}
  ],
  "skills": "skill1, skill2, skill3, ...",
  "keyAchievements": "• achievement 1\\n• achievement 2\\n• achievement 3"
}

IMPORTANT: 
- Ensure the rewritten content contains at least 95% of the significant keywords from the job description to guarantee a Job Match Score > 90. 
- VARY YOUR SENTENCE STRUCTURE. Do not start every bullet with the same word.
- Use a diverse range of high-impact action verbs from this list and beyond:
  [Business Development: Accelerated, Expanded, Negotiated, Secured, Activated, Optimized, Spearheaded, Captured, Amplified, Established, Strengthened, Converted, Drove, Enabled, Launched, Penetrated, Executed, Boosted]
  [Partnerships: Forged, Cultivated, Built, Engaged, Collaborated, Aligned, Onboarded, Nurtured, Facilitated, Connected, Leveraged, Coordinated, Integrated, Supported]
  [Strategy: Identified, Analyzed, Evaluated, Prioritized, Developed, Designed, Positioned, Refined, Assessed, Strategized, Defined, Innovated, Streamlined]
  [Community: Mobilized, Activated, Advocated, Educated, Informed, Moderated, Promoted, Grew, Resonated, Engaged, Attracted]
  [General: Led, Managed, Delivered, Improved, Enhanced, Supported, Coordinated, Executed, Implemented, Achieved]

Make this resume IMPOSSIBLE for ATS systems and hiring managers to ignore!`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content?.trim() || '{}';
        return JSON.parse(text);
    } catch (error) {
        console.error('AI Resume Tailoring Error:', error);
        throw new Error('Failed to tailor resume. Please check your API key and try again.');
    }
};

export const auditResume = async (
    resumeData: ResumeData,
    targetRole: string = "General"
): Promise<{
    score: number;
    keywords: string[];
    issues: string[];
}> => {
    const openai = getOpenAI();
    if (!openai) {
        // Fallback to mock data if no API key
        return {
            score: 75,
            keywords: ["Communication", "Leadership", "Problem Solving"],
            issues: ["API Key missing - using mock audit"]
        };
    }

    try {
        const prompt = `Act as a strict hiring manager and ATS system. Audit this resume for a "${targetRole}" position.

RESUME DATA:
Summary: ${resumeData.summary}
Skills: ${resumeData.skills}
Experience: ${JSON.stringify(resumeData.experience)}
Education: ${JSON.stringify(resumeData.education)}

Analyze the resume for:
1. **ATS Compatibility**: Formatting, keywords, structure.
2. **Content Quality**: Action verbs, metrics, clarity, impact.
3. **Relevance**: Alignment with a typical "${targetRole}" role.

Return a JSON object with:
- "score": A number between 0-100. Be strict. Average resumes should be 60-70.
- "keywords": Array of 3-5 critical keywords missing from the resume that are standard for this role.
- "issues": Array of 3-5 specific, actionable issues to fix (e.g., "Missing metrics in latest role", "Summary is too generic").

JSON Format:
{
  "score": 72,
  "keywords": ["Agile", "Python", "Stakeholder Management"],
  "issues": ["Add more metrics to experience", "Fix typo in summary"]
}`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content?.trim() || '{}';
        const result = JSON.parse(text);

        return {
            score: result.score || 70,
            keywords: result.keywords || [],
            issues: result.issues || []
        };
    } catch (error) {
        console.error('AI Audit Error:', error);
        return {
            score: 0,
            keywords: [],
            issues: ["Failed to perform AI audit"]
        };
    }
};

export const generateAchievements = async (
    role: string,
    experience: string
): Promise<string> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `Generate 3-4 high-impact key achievements for a "${role}" based on this experience: "${experience}".
        
        Instructions:
        - Use the STAR method to structure your thoughts (Situation -> Task -> Action -> Result), but DO NOT explicitly write these words.
        - Write distinct, high-impact narrative bullet points.
        - Start each bullet with a strong Action Verb.
        - Include metrics/numbers to quantify the Result.
        - Format as a single string with bullet points (•).
        - STRICT REQUIREMENT: Output EXACTLY 3 or 4 bullet points. No more, no less.
        - DO NOT use prefixes like "Situation:" or "Action:".`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        return completion.choices[0].message.content?.trim() || '';
    } catch (error) {
        console.error('AI Achievement Generation Error:', error);
        throw new Error('Failed to generate achievements.');
    }
};

export const enhanceSummary = async (
    summary: string,
    role: string
): Promise<string> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `You are an expert resume writer. Enhance this professional summary for a "${role}" position.
        
        Current Summary:
        "${summary}"
        
        Instructions:
        - Make it compelling and impactful
        - Keep it 3-5 sentences
        - Use strong, confident language
        - Highlight key value propositions
        - Return ONLY the enhanced summary, no explanations`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        return completion.choices[0].message.content?.trim() || summary;
    } catch (error) {
        console.error('AI Summary Enhancement Error:', error);
        throw new Error('Failed to enhance summary.');
    }
};

export const enhanceSkills = async (
    currentSkills: string,
    jobTitle: string
): Promise<string> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `Enhance this skills list to be more ATS-friendly and comprehensive.

Current Skills: ${currentSkills}
Job Title: ${jobTitle}

Instructions:
- Select and refine the most high-impact, ATS-relevant skills.
- STRICTLY LIMIT the output to a maximum of 12 skills.
- Do not simply add to the list; replace less relevant skills if necessary to keep the best ones just make sure all doesn't exceed 12.
- Use standard naming conventions (e.g., "React.js" instead of "ReactJS").
- Return ONLY the final comma-separated list. No explanations or bullets.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        return completion.choices[0].message.content?.trim() || currentSkills;
    } catch (error) {
        console.error('AI Skills Enhancement Error:', error);
        throw new Error('Failed to enhance skills.');
    }
};

export interface GeneratedCoverLetter {
    plainText: string;
    structured: {
        opening: string;
        skills: { skill: string; description: string }[];
        closing: string;
    };
}

export const generateCoverLetter = async (
    resumeData: ResumeData,
    jobTitle: string,
    companyName: string,
    jobDescription: string
): Promise<GeneratedCoverLetter> => {
    const openai = getOpenAI();
    if (!openai) throw new Error('OpenAI API key missing');

    try {
        const prompt = `Write a professional cover letter for a "${jobTitle}" position at "${companyName}".

CANDIDATE PROFILE:
Name: ${resumeData.fullName}
Email: ${resumeData.email}
Phone: ${resumeData.phone}
Current Title: ${resumeData.jobTitle}
Summary: ${resumeData.summary}
Key Skills: ${resumeData.skills}
Recent Experience: ${JSON.stringify(resumeData.experience.slice(0, 2))}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

INSTRUCTIONS:
- Analyze the candidate's profile against the job description.
- Create a structured cover letter response in JSON format.
- **plainText**: A standard, complete cover letter body (Salutation to Sign-off) as a single string. Exclude header (Date/Address).
- **structured**: 
    - "opening": A strong opening paragraph (hook).
    - "skills": Identify 3-5 KEY SKILLS required for the job that the candidate has. For each, write a "description" (1-2 sentences) demonstrating how the candidate applied this skill in the past (STAR method).
    - "closing": A strong closing paragraph including call to action and sign-off ("Sincerely, Name").

Return EXACTLY this JSON structure:
{
  "plainText": "Dear Hiring Manager... (full text)",
  "structured": {
    "opening": "I am excited generally...",
    "skills": [
       { "skill": "Project Management", "description": "Orchestrated..." }
    ],
    "closing": "Thank you..."
  }
}`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content?.trim() || '{}';
        const parsed = JSON.parse(text);

        // Validation / Fallback
        return {
            plainText: parsed.plainText || '',
            structured: {
                opening: parsed.structured?.opening || '',
                skills: Array.isArray(parsed.structured?.skills) ? parsed.structured.skills : [],
                closing: parsed.structured?.closing || ''
            }
        };
    } catch (error) {
        console.error('AI Cover Letter Error:', error);
        throw new Error('Failed to generate cover letter.');
    }
};
