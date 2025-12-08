import React from 'react';
import { ResumeData } from '../types';

interface ReferencesFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function ReferencesForm({ data, onChange }: ReferencesFormProps) {
    const handleChange = (value: string) => {
        onChange({ ...data, referee: value });
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Reference Details</label>
                <textarea
                    value={data.referee || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    rows={5}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Available upon request"
                />
                <p className="text-[10px] text-gray-500">
                    Add references or state "Available upon request".
                </p>
            </div>
        </div>
    );
}
