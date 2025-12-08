import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, Tag, Trash2, Save, X, GitBranch, Eye } from 'lucide-react';
import { versionService, ResumeVersion } from '../services/versionService';
import { ResumeData } from '../types';

interface VersionHistoryProps {
    resumeId: string;
    currentVersion: number;
    onRestore: (versionId: string) => void;
    onClose: () => void;
}

export default function VersionHistory({ resumeId, currentVersion, onRestore, onClose }: VersionHistoryProps) {
    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [namingVersionId, setNamingVersionId] = useState<string | null>(null);
    const [versionName, setVersionName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadVersions();
    }, [resumeId]);

    const loadVersions = async () => {
        try {
            setLoading(true);
            const data = await versionService.getVersions(resumeId);
            setVersions(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load versions');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (versionId: string) => {
        if (!confirm('Are you sure you want to restore this version? This will create a new version with this content.')) {
            return;
        }

        try {
            await versionService.restoreVersion(resumeId, versionId);
            onRestore(versionId);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to restore version');
        }
    };

    const handleNameVersion = async (versionId: string) => {
        if (!versionName.trim()) return;

        try {
            await versionService.nameVersion(versionId, versionName);
            setNamingVersionId(null);
            setVersionName('');
            loadVersions();
        } catch (err: any) {
            setError(err.message || 'Failed to name version');
        }
    };

    const handleDeleteVersion = async (versionId: string) => {
        if (!confirm('Are you sure you want to delete this version? This cannot be undone.')) {
            return;
        }

        try {
            await versionService.deleteVersion(versionId);
            loadVersions();
        } catch (err: any) {
            setError(err.message || 'Failed to delete version');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                                <GitBranch className="text-brand-green" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-dark">Version History</h2>
                                <p className="text-sm text-gray-500">Current version: v{currentVersion}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Versions List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500">No version history yet</p>
                            <p className="text-sm text-gray-400 mt-1">Versions are created automatically when you save changes</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version, index) => (
                                <div
                                    key={version.id}
                                    className="border border-gray-200 rounded-xl p-4 hover:border-brand-green transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                                                    v{version.version_number}
                                                </span>
                                                {version.version_name && (
                                                    <span className="px-2 py-0.5 bg-brand-green/10 text-brand-dark text-xs font-semibold rounded flex items-center gap-1">
                                                        <Tag size={12} />
                                                        {version.version_name}
                                                    </span>
                                                )}
                                                {index === 0 && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>

                                            <p className="font-medium text-brand-dark mb-1">{version.title}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock size={14} />
                                                {formatDate(version.created_at)}
                                            </p>

                                            {/* Name Version Input */}
                                            {namingVersionId === version.id && (
                                                <div className="mt-3 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={versionName}
                                                        onChange={(e) => setVersionName(e.target.value)}
                                                        placeholder="Version name (e.g., Final Draft)"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-green"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleNameVersion(version.id)}
                                                        className="px-3 py-2 bg-brand-green text-brand-dark rounded-lg text-sm font-semibold hover:opacity-90"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setNamingVersionId(null);
                                                            setVersionName('');
                                                        }}
                                                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setNamingVersionId(version.id);
                                                    setVersionName(version.version_name || '');
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                title="Name this version"
                                            >
                                                <Tag size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRestore(version.id)}
                                                className="p-2 hover:bg-brand-green/10 rounded-lg transition-colors text-brand-green"
                                                title="Restore this version"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVersion(version.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title="Delete this version"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <p>
                            <strong>{versions.length}</strong> version{versions.length !== 1 ? 's' : ''} saved
                        </p>
                        <p className="text-xs">
                            Versions are created automatically when you save changes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
