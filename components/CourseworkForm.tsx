import React from 'react';
import { ResumeData, CourseworkItem } from '../types';
import { Plus, Trash2, ChevronUp, ChevronDown, X, BookOpen, Sparkles } from 'lucide-react';
import { parseDescriptionBullets } from '../utils/templateUtils';

interface CourseworkFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAIAction?: (action: 'ai_rewrite' | 'cv_regeneration' | 'cover_letter' | 'bullet_optimization') => boolean;
}

export default function CourseworkForm({ data, onChange }: CourseworkFormProps) {
  // Normalize data.coursework to CourseworkItem[]
  const rawCoursework = data.coursework;
  const items: CourseworkItem[] = React.useMemo(() => {
    if (Array.isArray(rawCoursework) && rawCoursework.length > 0) {
      return rawCoursework.map((item, idx) => ({
        ...item,
        id: item.id || `coursework-${idx}`,
        description: Array.isArray(item.description)
          ? (item.description.length > 0 ? item.description : ['', ''])
          : (typeof item.description === 'string' && item.description.trim()
            ? parseDescriptionBullets(item.description)
            : ['', '']),
      }));
    }
    if (typeof rawCoursework === 'string' && rawCoursework.trim()) {
      return [
        {
          id: 'coursework-0',
          courseName: rawCoursework.trim(),
          institution: '',
          year: '',
          skills: '',
          description: ['', ''],
        },
      ];
    }
    return [
      {
        id: 'coursework-0',
        courseName: '',
        institution: '',
        year: '',
        skills: '',
        description: ['', ''],
      },
    ];
  }, [rawCoursework]);

  const updateItems = (newItems: CourseworkItem[]) => {
    onChange({
      ...data,
      coursework: newItems,
    });
  };

  const handleAdd = () => {
    const newItem: CourseworkItem = {
      id: Date.now().toString(),
      courseName: '',
      institution: '',
      year: '',
      skills: '',
      description: ['', ''],
    };
    updateItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= 1) {
      // Reset the single item to blank
      updateItems([
        {
          id: 'coursework-0',
          courseName: '',
          institution: '',
          year: '',
          skills: '',
          description: ['', ''],
        },
      ]);
      return;
    }
    updateItems(items.filter((_, idx) => idx !== index));
  };

  const handleChange = (index: number, field: keyof CourseworkItem, val: string | string[]) => {
    const updated = items.map((item, idx) => (idx === index ? { ...item, [field]: val } : item));
    updateItems(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const next = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateItems(next);
  };

  const handleBulletChange = (itemIndex: number, bulletIdx: number, val: string) => {
    const item = items[itemIndex];
    if (!item) return;
    const bullets = Array.isArray(item.description)
      ? [...item.description]
      : (typeof item.description === 'string' && item.description.trim() ? parseDescriptionBullets(item.description) : ['', '']);
    bullets[bulletIdx] = val;
    handleChange(itemIndex, 'description', bullets);
  };

  const handleAddBullet = (itemIndex: number) => {
    const item = items[itemIndex];
    if (!item) return;
    const bullets = Array.isArray(item.description)
      ? [...item.description]
      : (typeof item.description === 'string' && item.description.trim() ? parseDescriptionBullets(item.description) : ['', '']);
    bullets.push('');
    handleChange(itemIndex, 'description', bullets);
  };

  const handleRemoveBullet = (itemIndex: number, bulletIdx: number) => {
    const item = items[itemIndex];
    if (!item) return;
    const rawBullets = Array.isArray(item.description)
      ? item.description
      : (typeof item.description === 'string' && item.description.trim() ? parseDescriptionBullets(item.description) : ['', '']);
    const bullets = rawBullets.filter((_, idx) => idx !== bulletIdx);
    handleChange(itemIndex, 'description', bullets.length > 0 ? bullets : ['']);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        {items.map((item, index) => {
          const bullets = Array.isArray(item.description)
            ? item.description
            : parseDescriptionBullets(item.description || '');

          return (
            <div
              key={item.id || index}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 group hover:border-brand-green/50 transition-all"
            >
              {/* Header with Title & Controls */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-brand-green" />
                  <span className="text-xs font-bold text-gray-800">
                    {item.courseName || `Coursework ${index + 1}`}
                    {item.year ? ` (${item.year})` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="text-gray-400 hover:text-brand-green transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1"
                    title="Remove coursework"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
                {/* 1. Course Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.courseName || ''}
                    onChange={(e) => handleChange(index, 'courseName', e.target.value)}
                    placeholder="e.g., Computer Science, Data Structures & Algorithms"
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* 2. Institution & Year Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={item.institution || ''}
                      onChange={(e) => handleChange(index, 'institution', e.target.value)}
                      placeholder="e.g., BUK, Stanford"
                      className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Year / Date
                    </label>
                    <input
                      type="text"
                      value={item.year || ''}
                      onChange={(e) => handleChange(index, 'year', e.target.value)}
                      placeholder="e.g., 2026"
                      className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* 3. Skills Covered (Prominent, leading row) */}
                <div className="space-y-1 pt-0.5">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Skills Covered
                  </label>
                  <input
                    type="text"
                    value={item.skills || ''}
                    onChange={(e) => handleChange(index, 'skills', e.target.value)}
                    placeholder="e.g., Excel, Work, Spreadsheet"
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* 4. Applied Bullets */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 block">
                      How Was That Skill Applied
                    </label>
                  </div>

                  <div className="space-y-2">
                    {bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-gray-400 mt-2 text-xs select-none">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleBulletChange(index, bIdx, e.target.value)}
                          placeholder="Describe how the skill was applied in assignments, labs, or coursework projects..."
                          className="flex-1 p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all resize-none leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(index, bIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors mt-1"
                          title="Remove bullet"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddBullet(index)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-greenHover mt-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Bullet Point</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-brand-dark bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-xl transition-all cursor-pointer shadow-sm"
      >
        <Plus size={16} /> Add Coursework
      </button>
    </div>
  );
}
