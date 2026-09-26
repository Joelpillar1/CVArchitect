import { z } from 'zod';

/**
 * Structured resume operations — the validated, streamable unit of change the
 * CVArchitect Agent emits. The agent NEVER edits the resume directly; it proposes
 * one of these operations, the server validates it, streams it to the client, and a
 * pure client reducer (`applyOperation`) applies it to `ResumeData`. This keeps the
 * app the single deterministic renderer (27 templates) while the agent only proposes
 * grounded *data* changes.
 *
 * Shared by client and server so validation is identical on both sides.
 */

// ── Field / section vocabularies ────────────────────────────────────────────

/** Scalar (single-string) fields settable via `set_field`. Skills has dedicated ops. */
export const SCALAR_FIELDS = [
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
] as const;
export type ScalarField = (typeof SCALAR_FIELDS)[number];

/** Structured array sections operated on by item (update/insert/delete). */
export const ARRAY_SECTIONS = [
  'experience',
  'education',
  'certifications',
  'projects',
  'leadership',
  'additionalInfo',
  'languages',
] as const;
export type ArraySection = (typeof ARRAY_SECTIONS)[number];

/** Sections that carry a bullet list. experience/leadership/projects resolve by itemId;
 *  keyAchievements is a single list on the root (no itemId). */
export const BULLET_SECTIONS = ['experience', 'leadership', 'keyAchievements', 'projects'] as const;
export type BulletSection = (typeof BULLET_SECTIONS)[number];

/** Editable scalar fields per array-section item — enforced by the validator so the
 *  agent can't inject arbitrary keys. `description` for experience/leadership may be a
 *  string or string[] (the reducer normalizes it). */
export const ARRAY_ITEM_FIELDS: Record<ArraySection, readonly string[]> = {
  experience: ['company', 'role', 'location', 'roleSummary', 'startDate', 'endDate', 'description', 'bullets', 'title', 'position', 'dates', 'date', 'period'],
  leadership: ['company', 'role', 'location', 'roleSummary', 'startDate', 'endDate', 'description', 'bullets', 'title', 'position', 'dates', 'date', 'period'],
  education: ['school', 'degree', 'year', 'gpa', 'relevantCourses', 'institution', 'university', 'college', 'graduationYear', 'date', 'dates'],
  certifications: ['name', 'issuer', 'date', 'link', 'organization', 'authority'],
  projects: ['name', 'description', 'link', 'technologies', 'techStack', 'skills', 'tools'],
  additionalInfo: ['label', 'value'],
  languages: ['language', 'proficiency'],
};

// ── Operation schema (discriminated union) ───────────────────────────────────

/** Envelope present on every operation. operationId + agentRunId are assigned
 *  server-side (the model never supplies them). */
const envelope = {
  operationId: z.string().min(1),
  agentRunId: z.string().min(1),
  reason: z.string(),
  evidence: z.array(z.string()),
};

const fieldsRecord = z.record(z.string(), z.string());

export const ResumeOperationSchema = z.discriminatedUnion('op', [
  z.object({ ...envelope, op: z.literal('set_field'), field: z.enum(SCALAR_FIELDS), value: z.string() }),

  z.object({
    ...envelope,
    op: z.literal('replace_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletIndex: z.number().int(),
    value: z.string(),
  }),
  z.object({
    ...envelope,
    op: z.literal('insert_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletIndex: z.number().int(),
    value: z.string(),
  }),
  z.object({
    ...envelope,
    op: z.literal('delete_bullet'),
    section: z.enum(BULLET_SECTIONS),
    itemId: z.string().optional(),
    bulletIndex: z.number().int(),
  }),

  z.object({
    ...envelope,
    op: z.literal('update_item'),
    section: z.enum(ARRAY_SECTIONS),
    itemId: z.string(),
    fields: fieldsRecord,
  }),
  z.object({
    ...envelope,
    op: z.literal('insert_item'),
    section: z.enum(ARRAY_SECTIONS),
    item: fieldsRecord,
  }),
  z.object({
    ...envelope,
    op: z.literal('delete_item'),
    section: z.enum(ARRAY_SECTIONS),
    itemId: z.string(),
  }),

  z.object({ ...envelope, op: z.literal('add_skill'), value: z.string() }),
  z.object({ ...envelope, op: z.literal('remove_skill'), value: z.string() }),
  z.object({ ...envelope, op: z.literal('set_skills'), value: z.string() }),

  z.object({ ...envelope, op: z.literal('reorder_sections'), order: z.array(z.string()) }),
  z.object({
    ...envelope,
    op: z.literal('show_section'),
    section: z.string(),
    value: z.string().optional(),
  }),
  z.object({
    ...envelope,
    op: z.literal('hide_section'),
    section: z.string(),
  }),
  z.object({
    ...envelope,
    op: z.literal('rename_section'),
    section: z.string(),
    title: z.string(),
  }),
]);

export type ResumeOperation = z.infer<typeof ResumeOperationSchema>;
export type OperationType = ResumeOperation['op'];

/** Ops that create/alter candidate content and therefore MUST cite evidence.
 *  Pure removals and reordering/layout do not. */
const EVIDENCE_EXEMPT: ReadonlySet<OperationType> = new Set([
  'delete_bullet',
  'delete_item',
  'remove_skill',
  'reorder_sections',
  'show_section',
  'hide_section',
  'rename_section',
]);

export const operationRequiresEvidence = (op: OperationType): boolean => !EVIDENCE_EXEMPT.has(op);

// ── SSE event protocol (server → client) ─────────────────────────────────────

export type AgentSSEEvent =
  | { type: 'run_started'; agentRunId: string }
  | { type: 'heartbeat' }
  | { type: 'thought'; text: string }
  | { type: 'fact_recorded'; topic: string; value: string }
  | { type: 'decision_recorded'; decision: string; category?: string }
  | { type: 'memory_updated'; memory: unknown }
  | { type: 'operation'; op: ResumeOperation }
  | { type: 'awaiting_input'; question: string; category?: string; skillTag?: string }
  | { type: 'error'; message: string; code?: string }
  | {
      type: 'done';
      summary: string;
      operationsApplied: number;
      criticReport?: {
        score: number;
        findings: Array<{ severity: string; category: string; description: string }>;
      };
    };
