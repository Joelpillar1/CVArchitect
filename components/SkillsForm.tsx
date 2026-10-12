import React, { useState, useMemo } from 'react';
import { ResumeData } from '../types';
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Layers, AlignLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { splitSkillsList } from '../utils/templateUtils';
import { parseSkillCategories } from '../utils/skillCategorization';

interface SkillsFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

interface SkillCategoryItem {
  id: string;
  category: string;
  skills: string;
}

const COMMON_SUGGESTIONS = [
  'Strategy & Product',
  'Methodologies',
  'Data & Analytics',
  'Design & UX',
  'Leadership',
  'Languages',
  'Frameworks',
  'Tools',
  'Cloud & Infrastructure',
];


export default function SkillsForm({ data, onChange, onAIAction }: SkillsFormProps) {
  const { showToast } = useToast();
  const [isEnhancingSkills, setIsEnhancingSkills] = useState(false);

  // Fall back to legacy expertSkills if data.skills is empty
  const effectiveRawSkills = useMemo(() => {
    const raw = (data.skills || '').trim();
    if (raw) return raw;
    if (data.expertSkills) {
      if (Array.isArray(data.expertSkills) && data.expertSkills.length > 0) {
        return data.expertSkills
          .map((item) => (item.category?.trim() ? `${item.category.trim()}: ${item.skills?.trim() || ''}` : item.skills?.trim() || ''))
          .filter(Boolean)
          .join('\n');
      }
      if (typeof data.expertSkills === 'string' && data.expertSkills.trim()) {
        return data.expertSkills.trim();
      }
    }
    return '';
  }, [data.skills, data.expertSkills]);

  // Detect whether the current skills string already has categorized lines ("Category: ...")
  const isCategorizedInRaw = useMemo(() => {
    const raw = effectiveRawSkills.trim();
    if (!raw) return false;
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    return lines.some((l) => /^[^:\n]{1,40}:\s*.+/i.test(l));
  }, [effectiveRawSkills]);

  // View mode: 'flat' (simple comma list) or 'categorized' (category cards)
  const [viewMode, setViewMode] = useState<'flat' | 'categorized'>(() => {
    return isCategorizedInRaw ? 'categorized' : 'flat';
  });

  // Parse categorized items when in categorized mode
  const categorizedItems: SkillCategoryItem[] = useMemo(() => {
    // Shared parser: labeled lines kept as rows; plain comma lists bucketed
    // into categories — single source of truth with resume template renderers.
    return parseSkillCategories(effectiveRawSkills);
  }, [effectiveRawSkills]);

  const updateCategorizedItems = (newItems: SkillCategoryItem[]) => {
    const serialized = newItems
      .map((it) => (it.category?.trim() ? `${it.category.trim()}: ${it.skills?.trim() || ''}` : it.skills?.trim() || ''))
      .filter(Boolean)
      .join('\n');

    onChange({
      ...data,
      skills: serialized,
    });
  };

  const handleAddCategory = (initialCategory = '') => {
    const newItem: SkillCategoryItem = {
      id: `item-${Date.now()}`,
      category: initialCategory,
      skills: '',
    };
    const next = [...categorizedItems, newItem];
    updateCategorizedItems(next);
    setViewMode('categorized');
  };

  const handleUpdateItem = (id: string, field: 'category' | 'skills', value: string) => {
    const updated = categorizedItems.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    updateCategorizedItems(updated);
  };

  const handleRemoveItem = (id: string) => {
    const remaining = categorizedItems.filter((item) => item.id !== id);
    if (remaining.length === 0) {
      // Flatten back to plain empty
      onChange({ ...data, skills: '' });
      setViewMode('flat');
    } else {
      updateCategorizedItems(remaining);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorizedItems.length) return;
    const newItems = [...categorizedItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateCategorizedItems(newItems);
  };

  // Convert structured categories back to a clean, flat comma list
  const handleConvertToFlat = () => {
    const flatSkills = splitSkillsList(data.skills);
    onChange({
      ...data,
      skills: flatSkills.join(', '),
    });
    setViewMode('flat');
    showToast('Converted skills to a simple comma list', 'info');
  };

  // Convert simple comma list into categorized structure
  const handleConvertToCategorized = () => {
    if (categorizedItems.length > 0) {
      updateCategorizedItems(categorizedItems);
    } else {
      handleAddCategory('Languages');
    }
    setViewMode('categorized');
  };

  const handleEnhanceSkills = async () => {
    if (!data.skills.trim()) {
      showToast('Please add some skills first before enhancing.', 'info');
      return;
    }

    if (onAIAction) {
      const allowed = onAIAction('ai_rewrite');
      if (!allowed) return;
    }

    setIsEnhancingSkills(true);
    try {
      const { enhanceSkills } = await import('./utils/aiEnhancer');
      const enhanced = await enhanceSkills(data.skills, data.jobTitle || 'Professional');
      onChange({ ...data, skills: enhanced });
      showToast('Skills enhanced successfully!', 'success');
    } catch (error) {
      showToast('Failed to enhance skills. Please check your API key configuration.', 'error');
      console.error(error);
    } finally {
      setIsEnhancingSkills(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Controls: Switch Mode & AI Button */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={handleConvertToFlat}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'flat'
                ? 'bg-white text-brand-dark shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <AlignLeft size={13} />
            <span>Simple List</span>
          </button>
          <button
            type="button"
            onClick={handleConvertToCategorized}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'categorized'
                ? 'bg-white text-brand-dark shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers size={13} />
            <span>Categorized</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleEnhanceSkills}
          disabled={isEnhancingSkills || !data.skills.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
          title="Enhance with AI (1 credit)"
        >
          <Sparkles size={13} className={isEnhancingSkills ? 'animate-spin' : ''} />
          <span>{isEnhancingSkills ? 'Enhancing...' : 'AI Enhance'}</span>
        </button>
      </div>

      {viewMode === 'flat' ? (
        /* ── Simple Comma List Mode (Default) ── */
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Skills List (Comma separated)</label>
            <textarea
              value={data.skills ?? effectiveRawSkills}
              onChange={(e) => onChange({ ...data, skills: e.target.value })}
              rows={6}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed text-gray-800"
              placeholder="React, TypeScript, Node.js, Python, AWS, SQL, Agile..."
            />
          </div>

          {/* Button to organize into categories */}
          <button
            type="button"
            onClick={handleConvertToCategorized}
            className="w-full py-2.5 px-3 border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-brand-dark rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus size={14} className="text-emerald-700" />
            <span>Organize into Categories (+ Add Category)</span>
          </button>

          <p className="text-[11px] text-gray-400 italic">
            Tip: Standard templates render skills as clean badges or comma lists. Templates like Regent Serif will format categories into a two-column table.
          </p>
        </div>
      ) : (
        /* ── Categorized Cards Mode ── */
        <div className="space-y-3">
          {categorizedItems.map((item, index) => (
            <div
              key={item.id || index}
              className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 space-y-2 relative group hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.category || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                  placeholder="Category Name (e.g. Languages, Tools, Leadership)"
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
                    disabled={index === categorizedItems.length - 1}
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
                  placeholder="Skills list (comma separated, e.g. Java, Python, TypeScript)"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-brand-green outline-none resize-none leading-relaxed text-gray-800"
                />
              </div>
            </div>
          ))}

          {/* Quick Category Suggestions */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Quick Suggestions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SUGGESTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleAddCategory(cat)}
                  className="px-2 py-1 bg-white border border-gray-200 hover:border-brand-green/60 hover:bg-emerald-50/40 text-gray-700 hover:text-brand-dark rounded-md text-[11px] font-medium transition-all cursor-pointer shadow-2xs"
                >
                  + {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={() => handleAddCategory('')}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-brand-green/70 rounded-xl text-xs font-semibold text-gray-600 hover:text-brand-green transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        </div>
      )}
    </div>
  );
}
