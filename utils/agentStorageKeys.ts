// User-scoped LocalStorage Key Generators for Resume Agent
// Ensures complete account isolation with zero cross-tenant data leakage

export const getAgentDataKey = (userId?: string | null) =>
  `cv_agent_${userId || 'anon'}_resume_data`;

export const getAgentTitleKey = (userId?: string | null) =>
  `cv_agent_${userId || 'anon'}_resume_title`;

export const getAgentTemplateKey = (userId?: string | null) =>
  `cv_agent_${userId || 'anon'}_template`;

export const getAgentResumeIdKey = (userId?: string | null) =>
  `cv_agent_${userId || 'anon'}_resume_id`;

export const getAgentHistoryKey = (resumeId?: string | null, userId?: string | null) =>
  `cv_agent_${userId || 'anon'}_history_${resumeId || 'draft'}`;
