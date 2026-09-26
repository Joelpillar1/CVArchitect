import React, { useState } from 'react';
import { X, Sparkles, Check, RotateCcw, Loader2, ArrowRight, Wand2 } from 'lucide-react';
import { callAIText } from '../../services/aiService';
import { ensureAllBulletsHaveUniqueVerbs, ensureUniqueActionVerb, detectActionVerbDomain } from '../../utils/actionVerbs';

interface AIRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  sectionName: string;
  onApplyRewrite: (newText: string) => void;
}

export default function AIRewriteModal({
  isOpen,
  onClose,
  originalText,
  sectionName,
  onApplyRewrite,
}: AIRewriteModalProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRewrite = async (presetPrompt?: string) => {
    setIsGenerating(true);
    setError(null);

    const promptInstruction = presetPrompt || customPrompt || 'Rewrite to make it more professional, impactful, and ATS friendly.';

    const fullPrompt = `
You are an expert resume writer and product designer.
Rewrite the following resume text based on this instruction: "${promptInstruction}".

CRITICAL RULES:
- Keep all facts, metrics, and factual claims truthful to the original context. Do NOT fabricate fake companies or degrees.
- NO % SPAM: Do NOT invent fake percentages or force '%' metrics if none existed in the original text. Highlight impact through technical scope, tools used, architecture, and business outcomes.
- STRICT ZERO-DUPLICATE STARTING VERBS: If rewriting bullet points, every single bullet point MUST start with a completely DIFFERENT, unique action verb. One verb must NEVER appear twice.

Original Text:
"${originalText}"

Return ONLY the rewritten text without markdown quotes or conversational filler.
`;

    try {
      const rewritten = await callAIText(fullPrompt, 'gpt-4o', 0.4);
      let cleaned = rewritten.trim().replace(/^["']|["']$/g, '');
      const domain = detectActionVerbDomain(sectionName || '');
      if (cleaned.includes('\n') || cleaned.startsWith('•') || cleaned.startsWith('-')) {
        cleaned = ensureAllBulletsHaveUniqueVerbs(cleaned, new Set(), domain);
      }
      setProposedText(cleaned);
    } catch (err: any) {
      console.error('AI Rewrite failed:', err);
      // Fallback rewrite
      setProposedText(
        originalText.replace(/responsible for/gi, 'Spearheaded') + ' driving measurable impact and high performance.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (proposedText) {
      onApplyRewrite(proposedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 relative text-slate-800 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-green/20 text-brand-dark flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-brand-dark">AI Rewrite Assistant</h3>
            <p className="text-xs text-slate-500">Target Section: <span className="font-semibold text-brand-dark">{sectionName}</span></p>
          </div>
        </div>

        {/* Original Text Display */}
        <div className="bg-slate-50 p-3 rounded-xl border border-gray-200/80 space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Current Wording</span>
          <p className="text-xs text-slate-700 leading-relaxed italic font-medium">"{originalText}"</p>
        </div>

        {/* Preset AI Prompts */}
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-2">Quick AI Actions</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleRewrite('Use stronger action verbs and punchy phrasing')}
              disabled={isGenerating}
              className="p-2.5 bg-white border border-gray-200 hover:border-brand-green hover:bg-brand-green/10 rounded-xl text-left font-semibold text-brand-dark transition-all flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>⚡ Action Verbs</span>
            </button>

            <button
              onClick={() => handleRewrite('Make it sound more senior, strategic, and executive')}
              disabled={isGenerating}
              className="p-2.5 bg-white border border-gray-200 hover:border-brand-green hover:bg-brand-green/10 rounded-xl text-left font-semibold text-brand-dark transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>🎯 More Senior</span>
            </button>

            <button
              onClick={() => handleRewrite('Highlight quantifiable impact, outcomes, and business results')}
              disabled={isGenerating}
              className="p-2.5 bg-white border border-gray-200 hover:border-brand-green hover:bg-brand-green/10 rounded-xl text-left font-semibold text-brand-dark transition-all flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>📈 Add Metrics</span>
            </button>

            <button
              onClick={() => handleRewrite('Optimize keyword placement for ATS parsing algorithms')}
              disabled={isGenerating}
              className="p-2.5 bg-white border border-gray-200 hover:border-brand-green hover:bg-brand-green/10 rounded-xl text-left font-semibold text-brand-dark transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>🔍 ATS Optimize</span>
            </button>
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRewrite()}
            placeholder="Or type custom AI instruction (e.g. 'Shorten to one line')..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-gray-200 focus:border-brand-green rounded-xl text-xs text-brand-dark focus:outline-none"
          />
          <button
            onClick={() => handleRewrite()}
            disabled={isGenerating || !customPrompt.trim()}
            className="px-3 py-2 bg-brand-dark hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Generate
          </button>
        </div>

        {/* Output Preview */}
        {isGenerating && (
          <div className="py-6 text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-brand-green animate-spin" />
            <span>AI rewriting your section...</span>
          </div>
        )}

        {proposedText && !isGenerating && (
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">Rewritten Output</span>
              <p className="text-xs text-emerald-950 font-semibold leading-relaxed">{proposedText}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 bg-brand-green hover:bg-brand-greenHover text-brand-dark font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Resume</span>
              </button>

              <button
                onClick={() => handleRewrite()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                title="Regenerate"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
