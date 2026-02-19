import React from 'react';
import { ResumeData, TemplateType } from '../types';
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import EliteTemplate from './templates/EliteTemplate';
import ApexTemplate from './templates/ApexTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import SmartTemplate from './templates/SmartTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import FreshGradFinanceTemplate from './templates/FreshGradFinanceTemplate';
import FreshGradCSTemplate from './templates/FreshGradCSTemplate';
import FreshGradArtsTemplate from './templates/FreshGradArtsTemplate';
import FreshGradEngTemplate from './templates/FreshGradEngTemplate';
import FreshGradMarketingTemplate from './templates/FreshGradMarketingTemplate';
import SageTemplate from './templates/SageTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  // Dynamic Font Application
  const containerStyle = {
    fontFamily: data.font || 'Inter, sans-serif',
    fontSize: `${data.fontSizes?.body || 10.5}pt`,
    lineHeight: data.lineHeight || 1.4,
  };

  const renderTemplate = () => {
    try {
      switch (template) {
        case 'vanguard': return <VanguardTemplate data={data} />;
        case 'elevate': return <ElevateResume data={data} />;
        case 'prime': return <PrimeProfile data={data} />;
        case 'impact': return <ImpactTemplate data={data} />;
        case 'free': return <FreeTemplate data={data} />;
        case 'simplepro': return <SimpleProTemplate data={data} />;
        case 'dev': return <DevTemplate data={data} />;
        case 'modern': return <ModernTemplate data={data} />;
        case 'executive': return <ExecutiveTemplate data={data} />;
        case 'classic': return <ClassicTemplate data={data} />;
        case 'elite': return <EliteTemplate data={data} />;
        case 'apex': return <ApexTemplate data={data} />;
        case 'wonsulting': return <WonsultingTemplate data={data} />;
        case 'styled': return <StyledTemplate data={data} />;
        case 'smart': return <SmartTemplate data={data} />;
        case 'elegant': return <ElegantTemplate data={data} />;
        case 'minimalist': return <MinimalistTemplate data={data} />;
        case 'professional': return <ProfessionalTemplate data={data} />;
        case 'twocolumn': return <TwoColumnTemplate data={data} />;
        case 'freshgrad1': return <FreshGradTemplate data={data} />;
        case 'freshgrad2': return <FreshGradFinanceTemplate data={data} />;
        case 'freshgrad3': return <FreshGradCSTemplate data={data} />;
        case 'freshgrad4': return <FreshGradArtsTemplate data={data} />;
        case 'freshgrad5': return <FreshGradEngTemplate data={data} />;
        case 'freshgrad6': return <FreshGradMarketingTemplate data={data} />;
        case 'sage': return <SageTemplate data={data} />;
        default: return <VanguardTemplate data={data} />;
      }
    } catch (e) {
      console.error("Template rendering error:", e);
      return <div className="text-red-500 p-4">Error loading template. Please refresh.</div>;
    }
  };

  return (
    <div className="w-full flex justify-center relative">
      {/* Single page container - let CSS handle page breaks */}
      <div
        className="resume-page w-[210mm] bg-white shadow-lg mx-auto relative print:shadow-none"
        style={{
          ...containerStyle,
          minHeight: '297mm',
          backgroundImage: 'linear-gradient(to bottom, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)',
          backgroundSize: '100% 297mm',
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}