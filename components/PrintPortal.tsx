import React from 'react';
import { createPortal } from 'react-dom';
import { ResumeData, TemplateType } from '../types';
import VanguardTemplate from './templates/VanguardTemplate';
import ElevateResume from './templates/ElevateResume';
import PrimeProfile from './templates/PrimeProfile';
import ImpactTemplate from './templates/ImpactTemplate';
import FreeTemplate from './templates/FreeTemplate';
import SimpleProTemplate from './templates/SimpleProTemplate';
import DevTemplate from './templates/DevTemplate';
import ApexTemplate from './templates/ApexTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import WonsultingTemplate from './templates/WonsultingTemplate';
import StyledTemplate from './templates/StyledTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import TimesTemplate from './templates/TimesTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import SageTemplate from './templates/SageTemplate';
import ReziTemplate from './templates/ReziTemplate';
import FreshGradTemplate from './templates/FreshGradTemplate';
import FreshGrad8Template from './templates/FreshGrad8Template';
import StudentTemplate from './templates/StudentTemplate';

interface PrintPortalProps {
  data: ResumeData;
  template: TemplateType;
  isPrintingCoverLetter?: boolean;
  coverLetterContent?: string;
}

export function renderResumeTemplate(template: TemplateType, data: ResumeData) {
  switch (template) {
    case 'vanguard': return <VanguardTemplate data={data} />;
    case 'elevate': return <ElevateResume data={data} />;
    case 'prime': return <PrimeProfile data={data} />;
    case 'impact': return <ImpactTemplate data={data} />;
    case 'free': return <FreeTemplate data={data} />;
    case 'simplepro': return <SimpleProTemplate data={data} />;
    case 'dev': return <DevTemplate data={data} />;
    case 'elite':
    case 'apex': return <ApexTemplate data={data} />;
    case 'modern': return <ModernTemplate data={data} />;
    case 'executive': return <ExecutiveTemplate data={data} />;
    case 'classic': return <ClassicTemplate data={data} />;
    case 'minimalist': return <MinimalistTemplate data={data} />;
    case 'wonsulting': return <WonsultingTemplate data={data} />;
    case 'styled': return <StyledTemplate data={data} />;
    case 'smart':
    case 'elegant': return <ElegantTemplate data={data} />;
    case 'professional': return <ProfessionalTemplate data={data} />;
    case 'times': return <TimesTemplate data={data} />;
    case 'twocolumn': return <TwoColumnTemplate data={data} />;
    case 'sage': return <SageTemplate data={data} />;
    case 'rezi': return <ReziTemplate data={data} />;
    case 'freshgrad1':
    case 'freshgrad2':
    case 'freshgrad4':
    case 'freshgrad5':
    case 'freshgrad6':
      return <FreshGradTemplate data={data} />;
    case 'freshgrad3':
    case 'freshgrad7':
    case 'freshgrad8':
      return <FreshGrad8Template data={data} />;
    case 'student': return <StudentTemplate data={data} />;
    default: return <VanguardTemplate data={data} />;
  }
}

export default function PrintPortal({
  data,
  template,
  isPrintingCoverLetter,
  coverLetterContent,
}: PrintPortalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="print-root hidden print:block absolute top-0 left-0 w-full h-auto bg-white z-[9999] print:w-full print:max-w-[210mm]">
      <table className="w-full">
        <thead>
          <tr>
            <td>
              {/* Top Margin Spacer (repeats on every printed page) */}
              <div style={{ height: '10mm' }}></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div
                className="print-resume"
                data-bullet-style={data.bulletStyle || 'disc'}
                style={{
                  fontFamily: data.font || 'Inter, sans-serif',
                  fontSize: `${data.fontSizes?.body || 9.5}pt`,
                  lineHeight: data.lineHeight || 1.7,
                  '--resume-bullet-indent': `${data.bulletIndent ?? 0}px`,
                } as React.CSSProperties}
              >
                {isPrintingCoverLetter ? (
                  <div className="p-8 max-w-[210mm] mx-auto bg-white text-black font-sans leading-relaxed whitespace-pre-wrap">
                    {coverLetterContent}
                  </div>
                ) : (
                  renderResumeTemplate(template, data)
                )}
              </div>

            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              {/* Bottom Margin Spacer (repeats on every printed page) */}
              <div style={{ height: '10mm' }}></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>,
    document.body
  );
}
