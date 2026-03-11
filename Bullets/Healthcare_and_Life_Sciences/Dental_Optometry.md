# Dental / Optometry

**Industry ID:** `dental-optometry` | **Prefix:** `DENT` | **Target:** 250 bullets

---

### DENT-0001
**Role:** dentist | **Theme:** patient-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** dental care, restorative dentistry, comprehensive exam, treatment planning, patient experience, dental practice

**Scope:** a patient panel of {patients} patients per day across {procedures} procedure categories including restorative, preventive, and cosmetic dentistry
**Result:** achieving a {nps} Net Promoter Score and increasing case acceptance rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Managed {patients} patients daily across {procedures} procedure categories, achieving a {nps} NPS and growing case acceptance from {before}% to {after}%.
- **B (Result-first):** Achieved a {nps} NPS and grew case acceptance from {before}% to {after}% by managing {patients} daily patients across {procedures} procedure categories.
- **C (Impact-led):** Reached {nps} NPS and grew case acceptance from {before}% to {after}%; managed {patients} daily patients across {procedures} procedure categories including restorative, preventive, and cosmetic dentistry.
- **D (Concise):** Managed {patients} patients/day across {procedures} categories, {nps} NPS, case acceptance from {before}% to {after}%.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{procedures}`: 5 to 12, step 1 (integer)
  - `{nps}`: 60 to 90, step 5 (integer)
  - `{before}`: 40 to 60, step 5 (percentage)
  - `{after}`: 65 to 85, step 5 (percentage)

### DENT-0002
**Role:** dental-office-manager | **Theme:** practice-operations | **Seniority:** mid | **Verb Context:** operations
**Keywords:** dental practice management, scheduling, billing, collections, revenue cycle, staff management

**Scope:** day-to-day operations for a {provider}-dentist practice with {staff} staff and {patients}K annual patient visits, overseeing scheduling, billing, and ${revenue}K monthly revenue cycle
**Result:** increasing collections rate from {before}% to {after}% and reducing schedule no-show rate from {no_show_before}% to {no_show_after}%

**Variations:**
- **A (Standard):** Managed operations for a {provider}-dentist practice with {staff} staff and {patients}K annual visits, growing collections from {before}% to {after}% and cutting no-show rate from {no_show_before}% to {no_show_after}%.
- **B (Result-first):** Grew collections from {before}% to {after}% and cut no-show rate from {no_show_before}% to {no_show_after}% by managing operations for a {provider}-dentist, {staff}-staff practice.
- **C (Impact-led):** Improved collections from {before}% to {after}% and cut no-shows from {no_show_before}% to {no_show_after}%; managed operations for a {provider}-dentist, {staff}-staff practice with {patients}K annual visits.
- **D (Concise):** Managed {provider}-dentist practice with {staff} staff and {patients}K visits, collections from {before}% to {after}%, no-shows from {no_show_before}% to {no_show_after}%.

**Variables:**
  - `{provider}`: 1 to 5, step 1 (integer)
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{patients}`: 1 to 10, step 1 (integer)
  - `{revenue}`: 50 to 500, step 50 (currency)
  - `{before}`: 70 to 85, step 5 (percentage)
  - `{after}`: 90 to 99, step 2 (percentage)
  - `{no_show_before}`: 10 to 25, step 5 (percentage)
  - `{no_show_after}`: 3 to 8, step 1 (percentage)

### DENT-0003
**Role:** dental-hygienist | **Theme:** preventive-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** dental hygiene, prophylaxis, periodontal therapy, patient education, oral health, scaling and root planing

**Scope:** {patients} patients per day for preventive and periodontal hygiene services, providing oral health education and coordinating with {dentists} dentists on treatment plans
**Result:** achieving a {perio}% periodontal disease detection rate and contributing to a {recall}% patient recall compliance rate

**Variations:**
- **A (Standard):** Provided hygiene services for {patients} daily patients, coordinating with {dentists} dentists, achieving {perio}% periodontal detection rate and {recall}% patient recall compliance.
- **B (Result-first):** Achieved {perio}% periodontal detection and {recall}% recall compliance by providing hygiene services for {patients} daily patients and coordinating with {dentists} dentists.
- **C (Impact-led):** Reached {perio}% periodontal detection and {recall}% recall compliance; provided preventive and periodontal hygiene for {patients} daily patients, coordinating with {dentists} dentists.
- **D (Concise):** Provided hygiene services for {patients} patients/day with {dentists} dentists, {perio}% periodontal detection, {recall}% recall compliance.

**Variables:**
  - `{patients}`: 8 to 16, step 2 (integer)
  - `{dentists}`: 1 to 5, step 1 (integer)
  - `{perio}`: 75 to 95, step 5 (percentage)
  - `{recall}`: 70 to 92, step 5 (percentage)

### DENT-0004
**Role:** optometrist | **Theme:** eye-exams | **Seniority:** mid | **Verb Context:** people
**Keywords:** optometry, comprehensive eye exams, refraction, contact lens fitting, ocular disease, vision therapy

**Scope:** {patients} comprehensive eye exams and contact lens evaluations per day, managing {conditions} ocular conditions and co-managing {surgical} pre/post-operative surgical patients
**Result:** achieving a {satisfaction}% patient satisfaction score and growing practice revenue by ${revenue}K annually through expanded scope services

**Variations:**
- **A (Standard):** Conducted {patients} eye exams daily, managing {conditions} conditions and {surgical} surgical co-management cases, achieving {satisfaction}% satisfaction and growing revenue by ${revenue}K annually.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction and grew revenue ${revenue}K annually by conducting {patients} daily exams, managing {conditions} conditions and {surgical} surgical co-management cases.
- **C (Impact-led):** Achieved {satisfaction}% satisfaction and grew revenue ${revenue}K annually; conducted {patients} daily exams managing {conditions} ocular conditions and {surgical} surgical co-management cases.
- **D (Concise):** Conducted {patients} exams/day across {conditions} conditions and {surgical} surgical cases, {satisfaction}% satisfaction, revenue up ${revenue}K annually.

**Variables:**
  - `{patients}`: 15 to 35, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{surgical}`: 5 to 20, step 5 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{revenue}`: 50 to 300, step 50 (currency)

### DENT-0005
**Role:** dental-office-manager | **Theme:** revenue-cycle | **Seniority:** senior | **Verb Context:** operations
**Keywords:** dental billing, insurance verification, claims management, AR management, revenue cycle management, dental coding

**Scope:** revenue cycle operations for a {provider}-location dental group with ${monthly}K in monthly billings, managing {staff} billing staff and reducing accounts receivable aging
**Result:** increasing net collection rate from {before}% to {after}% and reducing AR over 90 days from {ar_before}% to {ar_after}% of total AR

**Variations:**
- **A (Standard):** Directed revenue cycle for a {provider}-location group at ${monthly}K monthly billings with {staff} billing staff, improving net collection from {before}% to {after}% and cutting 90-day AR from {ar_before}% to {ar_after}%.
- **B (Result-first):** Improved net collection from {before}% to {after}% and cut 90-day AR from {ar_before}% to {ar_after}% by directing revenue cycle for a {provider}-location group at ${monthly}K monthly billings.
- **C (Impact-led):** Grew net collection from {before}% to {after}% and cut 90-day AR from {ar_before}% to {ar_after}%; directed revenue cycle for a {provider}-location dental group with ${monthly}K monthly billings and {staff} billing staff.
- **D (Concise):** Directed RCM for {provider}-location group at ${monthly}K/month, net collection from {before}% to {after}%, 90-day AR from {ar_before}% to {ar_after}%.

**Variables:**
  - `{provider}`: 2 to 10, step 1 (integer)
  - `{monthly}`: 100 to 1000, step 100 (currency)
  - `{staff}`: 3 to 10, step 1 (integer)
  - `{before}`: 85 to 92, step 1 (percentage)
  - `{after}`: 95 to 99, step 1 (percentage)
  - `{ar_before}`: 20 to 40, step 5 (percentage)
  - `{ar_after}`: 5 to 12, step 1 (percentage)

### DENT-0006
**Role:** optician | **Theme:** dispensing | **Seniority:** junior | **Verb Context:** operations
**Keywords:** optical dispensing, frame fitting, lens selection, ophthalmic dispensing, optical sales, patient education

**Scope:** dispensing services for {patients} patients per day, fitting {frames} frame styles and educating patients on lens options across {lens_types} lens categories
**Result:** achieving a {satisfaction}% patient satisfaction rating and growing optical revenue by ${revenue}K annually through consultative dispensing

**Variations:**
- **A (Standard):** Provided dispensing services for {patients} daily patients across {frames} frames and {lens_types} lens categories, achieving {satisfaction}% satisfaction and growing optical revenue ${revenue}K annually.
- **B (Result-first):** Achieved {satisfaction}% satisfaction and grew optical revenue ${revenue}K annually by providing consultative dispensing for {patients} daily patients across {frames} frames.
- **C (Impact-led):** Reached {satisfaction}% satisfaction and grew optical revenue ${revenue}K annually; dispensed eyewear for {patients} daily patients across {frames} frame styles and {lens_types} lens categories.
- **D (Concise):** Dispensed for {patients} patients/day across {frames} frames and {lens_types} lens types, {satisfaction}% satisfaction, revenue up ${revenue}K annually.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{frames}`: 100 to 500, step 100 (integer)
  - `{lens_types}`: 5 to 15, step 5 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{revenue}`: 20 to 150, step 20 (currency)

### DENT-0007
**Role:** dentist | **Theme:** specialty-procedures | **Seniority:** senior | **Verb Context:** operations
**Keywords:** implant dentistry, oral surgery, endodontics, cosmetic dentistry, prosthodontics, dental implants

**Scope:** {procedures} advanced dental procedures per month including implants, full-arch restorations, and complex extractions, achieving a {complication}% complication rate
**Result:** generating ${revenue}K in specialty procedure revenue annually and maintaining a {referral}% patient referral rate from existing patients

**Variations:**
- **A (Standard):** Performed {procedures} advanced procedures monthly including implants and complex extractions, maintaining {complication}% complication rate and generating ${revenue}K in annual specialty revenue with {referral}% patient referral rate.
- **B (Result-first):** Generated ${revenue}K annual specialty revenue and {referral}% patient referral rate by performing {procedures} monthly advanced procedures at {complication}% complication rate.
- **C (Impact-led):** Generated ${revenue}K annual specialty revenue with {referral}% patient referral rate; performed {procedures} advanced monthly procedures including implants at {complication}% complication rate.
- **D (Concise):** Performed {procedures} advanced procedures/month, {complication}% complication rate, ${revenue}K annual specialty revenue, {referral}% patient referral rate.

**Variables:**
  - `{procedures}`: 10 to 40, step 5 (integer)
  - `{complication}`: 0.5 to 3, step 0.5 (percentage)
  - `{revenue}`: 200 to 1000, step 100 (currency)
  - `{referral}`: 30 to 60, step 5 (percentage)

### DENT-0008
**Role:** dental-hygienist | **Theme:** patient-education | **Seniority:** junior | **Verb Context:** people
**Keywords:** oral hygiene instruction, patient communication, preventive dentistry, fluoride, sealants, plaque control

**Scope:** individualized oral hygiene instruction and preventive education for {patients} patients per day, tailoring guidance to {conditions} oral health conditions and risk profiles
**Result:** achieving {plaque}% average plaque score improvement at recall appointments and contributing to a {caries}% reduction in new caries rates among patients

**Variations:**
- **A (Standard):** Provided individualized oral hygiene instruction for {patients} daily patients across {conditions} conditions, achieving {plaque}% plaque score improvement at recall and contributing to a {caries}% caries rate reduction.
- **B (Result-first):** Achieved {plaque}% plaque score improvement and contributed to {caries}% caries reduction by providing individualized instruction for {patients} daily patients across {conditions} conditions.
- **C (Impact-led):** Drove {plaque}% plaque improvement and {caries}% caries reduction; delivered individualized oral hygiene education for {patients} daily patients across {conditions} oral health conditions.
- **D (Concise):** Delivered oral hygiene education for {patients} patients/day across {conditions} conditions, {plaque}% plaque improvement, {caries}% caries reduction.

**Variables:**
  - `{patients}`: 8 to 16, step 2 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{plaque}`: 20 to 50, step 5 (percentage)
  - `{caries}`: 15 to 40, step 5 (percentage)

### DENT-0009
**Role:** dentist | **Theme:** practice-growth | **Seniority:** senior | **Verb Context:** operations
**Keywords:** dental practice growth, new patient acquisition, patient retention, practice marketing, production targets, dental business

**Scope:** production and growth strategy for a {provider}-dentist practice with ${production}K monthly production target, implementing patient recall systems, referral programs, and digital marketing
**Result:** growing monthly production from ${prod_before}K to ${prod_after}K within {months} months and increasing new patient volume from {np_before} to {np_after} per month

**Variations:**
- **A (Standard):** Led growth strategy for a {provider}-dentist practice, growing monthly production from ${prod_before}K to ${prod_after}K in {months} months and increasing new patients from {np_before} to {np_after} per month.
- **B (Result-first):** Grew monthly production from ${prod_before}K to ${prod_after}K in {months} months and new patients from {np_before} to {np_after} by leading growth strategy for a {provider}-dentist practice.
- **C (Impact-led):** Grew production from ${prod_before}K to ${prod_after}K in {months} months and new patients from {np_before} to {np_after}/month; led growth strategy with recall systems and referral programs.
- **D (Concise):** Led growth strategy for {provider}-dentist practice, production from ${prod_before}K to ${prod_after}K in {months} months, new patients from {np_before} to {np_after}/month.

**Variables:**
  - `{provider}`: 1 to 5, step 1 (integer)
  - `{production}`: 100 to 500, step 50 (currency)
  - `{prod_before}`: 80 to 200, step 20 (currency)
  - `{prod_after}`: 200 to 600, step 50 (currency)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{np_before}`: 10 to 30, step 5 (integer)
  - `{np_after}`: 30 to 80, step 10 (integer)

### DENT-0010
**Role:** dental-office-manager | **Theme:** team-management | **Seniority:** mid | **Verb Context:** people
**Keywords:** dental team management, staff training, performance management, onboarding, dental team culture, employee retention

**Scope:** a dental team of {staff} employees across front office, dental assistants, and hygienists, leading hiring for {hires} open positions and delivering {trainings} team training sessions per quarter
**Result:** reducing staff turnover from {turn_before}% to {turn_after}% annually and improving team performance review scores from {score_before} to {score_after}/10

**Variations:**
- **A (Standard):** Managed {staff} dental team members, filled {hires} positions, and delivered {trainings} quarterly trainings, cutting turnover from {turn_before}% to {turn_after}% and improving performance scores from {score_before} to {score_after}/10.
- **B (Result-first):** Cut turnover from {turn_before}% to {turn_after}% and improved scores from {score_before} to {score_after}/10 by managing {staff} dental staff, filling {hires} roles, and delivering {trainings} quarterly trainings.
- **C (Impact-led):** Reduced turnover from {turn_before}% to {turn_after}% and grew performance scores from {score_before} to {score_after}/10; managed {staff} dental team, filled {hires} positions, and led {trainings} quarterly trainings.
- **D (Concise):** Managed {staff} dental team, filled {hires} positions, {trainings} quarterly trainings, turnover from {turn_before}% to {turn_after}%, scores from {score_before} to {score_after}/10.

**Variables:**
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{hires}`: 2 to 8, step 1 (integer)
  - `{trainings}`: 2 to 6, step 1 (integer)
  - `{turn_before}`: 25 to 45, step 5 (percentage)
  - `{turn_after}`: 5 to 15, step 5 (percentage)
  - `{score_before}`: 6 to 7, step 1 (integer)
  - `{score_after}`: 8 to 10, step 1 (integer)

### DENT-0011
**Role:** dental-hygienist | **Theme:** periodontal-therapy | **Seniority:** senior | **Verb Context:** people
**Keywords:** periodontal treatment, scaling root planing, periodontal maintenance, non-surgical periodontics, tissue evaluation, bone loss

**Scope:** periodontal therapy including scaling and root planing for {patients} patients per month across {stages} periodontal disease staging categories, with 4-6 week re-evaluation appointments
**Result:** achieving {improvement}% clinical attachment level improvement at re-evaluation and transitioning {maintenance}% of active therapy patients to maintenance within {months} months

**Variations:**
- **A (Standard):** Provided SRP for {patients} monthly patients across {stages} periodontal stages, achieving {improvement}% clinical attachment improvement and transitioning {maintenance}% to maintenance in {months} months.
- **B (Result-first):** Achieved {improvement}% clinical attachment improvement and transitioned {maintenance}% to maintenance in {months} months by providing SRP for {patients} monthly patients across {stages} stages.
- **C (Impact-led):** Drove {improvement}% clinical attachment improvement and transitioned {maintenance}% to maintenance in {months} months; provided periodontal therapy for {patients} monthly patients across {stages} stages.
- **D (Concise):** Provided SRP for {patients} patients/month across {stages} stages, {improvement}% attachment improvement, {maintenance}% to maintenance in {months} months.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{stages}`: 2 to 4, step 1 (integer)
  - `{improvement}`: 40 to 70, step 5 (percentage)
  - `{maintenance}`: 70 to 95, step 5 (percentage)
  - `{months}`: 3 to 9, step 3 (integer)

### DENT-0012
**Role:** optometrist | **Theme:** low-vision | **Seniority:** senior | **Verb Context:** people
**Keywords:** low vision rehabilitation, vision rehabilitation, visual acuity, visual field, adaptive devices, low vision aids

**Scope:** low vision rehabilitation services for {patients} patients per month with visual acuity of 20/{acuity} or worse, prescribing {devices} optical and electronic devices and coordinating with {specialists} vision rehabilitation specialists
**Result:** achieving {functional}% of patients meeting their functional vision goals and reducing vision-related disability scores by {disability}% at {months}-month follow-up

**Variations:**
- **A (Standard):** Provided low vision rehab for {patients} monthly patients with 20/{acuity} or worse acuity, prescribing {devices} devices, achieving {functional}% goal attainment and {disability}% disability reduction at {months} months.
- **B (Result-first):** Achieved {functional}% goal attainment and {disability}% disability reduction at {months} months by providing low vision rehab for {patients} monthly patients with {devices} prescribed devices.
- **C (Impact-led):** Drove {functional}% goal attainment and {disability}% disability reduction at {months} months; provided low vision rehab for {patients} monthly patients prescribing {devices} optical and electronic devices.
- **D (Concise):** Provided low vision rehab for {patients} patients/month, {devices} devices prescribed, {functional}% goal attainment, {disability}% disability reduction at {months} months.

**Variables:**
  - `{patients}`: 5 to 20, step 5 (integer)
  - `{acuity}`: 200 to 1000, step 100 (integer)
  - `{devices}`: 2 to 8, step 1 (integer)
  - `{specialists}`: 2 to 6, step 1 (integer)
  - `{functional}`: 65 to 90, step 5 (percentage)
  - `{disability}`: 20 to 50, step 5 (percentage)
  - `{months}`: 3 to 12, step 3 (integer)

### DENT-0013
**Role:** dental-office-manager | **Theme:** compliance | **Seniority:** mid | **Verb Context:** operations
**Keywords:** dental compliance, HIPAA, OSHA, infection control, dental regulations, compliance training

**Scope:** HIPAA and OSHA compliance program for a {provider}-dentist practice with {staff} employees, conducting {trainings} compliance training sessions per year and {audits} internal audits
**Result:** achieving zero OSHA citations across {inspections} state inspections and maintaining {hipaa}% HIPAA compliance training completion rate

**Variations:**
- **A (Standard):** Managed HIPAA and OSHA compliance for a {provider}-dentist, {staff}-employee practice with {trainings} trainings and {audits} audits per year, achieving zero OSHA citations and {hipaa}% training completion.
- **B (Result-first):** Achieved zero OSHA citations and {hipaa}% training completion by managing HIPAA and OSHA compliance with {trainings} annual trainings and {audits} audits.
- **C (Impact-led):** Maintained zero OSHA citations and {hipaa}% HIPAA training completion; managed compliance program for {provider}-dentist practice with {trainings} trainings and {audits} audits.
- **D (Concise):** Managed HIPAA and OSHA compliance for {provider}-dentist practice, {trainings} trainings and {audits} audits/year, zero OSHA citations, {hipaa}% training completion.

**Variables:**
  - `{provider}`: 1 to 5, step 1 (integer)
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{trainings}`: 2 to 6, step 1 (integer)
  - `{audits}`: 2 to 4, step 1 (integer)
  - `{inspections}`: 2 to 5, step 1 (integer)
  - `{hipaa}`: 95 to 100, step 1 (percentage)

### DENT-0014
**Role:** optician | **Theme:** contact-lens-fitting | **Seniority:** mid | **Verb Context:** operations
**Keywords:** contact lens fitting, specialty contact lenses, scleral lenses, myopia management, contact lens education

**Scope:** contact lens fittings and follow-up care for {patients} patients per month including specialty lenses for {conditions} conditions such as keratoconus, dry eye, and high refractive error
**Result:** achieving {success}% successful fit rate on first or second visit and growing contact lens revenue by ${revenue}K annually

**Variations:**
- **A (Standard):** Performed contact lens fittings for {patients} monthly patients including specialty lenses for {conditions} conditions, achieving {success}% first-or-second-visit fit rate and growing revenue ${revenue}K annually.
- **B (Result-first):** Achieved {success}% fit rate and grew contact lens revenue ${revenue}K annually by fitting {patients} monthly patients including specialty lenses for {conditions} conditions.
- **C (Impact-led):** Reached {success}% fit rate and grew revenue ${revenue}K annually; performed contact lens fittings for {patients} monthly patients with specialty lenses for {conditions} conditions.
- **D (Concise):** Fitted {patients} contact lens patients/month across {conditions} conditions, {success}% fit rate, revenue up ${revenue}K annually.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{success}`: 85 to 98, step 2 (percentage)
  - `{revenue}`: 20 to 150, step 20 (currency)

### DENT-0015
**Role:** dentist | **Theme:** digital-dentistry | **Seniority:** mid | **Verb Context:** systems
**Keywords:** digital dentistry, CAD/CAM, intraoral scanner, 3D printing, same-day dentistry, CEREC

**Scope:** digital workflow integration including intraoral scanning and same-day CEREC restorations for {restorations} procedures per month, eliminating traditional impressions for {pct}% of crown cases
**Result:** reducing average crown fabrication time from {before} days to {after} hours and achieving a {fit}% same-day restoration success rate

**Variations:**
- **A (Standard):** Integrated digital workflow with intraoral scanning and CEREC for {restorations} monthly procedures, eliminating traditional impressions for {pct}% of cases and cutting crown time from {before} days to {after} hours.
- **B (Result-first):** Cut crown fabrication from {before} days to {after} hours and achieved {fit}% same-day success by integrating digital workflow for {restorations} procedures and eliminating impressions for {pct}% of cases.
- **C (Impact-led):** Reduced crown time from {before} days to {after} hours and achieved {fit}% same-day success; integrated digital workflow for {restorations} monthly procedures, eliminating impressions for {pct}% of cases.
- **D (Concise):** Integrated digital workflow for {restorations} procedures/month, impressions eliminated for {pct}% of cases, crown time from {before}d to {after}h, {fit}% same-day success.

**Variables:**
  - `{restorations}`: 10 to 40, step 5 (integer)
  - `{pct}`: 50 to 95, step 5 (percentage)
  - `{before}`: 10 to 21, step 3 (integer)
  - `{after}`: 1 to 3, step 0.5 (integer)
  - `{fit}`: 90 to 99, step 2 (percentage)

### DENT-0016
**Role:** optometrist | **Theme:** myopia-management | **Seniority:** mid | **Verb Context:** people
**Keywords:** myopia management, orthokeratology, myopia control, pediatric optometry, axial length, myopia progression

**Scope:** myopia management program for {patients} pediatric patients using orthokeratology, multifocal contact lenses, and atropine therapy across {age_range} age groups
**Result:** achieving {progression}% reduction in annual axial length progression and retaining {retention}% of myopia management patients in the program at {months} months

**Variations:**
- **A (Standard):** Managed myopia control for {patients} pediatric patients using OK lenses, MFCLs, and atropine across {age_range} age groups, achieving {progression}% axial length progression reduction and {retention}% retention at {months} months.
- **B (Result-first):** Achieved {progression}% axial length progression reduction and {retention}% retention at {months} months by managing myopia control for {patients} pediatric patients across {age_range} age groups.
- **C (Impact-led):** Reduced axial length progression {progression}% and retained {retention}% of patients at {months} months; managed myopia control program for {patients} pediatric patients using OK, MFCL, and atropine.
- **D (Concise):** Managed myopia control for {patients} pediatric patients across {age_range} age groups, {progression}% axial progression reduction, {retention}% retention at {months} months.

**Variables:**
  - `{patients}`: 20 to 80, step 10 (integer)
  - `{age_range}`: 2 to 4, step 1 (integer)
  - `{progression}`: 40 to 70, step 5 (percentage)
  - `{retention}`: 75 to 95, step 5 (percentage)
  - `{months}`: 12 to 36, step 6 (integer)

