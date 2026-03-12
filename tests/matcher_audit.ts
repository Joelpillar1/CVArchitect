import { ATSEngine } from '../utils/ats-engine/engine';
import taxonomyData from '../Bullets/ats_keyword_dataset_10k_plus.json';

const identicalText = `
Software Engineer with experience in Java, Micro-services, and REST APIs. 
Proficient in Cross-Functional Collaboration and Project Management.
Experience with CI/CD pipelines and AWS.
`;

async function runAudit() {
    console.log("--- Starting ATS Matcher Audit ---");
    const engine = new ATSEngine(taxonomyData);
    
    // Test Case 1: Identical JD and Resume
    console.log("\nTesting Case 1: Identical JD and Resume");
    const result1 = engine.analyze(identicalText, identicalText);
    
    console.log(`Detected Industry: ${result1.detected_industry}`);
    console.log(`Score: ${result1.score_breakdown.overall_score}%`);
    console.log(`Matched Count: ${result1.matched_keywords.length}`);
    console.log(`Missing Count: ${result1.missing_keywords.length}`);
    
    if (result1.missing_keywords.length > 0) {
        console.log("Found FALSE MISSING keywords:");
        result1.missing_keywords.forEach(mk => {
            console.log(` - ${mk.job_keyword} (Category: ${mk.category})`);
        });
    } else {
        console.log("✅ Zero missing keywords as expected.");
    }

    // Test Case 2: Case and Hyphen variations
    const jd2 = "Expertise in Micro-services and cross-functional teams.";
    const resume2 = "Expertise in Microservices and cross functional teams.";
    console.log("\nTesting Case 2: Hyphen and Case variations");
    const result2 = engine.analyze(jd2, resume2);
    console.log(`Matched: ${result2.matched_keywords.map(k => k.job_keyword).join(', ')}`);
    console.log(`Missing: ${result2.missing_keywords.map(k => k.job_keyword).join(', ')}`);

    // Test Case 3: Plurals
    const jd3 = "Managing Project Managers and engineers.";
    const resume3 = "Managing Project Manager and engineer.";
    console.log("\nTesting Case 3: Plurals");
    const result3 = engine.analyze(jd3, resume3);
    console.log(`Matched: ${result3.matched_keywords.map(k => k.job_keyword).join(', ')}`);
    console.log(`Missing: ${result3.missing_keywords.map(k => k.job_keyword).join(', ')}`);
}

runAudit().catch(console.error);
