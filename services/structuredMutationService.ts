import {
  ResumeContract,
  StructuredResumeOperation,
  StructuredResumeOperationSchema,
  CandidateEvidence,
  generateStableId,
  parseBulletToStructured,
  structuredToResumeData,
  Skill,
  ResumeSection,
} from '../types/agentContract';
import type { ResumeData } from '../types';
import {
  CandidateEvidenceService,
  getEvidenceService,
  ClaimValidationResult,
} from './candidateEvidenceService';

/**
 * CVArchitect Structured Resume Mutation Engine (Phase 7 Foundation)
 *
 * Implements strict, atomic, structured mutations:
 * 1. Validates operation structure with Zod.
 * 2. Verifies the target item exists.
 * 3. Enforces factual claim validation and anti-hallucination metric checks.
 * 4. Applies immutable mutation to the structured ResumeContract.
 * 5. Returns updated renderable ResumeData and records snapshots for rollback.
 * 6. ABORTS cleanly without touching the resume if validation fails.
 */

export interface MutationResult {
  success: boolean;
  updatedContract?: ResumeContract;
  updatedResumeData?: ResumeData;
  appliedOperation?: StructuredResumeOperation;
  error?: string;
  code?:
    | 'target_not_found'
    | 'unsupported_metric'
    | 'missing_evidence'
    | 'conflicting_evidence'
    | 'invalid_schema'
    | 'mutation_error';
  validationDetails?: ClaimValidationResult;
  snapshotId?: string;
}

export interface ResumeSnapshot {
  id: string;
  candidateId: string;
  version: number;
  timestamp: number;
  contract: ResumeContract;
  operationApplied?: StructuredResumeOperation;
}

export class StructuredMutationService {
  private snapshots: Map<string, ResumeSnapshot[]> = new Map(); // candidateId -> snapshots

  /**
   * Apply an atomic structured operation to a ResumeContract
   */
  public applyStructuredOperation(params: {
    resume: ResumeContract;
    operation: StructuredResumeOperation;
    evidencePool?: CandidateEvidence[];
    evidenceService?: CandidateEvidenceService;
    candidateId?: string;
  }): MutationResult {
    const { resume, operation, candidateId = resume.candidate.id || 'default_candidate' } = params;
    const evidenceSvc = params.evidenceService || getEvidenceService();
    const evidencePool = params.evidencePool || evidenceSvc.getCandidateEvidence(candidateId);

    // ── 1. Validate Operation Schema with Zod ──────────────────────────────
    const parsedOp = StructuredResumeOperationSchema.safeParse(operation);
    if (!parsedOp.success) {
      return {
        success: false,
        error: `Invalid operation schema: ${parsedOp.error.issues.map((i) => i.message).join('; ')}`,
        code: 'invalid_schema',
      };
    }
    const op = parsedOp.data;

    // ── 2. Validate Factual Claims & Grounding ──────────────────────────────
    if ('newContent' in op && typeof op.newContent === 'string' && op.newContent.trim()) {
      const claimValidation = evidenceSvc.validateClaimAgainstEvidence(op.newContent, evidencePool);
      if (!claimValidation.isValid) {
        return {
          success: false,
          error: `Claim validation rejected: ${claimValidation.reasons.join('; ')}`,
          code: claimValidation.code as any,
          validationDetails: claimValidation,
        };
      }
    }

    // Clone resume immutably
    const next: ResumeContract = JSON.parse(JSON.stringify(resume));

    // ── 3. Target Verification & Mutation Execution ─────────────────────────
    let mutationSuccessful = false;

    switch (op.operation) {
      case 'replace_bullet': {
        // Search in experience
        for (const exp of next.experience) {
          const bulletIdx = exp.bullets.findIndex((b) => b.id === op.targetId);
          if (bulletIdx !== -1) {
            exp.bullets[bulletIdx] = parseBulletToStructured(op.newContent, op.targetId);
            if (op.evidenceIds && op.evidenceIds.length > 0) {
              exp.bullets[bulletIdx].evidenceReferences = op.evidenceIds;
            }
            mutationSuccessful = true;
            break;
          }
        }

        // Search in leadership if not found
        if (!mutationSuccessful) {
          for (const lead of next.leadership) {
            const bulletIdx = lead.bullets.findIndex((b) => b.id === op.targetId);
            if (bulletIdx !== -1) {
              lead.bullets[bulletIdx] = parseBulletToStructured(op.newContent, op.targetId);
              if (op.evidenceIds) lead.bullets[bulletIdx].evidenceReferences = op.evidenceIds;
              mutationSuccessful = true;
              break;
            }
          }
        }

        // Search in keyAchievements
        if (!mutationSuccessful) {
          const achieveIdx = next.keyAchievements.findIndex((a) => a.id === op.targetId);
          if (achieveIdx !== -1) {
            next.keyAchievements[achieveIdx] = parseBulletToStructured(op.newContent, op.targetId);
            mutationSuccessful = true;
          }
        }

        if (!mutationSuccessful) {
          return {
            success: false,
            error: `Target bullet "${op.targetId}" not found in resume.`,
            code: 'target_not_found',
          };
        }
        break;
      }

      case 'add_bullet': {
        const newBullet = parseBulletToStructured(op.newContent);
        if (op.evidenceIds) newBullet.evidenceReferences = op.evidenceIds;

        // Try to match experience item by ID
        const targetExp = next.experience.find((e) => e.id === op.targetId);
        if (targetExp) {
          const insertIdx = typeof op.bulletIndex === 'number' ? op.bulletIndex : targetExp.bullets.length;
          targetExp.bullets.splice(insertIdx, 0, newBullet);
          mutationSuccessful = true;
        }

        // Try to match bullet ID to insert after
        if (!mutationSuccessful) {
          for (const exp of next.experience) {
            const bIdx = exp.bullets.findIndex((b) => b.id === op.targetId);
            if (bIdx !== -1) {
              exp.bullets.splice(bIdx + 1, 0, newBullet);
              mutationSuccessful = true;
              break;
            }
          }
        }

        if (!mutationSuccessful) {
          return {
            success: false,
            error: `Target experience item or bullet "${op.targetId}" not found.`,
            code: 'target_not_found',
          };
        }
        break;
      }

      case 'remove_bullet': {
        for (const exp of next.experience) {
          const bIdx = exp.bullets.findIndex((b) => b.id === op.targetId);
          if (bIdx !== -1) {
            exp.bullets.splice(bIdx, 1);
            mutationSuccessful = true;
            break;
          }
        }

        if (!mutationSuccessful) {
          for (const lead of next.leadership) {
            const bIdx = lead.bullets.findIndex((b) => b.id === op.targetId);
            if (bIdx !== -1) {
              lead.bullets.splice(bIdx, 1);
              mutationSuccessful = true;
              break;
            }
          }
        }

        if (!mutationSuccessful) {
          const achIdx = next.keyAchievements.findIndex((a) => a.id === op.targetId);
          if (achIdx !== -1) {
            next.keyAchievements.splice(achIdx, 1);
            mutationSuccessful = true;
          }
        }

        if (!mutationSuccessful) {
          return {
            success: false,
            error: `Target bullet "${op.targetId}" not found to remove.`,
            code: 'target_not_found',
          };
        }
        break;
      }

      case 'replace_summary': {
        next.candidate.summary = op.newContent;
        // Ensure summary section visibility is active
        const summarySec = next.sections.find((s) => s.type === 'summary');
        if (summarySec) summarySec.isVisible = true;
        mutationSuccessful = true;
        break;
      }

      case 'add_skill': {
        const skillName = op.newContent.trim();
        const existing = next.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (!existing) {
          const newSkill: Skill = {
            id: generateStableId('skill'),
            name: skillName,
            category: op.category || 'technical',
            evidenceIds: op.evidenceIds || [],
            isTargetJobMatch: true,
          };
          next.skills.push(newSkill);
          next.skillsRaw = next.skills.map((s) => s.name).join(', ');
        }
        mutationSuccessful = true;
        break;
      }

      case 'remove_skill': {
        const initialLen = next.skills.length;
        next.skills = next.skills.filter(
          (s) => s.id !== op.targetId && s.name.toLowerCase() !== op.targetId.toLowerCase()
        );
        if (next.skills.length < initialLen) {
          next.skillsRaw = next.skills.map((s) => s.name).join(', ');
          mutationSuccessful = true;
        } else {
          return {
            success: false,
            error: `Skill "${op.targetId}" not found in resume.`,
            code: 'target_not_found',
          };
        }
        break;
      }

      case 'reorder_skills': {
        const desiredOrder = op.newContent as string[];
        const ordered: Skill[] = [];
        const remaining = [...next.skills];

        for (const nameOrId of desiredOrder) {
          const idx = remaining.findIndex(
            (s) => s.id === nameOrId || s.name.toLowerCase() === nameOrId.toLowerCase()
          );
          if (idx !== -1) {
            ordered.push(remaining[idx]);
            remaining.splice(idx, 1);
          }
        }
        next.skills = [...ordered, ...remaining];
        next.skillsRaw = next.skills.map((s) => s.name).join(', ');
        mutationSuccessful = true;
        break;
      }

      case 'reorder_experience': {
        const desiredIds = op.newContent as string[];
        const ordered = desiredIds
          .map((id) => next.experience.find((e) => e.id === id))
          .filter((e): e is NonNullable<typeof e> => !!e);

        const leftover = next.experience.filter((e) => !desiredIds.includes(e.id));
        next.experience = [...ordered, ...leftover];
        mutationSuccessful = true;
        break;
      }

      case 'reorder_section': {
        const desiredTypes = op.newContent as string[];
        const orderedSecs: ResumeSection[] = [];

        for (const type of desiredTypes) {
          const sec = next.sections.find((s) => s.type === type || s.id === type);
          if (sec) orderedSecs.push(sec);
        }
        const leftoverSecs = next.sections.filter(
          (s) => !desiredTypes.includes(s.type) && !desiredTypes.includes(s.id)
        );

        next.sections = [...orderedSecs, ...leftoverSecs].map((s, idx) => ({
          ...s,
          order: idx,
        }));
        mutationSuccessful = true;
        break;
      }

      case 'update_project': {
        const proj = next.projects.find((p) => p.id === op.targetId);
        if (!proj) {
          return {
            success: false,
            error: `Target project "${op.targetId}" not found.`,
            code: 'target_not_found',
          };
        }
        Object.assign(proj, op.newContent);
        mutationSuccessful = true;
        break;
      }

      case 'update_education': {
        const edu = next.education.find((e) => e.id === op.targetId);
        if (!edu) {
          return {
            success: false,
            error: `Target education item "${op.targetId}" not found.`,
            code: 'target_not_found',
          };
        }
        Object.assign(edu, op.newContent);
        mutationSuccessful = true;
        break;
      }
    }

    if (!mutationSuccessful) {
      return {
        success: false,
        error: `Could not apply operation "${op.operation}".`,
        code: 'mutation_error',
      };
    }

    // Increment version & timestamps
    next.version = (next.version || 1) + 1;
    next.updatedAt = Date.now();

    // ── 4. Save Version Snapshot for Rollback Protection ────────────────────
    const snapshot = this.saveSnapshot(candidateId, next, op);

    // ── 5. Convert to Renderable ResumeData ─────────────────────────────────
    const updatedResumeData = structuredToResumeData(next);

    return {
      success: true,
      updatedContract: next,
      updatedResumeData,
      appliedOperation: op,
      snapshotId: snapshot.id,
    };
  }

  /**
   * Saves an immutable snapshot of the resume
   */
  public saveSnapshot(
    candidateId: string,
    contract: ResumeContract,
    operation?: StructuredResumeOperation
  ): ResumeSnapshot {
    if (!this.snapshots.has(candidateId)) {
      this.snapshots.set(candidateId, []);
    }

    const snapshot: ResumeSnapshot = {
      id: generateStableId('snap'),
      candidateId,
      version: contract.version,
      timestamp: Date.now(),
      contract: JSON.parse(JSON.stringify(contract)),
      operationApplied: operation,
    };

    this.snapshots.get(candidateId)!.push(snapshot);
    return snapshot;
  }

  /**
   * Restores the resume to a previous version snapshot
   */
  public restoreSnapshot(candidateId: string, version: number): ResumeContract | null {
    const list = this.snapshots.get(candidateId);
    if (!list) return null;

    const match = list.find((s) => s.version === version);
    if (!match) return null;

    return JSON.parse(JSON.stringify(match.contract));
  }

  /**
   * Retrieves all snapshot history for a candidate
   */
  public getSnapshotHistory(candidateId: string): ResumeSnapshot[] {
    return this.snapshots.get(candidateId) || [];
  }
}

// Global Singleton Instance
let defaultMutationService: StructuredMutationService | null = null;
export function getStructuredMutationService(): StructuredMutationService {
  if (!defaultMutationService) {
    defaultMutationService = new StructuredMutationService();
  }
  return defaultMutationService;
}
