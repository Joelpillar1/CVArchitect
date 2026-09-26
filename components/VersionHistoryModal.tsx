import React, { useState, useEffect, useCallback } from 'react';
import { X, History, Clock, RotateCcw, Trash2, Plus, Sparkles, Check, AlertCircle, Bookmark } from 'lucide-react';
import { ResumeData } from '../types';
import { versionService, ResumeVersion } from '../services/versionService';
import { useToast } from '../contexts/ToastContext';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeId: string | null;
    currentData: ResumeData;
    onRestoreVersion: (restoredData: ResumeData) => void;
}

export default function VersionHistoryModal({
    isOpen,
    onClose,
    resumeId,
    currentData,
    onRestoreVersion,
}: VersionHistoryModalProps) {
    const { showToast } = useToast();
    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snapshotName, setSnapshotName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    const effectiveId = resumeId || (currentData as any)?.id || 'current_draft';

    const loadVersions = useCallback(async () => {
        setIsLoading(true);
        try {
            const list = await versionService.getVersions(effectiveId);
            setVersions(list);
        } catch (err) {
            console.error('Failed to load version history:', err);
        } finally {
            setIsLoading(false);
        }
    }, [effectiveId]);

    useEffect(() => {
        if (isOpen) {
            loadVersions();
        }
    }, [isOpen, loadVersions]);

    if (!isOpen) return null;

    const handleCreateSnapshot = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const name = snapshotName.trim() || `Manual Snapshot (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
        setIsCreating(true);
        try {
            await versionService.createVersion(effectiveId, currentData, name, 'User created checkpoint');
            setSnapshotName('');
            showToast(`Snapshot "${name}" saved!`, 'success');
            await loadVersions();
        } catch (err) {
            console.error('Failed to create version snapshot:', err);
            showToast('Failed to save snapshot. Please try again.', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleRestore = async (version: ResumeVersion) => {
        const confirmRestore = window.confirm(
            `Restore "${version.version_name || `Version ${version.version_number}`}"? Any unsaved edits since this version will be replaced.`
        );
        if (!confirmRestore) return;

        setRestoringId(version.id);
        try {
            onRestoreVersion(version.content);
            showToast(`Restored to "${version.version_name || `Version ${version.version_number}`}"!`, 'success');
            onClose();
        } catch (err) {
            console.error('Failed to restore version:', err);
            showToast('Failed to restore version.', 'error');
        } finally {
            setRestoringId(null);
        }
    };

    const handleDelete = async (versionId: string, versionName: string) => {
        const confirmDelete = window.confirm(`Delete snapshot "${versionName}"?`);
        if (!confirmDelete) return;

        try {
            await versionService.deleteVersion(effectiveId, versionId);
            showToast('Snapshot deleted.', 'success');
            setVersions(prev => prev.filter(v => v.id !== versionId));
        } catch (err) {
            console.error('Failed to delete version:', err);
            showToast('Failed to delete version.', 'error');
        }
    };

    const formatTimestamp = (iso: string) => {
        try {
            const date = new Date(iso);
            return {
                relative: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            };
        } catch {
            return { relative: 'Recently', time: '' };
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] shadow-2xl border border-neutral-200 flex flex-col overflow-hidden text-neutral-800">
                {/* Header */}
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-dark flex items-center justify-center">
                            <History className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm text-brand-dark">Resume Version History</h3>
                            <p className="text-xs text-neutral-500">View, save named milestones, or restore previous versions</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Create Snapshot Bar */}
                <div className="p-4 border-b border-neutral-100 bg-white shrink-0">
                    <form onSubmit={handleCreateSnapshot} className="flex gap-2">
                        <input
                            type="text"
                            value={snapshotName}
                            onChange={(e) => setSnapshotName(e.target.value)}
                            placeholder="Name this version (e.g., Before Stripe Tailoring)..."
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-brand-green bg-neutral-50/50"
                        />
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-3.5 py-2 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isCreating ? 'Saving...' : 'Save Milestone'}</span>
                        </button>
                    </form>
                </div>

                {/* Versions List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar min-h-[220px]">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-neutral-400">
                            <Clock className="w-6 h-6 animate-spin text-brand-green" />
                            <span className="text-xs font-medium">Loading version history...</span>
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 text-neutral-400">
                            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                                <Bookmark className="w-5 h-5" />
                            </div>
                            <h4 className="text-xs font-bold text-neutral-700">No version snapshots yet</h4>
                            <p className="text-[11px] text-neutral-500 max-w-xs">
                                Click "Save Milestone" above or run AI tailoring to automatically record restore points.
                            </p>
                        </div>
                    ) : (
                        versions.map((ver, idx) => {
                            const { relative, time } = formatTimestamp(ver.created_at);
                            const isLatest = idx === 0;

                            return (
                                <div
                                    key={ver.id}
                                    className="p-3.5 rounded-xl border border-neutral-200/80 hover:border-brand-green/50 bg-white transition-all space-y-2 group shadow-2xs"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-neutral-900">
                                                    {ver.version_name || `Version ${ver.version_number}`}
                                                </span>
                                                {isLatest && (
                                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                                        Latest Snapshot
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{relative} at {time}</span>
                                                {ver.change_summary && (
                                                    <span>• {ver.change_summary}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => handleRestore(ver)}
                                                disabled={restoringId === ver.id}
                                                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-brand-dark hover:text-white text-neutral-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                                title="Restore this version"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                <span>Restore</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(ver.id, ver.version_name || `Version ${ver.version_number}`)}
                                                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                title="Delete snapshot"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer info */}
                <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
                    <span>{versions.length} saved snapshot{versions.length === 1 ? '' : 's'}</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200/50 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
