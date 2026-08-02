import type {
  AppState,
  Assignment,
  BadgeDef,
  Difficulty,
  LearningResource,
  Mission,
  Question,
  Quiz,
  Skill,
  SkillTransformation,
  StudentTier,
  SubmissionKind,
  User,
} from "./types";
import { todayKey } from "./utils";


export const STUDENT_TIERS: StudentTier[] = [
  {
    tierNumber: 1,
    name: "Starter",
    color: "Light Gray",
    hexColor: "#9ca3af",
    iconName: "Sprout",
    requirements: ["Create account", "Complete profile", "Start first mission"],
    rewards: ["Access to beginner skills", "Daily XP", "Starter Badge", "Community Access"],
    minXp: 0,
    minSkillsCompleted: 0,
    minStreak: 0,
  },
  {
    tierNumber: 2,
    name: "Explorer",
    color: "Blue",
    hexColor: "#3b82f6",
    iconName: "Compass",
    requirements: ["Earn 1,000 XP", "Complete 1 Skill", "Maintain a 7-Day Streak"],
    rewards: ["Explorer Badge", "Skill Certificate", "Portfolio Access", "Weekly Challenges"],
    minXp: 1000,
    minSkillsCompleted: 1,
    minStreak: 7,
  },
  {
    tierNumber: 3,
    name: "Builder",
    color: "Purple",
    hexColor: "#a855f7",
    iconName: "Hammer",
    requirements: ["Earn 3,000 XP", "Complete 3 Skills", "Submit 10 Projects"],
    rewards: ["Builder Badge", "Advanced Projects", "Exclusive Resources", "Priority Community Access"],
    minXp: 3000,
    minSkillsCompleted: 3,
    minStreak: 10,
  },
  {
    tierNumber: 4,
    name: "Operator",
    color: "Orange",
    hexColor: "#f97316",
    iconName: "Rocket",
    requirements: ["Earn 6,000 XP", "Complete 5 Skills", "Complete 2 Capstone Projects"],
    rewards: ["Operator Badge", "AI Mentor Access", "Premium Challenges", "Featured Portfolio"],
    minXp: 6000,
    minSkillsCompleted: 5,
    minStreak: 14,
  },
  {
    tierNumber: 5,
    name: "Pro",
    color: "Gold",
    hexColor: "#eab308",
    iconName: "Crown",
    requirements: ["Earn 10,000 XP", "Complete 8 Skills", "Build Professional Portfolio", "Earn at least one Excellence Certificate"],
    rewards: ["Pro Badge", "Verified Portfolio", "Priority Certificate Verification", "Career Opportunities", "Internship Recommendations"],
    minXp: 10000,
    minSkillsCompleted: 8,
    minStreak: 21,
  },
  {
    tierNumber: 6,
    name: "Elite",
    color: "Black + Gold",
    hexColor: "#d97706",
    iconName: "Gem",
    requirements: ["Earn 15,000 XP", "Complete All 12 Skills", "Complete Every Capstone Project", "Build Complete Portfolio"],
    rewards: ["Elite Badge", "Elite Certificate", "Featured Student Profile", "Exclusive Community", "Founder Recognition"],
    minXp: 15000,
    minSkillsCompleted: 12,
    minStreak: 30,
  },
  {
    tierNumber: 7,
    name: "Master Practitioner",
    color: "Platinum + Gold",
    hexColor: "#e2e8f0",
    iconName: "Trophy",
    requirements: ["Complete Every Skill", "Maintain 90%+ Overall Score", "Earn Excellence in Multiple Skills", "Build an Industry-Ready Portfolio"],
    rewards: ["Master Practitioner Certificate", "Platinum Badge", "Hall of Fame Profile", "Mentor Access", "Premium Career Opportunities"],
    minXp: 25000,
    minSkillsCompleted: 12,
    minStreak: 60,
  },
];

export const XP_REWARDS = {
  completeMission: 50,
  completeQuiz: 25,
  submitAssignment: 50,
  completePhaseProject: 300,
  completeCapstoneProject: 750,
  dailyStreak: 20,
  weeklyChallenge: 150,
  monthlyChallenge: 500,
  helpStudent: 50,
};

export const TIERS = STUDENT_TIERS.map((t) => t.name);

export const CERT_TIERS = [5, 10];

/* ---------------------------------- quotes --------------------------------- */

export const QUOTES: { text: string; author: string }[] = [
  { text: "Ship something small today. Momentum compounds faster than talent.", author: "Skill Edge OS" },
  { text: "Learn to build, learn to sell. You'll be unstoppable.", author: "Naval Ravikant" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Make something people want.", author: "Paul Graham" },
  { text: "Your streak is a vote for the person you're becoming.", author: "Skill Edge OS" },
  { text: "Amateurs wait for inspiration. Builders open the editor.", author: "Skill Edge OS" },
  { text: "Move fast and build things worth keeping.", author: "Skill Edge OS" },
  { text: "Every expert was once a beginner who refused to quit.", author: "Skill Edge OS" },
  { text: "If you're not embarrassed by v1, you launched too late.", author: "Reid Hoffman" },
  { text: "Consistency beats intensity. Show up daily.", author: "Skill Edge OS" },
  { text: "The market rewards skills, not certificates. Earn both here.", author: "Skill Edge OS" },
  { text: "Prompt like an architect, iterate like a scientist.", author: "Skill Edge OS" },
];

/* -------------------------------- skill seeds ------------------------------- */

interface SkillSeed {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  color: string;
  videoIds: string[];
  levels: [title: string, mission: string][]; // exactly 10
  bank: [prompt: string, correct: string, ...wrong: string[]][]; // 6 questions, correct listed first
}

const SEEDS: SkillSeed[] = [
  {
    id: "ai-prompt-engineering",
    title: "AI Tools & Prompt Engineering",
    category: "AI & Automation",
    iconName: "Bot",
    description: "Master ChatGPT, Midjourney, n8n and agentic workflows — from prompt anatomy to shipping AI products.",
    color: "#06b6d4",
    videoIds: ["zjkBMFhNj_g", "aircAruvnKk"],
    levels: [
      ["Prompt Anatomy 101", "Write 5 prompts using the Role + Task + Context + Format pattern and compare the outputs side by side."],
      ["System Prompts & Personas", "Design a system prompt that turns ChatGPT into a strict interview coach, then stress-test it across 3 conversations."],
      ["Few-Shot & Chain-of-Thought", "Build a few-shot prompt that classifies 10 support emails, then add chain-of-thought and measure the accuracy jump."],
      ["Structured Output & JSON", "Force a model to return valid JSON for a recipe app and validate every response with a parser."],
      ["Midjourney & Visual Prompting", "Generate a 4-image brand moodboard using style, lens and lighting modifiers, and document your prompt recipe."],
      ["ChatGPT API Basics", "Call the API with temperature 0.2 vs 1.0 on the same task and write up the behavioural differences."],
      ["n8n Automation Pipelines", "Build an n8n flow: RSS trigger → AI summarizer → auto-post to a Discord channel."],
      ["Agentic Workflows", "Design a two-agent loop (researcher + writer) with an explicit handoff protocol and stop condition."],
      ["RAG & Knowledge Bots", "Prototype a Q&A bot over your own notes with chunking, retrieval and inline citations."],
      ["Full AI Product Sprint", "Ship a working AI micro-tool end-to-end and publish a public demo thread about it."],
    ],
    bank: [
      ["What is 'few-shot prompting'?", "Giving the model several worked examples before the real task", "Restarting the chat after every question", "Keeping every prompt under ten words", "Lowering the temperature to zero"],
      ["In an n8n workflow, what does a trigger node do?", "Starts the workflow when a specific event occurs", "Formats the final output", "Stores API credentials", "Limits the workflow's runtime"],
      ["The temperature parameter mainly controls…", "How random or creative the model's output is", "How fast the model responds", "The maximum length of the answer", "Which language the model replies in"],
      ["The most reliable way to get structured output is to…", "Ask for JSON and specify the exact schema", "Ask the model to 'be structured'", "Send the prompt twice", "Use all-caps instructions"],
      ["A system prompt is best described as…", "Instructions that set the model's role and behaviour for the session", "The first question a user asks", "A prompt written by the operating system", "An error message from the API"],
      ["Chain-of-thought prompting improves results by…", "Making the model reason step-by-step before answering", "Shortening the final answer", "Caching previous responses", "Disabling hallucinations entirely"],
    ],
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding & AI Software Building",
    category: "AI & Automation",
    iconName: "Code2",
    description: "Build real software with Cursor, Replit, Bolt and Next.js — describe intent, iterate with AI, ship to production.",
    color: "#8b5cf6",
    videoIds: ["Sklc_fQBmcs", "Tn6-PIqc4UM", "zQnBQ4tB3ZA"],
    levels: [
      ["Dev Setup Speedrun", "Install Cursor (or VS Code), Node and git, then ship a 'hello web' page in under 30 minutes."],
      ["Prompt-to-Page", "Generate a landing page in Bolt or v0 from a single prompt, then refine it through 3 focused iterations."],
      ["Components & Props", "Build a reusable profile-card component in React with an AI pair, passing data via props."],
      ["State & Interactivity", "Build a counter and a todo list using useState, with add, toggle and delete."],
      ["Next.js App Router", "Create a multi-page app with a dynamic route and shared layout."],
      ["Tailwind Design Systems", "Recreate a glassmorphism dashboard shell using only Tailwind utilities."],
      ["APIs & Data Fetching", "Fetch a public API and render loading, error and success states."],
      ["Auth & Persistence", "Add a localStorage-backed session with a protected page and logout."],
      ["Debugging with AI", "Take a broken starter repo and fix 5 seeded bugs using AI-assisted debugging."],
      ["Ship & Deploy", "Deploy your project to Vercel with a custom domain and basic analytics."],
    ],
    bank: [
      ["In the Next.js App Router, a page is defined by…", "A page.tsx file inside a route folder", "A route entry in package.json", "Any file ending in .page.js", "A <Page> component in index.html"],
      ["Cursor and GitHub Copilot are examples of…", "AI pair-programming tools", "Version control systems", "CSS frameworks", "Databases"],
      ["What does `npm run build` do in a Next.js project?", "Creates an optimized production build", "Starts the local dev server", "Publishes the app to npm", "Deletes node_modules"],
      ["Tailwind CSS is best described as…", "A utility-first CSS framework", "A JavaScript testing library", "A React state manager", "A deployment platform"],
      ["A good git commit habit is…", "Small focused commits with clear messages", "One giant commit per week", "Committing node_modules for safety", "Only committing when the app is perfect"],
      ["'Vibe coding' as a workflow means…", "Describing intent to AI and iterating on the generated code", "Coding without ever running the app", "Copying code from forums unchanged", "Writing code only in comments"],
    ],
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Startup Launch",
    category: "Business & Money",
    iconName: "Rocket",
    description: "Validate ideas, find product-market fit, pitch investors — go from problem to launched startup.",
    color: "#f97316",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Idea Storm", "List 20 problems you have personally faced this month and shortlist the 3 most painful ones."],
      ["Customer Discovery", "Interview 5 potential users about your top problem and log their exact words about the pain."],
      ["Value Proposition Canvas", "Map customer jobs, pains and gains against your proposed solution on one canvas."],
      ["MVP in a Weekend", "Launch a landing page with a waitlist form and drive 20 visitors to test demand."],
      ["Pricing & Unit Economics", "Model CAC, LTV and contribution margin for your idea in a simple spreadsheet."],
      ["Pitch Deck Sprint", "Build a 10-slide pitch deck: problem, solution, market, traction, team, ask."],
      ["PMF Experiments", "Design 3 falsifiable experiments that could prove or kill your growth assumptions."],
      ["Fundraising 101", "Work through a SAFE note example and compute founder dilution across two rounds."],
      ["Go-To-Market Machine", "Pick 2 acquisition channels and build a 30-day launch calendar with daily actions."],
      ["Founder Operating System", "Set up a weekly metrics review and write your first monthly investor-style update."],
    ],
    bank: [
      ["Product-market fit means…", "Your product satisfies a strong market demand", "Your product has the most features", "Your product is patented", "Your product is cheaper than rivals"],
      ["An MVP is…", "The smallest version that tests the core value", "The final polished product", "A marketing video pitch", "A minimum viable pitch-deck"],
      ["The best first step to validate an idea is…", "Talking to real potential customers", "Building the full product", "Registering the company", "Designing a logo"],
      ["CAC stands for…", "Customer Acquisition Cost", "Company Asset Capital", "Customer Annual Contract", "Cost After Conversion"],
      ["A great elevator pitch covers…", "Problem, solution and ask in under a minute", "Your full life story", "Every product feature", "Your competitors' weaknesses only"],
      ["A 'pivot' means…", "Changing strategy based on validated learning", "Giving up on the startup", "Hiring a new CEO", "Doubling the ad budget"],
    ],
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy & Digital Assets",
    category: "Business & Money",
    iconName: "Wallet",
    description: "Budgeting, compounding, unit economics and crypto basics — build a personal wealth operating system.",
    color: "#eab308",
    videoIds: ["PHe0bXAIuk0"],
    levels: [
      ["Money Map", "Track every rupee you spend for 7 days and categorize it into needs, wants and investments."],
      ["Budget Blueprint", "Build a personal 50/30/20 budget from your real monthly numbers."],
      ["Emergency Engine", "Compute your 3-6 month emergency fund target and design an auto-save plan to reach it."],
      ["Compounding Lab", "Model a monthly SIP over 10, 20 and 30 years and chart how compounding bends the curve."],
      ["Index & Asset Classes", "Compare 10-year returns of fixed deposits, index funds and gold, and write your conclusions."],
      ["Crypto Foundations", "Set up a test wallet, learn seed-phrase custody rules, and list 5 common scam patterns to avoid."],
      ["Unit Economics Deep Dive", "Compute per-order profitability for a small creator business including all hidden costs."],
      ["Tax & Salary Decode", "Break a sample CTC into in-hand salary, deductions and taxes, and find 2 legal optimizations."],
      ["Portfolio Design", "Draft a risk-based asset allocation for your age and goals with rebalancing rules."],
      ["Wealth OS", "Automate your investing flows and build a net-worth dashboard you update monthly."],
    ],
    bank: [
      ["Compound interest is…", "Interest earned on both principal and accumulated interest", "Interest paid only on the principal", "A fixed bank fee", "Interest that resets every year"],
      ["In the 50/30/20 rule, the 20% goes to…", "Savings and investments", "Entertainment", "Rent", "Groceries"],
      ["Unit economics examines…", "Profit or loss per single customer or unit sold", "The company's total valuation", "Employee salaries", "Office rental costs"],
      ["Bitcoin is best described as…", "A decentralized digital currency recorded on a blockchain", "A company's stock", "A government savings bond", "A physical commodity"],
      ["An emergency fund should typically cover…", "3–6 months of essential expenses", "One week of expenses", "Your annual salary times ten", "Only medical bills"],
      ["Diversification primarily reduces…", "Risk, by spreading money across assets", "Taxes owed", "Brokerage fees", "The need to save"],
    ],
  },
  {
    id: "freelancing",
    title: "Freelancing & Client Acquisition",
    category: "Business & Money",
    iconName: "Briefcase",
    description: "Upwork tactics, cold outreach and closing deals — turn skills into paying clients and retainers.",
    color: "#10b981",
    videoIds: ["u4ZoJKF_VuA", "H14bBuluwB8"],
    levels: [
      ["Skill Offer Matrix", "Define your niche, target client and a concrete offer with a starting price."],
      ["Portfolio Proof", "Create 3 spec projects that demonstrate exactly the outcome clients pay for."],
      ["Upwork Profile Engine", "Write a keyword-optimized profile headline and overview aimed at one niche."],
      ["Proposal Sniper", "Send 5 tailored proposals that lead with the client's problem and your relevant result."],
      ["Cold Outreach Lab", "Send 20 personalized DMs or emails with a one-line specific compliment and clear CTA; track reply rate."],
      ["Discovery Calls", "Run a mock discovery call: qualify budget, scope the problem and set next steps."],
      ["Closing & Contracts", "Draft a one-page SOW and rehearse answers to the 3 most common objections."],
      ["Retainer Ladder", "Design an upgrade path that converts a one-off project into a monthly retainer."],
      ["Client Systems", "Build an onboarding checklist, weekly update template and feedback loop."],
      ["Agency Leap", "Productize your service into a fixed-scope package and plan your first subcontractor hire."],
    ],
    bank: [
      ["The best cold outreach opener is…", "A personalized line about the client's business", "A paragraph about your qualifications", "A discount coupon", "A generic 'Dear Sir/Madam'"],
      ["A strong Upwork proposal leads with…", "The client's problem and your relevant result", "Your hourly rate", "Your full résumé", "A request for a call"],
      ["A retainer is…", "A recurring monthly engagement fee", "A one-time signing bonus", "A late payment penalty", "A portfolio website"],
      ["Scope creep means…", "Uncontrolled growth of work beyond the agreement", "Finishing before the deadline", "Charging extra for revisions", "Losing a client to a competitor"],
      ["Value-based pricing means charging based on…", "The outcome delivered, not hours worked", "Your years of experience", "What competitors charge", "The client's company size"],
      ["Choosing a niche helps because…", "Specialists command more trust and higher rates", "It reduces the work you must do", "Generalists are banned on platforms", "Niches have no competition"],
    ],
  },
  {
    id: "content-creation",
    title: "Content Creation & Personal Branding",
    category: "Media & Influence",
    iconName: "Megaphone",
    description: "X growth, LinkedIn hooks, YouTube strategy — build an audience that compounds into opportunity.",
    color: "#f43f5e",
    videoIds: ["eIho2S0ZahI", "H14bBuluwB8"],
    levels: [
      ["Niche & Angle", "Define your 3 content pillars and the unique angle only you can bring."],
      ["Hook Lab", "Write 20 scroll-stopping hooks for one idea and rank your top 5."],
      ["X/Twitter Threads", "Publish 3 threads with a hook, story arc and payoff; note which performed best."],
      ["LinkedIn Authority", "Publish 5 posts using the hook → story → lesson → CTA structure."],
      ["YouTube Strategy", "Design 3 title + thumbnail pairs for one video and predict CTR for each."],
      ["Content Calendar", "Build a 30-day calendar that repurposes each core idea across 3 platforms."],
      ["Analytics Decode", "Read your retention/engagement data and write 3 concrete changes for next week."],
      ["Community Loops", "Spend 30 minutes daily for a week on strategic replies and DMs; log new connections."],
      ["Monetize Attention", "Create a lead magnet and connect it to a simple email capture."],
      ["Brand Flywheel", "Document your full content-to-offer funnel and the metrics for each stage."],
    ],
    bank: [
      ["A 'hook' in content is…", "The first seconds or line that stops the scroll", "The final call-to-action", "A hashtag strategy", "A paid promotion"],
      ["The best posting strategy is…", "A consistent schedule with platform-native formats", "Posting only when inspired", "Cross-posting identical content everywhere", "Posting 20 times a day"],
      ["A personal brand is…", "The reputation and value people associate with you", "Your logo and color palette", "Your follower count", "A verified badge"],
      ["CTR measures…", "The click-through rate on your title or link", "Total watch time", "Comments per post", "Content trend ranking"],
      ["Repurposing content means…", "Adapting one core idea across formats and platforms", "Reposting the same file daily", "Deleting old posts", "Buying content from others"],
      ["Threads work on X because…", "Story structure drives retention and shares", "They bypass the algorithm", "They are the only free format", "Longer always means better"],
    ],
  },
  {
    id: "video-editing",
    title: "Short-Form Video Editing",
    category: "Media & Influence",
    iconName: "Clapperboard",
    description: "CapCut, Premiere, storytelling and viral hooks — edit shorts that hold attention to the last frame.",
    color: "#d946ef",
    videoIds: ["eIho2S0ZahI"],
    levels: [
      ["CapCut Basics", "Cut a 30-second clip from raw footage: trim, split and export at 9:16."],
      ["Rhythm & Jump Cuts", "Edit a talking-head clip to a beat, removing every dead air gap."],
      ["Captions & Emphasis", "Add styled auto-captions with keyword highlights and emoji accents."],
      ["Hook Engineering", "Create two versions of the same video with different first-3-second hooks."],
      ["Sound Design", "Add music with ducking under speech plus 3 well-placed sound effects."],
      ["B-Roll & Overlays", "Layer b-roll, zooms and text overlays over a 45-second narration."],
      ["Premiere Power", "Rebuild your best short in Premiere using multi-track editing and keyframes."],
      ["Storytelling Arcs", "Edit a 60-second mini-doc with setup, tension and payoff."],
      ["Viral Format Remix", "Deconstruct 3 trending formats and recreate one with your own content."],
      ["Edit Studio Pipeline", "Build your preset pack, export settings and a client-ready delivery workflow."],
    ],
    bank: [
      ["A J-cut is when…", "The next clip's audio starts before its video appears", "Video freezes while audio continues", "Two clips play side by side", "The clip is reversed"],
      ["The hook of a short must land within…", "The first 1–3 seconds", "The first 30 seconds", "The final seconds", "The description text"],
      ["B-roll is…", "Supplementary footage shown over narration", "Bloopers and outtakes", "The backup project file", "Background music"],
      ["Jump cuts are used in shorts to…", "Remove dead air and keep the pace fast", "Add cinematic slow motion", "Fix color grading", "Loop the video"],
      ["Auto-captions in CapCut…", "Generate subtitles from the speech automatically", "Translate the video into 50 languages", "Remove background noise", "Add trending hashtags"],
      ["The aspect ratio for TikTok/Reels is…", "9:16 vertical", "16:9 horizontal", "1:1 square", "4:3 classic"],
    ],
  },
  {
    id: "sales-negotiation",
    title: "Sales & High-Ticket Negotiation",
    category: "Influence & Leadership",
    iconName: "Handshake",
    description: "Objection handling, closing scripts and negotiation frames — sell with integrity at premium prices.",
    color: "#0ea5e9",
    videoIds: ["eIho2S0ZahI", "Ks-_Mh1QhMc"],
    levels: [
      ["Sales Mindset Reset", "Write your 'selling is serving' manifesto and identify limiting beliefs to drop."],
      ["Discovery Questions", "Build a SPIN question bank (Situation, Problem, Implication, Need-payoff) for your offer."],
      ["Listening & Labeling", "Practice mirroring and labeling in 3 conversations and log what changed."],
      ["Objection Aikido", "Script responses to the top 5 objections: price, timing, trust, need, authority."],
      ["Anchors & Frames", "Role-play a negotiation where you set the anchor first, then defend it."],
      ["Closing Scripts", "Rehearse the assumptive close and the alternative close on a mock deal."],
      ["High-Ticket Offers", "Structure a premium offer with guarantees, scarcity and clear ROI math."],
      ["Follow-Up Machine", "Design a 7-touch follow-up sequence that adds value at every touch."],
      ["Negotiation War Room", "Prepare BATNA, target and walk-away numbers for a real upcoming negotiation."],
      ["Deal Architect", "Run a full pipeline simulation from cold lead to signed high-ticket agreement."],
    ],
    bank: [
      ["When a prospect says 'it's too expensive', first…", "Isolate the objection and explore what they compare it to", "Immediately offer a discount", "End the call politely", "Repeat the price louder"],
      ["SPIN stands for…", "Situation, Problem, Implication, Need-payoff", "Sell, Pitch, Insist, Negotiate", "Start, Present, Invoice, Network", "Smile, Praise, Inform, Nudge"],
      ["A trial close is…", "Testing readiness to buy before the final ask", "Closing on the first call", "A discount that expires", "A contract with a trial period"],
      ["Anchoring in negotiation means…", "The first number sets the reference point", "Refusing to move from your price", "Waiting for the other side to speak first", "Splitting the difference"],
      ["Top closers typically…", "Listen more than they talk", "Talk 90% of the call", "Avoid questions", "Never discuss price"],
      ["BATNA stands for…", "Best Alternative To a Negotiated Agreement", "Buy All Terms, Negotiate After", "Basic Agreement Terms and Notes", "Best Available Trade Negotiation Asset"],
    ],
  },
  {
    id: "communication",
    title: "Communication & Storytelling",
    category: "Influence & Leadership",
    iconName: "MessageSquare",
    description: "Executive presence and persuasive writing — say less, land more, move people to action.",
    color: "#6366f1",
    videoIds: ["eIho2S0ZahI", "Ks-_Mh1QhMc"],
    levels: [
      ["Clarity Reps", "Rewrite 5 bloated paragraphs into half the words without losing meaning."],
      ["Story Spine", "Write a personal story using setup → conflict → resolution and tell it aloud."],
      ["Rule of Three", "Restructure one message you sent this week into exactly three points."],
      ["Active Listening", "In your next 3 conversations, paraphrase back before responding; log the effect."],
      ["Persuasive Writing", "Rewrite a real email to lead with the reader's benefit in the first line."],
      ["Executive Summaries", "Compress a long document into a one-page brief with a clear recommendation."],
      ["Difficult Conversations", "Script a feedback conversation using the Situation-Behavior-Impact format."],
      ["Data Storytelling", "Turn one chart into a 3-sentence narrative with a so-what conclusion."],
      ["Influence Patterns", "Apply 3 of Cialdini's principles ethically to a real ask and record outcomes."],
      ["Signature Story", "Craft and record your 2-minute origin story with a message worth repeating."],
    ],
    bank: [
      ["The rule of three works because…", "Ideas grouped in threes are more memorable", "Three is the maximum people can read", "It's required in formal writing", "Odd numbers sound smarter"],
      ["Active listening includes…", "Paraphrasing back what you heard", "Planning your reply while they talk", "Nodding constantly", "Finishing their sentences"],
      ["Executive presence is mostly…", "Calm clarity under pressure", "An expensive wardrobe", "Speaking the loudest", "Using complex vocabulary"],
      ["The classic story structure is…", "Setup → conflict → resolution", "Statistics → charts → summary", "Introduction → agenda → Q&A", "Claim → proof → disclaimer"],
      ["The 'so what?' test checks…", "Whether the message matters to the audience", "Whether grammar is correct", "Whether the story is true", "Whether slides look good"],
      ["Persuasive writing should lead with…", "The reader's benefit", "Your credentials", "Background history", "A formal greeting"],
    ],
  },
  {
    id: "public-speaking",
    title: "Public Speaking & Pitching",
    category: "Influence & Leadership",
    iconName: "Mic",
    description: "Confidence, stage presence and pitch delivery — own any room, from classrooms to demo days.",
    color: "#84cc16",
    videoIds: ["Unzc731iCUY", "Ks-_Mh1QhMc", "eIho2S0ZahI"],
    levels: [
      ["Voice Warmups", "Record a 60-second self-intro; assess pace, filler words and energy."],
      ["Stage Posture", "Practice grounded stance and open gestures for 10 minutes in front of a mirror or camera."],
      ["Openers That Grip", "Record the same talk opening 3 ways: question, story and bold claim."],
      ["The Power of the Pause", "Deliver a 1-minute talk with 3 deliberate pauses; feel the discomfort, keep the silence."],
      ["Slide Craft", "Build a 5-slide talk with one idea per slide and almost no text."],
      ["Impromptu Reps", "Speak for 1 minute on 5 random topics with only 10 seconds of prep each."],
      ["Persuasive Talk", "Deliver a 3-minute persuasive pitch using the rule of three."],
      ["Q&A Mastery", "Have a friend or AI fire 5 hostile questions; practice bridge-and-answer."],
      ["Stage Presence", "Run a full dress rehearsal on camera and review your movement and eye contact."],
      ["Keynote Ready", "Deliver a 7-minute keynote to a live or recorded audience and collect feedback."],
    ],
    bank: [
      ["The best remedy for stage fright is…", "Rehearsal plus reframing nerves as energy", "Avoiding eye contact", "Speaking faster to finish sooner", "Memorizing every single word"],
      ["Good eye contact means…", "Holding contact with individuals for a few seconds each", "Staring at one friendly face", "Scanning constantly without stopping", "Looking above everyone's heads"],
      ["A strong talk opens with…", "A hook: question, story, or bold claim", "An apology for nerves", "A detailed agenda", "Your full biography"],
      ["Pausing while speaking…", "Adds emphasis and lets ideas land", "Signals you forgot your lines", "Should be avoided completely", "Only works in large rooms"],
      ["A slide best practice is…", "One idea per slide with minimal text", "Full paragraphs so people can read along", "At least five bullet points per slide", "Reading every slide word-for-word"],
      ["Vocal variety means…", "Deliberately changing pace, pitch and volume", "Speaking as loudly as possible", "Using a formal accent", "Keeping a perfectly steady tone"],
    ],
  },
  {
    id: "productivity",
    title: "Productivity Systems & OS Build",
    category: "Systems & Execution",
    iconName: "Timer",
    description: "Notion, Obsidian and time-blocking — design a personal operating system that runs your goals.",
    color: "#14b8a6",
    videoIds: ["arj7oStGLkU"],
    levels: [
      ["Time Audit", "Log 3 days of your life in 30-minute blocks and highlight the leaks."],
      ["Task Triage", "Sort your entire backlog with the Eisenhower urgent/important matrix."],
      ["Time-Blocking", "Design your ideal week as calendar blocks and follow it for 2 days."],
      ["Pomodoro Protocol", "Complete 8 tracked pomodoros (25 min focus + 5 min break) in one day."],
      ["Notion HQ", "Build a personal dashboard: goals, projects, tasks and a weekly review page."],
      ["Obsidian Second Brain", "Set up PARA folders and link 10 notes into a knowledge graph."],
      ["Habit Engine", "Design streak tracking for 3 keystone habits with triggers and rewards."],
      ["Deep Work Ritual", "Engineer a 90-minute distraction-free block: environment, phone, signals."],
      ["Automation Stack", "Automate 3 recurring chores (templates, rules, or scripts)."],
      ["Personal OS v1", "Integrate calendar, tasks and notes into one documented operating system."],
    ],
    bank: [
      ["Time-blocking means…", "Assigning tasks to specific calendar blocks", "Blocking distracting websites", "Working without any schedule", "Tracking time after the fact"],
      ["The Eisenhower matrix sorts tasks by…", "Urgency and importance", "Effort and cost", "Deadline and owner", "Difficulty and fun"],
      ["A 'second brain' is…", "An external system to capture and organize knowledge", "A memory improvement supplement", "A second monitor", "An AI clone of yourself"],
      ["A classic Pomodoro cycle is…", "About 25 minutes of focus plus a 5-minute break", "2 hours of work plus 1 hour break", "10 minutes work, 10 minutes rest", "Working until exhaustion"],
      ["Deep work requires…", "Long distraction-free focus blocks", "Constant multitasking", "Background notifications", "Open office chatter"],
      ["The purpose of a weekly review is…", "Closing open loops and planning the next week", "Punishing missed tasks", "Reporting to your manager", "Archiving old emails"],
    ],
  },
  {
    id: "project-management",
    title: "Project & AI Team Management",
    category: "Systems & Execution",
    iconName: "Users",
    description: "Agile, agent delegation and task tracking — run projects where humans and AI agents ship together.",
    color: "#a78bfa",
    videoIds: ["arj7oStGLkU", "H14bBuluwB8"],
    levels: [
      ["Project Charter", "Write a one-page charter: goal, scope, non-goals and success metrics."],
      ["Kanban Setup", "Create a board with To Do / Doing / Done and a WIP limit of 3."],
      ["Sprint Planning", "Plan a 1-week sprint with estimates and a clear sprint goal."],
      ["Standup Rhythm", "Run 3 days of async standups: done, doing, blockers."],
      ["Risk Radar", "List your project's top 5 risks with likelihood, impact and mitigations."],
      ["Agent Delegation", "Brief an AI agent on a scoped task with explicit acceptance criteria; review its output."],
      ["Multi-Agent Orchestration", "Design a 3-role agent pipeline (researcher → builder → reviewer) with handoffs."],
      ["Stakeholder Comms", "Write a crisp weekly status report: progress, risks, asks."],
      ["Retrospectives", "Run a retro on a finished project and commit to 2 process improvements."],
      ["AI PM Operating Manual", "Document how your human + agent team plans, executes and reviews work."],
    ],
    bank: [
      ["An agile sprint is…", "A fixed timebox that delivers a working increment", "An all-night coding session", "The final phase of a project", "A daily meeting"],
      ["A kanban board limits…", "Work in progress", "Team size", "Project budget", "Meeting length"],
      ["A standup answers…", "What was done, what's next, and blockers", "Salary and performance reviews", "Long-term company strategy", "Customer support tickets"],
      ["Delegating to AI agents works best with…", "Clearly scoped tasks with success criteria", "Vague open-ended requests", "No review of outputs", "One giant task for one agent"],
      ["A retrospective is for…", "Improving the process after each cycle", "Assigning blame for failures", "Demoing to customers", "Planning the next year"],
      ["The critical path is…", "The longest chain of dependent tasks", "The most expensive task", "The tasks assigned to leadership", "The shortest route to demo day"],
    ],
  },
];


/* --------------------------- per-skill submission config --------------------------- */

interface SkillSubmitCfg {
  kinds: SubmissionKind[];
  proof: string[]; // what proof of work looks like for this skill
}

const SUBMIT_CFG: Record<string, SkillSubmitCfg> = {
  "ai-prompt-engineering": {
    kinds: ["TEXT", "URL", "GOOGLE_DRIVE", "GITHUB", "NOTION", "FILE"],
    proof: ["Shared chat/conversation links", "Prompt document with outputs", "Screenshots of results", "Workflow export file"],
  },
  "vibe-coding": {
    kinds: ["GITHUB", "URL", "TEXT", "FILE"],
    proof: ["GitHub repository link", "Live deployed URL", "Screen recording of the app working"],
  },
  entrepreneurship: {
    kinds: ["TEXT", "GOOGLE_DRIVE", "URL", "NOTION", "CANVA", "FILE"],
    proof: ["Interview notes document", "Lean canvas / pitch deck link", "Landing page URL", "Waitlist screenshot"],
  },
  "financial-literacy": {
    kinds: ["TEXT", "GOOGLE_DRIVE", "URL", "FILE"],
    proof: ["Spreadsheet link (Google Sheets)", "Budget/model screenshots", "Written analysis"],
  },
  freelancing: {
    kinds: ["TEXT", "URL", "GOOGLE_DRIVE", "NOTION", "FILE"],
    proof: ["Profile/proposal links", "Outreach tracking sheet", "Portfolio pieces", "Client conversation screenshots (redacted)"],
  },
  "content-creation": {
    kinds: ["URL", "YOUTUBE", "TEXT", "GOOGLE_DRIVE", "NOTION"],
    proof: ["Published post/thread links", "Analytics screenshots", "Content calendar link"],
  },
  "video-editing": {
    kinds: ["YOUTUBE", "GOOGLE_DRIVE", "URL", "FILE"],
    proof: ["Exported video link (Drive/YouTube)", "Before/after clips", "Project file screenshot"],
  },
  "sales-negotiation": {
    kinds: ["TEXT", "GOOGLE_DRIVE", "URL", "FILE"],
    proof: ["Written scripts and frameworks", "Role-play recording link", "Deal/negotiation prep document"],
  },
  communication: {
    kinds: ["TEXT", "GOOGLE_DRIVE", "URL", "YOUTUBE", "FILE"],
    proof: ["Before/after rewrites", "Recorded talk link", "One-page brief document"],
  },
  "public-speaking": {
    kinds: ["YOUTUBE", "GOOGLE_DRIVE", "URL", "TEXT"],
    proof: ["Recording of your talk (video link)", "Slide deck link", "Self-review notes"],
  },
  productivity: {
    kinds: ["TEXT", "NOTION", "URL", "GOOGLE_DRIVE", "FILE"],
    proof: ["Notion/Obsidian dashboard link", "Time audit screenshots", "System documentation"],
  },
  "project-management": {
    kinds: ["TEXT", "NOTION", "URL", "GOOGLE_DRIVE", "FILE"],
    proof: ["Board/charter link", "Sprint plan document", "Status report", "Retro notes"],
  },
};

const DEFAULT_CFG: SkillSubmitCfg = {
  kinds: ["TEXT", "URL", "GOOGLE_DRIVE", "FILE"],
  proof: ["Links to your work", "Screenshots", "A short write-up"],
};

/** Extra curated starter resources attached to mission 1 of each skill */
const STARTER_RESOURCES: Record<string, LearningResource[]> = {
  "ai-prompt-engineering": [
    { id: "res-ai-guide", type: "ARTICLE", title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", minutes: 25 },
  ],
  "vibe-coding": [
    { id: "res-vc-nextjs", type: "ARTICLE", title: "Next.js Learn Course", url: "https://nextjs.org/learn", minutes: 40 },
  ],
  entrepreneurship: [
    { id: "res-ent-ycstartup", type: "ARTICLE", title: "YC Startup School", url: "https://www.startupschool.org/", minutes: 30 },
    { id: "res-ent-leancanvas", type: "TEMPLATE", title: "Lean Canvas Template", url: "https://www.canva.com/templates/?query=lean-canvas", minutes: 10 },
  ],
  "financial-literacy": [
    { id: "res-fin-zerodha", type: "ARTICLE", title: "Zerodha Varsity — Personal Finance", url: "https://zerodha.com/varsity/module/personalfinance/", minutes: 45 },
  ],
  freelancing: [
    { id: "res-fr-upwork", type: "ARTICLE", title: "Upwork Freelancer Guide", url: "https://www.upwork.com/resources/how-to-get-started-freelancing", minutes: 20 },
  ],
  "content-creation": [
    { id: "res-cc-hooks", type: "TEMPLATE", title: "Viral Hook Templates", url: "https://www.notion.so/templates/category/social-media", minutes: 15 },
  ],
  "video-editing": [
    { id: "res-ve-capcut", type: "ARTICLE", title: "CapCut Official Tutorials", url: "https://www.capcut.com/resource", minutes: 20 },
  ],
  "sales-negotiation": [
    { id: "res-sn-spin", type: "ARTICLE", title: "SPIN Selling Summary", url: "https://blog.hubspot.com/sales/spin-selling", minutes: 15 },
  ],
  communication: [
    { id: "res-com-pyramid", type: "ARTICLE", title: "The Minto Pyramid Principle", url: "https://untools.co/minto-pyramid/", minutes: 10 },
  ],
  "public-speaking": [
    { id: "res-ps-ted", type: "ARTICLE", title: "TED's Secret to Great Public Speaking", url: "https://www.ted.com/talks/chris_anderson_ted_s_secret_to_great_public_speaking", minutes: 8 },
  ],
  productivity: [
    { id: "res-pr-para", type: "ARTICLE", title: "The PARA Method", url: "https://fortelabs.com/blog/para/", minutes: 15 },
  ],
  "project-management": [
    { id: "res-pm-agile", type: "ARTICLE", title: "Agile Manifesto & Principles", url: "https://agilemanifesto.org/", minutes: 10 },
  ],
};

/* ------------------------------ mission builder ------------------------------ */

const MISSION_PHASES = [
  "Foundation",
  "Foundation",
  "Foundation",
  "Practice",
  "Practice",
  "Practice",
  "Advanced",
  "Advanced",
  "Pro",
  "Capstone",
];

function difficultyFor(n: number): Difficulty {
  if (n <= 3) return "Beginner";
  if (n <= 6) return "Intermediate";
  if (n <= 9) return "Advanced";
  return "Expert";
}

function buildAssignment(seed: SkillSeed, n: number, brief: string): Assignment {
  const cfg = SUBMIT_CFG[seed.id] ?? DEFAULT_CFG;
  const isCapstone = n === 10;
  return {
    brief,
    deliverables: [
      isCapstone ? "The finished capstone project, publicly shareable" : "The completed practical task described above",
      ...cfg.proof.slice(0, isCapstone ? cfg.proof.length : 2),
      "A 3-5 line write-up: what you built, what broke, what you learned",
    ],
    checklist: [
      "Go through every learning resource in this mission",
      `Do the work: ${brief.length > 90 ? brief.slice(0, 90).trimEnd() + "…" : brief}`,
      `Collect proof of work (${cfg.proof[0].toLowerCase()})`,
      "Answer the reflection questions honestly",
      "Submit for review — resubmissions are encouraged, not penalized",
    ],
    allowedSubmissionTypes: cfg.kinds,
  };
}

const REFLECTIONS_BASE = [
  "What was the hardest part of this mission, and how did you push through it?",
  "If you repeated this mission tomorrow, what would you do differently?",
  "How will you apply what you built here to a real project, client, or audience this week?",
];

function buildMissions(seed: SkillSeed): Mission[] {
  return seed.levels.map(([title, brief], i) => {
    const n = i + 1;
    // rotate the 6-question bank so each mission's 5-question knowledge check differs
    const qs: Question[] = [];
    for (let k = 0; k < 5; k++) {
      const [prompt, correct, ...wrong] = seed.bank[(i + k) % seed.bank.length];
      const opts = [correct, ...wrong];
      const rot = (i + k) % opts.length;
      const rotated = [...opts.slice(rot), ...opts.slice(0, rot)];
      qs.push({
        id: `${seed.id}-l${n}-q${k + 1}`,
        prompt,
        options: rotated,
        answerIndex: rotated.indexOf(correct),
      });
    }

    const resources: LearningResource[] = [
      {
        id: `${seed.id}-l${n}-video`,
        type: "VIDEO",
        title: `${title} — video lesson`,
        url: seed.videoIds[i % seed.videoIds.length],
        minutes: 15,
      },
      ...(n === 1 ? STARTER_RESOURCES[seed.id] ?? [] : []),
    ];

    return {
      id: `${seed.id}-level-${n}`,
      skillId: seed.id,
      order: n,
      title,
      tier: MISSION_PHASES[i],
      objective: brief,
      expectedOutcome:
        n === 10
          ? "A portfolio-grade capstone project you can show to employers, clients or investors."
          : "A real, reviewable piece of work added to your portfolio once approved.",
      description: brief,
      difficulty: difficultyFor(n),
      estimatedMinutes: 30 + n * 15,
      prerequisites: n > 1 ? [`${seed.id}-level-${n - 1}`] : [],
      resources,
      assignment: buildAssignment(seed, n, brief),
      reflectionQuestions: REFLECTIONS_BASE,
      quiz: qs,
      xpReward: n * 50,
      neuronReward: n <= 6 ? 10 + n * 5 : n * 8,
      isPremium: n >= 5,
      isLocked: false,
    };
  });
}

const SKILL_IMAGES: Record<string, string> = {
  "ai-prompt-engineering": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  "vibe-coding": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  entrepreneurship: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
  "financial-literacy": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
  freelancing: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "content-creation": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "video-editing": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
  "sales-negotiation": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
  communication: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
  "public-speaking": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
  productivity: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
  "project-management": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
};

const SKILL_DIFFICULTY: Record<string, Difficulty> = {
  "ai-prompt-engineering": "Beginner",
  "vibe-coding": "Intermediate",
  entrepreneurship: "Intermediate",
  "financial-literacy": "Beginner",
  freelancing: "Beginner",
  "content-creation": "Beginner",
  "video-editing": "Beginner",
  "sales-negotiation": "Intermediate",
  communication: "Beginner",
  "public-speaking": "Beginner",
  productivity: "Beginner",
  "project-management": "Intermediate",
};

export const SKILL_TRANSFORMATIONS: Record<string, SkillTransformation> = {
  "ai-prompt-engineering": {
    become: "AI Productivity Expert & Automation Specialist",
    headline: "By completing this skill, you'll become an AI Productivity Expert who can automate work and multiply productivity using AI.",
    canBuild: ["Custom GPTs & Prompt Packs", "RAG Knowledge Systems", "n8n & Make Automations", "AI Agentic Workflows"],
    realWorldOutcomes: ["Automate 80% of repetitive work", "Research 10x faster with AI", "Eliminate manual data entry", "Build autonomous agentic tools"],
    projectsCompleted: ["LLM Benchmark Matrix", "AI Research System", "Make/n8n Automation", "Autonomous AI Agent"],
    careerOpportunities: ["AI Operations Specialist", "AI Prompt Engineer", "AI Consultant", "Automation Strategist"],
  },
  "vibe-coding": {
    become: "AI Software Engineer",
    headline: "By completing this skill, you'll become an AI Software Engineer capable of building real-world software using AI.",
    canBuild: ["Websites using AI", "SaaS products", "Mobile apps", "AI tools & agents", "Automations & API integrations"],
    realWorldOutcomes: ["Ship full-stack products in days", "Debug code using AI", "Deploy production apps", "Automate development workflows"],
    projectsCompleted: ["AI SaaS MVP", "Full-Stack Web App", "Mobile App", "Multi-Agent Automation"],
    careerOpportunities: ["AI Software Engineer", "Full Stack Developer", "Founding Engineer", "Technical Co-Founder"],
  },
  entrepreneurship: {
    become: "Startup Founder",
    headline: "By completing this skill, you'll become a Startup Founder who can validate ideas, build MVPs, acquire customers and launch a business.",
    canBuild: ["Problem-Solution Fit MVPs", "Waitlists & Validation Pages", "Go-To-Market Plans", "Investor Pitch Decks"],
    realWorldOutcomes: ["Discover high-value pain points", "Conduct customer discovery interviews", "Acquire initial 100 users", "Launch on Product Hunt"],
    projectsCompleted: ["Problem Opportunity Database", "Validation Case Study", "No-Code/AI Startup MVP", "Full Founder Pitch Deck"],
    careerOpportunities: ["Startup Founder", "Venture Builder", "Product Manager", "Innovation Lead"],
  },
  "financial-literacy": {
    become: "Financially Smart & Wealth Strategist",
    headline: "By completing this skill, you'll become financially smart by understanding budgeting, investing, taxes, saving and wealth creation.",
    canBuild: ["Personal Budget Dashboards", "Automated Wealth Systems", "SIP Investment Portfolios", "Tax & Cashflow Blueprints"],
    realWorldOutcomes: ["Master 50/30/20 budgeting", "Protect money from digital scams", "Understand stocks, mutual funds & GST", "Build long-term financial freedom"],
    projectsCompleted: ["Money Assessment Report", "Personal Budget System", "Virtual Investment Strategy", "Comprehensive Wealth Roadmap"],
    careerOpportunities: ["Personal Finance Strategist", "Wealth Manager", "Financial Analyst", "Independent Investor"],
  },
  freelancing: {
    become: "Successful Freelancer",
    headline: "By completing this skill, you'll become a successful freelancer capable of finding clients, delivering projects and earning online.",
    canBuild: ["Upwork & LinkedIn Profiles", "Client Proposals & Contracts", "Freelance Service Packages", "Invoicing & Payment Portals"],
    realWorldOutcomes: ["Land global clients online", "Price services for high profit", "Deliver 5-star projects", "Build a recurring freelance business"],
    projectsCompleted: ["Freelance Offer Blueprint", "Upwork Profile Optimization", "Client Proposal Kit", "Freelance Income Dashboard"],
    careerOpportunities: ["Independent Freelancer", "Agency Founder", "Remote Consultant", "Contract Specialist"],
  },
  "content-creation": {
    become: "Content Creator & Personal Brand Builder",
    headline: "By completing this skill, you'll become a Content Creator who can build a personal brand, create viral content and grow an audience.",
    canBuild: ["Multi-Platform Content Engines", "Viral Hooks & Scripts", "Personal Brand Profile Systems", "Monetization Funnels"],
    realWorldOutcomes: ["Grow audience on X, LinkedIn & YouTube", "Script high-engagement posts", "Monetize content & brand", "Build personal authority"],
    projectsCompleted: ["Content Strategy Matrix", "30-Day Content Sprint", "Viral Video Script", "Creator Monetization Plan"],
    careerOpportunities: ["Content Creator", "Personal Brand Strategist", "Social Media Manager", "Growth Creator"],
  },
  "video-editing": {
    become: "Professional Video Editor",
    headline: "By completing this skill, you'll become a Professional Video Editor capable of editing reels, YouTube videos, advertisements and commercial content.",
    canBuild: ["Viral Shorts & Reels", "YouTube Long-Form Videos", "High-Converting Ad Creatives", "Motion Graphics & Color Grading"],
    realWorldOutcomes: ["Pace videos for retention", "Master Premiere, CapCut & DaVinci", "Design sound & visual effects", "Land video clients"],
    projectsCompleted: ["Short-Form Reel Edit", "YouTube Video Cut", "Commercial Ad Project", "Video Showreel"],
    careerOpportunities: ["Video Editor", "Content Producer", "YouTube Editor", "Creative Media Strategist"],
  },
  "sales-negotiation": {
    become: "Sales Professional & Deal Closer",
    headline: "By completing this skill, you'll become a Sales Professional who can confidently pitch, negotiate and close deals.",
    canBuild: ["Client Outreach Systems", "Discovery Call Frameworks", "Negotiation Playbooks", "High-Converting DM & Email Flows"],
    realWorldOutcomes: ["Overcome objections effortlessly", "Conduct discovery & demo calls", "Negotiate win-win contracts", "Close high-ticket clients"],
    projectsCompleted: ["Sales Philosophy & Mindset", "Negotiation Playbook", "Lead Generation Dashboard", "Complete Sales Funnel System"],
    careerOpportunities: ["Sales Director", "Account Executive", "Business Development Lead", "Client Acquisition Specialist"],
  },
  communication: {
    become: "Confident Communicator & Influential Speaker",
    headline: "By completing this skill, you'll become a Confident Communicator who can speak, present ideas, tell compelling stories and build meaningful relationships.",
    canBuild: ["TED-Style Talk Presentations", "Personal Brand Blueprints", "Cold DM & Email Systems", "Startup Pitch Decks"],
    realWorldOutcomes: ["Speak without stage fear", "Deliver persuasive pitches", "Ace job & startup interviews", "Network with high-value peers"],
    projectsCompleted: ["Professional Introduction Video", "TED-Style Speech Recording", "Personal Brand Strategy", "Startup Pitch Presentation"],
    careerOpportunities: ["Public Speaker", "Communications Lead", "Community Director", "Executive Presenter"],
  },
  "product-building": {
    become: "Product Builder & One-Person Business Operator",
    headline: "By completing this skill, you'll become a Product Builder who can design, validate, launch digital products and build recurring revenue systems.",
    canBuild: ["Digital Products (Ebooks/Templates)", "High-Converting Landing Pages", "Gumroad/Lemon Squeezy Stores", "Automated Sales Funnels"],
    realWorldOutcomes: ["Validate product ideas before building", "Launch on Product Hunt & X", "Build email distribution lists", "Generate recurring revenue"],
    projectsCompleted: ["Product Opportunity Database", "Digital Product MVP", "Distribution System Blueprint", "Real Product Launch"],
    careerOpportunities: ["Product Builder", "Growth Marketer", "Indie Hacker", "Digital Business Owner"],
  },
  "research-thinking": {
    become: "Strategic Problem Solver & Deep Researcher",
    headline: "By completing this skill, you'll become a strategic problem solver who can research deeply, verify information, detect misinformation and make better decisions.",
    canBuild: ["Fact-Checking Systems", "Deep Research Workflows with AI", "Competitive Analysis Audits", "Decision Making Frameworks"],
    realWorldOutcomes: ["Detect media bias & fake news", "Make evidence-based decisions", "Synthesize complex data with AI", "Apply first-principles thinking"],
    projectsCompleted: ["Topic Research Summary", "Critical Thinking Audit", "AI Research System", "Industry Competitive Report"],
    careerOpportunities: ["Research Analyst", "Strategy Consultant", "Data Intelligence Lead", "Policy & Risk Analyst"],
  },
  "graphic-design": {
    become: "Professional Graphic Designer",
    headline: "By completing this skill, you'll become a Professional Graphic Designer capable of creating branding, social media creatives, marketing assets and client-ready designs.",
    canBuild: ["Complete Brand Kits & Logos", "High-CTR YouTube Thumbnails", "Instagram & LinkedIn Carousels", "AI Design Assets with Firefly/Midjourney"],
    realWorldOutcomes: ["Understand visual hierarchy & color psychology", "Master Canva, Photoshop & AI design", "Deliver client-ready brand systems", "Build a high-ticket design portfolio"],
    projectsCompleted: ["Design Improvement Case Study", "Complete Brand Identity Package", "Social Media Content Suite", "Design Portfolio Showcase"],
    careerOpportunities: ["Brand Designer", "Visual Graphic Designer", "Creative Director", "UI/UX & Asset Designer"],
  },
};

export const SKILLS: Skill[] = SEEDS.map((seed) => {
  const missions = buildMissions(seed);
  return {
    id: seed.id,
    title: seed.title,
    category: seed.category,
    iconName: seed.iconName,
    description: seed.description,
    color: seed.color,
    thumbnailUrl: SKILL_IMAGES[seed.id] ?? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    difficulty: SKILL_DIFFICULTY[seed.id] ?? "Beginner",
    estimatedHours: Math.round(missions.reduce((sum, m) => sum + m.estimatedMinutes, 0) / 60),
    transformation: SKILL_TRANSFORMATIONS[seed.id],
    missions,
    isPublished: true,
  };
});

/* --------------------------------- badges --------------------------------- */

export const BADGES: BadgeDef[] = [
  { id: "first-mission", name: "First Ship", description: "Got your first project approved", iconName: "Flag", color: "#3b82f6" },
  { id: "projects-5", name: "Builder", description: "5 approved projects", iconName: "Hammer", color: "#8b5cf6" },
  { id: "projects-20", name: "Shipping Machine", description: "20 approved projects", iconName: "Package", color: "#06b6d4" },
  { id: "streak-7", name: "Week Warrior", description: "7-day learning streak", iconName: "Flame", color: "#f97316" },
  { id: "streak-30", name: "Unstoppable", description: "30-day learning streak", iconName: "Flame", color: "#ef4444" },
  { id: "phase-complete", name: "Phase Cleared", description: "Completed a skill phase", iconName: "Milestone", color: "#eab308" },
  { id: "skill-complete", name: "Skill Master", description: "Completed all 10 missions of a skill", iconName: "GraduationCap", color: "#22c55e" },
  { id: "tournament-winner", name: "Arena Champion", description: "Won a weekly tournament", iconName: "Trophy", color: "#facc15" },
  { id: "founder", name: "Founding Member", description: "Founder Lifetime supporter", iconName: "Crown", color: "#8b5cf6" },
];

export function badgeDef(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

/* ------------------------------ catalog lookups ------------------------------ */

export function findSkill(catalog: Skill[], skillId: string) {
  return catalog.find((s) => s.id === skillId);
}

export function findMission(catalog: Skill[], missionId: string): { skill: Skill; mission: Mission } | null {
  for (const s of catalog) {
    const m = s.missions.find((mm) => mm.id === missionId);
    if (m) return { skill: s, mission: m };
  }
  return null;
}

/** static-seed lookup (used for quiz seeds only — pages must use the store catalog) */
export function getSkill(skillId: string) {
  return SKILLS.find((s) => s.id === skillId);
}

/* --------------------------------- seed state ------------------------------- */

const now = Date.now();
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();
const H = 3600000;
const D = 24 * H;

const quizBankFrom = (skillId: string, count: number): Question[] => {
  const skill = getSkill(skillId)!;
  const qs: Question[] = [];
  const seen = new Set<string>();
  for (const m of skill.missions) {
    for (const q of m.quiz) {
      if (!seen.has(q.prompt) && qs.length < count) {
        seen.add(q.prompt);
        qs.push({ ...q, id: `qz-${q.id}` });
      }
    }
  }
  return qs;
};

const seedQuizzes: Quiz[] = [
  {
    id: "quiz-ai-battle",
    title: "AI Prompt Battle Royale",
    category: "AI & Automation",
    entryFeeNeurons: 20,
    prizePoolNeurons: 500,
    startTime: iso(2 * D),
    durationMins: 45,
    secondsPerQuestion: 15,
    questions: quizBankFrom("ai-prompt-engineering", 6),
    isActive: true,
    winnersDeclared: false,
  },
  {
    id: "quiz-founder-gauntlet",
    title: "Founder Gauntlet: Startup IQ",
    category: "Business & Money",
    entryFeeNeurons: 0,
    prizePoolNeurons: 300,
    startTime: iso(5 * D + 3 * H),
    durationMins: 30,
    secondsPerQuestion: 15,
    questions: quizBankFrom("entrepreneurship", 6),
    isActive: true,
    winnersDeclared: false,
  },
];

export function seedState(): AppState {
  const officialAdmin: User = {
    id: "u-admin-official",
    name: "Skill Edge Admin",
    email: "learningskilledge@gmail.com",
    role: "ADMIN",
    avatar: "",
    title: "Administrator",
    bio: "Skill Edge Learning Official Administrator",
    neurons: 10000,
    xp: 5000,
    streakCount: 1,
    lastActiveDay: todayKey(),
    subscription: { plan: "FAMILY", status: "ACTIVE", startedAt: iso(0), expiresAt: null },
    badges: [],
    createdAt: iso(0),
  };

  return {
    version: 2,
    currentUserId: officialAdmin.id,
    users: [officialAdmin],
    catalog: SKILLS,
    progress: {},
    submissions: [],
    portfolio: [],
    transactions: [],
    payments: [],
    coupons: [{ code: "LAUNCH20", percentOff: 20, active: true }],
    quizzes: seedQuizzes,
    quizEntries: [],
    certificates: [],
    notifications: [],
    announcements: [
      {
        id: "ann-welcome",
        title: "Welcome to Skill Edge Learning",
        body: "SEL is a skill operating system: every mission produces real work, every skill builds your portfolio. Start your first mission today.",
        createdAt: iso(0),
      },
    ],
  };
}


/* ------------------------------ student tier lookup ------------------------------ */

export function studentTierForXp(xp: number): StudentTier {
  let tier = STUDENT_TIERS[0];
  for (const t of STUDENT_TIERS) {
    if (xp >= t.minXp) tier = t;
  }
  return tier;
}
