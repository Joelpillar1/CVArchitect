# Telecommunications

**Industry ID:** `telecom` | **Prefix:** `TELCO` | **Target:** 300 bullets

---

### TELCO-0001
**Role:** network-engineer | **Theme:** network-design | **Seniority:** mid | **Verb Context:** systems
**Keywords:** network design, LAN/WAN, BGP, MPLS, Cisco, network architecture, enterprise networking

**Scope:** LAN/WAN network architecture for a {sites}-site enterprise spanning {devices}K network devices, migrating from legacy MPLS to SD-WAN with BGP routing
**Result:** reducing WAN bandwidth costs by ${savings}K annually and improving average site-to-site latency from {before}ms to {after}ms

**Variations:**
- **A (Standard):** Designed LAN/WAN architecture across {sites} sites with {devices}K devices migrating from MPLS to SD-WAN, saving ${savings}K annually and improving latency from {before}ms to {after}ms.
- **B (Result-first):** Saved ${savings}K annually and improved latency from {before}ms to {after}ms by designing SD-WAN migration for {sites} sites with {devices}K network devices.
- **C (Impact-led):** Delivered ${savings}K annual WAN savings and improved latency from {before}ms to {after}ms; designed {sites}-site SD-WAN migration with BGP routing across {devices}K devices.
- **D (Concise):** Designed {sites}-site MPLS-to-SD-WAN migration across {devices}K devices, ${savings}K annual savings, latency from {before}ms to {after}ms.

**Variables:**
  - `{sites}`: 5 to 50, step 5 (integer)
  - `{devices}`: 1 to 50, step 5 (integer)
  - `{savings}`: 50 to 500, step 50 (currency)
  - `{before}`: 50 to 200, step 25 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### TELCO-0002
**Role:** telecom-pm | **Theme:** infrastructure-rollout | **Seniority:** senior | **Verb Context:** projects
**Keywords:** telecom infrastructure, 5G rollout, tower deployment, program management, network expansion

**Scope:** a 5G network infrastructure rollout across {sites} tower sites and {cities} cities, managing {vendors} equipment vendors and a ${budget}M capital deployment budget
**Result:** completing the rollout {weeks} weeks ahead of schedule, {coverage}% under budget, and achieving {coverage_pct}% coverage of the target population

**Variations:**
- **A (Standard):** Directed 5G rollout across {sites} tower sites and {cities} cities with {vendors} vendors and ${budget}M budget, completing {weeks} weeks early, {coverage}% under budget, and achieving {coverage_pct}% population coverage.
- **B (Result-first):** Completed 5G rollout {weeks} weeks early and {coverage}% under budget by directing deployment across {sites} sites and {cities} cities with {vendors} vendors and ${budget}M budget.
- **C (Impact-led):** Delivered 5G rollout {weeks} weeks ahead of schedule and {coverage}% under budget; orchestrated {sites}-site deployment across {cities} cities with {vendors} vendors and ${budget}M budget.
- **D (Concise):** Orchestrated 5G rollout across {sites} sites and {cities} cities, ${budget}M budget, {weeks} weeks early, {coverage}% under budget, {coverage_pct}% population coverage.

**Variables:**
  - `{sites}`: 50 to 500, step 50 (integer)
  - `{cities}`: 5 to 50, step 5 (integer)
  - `{vendors}`: 3 to 10, step 1 (integer)
  - `{budget}`: 10 to 500, step 10 (currency)
  - `{weeks}`: 2 to 12, step 2 (integer)
  - `{coverage}`: 5 to 20, step 5 (percentage)
  - `{coverage_pct}`: 80 to 99, step 5 (percentage)

### TELCO-0003
**Role:** rf-engineer | **Theme:** signal-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** RF engineering, signal propagation, coverage optimization, antenna tilt, interference mitigation, LTE

**Scope:** RF signal optimization across {cells} cell sites in a {region} market, using drive testing and propagation modeling to address coverage gaps and interference issues
**Result:** improving average signal strength by {signal}dBm and reducing dropped call rate from {before}% to {after}% across the coverage area

**Variations:**
- **A (Standard):** Optimized RF signals across {cells} cell sites using drive testing and propagation modeling, improving average signal strength by {signal}dBm and reducing dropped calls from {before}% to {after}%.
- **B (Result-first):** Improved average signal strength by {signal}dBm and cut dropped call rate from {before}% to {after}% by optimizing RF across {cells} cell sites using drive testing and propagation modeling.
- **C (Impact-led):** Improved signal strength {signal}dBm and cut dropped calls from {before}% to {after}%; optimized RF configurations across {cells} cell sites using drive testing and propagation models.
- **D (Concise):** Optimized RF across {cells} cell sites, signal up {signal}dBm, dropped calls from {before}% to {after}%.

**Variables:**
  - `{cells}`: 20 to 200, step 20 (integer)
  - `{signal}`: 3 to 15, step 3 (integer)
  - `{before}`: 3 to 10, step 1 (percentage)
  - `{after}`: 0.5 to 2, step 0.5 (percentage)

### TELCO-0004
**Role:** network-engineer | **Theme:** network-monitoring | **Seniority:** junior | **Verb Context:** systems
**Keywords:** network monitoring, SNMP, Nagios, NOC, network performance, uptime monitoring

**Scope:** network monitoring dashboards using Nagios for {devices}K network devices across {sites} sites, configuring {alerts} alert thresholds and escalation policies
**Result:** achieving {uptime}% network uptime and reducing mean time to detect outages from {before} hours to {after} minutes

**Variations:**
- **A (Standard):** Configured Nagios monitoring for {devices}K devices across {sites} sites with {alerts} alerts, achieving {uptime}% uptime and reducing outage detection from {before} hours to {after} minutes.
- **B (Result-first):** Achieved {uptime}% network uptime and cut outage detection from {before} hours to {after} minutes by configuring Nagios monitoring for {devices}K devices across {sites} sites.
- **C (Impact-led):** Hit {uptime}% uptime and cut outage detection from {before} hours to {after} minutes; configured Nagios monitoring for {devices}K devices across {sites} sites with {alerts} alert thresholds.
- **D (Concise):** Configured Nagios for {devices}K devices across {sites} sites, {alerts} alerts, {uptime}% uptime, outage detection from {before}h to {after}min.

**Variables:**
  - `{devices}`: 1 to 50, step 5 (integer)
  - `{sites}`: 5 to 50, step 5 (integer)
  - `{alerts}`: 50 to 500, step 50 (integer)
  - `{uptime}`: 99 to 99.9, step 0.1 (percentage)
  - `{before}`: 1 to 4, step 1 (integer)
  - `{after}`: 5 to 15, step 5 (integer)

### TELCO-0005
**Role:** telecom-sales-engineer | **Theme:** solution-selling | **Seniority:** mid | **Verb Context:** projects
**Keywords:** telecom solutions, enterprise sales, technical sales, RFP, pre-sales, connectivity solutions

**Scope:** pre-sales technical solutioning for {accounts} enterprise accounts with total contract value of ${tcv}M, designing custom connectivity and managed service solutions
**Result:** achieving a {win}% win rate on supported opportunities and contributing to ${won}M in new ARR within {months} months

**Variations:**
- **A (Standard):** Provided pre-sales solutioning for {accounts} enterprise accounts totaling ${tcv}M TCV, achieving {win}% win rate and contributing to ${won}M in new ARR within {months} months.
- **B (Result-first):** Achieved {win}% win rate and contributed to ${won}M ARR in {months} months by providing pre-sales solutioning for {accounts} enterprise accounts at ${tcv}M TCV.
- **C (Impact-led):** Contributed to ${won}M ARR in {months} months with {win}% win rate; led pre-sales solutioning for {accounts} enterprise accounts at ${tcv}M TCV.
- **D (Concise):** Led pre-sales for {accounts} enterprise accounts at ${tcv}M TCV, {win}% win rate, ${won}M ARR in {months} months.

**Variables:**
  - `{accounts}`: 10 to 50, step 5 (integer)
  - `{tcv}`: 5 to 100, step 5 (currency)
  - `{win}`: 40 to 75, step 5 (percentage)
  - `{won}`: 1 to 30, step 5 (currency)
  - `{months}`: 6 to 18, step 3 (integer)

### TELCO-0006
**Role:** telecom-pm | **Theme:** vendor-management | **Seniority:** mid | **Verb Context:** operations
**Keywords:** vendor management, SLA management, contract negotiation, telecom vendors, procurement, supplier performance

**Scope:** vendor relationships with {vendors} telecom equipment and service vendors representing ${spend}M in annual spend, negotiating SLAs and managing performance reviews
**Result:** reducing vendor-related SLA breaches by {breaches}% and achieving ${savings}K in annual cost savings through contract renegotiation

**Variations:**
- **A (Standard):** Managed {vendors} telecom vendors at ${spend}M annual spend, negotiating SLAs and performance reviews, reducing SLA breaches by {breaches}% and saving ${savings}K annually.
- **B (Result-first):** Reduced SLA breaches by {breaches}% and saved ${savings}K annually by managing {vendors} vendors at ${spend}M spend with structured SLA negotiations.
- **C (Impact-led):** Cut SLA breaches {breaches}% and saved ${savings}K annually; managed {vendors} telecom vendors at ${spend}M spend with SLA frameworks and performance reviews.
- **D (Concise):** Managed {vendors} telecom vendors at ${spend}M spend, SLA breaches down {breaches}%, saved ${savings}K annually.

**Variables:**
  - `{vendors}`: 5 to 20, step 5 (integer)
  - `{spend}`: 5 to 100, step 5 (currency)
  - `{breaches}`: 30 to 70, step 5 (percentage)
  - `{savings}`: 50 to 500, step 50 (currency)

### TELCO-0007
**Role:** rf-engineer | **Theme:** coverage-planning | **Seniority:** senior | **Verb Context:** projects
**Keywords:** coverage planning, propagation modeling, capacity planning, network planning, 5G NR, spectrum management

**Scope:** a 5G NR coverage and capacity plan for a {pop}M population market requiring {sites} new cell sites, modeling {scenarios} propagation scenarios across {bands} frequency bands
**Result:** achieving {coverage_pct}% outdoor coverage within {budget}% of the allocated site acquisition budget and {months} months ahead of regulatory deadline

**Variations:**
- **A (Standard):** Directed 5G NR coverage planning for a {pop}M population market with {sites} new sites across {bands} bands, achieving {coverage_pct}% outdoor coverage within budget and {months} months ahead of deadline.
- **B (Result-first):** Achieved {coverage_pct}% outdoor coverage within {budget}% of budget and {months} months ahead of deadline by planning {sites} 5G NR sites across {bands} bands for a {pop}M population market.
- **C (Impact-led):** Hit {coverage_pct}% outdoor coverage, {months} months ahead of regulatory deadline; directed 5G NR coverage plan for {pop}M population with {sites} sites across {bands} frequency bands.
- **D (Concise):** Planned {sites} 5G NR sites across {bands} bands for {pop}M population, {coverage_pct}% coverage, within {budget}% budget, {months} months ahead of deadline.

**Variables:**
  - `{pop}`: 1 to 20, step 1 (integer)
  - `{sites}`: 50 to 500, step 50 (integer)
  - `{scenarios}`: 5 to 20, step 5 (integer)
  - `{bands}`: 2 to 5, step 1 (integer)
  - `{coverage_pct}`: 85 to 99, step 5 (percentage)
  - `{budget}`: 90 to 100, step 5 (percentage)
  - `{months}`: 1 to 6, step 1 (integer)

### TELCO-0008
**Role:** telecom-sales-engineer | **Theme:** technical-demos | **Seniority:** junior | **Verb Context:** content
**Keywords:** technical demonstrations, proof of concept, solution presentation, product demo, customer education

**Scope:** {demos} technical product demonstrations for enterprise prospects across {products} telecom solution categories, supporting {ams} account managers with custom POC environments
**Result:** contributing to a {conversion}% demo-to-opportunity conversion rate and supporting ${pipeline}M in qualified pipeline

**Variations:**
- **A (Standard):** Delivered {demos} technical demonstrations across {products} solution categories for {ams} account managers, achieving {conversion}% demo-to-opportunity conversion and supporting ${pipeline}M in pipeline.
- **B (Result-first):** Achieved {conversion}% demo-to-opportunity conversion and ${pipeline}M pipeline by delivering {demos} technical demos across {products} solution categories.
- **C (Impact-led):** Drove {conversion}% demo-to-opportunity conversion and ${pipeline}M in pipeline; delivered {demos} technical demos across {products} categories for {ams} account managers.
- **D (Concise):** Delivered {demos} technical demos across {products} categories, {conversion}% demo-to-opportunity conversion, ${pipeline}M pipeline.

**Variables:**
  - `{demos}`: 10 to 50, step 10 (integer)
  - `{products}`: 3 to 8, step 1 (integer)
  - `{ams}`: 3 to 15, step 3 (integer)
  - `{conversion}`: 30 to 60, step 5 (percentage)
  - `{pipeline}`: 5 to 50, step 5 (currency)

### TELCO-0009
**Role:** network-engineer | **Theme:** routing-switching | **Seniority:** mid | **Verb Context:** systems
**Keywords:** BGP, OSPF, network routing, switching, VLANs, network segmentation, redundancy

**Scope:** a redundant multi-layer network topology for a {users}K-user enterprise using BGP, OSPF, and VLAN segmentation across {switches} core and distribution switches
**Result:** eliminating single points of failure and achieving {uptime}% network availability, a {reduction}% improvement over the previous architecture

**Variations:**
- **A (Standard):** Designed redundant multi-layer topology using BGP, OSPF, and VLANs across {switches} switches for {users}K users, achieving {uptime}% availability, a {reduction}% improvement over previous architecture.
- **B (Result-first):** Achieved {uptime}% availability ({reduction}% improvement) by designing redundant BGP and OSPF topology across {switches} switches for {users}K users.
- **C (Impact-led):** Improved availability {reduction}% to {uptime}%; engineered redundant multi-layer topology with BGP, OSPF, and VLANs across {switches} switches for {users}K users.
- **D (Concise):** Engineered redundant BGP and OSPF topology across {switches} switches for {users}K users, {uptime}% availability, {reduction}% improvement.

**Variables:**
  - `{users}`: 1 to 20, step 1 (integer)
  - `{switches}`: 5 to 50, step 5 (integer)
  - `{uptime}`: 99.9 to 99.99, step 0.01 (percentage)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### TELCO-0010
**Role:** telecom-pm | **Theme:** schedule-management | **Seniority:** junior | **Verb Context:** operations
**Keywords:** project scheduling, Gantt chart, MS Project, telecom deployment, schedule tracking, milestone management

**Scope:** project scheduling and milestone tracking for {projects} concurrent telecom deployment projects across {sites} sites using MS Project and weekly status reporting
**Result:** maintaining {otd}% on-time delivery across all projects and reducing average schedule variance from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Coordinated scheduling for {projects} concurrent telecom projects across {sites} sites using MS Project, maintaining {otd}% on-time delivery and reducing schedule variance from {before} weeks to {after} days.
- **B (Result-first):** Maintained {otd}% on-time delivery and reduced schedule variance from {before} weeks to {after} days by coordinating MS Project scheduling for {projects} concurrent projects.
- **C (Impact-led):** Achieved {otd}% on-time delivery and cut schedule variance from {before} weeks to {after} days; coordinated MS Project tracking for {projects} concurrent telecom deployments across {sites} sites.
- **D (Concise):** Coordinated {projects} concurrent telecom projects across {sites} sites in MS Project, {otd}% on-time, variance from {before} weeks to {after} days.

**Variables:**
  - `{projects}`: 5 to 20, step 5 (integer)
  - `{sites}`: 20 to 200, step 20 (integer)
  - `{otd}`: 85 to 99, step 5 (percentage)
  - `{before}`: 2 to 6, step 1 (integer)
  - `{after}`: 2 to 7, step 1 (integer)

