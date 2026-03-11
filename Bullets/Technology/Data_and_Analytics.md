# Data & Analytics

**Industry ID:** `data-analytics` | **Prefix:** `DATA` | **Target:** 400 bullets

---

### DATA-0001
**Role:** data-scientist | **Theme:** machine-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** machine learning, scikit-learn, model training, feature engineering, predictive modeling

**Scope:** a churn prediction model using gradient boosting on a dataset of {records}K customer records with {features} engineered features
**Result:** achieving {auc} AUC-ROC and enabling the retention team to reduce monthly churn by {churn}% through targeted interventions

**Variations:**
- **A (Standard):** Developed a gradient boosting churn prediction model on {records}K records with {features} engineered features, achieving {auc} AUC-ROC and enabling a {churn}% monthly churn reduction.
- **B (Result-first):** Reduced monthly churn by {churn}% by developing a gradient boosting model on {records}K records achieving {auc} AUC-ROC with {features} engineered features.
- **C (Impact-led):** Drove a {churn}% monthly churn reduction; built gradient boosting model on {records}K customer records with {features} features, achieving {auc} AUC-ROC.
- **D (Concise):** Built churn model on {records}K records with {features} features, {auc} AUC-ROC, enabled {churn}% monthly churn reduction.

**Variables:**
  - `{records}`: 100 to 5000, step 100 (integer)
  - `{features}`: 20 to 100, step 10 (integer)
  - `{auc}`: 0.85 to 0.97, step 0.01 (integer)
  - `{churn}`: 10 to 35, step 5 (percentage)

### DATA-0002
**Role:** data-scientist | **Theme:** statistical-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** A/B testing, statistical significance, hypothesis testing, experimentation platform, causal inference

**Scope:** a company-wide experimentation platform supporting {experiments} concurrent A/B tests across {products} product surfaces
**Result:** reducing time-to-decision on experiments from {before} weeks to {after} days and increasing experiment throughput by {throughput}%

**Variations:**
- **A (Standard):** Architected a company-wide experimentation platform running {experiments} concurrent A/B tests across {products} product surfaces, cutting decision time from {before} weeks to {after} days and increasing throughput by {throughput}%.
- **B (Result-first):** Cut experiment decision time from {before} weeks to {after} days and increased throughput by {throughput}% by architecting an A/B testing platform supporting {experiments} concurrent tests across {products} surfaces.
- **C (Impact-led):** Accelerated experiment decisions from {before} weeks to {after} days and boosted throughput by {throughput}%; established company-wide A/B platform handling {experiments} concurrent tests across {products} surfaces.
- **D (Concise):** Built A/B platform for {experiments} concurrent tests across {products} surfaces, decisions from {before}wk to {after}d, throughput up {throughput}%.

**Variables:**
  - `{experiments}`: 10 to 50, step 5 (integer)
  - `{products}`: 3 to 10, step 1 (integer)
  - `{before}`: 3 to 8, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{throughput}`: 30 to 100, step 10 (percentage)

### DATA-0003
**Role:** data-analyst | **Theme:** sql-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SQL, BigQuery, data analysis, query optimization, business intelligence

**Scope:** a library of {queries} reusable SQL queries in BigQuery for {teams} business teams, optimizing {slow} slow-running queries exceeding 60-second execution time
**Result:** reducing average query runtime from {before} seconds to {after} seconds and saving analysts {hours} hours per week in query wait time

**Variations:**
- **A (Standard):** Built a library of {queries} reusable BigQuery SQL queries for {teams} business teams and optimized {slow} slow queries, reducing average runtime from {before}s to {after}s and saving {hours} analyst hours weekly.
- **B (Result-first):** Saved analysts {hours} hours weekly and cut average query runtime from {before}s to {after}s by building a {queries}-query BigQuery library and optimizing {slow} slow-running queries.
- **C (Impact-led):** Saved {hours} analyst hours weekly and cut average query time from {before}s to {after}s; built {queries}-query BigQuery library and optimized {slow} slow queries for {teams} business teams.
- **D (Concise):** Built {queries}-query BigQuery library for {teams} teams, optimized {slow} slow queries, avg runtime from {before}s to {after}s, saved {hours} hours/week.

**Variables:**
  - `{queries}`: 50 to 300, step 50 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{slow}`: 10 to 50, step 5 (integer)
  - `{before}`: 120 to 300, step 30 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{hours}`: 5 to 20, step 5 (integer)

### DATA-0004
**Role:** data-analyst | **Theme:** dashboard-creation | **Seniority:** mid | **Verb Context:** content
**Keywords:** Tableau, Power BI, Looker, dashboards, data visualization, self-service analytics

**Scope:** {count} executive and operational dashboards in Tableau consolidating data from {sources} sources for {stakeholders} stakeholders across {departments} departments
**Result:** replacing {reports} manual weekly reports and saving {hours} hours of manual reporting effort per month

**Variations:**
- **A (Standard):** Designed {count} Tableau dashboards consolidating {sources} data sources for {stakeholders} stakeholders across {departments} departments, replacing {reports} manual weekly reports and saving {hours} hours monthly.
- **B (Result-first):** Saved {hours} monthly reporting hours and replaced {reports} manual reports by building {count} Tableau dashboards consolidating {sources} data sources for {stakeholders} stakeholders.
- **C (Impact-led):** Eliminated {hours} monthly reporting hours and replaced {reports} manual reports; built {count} Tableau dashboards unifying {sources} sources for {stakeholders} stakeholders across {departments} departments.
- **D (Concise):** Built {count} Tableau dashboards across {departments} departments, replaced {reports} manual reports, saved {hours} hours/month.

**Variables:**
  - `{count}`: 5 to 30, step 5 (integer)
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{stakeholders}`: 10 to 100, step 10 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{hours}`: 20 to 100, step 10 (integer)

### DATA-0005
**Role:** data-analyst | **Theme:** reporting | **Seniority:** junior | **Verb Context:** content
**Keywords:** reporting, Excel, Python, data cleaning, business reporting, stakeholder updates

**Scope:** weekly business performance reports for {stakeholders} stakeholders by compiling data from {sources} sources and automating {reports} recurring reports using Python
**Result:** reducing report preparation time from {before} hours to {after} hours per week and improving data accuracy by eliminating {errors} recurring manual errors

**Variations:**
- **A (Standard):** Compiled weekly performance reports for {stakeholders} stakeholders from {sources} sources and automated {reports} recurring reports in Python, cutting prep time from {before} to {after} hours weekly and eliminating {errors} manual errors.
- **B (Result-first):** Reduced report prep from {before} to {after} hours weekly and eliminated {errors} manual errors by automating {reports} recurring reports in Python for {stakeholders} stakeholders.
- **C (Impact-led):** Cut weekly report prep from {before} to {after} hours and eliminated {errors} recurring errors; automated {reports} reports in Python serving {stakeholders} stakeholders across {sources} data sources.
- **D (Concise):** Automated {reports} reports in Python for {stakeholders} stakeholders, prep time from {before} to {after} hours, eliminated {errors} manual errors.

**Variables:**
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{sources}`: 3 to 10, step 1 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{before}`: 8 to 20, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{errors}`: 5 to 20, step 5 (integer)

### DATA-0006
**Role:** bi-analyst | **Theme:** kpi-tracking | **Seniority:** mid | **Verb Context:** content
**Keywords:** KPIs, metrics framework, OKRs, business performance, data governance

**Scope:** a company-wide KPI framework of {kpis} metrics across {departments} departments, aligning definitions with {stakeholders} business stakeholders and documenting in a central data dictionary
**Result:** reducing metric definition disputes by {disputes}% and enabling {reports} cross-functional reports to reference a single source of truth

**Variations:**
- **A (Standard):** Designed a company-wide KPI framework of {kpis} metrics across {departments} departments, reducing metric disputes by {disputes}% and enabling {reports} cross-functional reports from a single source of truth.
- **B (Result-first):** Reduced metric disputes by {disputes}% by designing a {kpis}-metric KPI framework across {departments} departments with a central data dictionary for {reports} cross-functional reports.
- **C (Impact-led):** Cut metric disputes {disputes}% and unified {reports} cross-functional reports on a single source of truth; built {kpis}-metric KPI framework across {departments} departments.
- **D (Concise):** Built {kpis}-metric KPI framework across {departments} departments, disputes down {disputes}%, enabled {reports} unified cross-functional reports.

**Variables:**
  - `{kpis}`: 50 to 200, step 25 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{disputes}`: 40 to 80, step 10 (percentage)
  - `{reports}`: 10 to 50, step 10 (integer)

### DATA-0007
**Role:** ml-engineer | **Theme:** mlops | **Seniority:** senior | **Verb Context:** systems
**Keywords:** MLOps, MLflow, model registry, model monitoring, feature store, ML platform

**Scope:** an ML platform using MLflow and a feature store serving {models} production models across {teams} data science teams
**Result:** reducing model deployment time from {before} weeks to {after} days and cutting model-related production incidents by {incidents}% year-over-year

**Variations:**
- **A (Standard):** Established an MLOps platform using MLflow and feature store serving {models} production models for {teams} teams, cutting deployment time from {before} weeks to {after} days and reducing production incidents by {incidents}% YoY.
- **B (Result-first):** Cut model deployment from {before} weeks to {after} days and reduced production incidents by {incidents}% YoY by building an MLflow-based platform serving {models} models for {teams} teams.
- **C (Impact-led):** Slashed model deployment from {before} weeks to {after} days and cut production incidents {incidents}% YoY; built MLOps platform with MLflow and feature store serving {models} models across {teams} teams.
- **D (Concise):** Built MLOps platform for {models} models across {teams} teams, deployment from {before}wk to {after}d, incidents down {incidents}% YoY.

**Variables:**
  - `{models}`: 10 to 50, step 10 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{incidents}`: 40 to 70, step 5 (percentage)

### DATA-0008
**Role:** ml-engineer | **Theme:** pipeline-automation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Apache Airflow, pipeline orchestration, ETL automation, data pipeline, workflow automation

**Scope:** {count} automated ML training pipelines using Apache Airflow processing {records}M records daily across {models} model families
**Result:** reducing manual data scientist intervention from {before} hours to {after} hours per week and improving model freshness from weekly to daily retraining

**Variations:**
- **A (Standard):** Built {count} Airflow ML training pipelines processing {records}M records daily across {models} model families, cutting manual DS intervention from {before} to {after} hours weekly and enabling daily model retraining.
- **B (Result-first):** Reduced manual intervention from {before} to {after} hours weekly and enabled daily model retraining by automating {count} Airflow pipelines processing {records}M records across {models} model families.
- **C (Impact-led):** Cut manual DS work from {before} to {after} hours weekly and upgraded retraining from weekly to daily; automated {count} Airflow pipelines processing {records}M records across {models} model families.
- **D (Concise):** Automated {count} Airflow ML pipelines across {models} models processing {records}M records/day, manual work from {before} to {after} hours/week.

**Variables:**
  - `{count}`: 5 to 20, step 5 (integer)
  - `{records}`: 1 to 100, step 5 (integer)
  - `{models}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 40, step 5 (integer)
  - `{after}`: 2 to 5, step 1 (integer)

### DATA-0009
**Role:** data-engineer | **Theme:** etl-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ETL, Apache Spark, data ingestion, pipeline reliability, data integration

**Scope:** {count} Spark-based ETL pipelines ingesting {sources} data sources processing {volume}GB of data daily into a central data warehouse
**Result:** achieving {reliability}% pipeline reliability and reducing data latency from {before} hours to {after} minutes for downstream consumers

**Variations:**
- **A (Standard):** Built {count} Spark ETL pipelines ingesting {sources} sources and {volume}GB daily, achieving {reliability}% reliability and reducing data latency from {before} hours to {after} minutes.
- **B (Result-first):** Achieved {reliability}% pipeline reliability and cut data latency from {before} hours to {after} minutes by building {count} Spark ETL pipelines processing {volume}GB daily from {sources} sources.
- **C (Impact-led):** Delivered {reliability}% pipeline reliability and cut latency from {before} hours to {after} minutes; engineered {count} Spark ETL pipelines ingesting {sources} sources at {volume}GB/day.
- **D (Concise):** Built {count} Spark ETL pipelines across {sources} sources at {volume}GB/day, {reliability}% reliability, latency from {before}h to {after}min.

**Variables:**
  - `{count}`: 10 to 50, step 10 (integer)
  - `{sources}`: 5 to 30, step 5 (integer)
  - `{volume}`: 100 to 5000, step 500 (integer)
  - `{reliability}`: 99 to 99.9, step 0.1 (percentage)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0010
**Role:** data-engineer | **Theme:** data-warehousing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Snowflake, dbt, data modeling, dimensional modeling, data warehouse architecture

**Scope:** a Snowflake data warehouse with dbt transformations covering {models} data models across {domains} business domains for {users}K analyst users
**Result:** reducing query costs by ${savings}K per month and cutting analyst time-to-insight from {before} days to {after} hours

**Variations:**
- **A (Standard):** Architected a Snowflake warehouse with {models} dbt models across {domains} business domains for {users}K analysts, cutting query costs by ${savings}K monthly and reducing time-to-insight from {before} days to {after} hours.
- **B (Result-first):** Cut query costs by ${savings}K monthly and time-to-insight from {before} days to {after} hours by architecting Snowflake with {models} dbt models across {domains} domains for {users}K analysts.
- **C (Impact-led):** Delivered ${savings}K monthly query savings and cut time-to-insight from {before} days to {after} hours; built Snowflake warehouse with {models} dbt models across {domains} business domains.
- **D (Concise):** Architected Snowflake with {models} dbt models across {domains} domains, ${savings}K monthly savings, time-to-insight from {before}d to {after}h.

**Variables:**
  - `{models}`: 100 to 500, step 50 (integer)
  - `{domains}`: 5 to 15, step 5 (integer)
  - `{users}`: 1 to 10, step 1 (integer)
  - `{savings}`: 10 to 100, step 10 (currency)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0011
**Role:** data-scientist | **Theme:** data-visualization | **Seniority:** junior | **Verb Context:** content
**Keywords:** data visualization, Matplotlib, Seaborn, Plotly, storytelling with data, stakeholder reporting

**Scope:** {count} data visualization reports and interactive Plotly dashboards for {stakeholders} business stakeholders summarizing findings from {datasets} datasets
**Result:** increasing stakeholder engagement with analytics from {before} to {after} monthly active users and reducing follow-up data requests by {reduction}%

**Variations:**
- **A (Standard):** Developed {count} Plotly dashboards and visualization reports for {stakeholders} stakeholders across {datasets} datasets, growing analytics engagement from {before} to {after} monthly users and reducing follow-up requests by {reduction}%.
- **B (Result-first):** Grew analytics engagement from {before} to {after} monthly users and cut follow-up requests by {reduction}% by creating {count} Plotly dashboards and reports for {stakeholders} stakeholders.
- **C (Impact-led):** Grew monthly analytics engagement from {before} to {after} users and cut follow-up requests {reduction}%; developed {count} Plotly dashboards and visual reports covering {datasets} datasets.
- **D (Concise):** Created {count} Plotly dashboards for {stakeholders} stakeholders, analytics users from {before} to {after}, follow-up requests down {reduction}%.

**Variables:**
  - `{count}`: 10 to 40, step 5 (integer)
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{datasets}`: 5 to 20, step 5 (integer)
  - `{before}`: 10 to 50, step 10 (integer)
  - `{after}`: 50 to 200, step 50 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### DATA-0012
**Role:** bi-analyst | **Theme:** executive-reporting | **Seniority:** mid | **Verb Context:** content
**Keywords:** executive reporting, C-suite dashboards, board reporting, financial KPIs, business performance

**Scope:** a weekly C-suite performance pack and {count} board-level dashboards tracking {kpis} KPIs across revenue, growth, and operational efficiency
**Result:** reducing executive reporting preparation time from {before} hours to {after} hours per week and improving board meeting data confidence score from {before_score} to {after_score} out of 10

**Variations:**
- **A (Standard):** Designed weekly C-suite reporting and {count} board dashboards tracking {kpis} KPIs, cutting prep time from {before} to {after} hours weekly and improving board data confidence from {before_score} to {after_score}/10.
- **B (Result-first):** Cut exec reporting prep from {before} to {after} hours weekly and improved board confidence from {before_score} to {after_score}/10 by building weekly C-suite packs and {count} dashboards tracking {kpis} KPIs.
- **C (Impact-led):** Improved board data confidence from {before_score} to {after_score}/10 and cut reporting prep from {before} to {after} hours; built C-suite pack and {count} dashboards tracking {kpis} KPIs.
- **D (Concise):** Built C-suite pack and {count} dashboards for {kpis} KPIs, prep down from {before} to {after} hours, board confidence from {before_score} to {after_score}/10.

**Variables:**
  - `{count}`: 3 to 10, step 1 (integer)
  - `{kpis}`: 20 to 60, step 10 (integer)
  - `{before}`: 10 to 20, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{before_score}`: 5 to 7, step 1 (integer)
  - `{after_score}`: 8 to 10, step 1 (integer)

### DATA-0013
**Role:** data-engineer | **Theme:** data-quality | **Seniority:** junior | **Verb Context:** systems
**Keywords:** data quality, Great Expectations, data validation, data testing, anomaly detection

**Scope:** data quality validation checks using Great Expectations across {pipelines} data pipelines covering {checks} data quality rules
**Result:** catching {issues} upstream data issues per month before reaching production and reducing data quality incidents reported by analysts by {reduction}%

**Variations:**
- **A (Standard):** Implemented Great Expectations validation across {pipelines} pipelines with {checks} quality rules, catching {issues} upstream issues monthly before production and reducing analyst-reported incidents by {reduction}%.
- **B (Result-first):** Reduced analyst-reported data incidents by {reduction}% and caught {issues} upstream issues monthly by implementing Great Expectations across {pipelines} pipelines with {checks} rules.
- **C (Impact-led):** Cut analyst-reported incidents {reduction}% and intercepted {issues} data issues monthly pre-production; deployed Great Expectations across {pipelines} pipelines with {checks} quality rules.
- **D (Concise):** Deployed Great Expectations across {pipelines} pipelines with {checks} rules, caught {issues} issues/month pre-production, incidents down {reduction}%.

**Variables:**
  - `{pipelines}`: 10 to 50, step 10 (integer)
  - `{checks}`: 50 to 300, step 50 (integer)
  - `{issues}`: 20 to 100, step 10 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0014
**Role:** data-scientist | **Theme:** model-deployment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model deployment, FastAPI, model serving, REST API, production ML, latency

**Scope:** a model serving layer using FastAPI for {models} production ML models handling {requests}K predictions per day
**Result:** achieving {latency}ms median inference latency and {uptime}% API uptime while reducing serving infrastructure cost by ${savings}K per month

**Variations:**
- **A (Standard):** Deployed a FastAPI model serving layer for {models} production models handling {requests}K predictions daily, achieving {latency}ms median latency, {uptime}% uptime, and saving ${savings}K monthly.
- **B (Result-first):** Achieved {latency}ms median latency and {uptime}% uptime while saving ${savings}K monthly by deploying FastAPI serving for {models} models processing {requests}K daily predictions.
- **C (Impact-led):** Delivered {latency}ms median inference latency, {uptime}% uptime, and ${savings}K monthly savings; built FastAPI serving layer for {models} models handling {requests}K daily predictions.
- **D (Concise):** Built FastAPI serving for {models} models at {requests}K predictions/day, {latency}ms median latency, {uptime}% uptime, ${savings}K monthly savings.

**Variables:**
  - `{models}`: 5 to 20, step 5 (integer)
  - `{requests}`: 100 to 5000, step 100 (integer)
  - `{latency}`: 10 to 50, step 5 (integer)
  - `{uptime}`: 99.5 to 99.99, step 0.1 (percentage)
  - `{savings}`: 5 to 50, step 5 (currency)

### DATA-0015
**Role:** bi-analyst | **Theme:** self-service-analytics | **Seniority:** senior | **Verb Context:** operations
**Keywords:** self-service analytics, data democratization, Looker, training, data literacy

**Scope:** a self-service analytics program rolling out Looker to {users}K business users across {departments} departments, including {sessions} training sessions and documentation
**Result:** reducing ad-hoc data requests to the data team by {reduction}% and increasing weekly active Looker users from {before} to {after}

**Variations:**
- **A (Standard):** Established a self-service Looker program for {users}K users across {departments} departments with {sessions} training sessions, reducing ad-hoc data requests by {reduction}% and growing weekly active users from {before} to {after}.
- **B (Result-first):** Reduced ad-hoc data requests by {reduction}% and grew weekly active Looker users from {before} to {after} by rolling out self-service analytics to {users}K users across {departments} departments.
- **C (Impact-led):** Cut ad-hoc requests {reduction}% and grew weekly active users from {before} to {after}; launched Looker self-service program for {users}K users across {departments} departments with {sessions} training sessions.
- **D (Concise):** Launched Looker self-service for {users}K users across {departments} departments, ad-hoc requests down {reduction}%, weekly actives from {before} to {after}.

**Variables:**
  - `{users}`: 1 to 10, step 1 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{sessions}`: 5 to 30, step 5 (integer)
  - `{reduction}`: 30 to 60, step 5 (percentage)
  - `{before}`: 50 to 200, step 50 (integer)
  - `{after}`: 200 to 1000, step 100 (integer)

### DATA-0016
**Role:** data-scientist | **Theme:** machine-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** machine learning, scikit-learn, model training, feature engineering, predictive modeling

**Scope:** a churn prediction model using gradient boosting on a dataset of {records}K customer records with {features} engineered features
**Result:** achieving {auc} AUC-ROC and enabling the retention team to reduce monthly churn by {churn}% through targeted interventions

**Variations:**
- **A (Standard):** Developed a gradient boosting churn prediction model on {records}K records with {features} engineered features, achieving {auc} AUC-ROC and enabling a {churn}% monthly churn reduction.
- **B (Result-first):** Reduced monthly churn by {churn}% by developing a gradient boosting model on {records}K records achieving {auc} AUC-ROC with {features} engineered features.
- **C (Impact-led):** Drove a {churn}% monthly churn reduction; built gradient boosting model on {records}K customer records with {features} features, achieving {auc} AUC-ROC.
- **D (Concise):** Built churn model on {records}K records with {features} features, {auc} AUC-ROC, enabled {churn}% monthly churn reduction.

**Variables:**
  - `{records}`: 100 to 5000, step 100 (integer)
  - `{features}`: 20 to 100, step 10 (integer)
  - `{auc}`: 0.85 to 0.97, step 0.01 (integer)
  - `{churn}`: 10 to 35, step 5 (percentage)

### DATA-0017
**Role:** data-scientist | **Theme:** statistical-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** A/B testing, statistical significance, hypothesis testing, experimentation platform, causal inference

**Scope:** a company-wide experimentation platform supporting {experiments} concurrent A/B tests across {products} product surfaces
**Result:** reducing time-to-decision on experiments from {before} weeks to {after} days and increasing experiment throughput by {throughput}%

**Variations:**
- **A (Standard):** Architected a company-wide experimentation platform running {experiments} concurrent A/B tests across {products} product surfaces, cutting decision time from {before} weeks to {after} days and increasing throughput by {throughput}%.
- **B (Result-first):** Cut experiment decision time from {before} weeks to {after} days and increased throughput by {throughput}% by architecting an A/B testing platform supporting {experiments} concurrent tests across {products} surfaces.
- **C (Impact-led):** Accelerated experiment decisions from {before} weeks to {after} days and boosted throughput by {throughput}%; established company-wide A/B platform handling {experiments} concurrent tests across {products} surfaces.
- **D (Concise):** Built A/B platform for {experiments} concurrent tests across {products} surfaces, decisions from {before}wk to {after}d, throughput up {throughput}%.

**Variables:**
  - `{experiments}`: 10 to 50, step 5 (integer)
  - `{products}`: 3 to 10, step 1 (integer)
  - `{before}`: 3 to 8, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{throughput}`: 30 to 100, step 10 (percentage)

### DATA-0018
**Role:** data-analyst | **Theme:** sql-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SQL, BigQuery, data analysis, query optimization, business intelligence

**Scope:** a library of {queries} reusable SQL queries in BigQuery for {teams} business teams, optimizing {slow} slow-running queries exceeding 60-second execution time
**Result:** reducing average query runtime from {before} seconds to {after} seconds and saving analysts {hours} hours per week in query wait time

**Variations:**
- **A (Standard):** Built a library of {queries} reusable BigQuery SQL queries for {teams} business teams and optimized {slow} slow queries, reducing average runtime from {before}s to {after}s and saving {hours} analyst hours weekly.
- **B (Result-first):** Saved analysts {hours} hours weekly and cut average query runtime from {before}s to {after}s by building a {queries}-query BigQuery library and optimizing {slow} slow-running queries.
- **C (Impact-led):** Saved {hours} analyst hours weekly and cut average query time from {before}s to {after}s; built {queries}-query BigQuery library and optimized {slow} slow queries for {teams} business teams.
- **D (Concise):** Built {queries}-query BigQuery library for {teams} teams, optimized {slow} slow queries, avg runtime from {before}s to {after}s, saved {hours} hours/week.

**Variables:**
  - `{queries}`: 50 to 300, step 50 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{slow}`: 10 to 50, step 5 (integer)
  - `{before}`: 120 to 300, step 30 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{hours}`: 5 to 20, step 5 (integer)

### DATA-0019
**Role:** data-analyst | **Theme:** dashboard-creation | **Seniority:** mid | **Verb Context:** content
**Keywords:** Tableau, Power BI, Looker, dashboards, data visualization, self-service analytics

**Scope:** {count} executive and operational dashboards in Tableau consolidating data from {sources} sources for {stakeholders} stakeholders across {departments} departments
**Result:** replacing {reports} manual weekly reports and saving {hours} hours of manual reporting effort per month

**Variations:**
- **A (Standard):** Designed {count} Tableau dashboards consolidating {sources} data sources for {stakeholders} stakeholders across {departments} departments, replacing {reports} manual weekly reports and saving {hours} hours monthly.
- **B (Result-first):** Saved {hours} monthly reporting hours and replaced {reports} manual reports by building {count} Tableau dashboards consolidating {sources} data sources for {stakeholders} stakeholders.
- **C (Impact-led):** Eliminated {hours} monthly reporting hours and replaced {reports} manual reports; built {count} Tableau dashboards unifying {sources} sources for {stakeholders} stakeholders across {departments} departments.
- **D (Concise):** Built {count} Tableau dashboards across {departments} departments, replaced {reports} manual reports, saved {hours} hours/month.

**Variables:**
  - `{count}`: 5 to 30, step 5 (integer)
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{stakeholders}`: 10 to 100, step 10 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{hours}`: 20 to 100, step 10 (integer)

### DATA-0020
**Role:** data-analyst | **Theme:** reporting | **Seniority:** junior | **Verb Context:** content
**Keywords:** reporting, Excel, Python, data cleaning, business reporting, stakeholder updates

**Scope:** weekly business performance reports for {stakeholders} stakeholders by compiling data from {sources} sources and automating {reports} recurring reports using Python
**Result:** reducing report preparation time from {before} hours to {after} hours per week and improving data accuracy by eliminating {errors} recurring manual errors

**Variations:**
- **A (Standard):** Compiled weekly performance reports for {stakeholders} stakeholders from {sources} sources and automated {reports} recurring reports in Python, cutting prep time from {before} to {after} hours weekly and eliminating {errors} manual errors.
- **B (Result-first):** Reduced report prep from {before} to {after} hours weekly and eliminated {errors} manual errors by automating {reports} recurring reports in Python for {stakeholders} stakeholders.
- **C (Impact-led):** Cut weekly report prep from {before} to {after} hours and eliminated {errors} recurring errors; automated {reports} reports in Python serving {stakeholders} stakeholders across {sources} data sources.
- **D (Concise):** Automated {reports} reports in Python for {stakeholders} stakeholders, prep time from {before} to {after} hours, eliminated {errors} manual errors.

**Variables:**
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{sources}`: 3 to 10, step 1 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{before}`: 8 to 20, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{errors}`: 5 to 20, step 5 (integer)

### DATA-0021
**Role:** bi-analyst | **Theme:** kpi-tracking | **Seniority:** mid | **Verb Context:** content
**Keywords:** KPIs, metrics framework, OKRs, business performance, data governance

**Scope:** a company-wide KPI framework of {kpis} metrics across {departments} departments, aligning definitions with {stakeholders} business stakeholders and documenting in a central data dictionary
**Result:** reducing metric definition disputes by {disputes}% and enabling {reports} cross-functional reports to reference a single source of truth

**Variations:**
- **A (Standard):** Designed a company-wide KPI framework of {kpis} metrics across {departments} departments, reducing metric disputes by {disputes}% and enabling {reports} cross-functional reports from a single source of truth.
- **B (Result-first):** Reduced metric disputes by {disputes}% by designing a {kpis}-metric KPI framework across {departments} departments with a central data dictionary for {reports} cross-functional reports.
- **C (Impact-led):** Cut metric disputes {disputes}% and unified {reports} cross-functional reports on a single source of truth; built {kpis}-metric KPI framework across {departments} departments.
- **D (Concise):** Built {kpis}-metric KPI framework across {departments} departments, disputes down {disputes}%, enabled {reports} unified cross-functional reports.

**Variables:**
  - `{kpis}`: 50 to 200, step 25 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{disputes}`: 40 to 80, step 10 (percentage)
  - `{reports}`: 10 to 50, step 10 (integer)

### DATA-0022
**Role:** ml-engineer | **Theme:** mlops | **Seniority:** senior | **Verb Context:** systems
**Keywords:** MLOps, MLflow, model registry, model monitoring, feature store, ML platform

**Scope:** an ML platform using MLflow and a feature store serving {models} production models across {teams} data science teams
**Result:** reducing model deployment time from {before} weeks to {after} days and cutting model-related production incidents by {incidents}% year-over-year

**Variations:**
- **A (Standard):** Established an MLOps platform using MLflow and feature store serving {models} production models for {teams} teams, cutting deployment time from {before} weeks to {after} days and reducing production incidents by {incidents}% YoY.
- **B (Result-first):** Cut model deployment from {before} weeks to {after} days and reduced production incidents by {incidents}% YoY by building an MLflow-based platform serving {models} models for {teams} teams.
- **C (Impact-led):** Slashed model deployment from {before} weeks to {after} days and cut production incidents {incidents}% YoY; built MLOps platform with MLflow and feature store serving {models} models across {teams} teams.
- **D (Concise):** Built MLOps platform for {models} models across {teams} teams, deployment from {before}wk to {after}d, incidents down {incidents}% YoY.

**Variables:**
  - `{models}`: 10 to 50, step 10 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{incidents}`: 40 to 70, step 5 (percentage)

### DATA-0023
**Role:** ml-engineer | **Theme:** pipeline-automation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Apache Airflow, pipeline orchestration, ETL automation, data pipeline, workflow automation

**Scope:** {count} automated ML training pipelines using Apache Airflow processing {records}M records daily across {models} model families
**Result:** reducing manual data scientist intervention from {before} hours to {after} hours per week and improving model freshness from weekly to daily retraining

**Variations:**
- **A (Standard):** Built {count} Airflow ML training pipelines processing {records}M records daily across {models} model families, cutting manual DS intervention from {before} to {after} hours weekly and enabling daily model retraining.
- **B (Result-first):** Reduced manual intervention from {before} to {after} hours weekly and enabled daily model retraining by automating {count} Airflow pipelines processing {records}M records across {models} model families.
- **C (Impact-led):** Cut manual DS work from {before} to {after} hours weekly and upgraded retraining from weekly to daily; automated {count} Airflow pipelines processing {records}M records across {models} model families.
- **D (Concise):** Automated {count} Airflow ML pipelines across {models} models processing {records}M records/day, manual work from {before} to {after} hours/week.

**Variables:**
  - `{count}`: 5 to 20, step 5 (integer)
  - `{records}`: 1 to 100, step 5 (integer)
  - `{models}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 40, step 5 (integer)
  - `{after}`: 2 to 5, step 1 (integer)

### DATA-0024
**Role:** data-engineer | **Theme:** etl-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ETL, Apache Spark, data ingestion, pipeline reliability, data integration

**Scope:** {count} Spark-based ETL pipelines ingesting {sources} data sources processing {volume}GB of data daily into a central data warehouse
**Result:** achieving {reliability}% pipeline reliability and reducing data latency from {before} hours to {after} minutes for downstream consumers

**Variations:**
- **A (Standard):** Built {count} Spark ETL pipelines ingesting {sources} sources and {volume}GB daily, achieving {reliability}% reliability and reducing data latency from {before} hours to {after} minutes.
- **B (Result-first):** Achieved {reliability}% pipeline reliability and cut data latency from {before} hours to {after} minutes by building {count} Spark ETL pipelines processing {volume}GB daily from {sources} sources.
- **C (Impact-led):** Delivered {reliability}% pipeline reliability and cut latency from {before} hours to {after} minutes; engineered {count} Spark ETL pipelines ingesting {sources} sources at {volume}GB/day.
- **D (Concise):** Built {count} Spark ETL pipelines across {sources} sources at {volume}GB/day, {reliability}% reliability, latency from {before}h to {after}min.

**Variables:**
  - `{count}`: 10 to 50, step 10 (integer)
  - `{sources}`: 5 to 30, step 5 (integer)
  - `{volume}`: 100 to 5000, step 500 (integer)
  - `{reliability}`: 99 to 99.9, step 0.1 (percentage)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0025
**Role:** data-engineer | **Theme:** data-warehousing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Snowflake, dbt, data modeling, dimensional modeling, data warehouse architecture

**Scope:** a Snowflake data warehouse with dbt transformations covering {models} data models across {domains} business domains for {users}K analyst users
**Result:** reducing query costs by ${savings}K per month and cutting analyst time-to-insight from {before} days to {after} hours

**Variations:**
- **A (Standard):** Architected a Snowflake warehouse with {models} dbt models across {domains} business domains for {users}K analysts, cutting query costs by ${savings}K monthly and reducing time-to-insight from {before} days to {after} hours.
- **B (Result-first):** Cut query costs by ${savings}K monthly and time-to-insight from {before} days to {after} hours by architecting Snowflake with {models} dbt models across {domains} domains for {users}K analysts.
- **C (Impact-led):** Delivered ${savings}K monthly query savings and cut time-to-insight from {before} days to {after} hours; built Snowflake warehouse with {models} dbt models across {domains} business domains.
- **D (Concise):** Architected Snowflake with {models} dbt models across {domains} domains, ${savings}K monthly savings, time-to-insight from {before}d to {after}h.

**Variables:**
  - `{models}`: 100 to 500, step 50 (integer)
  - `{domains}`: 5 to 15, step 5 (integer)
  - `{users}`: 1 to 10, step 1 (integer)
  - `{savings}`: 10 to 100, step 10 (currency)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0026
**Role:** data-scientist | **Theme:** data-visualization | **Seniority:** junior | **Verb Context:** content
**Keywords:** data visualization, Matplotlib, Seaborn, Plotly, storytelling with data, stakeholder reporting

**Scope:** {count} data visualization reports and interactive Plotly dashboards for {stakeholders} business stakeholders summarizing findings from {datasets} datasets
**Result:** increasing stakeholder engagement with analytics from {before} to {after} monthly active users and reducing follow-up data requests by {reduction}%

**Variations:**
- **A (Standard):** Developed {count} Plotly dashboards and visualization reports for {stakeholders} stakeholders across {datasets} datasets, growing analytics engagement from {before} to {after} monthly users and reducing follow-up requests by {reduction}%.
- **B (Result-first):** Grew analytics engagement from {before} to {after} monthly users and cut follow-up requests by {reduction}% by creating {count} Plotly dashboards and reports for {stakeholders} stakeholders.
- **C (Impact-led):** Grew monthly analytics engagement from {before} to {after} users and cut follow-up requests {reduction}%; developed {count} Plotly dashboards and visual reports covering {datasets} datasets.
- **D (Concise):** Created {count} Plotly dashboards for {stakeholders} stakeholders, analytics users from {before} to {after}, follow-up requests down {reduction}%.

**Variables:**
  - `{count}`: 10 to 40, step 5 (integer)
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{datasets}`: 5 to 20, step 5 (integer)
  - `{before}`: 10 to 50, step 10 (integer)
  - `{after}`: 50 to 200, step 50 (integer)
  - `{reduction}`: 20 to 50, step 5 (percentage)

### DATA-0027
**Role:** bi-analyst | **Theme:** executive-reporting | **Seniority:** mid | **Verb Context:** content
**Keywords:** executive reporting, C-suite dashboards, board reporting, financial KPIs, business performance

**Scope:** a weekly C-suite performance pack and {count} board-level dashboards tracking {kpis} KPIs across revenue, growth, and operational efficiency
**Result:** reducing executive reporting preparation time from {before} hours to {after} hours per week and improving board meeting data confidence score from {before_score} to {after_score} out of 10

**Variations:**
- **A (Standard):** Designed weekly C-suite reporting and {count} board dashboards tracking {kpis} KPIs, cutting prep time from {before} to {after} hours weekly and improving board data confidence from {before_score} to {after_score}/10.
- **B (Result-first):** Cut exec reporting prep from {before} to {after} hours weekly and improved board confidence from {before_score} to {after_score}/10 by building weekly C-suite packs and {count} dashboards tracking {kpis} KPIs.
- **C (Impact-led):** Improved board data confidence from {before_score} to {after_score}/10 and cut reporting prep from {before} to {after} hours; built C-suite pack and {count} dashboards tracking {kpis} KPIs.
- **D (Concise):** Built C-suite pack and {count} dashboards for {kpis} KPIs, prep down from {before} to {after} hours, board confidence from {before_score} to {after_score}/10.

**Variables:**
  - `{count}`: 3 to 10, step 1 (integer)
  - `{kpis}`: 20 to 60, step 10 (integer)
  - `{before}`: 10 to 20, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{before_score}`: 5 to 7, step 1 (integer)
  - `{after_score}`: 8 to 10, step 1 (integer)

### DATA-0028
**Role:** data-engineer | **Theme:** data-quality | **Seniority:** junior | **Verb Context:** systems
**Keywords:** data quality, Great Expectations, data validation, data testing, anomaly detection

**Scope:** data quality validation checks using Great Expectations across {pipelines} data pipelines covering {checks} data quality rules
**Result:** catching {issues} upstream data issues per month before reaching production and reducing data quality incidents reported by analysts by {reduction}%

**Variations:**
- **A (Standard):** Implemented Great Expectations validation across {pipelines} pipelines with {checks} quality rules, catching {issues} upstream issues monthly before production and reducing analyst-reported incidents by {reduction}%.
- **B (Result-first):** Reduced analyst-reported data incidents by {reduction}% and caught {issues} upstream issues monthly by implementing Great Expectations across {pipelines} pipelines with {checks} rules.
- **C (Impact-led):** Cut analyst-reported incidents {reduction}% and intercepted {issues} data issues monthly pre-production; deployed Great Expectations across {pipelines} pipelines with {checks} quality rules.
- **D (Concise):** Deployed Great Expectations across {pipelines} pipelines with {checks} rules, caught {issues} issues/month pre-production, incidents down {reduction}%.

**Variables:**
  - `{pipelines}`: 10 to 50, step 10 (integer)
  - `{checks}`: 50 to 300, step 50 (integer)
  - `{issues}`: 20 to 100, step 10 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0029
**Role:** data-scientist | **Theme:** model-deployment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model deployment, FastAPI, model serving, REST API, production ML, latency

**Scope:** a model serving layer using FastAPI for {models} production ML models handling {requests}K predictions per day
**Result:** achieving {latency}ms median inference latency and {uptime}% API uptime while reducing serving infrastructure cost by ${savings}K per month

**Variations:**
- **A (Standard):** Deployed a FastAPI model serving layer for {models} production models handling {requests}K predictions daily, achieving {latency}ms median latency, {uptime}% uptime, and saving ${savings}K monthly.
- **B (Result-first):** Achieved {latency}ms median latency and {uptime}% uptime while saving ${savings}K monthly by deploying FastAPI serving for {models} models processing {requests}K daily predictions.
- **C (Impact-led):** Delivered {latency}ms median inference latency, {uptime}% uptime, and ${savings}K monthly savings; built FastAPI serving layer for {models} models handling {requests}K daily predictions.
- **D (Concise):** Built FastAPI serving for {models} models at {requests}K predictions/day, {latency}ms median latency, {uptime}% uptime, ${savings}K monthly savings.

**Variables:**
  - `{models}`: 5 to 20, step 5 (integer)
  - `{requests}`: 100 to 5000, step 100 (integer)
  - `{latency}`: 10 to 50, step 5 (integer)
  - `{uptime}`: 99.5 to 99.99, step 0.1 (percentage)
  - `{savings}`: 5 to 50, step 5 (currency)

### DATA-0030
**Role:** bi-analyst | **Theme:** self-service-analytics | **Seniority:** senior | **Verb Context:** operations
**Keywords:** self-service analytics, data democratization, Looker, training, data literacy

**Scope:** a self-service analytics program rolling out Looker to {users}K business users across {departments} departments, including {sessions} training sessions and documentation
**Result:** reducing ad-hoc data requests to the data team by {reduction}% and increasing weekly active Looker users from {before} to {after}

**Variations:**
- **A (Standard):** Established a self-service Looker program for {users}K users across {departments} departments with {sessions} training sessions, reducing ad-hoc data requests by {reduction}% and growing weekly active users from {before} to {after}.
- **B (Result-first):** Reduced ad-hoc data requests by {reduction}% and grew weekly active Looker users from {before} to {after} by rolling out self-service analytics to {users}K users across {departments} departments.
- **C (Impact-led):** Cut ad-hoc requests {reduction}% and grew weekly active users from {before} to {after}; launched Looker self-service program for {users}K users across {departments} departments with {sessions} training sessions.
- **D (Concise):** Launched Looker self-service for {users}K users across {departments} departments, ad-hoc requests down {reduction}%, weekly actives from {before} to {after}.

**Variables:**
  - `{users}`: 1 to 10, step 1 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{sessions}`: 5 to 30, step 5 (integer)
  - `{reduction}`: 30 to 60, step 5 (percentage)
  - `{before}`: 50 to 200, step 50 (integer)
  - `{after}`: 200 to 1000, step 100 (integer)

### DATA-0031
**Role:** data-engineer | **Theme:** streaming-ingestion | **Seniority:** mid | **Verb Context:** systems
**Keywords:** streaming ingestion, Kafka, Kinesis, real-time data, event streaming, CDC

**Scope:** a real-time streaming ingestion pipeline using Apache Kafka consuming {events}M events per day from {sources} upstream systems via CDC and API feeds, landing data into {targets} downstream stores
**Result:** reducing data freshness lag from {before} minutes to {after} seconds and supporting {consumers} downstream consumer teams

**Variations:**
- **A (Standard):** Built Kafka streaming pipeline consuming {events}M daily events from {sources} upstream systems via CDC, reducing data freshness from {before} minutes to {after} seconds for {consumers} consumer teams.
- **B (Result-first):** Reduced data freshness from {before} minutes to {after} seconds by building Kafka streaming pipeline consuming {events}M daily events from {sources} upstream systems.
- **C (Impact-led):** Cut data freshness from {before} minutes to {after} seconds supporting {consumers} consumer teams; built Kafka pipeline consuming {events}M daily events from {sources} systems into {targets} stores.
- **D (Concise):** Built Kafka streaming pipeline at {events}M events/day from {sources} systems, freshness from {before}min to {after}s, {consumers} consumer teams served.

**Variables:**
  - `{events}`: 1 to 100, step 5 (integer)
  - `{sources}`: 5 to 30, step 5 (integer)
  - `{targets}`: 3 to 10, step 1 (integer)
  - `{before}`: 30 to 120, step 15 (integer)
  - `{after}`: 2 to 10, step 2 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)

### DATA-0032
**Role:** data-engineer | **Theme:** data-lakehouse | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data lakehouse, Delta Lake, Iceberg, Apache Hudi, ACID transactions, lakehouse architecture

**Scope:** a data lakehouse on Apache Iceberg spanning {tables}K tables and {volume}PB of data, replacing a fragmented legacy warehouse and data lake architecture across {teams} consuming teams
**Result:** reducing query costs by ${savings}K per month and cutting time-to-insight for new datasets from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Architected an Iceberg data lakehouse with {tables}K tables and {volume}PB of data, replacing legacy architecture, saving ${savings}K/month in query costs and cutting time-to-insight from {before} weeks to {after} days.
- **B (Result-first):** Saved ${savings}K/month in query costs and cut time-to-insight from {before} weeks to {after} days by architecting an Iceberg lakehouse with {tables}K tables and {volume}PB of data.
- **C (Impact-led):** Saved ${savings}K/month and cut time-to-insight from {before} weeks to {after} days; architected Iceberg lakehouse with {tables}K tables and {volume}PB replacing legacy warehouse and lake for {teams} teams.
- **D (Concise):** Architected Iceberg lakehouse at {tables}K tables and {volume}PB, ${savings}K/month saved, time-to-insight from {before}wk to {after}d.

**Variables:**
  - `{tables}`: 1 to 50, step 1 (integer)
  - `{volume}`: 1 to 20, step 1 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{savings}`: 20 to 300, step 20 (currency)
  - `{before}`: 2 to 8, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0033
**Role:** data-engineer | **Theme:** data-mesh | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data mesh, data products, domain ownership, data contracts, federated governance, data platform

**Scope:** a data mesh transformation across {domains} business domains, establishing {products} data products with ownership, SLAs, and data contracts, migrating from a centralized {team_before}-person data team model
**Result:** reducing data request backlog from {before} requests to {after} requests and increasing data consumer satisfaction from {sat_before} to {sat_after}/10

**Variations:**
- **A (Standard):** Led data mesh transformation across {domains} domains with {products} data products and data contracts, cutting request backlog from {before} to {after} and growing consumer satisfaction from {sat_before} to {sat_after}/10.
- **B (Result-first):** Reduced data backlog from {before} to {after} requests and grew satisfaction from {sat_before} to {sat_after}/10 by leading data mesh across {domains} domains with {products} data products.
- **C (Impact-led):** Cut backlog from {before} to {after} and grew satisfaction from {sat_before} to {sat_after}/10; led data mesh across {domains} domains establishing {products} data products with ownership and SLAs.
- **D (Concise):** Led data mesh across {domains} domains with {products} data products, backlog from {before} to {after}, satisfaction from {sat_before} to {sat_after}/10.

**Variables:**
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{products}`: 10 to 100, step 10 (integer)
  - `{team_before}`: 5 to 20, step 5 (integer)
  - `{before}`: 100 to 500, step 50 (integer)
  - `{after}`: 10 to 30, step 5 (integer)
  - `{sat_before}`: 4 to 6, step 1 (integer)
  - `{sat_after}`: 8 to 10, step 1 (integer)

### DATA-0034
**Role:** data-engineer | **Theme:** reverse-etl | **Seniority:** mid | **Verb Context:** systems
**Keywords:** reverse ETL, Hightouch, Census, operational analytics, data activation, CRM sync

**Scope:** a reverse ETL pipeline using Hightouch syncing {models} data models from the data warehouse to {destinations} business tools including CRM, marketing, and support platforms for {teams} operational teams
**Result:** replacing {manual_reports} manual data pulls per week and reducing data-to-action lag from {before} hours to {after} minutes

**Variations:**
- **A (Standard):** Built Hightouch reverse ETL syncing {models} models to {destinations} tools for {teams} teams, replacing {manual_reports} weekly manual pulls and cutting data-to-action from {before} hours to {after} minutes.
- **B (Result-first):** Replaced {manual_reports} weekly manual pulls and cut data-to-action from {before} hours to {after} minutes by building Hightouch reverse ETL for {models} models across {destinations} tools.
- **C (Impact-led):** Eliminated {manual_reports} weekly manual pulls and cut data-to-action from {before}h to {after}min; built Hightouch reverse ETL syncing {models} models to {destinations} tools for {teams} operational teams.
- **D (Concise):** Built Hightouch reverse ETL for {models} models across {destinations} tools, {manual_reports} manual pulls eliminated, data-to-action from {before}h to {after}min.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{destinations}`: 3 to 15, step 3 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{manual_reports}`: 10 to 100, step 10 (integer)
  - `{before}`: 12 to 48, step 6 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0035
**Role:** data-engineer | **Theme:** data-catalog | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data catalog, data discovery, Alation, Collibra, data lineage, metadata management, data governance

**Scope:** a data catalog using Collibra for {assets} data assets across {domains} domains, automating metadata ingestion from {sources} sources and establishing {stewards} data stewards across business units
**Result:** increasing data asset discoverability from {before}% to {after}% and reducing time to find trusted datasets from {find_before} days to {find_after} hours

**Variations:**
- **A (Standard):** Deployed Collibra catalog for {assets} assets across {domains} domains with {stewards} stewards, growing discoverability from {before}% to {after}% and cutting dataset find time from {find_before} days to {find_after} hours.
- **B (Result-first):** Grew data asset discoverability from {before}% to {after}% and cut find time from {find_before} days to {find_after} hours by deploying Collibra for {assets} assets across {domains} domains.
- **C (Impact-led):** Grew discoverability from {before}% to {after}% and cut find time from {find_before} days to {find_after} hours; deployed Collibra catalog for {assets} assets across {domains} domains with {stewards} data stewards.
- **D (Concise):** Deployed Collibra catalog for {assets} assets across {domains} domains with {stewards} stewards, discoverability from {before}% to {after}%, find time from {find_before}d to {find_after}h.

**Variables:**
  - `{assets}`: 1000 to 50000, step 1000 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{sources}`: 10 to 50, step 10 (integer)
  - `{stewards}`: 10 to 50, step 10 (integer)
  - `{before}`: 20 to 50, step 5 (percentage)
  - `{after}`: 75 to 95, step 5 (percentage)
  - `{find_before}`: 3 to 10, step 1 (integer)
  - `{find_after}`: 1 to 4, step 1 (integer)

### DATA-0036
**Role:** data-engineer | **Theme:** dbt-transformation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** dbt, data transformation, SQL modeling, dbt Cloud, data testing, transformation layer

**Scope:** a dbt transformation layer with {models} models across {layers} semantic layers including staging, intermediate, and mart, with {tests} data tests and automated documentation for {consumers} data consumers
**Result:** reducing transformation failures from {before} per week to {after} per month and cutting query duplication across {queries} analyst-facing queries by {dedup}%

**Variations:**
- **A (Standard):** Built dbt layer with {models} models across {layers} layers and {tests} data tests, cutting transformation failures from {before}/week to {after}/month and deduplicating {dedup}% across {queries} analyst queries.
- **B (Result-first):** Reduced failures from {before}/week to {after}/month and deduplicated {dedup}% across {queries} queries by building dbt layer with {models} models and {tests} tests.
- **C (Impact-led):** Cut failures from {before}/week to {after}/month and deduplicated {dedup}% across {queries} queries; built dbt layer with {models} models, {layers} layers, and {tests} tests.
- **D (Concise):** Built dbt layer with {models} models, {layers} layers, {tests} tests, failures from {before}/week to {after}/month, {dedup}% query deduplication.

**Variables:**
  - `{models}`: 50 to 500, step 50 (integer)
  - `{layers}`: 3 to 5, step 1 (integer)
  - `{tests}`: 100 to 2000, step 100 (integer)
  - `{consumers}`: 5 to 50, step 5 (integer)
  - `{before}`: 10 to 50, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)
  - `{queries}`: 50 to 500, step 50 (integer)
  - `{dedup}`: 30 to 70, step 5 (percentage)

### DATA-0037
**Role:** data-engineer | **Theme:** query-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** query optimization, query performance, Snowflake, BigQuery, query tuning, cost optimization, compute cost

**Scope:** query optimization across {queries} high-cost queries in Snowflake, analyzing execution plans, rewriting SQL, and implementing clustering keys and materialized views across {tables} tables
**Result:** reducing average query runtime from {before} seconds to {after} seconds and cutting monthly compute spend by ${savings}K

**Variations:**
- **A (Standard):** Optimized {queries} high-cost Snowflake queries through plan analysis, SQL rewrites, and clustering across {tables} tables, cutting average runtime from {before}s to {after}s and monthly compute by ${savings}K.
- **B (Result-first):** Reduced average query runtime from {before}s to {after}s and cut compute spend by ${savings}K/month by optimizing {queries} queries across {tables} tables with clustering and materialized views.
- **C (Impact-led):** Cut runtime from {before}s to {after}s and saved ${savings}K/month in compute; optimized {queries} high-cost Snowflake queries with plan analysis, SQL rewrites, and clustering across {tables} tables.
- **D (Concise):** Optimized {queries} high-cost Snowflake queries across {tables} tables, runtime from {before}s to {after}s, compute spend down ${savings}K/month.

**Variables:**
  - `{queries}`: 20 to 200, step 20 (integer)
  - `{tables}`: 50 to 500, step 50 (integer)
  - `{before}`: 60 to 600, step 60 (integer)
  - `{after}`: 2 to 15, step 1 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0038
**Role:** data-engineer | **Theme:** data-contracts | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data contracts, schema enforcement, SLA, data producers, data consumers, data quality SLA

**Scope:** a data contract framework for {contracts} producer-consumer pairs across {domains} domains, defining schema, SLA, and freshness guarantees with automated validation in {pipelines} pipelines
**Result:** reducing SLA-breaking data incidents from {before} per month to {after} per quarter and increasing data consumer trust score from {trust_before} to {trust_after}/10

**Variations:**
- **A (Standard):** Built data contract framework for {contracts} pairs across {domains} domains with automated validation in {pipelines} pipelines, cutting SLA incidents from {before}/month to {after}/quarter and growing trust from {trust_before} to {trust_after}/10.
- **B (Result-first):** Reduced SLA incidents from {before}/month to {after}/quarter and grew trust from {trust_before} to {trust_after}/10 by building data contract framework for {contracts} pairs across {domains} domains.
- **C (Impact-led):** Cut SLA incidents from {before}/month to {after}/quarter and grew trust from {trust_before} to {trust_after}/10; deployed data contracts for {contracts} producer-consumer pairs across {domains} domains.
- **D (Concise):** Built data contracts for {contracts} pairs across {domains} domains with {pipelines} pipeline validation, SLA incidents from {before}/month to {after}/quarter, trust from {trust_before} to {trust_after}/10.

**Variables:**
  - `{contracts}`: 20 to 200, step 20 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 1 to 5, step 1 (integer)
  - `{trust_before}`: 4 to 6, step 1 (integer)
  - `{trust_after}`: 8 to 10, step 1 (integer)

### DATA-0039
**Role:** data-analyst | **Theme:** cohort-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** cohort analysis, retention analysis, user lifecycle, behavioral analytics, SQL, product analytics

**Scope:** cohort retention analysis for {cohorts} monthly user cohorts across {segments} behavioral segments, tracking {events} lifecycle events from acquisition through {months}-month retention windows
**Result:** identifying {findings} actionable retention insights that informed {experiments} product experiments and contributed to a {retention}% improvement in D90 retention

**Variations:**
- **A (Standard):** Built cohort retention analysis for {cohorts} monthly cohorts across {segments} segments tracking {events} lifecycle events, identifying {findings} insights that drove {experiments} experiments and improved D90 retention {retention}%.
- **B (Result-first):** Identified {findings} retention insights driving {experiments} experiments and improving D90 retention {retention}% by building cohort analysis for {cohorts} cohorts across {segments} segments.
- **C (Impact-led):** Uncovered {findings} insights driving {experiments} experiments and {retention}% D90 retention improvement; built cohort analysis for {cohorts} monthly cohorts across {segments} segments and {events} lifecycle events.
- **D (Concise):** Built cohort analysis for {cohorts} cohorts across {segments} segments, {findings} insights, {experiments} experiments, D90 retention up {retention}%.

**Variables:**
  - `{cohorts}`: 6 to 24, step 6 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{events}`: 10 to 50, step 10 (integer)
  - `{months}`: 3 to 12, step 3 (integer)
  - `{findings}`: 5 to 20, step 5 (integer)
  - `{experiments}`: 3 to 10, step 1 (integer)
  - `{retention}`: 10 to 40, step 5 (percentage)

### DATA-0040
**Role:** data-analyst | **Theme:** funnel-analysis | **Seniority:** junior | **Verb Context:** systems
**Keywords:** funnel analysis, conversion funnel, drop-off analysis, product analytics, Mixpanel, Amplitude

**Scope:** end-to-end conversion funnel analysis across {steps} funnel steps for a {users}M-user product, identifying drop-off points across {segments} user segments and {channels} acquisition channels
**Result:** surfacing {findings} conversion opportunities that contributed to a {lift}% improvement in end-to-end funnel conversion rate

**Variations:**
- **A (Standard):** Analyzed {steps}-step conversion funnel for {users}M users across {segments} segments and {channels} channels, surfacing {findings} opportunities that contributed to {lift}% funnel conversion improvement.
- **B (Result-first):** Contributed to {lift}% funnel conversion improvement by analyzing {steps}-step funnel for {users}M users across {segments} segments and surfacing {findings} opportunities.
- **C (Impact-led):** Drove {lift}% funnel conversion improvement; analyzed {steps}-step funnel for {users}M users across {segments} segments and {channels} channels, surfacing {findings} actionable opportunities.
- **D (Concise):** Analyzed {steps}-step funnel for {users}M users across {segments} segments and {channels} channels, {findings} opportunities surfaced, {lift}% conversion improvement.

**Variables:**
  - `{steps}`: 3 to 8, step 1 (integer)
  - `{users}`: 1 to 50, step 1 (integer)
  - `{segments}`: 3 to 15, step 3 (integer)
  - `{channels}`: 3 to 10, step 1 (integer)
  - `{findings}`: 3 to 15, step 3 (integer)
  - `{lift}`: 10 to 40, step 5 (percentage)

### DATA-0041
**Role:** data-analyst | **Theme:** pricing-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pricing analysis, price elasticity, revenue optimization, pricing strategy, willingness to pay, conjoint analysis

**Scope:** a pricing analysis using price elasticity modeling and conjoint analysis across {products} product SKUs and {segments} customer segments, modeling {scenarios} pricing scenarios
**Result:** recommending a pricing strategy that increased average revenue per user by ${arpu}K annually and maintained churn within {churn}% of baseline

**Variations:**
- **A (Standard):** Conducted price elasticity and conjoint analysis across {products} SKUs and {segments} segments with {scenarios} scenarios, recommending a strategy that grew ARPU ${arpu}K annually within {churn}% churn tolerance.
- **B (Result-first):** Grew ARPU ${arpu}K annually while maintaining churn within {churn}% by delivering price elasticity and conjoint analysis across {products} SKUs and {segments} segments.
- **C (Impact-led):** Grew ARPU ${arpu}K annually within {churn}% churn tolerance; delivered price elasticity and conjoint analysis across {products} SKUs, {segments} segments, and {scenarios} pricing scenarios.
- **D (Concise):** Analyzed price elasticity across {products} SKUs and {segments} segments with {scenarios} scenarios, ARPU up ${arpu}K/year, churn within {churn}% of baseline.

**Variables:**
  - `{products}`: 5 to 50, step 5 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{scenarios}`: 3 to 10, step 1 (integer)
  - `{arpu}`: 10 to 200, step 10 (currency)
  - `{churn}`: 1 to 5, step 0.5 (percentage)

### DATA-0042
**Role:** data-analyst | **Theme:** financial-reporting | **Seniority:** mid | **Verb Context:** content
**Keywords:** financial analysis, P&L, variance analysis, budget vs actuals, financial reporting, FP&A

**Scope:** monthly and quarterly financial reporting covering {cost_centers} cost centers, producing {reports} variance reports comparing actuals to ${budget}M budget across {dimensions} financial dimensions
**Result:** reducing monthly close reporting time from {before} days to {after} days and achieving {accuracy}% forecast accuracy across {quarters} quarters

**Variations:**
- **A (Standard):** Produced monthly and quarterly variance reports for {cost_centers} cost centers against ${budget}M budget across {dimensions} dimensions, cutting close time from {before} to {after} days and achieving {accuracy}% forecast accuracy.
- **B (Result-first):** Reduced close time from {before} to {after} days and achieved {accuracy}% forecast accuracy by producing variance reports for {cost_centers} cost centers against ${budget}M budget.
- **C (Impact-led):** Cut close time from {before} to {after} days and achieved {accuracy}% forecast accuracy; produced {reports} variance reports for {cost_centers} cost centers across {dimensions} financial dimensions.
- **D (Concise):** Produced {reports} variance reports for {cost_centers} cost centers against ${budget}M budget, close time from {before} to {after} days, {accuracy}% forecast accuracy.

**Variables:**
  - `{cost_centers}`: 10 to 80, step 10 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{budget}`: 5 to 500, step 5 (currency)
  - `{dimensions}`: 5 to 15, step 5 (integer)
  - `{before}`: 5 to 15, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{accuracy}`: 88 to 99, step 1 (percentage)
  - `{quarters}`: 4 to 8, step 2 (integer)

### DATA-0043
**Role:** data-analyst | **Theme:** customer-segmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** customer segmentation, clustering, RFM analysis, behavioral segmentation, audience modeling, k-means

**Scope:** a customer segmentation model using RFM and k-means clustering across {customers}K customers and {features} behavioral features, producing {segments} actionable segments used by {teams} marketing and product teams
**Result:** improving targeted campaign conversion rate from {before}% to {after}% and reducing marketing spend waste by ${savings}K annually

**Variations:**
- **A (Standard):** Built RFM and k-means segmentation across {customers}K customers and {features} features, producing {segments} segments for {teams} teams, improving campaign conversion from {before}% to {after}% and saving ${savings}K/year.
- **B (Result-first):** Improved campaign conversion from {before}% to {after}% and saved ${savings}K annually by building RFM/k-means segmentation for {customers}K customers into {segments} actionable segments.
- **C (Impact-led):** Grew campaign conversion from {before}% to {after}% and saved ${savings}K/year; built RFM and k-means segmentation across {customers}K customers and {features} features into {segments} segments.
- **D (Concise):** Built RFM/k-means segmentation across {customers}K customers and {features} features into {segments} segments, campaign conversion from {before}% to {after}%, ${savings}K/year saved.

**Variables:**
  - `{customers}`: 10 to 1000, step 10 (integer)
  - `{features}`: 10 to 50, step 10 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{teams}`: 3 to 8, step 1 (integer)
  - `{before}`: 5 to 15, step 1 (percentage)
  - `{after}`: 18 to 40, step 2 (percentage)
  - `{savings}`: 50 to 500, step 50 (currency)

### DATA-0044
**Role:** data-analyst | **Theme:** supply-chain-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** supply chain analytics, demand forecasting, inventory optimization, supplier performance, OTIF, logistics analytics

**Scope:** supply chain analytics covering {skus}K SKUs across {suppliers} suppliers and {dcs} distribution centers, building {models} demand forecasting models and supplier performance scorecards
**Result:** improving forecast accuracy from {before}% to {after}% and reducing stockout rate from {stockout_before}% to {stockout_after}%

**Variations:**
- **A (Standard):** Built supply chain analytics for {skus}K SKUs across {suppliers} suppliers and {dcs} DCs with {models} demand models, improving forecast accuracy from {before}% to {after}% and cutting stockouts from {stockout_before}% to {stockout_after}%.
- **B (Result-first):** Improved forecast accuracy from {before}% to {after}% and cut stockouts from {stockout_before}% to {stockout_after}% by building supply chain analytics for {skus}K SKUs across {suppliers} suppliers.
- **C (Impact-led):** Grew forecast accuracy from {before}% to {after}% and cut stockouts from {stockout_before}% to {stockout_after}%; built analytics for {skus}K SKUs across {suppliers} suppliers and {dcs} DCs.
- **D (Concise):** Built supply chain analytics for {skus}K SKUs across {suppliers} suppliers and {dcs} DCs, forecast accuracy from {before}% to {after}%, stockouts from {stockout_before}% to {stockout_after}%.

**Variables:**
  - `{skus}`: 1 to 100, step 1 (integer)
  - `{suppliers}`: 10 to 200, step 10 (integer)
  - `{dcs}`: 2 to 20, step 2 (integer)
  - `{models}`: 3 to 10, step 1 (integer)
  - `{before}`: 60 to 78, step 2 (percentage)
  - `{after}`: 85 to 96, step 1 (percentage)
  - `{stockout_before}`: 8 to 20, step 2 (percentage)
  - `{stockout_after}`: 1 to 4, step 0.5 (percentage)

### DATA-0045
**Role:** data-analyst | **Theme:** marketing-attribution | **Seniority:** mid | **Verb Context:** systems
**Keywords:** marketing attribution, multi-touch attribution, MTA, channel attribution, last-click, data-driven attribution

**Scope:** a multi-touch attribution model across {channels} marketing channels and {touchpoints}M touchpoints per month, replacing a last-click model and reallocating ${budget}M in marketing spend
**Result:** improving blended ROAS from {roas_before}x to {roas_after}x and identifying ${waste}K in underperforming channel spend that was reallocated

**Variations:**
- **A (Standard):** Built MTA model across {channels} channels and {touchpoints}M monthly touchpoints, replacing last-click and reallocating ${budget}M in spend, improving blended ROAS from {roas_before}x to {roas_after}x.
- **B (Result-first):** Improved blended ROAS from {roas_before}x to {roas_after}x and identified ${waste}K in underperforming spend by building MTA model across {channels} channels and {touchpoints}M touchpoints.
- **C (Impact-led):** Grew ROAS from {roas_before}x to {roas_after}x and identified ${waste}K in waste; built MTA model across {channels} channels and {touchpoints}M monthly touchpoints replacing a last-click model.
- **D (Concise):** Built MTA model across {channels} channels and {touchpoints}M touchpoints/month, ROAS from {roas_before}x to {roas_after}x, ${waste}K underperforming spend identified.

**Variables:**
  - `{channels}`: 5 to 20, step 5 (integer)
  - `{touchpoints}`: 1 to 50, step 1 (integer)
  - `{budget}`: 1 to 50, step 1 (currency)
  - `{roas_before}`: 2 to 4, step 0.5 (integer)
  - `{roas_after}`: 4 to 8, step 0.5 (integer)
  - `{waste}`: 100 to 2000, step 100 (currency)

### DATA-0046
**Role:** ml-engineer | **Theme:** feature-store | **Seniority:** senior | **Verb Context:** systems
**Keywords:** feature store, Feast, Tecton, feature engineering, feature reuse, training-serving skew

**Scope:** a feature store using Feast for {features}K features across {models} ML models and {teams} teams, unifying online and offline serving and eliminating training-serving skew across {pipelines} feature pipelines
**Result:** reducing feature engineering duplication by {dedup}% and cutting model training time by {training}% through pre-computed feature reuse

**Variations:**
- **A (Standard):** Built Feast feature store with {features}K features for {models} models across {teams} teams, eliminating training-serving skew, reducing duplication {dedup}% and cutting training time {training}%.
- **B (Result-first):** Reduced feature duplication {dedup}% and cut training time {training}% by building Feast feature store with {features}K features for {models} models across {teams} teams.
- **C (Impact-led):** Cut duplication {dedup}% and training time {training}%; built Feast feature store with {features}K features across {models} models and {teams} teams, eliminating training-serving skew.
- **D (Concise):** Built Feast feature store with {features}K features for {models} models across {teams} teams, duplication down {dedup}%, training time down {training}%.

**Variables:**
  - `{features}`: 1 to 50, step 1 (integer)
  - `{models}`: 10 to 100, step 10 (integer)
  - `{teams}`: 5 to 20, step 5 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{dedup}`: 40 to 80, step 5 (percentage)
  - `{training}`: 30 to 70, step 5 (percentage)

### DATA-0047
**Role:** ml-engineer | **Theme:** model-monitoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model monitoring, data drift, concept drift, model performance, Evidently, ML observability, PSI

**Scope:** a model monitoring system using Evidently tracking {metrics} performance metrics and drift indicators for {models} production models across {predictions}M daily predictions
**Result:** detecting {alerts} data drift alerts before business impact over {months} months and reducing model-related production incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Built Evidently monitoring for {models} models at {predictions}M daily predictions tracking {metrics} metrics, detecting {alerts} drift alerts and cutting model incidents from {before} to {after}/quarter over {months} months.
- **B (Result-first):** Detected {alerts} drift alerts and reduced model incidents from {before} to {after}/quarter by building Evidently monitoring for {models} models at {predictions}M daily predictions.
- **C (Impact-led):** Detected {alerts} drift alerts and cut model incidents from {before} to {after}/quarter over {months} months; built Evidently monitoring for {models} models tracking {metrics} metrics at {predictions}M predictions/day.
- **D (Concise):** Built Evidently monitoring for {models} models at {predictions}M predictions/day across {metrics} metrics, {alerts} drift alerts detected, incidents from {before} to {after}/quarter.

**Variables:**
  - `{metrics}`: 5 to 20, step 5 (integer)
  - `{models}`: 5 to 50, step 5 (integer)
  - `{predictions}`: 1 to 100, step 5 (integer)
  - `{alerts}`: 10 to 100, step 10 (integer)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### DATA-0048
**Role:** ml-engineer | **Theme:** model-explainability | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model explainability, SHAP, LIME, interpretable ML, XAI, fairness, regulatory compliance

**Scope:** model explainability infrastructure using SHAP for {models} production models serving {predictions}M daily predictions, producing per-prediction explanations and global feature importance reports for {stakeholders} regulatory and business stakeholders
**Result:** achieving {compliance}% compliance with {regulations} regulatory explainability requirements and reducing model audit response time from {before} days to {after} hours

**Variations:**
- **A (Standard):** Built SHAP explainability for {models} production models at {predictions}M predictions/day, achieving {compliance}% regulatory compliance across {regulations} requirements and cutting audit response from {before} days to {after} hours.
- **B (Result-first):** Achieved {compliance}% regulatory compliance and cut audit response from {before} days to {after} hours by building SHAP explainability for {models} models at {predictions}M predictions/day.
- **C (Impact-led):** Reached {compliance}% regulatory compliance and cut audit response from {before} days to {after} hours; built SHAP infrastructure for {models} models at {predictions}M daily predictions across {regulations} requirements.
- **D (Concise):** Built SHAP explainability for {models} models at {predictions}M predictions/day, {compliance}% regulatory compliance, audit response from {before}d to {after}h.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{predictions}`: 1 to 50, step 5 (integer)
  - `{stakeholders}`: 5 to 20, step 5 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{regulations}`: 2 to 5, step 1 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 1 to 4, step 1 (integer)

### DATA-0049
**Role:** ml-engineer | **Theme:** ab-testing-ml | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ML A/B testing, shadow mode, canary deployment, model evaluation, online evaluation, champion-challenger

**Scope:** a champion-challenger ML testing framework enabling shadow and canary deployments for {models} models, running {experiments} concurrent experiments with automated winner promotion based on {metrics} evaluation metrics
**Result:** reducing time-to-deploy a winning model from {before} weeks to {after} days and improving average model accuracy at promotion by {accuracy}%

**Variations:**
- **A (Standard):** Built champion-challenger testing for {models} models with {experiments} concurrent experiments and {metrics} metrics, cutting deploy time from {before} weeks to {after} days and improving promotion accuracy {accuracy}%.
- **B (Result-first):** Reduced model deploy time from {before} weeks to {after} days and improved promotion accuracy {accuracy}% by building champion-challenger testing for {models} models with {experiments} concurrent experiments.
- **C (Impact-led):** Cut deploy time from {before} weeks to {after} days and improved promotion accuracy {accuracy}%; built champion-challenger framework for {models} models with {experiments} experiments and {metrics} metrics.
- **D (Concise):** Built champion-challenger testing for {models} models with {experiments} experiments and {metrics} metrics, deploy time from {before}wk to {after}d, promotion accuracy up {accuracy}%.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{experiments}`: 5 to 30, step 5 (integer)
  - `{metrics}`: 3 to 10, step 1 (integer)
  - `{before}`: 3 to 8, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{accuracy}`: 5 to 25, step 5 (percentage)

### DATA-0050
**Role:** ml-engineer | **Theme:** llm-ops | **Seniority:** senior | **Verb Context:** systems
**Keywords:** LLMOps, prompt management, LLM evaluation, RAG, vector database, LLM observability, Langsmith

**Scope:** an LLMOps platform managing {prompts} production prompts across {applications} LLM-powered applications, with automated evaluation pipelines, latency monitoring, and cost tracking for {requests}M daily inference requests
**Result:** reducing average LLM inference cost by {cost}% and improving prompt evaluation pass rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built LLMOps platform managing {prompts} prompts across {applications} apps at {requests}M requests/day, cutting inference cost {cost}% and improving eval pass rate from {before}% to {after}%.
- **B (Result-first):** Reduced inference cost {cost}% and improved eval pass rate from {before}% to {after}% by building LLMOps for {prompts} prompts across {applications} apps at {requests}M requests/day.
- **C (Impact-led):** Cut inference cost {cost}% and grew eval pass rate from {before}% to {after}%; built LLMOps managing {prompts} prompts across {applications} apps at {requests}M daily requests.
- **D (Concise):** Built LLMOps for {prompts} prompts across {applications} apps at {requests}M requests/day, cost down {cost}%, eval pass rate from {before}% to {after}%.

**Variables:**
  - `{prompts}`: 20 to 200, step 20 (integer)
  - `{applications}`: 3 to 15, step 3 (integer)
  - `{requests}`: 1 to 100, step 5 (integer)
  - `{cost}`: 20 to 60, step 5 (percentage)
  - `{before}`: 60 to 75, step 5 (percentage)
  - `{after}`: 85 to 98, step 2 (percentage)

### DATA-0051
**Role:** ml-engineer | **Theme:** recommendation-ml | **Seniority:** mid | **Verb Context:** systems
**Keywords:** recommendation system, two-tower model, matrix factorization, candidate retrieval, ranking, implicit feedback

**Scope:** a two-tower recommendation model trained on {interactions}M user-item interactions across {users}M users and {items}M items, with a retrieval layer serving {candidates} candidates to a ranking model
**Result:** improving offline NDCG from {ndcg_before} to {ndcg_after} and increasing online CTR from {ctr_before}% to {ctr_after}% in A/B testing

**Variations:**
- **A (Standard):** Trained two-tower recommendation model on {interactions}M interactions across {users}M users and {items}M items, improving NDCG from {ndcg_before} to {ndcg_after} and online CTR from {ctr_before}% to {ctr_after}%.
- **B (Result-first):** Improved NDCG from {ndcg_before} to {ndcg_after} and online CTR from {ctr_before}% to {ctr_after}% by training a two-tower model on {interactions}M interactions.
- **C (Impact-led):** Grew NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}%; trained two-tower recommendation model on {interactions}M interactions across {users}M users and {items}M items.
- **D (Concise):** Trained two-tower model on {interactions}M interactions, NDCG from {ndcg_before} to {ndcg_after}, online CTR from {ctr_before}% to {ctr_after}%.

**Variables:**
  - `{interactions}`: 10 to 1000, step 10 (integer)
  - `{users}`: 1 to 100, step 1 (integer)
  - `{items}`: 10 to 1000, step 10 (integer)
  - `{candidates}`: 50 to 500, step 50 (integer)
  - `{ndcg_before}`: 0.3 to 0.5, step 0.05 (integer)
  - `{ndcg_after}`: 0.6 to 0.85, step 0.05 (integer)
  - `{ctr_before}`: 2 to 5, step 0.5 (percentage)
  - `{ctr_after}`: 6 to 15, step 1 (percentage)

### DATA-0052
**Role:** ml-engineer | **Theme:** time-series-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** time series forecasting, Prophet, LSTM, ARIMA, demand forecasting, anomaly detection, temporal models

**Scope:** time series forecasting models for {series}K time series across {horizons} forecast horizons, evaluating {models} model architectures including Prophet, XGBoost, and LSTM for {use_case} business planning
**Result:** reducing MAPE from {mape_before}% to {mape_after}% and enabling ${value}M in business planning decisions based on model outputs

**Variations:**
- **A (Standard):** Built time series models for {series}K series across {horizons} horizons evaluating {models} architectures, reducing MAPE from {mape_before}% to {mape_after}% and enabling ${value}M in planning decisions.
- **B (Result-first):** Reduced MAPE from {mape_before}% to {mape_after}% and enabled ${value}M in planning decisions by building time series models for {series}K series across {horizons} horizons.
- **C (Impact-led):** Cut MAPE from {mape_before}% to {mape_after}% enabling ${value}M in planning; built time series models for {series}K series across {horizons} horizons evaluating {models} architectures.
- **D (Concise):** Built time series models for {series}K series across {horizons} horizons with {models} architectures, MAPE from {mape_before}% to {mape_after}%, ${value}M planning value.

**Variables:**
  - `{series}`: 1 to 100, step 5 (integer)
  - `{horizons}`: 2 to 6, step 1 (integer)
  - `{models}`: 3 to 6, step 1 (integer)
  - `{mape_before}`: 15 to 30, step 5 (percentage)
  - `{mape_after}`: 4 to 10, step 1 (percentage)
  - `{value}`: 1 to 500, step 10 (currency)

### DATA-0053
**Role:** ml-engineer | **Theme:** nlp-classification | **Seniority:** mid | **Verb Context:** systems
**Keywords:** NLP, text classification, sentiment analysis, BERT, transformers, text processing, document classification

**Scope:** a text classification pipeline using fine-tuned BERT across {categories} label categories on a dataset of {samples}K labeled examples, replacing a rules-based system handling {documents}M documents per month
**Result:** improving classification F1 from {f1_before} to {f1_after} and reducing manual review volume by {manual}%

**Variations:**
- **A (Standard):** Built BERT classification pipeline across {categories} categories on {samples}K examples, handling {documents}M monthly documents, improving F1 from {f1_before} to {f1_after} and cutting manual review {manual}%.
- **B (Result-first):** Improved classification F1 from {f1_before} to {f1_after} and cut manual review {manual}% by building BERT pipeline across {categories} categories on {samples}K examples.
- **C (Impact-led):** Grew F1 from {f1_before} to {f1_after} and cut manual review {manual}%; built BERT classification for {categories} categories on {samples}K examples handling {documents}M monthly documents.
- **D (Concise):** Built BERT classifier for {categories} categories on {samples}K examples at {documents}M docs/month, F1 from {f1_before} to {f1_after}, manual review down {manual}%.

**Variables:**
  - `{categories}`: 5 to 50, step 5 (integer)
  - `{samples}`: 10 to 500, step 10 (integer)
  - `{documents}`: 1 to 100, step 5 (integer)
  - `{f1_before}`: 0.6 to 0.75, step 0.05 (integer)
  - `{f1_after}`: 0.88 to 0.98, step 0.02 (integer)
  - `{manual}`: 40 to 80, step 5 (percentage)

### DATA-0054
**Role:** ml-engineer | **Theme:** fraud-detection | **Seniority:** senior | **Verb Context:** systems
**Keywords:** fraud detection, anomaly detection, real-time scoring, gradient boosting, fraud prevention, financial fraud

**Scope:** a real-time fraud detection system scoring {transactions}M transactions per day with sub-{latency}ms latency using gradient boosting, trained on {features} engineered features across {history} months of transaction history
**Result:** increasing fraud catch rate from {catch_before}% to {catch_after}% while maintaining false positive rate below {fpr}%

**Variations:**
- **A (Standard):** Built real-time fraud scoring for {transactions}M transactions/day at sub-{latency}ms using {features} features, increasing catch rate from {catch_before}% to {catch_after}% while keeping FPR below {fpr}%.
- **B (Result-first):** Increased fraud catch rate from {catch_before}% to {catch_after}% while keeping FPR below {fpr}% by building real-time scoring for {transactions}M transactions/day at sub-{latency}ms.
- **C (Impact-led):** Grew catch rate from {catch_before}% to {catch_after}% while maintaining FPR below {fpr}%; built real-time fraud scoring for {transactions}M transactions/day with {features} features at sub-{latency}ms.
- **D (Concise):** Built real-time fraud scoring at {transactions}M transactions/day and sub-{latency}ms, catch rate from {catch_before}% to {catch_after}%, FPR below {fpr}%.

**Variables:**
  - `{transactions}`: 1 to 100, step 5 (integer)
  - `{latency}`: 50 to 200, step 50 (integer)
  - `{features}`: 50 to 500, step 50 (integer)
  - `{history}`: 12 to 36, step 6 (integer)
  - `{catch_before}`: 50 to 70, step 5 (percentage)
  - `{catch_after}`: 80 to 95, step 2 (percentage)
  - `{fpr}`: 0.5 to 3, step 0.5 (percentage)

### DATA-0055
**Role:** bi-analyst | **Theme:** embedded-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** embedded analytics, Looker Embedded, Metabase, analytics embedding, white-label analytics, customer-facing dashboards

**Scope:** embedded analytics for a B2B SaaS product using Looker Embedded, building {dashboards} customer-facing dashboards with {metrics} metrics across {tenants}K customer tenants with row-level security
**Result:** increasing product stickiness as measured by {dau}% improvement in DAU among customers using embedded dashboards and reducing customer churn by {churn}%

**Variations:**
- **A (Standard):** Built Looker Embedded analytics with {dashboards} dashboards and {metrics} metrics for {tenants}K tenants with row-level security, improving DAU {dau}% and reducing churn {churn}%.
- **B (Result-first):** Improved DAU {dau}% and reduced churn {churn}% by building Looker Embedded dashboards with {metrics} metrics for {tenants}K tenants with row-level security.
- **C (Impact-led):** Grew DAU {dau}% and cut churn {churn}%; built Looker Embedded analytics with {dashboards} dashboards and {metrics} metrics for {tenants}K tenants with row-level security.
- **D (Concise):** Built Looker Embedded with {dashboards} dashboards and {metrics} metrics for {tenants}K tenants, DAU up {dau}%, churn down {churn}%.

**Variables:**
  - `{dashboards}`: 5 to 30, step 5 (integer)
  - `{metrics}`: 20 to 100, step 10 (integer)
  - `{tenants}`: 1 to 50, step 1 (integer)
  - `{dau}`: 15 to 50, step 5 (percentage)
  - `{churn}`: 10 to 35, step 5 (percentage)

### DATA-0056
**Role:** data-engineer | **Theme:** data-lineage | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data lineage, OpenLineage, Marquez, impact analysis, data provenance, column-level lineage

**Scope:** column-level data lineage tracking using OpenLineage across {pipelines} pipelines, {datasets} datasets, and {transformations} transformation steps, enabling impact analysis for schema changes
**Result:** reducing time to assess downstream impact of schema changes from {before} days to {after} hours and preventing {incidents} data-breaking incidents per quarter

**Variations:**
- **A (Standard):** Implemented OpenLineage column-level lineage across {pipelines} pipelines and {datasets} datasets, cutting schema-change impact assessment from {before} days to {after} hours and preventing {incidents} breaking incidents per quarter.
- **B (Result-first):** Reduced schema-change impact assessment from {before} days to {after} hours and prevented {incidents} breaking incidents per quarter by implementing column-level lineage across {pipelines} pipelines and {datasets} datasets.
- **C (Impact-led):** Cut impact assessment from {before} days to {after} hours and prevented {incidents} breaking incidents per quarter; deployed OpenLineage lineage across {pipelines} pipelines, {datasets} datasets, and {transformations} transformations.
- **D (Concise):** Deployed OpenLineage lineage across {pipelines} pipelines and {datasets} datasets, impact assessment from {before}d to {after}h, {incidents} breaking incidents prevented/quarter.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{transformations}`: 100 to 1000, step 100 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{incidents}`: 5 to 30, step 5 (integer)

### DATA-0057
**Role:** data-engineer | **Theme:** data-governance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** data governance, data stewardship, data policies, metadata management, data access control, governance framework

**Scope:** a data governance framework for a {size}-person organization covering {domains} data domains, {policies} data policies, and {stewards} appointed data stewards across business units
**Result:** achieving {compliance}% policy compliance across governed datasets and reducing unauthorized data access incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Established data governance framework across {domains} domains with {policies} policies and {stewards} stewards, achieving {compliance}% policy compliance and cutting unauthorized access from {before} to {after}/quarter.
- **B (Result-first):** Achieved {compliance}% policy compliance and cut unauthorized access from {before} to {after}/quarter by establishing governance across {domains} domains with {policies} policies and {stewards} stewards.
- **C (Impact-led):** Reached {compliance}% policy compliance and cut unauthorized access from {before} to {after}/quarter; established governance across {domains} domains with {policies} policies and {stewards} appointed stewards.
- **D (Concise):** Established governance across {domains} domains with {policies} policies and {stewards} stewards, {compliance}% compliance, unauthorized access from {before} to {after}/quarter.

**Variables:**
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{policies}`: 20 to 100, step 10 (integer)
  - `{stewards}`: 5 to 30, step 5 (integer)
  - `{compliance}`: 85 to 100, step 5 (percentage)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)

### DATA-0058
**Role:** data-engineer | **Theme:** real-time-cdc | **Seniority:** mid | **Verb Context:** systems
**Keywords:** change data capture, CDC, Debezium, Kafka Connect, database replication, real-time sync

**Scope:** a CDC pipeline using Debezium and Kafka Connect capturing changes from {sources} source databases, replicating {tables} tables to {targets} downstream targets at sub-{latency} second latency
**Result:** replacing {batch_jobs} overnight batch jobs and reducing data freshness lag from {before} hours to {after} seconds

**Variations:**
- **A (Standard):** Built Debezium CDC pipeline from {sources} databases replicating {tables} tables to {targets} targets at sub-{latency}s latency, replacing {batch_jobs} batch jobs and cutting freshness lag from {before} hours to {after} seconds.
- **B (Result-first):** Replaced {batch_jobs} batch jobs and reduced data freshness from {before} hours to {after} seconds by building Debezium CDC pipeline across {sources} sources replicating {tables} tables.
- **C (Impact-led):** Replaced {batch_jobs} batch jobs and cut freshness from {before} hours to {after} seconds; built Debezium CDC pipeline from {sources} databases replicating {tables} tables to {targets} targets.
- **D (Concise):** Built Debezium CDC from {sources} databases replicating {tables} tables to {targets} targets at sub-{latency}s, {batch_jobs} batch jobs replaced, freshness from {before}h to {after}s.

**Variables:**
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{tables}`: 50 to 500, step 50 (integer)
  - `{targets}`: 3 to 10, step 1 (integer)
  - `{latency}`: 1 to 5, step 1 (integer)
  - `{batch_jobs}`: 10 to 100, step 10 (integer)
  - `{before}`: 8 to 24, step 4 (integer)
  - `{after}`: 1 to 10, step 1 (integer)

### DATA-0059
**Role:** data-engineer | **Theme:** data-lakehouse-migration | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data lakehouse, Databricks, Apache Iceberg, lake migration, ACID transactions, unified analytics

**Scope:** a migration from a legacy data warehouse to a Databricks lakehouse architecture, migrating {tables} tables, {pipelines} pipelines, and {users}K BI users across {phases} phases
**Result:** reducing monthly infrastructure cost by ${savings}K and improving average query performance by {perf}% across {workloads} query workloads

**Variations:**
- **A (Standard):** Led lakehouse migration to Databricks across {tables} tables, {pipelines} pipelines, and {users}K users in {phases} phases, saving ${savings}K/month and improving query performance {perf}%.
- **B (Result-first):** Saved ${savings}K/month and improved query performance {perf}% by migrating {tables} tables and {pipelines} pipelines to a Databricks lakehouse across {phases} phases.
- **C (Impact-led):** Saved ${savings}K/month and improved query performance {perf}%; led Databricks lakehouse migration for {tables} tables, {pipelines} pipelines, and {users}K BI users across {phases} phases.
- **D (Concise):** Led Databricks lakehouse migration across {tables} tables, {pipelines} pipelines, {users}K users, ${savings}K/month saved, query performance up {perf}%.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{users}`: 1 to 20, step 1 (integer)
  - `{phases}`: 2 to 5, step 1 (integer)
  - `{savings}`: 20 to 300, step 20 (currency)
  - `{perf}`: 30 to 80, step 5 (percentage)
  - `{workloads}`: 5 to 30, step 5 (integer)

### DATA-0060
**Role:** data-analyst | **Theme:** product-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** product analytics, user behavior, retention analysis, DAU, MAU, engagement metrics, growth analytics

**Scope:** product analytics for a {users}M-user platform tracking {events} behavioral events across {surfaces} product surfaces, building retention curves, engagement funnels, and {dashboards} stakeholder dashboards
**Result:** identifying {insights} actionable insights that informed {experiments} product decisions and improving 30-day retention from {before}% to {after}%

**Variations:**
- **A (Standard):** Built product analytics for {users}M users tracking {events} events across {surfaces} surfaces, uncovering {insights} insights that drove {experiments} decisions and improving 30-day retention from {before}% to {after}%.
- **B (Result-first):** Improved 30-day retention from {before}% to {after}% and informed {experiments} product decisions by building product analytics for {users}M users tracking {events} events.
- **C (Impact-led):** Grew 30-day retention from {before}% to {after}% and informed {experiments} decisions; built product analytics tracking {events} events across {surfaces} surfaces for {users}M users.
- **D (Concise):** Built product analytics for {users}M users tracking {events} events across {surfaces} surfaces, {insights} insights, {experiments} decisions, retention from {before}% to {after}%.

**Variables:**
  - `{users}`: 0.1 to 50, step 0.5 (integer)
  - `{events}`: 50 to 500, step 50 (integer)
  - `{surfaces}`: 3 to 15, step 3 (integer)
  - `{dashboards}`: 5 to 30, step 5 (integer)
  - `{insights}`: 5 to 30, step 5 (integer)
  - `{experiments}`: 3 to 15, step 3 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 40 to 65, step 5 (percentage)

### DATA-0061
**Role:** data-analyst | **Theme:** experimentation-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** A/B testing analysis, statistical significance, p-value, confidence interval, experiment readout, causal inference

**Scope:** statistical analysis for {experiments} concurrent A/B experiments per quarter, calculating power analysis, sample size requirements, and significance for {metrics} primary and guardrail metrics
**Result:** reducing invalid experiment conclusions by {invalid}% through proper power analysis and accelerating experiment readout cycle from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Analyzed {experiments} A/B experiments quarterly across {metrics} metrics with power analysis and significance testing, reducing invalid conclusions {invalid}% and cutting readout cycle from {before} weeks to {after} days.
- **B (Result-first):** Reduced invalid conclusions {invalid}% and cut readout cycle from {before} weeks to {after} days by analyzing {experiments} quarterly experiments across {metrics} metrics with rigorous power analysis.
- **C (Impact-led):** Cut invalid conclusions {invalid}% and readout cycle from {before} weeks to {after} days; analyzed {experiments} quarterly A/B experiments across {metrics} metrics with power analysis.
- **D (Concise):** Analyzed {experiments} A/B experiments/quarter across {metrics} metrics, invalid conclusions down {invalid}%, readout from {before}wk to {after}d.

**Variables:**
  - `{experiments}`: 10 to 80, step 10 (integer)
  - `{metrics}`: 3 to 10, step 1 (integer)
  - `{invalid}`: 30 to 70, step 5 (percentage)
  - `{before}`: 3 to 8, step 1 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0062
**Role:** data-analyst | **Theme:** revenue-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** revenue analytics, MRR, ARR, churn analysis, LTV, revenue forecasting, SaaS metrics

**Scope:** a revenue analytics framework tracking {metrics} SaaS metrics including MRR, ARR, churn, and LTV across {segments} customer segments and {cohorts} acquisition cohorts
**Result:** identifying ${leakage}K in annual revenue leakage and enabling the business to improve net revenue retention from {before}% to {after}%

**Variations:**
- **A (Standard):** Built revenue analytics framework tracking {metrics} metrics across {segments} segments and {cohorts} cohorts, identifying ${leakage}K in leakage and improving NRR from {before}% to {after}%.
- **B (Result-first):** Identified ${leakage}K in revenue leakage and improved NRR from {before}% to {after}% by building analytics framework tracking {metrics} SaaS metrics across {segments} segments.
- **C (Impact-led):** Identified ${leakage}K in revenue leakage and grew NRR from {before}% to {after}%; built revenue analytics tracking {metrics} SaaS metrics across {segments} segments and {cohorts} cohorts.
- **D (Concise):** Built revenue analytics for {metrics} SaaS metrics across {segments} segments and {cohorts} cohorts, ${leakage}K leakage identified, NRR from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 5 to 15, step 5 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{cohorts}`: 6 to 24, step 6 (integer)
  - `{leakage}`: 50 to 1000, step 50 (currency)
  - `{before}`: 90 to 105, step 5 (percentage)
  - `{after}`: 110 to 130, step 5 (percentage)

### DATA-0063
**Role:** data-analyst | **Theme:** operational-reporting | **Seniority:** junior | **Verb Context:** content
**Keywords:** operational reporting, scheduled reports, data distribution, report automation, stakeholder reports, daily reporting

**Scope:** automated operational reporting for {stakeholders} business stakeholders across {departments} departments, designing {reports} recurring reports covering {metrics} operational metrics delivered on {schedules} schedules
**Result:** reducing manual reporting effort from {before} hours to {after} hours per week and achieving {satisfaction}% stakeholder satisfaction score

**Variations:**
- **A (Standard):** Automated {reports} operational reports for {stakeholders} stakeholders across {departments} departments covering {metrics} metrics, cutting manual effort from {before} to {after} hours/week and achieving {satisfaction}% satisfaction.
- **B (Result-first):** Cut manual reporting from {before} to {after} hours/week and achieved {satisfaction}% satisfaction by automating {reports} reports for {stakeholders} stakeholders across {departments} departments.
- **C (Impact-led):** Cut manual effort from {before} to {after} hours/week and achieved {satisfaction}% satisfaction; automated {reports} operational reports covering {metrics} metrics for {stakeholders} stakeholders across {departments} departments.
- **D (Concise):** Automated {reports} reports for {stakeholders} stakeholders across {departments} departments, manual effort from {before} to {after}h/week, {satisfaction}% satisfaction.

**Variables:**
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{departments}`: 3 to 10, step 1 (integer)
  - `{reports}`: 10 to 60, step 10 (integer)
  - `{metrics}`: 20 to 100, step 20 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{satisfaction}`: 85 to 99, step 5 (percentage)

### DATA-0064
**Role:** data-scientist | **Theme:** churn-prediction | **Seniority:** mid | **Verb Context:** systems
**Keywords:** churn prediction, classification model, customer churn, propensity model, retention model, LTV prediction

**Scope:** a customer churn prediction model trained on {features} behavioral and transactional features across {customers}K customers, integrated with CRM workflows to trigger {interventions} retention interventions per month
**Result:** reducing customer churn rate from {before}% to {after}% and generating ${revenue}K in retained annual revenue

**Variations:**
- **A (Standard):** Built churn prediction model on {features} features for {customers}K customers, triggering {interventions} monthly interventions, reducing churn from {before}% to {after}% and retaining ${revenue}K in annual revenue.
- **B (Result-first):** Reduced churn from {before}% to {after}% and retained ${revenue}K in annual revenue by building churn model on {features} features for {customers}K customers with {interventions} monthly interventions.
- **C (Impact-led):** Cut churn from {before}% to {after}% and retained ${revenue}K annually; built churn model on {features} features for {customers}K customers driving {interventions} monthly CRM interventions.
- **D (Concise):** Built churn model on {features} features for {customers}K customers, {interventions} interventions/month, churn from {before}% to {after}%, ${revenue}K retained annually.

**Variables:**
  - `{features}`: 20 to 200, step 20 (integer)
  - `{customers}`: 10 to 500, step 10 (integer)
  - `{interventions}`: 100 to 2000, step 100 (integer)
  - `{before}`: 8 to 20, step 2 (percentage)
  - `{after}`: 3 to 7, step 1 (percentage)
  - `{revenue}`: 100 to 2000, step 100 (currency)

### DATA-0065
**Role:** data-scientist | **Theme:** demand-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** demand forecasting, Prophet, time series, ARIMA, inventory optimization, supply planning, forecast accuracy

**Scope:** a demand forecasting system using Prophet and ensemble methods across {skus}K SKUs and {horizons} forecast horizons, integrating with supply chain planning tools for {categories} product categories
**Result:** improving forecast MAPE from {before}% to {after}% and reducing excess inventory cost by ${savings}K annually

**Variations:**
- **A (Standard):** Built Prophet-based demand forecasting across {skus}K SKUs and {horizons} horizons for {categories} categories, improving MAPE from {before}% to {after}% and cutting inventory cost by ${savings}K annually.
- **B (Result-first):** Improved MAPE from {before}% to {after}% and cut inventory cost ${savings}K annually by building Prophet forecasting across {skus}K SKUs and {horizons} horizons for {categories} categories.
- **C (Impact-led):** Improved MAPE from {before}% to {after}% and cut inventory cost ${savings}K annually; built Prophet ensemble forecasting across {skus}K SKUs, {horizons} horizons, and {categories} categories.
- **D (Concise):** Built Prophet forecasting for {skus}K SKUs across {horizons} horizons and {categories} categories, MAPE from {before}% to {after}%, inventory cost down ${savings}K/year.

**Variables:**
  - `{skus}`: 1 to 100, step 5 (integer)
  - `{horizons}`: 2 to 6, step 1 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 15, step 5 (percentage)
  - `{savings}`: 100 to 2000, step 100 (currency)

### DATA-0066
**Role:** data-scientist | **Theme:** credit-risk-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** credit risk, scorecard, PD model, LGD, FICO, logistic regression, model validation

**Scope:** a credit risk scoring model trained on {features} applicant features across {loans}K historical loan records, predicting probability of default and integrating into underwriting workflows for {applications}K monthly applications
**Result:** reducing bad debt rate from {before}% to {after}% while maintaining {approval}% loan approval rate and achieving a Gini coefficient of {gini}

**Variations:**
- **A (Standard):** Built credit risk model on {features} features across {loans}K records, integrated into underwriting for {applications}K monthly applications, reducing bad debt from {before}% to {after}% and achieving Gini {gini}.
- **B (Result-first):** Reduced bad debt from {before}% to {after}% and achieved Gini {gini} by building credit risk model on {features} features across {loans}K records for {applications}K monthly applications.
- **C (Impact-led):** Cut bad debt from {before}% to {after}% and achieved Gini {gini}; built credit risk model on {features} features across {loans}K records integrated into {applications}K monthly underwriting decisions.
- **D (Concise):** Built credit risk model on {features} features for {loans}K records, {applications}K monthly applications, bad debt from {before}% to {after}%, Gini {gini}.

**Variables:**
  - `{features}`: 30 to 200, step 10 (integer)
  - `{loans}`: 50 to 2000, step 50 (integer)
  - `{applications}`: 1 to 100, step 5 (integer)
  - `{before}`: 5 to 15, step 1 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)
  - `{approval}`: 60 to 85, step 5 (percentage)
  - `{gini}`: 0.5 to 0.8, step 0.05 (integer)

### DATA-0067
**Role:** data-scientist | **Theme:** image-classification | **Seniority:** mid | **Verb Context:** systems
**Keywords:** image classification, CNN, computer vision, transfer learning, ResNet, PyTorch, image recognition

**Scope:** an image classification model using transfer learning on ResNet for a {classes}-class problem trained on {images}K labeled images, deployed via REST API serving {predictions}K predictions per day
**Result:** achieving {accuracy}% top-1 accuracy on the holdout set and reducing manual image review effort from {before} FTE hours to {after} FTE hours per week

**Variations:**
- **A (Standard):** Built ResNet transfer learning classifier for {classes} classes on {images}K images, deployed at {predictions}K daily predictions, achieving {accuracy}% accuracy and cutting manual review from {before} to {after} FTE hours/week.
- **B (Result-first):** Achieved {accuracy}% top-1 accuracy and cut manual review from {before} to {after} FTE hours/week by building ResNet classifier for {classes} classes on {images}K images at {predictions}K daily predictions.
- **C (Impact-led):** Reached {accuracy}% accuracy and cut manual review from {before} to {after} FTE hours/week; built ResNet transfer learning model for {classes} classes on {images}K images at {predictions}K daily predictions.
- **D (Concise):** Built ResNet classifier for {classes} classes on {images}K images at {predictions}K predictions/day, {accuracy}% accuracy, manual review from {before} to {after} FTE hours/week.

**Variables:**
  - `{classes}`: 5 to 100, step 5 (integer)
  - `{images}`: 10 to 1000, step 10 (integer)
  - `{predictions}`: 1 to 100, step 5 (integer)
  - `{accuracy}`: 85 to 99, step 1 (percentage)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0068
**Role:** data-scientist | **Theme:** anomaly-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** anomaly detection, unsupervised learning, Isolation Forest, autoencoder, outlier detection, monitoring

**Scope:** an anomaly detection system using Isolation Forest and autoencoder models across {metrics} time-series metrics for a {systems}-system infrastructure, triggering {alerts} automated alerts per week
**Result:** reducing false positive alert rate from {before}% to {after}% and detecting {detections}% of real anomalies within {minutes} minutes of onset

**Variations:**
- **A (Standard):** Built Isolation Forest and autoencoder anomaly detection across {metrics} metrics for {systems} systems, reducing false positives from {before}% to {after}% and detecting {detections}% of anomalies within {minutes} minutes.
- **B (Result-first):** Reduced false positives from {before}% to {after}% and detected {detections}% of anomalies within {minutes} minutes by building anomaly detection across {metrics} metrics for {systems} systems.
- **C (Impact-led):** Cut false positives from {before}% to {after}% and detected {detections}% of anomalies within {minutes} minutes; deployed Isolation Forest and autoencoder detection across {metrics} metrics for {systems} systems.
- **D (Concise):** Built anomaly detection across {metrics} metrics for {systems} systems, false positives from {before}% to {after}%, {detections}% detected within {minutes}min.

**Variables:**
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{systems}`: 10 to 100, step 10 (integer)
  - `{alerts}`: 10 to 100, step 10 (integer)
  - `{before}`: 30 to 60, step 5 (percentage)
  - `{after}`: 3 to 10, step 1 (percentage)
  - `{detections}`: 85 to 99, step 2 (percentage)
  - `{minutes}`: 5 to 30, step 5 (integer)

### DATA-0069
**Role:** data-scientist | **Theme:** natural-language-generation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** NLG, natural language generation, automated narratives, report generation, GPT, text generation, structured-to-text

**Scope:** a natural language generation pipeline converting {report_types} structured data report types into automated narrative summaries for {users}K business users, generating {reports}K reports per month
**Result:** reducing analyst time spent on narrative writing from {before} hours to {after} hours per week and achieving {accuracy}% factual accuracy on generated narratives

**Variations:**
- **A (Standard):** Built NLG pipeline converting {report_types} report types into automated narratives for {users}K users at {reports}K/month, cutting analyst narrative writing from {before} to {after} hours/week and achieving {accuracy}% factual accuracy.
- **B (Result-first):** Cut analyst narrative writing from {before} to {after} hours/week and achieved {accuracy}% accuracy by building NLG pipeline for {report_types} report types at {reports}K monthly reports.
- **C (Impact-led):** Cut analyst writing from {before} to {after} hours/week and achieved {accuracy}% accuracy; built NLG pipeline converting {report_types} structured report types to narratives for {users}K users at {reports}K/month.
- **D (Concise):** Built NLG pipeline for {report_types} report types at {reports}K/month for {users}K users, analyst writing from {before} to {after}h/week, {accuracy}% factual accuracy.

**Variables:**
  - `{report_types}`: 5 to 20, step 5 (integer)
  - `{users}`: 1 to 20, step 1 (integer)
  - `{reports}`: 1 to 100, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{accuracy}`: 90 to 99, step 1 (percentage)

### DATA-0070
**Role:** ml-engineer | **Theme:** model-compression | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model compression, quantization, pruning, knowledge distillation, TensorRT, edge inference, model optimization

**Scope:** a model compression pipeline applying quantization and pruning to {models} production models, reducing model size from an average of {before}MB to {after}MB while maintaining inference accuracy
**Result:** reducing inference latency by {latency}% and cutting GPU serving costs by ${savings}K per month across {endpoints} inference endpoints

**Variations:**
- **A (Standard):** Applied quantization and pruning to {models} production models, reducing average size from {before}MB to {after}MB, cutting latency {latency}% and saving ${savings}K/month across {endpoints} endpoints.
- **B (Result-first):** Reduced inference latency {latency}% and saved ${savings}K/month by applying quantization and pruning to {models} models from {before}MB to {after}MB across {endpoints} endpoints.
- **C (Impact-led):** Cut latency {latency}% and saved ${savings}K/month; compressed {models} production models from {before}MB to {after}MB using quantization and pruning across {endpoints} inference endpoints.
- **D (Concise):** Compressed {models} models from {before}MB to {after}MB across {endpoints} endpoints, latency down {latency}%, ${savings}K/month saved.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{before}`: 200 to 2000, step 100 (integer)
  - `{after}`: 20 to 200, step 20 (integer)
  - `{latency}`: 30 to 70, step 5 (percentage)
  - `{savings}`: 10 to 200, step 10 (currency)
  - `{endpoints}`: 5 to 30, step 5 (integer)

### DATA-0071
**Role:** ml-engineer | **Theme:** data-augmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data augmentation, synthetic data, training data, SMOTE, image augmentation, data generation, class imbalance

**Scope:** a data augmentation pipeline generating {synthetic}K synthetic training samples across {classes} imbalanced classes using SMOTE and image augmentation techniques for a {domain} ML task
**Result:** improving model F1 score from {before} to {after} on minority classes and reducing training data collection cost by ${savings}K

**Variations:**
- **A (Standard):** Built augmentation pipeline generating {synthetic}K samples across {classes} imbalanced classes for a {domain} task, improving minority class F1 from {before} to {after} and saving ${savings}K in collection costs.
- **B (Result-first):** Improved minority class F1 from {before} to {after} and saved ${savings}K in collection costs by building augmentation pipeline generating {synthetic}K samples across {classes} classes.
- **C (Impact-led):** Improved minority F1 from {before} to {after} and saved ${savings}K in collection; built augmentation pipeline generating {synthetic}K samples across {classes} imbalanced classes for a {domain} task.
- **D (Concise):** Built augmentation pipeline for {classes} imbalanced classes generating {synthetic}K samples, F1 from {before} to {after}, ${savings}K collection savings.

**Variables:**
  - `{synthetic}`: 10 to 500, step 10 (integer)
  - `{classes}`: 5 to 50, step 5 (integer)
  - `{before}`: 0.4 to 0.6, step 0.05 (integer)
  - `{after}`: 0.75 to 0.95, step 0.05 (integer)
  - `{savings}`: 20 to 300, step 20 (currency)

### DATA-0072
**Role:** ml-engineer | **Theme:** hyperparameter-tuning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** hyperparameter tuning, Optuna, Ray Tune, Bayesian optimization, grid search, AutoML, model performance

**Scope:** automated hyperparameter tuning using Optuna with Bayesian optimization for {models} model architectures, running {trials} trials per experiment across {gpus} GPUs with early stopping
**Result:** improving average model performance by {improvement}% over manual tuning baselines and reducing tuning compute time from {before} hours to {after} hours per experiment

**Variations:**
- **A (Standard):** Automated hyperparameter tuning with Optuna for {models} models across {trials} trials on {gpus} GPUs, improving performance {improvement}% over manual baselines and cutting tuning time from {before} to {after} hours.
- **B (Result-first):** Improved model performance {improvement}% and cut tuning time from {before} to {after} hours by deploying Optuna Bayesian tuning for {models} models across {trials} trials on {gpus} GPUs.
- **C (Impact-led):** Improved performance {improvement}% and cut tuning time from {before} to {after} hours; automated Optuna Bayesian tuning for {models} models across {trials} trials on {gpus} GPUs.
- **D (Concise):** Deployed Optuna tuning for {models} models across {trials} trials on {gpus} GPUs, performance up {improvement}%, tuning time from {before} to {after}h.

**Variables:**
  - `{models}`: 3 to 15, step 3 (integer)
  - `{trials}`: 50 to 500, step 50 (integer)
  - `{gpus}`: 4 to 32, step 4 (integer)
  - `{improvement}`: 5 to 25, step 5 (percentage)
  - `{before}`: 10 to 48, step 2 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0073
**Role:** ml-engineer | **Theme:** vector-database | **Seniority:** mid | **Verb Context:** systems
**Keywords:** vector database, Pinecone, Weaviate, embeddings, semantic search, ANN, similarity search

**Scope:** a vector database infrastructure using Pinecone storing {vectors}M embeddings across {namespaces} namespaces, serving semantic search and RAG retrieval for {queries}K queries per day at sub-{latency}ms latency
**Result:** improving semantic search relevance from {before}% to {after}% MRR and supporting {use_cases} new AI-powered product use cases

**Variations:**
- **A (Standard):** Built Pinecone vector infrastructure with {vectors}M embeddings across {namespaces} namespaces at {queries}K queries/day, improving MRR from {before}% to {after}% and enabling {use_cases} AI-powered use cases.
- **B (Result-first):** Improved MRR from {before}% to {after}% and enabled {use_cases} AI use cases by building Pinecone infrastructure with {vectors}M embeddings at {queries}K daily queries.
- **C (Impact-led):** Grew MRR from {before}% to {after}% and enabled {use_cases} AI use cases; built Pinecone vector store with {vectors}M embeddings across {namespaces} namespaces at {queries}K queries/day.
- **D (Concise):** Built Pinecone vector store with {vectors}M embeddings across {namespaces} namespaces at {queries}K queries/day, MRR from {before}% to {after}%, {use_cases} new AI use cases.

**Variables:**
  - `{vectors}`: 1 to 500, step 10 (integer)
  - `{namespaces}`: 3 to 20, step 3 (integer)
  - `{queries}`: 1 to 200, step 10 (integer)
  - `{latency}`: 50 to 200, step 50 (integer)
  - `{before}`: 40 to 60, step 5 (percentage)
  - `{after}`: 70 to 90, step 5 (percentage)
  - `{use_cases}`: 2 to 10, step 1 (integer)

### DATA-0074
**Role:** ml-engineer | **Theme:** model-registry | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model registry, MLflow, model versioning, model lifecycle, experiment tracking, artifact management

**Scope:** a centralized model registry using MLflow for {models} production models and {experiments}K tracked experiments across {teams} ML teams, enforcing promotion gates from staging to production
**Result:** reducing model deployment incidents caused by untracked changes from {before} to {after} per quarter and cutting model audit evidence preparation from {audit_before} days to {audit_after} hours

**Variations:**
- **A (Standard):** Built MLflow model registry for {models} production models and {experiments}K experiments across {teams} teams, cutting deployment incidents from {before} to {after}/quarter and audit prep from {audit_before} days to {audit_after} hours.
- **B (Result-first):** Reduced deployment incidents from {before} to {after}/quarter and audit prep from {audit_before} days to {audit_after} hours by building MLflow registry for {models} models across {teams} teams.
- **C (Impact-led):** Cut incidents from {before} to {after}/quarter and audit prep from {audit_before} days to {audit_after} hours; built MLflow registry for {models} models and {experiments}K experiments across {teams} teams.
- **D (Concise):** Built MLflow registry for {models} models and {experiments}K experiments across {teams} teams, incidents from {before} to {after}/quarter, audit prep from {audit_before}d to {audit_after}h.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{experiments}`: 1 to 50, step 5 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)
  - `{audit_before}`: 5 to 20, step 5 (integer)
  - `{audit_after}`: 1 to 4, step 1 (integer)

### DATA-0075
**Role:** ml-engineer | **Theme:** distributed-training | **Seniority:** senior | **Verb Context:** systems
**Keywords:** distributed training, PyTorch DDP, Horovod, multi-GPU, gradient accumulation, mixed precision, training efficiency

**Scope:** distributed training infrastructure for {model_size}B parameter models across {gpus} GPUs using PyTorch DDP and mixed precision, reducing per-experiment training time for {experiments} concurrent experiments
**Result:** reducing training time per epoch from {before} hours to {after} minutes and cutting GPU compute cost per model by ${savings}K

**Variations:**
- **A (Standard):** Built PyTorch DDP distributed training for {model_size}B parameter models across {gpus} GPUs, reducing training from {before} hours to {after} minutes per epoch and saving ${savings}K GPU cost per model.
- **B (Result-first):** Reduced training from {before} hours to {after} minutes per epoch and saved ${savings}K GPU cost per model by building DDP training for {model_size}B models across {gpus} GPUs.
- **C (Impact-led):** Cut training from {before} hours to {after} minutes per epoch and saved ${savings}K GPU cost per model; built PyTorch DDP infrastructure for {model_size}B models across {gpus} GPUs with mixed precision.
- **D (Concise):** Built PyTorch DDP training for {model_size}B models across {gpus} GPUs, training from {before}h to {after}min/epoch, ${savings}K GPU cost saved per model.

**Variables:**
  - `{model_size}`: 0.1 to 70, step 1 (integer)
  - `{gpus}`: 8 to 256, step 8 (integer)
  - `{experiments}`: 3 to 20, step 3 (integer)
  - `{before}`: 6 to 48, step 6 (integer)
  - `{after}`: 20 to 90, step 10 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0076
**Role:** bi-analyst | **Theme:** data-storytelling | **Seniority:** mid | **Verb Context:** content
**Keywords:** data storytelling, executive presentations, narrative analytics, insight communication, stakeholder influence, data-driven decisions

**Scope:** data storytelling presentations for {stakeholders} executive stakeholders per quarter, translating {analyses} complex analyses across {topics} business topics into decision-ready narratives
**Result:** increasing data-driven decision adoption among stakeholders from {before}% to {after}% and directly influencing ${impact}K in strategic budget decisions

**Variations:**
- **A (Standard):** Produced data storytelling for {stakeholders} executives per quarter across {analyses} analyses and {topics} topics, growing decision adoption from {before}% to {after}% and influencing ${impact}K in budget decisions.
- **B (Result-first):** Grew data-driven decision adoption from {before}% to {after}% and influenced ${impact}K in budget decisions by delivering data storytelling to {stakeholders} executives across {analyses} analyses.
- **C (Impact-led):** Grew decision adoption from {before}% to {after}% and influenced ${impact}K in budgets; delivered data storytelling to {stakeholders} executives across {analyses} analyses and {topics} topics per quarter.
- **D (Concise):** Delivered data storytelling to {stakeholders} executives/quarter across {analyses} analyses, decision adoption from {before}% to {after}%, ${impact}K in budget decisions influenced.

**Variables:**
  - `{stakeholders}`: 5 to 20, step 5 (integer)
  - `{analyses}`: 10 to 50, step 10 (integer)
  - `{topics}`: 3 to 10, step 1 (integer)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 65 to 90, step 5 (percentage)
  - `{impact}`: 100 to 5000, step 100 (currency)

### DATA-0077
**Role:** bi-analyst | **Theme:** data-model-design | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data modeling, star schema, dimensional modeling, Kimball, facts and dimensions, semantic layer

**Scope:** a dimensional data model using Kimball methodology for a {domain} business domain with {facts} fact tables and {dimensions} dimension tables, serving {analysts} analysts and {dashboards} dashboards
**Result:** reducing average analyst query time from {before} seconds to {after} seconds and cutting dashboard load time from {dash_before} seconds to {dash_after} seconds

**Variations:**
- **A (Standard):** Designed Kimball dimensional model for {domain} with {facts} facts and {dimensions} dimensions, serving {analysts} analysts and {dashboards} dashboards, cutting query time from {before}s to {after}s and dashboard load from {dash_before}s to {dash_after}s.
- **B (Result-first):** Reduced query time from {before}s to {after}s and dashboard load from {dash_before}s to {dash_after}s by designing Kimball model with {facts} facts and {dimensions} dimensions for {analysts} analysts.
- **C (Impact-led):** Cut query time from {before}s to {after}s and dashboard load from {dash_before}s to {dash_after}s; designed Kimball model for {domain} with {facts} facts, {dimensions} dimensions, serving {analysts} analysts.
- **D (Concise):** Designed Kimball model for {domain} with {facts} facts and {dimensions} dimensions, query from {before}s to {after}s, dashboard from {dash_before}s to {dash_after}s.

**Variables:**
  - `{facts}`: 5 to 20, step 5 (integer)
  - `{dimensions}`: 10 to 60, step 10 (integer)
  - `{analysts}`: 10 to 100, step 10 (integer)
  - `{dashboards}`: 20 to 200, step 20 (integer)
  - `{before}`: 30 to 120, step 15 (integer)
  - `{after}`: 1 to 5, step 1 (integer)
  - `{dash_before}`: 15 to 60, step 5 (integer)
  - `{dash_after}`: 1 to 5, step 1 (integer)

### DATA-0078
**Role:** bi-analyst | **Theme:** metric-framework | **Seniority:** mid | **Verb Context:** operations
**Keywords:** metric framework, OKR metrics, north star metric, metric definitions, single source of truth, metric governance

**Scope:** a company-wide metric framework defining {metrics} canonical metrics with agreed definitions, owners, and calculation logic for {teams} business teams, resolving {conflicts} conflicting metric interpretations
**Result:** achieving {adoption}% metric framework adoption and reducing cross-team metric disagreements from {before} per month to {after} per quarter

**Variations:**
- **A (Standard):** Established metric framework with {metrics} canonical metrics for {teams} teams, resolving {conflicts} conflicts and achieving {adoption}% adoption while reducing disagreements from {before}/month to {after}/quarter.
- **B (Result-first):** Achieved {adoption}% adoption and cut disagreements from {before}/month to {after}/quarter by establishing {metrics} canonical metrics and resolving {conflicts} conflicts across {teams} teams.
- **C (Impact-led):** Reached {adoption}% adoption and cut disagreements from {before}/month to {after}/quarter; established metric framework with {metrics} canonical metrics for {teams} teams, resolving {conflicts} conflicts.
- **D (Concise):** Established {metrics} canonical metrics for {teams} teams, {adoption}% adoption, disagreements from {before}/month to {after}/quarter.

**Variables:**
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{conflicts}`: 10 to 50, step 10 (integer)
  - `{adoption}`: 70 to 95, step 5 (percentage)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)

### DATA-0079
**Role:** bi-analyst | **Theme:** mobile-analytics | **Seniority:** junior | **Verb Context:** content
**Keywords:** mobile analytics, app metrics, retention dashboard, mobile BI, DAU, session analytics, mobile reporting

**Scope:** mobile analytics dashboards for a {users}M-user app tracking {metrics} metrics including DAU, retention, session length, and feature adoption across {platforms} platforms and {segments} user segments
**Result:** enabling {stakeholders} product and marketing stakeholders to self-serve insights and reducing ad hoc mobile analytics requests by {reduction}%

**Variations:**
- **A (Standard):** Built mobile analytics dashboards for {users}M users tracking {metrics} metrics across {platforms} platforms and {segments} segments, enabling {stakeholders} stakeholders to self-serve and cutting ad hoc requests {reduction}%.
- **B (Result-first):** Enabled {stakeholders} stakeholders to self-serve and cut ad hoc requests {reduction}% by building mobile analytics for {users}M users across {metrics} metrics, {platforms} platforms, and {segments} segments.
- **C (Impact-led):** Enabled {stakeholders} stakeholders to self-serve and cut ad hoc requests {reduction}%; built mobile analytics for {users}M users tracking {metrics} metrics across {platforms} platforms and {segments} segments.
- **D (Concise):** Built mobile analytics for {users}M users across {metrics} metrics, {platforms} platforms, {segments} segments, {stakeholders} stakeholders self-serving, ad hoc requests down {reduction}%.

**Variables:**
  - `{users}`: 0.1 to 50, step 0.5 (integer)
  - `{metrics}`: 10 to 50, step 10 (integer)
  - `{platforms}`: 2 to 4, step 1 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{reduction}`: 30 to 70, step 5 (percentage)

### DATA-0080
**Role:** bi-analyst | **Theme:** data-access-layer | **Seniority:** senior | **Verb Context:** systems
**Keywords:** semantic layer, LookML, dbt metrics, data access layer, metrics API, headless BI

**Scope:** a semantic layer using LookML for a {tables}K-table data warehouse, defining {metrics} metrics and {dimensions} dimensions consumed by {tools} BI tools and {teams} analyst teams
**Result:** reducing analyst SQL errors from {before} per week to {after} per week and enabling {consumers} non-technical users to query data without SQL

**Variations:**
- **A (Standard):** Built LookML semantic layer for a {tables}K-table warehouse with {metrics} metrics and {dimensions} dimensions, cutting SQL errors from {before} to {after}/week and enabling {consumers} non-technical users to query.
- **B (Result-first):** Reduced SQL errors from {before} to {after}/week and enabled {consumers} non-technical users to query by building LookML semantic layer with {metrics} metrics and {dimensions} dimensions.
- **C (Impact-led):** Cut SQL errors from {before} to {after}/week and enabled {consumers} non-technical users to query; built LookML layer with {metrics} metrics and {dimensions} dimensions across a {tables}K-table warehouse.
- **D (Concise):** Built LookML semantic layer for {tables}K tables with {metrics} metrics and {dimensions} dimensions, SQL errors from {before} to {after}/week, {consumers} non-technical users enabled.

**Variables:**
  - `{tables}`: 1 to 50, step 1 (integer)
  - `{metrics}`: 50 to 500, step 50 (integer)
  - `{dimensions}`: 100 to 1000, step 100 (integer)
  - `{tools}`: 2 to 5, step 1 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{consumers}`: 50 to 500, step 50 (integer)

### DATA-0081
**Role:** data-engineer | **Theme:** data-testing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data testing, Great Expectations, data validation, data quality checks, pipeline testing, data reliability

**Scope:** a data testing framework using Great Expectations across {pipelines} pipelines and {datasets} datasets with {checks} automated quality checks covering completeness, uniqueness, and referential integrity
**Result:** catching {caught}% of data quality issues before they reach analysts and reducing data incident mean time to detection from {before} hours to {after} minutes

**Variations:**
- **A (Standard):** Built Great Expectations testing for {pipelines} pipelines and {datasets} datasets with {checks} quality checks, catching {caught}% of issues pre-analyst and reducing MTTD from {before} hours to {after} minutes.
- **B (Result-first):** Caught {caught}% of quality issues pre-analyst and cut MTTD from {before} hours to {after} minutes by building Great Expectations across {pipelines} pipelines and {datasets} datasets.
- **C (Impact-led):** Caught {caught}% of quality issues pre-analyst and cut MTTD from {before} hours to {after} minutes; built Great Expectations testing across {pipelines} pipelines, {datasets} datasets, and {checks} checks.
- **D (Concise):** Built Great Expectations for {pipelines} pipelines and {datasets} datasets with {checks} checks, {caught}% caught pre-analyst, MTTD from {before}h to {after}min.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{checks}`: 100 to 2000, step 100 (integer)
  - `{caught}`: 80 to 98, step 5 (percentage)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0082
**Role:** data-engineer | **Theme:** cost-optimization-warehouse | **Seniority:** mid | **Verb Context:** operations
**Keywords:** Snowflake cost optimization, BigQuery cost, warehouse optimization, query cost, compute optimization, data warehouse billing

**Scope:** a warehouse cost optimization initiative across a Snowflake environment with ${spend}K in monthly spend, auditing {queries}K daily queries and {warehouses} virtual warehouses for rightsizing and clustering opportunities
**Result:** reducing monthly Snowflake spend from ${before}K to ${after}K without degrading {sla}% query SLA compliance

**Variations:**
- **A (Standard):** Optimized Snowflake spend across {queries}K daily queries and {warehouses} warehouses, reducing monthly cost from ${before}K to ${after}K while maintaining {sla}% query SLA compliance.
- **B (Result-first):** Reduced monthly Snowflake spend from ${before}K to ${after}K while maintaining {sla}% SLA by rightsizing {warehouses} warehouses across {queries}K daily queries.
- **C (Impact-led):** Cut monthly Snowflake spend from ${before}K to ${after}K while maintaining {sla}% SLA; audited {queries}K daily queries and {warehouses} warehouses for rightsizing and clustering.
- **D (Concise):** Optimized {warehouses} Snowflake warehouses across {queries}K daily queries, spend from ${before}K to ${after}K/month, {sla}% SLA maintained.

**Variables:**
  - `{spend}`: 20 to 500, step 20 (currency)
  - `{queries}`: 10 to 500, step 10 (integer)
  - `{warehouses}`: 5 to 50, step 5 (integer)
  - `{before}`: 20 to 500, step 20 (currency)
  - `{after}`: 5 to 200, step 5 (currency)
  - `{sla}`: 95 to 99, step 1 (percentage)

### DATA-0083
**Role:** data-engineer | **Theme:** incremental-processing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** incremental processing, watermarking, late-arriving data, idempotent pipelines, incremental refresh, dbt incremental

**Scope:** incremental data processing patterns across {models} dbt models and {pipelines} batch pipelines, replacing {full_refresh} full-refresh jobs with watermark-based incremental loads for {datasets} large datasets
**Result:** reducing average daily processing time from {before} hours to {after} minutes and cutting compute costs by ${savings}K per month

**Variations:**
- **A (Standard):** Implemented incremental processing for {models} dbt models and {pipelines} pipelines replacing {full_refresh} full refreshes, cutting daily processing from {before} hours to {after} minutes and saving ${savings}K/month.
- **B (Result-first):** Reduced daily processing from {before} hours to {after} minutes and saved ${savings}K/month by implementing incremental patterns across {models} dbt models and {pipelines} pipelines.
- **C (Impact-led):** Cut processing from {before} hours to {after} minutes and saved ${savings}K/month; implemented incremental patterns across {models} dbt models and {pipelines} pipelines, replacing {full_refresh} full refreshes.
- **D (Concise):** Implemented incremental processing for {models} dbt models and {pipelines} pipelines, {full_refresh} full refreshes replaced, processing from {before}h to {after}min, ${savings}K/month saved.

**Variables:**
  - `{models}`: 50 to 500, step 50 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{full_refresh}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 10 to 100, step 10 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 10 to 45, step 5 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0084
**Role:** data-engineer | **Theme:** data-platform-adoption | **Seniority:** senior | **Verb Context:** people
**Keywords:** data platform, data enablement, analyst enablement, data training, platform documentation, data community

**Scope:** adoption of a modern data platform across {analysts} data analysts, {scientists} data scientists, and {engineers} business engineers, delivering {workshops} training workshops and {guides} self-service guides
**Result:** increasing platform adoption from {before}% to {after}% within {months} months and reducing data team support requests by {reduction}%

**Variations:**
- **A (Standard):** Drove data platform adoption across {analysts} analysts, {scientists} scientists, and {engineers} business engineers with {workshops} workshops and {guides} guides, growing adoption from {before}% to {after}% in {months} months and cutting support {reduction}%.
- **B (Result-first):** Grew adoption from {before}% to {after}% in {months} months and cut support {reduction}% by delivering {workshops} workshops and {guides} guides across {analysts} analysts, {scientists} scientists, and {engineers} engineers.
- **C (Impact-led):** Grew adoption from {before}% to {after}% in {months} months and cut support {reduction}%; drove platform adoption with {workshops} workshops and {guides} guides across {analysts} analysts, {scientists} scientists, and {engineers} engineers.
- **D (Concise):** Drove data platform adoption across {analysts} analysts, {scientists} scientists, and {engineers} engineers, adoption from {before}% to {after}% in {months} months, support down {reduction}%.

**Variables:**
  - `{analysts}`: 10 to 100, step 10 (integer)
  - `{scientists}`: 5 to 50, step 5 (integer)
  - `{engineers}`: 10 to 200, step 10 (integer)
  - `{workshops}`: 5 to 20, step 5 (integer)
  - `{guides}`: 10 to 50, step 10 (integer)
  - `{before}`: 20 to 45, step 5 (percentage)
  - `{after}`: 70 to 95, step 5 (percentage)
  - `{months}`: 3 to 12, step 3 (integer)
  - `{reduction}`: 30 to 70, step 5 (percentage)

### DATA-0085
**Role:** data-analyst | **Theme:** geospatial-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** geospatial analysis, PostGIS, spatial data, mapping, geographic visualization, location analytics

**Scope:** a geospatial analytics solution using PostGIS and Mapbox for {datasets} location datasets covering {records}M geographic records and {layers} spatial layers across {regions} geographic regions
**Result:** enabling {use_cases} new location-based business decisions and reducing geospatial query execution time from {before} seconds to {after} seconds

**Variations:**
- **A (Standard):** Built PostGIS geospatial analytics across {datasets} datasets, {records}M records, and {layers} layers for {regions} regions, enabling {use_cases} location decisions and cutting query time from {before}s to {after}s.
- **B (Result-first):** Enabled {use_cases} location decisions and cut query time from {before}s to {after}s by building PostGIS analytics across {datasets} datasets and {records}M geographic records.
- **C (Impact-led):** Enabled {use_cases} location decisions and cut query time from {before}s to {after}s; built PostGIS and Mapbox analytics across {datasets} datasets, {records}M records, and {layers} layers.
- **D (Concise):** Built PostGIS geospatial analytics for {datasets} datasets and {records}M records across {layers} layers, {use_cases} location decisions enabled, query from {before}s to {after}s.

**Variables:**
  - `{datasets}`: 5 to 30, step 5 (integer)
  - `{records}`: 1 to 500, step 10 (integer)
  - `{layers}`: 5 to 30, step 5 (integer)
  - `{regions}`: 5 to 50, step 5 (integer)
  - `{use_cases}`: 3 to 15, step 3 (integer)
  - `{before}`: 30 to 120, step 15 (integer)
  - `{after}`: 1 to 5, step 1 (integer)

### DATA-0086
**Role:** data-analyst | **Theme:** hr-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** HR analytics, people analytics, attrition analysis, headcount reporting, DEI metrics, workforce planning

**Scope:** a people analytics platform tracking {metrics} HR metrics including attrition, headcount, DEI, and performance across {departments} departments and {locations} geographic locations
**Result:** identifying {risk_factors} attrition risk factors that informed retention programs reducing voluntary turnover from {before}% to {after}%

**Variations:**
- **A (Standard):** Built people analytics platform tracking {metrics} HR metrics across {departments} departments and {locations} locations, identifying {risk_factors} attrition risk factors that reduced voluntary turnover from {before}% to {after}%.
- **B (Result-first):** Reduced voluntary turnover from {before}% to {after}% by building people analytics tracking {metrics} HR metrics and identifying {risk_factors} attrition risk factors across {departments} departments.
- **C (Impact-led):** Reduced voluntary turnover from {before}% to {after}%; built people analytics tracking {metrics} HR metrics across {departments} departments and {locations} locations, identifying {risk_factors} risk factors.
- **D (Concise):** Built people analytics for {metrics} HR metrics across {departments} departments and {locations} locations, {risk_factors} attrition risk factors identified, turnover from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 50, step 10 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{locations}`: 5 to 50, step 5 (integer)
  - `{risk_factors}`: 3 to 10, step 1 (integer)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 8 to 14, step 2 (percentage)

### DATA-0087
**Role:** data-analyst | **Theme:** competitive-intelligence | **Seniority:** mid | **Verb Context:** content
**Keywords:** competitive intelligence, market analysis, win/loss analysis, competitor benchmarking, market share, pricing intelligence

**Scope:** a competitive intelligence program analyzing {competitors} competitors across {dimensions} market dimensions including pricing, product, and positioning, delivering {reports} quarterly reports to {stakeholders} senior stakeholders
**Result:** enabling {decisions} strategic decisions informed by competitive data and contributing to a {win_rate}% improvement in sales win rate against key competitors

**Variations:**
- **A (Standard):** Built competitive intelligence covering {competitors} competitors across {dimensions} dimensions, delivering {reports} quarterly reports to {stakeholders} stakeholders, enabling {decisions} strategic decisions and improving win rate {win_rate}%.
- **B (Result-first):** Enabled {decisions} strategic decisions and improved win rate {win_rate}% by building competitive intelligence on {competitors} competitors across {dimensions} dimensions with {reports} quarterly reports.
- **C (Impact-led):** Enabled {decisions} strategic decisions and improved win rate {win_rate}%; built competitive intelligence for {competitors} competitors across {dimensions} dimensions delivering {reports} quarterly reports to {stakeholders} stakeholders.
- **D (Concise):** Built competitive intelligence for {competitors} competitors across {dimensions} dimensions, {reports} quarterly reports, {decisions} strategic decisions, win rate up {win_rate}%.

**Variables:**
  - `{competitors}`: 5 to 20, step 5 (integer)
  - `{dimensions}`: 5 to 15, step 5 (integer)
  - `{reports}`: 4 to 12, step 2 (integer)
  - `{stakeholders}`: 5 to 20, step 5 (integer)
  - `{decisions}`: 5 to 20, step 5 (integer)
  - `{win_rate}`: 5 to 25, step 5 (percentage)

### DATA-0088
**Role:** data-analyst | **Theme:** web-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** web analytics, Google Analytics 4, GA4, UTM tracking, conversion tracking, web performance, session analysis

**Scope:** a GA4 web analytics implementation for a {pages}-page website with {sessions}M monthly sessions, configuring {events} custom events, {conversions} conversion goals, and {audiences} remarketing audiences
**Result:** improving data capture completeness from {before}% to {after}% and uncovering {insights} actionable insights that improved conversion rate from {conv_before}% to {conv_after}%

**Variations:**
- **A (Standard):** Implemented GA4 for a {pages}-page site at {sessions}M monthly sessions with {events} events and {conversions} goals, improving capture from {before}% to {after}% and growing conversion from {conv_before}% to {conv_after}%.
- **B (Result-first):** Improved data capture from {before}% to {after}% and grew conversion from {conv_before}% to {conv_after}% by implementing GA4 with {events} events and {conversions} goals for {sessions}M monthly sessions.
- **C (Impact-led):** Improved capture from {before}% to {after}% and grew conversion from {conv_before}% to {conv_after}%; implemented GA4 for {sessions}M monthly sessions with {events} events and {conversions} goals.
- **D (Concise):** Implemented GA4 for {sessions}M monthly sessions with {events} events and {conversions} goals, capture from {before}% to {after}%, conversion from {conv_before}% to {conv_after}%.

**Variables:**
  - `{pages}`: 50 to 5000, step 50 (integer)
  - `{sessions}`: 0.1 to 50, step 0.5 (integer)
  - `{events}`: 20 to 200, step 20 (integer)
  - `{conversions}`: 5 to 20, step 5 (integer)
  - `{audiences}`: 5 to 30, step 5 (integer)
  - `{before}`: 60 to 80, step 5 (percentage)
  - `{after}`: 90 to 99, step 2 (percentage)
  - `{conv_before}`: 1 to 5, step 0.5 (percentage)
  - `{conv_after}`: 3 to 10, step 0.5 (percentage)
  - `{insights}`: 5 to 20, step 5 (integer)

### DATA-0089
**Role:** data-scientist | **Theme:** causal-inference | **Seniority:** senior | **Verb Context:** systems
**Keywords:** causal inference, propensity scoring, difference-in-differences, regression discontinuity, uplift modeling, treatment effect

**Scope:** a causal inference framework using propensity score matching and difference-in-differences for {studies} observational studies, estimating treatment effects for {interventions} business interventions across {observations}K records
**Result:** producing {studies} causal estimates that replaced flawed correlation-based decisions and attributing ${impact}K in verified incremental revenue to data-informed interventions

**Variations:**
- **A (Standard):** Applied propensity matching and DiD causal inference across {studies} studies and {observations}K records, producing {studies} causal estimates and attributing ${impact}K in verified incremental revenue.
- **B (Result-first):** Attributed ${impact}K in verified incremental revenue and replaced {studies} flawed correlation analyses by applying causal inference across {interventions} interventions and {observations}K records.
- **C (Impact-led):** Attributed ${impact}K in verified incremental revenue and replaced flawed analyses; applied propensity matching and DiD across {studies} studies and {observations}K records for {interventions} interventions.
- **D (Concise):** Applied causal inference across {studies} studies and {observations}K records for {interventions} interventions, ${impact}K incremental revenue attributed.

**Variables:**
  - `{studies}`: 5 to 30, step 5 (integer)
  - `{interventions}`: 5 to 20, step 5 (integer)
  - `{observations}`: 10 to 1000, step 10 (integer)
  - `{impact}`: 100 to 5000, step 100 (currency)

### DATA-0090
**Role:** data-scientist | **Theme:** reinforcement-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** reinforcement learning, RL, policy gradient, reward function, simulation, bandit algorithms, contextual bandits

**Scope:** a contextual bandit RL system for {use_case} personalization optimizing {actions} decision actions across {contexts} context dimensions for {users}M users, trained on {samples}M logged interaction samples
**Result:** improving {metric} by {improvement}% over the A/B tested rule-based baseline and generating ${revenue}K in incremental monthly impact

**Variations:**
- **A (Standard):** Built contextual bandit system for {use_case} across {actions} actions and {contexts} context dimensions for {users}M users, improving {metric} {improvement}% over rule-based baseline and generating ${revenue}K monthly.
- **B (Result-first):** Improved {metric} {improvement}% over baseline and generated ${revenue}K monthly by building contextual bandit for {use_case} across {actions} actions and {contexts} dimensions.
- **C (Impact-led):** Improved {metric} {improvement}% over baseline and generated ${revenue}K monthly; built contextual bandit for {use_case} across {actions} actions, {contexts} dimensions, and {users}M users.
- **D (Concise):** Built contextual bandit for {use_case} across {actions} actions and {contexts} dimensions for {users}M users, {metric} up {improvement}%, ${revenue}K monthly impact.

**Variables:**
  - `{actions}`: 5 to 50, step 5 (integer)
  - `{contexts}`: 10 to 100, step 10 (integer)
  - `{users}`: 1 to 100, step 1 (integer)
  - `{samples}`: 1 to 500, step 10 (integer)
  - `{improvement}`: 10 to 40, step 5 (percentage)
  - `{revenue}`: 50 to 1000, step 50 (currency)

### DATA-0091
**Role:** ml-engineer | **Theme:** online-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** online learning, real-time ML, streaming features, continual learning, model staleness, live retraining

**Scope:** an online learning system for {models} production models processing {events}M events per day, updating model weights in near-real-time using streaming features from {sources} feature sources
**Result:** reducing model staleness lag from {before} hours to {after} minutes and improving prediction accuracy by {accuracy}% over static weekly retrained models

**Variations:**
- **A (Standard):** Built online learning for {models} models at {events}M events/day with streaming features from {sources} sources, cutting staleness from {before} hours to {after} minutes and improving accuracy {accuracy}% over static baselines.
- **B (Result-first):** Reduced staleness from {before} hours to {after} minutes and improved accuracy {accuracy}% by building online learning for {models} models at {events}M events/day.
- **C (Impact-led):** Cut staleness from {before} hours to {after} minutes and improved accuracy {accuracy}%; built online learning for {models} models at {events}M events/day with streaming features from {sources} sources.
- **D (Concise):** Built online learning for {models} models at {events}M events/day from {sources} sources, staleness from {before}h to {after}min, accuracy up {accuracy}%.

**Variables:**
  - `{models}`: 3 to 15, step 3 (integer)
  - `{events}`: 1 to 100, step 5 (integer)
  - `{sources}`: 3 to 10, step 1 (integer)
  - `{before}`: 12 to 168, step 12 (integer)
  - `{after}`: 1 to 10, step 1 (integer)
  - `{accuracy}`: 5 to 25, step 5 (percentage)

### DATA-0092
**Role:** ml-engineer | **Theme:** active-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** active learning, annotation efficiency, label selection, uncertainty sampling, human-in-the-loop, annotation cost

**Scope:** an active learning pipeline using uncertainty sampling to prioritize {samples}K annotation candidates from a pool of {pool}M unlabeled examples for a {task} task, reducing labeling effort
**Result:** achieving equivalent model performance with {reduction}% fewer labeled samples and saving ${savings}K in annotation costs

**Variations:**
- **A (Standard):** Built active learning pipeline using uncertainty sampling for {task}, selecting {samples}K from {pool}M candidates, achieving target performance with {reduction}% fewer labels and saving ${savings}K in annotation.
- **B (Result-first):** Achieved target performance with {reduction}% fewer labels and saved ${savings}K in annotation by building active learning pipeline selecting {samples}K from {pool}M candidates for {task}.
- **C (Impact-led):** Reached target performance with {reduction}% fewer labels and saved ${savings}K; built active learning pipeline using uncertainty sampling to select {samples}K from {pool}M candidates for {task}.
- **D (Concise):** Built active learning for {task} selecting {samples}K from {pool}M pool, target performance with {reduction}% fewer labels, ${savings}K annotation savings.

**Variables:**
  - `{samples}`: 1 to 50, step 1 (integer)
  - `{pool}`: 1 to 100, step 5 (integer)
  - `{reduction}`: 30 to 80, step 5 (percentage)
  - `{savings}`: 20 to 500, step 20 (currency)

### DATA-0093
**Role:** ml-engineer | **Theme:** model-fairness | **Seniority:** senior | **Verb Context:** operations
**Keywords:** model fairness, AI bias, fairness metrics, disparate impact, demographic parity, equalized odds, responsible AI

**Scope:** a model fairness assessment and remediation framework for {models} production models across {groups} demographic subgroups, measuring {metrics} fairness metrics and implementing {mitigations} bias mitigation techniques
**Result:** reducing maximum demographic performance disparity from {before}% to {after}% across protected groups and achieving regulatory compliance for {models} models

**Variations:**
- **A (Standard):** Built fairness framework for {models} models across {groups} groups with {metrics} metrics and {mitigations} mitigations, reducing max performance disparity from {before}% to {after}% and achieving regulatory compliance.
- **B (Result-first):** Reduced max disparity from {before}% to {after}% and achieved regulatory compliance by building fairness framework for {models} models across {groups} groups with {mitigations} mitigations.
- **C (Impact-led):** Cut max disparity from {before}% to {after}% and achieved regulatory compliance; built fairness framework for {models} models across {groups} groups with {metrics} metrics and {mitigations} mitigations.
- **D (Concise):** Built fairness framework for {models} models across {groups} groups, {metrics} metrics, {mitigations} mitigations, disparity from {before}% to {after}%, regulatory compliant.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{groups}`: 3 to 10, step 1 (integer)
  - `{metrics}`: 3 to 8, step 1 (integer)
  - `{mitigations}`: 2 to 5, step 1 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)

### DATA-0094
**Role:** data-engineer | **Theme:** orchestration-migration | **Seniority:** senior | **Verb Context:** projects
**Keywords:** Airflow, workflow migration, DAG migration, orchestration, Prefect, Dagster, pipeline orchestration

**Scope:** a migration from legacy cron-based jobs to Apache Airflow, converting {jobs} scheduled jobs into {dags} DAGs across {teams} data teams and {environments} environments
**Result:** reducing pipeline failure rate from {before}% to {after}%, improving mean time to failure detection from {detect_before} hours to {detect_after} minutes

**Variations:**
- **A (Standard):** Led Airflow migration converting {jobs} cron jobs into {dags} DAGs across {teams} teams and {environments} environments, cutting failure rate from {before}% to {after}% and detection time from {detect_before}h to {detect_after}min.
- **B (Result-first):** Reduced pipeline failures from {before}% to {after}% and detection from {detect_before}h to {detect_after}min by migrating {jobs} cron jobs to {dags} Airflow DAGs across {teams} teams.
- **C (Impact-led):** Cut failures from {before}% to {after}% and detection from {detect_before}h to {detect_after}min; migrated {jobs} cron jobs to {dags} Airflow DAGs across {teams} teams in {environments} environments.
- **D (Concise):** Migrated {jobs} cron jobs to {dags} Airflow DAGs across {teams} teams and {environments} environments, failures from {before}% to {after}%, detection from {detect_before}h to {detect_after}min.

**Variables:**
  - `{jobs}`: 50 to 500, step 50 (integer)
  - `{dags}`: 50 to 500, step 50 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 0.5 to 3, step 0.5 (percentage)
  - `{detect_before}`: 4 to 24, step 4 (integer)
  - `{detect_after}`: 5 to 30, step 5 (integer)

### DATA-0095
**Role:** data-engineer | **Theme:** access-control-data | **Seniority:** mid | **Verb Context:** systems
**Keywords:** row-level security, column masking, data access control, Snowflake RBAC, BigQuery IAM, data permissions

**Scope:** row-level security and column-level masking policies across a {tables}K-table data warehouse for {roles} user roles and {users}K users, enforcing {policies} access policies aligned to data classification tiers
**Result:** achieving {compliance}% policy compliance and reducing unauthorized data exposure incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Implemented RLS and column masking for {tables}K tables across {roles} roles and {users}K users with {policies} policies, achieving {compliance}% compliance and cutting exposure incidents from {before} to {after}/quarter.
- **B (Result-first):** Achieved {compliance}% compliance and cut exposure incidents from {before} to {after}/quarter by implementing RLS and masking for {tables}K tables across {roles} roles and {users}K users.
- **C (Impact-led):** Reached {compliance}% compliance and cut exposure incidents from {before} to {after}/quarter; implemented RLS and masking across {tables}K tables for {roles} roles and {users}K users with {policies} policies.
- **D (Concise):** Implemented RLS and masking for {tables}K tables across {roles} roles and {users}K users, {compliance}% compliance, exposure incidents from {before} to {after}/quarter.

**Variables:**
  - `{tables}`: 1 to 50, step 1 (integer)
  - `{roles}`: 10 to 100, step 10 (integer)
  - `{users}`: 1 to 50, step 1 (integer)
  - `{policies}`: 20 to 200, step 20 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### DATA-0096
**Role:** bi-analyst | **Theme:** real-time-dashboard | **Seniority:** mid | **Verb Context:** systems
**Keywords:** real-time dashboard, live data, streaming analytics, operational dashboard, real-time BI, live metrics

**Scope:** real-time operational dashboards using Grafana and Apache Kafka for {stakeholders} operational teams, tracking {metrics} live metrics with sub-{latency} second data freshness across {systems} monitored systems
**Result:** reducing mean time to detect operational anomalies from {before} minutes to {after} seconds and enabling {decisions} faster operational decisions per week

**Variations:**
- **A (Standard):** Built real-time Grafana dashboards for {stakeholders} teams tracking {metrics} metrics at sub-{latency}s freshness across {systems} systems, cutting anomaly detection from {before}min to {after}s and enabling {decisions} faster decisions/week.
- **B (Result-first):** Reduced anomaly detection from {before}min to {after}s and enabled {decisions} faster decisions/week by building real-time dashboards for {stakeholders} teams tracking {metrics} metrics across {systems} systems.
- **C (Impact-led):** Cut anomaly detection from {before}min to {after}s and enabled {decisions} faster decisions/week; built real-time Grafana dashboards for {stakeholders} teams tracking {metrics} metrics at sub-{latency}s freshness.
- **D (Concise):** Built real-time dashboards for {stakeholders} teams across {metrics} metrics and {systems} systems at sub-{latency}s, anomaly detection from {before}min to {after}s, {decisions} faster decisions/week.

**Variables:**
  - `{stakeholders}`: 5 to 20, step 5 (integer)
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{latency}`: 1 to 10, step 1 (integer)
  - `{systems}`: 10 to 100, step 10 (integer)
  - `{before}`: 15 to 60, step 5 (integer)
  - `{after}`: 5 to 30, step 5 (integer)
  - `{decisions}`: 10 to 50, step 10 (integer)

### DATA-0097
**Role:** bi-analyst | **Theme:** financial-planning-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** FP&A analytics, financial modeling, budget variance, forecast accuracy, P&L analytics, financial BI

**Scope:** an FP&A analytics platform for a ${revenue}M revenue business tracking {metrics} financial metrics across {cost_centers} cost centers and {entities} legal entities, with rolling forecasts and budget variance analysis
**Result:** reducing forecast error from {before}% to {after}% MAPE and cutting monthly financial close reporting time from {close_before} days to {close_after} days

**Variations:**
- **A (Standard):** Built FP&A platform for a ${revenue}M business tracking {metrics} metrics across {cost_centers} cost centers and {entities} entities, improving forecast MAPE from {before}% to {after}% and cutting close time from {close_before} to {close_after} days.
- **B (Result-first):** Improved forecast MAPE from {before}% to {after}% and cut close time from {close_before} to {close_after} days by building FP&A platform for {metrics} metrics across {cost_centers} cost centers.
- **C (Impact-led):** Improved forecast MAPE from {before}% to {after}% and cut close time from {close_before} to {close_after} days; built FP&A platform tracking {metrics} metrics across {cost_centers} cost centers and {entities} entities.
- **D (Concise):** Built FP&A platform for {metrics} metrics across {cost_centers} cost centers and {entities} entities, forecast MAPE from {before}% to {after}%, close time from {close_before} to {close_after} days.

**Variables:**
  - `{revenue}`: 10 to 1000, step 50 (currency)
  - `{metrics}`: 20 to 100, step 20 (integer)
  - `{cost_centers}`: 10 to 100, step 10 (integer)
  - `{entities}`: 2 to 20, step 2 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 2 to 8, step 2 (percentage)
  - `{close_before}`: 10 to 20, step 5 (integer)
  - `{close_after}`: 2 to 5, step 1 (integer)

### DATA-0098
**Role:** data-scientist | **Theme:** survival-analysis | **Seniority:** senior | **Verb Context:** systems
**Keywords:** survival analysis, Cox proportional hazard, Kaplan-Meier, time-to-event, hazard ratio, customer lifetime

**Scope:** a survival analysis framework using Cox proportional hazards across {cohorts} customer cohorts and {features} predictor features to model time-to-churn and time-to-conversion for {customers}K customers
**Result:** improving LTV prediction accuracy by {accuracy}% and enabling the retention team to prioritize {at_risk}K at-risk customers per month

**Variations:**
- **A (Standard):** Built Cox proportional hazard survival model across {cohorts} cohorts and {features} features for {customers}K customers, improving LTV accuracy {accuracy}% and enabling prioritization of {at_risk}K at-risk customers monthly.
- **B (Result-first):** Improved LTV accuracy {accuracy}% and enabled prioritization of {at_risk}K at-risk monthly customers by building Cox survival analysis across {cohorts} cohorts and {features} features.
- **C (Impact-led):** Improved LTV accuracy {accuracy}% and enabled {at_risk}K monthly at-risk prioritization; built Cox survival model across {cohorts} cohorts and {features} features for {customers}K customers.
- **D (Concise):** Built Cox survival model across {cohorts} cohorts and {features} features for {customers}K customers, LTV accuracy up {accuracy}%, {at_risk}K at-risk customers prioritized monthly.

**Variables:**
  - `{cohorts}`: 5 to 30, step 5 (integer)
  - `{features}`: 20 to 100, step 10 (integer)
  - `{customers}`: 10 to 1000, step 10 (integer)
  - `{accuracy}`: 10 to 35, step 5 (percentage)
  - `{at_risk}`: 1 to 50, step 5 (integer)

### DATA-0099
**Role:** data-scientist | **Theme:** graph-ml | **Seniority:** senior | **Verb Context:** systems
**Keywords:** graph machine learning, GNN, graph neural networks, node classification, link prediction, PyG, network analysis

**Scope:** a graph neural network model using PyTorch Geometric for {task} on a graph of {nodes}M nodes and {edges}M edges, trained with {features} node and edge features for {use_case} predictions
**Result:** improving {metric} from {before} to {after} over GBM baseline and reducing inference time from {inf_before} seconds to {inf_after}ms at prediction scale

**Variations:**
- **A (Standard):** Built PyG GNN for {task} on a {nodes}M-node, {edges}M-edge graph with {features} features, improving {metric} from {before} to {after} over GBM baseline and cutting inference from {inf_before}s to {inf_after}ms.
- **B (Result-first):** Improved {metric} from {before} to {after} over GBM baseline and cut inference from {inf_before}s to {inf_after}ms by building PyG GNN for {task} on a {nodes}M-node, {edges}M-edge graph.
- **C (Impact-led):** Improved {metric} from {before} to {after} over baseline and cut inference from {inf_before}s to {inf_after}ms; built PyG GNN for {task} on {nodes}M nodes and {edges}M edges with {features} features.
- **D (Concise):** Built PyG GNN for {task} on {nodes}M nodes and {edges}M edges, {metric} from {before} to {after} vs GBM, inference from {inf_before}s to {inf_after}ms.

**Variables:**
  - `{nodes}`: 0.1 to 100, step 1 (integer)
  - `{edges}`: 0.5 to 500, step 5 (integer)
  - `{features}`: 10 to 200, step 10 (integer)
  - `{before}`: 0.6 to 0.75, step 0.05 (integer)
  - `{after}`: 0.8 to 0.95, step 0.05 (integer)
  - `{inf_before}`: 5 to 30, step 5 (integer)
  - `{inf_after}`: 50 to 500, step 50 (integer)

### DATA-0100
**Role:** data-engineer | **Theme:** api-data-ingestion | **Seniority:** junior | **Verb Context:** systems
**Keywords:** API ingestion, REST API, pagination, rate limiting, data extraction, third-party data, connector development

**Scope:** REST API data ingestion connectors for {sources} third-party data sources, handling pagination, rate limiting, and incremental extraction for {endpoints} endpoints delivering {records}M records per day
**Result:** achieving {uptime}% connector uptime and reducing manual data collection effort from {before} hours to {after} hours per week

**Variations:**
- **A (Standard):** Built REST API connectors for {sources} sources across {endpoints} endpoints delivering {records}M records/day, achieving {uptime}% uptime and cutting manual collection from {before} to {after} hours/week.
- **B (Result-first):** Achieved {uptime}% uptime and cut manual collection from {before} to {after} hours/week by building REST API connectors for {sources} sources across {endpoints} endpoints at {records}M records/day.
- **C (Impact-led):** Reached {uptime}% uptime and cut manual collection from {before} to {after} hours/week; built REST connectors for {sources} sources across {endpoints} endpoints delivering {records}M records/day.
- **D (Concise):** Built REST API connectors for {sources} sources across {endpoints} endpoints at {records}M records/day, {uptime}% uptime, manual collection from {before} to {after}h/week.

**Variables:**
  - `{sources}`: 5 to 30, step 5 (integer)
  - `{endpoints}`: 20 to 200, step 20 (integer)
  - `{records}`: 0.1 to 50, step 0.5 (integer)
  - `{uptime}`: 98 to 99.9, step 0.1 (percentage)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0101
**Role:** data-engineer | **Theme:** data-archiving | **Seniority:** mid | **Verb Context:** operations
**Keywords:** data archiving, data retention, cold storage, S3 Glacier, tiered storage, data lifecycle, compliance archiving

**Scope:** a data archiving and lifecycle management policy across {tables} production tables with {volume}TB of data, implementing tiered storage with automatic transition from hot to cold to archive tiers after {retention} days
**Result:** reducing active storage costs by ${savings}K per month and achieving {compliance}% regulatory retention compliance across {datasets} governed datasets

**Variations:**
- **A (Standard):** Implemented data lifecycle management across {tables} tables and {volume}TB, tiering storage after {retention} days, saving ${savings}K/month and achieving {compliance}% retention compliance across {datasets} datasets.
- **B (Result-first):** Saved ${savings}K/month and achieved {compliance}% retention compliance by implementing lifecycle management across {tables} tables and {volume}TB with {retention}-day tiering.
- **C (Impact-led):** Saved ${savings}K/month and achieved {compliance}% retention compliance; implemented lifecycle tiering across {tables} tables and {volume}TB, transitioning after {retention} days.
- **D (Concise):** Implemented lifecycle tiering across {tables} tables and {volume}TB at {retention}-day transition, ${savings}K/month saved, {compliance}% retention compliance.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{volume}`: 10 to 1000, step 10 (integer)
  - `{retention}`: 30 to 365, step 30 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{datasets}`: 20 to 200, step 20 (integer)

### DATA-0102
**Role:** bi-analyst | **Theme:** sales-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sales analytics, pipeline analytics, win rate, sales velocity, CRM analytics, quota attainment, Salesforce analytics

**Scope:** a Salesforce sales analytics platform tracking {metrics} pipeline and performance metrics across {reps} sales reps, {regions} regions, and {segments} market segments with weekly and monthly reporting
**Result:** improving forecast accuracy from {before}% to {after}% and identifying ${pipeline}K in stale pipeline that was either accelerated or cleaned from CRM

**Variations:**
- **A (Standard):** Built Salesforce analytics for {reps} reps across {regions} regions and {segments} segments tracking {metrics} metrics, improving forecast from {before}% to {after}% and surfacing ${pipeline}K in stale pipeline.
- **B (Result-first):** Improved forecast accuracy from {before}% to {after}% and surfaced ${pipeline}K in stale pipeline by building Salesforce analytics for {reps} reps across {regions} regions and {segments} segments.
- **C (Impact-led):** Improved forecast from {before}% to {after}% and surfaced ${pipeline}K in stale pipeline; built Salesforce analytics for {reps} reps across {regions} regions and {segments} segments tracking {metrics} metrics.
- **D (Concise):** Built Salesforce analytics for {reps} reps across {regions} regions and {segments} segments with {metrics} metrics, forecast from {before}% to {after}%, ${pipeline}K stale pipeline surfaced.

**Variables:**
  - `{metrics}`: 10 to 50, step 10 (integer)
  - `{reps}`: 20 to 500, step 20 (integer)
  - `{regions}`: 3 to 15, step 3 (integer)
  - `{segments}`: 3 to 8, step 1 (integer)
  - `{before}`: 55 to 75, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)
  - `{pipeline}`: 100 to 5000, step 100 (currency)

### DATA-0103
**Role:** data-analyst | **Theme:** logistics-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** logistics analytics, last-mile delivery, route optimization, on-time delivery, carrier analytics, fulfillment analytics

**Scope:** a logistics analytics platform tracking {metrics} delivery and fulfillment metrics across {carriers} carriers, {routes} routes, and {regions} geographic regions for {shipments}K daily shipments
**Result:** identifying ${savings}K in annual carrier cost savings and improving on-time delivery rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built logistics analytics for {shipments}K daily shipments across {carriers} carriers, {routes} routes, and {regions} regions, identifying ${savings}K in carrier savings and improving on-time delivery from {before}% to {after}%.
- **B (Result-first):** Identified ${savings}K in carrier savings and improved on-time delivery from {before}% to {after}% by building logistics analytics across {carriers} carriers, {routes} routes, and {regions} regions.
- **C (Impact-led):** Identified ${savings}K in carrier savings and improved on-time delivery from {before}% to {after}%; built logistics analytics for {shipments}K daily shipments across {carriers} carriers and {regions} regions.
- **D (Concise):** Built logistics analytics for {shipments}K shipments/day across {carriers} carriers and {regions} regions, ${savings}K carrier savings, on-time from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 10 (integer)
  - `{carriers}`: 3 to 20, step 3 (integer)
  - `{routes}`: 50 to 1000, step 50 (integer)
  - `{regions}`: 5 to 50, step 5 (integer)
  - `{shipments}`: 1 to 100, step 5 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 80 to 92, step 2 (percentage)
  - `{after}`: 93 to 99, step 1 (percentage)

### DATA-0104
**Role:** data-analyst | **Theme:** customer-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** customer analytics, 360 customer view, CRM analytics, customer health score, account analytics, customer journey

**Scope:** a customer 360 analytics solution unifying {sources} data sources including CRM, product usage, and support data for {customers}K customers, enabling {metrics} customer health metrics and journey mapping
**Result:** improving average account health score accuracy from {before}% to {after}% and enabling {csm} CSMs to proactively address {risks} at-risk accounts per month

**Variations:**
- **A (Standard):** Built customer 360 unifying {sources} sources for {customers}K customers with {metrics} health metrics, improving health score accuracy from {before}% to {after}% and enabling {csm} CSMs to address {risks} at-risk accounts/month.
- **B (Result-first):** Improved health score accuracy from {before}% to {after}% and enabled {csm} CSMs to address {risks} at-risk accounts/month by building customer 360 across {sources} sources for {customers}K customers.
- **C (Impact-led):** Improved health score accuracy from {before}% to {after}% and enabled {csm} CSMs to address {risks} at-risk accounts/month; built customer 360 unifying {sources} sources for {customers}K customers.
- **D (Concise):** Built customer 360 from {sources} sources for {customers}K customers with {metrics} health metrics, accuracy from {before}% to {after}%, {csm} CSMs addressing {risks} at-risk accounts/month.

**Variables:**
  - `{sources}`: 3 to 10, step 1 (integer)
  - `{customers}`: 1 to 100, step 5 (integer)
  - `{metrics}`: 10 to 50, step 10 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)
  - `{csm}`: 5 to 50, step 5 (integer)
  - `{risks}`: 10 to 100, step 10 (integer)

### DATA-0105
**Role:** data-scientist | **Theme:** multi-modal-ml | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multimodal ML, vision-language model, CLIP, cross-modal retrieval, image-text, fusion model

**Scope:** a multimodal ML model fusing {modalities} data modalities including text, image, and tabular features for a {task} task, trained on {samples}M paired samples and served at {qps}K queries per second
**Result:** improving {metric} by {improvement}% over single-modality baselines and reducing human review requirements by {review}%

**Variations:**
- **A (Standard):** Built multimodal model fusing {modalities} modalities for {task} on {samples}M samples at {qps}K QPS, improving {metric} {improvement}% over single-modality baselines and reducing human review {review}%.
- **B (Result-first):** Improved {metric} {improvement}% over single-modality baselines and reduced human review {review}% by building multimodal model fusing {modalities} modalities for {task} on {samples}M samples.
- **C (Impact-led):** Improved {metric} {improvement}% over baselines and cut human review {review}%; built multimodal model fusing {modalities} modalities for {task} on {samples}M samples at {qps}K QPS.
- **D (Concise):** Built multimodal model for {task} fusing {modalities} modalities on {samples}M samples at {qps}K QPS, {metric} up {improvement}%, human review down {review}%.

**Variables:**
  - `{modalities}`: 2 to 4, step 1 (integer)
  - `{samples}`: 1 to 100, step 5 (integer)
  - `{qps}`: 1 to 50, step 5 (integer)
  - `{improvement}`: 10 to 35, step 5 (percentage)
  - `{review}`: 30 to 70, step 5 (percentage)

### DATA-0106
**Role:** data-engineer | **Theme:** metadata-management | **Seniority:** mid | **Verb Context:** systems
**Keywords:** metadata management, data discovery, DataHub, Amundsen, data catalog, searchable metadata

**Scope:** a metadata management platform using DataHub for {assets} data assets across {sources} sources, capturing {metadata_types} metadata types including schema, ownership, usage, and freshness for {users}K data consumers
**Result:** reducing average data discovery time from {before} minutes to {after} minutes and increasing data asset reuse from {reuse_before}% to {reuse_after}%

**Variations:**
- **A (Standard):** Deployed DataHub metadata platform for {assets} assets across {sources} sources with {metadata_types} metadata types, cutting discovery time from {before} to {after} minutes and growing asset reuse from {reuse_before}% to {reuse_after}%.
- **B (Result-first):** Reduced discovery time from {before} to {after} minutes and grew reuse from {reuse_before}% to {reuse_after}% by deploying DataHub for {assets} assets across {sources} sources.
- **C (Impact-led):** Cut discovery from {before} to {after} minutes and grew reuse from {reuse_before}% to {reuse_after}%; deployed DataHub for {assets} assets across {sources} sources with {metadata_types} metadata types.
- **D (Concise):** Deployed DataHub for {assets} assets across {sources} sources with {metadata_types} metadata types, discovery from {before} to {after}min, reuse from {reuse_before}% to {reuse_after}%.

**Variables:**
  - `{assets}`: 500 to 10000, step 500 (integer)
  - `{sources}`: 10 to 50, step 10 (integer)
  - `{metadata_types}`: 3 to 8, step 1 (integer)
  - `{users}`: 50 to 500, step 50 (integer)
  - `{before}`: 30 to 120, step 15 (integer)
  - `{after}`: 2 to 10, step 2 (integer)
  - `{reuse_before}`: 15 to 35, step 5 (percentage)
  - `{reuse_after}`: 50 to 80, step 5 (percentage)

### DATA-0107
**Role:** data-analyst | **Theme:** ecommerce-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ecommerce analytics, basket analysis, conversion funnel, cart abandonment, GMV analytics, purchase behavior

**Scope:** ecommerce analytics for a {gmv}M GMV platform tracking {metrics} purchase and behavior metrics across {categories} product categories and {segments} customer segments with daily reporting
**Result:** identifying cart abandonment patterns that informed ${recovery}K in recovered revenue and improving checkout conversion from {before}% to {after}%

**Variations:**
- **A (Standard):** Built ecommerce analytics for a ${gmv}M GMV platform tracking {metrics} metrics across {categories} categories and {segments} segments, recovering ${recovery}K in abandoned cart revenue and improving checkout from {before}% to {after}%.
- **B (Result-first):** Recovered ${recovery}K in abandoned cart revenue and improved checkout from {before}% to {after}% by building ecommerce analytics for a ${gmv}M GMV platform across {categories} categories.
- **C (Impact-led):** Recovered ${recovery}K in cart revenue and improved checkout from {before}% to {after}%; built ecommerce analytics for a ${gmv}M GMV platform tracking {metrics} metrics across {categories} categories.
- **D (Concise):** Built ecommerce analytics for ${gmv}M GMV platform across {categories} categories and {segments} segments, ${recovery}K cart revenue recovered, checkout from {before}% to {after}%.

**Variables:**
  - `{gmv}`: 10 to 1000, step 50 (currency)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{categories}`: 5 to 50, step 5 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{recovery}`: 50 to 2000, step 50 (currency)
  - `{before}`: 1 to 5, step 0.5 (percentage)
  - `{after}`: 5 to 15, step 1 (percentage)

### DATA-0108
**Role:** ml-engineer | **Theme:** federated-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** federated learning, privacy-preserving ML, on-device training, differential privacy, PySyft, data silos

**Scope:** a federated learning system training {models} models across {clients} edge clients without centralizing sensitive data, using differential privacy with epsilon of {epsilon} and secure aggregation for {rounds} federation rounds
**Result:** achieving {accuracy}% of centralized training accuracy while preserving user privacy and enabling ML across {jurisdictions} data-silo jurisdictions that were previously inaccessible

**Variations:**
- **A (Standard):** Built federated learning for {models} models across {clients} clients with differential privacy at epsilon {epsilon} over {rounds} rounds, achieving {accuracy}% of centralized accuracy and enabling {jurisdictions} previously inaccessible jurisdictions.
- **B (Result-first):** Achieved {accuracy}% of centralized accuracy and enabled {jurisdictions} previously inaccessible jurisdictions by building federated learning for {models} models across {clients} clients with epsilon {epsilon}.
- **C (Impact-led):** Reached {accuracy}% of centralized accuracy and enabled {jurisdictions} previously inaccessible jurisdictions; built federated learning for {models} models across {clients} clients with differential privacy at epsilon {epsilon}.
- **D (Concise):** Built federated learning for {models} models across {clients} clients at epsilon {epsilon} over {rounds} rounds, {accuracy}% of centralized accuracy, {jurisdictions} previously inaccessible jurisdictions enabled.

**Variables:**
  - `{models}`: 2 to 10, step 1 (integer)
  - `{clients}`: 10 to 10000, step 100 (integer)
  - `{epsilon}`: 0.1 to 5, step 0.5 (integer)
  - `{rounds}`: 10 to 100, step 10 (integer)
  - `{accuracy}`: 85 to 98, step 2 (percentage)
  - `{jurisdictions}`: 2 to 10, step 1 (integer)

### DATA-0109
**Role:** data-scientist | **Theme:** bayesian-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Bayesian statistics, PyMC, posterior inference, uncertainty quantification, MCMC, probabilistic programming

**Scope:** a Bayesian hierarchical model using PyMC for a {domain} problem across {groups} hierarchical groups and {observations}K observations, providing full posterior distributions for {parameters} key business parameters
**Result:** reducing decision uncertainty by quantifying {parameters} business parameters with credible intervals and improving model out-of-sample performance by {improvement}% over frequentist baselines

**Variations:**
- **A (Standard):** Built PyMC Bayesian hierarchical model for {domain} across {groups} groups and {observations}K observations, quantifying {parameters} parameters with credible intervals and improving out-of-sample performance {improvement}%.
- **B (Result-first):** Improved out-of-sample performance {improvement}% and quantified {parameters} parameters with credible intervals by building PyMC Bayesian model for {domain} across {groups} groups.
- **C (Impact-led):** Improved out-of-sample performance {improvement}% and quantified {parameters} parameters with credible intervals; built PyMC Bayesian model for {domain} across {groups} groups and {observations}K observations.
- **D (Concise):** Built PyMC Bayesian model for {domain} across {groups} groups and {observations}K observations, {parameters} parameters with credible intervals, {improvement}% out-of-sample improvement.

**Variables:**
  - `{groups}`: 5 to 100, step 5 (integer)
  - `{observations}`: 10 to 1000, step 10 (integer)
  - `{parameters}`: 5 to 30, step 5 (integer)
  - `{improvement}`: 10 to 30, step 5 (percentage)

### DATA-0110
**Role:** data-engineer | **Theme:** cloud-storage-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** S3 optimization, cloud storage, Parquet, columnar storage, file format optimization, compression, partitioning

**Scope:** a storage optimization initiative converting {tables} data tables from CSV to Parquet with columnar compression and partition pruning across a {volume}TB data lake
**Result:** reducing query scan volume by {scan}% and cutting monthly storage and compute costs by ${savings}K

**Variations:**
- **A (Standard):** Converted {tables} tables from CSV to Parquet with partitioning across a {volume}TB lake, reducing query scan volume {scan}% and cutting storage and compute costs by ${savings}K/month.
- **B (Result-first):** Reduced query scan volume {scan}% and cut costs ${savings}K/month by converting {tables} tables to Parquet with partition pruning across a {volume}TB lake.
- **C (Impact-led):** Cut query scan volume {scan}% and costs ${savings}K/month; converted {tables} tables from CSV to Parquet with columnar compression and partitioning across a {volume}TB data lake.
- **D (Concise):** Converted {tables} tables to Parquet across {volume}TB lake, query scan down {scan}%, ${savings}K/month in storage and compute savings.

**Variables:**
  - `{tables}`: 50 to 2000, step 50 (integer)
  - `{volume}`: 10 to 1000, step 10 (integer)
  - `{scan}`: 50 to 90, step 5 (percentage)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0111
**Role:** bi-analyst | **Theme:** customer-support-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** support analytics, CSAT, NPS, ticket analytics, resolution time, support operations BI, contact rate

**Scope:** a customer support analytics platform tracking {metrics} support metrics including CSAT, resolution time, and contact rate across {channels} support channels and {agents} agent groups
**Result:** identifying workflow bottlenecks that reduced average handle time from {before} minutes to {after} minutes and improved CSAT from {csat_before} to {csat_after}/5

**Variations:**
- **A (Standard):** Built support analytics tracking {metrics} metrics across {channels} channels and {agents} agent groups, reducing AHT from {before} to {after} minutes and improving CSAT from {csat_before} to {csat_after}/5.
- **B (Result-first):** Reduced AHT from {before} to {after} minutes and improved CSAT from {csat_before} to {csat_after}/5 by building support analytics across {metrics} metrics, {channels} channels, and {agents} agent groups.
- **C (Impact-led):** Cut AHT from {before} to {after} minutes and improved CSAT from {csat_before} to {csat_after}/5; built support analytics tracking {metrics} metrics across {channels} channels and {agents} agent groups.
- **D (Concise):** Built support analytics for {metrics} metrics across {channels} channels and {agents} groups, AHT from {before} to {after}min, CSAT from {csat_before} to {csat_after}/5.

**Variables:**
  - `{metrics}`: 10 to 40, step 10 (integer)
  - `{channels}`: 3 to 8, step 1 (integer)
  - `{agents}`: 10 to 200, step 10 (integer)
  - `{before}`: 10 to 25, step 5 (integer)
  - `{after}`: 4 to 9, step 1 (integer)
  - `{csat_before}`: 3 to 3.8, step 0.2 (integer)
  - `{csat_after}`: 4 to 4.8, step 0.2 (integer)

### DATA-0112
**Role:** data-analyst | **Theme:** content-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** content analytics, engagement analytics, content performance, media analytics, editorial analytics, content ROI

**Scope:** content performance analytics for a {content_pieces}K content library across {formats} content formats and {channels} distribution channels, tracking {metrics} engagement metrics for {audience}M audience members
**Result:** identifying top-performing content attributes that informed editorial decisions increasing average engagement rate from {before}% to {after}% and reducing time-to-viral from {viral_before} days to {viral_after} days

**Variations:**
- **A (Standard):** Built content analytics for {content_pieces}K pieces across {formats} formats and {channels} channels tracking {metrics} metrics, identifying attributes that grew engagement from {before}% to {after}% and cut time-to-viral from {viral_before} to {viral_after} days.
- **B (Result-first):** Grew engagement from {before}% to {after}% and cut time-to-viral from {viral_before} to {viral_after} days by building content analytics for {content_pieces}K pieces across {formats} formats and {channels} channels.
- **C (Impact-led):** Grew engagement from {before}% to {after}% and cut time-to-viral from {viral_before} to {viral_after} days; built content analytics for {content_pieces}K pieces across {formats} formats and {channels} channels.
- **D (Concise):** Built content analytics for {content_pieces}K pieces across {formats} formats and {channels} channels, engagement from {before}% to {after}%, time-to-viral from {viral_before} to {viral_after} days.

**Variables:**
  - `{content_pieces}`: 1 to 100, step 5 (integer)
  - `{formats}`: 3 to 10, step 1 (integer)
  - `{channels}`: 3 to 10, step 1 (integer)
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{audience}`: 0.1 to 50, step 0.5 (integer)
  - `{before}`: 2 to 8, step 1 (percentage)
  - `{after}`: 10 to 25, step 2 (percentage)
  - `{viral_before}`: 14 to 60, step 7 (integer)
  - `{viral_after}`: 2 to 7, step 1 (integer)

### DATA-0113
**Role:** ml-engineer | **Theme:** batch-inference | **Seniority:** mid | **Verb Context:** systems
**Keywords:** batch inference, offline scoring, Spark ML, scheduled inference, large-scale prediction, model serving

**Scope:** a batch inference pipeline using Spark ML scoring {records}M records per run across {models} deployed models on a {schedule} schedule, writing predictions to {outputs} downstream data stores
**Result:** reducing end-to-end batch inference time from {before} hours to {after} minutes and increasing prediction freshness from weekly to {frequency} for {consumers} downstream consumers

**Variations:**
- **A (Standard):** Built Spark batch inference scoring {records}M records across {models} models on a {schedule} schedule, cutting run time from {before} hours to {after} minutes and increasing freshness from weekly to {frequency} for {consumers} consumers.
- **B (Result-first):** Reduced inference time from {before} hours to {after} minutes and improved freshness from weekly to {frequency} by building Spark batch inference for {records}M records across {models} models.
- **C (Impact-led):** Cut inference from {before} hours to {after} minutes and improved freshness from weekly to {frequency}; built Spark batch scoring for {records}M records across {models} models at {schedule} schedule.
- **D (Concise):** Built Spark batch inference for {records}M records across {models} models at {schedule}, run time from {before}h to {after}min, freshness from weekly to {frequency}.

**Variables:**
  - `{records}`: 1 to 500, step 10 (integer)
  - `{models}`: 3 to 20, step 3 (integer)
  - `{outputs}`: 2 to 8, step 1 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 10 to 45, step 5 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)

### DATA-0114
**Role:** data-analyst | **Theme:** market-basket-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** market basket analysis, association rules, Apriori, frequent itemsets, cross-sell, upsell analytics

**Scope:** a market basket analysis using Apriori and FP-Growth on {transactions}M transactions across {skus}K SKUs, identifying {rules} association rules with confidence and lift thresholds for {categories} product categories
**Result:** informing {recommendations} cross-sell recommendations that generated ${revenue}K in incremental monthly revenue

**Variations:**
- **A (Standard):** Built market basket analysis using Apriori on {transactions}M transactions across {skus}K SKUs, identifying {rules} rules for {categories} categories that drove {recommendations} cross-sell recommendations generating ${revenue}K monthly.
- **B (Result-first):** Generated ${revenue}K in incremental monthly revenue by building basket analysis on {transactions}M transactions, identifying {rules} association rules across {skus}K SKUs.
- **C (Impact-led):** Generated ${revenue}K monthly from {recommendations} cross-sell recommendations; built Apriori basket analysis on {transactions}M transactions across {skus}K SKUs identifying {rules} rules.
- **D (Concise):** Built Apriori basket analysis on {transactions}M transactions across {skus}K SKUs, {rules} association rules, {recommendations} cross-sell recommendations, ${revenue}K monthly revenue.

**Variables:**
  - `{transactions}`: 1 to 500, step 10 (integer)
  - `{skus}`: 1 to 100, step 5 (integer)
  - `{rules}`: 50 to 1000, step 50 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{recommendations}`: 5 to 30, step 5 (integer)
  - `{revenue}`: 50 to 2000, step 50 (currency)

### DATA-0115
**Role:** data-scientist | **Theme:** simulation-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Monte Carlo simulation, agent-based modeling, scenario analysis, stochastic modeling, risk simulation, discrete event simulation

**Scope:** a Monte Carlo simulation framework for {use_case} business planning, running {simulations}K simulations per scenario across {variables} stochastic variables and {scenarios} decision scenarios for executive planning
**Result:** quantifying decision uncertainty that reduced planning errors by {error}% and enabling the business to avoid ${risk}K in expected losses from high-risk scenarios

**Variations:**
- **A (Standard):** Built Monte Carlo framework for {use_case} running {simulations}K simulations across {variables} variables and {scenarios} scenarios, reducing planning errors {error}% and avoiding ${risk}K in expected losses.
- **B (Result-first):** Reduced planning errors {error}% and avoided ${risk}K in expected losses by building Monte Carlo framework running {simulations}K simulations across {variables} variables and {scenarios} scenarios.
- **C (Impact-led):** Cut planning errors {error}% and avoided ${risk}K in expected losses; built Monte Carlo framework for {use_case} running {simulations}K simulations across {variables} variables and {scenarios} scenarios.
- **D (Concise):** Built Monte Carlo framework for {use_case} at {simulations}K simulations across {variables} variables and {scenarios} scenarios, planning errors down {error}%, ${risk}K expected losses avoided.

**Variables:**
  - `{simulations}`: 1 to 100, step 5 (integer)
  - `{variables}`: 10 to 100, step 10 (integer)
  - `{scenarios}`: 5 to 30, step 5 (integer)
  - `{error}`: 20 to 60, step 5 (percentage)
  - `{risk}`: 100 to 5000, step 100 (currency)

### DATA-0116
**Role:** data-engineer | **Theme:** data-freshness-sla | **Seniority:** mid | **Verb Context:** operations
**Keywords:** data freshness, SLA monitoring, pipeline SLAs, data timeliness, data observability, freshness alerts

**Scope:** a data freshness SLA monitoring system tracking {pipelines} pipelines and {datasets} datasets against {slas} defined freshness SLAs, with automated alerting and escalation workflows for {teams} consuming teams
**Result:** reducing SLA breach rate from {before}% to {after}% and cutting mean time to remediate stale data from {mttd_before} hours to {mttd_after} minutes

**Variations:**
- **A (Standard):** Built freshness SLA monitoring for {pipelines} pipelines and {datasets} datasets across {slas} SLAs, reducing breach rate from {before}% to {after}% and cutting remediation time from {mttd_before} hours to {mttd_after} minutes.
- **B (Result-first):** Reduced SLA breach rate from {before}% to {after}% and cut remediation from {mttd_before} hours to {mttd_after} minutes by building freshness monitoring across {pipelines} pipelines and {datasets} datasets.
- **C (Impact-led):** Cut SLA breaches from {before}% to {after}% and remediation from {mttd_before} hours to {mttd_after} minutes; built freshness SLA system for {pipelines} pipelines and {datasets} datasets with automated alerting.
- **D (Concise):** Built freshness SLA monitoring for {pipelines} pipelines and {datasets} datasets, breaches from {before}% to {after}%, remediation from {mttd_before}h to {mttd_after}min.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{slas}`: 20 to 200, step 20 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)
  - `{mttd_before}`: 4 to 24, step 4 (integer)
  - `{mttd_after}`: 5 to 30, step 5 (integer)

### DATA-0117
**Role:** data-engineer | **Theme:** event-schema-design | **Seniority:** mid | **Verb Context:** systems
**Keywords:** event schema, event taxonomy, tracking plan, analytics events, JSON Schema, event design

**Scope:** a company-wide event taxonomy and schema design covering {events} event types across {surfaces} product surfaces and {teams} engineering teams, with JSON Schema validation and a tracking plan governance process
**Result:** reducing schema inconsistency incidents from {before} per month to {after} per quarter and increasing analytics event coverage from {cov_before}% to {cov_after}%

**Variations:**
- **A (Standard):** Designed event taxonomy for {events} events across {surfaces} surfaces and {teams} teams with JSON Schema validation, cutting schema incidents from {before}/month to {after}/quarter and growing coverage from {cov_before}% to {cov_after}%.
- **B (Result-first):** Reduced schema incidents from {before}/month to {after}/quarter and grew coverage from {cov_before}% to {cov_after}% by designing event taxonomy for {events} events across {surfaces} surfaces.
- **C (Impact-led):** Cut schema incidents from {before}/month to {after}/quarter and grew coverage from {cov_before}% to {cov_after}%; designed taxonomy for {events} events across {surfaces} surfaces and {teams} teams.
- **D (Concise):** Designed event taxonomy for {events} events across {surfaces} surfaces and {teams} teams, incidents from {before}/month to {after}/quarter, coverage from {cov_before}% to {cov_after}%.

**Variables:**
  - `{events}`: 50 to 500, step 50 (integer)
  - `{surfaces}`: 3 to 15, step 3 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)
  - `{cov_before}`: 40 to 65, step 5 (percentage)
  - `{cov_after}`: 85 to 99, step 5 (percentage)

### DATA-0118
**Role:** data-engineer | **Theme:** cross-cloud-replication | **Seniority:** senior | **Verb Context:** systems
**Keywords:** cross-cloud replication, multi-cloud data, data synchronization, BigQuery, Snowflake, data portability

**Scope:** a cross-cloud data replication pipeline synchronizing {tables} tables and {volume}TB of data between {clouds} cloud providers with sub-{latency} minute lag, supporting {consumers} downstream consumers across platforms
**Result:** achieving {consistency}% data consistency across clouds and reducing cross-cloud query latency from {before} seconds to {after} seconds for {consumers} consumers

**Variations:**
- **A (Standard):** Built cross-cloud replication for {tables} tables and {volume}TB across {clouds} providers at sub-{latency}min lag, achieving {consistency}% consistency and cutting query latency from {before}s to {after}s for {consumers} consumers.
- **B (Result-first):** Achieved {consistency}% cross-cloud consistency and cut query latency from {before}s to {after}s by building replication for {tables} tables and {volume}TB across {clouds} providers.
- **C (Impact-led):** Reached {consistency}% consistency and cut query latency from {before}s to {after}s; built cross-cloud replication for {tables} tables and {volume}TB across {clouds} providers at sub-{latency}min lag.
- **D (Concise):** Built cross-cloud replication for {tables} tables and {volume}TB across {clouds} providers at sub-{latency}min lag, {consistency}% consistency, query latency from {before}s to {after}s.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{volume}`: 10 to 1000, step 50 (integer)
  - `{clouds}`: 2 to 3, step 1 (integer)
  - `{latency}`: 1 to 10, step 1 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{consistency}`: 99 to 100, step 0.1 (percentage)
  - `{before}`: 10 to 60, step 10 (integer)
  - `{after}`: 1 to 5, step 1 (integer)

### DATA-0119
**Role:** data-scientist | **Theme:** price-elasticity | **Seniority:** senior | **Verb Context:** systems
**Keywords:** price elasticity, demand modeling, econometrics, pricing analytics, own-price elasticity, cross-price elasticity

**Scope:** a price elasticity model estimating demand response across {skus}K SKUs and {segments} customer segments using panel regression on {observations}M purchase observations over {periods} time periods
**Result:** enabling pricing decisions that increased revenue by ${revenue}K annually while maintaining {volume}% of unit volume

**Variations:**
- **A (Standard):** Built price elasticity model across {skus}K SKUs and {segments} segments on {observations}M observations, enabling pricing decisions that grew revenue ${revenue}K annually while maintaining {volume}% unit volume.
- **B (Result-first):** Increased revenue ${revenue}K annually while maintaining {volume}% unit volume by building elasticity model across {skus}K SKUs and {segments} segments on {observations}M observations.
- **C (Impact-led):** Grew revenue ${revenue}K annually while maintaining {volume}% unit volume; built price elasticity model across {skus}K SKUs and {segments} segments on {observations}M observations.
- **D (Concise):** Built price elasticity model across {skus}K SKUs and {segments} segments on {observations}M observations, ${revenue}K revenue increase, {volume}% unit volume maintained.

**Variables:**
  - `{skus}`: 1 to 100, step 5 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{observations}`: 1 to 500, step 10 (integer)
  - `{periods}`: 12 to 60, step 6 (integer)
  - `{revenue}`: 100 to 5000, step 100 (currency)
  - `{volume}`: 85 to 99, step 5 (percentage)

### DATA-0120
**Role:** data-analyst | **Theme:** subscription-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** subscription analytics, MRR cohorts, upgrade analytics, plan migration, subscription metrics, billing analytics

**Scope:** a subscription analytics platform tracking {metrics} metrics including MRR movement, plan upgrades, downgrades, pauses, and cancellations across {cohorts} monthly cohorts for {subscribers}K subscribers
**Result:** identifying upgrade opportunity segments that grew MRR by ${mrr}K per month and reducing involuntary churn from {before}% to {after}% through dunning optimization

**Variations:**
- **A (Standard):** Built subscription analytics tracking {metrics} metrics across {cohorts} cohorts for {subscribers}K subscribers, identifying upgrades that grew MRR ${mrr}K/month and reducing involuntary churn from {before}% to {after}%.
- **B (Result-first):** Grew MRR ${mrr}K/month and reduced involuntary churn from {before}% to {after}% by building subscription analytics across {metrics} metrics, {cohorts} cohorts, and {subscribers}K subscribers.
- **C (Impact-led):** Grew MRR ${mrr}K/month and cut involuntary churn from {before}% to {after}%; built subscription analytics for {subscribers}K subscribers tracking {metrics} metrics across {cohorts} cohorts.
- **D (Concise):** Built subscription analytics for {subscribers}K subscribers across {metrics} metrics and {cohorts} cohorts, MRR up ${mrr}K/month, involuntary churn from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{subscribers}`: 10 to 500, step 10 (integer)
  - `{mrr}`: 20 to 500, step 20 (currency)
  - `{before}`: 3 to 10, step 1 (percentage)
  - `{after}`: 0.5 to 2, step 0.5 (percentage)

### DATA-0121
**Role:** ml-engineer | **Theme:** ab-testing-infrastructure | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML experimentation, shadow mode, champion-challenger, canary model, staged rollout, production ML testing

**Scope:** an ML experimentation infrastructure supporting champion-challenger testing for {models} model pairs across {surfaces} product surfaces, with shadow mode evaluation and automated traffic shifting based on {metrics} performance metrics
**Result:** reducing time-to-production for new model versions from {before} weeks to {after} days and safely running {experiments} concurrent model experiments

**Variations:**
- **A (Standard):** Built ML champion-challenger infrastructure for {models} model pairs across {surfaces} surfaces with shadow mode and auto traffic shifting, cutting time-to-production from {before} weeks to {after} days and supporting {experiments} concurrent experiments.
- **B (Result-first):** Reduced time-to-production from {before} weeks to {after} days and enabled {experiments} concurrent experiments by building ML champion-challenger infrastructure across {models} pairs and {surfaces} surfaces.
- **C (Impact-led):** Cut time-to-production from {before} weeks to {after} days and enabled {experiments} concurrent experiments; built champion-challenger infrastructure for {models} pairs across {surfaces} surfaces with shadow mode.
- **D (Concise):** Built ML champion-challenger for {models} pairs across {surfaces} surfaces with shadow mode, time-to-production from {before}wk to {after}d, {experiments} concurrent experiments.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{surfaces}`: 3 to 10, step 1 (integer)
  - `{metrics}`: 3 to 8, step 1 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{experiments}`: 5 to 20, step 5 (integer)

### DATA-0122
**Role:** data-analyst | **Theme:** ad-hoc-analytics | **Seniority:** junior | **Verb Context:** operations
**Keywords:** ad hoc analysis, exploratory analysis, stakeholder requests, one-time analysis, business questions, data investigation

**Scope:** ad hoc analytics requests from {stakeholders} business stakeholders per month across {topics} business topics, scoping questions, querying {sources} data sources, and delivering findings in {formats} presentation formats
**Result:** achieving a {turnaround} business-day average turnaround and a {satisfaction}% stakeholder satisfaction score across {requests} quarterly requests

**Variations:**
- **A (Standard):** Handled {stakeholders} stakeholders' monthly ad hoc requests across {topics} topics from {sources} sources, delivering in {formats} formats, achieving {turnaround}-day turnaround and {satisfaction}% satisfaction across {requests} quarterly requests.
- **B (Result-first):** Achieved {turnaround}-day turnaround and {satisfaction}% satisfaction across {requests} quarterly requests by handling {stakeholders} stakeholders' ad hoc requests from {sources} sources.
- **C (Impact-led):** Achieved {turnaround}-day turnaround and {satisfaction}% satisfaction; handled ad hoc requests from {stakeholders} stakeholders across {topics} topics querying {sources} sources in {formats} formats.
- **D (Concise):** Handled ad hoc requests from {stakeholders} stakeholders across {topics} topics and {sources} sources, {turnaround}-day turnaround, {satisfaction}% satisfaction across {requests} quarterly requests.

**Variables:**
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{topics}`: 5 to 20, step 5 (integer)
  - `{sources}`: 3 to 10, step 1 (integer)
  - `{formats}`: 2 to 5, step 1 (integer)
  - `{turnaround}`: 1 to 3, step 1 (integer)
  - `{satisfaction}`: 85 to 99, step 5 (percentage)
  - `{requests}`: 20 to 100, step 10 (integer)

### DATA-0123
**Role:** data-engineer | **Theme:** multi-hop-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** multi-hop pipeline, Bronze Silver Gold, medallion architecture, raw to refined, data transformation layers

**Scope:** a medallion architecture with Bronze, Silver, and Gold layers across {tables} tables and {pipelines} transformation pipelines, standardizing raw ingestion, cleansing, and business-logic transformations for {consumers} downstream consumers
**Result:** reducing data preparation time for analysts from {before} hours to {after} minutes per new analysis and improving cross-team data reuse by {reuse}%

**Variations:**
- **A (Standard):** Implemented medallion architecture across {tables} tables and {pipelines} pipelines with Bronze, Silver, and Gold layers, cutting analyst prep from {before} hours to {after} minutes and improving reuse {reuse}%.
- **B (Result-first):** Reduced analyst prep from {before} hours to {after} minutes and improved reuse {reuse}% by implementing medallion architecture across {tables} tables and {pipelines} pipelines.
- **C (Impact-led):** Cut analyst prep from {before} hours to {after} minutes and improved reuse {reuse}%; implemented medallion architecture with Bronze, Silver, and Gold layers across {tables} tables and {pipelines} pipelines.
- **D (Concise):** Implemented medallion architecture across {tables} tables and {pipelines} pipelines, analyst prep from {before}h to {after}min, reuse up {reuse}%.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 10 to 45, step 5 (integer)
  - `{reuse}`: 30 to 70, step 5 (percentage)

### DATA-0124
**Role:** data-scientist | **Theme:** text-summarization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** text summarization, extractive summarization, abstractive summarization, BERT, T5, document summarization

**Scope:** a text summarization pipeline using T5 fine-tuned on {documents}K domain-specific documents across {categories} content categories, generating {length}-sentence summaries for {users}K end users
**Result:** reducing average document review time from {before} minutes to {after} minutes and achieving a {rouge} ROUGE-L score on held-out test documents

**Variations:**
- **A (Standard):** Fine-tuned T5 summarization on {documents}K documents across {categories} categories generating {length}-sentence summaries for {users}K users, cutting review from {before} to {after} minutes and achieving ROUGE-L {rouge}.
- **B (Result-first):** Reduced document review from {before} to {after} minutes and achieved ROUGE-L {rouge} by fine-tuning T5 on {documents}K documents across {categories} categories.
- **C (Impact-led):** Cut review from {before} to {after} minutes and achieved ROUGE-L {rouge}; fine-tuned T5 on {documents}K domain documents across {categories} categories for {users}K users.
- **D (Concise):** Fine-tuned T5 on {documents}K documents across {categories} categories, {length}-sentence summaries for {users}K users, review from {before} to {after}min, ROUGE-L {rouge}.

**Variables:**
  - `{documents}`: 10 to 500, step 10 (integer)
  - `{categories}`: 3 to 15, step 3 (integer)
  - `{length}`: 3 to 10, step 1 (integer)
  - `{users}`: 1 to 50, step 1 (integer)
  - `{before}`: 15 to 60, step 5 (integer)
  - `{after}`: 2 to 8, step 2 (integer)
  - `{rouge}`: 0.4 to 0.7, step 0.05 (integer)

### DATA-0125
**Role:** bi-analyst | **Theme:** hr-dashboard | **Seniority:** junior | **Verb Context:** content
**Keywords:** HR dashboard, headcount reporting, attrition dashboard, workforce analytics, Tableau HR, people data

**Scope:** HR dashboards in Tableau for {stakeholders} HR business partners and executives tracking {metrics} workforce metrics including headcount, attrition, time-to-hire, and DEI ratios across {departments} departments
**Result:** replacing {manual_reports} manual spreadsheet reports and saving {hours} analyst hours per month while improving data refresh frequency from monthly to {frequency}

**Variations:**
- **A (Standard):** Built Tableau HR dashboards for {stakeholders} stakeholders tracking {metrics} metrics across {departments} departments, replacing {manual_reports} manual reports, saving {hours} analyst hours/month and improving refresh from monthly to {frequency}.
- **B (Result-first):** Replaced {manual_reports} manual reports and saved {hours} analyst hours/month by building Tableau HR dashboards tracking {metrics} metrics across {departments} departments for {stakeholders} stakeholders.
- **C (Impact-led):** Replaced {manual_reports} manual reports and saved {hours} hours/month; built Tableau HR dashboards for {stakeholders} stakeholders tracking {metrics} metrics across {departments} departments.
- **D (Concise):** Built Tableau HR dashboards for {stakeholders} stakeholders across {metrics} metrics and {departments} departments, {manual_reports} reports replaced, {hours} hours/month saved, refresh from monthly to {frequency}.

**Variables:**
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{manual_reports}`: 5 to 30, step 5 (integer)
  - `{hours}`: 10 to 80, step 10 (integer)

### DATA-0126
**Role:** data-scientist | **Theme:** topic-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** topic modeling, LDA, BERTopic, NMF, unsupervised text, document clustering, theme extraction

**Scope:** a topic modeling pipeline using BERTopic across {documents}M documents and {categories} text categories, identifying {topics} coherent topics with automated labeling and tracking topic drift over {periods} time periods
**Result:** replacing {manual_hours} monthly manual content categorization hours and enabling {stakeholders} business teams to monitor topic trends without analyst support

**Variations:**
- **A (Standard):** Built BERTopic pipeline across {documents}M documents and {categories} categories, identifying {topics} topics and tracking drift over {periods} periods, replacing {manual_hours} manual hours/month and enabling {stakeholders} teams to self-serve.
- **B (Result-first):** Replaced {manual_hours} manual hours/month and enabled {stakeholders} teams to self-serve by building BERTopic pipeline identifying {topics} topics across {documents}M documents.
- **C (Impact-led):** Replaced {manual_hours} monthly hours and enabled {stakeholders} teams to self-serve; built BERTopic pipeline across {documents}M documents identifying {topics} topics across {categories} categories.
- **D (Concise):** Built BERTopic across {documents}M documents and {categories} categories, {topics} topics identified, {manual_hours} manual hours replaced, {stakeholders} teams self-serving.

**Variables:**
  - `{documents}`: 0.1 to 50, step 0.5 (integer)
  - `{categories}`: 3 to 15, step 3 (integer)
  - `{topics}`: 10 to 100, step 10 (integer)
  - `{periods}`: 6 to 36, step 6 (integer)
  - `{manual_hours}`: 20 to 200, step 20 (integer)
  - `{stakeholders}`: 3 to 15, step 3 (integer)

### DATA-0127
**Role:** ml-engineer | **Theme:** model-governance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** model governance, model risk management, SR 11-7, model inventory, model validation, AI governance

**Scope:** a model governance framework for {models} production models covering model inventory, risk tiering, validation requirements, and annual review cycles aligned to {framework} regulatory standards
**Result:** achieving {compliance}% governance compliance across tiered models and reducing model-related audit findings from {before} to {after} per annual review cycle

**Variations:**
- **A (Standard):** Established model governance for {models} production models with risk tiering and annual reviews aligned to {framework}, achieving {compliance}% compliance and cutting audit findings from {before} to {after} per cycle.
- **B (Result-first):** Achieved {compliance}% governance compliance and cut audit findings from {before} to {after} per cycle by establishing governance for {models} models aligned to {framework}.
- **C (Impact-led):** Reached {compliance}% compliance and cut findings from {before} to {after} per audit cycle; established governance framework for {models} models with risk tiering aligned to {framework}.
- **D (Concise):** Established model governance for {models} models aligned to {framework}, {compliance}% compliance, audit findings from {before} to {after} per cycle.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{compliance}`: 90 to 100, step 5 (percentage)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)

### DATA-0128
**Role:** data-engineer | **Theme:** schema-evolution | **Seniority:** mid | **Verb Context:** systems
**Keywords:** schema evolution, backward compatibility, forward compatibility, schema migration, Avro evolution, column additions

**Scope:** a schema evolution strategy for {tables} production tables handling {changes} schema changes per quarter, enforcing compatibility policies and automating migration scripts across {pipelines} dependent pipelines
**Result:** achieving zero breaking schema changes for {consumers} downstream consumers and reducing schema migration effort from {before} days to {after} hours per change

**Variations:**
- **A (Standard):** Implemented schema evolution strategy for {tables} tables handling {changes} quarterly changes across {pipelines} pipelines, achieving zero breaking changes for {consumers} consumers and cutting migration from {before} days to {after} hours.
- **B (Result-first):** Achieved zero breaking changes for {consumers} consumers and cut migration from {before} days to {after} hours by managing schema evolution for {tables} tables across {pipelines} pipelines.
- **C (Impact-led):** Achieved zero breaking changes for {consumers} consumers and cut migration from {before} days to {after} hours; implemented evolution strategy for {tables} tables with {changes} quarterly changes across {pipelines} pipelines.
- **D (Concise):** Managed schema evolution for {tables} tables across {pipelines} pipelines at {changes} changes/quarter, zero breaking changes for {consumers} consumers, migration from {before}d to {after}h.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{changes}`: 20 to 200, step 20 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{before}`: 2 to 10, step 2 (integer)
  - `{after}`: 1 to 4, step 1 (integer)

### DATA-0129
**Role:** data-analyst | **Theme:** clinical-data-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** clinical analytics, outcomes analysis, patient data, clinical KPIs, healthcare analytics, quality metrics

**Scope:** a clinical outcomes analytics platform for a {bed}-bed health system tracking {metrics} quality metrics across {providers} providers and {conditions} clinical conditions using EHR and claims data
**Result:** identifying {opportunities} care improvement opportunities that reduced average length of stay by {los}% and contributed to a {readmit}% reduction in 30-day readmissions

**Variations:**
- **A (Standard):** Built clinical analytics for a {bed}-bed system tracking {metrics} metrics across {providers} providers and {conditions} conditions, identifying {opportunities} improvements reducing LOS {los}% and readmissions {readmit}%.
- **B (Result-first):** Reduced LOS {los}% and readmissions {readmit}% by building clinical analytics tracking {metrics} metrics across {providers} providers and identifying {opportunities} improvements.
- **C (Impact-led):** Reduced LOS {los}% and readmissions {readmit}%; built clinical analytics for a {bed}-bed system tracking {metrics} metrics across {providers} providers and {conditions} conditions.
- **D (Concise):** Built clinical analytics for {bed}-bed system across {metrics} metrics, {providers} providers, and {conditions} conditions, LOS down {los}%, readmissions down {readmit}%.

**Variables:**
  - `{bed}`: 100 to 1000, step 100 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{providers}`: 50 to 500, step 50 (integer)
  - `{conditions}`: 5 to 30, step 5 (integer)
  - `{opportunities}`: 5 to 20, step 5 (integer)
  - `{los}`: 10 to 30, step 5 (percentage)
  - `{readmit}`: 10 to 30, step 5 (percentage)

### DATA-0130
**Role:** data-scientist | **Theme:** pricing-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** pricing optimization, dynamic pricing, revenue management, yield management, price recommendation, optimization model

**Scope:** a dynamic pricing optimization model for {skus}K products across {channels} sales channels, using constrained optimization with {constraints} business constraints to recommend prices {frequency} per day
**Result:** increasing revenue per unit by {rev_lift}% and improving gross margin from {before}% to {after}% without reducing total unit volume

**Variations:**
- **A (Standard):** Built dynamic pricing model for {skus}K products across {channels} channels with {constraints} constraints recommending prices {frequency}x daily, growing revenue/unit {rev_lift}% and margin from {before}% to {after}%.
- **B (Result-first):** Grew revenue per unit {rev_lift}% and improved margin from {before}% to {after}% by building dynamic pricing for {skus}K products across {channels} channels with {constraints} constraints.
- **C (Impact-led):** Grew revenue/unit {rev_lift}% and improved margin from {before}% to {after}%; built dynamic pricing for {skus}K products across {channels} channels with {constraints} constraints at {frequency}x daily updates.
- **D (Concise):** Built dynamic pricing for {skus}K products across {channels} channels at {frequency}x/day, revenue/unit up {rev_lift}%, margin from {before}% to {after}%.

**Variables:**
  - `{skus}`: 1 to 100, step 5 (integer)
  - `{channels}`: 3 to 10, step 1 (integer)
  - `{constraints}`: 5 to 20, step 5 (integer)
  - `{frequency}`: 1 to 24, step 1 (integer)
  - `{rev_lift}`: 5 to 25, step 5 (percentage)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 40 to 65, step 5 (percentage)

### DATA-0131
**Role:** bi-analyst | **Theme:** inventory-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** inventory analytics, stock turnover, days inventory outstanding, safety stock, reorder point analytics, inventory optimization

**Scope:** an inventory analytics platform tracking {metrics} inventory metrics across {skus}K SKUs and {warehouses} warehouse locations, including stockout rates, days inventory outstanding, and turnover ratios
**Result:** reducing average stockout rate from {before}% to {after}% and cutting excess inventory carrying cost by ${savings}K annually

**Variations:**
- **A (Standard):** Built inventory analytics for {skus}K SKUs across {warehouses} warehouses tracking {metrics} metrics, reducing stockouts from {before}% to {after}% and cutting carrying cost by ${savings}K annually.
- **B (Result-first):** Reduced stockouts from {before}% to {after}% and cut carrying cost ${savings}K annually by building inventory analytics for {skus}K SKUs across {warehouses} warehouses.
- **C (Impact-led):** Cut stockouts from {before}% to {after}% and reduced carrying cost ${savings}K annually; built inventory analytics tracking {metrics} metrics across {skus}K SKUs and {warehouses} warehouses.
- **D (Concise):** Built inventory analytics for {skus}K SKUs across {warehouses} warehouses with {metrics} metrics, stockouts from {before}% to {after}%, carrying cost down ${savings}K annually.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{skus}`: 1 to 200, step 10 (integer)
  - `{warehouses}`: 3 to 30, step 3 (integer)
  - `{before}`: 5 to 20, step 5 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)
  - `{savings}`: 100 to 3000, step 100 (currency)

### DATA-0132
**Role:** data-engineer | **Theme:** data-pipeline-monitoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline monitoring, data observability, Monte Carlo Data, Bigeye, anomaly alerting, data downtime

**Scope:** a data observability platform using Monte Carlo across {pipelines} pipelines and {tables} tables, monitoring {checks} automated checks for volume, freshness, schema, and distribution anomalies
**Result:** reducing data downtime from {before} hours per month to {after} hours per month and cutting analyst time spent investigating data issues by {reduction}%

**Variations:**
- **A (Standard):** Deployed Monte Carlo observability across {pipelines} pipelines and {tables} tables with {checks} automated checks, reducing data downtime from {before} to {after} hours/month and cutting investigation time {reduction}%.
- **B (Result-first):** Reduced data downtime from {before} to {after} hours/month and cut investigation time {reduction}% by deploying Monte Carlo across {pipelines} pipelines and {tables} tables.
- **C (Impact-led):** Cut data downtime from {before} to {after} hours/month and investigation time {reduction}%; deployed Monte Carlo observability across {pipelines} pipelines and {tables} tables with {checks} checks.
- **D (Concise):** Deployed Monte Carlo for {pipelines} pipelines and {tables} tables with {checks} checks, downtime from {before} to {after}h/month, investigation time down {reduction}%.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{tables}`: 100 to 5000, step 100 (integer)
  - `{checks}`: 200 to 5000, step 200 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0133
**Role:** ml-engineer | **Theme:** rag-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** RAG, retrieval-augmented generation, LLM, document retrieval, chunking strategy, embedding pipeline

**Scope:** a production RAG pipeline ingesting {documents}K documents across {sources} knowledge sources, with a chunking, embedding, and retrieval layer serving {users}K users via a {latency}ms P95 SLA
**Result:** achieving {accuracy}% answer accuracy on internal evaluation sets and reducing support escalation rate by {escalation}% through self-service AI responses

**Variations:**
- **A (Standard):** Built RAG pipeline ingesting {documents}K documents from {sources} sources for {users}K users at {latency}ms P95, achieving {accuracy}% answer accuracy and cutting support escalations {escalation}%.
- **B (Result-first):** Achieved {accuracy}% answer accuracy and cut escalations {escalation}% by building RAG pipeline for {documents}K documents from {sources} sources at {latency}ms P95.
- **C (Impact-led):** Reached {accuracy}% answer accuracy and cut escalations {escalation}%; built RAG pipeline ingesting {documents}K documents from {sources} sources for {users}K users at {latency}ms P95.
- **D (Concise):** Built RAG pipeline for {documents}K docs from {sources} sources at {latency}ms P95, {accuracy}% accuracy, escalations down {escalation}%.

**Variables:**
  - `{documents}`: 10 to 1000, step 10 (integer)
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{users}`: 1 to 50, step 1 (integer)
  - `{latency}`: 500 to 3000, step 500 (integer)
  - `{accuracy}`: 75 to 95, step 5 (percentage)
  - `{escalation}`: 20 to 60, step 5 (percentage)

### DATA-0134
**Role:** data-analyst | **Theme:** attribution-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** multi-touch attribution, Shapley values, data-driven attribution, marketing mix, channel attribution, conversion paths

**Scope:** a data-driven multi-touch attribution model using Shapley values across {channels} marketing channels and {touchpoints}M conversion paths, replacing last-click attribution for {campaigns}K annual campaigns
**Result:** reallocating ${budget}K in marketing spend to higher-performing channels and improving blended ROAS from {before}x to {after}x

**Variations:**
- **A (Standard):** Built Shapley attribution across {channels} channels and {touchpoints}M paths for {campaigns}K campaigns, reallocating ${budget}K in spend to better channels and improving ROAS from {before}x to {after}x.
- **B (Result-first):** Reallocated ${budget}K in marketing spend and improved ROAS from {before}x to {after}x by building Shapley attribution across {channels} channels and {touchpoints}M conversion paths.
- **C (Impact-led):** Reallocated ${budget}K in spend and grew ROAS from {before}x to {after}x; built Shapley multi-touch attribution across {channels} channels and {touchpoints}M paths for {campaigns}K campaigns.
- **D (Concise):** Built Shapley attribution across {channels} channels and {touchpoints}M paths, ${budget}K reallocated, ROAS from {before}x to {after}x.

**Variables:**
  - `{channels}`: 5 to 20, step 5 (integer)
  - `{touchpoints}`: 1 to 100, step 5 (integer)
  - `{campaigns}`: 1 to 50, step 5 (integer)
  - `{budget}`: 100 to 5000, step 100 (currency)
  - `{before}`: 2 to 5, step 0.5 (integer)
  - `{after}`: 5 to 12, step 0.5 (integer)

### DATA-0135
**Role:** data-engineer | **Theme:** data-product-development | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data product, data as a product, domain ownership, data SLAs, data product metrics, product thinking for data

**Scope:** a data product strategy for {domains} business domains, defining {products} data products with SLAs, ownership, and quality guarantees, and implementing a data product marketplace for {consumers}K consumers
**Result:** increasing cross-domain data reuse by {reuse}% and reducing data provisioning lead time for new analytics projects from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Defined {products} data products across {domains} domains with SLAs and a marketplace for {consumers}K consumers, increasing reuse {reuse}% and cutting provisioning from {before} weeks to {after} days.
- **B (Result-first):** Increased reuse {reuse}% and cut provisioning from {before} weeks to {after} days by defining {products} data products across {domains} domains with a marketplace for {consumers}K consumers.
- **C (Impact-led):** Grew reuse {reuse}% and cut provisioning from {before} weeks to {after} days; defined {products} data products across {domains} domains with SLAs and a marketplace for {consumers}K consumers.
- **D (Concise):** Defined {products} data products across {domains} domains with marketplace for {consumers}K consumers, reuse up {reuse}%, provisioning from {before}wk to {after}d.

**Variables:**
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{products}`: 20 to 200, step 20 (integer)
  - `{consumers}`: 50 to 500, step 50 (integer)
  - `{reuse}`: 30 to 80, step 5 (percentage)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0136
**Role:** data-scientist | **Theme:** risk-scoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** risk scoring, scorecard, operational risk, risk stratification, composite scoring, weighted index

**Scope:** a composite risk scoring model combining {risk_types} risk dimensions including behavioral, demographic, and transactional signals for {entities}K scored entities, integrated into {workflows} operational decision workflows
**Result:** improving risk detection precision from {before}% to {after}% at a fixed recall rate and reducing manual review workload by {manual}%

**Variations:**
- **A (Standard):** Built composite risk scoring across {risk_types} dimensions for {entities}K entities integrated into {workflows} workflows, improving precision from {before}% to {after}% at fixed recall and cutting manual review {manual}%.
- **B (Result-first):** Improved precision from {before}% to {after}% and cut manual review {manual}% by building composite scoring across {risk_types} dimensions for {entities}K entities.
- **C (Impact-led):** Improved precision from {before}% to {after}% and cut manual review {manual}%; built composite risk scoring across {risk_types} dimensions for {entities}K entities in {workflows} workflows.
- **D (Concise):** Built composite risk scoring across {risk_types} dimensions for {entities}K entities in {workflows} workflows, precision from {before}% to {after}%, manual review down {manual}%.

**Variables:**
  - `{risk_types}`: 3 to 10, step 1 (integer)
  - `{entities}`: 10 to 1000, step 10 (integer)
  - `{workflows}`: 3 to 10, step 1 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)
  - `{manual}`: 30 to 70, step 5 (percentage)

### DATA-0137
**Role:** data-analyst | **Theme:** retention-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** retention analysis, cohort retention, N-day retention, user lifecycle, retention curves, engagement retention

**Scope:** retention analysis across {cohorts} monthly acquisition cohorts for a {users}M-user product, calculating N-day, weekly, and monthly retention curves segmented by {dimensions} acquisition and behavioral dimensions
**Result:** identifying {segments} high-retention segments that informed product changes improving Day-30 retention from {before}% to {after}%

**Variations:**
- **A (Standard):** Analyzed retention across {cohorts} cohorts for {users}M users segmented by {dimensions} dimensions, identifying {segments} high-retention segments that improved Day-30 retention from {before}% to {after}%.
- **B (Result-first):** Improved Day-30 retention from {before}% to {after}% by analyzing {cohorts} cohorts for {users}M users across {dimensions} dimensions and identifying {segments} high-retention segments.
- **C (Impact-led):** Grew Day-30 retention from {before}% to {after}%; analyzed retention across {cohorts} cohorts for {users}M users segmented by {dimensions} dimensions, identifying {segments} high-performing segments.
- **D (Concise):** Analyzed {cohorts} cohorts for {users}M users across {dimensions} dimensions, {segments} high-retention segments identified, Day-30 from {before}% to {after}%.

**Variables:**
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{users}`: 0.1 to 50, step 0.5 (integer)
  - `{dimensions}`: 5 to 20, step 5 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{before}`: 15 to 35, step 5 (percentage)
  - `{after}`: 35 to 60, step 5 (percentage)

### DATA-0138
**Role:** ml-engineer | **Theme:** model-serving-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model serving, TorchServe, Triton, batching, throughput, serving optimization, GPU utilization

**Scope:** production model serving optimization using Triton Inference Server for {models} models, implementing dynamic batching and model ensembles across {gpus} GPU nodes serving {qps}K queries per second
**Result:** improving GPU utilization from {before}% to {after}% and reducing per-query serving cost by {cost}%

**Variations:**
- **A (Standard):** Optimized Triton serving for {models} models across {gpus} GPUs at {qps}K QPS with dynamic batching, improving GPU utilization from {before}% to {after}% and cutting per-query cost {cost}%.
- **B (Result-first):** Improved GPU utilization from {before}% to {after}% and cut per-query cost {cost}% by optimizing Triton serving for {models} models across {gpus} GPUs at {qps}K QPS.
- **C (Impact-led):** Grew GPU utilization from {before}% to {after}% and cut per-query cost {cost}%; optimized Triton for {models} models with dynamic batching across {gpus} GPUs at {qps}K QPS.
- **D (Concise):** Optimized Triton for {models} models across {gpus} GPUs at {qps}K QPS, GPU utilization from {before}% to {after}%, per-query cost down {cost}%.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{gpus}`: 4 to 64, step 4 (integer)
  - `{qps}`: 10 to 500, step 10 (integer)
  - `{before}`: 30 to 55, step 5 (percentage)
  - `{after}`: 70 to 92, step 5 (percentage)
  - `{cost}`: 30 to 70, step 5 (percentage)

### DATA-0139
**Role:** data-analyst | **Theme:** regulatory-reporting | **Seniority:** senior | **Verb Context:** content
**Keywords:** regulatory reporting, compliance reporting, Basel III, SOX, financial regulatory, automated reporting

**Scope:** automated regulatory reporting for {reports} recurring filings across {regulators} regulatory bodies, integrating {sources} data sources and implementing {controls} data quality controls for auditability
**Result:** reducing preparation time per report from {before} days to {after} days and achieving {accuracy}% first-submission acceptance rate across {filings} annual filings

**Variations:**
- **A (Standard):** Automated {reports} regulatory filings across {regulators} bodies from {sources} sources with {controls} quality controls, cutting prep from {before} to {after} days/report and achieving {accuracy}% first-submission acceptance.
- **B (Result-first):** Reduced prep from {before} to {after} days per report and achieved {accuracy}% first-submission acceptance by automating {reports} filings across {regulators} bodies.
- **C (Impact-led):** Cut prep from {before} to {after} days/report and achieved {accuracy}% first-submission acceptance; automated {reports} filings across {regulators} bodies from {sources} sources with {controls} quality controls.
- **D (Concise):** Automated {reports} filings across {regulators} bodies from {sources} sources, prep from {before} to {after} days/report, {accuracy}% first-submission acceptance.

**Variables:**
  - `{reports}`: 5 to 30, step 5 (integer)
  - `{regulators}`: 2 to 8, step 1 (integer)
  - `{sources}`: 5 to 20, step 5 (integer)
  - `{controls}`: 20 to 100, step 10 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{accuracy}`: 90 to 100, step 5 (percentage)
  - `{filings}`: 10 to 100, step 10 (integer)

### DATA-0140
**Role:** data-engineer | **Theme:** dbt-testing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** dbt tests, data testing, dbt, singular tests, generic tests, schema tests, data reliability

**Scope:** a dbt testing framework adding {tests}K tests across {models} dbt models covering uniqueness, not-null, referential integrity, and {custom_tests} custom business logic tests
**Result:** catching {caught}% of data quality issues before they reach downstream consumers and reducing analyst data quality complaints from {before} per week to {after} per month

**Variations:**
- **A (Standard):** Built {tests}K dbt tests across {models} models with {custom_tests} custom tests, catching {caught}% of quality issues pre-consumer and cutting complaints from {before}/week to {after}/month.
- **B (Result-first):** Caught {caught}% of quality issues pre-consumer and cut complaints from {before}/week to {after}/month by building {tests}K dbt tests across {models} models.
- **C (Impact-led):** Caught {caught}% of quality issues and cut complaints from {before}/week to {after}/month; built {tests}K dbt tests across {models} models with {custom_tests} custom business logic tests.
- **D (Concise):** Built {tests}K dbt tests across {models} models with {custom_tests} custom tests, {caught}% caught pre-consumer, complaints from {before}/week to {after}/month.

**Variables:**
  - `{tests}`: 1 to 50, step 1 (integer)
  - `{models}`: 50 to 500, step 50 (integer)
  - `{custom_tests}`: 10 to 100, step 10 (integer)
  - `{caught}`: 80 to 99, step 5 (percentage)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)

### DATA-0141
**Role:** bi-analyst | **Theme:** marketing-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** marketing analytics, campaign performance, email analytics, paid media analytics, funnel analytics, growth analytics

**Scope:** a marketing analytics platform tracking {metrics} metrics across {channels} channels including paid, email, SEO, and social for {campaigns}K annual campaigns with ${spend}K in annual marketing spend
**Result:** improving marketing-attributed pipeline by {pipeline}% and reducing cost per acquisition from ${cpa_before} to ${cpa_after}

**Variations:**
- **A (Standard):** Built marketing analytics for {campaigns}K campaigns across {channels} channels at ${spend}K annual spend tracking {metrics} metrics, growing attributed pipeline {pipeline}% and cutting CPA from ${cpa_before} to ${cpa_after}.
- **B (Result-first):** Grew attributed pipeline {pipeline}% and cut CPA from ${cpa_before} to ${cpa_after} by building marketing analytics for {campaigns}K campaigns across {channels} channels.
- **C (Impact-led):** Grew attributed pipeline {pipeline}% and cut CPA from ${cpa_before} to ${cpa_after}; built marketing analytics for {campaigns}K campaigns across {channels} channels at ${spend}K spend.
- **D (Concise):** Built marketing analytics for {campaigns}K campaigns across {channels} channels at ${spend}K spend, pipeline up {pipeline}%, CPA from ${cpa_before} to ${cpa_after}.

**Variables:**
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{channels}`: 5 to 15, step 5 (integer)
  - `{campaigns}`: 1 to 100, step 5 (integer)
  - `{spend}`: 100 to 10000, step 500 (currency)
  - `{pipeline}`: 15 to 50, step 5 (percentage)
  - `{cpa_before}`: 50 to 500, step 50 (currency)
  - `{cpa_after}`: 20 to 200, step 20 (currency)

### DATA-0142
**Role:** data-engineer | **Theme:** data-pipeline-testing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline testing, integration testing, data pipeline CI, end-to-end data testing, fixture testing, data regression

**Scope:** an automated data pipeline testing suite covering {pipelines} pipelines with {tests} end-to-end tests using fixture data, integrated into CI/CD to gate {deployments} pipeline deployments per month
**Result:** catching {caught}% of pipeline regressions before production over {months} months and reducing pipeline-related data incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Built automated pipeline test suite for {pipelines} pipelines with {tests} E2E tests in CI/CD, gating {deployments} monthly deployments, catching {caught}% of regressions and cutting incidents from {before} to {after}/quarter.
- **B (Result-first):** Caught {caught}% of regressions and cut incidents from {before} to {after}/quarter by building {tests} E2E pipeline tests across {pipelines} pipelines in CI/CD.
- **C (Impact-led):** Caught {caught}% of regressions and cut incidents from {before} to {after}/quarter; built {tests} E2E pipeline tests for {pipelines} pipelines gating {deployments} monthly deployments.
- **D (Concise):** Built {tests} E2E tests for {pipelines} pipelines gating {deployments} monthly deployments, {caught}% regressions caught, incidents from {before} to {after}/quarter.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{tests}`: 50 to 500, step 50 (integer)
  - `{deployments}`: 20 to 200, step 20 (integer)
  - `{caught}`: 70 to 95, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0143
**Role:** data-scientist | **Theme:** network-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** network analysis, graph analytics, community detection, centrality, NetworkX, influence analysis

**Scope:** a social network analysis on a graph of {nodes}M users and {edges}M connections, applying community detection and centrality algorithms to identify {communities} communities and {influencers} key influencers
**Result:** enabling {use_cases} targeting and segmentation use cases and improving campaign response rate by {response}% through influencer-seeded distribution

**Variations:**
- **A (Standard):** Analyzed a {nodes}M-user, {edges}M-connection graph identifying {communities} communities and {influencers} influencers, enabling {use_cases} use cases and improving campaign response {response}%.
- **B (Result-first):** Improved campaign response {response}% and enabled {use_cases} use cases by analyzing {nodes}M-user graph identifying {communities} communities and {influencers} influencers.
- **C (Impact-led):** Improved campaign response {response}% and enabled {use_cases} use cases; analyzed {nodes}M-user, {edges}M-connection graph identifying {communities} communities and {influencers} influencers.
- **D (Concise):** Analyzed {nodes}M-user, {edges}M-connection graph, {communities} communities and {influencers} influencers identified, {use_cases} use cases enabled, campaign response up {response}%.

**Variables:**
  - `{nodes}`: 0.1 to 100, step 1 (integer)
  - `{edges}`: 0.5 to 500, step 5 (integer)
  - `{communities}`: 10 to 500, step 10 (integer)
  - `{influencers}`: 100 to 5000, step 100 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{response}`: 15 to 50, step 5 (percentage)

### DATA-0144
**Role:** data-analyst | **Theme:** cost-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** cost analytics, unit economics, COGS analysis, cost allocation, cost reduction, profitability analytics

**Scope:** a unit economics and cost analytics platform tracking {metrics} cost metrics across {cost_centers} cost centers and {products} product lines, with granular margin analysis and cost allocation models
**Result:** identifying ${savings}K in annual cost reduction opportunities and improving unit contribution margin from {before}% to {after}%

**Variations:**
- **A (Standard):** Built cost analytics tracking {metrics} metrics across {cost_centers} cost centers and {products} product lines, identifying ${savings}K in savings and improving unit margin from {before}% to {after}%.
- **B (Result-first):** Identified ${savings}K in cost savings and improved unit margin from {before}% to {after}% by building cost analytics across {cost_centers} cost centers and {products} product lines.
- **C (Impact-led):** Identified ${savings}K in savings and improved unit margin from {before}% to {after}%; built cost analytics tracking {metrics} metrics across {cost_centers} cost centers and {products} product lines.
- **D (Concise):** Built cost analytics for {metrics} metrics across {cost_centers} cost centers and {products} product lines, ${savings}K savings identified, margin from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{cost_centers}`: 10 to 100, step 10 (integer)
  - `{products}`: 5 to 50, step 5 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 40 to 65, step 5 (percentage)

### DATA-0145
**Role:** ml-engineer | **Theme:** training-data-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** training data pipeline, data labeling, annotation pipeline, dataset versioning, DVC, training data management

**Scope:** a training data pipeline using DVC managing {datasets} versioned datasets totalling {volume}TB, integrating with {labeling_tools} labeling tools and automating data validation before each of {runs} weekly training runs
**Result:** reducing training data preparation time from {before} days to {after} hours and achieving {quality}% labeled data quality rate across {annotators} annotators

**Variations:**
- **A (Standard):** Built DVC training data pipeline for {datasets} versioned datasets at {volume}TB with {labeling_tools} labeling integrations, cutting prep from {before} days to {after} hours and achieving {quality}% label quality.
- **B (Result-first):** Reduced training data prep from {before} days to {after} hours and achieved {quality}% label quality by building DVC pipeline for {datasets} datasets at {volume}TB.
- **C (Impact-led):** Cut prep from {before} days to {after} hours and achieved {quality}% label quality; built DVC pipeline for {datasets} versioned datasets at {volume}TB with {labeling_tools} labeling integrations.
- **D (Concise):** Built DVC training data pipeline for {datasets} datasets at {volume}TB with {labeling_tools} integrations, prep from {before}d to {after}h, {quality}% label quality.

**Variables:**
  - `{datasets}`: 5 to 50, step 5 (integer)
  - `{volume}`: 1 to 100, step 5 (integer)
  - `{labeling_tools}`: 2 to 5, step 1 (integer)
  - `{runs}`: 2 to 7, step 1 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{quality}`: 90 to 99, step 2 (percentage)
  - `{annotators}`: 5 to 50, step 5 (integer)

### DATA-0146
**Role:** bi-analyst | **Theme:** operations-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** operations analytics, operational efficiency, process analytics, throughput analytics, OEE, operational KPIs

**Scope:** an operations analytics platform for a {ops_type} operation tracking {metrics} KPIs across {locations} sites and {shifts} shift patterns, identifying bottlenecks and scheduling inefficiencies
**Result:** improving operational throughput by {throughput}% and reducing operational downtime from {before} hours to {after} hours per week

**Variations:**
- **A (Standard):** Built operations analytics for a {ops_type} operation tracking {metrics} KPIs across {locations} sites and {shifts} shifts, improving throughput {throughput}% and reducing downtime from {before} to {after} hours/week.
- **B (Result-first):** Improved throughput {throughput}% and reduced downtime from {before} to {after} hours/week by building operations analytics for {metrics} KPIs across {locations} sites and {shifts} shifts.
- **C (Impact-led):** Grew throughput {throughput}% and cut downtime from {before} to {after} hours/week; built operations analytics tracking {metrics} KPIs across {locations} sites and {shifts} shift patterns.
- **D (Concise):** Built operations analytics for {metrics} KPIs across {locations} sites and {shifts} shifts, throughput up {throughput}%, downtime from {before} to {after}h/week.

**Variables:**
  - `{metrics}`: 10 to 50, step 10 (integer)
  - `{locations}`: 3 to 30, step 3 (integer)
  - `{shifts}`: 2 to 5, step 1 (integer)
  - `{throughput}`: 10 to 40, step 5 (percentage)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0147
**Role:** data-scientist | **Theme:** propensity-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** propensity modeling, uplift modeling, treatment response, conversion propensity, customer scoring, targeting model

**Scope:** a propensity model predicting {outcome} probability for {customers}K scored customers using {features} features, integrated into {channels} marketing channels for targeted outreach
**Result:** improving campaign conversion rate from {before}% to {after}% and reducing cost per conversion by {cost_reduction}%

**Variations:**
- **A (Standard):** Built propensity model for {outcome} across {customers}K customers on {features} features, integrated into {channels} marketing channels, improving conversion from {before}% to {after}% and cutting cost per conversion {cost_reduction}%.
- **B (Result-first):** Improved conversion from {before}% to {after}% and cut cost per conversion {cost_reduction}% by building propensity model for {outcome} across {customers}K customers and {channels} channels.
- **C (Impact-led):** Grew conversion from {before}% to {after}% and cut cost per conversion {cost_reduction}%; built propensity model for {outcome} on {features} features across {customers}K customers in {channels} channels.
- **D (Concise):** Built propensity model for {outcome} across {customers}K customers and {features} features, integrated into {channels} channels, conversion from {before}% to {after}%, cost/conversion down {cost_reduction}%.

**Variables:**
  - `{customers}`: 10 to 1000, step 10 (integer)
  - `{features}`: 20 to 200, step 20 (integer)
  - `{channels}`: 3 to 8, step 1 (integer)
  - `{before}`: 2 to 8, step 1 (percentage)
  - `{after}`: 8 to 25, step 2 (percentage)
  - `{cost_reduction}`: 20 to 60, step 5 (percentage)

### DATA-0148
**Role:** data-engineer | **Theme:** event-sourcing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** event sourcing, event store, CQRS, event replay, audit log, immutable events

**Scope:** an event sourcing architecture storing {events}M immutable domain events across {aggregates} aggregate types in an event store, supporting event replay for {consumers} read models and audit use cases
**Result:** enabling full audit trail for {events}M events and reducing read model rebuild time from {before} hours to {after} minutes

**Variations:**
- **A (Standard):** Built event sourcing with {events}M events across {aggregates} aggregate types supporting {consumers} read models, enabling full audit trail and cutting rebuild time from {before} hours to {after} minutes.
- **B (Result-first):** Enabled full audit trail and cut rebuild from {before} hours to {after} minutes by building event sourcing for {events}M events across {aggregates} types with {consumers} read models.
- **C (Impact-led):** Enabled full audit trail and cut rebuild from {before} hours to {after} minutes; built event sourcing for {events}M events across {aggregates} aggregate types supporting {consumers} read models.
- **D (Concise):** Built event sourcing for {events}M events across {aggregates} types and {consumers} read models, full audit trail enabled, rebuild from {before}h to {after}min.

**Variables:**
  - `{events}`: 1 to 500, step 10 (integer)
  - `{aggregates}`: 5 to 30, step 5 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)
  - `{before}`: 2 to 12, step 2 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0149
**Role:** data-analyst | **Theme:** gaming-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** gaming analytics, player analytics, engagement metrics, session analytics, monetization analytics, LiveOps analytics

**Scope:** a gaming analytics platform for a {players}M-player title tracking {metrics} player and economy metrics across {game_modes} game modes with daily reporting for LiveOps and monetization teams
**Result:** uncovering {insights} player behavior insights that increased Day-7 retention from {before}% to {after}% and grew ARPU from ${arpu_before} to ${arpu_after}

**Variations:**
- **A (Standard):** Built gaming analytics for {players}M players tracking {metrics} metrics across {game_modes} modes, uncovering {insights} insights that grew Day-7 retention from {before}% to {after}% and ARPU from ${arpu_before} to ${arpu_after}.
- **B (Result-first):** Grew Day-7 retention from {before}% to {after}% and ARPU from ${arpu_before} to ${arpu_after} by building gaming analytics for {players}M players across {metrics} metrics.
- **C (Impact-led):** Grew Day-7 retention from {before}% to {after}% and ARPU from ${arpu_before} to ${arpu_after}; built analytics for {players}M players tracking {metrics} metrics across {game_modes} game modes.
- **D (Concise):** Built gaming analytics for {players}M players across {metrics} metrics and {game_modes} modes, Day-7 from {before}% to {after}%, ARPU from ${arpu_before} to ${arpu_after}.

**Variables:**
  - `{players}`: 0.1 to 50, step 0.5 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{game_modes}`: 3 to 10, step 1 (integer)
  - `{insights}`: 5 to 20, step 5 (integer)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 35 to 55, step 5 (percentage)
  - `{arpu_before}`: 1 to 10, step 1 (currency)
  - `{arpu_after}`: 5 to 25, step 5 (currency)

### DATA-0150
**Role:** ml-engineer | **Theme:** embedding-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** embeddings, sentence transformers, text embeddings, image embeddings, embedding pipeline, dense retrieval

**Scope:** a production embedding pipeline generating {embedding_types} embedding types for {records}M records daily using {models} embedding models, storing outputs in a vector store for {applications} downstream applications
**Result:** reducing embedding generation latency from {before} seconds to {after}ms per batch and supporting {applications} applications with sub-{retrieval}ms retrieval

**Variations:**
- **A (Standard):** Built embedding pipeline generating {embedding_types} types for {records}M daily records with {models} models, cutting generation from {before}s to {after}ms/batch and supporting {applications} applications at sub-{retrieval}ms retrieval.
- **B (Result-first):** Reduced generation from {before}s to {after}ms/batch and supported {applications} apps at sub-{retrieval}ms retrieval by building pipeline for {embedding_types} types across {records}M daily records.
- **C (Impact-led):** Cut generation from {before}s to {after}ms/batch and enabled {applications} apps at sub-{retrieval}ms retrieval; built embedding pipeline for {embedding_types} types across {records}M daily records with {models} models.
- **D (Concise):** Built embedding pipeline for {embedding_types} types across {records}M daily records with {models} models, generation from {before}s to {after}ms/batch, {applications} apps at sub-{retrieval}ms retrieval.

**Variables:**
  - `{embedding_types}`: 2 to 5, step 1 (integer)
  - `{records}`: 1 to 500, step 10 (integer)
  - `{models}`: 2 to 5, step 1 (integer)
  - `{applications}`: 3 to 15, step 3 (integer)
  - `{before}`: 5 to 30, step 5 (integer)
  - `{after}`: 50 to 500, step 50 (integer)
  - `{retrieval}`: 50 to 200, step 50 (integer)

### DATA-0151
**Role:** data-engineer | **Theme:** data-warehouse-design | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data warehouse design, Snowflake, BigQuery, warehouse architecture, partitioning, clustering, query optimization

**Scope:** a data warehouse design on Snowflake for a {size}-person analytics organization, architecting {schemas} schemas, {tables} tables, and partitioning and clustering strategies for {workload_types} workload types
**Result:** reducing average query cost by {cost}% and improving concurrent user capacity from {before} to {after} users without performance degradation

**Variations:**
- **A (Standard):** Architected Snowflake warehouse with {schemas} schemas and {tables} tables for {workload_types} workloads, reducing query cost {cost}% and growing concurrent capacity from {before} to {after} users.
- **B (Result-first):** Reduced query cost {cost}% and grew concurrent capacity from {before} to {after} users by architecting Snowflake with {schemas} schemas, {tables} tables, and optimized partitioning.
- **C (Impact-led):** Cut query cost {cost}% and grew concurrent capacity from {before} to {after} users; architected Snowflake warehouse with {schemas} schemas and {tables} tables for {workload_types} workloads.
- **D (Concise):** Architected Snowflake with {schemas} schemas and {tables} tables for {workload_types} workloads, query cost down {cost}%, capacity from {before} to {after} users.

**Variables:**
  - `{schemas}`: 5 to 30, step 5 (integer)
  - `{tables}`: 100 to 5000, step 100 (integer)
  - `{workload_types}`: 3 to 6, step 1 (integer)
  - `{cost}`: 20 to 60, step 5 (percentage)
  - `{before}`: 10 to 50, step 10 (integer)
  - `{after}`: 50 to 500, step 50 (integer)

### DATA-0152
**Role:** data-analyst | **Theme:** user-segmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** user segmentation, RFM analysis, behavioral segmentation, clustering, k-means, customer segments

**Scope:** a behavioral user segmentation model using k-means clustering on {features} RFM and behavioral features across {users}K users, producing {segments} actionable segments for {teams} marketing and product teams
**Result:** enabling personalized campaigns that improved email click-through rate from {ctr_before}% to {ctr_after}% and grew segment-specific conversion by {conversion}%

**Variations:**
- **A (Standard):** Built k-means segmentation on {features} features for {users}K users producing {segments} segments, enabling campaigns that grew email CTR from {ctr_before}% to {ctr_after}% and conversion {conversion}%.
- **B (Result-first):** Grew email CTR from {ctr_before}% to {ctr_after}% and conversion {conversion}% by building k-means segmentation on {features} features for {users}K users across {segments} segments.
- **C (Impact-led):** Grew CTR from {ctr_before}% to {ctr_after}% and conversion {conversion}%; built k-means segmentation on {features} features for {users}K users producing {segments} actionable segments.
- **D (Concise):** Built k-means segmentation on {features} features for {users}K users into {segments} segments, CTR from {ctr_before}% to {ctr_after}%, conversion up {conversion}%.

**Variables:**
  - `{features}`: 10 to 50, step 5 (integer)
  - `{users}`: 10 to 1000, step 10 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{teams}`: 2 to 5, step 1 (integer)
  - `{ctr_before}`: 2 to 8, step 1 (percentage)
  - `{ctr_after}`: 10 to 25, step 2 (percentage)
  - `{conversion}`: 15 to 50, step 5 (percentage)

### DATA-0153
**Role:** data-engineer | **Theme:** streaming-aggregation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** streaming aggregation, windowed aggregations, tumbling windows, sliding windows, Flink SQL, session windows

**Scope:** streaming aggregation jobs using Flink SQL across {streams} event streams with tumbling, sliding, and session window aggregations computing {metrics} real-time metrics for {consumers} downstream consumers
**Result:** reducing metric computation latency from {before} minutes to {after} seconds and supporting {consumers} real-time consumer applications with {uptime}% uptime

**Variations:**
- **A (Standard):** Built Flink SQL streaming aggregations across {streams} streams computing {metrics} metrics, reducing metric latency from {before}min to {after}s and supporting {consumers} consumers at {uptime}% uptime.
- **B (Result-first):** Reduced metric latency from {before}min to {after}s and supported {consumers} consumers at {uptime}% uptime by building Flink SQL aggregations across {streams} streams.
- **C (Impact-led):** Cut metric latency from {before}min to {after}s and supported {consumers} consumers at {uptime}% uptime; built Flink SQL aggregations across {streams} streams computing {metrics} real-time metrics.
- **D (Concise):** Built Flink SQL aggregations for {streams} streams computing {metrics} metrics, latency from {before}min to {after}s, {consumers} consumers at {uptime}% uptime.

**Variables:**
  - `{streams}`: 5 to 50, step 5 (integer)
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)
  - `{before}`: 5 to 30, step 5 (integer)
  - `{after}`: 1 to 10, step 1 (integer)
  - `{uptime}`: 99 to 99.99, step 0.1 (percentage)

### DATA-0154
**Role:** data-analyst | **Theme:** vendor-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** vendor analytics, supplier performance, procurement analytics, vendor scorecard, spend analysis, sourcing analytics

**Scope:** a vendor performance analytics platform tracking {metrics} KPIs across {vendors} vendors and ${spend}M in annual procurement spend, including quality, delivery, and pricing scorecards
**Result:** identifying ${savings}K in renegotiation opportunities and reducing vendor quality incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Built vendor analytics for {vendors} vendors at ${spend}M spend tracking {metrics} KPIs, identifying ${savings}K in renegotiation opportunities and cutting quality incidents from {before} to {after}/quarter.
- **B (Result-first):** Identified ${savings}K in renegotiation opportunities and cut quality incidents from {before} to {after}/quarter by building vendor analytics for {vendors} vendors at ${spend}M spend.
- **C (Impact-led):** Identified ${savings}K in renegotiation opportunities and cut quality incidents from {before} to {after}/quarter; built vendor analytics tracking {metrics} KPIs for {vendors} vendors at ${spend}M spend.
- **D (Concise):** Built vendor analytics for {vendors} vendors at ${spend}M spend with {metrics} KPIs, ${savings}K savings identified, quality incidents from {before} to {after}/quarter.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{vendors}`: 20 to 500, step 20 (integer)
  - `{spend}`: 10 to 500, step 10 (currency)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 5, step 1 (integer)

### DATA-0155
**Role:** ml-engineer | **Theme:** prompt-engineering | **Seniority:** mid | **Verb Context:** systems
**Keywords:** prompt engineering, LLM fine-tuning, few-shot prompting, chain-of-thought, prompt optimization, LLM evaluation

**Scope:** a prompt engineering and evaluation framework for {use_cases} LLM-powered use cases, designing {prompt_versions} prompt variants, running {evaluations}K automated evaluations, and optimizing for {metrics} target metrics
**Result:** improving task accuracy from {before}% to {after}% over baseline prompts and reducing average prompt token cost by {cost_reduction}% per query

**Variations:**
- **A (Standard):** Built prompt engineering framework for {use_cases} use cases with {prompt_versions} variants and {evaluations}K evaluations, improving accuracy from {before}% to {after}% and cutting token cost {cost_reduction}%.
- **B (Result-first):** Improved accuracy from {before}% to {after}% and cut token cost {cost_reduction}% by building prompt framework for {use_cases} use cases across {prompt_versions} variants and {evaluations}K evaluations.
- **C (Impact-led):** Improved accuracy from {before}% to {after}% and cut token cost {cost_reduction}%; built prompt framework for {use_cases} use cases with {prompt_versions} variants and {evaluations}K evaluations.
- **D (Concise):** Built prompt engineering for {use_cases} use cases with {prompt_versions} variants and {evaluations}K evaluations, accuracy from {before}% to {after}%, token cost down {cost_reduction}%.

**Variables:**
  - `{use_cases}`: 3 to 15, step 3 (integer)
  - `{prompt_versions}`: 5 to 30, step 5 (integer)
  - `{evaluations}`: 1 to 50, step 5 (integer)
  - `{metrics}`: 2 to 6, step 1 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 96, step 2 (percentage)
  - `{cost_reduction}`: 20 to 60, step 5 (percentage)

### DATA-0156
**Role:** data-analyst | **Theme:** nps-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** NPS analytics, Net Promoter Score, survey analytics, text analytics, VoC, customer feedback analysis

**Scope:** an NPS analytics platform processing {responses}K survey responses per quarter across {segments} customer segments, combining quantitative scoring with text analysis of {verbatims}K open-ended verbatims
**Result:** identifying {themes} actionable feedback themes that informed {improvements} product improvements and contributed to NPS growth from {before} to {after}

**Variations:**
- **A (Standard):** Built NPS analytics for {responses}K quarterly responses across {segments} segments with text analysis of {verbatims}K verbatims, identifying {themes} themes that informed {improvements} improvements and grew NPS from {before} to {after}.
- **B (Result-first):** Grew NPS from {before} to {after} and informed {improvements} improvements by analyzing {responses}K responses across {segments} segments and {verbatims}K verbatims.
- **C (Impact-led):** Grew NPS from {before} to {after} and informed {improvements} improvements; built NPS analytics for {responses}K responses across {segments} segments with text analysis of {verbatims}K verbatims.
- **D (Concise):** Built NPS analytics for {responses}K responses across {segments} segments and {verbatims}K verbatims, {themes} themes, {improvements} improvements, NPS from {before} to {after}.

**Variables:**
  - `{responses}`: 1 to 100, step 5 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{verbatims}`: 1 to 50, step 5 (integer)
  - `{themes}`: 5 to 20, step 5 (integer)
  - `{improvements}`: 3 to 15, step 3 (integer)
  - `{before}`: 20 to 40, step 5 (integer)
  - `{after}`: 45 to 70, step 5 (integer)

### DATA-0157
**Role:** data-engineer | **Theme:** data-quality-scoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data quality scoring, DQ dimensions, completeness, accuracy, timeliness, data quality index

**Scope:** a data quality scoring system across {tables} tables measuring {dimensions} DQ dimensions including completeness, uniqueness, accuracy, and timeliness, producing a composite quality index for {stakeholders} data consumers
**Result:** increasing average composite DQ score from {before} to {after}/100 across governed tables and reducing data-quality-related rework from {rework_before} hours to {rework_after} hours per week

**Variations:**
- **A (Standard):** Built DQ scoring for {tables} tables across {dimensions} dimensions, growing composite score from {before} to {after}/100 and cutting rework from {rework_before} to {rework_after} hours/week.
- **B (Result-first):** Grew DQ score from {before} to {after}/100 and cut rework from {rework_before} to {rework_after} hours/week by building scoring across {tables} tables and {dimensions} DQ dimensions.
- **C (Impact-led):** Grew DQ score from {before} to {after}/100 and cut rework from {rework_before} to {rework_after} hours/week; built DQ scoring across {tables} tables and {dimensions} dimensions for {stakeholders} consumers.
- **D (Concise):** Built DQ scoring for {tables} tables across {dimensions} dimensions, score from {before} to {after}/100, rework from {rework_before} to {rework_after}h/week.

**Variables:**
  - `{tables}`: 100 to 2000, step 100 (integer)
  - `{dimensions}`: 4 to 8, step 1 (integer)
  - `{stakeholders}`: 10 to 100, step 10 (integer)
  - `{before}`: 50 to 70, step 5 (integer)
  - `{after}`: 85 to 98, step 5 (integer)
  - `{rework_before}`: 20 to 80, step 10 (integer)
  - `{rework_after}`: 2 to 8, step 2 (integer)

### DATA-0158
**Role:** data-scientist | **Theme:** entity-resolution | **Seniority:** senior | **Verb Context:** systems
**Keywords:** entity resolution, record linkage, deduplication, fuzzy matching, probabilistic matching, golden record

**Scope:** an entity resolution pipeline using probabilistic matching to deduplicate {records}M records across {sources} data sources, creating {golden_records}M golden records with {confidence}% match confidence thresholds
**Result:** reducing duplicate entity rate from {before}% to {after}% and enabling {use_cases} downstream use cases that required a single customer view

**Variations:**
- **A (Standard):** Built probabilistic entity resolution across {records}M records from {sources} sources, creating {golden_records}M golden records, reducing duplicates from {before}% to {after}% and enabling {use_cases} downstream use cases.
- **B (Result-first):** Reduced duplicates from {before}% to {after}% and enabled {use_cases} use cases by resolving {records}M records from {sources} sources into {golden_records}M golden records.
- **C (Impact-led):** Reduced duplicates from {before}% to {after}% and enabled {use_cases} use cases; built probabilistic resolution across {records}M records from {sources} sources producing {golden_records}M golden records.
- **D (Concise):** Built entity resolution for {records}M records from {sources} sources into {golden_records}M golden records, duplicates from {before}% to {after}%, {use_cases} use cases enabled.

**Variables:**
  - `{records}`: 1 to 500, step 10 (integer)
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{golden_records}`: 0.5 to 400, step 5 (integer)
  - `{confidence}`: 80 to 99, step 5 (percentage)
  - `{before}`: 10 to 40, step 5 (percentage)
  - `{after}`: 0.5 to 3, step 0.5 (percentage)
  - `{use_cases}`: 3 to 10, step 1 (integer)

### DATA-0159
**Role:** bi-analyst | **Theme:** agile-analytics | **Seniority:** mid | **Verb Context:** operations
**Keywords:** agile analytics, sprint analytics, analytics backlog, iterative dashboards, analytics sprints, stakeholder collaboration

**Scope:** an agile analytics delivery model for a {size}-person analytics team, running {sprints}-week sprints, managing a {backlog} story-point backlog, and delivering {dashboards} dashboards and {analyses} analyses per quarter
**Result:** increasing analytics output by {output}% per quarter and improving stakeholder satisfaction from {before} to {after}/10

**Variations:**
- **A (Standard):** Implemented agile delivery for a {size}-person team with {sprints}-week sprints and {backlog} story-point backlog, delivering {dashboards} dashboards and {analyses} analyses/quarter, growing output {output}% and satisfaction from {before} to {after}/10.
- **B (Result-first):** Grew analytics output {output}% and improved satisfaction from {before} to {after}/10 by implementing agile delivery for a {size}-person team with {sprints}-week sprints.
- **C (Impact-led):** Grew output {output}% and satisfaction from {before} to {after}/10; implemented agile delivery for a {size}-person team with {sprints}-week sprints delivering {dashboards} dashboards and {analyses} analyses/quarter.
- **D (Concise):** Implemented agile analytics for {size}-person team on {sprints}-week sprints, {dashboards} dashboards and {analyses} analyses/quarter, output up {output}%, satisfaction from {before} to {after}/10.

**Variables:**
  - `{size}`: 3 to 15, step 3 (integer)
  - `{sprints}`: 1 to 3, step 1 (integer)
  - `{backlog}`: 50 to 300, step 50 (integer)
  - `{dashboards}`: 5 to 30, step 5 (integer)
  - `{analyses}`: 10 to 50, step 10 (integer)
  - `{output}`: 20 to 80, step 10 (percentage)
  - `{before}`: 5 to 6, step 1 (integer)
  - `{after}`: 8 to 10, step 1 (integer)

### DATA-0160
**Role:** data-engineer | **Theme:** data-mesh-implementation | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data mesh, domain ownership, federated governance, data product, platform thinking, decentralized data

**Scope:** a data mesh implementation across {domains} business domains, establishing domain data ownership, a self-serve data platform for {teams} domain teams, and federated governance for {policies} shared policies
**Result:** reducing centralized data team bottlenecks by {bottleneck}% and enabling {domains} domain teams to deliver new data products {delivery}x faster than the legacy centralized model

**Variations:**
- **A (Standard):** Implemented data mesh across {domains} domains with domain ownership and federated governance for {policies} policies, reducing bottlenecks {bottleneck}% and enabling {delivery}x faster data product delivery.
- **B (Result-first):** Reduced bottlenecks {bottleneck}% and enabled {delivery}x faster data product delivery by implementing data mesh across {domains} domains with federated governance for {policies} policies.
- **C (Impact-led):** Cut bottlenecks {bottleneck}% and enabled {delivery}x faster product delivery; implemented data mesh across {domains} domains with domain ownership, self-serve platform for {teams} teams, and {policies} governance policies.
- **D (Concise):** Implemented data mesh across {domains} domains with {teams} teams and {policies} governance policies, bottlenecks down {bottleneck}%, product delivery {delivery}x faster.

**Variables:**
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{policies}`: 10 to 50, step 10 (integer)
  - `{bottleneck}`: 40 to 80, step 5 (percentage)
  - `{delivery}`: 3 to 10, step 1 (integer)

### DATA-0161
**Role:** data-scientist | **Theme:** time-series-anomaly | **Seniority:** mid | **Verb Context:** systems
**Keywords:** time series anomaly, SARIMA, STL decomposition, seasonal decomposition, business metrics monitoring, KPI anomaly

**Scope:** a time series anomaly detection system using STL decomposition and SARIMA models monitoring {metrics} business KPIs across {entities} entities, automatically flagging {anomalies} anomalies per week for {stakeholders} decision makers
**Result:** reducing manual metric monitoring time from {before} hours to {after} hours per week and detecting {early}% of significant KPI deviations within {minutes} minutes of occurrence

**Variations:**
- **A (Standard):** Built STL and SARIMA anomaly detection monitoring {metrics} KPIs across {entities} entities, flagging {anomalies} anomalies/week, saving {before} to {after} hours/week of manual monitoring and detecting {early}% of deviations within {minutes} minutes.
- **B (Result-first):** Saved {before} to {after} hours/week of manual monitoring and detected {early}% of deviations within {minutes} minutes by building anomaly detection for {metrics} KPIs across {entities} entities.
- **C (Impact-led):** Saved {before} to {after} hours/week of monitoring and detected {early}% of deviations within {minutes} minutes; built STL/SARIMA detection for {metrics} KPIs across {entities} entities.
- **D (Concise):** Built time series anomaly detection for {metrics} KPIs across {entities} entities, monitoring from {before} to {after}h/week, {early}% deviations within {minutes}min.

**Variables:**
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{entities}`: 10 to 500, step 10 (integer)
  - `{anomalies}`: 10 to 100, step 10 (integer)
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{early}`: 80 to 97, step 5 (percentage)
  - `{minutes}`: 5 to 30, step 5 (integer)

### DATA-0162
**Role:** data-analyst | **Theme:** financial-metrics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** financial analytics, gross margin, EBITDA, financial KPIs, P&L analytics, financial dashboard

**Scope:** a financial metrics platform for a ${revenue}M annual revenue business tracking {metrics} P&L metrics across {entities} legal entities and {periods} reporting periods with automated variance commentary
**Result:** cutting monthly reporting pack preparation from {before} days to {after} hours and improving budget variance explanation coverage from {before_cov}% to {after_cov}%

**Variations:**
- **A (Standard):** Built financial metrics platform for a ${revenue}M business tracking {metrics} P&L metrics across {entities} entities, cutting reporting pack from {before} days to {after} hours and growing variance coverage from {before_cov}% to {after_cov}%.
- **B (Result-first):** Cut reporting pack from {before} days to {after} hours and grew variance coverage from {before_cov}% to {after_cov}% by building financial metrics for {metrics} metrics across {entities} entities.
- **C (Impact-led):** Cut reporting pack from {before} days to {after} hours and grew variance coverage from {before_cov}% to {after_cov}%; built financial metrics platform for ${revenue}M business across {metrics} metrics and {entities} entities.
- **D (Concise):** Built financial metrics for ${revenue}M business across {metrics} metrics and {entities} entities, reporting from {before}d to {after}h, variance coverage from {before_cov}% to {after_cov}%.

**Variables:**
  - `{revenue}`: 10 to 1000, step 50 (currency)
  - `{metrics}`: 20 to 100, step 10 (integer)
  - `{entities}`: 2 to 20, step 2 (integer)
  - `{periods}`: 12 to 36, step 6 (integer)
  - `{before}`: 5 to 15, step 5 (integer)
  - `{after}`: 2 to 8, step 2 (integer)
  - `{before_cov}`: 40 to 65, step 5 (percentage)
  - `{after_cov}`: 85 to 99, step 5 (percentage)

### DATA-0163
**Role:** data-engineer | **Theme:** partition-strategy | **Seniority:** mid | **Verb Context:** systems
**Keywords:** partitioning strategy, table partitioning, partition pruning, query optimization, BigQuery partitioning, date partitioning

**Scope:** a partitioning and clustering redesign for {tables} high-volume tables in BigQuery, implementing date and categorical partition pruning for {queries}K daily queries scanning {volume}TB daily
**Result:** reducing average bytes scanned per query by {scan}% and cutting monthly BigQuery compute costs by ${savings}K

**Variations:**
- **A (Standard):** Redesigned partitioning for {tables} BigQuery tables across {queries}K daily queries at {volume}TB scan, reducing bytes scanned {scan}% and cutting monthly costs by ${savings}K.
- **B (Result-first):** Reduced bytes scanned {scan}% and cut monthly costs ${savings}K by redesigning partitioning for {tables} BigQuery tables across {queries}K daily queries.
- **C (Impact-led):** Cut bytes scanned {scan}% and monthly costs ${savings}K; redesigned partitioning and clustering for {tables} BigQuery tables across {queries}K daily queries at {volume}TB.
- **D (Concise):** Redesigned partitioning for {tables} BigQuery tables at {queries}K daily queries and {volume}TB, bytes scanned down {scan}%, costs down ${savings}K/month.

**Variables:**
  - `{tables}`: 50 to 500, step 50 (integer)
  - `{queries}`: 10 to 500, step 10 (integer)
  - `{volume}`: 10 to 1000, step 50 (integer)
  - `{scan}`: 50 to 90, step 5 (percentage)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0164
**Role:** ml-engineer | **Theme:** ml-platform | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML platform, Kubeflow, SageMaker, end-to-end ML, MLOps platform, self-service ML

**Scope:** an end-to-end ML platform on Kubeflow supporting {teams} data science teams with self-service training, experiment tracking, model registry, and deployment for {models} production models
**Result:** reducing time-to-production for new ML models from {before} weeks to {after} days and supporting {concurrent_experiments} concurrent training experiments

**Variations:**
- **A (Standard):** Built Kubeflow ML platform for {teams} teams covering training, registry, and deployment for {models} models, cutting time-to-production from {before} weeks to {after} days and supporting {concurrent_experiments} concurrent experiments.
- **B (Result-first):** Reduced time-to-production from {before} weeks to {after} days and supported {concurrent_experiments} concurrent experiments by building Kubeflow ML platform for {teams} teams and {models} models.
- **C (Impact-led):** Cut time-to-production from {before} weeks to {after} days and enabled {concurrent_experiments} concurrent experiments; built Kubeflow ML platform for {teams} teams with self-service training and deployment for {models} models.
- **D (Concise):** Built Kubeflow ML platform for {teams} teams and {models} models, time-to-production from {before}wk to {after}d, {concurrent_experiments} concurrent experiments.

**Variables:**
  - `{teams}`: 3 to 20, step 3 (integer)
  - `{models}`: 20 to 200, step 20 (integer)
  - `{before}`: 6 to 16, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{concurrent_experiments}`: 10 to 100, step 10 (integer)

### DATA-0165
**Role:** data-analyst | **Theme:** sales-forecasting-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sales forecasting, pipeline analytics, forecast modeling, revenue forecast, opportunity scoring, CRM forecasting

**Scope:** a quantitative sales forecasting model combining CRM pipeline data, historical win rates, and seasonality signals across {reps} sales reps, {segments} market segments, and {horizons} forecast horizons
**Result:** improving quarterly forecast accuracy from {before}% to {after}% MAPE and reducing end-of-quarter revenue surprise from ${surprise_before}M to ${surprise_after}K

**Variations:**
- **A (Standard):** Built quantitative sales forecast combining CRM and seasonality for {reps} reps across {segments} segments and {horizons} horizons, improving MAPE from {before}% to {after}% and cutting quarterly surprise from ${surprise_before}M to ${surprise_after}K.
- **B (Result-first):** Improved MAPE from {before}% to {after}% and cut quarterly surprise from ${surprise_before}M to ${surprise_after}K by building quantitative forecast for {reps} reps across {segments} segments.
- **C (Impact-led):** Improved MAPE from {before}% to {after}% and cut quarterly surprise from ${surprise_before}M to ${surprise_after}K; built quantitative sales forecast for {reps} reps across {segments} segments and {horizons} horizons.
- **D (Concise):** Built sales forecast for {reps} reps across {segments} segments and {horizons} horizons, MAPE from {before}% to {after}%, quarterly surprise from ${surprise_before}M to ${surprise_after}K.

**Variables:**
  - `{reps}`: 20 to 500, step 20 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{horizons}`: 2 to 4, step 1 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 12, step 2 (percentage)
  - `{surprise_before}`: 5 to 50, step 5 (currency)
  - `{surprise_after}`: 200 to 800, step 100 (currency)

### DATA-0166
**Role:** data-engineer | **Theme:** table-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** table optimization, VACUUM, ANALYZE, dead tuples, PostgreSQL optimization, index maintenance

**Scope:** a database maintenance and optimization program for a PostgreSQL cluster with {tables} tables, {indexes} indexes, and {size}TB of data, automating VACUUM, ANALYZE, and index rebuild schedules across {environments} environments
**Result:** reducing average query execution time by {perf}% and eliminating {bloat}GB of table bloat that was degrading write performance

**Variations:**
- **A (Standard):** Automated PostgreSQL maintenance for {tables} tables and {indexes} indexes at {size}TB, reducing query time {perf}% and eliminating {bloat}GB of bloat degrading writes.
- **B (Result-first):** Reduced query time {perf}% and eliminated {bloat}GB of bloat by automating PostgreSQL VACUUM and index maintenance for {tables} tables at {size}TB.
- **C (Impact-led):** Cut query time {perf}% and eliminated {bloat}GB of bloat; automated PostgreSQL maintenance for {tables} tables and {indexes} indexes across {environments} environments.
- **D (Concise):** Automated PostgreSQL maintenance for {tables} tables and {indexes} indexes at {size}TB, query time down {perf}%, {bloat}GB bloat eliminated.

**Variables:**
  - `{tables}`: 100 to 5000, step 100 (integer)
  - `{indexes}`: 200 to 10000, step 200 (integer)
  - `{size}`: 1 to 100, step 5 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{perf}`: 20 to 60, step 5 (percentage)
  - `{bloat}`: 10 to 500, step 10 (integer)

### DATA-0167
**Role:** data-scientist | **Theme:** segmentation-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** segmentation analysis, psychographic segmentation, needs-based segmentation, market segmentation, segment profiling

**Scope:** a needs-based market segmentation study using mixed-methods clustering across {respondents}K survey respondents and {behavioral_features} behavioral signals, producing {segments} segments with full profiles for go-to-market planning
**Result:** enabling {gtm_decisions} go-to-market decisions and contributing to a {revenue_lift}% improvement in product-market fit scores across targeted segments

**Variations:**
- **A (Standard):** Developed needs-based segmentation from {respondents}K respondents and {behavioral_features} signals producing {segments} profiles, enabling {gtm_decisions} GTM decisions and improving PMF scores {revenue_lift}%.
- **B (Result-first):** Enabled {gtm_decisions} GTM decisions and improved PMF scores {revenue_lift}% by building needs-based segmentation from {respondents}K respondents and {behavioral_features} signals.
- **C (Impact-led):** Enabled {gtm_decisions} GTM decisions and improved PMF scores {revenue_lift}%; developed needs-based segmentation from {respondents}K respondents and {behavioral_features} signals into {segments} profiles.
- **D (Concise):** Developed needs-based segmentation from {respondents}K respondents and {behavioral_features} signals into {segments} profiles, {gtm_decisions} GTM decisions, PMF up {revenue_lift}%.

**Variables:**
  - `{respondents}`: 1 to 50, step 1 (integer)
  - `{behavioral_features}`: 10 to 100, step 10 (integer)
  - `{segments}`: 4 to 10, step 1 (integer)
  - `{gtm_decisions}`: 3 to 15, step 3 (integer)
  - `{revenue_lift}`: 10 to 40, step 5 (percentage)

### DATA-0168
**Role:** data-engineer | **Theme:** data-encryption | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data encryption, column encryption, at-rest encryption, key management, AWS KMS, data security

**Scope:** a data encryption strategy for {tables} tables covering {columns} sensitive columns using column-level encryption and key management via AWS KMS, across {environments} environments and {regions} geographic regions
**Result:** achieving {compliance}% encryption coverage for regulated data and passing {audits} security audits with zero encryption-related findings

**Variations:**
- **A (Standard):** Implemented column-level encryption for {tables} tables and {columns} columns via AWS KMS across {environments} environments, achieving {compliance}% regulated data coverage and passing {audits} audits with zero findings.
- **B (Result-first):** Achieved {compliance}% regulated data coverage and passed {audits} audits with zero findings by implementing column encryption for {tables} tables and {columns} columns via AWS KMS.
- **C (Impact-led):** Reached {compliance}% regulated data coverage and passed {audits} audits clean; implemented column encryption for {tables} tables and {columns} columns via AWS KMS across {environments} environments.
- **D (Concise):** Implemented column encryption for {tables} tables and {columns} columns via AWS KMS across {environments} environments, {compliance}% regulated coverage, {audits} audits passed clean.

**Variables:**
  - `{tables}`: 50 to 500, step 50 (integer)
  - `{columns}`: 100 to 2000, step 100 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{regions}`: 2 to 6, step 1 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{audits}`: 1 to 5, step 1 (integer)

### DATA-0169
**Role:** bi-analyst | **Theme:** procurement-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** procurement analytics, spend analytics, tail spend, category management, PO analytics, sourcing analytics

**Scope:** a procurement analytics platform tracking ${spend}M in annual spend across {vendors} vendors, {categories} spend categories, and {cost_centers} cost centers with tail spend and contract compliance analysis
**Result:** identifying ${savings}K in addressable savings and improving on-contract spend ratio from {before}% to {after}%

**Variations:**
- **A (Standard):** Built procurement analytics for ${spend}M spend across {vendors} vendors, {categories} categories, and {cost_centers} cost centers, identifying ${savings}K in addressable savings and improving on-contract spend from {before}% to {after}%.
- **B (Result-first):** Identified ${savings}K in savings and improved on-contract spend from {before}% to {after}% by building procurement analytics for ${spend}M across {vendors} vendors and {categories} categories.
- **C (Impact-led):** Identified ${savings}K in savings and grew on-contract spend from {before}% to {after}%; built procurement analytics for ${spend}M across {vendors} vendors, {categories} categories, and {cost_centers} cost centers.
- **D (Concise):** Built procurement analytics for ${spend}M spend across {vendors} vendors and {categories} categories, ${savings}K savings identified, on-contract from {before}% to {after}%.

**Variables:**
  - `{spend}`: 10 to 500, step 10 (currency)
  - `{vendors}`: 50 to 2000, step 50 (integer)
  - `{categories}`: 10 to 50, step 10 (integer)
  - `{cost_centers}`: 10 to 100, step 10 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 50 to 75, step 5 (percentage)
  - `{after}`: 80 to 97, step 5 (percentage)

### DATA-0170
**Role:** ml-engineer | **Theme:** llm-fine-tuning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** LLM fine-tuning, LoRA, PEFT, instruction tuning, domain adaptation, supervised fine-tuning

**Scope:** a LoRA fine-tuning pipeline adapting a {params}B base LLM on {examples}K domain-specific instruction examples across {tasks} target tasks, training on {gpus} GPUs with automated evaluation
**Result:** improving task-specific accuracy from {before}% to {after}% over the base model baseline and reducing inference cost by {cost}% through model size reduction

**Variations:**
- **A (Standard):** Fine-tuned a {params}B LLM with LoRA on {examples}K examples across {tasks} tasks on {gpus} GPUs, improving task accuracy from {before}% to {after}% over baseline and cutting inference cost {cost}%.
- **B (Result-first):** Improved task accuracy from {before}% to {after}% over baseline and cut inference cost {cost}% by fine-tuning a {params}B LLM with LoRA on {examples}K examples.
- **C (Impact-led):** Improved task accuracy from {before}% to {after}% and cut inference cost {cost}%; fine-tuned {params}B LLM with LoRA on {examples}K examples across {tasks} tasks on {gpus} GPUs.
- **D (Concise):** Fine-tuned {params}B LLM with LoRA on {examples}K examples across {tasks} tasks, accuracy from {before}% to {after}%, inference cost down {cost}%.

**Variables:**
  - `{params}`: 1 to 70, step 1 (integer)
  - `{examples}`: 1 to 500, step 10 (integer)
  - `{tasks}`: 2 to 10, step 1 (integer)
  - `{gpus}`: 4 to 64, step 4 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 97, step 2 (percentage)
  - `{cost}`: 30 to 70, step 5 (percentage)

### DATA-0171
**Role:** data-analyst | **Theme:** warranty-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** warranty analytics, failure analysis, defect analytics, MTBF, product quality analytics, claims analytics

**Scope:** a warranty analytics platform tracking {metrics} quality metrics across {products} product lines and {components} component categories, analyzing failure modes for {claims}K annual warranty claims
**Result:** identifying {defects} root-cause defect patterns that informed design changes reducing warranty claim rate from {before}% to {after}% and saving ${savings}K annually

**Variations:**
- **A (Standard):** Built warranty analytics for {claims}K claims across {products} products and {components} components, identifying {defects} defect patterns that reduced claim rate from {before}% to {after}% and saved ${savings}K annually.
- **B (Result-first):** Reduced claim rate from {before}% to {after}% and saved ${savings}K annually by analyzing {claims}K claims across {products} products identifying {defects} defect patterns.
- **C (Impact-led):** Reduced claim rate from {before}% to {after}% and saved ${savings}K annually; built warranty analytics for {claims}K claims across {products} products and {components} components.
- **D (Concise):** Built warranty analytics for {claims}K claims across {products} products and {components} components, {defects} defect patterns, claim rate from {before}% to {after}%, ${savings}K saved.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{products}`: 5 to 50, step 5 (integer)
  - `{components}`: 10 to 100, step 10 (integer)
  - `{claims}`: 1 to 100, step 5 (integer)
  - `{defects}`: 3 to 15, step 3 (integer)
  - `{before}`: 5 to 20, step 5 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)
  - `{savings}`: 100 to 5000, step 100 (currency)

### DATA-0172
**Role:** data-engineer | **Theme:** self-serve-ingestion | **Seniority:** senior | **Verb Context:** systems
**Keywords:** self-serve ingestion, no-code ingestion, data integration, Airbyte, Fivetran, connector platform

**Scope:** a self-serve data ingestion platform using Airbyte enabling {teams} business teams to onboard {sources} new data sources independently, supporting {connectors} pre-built connectors and a custom connector SDK
**Result:** reducing data team ingestion workload by {reduction}% and cutting new source onboarding time from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Deployed Airbyte self-serve ingestion for {teams} teams with {connectors} connectors and custom SDK, reducing ingestion workload {reduction}% and cutting onboarding from {before} weeks to {after} days.
- **B (Result-first):** Reduced ingestion workload {reduction}% and cut onboarding from {before} weeks to {after} days by deploying Airbyte for {teams} teams with {connectors} connectors.
- **C (Impact-led):** Cut ingestion workload {reduction}% and onboarding from {before} weeks to {after} days; deployed Airbyte self-serve ingestion for {teams} teams across {connectors} connectors.
- **D (Concise):** Deployed Airbyte for {teams} teams with {connectors} connectors, ingestion workload down {reduction}%, onboarding from {before}wk to {after}d.

**Variables:**
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{sources}`: 10 to 100, step 10 (integer)
  - `{connectors}`: 50 to 300, step 50 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 1 to 2, step 1 (integer)

### DATA-0173
**Role:** data-scientist | **Theme:** ensemble-methods | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ensemble methods, stacking, blending, gradient boosting, XGBoost, LightGBM, model ensembling

**Scope:** an ensemble modeling framework combining {models} base models using stacking with a {meta_model} meta-learner for a {task} prediction task, trained on {samples}M samples with {features} features
**Result:** improving holdout {metric} from {before} to {after} over the best single-model baseline and reducing prediction variance by {variance}%

**Variations:**
- **A (Standard):** Built ensemble of {models} models stacked with a {meta_model} meta-learner for {task} on {samples}M samples, improving {metric} from {before} to {after} and reducing variance {variance}%.
- **B (Result-first):** Improved {metric} from {before} to {after} and reduced variance {variance}% by building {models}-model ensemble with {meta_model} stacking for {task} on {samples}M samples.
- **C (Impact-led):** Improved {metric} from {before} to {after} and cut variance {variance}%; built ensemble of {models} models with {meta_model} stacking for {task} on {samples}M samples and {features} features.
- **D (Concise):** Built {models}-model ensemble with {meta_model} stacking for {task} on {samples}M samples, {metric} from {before} to {after}, variance down {variance}%.

**Variables:**
  - `{models}`: 3 to 15, step 3 (integer)
  - `{samples}`: 1 to 500, step 10 (integer)
  - `{features}`: 20 to 500, step 20 (integer)
  - `{before}`: 0.75 to 0.85, step 0.01 (integer)
  - `{after}`: 0.88 to 0.97, step 0.01 (integer)
  - `{variance}`: 15 to 50, step 5 (percentage)

### DATA-0174
**Role:** data-analyst | **Theme:** saas-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SaaS analytics, product usage, feature adoption, seat utilization, expansion analytics, SaaS metrics

**Scope:** a SaaS product analytics platform tracking {metrics} usage metrics across {accounts}K accounts and {users}K users, monitoring feature adoption, seat utilization, and expansion signals
**Result:** identifying {accounts}K expansion-ready accounts that contributed ${expansion}K in net new ARR and reducing time-to-identify-at-risk from {before} days to {after} days

**Variations:**
- **A (Standard):** Built SaaS analytics for {accounts}K accounts and {users}K users tracking {metrics} metrics, identifying expansion-ready accounts contributing ${expansion}K ARR and cutting at-risk detection from {before} to {after} days.
- **B (Result-first):** Contributed ${expansion}K in new ARR and cut at-risk detection from {before} to {after} days by building SaaS analytics for {accounts}K accounts tracking {metrics} metrics.
- **C (Impact-led):** Contributed ${expansion}K in new ARR and cut at-risk detection from {before} to {after} days; built SaaS analytics for {accounts}K accounts and {users}K users tracking {metrics} metrics.
- **D (Concise):** Built SaaS analytics for {accounts}K accounts and {users}K users across {metrics} metrics, ${expansion}K new ARR, at-risk detection from {before} to {after} days.

**Variables:**
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{accounts}`: 1 to 50, step 1 (integer)
  - `{users}`: 10 to 500, step 10 (integer)
  - `{expansion}`: 100 to 5000, step 100 (currency)
  - `{before}`: 30 to 90, step 10 (integer)
  - `{after}`: 3 to 10, step 1 (integer)

### DATA-0175
**Role:** ml-engineer | **Theme:** model-explainability | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model explainability, SHAP, LIME, feature importance, XAI, interpretable ML, model transparency

**Scope:** a model explainability framework using SHAP values for {models} production models, generating global and local explanations for {predictions}K daily predictions and delivering {reports} stakeholder explanation reports per month
**Result:** achieving regulatory explainability requirements for {models} models and reducing model-related customer escalations from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Built SHAP explainability for {models} production models at {predictions}K daily predictions and {reports} monthly reports, achieving regulatory requirements and cutting escalations from {before} to {after}/quarter.
- **B (Result-first):** Achieved regulatory explainability and cut escalations from {before} to {after}/quarter by building SHAP framework for {models} models at {predictions}K daily predictions.
- **C (Impact-led):** Achieved regulatory requirements and cut escalations from {before} to {after}/quarter; built SHAP explainability for {models} models at {predictions}K daily predictions and {reports} monthly reports.
- **D (Concise):** Built SHAP explainability for {models} models at {predictions}K daily predictions and {reports} monthly reports, regulatory requirements met, escalations from {before} to {after}/quarter.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{predictions}`: 1 to 200, step 10 (integer)
  - `{reports}`: 5 to 20, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0176
**Role:** data-analyst | **Theme:** field-sales-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** field sales analytics, territory analytics, rep performance, activity analytics, coverage analytics, route efficiency

**Scope:** field sales analytics tracking {metrics} activity and performance metrics across {reps} field reps and {territories} territories, integrating CRM activity data with {outcomes} outcome metrics
**Result:** identifying {rep_gaps} performance gaps that informed coaching decisions improving average quota attainment from {before}% to {after}%

**Variations:**
- **A (Standard):** Built field sales analytics for {reps} reps across {territories} territories tracking {metrics} metrics, identifying {rep_gaps} performance gaps that improved quota attainment from {before}% to {after}%.
- **B (Result-first):** Improved quota attainment from {before}% to {after}% by building field sales analytics for {reps} reps across {territories} territories and identifying {rep_gaps} performance gaps.
- **C (Impact-led):** Improved quota attainment from {before}% to {after}%; built field sales analytics for {reps} reps across {territories} territories tracking {metrics} metrics and identifying {rep_gaps} gaps.
- **D (Concise):** Built field analytics for {reps} reps across {territories} territories with {metrics} metrics, {rep_gaps} performance gaps identified, attainment from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{reps}`: 10 to 200, step 10 (integer)
  - `{territories}`: 10 to 100, step 10 (integer)
  - `{outcomes}`: 3 to 8, step 1 (integer)
  - `{rep_gaps}`: 3 to 15, step 3 (integer)
  - `{before}`: 60 to 80, step 5 (percentage)
  - `{after}`: 85 to 99, step 5 (percentage)

### DATA-0177
**Role:** data-engineer | **Theme:** kafka-infrastructure | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Kafka, event streaming, Kafka cluster, topic management, consumer groups, Kafka operations

**Scope:** a production Kafka cluster managing {topics} topics, {partitions}K partitions, and {throughput}GB per day of event data, supporting {consumers} consumer groups across {teams} engineering teams
**Result:** achieving {uptime}% cluster uptime and reducing consumer lag incidents from {before} per month to {after} per quarter

**Variations:**
- **A (Standard):** Operated Kafka cluster with {topics} topics and {partitions}K partitions at {throughput}GB/day for {consumers} consumer groups, achieving {uptime}% uptime and cutting lag incidents from {before}/month to {after}/quarter.
- **B (Result-first):** Achieved {uptime}% uptime and cut lag incidents from {before}/month to {after}/quarter by operating Kafka across {topics} topics and {partitions}K partitions at {throughput}GB/day.
- **C (Impact-led):** Reached {uptime}% uptime and cut lag incidents from {before}/month to {after}/quarter; operated Kafka cluster with {topics} topics and {partitions}K partitions at {throughput}GB/day for {consumers} groups.
- **D (Concise):** Operated Kafka with {topics} topics and {partitions}K partitions at {throughput}GB/day for {consumers} groups, {uptime}% uptime, lag incidents from {before}/month to {after}/quarter.

**Variables:**
  - `{topics}`: 50 to 1000, step 50 (integer)
  - `{partitions}`: 1 to 50, step 1 (integer)
  - `{throughput}`: 10 to 1000, step 50 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{uptime}`: 99.9 to 99.999, step 0.01 (percentage)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### DATA-0178
**Role:** data-scientist | **Theme:** transfer-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** transfer learning, domain adaptation, pre-trained models, fine-tuning, few-shot learning, foundation models

**Scope:** a transfer learning pipeline adapting {base_models} pre-trained foundation models to {domains} target domains using {examples}K labeled examples, reducing labeled data requirements by {reduction}%
**Result:** achieving {accuracy}% task accuracy with {reduction}% fewer labels and accelerating model development from {before} weeks to {after} days per new domain

**Variations:**
- **A (Standard):** Built transfer learning pipeline adapting {base_models} models to {domains} domains on {examples}K examples, achieving {accuracy}% accuracy with {reduction}% fewer labels and cutting development from {before} weeks to {after} days.
- **B (Result-first):** Achieved {accuracy}% accuracy with {reduction}% fewer labels and cut development from {before} weeks to {after} days by adapting {base_models} models to {domains} domains.
- **C (Impact-led):** Achieved {accuracy}% accuracy with {reduction}% fewer labels and cut development from {before} weeks to {after} days; built transfer pipeline for {base_models} models across {domains} domains.
- **D (Concise):** Built transfer learning for {base_models} models across {domains} domains on {examples}K examples, {accuracy}% accuracy, {reduction}% fewer labels, development from {before}wk to {after}d.

**Variables:**
  - `{base_models}`: 2 to 5, step 1 (integer)
  - `{domains}`: 3 to 10, step 1 (integer)
  - `{examples}`: 1 to 50, step 5 (integer)
  - `{reduction}`: 50 to 90, step 5 (percentage)
  - `{accuracy}`: 80 to 97, step 2 (percentage)
  - `{before}`: 6 to 20, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0179
**Role:** bi-analyst | **Theme:** workforce-planning-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** workforce planning, headcount analytics, capacity planning, skills gap, hiring analytics, workforce forecasting

**Scope:** a workforce planning analytics platform for a {headcount}-person organization modeling {roles} role categories across {departments} departments with hiring demand forecasts over {horizons} planning horizons
**Result:** improving hiring forecast accuracy from {before}% to {after}% and enabling {decisions} workforce decisions that reduced time-to-fill from {ttf_before} days to {ttf_after} days

**Variations:**
- **A (Standard):** Built workforce planning analytics for a {headcount}-person org across {roles} roles and {departments} departments, improving forecast accuracy from {before}% to {after}% and cutting time-to-fill from {ttf_before} to {ttf_after} days.
- **B (Result-first):** Improved forecast accuracy from {before}% to {after}% and cut time-to-fill from {ttf_before} to {ttf_after} days by building workforce planning across {roles} roles and {departments} departments.
- **C (Impact-led):** Improved forecast accuracy from {before}% to {after}% and cut time-to-fill from {ttf_before} to {ttf_after} days; built workforce planning for {headcount}-person org across {roles} roles and {departments} departments.
- **D (Concise):** Built workforce planning for {headcount}-person org across {roles} roles and {departments} departments, forecast from {before}% to {after}%, time-to-fill from {ttf_before} to {ttf_after} days.

**Variables:**
  - `{headcount}`: 100 to 10000, step 100 (integer)
  - `{roles}`: 10 to 100, step 10 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{horizons}`: 1 to 3, step 1 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)
  - `{decisions}`: 5 to 20, step 5 (integer)
  - `{ttf_before}`: 45 to 90, step 5 (integer)
  - `{ttf_after}`: 20 to 40, step 5 (integer)

### DATA-0180
**Role:** data-engineer | **Theme:** infrastructure-as-code-data | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Terraform, infrastructure as code, data infrastructure, IaC, cloud provisioning, data platform automation

**Scope:** infrastructure-as-code using Terraform for a data platform spanning {resources} cloud resources across {environments} environments and {regions} regions, automating provisioning and configuration management
**Result:** reducing environment provisioning time from {before} days to {after} hours and achieving {drift}% infrastructure drift elimination across managed resources

**Variations:**
- **A (Standard):** Implemented Terraform IaC for {resources} resources across {environments} environments and {regions} regions, cutting provisioning from {before} days to {after} hours and eliminating {drift}% of infrastructure drift.
- **B (Result-first):** Reduced provisioning from {before} days to {after} hours and eliminated {drift}% of drift by implementing Terraform for {resources} resources across {environments} environments.
- **C (Impact-led):** Cut provisioning from {before} days to {after} hours and eliminated {drift}% of drift; implemented Terraform IaC for {resources} resources across {environments} environments and {regions} regions.
- **D (Concise):** Implemented Terraform for {resources} resources across {environments} environments and {regions} regions, provisioning from {before}d to {after}h, {drift}% drift eliminated.

**Variables:**
  - `{resources}`: 50 to 500, step 50 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{regions}`: 2 to 6, step 1 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{drift}`: 80 to 100, step 5 (percentage)

### DATA-0181
**Role:** data-analyst | **Theme:** media-mix-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** media mix modeling, MMM, marketing effectiveness, channel ROI, Bayesian MMM, spend optimization

**Scope:** a Bayesian media mix model covering ${budget}M in annual marketing spend across {channels} channels and {years} years of weekly data, with scenario planning for {scenarios} budget allocation scenarios
**Result:** identifying {reallocation}% reallocation opportunity that improved blended marketing ROI from {before}x to {after}x without increasing total spend

**Variations:**
- **A (Standard):** Built Bayesian MMM for ${budget}M spend across {channels} channels and {years} years of data with {scenarios} scenarios, identifying {reallocation}% reallocation opportunity that improved ROI from {before}x to {after}x.
- **B (Result-first):** Improved marketing ROI from {before}x to {after}x without increased spend by building Bayesian MMM for ${budget}M across {channels} channels identifying {reallocation}% reallocation.
- **C (Impact-led):** Improved ROI from {before}x to {after}x without increased spend; built Bayesian MMM for ${budget}M across {channels} channels and {years} years with {scenarios} allocation scenarios.
- **D (Concise):** Built Bayesian MMM for ${budget}M across {channels} channels and {years} years, {reallocation}% reallocation, ROI from {before}x to {after}x.

**Variables:**
  - `{budget}`: 5 to 500, step 5 (currency)
  - `{channels}`: 5 to 20, step 5 (integer)
  - `{years}`: 2 to 5, step 1 (integer)
  - `{scenarios}`: 5 to 20, step 5 (integer)
  - `{reallocation}`: 10 to 40, step 5 (percentage)
  - `{before}`: 2 to 5, step 0.5 (integer)
  - `{after}`: 5 to 12, step 0.5 (integer)

### DATA-0182
**Role:** data-engineer | **Theme:** data-observability-custom | **Seniority:** mid | **Verb Context:** systems
**Keywords:** custom data observability, data monitors, anomaly thresholds, data alerting, data health, observability framework

**Scope:** a custom data observability framework with {monitors} automated monitors covering volume, schema, distribution, and freshness checks across {tables} critical tables, with PagerDuty alerting for {teams} on-call teams
**Result:** reducing mean time to detect data incidents from {before} hours to {after} minutes and cutting data-related on-call pages from {pages_before} to {pages_after} per month

**Variations:**
- **A (Standard):** Built custom observability with {monitors} monitors across {tables} tables with PagerDuty alerting, cutting MTTD from {before} hours to {after} minutes and on-call pages from {pages_before} to {pages_after}/month.
- **B (Result-first):** Reduced MTTD from {before} hours to {after} minutes and cut on-call pages from {pages_before} to {pages_after}/month by building {monitors} monitors across {tables} tables.
- **C (Impact-led):** Cut MTTD from {before} hours to {after} minutes and on-call pages from {pages_before} to {pages_after}/month; built {monitors} observability monitors across {tables} tables with PagerDuty alerting.
- **D (Concise):** Built {monitors} observability monitors across {tables} tables, MTTD from {before}h to {after}min, on-call pages from {pages_before} to {pages_after}/month.

**Variables:**
  - `{monitors}`: 50 to 2000, step 50 (integer)
  - `{tables}`: 100 to 5000, step 100 (integer)
  - `{teams}`: 2 to 10, step 1 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 5 to 30, step 5 (integer)
  - `{pages_before}`: 20 to 100, step 10 (integer)
  - `{pages_after}`: 2 to 8, step 2 (integer)

### DATA-0183
**Role:** data-scientist | **Theme:** uplift-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** uplift modeling, incremental effect, treatment effect, causal ML, heterogeneous treatment, true lift

**Scope:** an uplift model estimating heterogeneous treatment effects for {interventions} marketing interventions across {customers}K customers using {features} features, segmenting customers into {segments} treatment response segments
**Result:** improving campaign incremental lift by {lift}% over random targeting and reducing wasted outreach spend by ${savings}K per campaign

**Variations:**
- **A (Standard):** Built uplift model for {interventions} interventions across {customers}K customers on {features} features, improving incremental lift {lift}% over random targeting and saving ${savings}K in outreach per campaign.
- **B (Result-first):** Improved incremental lift {lift}% over random targeting and saved ${savings}K per campaign by building uplift model for {interventions} interventions across {customers}K customers.
- **C (Impact-led):** Improved lift {lift}% over random targeting and saved ${savings}K per campaign; built uplift model for {interventions} interventions across {customers}K customers on {features} features.
- **D (Concise):** Built uplift model for {interventions} interventions across {customers}K customers on {features} features, lift up {lift}%, ${savings}K outreach savings per campaign.

**Variables:**
  - `{interventions}`: 3 to 10, step 1 (integer)
  - `{customers}`: 10 to 1000, step 10 (integer)
  - `{features}`: 20 to 200, step 20 (integer)
  - `{segments}`: 4 to 8, step 1 (integer)
  - `{lift}`: 15 to 50, step 5 (percentage)
  - `{savings}`: 50 to 2000, step 50 (currency)

### DATA-0184
**Role:** bi-analyst | **Theme:** channel-performance | **Seniority:** junior | **Verb Context:** content
**Keywords:** channel analytics, digital analytics, channel performance, cross-channel reporting, omnichannel analytics

**Scope:** cross-channel performance dashboards tracking {metrics} KPIs across {channels} digital and offline channels for {campaigns}K campaigns per year, with automated weekly reporting for {stakeholders} marketing stakeholders
**Result:** replacing {manual_hours} hours of manual weekly reporting and enabling {stakeholders} stakeholders to monitor performance in real time

**Variations:**
- **A (Standard):** Built cross-channel dashboards for {channels} channels and {campaigns}K campaigns tracking {metrics} KPIs, replacing {manual_hours} manual weekly hours and enabling {stakeholders} stakeholders to monitor in real time.
- **B (Result-first):** Replaced {manual_hours} manual weekly hours and enabled {stakeholders} real-time monitoring by building cross-channel dashboards for {channels} channels tracking {metrics} KPIs.
- **C (Impact-led):** Replaced {manual_hours} manual weekly hours and enabled real-time monitoring for {stakeholders} stakeholders; built cross-channel dashboards for {channels} channels and {campaigns}K campaigns.
- **D (Concise):** Built cross-channel dashboards for {channels} channels and {campaigns}K campaigns tracking {metrics} KPIs, {manual_hours} manual hours replaced, {stakeholders} stakeholders monitoring in real time.

**Variables:**
  - `{metrics}`: 20 to 60, step 10 (integer)
  - `{channels}`: 5 to 15, step 5 (integer)
  - `{campaigns}`: 1 to 100, step 5 (integer)
  - `{stakeholders}`: 5 to 30, step 5 (integer)
  - `{manual_hours}`: 5 to 30, step 5 (integer)

### DATA-0185
**Role:** data-engineer | **Theme:** change-data-management | **Seniority:** mid | **Verb Context:** systems
**Keywords:** slowly changing dimensions, SCD Type 2, historical tracking, dimension history, temporal data, versioned records

**Scope:** slowly changing dimension management for {dimensions} Type 2 SCD tables covering {records}M entity records with full history, supporting {queries}K daily historical queries for {consumers} analytical consumers
**Result:** enabling {years} years of entity history for analytical queries and reducing SCD-related data discrepancies from {before} per month to {after} per quarter

**Variations:**
- **A (Standard):** Implemented SCD Type 2 for {dimensions} dimension tables and {records}M records, enabling {years} years of history for {queries}K daily queries and cutting discrepancies from {before}/month to {after}/quarter.
- **B (Result-first):** Enabled {years} years of entity history and cut discrepancies from {before}/month to {after}/quarter by implementing SCD Type 2 for {dimensions} dimensions and {records}M records.
- **C (Impact-led):** Enabled {years} years of history and cut discrepancies from {before}/month to {after}/quarter; implemented SCD Type 2 for {dimensions} dimensions and {records}M records serving {queries}K daily queries.
- **D (Concise):** Implemented SCD Type 2 for {dimensions} dimensions and {records}M records, {years} years of history enabled, discrepancies from {before}/month to {after}/quarter.

**Variables:**
  - `{dimensions}`: 10 to 100, step 10 (integer)
  - `{records}`: 1 to 500, step 10 (integer)
  - `{queries}`: 10 to 200, step 10 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{years}`: 3 to 10, step 1 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### DATA-0186
**Role:** data-analyst | **Theme:** supply-demand-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** supply demand analytics, capacity analytics, utilization analytics, bottleneck analysis, throughput analytics

**Scope:** a supply-demand analytics platform tracking {metrics} capacity and utilization metrics across {nodes} supply nodes and {demand_sources} demand sources, with imbalance alerting and scenario modeling
**Result:** reducing supply-demand imbalance incidents from {before} per month to {after} per quarter and improving overall utilization from {util_before}% to {util_after}%

**Variations:**
- **A (Standard):** Built supply-demand analytics for {nodes} nodes and {demand_sources} sources tracking {metrics} metrics, cutting imbalance incidents from {before}/month to {after}/quarter and improving utilization from {util_before}% to {util_after}%.
- **B (Result-first):** Reduced imbalance incidents from {before}/month to {after}/quarter and improved utilization from {util_before}% to {util_after}% by building analytics across {nodes} nodes and {demand_sources} sources.
- **C (Impact-led):** Cut imbalance incidents from {before}/month to {after}/quarter and improved utilization from {util_before}% to {util_after}%; built supply-demand analytics for {nodes} nodes and {demand_sources} sources.
- **D (Concise):** Built supply-demand analytics for {nodes} nodes and {demand_sources} sources with {metrics} metrics, imbalances from {before}/month to {after}/quarter, utilization from {util_before}% to {util_after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 10 (integer)
  - `{nodes}`: 10 to 200, step 10 (integer)
  - `{demand_sources}`: 5 to 30, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)
  - `{util_before}`: 50 to 70, step 5 (percentage)
  - `{util_after}`: 80 to 95, step 5 (percentage)

### DATA-0187
**Role:** ml-engineer | **Theme:** feature-engineering | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature engineering, feature selection, feature transformation, automated feature engineering, Featuretools, feature pipeline

**Scope:** a feature engineering pipeline using Featuretools automated deep feature synthesis across {entities} entity types and {datasets} datasets, generating {features}K candidate features and selecting {selected} predictive features per model
**Result:** improving average model performance by {improvement}% over manual feature engineering baselines and reducing time-to-feature by {reduction}%

**Variations:**
- **A (Standard):** Built Featuretools feature pipeline across {entities} entity types and {datasets} datasets generating {features}K candidates and selecting {selected} features per model, improving performance {improvement}% and cutting time-to-feature {reduction}%.
- **B (Result-first):** Improved model performance {improvement}% and cut time-to-feature {reduction}% by building Featuretools pipeline generating {features}K features across {entities} types and {datasets} datasets.
- **C (Impact-led):** Improved performance {improvement}% and cut time-to-feature {reduction}%; built Featuretools pipeline generating {features}K features across {entities} entity types and {datasets} datasets.
- **D (Concise):** Built Featuretools pipeline across {entities} types and {datasets} datasets generating {features}K candidates, {selected} selected/model, performance up {improvement}%, time-to-feature down {reduction}%.

**Variables:**
  - `{entities}`: 3 to 15, step 3 (integer)
  - `{datasets}`: 5 to 30, step 5 (integer)
  - `{features}`: 1 to 100, step 5 (integer)
  - `{selected}`: 10 to 200, step 10 (integer)
  - `{improvement}`: 5 to 25, step 5 (percentage)
  - `{reduction}`: 30 to 70, step 5 (percentage)

### DATA-0188
**Role:** data-analyst | **Theme:** energy-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** energy analytics, consumption monitoring, sustainability analytics, carbon analytics, utility analytics, ESG metrics

**Scope:** an energy and sustainability analytics platform tracking {metrics} consumption metrics across {facilities} facilities and {meters}K smart meters, reporting against {targets} ESG targets with automated variance analysis
**Result:** identifying ${savings}K in annual energy savings and reducing carbon emissions reporting preparation time from {before} days to {after} hours

**Variations:**
- **A (Standard):** Built energy analytics for {facilities} facilities and {meters}K meters tracking {metrics} metrics against {targets} ESG targets, identifying ${savings}K in savings and cutting emissions reporting from {before} days to {after} hours.
- **B (Result-first):** Identified ${savings}K in savings and cut emissions reporting from {before} days to {after} hours by building energy analytics for {facilities} facilities and {meters}K meters.
- **C (Impact-led):** Identified ${savings}K in savings and cut emissions reporting from {before} days to {after} hours; built energy analytics for {facilities} facilities and {meters}K meters tracking {metrics} ESG metrics.
- **D (Concise):** Built energy analytics for {facilities} facilities and {meters}K meters across {metrics} metrics, ${savings}K savings identified, emissions reporting from {before}d to {after}h.

**Variables:**
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{facilities}`: 5 to 200, step 5 (integer)
  - `{meters}`: 1 to 100, step 5 (integer)
  - `{targets}`: 5 to 20, step 5 (integer)
  - `{savings}`: 50 to 2000, step 50 (currency)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 1 to 4, step 1 (integer)

### DATA-0189
**Role:** data-engineer | **Theme:** replication-lag | **Seniority:** mid | **Verb Context:** systems
**Keywords:** replication lag, read replica, database replication, lag monitoring, replica health, read scaling

**Scope:** replication lag monitoring and optimization for a PostgreSQL read-replica cluster with {replicas} replicas serving {qps}K queries per second, implementing lag alerting and automated replica health checks
**Result:** reducing average replication lag from {before}ms to {after}ms and eliminating {stale}% of stale-read incidents affecting {consumers} downstream consumers

**Variations:**
- **A (Standard):** Optimized PostgreSQL replication for {replicas} replicas at {qps}K QPS, reducing average lag from {before}ms to {after}ms and eliminating {stale}% of stale-read incidents for {consumers} consumers.
- **B (Result-first):** Reduced replication lag from {before}ms to {after}ms and eliminated {stale}% of stale-read incidents by optimizing {replicas} replicas at {qps}K QPS.
- **C (Impact-led):** Cut replication lag from {before}ms to {after}ms and eliminated {stale}% of stale reads; optimized {replicas} PostgreSQL replicas at {qps}K QPS with automated health checks.
- **D (Concise):** Optimized {replicas} PostgreSQL replicas at {qps}K QPS, lag from {before}ms to {after}ms, {stale}% stale-read incidents eliminated for {consumers} consumers.

**Variables:**
  - `{replicas}`: 2 to 10, step 1 (integer)
  - `{qps}`: 1 to 100, step 5 (integer)
  - `{before}`: 500 to 5000, step 500 (integer)
  - `{after}`: 10 to 100, step 10 (integer)
  - `{stale}`: 70 to 100, step 5 (percentage)
  - `{consumers}`: 5 to 50, step 5 (integer)

### DATA-0190
**Role:** data-scientist | **Theme:** document-classification | **Seniority:** mid | **Verb Context:** systems
**Keywords:** document classification, text classification, BERT, document routing, contract classification, intake classification

**Scope:** a document classification model using BERT fine-tuned on {documents}K labeled documents across {classes} categories, integrated into a {volume}K daily document intake workflow with {confidence} confidence thresholds
**Result:** automating {automation}% of document routing decisions and reducing manual classification effort from {before} FTE hours to {after} FTE hours per week

**Variations:**
- **A (Standard):** Fine-tuned BERT document classifier on {documents}K examples across {classes} categories at {volume}K daily intake, automating {automation}% of routing and cutting manual effort from {before} to {after} FTE hours/week.
- **B (Result-first):** Automated {automation}% of routing and cut manual effort from {before} to {after} FTE hours/week by fine-tuning BERT across {classes} categories on {documents}K documents.
- **C (Impact-led):** Automated {automation}% of routing and cut manual effort from {before} to {after} FTE hours/week; fine-tuned BERT on {documents}K documents across {classes} categories at {volume}K daily intake.
- **D (Concise):** Fine-tuned BERT on {documents}K docs across {classes} categories at {volume}K daily intake, {automation}% routing automated, manual effort from {before} to {after} FTE hours/week.

**Variables:**
  - `{documents}`: 10 to 500, step 10 (integer)
  - `{classes}`: 5 to 50, step 5 (integer)
  - `{volume}`: 1 to 100, step 5 (integer)
  - `{confidence}`: 80 to 98, step 2 (percentage)
  - `{automation}`: 60 to 95, step 5 (percentage)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0191
**Role:** bi-analyst | **Theme:** cross-functional-reporting | **Seniority:** mid | **Verb Context:** content
**Keywords:** cross-functional reporting, OKR reporting, business review, quarterly reporting, leadership reporting, business health

**Scope:** a cross-functional business review reporting suite for {executives} C-suite executives and {teams} business teams, tracking {okrs} OKRs across {functions} functional areas with automated weekly and monthly cadences
**Result:** reducing executive report preparation time from {before} hours to {after} hours per cycle and achieving {adoption}% OKR tracking adoption across covered functions

**Variations:**
- **A (Standard):** Built cross-functional reporting suite for {executives} executives across {functions} functions tracking {okrs} OKRs, cutting preparation from {before} to {after} hours per cycle and achieving {adoption}% OKR adoption.
- **B (Result-first):** Reduced preparation from {before} to {after} hours per cycle and achieved {adoption}% OKR adoption by building reporting for {executives} executives across {functions} functions.
- **C (Impact-led):** Cut preparation from {before} to {after} hours per cycle and achieved {adoption}% OKR adoption; built cross-functional suite for {executives} executives tracking {okrs} OKRs across {functions} functions.
- **D (Concise):** Built cross-functional reporting for {executives} executives across {functions} functions and {okrs} OKRs, prep from {before} to {after}h per cycle, {adoption}% adoption.

**Variables:**
  - `{executives}`: 3 to 10, step 1 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{okrs}`: 20 to 100, step 20 (integer)
  - `{functions}`: 5 to 15, step 5 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{adoption}`: 70 to 100, step 5 (percentage)

### DATA-0192
**Role:** data-engineer | **Theme:** spark-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Spark optimization, Spark tuning, shuffle optimization, broadcast join, Spark performance, executor configuration

**Scope:** a Spark performance optimization initiative across {jobs} production jobs and {pipelines} pipelines on a {node}-node cluster, tuning shuffle partitions, broadcast thresholds, and executor configuration
**Result:** reducing average job runtime from {before} hours to {after} minutes and cutting cluster compute cost by ${savings}K per month

**Variations:**
- **A (Standard):** Optimized {jobs} Spark jobs and {pipelines} pipelines on a {node}-node cluster via shuffle and executor tuning, reducing average runtime from {before} hours to {after} minutes and saving ${savings}K/month.
- **B (Result-first):** Reduced runtime from {before} hours to {after} minutes and saved ${savings}K/month by tuning {jobs} Spark jobs across shuffle, broadcast, and executor settings.
- **C (Impact-led):** Cut runtime from {before} hours to {after} minutes and saved ${savings}K/month; optimized {jobs} Spark jobs and {pipelines} pipelines via shuffle and executor tuning on {node}-node cluster.
- **D (Concise):** Optimized {jobs} Spark jobs and {pipelines} pipelines on {node}-node cluster, runtime from {before}h to {after}min, ${savings}K/month saved.

**Variables:**
  - `{jobs}`: 20 to 200, step 20 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{node}`: 10 to 200, step 10 (integer)
  - `{before}`: 2 to 12, step 2 (integer)
  - `{after}`: 10 to 45, step 5 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0193
**Role:** data-analyst | **Theme:** patient-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** patient analytics, population health, care gap analytics, patient risk stratification, panel management, chronic disease analytics

**Scope:** a population health analytics platform stratifying {patients}K patients across {risk_tiers} risk tiers and {conditions} chronic conditions, integrating EHR and claims data to surface {care_gaps}K care gap opportunities
**Result:** closing {closed}% of identified care gaps and contributing to a {quality}% improvement in HEDIS quality measure scores

**Variations:**
- **A (Standard):** Built population health analytics stratifying {patients}K patients across {risk_tiers} tiers and {conditions} conditions, surfacing {care_gaps}K gaps and closing {closed}% to improve HEDIS scores {quality}%.
- **B (Result-first):** Closed {closed}% of care gaps and improved HEDIS scores {quality}% by building population health analytics for {patients}K patients across {risk_tiers} tiers.
- **C (Impact-led):** Closed {closed}% of gaps and improved HEDIS scores {quality}%; built population analytics stratifying {patients}K patients across {risk_tiers} tiers and {conditions} conditions.
- **D (Concise):** Built population analytics for {patients}K patients across {risk_tiers} tiers and {conditions} conditions, {care_gaps}K gaps surfaced, {closed}% closed, HEDIS up {quality}%.

**Variables:**
  - `{patients}`: 10 to 500, step 10 (integer)
  - `{risk_tiers}`: 3 to 5, step 1 (integer)
  - `{conditions}`: 5 to 30, step 5 (integer)
  - `{care_gaps}`: 1 to 100, step 5 (integer)
  - `{closed}`: 30 to 70, step 5 (percentage)
  - `{quality}`: 5 to 25, step 5 (percentage)

### DATA-0194
**Role:** data-engineer | **Theme:** data-hub-integration | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data integration hub, master data management, data hub, enterprise integration, canonical data model, MDM

**Scope:** a data integration hub connecting {systems} enterprise systems across {domains} business domains using a canonical data model with {entities} master entity types and {mappings} source-to-hub field mappings
**Result:** reducing point-to-point integrations from {before} to {after} and cutting integration maintenance effort by {reduction}% annually

**Variations:**
- **A (Standard):** Built integration hub connecting {systems} systems across {domains} domains with {entities} master entities and {mappings} mappings, reducing point-to-point integrations from {before} to {after} and cutting maintenance {reduction}%.
- **B (Result-first):** Reduced point-to-point integrations from {before} to {after} and cut maintenance {reduction}% by building hub connecting {systems} systems with {entities} master entities.
- **C (Impact-led):** Cut point-to-point integrations from {before} to {after} and maintenance {reduction}%; built integration hub for {systems} systems across {domains} domains with {entities} master entities.
- **D (Concise):** Built integration hub for {systems} systems across {domains} domains with {entities} master entities, point-to-point from {before} to {after}, maintenance down {reduction}%.

**Variables:**
  - `{systems}`: 10 to 100, step 10 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{entities}`: 10 to 50, step 10 (integer)
  - `{mappings}`: 100 to 2000, step 100 (integer)
  - `{before}`: 50 to 500, step 50 (integer)
  - `{after}`: 10 to 50, step 10 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0195
**Role:** data-scientist | **Theme:** geospatial-ml | **Seniority:** senior | **Verb Context:** systems
**Keywords:** geospatial ML, spatial features, geo-clustering, location prediction, spatial autocorrelation, GIS machine learning

**Scope:** a geospatial ML model incorporating {spatial_features} location-derived features and spatial autocorrelation for a {task} prediction task across {locations}M spatial records covering {regions} geographic regions
**Result:** improving prediction performance by {improvement}% over non-spatial baselines and enabling {decisions} location-informed decisions per month

**Variations:**
- **A (Standard):** Built geospatial ML for {task} with {spatial_features} spatial features across {locations}M records and {regions} regions, improving performance {improvement}% over baselines and enabling {decisions} location decisions monthly.
- **B (Result-first):** Improved prediction {improvement}% over non-spatial baselines and enabled {decisions} monthly decisions by building geospatial ML for {task} across {locations}M records.
- **C (Impact-led):** Improved performance {improvement}% and enabled {decisions} monthly decisions; built geospatial ML for {task} with {spatial_features} features across {locations}M records and {regions} regions.
- **D (Concise):** Built geospatial ML for {task} with {spatial_features} features across {locations}M records and {regions} regions, performance up {improvement}%, {decisions} location decisions monthly.

**Variables:**
  - `{spatial_features}`: 10 to 100, step 10 (integer)
  - `{locations}`: 1 to 500, step 10 (integer)
  - `{regions}`: 5 to 100, step 5 (integer)
  - `{improvement}`: 10 to 35, step 5 (percentage)
  - `{decisions}`: 5 to 30, step 5 (integer)

### DATA-0196
**Role:** bi-analyst | **Theme:** executive-scorecard | **Seniority:** senior | **Verb Context:** content
**Keywords:** executive scorecard, balanced scorecard, KPI scorecard, strategic metrics, board reporting, leadership metrics

**Scope:** a company-wide executive scorecard for a {size}-person business tracking {metrics} strategic KPIs across {perspectives} balanced scorecard perspectives and {business_units} business units, refreshed on a {cadence} basis
**Result:** replacing {manual_reports} manual board reports and reducing leadership decision latency from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Built executive scorecard for a {size}-person business tracking {metrics} KPIs across {perspectives} perspectives and {business_units} units, replacing {manual_reports} board reports and cutting decision latency from {before} weeks to {after} days.
- **B (Result-first):** Replaced {manual_reports} board reports and cut decision latency from {before} weeks to {after} days by building scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units.
- **C (Impact-led):** Replaced {manual_reports} board reports and cut decision latency from {before} weeks to {after} days; built executive scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units.
- **D (Concise):** Built executive scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units, {manual_reports} reports replaced, decision latency from {before}wk to {after}d.

**Variables:**
  - `{size}`: 100 to 10000, step 100 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{perspectives}`: 4 to 6, step 1 (integer)
  - `{business_units}`: 3 to 15, step 3 (integer)
  - `{manual_reports}`: 5 to 30, step 5 (integer)
  - `{before}`: 2 to 6, step 1 (integer)
  - `{after}`: 1 to 2, step 1 (integer)

### DATA-0197
**Role:** data-engineer | **Theme:** lake-formation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** AWS Lake Formation, data lake governance, Lake Formation permissions, row filters, column filters, tag-based access

**Scope:** an AWS Lake Formation governance layer across a data lake with {tables}K tables and {users}K users, implementing tag-based access control with {tags} data classification tags and {policies} permission policies
**Result:** achieving {compliance}% fine-grained access compliance and eliminating {violations} unauthorized access incidents per quarter

**Variations:**
- **A (Standard):** Deployed Lake Formation governance for {tables}K tables and {users}K users with {tags} tags and {policies} policies, achieving {compliance}% compliance and eliminating {violations} unauthorized incidents/quarter.
- **B (Result-first):** Achieved {compliance}% compliance and eliminated {violations} incidents/quarter by deploying Lake Formation for {tables}K tables and {users}K users with tag-based access control.
- **C (Impact-led):** Reached {compliance}% compliance and eliminated {violations} incidents/quarter; deployed Lake Formation governance for {tables}K tables and {users}K users with {tags} tags and {policies} policies.
- **D (Concise):** Deployed Lake Formation for {tables}K tables and {users}K users with {tags} tags and {policies} policies, {compliance}% compliance, {violations} incidents eliminated/quarter.

**Variables:**
  - `{tables}`: 1 to 100, step 5 (integer)
  - `{users}`: 10 to 500, step 10 (integer)
  - `{tags}`: 10 to 100, step 10 (integer)
  - `{policies}`: 50 to 500, step 50 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{violations}`: 5 to 30, step 5 (integer)

### DATA-0198
**Role:** data-analyst | **Theme:** returns-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** returns analytics, return rate, refund analytics, reverse logistics, returns forecasting, NPS return correlation

**Scope:** a returns analytics platform tracking {metrics} return metrics across {categories} product categories and {reasons} return reason codes, covering {returns}K annual returns and ${value}M in return value
**Result:** identifying {patterns} return patterns that informed product and packaging improvements reducing return rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes tracking {metrics} metrics, identifying {patterns} patterns that reduced return rate from {before}% to {after}%.
- **B (Result-first):** Reduced return rate from {before}% to {after}% by analyzing {returns}K returns across {categories} categories and identifying {patterns} patterns.
- **C (Impact-led):** Reduced return rate from {before}% to {after}%; built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes tracking {metrics} metrics.
- **D (Concise):** Built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes, {patterns} patterns identified, rate from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{reasons}`: 10 to 50, step 10 (integer)
  - `{returns}`: 10 to 1000, step 10 (integer)
  - `{value}`: 1 to 100, step 5 (currency)
  - `{patterns}`: 3 to 10, step 1 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 3 to 9, step 1 (percentage)

### DATA-0199
**Role:** ml-engineer | **Theme:** ml-ci-cd | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML CI/CD, model deployment pipeline, continuous training, automated retraining, model pipeline automation, GitOps ML

**Scope:** a CI/CD pipeline for ML covering training, evaluation, and deployment for {models} production models, with automated retraining triggers, evaluation gates, and rollback for {teams} data science teams
**Result:** reducing model deployment cycle from {before} weeks to {after} days and enabling {deployments} safe deployments per month with zero rollback incidents

**Variations:**
- **A (Standard):** Built ML CI/CD for {models} models across training, evaluation, and deployment for {teams} teams, cutting deployment cycle from {before} weeks to {after} days and enabling {deployments} safe monthly deployments.
- **B (Result-first):** Reduced deployment cycle from {before} weeks to {after} days and enabled {deployments} safe monthly deployments by building ML CI/CD for {models} models across {teams} teams.
- **C (Impact-led):** Cut deployment cycle from {before} weeks to {after} days and enabled {deployments} safe monthly deployments; built ML CI/CD for {models} models with automated retraining and evaluation gates.
- **D (Concise):** Built ML CI/CD for {models} models and {teams} teams, deployment cycle from {before}wk to {after}d, {deployments} safe deployments/month.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{deployments}`: 10 to 100, step 10 (integer)

### DATA-0200
**Role:** data-analyst | **Theme:** b2b-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** B2B analytics, account analytics, firmographic analytics, ICP analytics, account scoring, B2B segmentation

**Scope:** a B2B account analytics platform scoring {accounts}K accounts against {criteria} ICP criteria across {firmographic_dims} firmographic dimensions, integrating intent data and product usage signals
**Result:** improving sales-qualified account conversion rate from {before}% to {after}% and reducing average sales cycle length from {cycle_before} to {cycle_after} days

**Variations:**
- **A (Standard):** Built B2B account analytics scoring {accounts}K accounts on {criteria} ICP criteria across {firmographic_dims} dimensions, improving SQA conversion from {before}% to {after}% and cutting cycle from {cycle_before} to {cycle_after} days.
- **B (Result-first):** Improved SQA conversion from {before}% to {after}% and cut cycle from {cycle_before} to {cycle_after} days by building B2B analytics scoring {accounts}K accounts on {criteria} ICP criteria.
- **C (Impact-led):** Improved SQA conversion from {before}% to {after}% and cut cycle from {cycle_before} to {cycle_after} days; built B2B analytics scoring {accounts}K accounts on {criteria} criteria across {firmographic_dims} dimensions.
- **D (Concise):** Built B2B analytics for {accounts}K accounts on {criteria} ICP criteria across {firmographic_dims} dims, SQA conversion from {before}% to {after}%, cycle from {cycle_before} to {cycle_after} days.

**Variables:**
  - `{accounts}`: 1 to 100, step 5 (integer)
  - `{criteria}`: 5 to 20, step 5 (integer)
  - `{firmographic_dims}`: 5 to 20, step 5 (integer)
  - `{before}`: 5 to 15, step 2 (percentage)
  - `{after}`: 20 to 40, step 5 (percentage)
  - `{cycle_before}`: 60 to 180, step 15 (integer)
  - `{cycle_after}`: 30 to 80, step 10 (integer)

### DATA-0201
**Role:** data-engineer | **Theme:** data-catalog-governance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** data catalog, Collibra, Alation, business glossary, data stewardship, governed data catalog

**Scope:** a Collibra data catalog and business glossary for a {size}-person organization, cataloging {assets}K data assets, defining {terms}K business glossary terms, and assigning {stewards} data stewards across {domains} domains
**Result:** increasing governed data asset coverage from {before}% to {after}% and reducing cross-team definition disputes from {disputes_before} to {disputes_after} per month

**Variations:**
- **A (Standard):** Deployed Collibra catalog for {assets}K assets and {terms}K glossary terms across {domains} domains with {stewards} stewards, growing coverage from {before}% to {after}% and cutting disputes from {disputes_before} to {disputes_after}/month.
- **B (Result-first):** Grew coverage from {before}% to {after}% and cut disputes from {disputes_before} to {disputes_after}/month by deploying Collibra for {assets}K assets and {terms}K terms across {domains} domains.
- **C (Impact-led):** Grew coverage from {before}% to {after}% and cut disputes from {disputes_before} to {disputes_after}/month; deployed Collibra for {assets}K assets and {terms}K glossary terms across {domains} domains.
- **D (Concise):** Deployed Collibra for {assets}K assets and {terms}K terms across {domains} domains with {stewards} stewards, coverage from {before}% to {after}%, disputes from {disputes_before} to {disputes_after}/month.

**Variables:**
  - `{assets}`: 1 to 100, step 5 (integer)
  - `{terms}`: 1 to 50, step 5 (integer)
  - `{stewards}`: 10 to 100, step 10 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{before}`: 20 to 50, step 5 (percentage)
  - `{after}`: 75 to 99, step 5 (percentage)
  - `{disputes_before}`: 20 to 60, step 10 (integer)
  - `{disputes_after}`: 1 to 5, step 1 (integer)

### DATA-0202
**Role:** data-scientist | **Theme:** sensor-data-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sensor analytics, IoT analytics, time series, signal processing, predictive maintenance, sensor fusion

**Scope:** a sensor data analytics pipeline processing {sensors}K IoT sensors at {frequency} Hz sample frequency, applying signal processing and ML-based anomaly detection across {asset_types} asset types for predictive maintenance
**Result:** predicting {failures}% of equipment failures {lead_time} days before occurrence and reducing unplanned downtime from {before} hours to {after} hours per month

**Variations:**
- **A (Standard):** Built IoT sensor analytics for {sensors}K sensors at {frequency}Hz across {asset_types} asset types, predicting {failures}% of failures {lead_time} days early and cutting unplanned downtime from {before} to {after} hours/month.
- **B (Result-first):** Predicted {failures}% of failures {lead_time} days early and cut downtime from {before} to {after} hours/month by building IoT analytics for {sensors}K sensors across {asset_types} asset types.
- **C (Impact-led):** Predicted {failures}% of failures {lead_time} days early and cut downtime from {before} to {after} hours/month; built IoT analytics for {sensors}K sensors at {frequency}Hz across {asset_types} asset types.
- **D (Concise):** Built IoT analytics for {sensors}K sensors at {frequency}Hz across {asset_types} types, {failures}% of failures predicted {lead_time}d early, downtime from {before} to {after}h/month.

**Variables:**
  - `{sensors}`: 1 to 100, step 5 (integer)
  - `{frequency}`: 1 to 100, step 10 (integer)
  - `{asset_types}`: 3 to 15, step 3 (integer)
  - `{failures}`: 70 to 95, step 5 (percentage)
  - `{lead_time}`: 3 to 14, step 1 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0203
**Role:** bi-analyst | **Theme:** multi-currency-reporting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** multi-currency, FX reporting, currency conversion, consolidated reporting, FX impact, global reporting

**Scope:** a multi-currency financial reporting platform consolidating {entities} legal entities across {currencies} currencies with daily FX rate updates, supporting {reports} recurring reports for a ${revenue}M global business
**Result:** eliminating {errors} FX-related reporting errors per quarter and reducing consolidation cycle time from {before} days to {after} hours

**Variations:**
- **A (Standard):** Built multi-currency reporting for {entities} entities across {currencies} currencies with daily FX updates, eliminating {errors} quarterly FX errors and cutting consolidation from {before} days to {after} hours.
- **B (Result-first):** Eliminated {errors} quarterly FX errors and cut consolidation from {before} days to {after} hours by building multi-currency reporting for {entities} entities across {currencies} currencies.
- **C (Impact-led):** Eliminated {errors} FX errors/quarter and cut consolidation from {before} days to {after} hours; built multi-currency reporting for {entities} entities across {currencies} currencies for a ${revenue}M business.
- **D (Concise):** Built multi-currency reporting for {entities} entities across {currencies} currencies, {errors} FX errors eliminated/quarter, consolidation from {before}d to {after}h.

**Variables:**
  - `{entities}`: 5 to 50, step 5 (integer)
  - `{currencies}`: 3 to 30, step 3 (integer)
  - `{reports}`: 5 to 30, step 5 (integer)
  - `{revenue}`: 10 to 1000, step 50 (currency)
  - `{errors}`: 5 to 30, step 5 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 2 to 6, step 2 (integer)

### DATA-0204
**Role:** data-engineer | **Theme:** data-residency | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data residency, data sovereignty, GDPR, regional data storage, cross-border data, compliance architecture

**Scope:** a data residency architecture enforcing regional storage for {regions} jurisdictions covering {records}M records, implementing routing, tagging, and storage controls aligned to {regulations} data sovereignty regulations
**Result:** achieving {compliance}% residency compliance and enabling market entry into {markets} new regulated markets previously blocked by data residency requirements

**Variations:**
- **A (Standard):** Built data residency architecture for {regions} jurisdictions and {records}M records aligned to {regulations} regulations, achieving {compliance}% compliance and enabling entry into {markets} previously blocked markets.
- **B (Result-first):** Achieved {compliance}% residency compliance and enabled {markets} new market entries by building residency architecture for {regions} jurisdictions and {records}M records.
- **C (Impact-led):** Reached {compliance}% compliance and enabled {markets} new market entries; built data residency architecture for {regions} jurisdictions and {records}M records aligned to {regulations} regulations.
- **D (Concise):** Built data residency for {regions} jurisdictions and {records}M records aligned to {regulations} regulations, {compliance}% compliance, {markets} new markets enabled.

**Variables:**
  - `{regions}`: 2 to 10, step 1 (integer)
  - `{records}`: 1 to 500, step 10 (integer)
  - `{regulations}`: 2 to 5, step 1 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{markets}`: 2 to 10, step 1 (integer)

### DATA-0205
**Role:** data-analyst | **Theme:** digital-health-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** digital health analytics, app engagement, telehealth analytics, health outcomes, patient engagement, wearables analytics

**Scope:** a digital health analytics platform for a {users}K-user health app tracking {metrics} engagement and outcome metrics across {programs} care programs, integrating wearables data from {devices} device types
**Result:** identifying {interventions} engagement interventions that improved program completion rate from {before}% to {after}% and health outcome scores by {outcome}%

**Variations:**
- **A (Standard):** Built digital health analytics for {users}K users tracking {metrics} metrics across {programs} programs with {devices} device types, identifying {interventions} interventions that improved completion from {before}% to {after}% and outcomes {outcome}%.
- **B (Result-first):** Improved completion from {before}% to {after}% and outcomes {outcome}% by building digital health analytics for {users}K users across {programs} programs identifying {interventions} interventions.
- **C (Impact-led):** Improved completion from {before}% to {after}% and outcomes {outcome}%; built digital health analytics for {users}K users tracking {metrics} metrics across {programs} programs and {devices} device types.
- **D (Concise):** Built digital health analytics for {users}K users across {metrics} metrics, {programs} programs, and {devices} device types, completion from {before}% to {after}%, outcomes up {outcome}%.

**Variables:**
  - `{users}`: 10 to 500, step 10 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{programs}`: 3 to 15, step 3 (integer)
  - `{devices}`: 3 to 10, step 1 (integer)
  - `{interventions}`: 3 to 10, step 1 (integer)
  - `{before}`: 30 to 55, step 5 (percentage)
  - `{after}`: 60 to 85, step 5 (percentage)
  - `{outcome}`: 10 to 35, step 5 (percentage)

### DATA-0206
**Role:** data-engineer | **Theme:** data-pipeline-documentation | **Seniority:** mid | **Verb Context:** operations
**Keywords:** pipeline documentation, data dictionary, runbooks, data documentation, pipeline catalog, data onboarding

**Scope:** a pipeline documentation program creating runbooks, data dictionaries, and dependency maps for {pipelines} pipelines, {datasets} datasets, and {models} production models across {teams} data teams
**Result:** reducing new team member onboarding time from {before} weeks to {after} days and cutting time-to-resolve undocumented pipeline incidents from {inc_before} hours to {inc_after} minutes

**Variations:**
- **A (Standard):** Created documentation for {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams, cutting onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min.
- **B (Result-first):** Reduced onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min by documenting {pipelines} pipelines, {datasets} datasets, and {models} models.
- **C (Impact-led):** Cut onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min; documented {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams.
- **D (Concise):** Documented {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams, onboarding from {before}wk to {after}d, incident resolution from {inc_before}h to {inc_after}min.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{models}`: 5 to 50, step 5 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{inc_before}`: 4 to 24, step 4 (integer)
  - `{inc_after}`: 15 to 60, step 15 (integer)

### DATA-0207
**Role:** data-scientist | **Theme:** recommendation-ranking | **Seniority:** senior | **Verb Context:** systems
**Keywords:** recommendation ranking, two-stage ranking, candidate generation, learning to rank, LambdaMART, NDCG

**Scope:** a two-stage recommendation system with candidate generation retrieving {candidates}K items and a ranking model scoring across {features} features for {users}M users, serving {qps}K queries per second
**Result:** improving offline NDCG from {ndcg_before} to {ndcg_after} and increasing CTR from {ctr_before}% to {ctr_after}% in A/B testing

**Variations:**
- **A (Standard):** Built two-stage ranking with {candidates}K candidates and {features} ranking features for {users}M users at {qps}K QPS, improving NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}%.
- **B (Result-first):** Improved NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}% by building two-stage ranking for {users}M users at {qps}K QPS.
- **C (Impact-led):** Improved NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}%; built two-stage ranking with {candidates}K candidates and {features} features for {users}M users.
- **D (Concise):** Built two-stage ranking for {users}M users at {qps}K QPS, NDCG from {ndcg_before} to {ndcg_after}, CTR from {ctr_before}% to {ctr_after}%.

**Variables:**
  - `{candidates}`: 100 to 10000, step 100 (integer)
  - `{features}`: 20 to 500, step 20 (integer)
  - `{users}`: 1 to 100, step 5 (integer)
  - `{qps}`: 10 to 500, step 10 (integer)
  - `{ndcg_before}`: 0.5 to 0.65, step 0.05 (integer)
  - `{ndcg_after}`: 0.7 to 0.9, step 0.05 (integer)
  - `{ctr_before}`: 2 to 8, step 1 (percentage)
  - `{ctr_after}`: 8 to 20, step 2 (percentage)

### DATA-0208
**Role:** data-analyst | **Theme:** cohort-ltv | **Seniority:** mid | **Verb Context:** systems
**Keywords:** LTV analysis, cohort LTV, lifetime value modeling, customer value, acquisition economics, payback period

**Scope:** a cohort LTV analytics framework modeling 12, 24, and 36-month LTV across {cohorts} acquisition cohorts and {segments} customer segments, integrating acquisition cost data for CAC payback analysis
**Result:** improving LTV prediction accuracy by {accuracy}% and identifying {segments} high-LTV segments that informed ${budget}K in acquisition budget reallocation

**Variations:**
- **A (Standard):** Built cohort LTV framework across {cohorts} cohorts and {segments} segments with CAC payback analysis, improving LTV accuracy {accuracy}% and informing ${budget}K in budget reallocation.
- **B (Result-first):** Improved LTV accuracy {accuracy}% and informed ${budget}K in budget reallocation by building cohort LTV across {cohorts} cohorts and {segments} segments.
- **C (Impact-led):** Improved LTV accuracy {accuracy}% and informed ${budget}K in budget reallocation; built cohort LTV across {cohorts} cohorts and {segments} segments with CAC payback analysis.
- **D (Concise):** Built cohort LTV across {cohorts} cohorts and {segments} segments, {accuracy}% accuracy, ${budget}K budget reallocation informed.

**Variables:**
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{accuracy}`: 15 to 40, step 5 (percentage)
  - `{budget}`: 100 to 5000, step 100 (currency)

### DATA-0209
**Role:** data-engineer | **Theme:** async-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** async pipelines, asynchronous processing, queue-based pipeline, decoupled processing, message queue, async ETL

**Scope:** an asynchronous pipeline architecture using SQS and Lambda for {jobs} decoupled processing jobs, handling {throughput}K events per minute with dead-letter queues and retry logic for {consumers} downstream consumers
**Result:** achieving {uptime}% pipeline availability and reducing processing failures from {before}% to {after}% of total event volume

**Variations:**
- **A (Standard):** Built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min with DLQ and retry, achieving {uptime}% availability and cutting failures from {before}% to {after}% of volume.
- **B (Result-first):** Achieved {uptime}% availability and cut failures from {before}% to {after}% by building SQS/Lambda async pipeline for {jobs} jobs at {throughput}K events/min.
- **C (Impact-led):** Achieved {uptime}% availability and cut failures from {before}% to {after}%; built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min with DLQ and retry.
- **D (Concise):** Built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min, {uptime}% availability, failures from {before}% to {after}%.

**Variables:**
  - `{jobs}`: 10 to 100, step 10 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)
  - `{uptime}`: 99.9 to 99.999, step 0.01 (percentage)
  - `{before}`: 5 to 20, step 5 (percentage)
  - `{after}`: 0.1 to 1, step 0.1 (percentage)

### DATA-0210
**Role:** data-scientist | **Theme:** a-b-analysis-advanced | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Bayesian A/B testing, CUPED, variance reduction, sequential testing, peeking problem, experimentation statistics

**Scope:** an advanced experimentation statistics framework implementing CUPED variance reduction, sequential testing, and Bayesian inference for {experiments} experiments per quarter with {metrics} primary and guardrail metrics
**Result:** reducing required sample size by {sample_reduction}% through variance reduction and enabling {early}% of experiments to be called earlier without inflated Type I error

**Variations:**
- **A (Standard):** Implemented CUPED and sequential Bayesian testing for {experiments} quarterly experiments across {metrics} metrics, cutting required sample size {sample_reduction}% and enabling {early}% of experiments to be called earlier.
- **B (Result-first):** Reduced required sample size {sample_reduction}% and enabled {early}% earlier calls by implementing CUPED and sequential testing for {experiments} experiments.
- **C (Impact-led):** Cut sample size {sample_reduction}% and enabled {early}% earlier experiment calls; implemented CUPED, sequential testing, and Bayesian inference for {experiments} quarterly experiments across {metrics} metrics.
- **D (Concise):** Implemented CUPED and Bayesian sequential testing for {experiments} quarterly experiments across {metrics} metrics, sample size down {sample_reduction}%, {early}% earlier calls.

**Variables:**
  - `{experiments}`: 20 to 100, step 10 (integer)
  - `{metrics}`: 3 to 10, step 1 (integer)
  - `{sample_reduction}`: 20 to 50, step 5 (percentage)
  - `{early}`: 20 to 50, step 5 (percentage)

### DATA-0211
**Role:** bi-analyst | **Theme:** usage-based-billing-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** usage-based billing, metered billing, consumption analytics, usage analytics, billing analytics, UBB metrics

**Scope:** a usage-based billing analytics platform tracking {metrics} consumption metrics across {customers}K customers, {products} product lines, and {usage_types} usage dimensions with daily billing reconciliation
**Result:** reducing billing disputes from {before} per month to {after} per quarter and improving revenue recognition accuracy from {rev_before}% to {rev_after}%

**Variations:**
- **A (Standard):** Built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types tracking {metrics} metrics, cutting disputes from {before}/month to {after}/quarter and improving recognition from {rev_before}% to {rev_after}%.
- **B (Result-first):** Reduced disputes from {before}/month to {after}/quarter and improved recognition from {rev_before}% to {rev_after}% by building UBB analytics for {customers}K customers.
- **C (Impact-led):** Cut disputes from {before}/month to {after}/quarter and improved recognition from {rev_before}% to {rev_after}%; built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types.
- **D (Concise):** Built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types, disputes from {before}/month to {after}/quarter, recognition from {rev_before}% to {rev_after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{customers}`: 1 to 100, step 5 (integer)
  - `{products}`: 5 to 30, step 5 (integer)
  - `{usage_types}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 0 to 5, step 1 (integer)
  - `{rev_before}`: 85 to 95, step 5 (percentage)
  - `{rev_after}`: 98 to 100, step 1 (percentage)

### DATA-0212
**Role:** data-engineer | **Theme:** streaming-join | **Seniority:** senior | **Verb Context:** systems
**Keywords:** streaming join, stream-stream join, stream-table join, Flink join, windowed join, enrichment join

**Scope:** stream-stream and stream-table joins in Apache Flink across {streams} event streams and {lookup_tables} lookup tables, with watermark-based windowed joins for {use_cases} enrichment use cases at {throughput}K events per second
**Result:** reducing event enrichment latency from {before} seconds to {after}ms and eliminating {data_loss}% of late-data join failures

**Variations:**
- **A (Standard):** Built Flink stream joins across {streams} streams and {lookup_tables} tables for {use_cases} use cases at {throughput}K events/sec, cutting enrichment from {before}s to {after}ms and eliminating {data_loss}% of late-data failures.
- **B (Result-first):** Reduced enrichment from {before}s to {after}ms and eliminated {data_loss}% of late-data failures by building Flink stream joins across {streams} streams at {throughput}K events/sec.
- **C (Impact-led):** Cut enrichment from {before}s to {after}ms and eliminated {data_loss}% of late-data failures; built Flink joins across {streams} streams and {lookup_tables} tables at {throughput}K events/sec.
- **D (Concise):** Built Flink stream joins across {streams} streams and {lookup_tables} tables at {throughput}K events/sec, enrichment from {before}s to {after}ms, {data_loss}% late-data failures eliminated.

**Variables:**
  - `{streams}`: 3 to 20, step 3 (integer)
  - `{lookup_tables}`: 5 to 30, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{before}`: 5 to 30, step 5 (integer)
  - `{after}`: 10 to 200, step 10 (integer)
  - `{data_loss}`: 60 to 100, step 5 (percentage)

### DATA-0213
**Role:** data-analyst | **Theme:** clinical-trial-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** clinical trial analytics, CDISC, SDTM, ADaM, trial reporting, efficacy analytics, safety analytics

**Scope:** clinical trial analytics for a {phase} Phase {trial_phase} trial with {subjects} subjects across {sites} sites, building CDISC SDTM and ADaM datasets and {tables} efficacy and safety analysis tables for regulatory submission
**Result:** reducing data lock to submission package from {before} weeks to {after} weeks and achieving {accuracy}% clean submission with no major data queries

**Variations:**
- **A (Standard):** Built CDISC SDTM and ADaM datasets for a Phase {trial_phase} trial with {subjects} subjects across {sites} sites, producing {tables} analysis tables and reducing lock-to-submission from {before} to {after} weeks.
- **B (Result-first):** Reduced lock-to-submission from {before} to {after} weeks and achieved {accuracy}% clean submission by building SDTM and ADaM datasets for Phase {trial_phase} with {subjects} subjects.
- **C (Impact-led):** Cut lock-to-submission from {before} to {after} weeks and achieved {accuracy}% clean submission; built CDISC datasets for Phase {trial_phase} trial with {subjects} subjects across {sites} sites.
- **D (Concise):** Built CDISC SDTM and ADaM for Phase {trial_phase} trial with {subjects} subjects across {sites} sites, {tables} analysis tables, submission from {before} to {after} weeks.

**Variables:**
  - `{trial_phase}`: 1 to 3, step 1 (integer)
  - `{subjects}`: 50 to 5000, step 50 (integer)
  - `{sites}`: 5 to 200, step 5 (integer)
  - `{tables}`: 20 to 200, step 20 (integer)
  - `{before}`: 12 to 24, step 4 (integer)
  - `{after}`: 4 to 10, step 2 (integer)
  - `{accuracy}`: 95 to 100, step 1 (percentage)

### DATA-0214
**Role:** ml-engineer | **Theme:** synthetic-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** synthetic data, GAN, CTGAN, data synthesis, privacy-preserving data, synthetic dataset generation

**Scope:** a synthetic data generation system using CTGAN to produce {synthetic_records}M privacy-safe records from {source_records}M sensitive training records across {tables} tables for {use_cases} downstream use cases
**Result:** achieving {fidelity}% statistical fidelity to source data while eliminating re-identification risk and reducing compliance review cycles from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Built CTGAN synthetic data pipeline generating {synthetic_records}M records from {source_records}M across {tables} tables, achieving {fidelity}% fidelity and cutting compliance review from {before} weeks to {after} days.
- **B (Result-first):** Achieved {fidelity}% statistical fidelity and cut compliance review from {before} weeks to {after} days by building CTGAN pipeline generating {synthetic_records}M records from {source_records}M.
- **C (Impact-led):** Achieved {fidelity}% fidelity and cut compliance review from {before} weeks to {after} days; built CTGAN pipeline generating {synthetic_records}M records across {tables} tables for {use_cases} use cases.
- **D (Concise):** Built CTGAN pipeline generating {synthetic_records}M from {source_records}M across {tables} tables, {fidelity}% fidelity, compliance review from {before}wk to {after}d.

**Variables:**
  - `{synthetic_records}`: 1 to 500, step 10 (integer)
  - `{source_records}`: 1 to 500, step 10 (integer)
  - `{tables}`: 5 to 50, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{fidelity}`: 85 to 99, step 2 (percentage)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0215
**Role:** data-analyst | **Theme:** unit-economics-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** unit economics, contribution margin, CAC, LTV:CAC, payback period, gross margin per unit, cohort economics

**Scope:** a unit economics analytics framework modeling CAC, LTV, payback period, and contribution margin across {segments} acquisition segments, {channels} marketing channels, and {cohorts} historical cohorts for a ${revenue}M business
**Result:** identifying {channel_reduction}% of channels with negative LTV:CAC ratios and redeploying ${redeployed}K in spend to channels with {ltv_cac}x or better LTV:CAC

**Variations:**
- **A (Standard):** Built unit economics framework across {segments} segments, {channels} channels, and {cohorts} cohorts for a ${revenue}M business, identifying {channel_reduction}% negative-LTV channels and redeploying ${redeployed}K to {ltv_cac}x+ channels.
- **B (Result-first):** Identified {channel_reduction}% of negative-LTV channels and redeployed ${redeployed}K by building unit economics across {segments} segments and {channels} channels for a ${revenue}M business.
- **C (Impact-led):** Identified {channel_reduction}% of negative-LTV channels and redeployed ${redeployed}K; built unit economics framework across {segments} segments, {channels} channels, and {cohorts} cohorts for a ${revenue}M business.
- **D (Concise):** Built unit economics for ${revenue}M business across {segments} segments and {channels} channels, {channel_reduction}% negative-LTV identified, ${redeployed}K redeployed to {ltv_cac}x+ channels.

**Variables:**
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{channels}`: 5 to 20, step 5 (integer)
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{revenue}`: 5 to 500, step 5 (currency)
  - `{channel_reduction}`: 20 to 50, step 5 (percentage)
  - `{redeployed}`: 50 to 2000, step 50 (currency)
  - `{ltv_cac}`: 3 to 8, step 1 (integer)

### DATA-0216
**Role:** bi-analyst | **Theme:** cross-functional-reporting | **Seniority:** mid | **Verb Context:** content
**Keywords:** cross-functional reporting, OKR reporting, business review, quarterly reporting, leadership reporting, business health

**Scope:** a cross-functional business review reporting suite for {executives} C-suite executives and {teams} business teams, tracking {okrs} OKRs across {functions} functional areas with automated weekly and monthly cadences
**Result:** reducing executive report preparation time from {before} hours to {after} hours per cycle and achieving {adoption}% OKR tracking adoption across covered functions

**Variations:**
- **A (Standard):** Built cross-functional reporting suite for {executives} executives across {functions} functions tracking {okrs} OKRs, cutting preparation from {before} to {after} hours per cycle and achieving {adoption}% OKR adoption.
- **B (Result-first):** Reduced preparation from {before} to {after} hours per cycle and achieved {adoption}% OKR adoption by building reporting for {executives} executives across {functions} functions.
- **C (Impact-led):** Cut preparation from {before} to {after} hours per cycle and achieved {adoption}% OKR adoption; built cross-functional suite for {executives} executives tracking {okrs} OKRs across {functions} functions.
- **D (Concise):** Built cross-functional reporting for {executives} executives across {functions} functions and {okrs} OKRs, prep from {before} to {after}h per cycle, {adoption}% adoption.

**Variables:**
  - `{executives}`: 3 to 10, step 1 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{okrs}`: 20 to 100, step 20 (integer)
  - `{functions}`: 5 to 15, step 5 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{adoption}`: 70 to 100, step 5 (percentage)

### DATA-0217
**Role:** data-engineer | **Theme:** spark-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Spark optimization, Spark tuning, shuffle optimization, broadcast join, Spark performance, executor configuration

**Scope:** a Spark performance optimization initiative across {jobs} production jobs and {pipelines} pipelines on a {node}-node cluster, tuning shuffle partitions, broadcast thresholds, and executor configuration
**Result:** reducing average job runtime from {before} hours to {after} minutes and cutting cluster compute cost by ${savings}K per month

**Variations:**
- **A (Standard):** Optimized {jobs} Spark jobs and {pipelines} pipelines on a {node}-node cluster via shuffle and executor tuning, reducing average runtime from {before} hours to {after} minutes and saving ${savings}K/month.
- **B (Result-first):** Reduced runtime from {before} hours to {after} minutes and saved ${savings}K/month by tuning {jobs} Spark jobs across shuffle, broadcast, and executor settings.
- **C (Impact-led):** Cut runtime from {before} hours to {after} minutes and saved ${savings}K/month; optimized {jobs} Spark jobs and {pipelines} pipelines via shuffle and executor tuning on {node}-node cluster.
- **D (Concise):** Optimized {jobs} Spark jobs and {pipelines} pipelines on {node}-node cluster, runtime from {before}h to {after}min, ${savings}K/month saved.

**Variables:**
  - `{jobs}`: 20 to 200, step 20 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{node}`: 10 to 200, step 10 (integer)
  - `{before}`: 2 to 12, step 2 (integer)
  - `{after}`: 10 to 45, step 5 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)

### DATA-0218
**Role:** data-analyst | **Theme:** patient-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** patient analytics, population health, care gap analytics, patient risk stratification, panel management, chronic disease analytics

**Scope:** a population health analytics platform stratifying {patients}K patients across {risk_tiers} risk tiers and {conditions} chronic conditions, integrating EHR and claims data to surface {care_gaps}K care gap opportunities
**Result:** closing {closed}% of identified care gaps and contributing to a {quality}% improvement in HEDIS quality measure scores

**Variations:**
- **A (Standard):** Built population health analytics stratifying {patients}K patients across {risk_tiers} tiers and {conditions} conditions, surfacing {care_gaps}K gaps and closing {closed}% to improve HEDIS scores {quality}%.
- **B (Result-first):** Closed {closed}% of care gaps and improved HEDIS scores {quality}% by building population health analytics for {patients}K patients across {risk_tiers} tiers.
- **C (Impact-led):** Closed {closed}% of gaps and improved HEDIS scores {quality}%; built population analytics stratifying {patients}K patients across {risk_tiers} tiers and {conditions} conditions.
- **D (Concise):** Built population analytics for {patients}K patients across {risk_tiers} tiers and {conditions} conditions, {care_gaps}K gaps surfaced, {closed}% closed, HEDIS up {quality}%.

**Variables:**
  - `{patients}`: 10 to 500, step 10 (integer)
  - `{risk_tiers}`: 3 to 5, step 1 (integer)
  - `{conditions}`: 5 to 30, step 5 (integer)
  - `{care_gaps}`: 1 to 100, step 5 (integer)
  - `{closed}`: 30 to 70, step 5 (percentage)
  - `{quality}`: 5 to 25, step 5 (percentage)

### DATA-0219
**Role:** data-engineer | **Theme:** data-hub-integration | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data integration hub, master data management, data hub, enterprise integration, canonical data model, MDM

**Scope:** a data integration hub connecting {systems} enterprise systems across {domains} business domains using a canonical data model with {entities} master entity types and {mappings} source-to-hub field mappings
**Result:** reducing point-to-point integrations from {before} to {after} and cutting integration maintenance effort by {reduction}% annually

**Variations:**
- **A (Standard):** Built integration hub connecting {systems} systems across {domains} domains with {entities} master entities and {mappings} mappings, reducing point-to-point integrations from {before} to {after} and cutting maintenance {reduction}%.
- **B (Result-first):** Reduced point-to-point integrations from {before} to {after} and cut maintenance {reduction}% by building hub connecting {systems} systems with {entities} master entities.
- **C (Impact-led):** Cut point-to-point integrations from {before} to {after} and maintenance {reduction}%; built integration hub for {systems} systems across {domains} domains with {entities} master entities.
- **D (Concise):** Built integration hub for {systems} systems across {domains} domains with {entities} master entities, point-to-point from {before} to {after}, maintenance down {reduction}%.

**Variables:**
  - `{systems}`: 10 to 100, step 10 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{entities}`: 10 to 50, step 10 (integer)
  - `{mappings}`: 100 to 2000, step 100 (integer)
  - `{before}`: 50 to 500, step 50 (integer)
  - `{after}`: 10 to 50, step 10 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0220
**Role:** data-scientist | **Theme:** geospatial-ml | **Seniority:** senior | **Verb Context:** systems
**Keywords:** geospatial ML, spatial features, geo-clustering, location prediction, spatial autocorrelation, GIS machine learning

**Scope:** a geospatial ML model incorporating {spatial_features} location-derived features and spatial autocorrelation for a {task} prediction task across {locations}M spatial records covering {regions} geographic regions
**Result:** improving prediction performance by {improvement}% over non-spatial baselines and enabling {decisions} location-informed decisions per month

**Variations:**
- **A (Standard):** Built geospatial ML for {task} with {spatial_features} spatial features across {locations}M records and {regions} regions, improving performance {improvement}% over baselines and enabling {decisions} location decisions monthly.
- **B (Result-first):** Improved prediction {improvement}% over non-spatial baselines and enabled {decisions} monthly decisions by building geospatial ML for {task} across {locations}M records.
- **C (Impact-led):** Improved performance {improvement}% and enabled {decisions} monthly decisions; built geospatial ML for {task} with {spatial_features} features across {locations}M records and {regions} regions.
- **D (Concise):** Built geospatial ML for {task} with {spatial_features} features across {locations}M records and {regions} regions, performance up {improvement}%, {decisions} location decisions monthly.

**Variables:**
  - `{spatial_features}`: 10 to 100, step 10 (integer)
  - `{locations}`: 1 to 500, step 10 (integer)
  - `{regions}`: 5 to 100, step 5 (integer)
  - `{improvement}`: 10 to 35, step 5 (percentage)
  - `{decisions}`: 5 to 30, step 5 (integer)

### DATA-0221
**Role:** bi-analyst | **Theme:** executive-scorecard | **Seniority:** senior | **Verb Context:** content
**Keywords:** executive scorecard, balanced scorecard, KPI scorecard, strategic metrics, board reporting, leadership metrics

**Scope:** a company-wide executive scorecard for a {size}-person business tracking {metrics} strategic KPIs across {perspectives} balanced scorecard perspectives and {business_units} business units, refreshed on a {cadence} basis
**Result:** replacing {manual_reports} manual board reports and reducing leadership decision latency from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Built executive scorecard for a {size}-person business tracking {metrics} KPIs across {perspectives} perspectives and {business_units} units, replacing {manual_reports} board reports and cutting decision latency from {before} weeks to {after} days.
- **B (Result-first):** Replaced {manual_reports} board reports and cut decision latency from {before} weeks to {after} days by building scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units.
- **C (Impact-led):** Replaced {manual_reports} board reports and cut decision latency from {before} weeks to {after} days; built executive scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units.
- **D (Concise):** Built executive scorecard for {metrics} KPIs across {perspectives} perspectives and {business_units} units, {manual_reports} reports replaced, decision latency from {before}wk to {after}d.

**Variables:**
  - `{size}`: 100 to 10000, step 100 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{perspectives}`: 4 to 6, step 1 (integer)
  - `{business_units}`: 3 to 15, step 3 (integer)
  - `{manual_reports}`: 5 to 30, step 5 (integer)
  - `{before}`: 2 to 6, step 1 (integer)
  - `{after}`: 1 to 2, step 1 (integer)

### DATA-0222
**Role:** data-engineer | **Theme:** lake-formation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** AWS Lake Formation, data lake governance, Lake Formation permissions, row filters, column filters, tag-based access

**Scope:** an AWS Lake Formation governance layer across a data lake with {tables}K tables and {users}K users, implementing tag-based access control with {tags} data classification tags and {policies} permission policies
**Result:** achieving {compliance}% fine-grained access compliance and eliminating {violations} unauthorized access incidents per quarter

**Variations:**
- **A (Standard):** Deployed Lake Formation governance for {tables}K tables and {users}K users with {tags} tags and {policies} policies, achieving {compliance}% compliance and eliminating {violations} unauthorized incidents/quarter.
- **B (Result-first):** Achieved {compliance}% compliance and eliminated {violations} incidents/quarter by deploying Lake Formation for {tables}K tables and {users}K users with tag-based access control.
- **C (Impact-led):** Reached {compliance}% compliance and eliminated {violations} incidents/quarter; deployed Lake Formation governance for {tables}K tables and {users}K users with {tags} tags and {policies} policies.
- **D (Concise):** Deployed Lake Formation for {tables}K tables and {users}K users with {tags} tags and {policies} policies, {compliance}% compliance, {violations} incidents eliminated/quarter.

**Variables:**
  - `{tables}`: 1 to 100, step 5 (integer)
  - `{users}`: 10 to 500, step 10 (integer)
  - `{tags}`: 10 to 100, step 10 (integer)
  - `{policies}`: 50 to 500, step 50 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{violations}`: 5 to 30, step 5 (integer)

### DATA-0223
**Role:** data-analyst | **Theme:** returns-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** returns analytics, return rate, refund analytics, reverse logistics, returns forecasting, NPS return correlation

**Scope:** a returns analytics platform tracking {metrics} return metrics across {categories} product categories and {reasons} return reason codes, covering {returns}K annual returns and ${value}M in return value
**Result:** identifying {patterns} return patterns that informed product and packaging improvements reducing return rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes tracking {metrics} metrics, identifying {patterns} patterns that reduced return rate from {before}% to {after}%.
- **B (Result-first):** Reduced return rate from {before}% to {after}% by analyzing {returns}K returns across {categories} categories and identifying {patterns} patterns.
- **C (Impact-led):** Reduced return rate from {before}% to {after}%; built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes tracking {metrics} metrics.
- **D (Concise):** Built returns analytics for {returns}K returns across {categories} categories and {reasons} reason codes, {patterns} patterns identified, rate from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{reasons}`: 10 to 50, step 10 (integer)
  - `{returns}`: 10 to 1000, step 10 (integer)
  - `{value}`: 1 to 100, step 5 (currency)
  - `{patterns}`: 3 to 10, step 1 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 3 to 9, step 1 (percentage)

### DATA-0224
**Role:** ml-engineer | **Theme:** ml-ci-cd | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML CI/CD, model deployment pipeline, continuous training, automated retraining, model pipeline automation, GitOps ML

**Scope:** a CI/CD pipeline for ML covering training, evaluation, and deployment for {models} production models, with automated retraining triggers, evaluation gates, and rollback for {teams} data science teams
**Result:** reducing model deployment cycle from {before} weeks to {after} days and enabling {deployments} safe deployments per month with zero rollback incidents

**Variations:**
- **A (Standard):** Built ML CI/CD for {models} models across training, evaluation, and deployment for {teams} teams, cutting deployment cycle from {before} weeks to {after} days and enabling {deployments} safe monthly deployments.
- **B (Result-first):** Reduced deployment cycle from {before} weeks to {after} days and enabled {deployments} safe monthly deployments by building ML CI/CD for {models} models across {teams} teams.
- **C (Impact-led):** Cut deployment cycle from {before} weeks to {after} days and enabled {deployments} safe monthly deployments; built ML CI/CD for {models} models with automated retraining and evaluation gates.
- **D (Concise):** Built ML CI/CD for {models} models and {teams} teams, deployment cycle from {before}wk to {after}d, {deployments} safe deployments/month.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{deployments}`: 10 to 100, step 10 (integer)

### DATA-0225
**Role:** data-analyst | **Theme:** b2b-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** B2B analytics, account analytics, firmographic analytics, ICP analytics, account scoring, B2B segmentation

**Scope:** a B2B account analytics platform scoring {accounts}K accounts against {criteria} ICP criteria across {firmographic_dims} firmographic dimensions, integrating intent data and product usage signals
**Result:** improving sales-qualified account conversion rate from {before}% to {after}% and reducing average sales cycle length from {cycle_before} to {cycle_after} days

**Variations:**
- **A (Standard):** Built B2B account analytics scoring {accounts}K accounts on {criteria} ICP criteria across {firmographic_dims} dimensions, improving SQA conversion from {before}% to {after}% and cutting cycle from {cycle_before} to {cycle_after} days.
- **B (Result-first):** Improved SQA conversion from {before}% to {after}% and cut cycle from {cycle_before} to {cycle_after} days by building B2B analytics scoring {accounts}K accounts on {criteria} ICP criteria.
- **C (Impact-led):** Improved SQA conversion from {before}% to {after}% and cut cycle from {cycle_before} to {cycle_after} days; built B2B analytics scoring {accounts}K accounts on {criteria} criteria across {firmographic_dims} dimensions.
- **D (Concise):** Built B2B analytics for {accounts}K accounts on {criteria} ICP criteria across {firmographic_dims} dims, SQA conversion from {before}% to {after}%, cycle from {cycle_before} to {cycle_after} days.

**Variables:**
  - `{accounts}`: 1 to 100, step 5 (integer)
  - `{criteria}`: 5 to 20, step 5 (integer)
  - `{firmographic_dims}`: 5 to 20, step 5 (integer)
  - `{before}`: 5 to 15, step 2 (percentage)
  - `{after}`: 20 to 40, step 5 (percentage)
  - `{cycle_before}`: 60 to 180, step 15 (integer)
  - `{cycle_after}`: 30 to 80, step 10 (integer)

### DATA-0226
**Role:** data-engineer | **Theme:** data-catalog-governance | **Seniority:** senior | **Verb Context:** operations
**Keywords:** data catalog, Collibra, Alation, business glossary, data stewardship, governed data catalog

**Scope:** a Collibra data catalog and business glossary for a {size}-person organization, cataloging {assets}K data assets, defining {terms}K business glossary terms, and assigning {stewards} data stewards across {domains} domains
**Result:** increasing governed data asset coverage from {before}% to {after}% and reducing cross-team definition disputes from {disputes_before} to {disputes_after} per month

**Variations:**
- **A (Standard):** Deployed Collibra catalog for {assets}K assets and {terms}K glossary terms across {domains} domains with {stewards} stewards, growing coverage from {before}% to {after}% and cutting disputes from {disputes_before} to {disputes_after}/month.
- **B (Result-first):** Grew coverage from {before}% to {after}% and cut disputes from {disputes_before} to {disputes_after}/month by deploying Collibra for {assets}K assets and {terms}K terms across {domains} domains.
- **C (Impact-led):** Grew coverage from {before}% to {after}% and cut disputes from {disputes_before} to {disputes_after}/month; deployed Collibra for {assets}K assets and {terms}K glossary terms across {domains} domains.
- **D (Concise):** Deployed Collibra for {assets}K assets and {terms}K terms across {domains} domains with {stewards} stewards, coverage from {before}% to {after}%, disputes from {disputes_before} to {disputes_after}/month.

**Variables:**
  - `{assets}`: 1 to 100, step 5 (integer)
  - `{terms}`: 1 to 50, step 5 (integer)
  - `{stewards}`: 10 to 100, step 10 (integer)
  - `{domains}`: 5 to 20, step 5 (integer)
  - `{before}`: 20 to 50, step 5 (percentage)
  - `{after}`: 75 to 99, step 5 (percentage)
  - `{disputes_before}`: 20 to 60, step 10 (integer)
  - `{disputes_after}`: 1 to 5, step 1 (integer)

### DATA-0227
**Role:** data-scientist | **Theme:** sensor-data-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sensor analytics, IoT analytics, time series, signal processing, predictive maintenance, sensor fusion

**Scope:** a sensor data analytics pipeline processing {sensors}K IoT sensors at {frequency} Hz sample frequency, applying signal processing and ML-based anomaly detection across {asset_types} asset types for predictive maintenance
**Result:** predicting {failures}% of equipment failures {lead_time} days before occurrence and reducing unplanned downtime from {before} hours to {after} hours per month

**Variations:**
- **A (Standard):** Built IoT sensor analytics for {sensors}K sensors at {frequency}Hz across {asset_types} asset types, predicting {failures}% of failures {lead_time} days early and cutting unplanned downtime from {before} to {after} hours/month.
- **B (Result-first):** Predicted {failures}% of failures {lead_time} days early and cut downtime from {before} to {after} hours/month by building IoT analytics for {sensors}K sensors across {asset_types} asset types.
- **C (Impact-led):** Predicted {failures}% of failures {lead_time} days early and cut downtime from {before} to {after} hours/month; built IoT analytics for {sensors}K sensors at {frequency}Hz across {asset_types} asset types.
- **D (Concise):** Built IoT analytics for {sensors}K sensors at {frequency}Hz across {asset_types} types, {failures}% of failures predicted {lead_time}d early, downtime from {before} to {after}h/month.

**Variables:**
  - `{sensors}`: 1 to 100, step 5 (integer)
  - `{frequency}`: 1 to 100, step 10 (integer)
  - `{asset_types}`: 3 to 15, step 3 (integer)
  - `{failures}`: 70 to 95, step 5 (percentage)
  - `{lead_time}`: 3 to 14, step 1 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0228
**Role:** bi-analyst | **Theme:** multi-currency-reporting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** multi-currency, FX reporting, currency conversion, consolidated reporting, FX impact, global reporting

**Scope:** a multi-currency financial reporting platform consolidating {entities} legal entities across {currencies} currencies with daily FX rate updates, supporting {reports} recurring reports for a ${revenue}M global business
**Result:** eliminating {errors} FX-related reporting errors per quarter and reducing consolidation cycle time from {before} days to {after} hours

**Variations:**
- **A (Standard):** Built multi-currency reporting for {entities} entities across {currencies} currencies with daily FX updates, eliminating {errors} quarterly FX errors and cutting consolidation from {before} days to {after} hours.
- **B (Result-first):** Eliminated {errors} quarterly FX errors and cut consolidation from {before} days to {after} hours by building multi-currency reporting for {entities} entities across {currencies} currencies.
- **C (Impact-led):** Eliminated {errors} FX errors/quarter and cut consolidation from {before} days to {after} hours; built multi-currency reporting for {entities} entities across {currencies} currencies for a ${revenue}M business.
- **D (Concise):** Built multi-currency reporting for {entities} entities across {currencies} currencies, {errors} FX errors eliminated/quarter, consolidation from {before}d to {after}h.

**Variables:**
  - `{entities}`: 5 to 50, step 5 (integer)
  - `{currencies}`: 3 to 30, step 3 (integer)
  - `{reports}`: 5 to 30, step 5 (integer)
  - `{revenue}`: 10 to 1000, step 50 (currency)
  - `{errors}`: 5 to 30, step 5 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 2 to 6, step 2 (integer)

### DATA-0229
**Role:** data-engineer | **Theme:** data-residency | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data residency, data sovereignty, GDPR, regional data storage, cross-border data, compliance architecture

**Scope:** a data residency architecture enforcing regional storage for {regions} jurisdictions covering {records}M records, implementing routing, tagging, and storage controls aligned to {regulations} data sovereignty regulations
**Result:** achieving {compliance}% residency compliance and enabling market entry into {markets} new regulated markets previously blocked by data residency requirements

**Variations:**
- **A (Standard):** Built data residency architecture for {regions} jurisdictions and {records}M records aligned to {regulations} regulations, achieving {compliance}% compliance and enabling entry into {markets} previously blocked markets.
- **B (Result-first):** Achieved {compliance}% residency compliance and enabled {markets} new market entries by building residency architecture for {regions} jurisdictions and {records}M records.
- **C (Impact-led):** Reached {compliance}% compliance and enabled {markets} new market entries; built data residency architecture for {regions} jurisdictions and {records}M records aligned to {regulations} regulations.
- **D (Concise):** Built data residency for {regions} jurisdictions and {records}M records aligned to {regulations} regulations, {compliance}% compliance, {markets} new markets enabled.

**Variables:**
  - `{regions}`: 2 to 10, step 1 (integer)
  - `{records}`: 1 to 500, step 10 (integer)
  - `{regulations}`: 2 to 5, step 1 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{markets}`: 2 to 10, step 1 (integer)

### DATA-0230
**Role:** data-analyst | **Theme:** digital-health-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** digital health analytics, app engagement, telehealth analytics, health outcomes, patient engagement, wearables analytics

**Scope:** a digital health analytics platform for a {users}K-user health app tracking {metrics} engagement and outcome metrics across {programs} care programs, integrating wearables data from {devices} device types
**Result:** identifying {interventions} engagement interventions that improved program completion rate from {before}% to {after}% and health outcome scores by {outcome}%

**Variations:**
- **A (Standard):** Built digital health analytics for {users}K users tracking {metrics} metrics across {programs} programs with {devices} device types, identifying {interventions} interventions that improved completion from {before}% to {after}% and outcomes {outcome}%.
- **B (Result-first):** Improved completion from {before}% to {after}% and outcomes {outcome}% by building digital health analytics for {users}K users across {programs} programs identifying {interventions} interventions.
- **C (Impact-led):** Improved completion from {before}% to {after}% and outcomes {outcome}%; built digital health analytics for {users}K users tracking {metrics} metrics across {programs} programs and {devices} device types.
- **D (Concise):** Built digital health analytics for {users}K users across {metrics} metrics, {programs} programs, and {devices} device types, completion from {before}% to {after}%, outcomes up {outcome}%.

**Variables:**
  - `{users}`: 10 to 500, step 10 (integer)
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{programs}`: 3 to 15, step 3 (integer)
  - `{devices}`: 3 to 10, step 1 (integer)
  - `{interventions}`: 3 to 10, step 1 (integer)
  - `{before}`: 30 to 55, step 5 (percentage)
  - `{after}`: 60 to 85, step 5 (percentage)
  - `{outcome}`: 10 to 35, step 5 (percentage)

### DATA-0231
**Role:** data-engineer | **Theme:** data-pipeline-documentation | **Seniority:** mid | **Verb Context:** operations
**Keywords:** pipeline documentation, data dictionary, runbooks, data documentation, pipeline catalog, data onboarding

**Scope:** a pipeline documentation program creating runbooks, data dictionaries, and dependency maps for {pipelines} pipelines, {datasets} datasets, and {models} production models across {teams} data teams
**Result:** reducing new team member onboarding time from {before} weeks to {after} days and cutting time-to-resolve undocumented pipeline incidents from {inc_before} hours to {inc_after} minutes

**Variations:**
- **A (Standard):** Created documentation for {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams, cutting onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min.
- **B (Result-first):** Reduced onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min by documenting {pipelines} pipelines, {datasets} datasets, and {models} models.
- **C (Impact-led):** Cut onboarding from {before} weeks to {after} days and incident resolution from {inc_before}h to {inc_after}min; documented {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams.
- **D (Concise):** Documented {pipelines} pipelines, {datasets} datasets, and {models} models across {teams} teams, onboarding from {before}wk to {after}d, incident resolution from {inc_before}h to {inc_after}min.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{models}`: 5 to 50, step 5 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)
  - `{inc_before}`: 4 to 24, step 4 (integer)
  - `{inc_after}`: 15 to 60, step 15 (integer)

### DATA-0232
**Role:** data-scientist | **Theme:** recommendation-ranking | **Seniority:** senior | **Verb Context:** systems
**Keywords:** recommendation ranking, two-stage ranking, candidate generation, learning to rank, LambdaMART, NDCG

**Scope:** a two-stage recommendation system with candidate generation retrieving {candidates}K items and a ranking model scoring across {features} features for {users}M users, serving {qps}K queries per second
**Result:** improving offline NDCG from {ndcg_before} to {ndcg_after} and increasing CTR from {ctr_before}% to {ctr_after}% in A/B testing

**Variations:**
- **A (Standard):** Built two-stage ranking with {candidates}K candidates and {features} ranking features for {users}M users at {qps}K QPS, improving NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}%.
- **B (Result-first):** Improved NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}% by building two-stage ranking for {users}M users at {qps}K QPS.
- **C (Impact-led):** Improved NDCG from {ndcg_before} to {ndcg_after} and CTR from {ctr_before}% to {ctr_after}%; built two-stage ranking with {candidates}K candidates and {features} features for {users}M users.
- **D (Concise):** Built two-stage ranking for {users}M users at {qps}K QPS, NDCG from {ndcg_before} to {ndcg_after}, CTR from {ctr_before}% to {ctr_after}%.

**Variables:**
  - `{candidates}`: 100 to 10000, step 100 (integer)
  - `{features}`: 20 to 500, step 20 (integer)
  - `{users}`: 1 to 100, step 5 (integer)
  - `{qps}`: 10 to 500, step 10 (integer)
  - `{ndcg_before}`: 0.5 to 0.65, step 0.05 (integer)
  - `{ndcg_after}`: 0.7 to 0.9, step 0.05 (integer)
  - `{ctr_before}`: 2 to 8, step 1 (percentage)
  - `{ctr_after}`: 8 to 20, step 2 (percentage)

### DATA-0233
**Role:** data-analyst | **Theme:** cohort-ltv | **Seniority:** mid | **Verb Context:** systems
**Keywords:** LTV analysis, cohort LTV, lifetime value modeling, customer value, acquisition economics, payback period

**Scope:** a cohort LTV analytics framework modeling 12, 24, and 36-month LTV across {cohorts} acquisition cohorts and {segments} customer segments, integrating acquisition cost data for CAC payback analysis
**Result:** improving LTV prediction accuracy by {accuracy}% and identifying {segments} high-LTV segments that informed ${budget}K in acquisition budget reallocation

**Variations:**
- **A (Standard):** Built cohort LTV framework across {cohorts} cohorts and {segments} segments with CAC payback analysis, improving LTV accuracy {accuracy}% and informing ${budget}K in budget reallocation.
- **B (Result-first):** Improved LTV accuracy {accuracy}% and informed ${budget}K in budget reallocation by building cohort LTV across {cohorts} cohorts and {segments} segments.
- **C (Impact-led):** Improved LTV accuracy {accuracy}% and informed ${budget}K in budget reallocation; built cohort LTV across {cohorts} cohorts and {segments} segments with CAC payback analysis.
- **D (Concise):** Built cohort LTV across {cohorts} cohorts and {segments} segments, {accuracy}% accuracy, ${budget}K budget reallocation informed.

**Variables:**
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{accuracy}`: 15 to 40, step 5 (percentage)
  - `{budget}`: 100 to 5000, step 100 (currency)

### DATA-0234
**Role:** data-engineer | **Theme:** async-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** async pipelines, asynchronous processing, queue-based pipeline, decoupled processing, message queue, async ETL

**Scope:** an asynchronous pipeline architecture using SQS and Lambda for {jobs} decoupled processing jobs, handling {throughput}K events per minute with dead-letter queues and retry logic for {consumers} downstream consumers
**Result:** achieving {uptime}% pipeline availability and reducing processing failures from {before}% to {after}% of total event volume

**Variations:**
- **A (Standard):** Built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min with DLQ and retry, achieving {uptime}% availability and cutting failures from {before}% to {after}% of volume.
- **B (Result-first):** Achieved {uptime}% availability and cut failures from {before}% to {after}% by building SQS/Lambda async pipeline for {jobs} jobs at {throughput}K events/min.
- **C (Impact-led):** Achieved {uptime}% availability and cut failures from {before}% to {after}%; built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min with DLQ and retry.
- **D (Concise):** Built async SQS/Lambda pipeline for {jobs} jobs at {throughput}K events/min, {uptime}% availability, failures from {before}% to {after}%.

**Variables:**
  - `{jobs}`: 10 to 100, step 10 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{consumers}`: 5 to 30, step 5 (integer)
  - `{uptime}`: 99.9 to 99.999, step 0.01 (percentage)
  - `{before}`: 5 to 20, step 5 (percentage)
  - `{after}`: 0.1 to 1, step 0.1 (percentage)

### DATA-0235
**Role:** data-scientist | **Theme:** a-b-analysis-advanced | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Bayesian A/B testing, CUPED, variance reduction, sequential testing, peeking problem, experimentation statistics

**Scope:** an advanced experimentation statistics framework implementing CUPED variance reduction, sequential testing, and Bayesian inference for {experiments} experiments per quarter with {metrics} primary and guardrail metrics
**Result:** reducing required sample size by {sample_reduction}% through variance reduction and enabling {early}% of experiments to be called earlier without inflated Type I error

**Variations:**
- **A (Standard):** Implemented CUPED and sequential Bayesian testing for {experiments} quarterly experiments across {metrics} metrics, cutting required sample size {sample_reduction}% and enabling {early}% of experiments to be called earlier.
- **B (Result-first):** Reduced required sample size {sample_reduction}% and enabled {early}% earlier calls by implementing CUPED and sequential testing for {experiments} experiments.
- **C (Impact-led):** Cut sample size {sample_reduction}% and enabled {early}% earlier experiment calls; implemented CUPED, sequential testing, and Bayesian inference for {experiments} quarterly experiments across {metrics} metrics.
- **D (Concise):** Implemented CUPED and Bayesian sequential testing for {experiments} quarterly experiments across {metrics} metrics, sample size down {sample_reduction}%, {early}% earlier calls.

**Variables:**
  - `{experiments}`: 20 to 100, step 10 (integer)
  - `{metrics}`: 3 to 10, step 1 (integer)
  - `{sample_reduction}`: 20 to 50, step 5 (percentage)
  - `{early}`: 20 to 50, step 5 (percentage)

### DATA-0236
**Role:** bi-analyst | **Theme:** usage-based-billing-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** usage-based billing, metered billing, consumption analytics, usage analytics, billing analytics, UBB metrics

**Scope:** a usage-based billing analytics platform tracking {metrics} consumption metrics across {customers}K customers, {products} product lines, and {usage_types} usage dimensions with daily billing reconciliation
**Result:** reducing billing disputes from {before} per month to {after} per quarter and improving revenue recognition accuracy from {rev_before}% to {rev_after}%

**Variations:**
- **A (Standard):** Built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types tracking {metrics} metrics, cutting disputes from {before}/month to {after}/quarter and improving recognition from {rev_before}% to {rev_after}%.
- **B (Result-first):** Reduced disputes from {before}/month to {after}/quarter and improved recognition from {rev_before}% to {rev_after}% by building UBB analytics for {customers}K customers.
- **C (Impact-led):** Cut disputes from {before}/month to {after}/quarter and improved recognition from {rev_before}% to {rev_after}%; built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types.
- **D (Concise):** Built UBB analytics for {customers}K customers across {products} products and {usage_types} usage types, disputes from {before}/month to {after}/quarter, recognition from {rev_before}% to {rev_after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{customers}`: 1 to 100, step 5 (integer)
  - `{products}`: 5 to 30, step 5 (integer)
  - `{usage_types}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 80, step 10 (integer)
  - `{after}`: 0 to 5, step 1 (integer)
  - `{rev_before}`: 85 to 95, step 5 (percentage)
  - `{rev_after}`: 98 to 100, step 1 (percentage)

### DATA-0237
**Role:** data-engineer | **Theme:** streaming-join | **Seniority:** senior | **Verb Context:** systems
**Keywords:** streaming join, stream-stream join, stream-table join, Flink join, windowed join, enrichment join

**Scope:** stream-stream and stream-table joins in Apache Flink across {streams} event streams and {lookup_tables} lookup tables, with watermark-based windowed joins for {use_cases} enrichment use cases at {throughput}K events per second
**Result:** reducing event enrichment latency from {before} seconds to {after}ms and eliminating {data_loss}% of late-data join failures

**Variations:**
- **A (Standard):** Built Flink stream joins across {streams} streams and {lookup_tables} tables for {use_cases} use cases at {throughput}K events/sec, cutting enrichment from {before}s to {after}ms and eliminating {data_loss}% of late-data failures.
- **B (Result-first):** Reduced enrichment from {before}s to {after}ms and eliminated {data_loss}% of late-data failures by building Flink stream joins across {streams} streams at {throughput}K events/sec.
- **C (Impact-led):** Cut enrichment from {before}s to {after}ms and eliminated {data_loss}% of late-data failures; built Flink joins across {streams} streams and {lookup_tables} tables at {throughput}K events/sec.
- **D (Concise):** Built Flink stream joins across {streams} streams and {lookup_tables} tables at {throughput}K events/sec, enrichment from {before}s to {after}ms, {data_loss}% late-data failures eliminated.

**Variables:**
  - `{streams}`: 3 to 20, step 3 (integer)
  - `{lookup_tables}`: 5 to 30, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{before}`: 5 to 30, step 5 (integer)
  - `{after}`: 10 to 200, step 10 (integer)
  - `{data_loss}`: 60 to 100, step 5 (percentage)

### DATA-0238
**Role:** data-analyst | **Theme:** clinical-trial-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** clinical trial analytics, CDISC, SDTM, ADaM, trial reporting, efficacy analytics, safety analytics

**Scope:** clinical trial analytics for a {phase} Phase {trial_phase} trial with {subjects} subjects across {sites} sites, building CDISC SDTM and ADaM datasets and {tables} efficacy and safety analysis tables for regulatory submission
**Result:** reducing data lock to submission package from {before} weeks to {after} weeks and achieving {accuracy}% clean submission with no major data queries

**Variations:**
- **A (Standard):** Built CDISC SDTM and ADaM datasets for a Phase {trial_phase} trial with {subjects} subjects across {sites} sites, producing {tables} analysis tables and reducing lock-to-submission from {before} to {after} weeks.
- **B (Result-first):** Reduced lock-to-submission from {before} to {after} weeks and achieved {accuracy}% clean submission by building SDTM and ADaM datasets for Phase {trial_phase} with {subjects} subjects.
- **C (Impact-led):** Cut lock-to-submission from {before} to {after} weeks and achieved {accuracy}% clean submission; built CDISC datasets for Phase {trial_phase} trial with {subjects} subjects across {sites} sites.
- **D (Concise):** Built CDISC SDTM and ADaM for Phase {trial_phase} trial with {subjects} subjects across {sites} sites, {tables} analysis tables, submission from {before} to {after} weeks.

**Variables:**
  - `{trial_phase}`: 1 to 3, step 1 (integer)
  - `{subjects}`: 50 to 5000, step 50 (integer)
  - `{sites}`: 5 to 200, step 5 (integer)
  - `{tables}`: 20 to 200, step 20 (integer)
  - `{before}`: 12 to 24, step 4 (integer)
  - `{after}`: 4 to 10, step 2 (integer)
  - `{accuracy}`: 95 to 100, step 1 (percentage)

### DATA-0239
**Role:** ml-engineer | **Theme:** synthetic-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** synthetic data, GAN, CTGAN, data synthesis, privacy-preserving data, synthetic dataset generation

**Scope:** a synthetic data generation system using CTGAN to produce {synthetic_records}M privacy-safe records from {source_records}M sensitive training records across {tables} tables for {use_cases} downstream use cases
**Result:** achieving {fidelity}% statistical fidelity to source data while eliminating re-identification risk and reducing compliance review cycles from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Built CTGAN synthetic data pipeline generating {synthetic_records}M records from {source_records}M across {tables} tables, achieving {fidelity}% fidelity and cutting compliance review from {before} weeks to {after} days.
- **B (Result-first):** Achieved {fidelity}% statistical fidelity and cut compliance review from {before} weeks to {after} days by building CTGAN pipeline generating {synthetic_records}M records from {source_records}M.
- **C (Impact-led):** Achieved {fidelity}% fidelity and cut compliance review from {before} weeks to {after} days; built CTGAN pipeline generating {synthetic_records}M records across {tables} tables for {use_cases} use cases.
- **D (Concise):** Built CTGAN pipeline generating {synthetic_records}M from {source_records}M across {tables} tables, {fidelity}% fidelity, compliance review from {before}wk to {after}d.

**Variables:**
  - `{synthetic_records}`: 1 to 500, step 10 (integer)
  - `{source_records}`: 1 to 500, step 10 (integer)
  - `{tables}`: 5 to 50, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{fidelity}`: 85 to 99, step 2 (percentage)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0240
**Role:** data-analyst | **Theme:** unit-economics-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** unit economics, contribution margin, CAC, LTV:CAC, payback period, gross margin per unit, cohort economics

**Scope:** a unit economics analytics framework modeling CAC, LTV, payback period, and contribution margin across {segments} acquisition segments, {channels} marketing channels, and {cohorts} historical cohorts for a ${revenue}M business
**Result:** identifying {channel_reduction}% of channels with negative LTV:CAC ratios and redeploying ${redeployed}K in spend to channels with {ltv_cac}x or better LTV:CAC

**Variations:**
- **A (Standard):** Built unit economics framework across {segments} segments, {channels} channels, and {cohorts} cohorts for a ${revenue}M business, identifying {channel_reduction}% negative-LTV channels and redeploying ${redeployed}K to {ltv_cac}x+ channels.
- **B (Result-first):** Identified {channel_reduction}% of negative-LTV channels and redeployed ${redeployed}K by building unit economics across {segments} segments and {channels} channels for a ${revenue}M business.
- **C (Impact-led):** Identified {channel_reduction}% of negative-LTV channels and redeployed ${redeployed}K; built unit economics framework across {segments} segments, {channels} channels, and {cohorts} cohorts for a ${revenue}M business.
- **D (Concise):** Built unit economics for ${revenue}M business across {segments} segments and {channels} channels, {channel_reduction}% negative-LTV identified, ${redeployed}K redeployed to {ltv_cac}x+ channels.

**Variables:**
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{channels}`: 5 to 20, step 5 (integer)
  - `{cohorts}`: 12 to 36, step 6 (integer)
  - `{revenue}`: 5 to 500, step 5 (currency)
  - `{channel_reduction}`: 20 to 50, step 5 (percentage)
  - `{redeployed}`: 50 to 2000, step 50 (currency)
  - `{ltv_cac}`: 3 to 8, step 1 (integer)

### DATA-0241
**Role:** data-engineer | **Theme:** pipeline-dependency-management | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline dependencies, DAG management, upstream dependencies, dependency graph, pipeline orchestration, blocking dependencies

**Scope:** a dependency management system mapping {pipelines} pipeline dependencies across {jobs} scheduled jobs and {datasets} datasets, implementing automated blocking and alerting when {slas} SLA-critical upstream jobs fail
**Result:** reducing cascading pipeline failures from {before} per month to {after} per quarter and cutting mean time to root-cause from {mttr_before} hours to {mttr_after} minutes

**Variations:**
- **A (Standard):** Mapped dependencies for {pipelines} pipelines, {jobs} jobs, and {datasets} datasets with SLA blocking, reducing cascading failures from {before}/month to {after}/quarter and cutting MTTR from {mttr_before}h to {mttr_after}min.
- **B (Result-first):** Reduced cascading failures from {before}/month to {after}/quarter and cut MTTR from {mttr_before}h to {mttr_after}min by mapping dependencies across {pipelines} pipelines and {jobs} jobs.
- **C (Impact-led):** Cut cascading failures from {before}/month to {after}/quarter and MTTR from {mttr_before}h to {mttr_after}min; mapped dependencies for {pipelines} pipelines across {jobs} jobs and {datasets} datasets.
- **D (Concise):** Mapped {pipelines} pipeline dependencies across {jobs} jobs and {datasets} datasets, cascading failures from {before}/month to {after}/quarter, MTTR from {mttr_before}h to {mttr_after}min.

**Variables:**
  - `{pipelines}`: 50 to 500, step 50 (integer)
  - `{jobs}`: 100 to 2000, step 100 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{slas}`: 10 to 100, step 10 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 3, step 1 (integer)
  - `{mttr_before}`: 2 to 12, step 2 (integer)
  - `{mttr_after}`: 5 to 30, step 5 (integer)

### DATA-0242
**Role:** data-scientist | **Theme:** multi-armed-bandit | **Seniority:** mid | **Verb Context:** systems
**Keywords:** multi-armed bandit, Thompson sampling, epsilon-greedy, exploration exploitation, online optimization, reward maximization

**Scope:** a multi-armed bandit system using Thompson sampling to optimize {arms} decision alternatives across {contexts} context dimensions for {users}M daily users, replacing static rule-based allocation
**Result:** increasing cumulative reward metric by {reward}% over A/B tested baselines and reducing regret by {regret}% versus epsilon-greedy approaches

**Variations:**
- **A (Standard):** Built Thompson sampling bandit across {arms} arms and {contexts} contexts for {users}M daily users, improving cumulative reward {reward}% over baselines and cutting regret {regret}% versus epsilon-greedy.
- **B (Result-first):** Increased reward {reward}% and cut regret {regret}% by building Thompson sampling bandit across {arms} arms and {contexts} contexts for {users}M daily users.
- **C (Impact-led):** Increased reward {reward}% and cut regret {regret}%; built Thompson sampling bandit across {arms} arms and {contexts} contexts for {users}M daily users.
- **D (Concise):** Built Thompson sampling bandit across {arms} arms and {contexts} contexts for {users}M users, reward up {reward}%, regret down {regret}%.

**Variables:**
  - `{arms}`: 5 to 50, step 5 (integer)
  - `{contexts}`: 5 to 50, step 5 (integer)
  - `{users}`: 0.1 to 50, step 1 (integer)
  - `{reward}`: 10 to 35, step 5 (percentage)
  - `{regret}`: 20 to 60, step 5 (percentage)

### DATA-0243
**Role:** data-analyst | **Theme:** market-share-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** market share analytics, share of voice, market sizing, TAM analytics, relative market position, growth share matrix

**Scope:** a market share analytics framework combining internal sales data with {external_sources} external market data sources to track relative share across {segments} market segments and {geographies} geographies over {periods} periods
**Result:** improving market share estimate accuracy from {before}% to {after}% confidence interval and informing {decisions} strategic decisions on market expansion priorities

**Variations:**
- **A (Standard):** Built market share analytics combining internal data with {external_sources} sources across {segments} segments and {geographies} geographies, improving estimate accuracy from {before}% to {after}% CI and informing {decisions} expansion decisions.
- **B (Result-first):** Improved estimate accuracy from {before}% to {after}% CI and informed {decisions} expansion decisions by building market share analytics across {segments} segments from {external_sources} external sources.
- **C (Impact-led):** Improved estimate accuracy from {before}% to {after}% CI and informed {decisions} expansion decisions; built market share analytics across {segments} segments and {geographies} geographies from {external_sources} sources.
- **D (Concise):** Built market share analytics across {segments} segments and {geographies} geographies from {external_sources} sources, accuracy from {before}% to {after}% CI, {decisions} expansion decisions.

**Variables:**
  - `{external_sources}`: 3 to 10, step 1 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{geographies}`: 3 to 30, step 3 (integer)
  - `{periods}`: 8 to 24, step 4 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 15, step 5 (percentage)
  - `{decisions}`: 3 to 10, step 1 (integer)

### DATA-0244
**Role:** data-engineer | **Theme:** data-backup-recovery | **Seniority:** mid | **Verb Context:** operations
**Keywords:** data backup, disaster recovery, point-in-time recovery, RPO, RTO, backup automation

**Scope:** a data backup and recovery strategy for {databases} production databases and {pipelines} critical pipelines, implementing point-in-time recovery with {rpo} RPO and automated restore testing across {environments} environments
**Result:** reducing RTO from {before} hours to {after} hours and achieving {rpo}% backup success rate across {backup_runs}K annual backup runs

**Variations:**
- **A (Standard):** Implemented backup and recovery for {databases} databases and {pipelines} pipelines with {rpo} RPO, cutting RTO from {before} to {after} hours and achieving {success}% backup success across {backup_runs}K annual runs.
- **B (Result-first):** Reduced RTO from {before} to {after} hours and achieved {success}% backup success by implementing recovery for {databases} databases and {pipelines} pipelines with {rpo} RPO.
- **C (Impact-led):** Cut RTO from {before} to {after} hours and achieved {success}% backup success; implemented backup strategy for {databases} databases and {pipelines} pipelines with automated restore testing.
- **D (Concise):** Implemented backup for {databases} databases and {pipelines} pipelines, RTO from {before} to {after}h, {success}% backup success across {backup_runs}K runs.

**Variables:**
  - `{databases}`: 5 to 50, step 5 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 0.25 to 2, step 0.25 (integer)
  - `{success}`: 99 to 100, step 0.1 (percentage)
  - `{backup_runs}`: 1 to 50, step 5 (integer)

### DATA-0245
**Role:** data-scientist | **Theme:** speech-recognition | **Seniority:** senior | **Verb Context:** systems
**Keywords:** speech recognition, ASR, Whisper, audio transcription, word error rate, voice analytics

**Scope:** a speech recognition pipeline using fine-tuned Whisper across {audio_hours}K hours of domain-specific audio in {languages} languages, processing {calls}K calls per day for {use_cases} downstream analytics use cases
**Result:** reducing word error rate from {before}% to {after}% on domain vocabulary and cutting transcription cost from ${cost_before} to ${cost_after} per hour of audio

**Variations:**
- **A (Standard):** Fine-tuned Whisper on {audio_hours}K hours across {languages} languages for {calls}K daily calls, reducing WER from {before}% to {after}% and cutting cost from ${cost_before} to ${cost_after}/hour.
- **B (Result-first):** Reduced WER from {before}% to {after}% and cut cost from ${cost_before} to ${cost_after}/hour by fine-tuning Whisper on {audio_hours}K hours across {languages} languages.
- **C (Impact-led):** Reduced WER from {before}% to {after}% and cut cost from ${cost_before} to ${cost_after}/hour; fine-tuned Whisper on {audio_hours}K hours in {languages} languages for {calls}K daily calls.
- **D (Concise):** Fine-tuned Whisper on {audio_hours}K hours in {languages} languages for {calls}K daily calls, WER from {before}% to {after}%, cost from ${cost_before} to ${cost_after}/hour.

**Variables:**
  - `{audio_hours}`: 10 to 1000, step 10 (integer)
  - `{languages}`: 1 to 10, step 1 (integer)
  - `{calls}`: 1 to 100, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{before}`: 15 to 40, step 5 (percentage)
  - `{after}`: 3 to 10, step 1 (percentage)
  - `{cost_before}`: 1 to 10, step 1 (currency)
  - `{cost_after}`: 0.1 to 1, step 0.1 (currency)

### DATA-0246
**Role:** bi-analyst | **Theme:** store-performance-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** store analytics, retail analytics, same-store sales, foot traffic, store performance, retail KPIs

**Scope:** a store performance analytics platform tracking {metrics} retail KPIs across {stores} locations including same-store sales, foot traffic, basket size, and conversion for {regions} geographic regions
**Result:** identifying {underperformers} underperforming stores and informing operational interventions that improved average same-store sales growth from {before}% to {after}%

**Variations:**
- **A (Standard):** Built store analytics for {stores} locations across {regions} regions tracking {metrics} KPIs, identifying {underperformers} underperformers and improving same-store sales growth from {before}% to {after}%.
- **B (Result-first):** Improved same-store sales growth from {before}% to {after}% and identified {underperformers} underperformers by building store analytics for {stores} locations across {metrics} KPIs.
- **C (Impact-led):** Improved same-store sales growth from {before}% to {after}% and surfaced {underperformers} underperformers; built store analytics for {stores} locations across {metrics} KPIs and {regions} regions.
- **D (Concise):** Built store analytics for {stores} locations across {metrics} KPIs and {regions} regions, {underperformers} underperformers identified, same-store growth from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 15 to 50, step 5 (integer)
  - `{stores}`: 10 to 1000, step 10 (integer)
  - `{regions}`: 3 to 20, step 3 (integer)
  - `{underperformers}`: 5 to 50, step 5 (integer)
  - `{before}`: 1 to 5, step 1 (percentage)
  - `{after}`: 5 to 15, step 2 (percentage)

### DATA-0247
**Role:** data-engineer | **Theme:** table-partitioning-migration | **Seniority:** mid | **Verb Context:** systems
**Keywords:** table migration, partitioning migration, BigQuery partitioning, partition key, data migration, zero-downtime migration

**Scope:** a zero-downtime partitioning migration for {tables} large unpartitioned tables totalling {volume}TB in production, implementing partition key selection, backfill jobs, and cutover with no consumer disruption
**Result:** reducing full-table scan queries from {before}% to {after}% of total query volume and cutting average bytes billed per query by {savings}%

**Variations:**
- **A (Standard):** Migrated {tables} tables ({volume}TB) to partitioned layout with zero-downtime cutover, reducing full-scan queries from {before}% to {after}% and cutting bytes billed per query {savings}%.
- **B (Result-first):** Reduced full-scan queries from {before}% to {after}% and cut bytes billed {savings}% by migrating {tables} tables ({volume}TB) to partitioned layout with zero downtime.
- **C (Impact-led):** Cut full-scan queries from {before}% to {after}% and bytes billed {savings}%; migrated {tables} unpartitioned tables at {volume}TB to partitioned layout with zero consumer downtime.
- **D (Concise):** Migrated {tables} tables ({volume}TB) to partitioned layout zero-downtime, full-scan queries from {before}% to {after}%, bytes billed down {savings}%.

**Variables:**
  - `{tables}`: 20 to 500, step 20 (integer)
  - `{volume}`: 10 to 1000, step 50 (integer)
  - `{before}`: 50 to 90, step 5 (percentage)
  - `{after}`: 5 to 20, step 5 (percentage)
  - `{savings}`: 40 to 80, step 5 (percentage)

### DATA-0248
**Role:** data-analyst | **Theme:** inventory-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** inventory forecasting, replenishment analytics, safety stock optimization, reorder point, demand uncertainty, service level

**Scope:** an inventory replenishment analytics model computing dynamic reorder points and safety stock levels for {skus}K SKUs across {warehouses} locations based on demand variability, lead time, and {service_level}% service level targets
**Result:** reducing stockout events from {before} per month to {after} per month and decreasing average inventory holding cost by ${savings}K annually

**Variations:**
- **A (Standard):** Built dynamic replenishment analytics for {skus}K SKUs across {warehouses} locations at {service_level}% service level, reducing stockouts from {before} to {after}/month and cutting holding cost ${savings}K annually.
- **B (Result-first):** Reduced stockouts from {before} to {after}/month and cut holding cost ${savings}K annually by building dynamic replenishment for {skus}K SKUs at {service_level}% service level.
- **C (Impact-led):** Cut stockouts from {before} to {after}/month and holding cost ${savings}K annually; built dynamic replenishment for {skus}K SKUs across {warehouses} locations at {service_level}% service level.
- **D (Concise):** Built replenishment analytics for {skus}K SKUs across {warehouses} locations at {service_level}% SL, stockouts from {before} to {after}/month, holding cost down ${savings}K/year.

**Variables:**
  - `{skus}`: 1 to 200, step 10 (integer)
  - `{warehouses}`: 3 to 30, step 3 (integer)
  - `{service_level}`: 90 to 99, step 1 (percentage)
  - `{before}`: 20 to 100, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)
  - `{savings}`: 50 to 2000, step 50 (currency)

### DATA-0249
**Role:** ml-engineer | **Theme:** continual-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** continual learning, catastrophic forgetting, elastic weight consolidation, replay buffer, concept drift, model refresh

**Scope:** a continual learning framework for {models} production models handling concept drift across {domains} evolving domains, using replay buffers and EWC regularization to update models on {new_data}K monthly new samples
**Result:** maintaining model performance within {degradation}% of initial accuracy over {months} months without full retraining and reducing retraining cost by ${savings}K per model per year

**Variations:**
- **A (Standard):** Built continual learning with EWC and replay buffers for {models} models across {domains} domains at {new_data}K monthly samples, maintaining performance within {degradation}% and saving ${savings}K/model/year.
- **B (Result-first):** Maintained performance within {degradation}% over {months} months and saved ${savings}K/model/year by building EWC continual learning for {models} models across {domains} domains.
- **C (Impact-led):** Maintained performance within {degradation}% over {months} months and saved ${savings}K/model/year; built continual learning with EWC for {models} models across {domains} domains.
- **D (Concise):** Built continual learning for {models} models across {domains} domains at {new_data}K monthly samples, performance within {degradation}% over {months} months, ${savings}K/model/year saved.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{domains}`: 3 to 10, step 1 (integer)
  - `{new_data}`: 10 to 500, step 10 (integer)
  - `{degradation}`: 2 to 8, step 1 (percentage)
  - `{months}`: 6 to 24, step 3 (integer)
  - `{savings}`: 20 to 300, step 20 (currency)

### DATA-0250
**Role:** data-analyst | **Theme:** pricing-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** pricing analytics, price monitoring, competitive pricing, price benchmarking, price tracking, margin analytics

**Scope:** a pricing analytics dashboard tracking {metrics} pricing and margin metrics for {skus}K SKUs across {channels} sales channels and {competitors} competitor price feeds, refreshed on a {cadence} basis
**Result:** identifying {opportunities} margin improvement opportunities and improving average gross margin from {before}% to {after}% across tracked SKUs

**Variations:**
- **A (Standard):** Built pricing analytics for {skus}K SKUs across {channels} channels and {competitors} competitors tracking {metrics} metrics, identifying {opportunities} opportunities and improving gross margin from {before}% to {after}%.
- **B (Result-first):** Identified {opportunities} margin opportunities and improved gross margin from {before}% to {after}% by building pricing analytics for {skus}K SKUs across {channels} channels.
- **C (Impact-led):** Identified {opportunities} opportunities and improved gross margin from {before}% to {after}%; built pricing analytics for {skus}K SKUs across {channels} channels and {competitors} competitors.
- **D (Concise):** Built pricing analytics for {skus}K SKUs across {channels} channels and {competitors} competitors, {opportunities} opportunities identified, margin from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{skus}`: 1 to 100, step 5 (integer)
  - `{channels}`: 3 to 10, step 1 (integer)
  - `{competitors}`: 3 to 20, step 3 (integer)
  - `{opportunities}`: 5 to 20, step 5 (integer)
  - `{before}`: 30 to 50, step 5 (percentage)
  - `{after}`: 45 to 65, step 5 (percentage)

### DATA-0251
**Role:** data-engineer | **Theme:** idempotent-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** idempotent pipelines, safe retries, at-least-once delivery, exactly-once semantics, deduplication, pipeline reliability

**Scope:** idempotency patterns across {pipelines} data pipelines and {jobs} transformation jobs, implementing deduplication keys, upsert logic, and exactly-once semantics for {datasets} critical datasets
**Result:** reducing duplicate data incidents from {before} per month to {after} per quarter and enabling safe automatic retries that recovered {recoveries}% of previously failed runs

**Variations:**
- **A (Standard):** Implemented idempotency across {pipelines} pipelines and {jobs} jobs with deduplication and upsert logic, cutting duplicates from {before}/month to {after}/quarter and enabling {recoveries}% automatic failure recovery.
- **B (Result-first):** Reduced duplicates from {before}/month to {after}/quarter and enabled {recoveries}% failure recovery by implementing idempotency across {pipelines} pipelines and {jobs} jobs.
- **C (Impact-led):** Cut duplicates from {before}/month to {after}/quarter and enabled {recoveries}% recovery; implemented idempotency across {pipelines} pipelines and {jobs} jobs for {datasets} critical datasets.
- **D (Concise):** Implemented idempotency for {pipelines} pipelines and {jobs} jobs across {datasets} datasets, duplicates from {before}/month to {after}/quarter, {recoveries}% failure recovery.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{jobs}`: 50 to 500, step 50 (integer)
  - `{datasets}`: 20 to 200, step 20 (integer)
  - `{before}`: 10 to 40, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)
  - `{recoveries}`: 70 to 99, step 5 (percentage)

### DATA-0252
**Role:** data-scientist | **Theme:** multivariate-testing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multivariate testing, MVT, factorial design, interaction effects, orthogonal design, full factorial

**Scope:** a multivariate testing framework supporting {factors} concurrent factor variations across {surfaces} product surfaces, using fractional factorial design to reduce required sample size for {experiments} experiments per quarter
**Result:** testing {factors}x more factor combinations with the same traffic and identifying {interactions} significant interaction effects that were invisible in A/B testing

**Variations:**
- **A (Standard):** Built MVT framework for {factors} factor variations across {surfaces} surfaces using fractional factorial design, enabling {factors}x more combinations and identifying {interactions} interaction effects per quarter.
- **B (Result-first):** Enabled {factors}x more factor combinations and identified {interactions} interaction effects by building MVT with fractional factorial for {factors} factors across {surfaces} surfaces.
- **C (Impact-led):** Enabled {factors}x more combinations and identified {interactions} interaction effects; built MVT framework for {factors} factors across {surfaces} surfaces using fractional factorial design.
- **D (Concise):** Built MVT framework for {factors} factors across {surfaces} surfaces, {factors}x more combinations tested, {interactions} interaction effects identified per quarter.

**Variables:**
  - `{factors}`: 3 to 10, step 1 (integer)
  - `{surfaces}`: 2 to 8, step 1 (integer)
  - `{experiments}`: 10 to 50, step 10 (integer)
  - `{interactions}`: 3 to 15, step 3 (integer)

### DATA-0253
**Role:** data-analyst | **Theme:** real-estate-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** real estate analytics, property analytics, lease analytics, occupancy analytics, portfolio analytics, CRE analytics

**Scope:** a real estate portfolio analytics platform tracking {metrics} metrics across {properties} properties and ${value}M in portfolio value, covering occupancy, lease expiry, NOI, and capex for {asset_classes} asset classes
**Result:** identifying ${savings}K in lease renegotiation opportunities and improving average portfolio NOI margin from {before}% to {after}%

**Variations:**
- **A (Standard):** Built RE portfolio analytics for {properties} properties at ${value}M across {asset_classes} classes tracking {metrics} metrics, identifying ${savings}K in renegotiation opportunities and improving NOI from {before}% to {after}%.
- **B (Result-first):** Identified ${savings}K in renegotiation opportunities and improved NOI from {before}% to {after}% by building portfolio analytics for {properties} properties at ${value}M.
- **C (Impact-led):** Identified ${savings}K in renegotiation opportunities and improved NOI from {before}% to {after}%; built RE analytics for {properties} properties at ${value}M across {metrics} metrics.
- **D (Concise):** Built RE analytics for {properties} properties at ${value}M across {metrics} metrics and {asset_classes} classes, ${savings}K opportunities, NOI from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 15 to 50, step 5 (integer)
  - `{properties}`: 10 to 500, step 10 (integer)
  - `{value}`: 10 to 2000, step 50 (currency)
  - `{asset_classes}`: 2 to 6, step 1 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 40 to 60, step 5 (percentage)

### DATA-0254
**Role:** ml-engineer | **Theme:** model-security | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model security, adversarial robustness, adversarial attacks, model hardening, input validation, adversarial training

**Scope:** adversarial robustness evaluation and hardening for {models} production models, testing {attack_types} attack types and implementing adversarial training on {samples}K perturbation samples
**Result:** improving model accuracy under adversarial conditions from {before}% to {after}% and reducing successful adversarial attack rate from {attack_before}% to {attack_after}%

**Variations:**
- **A (Standard):** Hardened {models} models against {attack_types} attack types using adversarial training on {samples}K samples, improving adversarial accuracy from {before}% to {after}% and cutting attack success from {attack_before}% to {attack_after}%.
- **B (Result-first):** Improved adversarial accuracy from {before}% to {after}% and cut attack success from {attack_before}% to {attack_after}% by adversarially training {models} models on {samples}K perturbation samples.
- **C (Impact-led):** Improved adversarial accuracy from {before}% to {after}% and cut attack success from {attack_before}% to {attack_after}%; hardened {models} models against {attack_types} attack types with adversarial training.
- **D (Concise):** Hardened {models} models against {attack_types} attacks, adversarial accuracy from {before}% to {after}%, attack success from {attack_before}% to {attack_after}%.

**Variables:**
  - `{models}`: 5 to 30, step 5 (integer)
  - `{attack_types}`: 3 to 8, step 1 (integer)
  - `{samples}`: 10 to 500, step 10 (integer)
  - `{before}`: 40 to 65, step 5 (percentage)
  - `{after}`: 75 to 95, step 5 (percentage)
  - `{attack_before}`: 30 to 60, step 5 (percentage)
  - `{attack_after}`: 2 to 8, step 1 (percentage)

### DATA-0255
**Role:** data-analyst | **Theme:** ad-spend-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ad spend analytics, ROAS, paid media analytics, CPM, CPC, ad efficiency, media analytics

**Scope:** a paid media analytics platform tracking {metrics} efficiency metrics across {platforms} ad platforms and ${spend}K in monthly spend, with daily automated reporting and budget pacing alerts for {campaigns}K active campaigns
**Result:** reducing wasted spend from {before}% to {after}% of total budget and improving blended ROAS from {roas_before}x to {roas_after}x

**Variations:**
- **A (Standard):** Built paid media analytics for ${spend}K monthly across {platforms} platforms and {campaigns}K campaigns tracking {metrics} metrics, cutting wasted spend from {before}% to {after}% and improving ROAS from {roas_before}x to {roas_after}x.
- **B (Result-first):** Reduced wasted spend from {before}% to {after}% and improved ROAS from {roas_before}x to {roas_after}x by building analytics for ${spend}K monthly across {platforms} platforms.
- **C (Impact-led):** Cut wasted spend from {before}% to {after}% and improved ROAS from {roas_before}x to {roas_after}x; built paid media analytics for ${spend}K/month across {platforms} platforms and {campaigns}K campaigns.
- **D (Concise):** Built paid media analytics for ${spend}K/month across {platforms} platforms and {campaigns}K campaigns, wasted spend from {before}% to {after}%, ROAS from {roas_before}x to {roas_after}x.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{platforms}`: 3 to 8, step 1 (integer)
  - `{spend}`: 50 to 5000, step 50 (currency)
  - `{campaigns}`: 10 to 500, step 10 (integer)
  - `{before}`: 15 to 40, step 5 (percentage)
  - `{after}`: 3 to 10, step 1 (percentage)
  - `{roas_before}`: 2 to 4, step 0.5 (integer)
  - `{roas_after}`: 5 to 12, step 1 (integer)

### DATA-0256
**Role:** data-engineer | **Theme:** real-time-feature-store | **Seniority:** senior | **Verb Context:** systems
**Keywords:** real-time feature store, online feature store, Redis feature store, low-latency features, feature serving, online inference

**Scope:** a real-time online feature store using Redis serving {features}K feature values for {models} production models at sub-{latency}ms P99 latency, handling {qps}K feature reads per second
**Result:** reducing model inference latency from {before}ms to {after}ms end-to-end and achieving {uptime}% feature store availability across {regions} regions

**Variations:**
- **A (Standard):** Built Redis feature store serving {features}K features for {models} models at sub-{latency}ms P99 and {qps}K reads/sec, cutting inference from {before}ms to {after}ms and achieving {uptime}% availability.
- **B (Result-first):** Reduced inference from {before}ms to {after}ms and achieved {uptime}% availability by building Redis feature store at sub-{latency}ms P99 for {models} models.
- **C (Impact-led):** Cut inference from {before}ms to {after}ms and achieved {uptime}% availability; built Redis feature store for {features}K features across {models} models at sub-{latency}ms P99 and {qps}K reads/sec.
- **D (Concise):** Built Redis feature store for {features}K features and {models} models at sub-{latency}ms P99 and {qps}K reads/sec, inference from {before}ms to {after}ms, {uptime}% availability.

**Variables:**
  - `{features}`: 10 to 500, step 10 (integer)
  - `{models}`: 5 to 30, step 5 (integer)
  - `{latency}`: 5 to 20, step 5 (integer)
  - `{qps}`: 10 to 500, step 10 (integer)
  - `{before}`: 100 to 500, step 50 (integer)
  - `{after}`: 20 to 80, step 10 (integer)
  - `{uptime}`: 99.9 to 99.999, step 0.01 (percentage)
  - `{regions}`: 2 to 5, step 1 (integer)

### DATA-0257
**Role:** data-analyst | **Theme:** project-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** project analytics, program analytics, milestone tracking, resource analytics, project portfolio, delivery metrics

**Scope:** a project portfolio analytics dashboard tracking {metrics} delivery metrics across {projects} active projects and {programs} programs for {stakeholders} PMO and executive stakeholders, integrating Jira and financial data
**Result:** improving on-time delivery rate from {before}% to {after}% and increasing portfolio visibility for {stakeholders} stakeholders from weekly manual reports to real-time access

**Variations:**
- **A (Standard):** Built PMO analytics for {projects} projects and {programs} programs tracking {metrics} metrics, improving on-time delivery from {before}% to {after}% and enabling real-time visibility for {stakeholders} stakeholders.
- **B (Result-first):** Improved on-time delivery from {before}% to {after}% and enabled real-time visibility for {stakeholders} stakeholders by building PMO analytics for {projects} projects and {programs} programs.
- **C (Impact-led):** Improved delivery from {before}% to {after}% and enabled real-time visibility for {stakeholders} stakeholders; built PMO analytics for {projects} projects and {programs} programs tracking {metrics} metrics.
- **D (Concise):** Built PMO analytics for {projects} projects and {programs} programs across {metrics} metrics, delivery from {before}% to {after}%, real-time visibility for {stakeholders} stakeholders.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{projects}`: 10 to 200, step 10 (integer)
  - `{programs}`: 3 to 20, step 3 (integer)
  - `{stakeholders}`: 10 to 50, step 10 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 97, step 5 (percentage)

### DATA-0258
**Role:** data-engineer | **Theme:** multi-tenant-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multi-tenant data, tenant isolation, data partitioning, tenant security, SaaS data architecture, tenant analytics

**Scope:** a multi-tenant data architecture for a SaaS platform serving {tenants}K tenants, implementing tenant-level data isolation, row-level security, and separate analytics pipelines for {tiers} subscription tiers
**Result:** achieving {isolation}% tenant data isolation compliance and scaling to {tenants}K tenants with no per-tenant performance degradation

**Variations:**
- **A (Standard):** Architected multi-tenant data for {tenants}K tenants with isolation, RLS, and per-tier pipelines for {tiers} tiers, achieving {isolation}% compliance and scaling without per-tenant degradation.
- **B (Result-first):** Achieved {isolation}% isolation compliance and scaled to {tenants}K tenants without degradation by architecting multi-tenant data with RLS and per-tier pipelines.
- **C (Impact-led):** Achieved {isolation}% compliance and scaled to {tenants}K tenants without degradation; architected multi-tenant data for {tenants}K tenants with isolation and per-tier pipelines for {tiers} tiers.
- **D (Concise):** Architected multi-tenant data for {tenants}K tenants across {tiers} tiers, {isolation}% isolation compliance, scalable without degradation.

**Variables:**
  - `{tenants}`: 10 to 10000, step 100 (integer)
  - `{tiers}`: 2 to 4, step 1 (integer)
  - `{isolation}`: 99 to 100, step 0.1 (percentage)

### DATA-0259
**Role:** data-scientist | **Theme:** object-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** object detection, YOLO, Faster R-CNN, bounding box, mAP, computer vision, image detection

**Scope:** an object detection model using YOLOv8 fine-tuned on {images}K labeled images across {classes} object classes, deployed via edge inference for {devices} edge devices processing {frames}K frames per second
**Result:** achieving {map}% mAP on the test set and reducing false positive rate from {before}% to {after}% in production

**Variations:**
- **A (Standard):** Fine-tuned YOLOv8 on {images}K images across {classes} classes deployed to {devices} edge devices at {frames}K FPS, achieving {map}% mAP and cutting false positives from {before}% to {after}%.
- **B (Result-first):** Achieved {map}% mAP and cut false positives from {before}% to {after}% by fine-tuning YOLOv8 on {images}K images across {classes} classes.
- **C (Impact-led):** Achieved {map}% mAP and cut false positives from {before}% to {after}%; fine-tuned YOLOv8 on {images}K images across {classes} classes for {devices} edge devices at {frames}K FPS.
- **D (Concise):** Fine-tuned YOLOv8 on {images}K images across {classes} classes for {devices} edges at {frames}K FPS, {map}% mAP, false positives from {before}% to {after}%.

**Variables:**
  - `{images}`: 10 to 1000, step 10 (integer)
  - `{classes}`: 5 to 100, step 5 (integer)
  - `{devices}`: 10 to 1000, step 10 (integer)
  - `{frames}`: 10 to 120, step 10 (integer)
  - `{map}`: 70 to 95, step 5 (percentage)
  - `{before}`: 15 to 40, step 5 (percentage)
  - `{after}`: 2 to 8, step 1 (percentage)

### DATA-0260
**Role:** bi-analyst | **Theme:** supply-chain-dashboard | **Seniority:** mid | **Verb Context:** systems
**Keywords:** supply chain analytics, supplier analytics, procurement dashboard, order analytics, lead time analytics, OTIF

**Scope:** a supply chain performance dashboard tracking {metrics} KPIs including OTIF, lead time, supplier reliability, and order fill rate across {suppliers} suppliers and {categories} spend categories
**Result:** improving OTIF rate from {before}% to {after}% and reducing average supplier lead time from {lt_before} days to {lt_after} days

**Variations:**
- **A (Standard):** Built supply chain dashboard for {suppliers} suppliers and {categories} categories tracking {metrics} KPIs, improving OTIF from {before}% to {after}% and cutting lead time from {lt_before} to {lt_after} days.
- **B (Result-first):** Improved OTIF from {before}% to {after}% and cut lead time from {lt_before} to {lt_after} days by building supply chain dashboard for {suppliers} suppliers across {metrics} KPIs.
- **C (Impact-led):** Improved OTIF from {before}% to {after}% and cut lead time from {lt_before} to {lt_after} days; built supply chain dashboard for {suppliers} suppliers and {categories} categories.
- **D (Concise):** Built supply chain dashboard for {suppliers} suppliers and {categories} categories across {metrics} KPIs, OTIF from {before}% to {after}%, lead time from {lt_before} to {lt_after} days.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{suppliers}`: 20 to 500, step 20 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{before}`: 75 to 90, step 5 (percentage)
  - `{after}`: 92 to 99, step 1 (percentage)
  - `{lt_before}`: 20 to 60, step 5 (integer)
  - `{lt_after}`: 5 to 15, step 2 (integer)

### DATA-0261
**Role:** data-engineer | **Theme:** event-replay | **Seniority:** senior | **Verb Context:** systems
**Keywords:** event replay, backfill, historical reprocessing, Kafka replay, event store replay, late-data backfill

**Scope:** an event replay and backfill system enabling historical reprocessing of {events}M events across {topics} Kafka topics for {use_cases} use cases including bug fixes, model retraining, and schema migrations
**Result:** reducing backfill job execution time from {before} hours to {after} hours and supporting {reprocessing_runs} reprocessing runs per quarter without disrupting live consumers

**Variations:**
- **A (Standard):** Built event replay for {events}M events across {topics} topics supporting {use_cases} use cases, cutting backfill from {before} to {after} hours and supporting {reprocessing_runs} runs/quarter without live disruption.
- **B (Result-first):** Reduced backfill from {before} to {after} hours and supported {reprocessing_runs} runs/quarter without disruption by building replay for {events}M events across {topics} topics.
- **C (Impact-led):** Cut backfill from {before} to {after} hours and enabled {reprocessing_runs} runs/quarter without disruption; built replay for {events}M events across {topics} topics for {use_cases} use cases.
- **D (Concise):** Built event replay for {events}M events across {topics} topics, backfill from {before} to {after}h, {reprocessing_runs} runs/quarter without disruption.

**Variables:**
  - `{events}`: 10 to 1000, step 10 (integer)
  - `{topics}`: 10 to 200, step 10 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{before}`: 6 to 48, step 6 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{reprocessing_runs}`: 5 to 30, step 5 (integer)

### DATA-0262
**Role:** data-analyst | **Theme:** logistics-cost-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** logistics cost analytics, freight analytics, shipping cost, rate analytics, lane analytics, cost-per-shipment

**Scope:** a logistics cost analytics platform tracking ${spend}M in annual freight spend across {lanes} shipping lanes, {carriers} carriers, and {modes} transport modes with rate benchmarking and cost-per-unit analysis
**Result:** identifying ${savings}K in contract renegotiation savings and reducing cost per shipment from ${before} to ${after}

**Variations:**
- **A (Standard):** Built logistics cost analytics for ${spend}M freight across {lanes} lanes, {carriers} carriers, and {modes} modes, identifying ${savings}K in renegotiation savings and cutting cost per shipment from ${before} to ${after}.
- **B (Result-first):** Identified ${savings}K in renegotiation savings and cut cost per shipment from ${before} to ${after} by building logistics cost analytics for ${spend}M across {carriers} carriers and {lanes} lanes.
- **C (Impact-led):** Identified ${savings}K in savings and cut cost per shipment from ${before} to ${after}; built logistics cost analytics for ${spend}M across {lanes} lanes, {carriers} carriers, and {modes} modes.
- **D (Concise):** Built logistics cost analytics for ${spend}M across {lanes} lanes and {carriers} carriers, ${savings}K savings identified, cost per shipment from ${before} to ${after}.

**Variables:**
  - `{spend}`: 10 to 500, step 10 (currency)
  - `{lanes}`: 50 to 2000, step 50 (integer)
  - `{carriers}`: 5 to 50, step 5 (integer)
  - `{modes}`: 3 to 6, step 1 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{before}`: 50 to 500, step 50 (currency)
  - `{after}`: 20 to 200, step 20 (currency)

### DATA-0263
**Role:** ml-engineer | **Theme:** tabular-deep-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** tabular deep learning, TabNet, FT-Transformer, neural tabular, deep learning tabular data, tabular modeling

**Scope:** a tabular deep learning framework comparing FT-Transformer and gradient boosting baselines for {tasks} prediction tasks across {features} features and {samples}M training samples
**Result:** improving average task AUC from {before} to {after} over XGBoost baselines and identifying {tasks} tasks where deep learning provides statistically significant gains

**Variations:**
- **A (Standard):** Evaluated FT-Transformer versus GBM for {tasks} tasks across {features} features and {samples}M samples, improving average AUC from {before} to {after} over XGBoost and identifying {tasks} tasks with significant gains.
- **B (Result-first):** Improved average AUC from {before} to {after} over XGBoost and identified significant gains on {tasks} tasks by evaluating FT-Transformer across {features} features and {samples}M samples.
- **C (Impact-led):** Improved average AUC from {before} to {after} over XGBoost and identified gains on {tasks} tasks; evaluated FT-Transformer versus GBM for {tasks} tasks across {features} features and {samples}M samples.
- **D (Concise):** Evaluated FT-Transformer versus GBM for {tasks} tasks at {features} features and {samples}M samples, AUC from {before} to {after} over XGBoost, significant gains on {tasks} tasks.

**Variables:**
  - `{tasks}`: 5 to 20, step 5 (integer)
  - `{features}`: 20 to 500, step 20 (integer)
  - `{samples}`: 0.1 to 50, step 1 (integer)
  - `{before}`: 0.78 to 0.85, step 0.01 (integer)
  - `{after}`: 0.87 to 0.96, step 0.01 (integer)

### DATA-0264
**Role:** data-analyst | **Theme:** network-ops-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** network analytics, NOC analytics, incident analytics, uptime analytics, SLA analytics, performance analytics

**Scope:** a network operations analytics platform tracking {metrics} network KPIs across {nodes} infrastructure nodes and {circuits} circuits, with SLA breach alerting and incident trend analysis for {teams} NOC teams
**Result:** reducing mean time to resolve network incidents from {mttr_before} hours to {mttr_after} minutes and improving network SLA compliance from {before}% to {after}%

**Variations:**
- **A (Standard):** Built NOC analytics for {nodes} nodes and {circuits} circuits tracking {metrics} KPIs, cutting MTTR from {mttr_before}h to {mttr_after}min and improving SLA compliance from {before}% to {after}%.
- **B (Result-first):** Reduced MTTR from {mttr_before}h to {mttr_after}min and improved SLA compliance from {before}% to {after}% by building NOC analytics for {nodes} nodes and {circuits} circuits.
- **C (Impact-led):** Cut MTTR from {mttr_before}h to {mttr_after}min and improved SLA compliance from {before}% to {after}%; built NOC analytics tracking {metrics} KPIs across {nodes} nodes and {circuits} circuits.
- **D (Concise):** Built NOC analytics for {nodes} nodes and {circuits} circuits across {metrics} KPIs, MTTR from {mttr_before}h to {mttr_after}min, SLA from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{nodes}`: 100 to 10000, step 100 (integer)
  - `{circuits}`: 50 to 2000, step 50 (integer)
  - `{teams}`: 3 to 10, step 1 (integer)
  - `{mttr_before}`: 2 to 12, step 2 (integer)
  - `{mttr_after}`: 10 to 45, step 5 (integer)
  - `{before}`: 95 to 98, step 1 (percentage)
  - `{after}`: 99 to 100, step 0.1 (percentage)

### DATA-0265
**Role:** data-engineer | **Theme:** configuration-driven-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** configuration-driven, declarative pipelines, YAML pipelines, low-code ETL, self-service ETL, template pipelines

**Scope:** a configuration-driven pipeline framework allowing {teams} analyst teams to define {pipelines} pipelines via YAML templates, reducing the need for custom code for {use_case_types} common ingestion and transformation use case types
**Result:** reducing new pipeline build time from {before} days to {after} hours and enabling {teams} analyst teams to self-serve {pipelines_self_serve}% of new pipeline requests

**Variations:**
- **A (Standard):** Built YAML-driven pipeline framework for {teams} teams covering {use_case_types} use case types, cutting build time from {before} days to {after} hours and enabling {pipelines_self_serve}% self-serve coverage.
- **B (Result-first):** Reduced build time from {before} days to {after} hours and enabled {pipelines_self_serve}% self-serve by building YAML pipeline framework for {teams} teams across {use_case_types} use case types.
- **C (Impact-led):** Cut build time from {before} days to {after} hours and enabled {pipelines_self_serve}% self-serve; built YAML-driven framework for {teams} teams covering {use_case_types} use case types.
- **D (Concise):** Built YAML pipeline framework for {teams} teams across {use_case_types} use case types, build time from {before}d to {after}h, {pipelines_self_serve}% self-serve.

**Variables:**
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{pipelines}`: 50 to 500, step 50 (integer)
  - `{use_case_types}`: 5 to 20, step 5 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{pipelines_self_serve}`: 50 to 85, step 5 (percentage)

### DATA-0266
**Role:** data-scientist | **Theme:** portfolio-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** portfolio optimization, mean-variance optimization, Markowitz, efficient frontier, risk-return, asset allocation

**Scope:** a portfolio optimization engine using mean-variance optimization with {constraints} business and regulatory constraints across {assets} assets and {scenarios} Monte Carlo scenarios for {portfolios} managed portfolios
**Result:** improving risk-adjusted return by {sharpe}% Sharpe ratio improvement and reducing max drawdown from {before}% to {after}% versus equal-weight benchmarks

**Variations:**
- **A (Standard):** Built mean-variance optimization engine for {assets} assets across {constraints} constraints and {scenarios} scenarios for {portfolios} portfolios, improving Sharpe {sharpe}% and reducing max drawdown from {before}% to {after}%.
- **B (Result-first):** Improved Sharpe {sharpe}% and reduced max drawdown from {before}% to {after}% by building MVO engine for {assets} assets across {constraints} constraints and {scenarios} scenarios.
- **C (Impact-led):** Improved Sharpe {sharpe}% and cut drawdown from {before}% to {after}%; built MVO engine for {assets} assets across {constraints} constraints and {scenarios} Monte Carlo scenarios.
- **D (Concise):** Built MVO engine for {assets} assets across {constraints} constraints and {scenarios} scenarios, Sharpe up {sharpe}%, drawdown from {before}% to {after}%.

**Variables:**
  - `{assets}`: 20 to 500, step 20 (integer)
  - `{constraints}`: 5 to 30, step 5 (integer)
  - `{scenarios}`: 1000 to 100000, step 1000 (integer)
  - `{portfolios}`: 10 to 200, step 10 (integer)
  - `{sharpe}`: 10 to 40, step 5 (percentage)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 8 to 15, step 1 (percentage)

### DATA-0267
**Role:** data-analyst | **Theme:** app-store-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** app store analytics, ASO analytics, app rating analytics, review analytics, store performance, install analytics

**Scope:** an app store analytics platform tracking {metrics} performance metrics across {apps} apps and {markets} markets including ratings, reviews, installs, and keyword rankings on iOS and Android
**Result:** identifying {optimizations} ASO improvements that increased organic install rate by {installs}% and improved average app rating from {before} to {after}/5

**Variations:**
- **A (Standard):** Built app store analytics for {apps} apps across {markets} markets tracking {metrics} metrics, identifying {optimizations} improvements that grew organic installs {installs}% and improved rating from {before} to {after}/5.
- **B (Result-first):** Grew organic installs {installs}% and improved rating from {before} to {after}/5 by building app store analytics for {apps} apps across {markets} markets.
- **C (Impact-led):** Grew organic installs {installs}% and improved rating from {before} to {after}/5; built app store analytics for {apps} apps across {metrics} metrics and {markets} markets.
- **D (Concise):** Built app store analytics for {apps} apps across {metrics} metrics and {markets} markets, {optimizations} improvements, installs up {installs}%, rating from {before} to {after}/5.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{apps}`: 1 to 20, step 1 (integer)
  - `{markets}`: 5 to 50, step 5 (integer)
  - `{optimizations}`: 3 to 15, step 3 (integer)
  - `{installs}`: 15 to 60, step 5 (percentage)
  - `{before}`: 3 to 3.8, step 0.2 (integer)
  - `{after}`: 4 to 4.9, step 0.1 (integer)

### DATA-0268
**Role:** data-engineer | **Theme:** cloud-cost-tagging | **Seniority:** mid | **Verb Context:** operations
**Keywords:** cloud cost allocation, tagging strategy, FinOps, cost showback, chargeback, cloud tagging governance

**Scope:** a cloud cost tagging and allocation strategy across {resources}K cloud resources in {accounts} AWS accounts, implementing {tags} mandatory tags for {teams} team cost showback and chargeback across {cost_centers} cost centers
**Result:** increasing tagged resource coverage from {before}% to {after}% and enabling ${allocated}K in monthly spend to be allocated to responsible teams for the first time

**Variations:**
- **A (Standard):** Implemented cloud tagging for {resources}K resources across {accounts} accounts with {tags} tags, growing coverage from {before}% to {after}% and enabling ${allocated}K in monthly spend allocation.
- **B (Result-first):** Grew tagged coverage from {before}% to {after}% and enabled ${allocated}K in monthly allocation by implementing {tags} tags across {resources}K resources and {accounts} accounts.
- **C (Impact-led):** Grew coverage from {before}% to {after}% and enabled ${allocated}K in monthly spend allocation; implemented tagging for {resources}K resources across {accounts} accounts with {tags} mandatory tags.
- **D (Concise):** Implemented {tags} tags for {resources}K resources across {accounts} accounts, coverage from {before}% to {after}%, ${allocated}K/month spend allocated.

**Variables:**
  - `{resources}`: 1 to 100, step 5 (integer)
  - `{accounts}`: 5 to 50, step 5 (integer)
  - `{tags}`: 5 to 20, step 5 (integer)
  - `{teams}`: 10 to 100, step 10 (integer)
  - `{cost_centers}`: 5 to 50, step 5 (integer)
  - `{before}`: 20 to 50, step 5 (percentage)
  - `{after}`: 90 to 100, step 2 (percentage)
  - `{allocated}`: 50 to 2000, step 50 (currency)

### DATA-0269
**Role:** data-scientist | **Theme:** class-imbalance | **Seniority:** mid | **Verb Context:** systems
**Keywords:** class imbalance, SMOTE, undersampling, oversampling, imbalanced learning, minority class, precision-recall

**Scope:** a class imbalance handling framework for {models} production binary classifiers with imbalance ratios ranging from {ratio_min}:1 to {ratio_max}:1, applying SMOTE, class weighting, and threshold optimization
**Result:** improving minority class recall from {before}% to {after}% while maintaining precision above {precision}% across {models} production models

**Variations:**
- **A (Standard):** Applied SMOTE, weighting, and threshold optimization to {models} classifiers with {ratio_min}:{ratio_max} imbalance, improving minority recall from {before}% to {after}% while maintaining {precision}% precision.
- **B (Result-first):** Improved minority recall from {before}% to {after}% while maintaining {precision}% precision by applying SMOTE and threshold optimization to {models} classifiers.
- **C (Impact-led):** Improved minority recall from {before}% to {after}% while maintaining {precision}% precision; applied SMOTE, weighting, and threshold optimization to {models} classifiers with {ratio_max}:1 imbalance.
- **D (Concise):** Applied imbalance handling for {models} classifiers at up to {ratio_max}:1, minority recall from {before}% to {after}%, precision above {precision}%.

**Variables:**
  - `{models}`: 5 to 20, step 5 (integer)
  - `{ratio_min}`: 10 to 50, step 10 (integer)
  - `{ratio_max}`: 50 to 500, step 50 (integer)
  - `{before}`: 20 to 50, step 5 (percentage)
  - `{after}`: 65 to 90, step 5 (percentage)
  - `{precision}`: 70 to 90, step 5 (percentage)

### DATA-0270
**Role:** bi-analyst | **Theme:** tender-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** tender analytics, bid analytics, RFP analytics, win rate analytics, quote analytics, bid-to-win

**Scope:** a tender and bid analytics platform tracking {metrics} bid performance metrics across {tenders}K annual tenders and ${value}M in bid value, with win rate analysis by {dimensions} competitive dimensions
**Result:** identifying {factors} win/loss factors that improved bid win rate from {before}% to {after}% and increased total awarded value by ${awarded}K annually

**Variations:**
- **A (Standard):** Built tender analytics for {tenders}K tenders at ${value}M tracking {metrics} metrics, identifying {factors} win/loss factors that improved win rate from {before}% to {after}% and grew awarded value ${awarded}K annually.
- **B (Result-first):** Improved win rate from {before}% to {after}% and grew awarded value ${awarded}K by building tender analytics for {tenders}K tenders and identifying {factors} win/loss factors.
- **C (Impact-led):** Improved win rate from {before}% to {after}% and grew awarded value ${awarded}K; built tender analytics for {tenders}K tenders at ${value}M across {metrics} metrics.
- **D (Concise):** Built tender analytics for {tenders}K tenders at ${value}M across {metrics} metrics, {factors} factors identified, win rate from {before}% to {after}%, ${awarded}K awarded annually.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{tenders}`: 1 to 50, step 5 (integer)
  - `{value}`: 10 to 1000, step 50 (currency)
  - `{dimensions}`: 3 to 10, step 1 (integer)
  - `{factors}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 40 to 65, step 5 (percentage)
  - `{awarded}`: 100 to 5000, step 100 (currency)

### DATA-0271
**Role:** data-engineer | **Theme:** data-pipeline-alerting | **Seniority:** junior | **Verb Context:** systems
**Keywords:** pipeline alerting, PagerDuty, Slack alerts, data alerts, threshold alerting, on-call data

**Scope:** a pipeline alerting system with {alerts} configured alerts across {pipelines} pipelines integrated with PagerDuty and Slack, covering failure, SLA breach, and anomaly conditions for {teams} on-call teams
**Result:** reducing time-to-alert for pipeline failures from {before} minutes to {after} minutes and cutting false positive alerts from {fp_before} to {fp_after} per week

**Variations:**
- **A (Standard):** Built pipeline alerting with {alerts} alerts across {pipelines} pipelines via PagerDuty and Slack for {teams} teams, cutting time-to-alert from {before} to {after} minutes and false positives from {fp_before} to {fp_after}/week.
- **B (Result-first):** Reduced time-to-alert from {before} to {after} minutes and false positives from {fp_before} to {fp_after}/week by building {alerts} alerts across {pipelines} pipelines.
- **C (Impact-led):** Cut time-to-alert from {before} to {after} minutes and false positives from {fp_before} to {fp_after}/week; built {alerts} pipeline alerts across {pipelines} pipelines for {teams} on-call teams.
- **D (Concise):** Built {alerts} alerts across {pipelines} pipelines for {teams} teams, time-to-alert from {before} to {after}min, false positives from {fp_before} to {fp_after}/week.

**Variables:**
  - `{alerts}`: 50 to 500, step 50 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{teams}`: 2 to 10, step 1 (integer)
  - `{before}`: 15 to 60, step 15 (integer)
  - `{after}`: 1 to 5, step 1 (integer)
  - `{fp_before}`: 20 to 100, step 10 (integer)
  - `{fp_after}`: 2 to 8, step 2 (integer)

### DATA-0272
**Role:** data-scientist | **Theme:** insurance-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** insurance analytics, loss ratio, claims analytics, risk pricing, actuarial analytics, underwriting analytics

**Scope:** a claims and risk analytics model combining {features} actuarial and behavioral features across {policies}K active policies and {claims}K historical claims for {lines} lines of business
**Result:** improving loss ratio prediction accuracy by {accuracy}% and enabling premium pricing that reduced combined ratio from {before}% to {after}%

**Variations:**
- **A (Standard):** Built claims analytics model on {features} features for {policies}K policies and {claims}K claims across {lines} lines, improving loss ratio accuracy {accuracy}% and reducing combined ratio from {before}% to {after}%.
- **B (Result-first):** Improved loss ratio accuracy {accuracy}% and reduced combined ratio from {before}% to {after}% by building analytics on {features} features for {policies}K policies.
- **C (Impact-led):** Improved loss ratio accuracy {accuracy}% and reduced combined ratio from {before}% to {after}%; built claims analytics on {features} features for {policies}K policies and {claims}K claims.
- **D (Concise):** Built claims analytics for {policies}K policies and {claims}K claims on {features} features across {lines} lines, accuracy up {accuracy}%, combined ratio from {before}% to {after}%.

**Variables:**
  - `{features}`: 30 to 200, step 10 (integer)
  - `{policies}`: 10 to 1000, step 10 (integer)
  - `{claims}`: 1 to 100, step 5 (integer)
  - `{lines}`: 2 to 8, step 1 (integer)
  - `{accuracy}`: 10 to 30, step 5 (percentage)
  - `{before}`: 95 to 110, step 5 (percentage)
  - `{after}`: 80 to 94, step 2 (percentage)

### DATA-0273
**Role:** data-engineer | **Theme:** cloud-native-pipeline | **Seniority:** mid | **Verb Context:** systems
**Keywords:** cloud-native, serverless pipelines, Lambda pipelines, GCP Dataflow, event-driven ETL, managed services

**Scope:** a cloud-native serverless data pipeline on AWS Lambda and Step Functions replacing {jobs} EC2-hosted batch jobs, processing {events}M events per day with auto-scaling across {peak_multiplier}x peak-to-baseline traffic ratios
**Result:** reducing pipeline infrastructure cost by ${savings}K per month and eliminating {incidents} capacity-related pipeline incidents per quarter

**Variations:**
- **A (Standard):** Migrated {jobs} EC2 batch jobs to Lambda and Step Functions at {events}M events/day with {peak_multiplier}x auto-scaling, saving ${savings}K/month and eliminating {incidents} capacity incidents/quarter.
- **B (Result-first):** Saved ${savings}K/month and eliminated {incidents} capacity incidents/quarter by migrating {jobs} EC2 jobs to serverless Lambda and Step Functions at {events}M events/day.
- **C (Impact-led):** Saved ${savings}K/month and eliminated {incidents} capacity incidents/quarter; migrated {jobs} EC2 jobs to serverless at {events}M events/day with {peak_multiplier}x auto-scaling.
- **D (Concise):** Migrated {jobs} EC2 jobs to serverless Lambda and Step Functions at {events}M events/day, ${savings}K/month saved, {incidents} capacity incidents eliminated/quarter.

**Variables:**
  - `{jobs}`: 20 to 200, step 20 (integer)
  - `{events}`: 1 to 500, step 10 (integer)
  - `{peak_multiplier}`: 3 to 20, step 1 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)
  - `{incidents}`: 5 to 30, step 5 (integer)

### DATA-0274
**Role:** data-analyst | **Theme:** manufacturing-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** manufacturing analytics, OEE, production analytics, yield analytics, defect analytics, throughput analytics

**Scope:** a manufacturing analytics platform tracking {metrics} production KPIs including OEE, cycle time, yield, and scrap rate across {lines} production lines and {plants} plant facilities
**Result:** improving overall equipment effectiveness from {oee_before}% to {oee_after}% and reducing scrap rate from {scrap_before}% to {scrap_after}%

**Variations:**
- **A (Standard):** Built manufacturing analytics for {lines} lines across {plants} plants tracking {metrics} KPIs, improving OEE from {oee_before}% to {oee_after}% and cutting scrap from {scrap_before}% to {scrap_after}%.
- **B (Result-first):** Improved OEE from {oee_before}% to {oee_after}% and cut scrap from {scrap_before}% to {scrap_after}% by building manufacturing analytics for {lines} lines across {plants} plants.
- **C (Impact-led):** Improved OEE from {oee_before}% to {oee_after}% and cut scrap from {scrap_before}% to {scrap_after}%; built manufacturing analytics tracking {metrics} KPIs across {lines} lines and {plants} plants.
- **D (Concise):** Built manufacturing analytics for {lines} lines across {plants} plants with {metrics} KPIs, OEE from {oee_before}% to {oee_after}%, scrap from {scrap_before}% to {scrap_after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{lines}`: 5 to 50, step 5 (integer)
  - `{plants}`: 2 to 20, step 2 (integer)
  - `{oee_before}`: 55 to 72, step 5 (percentage)
  - `{oee_after}`: 78 to 92, step 2 (percentage)
  - `{scrap_before}`: 5 to 15, step 2 (percentage)
  - `{scrap_after}`: 1 to 4, step 1 (percentage)

### DATA-0275
**Role:** ml-engineer | **Theme:** mlops-monitoring | **Seniority:** senior | **Verb Context:** systems
**Keywords:** MLOps monitoring, model drift, data drift, PSI, KS test, model health monitoring, production ML monitoring

**Scope:** an MLOps monitoring system tracking data drift, prediction drift, and model performance degradation for {models} production models using PSI and KS tests across {features} features and {outputs} output distributions
**Result:** detecting {drift_cases} model drift events before they caused measurable business impact and reducing mean time to retrain from {before} weeks to {after} days

**Variations:**
- **A (Standard):** Built MLOps monitoring for {models} models tracking drift across {features} features and {outputs} outputs, detecting {drift_cases} events pre-impact and cutting mean time to retrain from {before} weeks to {after} days.
- **B (Result-first):** Detected {drift_cases} drift events pre-impact and cut mean retraining time from {before} weeks to {after} days by building MLOps monitoring for {models} models.
- **C (Impact-led):** Detected {drift_cases} events pre-impact and cut retraining time from {before} weeks to {after} days; built MLOps monitoring for {models} models tracking drift across {features} features and {outputs} outputs.
- **D (Concise):** Built MLOps monitoring for {models} models across {features} features and {outputs} outputs, {drift_cases} events detected pre-impact, retraining from {before}wk to {after}d.

**Variables:**
  - `{models}`: 10 to 100, step 10 (integer)
  - `{features}`: 20 to 500, step 20 (integer)
  - `{outputs}`: 1 to 5, step 1 (integer)
  - `{drift_cases}`: 5 to 30, step 5 (integer)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0276
**Role:** data-analyst | **Theme:** fraud-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** fraud analytics, transaction monitoring, fraud detection analytics, rule analytics, fraud dashboard, loss analytics

**Scope:** a fraud analytics platform tracking {metrics} fraud KPIs across {transaction_types} transaction types and {channels} channels, with rule performance analysis and fraud loss reporting for ${losses}M in annual monitored value
**Result:** improving fraud detection rate from {before}% to {after}% and reducing false positive rate from {fp_before}% to {fp_after}% without increasing review capacity

**Variations:**
- **A (Standard):** Built fraud analytics for ${losses}M across {transaction_types} transaction types and {channels} channels tracking {metrics} KPIs, improving detection from {before}% to {after}% and cutting false positives from {fp_before}% to {fp_after}%.
- **B (Result-first):** Improved detection from {before}% to {after}% and cut false positives from {fp_before}% to {fp_after}% by building fraud analytics across {transaction_types} types and {channels} channels.
- **C (Impact-led):** Improved detection from {before}% to {after}% and cut false positives from {fp_before}% to {fp_after}%; built fraud analytics for ${losses}M across {transaction_types} types and {channels} channels.
- **D (Concise):** Built fraud analytics for ${losses}M across {transaction_types} types and {channels} channels, detection from {before}% to {after}%, false positives from {fp_before}% to {fp_after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{transaction_types}`: 3 to 10, step 1 (integer)
  - `{channels}`: 3 to 8, step 1 (integer)
  - `{losses}`: 10 to 1000, step 50 (currency)
  - `{before}`: 60 to 80, step 5 (percentage)
  - `{after}`: 85 to 98, step 2 (percentage)
  - `{fp_before}`: 20 to 50, step 5 (percentage)
  - `{fp_after}`: 3 to 10, step 1 (percentage)

### DATA-0277
**Role:** data-engineer | **Theme:** lakehouse-governance | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Unity Catalog, Databricks governance, Delta Lake governance, lakehouse access control, data governance, catalog policies

**Scope:** a Unity Catalog governance implementation for a Databricks lakehouse with {tables}K tables, {users}K users, and {groups} access groups across {workspaces} workspaces and {environments} environments
**Result:** achieving {compliance}% fine-grained access compliance and reducing unauthorized data access incidents from {before} to {after} per quarter

**Variations:**
- **A (Standard):** Deployed Unity Catalog for {tables}K tables and {users}K users across {workspaces} workspaces and {environments} environments, achieving {compliance}% compliance and cutting access incidents from {before} to {after}/quarter.
- **B (Result-first):** Achieved {compliance}% compliance and cut access incidents from {before} to {after}/quarter by deploying Unity Catalog for {tables}K tables and {users}K users across {workspaces} workspaces.
- **C (Impact-led):** Reached {compliance}% compliance and cut incidents from {before} to {after}/quarter; deployed Unity Catalog for {tables}K tables and {users}K users across {workspaces} workspaces and {environments} environments.
- **D (Concise):** Deployed Unity Catalog for {tables}K tables and {users}K users across {workspaces} workspaces and {environments} environments, {compliance}% compliance, incidents from {before} to {after}/quarter.

**Variables:**
  - `{tables}`: 1 to 100, step 5 (integer)
  - `{users}`: 50 to 2000, step 50 (integer)
  - `{groups}`: 20 to 200, step 20 (integer)
  - `{workspaces}`: 2 to 10, step 1 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 0 to 2, step 1 (integer)

### DATA-0278
**Role:** data-analyst | **Theme:** insurance-claims-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** claims analytics, claims processing, claims dashboard, claims metrics, cycle time analytics, settlement analytics

**Scope:** a claims processing analytics dashboard tracking {metrics} operational metrics across {claims}K annual claims and {adjusters} adjusters, covering cycle time, settlement rates, and adjuster productivity
**Result:** identifying {bottlenecks} processing bottlenecks that reduced average claims cycle time from {before} days to {after} days and improved adjuster productivity by {productivity}%

**Variations:**
- **A (Standard):** Built claims analytics for {claims}K claims and {adjusters} adjusters tracking {metrics} metrics, identifying {bottlenecks} bottlenecks that cut cycle time from {before} to {after} days and improved productivity {productivity}%.
- **B (Result-first):** Reduced cycle time from {before} to {after} days and improved productivity {productivity}% by building claims analytics for {claims}K claims and identifying {bottlenecks} bottlenecks.
- **C (Impact-led):** Cut cycle time from {before} to {after} days and improved productivity {productivity}%; built claims analytics for {claims}K claims and {adjusters} adjusters tracking {metrics} metrics.
- **D (Concise):** Built claims analytics for {claims}K claims and {adjusters} adjusters across {metrics} metrics, {bottlenecks} bottlenecks found, cycle from {before} to {after} days, productivity up {productivity}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{claims}`: 10 to 500, step 10 (integer)
  - `{adjusters}`: 10 to 200, step 10 (integer)
  - `{bottlenecks}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 60, step 5 (integer)
  - `{after}`: 5 to 15, step 2 (integer)
  - `{productivity}`: 15 to 50, step 5 (percentage)

### DATA-0279
**Role:** ml-engineer | **Theme:** knowledge-graph | **Seniority:** senior | **Verb Context:** systems
**Keywords:** knowledge graph, entity linking, relation extraction, Neo4j, ontology, graph reasoning, knowledge base

**Scope:** a domain knowledge graph built in Neo4j with {entities}M entities, {relations}M relations, and {ontology_classes} ontology classes, populated via entity linking and relation extraction from {documents}K source documents
**Result:** enabling {use_cases} knowledge-graph-powered use cases and improving entity disambiguation accuracy from {before}% to {after}%

**Variations:**
- **A (Standard):** Built Neo4j knowledge graph with {entities}M entities and {relations}M relations from {documents}K documents, enabling {use_cases} use cases and improving disambiguation from {before}% to {after}%.
- **B (Result-first):** Improved disambiguation from {before}% to {after}% and enabled {use_cases} use cases by building Neo4j knowledge graph with {entities}M entities and {relations}M relations.
- **C (Impact-led):** Improved disambiguation from {before}% to {after}% and enabled {use_cases} use cases; built Neo4j knowledge graph with {entities}M entities, {relations}M relations, and {ontology_classes} ontology classes.
- **D (Concise):** Built Neo4j knowledge graph with {entities}M entities and {relations}M relations from {documents}K docs, disambiguation from {before}% to {after}%, {use_cases} use cases enabled.

**Variables:**
  - `{entities}`: 0.1 to 100, step 1 (integer)
  - `{relations}`: 0.5 to 500, step 5 (integer)
  - `{ontology_classes}`: 50 to 1000, step 50 (integer)
  - `{documents}`: 10 to 1000, step 10 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{before}`: 60 to 75, step 5 (percentage)
  - `{after}`: 85 to 97, step 2 (percentage)

### DATA-0280
**Role:** data-analyst | **Theme:** capacity-utilization-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** capacity analytics, utilization analytics, headroom analysis, capacity planning, resource utilization, saturation analytics

**Scope:** a capacity and utilization analytics platform for a ${assets}M asset base tracking {metrics} utilization metrics across {asset_types} asset categories and {locations} locations, with forecasted capacity headroom over {horizons} planning horizons
**Result:** preventing {prevented} over-capacity incidents through proactive planning and improving average asset utilization from {before}% to {after}%

**Variations:**
- **A (Standard):** Built capacity analytics for ${assets}M assets across {asset_types} categories and {locations} locations tracking {metrics} metrics, preventing {prevented} incidents and improving utilization from {before}% to {after}%.
- **B (Result-first):** Prevented {prevented} incidents and improved utilization from {before}% to {after}% by building capacity analytics for ${assets}M assets across {asset_types} categories.
- **C (Impact-led):** Prevented {prevented} over-capacity incidents and improved utilization from {before}% to {after}%; built capacity analytics for ${assets}M assets across {asset_types} categories and {locations} locations.
- **D (Concise):** Built capacity analytics for ${assets}M assets across {asset_types} types and {locations} locations, {prevented} incidents prevented, utilization from {before}% to {after}%.

**Variables:**
  - `{assets}`: 10 to 1000, step 50 (currency)
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{asset_types}`: 3 to 15, step 3 (integer)
  - `{locations}`: 5 to 100, step 5 (integer)
  - `{horizons}`: 1 to 3, step 1 (integer)
  - `{prevented}`: 5 to 30, step 5 (integer)
  - `{before}`: 50 to 70, step 5 (percentage)
  - `{after}`: 80 to 95, step 5 (percentage)

### DATA-0281
**Role:** data-engineer | **Theme:** pipeline-versioning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline versioning, code versioning, Git data pipelines, reproducibility, pipeline releases, version control

**Scope:** a pipeline versioning and release management framework for {pipelines} data pipelines using Git-based versioning and {environments} environment promotion gates, enabling rollback for {runs} daily pipeline runs
**Result:** reducing rollback time from {before} hours to {after} minutes and achieving {reproducible}% of pipeline runs being fully reproducible from version history

**Variations:**
- **A (Standard):** Implemented Git-based versioning for {pipelines} pipelines with {environments} environment gates, cutting rollback from {before}h to {after}min and achieving {reproducible}% reproducibility across {runs} daily runs.
- **B (Result-first):** Reduced rollback from {before}h to {after}min and achieved {reproducible}% reproducibility by implementing Git versioning for {pipelines} pipelines across {environments} environments.
- **C (Impact-led):** Cut rollback from {before}h to {after}min and achieved {reproducible}% reproducibility; implemented Git versioning for {pipelines} pipelines across {environments} environment gates.
- **D (Concise):** Implemented Git versioning for {pipelines} pipelines across {environments} environments, rollback from {before}h to {after}min, {reproducible}% reproducibility.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{runs}`: 100 to 2000, step 100 (integer)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 30, step 5 (integer)
  - `{reproducible}`: 90 to 100, step 2 (percentage)

### DATA-0282
**Role:** data-scientist | **Theme:** rl-for-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** reinforcement learning optimization, PPO, DQN, sequential decision making, operational RL, resource allocation RL

**Scope:** a deep RL agent using PPO for {problem} operational optimization across a {state_dims}-dimensional state space and {actions} discrete actions, trained via simulation with {simulations}M environment steps
**Result:** outperforming rule-based baselines by {improvement}% on the primary optimization metric and reducing operational costs by ${savings}K per month

**Variations:**
- **A (Standard):** Trained PPO RL agent for {problem} across {state_dims} state dims and {actions} actions via {simulations}M simulation steps, outperforming baselines {improvement}% and saving ${savings}K/month.
- **B (Result-first):** Outperformed baselines {improvement}% and saved ${savings}K/month by training PPO agent for {problem} across {state_dims} state dims and {actions} actions.
- **C (Impact-led):** Outperformed baselines {improvement}% and saved ${savings}K/month; trained PPO RL for {problem} across {state_dims} state dims and {actions} actions via {simulations}M simulation steps.
- **D (Concise):** Trained PPO RL for {problem} at {state_dims} state dims and {actions} actions via {simulations}M steps, baselines outperformed {improvement}%, ${savings}K/month savings.

**Variables:**
  - `{state_dims}`: 10 to 500, step 10 (integer)
  - `{actions}`: 5 to 100, step 5 (integer)
  - `{simulations}`: 10 to 500, step 10 (integer)
  - `{improvement}`: 10 to 40, step 5 (percentage)
  - `{savings}`: 50 to 2000, step 50 (currency)

### DATA-0283
**Role:** data-analyst | **Theme:** customer-journey-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** customer journey analytics, journey mapping, touchpoint analytics, cross-channel journey, journey optimization, path analytics

**Scope:** a customer journey analytics platform mapping {journeys} journey archetypes across {touchpoints} touchpoints and {channels} channels for {customers}M customers, identifying drop-off points and high-conversion paths
**Result:** identifying {optimizations} journey optimizations that improved end-to-end conversion from {before}% to {after}% and reduced average journey completion time from {time_before} days to {time_after} days

**Variations:**
- **A (Standard):** Built journey analytics mapping {journeys} archetypes across {touchpoints} touchpoints and {channels} channels for {customers}M customers, identifying {optimizations} improvements that grew conversion from {before}% to {after}%.
- **B (Result-first):** Grew conversion from {before}% to {after}% and cut completion time from {time_before} to {time_after} days by mapping {journeys} journey archetypes across {touchpoints} touchpoints.
- **C (Impact-led):** Grew conversion from {before}% to {after}% and cut completion from {time_before} to {time_after} days; built journey analytics for {customers}M customers across {touchpoints} touchpoints and {channels} channels.
- **D (Concise):** Built journey analytics for {customers}M customers across {touchpoints} touchpoints and {channels} channels, {optimizations} improvements, conversion from {before}% to {after}%, time from {time_before} to {time_after} days.

**Variables:**
  - `{journeys}`: 5 to 20, step 5 (integer)
  - `{touchpoints}`: 10 to 100, step 10 (integer)
  - `{channels}`: 5 to 15, step 5 (integer)
  - `{customers}`: 0.1 to 50, step 0.5 (integer)
  - `{optimizations}`: 5 to 20, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (percentage)
  - `{after}`: 35 to 60, step 5 (percentage)
  - `{time_before}`: 10 to 60, step 5 (integer)
  - `{time_after}`: 3 to 10, step 1 (integer)

### DATA-0284
**Role:** data-engineer | **Theme:** dbt-project-structure | **Seniority:** senior | **Verb Context:** systems
**Keywords:** dbt project structure, dbt best practices, modular dbt, layered dbt, dbt governance, dbt standards

**Scope:** a dbt project restructure for a {models}-model project across {teams} data teams, implementing layered staging, intermediate, and mart structure with {macros} reusable macros and enforced documentation standards
**Result:** reducing average model build time from {before} minutes to {after} minutes and achieving {coverage}% model documentation coverage across the project

**Variations:**
- **A (Standard):** Restructured {models}-model dbt project for {teams} teams with layered architecture and {macros} macros, cutting build time from {before} to {after} minutes and achieving {coverage}% doc coverage.
- **B (Result-first):** Reduced build time from {before} to {after} minutes and achieved {coverage}% doc coverage by restructuring {models}-model dbt project with layered architecture for {teams} teams.
- **C (Impact-led):** Cut build time from {before} to {after} minutes and achieved {coverage}% doc coverage; restructured {models}-model dbt project for {teams} teams with layered structure and {macros} macros.
- **D (Concise):** Restructured {models}-model dbt project for {teams} teams with layered architecture and {macros} macros, build time from {before} to {after}min, {coverage}% doc coverage.

**Variables:**
  - `{models}`: 100 to 2000, step 100 (integer)
  - `{teams}`: 3 to 15, step 3 (integer)
  - `{macros}`: 10 to 100, step 10 (integer)
  - `{before}`: 20 to 90, step 10 (integer)
  - `{after}`: 5 to 15, step 5 (integer)
  - `{coverage}`: 80 to 100, step 5 (percentage)

### DATA-0285
**Role:** data-analyst | **Theme:** financial-close-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** financial close analytics, close checklist, reconciliation analytics, close cycle, journal entry analytics, period-end analytics

**Scope:** a financial close analytics platform tracking {tasks} close tasks, {reconciliations} reconciliations, and {journal_entries}K journal entries across {entities} legal entities with real-time close status for {controllers} controllers
**Result:** reducing average close cycle from {before} days to {after} days and cutting close-related restatements from {before_restate} to {after_restate} per year

**Variations:**
- **A (Standard):** Built close analytics for {tasks} tasks, {reconciliations} reconciliations, and {journal_entries}K entries across {entities} entities, cutting close from {before} to {after} days and restatements from {before_restate} to {after_restate}/year.
- **B (Result-first):** Reduced close from {before} to {after} days and restatements from {before_restate} to {after_restate}/year by building close analytics for {tasks} tasks and {reconciliations} reconciliations across {entities} entities.
- **C (Impact-led):** Cut close from {before} to {after} days and restatements from {before_restate} to {after_restate}/year; built close analytics for {tasks} tasks and {reconciliations} reconciliations across {entities} entities.
- **D (Concise):** Built close analytics for {tasks} tasks and {reconciliations} reconciliations across {entities} entities, close from {before} to {after} days, restatements from {before_restate} to {after_restate}/year.

**Variables:**
  - `{tasks}`: 50 to 500, step 50 (integer)
  - `{reconciliations}`: 20 to 200, step 20 (integer)
  - `{journal_entries}`: 10 to 500, step 10 (integer)
  - `{entities}`: 2 to 20, step 2 (integer)
  - `{before}`: 10 to 20, step 2 (integer)
  - `{after}`: 3 to 7, step 1 (integer)
  - `{before_restate}`: 3 to 10, step 1 (integer)
  - `{after_restate}`: 0 to 1, step 1 (integer)

### DATA-0286
**Role:** ml-engineer | **Theme:** zero-shot-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** zero-shot learning, zero-shot classification, CLIP, open-vocabulary, generalization, unseen classes

**Scope:** a zero-shot classification system using CLIP embeddings for {task} across {classes} known classes and {novel_classes} novel unseen classes, deployed for {users}K users with {qps}K daily queries
**Result:** achieving {accuracy}% zero-shot accuracy on unseen classes and eliminating the need for {labeling_hours}K hours of labeling per new class category

**Variations:**
- **A (Standard):** Built CLIP zero-shot classifier for {task} across {classes} known and {novel_classes} novel classes for {users}K users, achieving {accuracy}% on unseen classes and eliminating {labeling_hours}K labeling hours per category.
- **B (Result-first):** Achieved {accuracy}% zero-shot accuracy and eliminated {labeling_hours}K labeling hours per category by building CLIP classifier across {classes} known and {novel_classes} novel classes.
- **C (Impact-led):** Achieved {accuracy}% zero-shot accuracy and eliminated {labeling_hours}K labeling hours per category; built CLIP classifier for {task} across {classes} known and {novel_classes} novel classes.
- **D (Concise):** Built CLIP zero-shot classifier for {task} across {classes} known and {novel_classes} novel classes, {accuracy}% on unseen, {labeling_hours}K labeling hours eliminated per category.

**Variables:**
  - `{classes}`: 50 to 1000, step 50 (integer)
  - `{novel_classes}`: 10 to 200, step 10 (integer)
  - `{users}`: 1 to 50, step 5 (integer)
  - `{qps}`: 1 to 100, step 5 (integer)
  - `{accuracy}`: 65 to 88, step 3 (percentage)
  - `{labeling_hours}`: 1 to 50, step 5 (integer)

### DATA-0287
**Role:** data-engineer | **Theme:** parallel-processing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** parallel processing, concurrent execution, multiprocessing, parallel ETL, worker parallelism, distributed execution

**Scope:** a parallelism framework for {jobs} data transformation jobs using {workers} concurrent workers, replacing sequential single-threaded execution across {pipelines} pipelines processing {volume}TB of daily data
**Result:** reducing total daily processing time from {before} hours to {after} hours and improving pipeline throughput by {throughput}%

**Variations:**
- **A (Standard):** Parallelized {jobs} jobs with {workers} concurrent workers across {pipelines} pipelines at {volume}TB/day, cutting total processing from {before} to {after} hours and improving throughput {throughput}%.
- **B (Result-first):** Reduced total processing from {before} to {after} hours and improved throughput {throughput}% by parallelizing {jobs} jobs with {workers} workers.
- **C (Impact-led):** Cut processing from {before} to {after} hours and improved throughput {throughput}%; parallelized {jobs} jobs with {workers} workers across {pipelines} pipelines at {volume}TB/day.
- **D (Concise):** Parallelized {jobs} jobs with {workers} workers across {pipelines} pipelines at {volume}TB/day, processing from {before} to {after}h, throughput up {throughput}%.

**Variables:**
  - `{jobs}`: 20 to 200, step 20 (integer)
  - `{workers}`: 4 to 64, step 4 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{volume}`: 1 to 100, step 5 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 0.5 to 4, step 0.5 (integer)
  - `{throughput}`: 200 to 1000, step 100 (percentage)

### DATA-0288
**Role:** data-analyst | **Theme:** subscription-churn-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** churn analytics, voluntary churn, involuntary churn, churn reasons, cancellation analytics, win-back analytics

**Scope:** a subscription churn analytics platform tracking {metrics} churn and cancellation metrics across {segments} customer segments and {reasons} churn reason categories, with cohort churn curves and win-back effectiveness analysis
**Result:** identifying {reasons} primary churn drivers that informed retention improvements reducing monthly churn rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built churn analytics tracking {metrics} metrics across {segments} segments and {reasons} reason categories, identifying {reasons} drivers that reduced monthly churn from {before}% to {after}%.
- **B (Result-first):** Reduced monthly churn from {before}% to {after}% by building churn analytics across {segments} segments identifying {reasons} primary drivers.
- **C (Impact-led):** Reduced monthly churn from {before}% to {after}%; built churn analytics tracking {metrics} metrics across {segments} segments and {reasons} reason categories.
- **D (Concise):** Built churn analytics across {metrics} metrics, {segments} segments, and {reasons} reason categories, {reasons} drivers identified, churn from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{reasons}`: 5 to 20, step 5 (integer)
  - `{before}`: 5 to 15, step 2 (percentage)
  - `{after}`: 1 to 4, step 0.5 (percentage)

### DATA-0289
**Role:** data-engineer | **Theme:** data-pipeline-security | **Seniority:** senior | **Verb Context:** systems
**Keywords:** pipeline security, secrets management, credential rotation, vault integration, pipeline hardening, secure pipelines

**Scope:** a data pipeline security hardening initiative across {pipelines} pipelines and {services} data services, implementing Vault-based secrets management, credential rotation, and audit logging for {credentials} managed credentials
**Result:** eliminating {hardcoded} hardcoded credentials and achieving {compliance}% secrets management compliance across the data platform

**Variations:**
- **A (Standard):** Hardened {pipelines} pipelines and {services} services with Vault secrets management and rotation for {credentials} credentials, eliminating {hardcoded} hardcoded credentials and achieving {compliance}% compliance.
- **B (Result-first):** Eliminated {hardcoded} hardcoded credentials and achieved {compliance}% compliance by implementing Vault secrets management across {pipelines} pipelines and {services} services.
- **C (Impact-led):** Eliminated {hardcoded} hardcoded credentials and achieved {compliance}% compliance; hardened {pipelines} pipelines and {services} services with Vault for {credentials} credentials.
- **D (Concise):** Hardened {pipelines} pipelines and {services} services with Vault for {credentials} credentials, {hardcoded} hardcoded credentials eliminated, {compliance}% compliance.

**Variables:**
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{services}`: 10 to 100, step 10 (integer)
  - `{credentials}`: 50 to 500, step 50 (integer)
  - `{hardcoded}`: 50 to 500, step 50 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)

### DATA-0290
**Role:** data-scientist | **Theme:** synthetic-minority-oversampling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** synthetic oversampling, ADASYN, SMOTE variants, minority class generation, data balancing, training augmentation

**Scope:** a class balancing pipeline applying ADASYN and SMOTE variants to {datasets} classification datasets with imbalance ratios of {ratio}:1, generating {synthetic}K synthetic minority samples for {models} downstream classifiers
**Result:** improving average minority F1 from {before} to {after} across {models} models and reducing model retraining cycles from {retrain_before} per quarter to {retrain_after} through better initial calibration

**Variations:**
- **A (Standard):** Applied ADASYN and SMOTE to {datasets} datasets at {ratio}:1 imbalance generating {synthetic}K samples, improving minority F1 from {before} to {after} and reducing retraining from {retrain_before} to {retrain_after}/quarter.
- **B (Result-first):** Improved minority F1 from {before} to {after} and cut retraining from {retrain_before} to {retrain_after}/quarter by applying ADASYN and SMOTE to {datasets} datasets generating {synthetic}K samples.
- **C (Impact-led):** Improved minority F1 from {before} to {after} and cut retraining from {retrain_before} to {retrain_after}/quarter; applied ADASYN and SMOTE to {datasets} datasets at {ratio}:1 imbalance.
- **D (Concise):** Applied ADASYN and SMOTE to {datasets} datasets at {ratio}:1 generating {synthetic}K samples, F1 from {before} to {after}, retraining from {retrain_before} to {retrain_after}/quarter.

**Variables:**
  - `{datasets}`: 5 to 30, step 5 (integer)
  - `{ratio}`: 10 to 200, step 10 (integer)
  - `{synthetic}`: 5 to 200, step 5 (integer)
  - `{models}`: 5 to 30, step 5 (integer)
  - `{before}`: 0.35 to 0.55, step 0.05 (integer)
  - `{after}`: 0.70 to 0.90, step 0.05 (integer)
  - `{retrain_before}`: 6 to 20, step 2 (integer)
  - `{retrain_after}`: 1 to 3, step 1 (integer)

### DATA-0291
**Role:** data-engineer | **Theme:** data-platform-migration | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data platform migration, Snowflake migration, BigQuery migration, cloud data warehouse migration, lift and shift, platform modernization

**Scope:** a full data platform migration from on-premises to {target_platform}, moving {tables}K tables, {pipelines} pipelines, and {users} active users with zero data loss and a {downtime} hour maintenance window
**Result:** reducing platform operating cost by ${savings}K per year and improving average query performance by {perf}% post-migration

**Variations:**
- **A (Standard):** Led migration of {tables}K tables and {pipelines} pipelines to {target_platform} within a {downtime}h window for {users} users, cutting platform costs ${savings}K/year and improving query performance {perf}%.
- **B (Result-first):** Cut platform costs ${savings}K/year and improved query performance {perf}% by migrating {tables}K tables and {pipelines} pipelines to {target_platform} with zero data loss.
- **C (Impact-led):** Cut costs ${savings}K/year and improved performance {perf}%; led migration of {tables}K tables and {pipelines} pipelines to {target_platform} within a {downtime}h window.
- **D (Concise):** Migrated {tables}K tables and {pipelines} pipelines to {target_platform} in {downtime}h, ${savings}K/year saved, query performance up {perf}%.

**Variables:**
  - `{tables}`: 10 to 500, step 10 (integer)
  - `{pipelines}`: 20 to 500, step 20 (integer)
  - `{users}`: 20 to 500, step 20 (integer)
  - `{downtime}`: 2 to 12, step 2 (integer)
  - `{savings}`: 50 to 2000, step 50 (currency)
  - `{perf}`: 30 to 90, step 10 (percentage)

### DATA-0292
**Role:** data-analyst | **Theme:** energy-trading-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** energy trading analytics, power analytics, spot price analytics, dispatch analytics, energy market, PPA analytics

**Scope:** an energy trading analytics platform tracking {metrics} market and portfolio metrics across {assets} generation assets and ${portfolio}M in traded volume, with real-time price and dispatch analytics across {markets} markets
**Result:** improving dispatch decision accuracy by {accuracy}% and contributing to ${pnl}K in incremental trading PnL

**Variations:**
- **A (Standard):** Built energy trading analytics for {assets} assets at ${portfolio}M across {markets} markets tracking {metrics} metrics, improving dispatch accuracy {accuracy}% and contributing ${pnl}K in incremental PnL.
- **B (Result-first):** Improved dispatch accuracy {accuracy}% and contributed ${pnl}K in PnL by building energy analytics for {assets} assets at ${portfolio}M across {markets} markets.
- **C (Impact-led):** Improved dispatch accuracy {accuracy}% and contributed ${pnl}K in PnL; built energy analytics for {assets} assets at ${portfolio}M tracking {metrics} metrics.
- **D (Concise):** Built energy trading analytics for {assets} assets at ${portfolio}M across {markets} markets, dispatch accuracy up {accuracy}%, ${pnl}K incremental PnL.

**Variables:**
  - `{metrics}`: 20 to 60, step 10 (integer)
  - `{assets}`: 10 to 200, step 10 (integer)
  - `{portfolio}`: 10 to 1000, step 50 (currency)
  - `{markets}`: 2 to 10, step 1 (integer)
  - `{accuracy}`: 10 to 35, step 5 (percentage)
  - `{pnl}`: 100 to 5000, step 100 (currency)

### DATA-0293
**Role:** data-engineer | **Theme:** cdc-replication | **Seniority:** mid | **Verb Context:** systems
**Keywords:** CDC replication, Debezium, change data capture, database replication, event streaming, transactional replication

**Scope:** a CDC replication pipeline using Debezium to stream changes from {sources} source databases to {targets} downstream targets across {tables} tables at {throughput}K events per second with sub-{latency}s latency
**Result:** replacing {batch_jobs} nightly batch snapshots and reducing data latency from {before} hours to {after} seconds

**Variations:**
- **A (Standard):** Built Debezium CDC from {sources} databases to {targets} targets across {tables} tables at {throughput}K events/sec and sub-{latency}s, replacing {batch_jobs} batch jobs and cutting latency from {before}h to {after}s.
- **B (Result-first):** Replaced {batch_jobs} batch jobs and cut latency from {before}h to {after}s by implementing Debezium CDC from {sources} databases to {targets} targets.
- **C (Impact-led):** Replaced {batch_jobs} batch jobs and cut latency from {before}h to {after}s; implemented Debezium CDC from {sources} databases to {targets} targets across {tables} tables.
- **D (Concise):** Implemented Debezium CDC from {sources} databases to {targets} targets across {tables} tables at {throughput}K events/sec, {batch_jobs} batch jobs replaced, latency from {before}h to {after}s.

**Variables:**
  - `{sources}`: 3 to 20, step 3 (integer)
  - `{targets}`: 2 to 10, step 1 (integer)
  - `{tables}`: 50 to 1000, step 50 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{latency}`: 1 to 5, step 1 (integer)
  - `{batch_jobs}`: 10 to 100, step 10 (integer)
  - `{before}`: 6 to 24, step 6 (integer)
  - `{after}`: 1 to 10, step 1 (integer)

### DATA-0294
**Role:** data-scientist | **Theme:** clinical-nlp | **Seniority:** senior | **Verb Context:** systems
**Keywords:** clinical NLP, medical NLP, ICD coding, clinical notes, UMLS, clinical text mining

**Scope:** a clinical NLP pipeline applying fine-tuned BioBERT to extract {entity_types} clinical entity types from {notes}K daily discharge notes and operative reports for {use_cases} downstream coding and quality use cases
**Result:** achieving {f1}% F1 on clinical entity extraction and reducing manual review time from {before} minutes to {after} minutes per note

**Variations:**
- **A (Standard):** Fine-tuned BioBERT to extract {entity_types} clinical entities from {notes}K daily notes for {use_cases} use cases, achieving {f1}% F1 and cutting review time from {before} to {after} minutes per note.
- **B (Result-first):** Achieved {f1}% F1 and cut review time from {before} to {after} min/note by fine-tuning BioBERT to extract {entity_types} entities from {notes}K daily notes.
- **C (Impact-led):** Achieved {f1}% F1 and cut review time from {before} to {after} min/note; fine-tuned BioBERT to extract {entity_types} entities from {notes}K notes for {use_cases} use cases.
- **D (Concise):** Fine-tuned BioBERT for {entity_types} entity types on {notes}K daily notes, {f1}% F1, review time from {before} to {after} min/note.

**Variables:**
  - `{entity_types}`: 10 to 50, step 5 (integer)
  - `{notes}`: 1 to 100, step 5 (integer)
  - `{use_cases}`: 3 to 8, step 1 (integer)
  - `{f1}`: 82 to 96, step 2 (percentage)
  - `{before}`: 15 to 45, step 5 (integer)
  - `{after}`: 3 to 8, step 1 (integer)

### DATA-0295
**Role:** bi-analyst | **Theme:** ops-efficiency-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** operational efficiency analytics, process analytics, throughput analytics, cycle time analytics, bottleneck analytics, lean analytics

**Scope:** an operational efficiency analytics platform tracking {metrics} process KPIs across {processes} core business processes and {departments} departments, with cycle time decomposition and bottleneck identification
**Result:** identifying ${savings}K in process improvement opportunities and improving average process cycle time by {improvement}% across {processes} tracked processes

**Variations:**
- **A (Standard):** Built ops efficiency analytics for {processes} processes and {departments} departments tracking {metrics} KPIs, identifying ${savings}K in opportunities and improving cycle time {improvement}%.
- **B (Result-first):** Identified ${savings}K in opportunities and improved cycle time {improvement}% by building efficiency analytics for {processes} processes and {departments} departments.
- **C (Impact-led):** Identified ${savings}K in opportunities and improved cycle time {improvement}%; built efficiency analytics for {processes} processes across {departments} departments tracking {metrics} KPIs.
- **D (Concise):** Built efficiency analytics for {processes} processes and {departments} departments across {metrics} KPIs, ${savings}K identified, cycle time up {improvement}%.

**Variables:**
  - `{metrics}`: 20 to 60, step 10 (integer)
  - `{processes}`: 10 to 50, step 5 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{savings}`: 100 to 5000, step 100 (currency)
  - `{improvement}`: 15 to 50, step 5 (percentage)

### DATA-0296
**Role:** data-engineer | **Theme:** datalake-file-formats | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Parquet, ORC, file format optimization, columnar storage, compression, data lake file formats

**Scope:** a file format standardization initiative converting {tables} data lake tables from CSV and JSON to Parquet with {compression} compression, impacting {volume}TB of stored data across {consumers} query consumers
**Result:** reducing storage cost by ${savings}K per month and cutting average scan time by {scan_reduction}% for analytical queries

**Variations:**
- **A (Standard):** Converted {tables} tables to Parquet with {compression} compression across {volume}TB for {consumers} consumers, saving ${savings}K/month and cutting scan time {scan_reduction}%.
- **B (Result-first):** Saved ${savings}K/month and cut scan time {scan_reduction}% by converting {tables} tables to Parquet with {compression} across {volume}TB.
- **C (Impact-led):** Saved ${savings}K/month and cut scan time {scan_reduction}%; converted {tables} tables to Parquet across {volume}TB for {consumers} consumers.
- **D (Concise):** Converted {tables} tables to Parquet at {volume}TB for {consumers} consumers, ${savings}K/month saved, scan time down {scan_reduction}%.

**Variables:**
  - `{tables}`: 50 to 2000, step 50 (integer)
  - `{compression}`: Snappy or Zstd (string)
  - `{volume}`: 10 to 500, step 10 (integer)
  - `{consumers}`: 10 to 100, step 10 (integer)
  - `{savings}`: 10 to 200, step 10 (currency)
  - `{scan_reduction}`: 40 to 80, step 5 (percentage)

### DATA-0297
**Role:** data-scientist | **Theme:** bayesian-ab-testing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Bayesian A/B testing, Bayesian inference, credible intervals, posterior distribution, expected loss, Thompson sampling

**Scope:** a Bayesian experimentation framework replacing frequentist A/B testing for {experiments} experiments per quarter, computing posterior distributions and expected loss for {metrics} primary and guardrail metrics
**Result:** reducing required sample size per experiment by {sample_reduction}% and cutting average experiment duration from {before} weeks to {after} weeks

**Variations:**
- **A (Standard):** Built Bayesian experiment framework for {experiments} experiments/quarter across {metrics} metrics, reducing sample size {sample_reduction}% and cutting duration from {before} to {after} weeks.
- **B (Result-first):** Reduced sample size {sample_reduction}% and cut duration from {before} to {after} weeks by building Bayesian framework for {experiments} experiments across {metrics} metrics.
- **C (Impact-led):** Reduced sample size {sample_reduction}% and cut duration from {before} to {after} weeks; built Bayesian experiment framework for {experiments} experiments across {metrics} metrics.
- **D (Concise):** Built Bayesian experiment framework for {experiments}/quarter across {metrics} metrics, sample size down {sample_reduction}%, duration from {before} to {after} weeks.

**Variables:**
  - `{experiments}`: 20 to 100, step 10 (integer)
  - `{metrics}`: 5 to 20, step 5 (integer)
  - `{sample_reduction}`: 20 to 60, step 5 (percentage)
  - `{before}`: 4 to 12, step 2 (integer)
  - `{after}`: 1 to 3, step 1 (integer)

### DATA-0298
**Role:** data-analyst | **Theme:** compliance-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** compliance analytics, regulatory analytics, audit analytics, control monitoring, compliance dashboard, policy analytics

**Scope:** a compliance analytics platform tracking {controls} control effectiveness metrics across {regulations} regulatory frameworks and {entities} legal entities, with automated exception reporting and audit trail analytics
**Result:** reducing compliance exception backlog from {before} open items to {after} open items and cutting time to produce regulatory reports from {report_before} days to {report_after} hours

**Variations:**
- **A (Standard):** Built compliance analytics for {controls} controls across {regulations} frameworks and {entities} entities, cutting exceptions from {before} to {after} open items and report time from {report_before} days to {report_after} hours.
- **B (Result-first):** Cut exceptions from {before} to {after} items and report time from {report_before} days to {report_after} hours by building compliance analytics for {controls} controls across {regulations} frameworks.
- **C (Impact-led):** Cut exceptions from {before} to {after} items and report time from {report_before} days to {report_after} hours; built compliance analytics for {controls} controls across {regulations} frameworks and {entities} entities.
- **D (Concise):** Built compliance analytics for {controls} controls across {regulations} frameworks and {entities} entities, exceptions from {before} to {after}, reports from {report_before}d to {report_after}h.

**Variables:**
  - `{controls}`: 50 to 500, step 50 (integer)
  - `{regulations}`: 3 to 15, step 3 (integer)
  - `{entities}`: 3 to 30, step 3 (integer)
  - `{before}`: 100 to 500, step 50 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{report_before}`: 3 to 10, step 1 (integer)
  - `{report_after}`: 1 to 4, step 1 (integer)

### DATA-0299
**Role:** ml-engineer | **Theme:** model-distillation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model distillation, knowledge distillation, student-teacher, model compression, edge deployment, inference optimization

**Scope:** a knowledge distillation pipeline compressing {teacher_params}B-parameter teacher models into {student_params}M-parameter student models for {use_cases} production use cases requiring edge or low-latency inference
**Result:** reducing model size by {size_reduction}% and inference latency by {latency_reduction}% while retaining {accuracy_retained}% of teacher model accuracy

**Variations:**
- **A (Standard):** Distilled {teacher_params}B-param teachers to {student_params}M-param students for {use_cases} use cases, reducing size {size_reduction}%, latency {latency_reduction}%, and retaining {accuracy_retained}% accuracy.
- **B (Result-first):** Reduced size {size_reduction}%, latency {latency_reduction}%, and retained {accuracy_retained}% accuracy by distilling {teacher_params}B to {student_params}M params for {use_cases} use cases.
- **C (Impact-led):** Reduced size {size_reduction}% and latency {latency_reduction}% retaining {accuracy_retained}% accuracy; distilled {teacher_params}B to {student_params}M params for {use_cases} edge use cases.
- **D (Concise):** Distilled {teacher_params}B to {student_params}M params for {use_cases} use cases, size down {size_reduction}%, latency down {latency_reduction}%, {accuracy_retained}% accuracy retained.

**Variables:**
  - `{teacher_params}`: 1 to 70, step 1 (integer)
  - `{student_params}`: 10 to 500, step 10 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{size_reduction}`: 70 to 97, step 3 (percentage)
  - `{latency_reduction}`: 50 to 90, step 5 (percentage)
  - `{accuracy_retained}`: 90 to 99, step 1 (percentage)

### DATA-0300
**Role:** data-analyst | **Theme:** nps-driver-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** NPS analytics, driver analysis, text analytics, verbatim analytics, detractor analytics, promoter analytics

**Scope:** an NPS driver analytics platform processing {responses}K survey responses per quarter with text classification on verbatims across {themes} themes and {segments} customer segments and {touchpoints} journey touchpoints
**Result:** identifying {drivers} primary NPS drivers that informed {initiatives} CX initiatives improving NPS from {before} to {after}

**Variations:**
- **A (Standard):** Built NPS driver analytics for {responses}K responses/quarter across {themes} themes, {segments} segments, and {touchpoints} touchpoints, identifying {drivers} drivers that informed {initiatives} initiatives and lifted NPS from {before} to {after}.
- **B (Result-first):** Lifted NPS from {before} to {after} and informed {initiatives} initiatives by analyzing {responses}K responses and identifying {drivers} primary drivers across {themes} themes.
- **C (Impact-led):** Lifted NPS from {before} to {after} and informed {initiatives} initiatives; built NPS analytics for {responses}K responses across {themes} themes, {segments} segments, and {touchpoints} touchpoints.
- **D (Concise):** Built NPS analytics for {responses}K responses across {themes} themes and {segments} segments, {drivers} drivers identified, {initiatives} initiatives, NPS from {before} to {after}.

**Variables:**
  - `{responses}`: 1 to 100, step 5 (integer)
  - `{themes}`: 10 to 50, step 5 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{touchpoints}`: 5 to 20, step 5 (integer)
  - `{drivers}`: 5 to 15, step 5 (integer)
  - `{initiatives}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 45, step 5 (integer)
  - `{after}`: 50 to 75, step 5 (integer)

### DATA-0301
**Role:** data-engineer | **Theme:** data-lake-security | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data lake security, S3 security, column-level security, row-level security, lake access control, data masking

**Scope:** a data lake security framework implementing column masking, row-level security, and encryption at rest for {tables}K tables across {sensitive_columns}K sensitive columns and {users} user groups in {environments} environments
**Result:** achieving {compliance}% PII protection compliance and reducing unauthorized access incidents from {before} per quarter to {after}

**Variations:**
- **A (Standard):** Implemented data lake security with column masking and RLS for {tables}K tables and {sensitive_columns}K columns across {users} groups, achieving {compliance}% PII compliance and cutting incidents from {before}/quarter to {after}.
- **B (Result-first):** Achieved {compliance}% PII compliance and cut incidents from {before}/quarter to {after} by implementing lake security for {tables}K tables and {sensitive_columns}K sensitive columns.
- **C (Impact-led):** Achieved {compliance}% compliance and cut incidents from {before}/quarter to {after}; implemented lake security for {tables}K tables and {sensitive_columns}K columns across {users} groups.
- **D (Concise):** Implemented lake security for {tables}K tables and {sensitive_columns}K columns across {users} groups, {compliance}% PII compliance, incidents from {before}/quarter to {after}.

**Variables:**
  - `{tables}`: 10 to 500, step 10 (integer)
  - `{sensitive_columns}`: 10 to 500, step 10 (integer)
  - `{users}`: 10 to 100, step 10 (integer)
  - `{environments}`: 2 to 4, step 1 (integer)
  - `{compliance}`: 95 to 100, step 1 (percentage)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 0 to 1, step 1 (integer)

### DATA-0302
**Role:** data-scientist | **Theme:** uplift-modeling-advanced | **Seniority:** senior | **Verb Context:** systems
**Keywords:** uplift modeling, CATE estimation, causal ML, meta-learners, T-learner, S-learner, treatment effect heterogeneity

**Scope:** an uplift modeling framework using T-learner and causal forest to estimate heterogeneous treatment effects for {campaigns} campaigns across {segments} customer segments and {treatments} treatment variants
**Result:** improving average campaign incremental lift by {lift}% over random targeting and reducing wasted treatment cost by ${savings}K per campaign cycle

**Variations:**
- **A (Standard):** Built T-learner uplift framework for {campaigns} campaigns across {segments} segments and {treatments} treatments, improving incremental lift {lift}% and reducing wasted cost ${savings}K per cycle.
- **B (Result-first):** Improved incremental lift {lift}% and reduced wasted cost ${savings}K/cycle by building T-learner uplift for {campaigns} campaigns across {segments} segments.
- **C (Impact-led):** Improved lift {lift}% and cut wasted cost ${savings}K/cycle; built T-learner uplift framework for {campaigns} campaigns across {segments} segments and {treatments} treatments.
- **D (Concise):** Built T-learner uplift for {campaigns} campaigns across {segments} segments and {treatments} treatments, lift up {lift}%, wasted cost down ${savings}K/cycle.

**Variables:**
  - `{campaigns}`: 5 to 30, step 5 (integer)
  - `{segments}`: 10 to 50, step 10 (integer)
  - `{treatments}`: 2 to 6, step 1 (integer)
  - `{lift}`: 15 to 50, step 5 (percentage)
  - `{savings}`: 50 to 2000, step 50 (currency)

### DATA-0303
**Role:** data-analyst | **Theme:** hospitality-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** hospitality analytics, RevPAR, ADR, occupancy analytics, hotel analytics, revenue management analytics

**Scope:** a hospitality revenue analytics platform tracking {metrics} KPIs including RevPAR, ADR, and occupancy across {properties} properties and {segments} rate segments with demand forecast integration
**Result:** improving RevPAR from ${revpar_before} to ${revpar_after} and increasing overall revenue by {rev_improvement}% through data-driven rate optimization

**Variations:**
- **A (Standard):** Built hospitality analytics for {properties} properties across {segments} rate segments tracking {metrics} KPIs, improving RevPAR from ${revpar_before} to ${revpar_after} and growing revenue {rev_improvement}%.
- **B (Result-first):** Improved RevPAR from ${revpar_before} to ${revpar_after} and grew revenue {rev_improvement}% by building hospitality analytics for {properties} properties across {segments} segments.
- **C (Impact-led):** Improved RevPAR from ${revpar_before} to ${revpar_after} and grew revenue {rev_improvement}%; built hospitality analytics for {properties} properties tracking {metrics} KPIs.
- **D (Concise):** Built hospitality analytics for {properties} properties across {metrics} KPIs and {segments} segments, RevPAR from ${revpar_before} to ${revpar_after}, revenue up {rev_improvement}%.

**Variables:**
  - `{metrics}`: 15 to 40, step 5 (integer)
  - `{properties}`: 5 to 100, step 5 (integer)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{revpar_before}`: 80 to 150, step 10 (currency)
  - `{revpar_after}`: 120 to 250, step 10 (currency)
  - `{rev_improvement}`: 10 to 35, step 5 (percentage)

### DATA-0304
**Role:** data-engineer | **Theme:** query-federation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** query federation, Trino, Presto, federated queries, cross-source queries, data virtualization

**Scope:** a federated query layer using Trino connecting {sources} data sources including data warehouses, data lakes, and operational databases, enabling {users} analysts to query across systems without data movement
**Result:** eliminating {pipelines} redundant ETL pipelines and reducing analyst data preparation time from {before} hours to {after} minutes per cross-system query

**Variations:**
- **A (Standard):** Built Trino federation across {sources} sources for {users} analysts, eliminating {pipelines} ETL pipelines and cutting preparation time from {before}h to {after}min per cross-system query.
- **B (Result-first):** Eliminated {pipelines} ETL pipelines and cut preparation time from {before}h to {after}min by building Trino federation across {sources} sources for {users} analysts.
- **C (Impact-led):** Eliminated {pipelines} pipelines and cut preparation from {before}h to {after}min; built Trino federation across {sources} sources for {users} analysts.
- **D (Concise):** Built Trino federation across {sources} sources for {users} analysts, {pipelines} ETL pipelines eliminated, prep from {before}h to {after}min.

**Variables:**
  - `{sources}`: 3 to 15, step 3 (integer)
  - `{users}`: 20 to 200, step 20 (integer)
  - `{pipelines}`: 10 to 100, step 10 (integer)
  - `{before}`: 2 to 8, step 2 (integer)
  - `{after}`: 5 to 30, step 5 (integer)

### DATA-0305
**Role:** data-scientist | **Theme:** graph-neural-network | **Seniority:** senior | **Verb Context:** systems
**Keywords:** graph neural networks, GNN, node classification, link prediction, GraphSAGE, PyG

**Scope:** a graph neural network using GraphSAGE for {task} on a graph with {nodes}M nodes and {edges}M edges, processing {features} node features across {layers} GNN layers with mini-batch training
**Result:** improving {task} accuracy from {before}% to {after}% over baseline GBM and reducing inference time for new nodes from {inf_before}ms to {inf_after}ms

**Variations:**
- **A (Standard):** Built GraphSAGE for {task} on {nodes}M nodes and {edges}M edges with {features} features, improving accuracy from {before}% to {after}% and cutting inference from {inf_before}ms to {inf_after}ms.
- **B (Result-first):** Improved accuracy from {before}% to {after}% and cut inference from {inf_before}ms to {inf_after}ms by building GraphSAGE for {task} on {nodes}M nodes and {edges}M edges.
- **C (Impact-led):** Improved accuracy from {before}% to {after}% and cut inference from {inf_before}ms to {inf_after}ms; built GraphSAGE for {task} on {nodes}M nodes and {edges}M edges with {features} features.
- **D (Concise):** Built GraphSAGE for {task} on {nodes}M nodes and {edges}M edges with {features} features, accuracy from {before}% to {after}%, inference from {inf_before}ms to {inf_after}ms.

**Variables:**
  - `{nodes}`: 0.1 to 100, step 1 (integer)
  - `{edges}`: 1 to 1000, step 10 (integer)
  - `{features}`: 10 to 500, step 10 (integer)
  - `{layers}`: 2 to 5, step 1 (integer)
  - `{before}`: 70 to 82, step 2 (percentage)
  - `{after}`: 85 to 97, step 2 (percentage)
  - `{inf_before}`: 100 to 1000, step 100 (integer)
  - `{inf_after}`: 10 to 50, step 5 (integer)

### DATA-0306
**Role:** data-analyst | **Theme:** cohort-revenue-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** cohort revenue analytics, revenue cohorts, LTV cohorts, revenue retention, dollar retention, NRR cohorts

**Scope:** a cohort revenue analytics platform tracking {cohorts} monthly acquisition cohorts across {months} months for a ${arr}M ARR business, measuring gross dollar retention, expansion, and NRR by {segments} customer segments
**Result:** improving NRR visibility accuracy from {before}% to {after}% and identifying {cohorts_at_risk} at-risk cohorts for proactive intervention {weeks} weeks earlier than manual processes

**Variations:**
- **A (Standard):** Built cohort revenue analytics for {cohorts} cohorts over {months} months for a ${arr}M business across {segments} segments, improving NRR accuracy from {before}% to {after}% and identifying at-risk cohorts {weeks} weeks earlier.
- **B (Result-first):** Improved NRR accuracy from {before}% to {after}% and identified {cohorts_at_risk} at-risk cohorts {weeks} weeks earlier by building cohort revenue analytics for {cohorts} cohorts over {months} months.
- **C (Impact-led):** Improved NRR accuracy from {before}% to {after}% and identified {cohorts_at_risk} at-risk cohorts {weeks} weeks earlier; built cohort analytics for {cohorts} cohorts across {segments} segments.
- **D (Concise):** Built cohort revenue analytics for {cohorts} cohorts over {months} months across {segments} segments, NRR accuracy from {before}% to {after}%, {cohorts_at_risk} at-risk cohorts {weeks}wk earlier.

**Variables:**
  - `{cohorts}`: 12 to 48, step 6 (integer)
  - `{months}`: 12 to 36, step 6 (integer)
  - `{arr}`: 10 to 500, step 10 (currency)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{before}`: 60 to 78, step 5 (percentage)
  - `{after}`: 90 to 99, step 2 (percentage)
  - `{cohorts_at_risk}`: 3 to 15, step 3 (integer)
  - `{weeks}`: 4 to 12, step 2 (integer)

### DATA-0307
**Role:** data-engineer | **Theme:** infrastructure-as-code-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** infrastructure as code, Terraform data, Pulumi data, IaC pipelines, data infrastructure automation, repeatable infrastructure

**Scope:** a data infrastructure-as-code framework using Terraform to manage {resources} cloud data resources across {environments} environments and {accounts} accounts, enabling repeatable provisioning and drift detection
**Result:** reducing infrastructure provisioning time from {before} days to {after} hours and eliminating {drift_incidents} environment drift incidents per quarter

**Variations:**
- **A (Standard):** Built Terraform IaC for {resources} data resources across {environments} environments and {accounts} accounts, cutting provisioning from {before} days to {after} hours and eliminating {drift_incidents} drift incidents/quarter.
- **B (Result-first):** Reduced provisioning from {before} days to {after} hours and eliminated {drift_incidents} drift incidents/quarter by building Terraform IaC for {resources} resources.
- **C (Impact-led):** Cut provisioning from {before} days to {after} hours and eliminated {drift_incidents} drift incidents/quarter; built Terraform IaC for {resources} resources across {environments} environments and {accounts} accounts.
- **D (Concise):** Built Terraform IaC for {resources} resources across {environments} environments and {accounts} accounts, provisioning from {before}d to {after}h, {drift_incidents} drift incidents eliminated.

**Variables:**
  - `{resources}`: 50 to 1000, step 50 (integer)
  - `{environments}`: 3 to 6, step 1 (integer)
  - `{accounts}`: 3 to 30, step 3 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 0.5 to 2, step 0.5 (integer)
  - `{drift_incidents}`: 5 to 30, step 5 (integer)

### DATA-0308
**Role:** data-analyst | **Theme:** grant-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** grant analytics, funding analytics, nonprofit analytics, program impact, grant reporting, funding utilization

**Scope:** a grant and funding analytics platform tracking ${funding}M in grant funding across {grants} active grants, {programs} programs, and {funders} funding sources with impact measurement and utilization reporting
**Result:** improving grant reporting accuracy from {before}% to {after}% and contributing to ${secured}K in new grant awards through data-supported applications

**Variations:**
- **A (Standard):** Built grant analytics for ${funding}M across {grants} grants, {programs} programs, and {funders} funders, improving reporting accuracy from {before}% to {after}% and supporting ${secured}K in new awards.
- **B (Result-first):** Improved reporting accuracy from {before}% to {after}% and supported ${secured}K in new awards by building grant analytics for ${funding}M across {grants} grants.
- **C (Impact-led):** Improved reporting accuracy from {before}% to {after}% and supported ${secured}K in new awards; built grant analytics for ${funding}M across {grants} grants and {funders} funders.
- **D (Concise):** Built grant analytics for ${funding}M across {grants} grants and {funders} funders, accuracy from {before}% to {after}%, ${secured}K in new awards.

**Variables:**
  - `{funding}`: 1 to 100, step 5 (currency)
  - `{grants}`: 10 to 100, step 10 (integer)
  - `{programs}`: 5 to 30, step 5 (integer)
  - `{funders}`: 5 to 30, step 5 (integer)
  - `{before}`: 70 to 85, step 5 (percentage)
  - `{after}`: 90 to 100, step 2 (percentage)
  - `{secured}`: 50 to 2000, step 50 (currency)

### DATA-0309
**Role:** ml-engineer | **Theme:** feature-importance | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature importance, SHAP, permutation importance, feature selection, model interpretability, feature ranking

**Scope:** a feature importance and selection framework applying SHAP and permutation importance across {models} production models and {features} candidate features, automating feature pruning for {retraining_cycles} retraining cycles
**Result:** reducing average feature set size from {before} to {after} features while maintaining model performance within {degradation}% and cutting training time by {training_reduction}%

**Variations:**
- **A (Standard):** Built SHAP feature selection for {models} models across {features} features over {retraining_cycles} cycles, reducing feature sets from {before} to {after} and cutting training time {training_reduction}% within {degradation}% performance.
- **B (Result-first):** Reduced features from {before} to {after} and cut training time {training_reduction}% within {degradation}% performance by applying SHAP across {models} models and {features} features.
- **C (Impact-led):** Reduced features from {before} to {after} and cut training {training_reduction}% within {degradation}% performance; built SHAP selection for {models} models across {features} features.
- **D (Concise):** Built SHAP feature selection for {models} models across {features} features, sets from {before} to {after}, training time down {training_reduction}%, performance within {degradation}%.

**Variables:**
  - `{models}`: 10 to 50, step 5 (integer)
  - `{features}`: 50 to 1000, step 50 (integer)
  - `{retraining_cycles}`: 4 to 24, step 4 (integer)
  - `{before}`: 100 to 500, step 50 (integer)
  - `{after}`: 20 to 80, step 10 (integer)
  - `{degradation}`: 1 to 3, step 0.5 (percentage)
  - `{training_reduction}`: 30 to 70, step 5 (percentage)

### DATA-0310
**Role:** data-analyst | **Theme:** procurement-spend-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** procurement analytics, spend analytics, supplier analytics, category analytics, maverick spend, tail spend

**Scope:** a procurement spend analytics platform classifying and tracking ${spend}M in annual spend across {suppliers} suppliers, {categories} categories, and {business_units} business units with maverick spend identification
**Result:** identifying ${maverick}K in maverick spend and informing contract consolidation that reduced supplier count by {supplier_reduction}% and improved average payment terms by {terms} days

**Variations:**
- **A (Standard):** Built spend analytics for ${spend}M across {suppliers} suppliers and {categories} categories, identifying ${maverick}K in maverick spend and consolidating suppliers {supplier_reduction}% while improving payment terms {terms} days.
- **B (Result-first):** Identified ${maverick}K in maverick spend and cut suppliers {supplier_reduction}% by building spend analytics for ${spend}M across {suppliers} suppliers and {categories} categories.
- **C (Impact-led):** Identified ${maverick}K in maverick spend and cut suppliers {supplier_reduction}%; built spend analytics for ${spend}M across {suppliers} suppliers and {categories} categories.
- **D (Concise):** Built spend analytics for ${spend}M across {suppliers} suppliers and {categories} categories, ${maverick}K maverick identified, suppliers down {supplier_reduction}%, terms +{terms} days.

**Variables:**
  - `{spend}`: 10 to 1000, step 50 (currency)
  - `{suppliers}`: 50 to 2000, step 50 (integer)
  - `{categories}`: 10 to 100, step 10 (integer)
  - `{business_units}`: 3 to 20, step 3 (integer)
  - `{maverick}`: 100 to 5000, step 100 (currency)
  - `{supplier_reduction}`: 10 to 40, step 5 (percentage)
  - `{terms}`: 5 to 30, step 5 (integer)

### DATA-0311
**Role:** data-engineer | **Theme:** multi-region-replication | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multi-region replication, cross-region data, geo-replication, active-active data, disaster recovery replication, data residency

**Scope:** a multi-region data replication architecture for {tables}K tables across {regions} geographic regions with {rpo} RPO and {rto} RTO targets, ensuring data residency compliance for {jurisdictions} regulatory jurisdictions
**Result:** achieving {compliance}% data residency compliance and maintaining {uptime}% availability during {failover_tests} simulated regional failover tests

**Variations:**
- **A (Standard):** Architected multi-region replication for {tables}K tables across {regions} regions at {rpo} RPO and {rto} RTO, achieving {compliance}% residency compliance and {uptime}% availability across {failover_tests} failover tests.
- **B (Result-first):** Achieved {compliance}% residency compliance and {uptime}% availability by architecting {regions}-region replication for {tables}K tables at {rpo} RPO and {rto} RTO.
- **C (Impact-led):** Achieved {compliance}% compliance and {uptime}% availability; architected multi-region replication for {tables}K tables across {regions} regions for {jurisdictions} jurisdictions.
- **D (Concise):** Architected {regions}-region replication for {tables}K tables at {rpo} RPO and {rto} RTO, {compliance}% residency compliance, {uptime}% availability.

**Variables:**
  - `{tables}`: 10 to 500, step 10 (integer)
  - `{regions}`: 2 to 6, step 1 (integer)
  - `{rpo}`: 1 to 60, step 5 (integer)
  - `{rto}`: 5 to 120, step 5 (integer)
  - `{jurisdictions}`: 2 to 8, step 1 (integer)
  - `{compliance}`: 99 to 100, step 0.1 (percentage)
  - `{uptime}`: 99.9 to 99.999, step 0.01 (percentage)
  - `{failover_tests}`: 3 to 12, step 3 (integer)

### DATA-0312
**Role:** data-scientist | **Theme:** price-prediction | **Seniority:** mid | **Verb Context:** systems
**Keywords:** price prediction, dynamic pricing, demand modeling, willingness to pay, price sensitivity, pricing model

**Scope:** a price prediction model estimating willingness-to-pay distributions for {segments} customer segments across {products} products using {features} behavioral and contextual features, deployed for real-time pricing decisions
**Result:** improving revenue per transaction by {rev_improvement}% and increasing gross margin by {margin_improvement}% versus rule-based pricing

**Variations:**
- **A (Standard):** Built WTP prediction model for {segments} segments across {products} products on {features} features, improving revenue per transaction {rev_improvement}% and gross margin {margin_improvement}% over rule-based pricing.
- **B (Result-first):** Improved revenue per transaction {rev_improvement}% and gross margin {margin_improvement}% by building WTP model for {segments} segments across {products} products.
- **C (Impact-led):** Improved revenue per transaction {rev_improvement}% and gross margin {margin_improvement}%; built WTP prediction for {segments} segments across {products} products on {features} features.
- **D (Concise):** Built WTP prediction for {segments} segments across {products} products on {features} features, revenue per transaction up {rev_improvement}%, margin up {margin_improvement}%.

**Variables:**
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{products}`: 10 to 500, step 10 (integer)
  - `{features}`: 20 to 200, step 10 (integer)
  - `{rev_improvement}`: 5 to 25, step 5 (percentage)
  - `{margin_improvement}`: 5 to 20, step 5 (percentage)

### DATA-0313
**Role:** bi-analyst | **Theme:** investment-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** investment analytics, portfolio analytics, IRR analytics, fund analytics, NAV analytics, LP reporting analytics

**Scope:** an investment portfolio analytics platform tracking {metrics} performance metrics across {funds} funds and ${aum}M in AUM including IRR, MOIC, DPI, and TVPI with LP reporting and benchmark comparison
**Result:** reducing LP reporting production time from {before} days to {after} hours and improving reporting accuracy from {acc_before}% to {acc_after}%

**Variations:**
- **A (Standard):** Built investment analytics for {funds} funds at ${aum}M AUM tracking {metrics} metrics, cutting LP reporting from {before} days to {after} hours and improving accuracy from {acc_before}% to {acc_after}%.
- **B (Result-first):** Cut LP reporting from {before} days to {after} hours and improved accuracy from {acc_before}% to {acc_after}% by building investment analytics for {funds} funds at ${aum}M AUM.
- **C (Impact-led):** Cut LP reporting from {before} days to {after} hours and improved accuracy from {acc_before}% to {acc_after}%; built investment analytics for {funds} funds at ${aum}M tracking {metrics} metrics.
- **D (Concise):** Built investment analytics for {funds} funds at ${aum}M across {metrics} metrics, LP reporting from {before}d to {after}h, accuracy from {acc_before}% to {acc_after}%.

**Variables:**
  - `{metrics}`: 15 to 50, step 5 (integer)
  - `{funds}`: 3 to 20, step 3 (integer)
  - `{aum}`: 100 to 10000, step 100 (currency)
  - `{before}`: 5 to 15, step 2 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{acc_before}`: 85 to 94, step 3 (percentage)
  - `{acc_after}`: 98 to 100, step 1 (percentage)

### DATA-0314
**Role:** data-analyst | **Theme:** clinical-trial-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** clinical trial analytics, patient recruitment analytics, protocol analytics, site performance analytics, enrollment analytics, trial operations

**Scope:** a clinical trial operations analytics platform tracking {metrics} trial KPIs across {trials} active trials, {sites} investigator sites, and {patients} enrolled patients with enrollment forecast and protocol deviation analytics
**Result:** improving enrollment forecast accuracy from {before}% to {after}% MAPE and identifying {deviations} protocol deviations {weeks} weeks earlier than manual processes

**Variations:**
- **A (Standard):** Built trial analytics for {trials} trials and {sites} sites tracking {metrics} KPIs for {patients} patients, improving enrollment MAPE from {before}% to {after}% and identifying {deviations} deviations {weeks} weeks earlier.
- **B (Result-first):** Improved enrollment MAPE from {before}% to {after}% and identified {deviations} deviations {weeks} weeks earlier by building trial analytics for {trials} trials across {sites} sites.
- **C (Impact-led):** Improved enrollment MAPE from {before}% to {after}% and identified {deviations} deviations {weeks} weeks earlier; built trial analytics for {trials} trials and {sites} sites tracking {metrics} KPIs.
- **D (Concise):** Built trial analytics for {trials} trials and {sites} sites across {metrics} KPIs, enrollment MAPE from {before}% to {after}%, {deviations} deviations {weeks}wk earlier.

**Variables:**
  - `{metrics}`: 20 to 60, step 10 (integer)
  - `{trials}`: 5 to 30, step 5 (integer)
  - `{sites}`: 10 to 200, step 10 (integer)
  - `{patients}`: 100 to 5000, step 100 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)
  - `{deviations}`: 5 to 30, step 5 (integer)
  - `{weeks}`: 2 to 8, step 2 (integer)

### DATA-0315
**Role:** data-engineer | **Theme:** hybrid-cloud-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** hybrid cloud, on-premises to cloud, cloud bursting, data gravity, hybrid data architecture, cloud connectivity

**Scope:** a hybrid cloud data architecture bridging {on_prem_systems} on-premises systems and {cloud_services} cloud data services, enabling workload portability and data synchronization with {latency}ms cross-environment latency
**Result:** reducing on-premises compute cost by ${savings}K per year through cloud bursting and maintaining {consistency}% data consistency across environments

**Variations:**
- **A (Standard):** Architected hybrid cloud connecting {on_prem_systems} on-prem systems to {cloud_services} cloud services at {latency}ms latency, saving ${savings}K/year via cloud bursting and maintaining {consistency}% consistency.
- **B (Result-first):** Saved ${savings}K/year via cloud bursting and maintained {consistency}% consistency by architecting hybrid cloud across {on_prem_systems} on-prem and {cloud_services} cloud services.
- **C (Impact-led):** Saved ${savings}K/year via cloud bursting and maintained {consistency}% consistency; architected hybrid cloud connecting {on_prem_systems} on-prem to {cloud_services} cloud at {latency}ms latency.
- **D (Concise):** Architected hybrid cloud for {on_prem_systems} on-prem and {cloud_services} cloud services at {latency}ms, ${savings}K/year saved, {consistency}% consistency maintained.

**Variables:**
  - `{on_prem_systems}`: 3 to 15, step 3 (integer)
  - `{cloud_services}`: 3 to 10, step 1 (integer)
  - `{latency}`: 20 to 100, step 10 (integer)
  - `{savings}`: 50 to 1000, step 50 (currency)
  - `{consistency}`: 99 to 100, step 0.1 (percentage)

### DATA-0316
**Role:** data-scientist | **Theme:** demand-sensing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** demand sensing, short-horizon forecast, POS data, demand signal, real-time demand, demand signals integration

**Scope:** a demand sensing model ingesting {signals} real-time demand signals including POS, weather, and social data to produce {horizon} day short-horizon forecasts for {skus}K SKUs across {regions} regions
**Result:** improving {horizon}-day forecast accuracy from {before}% to {after}% MAPE and reducing emergency replenishment orders by {replenishment_reduction}%

**Variations:**
- **A (Standard):** Built demand sensing model from {signals} signals for {horizon}-day forecasts across {skus}K SKUs and {regions} regions, improving MAPE from {before}% to {after}% and cutting emergency orders {replenishment_reduction}%.
- **B (Result-first):** Improved {horizon}-day MAPE from {before}% to {after}% and cut emergency orders {replenishment_reduction}% by building demand sensing from {signals} signals for {skus}K SKUs.
- **C (Impact-led):** Improved MAPE from {before}% to {after}% and cut emergency orders {replenishment_reduction}%; built demand sensing from {signals} signals for {horizon}-day forecasts across {skus}K SKUs.
- **D (Concise):** Built demand sensing from {signals} signals for {horizon}-day forecasts across {skus}K SKUs and {regions} regions, MAPE from {before}% to {after}%, emergency orders down {replenishment_reduction}%.

**Variables:**
  - `{signals}`: 5 to 20, step 5 (integer)
  - `{horizon}`: 3 to 14, step 1 (integer)
  - `{skus}`: 10 to 500, step 10 (integer)
  - `{regions}`: 5 to 50, step 5 (integer)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)
  - `{replenishment_reduction}`: 20 to 60, step 5 (percentage)

### DATA-0317
**Role:** data-analyst | **Theme:** diversity-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** DEI analytics, diversity analytics, representation analytics, equity analytics, inclusion metrics, workforce diversity

**Scope:** a DEI analytics platform tracking {metrics} representation and equity metrics across {levels} seniority levels, {departments} departments, and {dimensions} demographic dimensions with longitudinal trend analysis
**Result:** identifying {gaps} representation gaps that informed {programs} DEI programs and improving representation in senior roles from {before}% to {after}% over {years} years

**Variations:**
- **A (Standard):** Built DEI analytics tracking {metrics} metrics across {levels} levels, {departments} departments, and {dimensions} dimensions, identifying {gaps} gaps that informed {programs} programs and improving senior representation from {before}% to {after}%.
- **B (Result-first):** Improved senior representation from {before}% to {after}% and informed {programs} programs by building DEI analytics identifying {gaps} gaps across {dimensions} dimensions.
- **C (Impact-led):** Improved senior representation from {before}% to {after}% and informed {programs} programs; built DEI analytics tracking {metrics} metrics across {levels} levels and {dimensions} dimensions.
- **D (Concise):** Built DEI analytics across {metrics} metrics, {levels} levels, and {dimensions} dimensions, {gaps} gaps identified, {programs} programs, senior rep from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 40, step 5 (integer)
  - `{levels}`: 4 to 8, step 1 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{dimensions}`: 3 to 8, step 1 (integer)
  - `{gaps}`: 3 to 10, step 1 (integer)
  - `{programs}`: 3 to 10, step 1 (integer)
  - `{before}`: 15 to 30, step 5 (percentage)
  - `{after}`: 30 to 50, step 5 (percentage)
  - `{years}`: 1 to 3, step 1 (integer)

### DATA-0318
**Role:** data-engineer | **Theme:** metadata-driven-ingestion | **Seniority:** mid | **Verb Context:** systems
**Keywords:** metadata-driven ingestion, dynamic ingestion, configuration-driven ingestion, generic connectors, scalable ingestion, ingestion framework

**Scope:** a metadata-driven ingestion framework allowing {teams} teams to onboard {sources} new data sources via configuration metadata without writing custom code, supporting {source_types} source types and {formats} file formats
**Result:** reducing source onboarding time from {before} days to {after} hours and enabling {teams} teams to self-serve {sources_self_serve}% of new source requests

**Variations:**
- **A (Standard):** Built metadata-driven ingestion for {source_types} source types and {formats} formats enabling {teams} teams to onboard sources config-only, cutting onboarding from {before} days to {after} hours and enabling {sources_self_serve}% self-serve.
- **B (Result-first):** Cut onboarding from {before} days to {after} hours and enabled {sources_self_serve}% self-serve by building metadata-driven ingestion for {source_types} types and {formats} formats.
- **C (Impact-led):** Cut onboarding from {before} days to {after} hours and enabled {sources_self_serve}% self-serve; built metadata-driven ingestion for {source_types} source types and {formats} formats.
- **D (Concise):** Built metadata-driven ingestion for {source_types} types and {formats} formats, onboarding from {before}d to {after}h, {sources_self_serve}% self-serve.

**Variables:**
  - `{teams}`: 5 to 20, step 5 (integer)
  - `{sources}`: 20 to 200, step 20 (integer)
  - `{source_types}`: 5 to 20, step 5 (integer)
  - `{formats}`: 5 to 15, step 5 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 1 to 4, step 1 (integer)
  - `{sources_self_serve}`: 60 to 90, step 5 (percentage)

### DATA-0319
**Role:** data-scientist | **Theme:** anomaly-root-cause | **Seniority:** senior | **Verb Context:** systems
**Keywords:** anomaly root cause, automated RCA, causal attribution, metric decomposition, automated investigation, incident analytics

**Scope:** an automated anomaly root cause analysis system for {metrics} business metrics, applying causal graph reasoning and metric decomposition to isolate root causes from {dimensions} dimensions within {sla}min of detection
**Result:** reducing mean root cause identification time from {before} hours to {after} minutes and improving first-assignment accuracy from {acc_before}% to {acc_after}%

**Variations:**
- **A (Standard):** Built automated RCA for {metrics} metrics across {dimensions} dimensions within {sla}min SLA, cutting root cause time from {before}h to {after}min and improving first-assignment accuracy from {acc_before}% to {acc_after}%.
- **B (Result-first):** Cut root cause time from {before}h to {after}min and improved assignment accuracy from {acc_before}% to {acc_after}% by building RCA for {metrics} metrics across {dimensions} dimensions.
- **C (Impact-led):** Cut root cause time from {before}h to {after}min and improved accuracy from {acc_before}% to {acc_after}%; built RCA system for {metrics} metrics across {dimensions} dimensions within {sla}min.
- **D (Concise):** Built automated RCA for {metrics} metrics across {dimensions} dimensions at {sla}min SLA, root cause from {before}h to {after}min, accuracy from {acc_before}% to {acc_after}%.

**Variables:**
  - `{metrics}`: 20 to 200, step 20 (integer)
  - `{dimensions}`: 10 to 100, step 10 (integer)
  - `{sla}`: 5 to 30, step 5 (integer)
  - `{before}`: 2 to 12, step 2 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{acc_before}`: 40 to 65, step 5 (percentage)
  - `{acc_after}`: 80 to 97, step 5 (percentage)

### DATA-0320
**Role:** bi-analyst | **Theme:** procurement-performance-dashboard | **Seniority:** junior | **Verb Context:** systems
**Keywords:** procurement dashboard, purchasing analytics, PO analytics, vendor performance, contract compliance, buying analytics

**Scope:** a procurement performance dashboard tracking {metrics} KPIs across {suppliers} vendors, {categories} spend categories, and {buyers} buyers including PO cycle time, contract compliance, and savings tracking
**Result:** improving PO cycle time from {before} days to {after} days and increasing contract compliance from {comp_before}% to {comp_after}%

**Variations:**
- **A (Standard):** Built procurement dashboard for {suppliers} vendors and {categories} categories tracking {metrics} KPIs, improving PO cycle from {before} to {after} days and contract compliance from {comp_before}% to {comp_after}%.
- **B (Result-first):** Improved PO cycle from {before} to {after} days and compliance from {comp_before}% to {comp_after}% by building procurement dashboard for {suppliers} vendors and {categories} categories.
- **C (Impact-led):** Improved PO cycle from {before} to {after} days and compliance from {comp_before}% to {comp_after}%; built procurement dashboard for {suppliers} vendors across {metrics} KPIs.
- **D (Concise):** Built procurement dashboard for {suppliers} vendors and {categories} categories across {metrics} KPIs, PO cycle from {before} to {after} days, compliance from {comp_before}% to {comp_after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{suppliers}`: 20 to 500, step 20 (integer)
  - `{categories}`: 5 to 30, step 5 (integer)
  - `{buyers}`: 5 to 50, step 5 (integer)
  - `{before}`: 10 to 30, step 5 (integer)
  - `{after}`: 3 to 8, step 1 (integer)
  - `{comp_before}`: 60 to 78, step 5 (percentage)
  - `{comp_after}`: 88 to 99, step 2 (percentage)

### DATA-0321
**Role:** data-engineer | **Theme:** data-quality-rules-engine | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data quality rules, Great Expectations, Soda, quality rules engine, data validation, quality gates

**Scope:** a data quality rules engine with {rules}K automated checks across {datasets} datasets and {pipelines} pipelines, enforcing schema, referential integrity, statistical, and business rules at {check_frequency} check frequency
**Result:** catching {caught}% of data quality issues before consumer impact and reducing downstream data incident tickets from {before} to {after} per month

**Variations:**
- **A (Standard):** Deployed {rules}K quality rules across {datasets} datasets and {pipelines} pipelines at {check_frequency} frequency, catching {caught}% of issues pre-impact and cutting incident tickets from {before} to {after}/month.
- **B (Result-first):** Caught {caught}% of issues pre-impact and cut tickets from {before} to {after}/month by deploying {rules}K quality rules across {datasets} datasets and {pipelines} pipelines.
- **C (Impact-led):** Caught {caught}% of issues pre-impact and cut tickets from {before} to {after}/month; deployed {rules}K quality rules across {datasets} datasets and {pipelines} pipelines.
- **D (Concise):** Deployed {rules}K quality rules across {datasets} datasets and {pipelines} pipelines, {caught}% pre-impact, tickets from {before} to {after}/month.

**Variables:**
  - `{rules}`: 1 to 50, step 5 (integer)
  - `{datasets}`: 50 to 500, step 50 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{caught}`: 80 to 99, step 5 (percentage)
  - `{before}`: 20 to 100, step 10 (integer)
  - `{after}`: 2 to 8, step 2 (integer)

### DATA-0322
**Role:** data-analyst | **Theme:** payroll-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** payroll analytics, compensation analytics, salary analytics, payroll variance, labor cost analytics, payroll reporting

**Scope:** a payroll and compensation analytics platform tracking {metrics} payroll metrics across {employees} employees, {departments} departments, and {countries} countries with variance analysis and labor cost reporting
**Result:** identifying ${variance}K in payroll variances and reducing payroll error rate from {before}% to {after}% per pay cycle

**Variations:**
- **A (Standard):** Built payroll analytics for {employees} employees across {departments} departments and {countries} countries tracking {metrics} metrics, identifying ${variance}K in variances and reducing errors from {before}% to {after}%.
- **B (Result-first):** Identified ${variance}K in variances and reduced errors from {before}% to {after}% by building payroll analytics for {employees} employees across {departments} departments.
- **C (Impact-led):** Identified ${variance}K in variances and reduced errors from {before}% to {after}%; built payroll analytics for {employees} employees across {departments} departments and {countries} countries.
- **D (Concise):** Built payroll analytics for {employees} employees across {departments} departments and {countries} countries, ${variance}K variances identified, errors from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 10 to 30, step 5 (integer)
  - `{employees}`: 100 to 10000, step 100 (integer)
  - `{departments}`: 5 to 30, step 5 (integer)
  - `{countries}`: 2 to 20, step 2 (integer)
  - `{variance}`: 10 to 500, step 10 (currency)
  - `{before}`: 2 to 8, step 1 (percentage)
  - `{after}`: 0.1 to 0.5, step 0.1 (percentage)

### DATA-0323
**Role:** ml-engineer | **Theme:** model-ab-testing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model A/B testing, shadow deployment, canary deployment, champion-challenger, model traffic splitting, online evaluation

**Scope:** a champion-challenger model testing framework supporting {experiments} concurrent model experiments with traffic splitting across {models} candidate models serving {qps}K requests per second with full observability
**Result:** accelerating model release cadence from {before} releases per quarter to {after} releases and improving production model quality by {quality}% NDCG over {months} months

**Variations:**
- **A (Standard):** Built champion-challenger framework for {experiments} experiments across {models} models at {qps}K RPS, accelerating releases from {before} to {after}/quarter and improving model NDCG {quality}% over {months} months.
- **B (Result-first):** Accelerated releases from {before} to {after}/quarter and improved NDCG {quality}% by building champion-challenger for {experiments} experiments across {models} models.
- **C (Impact-led):** Accelerated releases from {before} to {after}/quarter and improved NDCG {quality}%; built champion-challenger for {experiments} experiments across {models} models at {qps}K RPS.
- **D (Concise):** Built champion-challenger for {experiments} experiments across {models} models at {qps}K RPS, releases from {before} to {after}/quarter, NDCG up {quality}% over {months} months.

**Variables:**
  - `{experiments}`: 5 to 20, step 5 (integer)
  - `{models}`: 2 to 8, step 1 (integer)
  - `{qps}`: 10 to 500, step 10 (integer)
  - `{before}`: 2 to 5, step 1 (integer)
  - `{after}`: 8 to 20, step 4 (integer)
  - `{quality}`: 5 to 20, step 5 (percentage)
  - `{months}`: 6 to 18, step 3 (integer)

### DATA-0324
**Role:** data-analyst | **Theme:** digital-product-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** digital product analytics, DAU MAU, session analytics, feature adoption, product funnel, retention analytics

**Scope:** a digital product analytics platform tracking {metrics} engagement metrics for {products} products and {features} features across {users}M registered users, with feature adoption funnel and DAU/MAU ratio analysis
**Result:** identifying {features} high-impact features that improved DAU/MAU ratio from {before} to {after} and increased 30-day retention from {ret_before}% to {ret_after}%

**Variations:**
- **A (Standard):** Built product analytics for {products} products and {features} features across {users}M users tracking {metrics} metrics, identifying improvements that grew DAU/MAU from {before} to {after} and 30d retention from {ret_before}% to {ret_after}%.
- **B (Result-first):** Grew DAU/MAU from {before} to {after} and 30d retention from {ret_before}% to {ret_after}% by building product analytics for {products} products and {features} features.
- **C (Impact-led):** Grew DAU/MAU from {before} to {after} and 30d retention from {ret_before}% to {ret_after}%; built product analytics for {products} products and {features} features across {users}M users.
- **D (Concise):** Built product analytics for {products} products and {features} features across {users}M users, DAU/MAU from {before} to {after}, 30d retention from {ret_before}% to {ret_after}%.

**Variables:**
  - `{metrics}`: 20 to 60, step 10 (integer)
  - `{products}`: 2 to 10, step 1 (integer)
  - `{features}`: 20 to 200, step 10 (integer)
  - `{users}`: 0.1 to 100, step 1 (integer)
  - `{before}`: 0.15 to 0.30, step 0.05 (integer)
  - `{after}`: 0.35 to 0.60, step 0.05 (integer)
  - `{ret_before}`: 20 to 35, step 5 (percentage)
  - `{ret_after}`: 40 to 65, step 5 (percentage)

### DATA-0325
**Role:** data-engineer | **Theme:** streaming-enrichment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** streaming enrichment, event enrichment, lookup joins, reference data, real-time lookup, stream augmentation

**Scope:** a streaming enrichment layer adding {enrichments} reference data joins to a {throughput}K events per second Kafka stream, performing low-latency lookups against {lookup_tables} lookup tables using Redis-backed caching
**Result:** reducing enrichment latency from {before}ms to {after}ms P99 and achieving {hit_rate}% cache hit rate across {events}B monthly enriched events

**Variations:**
- **A (Standard):** Built streaming enrichment with {enrichments} joins at {throughput}K events/sec using Redis across {lookup_tables} tables, cutting latency from {before}ms to {after}ms P99 and achieving {hit_rate}% cache hit rate.
- **B (Result-first):** Cut latency from {before}ms to {after}ms P99 and achieved {hit_rate}% cache hit rate by building streaming enrichment with {enrichments} joins at {throughput}K events/sec.
- **C (Impact-led):** Cut latency from {before}ms to {after}ms P99 and achieved {hit_rate}% cache hit rate; built enrichment layer with {enrichments} joins at {throughput}K events/sec across {lookup_tables} tables.
- **D (Concise):** Built enrichment layer with {enrichments} joins at {throughput}K events/sec across {lookup_tables} tables, latency from {before}ms to {after}ms P99, {hit_rate}% cache hit.

**Variables:**
  - `{enrichments}`: 5 to 30, step 5 (integer)
  - `{throughput}`: 10 to 500, step 10 (integer)
  - `{lookup_tables}`: 5 to 50, step 5 (integer)
  - `{before}`: 50 to 500, step 50 (integer)
  - `{after}`: 5 to 20, step 5 (integer)
  - `{hit_rate}`: 90 to 99.9, step 1 (percentage)
  - `{events}`: 1 to 100, step 5 (integer)

### DATA-0326
**Role:** data-scientist | **Theme:** sports-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sports analytics, performance analytics, player analytics, xG, tracking data, event data analytics

**Scope:** a player and team performance analytics platform processing {events}M match events and {tracking_frames}M tracking data frames per season for {teams} teams across {seasons} seasons and {competitions} competitions
**Result:** improving team tactical decision accuracy by {accuracy}% as assessed by coaching staff and identifying {player_insights} player performance insights adopted in training

**Variations:**
- **A (Standard):** Built sports analytics processing {events}M events and {tracking_frames}M frames for {teams} teams across {seasons} seasons, improving tactical decision accuracy {accuracy}% and generating {player_insights} adopted player insights.
- **B (Result-first):** Improved tactical decision accuracy {accuracy}% and generated {player_insights} adopted insights by processing {events}M events and {tracking_frames}M frames for {teams} teams.
- **C (Impact-led):** Improved tactical accuracy {accuracy}% and generated {player_insights} adopted insights; built analytics processing {events}M events and {tracking_frames}M frames for {teams} teams.
- **D (Concise):** Built sports analytics from {events}M events and {tracking_frames}M frames for {teams} teams across {seasons} seasons, tactical accuracy up {accuracy}%, {player_insights} insights adopted.

**Variables:**
  - `{events}`: 10 to 500, step 10 (integer)
  - `{tracking_frames}`: 100 to 5000, step 100 (integer)
  - `{teams}`: 10 to 100, step 10 (integer)
  - `{seasons}`: 2 to 10, step 2 (integer)
  - `{competitions}`: 2 to 8, step 1 (integer)
  - `{accuracy}`: 10 to 35, step 5 (percentage)
  - `{player_insights}`: 5 to 30, step 5 (integer)

### DATA-0327
**Role:** data-analyst | **Theme:** revenue-attribution-analytics | **Seniority:** senior | **Verb Context:** systems
**Keywords:** revenue attribution, multi-touch attribution, first-touch, last-touch, data-driven attribution, conversion analytics

**Scope:** a revenue attribution analytics platform comparing {models} attribution models including first-touch, last-touch, linear, and data-driven for {channels} marketing channels and ${revenue}M in tracked revenue
**Result:** reallocating ${budget}K in marketing spend from over-credited to under-credited channels and improving blended marketing efficiency by {efficiency}%

**Variations:**
- **A (Standard):** Built attribution analytics comparing {models} models across {channels} channels for ${revenue}M revenue, reallocating ${budget}K in spend and improving blended marketing efficiency {efficiency}%.
- **B (Result-first):** Reallocated ${budget}K in spend and improved marketing efficiency {efficiency}% by building attribution analytics comparing {models} models across {channels} channels.
- **C (Impact-led):** Reallocated ${budget}K in spend and improved efficiency {efficiency}%; built attribution analytics comparing {models} models across {channels} channels for ${revenue}M.
- **D (Concise):** Built attribution analytics for {models} models across {channels} channels at ${revenue}M, ${budget}K reallocated, efficiency up {efficiency}%.

**Variables:**
  - `{models}`: 4 to 8, step 1 (integer)
  - `{channels}`: 5 to 15, step 5 (integer)
  - `{revenue}`: 10 to 500, step 10 (currency)
  - `{budget}`: 100 to 5000, step 100 (currency)
  - `{efficiency}`: 10 to 35, step 5 (percentage)

### DATA-0328
**Role:** data-engineer | **Theme:** data-observability-platform | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data observability, Monte Carlo, Bigeye, observability platform, anomaly detection pipelines, data freshness monitoring

**Scope:** a data observability platform covering {tables}K tables and {pipelines} pipelines with automated freshness, volume, schema, and distribution monitoring across {teams} data-consuming teams
**Result:** reducing mean time to detect data issues from {before} hours to {after} minutes and decreasing downstream data incident tickets by {reduction}% per quarter

**Variations:**
- **A (Standard):** Deployed data observability for {tables}K tables and {pipelines} pipelines across {teams} teams, cutting mean detection from {before}h to {after}min and reducing incident tickets {reduction}% per quarter.
- **B (Result-first):** Cut detection from {before}h to {after}min and reduced tickets {reduction}%/quarter by deploying observability for {tables}K tables and {pipelines} pipelines.
- **C (Impact-led):** Cut detection from {before}h to {after}min and reduced tickets {reduction}%/quarter; deployed observability for {tables}K tables and {pipelines} pipelines across {teams} teams.
- **D (Concise):** Deployed observability for {tables}K tables and {pipelines} pipelines across {teams} teams, detection from {before}h to {after}min, tickets down {reduction}%/quarter.

**Variables:**
  - `{tables}`: 10 to 500, step 10 (integer)
  - `{pipelines}`: 20 to 200, step 20 (integer)
  - `{teams}`: 5 to 30, step 5 (integer)
  - `{before}`: 4 to 24, step 4 (integer)
  - `{after}`: 5 to 30, step 5 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)

### DATA-0329
**Role:** data-scientist | **Theme:** churn-prevention-model | **Seniority:** mid | **Verb Context:** systems
**Keywords:** churn prevention, proactive retention, risk scoring, intervention model, save rate, retention model

**Scope:** a churn prevention model scoring {customers}M customers weekly with {features} behavioral features, triggering {interventions} targeted retention interventions for high-risk segments via {channels} outreach channels
**Result:** achieving {save_rate}% save rate on intervened customers and reducing monthly churn from {before}% to {after}% generating ${revenue_saved}K in retained revenue

**Variations:**
- **A (Standard):** Built churn model scoring {customers}M customers weekly on {features} features, triggering {interventions} interventions via {channels} channels, achieving {save_rate}% save rate and cutting churn from {before}% to {after}%.
- **B (Result-first):** Achieved {save_rate}% save rate and cut churn from {before}% to {after}% by scoring {customers}M customers and triggering {interventions} targeted interventions.
- **C (Impact-led):** Achieved {save_rate}% save rate and cut churn from {before}% to {after}%; built churn model scoring {customers}M customers on {features} features via {channels} channels.
- **D (Concise):** Built churn model for {customers}M customers on {features} features, {save_rate}% save rate, churn from {before}% to {after}%, ${revenue_saved}K retained.

**Variables:**
  - `{customers}`: 0.1 to 50, step 1 (integer)
  - `{features}`: 30 to 300, step 10 (integer)
  - `{interventions}`: 3 to 8, step 1 (integer)
  - `{channels}`: 2 to 6, step 1 (integer)
  - `{save_rate}`: 15 to 40, step 5 (percentage)
  - `{before}`: 3 to 12, step 1 (percentage)
  - `{after}`: 1 to 4, step 0.5 (percentage)
  - `{revenue_saved}`: 100 to 5000, step 100 (currency)

### DATA-0330
**Role:** data-analyst | **Theme:** b2b-sales-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** B2B sales analytics, pipeline analytics, deal analytics, win loss analytics, sales cycle, ACV analytics

**Scope:** a B2B sales analytics platform tracking {metrics} pipeline and deal metrics across {reps} sales reps, {segments} deal segments, and ${pipeline}M in pipeline value with win-loss and sales cycle analysis
**Result:** improving pipeline forecast accuracy from {before}% to {after}% MAPE and increasing sales team win rate from {wr_before}% to {wr_after}%

**Variations:**
- **A (Standard):** Built B2B sales analytics for {reps} reps and ${pipeline}M pipeline across {segments} segments tracking {metrics} metrics, improving forecast MAPE from {before}% to {after}% and win rate from {wr_before}% to {wr_after}%.
- **B (Result-first):** Improved forecast MAPE from {before}% to {after}% and win rate from {wr_before}% to {wr_after}% by building sales analytics for {reps} reps across ${pipeline}M pipeline.
- **C (Impact-led):** Improved MAPE from {before}% to {after}% and win rate from {wr_before}% to {wr_after}%; built B2B sales analytics for {reps} reps across ${pipeline}M pipeline and {segments} segments.
- **D (Concise):** Built B2B sales analytics for {reps} reps and ${pipeline}M pipeline across {segments} segments, MAPE from {before}% to {after}%, win rate from {wr_before}% to {wr_after}%.

**Variables:**
  - `{metrics}`: 15 to 50, step 5 (integer)
  - `{reps}`: 10 to 200, step 10 (integer)
  - `{segments}`: 3 to 10, step 1 (integer)
  - `{pipeline}`: 10 to 500, step 10 (currency)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)
  - `{wr_before}`: 20 to 35, step 5 (percentage)
  - `{wr_after}`: 38 to 60, step 2 (percentage)

### DATA-0331
**Role:** data-engineer | **Theme:** vector-search-pipeline | **Seniority:** senior | **Verb Context:** systems
**Keywords:** vector search pipeline, Pinecone, Weaviate, embedding pipeline, semantic search, vector index

**Scope:** a vector search pipeline embedding {documents}M documents using a {dim}-dimensional model and indexing into Pinecone, serving {qps}K semantic search queries per second at sub-{latency}ms P99 latency
**Result:** improving semantic search relevance from {before}% to {after}% NDCG@10 and enabling {use_cases} new AI-powered search use cases previously not possible

**Variations:**
- **A (Standard):** Built Pinecone vector search pipeline for {documents}M docs at {dim}d, serving {qps}K queries/sec at sub-{latency}ms P99, improving NDCG@10 from {before}% to {after}% and enabling {use_cases} new use cases.
- **B (Result-first):** Improved NDCG@10 from {before}% to {after}% and enabled {use_cases} new use cases by building Pinecone pipeline for {documents}M docs at {qps}K queries/sec.
- **C (Impact-led):** Improved NDCG@10 from {before}% to {after}% and enabled {use_cases} new use cases; built vector search pipeline for {documents}M docs at {dim}d and {qps}K queries/sec.
- **D (Concise):** Built vector search for {documents}M docs at {dim}d and {qps}K queries/sec sub-{latency}ms, NDCG@10 from {before}% to {after}%, {use_cases} new use cases.

**Variables:**
  - `{documents}`: 1 to 500, step 10 (integer)
  - `{dim}`: 128 to 1536, step 128 (integer)
  - `{qps}`: 1 to 100, step 5 (integer)
  - `{latency}`: 20 to 100, step 10 (integer)
  - `{before}`: 55 to 70, step 5 (percentage)
  - `{after}`: 78 to 92, step 2 (percentage)
  - `{use_cases}`: 3 to 10, step 1 (integer)

### DATA-0332
**Role:** data-analyst | **Theme:** environmental-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ESG analytics, emissions analytics, carbon analytics, sustainability reporting, Scope 1 2 3, environmental KPIs

**Scope:** an ESG analytics platform tracking {metrics} sustainability metrics including Scope 1, 2, and 3 emissions across {facilities} facilities and {suppliers} suppliers for regulatory and voluntary reporting frameworks
**Result:** improving emissions data accuracy from {before}% to {after}% and reducing annual reporting production time from {report_before} weeks to {report_after} days

**Variations:**
- **A (Standard):** Built ESG analytics for {facilities} facilities and {suppliers} suppliers tracking {metrics} metrics including Scope 1-3, improving data accuracy from {before}% to {after}% and cutting report time from {report_before}wk to {report_after}d.
- **B (Result-first):** Improved data accuracy from {before}% to {after}% and cut report time from {report_before}wk to {report_after}d by building ESG analytics for {facilities} facilities and {suppliers} suppliers.
- **C (Impact-led):** Improved accuracy from {before}% to {after}% and cut report time from {report_before}wk to {report_after}d; built ESG analytics tracking Scope 1-3 across {facilities} facilities and {suppliers} suppliers.
- **D (Concise):** Built ESG analytics for {facilities} facilities and {suppliers} suppliers across {metrics} metrics, accuracy from {before}% to {after}%, report time from {report_before}wk to {report_after}d.

**Variables:**
  - `{metrics}`: 20 to 80, step 10 (integer)
  - `{facilities}`: 5 to 200, step 5 (integer)
  - `{suppliers}`: 50 to 2000, step 50 (integer)
  - `{before}`: 60 to 80, step 5 (percentage)
  - `{after}`: 90 to 99, step 2 (percentage)
  - `{report_before}`: 4 to 12, step 2 (integer)
  - `{report_after}`: 1 to 3, step 1 (integer)

### DATA-0333
**Role:** data-engineer | **Theme:** cross-account-data | **Seniority:** senior | **Verb Context:** systems
**Keywords:** cross-account data sharing, AWS cross-account, Snowflake data sharing, secure data sharing, data marketplace, account governance

**Scope:** a cross-account data sharing architecture enabling {consumers} consumer accounts to access {datasets} curated datasets from {producer_accounts} producer accounts using native platform sharing with row-level security
**Result:** eliminating {data_copies} redundant data copies and reducing data sharing latency from {before} hours to {after} seconds while maintaining {compliance}% access governance compliance

**Variations:**
- **A (Standard):** Built cross-account sharing for {consumers} consumers and {datasets} datasets from {producer_accounts} accounts with RLS, eliminating {data_copies} copies and cutting sharing latency from {before}h to {after}s.
- **B (Result-first):** Eliminated {data_copies} data copies and cut sharing latency from {before}h to {after}s by building cross-account sharing for {consumers} consumers and {datasets} datasets.
- **C (Impact-led):** Eliminated {data_copies} copies and cut sharing from {before}h to {after}s; built cross-account sharing for {consumers} consumers accessing {datasets} datasets from {producer_accounts} accounts.
- **D (Concise):** Built cross-account sharing for {consumers} consumers and {datasets} datasets from {producer_accounts} accounts, {data_copies} copies eliminated, sharing from {before}h to {after}s.

**Variables:**
  - `{consumers}`: 5 to 50, step 5 (integer)
  - `{datasets}`: 10 to 200, step 10 (integer)
  - `{producer_accounts}`: 2 to 10, step 1 (integer)
  - `{data_copies}`: 10 to 100, step 10 (integer)
  - `{before}`: 2 to 12, step 2 (integer)
  - `{after}`: 1 to 10, step 1 (integer)
  - `{compliance}`: 99 to 100, step 0.1 (percentage)

### DATA-0334
**Role:** data-scientist | **Theme:** generative-augmentation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** generative augmentation, LLM data augmentation, synthetic data augmentation, data synthesis, training data generation, augmentation pipeline

**Scope:** a generative data augmentation pipeline using LLMs to synthesize {synthetic}K training examples for {tasks} low-resource NLP tasks, increasing training set size from {before}K to {after}K examples per task
**Result:** improving average task F1 from {f1_before} to {f1_after} and reducing labeling cost by ${savings}K across {tasks} tasks

**Variations:**
- **A (Standard):** Built LLM augmentation pipeline generating {synthetic}K examples for {tasks} tasks, expanding training from {before}K to {after}K, improving F1 from {f1_before} to {f1_after} and saving ${savings}K in labeling.
- **B (Result-first):** Improved F1 from {f1_before} to {f1_after} and saved ${savings}K in labeling by generating {synthetic}K examples across {tasks} tasks expanding training from {before}K to {after}K.
- **C (Impact-led):** Improved F1 from {f1_before} to {f1_after} and saved ${savings}K; built LLM augmentation generating {synthetic}K examples for {tasks} tasks expanding training from {before}K to {after}K.
- **D (Concise):** Built LLM augmentation for {tasks} tasks generating {synthetic}K examples, training from {before}K to {after}K, F1 from {f1_before} to {f1_after}, ${savings}K saved.

**Variables:**
  - `{synthetic}`: 10 to 500, step 10 (integer)
  - `{tasks}`: 5 to 20, step 5 (integer)
  - `{before}`: 1 to 10, step 1 (integer)
  - `{after}`: 20 to 100, step 10 (integer)
  - `{f1_before}`: 0.55 to 0.70, step 0.05 (integer)
  - `{f1_after}`: 0.78 to 0.92, step 0.02 (integer)
  - `{savings}`: 20 to 300, step 20 (currency)

### DATA-0335
**Role:** data-analyst | **Theme:** product-usage-analytics | **Seniority:** junior | **Verb Context:** systems
**Keywords:** product usage analytics, feature usage, active user analytics, product telemetry, usage funnel, engagement analytics

**Scope:** a product usage analytics dashboard tracking {metrics} engagement metrics for {features} product features across {users}K users and {tiers} subscription tiers, built on telemetry event data
**Result:** identifying {features_unused} underused features that informed {decisions} product roadmap decisions and improving average feature adoption rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Built usage analytics for {features} features across {users}K users and {tiers} tiers tracking {metrics} metrics, identifying {features_unused} underused features that informed {decisions} roadmap decisions and grew adoption from {before}% to {after}%.
- **B (Result-first):** Grew adoption from {before}% to {after}% and informed {decisions} roadmap decisions by building usage analytics for {features} features across {users}K users.
- **C (Impact-led):** Grew adoption from {before}% to {after}% and informed {decisions} roadmap decisions; built usage analytics for {features} features across {users}K users tracking {metrics} metrics.
- **D (Concise):** Built usage analytics for {features} features across {users}K users and {tiers} tiers, {features_unused} underused identified, {decisions} roadmap decisions, adoption from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 15 to 40, step 5 (integer)
  - `{features}`: 20 to 200, step 20 (integer)
  - `{users}`: 1 to 500, step 10 (integer)
  - `{tiers}`: 2 to 5, step 1 (integer)
  - `{features_unused}`: 5 to 30, step 5 (integer)
  - `{decisions}`: 3 to 10, step 1 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 50 to 75, step 5 (percentage)

### DATA-0336
**Role:** data-engineer | **Theme:** data-catalog-lineage | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data catalog, data lineage, Apache Atlas, DataHub, end-to-end lineage, lineage tracking

**Scope:** a data catalog and end-to-end lineage implementation using DataHub across {assets}K data assets, {pipelines} pipelines, and {sources} source systems, enabling column-level lineage for {critical_tables} critical tables
**Result:** reducing time to assess pipeline change impact from {before} days to {after} hours and achieving {coverage}% asset documentation coverage

**Variations:**
- **A (Standard):** Implemented DataHub catalog and lineage for {assets}K assets, {pipelines} pipelines, and {sources} sources with column-level lineage, cutting impact assessment from {before} days to {after} hours and achieving {coverage}% coverage.
- **B (Result-first):** Cut impact assessment from {before} days to {after} hours and achieved {coverage}% coverage by implementing DataHub catalog for {assets}K assets across {pipelines} pipelines.
- **C (Impact-led):** Cut impact assessment from {before} days to {after} hours and achieved {coverage}% coverage; implemented DataHub catalog for {assets}K assets, {pipelines} pipelines, and {sources} sources.
- **D (Concise):** Implemented DataHub catalog for {assets}K assets, {pipelines} pipelines, and {sources} sources, impact assessment from {before}d to {after}h, {coverage}% coverage.

**Variables:**
  - `{assets}`: 10 to 200, step 10 (integer)
  - `{pipelines}`: 50 to 500, step 50 (integer)
  - `{sources}`: 10 to 100, step 10 (integer)
  - `{critical_tables}`: 50 to 500, step 50 (integer)
  - `{before}`: 3 to 10, step 1 (integer)
  - `{after}`: 0.5 to 2, step 0.5 (integer)
  - `{coverage}`: 80 to 100, step 5 (percentage)

### DATA-0337
**Role:** data-scientist | **Theme:** sensitivity-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sensitivity analysis, Sobol indices, Monte Carlo sensitivity, what-if analysis, parameter sensitivity, scenario analysis

**Scope:** a sensitivity analysis framework applying Sobol indices and Monte Carlo simulation to {models} business and scientific models with {parameters} uncertain parameters and {scenarios}K scenarios per run
**Result:** identifying {key_drivers} key uncertainty drivers that reduced model parameter space by {reduction}% and improved decision-making confidence for {decisions} major business decisions

**Variations:**
- **A (Standard):** Applied Sobol sensitivity to {models} models across {parameters} parameters at {scenarios}K scenarios, identifying {key_drivers} key drivers that reduced parameter space {reduction}% and improved confidence for {decisions} decisions.
- **B (Result-first):** Reduced parameter space {reduction}% and improved confidence for {decisions} decisions by applying Sobol analysis to {models} models across {parameters} parameters.
- **C (Impact-led):** Reduced parameter space {reduction}% and improved confidence for {decisions} decisions; applied Sobol sensitivity to {models} models across {parameters} parameters at {scenarios}K scenarios.
- **D (Concise):** Applied Sobol sensitivity to {models} models across {parameters} parameters at {scenarios}K scenarios, {key_drivers} drivers, space down {reduction}%, {decisions} decisions improved.

**Variables:**
  - `{models}`: 3 to 15, step 3 (integer)
  - `{parameters}`: 10 to 100, step 10 (integer)
  - `{scenarios}`: 10 to 500, step 10 (integer)
  - `{key_drivers}`: 3 to 10, step 1 (integer)
  - `{reduction}`: 40 to 80, step 5 (percentage)
  - `{decisions}`: 3 to 10, step 1 (integer)

### DATA-0338
**Role:** data-analyst | **Theme:** credit-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** credit analytics, credit risk analytics, delinquency analytics, portfolio quality, vintage analytics, credit KPIs

**Scope:** a credit portfolio analytics platform tracking {metrics} credit quality metrics across ${portfolio}M in outstanding balance, {segments} borrower segments, and {products} credit products with vintage and roll-rate analysis
**Result:** identifying ${risk}K in at-risk exposure {weeks} weeks earlier than existing processes and improving credit loss forecast accuracy from {before}% to {after}% MAPE

**Variations:**
- **A (Standard):** Built credit analytics for ${portfolio}M across {segments} segments and {products} products tracking {metrics} metrics, identifying ${risk}K in at-risk exposure {weeks} weeks early and improving MAPE from {before}% to {after}%.
- **B (Result-first):** Identified ${risk}K exposure {weeks} weeks early and improved MAPE from {before}% to {after}% by building credit analytics for ${portfolio}M across {segments} segments.
- **C (Impact-led):** Identified ${risk}K exposure {weeks} weeks early and improved MAPE from {before}% to {after}%; built credit analytics for ${portfolio}M across {segments} segments and {products} products.
- **D (Concise):** Built credit analytics for ${portfolio}M across {segments} segments and {products} products, ${risk}K at-risk {weeks}wk early, MAPE from {before}% to {after}%.

**Variables:**
  - `{metrics}`: 15 to 50, step 5 (integer)
  - `{portfolio}`: 10 to 1000, step 50 (currency)
  - `{segments}`: 5 to 20, step 5 (integer)
  - `{products}`: 3 to 10, step 1 (integer)
  - `{risk}`: 100 to 5000, step 100 (currency)
  - `{weeks}`: 2 to 8, step 2 (integer)
  - `{before}`: 20 to 40, step 5 (percentage)
  - `{after}`: 5 to 12, step 1 (percentage)

### DATA-0339
**Role:** data-engineer | **Theme:** streaming-deduplication | **Seniority:** mid | **Verb Context:** systems
**Keywords:** streaming deduplication, event deduplication, exactly-once, idempotent streaming, duplicate detection, bloom filter deduplication

**Scope:** a streaming deduplication layer using bloom filters and Redis-based state to deduplicate {events}M events per day across {streams} Kafka streams with {window} hour deduplication windows
**Result:** reducing duplicate event rate from {before}% to {after}% and preventing {duplicate_records}M duplicate records from reaching downstream systems per month

**Variations:**
- **A (Standard):** Built bloom filter deduplication for {events}M events/day across {streams} streams at {window}h windows, cutting duplicates from {before}% to {after}% and preventing {duplicate_records}M records/month downstream.
- **B (Result-first):** Cut duplicates from {before}% to {after}% and prevented {duplicate_records}M records/month by building bloom filter deduplication for {events}M events/day across {streams} streams.
- **C (Impact-led):** Cut duplicates from {before}% to {after}% and prevented {duplicate_records}M downstream records/month; built bloom filter deduplication for {events}M events/day across {streams} streams.
- **D (Concise):** Built deduplication for {events}M events/day across {streams} streams at {window}h windows, duplicates from {before}% to {after}%, {duplicate_records}M records prevented/month.

**Variables:**
  - `{events}`: 10 to 1000, step 10 (integer)
  - `{streams}`: 5 to 50, step 5 (integer)
  - `{window}`: 1 to 24, step 1 (integer)
  - `{before}`: 2 to 15, step 1 (percentage)
  - `{after}`: 0.01 to 0.1, step 0.01 (percentage)
  - `{duplicate_records}`: 1 to 100, step 5 (integer)

### DATA-0340
**Role:** data-scientist | **Theme:** model-uncertainty | **Seniority:** senior | **Verb Context:** systems
**Keywords:** uncertainty quantification, conformal prediction, prediction intervals, epistemic uncertainty, aleatoric uncertainty, calibrated models

**Scope:** an uncertainty quantification framework applying conformal prediction and deep ensembles to {models} production models, producing calibrated prediction intervals for {use_cases} high-stakes decision use cases
**Result:** improving model calibration from {ece_before} to {ece_after} ECE and reducing high-confidence wrong predictions from {before}% to {after}% of total predictions

**Variations:**
- **A (Standard):** Built conformal prediction UQ for {models} models across {use_cases} high-stakes use cases, improving ECE from {ece_before} to {ece_after} and cutting high-confidence errors from {before}% to {after}%.
- **B (Result-first):** Improved ECE from {ece_before} to {ece_after} and cut high-confidence errors from {before}% to {after}% by applying conformal prediction UQ to {models} models.
- **C (Impact-led):** Improved ECE from {ece_before} to {ece_after} and cut high-confidence errors from {before}% to {after}%; built conformal prediction UQ for {models} models across {use_cases} use cases.
- **D (Concise):** Built UQ for {models} models across {use_cases} use cases, ECE from {ece_before} to {ece_after}, high-confidence errors from {before}% to {after}%.

**Variables:**
  - `{models}`: 5 to 20, step 5 (integer)
  - `{use_cases}`: 3 to 10, step 1 (integer)
  - `{ece_before}`: 0.10 to 0.25, step 0.05 (integer)
  - `{ece_after}`: 0.01 to 0.05, step 0.01 (integer)
  - `{before}`: 10 to 25, step 5 (percentage)
  - `{after}`: 1 to 4, step 1 (percentage)

### DATA-0341
**Role:** data-analyst | **Theme:** reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** reporting, Excel, SQL, stakeholder communication, weekly metrics

**Scope:** weekly reporting cycles across {reportCount} business reports covering {metricCount} operational metrics for {stakeholderCount} stakeholders
**Result:** reducing reporting turnaround by {timeReduction}% and improving stakeholder satisfaction by {satisfactionIncrease}%

**Variations:**
- **A (Standard):** Managed weekly reporting cycles across {reportCount} business reports covering {metricCount} operational metrics for {stakeholderCount} stakeholders, reducing reporting turnaround by {timeReduction}% and improving stakeholder satisfaction by {satisfactionIncrease}%.
- **B (Result-first):** Reduced reporting turnaround by {timeReduction}% and improved stakeholder satisfaction by {satisfactionIncrease}% by managing {reportCount} weekly reports covering {metricCount} metrics for {stakeholderCount} stakeholders.
- **C (Impact-led):** Faster business reporting — cut turnaround by {timeReduction}% and increased stakeholder satisfaction by {satisfactionIncrease}% while managing {reportCount} reports covering {metricCount} metrics.
- **D (Concise):** Managed {reportCount} weekly reports covering {metricCount} metrics — {timeReduction}% faster turnaround and {satisfactionIncrease}% higher stakeholder satisfaction.

**Variables:**
  - `{reportCount}`: 5 to 20, step 1 (integer)
  - `{metricCount}`: 10 to 60, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{satisfactionIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0342
**Role:** data-analyst | **Theme:** sql-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SQL, query optimization, data analysis, joins, business insights

**Scope:** analytical SQL queries across {queryCount} recurring business requests over datasets totaling {rowCount} rows
**Result:** reducing query runtime by {runtimeReduction}% and improving analyst productivity by {productivityIncrease}%

**Variations:**
- **A (Standard):** Optimized analytical SQL queries across {queryCount} recurring business requests over datasets totaling {rowCount} rows, reducing query runtime by {runtimeReduction}% and improving analyst productivity by {productivityIncrease}%.
- **B (Result-first):** Reduced query runtime by {runtimeReduction}% and improved analyst productivity by {productivityIncrease}% by optimizing {queryCount} SQL queries over datasets totaling {rowCount} rows.
- **C (Impact-led):** Faster SQL analysis — cut runtime by {runtimeReduction}% and improved analyst productivity by {productivityIncrease}% through optimization of {queryCount} recurring queries across {rowCount} rows.
- **D (Concise):** Optimized {queryCount} SQL queries across {rowCount} rows — {runtimeReduction}% lower runtime and {productivityIncrease}% higher productivity.

**Variables:**
  - `{queryCount}`: 10 to 50, step 5 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{runtimeReduction}`: 15 to 35, step 5 (percentage)
  - `{productivityIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0343
**Role:** data-analyst | **Theme:** data-validation | **Seniority:** junior | **Verb Context:** systems
**Keywords:** data validation, QA, Excel, SQL, data integrity

**Scope:** data validation checks across {datasetCount} source tables containing {rowCount} rows before monthly reporting releases
**Result:** reducing data discrepancies by {discrepancyReduction}% and improving release accuracy by {accuracyIncrease}%

**Variations:**
- **A (Standard):** Assisted data validation checks across {datasetCount} source tables containing {rowCount} rows before monthly reporting releases, reducing data discrepancies by {discrepancyReduction}% and improving release accuracy by {accuracyIncrease}%.
- **B (Result-first):** Reduced data discrepancies by {discrepancyReduction}% and improved release accuracy by {accuracyIncrease}% by assisting validation checks across {datasetCount} source tables containing {rowCount} rows.
- **C (Impact-led):** Cleaner reporting inputs — reduced discrepancies by {discrepancyReduction}% and improved accuracy by {accuracyIncrease}% while assisting checks across {datasetCount} source tables with {rowCount} rows.
- **D (Concise):** Assisted validation across {datasetCount} source tables with {rowCount} rows — {discrepancyReduction}% fewer discrepancies and {accuracyIncrease}% higher release accuracy.

**Variables:**
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 300000 to 3000000, step 300000 (integer)
  - `{discrepancyReduction}`: 10 to 25, step 5 (percentage)
  - `{accuracyIncrease}`: 10 to 25, step 5 (percentage)

### DATA-0344
**Role:** bi-analyst | **Theme:** dashboard-development | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Power BI, Tableau, dashboard development, KPIs, visualization

**Scope:** executive dashboards across {dashboardCount} views tracking {metricCount} core business KPIs for {stakeholderCount} leaders
**Result:** improving KPI visibility by {visibilityIncrease}% and reducing manual reporting effort by {effortReduction}%

**Variations:**
- **A (Standard):** Developed executive dashboards across {dashboardCount} views tracking {metricCount} core business KPIs for {stakeholderCount} leaders, improving KPI visibility by {visibilityIncrease}% and reducing manual reporting effort by {effortReduction}%.
- **B (Result-first):** Improved KPI visibility by {visibilityIncrease}% and reduced manual reporting effort by {effortReduction}% by developing {dashboardCount} executive dashboards tracking {metricCount} KPIs for {stakeholderCount} leaders.
- **C (Impact-led):** More accessible business intelligence — increased KPI visibility by {visibilityIncrease}% and cut manual reporting effort by {effortReduction}% through development of {dashboardCount} executive dashboards.
- **D (Concise):** Developed {dashboardCount} executive dashboards tracking {metricCount} KPIs — {visibilityIncrease}% better visibility and {effortReduction}% less manual effort.

**Variables:**
  - `{dashboardCount}`: 3 to 10, step 1 (integer)
  - `{metricCount}`: 15 to 60, step 5 (integer)
  - `{stakeholderCount}`: 5 to 25, step 5 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{effortReduction}`: 10 to 30, step 5 (percentage)

### DATA-0345
**Role:** bi-analyst | **Theme:** kpi-tracking | **Seniority:** junior | **Verb Context:** projects
**Keywords:** KPI tracking, Excel, Power BI, business metrics, monitoring

**Scope:** KPI tracking across {metricCount} business metrics reviewed in {reviewCount} recurring performance meetings
**Result:** improving reporting consistency by {consistencyIncrease}% and reducing metric reconciliation issues by {issueReduction}%

**Variations:**
- **A (Standard):** Supported KPI tracking across {metricCount} business metrics reviewed in {reviewCount} recurring performance meetings, improving reporting consistency by {consistencyIncrease}% and reducing metric reconciliation issues by {issueReduction}%.
- **B (Result-first):** Improved reporting consistency by {consistencyIncrease}% and reduced metric reconciliation issues by {issueReduction}% by supporting tracking of {metricCount} business metrics in {reviewCount} recurring meetings.
- **C (Impact-led):** More reliable KPI monitoring — improved consistency by {consistencyIncrease}% and reduced reconciliation issues by {issueReduction}% while supporting tracking of {metricCount} metrics across {reviewCount} meetings.
- **D (Concise):** Supported tracking of {metricCount} metrics across {reviewCount} meetings — {consistencyIncrease}% better consistency and {issueReduction}% fewer reconciliation issues.

**Variables:**
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{reviewCount}`: 4 to 20, step 2 (integer)
  - `{consistencyIncrease}`: 10 to 25, step 5 (percentage)
  - `{issueReduction}`: 10 to 25, step 5 (percentage)

### DATA-0346
**Role:** bi-analyst | **Theme:** stakeholder-reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** stakeholder reporting, PowerPoint, BI, metrics, executive reporting

**Scope:** stakeholder reporting packs across {reportCount} monthly business reviews covering {metricCount} KPIs
**Result:** improving stakeholder alignment by {alignmentIncrease}% and reducing reporting preparation time by {timeReduction}%

**Variations:**
- **A (Standard):** Managed stakeholder reporting packs across {reportCount} monthly business reviews covering {metricCount} KPIs, improving stakeholder alignment by {alignmentIncrease}% and reducing reporting preparation time by {timeReduction}%.
- **B (Result-first):** Improved stakeholder alignment by {alignmentIncrease}% and reduced reporting preparation time by {timeReduction}% by managing {reportCount} monthly review packs covering {metricCount} KPIs.
- **C (Impact-led):** Sharper executive communication — increased stakeholder alignment by {alignmentIncrease}% and cut preparation time by {timeReduction}% through management of {reportCount} KPI review packs.
- **D (Concise):** Managed {reportCount} monthly KPI review packs — {alignmentIncrease}% better alignment and {timeReduction}% less prep time.

**Variables:**
  - `{reportCount}`: 4 to 16, step 2 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{alignmentIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0347
**Role:** bi-analyst | **Theme:** data-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data modeling, star schema, Power BI, SQL, semantic layer

**Scope:** BI data models across {tableCount} source tables supporting {dashboardCount} dashboards and self-serve reporting
**Result:** improving query performance by {performanceIncrease}% and reducing model maintenance effort by {effortReduction}%

**Variations:**
- **A (Standard):** Designed BI data models across {tableCount} source tables supporting {dashboardCount} dashboards and self-serve reporting, improving query performance by {performanceIncrease}% and reducing model maintenance effort by {effortReduction}%.
- **B (Result-first):** Improved query performance by {performanceIncrease}% and reduced model maintenance effort by {effortReduction}% by designing BI models across {tableCount} source tables supporting {dashboardCount} dashboards.
- **C (Impact-led):** Faster and cleaner BI models — increased query performance by {performanceIncrease}% and reduced maintenance effort by {effortReduction}% through design of models across {tableCount} source tables.
- **D (Concise):** Designed BI models across {tableCount} source tables for {dashboardCount} dashboards — {performanceIncrease}% better performance and {effortReduction}% lower maintenance effort.

**Variables:**
  - `{tableCount}`: 10 to 60, step 5 (integer)
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{performanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{effortReduction}`: 10 to 30, step 5 (percentage)

### DATA-0348
**Role:** bi-analyst | **Theme:** self-serve-analytics | **Seniority:** senior | **Verb Context:** people
**Keywords:** self-serve analytics, Power BI, Tableau, data literacy, governance

**Scope:** self-serve analytics enablement for {stakeholderCount} business users across {dashboardCount} governed dashboard assets
**Result:** increasing self-service adoption by {adoptionIncrease}% and reducing ad hoc report requests by {requestReduction}%

**Variations:**
- **A (Standard):** Led self-serve analytics enablement for {stakeholderCount} business users across {dashboardCount} governed dashboard assets, increasing self-service adoption by {adoptionIncrease}% and reducing ad hoc report requests by {requestReduction}%.
- **B (Result-first):** Increased self-service adoption by {adoptionIncrease}% and reduced ad hoc report requests by {requestReduction}% by leading analytics enablement for {stakeholderCount} business users across {dashboardCount} dashboard assets.
- **C (Impact-led):** Broader analytics adoption — increased self-service usage by {adoptionIncrease}% and reduced ad hoc requests by {requestReduction}% through leadership of enablement for {stakeholderCount} users.
- **D (Concise):** Led self-serve enablement for {stakeholderCount} users across {dashboardCount} dashboard assets — {adoptionIncrease}% higher adoption and {requestReduction}% fewer ad hoc requests.

**Variables:**
  - `{stakeholderCount}`: 20 to 100, step 10 (integer)
  - `{dashboardCount}`: 5 to 20, step 1 (integer)
  - `{adoptionIncrease}`: 15 to 35, step 5 (percentage)
  - `{requestReduction}`: 10 to 30, step 5 (percentage)

### DATA-0349
**Role:** bi-analyst | **Theme:** forecasting | **Seniority:** senior | **Verb Context:** projects
**Keywords:** forecasting, Excel, Power BI, trend analysis, scenario planning

**Scope:** forecasting models across {modelCount} revenue and demand scenarios covering {metricCount} planning metrics
**Result:** improving forecast accuracy by {accuracyIncrease}% and reducing planning variance by {varianceReduction}%

**Variations:**
- **A (Standard):** Directed forecasting models across {modelCount} revenue and demand scenarios covering {metricCount} planning metrics, improving forecast accuracy by {accuracyIncrease}% and reducing planning variance by {varianceReduction}%.
- **B (Result-first):** Improved forecast accuracy by {accuracyIncrease}% and reduced planning variance by {varianceReduction}% by directing {modelCount} forecasting models covering {metricCount} planning metrics.
- **C (Impact-led):** More reliable planning forecasts — increased forecast accuracy by {accuracyIncrease}% and reduced variance by {varianceReduction}% through direction of {modelCount} scenario models.
- **D (Concise):** Directed {modelCount} forecasting models covering {metricCount} metrics — {accuracyIncrease}% higher accuracy and {varianceReduction}% lower variance.

**Variables:**
  - `{modelCount}`: 3 to 12, step 1 (integer)
  - `{metricCount}`: 10 to 40, step 5 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{varianceReduction}`: 10 to 30, step 5 (percentage)

### DATA-0350
**Role:** data-engineer | **Theme:** etl-pipelines | **Seniority:** junior | **Verb Context:** systems
**Keywords:** ETL, Python, SQL, data pipelines, batch processing

**Scope:** ETL pipeline maintenance across {pipelineCount} batch workflows processing {rowCount} records per day
**Result:** improving pipeline reliability by {reliabilityIncrease}% and reducing failed job incidents by {failureReduction}%

**Variations:**
- **A (Standard):** Assisted ETL pipeline maintenance across {pipelineCount} batch workflows processing {rowCount} records per day, improving pipeline reliability by {reliabilityIncrease}% and reducing failed job incidents by {failureReduction}%.
- **B (Result-first):** Improved pipeline reliability by {reliabilityIncrease}% and reduced failed job incidents by {failureReduction}% by assisting maintenance of {pipelineCount} workflows processing {rowCount} records daily.
- **C (Impact-led):** More stable ETL operations — increased reliability by {reliabilityIncrease}% and reduced failed jobs by {failureReduction}% while assisting maintenance of {pipelineCount} workflows.
- **D (Concise):** Assisted maintenance of {pipelineCount} ETL workflows processing {rowCount} records daily — {reliabilityIncrease}% higher reliability and {failureReduction}% fewer failed jobs.

**Variables:**
  - `{pipelineCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{reliabilityIncrease}`: 10 to 25, step 5 (percentage)
  - `{failureReduction}`: 10 to 25, step 5 (percentage)

### DATA-0351
**Role:** data-engineer | **Theme:** data-warehousing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data warehouse, Snowflake, BigQuery, SQL, warehouse optimization

**Scope:** warehouse query patterns across {tableCount} analytical tables storing {rowCount} records
**Result:** reducing query latency by {latencyReduction}% and lowering compute costs by {costReduction}%

**Variations:**
- **A (Standard):** Optimized warehouse query patterns across {tableCount} analytical tables storing {rowCount} records, reducing query latency by {latencyReduction}% and lowering compute costs by {costReduction}%.
- **B (Result-first):** Reduced query latency by {latencyReduction}% and lowered compute costs by {costReduction}% by optimizing query patterns across {tableCount} warehouse tables storing {rowCount} records.
- **C (Impact-led):** Faster and cheaper warehouse workloads — cut latency by {latencyReduction}% and lowered compute cost by {costReduction}% through optimization of {tableCount} analytical tables.
- **D (Concise):** Optimized query patterns across {tableCount} warehouse tables storing {rowCount} records — {latencyReduction}% lower latency and {costReduction}% lower compute cost.

**Variables:**
  - `{tableCount}`: 20 to 100, step 10 (integer)
  - `{rowCount}`: 1000000 to 10000000, step 1000000 (integer)
  - `{latencyReduction}`: 15 to 35, step 5 (percentage)
  - `{costReduction}`: 10 to 30, step 5 (percentage)

### DATA-0352
**Role:** data-engineer | **Theme:** data-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data modeling, dimensional modeling, SQL, warehouse, schema design

**Scope:** dimensional models across {modelCount} subject areas integrating {tableCount} source tables
**Result:** improving analyst query efficiency by {efficiencyIncrease}% and reducing transformation complexity by {complexityReduction}%

**Variations:**
- **A (Standard):** Designed dimensional models across {modelCount} subject areas integrating {tableCount} source tables, improving analyst query efficiency by {efficiencyIncrease}% and reducing transformation complexity by {complexityReduction}%.
- **B (Result-first):** Improved analyst query efficiency by {efficiencyIncrease}% and reduced transformation complexity by {complexityReduction}% by designing {modelCount} dimensional models integrating {tableCount} source tables.
- **C (Impact-led):** Cleaner analytical schemas — increased query efficiency by {efficiencyIncrease}% and reduced transformation complexity by {complexityReduction}% through design of {modelCount} dimensional models.
- **D (Concise):** Designed {modelCount} dimensional models integrating {tableCount} source tables — {efficiencyIncrease}% higher query efficiency and {complexityReduction}% lower transformation complexity.

**Variables:**
  - `{modelCount}`: 3 to 12, step 1 (integer)
  - `{tableCount}`: 10 to 60, step 5 (integer)
  - `{efficiencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{complexityReduction}`: 10 to 30, step 5 (percentage)

### DATA-0353
**Role:** data-engineer | **Theme:** pipeline-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline optimization, Airflow, Spark, orchestration, performance

**Scope:** orchestrated pipelines across {pipelineCount} workflows processing {rowCount} records per run
**Result:** reducing end-to-end processing time by {timeReduction}% and increasing throughput by {throughputIncrease}%

**Variations:**
- **A (Standard):** Improved orchestrated pipelines across {pipelineCount} workflows processing {rowCount} records per run, reducing end-to-end processing time by {timeReduction}% and increasing throughput by {throughputIncrease}%.
- **B (Result-first):** Reduced end-to-end processing time by {timeReduction}% and increased throughput by {throughputIncrease}% by improving {pipelineCount} orchestrated workflows processing {rowCount} records per run.
- **C (Impact-led):** Faster pipeline execution — cut processing time by {timeReduction}% and increased throughput by {throughputIncrease}% through improvement of {pipelineCount} workflows.
- **D (Concise):** Improved {pipelineCount} orchestrated workflows processing {rowCount} records per run — {timeReduction}% faster processing and {throughputIncrease}% higher throughput.

**Variables:**
  - `{pipelineCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{throughputIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0354
**Role:** data-engineer | **Theme:** stream-processing | **Seniority:** senior | **Verb Context:** systems
**Keywords:** stream processing, Kafka, Spark Streaming, real-time data, latency

**Scope:** real-time streaming pipelines across {pipelineCount} event flows ingesting {eventCount} events per hour
**Result:** reducing data latency by {latencyReduction}% and improving stream reliability by {reliabilityIncrease}%

**Variations:**
- **A (Standard):** Led real-time streaming pipelines across {pipelineCount} event flows ingesting {eventCount} events per hour, reducing data latency by {latencyReduction}% and improving stream reliability by {reliabilityIncrease}%.
- **B (Result-first):** Reduced data latency by {latencyReduction}% and improved stream reliability by {reliabilityIncrease}% by leading {pipelineCount} real-time event flows ingesting {eventCount} events per hour.
- **C (Impact-led):** More reliable real-time data delivery — cut latency by {latencyReduction}% and improved reliability by {reliabilityIncrease}% through leadership of {pipelineCount} streaming pipelines.
- **D (Concise):** Led {pipelineCount} streaming pipelines ingesting {eventCount} events per hour — {latencyReduction}% lower latency and {reliabilityIncrease}% higher reliability.

**Variables:**
  - `{pipelineCount}`: 3 to 10, step 1 (integer)
  - `{eventCount}`: 50000 to 500000, step 50000 (integer)
  - `{latencyReduction}`: 15 to 35, step 5 (percentage)
  - `{reliabilityIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0355
**Role:** data-engineer | **Theme:** data-governance | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data governance, data lineage, catalog, compliance, quality controls

**Scope:** data governance controls across {tableCount} critical tables supporting {stakeholderCount} business users
**Result:** improving lineage visibility by {visibilityIncrease}% and reducing compliance-related data issues by {issueReduction}%

**Variations:**
- **A (Standard):** Directed data governance controls across {tableCount} critical tables supporting {stakeholderCount} business users, improving lineage visibility by {visibilityIncrease}% and reducing compliance-related data issues by {issueReduction}%.
- **B (Result-first):** Improved lineage visibility by {visibilityIncrease}% and reduced compliance-related data issues by {issueReduction}% by directing governance controls across {tableCount} critical tables supporting {stakeholderCount} users.
- **C (Impact-led):** Stronger data governance — increased lineage visibility by {visibilityIncrease}% and reduced compliance issues by {issueReduction}% through direction of controls across {tableCount} critical tables.
- **D (Concise):** Directed governance controls across {tableCount} critical tables for {stakeholderCount} users — {visibilityIncrease}% better lineage visibility and {issueReduction}% fewer compliance issues.

**Variables:**
  - `{tableCount}`: 20 to 100, step 10 (integer)
  - `{stakeholderCount}`: 20 to 100, step 10 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{issueReduction}`: 10 to 30, step 5 (percentage)

### DATA-0356
**Role:** ml-engineer | **Theme:** model-training | **Seniority:** junior | **Verb Context:** projects
**Keywords:** model training, Python, scikit-learn, training data, classification

**Scope:** model training runs across {modelCount} supervised learning experiments using {sampleCount} labeled samples
**Result:** improving baseline model accuracy by {accuracyIncrease}% and reducing retraining setup time by {timeReduction}%

**Variations:**
- **A (Standard):** Assisted model training runs across {modelCount} supervised learning experiments using {sampleCount} labeled samples, improving baseline model accuracy by {accuracyIncrease}% and reducing retraining setup time by {timeReduction}%.
- **B (Result-first):** Improved baseline model accuracy by {accuracyIncrease}% and reduced retraining setup time by {timeReduction}% by assisting {modelCount} supervised learning runs using {sampleCount} labeled samples.
- **C (Impact-led):** Stronger baseline model performance — increased accuracy by {accuracyIncrease}% and reduced retraining setup time by {timeReduction}% while assisting {modelCount} training experiments.
- **D (Concise):** Assisted {modelCount} training experiments using {sampleCount} labeled samples — {accuracyIncrease}% higher baseline accuracy and {timeReduction}% lower setup time.

**Variables:**
  - `{modelCount}`: 3 to 12, step 1 (integer)
  - `{sampleCount}`: 50000 to 500000, step 50000 (integer)
  - `{accuracyIncrease}`: 10 to 25, step 5 (percentage)
  - `{timeReduction}`: 10 to 25, step 5 (percentage)

### DATA-0357
**Role:** ml-engineer | **Theme:** feature-engineering | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature engineering, Python, machine learning, data pipelines, model performance

**Scope:** feature sets across {featureCount} engineered variables derived from datasets totaling {rowCount} records
**Result:** improving model precision by {precisionIncrease}% and reducing feature generation time by {timeReduction}%

**Variations:**
- **A (Standard):** Developed feature sets across {featureCount} engineered variables derived from datasets totaling {rowCount} records, improving model precision by {precisionIncrease}% and reducing feature generation time by {timeReduction}%.
- **B (Result-first):** Improved model precision by {precisionIncrease}% and reduced feature generation time by {timeReduction}% by developing {featureCount} engineered variables from datasets totaling {rowCount} records.
- **C (Impact-led):** Higher-quality ML features — increased model precision by {precisionIncrease}% and reduced feature generation time by {timeReduction}% through development of {featureCount} engineered variables.
- **D (Concise):** Developed {featureCount} engineered variables from {rowCount} records — {precisionIncrease}% higher precision and {timeReduction}% lower feature generation time.

**Variables:**
  - `{featureCount}`: 20 to 100, step 10 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0358
**Role:** ml-engineer | **Theme:** model-deployment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model deployment, APIs, Docker, MLOps, inference

**Scope:** model deployment workflows across {deploymentCount} production services handling {predictionCount} predictions per day
**Result:** reducing deployment lead time by {timeReduction}% and improving inference availability by {availabilityIncrease}%

**Variations:**
- **A (Standard):** Managed model deployment workflows across {deploymentCount} production services handling {predictionCount} predictions per day, reducing deployment lead time by {timeReduction}% and improving inference availability by {availabilityIncrease}%.
- **B (Result-first):** Reduced deployment lead time by {timeReduction}% and improved inference availability by {availabilityIncrease}% by managing workflows across {deploymentCount} production services handling {predictionCount} predictions daily.
- **C (Impact-led):** Faster, more reliable model releases — cut deployment lead time by {timeReduction}% and improved inference availability by {availabilityIncrease}% through management of {deploymentCount} production services.
- **D (Concise):** Managed deployment workflows across {deploymentCount} services handling {predictionCount} predictions daily — {timeReduction}% lower lead time and {availabilityIncrease}% higher availability.

**Variables:**
  - `{deploymentCount}`: 3 to 12, step 1 (integer)
  - `{predictionCount}`: 10000 to 200000, step 10000 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{availabilityIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0359
**Role:** ml-engineer | **Theme:** model-monitoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model monitoring, drift detection, ML observability, alerts, performance tracking

**Scope:** model monitoring alerts across {modelCount} production models serving {predictionCount} daily predictions
**Result:** improving incident detection speed by {speedIncrease}% and reducing unnoticed drift events by {driftReduction}%

**Variations:**
- **A (Standard):** Built model monitoring alerts across {modelCount} production models serving {predictionCount} daily predictions, improving incident detection speed by {speedIncrease}% and reducing unnoticed drift events by {driftReduction}%.
- **B (Result-first):** Improved incident detection speed by {speedIncrease}% and reduced unnoticed drift events by {driftReduction}% by building alerts across {modelCount} production models serving {predictionCount} daily predictions.
- **C (Impact-led):** Better ML observability — increased detection speed by {speedIncrease}% and reduced unnoticed drift by {driftReduction}% through building alerts for {modelCount} production models.
- **D (Concise):** Built alerts for {modelCount} production models serving {predictionCount} daily predictions — {speedIncrease}% faster detection and {driftReduction}% fewer unnoticed drift events.

**Variables:**
  - `{modelCount}`: 3 to 15, step 1 (integer)
  - `{predictionCount}`: 10000 to 200000, step 10000 (integer)
  - `{speedIncrease}`: 15 to 35, step 5 (percentage)
  - `{driftReduction}`: 10 to 30, step 5 (percentage)

### DATA-0360
**Role:** ml-engineer | **Theme:** ml-pipelines | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML pipelines, MLOps, Airflow, CI/CD, automation

**Scope:** automated ML pipelines across {pipelineCount} workflows supporting {modelCount} production models
**Result:** reducing retraining cycle time by {timeReduction}% and improving release reliability by {reliabilityIncrease}%

**Variations:**
- **A (Standard):** Led automated ML pipelines across {pipelineCount} workflows supporting {modelCount} production models, reducing retraining cycle time by {timeReduction}% and improving release reliability by {reliabilityIncrease}%.
- **B (Result-first):** Reduced retraining cycle time by {timeReduction}% and improved release reliability by {reliabilityIncrease}% by leading {pipelineCount} automated workflows supporting {modelCount} production models.
- **C (Impact-led):** Faster and more reliable ML delivery — cut retraining cycle time by {timeReduction}% and improved release reliability by {reliabilityIncrease}% through leadership of {pipelineCount} automated workflows.
- **D (Concise):** Led {pipelineCount} automated ML workflows supporting {modelCount} production models — {timeReduction}% lower retraining time and {reliabilityIncrease}% higher release reliability.

**Variables:**
  - `{pipelineCount}`: 3 to 12, step 1 (integer)
  - `{modelCount}`: 3 to 15, step 1 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{reliabilityIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0361
**Role:** ml-engineer | **Theme:** experimentation | **Seniority:** senior | **Verb Context:** projects
**Keywords:** ML experimentation, hyperparameter tuning, A/B testing, model evaluation, optimization

**Scope:** ML experimentation across {experimentCount} model runs using {sampleCount} training samples
**Result:** improving top-model accuracy by {accuracyIncrease}% and reducing experiment selection time by {timeReduction}%

**Variations:**
- **A (Standard):** Directed ML experimentation across {experimentCount} model runs using {sampleCount} training samples, improving top-model accuracy by {accuracyIncrease}% and reducing experiment selection time by {timeReduction}%.
- **B (Result-first):** Improved top-model accuracy by {accuracyIncrease}% and reduced experiment selection time by {timeReduction}% by directing {experimentCount} model runs using {sampleCount} training samples.
- **C (Impact-led):** Stronger model selection outcomes — increased top-model accuracy by {accuracyIncrease}% and reduced selection time by {timeReduction}% through direction of {experimentCount} ML runs.
- **D (Concise):** Directed {experimentCount} ML runs using {sampleCount} training samples — {accuracyIncrease}% higher top-model accuracy and {timeReduction}% lower selection time.

**Variables:**
  - `{experimentCount}`: 10 to 40, step 5 (integer)
  - `{sampleCount}`: 50000 to 500000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0362
**Role:** analytics-manager | **Theme:** analytics-strategy | **Seniority:** senior | **Verb Context:** people
**Keywords:** analytics strategy, roadmap, KPIs, business intelligence, decision-making

**Scope:** analytics strategy across {teamCount} analysts supporting {stakeholderCount} business leaders and {initiativeCount} strategic initiatives
**Result:** improving decision quality by {qualityIncrease}% and increasing analytics adoption by {adoptionIncrease}%

**Variations:**
- **A (Standard):** Led analytics strategy across {teamCount} analysts supporting {stakeholderCount} business leaders and {initiativeCount} strategic initiatives, improving decision quality by {qualityIncrease}% and increasing analytics adoption by {adoptionIncrease}%.
- **B (Result-first):** Improved decision quality by {qualityIncrease}% and increased analytics adoption by {adoptionIncrease}% by leading strategy across {teamCount} analysts supporting {stakeholderCount} leaders and {initiativeCount} initiatives.
- **C (Impact-led):** Broader analytics impact — increased decision quality by {qualityIncrease}% and adoption by {adoptionIncrease}% through leadership of strategy across {teamCount} analysts.
- **D (Concise):** Led analytics strategy across {teamCount} analysts for {stakeholderCount} leaders and {initiativeCount} initiatives — {qualityIncrease}% better decision quality and {adoptionIncrease}% higher adoption.

**Variables:**
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{stakeholderCount}`: 10 to 50, step 5 (integer)
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{adoptionIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0363
**Role:** analytics-manager | **Theme:** team-leadership | **Seniority:** senior | **Verb Context:** people
**Keywords:** team leadership, mentoring, analytics team, performance management, coaching

**Scope:** analytics team development for {teamCount} analysts across {projectCount} concurrent reporting and insight projects
**Result:** improving team productivity by {productivityIncrease}% and increasing on-time project delivery by {deliveryIncrease}%

**Variations:**
- **A (Standard):** Directed analytics team development for {teamCount} analysts across {projectCount} concurrent reporting and insight projects, improving team productivity by {productivityIncrease}% and increasing on-time project delivery by {deliveryIncrease}%.
- **B (Result-first):** Improved team productivity by {productivityIncrease}% and increased on-time project delivery by {deliveryIncrease}% by directing development for {teamCount} analysts across {projectCount} projects.
- **C (Impact-led):** Stronger analytics team execution — increased productivity by {productivityIncrease}% and on-time delivery by {deliveryIncrease}% through direction of development for {teamCount} analysts.
- **D (Concise):** Directed development for {teamCount} analysts across {projectCount} projects — {productivityIncrease}% higher productivity and {deliveryIncrease}% better on-time delivery.

**Variables:**
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{projectCount}`: 5 to 20, step 1 (integer)
  - `{productivityIncrease}`: 15 to 35, step 5 (percentage)
  - `{deliveryIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0364
**Role:** analytics-manager | **Theme:** data-roadmap | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data roadmap, prioritization, analytics planning, stakeholder management, governance

**Scope:** analytics roadmap prioritization across {initiativeCount} data initiatives serving {stakeholderCount} cross-functional stakeholders
**Result:** improving roadmap alignment by {alignmentIncrease}% and reducing low-impact project spend by {spendReduction}%

**Variations:**
- **A (Standard):** Managed analytics roadmap prioritization across {initiativeCount} data initiatives serving {stakeholderCount} cross-functional stakeholders, improving roadmap alignment by {alignmentIncrease}% and reducing low-impact project spend by {spendReduction}%.
- **B (Result-first):** Improved roadmap alignment by {alignmentIncrease}% and reduced low-impact project spend by {spendReduction}% by managing prioritization across {initiativeCount} data initiatives serving {stakeholderCount} stakeholders.
- **C (Impact-led):** Stronger portfolio prioritization — increased roadmap alignment by {alignmentIncrease}% and reduced low-impact spend by {spendReduction}% through management of {initiativeCount} data initiatives.
- **D (Concise):** Managed prioritization across {initiativeCount} data initiatives for {stakeholderCount} stakeholders — {alignmentIncrease}% better alignment and {spendReduction}% lower low-impact spend.

**Variables:**
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{stakeholderCount}`: 10 to 50, step 5 (integer)
  - `{alignmentIncrease}`: 15 to 35, step 5 (percentage)
  - `{spendReduction}`: 10 to 30, step 5 (percentage)

### DATA-0365
**Role:** analytics-manager | **Theme:** cross-functional-insights | **Seniority:** mid | **Verb Context:** projects
**Keywords:** cross-functional insights, business strategy, SQL, Tableau, stakeholder partnership

**Scope:** cross-functional insight programs across {departmentCount} departments using {datasetCount} shared data sources
**Result:** improving business response speed by {speedIncrease}% and increasing insight utilization by {utilizationIncrease}%

**Variations:**
- **A (Standard):** Developed cross-functional insight programs across {departmentCount} departments using {datasetCount} shared data sources, improving business response speed by {speedIncrease}% and increasing insight utilization by {utilizationIncrease}%.
- **B (Result-first):** Improved business response speed by {speedIncrease}% and increased insight utilization by {utilizationIncrease}% by developing programs across {departmentCount} departments using {datasetCount} shared data sources.
- **C (Impact-led):** More actionable cross-functional analytics — increased response speed by {speedIncrease}% and insight utilization by {utilizationIncrease}% through development of programs across {departmentCount} departments.
- **D (Concise):** Developed insight programs across {departmentCount} departments using {datasetCount} shared sources — {speedIncrease}% faster response and {utilizationIncrease}% higher utilization.

**Variables:**
  - `{departmentCount}`: 3 to 10, step 1 (integer)
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{speedIncrease}`: 15 to 35, step 5 (percentage)
  - `{utilizationIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0366
**Role:** analytics-manager | **Theme:** decision-support | **Seniority:** mid | **Verb Context:** projects
**Keywords:** decision support, executive insights, forecasting, analytics, business planning

**Scope:** decision-support analysis across {initiativeCount} strategic reviews covering {metricCount} planning metrics
**Result:** improving planning confidence by {confidenceGain}% and reducing decision cycle time by {timeReduction}%

**Variations:**
- **A (Standard):** Managed decision-support analysis across {initiativeCount} strategic reviews covering {metricCount} planning metrics, improving planning confidence by {confidenceGain}% and reducing decision cycle time by {timeReduction}%.
- **B (Result-first):** Improved planning confidence by {confidenceGain}% and reduced decision cycle time by {timeReduction}% by managing analysis across {initiativeCount} strategic reviews covering {metricCount} metrics.
- **C (Impact-led):** Faster, more confident planning — increased confidence by {confidenceGain}% and reduced decision cycle time by {timeReduction}% through management of support analysis across {initiativeCount} reviews.
- **D (Concise):** Managed decision-support analysis across {initiativeCount} reviews covering {metricCount} metrics — {confidenceGain}% higher confidence and {timeReduction}% shorter decision cycles.

**Variables:**
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{confidenceGain}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0367
**Role:** analytics-manager | **Theme:** analytics-operations | **Seniority:** mid | **Verb Context:** operations
**Keywords:** analytics operations, workflow management, SLA, reporting, process improvement

**Scope:** analytics request workflows across {requestCount} recurring requests handled by {teamCount} analysts each quarter
**Result:** improving SLA attainment by {slaIncrease}% and reducing request backlog by {backlogReduction}%

**Variations:**
- **A (Standard):** Optimized analytics request workflows across {requestCount} recurring requests handled by {teamCount} analysts each quarter, improving SLA attainment by {slaIncrease}% and reducing request backlog by {backlogReduction}%.
- **B (Result-first):** Improved SLA attainment by {slaIncrease}% and reduced request backlog by {backlogReduction}% by optimizing workflows across {requestCount} recurring requests handled by {teamCount} analysts each quarter.
- **C (Impact-led):** More efficient analytics operations — increased SLA attainment by {slaIncrease}% and reduced backlog by {backlogReduction}% through optimization of workflows across {requestCount} recurring requests.
- **D (Concise):** Optimized request workflows across {requestCount} recurring requests handled by {teamCount} analysts — {slaIncrease}% better SLA attainment and {backlogReduction}% lower backlog.

**Variables:**
  - `{requestCount}`: 20 to 100, step 10 (integer)
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{slaIncrease}`: 15 to 35, step 5 (percentage)
  - `{backlogReduction}`: 10 to 30, step 5 (percentage)

### DATA-0368
**Role:** data-analyst | **Theme:** dashboarding | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Power BI, Tableau, dashboarding, data visualization, KPIs

**Scope:** operational dashboards across {dashboardCount} views monitoring {metricCount} KPIs for {stakeholderCount} users
**Result:** improving metric accessibility by {accessIncrease}% and reducing manual status checks by {checkReduction}%

**Variations:**
- **A (Standard):** Built operational dashboards across {dashboardCount} views monitoring {metricCount} KPIs for {stakeholderCount} users, improving metric accessibility by {accessIncrease}% and reducing manual status checks by {checkReduction}%.
- **B (Result-first):** Improved metric accessibility by {accessIncrease}% and reduced manual status checks by {checkReduction}% by building {dashboardCount} operational dashboards monitoring {metricCount} KPIs for {stakeholderCount} users.
- **C (Impact-led):** More accessible operational intelligence — increased metric accessibility by {accessIncrease}% and reduced manual checks by {checkReduction}% through building of {dashboardCount} dashboards.
- **D (Concise):** Built {dashboardCount} dashboards monitoring {metricCount} KPIs for {stakeholderCount} users — {accessIncrease}% better accessibility and {checkReduction}% fewer manual checks.

**Variables:**
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{accessIncrease}`: 15 to 35, step 5 (percentage)
  - `{checkReduction}`: 10 to 30, step 5 (percentage)

### DATA-0369
**Role:** data-analyst | **Theme:** reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** reporting, Excel, PowerPoint, business metrics, stakeholder support

**Scope:** monthly reporting deliverables across {reportCount} business summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders
**Result:** improving report accuracy by {accuracyIncrease}% and reducing preparation time by {timeReduction}%

**Variations:**
- **A (Standard):** Managed monthly reporting deliverables across {reportCount} business summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders, improving report accuracy by {accuracyIncrease}% and reducing preparation time by {timeReduction}%.
- **B (Result-first):** Improved report accuracy by {accuracyIncrease}% and reduced preparation time by {timeReduction}% by managing {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders.
- **C (Impact-led):** Sharper recurring reporting — increased accuracy by {accuracyIncrease}% and reduced prep time by {timeReduction}% through management of {reportCount} business summaries.
- **D (Concise):** Managed {reportCount} monthly summaries covering {metricCount} KPIs — {accuracyIncrease}% higher accuracy and {timeReduction}% lower prep time.

**Variables:**
  - `{reportCount}`: 4 to 16, step 2 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0370
**Role:** data-analyst | **Theme:** sql-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** SQL, data analysis, joins, query performance, business insights

**Scope:** SQL analysis workflows across {queryCount} recurring business queries scanning {rowCount} rows
**Result:** reducing average query runtime by {runtimeReduction}% and increasing insight delivery speed by {speedIncrease}%

**Variations:**
- **A (Standard):** Improved SQL analysis workflows across {queryCount} recurring business queries scanning {rowCount} rows, reducing average query runtime by {runtimeReduction}% and increasing insight delivery speed by {speedIncrease}%.
- **B (Result-first):** Reduced average query runtime by {runtimeReduction}% and increased insight delivery speed by {speedIncrease}% by improving SQL workflows across {queryCount} recurring queries scanning {rowCount} rows.
- **C (Impact-led):** Faster business query delivery — reduced runtime by {runtimeReduction}% and increased insight delivery speed by {speedIncrease}% through improvement of {queryCount} recurring SQL workflows.
- **D (Concise):** Improved {queryCount} recurring SQL workflows scanning {rowCount} rows — {runtimeReduction}% lower runtime and {speedIncrease}% faster insight delivery.

**Variables:**
  - `{queryCount}`: 10 to 50, step 5 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{runtimeReduction}`: 15 to 35, step 5 (percentage)
  - `{speedIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0371
**Role:** data-analyst | **Theme:** data-validation | **Seniority:** junior | **Verb Context:** systems
**Keywords:** data validation, quality checks, SQL, Excel, data integrity

**Scope:** pre-release data validation across {datasetCount} report sources containing {rowCount} rows
**Result:** reducing reporting errors by {errorReduction}% and improving release confidence by {confidenceGain}%

**Variations:**
- **A (Standard):** Assisted pre-release data validation across {datasetCount} report sources containing {rowCount} rows, reducing reporting errors by {errorReduction}% and improving release confidence by {confidenceGain}%.
- **B (Result-first):** Reduced reporting errors by {errorReduction}% and improved release confidence by {confidenceGain}% by assisting validation across {datasetCount} report sources containing {rowCount} rows.
- **C (Impact-led):** Safer reporting releases — reduced errors by {errorReduction}% and increased release confidence by {confidenceGain}% while assisting validation across {datasetCount} sources with {rowCount} rows.
- **D (Concise):** Assisted validation across {datasetCount} report sources with {rowCount} rows — {errorReduction}% fewer errors and {confidenceGain}% higher release confidence.

**Variables:**
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 300000 to 3000000, step 300000 (integer)
  - `{errorReduction}`: 10 to 25, step 5 (percentage)
  - `{confidenceGain}`: 10 to 25, step 5 (percentage)

### DATA-0372
**Role:** bi-analyst | **Theme:** dashboard-development | **Seniority:** mid | **Verb Context:** systems
**Keywords:** dashboard development, Tableau, Power BI, BI, visualization

**Scope:** department dashboards across {dashboardCount} reporting views tracking {metricCount} KPIs for {departmentCount} business teams
**Result:** improving self-service access by {accessIncrease}% and reducing manual report requests by {requestReduction}%

**Variations:**
- **A (Standard):** Developed department dashboards across {dashboardCount} reporting views tracking {metricCount} KPIs for {departmentCount} business teams, improving self-service access by {accessIncrease}% and reducing manual report requests by {requestReduction}%.
- **B (Result-first):** Improved self-service access by {accessIncrease}% and reduced manual report requests by {requestReduction}% by developing {dashboardCount} dashboards tracking {metricCount} KPIs for {departmentCount} business teams.
- **C (Impact-led):** More scalable BI access — increased self-service access by {accessIncrease}% and reduced manual report requests by {requestReduction}% through development of {dashboardCount} department dashboards.
- **D (Concise):** Developed {dashboardCount} dashboards tracking {metricCount} KPIs for {departmentCount} teams — {accessIncrease}% better self-service access and {requestReduction}% fewer manual requests.

**Variables:**
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{departmentCount}`: 3 to 10, step 1 (integer)
  - `{accessIncrease}`: 15 to 35, step 5 (percentage)
  - `{requestReduction}`: 10 to 30, step 5 (percentage)

### DATA-0373
**Role:** bi-analyst | **Theme:** data-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** semantic model, Power BI, SQL, data modeling, performance

**Scope:** semantic BI models across {tableCount} warehouse tables supporting {dashboardCount} governed dashboards
**Result:** improving dashboard refresh performance by {performanceIncrease}% and reducing metric-definition conflicts by {conflictReduction}%

**Variations:**
- **A (Standard):** Designed semantic BI models across {tableCount} warehouse tables supporting {dashboardCount} governed dashboards, improving dashboard refresh performance by {performanceIncrease}% and reducing metric-definition conflicts by {conflictReduction}%.
- **B (Result-first):** Improved dashboard refresh performance by {performanceIncrease}% and reduced metric-definition conflicts by {conflictReduction}% by designing semantic models across {tableCount} warehouse tables supporting {dashboardCount} dashboards.
- **C (Impact-led):** Stronger BI semantic layer — increased refresh performance by {performanceIncrease}% and reduced definition conflicts by {conflictReduction}% through design of models across {tableCount} warehouse tables.
- **D (Concise):** Designed semantic models across {tableCount} warehouse tables for {dashboardCount} dashboards — {performanceIncrease}% better refresh performance and {conflictReduction}% fewer definition conflicts.

**Variables:**
  - `{tableCount}`: 10 to 60, step 5 (integer)
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{performanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{conflictReduction}`: 10 to 30, step 5 (percentage)

### DATA-0374
**Role:** data-engineer | **Theme:** etl-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ETL, Airflow, Python, batch pipelines, data ingestion

**Scope:** ETL orchestration across {pipelineCount} data workflows processing {rowCount} records per day
**Result:** reducing workflow runtime by {runtimeReduction}% and improving job completion rate by {completionIncrease}%

**Variations:**
- **A (Standard):** Optimized ETL orchestration across {pipelineCount} data workflows processing {rowCount} records per day, reducing workflow runtime by {runtimeReduction}% and improving job completion rate by {completionIncrease}%.
- **B (Result-first):** Reduced workflow runtime by {runtimeReduction}% and improved job completion rate by {completionIncrease}% by optimizing ETL orchestration across {pipelineCount} workflows processing {rowCount} records daily.
- **C (Impact-led):** Faster batch pipeline execution — cut runtime by {runtimeReduction}% and improved completion rate by {completionIncrease}% through optimization of {pipelineCount} ETL workflows.
- **D (Concise):** Optimized ETL orchestration across {pipelineCount} workflows processing {rowCount} records daily — {runtimeReduction}% lower runtime and {completionIncrease}% higher completion.

**Variables:**
  - `{pipelineCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{runtimeReduction}`: 15 to 35, step 5 (percentage)
  - `{completionIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0375
**Role:** ml-engineer | **Theme:** model-monitoring | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model monitoring, drift, alerts, ML observability, production ML

**Scope:** model health monitoring across {modelCount} production models serving {predictionCount} daily predictions
**Result:** reducing model incident response time by {timeReduction}% and improving drift detection coverage by {coverageIncrease}%

**Variations:**
- **A (Standard):** Directed model health monitoring across {modelCount} production models serving {predictionCount} daily predictions, reducing model incident response time by {timeReduction}% and improving drift detection coverage by {coverageIncrease}%.
- **B (Result-first):** Reduced model incident response time by {timeReduction}% and improved drift detection coverage by {coverageIncrease}% by directing monitoring across {modelCount} production models serving {predictionCount} daily predictions.
- **C (Impact-led):** Stronger production ML oversight — cut incident response time by {timeReduction}% and improved drift detection coverage by {coverageIncrease}% through direction of monitoring for {modelCount} models.
- **D (Concise):** Directed monitoring for {modelCount} production models serving {predictionCount} daily predictions — {timeReduction}% faster response and {coverageIncrease}% broader drift coverage.

**Variables:**
  - `{modelCount}`: 3 to 15, step 1 (integer)
  - `{predictionCount}`: 10000 to 200000, step 10000 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{coverageIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0376
**Role:** analytics-manager | **Theme:** decision-support | **Seniority:** senior | **Verb Context:** people
**Keywords:** decision support, executive analytics, forecasting, strategy, insights

**Scope:** decision-support programs across {initiativeCount} executive priorities serving {stakeholderCount} senior leaders
**Result:** improving strategic decision speed by {speedIncrease}% and increasing confidence in planning assumptions by {confidenceGain}%

**Variations:**
- **A (Standard):** Led decision-support programs across {initiativeCount} executive priorities serving {stakeholderCount} senior leaders, improving strategic decision speed by {speedIncrease}% and increasing confidence in planning assumptions by {confidenceGain}%.
- **B (Result-first):** Improved strategic decision speed by {speedIncrease}% and increased confidence in planning assumptions by {confidenceGain}% by leading programs across {initiativeCount} executive priorities serving {stakeholderCount} senior leaders.
- **C (Impact-led):** Faster executive decision-making — increased decision speed by {speedIncrease}% and improved planning confidence by {confidenceGain}% through leadership of programs across {initiativeCount} priorities.
- **D (Concise):** Led decision-support programs across {initiativeCount} executive priorities for {stakeholderCount} senior leaders — {speedIncrease}% faster decisions and {confidenceGain}% higher planning confidence.

**Variables:**
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{stakeholderCount}`: 10 to 50, step 5 (integer)
  - `{speedIncrease}`: 15 to 35, step 5 (percentage)
  - `{confidenceGain}`: 10 to 30, step 5 (percentage)

### DATA-0377
**Role:** analytics-manager | **Theme:** analytics-operations | **Seniority:** senior | **Verb Context:** operations
**Keywords:** analytics operations, process improvement, workflow management, SLA, team efficiency

**Scope:** analytics operating processes across {requestCount} quarterly requests handled by {teamCount} analysts
**Result:** improving workflow efficiency by {efficiencyIncrease}% and reducing delivery bottlenecks by {bottleneckReduction}%

**Variations:**
- **A (Standard):** Directed analytics operating processes across {requestCount} quarterly requests handled by {teamCount} analysts, improving workflow efficiency by {efficiencyIncrease}% and reducing delivery bottlenecks by {bottleneckReduction}%.
- **B (Result-first):** Improved workflow efficiency by {efficiencyIncrease}% and reduced delivery bottlenecks by {bottleneckReduction}% by directing processes across {requestCount} quarterly requests handled by {teamCount} analysts.
- **C (Impact-led):** Stronger analytics operations — increased workflow efficiency by {efficiencyIncrease}% and reduced delivery bottlenecks by {bottleneckReduction}% through direction of processes across {requestCount} quarterly requests.
- **D (Concise):** Directed processes across {requestCount} quarterly requests handled by {teamCount} analysts — {efficiencyIncrease}% better efficiency and {bottleneckReduction}% fewer bottlenecks.

**Variables:**
  - `{requestCount}`: 20 to 100, step 10 (integer)
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{efficiencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{bottleneckReduction}`: 10 to 30, step 5 (percentage)

### DATA-0378
**Role:** data-analyst | **Theme:** data-cleaning | **Seniority:** junior | **Verb Context:** systems
**Keywords:** SQL, Python, data cleaning, data quality, deduplication

**Scope:** data standardization across {datasetCount} source datasets totaling {rowCount} rows using SQL and Python cleansing routines
**Result:** improving field consistency by {consistencyIncrease}% and reducing duplicate entries by {duplicateReduction}%

**Variations:**
- **A (Standard):** Assisted data standardization across {datasetCount} source datasets totaling {rowCount} rows using SQL and Python cleansing routines, improving field consistency by {consistencyIncrease}% and reducing duplicate entries by {duplicateReduction}%.
- **B (Result-first):** Achieved {consistencyIncrease}% higher field consistency and {duplicateReduction}% fewer duplicate entries by assisting standardization across {datasetCount} source datasets totaling {rowCount} rows.
- **C (Impact-led):** Delivered cleaner source data — improved field consistency by {consistencyIncrease}% and reduced duplicates by {duplicateReduction}% while supporting standardization of {datasetCount} datasets totaling {rowCount} rows.
- **D (Concise):** Assisted standardization of {datasetCount} datasets totaling {rowCount} rows — {consistencyIncrease}% higher consistency, {duplicateReduction}% fewer duplicates.

**Variables:**
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{consistencyIncrease}`: 10 to 25, step 5 (percentage)
  - `{duplicateReduction}`: 10 to 30, step 5 (percentage)

### DATA-0379
**Role:** data-analyst | **Theme:** exploratory-analysis | **Seniority:** junior | **Verb Context:** projects
**Keywords:** EDA, Python, pandas, data profiling, trend analysis

**Scope:** exploratory data reviews across {datasetCount} business datasets totaling {rowCount} rows using Python notebooks
**Result:** identifying {insightCount} high-value trends and improving analysis turnaround by {speedIncrease}%

**Variations:**
- **A (Standard):** Supported exploratory data reviews across {datasetCount} business datasets totaling {rowCount} rows using Python notebooks, identifying {insightCount} high-value trends and improving analysis turnaround by {speedIncrease}%.
- **B (Result-first):** Achieved {insightCount} high-value trends and {speedIncrease}% faster analysis turnaround by supporting exploratory reviews across {datasetCount} datasets totaling {rowCount} rows.
- **C (Impact-led):** Delivered faster data discovery — identified {insightCount} high-value trends and improved turnaround by {speedIncrease}% while supporting reviews of {datasetCount} datasets totaling {rowCount} rows.
- **D (Concise):** Supported exploratory reviews of {datasetCount} datasets totaling {rowCount} rows — {insightCount} trends identified and {speedIncrease}% faster turnaround.

**Variables:**
  - `{datasetCount}`: 3 to 10, step 1 (integer)
  - `{rowCount}`: 200000 to 2000000, step 200000 (integer)
  - `{insightCount}`: 5 to 20, step 1 (integer)
  - `{speedIncrease}`: 10 to 25, step 5 (percentage)

### DATA-0380
**Role:** data-analyst | **Theme:** dashboarding | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Tableau, Power BI, dashboards, KPI tracking, data visualization

**Scope:** interactive KPI dashboards across {dashboardCount} views tracking {metricCount} metrics for {stakeholderCount} stakeholders
**Result:** improving reporting accessibility by {accessIncrease}% and reducing manual analysis time by {timeReduction}%

**Variations:**
- **A (Standard):** Developed interactive KPI dashboards across {dashboardCount} views tracking {metricCount} metrics for {stakeholderCount} stakeholders, improving reporting accessibility by {accessIncrease}% and reducing manual analysis time by {timeReduction}%.
- **B (Result-first):** Achieved {accessIncrease}% better reporting accessibility and {timeReduction}% lower manual analysis time by developing {dashboardCount} KPI dashboards tracking {metricCount} metrics for {stakeholderCount} stakeholders.
- **C (Impact-led):** Delivered more accessible business insights — improved reporting accessibility by {accessIncrease}% and cut manual analysis time by {timeReduction}% through development of {dashboardCount} KPI dashboards.
- **D (Concise):** Developed {dashboardCount} KPI dashboards tracking {metricCount} metrics — {accessIncrease}% better accessibility, {timeReduction}% less manual analysis time.

**Variables:**
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{accessIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0381
**Role:** bi-analyst | **Theme:** stakeholder-reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** stakeholder reporting, BI, PowerPoint, metrics, executive communication

**Scope:** quarterly stakeholder reporting across {reportCount} business reviews covering {metricCount} KPI summaries
**Result:** improving executive alignment by {alignmentIncrease}% and reducing preparation effort by {effortReduction}%

**Variations:**
- **A (Standard):** Managed quarterly stakeholder reporting across {reportCount} business reviews covering {metricCount} KPI summaries, improving executive alignment by {alignmentIncrease}% and reducing preparation effort by {effortReduction}%.
- **B (Result-first):** Achieved {alignmentIncrease}% better executive alignment and {effortReduction}% lower preparation effort by managing {reportCount} business reviews covering {metricCount} KPI summaries.
- **C (Impact-led):** Delivered more effective executive reporting — improved alignment by {alignmentIncrease}% and reduced prep effort by {effortReduction}% through management of {reportCount} business reviews.
- **D (Concise):** Managed {reportCount} business reviews covering {metricCount} KPI summaries — {alignmentIncrease}% better alignment, {effortReduction}% lower prep effort.

**Variables:**
  - `{reportCount}`: 4 to 16, step 2 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{alignmentIncrease}`: 15 to 35, step 5 (percentage)
  - `{effortReduction}`: 10 to 30, step 5 (percentage)

### DATA-0382
**Role:** bi-analyst | **Theme:** self-serve-analytics | **Seniority:** senior | **Verb Context:** people
**Keywords:** self-serve analytics, Power BI, governance, data literacy, dashboard adoption

**Scope:** self-serve analytics rollout for {stakeholderCount} business users across {dashboardCount} governed dashboards
**Result:** increasing dashboard adoption by {adoptionIncrease}% and reducing ad hoc reporting requests by {requestReduction}%

**Variations:**
- **A (Standard):** Led self-serve analytics rollout for {stakeholderCount} business users across {dashboardCount} governed dashboards, increasing dashboard adoption by {adoptionIncrease}% and reducing ad hoc reporting requests by {requestReduction}%.
- **B (Result-first):** Achieved {adoptionIncrease}% higher dashboard adoption and {requestReduction}% fewer ad hoc reporting requests by leading self-serve rollout for {stakeholderCount} users across {dashboardCount} dashboards.
- **C (Impact-led):** Delivered broader self-serve BI usage — increased dashboard adoption by {adoptionIncrease}% and reduced ad hoc requests by {requestReduction}% through leadership of rollout for {stakeholderCount} users.
- **D (Concise):** Led self-serve rollout for {stakeholderCount} users across {dashboardCount} dashboards — {adoptionIncrease}% higher adoption, {requestReduction}% fewer ad hoc requests.

**Variables:**
  - `{stakeholderCount}`: 20 to 100, step 10 (integer)
  - `{dashboardCount}`: 5 to 20, step 1 (integer)
  - `{adoptionIncrease}`: 15 to 35, step 5 (percentage)
  - `{requestReduction}`: 10 to 30, step 5 (percentage)

### DATA-0383
**Role:** data-engineer | **Theme:** data-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data modeling, schema design, warehouse, SQL, analytics engineering

**Scope:** analytics-ready schemas across {modelCount} subject areas integrating {tableCount} warehouse tables
**Result:** improving downstream query simplicity by {simplicityIncrease}% and reducing transformation dependencies by {dependencyReduction}%

**Variations:**
- **A (Standard):** Developed analytics-ready schemas across {modelCount} subject areas integrating {tableCount} warehouse tables, improving downstream query simplicity by {simplicityIncrease}% and reducing transformation dependencies by {dependencyReduction}%.
- **B (Result-first):** Achieved {simplicityIncrease}% simpler downstream queries and {dependencyReduction}% fewer transformation dependencies by developing {modelCount} analytics-ready schemas integrating {tableCount} warehouse tables.
- **C (Impact-led):** Delivered cleaner warehouse structures — improved query simplicity by {simplicityIncrease}% and reduced dependencies by {dependencyReduction}% through development of {modelCount} schemas.
- **D (Concise):** Developed {modelCount} analytics-ready schemas integrating {tableCount} tables — {simplicityIncrease}% simpler queries, {dependencyReduction}% fewer dependencies.

**Variables:**
  - `{modelCount}`: 3 to 12, step 1 (integer)
  - `{tableCount}`: 10 to 60, step 5 (integer)
  - `{simplicityIncrease}`: 15 to 35, step 5 (percentage)
  - `{dependencyReduction}`: 10 to 30, step 5 (percentage)

### DATA-0384
**Role:** data-engineer | **Theme:** data-governance | **Seniority:** senior | **Verb Context:** systems
**Keywords:** data governance, metadata, catalog, lineage, compliance

**Scope:** metadata governance across {tableCount} governed assets supporting {stakeholderCount} analytics users
**Result:** improving metadata completeness by {completenessIncrease}% and reducing lineage investigation time by {timeReduction}%

**Variations:**
- **A (Standard):** Directed metadata governance across {tableCount} governed assets supporting {stakeholderCount} analytics users, improving metadata completeness by {completenessIncrease}% and reducing lineage investigation time by {timeReduction}%.
- **B (Result-first):** Achieved {completenessIncrease}% better metadata completeness and {timeReduction}% lower lineage investigation time by directing governance across {tableCount} governed assets supporting {stakeholderCount} analytics users.
- **C (Impact-led):** Delivered stronger metadata discipline — improved completeness by {completenessIncrease}% and reduced lineage investigation time by {timeReduction}% through direction of governance across {tableCount} assets.
- **D (Concise):** Directed metadata governance across {tableCount} assets for {stakeholderCount} users — {completenessIncrease}% better completeness, {timeReduction}% lower lineage investigation time.

**Variables:**
  - `{tableCount}`: 20 to 100, step 10 (integer)
  - `{stakeholderCount}`: 20 to 100, step 10 (integer)
  - `{completenessIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0385
**Role:** ml-engineer | **Theme:** feature-engineering | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature engineering, Python, ML features, data pipelines, model quality

**Scope:** predictive features across {featureCount} engineered variables derived from {rowCount} historical records
**Result:** improving model recall by {recallIncrease}% and reducing feature processing time by {timeReduction}%

**Variations:**
- **A (Standard):** Engineered predictive features across {featureCount} engineered variables derived from {rowCount} historical records, improving model recall by {recallIncrease}% and reducing feature processing time by {timeReduction}%.
- **B (Result-first):** Achieved {recallIncrease}% higher model recall and {timeReduction}% lower feature processing time by engineering {featureCount} predictive variables from {rowCount} historical records.
- **C (Impact-led):** Delivered more effective predictive features — improved recall by {recallIncrease}% and reduced processing time by {timeReduction}% through engineering of {featureCount} variables.
- **D (Concise):** Engineered {featureCount} predictive variables from {rowCount} historical records — {recallIncrease}% higher recall, {timeReduction}% lower processing time.

**Variables:**
  - `{featureCount}`: 20 to 100, step 10 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{recallIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0386
**Role:** ml-engineer | **Theme:** ml-pipelines | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ML pipelines, MLOps, automation, CI/CD, retraining

**Scope:** ML pipeline automation across {pipelineCount} retraining workflows supporting {modelCount} production models
**Result:** improving retraining consistency by {consistencyIncrease}% and reducing manual intervention by {interventionReduction}%

**Variations:**
- **A (Standard):** Directed ML pipeline automation across {pipelineCount} retraining workflows supporting {modelCount} production models, improving retraining consistency by {consistencyIncrease}% and reducing manual intervention by {interventionReduction}%.
- **B (Result-first):** Achieved {consistencyIncrease}% better retraining consistency and {interventionReduction}% lower manual intervention by directing automation across {pipelineCount} workflows supporting {modelCount} production models.
- **C (Impact-led):** Delivered more reliable ML retraining — improved consistency by {consistencyIncrease}% and reduced manual intervention by {interventionReduction}% through direction of automation across {pipelineCount} workflows.
- **D (Concise):** Directed automation across {pipelineCount} retraining workflows supporting {modelCount} models — {consistencyIncrease}% higher consistency, {interventionReduction}% less manual intervention.

**Variables:**
  - `{pipelineCount}`: 3 to 12, step 1 (integer)
  - `{modelCount}`: 3 to 15, step 1 (integer)
  - `{consistencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{interventionReduction}`: 10 to 30, step 5 (percentage)

### DATA-0387
**Role:** analytics-manager | **Theme:** cross-functional-insights | **Seniority:** mid | **Verb Context:** projects
**Keywords:** cross-functional insights, stakeholder partnership, analytics, business intelligence, decision-making

**Scope:** cross-functional insight frameworks across {departmentCount} departments using {datasetCount} shared data assets
**Result:** improving insight adoption by {adoptionIncrease}% and reducing decision-response lag by {lagReduction}%

**Variations:**
- **A (Standard):** Developed cross-functional insight frameworks across {departmentCount} departments using {datasetCount} shared data assets, improving insight adoption by {adoptionIncrease}% and reducing decision-response lag by {lagReduction}%.
- **B (Result-first):** Achieved {adoptionIncrease}% higher insight adoption and {lagReduction}% lower decision-response lag by developing frameworks across {departmentCount} departments using {datasetCount} shared data assets.
- **C (Impact-led):** Delivered more actionable shared analytics — improved insight adoption by {adoptionIncrease}% and reduced decision lag by {lagReduction}% through development of frameworks across {departmentCount} departments.
- **D (Concise):** Developed insight frameworks across {departmentCount} departments using {datasetCount} shared assets — {adoptionIncrease}% higher adoption, {lagReduction}% lower decision lag.

**Variables:**
  - `{departmentCount}`: 3 to 10, step 1 (integer)
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{adoptionIncrease}`: 15 to 35, step 5 (percentage)
  - `{lagReduction}`: 10 to 30, step 5 (percentage)

### DATA-0388
**Role:** analytics-manager | **Theme:** data-roadmap | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data roadmap, prioritization, analytics strategy, stakeholder alignment, portfolio planning

**Scope:** data roadmap planning across {initiativeCount} analytics initiatives serving {stakeholderCount} cross-functional stakeholders
**Result:** improving roadmap execution alignment by {alignmentIncrease}% and reducing low-priority workload by {workloadReduction}%

**Variations:**
- **A (Standard):** Led data roadmap planning across {initiativeCount} analytics initiatives serving {stakeholderCount} cross-functional stakeholders, improving roadmap execution alignment by {alignmentIncrease}% and reducing low-priority workload by {workloadReduction}%.
- **B (Result-first):** Achieved {alignmentIncrease}% better roadmap execution alignment and {workloadReduction}% lower low-priority workload by leading planning across {initiativeCount} analytics initiatives serving {stakeholderCount} stakeholders.
- **C (Impact-led):** Delivered stronger analytics portfolio focus — improved execution alignment by {alignmentIncrease}% and reduced low-priority workload by {workloadReduction}% through leadership of roadmap planning across {initiativeCount} initiatives.
- **D (Concise):** Led roadmap planning across {initiativeCount} analytics initiatives for {stakeholderCount} stakeholders — {alignmentIncrease}% better execution alignment, {workloadReduction}% lower low-priority workload.

**Variables:**
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{stakeholderCount}`: 10 to 50, step 5 (integer)
  - `{alignmentIncrease}`: 15 to 35, step 5 (percentage)
  - `{workloadReduction}`: 10 to 30, step 5 (percentage)

### DATA-0389
**Role:** data-analyst | **Theme:** reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** reporting, Excel, SQL, stakeholder reporting, performance metrics

**Scope:** performance reporting packs across {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders
**Result:** improving report usability by {usabilityIncrease}% and reducing manual compilation time by {timeReduction}%

**Variations:**
- **A (Standard):** Developed performance reporting packs across {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders, improving report usability by {usabilityIncrease}% and reducing manual compilation time by {timeReduction}%.
- **B (Result-first):** Achieved {usabilityIncrease}% better report usability and {timeReduction}% lower manual compilation time by developing {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders.
- **C (Impact-led):** Delivered more useful recurring reports — improved usability by {usabilityIncrease}% and cut compilation time by {timeReduction}% through development of {reportCount} KPI summaries.
- **D (Concise):** Developed {reportCount} monthly KPI summaries for {stakeholderCount} stakeholders — {usabilityIncrease}% better usability, {timeReduction}% less compilation time.

**Variables:**
  - `{reportCount}`: 4 to 16, step 2 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{usabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0390
**Role:** bi-analyst | **Theme:** forecasting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** forecasting, BI, scenario planning, Excel, trend modeling

**Scope:** forecasting dashboards across {dashboardCount} planning views tracking {metricCount} demand and revenue metrics
**Result:** improving scenario visibility by {visibilityIncrease}% and reducing forecast preparation time by {timeReduction}%

**Variations:**
- **A (Standard):** Built forecasting dashboards across {dashboardCount} planning views tracking {metricCount} demand and revenue metrics, improving scenario visibility by {visibilityIncrease}% and reducing forecast preparation time by {timeReduction}%.
- **B (Result-first):** Achieved {visibilityIncrease}% better scenario visibility and {timeReduction}% lower forecast preparation time by building {dashboardCount} planning dashboards tracking {metricCount} demand and revenue metrics.
- **C (Impact-led):** Delivered clearer forecasting scenarios — improved visibility by {visibilityIncrease}% and cut preparation time by {timeReduction}% through building of {dashboardCount} planning dashboards.
- **D (Concise):** Built {dashboardCount} forecasting dashboards tracking {metricCount} planning metrics — {visibilityIncrease}% better visibility, {timeReduction}% lower prep time.

**Variables:**
  - `{dashboardCount}`: 3 to 10, step 1 (integer)
  - `{metricCount}`: 10 to 40, step 5 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0391
**Role:** data-analyst | **Theme:** data-cleaning | **Seniority:** junior | **Verb Context:** systems
**Keywords:** SQL, Python, data cleaning, data quality, deduplication

**Scope:** data normalization across {datasetCount} customer datasets totaling {rowCount} rows using SQL and Python cleanup logic
**Result:** improving field consistency by {consistencyIncrease}% and reducing duplicate profiles by {duplicateReduction}%

**Variations:**
- **A (Standard):** Assisted data normalization across {datasetCount} customer datasets totaling {rowCount} rows using SQL and Python cleanup logic, improving field consistency by {consistencyIncrease}% and reducing duplicate profiles by {duplicateReduction}%.
- **B (Result-first):** Achieved {consistencyIncrease}% higher field consistency and {duplicateReduction}% fewer duplicate profiles by assisting normalization across {datasetCount} customer datasets totaling {rowCount} rows.
- **C (Impact-led):** Delivered cleaner customer records — improved field consistency by {consistencyIncrease}% and reduced duplicate profiles by {duplicateReduction}% while supporting normalization across {datasetCount} datasets totaling {rowCount} rows.
- **D (Concise):** Assisted normalization of {datasetCount} customer datasets totaling {rowCount} rows — {consistencyIncrease}% higher consistency, {duplicateReduction}% fewer duplicate profiles.

**Variables:**
  - `{datasetCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{consistencyIncrease}`: 10 to 25, step 5 (percentage)
  - `{duplicateReduction}`: 10 to 30, step 5 (percentage)

### DATA-0392
**Role:** data-analyst | **Theme:** reporting | **Seniority:** mid | **Verb Context:** projects
**Keywords:** reporting, Excel, SQL, stakeholder reporting, performance metrics

**Scope:** performance reporting packs across {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders
**Result:** improving report usability by {usabilityIncrease}% and reducing manual compilation time by {timeReduction}%

**Variations:**
- **A (Standard):** Developed performance reporting packs across {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders, improving report usability by {usabilityIncrease}% and reducing manual compilation time by {timeReduction}%.
- **B (Result-first):** Achieved {usabilityIncrease}% better report usability and {timeReduction}% lower manual compilation time by developing {reportCount} monthly summaries covering {metricCount} KPIs for {stakeholderCount} stakeholders.
- **C (Impact-led):** Delivered more useful recurring reports — improved usability by {usabilityIncrease}% and cut compilation time by {timeReduction}% through development of {reportCount} KPI summaries.
- **D (Concise):** Developed {reportCount} monthly KPI summaries for {stakeholderCount} stakeholders — {usabilityIncrease}% better usability, {timeReduction}% less compilation time.

**Variables:**
  - `{reportCount}`: 4 to 16, step 2 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{stakeholderCount}`: 5 to 30, step 5 (integer)
  - `{usabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0393
**Role:** bi-analyst | **Theme:** kpi-tracking | **Seniority:** mid | **Verb Context:** systems
**Keywords:** KPI tracking, Power BI, business metrics, scorecards, performance monitoring

**Scope:** KPI scorecards across {dashboardCount} monitoring views covering {metricCount} operational metrics
**Result:** improving metric refresh reliability by {reliabilityIncrease}% and reducing reconciliation effort by {effortReduction}%

**Variations:**
- **A (Standard):** Optimized KPI scorecards across {dashboardCount} monitoring views covering {metricCount} operational metrics, improving metric refresh reliability by {reliabilityIncrease}% and reducing reconciliation effort by {effortReduction}%.
- **B (Result-first):** Achieved {reliabilityIncrease}% better metric refresh reliability and {effortReduction}% lower reconciliation effort by optimizing {dashboardCount} KPI scorecards covering {metricCount} operational metrics.
- **C (Impact-led):** Delivered more dependable KPI monitoring — improved refresh reliability by {reliabilityIncrease}% and reduced reconciliation effort by {effortReduction}% through optimization of {dashboardCount} scorecards.
- **D (Concise):** Optimized {dashboardCount} KPI scorecards covering {metricCount} metrics — {reliabilityIncrease}% better refresh reliability, {effortReduction}% lower reconciliation effort.

**Variables:**
  - `{dashboardCount}`: 3 to 12, step 1 (integer)
  - `{metricCount}`: 10 to 50, step 5 (integer)
  - `{reliabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{effortReduction}`: 10 to 30, step 5 (percentage)

### DATA-0394
**Role:** data-engineer | **Theme:** data-warehousing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Snowflake, BigQuery, data warehouse, SQL, performance tuning

**Scope:** warehouse storage design across {tableCount} analytical tables holding {rowCount} records
**Result:** reducing storage costs by {costReduction}% and improving query response time by {responseIncrease}%

**Variations:**
- **A (Standard):** Optimized warehouse storage design across {tableCount} analytical tables holding {rowCount} records, reducing storage costs by {costReduction}% and improving query response time by {responseIncrease}%.
- **B (Result-first):** Achieved {costReduction}% lower storage costs and {responseIncrease}% faster query response time by optimizing storage design across {tableCount} analytical tables holding {rowCount} records.
- **C (Impact-led):** Delivered leaner and faster warehouse storage — reduced costs by {costReduction}% and improved response time by {responseIncrease}% through optimization of {tableCount} analytical tables.
- **D (Concise):** Optimized storage design across {tableCount} analytical tables holding {rowCount} records — {costReduction}% lower cost, {responseIncrease}% faster response time.

**Variables:**
  - `{tableCount}`: 20 to 100, step 10 (integer)
  - `{rowCount}`: 1000000 to 10000000, step 1000000 (integer)
  - `{costReduction}`: 15 to 35, step 5 (percentage)
  - `{responseIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0395
**Role:** data-engineer | **Theme:** pipeline-optimization | **Seniority:** senior | **Verb Context:** systems
**Keywords:** pipeline optimization, Airflow, Spark, data engineering, throughput

**Scope:** pipeline performance improvements across {pipelineCount} workflows processing {rowCount} records per run
**Result:** reducing processing latency by {latencyReduction}% and increasing data throughput by {throughputIncrease}%

**Variations:**
- **A (Standard):** Led pipeline performance improvements across {pipelineCount} workflows processing {rowCount} records per run, reducing processing latency by {latencyReduction}% and increasing data throughput by {throughputIncrease}%.
- **B (Result-first):** Achieved {latencyReduction}% lower processing latency and {throughputIncrease}% higher data throughput by leading improvements across {pipelineCount} workflows processing {rowCount} records per run.
- **C (Impact-led):** Delivered faster large-scale data movement — reduced latency by {latencyReduction}% and increased throughput by {throughputIncrease}% through leadership of improvements across {pipelineCount} workflows.
- **D (Concise):** Led performance improvements across {pipelineCount} workflows processing {rowCount} records per run — {latencyReduction}% lower latency, {throughputIncrease}% higher throughput.

**Variables:**
  - `{pipelineCount}`: 5 to 20, step 1 (integer)
  - `{rowCount}`: 500000 to 5000000, step 500000 (integer)
  - `{latencyReduction}`: 15 to 35, step 5 (percentage)
  - `{throughputIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0396
**Role:** ml-engineer | **Theme:** model-training | **Seniority:** mid | **Verb Context:** projects
**Keywords:** model training, Python, scikit-learn, hyperparameter tuning, accuracy

**Scope:** training workflows across {modelCount} supervised models using {sampleCount} labeled samples
**Result:** improving validation accuracy by {accuracyIncrease}% and reducing training runtime by {runtimeReduction}%

**Variations:**
- **A (Standard):** Optimized training workflows across {modelCount} supervised models using {sampleCount} labeled samples, improving validation accuracy by {accuracyIncrease}% and reducing training runtime by {runtimeReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher validation accuracy and {runtimeReduction}% lower training runtime by optimizing workflows across {modelCount} supervised models using {sampleCount} labeled samples.
- **C (Impact-led):** Delivered more efficient model training — improved validation accuracy by {accuracyIncrease}% and reduced runtime by {runtimeReduction}% through optimization of {modelCount} supervised models.
- **D (Concise):** Optimized training workflows for {modelCount} supervised models using {sampleCount} labeled samples — {accuracyIncrease}% higher validation accuracy, {runtimeReduction}% lower runtime.

**Variables:**
  - `{modelCount}`: 3 to 12, step 1 (integer)
  - `{sampleCount}`: 50000 to 500000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{runtimeReduction}`: 10 to 30, step 5 (percentage)

### DATA-0397
**Role:** ml-engineer | **Theme:** model-deployment | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model deployment, MLOps, Docker, CI/CD, production ML

**Scope:** production model deployment across {deploymentCount} services handling {predictionCount} daily predictions
**Result:** reducing deployment failure rates by {failureReduction}% and improving service uptime by {uptimeIncrease}%

**Variations:**
- **A (Standard):** Led production model deployment across {deploymentCount} services handling {predictionCount} daily predictions, reducing deployment failure rates by {failureReduction}% and improving service uptime by {uptimeIncrease}%.
- **B (Result-first):** Achieved {failureReduction}% lower deployment failure rates and {uptimeIncrease}% higher service uptime by leading production deployment across {deploymentCount} services handling {predictionCount} daily predictions.
- **C (Impact-led):** Delivered more reliable production ML deployment — reduced failure rates by {failureReduction}% and improved uptime by {uptimeIncrease}% through leadership of {deploymentCount} services.
- **D (Concise):** Led production deployment across {deploymentCount} services handling {predictionCount} daily predictions — {failureReduction}% lower failure rates, {uptimeIncrease}% higher uptime.

**Variables:**
  - `{deploymentCount}`: 3 to 12, step 1 (integer)
  - `{predictionCount}`: 10000 to 200000, step 10000 (integer)
  - `{failureReduction}`: 15 to 35, step 5 (percentage)
  - `{uptimeIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0398
**Role:** analytics-manager | **Theme:** analytics-strategy | **Seniority:** senior | **Verb Context:** people
**Keywords:** analytics strategy, roadmap, data-driven decisions, leadership, business intelligence

**Scope:** analytics planning across {teamCount} analysts supporting {initiativeCount} strategic business initiatives
**Result:** improving analytics impact by {impactIncrease}% and increasing stakeholder adoption by {adoptionIncrease}%

**Variations:**
- **A (Standard):** Directed analytics planning across {teamCount} analysts supporting {initiativeCount} strategic business initiatives, improving analytics impact by {impactIncrease}% and increasing stakeholder adoption by {adoptionIncrease}%.
- **B (Result-first):** Achieved {impactIncrease}% higher analytics impact and {adoptionIncrease}% stronger stakeholder adoption by directing planning across {teamCount} analysts supporting {initiativeCount} strategic initiatives.
- **C (Impact-led):** Delivered greater business impact from analytics — improved impact by {impactIncrease}% and stakeholder adoption by {adoptionIncrease}% through direction of planning across {teamCount} analysts.
- **D (Concise):** Directed analytics planning across {teamCount} analysts for {initiativeCount} initiatives — {impactIncrease}% higher impact, {adoptionIncrease}% stronger stakeholder adoption.

**Variables:**
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{impactIncrease}`: 15 to 35, step 5 (percentage)
  - `{adoptionIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0399
**Role:** analytics-manager | **Theme:** team-leadership | **Seniority:** senior | **Verb Context:** people
**Keywords:** team leadership, mentoring, analytics team, delivery, performance

**Scope:** analytics team coaching for {teamCount} analysts across {projectCount} active reporting and insight projects
**Result:** improving analyst output quality by {qualityIncrease}% and increasing on-time project delivery by {deliveryIncrease}%

**Variations:**
- **A (Standard):** Led analytics team coaching for {teamCount} analysts across {projectCount} active reporting and insight projects, improving analyst output quality by {qualityIncrease}% and increasing on-time project delivery by {deliveryIncrease}%.
- **B (Result-first):** Achieved {qualityIncrease}% higher analyst output quality and {deliveryIncrease}% better on-time project delivery by leading coaching for {teamCount} analysts across {projectCount} active projects.
- **C (Impact-led):** Delivered stronger analytics team execution — improved output quality by {qualityIncrease}% and on-time delivery by {deliveryIncrease}% through leadership of coaching for {teamCount} analysts.
- **D (Concise):** Led coaching for {teamCount} analysts across {projectCount} active projects — {qualityIncrease}% higher output quality, {deliveryIncrease}% better on-time delivery.

**Variables:**
  - `{teamCount}`: 3 to 12, step 1 (integer)
  - `{projectCount}`: 5 to 20, step 1 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{deliveryIncrease}`: 10 to 30, step 5 (percentage)

### DATA-0400
**Role:** analytics-manager | **Theme:** data-roadmap | **Seniority:** senior | **Verb Context:** projects
**Keywords:** data roadmap, prioritization, analytics strategy, stakeholder alignment, portfolio planning

**Scope:** data roadmap planning across {initiativeCount} analytics initiatives serving {stakeholderCount} cross-functional stakeholders
**Result:** improving roadmap execution alignment by {alignmentIncrease}% and reducing low-priority workload by {workloadReduction}%

**Variations:**
- **A (Standard):** Led data roadmap planning across {initiativeCount} analytics initiatives serving {stakeholderCount} cross-functional stakeholders, improving roadmap execution alignment by {alignmentIncrease}% and reducing low-priority workload by {workloadReduction}%.
- **B (Result-first):** Achieved {alignmentIncrease}% better roadmap execution alignment and {workloadReduction}% lower low-priority workload by leading planning across {initiativeCount} analytics initiatives serving {stakeholderCount} stakeholders.
- **C (Impact-led):** Delivered stronger analytics portfolio focus — improved execution alignment by {alignmentIncrease}% and reduced low-priority workload by {workloadReduction}% through leadership of roadmap planning across {initiativeCount} initiatives.
- **D (Concise):** Led roadmap planning across {initiativeCount} analytics initiatives for {stakeholderCount} stakeholders — {alignmentIncrease}% better execution alignment, {workloadReduction}% lower low-priority workload.

**Variables:**
  - `{initiativeCount}`: 5 to 20, step 1 (integer)
  - `{stakeholderCount}`: 10 to 50, step 5 (integer)
  - `{alignmentIncrease}`: 15 to 35, step 5 (percentage)
  - `{workloadReduction}`: 10 to 30, step 5 (percentage)

