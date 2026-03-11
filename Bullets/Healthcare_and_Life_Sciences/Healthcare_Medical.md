# Healthcare / Medical

**Industry ID:** `healthcare-medical` | **Prefix:** `HLTH` | **Target:** 450 bullets

---

### HLTH-0001
**Role:** nurse | **Theme:** patient-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** patient care, nursing, clinical assessment, care coordination, patient outcomes, RN

**Scope:** a caseload of {patients} patients per shift in a {unit} unit, conducting assessments, administering medications, and coordinating care with {providers} interdisciplinary providers
**Result:** maintaining a patient satisfaction score of {sat}/10 and contributing to a {reduction}% reduction in adverse events over {months} months

**Variations:**
- **A (Standard):** Managed {patients} patients per shift in a {unit} unit, coordinating care with {providers} providers, maintaining {sat}/10 patient satisfaction and contributing to a {reduction}% reduction in adverse events over {months} months.
- **B (Result-first):** Maintained {sat}/10 patient satisfaction and contributed to a {reduction}% adverse event reduction by managing {patients} patients per shift and coordinating with {providers} interdisciplinary providers.
- **C (Impact-led):** Sustained {sat}/10 patient satisfaction and reduced adverse events {reduction}% over {months} months; managed {patients}-patient caseload per shift in a {unit} unit with {providers} interdisciplinary providers.
- **D (Concise):** Managed {patients} patients/shift in {unit} unit, {sat}/10 satisfaction, {reduction}% fewer adverse events over {months} months.

**Variables:**
  - `{patients}`: 4 to 12, step 1 (integer)
  - `{providers}`: 3 to 8, step 1 (integer)
  - `{sat}`: 8 to 10, step 0.5 (integer)
  - `{reduction}`: 10 to 40, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0002
**Role:** nurse | **Theme:** medication-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** medication administration, MAR, pharmacology, medication reconciliation, patient safety, five rights

**Scope:** medication administration and reconciliation for {patients} patients daily, reviewing {meds} medication orders per shift for accuracy, interactions, and allergy flags
**Result:** achieving a {accuracy}% medication error-free rate over {months} months and reducing medication discrepancies from {before} to {after} per month

**Variations:**
- **A (Standard):** Administered and reconciled medications for {patients} patients daily, reviewing {meds} orders per shift, achieving {accuracy}% error-free rate over {months} months and cutting discrepancies from {before} to {after} per month.
- **B (Result-first):** Achieved {accuracy}% medication error-free rate and reduced discrepancies from {before} to {after} per month by reviewing {meds} orders per shift for {patients} patients.
- **C (Impact-led):** Maintained {accuracy}% error-free rate over {months} months and cut monthly discrepancies from {before} to {after}; administered and reconciled {meds} medication orders per shift for {patients} patients.
- **D (Concise):** Administered {meds} med orders/shift for {patients} patients, {accuracy}% error-free over {months} months, discrepancies from {before} to {after}/month.

**Variables:**
  - `{patients}`: 4 to 12, step 1 (integer)
  - `{meds}`: 20 to 80, step 10 (integer)
  - `{accuracy}`: 98 to 100, step 0.5 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)
  - `{before}`: 5 to 15, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### HLTH-0003
**Role:** nurse | **Theme:** emergency-response | **Seniority:** senior | **Verb Context:** people
**Keywords:** emergency nursing, rapid response, code blue, trauma nursing, triage, critical care

**Scope:** a rapid response team for a {bed} bed hospital, leading {codes} code responses per month and training {nurses} nursing staff on emergency protocols
**Result:** improving average code-to-intervention time from {before} minutes to {after} minutes and contributing to a {survival}% improvement in code survival rate

**Variations:**
- **A (Standard):** Led rapid response team for a {bed}-bed hospital, managing {codes} monthly codes and training {nurses} nurses, improving code-to-intervention from {before} to {after} minutes and survival rate by {survival}%.
- **B (Result-first):** Improved code-to-intervention from {before} to {after} minutes and survival rate by {survival}% by leading rapid response for a {bed}-bed hospital across {codes} monthly codes.
- **C (Impact-led):** Cut code-to-intervention from {before} to {after} minutes and improved survival rate {survival}%; directed rapid response team for a {bed}-bed hospital, managing {codes} monthly codes and training {nurses} nurses.
- **D (Concise):** Led rapid response for {bed}-bed hospital, {codes} codes/month, {nurses} nurses trained, code time from {before} to {after}min, survival up {survival}%.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{codes}`: 5 to 30, step 5 (integer)
  - `{nurses}`: 10 to 50, step 10 (integer)
  - `{before}`: 5 to 15, step 1 (integer)
  - `{after}`: 2 to 5, step 1 (integer)
  - `{survival}`: 10 to 30, step 5 (percentage)

### HLTH-0004
**Role:** nurse | **Theme:** patient-education | **Seniority:** junior | **Verb Context:** content
**Keywords:** patient education, discharge planning, health literacy, patient teaching, chronic disease management

**Scope:** discharge education programs for {patients} patients per month covering {conditions} chronic conditions including diabetes, hypertension, and heart failure
**Result:** contributing to a {readmit}% reduction in 30-day readmission rate and achieving a {understand}% patient education comprehension score

**Variations:**
- **A (Standard):** Delivered discharge education for {patients} patients monthly across {conditions} chronic conditions, contributing to a {readmit}% 30-day readmission reduction and {understand}% comprehension score.
- **B (Result-first):** Contributed to a {readmit}% 30-day readmission reduction and {understand}% comprehension score by delivering discharge education for {patients} patients across {conditions} conditions.
- **C (Impact-led):** Drove {readmit}% 30-day readmission reduction and {understand}% comprehension score; delivered discharge education for {patients} patients monthly across {conditions} chronic conditions.
- **D (Concise):** Delivered discharge education for {patients} patients/month across {conditions} conditions, readmissions down {readmit}%, {understand}% comprehension.

**Variables:**
  - `{patients}`: 20 to 80, step 10 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{readmit}`: 10 to 35, step 5 (percentage)
  - `{understand}`: 85 to 98, step 5 (percentage)

### HLTH-0005
**Role:** doctor | **Theme:** diagnosis | **Seniority:** mid | **Verb Context:** people
**Keywords:** clinical diagnosis, differential diagnosis, evidence-based medicine, patient assessment, clinical decision-making

**Scope:** a panel of {patients} patients per week across {conditions} primary diagnosis categories, conducting comprehensive assessments and developing individualized treatment plans
**Result:** achieving a {accuracy}% diagnostic accuracy rate and reducing average time-to-diagnosis from {before} days to {after} days

**Variations:**
- **A (Standard):** Managed {patients} patients weekly across {conditions} diagnosis categories, achieving {accuracy}% diagnostic accuracy and reducing time-to-diagnosis from {before} to {after} days.
- **B (Result-first):** Achieved {accuracy}% diagnostic accuracy and cut time-to-diagnosis from {before} to {after} days by managing {patients} patients weekly across {conditions} categories.
- **C (Impact-led):** Reached {accuracy}% diagnostic accuracy and cut time-to-diagnosis from {before} to {after} days; managed {patients}-patient weekly panel across {conditions} diagnosis categories.
- **D (Concise):** Managed {patients} patients/week across {conditions} conditions, {accuracy}% diagnostic accuracy, time-to-diagnosis from {before} to {after} days.

**Variables:**
  - `{patients}`: 20 to 100, step 10 (integer)
  - `{conditions}`: 5 to 20, step 5 (integer)
  - `{accuracy}`: 90 to 99, step 1 (percentage)
  - `{before}`: 5 to 14, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### HLTH-0006
**Role:** doctor | **Theme:** patient-outcomes | **Seniority:** senior | **Verb Context:** operations
**Keywords:** quality improvement, patient outcomes, clinical protocols, evidence-based practice, mortality reduction

**Scope:** a quality improvement initiative targeting {condition} outcomes across a {bed}-bed unit, implementing {protocols} evidence-based protocols and monitoring {metrics} outcome metrics
**Result:** reducing {condition}-related complication rate by {reduction}% and improving 30-day readmission rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Directed a quality improvement initiative for {condition} across a {bed}-bed unit using {protocols} evidence-based protocols, cutting complication rate {reduction}% and readmissions from {before}% to {after}%.
- **B (Result-first):** Reduced {condition} complications {reduction}% and readmissions from {before}% to {after}% by directing a quality improvement initiative with {protocols} protocols across a {bed}-bed unit.
- **C (Impact-led):** Cut {condition} complications {reduction}% and 30-day readmissions from {before}% to {after}%; spearheaded quality improvement initiative with {protocols} protocols across a {bed}-bed unit.
- **D (Concise):** Directed QI initiative for {condition} in {bed}-bed unit with {protocols} protocols, complications down {reduction}%, readmissions from {before}% to {after}%.

**Variables:**
  - `{bed}`: 20 to 100, step 10 (integer)
  - `{protocols}`: 3 to 10, step 1 (integer)
  - `{metrics}`: 5 to 15, step 5 (integer)
  - `{reduction}`: 15 to 45, step 5 (percentage)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)

### HLTH-0007
**Role:** doctor | **Theme:** clinical-research | **Seniority:** senior | **Verb Context:** projects
**Keywords:** clinical research, IRB, clinical trials, research protocols, peer-reviewed publication, grant funding

**Scope:** a clinical research program with {studies} active studies and ${grant}K in grant funding, coordinating {staff} research staff and enrolling {patients} participants
**Result:** publishing {publications} peer-reviewed papers and achieving {funding}% grant renewal rate over {years} years

**Variations:**
- **A (Standard):** Directed {studies} clinical studies with ${grant}K in funding and {staff} research staff, publishing {publications} papers and achieving {funding}% grant renewal over {years} years.
- **B (Result-first):** Published {publications} peer-reviewed papers and achieved {funding}% grant renewal over {years} years by directing {studies} studies with ${grant}K in funding and {staff} research staff.
- **C (Impact-led):** Published {publications} papers and secured {funding}% grant renewal over {years} years; led {studies} clinical studies with ${grant}K funding, {staff} staff, and {patients} participants.
- **D (Concise):** Led {studies} clinical studies with ${grant}K funding and {staff} staff, {publications} papers published, {funding}% grant renewal over {years} years.

**Variables:**
  - `{studies}`: 2 to 8, step 1 (integer)
  - `{grant}`: 100 to 2000, step 100 (currency)
  - `{staff}`: 3 to 15, step 3 (integer)
  - `{patients}`: 50 to 500, step 50 (integer)
  - `{publications}`: 3 to 20, step 1 (integer)
  - `{funding}`: 70 to 100, step 5 (percentage)
  - `{years}`: 2 to 5, step 1 (integer)

### HLTH-0008
**Role:** pharmacist | **Theme:** medication-dispensing | **Seniority:** mid | **Verb Context:** operations
**Keywords:** pharmacy operations, medication dispensing, prescription verification, Rx accuracy, pharmacy management, retail pharmacy

**Scope:** dispensing operations for {prescriptions}K prescriptions per month, verifying accuracy, counseling {patients} patients daily, and supervising {technicians} pharmacy technicians
**Result:** maintaining a {accuracy}% prescription accuracy rate and reducing average prescription wait time from {before} minutes to {after} minutes

**Variations:**
- **A (Standard):** Managed dispensing of {prescriptions}K prescriptions monthly, supervising {technicians} technicians and counseling {patients} patients daily, maintaining {accuracy}% accuracy and cutting wait time from {before} to {after} minutes.
- **B (Result-first):** Maintained {accuracy}% prescription accuracy and cut wait time from {before} to {after} minutes by managing {prescriptions}K monthly prescriptions and supervising {technicians} technicians.
- **C (Impact-led):** Sustained {accuracy}% accuracy and cut wait time from {before} to {after} minutes; managed {prescriptions}K monthly prescriptions, counseled {patients} patients daily, and supervised {technicians} technicians.
- **D (Concise):** Managed {prescriptions}K prescriptions/month with {technicians} technicians, {accuracy}% accuracy, wait time from {before} to {after} minutes.

**Variables:**
  - `{prescriptions}`: 2 to 20, step 2 (integer)
  - `{patients}`: 20 to 100, step 10 (integer)
  - `{technicians}`: 2 to 8, step 1 (integer)
  - `{accuracy}`: 99 to 99.99, step 0.1 (percentage)
  - `{before}`: 20 to 45, step 5 (integer)
  - `{after}`: 5 to 15, step 5 (integer)

### HLTH-0009
**Role:** pharmacist | **Theme:** drug-interaction-review | **Seniority:** mid | **Verb Context:** operations
**Keywords:** drug interaction screening, clinical pharmacy, medication safety, pharmacovigilance, CPOE, clinical decision support

**Scope:** drug interaction and allergy screening for {patients}K patients annually, reviewing {orders}K medication orders and intervening on {interventions} clinically significant interactions
**Result:** preventing {adverse} adverse drug events per year and achieving a {acceptance}% prescriber intervention acceptance rate

**Variations:**
- **A (Standard):** Screened {orders}K medication orders for {patients}K patients annually, intervening on {interventions} significant interactions, preventing {adverse} adverse drug events and achieving {acceptance}% prescriber acceptance.
- **B (Result-first):** Prevented {adverse} adverse drug events annually and achieved {acceptance}% prescriber acceptance by screening {orders}K medication orders and intervening on {interventions} interactions.
- **C (Impact-led):** Prevented {adverse} adverse drug events and achieved {acceptance}% prescriber acceptance; reviewed {orders}K orders for {patients}K patients, intervening on {interventions} significant interactions.
- **D (Concise):** Reviewed {orders}K orders for {patients}K patients, {interventions} interventions, {adverse} adverse events prevented, {acceptance}% prescriber acceptance.

**Variables:**
  - `{patients}`: 1 to 20, step 1 (integer)
  - `{orders}`: 10 to 500, step 10 (integer)
  - `{interventions}`: 50 to 500, step 50 (integer)
  - `{adverse}`: 20 to 200, step 20 (integer)
  - `{acceptance}`: 80 to 98, step 5 (percentage)

### HLTH-0010
**Role:** pharmacist | **Theme:** patient-counseling | **Seniority:** junior | **Verb Context:** people
**Keywords:** patient counseling, medication adherence, health coaching, MTM, HIPAA, patient communication

**Scope:** medication therapy management counseling for {patients} patients per month, focusing on {conditions} chronic conditions and improving adherence to complex medication regimens
**Result:** improving average medication adherence rate from {before}% to {after}% and reducing pharmacy-related hospital admissions by {admits} per quarter

**Variations:**
- **A (Standard):** Provided MTM counseling for {patients} patients monthly across {conditions} conditions, improving adherence from {before}% to {after}% and reducing pharmacy-related hospital admissions by {admits} per quarter.
- **B (Result-first):** Improved medication adherence from {before}% to {after}% and reduced hospital admissions by {admits} per quarter by providing MTM counseling for {patients} patients across {conditions} conditions.
- **C (Impact-led):** Grew adherence from {before}% to {after}% and cut hospital admissions {admits}/quarter; delivered MTM counseling for {patients} patients monthly across {conditions} chronic conditions.
- **D (Concise):** Delivered MTM counseling for {patients} patients/month across {conditions} conditions, adherence from {before}% to {after}%, admissions down {admits}/quarter.

**Variables:**
  - `{patients}`: 20 to 100, step 10 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)
  - `{admits}`: 3 to 15, step 3 (integer)

### HLTH-0011
**Role:** lab-technician | **Theme:** specimen-processing | **Seniority:** junior | **Verb Context:** operations
**Keywords:** specimen processing, laboratory testing, phlebotomy, lab information system, clinical laboratory, turnaround time

**Scope:** {specimens} specimens per shift across {tests} test categories including hematology, chemistry, and microbiology using automated analyzers
**Result:** maintaining a {accuracy}% result accuracy rate and achieving average turnaround time of {tat} minutes for STAT orders

**Variations:**
- **A (Standard):** Processed {specimens} specimens per shift across {tests} test categories, maintaining {accuracy}% accuracy and achieving {tat}-minute average turnaround for STAT orders.
- **B (Result-first):** Maintained {accuracy}% accuracy and {tat}-minute STAT turnaround by processing {specimens} specimens per shift across {tests} test categories.
- **C (Impact-led):** Sustained {accuracy}% accuracy and {tat}-minute STAT turnaround; processed {specimens} specimens per shift spanning {tests} test categories including hematology, chemistry, and microbiology.
- **D (Concise):** Processed {specimens} specimens/shift across {tests} categories, {accuracy}% accuracy, {tat}-minute STAT turnaround.

**Variables:**
  - `{specimens}`: 50 to 300, step 50 (integer)
  - `{tests}`: 5 to 15, step 5 (integer)
  - `{accuracy}`: 99 to 99.99, step 0.1 (percentage)
  - `{tat}`: 30 to 60, step 5 (integer)

### HLTH-0012
**Role:** lab-technician | **Theme:** quality-control | **Seniority:** mid | **Verb Context:** operations
**Keywords:** quality control, CAP accreditation, proficiency testing, QC charting, Westgard rules, laboratory compliance

**Scope:** quality control program for a {tests}-test laboratory menu, running {qc} QC samples per day and managing proficiency testing across {programs} CAP programs
**Result:** achieving {cap}% CAP accreditation compliance and reducing QC failures from {before} to {after} per month

**Variations:**
- **A (Standard):** Managed QC program for a {tests}-test lab menu with {qc} daily QC samples and {programs} CAP programs, achieving {cap}% compliance and reducing monthly QC failures from {before} to {after}.
- **B (Result-first):** Achieved {cap}% CAP compliance and cut monthly QC failures from {before} to {after} by managing QC program for a {tests}-test menu with {qc} daily samples.
- **C (Impact-led):** Reached {cap}% CAP compliance and cut QC failures from {before} to {after} per month; managed {qc} daily QC samples across {tests}-test menu and {programs} CAP programs.
- **D (Concise):** Managed QC for {tests}-test menu with {qc} daily samples and {programs} CAP programs, {cap}% compliance, failures from {before} to {after}/month.

**Variables:**
  - `{tests}`: 20 to 100, step 10 (integer)
  - `{qc}`: 20 to 100, step 10 (integer)
  - `{programs}`: 5 to 20, step 5 (integer)
  - `{cap}`: 95 to 100, step 1 (percentage)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### HLTH-0013
**Role:** health-admin | **Theme:** operations-management | **Seniority:** senior | **Verb Context:** operations
**Keywords:** healthcare operations, hospital administration, capacity management, throughput, operational efficiency, patient flow

**Scope:** operations for a {bed}-bed hospital department managing {staff} clinical and administrative staff, overseeing {budgets}M operating budget and {visits}K annual patient visits
**Result:** improving patient throughput by {throughput}% and reducing average length of stay from {los_before} to {los_after} days

**Variations:**
- **A (Standard):** Directed operations for a {bed}-bed department with {staff} staff and ${budgets}M budget, improving throughput {throughput}% and reducing average LOS from {los_before} to {los_after} days.
- **B (Result-first):** Improved patient throughput {throughput}% and reduced average LOS from {los_before} to {los_after} days by directing operations for a {bed}-bed department with {staff} staff and ${budgets}M budget.
- **C (Impact-led):** Grew throughput {throughput}% and cut average LOS from {los_before} to {los_after} days; directed {bed}-bed department operations with {staff} staff, ${budgets}M budget, and {visits}K annual visits.
- **D (Concise):** Directed {bed}-bed operations with {staff} staff and ${budgets}M budget, throughput up {throughput}%, LOS from {los_before} to {los_after} days.

**Variables:**
  - `{bed}`: 20 to 200, step 20 (integer)
  - `{staff}`: 20 to 200, step 20 (integer)
  - `{budgets}`: 5 to 50, step 5 (currency)
  - `{visits}`: 5 to 100, step 5 (integer)
  - `{throughput}`: 10 to 40, step 5 (percentage)
  - `{los_before}`: 4 to 8, step 1 (integer)
  - `{los_after}`: 2 to 4, step 0.5 (integer)

### HLTH-0014
**Role:** health-admin | **Theme:** regulatory-compliance | **Seniority:** mid | **Verb Context:** operations
**Keywords:** HIPAA, Joint Commission, CMS, regulatory compliance, accreditation, healthcare compliance

**Scope:** regulatory compliance program for a {bed}-bed facility covering {standards} Joint Commission standards, HIPAA safeguards, and CMS conditions of participation
**Result:** achieving Joint Commission accreditation with {findings} findings and passing {audits} CMS audits with zero deficiencies over {years} years

**Variations:**
- **A (Standard):** Managed regulatory compliance for a {bed}-bed facility across {standards} Joint Commission standards, achieving accreditation with {findings} findings and passing {audits} CMS audits with zero deficiencies.
- **B (Result-first):** Achieved Joint Commission accreditation with {findings} findings and passed {audits} CMS audits with zero deficiencies by managing compliance across {standards} standards for a {bed}-bed facility.
- **C (Impact-led):** Earned Joint Commission accreditation with {findings} findings and zero CMS audit deficiencies across {audits} audits; managed {standards} compliance standards for a {bed}-bed facility over {years} years.
- **D (Concise):** Managed {standards} compliance standards for {bed}-bed facility, Joint Commission accreditation with {findings} findings, {audits} CMS audits with zero deficiencies.

**Variables:**
  - `{bed}`: 50 to 500, step 50 (integer)
  - `{standards}`: 50 to 200, step 25 (integer)
  - `{findings}`: 0 to 5, step 1 (integer)
  - `{audits}`: 2 to 6, step 1 (integer)
  - `{years}`: 2 to 5, step 1 (integer)

### HLTH-0015
**Role:** therapist | **Theme:** patient-assessment | **Seniority:** mid | **Verb Context:** people
**Keywords:** clinical assessment, therapy, treatment planning, biopsychosocial assessment, DSM-5, mental health

**Scope:** a caseload of {patients} patients per week, conducting comprehensive biopsychosocial assessments and developing individualized treatment plans across {diagnoses} diagnostic categories
**Result:** achieving a {outcomes}% clinically significant improvement rate and maintaining a {retention}% treatment retention rate through {months} months

**Variations:**
- **A (Standard):** Managed {patients}-patient weekly caseload across {diagnoses} diagnostic categories, achieving {outcomes}% clinically significant improvement and {retention}% treatment retention over {months} months.
- **B (Result-first):** Achieved {outcomes}% improvement rate and {retention}% retention over {months} months by managing {patients} weekly patients across {diagnoses} diagnostic categories.
- **C (Impact-led):** Reached {outcomes}% improvement rate and {retention}% retention over {months} months; managed {patients}-patient caseload across {diagnoses} categories with individualized treatment plans.
- **D (Concise):** Managed {patients} patients/week across {diagnoses} diagnoses, {outcomes}% improvement rate, {retention}% retention over {months} months.

**Variables:**
  - `{patients}`: 10 to 40, step 5 (integer)
  - `{diagnoses}`: 3 to 10, step 1 (integer)
  - `{outcomes}`: 60 to 85, step 5 (percentage)
  - `{retention}`: 70 to 92, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0016
**Role:** registered-nurse | **Theme:** wound-care | **Seniority:** mid | **Verb Context:** operations
**Keywords:** wound care, wound assessment, dressing changes, pressure injury prevention, wound healing, ostomy care

**Scope:** wound care assessments and treatment plans for {patients} patients per week across {wound_types} wound types including pressure injuries, surgical wounds, and diabetic ulcers
**Result:** reducing average wound healing time from {before} weeks to {after} weeks and decreasing hospital-acquired pressure injury rate by {hapi}%

**Variations:**
- **A (Standard):** Managed wound assessments and treatment plans for {patients} weekly patients across {wound_types} wound types, reducing healing time from {before} to {after} weeks and cutting HAPI rate {hapi}%.
- **B (Result-first):** Reduced average healing time from {before} to {after} weeks and cut HAPI rate {hapi}% by managing wound care for {patients} weekly patients across {wound_types} wound types.
- **C (Impact-led):** Cut healing time from {before} to {after} weeks and HAPI rate {hapi}%; managed wound assessments for {patients} weekly patients spanning {wound_types} wound types.
- **D (Concise):** Managed wound care for {patients} patients/week across {wound_types} types, healing time from {before} to {after} weeks, HAPI rate down {hapi}%.

**Variables:**
  - `{patients}`: 10 to 40, step 5 (integer)
  - `{wound_types}`: 3 to 8, step 1 (integer)
  - `{before}`: 6 to 16, step 2 (integer)
  - `{after}`: 2 to 5, step 1 (integer)
  - `{hapi}`: 20 to 60, step 5 (percentage)

### HLTH-0017
**Role:** registered-nurse | **Theme:** iv-therapy | **Seniority:** junior | **Verb Context:** operations
**Keywords:** IV therapy, peripheral IV, central line care, phlebotomy, vascular access, infusion nursing

**Scope:** IV access and infusion therapy for {patients} patients per shift, placing {ivs} peripheral IVs and maintaining {central} central lines with strict aseptic technique
**Result:** achieving a {success}% first-attempt peripheral IV success rate and maintaining zero central line-associated bloodstream infections over {months} months

**Variations:**
- **A (Standard):** Performed IV therapy for {patients} patients per shift with {ivs} peripheral IVs and {central} central lines, achieving {success}% first-attempt success and zero CLABSIs over {months} months.
- **B (Result-first):** Achieved {success}% first-attempt IV success and zero CLABSIs over {months} months by performing IV access for {patients} patients per shift.
- **C (Impact-led):** Maintained {success}% first-attempt success and zero CLABSIs over {months} months; performed IV therapy for {patients} patients/shift including {ivs} peripheral IVs and {central} central lines.
- **D (Concise):** Performed IV therapy for {patients} patients/shift, {success}% first-attempt success, zero CLABSIs over {months} months.

**Variables:**
  - `{patients}`: 4 to 12, step 2 (integer)
  - `{ivs}`: 2 to 8, step 1 (integer)
  - `{central}`: 1 to 4, step 1 (integer)
  - `{success}`: 85 to 98, step 2 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)

### HLTH-0018
**Role:** registered-nurse | **Theme:** shift-coordination | **Seniority:** senior | **Verb Context:** people
**Keywords:** charge nurse, shift coordination, staff assignment, patient acuity, resource allocation, nursing leadership

**Scope:** charge nurse responsibilities coordinating {staff} nursing staff across a {bed}-bed unit per shift, managing patient assignments by acuity and responding to {escalations} clinical escalations per week
**Result:** maintaining unit nurse-to-patient ratio at {ratio} and reducing overtime hours from {before} to {after} hours per pay period

**Variations:**
- **A (Standard):** Led charge nurse duties for {staff} nursing staff across a {bed}-bed unit, managing acuity-based assignments and {escalations} weekly escalations, maintaining {ratio} nurse-patient ratio and cutting overtime from {before} to {after} hours per pay period.
- **B (Result-first):** Maintained {ratio} nurse-patient ratio and cut overtime from {before} to {after} hours per pay period by coordinating {staff} nursing staff across a {bed}-bed unit with {escalations} weekly escalations.
- **C (Impact-led):** Maintained {ratio} nurse-patient ratio and cut overtime from {before} to {after} hours per pay period; led charge nurse coordination for {staff} staff across a {bed}-bed unit.
- **D (Concise):** Led charge nurse for {staff} staff in {bed}-bed unit, {ratio} nurse-patient ratio, overtime from {before} to {after} hours/pay period.

**Variables:**
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{bed}`: 12 to 40, step 4 (integer)
  - `{escalations}`: 5 to 20, step 5 (integer)
  - `{before}`: 20 to 60, step 10 (integer)
  - `{after}`: 5 to 15, step 5 (integer)

### HLTH-0019
**Role:** registered-nurse | **Theme:** infection-control | **Seniority:** mid | **Verb Context:** operations
**Keywords:** infection control, HAI prevention, hand hygiene, isolation precautions, CLABSI, CAUTI, VAP

**Scope:** infection prevention protocols across a {bed}-bed unit, auditing {audits} hand hygiene observations per month and leading {trainings} staff training sessions on isolation and bundle compliance
**Result:** reducing hospital-acquired infection rate from {before} to {after} per {patients}K patient-days and achieving {compliance}% hand hygiene compliance

**Variations:**
- **A (Standard):** Implemented infection prevention across a {bed}-bed unit with {audits} monthly audits and {trainings} staff trainings, reducing HAI rate from {before} to {after} per {patients}K patient-days and achieving {compliance}% hand hygiene compliance.
- **B (Result-first):** Reduced HAI rate from {before} to {after} per {patients}K patient-days and achieved {compliance}% hand hygiene compliance by implementing infection prevention with {audits} monthly audits.
- **C (Impact-led):** Cut HAI rate from {before} to {after} per {patients}K patient-days and achieved {compliance}% hand hygiene compliance; led infection prevention program across a {bed}-bed unit with {audits} monthly audits.
- **D (Concise):** Led infection prevention in {bed}-bed unit, {audits} monthly audits, HAI from {before} to {after} per {patients}K patient-days, {compliance}% hand hygiene compliance.

**Variables:**
  - `{bed}`: 12 to 40, step 4 (integer)
  - `{audits}`: 50 to 300, step 50 (integer)
  - `{trainings}`: 4 to 12, step 2 (integer)
  - `{before}`: 5 to 15, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{patients}`: 1 to 10, step 1 (integer)
  - `{compliance}`: 80 to 99, step 5 (percentage)

### HLTH-0020
**Role:** registered-nurse | **Theme:** documentation | **Seniority:** junior | **Verb Context:** operations
**Keywords:** nursing documentation, EHR charting, clinical documentation, SBAR, nursing notes, Epic charting

**Scope:** accurate and timely nursing documentation for {patients} patients per shift in Epic, completing {assessments} head-to-toe assessments and {notes} nursing notes per shift
**Result:** achieving {timeliness}% on-time documentation completion rate and receiving zero documentation-related compliance flags over {months} months

**Variations:**
- **A (Standard):** Completed nursing documentation for {patients} patients per shift in Epic including {assessments} assessments and {notes} notes, achieving {timeliness}% on-time completion and zero compliance flags over {months} months.
- **B (Result-first):** Achieved {timeliness}% on-time documentation and zero compliance flags over {months} months by completing {assessments} assessments and {notes} notes per shift for {patients} patients.
- **C (Impact-led):** Maintained {timeliness}% on-time documentation and zero compliance flags over {months} months; completed {assessments} assessments and {notes} notes per shift for {patients} patients in Epic.
- **D (Concise):** Documented {assessments} assessments and {notes} notes/shift for {patients} patients, {timeliness}% on-time, zero compliance flags over {months} months.

**Variables:**
  - `{patients}`: 4 to 12, step 2 (integer)
  - `{assessments}`: 4 to 12, step 2 (integer)
  - `{notes}`: 10 to 30, step 5 (integer)
  - `{timeliness}`: 92 to 100, step 2 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)

### HLTH-0021
**Role:** physician-assistant | **Theme:** primary-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** primary care, PA, patient assessment, chronic disease management, preventive care, clinical decision-making

**Scope:** a primary care panel of {patients} patients per day across {conditions} chronic and acute conditions, ordering diagnostics, prescribing medications, and coordinating specialist referrals
**Result:** achieving a {hcc}% HCC coding accuracy rate and maintaining a {satisfaction}% patient satisfaction score over {months} months

**Variations:**
- **A (Standard):** Managed {patients} daily patients across {conditions} conditions including diagnostics and referrals, achieving {hcc}% HCC coding accuracy and {satisfaction}% patient satisfaction over {months} months.
- **B (Result-first):** Achieved {hcc}% HCC accuracy and {satisfaction}% patient satisfaction over {months} months by managing {patients} daily patients across {conditions} chronic and acute conditions.
- **C (Impact-led):** Maintained {hcc}% HCC accuracy and {satisfaction}% satisfaction over {months} months; managed {patients} daily primary care patients across {conditions} conditions with diagnostics and referrals.
- **D (Concise):** Managed {patients} patients/day across {conditions} conditions, {hcc}% HCC accuracy, {satisfaction}% satisfaction over {months} months.

**Variables:**
  - `{patients}`: 15 to 30, step 5 (integer)
  - `{conditions}`: 10 to 25, step 5 (integer)
  - `{hcc}`: 90 to 99, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)

### HLTH-0022
**Role:** physician-assistant | **Theme:** surgical-assist | **Seniority:** mid | **Verb Context:** operations
**Keywords:** surgical assistant, first assist, operative care, post-operative management, surgical PA, OR

**Scope:** first assist duties for {surgeries} procedures per month across {specialties} surgical specialties, managing pre-op assessments, intraoperative assistance, and post-op rounding for {patients} patients
**Result:** contributing to a {complication}% surgical complication rate and reducing post-op rounding time by {reduction}% through standardized protocols

**Variations:**
- **A (Standard):** Provided first-assist for {surgeries} monthly procedures across {specialties} specialties, managing pre-op through post-op for {patients} patients, achieving {complication}% complication rate and cutting rounding time {reduction}%.
- **B (Result-first):** Achieved {complication}% complication rate and cut rounding time {reduction}% by providing first-assist for {surgeries} monthly procedures across {specialties} specialties.
- **C (Impact-led):** Maintained {complication}% complication rate and cut rounding time {reduction}%; provided first-assist for {surgeries} monthly procedures across {specialties} specialties for {patients} patients.
- **D (Concise):** First-assisted {surgeries} procedures/month across {specialties} specialties for {patients} patients, {complication}% complications, rounding time down {reduction}%.

**Variables:**
  - `{surgeries}`: 20 to 60, step 10 (integer)
  - `{specialties}`: 2 to 6, step 1 (integer)
  - `{patients}`: 10 to 40, step 5 (integer)
  - `{complication}`: 1 to 5, step 0.5 (percentage)
  - `{reduction}`: 15 to 40, step 5 (percentage)

### HLTH-0023
**Role:** physician-assistant | **Theme:** urgent-care | **Seniority:** junior | **Verb Context:** people
**Keywords:** urgent care, acute care, triage, minor procedures, urgent care PA, same-day care

**Scope:** {patients} patients per shift in an urgent care setting across {complaints} chief complaint categories, performing {procedures} minor procedures including laceration repair and splinting
**Result:** achieving an average door-to-provider time of {dtp} minutes and a {lwbs}% left-without-being-seen rate below regional benchmark

**Variations:**
- **A (Standard):** Managed {patients} patients per shift across {complaints} chief complaints, performing {procedures} minor procedures, achieving {dtp}-minute door-to-provider time and {lwbs}% LWBS rate.
- **B (Result-first):** Achieved {dtp}-minute door-to-provider time and {lwbs}% LWBS rate by managing {patients} patients per shift across {complaints} complaints with {procedures} minor procedures.
- **C (Impact-led):** Delivered {dtp}-minute door-to-provider time and {lwbs}% LWBS rate; managed {patients} patients/shift across {complaints} complaints and {procedures} minor procedures.
- **D (Concise):** Managed {patients} patients/shift across {complaints} complaints, {procedures} minor procedures, {dtp}-min door-to-provider, {lwbs}% LWBS.

**Variables:**
  - `{patients}`: 15 to 35, step 5 (integer)
  - `{complaints}`: 10 to 25, step 5 (integer)
  - `{procedures}`: 3 to 15, step 3 (integer)
  - `{dtp}`: 10 to 25, step 5 (integer)
  - `{lwbs}`: 1 to 5, step 0.5 (percentage)

### HLTH-0024
**Role:** medical-billing-specialist | **Theme:** claims-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** medical billing, claims submission, CMS-1500, CPT codes, ICD-10, denial management

**Scope:** claims submission and follow-up for {claims}K claims per month across {payers} payer types, reviewing {denials} denied claims per week for appeal opportunities
**Result:** achieving a {clean}% clean claim rate and recovering ${recovered}K in previously denied claims over {months} months

**Variations:**
- **A (Standard):** Processed {claims}K monthly claims across {payers} payer types and appealed {denials} weekly denials, achieving {clean}% clean claim rate and recovering ${recovered}K in denials over {months} months.
- **B (Result-first):** Achieved {clean}% clean claim rate and recovered ${recovered}K in denied claims over {months} months by processing {claims}K monthly claims and appealing {denials} weekly denials.
- **C (Impact-led):** Recovered ${recovered}K in denied claims over {months} months with {clean}% clean claim rate; processed {claims}K monthly claims across {payers} payers and appealed {denials} weekly denials.
- **D (Concise):** Processed {claims}K claims/month across {payers} payers, {clean}% clean claim rate, ${recovered}K denials recovered over {months} months.

**Variables:**
  - `{claims}`: 1 to 20, step 1 (integer)
  - `{payers}`: 5 to 20, step 5 (integer)
  - `{denials}`: 20 to 100, step 10 (integer)
  - `{clean}`: 90 to 99, step 1 (percentage)
  - `{recovered}`: 10 to 200, step 10 (currency)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0025
**Role:** medical-billing-specialist | **Theme:** coding | **Seniority:** mid | **Verb Context:** operations
**Keywords:** medical coding, CPT coding, ICD-10-CM, HCC coding, coding audit, E/M coding

**Scope:** medical coding for {encounters}K encounters per month across {specialties} specialties, conducting {audits} coding audits and providing {trainings} coder education sessions
**Result:** improving coding accuracy from {before}% to {after}% and reducing claim rejection rate from {reject_before}% to {reject_after}%

**Variations:**
- **A (Standard):** Coded {encounters}K encounters monthly across {specialties} specialties, conducted {audits} audits and {trainings} education sessions, improving accuracy from {before}% to {after}% and reducing rejections from {reject_before}% to {reject_after}%.
- **B (Result-first):** Improved coding accuracy from {before}% to {after}% and cut rejections from {reject_before}% to {reject_after}% by coding {encounters}K encounters across {specialties} specialties and conducting {audits} audits.
- **C (Impact-led):** Grew coding accuracy from {before}% to {after}% and cut rejections from {reject_before}% to {reject_after}%; coded {encounters}K monthly encounters across {specialties} specialties with {audits} audits.
- **D (Concise):** Coded {encounters}K encounters/month across {specialties} specialties, accuracy from {before}% to {after}%, rejections from {reject_before}% to {reject_after}%.

**Variables:**
  - `{encounters}`: 1 to 20, step 1 (integer)
  - `{specialties}`: 3 to 10, step 1 (integer)
  - `{audits}`: 5 to 30, step 5 (integer)
  - `{trainings}`: 2 to 8, step 2 (integer)
  - `{before}`: 85 to 92, step 1 (percentage)
  - `{after}`: 95 to 99, step 1 (percentage)
  - `{reject_before}`: 8 to 20, step 2 (percentage)
  - `{reject_after}`: 2 to 6, step 1 (percentage)

### HLTH-0026
**Role:** medical-billing-specialist | **Theme:** revenue-cycle | **Seniority:** senior | **Verb Context:** operations
**Keywords:** revenue cycle management, AR management, denials management, cash collections, RCM optimization, net collection rate

**Scope:** revenue cycle operations for a {provider}-physician practice with ${monthly}K in monthly billings, managing a team of {staff} billing staff and ${ar}K in accounts receivable
**Result:** reducing AR days from {before} to {after} days and increasing net collection rate from {ncr_before}% to {ncr_after}%

**Variations:**
- **A (Standard):** Directed revenue cycle for a {provider}-physician practice at ${monthly}K monthly billings with {staff} staff, reducing AR days from {before} to {after} and improving net collection from {ncr_before}% to {ncr_after}%.
- **B (Result-first):** Reduced AR days from {before} to {after} and improved net collection from {ncr_before}% to {ncr_after}% by directing RCM for a {provider}-physician practice at ${monthly}K monthly billings.
- **C (Impact-led):** Cut AR days from {before} to {after} and grew net collection from {ncr_before}% to {ncr_after}%; directed RCM for {provider}-physician practice with {staff} staff at ${monthly}K monthly billings.
- **D (Concise):** Directed RCM for {provider}-physician practice at ${monthly}K/month with {staff} staff, AR from {before} to {after} days, net collection from {ncr_before}% to {ncr_after}%.

**Variables:**
  - `{provider}`: 3 to 20, step 3 (integer)
  - `{monthly}`: 100 to 2000, step 100 (currency)
  - `{staff}`: 3 to 15, step 3 (integer)
  - `{ar}`: 100 to 2000, step 100 (currency)
  - `{before}`: 45 to 90, step 5 (integer)
  - `{after}`: 20 to 40, step 5 (integer)
  - `{ncr_before}`: 85 to 92, step 1 (percentage)
  - `{ncr_after}`: 95 to 99, step 1 (percentage)

### HLTH-0027
**Role:** health-admin | **Theme:** staffing | **Seniority:** mid | **Verb Context:** people
**Keywords:** healthcare staffing, workforce management, nurse staffing ratios, agency reduction, labor costs, talent acquisition

**Scope:** nursing and allied health staffing for a {bed}-bed facility, managing {fte} FTE positions across {units} clinical units and reducing reliance on agency staff
**Result:** reducing agency staff usage from {agency_before}% to {agency_after}% of total hours and saving ${savings}K annually in labor costs

**Variations:**
- **A (Standard):** Managed staffing for a {bed}-bed facility across {fte} FTEs and {units} units, reducing agency usage from {agency_before}% to {agency_after}% of hours and saving ${savings}K annually.
- **B (Result-first):** Reduced agency usage from {agency_before}% to {agency_after}% and saved ${savings}K annually by managing {fte} FTEs across {units} units for a {bed}-bed facility.
- **C (Impact-led):** Cut agency usage from {agency_before}% to {agency_after}% and saved ${savings}K annually; managed staffing across {fte} FTEs and {units} units for a {bed}-bed facility.
- **D (Concise):** Managed {fte} FTEs across {units} units for {bed}-bed facility, agency usage from {agency_before}% to {agency_after}%, saved ${savings}K annually.

**Variables:**
  - `{bed}`: 50 to 400, step 50 (integer)
  - `{fte}`: 50 to 500, step 50 (integer)
  - `{units}`: 3 to 15, step 3 (integer)
  - `{agency_before}`: 15 to 35, step 5 (percentage)
  - `{agency_after}`: 3 to 8, step 1 (percentage)
  - `{savings}`: 100 to 2000, step 100 (currency)

### HLTH-0028
**Role:** health-admin | **Theme:** budget-management | **Seniority:** senior | **Verb Context:** operations
**Keywords:** healthcare finance, budget management, operating budget, cost center management, variance analysis, financial reporting

**Scope:** a ${budget}M departmental operating budget across {cost_centers} cost centers and {staff} staff, conducting monthly variance analysis and presenting quarterly financial reviews to leadership
**Result:** finishing under budget by ${savings}K for {consecutive} consecutive fiscal years and identifying ${opportunities}K in cost reduction opportunities

**Variations:**
- **A (Standard):** Managed ${budget}M departmental budget across {cost_centers} cost centers and {staff} staff, finishing under budget by ${savings}K for {consecutive} consecutive years and identifying ${opportunities}K in cost reductions.
- **B (Result-first):** Finished under budget by ${savings}K for {consecutive} consecutive years and identified ${opportunities}K in savings by managing ${budget}M budget across {cost_centers} cost centers.
- **C (Impact-led):** Delivered ${savings}K under budget for {consecutive} consecutive years and identified ${opportunities}K in cost reductions; managed ${budget}M budget across {cost_centers} cost centers and {staff} staff.
- **D (Concise):** Managed ${budget}M budget across {cost_centers} cost centers and {staff} staff, under budget ${savings}K for {consecutive} consecutive years, ${opportunities}K in cost reductions identified.

**Variables:**
  - `{budget}`: 5 to 100, step 5 (currency)
  - `{cost_centers}`: 3 to 15, step 3 (integer)
  - `{staff}`: 20 to 200, step 20 (integer)
  - `{savings}`: 50 to 1000, step 50 (currency)
  - `{consecutive}`: 2 to 5, step 1 (integer)
  - `{opportunities}`: 50 to 500, step 50 (currency)

### HLTH-0029
**Role:** clinical-coordinator | **Theme:** care-transitions | **Seniority:** mid | **Verb Context:** operations
**Keywords:** care transitions, discharge planning, care coordination, transitional care, post-acute care, readmission prevention

**Scope:** care transition planning for {patients} high-risk patients per month, coordinating with {providers} post-acute providers and conducting {calls} post-discharge follow-up calls within 48 hours
**Result:** reducing 30-day readmission rate from {before}% to {after}% and achieving {contact}% 48-hour post-discharge contact rate

**Variations:**
- **A (Standard):** Coordinated care transitions for {patients} high-risk patients monthly with {providers} post-acute providers and {calls} follow-up calls, reducing 30-day readmissions from {before}% to {after}% and achieving {contact}% contact rate.
- **B (Result-first):** Reduced 30-day readmissions from {before}% to {after}% and achieved {contact}% 48-hour contact rate by coordinating transitions for {patients} monthly patients with {providers} post-acute providers.
- **C (Impact-led):** Cut 30-day readmissions from {before}% to {after}% and achieved {contact}% 48-hour contact; coordinated care transitions for {patients} high-risk patients with {providers} post-acute providers.
- **D (Concise):** Coordinated transitions for {patients} high-risk patients/month, {before}% to {after}% 30-day readmissions, {contact}% 48-hour contact rate.

**Variables:**
  - `{patients}`: 20 to 100, step 10 (integer)
  - `{providers}`: 5 to 20, step 5 (integer)
  - `{calls}`: 20 to 100, step 10 (integer)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)
  - `{contact}`: 80 to 98, step 2 (percentage)

### HLTH-0030
**Role:** clinical-coordinator | **Theme:** scheduling | **Seniority:** junior | **Verb Context:** operations
**Keywords:** clinical scheduling, patient scheduling, appointment management, template optimization, no-show management, Epic scheduling

**Scope:** appointment scheduling for {providers} providers across {clinics} clinic locations booking {appointments}K appointments per month, managing wait lists and template optimization
**Result:** reducing new patient wait time from {before} to {after} days and increasing provider schedule utilization from {util_before}% to {util_after}%

**Variations:**
- **A (Standard):** Scheduled {appointments}K appointments monthly for {providers} providers across {clinics} locations, reducing new patient wait from {before} to {after} days and growing schedule utilization from {util_before}% to {util_after}%.
- **B (Result-first):** Reduced new patient wait from {before} to {after} days and grew utilization from {util_before}% to {util_after}% by scheduling {appointments}K monthly appointments for {providers} providers.
- **C (Impact-led):** Cut new patient wait from {before} to {after} days and grew utilization from {util_before}% to {util_after}%; managed {appointments}K monthly appointments for {providers} providers across {clinics} locations.
- **D (Concise):** Scheduled {appointments}K appointments/month for {providers} providers across {clinics} locations, wait from {before} to {after} days, utilization from {util_before}% to {util_after}%.

**Variables:**
  - `{providers}`: 3 to 20, step 3 (integer)
  - `{clinics}`: 1 to 5, step 1 (integer)
  - `{appointments}`: 1 to 20, step 1 (integer)
  - `{before}`: 14 to 60, step 7 (integer)
  - `{after}`: 3 to 10, step 1 (integer)
  - `{util_before}`: 70 to 82, step 2 (percentage)
  - `{util_after}`: 88 to 98, step 2 (percentage)

### HLTH-0031
**Role:** occupational-therapist | **Theme:** rehabilitation | **Seniority:** mid | **Verb Context:** people
**Keywords:** occupational therapy, ADL training, functional assessment, OT evaluation, cognitive rehabilitation, adaptive equipment

**Scope:** a caseload of {patients} patients per week across {settings} treatment settings, conducting functional assessments and developing ADL-focused treatment plans for {diagnoses} diagnoses
**Result:** achieving {outcomes}% of patients meeting their functional independence goals and reducing average treatment episode duration from {before} to {after} sessions

**Variations:**
- **A (Standard):** Managed {patients} weekly patients across {settings} settings and {diagnoses} diagnoses, achieving {outcomes}% functional independence goal attainment and reducing episode duration from {before} to {after} sessions.
- **B (Result-first):** Achieved {outcomes}% goal attainment and reduced episode duration from {before} to {after} sessions by managing {patients} weekly patients across {settings} settings and {diagnoses} diagnoses.
- **C (Impact-led):** Drove {outcomes}% functional independence goal attainment and cut episode duration from {before} to {after} sessions; managed {patients} weekly patients across {settings} settings.
- **D (Concise):** Managed {patients} patients/week across {settings} settings and {diagnoses} diagnoses, {outcomes}% goal attainment, episode from {before} to {after} sessions.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{settings}`: 2 to 5, step 1 (integer)
  - `{diagnoses}`: 5 to 15, step 5 (integer)
  - `{outcomes}`: 70 to 92, step 5 (percentage)
  - `{before}`: 15 to 30, step 5 (integer)
  - `{after}`: 8 to 14, step 2 (integer)

### HLTH-0032
**Role:** physical-therapist | **Theme:** musculoskeletal-rehab | **Seniority:** mid | **Verb Context:** people
**Keywords:** physical therapy, musculoskeletal rehabilitation, manual therapy, therapeutic exercise, functional mobility, discharge planning

**Scope:** a caseload of {patients} patients per week for musculoskeletal and post-surgical rehabilitation across {diagnoses} diagnosis categories including orthopedic, neurological, and sports injuries
**Result:** achieving {functional}% of patients returning to prior level of function and reducing average episodes of care from {before} to {after} visits

**Variations:**
- **A (Standard):** Managed {patients} weekly patients across {diagnoses} diagnosis categories, achieving {functional}% return to prior function and reducing average episode length from {before} to {after} visits.
- **B (Result-first):** Achieved {functional}% return-to-function rate and cut average episodes from {before} to {after} visits by managing {patients} weekly patients across {diagnoses} diagnosis categories.
- **C (Impact-led):** Drove {functional}% return to prior function and cut episodes from {before} to {after} visits; managed {patients} weekly patients across {diagnoses} musculoskeletal and surgical diagnoses.
- **D (Concise):** Managed {patients} patients/week across {diagnoses} diagnoses, {functional}% return to function, episodes from {before} to {after} visits.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{diagnoses}`: 5 to 15, step 5 (integer)
  - `{functional}`: 70 to 92, step 5 (percentage)
  - `{before}`: 14 to 24, step 2 (integer)
  - `{after}`: 8 to 12, step 1 (integer)

### HLTH-0033
**Role:** speech-language-pathologist | **Theme:** dysphagia | **Seniority:** mid | **Verb Context:** people
**Keywords:** dysphagia, swallowing therapy, MBSS, FEES, aspiration risk, SLP, feeding therapy

**Scope:** dysphagia evaluations and treatment for {patients} patients per week including {mbs} modified barium swallow studies and {fees} FEES procedures per month
**Result:** achieving {safe}% safe oral feeding reinstatement rate and reducing aspiration-related pneumonia incidents among caseload by {pneumonia}% over {months} months

**Variations:**
- **A (Standard):** Managed dysphagia care for {patients} weekly patients with {mbs} MBS studies and {fees} FEES monthly, achieving {safe}% safe oral feeding reinstatement and reducing aspiration pneumonia {pneumonia}% over {months} months.
- **B (Result-first):** Achieved {safe}% safe oral feeding reinstatement and reduced aspiration pneumonia {pneumonia}% over {months} months by managing dysphagia care for {patients} weekly patients.
- **C (Impact-led):** Reinstated safe oral feeding for {safe}% of patients and cut aspiration pneumonia {pneumonia}% over {months} months; managed dysphagia care for {patients} weekly patients with {mbs} MBS studies.
- **D (Concise):** Managed dysphagia for {patients} patients/week, {mbs} MBS and {fees} FEES/month, {safe}% safe oral feeding, aspiration pneumonia down {pneumonia}% over {months} months.

**Variables:**
  - `{patients}`: 10 to 25, step 5 (integer)
  - `{mbs}`: 4 to 20, step 4 (integer)
  - `{fees}`: 2 to 10, step 2 (integer)
  - `{safe}`: 70 to 92, step 5 (percentage)
  - `{pneumonia}`: 20 to 50, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0034
**Role:** radiologic-technologist | **Theme:** imaging | **Seniority:** junior | **Verb Context:** operations
**Keywords:** radiology, diagnostic imaging, X-ray, CT, MRI, image quality, radiation safety

**Scope:** diagnostic imaging services including {xray} X-rays, {ct} CT scans, and {mri} MRIs per shift, positioning patients and optimizing technical parameters for image quality
**Result:** achieving a {repeat}% image repeat rate and maintaining radiation dose metrics within {dose}% of protocol benchmarks

**Variations:**
- **A (Standard):** Performed {xray} X-rays, {ct} CTs, and {mri} MRIs per shift, achieving {repeat}% image repeat rate and maintaining dose within {dose}% of protocol benchmarks.
- **B (Result-first):** Achieved {repeat}% image repeat rate and doses within {dose}% of protocol by performing {xray} X-rays, {ct} CTs, and {mri} MRIs per shift.
- **C (Impact-led):** Maintained {repeat}% repeat rate and doses within {dose}% of protocol; performed {xray} X-rays, {ct} CTs, and {mri} MRIs per shift with optimized positioning and technical parameters.
- **D (Concise):** Performed {xray} X-rays, {ct} CTs, {mri} MRIs/shift, {repeat}% repeat rate, dose within {dose}% of protocol.

**Variables:**
  - `{xray}`: 10 to 30, step 5 (integer)
  - `{ct}`: 5 to 20, step 5 (integer)
  - `{mri}`: 3 to 10, step 1 (integer)
  - `{repeat}`: 1 to 5, step 0.5 (percentage)
  - `{dose}`: 5 to 15, step 5 (percentage)

### HLTH-0035
**Role:** radiologic-technologist | **Theme:** patient-safety | **Seniority:** mid | **Verb Context:** operations
**Keywords:** radiation safety, ALARA, contrast administration, MRI safety screening, patient monitoring, adverse reaction management

**Scope:** radiation safety program for a {modality}-modality imaging department, auditing {audits} radiation dose reports per month and training {staff} technologists on ALARA principles
**Result:** reducing mean glandular dose by {dose_reduction}% for mammography and achieving {screening}% MRI safety screening compliance

**Variations:**
- **A (Standard):** Managed radiation safety for a {modality}-modality department with {audits} monthly dose audits and {staff} technologist trainings, reducing mammography mean glandular dose {dose_reduction}% and achieving {screening}% MRI safety compliance.
- **B (Result-first):** Reduced mammography mean glandular dose {dose_reduction}% and achieved {screening}% MRI safety compliance by managing radiation safety across a {modality}-modality department.
- **C (Impact-led):** Cut mammography mean glandular dose {dose_reduction}% and achieved {screening}% MRI safety compliance; managed radiation safety for {modality}-modality department with {audits} monthly audits.
- **D (Concise):** Managed radiation safety for {modality}-modality department, {audits} monthly audits, mammography dose down {dose_reduction}%, {screening}% MRI safety compliance.

**Variables:**
  - `{modality}`: 3 to 8, step 1 (integer)
  - `{audits}`: 20 to 100, step 10 (integer)
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{dose_reduction}`: 10 to 30, step 5 (percentage)
  - `{screening}`: 95 to 100, step 1 (percentage)

### HLTH-0036
**Role:** doctor | **Theme:** telehealth | **Seniority:** mid | **Verb Context:** people
**Keywords:** telehealth, virtual care, synchronous telemedicine, remote patient monitoring, digital health, RPM

**Scope:** a telehealth panel of {patients} patients per week delivering virtual visits across {conditions} chronic conditions, integrating remote patient monitoring data from {devices} device types
**Result:** achieving {satisfaction}% patient satisfaction and reducing in-person visit frequency for chronic care patients by {reduction}%

**Variations:**
- **A (Standard):** Managed {patients} weekly telehealth patients across {conditions} conditions with RPM data from {devices} device types, achieving {satisfaction}% satisfaction and reducing in-person visits {reduction}%.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction and reduced in-person visits {reduction}% by managing {patients} weekly telehealth patients across {conditions} conditions with RPM integration.
- **C (Impact-led):** Drove {satisfaction}% satisfaction and cut in-person visits {reduction}%; managed {patients} weekly telehealth patients across {conditions} conditions with {devices} RPM device types.
- **D (Concise):** Managed {patients} telehealth patients/week across {conditions} conditions and {devices} RPM types, {satisfaction}% satisfaction, in-person visits down {reduction}%.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{devices}`: 2 to 8, step 1 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### HLTH-0037
**Role:** doctor | **Theme:** team-based-care | **Seniority:** senior | **Verb Context:** people
**Keywords:** team-based care, interdisciplinary team, care team leadership, physician leadership, collaborative practice, care model

**Scope:** a patient-centered medical home model for a {patients}K-patient panel across a team of {providers} providers including MDs, PAs, NPs, and care coordinators
**Result:** improving PCMH quality scores from {before} to {after} out of 100 and reducing total cost of care by ${savings}K annually

**Variations:**
- **A (Standard):** Led a PCMH model for {patients}K patients across {providers} providers, improving quality scores from {before} to {after}/100 and reducing total cost of care ${savings}K annually.
- **B (Result-first):** Improved PCMH quality scores from {before} to {after}/100 and reduced total care cost ${savings}K annually by leading a {providers}-provider team for {patients}K patients.
- **C (Impact-led):** Improved PCMH scores from {before} to {after}/100 and cut total care cost ${savings}K annually; directed team-based care model for {patients}K patients across {providers} interdisciplinary providers.
- **D (Concise):** Led PCMH model for {patients}K patients with {providers} providers, quality from {before} to {after}/100, cost of care down ${savings}K annually.

**Variables:**
  - `{patients}`: 2 to 20, step 2 (integer)
  - `{providers}`: 5 to 20, step 5 (integer)
  - `{before}`: 60 to 74, step 2 (integer)
  - `{after}`: 80 to 95, step 5 (integer)
  - `{savings}`: 100 to 2000, step 100 (currency)

### HLTH-0038
**Role:** clinical-coordinator | **Theme:** quality-improvement | **Seniority:** mid | **Verb Context:** operations
**Keywords:** quality improvement, PDSA cycles, clinical quality, process improvement, Joint Commission, patient safety

**Scope:** a quality improvement initiative using PDSA cycles targeting {metric} across a {bed}-bed unit, engaging {staff} clinical staff and collecting {datapoints}K data points over {months} months
**Result:** improving the target metric by {improvement}% and sustaining gains at {months_out} months post-intervention

**Variations:**
- **A (Standard):** Led a PDSA-based QI initiative targeting {metric} across a {bed}-bed unit with {staff} staff, improving the metric {improvement}% and sustaining gains at {months_out} months post-intervention.
- **B (Result-first):** Improved {metric} by {improvement}% and sustained gains at {months_out} months by leading a PDSA QI initiative across a {bed}-bed unit with {staff} clinical staff.
- **C (Impact-led):** Improved {metric} by {improvement}% with gains sustained at {months_out} months; led PDSA-based QI initiative across a {bed}-bed unit engaging {staff} clinical staff.
- **D (Concise):** Led PDSA QI initiative for {metric} in {bed}-bed unit with {staff} staff, {improvement}% improvement, gains sustained at {months_out} months.

**Variables:**
  - `{bed}`: 12 to 40, step 4 (integer)
  - `{staff}`: 10 to 50, step 10 (integer)
  - `{datapoints}`: 1 to 20, step 1 (integer)
  - `{months}`: 3 to 12, step 3 (integer)
  - `{improvement}`: 15 to 50, step 5 (percentage)
  - `{months_out}`: 3 to 12, step 3 (integer)

### HLTH-0039
**Role:** occupational-therapist | **Theme:** workplace-ergonomics | **Seniority:** senior | **Verb Context:** operations
**Keywords:** ergonomics, workplace assessment, musculoskeletal injury prevention, return to work, workstation evaluation, industrial rehab

**Scope:** an ergonomics and injury prevention program for a {employees}K-employee organization, conducting {assessments} workstation assessments and {trainings} ergonomic training sessions across {departments} departments
**Result:** reducing musculoskeletal injury claims by {claims}% and cutting workers compensation costs by ${savings}K annually

**Variations:**
- **A (Standard):** Developed ergonomics program for {employees}K employees with {assessments} assessments and {trainings} trainings across {departments} departments, reducing MSK claims {claims}% and saving ${savings}K annually.
- **B (Result-first):** Reduced MSK injury claims {claims}% and saved ${savings}K annually by delivering ergonomics program with {assessments} assessments and {trainings} trainings for {employees}K employees.
- **C (Impact-led):** Cut MSK claims {claims}% and saved ${savings}K annually; directed ergonomics program with {assessments} assessments and {trainings} trainings for {employees}K-employee organization.
- **D (Concise):** Directed ergonomics program for {employees}K employees across {departments} departments, {assessments} assessments, {trainings} trainings, MSK claims down {claims}%, ${savings}K saved.

**Variables:**
  - `{employees}`: 1 to 20, step 1 (integer)
  - `{assessments}`: 50 to 500, step 50 (integer)
  - `{trainings}`: 5 to 30, step 5 (integer)
  - `{departments}`: 5 to 20, step 5 (integer)
  - `{claims}`: 20 to 60, step 5 (percentage)
  - `{savings}`: 50 to 500, step 50 (currency)

### HLTH-0040
**Role:** physical-therapist | **Theme:** sports-medicine | **Seniority:** senior | **Verb Context:** people
**Keywords:** sports medicine, athletic rehabilitation, return-to-sport, injury prevention, functional testing, sports physical therapy

**Scope:** sports rehabilitation program for {athletes} athletes per week across {sports} sports, including return-to-sport testing, injury prevention screens, and collaboration with {coaches} coaching staff
**Result:** achieving {rts}% return-to-sport rate at {months} months post-injury and reducing re-injury rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Managed sports rehab for {athletes} weekly athletes across {sports} sports, achieving {rts}% return-to-sport at {months} months and reducing re-injury from {before}% to {after}%.
- **B (Result-first):** Achieved {rts}% return-to-sport at {months} months and reduced re-injury from {before}% to {after}% by managing sports rehab for {athletes} weekly athletes across {sports} sports.
- **C (Impact-led):** Drove {rts}% return-to-sport at {months} months and cut re-injury from {before}% to {after}%; managed sports rehab for {athletes} weekly athletes across {sports} sports.
- **D (Concise):** Managed sports rehab for {athletes} athletes/week across {sports} sports, {rts}% return-to-sport at {months} months, re-injury from {before}% to {after}%.

**Variables:**
  - `{athletes}`: 10 to 30, step 5 (integer)
  - `{sports}`: 3 to 10, step 1 (integer)
  - `{coaches}`: 3 to 15, step 3 (integer)
  - `{rts}`: 80 to 97, step 5 (percentage)
  - `{months}`: 3 to 12, step 3 (integer)
  - `{before}`: 10 to 25, step 5 (percentage)
  - `{after}`: 2 to 7, step 1 (percentage)

### HLTH-0041
**Role:** nurse-practitioner | **Theme:** chronic-disease | **Seniority:** mid | **Verb Context:** people
**Keywords:** chronic disease management, NP, diabetes management, hypertension, heart failure, preventive care

**Scope:** chronic disease management for {patients} patients per week across {conditions} conditions including diabetes, hypertension, and heart failure in a primary care setting
**Result:** achieving {hba1c}% of diabetic patients at HbA1c goal and reducing hypertension-related ER visits by {er}% year-over-year

**Variations:**
- **A (Standard):** Managed chronic disease for {patients} weekly patients across {conditions} conditions, achieving {hba1c}% of diabetic patients at HbA1c goal and reducing hypertension ER visits {er}% YoY.
- **B (Result-first):** Achieved {hba1c}% of diabetics at HbA1c goal and reduced hypertension ER visits {er}% YoY by managing {patients} weekly patients across {conditions} chronic conditions.
- **C (Impact-led):** Put {hba1c}% of diabetic patients at HbA1c goal and cut hypertension ER visits {er}% YoY; managed chronic disease for {patients} weekly patients across {conditions} conditions.
- **D (Concise):** Managed {patients} patients/week across {conditions} chronic conditions, {hba1c}% at HbA1c goal, hypertension ER visits down {er}% YoY.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{hba1c}`: 50 to 80, step 5 (percentage)
  - `{er}`: 15 to 40, step 5 (percentage)

### HLTH-0042
**Role:** case-manager | **Theme:** utilization-review | **Seniority:** mid | **Verb Context:** operations
**Keywords:** utilization review, case management, length of stay, medical necessity, authorization, UM

**Scope:** utilization review for {cases} inpatient cases per day across {payers} payer types, conducting concurrent reviews and facilitating {referrals} post-acute referrals per week
**Result:** reducing average length of stay from {los_before} to {los_after} days and achieving {denial}% denial overturn rate on appealed cases

**Variations:**
- **A (Standard):** Managed utilization review for {cases} daily inpatient cases across {payers} payers, reducing average LOS from {los_before} to {los_after} days and achieving {denial}% denial overturn rate.
- **B (Result-first):** Reduced average LOS from {los_before} to {los_after} days and achieved {denial}% denial overturn by managing utilization review for {cases} daily cases across {payers} payers.
- **C (Impact-led):** Cut average LOS from {los_before} to {los_after} days and achieved {denial}% denial overturn; managed utilization review for {cases} daily cases across {payers} payers.
- **D (Concise):** Managed UR for {cases} daily cases across {payers} payers, LOS from {los_before} to {los_after} days, {denial}% denial overturn rate.

**Variables:**
  - `{cases}`: 10 to 40, step 5 (integer)
  - `{payers}`: 5 to 20, step 5 (integer)
  - `{referrals}`: 5 to 20, step 5 (integer)
  - `{los_before}`: 4 to 8, step 1 (integer)
  - `{los_after}`: 2 to 4, step 0.5 (integer)
  - `{denial}`: 60 to 90, step 5 (percentage)

### HLTH-0043
**Role:** case-manager | **Theme:** discharge-planning | **Seniority:** junior | **Verb Context:** operations
**Keywords:** discharge planning, post-acute placement, home health, SNF, discharge barriers, social determinants

**Scope:** discharge planning for {patients} inpatients per week, coordinating {placements} post-acute placements per month across SNF, home health, and rehab settings
**Result:** reducing delayed discharge days from {before} to {after} per month and achieving {placement}% same-day discharge goal attainment rate

**Variations:**
- **A (Standard):** Coordinated discharge planning for {patients} weekly inpatients with {placements} monthly placements, reducing delayed discharge days from {before} to {after} and achieving {placement}% same-day goal attainment.
- **B (Result-first):** Reduced delayed discharge days from {before} to {after} and achieved {placement}% same-day goal attainment by coordinating discharge for {patients} weekly inpatients.
- **C (Impact-led):** Cut delayed discharge from {before} to {after} days monthly and hit {placement}% same-day attainment; coordinated discharge for {patients} weekly inpatients with {placements} monthly placements.
- **D (Concise):** Coordinated discharge for {patients} weekly inpatients, {placements} placements/month, delayed days from {before} to {after}, {placement}% same-day attainment.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{placements}`: 10 to 50, step 10 (integer)
  - `{before}`: 20 to 60, step 10 (integer)
  - `{after}`: 5 to 15, step 5 (integer)
  - `{placement}`: 75 to 95, step 5 (percentage)

### HLTH-0044
**Role:** health-educator | **Theme:** community-health | **Seniority:** junior | **Verb Context:** people
**Keywords:** health education, community health, wellness programs, health promotion, SDOH, health literacy

**Scope:** community health education programs serving {participants}K participants per year across {programs} wellness programs and {sites} community sites
**Result:** improving health literacy scores from {before} to {after} out of 10 among participants and increasing preventive care utilization by {prevention}% in target communities

**Variations:**
- **A (Standard):** Delivered health education to {participants}K participants annually across {programs} programs and {sites} sites, improving literacy from {before} to {after}/10 and growing preventive care utilization {prevention}%.
- **B (Result-first):** Improved health literacy from {before} to {after}/10 and grew preventive care utilization {prevention}% by delivering education to {participants}K participants across {programs} programs.
- **C (Impact-led):** Grew health literacy from {before} to {after}/10 and preventive care utilization {prevention}%; delivered education to {participants}K participants across {programs} programs and {sites} sites.
- **D (Concise):** Delivered health education to {participants}K participants across {programs} programs and {sites} sites, literacy from {before} to {after}/10, preventive care up {prevention}%.

**Variables:**
  - `{participants}`: 1 to 20, step 1 (integer)
  - `{programs}`: 3 to 10, step 1 (integer)
  - `{sites}`: 3 to 15, step 3 (integer)
  - `{before}`: 5 to 6, step 0.5 (integer)
  - `{after}`: 7 to 9, step 0.5 (integer)
  - `{prevention}`: 15 to 40, step 5 (percentage)

### HLTH-0045
**Role:** health-educator | **Theme:** chronic-disease-prevention | **Seniority:** mid | **Verb Context:** people
**Keywords:** diabetes prevention, lifestyle coaching, DPP, chronic disease prevention, behavior change, wellness coaching

**Scope:** CDC-recognized Diabetes Prevention Program cohorts serving {participants} participants per cohort across {cohorts} cohorts per year, delivering {sessions} group sessions and {coaching} individual coaching contacts
**Result:** achieving {weight}% average body weight reduction at 12 months and {progression}% reduction in diabetes progression among program completers

**Variations:**
- **A (Standard):** Facilitated DPP cohorts for {participants} participants across {cohorts} annual cohorts with {sessions} group sessions, achieving {weight}% average weight reduction at 12 months and {progression}% diabetes progression reduction.
- **B (Result-first):** Achieved {weight}% average weight reduction at 12 months and {progression}% diabetes progression reduction by facilitating {cohorts} DPP cohorts per year.
- **C (Impact-led):** Drove {weight}% average weight reduction and {progression}% diabetes progression reduction; facilitated DPP cohorts for {participants} participants across {cohorts} annual cohorts.
- **D (Concise):** Facilitated DPP for {participants} participants across {cohorts} cohorts/year, {weight}% weight reduction at 12 months, {progression}% progression reduction.

**Variables:**
  - `{participants}`: 10 to 30, step 5 (integer)
  - `{cohorts}`: 2 to 6, step 1 (integer)
  - `{sessions}`: 16 to 26, step 2 (integer)
  - `{coaching}`: 10 to 30, step 5 (integer)
  - `{weight}`: 5 to 10, step 1 (percentage)
  - `{progression}`: 30 to 60, step 5 (percentage)

### HLTH-0046
**Role:** nurse-practitioner | **Theme:** population-health | **Seniority:** senior | **Verb Context:** operations
**Keywords:** population health management, care management, value-based care, ACO, PCMH, care gaps

**Scope:** population health programs for a {patients}K-patient panel in an ACO, managing {staff} care managers and closing {gaps}K care gaps per year across {conditions} priority conditions
**Result:** reducing total cost of care by ${savings}K annually and improving CMS quality composite score from {before} to {after} out of 100

**Variations:**
- **A (Standard):** Led population health for {patients}K patients in an ACO with {staff} care managers, closing {gaps}K care gaps annually and reducing total cost of care ${savings}K while improving CMS scores from {before} to {after}/100.
- **B (Result-first):** Reduced total care cost ${savings}K and improved CMS scores from {before} to {after}/100 by leading population health for {patients}K patients and closing {gaps}K annual care gaps.
- **C (Impact-led):** Cut total care cost ${savings}K and improved CMS scores from {before} to {after}/100; led population health for {patients}K ACO patients with {staff} care managers closing {gaps}K annual gaps.
- **D (Concise):** Led population health for {patients}K ACO patients with {staff} care managers, {gaps}K gaps closed, cost down ${savings}K, CMS from {before} to {after}/100.

**Variables:**
  - `{patients}`: 5 to 50, step 5 (integer)
  - `{staff}`: 3 to 20, step 3 (integer)
  - `{gaps}`: 1 to 50, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{savings}`: 100 to 2000, step 100 (currency)
  - `{before}`: 60 to 74, step 2 (integer)
  - `{after}`: 80 to 95, step 5 (integer)

### HLTH-0047
**Role:** registered-nurse | **Theme:** oncology-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** oncology nursing, chemotherapy administration, symptom management, palliative care, ONS, cancer care

**Scope:** oncology nursing care for {patients} patients per shift receiving chemotherapy and supportive therapies across {cancer_types} cancer types, managing {protocols} chemotherapy protocols
**Result:** achieving a {symptom}% symptom burden reduction rate at 30-day follow-up and maintaining {toxicity}% grade 3+ toxicity monitoring compliance

**Variations:**
- **A (Standard):** Managed oncology nursing for {patients} patients per shift across {cancer_types} cancer types and {protocols} chemo protocols, achieving {symptom}% symptom burden reduction and {toxicity}% toxicity monitoring compliance.
- **B (Result-first):** Achieved {symptom}% symptom burden reduction and {toxicity}% toxicity compliance by managing oncology nursing for {patients} patients/shift across {cancer_types} cancer types.
- **C (Impact-led):** Drove {symptom}% symptom burden reduction and {toxicity}% toxicity compliance; managed oncology nursing for {patients} patients/shift across {cancer_types} types and {protocols} chemo protocols.
- **D (Concise):** Managed oncology nursing for {patients} patients/shift across {cancer_types} types and {protocols} protocols, {symptom}% symptom reduction, {toxicity}% toxicity compliance.

**Variables:**
  - `{patients}`: 4 to 10, step 1 (integer)
  - `{cancer_types}`: 3 to 8, step 1 (integer)
  - `{protocols}`: 5 to 20, step 5 (integer)
  - `{symptom}`: 50 to 80, step 5 (percentage)
  - `{toxicity}`: 95 to 100, step 1 (percentage)

### HLTH-0048
**Role:** doctor | **Theme:** hospital-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** hospital medicine, hospitalist, inpatient medicine, rounding, care coordination, transitions of care

**Scope:** inpatient hospital medicine rounding for {patients} patients per day across {services} service lines, coordinating discharges with {specialists} specialist teams and {case_managers} case managers
**Result:** maintaining average LOS at {los} days for the top {drgs} DRGs and achieving {readmit}% 30-day readmission rate

**Variations:**
- **A (Standard):** Managed inpatient rounding for {patients} daily patients across {services} services, coordinating with {specialists} specialists and {case_managers} case managers, maintaining {los}-day LOS and {readmit}% 30-day readmission.
- **B (Result-first):** Maintained {los}-day average LOS and {readmit}% 30-day readmission by managing {patients} daily inpatient patients across {services} services.
- **C (Impact-led):** Maintained {los}-day average LOS and {readmit}% 30-day readmission; managed rounding for {patients} daily patients across {services} services with {specialists} specialists.
- **D (Concise):** Managed rounding for {patients} daily patients across {services} services, {los}-day LOS, {readmit}% 30-day readmission.

**Variables:**
  - `{patients}`: 10 to 25, step 5 (integer)
  - `{services}`: 2 to 6, step 1 (integer)
  - `{specialists}`: 3 to 10, step 1 (integer)
  - `{case_managers}`: 2 to 8, step 1 (integer)
  - `{los}`: 3.5 to 6, step 0.5 (integer)
  - `{drgs}`: 5 to 20, step 5 (integer)
  - `{readmit}`: 8 to 18, step 2 (percentage)

### HLTH-0049
**Role:** registered-nurse | **Theme:** pediatric-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** pediatric nursing, child health, family-centered care, developmental assessment, pediatric assessment, PICU

**Scope:** pediatric nursing care for {patients} patients per shift across {age_groups} age groups from neonates to adolescents, including family-centered care coordination with {families} caregivers per shift
**Result:** achieving {satisfaction}% family satisfaction score and reducing pediatric pain assessment completion rate deficits from {before}% to {after}%

**Variations:**
- **A (Standard):** Provided pediatric nursing for {patients} patients/shift across {age_groups} age groups with family-centered coordination for {families} caregivers, achieving {satisfaction}% family satisfaction and improving pain assessment completion from {before}% to {after}%.
- **B (Result-first):** Achieved {satisfaction}% family satisfaction and improved pain assessment completion from {before}% to {after}% by providing family-centered pediatric nursing for {patients} patients across {age_groups} age groups.
- **C (Impact-led):** Drove {satisfaction}% family satisfaction and grew pain assessment completion from {before}% to {after}%; provided pediatric nursing for {patients} patients/shift across {age_groups} age groups.
- **D (Concise):** Provided pediatric nursing for {patients} patients/shift across {age_groups} age groups, {satisfaction}% family satisfaction, pain assessment completion from {before}% to {after}%.

**Variables:**
  - `{patients}`: 3 to 8, step 1 (integer)
  - `{age_groups}`: 3 to 5, step 1 (integer)
  - `{families}`: 3 to 8, step 1 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{before}`: 70 to 85, step 5 (percentage)
  - `{after}`: 92 to 100, step 2 (percentage)

### HLTH-0050
**Role:** doctor | **Theme:** clinical-leadership | **Seniority:** senior | **Verb Context:** people
**Keywords:** physician leadership, medical staff, CMO, department chair, clinical governance, physician engagement

**Scope:** medical department leadership for a {provider}-physician department with ${budget}M budget, overseeing {committees} clinical committees and leading {initiatives} quality and safety initiatives annually
**Result:** improving physician engagement score from {before} to {after} out of 10 and achieving {accreditation} accreditation distinction in {months} months

**Variations:**
- **A (Standard):** Led {provider}-physician department with ${budget}M budget across {committees} committees and {initiatives} annual initiatives, improving engagement from {before} to {after}/10 and achieving {accreditation} accreditation in {months} months.
- **B (Result-first):** Improved physician engagement from {before} to {after}/10 and achieved {accreditation} accreditation in {months} months by leading {provider}-physician department across {committees} committees.
- **C (Impact-led):** Grew engagement from {before} to {after}/10 and achieved {accreditation} accreditation in {months} months; directed {provider}-physician department with ${budget}M budget and {committees} clinical committees.
- **D (Concise):** Led {provider}-physician department with ${budget}M budget and {committees} committees, engagement from {before} to {after}/10, {accreditation} accreditation in {months} months.

**Variables:**
  - `{provider}`: 10 to 50, step 10 (integer)
  - `{budget}`: 5 to 50, step 5 (currency)
  - `{committees}`: 3 to 10, step 1 (integer)
  - `{initiatives}`: 3 to 10, step 1 (integer)
  - `{before}`: 6 to 7, step 0.5 (integer)
  - `{after}`: 8 to 10, step 0.5 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0051
**Role:** registered-nurse | **Theme:** ICU-care | **Seniority:** senior | **Verb Context:** people
**Keywords:** critical care, ICU, hemodynamic monitoring, vasopressors, ventilator management, CRRT

**Scope:** critical care for {patients} ICU patients per shift managing {drips} vasoactive drip titrations and {vents} ventilated patients
**Result:** achieving {bundle}% VAP and CAUTI bundle compliance and maintaining {icu_mortality}% ICU mortality rate below unit benchmark

**Variations:**
- **A (Standard):** Managed critical care for {patients} ICU patients per shift with {drips} vasoactive drips and {vents} vents, achieving {bundle}% bundle compliance and {icu_mortality}% mortality rate below unit benchmark.
- **B (Result-first):** Achieved {bundle}% VAP and CAUTI bundle compliance and maintained {icu_mortality}% mortality below benchmark by managing {patients} ICU patients with {drips} vasoactive drips per shift.
- **C (Impact-led):** Maintained {bundle}% bundle compliance and {icu_mortality}% mortality below benchmark; managed critical care for {patients} ICU patients with {drips} vasoactive drips and {vents} vents per shift.
- **D (Concise):** Managed {patients} ICU patients/shift with {drips} vasoactive drips and {vents} vents, {bundle}% bundle compliance, {icu_mortality}% mortality below benchmark.

**Variables:**
  - `{patients}`: 2 to 6, step 1 (integer)
  - `{drips}`: 2 to 8, step 1 (integer)
  - `{vents}`: 2 to 6, step 1 (integer)
  - `{bundle}`: 92 to 100, step 2 (percentage)
  - `{icu_mortality}`: 5 to 15, step 1 (percentage)

### HLTH-0052
**Role:** registered-nurse | **Theme:** perioperative-care | **Seniority:** mid | **Verb Context:** operations
**Keywords:** perioperative nursing, OR nursing, surgical safety, PACU, pre-op assessment, scrub nurse

**Scope:** perioperative nursing across {cases} surgical cases per shift as a scrub and circulating nurse across {specialties} surgical specialties
**Result:** maintaining {timeout}% surgical time-out compliance and achieving {pacu}% PACU discharge-criteria-met rate within {pacu_time} minutes

**Variations:**
- **A (Standard):** Performed perioperative nursing across {cases} cases per shift in {specialties} specialties, maintaining {timeout}% time-out compliance and {pacu}% PACU discharge criteria met within {pacu_time} minutes.
- **B (Result-first):** Maintained {timeout}% surgical time-out compliance and {pacu}% PACU criteria met within {pacu_time} minutes by performing {cases} perioperative cases per shift across {specialties} specialties.
- **C (Impact-led):** Maintained {timeout}% time-out compliance and {pacu}% PACU discharge criteria within {pacu_time} minutes; performed {cases} perioperative cases per shift across {specialties} specialties.
- **D (Concise):** Performed {cases} perioperative cases/shift across {specialties} specialties, {timeout}% time-out compliance, {pacu}% PACU criteria met in {pacu_time} minutes.

**Variables:**
  - `{cases}`: 6 to 14, step 2 (integer)
  - `{specialties}`: 3 to 8, step 1 (integer)
  - `{timeout}`: 100 to 100, step 0 (percentage)
  - `{pacu}`: 88 to 99, step 2 (percentage)
  - `{pacu_time}`: 60 to 120, step 15 (integer)

### HLTH-0053
**Role:** registered-nurse | **Theme:** dialysis | **Seniority:** mid | **Verb Context:** operations
**Keywords:** hemodialysis, ESRD, AV fistula, dialysis access, renal nursing, nephrology

**Scope:** hemodialysis treatments for {patients} patients per shift monitoring {parameters} hemodynamic parameters throughout each {duration}-hour session
**Result:** achieving {kt_v}% of patients meeting Kt/V adequacy targets and reducing dialysis-related complications from {before} to {after} per {sessions}K sessions

**Variations:**
- **A (Standard):** Managed hemodialysis for {patients} patients per shift monitoring {parameters} parameters per {duration}-hour session, achieving {kt_v}% Kt/V adequacy and cutting complications from {before} to {after} per {sessions}K sessions.
- **B (Result-first):** Achieved {kt_v}% Kt/V adequacy and reduced complications from {before} to {after} per {sessions}K sessions by managing hemodialysis for {patients} patients across {duration}-hour sessions.
- **C (Impact-led):** Drove {kt_v}% Kt/V adequacy and cut complications from {before} to {after} per {sessions}K sessions; managed hemodialysis for {patients} patients/shift across {duration}-hour sessions.
- **D (Concise):** Managed hemodialysis for {patients} patients/shift across {duration}-hour sessions, {kt_v}% Kt/V adequacy, complications from {before} to {after} per {sessions}K sessions.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{parameters}`: 5 to 10, step 1 (integer)
  - `{duration}`: 3 to 5, step 1 (integer)
  - `{kt_v}`: 85 to 99, step 2 (percentage)
  - `{before}`: 5 to 15, step 2 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{sessions}`: 1 to 10, step 1 (integer)

### HLTH-0054
**Role:** registered-nurse | **Theme:** maternity-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** labor and delivery, obstetric nursing, fetal monitoring, postpartum care, L&D, maternal health

**Scope:** labor and delivery nursing for {patients} laboring patients per shift with continuous fetal monitoring and epidural coordination across {providers} OB providers
**Result:** contributing to a {csection}% primary C-section rate below regional benchmark and achieving {satisfaction}% patient satisfaction on the postpartum survey

**Variations:**
- **A (Standard):** Managed L&D nursing for {patients} laboring patients per shift across {providers} OB providers, contributing to a {csection}% primary C-section rate and {satisfaction}% postpartum satisfaction.
- **B (Result-first):** Contributed to a {csection}% primary C-section rate and {satisfaction}% postpartum satisfaction by managing L&D nursing for {patients} patients across {providers} OB providers.
- **C (Impact-led):** Maintained {csection}% primary C-section rate and {satisfaction}% postpartum satisfaction; managed L&D for {patients} laboring patients across {providers} OB providers.
- **D (Concise):** Managed L&D for {patients} laboring patients/shift across {providers} providers, {csection}% C-section rate, {satisfaction}% postpartum satisfaction.

**Variables:**
  - `{patients}`: 2 to 5, step 1 (integer)
  - `{providers}`: 3 to 8, step 1 (integer)
  - `{csection}`: 15 to 28, step 2 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0055
**Role:** medical-assistant | **Theme:** clinical-support | **Seniority:** junior | **Verb Context:** operations
**Keywords:** medical assistant, clinical MA, vital signs, phlebotomy, EHR rooming, prior authorization

**Scope:** clinical support for {providers} providers across {patients} patient visits per day including vital signs, phlebotomy, EHR rooming, and prior authorization coordination
**Result:** achieving {rooming}% on-time rooming rate and reducing prior authorization turnaround from {before} to {after} business days

**Variations:**
- **A (Standard):** Provided clinical support for {providers} providers across {patients} daily visits with phlebotomy and EHR rooming, achieving {rooming}% on-time rooming and cutting authorization turnaround from {before} to {after} days.
- **B (Result-first):** Achieved {rooming}% on-time rooming and cut authorization turnaround from {before} to {after} days by supporting {providers} providers across {patients} daily visits.
- **C (Impact-led):** Maintained {rooming}% on-time rooming and cut authorization turnaround from {before} to {after} days; supported {providers} providers across {patients} daily visits with phlebotomy and EHR rooming.
- **D (Concise):** Supported {providers} providers across {patients} visits/day, {rooming}% on-time rooming, authorization turnaround from {before} to {after} days.

**Variables:**
  - `{providers}`: 2 to 6, step 1 (integer)
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{rooming}`: 88 to 99, step 2 (percentage)
  - `{before}`: 5 to 10, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### HLTH-0056
**Role:** health-admin | **Theme:** patient-experience | **Seniority:** senior | **Verb Context:** operations
**Keywords:** patient experience, HCAHPS, Press Ganey, service excellence, patient satisfaction, CMS star ratings

**Scope:** patient experience strategy for a {bed}-bed facility, implementing {initiatives} service excellence initiatives and analyzing {surveys}K HCAHPS surveys per quarter
**Result:** improving HCAHPS overall rating from the {before}th to {after}th percentile nationally and achieving a {star}-star CMS rating improvement

**Variations:**
- **A (Standard):** Directed patient experience strategy for a {bed}-bed facility with {initiatives} initiatives and {surveys}K quarterly HCAHPS surveys, improving national ranking from {before}th to {after}th percentile and a {star}-star CMS improvement.
- **B (Result-first):** Improved HCAHPS ranking from {before}th to {after}th percentile nationally and achieved a {star}-star CMS improvement by directing experience strategy with {initiatives} initiatives.
- **C (Impact-led):** Grew national HCAHPS ranking from {before}th to {after}th percentile and achieved {star}-star CMS improvement; directed patient experience strategy for a {bed}-bed facility with {initiatives} service initiatives.
- **D (Concise):** Directed patient experience for {bed}-bed facility with {initiatives} initiatives, national rank from {before}th to {after}th percentile, {star}-star CMS improvement.

**Variables:**
  - `{bed}`: 50 to 500, step 50 (integer)
  - `{initiatives}`: 3 to 10, step 1 (integer)
  - `{surveys}`: 1 to 20, step 1 (integer)
  - `{before}`: 30 to 50, step 5 (integer)
  - `{after}`: 70 to 90, step 5 (integer)
  - `{star}`: 1 to 2, step 1 (integer)

### HLTH-0057
**Role:** medical-director | **Theme:** clinical-governance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** medical director, credentialing, peer review, quality committee, physician leadership, clinical governance

**Scope:** medical staff governance for a {bed}-bed facility covering {providers} credentialed providers, chairing {committees} committees and overseeing {peer_reviews} peer reviews annually
**Result:** reducing credentialing turnaround from {before} to {after} days and achieving {peer}% peer review completion rate within required timelines

**Variations:**
- **A (Standard):** Directed medical staff governance for a {bed}-bed facility with {providers} credentialed providers across {committees} committees and {peer_reviews} annual peer reviews, cutting credentialing from {before} to {after} days and achieving {peer}% completion.
- **B (Result-first):** Reduced credentialing turnaround from {before} to {after} days and achieved {peer}% peer review completion by directing governance for a {bed}-bed facility with {providers} providers.
- **C (Impact-led):** Cut credentialing from {before} to {after} days and achieved {peer}% peer review completion; directed governance for a {bed}-bed facility across {committees} committees and {peer_reviews} annual reviews.
- **D (Concise):** Directed governance for {bed}-bed facility with {providers} providers across {committees} committees, credentialing from {before} to {after} days, {peer}% peer review completion.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{providers}`: 100 to 1000, step 100 (integer)
  - `{committees}`: 3 to 8, step 1 (integer)
  - `{peer_reviews}`: 50 to 200, step 50 (integer)
  - `{before}`: 60 to 120, step 15 (integer)
  - `{after}`: 20 to 45, step 5 (integer)
  - `{peer}`: 90 to 100, step 2 (percentage)

### HLTH-0058
**Role:** registered-nurse | **Theme:** oncology-infusion | **Seniority:** mid | **Verb Context:** operations
**Keywords:** oncology infusion, chemotherapy, biotherapy, infusion nursing, adverse reaction, ONS certification

**Scope:** oncology infusion services for {patients} patients per shift administering {agents} chemotherapy and biotherapy agents across {protocols} treatment protocols
**Result:** achieving {reaction}% adverse reaction identification and response rate within {minutes} minutes and maintaining {protocol}% protocol adherence rate

**Variations:**
- **A (Standard):** Administered {agents} chemo and biotherapy agents for {patients} patients/shift across {protocols} protocols, achieving {reaction}% adverse reaction response within {minutes} minutes and {protocol}% protocol adherence.
- **B (Result-first):** Achieved {reaction}% adverse reaction response within {minutes} minutes and {protocol}% protocol adherence by managing infusion for {patients} patients across {agents} agents.
- **C (Impact-led):** Maintained {reaction}% adverse reaction response in {minutes} minutes and {protocol}% protocol adherence; administered {agents} agents for {patients} patients/shift across {protocols} protocols.
- **D (Concise):** Administered {agents} agents for {patients} patients/shift across {protocols} protocols, {reaction}% adverse response in {minutes} minutes, {protocol}% adherence.

**Variables:**
  - `{patients}`: 6 to 14, step 2 (integer)
  - `{agents}`: 3 to 10, step 1 (integer)
  - `{protocols}`: 5 to 20, step 5 (integer)
  - `{reaction}`: 100 to 100, step 0 (percentage)
  - `{minutes}`: 5 to 15, step 5 (integer)
  - `{protocol}`: 98 to 100, step 1 (percentage)

### HLTH-0059
**Role:** nurse-practitioner | **Theme:** dermatology | **Seniority:** mid | **Verb Context:** people
**Keywords:** dermatology NP, skin examination, biopsy, dermatology procedures, skin cancer screening, teledermatology

**Scope:** dermatology patient care for {patients} patients per day including full-body skin exams, {biopsies} biopsies per week, and cryotherapy across {conditions} skin condition categories
**Result:** achieving {detection}% skin cancer detection rate and reducing average time from referral to new patient appointment from {before} to {after} weeks

**Variations:**
- **A (Standard):** Managed dermatology care for {patients} daily patients with {biopsies} weekly biopsies across {conditions} conditions, achieving {detection}% skin cancer detection and cutting referral-to-appointment from {before} to {after} weeks.
- **B (Result-first):** Achieved {detection}% skin cancer detection and cut referral-to-appointment from {before} to {after} weeks by managing {patients} daily patients with {biopsies} weekly biopsies.
- **C (Impact-led):** Drove {detection}% skin cancer detection and cut referral-to-appointment from {before} to {after} weeks; managed dermatology care for {patients} daily patients across {conditions} conditions.
- **D (Concise):** Managed dermatology for {patients} patients/day with {biopsies} biopsies/week across {conditions} conditions, {detection}% skin cancer detection, referral-to-appt from {before} to {after} weeks.

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{biopsies}`: 5 to 20, step 5 (integer)
  - `{conditions}`: 10 to 25, step 5 (integer)
  - `{detection}`: 90 to 99, step 2 (percentage)
  - `{before}`: 8 to 16, step 2 (integer)
  - `{after}`: 2 to 5, step 1 (integer)

### HLTH-0060
**Role:** registered-nurse | **Theme:** neonatal-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** neonatal nursing, NICU, preterm infant, neonatal assessment, thermoregulation, NAS, developmental care

**Scope:** neonatal nursing care for {patients} infants per shift in a Level {level} NICU, managing {monitors} monitoring parameters per infant and supporting {families} families with developmental care education
**Result:** achieving {breastfeeding}% breastfeeding initiation rate and reducing average NICU length of stay from {before} to {after} days for the unit

**Variations:**
- **A (Standard):** Provided NICU nursing for {patients} infants/shift in a Level {level} NICU with {monitors} monitors per infant, achieving {breastfeeding}% breastfeeding initiation and reducing LOS from {before} to {after} days.
- **B (Result-first):** Achieved {breastfeeding}% breastfeeding initiation and reduced NICU LOS from {before} to {after} days by providing care for {patients} infants/shift in a Level {level} NICU.
- **C (Impact-led):** Drove {breastfeeding}% breastfeeding initiation and cut NICU LOS from {before} to {after} days; provided care for {patients} infants/shift in Level {level} NICU with {monitors} monitors each.
- **D (Concise):** Provided NICU care for {patients} infants/shift in Level {level} unit, {breastfeeding}% breastfeeding initiation, LOS from {before} to {after} days.

**Variables:**
  - `{patients}`: 2 to 4, step 1 (integer)
  - `{level}`: 2 to 4, step 1 (integer)
  - `{monitors}`: 5 to 15, step 5 (integer)
  - `{families}`: 2 to 4, step 1 (integer)
  - `{breastfeeding}`: 60 to 90, step 5 (percentage)
  - `{before}`: 20 to 40, step 5 (integer)
  - `{after}`: 14 to 25, step 3 (integer)

### HLTH-0061
**Role:** respiratory-therapist | **Theme:** ventilator-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** respiratory therapy, mechanical ventilation, weaning protocols, ABG, lung-protective ventilation, ventilator bundle

**Scope:** ventilator management and weaning for {patients} mechanically ventilated patients per shift across {units} ICU units, conducting {abg} ABG analyses per shift
**Result:** reducing average ventilator days from {before} to {after} days for the ICU and maintaining {vap}% VAP prevention bundle compliance

**Variations:**
- **A (Standard):** Managed ventilators for {patients} patients per shift across {units} ICUs with {abg} ABG analyses, reducing ventilator days from {before} to {after} and maintaining {vap}% VAP bundle compliance.
- **B (Result-first):** Reduced average ventilator days from {before} to {after} and maintained {vap}% VAP compliance by managing {patients} vents per shift across {units} ICUs.
- **C (Impact-led):** Cut ventilator days from {before} to {after} and maintained {vap}% VAP compliance; managed {patients} ventilated patients/shift across {units} ICUs with {abg} ABG analyses.
- **D (Concise):** Managed {patients} vents/shift across {units} ICUs, {abg} ABGs/shift, ventilator days from {before} to {after}, {vap}% VAP compliance.

**Variables:**
  - `{patients}`: 5 to 15, step 5 (integer)
  - `{units}`: 2 to 5, step 1 (integer)
  - `{abg}`: 5 to 20, step 5 (integer)
  - `{before}`: 8 to 14, step 2 (integer)
  - `{after}`: 4 to 7, step 1 (integer)
  - `{vap}`: 92 to 100, step 2 (percentage)

### HLTH-0062
**Role:** respiratory-therapist | **Theme:** pulmonary-rehab | **Seniority:** mid | **Verb Context:** people
**Keywords:** pulmonary rehabilitation, COPD, exercise tolerance, dyspnea, 6-minute walk test, respiratory therapy

**Scope:** pulmonary rehabilitation program for {patients} patients per month with COPD, IPF, and post-COVID conditions, delivering {sessions} supervised exercise sessions per patient course
**Result:** improving average 6-minute walk test distance from {before}m to {after}m and reducing COPD-related hospitalization among completers by {hosp}%

**Variations:**
- **A (Standard):** Delivered pulmonary rehab to {patients} monthly patients across COPD, IPF, and post-COVID with {sessions} sessions each, improving 6MWT from {before}m to {after}m and reducing COPD hospitalizations {hosp}%.
- **B (Result-first):** Improved 6MWT from {before}m to {after}m and reduced COPD hospitalizations {hosp}% by delivering pulmonary rehab to {patients} monthly patients across {sessions} sessions.
- **C (Impact-led):** Grew 6MWT from {before}m to {after}m and cut COPD hospitalizations {hosp}%; delivered pulmonary rehab to {patients} monthly patients across {sessions} supervised sessions.
- **D (Concise):** Delivered pulmonary rehab to {patients} patients/month across {sessions} sessions, 6MWT from {before}m to {after}m, COPD hospitalizations down {hosp}%.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{sessions}`: 18 to 36, step 6 (integer)
  - `{before}`: 200 to 350, step 25 (integer)
  - `{after}`: 350 to 500, step 25 (integer)
  - `{hosp}`: 20 to 50, step 5 (percentage)

### HLTH-0063
**Role:** dietitian | **Theme:** clinical-nutrition | **Seniority:** mid | **Verb Context:** people
**Keywords:** clinical nutrition, medical nutrition therapy, MNT, nutritional assessment, enteral nutrition, parenteral nutrition

**Scope:** clinical nutrition assessments and medical nutrition therapy for {patients} patients per week across {conditions} conditions including malnutrition, renal disease, and oncology
**Result:** improving malnutrition identification rate from {before}% to {after}% and reducing nutrition-related complications by {reduction}% over {months} months

**Variations:**
- **A (Standard):** Provided MNT for {patients} weekly patients across {conditions} conditions, improving malnutrition identification from {before}% to {after}% and reducing nutrition-related complications {reduction}% over {months} months.
- **B (Result-first):** Improved malnutrition identification from {before}% to {after}% and reduced nutrition complications {reduction}% over {months} months by providing MNT for {patients} weekly patients.
- **C (Impact-led):** Grew malnutrition identification from {before}% to {after}% and cut complications {reduction}% over {months} months; provided MNT for {patients} weekly patients across {conditions} conditions.
- **D (Concise):** Provided MNT for {patients} patients/week across {conditions} conditions, malnutrition ID from {before}% to {after}%, complications down {reduction}% over {months} months.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 70 to 92, step 5 (percentage)
  - `{reduction}`: 15 to 40, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0064
**Role:** dietitian | **Theme:** diabetes-nutrition | **Seniority:** mid | **Verb Context:** people
**Keywords:** diabetes education, DSMES, carbohydrate counting, glycemic management, CDE, diabetes nutrition counseling

**Scope:** diabetes self-management education and nutrition counseling for {patients} patients per week in DSMES programs, delivering {hours} education hours per patient and coordinating with {providers} prescribers
**Result:** achieving {hba1c}% of participants reducing HbA1c by 1 point or more at 3 months and a {completion}% program completion rate

**Variations:**
- **A (Standard):** Delivered DSMES and nutrition counseling for {patients} weekly patients with {hours} education hours per patient, achieving {hba1c}% with 1-point HbA1c reduction at 3 months and {completion}% completion.
- **B (Result-first):** Achieved {hba1c}% 1-point HbA1c reduction at 3 months and {completion}% completion by delivering DSMES for {patients} weekly patients with {hours} education hours.
- **C (Impact-led):** Drove {hba1c}% 1-point HbA1c reduction and {completion}% completion; delivered DSMES and nutrition counseling for {patients} weekly patients with {hours} hours each.
- **D (Concise):** Delivered DSMES for {patients} patients/week with {hours} hours/patient, {hba1c}% 1-point HbA1c reduction at 3 months, {completion}% completion.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{hours}`: 4 to 10, step 2 (integer)
  - `{providers}`: 3 to 10, step 1 (integer)
  - `{hba1c}`: 50 to 80, step 5 (percentage)
  - `{completion}`: 70 to 92, step 5 (percentage)

### HLTH-0065
**Role:** health-admin | **Theme:** technology-implementation | **Seniority:** senior | **Verb Context:** projects
**Keywords:** EHR implementation, health IT, go-live management, change management, project management, Epic implementation

**Scope:** a health IT implementation project for {bed}-bed health system across {sites} sites and {users}K end users, managing {vendors} vendor relationships and a ${budget}M project budget
**Result:** delivering go-live {days} days ahead of schedule, {pct}% under budget, and achieving {adoption}% EHR adoption rate within 90 days

**Variations:**
- **A (Standard):** Directed health IT implementation for {bed}-bed system across {sites} sites and {users}K users at ${budget}M, delivering {days} days early, {pct}% under budget, and {adoption}% adoption within 90 days.
- **B (Result-first):** Delivered go-live {days} days early, {pct}% under budget, and {adoption}% adoption within 90 days by directing IT implementation for {users}K users across {sites} sites.
- **C (Impact-led):** Delivered {days} days early, {pct}% under budget, and {adoption}% adoption within 90 days; directed health IT implementation for {bed}-bed system across {sites} sites and {users}K users.
- **D (Concise):** Directed health IT for {bed}-bed system across {sites} sites and {users}K users, {days} days early, {pct}% under budget, {adoption}% adoption in 90 days.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{sites}`: 3 to 20, step 3 (integer)
  - `{users}`: 1 to 20, step 1 (integer)
  - `{vendors}`: 3 to 10, step 1 (integer)
  - `{budget}`: 5 to 100, step 5 (currency)
  - `{days}`: 5 to 30, step 5 (integer)
  - `{pct}`: 5 to 20, step 5 (percentage)
  - `{adoption}`: 85 to 99, step 2 (percentage)

### HLTH-0066
**Role:** registered-nurse | **Theme:** stroke-care | **Seniority:** mid | **Verb Context:** operations
**Keywords:** stroke nursing, acute stroke, tPA administration, NIH stroke scale, stroke protocol, telestroke

**Scope:** acute stroke care on a {bed}-bed stroke unit, managing {tpa} tPA activations per month and conducting NIHSS assessments within {minutes} minutes of patient arrival
**Result:** achieving {door_to_needle}% of tPA-eligible patients treated within 60-minute door-to-needle time and contributing to a {outcome}% favorable neurological outcome rate

**Variations:**
- **A (Standard):** Managed acute stroke care on a {bed}-bed unit with {tpa} monthly tPA activations, achieving {door_to_needle}% door-to-needle within 60 minutes and {outcome}% favorable neurological outcomes.
- **B (Result-first):** Achieved {door_to_needle}% door-to-needle within 60 minutes and {outcome}% favorable outcomes by managing acute stroke with {tpa} monthly tPA activations on a {bed}-bed unit.
- **C (Impact-led):** Drove {door_to_needle}% door-to-needle within 60 minutes and {outcome}% favorable outcomes; managed {tpa} monthly tPA activations on a {bed}-bed stroke unit.
- **D (Concise):** Managed {tpa} tPA activations/month on {bed}-bed stroke unit, {door_to_needle}% door-to-needle under 60 min, {outcome}% favorable outcomes.

**Variables:**
  - `{bed}`: 10 to 30, step 5 (integer)
  - `{tpa}`: 5 to 20, step 5 (integer)
  - `{minutes}`: 10 to 25, step 5 (integer)
  - `{door_to_needle}`: 80 to 99, step 5 (percentage)
  - `{outcome}`: 60 to 85, step 5 (percentage)

### HLTH-0067
**Role:** registered-nurse | **Theme:** cardiac-care | **Seniority:** mid | **Verb Context:** operations
**Keywords:** cardiac nursing, telemetry, arrhythmia recognition, cardiac monitoring, EKG interpretation, ACLS

**Scope:** cardiac nursing on a {bed}-bed telemetry unit, monitoring {rhythms} arrhythmia events per shift and responding to {alarms} critical alarm notifications with appropriate interventions
**Result:** achieving {recognition}% life-threatening arrhythmia recognition rate and maintaining {response}% appropriate response rate within {minutes} minutes

**Variations:**
- **A (Standard):** Provided cardiac nursing on a {bed}-bed telemetry unit managing {rhythms} arrhythmia events per shift, achieving {recognition}% life-threatening recognition and {response}% appropriate response within {minutes} minutes.
- **B (Result-first):** Achieved {recognition}% arrhythmia recognition and {response}% response within {minutes} minutes by managing {rhythms} events per shift on a {bed}-bed telemetry unit.
- **C (Impact-led):** Maintained {recognition}% arrhythmia recognition and {response}% response within {minutes} minutes; managed cardiac nursing for {bed}-bed telemetry unit with {rhythms} events per shift.
- **D (Concise):** Managed {bed}-bed telemetry unit with {rhythms} arrhythmia events/shift, {recognition}% recognition, {response}% response within {minutes} minutes.

**Variables:**
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{rhythms}`: 5 to 20, step 5 (integer)
  - `{alarms}`: 10 to 50, step 10 (integer)
  - `{recognition}`: 100 to 100, step 0 (percentage)
  - `{response}`: 95 to 100, step 1 (percentage)
  - `{minutes}`: 3 to 10, step 1 (integer)

### HLTH-0068
**Role:** registered-nurse | **Theme:** surgical-wound-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** post-surgical wound care, incision assessment, surgical site infection prevention, dressing changes, wound documentation

**Scope:** post-surgical wound assessments and dressing changes for {patients} patients per shift, documenting {wounds} wound assessments per shift and coordinating with {surgeons} surgical teams on healing progress
**Result:** achieving a {ssi}% surgical site infection rate below the NHSN benchmark and {documentation}% wound documentation completion rate

**Variations:**
- **A (Standard):** Performed wound assessments and dressings for {patients} patients/shift with {wounds} assessments, achieving {ssi}% SSI rate below NHSN benchmark and {documentation}% documentation completion.
- **B (Result-first):** Achieved {ssi}% SSI rate below NHSN benchmark and {documentation}% documentation completion by performing {wounds} wound assessments per shift for {patients} patients.
- **C (Impact-led):** Maintained {ssi}% SSI rate below NHSN benchmark and {documentation}% documentation completion; performed wound care for {patients} patients/shift with {wounds} assessments.
- **D (Concise):** Performed wound care for {patients} patients/shift, {wounds} assessments/shift, {ssi}% SSI rate, {documentation}% documentation completion.

**Variables:**
  - `{patients}`: 4 to 12, step 2 (integer)
  - `{wounds}`: 4 to 12, step 2 (integer)
  - `{surgeons}`: 2 to 6, step 1 (integer)
  - `{ssi}`: 1 to 4, step 0.5 (percentage)
  - `{documentation}`: 97 to 100, step 1 (percentage)

### HLTH-0069
**Role:** health-admin | **Theme:** clinical-quality | **Seniority:** mid | **Verb Context:** operations
**Keywords:** clinical quality management, HEDIS, CMS quality, quality reporting, regulatory compliance, quality metrics

**Scope:** clinical quality reporting for {measures} HEDIS and CMS quality measures across {providers}K providers and {patients}M patients in a managed care plan
**Result:** improving composite HEDIS score from the {before}th to {after}th percentile nationally and unlocking ${incentive}M in value-based care incentive payments

**Variations:**
- **A (Standard):** Managed quality reporting for {measures} measures across {providers}K providers and {patients}M patients, improving HEDIS composite from {before}th to {after}th percentile and unlocking ${incentive}M in VBC incentives.
- **B (Result-first):** Improved HEDIS composite from {before}th to {after}th percentile and unlocked ${incentive}M in VBC incentives by managing {measures} quality measures across {providers}K providers.
- **C (Impact-led):** Grew HEDIS composite from {before}th to {after}th percentile and unlocked ${incentive}M in VBC incentives; managed {measures} measures across {providers}K providers and {patients}M patients.
- **D (Concise):** Managed {measures} quality measures for {providers}K providers and {patients}M patients, HEDIS from {before}th to {after}th percentile, ${incentive}M VBC incentives unlocked.

**Variables:**
  - `{measures}`: 20 to 80, step 10 (integer)
  - `{providers}`: 1 to 20, step 1 (integer)
  - `{patients}`: 1 to 10, step 1 (integer)
  - `{before}`: 30 to 50, step 5 (integer)
  - `{after}`: 65 to 90, step 5 (integer)
  - `{incentive}`: 1 to 20, step 1 (currency)

### HLTH-0070
**Role:** social-worker | **Theme:** palliative-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** palliative care, hospice, advance care planning, goals of care, end-of-life, psychosocial support

**Scope:** palliative care social work services for {patients} patients and families per week in inpatient and outpatient settings, facilitating {goals_of_care} goals-of-care conversations per month
**Result:** achieving {acp}% advance directive completion rate among patients and reducing unwanted aggressive interventions in the last {days} days of life by {reduction}%

**Variations:**
- **A (Standard):** Provided palliative care social work for {patients} weekly patients with {goals_of_care} monthly goals-of-care conversations, achieving {acp}% advance directive completion and reducing unwanted interventions {reduction}% in the last {days} days.
- **B (Result-first):** Achieved {acp}% advance directive completion and reduced unwanted interventions {reduction}% by facilitating {goals_of_care} monthly goals-of-care conversations for {patients} weekly patients.
- **C (Impact-led):** Drove {acp}% advance directive completion and cut unwanted interventions {reduction}% in the last {days} days; provided palliative social work for {patients} weekly patients.
- **D (Concise):** Provided palliative social work for {patients} patients/week, {goals_of_care} goals-of-care conversations/month, {acp}% advance directives, interventions down {reduction}% in last {days} days.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{goals_of_care}`: 10 to 40, step 5 (integer)
  - `{acp}`: 50 to 80, step 5 (percentage)
  - `{days}`: 30 to 90, step 30 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### HLTH-0071
**Role:** registered-nurse | **Theme:** mental-health-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** psychiatric nursing, mental health nursing, de-escalation, therapeutic communication, safe environment, milieu

**Scope:** psychiatric nursing care for {patients} patients per shift on a {bed}-bed inpatient unit, conducting {assessments} mental status assessments per shift and implementing {interventions} therapeutic milieu interventions
**Result:** achieving {satisfaction}% patient satisfaction and a {restraint}% physical restraint-free rate over {months} months

**Variations:**
- **A (Standard):** Managed psychiatric nursing care for {patients} patients per shift o, achieving {satisfaction}% patient satisfaction and a {restraint}% physical restraint-free rate over {months} months.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction and a {restraint}% physical restraint-free rate over {months} months by managing psychiatric nursing care for {patients} patients per shift o.
- **C (Impact-led):** Achieved {satisfaction}% patient satisfaction and a {restraint}% physical restraint-free rate over {months} months; managed psychiatric nursing care for {patients} patients per shift on a {bed}-.
- **D (Concise):** Managed psychiatric nursing care for {patients} patients per sh, achieving {satisfaction}% patient satisfaction and a {restraint}% physical restr.

**Variables:**
  - `{patients}`: 6 to 15, step 3 (integer)
  - `{bed}`: 12 to 30, step 6 (integer)
  - `{assessments}`: 6 to 15, step 3 (integer)
  - `{interventions}`: 5 to 20, step 5 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{restraint}`: 85 to 100, step 5 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)

### HLTH-0072
**Role:** registered-nurse | **Theme:** float-pool | **Seniority:** junior | **Verb Context:** operations
**Keywords:** float pool, cross-training, multi-unit competency, staffing flexibility, clinical versatility

**Scope:** float pool assignments across {units} clinical units per month maintaining competency validation across {competencies} unit-specific skill sets
**Result:** completing {competency}% annual competency validations on time and receiving {commendations} unit manager commendations over {months} months

**Variations:**
- **A (Standard):** Managed float pool assignments across {units} clinical units per mon, completing {competency}% annual competency validations on time and receiving {commendations} unit manager commendations over {months} months.
- **B (Result-first):** Completed {competency}% annual competency validations on time and receiving {commendations} unit manager commendations over {months} months by managing float pool assignments across {units} clinical units per mon.
- **C (Impact-led):** completing {competency}% annual competency validations on time and receiving {commendations} unit manager commendations over {months} months; managed float pool assignments across {units} clinical units per month maintai.
- **D (Concise):** Managed float pool assignments across {units} clinical units pe, completing {competency}% annual competency validations on time and receiving {co.

**Variables:**
  - `{units}`: 5 to 15, step 5 (integer)
  - `{competencies}`: 10 to 30, step 5 (integer)
  - `{competency}`: 100 to 100, step 0 (percentage)
  - `{commendations}`: 3 to 10, step 1 (integer)
  - `{months}`: 12 to 24, step 6 (integer)

### HLTH-0073
**Role:** medical-scribe | **Theme:** clinical-documentation | **Seniority:** junior | **Verb Context:** content
**Keywords:** medical scribing, clinical documentation, SOAP notes, EHR, physician support, chart accuracy

**Scope:** real-time documentation for {providers} physicians across {visits} patient visits per shift capturing HPI, physical exam, assessment, and plan
**Result:** achieving {accuracy}% chart accuracy rate and reducing average physician documentation time by {reduction}% per encounter

**Variations:**
- **A (Standard):** Managed real-time documentation for {providers} physicians across {v, achieving {accuracy}% chart accuracy rate and reducing average physician documentation time by {reduction}% per encounter.
- **B (Result-first):** Achieved {accuracy}% chart accuracy rate and Reduced average physician documentation time by {reduction}% per encounter by managing real-time documentation for {providers} physicians across {v.
- **C (Impact-led):** Achieved {accuracy}% chart accuracy rate and Reduced average physician documentation time by {reduction}% per encounter; managed real-time documentation for {providers} physicians across {visits} pat.
- **D (Concise):** Managed real-time documentation for {providers} physicians acro, achieving {accuracy}% chart accuracy rate and reducing average physician documen.

**Variables:**
  - `{providers}`: 1 to 4, step 1 (integer)
  - `{visits}`: 20 to 60, step 10 (integer)
  - `{accuracy}`: 97 to 100, step 1 (percentage)
  - `{reduction}`: 30 to 60, step 5 (percentage)

### HLTH-0074
**Role:** dietitian | **Theme:** renal-nutrition | **Seniority:** senior | **Verb Context:** people
**Keywords:** renal nutrition, CKD, ESRD, phosphorus management, fluid restriction, renal dietitian

**Scope:** renal nutrition therapy for {patients} dialysis and CKD patients per week, managing dietary phosphorus, potassium, and fluid restrictions across {stages} CKD stages
**Result:** achieving {labs}% of patients meeting phosphorus target range and reducing dietitian-driven hospitalizations by {hosp}% over {months} months

**Variations:**
- **A (Standard):** Managed renal nutrition therapy for {patients} dialysis and ckd pati, achieving {labs}% of patients meeting phosphorus target range and reducing dietitian-driven hospitalizations by {hosp}% over {months} months.
- **B (Result-first):** Achieved {labs}% of patients meeting phosphorus target range and Reduced dietitian-driven hospitalizations by {hosp}% over {months} months by managing renal nutrition therapy for {patients} dialysis and ckd pati.
- **C (Impact-led):** Achieved {labs}% of patients meeting phosphorus target range and Reduced dietitian-driven hospitalizations by {hosp}% over {months} months; managed renal nutrition therapy for {patients} dialysis and ckd patients per w.
- **D (Concise):** Managed renal nutrition therapy for {patients} dialysis and ckd, achieving {labs}% of patients meeting phosphorus target range and reducing dieti.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{stages}`: 3 to 5, step 1 (integer)
  - `{labs}`: 65 to 88, step 5 (percentage)
  - `{hosp}`: 15 to 40, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0075
**Role:** dietitian | **Theme:** eating-disorders | **Seniority:** mid | **Verb Context:** people
**Keywords:** eating disorder nutrition, ED treatment, meal support, FBT, weight restoration, dietitian

**Scope:** nutrition counseling and meal support for {patients} eating disorder patients per week across {diagnoses} diagnoses including AN, BN, and ARFID
**Result:** achieving {weight}% of anorexia patients reaching weight restoration targets and a {retention}% treatment retention rate at {months} months

**Variations:**
- **A (Standard):** Managed nutrition counseling and meal support for {patients} eating , achieving {weight}% of anorexia patients reaching weight restoration targets and a {retention}% treatment retention rate at {months} months.
- **B (Result-first):** Achieved {weight}% of anorexia patients reaching weight restoration targets and a {retention}% treatment retention rate at {months} months by managing nutrition counseling and meal support for {patients} eating .
- **C (Impact-led):** Achieved {weight}% of anorexia patients reaching weight restoration targets and a {retention}% treatment retention rate at {months} months; managed nutrition counseling and meal support for {patients} eating disorder p.
- **D (Concise):** Managed nutrition counseling and meal support for {patients} ea, achieving {weight}% of anorexia patients reaching weight restoration targets and.

**Variables:**
  - `{patients}`: 10 to 25, step 5 (integer)
  - `{diagnoses}`: 3 to 5, step 1 (integer)
  - `{weight}`: 60 to 85, step 5 (percentage)
  - `{retention}`: 70 to 92, step 5 (percentage)
  - `{months}`: 6 to 12, step 3 (integer)

### HLTH-0076
**Role:** registered-nurse | **Theme:** transplant-care | **Seniority:** senior | **Verb Context:** people
**Keywords:** transplant nursing, solid organ transplant, immunosuppression, rejection monitoring, transplant coordinator, UNOS

**Scope:** transplant nursing care for {patients} pre- and post-transplant patients per week managing immunosuppression regimens across {organs} organ types
**Result:** contributing to a {survival}% 1-year graft survival rate and achieving {rejection}% acute rejection episode rate below national benchmark

**Variations:**
- **A (Standard):** Managed transplant nursing care for {patients} pre- and post-transpl, contributing to a {survival}% 1-year graft survival rate and achieving {rejection}% acute rejection episode rate below national benchmark.
- **B (Result-first):** Contributed to a {survival}% 1-year graft survival rate and Achieved {rejection}% acute rejection episode rate below national benchmark by managing transplant nursing care for {patients} pre- and post-transpl.
- **C (Impact-led):** Contributed to a {survival}% 1-year graft survival rate and Achieved {rejection}% acute rejection episode rate below national benchmark; managed transplant nursing care for {patients} pre- and post-transplant patien.
- **D (Concise):** Managed transplant nursing care for {patients} pre- and post-tr, contributing to a {survival}% 1-year graft survival rate and achieving {rejectio.

**Variables:**
  - `{patients}`: 10 to 25, step 5 (integer)
  - `{organs}`: 1 to 4, step 1 (integer)
  - `{survival}`: 90 to 99, step 2 (percentage)
  - `{rejection}`: 5 to 20, step 5 (percentage)

### HLTH-0077
**Role:** registered-nurse | **Theme:** neurology-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** neurology nursing, neurological assessment, epilepsy monitoring, lumbar puncture, neuro checks, MS care

**Scope:** neurology nursing care for {patients} patients per shift across {conditions} neurological conditions, conducting {neuro_checks} neuro checks per shift
**Result:** achieving {response}% timely neurological deterioration response rate and maintaining {documentation}% neuro assessment documentation accuracy

**Variations:**
- **A (Standard):** Managed neurology nursing care for {patients} patients per shift acr, achieving {response}% timely neurological deterioration response rate and maintaining {documentation}% neuro assessment documentation accuracy.
- **B (Result-first):** Achieved {response}% timely neurological deterioration response rate and Maintained {documentation}% neuro assessment documentation accuracy by managing neurology nursing care for {patients} patients per shift acr.
- **C (Impact-led):** Achieved {response}% timely neurological deterioration response rate and Maintained {documentation}% neuro assessment documentation accuracy; managed neurology nursing care for {patients} patients per shift across {condi.
- **D (Concise):** Managed neurology nursing care for {patients} patients per shif, achieving {response}% timely neurological deterioration response rate and mainta.

**Variables:**
  - `{patients}`: 4 to 10, step 2 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{neuro_checks}`: 10 to 30, step 5 (integer)
  - `{response}`: 100 to 100, step 0 (percentage)
  - `{documentation}`: 97 to 100, step 1 (percentage)

### HLTH-0078
**Role:** registered-nurse | **Theme:** bariatric-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** bariatric nursing, obesity care, bariatric surgery, weight management, post-bariatric, metabolic surgery

**Scope:** bariatric perioperative care for {patients} patients per month undergoing sleeve gastrectomy, gastric bypass, and adjustable banding across {providers} bariatric surgeons
**Result:** achieving {complication}% 30-day complication rate below national benchmark and {satisfaction}% patient-reported satisfaction at 6 months

**Variations:**
- **A (Standard):** Managed bariatric perioperative care for {patients} patients per mon, achieving {complication}% 30-day complication rate below national benchmark and {satisfaction}% patient-reported satisfaction at 6 months.
- **B (Result-first):** Achieved {complication}% 30-day complication rate below national benchmark and {satisfaction}% patient-reported satisfaction at 6 months by managing bariatric perioperative care for {patients} patients per mon.
- **C (Impact-led):** Achieved {complication}% 30-day complication rate below national benchmark and {satisfaction}% patient-reported satisfaction at 6 months; managed bariatric perioperative care for {patients} patients per month undergo.
- **D (Concise):** Managed bariatric perioperative care for {patients} patients pe, achieving {complication}% 30-day complication rate below national benchmark and .

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{providers}`: 2 to 6, step 1 (integer)
  - `{complication}`: 3 to 10, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0079
**Role:** health-admin | **Theme:** supply-chain | **Seniority:** senior | **Verb Context:** operations
**Keywords:** healthcare supply chain, GPO, value analysis, physician preference items, supply costs, procurement

**Scope:** supply chain and value analysis for a {bed}-bed health system with ${spend}M annual supply spend across {categories} clinical categories
**Result:** reducing supply spend by ${savings}M annually and standardizing {items} physician preference items without compromising clinical outcomes

**Variations:**
- **A (Standard):** Managed supply chain and value analysis for a {bed}-bed health syste, reducing supply spend by ${savings}M annually and standardizing {items} physician preference items without compromising clinical outcomes.
- **B (Result-first):** Reduced supply spend by ${savings}M annually and standardizing {items} physician preference items without compromising clinical outcomes by managing supply chain and value analysis for a {bed}-bed health syste.
- **C (Impact-led):** Reduced supply spend by ${savings}M annually and standardizing {items} physician preference items without compromising clinical outcomes; managed supply chain and value analysis for a {bed}-bed health system with ${s.
- **D (Concise):** Managed supply chain and value analysis for a {bed}-bed health , reducing supply spend by ${savings}m annually and standardizing {items} physicia.

**Variables:**
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{spend}`: 10 to 200, step 10 (currency)
  - `{categories}`: 10 to 30, step 5 (integer)
  - `{savings}`: 1 to 20, step 1 (currency)
  - `{items}`: 10 to 100, step 10 (integer)

### HLTH-0080
**Role:** health-admin | **Theme:** risk-management | **Seniority:** senior | **Verb Context:** operations
**Keywords:** healthcare risk management, claims management, patient safety, malpractice, liability, loss prevention

**Scope:** risk management program for a {bed}-bed health system, managing {claims} active malpractice claims representing ${exposure}M in potential liability
**Result:** reducing claims frequency by {reduction}% and average claim settlement cost from ${before}K to ${after}K over {years} years

**Variations:**
- **A (Standard):** Managed risk management program for a {bed}-bed health system, manag, reducing claims frequency by {reduction}% and average claim settlement cost from ${before}K to ${after}K over {years} years.
- **B (Result-first):** Reduced claims frequency by {reduction}% and average claim settlement cost from ${before}K to ${after}K over {years} years by managing risk management program for a {bed}-bed health system, manag.
- **C (Impact-led):** Reduced claims frequency by {reduction}% and average claim settlement cost from ${before}K to ${after}K over {years} years; managed risk management program for a {bed}-bed health system, managing {claim.
- **D (Concise):** Managed risk management program for a {bed}-bed health system, , reducing claims frequency by {reduction}% and average claim settlement cost from.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{claims}`: 10 to 100, step 10 (integer)
  - `{exposure}`: 1 to 100, step 10 (currency)
  - `{reduction}`: 20 to 50, step 5 (percentage)
  - `{before}`: 200 to 500, step 50 (currency)
  - `{after}`: 100 to 250, step 25 (currency)
  - `{years}`: 2 to 5, step 1 (integer)

### HLTH-0081
**Role:** case-manager | **Theme:** complex-care | **Seniority:** senior | **Verb Context:** people
**Keywords:** complex care management, high utilizers, super utilizers, social determinants, wraparound services, care coordination

**Scope:** complex care management for {patients} high-utilizer patients per month, coordinating {services} wraparound services and addressing social determinants including housing and food insecurity
**Result:** reducing ER visits among the panel by {er}% and saving ${savings}K in avoidable utilization costs over {months} months

**Variations:**
- **A (Standard):** Managed complex care management for {patients} high-utilizer patient, reducing ER visits among the panel by {er}% and saving ${savings}K in avoidable utilization costs over {months} months.
- **B (Result-first):** Reduced ER visits among the panel by {er}% and saving ${savings}K in avoidable utilization costs over {months} months by managing complex care management for {patients} high-utilizer patient.
- **C (Impact-led):** Reduced ER visits among the panel by {er}% and saving ${savings}K in avoidable utilization costs over {months} months; managed complex care management for {patients} high-utilizer patients per mont.
- **D (Concise):** Managed complex care management for {patients} high-utilizer pa, reducing er visits among the panel by {er}% and saving ${savings}k in avoidable .

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{services}`: 5 to 15, step 5 (integer)
  - `{er}`: 25 to 60, step 5 (percentage)
  - `{savings}`: 100 to 2000, step 100 (currency)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0082
**Role:** registered-nurse | **Theme:** infection-prevention | **Seniority:** senior | **Verb Context:** operations
**Keywords:** infection prevention, HAI, hand hygiene, CLABSI, CAUTI, isolation precautions, surveillance

**Scope:** infection prevention surveillance for a {bed}-bed hospital monitoring {indicators} HAI indicators per month and conducting {audits} compliance audits
**Result:** reducing facility CLABSI rate from {before} to {after} per {oc}K device-days and maintaining {hand_hygiene}% hand hygiene compliance

**Variations:**
- **A (Standard):** Managed infection prevention surveillance for a {bed}-bed hospital m, reducing facility CLABSI rate from {before} to {after} per {oc}K device-days and maintaining {hand_hygiene}% hand hygiene compliance.
- **B (Result-first):** Reduced facility CLABSI rate from {before} to {after} per {oc}K device-days and Maintained {hand_hygiene}% hand hygiene compliance by managing infection prevention surveillance for a {bed}-bed hospital m.
- **C (Impact-led):** Reduced facility CLABSI rate from {before} to {after} per {oc}K device-days and Maintained {hand_hygiene}% hand hygiene compliance; managed infection prevention surveillance for a {bed}-bed hospital monitoring .
- **D (Concise):** Managed infection prevention surveillance for a {bed}-bed hospi, reducing facility clabsi rate from {before} to {after} per {oc}k device-days and.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{indicators}`: 5 to 15, step 5 (integer)
  - `{audits}`: 20 to 100, step 10 (integer)
  - `{before}`: 2 to 6, step 1 (integer)
  - `{after}`: 0 to 1, step 0.5 (integer)
  - `{oc}`: 1 to 10, step 1 (integer)
  - `{hand_hygiene}`: 80 to 99, step 5 (percentage)

### HLTH-0083
**Role:** doctor | **Theme:** emergency-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** emergency medicine, ACEP, emergency department, triage, resuscitation, acute care, EM physician

**Scope:** emergency medicine care for {patients} patients per shift across {acuity_levels} acuity levels in a {volume}K-visit annual ED, performing {procedures} procedures per shift
**Result:** achieving {door_to_disposition}% of patients dispositioned within {hours} hours of arrival and maintaining a {satisfaction}% patient satisfaction score

**Variations:**
- **A (Standard):** Managed emergency medicine care for {patients} patients per shift ac, achieving {door_to_disposition}% of patients dispositioned within {hours} hours of arrival and maintaining a {satisfaction}% patient satisfaction score.
- **B (Result-first):** Achieved {door_to_disposition}% of patients dispositioned within {hours} hours of arrival and Maintained a {satisfaction}% patient satisfaction score by managing emergency medicine care for {patients} patients per shift ac.
- **C (Impact-led):** Achieved {door_to_disposition}% of patients dispositioned within {hours} hours of arrival and Maintained a {satisfaction}% patient satisfaction score; managed emergency medicine care for {patients} patients per shift across {acui.
- **D (Concise):** Managed emergency medicine care for {patients} patients per shi, achieving {door_to_disposition}% of patients dispositioned within {hours} hours .

**Variables:**
  - `{patients}`: 15 to 30, step 5 (integer)
  - `{acuity_levels}`: 3 to 5, step 1 (integer)
  - `{volume}`: 30 to 100, step 10 (integer)
  - `{procedures}`: 5 to 15, step 5 (integer)
  - `{door_to_disposition}`: 80 to 96, step 2 (percentage)
  - `{hours}`: 4 to 6, step 1 (integer)
  - `{satisfaction}`: 85 to 99, step 2 (percentage)

### HLTH-0084
**Role:** registered-nurse | **Theme:** cardiac-cath-lab | **Seniority:** senior | **Verb Context:** operations
**Keywords:** cardiac catheterization, PCI, cath lab nursing, coronary angiography, interventional cardiology, hemodynamic monitoring

**Scope:** cardiac catheterization lab nursing support for {cases} procedures per shift including diagnostic coronary angiography and PCI across {providers} interventional cardiologists
**Result:** achieving {protocol}% sterile technique compliance and maintaining {complication}% major access site complication rate below national benchmark

**Variations:**
- **A (Standard):** Managed cardiac catheterization lab nursing support for {cases} proc, achieving {protocol}% sterile technique compliance and maintaining {complication}% major access site complication rate below national benchmark.
- **B (Result-first):** Achieved {protocol}% sterile technique compliance and Maintained {complication}% major access site complication rate below national benchmark by managing cardiac catheterization lab nursing support for {cases} proc.
- **C (Impact-led):** Achieved {protocol}% sterile technique compliance and Maintained {complication}% major access site complication rate below national benchmark; managed cardiac catheterization lab nursing support for {cases} procedures per.
- **D (Concise):** Managed cardiac catheterization lab nursing support for {cases}, achieving {protocol}% sterile technique compliance and maintaining {complication.

**Variables:**
  - `{cases}`: 4 to 10, step 2 (integer)
  - `{providers}`: 2 to 6, step 1 (integer)
  - `{protocol}`: 100 to 100, step 0 (percentage)
  - `{complication}`: 1 to 4, step 0.5 (percentage)

### HLTH-0085
**Role:** registered-nurse | **Theme:** home-health | **Seniority:** mid | **Verb Context:** people
**Keywords:** home health nursing, in-home assessment, OASIS, skilled nursing, Medicare home health, functional assessment

**Scope:** home health skilled nursing visits for {patients} patients per week across {zip_codes} ZIP codes, completing OASIS assessments and delivering {procedures} skilled nursing procedures per visit
**Result:** achieving {hospitalization}% 30-day acute care hospitalization rate below national benchmark and {satisfaction}% patient satisfaction on the CAHPS survey

**Variations:**
- **A (Standard):** Managed home health skilled nursing visits for {patients} patients p, achieving {hospitalization}% 30-day acute care hospitalization rate below national benchmark and {satisfaction}% patient satisfaction on the CAHPS survey.
- **B (Result-first):** Achieved {hospitalization}% 30-day acute care hospitalization rate below national benchmark and {satisfaction}% patient satisfaction on the CAHPS survey by managing home health skilled nursing visits for {patients} patients p.
- **C (Impact-led):** Achieved {hospitalization}% 30-day acute care hospitalization rate below national benchmark and {satisfaction}% patient satisfaction on the CAHPS survey; managed home health skilled nursing visits for {patients} patients per week ac.
- **D (Concise):** Managed home health skilled nursing visits for {patients} patie, achieving {hospitalization}% 30-day acute care hospitalization rate below nation.

**Variables:**
  - `{patients}`: 10 to 25, step 5 (integer)
  - `{zip_codes}`: 5 to 20, step 5 (integer)
  - `{procedures}`: 3 to 8, step 1 (integer)
  - `{hospitalization}`: 12 to 20, step 2 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0086
**Role:** social-worker | **Theme:** discharge-planning | **Seniority:** mid | **Verb Context:** operations
**Keywords:** discharge planning, social work, community resources, post-acute placement, housing, SDOH

**Scope:** discharge planning for {patients} inpatients per week, navigating housing, transportation, and community resource barriers for {sdoh} patients with active social determinant needs
**Result:** reducing discharge delay days from {before} to {after} per month and achieving {placement}% patients successfully connected to needed post-discharge resources

**Variations:**
- **A (Standard):** Managed discharge planning for {patients} inpatients per week, navig, reducing discharge delay days from {before} to {after} per month and achieving {placement}% patients successfully connected to needed post-discharge resources.
- **B (Result-first):** Reduced discharge delay days from {before} to {after} per month and Achieved {placement}% patients successfully connected to needed post-discharge resources by managing discharge planning for {patients} inpatients per week, navig.
- **C (Impact-led):** Reduced discharge delay days from {before} to {after} per month and Achieved {placement}% patients successfully connected to needed post-discharge resources; managed discharge planning for {patients} inpatients per week, navigating hous.
- **D (Concise):** Managed discharge planning for {patients} inpatients per week, , reducing discharge delay days from {before} to {after} per month and achieving {.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{sdoh}`: 5 to 20, step 5 (integer)
  - `{before}`: 20 to 50, step 5 (integer)
  - `{after}`: 5 to 15, step 5 (integer)
  - `{placement}`: 75 to 98, step 5 (percentage)

### HLTH-0087
**Role:** registered-nurse | **Theme:** telemetry | **Seniority:** junior | **Verb Context:** operations
**Keywords:** telemetry nursing, cardiac monitoring, rhythm recognition, intermediate care, step-down unit, ACLS

**Scope:** telemetry nursing for {patients} patients per shift on a {bed}-bed step-down unit, monitoring cardiac rhythms and responding to {events} telemetry alarms per shift
**Result:** achieving {recognition}% life-threatening rhythm recognition accuracy and contributing to {code}% reduction in unplanned ICU transfers per quarter

**Variations:**
- **A (Standard):** Managed telemetry nursing for {patients} patients per shift on a {be, achieving {recognition}% life-threatening rhythm recognition accuracy and contributing to {code}% reduction in unplanned ICU transfers per quarter.
- **B (Result-first):** Achieved {recognition}% life-threatening rhythm recognition accuracy and Contributed to {code}% reduction in unplanned ICU transfers per quarter by managing telemetry nursing for {patients} patients per shift on a {be.
- **C (Impact-led):** Achieved {recognition}% life-threatening rhythm recognition accuracy and Contributed to {code}% reduction in unplanned ICU transfers per quarter; managed telemetry nursing for {patients} patients per shift on a {bed}-bed ste.
- **D (Concise):** Managed telemetry nursing for {patients} patients per shift on , achieving {recognition}% life-threatening rhythm recognition accuracy and contri.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{events}`: 10 to 30, step 5 (integer)
  - `{recognition}`: 100 to 100, step 0 (percentage)
  - `{code}`: 15 to 40, step 5 (percentage)

### HLTH-0088
**Role:** registered-nurse | **Theme:** hospice | **Seniority:** mid | **Verb Context:** people
**Keywords:** hospice nursing, end-of-life care, comfort care, symptom management, family support, NHPCO

**Scope:** hospice nursing visits for {patients} patients per week in home and facility settings, managing {symptoms} symptom categories and supporting {families} family caregivers
**Result:** achieving {comfort}% patient-reported symptom comfort score and {bereave}% family satisfaction with end-of-life care

**Variations:**
- **A (Standard):** Managed hospice nursing visits for {patients} patients per week in h, achieving {comfort}% patient-reported symptom comfort score and {bereave}% family satisfaction with end-of-life care.
- **B (Result-first):** Achieved {comfort}% patient-reported symptom comfort score and {bereave}% family satisfaction with end-of-life care by managing hospice nursing visits for {patients} patients per week in h.
- **C (Impact-led):** Achieved {comfort}% patient-reported symptom comfort score and {bereave}% family satisfaction with end-of-life care; managed hospice nursing visits for {patients} patients per week in home and fa.
- **D (Concise):** Managed hospice nursing visits for {patients} patients per week, achieving {comfort}% patient-reported symptom comfort score and {bereave}% famil.

**Variables:**
  - `{patients}`: 8 to 15, step 2 (integer)
  - `{symptoms}`: 5 to 10, step 1 (integer)
  - `{families}`: 8 to 15, step 2 (integer)
  - `{comfort}`: 85 to 99, step 2 (percentage)
  - `{bereave}`: 88 to 99, step 2 (percentage)

### HLTH-0089
**Role:** health-admin | **Theme:** physician-relations | **Seniority:** mid | **Verb Context:** people
**Keywords:** physician relations, physician engagement, medical staff, physician recruitment, physician retention, PSA

**Scope:** physician relations program serving {physicians} employed and affiliated physicians across {specialties} specialties, conducting {rounding}K rounding visits and {surveys} satisfaction surveys per year
**Result:** improving physician satisfaction from {before} to {after}/10 and retaining {retention}% of recruited physicians at 2 years

**Variations:**
- **A (Standard):** Managed physician relations program serving {physicians} employed an, improving physician satisfaction from {before} to {after}/10 and retaining {retention}% of recruited physicians at 2 years.
- **B (Result-first):** Improved physician satisfaction from {before} to {after}/10 and retaining {retention}% of recruited physicians at 2 years by managing physician relations program serving {physicians} employed an.
- **C (Impact-led):** Improved physician satisfaction from {before} to {after}/10 and retaining {retention}% of recruited physicians at 2 years; managed physician relations program serving {physicians} employed and affiliat.
- **D (Concise):** Managed physician relations program serving {physicians} employ, improving physician satisfaction from {before} to {after}/10 and retaining {rete.

**Variables:**
  - `{physicians}`: 50 to 500, step 50 (integer)
  - `{specialties}`: 5 to 20, step 5 (integer)
  - `{rounding}`: 1 to 10, step 1 (integer)
  - `{surveys}`: 1 to 5, step 1 (integer)
  - `{before}`: 6 to 7, step 0.5 (integer)
  - `{after}`: 8 to 10, step 0.5 (integer)
  - `{retention}`: 80 to 96, step 2 (percentage)

### HLTH-0090
**Role:** clinical-coordinator | **Theme:** prior-authorization | **Seniority:** junior | **Verb Context:** operations
**Keywords:** prior authorization, insurance verification, medical necessity, PA coordinator, payer requirements

**Scope:** prior authorization submissions and appeals for {auths}K requests per month across {payers} payer types and {specialties} specialty service lines
**Result:** achieving {approval}% first-submission approval rate and reducing authorization turnaround from {before} to {after} business days

**Variations:**
- **A (Standard):** Managed prior authorization submissions and appeals for {auths}k req, achieving {approval}% first-submission approval rate and reducing authorization turnaround from {before} to {after} business days.
- **B (Result-first):** Achieved {approval}% first-submission approval rate and Reduced authorization turnaround from {before} to {after} business days by managing prior authorization submissions and appeals for {auths}k req.
- **C (Impact-led):** Achieved {approval}% first-submission approval rate and Reduced authorization turnaround from {before} to {after} business days; managed prior authorization submissions and appeals for {auths}k requests per .
- **D (Concise):** Managed prior authorization submissions and appeals for {auths}, achieving {approval}% first-submission approval rate and reducing authorization .

**Variables:**
  - `{auths}`: 1 to 20, step 1 (integer)
  - `{payers}`: 5 to 20, step 5 (integer)
  - `{specialties}`: 3 to 10, step 1 (integer)
  - `{approval}`: 85 to 99, step 2 (percentage)
  - `{before}`: 5 to 10, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### HLTH-0091
**Role:** registered-nurse | **Theme:** infusion-therapy | **Seniority:** mid | **Verb Context:** operations
**Keywords:** infusion therapy, IV antibiotics, PICC line, home infusion, infusion nursing, IV access

**Scope:** infusion therapy for {patients} patients per day administering {agents} IV antimicrobial, biologic, and IVIG agents across outpatient and home infusion settings
**Result:** maintaining a {completion}% infusion completion rate and achieving {complication}% IV access complication rate below national benchmark

**Variations:**
- **A (Standard):** Managed infusion therapy for {patients} patients per day administeri, maintaining a {completion}% infusion completion rate and achieving {complication}% IV access complication rate below national benchmark.
- **B (Result-first):** Maintained a {completion}% infusion completion rate and Achieved {complication}% IV access complication rate below national benchmark by managing infusion therapy for {patients} patients per day administeri.
- **C (Impact-led):** Maintained a {completion}% infusion completion rate and Achieved {complication}% IV access complication rate below national benchmark; managed infusion therapy for {patients} patients per day administering {agents.
- **D (Concise):** Managed infusion therapy for {patients} patients per day admini, maintaining a {completion}% infusion completion rate and achieving {complication.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{agents}`: 5 to 15, step 5 (integer)
  - `{completion}`: 97 to 100, step 1 (percentage)
  - `{complication}`: 2 to 8, step 1 (percentage)

### HLTH-0092
**Role:** doctor | **Theme:** sports-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** sports medicine, musculoskeletal injury, return to play, concussion management, diagnostic ultrasound, athlete care

**Scope:** sports medicine care for {patients} athletes per week across {sports} sports including {injections} ultrasound-guided injections per month
**Result:** achieving {rtp}% return-to-play rate within expected timelines and {satisfaction}% athlete satisfaction score

**Variations:**
- **A (Standard):** Managed sports medicine care for {patients} athletes per week across, achieving {rtp}% return-to-play rate within expected timelines and {satisfaction}% athlete satisfaction score.
- **B (Result-first):** Achieved {rtp}% return-to-play rate within expected timelines and {satisfaction}% athlete satisfaction score by managing sports medicine care for {patients} athletes per week across.
- **C (Impact-led):** Achieved {rtp}% return-to-play rate within expected timelines and {satisfaction}% athlete satisfaction score; managed sports medicine care for {patients} athletes per week across {sports} .
- **D (Concise):** Managed sports medicine care for {patients} athletes per week a, achieving {rtp}% return-to-play rate within expected timelines and {satisfaction.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{sports}`: 5 to 15, step 5 (integer)
  - `{injections}`: 10 to 30, step 5 (integer)
  - `{rtp}`: 88 to 98, step 2 (percentage)
  - `{satisfaction}`: 90 to 99, step 2 (percentage)

### HLTH-0093
**Role:** health-admin | **Theme:** accreditation | **Seniority:** mid | **Verb Context:** operations
**Keywords:** Joint Commission, accreditation, CMS certification, survey readiness, tracer methodology, regulatory

**Scope:** accreditation readiness program for a {bed}-bed health system preparing for Joint Commission and CMS surveys across {standards} applicable standards
**Result:** achieving Joint Commission accreditation with {findings} requirements for improvement and zero immediate threat to life findings across {surveys} surveys

**Variations:**
- **A (Standard):** Managed accreditation readiness program for a {bed}-bed health syste, achieving Joint Commission accreditation with {findings} requirements for improvement and zero immediate threat to life findings across {surveys} surveys.
- **B (Result-first):** Achieved Joint Commission accreditation with {findings} requirements for improvement and zero immediate threat to life findings across {surveys} surveys by managing accreditation readiness program for a {bed}-bed health syste.
- **C (Impact-led):** Achieved Joint Commission accreditation with {findings} requirements for improvement and zero immediate threat to life findings across {surveys} surveys; managed accreditation readiness program for a {bed}-bed health system preparin.
- **D (Concise):** Managed accreditation readiness program for a {bed}-bed health , achieving joint commission accreditation with {findings} requirements for improv.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{standards}`: 100 to 500, step 50 (integer)
  - `{findings}`: 0 to 5, step 1 (integer)
  - `{surveys}`: 1 to 3, step 1 (integer)

### HLTH-0094
**Role:** registered-nurse | **Theme:** pain-management | **Seniority:** mid | **Verb Context:** people
**Keywords:** pain management nursing, pain assessment, opioid stewardship, multimodal analgesia, NRS scale, ERAS

**Scope:** pain management nursing for {patients} patients per shift using multimodal analgesic protocols across {conditions} pain categories, conducting {assessments} pain reassessments per shift
**Result:** reducing average pain score from {before}/10 to {after}/10 at 1 hour post-intervention and achieving {opioid}% reduction in opioid administration compared to prior year

**Variations:**
- **A (Standard):** Managed pain management nursing for {patients} patients per shift us, reducing average pain score from {before}/10 to {after}/10 at 1 hour post-intervention and achieving {opioid}% reduction in opioid administration compared to prior year.
- **B (Result-first):** Reduced average pain score from {before}/10 to {after}/10 at 1 hour post-intervention and Achieved {opioid}% reduction in opioid administration compared to prior year by managing pain management nursing for {patients} patients per shift us.
- **C (Impact-led):** Reduced average pain score from {before}/10 to {after}/10 at 1 hour post-intervention and Achieved {opioid}% reduction in opioid administration compared to prior year; managed pain management nursing for {patients} patients per shift using multim.
- **D (Concise):** Managed pain management nursing for {patients} patients per shi, reducing average pain score from {before}/10 to {after}/10 at 1 hour post-interv.

**Variables:**
  - `{patients}`: 4 to 12, step 2 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{assessments}`: 10 to 30, step 5 (integer)
  - `{before}`: 6 to 8, step 1 (integer)
  - `{after}`: 2 to 4, step 1 (integer)
  - `{opioid}`: 15 to 40, step 5 (percentage)

### HLTH-0095
**Role:** health-admin | **Theme:** telehealth-strategy | **Seniority:** senior | **Verb Context:** projects
**Keywords:** telehealth strategy, virtual care, digital health strategy, telehealth governance, health system telehealth

**Scope:** a health system telehealth strategy across {services} service lines and {sites} sites, scaling virtual visit capacity from {before}K to {after}K visits annually
**Result:** growing telehealth revenue from ${rev_before}M to ${rev_after}M and achieving {satisfaction}% patient satisfaction with virtual visits

**Variations:**
- **A (Standard):** Managed a health system telehealth strategy across {services} servic, growing telehealth revenue from ${rev_before}M to ${rev_after}M and achieving {satisfaction}% patient satisfaction with virtual visits.
- **B (Result-first):** Grew telehealth revenue from ${rev_before}M to ${rev_after}M and Achieved {satisfaction}% patient satisfaction with virtual visits by managing a health system telehealth strategy across {services} servic.
- **C (Impact-led):** Grew telehealth revenue from ${rev_before}M to ${rev_after}M and Achieved {satisfaction}% patient satisfaction with virtual visits; managed a health system telehealth strategy across {services} service lines an.
- **D (Concise):** Managed a health system telehealth strategy across {services} s, growing telehealth revenue from ${rev_before}m to ${rev_after}m and achieving {s.

**Variables:**
  - `{services}`: 5 to 20, step 5 (integer)
  - `{sites}`: 3 to 20, step 3 (integer)
  - `{before}`: 10 to 100, step 10 (integer)
  - `{after}`: 100 to 500, step 50 (integer)
  - `{rev_before}`: 1 to 10, step 1 (currency)
  - `{rev_after}`: 10 to 50, step 5 (currency)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0096
**Role:** registered-nurse | **Theme:** trauma-nursing | **Seniority:** senior | **Verb Context:** people
**Keywords:** trauma nursing, trauma resuscitation, TNCC, massive transfusion, trauma activation, trauma bay

**Scope:** trauma nursing in a Level {level} trauma center managing {activations} trauma activations per month including {mtps} massive transfusion protocol activations
**Result:** achieving {response}% trauma team response time within {minutes} minutes of notification and contributing to a {survival}% survival rate for penetrating trauma

**Variations:**
- **A (Standard):** Managed trauma nursing in a level {level} trauma center managing {ac, achieving {response}% trauma team response time within {minutes} minutes of notification and contributing to a {survival}% survival rate for penetrating trauma.
- **B (Result-first):** Achieved {response}% trauma team response time within {minutes} minutes of notification and Contributed to a {survival}% survival rate for penetrating trauma by managing trauma nursing in a level {level} trauma center managing {ac.
- **C (Impact-led):** Achieved {response}% trauma team response time within {minutes} minutes of notification and Contributed to a {survival}% survival rate for penetrating trauma; managed trauma nursing in a level {level} trauma center managing {activations}.
- **D (Concise):** Managed trauma nursing in a level {level} trauma center managin, achieving {response}% trauma team response time within {minutes} minutes of noti.

**Variables:**
  - `{level}`: 1 to 2, step 1 (integer)
  - `{activations}`: 20 to 100, step 10 (integer)
  - `{mtps}`: 3 to 15, step 3 (integer)
  - `{response}`: 100 to 100, step 0 (percentage)
  - `{minutes}`: 10 to 15, step 5 (integer)
  - `{survival}`: 88 to 97, step 2 (percentage)

### HLTH-0097
**Role:** health-admin | **Theme:** workforce-development | **Seniority:** mid | **Verb Context:** people
**Keywords:** workforce development, clinical ladder, professional development, tuition reimbursement, nursing retention, career pathing

**Scope:** workforce development program for {staff}K clinical employees, managing {cohorts} clinical ladder cohorts and ${tuition}K annual tuition reimbursement budget
**Result:** improving clinical staff retention from {before}% to {after}% and increasing {certifications} specialty certifications obtained annually by staff

**Variations:**
- **A (Standard):** Managed workforce development program for {staff}k clinical employee, improving clinical staff retention from {before}% to {after}% and increasing {certifications} specialty certifications obtained annually by staff.
- **B (Result-first):** Improved clinical staff retention from {before}% to {after}% and increasing {certifications} specialty certifications obtained annually by staff by managing workforce development program for {staff}k clinical employee.
- **C (Impact-led):** Improved clinical staff retention from {before}% to {after}% and increasing {certifications} specialty certifications obtained annually by staff; managed workforce development program for {staff}k clinical employees, managin.
- **D (Concise):** Managed workforce development program for {staff}k clinical emp, improving clinical staff retention from {before}% to {after}% and increasing {ce.

**Variables:**
  - `{staff}`: 1 to 10, step 1 (integer)
  - `{cohorts}`: 3 to 10, step 1 (integer)
  - `{tuition}`: 50 to 500, step 50 (currency)
  - `{before}`: 70 to 82, step 2 (percentage)
  - `{after}`: 88 to 96, step 2 (percentage)
  - `{certifications}`: 10 to 100, step 10 (integer)

### HLTH-0098
**Role:** registered-nurse | **Theme:** rehabilitation-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** rehabilitation nursing, functional mobility, ADL training, spinal cord injury, TBI, stroke rehab

**Scope:** rehabilitation nursing care for {patients} patients per shift at a {bed}-bed inpatient rehabilitation facility, supporting {therapies} therapy disciplines with carryover practice
**Result:** achieving {fim_gain}% average FIM gain per patient and contributing to a {discharge}% discharge-to-home rate

**Variations:**
- **A (Standard):** Managed rehabilitation nursing care for {patients} patients per shif, achieving {fim_gain}% average FIM gain per patient and contributing to a {discharge}% discharge-to-home rate.
- **B (Result-first):** Achieved {fim_gain}% average FIM gain per patient and Contributed to a {discharge}% discharge-to-home rate by managing rehabilitation nursing care for {patients} patients per shif.
- **C (Impact-led):** Achieved {fim_gain}% average FIM gain per patient and Contributed to a {discharge}% discharge-to-home rate; managed rehabilitation nursing care for {patients} patients per shift at a {be.
- **D (Concise):** Managed rehabilitation nursing care for {patients} patients per, achieving {fim_gain}% average fim gain per patient and contributing to a {discha.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 60, step 10 (integer)
  - `{therapies}`: 3 to 5, step 1 (integer)
  - `{fim_gain}`: 60 to 88, step 5 (percentage)
  - `{discharge}`: 65 to 88, step 5 (percentage)

### HLTH-0099
**Role:** dietitian | **Theme:** oncology-nutrition | **Seniority:** senior | **Verb Context:** people
**Keywords:** oncology nutrition, cancer cachexia, chemotherapy nutrition, nutrition support, NCI, malnutrition screening

**Scope:** oncology nutrition counseling for {patients} cancer patients per week across {cancer_types} cancer types managing nutrition side effects from chemotherapy, radiation, and surgery
**Result:** improving {screen}% malnutrition screening completion rate and reducing unintentional weight loss of more than {pct}% body weight among patients by {reduction}% over {months} months

**Variations:**
- **A (Standard):** Managed oncology nutrition counseling for {patients} cancer patients, improving {screen}% malnutrition screening completion rate and reducing unintentional weight loss of more than {pct}% body weight among patients by {reduction}% over {months} months.
- **B (Result-first):** Improved {screen}% malnutrition screening completion rate and Reduced unintentional weight loss of more than {pct}% body weight among patients by {reduction}% over {months} months by managing oncology nutrition counseling for {patients} cancer patients.
- **C (Impact-led):** Improved {screen}% malnutrition screening completion rate and Reduced unintentional weight loss of more than {pct}% body weight among patients by {reduction}% over {months} months; managed oncology nutrition counseling for {patients} cancer patients per week .
- **D (Concise):** Managed oncology nutrition counseling for {patients} cancer pat, improving {screen}% malnutrition screening completion rate and reducing unintent.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{cancer_types}`: 5 to 15, step 5 (integer)
  - `{screen}`: 85 to 100, step 5 (percentage)
  - `{pct}`: 5 to 10, step 1 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0100
**Role:** doctor | **Theme:** hospitalist-leadership | **Seniority:** senior | **Verb Context:** operations
**Keywords:** hospitalist medicine, hospital medicine leadership, hospitalist group, throughput, physician scheduling, SHM

**Scope:** a {physician}-hospitalist group covering a {bed}-bed hospital, managing scheduling, quality metrics, and operational performance across {sites} campuses
**Result:** improving hospitalist group quality composite score from {before} to {after} out of 100 and reducing average LOS from {los_before} to {los_after} days for the top {drgs} DRGs

**Variations:**
- **A (Standard):** Managed a {physician}-hospitalist group covering a {bed}-bed hospita, improving hospitalist group quality composite score from {before} to {after} out of 100 and reducing average LOS from {los_before} to {los_after} days for the top {drgs} DRGs.
- **B (Result-first):** Improved hospitalist group quality composite score from {before} to {after} out of 100 and Reduced average LOS from {los_before} to {los_after} days for the top {drgs} DRGs by managing a {physician}-hospitalist group covering a {bed}-bed hospita.
- **C (Impact-led):** Improved hospitalist group quality composite score from {before} to {after} out of 100 and Reduced average LOS from {los_before} to {los_after} days for the top {drgs} DRGs; managed a {physician}-hospitalist group covering a {bed}-bed hospital, managin.
- **D (Concise):** Managed a {physician}-hospitalist group covering a {bed}-bed ho, improving hospitalist group quality composite score from {before} to {after} out.

**Variables:**
  - `{physician}`: 10 to 50, step 5 (integer)
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{sites}`: 1 to 5, step 1 (integer)
  - `{before}`: 65 to 75, step 5 (integer)
  - `{after}`: 82 to 96, step 2 (integer)
  - `{los_before}`: 4 to 7, step 1 (integer)
  - `{los_after}`: 2.5 to 4, step 0.5 (integer)
  - `{drgs}`: 10 to 30, step 5 (integer)

### HLTH-0101
**Role:** registered-nurse | **Theme:** telestroke | **Seniority:** mid | **Verb Context:** operations
**Keywords:** telestroke, remote neurology, tPA decision, NIHSS, acute ischemic stroke, code stroke

**Scope:** telestroke nursing coordination for {activations} code stroke activations per month, facilitating neurologist video consults within {minutes} minutes of arrival
**Result:** achieving {consult}% neurologist consult completion within 15 minutes of activation and {tpa_rate}% eligible patient tPA treatment rate

**Variations:**
- **A (Standard):** Managed telestroke nursing coordination for {activations} code stroke act, achieving {consult}% neurologist consult completion within 15 minutes of activation and {tpa_rate}% eligible patient tPA treatment rate.
- **B (Result-first):** Achieved {consult}% neurologist consult completion within 15 minutes of activation and {t by managing telestroke nursing coordination for {activations} code strok.
- **C (Impact-led):** Achieved {consult}% neurologist consult completion within 15 minutes of activation and {t; managed telestroke nursing coordination for {activations} code stroke act.
- **D (Concise):** Managed telestroke nursing coordination for {activations} code , achieving {consult}% neurologist consult completion within 15 minutes of activat.

**Variables:**
  - `{activations}`: 5 to 30, step 5 (integer)
  - `{minutes}`: 10 to 20, step 5 (integer)
  - `{consult}`: 92 to 100, step 2 (percentage)
  - `{tpa_rate}`: 85 to 99, step 2 (percentage)

### HLTH-0102
**Role:** registered-nurse | **Theme:** wound-vac | **Seniority:** junior | **Verb Context:** operations
**Keywords:** wound VAC, negative pressure wound therapy, NPWT, wound care, chronic wound, dressing

**Scope:** {patients} NPWT device applications and dressing changes per week for complex wounds including pressure injuries, dehisced surgical wounds, and diabetic foot ulcers
**Result:** achieving {healing}% wound area reduction at {weeks}-week reassessment and reducing wound-related inpatient readmissions by {readmit}%

**Variations:**
- **A (Standard):** Managed {patients} npwt device applications and dressing changes per week, achieving {healing}% wound area reduction at {weeks}-week reassessment and reducing wound-related inpatient readmissions by {readmit}%.
- **B (Result-first):** Achieved {healing}% wound area reduction at {weeks}-week reassessment and Reduced wound- by managing {patients} npwt device applications and dressing changes per.
- **C (Impact-led):** Achieved {healing}% wound area reduction at {weeks}-week reassessment and Reduced wound-; managed {patients} npwt device applications and dressing changes per week.
- **D (Concise):** Managed {patients} npwt device applications and dressing change, achieving {healing}% wound area reduction at {weeks}-week reassessment and reduc.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{weeks}`: 4 to 8, step 2 (integer)
  - `{healing}`: 40 to 70, step 5 (percentage)
  - `{readmit}`: 20 to 50, step 5 (percentage)

### HLTH-0103
**Role:** health-admin | **Theme:** lean-improvement | **Seniority:** mid | **Verb Context:** operations
**Keywords:** Lean healthcare, process improvement, value stream mapping, waste reduction, A3, standard work

**Scope:** Lean improvement program implementing {projects} A3 projects per year across {departments} clinical and operational departments
**Result:** generating ${savings}K in annual savings and reducing process cycle time by {cycle}% across completed projects

**Variations:**
- **A (Standard):** Managed lean improvement program implementing {projects} a3 projects per , generating ${savings}K in annual savings and reducing process cycle time by {cycle}% across completed projects.
- **B (Result-first):** Generated ${savings}K in annual savings and Reduced process cycle time by {cycle}% acros by managing lean improvement program implementing {projects} a3 projects.
- **C (Impact-led):** Generated ${savings}K in annual savings and Reduced process cycle time by {cycle}% acros; managed lean improvement program implementing {projects} a3 projects per .
- **D (Concise):** Managed lean improvement program implementing {projects} a3 pro, generating ${savings}k in annual savings and reducing process cycle time by {cyc.

**Variables:**
  - `{projects}`: 5 to 20, step 5 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{savings}`: 50 to 1000, step 50 (currency)
  - `{cycle}`: 15 to 40, step 5 (percentage)

### HLTH-0104
**Role:** registered-nurse | **Theme:** post-partum | **Seniority:** junior | **Verb Context:** people
**Keywords:** postpartum nursing, newborn care, breastfeeding support, maternal assessment, LDRP, fourth trimester

**Scope:** postpartum nursing care for {patients} mother-baby couplets per shift, supporting {breastfeeding} breastfeeding initiation sessions and {discharge} discharge education encounters per shift
**Result:** achieving {bf_rate}% breastfeeding initiation rate and {satisfaction}% satisfaction on the Maternity Experiences Survey

**Variations:**
- **A (Standard):** Managed postpartum nursing care for {patients} mother-baby couplets per s, achieving {bf_rate}% breastfeeding initiation rate and {satisfaction}% satisfaction on the Maternity Experiences Survey.
- **B (Result-first):** Achieved {bf_rate}% breastfeeding initiation rate and {satisfaction}% satisfaction on the by managing postpartum nursing care for {patients} mother-baby couplets .
- **C (Impact-led):** Achieved {bf_rate}% breastfeeding initiation rate and {satisfaction}% satisfaction on the; managed postpartum nursing care for {patients} mother-baby couplets per s.
- **D (Concise):** Managed postpartum nursing care for {patients} mother-baby coup, achieving {bf_rate}% breastfeeding initiation rate and {satisfaction}% satisfact.

**Variables:**
  - `{patients}`: 3 to 6, step 1 (integer)
  - `{breastfeeding}`: 3 to 6, step 1 (integer)
  - `{discharge}`: 3 to 6, step 1 (integer)
  - `{bf_rate}`: 70 to 92, step 5 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0105
**Role:** doctor | **Theme:** pulmonology | **Seniority:** mid | **Verb Context:** people
**Keywords:** pulmonology, COPD, asthma, pulmonary function, bronchoscopy, ILD, sleep medicine

**Scope:** pulmonology panel of {patients} patients per week including {bronch} bronchoscopies and {pfts} pulmonary function tests per month across {conditions} pulmonary diagnoses
**Result:** achieving {copd_admit}% COPD-related 30-day readmission rate below national benchmark and {spirometry}% of COPD patients receiving spirometry per guideline

**Variations:**
- **A (Standard):** Managed pulmonology panel of {patients} patients per week including {bron, achieving {copd_admit}% COPD-related 30-day readmission rate below national benchmark and {spirometry}% of COPD patients receiving spirometry per guideline.
- **B (Result-first):** Achieved {copd_admit}% COPD-related 30-day readmission rate below national benchmark and  by managing pulmonology panel of {patients} patients per week including .
- **C (Impact-led):** Achieved {copd_admit}% COPD-related 30-day readmission rate below national benchmark and ; managed pulmonology panel of {patients} patients per week including {bron.
- **D (Concise):** Managed pulmonology panel of {patients} patients per week inclu, achieving {copd_admit}% copd-related 30-day readmission rate below national benc.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{bronch}`: 5 to 20, step 5 (integer)
  - `{pfts}`: 10 to 30, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{copd_admit}`: 12 to 20, step 2 (percentage)
  - `{spirometry}`: 75 to 96, step 5 (percentage)

### HLTH-0106
**Role:** registered-nurse | **Theme:** flight-nursing | **Seniority:** senior | **Verb Context:** people
**Keywords:** flight nursing, air medical transport, critical care transport, rotor wing, emergency nursing, CFRN

**Scope:** air medical critical care transport for {transports} patients per month across {radius}-mile radius, managing {interventions} en-route clinical interventions per month
**Result:** achieving {interventions_rate}% successful en-route intervention completion rate and contributing to a {survival}% transport survival rate

**Variations:**
- **A (Standard):** Managed air medical critical care transport for {transports} patients per, achieving {interventions_rate}% successful en-route intervention completion rate and contributing to a {survival}% transport survival rate.
- **B (Result-first):** Achieved {interventions_rate}% successful en-route intervention completion rate and contr by managing air medical critical care transport for {transports} patient.
- **C (Impact-led):** Achieved {interventions_rate}% successful en-route intervention completion rate and contr; managed air medical critical care transport for {transports} patients per.
- **D (Concise):** Managed air medical critical care transport for {transports} pa, achieving {interventions_rate}% successful en-route intervention completion rate.

**Variables:**
  - `{transports}`: 10 to 30, step 5 (integer)
  - `{radius}`: 100 to 500, step 50 (integer)
  - `{interventions}`: 20 to 60, step 10 (integer)
  - `{interventions_rate}`: 98 to 100, step 1 (percentage)
  - `{survival}`: 92 to 99, step 2 (percentage)

### HLTH-0107
**Role:** registered-nurse | **Theme:** correctional-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** correctional nursing, jail nursing, prison healthcare, chronic disease management, sick call, mental health screening

**Scope:** correctional health nursing for a {pop}-person incarcerated population, managing {sick_call} sick-call visits per week and {chronic} chronic disease patients in a correctional setting
**Result:** achieving {screen}% mental health screening completion at intake and reducing {er}% unnecessary emergency department transports per quarter

**Variations:**
- **A (Standard):** Managed correctional health nursing for a {pop}-person incarcerated popul, achieving {screen}% mental health screening completion at intake and reducing {er}% unnecessary emergency department transports per quarter.
- **B (Result-first):** Achieved {screen}% mental health screening completion at intake and Reduced {er}% unnece by managing correctional health nursing for a {pop}-person incarcerated .
- **C (Impact-led):** Achieved {screen}% mental health screening completion at intake and Reduced {er}% unnece; managed correctional health nursing for a {pop}-person incarcerated popul.
- **D (Concise):** Managed correctional health nursing for a {pop}-person incarcer, achieving {screen}% mental health screening completion at intake and reducing {e.

**Variables:**
  - `{pop}`: 200 to 2000, step 200 (integer)
  - `{sick_call}`: 20 to 100, step 10 (integer)
  - `{chronic}`: 50 to 300, step 50 (integer)
  - `{screen}`: 95 to 100, step 1 (percentage)
  - `{er}`: 15 to 40, step 5 (percentage)

### HLTH-0108
**Role:** health-admin | **Theme:** population-health-admin | **Seniority:** senior | **Verb Context:** operations
**Keywords:** population health, ACO, shared savings, MSSP, care management, social determinants

**Scope:** population health operations for a {members}K-member ACO, overseeing {staff} care managers and ${budget}M care management budget across {conditions} priority conditions
**Result:** generating ${savings}M in shared savings and improving CMS quality composite score from {before} to {after} out of 100

**Variations:**
- **A (Standard):** Managed population health operations for a {members}k-member aco, oversee, generating ${savings}M in shared savings and improving CMS quality composite score from {before} to {after} out of 100.
- **B (Result-first):** Generated ${savings}M in shared savings and Improved CMS quality composite score from {b by managing population health operations for a {members}k-member aco, ov.
- **C (Impact-led):** Generated ${savings}M in shared savings and Improved CMS quality composite score from {b; managed population health operations for a {members}k-member aco, oversee.
- **D (Concise):** Managed population health operations for a {members}k-member ac, generating ${savings}m in shared savings and improving cms quality composite sco.

**Variables:**
  - `{members}`: 5 to 100, step 5 (integer)
  - `{staff}`: 5 to 50, step 5 (integer)
  - `{budget}`: 1 to 20, step 1 (currency)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{savings}`: 1 to 20, step 1 (currency)
  - `{before}`: 65 to 75, step 5 (integer)
  - `{after}`: 82 to 96, step 2 (integer)

### HLTH-0109
**Role:** registered-nurse | **Theme:** school-nursing | **Seniority:** junior | **Verb Context:** people
**Keywords:** school nurse, adolescent health, medication administration, health screenings, first aid, immunization

**Scope:** school nursing services for {students}K students across {schools} schools, conducting {screenings}K health screenings and managing {medications} daily medication administrations
**Result:** achieving {immunization}% immunization compliance rate and reducing {absences}% health-related school absences among students

**Variations:**
- **A (Standard):** Managed school nursing services for {students}k students across {schools}, achieving {immunization}% immunization compliance rate and reducing {absences}% health-related school absences among students.
- **B (Result-first):** Achieved {immunization}% immunization compliance rate and Reduced {absences}% health-rel by managing school nursing services for {students}k students across {sch.
- **C (Impact-led):** Achieved {immunization}% immunization compliance rate and Reduced {absences}% health-rel; managed school nursing services for {students}k students across {schools}.
- **D (Concise):** Managed school nursing services for {students}k students across, achieving {immunization}% immunization compliance rate and reducing {absences}% .

**Variables:**
  - `{students}`: 1 to 10, step 1 (integer)
  - `{schools}`: 1 to 5, step 1 (integer)
  - `{screenings}`: 1 to 10, step 1 (integer)
  - `{medications}`: 10 to 100, step 10 (integer)
  - `{immunization}`: 92 to 100, step 2 (percentage)
  - `{absences}`: 10 to 30, step 5 (percentage)

### HLTH-0110
**Role:** registered-nurse | **Theme:** occupational-health | **Seniority:** mid | **Verb Context:** people
**Keywords:** occupational health nursing, workplace injury, OSHA, return to work, health surveillance, immunization programs

**Scope:** occupational health nursing program for {employees}K employees across {sites} worksites, managing {cases} workers compensation cases and {surveillance} health surveillance screenings annually
**Result:** reducing workplace injury incidence rate from {before} to {after} per {workers}K workers and achieving {return_work}% 30-day return-to-work rate

**Variations:**
- **A (Standard):** Managed occupational health nursing program for {employees}k employees ac, reducing workplace injury incidence rate from {before} to {after} per {workers}K workers and achieving {return_work}% 30-day return-to-work rate.
- **B (Result-first):** Reduced workplace injury incidence rate from {before} to {after} per {workers}K workers a by managing occupational health nursing program for {employees}k employe.
- **C (Impact-led):** Reduced workplace injury incidence rate from {before} to {after} per {workers}K workers a; managed occupational health nursing program for {employees}k employees ac.
- **D (Concise):** Managed occupational health nursing program for {employees}k em, reducing workplace injury incidence rate from {before} to {after} per {workers}k.

**Variables:**
  - `{employees}`: 1 to 20, step 1 (integer)
  - `{sites}`: 1 to 10, step 1 (integer)
  - `{cases}`: 50 to 300, step 50 (integer)
  - `{surveillance}`: 100 to 2000, step 100 (integer)
  - `{before}`: 5 to 15, step 2 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{workers}`: 1 to 10, step 1 (integer)
  - `{return_work}`: 75 to 95, step 5 (percentage)

### HLTH-0111
**Role:** nurse-practitioner | **Theme:** pain-management-np | **Seniority:** senior | **Verb Context:** people
**Keywords:** pain management, chronic pain, opioid stewardship, nerve blocks, pain clinic, controlled substances

**Scope:** chronic and acute pain management for {patients} patients per week in a multidisciplinary pain clinic, prescribing {non_opioid} non-opioid therapies and coordinating {procedures} interventional procedures per month
**Result:** reducing average patient pain score from {before}/10 to {after}/10 at follow-up and achieving {opioid_reduction}% opioid dose reduction among long-term opioid patients

**Variations:**
- **A (Standard):** Managed chronic and acute pain management for {patients} patients per wee, reducing average patient pain score from {before}/10 to {after}/10 at follow-up and achieving {opioid_reduction}% opioid dose reduction among long-term opioid patients.
- **B (Result-first):** Reduced average patient pain score from {before}/10 to {after}/10 at follow-up and achiev by managing chronic and acute pain management for {patients} patients pe.
- **C (Impact-led):** Reduced average patient pain score from {before}/10 to {after}/10 at follow-up and achiev; managed chronic and acute pain management for {patients} patients per wee.
- **D (Concise):** Managed chronic and acute pain management for {patients} patien, reducing average patient pain score from {before}/10 to {after}/10 at follow-up .

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{non_opioid}`: 5 to 15, step 5 (integer)
  - `{procedures}`: 5 to 20, step 5 (integer)
  - `{before}`: 6 to 8, step 1 (integer)
  - `{after}`: 2 to 4, step 1 (integer)
  - `{opioid_reduction}`: 20 to 50, step 5 (percentage)

### HLTH-0112
**Role:** registered-nurse | **Theme:** med-surg | **Seniority:** junior | **Verb Context:** people
**Keywords:** med-surg nursing, general medical, multi-system, care planning, patient education, nursing assessment

**Scope:** medical-surgical nursing for {patients} patients per shift across {systems} body system diagnoses, completing {care_plans} individualized care plans and {rounds} hourly rounds per shift
**Result:** achieving {satisfaction}% patient satisfaction and a {falls}% zero-fall shift rate over {months} months

**Variations:**
- **A (Standard):** Managed medical-surgical nursing for {patients} patients per shift across, achieving {satisfaction}% patient satisfaction and a {falls}% zero-fall shift rate over {months} months.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction and a {falls}% zero-fall shift rate over {m by managing medical-surgical nursing for {patients} patients per shift a.
- **C (Impact-led):** Achieved {satisfaction}% patient satisfaction and a {falls}% zero-fall shift rate over {m; managed medical-surgical nursing for {patients} patients per shift across.
- **D (Concise):** Managed medical-surgical nursing for {patients} patients per sh, achieving {satisfaction}% patient satisfaction and a {falls}% zero-fall shift ra.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{systems}`: 3 to 8, step 1 (integer)
  - `{care_plans}`: 4 to 8, step 1 (integer)
  - `{rounds}`: 8 to 12, step 2 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{falls}`: 85 to 100, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0113
**Role:** health-admin | **Theme:** denials-management | **Seniority:** senior | **Verb Context:** operations
**Keywords:** denials management, revenue recovery, claims appeals, denial prevention, revenue integrity, managed care

**Scope:** denials management program for a {bed}-bed health system recovering ${denied}M in denied claims annually, managing {staff} appeals specialists across {payers} payer relationships
**Result:** achieving {overturn}% denial overturn rate and reducing initial denial rate from {before}% to {after}% of net patient revenue

**Variations:**
- **A (Standard):** Managed denials management program for a {bed}-bed health system recoveri, achieving {overturn}% denial overturn rate and reducing initial denial rate from {before}% to {after}% of net patient revenue.
- **B (Result-first):** Achieved {overturn}% denial overturn rate and Reduced initial denial rate from {before}% by managing denials management program for a {bed}-bed health system rec.
- **C (Impact-led):** Achieved {overturn}% denial overturn rate and Reduced initial denial rate from {before}%; managed denials management program for a {bed}-bed health system recoveri.
- **D (Concise):** Managed denials management program for a {bed}-bed health syste, achieving {overturn}% denial overturn rate and reducing initial denial rate from.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{denied}`: 1 to 50, step 1 (currency)
  - `{staff}`: 5 to 30, step 5 (integer)
  - `{payers}`: 10 to 50, step 10 (integer)
  - `{overturn}`: 60 to 90, step 5 (percentage)
  - `{before}`: 5 to 15, step 2 (percentage)
  - `{after}`: 2 to 6, step 1 (percentage)

### HLTH-0114
**Role:** doctor | **Theme:** internal-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** internal medicine, general medicine, outpatient clinic, chronic disease, preventive medicine, internist

**Scope:** internal medicine panel of {patients} patients per day across {conditions} chronic conditions, managing {labs} lab result follow-ups and {referrals} specialist referrals per week
**Result:** achieving {bpcontrol}% hypertension control rate and {a1c}% of diabetic patients at HbA1c below 8

**Variations:**
- **A (Standard):** Managed internal medicine panel of {patients} patients per day across {co, achieving {bpcontrol}% hypertension control rate and {a1c}% of diabetic patients at HbA1c below 8.
- **B (Result-first):** Achieved {bpcontrol}% hypertension control rate and {a1c}% of diabetic patients at HbA1c  by managing internal medicine panel of {patients} patients per day acros.
- **C (Impact-led):** Achieved {bpcontrol}% hypertension control rate and {a1c}% of diabetic patients at HbA1c ; managed internal medicine panel of {patients} patients per day across {co.
- **D (Concise):** Managed internal medicine panel of {patients} patients per day , achieving {bpcontrol}% hypertension control rate and {a1c}% of diabetic patients.

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{labs}`: 10 to 50, step 10 (integer)
  - `{referrals}`: 5 to 20, step 5 (integer)
  - `{bpcontrol}`: 65 to 88, step 5 (percentage)
  - `{a1c}`: 55 to 80, step 5 (percentage)

### HLTH-0115
**Role:** registered-nurse | **Theme:** addiction-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** addiction nursing, CIWA, detox, medication-assisted treatment, substance use disorder, withdrawal management

**Scope:** addiction nursing care for {patients} patients per shift on a {bed}-bed detox unit, conducting {ciwa} CIWA assessments per shift and administering MAT medications
**Result:** achieving {completion}% medically supervised withdrawal completion rate and a {referral}% post-detox treatment referral acceptance rate

**Variations:**
- **A (Standard):** Managed addiction nursing care for {patients} patients per shift on a {be, achieving {completion}% medically supervised withdrawal completion rate and a {referral}% post-detox treatment referral acceptance rate.
- **B (Result-first):** Achieved {completion}% medically supervised withdrawal completion rate and a {referral}%  by managing addiction nursing care for {patients} patients per shift on .
- **C (Impact-led):** Achieved {completion}% medically supervised withdrawal completion rate and a {referral}% ; managed addiction nursing care for {patients} patients per shift on a {be.
- **D (Concise):** Managed addiction nursing care for {patients} patients per shif, achieving {completion}% medically supervised withdrawal completion rate and a {r.

**Variables:**
  - `{patients}`: 5 to 12, step 1 (integer)
  - `{bed}`: 10 to 20, step 5 (integer)
  - `{ciwa}`: 10 to 30, step 5 (integer)
  - `{completion}`: 80 to 97, step 5 (percentage)
  - `{referral}`: 55 to 80, step 5 (percentage)

### HLTH-0116
**Role:** health-admin | **Theme:** nurse-staffing-director | **Seniority:** senior | **Verb Context:** people
**Keywords:** nursing staffing, nurse-to-patient ratios, flex staffing, agency reduction, workforce planning, nursing retention

**Scope:** nursing staffing and workforce planning for a {bed}-bed hospital with {fte} nursing FTEs across {units} units, reducing reliance on agency and travel nurses
**Result:** cutting agency and travel nurse spend by ${savings}M annually and improving nurse satisfaction score from {before} to {after}/10

**Variations:**
- **A (Standard):** Managed nursing staffing and workforce planning for a {bed}-bed hospital , cutting agency and travel nurse spend by ${savings}M annually and improving nurse satisfaction score from {before} to {after}/10.
- **B (Result-first):** cutting agency and travel nurse spend by ${savings}M annually and Improved nurse satisfac by managing nursing staffing and workforce planning for a {bed}-bed hosp.
- **C (Impact-led):** cutting agency and travel nurse spend by ${savings}M annually and Improved nurse satisfac; managed nursing staffing and workforce planning for a {bed}-bed hospital .
- **D (Concise):** Managed nursing staffing and workforce planning for a {bed}-bed, cutting agency and travel nurse spend by ${savings}m annually and improving nurs.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{fte}`: 50 to 500, step 50 (integer)
  - `{units}`: 5 to 20, step 5 (integer)
  - `{savings}`: 1 to 20, step 1 (currency)
  - `{before}`: 5 to 7, step 0.5 (integer)
  - `{after}`: 8 to 10, step 0.5 (integer)

### HLTH-0117
**Role:** registered-nurse | **Theme:** gerontological-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** gerontology, geriatric nursing, fall prevention, delirium prevention, polypharmacy, elder care

**Scope:** geriatric nursing for {patients} patients per shift on a {bed}-bed senior care unit, implementing fall prevention, delirium prevention, and {meds} polypharmacy medication reviews per month
**Result:** achieving a {falls}% falls-with-injury rate below national benchmark and reducing delirium incidence from {before}% to {after}% of admissions

**Variations:**
- **A (Standard):** Managed geriatric nursing for {patients} patients per shift on a {bed}-be, achieving a {falls}% falls-with-injury rate below national benchmark and reducing delirium incidence from {before}% to {after}% of admissions.
- **B (Result-first):** Achieved a {falls}% falls-with-injury rate below national benchmark and Reduced delirium by managing geriatric nursing for {patients} patients per shift on a {be.
- **C (Impact-led):** Achieved a {falls}% falls-with-injury rate below national benchmark and Reduced delirium; managed geriatric nursing for {patients} patients per shift on a {bed}-be.
- **D (Concise):** Managed geriatric nursing for {patients} patients per shift on , achieving a {falls}% falls-with-injury rate below national benchmark and reducin.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{meds}`: 20 to 80, step 10 (integer)
  - `{falls}`: 0.5 to 3, step 0.5 (percentage)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 5 to 12, step 2 (percentage)

### HLTH-0118
**Role:** doctor | **Theme:** cardiology | **Seniority:** senior | **Verb Context:** people
**Keywords:** cardiology, heart failure, EF, echocardiography, cardiac catheterization, ACC/AHA guidelines

**Scope:** cardiology panel of {patients} patients per week including {echo} echocardiograms and {caths} cardiac catheterizations per month across {conditions} cardiovascular diagnoses
**Result:** achieving {hf_readmit}% heart failure 30-day readmission rate below national benchmark and {guideline}% of eligible patients on guideline-directed medical therapy

**Variations:**
- **A (Standard):** Managed cardiology panel of {patients} patients per week including {echo}, achieving {hf_readmit}% heart failure 30-day readmission rate below national benchmark and {guideline}% of eligible patients on guideline-directed medical therapy.
- **B (Result-first):** Achieved {hf_readmit}% heart failure 30-day readmission rate below national benchmark and by managing cardiology panel of {patients} patients per week including {.
- **C (Impact-led):** Achieved {hf_readmit}% heart failure 30-day readmission rate below national benchmark and; managed cardiology panel of {patients} patients per week including {echo}.
- **D (Concise):** Managed cardiology panel of {patients} patients per week includ, achieving {hf_readmit}% heart failure 30-day readmission rate below national ben.

**Variables:**
  - `{patients}`: 30 to 60, step 10 (integer)
  - `{echo}`: 20 to 60, step 10 (integer)
  - `{caths}`: 10 to 30, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{hf_readmit}`: 18 to 25, step 2 (percentage)
  - `{guideline}`: 80 to 98, step 5 (percentage)

### HLTH-0119
**Role:** registered-nurse | **Theme:** ltac | **Seniority:** mid | **Verb Context:** people
**Keywords:** LTAC, long-term acute care, ventilator weaning, complex medical, tracheostomy care, prolonged recovery

**Scope:** long-term acute care nursing for {patients} patients per shift at a {bed}-bed LTAC facility, managing {vents} ventilator-dependent patients and {trachs} tracheostomy care patients
**Result:** achieving {wean}% successful ventilator liberation rate and reducing LTAC average LOS from {before} to {after} days

**Variations:**
- **A (Standard):** Managed long-term acute care nursing for {patients} patients per shift at, achieving {wean}% successful ventilator liberation rate and reducing LTAC average LOS from {before} to {after} days.
- **B (Result-first):** Achieved {wean}% successful ventilator liberation rate and Reduced LTAC average LOS from by managing long-term acute care nursing for {patients} patients per shi.
- **C (Impact-led):** Achieved {wean}% successful ventilator liberation rate and Reduced LTAC average LOS from; managed long-term acute care nursing for {patients} patients per shift at.
- **D (Concise):** Managed long-term acute care nursing for {patients} patients pe, achieving {wean}% successful ventilator liberation rate and reducing ltac averag.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 50, step 5 (integer)
  - `{vents}`: 2 to 6, step 1 (integer)
  - `{trachs}`: 2 to 6, step 1 (integer)
  - `{wean}`: 50 to 80, step 5 (percentage)
  - `{before}`: 20 to 35, step 5 (integer)
  - `{after}`: 14 to 24, step 2 (integer)

### HLTH-0120
**Role:** dietitian | **Theme:** pediatric-nutrition | **Seniority:** mid | **Verb Context:** people
**Keywords:** pediatric nutrition, growth assessment, failure to thrive, enteral nutrition, food allergy, WIC

**Scope:** pediatric nutrition counseling for {patients} patients per week across {age_groups} age groups from infants to adolescents, including {enteral} patients on enteral nutrition support
**Result:** achieving {growth}% of patients on adequate growth trajectory at 3-month follow-up and reducing {ftt}% new failure-to-thrive diagnoses through early intervention

**Variations:**
- **A (Standard):** Managed pediatric nutrition counseling for {patients} patients per week a, achieving {growth}% of patients on adequate growth trajectory at 3-month follow-up and reducing {ftt}% new failure-to-thrive diagnoses through early intervention.
- **B (Result-first):** Achieved {growth}% of patients on adequate growth trajectory at 3-month follow-up and red by managing pediatric nutrition counseling for {patients} patients per w.
- **C (Impact-led):** Achieved {growth}% of patients on adequate growth trajectory at 3-month follow-up and red; managed pediatric nutrition counseling for {patients} patients per week a.
- **D (Concise):** Managed pediatric nutrition counseling for {patients} patients , achieving {growth}% of patients on adequate growth trajectory at 3-month follow-.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{age_groups}`: 4 to 6, step 1 (integer)
  - `{enteral}`: 3 to 10, step 1 (integer)
  - `{growth}`: 75 to 96, step 5 (percentage)
  - `{ftt}`: 15 to 40, step 5 (percentage)

### HLTH-0121
**Role:** doctor | **Theme:** endocrinology | **Seniority:** mid | **Verb Context:** people
**Keywords:** endocrinology, diabetes management, thyroid disorders, pituitary, adrenal, CGM, insulin pump

**Scope:** endocrinology panel of {patients} patients per week managing {conditions} endocrine conditions and interpreting {cgm} continuous glucose monitor downloads per month
**Result:** achieving {a1c}% of type 1 diabetic patients at HbA1c below 7 and {screen}% diabetic complication screening completion rate

**Variations:**
- **A (Standard):** Managed endocrinology panel of {patients} patients per week managing {con, achieving {a1c}% of type 1 diabetic patients at HbA1c below 7 and {screen}% diabetic complication screening completion rate.
- **B (Result-first):** Achieved {a1c}% of type 1 diabetic patients at HbA1c below 7 and {screen}% diabetic compl by managing endocrinology panel of {patients} patients per week managing.
- **C (Impact-led):** Achieved {a1c}% of type 1 diabetic patients at HbA1c below 7 and {screen}% diabetic compl; managed endocrinology panel of {patients} patients per week managing {con.
- **D (Concise):** Managed endocrinology panel of {patients} patients per week man, achieving {a1c}% of type 1 diabetic patients at hba1c below 7 and {screen}% diab.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{cgm}`: 20 to 80, step 10 (integer)
  - `{a1c}`: 50 to 75, step 5 (percentage)
  - `{screen}`: 80 to 99, step 5 (percentage)

### HLTH-0122
**Role:** registered-nurse | **Theme:** oncology-inpatient | **Seniority:** senior | **Verb Context:** people
**Keywords:** inpatient oncology, bone marrow transplant, neutropenic precautions, cancer care, BMT, hematology

**Scope:** inpatient oncology nursing for {patients} patients per shift including {bmt} bone marrow transplant patients requiring reverse isolation across {cancer_types} cancer diagnoses
**Result:** achieving {infection}% neutropenic fever prevention compliance and maintaining {bmt_survival}% 100-day BMT survival rate for the unit

**Variations:**
- **A (Standard):** Managed inpatient oncology nursing for {patients} patients per shift incl, achieving {infection}% neutropenic fever prevention compliance and maintaining {bmt_survival}% 100-day BMT survival rate for the unit.
- **B (Result-first):** Achieved {infection}% neutropenic fever prevention compliance and Maintained {bmt_surviv by managing inpatient oncology nursing for {patients} patients per shift.
- **C (Impact-led):** Achieved {infection}% neutropenic fever prevention compliance and Maintained {bmt_surviv; managed inpatient oncology nursing for {patients} patients per shift incl.
- **D (Concise):** Managed inpatient oncology nursing for {patients} patients per , achieving {infection}% neutropenic fever prevention compliance and maintaining {.

**Variables:**
  - `{patients}`: 3 to 6, step 1 (integer)
  - `{bmt}`: 1 to 3, step 1 (integer)
  - `{cancer_types}`: 5 to 10, step 1 (integer)
  - `{infection}`: 92 to 100, step 2 (percentage)
  - `{bmt_survival}`: 85 to 98, step 2 (percentage)

### HLTH-0123
**Role:** health-admin | **Theme:** volunteer-services | **Seniority:** junior | **Verb Context:** operations
**Keywords:** volunteer program, volunteer management, patient ambassadors, community engagement, hospital volunteers

**Scope:** volunteer services program with {volunteers} active volunteers across {departments} departments, coordinating {hours}K volunteer hours annually
**Result:** increasing volunteer retention from {before}% to {after}% and growing volunteer hours from {hours_before}K to {hours_after}K over {months} months

**Variations:**
- **A (Standard):** Managed volunteer services program with {volunteers} active volunteers ac, increasing volunteer retention from {before}% to {after}% and growing volunteer hours from {hours_before}K to {hours_after}K over {months} months.
- **B (Result-first):** increasing volunteer retention from {before}% to {after}% and growing volunteer hours from by managing volunteer services program with {volunteers} active voluntee.
- **C (Impact-led):** increasing volunteer retention from {before}% to {after}% and growing volunteer hours from; managed volunteer services program with {volunteers} active volunteers ac.
- **D (Concise):** Managed volunteer services program with {volunteers} active vol, increasing volunteer retention from {before}% to {after}% and growing volunteer .

**Variables:**
  - `{volunteers}`: 50 to 500, step 50 (integer)
  - `{departments}`: 5 to 20, step 5 (integer)
  - `{hours}`: 5 to 50, step 5 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 75 to 92, step 5 (percentage)
  - `{hours_before}`: 5 to 20, step 5 (integer)
  - `{hours_after}`: 15 to 50, step 5 (integer)
  - `{months}`: 12 to 24, step 6 (integer)

### HLTH-0124
**Role:** registered-nurse | **Theme:** ambulatory-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** ambulatory nursing, outpatient nursing, clinic nursing, patient triage, care coordination, telephone triage

**Scope:** ambulatory care nursing for {patients} patients per day in an outpatient clinic managing {calls} triage calls and coordinating {referrals} specialist referrals per week
**Result:** achieving {triage}% appropriate triage disposition rate and reducing unnecessary ER visits among clinic patients by {er}%

**Variations:**
- **A (Standard):** Managed ambulatory care nursing for {patients} patients per day in an out, achieving {triage}% appropriate triage disposition rate and reducing unnecessary ER visits among clinic patients by {er}%.
- **B (Result-first):** Achieved {triage}% appropriate triage disposition rate and Reduced unnecessary ER visits by managing ambulatory care nursing for {patients} patients per day in a.
- **C (Impact-led):** Achieved {triage}% appropriate triage disposition rate and Reduced unnecessary ER visits; managed ambulatory care nursing for {patients} patients per day in an out.
- **D (Concise):** Managed ambulatory care nursing for {patients} patients per day, achieving {triage}% appropriate triage disposition rate and reducing unnecessary.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{calls}`: 20 to 60, step 10 (integer)
  - `{referrals}`: 5 to 20, step 5 (integer)
  - `{triage}`: 92 to 100, step 2 (percentage)
  - `{er}`: 15 to 40, step 5 (percentage)

### HLTH-0125
**Role:** health-admin | **Theme:** revenue-integrity | **Seniority:** mid | **Verb Context:** operations
**Keywords:** revenue integrity, charge capture, CDM, charge description master, coding compliance, revenue optimization

**Scope:** revenue integrity program auditing {encounters}K encounters per month across {departments} departments, identifying charge capture gaps and CDM accuracy issues
**Result:** recovering ${recovered}M in previously under-captured revenue and improving charge capture accuracy from {before}% to {after}%

**Variations:**
- **A (Standard):** Managed revenue integrity program auditing {encounters}k encounters per m, recovering ${recovered}M in previously under-captured revenue and improving charge capture accuracy from {before}% to {after}%.
- **B (Result-first):** recovering ${recovered}M in previously under-captured revenue and Improved charge capture by managing revenue integrity program auditing {encounters}k encounters .
- **C (Impact-led):** recovering ${recovered}M in previously under-captured revenue and Improved charge capture; managed revenue integrity program auditing {encounters}k encounters per m.
- **D (Concise):** Managed revenue integrity program auditing {encounters}k encoun, recovering ${recovered}m in previously under-captured revenue and improving char.

**Variables:**
  - `{encounters}`: 1 to 100, step 10 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{recovered}`: 1 to 20, step 1 (currency)
  - `{before}`: 88 to 92, step 1 (percentage)
  - `{after}`: 97 to 100, step 1 (percentage)

### HLTH-0126
**Role:** doctor | **Theme:** gastroenterology | **Seniority:** mid | **Verb Context:** people
**Keywords:** gastroenterology, colonoscopy, endoscopy, IBD, GERD, liver disease, GI

**Scope:** gastroenterology panel of {patients} patients per week performing {scopes} endoscopic procedures per month across {conditions} GI diagnoses
**Result:** achieving {adr}% adenoma detection rate above national benchmark and {IBD}% of IBD patients in clinical remission at follow-up

**Variations:**
- **A (Standard):** Managed gastroenterology panel of {patients} patients per week performing, achieving {adr}% adenoma detection rate above national benchmark and {IBD}% of IBD patients in clinical remission at follow-up.
- **B (Result-first):** Achieved {adr}% adenoma detection rate above national benchmark and {IBD}% of IBD patient by managing gastroenterology panel of {patients} patients per week perfo.
- **C (Impact-led):** Achieved {adr}% adenoma detection rate above national benchmark and {IBD}% of IBD patient; managed gastroenterology panel of {patients} patients per week performing.
- **D (Concise):** Managed gastroenterology panel of {patients} patients per week , achieving {adr}% adenoma detection rate above national benchmark and {ibd}% of i.

**Variables:**
  - `{patients}`: 30 to 60, step 10 (integer)
  - `{scopes}`: 30 to 80, step 10 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{adr}`: 30 to 50, step 5 (percentage)
  - `{IBD}`: 60 to 85, step 5 (percentage)

### HLTH-0127
**Role:** registered-nurse | **Theme:** remote-patient-monitoring | **Seniority:** mid | **Verb Context:** operations
**Keywords:** remote patient monitoring, RPM, wearable devices, digital health, chronic disease, telemonitoring

**Scope:** remote patient monitoring program for {patients}K enrolled patients using {device_types} device types monitoring vital signs and symptoms for {conditions} chronic conditions
**Result:** identifying {alerts}K actionable clinical alerts per month and reducing 30-day hospital admissions among enrolled patients by {reduction}%

**Variations:**
- **A (Standard):** Managed remote patient monitoring program for {patients}k enrolled patien, identifying {alerts}K actionable clinical alerts per month and reducing 30-day hospital admissions among enrolled patients by {reduction}%.
- **B (Result-first):** identifying {alerts}K actionable clinical alerts per month and Reduced 30-day hospital ad by managing remote patient monitoring program for {patients}k enrolled p.
- **C (Impact-led):** identifying {alerts}K actionable clinical alerts per month and Reduced 30-day hospital ad; managed remote patient monitoring program for {patients}k enrolled patien.
- **D (Concise):** Managed remote patient monitoring program for {patients}k enrol, identifying {alerts}k actionable clinical alerts per month and reducing 30-day h.

**Variables:**
  - `{patients}`: 1 to 20, step 1 (integer)
  - `{device_types}`: 3 to 8, step 1 (integer)
  - `{conditions}`: 3 to 8, step 1 (integer)
  - `{alerts}`: 1 to 20, step 1 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### HLTH-0128
**Role:** health-admin | **Theme:** charge-capture | **Seniority:** junior | **Verb Context:** operations
**Keywords:** charge capture, coding, clinical documentation improvement, CDI, charge reconciliation, revenue cycle

**Scope:** charge capture reconciliation for {encounters}K encounters per month across {service_lines} service lines, reviewing {charges}K charge line items for accuracy
**Result:** recovering ${recovered}K per month in missed charges and reducing charge lag from {before} to {after} days

**Variations:**
- **A (Standard):** Managed charge capture reconciliation for {encounters}k encounters per mo, recovering ${recovered}K per month in missed charges and reducing charge lag from {before} to {after} days.
- **B (Result-first):** recovering ${recovered}K per month in missed charges and Reduced charge lag from {before} by managing charge capture reconciliation for {encounters}k encounters p.
- **C (Impact-led):** recovering ${recovered}K per month in missed charges and Reduced charge lag from {before}; managed charge capture reconciliation for {encounters}k encounters per mo.
- **D (Concise):** Managed charge capture reconciliation for {encounters}k encount, recovering ${recovered}k per month in missed charges and reducing charge lag fro.

**Variables:**
  - `{encounters}`: 1 to 50, step 5 (integer)
  - `{service_lines}`: 3 to 10, step 1 (integer)
  - `{charges}`: 1 to 100, step 5 (integer)
  - `{recovered}`: 10 to 500, step 10 (currency)
  - `{before}`: 5 to 10, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### HLTH-0129
**Role:** doctor | **Theme:** nephrology | **Seniority:** mid | **Verb Context:** people
**Keywords:** nephrology, CKD, ESRD, dialysis, transplant, electrolyte management, acute kidney injury

**Scope:** nephrology panel of {patients} patients per week managing {ckd_stages} CKD stages and {dialysis} dialysis patients across in-center and home modalities
**Result:** achieving {progression}% CKD progression slowing rate at 2 years and {transplant}% of ESRD patients referred to transplant evaluation

**Variations:**
- **A (Standard):** Managed nephrology panel of {patients} patients per week managing {ckd_st, achieving {progression}% CKD progression slowing rate at 2 years and {transplant}% of ESRD patients referred to transplant evaluation.
- **B (Result-first):** Achieved {progression}% CKD progression slowing rate at 2 years and {transplant}% of ESRD by managing nephrology panel of {patients} patients per week managing {c.
- **C (Impact-led):** Achieved {progression}% CKD progression slowing rate at 2 years and {transplant}% of ESRD; managed nephrology panel of {patients} patients per week managing {ckd_st.
- **D (Concise):** Managed nephrology panel of {patients} patients per week managi, achieving {progression}% ckd progression slowing rate at 2 years and {transplant.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{ckd_stages}`: 3 to 5, step 1 (integer)
  - `{dialysis}`: 20 to 60, step 10 (integer)
  - `{progression}`: 50 to 75, step 5 (percentage)
  - `{transplant}`: 30 to 60, step 5 (percentage)

### HLTH-0130
**Role:** registered-nurse | **Theme:** clinical-educator | **Seniority:** senior | **Verb Context:** people
**Keywords:** clinical education, nursing education, skills lab, preceptorship, orientation, competency validation

**Scope:** clinical nursing education for a {bed}-bed facility, managing orientation for {orientees} new nurses per year and delivering {modules} competency modules across {units} units
**Result:** reducing time-to-independent practice from {before} to {after} weeks and improving new nurse 1-year retention from {retention_before}% to {retention_after}%

**Variations:**
- **A (Standard):** Managed clinical nursing education for a {bed}-bed facility, managing ori, reducing time-to-independent practice from {before} to {after} weeks and improving new nurse 1-year retention from {retention_before}% to {retention_after}%.
- **B (Result-first):** Reduced time-to-independent practice from {before} to {after} weeks and Improved new nur by managing clinical nursing education for a {bed}-bed facility, managin.
- **C (Impact-led):** Reduced time-to-independent practice from {before} to {after} weeks and Improved new nur; managed clinical nursing education for a {bed}-bed facility, managing ori.
- **D (Concise):** Managed clinical nursing education for a {bed}-bed facility, ma, reducing time-to-independent practice from {before} to {after} weeks and improvi.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{orientees}`: 20 to 200, step 20 (integer)
  - `{modules}`: 20 to 80, step 10 (integer)
  - `{units}`: 5 to 20, step 5 (integer)
  - `{before}`: 16 to 24, step 4 (integer)
  - `{after}`: 8 to 14, step 2 (integer)
  - `{retention_before}`: 60 to 74, step 2 (percentage)
  - `{retention_after}`: 82 to 96, step 2 (percentage)

### HLTH-0131
**Role:** registered-nurse | **Theme:** critical-access | **Seniority:** mid | **Verb Context:** operations
**Keywords:** critical access, rural nursing, multi-role nursing, small hospital, generalist nursing, rural health

**Scope:** {patients} patients per shift in a {bed}-bed critical access hospital, cross-trained across ED, med-surg, and perioperative settings
**Result:** maintaining competency validation across {competencies} skill areas and achieving {satisfaction}% patient satisfaction above the rural CAH benchmark

**Variations:**
- **A (Standard):** Managed {patients} patients per shift in a {bed}-bed critical access hosp, maintaining competency validation across {competencies} skill areas and achieving {satisfaction}% patient satisfaction above the rural CAH benchmark.
- **B (Result-first):** Maintained competency validation across {competencies} skill areas and Achieved {satisfa by managing {patients} patients per shift in a {bed}-bed critical access.
- **C (Impact-led):** Maintained competency validation across {competencies} skill areas and Achieved {satisfa; managed {patients} patients per shift in a {bed}-bed critical access hosp.
- **D (Concise):** Managed {patients} patients per shift in a {bed}-bed critical a, maintaining competency validation across {competencies} skill areas and achievin.

**Variables:**
  - `{patients}`: 5 to 12, step 1 (integer)
  - `{bed}`: 10 to 25, step 5 (integer)
  - `{competencies}`: 10 to 25, step 5 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0132
**Role:** registered-nurse | **Theme:** post-surgical | **Seniority:** junior | **Verb Context:** operations
**Keywords:** post-surgical care, PACU, post-anesthesia, phase 2 recovery, pain management, discharge readiness

**Scope:** post-anesthesia care for {patients} patients per shift in a {bay}-bay PACU managing emergence from {anesthesia_types} anesthesia types
**Result:** achieving {ready}% discharge-ready criteria met within {minutes} minutes of PACU arrival and {nausea}% PONV management success rate

**Variations:**
- **A (Standard):** Managed post-anesthesia care for {patients} patients per shift in a {bay}, achieving {ready}% discharge-ready criteria met within {minutes} minutes of PACU arrival and {nausea}% PONV management success rate.
- **B (Result-first):** Achieved {ready}% discharge-ready criteria met within {minutes} minutes of PACU arrival a by managing post-anesthesia care for {patients} patients per shift in a .
- **C (Impact-led):** Achieved {ready}% discharge-ready criteria met within {minutes} minutes of PACU arrival a; managed post-anesthesia care for {patients} patients per shift in a {bay}.
- **D (Concise):** Managed post-anesthesia care for {patients} patients per shift , achieving {ready}% discharge-ready criteria met within {minutes} minutes of pacu.

**Variables:**
  - `{patients}`: 4 to 10, step 2 (integer)
  - `{bay}`: 8 to 20, step 4 (integer)
  - `{anesthesia_types}`: 3 to 5, step 1 (integer)
  - `{ready}`: 88 to 99, step 2 (percentage)
  - `{minutes}`: 60 to 120, step 15 (integer)
  - `{nausea}`: 85 to 99, step 2 (percentage)

### HLTH-0133
**Role:** registered-nurse | **Theme:** interventional-radiology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** interventional radiology, IR nursing, procedural nursing, fluoroscopy, contrast administration, moderate sedation

**Scope:** interventional radiology nursing support for {cases} IR procedures per shift across {procedure_types} procedure categories including biopsies, drainages, and vascular access
**Result:** achieving {protocol}% moderate sedation protocol adherence and {complication}% procedural complication rate below benchmark

**Variations:**
- **A (Standard):** Managed interventional radiology nursing support for {cases} ir procedure, achieving {protocol}% moderate sedation protocol adherence and {complication}% procedural complication rate below benchmark.
- **B (Result-first):** Achieved {protocol}% moderate sedation protocol adherence and {complication}% procedural  by managing interventional radiology nursing support for {cases} ir proc.
- **C (Impact-led):** Achieved {protocol}% moderate sedation protocol adherence and {complication}% procedural ; managed interventional radiology nursing support for {cases} ir procedure.
- **D (Concise):** Managed interventional radiology nursing support for {cases} ir, achieving {protocol}% moderate sedation protocol adherence and {complication}% p.

**Variables:**
  - `{cases}`: 5 to 12, step 1 (integer)
  - `{procedure_types}`: 5 to 12, step 1 (integer)
  - `{protocol}`: 98 to 100, step 1 (percentage)
  - `{complication}`: 2 to 8, step 1 (percentage)

### HLTH-0134
**Role:** registered-nurse | **Theme:** spinal-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** spinal nursing, spinal cord injury, SCI, neurological assessment, spinal precautions, neurosurgery

**Scope:** spinal care nursing for {patients} patients per shift post-spinal surgery and acute SCI, conducting {checks} neurological checks per shift and maintaining spinal precautions
**Result:** achieving {protocol}% spinal precaution compliance and contributing to {outcome}% favorable neurological outcome rate at discharge

**Variations:**
- **A (Standard):** Managed spinal care nursing for {patients} patients per shift post-spinal, achieving {protocol}% spinal precaution compliance and contributing to {outcome}% favorable neurological outcome rate at discharge.
- **B (Result-first):** Achieved {protocol}% spinal precaution compliance and Contributed to {outcome}% favorabl by managing spinal care nursing for {patients} patients per shift post-s.
- **C (Impact-led):** Achieved {protocol}% spinal precaution compliance and Contributed to {outcome}% favorabl; managed spinal care nursing for {patients} patients per shift post-spinal.
- **D (Concise):** Managed spinal care nursing for {patients} patients per shift p, achieving {protocol}% spinal precaution compliance and contributing to {outcome}.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{checks}`: 8 to 20, step 4 (integer)
  - `{protocol}`: 100 to 100, step 0 (percentage)
  - `{outcome}`: 80 to 97, step 5 (percentage)

### HLTH-0135
**Role:** registered-nurse | **Theme:** CVICU | **Seniority:** senior | **Verb Context:** people
**Keywords:** cardiovascular ICU, cardiac surgery, CABG, valve surgery, LVAD, IABP, hemodynamic monitoring

**Scope:** cardiovascular ICU nursing for {patients} post-cardiac surgery patients per shift managing {devices} mechanical circulatory support devices and {drips} vasoactive infusions
**Result:** achieving {extubation}% next-day extubation rate and maintaining {mortality}% 30-day surgical mortality rate below STS benchmark

**Variations:**
- **A (Standard):** Managed cardiovascular icu nursing for {patients} post-cardiac surgery pa, achieving {extubation}% next-day extubation rate and maintaining {mortality}% 30-day surgical mortality rate below STS benchmark.
- **B (Result-first):** Achieved {extubation}% next-day extubation rate and Maintained {mortality}% 30-day surgi by managing cardiovascular icu nursing for {patients} post-cardiac surge.
- **C (Impact-led):** Achieved {extubation}% next-day extubation rate and Maintained {mortality}% 30-day surgi; managed cardiovascular icu nursing for {patients} post-cardiac surgery pa.
- **D (Concise):** Managed cardiovascular icu nursing for {patients} post-cardiac , achieving {extubation}% next-day extubation rate and maintaining {mortality}% 30.

**Variables:**
  - `{patients}`: 2 to 4, step 1 (integer)
  - `{devices}`: 1 to 4, step 1 (integer)
  - `{drips}`: 3 to 8, step 1 (integer)
  - `{extubation}`: 80 to 96, step 5 (percentage)
  - `{mortality}`: 2 to 6, step 1 (percentage)

### HLTH-0136
**Role:** registered-nurse | **Theme:** PICU | **Seniority:** senior | **Verb Context:** people
**Keywords:** PICU, pediatric intensive care, pediatric critical care, mechanical ventilation, sepsis, critically ill children

**Scope:** pediatric critical care nursing for {patients} PICU patients per shift including {vents} ventilated children across {age_groups} age groups from neonates to adolescents
**Result:** achieving {bundle}% pediatric sepsis bundle compliance within 1 hour and maintaining {mortality}% PICU mortality rate below national benchmark

**Variations:**
- **A (Standard):** Managed pediatric critical care nursing for {patients} picu patients per , achieving {bundle}% pediatric sepsis bundle compliance within 1 hour and maintaining {mortality}% PICU mortality rate below national benchmark.
- **B (Result-first):** Achieved {bundle}% pediatric sepsis bundle compliance within 1 hour and Maintained {mort by managing pediatric critical care nursing for {patients} picu patients.
- **C (Impact-led):** Achieved {bundle}% pediatric sepsis bundle compliance within 1 hour and Maintained {mort; managed pediatric critical care nursing for {patients} picu patients per .
- **D (Concise):** Managed pediatric critical care nursing for {patients} picu pat, achieving {bundle}% pediatric sepsis bundle compliance within 1 hour and maintai.

**Variables:**
  - `{patients}`: 2 to 4, step 1 (integer)
  - `{vents}`: 1 to 3, step 1 (integer)
  - `{age_groups}`: 3 to 5, step 1 (integer)
  - `{bundle}`: 92 to 100, step 2 (percentage)
  - `{mortality}`: 2 to 6, step 1 (percentage)

### HLTH-0137
**Role:** registered-nurse | **Theme:** ER-triage | **Seniority:** mid | **Verb Context:** operations
**Keywords:** emergency triage, ESI, triage nursing, acuity assessment, urgent care, ED operations

**Scope:** ED triage for {patients} patients per shift using the Emergency Severity Index, assessing {acuity_levels} acuity levels in a {volume}K annual-visit emergency department
**Result:** achieving {accuracy}% triage accuracy rate and reducing average triage-to-room time from {before} to {after} minutes

**Variations:**
- **A (Standard):** Managed ed triage for {patients} patients per shift using the emergency s, achieving {accuracy}% triage accuracy rate and reducing average triage-to-room time from {before} to {after} minutes.
- **B (Result-first):** Achieved {accuracy}% triage accuracy rate and Reduced average triage-to-room time from { by managing ed triage for {patients} patients per shift using the emerge.
- **C (Impact-led):** Achieved {accuracy}% triage accuracy rate and Reduced average triage-to-room time from {; managed ed triage for {patients} patients per shift using the emergency s.
- **D (Concise):** Managed ed triage for {patients} patients per shift using the e, achieving {accuracy}% triage accuracy rate and reducing average triage-to-room t.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{acuity_levels}`: 5 to 5, step 0 (integer)
  - `{volume}`: 20 to 100, step 10 (integer)
  - `{accuracy}`: 92 to 99, step 2 (percentage)
  - `{before}`: 15 to 40, step 5 (integer)
  - `{after}`: 5 to 12, step 2 (integer)

### HLTH-0138
**Role:** registered-nurse | **Theme:** gastroenterology-nursing | **Seniority:** mid | **Verb Context:** operations
**Keywords:** endoscopy nursing, GI nursing, colonoscopy, upper endoscopy, moderate sedation, GI procedure

**Scope:** endoscopy nursing for {cases} GI procedures per shift including colonoscopies and upper endoscopies across {providers} gastroenterologists
**Result:** achieving {cecal}% cecal intubation rate among assisted colonoscopies and {recovery}% procedure-to-recovery-room transfer within {minutes} minutes

**Variations:**
- **A (Standard):** Managed endoscopy nursing for {cases} gi procedures per shift including c, achieving {cecal}% cecal intubation rate among assisted colonoscopies and {recovery}% procedure-to-recovery-room transfer within {minutes} minutes.
- **B (Result-first):** Achieved {cecal}% cecal intubation rate among assisted colonoscopies and {recovery}% proc by managing endoscopy nursing for {cases} gi procedures per shift includ.
- **C (Impact-led):** Achieved {cecal}% cecal intubation rate among assisted colonoscopies and {recovery}% proc; managed endoscopy nursing for {cases} gi procedures per shift including c.
- **D (Concise):** Managed endoscopy nursing for {cases} gi procedures per shift i, achieving {cecal}% cecal intubation rate among assisted colonoscopies and {recov.

**Variables:**
  - `{cases}`: 10 to 20, step 2 (integer)
  - `{providers}`: 2 to 6, step 1 (integer)
  - `{cecal}`: 95 to 100, step 1 (percentage)
  - `{recovery}`: 97 to 100, step 1 (percentage)
  - `{minutes}`: 30 to 60, step 15 (integer)

### HLTH-0139
**Role:** registered-nurse | **Theme:** labor-assessment | **Seniority:** junior | **Verb Context:** people
**Keywords:** labor assessment, antepartum nursing, antepartum testing, NST, triage OB, maternal assessment

**Scope:** obstetric triage and antepartum testing for {patients} patients per shift, performing {nst} non-stress tests and {bpp} biophysical profiles per shift
**Result:** achieving {false_alarm}% unnecessary admission rate below benchmark and {satisfaction}% patient satisfaction with the triage experience

**Variations:**
- **A (Standard):** Managed obstetric triage and antepartum testing for {patients} patients p, achieving {false_alarm}% unnecessary admission rate below benchmark and {satisfaction}% patient satisfaction with the triage experience.
- **B (Result-first):** Achieved {false_alarm}% unnecessary admission rate below benchmark and {satisfaction}% pa by managing obstetric triage and antepartum testing for {patients} patie.
- **C (Impact-led):** Achieved {false_alarm}% unnecessary admission rate below benchmark and {satisfaction}% pa; managed obstetric triage and antepartum testing for {patients} patients p.
- **D (Concise):** Managed obstetric triage and antepartum testing for {patients} , achieving {false_alarm}% unnecessary admission rate below benchmark and {satisfa.

**Variables:**
  - `{patients}`: 8 to 20, step 4 (integer)
  - `{nst}`: 5 to 20, step 5 (integer)
  - `{bpp}`: 2 to 10, step 2 (integer)
  - `{false_alarm}`: 15 to 30, step 5 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0140
**Role:** registered-nurse | **Theme:** blood-bank | **Seniority:** junior | **Verb Context:** operations
**Keywords:** blood bank, transfusion nursing, blood products, type and screen, transfusion reactions, massive transfusion

**Scope:** {transfusions} blood product transfusions per shift across {products} product types including pRBC, FFP, platelets, and cryoprecipitate
**Result:** achieving {reaction}% transfusion reaction identification and response rate and {protocol}% massive transfusion protocol compliance

**Variations:**
- **A (Standard):** Managed {transfusions} blood product transfusions per shift across {produ, achieving {reaction}% transfusion reaction identification and response rate and {protocol}% massive transfusion protocol compliance.
- **B (Result-first):** Achieved {reaction}% transfusion reaction identification and response rate and {protocol} by managing {transfusions} blood product transfusions per shift across {.
- **C (Impact-led):** Achieved {reaction}% transfusion reaction identification and response rate and {protocol}; managed {transfusions} blood product transfusions per shift across {produ.
- **D (Concise):** Managed {transfusions} blood product transfusions per shift acr, achieving {reaction}% transfusion reaction identification and response rate and .

**Variables:**
  - `{transfusions}`: 5 to 20, step 5 (integer)
  - `{products}`: 4 to 6, step 1 (integer)
  - `{reaction}`: 100 to 100, step 0 (percentage)
  - `{protocol}`: 98 to 100, step 1 (percentage)

### HLTH-0141
**Role:** health-admin | **Theme:** value-based-care | **Seniority:** senior | **Verb Context:** operations
**Keywords:** value-based care, bundled payments, BPCI, episode of care, cost quality, CMS innovation

**Scope:** value-based care program across {bundles} CMS bundled payment episodes representing ${revenue}M in total episode spend per year for a {bed}-bed health system
**Result:** achieving ${savings}M in shared savings and maintaining {quality}% of quality threshold requirements for {consecutive} consecutive performance years

**Variations:**
- **A (Standard):** Managed value-based care program across {bundles} cms bundled payment epi, achieving ${savings}M in shared savings and maintaining {quality}% of quality threshold requirements for {consecutive} consecutive performance years.
- **B (Result-first):** Achieved ${savings}M in shared savings and Maintained {quality}% of quality threshold re by managing value-based care program across {bundles} cms bundled paymen.
- **C (Impact-led):** Achieved ${savings}M in shared savings and Maintained {quality}% of quality threshold re; managed value-based care program across {bundles} cms bundled payment epi.
- **D (Concise):** Managed value-based care program across {bundles} cms bundled p, achieving ${savings}m in shared savings and maintaining {quality}% of quality th.

**Variables:**
  - `{bundles}`: 3 to 10, step 1 (integer)
  - `{revenue}`: 10 to 100, step 10 (currency)
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{savings}`: 1 to 15, step 1 (currency)
  - `{quality}`: 80 to 100, step 5 (percentage)
  - `{consecutive}`: 2 to 5, step 1 (integer)

### HLTH-0142
**Role:** health-admin | **Theme:** data-analytics-admin | **Seniority:** senior | **Verb Context:** systems
**Keywords:** healthcare analytics, BI, Tableau, SQL, dashboarding, operational reporting, data-driven decision making

**Scope:** enterprise analytics infrastructure for a {bed}-bed health system, building {dashboards} operational dashboards and serving {users}K data users across {departments} departments
**Result:** increasing data-driven decision adoption from {before}% to {after}% of operational meetings and reducing ad-hoc report request backlog from {req_before} to {req_after} days

**Variations:**
- **A (Standard):** Managed enterprise analytics infrastructure for a {bed}-bed health system, increasing data-driven decision adoption from {before}% to {after}% of operational meetings and reducing ad-hoc report request backlog from {req_before} to {req_after} days.
- **B (Result-first):** increasing data-driven decision adoption from {before}% to {after}% of operational meeting by managing enterprise analytics infrastructure for a {bed}-bed health s.
- **C (Impact-led):** increasing data-driven decision adoption from {before}% to {after}% of operational meeting; managed enterprise analytics infrastructure for a {bed}-bed health system.
- **D (Concise):** Managed enterprise analytics infrastructure for a {bed}-bed hea, increasing data-driven decision adoption from {before}% to {after}% of operation.

**Variables:**
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{dashboards}`: 10 to 100, step 10 (integer)
  - `{users}`: 1 to 20, step 1 (integer)
  - `{departments}`: 10 to 50, step 5 (integer)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 70 to 92, step 5 (percentage)
  - `{req_before}`: 10 to 20, step 2 (integer)
  - `{req_after}`: 1 to 4, step 1 (integer)

### HLTH-0143
**Role:** health-admin | **Theme:** clinical-documentation-improvement | **Seniority:** mid | **Verb Context:** operations
**Keywords:** CDI, clinical documentation improvement, query rate, CC/MCC capture, DRG optimization, HCC

**Scope:** clinical documentation improvement program reviewing {records}K records per month with {staff} CDI specialists across {service_lines} inpatient service lines
**Result:** improving CC/MCC capture rate from {before}% to {after}% and contributing to ${impact}M increase in appropriate case mix index-driven revenue

**Variations:**
- **A (Standard):** Managed clinical documentation improvement program reviewing {records}k r, improving CC/MCC capture rate from {before}% to {after}% and contributing to ${impact}M increase in appropriate case mix index-driven revenue.
- **B (Result-first):** Improved CC/MCC capture rate from {before}% to {after}% and Contributed to ${impact}M in by managing clinical documentation improvement program reviewing {record.
- **C (Impact-led):** Improved CC/MCC capture rate from {before}% to {after}% and Contributed to ${impact}M in; managed clinical documentation improvement program reviewing {records}k r.
- **D (Concise):** Managed clinical documentation improvement program reviewing {r, improving cc/mcc capture rate from {before}% to {after}% and contributing to ${i.

**Variables:**
  - `{records}`: 1 to 20, step 1 (integer)
  - `{staff}`: 3 to 20, step 3 (integer)
  - `{service_lines}`: 3 to 10, step 1 (integer)
  - `{before}`: 50 to 65, step 5 (percentage)
  - `{after}`: 72 to 88, step 5 (percentage)
  - `{impact}`: 1 to 20, step 1 (currency)

### HLTH-0144
**Role:** health-admin | **Theme:** care-management-director | **Seniority:** senior | **Verb Context:** people
**Keywords:** care management, utilization management, case management, discharge planning, care transitions, population health

**Scope:** care management department of {staff} RN case managers and social workers for a {bed}-bed hospital managing {cases}K cases annually
**Result:** reducing average LOS from {los_before} to {los_after} days and generating ${savings}M in case management-attributable cost savings annually

**Variations:**
- **A (Standard):** Managed care management department of {staff} rn case managers and social, reducing average LOS from {los_before} to {los_after} days and generating ${savings}M in case management-attributable cost savings annually.
- **B (Result-first):** Reduced average LOS from {los_before} to {los_after} days and Generated ${savings}M in c by managing care management department of {staff} rn case managers and s.
- **C (Impact-led):** Reduced average LOS from {los_before} to {los_after} days and Generated ${savings}M in c; managed care management department of {staff} rn case managers and social.
- **D (Concise):** Managed care management department of {staff} rn case managers , reducing average los from {los_before} to {los_after} days and generating ${savi.

**Variables:**
  - `{staff}`: 10 to 50, step 5 (integer)
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{cases}`: 5 to 50, step 5 (integer)
  - `{los_before}`: 4 to 7, step 1 (integer)
  - `{los_after}`: 2.5 to 4, step 0.5 (integer)
  - `{savings}`: 1 to 20, step 1 (currency)

### HLTH-0145
**Role:** health-admin | **Theme:** physician-compensation | **Seniority:** senior | **Verb Context:** operations
**Keywords:** physician compensation, wRVU, productivity-based pay, MGMA benchmarks, compensation modeling, physician finance

**Scope:** physician compensation program for {physicians} employed physicians across {specialties} specialties, designing wRVU-based plans benchmarked to {percentile}th MGMA percentile
**Result:** achieving {productivity}% of physicians meeting productivity threshold and maintaining physician compensation cost at {cost}% of net professional revenue

**Variations:**
- **A (Standard):** Managed physician compensation program for {physicians} employed physicia, achieving {productivity}% of physicians meeting productivity threshold and maintaining physician compensation cost at {cost}% of net professional revenue.
- **B (Result-first):** Achieved {productivity}% of physicians meeting productivity threshold and Maintained phy by managing physician compensation program for {physicians} employed phy.
- **C (Impact-led):** Achieved {productivity}% of physicians meeting productivity threshold and Maintained phy; managed physician compensation program for {physicians} employed physicia.
- **D (Concise):** Managed physician compensation program for {physicians} employe, achieving {productivity}% of physicians meeting productivity threshold and maint.

**Variables:**
  - `{physicians}`: 50 to 500, step 50 (integer)
  - `{specialties}`: 5 to 20, step 5 (integer)
  - `{percentile}`: 50 to 75, step 5 (integer)
  - `{productivity}`: 75 to 95, step 5 (percentage)
  - `{cost}`: 40 to 60, step 5 (percentage)

### HLTH-0146
**Role:** registered-nurse | **Theme:** robotic-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** robotic surgery, da Vinci, robotic nursing, surgical technology, minimally invasive, robotic scrub tech

**Scope:** robotic surgical nursing for {cases} da Vinci robotic cases per shift across {specialties} surgical specialties including urology, gynecology, and colorectal surgery
**Result:** achieving {dock_time}% robot docking under {minutes} minutes and maintaining {complication}% robotic surgical complication rate below benchmark

**Variations:**
- **A (Standard):** Managed robotic surgical nursing for {cases} da vinci robotic cases per s, achieving {dock_time}% robot docking under {minutes} minutes and maintaining {complication}% robotic surgical complication rate below benchmark.
- **B (Result-first):** Achieved {dock_time}% robot docking under {minutes} minutes and Maintained {complication by managing robotic surgical nursing for {cases} da vinci robotic cases .
- **C (Impact-led):** Achieved {dock_time}% robot docking under {minutes} minutes and Maintained {complication; managed robotic surgical nursing for {cases} da vinci robotic cases per s.
- **D (Concise):** Managed robotic surgical nursing for {cases} da vinci robotic c, achieving {dock_time}% robot docking under {minutes} minutes and maintaining {co.

**Variables:**
  - `{cases}`: 3 to 8, step 1 (integer)
  - `{specialties}`: 3 to 6, step 1 (integer)
  - `{dock_time}`: 92 to 100, step 2 (percentage)
  - `{minutes}`: 10 to 15, step 5 (integer)
  - `{complication}`: 2 to 8, step 1 (percentage)

### HLTH-0147
**Role:** registered-nurse | **Theme:** clinical-research-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** clinical research nursing, research coordinator, IRB, informed consent, protocol compliance, investigational drug

**Scope:** clinical trial management for {trials} active studies across {therapeutic_areas} therapeutic areas, enrolling {participants} participants and conducting {visits} study visits per month
**Result:** achieving {enrollment}% enrollment target within planned window and {compliance}% protocol compliance rate across all monitoring visits

**Variations:**
- **A (Standard):** Managed clinical trial management for {trials} active studies across {the, achieving {enrollment}% enrollment target within planned window and {compliance}% protocol compliance rate across all monitoring visits.
- **B (Result-first):** Achieved {enrollment}% enrollment target within planned window and {compliance}% protocol by managing clinical trial management for {trials} active studies across.
- **C (Impact-led):** Achieved {enrollment}% enrollment target within planned window and {compliance}% protocol; managed clinical trial management for {trials} active studies across {the.
- **D (Concise):** Managed clinical trial management for {trials} active studies a, achieving {enrollment}% enrollment target within planned window and {compliance}.

**Variables:**
  - `{trials}`: 3 to 10, step 1 (integer)
  - `{therapeutic_areas}`: 2 to 6, step 1 (integer)
  - `{participants}`: 20 to 200, step 20 (integer)
  - `{visits}`: 20 to 100, step 10 (integer)
  - `{enrollment}`: 90 to 110, step 5 (percentage)
  - `{compliance}`: 97 to 100, step 1 (percentage)

### HLTH-0148
**Role:** registered-nurse | **Theme:** sexual-assault | **Seniority:** senior | **Verb Context:** people
**Keywords:** SANE nurse, forensic nursing, sexual assault, trauma-informed care, evidence collection, victim advocacy

**Scope:** sexual assault nurse examiner services for {exams} forensic exams per month, collaborating with {advocates} victim advocates and {agencies} law enforcement agencies
**Result:** achieving {evidence}% admissible evidence collection rate and {follow_up}% patient connection to ongoing support services

**Variations:**
- **A (Standard):** Managed sexual assault nurse examiner services for {exams} forensic exams, achieving {evidence}% admissible evidence collection rate and {follow_up}% patient connection to ongoing support services.
- **B (Result-first):** Achieved {evidence}% admissible evidence collection rate and {follow_up}% patient connect by managing sexual assault nurse examiner services for {exams} forensic .
- **C (Impact-led):** Achieved {evidence}% admissible evidence collection rate and {follow_up}% patient connect; managed sexual assault nurse examiner services for {exams} forensic exams.
- **D (Concise):** Managed sexual assault nurse examiner services for {exams} fore, achieving {evidence}% admissible evidence collection rate and {follow_up}% patie.

**Variables:**
  - `{exams}`: 10 to 40, step 5 (integer)
  - `{advocates}`: 3 to 10, step 1 (integer)
  - `{agencies}`: 2 to 5, step 1 (integer)
  - `{evidence}`: 90 to 99, step 2 (percentage)
  - `{follow_up}`: 75 to 95, step 5 (percentage)

### HLTH-0149
**Role:** registered-nurse | **Theme:** solid-organ-transplant-coord | **Seniority:** senior | **Verb Context:** people
**Keywords:** transplant coordinator, UNOS, organ procurement, donor coordination, deceased donor, transplant logistics

**Scope:** solid organ transplant coordination for a {bed}-bed transplant center managing {transplants} transplants per year across {organs} organ types and {waitlist} active waitlist patients
**Result:** achieving {offer_acceptance}% organ offer acceptance rate and reducing cold ischemia time from {before} to {after} hours for kidney transplants

**Variations:**
- **A (Standard):** Managed solid organ transplant coordination for a {bed}-bed transplant ce, achieving {offer_acceptance}% organ offer acceptance rate and reducing cold ischemia time from {before} to {after} hours for kidney transplants.
- **B (Result-first):** Achieved {offer_acceptance}% organ offer acceptance rate and Reduced cold ischemia time  by managing solid organ transplant coordination for a {bed}-bed transpla.
- **C (Impact-led):** Achieved {offer_acceptance}% organ offer acceptance rate and Reduced cold ischemia time ; managed solid organ transplant coordination for a {bed}-bed transplant ce.
- **D (Concise):** Managed solid organ transplant coordination for a {bed}-bed tra, achieving {offer_acceptance}% organ offer acceptance rate and reducing cold isch.

**Variables:**
  - `{bed}`: 200 to 500, step 50 (integer)
  - `{transplants}`: 30 to 200, step 10 (integer)
  - `{organs}`: 2 to 5, step 1 (integer)
  - `{waitlist}`: 50 to 500, step 50 (integer)
  - `{offer_acceptance}`: 85 to 99, step 2 (percentage)
  - `{before}`: 18 to 30, step 3 (integer)
  - `{after}`: 10 to 16, step 2 (integer)

### HLTH-0150
**Role:** registered-nurse | **Theme:** stroke-rehab | **Seniority:** mid | **Verb Context:** people
**Keywords:** stroke rehab nursing, stroke rehabilitation, post-stroke care, dysphagia, functional recovery, FIM

**Scope:** stroke rehabilitation nursing for {patients} patients per shift on a {bed}-bed stroke rehab unit, supporting {therapies} therapy disciplines and monitoring for neurological deterioration
**Result:** achieving {fim_gain}% average FIM gain per stroke patient and {discharge_home}% discharge-to-home rate

**Variations:**
- **A (Standard):** Managed stroke rehabilitation nursing for {patients} patients per shift o, achieving {fim_gain}% average FIM gain per stroke patient and {discharge_home}% discharge-to-home rate.
- **B (Result-first):** Achieved {fim_gain}% average FIM gain per stroke patient and {discharge_home}% discharge- by managing stroke rehabilitation nursing for {patients} patients per sh.
- **C (Impact-led):** Achieved {fim_gain}% average FIM gain per stroke patient and {discharge_home}% discharge-; managed stroke rehabilitation nursing for {patients} patients per shift o.
- **D (Concise):** Managed stroke rehabilitation nursing for {patients} patients p, achieving {fim_gain}% average fim gain per stroke patient and {discharge_home}% .

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{therapies}`: 3 to 5, step 1 (integer)
  - `{fim_gain}`: 55 to 82, step 5 (percentage)
  - `{discharge_home}`: 60 to 88, step 5 (percentage)

### HLTH-0151
**Role:** doctor | **Theme:** psychiatry-consult | **Seniority:** senior | **Verb Context:** people
**Keywords:** consultation-liaison psychiatry, CL psychiatry, inpatient psychiatric consult, capacity assessment, suicide risk

**Scope:** consultation-liaison psychiatry consults for {consults} inpatient requests per month across {services} medical and surgical services at a {bed}-bed hospital
**Result:** completing {response}% of consults within {hours} hours of request and reducing psychiatric hold duration from {before} to {after} days

**Variations:**
- **A (Standard):** Managed consultation-liaison psychiatry consults for {consults} inpatient, completing {response}% of consults within {hours} hours of request and reducing psychiatric hold duration from {before} to {after} days.
- **B (Result-first):** completing {response}% of consults within {hours} hours of request and Reduced psychiatri by managing consultation-liaison psychiatry consults for {consults} inpa.
- **C (Impact-led):** completing {response}% of consults within {hours} hours of request and Reduced psychiatri; managed consultation-liaison psychiatry consults for {consults} inpatient.
- **D (Concise):** Managed consultation-liaison psychiatry consults for {consults}, completing {response}% of consults within {hours} hours of request and reducing .

**Variables:**
  - `{consults}`: 20 to 80, step 10 (integer)
  - `{services}`: 5 to 15, step 5 (integer)
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{response}`: 95 to 100, step 1 (percentage)
  - `{hours}`: 12 to 24, step 6 (integer)
  - `{before}`: 5 to 10, step 1 (integer)
  - `{after}`: 2 to 4, step 1 (integer)

### HLTH-0152
**Role:** doctor | **Theme:** geriatrics | **Seniority:** senior | **Verb Context:** people
**Keywords:** geriatrics, older adults, comprehensive geriatric assessment, fall prevention, dementia, polypharmacy management

**Scope:** geriatric consultations and panel management for {patients} patients per week including {cgas} comprehensive geriatric assessments and medication reviews for {poly} polypharmacy patients per month
**Result:** reducing inappropriate medication use by {meds}% among patients and contributing to {fall}% fall-with-injury rate reduction across the service

**Variations:**
- **A (Standard):** Managed geriatric consultations and panel management for {patients} patie, reducing inappropriate medication use by {meds}% among patients and contributing to {fall}% fall-with-injury rate reduction across the service.
- **B (Result-first):** Reduced inappropriate medication use by {meds}% among patients and Contributed to {fall} by managing geriatric consultations and panel management for {patients} .
- **C (Impact-led):** Reduced inappropriate medication use by {meds}% among patients and Contributed to {fall}; managed geriatric consultations and panel management for {patients} patie.
- **D (Concise):** Managed geriatric consultations and panel management for {patie, reducing inappropriate medication use by {meds}% among patients and contributing.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{cgas}`: 10 to 30, step 5 (integer)
  - `{poly}`: 20 to 60, step 10 (integer)
  - `{meds}`: 20 to 50, step 5 (percentage)
  - `{fall}`: 25 to 60, step 5 (percentage)

### HLTH-0153
**Role:** doctor | **Theme:** palliative-medicine | **Seniority:** senior | **Verb Context:** people
**Keywords:** palliative medicine, palliative care consult, symptom management, goals of care, prognosis, interdisciplinary

**Scope:** inpatient palliative care consult service for {consults} consultations per month across {services} service lines at a {bed}-bed hospital, facilitating {family_meetings} family meetings
**Result:** achieving {acp}% advance directive completion rate among consulted patients and reducing ICU days in the last 30 days of life by {icu_days}%

**Variations:**
- **A (Standard):** Managed inpatient palliative care consult service for {consults} consulta, achieving {acp}% advance directive completion rate among consulted patients and reducing ICU days in the last 30 days of life by {icu_days}%.
- **B (Result-first):** Achieved {acp}% advance directive completion rate among consulted patients and Reduced I by managing inpatient palliative care consult service for {consults} con.
- **C (Impact-led):** Achieved {acp}% advance directive completion rate among consulted patients and Reduced I; managed inpatient palliative care consult service for {consults} consulta.
- **D (Concise):** Managed inpatient palliative care consult service for {consults, achieving {acp}% advance directive completion rate among consulted patients and .

**Variables:**
  - `{consults}`: 30 to 100, step 10 (integer)
  - `{services}`: 5 to 15, step 5 (integer)
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{family_meetings}`: 20 to 80, step 10 (integer)
  - `{acp}`: 55 to 82, step 5 (percentage)
  - `{icu_days}`: 20 to 50, step 5 (percentage)

### HLTH-0154
**Role:** doctor | **Theme:** anesthesiology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** anesthesiology, general anesthesia, regional anesthesia, nerve block, ERAS, perioperative medicine

**Scope:** anesthesia for {cases} surgical cases per day across {specialties} surgical specialties using {regional}% regional anesthesia techniques within ERAS protocols
**Result:** achieving {eras}% ERAS protocol adherence and maintaining {mortality}% 30-day perioperative mortality rate below national benchmark

**Variations:**
- **A (Standard):** Managed anesthesia for {cases} surgical cases per day across {specialties, achieving {eras}% ERAS protocol adherence and maintaining {mortality}% 30-day perioperative mortality rate below national benchmark.
- **B (Result-first):** Achieved {eras}% ERAS protocol adherence and Maintained {mortality}% 30-day perioperativ by managing anesthesia for {cases} surgical cases per day across {specia.
- **C (Impact-led):** Achieved {eras}% ERAS protocol adherence and Maintained {mortality}% 30-day perioperativ; managed anesthesia for {cases} surgical cases per day across {specialties.
- **D (Concise):** Managed anesthesia for {cases} surgical cases per day across {s, achieving {eras}% eras protocol adherence and maintaining {mortality}% 30-day pe.

**Variables:**
  - `{cases}`: 8 to 16, step 2 (integer)
  - `{specialties}`: 3 to 8, step 1 (integer)
  - `{regional}`: 20 to 60, step 5 (percentage)
  - `{eras}`: 85 to 99, step 5 (percentage)
  - `{mortality}`: 0.1 to 0.5, step 0.1 (percentage)

### HLTH-0155
**Role:** doctor | **Theme:** radiology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** radiology, diagnostic radiology, report turnaround, MRI, CT, radiologist, image interpretation

**Scope:** diagnostic radiology reads for {reads} imaging studies per day across {modalities} modalities including CT, MRI, X-ray, and ultrasound
**Result:** achieving {tat}% of reports delivered within 24-hour turnaround and maintaining {accuracy}% radiology report accuracy rate

**Variations:**
- **A (Standard):** Managed diagnostic radiology reads for {reads} imaging studies per day ac, achieving {tat}% of reports delivered within 24-hour turnaround and maintaining {accuracy}% radiology report accuracy rate.
- **B (Result-first):** Achieved {tat}% of reports delivered within 24-hour turnaround and Maintained {accuracy} by managing diagnostic radiology reads for {reads} imaging studies per d.
- **C (Impact-led):** Achieved {tat}% of reports delivered within 24-hour turnaround and Maintained {accuracy}; managed diagnostic radiology reads for {reads} imaging studies per day ac.
- **D (Concise):** Managed diagnostic radiology reads for {reads} imaging studies , achieving {tat}% of reports delivered within 24-hour turnaround and maintaining .

**Variables:**
  - `{reads}`: 50 to 200, step 25 (integer)
  - `{modalities}`: 4 to 6, step 1 (integer)
  - `{tat}`: 95 to 100, step 1 (percentage)
  - `{accuracy}`: 98 to 100, step 0.5 (percentage)

### HLTH-0156
**Role:** doctor | **Theme:** rheumatology | **Seniority:** mid | **Verb Context:** people
**Keywords:** rheumatology, autoimmune, RA, SLE, biologic therapy, DMARDs, joint disease

**Scope:** rheumatology panel of {patients} patients per week managing {conditions} autoimmune conditions including RA, SLE, and vasculitis with {biologics} patients on biologic therapy
**Result:** achieving {remission}% clinical remission rate for RA patients at 12 months and {safety}% biologic safety monitoring completion rate

**Variations:**
- **A (Standard):** Managed rheumatology panel of {patients} patients per week managing {cond, achieving {remission}% clinical remission rate for RA patients at 12 months and {safety}% biologic safety monitoring completion rate.
- **B (Result-first):** Achieved {remission}% clinical remission rate for RA patients at 12 months and {safety}%  by managing rheumatology panel of {patients} patients per week managing .
- **C (Impact-led):** Achieved {remission}% clinical remission rate for RA patients at 12 months and {safety}% ; managed rheumatology panel of {patients} patients per week managing {cond.
- **D (Concise):** Managed rheumatology panel of {patients} patients per week mana, achieving {remission}% clinical remission rate for ra patients at 12 months and .

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{conditions}`: 5 to 10, step 1 (integer)
  - `{biologics}`: 20 to 80, step 10 (integer)
  - `{remission}`: 50 to 75, step 5 (percentage)
  - `{safety}`: 92 to 100, step 2 (percentage)

### HLTH-0157
**Role:** doctor | **Theme:** hematology | **Seniority:** mid | **Verb Context:** people
**Keywords:** hematology, blood disorders, anticoagulation, hematologic malignancy, transfusion, coagulopathy

**Scope:** hematology panel of {patients} patients per week managing {conditions} hematologic conditions including malignancies and coagulation disorders, with {warfarin} patients on anticoagulation monitoring
**Result:** achieving {tttr}% of anticoagulated patients in therapeutic range and {response}% overall treatment response rate for hematologic malignancy patients at first follow-up

**Variations:**
- **A (Standard):** Managed hematology panel of {patients} patients per week managing {condit, achieving {tttr}% of anticoagulated patients in therapeutic range and {response}% overall treatment response rate for hematologic malignancy patients at first follow-up.
- **B (Result-first):** Achieved {tttr}% of anticoagulated patients in therapeutic range and {response}% overall  by managing hematology panel of {patients} patients per week managing {c.
- **C (Impact-led):** Achieved {tttr}% of anticoagulated patients in therapeutic range and {response}% overall ; managed hematology panel of {patients} patients per week managing {condit.
- **D (Concise):** Managed hematology panel of {patients} patients per week managi, achieving {tttr}% of anticoagulated patients in therapeutic range and {response}.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{conditions}`: 5 to 12, step 1 (integer)
  - `{warfarin}`: 20 to 60, step 10 (integer)
  - `{tttr}`: 65 to 85, step 5 (percentage)
  - `{response}`: 60 to 85, step 5 (percentage)

### HLTH-0158
**Role:** doctor | **Theme:** urology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** urology, cystoscopy, robotic prostatectomy, BPH, kidney stones, urologic surgery

**Scope:** urology panel of {patients} patients per week including {surgeries} urologic surgeries and {cysto} office-based cystoscopies per month
**Result:** achieving {readmit}% 30-day surgical readmission rate below national benchmark and {satisfaction}% patient-reported surgical satisfaction

**Variations:**
- **A (Standard):** Managed urology panel of {patients} patients per week including {surgerie, achieving {readmit}% 30-day surgical readmission rate below national benchmark and {satisfaction}% patient-reported surgical satisfaction.
- **B (Result-first):** Achieved {readmit}% 30-day surgical readmission rate below national benchmark and {satisf by managing urology panel of {patients} patients per week including {sur.
- **C (Impact-led):** Achieved {readmit}% 30-day surgical readmission rate below national benchmark and {satisf; managed urology panel of {patients} patients per week including {surgerie.
- **D (Concise):** Managed urology panel of {patients} patients per week including, achieving {readmit}% 30-day surgical readmission rate below national benchmark a.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{surgeries}`: 10 to 30, step 5 (integer)
  - `{cysto}`: 20 to 60, step 10 (integer)
  - `{readmit}`: 3 to 8, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0159
**Role:** doctor | **Theme:** ophthalmology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** ophthalmology, cataract surgery, retinal disease, AMD, glaucoma, intravitreal injections

**Scope:** ophthalmology practice with {patients} patients per day including {surgeries} cataract surgeries and {injections} intravitreal injections per month
**Result:** achieving {vision}% of cataract surgery patients with 20/40 or better uncorrected visual acuity at 1 month and {complication}% surgical complication rate

**Variations:**
- **A (Standard):** Managed ophthalmology practice with {patients} patients per day including, achieving {vision}% of cataract surgery patients with 20/40 or better uncorrected visual acuity at 1 month and {complication}% surgical complication rate.
- **B (Result-first):** Achieved {vision}% of cataract surgery patients with 20/40 or better uncorrected visual a by managing ophthalmology practice with {patients} patients per day incl.
- **C (Impact-led):** Achieved {vision}% of cataract surgery patients with 20/40 or better uncorrected visual a; managed ophthalmology practice with {patients} patients per day including.
- **D (Concise):** Managed ophthalmology practice with {patients} patients per day, achieving {vision}% of cataract surgery patients with 20/40 or better uncorrecte.

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{surgeries}`: 20 to 60, step 10 (integer)
  - `{injections}`: 20 to 60, step 10 (integer)
  - `{vision}`: 90 to 99, step 2 (percentage)
  - `{complication}`: 1 to 4, step 0.5 (percentage)

### HLTH-0160
**Role:** doctor | **Theme:** ENT | **Seniority:** mid | **Verb Context:** operations
**Keywords:** otolaryngology, ENT, tonsillectomy, sinus surgery, hearing loss, cochlear implant, head and neck

**Scope:** ENT panel of {patients} patients per week including {surgeries} ENT surgeries and {audiologies} audiology consultations per month across {conditions} ear, nose, and throat conditions
**Result:** achieving {readmit}% 30-day surgical readmission rate below ENT benchmark and {satisfaction}% patient satisfaction score

**Variations:**
- **A (Standard):** Managed ent panel of {patients} patients per week including {surgeries} e, achieving {readmit}% 30-day surgical readmission rate below ENT benchmark and {satisfaction}% patient satisfaction score.
- **B (Result-first):** Achieved {readmit}% 30-day surgical readmission rate below ENT benchmark and {satisfactio by managing ent panel of {patients} patients per week including {surgeri.
- **C (Impact-led):** Achieved {readmit}% 30-day surgical readmission rate below ENT benchmark and {satisfactio; managed ent panel of {patients} patients per week including {surgeries} e.
- **D (Concise):** Managed ent panel of {patients} patients per week including {su, achieving {readmit}% 30-day surgical readmission rate below ent benchmark and {s.

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{surgeries}`: 15 to 40, step 5 (integer)
  - `{audiologies}`: 10 to 30, step 5 (integer)
  - `{conditions}`: 8 to 20, step 4 (integer)
  - `{readmit}`: 2 to 6, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0161
**Role:** registered-nurse | **Theme:** allergy-immunology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** allergy, immunotherapy, allergy shots, anaphylaxis, allergen testing, asthma management

**Scope:** allergy-immunology nursing for {patients} allergen immunotherapy injections per day, monitoring patients for {minutes} minutes post-injection across {allergens} allergen extract categories
**Result:** achieving {zero_anaphylaxis}% anaphylaxis-free injection rate and {reaction}% appropriate epinephrine administration rate for reactions requiring treatment

**Variations:**
- **A (Standard):** Managed allergy-immunology nursing for {patients} allergen immunotherapy , achieving {zero_anaphylaxis}% anaphylaxis-free injection rate and {reaction}% appropriate epinephrine administration rate for reactions requiring treatment.
- **B (Result-first):** Achieved {zero_anaphylaxis}% anaphylaxis-free injection rate and {reaction}% appropriate  by managing allergy-immunology nursing for {patients} allergen immunothe.
- **C (Impact-led):** Achieved {zero_anaphylaxis}% anaphylaxis-free injection rate and {reaction}% appropriate ; managed allergy-immunology nursing for {patients} allergen immunotherapy .
- **D (Concise):** Managed allergy-immunology nursing for {patients} allergen immu, achieving {zero_anaphylaxis}% anaphylaxis-free injection rate and {reaction}% ap.

**Variables:**
  - `{patients}`: 30 to 80, step 10 (integer)
  - `{minutes}`: 20 to 30, step 5 (integer)
  - `{allergens}`: 5 to 15, step 5 (integer)
  - `{zero_anaphylaxis}`: 99 to 100, step 0.5 (percentage)
  - `{reaction}`: 100 to 100, step 0 (percentage)

### HLTH-0162
**Role:** registered-nurse | **Theme:** endoscopy-leader | **Seniority:** senior | **Verb Context:** operations
**Keywords:** endoscopy unit, GI lab leadership, endoscopy throughput, scope reprocessing, quality indicators, ADR tracking

**Scope:** endoscopy unit operations for a {room}-room GI lab performing {cases}K procedures annually across {providers} gastroenterologists and {staff} endoscopy nurses
**Result:** improving room turnover time from {before} to {after} minutes and increasing adenoma detection rate from {adr_before}% to {adr_after}%

**Variations:**
- **A (Standard):** Managed endoscopy unit operations for a {room}-room gi lab performing {ca, improving room turnover time from {before} to {after} minutes and increasing adenoma detection rate from {adr_before}% to {adr_after}%.
- **B (Result-first):** Improved room turnover time from {before} to {after} minutes and increasing adenoma detec by managing endoscopy unit operations for a {room}-room gi lab performin.
- **C (Impact-led):** Improved room turnover time from {before} to {after} minutes and increasing adenoma detec; managed endoscopy unit operations for a {room}-room gi lab performing {ca.
- **D (Concise):** Managed endoscopy unit operations for a {room}-room gi lab perf, improving room turnover time from {before} to {after} minutes and increasing ade.

**Variables:**
  - `{room}`: 4 to 12, step 2 (integer)
  - `{cases}`: 3 to 20, step 1 (integer)
  - `{providers}`: 3 to 10, step 1 (integer)
  - `{staff}`: 5 to 20, step 5 (integer)
  - `{before}`: 15 to 30, step 5 (integer)
  - `{after}`: 8 to 14, step 2 (integer)
  - `{adr_before}`: 25 to 35, step 5 (percentage)
  - `{adr_after}`: 35 to 50, step 5 (percentage)

### HLTH-0163
**Role:** dietitian | **Theme:** tube-feeding | **Seniority:** mid | **Verb Context:** operations
**Keywords:** enteral nutrition, tube feeding, formula selection, feeding tube, TPN, nutrition support team

**Scope:** nutrition support services for {patients} enterally and parenterally fed patients per week, developing {formulas} individualized tube feeding formulas and monitoring {labs}K nutrition labs per month
**Result:** achieving {tolerance}% enteral feeding tolerance rate and reducing parenteral nutrition days by {pn}% through successful enteral feeding progression

**Variations:**
- **A (Standard):** Managed nutrition support services for {patients} enterally and parentera, achieving {tolerance}% enteral feeding tolerance rate and reducing parenteral nutrition days by {pn}% through successful enteral feeding progression.
- **B (Result-first):** Achieved {tolerance}% enteral feeding tolerance rate and Reduced parenteral nutrition da by managing nutrition support services for {patients} enterally and pare.
- **C (Impact-led):** Achieved {tolerance}% enteral feeding tolerance rate and Reduced parenteral nutrition da; managed nutrition support services for {patients} enterally and parentera.
- **D (Concise):** Managed nutrition support services for {patients} enterally and, achieving {tolerance}% enteral feeding tolerance rate and reducing parenteral nu.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{formulas}`: 10 to 30, step 5 (integer)
  - `{labs}`: 1 to 10, step 1 (integer)
  - `{tolerance}`: 88 to 99, step 2 (percentage)
  - `{pn}`: 20 to 50, step 5 (percentage)

### HLTH-0164
**Role:** dietitian | **Theme:** cardiac-nutrition | **Seniority:** mid | **Verb Context:** people
**Keywords:** cardiac diet, heart failure, DASH diet, lipid management, sodium restriction, cardiac rehabilitation

**Scope:** cardiac nutrition counseling for {patients} patients per week in cardiac rehabilitation and outpatient heart failure clinics, delivering {sessions} individualized counseling sessions per patient course
**Result:** improving average DASH diet adherence score from {before} to {after}/10 at 3 months and reducing sodium intake from {na_before}mg to {na_after}mg per day

**Variations:**
- **A (Standard):** Managed cardiac nutrition counseling for {patients} patients per week in , improving average DASH diet adherence score from {before} to {after}/10 at 3 months and reducing sodium intake from {na_before}mg to {na_after}mg per day.
- **B (Result-first):** Improved average DASH diet adherence score from {before} to {after}/10 at 3 months and re by managing cardiac nutrition counseling for {patients} patients per wee.
- **C (Impact-led):** Improved average DASH diet adherence score from {before} to {after}/10 at 3 months and re; managed cardiac nutrition counseling for {patients} patients per week in .
- **D (Concise):** Managed cardiac nutrition counseling for {patients} patients pe, improving average dash diet adherence score from {before} to {after}/10 at 3 mon.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{sessions}`: 4 to 8, step 2 (integer)
  - `{before}`: 4 to 5, step 1 (integer)
  - `{after}`: 7 to 9, step 1 (integer)
  - `{na_before}`: 3000 to 5000, step 500 (integer)
  - `{na_after}`: 1500 to 2500, step 250 (integer)

### HLTH-0165
**Role:** dietitian | **Theme:** sports-nutrition | **Seniority:** mid | **Verb Context:** people
**Keywords:** sports nutrition, athlete nutrition, performance nutrition, fueling, body composition, ergogenic aids

**Scope:** sports nutrition counseling for {athletes} athletes per week across {sports} sports, conducting {body_comp} body composition assessments and {meal_plans} individualized meal planning consultations
**Result:** improving average athlete performance composite score by {performance}% and achieving {weight}% of athletes reaching body composition goal within {months} months

**Variations:**
- **A (Standard):** Managed sports nutrition counseling for {athletes} athletes per week acro, improving average athlete performance composite score by {performance}% and achieving {weight}% of athletes reaching body composition goal within {months} months.
- **B (Result-first):** Improved average athlete performance composite score by {performance}% and Achieved {wei by managing sports nutrition counseling for {athletes} athletes per week.
- **C (Impact-led):** Improved average athlete performance composite score by {performance}% and Achieved {wei; managed sports nutrition counseling for {athletes} athletes per week acro.
- **D (Concise):** Managed sports nutrition counseling for {athletes} athletes per, improving average athlete performance composite score by {performance}% and achi.

**Variables:**
  - `{athletes}`: 20 to 50, step 5 (integer)
  - `{sports}`: 5 to 15, step 5 (integer)
  - `{body_comp}`: 10 to 30, step 5 (integer)
  - `{meal_plans}`: 10 to 30, step 5 (integer)
  - `{performance}`: 5 to 20, step 5 (percentage)
  - `{weight}`: 65 to 90, step 5 (percentage)
  - `{months}`: 3 to 6, step 1 (integer)

### HLTH-0166
**Role:** health-admin | **Theme:** simulation-center | **Seniority:** mid | **Verb Context:** operations
**Keywords:** simulation, simulation center, skills lab, clinical simulation, mannequin training, SimMan

**Scope:** simulation center operations serving {learners}K learners per year across {programs} training programs including nursing orientation, ACLS, and procedural skills
**Result:** improving learner clinical competency scores from {before} to {after}/100 and achieving {satisfaction}% learner satisfaction rating across all programs

**Variations:**
- **A (Standard):** Managed simulation center operations serving {learners}k learners per yea, improving learner clinical competency scores from {before} to {after}/100 and achieving {satisfaction}% learner satisfaction rating across all programs.
- **B (Result-first):** Improved learner clinical competency scores from {before} to {after}/100 and Achieved {s by managing simulation center operations serving {learners}k learners pe.
- **C (Impact-led):** Improved learner clinical competency scores from {before} to {after}/100 and Achieved {s; managed simulation center operations serving {learners}k learners per yea.
- **D (Concise):** Managed simulation center operations serving {learners}k learne, improving learner clinical competency scores from {before} to {after}/100 and ac.

**Variables:**
  - `{learners}`: 1 to 20, step 1 (integer)
  - `{programs}`: 5 to 20, step 5 (integer)
  - `{before}`: 72 to 82, step 2 (integer)
  - `{after}`: 88 to 98, step 2 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0167
**Role:** health-admin | **Theme:** HIPAA-officer | **Seniority:** senior | **Verb Context:** operations
**Keywords:** HIPAA compliance, privacy officer, data breach, PHI, training compliance, privacy program

**Scope:** HIPAA privacy and security compliance program for a {bed}-bed health system with {staff}K workforce members, conducting {training}K training completions and {audits} annual audits
**Result:** achieving {training_rate}% annual HIPAA training completion rate and reducing reportable breaches from {before} to {after} per year

**Variations:**
- **A (Standard):** Managed hipaa privacy and security compliance program for a {bed}-bed hea, achieving {training_rate}% annual HIPAA training completion rate and reducing reportable breaches from {before} to {after} per year.
- **B (Result-first):** Achieved {training_rate}% annual HIPAA training completion rate and Reduced reportable b by managing hipaa privacy and security compliance program for a {bed}-be.
- **C (Impact-led):** Achieved {training_rate}% annual HIPAA training completion rate and Reduced reportable b; managed hipaa privacy and security compliance program for a {bed}-bed hea.
- **D (Concise):** Managed hipaa privacy and security compliance program for a {be, achieving {training_rate}% annual hipaa training completion rate and reducing re.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{staff}`: 1 to 20, step 1 (integer)
  - `{training}`: 1 to 20, step 1 (integer)
  - `{audits}`: 2 to 6, step 1 (integer)
  - `{training_rate}`: 95 to 100, step 1 (percentage)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### HLTH-0168
**Role:** health-admin | **Theme:** emergency-management | **Seniority:** senior | **Verb Context:** operations
**Keywords:** emergency management, disaster preparedness, HICS, mass casualty incident, HVA, after action review

**Scope:** emergency management program for a {bed}-bed health system, coordinating {drills} disaster exercises per year and maintaining {plans} emergency operations plan documents current
**Result:** achieving {accreditation}% OSHA and The Joint Commission emergency preparedness compliance and completing {after_action}% of after-action improvement items within 90 days

**Variations:**
- **A (Standard):** Managed emergency management program for a {bed}-bed health system, coord, achieving {accreditation}% OSHA and The Joint Commission emergency preparedness compliance and completing {after_action}% of after-action improvement items within 90 days.
- **B (Result-first):** Achieved {accreditation}% OSHA and The Joint Commission emergency preparedness compliance by managing emergency management program for a {bed}-bed health system, .
- **C (Impact-led):** Achieved {accreditation}% OSHA and The Joint Commission emergency preparedness compliance; managed emergency management program for a {bed}-bed health system, coord.
- **D (Concise):** Managed emergency management program for a {bed}-bed health sys, achieving {accreditation}% osha and the joint commission emergency preparedness .

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{drills}`: 4 to 12, step 2 (integer)
  - `{plans}`: 5 to 20, step 5 (integer)
  - `{accreditation}`: 95 to 100, step 1 (percentage)
  - `{after_action}`: 90 to 100, step 5 (percentage)

### HLTH-0169
**Role:** health-admin | **Theme:** surgical-services | **Seniority:** senior | **Verb Context:** operations
**Keywords:** surgical services, OR management, OR throughput, first case on-time starts, surgical scheduling, case volume

**Scope:** surgical services operations for a {room}-room OR suite performing {cases}K cases annually across {specialties} surgical specialties with ${or_revenue}M in annual OR revenue
**Result:** improving first-case on-time start rate from {before}% to {after}% and growing surgical case volume by {volume}% year-over-year

**Variations:**
- **A (Standard):** Managed surgical services operations for a {room}-room or suite performin, improving first-case on-time start rate from {before}% to {after}% and growing surgical case volume by {volume}% year-over-year.
- **B (Result-first):** Improved first-case on-time start rate from {before}% to {after}% and growing surgical ca by managing surgical services operations for a {room}-room or suite perf.
- **C (Impact-led):** Improved first-case on-time start rate from {before}% to {after}% and growing surgical ca; managed surgical services operations for a {room}-room or suite performin.
- **D (Concise):** Managed surgical services operations for a {room}-room or suite, improving first-case on-time start rate from {before}% to {after}% and growing s.

**Variables:**
  - `{room}`: 8 to 30, step 2 (integer)
  - `{cases}`: 10 to 50, step 5 (integer)
  - `{specialties}`: 5 to 15, step 5 (integer)
  - `{or_revenue}`: 10 to 200, step 10 (currency)
  - `{before}`: 60 to 75, step 5 (percentage)
  - `{after}`: 85 to 98, step 5 (percentage)
  - `{volume}`: 5 to 20, step 5 (percentage)

### HLTH-0170
**Role:** health-admin | **Theme:** nursing-informatics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** nursing informatics, EHR optimization, nursing workflow, clinical informatics, CNIO, technology adoption

**Scope:** nursing informatics and EHR optimization program for {users}K nursing users across a {bed}-bed health system, leading {projects} workflow redesign projects per year
**Result:** reducing average nursing documentation burden from {before} to {after} minutes per shift and achieving {adoption}% EHR advanced feature adoption within {months} months

**Variations:**
- **A (Standard):** Managed nursing informatics and ehr optimization program for {users}k nur, reducing average nursing documentation burden from {before} to {after} minutes per shift and achieving {adoption}% EHR advanced feature adoption within {months} months.
- **B (Result-first):** Reduced average nursing documentation burden from {before} to {after} minutes per shift a by managing nursing informatics and ehr optimization program for {users}.
- **C (Impact-led):** Reduced average nursing documentation burden from {before} to {after} minutes per shift a; managed nursing informatics and ehr optimization program for {users}k nur.
- **D (Concise):** Managed nursing informatics and ehr optimization program for {u, reducing average nursing documentation burden from {before} to {after} minutes p.

**Variables:**
  - `{users}`: 1 to 20, step 1 (integer)
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{projects}`: 5 to 20, step 5 (integer)
  - `{before}`: 45 to 90, step 5 (integer)
  - `{after}`: 20 to 40, step 5 (integer)
  - `{adoption}`: 60 to 88, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### HLTH-0171
**Role:** registered-nurse | **Theme:** transport-nurse | **Seniority:** mid | **Verb Context:** operations
**Keywords:** interfacility transport, critical care transport, CCT, ground transport, flight nurse, patient transport

**Scope:** interfacility transport nursing for {transports} critically ill patient transports per month via ground and air across {facilities} sending facilities
**Result:** achieving {adverse}% adverse event-free transport rate and completing {ata}% of transports within the requested time window

**Variations:**
- **A (Standard):** Managed interfacility transport nursing for {transports} critically ill p, achieving {adverse}% adverse event-free transport rate and completing {ata}% of transports within the requested time window.
- **B (Result-first):** Achieved {adverse}% adverse event-free transport rate and completing {ata}% of transports by managing interfacility transport nursing for {transports} critically .
- **C (Impact-led):** Achieved {adverse}% adverse event-free transport rate and completing {ata}% of transports; managed interfacility transport nursing for {transports} critically ill p.
- **D (Concise):** Managed interfacility transport nursing for {transports} critic, achieving {adverse}% adverse event-free transport rate and completing {ata}% of .

**Variables:**
  - `{transports}`: 20 to 80, step 10 (integer)
  - `{facilities}`: 5 to 30, step 5 (integer)
  - `{adverse}`: 96 to 100, step 1 (percentage)
  - `{ata}`: 88 to 99, step 2 (percentage)

### HLTH-0172
**Role:** registered-nurse | **Theme:** lactation | **Seniority:** mid | **Verb Context:** people
**Keywords:** lactation, breastfeeding support, IBCLC, latch assessment, breast pump, neonatal nutrition

**Scope:** lactation consultation services for {patients} mothers per week in hospital and outpatient settings, conducting {consults} consultations per week including {nicu} NICU breastfeeding support cases
**Result:** achieving {bf_6wk}% breastfeeding continuation rate at 6 weeks postpartum and {exclusive}% exclusive breastfeeding rate at hospital discharge

**Variations:**
- **A (Standard):** Managed lactation consultation services for {patients} mothers per week i, achieving {bf_6wk}% breastfeeding continuation rate at 6 weeks postpartum and {exclusive}% exclusive breastfeeding rate at hospital discharge.
- **B (Result-first):** Achieved {bf_6wk}% breastfeeding continuation rate at 6 weeks postpartum and {exclusive}% by managing lactation consultation services for {patients} mothers per w.
- **C (Impact-led):** Achieved {bf_6wk}% breastfeeding continuation rate at 6 weeks postpartum and {exclusive}%; managed lactation consultation services for {patients} mothers per week i.
- **D (Concise):** Managed lactation consultation services for {patients} mothers , achieving {bf_6wk}% breastfeeding continuation rate at 6 weeks postpartum and {e.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{consults}`: 15 to 40, step 5 (integer)
  - `{nicu}`: 5 to 15, step 5 (integer)
  - `{bf_6wk}`: 60 to 85, step 5 (percentage)
  - `{exclusive}`: 70 to 92, step 5 (percentage)

### HLTH-0173
**Role:** registered-nurse | **Theme:** cardiac-rehab | **Seniority:** mid | **Verb Context:** people
**Keywords:** cardiac rehabilitation, exercise prescription, cardiac monitoring, secondary prevention, AHA, AACVPR

**Scope:** cardiac rehabilitation services for {patients} patients per week across Phase II and Phase III cardiac rehab, monitoring {parameters} exercise parameters and delivering {education} education sessions per month
**Result:** achieving {completion}% Phase II completion rate and reducing major adverse cardiovascular events among completers by {mace}% at 1 year

**Variations:**
- **A (Standard):** Managed cardiac rehabilitation services for {patients} patients per week , achieving {completion}% Phase II completion rate and reducing major adverse cardiovascular events among completers by {mace}% at 1 year.
- **B (Result-first):** Achieved {completion}% Phase II completion rate and Reduced major adverse cardiovascular by managing cardiac rehabilitation services for {patients} patients per .
- **C (Impact-led):** Achieved {completion}% Phase II completion rate and Reduced major adverse cardiovascular; managed cardiac rehabilitation services for {patients} patients per week .
- **D (Concise):** Managed cardiac rehabilitation services for {patients} patients, achieving {completion}% phase ii completion rate and reducing major adverse card.

**Variables:**
  - `{patients}`: 30 to 80, step 10 (integer)
  - `{parameters}`: 5 to 10, step 1 (integer)
  - `{education}`: 10 to 30, step 5 (integer)
  - `{completion}`: 70 to 92, step 5 (percentage)
  - `{mace}`: 20 to 50, step 5 (percentage)

### HLTH-0174
**Role:** registered-nurse | **Theme:** community-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** community health nursing, public health, population health, immunization clinics, home visits, health education

**Scope:** community nursing services serving {community}K community members per year across {programs} community health programs including immunization clinics and chronic disease outreach
**Result:** achieving {immunization}% immunization completion rate among the target population and reducing preventable ER visits by {er}%

**Variations:**
- **A (Standard):** Managed community nursing services serving {community}k community members, achieving {immunization}% immunization completion rate among the target population and reducing preventable ER visits by {er}%.
- **B (Result-first):** Achieved {immunization}% immunization completion rate among the target population and red by managing community nursing services serving {community}k community me.
- **C (Impact-led):** Achieved {immunization}% immunization completion rate among the target population and red; managed community nursing services serving {community}k community members.
- **D (Concise):** Managed community nursing services serving {community}k communi, achieving {immunization}% immunization completion rate among the target populati.

**Variables:**
  - `{community}`: 1 to 50, step 5 (integer)
  - `{programs}`: 3 to 10, step 1 (integer)
  - `{immunization}`: 85 to 99, step 2 (percentage)
  - `{er}`: 15 to 40, step 5 (percentage)

### HLTH-0175
**Role:** registered-nurse | **Theme:** psychiatric-emergency | **Seniority:** mid | **Verb Context:** people
**Keywords:** psychiatric emergency, PES, psychiatric ED, crisis stabilization, involuntary holds, mental health emergency

**Scope:** psychiatric emergency services for {patients} patients per shift in a PES unit, conducting {assessments} psychiatric assessments and initiating {holds} involuntary holds per month
**Result:** achieving {disposition}% disposition-within-{hours}-hour rate and reducing PES boarding time from {before} to {after} hours

**Variations:**
- **A (Standard):** Managed psychiatric emergency services for {patients} patients per shift , achieving {disposition}% disposition-within-{hours}-hour rate and reducing PES boarding time from {before} to {after} hours.
- **B (Result-first):** Achieved {disposition}% disposition-within-{hours}-hour rate and Reduced PES boarding ti by managing psychiatric emergency services for {patients} patients per s.
- **C (Impact-led):** Achieved {disposition}% disposition-within-{hours}-hour rate and Reduced PES boarding ti; managed psychiatric emergency services for {patients} patients per shift .
- **D (Concise):** Managed psychiatric emergency services for {patients} patients , achieving {disposition}% disposition-within-{hours}-hour rate and reducing pes b.

**Variables:**
  - `{patients}`: 8 to 20, step 4 (integer)
  - `{assessments}`: 8 to 20, step 4 (integer)
  - `{holds}`: 10 to 40, step 5 (integer)
  - `{disposition}`: 80 to 96, step 4 (percentage)
  - `{hours}`: 4 to 8, step 2 (integer)
  - `{before}`: 8 to 16, step 2 (integer)
  - `{after}`: 3 to 6, step 1 (integer)

### HLTH-0176
**Role:** dietitian | **Theme:** clinical-nutrition-manager | **Seniority:** senior | **Verb Context:** people
**Keywords:** clinical nutrition management, nutrition department, dietitian supervision, food service, therapeutic menus, nutrition policy

**Scope:** clinical nutrition department of {staff} registered dietitians and diet technicians at a {bed}-bed hospital, overseeing {menus} therapeutic menu types and ${budget}K annual nutrition budget
**Result:** improving malnutrition screening completion rate from {before}% to {after}% hospital-wide and achieving {satisfaction}% patient meal satisfaction score

**Variations:**
- **A (Standard):** Managed clinical nutrition department of {staff} registered dietitians an, improving malnutrition screening completion rate from {before}% to {after}% hospital-wide and achieving {satisfaction}% patient meal satisfaction score.
- **B (Result-first):** Improved malnutrition screening completion rate from {before}% to {after}% hospital-wide  by managing clinical nutrition department of {staff} registered dietitia.
- **C (Impact-led):** Improved malnutrition screening completion rate from {before}% to {after}% hospital-wide ; managed clinical nutrition department of {staff} registered dietitians an.
- **D (Concise):** Managed clinical nutrition department of {staff} registered die, improving malnutrition screening completion rate from {before}% to {after}% hosp.

**Variables:**
  - `{staff}`: 5 to 25, step 5 (integer)
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{menus}`: 10 to 30, step 5 (integer)
  - `{budget}`: 200 to 2000, step 100 (currency)
  - `{before}`: 60 to 78, step 2 (percentage)
  - `{after}`: 88 to 99, step 2 (percentage)
  - `{satisfaction}`: 85 to 99, step 2 (percentage)

### HLTH-0177
**Role:** registered-nurse | **Theme:** charge-nurse-ED | **Seniority:** senior | **Verb Context:** operations
**Keywords:** charge nurse, ED operations, ED leadership, patient flow, boarding, throughput, emergency department management

**Scope:** ED charge nurse responsibilities for a {volume}K-visit annual ED with {staff} nurses per shift, managing patient flow, boarding, and {divert}K monthly diversion hours
**Result:** reducing ED boarding from {before} to {after} hours per patient and improving door-to-provider time from {dtp_before} to {dtp_after} minutes

**Variations:**
- **A (Standard):** Managed ed charge nurse responsibilities for a {volume}k-visit annual ed , reducing ED boarding from {before} to {after} hours per patient and improving door-to-provider time from {dtp_before} to {dtp_after} minutes.
- **B (Result-first):** Reduced ED boarding from {before} to {after} hours per patient and Improved door-to-prov by managing ed charge nurse responsibilities for a {volume}k-visit annua.
- **C (Impact-led):** Reduced ED boarding from {before} to {after} hours per patient and Improved door-to-prov; managed ed charge nurse responsibilities for a {volume}k-visit annual ed .
- **D (Concise):** Managed ed charge nurse responsibilities for a {volume}k-visit , reducing ed boarding from {before} to {after} hours per patient and improving do.

**Variables:**
  - `{volume}`: 20 to 100, step 10 (integer)
  - `{staff}`: 8 to 20, step 4 (integer)
  - `{divert}`: 1 to 10, step 1 (integer)
  - `{before}`: 5 to 12, step 1 (integer)
  - `{after}`: 2 to 4, step 0.5 (integer)
  - `{dtp_before}`: 20 to 45, step 5 (integer)
  - `{dtp_after}`: 8 to 18, step 2 (integer)

### HLTH-0178
**Role:** registered-nurse | **Theme:** peritoneal-dialysis | **Seniority:** mid | **Verb Context:** operations
**Keywords:** peritoneal dialysis, CAPD, PD catheter, home dialysis, renal nursing, peritonitis prevention

**Scope:** peritoneal dialysis patient support for {patients} patients per week including {training} home PD training episodes and {assessments} clinical assessments across {modalities} PD modalities
**Result:** achieving {peritonitis}% peritonitis-episode-free rate at 12 months and {technique_survival}% PD technique survival at 2 years

**Variations:**
- **A (Standard):** Managed peritoneal dialysis patient support for {patients} patients per w, achieving {peritonitis}% peritonitis-episode-free rate at 12 months and {technique_survival}% PD technique survival at 2 years.
- **B (Result-first):** Achieved {peritonitis}% peritonitis-episode-free rate at 12 months and {technique_surviva by managing peritoneal dialysis patient support for {patients} patients .
- **C (Impact-led):** Achieved {peritonitis}% peritonitis-episode-free rate at 12 months and {technique_surviva; managed peritoneal dialysis patient support for {patients} patients per w.
- **D (Concise):** Managed peritoneal dialysis patient support for {patients} pati, achieving {peritonitis}% peritonitis-episode-free rate at 12 months and {techniq.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{training}`: 5 to 15, step 5 (integer)
  - `{assessments}`: 10 to 30, step 5 (integer)
  - `{modalities}`: 2 to 3, step 1 (integer)
  - `{peritonitis}`: 85 to 98, step 2 (percentage)
  - `{technique_survival}`: 75 to 95, step 5 (percentage)

### HLTH-0179
**Role:** doctor | **Theme:** orthopedic-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** orthopedic surgery, joint replacement, fracture management, sports surgery, arthroplasty, AAOS

**Scope:** orthopedic surgery practice with {patients} clinic patients per week and {surgeries} surgeries per month including joint replacements and fracture repairs across {conditions} diagnoses
**Result:** achieving {readmit}% 30-day surgical readmission rate below national arthroplasty benchmark and {functional}% of patients meeting functional milestones at 3 months

**Variations:**
- **A (Standard):** Managed orthopedic surgery practice with {patients} clinic patients per w, achieving {readmit}% 30-day surgical readmission rate below national arthroplasty benchmark and {functional}% of patients meeting functional milestones at 3 months.
- **B (Result-first):** Achieved {readmit}% 30-day surgical readmission rate below national arthroplasty benchmar by managing orthopedic surgery practice with {patients} clinic patients .
- **C (Impact-led):** Achieved {readmit}% 30-day surgical readmission rate below national arthroplasty benchmar; managed orthopedic surgery practice with {patients} clinic patients per w.
- **D (Concise):** Managed orthopedic surgery practice with {patients} clinic pati, achieving {readmit}% 30-day surgical readmission rate below national arthroplast.

**Variables:**
  - `{patients}`: 30 to 60, step 10 (integer)
  - `{surgeries}`: 15 to 40, step 5 (integer)
  - `{conditions}`: 5 to 15, step 5 (integer)
  - `{readmit}`: 3 to 8, step 1 (percentage)
  - `{functional}`: 80 to 96, step 5 (percentage)

### HLTH-0180
**Role:** doctor | **Theme:** general-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** general surgery, laparoscopic surgery, colorectal, hernia repair, appendectomy, surgical oncology

**Scope:** general surgery practice with {patients} clinic patients per week and {surgeries} surgeries per month across {conditions} abdominal and soft-tissue diagnoses
**Result:** achieving {ssi}% surgical site infection rate below NHSN benchmark and {los}% of elective surgery patients meeting target same-day or {days}-day discharge criteria

**Variations:**
- **A (Standard):** Managed general surgery practice with {patients} clinic patients per week, achieving {ssi}% surgical site infection rate below NHSN benchmark and {los}% of elective surgery patients meeting target same-day or {days}-day discharge criteria.
- **B (Result-first):** Achieved {ssi}% surgical site infection rate below NHSN benchmark and {los}% of elective  by managing general surgery practice with {patients} clinic patients per.
- **C (Impact-led):** Achieved {ssi}% surgical site infection rate below NHSN benchmark and {los}% of elective ; managed general surgery practice with {patients} clinic patients per week.
- **D (Concise):** Managed general surgery practice with {patients} clinic patient, achieving {ssi}% surgical site infection rate below nhsn benchmark and {los}% of.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{surgeries}`: 20 to 50, step 5 (integer)
  - `{conditions}`: 8 to 20, step 4 (integer)
  - `{ssi}`: 2 to 6, step 1 (percentage)
  - `{los}`: 75 to 96, step 5 (percentage)
  - `{days}`: 1 to 3, step 1 (integer)

### HLTH-0181
**Role:** registered-nurse | **Theme:** neuro-ICU | **Seniority:** senior | **Verb Context:** people
**Keywords:** neurocritical care, NICU, ICP monitoring, subarachnoid hemorrhage, TBI, stroke, EVD

**Scope:** neurocritical care nursing for {patients} neuro-ICU patients per shift managing {icps} ICP monitors and {evds} external ventricular drains
**Result:** achieving {bundle}% neurocritical care bundle compliance and maintaining {favorable}% favorable neurological outcome rate at ICU discharge

**Variations:**
- **A (Standard):** Managed neurocritical care nursing for {patients} neuro-icu patients per , achieving {bundle}% neurocritical care bundle compliance and maintaining {favorable}% favorable neurological outcome rate at ICU discharge.
- **B (Result-first):** Achieved {bundle}% neurocritical care bundle compliance and Maintained {favorable}% favo by managing neurocritical care nursing for {patients} neuro-icu patients.
- **C (Impact-led):** Achieved {bundle}% neurocritical care bundle compliance and Maintained {favorable}% favo; managed neurocritical care nursing for {patients} neuro-icu patients per .
- **D (Concise):** Managed neurocritical care nursing for {patients} neuro-icu pat, achieving {bundle}% neurocritical care bundle compliance and maintaining {favora.

**Variables:**
  - `{patients}`: 2 to 4, step 1 (integer)
  - `{icps}`: 1 to 4, step 1 (integer)
  - `{evds}`: 1 to 4, step 1 (integer)
  - `{bundle}`: 92 to 100, step 2 (percentage)
  - `{favorable}`: 60 to 85, step 5 (percentage)

### HLTH-0182
**Role:** registered-nurse | **Theme:** breast-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** breast care, breast oncology, breast reconstruction, mastectomy, breast cancer nursing, oncology

**Scope:** breast care nursing for {patients} patients per week including pre-surgical education, post-mastectomy care, and survivorship support across {treatment_types} treatment modalities
**Result:** achieving {satisfaction}% patient satisfaction with nursing care and {lymphedema}% lymphedema education completion rate pre-discharge

**Variations:**
- **A (Standard):** Managed breast care nursing for {patients} patients per week including pr, achieving {satisfaction}% patient satisfaction with nursing care and {lymphedema}% lymphedema education completion rate pre-discharge.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction with nursing care and {lymphedema}% lymphed by managing breast care nursing for {patients} patients per week includi.
- **C (Impact-led):** Achieved {satisfaction}% patient satisfaction with nursing care and {lymphedema}% lymphed; managed breast care nursing for {patients} patients per week including pr.
- **D (Concise):** Managed breast care nursing for {patients} patients per week in, achieving {satisfaction}% patient satisfaction with nursing care and {lymphedema.

**Variables:**
  - `{patients}`: 15 to 35, step 5 (integer)
  - `{treatment_types}`: 3 to 6, step 1 (integer)
  - `{satisfaction}`: 90 to 99, step 2 (percentage)
  - `{lymphedema}`: 92 to 100, step 2 (percentage)

### HLTH-0183
**Role:** registered-nurse | **Theme:** NICU-graduate | **Seniority:** junior | **Verb Context:** people
**Keywords:** NICU graduate, developmental care, kangaroo care, family-centered care, neonatal follow-up, infant development

**Scope:** NICU graduate follow-up nursing for {infants} former NICU infants per month, conducting {assessments} developmental assessments and coordinating {referrals} early intervention referrals
**Result:** achieving {referral}% early intervention referral completion rate and {developmental}% of infants meeting age-appropriate developmental milestones at 12 months

**Variations:**
- **A (Standard):** Managed nicu graduate follow-up nursing for {infants} former nicu infants, achieving {referral}% early intervention referral completion rate and {developmental}% of infants meeting age-appropriate developmental milestones at 12 months.
- **B (Result-first):** Achieved {referral}% early intervention referral completion rate and {developmental}% of  by managing nicu graduate follow-up nursing for {infants} former nicu in.
- **C (Impact-led):** Achieved {referral}% early intervention referral completion rate and {developmental}% of ; managed nicu graduate follow-up nursing for {infants} former nicu infants.
- **D (Concise):** Managed nicu graduate follow-up nursing for {infants} former ni, achieving {referral}% early intervention referral completion rate and {developme.

**Variables:**
  - `{infants}`: 20 to 60, step 10 (integer)
  - `{assessments}`: 20 to 60, step 10 (integer)
  - `{referrals}`: 10 to 30, step 5 (integer)
  - `{referral}`: 90 to 100, step 2 (percentage)
  - `{developmental}`: 70 to 90, step 5 (percentage)

### HLTH-0184
**Role:** registered-nurse | **Theme:** infection-disease-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** infectious disease nursing, antimicrobial stewardship, TB, HIV, blood culture, isolation precautions

**Scope:** infectious disease nursing support for {patients} patients per week including {id_consults} ID consultation follow-ups and antimicrobial stewardship collaboration across {units} inpatient units
**Result:** contributing to a {abx}% reduction in broad-spectrum antibiotic days of therapy per {admissions}K admissions and achieving {culture}% blood culture before antibiotic contamination compliance

**Variations:**
- **A (Standard):** Managed infectious disease nursing support for {patients} patients per we, contributing to a {abx}% reduction in broad-spectrum antibiotic days of therapy per {admissions}K admissions and achieving {culture}% blood culture before antibiotic contamination compliance.
- **B (Result-first):** Contributed to a {abx}% reduction in broad-spectrum antibiotic days of therapy per {admis by managing infectious disease nursing support for {patients} patients p.
- **C (Impact-led):** Contributed to a {abx}% reduction in broad-spectrum antibiotic days of therapy per {admis; managed infectious disease nursing support for {patients} patients per we.
- **D (Concise):** Managed infectious disease nursing support for {patients} patie, contributing to a {abx}% reduction in broad-spectrum antibiotic days of therapy .

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{id_consults}`: 10 to 40, step 5 (integer)
  - `{units}`: 5 to 15, step 5 (integer)
  - `{abx}`: 15 to 40, step 5 (percentage)
  - `{admissions}`: 1 to 10, step 1 (integer)
  - `{culture}`: 92 to 100, step 2 (percentage)

### HLTH-0185
**Role:** health-admin | **Theme:** grant-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** grant management, federal funding, NIH, HRSA, grant reporting, program evaluation

**Scope:** grant management for {grants} active federal and foundation grants totaling ${funding}M in funding across {programs} health programs
**Result:** achieving {reporting}% on-time grant reporting compliance and maintaining {expenditure}% within-budget expenditure rate across all awards

**Variations:**
- **A (Standard):** Managed grant management for {grants} active federal and foundation grant, achieving {reporting}% on-time grant reporting compliance and maintaining {expenditure}% within-budget expenditure rate across all awards.
- **B (Result-first):** Achieved {reporting}% on-time grant reporting compliance and Maintained {expenditure}% w by managing grant management for {grants} active federal and foundation .
- **C (Impact-led):** Achieved {reporting}% on-time grant reporting compliance and Maintained {expenditure}% w; managed grant management for {grants} active federal and foundation grant.
- **D (Concise):** Managed grant management for {grants} active federal and founda, achieving {reporting}% on-time grant reporting compliance and maintaining {expen.

**Variables:**
  - `{grants}`: 5 to 20, step 5 (integer)
  - `{funding}`: 1 to 20, step 1 (currency)
  - `{programs}`: 3 to 10, step 1 (integer)
  - `{reporting}`: 95 to 100, step 1 (percentage)
  - `{expenditure}`: 95 to 100, step 1 (percentage)

### HLTH-0186
**Role:** registered-nurse | **Theme:** interventional-cardiology-nursing | **Seniority:** senior | **Verb Context:** operations
**Keywords:** interventional cardiology, cardiac cath, PCI, TAVR, structural heart, access site management

**Scope:** interventional cardiology nursing for {cases} structural heart and PCI procedures per month including {tavr} TAVR and {mitra} MitraClip cases
**Result:** achieving {protocol}% structural heart nursing protocol compliance and {access}% access site complication-free rate for all interventional cases

**Variations:**
- **A (Standard):** Managed interventional cardiology nursing for {cases} structural heart an, achieving {protocol}% structural heart nursing protocol compliance and {access}% access site complication-free rate for all interventional cases.
- **B (Result-first):** Achieved {protocol}% structural heart nursing protocol compliance and {access}% access si by managing interventional cardiology nursing for {cases} structural hea.
- **C (Impact-led):** Achieved {protocol}% structural heart nursing protocol compliance and {access}% access si; managed interventional cardiology nursing for {cases} structural heart an.
- **D (Concise):** Managed interventional cardiology nursing for {cases} structura, achieving {protocol}% structural heart nursing protocol compliance and {access}%.

**Variables:**
  - `{cases}`: 30 to 100, step 10 (integer)
  - `{tavr}`: 5 to 20, step 5 (integer)
  - `{mitra}`: 3 to 15, step 3 (integer)
  - `{protocol}`: 98 to 100, step 1 (percentage)
  - `{access}`: 96 to 100, step 1 (percentage)

### HLTH-0187
**Role:** doctor | **Theme:** infectious-disease | **Seniority:** mid | **Verb Context:** people
**Keywords:** infectious disease, antimicrobial stewardship, sepsis management, HIV, tuberculosis, complex infections

**Scope:** infectious disease consultations for {consults} inpatient and outpatient cases per week plus antimicrobial stewardship program oversight across a {bed}-bed hospital
**Result:** reducing broad-spectrum antibiotic days of therapy by {abx}% per {admissions}K admissions and achieving {sepsis}% sepsis bundle compliance rate

**Variations:**
- **A (Standard):** Managed infectious disease consultations for {consults} inpatient and out, reducing broad-spectrum antibiotic days of therapy by {abx}% per {admissions}K admissions and achieving {sepsis}% sepsis bundle compliance rate.
- **B (Result-first):** Reduced broad-spectrum antibiotic days of therapy by {abx}% per {admissions}K admissions  by managing infectious disease consultations for {consults} inpatient an.
- **C (Impact-led):** Reduced broad-spectrum antibiotic days of therapy by {abx}% per {admissions}K admissions ; managed infectious disease consultations for {consults} inpatient and out.
- **D (Concise):** Managed infectious disease consultations for {consults} inpatie, reducing broad-spectrum antibiotic days of therapy by {abx}% per {admissions}k a.

**Variables:**
  - `{consults}`: 20 to 60, step 10 (integer)
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{abx}`: 20 to 50, step 5 (percentage)
  - `{admissions}`: 1 to 10, step 1 (integer)
  - `{sepsis}`: 88 to 99, step 2 (percentage)

### HLTH-0188
**Role:** doctor | **Theme:** obstetrics-gynecology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** OB/GYN, obstetrics, gynecology, labor management, prenatal care, minimally invasive gynecologic surgery

**Scope:** OB/GYN practice with {ob_patients} obstetric patients and {gyn_patients} gynecology patients per week, managing {deliveries} deliveries and {surgeries} gynecologic surgeries per month
**Result:** maintaining {csection}% primary C-section rate below national benchmark and achieving {complication}% gynecologic surgical complication rate

**Variations:**
- **A (Standard):** Managed ob/gyn practice with {ob_patients} obstetric patients and {gyn_pa, maintaining {csection}% primary C-section rate below national benchmark and achieving {complication}% gynecologic surgical complication rate.
- **B (Result-first):** Maintained {csection}% primary C-section rate below national benchmark and Achieved {com by managing ob/gyn practice with {ob_patients} obstetric patients and {g.
- **C (Impact-led):** Maintained {csection}% primary C-section rate below national benchmark and Achieved {com; managed ob/gyn practice with {ob_patients} obstetric patients and {gyn_pa.
- **D (Concise):** Managed ob/gyn practice with {ob_patients} obstetric patients a, maintaining {csection}% primary c-section rate below national benchmark and achi.

**Variables:**
  - `{ob_patients}`: 15 to 35, step 5 (integer)
  - `{gyn_patients}`: 15 to 35, step 5 (integer)
  - `{deliveries}`: 10 to 40, step 5 (integer)
  - `{surgeries}`: 10 to 30, step 5 (integer)
  - `{csection}`: 15 to 25, step 2 (percentage)
  - `{complication}`: 2 to 8, step 1 (percentage)

### HLTH-0189
**Role:** registered-nurse | **Theme:** mobile-health-clinic | **Seniority:** mid | **Verb Context:** people
**Keywords:** mobile health, mobile clinic, underserved populations, outreach, community health, access to care

**Scope:** mobile health clinic nursing for {patients}K patients annually across {sites} community sites serving underserved populations with primary care, screenings, and immunizations
**Result:** achieving {screen}% preventive screening completion rate and reducing average travel-to-care barrier from {before} miles to {after} miles for enrolled patients

**Variations:**
- **A (Standard):** Managed mobile health clinic nursing for {patients}k patients annually ac, achieving {screen}% preventive screening completion rate and reducing average travel-to-care barrier from {before} miles to {after} miles for enrolled patients.
- **B (Result-first):** Achieved {screen}% preventive screening completion rate and Reduced average travel-to-ca by managing mobile health clinic nursing for {patients}k patients annual.
- **C (Impact-led):** Achieved {screen}% preventive screening completion rate and Reduced average travel-to-ca; managed mobile health clinic nursing for {patients}k patients annually ac.
- **D (Concise):** Managed mobile health clinic nursing for {patients}k patients a, achieving {screen}% preventive screening completion rate and reducing average tr.

**Variables:**
  - `{patients}`: 1 to 20, step 1 (integer)
  - `{sites}`: 3 to 15, step 3 (integer)
  - `{screen}`: 80 to 98, step 2 (percentage)
  - `{before}`: 20 to 50, step 5 (integer)
  - `{after}`: 5 to 15, step 5 (integer)

### HLTH-0190
**Role:** health-admin | **Theme:** mergers-acquisitions | **Seniority:** senior | **Verb Context:** operations
**Keywords:** healthcare M&A, hospital acquisition, integration planning, due diligence, system integration, health system growth

**Scope:** acquisition integration for {facilities} acquired facilities totaling {beds} beds and ${revenue}M in combined net revenue, leading {workstreams} clinical and operational integration workstreams
**Result:** completing integration milestones {months} months ahead of schedule and achieving ${synergies}M in year-one operational synergies

**Variations:**
- **A (Standard):** Managed acquisition integration for {facilities} acquired facilities tota, completing integration milestones {months} months ahead of schedule and achieving ${synergies}M in year-one operational synergies.
- **B (Result-first):** completing integration milestones {months} months ahead of schedule and Achieved ${synerg by managing acquisition integration for {facilities} acquired facilities.
- **C (Impact-led):** completing integration milestones {months} months ahead of schedule and Achieved ${synerg; managed acquisition integration for {facilities} acquired facilities tota.
- **D (Concise):** Managed acquisition integration for {facilities} acquired facil, completing integration milestones {months} months ahead of schedule and achievin.

**Variables:**
  - `{facilities}`: 1 to 5, step 1 (integer)
  - `{beds}`: 100 to 2000, step 100 (integer)
  - `{revenue}`: 10 to 500, step 10 (currency)
  - `{workstreams}`: 5 to 20, step 5 (integer)
  - `{months}`: 3 to 12, step 3 (integer)
  - `{synergies}`: 1 to 50, step 1 (currency)

### HLTH-0191
**Role:** registered-nurse | **Theme:** substance-abuse-detox | **Seniority:** junior | **Verb Context:** people
**Keywords:** detox nursing, withdrawal, CIWA-Ar, substance abuse, supervised withdrawal, addiction nursing

**Scope:** detox nursing care for {patients} patients per shift on a {bed}-bed substance use detox unit, performing {ciwa} CIWA-Ar assessments per shift and administering withdrawal management medications
**Result:** achieving {completion}% safe medical withdrawal completion rate and {referral}% post-detox treatment referral acceptance

**Variations:**
- **A (Standard):** Managed detox nursing care for {patients} patients per shift on a {bed}-b, achieving {completion}% safe medical withdrawal completion rate and {referral}% post-detox treatment referral acceptance.
- **B (Result-first):** Achieved {completion}% safe medical withdrawal completion rate and {referral}% post-detox by managing detox nursing care for {patients} patients per shift on a {b.
- **C (Impact-led):** Achieved {completion}% safe medical withdrawal completion rate and {referral}% post-detox; managed detox nursing care for {patients} patients per shift on a {bed}-b.
- **D (Concise):** Managed detox nursing care for {patients} patients per shift on, achieving {completion}% safe medical withdrawal completion rate and {referral}% .

**Variables:**
  - `{patients}`: 5 to 10, step 1 (integer)
  - `{bed}`: 10 to 20, step 5 (integer)
  - `{ciwa}`: 10 to 30, step 5 (integer)
  - `{completion}`: 88 to 99, step 2 (percentage)
  - `{referral}`: 50 to 80, step 5 (percentage)

### HLTH-0192
**Role:** doctor | **Theme:** family-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** family medicine, primary care, preventive care, chronic disease, PCMH, family physician

**Scope:** family medicine panel of {patients} patients per day across all ages, managing {conditions} chronic conditions and delivering {preventive} preventive services per week
**Result:** achieving {bpcontrol}% hypertension control and {colorectal}% colorectal cancer screening completion rate among eligible patients

**Variations:**
- **A (Standard):** Managed family medicine panel of {patients} patients per day across all a, achieving {bpcontrol}% hypertension control and {colorectal}% colorectal cancer screening completion rate among eligible patients.
- **B (Result-first):** Achieved {bpcontrol}% hypertension control and {colorectal}% colorectal cancer screening  by managing family medicine panel of {patients} patients per day across .
- **C (Impact-led):** Achieved {bpcontrol}% hypertension control and {colorectal}% colorectal cancer screening ; managed family medicine panel of {patients} patients per day across all a.
- **D (Concise):** Managed family medicine panel of {patients} patients per day ac, achieving {bpcontrol}% hypertension control and {colorectal}% colorectal cancer .

**Variables:**
  - `{patients}`: 20 to 35, step 5 (integer)
  - `{conditions}`: 8 to 20, step 4 (integer)
  - `{preventive}`: 20 to 60, step 10 (integer)
  - `{bpcontrol}`: 65 to 88, step 5 (percentage)
  - `{colorectal}`: 75 to 96, step 5 (percentage)

### HLTH-0193
**Role:** health-admin | **Theme:** infection-control-director | **Seniority:** senior | **Verb Context:** operations
**Keywords:** infection prevention director, HAI, antimicrobial stewardship, APIC, surveillance program, outbreak management

**Scope:** infection prevention and control program for a {bed}-bed health system with {staff} IP professionals, overseeing {surveillance} surveillance protocols and {outbreaks} outbreak investigations per year
**Result:** reducing CLABSI, CAUTI, and CDI rates to the {percentile}th percentile nationally and achieving {accreditation}% TJC infection control standards compliance

**Variations:**
- **A (Standard):** Managed infection prevention and control program for a {bed}-bed health s, reducing CLABSI, CAUTI, and CDI rates to the {percentile}th percentile nationally and achieving {accreditation}% TJC infection control standards compliance.
- **B (Result-first):** Reduced CLABSI, CAUTI, and CDI rates to the {percentile}th percentile nationally and achi by managing infection prevention and control program for a {bed}-bed hea.
- **C (Impact-led):** Reduced CLABSI, CAUTI, and CDI rates to the {percentile}th percentile nationally and achi; managed infection prevention and control program for a {bed}-bed health s.
- **D (Concise):** Managed infection prevention and control program for a {bed}-be, reducing clabsi, cauti, and cdi rates to the {percentile}th percentile nationall.

**Variables:**
  - `{bed}`: 200 to 1000, step 100 (integer)
  - `{staff}`: 3 to 15, step 3 (integer)
  - `{surveillance}`: 5 to 20, step 5 (integer)
  - `{outbreaks}`: 3 to 15, step 3 (integer)
  - `{percentile}`: 25 to 50, step 5 (integer)
  - `{accreditation}`: 95 to 100, step 1 (percentage)

### HLTH-0194
**Role:** registered-nurse | **Theme:** progressive-care | **Seniority:** junior | **Verb Context:** people
**Keywords:** progressive care unit, step-down, PCU, intermediate care, telemetry, cardiac monitoring

**Scope:** progressive care nursing for {patients} patients per shift on a {bed}-bed PCU, managing {drips} low-dose vasoactive infusions and cardiac telemetry monitoring
**Result:** achieving {recognition}% arrhythmia recognition rate and {transfer}% unplanned ICU transfer rate below unit benchmark

**Variations:**
- **A (Standard):** Managed progressive care nursing for {patients} patients per shift on a {, achieving {recognition}% arrhythmia recognition rate and {transfer}% unplanned ICU transfer rate below unit benchmark.
- **B (Result-first):** Achieved {recognition}% arrhythmia recognition rate and {transfer}% unplanned ICU transfe by managing progressive care nursing for {patients} patients per shift o.
- **C (Impact-led):** Achieved {recognition}% arrhythmia recognition rate and {transfer}% unplanned ICU transfe; managed progressive care nursing for {patients} patients per shift on a {.
- **D (Concise):** Managed progressive care nursing for {patients} patients per sh, achieving {recognition}% arrhythmia recognition rate and {transfer}% unplanned i.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{drips}`: 1 to 4, step 1 (integer)
  - `{recognition}`: 100 to 100, step 0 (percentage)
  - `{transfer}`: 3 to 10, step 1 (percentage)

### HLTH-0195
**Role:** health-admin | **Theme:** physician-recruitment | **Seniority:** mid | **Verb Context:** people
**Keywords:** physician recruitment, provider recruitment, locums, employed physician, talent acquisition, physician onboarding

**Scope:** physician recruitment program filling {positions} open physician and APP positions per year across {specialties} specialties with an average time-to-fill of {ttf} days
**Result:** reducing time-to-fill from {ttf_before} to {ttf_after} days and achieving {retention}% 2-year physician retention rate for recruited providers

**Variations:**
- **A (Standard):** Managed physician recruitment program filling {positions} open physician , reducing time-to-fill from {ttf_before} to {ttf_after} days and achieving {retention}% 2-year physician retention rate for recruited providers.
- **B (Result-first):** Reduced time-to-fill from {ttf_before} to {ttf_after} days and Achieved {retention}% 2-y by managing physician recruitment program filling {positions} open physi.
- **C (Impact-led):** Reduced time-to-fill from {ttf_before} to {ttf_after} days and Achieved {retention}% 2-y; managed physician recruitment program filling {positions} open physician .
- **D (Concise):** Managed physician recruitment program filling {positions} open , reducing time-to-fill from {ttf_before} to {ttf_after} days and achieving {reten.

**Variables:**
  - `{positions}`: 10 to 50, step 10 (integer)
  - `{specialties}`: 5 to 20, step 5 (integer)
  - `{ttf}`: 60 to 180, step 30 (integer)
  - `{ttf_before}`: 120 to 200, step 20 (integer)
  - `{ttf_after}`: 60 to 100, step 10 (integer)
  - `{retention}`: 80 to 96, step 2 (percentage)

### HLTH-0196
**Role:** registered-nurse | **Theme:** vascular-access | **Seniority:** senior | **Verb Context:** operations
**Keywords:** vascular access, PICC, midline, central line, vascular access team, ultrasound-guided IV

**Scope:** vascular access team services for a {bed}-bed hospital, placing {picc} PICCs and {midlines} midlines per month with ultrasound guidance across {units} inpatient units
**Result:** achieving {success}% first-attempt success rate for all vascular access insertions and maintaining {dislodgement}% dislodgement rate below national PICC benchmark

**Variations:**
- **A (Standard):** Managed vascular access team services for a {bed}-bed hospital, placing {, achieving {success}% first-attempt success rate for all vascular access insertions and maintaining {dislodgement}% dislodgement rate below national PICC benchmark.
- **B (Result-first):** Achieved {success}% first-attempt success rate for all vascular access insertions and mai by managing vascular access team services for a {bed}-bed hospital, plac.
- **C (Impact-led):** Achieved {success}% first-attempt success rate for all vascular access insertions and mai; managed vascular access team services for a {bed}-bed hospital, placing {.
- **D (Concise):** Managed vascular access team services for a {bed}-bed hospital, achieving {success}% first-attempt success rate for all vascular access insertio.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{picc}`: 50 to 300, step 25 (integer)
  - `{midlines}`: 20 to 100, step 10 (integer)
  - `{units}`: 5 to 20, step 5 (integer)
  - `{success}`: 92 to 99, step 2 (percentage)
  - `{dislodgement}`: 1 to 5, step 0.5 (percentage)

### HLTH-0197
**Role:** registered-nurse | **Theme:** psychiatric-long-term | **Seniority:** junior | **Verb Context:** people
**Keywords:** long-term psychiatric care, chronic mental illness, community integration, social skills, psychiatric rehabilitation, custodial care

**Scope:** long-term psychiatric care for {patients} chronically ill patients per shift in a {bed}-bed extended care unit, facilitating {groups} therapeutic group sessions and {adls} ADL skill-building activities per week
**Result:** achieving {community}% successful community placement rate within {months} months and {medication}% medication adherence rate among patients

**Variations:**
- **A (Standard):** Managed long-term psychiatric care for {patients} chronically ill patient, achieving {community}% successful community placement rate within {months} months and {medication}% medication adherence rate among patients.
- **B (Result-first):** Achieved {community}% successful community placement rate within {months} months and {med by managing long-term psychiatric care for {patients} chronically ill pa.
- **C (Impact-led):** Achieved {community}% successful community placement rate within {months} months and {med; managed long-term psychiatric care for {patients} chronically ill patient.
- **D (Concise):** Managed long-term psychiatric care for {patients} chronically i, achieving {community}% successful community placement rate within {months} month.

**Variables:**
  - `{patients}`: 8 to 15, step 3 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{groups}`: 5 to 15, step 5 (integer)
  - `{adls}`: 5 to 20, step 5 (integer)
  - `{community}`: 30 to 65, step 5 (percentage)
  - `{months}`: 6 to 24, step 6 (integer)
  - `{medication}`: 75 to 96, step 5 (percentage)

### HLTH-0198
**Role:** doctor | **Theme:** sleep-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** sleep medicine, polysomnography, obstructive sleep apnea, CPAP, insomnia, narcolepsy

**Scope:** sleep medicine panel of {patients} patients per week including {psgs} polysomnography studies and {titrations} CPAP titrations per month across {conditions} sleep disorders
**Result:** achieving {cpap_adherence}% CPAP adherence at 3 months among newly diagnosed OSA patients and {insomnia_remission}% insomnia remission rate using CBT-I

**Variations:**
- **A (Standard):** Managed sleep medicine panel of {patients} patients per week including {p, achieving {cpap_adherence}% CPAP adherence at 3 months among newly diagnosed OSA patients and {insomnia_remission}% insomnia remission rate using CBT-I.
- **B (Result-first):** Achieved {cpap_adherence}% CPAP adherence at 3 months among newly diagnosed OSA patients  by managing sleep medicine panel of {patients} patients per week includi.
- **C (Impact-led):** Achieved {cpap_adherence}% CPAP adherence at 3 months among newly diagnosed OSA patients ; managed sleep medicine panel of {patients} patients per week including {p.
- **D (Concise):** Managed sleep medicine panel of {patients} patients per week in, achieving {cpap_adherence}% cpap adherence at 3 months among newly diagnosed osa.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{psgs}`: 20 to 60, step 10 (integer)
  - `{titrations}`: 10 to 30, step 5 (integer)
  - `{conditions}`: 5 to 10, step 1 (integer)
  - `{cpap_adherence}`: 60 to 85, step 5 (percentage)
  - `{insomnia_remission}`: 60 to 80, step 5 (percentage)

### HLTH-0199
**Role:** doctor | **Theme:** neonatology | **Seniority:** senior | **Verb Context:** people
**Keywords:** neonatology, NICU, preterm infant, neonatal medicine, neonatal resuscitation, NRP

**Scope:** neonatology attending coverage in a Level {level} NICU with {patients} patients, supervising {residents} trainees and managing {resus} neonatal resuscitations per month
**Result:** achieving {survival}% survival rate for infants born at 24 to 28 weeks gestation and {nhie}% cooling therapy initiation rate for eligible HIE patients within 6 hours

**Variations:**
- **A (Standard):** Managed neonatology attending coverage in a level {level} nicu with {pati, achieving {survival}% survival rate for infants born at 24 to 28 weeks gestation and {nhie}% cooling therapy initiation rate for eligible HIE patients within 6 hours.
- **B (Result-first):** Achieved {survival}% survival rate for infants born at 24 to 28 weeks gestation and {nhie by managing neonatology attending coverage in a level {level} nicu with .
- **C (Impact-led):** Achieved {survival}% survival rate for infants born at 24 to 28 weeks gestation and {nhie; managed neonatology attending coverage in a level {level} nicu with {pati.
- **D (Concise):** Managed neonatology attending coverage in a level {level} nicu , achieving {survival}% survival rate for infants born at 24 to 28 weeks gestation.

**Variables:**
  - `{level}`: 2 to 4, step 1 (integer)
  - `{patients}`: 10 to 40, step 5 (integer)
  - `{residents}`: 2 to 8, step 2 (integer)
  - `{resus}`: 5 to 20, step 5 (integer)
  - `{survival}`: 80 to 95, step 5 (percentage)
  - `{nhie}`: 90 to 100, step 5 (percentage)

### HLTH-0200
**Role:** health-admin | **Theme:** environmental-services | **Seniority:** mid | **Verb Context:** operations
**Keywords:** environmental services, EVS, hospital cleaning, high touch surface cleaning, infection prevention, room turnover

**Scope:** environmental services operations for a {bed}-bed hospital with {staff} EVS staff, managing {rooms}K patient room cleans and {turns} surgical suite turnovers per month
**Result:** achieving {atp}% ATP bioluminescence testing pass rate for high-touch surfaces and reducing room-ready turnaround from {before} to {after} minutes

**Variations:**
- **A (Standard):** Managed environmental services operations for a {bed}-bed hospital with {, achieving {atp}% ATP bioluminescence testing pass rate for high-touch surfaces and reducing room-ready turnaround from {before} to {after} minutes.
- **B (Result-first):** Achieved {atp}% ATP bioluminescence testing pass rate for high-touch surfaces and reducin by managing environmental services operations for a {bed}-bed hospital w.
- **C (Impact-led):** Achieved {atp}% ATP bioluminescence testing pass rate for high-touch surfaces and reducin; managed environmental services operations for a {bed}-bed hospital with {.
- **D (Concise):** Managed environmental services operations for a {bed}-bed hospi, achieving {atp}% atp bioluminescence testing pass rate for high-touch surfaces a.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{staff}`: 50 to 500, step 50 (integer)
  - `{rooms}`: 1 to 20, step 1 (integer)
  - `{turns}`: 50 to 500, step 50 (integer)
  - `{atp}`: 92 to 99, step 2 (percentage)
  - `{before}`: 45 to 90, step 5 (integer)
  - `{after}`: 25 to 40, step 5 (integer)

### HLTH-0201
**Role:** registered-nurse | **Theme:** telestroke-coordinator | **Seniority:** junior | **Verb Context:** operations
**Keywords:** stroke coordinator, stroke certification, stroke protocols, telestroke, Get With The Guidelines, DNV

**Scope:** {activations} stroke activations per month, coordinating telestroke neurology consults and tracking quality metrics for {metrics} Get With The Guidelines performance measures
**Result:** achieving {gold}% performance on The Joint Commission advanced certification criteria and reducing door-to-CT time from {before} to {after} minutes

**Variations:**
- **A (Standard):** Managed {activations} stroke activations per month, coordinating telestro, achieving {gold}% performance on The Joint Commission advanced certification criteria and reducing door-to-CT time from {before} to {after} minutes.
- **B (Result-first):** Achieved {gold}% performance on The Joint Commission advanced certification criteria and  by managing {activations} stroke activations per month, coordinating tel.
- **C (Impact-led):** Achieved {gold}% performance on The Joint Commission advanced certification criteria and ; managed {activations} stroke activations per month, coordinating telestro.
- **D (Concise):** Managed {activations} stroke activations per month, coordinatin, achieving {gold}% performance on the joint commission advanced certification cri.

**Variables:**
  - `{activations}`: 5 to 30, step 5 (integer)
  - `{metrics}`: 8 to 15, step 1 (integer)
  - `{gold}`: 90 to 100, step 5 (percentage)
  - `{before}`: 25 to 45, step 5 (integer)
  - `{after}`: 10 to 20, step 5 (integer)

### HLTH-0202
**Role:** health-admin | **Theme:** patient-access | **Seniority:** mid | **Verb Context:** operations
**Keywords:** patient access, registration, insurance verification, pre-registration, financial counseling, point of service collections

**Scope:** patient access operations for a {volume}K-visit facility with {staff} registration staff across {departments} access points, managing insurance verification and pre-authorization
**Result:** improving point-of-service collection rate from {before}% to {after}% and reducing registration error rate from {err_before}% to {err_after}%

**Variations:**
- **A (Standard):** Managed patient access operations for a {volume}k-visit facility with {st, improving point-of-service collection rate from {before}% to {after}% and reducing registration error rate from {err_before}% to {err_after}%.
- **B (Result-first):** Improved point-of-service collection rate from {before}% to {after}% and Reduced registr by managing patient access operations for a {volume}k-visit facility wit.
- **C (Impact-led):** Improved point-of-service collection rate from {before}% to {after}% and Reduced registr; managed patient access operations for a {volume}k-visit facility with {st.
- **D (Concise):** Managed patient access operations for a {volume}k-visit facilit, improving point-of-service collection rate from {before}% to {after}% and reduci.

**Variables:**
  - `{volume}`: 50 to 500, step 50 (integer)
  - `{staff}`: 20 to 100, step 10 (integer)
  - `{departments}`: 5 to 15, step 5 (integer)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 60 to 82, step 5 (percentage)
  - `{err_before}`: 5 to 15, step 2 (percentage)
  - `{err_after}`: 1 to 4, step 1 (percentage)

### HLTH-0203
**Role:** registered-nurse | **Theme:** substance-use-iop | **Seniority:** mid | **Verb Context:** people
**Keywords:** intensive outpatient, IOP, substance use treatment, group therapy, relapse prevention, recovery support

**Scope:** intensive outpatient program nursing for {patients} patients per day across {groups} therapeutic groups combining nursing assessment, MAT administration, and psychoeducation
**Result:** achieving {completion}% IOP completion rate and {abstinence}% 6-month abstinence rate among program completers

**Variations:**
- **A (Standard):** Managed intensive outpatient program nursing for {patients} patients per , achieving {completion}% IOP completion rate and {abstinence}% 6-month abstinence rate among program completers.
- **B (Result-first):** Achieved {completion}% IOP completion rate and {abstinence}% 6-month abstinence rate amon by managing intensive outpatient program nursing for {patients} patients.
- **C (Impact-led):** Achieved {completion}% IOP completion rate and {abstinence}% 6-month abstinence rate amon; managed intensive outpatient program nursing for {patients} patients per .
- **D (Concise):** Managed intensive outpatient program nursing for {patients} pat, achieving {completion}% iop completion rate and {abstinence}% 6-month abstinence.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{groups}`: 2 to 5, step 1 (integer)
  - `{completion}`: 60 to 85, step 5 (percentage)
  - `{abstinence}`: 45 to 72, step 5 (percentage)

### HLTH-0204
**Role:** doctor | **Theme:** hematology-oncology | **Seniority:** senior | **Verb Context:** people
**Keywords:** hematology oncology, chemotherapy, immunotherapy, CAR-T, blood cancers, solid tumors

**Scope:** hematology-oncology panel of {patients} patients per week including {chemotherapy} chemotherapy visits and {immunotherapy} immunotherapy infusions per month across {cancer_types} cancer types
**Result:** achieving {response}% overall response rate for first-line treatments and maintaining {toxicity}% grade 3 to 4 toxicity rate below protocol threshold

**Variations:**
- **A (Standard):** Managed hematology-oncology panel of {patients} patients per week includi, achieving {response}% overall response rate for first-line treatments and maintaining {toxicity}% grade 3 to 4 toxicity rate below protocol threshold.
- **B (Result-first):** Achieved {response}% overall response rate for first-line treatments and Maintained {tox by managing hematology-oncology panel of {patients} patients per week in.
- **C (Impact-led):** Achieved {response}% overall response rate for first-line treatments and Maintained {tox; managed hematology-oncology panel of {patients} patients per week includi.
- **D (Concise):** Managed hematology-oncology panel of {patients} patients per we, achieving {response}% overall response rate for first-line treatments and mainta.

**Variables:**
  - `{patients}`: 30 to 60, step 10 (integer)
  - `{chemotherapy}`: 20 to 60, step 10 (integer)
  - `{immunotherapy}`: 10 to 40, step 5 (integer)
  - `{cancer_types}`: 5 to 15, step 5 (integer)
  - `{response}`: 50 to 80, step 5 (percentage)
  - `{toxicity}`: 10 to 30, step 5 (percentage)

### HLTH-0205
**Role:** doctor | **Theme:** thoracic-surgery | **Seniority:** senior | **Verb Context:** operations
**Keywords:** thoracic surgery, lung resection, VATS, esophageal surgery, mediastinoscopy, lung cancer

**Scope:** thoracic surgery practice with {patients} clinic patients per week and {surgeries} surgeries per month including VATS lobectomies and esophageal resections
**Result:** achieving {conversion}% minimally invasive surgical conversion rate and {readmit}% 30-day readmission rate below STS national benchmark

**Variations:**
- **A (Standard):** Managed thoracic surgery practice with {patients} clinic patients per wee, achieving {conversion}% minimally invasive surgical conversion rate and {readmit}% 30-day readmission rate below STS national benchmark.
- **B (Result-first):** Achieved {conversion}% minimally invasive surgical conversion rate and {readmit}% 30-day  by managing thoracic surgery practice with {patients} clinic patients pe.
- **C (Impact-led):** Achieved {conversion}% minimally invasive surgical conversion rate and {readmit}% 30-day ; managed thoracic surgery practice with {patients} clinic patients per wee.
- **D (Concise):** Managed thoracic surgery practice with {patients} clinic patien, achieving {conversion}% minimally invasive surgical conversion rate and {readmit.

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{surgeries}`: 10 to 30, step 5 (integer)
  - `{conversion}`: 70 to 95, step 5 (percentage)
  - `{readmit}`: 5 to 12, step 1 (percentage)

### HLTH-0206
**Role:** registered-nurse | **Theme:** rapid-response | **Seniority:** senior | **Verb Context:** people
**Keywords:** rapid response team, RRT, early warning, clinical deterioration, NEWS, afferent limb

**Scope:** rapid response team nursing for a {bed}-bed hospital, responding to {calls} RRT activations per month and conducting {rounds} proactive ICU liaison rounds per week
**Result:** reducing unplanned ICU transfers by {transfer}% and contributing to a {code_reduction}% reduction in non-ICU code blue events per quarter

**Variations:**
- **A (Standard):** Managed rapid response team nursing for a {bed}-bed hospital, responding , reducing unplanned ICU transfers by {transfer}% and contributing to a {code_reduction}% reduction in non-ICU code blue events per quarter.
- **B (Result-first):** Reduced unplanned ICU transfers by {transfer}% and Contributed to a {code_reduction}% re by managing rapid response team nursing for a {bed}-bed hospital, respon.
- **C (Impact-led):** Reduced unplanned ICU transfers by {transfer}% and Contributed to a {code_reduction}% re; managed rapid response team nursing for a {bed}-bed hospital, responding .
- **D (Concise):** Managed rapid response team nursing for a {bed}-bed hospital, r, reducing unplanned icu transfers by {transfer}% and contributing to a {code_redu.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{calls}`: 20 to 80, step 10 (integer)
  - `{rounds}`: 5 to 20, step 5 (integer)
  - `{transfer}`: 15 to 40, step 5 (percentage)
  - `{code_reduction}`: 20 to 50, step 5 (percentage)

### HLTH-0207
**Role:** registered-nurse | **Theme:** clinical-educator-specialty | **Seniority:** mid | **Verb Context:** people
**Keywords:** specialty nursing education, ACLS instructor, BLS instructor, skills validation, continuing education, NCLEX prep

**Scope:** specialty nursing education for {learners} nurses per year across {programs} CE programs including ACLS, BLS, and specialty certification review
**Result:** achieving {pass}% ACLS certification pass rate on first attempt and {nclex}% new graduate NCLEX-RN first-time pass rate among program attendees

**Variations:**
- **A (Standard):** Managed specialty nursing education for {learners} nurses per year across, achieving {pass}% ACLS certification pass rate on first attempt and {nclex}% new graduate NCLEX-RN first-time pass rate among program attendees.
- **B (Result-first):** Achieved {pass}% ACLS certification pass rate on first attempt and {nclex}% new graduate  by managing specialty nursing education for {learners} nurses per year a.
- **C (Impact-led):** Achieved {pass}% ACLS certification pass rate on first attempt and {nclex}% new graduate ; managed specialty nursing education for {learners} nurses per year across.
- **D (Concise):** Managed specialty nursing education for {learners} nurses per y, achieving {pass}% acls certification pass rate on first attempt and {nclex}% new.

**Variables:**
  - `{learners}`: 50 to 500, step 50 (integer)
  - `{programs}`: 3 to 10, step 1 (integer)
  - `{pass}`: 90 to 100, step 5 (percentage)
  - `{nclex}`: 85 to 99, step 2 (percentage)

### HLTH-0208
**Role:** health-admin | **Theme:** corporate-compliance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** corporate compliance, healthcare compliance, OIG, compliance program, exclusion screening, compliance training

**Scope:** healthcare compliance program for a {bed}-bed health system with {staff}K employees, conducting {training}K compliance training completions and {audits} annual compliance audits
**Result:** maintaining {training_rate}% annual training completion rate and achieving zero OIG exclusion violations across {years} years of monitoring

**Variations:**
- **A (Standard):** Managed healthcare compliance program for a {bed}-bed health system with , maintaining {training_rate}% annual training completion rate and achieving zero OIG exclusion violations across {years} years of monitoring.
- **B (Result-first):** Maintained {training_rate}% annual training completion rate and Achieved zero OIG exclus by managing healthcare compliance program for a {bed}-bed health system .
- **C (Impact-led):** Maintained {training_rate}% annual training completion rate and Achieved zero OIG exclus; managed healthcare compliance program for a {bed}-bed health system with .
- **D (Concise):** Managed healthcare compliance program for a {bed}-bed health sy, maintaining {training_rate}% annual training completion rate and achieving zero .

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{staff}`: 1 to 20, step 1 (integer)
  - `{training}`: 1 to 20, step 1 (integer)
  - `{audits}`: 3 to 10, step 1 (integer)
  - `{training_rate}`: 95 to 100, step 1 (percentage)
  - `{years}`: 2 to 5, step 1 (integer)

### HLTH-0209
**Role:** registered-nurse | **Theme:** day-surgery | **Seniority:** junior | **Verb Context:** operations
**Keywords:** day surgery, ambulatory surgery, same-day surgery, pre-op, PACU, discharge instructions

**Scope:** ambulatory surgery nursing across pre-op, intraoperative, and post-op phases for {patients} same-day surgery patients per shift across {procedure_types} procedure types
**Result:** achieving {discharge}% same-day discharge rate and {satisfaction}% patient satisfaction with the ambulatory surgery experience

**Variations:**
- **A (Standard):** Managed ambulatory surgery nursing across pre-op, intraoperative, and pos, achieving {discharge}% same-day discharge rate and {satisfaction}% patient satisfaction with the ambulatory surgery experience.
- **B (Result-first):** Achieved {discharge}% same-day discharge rate and {satisfaction}% patient satisfaction wi by managing ambulatory surgery nursing across pre-op, intraoperative, an.
- **C (Impact-led):** Achieved {discharge}% same-day discharge rate and {satisfaction}% patient satisfaction wi; managed ambulatory surgery nursing across pre-op, intraoperative, and pos.
- **D (Concise):** Managed ambulatory surgery nursing across pre-op, intraoperativ, achieving {discharge}% same-day discharge rate and {satisfaction}% patient satis.

**Variables:**
  - `{patients}`: 8 to 20, step 4 (integer)
  - `{procedure_types}`: 5 to 15, step 5 (integer)
  - `{discharge}`: 95 to 100, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0210
**Role:** health-admin | **Theme:** patient-safety-officer | **Seniority:** senior | **Verb Context:** operations
**Keywords:** patient safety, safety event reporting, serious safety events, RCA, safety culture, CANDOR

**Scope:** patient safety program for a {bed}-bed health system, managing {reports}K safety event reports per year and conducting {rcas} root cause analyses annually
**Result:** reducing serious safety events by {reduction}% and improving safety culture composite score from {before} to {after} out of 5 on the SOPS survey

**Variations:**
- **A (Standard):** Managed patient safety program for a {bed}-bed health system, managing {r, reducing serious safety events by {reduction}% and improving safety culture composite score from {before} to {after} out of 5 on the SOPS survey.
- **B (Result-first):** Reduced serious safety events by {reduction}% and Improved safety culture composite scor by managing patient safety program for a {bed}-bed health system, managi.
- **C (Impact-led):** Reduced serious safety events by {reduction}% and Improved safety culture composite scor; managed patient safety program for a {bed}-bed health system, managing {r.
- **D (Concise):** Managed patient safety program for a {bed}-bed health system, m, reducing serious safety events by {reduction}% and improving safety culture comp.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{reports}`: 1 to 20, step 1 (integer)
  - `{rcas}`: 10 to 50, step 5 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)
  - `{before}`: 3 to 3.5, step 0.5 (integer)
  - `{after}`: 4 to 5, step 0.5 (integer)

### HLTH-0211
**Role:** registered-nurse | **Theme:** HIV-care | **Seniority:** mid | **Verb Context:** people
**Keywords:** HIV nursing, antiretroviral therapy, ART, viral suppression, HIV management, infectious disease nursing

**Scope:** HIV clinical nursing care for {patients} patients per month managing ART regimens across {comorbidities} comorbidity categories with {adherence} adherence counseling contacts
**Result:** achieving {suppressed}% viral suppression rate among active patients and {retention}% care retention rate at 12 months

**Variations:**
- **A (Standard):** Managed hiv clinical nursing care for {patients} patients per month manag, achieving {suppressed}% viral suppression rate among active patients and {retention}% care retention rate at 12 months.
- **B (Result-first):** Achieved {suppressed}% viral suppression rate among active patients and {retention}% care by managing hiv clinical nursing care for {patients} patients per month .
- **C (Impact-led):** Achieved {suppressed}% viral suppression rate among active patients and {retention}% care; managed hiv clinical nursing care for {patients} patients per month manag.
- **D (Concise):** Managed hiv clinical nursing care for {patients} patients per m, achieving {suppressed}% viral suppression rate among active patients and {retent.

**Variables:**
  - `{patients}`: 30 to 100, step 10 (integer)
  - `{comorbidities}`: 3 to 8, step 1 (integer)
  - `{adherence}`: 20 to 80, step 10 (integer)
  - `{suppressed}`: 75 to 96, step 5 (percentage)
  - `{retention}`: 70 to 92, step 5 (percentage)

### HLTH-0212
**Role:** doctor | **Theme:** hepatology | **Seniority:** senior | **Verb Context:** people
**Keywords:** hepatology, liver disease, cirrhosis, NASH, liver transplant, GI hepatology

**Scope:** hepatology panel of {patients} patients per week managing {conditions} liver conditions including cirrhosis, NASH, and autoimmune hepatitis, with {transplant} liver transplant evaluation patients per month
**Result:** achieving {undetectable}% HCV SVR12 rate for treated patients and {meld}% reduction in MELD score at 6 months for NASH cirrhosis patients

**Variations:**
- **A (Standard):** Managed hepatology panel of {patients} patients per week managing {condit, achieving {undetectable}% HCV SVR12 rate for treated patients and {meld}% reduction in MELD score at 6 months for NASH cirrhosis patients.
- **B (Result-first):** Achieved {undetectable}% HCV SVR12 rate for treated patients and {meld}% reduction in MEL by managing hepatology panel of {patients} patients per week managing {c.
- **C (Impact-led):** Achieved {undetectable}% HCV SVR12 rate for treated patients and {meld}% reduction in MEL; managed hepatology panel of {patients} patients per week managing {condit.
- **D (Concise):** Managed hepatology panel of {patients} patients per week managi, achieving {undetectable}% hcv svr12 rate for treated patients and {meld}% reduct.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{conditions}`: 5 to 10, step 1 (integer)
  - `{transplant}`: 5 to 20, step 5 (integer)
  - `{undetectable}`: 90 to 99, step 2 (percentage)
  - `{meld}`: 15 to 40, step 5 (percentage)

### HLTH-0213
**Role:** registered-nurse | **Theme:** colorectal-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** colorectal surgery nursing, ileostomy, colostomy, ERAS, pelvic floor, ostomy care

**Scope:** colorectal surgery nursing for {patients} patients per shift including {ostomy} new ostomy patients requiring stoma education and {eras} ERAS protocol management
**Result:** achieving {eras}% ERAS adherence rate and {ostomy_acceptance}% patient ostomy self-care independence at discharge

**Variations:**
- **A (Standard):** Managed colorectal surgery nursing for {patients} patients per shift incl, achieving {eras}% ERAS adherence rate and {ostomy_acceptance}% patient ostomy self-care independence at discharge.
- **B (Result-first):** Achieved {eras}% ERAS adherence rate and {ostomy_acceptance}% patient ostomy self-care in by managing colorectal surgery nursing for {patients} patients per shift.
- **C (Impact-led):** Achieved {eras}% ERAS adherence rate and {ostomy_acceptance}% patient ostomy self-care in; managed colorectal surgery nursing for {patients} patients per shift incl.
- **D (Concise):** Managed colorectal surgery nursing for {patients} patients per , achieving {eras}% eras adherence rate and {ostomy_acceptance}% patient ostomy se.

**Variables:**
  - `{patients}`: 4 to 10, step 2 (integer)
  - `{ostomy}`: 1 to 4, step 1 (integer)
  - `{eras}`: 88 to 99, step 2 (percentage)
  - `{ostomy_acceptance}`: 85 to 99, step 2 (percentage)

### HLTH-0214
**Role:** health-admin | **Theme:** health-equity | **Seniority:** senior | **Verb Context:** operations
**Keywords:** health equity, disparities reduction, DEI, social determinants, equity data, CLAS standards

**Scope:** health equity program for a {bed}-bed health system, identifying {disparities} health disparities in {conditions} condition cohorts and implementing {interventions} equity interventions
**Result:** reducing identified health disparity gaps by {gap}% within {months} months and achieving {clas}% CLAS standards adherence

**Variations:**
- **A (Standard):** Managed health equity program for a {bed}-bed health system, identifying , reducing identified health disparity gaps by {gap}% within {months} months and achieving {clas}% CLAS standards adherence.
- **B (Result-first):** Reduced identified health disparity gaps by {gap}% within {months} months and Achieved { by managing health equity program for a {bed}-bed health system, identif.
- **C (Impact-led):** Reduced identified health disparity gaps by {gap}% within {months} months and Achieved {; managed health equity program for a {bed}-bed health system, identifying .
- **D (Concise):** Managed health equity program for a {bed}-bed health system, id, reducing identified health disparity gaps by {gap}% within {months} months and a.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{disparities}`: 5 to 20, step 5 (integer)
  - `{conditions}`: 3 to 10, step 1 (integer)
  - `{interventions}`: 3 to 10, step 1 (integer)
  - `{gap}`: 20 to 50, step 5 (percentage)
  - `{months}`: 12 to 36, step 6 (integer)
  - `{clas}`: 80 to 100, step 5 (percentage)

### HLTH-0215
**Role:** doctor | **Theme:** plastic-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** plastic surgery, reconstructive surgery, hand surgery, microsurgery, aesthetic surgery, flap reconstruction

**Scope:** plastic surgery practice with {patients} clinic patients per week and {surgeries} reconstructive and aesthetic surgeries per month
**Result:** achieving {complication}% surgical complication rate below national benchmark and {satisfaction}% patient-reported outcome satisfaction at 6 months

**Variations:**
- **A (Standard):** Managed plastic surgery practice with {patients} clinic patients per week, achieving {complication}% surgical complication rate below national benchmark and {satisfaction}% patient-reported outcome satisfaction at 6 months.
- **B (Result-first):** Achieved {complication}% surgical complication rate below national benchmark and {satisfa by managing plastic surgery practice with {patients} clinic patients per.
- **C (Impact-led):** Achieved {complication}% surgical complication rate below national benchmark and {satisfa; managed plastic surgery practice with {patients} clinic patients per week.
- **D (Concise):** Managed plastic surgery practice with {patients} clinic patient, achieving {complication}% surgical complication rate below national benchmark an.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{surgeries}`: 15 to 40, step 5 (integer)
  - `{complication}`: 3 to 8, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0216
**Role:** registered-nurse | **Theme:** GYN-oncology | **Seniority:** senior | **Verb Context:** people
**Keywords:** gynecologic oncology, ovarian cancer, cervical cancer, hysterectomy, brachytherapy, pelvic surgery

**Scope:** gynecologic oncology nursing for {patients} patients per shift across inpatient surgical and medical oncology management for {cancer_types} GYN cancer types
**Result:** achieving {satisfaction}% patient satisfaction and {chemo_completion}% chemotherapy course completion rate among enrolled patients

**Variations:**
- **A (Standard):** Managed gynecologic oncology nursing for {patients} patients per shift ac, achieving {satisfaction}% patient satisfaction and {chemo_completion}% chemotherapy course completion rate among enrolled patients.
- **B (Result-first):** Achieved {satisfaction}% patient satisfaction and {chemo_completion}% chemotherapy course by managing gynecologic oncology nursing for {patients} patients per shi.
- **C (Impact-led):** Achieved {satisfaction}% patient satisfaction and {chemo_completion}% chemotherapy course; managed gynecologic oncology nursing for {patients} patients per shift ac.
- **D (Concise):** Managed gynecologic oncology nursing for {patients} patients pe, achieving {satisfaction}% patient satisfaction and {chemo_completion}% chemother.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{cancer_types}`: 4 to 6, step 1 (integer)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)
  - `{chemo_completion}`: 88 to 99, step 2 (percentage)

### HLTH-0217
**Role:** registered-nurse | **Theme:** radiology-nursing | **Seniority:** mid | **Verb Context:** operations
**Keywords:** radiology nursing, contrast administration, CT sedation, MRI safety, procedure nursing, interventional radiology

**Scope:** radiology nursing support for {patients} patients per shift receiving IV contrast, moderate sedation, or anxiolysis for {modalities} imaging modalities
**Result:** achieving {reaction}% contrast reaction identification and management rate and {sedation}% safe sedation completion rate

**Variations:**
- **A (Standard):** Managed radiology nursing support for {patients} patients per shift recei, achieving {reaction}% contrast reaction identification and management rate and {sedation}% safe sedation completion rate.
- **B (Result-first):** Achieved {reaction}% contrast reaction identification and management rate and {sedation}% by managing radiology nursing support for {patients} patients per shift .
- **C (Impact-led):** Achieved {reaction}% contrast reaction identification and management rate and {sedation}%; managed radiology nursing support for {patients} patients per shift recei.
- **D (Concise):** Managed radiology nursing support for {patients} patients per s, achieving {reaction}% contrast reaction identification and management rate and {.

**Variables:**
  - `{patients}`: 15 to 40, step 5 (integer)
  - `{modalities}`: 3 to 6, step 1 (integer)
  - `{reaction}`: 100 to 100, step 0 (percentage)
  - `{sedation}`: 100 to 100, step 0 (percentage)

### HLTH-0218
**Role:** health-admin | **Theme:** labor-relations | **Seniority:** senior | **Verb Context:** operations
**Keywords:** labor relations, union contract, collective bargaining, grievance management, NLRA, workforce relations

**Scope:** labor relations program for a {bed}-bed unionized health system with {contracts} collective bargaining agreements covering {union_staff}K unionized employees
**Result:** successfully renegotiating {contracts_neg} labor contracts and reducing formal grievance filings from {before} to {after} per year

**Variations:**
- **A (Standard):** Managed labor relations program for a {bed}-bed unionized health system w, successfully renegotiating {contracts_neg} labor contracts and reducing formal grievance filings from {before} to {after} per year.
- **B (Result-first):** successfully renegotiating {contracts_neg} labor contracts and Reduced formal grievance f by managing labor relations program for a {bed}-bed unionized health sys.
- **C (Impact-led):** successfully renegotiating {contracts_neg} labor contracts and Reduced formal grievance f; managed labor relations program for a {bed}-bed unionized health system w.
- **D (Concise):** Managed labor relations program for a {bed}-bed unionized healt, successfully renegotiating {contracts_neg} labor contracts and reducing formal g.

**Variables:**
  - `{bed}`: 200 to 2000, step 100 (integer)
  - `{contracts}`: 2 to 8, step 1 (integer)
  - `{union_staff}`: 1 to 20, step 1 (integer)
  - `{contracts_neg}`: 1 to 4, step 1 (integer)
  - `{before}`: 50 to 200, step 25 (integer)
  - `{after}`: 10 to 40, step 5 (integer)

### HLTH-0219
**Role:** registered-nurse | **Theme:** spinal-cord-injury | **Seniority:** senior | **Verb Context:** people
**Keywords:** spinal cord injury, SCI, autonomic dysreflexia, neurogenic bladder, pressure injury, SCI rehab

**Scope:** spinal cord injury rehabilitation nursing for {patients} patients per shift on a {bed}-bed SCI unit, managing {autonomic} autonomic dysreflexia episodes per month and {bladder} neurogenic bladder programs
**Result:** achieving {pi}% pressure injury prevention rate and {discharge}% discharge-to-community rate for SCI patients

**Variations:**
- **A (Standard):** Managed spinal cord injury rehabilitation nursing for {patients} patients, achieving {pi}% pressure injury prevention rate and {discharge}% discharge-to-community rate for SCI patients.
- **B (Result-first):** Achieved {pi}% pressure injury prevention rate and {discharge}% discharge-to-community ra by managing spinal cord injury rehabilitation nursing for {patients} pat.
- **C (Impact-led):** Achieved {pi}% pressure injury prevention rate and {discharge}% discharge-to-community ra; managed spinal cord injury rehabilitation nursing for {patients} patients.
- **D (Concise):** Managed spinal cord injury rehabilitation nursing for {patients, achieving {pi}% pressure injury prevention rate and {discharge}% discharge-to-co.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{bed}`: 20 to 40, step 5 (integer)
  - `{autonomic}`: 3 to 10, step 1 (integer)
  - `{bladder}`: 4 to 8, step 1 (integer)
  - `{pi}`: 85 to 99, step 2 (percentage)
  - `{discharge}`: 55 to 82, step 5 (percentage)

### HLTH-0220
**Role:** health-admin | **Theme:** ambulatory-operations | **Seniority:** mid | **Verb Context:** operations
**Keywords:** ambulatory care management, clinic operations, physician practice management, outpatient operations, practice administrator

**Scope:** ambulatory operations for {practices} outpatient practices across {specialties} specialties with {providers} providers and {visits}K annual visits
**Result:** improving practice net promoter score from {nps_before} to {nps_after} and growing same-day appointment availability from {same_before}% to {same_after}%

**Variations:**
- **A (Standard):** Managed ambulatory operations for {practices} outpatient practices across, improving practice net promoter score from {nps_before} to {nps_after} and growing same-day appointment availability from {same_before}% to {same_after}%.
- **B (Result-first):** Improved practice net promoter score from {nps_before} to {nps_after} and growing same-da by managing ambulatory operations for {practices} outpatient practices a.
- **C (Impact-led):** Improved practice net promoter score from {nps_before} to {nps_after} and growing same-da; managed ambulatory operations for {practices} outpatient practices across.
- **D (Concise):** Managed ambulatory operations for {practices} outpatient practi, improving practice net promoter score from {nps_before} to {nps_after} and growi.

**Variables:**
  - `{practices}`: 2 to 10, step 1 (integer)
  - `{specialties}`: 3 to 10, step 1 (integer)
  - `{providers}`: 5 to 30, step 5 (integer)
  - `{visits}`: 10 to 200, step 10 (integer)
  - `{nps_before}`: 30 to 50, step 5 (integer)
  - `{nps_after}`: 60 to 85, step 5 (integer)
  - `{same_before}`: 10 to 25, step 5 (percentage)
  - `{same_after}`: 30 to 60, step 5 (percentage)

### HLTH-0221
**Role:** registered-nurse | **Theme:** coagulation-nursing | **Seniority:** mid | **Verb Context:** operations
**Keywords:** anticoagulation clinic, warfarin management, INR monitoring, anticoagulation nursing, thrombosis, DOAC management

**Scope:** anticoagulation clinic nursing for {patients} patients per week managing warfarin and DOAC therapy across {indications} anticoagulation indications
**Result:** achieving {ttr}% time in therapeutic range for warfarin patients and {adverse}% major bleeding event rate below national anticoagulation benchmark

**Variations:**
- **A (Standard):** Managed anticoagulation clinic nursing for {patients} patients per week m, achieving {ttr}% time in therapeutic range for warfarin patients and {adverse}% major bleeding event rate below national anticoagulation benchmark.
- **B (Result-first):** Achieved {ttr}% time in therapeutic range for warfarin patients and {adverse}% major blee by managing anticoagulation clinic nursing for {patients} patients per w.
- **C (Impact-led):** Achieved {ttr}% time in therapeutic range for warfarin patients and {adverse}% major blee; managed anticoagulation clinic nursing for {patients} patients per week m.
- **D (Concise):** Managed anticoagulation clinic nursing for {patients} patients , achieving {ttr}% time in therapeutic range for warfarin patients and {adverse}% .

**Variables:**
  - `{patients}`: 50 to 200, step 25 (integer)
  - `{indications}`: 3 to 8, step 1 (integer)
  - `{ttr}`: 65 to 85, step 5 (percentage)
  - `{adverse}`: 1 to 4, step 0.5 (percentage)

### HLTH-0222
**Role:** health-admin | **Theme:** clinical-contract-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** clinical contracts, professional services agreements, medical directorships, physician agreements, contract administration

**Scope:** clinical professional services and physician agreement management for {physicians} contracted physicians across {specialties} specialties, overseeing ${value}M in total contract value
**Result:** achieving {compliance}% contract compliance rate and reducing physician agreement renewal turnaround from {before} to {after} days

**Variations:**
- **A (Standard):** Managed clinical professional services and physician agreement management, achieving {compliance}% contract compliance rate and reducing physician agreement renewal turnaround from {before} to {after} days.
- **B (Result-first):** Achieved {compliance}% contract compliance rate and Reduced physician agreement renewal  by managing clinical professional services and physician agreement manag.
- **C (Impact-led):** Achieved {compliance}% contract compliance rate and Reduced physician agreement renewal ; managed clinical professional services and physician agreement management.
- **D (Concise):** Managed clinical professional services and physician agreement , achieving {compliance}% contract compliance rate and reducing physician agreemen.

**Variables:**
  - `{physicians}`: 50 to 500, step 50 (integer)
  - `{specialties}`: 5 to 20, step 5 (integer)
  - `{value}`: 5 to 100, step 5 (currency)
  - `{compliance}`: 90 to 100, step 2 (percentage)
  - `{before}`: 60 to 120, step 15 (integer)
  - `{after}`: 20 to 45, step 5 (integer)

### HLTH-0223
**Role:** registered-nurse | **Theme:** neurosurgery | **Seniority:** mid | **Verb Context:** people
**Keywords:** neurosurgery nursing, craniotomy, VP shunt, spinal surgery, ICP monitoring, neurosurgical care

**Scope:** neurosurgery nursing for {patients} patients per shift post-craniotomy and spinal surgery, managing {icps} ICP monitors and {evds} EVDs with {neuro_checks} neuro checks per shift
**Result:** achieving {deterioration}% neurological deterioration identification rate within {minutes} minutes of onset and {protocol}% post-op neurosurgery protocol adherence

**Variations:**
- **A (Standard):** Managed neurosurgery nursing for {patients} patients per shift post-crani, achieving {deterioration}% neurological deterioration identification rate within {minutes} minutes of onset and {protocol}% post-op neurosurgery protocol adherence.
- **B (Result-first):** Achieved {deterioration}% neurological deterioration identification rate within {minutes} by managing neurosurgery nursing for {patients} patients per shift post-.
- **C (Impact-led):** Achieved {deterioration}% neurological deterioration identification rate within {minutes}; managed neurosurgery nursing for {patients} patients per shift post-crani.
- **D (Concise):** Managed neurosurgery nursing for {patients} patients per shift , achieving {deterioration}% neurological deterioration identification rate within.

**Variables:**
  - `{patients}`: 4 to 8, step 1 (integer)
  - `{icps}`: 1 to 4, step 1 (integer)
  - `{evds}`: 1 to 4, step 1 (integer)
  - `{neuro_checks}`: 8 to 20, step 4 (integer)
  - `{deterioration}`: 100 to 100, step 0 (percentage)
  - `{minutes}`: 15 to 30, step 5 (integer)
  - `{protocol}`: 97 to 100, step 1 (percentage)

### HLTH-0224
**Role:** doctor | **Theme:** vascular-surgery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** vascular surgery, AAA repair, carotid endarterectomy, EVAR, peripheral vascular disease, bypass surgery

**Scope:** vascular surgery practice with {patients} clinic patients per week and {surgeries} vascular procedures per month including open and endovascular repairs
**Result:** achieving {patency}% 1-year primary patency rate for lower extremity bypass and {mace}% perioperative MACE rate below SVS benchmark

**Variations:**
- **A (Standard):** Managed vascular surgery practice with {patients} clinic patients per wee, achieving {patency}% 1-year primary patency rate for lower extremity bypass and {mace}% perioperative MACE rate below SVS benchmark.
- **B (Result-first):** Achieved {patency}% 1-year primary patency rate for lower extremity bypass and {mace}% pe by managing vascular surgery practice with {patients} clinic patients pe.
- **C (Impact-led):** Achieved {patency}% 1-year primary patency rate for lower extremity bypass and {mace}% pe; managed vascular surgery practice with {patients} clinic patients per wee.
- **D (Concise):** Managed vascular surgery practice with {patients} clinic patien, achieving {patency}% 1-year primary patency rate for lower extremity bypass and .

**Variables:**
  - `{patients}`: 20 to 40, step 5 (integer)
  - `{surgeries}`: 15 to 35, step 5 (integer)
  - `{patency}`: 75 to 92, step 5 (percentage)
  - `{mace}`: 2 to 6, step 1 (percentage)

### HLTH-0225
**Role:** registered-nurse | **Theme:** pre-op-cardiac | **Seniority:** mid | **Verb Context:** operations
**Keywords:** cardiac pre-op, cardiac surgery pre-operative, open heart surgery, CABG pre-op, cardiac nursing, pre-operative cardiac assessment

**Scope:** pre-operative nursing assessments for {patients} cardiac surgery patients per week undergoing CABG, valve repair, and hybrid procedures
**Result:** achieving {cancel}% day-of-surgery cancellation rate below benchmark and {satisfaction}% patient satisfaction with pre-operative education

**Variations:**
- **A (Standard):** Managed pre-operative nursing assessments for {patients} cardiac surgery , achieving {cancel}% day-of-surgery cancellation rate below benchmark and {satisfaction}% patient satisfaction with pre-operative education.
- **B (Result-first):** Achieved {cancel}% day-of-surgery cancellation rate below benchmark and {satisfaction}% p by managing pre-operative nursing assessments for {patients} cardiac sur.
- **C (Impact-led):** Achieved {cancel}% day-of-surgery cancellation rate below benchmark and {satisfaction}% p; managed pre-operative nursing assessments for {patients} cardiac surgery .
- **D (Concise):** Managed pre-operative nursing assessments for {patients} cardia, achieving {cancel}% day-of-surgery cancellation rate below benchmark and {satisf.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{cancel}`: 3 to 8, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0226
**Role:** health-admin | **Theme:** case-mix | **Seniority:** senior | **Verb Context:** systems
**Keywords:** case mix index, CMI, DRG management, documentation accuracy, coding compliance, revenue cycle

**Scope:** case mix and documentation accuracy program for a {bed}-bed hospital reviewing {records}K records per month with {cdi} CDI specialists and {coders} inpatient coders
**Result:** improving case mix index from {cmi_before} to {cmi_after} and increasing appropriate CC/MCC capture from {cc_before}% to {cc_after}%

**Variations:**
- **A (Standard):** Managed case mix and documentation accuracy program for a {bed}-bed hospi, improving case mix index from {cmi_before} to {cmi_after} and increasing appropriate CC/MCC capture from {cc_before}% to {cc_after}%.
- **B (Result-first):** Improved case mix index from {cmi_before} to {cmi_after} and increasing appropriate CC/MC by managing case mix and documentation accuracy program for a {bed}-bed .
- **C (Impact-led):** Improved case mix index from {cmi_before} to {cmi_after} and increasing appropriate CC/MC; managed case mix and documentation accuracy program for a {bed}-bed hospi.
- **D (Concise):** Managed case mix and documentation accuracy program for a {bed}, improving case mix index from {cmi_before} to {cmi_after} and increasing appropr.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{records}`: 1 to 20, step 1 (integer)
  - `{cdi}`: 3 to 15, step 3 (integer)
  - `{coders}`: 5 to 20, step 5 (integer)
  - `{cmi_before}`: 1.5 to 1.8, step 0.1 (integer)
  - `{cmi_after}`: 1.9 to 2.3, step 0.1 (integer)
  - `{cc_before}`: 45 to 60, step 5 (percentage)
  - `{cc_after}`: 65 to 82, step 5 (percentage)

### HLTH-0227
**Role:** registered-nurse | **Theme:** HIV-PrEP | **Seniority:** junior | **Verb Context:** people
**Keywords:** PrEP, HIV prevention, pre-exposure prophylaxis, sexual health, STI screening, HIV nursing

**Scope:** HIV prevention nursing services for {patients} patients per month including PrEP initiation, adherence counseling, and {sti} STI screenings per week
**Result:** achieving {sti_screening}% quarterly STI screening completion rate and {adherence}% PrEP medication adherence at 6 months

**Variations:**
- **A (Standard):** Managed hiv prevention nursing services for {patients} patients per month, achieving {sti_screening}% quarterly STI screening completion rate and {adherence}% PrEP medication adherence at 6 months.
- **B (Result-first):** Achieved {sti_screening}% quarterly STI screening completion rate and {adherence}% PrEP m by managing hiv prevention nursing services for {patients} patients per .
- **C (Impact-led):** Achieved {sti_screening}% quarterly STI screening completion rate and {adherence}% PrEP m; managed hiv prevention nursing services for {patients} patients per month.
- **D (Concise):** Managed hiv prevention nursing services for {patients} patients, achieving {sti_screening}% quarterly sti screening completion rate and {adherenc.

**Variables:**
  - `{patients}`: 50 to 200, step 25 (integer)
  - `{sti}`: 20 to 80, step 10 (integer)
  - `{sti_screening}`: 85 to 99, step 2 (percentage)
  - `{adherence}`: 75 to 96, step 5 (percentage)

### HLTH-0228
**Role:** doctor | **Theme:** allergy-immunology | **Seniority:** mid | **Verb Context:** people
**Keywords:** allergy, immunotherapy, allergic rhinitis, asthma, food allergy, anaphylaxis, immunodeficiency

**Scope:** allergy and immunology panel of {patients} patients per week delivering {shots} allergen immunotherapy injections and {ig} subcutaneous IgG infusions per month
**Result:** achieving {remission}% sustained unresponsiveness rate for food allergy OIT patients and {asthma_control}% well-controlled asthma rate at follow-up

**Variations:**
- **A (Standard):** Managed allergy and immunology panel of {patients} patients per week deli, achieving {remission}% sustained unresponsiveness rate for food allergy OIT patients and {asthma_control}% well-controlled asthma rate at follow-up.
- **B (Result-first):** Achieved {remission}% sustained unresponsiveness rate for food allergy OIT patients and { by managing allergy and immunology panel of {patients} patients per week.
- **C (Impact-led):** Achieved {remission}% sustained unresponsiveness rate for food allergy OIT patients and {; managed allergy and immunology panel of {patients} patients per week deli.
- **D (Concise):** Managed allergy and immunology panel of {patients} patients per, achieving {remission}% sustained unresponsiveness rate for food allergy oit pati.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{shots}`: 100 to 500, step 50 (integer)
  - `{ig}`: 20 to 80, step 10 (integer)
  - `{remission}`: 50 to 75, step 5 (percentage)
  - `{asthma_control}`: 70 to 92, step 5 (percentage)

### HLTH-0229
**Role:** registered-nurse | **Theme:** GI-nursing-specialist | **Seniority:** senior | **Verb Context:** operations
**Keywords:** gastrointestinal nursing, IBD, crohn, ulcerative colitis, biologic therapy, GI specialty nursing

**Scope:** GI specialty nursing for {patients} IBD and complex GI patients per week, coordinating {biologic} biologic therapy infusions and {education} patient education sessions per month
**Result:** achieving {remission}% IBD clinical remission rate at 12 months and {adherence}% biologic therapy adherence rate

**Variations:**
- **A (Standard):** Managed gi specialty nursing for {patients} ibd and complex gi patients p, achieving {remission}% IBD clinical remission rate at 12 months and {adherence}% biologic therapy adherence rate.
- **B (Result-first):** Achieved {remission}% IBD clinical remission rate at 12 months and {adherence}% biologic  by managing gi specialty nursing for {patients} ibd and complex gi patie.
- **C (Impact-led):** Achieved {remission}% IBD clinical remission rate at 12 months and {adherence}% biologic ; managed gi specialty nursing for {patients} ibd and complex gi patients p.
- **D (Concise):** Managed gi specialty nursing for {patients} ibd and complex gi , achieving {remission}% ibd clinical remission rate at 12 months and {adherence}%.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{biologic}`: 10 to 40, step 5 (integer)
  - `{education}`: 10 to 30, step 5 (integer)
  - `{remission}`: 55 to 80, step 5 (percentage)
  - `{adherence}`: 85 to 99, step 2 (percentage)

### HLTH-0230
**Role:** health-admin | **Theme:** insurance-billing | **Seniority:** junior | **Verb Context:** operations
**Keywords:** medical billing, insurance billing, claims processing, remittance, ERA, explanation of benefits

**Scope:** insurance billing for {claims}K claims per month across {payers} payers, posting {remittances}K remittance advices and working {denials} denied claims per week
**Result:** achieving {clean}% clean claim submission rate and reducing average days in accounts receivable from {before} to {after}

**Variations:**
- **A (Standard):** Managed insurance billing for {claims}k claims per month across {payers} , achieving {clean}% clean claim submission rate and reducing average days in accounts receivable from {before} to {after}.
- **B (Result-first):** Achieved {clean}% clean claim submission rate and Reduced average days in accounts recei by managing insurance billing for {claims}k claims per month across {pay.
- **C (Impact-led):** Achieved {clean}% clean claim submission rate and Reduced average days in accounts recei; managed insurance billing for {claims}k claims per month across {payers} .
- **D (Concise):** Managed insurance billing for {claims}k claims per month across, achieving {clean}% clean claim submission rate and reducing average days in acco.

**Variables:**
  - `{claims}`: 5 to 50, step 5 (integer)
  - `{payers}`: 5 to 20, step 5 (integer)
  - `{remittances}`: 1 to 20, step 1 (integer)
  - `{denials}`: 20 to 100, step 10 (integer)
  - `{clean}`: 90 to 99, step 1 (percentage)
  - `{before}`: 50 to 80, step 5 (integer)
  - `{after}`: 25 to 40, step 5 (integer)

### HLTH-0231
**Role:** registered-nurse | **Theme:** ketamine-infusion | **Seniority:** mid | **Verb Context:** operations
**Keywords:** ketamine infusion, infusion therapy, refractory depression, chronic pain, ketamine nursing, subanesthetic ketamine

**Scope:** ketamine infusion therapy for {patients} patients per month for refractory depression and chronic pain, monitoring {parameters} hemodynamic and psychological parameters per {duration}-hour infusion
**Result:** achieving {response}% treatment responder rate at 2 weeks and {completion}% infusion series completion rate

**Variations:**
- **A (Standard):** Managed ketamine infusion therapy for {patients} patients per month for r, achieving {response}% treatment responder rate at 2 weeks and {completion}% infusion series completion rate.
- **B (Result-first):** Achieved {response}% treatment responder rate at 2 weeks and {completion}% infusion serie by managing ketamine infusion therapy for {patients} patients per month .
- **C (Impact-led):** Achieved {response}% treatment responder rate at 2 weeks and {completion}% infusion serie; managed ketamine infusion therapy for {patients} patients per month for r.
- **D (Concise):** Managed ketamine infusion therapy for {patients} patients per m, achieving {response}% treatment responder rate at 2 weeks and {completion}% infu.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{parameters}`: 5 to 10, step 1 (integer)
  - `{duration}`: 1 to 4, step 1 (integer)
  - `{response}`: 55 to 80, step 5 (percentage)
  - `{completion}`: 85 to 99, step 2 (percentage)

### HLTH-0232
**Role:** health-admin | **Theme:** food-service | **Seniority:** mid | **Verb Context:** operations
**Keywords:** hospital food service, patient meal service, therapeutic diets, food safety, patient satisfaction, nutrition services

**Scope:** hospital food service operations for a {bed}-bed facility serving {meals}K patient meals per day across {diet_types} therapeutic diet types
**Result:** achieving {satisfaction}% patient meal satisfaction score and maintaining {food_safety}% food safety audit compliance

**Variations:**
- **A (Standard):** Managed hospital food service operations for a {bed}-bed facility serving, achieving {satisfaction}% patient meal satisfaction score and maintaining {food_safety}% food safety audit compliance.
- **B (Result-first):** Achieved {satisfaction}% patient meal satisfaction score and Maintained {food_safety}% f by managing hospital food service operations for a {bed}-bed facility se.
- **C (Impact-led):** Achieved {satisfaction}% patient meal satisfaction score and Maintained {food_safety}% f; managed hospital food service operations for a {bed}-bed facility serving.
- **D (Concise):** Managed hospital food service operations for a {bed}-bed facili, achieving {satisfaction}% patient meal satisfaction score and maintaining {food_.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{meals}`: 1 to 10, step 1 (integer)
  - `{diet_types}`: 10 to 30, step 5 (integer)
  - `{satisfaction}`: 82 to 96, step 2 (percentage)
  - `{food_safety}`: 95 to 100, step 1 (percentage)

### HLTH-0233
**Role:** registered-nurse | **Theme:** virtual-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** virtual nursing, virtual care, hybrid nursing, remote nursing, virtual patient monitoring, digital nursing

**Scope:** virtual nursing services monitoring {patients} patients per shift across {units} units using remote video platforms, conducting {assessments} assessments and {discharges} discharge education sessions
**Result:** reducing bedside RN documentation burden by {doc_reduction}% per shift and achieving {satisfaction}% virtual nursing patient satisfaction score

**Variations:**
- **A (Standard):** Managed virtual nursing services monitoring {patients} patients per shift, reducing bedside RN documentation burden by {doc_reduction}% per shift and achieving {satisfaction}% virtual nursing patient satisfaction score.
- **B (Result-first):** Reduced bedside RN documentation burden by {doc_reduction}% per shift and Achieved {sati by managing virtual nursing services monitoring {patients} patients per .
- **C (Impact-led):** Reduced bedside RN documentation burden by {doc_reduction}% per shift and Achieved {sati; managed virtual nursing services monitoring {patients} patients per shift.
- **D (Concise):** Managed virtual nursing services monitoring {patients} patients, reducing bedside rn documentation burden by {doc_reduction}% per shift and achie.

**Variables:**
  - `{patients}`: 20 to 60, step 10 (integer)
  - `{units}`: 5 to 20, step 5 (integer)
  - `{assessments}`: 20 to 60, step 10 (integer)
  - `{discharges}`: 5 to 20, step 5 (integer)
  - `{doc_reduction}`: 20 to 50, step 5 (percentage)
  - `{satisfaction}`: 85 to 99, step 2 (percentage)

### HLTH-0234
**Role:** doctor | **Theme:** PM&R | **Seniority:** mid | **Verb Context:** people
**Keywords:** physical medicine and rehabilitation, PM&R, spinal cord injury, TBI, stroke rehab, electrodiagnostics

**Scope:** PM&R panel of {patients} patients per week including {inpatient} inpatient rehab consultations and {edx} electrodiagnostic studies per month
**Result:** achieving {fim_improvement}% average FIM score improvement for inpatient rehab patients and {discharge_home}% discharge-to-community rate

**Variations:**
- **A (Standard):** Managed pm&r panel of {patients} patients per week including {inpatient} , achieving {fim_improvement}% average FIM score improvement for inpatient rehab patients and {discharge_home}% discharge-to-community rate.
- **B (Result-first):** Achieved {fim_improvement}% average FIM score improvement for inpatient rehab patients an by managing pm&r panel of {patients} patients per week including {inpati.
- **C (Impact-led):** Achieved {fim_improvement}% average FIM score improvement for inpatient rehab patients an; managed pm&r panel of {patients} patients per week including {inpatient} .
- **D (Concise):** Managed pm&r panel of {patients} patients per week including {i, achieving {fim_improvement}% average fim score improvement for inpatient rehab p.

**Variables:**
  - `{patients}`: 20 to 50, step 5 (integer)
  - `{inpatient}`: 10 to 30, step 5 (integer)
  - `{edx}`: 10 to 40, step 5 (integer)
  - `{fim_improvement}`: 55 to 82, step 5 (percentage)
  - `{discharge_home}`: 60 to 88, step 5 (percentage)

### HLTH-0235
**Role:** registered-nurse | **Theme:** pre-surgical-screening | **Seniority:** junior | **Verb Context:** operations
**Keywords:** pre-surgical screening, pre-op telephone, surgical pre-admission testing, risk stratification, pre-op assessment

**Scope:** pre-surgical telephone screening for {patients} patients per day, stratifying {risk_levels} surgical risk levels and coordinating {clearances} clearance visits for high-risk patients
**Result:** achieving {cancel}% day-of-surgery cancellation reduction and {documentation}% pre-op documentation accuracy rate

**Variations:**
- **A (Standard):** Managed pre-surgical telephone screening for {patients} patients per day, achieving {cancel}% day-of-surgery cancellation reduction and {documentation}% pre-op documentation accuracy rate.
- **B (Result-first):** Achieved {cancel}% day-of-surgery cancellation reduction and {documentation}% pre-op docu by managing pre-surgical telephone screening for {patients} patients per.
- **C (Impact-led):** Achieved {cancel}% day-of-surgery cancellation reduction and {documentation}% pre-op docu; managed pre-surgical telephone screening for {patients} patients per day.
- **D (Concise):** Managed pre-surgical telephone screening for {patients} patient, achieving {cancel}% day-of-surgery cancellation reduction and {documentation}% p.

**Variables:**
  - `{patients}`: 30 to 80, step 10 (integer)
  - `{risk_levels}`: 3 to 5, step 1 (integer)
  - `{clearances}`: 10 to 40, step 5 (integer)
  - `{cancel}`: 20 to 50, step 5 (percentage)
  - `{documentation}`: 97 to 100, step 1 (percentage)

### HLTH-0236
**Role:** health-admin | **Theme:** medical-education | **Seniority:** senior | **Verb Context:** operations
**Keywords:** graduate medical education, GME, residency training, ACGME, Designated Institutional Official, DIO

**Scope:** graduate medical education program with {residents} residents and {fellows} fellows across {programs} ACGME-accredited programs
**Result:** achieving {accreditation}% program accreditation with no citations and improving resident satisfaction from {before} to {after}/5 on the ACGME survey

**Variations:**
- **A (Standard):** Managed graduate medical education program with {residents} residents and, achieving {accreditation}% program accreditation with no citations and improving resident satisfaction from {before} to {after}/5 on the ACGME survey.
- **B (Result-first):** Achieved {accreditation}% program accreditation with no citations and Improved resident  by managing graduate medical education program with {residents} resident.
- **C (Impact-led):** Achieved {accreditation}% program accreditation with no citations and Improved resident ; managed graduate medical education program with {residents} residents and.
- **D (Concise):** Managed graduate medical education program with {residents} res, achieving {accreditation}% program accreditation with no citations and improving.

**Variables:**
  - `{residents}`: 50 to 500, step 50 (integer)
  - `{fellows}`: 10 to 100, step 10 (integer)
  - `{programs}`: 5 to 20, step 5 (integer)
  - `{accreditation}`: 95 to 100, step 1 (percentage)
  - `{before}`: 3 to 3.5, step 0.5 (integer)
  - `{after}`: 4 to 5, step 0.5 (integer)

### HLTH-0237
**Role:** registered-nurse | **Theme:** anti-infective-stewardship | **Seniority:** senior | **Verb Context:** operations
**Keywords:** antimicrobial stewardship, AMS, antibiotic stewardship, de-escalation, culture-based therapy, IDSA

**Scope:** antimicrobial stewardship nursing coordination for a {bed}-bed hospital reviewing {orders} antimicrobial orders per day and conducting {rounds} ID pharmacist rounds per week
**Result:** reducing broad-spectrum antibiotic utilization by {reduction}% per {admissions}K admissions and achieving {cdiff}% CDI rate reduction year-over-year

**Variations:**
- **A (Standard):** Managed antimicrobial stewardship nursing coordination for a {bed}-bed ho, reducing broad-spectrum antibiotic utilization by {reduction}% per {admissions}K admissions and achieving {cdiff}% CDI rate reduction year-over-year.
- **B (Result-first):** Reduced broad-spectrum antibiotic utilization by {reduction}% per {admissions}K admission by managing antimicrobial stewardship nursing coordination for a {bed}-b.
- **C (Impact-led):** Reduced broad-spectrum antibiotic utilization by {reduction}% per {admissions}K admission; managed antimicrobial stewardship nursing coordination for a {bed}-bed ho.
- **D (Concise):** Managed antimicrobial stewardship nursing coordination for a {b, reducing broad-spectrum antibiotic utilization by {reduction}% per {admissions}k.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{orders}`: 20 to 100, step 10 (integer)
  - `{rounds}`: 5 to 20, step 5 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)
  - `{admissions}`: 1 to 10, step 1 (integer)
  - `{cdiff}`: 15 to 40, step 5 (percentage)

### HLTH-0238
**Role:** doctor | **Theme:** critical-care | **Seniority:** senior | **Verb Context:** people
**Keywords:** critical care medicine, intensivist, ARDS, sepsis, hemodynamic monitoring, mechanical ventilation

**Scope:** intensive care unit coverage for a {bed}-bed ICU managing {admissions} monthly admissions including {sepsis} septic shock and {ards} ARDS patients
**Result:** achieving {sepsis_survival}% sepsis 30-day survival rate above APACHE benchmark and {bundle}% 1-hour sepsis bundle completion rate

**Variations:**
- **A (Standard):** Managed intensive care unit coverage for a {bed}-bed icu managing {admiss, achieving {sepsis_survival}% sepsis 30-day survival rate above APACHE benchmark and {bundle}% 1-hour sepsis bundle completion rate.
- **B (Result-first):** Achieved {sepsis_survival}% sepsis 30-day survival rate above APACHE benchmark and {bundl by managing intensive care unit coverage for a {bed}-bed icu managing {a.
- **C (Impact-led):** Achieved {sepsis_survival}% sepsis 30-day survival rate above APACHE benchmark and {bundl; managed intensive care unit coverage for a {bed}-bed icu managing {admiss.
- **D (Concise):** Managed intensive care unit coverage for a {bed}-bed icu managi, achieving {sepsis_survival}% sepsis 30-day survival rate above apache benchmark .

**Variables:**
  - `{bed}`: 10 to 30, step 5 (integer)
  - `{admissions}`: 30 to 100, step 10 (integer)
  - `{sepsis}`: 10 to 40, step 5 (integer)
  - `{ards}`: 5 to 20, step 5 (integer)
  - `{sepsis_survival}`: 70 to 90, step 5 (percentage)
  - `{bundle}`: 85 to 99, step 2 (percentage)

### HLTH-0239
**Role:** registered-nurse | **Theme:** autism-nursing | **Seniority:** mid | **Verb Context:** people
**Keywords:** autism, ASD, developmental disabilities, sensory accommodation, behavioral support, neurodiversity

**Scope:** nursing care for {patients} autistic patients per week across inpatient and outpatient settings, implementing {accommodations} sensory accommodation strategies and collaborating with {providers} ABA and behavioral health providers
**Result:** achieving {satisfaction}% family satisfaction score and reducing {restraint}% behavioral restraint use below unit benchmark

**Variations:**
- **A (Standard):** Managed nursing care for {patients} autistic patients per week across inp, achieving {satisfaction}% family satisfaction score and reducing {restraint}% behavioral restraint use below unit benchmark.
- **B (Result-first):** Achieved {satisfaction}% family satisfaction score and Reduced {restraint}% behavioral r by managing nursing care for {patients} autistic patients per week acros.
- **C (Impact-led):** Achieved {satisfaction}% family satisfaction score and Reduced {restraint}% behavioral r; managed nursing care for {patients} autistic patients per week across inp.
- **D (Concise):** Managed nursing care for {patients} autistic patients per week , achieving {satisfaction}% family satisfaction score and reducing {restraint}% be.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{accommodations}`: 5 to 15, step 5 (integer)
  - `{providers}`: 3 to 8, step 1 (integer)
  - `{satisfaction}`: 85 to 99, step 2 (percentage)
  - `{restraint}`: 2 to 10, step 1 (percentage)

### HLTH-0240
**Role:** health-admin | **Theme:** telehealth-operations | **Seniority:** mid | **Verb Context:** operations
**Keywords:** telehealth operations, virtual visit platform, telehealth workflow, virtual care coordinator, digital front door

**Scope:** telehealth operations for a {provider}-provider virtual care program with {visits}K monthly visits across {specialties} specialties and {states} licensed states
**Result:** achieving {completion}% virtual visit completion rate and reducing patient no-show rate from {no_show_before}% to {no_show_after}%

**Variations:**
- **A (Standard):** Managed telehealth operations for a {provider}-provider virtual care prog, achieving {completion}% virtual visit completion rate and reducing patient no-show rate from {no_show_before}% to {no_show_after}%.
- **B (Result-first):** Achieved {completion}% virtual visit completion rate and Reduced patient no-show rate fr by managing telehealth operations for a {provider}-provider virtual care.
- **C (Impact-led):** Achieved {completion}% virtual visit completion rate and Reduced patient no-show rate fr; managed telehealth operations for a {provider}-provider virtual care prog.
- **D (Concise):** Managed telehealth operations for a {provider}-provider virtual, achieving {completion}% virtual visit completion rate and reducing patient no-sh.

**Variables:**
  - `{provider}`: 20 to 200, step 20 (integer)
  - `{visits}`: 5 to 50, step 5 (integer)
  - `{specialties}`: 3 to 15, step 3 (integer)
  - `{states}`: 5 to 50, step 5 (integer)
  - `{completion}`: 88 to 99, step 2 (percentage)
  - `{no_show_before}`: 15 to 30, step 5 (percentage)
  - `{no_show_after}`: 5 to 10, step 1 (percentage)

### HLTH-0241
**Role:** registered-nurse | **Theme:** correctional-mental-health | **Seniority:** mid | **Verb Context:** people
**Keywords:** correctional mental health, jail nursing, prison psychiatry, mental health screening, crisis intervention, correctional healthcare

**Scope:** correctional mental health nursing for a {pop}-person facility, conducting {intakes} mental health screenings per month and managing {caseload} mental health treatment caseload patients
**Result:** achieving {screen}% intake mental health screening completion rate and reducing psychiatric emergency incidents by {crisis}% per quarter

**Variations:**
- **A (Standard):** Managed correctional mental health nursing for a {pop}-person facility, c, achieving {screen}% intake mental health screening completion rate and reducing psychiatric emergency incidents by {crisis}% per quarter.
- **B (Result-first):** Achieved {screen}% intake mental health screening completion rate and Reduced psychiatri by managing correctional mental health nursing for a {pop}-person facili.
- **C (Impact-led):** Achieved {screen}% intake mental health screening completion rate and Reduced psychiatri; managed correctional mental health nursing for a {pop}-person facility, c.
- **D (Concise):** Managed correctional mental health nursing for a {pop}-person f, achieving {screen}% intake mental health screening completion rate and reducing .

**Variables:**
  - `{pop}`: 500 to 3000, step 500 (integer)
  - `{intakes}`: 50 to 300, step 50 (integer)
  - `{caseload}`: 50 to 500, step 50 (integer)
  - `{screen}`: 95 to 100, step 1 (percentage)
  - `{crisis}`: 20 to 50, step 5 (percentage)

### HLTH-0242
**Role:** doctor | **Theme:** pain-medicine | **Seniority:** mid | **Verb Context:** people
**Keywords:** interventional pain, pain management, epidural steroid injection, nerve block, spinal cord stimulation, radiofrequency ablation

**Scope:** interventional pain management practice with {patients} clinic patients per week and {procedures} pain procedures per month including ESIs, nerve blocks, and RFA
**Result:** achieving {pain_reduction}% average VAS pain score reduction at 4 weeks post-procedure and {function}% functional improvement on PROMIS scores

**Variations:**
- **A (Standard):** Managed interventional pain management practice with {patients} clinic pa, achieving {pain_reduction}% average VAS pain score reduction at 4 weeks post-procedure and {function}% functional improvement on PROMIS scores.
- **B (Result-first):** Achieved {pain_reduction}% average VAS pain score reduction at 4 weeks post-procedure and by managing interventional pain management practice with {patients} clin.
- **C (Impact-led):** Achieved {pain_reduction}% average VAS pain score reduction at 4 weeks post-procedure and; managed interventional pain management practice with {patients} clinic pa.
- **D (Concise):** Managed interventional pain management practice with {patients}, achieving {pain_reduction}% average vas pain score reduction at 4 weeks post-pro.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{procedures}`: 30 to 80, step 10 (integer)
  - `{pain_reduction}`: 30 to 60, step 5 (percentage)
  - `{function}`: 25 to 55, step 5 (percentage)

### HLTH-0243
**Role:** registered-nurse | **Theme:** hemodialysis-home | **Seniority:** mid | **Verb Context:** people
**Keywords:** home hemodialysis, HHD, home dialysis training, patient training, ESRD, dialysis adequacy

**Scope:** home hemodialysis training and support for {patients} patients per month in a {session}-session training program, providing {follow_up} monthly follow-up contacts per patient
**Result:** achieving {independence}% patient independence in home HD machine operation within {weeks} weeks and {ktv}% Kt/V adequacy at 3-month assessment

**Variations:**
- **A (Standard):** Managed home hemodialysis training and support for {patients} patients pe, achieving {independence}% patient independence in home HD machine operation within {weeks} weeks and {ktv}% Kt/V adequacy at 3-month assessment.
- **B (Result-first):** Achieved {independence}% patient independence in home HD machine operation within {weeks} by managing home hemodialysis training and support for {patients} patien.
- **C (Impact-led):** Achieved {independence}% patient independence in home HD machine operation within {weeks}; managed home hemodialysis training and support for {patients} patients pe.
- **D (Concise):** Managed home hemodialysis training and support for {patients} p, achieving {independence}% patient independence in home hd machine operation with.

**Variables:**
  - `{patients}`: 5 to 20, step 5 (integer)
  - `{session}`: 8 to 16, step 4 (integer)
  - `{follow_up}`: 2 to 6, step 1 (integer)
  - `{independence}`: 85 to 99, step 2 (percentage)
  - `{weeks}`: 4 to 8, step 2 (integer)
  - `{ktv}`: 85 to 99, step 2 (percentage)

### HLTH-0244
**Role:** health-admin | **Theme:** system-integration | **Seniority:** senior | **Verb Context:** projects
**Keywords:** health system integration, merger integration, clinical integration, service line integration, system consolidation

**Scope:** clinical and operational integration across {facilities} newly merged facilities covering {beds} combined beds and {providers} providers in {service_lines} service lines
**Result:** completing {milestones}% of Year 1 integration milestones on schedule and generating ${synergies}M in first-year cost synergies

**Variations:**
- **A (Standard):** Managed clinical and operational integration across {facilities} newly me, completing {milestones}% of Year 1 integration milestones on schedule and generating ${synergies}M in first-year cost synergies.
- **B (Result-first):** completing {milestones}% of Year 1 integration milestones on schedule and Generated ${syn by managing clinical and operational integration across {facilities} new.
- **C (Impact-led):** completing {milestones}% of Year 1 integration milestones on schedule and Generated ${syn; managed clinical and operational integration across {facilities} newly me.
- **D (Concise):** Managed clinical and operational integration across {facilities, completing {milestones}% of year 1 integration milestones on schedule and genera.

**Variables:**
  - `{facilities}`: 2 to 8, step 1 (integer)
  - `{beds}`: 200 to 5000, step 200 (integer)
  - `{providers}`: 50 to 1000, step 50 (integer)
  - `{service_lines}`: 5 to 20, step 5 (integer)
  - `{milestones}`: 85 to 100, step 5 (percentage)
  - `{synergies}`: 1 to 50, step 1 (currency)

### HLTH-0245
**Role:** registered-nurse | **Theme:** post-bariatric | **Seniority:** junior | **Verb Context:** people
**Keywords:** bariatric surgery nursing, post-op bariatric, sleeve gastrectomy, bypass nursing, weight loss surgery, bariatric patient education

**Scope:** post-bariatric surgery nursing for {patients} patients per shift including {education} nutrition and activity education sessions and {complications} complication monitoring protocols
**Result:** achieving {readmit}% 30-day readmission rate below national bariatric benchmark and {satisfaction}% patient-reported satisfaction with surgical care

**Variations:**
- **A (Standard):** Managed post-bariatric surgery nursing for {patients} patients per shift , achieving {readmit}% 30-day readmission rate below national bariatric benchmark and {satisfaction}% patient-reported satisfaction with surgical care.
- **B (Result-first):** Achieved {readmit}% 30-day readmission rate below national bariatric benchmark and {satis by managing post-bariatric surgery nursing for {patients} patients per s.
- **C (Impact-led):** Achieved {readmit}% 30-day readmission rate below national bariatric benchmark and {satis; managed post-bariatric surgery nursing for {patients} patients per shift .
- **D (Concise):** Managed post-bariatric surgery nursing for {patients} patients , achieving {readmit}% 30-day readmission rate below national bariatric benchmark .

**Variables:**
  - `{patients}`: 4 to 10, step 2 (integer)
  - `{education}`: 4 to 10, step 2 (integer)
  - `{complications}`: 4 to 10, step 2 (integer)
  - `{readmit}`: 3 to 8, step 1 (percentage)
  - `{satisfaction}`: 88 to 99, step 2 (percentage)

### HLTH-0246
**Role:** doctor | **Theme:** dermatology | **Seniority:** mid | **Verb Context:** operations
**Keywords:** dermatology, skin cancer, Mohs surgery, biologic therapy, psoriasis, atopic dermatitis

**Scope:** dermatology panel of {patients} patients per day including {surgeries} Mohs and excisional surgeries and {biologics} biologic therapy patients per month
**Result:** achieving {clearance}% psoriasis skin clearance rate at 4 months for biologic therapy patients and {recurrence}% 5-year recurrence-free rate for treated melanomas

**Variations:**
- **A (Standard):** Managed dermatology panel of {patients} patients per day including {surge, achieving {clearance}% psoriasis skin clearance rate at 4 months for biologic therapy patients and {recurrence}% 5-year recurrence-free rate for treated melanomas.
- **B (Result-first):** Achieved {clearance}% psoriasis skin clearance rate at 4 months for biologic therapy pati by managing dermatology panel of {patients} patients per day including {.
- **C (Impact-led):** Achieved {clearance}% psoriasis skin clearance rate at 4 months for biologic therapy pati; managed dermatology panel of {patients} patients per day including {surge.
- **D (Concise):** Managed dermatology panel of {patients} patients per day includ, achieving {clearance}% psoriasis skin clearance rate at 4 months for biologic th.

**Variables:**
  - `{patients}`: 25 to 50, step 5 (integer)
  - `{surgeries}`: 5 to 20, step 5 (integer)
  - `{biologics}`: 20 to 80, step 10 (integer)
  - `{clearance}`: 75 to 95, step 5 (percentage)
  - `{recurrence}`: 85 to 98, step 2 (percentage)

### HLTH-0247
**Role:** registered-nurse | **Theme:** ICU-tracheostomy | **Seniority:** mid | **Verb Context:** operations
**Keywords:** tracheostomy care, trach nursing, decannulation, trach management, mechanical ventilation, weaning

**Scope:** tracheostomy management and decannulation program for {patients} tracheostomy patients per month, conducting {assessments} swallowing and secretion assessments and {trials} speaking valve trials
**Result:** achieving {decannulation}% successful decannulation rate within {weeks} weeks of trach assessment and {complications}% tracheostomy complication rate below benchmark

**Variations:**
- **A (Standard):** Managed tracheostomy management and decannulation program for {patients} , achieving {decannulation}% successful decannulation rate within {weeks} weeks of trach assessment and {complications}% tracheostomy complication rate below benchmark.
- **B (Result-first):** Achieved {decannulation}% successful decannulation rate within {weeks} weeks of trach ass by managing tracheostomy management and decannulation program for {patie.
- **C (Impact-led):** Achieved {decannulation}% successful decannulation rate within {weeks} weeks of trach ass; managed tracheostomy management and decannulation program for {patients} .
- **D (Concise):** Managed tracheostomy management and decannulation program for {, achieving {decannulation}% successful decannulation rate within {weeks} weeks of.

**Variables:**
  - `{patients}`: 10 to 30, step 5 (integer)
  - `{assessments}`: 10 to 30, step 5 (integer)
  - `{trials}`: 5 to 20, step 5 (integer)
  - `{decannulation}`: 50 to 80, step 5 (percentage)
  - `{weeks}`: 4 to 12, step 4 (integer)
  - `{complications}`: 3 to 10, step 1 (percentage)

### HLTH-0248
**Role:** health-admin | **Theme:** patient-transport | **Seniority:** mid | **Verb Context:** operations
**Keywords:** patient transport, patient logistics, internal transport, transport team, escort services, wheelchair services

**Scope:** patient transport operations for a {bed}-bed facility with {staff} transport staff managing {transports}K patient transport requests per month
**Result:** reducing average transport request response time from {before} to {after} minutes and achieving {satisfaction}% requesting department satisfaction score

**Variations:**
- **A (Standard):** Managed patient transport operations for a {bed}-bed facility with {staff, reducing average transport request response time from {before} to {after} minutes and achieving {satisfaction}% requesting department satisfaction score.
- **B (Result-first):** Reduced average transport request response time from {before} to {after} minutes and achi by managing patient transport operations for a {bed}-bed facility with {.
- **C (Impact-led):** Reduced average transport request response time from {before} to {after} minutes and achi; managed patient transport operations for a {bed}-bed facility with {staff.
- **D (Concise):** Managed patient transport operations for a {bed}-bed facility w, reducing average transport request response time from {before} to {after} minute.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{staff}`: 10 to 50, step 10 (integer)
  - `{transports}`: 1 to 20, step 1 (integer)
  - `{before}`: 20 to 45, step 5 (integer)
  - `{after}`: 8 to 15, step 2 (integer)
  - `{satisfaction}`: 85 to 99, step 2 (percentage)

### HLTH-0249
**Role:** doctor | **Theme:** rheumatology-biologic | **Seniority:** senior | **Verb Context:** people
**Keywords:** biologic therapy, DMARDs, treat-to-target, disease activity score, DAS28, biosimilar

**Scope:** treat-to-target management for {patients} patients on biologic and targeted DMARD therapy, conducting {das} disease activity assessments per month and {switches} therapy switches due to inadequate response
**Result:** achieving {remission}% remission rate at 12 months and {switches_success}% successful transition to biosimilar without disease flare

**Variations:**
- **A (Standard):** Managed treat-to-target management for {patients} patients on biologic an, achieving {remission}% remission rate at 12 months and {switches_success}% successful transition to biosimilar without disease flare.
- **B (Result-first):** Achieved {remission}% remission rate at 12 months and {switches_success}% successful tran by managing treat-to-target management for {patients} patients on biolog.
- **C (Impact-led):** Achieved {remission}% remission rate at 12 months and {switches_success}% successful tran; managed treat-to-target management for {patients} patients on biologic an.
- **D (Concise):** Managed treat-to-target management for {patients} patients on b, achieving {remission}% remission rate at 12 months and {switches_success}% succe.

**Variables:**
  - `{patients}`: 50 to 150, step 25 (integer)
  - `{das}`: 50 to 200, step 25 (integer)
  - `{switches}`: 5 to 30, step 5 (integer)
  - `{remission}`: 40 to 70, step 5 (percentage)
  - `{switches_success}`: 88 to 99, step 2 (percentage)

### HLTH-0250
**Role:** registered-nurse | **Theme:** blood-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** patient blood management, PBM, anemia management, bloodless surgery, iron infusion, preoperative optimization

**Scope:** patient blood management program for a {bed}-bed hospital reducing allogeneic transfusion through {protocols} evidence-based protocols across {service_lines} surgical service lines
**Result:** reducing red blood cell transfusion rate from {before} to {after} units per {admissions}K admissions and saving ${savings}K in blood product costs annually

**Variations:**
- **A (Standard):** Managed patient blood management program for a {bed}-bed hospital reducin, reducing red blood cell transfusion rate from {before} to {after} units per {admissions}K admissions and saving ${savings}K in blood product costs annually.
- **B (Result-first):** Reduced red blood cell transfusion rate from {before} to {after} units per {admissions}K  by managing patient blood management program for a {bed}-bed hospital re.
- **C (Impact-led):** Reduced red blood cell transfusion rate from {before} to {after} units per {admissions}K ; managed patient blood management program for a {bed}-bed hospital reducin.
- **D (Concise):** Managed patient blood management program for a {bed}-bed hospit, reducing red blood cell transfusion rate from {before} to {after} units per {adm.

**Variables:**
  - `{bed}`: 100 to 500, step 50 (integer)
  - `{protocols}`: 5 to 15, step 5 (integer)
  - `{service_lines}`: 3 to 8, step 1 (integer)
  - `{before}`: 50 to 100, step 10 (integer)
  - `{after}`: 20 to 45, step 5 (integer)
  - `{admissions}`: 1 to 10, step 1 (integer)
  - `{savings}`: 50 to 500, step 50 (currency)

