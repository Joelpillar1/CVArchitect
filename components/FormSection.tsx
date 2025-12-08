import React from 'react';
import { ResumeData, TemplateType } from '../types';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import AchievementsForm from './AchievementsForm';
import DesignCustomization from './DesignCustomization';
import JobMatchForm from './JobMatchForm';
import { EditorTab } from './Editor';

interface FormSectionProps {
  activeTab: EditorTab;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  currentTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  onSaveAsTemplate: () => void;
}

export default function FormSection({ 
  activeTab, 
  data, 
  onChange, 
  currentTemplate, 
  onTemplateChange,
  onSaveAsTemplate 
}: FormSectionProps) {
  switch (activeTab) {
    case 'personal':
      return <PersonalInfoForm data={data} onChange={onChange} />;
    case 'experience':
      return <ExperienceForm data={data} onChange={onChange} />;
    case 'education':
      return <EducationForm data={data} onChange={onChange} />;
    case 'achievements':
      return <AchievementsForm data={data} onChange={onChange} />;
    case 'job-match':
      return <JobMatchForm data={data} onChange={onChange} />;
    case 'design':
      return (
        <DesignCustomization 
          data={data} 
          onChange={onChange}
          currentTemplate={currentTemplate}
          onTemplateChange={onTemplateChange}
          onSaveAsTemplate={onSaveAsTemplate}
        />
      );
    default:
      return <PersonalInfoForm data={data} onChange={onChange} />;
  }
}
