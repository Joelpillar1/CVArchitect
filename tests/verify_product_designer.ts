const TAXONOMY_PATH = './Bullets/ats_keyword_dataset_10k_plus.json';

async function main() {
    console.log('--- ATS Engine Verification: Senior Product Designer ---');
    
    if (!fs.existsSync(TAXONOMY_PATH)) {
        console.error('Taxonomy file not found:', TAXONOMY_PATH);
        return;
    }

    const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
    const engine = new ATSEngine(taxonomy);

    const jdText = `
        Senior Product Designer
        We are looking for a Senior Product Designer to join our team. 
        You will work on design systems, create hi-fi prototypes in Figma, 
        and conduct user research. 
        Skills: UI/UX design, wireframing, interaction design.
        Requirements: Experience with Adobe Creative Suite and Sketch.
        Strong communication and collaboration skills are a must.
    `;

    const resumeText = `
        I am a Senior Product Designer with 5 years of experience.
        I specialize in UI/UX design and building complex design systems.
        Proficient in Figma, Sketch, and Adobe Creative Suite.
        Experienced in conducting user research and creating interactive prototypes.
        Strong collaborator with excellent communication skills.
    `;

    console.log('\nAnalyzing JD/Resume...');
    const result = engine.analyze(jdText, resumeText);

    console.log('\n--- Detection Results ---');
    console.log('Industry:', result.detected_industry);
    console.log('Roles:', result.detected_roles.join(', '));

    console.log('\n--- Scoring Results ---');
    console.log('Overall Score:', result.score_breakdown.overall_score + '%');
    console.log('Hard Skills:', result.score_breakdown.hard_skills + '%');
    console.log('Tools:', result.score_breakdown.tools + '%');
    console.log('Industry Terms:', result.score_breakdown.industry_terms + '%');

    console.log('\n--- Missing Keywords ---');
    result.missing_keywords.forEach(kw => {
        console.log(`- [${kw.category}] ${kw.job_keyword}`);
    });

    console.log('\n--- Matched Keywords ---');
    result.matched_keywords.slice(0, 5).forEach(kw => {
        console.log(`+ [${kw.category}] ${kw.job_keyword} (Matched as: ${kw.matched_as})`);
    });

    if (result.detected_industry === 'Design / Creative' && result.detected_roles.includes('product designer')) {
        console.log('\n✅ SUCCESS: Correct industry and role detected!');
    } else {
        console.log('\n❌ FAILURE: Detection failed or incorrect.');
    }
}

main().catch(console.error);
