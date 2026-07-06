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

We utilize a **Product-Led Growth (PLG)** strategy with a low-friction free tier and subscription upsells.

*   **Frictionless Sign-Up:** We use Google OAuth. One click and they are in the application.
*   **Foundation (Free) Tier:** Every new user gets **1 free AI-tailored resume** on the base template with a full download included.
    *   *Why this matters to you:* They experience the core value—the AI rewrite and a real downloadable resume—before hitting a paywall. The hook is "try before you pay," not a large credit bank.
*   **The Upsell:** When they need unlimited tailoring, premium templates, watermark-free exports, or cover letters, the Dodo Payments checkout flow opens from `PaywallModal` or the pricing page.

## 4. Pricing Plans & Buyer Personas

The platform operates on four tiers (one free, three paid subscriptions). Prices and copy are defined in `utils/pricingConfig.ts`.

### Tier 1: Foundation (Free)
*   **The Hook:** 1 AI-tailored resume, base template, full download.
*   **The Catch:** Limited to one tailored pass; premium templates and unlimited AI are locked behind paid plans.

### Tier 2: Sprint — $2.99/week
*   **The Target Persona:** The "urgent applicant." They have applications due this week and need unlimited power now.
*   **What They Get:** Unlimited AI tailoring, all templates, unlimited downloads, cover letters, priority processing. Renews weekly; cancel anytime.
*   **Marketing Angle:** "Less than a coffee per week for unlimited resume power while you're actively applying."

### Tier 3: Build — $9.99/month *(Start here — highlighted plan)*
*   **The Target Persona:** The active job hunter running a multi-week search.
*   **What They Get:** Same unlimited access as Sprint, on a monthly subscription. Best default for ongoing searches.
*   **Marketing Angle:** "The plan most job seekers choose—unlimited tailoring for the length of your search."

### Tier 4: Blueprint Pass — $29 / 3 months
*   **The Target Persona:** Someone in a focused career transition (pivot, relocation, senior move) who wants a longer runway without thinking about weekly renewals.
*   **What They Get:** Unlimited access for a full quarter. Renews every 3 months; cancel anytime.
*   **Marketing Angle:** "One price, three months of unlimited career architecture."

## 5. Where to Find Marketing Levers in the App

If you are working with a developer or designer to tweak the marketing assets within the app, here is where those things live:

*   **Landing Page Copy & Hero Text:** `components/LandingPage.tsx`
*   **Shared Pricing Cards:** `components/PricingPlans.tsx` (used on landing and pricing page)
*   **Pricing Page & Modal:** `components/PricingPage.tsx`, `components/PricingModal.tsx`
*   **Plan prices, names, and features (source of truth):** `utils/pricingConfig.ts`

## 6. Immediate Strategy Recommendations

1.  **Optimize the First Session:** Free users get one tailored resume—ensure onboarding pushes them through upload → job match or enhance → download so they feel the "Aha!" moment before the paywall.
2.  **A/B Test Paywall Copy:** Sprint ($2.99/week) vs Build ($9.99/mo) vs Blueprint ($29/quarter) targets different urgency and commitment levels. Test which message converts best at zero credits or premium feature gates.
3.  **Lead with Build:** The app highlights Build as "Start here"; align landing page and ad creative with monthly unlimited as the default recommendation.
