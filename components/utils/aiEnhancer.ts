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

## 1. STRATEGIC QUANTIFICATION (BALANCED & NATURAL)
- **MAXIMUM 2 metrics per ENTIRE role** (not per bullet - across all bullets for this role)
- **PREFER non-percentage metrics**: Team size, budget amounts, user counts, time periods, dollar amounts, project counts
- **LIMIT percentages**: Use percentages ONLY when they're truly impressive and contextual (e.g., "Increased revenue by 150%" is strong; "Improved efficiency by 15%" is weak)
- **AVOID**: Multiple percentages in one role (e.g., "increased by 20%, reduced by 15%, improved by 18%") - this screams AI-generated
- **AVOID**: Vague percentages without context (e.g., "Improved efficiency by 30%" is weak)
- **Use your recruiter knowledge**: Based on the role, industry, and company context, strategically add metrics where they make sense
- **Infer intelligently**: If the original doesn't have numbers, use your experience to infer reasonable metrics based on:
  * Role level (junior vs senior)
  * Industry standards (tech vs finance vs healthcare)
  * Company size (startup vs enterprise)
  * Typical scope for this type of role
- **NEVER exaggerate**: Keep metrics realistic and believable - you know what's reasonable for each context
- Mix 1-2 metric-driven bullets with strategic/leadership bullets that have NO metrics
- **CRITICAL**: Not every bullet needs a metric - you know when metrics add value and when strategic impact is more powerful

## 2. BULLET POINT ARCHETYPES (Mix These):
${isRecent ? `
   **For Recent/Current Roles (4-5 bullets):**
   - 1 "Strategic Impact" bullet (What system/process did you build? NO metric needed - focus on transformation)
   - 1 "Leadership/Scope" bullet (Team size, budget amount, stakeholder count - USE NUMBERS HERE)
   - 1 "Problem-Solving" bullet (Specific challenge resolved - NO metric needed, focus on solution)
   - 1-2 "Execution/Project" bullets (Key deliverables - USE NUMBERS HERE if available: user count, project count, timeline)
   - **REQUIREMENT**: Maximum 2 bullets should have metrics across the entire role
   - **PREFER**: Use counts, dollar amounts, time periods over percentages
` : `
   **For Earlier Roles (3-4 bullets):**
   - 1 "Core Responsibility" bullet (What was your main function? NO metric needed)
   - 1 "Key Achievement" bullet (Most proud accomplishment - USE NUMBERS HERE if available)
   - 1-2 "Technical/Skill" bullets (What you built/used - USE NUMBERS HERE if relevant: scale, scope)
   - **REQUIREMENT**: Maximum 2 bullets should have metrics across the entire role
   - **PREFER**: Use counts, dollar amounts, time periods over percentages
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
✅ GOOD (Non-percentage metrics): "Architected microservices platform serving 2M+ users, reducing infrastructure costs by $400K annually"
✅ GOOD (Count/Time): "Led cross-functional team of 8 engineers to deliver mobile app 3 weeks ahead of schedule"
✅ GOOD (Count): "Resolved critical production incident affecting 50K users by implementing automated failover system"
✅ GOOD (Dollar/Count): "Managed $2M annual budget and delivered 15+ projects on time and within budget"
✅ GOOD (Count): "Established comprehensive design system used by 25+ product teams across the organization"
✅ GOOD (Strategic, no metric): "Spearheaded UX research initiatives that influenced product strategy and uncovered key user insights"
✅ GOOD (Strategic, no metric): "Facilitated smooth design-to-engineering handoffs, ensuring precise implementation and alignment"

❌ BAD: "Increased engagement by 25%, expanded reach by 40%, boosted acquisition by 20%" (too many percentages - screams AI)
❌ BAD: "Improved efficiency by 30%" (vague percentage without context)
❌ BAD: "Increased productivity by 25%, reduced costs by 20%, improved quality by 15%" (metric overload - too many percentages)
❌ BAD: "Utilized Agile methodologies to enhance team collaboration" (no metrics, buzzword soup)
❌ BAD: Starting multiple bullets with the same verb (e.g., "Led team...", "Led project...", "Led initiative...")
❌ BAD: Every bullet having a percentage (makes it look AI-generated)
❌ BAD: Exaggerating numbers beyond what's reasonable for the role/industry (e.g., saying "team of 50" for a junior role, or "increased by 500%" without context)
❌ BAD: Adding metrics that don't make sense for the role or industry context

# FINAL OUTPUT:
- Return ONLY the bullet points (use •)
- ${isRecent ? '4-5 bullets' : '3-4 bullets'}
- NO introductory text
- Make it sound HUMAN, not AI-generated
- **CRITICAL**: Maximum 2 bullets should have metrics across the ENTIRE role (not per bullet)
- **PREFER**: Use non-percentage metrics (team size, budget, user count, time periods, dollar amounts, project count)
- **LIMIT**: Use percentages ONLY when truly impressive (e.g., "Increased revenue by 150%" not "Improved efficiency by 15%")
- **MANDATORY**: Every bullet MUST start with a DIFFERENT action verb
- **BALANCE**: Mix metric-driven bullets (max 2) with strategic/leadership bullets that have NO metrics
- **AVOID**: Making every bullet have a percentage - this screams AI-generated
- **USE YOUR EXPERTISE**: Strategically add metrics based on your recruiter knowledge of what's appropriate for this role and industry
- **NEVER EXAGGERATE**: Keep numbers realistic and believable - you know what's reasonable for each context
- **BUILD ON THE ORIGINAL**: Enhance the original description intelligently, using your experience to know where metrics add value
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
        const prompt = `You are a senior executive recruiter with 15+ years of experience. Generate 3-4 high-impact resume bullet points for a "${role}" position at "${company}".
        
        Keywords/Context to include: ${keywords}
        
        Your approach: Use your recruiter expertise to strategically craft bullets. You know what metrics are appropriate for this role and industry. Build on the context provided, but use your experience to enhance it intelligently.
        
        Instructions:
        - Use strong action verbs.
        - **MANDATORY**: Every single bullet point MUST start with a DIFFERENT action verb.
        - **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs.
        - **NEVER** start consecutive bullets with similar verbs.
        - **Use your recruiter knowledge**: Based on the role, industry, and company context, strategically add metrics where they make the story stronger (not generic statements).
        - **Look for clues in the existing bullets/context**: If the current text hints at teams, projects, users, budgets, timelines, or scope, turn those into clear numbers instead of leaving them vague.
        - **Infer intelligently when no metrics are given**: Use your experience to infer reasonable metrics based on role level, industry standards, company size, and typical scope so the bullets do NOT feel generic or metric-free.
        - **NEVER EXAGGERATE**: Keep metrics realistic and believable - you know what's reasonable for each context
        - Follow strategic quantification rules from the recruiter guide:
          * **MAXIMUM 2 metrics per ENTIRE role** (not per bullet - across all bullets for this role).
          * **PREFER non-percentage metrics**: Team size, budget amounts, user counts, time periods, dollar amounts, project counts.
          * **LIMIT percentages**: Use percentages ONLY when truly impressive (e.g., "Increased revenue by 150%" not "Improved efficiency by 15%").
          * **AVOID**: Multiple percentages in one role (e.g., "increased by 20%, reduced by 15%, improved by 18%") - this screams AI-generated.
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
        const prompt = `You are a senior executive recruiter with 15+ years of experience across industries and markets globally. You understand what recruiters and hiring managers want to see, what they don't want to see, and how to craft resumes that get interviews. You have deep knowledge of different roles, industries, company sizes, and what metrics are appropriate and impressive for each context. You're helping a candidate tailor their resume to THIS SPECIFIC JOB. You HATE resumes that scream "AI-generated" with excessive metrics and generic buzzwords.

Your approach: You build on the original resume, but you use your recruiter expertise to strategically enhance it. You know where metrics should go, what types of metrics work best, and how to make the resume compelling without being unrealistic. The original resume is your foundation - you enhance it intelligently based on your experience and the job requirements.

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

### STRATEGIC QUANTIFICATION RULES (BALANCED & NATURAL):
- **MAXIMUM 2 metrics per ENTIRE role** (not per bullet - across all bullets for this role)
- **PREFER non-percentage metrics**: Team size, budget amounts, user counts, time periods, dollar amounts, project counts
- **LIMIT percentages**: Use percentages ONLY when truly impressive and contextual (e.g., "Increased revenue by 150%" is strong; "Improved efficiency by 15%" is weak)
- ❌ **AVOID**: Multiple percentages in one role (e.g., "increased by 20%, reduced by 15%, improved by 18%") – this screams AI-generated
- ❌ **AVOID**: Vague percentages without context (20%, 30%, 40%) – this looks AI-generated
- ✅ **PREFER**: Specific non-percentage numbers ("Reduced deployment time from 2 weeks to 3 days", "Launched mobile app to 50K users", "Managed team of 12 engineers", "Delivered $2M project on budget")
- Mix 1-2 metric-driven bullets with strategic/leadership bullets that have NO metrics

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
- **MANDATORY**: Every bullet point MUST start with a DIFFERENT action verb
- **NO EXCEPTIONS**: If you generate 4 bullets, you must use 4 completely different verbs
- **NEVER** start consecutive bullets with similar verbs (e.g., "Led" and "Leading", "Built" and "Building")
- Mix: Action statements, Achievement statements, Scope statements
- Sound like a HUMAN wrote this, not an AI
- **VERIFICATION**: Before outputting, check that NO two bullets start with the same verb or verb form

### EXAMPLES OF WHAT TO DO (Good Mix):
✅ "Architected microservices platform serving 2M+ users, reducing infrastructure costs by $400K annually" (user count + dollar amount)
✅ "Led cross-functional team of 8 engineers to deliver mobile app 3 weeks ahead of schedule" (team size + time)
✅ "Resolved critical production incident affecting 50K users by implementing automated failover" (user count)
✅ "Built CI/CD pipeline that reduced deployment time from 2 weeks to 3 days" (time period - no percentage)
✅ "Managed $2M annual budget and delivered 15+ projects on time and within budget" (dollar amount + project count)
✅ "Established comprehensive design system used by 25+ product teams across the organization" (team count)
✅ "Spearheaded UX research initiatives that influenced product strategy and uncovered key user insights" (NO metric - strategic focus)
✅ "Facilitated smooth design-to-engineering handoffs, ensuring precise implementation and alignment" (NO metric - process focus)

### EXAMPLES OF WHAT TO AVOID:
❌ "Increased engagement by 25%, expanded reach by 40%, boosted acquisition by 20%" (too many percentages - screams AI)
❌ "Improved efficiency by 30%" (vague percentage without context)
❌ "Increased productivity by 25%, reduced costs by 20%, improved quality by 15%" (metric overload - too many percentages)
❌ "Utilized Agile methodologies to enhance team collaboration" (no metrics, buzzword soup)
❌ Every bullet having a percentage (makes it look AI-generated)

## 3. SKILLS (Top 8 ONLY, comma-separated):
- Prioritize skills EXPLICITLY mentioned in the job description
- Use EXACT terminology from the JD
- Order by relevance to THIS job
- NO generic skills unless in the JD
- Be specific: "React.js" not "Frontend Development"

## 4. KEY ACHIEVEMENTS (3-4 bullet points):
**THIS is the ONLY place where 2-3 METRIC-HEAVY bullets are acceptable** (unlike the experience section).
- Each achievement should be IMPRESSIVE and RELEVANT to THIS job
- Use STAR method but write it as ONE cohesive sentence
- Start with strong action verbs
- Show scope, scale, and business impact
- Align with the job's key requirements
- Use superlatives when truthful (first, largest, fastest).

CRITICAL RULES:
- **Use your recruiter expertise**: Draw on your 15+ years of experience to know what metrics are appropriate for this role, industry, and company size
- **Build strategically on the original**: The original resume is your foundation - enhance it intelligently based on the job requirements and your knowledge
- **Mine the current resume for clues**: Look at the existing experience and achievements to detect implied scope (team size, number of projects, user counts, budgets, timelines) and turn those into clear metrics.
- **Add metrics where they make the story stronger**: At least 1 strong metric-driven bullet for every significant role, and 2–3 strong metric-driven bullets in the Key Achievements section.
- **When no metrics exist in the original text**: Infer realistic, job-appropriate metrics from the context (role level, industry, company size) so the resume does NOT feel generic or metric-free.
- **NEVER EXAGGERATE**: Metrics must stay realistic and believable for this context.
- Make this resume sound like the PERFECT candidate for THIS SPECIFIC JOB
- VARY sentence structure and verbs - no repetition
- Sound HUMAN, not AI-generated
- **CRITICAL**: Maximum 2 explicit metrics per experience role (not per bullet - across all bullets)
- **PREFER**: Non-percentage metrics (team size, budget, user count, time periods, dollar amounts)
- **LIMIT**: Percentages only when truly impressive (Key Achievements can have more, but still must be credible and not percentage-heavy)

## 5. KEYWORD COVERAGE (FOR ATS + JOB MATCH) - STRICT

1. From the JOB DESCRIPTION, build a mental list of **CRITICAL KEYWORDS**:
   - Skills, tools, frameworks, methodologies, and responsibilities that appear **2+ times** in the JD, AND
   - Any seniority / role-defining words (Senior, Lead, Manager, Principal, Director, etc.).

2. When you write the new resume content:
   - You MUST include **at least 95% of these CRITICAL KEYWORDS** somewhere in the final resume:
     - Summary, OR
     - Experience bullets, OR
     - Skills list, OR
     - Key Achievements.
   - Use **EXACT spelling/wording from the JD** so ATS systems see a direct match.

3. Avoid keyword spam:
   - Do **NOT** repeat the exact same CRITICAL KEYWORD more than **2 times total** across the whole resume.
   - Prefer to use each important keyword **once**, maybe twice if it is truly central to the role.
   - If a keyword already appears clearly, use synonyms or vary sentence structure instead of repeating it again.

4. BEFORE you output the JSON:
   - Quickly scan your final summary, experience, skills, and achievements.
   - Confirm that **at least 95% of CRITICAL KEYWORDS** from the JD appear at least once.
   - If any are missing (and would be honest to include), revise bullets/summary/skills to insert them naturally.
   - Do not add keywords that would be dishonest about the candidate's background.

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
        - Include metrics/numbers to quantify the Result and avoid generic statements.
        - Format as a single string with bullet points (•).
        - Each bullet should be a rich, two-line bullet in a normal resume editor (at least 20–35 words, not a short fragment).
        - **HARD REQUIREMENT**: If any bullet you generate is shorter than 18 words, you must expand it with additional context, actions, and quantified results before returning the final text.
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
