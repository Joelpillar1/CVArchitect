import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface PersonalInfoFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
    const handleChange = (field: keyof ResumeData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={data.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Job Title</label>
                        <input
                            type="text"
                            value={data.jobTitle}
                            onChange={(e) => handleChange('jobTitle', e.target.value)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="Software Engineer"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Mail size={12} /> Email
                        </label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Phone size={12} /> Phone
                        </label>
                        <input
                            type="tel"
                            value={data.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <MapPin size={12} /> Address
                        </label>
                        <input
                            type="text"
                            value={data.address || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange({ ...data, address: val, location: val });
                            }}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Linkedin size={12} /> LinkedIn
                        </label>
                        <input
                            type="text"
                            value={data.linkedin || ''}
                            onChange={(e) => handleChange('linkedin', e.target.value)}
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                            placeholder="linkedin.com/in/johndoe"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
