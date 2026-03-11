# Veterinary

**Industry ID:** `veterinary` | **Prefix:** `VET` | **Target:** 250 bullets

---

### VET-0001
**Role:** veterinarian | **Theme:** clinical-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** veterinary medicine, clinical examination, diagnosis, treatment planning, small animal medicine, client communication

**Scope:** a caseload of {patients} patients per day across {species} species categories, conducting examinations, diagnosing {conditions} conditions, and communicating treatment plans to owners
**Result:** achieving a {satisfaction}% client satisfaction score and a {followup}% treatment compliance rate among patients

**Variations:**
- **A (Standard):** Managed {patients} daily patients across {species} species, diagnosing {conditions} conditions and presenting treatment plans, achieving {satisfaction}% client satisfaction and {followup}% treatment compliance.
- **B (Result-first):** Achieved {satisfaction}% client satisfaction and {followup}% treatment compliance by managing {patients} daily patients across {species} species and {conditions} conditions.
- **C (Impact-led):** Sustained {satisfaction}% client satisfaction and {followup}% treatment compliance; managed {patients}-patient daily caseload across {species} species and {conditions} conditions.
- **D (Concise):** Managed {patients} patients/day across {species} species and {conditions} conditions, {satisfaction}% satisfaction, {followup}% compliance.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{species}`: 2 to 6, step 1 (integer)
  - `{conditions}`: 10 to 30, step 5 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{followup}`: 75 to 95, step 5 (percentage)

### VET-0002
**Role:** veterinarian | **Theme:** surgery | **Seniority:** senior | **Verb Context:** operations
**Keywords:** veterinary surgery, soft tissue surgery, orthopedics, surgical outcomes, anesthesia, surgical complications

**Scope:** {surgeries} surgical procedures per month including soft tissue and orthopedic cases across {species} species, with pre-op assessment, surgical execution, and post-op monitoring
**Result:** maintaining a {complication}% surgical complication rate and achieving a {outcome}% successful outcome rate across all surgical cases

**Variations:**
- **A (Standard):** Performed {surgeries} monthly surgical procedures across {species} species including soft tissue and orthopedic cases, maintaining {complication}% complication rate and {outcome}% successful outcome rate.
- **B (Result-first):** Maintained {complication}% complication rate and {outcome}% successful outcomes by performing {surgeries} monthly procedures across {species} species.
- **C (Impact-led):** Achieved {complication}% complication rate and {outcome}% successful outcomes; performed {surgeries} monthly surgical procedures including soft tissue and orthopedic cases across {species} species.
- **D (Concise):** Performed {surgeries} surgical procedures/month across {species} species, {complication}% complications, {outcome}% successful outcomes.

**Variables:**
  - `{surgeries}`: 10 to 50, step 10 (integer)
  - `{species}`: 2 to 5, step 1 (integer)
  - `{complication}`: 1 to 5, step 0.5 (percentage)
  - `{outcome}`: 92 to 99, step 1 (percentage)

### VET-0003
**Role:** vet-tech | **Theme:** patient-care | **Seniority:** junior | **Verb Context:** operations
**Keywords:** veterinary technician, patient monitoring, anesthesia monitoring, venipuncture, treatment administration, veterinary nursing

**Scope:** patient care support for {patients} patients per shift including anesthesia monitoring, venipuncture, medication administration, and post-operative recovery monitoring
**Result:** maintaining a {accuracy}% treatment accuracy rate and supporting {surgeries} surgeries per week with zero patient adverse events over {months} months

**Variations:**
- **A (Standard):** Supported {patients} patients per shift including anesthesia monitoring and post-op recovery, maintaining {accuracy}% treatment accuracy and supporting {surgeries} weekly surgeries with zero adverse events over {months} months.
- **B (Result-first):** Maintained {accuracy}% treatment accuracy and zero adverse events over {months} months by supporting {patients} patients per shift including {surgeries} weekly surgeries.
- **C (Impact-led):** Sustained {accuracy}% treatment accuracy and zero adverse events over {months} months; supported {patients} patients/shift including anesthesia monitoring and {surgeries} weekly surgeries.
- **D (Concise):** Supported {patients} patients/shift and {surgeries} weekly surgeries, {accuracy}% treatment accuracy, zero adverse events over {months} months.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{surgeries}`: 5 to 20, step 5 (integer)
  - `{accuracy}`: 98 to 100, step 0.5 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)

### VET-0004
**Role:** practice-manager | **Theme:** veterinary-operations | **Seniority:** mid | **Verb Context:** operations
**Keywords:** veterinary practice management, staff scheduling, revenue cycle, client retention, practice growth, AAHA accreditation

**Scope:** operations for a {provider}-veterinarian practice with {staff} staff and {visits}K annual patient visits, overseeing scheduling, billing, inventory, and ${revenue}K annual revenue
**Result:** growing annual revenue by ${growth}K and improving client retention from {before}% to {after}%

**Variations:**
- **A (Standard):** Managed operations for a {provider}-vet practice with {staff} staff and {visits}K annual visits, growing revenue by ${growth}K and improving client retention from {before}% to {after}%.
- **B (Result-first):** Grew annual revenue ${growth}K and improved client retention from {before}% to {after}% by managing operations for a {provider}-vet, {staff}-staff practice with {visits}K visits.
- **C (Impact-led):** Grew revenue ${growth}K and improved client retention from {before}% to {after}%; directed operations for a {provider}-vet practice with {staff} staff and {visits}K annual visits.
- **D (Concise):** Managed {provider}-vet practice with {staff} staff and {visits}K visits, revenue up ${growth}K, client retention from {before}% to {after}%.

**Variables:**
  - `{provider}`: 2 to 8, step 1 (integer)
  - `{staff}`: 5 to 25, step 5 (integer)
  - `{visits}`: 2 to 20, step 2 (integer)
  - `{revenue}`: 500 to 5000, step 500 (currency)
  - `{growth}`: 50 to 500, step 50 (currency)
  - `{before}`: 55 to 70, step 5 (percentage)
  - `{after}`: 75 to 90, step 5 (percentage)

### VET-0005
**Role:** vet-tech | **Theme:** client-education | **Seniority:** mid | **Verb Context:** people
**Keywords:** client communication, pet owner education, discharge instructions, preventive care, wellness programs

**Scope:** client education for {clients} pet owners per week on post-operative care, nutrition, parasite prevention, and wellness protocols, coordinating with {vets} veterinarians
**Result:** improving client compliance with preventive care recommendations from {before}% to {after}% and achieving a {satisfaction}% client satisfaction rating

**Variations:**
- **A (Standard):** Educated {clients} pet owners weekly on post-op care and wellness protocols with {vets} veterinarians, improving preventive care compliance from {before}% to {after}% and achieving {satisfaction}% satisfaction.
- **B (Result-first):** Improved preventive care compliance from {before}% to {after}% and achieved {satisfaction}% satisfaction by educating {clients} weekly pet owners on wellness and post-op care.
- **C (Impact-led):** Grew preventive care compliance from {before}% to {after}% and achieved {satisfaction}% satisfaction; educated {clients} weekly pet owners on post-op care and wellness with {vets} veterinarians.
- **D (Concise):** Educated {clients} pet owners/week on wellness and post-op care, compliance from {before}% to {after}%, {satisfaction}% satisfaction.

**Variables:**
  - `{clients}`: 20 to 80, step 10 (integer)
  - `{vets}`: 2 to 8, step 1 (integer)
  - `{before}`: 50 to 65, step 5 (percentage)
  - `{after}`: 75 to 92, step 5 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### VET-0006
**Role:** veterinarian | **Theme:** emergency-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** emergency veterinary medicine, critical care, triage, emergency procedures, VECCS, 24-hour care

**Scope:** emergency and critical care services for {cases} cases per shift in a {bed}-kennel emergency facility, triaging {triage} patients per shift and performing {procedures} emergency procedures per month
**Result:** achieving a {survival}% critical patient survival rate and maintaining average emergency triage-to-treatment time of {tat} minutes

**Variations:**
- **A (Standard):** Managed {cases} emergency cases per shift in a {bed}-kennel facility, performing {procedures} monthly emergency procedures, achieving {survival}% critical survival rate and {tat}-minute triage-to-treatment time.
- **B (Result-first):** Achieved {survival}% critical survival rate and {tat}-minute triage-to-treatment by managing {cases} emergency cases/shift and {procedures} monthly procedures.
- **C (Impact-led):** Reached {survival}% critical survival rate and {tat}-minute triage-to-treatment; managed {cases} emergency cases/shift including {procedures} monthly procedures in a {bed}-kennel facility.
- **D (Concise):** Managed {cases} emergency cases/shift in {bed}-kennel facility, {procedures} procedures/month, {survival}% critical survival, {tat}-min triage-to-treatment.

**Variables:**
  - `{cases}`: 10 to 30, step 5 (integer)
  - `{bed}`: 10 to 40, step 5 (integer)
  - `{triage}`: 5 to 20, step 5 (integer)
  - `{procedures}`: 20 to 80, step 10 (integer)
  - `{survival}`: 85 to 97, step 2 (percentage)
  - `{tat}`: 10 to 30, step 5 (integer)

### VET-0007
**Role:** veterinarian | **Theme:** preventive-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** preventive veterinary medicine, vaccination, parasite prevention, wellness exams, feline medicine, canine medicine

**Scope:** preventive care programs for a practice with {visits}K annual wellness visits, designing {protocols} species-specific vaccination and parasite prevention protocols for {species} species
**Result:** achieving {compliance}% core vaccine compliance rate and reducing preventable disease cases by {disease}% year-over-year

**Variations:**
- **A (Standard):** Developed preventive care protocols for {species} species across {visits}K annual wellness visits, achieving {compliance}% core vaccine compliance and reducing preventable disease cases {disease}% YoY.
- **B (Result-first):** Achieved {compliance}% vaccine compliance and reduced preventable disease {disease}% YoY by developing preventive protocols for {species} species across {visits}K annual wellness visits.
- **C (Impact-led):** Drove {compliance}% vaccine compliance and cut preventable disease {disease}% YoY; developed {protocols} prevention protocols for {species} species across {visits}K annual wellness visits.
- **D (Concise):** Developed {protocols} protocols for {species} species across {visits}K annual visits, {compliance}% vaccine compliance, preventable disease down {disease}% YoY.

**Variables:**
  - `{visits}`: 2 to 20, step 2 (integer)
  - `{protocols}`: 3 to 10, step 1 (integer)
  - `{species}`: 2 to 6, step 1 (integer)
  - `{compliance}`: 80 to 98, step 2 (percentage)
  - `{disease}`: 15 to 40, step 5 (percentage)

### VET-0008
**Role:** vet-tech | **Theme:** anesthesia | **Seniority:** mid | **Verb Context:** operations
**Keywords:** veterinary anesthesia, anesthesia monitoring, pre-anesthetic assessment, intubation, anesthetic protocols, pain management

**Scope:** anesthesia induction, maintenance, and monitoring for {cases} surgical cases per month across {species} species using {agents} anesthetic agent classes and multi-modal pain management
**Result:** achieving a {complication}% anesthetic complication rate and maintaining zero anesthetic mortalities over {months} months

**Variations:**
- **A (Standard):** Managed anesthesia for {cases} monthly cases across {species} species using {agents} agent classes, achieving {complication}% complication rate and zero mortalities over {months} months.
- **B (Result-first):** Achieved {complication}% anesthetic complication rate and zero mortalities over {months} months by managing anesthesia for {cases} monthly cases across {species} species.
- **C (Impact-led):** Maintained {complication}% complication rate and zero anesthetic mortalities over {months} months; managed anesthesia for {cases} monthly cases across {species} species and {agents} agent classes.
- **D (Concise):** Managed anesthesia for {cases} cases/month across {species} species, {complication}% complications, zero mortalities over {months} months.

**Variables:**
  - `{cases}`: 20 to 80, step 10 (integer)
  - `{species}`: 2 to 5, step 1 (integer)
  - `{agents}`: 3 to 6, step 1 (integer)
  - `{complication}`: 1 to 5, step 0.5 (percentage)
  - `{months}`: 12 to 36, step 6 (integer)

### VET-0009
**Role:** practice-manager | **Theme:** inventory-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** veterinary inventory, pharmaceutical management, DEA compliance, supply chain, inventory turnover, cost of goods

**Scope:** pharmaceutical and supply inventory for a {provider}-vet practice with ${inventory}K in annual inventory spend, managing DEA controlled substance logs and {vendors} supplier relationships
**Result:** reducing inventory shrinkage from {before}% to {after}% of spend and cutting average cost per patient visit by ${savings} through supplier renegotiation

**Variations:**
- **A (Standard):** Managed pharmaceutical and supply inventory for a {provider}-vet practice at ${inventory}K annual spend across {vendors} suppliers, reducing shrinkage from {before}% to {after}% and cutting cost per visit ${savings}.
- **B (Result-first):** Reduced inventory shrinkage from {before}% to {after}% and cut cost per visit ${savings} by managing ${inventory}K inventory across {vendors} suppliers.
- **C (Impact-led):** Cut shrinkage from {before}% to {after}% and reduced cost per visit ${savings}; managed ${inventory}K pharmaceutical inventory with DEA logs and {vendors} supplier relationships.
- **D (Concise):** Managed ${inventory}K inventory across {vendors} suppliers, shrinkage from {before}% to {after}%, cost per visit down ${savings}.

**Variables:**
  - `{provider}`: 2 to 8, step 1 (integer)
  - `{inventory}`: 50 to 500, step 50 (currency)
  - `{vendors}`: 3 to 10, step 1 (integer)
  - `{before}`: 5 to 15, step 2 (percentage)
  - `{after}`: 1 to 3, step 0.5 (percentage)
  - `{savings}`: 5 to 30, step 5 (currency)

### VET-0010
**Role:** veterinarian | **Theme:** exotic-animal-medicine | **Seniority:** senior | **Verb Context:** people
**Keywords:** exotic animal medicine, avian medicine, reptile medicine, pocket pets, zoo medicine, exotic species

**Scope:** exotic animal medicine for {patients} patients per week across {species} exotic species categories including avian, reptile, and small mammal, in a referral practice serving {geography} geographic region
**Result:** achieving {diagnosis}% diagnostic accuracy rate for exotic species presentations and growing exotic caseload by {growth}% year-over-year

**Variations:**
- **A (Standard):** Managed exotic medicine for {patients} weekly patients across {species} species categories, achieving {diagnosis}% diagnostic accuracy and growing the exotic caseload {growth}% YoY.
- **B (Result-first):** Achieved {diagnosis}% diagnostic accuracy and grew exotic caseload {growth}% YoY by managing exotic medicine for {patients} weekly patients across {species} species.
- **C (Impact-led):** Drove {diagnosis}% diagnostic accuracy and {growth}% YoY caseload growth; managed exotic medicine for {patients} weekly patients across {species} species categories.
- **D (Concise):** Managed exotic medicine for {patients} patients/week across {species} species, {diagnosis}% diagnostic accuracy, caseload up {growth}% YoY.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{species}`: 3 to 8, step 1 (integer)
  - `{diagnosis}`: 85 to 97, step 2 (percentage)
  - `{growth}`: 15 to 40, step 5 (percentage)

### VET-0011
**Role:** vet-tech | **Theme:** laboratory-diagnostics | **Seniority:** junior | **Verb Context:** operations
**Keywords:** in-house diagnostics, CBC, chemistry panel, urinalysis, cytology, diagnostic testing, IDEXX

**Scope:** in-house diagnostic testing for {tests} samples per day including CBC, chemistry panels, urinalysis, and cytology using IDEXX analyzers across {patients} patients
**Result:** achieving {accuracy}% result accuracy rate and {tat} minute average turnaround time for in-house diagnostics

**Variations:**
- **A (Standard):** Performed {tests} diagnostic tests per day including CBC, chemistry, and urinalysis for {patients} patients, achieving {accuracy}% accuracy and {tat}-minute average turnaround.
- **B (Result-first):** Achieved {accuracy}% accuracy and {tat}-minute turnaround by performing {tests} daily diagnostic tests including CBC, chemistry, and urinalysis for {patients} patients.
- **C (Impact-led):** Maintained {accuracy}% accuracy and {tat}-minute turnaround; performed {tests} daily diagnostics including CBC, chemistry, and urinalysis for {patients} patients.
- **D (Concise):** Performed {tests} diagnostics/day for {patients} patients, {accuracy}% accuracy, {tat}-minute average turnaround.

**Variables:**
  - `{tests}`: 10 to 50, step 10 (integer)
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{accuracy}`: 97 to 100, step 0.5 (percentage)
  - `{tat}`: 15 to 45, step 5 (integer)

### VET-0012
**Role:** practice-manager | **Theme:** client-experience | **Seniority:** senior | **Verb Context:** operations
**Keywords:** client experience, NPS, client communication, client satisfaction, pet owner engagement, client loyalty

**Scope:** a client experience improvement initiative for a {visits}K-visit practice, implementing online booking, automated reminders, and {touchpoints} client communication touchpoints per patient visit
**Result:** growing Net Promoter Score from {nps_before} to {nps_after} and increasing average annual visit frequency from {visits_before} to {visits_after} per patient

**Variations:**
- **A (Standard):** Led client experience initiative for a {visits}K-visit practice with automated reminders and {touchpoints} touchpoints, growing NPS from {nps_before} to {nps_after} and visits from {visits_before} to {visits_after} per patient.
- **B (Result-first):** Grew NPS from {nps_before} to {nps_after} and annual visits from {visits_before} to {visits_after} per patient by leading client experience initiative with {touchpoints} communication touchpoints.
- **C (Impact-led):** Grew NPS from {nps_before} to {nps_after} and visits from {visits_before} to {visits_after} per patient; led client experience initiative for a {visits}K-visit practice with {touchpoints} touchpoints.
- **D (Concise):** Led client experience initiative with {touchpoints} touchpoints, NPS from {nps_before} to {nps_after}, annual visits from {visits_before} to {visits_after} per patient.

**Variables:**
  - `{visits}`: 5 to 30, step 5 (integer)
  - `{touchpoints}`: 3 to 8, step 1 (integer)
  - `{nps_before}`: 40 to 60, step 5 (integer)
  - `{nps_after}`: 70 to 90, step 5 (integer)
  - `{visits_before}`: 1.5 to 2.0, step 0.5 (integer)
  - `{visits_after}`: 2.5 to 3.5, step 0.5 (integer)

### VET-0013
**Role:** veterinarian | **Theme:** large-animal | **Seniority:** mid | **Verb Context:** people
**Keywords:** large animal medicine, equine medicine, bovine medicine, herd health, ambulatory practice, food animal

**Scope:** ambulatory large animal practice serving {farms} farms and {herds} herds within a {radius}-mile territory, providing herd health programs, reproductive services, and emergency care for {patients}K animals annually
**Result:** achieving {compliance}% herd vaccination compliance and reducing herd-level disease incidence by {disease}% over {months} months

**Variations:**
- **A (Standard):** Managed ambulatory large animal practice across {farms} farms and {herds} herds in a {radius}-mile territory, serving {patients}K animals annually and achieving {compliance}% vaccination compliance and {disease}% disease incidence reduction.
- **B (Result-first):** Achieved {compliance}% vaccination compliance and reduced disease incidence {disease}% by managing ambulatory practice across {farms} farms and {herds} herds within a {radius}-mile territory.
- **C (Impact-led):** Drove {compliance}% vaccination compliance and cut disease incidence {disease}%; managed large animal ambulatory practice across {farms} farms and {herds} herds serving {patients}K animals.
- **D (Concise):** Managed large animal practice across {farms} farms and {herds} herds in {radius}-mile territory, {compliance}% vaccination compliance, disease incidence down {disease}%.

**Variables:**
  - `{farms}`: 20 to 100, step 10 (integer)
  - `{herds}`: 20 to 100, step 10 (integer)
  - `{radius}`: 25 to 100, step 25 (integer)
  - `{patients}`: 1 to 20, step 1 (integer)
  - `{compliance}`: 80 to 98, step 2 (percentage)
  - `{disease}`: 20 to 50, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### VET-0014
**Role:** vet-tech | **Theme:** critical-care | **Seniority:** senior | **Verb Context:** operations
**Keywords:** veterinary critical care, ICU monitoring, fluid therapy, oxygen therapy, critical patient assessment, VECCS

**Scope:** critical care nursing for {icu_patients} ICU patients per shift including hemodynamic monitoring, fluid therapy management, and {procedures} nursing procedures per shift across {species} species
**Result:** contributing to a {survival}% critical patient survival rate and reducing ICU length of stay from {los_before} to {los_after} days for the unit

**Variations:**
- **A (Standard):** Managed critical care nursing for {icu_patients} ICU patients per shift across {species} species with {procedures} nursing procedures, contributing to {survival}% survival rate and cutting LOS from {los_before} to {los_after} days.
- **B (Result-first):** Contributed to {survival}% critical survival rate and cut ICU LOS from {los_before} to {los_after} days by managing {icu_patients} ICU patients per shift with {procedures} procedures.
- **C (Impact-led):** Drove {survival}% critical survival rate and cut ICU LOS from {los_before} to {los_after} days; managed {icu_patients} ICU patients/shift across {species} species with hemodynamic monitoring and {procedures} procedures.
- **D (Concise):** Managed {icu_patients} ICU patients/shift across {species} species, {procedures} procedures, {survival}% survival, LOS from {los_before} to {los_after} days.

**Variables:**
  - `{icu_patients}`: 3 to 10, step 1 (integer)
  - `{procedures}`: 5 to 20, step 5 (integer)
  - `{species}`: 2 to 4, step 1 (integer)
  - `{survival}`: 80 to 96, step 2 (percentage)
  - `{los_before}`: 4 to 8, step 1 (integer)
  - `{los_after}`: 2 to 4, step 0.5 (integer)

