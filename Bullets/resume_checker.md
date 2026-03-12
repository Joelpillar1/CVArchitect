# Resume Match Checker - Domain Knowledge Library

This document tracks the industry-specific keywords, tools, and functional skills used by the CVArchitect Resume Match Checker.

## Overview
The Resume Match Checker uses a "Domain-Aware" matching engine. Instead of generic word matching, it cross-references job descriptions against this curated library of **3,560+ technical, creative, and management terms**.

## Industry Coverage
The engine is trained on 60+ specific industries and niches, including:

- **Technology**: Software Development, Data Analytics, AI/ML, Cybersecurity, Cloud/SaaS, Web3/Crypto, Gaming, Fintech, HealthTech, EdTech.
- **Finance**: Accounting, Investment Banking, VC/PE, Wealth Management, Insurance.
- **Healthcare**: Medical, Pharma/Biotech, Mental Health, Dental, Veterinary.
- **Creative & Media**: Marketing, Design, Film/TV, Music/Audio, Fashion, Publishing.
- **Operations & Logistics**: Supply Chain, Manufacturing, Automotive, Aviation, Energy, Utilities, Mining, Agriculture.
- **Services**: Human Resources, Customer Service, Recruitment, Consulting, Legal, Event Management.
- **Education**: Teaching, Research, Academic Administration.
- **Real Estate**: Construction, Property Development.
- **Public Sector**: Government, Nonprofits, Advocacy, Military/Defense.
- **Hospitality**: Food & Beverage, Retail/eCommerce, Travel/Tourism.

## Keyword Types
We look for three distinct types of matches:
1. **Hard Skills**: Domain-specific abilities (e.g., "Smart Contracts", "Actuarial Analysis").
2. **Tools & Technologies**: Software, APIs, and Platforms (e.g., "Figma", "SAP", "Kubernetes", "Epic").
3. **Core Competencies**: Functional keywords found in specific roles (e.g., "Stakeholder Management", "UX Prototyping").

## Data Implementation
The raw data provided in the previous version has been extracted and compiled into `l:/CVArchitect/utils/skillLibrary.ts` for real-time client-side performance.

---
*Maintained by the CVArchitect Engineering Team*
