# OCR Parser Activation Guide

## ✅ OCR Support is Ready!

Tesseract.js has been installed and the OCR-enhanced parser code is ready.

## 🚀 Quick Activation (2 steps)

### Step 1: Update the import in your Onboarding component

Find where `parseResume` is imported and add progress tracking:

```typescript
// In components/Onboarding.tsx (or wherever resume upload happens)

// Add state for progress
const [uploadProgress, setUploadProgress] = useState(0);

// When calling parseResume, pass progress callback
const parsedData = await parseResume(file, (progress) => {
  setUploadProgress(progress);
  console.log('Parsing progress:', progress + '%');
});
```

### Step 2: Add the OCR functions to resumeParser.ts

Add these imports at the top of `utils/resumeParser.ts`:

```typescript
import Tesseract from 'tesseract.js';
```

Then add these two functions before the `parseWithAI` function:

```typescript
/**
 * Extract text using OCR (Tesseract.js)
 */
const extractTextWithOCR = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    console.log('Starting OCR extraction...');
    
    try {
        const imageUrl = URL.createObjectURL(file);
        let imagesToProcess: string[] = [];
        
        if (file.type === 'application/pdf') {
            imagesToProcess = await convertPDFToImages(file);
        } else {
            imagesToProcess = [imageUrl];
        }
        
        let allText = '';
        
        for (let i = 0; i < imagesToProcess.length; i++) {
            const result = await Tesseract.recognize(imagesToProcess[i], 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text' && onProgress) {
                        const baseProgress = 30 + (i / imagesToProcess.length) * 30;
                        const pageProgress = m.progress * (30 / imagesToProcess.length);
                        onProgress(Math.floor(baseProgress + pageProgress));
                    }
                }
            });
            
            allText += result.data.text + '\n\n';
        }
        
        imagesToProcess.forEach(url => {
            if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        
        return allText;
    } catch (error) {
        console.error('OCR failed:', error);
        throw new Error('OCR processing failed');
    }
};

/**
 * Convert PDF to images for OCR
 */
const convertPDFToImages = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageUrls: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
        
        imageUrls.push(URL.createObjectURL(blob));
    }
    
    return imageUrls;
};
```

### Step 3: Update parseResume function signature

Change the first line of `parseResume` to accept progress callback:

```typescript
export const parseResume = async (file: File, onProgress?: (progress: number) => void): Promise<Partial<ResumeData>> => {
```

Then add OCR fallback after PDF extraction (around line 16):

```typescript
if (file.type === 'application/pdf') {
    text = await extractTextFromPDF(file, onProgress);
    
    // NEW: Add OCR fallback for image-based PDFs
    if (text.trim().length < 100) {
        console.log('PDF has minimal text, trying OCR...');
        onProgress?.(30);
        const ocrText = await extractTextWithOCR(file, onProgress);
        if (ocrText.length > text.length) {
            text = ocrText;
        }
    }
}
```

## 🎨 Optional: Add Progress UI

In your upload component, show progress:

```tsx
{uploadProgress > 0 && uploadProgress < 100 && (
  <div className="mt-4">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-indigo-600 h-2 rounded-full transition-all"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
    <p className="text-sm text-gray-600 mt-2">
      {uploadProgress < 30 && "Reading document..."}
      {uploadProgress >= 30 && uploadProgress < 60 && "Scanning image (OCR)..."}
      {uploadProgress >= 60 && uploadProgress < 70 && "Validating..."}
      {uploadProgress >= 70 && "Analyzing with AI..."}
    </p>
  </div>
)}
```

## ✅ That's It!

OCR is now active! Test with:
1. A scanned PDF
2. A screenshot saved as PDF
3. A direct image upload (JPG/PNG)

---

**Need help?** Check `OCR_IMPLEMENTATION.md` for full details.
