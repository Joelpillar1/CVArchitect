import { ResumeData } from '../../types';
import { callAIText, callAIJSON } from '../../services/aiService';

// No more direct OpenAI client - using secure Edge Functions instead

export const enhanceDescription = async (
    description: string,
    role: string,
    company: string,
    context?: {
        index: number;
        totalCount: number;
    }
): Promise<string> => {
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
        const prompt = `You are a senior executive recruiter with 15+ years of experience. You HATE resumes that scream "AI-generated" with excessive percentages and metrics. Rewrite the following job description for a "${role}" position at "${company}".

Current Description:
"${description}"

# CRITICAL RULES FROM A RECRUITER'S PERSPECTIVE:

## 1. STRATEGIC QUANTIFICATION (NOT EXCESSIVE)
- **MAXIMUM 1 metric per role** (unless it's a Key Achievements section)
- Metrics should be IMPACTFUL, not filler (e.g., "30% efficiency gain" is weak; "Reduced deployment time from 2 weeks to 3 days" is strong)
- If you use a number, make it SPECIFIC and CONTEXTUAL (not just percentages)
- **AVOID**: Listing multiple percentages (20%, 30%, 40%) - this is an instant red flag
- **PREFER**: Concrete outcomes ("Launched X", "Built Y", "Led Z")

## 2. BULLET POINT ARCHETYPES (Mix These):
${isRecent ? `
   **For Recent/Current Roles (4-5 bullets):**
   - 1 "Strategic Impact" bullet (What system/process did you build or transform?)
   - 1 "Leadership/Scope" bullet (Team size, budget, stakeholders)
   - 1 "Problem-Solving" bullet (Specific challenge you resolved)
   - 1-2 "Execution" bullets (Key deliverables or projects)
   - OPTIONAL: 1 metric-driven bullet (ONLY if truly impressive)
` : `
   **For Earlier Roles (3-4 bullets):**
   - 1 "Core Responsibility" bullet (What was your main function?)
   - 1 "Key Achievement" bullet (Most proud accomplishment)
   - 1-2 "Technical/Skill" bullets (What you built/used)
   - AVOID metrics for older roles unless exceptional
`}

## 3. SEMANTIC VARIATION (CRITICAL - STRICTLY ENFORCED):
- **MANDATORY**: Every single bullet point MUST start with a DIFFERENT action verb
- **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs
- **NEVER** use the same sentence structure twice
- **NEVER** start consecutive bullets with similar verbs (e.g., "Led" and "Leading", "Built" and "Building")
- Vary between: Action statements, Achievement statements, Scope statements
- **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form

## 4. TONE CALIBRATION:
${isRecent ? `
   - **Senior/Recent Role**: Use strategic and high-impact language from these categories:
     * **Strategy & Leadership**: Architected, Spearheaded, Orchestrated, Championed, Directed, Governed, Led, Established, Institutionalized, Stewarded
     * **Transformation & Impact**: Transformed, Reimagined, Redefined, Elevated, Scaled, Optimized, Revitalized, Modernized, Streamlined, Accelerated
     * **Cross-Functional & Influence**: Aligned, Unified, Bridged, Influenced, Drove, Enabled, Mobilized, Partnered, Collaborated, Negotiated
   - Focus on IMPACT and LEADERSHIP, not just tasks
   - **CRITICAL**: Each bullet MUST use a DIFFERENT verb from the lists above
` : `
   - **Earlier Role**: Use execution and delivery language from these categories:
     * **Execution & Craft**: Designed, Built, Created, Developed, Prototyped, Wireframed, Illustrated, Refined, Produced, Implemented
     * **Problem-Solving & Delivery**: Solved, Improved, Enhanced, Optimized, Simplified, Iterated, Tested, Validated, Resolved, Delivered
     * **Collaboration & Learning**: Collaborated, Supported, Assisted, Contributed, Partnered, Aligned, Communicated, Documented, Reviewed, Learned
   - Focus on SKILLS and DELIVERABLES
   - **CRITICAL**: Each bullet MUST use a DIFFERENT verb from the lists above
`}

## 5. WHAT MAKES A GREAT BULLET:
✅ GOOD: "Architected microservices platform serving 2M+ users, reducing infrastructure costs by $400K annually"
✅ GOOD: "Led cross-functional team of 8 engineers to deliver mobile app 3 weeks ahead of schedule"
✅ GOOD: "Resolved critical production incident affecting 50K users by implementing automated failover system"

❌ BAD: "Improved efficiency by 30%" (vague, no context)
❌ BAD: "Increased productivity by 25%, reduced costs by 20%, improved quality by 15%" (metric overload)
❌ BAD: "Utilized Agile methodologies to enhance team collaboration" (buzzword soup)
❌ BAD: Starting multiple bullets with the same verb (e.g., "Led team...", "Led project...", "Led initiative...")

# FINAL OUTPUT:
- Return ONLY the bullet points (use •)
- ${isRecent ? '4-5 bullets' : '3-4 bullets'}
- NO introductory text
- Make it sound HUMAN, not AI-generated
- Remember: ONE metric maximum (or zero if the work speaks for itself)
- **MANDATORY**: Every bullet MUST start with a DIFFERENT action verb
`;

        const result = await callAIText(prompt, 'gpt-4o', 0.8);
        return result.trim() || description;
    } catch (error) {
        console.error('AI Enhancement Error:', error);
        throw new Error('Failed to enhance description. Please try again.');
    }
};

export const generateSummary = async (
    resumeData: ResumeData,
    targetRole: string
): Promise<string> => {
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

        const result = await callAIText(prompt, 'gpt-4o');
        return result.trim() || '';
    } catch (error) {
        console.error('Summary Generation Error:', error);
        throw new Error('Failed to generate summary.');
    }
};

export const generateBulletPoints = async (
    role: string,
    company: string,
    keywords: string
): Promise<string[]> => {
    try {
        const prompt = `Generate 3-4 high-impact resume bullet points for a "${role}" position at "${company}".
        
        Keywords/Context to include: ${keywords}
        
        Instructions:
        - Use strong action verbs.
        - **MANDATORY**: Every single bullet point MUST start with a DIFFERENT action verb.
        - **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs.
        - **NEVER** start consecutive bullets with similar verbs.
        - Focus on achievements and metrics but not too much.
        - Return ONLY a JSON array of strings, e.g., ["bullet 1", "bullet 2"].
        - **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form.`;

        const parsed = await callAIJSON(prompt, 'gpt-4o');
        // Handle different potential JSON structures
        return Array.isArray(parsed) ? parsed : (parsed.bullets || parsed.points || []);
    } catch (error) {
        console.error('Bullet Generation Error:', error);
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
    try {
        const prompt = `You are a senior executive recruiter with 15+ years of experience. You're helping a candidate tailor their resume to THIS SPECIFIC JOB. You HATE resumes that scream "AI-generated" with excessive metrics and generic buzzwords.

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

CURRENT RESUME:
Summary: ${resumeData.summary}
Skills: ${resumeData.skills}
Experience: ${JSON.stringify(resumeData.experience.map(e => ({ role: e.role, company: e.company, desc: e.description })))}

# YOUR MISSION: Make this resume PERFECTLY aligned with the job while sounding HUMAN and AUTHENTIC

## 1. PROFESSIONAL SUMMARY (3-4 sentences):
- Mirror the job title and top 3 CRITICAL skills from the JD
- Show you understand what THIS ROLE needs
- Be confident but not arrogant
- NO buzzwords without substance
- Make it conversational yet professional

## 2. EXPERIENCE BULLETS (CRITICAL - READ CAREFULLY):

### STRATEGIC QUANTIFICATION RULES:
- **MAXIMUM 1 metric per role** (this is NOT the Key Achievements section)
- Metrics must be IMPACTFUL and CONTEXTUAL
- ❌ **AVOID**: Multiple percentages (20%, 30%, 40%) - instant red flag
- ✅ **PREFER**: Concrete outcomes ("Launched X", "Built Y", "Led team of Z")
- If you use a number, make it SPECIFIC: "Reduced deployment from 2 weeks to 3 days" NOT "Improved by 30%"
- If you are generating 3-4 bullets, make sure to limit the matric on all the bullets to 2-3.

### BULLET POINT STRUCTURE (3-4 bullets per role):
1. **Strategic Impact** - What system/process did you build or transform?
2. **Leadership/Scope** - Team size, stakeholders, budget (NOT percentages)
3. **Problem-Solving** - Specific challenge you resolved
4. **OPTIONAL: Metric** - ONLY if truly impressive and relevant to THIS job

### FORMATTING CRITICAL RULES:
- **Output 3-4 distinct bullets per role.**
- **Format as a single string with bullets separated by newlines (\\n).**
- **Start EVERY bullet with a bullet point character (•).**
- **DO NOT return a single paragraph.**

### TONE & LANGUAGE (CRITICAL - STRICTLY ENFORCED):
- Use EXACT terminology from the job description
- **MANDATORY**: Every bullet point MUST start with a DIFFERENT action verb
- **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs
- **NEVER** start consecutive bullets with similar verbs (e.g., "Led" and "Leading", "Built" and "Building")
- Mix: Action statements, Achievement statements, Scope statements
- Sound like a HUMAN wrote this, not an AI
- **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form

### EXAMPLES OF WHAT TO DO:
✅ "Architected microservices platform serving 2M+ users, reducing infrastructure costs by $400K annually"
✅ "Led cross-functional team of 8 engineers to deliver mobile app 3 weeks ahead of schedule"
✅ "Resolved critical production incident affecting 50K users by implementing automated failover"
✅ "Built CI/CD pipeline that reduced deployment time from 2 weeks to 3 days"

### EXAMPLES OF WHAT TO AVOID:
❌ "Improved efficiency by 30%" (vague, no context)
❌ "Increased productivity by 25%, reduced costs by 20%, improved quality by 15%" (metric overload)
❌ "Utilized Agile methodologies to enhance team collaboration" (buzzword soup)

## 3. SKILLS (Top 8 ONLY, comma-separated):
- Prioritize skills EXPLICITLY mentioned in the job description
- Use EXACT terminology from the JD
- Order by relevance to THIS job
- NO generic skills unless in the JD
- Be specific: "React.js" not "Frontend Development"

## 4. KEY ACHIEVEMENTS (3-4 bullet points):
**THIS is where you can use 2-3 metrics** (unlike experience section)
- Each achievement should be IMPRESSIVE and RELEVANT to THIS job
- Use STAR method but write it as ONE cohesive sentence
- Start with strong action verbs
- Show scope, scale, and business impact
- Align with the job's key requirements
- Use superlatives when truthful (first, largest, fastest)

CRITICAL RULES:
- Stay TRUTHFUL - enhance and reframe existing experience, don't fabricate
- Make this resume sound like the PERFECT candidate for THIS SPECIFIC JOB
- Use keywords from the JD naturally (aim for 95%+ keyword coverage)
- VARY sentence structure and verbs - no repetition
- Sound HUMAN, not AI-generated
- Remember: ONE metric maximum per experience role (Key Achievements can have more)

Return ONLY valid JSON in this EXACT format:
{
  "summary": "enhanced professional summary here",
  "experience": [
    {"description": "• Bullet 1\n• Bullet 2\n• Bullet 3\n• Bullet 4"}
  ],
  "skills": "skill1, skill2, skill3, skill4, skill5, skill6, skill7, skill8",
  "keyAchievements": "• achievement 1\\n• achievement 2\\n• achievement 3\\n• achievement 4"
}

Make this resume IMPOSSIBLE for hiring managers to ignore - but make it sound like a HUMAN wrote it!`;

        return await callAIJSON(prompt, 'gpt-4o', 0.8);
    } catch (error) {
        console.error('AI Resume Tailoring Error:', error);
        throw new Error('Failed to tailor resume. Please try again.');
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

        const result = await callAIJSON(prompt, 'gpt-4o');
        return {
            score: result.score || 70,
            keywords: result.keywords || [],
            issues: result.issues || []
        };
    } catch (error) {
        console.error('Audit Error:', error);
        return {
            score: 0,
            keywords: [],
            issues: ["Failed to perform audit"]
        };
    }
};

export const generateAchievements = async (
    role: string,
    experience: string
): Promise<string> => {
    try {
        const prompt = `Generate 3-4 high-impact key achievements for a "${role}" based on this experience: "${experience}".
        
        Instructions:
        - Use the STAR method to structure your thoughts (Situation -> Task -> Action -> Result), but DO NOT explicitly write these words.
        - Write distinct, high-impact narrative bullet points.
        - **MANDATORY**: Every single bullet point MUST start with a DIFFERENT action verb.
        - **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs.
        - **NEVER** start consecutive bullets with similar verbs (e.g., "Led" and "Leading", "Achieved" and "Achieving").
        - Include metrics/numbers to quantify the Result.
        - Format as a single string with bullet points (•).
        - STRICT REQUIREMENT: Output EXACTLY 3 or 4 bullet points. No more, no less.
        - DO NOT use prefixes like "Situation:" or "Action:".
        - **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form.`;

        const result = await callAIText(prompt, 'gpt-4o');
        return result.trim() || '';
    } catch (error) {
        console.error('Achievement Generation Error:', error);
        throw new Error('Failed to generate achievements.');
    }
};

export const enhanceSummary = async (
    summary: string,
    role: string
): Promise<string> => {
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

        const result = await callAIText(prompt, 'gpt-4o');
        return result.trim() || summary;
    } catch (error) {
        console.error('Summary Enhancement Error:', error);
        throw new Error('Failed to enhance summary.');
    }
};

export const enhanceSkills = async (
    currentSkills: string,
    jobTitle: string
): Promise<string> => {
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

        const result = await callAIText(prompt, 'gpt-4o');
        return result.trim() || currentSkills;
    } catch (error) {
        console.error('Skills Enhancement Error:', error);
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

        const parsed = await callAIJSON(prompt, 'gpt-4o');

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
        console.error('Cover Letter Error:', error);
        throw new Error('Failed to generate cover letter.');
    }
};
