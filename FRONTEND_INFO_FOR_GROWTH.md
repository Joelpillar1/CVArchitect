# CV Architect - Frontend Product Overview for Growth Strategy

This document provides a comprehensive breakdown of the **CV Architect** front-end application tailored for a Growth Strategist. It highlights the user-facing features, client-side technologies, acquisition assets, and UI monetization mechanics designed to convert free users into paid subscribers.

---

### 1. Executive Summary
**CV Architect** is an advanced, AI-powered React web application that helps professionals build ATS-optimized resumes and cover letters in minutes. Powered by the OpenAI API, the front-end is designed to solve the "blank-page syndrome," providing dynamic, real-time feedback and a hyper-customizable editing experience entirely within the browser.

### 2. Core Frontend Value Proposition & Features

*   **Real-Time Browser Editor & Preview:**
    *   **29+ Pro-Level Templates:** The app features an expansive library of ATS-friendly templates.
    *   **Deep Customization:** Users have granular control over typography, line heights, margins, and accent colors without leaving the page.
    *   **Live PDF Generation:** Native, high-quality client-side PDF export utilizing `jspdf` and `html2pdf.js` to ensure the exported document identically matches the live browser preview.
*   **Integrated Client-Side AI (Powered by OpenAI):**
    *   **One-Click Enhancements:** Buttons embedded directly into form fields (e.g., job descriptions, professional summaries) trigger OpenAI to rewrite, quantify, and optimize bullets instantly.
    *   **Job Match Tab:** An intelligent side-panel where users paste a job description. The frontend interactively scores and tailors their entire resume to match the target role's keywords.
*   **Advanced In-Browser Document Parsing:**
    *   **Smart Uploads:** To reduce onboarding friction, the app handles document extraction locally before using AI. 
    *   **Client-Side OCR:** Built-in `Tesseract.js` allows the frontend to read text directly from old scanned PDFs, screenshots, or low-quality images.

### 3. Growth & Acquisition Assets

*   **The CVArchitect Job Tailor (Chrome Extension):**
    *   **Functionality:** A dedicated browser extension that captures job postings natively on sites like LinkedIn, Indeed, Glassdoor, Greenhouse, and Lever.
    *   **Growth Angle:** Once a job is captured, it directly opens the CV Architect web app and automatically populates the "Job Match" tab. This acts as a massive top-of-funnel acquisition channel, converting passive job browsing into active resume tailoring.
*   **Seamless Onboarding & High-Conversion UI:**
    *   Frictionless access through sleek, modern forms and Google OAuth.
    *   **Gamified Progress:** Users see a direct reflection of their resume optimization progress, reinforcing the "Aha!" moment very early in the user journey.

### 4. UI Monetization & Freemium Mechanics

The application uses a **try-before-you-pay** free tier with **Dodo Payments** subscriptions for upgrades.

*   **Foundation (Free) — Product-Led Growth Hook:**
    *   New users get **1 free AI-tailored resume** on the base template with a full download.
    *   *Strategic intent:* Users experience real tailoring and a downloadable result before any paywall—not a large credit bank they must ration.
*   **Dodo Checkout Integration:**
    *   **In-App Paywalls:** `PaywallModal.tsx` and `PricingModal.tsx` call `dodoPaymentsService.ts`, which hits the Supabase `create-checkout-session` Edge Function and redirects to Dodo hosted checkout.
    *   **Paid tiers:** Sprint ($2.99/week), Build ($9.99/mo, highlighted), Blueprint Pass ($29/quarter)—all unlimited AI and templates.

### 5. Frontend Technology Foundation

From a marketing strategy perspective, the technology stack ensures that the application is extremely fast, highly interactive, and visually premium:

*   **Core Framework:** React 19, TypeScript, and Vite.
*   **Styling & UI:** Tailwind CSS for a sleek, modern, and perfectly responsive design grid.
*   **Animations:** Framer Motion enables smooth page transitions, micro-interactions, and premium UI feedback, crucial for establishing brand trust and higher perceived value.
*   **Document Generation:** `jspdf` and `pdfjs-dist` handle robust local PDF parsing and uncompromised PDF rendering.

### 💡 Strategy Takeaways
1.  **Market the Chrome Extension:** Push the Chrome Extension heavily on LinkedIn and social channels. Integrating tightly into the user's active job search loop significantly reduces Customer Acquisition Cost (CAC) compared to marketing a standalone resume builder.
2.  **Optimize the Foundation funnel:** Free users get one tailored resume—guide them through upload → job match → download so they hit the paywall only after experiencing real value.
3.  **Lead with Build:** The app highlights Build ($9.99/mo) as the default paid tier; align ads and landing copy with monthly unlimited for active job searches.
4.  **Leverage the Premium Feel:** With Framer Motion animations and high-fidelity templates, position the product as an elite career tool—not a clunky web resume generator.
