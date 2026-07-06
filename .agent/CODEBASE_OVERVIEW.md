# CVArchitect - Codebase Overview

**Last Updated:** January 18, 2026

## 📋 Project Summary

**CVArchitect** is an AI-powered resume builder and career architectural platform that helps professionals create ATS-optimized CVs, generate cover letters, and track job applications. The application uses Google Gemini AI for intelligent resume enhancement and is built as a modern web application with React, TypeScript, and Supabase.

---

## 🏗️ Architecture Overview

### **Tech Stack**
- **Frontend:** React 19.2.0 + TypeScript + Vite
- **Styling:** Tailwind CSS 3.4.18
- **Backend/Auth:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI:** Google Gemini AI (via Supabase Edge Functions)
- **Routing:** React Router DOM 7.10.1
- **PDF Generation:** jsPDF + html2pdf.js
- **OCR:** Tesseract.js + Mammoth (for resume parsing)
- **Animations:** Framer Motion 12.23.25
- **Icons:** Lucide React

### **Deployment**
- **Hosting:** Vercel
- **Database:** Supabase Cloud
- **Environment:** Production URL: https://cvarchitect.app

---

## 📁 Project Structure

```
L:\CVArchitect/
├── components/              # React components
│   ├── templates/          # Resume templates (17 templates)
│   ├── cover-letters/      # Cover letter components
│   └── utils/              # Component utilities
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Authentication state
│   └── ToastContext.tsx    # Toast notifications
├── services/               # Backend service integrations
│   ├── aiService.ts        # AI/Gemini integration
│   ├── subscriptionService.ts  # Subscription management
│   ├── resumeService.ts    # Resume CRUD operations
│   ├── profileService.ts   # User profile management
│   ├── coverLetterService.ts   # Cover letter operations
│   └── versionService.ts   # Version control
├── utils/                  # Utility functions
│   ├── pricingConfig.ts    # Pricing plans configuration
│   ├── subscriptionManager.ts  # Subscription logic
│   ├── resumeParser.ts     # Resume parsing/OCR
│   └── templateUtils.ts    # Template helpers
├── types/                  # TypeScript definitions
│   └── pricing.ts          # Pricing types
├── supabase/              # Database schema & migrations
│   ├── schema.sql          # Main database schema
│   ├── functions/          # Edge functions
│   └── *.sql              # Migration files
├── i18n/                  # Internationalization
├── lib/                   # Library configurations
├── public/                # Static assets
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
├── types.ts               # Core type definitions
└── *.md                   # Documentation files
```

---

## 🗄️ Database Schema

### **Tables (7 total)**

1. **profiles** - User profile information
   - `id` (uuid, FK to auth.users)
   - `full_name`, `avatar_url`, `website`
   - `created_at`, `updated_at`

2. **subscriptions** - User subscription data
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `plan_id` (text: 'free', 'sprint', 'build', 'blueprint'; legacy: 'week_pass', 'pro_monthly')
   - `credits` (integer; Foundation starts at 1, paid plans use 999999)
   - `billing_cycle`, `subscription_start`, `subscription_end`
   - `is_active` (boolean)

3. **resumes** - Saved resume data
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `title` (text)
   - `content` (jsonb) - Full ResumeData object
   - `created_at`, `updated_at`

4. **resume_versions** - Version history
   - `id` (uuid)
   - `resume_id` (uuid, FK to resumes)
   - `version_number` (integer)
   - `content` (jsonb)
   - `created_at`

5. **cover_letters** - Saved cover letters
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `title`, `job_title`, `company_name`
   - `content` (jsonb)
   - `created_at`, `updated_at`

6. **usage_logs** - AI feature usage tracking
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `action` (text)
   - `credits_cost` (integer)
   - `remaining_credits` (integer)
   - `metadata` (jsonb)
   - `created_at`

7. **billing_history** - Payment transactions
   - `id` (uuid)
   - `user_id` (uuid, FK to auth.users)
   - `amount`, `currency`, `description`
   - `status`, `payment_method`, `transaction_id`
   - `created_at`

### **Key Functions**
- `handle_new_user()` - Auto-creates profile + subscription on signup
- `delete_user_account()` - RPC function for account deletion

---

## 💰 Pricing & Subscription Model

### **Plans**

1. **Foundation** (`free`)
   - 1 starting credit (one AI-tailored resume)
   - Base template, full download
   - PDF may include watermark; premium templates locked

2. **Sprint** (`sprint`) - $2.99/week
   - Unlimited AI features
   - All templates, watermark-free export
   - Renews weekly

3. **Build** (`build`) - $9.99/month — **highlighted default**
   - Same unlimited access as Sprint
   - Monthly renewal

4. **Blueprint Pass** (`blueprint`) - $29/quarter
   - Same unlimited access
   - Renews every 3 months

**Legacy IDs:** `week_pass` (Sprint), `pro_monthly` (Build) — still honored for existing subscribers.

### **Credit System**
- Foundation users: 1 credit (no monthly reset)
- Paid users: Unlimited (999999 credits)
- Credit costs (Foundation only):
  - Full rewrite: 1 credit
  - CV regeneration: 1 credit
  - Resume upload: 1 credit
  - Cover letter: 1 credit
  - Bullet optimization: 1 credit

### **Templates**
- **Free Templates (3):** free, simplepro, minimalist
- **Basic Templates (7):** + vanguard, elevate, prime, impact
- **All Templates (17):** + dev, elite, apex, modern, executive, classic, wonsulting, styled, smart, elegant

---

## 🎨 Core Features

### **1. Resume Builder**
- **17 Professional Templates** - ATS-optimized designs
- **Live Preview** - Real-time editing with zoom controls
- **Multi-page Support** - Automatic page breaks
- **PDF Export** - Clean, professional output
- **Version History** - Track changes over time
- **Resume Parsing** - Upload existing resumes (OCR support)

### **2. AI Enhancement**
All AI features use Google Gemini via Supabase Edge Functions:

- **Smart Description Enhancement** - Improve job descriptions with action verbs
- **Professional Summary Optimization** - Generate ATS-optimized summaries
- **Job Match Optimization** - Tailor entire resume to job descriptions
- **Achievement Generation** - Create impactful achievement statements
- **Bullet Point Optimization** - Enhance individual bullet points
- **Cover Letter Generation** - AI-powered cover letters

**AI Enhancement Rules:**
- Strategic quantification (max 1 metric per role)
- Contextual metrics over percentages
- Concrete outcomes over vague improvements
- Tone calibration by seniority level
- Human-sounding, not AI-generated
- See `AI_ENHANCEMENT_RULES.md` for full guidelines

### **3. Resume Analytics**
- **ATS Score** - Analyze resume completeness
- **Job Match Score** - Compare resume to job description
- **Section Analysis** - Breakdown by section
- **Keyword Matching** - Track relevant keywords

### **4. Cover Letters**
- AI-generated based on resume + job description
- Multiple templates
- Save and manage multiple letters
- PDF export

### **5. User Management**
- Email/password authentication
- Google OAuth integration
- Password reset flow
- Account deletion (with RPC function)
- Profile management

---

## 🔑 Key Components

### **Main Application Flow**

1. **App.tsx** (1237 lines)
   - Main application state management
   - Routing logic (Screen enum)
   - Subscription management
   - AI action handling
   - Save/load resume logic

2. **Editor.tsx** (468 lines)
   - Main editing interface
   - Three-panel layout (left sidebar, preview, right sidebar)
   - Template rendering
   - PDF download
   - Mobile responsive

3. **LandingPage.tsx** (50,705 bytes)
   - Marketing page
   - Feature showcase
   - Pricing display
   - Call-to-action

### **Form Components**
- `PersonalInfoForm.tsx` - Name, contact, summary
- `ExperienceForm.tsx` - Work experience with AI enhancement
- `EducationForm.tsx` - Education history
- `SkillsForm.tsx` - Skills list
- `ProjectsForm.tsx` - Projects section
- `LeadershipForm.tsx` - Leadership experience
- `CertificationsForm.tsx` - Certifications
- `AchievementsForm.tsx` - Key achievements
- `JobMatchForm.tsx` - Job description matching
- `AdditionalInfoForm.tsx` - Custom sections

### **Template Components**
All templates in `components/templates/`:
- FreeTemplate, SimpleProTemplate, MinimalistTemplate
- VanguardTemplate, ElevateResume, PrimeProfile, ImpactTemplate
- DevTemplate, ModernTemplate, ExecutiveTemplate, ClassicTemplate
- EliteTemplate, ApexTemplate, WonsultingTemplate
- StyledTemplate, SmartTemplate, ElegantTemplate

### **Utility Components**
- `DesignCustomization.tsx` - Font, color, spacing controls
- `AnalyticsDashboard.tsx` - Resume analytics
- `VersionHistory.tsx` - Version control
- `Settings.tsx` - User settings & account management
- `PaywallModal.tsx` - Upgrade prompts
- `PricingModal.tsx` - Pricing display

---

## 🔐 Authentication Flow

1. **Sign Up**
   - Email/password or Google OAuth
   - Trigger: `handle_new_user()` function
   - Auto-creates profile + Foundation subscription (1 credit)

2. **Sign In**
   - Email/password or Google OAuth
   - Session managed by Supabase Auth
   - AuthContext provides user state

3. **Password Reset**
   - Email-based reset flow
   - Redirect to `/reset-password`

4. **Account Deletion**
   - RPC call to `delete_user_account()`
   - Cascading deletion of all user data

---

## 🚀 AI Integration

### **Architecture**
- AI requests go through Supabase Edge Functions
- API keys stored securely on backend
- Edge function: `ai-generate`

### **Service: aiService.ts**
```typescript
callAIFunction(request: AIRequest): Promise<string>
callAIText(prompt: string, model?: string, temperature?: number): Promise<string>
callAIJSON(prompt: string, model?: string, temperature?: number): Promise<any>
```

### **AI Actions**
- `ai_rewrite` - Full description rewrite
- `cv_regeneration` - Regenerate entire CV
- `cover_letter` - Generate cover letter
- `bullet_optimization` - Optimize single bullet point

### **Credit Deduction**
Handled in `App.tsx` → `handleAIAction()`:
1. Check if user has credits
2. Show paywall if insufficient
3. Deduct credits after successful AI call
4. Log usage in `usage_logs` table

---

## 📊 Data Models

### **ResumeData (types.ts)**
```typescript
interface ResumeData {
  // Personal Info
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  summary: string;
  
  // Content
  experience: Experience[];
  education: Education[];
  skills: string;
  certifications: Certification[];
  projects?: Project[];
  leadership?: Experience[];
  additionalInfo?: AdditionalInfoItem[];
  keyAchievements?: string;
  jobDescription?: string;
  
  // Design
  template?: TemplateType;
  font?: string;
  accentColor?: string;
  fontSizes?: { header, jobTitle, sectionTitle, body };
  lineHeight?: number;
  sectionGap?: number;
  margins?: { horizontal, vertical };
  headerAlignment?: 'left' | 'center' | 'right';
  sectionOrder?: string[];
  
  // Metadata
  version_number?: number;
  version_name?: string | null;
}
```

### **UserSubscription (types/pricing.ts)**
```typescript
interface UserSubscription {
  userId: string;
  planId: PlanId; // 'free' | 'sprint' | 'build' | 'blueprint'
  credits: number;
  billingCycle?: BillingCycle;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  isActive: boolean;
  usageHistory: UsageRecord[];
}
```

---

## 🎯 Key Workflows

### **1. Create New Resume**
1. User clicks "Get Started" or "New Resume"
2. Navigate to Editor screen
3. Fill in forms (PersonalInfo, Experience, etc.)
4. Select template from Templates tab
5. Customize design in Design tab
6. Download PDF or Save to account

### **2. AI Enhancement**
1. User enters text in form field
2. Clicks "Enhance with AI" button
3. `handleAIAction()` checks credits
4. If sufficient, call `aiService.callAIText()`
5. Deduct credits, log usage
6. Update form field with AI result

### **3. Job Match**
1. User pastes job description in JobMatch tab
2. Clicks "Analyze & Optimize Resume"
3. AI analyzes job description
4. AI rewrites resume sections to match
5. Updates entire ResumeData object
6. Shows match score in analytics

### **4. Save Resume**
1. User clicks Save (update) or Save As (new)
2. Call `resumeService.saveResume()` or `createResume()`
3. Store in Supabase `resumes` table
4. Create version entry in `resume_versions`
5. Update local state

### **5. Upgrade Subscription**
1. User clicks upgrade button
2. `handleSelectPlan()` is called with plan ID
3. Updates Supabase `subscriptions` table directly
4. Credits reset to plan limits
5. User sees success message

**Note:** Currently no external payment provider is integrated. Plan upgrades update the database directly. You'll need to integrate a payment provider like Stripe, Paddle, or LemonSqueezy for production use.


---

## 🔧 Configuration Files

### **Environment Variables (.env)**
```
VITE_SUPABASE_URL=https://lxtvqfqldhdpbuvxvdjj.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```


### **Vite Config**
- Port: 5173
- Host: 0.0.0.0
- Alias: `@` → project root

### **Tailwind Config**
- Custom colors, fonts, animations
- Responsive breakpoints
- Print-specific styles

---

## 📱 Responsive Design

### **Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### **Mobile Optimizations**
- Bottom navigation bar for editor
- Collapsible sidebars
- Touch-friendly controls
- Responsive font sizes
- Optimized preview scaling

---

## 🧪 Testing & Development

### **Development Server**
```bash
npm run dev  # Starts on http://localhost:5173
```

### **Build**
```bash
npm run build  # Production build
npm run preview  # Preview production build
```

### **Key Scripts**
- `update-templates.ps1` - PowerShell script for template updates

---

## 📚 Documentation Files

- `README.md` - Main project documentation
- `AI_ENHANCEMENT_RULES.md` - AI rewrite guidelines
- `AI_REWRITE_SETUP.md` - AI integration setup
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `SUPABASE_SETUP.md` - Database setup
- `GOOGLE_OAUTH_SETUP.md` - OAuth configuration
- `ACCOUNT_DELETION_GUIDE.md` - Account deletion flow
- `FREE_CREDITS_IMPLEMENTATION.md` - Credit system docs
- `SCORING_UPDATE.md` - Analytics scoring logic
- `ROUTING_GUIDE.md` - Routing documentation

---

## 🐛 Known Issues & Considerations

### **From Conversation History:**

1. **Dynamic Imports** - Fixed issues with template imports
2. **Editor Loading** - Resolved component loading issues
3. **Account Deletion** - Implemented safe RPC function
4. **Paywall Modal** - Fixed visibility issues
5. **Mobile Responsiveness** - Optimized editor for mobile
6. **ATS Scoring** - Refined to be more achievable (80% for complete resume)

### **Current State:**
- Application is stable and functional
- All major features implemented
- Production-ready on Vercel
- Active Supabase integration

---

## 🔄 Recent Updates

### **Latest Changes (from conversation history):**
1. Refined experience input with individual bullet points
2. Fixed account deletion to only delete user's own data
3. Implemented Mindora web theme (different project?)
4. Updated AI rewrite rules for human-sounding content
5. Created standalone legal & pricing pages
6. Optimized editor responsiveness for mobile

---

## 🎓 Learning Resources

### **Key Technologies to Understand:**
1. **React 19** - Latest React features
2. **TypeScript** - Type safety
3. **Supabase** - Backend-as-a-Service
4. **Tailwind CSS** - Utility-first CSS
5. **React Router** - Client-side routing
6. **jsPDF** - PDF generation
7. **Gemini AI** - Google's AI model

### **Project-Specific Patterns:**
- Context-based state management (Auth, Toast)
- Service layer for backend calls
- Component-based template system
- Credit-based feature gating
- RLS (Row Level Security) for data access

---

## 🚦 Getting Started (for New Developers)

1. **Clone & Install**
   ```bash
   cd L:\CVArchitect
   npm install
   ```

2. **Set Up Environment**
   - Copy `.env.example` to `.env`
   - Add Supabase credentials
   - Add Dodo Payments secrets to Supabase (see `DODO_PAYMENTS_SETUP.md`)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Key Entry Points:**
   - `index.tsx` - App initialization
   - `App.tsx` - Main application logic
   - `components/Editor.tsx` - Resume editor
   - `components/LandingPage.tsx` - Marketing page

5. **Database Setup:**
   - Run `supabase/schema.sql` in Supabase SQL editor
   - Set up Edge Functions for AI

---

## 📞 Support & Contact

- **Production URL:** https://cvarchitect.app
- **Supabase Project:** lxtvqfqldhdpbuvxvdjj
- **Payment Processing:** Direct database updates (no external payment provider currently integrated)

---

**End of Codebase Overview**

