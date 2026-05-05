export interface BulletTemplate {
  text: string;
  role_tags: string[];
  industry_tags: string[];
  keywords: string[];
}

export const SUGGESTED_BULLETS: BulletTemplate[] = [
  // TECHNOLOGY
  {
    text: "Architected and implemented a high-performance microservices architecture using React and Node.js, improving system scalability by 40% and reducing latency by 150ms.",
    role_tags: ["software-engineer", "frontend-developer", "backend-developer", "full-stack-developer", "engineer"],
    industry_tags: ["software-tech", "cloud-saas", "technology"],
    keywords: ["React", "Node.js", "Microservices", "Scalability", "Latency", "TypeScript", "JavaScript"]
  },
  {
    text: "Led a cross-functional team of 6 engineers to deliver a cloud-native SaaS platform on AWS, utilizing Docker and Kubernetes for automated deployment and container orchestration.",
    role_tags: ["software-engineer", "devops-engineer", "tech-lead", "cloud-architect", "engineer"],
    industry_tags: ["software-tech", "cloud-saas", "technology"],
    keywords: ["AWS", "Docker", "Kubernetes", "SaaS", "Cloud-native", "Infrastructure", "Cloud"]
  },
  {
    text: "Optimized SQL database performance through advanced indexing and query refactoring, resulting in a 60% reduction in reporting generation time for 10k+ daily active users.",
    role_tags: ["software-engineer", "backend-developer", "data-engineer", "database-administrator", "engineer"],
    industry_tags: ["software-tech", "data-analytics", "fintech", "technology"],
    keywords: ["SQL", "Database Optimization", "Indexing", "Performance", "PostgreSQL", "MySQL", "Database"]
  },
  {
    text: "Developed and executed complex ETL pipelines using Python and Spark to process 1TB+ of telemetry data, enabling real-time business intelligence dashboards.",
    role_tags: ["data-engineer", "data-scientist", "data-analyst", "bi-developer"],
    industry_tags: ["data-analytics", "ai-ml", "software-tech", "technology"],
    keywords: ["Python", "Spark", "ETL", "Business Intelligence", "Big Data", "Data Pipeline", "Analytics"]
  },
  {
    text: "Designed and implemented responsive UI components using CSS and JavaScript, following accessibility standards (WCAG) and improving user engagement metrics by 25%.",
    role_tags: ["frontend-developer", "web-developer", "ui-developer", "designer"],
    industry_tags: ["software-tech", "marketing-growth", "digital-marketing", "technology"],
    keywords: ["JavaScript", "CSS", "UI", "Accessibility", "Responsive Design", "User Engagement", "HTML"]
  },
  // PRODUCT & PROJECT
  {
    text: "Defined product roadmap and managed complete SDLC for a mobile application with 100k+ downloads, utilizing Agile/Scrum methodologies to ensure on-time delivery.",
    role_tags: ["product-manager", "project-manager", "product-owner", "manager"],
    industry_tags: ["product-management", "software-tech", "mobile-apps", "technology"],
    keywords: ["Product Roadmap", "SDLC", "Agile", "Scrum", "Mobile App", "Project Management", "Product Strategy"]
  },
  {
    text: "Conducted extensive A/B testing and user research to iterate on core product features, driving a 25% increase in user retention and 15% growth in MAU.",
    role_tags: ["product-manager", "growth-manager", "ux-researcher", "product-analyst", "manager"],
    industry_tags: ["product-management", "marketing-growth", "technology"],
    keywords: ["A/B Testing", "User Research", "Retention", "MAU", "Data-driven", "Product Analytics"]
  },
  // SALES & MARKETING
  {
    text: "Spearheaded a data-driven SEO and SEM strategy that increased organic traffic by 200% and reduced Customer Acquisition Cost (CAC) by 30% within 6 months.",
    role_tags: ["marketing-manager", "growth-manager", "seo-specialist", "digital-marketer", "manager"],
    industry_tags: ["marketing-growth", "sales-bizdev", "marketing"],
    keywords: ["SEO", "SEM", "CAC", "Growth", "Organic Traffic", "ROI", "Marketing Strategy"]
  },
  {
    text: "Managed a $50k+ monthly PPC budget across Google Ads and LinkedIn, consistently maintaining a 4.5x ROAS and generating 500+ qualified leads per month.",
    role_tags: ["marketing-manager", "digital-marketing-specialist", "performance-marketer", "manager"],
    industry_tags: ["marketing-growth", "advertising", "marketing"],
    keywords: ["PPC", "Google Ads", "LinkedIn Ads", "ROAS", "Lead Generation", "Analytics", "Digital Marketing"]
  },
  {
    text: "Consistently exceeded quarterly sales targets by 120%, managing a pipeline of $1M+ and closing 15+ enterprise-level deals using Salesforce CRM.",
    role_tags: ["sales-manager", "account-executive", "business-development", "sales-director", "manager"],
    industry_tags: ["sales-bizdev", "software-tech", "finance-accounting", "sales"],
    keywords: ["Sales Targets", "Enterprise Sales", "Salesforce", "CRM", "Pipeline Management", "B2B Sales", "Business Development"]
  },
  // FINANCE
  {
    text: "Automated monthly financial reporting and budgeting processes using advanced Excel models and VBA, saving 20+ manual labor hours per month.",
    role_tags: ["finance-analyst", "accountant", "finance-manager", "financial-controller", "analyst"],
    industry_tags: ["finance-accounting", "fintech", "operations-logistics", "finance"],
    keywords: ["Excel", "VBA", "Financial Reporting", "Budgeting", "Automation", "Financial Modeling", "Reporting"]
  },
  {
    text: "Conducted detailed financial variance analysis and risk assessments for a $10M+ portfolio, identifying $500k in potential cost savings.",
    role_tags: ["finance-analyst", "finance-manager", "risk-analyst", "analyst"],
    industry_tags: ["finance-accounting", "investment-banking", "finance"],
    keywords: ["Financial Analysis", "Variance Analysis", "Risk Assessment", "Cost Savings", "Auditing", "Financial Risk"]
  },
  // OPERATIONS
  {
    text: "Optimized supply chain logistics by renegotiating vendor contracts and implementing a new inventory management system, reducing overhead by 15%.",
    role_tags: ["operations-manager", "supply-chain-manager", "logistics-coordinator", "manager"],
    industry_tags: ["operations-logistics", "manufacturing", "operations"],
    keywords: ["Supply Chain", "Logistics", "Inventory Management", "Vendor Management", "Cost Reduction", "Operations"]
  },
  // GENERIC / CROSS-INDUSTRY FALLBACKS
  {
    text: "Facilitated cross-functional collaboration between design, engineering, and marketing teams to streamline project delivery and improve communication.",
    role_tags: ["manager", "lead", "coordinator"],
    industry_tags: ["cross-industry", "general"],
    keywords: ["Collaboration", "Stakeholder Management", "Communication", "Cross-functional", "Project Delivery"]
  },
  {
    text: "Implemented new workflow automation tools and standardized documentation processes, resulting in a 20% increase in team productivity.",
    role_tags: ["analyst", "specialist", "coordinator"],
    industry_tags: ["cross-industry", "general"],
    keywords: ["Automation", "Workflow", "Productivity", "Documentation", "Process Improvement"]
  }
];
