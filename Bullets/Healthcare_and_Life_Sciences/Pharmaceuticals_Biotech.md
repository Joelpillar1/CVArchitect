# Pharmaceuticals / Biotech

**Industry ID:** `pharma-biotech` | **Prefix:** `PHARMA` | **Target:** 400 bullets

---

### PHARMA-0001
**Role:** clinical-research-associate | **Theme:** clinical-trials | **Seniority:** mid | **Verb Context:** operations
**Keywords:** clinical trials, GCP, site monitoring, ICH guidelines, protocol compliance, CRO

**Scope:** site monitoring for {sites} clinical trial sites across {countries} countries for a Phase {phase} study enrolling {patients} patients, conducting {visits} monitoring visits
**Result:** achieving {compliance}% protocol compliance rate and resolving {queries} data queries within {days} days of identification

**Variations:**
- **A (Standard):** Monitored {sites} trial sites across {countries} countries for a Phase {phase} study with {patients} patients, achieving {compliance}% protocol compliance and resolving {queries} data queries within {days} days.
- **B (Result-first):** Achieved {compliance}% protocol compliance and resolved {queries} queries within {days} days by monitoring {sites} sites across {countries} countries for a {patients}-patient Phase {phase} study.
- **C (Impact-led):** Maintained {compliance}% protocol compliance and cleared {queries} queries within {days} days; monitored {sites} sites across {countries} countries for a Phase {phase} study with {patients} patients.
- **D (Concise):** Monitored {sites} sites across {countries} countries for Phase {phase} study with {patients} patients, {compliance}% compliance, {queries} queries resolved in {days} days.

**Variables:**
  - `{sites}`: 5 to 50, step 5 (integer)
  - `{countries}`: 2 to 15, step 1 (integer)
  - `{phase}`: 1 to 3, step 1 (integer)
  - `{patients}`: 50 to 1000, step 50 (integer)
  - `{visits}`: 10 to 100, step 10 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{queries}`: 50 to 500, step 50 (integer)
  - `{days}`: 5 to 30, step 5 (integer)

### PHARMA-0002
**Role:** regulatory-affairs-specialist | **Theme:** regulatory-submissions | **Seniority:** senior | **Verb Context:** projects
**Keywords:** FDA submission, IND, NDA, BLA, regulatory strategy, eCTD, regulatory affairs

**Scope:** regulatory submissions strategy for {submissions} NDA/BLA filings with the FDA, coordinating {modules} eCTD modules and managing {reviewers} cross-functional review teams
**Result:** achieving {approvals} product approvals within {months} months of submission and reducing submission preparation time by {reduction}%

**Variations:**
- **A (Standard):** Directed regulatory strategy for {submissions} NDA/BLA filings with {modules} eCTD modules, achieving {approvals} approvals within {months} months and reducing preparation time by {reduction}%.
- **B (Result-first):** Achieved {approvals} FDA approvals within {months} months and reduced prep time {reduction}% by directing strategy for {submissions} NDA/BLA filings with {modules} eCTD modules.
- **C (Impact-led):** Secured {approvals} FDA approvals within {months} months and cut prep time {reduction}%; led regulatory strategy for {submissions} NDA/BLA filings with {modules} eCTD modules.
- **D (Concise):** Led {submissions} NDA/BLA filings with {modules} eCTD modules, {approvals} approvals in {months} months, prep time down {reduction}%.

**Variables:**
  - `{submissions}`: 2 to 8, step 1 (integer)
  - `{modules}`: 3 to 5, step 1 (integer)
  - `{reviewers}`: 5 to 20, step 5 (integer)
  - `{approvals}`: 1 to 5, step 1 (integer)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{reduction}`: 15 to 40, step 5 (percentage)

### PHARMA-0003
**Role:** research-scientist | **Theme:** drug-discovery | **Seniority:** mid | **Verb Context:** systems
**Keywords:** drug discovery, lead optimization, HTS, assay development, medicinal chemistry, target identification

**Scope:** a high-throughput screening campaign testing {compounds}K compounds against {targets} biological targets, developing {assays} cell-based and biochemical assays
**Result:** identifying {hits} lead compounds with {potency} nM potency and advancing {candidates} into lead optimization within {months} months

**Variations:**
- **A (Standard):** Executed HTS campaign across {compounds}K compounds and {targets} targets with {assays} assays, identifying {hits} leads with {potency}nM potency and advancing {candidates} into lead optimization.
- **B (Result-first):** Identified {hits} lead compounds with {potency}nM potency and advanced {candidates} into optimization by executing HTS across {compounds}K compounds and {targets} targets.
- **C (Impact-led):** Identified {hits} leads at {potency}nM and advanced {candidates} into lead optimization; executed HTS campaign across {compounds}K compounds, {targets} targets, and {assays} assays.
- **D (Concise):** Executed HTS across {compounds}K compounds and {targets} targets, identified {hits} leads at {potency}nM, {candidates} advanced to lead optimization.

**Variables:**
  - `{compounds}`: 10 to 500, step 10 (integer)
  - `{targets}`: 2 to 10, step 1 (integer)
  - `{assays}`: 3 to 15, step 3 (integer)
  - `{hits}`: 5 to 50, step 5 (integer)
  - `{potency}`: 1 to 100, step 10 (integer)
  - `{candidates}`: 2 to 8, step 1 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### PHARMA-0004
**Role:** quality-assurance-specialist | **Theme:** gmp-compliance | **Seniority:** mid | **Verb Context:** operations
**Keywords:** GMP, FDA inspection, quality systems, deviation management, CAPA, pharmaceutical quality

**Scope:** GMP compliance program for a {product}-manufacturing facility, managing {deviations} annual deviations, {capas} CAPAs, and preparation for {inspections} regulatory inspections
**Result:** achieving {pass}% inspection pass rate with zero critical findings and reducing CAPA closure time from {before} to {after} days

**Variations:**
- **A (Standard):** Managed GMP compliance for a {product} facility across {deviations} deviations and {capas} CAPAs, achieving {pass}% inspection pass rate with zero critical findings and cutting CAPA closure from {before} to {after} days.
- **B (Result-first):** Achieved {pass}% inspection pass rate with zero critical findings and cut CAPA closure from {before} to {after} days by managing GMP compliance across {deviations} deviations and {capas} CAPAs.
- **C (Impact-led):** Secured {pass}% inspection pass rate with zero critical findings and cut CAPA closure from {before} to {after} days; managed {deviations} deviations and {capas} CAPAs for a {product} GMP facility.
- **D (Concise):** Managed GMP compliance for {product} facility, {deviations} deviations, {capas} CAPAs, {pass}% inspection pass rate, zero critical findings, CAPA closure from {before} to {after} days.

**Variables:**
  - `{deviations}`: 50 to 300, step 50 (integer)
  - `{capas}`: 20 to 100, step 10 (integer)
  - `{inspections}`: 2 to 5, step 1 (integer)
  - `{pass}`: 95 to 100, step 1 (percentage)
  - `{before}`: 30 to 90, step 15 (integer)
  - `{after}`: 10 to 25, step 5 (integer)

### PHARMA-0005
**Role:** biostatistician | **Theme:** statistical-analysis | **Seniority:** senior | **Verb Context:** systems
**Keywords:** biostatistics, SAS, R, clinical data analysis, SAP, survival analysis, regulatory statistics

**Scope:** statistical analysis plans and primary analysis for {trials} Phase {phase} clinical trials covering {endpoints} primary and secondary endpoints with {patients} patient datasets
**Result:** delivering all {trials} trial analyses on schedule and supporting {approvals} regulatory submissions with analysis packages accepted at first review

**Variations:**
- **A (Standard):** Designed SAPs and led analysis for {trials} Phase {phase} trials across {endpoints} endpoints with {patients} patients, delivering on schedule and supporting {approvals} submissions accepted at first review.
- **B (Result-first):** Delivered all {trials} analyses on schedule and supported {approvals} regulatory submissions accepted at first review by leading SAP development for Phase {phase} trials with {patients} patients.
- **C (Impact-led):** Delivered all {trials} analyses on schedule with {approvals} first-review acceptances; designed SAPs and led primary analysis for {trials} Phase {phase} trials across {endpoints} endpoints.
- **D (Concise):** Designed SAPs and led analysis for {trials} Phase {phase} trials across {endpoints} endpoints, all on schedule, {approvals} submissions accepted first review.

**Variables:**
  - `{trials}`: 2 to 8, step 1 (integer)
  - `{phase}`: 2 to 3, step 1 (integer)
  - `{endpoints}`: 3 to 10, step 1 (integer)
  - `{patients}`: 100 to 2000, step 100 (integer)
  - `{approvals}`: 2 to 6, step 1 (integer)

### PHARMA-0006
**Role:** medical-science-liaison | **Theme:** medical-affairs | **Seniority:** mid | **Verb Context:** people
**Keywords:** medical affairs, KOL engagement, scientific exchange, MSL, evidence generation, publication planning

**Scope:** a territory of {kols} key opinion leaders across {institutions} academic institutions, conducting scientific exchanges and supporting {studies} investigator-initiated studies
**Result:** increasing KOL engagement score from {before} to {after}/10 and contributing to {publications} peer-reviewed publications within {months} months

**Variations:**
- **A (Standard):** Managed {kols} KOLs across {institutions} institutions with scientific exchanges and {studies} investigator studies, growing engagement from {before} to {after}/10 and contributing to {publications} publications in {months} months.
- **B (Result-first):** Grew KOL engagement from {before} to {after}/10 and contributed to {publications} publications in {months} months by managing {kols} KOLs across {institutions} institutions and {studies} IITs.
- **C (Impact-led):** Grew KOL engagement from {before} to {after}/10 and contributed to {publications} publications in {months} months; managed {kols} KOLs across {institutions} institutions and {studies} investigator studies.
- **D (Concise):** Managed {kols} KOLs across {institutions} institutions, {studies} IITs, engagement from {before} to {after}/10, {publications} publications in {months} months.

**Variables:**
  - `{kols}`: 10 to 50, step 5 (integer)
  - `{institutions}`: 5 to 20, step 5 (integer)
  - `{studies}`: 2 to 10, step 1 (integer)
  - `{before}`: 5 to 7, step 1 (integer)
  - `{after}`: 8 to 10, step 1 (integer)
  - `{publications}`: 2 to 10, step 1 (integer)
  - `{months}`: 12 to 36, step 6 (integer)

### PHARMA-0007
**Role:** clinical-data-manager | **Theme:** data-integrity | **Seniority:** mid | **Verb Context:** systems
**Keywords:** clinical data management, EDC, Medidata Rave, data cleaning, CDISC, SDTM, database lock

**Scope:** clinical database build and data management for a Phase {phase} trial with {patients} patients across {sites} sites using Medidata Rave, managing {queries} data queries
**Result:** achieving database lock {weeks} weeks ahead of schedule with {error}% data error rate and {query}% query resolution rate

**Variations:**
- **A (Standard):** Managed Phase {phase} trial database for {patients} patients across {sites} sites in Medidata Rave, achieving database lock {weeks} weeks early with {error}% error rate and {query}% query resolution.
- **B (Result-first):** Achieved database lock {weeks} weeks early with {error}% error rate and {query}% query resolution by managing Phase {phase} Medidata Rave database for {patients} patients across {sites} sites.
- **C (Impact-led):** Locked database {weeks} weeks early with {error}% error rate and {query}% query resolution; managed Phase {phase} database for {patients} patients across {sites} sites.
- **D (Concise):** Managed Phase {phase} Rave database for {patients} patients across {sites} sites, locked {weeks} weeks early, {error}% error rate, {query}% query resolution.

**Variables:**
  - `{phase}`: 1 to 3, step 1 (integer)
  - `{patients}`: 50 to 1000, step 50 (integer)
  - `{sites}`: 5 to 50, step 5 (integer)
  - `{queries}`: 500 to 5000, step 500 (integer)
  - `{weeks}`: 1 to 6, step 1 (integer)
  - `{error}`: 0.1 to 1, step 0.1 (percentage)
  - `{query}`: 95 to 100, step 1 (percentage)

### PHARMA-0008
**Role:** pharmacovigilance-specialist | **Theme:** safety-reporting | **Seniority:** mid | **Verb Context:** operations
**Keywords:** pharmacovigilance, adverse event reporting, ICSR, EudraVigilance, FDA MedWatch, drug safety

**Scope:** adverse event case processing for {cases} ICSRs per month across {products} marketed products, submitting expedited reports to {agencies} regulatory agencies within mandatory timelines
**Result:** achieving {on_time}% on-time submission rate and maintaining zero regulatory agency citations over {years} years

**Variations:**
- **A (Standard):** Processed {cases} ICSRs monthly across {products} products and {agencies} agencies, achieving {on_time}% on-time submission rate and zero regulatory citations over {years} years.
- **B (Result-first):** Achieved {on_time}% on-time submission rate and zero citations over {years} years by processing {cases} ICSRs monthly across {products} products and {agencies} agencies.
- **C (Impact-led):** Maintained {on_time}% on-time submission and zero regulatory citations over {years} years; processed {cases} ICSRs monthly across {products} products and {agencies} agencies.
- **D (Concise):** Processed {cases} ICSRs/month across {products} products and {agencies} agencies, {on_time}% on-time, zero citations over {years} years.

**Variables:**
  - `{cases}`: 50 to 500, step 50 (integer)
  - `{products}`: 2 to 10, step 1 (integer)
  - `{agencies}`: 2 to 8, step 1 (integer)
  - `{on_time}`: 98 to 100, step 0.5 (percentage)
  - `{years}`: 2 to 5, step 1 (integer)

### PHARMA-0009
**Role:** research-scientist | **Theme:** laboratory-research | **Seniority:** junior | **Verb Context:** systems
**Keywords:** molecular biology, PCR, cell culture, assay development, laboratory techniques, scientific research

**Scope:** {assays} cell-based and biochemical assays to evaluate {compounds} compounds for target activity and selectivity as part of a {disease} drug discovery program
**Result:** generating {datapoints}K validated data points contributing to {publications} internal research reports and {papers} conference presentations within {months} months

**Variations:**
- **A (Standard):** Developed {assays} assays to evaluate {compounds} compounds in a {disease} discovery program, generating {datapoints}K data points for {publications} internal reports and {papers} conference presentations.
- **B (Result-first):** Generated {datapoints}K data points for {publications} internal reports and {papers} presentations by developing {assays} assays to evaluate {compounds} compounds in a {disease} program.
- **C (Impact-led):** Generated {datapoints}K data points supporting {publications} internal reports and {papers} presentations; developed {assays} assays evaluating {compounds} compounds in a {disease} discovery program.
- **D (Concise):** Developed {assays} assays for {compounds} compounds in {disease} program, {datapoints}K data points, {publications} internal reports, {papers} conference presentations.

**Variables:**
  - `{assays}`: 3 to 15, step 3 (integer)
  - `{compounds}`: 50 to 500, step 50 (integer)
  - `{datapoints}`: 10 to 500, step 10 (integer)
  - `{publications}`: 2 to 10, step 1 (integer)
  - `{papers}`: 1 to 5, step 1 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### PHARMA-0010
**Role:** medical-affairs-director | **Theme:** evidence-generation | **Seniority:** senior | **Verb Context:** projects
**Keywords:** evidence generation, HEOR, real-world evidence, publication strategy, medical strategy, payer evidence

**Scope:** a {product} evidence generation strategy covering {studies} real-world studies, {publications} planned publications, and {congress} congress presentations over {years} years
**Result:** generating {evidence}% of planned evidence milestones on time and supporting market access in {markets} new markets

**Variations:**
- **A (Standard):** Directed {product} evidence strategy across {studies} RWE studies, {publications} publications, and {congress} congress presentations, completing {evidence}% of milestones on time and supporting access in {markets} markets.
- **B (Result-first):** Completed {evidence}% of evidence milestones on time and gained market access in {markets} markets by directing {studies} RWE studies, {publications} publications, and {congress} presentations.
- **C (Impact-led):** Completed {evidence}% of milestones on time and supported access in {markets} markets; orchestrated {product} evidence strategy across {studies} RWE studies and {publications} publications over {years} years.
- **D (Concise):** Directed {product} evidence strategy with {studies} RWE studies and {publications} publications, {evidence}% milestones on time, access in {markets} markets.

**Variables:**
  - `{studies}`: 3 to 15, step 3 (integer)
  - `{publications}`: 5 to 30, step 5 (integer)
  - `{congress}`: 3 to 15, step 3 (integer)
  - `{years}`: 2 to 5, step 1 (integer)
  - `{evidence}`: 85 to 100, step 5 (percentage)
  - `{markets}`: 2 to 10, step 1 (integer)

### PHARMA-0011
**Role:** clinical-research-coordinator | **Theme:** site-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** clinical trial coordination, site coordination, IRB, informed consent, protocol compliance, CRC

**Scope:** day-to-day coordination of {studies} active clinical studies at a single site enrolling {patients} participants, managing {visits} study visits per month and maintaining regulatory binders
**Result:** achieving {retention}% participant retention through study completion and receiving zero protocol deviations on the last {audits} monitoring visits

**Variations:**
- **A (Standard):** Coordinated {studies} active studies with {patients} participants across {visits} monthly visits, achieving {retention}% retention and zero protocol deviations across {audits} monitoring visits.
- **B (Result-first):** Achieved {retention}% participant retention and zero protocol deviations across {audits} monitoring visits by coordinating {studies} studies with {visits} monthly visits.
- **C (Impact-led):** Maintained {retention}% participant retention and zero deviations across {audits} monitoring visits; coordinated {studies} active studies with {patients} participants and {visits} monthly visits.
- **D (Concise):** Coordinated {studies} studies with {patients} participants across {visits} monthly visits, {retention}% retention, zero deviations on {audits} monitoring visits.

**Variables:**
  - `{studies}`: 2 to 8, step 1 (integer)
  - `{patients}`: 20 to 200, step 20 (integer)
  - `{visits}`: 20 to 100, step 10 (integer)
  - `{retention}`: 85 to 99, step 2 (percentage)
  - `{audits}`: 3 to 10, step 1 (integer)

### PHARMA-0012
**Role:** regulatory-affairs-specialist | **Theme:** labeling | **Seniority:** mid | **Verb Context:** operations
**Keywords:** drug labeling, package insert, product labeling, regulatory labeling, PLR format, prescribing information

**Scope:** labeling content for {products} drug products across {submissions} regulatory submissions, coordinating {reviewers} cross-functional reviewers and managing {rounds} review cycles per product
**Result:** achieving {approvals}% first-cycle approval rate for labeling submissions and reducing average labeling review cycle time from {before} to {after} weeks

**Variations:**
- **A (Standard):** Managed labeling for {products} products across {submissions} submissions with {reviewers} reviewers and {rounds} review cycles, achieving {approvals}% first-cycle approval and cutting cycle time from {before} to {after} weeks.
- **B (Result-first):** Achieved {approvals}% first-cycle labeling approval and cut review cycle from {before} to {after} weeks by managing {products} products across {submissions} submissions.
- **C (Impact-led):** Hit {approvals}% first-cycle approval and cut cycle time from {before} to {after} weeks; managed labeling for {products} products across {submissions} submissions with {reviewers} reviewers.
- **D (Concise):** Managed labeling for {products} products across {submissions} submissions, {approvals}% first-cycle approval, cycle time from {before} to {after} weeks.

**Variables:**
  - `{products}`: 3 to 15, step 3 (integer)
  - `{submissions}`: 3 to 15, step 3 (integer)
  - `{reviewers}`: 5 to 20, step 5 (integer)
  - `{rounds}`: 2 to 5, step 1 (integer)
  - `{approvals}`: 75 to 95, step 5 (percentage)
  - `{before}`: 12 to 24, step 4 (integer)
  - `{after}`: 4 to 8, step 1 (integer)

### PHARMA-0013
**Role:** research-scientist | **Theme:** preclinical-research | **Seniority:** mid | **Verb Context:** systems
**Keywords:** preclinical research, in vivo studies, animal models, ADME, PK/PD, toxicology, IND-enabling studies

**Scope:** preclinical IND-enabling studies for {candidates} drug candidates across {studies} study types including PK/PD, toxicology, and efficacy in {models} animal models
**Result:** generating data packages supporting {ind_filings} IND filings and advancing {candidates_fwd} candidates into Phase 1 within {months} months

**Variations:**
- **A (Standard):** Executed preclinical studies for {candidates} candidates across {studies} study types in {models} models, supporting {ind_filings} IND filings and advancing {candidates_fwd} into Phase 1 within {months} months.
- **B (Result-first):** Supported {ind_filings} IND filings and advanced {candidates_fwd} candidates into Phase 1 by executing preclinical studies for {candidates} candidates across {studies} study types.
- **C (Impact-led):** Supported {ind_filings} IND filings and advanced {candidates_fwd} into Phase 1 within {months} months; executed preclinical studies for {candidates} candidates across {studies} types in {models} animal models.
- **D (Concise):** Executed preclinical studies for {candidates} candidates across {studies} types and {models} models, {ind_filings} IND filings, {candidates_fwd} into Phase 1 in {months} months.

**Variables:**
  - `{candidates}`: 2 to 8, step 1 (integer)
  - `{studies}`: 5 to 20, step 5 (integer)
  - `{models}`: 2 to 5, step 1 (integer)
  - `{ind_filings}`: 1 to 4, step 1 (integer)
  - `{candidates_fwd}`: 1 to 4, step 1 (integer)
  - `{months}`: 12 to 36, step 6 (integer)

### PHARMA-0014
**Role:** quality-assurance-specialist | **Theme:** auditing | **Seniority:** senior | **Verb Context:** operations
**Keywords:** quality audits, vendor qualification, supplier audit, GMP audit, audit program, CAPA effectiveness

**Scope:** quality audit program covering {audits} GMP audits per year across {vendors} contract manufacturers and {labs} testing laboratories in {countries} countries
**Result:** maintaining a {pass}% vendor qualification pass rate and reducing critical audit findings by {reduction}% year-over-year

**Variations:**
- **A (Standard):** Led {audits} annual GMP audits across {vendors} CMOs and {labs} labs in {countries} countries, maintaining {pass}% qualification pass rate and reducing critical findings {reduction}% YoY.
- **B (Result-first):** Maintained {pass}% vendor qualification pass rate and reduced critical findings {reduction}% YoY by leading {audits} annual GMP audits across {vendors} CMOs and {labs} labs.
- **C (Impact-led):** Maintained {pass}% qualification rate and cut critical findings {reduction}% YoY; directed {audits} GMP audits per year across {vendors} CMOs and {labs} labs in {countries} countries.
- **D (Concise):** Led {audits} GMP audits/year across {vendors} CMOs and {labs} labs in {countries} countries, {pass}% pass rate, critical findings down {reduction}% YoY.

**Variables:**
  - `{audits}`: 10 to 50, step 5 (integer)
  - `{vendors}`: 10 to 50, step 5 (integer)
  - `{labs}`: 5 to 20, step 5 (integer)
  - `{countries}`: 2 to 15, step 1 (integer)
  - `{pass}`: 85 to 99, step 2 (percentage)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### PHARMA-0015
**Role:** clinical-trial-manager | **Theme:** trial-operations | **Seniority:** senior | **Verb Context:** projects
**Keywords:** clinical trial management, trial oversight, CRO management, TMF, budget management, timeline management

**Scope:** a Phase {phase} clinical trial across {sites} sites and {countries} countries with a ${budget}M budget, managing {cros} CRO vendors and a trial team of {staff} members
**Result:** delivering the trial {weeks} weeks ahead of schedule, {budget_pct}% under budget, and achieving {enroll}% of enrollment target within the planned window

**Variations:**
- **A (Standard):** Directed Phase {phase} trial across {sites} sites and {countries} countries with ${budget}M budget and {staff} team members, delivering {weeks} weeks early, {budget_pct}% under budget, and {enroll}% enrollment target.
- **B (Result-first):** Delivered {weeks} weeks early and {budget_pct}% under budget with {enroll}% enrollment by directing Phase {phase} trial across {sites} sites and {countries} countries.
- **C (Impact-led):** Delivered trial {weeks} weeks ahead of schedule, {budget_pct}% under budget, and {enroll}% enrollment; directed Phase {phase} trial across {sites} sites in {countries} countries with ${budget}M budget.
- **D (Concise):** Directed Phase {phase} trial across {sites} sites in {countries} countries, ${budget}M budget, {weeks} weeks early, {budget_pct}% under budget, {enroll}% enrollment.

**Variables:**
  - `{phase}`: 1 to 3, step 1 (integer)
  - `{sites}`: 10 to 100, step 10 (integer)
  - `{countries}`: 3 to 20, step 1 (integer)
  - `{budget}`: 5 to 100, step 5 (currency)
  - `{cros}`: 1 to 5, step 1 (integer)
  - `{staff}`: 5 to 30, step 5 (integer)
  - `{weeks}`: 2 to 12, step 2 (integer)
  - `{budget_pct}`: 5 to 20, step 5 (percentage)
  - `{enroll}`: 95 to 110, step 5 (percentage)

### PHARMA-0016
**Role:** medical-science-liaison | **Theme:** congress-coverage | **Seniority:** mid | **Verb Context:** content
**Keywords:** medical congress, scientific publications, clinical data dissemination, MSL, KOL identification, medical education

**Scope:** congress coverage and data dissemination for {congresses} major medical congresses per year, delivering {presentations} scientific presentations and {meetings} KOL meetings per congress
**Result:** reaching {hcps}K healthcare professionals with clinical evidence and contributing to {mentions} peer-reviewed mentions of the product data within {months} months

**Variations:**
- **A (Standard):** Covered {congresses} congresses per year with {presentations} presentations and {meetings} KOL meetings each, reaching {hcps}K HCPs and contributing to {mentions} peer-reviewed product mentions in {months} months.
- **B (Result-first):** Reached {hcps}K HCPs and contributed to {mentions} peer-reviewed mentions in {months} months by covering {congresses} congresses with {presentations} presentations and {meetings} KOL meetings.
- **C (Impact-led):** Reached {hcps}K HCPs and earned {mentions} peer-reviewed mentions in {months} months; covered {congresses} congresses with {presentations} presentations and {meetings} KOL meetings each.
- **D (Concise):** Covered {congresses} congresses, {presentations} presentations and {meetings} KOL meetings each, {hcps}K HCPs reached, {mentions} peer-reviewed mentions in {months} months.

**Variables:**
  - `{congresses}`: 3 to 10, step 1 (integer)
  - `{presentations}`: 3 to 15, step 3 (integer)
  - `{meetings}`: 5 to 30, step 5 (integer)
  - `{hcps}`: 1 to 20, step 1 (integer)
  - `{mentions}`: 5 to 30, step 5 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### PHARMA-0017
**Role:** pharmacovigilance-specialist | **Theme:** signal-detection | **Seniority:** senior | **Verb Context:** operations
**Keywords:** signal detection, disproportionality analysis, EBGM, pharmacovigilance strategy, benefit-risk, PRAC

**Scope:** signal detection and benefit-risk evaluation for {products} marketed products using disproportionality analysis across {databases} safety databases with {cases}K cumulative cases
**Result:** detecting {signals} actionable safety signals per year and supporting {label_updates} label updates through regulatory submissions within required timelines

**Variations:**
- **A (Standard):** Led signal detection for {products} products across {databases} databases with {cases}K cases, detecting {signals} actionable signals per year and supporting {label_updates} label updates within required timelines.
- **B (Result-first):** Detected {signals} actionable safety signals per year and supported {label_updates} label updates by leading signal detection for {products} products across {databases} databases.
- **C (Impact-led):** Identified {signals} actionable signals per year and supported {label_updates} label updates; led signal detection across {products} products in {databases} databases with {cases}K cumulative cases.
- **D (Concise):** Led signal detection for {products} products across {databases} databases and {cases}K cases, {signals} signals/year, {label_updates} label updates supported.

**Variables:**
  - `{products}`: 3 to 15, step 3 (integer)
  - `{databases}`: 2 to 6, step 1 (integer)
  - `{cases}`: 10 to 500, step 10 (integer)
  - `{signals}`: 3 to 15, step 3 (integer)
  - `{label_updates}`: 1 to 6, step 1 (integer)

### PHARMA-0018
**Role:** clinical-data-manager | **Theme:** edc-build | **Seniority:** senior | **Verb Context:** systems
**Keywords:** EDC build, Medidata Rave, Veeva Vault, study design, database validation, UAT

**Scope:** EDC database build and validation for {studies} Phase {phase} studies in Medidata Rave, overseeing {forms} CRF forms, {edit_checks} edit checks, and UAT with {users} end users
**Result:** achieving all databases on time for first patient in and reducing post-go-live data query volume by {query_reduction}% compared to prior studies

**Variations:**
- **A (Standard):** Built and validated EDC for {studies} Phase {phase} studies with {forms} CRFs and {edit_checks} edit checks in Medidata Rave, delivering all on time for FPI and cutting post-go-live queries {query_reduction}%.
- **B (Result-first):** Delivered all databases on time for FPI and reduced post-go-live queries {query_reduction}% by building and validating EDC for {studies} studies with {forms} CRFs and {edit_checks} edit checks.
- **C (Impact-led):** Delivered all databases on time for FPI and cut post-go-live queries {query_reduction}%; built and validated EDC for {studies} Phase {phase} studies with {forms} CRFs and {edit_checks} edit checks.
- **D (Concise):** Built and validated EDC for {studies} Phase {phase} studies, {forms} CRFs, {edit_checks} edit checks, all on time for FPI, post-go-live queries down {query_reduction}%.

**Variables:**
  - `{studies}`: 2 to 8, step 1 (integer)
  - `{phase}`: 1 to 3, step 1 (integer)
  - `{forms}`: 20 to 100, step 10 (integer)
  - `{edit_checks}`: 50 to 500, step 50 (integer)
  - `{users}`: 10 to 100, step 10 (integer)
  - `{query_reduction}`: 20 to 50, step 5 (percentage)

### PHARMA-0019
**Role:** biostatistician | **Theme:** adaptive-design | **Seniority:** senior | **Verb Context:** systems
**Keywords:** adaptive design, Bayesian statistics, interim analysis, sample size re-estimation, seamless design, Type I error control

**Scope:** an adaptive Phase {phase} trial design with {interim} interim analyses for a {patients}-patient study, controlling Type I error and modeling {scenarios} sample size scenarios
**Result:** reducing expected sample size by {reduction}% versus a fixed design while maintaining {power}% power at the primary endpoint

**Variations:**
- **A (Standard):** Designed an adaptive Phase {phase} trial with {interim} interims for {patients} patients, reducing expected sample size {reduction}% versus fixed design while maintaining {power}% power.
- **B (Result-first):** Reduced expected sample size {reduction}% while maintaining {power}% power by designing an adaptive Phase {phase} trial with {interim} interim analyses for {patients} patients.
- **C (Impact-led):** Cut expected sample size {reduction}% while maintaining {power}% power; developed adaptive Phase {phase} design with {interim} interims and {scenarios} sample size scenarios for {patients} patients.
- **D (Concise):** Designed adaptive Phase {phase} trial with {interim} interims for {patients} patients, {reduction}% smaller expected sample size, {power}% power maintained.

**Variables:**
  - `{phase}`: 2 to 3, step 1 (integer)
  - `{interim}`: 1 to 3, step 1 (integer)
  - `{patients}`: 100 to 1000, step 100 (integer)
  - `{scenarios}`: 3 to 10, step 1 (integer)
  - `{reduction}`: 10 to 30, step 5 (percentage)
  - `{power}`: 80 to 95, step 5 (percentage)

### PHARMA-0020
**Role:** regulatory-affairs-specialist | **Theme:** lifecycle-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** lifecycle management, Type II variation, CBE, post-approval changes, regulatory maintenance, annual reports

**Scope:** post-approval regulatory maintenance for {products} marketed products across {markets} markets, managing {variations} annual variations, {cbr} annual reports, and {inspections} regulatory inspections
**Result:** achieving {on_time}% on-time submission rate and maintaining marketing authorization status for {products} products with zero lapses over {years} years

**Variations:**
- **A (Standard):** Maintained post-approval regulatory status for {products} products across {markets} markets with {variations} variations and {cbr} annual reports, achieving {on_time}% on-time submission and zero authorization lapses over {years} years.
- **B (Result-first):** Achieved {on_time}% on-time submission and zero authorization lapses over {years} years by maintaining regulatory status for {products} products across {markets} markets.
- **C (Impact-led):** Maintained {on_time}% on-time submission and zero authorization lapses over {years} years; managed lifecycle for {products} products across {markets} markets with {variations} annual variations.
- **D (Concise):** Managed regulatory lifecycle for {products} products across {markets} markets, {on_time}% on-time submission, zero authorization lapses over {years} years.

**Variables:**
  - `{products}`: 3 to 15, step 3 (integer)
  - `{markets}`: 5 to 30, step 5 (integer)
  - `{variations}`: 20 to 100, step 10 (integer)
  - `{cbr}`: 3 to 15, step 3 (integer)
  - `{inspections}`: 2 to 8, step 1 (integer)
  - `{on_time}`: 95 to 100, step 1 (percentage)
  - `{years}`: 2 to 5, step 1 (integer)

