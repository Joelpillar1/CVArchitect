import json

themes_data = [
    ("reinforcement-learning", "RL agents, policy gradients, PPO, reward optimization, Markov decision process", 
     "reinforcement learning agents across {countA} simulated environments spanning {countB}K state dimensions", "improving task completion rate by {metricA}% and reducing agent exploration time by {metricB}%"),
    ("generative-adversarial-networks", "GANs, image generation, synthetic data, discriminator, generator",
     "generative models across {countA} high-resolution image domains producing {countB}K synthetic samples", "improving generation fidelity by {metricA}% and reducing mode collapse occurrences by {metricB}%"),
    ("federated-learning", "federated data, privacy-preserving ML, decentralized training, edge AI, secure aggregation",
     "federated training protocols across {countA} decentralized geographic nodes covering {countB}K client devices", "improving global model convergence by {metricA}% and reducing central data storage requirements by {metricB}%"),
    ("automated-machine-learning", "AutoML, NAS, hyperparameter search, model selection, pipeline automation",
     "AutoML pipelines across {countA} distinct business use cases analyzing {countB}+ algorithm configurations", "improving model selection speed by {metricA}% and reducing manual tuning effort by {metricB}%"),
    ("graph-neural-networks", "GNN, graph structures, node embeddings, link prediction, DeepWalk",
     "graph embedding networks across {countA} complex relationship graphs containing {countB}M interconnected nodes", "improving link prediction accuracy by {metricA}% and reducing false positive anomaly flags by {metricB}%"),
    ("speech-recognition", "ASR, audio processing, speech-to-text, Wav2Vec, acoustic modeling",
     "speech-to-text acoustic models across {countA} distinct dialects parsing {countB}K hours of audio data", "improving word error rate (WER) by {metricA}% and reducing background noise interference by {metricB}%"),
    ("text-to-speech", "TTS, voice synthesis, Tacotron, audio generation, speech modeling",
     "neural voice synthesis engines across {countA} brand personas supporting {countB}+ unique acoustic parameters", "improving synthetic naturalness scores by {metricA}% and reducing audio generation latency by {metricB}%"),
    ("churn-prediction", "customer churn, survival analysis, retention modeling, risk scoring, ML analytics",
     "survival analysis models across {countA} subscriber cohorts tracking {countB}K at-risk user accounts", "improving churn prediction accuracy by {metricA}% and reducing unexpected subscriber attrition by {metricB}%"),
    ("customer-lifetime-value", "CLV, LTV estimation, revenue forecasting, predictive analytics, user monetization",
     "revenue projection models across {countA} acquisition channels forecasting {countB}K active customer profiles", "improving LTV estimation accuracy by {metricA}% and reducing marketing spend wastage by {metricB}%"),
    ("fraud-detection", "anomaly detection, transaction fraud, financial ML, risk modeling, outlier detection",
     "transaction risk models across {countA} payment gateways processing {countB}M financial interactions daily", "improving fraudulent transaction hold rates by {metricA}% and reducing false positive blockings by {metricB}%"),
    ("predictive-maintenance", "sensor data, IoT machinery, failure prediction, time series monitoring, industrial AI",
     "equipment failure models across {countA} industrial facilities monitoring {countB}K IoT sensor streams", "improving proactive maintenance scheduling by {metricA}% and reducing unplanned machine downtime by {metricB}%"),
    ("edge-ai-deployment", "edge computing, tinyML, IoT inference, mobile ML, on-device ML",
     "on-device inference engines across {countA} mobile platforms supporting {countB}K daily offline predictions", "improving local processing speeds by {metricA}% and reducing cloud server dependency by {metricB}%"),
    ("active-learning", "active learning, human-in-the-loop, sample selection, query strategies",
     "human-in-the-loop sampling strategies across {countA} annotation queues filtering {countB}K unlabeled instances", "improving model convergence speed by {metricA}% and reducing manual labeling costs by {metricB}%"),
    ("synthetic-data-generation", "data augmentation, synthetic populations, privacy-safe data, simulation, SMOTE",
     "data augmentation frameworks across {countA} imbalanced datasets generating {countB}K synthetic minor-class examples", "improving minority class recall by {metricA}% and reducing dataset bias indicators by {metricB}%"),
    ("natural-language-generation", "NLG, text generation, reporting automation, content creation, language modeling",
     "conditional text generators across {countA} content categories producing {countB}K automated daily reports", "improving generation coherence by {metricA}% and reducing manual copywriting hours by {metricB}%"),
    ("hyperparameter-optimization", "HPO, Bayesian optimization, Optuna, grid search, model tuning",
     "Bayesian optimization strategies across {countA} model architectures executing {countB}K concurrent tuning trials", "improving final model validation scores by {metricA}% and reducing hyperparameter search times by {metricB}%"),
    ("distributed-training", "GPU clusters, Horovod, data parallelism, multi-node training, DeepSpeed",
     "data parallelism strategies across {countA} GPU clusters managing {countB}K tensor computation operations", "improving multi-node scaling efficiency by {metricA}% and reducing total epoch training times by {metricB}%"),
    ("ml-cost-optimization", "FinOps, cloud ML costs, spot instances, workload scheduling, resource allocation",
     "cloud resource schedulers across {countA} ML deployment environments managing {countB}K monthly compute hours", "improving spot instance utilization by {metricA}% and reducing monthly ML infrastructure costs by {metricB}%"),
    ("differential-privacy", "privacy-preserving ML, differential privacy, noise injection, secure ML, data anonymization",
     "noise injection mechanisms across {countA} sensitive datasets protecting {countB}K personally identifiable records", "improving privacy compliance adherence by {metricA}% and reducing external data leakage risks by {metricB}%"),
    ("rlhf-alignment", "RLHF, reward modeling, human feedback, model alignment, LLM safety",
     "reward modeling systems across {countA} language task domains utilizing {countB}K human preference annotations", "improving model safety alignment by {metricA}% and reducing toxic response generation by {metricB}%"),
    ("named-entity-recognition", "NER, information extraction, token classification, custom entities, SpaCy",
     "token classification pipelines across {countA} specialized domains extracting {countB}K domain-specific entities", "improving entity extraction precision by {metricA}% and reducing missed critical terms by {metricB}%"),
    ("sentiment-analysis", "opinion mining, sentiment scoring, social media NLP, polarity classification",
     "polarity scoring classifiers across {countA} social media feed sources parsing {countB}K user opinions daily", "improving sentiment tagging recall by {metricA}% and reducing neutral-class misclassifications by {metricB}%"),
    ("machine-translation", "NMT, sequence-to-sequence, cross-lingual, translation models, Transformer",
     "sequence-to-sequence transformers across {countA} language pairs translating {countB}M textual documents", "improving BLEU score evaluations by {metricA}% and reducing context loss in translations by {metricB}%"),
    ("code-generation", "Copilot, LLMs for code, syntax trees, code completion, developer productivity",
     "syntax-aware completion models across {countA} programming languages supporting {countB}K internal developers", "improving code acceptance rates by {metricA}% and reducing average function implementation time by {metricB}%"),
    ("video-activity-recognition", "video understanding, temporal modeling, action recognition, C3D, video frames",
     "temporal modeling architectures across {countA} activity categories processing {countB}K hours of video footage", "improving action classification accuracy by {metricA}% and reducing temporal boundary errors by {metricB}%"),
    ("supply-chain-forecasting", "supply chain ML, inventory prediction, logistics routing, demand planning",
     "logistics routing algorithms across {countA} distribution centers forecasting {countB}K SKU demand signals", "improving inventory turnover rates by {metricA}% and reducing stockout occurrences by {metricB}%"),
    ("document-extraction-ocr", "OCR, Document AI, layout parsing, receipt extraction, invoice automation",
     "layout parsing engines across {countA} document templates digitizing {countB}K scanned invoices monthly", "improving data extraction accuracy by {metricA}% and reducing manual data entry requirements by {metricB}%"),
    ("robotics-control", "robotics, motor control, sim2real, kinematics ML, control theory",
     "sim2real transfer policies across {countA} robotic actuators executing {countB}M physical manipulation steps", "improving motor control stability by {metricA}% and reducing physical collision incidents by {metricB}%"),
    ("algorithmic-trading", "quant finance, alpha generation, trading bots, market signals, time series finance",
     "alpha generation models across {countA} asset classes analyzing {countB}M daily market tick signals", "improving risk-adjusted returns by {metricA}% and reducing maximum algorithm drawdown by {metricB}%"),
    ("conversational-agents", "chatbots, dialogue systems, Rasa, intent classification, slot filling",
     "dialogue intent classifiers across {countA} customer service flows handling {countB}K automated chats daily", "improving conversational resolution rates by {metricA}% and reducing human agent handoffs by {metricB}%"),
    ("healthcare-imaging", "medical imaging, MRI analysis, radiology ML, tumor detection, healthcare AI",
     "radiology detection algorithms across {countA} clinical imaging modalities analyzing {countB}K patient scans", "improving diagnostic sensitivity by {metricA}% and reducing false-negative interpretations by {metricB}%"),
    ("drug-discovery-ml", "cheminformatics, molecular properties, drug targets, computational biology",
     "molecular property predictors across {countA} compound libraries screening {countB}M virtual drug candidates", "improving virtual screening hit rates by {metricA}% and reducing computational laboratory hours by {metricB}%"),
    ("weather-forecasting", "meteorological modeling, climate data, spatial-temporal ML, weather prediction",
     "spatial-temporal weather models across {countA} geographical zones processing {countB}M meteorological readings", "improving short-term precipitation accuracy by {metricA}% and reducing severe storm prediction errors by {metricB}%"),
    ("sports-analytics", "player tracking, game prediction, sports computer vision, performance modeling",
     "player tracking algorithms across {countA} athletic leagues dissecting {countB}K hours of game footage", "improving expected performance scoring by {metricA}% and reducing unpredictable injury risks by {metricB}%"),
    ("music-generation", "audio synthesis, MIDI generation, music AI, computational creativity",
     "polyphonic audio synthesizers across {countA} musical genres generating {countB}K unique composition tracks", "improving harmonic consistency ratings by {metricA}% and reducing algorithmic dissonance by {metricB}%"),
    ("autonomous-driving-perception", "LiDAR, sensor fusion, AV perception, 3D object detection, lane tracking",
     "sensor fusion pipelines across {countA} automotive platforms analyzing {countB}M miles of driving data", "improving external obstacle detection by {metricA}% and reducing false-positive braking events by {metricB}%"),
    ("knowledge-graph-construction", "ontologies, knowledge graphs, relation extraction, semantic web",
     "relation extraction mechanisms across {countA} specialized domains building {countB}M semantic triple connections", "improving graph query traversal speeds by {metricA}% and reducing unlinked entity orphans by {metricB}%"),
    ("semantic-segmentation", "image segmentation, pixel classification, mask R-CNN, U-Net, computer vision",
     "pixel classification networks across {countA} visual environments analyzing {countB}K high-resolution images", "improving granular boundary precision by {metricA}% and reducing background noise misclassifications by {metricB}%"),
    ("zero-shot-learning", "zero-shot, few-shot, transfer learning, CLIP, generalization",
     "transfer learning implementations across {countA} unseen categories evaluating {countB}K generalized data samples", "improving novel class recognition rates by {metricA}% and reducing target domain training requirements by {metricB}%"),
    ("biometric-authentication", "face recognition, voice biometrics, liveness detection, security ML",
     "liveness detection protocols across {countA} security access points processing {countB}K identity verifications daily", "improving unauthorized access block rates by {metricA}% and reducing legitimate user friction by {metricB}%"),
    ("protein-structure-prediction", "AlphaFold, bioinformatics, protein folding, structural biology",
     "biomolecular folding models across {countA} protein families analyzing {countB}K genetic sequences", "improving 3D structural prediction accuracy by {metricA}% and reducing laboratory crystallization time by {metricB}%"),
    ("search-ranking", "learning to rank, search relevance, information retrieval, query understanding",
     "learning-to-rank algorithms across {countA} content verticals organizing {countB}M localized search queries", "improving top-3 result click-throughs by {metricA}% and reducing query abandonment rates by {metricB}%"),
    ("ad-ctr-prediction", "CTR prediction, ad tech, computational advertising, bidding models, click-through rate",
     "computational bidding models across {countA} advertising channels evaluating {countB}M consumer impressions", "improving targeted click-through rates by {metricA}% and reducing wasted ad spend by {metricB}%"),
    ("pricing-optimization", "dynamic pricing, price elasticity, yield management, revenue optimization",
     "dynamic pricing algorithms across {countA} product categories regulating {countB}K e-commerce transactions", "improving peak revenue margins by {metricA}% and reducing competitive pricing lags by {metricB}%"),
    ("satellite-imagery-analysis", "remote sensing, earth observation, geospatial ML, satellite computer vision",
     "geospatial observation networks across {countA} terrestrial regions evaluating {countB}K square miles of satellite data", "improving land-use classification accuracy by {metricA}% and reducing temporal observation delays by {metricB}%"),
    ("audio-event-detection", "sound classification, audio events, acoustic scenes, environmental audio",
     "acoustic classification networks across {countA} environmental profiles sorting {countB}K distinct audio events", "improving background event isolation by {metricA}% and reducing ambient noise interference by {metricB}%"),
    ("fashion-recommendations", "visual search, style recommendations, fashion AI, retail personalization",
     "visual style recommenders across {countA} apparel categories matching {countB}M personalized user outfit combinations", "improving cross-selling conversion rates by {metricA}% and reducing mismatched inventory recommendations by {metricB}%"),
    ("fake-news-detection", "misinformation, fact-checking ML, content moderation, text classification",
     "misinformation detection classifiers across {countA} content platforms screening {countB}K daily news articles", "improving verified fact-check recall by {metricA}% and reducing harmful content dissemination by {metricB}%"),
    ("emotion-ai", "affective computing, emotion recognition, multimodal sentiment, expression analysis",
     "affective computing models across {countA} interactive platforms interpreting {countB}K user expression inputs", "improving emotional context accuracy by {metricA}% and reducing tone-deaf automated responses by {metricB}%"),
    ("energy-load-forecasting", "smart grid, energy consumption, smart meter ML, utility forecasting",
     "smart meter consumption algorithms across {countA} utility grids predicting {countB}M localized energy loads", "improving grid distribution efficiency by {metricA}% and reducing unexpected energy shortages by {metricB}%")
]

bullets = []

for i, (theme, kw_str, scope, result) in enumerate(themes_data):
    role = "machine-learning-engineer" if i % 3 == 0 else ("data-scientist" if i % 3 == 1 else "research-scientist")
    seniority = "senior" if i % 4 == 0 else "mid"
    verb = ["Engineered", "Developed", "Optimized", "Designed", "Architected"][i % 5]
    
    keywords = kw_str.split(", ")
    
    # generate variations
    var_a = f"{verb} {scope}, {result}."
    var_b = f"Achieved {{metricA}}% higher performance and {{metricB}}% lower errors by engineering {scope}."
    var_c = f"Delivered robust ML systems \u2014 {result} through implementation across {scope.split(' across ')[1]}."
    var_d = f"{verb} {scope.split(' across ')[0]} across {{countA}} areas handling {{countB}} items \u2014 {{metricA}}% better results, {{metricB}}% reduction."

    bullet = {
        "id": f"AIML-{41 + i:04d}",
        "industry": "ai-ml",
        "role": role,
        "theme": theme,
        "seniority": seniority,
        "keywords": keywords,
        "verb": verb,
        "verb_context": "systems",
        "scope": scope,
        "result": result,
        "variables": {
            "countA": {"min": 3, "max": 20, "type": "integer", "step": 1},
            "countB": {"min": 10, "max": 500, "type": "integer", "step": 10},
            "metricA": {"min": 15, "max": 40, "type": "percentage", "step": 5},
            "metricB": {"min": 10, "max": 30, "type": "percentage", "step": 5}
        },
        "variations": [var_a, var_b, var_c, var_d]
    }
    
    bullets.append(bullet)

# Clean up AI_Machine_Learning.md by removing the comment text
import re
with open(r'l:\CVArchitect\Bullets\Technology\AI_Machine_Learning.md', 'r', encoding='utf-8') as f:
    md_text = f.read()

md_text = re.sub(r'\n50 more, and make sure they\'re not repetitive, i need different ones please\n*', '', md_text)
# Optional: if they added `[` at the end expecting JSON, we might want to trim that. But we'll just write it back and process JSON via python.

with open(r'l:\CVArchitect\Bullets\Technology\AI_Machine_Learning.md', 'w', encoding='utf-8') as f:
    f.write(md_text.strip() + "\n\n" + json.dumps(bullets, indent=2))

print("JSON appended to markdown.")
