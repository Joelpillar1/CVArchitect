# Cybersecurity

**Industry ID:** `cybersecurity` | **Prefix:** `CYBER` | **Target:** 400 bullets

---

### CYBER-0001
**Role:** security-analyst | **Theme:** threat-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SIEM, threat detection, Splunk, threat hunting, SOC, security monitoring

**Scope:** threat detection rules and correlation logic in Splunk across {sources} log sources ingesting {events}M events per day for a {size}-person SOC
**Result:** increasing true positive alert rate from {before}% to {after}% and reducing mean time to detect threats from {mttd_before} hours to {mttd_after} minutes

**Variations:**
- **A (Standard):** Developed Splunk detection rules across {sources} log sources ingesting {events}M daily events, increasing true positive rate from {before}% to {after}% and cutting MTTD from {mttd_before} hours to {mttd_after} minutes.
- **B (Result-first):** Increased true positive rate from {before}% to {after}% and cut MTTD from {mttd_before} hours to {mttd_after} minutes by building Splunk detection across {sources} sources ingesting {events}M daily events.
- **C (Impact-led):** Raised true positive rate from {before}% to {after}% and cut MTTD from {mttd_before}h to {mttd_after}min; developed Splunk detection rules across {sources} log sources at {events}M events per day.
- **D (Concise):** Built Splunk detection across {sources} sources at {events}M events/day, true positive from {before}% to {after}%, MTTD from {mttd_before}h to {mttd_after}min.

**Variables:**
  - `{sources}`: 20 to 100, step 10 (integer)
  - `{events}`: 1 to 50, step 5 (integer)
  - `{size}`: 5 to 30, step 5 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 70 to 90, step 5 (percentage)
  - `{mttd_before}`: 4 to 24, step 4 (integer)
  - `{mttd_after}`: 5 to 20, step 5 (integer)

### CYBER-0002
**Role:** pen-tester | **Theme:** penetration-testing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** penetration testing, OWASP Top 10, Burp Suite, Metasploit, vulnerability exploitation, red team

**Scope:** {engagements} penetration testing engagements across web applications, APIs, and internal networks, covering {assets} in-scope assets per engagement
**Result:** identifying {critical} critical and {high} high-severity vulnerabilities and achieving a {remediation}% client remediation rate within {days} days of report delivery

**Variations:**
- **A (Standard):** Executed {engagements} penetration testing engagements across web, API, and network targets with {assets} assets each, identifying {critical} critical and {high} high-severity findings with {remediation}% client remediation in {days} days.
- **B (Result-first):** Achieved {remediation}% client remediation in {days} days by executing {engagements} pen test engagements identifying {critical} critical and {high} high vulnerabilities across {assets} assets.
- **C (Impact-led):** Drove {remediation}% remediation rate in {days} days; executed {engagements} pen test engagements across web, API, and network targets uncovering {critical} critical and {high} high findings.
- **D (Concise):** Executed {engagements} pen tests across {assets} assets, found {critical} critical and {high} high issues, {remediation}% remediated in {days} days.

**Variables:**
  - `{engagements}`: 5 to 30, step 5 (integer)
  - `{assets}`: 10 to 100, step 10 (integer)
  - `{critical}`: 2 to 10, step 2 (integer)
  - `{high}`: 5 to 25, step 5 (integer)
  - `{remediation}`: 80 to 100, step 5 (percentage)
  - `{days}`: 30 to 90, step 15 (integer)

### CYBER-0003
**Role:** security-engineer | **Theme:** security-architecture | **Seniority:** senior | **Verb Context:** systems
**Keywords:** zero trust, security architecture, network segmentation, identity-aware proxy, ZTNA

**Scope:** a zero trust network architecture replacing a flat VPN-based network for {users}K users across {offices} offices and {cloud} cloud environments
**Result:** reducing the attack surface by {reduction}% and decreasing lateral movement incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Architected zero trust network for {users}K users across {offices} offices and {cloud} cloud environments, reducing attack surface by {reduction}% and cutting lateral movement incidents from {before} to {after} per quarter.
- **B (Result-first):** Reduced attack surface by {reduction}% and cut lateral movement from {before} to {after} per quarter by architecting zero trust network for {users}K users across {offices} offices and {cloud} environments.
- **C (Impact-led):** Cut attack surface {reduction}% and lateral movement from {before} to {after} per quarter; established zero trust architecture for {users}K users across {offices} offices and {cloud} cloud environments.
- **D (Concise):** Established ZTNA for {users}K users across {offices} offices and {cloud} cloud envs, attack surface down {reduction}%, lateral movement from {before} to {after}/quarter.

**Variables:**
  - `{users}`: 1 to 20, step 1 (integer)
  - `{offices}`: 2 to 20, step 2 (integer)
  - `{cloud}`: 2 to 5, step 1 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### CYBER-0004
**Role:** security-analyst | **Theme:** incident-response | **Seniority:** mid | **Verb Context:** operations
**Keywords:** incident response, DFIR, playbooks, containment, forensics, IR process

**Scope:** incident response playbooks for {scenarios} threat scenarios and led response to {incidents} security incidents over {months} months, coordinating with {teams} cross-functional teams
**Result:** reducing average containment time from {before} hours to {after} hours and cutting incident recurrence rate by {recurrence}% year-over-year

**Variations:**
- **A (Standard):** Developed IR playbooks for {scenarios} threat scenarios and led {incidents} incidents over {months} months, cutting containment time from {before} to {after} hours and reducing recurrence by {recurrence}% YoY.
- **B (Result-first):** Reduced containment time from {before} to {after} hours and recurrence by {recurrence}% YoY by developing {scenarios} IR playbooks and leading {incidents} incident responses over {months} months.
- **C (Impact-led):** Cut containment from {before} to {after} hours and recurrence {recurrence}% YoY; developed {scenarios} IR playbooks and led {incidents} responses over {months} months with {teams} cross-functional teams.
- **D (Concise):** Developed {scenarios} IR playbooks, led {incidents} incidents over {months} months, containment from {before} to {after}h, recurrence down {recurrence}% YoY.

**Variables:**
  - `{scenarios}`: 10 to 40, step 5 (integer)
  - `{incidents}`: 20 to 100, step 10 (integer)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{teams}`: 3 to 8, step 1 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{recurrence}`: 30 to 70, step 5 (percentage)

### CYBER-0005
**Role:** ciso | **Theme:** security-strategy | **Seniority:** senior | **Verb Context:** projects
**Keywords:** security strategy, risk management, board reporting, security roadmap, NIST CSF

**Scope:** a 3-year cybersecurity strategy aligned to NIST CSF for a {revenue}M revenue organization, prioritizing {initiatives} security initiatives with a ${budget}M security budget
**Result:** reducing cyber risk score from {before} to {after} on the organization's enterprise risk register and achieving {frameworks} compliance certifications within {months} months

**Variations:**
- **A (Standard):** Directed a 3-year NIST CSF-aligned security strategy for a ${revenue}M org across {initiatives} initiatives with a ${budget}M budget, cutting risk score from {before} to {after} and achieving {frameworks} certifications in {months} months.
- **B (Result-first):** Cut cyber risk score from {before} to {after} and achieved {frameworks} certifications in {months} months by directing a ${budget}M security strategy across {initiatives} initiatives for a ${revenue}M organization.
- **C (Impact-led):** Reduced enterprise cyber risk from {before} to {after} and earned {frameworks} certifications in {months} months; established 3-year NIST CSF security strategy with ${budget}M budget across {initiatives} initiatives.
- **D (Concise):** Directed ${budget}M NIST CSF security strategy across {initiatives} initiatives, risk score from {before} to {after}, {frameworks} certifications in {months} months.

**Variables:**
  - `{revenue}`: 100 to 5000, step 100 (currency)
  - `{initiatives}`: 5 to 15, step 5 (integer)
  - `{budget}`: 1 to 20, step 1 (currency)
  - `{before}`: 7 to 9, step 1 (integer)
  - `{after}`: 2 to 4, step 1 (integer)
  - `{frameworks}`: 2 to 5, step 1 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### CYBER-0006
**Role:** compliance-analyst | **Theme:** regulatory-compliance | **Seniority:** mid | **Verb Context:** operations
**Keywords:** SOC 2, ISO 27001, compliance, audit management, controls testing, GRC

**Scope:** SOC 2 Type II and ISO 27001 certification programs covering {controls} security controls across {systems} in-scope systems
**Result:** achieving both certifications within {months} months with {findings} audit findings, all of which were remediated before report issuance

**Variations:**
- **A (Standard):** Managed SOC 2 Type II and ISO 27001 programs across {controls} controls and {systems} systems, achieving both certifications in {months} months with {findings} findings remediated before report issuance.
- **B (Result-first):** Achieved SOC 2 Type II and ISO 27001 certifications in {months} months by managing {controls} controls across {systems} systems and remediating all {findings} findings pre-issuance.
- **C (Impact-led):** Earned SOC 2 Type II and ISO 27001 in {months} months with all {findings} findings remediated; managed {controls} controls across {systems} in-scope systems.
- **D (Concise):** Managed SOC 2 Type II and ISO 27001 across {controls} controls and {systems} systems, certified in {months} months, {findings} findings remediated.

**Variables:**
  - `{controls}`: 50 to 200, step 25 (integer)
  - `{systems}`: 10 to 50, step 5 (integer)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{findings}`: 5 to 30, step 5 (integer)

### CYBER-0007
**Role:** security-engineer | **Theme:** identity-access-management | **Seniority:** mid | **Verb Context:** systems
**Keywords:** IAM, Okta, SSO, MFA, privileged access management, PAM, least privilege

**Scope:** an Okta-based IAM platform with SSO and MFA for {users}K users across {applications} applications, enforcing least-privilege access controls and automated provisioning
**Result:** reducing unauthorized access incidents by {incidents}% and cutting manual user provisioning time from {before} hours to {after} minutes per user

**Variations:**
- **A (Standard):** Deployed Okta IAM with SSO and MFA for {users}K users across {applications} applications, reducing unauthorized access incidents by {incidents}% and cutting provisioning time from {before} hours to {after} minutes per user.
- **B (Result-first):** Reduced unauthorized access incidents by {incidents}% and cut provisioning from {before} hours to {after} minutes per user by deploying Okta IAM for {users}K users across {applications} applications.
- **C (Impact-led):** Cut unauthorized access incidents {incidents}% and provisioning from {before} hours to {after} minutes per user; deployed Okta SSO and MFA for {users}K users across {applications} applications.
- **D (Concise):** Deployed Okta SSO and MFA for {users}K users across {applications} apps, access incidents down {incidents}%, provisioning from {before}h to {after}min.

**Variables:**
  - `{users}`: 1 to 20, step 1 (integer)
  - `{applications}`: 20 to 100, step 10 (integer)
  - `{incidents}`: 40 to 80, step 5 (percentage)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 15, step 5 (integer)

### CYBER-0008
**Role:** security-analyst | **Theme:** vulnerability-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** vulnerability management, Tenable, Qualys, CVE, patch management, remediation tracking

**Scope:** vulnerability scanning program using Tenable across {assets}K assets, triaging {vulns} vulnerabilities per month by CVSS score and business impact
**Result:** reducing critical and high vulnerability count from {before} to {after} within {days} days of each scan cycle and achieving a {sla}% SLA compliance rate

**Variations:**
- **A (Standard):** Supported vulnerability scanning across {assets}K assets with Tenable, triaging {vulns} vulnerabilities monthly, cutting critical and high findings from {before} to {after} within {days} days and achieving {sla}% SLA compliance.
- **B (Result-first):** Reduced critical and high vulnerabilities from {before} to {after} within {days} days and achieved {sla}% SLA compliance by supporting Tenable scanning across {assets}K assets and triaging {vulns} monthly.
- **C (Impact-led):** Cut critical and high findings from {before} to {after} within {days} days and hit {sla}% SLA compliance; supported Tenable scanning across {assets}K assets, triaging {vulns} vulnerabilities monthly.
- **D (Concise):** Supported Tenable scanning for {assets}K assets, triaged {vulns} vulns/month, critical/high from {before} to {after} in {days} days, {sla}% SLA compliance.

**Variables:**
  - `{assets}`: 1 to 50, step 5 (integer)
  - `{vulns}`: 100 to 1000, step 100 (integer)
  - `{before}`: 100 to 500, step 50 (integer)
  - `{after}`: 10 to 50, step 10 (integer)
  - `{days}`: 15 to 60, step 15 (integer)
  - `{sla}`: 85 to 99, step 5 (percentage)

### CYBER-0009
**Role:** ciso | **Theme:** security-culture | **Seniority:** senior | **Verb Context:** people
**Keywords:** security awareness, phishing simulation, security training, human risk, culture change

**Scope:** a company-wide security awareness program for {employees}K employees including phishing simulations, mandatory training, and {modules} role-based learning modules
**Result:** reducing phishing click-through rate from {before}% to {after}% within {months} months and improving security training completion rate from {train_before}% to {train_after}%

**Variations:**
- **A (Standard):** Established a security awareness program for {employees}K employees with phishing simulations and {modules} learning modules, cutting phishing click-through from {before}% to {after}% in {months} months and raising completion from {train_before}% to {train_after}%.
- **B (Result-first):** Cut phishing click-through from {before}% to {after}% in {months} months and raised training completion from {train_before}% to {train_after}% by launching a security awareness program for {employees}K employees.
- **C (Impact-led):** Reduced phishing click-through from {before}% to {after}% in {months} months and training completion from {train_before}% to {train_after}%; launched security awareness program for {employees}K employees with {modules} learning modules.
- **D (Concise):** Launched security awareness for {employees}K employees with {modules} modules, phishing click-through from {before}% to {after}% in {months} months, training completion from {train_before}% to {train_after}%.

**Variables:**
  - `{employees}`: 1 to 20, step 1 (integer)
  - `{modules}`: 5 to 20, step 5 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 3 to 8, step 1 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{train_before}`: 40 to 65, step 5 (percentage)
  - `{train_after}`: 85 to 99, step 5 (percentage)

### CYBER-0010
**Role:** compliance-analyst | **Theme:** audit-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** audit management, evidence collection, GRC tools, audit readiness, control testing

**Scope:** audit evidence collection and control testing for {controls} controls across {audits} external audits in a single fiscal year, coordinating with {owners} control owners
**Result:** reducing audit preparation time from {before} weeks to {after} weeks and achieving a {pass}% first-pass audit success rate

**Variations:**
- **A (Standard):** Coordinated evidence collection for {controls} controls across {audits} external audits, working with {owners} control owners, reducing prep time from {before} to {after} weeks and achieving {pass}% first-pass success.
- **B (Result-first):** Reduced audit prep from {before} to {after} weeks and achieved {pass}% first-pass success by coordinating evidence for {controls} controls across {audits} audits with {owners} control owners.
- **C (Impact-led):** Cut audit prep from {before} to {after} weeks and hit {pass}% first-pass success; coordinated evidence for {controls} controls across {audits} audits with {owners} control owners.
- **D (Concise):** Coordinated {controls} controls across {audits} audits with {owners} owners, prep from {before} to {after} weeks, {pass}% first-pass success.

**Variables:**
  - `{controls}`: 50 to 200, step 25 (integer)
  - `{audits}`: 2 to 6, step 1 (integer)
  - `{owners}`: 10 to 50, step 10 (integer)
  - `{before}`: 8 to 20, step 2 (integer)
  - `{after}`: 2 to 4, step 1 (integer)
  - `{pass}`: 85 to 100, step 5 (percentage)

