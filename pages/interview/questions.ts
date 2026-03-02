export interface Question {
    id: string;
    category: string;
    role: string | null;
    question: string;
    intent: string;
    framework: string;
    badExample: string;
    goodExample: string;
}

export const interviewQuestions: Question[] = [
    {
        id: 'hr_1',
        category: 'General / HR',
        role: null,
        question: 'Tell me about yourself.',
        intent: 'The recruiter wants a concise, professional summary highlighting why you are a good fit for THIS specific role. They do not want your life story.',
        framework: 'Present-Past-Future: Brief professional summary → key experience → current focus → why relevant to the role.',
        badExample: "I grew up in Ohio, went to college, and worked retail. Now I'm looking for a job where I can make more money.",
        goodExample: "Currently, I'm a Marketing Manager at AcmeCorp where I focus on digital campaigns. Over the past 4 years, I've specialized in SEO and content, growing our organic traffic by 40%. I'm looking to pivot into a Senior Strategist role, which is why I'm so excited about this opportunity."
    },
    {
        id: 'hr_2',
        category: 'General / HR',
        role: null,
        question: 'Why are you leaving your current job?',
        intent: 'They want to ensure you aren\'t running away from a toxic situation YOU caused, or that you badmouth previous employers.',
        framework: 'Growth-driven answer. Avoid negativity. Focus on seeking new challenges, increased responsibility, or a pivot in your career.',
        badExample: "My boss is a micromanager and the pay is terrible. I really just need to get out of there as soon as possible.",
        goodExample: "I've learned a lot over the past 3 years at my current company, but I've hit a growth ceiling. I'm looking for an opportunity where I can take on more leadership responsibilities and work with next-gen technologies, which is exactly how your team operates."
    },
    {
        id: 'hr_3',
        category: 'General / HR',
        role: null,
        question: 'Why do you want to work here?',
        intent: 'Checking if you are just applying to 500 jobs blindly, or if you actually care about THEIR company and mission.',
        framework: 'Mention their company mission, product, or culture → align it with your personal goals and experience.',
        badExample: "I saw you were hiring on LinkedIn and it pays well. Plus, the office is pretty close to my house.",
        goodExample: "I've been following your recent push into healthcare AI. In my last role, I saw firsthand how fragmented patient data is. I want to work here because your product is solving a real problem I'm passionate about, and my background in data integration makes me uniquely suited to help accelerate that."
    },
    {
        id: 'hr_4',
        category: 'General / HR',
        role: null,
        question: 'What do you know about our company?',
        intent: 'Checking your preparation level. Did you do your homework before showing up?',
        framework: 'Talk about their core product/service, target market, recent milestones, or main competitors.',
        badExample: "I know you're a tech company that sells software to businesses. Honestly, I haven't had a chance to look too deeply yet.",
        goodExample: "I know you were founded in 2018 and are the leading CRM for mid-sized logistics companies. I also read your recent press release about expanding into the European market, which is incredibly impressive compared to your main competitors."
    },
    {
        id: 'hr_5',
        category: 'General / HR',
        role: null,
        question: 'What are your strengths?',
        intent: 'Gauging your self-awareness and how your strengths align with the job description.',
        framework: 'Choose 2–3 strengths highly relevant to the role → provide a quick proof statement or example for each.',
        badExample: "I'm a hard worker, I learn fast, and I'm a people person.",
        goodExample: "My biggest strength is my analytical problem-solving. For instance, last quarter I noticed a drop in user retention, dug into the analytics, and found a bug in the onboarding flow. My second strength is cross-functional communication; I regularly translate complex technical issues so the sales team can understand them."
    },
    {
        id: 'hr_6',
        category: 'General / HR',
        role: null,
        question: 'What is your biggest weakness?',
        intent: 'Checking for authenticity and continuous self-improvement. They hate fake weaknesses like "I work too hard".',
        framework: 'State a real but controlled weakness → explain the actionable steps you take to improve it.',
        badExample: "I'm a perfectionist. I just care too much about getting every detail right and push myself too hard.",
        goodExample: "Historically, I've struggled with public speaking in large groups, which made me hesitant to present my ideas. To tackle this, I joined Toastmasters six months ago and volunteered to lead our monthly team syncs. I'm much more confident now, though it's still something I'm actively refining."
    },
    {
        id: 'hr_7',
        category: 'General / HR',
        role: null,
        question: 'Where do you see yourself in 3–5 years?',
        intent: 'They want to know if this job aligns with your career goals, meaning you won\'t leave in 6 months.',
        framework: 'Show growth within the field → talk about leadership or deepening your expertise in a way that aligns with the company.',
        badExample: "I hope to start my own consulting firm in a few years, so I'm hoping to learn the ropes here first.",
        goodExample: "In 3-5 years, I see myself having deep expertise in enterprise sales and hopefully taking on a team lead role. I am specifically excited about this role because I know your company values promoting from within and has a strong mentorship culture."
    },
    {
        id: 'hr_8',
        category: 'General / HR',
        role: null,
        question: 'Why should we hire you?',
        intent: 'This is your closing argument. They want to hear a confident summary of your ROI (Return on Investment).',
        framework: 'Summarize your experience + predict your impact + align your values to the company.',
        badExample: "Because I'm a very hard worker and really need this job. I promise you won't regret hiring me.",
        goodExample: "You should hire me because I have the exact blend of marketing analytics and creative strategy this role requires. In my last position, I increased conversion rates by 15%. I can bring that same data-driven mindset here to help you hit your Q4 expansion goals, while seamlessly integrating with your highly collaborative team culture."
    },
    {
        id: 'star_9',
        category: 'Behavioral & STAR',
        role: null,
        question: 'Tell me about a time you handled conflict.',
        intent: 'Testing your emotional intelligence and maturity. Can you work with difficult people without escalating the issue?',
        framework: 'Situation → Action (focusing on empathy and communication) → Resolution → What you learned.',
        badExample: "A colleague kept taking credit for my work. I got mad and finally yelled at him in a meeting. He stopped doing it after that.",
        goodExample: "My lead designer and I strongly disagreed on the UI for a new feature. Instead of arguing over email, I scheduled a brief 1-on-1 coffee chat. I asked him to walk me through his UX philosophy, and in turn, I explained my technical constraints. We realized we were prioritizing different metrics. By combining his aesthetic with my performance constraints, we delivered a hybrid design that increased user engagement."
    },
    {
        id: 'star_10',
        category: 'Behavioral & STAR',
        role: null,
        question: 'Describe a failure and what you learned.',
        intent: 'Testing accountability. Do you blame the system/others, or do you own the mistake and build a preventative process?',
        framework: 'Be honest → show accountability without excuses → explain the specific system you implemented to prevent it from happening again.',
        badExample: "A project failed because the client didn't know what they wanted and the timeline was too short. It wasn't really my fault.",
        goodExample: "Early in my career as a project manager, I failed to loop in the QA team until the final week of a major launch. We found critical bugs and missed our deadline. I took full responsibility with the stakeholders. After that, I completely revamped our project templates to require QA involvement from Sprint 1. We haven't missed a deadline due to testing since."
    },
    {
        id: 'star_11',
        category: 'Behavioral & STAR',
        role: null,
        question: 'Tell me about a time you worked under pressure.',
        intent: 'Looking for evidence that you stay cool, prioritize effectively, and don\'t burn out when things get chaotic.',
        framework: 'Clear example of high stakes → specific actions taken to organize and prioritize → measurable positive result.',
        badExample: "I always work under pressure. I just drink a lot of coffee, stay late, and push through until the work is done.",
        goodExample: "Last quarter, our main server crashed 2 hours before a major client demo. Instead of panicking, I immediately delegated diagnostic tasks to my junior dev while I drafted a contingency communication to the client. By dividing the workload and remaining calm, we identified the memory leak and restored the server with 15 minutes to spare. The demo went flawlessly."
    },
    {
        id: 'star_12',
        category: 'Behavioral & STAR',
        role: null,
        question: 'Describe a time you took initiative.',
        intent: 'Checking if you are proactive or reactive. Do you wait to be told what to do, or do you solve problems before they become emergencies?',
        framework: 'Identify a problem outside your immediate job description → describe the solution you built → highlight the business impact.',
        badExample: "When my boss was on vacation, I made sure all my tasks were finished on time without having to be asked.",
        goodExample: "I noticed our new hires were constantly asking the same setup questions, which was slowing down the senior devs. Even though it wasn't my assigned task, I spent a Friday afternoon compiling a comprehensive 'Day 1 Setup Wiki'. Within a month, new hire onboarding time was reduced by 30%, and senior developers saved hours of interruption."
    },
    {
        id: 'star_13',
        category: 'Behavioral & STAR',
        role: null,
        question: 'Tell me about a difficult decision you made.',
        intent: 'Assessing your critical thinking and logical reasoning. How do you weigh trade-offs?',
        framework: 'Explain the stakes → describe your analytical reasoning process (data vs gut feeling) → the decision and its impact.',
        badExample: "I had to decide whether to fire someone. It was hard, but I just did it because they were underperforming.",
        goodExample: "We had to choose between delaying a product launch or shipping with a known, non-critical bug. I gathered data on how often the bug would be triggered versus the revenue we'd lose by delaying marketing. The data showed the bug affected <1% of users, while delaying would cost $50k in sunk ad spend. I made the call to launch and scheduled a hotfix for day 2. We hit our revenue targets with minimal user complaints."
    },
    {
        id: 'fit_14',
        category: 'Team & Culture Fit',
        role: null,
        question: 'How do you handle feedback?',
        intent: 'Are you defensive and fragile, or are you coachable and eager to grow?',
        framework: 'Show open-mindedness → mention asking clarifying questions → explain how you practically implement the changes.',
        badExample: "I usually agree with it unless the person giving it doesn't understand my job. Then I try to explain why I did it my way.",
        goodExample: "I view feedback as a shortcut to getting better. When receiving it, I try to separate my ego from the work, listen actively, and ask clarifying questions. For example, when my manager said my reports were too dense, I asked for an example of a good report. I implemented an executive summary section the very next week, which the entire leadership team loved."
    },
    {
        id: 'fit_15',
        category: 'Team & Culture Fit',
        role: null,
        question: 'Do you prefer working alone or in a team?',
        intent: 'Trick question. Most modern jobs require both deep focused work and hyper-collaboration. They want adaptability.',
        framework: 'Provide a balanced answer showing you are highly adaptable, with examples for both modes.',
        badExample: "I definitely prefer working alone. I get distracted by other people and work much faster when I can just put my headphones on.",
        goodExample: "I actually thrive on a balance of both. I love collaborating with a team during the brainstorming, planning, and review phases because diverse perspectives create better products. However, when it's time to execute the technical details, I appreciate heads-down time to focus deeply and deliver high-quality work."
    },
    {
        id: 'fit_16',
        category: 'Team & Culture Fit',
        role: null,
        question: 'What type of work environment do you thrive in?',
        intent: 'Checking for alignment. If they are a chaotic startup and you need rigid structure, it\'s a mismatch.',
        framework: 'Describe an environment that loosely matches what you know about their company (structured but flexible, collaborative, growth-focused).',
        badExample: "I need an environment where the rules are clearly defined and my manager tells me exactly what my priorities are every morning.",
        goodExample: "I thrive in fast-paced environments that are collaborative but also offer autonomy. I do my best work when there's a clear overarching goal, but the team is trusted to figure out the best way to achieve it. I know from your blog that you value 'autonomous innovation', which aligns perfectly with how I like to work."
    },
    {
        id: 'fit_17',
        category: 'Team & Culture Fit',
        role: null,
        question: 'How do you stay organized?',
        intent: 'They want proof you have an actual system, not just "I have a good memory".',
        framework: 'Name specific tools and your underlying prioritization method.',
        badExample: "I usually just write things down on sticky notes or try to remember the most important things for the day.",
        goodExample: "I rely heavily on a digital-first approach. I use Notion to track long-term project milestones and a daily time-blocking strategy in my calendar for deep work. Every evening before logging off, I write down my top 3 non-negotiable tasks for the next morning so I can hit the ground running."
    },
    {
        id: 'perf_18',
        category: 'Performance & Work Style',
        role: null,
        question: 'How do you prioritize tasks?',
        intent: 'Checking if you understand the difference between *urgent* (someone is yelling) and *important* (moves the business forward).',
        framework: 'Explain a framework (like Urgency vs Impact / Eisenhower Matrix) and how you communicate priority shifts.',
        badExample: "I just tackle whatever email came in most recently, or whatever my boss tells me to do first.",
        goodExample: "I use an Urgency vs. Impact framework. I tackle high-impact, high-urgency tasks first. For the rest, I time-block my calendar to ensure proactive, high-impact projects don't get derailed by 'putting out fires'. If I have conflicting priorities from different managers, I'll transparently list my bandwidth and ask them to align on what takes precedence."
    },
    {
        id: 'perf_19',
        category: 'Performance & Work Style',
        role: null,
        question: 'How do you meet deadlines?',
        intent: 'Do you wing it and pull all-nighters, or do you have a mature project management approach?',
        framework: 'Planning phase → establishing micro-milestones → proactive communication of risks.',
        badExample: "I just work as many hours as it takes right before the deadline to make sure it gets done.",
        goodExample: "I meet deadlines by reverse-engineering them. If a project is due in 4 weeks, I establish weekly micro-deliverables. I also buffer 20% of the time for unexpected blockers. More importantly, if I foresee a delay risk in week 2, I communicate it to stakeholders immediately rather than surprising them on the due date."
    },
    {
        id: 'perf_20',
        category: 'Performance & Work Style',
        role: null,
        question: 'How do you handle multiple projects?',
        intent: 'Looking for your context-switching ability and bandwidth management.',
        framework: 'Task tracking → strategic time blocking → stakeholder updates.',
        badExample: "I just multitask and try to work on a little bit of everything throughout the day so progress is made on all of them.",
        goodExample: "I find multitasking inefficient for deep work, so I rely on dedicated time-blocking. I might dedicate Monday mornings to Project A and afternoons to Project B. I use a centralized Jira board so stakeholders can asynchronously see my progress without me having to pause work just to give status updates."
    },
    {
        id: 'perf_21',
        category: 'Performance & Work Style',
        role: null,
        question: 'What motivates you at work?',
        intent: 'Determining your intrinsic drivers. If you only say "money", it implies you\'ll jump ship for $1 more.',
        framework: 'Focus on impact, continuous growth, delivering measurable results, or team success.',
        badExample: "Mostly just getting a steady paycheck and having good benefits so I can support my lifestyle.",
        goodExample: "I'm highly motivated by measurable impact and continuous learning. In my last role, optimizing a process that saved my team 10 hours a week gave me immense satisfaction. I love the feeling of tackling a complex problem, figuring it out with smart people, and seeing the tangible business results of that effort."
    },
    {
        id: 'sal_22',
        category: 'Salary & Logistics',
        role: null,
        question: 'What are your salary expectations?',
        intent: 'Verifying if you fit their budget range. They also want to see if you know your market value.',
        framework: 'Show market research → provide a range → indicate flexibility based on total compensation.',
        badExample: "I need at least $80,000. I can't take anything less.",
        goodExample: "Based on my market research for this role in our geography, and factoring in my 5 years of specialized experience, I'm looking at a range of $85,000 to $100,000. However, I am flexible and would want to evaluate the entire compensation package including equity, PTO, and benefits before locking in a final number."
    },
    {
        id: 'sal_23',
        category: 'Salary & Logistics',
        role: null,
        question: 'When can you start?',
        intent: 'Checking your logistics and your professionalism regarding your current employer.',
        framework: 'Respect your current employer\'s notice period (usually 2 weeks) → show enthusiasm for starting.',
        badExample: "I can start tomorrow! I'll just email my current boss and tell them I quit.",
        goodExample: "I am incredibly excited to hit the ground running here. To ensure a smooth transition and handoff for my current team, I will need to give my standard two weeks' notice. I could start on the 15th of next month."
    },
    {
        id: 'sal_24',
        category: 'Salary & Logistics',
        role: null,
        question: 'Are you interviewing elsewhere?',
        intent: 'They want to know how urgent they need to act. If you have other offers, they might speed up their process.',
        framework: 'Be honest and show you are in demand, but reiterate that THEIR company is your top choice.',
        badExample: "No, this is the only company I've applied to. Please, I really need this.",
        goodExample: "Yes, I am actively interviewing and in final rounds with two other organizations in the SaaS space. However, based on our conversations about your product roadmap and the team culture here, this role is my top priority. I'd love to make this my next home."
    },
    {
        id: 'prob_25',
        category: 'Problem-Solving',
        role: null,
        question: 'How would you solve X problem? (Hypothetical Scenario)',
        intent: 'They don\'t necessarily need the "right" answer. They are evaluating your analytical process and assumptions.',
        framework: 'Clarify the constraints first → analyze out loud → propose a logical solution → explain your reasoning.',
        badExample: "Oh, I would just build a new app for that and tell marketing to run ads.",
        goodExample: "Before solving, I'd ask a few clarifying questions: What is our budget, and what is the strict timeline? Assuming a tight timeline, I wouldn't build a custom solution from scratch. I would first audit our existing tools to see if we can adapt an internal process. Let me walk you through my thought process on how I'd evaluate the top two software solutions..."
    },
    {
        id: 'prob_26',
        category: 'Problem-Solving',
        role: null,
        question: 'How do you approach learning something new?',
        intent: 'Tech and business move fast. They need to know you are highly adaptable and a self-guided learner.',
        framework: 'Research fundamentals → hands-on practice → seek feedback → iterate.',
        badExample: "I usually wait for HR to assign a training course or ask my manager to show me how to do it in a Zoom call.",
        goodExample: "I am a very hands-on learner. When I had to learn SQL for my last role, I first spent a weekend reading the fundamental syntax. Then, I immediately pulled an offline copy of a database and started running test queries. Whenever I hit a wall, I consulted documentation or asked a senior analyst for a 5-minute code review. I usually learn best through rapid iteration and feedback."
    }
];
