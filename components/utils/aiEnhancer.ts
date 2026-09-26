import { ResumeData } from '../../types';
import { callAIText, callAIJSON } from '../../services/aiService';
import { ensureAllBulletsHaveUniqueVerbs, detectActionVerbDomain } from '../../utils/actionVerbs';

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
        const prompt = `You are a senior executive recruiter with 15+ years of experience across industries and markets globally. You understand what recruiters and hiring managers want to see, what they don't want to see, and how to craft resumes that get interviews. You have deep knowledge of different roles, industries, company sizes, and what metrics are appropriate and impressive for each context. You HATE resumes that scream "AI-generated" with excessive percentages.

Your approach: You build on the original description, but you use your recruiter expertise to strategically enhance it. You know where metrics should go, what types of metrics work best, and how to make the resume compelling without being unrealistic. The original description is your foundation - you enhance it intelligently based on your experience.

Current Description:
"${description}"

# CRITICAL RULES FROM A RECRUITER'S PERSPECTIVE:

## 0. YOUR RECRUITER EXPERTISE (MOST IMPORTANT - READ FIRST):
- **You know what recruiters want**: Use your 15+ years of experience to understand what metrics are appropriate for this role, industry, and company size
- **Build strategically on the original**: The original description is your foundation - enhance it intelligently, don't just copy it
- **Add metrics where they make sense**: You know where metric-driven bullets should go based on the role type and what recruiters expect to see
- **Use industry knowledge**: Draw on your understanding of different industries, roles, and company sizes to infer reasonable metrics
- **NEVER exaggerate**: Use realistic, believable metrics that align with the role level, company size, and industry standards
- **Be strategic**: Not every bullet needs a metric - you know when to use metrics and when to focus on strategic impact
- **Trust your expertise**: You've seen thousands of resumes - you know what works and what doesn't

## 1. STRATEGIC IMPACT & NO PERCENTAGE SPAM (MANDATORY):
- **NEVER INVENT FAKE PERCENTAGES**: Do NOT generate random percentage figures (e.g., "by 25%", "by 35%", "by 40%") across bullets. Resumes with percentages in every bullet look robotic, fake, and AI-generated.
- **MOST BULLETS SHOULD HAVE NO PERCENTAGE**: Focus on concrete engineering/product scope, architectural deliverables, tool stacks, team collaboration, system reliability, and qualitative business outcomes.
- **STRICT LIMIT**: Maximum ONE percentage (%) metric across the entire role, and ONLY if it is deeply contextual and realistic. Having zero percentages is completely fine and often more credible.
- **PREFER QUALITATIVE & SCOPE METRICS**:
  * Team size & stakeholders ("led squad of 8 engineers", "collaborated with 4 cross-functional product managers")
  * Technical scope & architecture ("architected event-driven microservices handling asynchronous webhooks")
  * Operational turnaround & time ("cut release deployment cycles from 2 weeks to 3 days")
  * Scale & volume ("supporting 50K active users", "managing 15+ microservices across 3 cloud regions")
  * Financial/Budget scale ("oversaw $1.2M infrastructure budget")
- **NEVER EXAGGERATE**: Keep all details realistic, grounded, and believable for the role level and industry.

## 2. BULLET POINT ARCHETYPES (Mix These):
${isRecent ? `
   **For Recent/Current Roles (4-5 bullets):**
   - 1 "Strategic Impact" bullet (What system/process did you build? NO metric needed - focus on transformation)
   - 1 "Leadership/Scope" bullet (Team size, budget amount, stakeholder count - non-percentage scope)
   - 1 "Problem-Solving" bullet (Specific challenge resolved - focus on solution and architecture, NO percentage)
   - 1-2 "Execution/Project" bullets (Key deliverables, technical tools, systems deployed - NO percentage spam)
   - **REQUIREMENT**: At most ONE bullet may contain a percentage across the entire role
` : `
   **For Earlier Roles (3-4 bullets):**
   - 1 "Core Responsibility" bullet (Main technical function - NO metric needed)
   - 1 "Key Achievement" bullet (Most notable accomplishment - focus on technical delivery or scope)
   - 1-2 "Technical/Skill" bullets (Systems built, tools integrated, workflows automated - NO percentage spam)
   - **REQUIREMENT**: At most ONE bullet may contain a percentage across the entire role
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
✅ GOOD (Scope + Tools): "Architected microservices platform using Node.js and PostgreSQL, streamlining data synchronization across 4 distributed services"
✅ GOOD (Team / Timeline): "Led cross-functional team of 8 engineers to deliver mobile app 3 weeks ahead of schedule"
✅ GOOD (Problem / Scale): "Resolved critical production incident affecting 50K users by implementing automated failover and health check routines"
✅ GOOD (Budget / Scope): "Managed $1.5M annual cloud infrastructure budget and delivered 12 key platform migrations on schedule"
✅ GOOD (Strategic, no metric): "Spearheaded UX research initiatives that influenced product strategy and uncovered key user insights"
✅ GOOD (Process, no metric): "Facilitated smooth design-to-engineering handoffs, ensuring precise token implementation and component library alignment"

❌ BAD: "Increased engagement by 25%, expanded reach by 40%, boosted acquisition by 20%" (percentage spam - screams AI)
❌ BAD: "Improved efficiency by 30%" (vague percentage without context)
❌ BAD: "Increased productivity by 25%, reduced costs by 20%, improved quality by 15%" (metric overload - too many percentages)
❌ BAD: Putting '%' on every single bullet point
❌ BAD: Starting multiple bullets with the same verb (e.g., "Led team...", "Led project...", "Led initiative...")

# FINAL OUTPUT:
- Return ONLY the bullet points (use •)
- ${isRecent ? '4-5 bullets' : '3-4 bullets'}
- NO introductory text
- Make it sound HUMAN, authentic, and grounded
- **STRICT ANTI-PERCENTAGE RULE**: Do NOT add percentage (%) numbers to every bullet. At most 1 percentage across the entire role, and 0 percentages is preferred when not in the original text.
- **MANDATORY**: Every bullet MUST start with a DIFFERENT action verb
- **BUILD ON THE ORIGINAL**: Enhance the original description intelligently with concrete scope, tools, and technical delivery.
`;

        const result = await callAIText(prompt, 'gpt-4o', 0.8);
        const domain = detectActionVerbDomain(`${role} ${company}`);
        return ensureAllBulletsHaveUniqueVerbs(result.trim() || description, new Set(), domain);
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
        const prompt = `You are a senior executive recruiter with 15+ years of experience. Generate 3-4 high-impact resume bullet points for a "${role}" position at "${company}".
        
        Keywords/Context to include: ${keywords}
        
        Your approach: Use your recruiter expertise to strategically craft bullets. You know what metrics are appropriate for this role and industry. Build on the context provided, but use your experience to enhance it intelligently.
        
        Instructions:
        - Use strong action verbs.
        - **STRICT ZERO-DUPLICATE STARTING VERBS (MANDATORY)**: Every single bullet point MUST open with a completely DIFFERENT, unique action verb.
        - **ONE VERB MUST NEVER APPEAR TWICE**: If you generate 4 bullets, you must use 4 completely distinct starting verbs (e.g. Spearheaded, Engineered, Orchestrated, Accelerated).
        - **NEVER** start consecutive or any sibling bullets with the same or similar verbs (e.g., "Led" and "Leading", "Built" and "Building").
        - **CRITICAL: MANDATORY CANDIDATE METRIC PRESERVATION**: If the original context/bullets contain real metrics (numbers, dollars, percentages, team sizes, user counts, latency stats, dates), you MUST PRESERVE and strategically retain those exact verified numbers. NEVER delete, strip, or replace candidate-supplied metrics.
        - **Use your recruiter knowledge**: Based on the role, industry, and company context, strategically retain and polish metrics where they make the story stronger (not generic statements).
        - **Look for clues in the existing bullets/context**: If the current text hints at teams, projects, users, budgets, timelines, or scope, preserve those exact numbers instead of making them vague.
        - **Infer intelligently only when no metrics are given**: Use your experience to infer reasonable metrics based on role level, industry standards, company size, and typical scope so the bullets do NOT feel generic or metric-free.
        - **NEVER EXAGGERATE**: Keep metrics realistic and believable - you know what's reasonable for each context
        - Follow strategic quantification rules from the recruiter guide:
          * **PRESERVE ALL ORIGINAL METRICS**: Any real metric in the user's original text must be retained in the polished bullet.
          * **MAXIMUM 2 metrics per ENTIRE role** (unless more were already in the user's original resume).
          * **PREFER non-percentage metrics**: Team size, budget amounts, user counts, time periods, dollar amounts, project counts.
          * **LIMIT percentages**: Use percentages ONLY when truly impressive (e.g., "Increased revenue by 150%" not "Improved efficiency by 15%").
          * **AVOID**: Fabricating multiple artificial percentages – this screams AI-generated.
          * Balance 1-2 metric-driven bullets with strategic/leadership bullets that have NO metrics.
        - **CRITICAL**: You know when metrics add value and when strategic impact is more powerful - use your judgment
        - Always treat each provided keyword or short bullet as a starting point and rewrite it into a fuller, more specific, action-driven bullet.
        - Each bullet MUST be a rich, two-line bullet in a normal resume editor:
          * Write at least 2 clear clauses or sentences per bullet.
          * Aim for roughly 20–35 words per bullet (never a short 5–10 word fragment).
          * **HARD REQUIREMENT**: Do NOT return any bullet under 18 words. If a bullet is too short, expand it before returning your JSON.
        - Return ONLY a JSON array of strings, e.g., ["bullet 1", "bullet 2"].
        - **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form, and that all numbers are reasonable and appropriate for the role/industry context.`;

        const parsed = await callAIJSON(prompt, 'gpt-4o');
        // Handle different potential JSON structures
        const rawBullets: string[] = Array.isArray(parsed) ? parsed : (parsed.bullets || parsed.points || []);
        const domain = detectActionVerbDomain(`${role} ${company}`);
        const formatted = rawBullets.map(b => b.trim().startsWith('•') ? b.trim() : `• ${b.trim()}`).join('\n');
        const uniqueBulletsText = ensureAllBulletsHaveUniqueVerbs(formatted, new Set(), domain);
        return uniqueBulletsText
            .split('\n')
            .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
            .filter(Boolean);
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
    projects?: { name?: string; role?: string; technologies?: string; description: string }[];
    leadership?: { role?: string; organization?: string; description: string }[];
    additionalInfo?: { id: string; label: string; value: string }[];
}> => {
    try {
        const prompt = `You are a senior executive recruiter with 15+ years of experience across industries and markets globally. You understand what recruiters and hiring managers want to see, what they don't want to see, and how to craft resumes that get interviews. You have deep knowledge of different roles, industries, company sizes, and what metrics are appropriate and impressive for each context. You're helping a candidate tailor their resume to THIS SPECIFIC JOB. You HATE resumes that scream "AI-generated" with excessive metrics and generic buzzwords.

Your approach: You build on the original resume, but you use your recruiter expertise to strategically enhance it. You know where metrics should go, what types of metrics work best, and how to make the resume compelling without being unrealistic. The original resume is your foundation - you enhance it intelligently based on your experience and the job requirements.

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

CURRENT RESUME:
Summary: ${resumeData.summary}
Skills: ${resumeData.skills}
Experience: ${JSON.stringify((resumeData.experience || []).map(e => ({ role: e.role, company: e.company, desc: e.description })))}
${resumeData.projects && resumeData.projects.length > 0 ? `Projects: ${JSON.stringify(resumeData.projects.map(p => ({ name: p.name, role: p.role, tech: p.technologies, desc: p.description })))}` : ''}
${resumeData.leadership && resumeData.leadership.length > 0 ? `Leadership: ${JSON.stringify(resumeData.leadership.map(l => ({ role: l.role, org: l.organization || l.company, desc: l.description })))}` : ''}
${resumeData.additionalInfo && resumeData.additionalInfo.length > 0 ? `Custom Sections: ${JSON.stringify(resumeData.additionalInfo.filter(a => a && (a.label || a.value)).map(a => ({ label: a.label, value: a.value })))}` : ''}
${resumeData.keyAchievements ? `Key Achievements: ${JSON.stringify(resumeData.keyAchievements)}` : ''}

# YOUR MISSION: Make this resume PERFECTLY aligned with the job while sounding HUMAN and AUTHENTIC

## 1. PROFESSIONAL SUMMARY (3-5 sentences):
- Mirror the job title and top 3 CRITICAL skills from the JD
- Show you understand what THIS ROLE needs
- Be confident but not arrogant
- NO buzzwords without substance
- Make it conversational yet professional

## 2. EXPERIENCE BULLETS (CRITICAL - READ CAREFULLY):

### STRATEGIC QUANTIFICATION & METRIC PRESERVATION RULES:
- **CANDIDATE METRIC PRESERVATION WITH STRICT % CAPPING (MAX 1-2 PERCENTAGES PER ROLE)**:
  * Preserve authentic candidate numbers (dollar amounts, team sizes, user counts, latency stats, project volume).
  * **STRICT PERCENTAGE CAP**: If the uploaded resume has lots of percentages (%) across bullets, you MUST LIMIT them: Keep at most **1 to 2 most impressive percentages** across the entire role.
  * For all other bullets that originally had percentages, **convert or reframe them into concrete non-percentage impact** (e.g., team scale, architecture throughput, timeline reductions like "from 3 weeks to 2 days", dollar value, or operational deliverables).
  * **NEVER output percentages on every bullet**: Having % on 3-4 bullets in one role looks artificial and spammy.
- **MAXIMUM 2 metrics per ENTIRE role** (preferring non-percentage numbers: Team size, budget amounts, user counts, time periods, dollar amounts, project counts).
- **LIMIT percentages**: Use percentages ONLY when truly impressive and contextual, never on more than 1-2 bullets per role.
- ❌ **AVOID**: Multiple percentages in one role – this screams AI-generated.
- ❌ **AVOID**: Vague percentages without context – this looks AI-generated.
- ✅ **PREFER**: Specific non-percentage numbers ("Reduced deployment time from 2 weeks to 3 days", "Launched mobile app to 50K users", "Managed team of 12 engineers", "Delivered $2M project on budget").
- Mix 1-2 metric-driven bullets with strategic/leadership bullets that have NO metrics.

### BULLET POINT STRUCTURE (3-4 bullets per role):
1. **Strategic Impact** - What system/process did you build? NO metric needed - focus on transformation
2. **Leadership/Scope** - Team size, budget amount, stakeholder count - USE NUMBERS HERE (non-percentage preferred)
3. **Problem-Solving** - Specific challenge resolved - NO metric needed, focus on solution
4. **Execution/Project** - Key deliverables - USE NUMBERS HERE if available (user count, project count, timeline - non-percentage preferred)

For EVERY bullet you write:
- ALWAYS treat the user's existing bullets as the seed: keep the same underlying responsibility/achievement, but expand it into a richer, more specific story.
- Make every bullet a rich, two-line bullet in a normal resume editor (not a short fragment).
- Use at least 2 clear clauses or sentences per bullet.
- Aim for roughly 20–35 words per bullet so it wraps to a second line naturally.
- **HARD REQUIREMENT**: Do NOT output any bullet under 18 words. If a bullet is shorter, expand it with concrete actions, context, and metrics before returning your answer.

### FORMATTING CRITICAL RULES:
- **Output 3-4 distinct bullets per role.**
- **Format as a single string with bullets separated by newlines (\\n).**
- **Start EVERY bullet with a bullet point character (•).**
- **DO NOT return a single paragraph.**

### TONE & LANGUAGE (CRITICAL - STRICTLY ENFORCED):
- Use EXACT terminology from the job description
- **STRICT ZERO-DUPLICATE STARTING VERBS (MANDATORY)**: Every single bullet point across ALL roles and achievements MUST start with a COMPLETELY DIFFERENT, UNIQUE action verb.
- **ONE VERB MUST NEVER APPEAR TWICE**: Never repeat any verb root.
- Mix: Action statements, Achievement statements, Scope statements
- Sound like a HUMAN wrote this, not an AI

## 3. SKILLS (Top 8 ONLY, comma-separated):
- Prioritize skills EXPLICITLY mentioned in the job description
- Use EXACT terminology from the JD
- Order by relevance to THIS job

## 4. KEY ACHIEVEMENTS (3-4 bullet points):
- Impressive and relevant flagship achievements
- STAR method in cohesive 2-line bullets
- Start with strong unique action verbs

## 5. PROJECTS, LEADERSHIP & CUSTOM SECTIONS (if provided):
- Elevate tech stack, architecture, and governance outcomes in 2-3 Google XYZ bullets per item.
- Do NOT fabricate credentials or claims; elevate wording and keyword alignment.

Return ONLY valid JSON in this EXACT format:
{
  "summary": "enhanced professional summary here",
  "experience": [
    {"description": "• Bullet 1\\n• Bullet 2\\n• Bullet 3"}
  ],
  "skills": "skill1, skill2, skill3, skill4, skill5, skill6, skill7, skill8",
  "keyAchievements": "• achievement 1\\n• achievement 2\\n• achievement 3"${resumeData.projects && resumeData.projects.length > 0 ? `,
  "projects": [
    {"description": "• Project bullet 1\\n• Project bullet 2"}
  ]` : ''}${resumeData.leadership && resumeData.leadership.length > 0 ? `,
  "leadership": [
    {"description": "• Leadership bullet 1\\n• Leadership bullet 2"}
  ]` : ''}${resumeData.additionalInfo && resumeData.additionalInfo.length > 0 ? `,
  "additionalInfo": [
    {"label": "Custom Section Label", "value": "Enhanced section content here"}
  ]` : ''}
}`;

        const parsed = await callAIJSON(prompt, 'gpt-4o', 0.8);
        const usedVerbsAcrossResume = new Set<string>();

        if (Array.isArray(parsed.experience)) {
            parsed.experience = parsed.experience.map((exp: { description: string }, idx: number) => {
                const originalRole = resumeData.experience[idx]?.role || '';
                const originalCompany = resumeData.experience[idx]?.company || '';
                const domain = detectActionVerbDomain(`${originalRole} ${originalCompany}`);
                const formattedDesc = ensureAllBulletsHaveUniqueVerbs(exp.description || '', usedVerbsAcrossResume, domain);
                return {
                    ...exp,
                    description: formattedDesc,
                };
            });
        }

        if (parsed.keyAchievements) {
            const domain = detectActionVerbDomain(resumeData.jobTitle || '');
            parsed.keyAchievements = ensureAllBulletsHaveUniqueVerbs(parsed.keyAchievements, usedVerbsAcrossResume, domain);
        }

        if (Array.isArray(parsed.projects) && Array.isArray(resumeData.projects)) {
            parsed.projects = parsed.projects.map((proj: { description: string }, idx: number) => {
                const originalName = resumeData.projects![idx]?.name || '';
                const originalTech = resumeData.projects![idx]?.technologies || '';
                const domain = detectActionVerbDomain(`${originalName} ${originalTech}`);
                const formattedDesc = ensureAllBulletsHaveUniqueVerbs(proj.description || '', usedVerbsAcrossResume, domain);
                return {
                    ...resumeData.projects![idx],
                    description: formattedDesc,
                };
            });
        }

        if (Array.isArray(parsed.leadership) && Array.isArray(resumeData.leadership)) {
            parsed.leadership = parsed.leadership.map((lead: { description: string }, idx: number) => {
                const originalRole = resumeData.leadership![idx]?.role || '';
                const originalOrg = resumeData.leadership![idx]?.organization || resumeData.leadership![idx]?.company || '';
                const domain = detectActionVerbDomain(`${originalRole} ${originalOrg}`);
                const formattedDesc = ensureAllBulletsHaveUniqueVerbs(lead.description || '', usedVerbsAcrossResume, domain);
                return {
                    ...resumeData.leadership![idx],
                    description: formattedDesc,
                };
            });
        }

        if (Array.isArray(parsed.additionalInfo) && Array.isArray(resumeData.additionalInfo)) {
            parsed.additionalInfo = resumeData.additionalInfo.map((info, idx) => {
                const aiVal = parsed.additionalInfo[idx]?.value;
                return {
                    ...info,
                    value: aiVal && typeof aiVal === 'string' ? aiVal : info.value
                };
            });
        }

        return parsed;
    } catch (error: any) {
        console.error('AI Resume Tailoring Error:', error);
        throw new Error(error?.message || 'Failed to tailor resume. Please try again.');
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
            keywords: Array.isArray(result.keywords) ? result.keywords : [],
            issues: Array.isArray(result.issues) ? result.issues : []
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
        - **STRICT ZERO-DUPLICATE STARTING VERBS (MANDATORY)**: Every single bullet point MUST start with a COMPLETELY DIFFERENT, UNIQUE action verb.
        - **ONE VERB MUST NEVER APPEAR TWICE**: If you generate 4 bullets, you must use 4 completely distinct starting verbs (e.g. Spearheaded, Engineered, Orchestrated, Accelerated).
        - **NEVER** start consecutive or sibling bullets with similar verbs (e.g., "Led" and "Leading", "Achieved" and "Achieving").
        - **METRIC BALANCE (NO % SPAM)**: Do NOT flood every bullet with percentage (%) numbers. Focus on scope, team size, systems delivered, technologies scaled, or turnaround times. Maximum ONE percentage across all achievements combined.
        - Format as a single string with bullet points (•).
        - Each bullet should be a rich, two-line bullet in a normal resume editor (at least 20–35 words, not a short fragment).
        - **HARD REQUIREMENT**: If any bullet you generate is shorter than 18 words, you must expand it with additional context, actions, and quantified results before returning the final text.
        - STRICT REQUIREMENT: Output EXACTLY 3 or 4 bullet points. No more, no less.
        - DO NOT use prefixes like "Situation:" or "Action:".
        - **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form.`;

        const result = await callAIText(prompt, 'gpt-4o');
        const domain = detectActionVerbDomain(role);
        return ensureAllBulletsHaveUniqueVerbs(result.trim() || '', new Set(), domain);
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
