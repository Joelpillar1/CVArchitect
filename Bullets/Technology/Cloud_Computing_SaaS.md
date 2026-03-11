# Cloud Computing / SaaS

**Industry ID:** `cloud-saas` | **Prefix:** `CLOUD` | **Target:** 400 bullets

---

### CLOUD-0001
**Role:** cloud-architect | **Theme:** cloud-architecture | **Seniority:** senior | **Verb Context:** systems
**Keywords:** AWS, cloud architecture, Well-Architected Framework, scalability, multi-cloud, cloud strategy

**Scope:** cloud architecture strategy for a ${revenue}M revenue SaaS platform migrating {workloads} workloads from on-premises to AWS across {phases} phases
**Result:** reducing infrastructure costs by ${savings}K annually and improving platform availability from {before}% to {after}% uptime

**Variations:**
- **A (Standard):** Architected AWS cloud strategy for {workloads} workloads across {phases} migration phases, cutting infrastructure costs by ${savings}K annually and improving availability from {before}% to {after}%.
- **B (Result-first):** Saved ${savings}K annually and improved availability from {before}% to {after}% by architecting AWS migration of {workloads} workloads across {phases} phases.
- **C (Impact-led):** Delivered ${savings}K annual savings and availability from {before}% to {after}%; directed AWS cloud migration of {workloads} workloads across {phases} phases.
- **D (Concise):** Directed AWS migration of {workloads} workloads across {phases} phases, ${savings}K annual savings, availability from {before}% to {after}%.

**Variables:**
  - `{revenue}`: 10 to 500, step 10 (currency)
  - `{workloads}`: 10 to 100, step 10 (integer)
  - `{phases}`: 2 to 6, step 1 (integer)
  - `{savings}`: 50 to 1000, step 50 (currency)
  - `{before}`: 99 to 99.5, step 0.1 (percentage)
  - `{after}`: 99.9 to 99.99, step 0.01 (percentage)

### CLOUD-0002
**Role:** cloud-engineer | **Theme:** infrastructure-automation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Terraform, Ansible, infrastructure as code, cloud automation, provisioning, AWS CDK

**Scope:** infrastructure automation using Terraform and Ansible for {resources} cloud resources across {environments} environments, replacing manual provisioning processes
**Result:** reducing provisioning time from {before} days to {after} hours and eliminating {errors} manual configuration errors per month

**Variations:**
- **A (Standard):** Automated infrastructure for {resources} cloud resources across {environments} environments using Terraform and Ansible, cutting provisioning from {before} days to {after} hours and eliminating {errors} monthly configuration errors.
- **B (Result-first):** Cut provisioning from {before} days to {after} hours and eliminated {errors} monthly config errors by automating {resources} cloud resources across {environments} environments with Terraform and Ansible.
- **C (Impact-led):** Reduced provisioning from {before} days to {after} hours and eliminated {errors} monthly errors; automated {resources} cloud resources across {environments} environments with Terraform and Ansible.
- **D (Concise):** Automated {resources} cloud resources across {environments} envs with Terraform and Ansible, provisioning from {before}d to {after}h, {errors} monthly errors eliminated.

**Variables:**
  - `{resources}`: 50 to 500, step 50 (integer)
  - `{environments}`: 3 to 8, step 1 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{errors}`: 10 to 50, step 5 (integer)

### CLOUD-0003
**Role:** sre | **Theme:** reliability | **Seniority:** senior | **Verb Context:** systems
**Keywords:** SRE, SLO, SLA, error budget, reliability engineering, chaos engineering

**Scope:** an SRE practice for a {services}-service platform, defining SLOs, error budgets, and runbooks across {teams} product teams and {services} services
**Result:** improving platform reliability from {before}% to {after}% availability and reducing P1 incidents from {p1_before} to {p1_after} per quarter

**Variations:**
- **A (Standard):** Established SRE practice for {services} services across {teams} teams with SLOs and error budgets, improving availability from {before}% to {after}% and cutting P1 incidents from {p1_before} to {p1_after} per quarter.
- **B (Result-first):** Improved availability from {before}% to {after}% and cut P1 incidents from {p1_before} to {p1_after} per quarter by establishing SRE practice with SLOs and error budgets across {services} services.
- **C (Impact-led):** Raised availability from {before}% to {after}% and cut P1 incidents from {p1_before} to {p1_after} per quarter; built SRE practice for {services} services with SLOs, error budgets, and runbooks across {teams} teams.
- **D (Concise):** Built SRE practice for {services} services across {teams} teams, availability from {before}% to {after}%, P1 from {p1_before} to {p1_after}/quarter.

**Variables:**
  - `{services}`: 10 to 50, step 5 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{before}`: 99 to 99.5, step 0.1 (percentage)
  - `{after}`: 99.9 to 99.99, step 0.01 (percentage)
  - `{p1_before}`: 10 to 30, step 5 (integer)
  - `{p1_after}`: 1 to 4, step 1 (integer)

### CLOUD-0004
**Role:** saas-pm | **Theme:** churn-reduction | **Seniority:** mid | **Verb Context:** projects
**Keywords:** churn reduction, customer retention, NRR, health scoring, customer success, SaaS metrics

**Scope:** a churn reduction program for a SaaS product with {accounts} accounts and ${arr}M ARR, implementing health scoring, early warning alerts, and a {playbooks} playbook framework
**Result:** reducing annual churn rate from {before}% to {after}% and growing net revenue retention from {nrr_before}% to {nrr_after}%

**Variations:**
- **A (Standard):** Led a churn reduction program for {accounts} accounts and ${arr}M ARR using health scoring and {playbooks} playbooks, cutting churn from {before}% to {after}% and growing NRR from {nrr_before}% to {nrr_after}%.
- **B (Result-first):** Reduced churn from {before}% to {after}% and grew NRR from {nrr_before}% to {nrr_after}% by leading a churn reduction program with health scoring for {accounts} accounts and ${arr}M ARR.
- **C (Impact-led):** Cut churn from {before}% to {after}% and grew NRR from {nrr_before}% to {nrr_after}%; executed churn reduction program for {accounts} accounts and ${arr}M ARR with health scoring and {playbooks} playbooks.
- **D (Concise):** Led churn program for {accounts} accounts and ${arr}M ARR, churn from {before}% to {after}%, NRR from {nrr_before}% to {nrr_after}%.

**Variables:**
  - `{accounts}`: 100 to 2000, step 100 (integer)
  - `{arr}`: 5 to 100, step 5 (currency)
  - `{playbooks}`: 5 to 20, step 5 (integer)
  - `{before}`: 10 to 25, step 5 (percentage)
  - `{after}`: 3 to 8, step 1 (percentage)
  - `{nrr_before}`: 90 to 100, step 5 (percentage)
  - `{nrr_after}`: 105 to 130, step 5 (percentage)

### CLOUD-0005
**Role:** solutions-architect | **Theme:** client-onboarding | **Seniority:** mid | **Verb Context:** projects
**Keywords:** solutions architecture, technical onboarding, enterprise implementation, integration design, cloud solutions

**Scope:** technical onboarding for {accounts} enterprise accounts with average contract value of ${acv}K, designing custom integration architectures across {integrations} systems
**Result:** reducing average time-to-value from {before} weeks to {after} weeks and achieving a {csat} out of 10 onboarding CSAT score

**Variations:**
- **A (Standard):** Led technical onboarding for {accounts} enterprise accounts ({acv}K ACV) across {integrations} system integrations, cutting time-to-value from {before} to {after} weeks and achieving {csat}/10 CSAT.
- **B (Result-first):** Reduced time-to-value from {before} to {after} weeks and achieved {csat}/10 CSAT by leading technical onboarding for {accounts} enterprise accounts across {integrations} integrations.
- **C (Impact-led):** Cut time-to-value from {before} to {after} weeks and achieved {csat}/10 CSAT; managed technical onboarding for {accounts} enterprise accounts with ${acv}K ACV across {integrations} system integrations.
- **D (Concise):** Led technical onboarding for {accounts} enterprise accounts at ${acv}K ACV, time-to-value from {before} to {after} weeks, {csat}/10 CSAT.

**Variables:**
  - `{accounts}`: 10 to 50, step 5 (integer)
  - `{acv}`: 50 to 500, step 50 (currency)
  - `{integrations}`: 3 to 10, step 1 (integer)
  - `{before}`: 8 to 20, step 4 (integer)
  - `{after}`: 2 to 6, step 1 (integer)
  - `{csat}`: 8 to 10, step 0.5 (integer)

### CLOUD-0006
**Role:** cloud-architect | **Theme:** cost-optimization | **Seniority:** senior | **Verb Context:** operations
**Keywords:** cloud cost optimization, FinOps, reserved instances, rightsizing, AWS Cost Explorer, cloud spend

**Scope:** a cloud cost optimization program across {accounts} AWS accounts spending ${spend}M annually, implementing rightsizing, reserved instances, and auto-scaling policies
**Result:** reducing monthly cloud spend by ${savings}K while maintaining {sla}% uptime SLA and supporting {growth}% usage growth

**Variations:**
- **A (Standard):** Directed cloud cost optimization across {accounts} AWS accounts spending ${spend}M annually, implementing rightsizing and reserved instances to save ${savings}K monthly while supporting {growth}% usage growth.
- **B (Result-first):** Saved ${savings}K monthly and supported {growth}% usage growth by directing FinOps optimization across {accounts} AWS accounts with rightsizing and reserved instances.
- **C (Impact-led):** Delivered ${savings}K monthly savings while supporting {growth}% usage growth; directed FinOps program across {accounts} AWS accounts spending ${spend}M annually.
- **D (Concise):** Directed FinOps across {accounts} AWS accounts at ${spend}M/year, saved ${savings}K/month, {sla}% uptime maintained, {growth}% usage growth supported.

**Variables:**
  - `{accounts}`: 5 to 30, step 5 (integer)
  - `{spend}`: 1 to 20, step 1 (currency)
  - `{savings}`: 50 to 500, step 50 (currency)
  - `{sla}`: 99.9 to 99.99, step 0.01 (percentage)
  - `{growth}`: 20 to 100, step 10 (percentage)

### CLOUD-0007
**Role:** sre | **Theme:** incident-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** incident management, PagerDuty, on-call, MTTR, post-mortem, blameless culture

**Scope:** an on-call rotation and incident management process for a {engineers}-engineer SRE team, implementing PagerDuty escalation policies and blameless post-mortem practices
**Result:** reducing mean time to resolve incidents from {before} hours to {after} minutes and decreasing on-call alert noise by {noise}%

**Variations:**
- **A (Standard):** Implemented PagerDuty on-call and blameless post-mortems for a {engineers}-engineer SRE team, cutting MTTR from {before} hours to {after} minutes and reducing alert noise by {noise}%.
- **B (Result-first):** Cut MTTR from {before} hours to {after} minutes and reduced alert noise by {noise}% by implementing PagerDuty on-call and post-mortem practices for a {engineers}-engineer SRE team.
- **C (Impact-led):** Reduced MTTR from {before} hours to {after} minutes and cut alert noise {noise}%; established PagerDuty on-call with blameless post-mortems for a {engineers}-engineer SRE team.
- **D (Concise):** Established PagerDuty on-call for {engineers} SREs, MTTR from {before}h to {after}min, alert noise down {noise}%.

**Variables:**
  - `{engineers}`: 3 to 15, step 3 (integer)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{noise}`: 40 to 70, step 5 (percentage)

### CLOUD-0008
**Role:** cloud-engineer | **Theme:** serverless | **Seniority:** junior | **Verb Context:** systems
**Keywords:** AWS Lambda, serverless, event-driven, API Gateway, serverless architecture, FaaS

**Scope:** {functions} AWS Lambda functions for event-driven data processing pipelines handling {events}K events per day, replacing {jobs} scheduled batch jobs
**Result:** reducing infrastructure cost from ${before}K to ${after}K per month and cutting processing latency from {lat_before} minutes to {lat_after} seconds

**Variations:**
- **A (Standard):** Built {functions} Lambda functions for event-driven pipelines handling {events}K daily events, replacing {jobs} batch jobs, cutting costs from ${before}K to ${after}K monthly and latency from {lat_before}min to {lat_after}s.
- **B (Result-first):** Cut costs from ${before}K to ${after}K monthly and latency from {lat_before}min to {lat_after}s by building {functions} Lambda event-driven pipelines handling {events}K daily events.
- **C (Impact-led):** Reduced costs from ${before}K to ${after}K monthly and latency from {lat_before}min to {lat_after}s; developed {functions} Lambda functions replacing {jobs} batch jobs at {events}K events/day.
- **D (Concise):** Built {functions} Lambda functions replacing {jobs} batch jobs at {events}K events/day, costs from ${before}K to ${after}K/month, latency from {lat_before}min to {lat_after}s.

**Variables:**
  - `{functions}`: 5 to 30, step 5 (integer)
  - `{events}`: 10 to 500, step 50 (integer)
  - `{jobs}`: 5 to 20, step 5 (integer)
  - `{before}`: 5 to 50, step 5 (currency)
  - `{after}`: 1 to 10, step 1 (currency)
  - `{lat_before}`: 5 to 30, step 5 (integer)
  - `{lat_after}`: 1 to 10, step 1 (integer)

### CLOUD-0009
**Role:** saas-pm | **Theme:** feature-adoption | **Seniority:** mid | **Verb Context:** projects
**Keywords:** feature adoption, product analytics, in-app guidance, Pendo, user onboarding, activation

**Scope:** a feature adoption program using Pendo for {features} under-adopted features across a {seats}K-seat SaaS product, including in-app guidance and targeted email campaigns
**Result:** increasing average feature adoption from {before}% to {after}% and improving product stickiness score from {stick_before} to {stick_after} DAU/MAU ratio

**Variations:**
- **A (Standard):** Led feature adoption program using Pendo for {features} features across {seats}K seats, growing adoption from {before}% to {after}% and improving DAU/MAU from {stick_before} to {stick_after}.
- **B (Result-first):** Grew feature adoption from {before}% to {after}% and improved DAU/MAU from {stick_before} to {stick_after} by launching Pendo adoption program for {features} features across {seats}K seats.
- **C (Impact-led):** Grew adoption from {before}% to {after}% and DAU/MAU from {stick_before} to {stick_after}; executed Pendo adoption program for {features} features across a {seats}K-seat product.
- **D (Concise):** Launched Pendo adoption for {features} features across {seats}K seats, adoption from {before}% to {after}%, DAU/MAU from {stick_before} to {stick_after}.

**Variables:**
  - `{features}`: 5 to 20, step 5 (integer)
  - `{seats}`: 1 to 100, step 10 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 55 to 80, step 5 (percentage)
  - `{stick_before}`: 0.2 to 0.35, step 0.05 (integer)
  - `{stick_after}`: 0.45 to 0.65, step 0.05 (integer)

### CLOUD-0010
**Role:** solutions-architect | **Theme:** pre-sales | **Seniority:** senior | **Verb Context:** projects
**Keywords:** pre-sales engineering, technical demos, RFP responses, POC, solution design, deal support

**Scope:** pre-sales technical support for {deals} enterprise deals totaling ${pipeline}M in pipeline, delivering {demos} technical demos and {rfps} RFP responses
**Result:** achieving a {win}% deal win rate on supported opportunities and contributing to ${won}M in closed ARR

**Variations:**
- **A (Standard):** Provided pre-sales support for {deals} enterprise deals totaling ${pipeline}M pipeline with {demos} demos and {rfps} RFPs, achieving {win}% win rate and contributing to ${won}M in closed ARR.
- **B (Result-first):** Achieved {win}% win rate and contributed to ${won}M closed ARR by supporting {deals} enterprise deals with {demos} demos and {rfps} RFP responses.
- **C (Impact-led):** Contributed to ${won}M in closed ARR with {win}% win rate; directed pre-sales technical support for {deals} enterprise deals across {demos} demos and {rfps} RFP responses.
- **D (Concise):** Supported {deals} enterprise deals at ${pipeline}M pipeline, {demos} demos, {rfps} RFPs, {win}% win rate, ${won}M ARR closed.

**Variables:**
  - `{deals}`: 10 to 50, step 10 (integer)
  - `{pipeline}`: 5 to 100, step 5 (currency)
  - `{demos}`: 10 to 50, step 10 (integer)
  - `{rfps}`: 5 to 20, step 5 (integer)
  - `{win}`: 40 to 75, step 5 (percentage)
  - `{won}`: 1 to 50, step 5 (currency)

