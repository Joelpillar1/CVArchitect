import React from 'react';
import { ResumeData } from '../../types';
import { GeneratedCoverLetter } from '../utils/aiEnhancer';
import { CoverLetterTemplateType, SAMPLE_COVER_LETTER_DATA, SAMPLE_COVER_LETTER_RESUME } from '../../utils/coverLetterConfig';
import ModernCoverLetter from './ModernCoverLetter';
import BoldCoverLetter from './BoldCoverLetter';
import StructuredCoverLetter from './StructuredCoverLetter';

interface CoverLetterPreviewProps {
    template: CoverLetterTemplateType;
    data?: ResumeData;
    content?: GeneratedCoverLetter | string;
    companyName?: string;
    jobTitle?: string;
    className?: string;
}

export default function CoverLetterPreview({
    template,
    data = SAMPLE_COVER_LETTER_RESUME,
    content = SAMPLE_COVER_LETTER_DATA,
    companyName = 'Acme Corp',
    jobTitle = 'Senior Product Manager',
    className = ''
}: CoverLetterPreviewProps) {
    // Normalize content object
    const normalizedContent: GeneratedCoverLetter = React.useMemo(() => {
        if (typeof content === 'string') {
            return {
                plainText: content,
                structured: {
                    opening: content.split('\n\n')[0] || '',
                    skills: [],
                    closing: content.split('\n\n').slice(-1)[0] || ''
                }
            };
        }
        return content || SAMPLE_COVER_LETTER_DATA;
    }, [content]);

    const activeResumeData = data || SAMPLE_COVER_LETTER_RESUME;

    return (
        <div 
            className={`w-[210mm] min-h-[297mm] bg-white text-gray-900 pointer-events-none select-none box-border shadow-xs ${className}`}
            style={{ width: '210mm', minHeight: '297mm' }}
        >
            {template === 'structured' ? (
                <StructuredCoverLetter
                    data={activeResumeData}
                    content={normalizedContent}
                    companyName={companyName}
                    jobTitle={jobTitle}
                />
            ) : template === 'bold' ? (
                <BoldCoverLetter
                    data={activeResumeData}
                    content={normalizedContent.plainText}
                    companyName={companyName}
                    jobTitle={jobTitle}
                />
            ) : (
                <ModernCoverLetter
                    data={activeResumeData}
                    content={normalizedContent.plainText}
                    companyName={companyName}
                    jobTitle={jobTitle}
                />
            )}
        </div>
    );
}
