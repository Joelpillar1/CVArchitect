import json
import os

source_file = r'l:\CVArchitect\Bullets\ats_keyword_dataset_10k_plus.json'
output_dir = r'l:\CVArchitect\data\ats-taxonomy'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(source_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. industries.json
# Master list of industries with basic metadata
industries_master = []
for ind in data.get('industries', []):
    industries_master.append({
        "industry_id": ind.get("industry_id"),
        "industry_name": ind.get("industry_name"),
        "category": ind.get("category"),
        "prefix": ind.get("prefix"),
        "core_keywords": ind.get("core_keywords", []),
        "tools": ind.get("tool_detection", [])
    })

with open(os.path.join(output_dir, 'industries.json'), 'w', encoding='utf-8') as f:
    json.dump(industries_master, f, indent=2)

# 2. roles-by-industry.json
# Group roles by their industry_id
roles_by_industry = {}
for ind in data.get('industries', []):
    roles_by_industry[ind["industry_id"]] = ind.get("roles", [])

with open(os.path.join(output_dir, 'roles-by-industry.json'), 'w', encoding='utf-8') as f:
    json.dump(roles_by_industry, f, indent=2)

# 3. synonyms.json
# Global synonym map
synonyms = data.get('global', {}).get('ats_synonyms', {})
with open(os.path.join(output_dir, 'synonyms.json'), 'w', encoding='utf-8') as f:
    json.dump(synonyms, f, indent=2)

# 4. semantic-clusters.json
# Semantic clusters for skill mapping
semantic_clusters = data.get('global', {}).get('skill_clusters', {})
with open(os.path.join(output_dir, 'semantic-clusters.json'), 'w', encoding='utf-8') as f:
    json.dump(semantic_clusters, f, indent=2)

# 5. ignored-generic-terms.json
# Terms to ignore unless part of a strong phrase
ignored_terms = [
    "the", "and", "for", "with", "to", "in", "of", "on", "at", "is", "are", 
    "from", "this", "that", "your", "will", "have", "more", "about", "they", 
    "their", "built", "managed", "worked", "helped", "led", "team", "professional",
    "experienced", "qualified", "results", "responsible", "duties", "included"
]
with open(os.path.join(output_dir, 'ignored-generic-terms.json'), 'w', encoding='utf-8') as f:
    json.dump({"ignored_terms": ignored_terms}, f, indent=2)

# 6. sample-test-cases.json
# Generate some test cases across industries
test_cases = [
    {
        "name": "Senior Software Engineer - FinTech",
        "jd": "Seeking a Senior Software Engineer with expertise in Java, microservices, and REST APIs. Experience with AWS and CI/CD pipelines is required. Knowledge of financial modeling is a plus.",
        "resume": "Experienced engineer with 5 years in Java development. Built scalable microservices using Spring Boot and connected via REST APIs. Deployed to AWS using Jenkins CI/CD. Strong background in finance modeling and valuation.",
        "expected_industry": "Software / Tech",
        "expected_roles": ["software engineer"]
    },
    {
        "name": "Marketing Manager - E-commerce",
        "jd": "We need a Marketing Manager to drive lead generation and conversion optimization. Proficiency in SEO, Google Ads, and HubSpot is essential. Strong stakeholder management skills required.",
        "resume": "Performance-driven marketer with a focus on SEO and Google Ads. Successfully increased lead generation by 40%. used HubSpot for campaign tracking and managed cross-functional stakeholders.",
        "expected_industry": "Marketing / Advertising",
        "expected_roles": ["marketing manager"]
    }
]
with open(os.path.join(output_dir, 'sample-test-cases.json'), 'w', encoding='utf-8') as f:
    json.dump(test_cases, f, indent=2)

print("Taxonomy files created successfully in l:\\CVArchitect\\data\\ats-taxonomy")
