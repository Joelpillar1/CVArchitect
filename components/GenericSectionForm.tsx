import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ResumeData, Experience, Project, Certification, LanguageItem } from '../types';
import { SectionDefinition } from '../types/resumeSections';
import { parseDescriptionBullets } from '../utils/templateUtils';
import CourseworkForm from './CourseworkForm';
import ExpertSkillsForm from './ExpertSkillsForm';

interface GenericSectionFormProps {
  sectionType: string;
  definition: SectionDefinition;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function GenericSectionForm({
  sectionType,
  definition,
  data,
  onChange,
  onAIAction,
}: GenericSectionFormProps) {
  const fieldName = definition.dataField as keyof ResumeData;
  const currentVal = data[fieldName];

  const updateField = (val: any) => {
    onChange({
      ...data,
      [fieldName]: val,
    });
  };

  // 1. EXPERIENCE-LIKE SECTIONS (volunteering, research, teaching, military, clinicalExperience)
  if (definition.rendererKind === 'experience') {
    const items: Experience[] = Array.isArray(currentVal) ? (currentVal as Experience[]) : [];

    const handleAdd = () => {
      const newItem: Experience = {
        id: Date.now().toString(),
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ['', ''],
      };
      updateField([...items, newItem]);
    };

    const handleRemove = (id: string) => {
      updateField(items.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Experience, value: string | string[]) => {
      updateField(
        items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    };

    const handleBulletChange = (itemId: string, bulletIdx: number, val: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const bullets = Array.isArray(item.description)
        ? [...item.description]
        : parseDescriptionBullets(item.description || '');
      bullets[bulletIdx] = val;
      handleChange(itemId, 'description', bullets);
    };

    const handleAddBullet = (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const bullets = Array.isArray(item.description)
        ? [...item.description]
        : parseDescriptionBullets(item.description || '');
      bullets.push('');
      handleChange(itemId, 'description', bullets);
    };

    const handleRemoveBullet = (itemId: string, bulletIdx: number) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const bullets = (Array.isArray(item.description)
        ? item.description
        : parseDescriptionBullets(item.description || '')
      ).filter((_, idx) => idx !== bulletIdx);
      handleChange(itemId, 'description', bullets);
    };

    return (
      <div className="space-y-4 pt-1">
        {items.map((item, index) => {
          const bullets = Array.isArray(item.description)
            ? item.description
            : parseDescriptionBullets(item.description || '');
          return (
            <div
              key={item.id || index}
              className="p-3.5 bg-gray-50/80 rounded-xl border border-brand-border space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  {item.role || item.company || `Entry #${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                  title="Remove entry"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Role / Position</label>
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => handleChange(item.id, 'role', e.target.value)}
                    placeholder="e.g., Volunteer Coordinator"
                    className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Organization</label>
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                    placeholder="e.g., Red Cross"
                    className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Start Date</label>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                    placeholder="e.g., 2022"
                    className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">End Date</label>
                  <input
                    type="text"
                    value={item.endDate || ''}
                    onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                    placeholder="e.g., Present"
                    className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold text-gray-600">Bullet Points</label>
                {bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-1.5 text-xs select-none">•</span>
                    <textarea
                      rows={2}
                      value={b}
                      onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                      placeholder="Describe key responsibilities and measurable impact..."
                      className="flex-1 px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(item.id, bIdx)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded mt-1"
                      title="Remove bullet"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddBullet(item.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green hover:text-brand-greenHover mt-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Bullet</span>
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2 border-2 border-dashed border-brand-border hover:border-brand-green/70 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-green transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add {definition.defaultTitle}</span>
        </button>
      </div>
    );
  }

  // 2. PROJECTS-LIKE SECTIONS (portfolio, caseStudies, selectedWork)
  if (definition.rendererKind === 'projects') {
    const items: Project[] = Array.isArray(currentVal) ? (currentVal as Project[]) : [];

    const handleAdd = () => {
      const newItem: Project = {
        id: Date.now().toString(),
        name: '',
        description: '',
        technologies: '',
        link: '',
      };
      updateField([...items, newItem]);
    };

    const handleRemove = (id: string) => {
      updateField(items.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Project, val: string) => {
      updateField(
        items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
      );
    };

    return (
      <div className="space-y-4 pt-1">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-3.5 bg-gray-50/80 rounded-xl border border-brand-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                {item.name || `Project #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                title="Remove entry"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Project Name</label>
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                placeholder="e.g., E-Commerce Application"
                className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Technologies Used</label>
              <input
                type="text"
                value={item.technologies || ''}
                onChange={(e) => handleChange(item.id, 'technologies', e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Link / URL</label>
              <input
                type="text"
                value={item.link || ''}
                onChange={(e) => handleChange(item.id, 'link', e.target.value)}
                placeholder="e.g., https://github.com/..."
                className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Description</label>
              <textarea
                rows={3}
                value={item.description || ''}
                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                placeholder="Describe features, metrics, and outcomes..."
                className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none resize-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2 border-2 border-dashed border-brand-border hover:border-brand-green/70 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-green transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add {definition.defaultTitle}</span>
        </button>
      </div>
    );
  }

  // 3. CERTIFICATIONS-LIKE SECTIONS (licenses, patents, grants, memberships)
  if (definition.rendererKind === 'certifications') {
    const items: Certification[] = Array.isArray(currentVal) ? (currentVal as Certification[]) : [];

    const handleAdd = () => {
      const newItem: Certification = {
        id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
        link: '',
      };
      updateField([...items, newItem]);
    };

    const handleRemove = (id: string) => {
      updateField(items.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof Certification, val: string) => {
      updateField(
        items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
      );
    };

    return (
      <div className="space-y-4 pt-1">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-3.5 bg-gray-50/80 rounded-xl border border-brand-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                {item.name || `Item #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                title="Remove entry"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Name / Title</label>
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                placeholder="e.g., Professional Engineer (PE)"
                className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Issuer / Organization</label>
                <input
                  type="text"
                  value={item.issuer || ''}
                  onChange={(e) => handleChange(item.id, 'issuer', e.target.value)}
                  placeholder="e.g., State Board"
                  className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Date</label>
                <input
                  type="text"
                  value={item.date || ''}
                  onChange={(e) => handleChange(item.id, 'date', e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full px-2.5 py-1.5 text-xs border border-brand-border rounded-md bg-white focus:ring-1 focus:ring-brand-green outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2 border-2 border-dashed border-brand-border hover:border-brand-green/70 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-green transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add {definition.defaultTitle}</span>
        </button>
      </div>
    );
  }

  // 4. BULLETS-LIKE SECTIONS (awards, publications, conferencesSpeaking, academicAchievements)
  if (definition.rendererKind === 'bullets') {
    const bullets: string[] = Array.isArray(currentVal)
      ? (currentVal as string[])
      : typeof currentVal === 'string' && currentVal.trim()
      ? currentVal.split('\n').filter(Boolean)
      : [];

    const handleBulletChange = (idx: number, val: string) => {
      const next = [...bullets];
      next[idx] = val;
      updateField(next);
    };

    const handleAddBullet = () => {
      updateField([...bullets, '']);
    };

    const handleRemoveBullet = (idx: number) => {
      updateField(bullets.filter((_, i) => i !== idx));
    };

    return (
      <div className="space-y-3 pt-1">
        <label className="block text-xs font-semibold text-gray-700">
          {definition.defaultTitle} List
        </label>
        {bullets.map((b, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-gray-400 mt-2 text-xs select-none">•</span>
            <textarea
              rows={2}
              value={b}
              onChange={(e) => handleBulletChange(idx, e.target.value)}
              placeholder="Add bullet point..."
              className="flex-1 px-3 py-1.5 text-xs border border-brand-border rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none"
            />
            <button
              type="button"
              onClick={() => handleRemoveBullet(idx)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors mt-1"
              title="Remove bullet"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddBullet}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-greenHover mt-2 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Item</span>
        </button>
      </div>
    );
  }

  // 5. EXPERT-SKILLS SECTION
  if (definition.rendererKind === 'expert_skills' || sectionType === 'expert_skills') {
    return <ExpertSkillsForm data={data} onChange={onChange} onAIAction={onAIAction} />;
  }

  // 6. SKILLS-LIKE SECTIONS (technicalSkills, coreCompetencies, toolsAndTechnologies)
  if (definition.rendererKind === 'skills') {
    const textStr = typeof currentVal === 'string' ? currentVal : '';
    return (
      <div className="space-y-2 pt-1">
        <label className="block text-xs font-semibold text-gray-700">
          {definition.defaultTitle} (Comma-separated)
        </label>
        <textarea
          rows={4}
          value={textStr}
          onChange={(e) => updateField(e.target.value)}
          placeholder="e.g., Python, Docker, Kubernetes, AWS, GraphQL..."
          className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none"
        />
        <p className="text-[11px] text-gray-400">
          Separate each skill with a comma to render them as individual badges.
        </p>
      </div>
    );
  }

  // 6. LANGUAGES SECTION
  if (definition.rendererKind === 'languages') {
    const items: LanguageItem[] = Array.isArray(currentVal) ? (currentVal as LanguageItem[]) : [];

    const handleAdd = () => {
      const newItem: LanguageItem = {
        id: Date.now().toString(),
        language: '',
        proficiency: 'Professional Working',
      };
      updateField([...items, newItem]);
    };

    const handleRemove = (id: string) => {
      updateField(items.filter((item) => item.id !== id));
    };

    const handleChange = (id: string, field: keyof LanguageItem, val: string) => {
      updateField(
        items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
      );
    };

    return (
      <div className="space-y-3 pt-1">
        <label className="block text-xs font-semibold text-gray-700">
          Languages & Proficiency
        </label>
        {items.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item.language || ''}
              onChange={(e) => handleChange(item.id, 'language', e.target.value)}
              placeholder="e.g., French"
              className="w-1/2 px-3 py-1.5 text-xs border border-brand-border rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none"
            />
            <input
              type="text"
              value={item.proficiency || ''}
              onChange={(e) => handleChange(item.id, 'proficiency', e.target.value)}
              placeholder="e.g., Native / Fluent"
              className="flex-1 px-3 py-1.5 text-xs border border-brand-border rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none"
            />
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
              title="Remove language"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-greenHover mt-2 cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Language</span>
        </button>
      </div>
    );
  }

  // 7. COURSEWORK SECTION
  if (definition.rendererKind === 'coursework' || sectionType === 'coursework') {
    return <CourseworkForm data={data} onChange={onChange} onAIAction={onAIAction} />;
  }

  // 8. TEXT-LIKE SECTIONS (thesis, interests, securityClearance, references, etc.)
  const textVal = typeof currentVal === 'string' ? currentVal : '';
  return (
    <div className="space-y-2 pt-1">
      <label className="block text-xs font-semibold text-gray-700">
        {definition.defaultTitle}
      </label>
      <textarea
        rows={4}
        value={textVal}
        onChange={(e) => updateField(e.target.value)}
        placeholder={`Add ${definition.defaultTitle.toLowerCase()} details...`}
        className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none"
      />
    </div>
  );
}
