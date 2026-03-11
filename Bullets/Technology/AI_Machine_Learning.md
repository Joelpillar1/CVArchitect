# AI / Machine Learning

**Industry ID:** `ai-ml` | **Prefix:** `AIML` | **Target:** 400 bullets

---

### AIML-0001
**Role:** ai-engineer | **Theme:** llm-integration | **Seniority:** mid | **Verb Context:** systems
**Keywords:** LLM, GPT-4, RAG, LangChain, prompt engineering, AI integration, enterprise AI

**Scope:** an LLM-powered document Q&A system using RAG and LangChain over a corpus of {docs}K internal documents for {users}K enterprise users
**Result:** reducing average employee document search time from {before} minutes to {after} seconds and achieving a {satisfaction} out of 5 user satisfaction score

**Variations:**
- **A (Standard):** Built an LLM document Q&A system using RAG and LangChain over {docs}K documents for {users}K users, cutting search time from {before}min to {after}s and achieving {satisfaction}/5 satisfaction.
- **B (Result-first):** Cut document search time from {before}min to {after}s and achieved {satisfaction}/5 satisfaction by building an LLM RAG Q&A system over {docs}K documents for {users}K users.
- **C (Impact-led):** Reduced search time from {before}min to {after}s and scored {satisfaction}/5 satisfaction; built LLM RAG system using LangChain over {docs}K documents for {users}K enterprise users.
- **D (Concise):** Built LLM RAG system over {docs}K documents for {users}K users, search time from {before}min to {after}s, {satisfaction}/5 satisfaction.

**Variables:**
  - `{docs}`: 10 to 500, step 10 (integer)
  - `{users}`: 100 to 5000, step 100 (integer)
  - `{before}`: 5 to 20, step 5 (integer)
  - `{after}`: 5 to 30, step 5 (integer)
  - `{satisfaction}`: 4.2 to 4.9, step 0.1 (integer)

### AIML-0002
**Role:** ml-researcher | **Theme:** algorithm-development | **Seniority:** senior | **Verb Context:** systems
**Keywords:** deep learning, PyTorch, model architecture, research, neural networks, benchmarking

**Scope:** a novel neural network architecture for {task} achieving state-of-the-art performance, validated on {benchmarks} public benchmarks with a training dataset of {records}M samples
**Result:** outperforming the previous SOTA baseline by {improvement}% on the primary metric and reducing training time by {training}% with equivalent compute

**Variations:**
- **A (Standard):** Developed a novel neural architecture for {task} validated on {benchmarks} benchmarks with {records}M training samples, outperforming SOTA by {improvement}% while cutting training time by {training}%.
- **B (Result-first):** Outperformed SOTA by {improvement}% and cut training time by {training}% by developing a novel neural architecture for {task} validated on {benchmarks} benchmarks with {records}M samples.
- **C (Impact-led):** Beat SOTA by {improvement}% and cut training time {training}% with equivalent compute; invented novel neural architecture for {task} validated across {benchmarks} benchmarks with {records}M samples.
- **D (Concise):** Invented neural architecture for {task} on {benchmarks} benchmarks with {records}M samples, SOTA by {improvement}%, training time cut {training}%.

**Variables:**
  - `{benchmarks}`: 3 to 10, step 1 (integer)
  - `{records}`: 1 to 100, step 5 (integer)
  - `{improvement}`: 5 to 25, step 5 (percentage)
  - `{training}`: 20 to 50, step 5 (percentage)

### AIML-0003
**Role:** nlp-engineer | **Theme:** natural-language-processing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** NLP, BERT, text classification, named entity recognition, Hugging Face, transformer models

**Scope:** a fine-tuned BERT-based text classification model on a dataset of {records}K labeled examples across {classes} categories for a customer support ticket routing system
**Result:** achieving {accuracy}% classification accuracy and reducing manual ticket triage time by {hours}K hours per year

**Variations:**
- **A (Standard):** Fine-tuned BERT for ticket classification across {classes} categories on {records}K examples, achieving {accuracy}% accuracy and saving {hours}K triage hours annually.
- **B (Result-first):** Achieved {accuracy}% classification accuracy and saved {hours}K triage hours annually by fine-tuning BERT on {records}K examples across {classes} categories.
- **C (Impact-led):** Saved {hours}K annual triage hours with {accuracy}% classification accuracy; fine-tuned BERT on {records}K labeled examples across {classes} categories for support ticket routing.
- **D (Concise):** Fine-tuned BERT on {records}K examples across {classes} classes, {accuracy}% accuracy, saved {hours}K triage hours/year.

**Variables:**
  - `{records}`: 10 to 500, step 10 (integer)
  - `{classes}`: 10 to 50, step 5 (integer)
  - `{accuracy}`: 85 to 97, step 1 (percentage)
  - `{hours}`: 5 to 50, step 5 (integer)

### AIML-0004
**Role:** cv-engineer | **Theme:** object-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** computer vision, YOLO, object detection, model inference, edge deployment, OpenCV

**Scope:** a real-time object detection model using YOLOv8 trained on {images}K labeled images across {classes} object classes for a manufacturing quality control system
**Result:** achieving {map}% mAP at {fps} FPS inference speed and reducing defect escape rate from {before}% to {after}%

**Variations:**
- **A (Standard):** Trained a YOLOv8 object detection model on {images}K images across {classes} classes, achieving {map}% mAP at {fps} FPS and reducing defect escape rate from {before}% to {after}%.
- **B (Result-first):** Reduced defect escape rate from {before}% to {after}% by training YOLOv8 on {images}K images across {classes} classes, achieving {map}% mAP at {fps} FPS.
- **C (Impact-led):** Cut defect escape rate from {before}% to {after}%; trained YOLOv8 on {images}K images across {classes} classes, achieving {map}% mAP at {fps} FPS real-time inference.
- **D (Concise):** Trained YOLOv8 on {images}K images across {classes} classes, {map}% mAP at {fps} FPS, defect escape rate from {before}% to {after}%.

**Variables:**
  - `{images}`: 10 to 500, step 10 (integer)
  - `{classes}`: 10 to 50, step 5 (integer)
  - `{map}`: 80 to 96, step 2 (percentage)
  - `{fps}`: 15 to 60, step 5 (integer)
  - `{before}`: 5 to 15, step 5 (percentage)
  - `{after}`: 0.5 to 2, step 0.5 (percentage)

### AIML-0005
**Role:** ai-pm | **Theme:** ai-roadmap | **Seniority:** senior | **Verb Context:** projects
**Keywords:** AI product strategy, ML product management, responsible AI, AI governance, model evaluation

**Scope:** an AI product roadmap for {models} ML-powered features across a {dau}K DAU platform, prioritizing {use_cases} use cases with cross-functional teams including data science, engineering, and legal
**Result:** launching {launched} AI features on schedule and growing AI-driven revenue from ${before}M to ${after}M within {months} months

**Variations:**
- **A (Standard):** Directed AI roadmap for {models} features across a {dau}K DAU platform, launching {launched} features on schedule and growing AI-driven revenue from ${before}M to ${after}M in {months} months.
- **B (Result-first):** Grew AI-driven revenue from ${before}M to ${after}M in {months} months by directing AI roadmap for {models} features across a {dau}K DAU platform, launching {launched} on schedule.
- **C (Impact-led):** Grew AI-driven revenue from ${before}M to ${after}M in {months} months; spearheaded AI product roadmap for {models} features across {dau}K DAU platform, launching {launched} on schedule.
- **D (Concise):** Directed AI roadmap for {models} features on {dau}K DAU platform, {launched} launched on schedule, AI revenue from ${before}M to ${after}M in {months} months.

**Variables:**
  - `{models}`: 5 to 20, step 5 (integer)
  - `{dau}`: 100 to 5000, step 100 (integer)
  - `{use_cases}`: 10 to 30, step 5 (integer)
  - `{launched}`: 3 to 10, step 1 (integer)
  - `{before}`: 1 to 20, step 1 (currency)
  - `{after}`: 5 to 50, step 5 (currency)
  - `{months}`: 6 to 18, step 3 (integer)

### AIML-0006
**Role:** ai-engineer | **Theme:** fine-tuning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** fine-tuning, LoRA, PEFT, domain adaptation, model customization, Hugging Face

**Scope:** a domain-adapted language model using LoRA fine-tuning on {samples}K domain-specific samples to replace a general-purpose LLM for a specialized {domain} use case
**Result:** reducing inference cost by ${savings}K per month and improving task-specific accuracy from {before}% to {after}%

**Variations:**
- **A (Standard):** Fine-tuned a domain-adapted LLM using LoRA on {samples}K samples for {domain}, improving task accuracy from {before}% to {after}% and reducing inference cost by ${savings}K monthly.
- **B (Result-first):** Improved task accuracy from {before}% to {after}% and cut inference cost by ${savings}K monthly by fine-tuning a LoRA-adapted LLM on {samples}K domain-specific samples.
- **C (Impact-led):** Improved task accuracy from {before}% to {after}% and saved ${savings}K monthly; fine-tuned LoRA-adapted LLM on {samples}K domain samples for {domain} use case.
- **D (Concise):** Fine-tuned LoRA LLM on {samples}K domain samples, accuracy from {before}% to {after}%, inference cost down ${savings}K/month.

**Variables:**
  - `{samples}`: 5 to 500, step 5 (integer)
  - `{before}`: 60 to 75, step 5 (percentage)
  - `{after}`: 85 to 97, step 1 (percentage)
  - `{savings}`: 5 to 100, step 5 (currency)

### AIML-0007
**Role:** ml-researcher | **Theme:** experimentation | **Seniority:** junior | **Verb Context:** systems
**Keywords:** ML experimentation, experiment tracking, MLflow, hyperparameter tuning, model comparison

**Scope:** {experiments} ML experiments using MLflow for experiment tracking, comparing {models} model architectures across {datasets} datasets with systematic hyperparameter search
**Result:** identifying the optimal model configuration with {improvement}% improvement over the baseline and reducing experiment cycle time by {time}%

**Variations:**
- **A (Standard):** Conducted {experiments} MLflow-tracked experiments comparing {models} architectures across {datasets} datasets, identifying optimal config with {improvement}% baseline improvement and cutting cycle time {time}%.
- **B (Result-first):** Achieved {improvement}% baseline improvement and cut experiment cycle time {time}% by running {experiments} MLflow experiments across {models} architectures and {datasets} datasets.
- **C (Impact-led):** Hit {improvement}% baseline improvement and cut cycle time {time}%; ran {experiments} MLflow-tracked experiments comparing {models} architectures across {datasets} datasets.
- **D (Concise):** Ran {experiments} MLflow experiments across {models} architectures and {datasets} datasets, {improvement}% baseline improvement, cycle time down {time}%.

**Variables:**
  - `{experiments}`: 20 to 200, step 20 (integer)
  - `{models}`: 5 to 15, step 5 (integer)
  - `{datasets}`: 2 to 8, step 1 (integer)
  - `{improvement}`: 5 to 25, step 5 (percentage)
  - `{time}`: 20 to 50, step 5 (percentage)

### AIML-0008
**Role:** cv-engineer | **Theme:** model-training | **Seniority:** junior | **Verb Context:** systems
**Keywords:** model training, dataset annotation, data augmentation, PyTorch, GPU training, image classification

**Scope:** data annotation pipeline and training workflow for an image classification model trained on {images}K images across {classes} classes using PyTorch on {gpus} GPUs
**Result:** achieving {accuracy}% top-1 accuracy and reducing model training time from {before} hours to {after} hours per run through optimized data loading

**Variations:**
- **A (Standard):** Developed annotation pipeline and PyTorch training workflow for an image classifier on {images}K images across {classes} classes, achieving {accuracy}% accuracy and cutting training time from {before} to {after} hours.
- **B (Result-first):** Achieved {accuracy}% accuracy and cut training time from {before} to {after} hours by building annotation pipeline and PyTorch workflow for {images}K images across {classes} classes.
- **C (Impact-led):** Hit {accuracy}% top-1 accuracy and cut training from {before} to {after} hours; built annotation pipeline and PyTorch training workflow for {images}K images across {classes} classes on {gpus} GPUs.
- **D (Concise):** Built annotation pipeline and PyTorch workflow for {images}K images across {classes} classes on {gpus} GPUs, {accuracy}% accuracy, training from {before} to {after} hours.

**Variables:**
  - `{images}`: 10 to 500, step 10 (integer)
  - `{classes}`: 10 to 100, step 10 (integer)
  - `{gpus}`: 2 to 8, step 2 (integer)
  - `{accuracy}`: 80 to 96, step 2 (percentage)
  - `{before}`: 4 to 20, step 2 (integer)
  - `{after}`: 1 to 4, step 1 (integer)

### AIML-0009
**Role:** nlp-engineer | **Theme:** deployment | **Seniority:** senior | **Verb Context:** systems
**Keywords:** model serving, Triton Inference Server, TensorRT, model optimization, low-latency inference, production NLP

**Scope:** an NLP model serving infrastructure using Triton Inference Server and TensorRT optimization for {models} models handling {requests}K requests per day
**Result:** achieving {latency}ms p99 latency, {throughput}X throughput improvement over baseline, and ${savings}K monthly infrastructure savings

**Variations:**
- **A (Standard):** Deployed Triton Inference Server with TensorRT for {models} NLP models at {requests}K daily requests, achieving {latency}ms p99 latency, {throughput}X throughput, and ${savings}K monthly savings.
- **B (Result-first):** Achieved {latency}ms p99 latency, {throughput}X throughput, and ${savings}K monthly savings by deploying Triton and TensorRT for {models} NLP models at {requests}K daily requests.
- **C (Impact-led):** Reached {latency}ms p99 latency, {throughput}X throughput, and ${savings}K monthly savings; deployed Triton Inference Server with TensorRT for {models} models at {requests}K daily requests.
- **D (Concise):** Deployed Triton and TensorRT for {models} NLP models at {requests}K requests/day, {latency}ms p99, {throughput}X throughput, ${savings}K monthly savings.

**Variables:**
  - `{models}`: 3 to 15, step 3 (integer)
  - `{requests}`: 100 to 5000, step 100 (integer)
  - `{latency}`: 10 to 50, step 5 (integer)
  - `{throughput}`: 2 to 8, step 1 (integer)
  - `{savings}`: 10 to 100, step 10 (currency)

### AIML-0010
**Role:** ai-pm | **Theme:** responsible-ai | **Seniority:** senior | **Verb Context:** projects
**Keywords:** responsible AI, AI ethics, bias detection, model fairness, AI governance, explainability

**Scope:** a responsible AI governance framework covering {models} production models across {use_cases} use cases, including bias audits, explainability requirements, and model cards
**Result:** reducing model-related bias incidents by {incidents}% and achieving compliance with {regulations} AI regulatory requirements within {months} months

**Variations:**
- **A (Standard):** Established responsible AI governance for {models} production models across {use_cases} use cases, reducing bias incidents by {incidents}% and achieving compliance with {regulations} AI regulations in {months} months.
- **B (Result-first):** Reduced AI bias incidents by {incidents}% and achieved {regulations}-regulation compliance in {months} months by establishing AI governance for {models} models across {use_cases} use cases.
- **C (Impact-led):** Cut bias incidents {incidents}% and achieved {regulations}-regulation compliance in {months} months; established responsible AI framework for {models} models across {use_cases} use cases.
- **D (Concise):** Built responsible AI framework for {models} models across {use_cases} use cases, bias incidents down {incidents}%, compliant with {regulations} regulations in {months} months.

**Variables:**
  - `{models}`: 10 to 50, step 5 (integer)
  - `{use_cases}`: 5 to 20, step 5 (integer)
  - `{incidents}`: 40 to 80, step 5 (percentage)
  - `{regulations}`: 2 to 5, step 1 (integer)
  - `{months}`: 6 to 18, step 3 (integer)

### AIML-0011
**Role:** machine-learning-engineer | **Theme:** model-training-pipelines | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model training, ML pipelines, feature processing, training workflows, model delivery

**Scope:** model training pipelines across {pipelineCount} workflows processing {datasetCount}+ datasets
**Result:** reducing training turnaround time by {timeReduction}% and improving experiment repeatability by {repeatabilityIncrease}%

**Variations:**
- **A (Standard):** Built model training pipelines across {pipelineCount} workflows processing {datasetCount}+ datasets, reducing training turnaround time by {timeReduction}% and improving experiment repeatability by {repeatabilityIncrease}%.
- **B (Result-first):** Achieved {timeReduction}% lower training turnaround time and {repeatabilityIncrease}% higher experiment repeatability by building {pipelineCount} model training workflows handling {datasetCount}+ datasets.
- **C (Impact-led):** Delivered more reliable ML development — reduced training turnaround time by {timeReduction}% and improved experiment repeatability by {repeatabilityIncrease}% through {pipelineCount} training pipelines.
- **D (Concise):** Built {pipelineCount} model training workflows processing {datasetCount}+ datasets — {timeReduction}% lower training time, {repeatabilityIncrease}% higher repeatability.

**Variables:**
  - `{pipelineCount}`: 3 to 15, step 1 (integer)
  - `{datasetCount}`: 10 to 100, step 5 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{repeatabilityIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0012
**Role:** machine-learning-engineer | **Theme:** feature-engineering | **Seniority:** mid | **Verb Context:** content
**Keywords:** feature engineering, ML features, data transformation, predictive modeling, feature quality

**Scope:** predictive input features across {featureCount} engineered variables supporting {modelCount} deployed models
**Result:** improving model signal quality by {qualityIncrease}% and reducing noisy feature reliance by {noiseReduction}%

**Variations:**
- **A (Standard):** Engineered predictive input features across {featureCount} variables supporting {modelCount} deployed models, improving model signal quality by {qualityIncrease}% and reducing noisy feature reliance by {noiseReduction}%.
- **B (Result-first):** Achieved {qualityIncrease}% higher model signal quality and {noiseReduction}% lower noisy feature reliance by engineering {featureCount} variables for {modelCount} deployed models.
- **C (Impact-led):** Delivered stronger predictive inputs — improved model signal quality by {qualityIncrease}% and reduced noisy feature reliance by {noiseReduction}% through engineering of {featureCount} variables.
- **D (Concise):** Engineered {featureCount} predictive variables for {modelCount} deployed models — {qualityIncrease}% higher signal quality, {noiseReduction}% lower noise reliance.

**Variables:**
  - `{featureCount}`: 20 to 150, step 10 (integer)
  - `{modelCount}`: 2 to 20, step 2 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{noiseReduction}`: 10 to 30, step 5 (percentage)

### AIML-0013
**Role:** data-scientist | **Theme:** model-evaluation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model evaluation, validation, performance metrics, ML testing, predictive accuracy

**Scope:** model performance across {experimentCount} validation experiments covering {metricCount} evaluation metrics
**Result:** improving metric visibility by {visibilityIncrease}% and reducing model selection uncertainty by {uncertaintyReduction}%

**Variations:**
- **A (Standard):** Evaluated model performance across {experimentCount} validation experiments covering {metricCount} evaluation metrics, improving metric visibility by {visibilityIncrease}% and reducing model selection uncertainty by {uncertaintyReduction}%.
- **B (Result-first):** Achieved {visibilityIncrease}% higher metric visibility and {uncertaintyReduction}% lower model selection uncertainty by evaluating {experimentCount} validation experiments across {metricCount} metrics.
- **C (Impact-led):** Delivered clearer model comparison — improved metric visibility by {visibilityIncrease}% and reduced selection uncertainty by {uncertaintyReduction}% through evaluation of {experimentCount} experiments.
- **D (Concise):** Evaluated model performance across {experimentCount} experiments and {metricCount} metrics — {visibilityIncrease}% higher visibility, {uncertaintyReduction}% lower uncertainty.

**Variables:**
  - `{experimentCount}`: 10 to 60, step 5 (integer)
  - `{metricCount}`: 4 to 20, step 2 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{uncertaintyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0014
**Role:** machine-learning-engineer | **Theme:** model-deployment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model deployment, ML serving, inference systems, production ML, deployment automation

**Scope:** production inference services across {serviceCount} model endpoints serving {requestCount}+ daily predictions
**Result:** reducing deployment friction by {frictionReduction}% and improving release consistency by {consistencyIncrease}%

**Variations:**
- **A (Standard):** Deployed production inference services across {serviceCount} model endpoints serving {requestCount}+ daily predictions, reducing deployment friction by {frictionReduction}% and improving release consistency by {consistencyIncrease}%.
- **B (Result-first):** Achieved {frictionReduction}% lower deployment friction and {consistencyIncrease}% higher release consistency by deploying {serviceCount} model endpoints serving {requestCount}+ daily predictions.
- **C (Impact-led):** Delivered smoother production ML releases — reduced deployment friction by {frictionReduction}% and improved release consistency by {consistencyIncrease}% through deployment of {serviceCount} endpoints.
- **D (Concise):** Deployed {serviceCount} model endpoints serving {requestCount}+ daily predictions — {frictionReduction}% lower friction, {consistencyIncrease}% higher consistency.

**Variables:**
  - `{serviceCount}`: 2 to 12, step 1 (integer)
  - `{requestCount}`: 10000 to 1000000, step 50000 (integer)
  - `{frictionReduction}`: 15 to 35, step 5 (percentage)
  - `{consistencyIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0015
**Role:** data-scientist | **Theme:** ab-test-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** A/B testing, experiment analysis, causal inference, product analytics, decision science

**Scope:** experimental outcomes across {testCount} controlled tests involving {userCount}+ users
**Result:** improving decision confidence by {confidenceIncrease}% and reducing inconclusive experiment carryover by {carryoverReduction}%

**Variations:**
- **A (Standard):** Analyzed experimental outcomes across {testCount} controlled tests involving {userCount}+ users, improving decision confidence by {confidenceIncrease}% and reducing inconclusive experiment carryover by {carryoverReduction}%.
- **B (Result-first):** Achieved {confidenceIncrease}% higher decision confidence and {carryoverReduction}% lower inconclusive experiment carryover by analyzing {testCount} controlled tests involving {userCount}+ users.
- **C (Impact-led):** Delivered clearer experimentation decisions — improved confidence by {confidenceIncrease}% and reduced inconclusive carryover by {carryoverReduction}% through analysis of {testCount} tests.
- **D (Concise):** Analyzed {testCount} controlled tests involving {userCount}+ users — {confidenceIncrease}% higher confidence, {carryoverReduction}% lower carryover.

**Variables:**
  - `{testCount}`: 5 to 30, step 1 (integer)
  - `{userCount}`: 20000 to 500000, step 20000 (integer)
  - `{confidenceIncrease}`: 15 to 35, step 5 (percentage)
  - `{carryoverReduction}`: 10 to 30, step 5 (percentage)

### AIML-0016
**Role:** mlops-engineer | **Theme:** model-monitoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model monitoring, ML observability, drift detection, production metrics, model health

**Scope:** production model health across {modelCount} deployed models serving {predictionCount}+ daily predictions
**Result:** improving model issue detection speed by {speedIncrease}% and reducing unnoticed performance degradation by {degradationReduction}%

**Variations:**
- **A (Standard):** Tracked production model health across {modelCount} deployed models serving {predictionCount}+ daily predictions, improving model issue detection speed by {speedIncrease}% and reducing unnoticed performance degradation by {degradationReduction}%.
- **B (Result-first):** Achieved {speedIncrease}% faster model issue detection and {degradationReduction}% lower unnoticed performance degradation by tracking health across {modelCount} deployed models.
- **C (Impact-led):** Delivered stronger ML observability — improved issue detection speed by {speedIncrease}% and reduced unnoticed degradation by {degradationReduction}% through monitoring of {modelCount} models.
- **D (Concise):** Tracked health across {modelCount} deployed models serving {predictionCount}+ daily predictions — {speedIncrease}% faster detection, {degradationReduction}% lower unnoticed degradation.

**Variables:**
  - `{modelCount}`: 3 to 20, step 1 (integer)
  - `{predictionCount}`: 10000 to 1000000, step 50000 (integer)
  - `{speedIncrease}`: 15 to 35, step 5 (percentage)
  - `{degradationReduction}`: 10 to 30, step 5 (percentage)

### AIML-0017
**Role:** research-scientist | **Theme:** nlp-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** NLP, language models, text classification, transformers, natural language processing

**Scope:** language understanding models across {datasetCount} text corpora containing {sampleCount}+ labeled samples
**Result:** improving classification accuracy by {accuracyIncrease}% and reducing inference error rates by {errorReduction}%

**Variations:**
- **A (Standard):** Trained language understanding models across {datasetCount} text corpora containing {sampleCount}+ labeled samples, improving classification accuracy by {accuracyIncrease}% and reducing inference error rates by {errorReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher classification accuracy and {errorReduction}% lower inference error rates by training models across {datasetCount} text corpora with {sampleCount}+ samples.
- **C (Impact-led):** Delivered stronger NLP performance — improved classification accuracy by {accuracyIncrease}% and reduced inference error rates by {errorReduction}% through training on {datasetCount} corpora.
- **D (Concise):** Trained language models across {datasetCount} text corpora with {sampleCount}+ samples — {accuracyIncrease}% higher accuracy, {errorReduction}% lower error rates.

**Variables:**
  - `{datasetCount}`: 3 to 15, step 1 (integer)
  - `{sampleCount}`: 50000 to 2000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{errorReduction}`: 10 to 30, step 5 (percentage)

### AIML-0018
**Role:** research-scientist | **Theme:** computer-vision | **Seniority:** mid | **Verb Context:** systems
**Keywords:** computer vision, image models, object detection, vision pipelines, deep learning

**Scope:** vision models across {datasetCount} annotated image datasets containing {imageCount}+ labeled images
**Result:** improving detection accuracy by {accuracyIncrease}% and reducing false positive rates by {falsePositiveReduction}%

**Variations:**
- **A (Standard):** Developed vision models across {datasetCount} annotated image datasets containing {imageCount}+ labeled images, improving detection accuracy by {accuracyIncrease}% and reducing false positive rates by {falsePositiveReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher detection accuracy and {falsePositiveReduction}% lower false positive rates by developing vision models across {datasetCount} image datasets.
- **C (Impact-led):** Delivered stronger computer vision performance — improved detection accuracy by {accuracyIncrease}% and reduced false positive rates by {falsePositiveReduction}% through development across {datasetCount} datasets.
- **D (Concise):** Developed vision models across {datasetCount} image datasets with {imageCount}+ labeled images — {accuracyIncrease}% higher accuracy, {falsePositiveReduction}% lower false positives.

**Variables:**
  - `{datasetCount}`: 3 to 12, step 1 (integer)
  - `{imageCount}`: 50000 to 1000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{falsePositiveReduction}`: 10 to 30, step 5 (percentage)

### AIML-0019
**Role:** data-scientist | **Theme:** forecasting-models | **Seniority:** mid | **Verb Context:** systems
**Keywords:** forecasting, time series, predictive analytics, demand prediction, forecast accuracy

**Scope:** forecasting scenarios across {seriesCount} time-series streams covering {regionCount} business segments
**Result:** improving forecast accuracy by {accuracyIncrease}% and reducing planning variance by {varianceReduction}%

**Variations:**
- **A (Standard):** Modeled forecasting scenarios across {seriesCount} time-series streams covering {regionCount} business segments, improving forecast accuracy by {accuracyIncrease}% and reducing planning variance by {varianceReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher forecast accuracy and {varianceReduction}% lower planning variance by modeling {seriesCount} time-series streams across {regionCount} segments.
- **C (Impact-led):** Delivered more reliable forecasting — improved forecast accuracy by {accuracyIncrease}% and reduced planning variance by {varianceReduction}% through modeling of {seriesCount} time-series streams.
- **D (Concise):** Modeled {seriesCount} time-series streams across {regionCount} segments — {accuracyIncrease}% higher accuracy, {varianceReduction}% lower variance.

**Variables:**
  - `{seriesCount}`: 20 to 200, step 10 (integer)
  - `{regionCount}`: 2 to 20, step 2 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{varianceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0020
**Role:** mlops-engineer | **Theme:** feature-stores | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature store, ML infrastructure, training-serving consistency, feature management, MLOps

**Scope:** feature access patterns across {featureSetCount} reusable feature groups supporting {modelCount} models
**Result:** improving training-serving consistency by {consistencyIncrease}% and reducing duplicated feature logic by {duplicationReduction}%

**Variations:**
- **A (Standard):** Standardized feature access patterns across {featureSetCount} reusable feature groups supporting {modelCount} models, improving training-serving consistency by {consistencyIncrease}% and reducing duplicated feature logic by {duplicationReduction}%.
- **B (Result-first):** Achieved {consistencyIncrease}% higher training-serving consistency and {duplicationReduction}% lower duplicated feature logic by standardizing {featureSetCount} reusable feature groups.
- **C (Impact-led):** Delivered cleaner ML infrastructure — improved training-serving consistency by {consistencyIncrease}% and reduced duplicated feature logic by {duplicationReduction}% through standardization of {featureSetCount} feature groups.
- **D (Concise):** Standardized access across {featureSetCount} reusable feature groups for {modelCount} models — {consistencyIncrease}% higher consistency, {duplicationReduction}% lower duplication.

**Variables:**
  - `{featureSetCount}`: 10 to 60, step 5 (integer)
  - `{modelCount}`: 3 to 20, step 1 (integer)
  - `{consistencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{duplicationReduction}`: 10 to 30, step 5 (percentage)

### AIML-0021
**Role:** machine-learning-engineer | **Theme:** recommendation-systems | **Seniority:** mid | **Verb Context:** systems
**Keywords:** recommendation systems, ranking models, personalization, user relevance, ML ranking

**Scope:** recommendation relevance across {surfaceCount} product surfaces serving {userCount}+ active users
**Result:** increasing recommendation engagement by {engagementIncrease}% and reducing low-relevance impressions by {irrelevanceReduction}%

**Variations:**
- **A (Standard):** Improved recommendation relevance across {surfaceCount} product surfaces serving {userCount}+ active users, increasing recommendation engagement by {engagementIncrease}% and reducing low-relevance impressions by {irrelevanceReduction}%.
- **B (Result-first):** Achieved {engagementIncrease}% higher recommendation engagement and {irrelevanceReduction}% lower low-relevance impressions by improving ranking relevance across {surfaceCount} surfaces.
- **C (Impact-led):** Delivered stronger personalization performance — increased recommendation engagement by {engagementIncrease}% and reduced low-relevance impressions by {irrelevanceReduction}% across {surfaceCount} surfaces.
- **D (Concise):** Improved recommendation relevance across {surfaceCount} surfaces serving {userCount}+ users — {engagementIncrease}% higher engagement, {irrelevanceReduction}% lower irrelevance.

**Variables:**
  - `{surfaceCount}`: 2 to 12, step 1 (integer)
  - `{userCount}`: 50000 to 1000000, step 50000 (integer)
  - `{engagementIncrease}`: 15 to 35, step 5 (percentage)
  - `{irrelevanceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0022
**Role:** data-scientist | **Theme:** customer-segmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** customer segmentation, clustering, behavior analysis, targeting, data science

**Scope:** customer behavior patterns across {segmentCount} data-driven segments covering {userCount}+ users
**Result:** improving targeting precision by {precisionIncrease}% and reducing broad-message inefficiency by {inefficiencyReduction}%

**Variations:**
- **A (Standard):** Clustered customer behavior patterns across {segmentCount} data-driven segments covering {userCount}+ users, improving targeting precision by {precisionIncrease}% and reducing broad-message inefficiency by {inefficiencyReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher targeting precision and {inefficiencyReduction}% lower broad-message inefficiency by clustering {userCount}+ users into {segmentCount} data-driven segments.
- **C (Impact-led):** Delivered sharper audience targeting — improved precision by {precisionIncrease}% and reduced broad-message inefficiency by {inefficiencyReduction}% through segmentation of {userCount}+ users.
- **D (Concise):** Clustered {userCount}+ users into {segmentCount} data-driven segments — {precisionIncrease}% higher precision, {inefficiencyReduction}% lower inefficiency.

**Variables:**
  - `{segmentCount}`: 4 to 20, step 2 (integer)
  - `{userCount}`: 50000 to 500000, step 50000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{inefficiencyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0023
**Role:** research-scientist | **Theme:** llm-evaluation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** LLM evaluation, language models, benchmarking, prompt testing, model quality

**Scope:** large language model quality across {benchmarkCount} evaluation suites covering {taskCount} task categories
**Result:** improving model comparison clarity by {clarityIncrease}% and reducing benchmark ambiguity by {ambiguityReduction}%

**Variations:**
- **A (Standard):** Benchmarked large language model quality across {benchmarkCount} evaluation suites covering {taskCount} task categories, improving model comparison clarity by {clarityIncrease}% and reducing benchmark ambiguity by {ambiguityReduction}%.
- **B (Result-first):** Achieved {clarityIncrease}% higher model comparison clarity and {ambiguityReduction}% lower benchmark ambiguity by benchmarking across {benchmarkCount} evaluation suites and {taskCount} task categories.
- **C (Impact-led):** Delivered clearer LLM evaluation insight — improved comparison clarity by {clarityIncrease}% and reduced benchmark ambiguity by {ambiguityReduction}% through benchmarking across {benchmarkCount} suites.
- **D (Concise):** Benchmarked LLM quality across {benchmarkCount} suites and {taskCount} task categories — {clarityIncrease}% higher clarity, {ambiguityReduction}% lower ambiguity.

**Variables:**
  - `{benchmarkCount}`: 5 to 25, step 5 (integer)
  - `{taskCount}`: 5 to 30, step 5 (integer)
  - `{clarityIncrease}`: 15 to 35, step 5 (percentage)
  - `{ambiguityReduction}`: 10 to 30, step 5 (percentage)

### AIML-0024
**Role:** machine-learning-engineer | **Theme:** real-time-inference | **Seniority:** mid | **Verb Context:** systems
**Keywords:** real-time inference, low-latency ML, serving systems, prediction APIs, ML infrastructure

**Scope:** inference latency across {endpointCount} prediction endpoints serving {requestCount}+ requests per day
**Result:** reducing model response latency by {latencyReduction}% and improving throughput stability by {stabilityIncrease}%

**Variations:**
- **A (Standard):** Optimized inference latency across {endpointCount} prediction endpoints serving {requestCount}+ requests per day, reducing model response latency by {latencyReduction}% and improving throughput stability by {stabilityIncrease}%.
- **B (Result-first):** Achieved {latencyReduction}% lower model response latency and {stabilityIncrease}% higher throughput stability by optimizing {endpointCount} prediction endpoints serving {requestCount}+ daily requests.
- **C (Impact-led):** Delivered faster production inference — reduced response latency by {latencyReduction}% and improved throughput stability by {stabilityIncrease}% across {endpointCount} endpoints.
- **D (Concise):** Optimized latency across {endpointCount} prediction endpoints serving {requestCount}+ daily requests — {latencyReduction}% lower latency, {stabilityIncrease}% higher stability.

**Variables:**
  - `{endpointCount}`: 2 to 12, step 1 (integer)
  - `{requestCount}`: 50000 to 2000000, step 50000 (integer)
  - `{latencyReduction}`: 15 to 35, step 5 (percentage)
  - `{stabilityIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0025
**Role:** mlops-engineer | **Theme:** experiment-tracking | **Seniority:** mid | **Verb Context:** systems
**Keywords:** experiment tracking, ML experiments, reproducibility, run metadata, MLOps

**Scope:** experiment records across {runCount} model runs involving {teamCount} ML teams
**Result:** improving run traceability by {traceabilityIncrease}% and reducing duplicated experiment effort by {duplicationReduction}%

**Variations:**
- **A (Standard):** Centralized experiment records across {runCount} model runs involving {teamCount} ML teams, improving run traceability by {traceabilityIncrease}% and reducing duplicated experiment effort by {duplicationReduction}%.
- **B (Result-first):** Achieved {traceabilityIncrease}% higher run traceability and {duplicationReduction}% lower duplicated experiment effort by centralizing {runCount} model runs across {teamCount} ML teams.
- **C (Impact-led):** Delivered cleaner experimentation workflows — improved run traceability by {traceabilityIncrease}% and reduced duplicated effort by {duplicationReduction}% through centralization of {runCount} runs.
- **D (Concise):** Centralized records for {runCount} model runs across {teamCount} ML teams — {traceabilityIncrease}% higher traceability, {duplicationReduction}% lower duplication.

**Variables:**
  - `{runCount}`: 100 to 2000, step 100 (integer)
  - `{teamCount}`: 2 to 10, step 1 (integer)
  - `{traceabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{duplicationReduction}`: 10 to 30, step 5 (percentage)

### AIML-0026
**Role:** data-scientist | **Theme:** anomaly-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** anomaly detection, outlier detection, monitoring models, pattern analysis, ML analytics

**Scope:** abnormal behavior patterns across {streamCount} operational data streams covering {recordCount}+ events
**Result:** improving anomaly discovery speed by {speedIncrease}% and reducing missed abnormal events by {missReduction}%

**Variations:**
- **A (Standard):** Detected abnormal behavior patterns across {streamCount} operational data streams covering {recordCount}+ events, improving anomaly discovery speed by {speedIncrease}% and reducing missed abnormal events by {missReduction}%.
- **B (Result-first):** Achieved {speedIncrease}% faster anomaly discovery and {missReduction}% fewer missed abnormal events by detecting patterns across {streamCount} operational data streams.
- **C (Impact-led):** Delivered stronger anomaly monitoring — improved discovery speed by {speedIncrease}% and reduced missed abnormal events by {missReduction}% through analysis of {streamCount} data streams.
- **D (Concise):** Detected abnormal patterns across {streamCount} data streams covering {recordCount}+ events — {speedIncrease}% faster discovery, {missReduction}% fewer misses.

**Variables:**
  - `{streamCount}`: 5 to 30, step 5 (integer)
  - `{recordCount}`: 100000 to 10000000, step 100000 (integer)
  - `{speedIncrease}`: 15 to 35, step 5 (percentage)
  - `{missReduction}`: 10 to 30, step 5 (percentage)

### AIML-0027
**Role:** research-scientist | **Theme:** retrieval-systems | **Seniority:** senior | **Verb Context:** systems
**Keywords:** retrieval systems, semantic search, vector search, information retrieval, ranking

**Scope:** retrieval relevance across {indexCount} semantic indexes serving {queryCount}+ daily search queries
**Result:** improving top-result relevance by {relevanceIncrease}% and reducing low-match retrievals by {mismatchReduction}%

**Variations:**
- **A (Standard):** Enhanced retrieval relevance across {indexCount} semantic indexes serving {queryCount}+ daily search queries, improving top-result relevance by {relevanceIncrease}% and reducing low-match retrievals by {mismatchReduction}%.
- **B (Result-first):** Achieved {relevanceIncrease}% higher top-result relevance and {mismatchReduction}% lower low-match retrievals by enhancing {indexCount} semantic indexes serving {queryCount}+ daily queries.
- **C (Impact-led):** Delivered stronger retrieval quality — improved top-result relevance by {relevanceIncrease}% and reduced low-match retrievals by {mismatchReduction}% across {indexCount} semantic indexes.
- **D (Concise):** Enhanced retrieval relevance across {indexCount} semantic indexes serving {queryCount}+ daily queries — {relevanceIncrease}% higher relevance, {mismatchReduction}% lower mismatch.

**Variables:**
  - `{indexCount}`: 2 to 15, step 1 (integer)
  - `{queryCount}`: 10000 to 1000000, step 50000 (integer)
  - `{relevanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{mismatchReduction}`: 10 to 30, step 5 (percentage)

### AIML-0028
**Role:** machine-learning-engineer | **Theme:** prompt-routing | **Seniority:** mid | **Verb Context:** systems
**Keywords:** prompt routing, LLM orchestration, task routing, AI systems, model selection

**Scope:** prompt handling across {routeCount} task pathways serving {requestCount}+ AI requests per day
**Result:** improving task-model fit by {fitIncrease}% and reducing misrouted request volume by {misrouteReduction}%

**Variations:**
- **A (Standard):** Routed prompt handling across {routeCount} task pathways serving {requestCount}+ AI requests per day, improving task-model fit by {fitIncrease}% and reducing misrouted request volume by {misrouteReduction}%.
- **B (Result-first):** Achieved {fitIncrease}% higher task-model fit and {misrouteReduction}% lower misrouted request volume by routing prompts across {routeCount} task pathways.
- **C (Impact-led):** Delivered smarter AI orchestration — improved task-model fit by {fitIncrease}% and reduced misrouted request volume by {misrouteReduction}% through routing across {routeCount} pathways.
- **D (Concise):** Routed prompts across {routeCount} task pathways serving {requestCount}+ daily AI requests — {fitIncrease}% higher fit, {misrouteReduction}% lower misrouting.

**Variables:**
  - `{routeCount}`: 3 to 15, step 1 (integer)
  - `{requestCount}`: 10000 to 1000000, step 50000 (integer)
  - `{fitIncrease}`: 15 to 35, step 5 (percentage)
  - `{misrouteReduction}`: 10 to 30, step 5 (percentage)

### AIML-0029
**Role:** data-scientist | **Theme:** propensity-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** propensity modeling, prediction, user scoring, uplift analysis, behavior prediction

**Scope:** user propensity signals across {segmentCount} behavioral cohorts covering {userCount}+ users
**Result:** improving action-targeting precision by {precisionIncrease}% and reducing low-likelihood outreach by {outreachReduction}%

**Variations:**
- **A (Standard):** Scored user propensity signals across {segmentCount} behavioral cohorts covering {userCount}+ users, improving action-targeting precision by {precisionIncrease}% and reducing low-likelihood outreach by {outreachReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher action-targeting precision and {outreachReduction}% lower low-likelihood outreach by scoring {userCount}+ users across {segmentCount} cohorts.
- **C (Impact-led):** Delivered sharper predictive targeting — improved action-targeting precision by {precisionIncrease}% and reduced low-likelihood outreach by {outreachReduction}% through scoring across {segmentCount} cohorts.
- **D (Concise):** Scored user propensity across {segmentCount} cohorts covering {userCount}+ users — {precisionIncrease}% higher precision, {outreachReduction}% lower low-likelihood outreach.

**Variables:**
  - `{segmentCount}`: 4 to 20, step 2 (integer)
  - `{userCount}`: 50000 to 1000000, step 50000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{outreachReduction}`: 10 to 30, step 5 (percentage)

### AIML-0030
**Role:** mlops-engineer | **Theme:** data-drift-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data drift, drift detection, production ML, data quality, model monitoring

**Scope:** input data drift across {modelCount} production models processing {recordCount}+ daily records
**Result:** improving drift detection responsiveness by {responseIncrease}% and reducing silent data shifts by {shiftReduction}%

**Variations:**
- **A (Standard):** Flagged input data drift across {modelCount} production models processing {recordCount}+ daily records, improving drift detection responsiveness by {responseIncrease}% and reducing silent data shifts by {shiftReduction}%.
- **B (Result-first):** Achieved {responseIncrease}% higher drift detection responsiveness and {shiftReduction}% lower silent data shifts by flagging input drift across {modelCount} production models.
- **C (Impact-led):** Delivered stronger drift awareness — improved detection responsiveness by {responseIncrease}% and reduced silent data shifts by {shiftReduction}% through monitoring of {modelCount} production models.
- **D (Concise):** Flagged input drift across {modelCount} production models processing {recordCount}+ daily records — {responseIncrease}% higher responsiveness, {shiftReduction}% lower silent shifts.

**Variables:**
  - `{modelCount}`: 3 to 20, step 1 (integer)
  - `{recordCount}`: 100000 to 10000000, step 100000 (integer)
  - `{responseIncrease}`: 15 to 35, step 5 (percentage)
  - `{shiftReduction}`: 10 to 30, step 5 (percentage)

### AIML-0031
**Role:** research-scientist | **Theme:** fine-tuning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** fine-tuning, transfer learning, model adaptation, LLM tuning, task optimization

**Scope:** task-specific models across {taskCount} use cases using {sampleCount}+ supervised examples
**Result:** improving downstream task accuracy by {accuracyIncrease}% and reducing task failure cases by {failureReduction}%

**Variations:**
- **A (Standard):** Fine-tuned task-specific models across {taskCount} use cases using {sampleCount}+ supervised examples, improving downstream task accuracy by {accuracyIncrease}% and reducing task failure cases by {failureReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher downstream task accuracy and {failureReduction}% lower task failure cases by fine-tuning models across {taskCount} use cases with {sampleCount}+ examples.
- **C (Impact-led):** Delivered stronger task adaptation — improved downstream task accuracy by {accuracyIncrease}% and reduced task failure cases by {failureReduction}% through fine-tuning across {taskCount} use cases.
- **D (Concise):** Fine-tuned models across {taskCount} use cases with {sampleCount}+ examples — {accuracyIncrease}% higher accuracy, {failureReduction}% lower failure cases.

**Variables:**
  - `{taskCount}`: 3 to 15, step 1 (integer)
  - `{sampleCount}`: 10000 to 1000000, step 10000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{failureReduction}`: 10 to 30, step 5 (percentage)

### AIML-0032
**Role:** machine-learning-engineer | **Theme:** batch-inference | **Seniority:** mid | **Verb Context:** systems
**Keywords:** batch inference, offline scoring, prediction pipelines, ML processing, scalable inference

**Scope:** batch inference jobs across {jobCount} scoring workflows processing {recordCount}+ records per run
**Result:** reducing batch completion time by {timeReduction}% and improving scoring reliability by {reliabilityIncrease}%

**Variations:**
- **A (Standard):** Scaled batch inference jobs across {jobCount} scoring workflows processing {recordCount}+ records per run, reducing batch completion time by {timeReduction}% and improving scoring reliability by {reliabilityIncrease}%.
- **B (Result-first):** Achieved {timeReduction}% lower batch completion time and {reliabilityIncrease}% higher scoring reliability by scaling {jobCount} scoring workflows processing {recordCount}+ records per run.
- **C (Impact-led):** Delivered more efficient offline scoring — reduced batch completion time by {timeReduction}% and improved scoring reliability by {reliabilityIncrease}% across {jobCount} workflows.
- **D (Concise):** Scaled {jobCount} batch scoring workflows processing {recordCount}+ records per run — {timeReduction}% lower completion time, {reliabilityIncrease}% higher reliability.

**Variables:**
  - `{jobCount}`: 3 to 20, step 1 (integer)
  - `{recordCount}`: 100000 to 50000000, step 100000 (integer)
  - `{timeReduction}`: 15 to 35, step 5 (percentage)
  - `{reliabilityIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0033
**Role:** data-scientist | **Theme:** uplift-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** uplift modeling, causal modeling, treatment effect, decision science, incrementality

**Scope:** incremental treatment effects across {campaignCount} intervention scenarios involving {userCount}+ users
**Result:** improving intervention targeting quality by {qualityIncrease}% and reducing wasted treatment exposure by {wasteReduction}%

**Variations:**
- **A (Standard):** Estimated incremental treatment effects across {campaignCount} intervention scenarios involving {userCount}+ users, improving intervention targeting quality by {qualityIncrease}% and reducing wasted treatment exposure by {wasteReduction}%.
- **B (Result-first):** Achieved {qualityIncrease}% higher intervention targeting quality and {wasteReduction}% lower wasted treatment exposure by estimating effects across {campaignCount} intervention scenarios.
- **C (Impact-led):** Delivered more efficient intervention targeting — improved quality by {qualityIncrease}% and reduced wasted exposure by {wasteReduction}% through estimation across {campaignCount} scenarios.
- **D (Concise):** Estimated treatment effects across {campaignCount} intervention scenarios involving {userCount}+ users — {qualityIncrease}% higher targeting quality, {wasteReduction}% lower waste.

**Variables:**
  - `{campaignCount}`: 4 to 20, step 2 (integer)
  - `{userCount}`: 50000 to 1000000, step 50000 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{wasteReduction}`: 10 to 30, step 5 (percentage)

### AIML-0034
**Role:** mlops-engineer | **Theme:** model-registry | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model registry, versioning, ML governance, deployment tracking, MLOps

**Scope:** model versions across {modelCount} deployable artifacts used by {teamCount} ML teams
**Result:** improving version traceability by {traceabilityIncrease}% and reducing deployment confusion by {confusionReduction}%

**Variations:**
- **A (Standard):** Cataloged model versions across {modelCount} deployable artifacts used by {teamCount} ML teams, improving version traceability by {traceabilityIncrease}% and reducing deployment confusion by {confusionReduction}%.
- **B (Result-first):** Achieved {traceabilityIncrease}% higher version traceability and {confusionReduction}% lower deployment confusion by cataloging {modelCount} deployable artifacts for {teamCount} ML teams.
- **C (Impact-led):** Delivered cleaner ML governance — improved version traceability by {traceabilityIncrease}% and reduced deployment confusion by {confusionReduction}% through cataloging of {modelCount} artifacts.
- **D (Concise):** Cataloged {modelCount} deployable artifacts for {teamCount} ML teams — {traceabilityIncrease}% higher traceability, {confusionReduction}% lower confusion.

**Variables:**
  - `{modelCount}`: 10 to 100, step 5 (integer)
  - `{teamCount}`: 2 to 10, step 1 (integer)
  - `{traceabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{confusionReduction}`: 10 to 30, step 5 (percentage)

### AIML-0035
**Role:** research-scientist | **Theme:** embedding-models | **Seniority:** mid | **Verb Context:** systems
**Keywords:** embeddings, representation learning, semantic vectors, retrieval, model quality

**Scope:** semantic representations across {corpusCount} corpora containing {sampleCount}+ items
**Result:** improving nearest-neighbor relevance by {relevanceIncrease}% and reducing weak semantic matches by {mismatchReduction}%

**Variations:**
- **A (Standard):** Learned semantic representations across {corpusCount} corpora containing {sampleCount}+ items, improving nearest-neighbor relevance by {relevanceIncrease}% and reducing weak semantic matches by {mismatchReduction}%.
- **B (Result-first):** Achieved {relevanceIncrease}% higher nearest-neighbor relevance and {mismatchReduction}% lower weak semantic matches by learning embeddings across {corpusCount} corpora with {sampleCount}+ items.
- **C (Impact-led):** Delivered stronger semantic retrieval foundations — improved nearest-neighbor relevance by {relevanceIncrease}% and reduced weak matches by {mismatchReduction}% through representation learning across {corpusCount} corpora.
- **D (Concise):** Learned embeddings across {corpusCount} corpora with {sampleCount}+ items — {relevanceIncrease}% higher relevance, {mismatchReduction}% lower weak matches.

**Variables:**
  - `{corpusCount}`: 3 to 15, step 1 (integer)
  - `{sampleCount}`: 50000 to 5000000, step 50000 (integer)
  - `{relevanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{mismatchReduction}`: 10 to 30, step 5 (percentage)

### AIML-0036
**Role:** machine-learning-engineer | **Theme:** classification-systems | **Seniority:** mid | **Verb Context:** systems
**Keywords:** classification, supervised learning, model systems, prediction, ML performance

**Scope:** classification pipelines across {classCount} output categories covering {sampleCount}+ labeled examples
**Result:** improving classification precision by {precisionIncrease}% and reducing misclassification rates by {misclassificationReduction}%

**Variations:**
- **A (Standard):** Implemented classification pipelines across {classCount} output categories covering {sampleCount}+ labeled examples, improving classification precision by {precisionIncrease}% and reducing misclassification rates by {misclassificationReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher classification precision and {misclassificationReduction}% lower misclassification rates by implementing pipelines across {classCount} output categories.
- **C (Impact-led):** Delivered stronger supervised learning performance — improved classification precision by {precisionIncrease}% and reduced misclassification rates by {misclassificationReduction}% through implementation across {classCount} categories.
- **D (Concise):** Implemented classification pipelines across {classCount} categories with {sampleCount}+ labeled examples — {precisionIncrease}% higher precision, {misclassificationReduction}% lower misclassification.

**Variables:**
  - `{classCount}`: 3 to 25, step 2 (integer)
  - `{sampleCount}`: 50000 to 5000000, step 50000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{misclassificationReduction}`: 10 to 30, step 5 (percentage)

### AIML-0037
**Role:** data-scientist | **Theme:** demand-scoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** demand scoring, predictive ranking, propensity, lead scoring, data science

**Scope:** demand likelihood across {segmentCount} customer segments covering {entityCount}+ opportunities
**Result:** improving prioritization precision by {precisionIncrease}% and reducing low-conversion pursuit by {pursuitReduction}%

**Variations:**
- **A (Standard):** Ranked demand likelihood across {segmentCount} customer segments covering {entityCount}+ opportunities, improving prioritization precision by {precisionIncrease}% and reducing low-conversion pursuit by {pursuitReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher prioritization precision and {pursuitReduction}% lower low-conversion pursuit by ranking demand likelihood across {segmentCount} customer segments.
- **C (Impact-led):** Delivered sharper opportunity prioritization — improved precision by {precisionIncrease}% and reduced low-conversion pursuit by {pursuitReduction}% through ranking across {segmentCount} segments.
- **D (Concise):** Ranked demand likelihood across {segmentCount} customer segments covering {entityCount}+ opportunities — {precisionIncrease}% higher precision, {pursuitReduction}% lower low-conversion pursuit.

**Variables:**
  - `{segmentCount}`: 4 to 20, step 2 (integer)
  - `{entityCount}`: 10000 to 1000000, step 10000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{pursuitReduction}`: 10 to 30, step 5 (percentage)

### AIML-0038
**Role:** mlops-engineer | **Theme:** pipeline-orchestration | **Seniority:** mid | **Verb Context:** systems
**Keywords:** pipeline orchestration, workflow automation, MLOps, job scheduling, ML pipelines

**Scope:** ML workflow execution across {workflowCount} scheduled pipelines processing {jobCount}+ recurring jobs
**Result:** reducing pipeline failure recovery time by {recoveryReduction}% and improving workflow completion reliability by {reliabilityIncrease}%

**Variations:**
- **A (Standard):** Orchestrated ML workflow execution across {workflowCount} scheduled pipelines processing {jobCount}+ recurring jobs, reducing pipeline failure recovery time by {recoveryReduction}% and improving workflow completion reliability by {reliabilityIncrease}%.
- **B (Result-first):** Achieved {recoveryReduction}% lower pipeline failure recovery time and {reliabilityIncrease}% higher workflow completion reliability by orchestrating {workflowCount} scheduled pipelines.
- **C (Impact-led):** Delivered more dependable ML operations — reduced pipeline recovery time by {recoveryReduction}% and improved workflow completion reliability by {reliabilityIncrease}% through orchestration of {workflowCount} pipelines.
- **D (Concise):** Orchestrated {workflowCount} scheduled pipelines processing {jobCount}+ recurring jobs — {recoveryReduction}% lower recovery time, {reliabilityIncrease}% higher reliability.

**Variables:**
  - `{workflowCount}`: 5 to 30, step 5 (integer)
  - `{jobCount}`: 50 to 2000, step 50 (integer)
  - `{recoveryReduction}`: 15 to 35, step 5 (percentage)
  - `{reliabilityIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0039
**Role:** research-scientist | **Theme:** multimodal-models | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multimodal models, vision-language, cross-modal learning, AI research, representation learning

**Scope:** cross-modal learning pipelines across {modalityCount} data modalities using {sampleCount}+ aligned examples
**Result:** improving cross-modal retrieval quality by {qualityIncrease}% and reducing modality mismatch errors by {mismatchReduction}%

**Variations:**
- **A (Standard):** Integrated cross-modal learning pipelines across {modalityCount} data modalities using {sampleCount}+ aligned examples, improving cross-modal retrieval quality by {qualityIncrease}% and reducing modality mismatch errors by {mismatchReduction}%.
- **B (Result-first):** Achieved {qualityIncrease}% higher cross-modal retrieval quality and {mismatchReduction}% lower modality mismatch errors by integrating {modalityCount} data modalities with {sampleCount}+ aligned examples.
- **C (Impact-led):** Delivered stronger multimodal AI performance — improved cross-modal retrieval quality by {qualityIncrease}% and reduced modality mismatch errors by {mismatchReduction}% through integration across {modalityCount} modalities.
- **D (Concise):** Integrated cross-modal learning across {modalityCount} modalities using {sampleCount}+ aligned examples — {qualityIncrease}% higher quality, {mismatchReduction}% lower mismatch.

**Variables:**
  - `{modalityCount}`: 2 to 5, step 1 (integer)
  - `{sampleCount}`: 10000 to 1000000, step 10000 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{mismatchReduction}`: 10 to 30, step 5 (percentage)

### AIML-0040
**Role:** machine-learning-engineer | **Theme:** model-compression | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model compression, quantization, distillation, efficient inference, ML optimization

**Scope:** deployable models across {modelCount} inference workloads serving {requestCount}+ daily requests
**Result:** reducing model footprint by {footprintReduction}% and improving inference efficiency by {efficiencyIncrease}%

**Variations:**
- **A (Standard):** Compressed deployable models across {modelCount} inference workloads serving {requestCount}+ daily requests, reducing model footprint by {footprintReduction}% and improving inference efficiency by {efficiencyIncrease}%.
- **B (Result-first):** Achieved {footprintReduction}% lower model footprint and {efficiencyIncrease}% higher inference efficiency by compressing {modelCount} deployable models serving {requestCount}+ daily requests.
- **C (Impact-led):** Delivered more efficient ML serving — reduced model footprint by {footprintReduction}% and improved inference efficiency by {efficiencyIncrease}% through compression of {modelCount} deployable models.
- **D (Concise):** Compressed {modelCount} deployable models serving {requestCount}+ daily requests — {footprintReduction}% lower footprint, {efficiencyIncrease}% higher efficiency.

**Variables:**
  - `{modelCount}`: 3 to 20, step 1 (integer)
  - `{requestCount}`: 50000 to 2000000, step 50000 (integer)
  - `{footprintReduction}`: 15 to 35, step 5 (percentage)
  - `{efficiencyIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0041
**Role:** machine-learning-engineer | **Theme:** reinforcement-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** RL agents, policy gradients, PPO, reward optimization, Markov decision process

**Scope:** reinforcement learning agents across {countA} simulated environments spanning {countB}K state dimensions
**Result:** improving task completion rate by {metricA}% and reducing agent exploration time by {metricB}%

**Variations:**
- **A (Standard):** Engineered reinforcement learning agents across {countA} simulated environments spanning {countB}K state dimensions, improving task completion rate by {metricA}% and reducing agent exploration time by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering reinforcement learning agents across {countA} simulated environments spanning {countB}K state dimensions.
- **C (Impact-led):** Delivered robust ML systems — improving task completion rate by {metricA}% and reducing agent exploration time by {metricB}% through implementation across {countA} simulated environments spanning {countB}K state dimensions.
- **D (Concise):** Engineered reinforcement learning agents across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0042
**Role:** data-scientist | **Theme:** generative-adversarial-networks | **Seniority:** mid | **Verb Context:** systems
**Keywords:** GANs, image generation, synthetic data, discriminator, generator

**Scope:** generative models across {countA} high-resolution image domains producing {countB}K synthetic samples
**Result:** improving generation fidelity by {metricA}% and reducing mode collapse occurrences by {metricB}%

**Variations:**
- **A (Standard):** Developed generative models across {countA} high-resolution image domains producing {countB}K synthetic samples, improving generation fidelity by {metricA}% and reducing mode collapse occurrences by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering generative models across {countA} high-resolution image domains producing {countB}K synthetic samples.
- **C (Impact-led):** Delivered robust ML systems — improving generation fidelity by {metricA}% and reducing mode collapse occurrences by {metricB}% through implementation across {countA} high-resolution image domains producing {countB}K synthetic samples.
- **D (Concise):** Developed generative models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0043
**Role:** research-scientist | **Theme:** federated-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** federated data, privacy-preserving ML, decentralized training, edge AI, secure aggregation

**Scope:** federated training protocols across {countA} decentralized geographic nodes covering {countB}K client devices
**Result:** improving global model convergence by {metricA}% and reducing central data storage requirements by {metricB}%

**Variations:**
- **A (Standard):** Optimized federated training protocols across {countA} decentralized geographic nodes covering {countB}K client devices, improving global model convergence by {metricA}% and reducing central data storage requirements by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering federated training protocols across {countA} decentralized geographic nodes covering {countB}K client devices.
- **C (Impact-led):** Delivered robust ML systems — improving global model convergence by {metricA}% and reducing central data storage requirements by {metricB}% through implementation across {countA} decentralized geographic nodes covering {countB}K client devices.
- **D (Concise):** Optimized federated training protocols across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0044
**Role:** machine-learning-engineer | **Theme:** automated-machine-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** AutoML, NAS, hyperparameter search, model selection, pipeline automation

**Scope:** AutoML pipelines across {countA} distinct business use cases analyzing {countB}+ algorithm configurations
**Result:** improving model selection speed by {metricA}% and reducing manual tuning effort by {metricB}%

**Variations:**
- **A (Standard):** Designed AutoML pipelines across {countA} distinct business use cases analyzing {countB}+ algorithm configurations, improving model selection speed by {metricA}% and reducing manual tuning effort by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering AutoML pipelines across {countA} distinct business use cases analyzing {countB}+ algorithm configurations.
- **C (Impact-led):** Delivered robust ML systems — improving model selection speed by {metricA}% and reducing manual tuning effort by {metricB}% through implementation across {countA} distinct business use cases analyzing {countB}+ algorithm configurations.
- **D (Concise):** Designed AutoML pipelines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0045
**Role:** data-scientist | **Theme:** graph-neural-networks | **Seniority:** senior | **Verb Context:** systems
**Keywords:** GNN, graph structures, node embeddings, link prediction, DeepWalk

**Scope:** graph embedding networks across {countA} complex relationship graphs containing {countB}M interconnected nodes
**Result:** improving link prediction accuracy by {metricA}% and reducing false positive anomaly flags by {metricB}%

**Variations:**
- **A (Standard):** Architected graph embedding networks across {countA} complex relationship graphs containing {countB}M interconnected nodes, improving link prediction accuracy by {metricA}% and reducing false positive anomaly flags by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering graph embedding networks across {countA} complex relationship graphs containing {countB}M interconnected nodes.
- **C (Impact-led):** Delivered robust ML systems — improving link prediction accuracy by {metricA}% and reducing false positive anomaly flags by {metricB}% through implementation across {countA} complex relationship graphs containing {countB}M interconnected nodes.
- **D (Concise):** Architected graph embedding networks across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0046
**Role:** research-scientist | **Theme:** speech-recognition | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ASR, audio processing, speech-to-text, Wav2Vec, acoustic modeling

**Scope:** speech-to-text acoustic models across {countA} distinct dialects parsing {countB}K hours of audio data
**Result:** improving word error rate (WER) by {metricA}% and reducing background noise interference by {metricB}%

**Variations:**
- **A (Standard):** Engineered speech-to-text acoustic models across {countA} distinct dialects parsing {countB}K hours of audio data, improving word error rate (WER) by {metricA}% and reducing background noise interference by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering speech-to-text acoustic models across {countA} distinct dialects parsing {countB}K hours of audio data.
- **C (Impact-led):** Delivered robust ML systems — improving word error rate (WER) by {metricA}% and reducing background noise interference by {metricB}% through implementation across {countA} distinct dialects parsing {countB}K hours of audio data.
- **D (Concise):** Engineered speech-to-text acoustic models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0047
**Role:** machine-learning-engineer | **Theme:** text-to-speech | **Seniority:** mid | **Verb Context:** systems
**Keywords:** TTS, voice synthesis, Tacotron, audio generation, speech modeling

**Scope:** neural voice synthesis engines across {countA} brand personas supporting {countB}+ unique acoustic parameters
**Result:** improving synthetic naturalness scores by {metricA}% and reducing audio generation latency by {metricB}%

**Variations:**
- **A (Standard):** Developed neural voice synthesis engines across {countA} brand personas supporting {countB}+ unique acoustic parameters, improving synthetic naturalness scores by {metricA}% and reducing audio generation latency by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering neural voice synthesis engines across {countA} brand personas supporting {countB}+ unique acoustic parameters.
- **C (Impact-led):** Delivered robust ML systems — improving synthetic naturalness scores by {metricA}% and reducing audio generation latency by {metricB}% through implementation across {countA} brand personas supporting {countB}+ unique acoustic parameters.
- **D (Concise):** Developed neural voice synthesis engines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0048
**Role:** data-scientist | **Theme:** churn-prediction | **Seniority:** mid | **Verb Context:** systems
**Keywords:** customer churn, survival analysis, retention modeling, risk scoring, ML analytics

**Scope:** survival analysis models across {countA} subscriber cohorts tracking {countB}K at-risk user accounts
**Result:** improving churn prediction accuracy by {metricA}% and reducing unexpected subscriber attrition by {metricB}%

**Variations:**
- **A (Standard):** Optimized survival analysis models across {countA} subscriber cohorts tracking {countB}K at-risk user accounts, improving churn prediction accuracy by {metricA}% and reducing unexpected subscriber attrition by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering survival analysis models across {countA} subscriber cohorts tracking {countB}K at-risk user accounts.
- **C (Impact-led):** Delivered robust ML systems — improving churn prediction accuracy by {metricA}% and reducing unexpected subscriber attrition by {metricB}% through implementation across {countA} subscriber cohorts tracking {countB}K at-risk user accounts.
- **D (Concise):** Optimized survival analysis models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0049
**Role:** research-scientist | **Theme:** customer-lifetime-value | **Seniority:** senior | **Verb Context:** systems
**Keywords:** CLV, LTV estimation, revenue forecasting, predictive analytics, user monetization

**Scope:** revenue projection models across {countA} acquisition channels forecasting {countB}K active customer profiles
**Result:** improving LTV estimation accuracy by {metricA}% and reducing marketing spend wastage by {metricB}%

**Variations:**
- **A (Standard):** Designed revenue projection models across {countA} acquisition channels forecasting {countB}K active customer profiles, improving LTV estimation accuracy by {metricA}% and reducing marketing spend wastage by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering revenue projection models across {countA} acquisition channels forecasting {countB}K active customer profiles.
- **C (Impact-led):** Delivered robust ML systems — improving LTV estimation accuracy by {metricA}% and reducing marketing spend wastage by {metricB}% through implementation across {countA} acquisition channels forecasting {countB}K active customer profiles.
- **D (Concise):** Designed revenue projection models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0050
**Role:** machine-learning-engineer | **Theme:** fraud-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** anomaly detection, transaction fraud, financial ML, risk modeling, outlier detection

**Scope:** transaction risk models across {countA} payment gateways processing {countB}M financial interactions daily
**Result:** improving fraudulent transaction hold rates by {metricA}% and reducing false positive blockings by {metricB}%

**Variations:**
- **A (Standard):** Architected transaction risk models across {countA} payment gateways processing {countB}M financial interactions daily, improving fraudulent transaction hold rates by {metricA}% and reducing false positive blockings by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering transaction risk models across {countA} payment gateways processing {countB}M financial interactions daily.
- **C (Impact-led):** Delivered robust ML systems — improving fraudulent transaction hold rates by {metricA}% and reducing false positive blockings by {metricB}% through implementation across {countA} payment gateways processing {countB}M financial interactions daily.
- **D (Concise):** Architected transaction risk models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0051
**Role:** data-scientist | **Theme:** predictive-maintenance | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sensor data, IoT machinery, failure prediction, time series monitoring, industrial AI

**Scope:** equipment failure models across {countA} industrial facilities monitoring {countB}K IoT sensor streams
**Result:** improving proactive maintenance scheduling by {metricA}% and reducing unplanned machine downtime by {metricB}%

**Variations:**
- **A (Standard):** Engineered equipment failure models across {countA} industrial facilities monitoring {countB}K IoT sensor streams, improving proactive maintenance scheduling by {metricA}% and reducing unplanned machine downtime by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering equipment failure models across {countA} industrial facilities monitoring {countB}K IoT sensor streams.
- **C (Impact-led):** Delivered robust ML systems — improving proactive maintenance scheduling by {metricA}% and reducing unplanned machine downtime by {metricB}% through implementation across {countA} industrial facilities monitoring {countB}K IoT sensor streams.
- **D (Concise):** Engineered equipment failure models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0052
**Role:** research-scientist | **Theme:** edge-ai-deployment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** edge computing, tinyML, IoT inference, mobile ML, on-device ML

**Scope:** on-device inference engines across {countA} mobile platforms supporting {countB}K daily offline predictions
**Result:** improving local processing speeds by {metricA}% and reducing cloud server dependency by {metricB}%

**Variations:**
- **A (Standard):** Developed on-device inference engines across {countA} mobile platforms supporting {countB}K daily offline predictions, improving local processing speeds by {metricA}% and reducing cloud server dependency by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering on-device inference engines across {countA} mobile platforms supporting {countB}K daily offline predictions.
- **C (Impact-led):** Delivered robust ML systems — improving local processing speeds by {metricA}% and reducing cloud server dependency by {metricB}% through implementation across {countA} mobile platforms supporting {countB}K daily offline predictions.
- **D (Concise):** Developed on-device inference engines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0053
**Role:** machine-learning-engineer | **Theme:** active-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** active learning, human-in-the-loop, sample selection, query strategies

**Scope:** human-in-the-loop sampling strategies across {countA} annotation queues filtering {countB}K unlabeled instances
**Result:** improving model convergence speed by {metricA}% and reducing manual labeling costs by {metricB}%

**Variations:**
- **A (Standard):** Optimized human-in-the-loop sampling strategies across {countA} annotation queues filtering {countB}K unlabeled instances, improving model convergence speed by {metricA}% and reducing manual labeling costs by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering human-in-the-loop sampling strategies across {countA} annotation queues filtering {countB}K unlabeled instances.
- **C (Impact-led):** Delivered robust ML systems — improving model convergence speed by {metricA}% and reducing manual labeling costs by {metricB}% through implementation across {countA} annotation queues filtering {countB}K unlabeled instances.
- **D (Concise):** Optimized human-in-the-loop sampling strategies across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0054
**Role:** data-scientist | **Theme:** synthetic-data-generation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data augmentation, synthetic populations, privacy-safe data, simulation, SMOTE

**Scope:** data augmentation frameworks across {countA} imbalanced datasets generating {countB}K synthetic minor-class examples
**Result:** improving minority class recall by {metricA}% and reducing dataset bias indicators by {metricB}%

**Variations:**
- **A (Standard):** Designed data augmentation frameworks across {countA} imbalanced datasets generating {countB}K synthetic minor-class examples, improving minority class recall by {metricA}% and reducing dataset bias indicators by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering data augmentation frameworks across {countA} imbalanced datasets generating {countB}K synthetic minor-class examples.
- **C (Impact-led):** Delivered robust ML systems — improving minority class recall by {metricA}% and reducing dataset bias indicators by {metricB}% through implementation across {countA} imbalanced datasets generating {countB}K synthetic minor-class examples.
- **D (Concise):** Designed data augmentation frameworks across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0055
**Role:** research-scientist | **Theme:** natural-language-generation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** NLG, text generation, reporting automation, content creation, language modeling

**Scope:** conditional text generators across {countA} content categories producing {countB}K automated daily reports
**Result:** improving generation coherence by {metricA}% and reducing manual copywriting hours by {metricB}%

**Variations:**
- **A (Standard):** Architected conditional text generators across {countA} content categories producing {countB}K automated daily reports, improving generation coherence by {metricA}% and reducing manual copywriting hours by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering conditional text generators across {countA} content categories producing {countB}K automated daily reports.
- **C (Impact-led):** Delivered robust ML systems — improving generation coherence by {metricA}% and reducing manual copywriting hours by {metricB}% through implementation across {countA} content categories producing {countB}K automated daily reports.
- **D (Concise):** Architected conditional text generators across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0056
**Role:** machine-learning-engineer | **Theme:** hyperparameter-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** HPO, Bayesian optimization, Optuna, grid search, model tuning

**Scope:** Bayesian optimization strategies across {countA} model architectures executing {countB}K concurrent tuning trials
**Result:** improving final model validation scores by {metricA}% and reducing hyperparameter search times by {metricB}%

**Variations:**
- **A (Standard):** Engineered Bayesian optimization strategies across {countA} model architectures executing {countB}K concurrent tuning trials, improving final model validation scores by {metricA}% and reducing hyperparameter search times by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering Bayesian optimization strategies across {countA} model architectures executing {countB}K concurrent tuning trials.
- **C (Impact-led):** Delivered robust ML systems — improving final model validation scores by {metricA}% and reducing hyperparameter search times by {metricB}% through implementation across {countA} model architectures executing {countB}K concurrent tuning trials.
- **D (Concise):** Engineered Bayesian optimization strategies across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0057
**Role:** data-scientist | **Theme:** distributed-training | **Seniority:** senior | **Verb Context:** systems
**Keywords:** GPU clusters, Horovod, data parallelism, multi-node training, DeepSpeed

**Scope:** data parallelism strategies across {countA} GPU clusters managing {countB}K tensor computation operations
**Result:** improving multi-node scaling efficiency by {metricA}% and reducing total epoch training times by {metricB}%

**Variations:**
- **A (Standard):** Developed data parallelism strategies across {countA} GPU clusters managing {countB}K tensor computation operations, improving multi-node scaling efficiency by {metricA}% and reducing total epoch training times by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering data parallelism strategies across {countA} GPU clusters managing {countB}K tensor computation operations.
- **C (Impact-led):** Delivered robust ML systems — improving multi-node scaling efficiency by {metricA}% and reducing total epoch training times by {metricB}% through implementation across {countA} GPU clusters managing {countB}K tensor computation operations.
- **D (Concise):** Developed data parallelism strategies across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0058
**Role:** research-scientist | **Theme:** ml-cost-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** FinOps, cloud ML costs, spot instances, workload scheduling, resource allocation

**Scope:** cloud resource schedulers across {countA} ML deployment environments managing {countB}K monthly compute hours
**Result:** improving spot instance utilization by {metricA}% and reducing monthly ML infrastructure costs by {metricB}%

**Variations:**
- **A (Standard):** Optimized cloud resource schedulers across {countA} ML deployment environments managing {countB}K monthly compute hours, improving spot instance utilization by {metricA}% and reducing monthly ML infrastructure costs by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering cloud resource schedulers across {countA} ML deployment environments managing {countB}K monthly compute hours.
- **C (Impact-led):** Delivered robust ML systems — improving spot instance utilization by {metricA}% and reducing monthly ML infrastructure costs by {metricB}% through implementation across {countA} ML deployment environments managing {countB}K monthly compute hours.
- **D (Concise):** Optimized cloud resource schedulers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0059
**Role:** machine-learning-engineer | **Theme:** differential-privacy | **Seniority:** mid | **Verb Context:** systems
**Keywords:** privacy-preserving ML, differential privacy, noise injection, secure ML, data anonymization

**Scope:** noise injection mechanisms across {countA} sensitive datasets protecting {countB}K personally identifiable records
**Result:** improving privacy compliance adherence by {metricA}% and reducing external data leakage risks by {metricB}%

**Variations:**
- **A (Standard):** Designed noise injection mechanisms across {countA} sensitive datasets protecting {countB}K personally identifiable records, improving privacy compliance adherence by {metricA}% and reducing external data leakage risks by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering noise injection mechanisms across {countA} sensitive datasets protecting {countB}K personally identifiable records.
- **C (Impact-led):** Delivered robust ML systems — improving privacy compliance adherence by {metricA}% and reducing external data leakage risks by {metricB}% through implementation across {countA} sensitive datasets protecting {countB}K personally identifiable records.
- **D (Concise):** Designed noise injection mechanisms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0060
**Role:** data-scientist | **Theme:** rlhf-alignment | **Seniority:** mid | **Verb Context:** systems
**Keywords:** RLHF, reward modeling, human feedback, model alignment, LLM safety

**Scope:** reward modeling systems across {countA} language task domains utilizing {countB}K human preference annotations
**Result:** improving model safety alignment by {metricA}% and reducing toxic response generation by {metricB}%

**Variations:**
- **A (Standard):** Architected reward modeling systems across {countA} language task domains utilizing {countB}K human preference annotations, improving model safety alignment by {metricA}% and reducing toxic response generation by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering reward modeling systems across {countA} language task domains utilizing {countB}K human preference annotations.
- **C (Impact-led):** Delivered robust ML systems — improving model safety alignment by {metricA}% and reducing toxic response generation by {metricB}% through implementation across {countA} language task domains utilizing {countB}K human preference annotations.
- **D (Concise):** Architected reward modeling systems across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0061
**Role:** research-scientist | **Theme:** named-entity-recognition | **Seniority:** senior | **Verb Context:** systems
**Keywords:** NER, information extraction, token classification, custom entities, SpaCy

**Scope:** token classification pipelines across {countA} specialized domains extracting {countB}K domain-specific entities
**Result:** improving entity extraction precision by {metricA}% and reducing missed critical terms by {metricB}%

**Variations:**
- **A (Standard):** Engineered token classification pipelines across {countA} specialized domains extracting {countB}K domain-specific entities, improving entity extraction precision by {metricA}% and reducing missed critical terms by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering token classification pipelines across {countA} specialized domains extracting {countB}K domain-specific entities.
- **C (Impact-led):** Delivered robust ML systems — improving entity extraction precision by {metricA}% and reducing missed critical terms by {metricB}% through implementation across {countA} specialized domains extracting {countB}K domain-specific entities.
- **D (Concise):** Engineered token classification pipelines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0062
**Role:** machine-learning-engineer | **Theme:** sentiment-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** opinion mining, sentiment scoring, social media NLP, polarity classification

**Scope:** polarity scoring classifiers across {countA} social media feed sources parsing {countB}K user opinions daily
**Result:** improving sentiment tagging recall by {metricA}% and reducing neutral-class misclassifications by {metricB}%

**Variations:**
- **A (Standard):** Developed polarity scoring classifiers across {countA} social media feed sources parsing {countB}K user opinions daily, improving sentiment tagging recall by {metricA}% and reducing neutral-class misclassifications by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering polarity scoring classifiers across {countA} social media feed sources parsing {countB}K user opinions daily.
- **C (Impact-led):** Delivered robust ML systems — improving sentiment tagging recall by {metricA}% and reducing neutral-class misclassifications by {metricB}% through implementation across {countA} social media feed sources parsing {countB}K user opinions daily.
- **D (Concise):** Developed polarity scoring classifiers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0063
**Role:** data-scientist | **Theme:** machine-translation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** NMT, sequence-to-sequence, cross-lingual, translation models, Transformer

**Scope:** sequence-to-sequence transformers across {countA} language pairs translating {countB}M textual documents
**Result:** improving BLEU score evaluations by {metricA}% and reducing context loss in translations by {metricB}%

**Variations:**
- **A (Standard):** Optimized sequence-to-sequence transformers across {countA} language pairs translating {countB}M textual documents, improving BLEU score evaluations by {metricA}% and reducing context loss in translations by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering sequence-to-sequence transformers across {countA} language pairs translating {countB}M textual documents.
- **C (Impact-led):** Delivered robust ML systems — improving BLEU score evaluations by {metricA}% and reducing context loss in translations by {metricB}% through implementation across {countA} language pairs translating {countB}M textual documents.
- **D (Concise):** Optimized sequence-to-sequence transformers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0064
**Role:** research-scientist | **Theme:** code-generation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** Copilot, LLMs for code, syntax trees, code completion, developer productivity

**Scope:** syntax-aware completion models across {countA} programming languages supporting {countB}K internal developers
**Result:** improving code acceptance rates by {metricA}% and reducing average function implementation time by {metricB}%

**Variations:**
- **A (Standard):** Designed syntax-aware completion models across {countA} programming languages supporting {countB}K internal developers, improving code acceptance rates by {metricA}% and reducing average function implementation time by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering syntax-aware completion models across {countA} programming languages supporting {countB}K internal developers.
- **C (Impact-led):** Delivered robust ML systems — improving code acceptance rates by {metricA}% and reducing average function implementation time by {metricB}% through implementation across {countA} programming languages supporting {countB}K internal developers.
- **D (Concise):** Designed syntax-aware completion models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0065
**Role:** machine-learning-engineer | **Theme:** video-activity-recognition | **Seniority:** senior | **Verb Context:** systems
**Keywords:** video understanding, temporal modeling, action recognition, C3D, video frames

**Scope:** temporal modeling architectures across {countA} activity categories processing {countB}K hours of video footage
**Result:** improving action classification accuracy by {metricA}% and reducing temporal boundary errors by {metricB}%

**Variations:**
- **A (Standard):** Architected temporal modeling architectures across {countA} activity categories processing {countB}K hours of video footage, improving action classification accuracy by {metricA}% and reducing temporal boundary errors by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering temporal modeling architectures across {countA} activity categories processing {countB}K hours of video footage.
- **C (Impact-led):** Delivered robust ML systems — improving action classification accuracy by {metricA}% and reducing temporal boundary errors by {metricB}% through implementation across {countA} activity categories processing {countB}K hours of video footage.
- **D (Concise):** Architected temporal modeling architectures across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0066
**Role:** data-scientist | **Theme:** supply-chain-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** supply chain ML, inventory prediction, logistics routing, demand planning

**Scope:** logistics routing algorithms across {countA} distribution centers forecasting {countB}K SKU demand signals
**Result:** improving inventory turnover rates by {metricA}% and reducing stockout occurrences by {metricB}%

**Variations:**
- **A (Standard):** Engineered logistics routing algorithms across {countA} distribution centers forecasting {countB}K SKU demand signals, improving inventory turnover rates by {metricA}% and reducing stockout occurrences by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering logistics routing algorithms across {countA} distribution centers forecasting {countB}K SKU demand signals.
- **C (Impact-led):** Delivered robust ML systems — improving inventory turnover rates by {metricA}% and reducing stockout occurrences by {metricB}% through implementation across {countA} distribution centers forecasting {countB}K SKU demand signals.
- **D (Concise):** Engineered logistics routing algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0067
**Role:** research-scientist | **Theme:** document-extraction-ocr | **Seniority:** mid | **Verb Context:** systems
**Keywords:** OCR, Document AI, layout parsing, receipt extraction, invoice automation

**Scope:** layout parsing engines across {countA} document templates digitizing {countB}K scanned invoices monthly
**Result:** improving data extraction accuracy by {metricA}% and reducing manual data entry requirements by {metricB}%

**Variations:**
- **A (Standard):** Developed layout parsing engines across {countA} document templates digitizing {countB}K scanned invoices monthly, improving data extraction accuracy by {metricA}% and reducing manual data entry requirements by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering layout parsing engines across {countA} document templates digitizing {countB}K scanned invoices monthly.
- **C (Impact-led):** Delivered robust ML systems — improving data extraction accuracy by {metricA}% and reducing manual data entry requirements by {metricB}% through implementation across {countA} document templates digitizing {countB}K scanned invoices monthly.
- **D (Concise):** Developed layout parsing engines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0068
**Role:** machine-learning-engineer | **Theme:** robotics-control | **Seniority:** mid | **Verb Context:** systems
**Keywords:** robotics, motor control, sim2real, kinematics ML, control theory

**Scope:** sim2real transfer policies across {countA} robotic actuators executing {countB}M physical manipulation steps
**Result:** improving motor control stability by {metricA}% and reducing physical collision incidents by {metricB}%

**Variations:**
- **A (Standard):** Optimized sim2real transfer policies across {countA} robotic actuators executing {countB}M physical manipulation steps, improving motor control stability by {metricA}% and reducing physical collision incidents by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering sim2real transfer policies across {countA} robotic actuators executing {countB}M physical manipulation steps.
- **C (Impact-led):** Delivered robust ML systems — improving motor control stability by {metricA}% and reducing physical collision incidents by {metricB}% through implementation across {countA} robotic actuators executing {countB}M physical manipulation steps.
- **D (Concise):** Optimized sim2real transfer policies across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0069
**Role:** data-scientist | **Theme:** algorithmic-trading | **Seniority:** senior | **Verb Context:** systems
**Keywords:** quant finance, alpha generation, trading bots, market signals, time series finance

**Scope:** alpha generation models across {countA} asset classes analyzing {countB}M daily market tick signals
**Result:** improving risk-adjusted returns by {metricA}% and reducing maximum algorithm drawdown by {metricB}%

**Variations:**
- **A (Standard):** Designed alpha generation models across {countA} asset classes analyzing {countB}M daily market tick signals, improving risk-adjusted returns by {metricA}% and reducing maximum algorithm drawdown by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering alpha generation models across {countA} asset classes analyzing {countB}M daily market tick signals.
- **C (Impact-led):** Delivered robust ML systems — improving risk-adjusted returns by {metricA}% and reducing maximum algorithm drawdown by {metricB}% through implementation across {countA} asset classes analyzing {countB}M daily market tick signals.
- **D (Concise):** Designed alpha generation models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0070
**Role:** research-scientist | **Theme:** conversational-agents | **Seniority:** mid | **Verb Context:** systems
**Keywords:** chatbots, dialogue systems, Rasa, intent classification, slot filling

**Scope:** dialogue intent classifiers across {countA} customer service flows handling {countB}K automated chats daily
**Result:** improving conversational resolution rates by {metricA}% and reducing human agent handoffs by {metricB}%

**Variations:**
- **A (Standard):** Architected dialogue intent classifiers across {countA} customer service flows handling {countB}K automated chats daily, improving conversational resolution rates by {metricA}% and reducing human agent handoffs by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering dialogue intent classifiers across {countA} customer service flows handling {countB}K automated chats daily.
- **C (Impact-led):** Delivered robust ML systems — improving conversational resolution rates by {metricA}% and reducing human agent handoffs by {metricB}% through implementation across {countA} customer service flows handling {countB}K automated chats daily.
- **D (Concise):** Architected dialogue intent classifiers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0071
**Role:** machine-learning-engineer | **Theme:** healthcare-imaging | **Seniority:** mid | **Verb Context:** systems
**Keywords:** medical imaging, MRI analysis, radiology ML, tumor detection, healthcare AI

**Scope:** radiology detection algorithms across {countA} clinical imaging modalities analyzing {countB}K patient scans
**Result:** improving diagnostic sensitivity by {metricA}% and reducing false-negative interpretations by {metricB}%

**Variations:**
- **A (Standard):** Engineered radiology detection algorithms across {countA} clinical imaging modalities analyzing {countB}K patient scans, improving diagnostic sensitivity by {metricA}% and reducing false-negative interpretations by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering radiology detection algorithms across {countA} clinical imaging modalities analyzing {countB}K patient scans.
- **C (Impact-led):** Delivered robust ML systems — improving diagnostic sensitivity by {metricA}% and reducing false-negative interpretations by {metricB}% through implementation across {countA} clinical imaging modalities analyzing {countB}K patient scans.
- **D (Concise):** Engineered radiology detection algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0072
**Role:** data-scientist | **Theme:** drug-discovery-ml | **Seniority:** mid | **Verb Context:** systems
**Keywords:** cheminformatics, molecular properties, drug targets, computational biology

**Scope:** molecular property predictors across {countA} compound libraries screening {countB}M virtual drug candidates
**Result:** improving virtual screening hit rates by {metricA}% and reducing computational laboratory hours by {metricB}%

**Variations:**
- **A (Standard):** Developed molecular property predictors across {countA} compound libraries screening {countB}M virtual drug candidates, improving virtual screening hit rates by {metricA}% and reducing computational laboratory hours by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering molecular property predictors across {countA} compound libraries screening {countB}M virtual drug candidates.
- **C (Impact-led):** Delivered robust ML systems — improving virtual screening hit rates by {metricA}% and reducing computational laboratory hours by {metricB}% through implementation across {countA} compound libraries screening {countB}M virtual drug candidates.
- **D (Concise):** Developed molecular property predictors across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0073
**Role:** research-scientist | **Theme:** weather-forecasting | **Seniority:** senior | **Verb Context:** systems
**Keywords:** meteorological modeling, climate data, spatial-temporal ML, weather prediction

**Scope:** spatial-temporal weather models across {countA} geographical zones processing {countB}M meteorological readings
**Result:** improving short-term precipitation accuracy by {metricA}% and reducing severe storm prediction errors by {metricB}%

**Variations:**
- **A (Standard):** Optimized spatial-temporal weather models across {countA} geographical zones processing {countB}M meteorological readings, improving short-term precipitation accuracy by {metricA}% and reducing severe storm prediction errors by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering spatial-temporal weather models across {countA} geographical zones processing {countB}M meteorological readings.
- **C (Impact-led):** Delivered robust ML systems — improving short-term precipitation accuracy by {metricA}% and reducing severe storm prediction errors by {metricB}% through implementation across {countA} geographical zones processing {countB}M meteorological readings.
- **D (Concise):** Optimized spatial-temporal weather models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0074
**Role:** machine-learning-engineer | **Theme:** sports-analytics | **Seniority:** mid | **Verb Context:** systems
**Keywords:** player tracking, game prediction, sports computer vision, performance modeling

**Scope:** player tracking algorithms across {countA} athletic leagues dissecting {countB}K hours of game footage
**Result:** improving expected performance scoring by {metricA}% and reducing unpredictable injury risks by {metricB}%

**Variations:**
- **A (Standard):** Designed player tracking algorithms across {countA} athletic leagues dissecting {countB}K hours of game footage, improving expected performance scoring by {metricA}% and reducing unpredictable injury risks by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering player tracking algorithms across {countA} athletic leagues dissecting {countB}K hours of game footage.
- **C (Impact-led):** Delivered robust ML systems — improving expected performance scoring by {metricA}% and reducing unpredictable injury risks by {metricB}% through implementation across {countA} athletic leagues dissecting {countB}K hours of game footage.
- **D (Concise):** Designed player tracking algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0075
**Role:** data-scientist | **Theme:** music-generation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** audio synthesis, MIDI generation, music AI, computational creativity

**Scope:** polyphonic audio synthesizers across {countA} musical genres generating {countB}K unique composition tracks
**Result:** improving harmonic consistency ratings by {metricA}% and reducing algorithmic dissonance by {metricB}%

**Variations:**
- **A (Standard):** Architected polyphonic audio synthesizers across {countA} musical genres generating {countB}K unique composition tracks, improving harmonic consistency ratings by {metricA}% and reducing algorithmic dissonance by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering polyphonic audio synthesizers across {countA} musical genres generating {countB}K unique composition tracks.
- **C (Impact-led):** Delivered robust ML systems — improving harmonic consistency ratings by {metricA}% and reducing algorithmic dissonance by {metricB}% through implementation across {countA} musical genres generating {countB}K unique composition tracks.
- **D (Concise):** Architected polyphonic audio synthesizers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0076
**Role:** research-scientist | **Theme:** autonomous-driving-perception | **Seniority:** mid | **Verb Context:** systems
**Keywords:** LiDAR, sensor fusion, AV perception, 3D object detection, lane tracking

**Scope:** sensor fusion pipelines across {countA} automotive platforms analyzing {countB}M miles of driving data
**Result:** improving external obstacle detection by {metricA}% and reducing false-positive braking events by {metricB}%

**Variations:**
- **A (Standard):** Engineered sensor fusion pipelines across {countA} automotive platforms analyzing {countB}M miles of driving data, improving external obstacle detection by {metricA}% and reducing false-positive braking events by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering sensor fusion pipelines across {countA} automotive platforms analyzing {countB}M miles of driving data.
- **C (Impact-led):** Delivered robust ML systems — improving external obstacle detection by {metricA}% and reducing false-positive braking events by {metricB}% through implementation across {countA} automotive platforms analyzing {countB}M miles of driving data.
- **D (Concise):** Engineered sensor fusion pipelines across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0077
**Role:** machine-learning-engineer | **Theme:** knowledge-graph-construction | **Seniority:** senior | **Verb Context:** systems
**Keywords:** ontologies, knowledge graphs, relation extraction, semantic web

**Scope:** relation extraction mechanisms across {countA} specialized domains building {countB}M semantic triple connections
**Result:** improving graph query traversal speeds by {metricA}% and reducing unlinked entity orphans by {metricB}%

**Variations:**
- **A (Standard):** Developed relation extraction mechanisms across {countA} specialized domains building {countB}M semantic triple connections, improving graph query traversal speeds by {metricA}% and reducing unlinked entity orphans by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering relation extraction mechanisms across {countA} specialized domains building {countB}M semantic triple connections.
- **C (Impact-led):** Delivered robust ML systems — improving graph query traversal speeds by {metricA}% and reducing unlinked entity orphans by {metricB}% through implementation across {countA} specialized domains building {countB}M semantic triple connections.
- **D (Concise):** Developed relation extraction mechanisms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0078
**Role:** data-scientist | **Theme:** semantic-segmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** image segmentation, pixel classification, mask R-CNN, U-Net, computer vision

**Scope:** pixel classification networks across {countA} visual environments analyzing {countB}K high-resolution images
**Result:** improving granular boundary precision by {metricA}% and reducing background noise misclassifications by {metricB}%

**Variations:**
- **A (Standard):** Optimized pixel classification networks across {countA} visual environments analyzing {countB}K high-resolution images, improving granular boundary precision by {metricA}% and reducing background noise misclassifications by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering pixel classification networks across {countA} visual environments analyzing {countB}K high-resolution images.
- **C (Impact-led):** Delivered robust ML systems — improving granular boundary precision by {metricA}% and reducing background noise misclassifications by {metricB}% through implementation across {countA} visual environments analyzing {countB}K high-resolution images.
- **D (Concise):** Optimized pixel classification networks across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0079
**Role:** research-scientist | **Theme:** zero-shot-learning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** zero-shot, few-shot, transfer learning, CLIP, generalization

**Scope:** transfer learning implementations across {countA} unseen categories evaluating {countB}K generalized data samples
**Result:** improving novel class recognition rates by {metricA}% and reducing target domain training requirements by {metricB}%

**Variations:**
- **A (Standard):** Designed transfer learning implementations across {countA} unseen categories evaluating {countB}K generalized data samples, improving novel class recognition rates by {metricA}% and reducing target domain training requirements by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering transfer learning implementations across {countA} unseen categories evaluating {countB}K generalized data samples.
- **C (Impact-led):** Delivered robust ML systems — improving novel class recognition rates by {metricA}% and reducing target domain training requirements by {metricB}% through implementation across {countA} unseen categories evaluating {countB}K generalized data samples.
- **D (Concise):** Designed transfer learning implementations across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0080
**Role:** machine-learning-engineer | **Theme:** biometric-authentication | **Seniority:** mid | **Verb Context:** systems
**Keywords:** face recognition, voice biometrics, liveness detection, security ML

**Scope:** liveness detection protocols across {countA} security access points processing {countB}K identity verifications daily
**Result:** improving unauthorized access block rates by {metricA}% and reducing legitimate user friction by {metricB}%

**Variations:**
- **A (Standard):** Architected liveness detection protocols across {countA} security access points processing {countB}K identity verifications daily, improving unauthorized access block rates by {metricA}% and reducing legitimate user friction by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering liveness detection protocols across {countA} security access points processing {countB}K identity verifications daily.
- **C (Impact-led):** Delivered robust ML systems — improving unauthorized access block rates by {metricA}% and reducing legitimate user friction by {metricB}% through implementation across {countA} security access points processing {countB}K identity verifications daily.
- **D (Concise):** Architected liveness detection protocols across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0081
**Role:** data-scientist | **Theme:** protein-structure-prediction | **Seniority:** senior | **Verb Context:** systems
**Keywords:** AlphaFold, bioinformatics, protein folding, structural biology

**Scope:** biomolecular folding models across {countA} protein families analyzing {countB}K genetic sequences
**Result:** improving 3D structural prediction accuracy by {metricA}% and reducing laboratory crystallization time by {metricB}%

**Variations:**
- **A (Standard):** Engineered biomolecular folding models across {countA} protein families analyzing {countB}K genetic sequences, improving 3D structural prediction accuracy by {metricA}% and reducing laboratory crystallization time by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering biomolecular folding models across {countA} protein families analyzing {countB}K genetic sequences.
- **C (Impact-led):** Delivered robust ML systems — improving 3D structural prediction accuracy by {metricA}% and reducing laboratory crystallization time by {metricB}% through implementation across {countA} protein families analyzing {countB}K genetic sequences.
- **D (Concise):** Engineered biomolecular folding models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0082
**Role:** research-scientist | **Theme:** search-ranking | **Seniority:** mid | **Verb Context:** systems
**Keywords:** learning to rank, search relevance, information retrieval, query understanding

**Scope:** learning-to-rank algorithms across {countA} content verticals organizing {countB}M localized search queries
**Result:** improving top-3 result click-throughs by {metricA}% and reducing query abandonment rates by {metricB}%

**Variations:**
- **A (Standard):** Developed learning-to-rank algorithms across {countA} content verticals organizing {countB}M localized search queries, improving top-3 result click-throughs by {metricA}% and reducing query abandonment rates by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering learning-to-rank algorithms across {countA} content verticals organizing {countB}M localized search queries.
- **C (Impact-led):** Delivered robust ML systems — improving top-3 result click-throughs by {metricA}% and reducing query abandonment rates by {metricB}% through implementation across {countA} content verticals organizing {countB}M localized search queries.
- **D (Concise):** Developed learning-to-rank algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0083
**Role:** machine-learning-engineer | **Theme:** ad-ctr-prediction | **Seniority:** mid | **Verb Context:** systems
**Keywords:** CTR prediction, ad tech, computational advertising, bidding models, click-through rate

**Scope:** computational bidding models across {countA} advertising channels evaluating {countB}M consumer impressions
**Result:** improving targeted click-through rates by {metricA}% and reducing wasted ad spend by {metricB}%

**Variations:**
- **A (Standard):** Optimized computational bidding models across {countA} advertising channels evaluating {countB}M consumer impressions, improving targeted click-through rates by {metricA}% and reducing wasted ad spend by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering computational bidding models across {countA} advertising channels evaluating {countB}M consumer impressions.
- **C (Impact-led):** Delivered robust ML systems — improving targeted click-through rates by {metricA}% and reducing wasted ad spend by {metricB}% through implementation across {countA} advertising channels evaluating {countB}M consumer impressions.
- **D (Concise):** Optimized computational bidding models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0084
**Role:** data-scientist | **Theme:** pricing-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** dynamic pricing, price elasticity, yield management, revenue optimization

**Scope:** dynamic pricing algorithms across {countA} product categories regulating {countB}K e-commerce transactions
**Result:** improving peak revenue margins by {metricA}% and reducing competitive pricing lags by {metricB}%

**Variations:**
- **A (Standard):** Designed dynamic pricing algorithms across {countA} product categories regulating {countB}K e-commerce transactions, improving peak revenue margins by {metricA}% and reducing competitive pricing lags by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering dynamic pricing algorithms across {countA} product categories regulating {countB}K e-commerce transactions.
- **C (Impact-led):** Delivered robust ML systems — improving peak revenue margins by {metricA}% and reducing competitive pricing lags by {metricB}% through implementation across {countA} product categories regulating {countB}K e-commerce transactions.
- **D (Concise):** Designed dynamic pricing algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0085
**Role:** research-scientist | **Theme:** satellite-imagery-analysis | **Seniority:** senior | **Verb Context:** systems
**Keywords:** remote sensing, earth observation, geospatial ML, satellite computer vision

**Scope:** geospatial observation networks across {countA} terrestrial regions evaluating {countB}K square miles of satellite data
**Result:** improving land-use classification accuracy by {metricA}% and reducing temporal observation delays by {metricB}%

**Variations:**
- **A (Standard):** Architected geospatial observation networks across {countA} terrestrial regions evaluating {countB}K square miles of satellite data, improving land-use classification accuracy by {metricA}% and reducing temporal observation delays by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering geospatial observation networks across {countA} terrestrial regions evaluating {countB}K square miles of satellite data.
- **C (Impact-led):** Delivered robust ML systems — improving land-use classification accuracy by {metricA}% and reducing temporal observation delays by {metricB}% through implementation across {countA} terrestrial regions evaluating {countB}K square miles of satellite data.
- **D (Concise):** Architected geospatial observation networks across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0086
**Role:** machine-learning-engineer | **Theme:** audio-event-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sound classification, audio events, acoustic scenes, environmental audio

**Scope:** acoustic classification networks across {countA} environmental profiles sorting {countB}K distinct audio events
**Result:** improving background event isolation by {metricA}% and reducing ambient noise interference by {metricB}%

**Variations:**
- **A (Standard):** Engineered acoustic classification networks across {countA} environmental profiles sorting {countB}K distinct audio events, improving background event isolation by {metricA}% and reducing ambient noise interference by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering acoustic classification networks across {countA} environmental profiles sorting {countB}K distinct audio events.
- **C (Impact-led):** Delivered robust ML systems — improving background event isolation by {metricA}% and reducing ambient noise interference by {metricB}% through implementation across {countA} environmental profiles sorting {countB}K distinct audio events.
- **D (Concise):** Engineered acoustic classification networks across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0087
**Role:** data-scientist | **Theme:** fashion-recommendations | **Seniority:** mid | **Verb Context:** systems
**Keywords:** visual search, style recommendations, fashion AI, retail personalization

**Scope:** visual style recommenders across {countA} apparel categories matching {countB}M personalized user outfit combinations
**Result:** improving cross-selling conversion rates by {metricA}% and reducing mismatched inventory recommendations by {metricB}%

**Variations:**
- **A (Standard):** Developed visual style recommenders across {countA} apparel categories matching {countB}M personalized user outfit combinations, improving cross-selling conversion rates by {metricA}% and reducing mismatched inventory recommendations by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering visual style recommenders across {countA} apparel categories matching {countB}M personalized user outfit combinations.
- **C (Impact-led):** Delivered robust ML systems — improving cross-selling conversion rates by {metricA}% and reducing mismatched inventory recommendations by {metricB}% through implementation across {countA} apparel categories matching {countB}M personalized user outfit combinations.
- **D (Concise):** Developed visual style recommenders across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0088
**Role:** research-scientist | **Theme:** fake-news-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** misinformation, fact-checking ML, content moderation, text classification

**Scope:** misinformation detection classifiers across {countA} content platforms screening {countB}K daily news articles
**Result:** improving verified fact-check recall by {metricA}% and reducing harmful content dissemination by {metricB}%

**Variations:**
- **A (Standard):** Optimized misinformation detection classifiers across {countA} content platforms screening {countB}K daily news articles, improving verified fact-check recall by {metricA}% and reducing harmful content dissemination by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering misinformation detection classifiers across {countA} content platforms screening {countB}K daily news articles.
- **C (Impact-led):** Delivered robust ML systems — improving verified fact-check recall by {metricA}% and reducing harmful content dissemination by {metricB}% through implementation across {countA} content platforms screening {countB}K daily news articles.
- **D (Concise):** Optimized misinformation detection classifiers across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0089
**Role:** machine-learning-engineer | **Theme:** emotion-ai | **Seniority:** senior | **Verb Context:** systems
**Keywords:** affective computing, emotion recognition, multimodal sentiment, expression analysis

**Scope:** affective computing models across {countA} interactive platforms interpreting {countB}K user expression inputs
**Result:** improving emotional context accuracy by {metricA}% and reducing tone-deaf automated responses by {metricB}%

**Variations:**
- **A (Standard):** Designed affective computing models across {countA} interactive platforms interpreting {countB}K user expression inputs, improving emotional context accuracy by {metricA}% and reducing tone-deaf automated responses by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering affective computing models across {countA} interactive platforms interpreting {countB}K user expression inputs.
- **C (Impact-led):** Delivered robust ML systems — improving emotional context accuracy by {metricA}% and reducing tone-deaf automated responses by {metricB}% through implementation across {countA} interactive platforms interpreting {countB}K user expression inputs.
- **D (Concise):** Designed affective computing models across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0090
**Role:** data-scientist | **Theme:** energy-load-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** smart grid, energy consumption, smart meter ML, utility forecasting

**Scope:** smart meter consumption algorithms across {countA} utility grids predicting {countB}M localized energy loads
**Result:** improving grid distribution efficiency by {metricA}% and reducing unexpected energy shortages by {metricB}%

**Variations:**
- **A (Standard):** Architected smart meter consumption algorithms across {countA} utility grids predicting {countB}M localized energy loads, improving grid distribution efficiency by {metricA}% and reducing unexpected energy shortages by {metricB}%.
- **B (Result-first):** Achieved {metricA}% higher performance and {metricB}% lower errors by engineering smart meter consumption algorithms across {countA} utility grids predicting {countB}M localized energy loads.
- **C (Impact-led):** Delivered robust ML systems — improving grid distribution efficiency by {metricA}% and reducing unexpected energy shortages by {metricB}% through implementation across {countA} utility grids predicting {countB}M localized energy loads.
- **D (Concise):** Architected smart meter consumption algorithms across {countA} areas handling {countB} items — {metricA}% better results, {metricB}% reduction.

**Variables:**
  - `{countA}`: 3 to 20, step 1 (integer)
  - `{countB}`: 10 to 500, step 10 (integer)
  - `{metricA}`: 15 to 40, step 5 (percentage)
  - `{metricB}`: 10 to 30, step 5 (percentage)

### AIML-0091
**Role:** machine-learning-engineer | **Theme:** embedding-generation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** embeddings, vector representation, semantic encoding, deep learning, AI systems

**Scope:** semantic embeddings across {recordCount} data records supporting {applicationCount} AI applications
**Result:** improving semantic similarity detection by {accuracyIncrease}% and reducing irrelevant vector matches by {matchReduction}%

**Variations:**
- **A (Standard):** Generated semantic embeddings across {recordCount} data records supporting {applicationCount} AI applications, improving semantic similarity detection by {accuracyIncrease}% and reducing irrelevant vector matches by {matchReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher semantic similarity detection and {matchReduction}% fewer irrelevant matches by generating embeddings for {recordCount} records.
- **C (Impact-led):** Delivered stronger semantic encoding — improved similarity detection by {accuracyIncrease}% and reduced irrelevant matches by {matchReduction}% through embedding generation.
- **D (Concise):** Generated embeddings for {recordCount} records across {applicationCount} AI applications — {accuracyIncrease}% higher similarity detection, {matchReduction}% fewer mismatches.

**Variables:**
  - `{recordCount}`: 100000 to 20000000, step 100000 (integer)
  - `{applicationCount}`: 2 to 15, step 1 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{matchReduction}`: 10 to 30, step 5 (percentage)

### AIML-0092
**Role:** data-scientist | **Theme:** time-series-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** time series, forecasting models, temporal data, predictive analytics, data science

**Scope:** temporal patterns across {seriesCount} time-series datasets covering {recordCount}+ historical records
**Result:** improving forecast accuracy by {accuracyIncrease}% and reducing prediction lag by {lagReduction}%

**Variations:**
- **A (Standard):** Forecasted temporal patterns across {seriesCount} time-series datasets covering {recordCount}+ historical records, improving forecast accuracy by {accuracyIncrease}% and reducing prediction lag by {lagReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher forecasting accuracy and {lagReduction}% lower prediction lag by modeling {seriesCount} temporal datasets.
- **C (Impact-led):** Delivered stronger temporal predictions — improved forecast accuracy by {accuracyIncrease}% and reduced lag by {lagReduction}% through time-series modeling.
- **D (Concise):** Forecasted trends across {seriesCount} datasets with {recordCount}+ records — {accuracyIncrease}% higher accuracy, {lagReduction}% lower lag.

**Variables:**
  - `{seriesCount}`: 5 to 40, step 5 (integer)
  - `{recordCount}`: 100000 to 5000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{lagReduction}`: 10 to 30, step 5 (percentage)

### AIML-0093
**Role:** machine-learning-engineer | **Theme:** anomaly-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** anomaly detection, outlier detection, ML monitoring, pattern deviation, AI analytics

**Scope:** anomalous signals across {signalCount} monitored streams processing {eventCount}+ events
**Result:** improving anomaly identification accuracy by {accuracyIncrease}% and reducing undetected abnormal patterns by {missReduction}%

**Variations:**
- **A (Standard):** Detected anomalous signals across {signalCount} monitored streams processing {eventCount}+ events, improving anomaly identification accuracy by {accuracyIncrease}% and reducing undetected abnormal patterns by {missReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher anomaly detection accuracy and {missReduction}% fewer missed anomalies by monitoring {signalCount} streams.
- **C (Impact-led):** Delivered stronger anomaly detection — improved detection accuracy by {accuracyIncrease}% and reduced missed signals by {missReduction}% through AI monitoring.
- **D (Concise):** Detected anomalies across {signalCount} streams processing {eventCount}+ events — {accuracyIncrease}% higher accuracy, {missReduction}% fewer missed patterns.

**Variables:**
  - `{signalCount}`: 5 to 30, step 5 (integer)
  - `{eventCount}`: 100000 to 10000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{missReduction}`: 10 to 30, step 5 (percentage)

### AIML-0094
**Role:** research-scientist | **Theme:** multimodal-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** multimodal AI, cross-modal learning, vision-language models, deep learning, AI research

**Scope:** multimodal datasets across {datasetCount} modalities combining {sampleCount}+ training samples
**Result:** improving cross-modal understanding accuracy by {accuracyIncrease}% and reducing modality mismatch errors by {errorReduction}%

**Variations:**
- **A (Standard):** Integrated multimodal datasets across {datasetCount} modalities combining {sampleCount}+ training samples, improving cross-modal understanding accuracy by {accuracyIncrease}% and reducing modality mismatch errors by {errorReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher cross-modal accuracy and {errorReduction}% fewer modality mismatch errors by integrating {datasetCount} modalities.
- **C (Impact-led):** Delivered stronger multimodal intelligence — improved cross-modal accuracy by {accuracyIncrease}% and reduced mismatch errors by {errorReduction}% through multimodal integration.
- **D (Concise):** Integrated {datasetCount} modalities with {sampleCount}+ samples — {accuracyIncrease}% higher cross-modal accuracy, {errorReduction}% fewer mismatches.

**Variables:**
  - `{datasetCount}`: 2 to 6, step 1 (integer)
  - `{sampleCount}`: 50000 to 2000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{errorReduction}`: 10 to 30, step 5 (percentage)

### AIML-0095
**Role:** mlops-engineer | **Theme:** model-monitoring | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model monitoring, ML performance, production AI, prediction metrics, MLOps

**Scope:** production models across {modelCount} deployed endpoints serving {predictionCount}+ predictions daily
**Result:** improving production model reliability by {reliabilityIncrease}% and reducing unnoticed prediction failures by {failureReduction}%

**Variations:**
- **A (Standard):** Monitored production models across {modelCount} deployed endpoints serving {predictionCount}+ predictions daily, improving production model reliability by {reliabilityIncrease}% and reducing unnoticed prediction failures by {failureReduction}%.
- **B (Result-first):** Achieved {reliabilityIncrease}% higher model reliability and {failureReduction}% fewer unnoticed failures by monitoring {modelCount} production endpoints.
- **C (Impact-led):** Delivered stronger production AI reliability — improved model stability by {reliabilityIncrease}% and reduced unnoticed failures by {failureReduction}% through monitoring.
- **D (Concise):** Monitored {modelCount} deployed endpoints serving {predictionCount}+ predictions — {reliabilityIncrease}% higher reliability, {failureReduction}% fewer failures.

**Variables:**
  - `{modelCount}`: 5 to 30, step 5 (integer)
  - `{predictionCount}`: 50000 to 2000000, step 50000 (integer)
  - `{reliabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{failureReduction}`: 10 to 30, step 5 (percentage)

### AIML-0096
**Role:** machine-learning-engineer | **Theme:** recommendation-systems | **Seniority:** mid | **Verb Context:** systems
**Keywords:** recommendation systems, personalization, AI ranking, user preferences, ML systems

**Scope:** personalized recommendation models across {itemCount} catalog items serving {userCount}+ users
**Result:** improving recommendation relevance by {relevanceIncrease}% and increasing user engagement by {engagementIncrease}%

**Variations:**
- **A (Standard):** Built personalized recommendation models across {itemCount} catalog items serving {userCount}+ users, improving recommendation relevance by {relevanceIncrease}% and increasing user engagement by {engagementIncrease}%.
- **B (Result-first):** Achieved {relevanceIncrease}% higher recommendation relevance and {engagementIncrease}% higher user engagement by building recommendation systems for {itemCount} items.
- **C (Impact-led):** Delivered stronger personalization — improved recommendation relevance by {relevanceIncrease}% and increased engagement by {engagementIncrease}% through AI ranking models.
- **D (Concise):** Built recommendation systems for {itemCount} items serving {userCount}+ users — {relevanceIncrease}% higher relevance, {engagementIncrease}% higher engagement.

**Variables:**
  - `{itemCount}`: 10000 to 500000, step 10000 (integer)
  - `{userCount}`: 10000 to 5000000, step 10000 (integer)
  - `{relevanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{engagementIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0097
**Role:** data-scientist | **Theme:** clustering-analysis | **Seniority:** mid | **Verb Context:** systems
**Keywords:** clustering, unsupervised learning, data segmentation, pattern discovery, ML analytics

**Scope:** data segments across {recordCount} observations identifying {clusterCount} behavioral clusters
**Result:** improving pattern discovery clarity by {clarityIncrease}% and reducing ambiguous groupings by {groupReduction}%

**Variations:**
- **A (Standard):** Clustered data segments across {recordCount} observations identifying {clusterCount} behavioral clusters, improving pattern discovery clarity by {clarityIncrease}% and reducing ambiguous groupings by {groupReduction}%.
- **B (Result-first):** Achieved {clarityIncrease}% clearer pattern discovery and {groupReduction}% fewer ambiguous groupings by clustering {recordCount} observations.
- **C (Impact-led):** Delivered clearer behavioral segmentation — improved pattern clarity by {clarityIncrease}% and reduced ambiguous clusters by {groupReduction}% through clustering analysis.
- **D (Concise):** Clustered {recordCount} observations into {clusterCount} groups — {clarityIncrease}% higher clarity, {groupReduction}% fewer ambiguous clusters.

**Variables:**
  - `{recordCount}`: 100000 to 5000000, step 100000 (integer)
  - `{clusterCount}`: 5 to 40, step 5 (integer)
  - `{clarityIncrease}`: 15 to 35, step 5 (percentage)
  - `{groupReduction}`: 10 to 30, step 5 (percentage)

### AIML-0098
**Role:** machine-learning-engineer | **Theme:** auto-ml | **Seniority:** mid | **Verb Context:** systems
**Keywords:** AutoML, automated model search, ML optimization, AI automation, model discovery

**Scope:** model discovery across {experimentCount} automated experiments training {modelCount}+ candidate models
**Result:** improving model selection efficiency by {efficiencyIncrease}% and reducing manual experimentation time by {timeReduction}%

**Variations:**
- **A (Standard):** Automated model discovery across {experimentCount} automated experiments training {modelCount}+ candidate models, improving model selection efficiency by {efficiencyIncrease}% and reducing manual experimentation time by {timeReduction}%.
- **B (Result-first):** Achieved {efficiencyIncrease}% higher model selection efficiency and {timeReduction}% less manual experimentation by running {experimentCount} AutoML experiments.
- **C (Impact-led):** Delivered faster ML experimentation — improved model selection efficiency by {efficiencyIncrease}% and reduced manual time by {timeReduction}% through AutoML.
- **D (Concise):** Automated {experimentCount} experiments producing {modelCount}+ candidate models — {efficiencyIncrease}% higher efficiency, {timeReduction}% lower experimentation time.

**Variables:**
  - `{experimentCount}`: 20 to 200, step 10 (integer)
  - `{modelCount}`: 10 to 150, step 5 (integer)
  - `{efficiencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{timeReduction}`: 10 to 30, step 5 (percentage)

### AIML-0099
**Role:** mlops-engineer | **Theme:** model-versioning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** model versioning, ML lifecycle, model registry, deployment management, MLOps

**Scope:** ML artifacts across {modelCount} model versions tracked in {registryCount} registries
**Result:** improving deployment traceability by {traceabilityIncrease}% and reducing deployment confusion incidents by {confusionReduction}%

**Variations:**
- **A (Standard):** Versioned ML artifacts across {modelCount} model versions tracked in {registryCount} registries, improving deployment traceability by {traceabilityIncrease}% and reducing deployment confusion incidents by {confusionReduction}%.
- **B (Result-first):** Achieved {traceabilityIncrease}% higher deployment traceability and {confusionReduction}% fewer deployment mix-ups by versioning {modelCount} ML artifacts.
- **C (Impact-led):** Delivered clearer ML lifecycle governance — improved traceability by {traceabilityIncrease}% and reduced confusion incidents by {confusionReduction}% through versioning.
- **D (Concise):** Versioned {modelCount} models across {registryCount} registries — {traceabilityIncrease}% higher traceability, {confusionReduction}% fewer deployment errors.

**Variables:**
  - `{modelCount}`: 10 to 200, step 10 (integer)
  - `{registryCount}`: 1 to 5, step 1 (integer)
  - `{traceabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{confusionReduction}`: 10 to 30, step 5 (percentage)

### AIML-0100
**Role:** research-scientist | **Theme:** reinforcement-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** reinforcement learning, policy optimization, agent training, AI decision systems, deep RL

**Scope:** RL agents across {environmentCount} simulated environments executing {episodeCount}+ training episodes
**Result:** improving policy performance by {performanceIncrease}% and reducing reward convergence time by {convergenceReduction}%

**Variations:**
- **A (Standard):** Trained RL agents across {environmentCount} simulated environments executing {episodeCount}+ training episodes, improving policy performance by {performanceIncrease}% and reducing reward convergence time by {convergenceReduction}%.
- **B (Result-first):** Achieved {performanceIncrease}% higher policy performance and {convergenceReduction}% faster reward convergence by training RL agents across {environmentCount} environments.
- **C (Impact-led):** Delivered stronger decision policies — improved performance by {performanceIncrease}% and reduced convergence time by {convergenceReduction}% through reinforcement learning.
- **D (Concise):** Trained RL agents across {environmentCount} environments with {episodeCount}+ episodes — {performanceIncrease}% higher performance, {convergenceReduction}% faster convergence.

**Variables:**
  - `{environmentCount}`: 2 to 10, step 1 (integer)
  - `{episodeCount}`: 10000 to 1000000, step 10000 (integer)
  - `{performanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{convergenceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0101
**Role:** machine-learning-engineer | **Theme:** fraud-detection-models | **Seniority:** mid | **Verb Context:** systems
**Keywords:** fraud detection, risk scoring, transaction monitoring, ML classification, anomaly patterns

**Scope:** transaction risk across {transactionCount} monitored events involving {accountCount}+ user accounts
**Result:** improving fraud detection precision by {precisionIncrease}% and reducing false positive escalations by {falsePositiveReduction}%

**Variations:**
- **A (Standard):** Scored transaction risk across {transactionCount} monitored events involving {accountCount}+ user accounts, improving fraud detection precision by {precisionIncrease}% and reducing false positive escalations by {falsePositiveReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher fraud detection precision and {falsePositiveReduction}% fewer false positive escalations by scoring {transactionCount} monitored events.
- **C (Impact-led):** Delivered sharper fraud monitoring — improved detection precision by {precisionIncrease}% and reduced false positive escalations by {falsePositiveReduction}% through risk scoring.
- **D (Concise):** Scored risk across {transactionCount} events involving {accountCount}+ accounts — {precisionIncrease}% higher precision, {falsePositiveReduction}% fewer false positives.

**Variables:**
  - `{transactionCount}`: 100000 to 10000000, step 100000 (integer)
  - `{accountCount}`: 10000 to 1000000, step 10000 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{falsePositiveReduction}`: 10 to 30, step 5 (percentage)

### AIML-0102
**Role:** data-scientist | **Theme:** survival-analysis | **Seniority:** senior | **Verb Context:** systems
**Keywords:** survival analysis, time-to-event, retention modeling, hazard models, predictive analytics

**Scope:** time-to-event outcomes across {cohortCount} customer cohorts covering {recordCount}+ observations
**Result:** improving event-timing accuracy by {accuracyIncrease}% and reducing retention timing uncertainty by {uncertaintyReduction}%

**Variations:**
- **A (Standard):** Estimated time-to-event outcomes across {cohortCount} customer cohorts covering {recordCount}+ observations, improving event-timing accuracy by {accuracyIncrease}% and reducing retention timing uncertainty by {uncertaintyReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher event-timing accuracy and {uncertaintyReduction}% lower timing uncertainty by estimating outcomes across {cohortCount} cohorts.
- **C (Impact-led):** Delivered stronger time-to-event insight — improved timing accuracy by {accuracyIncrease}% and reduced retention uncertainty by {uncertaintyReduction}% through survival analysis.
- **D (Concise):** Estimated outcomes across {cohortCount} cohorts with {recordCount}+ observations — {accuracyIncrease}% higher timing accuracy, {uncertaintyReduction}% lower uncertainty.

**Variables:**
  - `{cohortCount}`: 4 to 20, step 2 (integer)
  - `{recordCount}`: 50000 to 5000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{uncertaintyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0103
**Role:** machine-learning-engineer | **Theme:** active-learning | **Seniority:** mid | **Verb Context:** projects
**Keywords:** active learning, label efficiency, sample selection, training optimization, human-in-the-loop

**Scope:** labeling candidates across {samplePoolCount} uncertain samples reviewed by {annotatorCount}+ annotators
**Result:** improving label efficiency by {efficiencyIncrease}% and reducing unnecessary annotation workload by {workloadReduction}%

**Variations:**
- **A (Standard):** Prioritized labeling candidates across {samplePoolCount} uncertain samples reviewed by {annotatorCount}+ annotators, improving label efficiency by {efficiencyIncrease}% and reducing unnecessary annotation workload by {workloadReduction}%.
- **B (Result-first):** Achieved {efficiencyIncrease}% higher label efficiency and {workloadReduction}% lower annotation workload by prioritizing {samplePoolCount} uncertain samples.
- **C (Impact-led):** Delivered smarter annotation workflows — improved label efficiency by {efficiencyIncrease}% and reduced unnecessary workload by {workloadReduction}% through active learning.
- **D (Concise):** Prioritized {samplePoolCount} uncertain samples for {annotatorCount}+ annotators — {efficiencyIncrease}% higher efficiency, {workloadReduction}% lower workload.

**Variables:**
  - `{samplePoolCount}`: 10000 to 1000000, step 10000 (integer)
  - `{annotatorCount}`: 5 to 200, step 5 (integer)
  - `{efficiencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{workloadReduction}`: 10 to 30, step 5 (percentage)

### AIML-0104
**Role:** research-scientist | **Theme:** continual-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** continual learning, catastrophic forgetting, incremental training, model adaptation, AI research

**Scope:** incremental model updates across {taskCount} sequential tasks using {sampleCount}+ training samples
**Result:** reducing catastrophic forgetting by {forgettingReduction}% and improving cross-task retention by {retentionIncrease}%

**Variations:**
- **A (Standard):** Adapted incremental model updates across {taskCount} sequential tasks using {sampleCount}+ training samples, reducing catastrophic forgetting by {forgettingReduction}% and improving cross-task retention by {retentionIncrease}%.
- **B (Result-first):** Achieved {forgettingReduction}% lower catastrophic forgetting and {retentionIncrease}% higher cross-task retention by adapting models across {taskCount} sequential tasks.
- **C (Impact-led):** Delivered stronger continual learning — reduced catastrophic forgetting by {forgettingReduction}% and improved task retention by {retentionIncrease}% through incremental adaptation.
- **D (Concise):** Adapted models across {taskCount} sequential tasks with {sampleCount}+ samples — {forgettingReduction}% lower forgetting, {retentionIncrease}% higher retention.

**Variables:**
  - `{taskCount}`: 3 to 20, step 1 (integer)
  - `{sampleCount}`: 50000 to 5000000, step 50000 (integer)
  - `{forgettingReduction}`: 15 to 35, step 5 (percentage)
  - `{retentionIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0105
**Role:** mlops-engineer | **Theme:** training-cost-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** training cost, compute optimization, resource efficiency, MLOps, budget control

**Scope:** training compute spend across {jobCount} model jobs running on {clusterCount} compute clusters
**Result:** lowering training infrastructure cost by {costReduction}% and improving compute efficiency by {efficiencyIncrease}%

**Variations:**
- **A (Standard):** Reduced training compute spend across {jobCount} model jobs running on {clusterCount} compute clusters, lowering training infrastructure cost by {costReduction}% and improving compute efficiency by {efficiencyIncrease}%.
- **B (Result-first):** Achieved {costReduction}% lower training infrastructure cost and {efficiencyIncrease}% higher compute efficiency by optimizing {jobCount} model jobs across {clusterCount} clusters.
- **C (Impact-led):** Delivered leaner ML training operations — lowered infrastructure cost by {costReduction}% and improved compute efficiency by {efficiencyIncrease}% through training-cost optimization.
- **D (Concise):** Reduced spend across {jobCount} model jobs on {clusterCount} clusters — {costReduction}% lower cost, {efficiencyIncrease}% higher efficiency.

**Variables:**
  - `{jobCount}`: 50 to 5000, step 50 (integer)
  - `{clusterCount}`: 2 to 20, step 1 (integer)
  - `{costReduction}`: 15 to 35, step 5 (percentage)
  - `{efficiencyIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0106
**Role:** data-scientist | **Theme:** imputation-modeling | **Seniority:** mid | **Verb Context:** content
**Keywords:** data imputation, missing values, data quality, predictive preprocessing, feature completeness

**Scope:** missing data across {fieldCount} feature fields covering {recordCount}+ incomplete records
**Result:** improving feature completeness by {completenessIncrease}% and reducing downstream data loss by {lossReduction}%

**Variations:**
- **A (Standard):** Recovered missing data across {fieldCount} feature fields covering {recordCount}+ incomplete records, improving feature completeness by {completenessIncrease}% and reducing downstream data loss by {lossReduction}%.
- **B (Result-first):** Achieved {completenessIncrease}% higher feature completeness and {lossReduction}% lower downstream data loss by recovering missing values across {fieldCount} fields.
- **C (Impact-led):** Delivered stronger data completeness — improved feature completeness by {completenessIncrease}% and reduced data loss by {lossReduction}% through imputation modeling.
- **D (Concise):** Recovered missing values across {fieldCount} fields and {recordCount}+ records — {completenessIncrease}% higher completeness, {lossReduction}% lower loss.

**Variables:**
  - `{fieldCount}`: 10 to 100, step 5 (integer)
  - `{recordCount}`: 50000 to 5000000, step 50000 (integer)
  - `{completenessIncrease}`: 15 to 35, step 5 (percentage)
  - `{lossReduction}`: 10 to 30, step 5 (percentage)

### AIML-0107
**Role:** machine-learning-engineer | **Theme:** ranking-models | **Seniority:** mid | **Verb Context:** systems
**Keywords:** ranking models, learning to rank, relevance scoring, ordering systems, search quality

**Scope:** result ordering across {queryCount} search queries serving {userCount}+ users
**Result:** improving top-result relevance by {relevanceIncrease}% and reducing low-quality ranking placements by {placementReduction}%

**Variations:**
- **A (Standard):** Ranked result ordering across {queryCount} search queries serving {userCount}+ users, improving top-result relevance by {relevanceIncrease}% and reducing low-quality ranking placements by {placementReduction}%.
- **B (Result-first):** Achieved {relevanceIncrease}% higher top-result relevance and {placementReduction}% fewer low-quality placements by ranking {queryCount} search queries.
- **C (Impact-led):** Delivered stronger result ordering — improved top-result relevance by {relevanceIncrease}% and reduced poor placements by {placementReduction}% through ranking models.
- **D (Concise):** Ranked {queryCount} search queries for {userCount}+ users — {relevanceIncrease}% higher relevance, {placementReduction}% fewer low-quality placements.

**Variables:**
  - `{queryCount}`: 10000 to 2000000, step 10000 (integer)
  - `{userCount}`: 10000 to 5000000, step 10000 (integer)
  - `{relevanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{placementReduction}`: 10 to 30, step 5 (percentage)

### AIML-0108
**Role:** research-scientist | **Theme:** speech-recognition | **Seniority:** senior | **Verb Context:** systems
**Keywords:** speech recognition, ASR, audio modeling, sequence decoding, voice AI

**Scope:** spoken audio across {audioHourCount} training hours supporting {languageCount} language variants
**Result:** improving word recognition accuracy by {accuracyIncrease}% and reducing transcription error rate by {errorReduction}%

**Variations:**
- **A (Standard):** Transcribed spoken audio across {audioHourCount} training hours supporting {languageCount} language variants, improving word recognition accuracy by {accuracyIncrease}% and reducing transcription error rate by {errorReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher word recognition accuracy and {errorReduction}% lower transcription error rate by training on {audioHourCount} audio hours.
- **C (Impact-led):** Delivered stronger speech recognition — improved word accuracy by {accuracyIncrease}% and reduced transcription errors by {errorReduction}% through ASR modeling.
- **D (Concise):** Transcribed {audioHourCount} hours across {languageCount} language variants — {accuracyIncrease}% higher accuracy, {errorReduction}% lower error rate.

**Variables:**
  - `{audioHourCount}`: 1000 to 50000, step 1000 (integer)
  - `{languageCount}`: 1 to 20, step 1 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{errorReduction}`: 10 to 30, step 5 (percentage)

### AIML-0109
**Role:** mlops-engineer | **Theme:** inference-caching | **Seniority:** mid | **Verb Context:** systems
**Keywords:** inference caching, latency reduction, serving optimization, response reuse, ML infrastructure

**Scope:** repeat prediction requests across {endpointCount} inference endpoints serving {requestCount}+ daily requests
**Result:** reducing average response latency by {latencyReduction}% and lowering redundant inference load by {loadReduction}%

**Variations:**
- **A (Standard):** Cached repeat prediction requests across {endpointCount} inference endpoints serving {requestCount}+ daily requests, reducing average response latency by {latencyReduction}% and lowering redundant inference load by {loadReduction}%.
- **B (Result-first):** Achieved {latencyReduction}% lower response latency and {loadReduction}% lower redundant inference load by caching repeat requests across {endpointCount} endpoints.
- **C (Impact-led):** Delivered faster ML serving — reduced latency by {latencyReduction}% and lowered redundant inference load by {loadReduction}% through inference caching.
- **D (Concise):** Cached repeat requests across {endpointCount} endpoints serving {requestCount}+ daily requests — {latencyReduction}% lower latency, {loadReduction}% lower redundant load.

**Variables:**
  - `{endpointCount}`: 2 to 20, step 1 (integer)
  - `{requestCount}`: 50000 to 5000000, step 50000 (integer)
  - `{latencyReduction}`: 15 to 35, step 5 (percentage)
  - `{loadReduction}`: 10 to 30, step 5 (percentage)

### AIML-0110
**Role:** data-scientist | **Theme:** bayesian-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** Bayesian modeling, probabilistic inference, uncertainty estimation, statistical learning, data science

**Scope:** probabilistic outcomes across {scenarioCount} decision scenarios covering {recordCount}+ observations
**Result:** improving uncertainty calibration by {calibrationIncrease}% and reducing overconfident predictions by {overconfidenceReduction}%

**Variations:**
- **A (Standard):** Estimated probabilistic outcomes across {scenarioCount} decision scenarios covering {recordCount}+ observations, improving uncertainty calibration by {calibrationIncrease}% and reducing overconfident predictions by {overconfidenceReduction}%.
- **B (Result-first):** Achieved {calibrationIncrease}% higher uncertainty calibration and {overconfidenceReduction}% fewer overconfident predictions by estimating outcomes across {scenarioCount} scenarios.
- **C (Impact-led):** Delivered stronger probabilistic reasoning — improved uncertainty calibration by {calibrationIncrease}% and reduced overconfidence by {overconfidenceReduction}% through Bayesian modeling.
- **D (Concise):** Estimated outcomes across {scenarioCount} scenarios with {recordCount}+ observations — {calibrationIncrease}% higher calibration, {overconfidenceReduction}% lower overconfidence.

**Variables:**
  - `{scenarioCount}`: 3 to 15, step 1 (integer)
  - `{recordCount}`: 10000 to 2000000, step 10000 (integer)
  - `{calibrationIncrease}`: 15 to 35, step 5 (percentage)
  - `{overconfidenceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0111
**Role:** machine-learning-engineer | **Theme:** token-classification | **Seniority:** mid | **Verb Context:** systems
**Keywords:** token classification, sequence labeling, NER, NLP models, language processing

**Scope:** text sequences across {documentCount} documents containing {tokenCount}+ tokens
**Result:** improving token labeling accuracy by {accuracyIncrease}% and reducing span boundary errors by {boundaryReduction}%

**Variations:**
- **A (Standard):** Labeled text sequences across {documentCount} documents containing {tokenCount}+ tokens, improving token labeling accuracy by {accuracyIncrease}% and reducing span boundary errors by {boundaryReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher token labeling accuracy and {boundaryReduction}% fewer span boundary errors by labeling {documentCount} documents.
- **C (Impact-led):** Delivered stronger sequence labeling — improved token accuracy by {accuracyIncrease}% and reduced boundary errors by {boundaryReduction}% through token classification.
- **D (Concise):** Labeled {documentCount} documents with {tokenCount}+ tokens — {accuracyIncrease}% higher accuracy, {boundaryReduction}% fewer boundary errors.

**Variables:**
  - `{documentCount}`: 10000 to 1000000, step 10000 (integer)
  - `{tokenCount}`: 1000000 to 100000000, step 1000000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{boundaryReduction}`: 10 to 30, step 5 (percentage)

### AIML-0112
**Role:** research-scientist | **Theme:** domain-adaptation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** domain adaptation, distribution shift, transfer learning, robust models, AI research

**Scope:** model knowledge across {domainCount} target domains using {sampleCount}+ target-domain samples
**Result:** improving cross-domain accuracy by {accuracyIncrease}% and reducing performance drop under shift by {shiftReduction}%

**Variations:**
- **A (Standard):** Transferred model knowledge across {domainCount} target domains using {sampleCount}+ target-domain samples, improving cross-domain accuracy by {accuracyIncrease}% and reducing performance drop under shift by {shiftReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher cross-domain accuracy and {shiftReduction}% lower performance drop under shift by adapting models across {domainCount} target domains.
- **C (Impact-led):** Delivered stronger domain robustness — improved cross-domain accuracy by {accuracyIncrease}% and reduced shift-related performance loss by {shiftReduction}% through domain adaptation.
- **D (Concise):** Transferred knowledge across {domainCount} target domains with {sampleCount}+ samples — {accuracyIncrease}% higher accuracy, {shiftReduction}% lower shift loss.

**Variables:**
  - `{domainCount}`: 2 to 10, step 1 (integer)
  - `{sampleCount}`: 10000 to 1000000, step 10000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{shiftReduction}`: 10 to 30, step 5 (percentage)

### AIML-0113
**Role:** mlops-engineer | **Theme:** batch-scheduling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** batch scheduling, workflow orchestration, job prioritization, MLOps, pipeline timing

**Scope:** ML workflow timing across {jobCount} recurring jobs running on {clusterCount} compute clusters
**Result:** improving job completion predictability by {predictabilityIncrease}% and reducing queue wait time by {queueReduction}%

**Variations:**
- **A (Standard):** Scheduled ML workflow timing across {jobCount} recurring jobs running on {clusterCount} compute clusters, improving job completion predictability by {predictabilityIncrease}% and reducing queue wait time by {queueReduction}%.
- **B (Result-first):** Achieved {predictabilityIncrease}% higher job completion predictability and {queueReduction}% lower queue wait time by scheduling {jobCount} recurring jobs.
- **C (Impact-led):** Delivered smoother ML operations timing — improved completion predictability by {predictabilityIncrease}% and reduced queue wait time by {queueReduction}% through batch scheduling.
- **D (Concise):** Scheduled {jobCount} recurring jobs across {clusterCount} clusters — {predictabilityIncrease}% higher predictability, {queueReduction}% lower queue wait time.

**Variables:**
  - `{jobCount}`: 100 to 5000, step 100 (integer)
  - `{clusterCount}`: 2 to 20, step 1 (integer)
  - `{predictabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{queueReduction}`: 10 to 30, step 5 (percentage)

### AIML-0114
**Role:** data-scientist | **Theme:** propensity-segmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** propensity segmentation, user scoring, behavioral cohorts, targeting, predictive analytics

**Scope:** propensity tiers across {userCount} scored users organized into {tierCount} actionability groups
**Result:** improving campaign targeting precision by {precisionIncrease}% and reducing low-likelihood outreach by {outreachReduction}%

**Variations:**
- **A (Standard):** Segmented propensity tiers across {userCount} scored users organized into {tierCount} actionability groups, improving campaign targeting precision by {precisionIncrease}% and reducing low-likelihood outreach by {outreachReduction}%.
- **B (Result-first):** Achieved {precisionIncrease}% higher campaign targeting precision and {outreachReduction}% lower low-likelihood outreach by segmenting {userCount} scored users into {tierCount} groups.
- **C (Impact-led):** Delivered more actionable scoring — improved targeting precision by {precisionIncrease}% and reduced low-likelihood outreach by {outreachReduction}% through propensity segmentation.
- **D (Concise):** Segmented {userCount} scored users into {tierCount} groups — {precisionIncrease}% higher precision, {outreachReduction}% lower low-likelihood outreach.

**Variables:**
  - `{userCount}`: 50000 to 5000000, step 50000 (integer)
  - `{tierCount}`: 3 to 12, step 1 (integer)
  - `{precisionIncrease}`: 15 to 35, step 5 (percentage)
  - `{outreachReduction}`: 10 to 30, step 5 (percentage)

### AIML-0115
**Role:** machine-learning-engineer | **Theme:** label-noise-reduction | **Seniority:** mid | **Verb Context:** content
**Keywords:** label noise, annotation quality, training data cleanup, supervised learning, data quality

**Scope:** training labels across {datasetCount} supervised datasets containing {sampleCount}+ labeled examples
**Result:** improving annotation consistency by {consistencyIncrease}% and reducing mislabeled training examples by {mislabelReduction}%

**Variations:**
- **A (Standard):** Cleaned training labels across {datasetCount} supervised datasets containing {sampleCount}+ labeled examples, improving annotation consistency by {consistencyIncrease}% and reducing mislabeled training examples by {mislabelReduction}%.
- **B (Result-first):** Achieved {consistencyIncrease}% higher annotation consistency and {mislabelReduction}% fewer mislabeled examples by cleaning labels across {datasetCount} datasets.
- **C (Impact-led):** Delivered cleaner supervised learning data — improved annotation consistency by {consistencyIncrease}% and reduced mislabeled examples by {mislabelReduction}% through label-noise reduction.
- **D (Concise):** Cleaned labels across {datasetCount} datasets with {sampleCount}+ examples — {consistencyIncrease}% higher consistency, {mislabelReduction}% fewer mislabels.

**Variables:**
  - `{datasetCount}`: 3 to 20, step 1 (integer)
  - `{sampleCount}`: 100000 to 10000000, step 100000 (integer)
  - `{consistencyIncrease}`: 15 to 35, step 5 (percentage)
  - `{mislabelReduction}`: 10 to 30, step 5 (percentage)

### AIML-0116
**Role:** research-scientist | **Theme:** generative-model-evaluation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** generative models, model evaluation, sample quality, generation benchmarks, AI research

**Scope:** generated outputs across {benchmarkCount} quality tests covering {sampleCount}+ model generations
**Result:** improving generation quality visibility by {visibilityIncrease}% and reducing subjective evaluation disagreement by {disagreementReduction}%

**Variations:**
- **A (Standard):** Benchmarked generated outputs across {benchmarkCount} quality tests covering {sampleCount}+ model generations, improving generation quality visibility by {visibilityIncrease}% and reducing subjective evaluation disagreement by {disagreementReduction}%.
- **B (Result-first):** Achieved {visibilityIncrease}% higher generation quality visibility and {disagreementReduction}% lower evaluation disagreement by benchmarking {sampleCount}+ generations.
- **C (Impact-led):** Delivered clearer generative model assessment — improved quality visibility by {visibilityIncrease}% and reduced subjective disagreement by {disagreementReduction}% through benchmarking.
- **D (Concise):** Benchmarked {sampleCount}+ generations across {benchmarkCount} tests — {visibilityIncrease}% higher visibility, {disagreementReduction}% lower disagreement.

**Variables:**
  - `{benchmarkCount}`: 5 to 30, step 5 (integer)
  - `{sampleCount}`: 10000 to 1000000, step 10000 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{disagreementReduction}`: 10 to 30, step 5 (percentage)

### AIML-0117
**Role:** mlops-engineer | **Theme:** shadow-deployments | **Seniority:** mid | **Verb Context:** systems
**Keywords:** shadow deployment, safe rollout, model validation, deployment testing, MLOps

**Scope:** candidate models across {modelCount} shadow deployments serving {requestCount}+ mirrored requests
**Result:** improving pre-release confidence by {confidenceIncrease}% and reducing risky production rollouts by {riskReduction}%

**Variations:**
- **A (Standard):** Validated candidate models across {modelCount} shadow deployments serving {requestCount}+ mirrored requests, improving pre-release confidence by {confidenceIncrease}% and reducing risky production rollouts by {riskReduction}%.
- **B (Result-first):** Achieved {confidenceIncrease}% higher pre-release confidence and {riskReduction}% lower rollout risk by validating {modelCount} candidate models in shadow deployments.
- **C (Impact-led):** Delivered safer ML releases — improved pre-release confidence by {confidenceIncrease}% and reduced rollout risk by {riskReduction}% through shadow deployment validation.
- **D (Concise):** Validated {modelCount} candidate models on {requestCount}+ mirrored requests — {confidenceIncrease}% higher confidence, {riskReduction}% lower risk.

**Variables:**
  - `{modelCount}`: 2 to 15, step 1 (integer)
  - `{requestCount}`: 100000 to 5000000, step 100000 (integer)
  - `{confidenceIncrease}`: 15 to 35, step 5 (percentage)
  - `{riskReduction}`: 10 to 30, step 5 (percentage)

### AIML-0118
**Role:** data-scientist | **Theme:** geo-spatial-modeling | **Seniority:** mid | **Verb Context:** systems
**Keywords:** geospatial modeling, location intelligence, spatial analysis, predictive mapping, data science

**Scope:** spatial patterns across {regionCount} geographic regions covering {recordCount}+ location events
**Result:** improving location-based prediction accuracy by {accuracyIncrease}% and reducing regional blind spots by {blindspotReduction}%

**Variations:**
- **A (Standard):** Mapped spatial patterns across {regionCount} geographic regions covering {recordCount}+ location events, improving location-based prediction accuracy by {accuracyIncrease}% and reducing regional blind spots by {blindspotReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher location-based prediction accuracy and {blindspotReduction}% fewer regional blind spots by mapping {recordCount}+ location events.
- **C (Impact-led):** Delivered stronger spatial intelligence — improved prediction accuracy by {accuracyIncrease}% and reduced blind spots by {blindspotReduction}% through geospatial modeling.
- **D (Concise):** Mapped {recordCount}+ location events across {regionCount} regions — {accuracyIncrease}% higher accuracy, {blindspotReduction}% fewer blind spots.

**Variables:**
  - `{regionCount}`: 10 to 500, step 10 (integer)
  - `{recordCount}`: 100000 to 20000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{blindspotReduction}`: 10 to 30, step 5 (percentage)

### AIML-0119
**Role:** machine-learning-engineer | **Theme:** retrieval-augmentation | **Seniority:** mid | **Verb Context:** systems
**Keywords:** RAG, retrieval augmentation, context injection, LLM systems, knowledge retrieval

**Scope:** generated responses across {queryCount} knowledge queries using {documentCount}+ retrieved documents
**Result:** improving factual response relevance by {relevanceIncrease}% and reducing unsupported answers by {unsupportedReduction}%

**Variations:**
- **A (Standard):** Grounded generated responses across {queryCount} knowledge queries using {documentCount}+ retrieved documents, improving factual response relevance by {relevanceIncrease}% and reducing unsupported answers by {unsupportedReduction}%.
- **B (Result-first):** Achieved {relevanceIncrease}% higher factual response relevance and {unsupportedReduction}% fewer unsupported answers by grounding {queryCount} knowledge queries with retrieved context.
- **C (Impact-led):** Delivered stronger retrieval-augmented generation — improved factual relevance by {relevanceIncrease}% and reduced unsupported answers by {unsupportedReduction}% through context grounding.
- **D (Concise):** Grounded {queryCount} knowledge queries with {documentCount}+ documents — {relevanceIncrease}% higher relevance, {unsupportedReduction}% fewer unsupported answers.

**Variables:**
  - `{queryCount}`: 10000 to 2000000, step 10000 (integer)
  - `{documentCount}`: 100000 to 20000000, step 100000 (integer)
  - `{relevanceIncrease}`: 15 to 35, step 5 (percentage)
  - `{unsupportedReduction}`: 10 to 30, step 5 (percentage)

### AIML-0120
**Role:** research-scientist | **Theme:** uncertainty-estimation | **Seniority:** senior | **Verb Context:** systems
**Keywords:** uncertainty estimation, confidence scoring, calibration, model reliability, AI research

**Scope:** prediction confidence across {modelCount} deployed models evaluated on {sampleCount}+ labeled examples
**Result:** improving confidence reliability by {reliabilityIncrease}% and reducing overconfident mispredictions by {mispredictionReduction}%

**Variations:**
- **A (Standard):** Calibrated prediction confidence across {modelCount} deployed models evaluated on {sampleCount}+ labeled examples, improving confidence reliability by {reliabilityIncrease}% and reducing overconfident mispredictions by {mispredictionReduction}%.
- **B (Result-first):** Achieved {reliabilityIncrease}% higher confidence reliability and {mispredictionReduction}% fewer overconfident mispredictions by calibrating {modelCount} deployed models.
- **C (Impact-led):** Delivered stronger prediction reliability — improved confidence calibration by {reliabilityIncrease}% and reduced overconfident mistakes by {mispredictionReduction}% through uncertainty estimation.
- **D (Concise):** Calibrated confidence across {modelCount} models on {sampleCount}+ examples — {reliabilityIncrease}% higher reliability, {mispredictionReduction}% fewer overconfident errors.

**Variables:**
  - `{modelCount}`: 3 to 20, step 1 (integer)
  - `{sampleCount}`: 50000 to 5000000, step 50000 (integer)
  - `{reliabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{mispredictionReduction}`: 10 to 30, step 5 (percentage)

### AIML-0121
**Role:** mlops-engineer | **Theme:** data-lineage | **Seniority:** mid | **Verb Context:** systems
**Keywords:** data lineage, pipeline provenance, dataset tracking, governance, MLOps

**Scope:** dataset provenance across {datasetCount} training datasets derived from {sourceCount} upstream sources
**Result:** improving data traceability by {traceabilityIncrease}% and reducing undocumented source changes by {changeReduction}%

**Variations:**
- **A (Standard):** Traced dataset provenance across {datasetCount} training datasets derived from {sourceCount} upstream sources, improving data traceability by {traceabilityIncrease}% and reducing undocumented source changes by {changeReduction}%.
- **B (Result-first):** Achieved {traceabilityIncrease}% higher data traceability and {changeReduction}% fewer undocumented source changes by tracing provenance across {datasetCount} datasets.
- **C (Impact-led):** Delivered stronger ML data governance — improved traceability by {traceabilityIncrease}% and reduced undocumented changes by {changeReduction}% through data lineage tracking.
- **D (Concise):** Traced provenance across {datasetCount} datasets from {sourceCount} sources — {traceabilityIncrease}% higher traceability, {changeReduction}% fewer undocumented changes.

**Variables:**
  - `{datasetCount}`: 10 to 200, step 10 (integer)
  - `{sourceCount}`: 5 to 100, step 5 (integer)
  - `{traceabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{changeReduction}`: 10 to 30, step 5 (percentage)

### AIML-0122
**Role:** data-scientist | **Theme:** counterfactual-analysis | **Seniority:** senior | **Verb Context:** systems
**Keywords:** counterfactual analysis, what-if modeling, causal scenarios, decision support, data science

**Scope:** counterfactual outcomes across {scenarioCount} policy alternatives involving {recordCount}+ observations
**Result:** improving scenario insight clarity by {clarityIncrease}% and reducing decision blind spots by {blindspotReduction}%

**Variations:**
- **A (Standard):** Simulated counterfactual outcomes across {scenarioCount} policy alternatives involving {recordCount}+ observations, improving scenario insight clarity by {clarityIncrease}% and reducing decision blind spots by {blindspotReduction}%.
- **B (Result-first):** Achieved {clarityIncrease}% higher scenario insight clarity and {blindspotReduction}% fewer decision blind spots by simulating {scenarioCount} counterfactual alternatives.
- **C (Impact-led):** Delivered clearer what-if analysis — improved scenario insight clarity by {clarityIncrease}% and reduced decision blind spots by {blindspotReduction}% through counterfactual simulation.
- **D (Concise):** Simulated {scenarioCount} policy alternatives with {recordCount}+ observations — {clarityIncrease}% higher clarity, {blindspotReduction}% fewer blind spots.

**Variables:**
  - `{scenarioCount}`: 3 to 20, step 1 (integer)
  - `{recordCount}`: 10000 to 2000000, step 10000 (integer)
  - `{clarityIncrease}`: 15 to 35, step 5 (percentage)
  - `{blindspotReduction}`: 10 to 30, step 5 (percentage)

### AIML-0123
**Role:** machine-learning-engineer | **Theme:** sequence-forecasting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** sequence forecasting, temporal models, next-step prediction, deep learning, forecasting

**Scope:** next-step sequences across {seriesCount} temporal streams containing {eventCount}+ ordered events
**Result:** improving sequential forecast accuracy by {accuracyIncrease}% and reducing compounding prediction drift by {driftReduction}%

**Variations:**
- **A (Standard):** Predicted next-step sequences across {seriesCount} temporal streams containing {eventCount}+ ordered events, improving sequential forecast accuracy by {accuracyIncrease}% and reducing compounding prediction drift by {driftReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher sequential forecast accuracy and {driftReduction}% lower prediction drift by modeling {seriesCount} temporal streams.
- **C (Impact-led):** Delivered stronger sequence forecasting — improved next-step accuracy by {accuracyIncrease}% and reduced compounding drift by {driftReduction}% through temporal modeling.
- **D (Concise):** Predicted next steps across {seriesCount} streams with {eventCount}+ events — {accuracyIncrease}% higher accuracy, {driftReduction}% lower drift.

**Variables:**
  - `{seriesCount}`: 10 to 200, step 10 (integer)
  - `{eventCount}`: 100000 to 50000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{driftReduction}`: 10 to 30, step 5 (percentage)

### AIML-0124
**Role:** research-scientist | **Theme:** preference-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** preference modeling, ranking preferences, human feedback, reward models, AI alignment

**Scope:** user preference signals across {comparisonCount} feedback comparisons collected from {annotatorCount}+ raters
**Result:** improving preference prediction agreement by {agreementIncrease}% and reducing inconsistent ranking outcomes by {inconsistencyReduction}%

**Variations:**
- **A (Standard):** Modeled user preference signals across {comparisonCount} feedback comparisons collected from {annotatorCount}+ raters, improving preference prediction agreement by {agreementIncrease}% and reducing inconsistent ranking outcomes by {inconsistencyReduction}%.
- **B (Result-first):** Achieved {agreementIncrease}% higher preference prediction agreement and {inconsistencyReduction}% fewer inconsistent ranking outcomes by modeling {comparisonCount} feedback comparisons.
- **C (Impact-led):** Delivered stronger preference learning — improved agreement by {agreementIncrease}% and reduced ranking inconsistency by {inconsistencyReduction}% through preference modeling.
- **D (Concise):** Modeled {comparisonCount} feedback comparisons from {annotatorCount}+ raters — {agreementIncrease}% higher agreement, {inconsistencyReduction}% lower inconsistency.

**Variables:**
  - `{comparisonCount}`: 10000 to 2000000, step 10000 (integer)
  - `{annotatorCount}`: 20 to 2000, step 20 (integer)
  - `{agreementIncrease}`: 15 to 35, step 5 (percentage)
  - `{inconsistencyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0125
**Role:** mlops-engineer | **Theme:** canary-rollouts | **Seniority:** mid | **Verb Context:** projects
**Keywords:** canary rollout, progressive delivery, model releases, safe deployment, MLOps

**Scope:** progressive model releases across {releaseCount} deployments serving {requestCount}+ production requests
**Result:** reducing release risk by {riskReduction}% and improving rollback readiness by {readinessIncrease}%

**Variations:**
- **A (Standard):** Rolled progressive model releases across {releaseCount} deployments serving {requestCount}+ production requests, reducing release risk by {riskReduction}% and improving rollback readiness by {readinessIncrease}%.
- **B (Result-first):** Achieved {riskReduction}% lower release risk and {readinessIncrease}% higher rollback readiness by rolling out {releaseCount} canary deployments.
- **C (Impact-led):** Delivered safer production releases — reduced rollout risk by {riskReduction}% and improved rollback readiness by {readinessIncrease}% through canary delivery.
- **D (Concise):** Rolled {releaseCount} progressive deployments serving {requestCount}+ requests — {riskReduction}% lower risk, {readinessIncrease}% higher rollback readiness.

**Variables:**
  - `{releaseCount}`: 5 to 50, step 5 (integer)
  - `{requestCount}`: 100000 to 10000000, step 100000 (integer)
  - `{riskReduction}`: 15 to 35, step 5 (percentage)
  - `{readinessIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0126
**Role:** data-scientist | **Theme:** dimensionality-reduction | **Seniority:** mid | **Verb Context:** systems
**Keywords:** dimensionality reduction, latent space, feature compression, visualization, data science

**Scope:** high-dimensional feature spaces across {featureCount} variables covering {recordCount}+ observations
**Result:** improving latent structure visibility by {visibilityIncrease}% and reducing redundant variance by {varianceReduction}%

**Variations:**
- **A (Standard):** Compressed high-dimensional feature spaces across {featureCount} variables covering {recordCount}+ observations, improving latent structure visibility by {visibilityIncrease}% and reducing redundant variance by {varianceReduction}%.
- **B (Result-first):** Achieved {visibilityIncrease}% higher latent structure visibility and {varianceReduction}% lower redundant variance by compressing {featureCount} variables.
- **C (Impact-led):** Delivered clearer low-dimensional representations — improved latent visibility by {visibilityIncrease}% and reduced redundant variance by {varianceReduction}% through dimensionality reduction.
- **D (Concise):** Compressed {featureCount} variables across {recordCount}+ observations — {visibilityIncrease}% higher visibility, {varianceReduction}% lower redundant variance.

**Variables:**
  - `{featureCount}`: 50 to 5000, step 50 (integer)
  - `{recordCount}`: 10000 to 5000000, step 10000 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{varianceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0127
**Role:** machine-learning-engineer | **Theme:** feature-importance-analysis | **Seniority:** mid | **Verb Context:** content
**Keywords:** feature importance, model interpretability, explainable AI, predictive factors, ML insights

**Scope:** predictive drivers across {featureCount} input variables used by {modelCount} trained models
**Result:** improving stakeholder interpretability by {interpretabilityIncrease}% and reducing black-box uncertainty by {uncertaintyReduction}%

**Variations:**
- **A (Standard):** Explained predictive drivers across {featureCount} input variables used by {modelCount} trained models, improving stakeholder interpretability by {interpretabilityIncrease}% and reducing black-box uncertainty by {uncertaintyReduction}%.
- **B (Result-first):** Achieved {interpretabilityIncrease}% higher stakeholder interpretability and {uncertaintyReduction}% lower black-box uncertainty by explaining drivers across {featureCount} variables.
- **C (Impact-led):** Delivered clearer model reasoning — improved interpretability by {interpretabilityIncrease}% and reduced black-box uncertainty by {uncertaintyReduction}% through feature-importance analysis.
- **D (Concise):** Explained drivers across {featureCount} variables for {modelCount} models — {interpretabilityIncrease}% higher interpretability, {uncertaintyReduction}% lower uncertainty.

**Variables:**
  - `{featureCount}`: 20 to 500, step 10 (integer)
  - `{modelCount}`: 2 to 20, step 1 (integer)
  - `{interpretabilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{uncertaintyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0128
**Role:** research-scientist | **Theme:** vision-transformers | **Seniority:** senior | **Verb Context:** systems
**Keywords:** vision transformers, image representation, deep learning, computer vision, AI research

**Scope:** vision transformer architectures across {datasetCount} image datasets containing {imageCount}+ labeled samples
**Result:** improving visual classification accuracy by {accuracyIncrease}% and reducing misclassification under visual noise by {noiseReduction}%

**Variations:**
- **A (Standard):** Trained vision transformer architectures across {datasetCount} image datasets containing {imageCount}+ labeled samples, improving visual classification accuracy by {accuracyIncrease}% and reducing misclassification under visual noise by {noiseReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher visual classification accuracy and {noiseReduction}% lower noise-driven misclassification by training vision transformers on {datasetCount} datasets.
- **C (Impact-led):** Delivered stronger computer vision performance — improved classification accuracy by {accuracyIncrease}% and reduced visual-noise errors by {noiseReduction}% through vision transformers.
- **D (Concise):** Trained vision transformers on {datasetCount} datasets with {imageCount}+ samples — {accuracyIncrease}% higher accuracy, {noiseReduction}% lower noise errors.

**Variables:**
  - `{datasetCount}`: 2 to 12, step 1 (integer)
  - `{imageCount}`: 100000 to 20000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{noiseReduction}`: 10 to 30, step 5 (percentage)

### AIML-0129
**Role:** mlops-engineer | **Theme:** alert-threshold-tuning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** alert thresholds, monitoring alerts, incident detection, MLOps, ops tuning

**Scope:** production monitoring alerts across {alertCount} detection rules covering {modelCount} deployed models
**Result:** reducing noisy alert volume by {noiseReduction}% and improving incident signal precision by {precisionIncrease}%

**Variations:**
- **A (Standard):** Tuned production monitoring alerts across {alertCount} detection rules covering {modelCount} deployed models, reducing noisy alert volume by {noiseReduction}% and improving incident signal precision by {precisionIncrease}%.
- **B (Result-first):** Achieved {noiseReduction}% lower noisy alert volume and {precisionIncrease}% higher incident signal precision by tuning {alertCount} alerting rules.
- **C (Impact-led):** Delivered cleaner operational alerting — reduced noisy alert volume by {noiseReduction}% and improved signal precision by {precisionIncrease}% through threshold tuning.
- **D (Concise):** Tuned {alertCount} alert rules for {modelCount} deployed models — {noiseReduction}% lower noise, {precisionIncrease}% higher signal precision.

**Variables:**
  - `{alertCount}`: 10 to 200, step 10 (integer)
  - `{modelCount}`: 3 to 50, step 1 (integer)
  - `{noiseReduction}`: 15 to 35, step 5 (percentage)
  - `{precisionIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0130
**Role:** data-scientist | **Theme:** customer-lifetime-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** customer lifetime value, LTV modeling, revenue prediction, cohort value, predictive analytics

**Scope:** lifetime value estimates across {cohortCount} customer cohorts covering {customerCount}+ accounts
**Result:** improving long-term value forecast accuracy by {accuracyIncrease}% and reducing revenue allocation uncertainty by {uncertaintyReduction}%

**Variations:**
- **A (Standard):** Projected lifetime value estimates across {cohortCount} customer cohorts covering {customerCount}+ accounts, improving long-term value forecast accuracy by {accuracyIncrease}% and reducing revenue allocation uncertainty by {uncertaintyReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher long-term value forecast accuracy and {uncertaintyReduction}% lower revenue allocation uncertainty by projecting value across {cohortCount} cohorts.
- **C (Impact-led):** Delivered stronger LTV forecasting — improved long-term value accuracy by {accuracyIncrease}% and reduced allocation uncertainty by {uncertaintyReduction}% through lifetime-value modeling.
- **D (Concise):** Projected value across {cohortCount} cohorts and {customerCount}+ accounts — {accuracyIncrease}% higher accuracy, {uncertaintyReduction}% lower uncertainty.

**Variables:**
  - `{cohortCount}`: 4 to 25, step 1 (integer)
  - `{customerCount}`: 10000 to 2000000, step 10000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{uncertaintyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0131
**Role:** machine-learning-engineer | **Theme:** tabular-model-optimization | **Seniority:** mid | **Verb Context:** systems
**Keywords:** tabular models, gradient boosting, structured data, predictive performance, ML optimization

**Scope:** structured-data models across {datasetCount} tabular datasets containing {recordCount}+ labeled rows
**Result:** improving tabular prediction accuracy by {accuracyIncrease}% and reducing model variance across folds by {varianceReduction}%

**Variations:**
- **A (Standard):** Optimized structured-data models across {datasetCount} tabular datasets containing {recordCount}+ labeled rows, improving tabular prediction accuracy by {accuracyIncrease}% and reducing model variance across folds by {varianceReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher tabular prediction accuracy and {varianceReduction}% lower fold variance by optimizing models across {datasetCount} structured datasets.
- **C (Impact-led):** Delivered stronger structured-data performance — improved tabular accuracy by {accuracyIncrease}% and reduced fold variance by {varianceReduction}% through model optimization.
- **D (Concise):** Optimized models across {datasetCount} tabular datasets with {recordCount}+ rows — {accuracyIncrease}% higher accuracy, {varianceReduction}% lower variance.

**Variables:**
  - `{datasetCount}`: 3 to 20, step 1 (integer)
  - `{recordCount}`: 50000 to 10000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{varianceReduction}`: 10 to 30, step 5 (percentage)

### AIML-0132
**Role:** research-scientist | **Theme:** contrastive-learning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** contrastive learning, representation learning, embedding training, self-supervised AI, deep learning

**Scope:** representation pairs across {pairCount} positive-negative training examples derived from {datasetCount} corpora
**Result:** improving embedding separation quality by {qualityIncrease}% and reducing semantic overlap errors by {overlapReduction}%

**Variations:**
- **A (Standard):** Aligned representation pairs across {pairCount} positive-negative training examples derived from {datasetCount} corpora, improving embedding separation quality by {qualityIncrease}% and reducing semantic overlap errors by {overlapReduction}%.
- **B (Result-first):** Achieved {qualityIncrease}% higher embedding separation quality and {overlapReduction}% lower semantic overlap errors by aligning {pairCount} training pairs.
- **C (Impact-led):** Delivered stronger representation learning — improved separation quality by {qualityIncrease}% and reduced semantic overlap errors by {overlapReduction}% through contrastive learning.
- **D (Concise):** Aligned {pairCount} training pairs from {datasetCount} corpora — {qualityIncrease}% higher separation quality, {overlapReduction}% lower overlap errors.

**Variables:**
  - `{pairCount}`: 100000 to 50000000, step 100000 (integer)
  - `{datasetCount}`: 2 to 15, step 1 (integer)
  - `{qualityIncrease}`: 15 to 35, step 5 (percentage)
  - `{overlapReduction}`: 10 to 30, step 5 (percentage)

### AIML-0133
**Role:** mlops-engineer | **Theme:** feature-drift-alerting | **Seniority:** mid | **Verb Context:** systems
**Keywords:** feature drift, data monitoring, drift alerts, production ML, MLOps

**Scope:** feature-distribution changes across {featureCount} monitored variables supporting {modelCount} deployed models
**Result:** improving drift response speed by {responseIncrease}% and reducing unnoticed distribution shifts by {shiftReduction}%

**Variations:**
- **A (Standard):** Alerted feature-distribution changes across {featureCount} monitored variables supporting {modelCount} deployed models, improving drift response speed by {responseIncrease}% and reducing unnoticed distribution shifts by {shiftReduction}%.
- **B (Result-first):** Achieved {responseIncrease}% faster drift response and {shiftReduction}% fewer unnoticed distribution shifts by alerting on {featureCount} monitored variables.
- **C (Impact-led):** Delivered stronger feature-drift awareness — improved response speed by {responseIncrease}% and reduced unnoticed shifts by {shiftReduction}% through drift alerting.
- **D (Concise):** Alerted on changes across {featureCount} variables for {modelCount} models — {responseIncrease}% faster response, {shiftReduction}% fewer unnoticed shifts.

**Variables:**
  - `{featureCount}`: 20 to 500, step 10 (integer)
  - `{modelCount}`: 3 to 30, step 1 (integer)
  - `{responseIncrease}`: 15 to 35, step 5 (percentage)
  - `{shiftReduction}`: 10 to 30, step 5 (percentage)

### AIML-0134
**Role:** data-scientist | **Theme:** demand-elasticity-modeling | **Seniority:** senior | **Verb Context:** systems
**Keywords:** elasticity modeling, price sensitivity, demand analysis, forecasting, causal analytics

**Scope:** demand elasticity across {productCount} product groups covering {transactionCount}+ transactions
**Result:** improving price-response accuracy by {accuracyIncrease}% and reducing pricing uncertainty by {uncertaintyReduction}%

**Variations:**
- **A (Standard):** Measured demand elasticity across {productCount} product groups covering {transactionCount}+ transactions, improving price-response accuracy by {accuracyIncrease}% and reducing pricing uncertainty by {uncertaintyReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher price-response accuracy and {uncertaintyReduction}% lower pricing uncertainty by measuring elasticity across {productCount} product groups.
- **C (Impact-led):** Delivered stronger pricing insight — improved price-response accuracy by {accuracyIncrease}% and reduced pricing uncertainty by {uncertaintyReduction}% through elasticity modeling.
- **D (Concise):** Measured elasticity across {productCount} product groups and {transactionCount}+ transactions — {accuracyIncrease}% higher accuracy, {uncertaintyReduction}% lower uncertainty.

**Variables:**
  - `{productCount}`: 5 to 100, step 5 (integer)
  - `{transactionCount}`: 100000 to 50000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{uncertaintyReduction}`: 10 to 30, step 5 (percentage)

### AIML-0135
**Role:** machine-learning-engineer | **Theme:** intent-classification | **Seniority:** mid | **Verb Context:** systems
**Keywords:** intent classification, NLP, user intent, text understanding, language models

**Scope:** user intent across {messageCount} text interactions spanning {intentCount} intent categories
**Result:** improving intent recognition accuracy by {accuracyIncrease}% and reducing routing misfires by {misfireReduction}%

**Variations:**
- **A (Standard):** Classified user intent across {messageCount} text interactions spanning {intentCount} intent categories, improving intent recognition accuracy by {accuracyIncrease}% and reducing routing misfires by {misfireReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher intent recognition accuracy and {misfireReduction}% fewer routing misfires by classifying {messageCount} text interactions.
- **C (Impact-led):** Delivered stronger intent understanding — improved recognition accuracy by {accuracyIncrease}% and reduced routing misfires by {misfireReduction}% through intent classification.
- **D (Concise):** Classified {messageCount} text interactions across {intentCount} categories — {accuracyIncrease}% higher accuracy, {misfireReduction}% fewer misfires.

**Variables:**
  - `{messageCount}`: 100000 to 50000000, step 100000 (integer)
  - `{intentCount}`: 5 to 100, step 5 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{misfireReduction}`: 10 to 30, step 5 (percentage)

### AIML-0136
**Role:** research-scientist | **Theme:** knowledge-graph-reasoning | **Seniority:** senior | **Verb Context:** systems
**Keywords:** knowledge graphs, graph reasoning, symbolic AI, entity relations, AI research

**Scope:** entity relations across {nodeCount} knowledge-graph nodes connected by {edgeCount}+ edges
**Result:** improving multi-hop inference accuracy by {accuracyIncrease}% and reducing incomplete reasoning paths by {pathReduction}%

**Variations:**
- **A (Standard):** Reasoned entity relations across {nodeCount} knowledge-graph nodes connected by {edgeCount}+ edges, improving multi-hop inference accuracy by {accuracyIncrease}% and reducing incomplete reasoning paths by {pathReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher multi-hop inference accuracy and {pathReduction}% fewer incomplete reasoning paths by reasoning over {nodeCount} graph nodes.
- **C (Impact-led):** Delivered stronger graph intelligence — improved inference accuracy by {accuracyIncrease}% and reduced incomplete reasoning paths by {pathReduction}% through knowledge-graph reasoning.
- **D (Concise):** Reasoned across {nodeCount} nodes and {edgeCount}+ edges — {accuracyIncrease}% higher accuracy, {pathReduction}% fewer incomplete paths.

**Variables:**
  - `{nodeCount}`: 10000 to 5000000, step 10000 (integer)
  - `{edgeCount}`: 50000 to 50000000, step 50000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{pathReduction}`: 10 to 30, step 5 (percentage)

### AIML-0137
**Role:** mlops-engineer | **Theme:** serving-capacity-planning | **Seniority:** mid | **Verb Context:** systems
**Keywords:** capacity planning, inference scaling, serving systems, traffic forecasting, MLOps

**Scope:** inference demand across {endpointCount} serving endpoints handling {requestCount}+ daily requests
**Result:** improving serving capacity forecast accuracy by {accuracyIncrease}% and reducing emergency scaling actions by {scalingReduction}%

**Variations:**
- **A (Standard):** Forecasted inference demand across {endpointCount} serving endpoints handling {requestCount}+ daily requests, improving serving capacity forecast accuracy by {accuracyIncrease}% and reducing emergency scaling actions by {scalingReduction}%.
- **B (Result-first):** Achieved {accuracyIncrease}% higher capacity forecast accuracy and {scalingReduction}% fewer emergency scaling actions by forecasting demand across {endpointCount} endpoints.
- **C (Impact-led):** Delivered stronger serving readiness — improved capacity forecast accuracy by {accuracyIncrease}% and reduced emergency scaling by {scalingReduction}% through demand forecasting.
- **D (Concise):** Forecasted demand across {endpointCount} endpoints handling {requestCount}+ daily requests — {accuracyIncrease}% higher accuracy, {scalingReduction}% fewer emergency actions.

**Variables:**
  - `{endpointCount}`: 3 to 50, step 1 (integer)
  - `{requestCount}`: 100000 to 50000000, step 100000 (integer)
  - `{accuracyIncrease}`: 15 to 35, step 5 (percentage)
  - `{scalingReduction}`: 10 to 30, step 5 (percentage)

### AIML-0138
**Role:** data-scientist | **Theme:** seasonality-detection | **Seniority:** mid | **Verb Context:** systems
**Keywords:** seasonality detection, time series decomposition, temporal patterns, forecasting, data science

**Scope:** seasonal signals across {seriesCount} temporal datasets containing {recordCount}+ observations
**Result:** improving recurring-pattern visibility by {visibilityIncrease}% and reducing forecast distortion from unmodeled seasonality by {distortionReduction}%

**Variations:**
- **A (Standard):** Isolated seasonal signals across {seriesCount} temporal datasets containing {recordCount}+ observations, improving recurring-pattern visibility by {visibilityIncrease}% and reducing forecast distortion from unmodeled seasonality by {distortionReduction}%.
- **B (Result-first):** Achieved {visibilityIncrease}% higher recurring-pattern visibility and {distortionReduction}% lower seasonality-driven forecast distortion by isolating signals across {seriesCount} datasets.
- **C (Impact-led):** Delivered clearer temporal pattern insight — improved recurring-pattern visibility by {visibilityIncrease}% and reduced unmodeled seasonality distortion by {distortionReduction}% through seasonality detection.
- **D (Concise):** Isolated seasonal signals across {seriesCount} datasets with {recordCount}+ observations — {visibilityIncrease}% higher visibility, {distortionReduction}% lower distortion.

**Variables:**
  - `{seriesCount}`: 10 to 300, step 10 (integer)
  - `{recordCount}`: 100000 to 50000000, step 100000 (integer)
  - `{visibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{distortionReduction}`: 10 to 30, step 5 (percentage)

### AIML-0139
**Role:** machine-learning-engineer | **Theme:** response-generation-guardrails | **Seniority:** mid | **Verb Context:** systems
**Keywords:** guardrails, response safety, LLM moderation, AI controls, safe generation

**Scope:** generated responses across {requestCount} model interactions filtered by {ruleCount} safety rules
**Result:** reducing unsafe response leakage by {leakageReduction}% and improving policy-compliant output rate by {complianceIncrease}%

**Variations:**
- **A (Standard):** Constrained generated responses across {requestCount} model interactions filtered by {ruleCount} safety rules, reducing unsafe response leakage by {leakageReduction}% and improving policy-compliant output rate by {complianceIncrease}%.
- **B (Result-first):** Achieved {leakageReduction}% lower unsafe response leakage and {complianceIncrease}% higher policy-compliant output rate by constraining {requestCount} model interactions with {ruleCount} rules.
- **C (Impact-led):** Delivered safer generative AI behavior — reduced unsafe leakage by {leakageReduction}% and improved compliant output rate by {complianceIncrease}% through response guardrails.
- **D (Concise):** Constrained {requestCount} model interactions with {ruleCount} safety rules — {leakageReduction}% lower leakage, {complianceIncrease}% higher compliance.

**Variables:**
  - `{requestCount}`: 100000 to 50000000, step 100000 (integer)
  - `{ruleCount}`: 10 to 500, step 10 (integer)
  - `{leakageReduction}`: 15 to 35, step 5 (percentage)
  - `{complianceIncrease}`: 10 to 30, step 5 (percentage)

### AIML-0140
**Role:** research-scientist | **Theme:** evaluation-harnesses | **Seniority:** senior | **Verb Context:** systems
**Keywords:** evaluation harness, benchmark pipelines, test suites, model assessment, AI research

**Scope:** model benchmarking across {suiteCount} evaluation suites running {testCount}+ automated test cases
**Result:** improving benchmark reproducibility by {reproducibilityIncrease}% and reducing inconsistent model comparisons by {comparisonReduction}%

**Variations:**
- **A (Standard):** Standardized model benchmarking across {suiteCount} evaluation suites running {testCount}+ automated test cases, improving benchmark reproducibility by {reproducibilityIncrease}% and reducing inconsistent model comparisons by {comparisonReduction}%.
- **B (Result-first):** Achieved {reproducibilityIncrease}% higher benchmark reproducibility and {comparisonReduction}% lower inconsistent model comparisons by standardizing {suiteCount} evaluation suites.
- **C (Impact-led):** Delivered more reliable AI assessment — improved benchmark reproducibility by {reproducibilityIncrease}% and reduced inconsistent comparisons by {comparisonReduction}% through evaluation harnesses.
- **D (Concise):** Standardized benchmarking across {suiteCount} suites with {testCount}+ test cases — {reproducibilityIncrease}% higher reproducibility, {comparisonReduction}% fewer inconsistent comparisons.

**Variables:**
  - `{suiteCount}`: 5 to 40, step 5 (integer)
  - `{testCount}`: 1000 to 500000, step 1000 (integer)
  - `{reproducibilityIncrease}`: 15 to 35, step 5 (percentage)
  - `{comparisonReduction}`: 10 to 30, step 5 (percentage)

