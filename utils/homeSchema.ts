/**
 * Homepage-only structured data.
 *
 * These schemas describe content that is actually visible on the homepage, so
 * they are injected by the homepage component instead of living in index.html.
 * Shell-level schema would be copied onto every URL, where the marked-up
 * questions are not on the page, which breaks Google's FAQ/HowTo guidelines.
 */

export const HOME_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Cvarchitect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cvarchitect (cvarchitect.app) is an AI resume builder that tailors your resume to each job description, scores it against ATS parsers, writes a matching cover letter, and prepares interview questions in one workflow."
      }
    },
    {
      "@type": "Question",
      "name": "Is Cvarchitect free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Cvarchitect's Foundation tier includes 1 AI-tailored resume on sign-up, no credit card required. Paid plans are Build at $10 per month (cancel anytime) and Lifetime at $99 as a one-time payment."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI resume rewriter work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You paste your current resume and a job description. Cvarchitect's AI analyses the job requirements, identifies missing keywords and skills, then rewrites your resume bullets, summary and skills section to match, significantly improving your ATS compatibility score."
      }
    },
    {
      "@type": "Question",
      "name": "What is an ATS and why does it matter for my resume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS (Applicant Tracking System) is software used by 99% of Fortune 500 companies to filter resumes before a human reads them. Studies show 75% of resumes are rejected by ATS before reaching a recruiter. Cvarchitect optimises your resume to pass these filters by matching the exact keywords and phrases employers use."
      }
    },
    {
      "@type": "Question",
      "name": "How is Cvarchitect different from Resume.io, Zety, or Kickresume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional resume builders provide templates but don't tailor content to specific jobs. Cvarchitect goes further: it rewrites your resume content for each specific job description, scores the result against ATS parsing rules with actionable feedback, generates AI cover letters personalised to both the role and your background, prepares interview questions and STAR answer outlines, and exports clean, ATS-safe PDF and DOCX files."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a resume with Cvarchitect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most users complete a tailored, ATS-optimised resume in 5–15 minutes. Uploading an existing resume and running an AI rewrite for a specific job takes about 2–3 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Does Cvarchitect work for all industries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Cvarchitect works for any industry and role level including technology, finance, marketing, healthcare, engineering, law, education, sales, and operations. It has been used by professionals from students to senior executives across 50+ countries."
      }
    },
    {
      "@type": "Question",
      "name": "Is the exported resume ATS-compatible?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All PDFs exported from Cvarchitect are text-based (not image-based) and formatted to be parseable by all major ATS platforms including Workday, Greenhouse, Lever, Taleo, iCIMS, and SmartRecruiters."
      }
    },
    {
      "@type": "Question",
      "name": "What AI model powers Cvarchitect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cvarchitect is powered by Google Gemini, one of the most capable large language models available, ensuring high-quality, nuanced resume rewrites and career content generation."
      }
    },
    {
      "@type": "Question",
      "name": "Can Cvarchitect generate a cover letter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Cvarchitect generates a full, personalised cover letter in seconds. It opens with a role-specific hook, highlights your most relevant experience, and closes with a confident call to action, ready to copy and send."
      }
    },
    {
      "@type": "Question",
      "name": "Does Cvarchitect include a live AI mock interview?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Cvarchitect prepares likely interview questions and STAR answer outlines from the tailored resume and job description, but it does not run a live AI mock interview. Rezi includes one if that is the feature you need."
      }
    }
  ]
};

export const HOME_HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Build an ATS-Optimised Resume with Cvarchitect",
  "description": "A step-by-step guide to creating an ATS-friendly, job-tailored resume using Cvarchitect's AI resume builder.",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Sign up for free",
      "text": "Create a free account at cvarchitect.app/signup. No credit card required. Your free Foundation plan includes 1 AI-tailored resume immediately.",
      "url": "https://cvarchitect.app/signup"
    },
    {
      "@type": "HowToStep",
      "name": "Upload or build your resume",
      "text": "Upload your existing resume as a PDF or DOCX, or use the drag-and-drop editor to build one from scratch using one of 10+ professional templates."
    },
    {
      "@type": "HowToStep",
      "name": "Paste the job description",
      "text": "Copy and paste the full job description for the role you are applying to into Cvarchitect."
    },
    {
      "@type": "HowToStep",
      "name": "Run the AI Resume Rewrite",
      "text": "Click 'Rewrite Resume'. The AI rewrites your resume in seconds, adding matching keywords, stronger action verbs, and quantified achievements aligned to the job description."
    },
    {
      "@type": "HowToStep",
      "name": "Check your ATS Score",
      "text": "Review your ATS compatibility score (aim for 80+). See exactly which keywords were added and get suggestions for any remaining gaps."
    },
    {
      "@type": "HowToStep",
      "name": "Generate a cover letter",
      "text": "Click 'Generate Cover Letter' to get a personalised cover letter for the same role in under 30 seconds."
    },
    {
      "@type": "HowToStep",
      "name": "Export as PDF and apply",
      "text": "Export your tailored, ATS-optimised resume as a clean PDF. Submit it to any job board or recruiter with confidence."
    }
  ]
};
