# CV Architect - AI-Powered Resume Builder

An AI-powered resume builder and career architectural platform helping professionals create ATS-optimized CVs, generate cover letters, and track job applications.

A modern, professional resume builder with AI enhancement capabilities powered by Google Gemini.

## Features

✨ **AI-Powered Enhancements**
- **Smart Description Enhancement** - Automatically improve job descriptions with action verbs and quantifiable metrics
- **Professional Summary Optimization** - Generate compelling, ATS-optimized summaries
- **Job Match Optimization** - Tailor your entire resume to specific job descriptions
- **Achievement Generation** - Create impactful achievement statements from your experience

🎨 **Professional Templates**
- ATS-optimized resume templates
- Customizable fonts and typography
- Real-time preview
- Multi-page PDF support

📄 **PDF Generation**
- Clean, professional PDF output
- Proper page breaks and formatting
- Print-optimized layout

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AI Features (Optional)

To enable AI enhancement features, you need a Google Gemini API key:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```
3. Add your API key to `.env.local`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

**Note:** The app works without an API key, but AI enhancement features will be disabled.

### 3. Run the Development Server
```bash
npm run dev
```

## Using AI Features

### Enhance Job Descriptions
1. Navigate to the **Experience** tab
2. Fill in your role, company, and description
3. Click the **"Enhance with AI"** button next to the description field
4. The AI will rewrite your description with:
   - Strong action verbs
   - Quantifiable metrics
   - ATS-friendly keywords
   - Professional formatting

### Enhance Professional Summary
1. Go to the **Personal Details** tab
2. Write a basic summary
3. Click **"Enhance with AI"** next to Professional Summary
4. Get a compelling, keyword-rich summary optimized for ATS

### Job Match Optimization
1. Navigate to the **Job Match** tab
2. Paste the target job description
3. Click **"Analyze & Optimize Resume"**
4. Your entire resume will be tailored to match the job requirements

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Google Gemini AI** for enhancements
- **Lucide React** for icons

## Project Structure

```
cv-architect/
├── components/
│   ├── templates/          # Resume templates
│   ├── utils/              # Utility functions
│   │   ├── aiEnhancer.ts   # AI enhancement logic
│   │   └── pdfGenerator.ts # PDF generation
│   ├── Editor.tsx          # Main editor component
│   ├── FormSection.tsx     # Form inputs
│   ├── ResumePreview.tsx   # Live preview
│   └── AIEnhanceButton.tsx # AI button component
├── types.ts                # TypeScript definitions
└── App.tsx                 # Main app component
```

## Tips for Best Results

### Writing Descriptions
- Start with basic bullet points of what you did
- Include any numbers or metrics you remember
- Let AI enhance it with professional language

### Professional Summary
- Write 2-3 sentences about your background
- Mention your key skills
- AI will optimize it for ATS and impact

### Job Matching
- Paste the complete job description
- Include requirements, responsibilities, and qualifications
- AI will align your resume with the job posting

## Troubleshooting

### AI Features Not Working
- **Check API Key**: Ensure `VITE_GEMINI_API_KEY` is set in `.env.local`
- **Restart Dev Server**: After adding the API key, restart `npm run dev`
- **Check Console**: Open browser DevTools to see any error messages

### PDF Issues
- **Headers/Footers**: Uncheck "Headers and footers" in the print dialog
- **Multiple Pages**: Ensure content flows naturally; avoid fixed heights
- **Margins**: Adjust in print settings if needed

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
