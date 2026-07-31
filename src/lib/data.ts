import type { AppState, Level, Question, Quiz, Skill, User } from "./types";

export const TIERS = [
  "Starter",
  "Explorer",
  "Apprentice",
  "Practitioner",
  "Builder",
  "Operator",
  "Specialist",
  "Strategist",
  "Vanguard",
  "Sovereign Master",
];

export const CERT_TIERS = [5, 8, 10];

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

/* ------------------------------ level builder ------------------------------ */

function buildLevels(seed: SkillSeed): Level[] {
  return seed.levels.map(([title, mission], i) => {
    const n = i + 1;
    // rotate the 6-question bank so each level's 5-question quiz feels different
    const qs: Question[] = [];
    for (let k = 0; k < 5; k++) {
      const [prompt, correct, ...wrong] = seed.bank[(i + k) % seed.bank.length];
      // deterministic option shuffle keyed by level+question index
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
    return {
      id: `${seed.id}-level-${n}`,
      skillId: seed.id,
      levelNumber: n,
      title,
      tier: TIERS[i],
      description: mission,
      activityContent: [
        `Mission: ${mission}`,
        "Capture proof of work — a screenshot, link, recording or short write-up of what you produced.",
        "Reflect in 3 lines: what worked, what broke, and the one thing you will try differently next time.",
      ],
      youtubeVideoId: seed.videoIds[i % seed.videoIds.length],
      minPassScore: 80,
      coinReward: n <= 6 ? 10 + n * 5 : n * 8,
      xpReward: n * 50,
      isPremium: n >= 7,
      questions: qs,
    };
  });
}

export const SKILLS: Skill[] = SEEDS.map((seed) => ({
  id: seed.id,
  title: seed.title,
  category: seed.category,
  iconName: seed.iconName,
  description: seed.description,
  color: seed.color,
  premiumCost: 200,
  levels: buildLevels(seed),
}));

export function getSkill(skillId: string) {
  return SKILLS.find((s) => s.id === skillId);
}

export function getLevel(skillId: string, levelNumber: number) {
  return getSkill(skillId)?.levels.find((l) => l.levelNumber === levelNumber);
}

export function getLevelById(levelId: string) {
  for (const s of SKILLS) {
    const l = s.levels.find((lv) => lv.id === levelId);
    if (l) return { skill: s, level: l };
  }
  return null;
}

/* --------------------------------- seed state ------------------------------- */

const now = Date.now();
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();
const H = 3600000;
const D = 24 * H;

const seedUsers: User[] = [
  {
    id: "u-student",
    name: "Aarav Mehta",
    email: "mylearning069@gmail.com",
    role: "USER",
    avatar: "🧑‍🚀",
    edgeCoins: 240,
    xp: 1250,
    streakCount: 4,
    lastActiveDay: null,
    createdAt: iso(-45 * D),
  },
  {
    id: "u-admin",
    name: "Skill Edge Admin",
    email: "admin@skilledge.app",
    role: "ADMIN",
    avatar: "🛡️",
    edgeCoins: 0,
    xp: 0,
    streakCount: 0,
    lastActiveDay: null,
    createdAt: iso(-90 * D),
  },
  {
    id: "u-zara",
    name: "Zara Khan",
    email: "zara.builds@gmail.com",
    role: "USER",
    avatar: "🦊",
    edgeCoins: 510,
    xp: 2380,
    streakCount: 11,
    lastActiveDay: null,
    createdAt: iso(-60 * D),
  },
  {
    id: "u-kabir",
    name: "Kabir Rao",
    email: "kabir.rao.dev@gmail.com",
    role: "USER",
    avatar: "🐺",
    edgeCoins: 95,
    xp: 640,
    streakCount: 2,
    lastActiveDay: null,
    createdAt: iso(-20 * D),
  },
  {
    id: "u-ishita",
    name: "Ishita Verma",
    email: "ishita.creates@gmail.com",
    role: "USER",
    avatar: "🐙",
    edgeCoins: 320,
    xp: 1710,
    streakCount: 7,
    lastActiveDay: null,
    createdAt: iso(-33 * D),
  },
];

const quizBankFrom = (skillId: string, count: number): Question[] => {
  const skill = getSkill(skillId)!;
  const qs: Question[] = [];
  const seen = new Set<string>();
  for (const lvl of skill.levels) {
    for (const q of lvl.questions) {
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
    entryFeeCoins: 20,
    prizePoolCoins: 500,
    startTime: iso(-10 * 60000), // live now
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
    entryFeeCoins: 0,
    prizePoolCoins: 300,
    startTime: iso(2 * D + 3 * H),
    durationMins: 30,
    secondsPerQuestion: 15,
    questions: quizBankFrom("entrepreneurship", 6),
    isActive: true,
    winnersDeclared: false,
  },
  {
    id: "quiz-money-masters",
    title: "Money Masters Weekly",
    category: "Business & Money",
    entryFeeCoins: 10,
    prizePoolCoins: 400,
    startTime: iso(-7 * D),
    durationMins: 30,
    secondsPerQuestion: 15,
    questions: quizBankFrom("financial-literacy", 6),
    isActive: false,
    winnersDeclared: true,
  },
];

export function seedState(): AppState {
  // student has completed the first 3 AI levels + first vibe-coding level
  const studentCompleted: Record<string, { score: number; completedAt: string }> = {
    "ai-prompt-engineering-level-1": { score: 100, completedAt: iso(-6 * D) },
    "ai-prompt-engineering-level-2": { score: 90, completedAt: iso(-4 * D) },
    "ai-prompt-engineering-level-3": { score: 85, completedAt: iso(-2 * D) },
    "vibe-coding-level-1": { score: 95, completedAt: iso(-1 * D) },
  };
  return {
    version: 1,
    currentUserId: "u-student",
    users: seedUsers,
    progress: {
      "u-student": { completed: studentCompleted, premiumUnlocks: {} },
      "u-zara": {
        completed: {
          "content-creation-level-1": { score: 90, completedAt: iso(-9 * D) },
          "content-creation-level-2": { score: 100, completedAt: iso(-8 * D) },
        },
        premiumUnlocks: {},
      },
      "u-kabir": { completed: {}, premiumUnlocks: {} },
      "u-ishita": { completed: {}, premiumUnlocks: {} },
    },
    transactions: [
      {
        id: "txn-seed-1",
        userId: "u-student",
        amountCoins: 15,
        amountInr: null,
        type: "EARNED",
        status: "APPROVED",
        note: "Completed AI Tools · Level 1 — Prompt Anatomy 101",
        createdAt: iso(-6 * D),
      },
      {
        id: "txn-seed-2",
        userId: "u-student",
        amountCoins: 20,
        amountInr: null,
        type: "EARNED",
        status: "APPROVED",
        note: "Completed AI Tools · Level 2 — System Prompts & Personas",
        createdAt: iso(-4 * D),
      },
      {
        id: "txn-seed-3",
        userId: "u-student",
        amountCoins: 25,
        amountInr: null,
        type: "EARNED",
        status: "APPROVED",
        note: "Completed AI Tools · Level 3 — Few-Shot & Chain-of-Thought",
        createdAt: iso(-2 * D),
      },
      {
        id: "txn-seed-4",
        userId: "u-student",
        amountCoins: 100,
        amountInr: 50,
        type: "PURCHASED",
        status: "APPROVED",
        utrNumber: "417223981102",
        note: "EdgeCoin top-up via UPI",
        createdAt: iso(-3 * D),
      },
      {
        id: "txn-seed-5",
        userId: "u-kabir",
        amountCoins: 200,
        amountInr: 100,
        type: "PURCHASED",
        status: "PENDING",
        utrNumber: "889301247765",
        proofImageName: "upi-receipt-kabir.png",
        note: "EdgeCoin top-up via UPI",
        createdAt: iso(-5 * H),
      },
      {
        id: "txn-seed-6",
        userId: "u-student",
        amountCoins: 15,
        amountInr: null,
        type: "EARNED",
        status: "APPROVED",
        note: "Completed Vibe Coding · Level 1 — Dev Setup Speedrun",
        createdAt: iso(-1 * D),
      },
    ],
    quizzes: seedQuizzes,
    quizEntries: [
      { quizId: "quiz-money-masters", userId: "u-zara", joinedAt: iso(-7 * D - H), score: 88, rank: 1, prizeWonCoins: 200 },
      { quizId: "quiz-money-masters", userId: "u-ishita", joinedAt: iso(-7 * D - H), score: 74, rank: 2, prizeWonCoins: 120 },
      { quizId: "quiz-money-masters", userId: "u-kabir", joinedAt: iso(-7 * D - H), score: 61, rank: 3, prizeWonCoins: 80 },
      { quizId: "quiz-ai-battle", userId: "u-zara", joinedAt: iso(-30 * 60000), score: 92 },
      { quizId: "quiz-ai-battle", userId: "u-ishita", joinedAt: iso(-25 * 60000), score: 78 },
    ],
    certificates: [],
    notifications: [
      {
        id: "ntf-seed-1",
        userId: "u-student",
        message: "Welcome to Skill Edge OS! Complete today's mission to keep your 🔥 streak alive.",
        kind: "info",
        createdAt: iso(-2 * H),
        read: false,
      },
    ],
    overrides: {},
  };
}
