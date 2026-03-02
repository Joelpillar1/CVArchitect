# Front-End Handover Guide: CV Architect

Welcome to CV Architect! Congratulations on acquiring this SaaS. This document is your technical compass. It details everything you need to know about the **Front-End** of the application—how it works, where everything is located, and how you or your developers can make changes to it.

## 1. What You Just Bought (The Front-End Perspective)

CV Architect is a highly interactive, Single-Page Application (SPA) built to feel like a native desktop editor. The core magic happens directly in the user's browser: from real-time resume previews to client-side PDF generation and OCR (Optical Character Recognition) for reading uploaded files.

The frontend connects to OpenAI to provide "magic" buttons that rewrite, tailor, and optimize the user's resume bullet points and summaries on the fly based on specific job descriptions. 

## 2. The Tech Stack

The front-end is built on a modern, lightning-fast stack that is easy to hire for:
*   **Framework:** React 19 driven by Vite (extremely fast local loading and builds).
*   **Language:** TypeScript (ensures the code is strictly typed, making it harder to break things accidentally).
*   **Styling:** Tailwind CSS (utility-first CSS meaning design changes are rapid and straightforward).
*   **Animations:** Framer Motion (used for all the smooth transitions, dropdowns, and the premium UI feel).
*   **PDF Generation:** `jspdf` and `html2pdf.js` (generates the final perfect PDF locally in the user's browser).
*   **Document Parsing:** `pdfjs-dist`, `mammoth`, and `tesseract.js` (for parsing Word docs, normal PDFs, and scanned PDFs via client-side OCR without needing an expensive backend server).

## 3. Where Everything Lives (Project Structure)

When you or your developer open the code, here are the most important folders in the root directory:

*   📂 **`components/`** - The heart of the app. This contains all the UI pieces:
    *   `LandingPage.tsx` - Your main marketing website. If you want to change the homepage copy, do it here.
    *   `Editor.tsx` & the `Sidebar` files - The main workspace where the user builds their resume.
    *   `*Form.tsx` files (e.g., `ExperienceForm.tsx`, `SummaryForm.tsx`) - The input form layout elements.
    *   `ResumePreview.tsx` - The live preview engine that renders the resume as they type.
    *   `PaywallModal.tsx` & `CreditPurchaseModal.tsx` - Your monetization UI using Whop Checkout.
*   📂 **`components/templates/`** - Contains the code for the 29+ different resume templates (e.g., Vanguard, Modern, Elite).
*   📂 **`pages/`** - Full-page views like your `Dashboard.tsx`, `BlogPage.tsx`, and `CoverLetterPage.tsx`.
*   📂 **`utils/`** - The engine room. Helper functions that do the heavy lifting:
    *   `resumeParserWithOCR.ts` - Script that reads data from uploaded resumes.
    *   `aiEnhancer.ts` / `pdfGenerator.ts` - Utilities for handling OpenAI feature calls and exporting PDFs.
*   📂 **`types.ts`** - The "dictionary" of the app. It defines exactly what a `ResumeData` object looks like (name, experience, skills, etc.).
*   📂 **`chrome-extension/`** - The complete codebase for the "Job Tailor" Chrome Extension that captures job postings online.

## 4. Key Mechanics: How it Actually Works

### The Live Editor Loop
When a user types their name in the form (e.g. `PersonalInfoForm.tsx`), it updates a central state object called `ResumeData`. The `ResumePreview.tsx` component is constantly watching this object. As soon as a letter is typed, the preview re-renders instantly, allowing the user to see their changes in real-time.

### AI Enhancements (OpenAI)
You will see `AIEnhanceButton.tsx` components sprinkled throughout the UI forms. When a user clicks "Enhance", the frontend packages the text they wrote, communicates with the OpenAI API integration, and replaces their text with the optimized, ATS-friendly version.

### PDF Export
We intentionally do not use an expensive server to generate PDFs. When the user clicks "Download", the `pdfGenerator.ts` script takes an exact snapshot of what is rendered in the `ResumePreview` DOM element and converts it into a high-quality PDF locally right then and there.

### The Freemium UI / Monetization
The app is built around a credit system to drive product-led growth. Users sign up and get free credits. If a user tries to click an AI button or download a premium functionality and their credit balance is 0, the `PaywallModal.tsx` is triggered, intercepting the action and prompting them to upgrade seamlessly via the integrated Whop SDK.

## 5. Pricing Plans & Tier Mechanics

The subscription configurations (managed in `utils/pricingConfig.ts`) are split into three core tiers to appeal to different users:

*   **Free (Guest Tier) - $0**
    *   **Limits:** 10 AI credits to try the system, 1 Resume Upload.
    *   **Features:** Access to basic templates, PDF exports (watermarked).
*   **Week Pass (Career Sprint) - $9.00 (One-Time)**
    *   **Ideal for:** Users needing a quick fix to apply for jobs immediately.
    *   **Limits:** Unlimited AI actions for 7 days.
    *   **Features:** Access to all 29+ templates, Cover Letter Generation, removes PDF watermarks, allows up to 10 resume pages, priority processing.
*   **Pro Monthly (Career Marathon) - $19.00 / mo**
    *   **Ideal for:** Long-term career strategists.
    *   **Limits & Features:** Same unrestricted access as the Week Pass, but billed on a recurring monthly cycle.

## 6. How to Make Common Changes

*   **Editing the Landing Page Copy:** Open `components/LandingPage.tsx`. It is standard React markup styled with Tailwind. Just search for the text you want to change and overwrite it.
*   **Changing Global Brand Colors:** Look at `tailwind.config.js` and `index.css`. This is where the primary brand colors and global styling variables are defined.
*   **Modifying a Resume Template:** Go to `components/templates/`. You can edit the Tailwind classes adjusting margins, fonts, and layouts for any specific resume template.
*   **Tweaking Pricing UI Details:** Open `components/LandingPage.tsx` (scroll to pricing section) or `components/PricingModal.tsx`.

## 7. How to Run It Locally

To fire up the app on your own computer and see your changes in real-time, just open your terminal in the project folder and run:
1.  `npm install` — (Installs all the front-end packages)
2.  `npm run dev` — (Starts the local development server)
3.  Open your browser to `http://localhost:5173`

*(Note: You will need an `.env` file containing the environment variables to make sure authentication and AI functions run properly. See `.env.example` to know what keys you need to paste in!)*
