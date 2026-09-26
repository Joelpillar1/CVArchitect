import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  Check,
  Sparkles,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Languages,
  Users,
  Code,
  Shield,
  Heart,
  FolderGit2,
  Terminal,
  Layers,
  FilePlus2,
} from 'lucide-react';
import { ResumeData } from '../../types';
import { ResumeSectionType } from '../../types/resumeSections';
import { SECTION_REGISTRY, isSectionVisible, hasSectionContent } from '../../utils/sectionRegistry';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onAddSection: (
    sectionType: ResumeSectionType,
    customConfig?: { title: string; contentType: 'text' | 'bullets' | 'key_value' }
  ) => void;
}

interface SectionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  sections: {
    type: ResumeSectionType;
    title: string;
    description: string;
  }[];
}

export default function AddSectionModal({ isOpen, onClose, data, onAddSection }: AddSectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customContentType, setCustomContentType] = useState<'text' | 'bullets' | 'key_value'>('bullets');

  const categories: SectionCategory[] = useMemo(
    () => [
      {
        id: 'core',
        name: 'Core',
        icon: <FileText className="w-4 h-4" />,
        sections: [
          { type: 'summary', title: 'Professional Summary', description: 'Brief executive summary of career highlights & goals' },
          { type: 'experience', title: 'Work Experience', description: 'Employment history, roles, and achievements' },
          { type: 'education', title: 'Education', description: 'Degrees, universities, honors, and graduation years' },
          { type: 'skills', title: 'Skills', description: 'Categorized or bulleted industry skills' },
          { type: 'expert_skills', title: 'Expert-Level Skills', description: 'Categorized skills with bold labels and grouped competencies' },
          { type: 'projects', title: 'Projects', description: 'Key projects, links, tech stacks, and outcomes' },
        ],
      },
      {
        id: 'leadership_achievements',
        name: 'Leadership & Awards',
        icon: <Award className="w-4 h-4" />,
        sections: [
          { type: 'leadership', title: 'Leadership', description: 'Leadership roles, team management, and initiatives' },
          { type: 'achievements', title: 'Key Achievements', description: 'Quantifiable milestones and notable wins' },
          { type: 'certifications', title: 'Certifications', description: 'Professional accreditations and credentials' },
          { type: 'licenses', title: 'Licenses', description: 'Official occupational licenses and permits' },
          { type: 'awards', title: 'Honors & Awards', description: 'Industry, academic, or organizational awards' },
          { type: 'volunteering', title: 'Volunteering', description: 'Community service and non-profit engagement' },
          { type: 'memberships', title: 'Memberships', description: 'Professional associations and affiliations' },
        ],
      },
      {
        id: 'academic_research',
        name: 'Academic & Research',
        icon: <BookOpen className="w-4 h-4" />,
        sections: [
          { type: 'publications', title: 'Publications', description: 'Peer-reviewed papers, journals, and articles' },
          { type: 'research', title: 'Research Experience', description: 'Laboratory, academic, or corporate research' },
          { type: 'conferences_speaking', title: 'Conferences & Speaking', description: 'Keynotes, panel talks, and presentations' },
          { type: 'patents', title: 'Patents', description: 'Issued and pending intellectual property' },
          { type: 'grants', title: 'Grants & Funding', description: 'Awarded research and development grants' },
          { type: 'teaching', title: 'Teaching Experience', description: 'Instructor, lecturer, or TA appointments' },
          { type: 'coursework', title: 'Relevant Coursework', description: 'Selected undergraduate/graduate classes' },
          { type: 'thesis', title: 'Thesis / Dissertation', description: 'Academic thesis title, adviser, and summary' },
          { type: 'academic_achievements', title: 'Academic Achievements', description: 'Dean’s List, scholarships, and academic honors' },
        ],
      },
      {
        id: 'technical_specialized',
        name: 'Technical & Domain',
        icon: <Code className="w-4 h-4" />,
        sections: [
          { type: 'technical_skills', title: 'Technical Skills', description: 'Programming languages, frameworks, and tools' },
          { type: 'tools_and_technologies', title: 'Tools & Technologies', description: 'Software platforms and developer tools' },
          { type: 'core_competencies', title: 'Core Competencies', description: 'High-level professional proficiencies' },
          { type: 'portfolio', title: 'Portfolio / Repositories', description: 'Links to design or code repositories' },
          { type: 'case_studies', title: 'Case Studies', description: 'Detailed client or project breakdowns' },
          { type: 'selected_work', title: 'Selected Work', description: 'Curated highlights of major deliverables' },
          { type: 'security_clearance', title: 'Security Clearance', description: 'Government and defense clearances' },
          { type: 'military', title: 'Military Service', description: 'Armed forces service, rank, and deployments' },
          { type: 'clinical_experience', title: 'Clinical Experience', description: 'Medical, nursing, or clinical rotations' },
        ],
      },
      {
        id: 'personal_additional',
        name: 'Additional & Personal',
        icon: <Languages className="w-4 h-4" />,
        sections: [
          { type: 'languages', title: 'Languages', description: 'Spoken languages and fluency levels' },
          { type: 'references', title: 'References', description: 'Professional references or availability note' },
          { type: 'interests', title: 'Interests & Activities', description: 'Extracurricular passions and hobbies' },
          { type: 'additional_information', title: 'Additional Information', description: 'Custom key-value metadata items' },
        ],
      },
    ],
    []
  );

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return categories
      .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
      .map((cat) => ({
        ...cat,
        sections: cat.sections.filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.type.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.sections.length > 0);
  }, [categories, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const isSectionActive = (type: ResumeSectionType) => {
    return isSectionVisible(data, type) && hasSectionContent(data, type);
  };

  const handleSelectSection = (type: ResumeSectionType) => {
    onAddSection(type);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddSection('custom', {
      title: customTitle.trim(),
      contentType: customContentType,
    });
    setCustomTitle('');
    setIsCustomMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-brand-border/60 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-secondary/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-dark flex items-center justify-center font-bold">
              <Plus className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark tracking-tight">Add Section to Resume</h2>
              <p className="text-xs text-brand-dark/60">
                Choose from 36 section types or create a custom section
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-dark/40 hover:text-brand-dark hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Section Creator vs Catalog View */}
        {isCustomMode ? (
          <form onSubmit={handleCreateCustom} className="p-6 space-y-5 overflow-y-auto">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Section Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Exhibitions, Open Source, Volunteer Mentorship"
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Content Layout Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomContentType('bullets')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    customContentType === 'bullets'
                      ? 'border-brand-green bg-emerald-50/50 ring-1 ring-brand-green'
                      : 'border-brand-border bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-brand-dark mb-1">• Bullet Points</div>
                  <div className="text-[11px] text-brand-dark/60">List of key accomplishments or items</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomContentType('text')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    customContentType === 'text'
                      ? 'border-brand-green bg-emerald-50/50 ring-1 ring-brand-green'
                      : 'border-brand-border bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-brand-dark mb-1">Paragraph Text</div>
                  <div className="text-[11px] text-brand-dark/60">Free-form descriptive narrative</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomContentType('key_value')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    customContentType === 'key_value'
                      ? 'border-brand-green bg-emerald-50/50 ring-1 ring-brand-green'
                      : 'border-brand-border bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-brand-dark mb-1">Label : Value</div>
                  <div className="text-[11px] text-brand-dark/60">Two-column structured pairs</div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-dark/70 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Back to Catalog
              </button>
              <button
                type="submit"
                disabled={!customTitle.trim()}
                className="px-4 py-2 rounded-xl bg-brand-dark hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Create Section
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Search & Category Filter */}
            <div className="p-4 border-b border-brand-border space-y-3 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-brand-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sections (e.g. Leadership, References, Patents, Languages)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-border bg-slate-50/60 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-green/50 placeholder:text-brand-dark/40"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-brand-dark text-white'
                      : 'bg-brand-secondary/80 text-brand-dark/70 hover:text-brand-dark'
                  }`}
                >
                  All Sections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-brand-dark text-white'
                        : 'bg-brand-secondary/80 text-brand-dark/70 hover:text-brand-dark'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections Catalog List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {filteredSections.map((category) => (
                <div key={category.id} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {category.sections.map((section) => {
                      const active = isSectionActive(section.type);

                      return (
                        <div
                          key={section.type}
                          className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                            active
                              ? 'bg-slate-50/80 border-slate-200 opacity-70'
                              : 'bg-white border-brand-border hover:border-brand-green/60 hover:shadow-xs group'
                          }`}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-brand-dark truncate">{section.title}</h4>
                              {active && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                                  <Check className="w-2.5 h-2.5" /> Added
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-brand-dark/60 line-clamp-2 leading-relaxed">
                              {section.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectSection(section.type)}
                            disabled={active}
                            className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-transparent text-slate-400 cursor-default'
                                : 'bg-brand-secondary text-brand-dark hover:bg-brand-green hover:text-brand-dark shadow-2xs'
                            }`}
                          >
                            {active ? 'Active' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="text-center py-8 text-xs text-brand-dark/50">
                  No section found matching "{searchQuery}".
                </div>
              )}
            </div>

            {/* Footer with Custom Section Option */}
            <div className="px-6 py-3.5 border-t border-brand-border bg-brand-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-brand-dark/70 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Need a section not listed here?</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-xs font-bold text-brand-dark transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Section</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
