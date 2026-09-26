import { ResumeData, Experience, Education, Project, Certification } from '../types';
import { UserIntentResult } from './intentDetector';
import { AgentTask } from './taskRequirements';
import { ResumeOperation } from '../types/resumeOperations';
import { ResumeAgentMemory } from './resumeAgentMemory';

export interface ResumeEvidenceSnapshot {
  source: 'canonical_resume';
  version?: number | string;
  requestedSections: string[];
  summary?: string;
  experience?: Array<{
    itemId: string;
    role: string;
    company: string;
    location?: string;
    dates: string;
    bullets: Array<{ index: number; text: string }>;
  }>;
  skills?: string;
  education?: Array<{
    itemId: string;
    school: string;
    degree: string;
    year: string;
  }>;
  projects?: Array<{
    itemId: string;
    name: string;
    role?: string;
    description: string;
    technologies?: string;
    bullets?: Array<{ index: number; text: string }>;
  }>;
  certifications?: Array<{
    itemId: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  leadership?: Array<{
    itemId: string;
    role: string;
    organization: string;
    dates: string;
    bullets: Array<{ index: number; text: string }>;
  }>;
  jobTitle?: string;
  fullName?: string;
}

export interface GroundingValidationResult {
  valid: boolean;
  reason?: string;
  code?: 'target_not_found' | 'index_out_of_bounds' | 'rejected_claim_violation' | 'stale_version' | 'unsupported_metric';
}

/**
 * Deterministically checks whether a user message / intent requires grounding evidence from the current resume.
 */
export function requiresResumeEvidence(
  intent: UserIntentResult | string,
  message: string,
  task?: AgentTask
): boolean {
  const intentName = typeof intent === 'string' ? intent : intent?.intent;
  const text = (message || '').trim().toLowerCase();

  // Edge case: empty message
  if (!text) return false;

  // 1. Generic FAQs / Career advice / Greetings that do NOT refer to the user's specific resume
  const isGenericGreetingOrChat =
    /^(hi|hello|hey|greetings|good (morning|afternoon|evening)|howdy|sup|yo|ok|okay|thanks|thank you|cool|great|bye|cya)\b[!.?]*$/i.test(
      text
    );
  if (isGenericGreetingOrChat) return false;

  const isGenericConceptQuestion =
    /^(what is|what's|explain|define|how does|what are|why is)\s+(ats|applicant tracking system|a cv|a resume|a portfolio|a cover letter)\b[?.]*$/i.test(
      text
    ) ||
    /^(how long should a (cv|resume) be|what is the ideal length of a cv|how many pages should a cv be)\b[?.]*$/i.test(
      text
    ) ||
    /^(what should a [a-z0-9\s]+ (include|look like)|what are common interview questions|how to prepare for an interview)\b[?.]*$/i.test(
      text
    ) ||
    /^(what is a good answer to|how do i answer)\s+['"][^'"]+['"][?.]*$/i.test(text);

  // If it's purely generic concept without "my resume", "my cv", "my experience", etc.
  const refersToSelfResume =
    /\b(my|mine|i|this|current)\s+(resume|cv|summary|experience|skills|bullets?|job|role|title|education|projects?)\b/i.test(
      text
    ) || /\b(my (cv|resume)|tailor|rewrite|improve|audit|critique|check|fix|add|update)\b/i.test(text);

  if (isGenericConceptQuestion && !refersToSelfResume) {
    return false;
  }

  // 2. Explicit Resume-Dependent Intent Check
  const resumeDependentIntents = [
    'build_resume',
    'improve_entire_resume',
    'analyze_uploaded_resume',
    'tailor_job',
    'add_experience',
    'add_skills',
    'rewrite_section',
    'optimize_ats',
    'improve_metrics',
  ];

  if (intentName && resumeDependentIntents.includes(intentName)) {
    return true;
  }

  // 3. Deterministic Phrase Matching for Resume Requests
  const resumeActionPhrases = [
    'improve my resume',
    'rewrite my resume',
    'rewrite my summary',
    'rewrite my experience',
    'improve this bullet',
    'add experience',
    'improve my skills',
    'tailor my resume',
    'make my cv ats friendly',
    'make my resume ats friendly',
    'analyze my resume',
    'what is wrong with my cv',
    'what is wrong with my resume',
    "what's wrong with my cv",
    "what's wrong with my resume",
    'improve my metrics',
    'compare my resume with this jd',
    'do i have enough experience',
    'what skills am i missing',
    'optimize this section',
    'make this bullet stronger',
    'change my education',
    'improve my projects',
    'rewrite',
    'bullet',
    'tailor',
    'experience',
    'summary',
    'metric',
    'ats score',
  ];

  for (const phrase of resumeActionPhrases) {
    if (text.includes(phrase)) {
      return true;
    }
  }

  // 4. Task-based check
  if (task && (task.targetSection || task.responseMode === 'ACT' || task.responseMode === 'ANALYZE')) {
    return true;
  }

  return false;
}

/**
 * Deterministically determines which sections of the resume are required for grounding.
 */
export function determineRequiredResumeSections(
  intent: UserIntentResult | string,
  message: string,
  task?: AgentTask,
  resume?: ResumeData,
): string[] {
  const intentName = typeof intent === 'string' ? intent : intent?.intent;
  const text = (message || '').trim().toLowerCase();

  // If request does not require resume evidence, return empty
  if (!requiresResumeEvidence(intent, message, task)) {
    return [];
  }

  const sections = new Set<string>();

  // Full-scope requests (Tailoring, Overall Review, ATS Audit, General Overhaul)
  const isFullScope =
    intentName === 'tailor_job' ||
    intentName === 'improve_entire_resume' ||
    intentName === 'analyze_uploaded_resume' ||
    intentName === 'optimize_ats' ||
    /\b(tailor|audit|review|scan|check|what('s| is) wrong with|entire|full|whole|overall|rate my (cv|resume))\b/i.test(
      text
    );

  if (isFullScope) {
    return ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'leadership'];
  }

  // Check explicitly mentioned section names in user message
  if (
    task?.targetSection === 'summary' ||
    (intentName === 'rewrite_section' && text.includes('summary')) ||
    /\b(summary|summary section|bio|profile|intro|about me)\b/i.test(text)
  ) {
    sections.add('summary');
  }

  if (
    task?.targetSection === 'experience' ||
    intentName === 'add_experience' ||
    intentName === 'improve_metrics' ||
    /\b(experience|experience section|work experience|work|job|bullet|bullets|role|company|managed|led|achievement|career|history)\b/i.test(text)
  ) {
    sections.add('experience');
    sections.add('skills');
  }

  if (
    task?.targetSection === 'skills' ||
    intentName === 'add_skills' ||
    /\b(skill|skills|skills section|technologies|tools|languages|frameworks|stack|tech stack)\b/i.test(text)
  ) {
    sections.add('skills');
  }

  if (
    task?.targetSection === 'education' ||
    /\b(education|education section|degree|university|college|school|gpa|graduation|bachelor|master|phd)\b/i.test(text)
  ) {
    sections.add('education');
  }

  if (
    task?.targetSection === 'projects' ||
    /\b(project|projects|project section|projects section|portfolio|repository|github|app)\b/i.test(text)
  ) {
    sections.add('projects');
    sections.add('skills');
  }

  if (
    task?.targetSection === 'certifications' ||
    /\b(cert|certifications?|certifications? section|licenses?|credentials?|aws certified)\b/i.test(text)
  ) {
    sections.add('certifications');
  }

  if (
    task?.targetSection === 'leadership' ||
    /\b(leadership|leadership section|volunteering|board|community)\b/i.test(text)
  ) {
    sections.add('leadership');
  }

  // Scan current resume items against words in user message (e.g. "NanoPay", "Lead UI/UX Designer", "Stripe")
  if (resume) {
    const cleanMsg = text.replace(/[^a-z0-9]/g, '');

    // Check experience companies & roles
    for (const exp of resume.experience || []) {
      const c = (exp.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const r = (exp.role || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if ((c.length >= 3 && cleanMsg.includes(c)) || (r.length >= 4 && cleanMsg.includes(r))) {
        sections.add('experience');
        sections.add('skills');
      }
    }

    // Check projects names & roles
    for (const proj of resume.projects || []) {
      const n = (proj.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const r = (proj.role || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if ((n.length >= 3 && cleanMsg.includes(n)) || (r.length >= 4 && cleanMsg.includes(r))) {
        sections.add('projects');
        sections.add('skills');
      }
    }

    // Check leadership
    for (const lead of resume.leadership || []) {
      const o = (lead.organization || lead.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const r = (lead.role || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if ((o.length >= 3 && cleanMsg.includes(o)) || (r.length >= 4 && cleanMsg.includes(r))) {
        sections.add('leadership');
      }
    }
  }

  // Fallback: If section is still undetermined but resume evidence is required
  if (sections.size === 0) {
    if (task?.targetSection) {
      sections.add(task.targetSection);
    } else {
      sections.add('summary');
      sections.add('experience');
      sections.add('projects');
      sections.add('skills');
    }
  }

  return Array.from(sections);
}

/**
 * Extracts a compact grounding snapshot from the canonical resume containing only requested sections.
 */
export function extractResumeEvidence(
  resume: ResumeData,
  sections: string[],
  resumeVersion?: number | string
): ResumeEvidenceSnapshot {
  const snapshot: ResumeEvidenceSnapshot = {
    source: 'canonical_resume',
    version: resumeVersion,
    requestedSections: sections,
    jobTitle: resume.jobTitle || undefined,
    fullName: resume.fullName || undefined,
  };

  for (const section of sections) {
    switch (section.toLowerCase()) {
      case 'summary':
        snapshot.summary = resume.summary || '';
        break;

      case 'experience':
        snapshot.experience = (resume.experience || []).map((exp: Experience, idx: number) => {
          const rawDesc = exp.description;
          let bulletsList: Array<{ index: number; text: string }> = [];
          if (Array.isArray(rawDesc)) {
            bulletsList = rawDesc.map((text, bIdx) => ({ index: bIdx, text: String(text || '').trim() }));
          } else if (typeof rawDesc === 'string' && rawDesc.trim()) {
            bulletsList = rawDesc
              .split('\n')
              .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
              .filter(Boolean)
              .map((text, bIdx) => ({ index: bIdx, text }));
          }

          return {
            itemId: exp.id || `exp_${idx + 1}`,
            role: exp.role || 'Role',
            company: exp.company || 'Company',
            location: exp.location || undefined,
            dates: `${exp.startDate || ''} – ${exp.endDate || 'Present'}`.trim(),
            bullets: bulletsList,
          };
        });
        break;

      case 'skills':
        snapshot.skills = resume.skills || '';
        break;

      case 'education':
        snapshot.education = (resume.education || []).map((edu: Education, idx: number) => ({
          itemId: edu.id || `edu_${idx + 1}`,
          school: edu.school || '',
          degree: edu.degree || '',
          year: edu.year || '',
        }));
        break;

      case 'projects':
        snapshot.projects = (resume.projects || []).map((proj: Project, idx: number) => {
          const rawDesc = proj.description;
          let bulletsList: Array<{ index: number; text: string }> = [];
          if (Array.isArray(rawDesc)) {
            bulletsList = rawDesc.map((text, bIdx) => ({ index: bIdx, text: String(text || '').trim() }));
          } else if (typeof rawDesc === 'string' && rawDesc.trim()) {
            bulletsList = rawDesc
              .split('\n')
              .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
              .filter(Boolean)
              .map((text, bIdx) => ({ index: bIdx, text }));
          }
          return {
            itemId: proj.id || `proj_${idx + 1}`,
            name: proj.name || '',
            role: proj.role || undefined,
            description: typeof rawDesc === 'string' ? rawDesc : bulletsList.map((b) => b.text).join('\n'),
            technologies: proj.technologies || undefined,
            bullets: bulletsList,
          };
        });
        break;

      case 'certifications':
        snapshot.certifications = (resume.certifications || []).map((c: Certification, idx: number) => ({
          itemId: c.id || `cert_${idx + 1}`,
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || '',
        }));
        break;

      case 'leadership':
        snapshot.leadership = (resume.leadership || []).map((lead, idx) => {
          const bulletsList = (Array.isArray(lead.description) ? lead.description : [lead.description])
            .filter(Boolean)
            .map((b, bIdx) => ({ index: bIdx, text: String(b).trim() }));
          return {
            itemId: lead.id || `lead_${idx + 1}`,
            role: lead.role || '',
            organization: lead.organization || '',
            dates: `${lead.startDate || ''} – ${lead.endDate || 'Present'}`.trim(),
            bullets: bulletsList,
          };
        });
        break;
    }
  }

  return snapshot;
}

/**
 * Formats the compact [CURRENT_RESUME_EVIDENCE] prompt block.
 */
export function formatResumeEvidenceBlock(snapshot: ResumeEvidenceSnapshot | null): string {
  if (!snapshot || snapshot.requestedSections.length === 0) {
    return '';
  }

  const lines: string[] = ['[CURRENT_RESUME_EVIDENCE]'];
  lines.push('SOURCE: canonical_resume');
  if (snapshot.version !== undefined && snapshot.version !== null) {
    lines.push(`VERSION: ${snapshot.version}`);
  }
  lines.push(`REQUESTED_SECTIONS: ${snapshot.requestedSections.join(', ')}`);

  if (snapshot.jobTitle || snapshot.fullName) {
    lines.push(`HEADER: ${snapshot.fullName || 'Candidate'} | ${snapshot.jobTitle || 'Role'}`);
  }

  if (snapshot.summary !== undefined) {
    lines.push('\nSUMMARY:');
    lines.push(snapshot.summary ? `"${snapshot.summary}"` : '(empty)');
  }

  if (snapshot.experience && snapshot.experience.length > 0) {
    lines.push('\nEXPERIENCE:');
    for (const exp of snapshot.experience) {
      lines.push(`- [${exp.itemId}] ${exp.role} at ${exp.company}${exp.location ? ` | Location: ${exp.location}` : ''} (${exp.dates})`);
      if (exp.bullets.length > 0) {
        for (const b of exp.bullets) {
          lines.push(`  [b${b.index}] ${b.text}`);
        }
      } else {
        lines.push('  (no bullets)');
      }
    }
  }

  if (snapshot.projects && snapshot.projects.length > 0) {
    lines.push('\nPROJECTS:');
    for (const p of snapshot.projects) {
      lines.push(`- [${p.itemId}] ${p.name}${p.role ? ` | Role: ${p.role}` : ''}${p.technologies ? ` | Tech: ${p.technologies}` : ''}`);
      if (p.bullets && p.bullets.length > 0) {
        for (const b of p.bullets) {
          lines.push(`  [b${b.index}] ${b.text}`);
        }
      } else if (p.description) {
        lines.push(`  Description: ${p.description}`);
      } else {
        lines.push('  (no bullets/description)');
      }
    }
  }

  if (snapshot.skills !== undefined) {
    lines.push('\nSKILLS:');
    lines.push(snapshot.skills ? snapshot.skills : '(empty)');
  }

  if (snapshot.education && snapshot.education.length > 0) {
    lines.push('\nEDUCATION:');
    for (const edu of snapshot.education) {
      lines.push(`- [${edu.itemId}] ${edu.degree} — ${edu.school} (${edu.year})`);
    }
  }

  if (snapshot.certifications && snapshot.certifications.length > 0) {
    lines.push('\nCERTIFICATIONS:');
    for (const c of snapshot.certifications) {
      lines.push(`- [${c.itemId}] ${c.name} (${c.issuer}, ${c.date})`);
    }
  }

  if (snapshot.leadership && snapshot.leadership.length > 0) {
    lines.push('\nLEADERSHIP:');
    for (const lead of snapshot.leadership) {
      lines.push(`- [${lead.itemId}] ${lead.role} at ${lead.organization} (${lead.dates})`);
      if (lead.bullets && lead.bullets.length > 0) {
        for (const b of lead.bullets) {
          lines.push(`  [b${b.index}] ${b.text}`);
        }
      } else {
        lines.push('  (no bullets)');
      }
    }
  }

  lines.push('\n[/CURRENT_RESUME_EVIDENCE]');
  return lines.join('\n');
}

/**
 * Validates a proposed resume mutation against the current canonical resume state and persistent memory.
 */
export function validateMutationAgainstCurrentResume(
  resume: ResumeData,
  op: ResumeOperation,
  memory?: ResumeAgentMemory | null
): GroundingValidationResult {
  // 1. Validate Target Section
  if (op.op === 'set_field') {
    const field = op.field;
    if (!field || (typeof (resume as any)[field] === 'undefined' && !(field in resume))) {
      // allow standard fields
      const standardFields = [
        'fullName',
        'jobTitle',
        'email',
        'phone',
        'linkedin',
        'atHandle',
        'address',
        'location',
        'summary',
        'referee',
        'interests',
        'coursework',
        'thesis',
        'securityClearance',
      ];
      if (!standardFields.includes(field)) {
        return {
          valid: false,
          reason: `Field "${field}" does not exist in resume structure.`,
          code: 'target_not_found',
        };
      }
    }
  }

  // 2. Validate Bullet Operations
  if (op.op === 'replace_bullet' || op.op === 'delete_bullet' || op.op === 'insert_bullet') {
    const sectionName = op.section || 'experience';
    if (sectionName === 'experience') {
      const expList = resume.experience || [];
      const targetItem = op.itemId ? expList.find((e) => e.id === op.itemId) : expList[0];
      if (!targetItem) {
        return {
          valid: false,
          reason: `Target experience item "${op.itemId}" not found in current resume.`,
          code: 'target_not_found',
        };
      }

      const bullets = Array.isArray(targetItem.description)
        ? targetItem.description
        : typeof targetItem.description === 'string'
        ? targetItem.description.split('\n').filter(Boolean)
        : [];

      if (op.op === 'replace_bullet' || op.op === 'delete_bullet') {
        if (typeof op.bulletIndex !== 'number' || op.bulletIndex < 0 || op.bulletIndex >= bullets.length) {
          return {
            valid: false,
            reason: `Bullet index ${op.bulletIndex} is out of bounds for item "${targetItem.role}".`,
            code: 'index_out_of_bounds',
          };
        }
      }
    }
  }

  // 3. Validate Item Operations
  if (op.op === 'update_item' || op.op === 'delete_item') {
    const sectionName = op.section || 'experience';
    const items = (resume as any)[sectionName];
    if (Array.isArray(items)) {
      const exists = items.some((i: any) => i.id === op.itemId);
      if (!exists && op.itemId) {
        return {
          valid: false,
          reason: `Target item "${op.itemId}" not found in section "${sectionName}".`,
          code: 'target_not_found',
        };
      }
    }
  }

  // 4. Validate Against Rejected Claims in Memory
  if (memory?.rejectedSuggestions && memory.rejectedSuggestions.length > 0) {
    const textToCheck =
      op.op === 'replace_bullet' || op.op === 'insert_bullet'
        ? op.value
        : op.op === 'set_field'
        ? op.value
        : '';

    if (textToCheck) {
      const lowerVal = textToCheck.toLowerCase();
      for (const rej of memory.rejectedSuggestions) {
        if (rej.claim && lowerVal.includes(rej.claim.toLowerCase().trim())) {
          return {
            valid: false,
            reason: `Operation introduces rejected claim: "${rej.claim}".`,
            code: 'rejected_claim_violation',
          };
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Checks if a pending operation is stale compared to the current resume document.
 */
export function isOperationStaleWithResume(
  op: ResumeOperation,
  currentResume: ResumeData,
  expectedVersion?: number | string
): boolean {
  // If version explicitly provided and doesn't match
  if (
    expectedVersion !== undefined &&
    (currentResume as any).revision !== undefined &&
    expectedVersion !== (currentResume as any).revision
  ) {
    return true;
  }

  const validation = validateMutationAgainstCurrentResume(currentResume, op);
  return !validation.valid;
}
