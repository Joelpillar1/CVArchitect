import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, PenTool, Type, Trash2, Check, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSignatureUrl: string | null;
    onSaveSignature: (url: string | null) => void;
    candidateName?: string;
}

type TabType = 'upload' | 'draw' | 'type';

const INK_COLORS = [
    { label: 'Navy Fountain', value: '#1b365d' },
    { label: 'Classic Black', value: '#111827' },
    { label: 'Royal Blue', value: '#2563eb' }
];

const SIGNATURE_FONTS = [
    { id: 'alex-brush', name: 'Alex Brush', fontFamily: "'Alex Brush', cursive" },
    { id: 'dancing-script', name: 'Dancing Script', fontFamily: "'Dancing Script', cursive" },
    { id: 'caveat', name: 'Caveat', fontFamily: "'Caveat', cursive" }
];

export default function SignatureModal({
    isOpen,
    onClose,
    currentSignatureUrl,
    onSaveSignature,
    candidateName = 'Alex Morgan'
}: SignatureModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentSignatureUrl);
    const [inkColor, setInkColor] = useState<string>('#1b365d');
    const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
    const [typedName, setTypedName] = useState<string>(candidateName || 'Alex Morgan');
    const [selectedFont, setSelectedFont] = useState<string>(SIGNATURE_FONTS[0].fontFamily);
    const [isDragOver, setIsDragOver] = useState(false);
    const [autoRemoveBg, setAutoRemoveBg] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const hasDrawnRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Keep preview in sync with current signature on open
    useEffect(() => {
        if (isOpen) {
            setPreviewUrl(currentSignatureUrl);
            setTypedName(candidateName || 'Alex Morgan');
            hasDrawnRef.current = false;
        }
    }, [isOpen, currentSignatureUrl, candidateName]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Setup drawing canvas
    useEffect(() => {
        if (activeTab === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = inkColor;
                ctx.lineWidth = strokeWidth;
            }
        }
    }, [activeTab, inkColor, strokeWidth]);

    const clearCanvas = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        hasDrawnRef.current = false;
        setPreviewUrl(null);
    };

    /**
     * Optional image post-processing to remove white/off-white background
     * turning it transparent for seamless document rendering
     */
    const processImageFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (!autoRemoveBg) {
                setPreviewUrl(dataUrl);
                return;
            }

            // Remove white background via canvas
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const offscreen = document.createElement('canvas');
                offscreen.width = img.naturalWidth || img.width;
                offscreen.height = img.naturalHeight || img.height;
                const ctx = offscreen.getContext('2d');
                if (!ctx) {
                    setPreviewUrl(dataUrl);
                    return;
                }

                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
                const data = imgData.data;

                // Make white & near-white pixels transparent
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // Threshold: if pixel is bright/white, make transparent
                    if (r > 220 && g > 220 && b > 220) {
                        data[i + 3] = 0;
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                setPreviewUrl(offscreen.toDataURL('image/png'));
            };
            img.onerror = () => setPreviewUrl(dataUrl);
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, [autoRemoveBg]);

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, SVG, WebP).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit.');
            return;
        }
        processImageFile(file);
    };

    // Canvas drawing helpers
    const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.setPointerCapture(e.pointerId);
        isDrawingRef.current = true;
        hasDrawnRef.current = true;
        const point = getCanvasCoordinates(e);
        lastPointRef.current = point;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.fillStyle = inkColor;
            ctx.arc(point.x, point.y, strokeWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current || !canvasRef.current || !lastPointRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const currentPoint = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        lastPointRef.current = currentPoint;
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        lastPointRef.current = null;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore if pointer capture release fails
        }

        if (canvasRef.current && hasDrawnRef.current) {
            // Render canvas to trimmed PNG data URL
            const trimmedDataUrl = canvasRef.current.toDataURL('image/png');
            setPreviewUrl(trimmedDataUrl);
        }
    };

    /**
     * Converts typed cursive text into an image data URL
     */
    const generateTypedSignature = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = 600;
        offscreen.height = 160;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, offscreen.width, offscreen.height);
        ctx.font = `64px ${selectedFont}`;
        ctx.fillStyle = inkColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(typedName || candidateName || 'Alex Morgan', offscreen.width / 2, offscreen.height / 2);

        const dataUrl = offscreen.toDataURL('image/png');
        setPreviewUrl(dataUrl);
    };

    const handleApply = () => {
        onSaveSignature(previewUrl);
        onClose();
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onSaveSignature(null);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[120] w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200/90 flex flex-col max-h-[92vh] animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                            <PenTool size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 leading-tight">
                                Cover Letter Signature
                            </h2>
                            <p className="text-xs text-gray-500">
                                Upload, draw, or generate your authentic signature
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-3 border-b border-gray-100 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer ${
                            activeTab === 'upload'
                                ? 'border-brand-green text-brand-dark bg-emerald-50/40'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Upload size={14} />
                        <span>Upload Image</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('draw')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer ${
                            activeTab === 'draw'
                                ? 'border-brand-green text-brand-dark bg-emerald-50/40'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <PenTool size={14} />
                        <span>Draw</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('type');
                            generateTypedSignature();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer ${
                            activeTab === 'type'
                                ? 'border-brand-green text-brand-dark bg-emerald-50/40'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <Type size={14} />
                        <span>Style / Font</span>
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-5">
                    {/* 1. UPLOAD TAB */}
                    {activeTab === 'upload' && (
                        <div className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />

                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                    handleFileSelect(e.dataTransfer.files);
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                    isDragOver
                                        ? 'border-emerald-500 bg-emerald-50/40'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                }`}
                            >
                                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                                    <Upload size={22} />
                                </div>
                                <p className="text-sm font-bold text-gray-900 mb-1">
                                    Drop your signature file here, or <span className="text-emerald-700 underline">browse</span>
                                </p>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    Supports PNG, JPG, WebP, SVG up to 5MB. Transparent PNG recommended.
                                </p>
                            </div>

                            <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={autoRemoveBg}
                                    onChange={(e) => setAutoRemoveBg(e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                />
                                <span className="font-medium">
                                    Auto-remove white background (makes scanned/photographed paper transparent)
                                </span>
                            </label>
                        </div>
                    )}

                    {/* 2. DRAW TAB */}
                    {activeTab === 'draw' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3 text-xs">
                                {/* Ink color selection */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500 font-medium">Ink:</span>
                                    {INK_COLORS.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setInkColor(c.value)}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                                inkColor === c.value
                                                    ? 'scale-110 border-brand-dark ring-2 ring-brand-green/40'
                                                    : 'border-transparent opacity-80 hover:opacity-100'
                                            }`}
                                            style={{ backgroundColor: c.value }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>

                                {/* Pen stroke width */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500 font-medium">Width:</span>
                                    {[2, 3, 4].map((w) => (
                                        <button
                                            key={w}
                                            type="button"
                                            onClick={() => setStrokeWidth(w)}
                                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                                strokeWidth === w
                                                    ? 'bg-brand-dark text-white border-brand-dark'
                                                    : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                        >
                                            {w === 2 ? 'Fine' : w === 3 ? 'Medium' : 'Thick'}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={clearCanvas}
                                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold transition-colors"
                                >
                                    <RefreshCw size={12} />
                                    <span>Clear</span>
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white relative shadow-inner">
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={160}
                                    className="w-full h-[160px] touch-none cursor-crosshair bg-white"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                />
                                {!hasDrawnRef.current && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-gray-400 font-medium">
                                        Sign with mouse, trackpad, or finger here
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. TYPE / SCRIPT TAB */}
                    {activeTab === 'type' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Name for Signature
                                </label>
                                <input
                                    type="text"
                                    value={typedName}
                                    onChange={(e) => {
                                        setTypedName(e.target.value);
                                    }}
                                    onBlur={() => generateTypedSignature()}
                                    placeholder="Enter your name..."
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-brand-dark focus:ring-2 focus:ring-brand-green outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="block text-xs font-bold text-gray-700">Choose Script Style</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {SIGNATURE_FONTS.map((font) => (
                                        <button
                                            key={font.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedFont(font.fontFamily);
                                                setTimeout(generateTypedSignature, 10);
                                            }}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                selectedFont === font.fontFamily
                                                    ? 'border-brand-dark bg-emerald-50/50 ring-2 ring-brand-green/30 font-bold'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div
                                                className="text-xl sm:text-2xl text-[#1b365d] truncate select-none"
                                                style={{ fontFamily: font.fontFamily }}
                                            >
                                                {typedName || 'Alex Morgan'}
                                            </div>
                                            <span className="block text-[10px] text-gray-400 mt-1">{font.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Signature Preview Frame */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Live Document Preview
                            </span>
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={() => setPreviewUrl(null)}
                                    className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                                >
                                    <Trash2 size={12} />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>

                        <div className="h-24 bg-gray-50/90 rounded-xl border border-gray-200/80 flex items-center justify-center p-3 relative overflow-hidden">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Signature Preview"
                                    className="max-h-16 max-w-[280px] object-contain select-none"
                                />
                            ) : (
                                <div
                                    className="text-[34px] select-none text-[#1b365d] -rotate-1"
                                    style={{
                                        fontFamily: "'Alex Brush', 'Dancing Script', 'Caveat', cursive"
                                    }}
                                >
                                    {candidateName || 'Alex Morgan'}
                                </div>
                            )}
                            <div className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                                {previewUrl ? 'Uploaded / Custom Signature' : 'Default Fountain Pen Script'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/70">
                    <div>
                        {currentSignatureUrl && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 size={13} />
                                <span>Reset to Default</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-5 py-2 text-xs font-extrabold text-brand-dark bg-brand-green hover:bg-brand-greenHover rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                            <Check size={14} />
                            <span>Save Signature</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
