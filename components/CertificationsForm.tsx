import React from 'react';
import { ResumeData, Certification } from '../types';
import { Award, Plus, Trash2, Calendar, Link, ChevronUp, ChevronDown } from 'lucide-react';

interface CertificationsFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function CertificationsForm({ data, onChange }: CertificationsFormProps) {
    const moveCertification = (index: number, direction: 'up' | 'down') => {
        const newCerts = [...(data.certifications || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newCerts.length) return;

        [newCerts[index], newCerts[targetIndex]] = [newCerts[targetIndex], newCerts[index]];
        onChange({ ...data, certifications: newCerts });
    };

    const handleAddCert = () => {
        const newCert: Certification = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            date: '',
            link: ''
        };
        onChange({ ...data, certifications: [newCert, ...(data.certifications || [])] });
    };

    const handleRemoveCert = (id: string) => {
        onChange({ ...data, certifications: (data.certifications || []).filter(c => c.id !== id) });
    };

    const handleCertChange = (id: string, field: keyof Certification, value: string) => {
        onChange({
            ...data,
            certifications: (data.certifications || []).map(c =>
                c.id === id ? { ...c, [field]: value } : c
            )
        });
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="space-y-4">
                {(data.certifications || []).map((cert, index) => (
                    <div key={cert.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium text-gray-400">Certification {index + 1}</div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => moveCertification(index, 'up')}
                                    disabled={index === 0}
                                    className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move up"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    onClick={() => moveCertification(index, 'down')}
                                    disabled={index === (data.certifications || []).length - 1}
                                    className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move down"
                                >
                                    <ChevronDown size={16} />
                                </button>
                                <button
                                    onClick={() => handleRemoveCert(cert.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                                    title="Remove certification"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Certification Name</label>
                                <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) => handleCertChange(cert.id, 'name', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    placeholder="AWS Certified Solutions Architect"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Issuing Organization</label>
                                <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(e) => handleCertChange(cert.id, 'issuer', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    placeholder="Amazon Web Services"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </label>
                                <input
                                    type="text"
                                    value={cert.date}
                                    onChange={(e) => handleCertChange(cert.id, 'date', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    placeholder="2023"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <Link size={12} /> Credential URL
                                </label>
                                <input
                                    type="text"
                                    value={cert.link || ''}
                                    onChange={(e) => handleCertChange(cert.id, 'link', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddCert}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-lg transition-all"
                >
                    <Plus size={16} /> Add Certification
                </button>
            </div>
        </div>
    );
}
