import React, { useState } from 'react';
import { ResumeData, ExpertSkillItem } from '../types';
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown, ListFilter, AlignLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { parseExpertSkillItems } from '../utils/templateUtils';

interface ExpertSkillsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

const COMMON_CATEGORIES = [
  'Leadership',
  'Front End',
  'Back End',
  'Design',
  'Fields of Interest',
  'Cloud & DevOps',
  'Data & AI',
  'Project Management',
];

export default function ExpertSkillsForm({ data, onChange, onAIAction }: ExpertSkillsFormProps) {
  const { showToast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [viewMode, setViewMode] = useState<'structured' | 'raw'>('structured');

  const items: ExpertSkillItem[] = React.useMemo(() => {
    return parseExpertSkillItems(data.expertSkills);
  }, [data.expertSkills]);

  const rawTextValue: string = React.useMemo(() => {
    if (typeof data.expertSkills === 'string') return data.expertSkills;
    if (Array.isArray(data.expertSkills)) {
      return data.expertSkills
        .map((it) => (it.category ? `${it.category}: ${it.skills}` : it.skills))
        .join('\n');
    }
    return '';
  }, [data.expertSkills]);

  const updateItems = (newItems: ExpertSkillItem[]) => {
    onChange({
      ...data,
      expertSkills: newItems,
    });
  };

  const handleAddItem = (initialCategory = '') => {
    const newItem: ExpertSkillItem = {
      id: `item-${Date.now()}`,
      category: initialCategory,
      skills: '',
    };
    updateItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: 'category' | 'skills', value: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    updateItems(updated);
  };

  const handleRemoveItem = (id: string) => {
    updateItems(items.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateItems(newItems);
  };

  const handleRawTextChange = (text: string) => {
    onChange({
      ...data,
      expertSkills: text,
    });
  };

  const handleEnhance = async () => {
    if (items.length === 0 && !rawTextValue.trim()) {
      showToast('Please add some skills first before enhancing.', 'info');
      return;
    }

    if (onAIAction) {
      const allowed = onAIAction('ai_rewrite');
      if (!allowed) return;
    }

    setIsEnhancing(true);
    try {
      const { enhanceSkills } = await import('./utils/aiEnhancer');
      const inputStr = items.map((it) => `${it.category ? it.category + ': ' : ''}${it.skills}`).join('\n') || rawTextValue;
      const enhanced = await enhanceSkills(inputStr, data.jobTitle || 'Professional');

      // Attempt to parse enhanced output into categories or keep as formatted lines
      const parsed = parseExpertSkillItems(enhanced);
      if (parsed.length > 0) {
        updateItems(parsed);
      } else {
        onChange({ ...data, expertSkills: enhanced });
      }
      showToast('Expert-Level Skills enhanced successfully!', 'success');
    } catch (error) {
      showToast('Failed to enhance skills. Please check your API key configuration.', 'error');
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header controls: View mode switch and AI button */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('structured')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'structured'
                ? 'bg-white text-brand-dark shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ListFilter size={13} />
            <span>Structured</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-white text-brand-dark shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <AlignLeft size={13} />
            <span>Raw Text</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing || (items.length === 0 && !rawTextValue.trim())}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
          title="Enhance with AI (1 credit)"
        >
          <Sparkles size={13} className={isEnhancing ? 'animate-spin' : ''} />
          <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
        </button>
      </div>

      {viewMode === 'raw' ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">
            Raw Expert-Level Skills (One category per line: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">Category: Skill 1, Skill 2</code>)
          </label>
          <textarea
            rows={8}
            value={rawTextValue}
            onChange={(e) => handleRawTextChange(e.target.value)}
            placeholder="Leadership: Speaking, Fundraising, Product Development, Partnerships&#10;Front End: HTML, CSS, Bootstrap, Webflow | Design: Photoshop, Figma&#10;Fields of Interest: Early-Stage Fundraising, Global Entrepreneurship"
            className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed font-mono"
          />
          <p className="text-[11px] text-gray-500 italic">
            Lines with colons automatically bold the category name (e.g. <b>Leadership:</b> Speaking, ...).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 space-y-2 relative group hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.category || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                  placeholder="Category Name (e.g. Leadership, Front End, Design)"
                  className="flex-1 px-2.5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors ml-0.5"
                    title="Remove category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={item.skills || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'skills', e.target.value)}
                  placeholder="Skills list (e.g. Speaking, Fundraising, Product Development, Communication, Partnerships)"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl space-y-2">
              <p className="text-xs text-gray-500 font-medium">No skill categories added yet.</p>
              <button
                type="button"
                onClick={() => handleAddItem('Leadership')}
                className="px-3 py-1.5 bg-brand-dark text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                + Add First Category
              </button>
            </div>
          )}

          {/* Quick Category Suggestions */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Quick Suggestions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleAddItem(cat)}
                  className="px-2 py-1 bg-white border border-gray-200 hover:border-brand-green/60 hover:bg-emerald-50/40 text-gray-700 hover:text-brand-dark rounded-md text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                >
                  + {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddItem('')}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-brand-green/70 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-green transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus size={14} />
            <span>Add Skill Category</span>
          </button>
        </div>
      )}
    </div>
  );
}
