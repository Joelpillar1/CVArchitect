# Marketer's Guide: CV Architect

Welcome to **CV Architect**! This document is designed specifically for marketers and growth strategists taking over the platform. It strips away the complex code jargon and focuses purely on what this product is, its core value proposition, the features you have at your disposal to sell, the existing funnels, and your pricing levers.

## 1. The Core Value Proposition (What Are We Selling?)

**CV Architect** is an AI-powered "career architectural" platform. Instead of users spending hours wrestling with Microsoft Word templates and struggling to think of the right action verbs, CV Architect does it for them instantly.

**The Pitch:** "Stop guessing what recruiters want. Paste the job description, click a button, and our AI will rewrite your resume to exactly match the role in a beautiful, ATS-optimized layout you can download in seconds."

## 2. Key Selling Features (Your Marketing Arsenal)

These are the "Aha!" features you should highlight in your ad copy, TikToks, and landing pages:

*   **The "Job Match" Engine:** This is the killer feature. Users paste a target job description into the app. The AI scans their resume and the job description, gives a match score, and then actively rewrites their bullets to align perfectly with the target role's keywords.
*   **One-Click AI Enhancements:** Users type a basic, boring sentence like "I managed a team of people." They click the "Enhance" button, and OpenAI instantly rewrites it to: "Directed a cross-functional team of 15 personnel, improving operational efficiency by 20%."
*   **29+ Pro-Level Templates:** We aren't just a text generator. The app provides 29 highly customizable, modern, and traditional ATS-friendly layouts.
*   **Works With Old Resumes (OCR Tech):** Unlike competitors where users must type everything manually, our app can "read" old, messy PDFs, or even screenshots of resumes, extracting the text instantly so users can start editing rather than typing.
*   **Cover Letter Generator:** A premium feature that reads the user's now-optimized resume, reads the target job description, and drafts a custom, highly relevant cover letter.


## 3. Onboarding & The Freemium Funnel

We utilize a **Product-Led Growth (PLG)** strategy heavily reliant on a credit system.

*   **Frictionless Sign-Up:** We use Google OAuth. One click and they are in the application.
*   **The "10 Credit" Magnet:** Every new user gets **10 Free AI Credits**. 
    *   *Why this matters to you:* 10 credits is carefully calculated. It gives them enough usage to upload their resume, get an AI analysis, and rewrite 3-4 bullet points. They get to experience the core value (the magic of the AI rewrite) *before* hitting a paywall.
*   **The Upsell:** As soon as they hit 0 credits or try to access a premium feature (like removing the watermark from their PDF or keeping a generated cover letter), our integrated Whop checkout paywall beautifully slides in.

## 4. Pricing Plans & Buyer Personas

The platform operates on three pricing tiers, designed to capture different types of job seekers:

### Tier 1: Guest Tier (Free)
*   **The Hook:** 10 AI credits to try the system, 1 Resume Upload.
*   **The Catch:** PDFs have a watermark, access is restricted to basic templates, and advanced AI features are locked.

### Tier 2: Career Sprint - $9.00 (One-Time)
*   **The Target Persona:** The "Desperate Searcher." They need a resume *tonight* because the application closes tomorrow.
*   **What They Get:** 7 Days of unlimited AI actions, all 29+ templates, no watermarks, Cover Letter generation, and priority processing.
*   **Marketing Angle:** "Skip the monthly subscription. For less than a coffee and a sandwich, get unlimited power for the week you actually need it."

### Tier 3: Career Marathon - $19.00 / mo
*   **The Target Persona:** The strategic job hunter in an active, long-term search (e.g., seniors, execs, or pivoting industries).
*   **What They Get:** The same unrestricted access as the Week Pass, but on a recurring monthly cycle.

## 5. Where to Find Marketing Levers in the App

If you are working with a developer or designer to tweak the marketing assets within the app, here is where those things live:

*   **Landing Page Copy & Hero Text:** Located in `components/LandingPage.tsx`.
*   **Pricing Page & Modal Copy:** Located in `components/PricingPage.tsx` and `components/PricingModal.tsx`.
*   **The Core Pricing Logic (The prices themselves):** Controlled globally in `utils/pricingConfig.ts`.

## 6. Immediate Strategy Recommendations


1.  **Optimize the First 5 Minutes:** Since users get 10 free credits, track what they do with them. We want to ensure their very first credit is spent on their biggest "pain point" (likely rewriting their Summary or a job bullet) so they feel maximum value right away.
2.  **A/B Test the Paywall Copy:** The $9 "Sprint" vs. the $19 "Marathon" is a unique pricing strategy. Test the messaging when they hit 0 credits to ensure it emphasizes the speed and low commitment of the $9 pass.
