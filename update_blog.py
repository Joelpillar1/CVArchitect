import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "slug: 'student-resume-no-experience-guide'," in line:
        start_idx = i - 1 # Include the '{'
        break

if start_idx != -1:
    for i in range(start_idx + 1, len(lines)):
        if "slug: 'how-to-write-resume-step-by-step'," in lines[i]:
            end_idx = i - 1 # Include the '{' of the next object
            break

if start_idx != -1 and end_idx != -1:
    new_article = """    {
        slug: 'student-resume-no-experience-guide',
        title: 'How to Write a Student Resume With No Work Experience (And Still Get Hired)',
        metaTitle: 'Student Resume With No Experience: Complete Guide & Examples (2026) | CV Architect',
        metaDescription: 'Step-by-step guide to writing a student resume or first job resume with no work experience. Includes real examples, templates, and what to put on your resume when you have no experience.',
        excerpt: 'Everyone needs experience to get hired, but you need a job to get experience. Here is how to break out of that loop with a student resume that actually lands interviews.',
        category: 'Career Advice',
        author: 'CV Architect Team',
        publishDate: '2026-01-05',
        readTime: '18 min read',
        featured: false,
        tags: ['student resume', 'resume for students with no experience', 'college resume template', 'internship resume template', 'first job resume', 'resume for teenager', 'resume examples for first job', 'student resume template'],
        coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
        content: [
            {
                type: 'paragraph',
                content: 'If you are a high school student, college student, or recent graduate staring at a blank resume wondering what to put on it, you are not alone. "How do I write a resume when I have no experience?" is the single most common frustration among early-career job seekers. The paradox of the entry-level job market is deeply annoying: you need experience to get a job, but you need a job to get experience.'
            },
            {
                type: 'paragraph',
                content: 'But here is the truth that recruiters know but students often do not: you have more experience than you think. A student resume with no work experience does not have to be empty or weak. The students who successfully land those coveted first jobs and internships are not necessarily the ones with the most natural talent. They are the ones who know how to extract, frame, and present the experience they already have.'
            },
            {
                type: 'heading',
                content: '1. Shift Your Mindset: Experience vs. Employment'
            },
            {
                type: 'paragraph',
                content: 'The biggest mistake students make is equating "experience" exclusively with "formal, paid employment." Employers hiring for entry-level roles do not expect you to have a 5-year corporate work history. What they are actually looking for is evidence of transferable skills, potential, reliability, and the ability to learn.'
            },
            {
                type: 'paragraph',
                content: 'When writing a student resume, you must expand your definition of experience to include everything you have done that required organization, teamwork, problem-solving, or technical skills.'
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Student Resume Example Full View',
                content: 'A complete, optimized student resume template that focuses on education, projects, and skills rather than traditional work history.'
            },
            {
                type: 'heading',
                content: '2. The Best Resume Format for Students'
            },
            {
                type: 'paragraph',
                content: 'Professional resumes typically follow a strict reverse-chronological format where Work Experience is front and center. For a student resume with no work experience, you need to flip this hierarchy to highlight your strongest assets first.'
            },
            {
                type: 'subheading',
                content: 'Recommended Section Order:'
            },
            {
                type: 'list',
                items: [
                    '1. Contact Information',
                    '2. Professional Summary or Objective (Optional but recommended)',
                    '3. Education (Your strongest asset)',
                    '4. Major Projects / Academic Experience',
                    '5. Extracurriculars & Leadership',
                    '6. Skills',
                    '7. Volunteer Work / Certifications'
                ]
            },
            {
                type: 'paragraph',
                content: 'Keep it to exactly one page. Early-career resumes should never exceed a single page. If it spills over, you are including unnecessary filler.'
            },
            {
                type: 'heading',
                content: '3. Nailing the Contact Information'
            },
            {
                type: 'paragraph',
                content: 'Your contact section should be clean, professional, and free of physical addresses. Include your First and Last Name, a professional email address (preferably your university email (.edu) or a simple firstname.lastname@gmail.com format), your phone number, and a link to your optimized LinkedIn profile.'
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Contact Info 1.png',
                alt: 'Student Resume Contact Section Example',
                content: 'A clean header for a first job resume.'
            },
            {
                type: 'paragraph',
                content: 'If you are applying for creative, design, or technical roles (like a Software Engineering internship), absolutely include a link to your GitHub, Dribbble, or personal portfolio website.'
            },
            {
                type: 'heading',
                content: '4. Writing a Powerful Student Resume Summary'
            },
            {
                type: 'paragraph',
                content: 'Most students write terrible, generic objective statements like: "Hardworking college student seeking to leverage my skills in an entry-level position to help the company grow." This tells the employer nothing.'
            },
            {
                type: 'paragraph',
                content: 'Instead, write a Summary that acts as your elevator pitch. Focus on your academic background, core skills, and specific career direction.'
            },
            {
                type: 'list',
                items: [
                    'POOR: "Recent graduate looking for a marketing internship."',
                    'GOOD: "Senior Marketing major at NYU with hands-on coursework experience in social media analytics, consumer behavior, and content strategy. Completed a capstone project utilizing Google Analytics and HubSpot to increase hypothetical brand engagement by 15%. Eager to apply SEO and digital campaign skills in a fast-paced agency internship."'
                ]
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Professional Summary.png',
                alt: 'Student Professional Summary Example',
                content: 'Tailoring the summary to highlight academic context and precise target roles.'
            },
            {
                type: 'heading',
                content: '5. Maximizing Your Education Section'
            },
            {
                type: 'paragraph',
                content: 'When you lack work experience, your education is your heaviest hitter. Do not just list your university and graduation date. Flesh this section out to demonstrate your capability.'
            },
            {
                type: 'list',
                items: [
                    'Include your expected graduation date (e.g., "Expected May 2026").',
                    'List your degree type and major (e.g., "Bachelor of Science in Computer Science").',
                    'Include your GPA if it is 3.5 or above. If it is lower, simply leave it off. No one will ask, and it prevents premature filtering.',
                    'Add a "Relevant Coursework" subsection. List 4-6 upper-level classes that relate directly to the job you are applying for. (e.g., Data Structures, Database Management, Cloud Computing).',
                    'Mention any academic honors like Dean\\'s List, Cum Laude, or academic scholarships.'
                ]
            },
            {
                type: 'heading',
                content: '6. Turning Academic Projects into "Work Experience"'
            },
            {
                type: 'paragraph',
                content: 'This is the secret weapon of the student resume. You may not have had a boss, but you have undoubtedly completed major projects. Treat your capstone, thesis, or significant group projects exactly like jobs.'
            },
            {
                type: 'paragraph',
                content: 'Create a section called "Relevant Projects" or "Academic Experience." Format them with a Project Title, the Role you played, the Dates, and 2-3 bullet points using strong action verbs.'
            },
            {
                type: 'list',
                items: [
                    'WEAK: "Did a group project on supply chains."',
                    'STRONG: "Lead Analyst | Tesla Supply Chain Optimization Project | Sep 2025 - Dec 2025"',
                    '- Led a team of 4 to analyze Tesla\\'s battery supply chain vulnerabilities using Python and Excel.',
                    '- Modeled 3 alternative logistical routes, identifying a hypothetical strategy that reduced shipping delays by 14%.',
                    '- Presented final 20-page strategic report and slide deck to a panel of department faculty.'
                ]
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Experience.png',
                alt: 'Projects formatted as work experience',
                content: 'Academic projects structured exactly like professional work experience to show transferable skills.'
            },
            {
                type: 'heading',
                content: '7. Extracurriculars, Leadership, and Volunteer Work'
            },
            {
                type: 'paragraph',
                content: 'Hiring managers love to see what you do outside the classroom. It shows initiative, time management, and passion. Being the Vice President of the Debate Club, the Treasurer of your fraternity, or the Social Media Chair of a cultural organization is real leadership experience.'
            },
            {
                type: 'paragraph',
                content: 'Did you manage a budget? Did you organize an event for 200 people? Did you run a social media account that grew by 500 followers? Write bullet points for these activities just as you would for a corporate job.'
            },
            {
                type: 'paragraph',
                content: 'Volunteer work is also highly regarded. If you spent your summers tutoring youth, organizing food drives, or building homes with Habitat for Humanity, it proves reliability, teamwork, and strong character—traits every employer wants in an entry-level hire.'
            },
            {
                type: 'heading',
                content: '8. Independent & Freelance Work'
            },
            {
                type: 'paragraph',
                content: 'Did you build a PC from scratch? Have you been walking dogs consistently for three neighbors? Do you run a successful Depop or Etsy store? Did you edit videos for a friend\\'s YouTube channel?'
            },
            {
                type: 'paragraph',
                content: 'All of this is entrepreneurial experience. Label it "Freelance Work" or "Independent Projects." An employer looking at a first job resume for a retail position will be thrilled to hire the teenager who proved they are responsible enough to maintain a neighborhood lawn-care business for two summers.'
            },
            {
                type: 'heading',
                content: '9. Crafting a Targeted Skills Section'
            },
            {
                type: 'paragraph',
                content: 'Your skills section needs to be optimized for keywords (for the ATS software) and highly digestible for the human recruiter. Break your skills into categories.'
            },
            {
                type: 'list',
                items: [
                    'Technical Skills: Python, Java, SQL, React, AWS',
                    'Tools & Platforms: Salesforce, Google Analytics, Excel (Pivot Tables/VLOOKUP), Figma',
                    'Languages: English (Fluent), Spanish (Conversational)'
                ]
            },
            {
                type: 'paragraph',
                content: 'Avoid listing soft skills like "Hard worker," "Fast learner," or "Team player." Anyone can write those. Instead, prove that you are a fast learner in your bullet points by describing how you taught yourself a new software to complete a project.'
            },
            {
                type: 'heading',
                content: '10. Tailoring for Applicant Tracking Systems (ATS)'
            },
            {
                type: 'paragraph',
                content: 'When you apply online, your resume is scanned by a robot before a human ever sees it. To beat the ATS:'
            },
            {
                type: 'list',
                items: [
                    'Use standard section headers (Education, Projects, Skills) so the parser knows what it is looking at.',
                    'Embed exact keywords from the job description into your resume. If the job asks for "content creation," use the phrase "content creation," not "making videos."',
                    'Use a single-column format. Complex, multi-column Canva templates frequently break ATS parsers, resulting in auto-rejections.',
                    'Save and submit your document as a PDF unless explicitly asked for a Word document.'
                ]
            },
            {
                type: 'heading',
                content: 'Final Checklist Before You Submit'
            },
            {
                type: 'paragraph',
                content: 'Before you send off your student resume, check it against this list:'
            },
            {
                type: 'list',
                items: [
                    'Proofread drastically: A single typo on a resume with no work experience is fatal. It signals carelessness.',
                    'Check formatting consistency: Are all your dates aligned to the right? Are your bullet points the same style?',
                    'Quantify where possible: Look for numbers. Did you present to 50 people? Did you raise $500? Add the metrics.',
                    'File name: Save your file as "Firstname_Lastname_Resume.pdf".'
                ]
            },
            {
                type: 'tip',
                content: 'Using a dedicated resume builder like CV Architect ensures your student resume is perfectly formatted, ATS-compliant, and professional. Our AI can help you extract the hidden skills from your coursework and extracurriculars, transforming them into interview-winning bullet points.'
            }
        ]
    },
"""
    new_lines = lines[:start_idx] + [new_article] + lines[end_idx:]
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.writelines(new_lines)
    print("Done")
else:
    print(f"Indices missing: {start_idx}, {end_idx}")
