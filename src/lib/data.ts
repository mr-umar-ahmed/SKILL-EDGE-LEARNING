import type {
  AppState,
  Assignment,
  BadgeDef,
  Difficulty,
  GamifiedStep,
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
    requirements: ["Earn 5,000 XP", "Complete 3 Skills", "Maintain a 14-Day Streak"],
    rewards: ["Builder Badge", "Advanced Missions", "Project Review Priority", "Special Discounts"],
    minXp: 5000,
    minSkillsCompleted: 3,
    minStreak: 14,
  },
  {
    tierNumber: 4,
    name: "Master",
    color: "Orange",
    hexColor: "#f97316",
    iconName: "Flame",
    requirements: ["Earn 15,000 XP", "Complete 6 Skills", "Maintain a 30-Day Streak"],
    rewards: ["Master Badge", "Pro Features Free", "Mentorship Invites", "Custom Profile Frame"],
    minXp: 15000,
    minSkillsCompleted: 6,
    minStreak: 30,
  },
  {
    tierNumber: 5,
    name: "Legend",
    color: "Gold",
    hexColor: "#eab308",
    iconName: "Crown",
    requirements: ["Earn 30,000 XP", "Complete 12 Skills", "Maintain a 60-Day Streak"],
    rewards: ["Legend Badge", "Lifetime Access", "Exclusive Leaderboard", "Direct Founder Support"],
    minXp: 30000,
    minSkillsCompleted: 12,
    minStreak: 60,
  },
];

export function studentTierForXp(xp: number): StudentTier {
  let tier = STUDENT_TIERS[0];
  for (const t of STUDENT_TIERS) {
    if (xp >= t.minXp) tier = t;
  }
  return tier;
}

export const CERT_TIERS = [
  { level: 5, name: "Phase Completion Certificate", badge: "Milestone" },
  { level: 10, name: "Master Skill Certificate", badge: "Mastery" },
];

export const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
];

export const SKILL_TRANSFORMATIONS: Record<string, SkillTransformation> = {
  "vibe-coding": {
    become: "AI Software Engineer & Flagship Product Architect",
    headline: "Transform from complete beginner into a confident AI-powered software engineer capable of independently building, debugging, and deploying production SaaS applications, AI agents, and custom web products.",
    canBuild: [
      "Fullstack SaaS Applications with Supabase & Clerk Auth",
      "Autonomous AI Agents & Multi-Agent Workflow Engines",
      "Interactive Dark-Mode Dashboards & API Integrations",
      "Production-Ready Micro-Tools Deployed on Vercel with Custom Domains",
    ],
    realWorldOutcomes: [
      "Collaborate with AI (Lovable, Bolt, Cursor, Claude Code) to build production software 10x faster",
      "Master web systems architecture: Frontends, Backends, Databases, APIs, Auth, and Cloud Deployment",
      "Systematically debug, test, and ship software products without getting stuck memorizing traditional syntax",
    ],
    projectsCompleted: [
      "AI SaaS Landing Page & Responsive UI Kit",
      "Multi-Platform AI Coding Tool Comparison Audit",
      "Fullstack SaaS Backend with Supabase DB & Clerk Auth",
      "Autonomous AI Research Agent & Multi-Model Chatbot",
      "Flagship Capstone AI SaaS Deployed on Live Custom Domain",
    ],
    careerOpportunities: [
      "AI Software Engineer ($95k - $175k/yr)",
      "Founding Engineer & Micro-SaaS Creator ($5k - $20k/mo)",
      "Freelance AI App Developer ($80 - $160/hr)",
    ],
  },
  "ai-automation": {
    become: "AI Workflow & Automation Specialist",
    headline: "By completing this skill, you'll become an AI Workflow Specialist capable of building autonomous multi-step business automations using Make.com, n8n, and OpenAI APIs.",
    canBuild: [
      "Autonomous Customer Support Agents",
      "Multi-App Data Sync Pipelines",
      "Automated Content & Lead Generators",
      "Custom Webhook & API Integrations",
    ],
    realWorldOutcomes: [
      "Automate manual business tasks across Make.com, n8n, and Zapier",
      "Connect LLM API endpoints to internal tools and databases",
      "Monetize business process automations for agency clients",
    ],
    projectsCompleted: [
      "Multi-Agent Support Auto-Responder",
      "Automated Lead Scoring & CRM Pipeline",
      "Self-Hosted n8n Executive Briefing Workflow",
    ],
    careerOpportunities: [
      "AI Operations Specialist ($80k - $135k/yr)",
      "Automation Consultant ($100/hr)",
      "Growth Automation Lead",
    ],
  },
  "ai-product-management": {
    become: "Technical AI Product Manager",
    headline: "By completing this skill, you'll become a Technical AI Product Manager capable of defining, scoping, wireframing, and shipping AI-first products.",
    canBuild: [
      "AI Product Requirement Documents (PRDs)",
      "Interactive Wireframes & Feature Specs",
      "Product Analytics Dashboards",
      "GTM & Product Launch Playbooks",
    ],
    realWorldOutcomes: [
      "Scope AI product features with technical feasibility and ROI",
      "Define user stories, metrics (DAU, retention), and feature roadmaps",
      "Lead cross-functional engineering and design teams effortlessly",
    ],
    projectsCompleted: [
      "Complete AI Product PRD & Spec",
      "Figma Product Wireframe & User Flow",
      "Product Hunt Launch Execution Deck",
    ],
    careerOpportunities: [
      "AI Product Manager ($110k - $190k/yr)",
      "Technical PM / Growth Product Owner",
      "Product Strategy Consultant",
    ],
  },
  "fullstack-web": {
    become: "Fullstack Next.js & TypeScript Engineer",
    headline: "By completing this skill, you'll become a Fullstack Engineer capable of architecting production web apps using Next.js 14, Tailwind CSS, TypeScript, and Supabase.",
    canBuild: [
      "Production Next.js 14 Applications",
      "Database Schemas & REST/GraphQL APIs",
      "Real-time Dashboards with Tailwind CSS",
      "Authenticated E-Commerce & SaaS Apps",
    ],
    realWorldOutcomes: [
      "Master Next.js App Router, Server Actions, and Supabase",
      "Architect clean, performant, and type-safe web codebases",
      "Pass technical interviews and build production-grade web systems",
    ],
    projectsCompleted: [
      "TypeScript & Tailwind Component Library",
      "Supabase Database & Auth Engine",
      "Fullstack E-Commerce & SaaS Web App",
    ],
    careerOpportunities: [
      "Fullstack Engineer ($95k - $165k/yr)",
      "Frontend Developer (React/Next.js)",
      "Contract Web Architect ($80 - $140/hr)",
    ],
  },
  "ui-ux-design": {
    become: "Senior UI/UX & Design Systems Specialist",
    headline: "By completing this skill, you'll become a Product Designer capable of crafting UI design systems, Auto Layout components, and interactive prototypes in Figma.",
    canBuild: [
      "Figma Component Libraries & Design Systems",
      "Interactive High-Fidelity App Prototypes",
      "Mobile & Web Visual Interfaces",
      "UX Research & Usability Audit Reports",
    ],
    realWorldOutcomes: [
      "Build scalable Figma Auto Layout components with design tokens",
      "Conduct user testing and eliminate usability friction points",
      "Deliver developer-ready design handoffs following WCAG accessibility",
    ],
    projectsCompleted: [
      "Dark-Theme Mobile UI Kit in Figma",
      "Interactive SaaS Web Application Prototype",
      "Design System Documentation & Token Sheet",
    ],
    careerOpportunities: [
      "UI/UX Designer ($85k - $150k/yr)",
      "Product Designer / Design Systems Lead",
      "Freelance UX Specialist ($70 - $130/hr)",
    ],
  },
  "ai-content-creation": {
    become: "AI Content Architect & Media Creator",
    headline: "By completing this skill, you'll become an AI Content Creator capable of producing viral short-form and long-form media using AI scripting, Midjourney visuals, and CapCut editing.",
    canBuild: [
      "Viral Short-Form Shorts & Reels",
      "AI Voiceover & Scripting Pipelines",
      "Midjourney & Canvas Visual Banners",
      "YouTube Channel Brand Engines",
    ],
    realWorldOutcomes: [
      "Script and edit high-engagement videos with CapCut/Premiere and AI",
      "Generate custom hyper-realistic visual assets and thumbnails",
      "Build a scalable digital audience and media brand asset",
    ],
    projectsCompleted: [
      "10-Part Viral Short-Form Video Series",
      "AI Generated Visual Asset & Brand Pack",
      "YouTube Growth Engine & Channel Launch",
    ],
    careerOpportunities: [
      "Digital Media Manager ($65k - $115k/yr)",
      "AI Content Lead / Media Creator",
      "Short-Form Video Strategist",
    ],
  },
  "digital-growth": {
    become: "Growth Marketing & Funnel Specialist",
    headline: "By completing this skill, you'll become a Growth Marketer capable of executing data-driven acquisition funnels, Meta/Google performance ads, and SEO strategies.",
    canBuild: [
      "High-Converting Sales & Lead Funnels",
      "Meta & Google Performance Ad Campaigns",
      "SEO Content Clusters & Keyword Maps",
      "Email Automation & Retention Workflows",
    ],
    realWorldOutcomes: [
      "Lower Customer Acquisition Cost (CAC) and scale ROAS",
      "Optimize landing page conversions (CRO) with data analytics",
      "Draft persuasive ad copy and automated email sequences",
    ],
    projectsCompleted: [
      "Landing Page Conversion Audit & CRO Wireframe",
      "Meta/Google Ad Campaign Structure & Copy",
      "SEO Content Map & GA4 Tracking Setup",
    ],
    careerOpportunities: [
      "Growth Marketing Manager ($85k - $155k/yr)",
      "Performance Marketer / Paid Ads Specialist",
      "Conversion Optimization Consultant",
    ],
  },
  freelancing: {
    become: "Independent High-Ticket Service Provider",
    headline: "By completing this skill, you'll become a High-Paid Freelancer capable of closing $1,000+ deals on Upwork, Fiverr, and cold outreach.",
    canBuild: [
      "High-Converting Upwork & Fiverr Profiles",
      "Winning Cold Pitch & Proposal Templates",
      "Value-Based Pricing Calculators & Contracts",
      "Client Onboarding & Invoice Systems",
    ],
    realWorldOutcomes: [
      "Land $1,000+ client projects through structured proposal frameworks",
      "Implement value-based pricing and recurring retainer contracts",
      "Manage client communication, scope changes, and timely payments",
    ],
    projectsCompleted: [
      "Top-Rated Upwork Profile & Portfolio Sheet",
      "5 Custom Client Proposals & Cold Pitch Script",
      "Standard Client Services Agreement & Invoice Template",
    ],
    careerOpportunities: [
      "Independent Service Provider ($5k - $15k/mo)",
      "Agency Founder / Solopreneur",
      "High-Ticket Sales Consultant",
    ],
  },
  "data-analytics": {
    become: "Data Analyst & Business Intelligence Specialist",
    headline: "By completing this skill, you'll become a Data Analyst capable of querying SQL databases, wrangling data in Python, and building Tableau/Looker dashboards.",
    canBuild: [
      "SQL Complex Query Pipelines",
      "Interactive Tableau & Looker Dashboards",
      "Cohort & Retention Analytics Reports",
      "Python Data Wrangling Notebooks",
    ],
    realWorldOutcomes: [
      "Extract insights from multi-table relational databases using SQL",
      "Clean, transform, and visualize large datasets using Python",
      "Present executive metrics to guide executive business decisions",
    ],
    projectsCompleted: [
      "SQL E-Commerce Cohort Retention Analysis",
      "Python Pandas Sales Data Wrangling Script",
      "Executive KPI Dashboard in Tableau/Looker",
    ],
    careerOpportunities: [
      "Data Analyst ($75k - $135k/yr)",
      "Business Intelligence Engineer",
      "Growth Analytics Consultant",
    ],
  },
  cybersecurity: {
    become: "Junior Security Analyst & Defense Specialist",
    headline: "By completing this skill, you'll become a Security Analyst capable of defending web applications against OWASP Top 10 vulnerabilities and network threats.",
    canBuild: [
      "Vulnerability Audit Reports",
      "OWASP Security Fix Test Suites",
      "Network Traffic Wireshark Logs",
      "Hardened Server & Auth Specs",
    ],
    realWorldOutcomes: [
      "Identify and patch OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF)",
      "Audit network traffic and enforce secure authentication protocols",
      "Hardening cloud web infrastructure against automated attacks",
    ],
    projectsCompleted: [
      "OWASP Top 10 Web Security Audit Report",
      "Wireshark Network Traffic Packet Analysis",
      "Secure Auth & Data Encryption Implementation",
    ],
    careerOpportunities: [
      "Cybersecurity Analyst ($85k - $145k/yr)",
      "Junior Ethical Hacker / SOC Analyst",
      "AppSec Consultant",
    ],
  },
  "research-critical-thinking": {
    become: "Lead Research Analyst & Information Strategist",
    headline: "By completing this skill, you'll become a Research Analyst capable of evaluating evidence, detecting cognitive biases, and authoring rigorous reports with AI.",
    canBuild: [
      "Evidence-Based Industry Intelligence Reports",
      "Bias & Logic Audit Frameworks",
      "AI-Assisted Academic Literature Reviews",
      "Strategic Decision Matrix & Risk Briefs",
    ],
    realWorldOutcomes: [
      "Verify source credibility and eliminate misinformation or hallucinated facts",
      "Leverage AI tools (Perplexity, Elicit, Consensus) for deep research synthesis",
      "Formulate sound, logic-backed recommendations for complex decisions",
    ],
    projectsCompleted: [
      "Comprehensive AI Industry Market Research Brief",
      "Fact-Checking & Bias Audit Matrix",
      "Strategic Decision & Risk Assessment Report",
    ],
    careerOpportunities: [
      "Research Analyst ($70k - $125k/yr)",
      "Intelligence Strategist / Policy Analyst",
      "Executive Research Consultant",
    ],
  },
  "prompt-engineering": {
    become: "AI Context Architect & Prompt Engineer",
    headline: "By completing this skill, you'll become a Prompt Engineer capable of architecting system prompt libraries, Few-Shot examples, CoT reasoning, and RAG pipelines.",
    canBuild: [
      "Production System Prompt Libraries",
      "Chain-of-Thought (CoT) & Few-Shot Templates",
      "RAG Context Retrieval Architectures",
      "LLM Evaluation & Benchmark Suites",
    ],
    realWorldOutcomes: [
      "Design zero-hallucination system prompts for enterprise LLM apps",
      "Optimize prompt context windows and reduce token costs",
      "Benchmark model outputs against gold-standard evaluation datasets",
    ],
    projectsCompleted: [
      "Enterprise System Prompt & Few-Shot Library",
      "RAG Context Retrieval & Grounding Spec",
      "LLM Output Evaluation & Accuracy Suite",
    ],
    careerOpportunities: [
      "Prompt Engineer ($100k - $175k/yr)",
      "AI Context Architect",
      "LLM Specialist Consultant",
    ],
  },
};

interface SkillSeed {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  color: string;
  videoIds: string[];
  levels: [title: string, brief: string][];
  bank: [prompt: string, correct: string, wrong1: string, wrong2: string, wrong3: string][];
}

const SKILL_SEEDS: SkillSeed[] = [
  {
    id: "vibe-coding",
    title: "AI Vibe Coding & Software Engineering",
    category: "AI & Tech",
    iconName: "Code",
    description: "Build SaaS, mobile apps, tools and micro-agents using Cursor, Claude Code, Windsurf, Bolt, Supabase and Vercel.",
    color: "#3b82f6",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Prompt Anatomy 101", "Write a precise system prompt instructing AI to scaffold a clean Next.js 14 app with Tailwind CSS."],
      ["Context & Rules Engineering", "Create a .cursorrules or CLAUDE.md file specifying tech stack, design tokens, and coding conventions."],
      ["UI Component Scaffolding", "Use Cursor/Windsurf to build a responsive dark-mode hero section and navbar in under 5 minutes."],
      ["Database Schema & Supabase", "Prompt AI to generate a PostgreSQL schema and Supabase client with row-level security (RLS)."],
      ["Authentication & Protected Routes", "Connect Clerk/Supabase auth with protected routes and a user profile dashboard."],
      ["API Integration & Webhooks", "Prompt AI to connect a public API endpoint, handling loading, success, and error states."],
      ["AI Debugging & Refactoring", "Feed a complex stack trace to AI, diagnose the root cause, and apply a clean fix."],
      ["Automated Testing with AI", "Prompt AI to write Jest/Playwright tests verifying core user flows and components."],
      ["Vercel Deployment & CI/CD", "Deploy your AI-built web app to Vercel with environment variables and custom domain setup."],
      ["SaaS Capstone: Launch Product", "Ship a complete AI SaaS MVP with auth, database, payment links, and public GitHub repository."],
    ],
    bank: [
      ["In AI Vibe Coding, what is the primary purpose of a `.cursorrules` file?", "Providing explicit stack rules and context guidelines to the AI", "Compiling TypeScript into JavaScript", "Storing secret database password keys", "Creating CSS animations"],
      ["What is the fastest way to debug a runtime error using Cursor or Windsurf?", "Copy the exact error stack trace into AI chat and ask for diagnosis", "Delete node_modules and restart computer", "Rewrite the app from scratch", "Disable TypeScript checks"],
      ["Which technology handles serverless database persistence & auth effortlessly with Next.js?", "Supabase", "jQuery", "Apache HTTP Server", "Bootstrap 3"],
      ["What does Vercel do in modern AI software development?", "Hosts and deploys Next.js web applications instantly", "Generates logo graphics", "Edits video files", "Sends SMS messages"],
      ["Why is breaking features into small modular prompts better than asking AI to 'build everything'?", "Prevents hallucination and keeps code clean and testable", "AI cannot write code longer than 10 lines", "It increases cloud costs", "It deletes old files"],
      ["What is Claude Code / Windsurf primarily designed for?", "AI-assisted multi-file codebase manipulation", "Playing 3D games", "Crypto mining", "Editing PDF documents"],
    ],
  },
  {
    id: "ai-automation",
    title: "AI Automation & Workflow Engineering",
    category: "AI & Tech",
    iconName: "Zap",
    description: "Build autonomous multi-step agents, webhooks, and enterprise workflow automations with Make, n8n, and OpenAI.",
    color: "#06b6d4",
    videoIds: ["u4ZoJKF_VuA", "UF8uR6Z6KLc"],
    levels: [
      ["Automation Trigger/Action Logic", "Map a complete 4-step automation flow from web form trigger to CRM action."],
      ["Make.com Scenario Scaffolding", "Build a Make.com scenario that catches webhooks and parses JSON payloads."],
      ["n8n Self-Hosted Workflows", "Set up an n8n workflow node connecting HTTP requests to a Discord or Slack bot."],
      ["OpenAI API Node Integration", "Connect OpenAI GPT-4o API into a workflow to automatically summarize incoming customer emails."],
      ["JSON Parsing & Data Mapping", "Extract structured JSON fields from raw API output and map them into spreadsheet columns."],
      ["Multi-Agent Router Workflows", "Build a conditional branch routing support tickets based on sentiment analysis."],
      ["Webhook Security & Auth", "Implement bearer token authentication and payload verification for custom webhooks."],
      ["Error Handling & Auto-Retries", "Design error fallback routes that log failures and send email alerts on API downtime."],
      ["Scheduled Cron Automations", "Create a daily automated briefing workflow fetching news RSS feeds and sending a summary."],
      ["Client Automation Capstone", "Deploy a complete client automation system that qualifies leads and schedules calendar events."],
    ],
    bank: [
      ["What is a Webhook in workflow automation?", "An automated HTTP callback triggered by an event", "A fishing tool", "A CSS style rule", "A browser bookmark"],
      ["What makes n8n distinct from Zapier?", "n8n is open-source and can be self-hosted", "n8n only works on mobile phones", "n8n cannot connect to APIs", "n8n is a database"],
      ["In Make.com, what does a Router module do?", "Splits a workflow execution path based on filter conditions", "Increases internet speed", "Deletes data", "Generates images"],
      ["Why do we parse JSON in automation flows?", "To extract specific structured data fields for downstream nodes", "To format text in bold", "To compile C++ code", "To encrypt hard drives"],
      ["What is the purpose of an API Key in OpenAI node integrations?", "Authenticating requests securely with the API provider", "Unlocking Windows OS", "Formatting HTML text", "Measuring monitor resolution"],
      ["What is an ideal fallback strategy when an external API node fails?", "Triggering an error handler node that logs details and alerts an admin", "Crashing the entire server", "Ignoring all future data", "Deleting the workflow"],
    ],
  },
  {
    id: "ai-product-management",
    title: "AI Product Management & Strategy",
    category: "AI & Tech",
    iconName: "Layers",
    description: "Define, scope, wireframe, and ship AI-first products with PRDs, user stories, metrics, and launch roadmaps.",
    color: "#8b5cf6",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Problem Framing & User Pain", "Write a 1-page Problem Statement identifying a real user friction point for an AI tool."],
      ["AI Feasibility & ROI Matrix", "Evaluate 5 proposed AI features based on technical feasibility, latency, and user value."],
      ["Writing Production PRDs", "Draft a complete PRD detailing problem, success metrics, user stories, and edge cases."],
      ["User Story Mapping", "Break a feature into 10 user stories with explicit Acceptance Criteria."],
      ["Figma Wireframing for PMs", "Create a low-fidelity wireframe user flow for an AI search interface in Figma."],
      ["Product Analytics & Metrics", "Define North Star metric, DAU/MAU ratios, and retention funnels for an AI app."],
      ["A/B Testing & Feature Flags", "Design a split-test hypothesis evaluating prompt UX variations on conversion."],
      ["Developer Handoff & Specs", "Conduct a mock developer handoff presenting technical specs and API requirements."],
      ["Product Hunt Launch Strategy", "Draft a Product Hunt launch checklist including gallery assets, maker comment, and hunter outreach."],
      ["AI Product Capstone", "Present a complete AI Product Spec, Figma wireframe, and GTM strategy to stakeholders."],
    ],
    bank: [
      ["What does a PRD stand for in Product Management?", "Product Requirements Document", "Public Relations Data", "Program Release Description", "Project Return Date"],
      ["What is a North Star Metric?", "The single key metric that best captures the core value delivered to customers", "Total office space area", "Number of lines of code written", "Company age in years"],
      ["Why should PMs define Acceptance Criteria in User Stories?", "To establish clear conditions that must be met for a feature to be considered complete", "To calculate taxes", "To pick brand colors", "To hire designers"],
      ["In AI Product Management, what is 'latency'?", "The time delay between a user prompt request and the model response", "The monthly rent cost", "The screen brightness", "The font size"],
      ["What is the main goal of low-fidelity wireframing?", "Quickly mapping visual layout and user flow without getting distracted by polished visuals", "Writing final production code", "Generating logos", "Designing legal contracts"],
      ["What is A/B testing used for in growth PM?", "Comparing two product variants to determine which performs better statistically", "Testing blood types", "Auditing tax filings", "Formatting code files"],
    ],
  },
  {
    id: "fullstack-web",
    title: "Modern Fullstack Web Architecture",
    category: "AI & Tech",
    iconName: "Globe",
    description: "Master Next.js 14 App Router, TypeScript, Tailwind CSS, Server Actions, and Supabase database architecture.",
    color: "#2563eb",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Next.js App Router Foundations", "Scaffold a Next.js 14 app structuring layout.tsx, page.tsx, and nested routes."],
      ["TypeScript Interfaces & Schemas", "Define strict TypeScript types for Users, Products, and Database Models."],
      ["Tailwind CSS Design System", "Build reusable UI buttons, cards, and modals using utility-first Tailwind CSS."],
      ["Server vs Client Components", "Refactor a component tree placing state in client components and data fetching on server."],
      ["Server Actions & Form Handling", "Create Next.js Server Actions to process form submissions with Zod validation."],
      ["Supabase Database Architecture", "Design PostgreSQL tables with foreign key constraints and Row-Level Security (RLS)."],
      ["API Routes & Webhooks", "Build a custom Next.js API route handling GET/POST requests and JSON responses."],
      ["State Management & Context", "Implement a React Context state store managing global cart/user application state."],
      ["Performance & SEO Optimization", "Optimize images, font loading, and OpenGraph meta tags for 95+ Lighthouse score."],
      ["Fullstack Capstone Project", "Deploy a complete authenticated fullstack web application with Supabase on Vercel."],
    ],
    bank: [
      ["In Next.js App Router, how do you mark a component to run on the client side?", "Add `'use client'` directive at the top of the file", "Add `runOnClient()` function", "Name the file `.client.js`", "Use `import React`"],
      ["What is the primary advantage of Next.js Server Components?", "Zero bundle size for dependencies used exclusively on the server", "They execute inside the browser console", "They make CSS load faster", "They disable TypeScript"],
      ["In Tailwind CSS, what utility class creates rounded corners?", "rounded-xl", "corner-round", "border-radius-10", "circle-box"],
      ["What does Zod do in TypeScript web development?", "Validates data schemas at runtime with static type inference", "Compiles React into C++", "Manages database servers", "Styles HTML headers"],
      ["What is Row-Level Security (RLS) in Supabase/PostgreSQL?", "Security policies restricting database row access based on authenticated user ID", "Encrypting monitor screens", "Password protecting Wi-Fi", "Formatting JSON text"],
      ["What command creates a production-optimized build of a Next.js app?", "npm run build", "npm dev start", "git push main", "tsc --clean"],
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Systems & Visual Craft",
    category: "Design & Media",
    iconName: "Palette",
    description: "Craft modern UI/UX design systems, Figma Auto Layout components, interactive prototypes, and handoff specs.",
    color: "#ec4899",
    videoIds: ["u4ZoJKF_VuA", "UF8uR6Z6KLc"],
    levels: [
      ["Figma Canvas & Frame Basics", "Set up a Figma canvas with mobile and desktop grid systems and typography scales."],
      ["Color Tokens & Typography", "Create a dark-theme color palette with HSL tokens and typography hierarchy."],
      ["Auto Layout Mastery", "Build dynamic card layouts using Figma Auto Layout padding and alignment properties."],
      ["Component Variants & States", "Create a master button component with Hover, Active, Disabled, and Loading variants."],
      ["Interactive Prototyping", "Connect 5 app screens with smart animate transitions and interactive hover effects."],
      ["UX Research & Wireframing", "Sketch low-fidelity user flow wireframes addressing a specific usability bottleneck."],
      ["WCAG Accessibility Standards", "Audit contrast ratios and font sizing to satisfy WCAG AA accessibility standards."],
      ["Design System Documentation", "Document UI guidelines, component rules, and spacing tokens in a Figma file."],
      ["Developer Handoff & Export", "Export SVG icons, CSS inspection specs, and asset packs for engineering handoff."],
      ["UI/UX Design Capstone", "Deliver a complete production-ready app UI kit and interactive prototype in Figma."],
    ],
    bank: [
      ["In Figma, what is the key benefit of Auto Layout?", "Containers resize dynamically based on text content and nested elements", "It automatically writes Python code", "It removes background colors", "It generates domain names"],
      ["What does WCAG stand for in design accessibility?", "Web Content Accessibility Guidelines", "Web Color Alignment Group", "Wide Canvas Application Grid", "Wireframe Code Architecture Guide"],
      ["What is a Component Variant in Figma?", "Grouped variations of a component (e.g. primary, secondary, disabled) under one master element", "A broken vector path", "A exported PNG file", "A plugin error"],
      ["Why is visual hierarchy essential in UI design?", "It guides the user's eye to the most critical information first", "It makes all fonts the exact same size", "It removes all whitespace", "It forces users to scroll down"],
      ["What is the ideal contrast ratio for normal text under WCAG AA standards?", "At least 4.5:1", "1:1", "100:1", "0.5:1"],
      ["What is Smart Animate in Figma prototyping?", "An feature that automatically interpolates matching layer changes between frames", "An AI code generator", "A sound effect recorder", "A font installer"],
    ],
  },
  {
    id: "ai-content-creation",
    title: "AI Content Engine & Digital Storytelling",
    category: "Design & Media",
    iconName: "Video",
    description: "Produce viral short-form and long-form video engines using AI scripting, Midjourney visuals, and CapCut editing.",
    color: "#f43f5e",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Hook Psychology & Scripting", "Write 3 viral short-form video hooks using curiosity and pattern interruption."],
      ["AI Scriptwriting Pipelines", "Prompt ChatGPT/Claude to structure a 60-second video script with visual cues."],
      ["Midjourney & Visual Generation", "Generate hyper-realistic video background assets using Midjourney/Ideogram."],
      ["AI Voice Cloning & Voiceover", "Synthesize a natural voiceover using ElevenLabs with realistic cadence and emotion."],
      ["CapCut Short-Form Editing", "Edit a 30-second short with dynamic captions, sound FX, and speed ramps in CapCut."],
      ["Click-Worthy Thumbnail Craft", "Design a high-CTR YouTube thumbnail using Photoshop/Canva and visual contrast."],
      ["Multi-Platform Formatting", "Adapt 1 core video into 9:16 Shorts/Reels and 16:9 YouTube formats."],
      ["Channel Branding & SEO", "Optimize YouTube titles, tags, and description for maximum search discovery."],
      ["Analytics & Retention Audit", "Analyze viewer drop-off graphs and optimize pacing for future videos."],
      ["AI Content Engine Capstone", "Publish a 5-video short-form series generated using a streamlined AI content pipeline."],
    ],
    bank: [
      ["In short-form video, what is a 'Hook'?", "The first 3 seconds that grab attention and prevent scrolling", "The title screen music", "The ending subscribe button", "The video file format"],
      ["Which tool is industry-standard for realistic AI voiceover synthesis?", "ElevenLabs", "MS Paint", "Excel", "Notepad"],
      ["Why are dynamic auto-captions critical for Shorts and Reels?", "Many users watch social videos on mute in public environments", "Captions increase video file size", "Captions hide background errors", "Captions replace video titles"],
      ["What metric primarily determines if YouTube recommends a Short?", "Average Percentage Viewed & Swipe Away Ratio", "File name length", "Upload time of day only", "Camera brand used"],
      ["What is 'Pattern Interruption' in video editing?", "A sudden change in visual or audio elements to re-engage user focus", "A broken video export", "A camera focus error", "A copyright claim"],
      ["What aspect ratio is used for Instagram Reels and YouTube Shorts?", "9:16 vertical", "16:9 widescreen", "1:1 square", "4:3 TV"],
    ],
  },
  {
    id: "digital-growth",
    title: "Digital Growth & Performance Marketing",
    category: "Marketing & Sales",
    iconName: "TrendingUp",
    description: "Run data-driven customer acquisition funnels, Meta/Google performance ads, CRO, and SEO growth engines.",
    color: "#10b981",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Growth Funnel Architecture", "Map TOFU, MOFU, and BOFU stages for a SaaS or E-commerce customer journey."],
      ["Landing Page CRO Audit", "Audit a landing page identifying 5 conversion friction points and proposing fixes."],
      ["Meta Ad Campaign Setup", "Structure a Meta (Facebook/Instagram) ad campaign targeting custom interest cohorts."],
      ["Persuasive Ad Copywriting", "Write 3 direct-response ad copy variations testing PAS (Pain-Agitate-Solve) framework."],
      ["Google Search Ads Strategy", "Research high-intent keywords and structure a Google Search Ads campaign."],
      ["SEO Keyword & Cluster Mapping", "Build an SEO topic cluster mapping pillar pages and supporting blog articles."],
      ["Email Lead Nurture Flow", "Draft a 4-part automated email welcome sequence nurturing lead magnet downloads."],
      ["GA4 Tracking & Attribution", "Set up Google Analytics 4 event tracking for form submissions and purchases."],
      ["A/B Landing Page Testing", "Design a split-test hypothesis evaluating headline variations on conversion rate."],
      ["Growth Engine Capstone", "Launch a complete performance marketing campaign with tracking, ads, and landing page."],
    ],
    bank: [
      ["In digital growth, what does CAC stand for?", "Customer Acquisition Cost", "Company Asset Capital", "Customer Annual Contract", "Conversion Analytics Code"],
      ["What is the main objective of Top-Of-Funnel (TOFU) marketing?", "Driving broad awareness and attracting potential prospects", "Closing high-ticket contracts", "Sending invoices", "Collecting customer reviews"],
      ["What does CRO stand for in web marketing?", "Conversion Rate Optimization", "Customer Relations Officer", "Central Resource Organization", "Content Rendering Option"],
      ["In Meta Ads, what is 'Lookalike Audience'?", "An audience created to target new people who resemble existing valuable customers", "A list of competitors", "People who blocked your page", "Random international users"],
      ["What is GA4 primarily used for?", "Tracking user behavior analytics and event conversions across web apps", "Editing photos", "Sending bulk emails", "Creating domain names"],
      ["What is the PAS framework in copywriting?", "Problem, Agitate, Solve", "Plan, Action, Success", "Product, Audience, Sales", "Post, Advertise, Share"],
    ],
  },
  {
    id: "freelancing",
    title: "Freelancing & High-Ticket Client Acquisition",
    category: "Marketing & Sales",
    iconName: "Briefcase",
    description: "Close $1,000+ client deals on Upwork, Fiverr, and cold outreach with high-converting proposal frameworks.",
    color: "#84cc16",
    videoIds: ["u4ZoJKF_VuA", "H14bBuluwB8"],
    levels: [
      ["Niche Selection & Offer Definition", "Define your high-value freelance offer, target client avatar, and core promise."],
      ["Portfolio Case Study Packaging", "Format 2 past projects into client-facing case studies focusing on business metrics."],
      ["Top-Rated Upwork Profile", "Write an optimized Upwork profile title, bio, and specialized profiles with social proof."],
      ["High-Converting Proposal Writing", "Draft a customized Upwork proposal addressing client pain points in the first 2 lines."],
      ["Cold Email & LinkedIn Outreach", "Create a personalized cold outreach sequence targeting founders and marketing leads."],
      ["Discovery Call Mastery", "Roleplay a 15-minute discovery call asking qualifying questions and establishing authority."],
      ["Value-Based Pricing Strategy", "Calculate fixed project pricing based on value delivered rather than hourly rates."],
      ["Contracts & Legal Agreements", "Customize a legal service agreement specifying scope, revisions, and payment terms."],
      ["Client Onboarding & Management", "Build a Notion client portal for smooth asset collection and weekly status updates."],
      ["Freelance Agency Capstone", "Send 10 proposals/pitches and document the pipeline from initial contact to closed deal."],
    ],
    bank: [
      ["What is 'Value-Based Pricing' in freelancing?", "Pricing based on the financial impact/value created for the client, not hours spent", "Charging $5 per hour", "Copying competitor prices blindly", "Giving work away for free"],
      ["What is the most critical part of an Upwork proposal?", "The first 2 lines visible in the client preview", "Your high school degree", "Attaching 50 files", "Asking for money immediately"],
      ["Why should freelancers use formal client contracts?", "To clearly define project scope, deliverables, payment milestones, and legal protection", "Contracts are required by law for all emails", "To look like a big corporation", "To delay payment"],
      ["What is the primary goal of a Discovery Call?", "Understanding client needs, qualifying fit, and diagnosing their problem", "Pitching price in the first 30 seconds", "Bragging about your skills", "Asking for an upfront rating"],
      ["In client management, what is 'Scope Creep'?", "Unapproved expansion of project requirements beyond original contract terms", "A software bug", "A slow internet connection", "A late payment fee"],
      ["What is a specialized profile on Upwork?", "A tailored profile section highlighting expertise for a specific sub-niche", "A hidden private profile", "A profile for hiring employees", "A secondary account"],
    ],
  },
  {
    id: "data-analytics",
    title: "Data Analytics & Business Intelligence",
    category: "Data & Security",
    iconName: "BarChart3",
    description: "Extract insights from relational databases using SQL, clean data with Python, and build Tableau/Looker dashboards.",
    color: "#6366f1",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["SQL Relational Database Basics", "Write SELECT, WHERE, ORDER BY, and LIMIT queries on a sample database."],
      ["SQL Aggregations & Grouping", "Calculate monthly revenue and active user metrics using GROUP BY and HAVING."],
      ["SQL Joins & Multi-Table Analytics", "Connect users, orders, and products tables using INNER, LEFT, and RIGHT JOINs."],
      ["Complex Subqueries & CTEs", "Write Common Table Expressions (WITH clauses) to simplify multi-step analytical queries."],
      ["Python Pandas Data Cleaning", "Load a messy CSV dataset into Pandas, handle missing values, and reformat types."],
      ["Data Wrangling & Transformation", "Group, filter, and pivot data using Python Pandas to calculate retention cohorts."],
      ["Visual Data Storytelling", "Design clear bar charts, line graphs, and scatter plots using Matplotlib/Seaborn."],
      ["Tableau / Looker Studio Dashboards", "Connect data sources and build an interactive executive KPI dashboard."],
      ["Executive Metric Presentation", "Draft a 5-slide business intelligence brief highlighting actionable revenue drivers."],
      ["Data Analytics Capstone", "Analyze a raw e-commerce dataset with SQL and Python, delivering an interactive dashboard."],
    ],
    bank: [
      ["In SQL, which clause is used to filter aggregated data after GROUP BY?", "HAVING", "WHERE", "ORDER BY", "LIMIT"],
      ["What type of JOIN returns all records from the left table and matched records from the right table?", "LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL JOIN"],
      ["In Python Pandas, what data structure represents a 2D labeled tabular table?", "DataFrame", "Series", "Tuple", "List"],
      ["What does CTE stand for in advanced SQL queries?", "Common Table Expression", "Central Text Element", "Calculated Type Entity", "Core Table Entry"],
      ["Why is data cleaning a critical step before building dashboards?", "Garbage data leads to incorrect business decisions and false insights", "Data cleaning changes column colors", "It makes files larger", "It deletes database tables"],
      ["In business intelligence, what is 'Cohort Analysis'?", "Tracking the behavior of a specific user group over time (e.g. signup month)", "Counting total employees", "Checking server CPU temperature", "Formatting PDF reports"],
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Ethical Hacking Essentials",
    category: "Data & Security",
    iconName: "Shield",
    description: "Defend web apps against OWASP Top 10 vulnerabilities, analyze network packets, and harden cloud infrastructure.",
    color: "#ef4444",
    videoIds: ["u4ZoJKF_VuA", "UF8uR6Z6KLc"],
    levels: [
      ["Cybersecurity Fundamentals", "Map the CIA Triad (Confidentiality, Integrity, Availability) against real breach cases."],
      ["Network Protocols & IP Subnetting", "Analyze IPv4/IPv6, TCP/UDP handshake, and DNS resolution paths."],
      ["Wireshark Packet Analysis", "Capture network traffic in Wireshark and identify unencrypted HTTP password transmissions."],
      ["OWASP Top 10: SQL Injection", "Identify SQLi vulnerabilities in sample code and apply parameterized queries."],
      ["OWASP Top 10: Cross-Site Scripting", "Demonstrate XSS attack vectors and implement output sanitization and CSP."],
      ["Authentication & Password Security", "Implement bcrypt password hashing, salting, and multi-factor authentication (MFA)."],
      ["Vulnerability Scanning", "Run Nmap network scans identifying open ports and vulnerable service versions."],
      ["Cloud IAM & Permission Security", "Configure Least Privilege IAM roles and bucket permissions in AWS/Supabase."],
      ["Incident Response & Logging", "Build a log monitoring alert rule detecting brute-force login attempts."],
      ["Security Audit Capstone", "Conduct a comprehensive web application security audit report with remediation steps."],
    ],
    bank: [
      ["In cybersecurity, what does the CIA Triad stand for?", "Confidentiality, Integrity, Availability", "Central Intelligence Agency", "Code, Data, Assets", "Control, Inspection, Audit"],
      ["Which OWASP vulnerability occurs when malicious scripts are injected into trusted websites?", "Cross-Site Scripting (XSS)", "SQL Injection", "Buffer Overflow", "DNS Spoofing"],
      ["How do you prevent SQL Injection vulnerabilities in backend code?", "Use parameterized queries / prepared statements", "Disable database backups", "Use HTTP instead of HTTPS", "Encrypt user passwords twice"],
      ["What is Wireshark used for?", "Capturing and analyzing network packet traffic in real-time", "Editing video files", "Compiling TypeScript", "Hosting websites"],
      ["Why should passwords never be stored in plain text?", "If the database is breached, attackers gain instant access to user credentials", "Plain text takes up too much disk space", "Plain text passwords corrupt files", "Plain text breaks CSS styles"],
      ["What does Least Privilege principle dictate in IAM security?", "Users/services should only be granted minimum permissions necessary for their task", "All users get admin rights", "Permissions reset every hour", "No passwords allowed"],
    ],
  },
  {
    id: "research-critical-thinking",
    title: "Research & Critical Thinking",
    category: "Core Skills",
    iconName: "BrainCircuit",
    description: "Evaluate evidence, detect cognitive biases, eliminate AI hallucinations, and author rigorous research reports.",
    color: "#14b8a6",
    videoIds: ["UF8uR6Z6KLc", "u4ZoJKF_VuA"],
    levels: [
      ["Source Verification & CARS Test", "Apply Credibility, Accuracy, Reasonableness, Support test to 3 online claims."],
      ["Cognitive Bias Identification", "Identify Confirmation Bias, Availability Heuristic, and Sunk Cost in business cases."],
      ["Logical Fallacy Detection", "Spot Ad Hominem, Strawman, and False Dilemma fallacies in public debates."],
      ["AI Research Tools (Perplexity/Elicit)", "Use Perplexity, Elicit, and Consensus to gather peer-reviewed paper citations."],
      ["Fact-Checking & Hallucination Audit", "Audit an AI-generated essay cross-referencing every claim against primary sources."],
      ["Structuring Literature Reviews", "Synthesize findings from 5 research papers into a structured matrix."],
      ["Data Evidence Scoring", "Rate research evidence quality from Meta-analyses (high) to Anecdotes (low)."],
      ["Hypothesis Formulation", "Draft falsifiable research hypotheses with explicit variable definitions."],
      ["Executive Decision Matrix", "Construct a weighted decision matrix evaluating strategic choices under uncertainty."],
      ["Research Brief Capstone", "Author a comprehensive, fully-cited research paper on a complex technological topic."],
    ],
    bank: [
      ["What is Confirmation Bias?", "The tendency to search for and favor information that confirms pre-existing beliefs", "Believing everything read online", "Forgetting research sources", "Disagreeing with scientific consensus"],
      ["What is an AI Hallucination?", "When an LLM confidently generates false or fabricated information presented as fact", "A computer virus", "A monitor glitch", "A slow network connection"],
      ["In research evidence hierarchy, which source holds the highest evidence strength?", "Systematic reviews and Meta-analyses of randomized trials", "Social media posts", "Personal anecdotes", "Single opinion blogs"],
      ["What is the Strawman Fallacy?", "Misrepresenting or exaggerating an opponent's argument to make it easier to attack", "Attacking a person's character", "Assuming correlation implies causation", "Repeating an argument continuously"],
      ["Why is primary source verification essential when using AI for research?", "AI models can misattribute quotes or fabricate non-existent scientific paper DOIs", "Primary sources are written in HTML", "Primary sources are always secret", "Primary sources prevent compilation errors"],
      ["What makes a research hypothesis 'falsifiable'?", "It can be proven false through empirical observation or experiment", "It is written in Latin", "It is guaranteed to be true", "It cannot be tested"],
    ],
  },
  {
    id: "prompt-engineering",
    title: "AI Prompt Engineering & Context Architecture",
    category: "Core Skills",
    iconName: "Sparkles",
    description: "Architect production system prompts, Few-Shot examples, Chain-of-Thought reasoning, and RAG context pipelines.",
    color: "#a855f7",
    videoIds: ["u4ZoJKF_VuA", "UF8uR6Z6KLc"],
    levels: [
      ["Prompt Anatomy & System Role", "Structure a system prompt specifying Persona, Context, Constraints, and Output Format."],
      ["Zero-Shot vs Few-Shot Prompting", "Provide 3 high-quality input/output examples to drastically improve model accuracy."],
      ["Chain-of-Thought (CoT) Prompting", "Instruct LLMs to 'think step-by-step' before outputting final answers to solve logic tasks."],
      ["Structured Output (JSON/Markdown)", "Enforce strict JSON schema output formatting using prompt constraints and function schemas."],
      ["Context Window & Token Optimization", "Compress a long text document into an optimized prompt staying under token limits."],
      ["Negative Constraints & Fallbacks", "Implement strict safety boundaries instructing model what NOT to do or say."],
      ["RAG Context Injection", "Design a Retrieval-Augmented Generation prompt injecting retrieved documents into LLM context."],
      ["Function Calling & Agent Tooling", "Write tool definitions allowing LLMs to trigger weather, search, or database functions."],
      ["LLM Evaluation & Benchmarking", "Evaluate 10 prompt variations against an accuracy benchmark grading response quality."],
      ["System Prompt Library Capstone", "Build a production-ready library of enterprise system prompts for real-world AI applications."],
    ],
    bank: [
      ["What is Few-Shot Prompting?", "Providing a few high-quality input-output examples in the prompt to demonstrate desired task performance", "Sending only one word", "Prompting without internet", "Using 3 different computers"],
      ["Why does Chain-of-Thought (CoT) prompting improve complex reasoning?", "It forces the model to break reasoning into explicit intermediate steps before answering", "It increases GPU clock speed", "It translates text into Spanish", "It deletes unnecessary words"],
      ["What is RAG in AI architecture?", "Retrieval-Augmented Generation (injecting relevant external knowledge into prompt context)", "Random Access Graphics", "Realtime Automated Generation", "Read After Grouping"],
      ["What is a System Prompt?", "Top-level instructions defining model behavior, persona, constraints, and formatting rules", "A computer BIOS password", "A Windows terminal command", "A CSS style sheet"],
      ["How do you enforce JSON output from modern LLM APIs?", "Specify JSON schema constraints in system instructions or response_format parameters", "Write text in all capital letters", "Add exclamation marks", "Restart the server"],
      ["What is tokenization in LLMs?", "Breaking text strings into sub-word tokens processed mathematically by the neural net", "Buying crypto coins", "Encrypting database passwords", "Formatting HTML paragraphs"],
    ],
  },
];

const STARTER_RESOURCES: Record<string, LearningResource[]> = {
  "vibe-coding": [
    {
      id: "vibe-res-1",
      type: "LINK",
      title: "Cursor Official Documentation",
      url: "https://docs.cursor.com",
      creator: "Cursor Team",
      isOfficialDocs: true,
      minutes: 10,
    },
    {
      id: "vibe-res-2",
      type: "LINK",
      title: "Anthropic Claude Code Guide",
      url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview",
      creator: "Anthropic",
      isOfficialDocs: true,
      minutes: 12,
    },
    {
      id: "vibe-res-3",
      type: "VIDEO",
      title: "How to Vibe Code Full Apps with Cursor AI",
      url: "UF8uR6Z6KLc",
      creator: "Fireship",
      isOfficialDocs: false,
      minutes: 12,
    },
  ],
  "ai-automation": [
    {
      id: "auto-res-1",
      type: "LINK",
      title: "Make.com Help Center & Scenario Guides",
      url: "https://www.make.com/en/help",
      creator: "Make",
      isOfficialDocs: true,
      minutes: 15,
    },
    {
      id: "auto-res-2",
      type: "LINK",
      title: "n8n Workflows Documentation",
      url: "https://docs.n8n.io",
      creator: "n8n",
      isOfficialDocs: true,
      minutes: 15,
    },
  ],
  "fullstack-web": [
    {
      id: "web-res-1",
      type: "LINK",
      title: "Next.js 14 App Router Official Docs",
      url: "https://nextjs.org/docs",
      creator: "Vercel",
      isOfficialDocs: true,
      minutes: 15,
    },
    {
      id: "web-res-2",
      type: "LINK",
      title: "Tailwind CSS Official Documentation",
      url: "https://tailwindcss.com/docs",
      creator: "Tailwind Labs",
      isOfficialDocs: true,
      minutes: 10,
    },
  ],
  "ui-ux-design": [
    {
      id: "design-res-1",
      type: "LINK",
      title: "Figma Official Help & Auto Layout Guide",
      url: "https://help.figma.com",
      creator: "Figma",
      isOfficialDocs: true,
      minutes: 15,
    },
  ],
  "prompt-engineering": [
    {
      id: "prompt-res-1",
      type: "LINK",
      title: "OpenAI Official Prompt Engineering Guide",
      url: "https://platform.openai.com/docs/guides/prompt-engineering",
      creator: "OpenAI",
      isOfficialDocs: true,
      minutes: 20,
    },
  ],
};

function buildAssignment(seed: SkillSeed, n: number, brief: string): Assignment {
  const isCapstone = n === 10;
  const kindMaps: Record<string, SubmissionKind[]> = {
    "vibe-coding": ["GITHUB", "URL", "FILE"],
    "ai-automation": ["URL", "GOOGLE_DRIVE", "FILE"],
    "ai-product-management": ["NOTION", "FIGMA", "URL"],
    "fullstack-web": ["GITHUB", "URL"],
    "ui-ux-design": ["FIGMA", "URL"],
    "ai-content-creation": ["YOUTUBE", "URL", "FILE"],
    "digital-growth": ["GOOGLE_DRIVE", "URL"],
    freelancing: ["NOTION", "GOOGLE_DRIVE", "URL"],
    "data-analytics": ["GITHUB", "GOOGLE_DRIVE"],
    cybersecurity: ["GITHUB", "FILE"],
    "research-critical-thinking": ["NOTION", "URL"],
    "prompt-engineering": ["GITHUB", "NOTION", "TEXT"],
  };

  const proofMap: Record<string, string[]> = {
    "vibe-coding": ["GitHub repository link with commit history", "Live deployed Vercel/Netlify web application URL"],
    "ai-automation": ["Make/n8n workflow export JSON or link", "Screen recording / screenshot of successful execution"],
    "ai-product-management": ["Notion PRD document or PDF export", "Figma wireframe / user flow link"],
    "fullstack-web": ["GitHub repository with clean code", "Live deployed URL"],
    "ui-ux-design": ["Viewable Figma prototype link", "High-res PNG export of UI components"],
    "ai-content-creation": ["YouTube / Shorts video link", "Raw script and visual asset pack"],
    "digital-growth": ["Google Analytics screenshot / CRO audit report", "Ad copy variations and funnel deck"],
    freelancing: ["Upwork profile screenshot or proposal draft", "Signed contract template or Notion client portal link"],
    "data-analytics": ["GitHub SQL/Python notebook repo", "Interactive Tableau/Looker dashboard link"],
    cybersecurity: ["Security Audit Report PDF", "Wireshark packet capture analysis screenshot"],
    "research-critical-thinking": ["Comprehensive Research Brief PDF / Notion doc", "Fact-checking evidence matrix"],
    "prompt-engineering": ["Prompt library Notion/GitHub link", "LLM evaluation benchmark results"],
  };

  const kinds = kindMaps[seed.id] ?? ["URL", "FILE", "TEXT"];
  const proofs = proofMap[seed.id] ?? ["Link to completed project", "Screenshot of output"];

  return {
    brief: isCapstone
      ? `🚀 CAPSTONE MISSION: Build and ship a complete, professional-grade portfolio artifact for ${seed.title}. Incorporate everything learned across all 9 previous missions.`
      : brief,
    deliverables: [
      isCapstone ? "The finished capstone project, publicly shareable" : "The completed practical task described above",
      ...proofs.slice(0, isCapstone ? proofs.length : 2),
      "A 3-5 line write-up: what you built, what broke, what you learned",
    ],
    checklist: [
      "Go through the interactive Duolingo mission cards",
      `Do the practical task: ${brief.length > 90 ? brief.slice(0, 90).trimEnd() + "…" : brief}`,
      `Collect proof of work (${proofs[0].toLowerCase()})`,
      "Answer the reflection questions honestly",
      "Submit for review — resubmissions are encouraged, not penalized",
    ],
    allowedSubmissionTypes: kinds,
  };
}

const REFLECTIONS_BASE = [
  "What was the hardest part of this mission, and how did you push through it?",
  "If you repeated this mission tomorrow, what would you do differently?",
  "How will you apply what you built here to a real project, client, or audience this week?",
];

function difficultyFor(order: number): Difficulty {
  if (order <= 3) return "Beginner";
  if (order <= 7) return "Intermediate";
  if (order <= 9) return "Advanced";
  return "Expert";
}

const MISSION_PHASES = [
  "Phase 1 · Foundations",
  "Phase 1 · Foundations",
  "Phase 1 · Foundations",
  "Phase 2 · Core Workflows",
  "Phase 2 · Core Workflows",
  "Phase 2 · Core Workflows",
  "Phase 3 · Advanced Practice",
  "Phase 3 · Advanced Practice",
  "Phase 3 · Advanced Practice",
  "Phase 4 · Capstone & Portfolio",
];

function buildMissions(seed: SkillSeed): Mission[] {
  return seed.levels.map(([title, brief], i) => {
    const n = i + 1;
    // Rotate 5-question knowledge check
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
        title: `${title} — Curated Video Lesson`,
        url: seed.videoIds[i % seed.videoIds.length],
        creator: i % 2 === 0 ? "Fireship" : "Theo - t3.gg",
        minutes: 15,
      },
      ...(n === 1 ? STARTER_RESOURCES[seed.id] ?? [] : []),
    ];

function buildVibeCodingSteps(n: number, title: string, brief: string): GamifiedStep[] {
  switch (n) {
    case 1:
      return [
        {
          id: "vibe-coding-l1-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Imagine trying to build a skyscraper by hand-carving every single brick vs having an AI super-architect build your blueprint in 30 seconds... 🤯 absolute cheat code status!",
        },
        {
          id: "vibe-coding-l1-step2",
          type: "STORY",
          title: "Story Card: From Syntax Slog to AI Architect 🚀",
          storyText: "Meet Alex. Alex spent 6 months trying to memorize JavaScript syntax and almost quit tech forever 💀. Then Alex discovered Vibe Coding: collaborating with AI as a product architect. In just 24 hours, Alex built and shipped a live SaaS landing page that got 500 signups! 🚀",
          storyAnalogy: "Traditional coding is like handwriting a 500-page book letter by letter. AI Vibe Coding is like directing a movie where AI is your Oscar-winning production crew! 🎬💻",
        },
        {
          id: "vibe-coding-l1-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Systems Architecture 🏛️",
          discoveryText: "Software engineering isn't syntax memorization — it's Systems Architecture! 🧠\n\n1. Client (Frontend UI) = What users see (React/Tailwind)\n2. Server (Backend) = The brain processing logic\n3. Database (Supabase) = Secure vault storing user data\n4. APIs = Bridges connecting services\n5. Auth (Clerk) = Security guard checking passes\n6. Hosting (Vercel) = Cloud launchpad.\n\nYou direct the AI like a movie director!",
        },
        {
          id: "vibe-coding-l1-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Systems Match 🎯",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match each modern web architecture component with its core role:",
            pairs: [
              { left: "Client (Frontend)", right: "Visual interface users interact with" },
              { left: "Server (Backend)", right: "Processes business logic & calculations" },
              { left: "Database (Supabase)", right: "Persistent data storage vault" },
              { left: "API Bridge", right: "JSON messenger between services" },
            ],
            explanation: "Spot on! 🎯 When you understand how these components communicate, AI does the heavy coding for you.",
          },
        },
        {
          id: "vibe-coding-l1-step5",
          type: "REFLECTION",
          title: "Active Recall & Builder Mindset 🧠",
          reflectionQuestion: "Common Mistake: Asking AI to 'build me a full app' without specifying architecture components! In your own words, why is thinking like a product builder 10x more valuable than memorizing traditional syntax?",
        },
        {
          id: "vibe-coding-l1-step6",
          type: "REWARD",
          title: "Module 1 Victory! 🎉",
          xpReward: 50,
          neuronReward: 15,
        },
      ];
    case 2:
      return [
        {
          id: "vibe-coding-l2-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Ever seen an AI write code that looks super smart, but completely crashes your browser when you hit run? 💀 Welcome to the AI Hallucination Trap!",
        },
        {
          id: "vibe-coding-l2-step2",
          type: "STORY",
          title: "Story Card: The Power of .cursorrules 🤖",
          storyText: "Sarah asked ChatGPT: 'Build me an app'. ChatGPT generated a broken, outdated snippet. Then Sarah created a `.cursorrules` context file specifying Next.js 14, Tailwind CSS, and Supabase RLS. The AI generated a 500-line production app on the first try! 🔥",
          storyAnalogy: "Prompting AI without context is like telling an Uber driver 'take me somewhere nice'. Context engineering gives the driver exact GPS coordinates and lane instructions! 🗺️",
        },
        {
          id: "vibe-coding-l2-step3",
          type: "DISCOVERY",
          title: "Core Explanation & AI Platform Toolkit 🛠️",
          discoveryText: "Mastering the AI Coding Stack: Lovable, Z.ai, Bolt.new, Google AI Studio, Claude Code, Cursor, GitHub Copilot. 🛠️\n\nThe 3 Rules of Context Engineering:\n1. Provide tech stack rules (.cursorrules / CLAUDE.md)\n2. Prompt Chaining: Break big features into micro-steps\n3. Iterative Refinement: Feed exact stack traces back to AI when errors happen.",
        },
        {
          id: "vibe-coding-l2-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Hallucination Defense 🛑",
          miniMission: {
            type: "FILL_BLANKS",
            question: "To prevent AI coding tools from generating outdated or broken packages, developers use a ___ file.",
            fillBlankSentence: "We enforce coding standards and stack choices using a ___ file.",
            blankOptions: [".cursorrules", "styles.css", "index.html", "readme.txt"],
            correctAnswer: ".cursorrules",
            explanation: "Bingo! `.cursorrules` and `CLAUDE.md` force the AI model to adhere strictly to your exact project stack rules.",
          },
        },
        {
          id: "vibe-coding-l2-step5",
          type: "REFLECTION",
          title: "Active Recall & Common Pitfalls ⚠️",
          reflectionQuestion: "Common Mistake: Guessing why AI code failed instead of feeding raw terminal error logs. How does prompt chaining prevent AI models from freezing on complex multi-file projects?",
        },
        {
          id: "vibe-coding-l2-step6",
          type: "REWARD",
          title: "Module 2 Victory! 🎉",
          xpReward: 100,
          neuronReward: 20,
        },
      ];
    case 3:
      return [
        {
          id: "vibe-coding-l3-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "An ugly UI will destroy even the smartest AI backend on Day 1. 💀 Let's build glassmorphism dark-mode interfaces that make users go WOW at first glance! 🤩✨",
        },
        {
          id: "vibe-coding-l3-step2",
          type: "STORY",
          title: "Story Card: Design is Revenue Leverage 📈",
          storyText: "Two devs launched AI tools on Product Hunt. Dev A built a basic white page with a plain button. Dev B built a dark-mode `#0B0F19` glassmorphism interface with interactive shimmer skeletons. Dev B got 10,000 users and $2,500 MRR on launch day! 📈🤑",
          storyAnalogy: "A great UI is like a luxury sports car's sleek body — even if the engine under the hood is identical, everyone wants to drive the beautiful car! 🏎️💨",
        },
        {
          id: "vibe-coding-l3-step3",
          type: "DISCOVERY",
          title: "Core Explanation & UI/UX Design System 🎨",
          discoveryText: "Modern SaaS UI System:\n1. Base Background: `#0B0F19` (Deep Obsidian)\n2. Surface & Cards: `#111827` & `#1A2235` with subtle 1px border `#2D3748`\n3. Glassmorphism: `backdrop-blur-md` with white/10 opacity\n4. Micro-states: Loading Shimmer Skeletons, Empty States with clear CTAs, Error Toasts\n5. Describing designs to AI using exact Tailwind tokens.",
        },
        {
          id: "vibe-coding-l3-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: UI Token Matching 🎨",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match each UI design concept with its Tailwind CSS token implementation:",
            pairs: [
              { left: "Glassmorphism Card", right: "backdrop-blur-md bg-card/80 border border-line" },
              { left: "Shimmer Skeleton", right: "animate-pulse bg-surface/50 rounded-lg" },
              { left: "Primary Brand CTA", right: "bg-gradient-to-r from-brand to-accent text-white" },
              { left: "Dark Theme Base", right: "bg-[#0B0F19] text-white" },
            ],
            explanation: "Spot on! Pre-defining design tokens allows AI to generate visual interfaces that feel ultra-premium.",
          },
        },
        {
          id: "vibe-coding-l3-step5",
          type: "REFLECTION",
          title: "Active Recall & UX Psychology 🧠",
          reflectionQuestion: "Common Mistake: Forgetting loading and empty states when async AI requests take 3 seconds to complete. Why are skeleton loaders crucial for user retention?",
        },
        {
          id: "vibe-coding-l3-step6",
          type: "REWARD",
          title: "Module 3 Victory! 🎉",
          xpReward: 150,
          neuronReward: 25,
        },
      ];
    case 4:
      return [
        {
          id: "vibe-coding-l4-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "The frontend is the pretty face, but the Backend is the vault where user accounts, databases, and money actually live! 🧠🔐💰",
        },
        {
          id: "vibe-coding-l4-step2",
          type: "STORY",
          title: "Story Card: The Supabase & Clerk Power Combo ⚡",
          storyText: "Imagine trying to build a bank vault by hand. You'd spend years installing steel doors. Supabase gives you an instant PostgreSQL database with real-time updates and cloud storage buckets. Clerk handles Google OAuth in 3 lines of code! ⚡",
          storyAnalogy: "Supabase is your app's high-tech digital filing cabinet. Clerk is the biometric security guard standing at the front door checking badges! 🏢🛡️",
        },
        {
          id: "vibe-coding-l4-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Backend Data Flow 🗄️",
          discoveryText: "Backend Fundamentals:\n1. PostgreSQL Tables: Rows & Columns linked by Foreign Keys\n2. CRUD: Create, Read, Update, Delete data\n3. Row Level Security (RLS): Database rules enforcing that User A can NEVER view or edit User B's private rows!\n4. Clerk Auth: Seamless Google & Email login, JWT session management, protected routes.",
        },
        {
          id: "vibe-coding-l4-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Database Security 🔐",
          miniMission: {
            type: "SCENARIO",
            question: "Which database security mechanism ensures a user can ONLY query their own private database rows in Supabase?",
            options: ["Row Level Security (RLS)", "CSS z-index", "Localstorage", "HTML form action"],
            correctAnswer: "Row Level Security (RLS)",
            explanation: "Correct! RLS policies run directly inside PostgreSQL, guaranteeing zero data leaks across users.",
          },
        },
        {
          id: "vibe-coding-l4-step5",
          type: "REFLECTION",
          title: "Active Recall & Security Auditing 🛡️",
          reflectionQuestion: "Common Mistake: Disabling RLS in production or storing sensitive user data in client-side state. Explain when you would choose Clerk Auth vs native Supabase Auth.",
        },
        {
          id: "vibe-coding-l4-step6",
          type: "REWARD",
          title: "Module 4 Victory! 🎉",
          xpReward: 200,
          neuronReward: 30,
        },
      ];
    case 5:
      return [
        {
          id: "vibe-coding-l5-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "What if your app could talk to OpenAI, Gemini, ElevenLabs voice synthesis, and Stripe payments all in parallel? ⚡ Welcome to API Orchestration!",
        },
        {
          id: "vibe-coding-l5-step2",
          type: "STORY",
          title: "Story Card: The API Superpower 🤖",
          storyText: "Instead of training a billion-dollar AI model yourself, APIs allow you to plug into state-of-the-art models via simple HTTP requests. Groq gives super-fast latency, ElevenLabs generates hyper-realistic human voiceovers, and Resend emails the result to your user! 🤖🎙️",
          storyAnalogy: "APIs are like restaurant menus: your app makes an order (HTTP POST request), the server kitchen cooks it, and brings back delicious JSON data! 🍔📦",
        },
        {
          id: "vibe-coding-l5-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Provider Ecosystem 🌐",
          discoveryText: "API Architecture:\n• REST APIs & JSON Payloads (`{ 'prompt': 'hello' }`)\n• API Keys: Secret tokens authorizing requests\n• Groq API: Insanely fast LLM inference (500+ tokens/sec)\n• OpenRouter: Single endpoint access to 100+ LLMs\n• ElevenLabs: AI Voice Synthesis\n• Resend & Stripe: Emails & Checkout payments.",
        },
        {
          id: "vibe-coding-l5-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: API Ecosystem Match ⚡",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match each API platform with its primary strength:",
            pairs: [
              { left: "Groq API", right: "Ultra-high speed LLM inference" },
              { left: "ElevenLabs API", right: "Realistic AI voiceover generation" },
              { left: "Resend API", right: "Transactional email delivery" },
              { left: "Stripe API", right: "Global credit card checkout" },
            ],
            explanation: "Bingo! Knowing which API provider to use for each job is what separates pro builders from amateurs.",
          },
        },
        {
          id: "vibe-coding-l5-step5",
          type: "REFLECTION",
          title: "Active Recall & Secret Security 🔑",
          reflectionQuestion: "Common Mistake: Hardcoding secret API keys inside frontend React code where anyone can inspect them. Why must API calls be routed through Next.js API Routes or Server Actions?",
        },
        {
          id: "vibe-coding-l5-step6",
          type: "REWARD",
          title: "Module 5 Victory! 🎉",
          xpReward: 250,
          neuronReward: 35,
        },
      ];
    case 6:
      return [
        {
          id: "vibe-coding-l6-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Single prompts are cool, but AI Agents that think step-by-step, search the web, and execute real-world tools autonomously are the FUTURE. 🤖🔥",
        },
        {
          id: "vibe-coding-l6-step2",
          type: "STORY",
          title: "Story Card: The Autonomous Research Agent 🕵️‍♂️",
          storyText: "Meet Agent Jarvis. Jarvis receives a command: 'Find top 5 competitor pricing and email a summary'. Jarvis searches Google, extracts HTML, parses pricing tables, compiles a markdown report, and emails you — zero human intervention required! 🚀",
          storyAnalogy: "A basic LLM is a calculator. An AI Agent is a smart employee with a computer, internet access, and a task list! 💼🌐",
        },
        {
          id: "vibe-coding-l6-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Agent Architecture 🤖",
          discoveryText: "AI Agent Components:\n1. Agent Loop: Observe -> Think -> Act -> Repeat\n2. Tool Calling (Function Calling): Giving LLMs custom tools (e.g. `web_search()`, `send_email()`, `query_db()`)\n3. Memory: Short-term context vs Long-term vector DB\n4. Multi-Agent Systems: Specialized agents collaborating.",
        },
        {
          id: "vibe-coding-l6-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Agent Tool Calling 🛠️",
          miniMission: {
            type: "FILL_BLANKS",
            question: "An AI Agent uses ___ to trigger external functions like searching the web or writing to a database.",
            fillBlankSentence: "Agents execute external actions using ___ definitions.",
            blankOptions: ["Tool Calling", "CSS Styles", "HTML Headings", "Font Sizes"],
            correctAnswer: "Tool Calling",
            explanation: "Spot on! Tool Calling allows the LLM to output structured JSON instructing your backend code to execute real functions.",
          },
        },
        {
          id: "vibe-coding-l6-step5",
          type: "REFLECTION",
          title: "Active Recall & Agent Guardrails 🛡️",
          reflectionQuestion: "Common Mistake: Infinite agent loops that consume thousands of API tokens. How do max iteration caps and human-in-the-loop approvals safeguard agent workflows?",
        },
        {
          id: "vibe-coding-l6-step6",
          type: "REWARD",
          title: "Module 6 Victory! 🎉",
          xpReward: 300,
          neuronReward: 40,
        },
      ];
    case 7:
      return [
        {
          id: "vibe-coding-l7-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "If your app only runs on `localhost:3000`, it doesn't exist to the world! 💀 Let's ship it live to millions of users on Vercel. 🌐🚀",
        },
        {
          id: "vibe-coding-l7-step2",
          type: "STORY",
          title: "Story Card: The 2-Minute Cloud Launch ⚡",
          storyText: "You finish building your SaaS. You push your code to GitHub main branch. Vercel automatically detects the push, runs TypeScript checks, builds the production bundle, and deploys it to your custom domain `mysaas.com` in 90 seconds! ⚡",
          storyAnalogy: "Localhost is practicing in your bedroom. Deployment is stepping onto the stadium stage under the bright lights! 🏟️✨",
        },
        {
          id: "vibe-coding-l7-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Cloud Infrastructure ☁️",
          discoveryText: "Cloud Infrastructure Checklist:\n1. Deployment: Vercel / Netlify serverless deployment\n2. Custom Domains: Pointing CNAME & A records in DNS\n3. Environment Variables: Safely storing production secrets (`SUPABASE_URL`, `OPENAI_API_KEY`)\n4. Telemetry & Analytics: Sentry error monitoring + PostHog user tracking.",
        },
        {
          id: "vibe-coding-l7-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Infrastructure Matching 🌐",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match each deployment & infrastructure tool with its purpose:",
            pairs: [
              { left: "Vercel", right: "Serverless Next.js cloud hosting platform" },
              { left: "Environment Variables", right: "Encrypted production API secret storage" },
              { left: "CNAME DNS Record", right: "Maps custom domain name to host servers" },
              { left: "Sentry", right: "Real-time production crash & error monitoring" },
            ],
            explanation: "Awesome! Knowing cloud infrastructure gives you complete autonomy as a software founder.",
          },
        },
        {
          id: "vibe-coding-l7-step5",
          type: "REFLECTION",
          title: "Active Recall & Environment Security 🔒",
          reflectionQuestion: "Common Mistake: Mixing up development database keys with production database keys. Why is keeping `.env.local` separate from production environment settings vital?",
        },
        {
          id: "vibe-coding-l7-step6",
          type: "REWARD",
          title: "Module 7 Victory! 🎉",
          xpReward: 350,
          neuronReward: 45,
        },
      ];
    case 8:
      return [
        {
          id: "vibe-coding-l8-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Bugs happen to EVERY developer. Amateurs panic and guess. Vibe Coders inspect console telemetry, isolate errors, and prompt AI like a surgeon! 🛠️🎯",
        },
        {
          id: "vibe-coding-l8-step2",
          type: "STORY",
          title: "Story Card: The F12 Inspector Strategy 🔍",
          storyText: "Your submit button throws a red error. Instead of typing 20 random prompts like 'why button no work', you open F12 Dev Tools, copy the exact stack trace `401 Unauthorized: Invalid API Key`, paste it into Cursor, and fix it in 5 seconds flat! 💡",
          storyAnalogy: "Debugging blindly is like fixing a car engine in total darkness. Dev Console and network logs turn on high-powered floodlights! 💡🚗",
        },
        {
          id: "vibe-coding-l8-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Telemetry Toolkit 🛠️",
          discoveryText: "Systematic Debugging Checklist:\n1. Browser Console (Red error stack traces)\n2. Network Tab: Check HTTP Status Codes (200 OK, 401 Unauth, 404 Not Found, 500 Server Error) & JSON payloads\n3. Isolate the Root Cause before modifying code\n4. Feed raw logs & line numbers directly to AI.",
        },
        {
          id: "vibe-coding-l8-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: HTTP Telemetry 🚨",
          miniMission: {
            type: "PREDICT",
            question: "Your app's fetch request to Supabase fails with an HTTP Status 401. What does 401 indicate?",
            options: ["Unauthorized / Invalid authentication credentials", "Server CPU overheated", "Page found successfully", "CSS file missing"],
            correctAnswer: "Unauthorized / Invalid authentication credentials",
            explanation: "Spot on! 401 means the authentication headers or API keys were invalid or missing.",
          },
        },
        {
          id: "vibe-coding-l8-step5",
          type: "REFLECTION",
          title: "Active Recall & Systematic Troubleshooting 🧠",
          reflectionQuestion: "Common Mistake: Modifying working code files before checking the network tab response payload. Why is feeding exact stack traces to AI 10x faster than plain-text bug descriptions?",
        },
        {
          id: "vibe-coding-l8-step6",
          type: "REWARD",
          title: "Module 8 Victory! 🎉",
          xpReward: 400,
          neuronReward: 50,
        },
      ];
    case 9:
      return [
        {
          id: "vibe-coding-l9-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Welcome to the AI SaaS Factory! 🏭 Time to take your skills and build real-world micro-apps that solve real user pain points. 🤑📈",
        },
        {
          id: "vibe-coding-l9-step2",
          type: "STORY",
          title: "Story Card: The Micro-SaaS Arsenal 🏭",
          storyText: "You now possess the complete arsenal: Frontend UI, Supabase DB, Clerk Auth, LLM APIs, AI Agents, and Vercel Hosting. Now you build production products: AI Resume Builder, AI Finance Tracker, AI Content Engine, AI CRM. You are officially unstoppable! 🚀",
          storyAnalogy: "You started as a student learning tools. Now you are a factory owner mass-producing high-value digital assets! 🏭💻",
        },
        {
          id: "vibe-coding-l9-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Factory Blueprint 📐",
          discoveryText: "The 10 Product Building Blocks:\n1. AI Chatbot\n2. AI Notes App\n3. AI Resume Builder\n4. AI Finance Tracker\n5. AI CRM\n6. AI LMS\n7. Portfolio Website\n8. AI Content Generator\n9. AI Image Generator\n10. AI Automation Dashboard.\n\nPattern: Input Form -> API Call -> DB Persistence -> UI Display.",
        },
        {
          id: "vibe-coding-l9-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Micro-SaaS Flow ⚙️",
          miniMission: {
            type: "SCENARIO",
            question: "You are building an AI Resume Builder micro-SaaS. What is the correct fullstack data architecture flow?",
            options: [
              "User Form -> LLM API -> Supabase DB -> PDF Export",
              "Localhost -> CSS -> Image -> Printer",
              "HTML File -> Desktop -> Delete",
              "Notepad -> Email -> Screenshot",
            ],
            correctAnswer: "User Form -> LLM API -> Supabase DB -> PDF Export",
            explanation: "Bingo! This architecture powers hundreds of profitable micro-SaaS products globally.",
          },
        },
        {
          id: "vibe-coding-l9-step5",
          type: "REFLECTION",
          title: "Active Recall & Product Strategy 🚀",
          reflectionQuestion: "Common Mistake: Trying to build a complex social network before mastering single-purpose micro-SaaS tools. Which 2 factory products will you build for your portfolio?",
        },
        {
          id: "vibe-coding-l9-step6",
          type: "REWARD",
          title: "Module 9 Victory! 🎉",
          xpReward: 450,
          neuronReward: 60,
        },
      ];
    case 10:
    default:
      return [
        {
          id: "vibe-coding-l10-step1",
          type: "HOOK",
          title: "Curiosity Hook 💡",
          hookText: "Building software is 50% of the journey. Solving real user problems and launching to the world is where LEGENDS are born! 👑🔥",
        },
        {
          id: "vibe-coding-l10-step2",
          type: "STORY",
          title: "Story Card: The Flagship Capstone Launch 🏆",
          storyText: "You started as a complete beginner. Now, for your Flagship Capstone, you take an original idea, architect it, build it with AI, connect Supabase & Clerk, integrate LLM APIs, deploy live to Vercel, record a demo video, and publish it to the world. You are an AI Software Engineer! 🎓🚀",
          storyAnalogy: "This isn't a final exam. This is your grand opening ceremony as an independent software founder! 🏛️✨",
        },
        {
          id: "vibe-coding-l10-step3",
          type: "DISCOVERY",
          title: "Core Explanation & Launch Blueprint 📋",
          discoveryText: "The Flagship Capstone Deliverables:\n1. Live Production URL (Vercel/Netlify)\n2. GitHub Repository with documentation README\n3. Systems Architecture Diagram\n4. 2-Minute Loom/YouTube Product Demo Video\n5. Screenshots & Personal Reflection Report.",
        },
        {
          id: "vibe-coding-l10-step4",
          type: "MINI_MISSION",
          title: "Mini-Mission: Capstone Requirements 🏆",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match each capstone deliverable with its evaluation purpose:",
            pairs: [
              { left: "Live Production Site", right: "Proves real-world usability and hosting" },
              { left: "GitHub Repository", right: "Proves code quality & commit history" },
              { left: "Architecture Diagram", right: "Proves systems engineering understanding" },
              { left: "Product Demo Video", right: "Demonstrates core user flows in action" },
            ],
            explanation: "Spot on! This complete portfolio proof-of-work bundle makes you stand out to employers and clients.",
          },
        },
        {
          id: "vibe-coding-l10-step5",
          type: "REFLECTION",
          title: "Active Recall & Mindset Transformation 🌟",
          reflectionQuestion: "Reflect on your journey from Module 1 to Module 10: How has your mindset transformed from a passive learner to a confident AI-powered software engineer and product architect?",
        },
        {
          id: "vibe-coding-l10-step6",
          type: "REWARD",
          title: "Flagship Skill Victory! 👑",
          xpReward: 500,
          neuronReward: 100,
        },
      ];
  }
}

    const gamifiedSteps: GamifiedStep[] = seed.id === "vibe-coding"
      ? buildVibeCodingSteps(n, title, brief)
      : [
          {
            id: `${seed.id}-l${n}-step1`,
            type: "HOOK",
            title: "Curiosity Hook",
            hookText: `Bro, today's mission is to master ${title} 😎. Let's turn you into a dangerous practitioner.`,
          },
          {
            id: `${seed.id}-l${n}-step2`,
            type: "STORY",
            title: "Story Card",
            storyText: brief,
            storyAnalogy: `Think of ${seed.title} as building blocks: every mission adds a real-world capability to your skill portfolio.`,
          },
          {
            id: `${seed.id}-l${n}-step3`,
            type: "DISCOVERY",
            title: "The Concept Discovery",
            discoveryText:
              n === 10
                ? "A portfolio-grade capstone project ready to share with employers, clients, or investors."
                : `By executing ${title}, you master the exact framework used by top industry practitioners in 2026.`,
          },
          {
            id: `${seed.id}-l${n}-step4`,
            type: "MINI_MISSION",
            title: "Mini-Mission Activity",
            miniMission: {
              type: "MATCH_PAIRS",
              question: `Match the core concept of ${title} with its real-world outcome:`,
              pairs: [
                { left: title, right: brief.slice(0, 32) + "..." },
                { left: "Deliverable Proof", right: "Reviewable link or file attached" },
              ],
              explanation: "Spot on! Linking objective frameworks to real deliverable proof is key.",
            },
          },
          {
            id: `${seed.id}-l${n}-step5`,
            type: "REFLECTION",
            title: "Active Recall Reflection",
            reflectionQuestion: `In your own words, how will completing "${title}" strengthen your public proof-of-work portfolio?`,
          },
          {
            id: `${seed.id}-l${n}-step6`,
            type: "REWARD",
            title: "Mission Victory!",
            xpReward: n * 50,
            neuronReward: n <= 6 ? 10 + n * 5 : n * 8,
          },
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
      steps: gamifiedSteps,
    };
  });
}

const SKILL_IMAGES: Record<string, string> = {
  "vibe-coding": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  "ai-automation": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "ai-product-management": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "fullstack-web": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "ui-ux-design": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
  "ai-content-creation": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
  "digital-growth": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
  freelancing: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "data-analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  cybersecurity: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  "research-critical-thinking": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  "prompt-engineering": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
};

export const INITIAL_SKILLS: Skill[] = SKILL_SEEDS.map((s) => {
  const missions = buildMissions(s);
  return {
    id: s.id,
    title: s.title,
    category: s.category,
    iconName: s.iconName,
    description: s.description,
    color: s.color,
    thumbnailUrl: SKILL_IMAGES[s.id] ?? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    difficulty: "Beginner",
    estimatedHours: Math.round(missions.reduce((sum, m) => sum + m.estimatedMinutes, 0) / 60),
    transformation: SKILL_TRANSFORMATIONS[s.id],
    missions,
    isPublished: true,
  };
});

export const SKILLS: Skill[] = INITIAL_SKILLS;

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

export function getSkill(skillId: string) {
  return SKILLS.find((s) => s.id === skillId);
}

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "tournament-weekly-1",
    title: "Weekly AI & Tech Grand Tournament",
    category: "Weekly Tournament",
    entryFeeNeurons: 20,
    prizePoolNeurons: 500,
    startTime: new Date().toISOString(),
    durationMins: 10,
    secondsPerQuestion: 15,
    questions: [
      {
        id: "tq1",
        prompt: "What file configures tech stack rules and coding standards for Cursor AI?",
        options: [".cursorrules", "package.json", "styles.css", "tsconfig.json"],
        answerIndex: 0,
      },
      {
        id: "tq2",
        prompt: "Which tool is open-source and allows self-hosted workflow automation?",
        options: ["n8n", "Make.com", "Zapier", "IFTTT"],
        answerIndex: 0,
      },
      {
        id: "tq3",
        prompt: "In Next.js 14 App Router, what directive renders a component on the client?",
        options: ["'use client'", "'use browser'", "'use react'", "'client only'"],
        answerIndex: 0,
      },
    ],
    isActive: true,
    winnersDeclared: false,
  },
];

export const INITIAL_BADGES: BadgeDef[] = [
  {
    id: "first-mission",
    name: "First Ship",
    description: "Got your first project approved",
    iconName: "Flag",
    color: "#3b82f6",
  },
  {
    id: "projects-5",
    name: "Builder",
    description: "5 approved projects",
    iconName: "Hammer",
    color: "#8b5cf6",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day learning streak",
    iconName: "Flame",
    color: "#f97316",
  },
  {
    id: "skill-complete",
    name: "Skill Master",
    description: "Completed all 10 missions of a skill",
    iconName: "GraduationCap",
    color: "#22c55e",
  },
];

export const BADGES: BadgeDef[] = INITIAL_BADGES;

export function badgeDef(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export function seedState(): AppState {
  const now = Date.now();
  const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();

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
    quizzes: INITIAL_QUIZZES,
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

export function getInitialState(): AppState {
  return seedState();
}
