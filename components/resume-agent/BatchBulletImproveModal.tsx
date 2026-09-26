'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Check,
  RotateCw,
  Loader2,
  Briefcase,
  Award,
  Wrench,
  CheckSquare,
  Square,
  TrendingUp,
  Target,
  Scissors,
  Wand2,
} from 'lucide-react';
import { ResumeData } from '../../types';
import { JobDescriptionData } from '../../types/resumeAgent';
import {
  parseDescriptionBullets,
  parseAchievementBullets,
} from '../../utils/templateUtils';
import {
  batchImproveBullets,
  batchImproveSkills,
  BatchImproveBulletInput,
  BatchImproveBulletResult,
} from '../../services/resumeAgentService';

export interface BatchBulletImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onChangeData: (newData: ResumeData) => void;
  jobData?: JobDescriptionData | null;
  initialTargetKey?: string; // e.g. "exp_0" or "keyAchievements" or "skills"
}

interface TargetGroup {
  key: string;
  type: 'experience' | 'leadership' | 'keyAchievements' | 'skills' | 'projects';
  itemId?: string;
  itemIndex?: number;
  label: string;
  subtitle: string;
  bullets: Array<{ id: string; text: string; index: number }>;
}

export default function BatchBulletImproveModal({
  isOpen,
  onClose,
  data,
  onChangeData,
  jobData,
  initialTargetKey,
}: BatchBulletImproveModalProps) {
  // 1. Build all candidate target groups from data
  const targetGroups = useMemo<TargetGroup[]>(() => {
    const groups: TargetGroup[] = [];

    // Experience items
    (data.experience || []).forEach((exp, idx) => {
      const bullets = parseDescriptionBullets(exp.description).map((b, bIdx) => ({
        id: `exp_${exp.id || idx}_b_${bIdx}`,
        text: b,
        index: bIdx,
      }));
      if (bullets.length > 0) {
        groups.push({
          key: `exp_${exp.id || idx}`,
          type: 'experience',
          itemId: exp.id,
          itemIndex: idx,
          label: exp.company || `Company #${idx + 1}`,
          subtitle: exp.role || 'Experience Role',
          bullets,
        });
      }
    });

    // Key Achievements
    const achBullets = parseAchievementBullets(data.keyAchievements || []).map((b, bIdx) => ({
      id: `ach_b_${bIdx}`,
      text: b,
      index: bIdx,
    }));
    if (achBullets.length > 0) {
      groups.push({
        key: 'keyAchievements',
        type: 'keyAchievements',
        label: 'Key Achievements',
        subtitle: `${achBullets.length} highlights`,
        bullets: achBullets,
      });
    }

    // Leadership
    (data.leadership || []).forEach((lead, idx) => {
      const bullets = parseDescriptionBullets(lead.description).map((b, bIdx) => ({
        id: `lead_${lead.id || idx}_b_${bIdx}`,
        text: b,
        index: bIdx,
      }));
      if (bullets.length > 0) {
        groups.push({
          key: `lead_${lead.id || idx}`,
          type: 'leadership',
          itemId: lead.id,
          itemIndex: idx,
          label: lead.company || (lead as any).organization || `Leadership #${idx + 1}`,
          subtitle: lead.role || 'Leadership Role',
          bullets,
        });
      }
    });

    // Projects
    (data.projects || []).forEach((proj, idx) => {
      const bullets = parseDescriptionBullets(proj.description).map((b, bIdx) => ({
        id: `proj_${proj.id || idx}_b_${bIdx}`,
        text: b,
        index: bIdx,
      }));
      if (bullets.length > 0) {
        groups.push({
          key: `proj_${proj.id || idx}`,
          type: 'projects',
          itemId: proj.id,
          itemIndex: idx,
          label: proj.name || `Project #${idx + 1}`,
          subtitle: proj.technologies || 'Project Description',
          bullets,
        });
      }
    });

    // Skills
    if (data.skills && (typeof data.skills === 'string' ? data.skills.trim() : (data.skills as string[]).length > 0)) {
      const raw = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills;
      groups.push({
        key: 'skills',
        type: 'skills',
        label: 'Skills Section',
        subtitle: 'Core competencies & technical stack',
        bullets: [{ id: 'skills_all', text: raw, index: 0 }],
      });
    }

    return groups;
  }, [data]);

  // Selected target group key
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>('');

  // When opening modal or targetGroups changes, pick initial target
  useEffect(() => {
    if (!isOpen) return;
    if (initialTargetKey && targetGroups.some((g) => g.key === initialTargetKey)) {
      setSelectedGroupKey(initialTargetKey);
    } else if (targetGroups.length > 0 && !targetGroups.some((g) => g.key === selectedGroupKey)) {
      setSelectedGroupKey(targetGroups[0].key);
    }
  }, [isOpen, initialTargetKey, targetGroups]);

  const activeGroup = useMemo(
    () => targetGroups.find((g) => g.key === selectedGroupKey) || targetGroups[0] || null,
    [targetGroups, selectedGroupKey]
  );

  // Selected bullet IDs for the active group
  const [selectedBulletIds, setSelectedBulletIds] = useState<Set<string>>(new Set());

  // Reset selected bullet IDs when group changes
  useEffect(() => {
    if (activeGroup) {
      setSelectedBulletIds(new Set(activeGroup.bullets.map((b) => b.id)));
      setResults(null);
      setError(null);
    }
  }, [activeGroup?.key]);

  // Action settings
  const [actionType, setActionType] = useState<'improve' | 'expand' | 'tailor' | 'concise' | 'custom'>('improve');
  const [customInstruction, setCustomInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchImproveBulletResult[] | null>(null);
  const [acceptedResultIds, setAcceptedResultIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleBullet = (id: string) => {
    setSelectedBulletIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (activeGroup) {
      setSelectedBulletIds(new Set(activeGroup.bullets.map((b) => b.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedBulletIds(new Set());
  };

  const handleRunBatchImprovement = async () => {
    if (!activeGroup) return;

    if (activeGroup.type === 'skills') {
      setIsProcessing(true);
      setError(null);
      try {
        const rawSkills = activeGroup.bullets[0]?.text || '';
        const improvedSkills = await batchImproveSkills(rawSkills, {
          actionType: actionType as any,
          customInstruction: customInstruction.trim() || undefined,
          jobData,
          resumeData: data,
        });

        const res: BatchImproveBulletResult[] = [
          {
            id: 'skills_all',
            originalText: rawSkills,
            improvedText: improvedSkills,
            startingVerb: 'Skills',
          },
        ];
        setResults(res);
        setAcceptedResultIds(new Set(['skills_all']));
      } catch (err: any) {
        setError('Failed to optimize skills: ' + (err.message || 'Unknown error'));
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    const bulletsToImprove: BatchImproveBulletInput[] = activeGroup.bullets
      .filter((b) => selectedBulletIds.has(b.id))
      .map((b) => ({
        id: b.id,
        originalText: b.text,
        index: b.index,
      }));

    if (bulletsToImprove.length === 0) {
      setError('Please select at least one bullet to improve.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const output = await batchImproveBullets(bulletsToImprove, {
        scopeType: activeGroup.type,
        targetTitle: `${activeGroup.label} — ${activeGroup.subtitle}`,
        actionType,
        customInstruction: customInstruction.trim() || undefined,
        jobData,
        resumeData: data,
      });

      setResults(output);
      // Default to selecting all improved results for applying
      setAcceptedResultIds(new Set(output.map((r) => r.id)));
    } catch (err: any) {
      setError('Failed to improve bullets: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAcceptedResult = (id: string) => {
    setAcceptedResultIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApplyChanges = () => {
    if (!activeGroup || !results) return;

    const updatedData = { ...data };

    if (activeGroup.type === 'skills') {
      const skillResult = results.find((r) => r.id === 'skills_all');
      if (skillResult && acceptedResultIds.has('skills_all')) {
        updatedData.skills = skillResult.improvedText;
      }
    } else if (activeGroup.type === 'experience' && typeof activeGroup.itemIndex === 'number') {
      const expIdx = activeGroup.itemIndex;
      const targetExp = updatedData.experience[expIdx];
      if (targetExp) {
        const currentBullets = parseDescriptionBullets(targetExp.description);
        results.forEach((res) => {
          if (!acceptedResultIds.has(res.id)) return;
          const matchBullet = activeGroup.bullets.find((b) => b.id === res.id);
          if (matchBullet && typeof matchBullet.index === 'number' && currentBullets[matchBullet.index] !== undefined) {
            currentBullets[matchBullet.index] = res.improvedText;
          }
        });
        const nextExp = [...updatedData.experience];
        nextExp[expIdx] = { ...targetExp, description: currentBullets };
        updatedData.experience = nextExp;
      }
    } else if (activeGroup.type === 'keyAchievements') {
      const currentAchievements = parseAchievementBullets(updatedData.keyAchievements || []);
      results.forEach((res) => {
        if (!acceptedResultIds.has(res.id)) return;
        const matchBullet = activeGroup.bullets.find((b) => b.id === res.id);
        if (matchBullet && typeof matchBullet.index === 'number' && currentAchievements[matchBullet.index] !== undefined) {
          currentAchievements[matchBullet.index] = res.improvedText;
        }
      });
      updatedData.keyAchievements = currentAchievements;
    } else if (activeGroup.type === 'leadership' && typeof activeGroup.itemIndex === 'number') {
      const leadIdx = activeGroup.itemIndex;
      const targetLead = (updatedData.leadership || [])[leadIdx];
      if (targetLead) {
        const currentBullets = parseDescriptionBullets(targetLead.description);
        results.forEach((res) => {
          if (!acceptedResultIds.has(res.id)) return;
          const matchBullet = activeGroup.bullets.find((b) => b.id === res.id);
          if (matchBullet && typeof matchBullet.index === 'number' && currentBullets[matchBullet.index] !== undefined) {
            currentBullets[matchBullet.index] = res.improvedText;
          }
        });
        const nextLead = [...(updatedData.leadership || [])];
        nextLead[leadIdx] = { ...targetLead, description: currentBullets };
        updatedData.leadership = nextLead;
      }
    } else if (activeGroup.type === 'projects' && typeof activeGroup.itemIndex === 'number') {
      const projIdx = activeGroup.itemIndex;
      const targetProj = (updatedData.projects || [])[projIdx];
      if (targetProj) {
        const currentBullets = parseDescriptionBullets(targetProj.description);
        results.forEach((res) => {
          if (!acceptedResultIds.has(res.id)) return;
          const matchBullet = activeGroup.bullets.find((b) => b.id === res.id);
          if (matchBullet && typeof matchBullet.index === 'number' && currentBullets[matchBullet.index] !== undefined) {
            currentBullets[matchBullet.index] = res.improvedText;
          }
        });
        const nextProj = [...(updatedData.projects || [])];
        nextProj[projIdx] = { ...targetProj, description: currentBullets };
        updatedData.projects = nextProj;
      }
    }

    onChangeData(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200/80 flex flex-col max-h-[90vh] overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Batch Improve Bullets & Sections
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AI Power
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Select a company or section to elevate, expand, or tailor all its bullets at once.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Group Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              1. Choose Target Company or Section
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {targetGroups.map((g) => {
                const isSelected = g.key === selectedGroupKey;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => {
                      setSelectedGroupKey(g.key);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                        {g.type === 'experience' && <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {g.type === 'keyAchievements' && <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                        {g.type === 'skills' && <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        <span className="truncate">{g.label}</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                        {g.bullets.length} {g.type === 'skills' ? 'skills' : 'bullets'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{g.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Strategy Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              2. Select Improvement Action
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActionType('improve')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'improve'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Improve & Impact</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Strong action verbs & XYZ impact formula</p>
              </button>

              <button
                type="button"
                onClick={() => setActionType('expand')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'expand'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>Expand & Elaborate</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Add technical depth, scope & metrics</p>
              </button>

              <button
                type="button"
                onClick={() => setActionType('tailor')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'tailor'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tailor to JD</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Align keywords to target position</p>
              </button>

              <button
                type="button"
                onClick={() => setActionType('concise')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  actionType === 'concise'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <Scissors className="w-3.5 h-3.5 text-purple-600" />
                  <span>Make Concise</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Tighten prose & trim corporate fluff</p>
              </button>
            </div>

            {/* Custom Instruction Box */}
            <div className="mt-2.5">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Optional custom instruction (e.g. 'Highlight React & latency reduction' or 'Focus on team leadership')"
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Bullets Selection List (Before Generation) */}
          {!results && activeGroup && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Select Bullets to Improve ({selectedBulletIds.size} of {activeGroup.bullets.length} selected)
                </label>
                {activeGroup.type !== 'skills' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeGroup.bullets.map((b) => {
                  const isChecked = selectedBulletIds.has(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleToggleBullet(b.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/20 text-slate-800'
                          : 'border-slate-200 bg-slate-50/40 text-slate-400'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0 text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <p className="text-xs leading-relaxed font-medium">{b.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Comparison View (After Generation) */}
          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    ✨ Proposed Improvements ({results.length})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {acceptedResultIds.size} ready to apply
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResults(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Change Settings</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {results.map((res, i) => {
                  const isAccepted = acceptedResultIds.has(res.id);
                  return (
                    <div
                      key={res.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isAccepted
                          ? 'border-emerald-400 bg-emerald-50/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-500">
                          Bullet {i + 1} {res.startingVerb ? `• Starts with "${res.startingVerb}"` : ''}
                        </span>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAccepted}
                            onChange={() => handleToggleAcceptedResult(res.id)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{isAccepted ? 'Accept Improvement' : 'Keep Original'}</span>
                        </label>
                      </div>

                      {/* Side by side / Stacked comparison */}
                      <div className="space-y-2 text-xs">
                        <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/70 text-slate-500 line-through">
                          {res.originalText}
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-emerald-300 text-slate-900 font-semibold leading-relaxed shadow-2xs">
                          {res.improvedText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {!results ? (
            <button
              type="button"
              onClick={handleRunBatchImprovement}
              disabled={isProcessing || selectedBulletIds.size === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Improving {selectedBulletIds.size} Bullets...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Improve Selected Bullets</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunBatchImprovement}
                disabled={isProcessing}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
              <button
                type="button"
                onClick={handleApplyChanges}
                disabled={acceptedResultIds.size === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply {acceptedResultIds.size} Improvements</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
