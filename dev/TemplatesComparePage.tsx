import React from 'react';
import { TEMPLATE_GALLERY_PREVIEW_DATA } from '../utils/sampleResumeData';
import VanguardTemplate from '../components/templates/VanguardTemplate';
import ElevateResume from '../components/templates/ElevateResume';
import PrimeProfile from '../components/templates/PrimeProfile';
import ImpactTemplate from '../components/templates/ImpactTemplate';
import FreeTemplate from '../components/templates/FreeTemplate';
import SimpleProTemplate from '../components/templates/SimpleProTemplate';
import DevTemplate from '../components/templates/DevTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ApexTemplate from '../components/templates/ApexTemplate';
import WonsultingTemplate from '../components/templates/WonsultingTemplate';
import StyledTemplate from '../components/templates/StyledTemplate';
import ElegantTemplate from '../components/templates/ElegantTemplate';
import MinimalistTemplate from '../components/templates/MinimalistTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import TimesTemplate from '../components/templates/TimesTemplate';
import TwoColumnTemplate from '../components/templates/TwoColumnTemplate';
import FreshGradTemplate from '../components/templates/FreshGradTemplate';
import FreshGrad8Template from '../components/templates/FreshGrad8Template';
import SageTemplate from '../components/templates/SageTemplate';
import ReziTemplate from '../components/templates/ReziTemplate';
import StudentTemplate from '../components/templates/StudentTemplate';

/**
 * DEV HARNESS — renders every unique template with the gallery sample resume so
 * bullet alignment + font-size consistency can be visually inspected side by side.
 * Remove before shipping.
 */
const TEMPLATES: { name: string; Component: React.ComponentType<{ data: any }> }[] = [
  { name: 'student', Component: StudentTemplate },
  { name: 'free', Component: FreeTemplate },
  { name: 'freshgrad1', Component: FreshGradTemplate },
  { name: 'freshgrad8', Component: FreshGrad8Template },
  { name: 'simplepro', Component: SimpleProTemplate },
  { name: 'vanguard', Component: VanguardTemplate },
  { name: 'elevate', Component: ElevateResume },
  { name: 'prime', Component: PrimeProfile },
  { name: 'impact', Component: ImpactTemplate },
  { name: 'dev', Component: DevTemplate },
  { name: 'apex', Component: ApexTemplate },
  { name: 'modern', Component: ModernTemplate },
  { name: 'classic', Component: ClassicTemplate },
  { name: 'wonsulting', Component: WonsultingTemplate },
  { name: 'styled', Component: StyledTemplate },
  { name: 'elegant', Component: ElegantTemplate },
  { name: 'minimalist', Component: MinimalistTemplate },
  { name: 'professional', Component: ProfessionalTemplate },
  { name: 'times', Component: TimesTemplate },
  { name: 'twocolumn', Component: TwoColumnTemplate },
  { name: 'sage', Component: SageTemplate },
  { name: 'rezi', Component: ReziTemplate },
  { name: 'executive', Component: ExecutiveTemplate },
];

export default function TemplatesComparePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-xl font-bold mb-1">Template Bullet Alignment Audit</h1>
      <p className="text-sm text-gray-600 mb-6">
        Each template renders the same sample resume. Check: skills bullets align with experience/achievements bullets,
        and all bullet text is the same size.
      </p>
      <div className="space-y-10">
        {TEMPLATES.map(({ name, Component }) => (
          <div key={name}>
            <h2 className="text-lg font-bold mb-2 text-gray-800 bg-white inline-block px-3 py-1 rounded border">
              {name}
            </h2>
            <div className="bg-white shadow-lg" data-template-name={name} style={{ width: '210mm' }}>
              <Component data={TEMPLATE_GALLERY_PREVIEW_DATA} />
            </div>
            {name === 'vanguard' && (
              <div className="bg-white shadow-lg mt-2" data-template-name="vanguard-7skills" style={{ width: '210mm' }}>
                <Component data={{ ...TEMPLATE_GALLERY_PREVIEW_DATA, skills: 'Illustrator, Branding Identity Design, Artificial Intelligence, Figma, Typography, Content Development, Marketing Campaign' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
