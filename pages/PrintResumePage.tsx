/**
 * PrintResumePage — a clean, standalone page used exclusively by Puppeteer
 * for PDF generation. It reads resume data + template from sessionStorage
 * (set by pdfExport.ts before calling the API), renders the selected
 * template, and sets window.__PRINT_READY__ = true once fully painted so
 * Puppeteer knows when to fire page.pdf().
 *
 * Route: /print-resume  (public, no auth required)
 */
import React, { useEffect, useState } from 'react';
import { ResumeData, TemplateType } from '../types';
import VanguardTemplate from '../components/templates/VanguardTemplate';
import ElevateResume from '../components/templates/ElevateResume';
import PrimeProfile from '../components/templates/PrimeProfile';
import ImpactTemplate from '../components/templates/ImpactTemplate';
import FreeTemplate from '../components/templates/FreeTemplate';
import SimpleProTemplate from '../components/templates/SimpleProTemplate';
import DevTemplate from '../components/templates/DevTemplate';
import ApexTemplate from '../components/templates/ApexTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import WonsultingTemplate from '../components/templates/WonsultingTemplate';
import StyledTemplate from '../components/templates/StyledTemplate';
import ElegantTemplate from '../components/templates/ElegantTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import TimesTemplate from '../components/templates/TimesTemplate';
import TwoColumnTemplate from '../components/templates/TwoColumnTemplate';
import SageTemplate from '../components/templates/SageTemplate';
import ReziTemplate from '../components/templates/ReziTemplate';
import FreshGradTemplate from '../components/templates/FreshGradTemplate';
import FreshGrad8Template from '../components/templates/FreshGrad8Template';
import StudentTemplate from '../components/templates/StudentTemplate';

declare global {
  interface Window {
    __PRINT_READY__: boolean;
  }
}

function TemplateRenderer({ data, template }: { data: ResumeData; template: TemplateType }) {
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

export default function PrintResumePage() {
  const [state, setState] = useState<{
    data: ResumeData | null;
    template: TemplateType;
    error: string | null;
  }>({ data: null, template: 'vanguard', error: null });

  useEffect(() => {
    // Apply clean-print body class so global CSS hides all app chrome
    document.body.classList.add('print-resume-mode');
    return () => document.body.classList.remove('print-resume-mode');
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('__pdf_export_data__');
      if (!raw) {
        setState(s => ({ ...s, error: 'No resume data found in sessionStorage.' }));
        return;
      }
      const parsed = JSON.parse(raw) as { data: ResumeData; template: TemplateType };
      setState({ data: parsed.data, template: parsed.template || 'vanguard', error: null });
    } catch (e) {
      setState(s => ({ ...s, error: 'Failed to parse resume data.' }));
    }
  }, []);

  // Signal Puppeteer once the template has fully rendered (after 2 animation frames)
  useEffect(() => {
    if (!state.data) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Extra 500ms for any font loading / layout
        setTimeout(() => {
          window.__PRINT_READY__ = true;
        }, 600);
      });
    });
  }, [state.data]);

  if (state.error) {
    return (
      <div style={{ padding: '2rem', color: 'red', fontFamily: 'sans-serif' }}>
        <strong>Print Error:</strong> {state.error}
      </div>
    );
  }

  if (!state.data) {
    return (
      <div style={{ padding: '2rem', color: '#666', fontFamily: 'sans-serif' }}>
        Loading resume...
      </div>
    );
  }

  return (
    <div
      id="print-resume-root"
      style={{
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
      }}
    >
      <TemplateRenderer data={state.data} template={state.template} />
    </div>
  );
}
