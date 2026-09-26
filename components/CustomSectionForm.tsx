import React from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { ResumeData } from '../types';
import { CustomSectionData } from '../types/resumeSections';

interface CustomSectionFormProps {
  customId: string;
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function CustomSectionForm({ customId, data, onChange }: CustomSectionFormProps) {
  const custom = data.customSections?.[customId];
  if (!custom) return null;

  const updateCustom = (updated: Partial<CustomSectionData>) => {
    const updatedCustoms = {
      ...(data.customSections || {}),
      [customId]: {
        ...custom,
        ...updated,
      },
    };
    onChange({
      ...data,
      customSections: updatedCustoms,
    });
  };

  const handleDeleteSection = () => {
    const updatedCustoms = { ...(data.customSections || {}) };
    delete updatedCustoms[customId];
    const newOrder = (data.sectionOrder || []).filter((id) => id !== customId);
    const newVisibility = { ...(data.sectionVisibility || {}) };
    delete newVisibility[customId];
    onChange({
      ...data,
      customSections: updatedCustoms,
      sectionOrder: newOrder,
      sectionVisibility: newVisibility,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCustom({ title: e.target.value });
  };

  // Bullets Content
  const bullets = Array.isArray(custom.content)
    ? (custom.content as string[])
    : typeof custom.content === 'string'
    ? custom.content.split('\n').filter(Boolean)
    : [];

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    updateCustom({ content: newBullets });
  };

  const handleAddBullet = () => {
    const newBullets = [...bullets, ''];
    updateCustom({ content: newBullets });
  };

  const handleRemoveBullet = (index: number) => {
    const newBullets = bullets.filter((_, i) => i !== index);
    updateCustom({ content: newBullets });
  };

  // Text Content
  const textContent = typeof custom.content === 'string' ? custom.content : bullets.join('\n');

  // Key-Value Content
  const kvItems: Array<{ id: string; label: string; value: string }> = Array.isArray(custom.content)
    ? (custom.content as any[]).map((item, idx) =>
        typeof item === 'object' && item !== null
          ? item
          : { id: String(idx), label: 'Item', value: String(item) }
      )
    : [];

  const handleKVChange = (index: number, field: 'label' | 'value', val: string) => {
    const newItems = [...kvItems];
    newItems[index] = { ...newItems[index], [field]: val };
    updateCustom({ content: newItems });
  };

  const handleAddKVItem = () => {
    const newItems = [...kvItems, { id: String(Date.now()), label: '', value: '' }];
    updateCustom({ content: newItems });
  };

  const handleRemoveKVItem = (index: number) => {
    const newItems = kvItems.filter((_, i) => i !== index);
    updateCustom({ content: newItems });
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Section Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Section Title
        </label>
        <input
          type="text"
          value={custom.title}
          onChange={handleTitleChange}
          placeholder="e.g., Volunteer Work, Speaking Engagements"
          className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
      </div>

      {/* Bullets Format */}
      {custom.contentType === 'bullets' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Bullet Points
          </label>
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-gray-400 mt-2 text-xs select-none">•</span>
              <textarea
                rows={2}
                value={bullet}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                placeholder="Add bullet point description..."
                className="flex-1 px-3 py-1.5 text-xs border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
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
            <span>Add Bullet Point</span>
          </button>
        </div>
      )}

      {/* Text/Paragraph Format */}
      {custom.contentType === 'text' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={textContent}
            onChange={(e) => updateCustom({ content: e.target.value })}
            placeholder="Add descriptive overview or notes for this section..."
            className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      )}

      {/* Key-Value Format */}
      {custom.contentType === 'key_value' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Items & Details
          </label>
          {kvItems.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleKVChange(idx, 'label', e.target.value)}
                placeholder="Label"
                className="w-1/3 px-3 py-1.5 text-xs border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleKVChange(idx, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-1.5 text-xs border border-brand-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <button
                type="button"
                onClick={() => handleRemoveKVItem(idx)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                title="Remove item"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddKVItem}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-greenHover mt-2 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Item</span>
          </button>
        </div>
      )}

      {/* Delete Custom Section Button */}
      <div className="pt-3 border-t border-brand-border flex justify-end">
        <button
          type="button"
          onClick={handleDeleteSection}
          className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Delete Section</span>
        </button>
      </div>
    </div>
  );
}
