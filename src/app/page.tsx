"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  Cpu,
  Crown,
  Figma,
  Flame,
  Github,
  Globe,
  GraduationCap,
  Hammer,
  HardDrive,
  Hexagon,
  Layers,
  Link2,
  Lock,
  MessageCircle,
  Play,
  QrCode,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UploadCloud,
  UserCheck,
  Users2,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { UserGuideModal } from "@/components/UserGuideModal";
import { SKILLS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { PLANS, cn, fmtInr, fmtNum } from "@/lib/utils";

const TOTAL_MISSIONS = SKILLS.reduce((n, s) => n + s.missions.length, 0);
const TOTAL_HOURS = SKILLS.reduce((n, s) => n + s.estimatedHours, 0);

const WHATSAPP_NUMBER = "919342366833";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Skill%20Edge%20Learning%2C%20I%20want%20to%20know%20more%20about%20the%20learning%20OS!`;

/* ------------------------------ 5-Step Learning Loop Guide ------------------------------ */

const GUIDE_STEPS = [
  {
    step: "01",
    title: "Choose Your Transformation",
    desc: "Don't just pick a subject. Choose what you want to become (AI Software Engineer, Startup Founder, Brand Designer).",
    icon: Target,
    color: "#E85002",
  },
  {
    step: "02",
    title: "Duolingo Mission Path",
    desc: "Follow a visual snake roadmap of 10 practical missions per skill. Each node unlocks sequentially as you ship.",
    icon: Play,
    color: "#F16001",
  },
  {
    step: "03",
    title: "Ship Real Deliverables",
    desc: "No multiple choice traps. Attach GitHub repos, Figma prototypes, Canva decks, Google Drive files, or live URLs.",
    icon: UploadCloud,
    color: "#8B5CF6",
  },
  {
    step: "04",
    title: "ARIA AI & Admin Review",
    desc: "Get instant ARIA AI pre-flight feedback followed by expert admin evaluation with detailed notes and scores.",
    icon: Cpu,
    color: "#06B6D4",
  },
  {
    step: "05",
    title: "Verified Certs & Portfolio",
    desc: "Approved projects auto-populate your public portfolio. Earn QR-verified certificates & one-click LinkedIn credentials.",
    icon: Award,
    color: "#22C55E",
  },
];

/* ------------------------------ Skill Transformations ------------------------------ */

const SKILL_OUTCOMES = [
  {
    title: "AI Vibe Coding",
    become: "AI Software Engineer",
    builds: ["Full-stack Next.js Apps", "SaaS Products", "AI Agents", "Automations"],
    icon: "code",
    color: "#E85002",
  },
  {
    title: "AI Tools Mastery",
    become: "AI Productivity Specialist",
    builds: ["Custom GPTs", "Automated Workflows", "AI Content Engines", "Prompt Pipelines"],
    icon: "brain-circuit",
    color: "#06B6D4",
  },
  {
    title: "Product Building & Distribution",
    become: "Product Builder & Growth Lead",
    builds: ["Live MVPs", "Waitlist Engines", "Distribution Channels", "Product Analytics"],
    icon: "rocket",
    color: "#8B5CF6",
  },
  {
    title: "Entrepreneurship",
    become: "Startup Founder",
    builds: ["Validated Business Models", "Pitch Decks", "Customer Portfolios", "Financial Models"],
    icon: "lightbulb",
    color: "#FACC15",
  },
  {
    title: "Communication & Influence",
    become: "Persuasive Communicator",
    builds: ["Executive Decks", "Keynote Presentations", "Deal Frameworks", "Public Speeches"],
    icon: "message-square",
    color: "#EC4899",
  },
  {
    title: "Graphic Design Mastery",
    become: "Brand & UI Designer",
    builds: ["Visual Brand Systems", "Figma UI Components", "Marketing Assets", "Design Kits"],
    icon: "palette",
    color: "#3B82F6",
  },
];

/* ------------------------------ FAQ Items ------------------------------ */

const FAQ_ITEMS = [
  {
    q: "How is Skill Edge Learning different from traditional course sites?",
    a: "Traditional course sites measure completion by video watch time. Skill Edge Learning is a Skill Operating System — you master skills by executing 10 practical missions per skill. Every approved mission becomes a real item in your public portfolio and earns QR-verified certificates.",
  },
  {
    q: "How does the Duolingo Mission Roadmap work?",
    a: "Missions unlock sequentially like a visual game path. Green checkmark nodes show completed projects, pulsing orange nodes show your current mission, and milestone treasure chests award bonus Neurons & XP.",
  },
  {
    q: "What is ARIA Neural Intelligence?",
    a: "ARIA is our native AI intelligence system that performs instant pre-flight checks on your mission submissions (verifying link health, deliverable completeness, writeup depth) and powers automated certificate verification.",
  },
  {
    q: "How does the Family Plan work for parents and siblings?",
    a: "The Family Plan (₹9,999/yr) allows 1 parent subscription to manage up to 5 sibling profiles. Each child gets their own individual profile, progress map, XP leaderboard, portfolio, and QR-verified certificates.",
  },
  {
    q: "Can I add my certificates to LinkedIn?",
    a: "Yes! Every certificate (Phase Level 5 & Skill Completion Level 10) features a one-click 'Add to LinkedIn Profile' button that pre-fills LinkedIn's official Credentialing portal with your certificate ID and public verification link.",
  },
];

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

import { BrandMark } from "@/components/BrandMark";

export default function LandingPage() {
  const { hydrated, isAuthenticated } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [guideOpen, setGuideOpen] = useState(false);

  const primaryHref = isAuthenticated ? "/dashboard" : "/register";

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-base text-white bg-grid-pattern">
      {/* ---------- Ambient Glowing Spotlights ---------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/20 blur-[150px]" />
        <div className="absolute left-10 top-96 h-[400px] w-[400px] rounded-full bg-brand-deep/15 blur-[140px]" />
        <div className="absolute right-10 top-[1200px] h-[450px] w-[450px] rounded-full bg-brand-bright/15 blur-[140px]" />
      </div>

      {/* ---------- Sticky Glass Navbar ---------- */}
      <header className="sticky top-0 z-50 border-b border-line/60 bg-base/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-6 text-xs font-semibold text-zinc-300 md:flex">
            <a href="#hero" className="transition hover:text-brand">
              Overview
            </a>
            <a href="#guide" className="transition hover:text-brand">
              How It Works
            </a>
            <a href="#transformations" className="transition hover:text-brand">
              Transformations
            </a>
            <a href="#roadmap" className="transition hover:text-brand">
              Duolingo Roadmap
            </a>
            <a href="#certificates" className="transition hover:text-brand">
              Certificates
            </a>
            <a href="#pricing" className="transition hover:text-brand">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-brand">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost hidden gap-1.5 border-emerald-500/40 text-xs text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 sm:inline-flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: 9342366833
            </a>

            {!hydrated ? (
              <div className="skeleton h-9 w-24" />
            ) : isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary px-4 py-2 text-xs font-bold sm:text-sm">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost hidden px-4 py-2 text-xs sm:inline-flex sm:text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 space-y-24 pb-20">
        {/* ============================================================
            1. HERO SECTION & STATS BAR
            ============================================================ */}
        <section id="hero" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              POWERED BY ARIA NEURAL INTELLIGENCE
            </div>

            {/* Display Headline */}
            <h1 className="mt-6 max-w-5xl font-display text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Don&apos;t Just Watch Courses.{" "}
              <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-sand bg-clip-text text-transparent">
                Ship Real Products
              </span>{" "}
              & Master 12 High-Income Skills.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Not a traditional course site. Skill Edge Learning is a practical skill operating system. Complete 10
              real-world missions per skill, build your public proof-of-work portfolio, earn QR-verified certificates,
              and level up.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href={primaryHref} className="btn-primary px-8 py-3.5 text-sm font-bold sm:text-base">
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setGuideOpen(true)}
                className="btn-ghost border-brand/40 bg-brand/10 text-brand px-7 py-3.5 text-sm font-bold sm:text-base"
              >
                Platform User Guide
              </button>
              <a href="#guide" className="btn-ghost px-7 py-3.5 text-sm font-bold text-zinc-300 sm:text-base">
                How It Works Guide
              </a>
            </div>

            {/* Stats Grid Bar */}
            <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-line bg-card/80 p-5 backdrop-blur-md sm:grid-cols-4">
              <div className="text-center space-y-1">
                <div className="font-display text-2xl font-black text-white sm:text-3xl">12</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">High-Income Skills</div>
              </div>
              <div className="text-center space-y-1 border-l border-line/60">
                <div className="font-display text-2xl font-black text-brand sm:text-3xl">{TOTAL_MISSIONS}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Practical Missions</div>
              </div>
              <div className="text-center space-y-1 border-l border-line/60">
                <div className="font-display text-2xl font-black text-white sm:text-3xl">100%</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Portfolio Proof</div>
              </div>
              <div className="text-center space-y-1 border-l border-line/60">
                <div className="font-display text-2xl font-black text-brand sm:text-3xl">ARIA</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Verified Certs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. USER GUIDE: THE 5-STEP LEARNING LOOP
            ============================================================ */}
        <section id="guide" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Student Guide</div>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              How You Master Skills on Skill Edge Learning
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              A systematic 5-step loop designed to transform you from a beginner into a proof-backed practitioner.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {GUIDE_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08} className="h-full">
                <div className="clay-card relative flex h-full flex-col justify-between p-5 space-y-4 border-line/80">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl font-bold"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-black text-zinc-500">STEP {step.step}</span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{step.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-line/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                      {i === 4 ? "Goal Achieved!" : `Proceed to Step 0${i + 2}`}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. SKILL TRANSFORMATIONS SHOWCASE
            ============================================================ */}
        <section id="transformations" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Defined Outcomes</div>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              What Will You Become After Completing a Skill?
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Every skill on Skill Edge Learning has a clearly defined transformation, build capabilities, and career outcome.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_OUTCOMES.map((out, i) => (
              <Reveal key={out.title} delay={i * 0.08}>
                <div className="clay-card relative flex h-full flex-col justify-between p-6 space-y-4 border-brand/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand">Transformation</span>
                    <span className="chip border-brand/40 bg-brand/10 text-[10px] font-bold text-brand">10 Missions</span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-black text-white">{out.title}</h3>
                    <div className="mt-1 text-sm font-bold text-brand">Become: {out.become}</div>

                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">What You&apos;ll Build:</div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-zinc-300">
                        {out.builds.map((b) => (
                          <div key={b} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line/60 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Real-world Project Proof</span>
                    <Link href="/skills" className="text-xs font-bold text-brand hover:underline">
                      Explore Track →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================================================
            4. INTERACTIVE DUOLINGO ROADMAP DEMO
            ============================================================ */}
        <section id="roadmap" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand/40 bg-surface/90 p-6 sm:p-10 backdrop-blur-xl">
            <Reveal className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand">
                <Play className="h-3.5 w-3.5 fill-brand" /> DUOLINGO-STYLE MISSION MAP
              </div>
              <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl">
                Sequential Node Unlock System
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Missions unlock in order — get your work approved to advance down the roadmap.
              </p>
            </Reveal>

            {/* Visual Node Path Mockup */}
            <div className="mt-10 mx-auto max-w-md flex flex-col items-center gap-6 py-4">
              <div className="flex items-center gap-4 w-full rounded-2xl border border-success/40 bg-success/10 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-white font-bold">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-success uppercase">Mission 01 · Completed</div>
                  <div className="text-sm font-bold text-white">Foundations & Setup</div>
                  <div className="text-[11px] text-zinc-400">+100 XP · +25 Neurons Earned</div>
                </div>
              </div>

              <div className="h-8 w-1 bg-gradient-to-b from-success via-brand to-line" />

              <div className="flex items-center gap-4 w-full rounded-2xl border border-brand bg-brand/15 p-4 shadow-[0_0_24px_rgba(232,80,2,0.4)] animate-pulse">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold">
                  <Play className="h-6 w-6 fill-white ml-0.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand uppercase">Mission 02 · Current Mission</div>
                  <div className="text-sm font-bold text-white">First Deliverable Build</div>
                  <div className="text-[11px] text-zinc-300">Ready to execute & submit</div>
                </div>
              </div>

              <div className="h-8 w-1 bg-line" />

              <div className="flex items-center gap-4 w-full rounded-2xl border border-line bg-card/60 p-4 opacity-60">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-zinc-500">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase">Mission 03 · Locked</div>
                  <div className="text-sm font-bold text-zinc-400">Advanced Integration</div>
                  <div className="text-[11px] text-zinc-500">Unlocks upon Mission 02 approval</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. ARIA CERTIFICATES & LINKEDIN INTEGRATION
            ============================================================ */}
        <section id="certificates" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Verifiable Credentials</div>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              ARIA-Powered Public Certificates & Badges
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Every phase (Mission 5) and skill completion (Mission 10) auto-issues a public certificate with unique QR code verification.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="clay-card p-6 space-y-4 border-brand/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">QR Code Verification</div>
                  <div className="text-xs text-zinc-400">Public verify URL (/verify/[code])</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recruiters and clients can scan your certificate QR code to view your verified deliverables and approval score.
              </p>
            </div>

            <div className="clay-card p-6 space-y-4 border-brand/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">One-Click LinkedIn Export</div>
                  <div className="text-xs text-zinc-400">Pre-filled LinkedIn licenses form</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add your certificates directly to your LinkedIn Licenses & Certifications profile with one click.
              </p>
            </div>

            <div className="clay-card p-6 space-y-4 border-brand/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium/20 text-premium">
                  <Hexagon className="h-5 w-5 text-premium" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Hexagon & Shield Badges</div>
                  <div className="text-xs text-zinc-400">Digital achievement badges</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlock digital badges for Explorer, Builder, Operator, Pro, Elite, Legend, and Ambassador tiers.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. PRICING PLANS (INCLUDING FAMILY PLAN)
            ============================================================ */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Pricing Plans</div>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              Transparent Plans for Students & Families
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Start free. Upgrade to Pro for complete mission tracks, or get the Family Plan for all your siblings.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.08} className="h-full">
                <div
                  className={cn(
                    "clay-card relative flex h-full flex-col justify-between p-6 space-y-5",
                    plan.highlight && "border-brand border-2 shadow-[0_0_30px_rgba(232,80,2,0.3)]"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-1 text-xs text-zinc-400">{plan.tagline}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-3xl font-black text-white">{fmtInr(plan.priceInr)}</span>
                      <span className="text-xs text-zinc-400">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 border-t border-line/60 pt-4 text-xs text-zinc-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-brand" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link
                      href={primaryHref}
                      className={cn(
                        "w-full py-2.5 text-xs font-bold",
                        plan.highlight ? "btn-primary" : "btn-ghost"
                      )}
                    >
                      {plan.priceInr === 0 ? "Start Free" : `Get ${plan.name}`}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================================================
            MANIFESTO SECTION (Duolingo × Notion × Linear × Apple)
            ============================================================ */}
        <section id="manifesto" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/15 via-card to-base p-8 sm:p-14 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand">
              <Globe className="h-4 w-4" /> THE SKILL EDGE MANIFESTO
            </div>

            <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
              We&apos;re Building the Learning OS We{" "}
              <span className="bg-gradient-to-r from-brand via-brand-bright to-amber-400 bg-clip-text text-transparent">
                Wish We Had.
              </span>
            </h2>

            <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Traditional EdTech failed because it treats learning like watching television. You don&apos;t master a skill by passively watching a 40-hour video playlist. You master a skill by <strong>executing, shipping real projects, and receiving feedback</strong>.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-line/60">
              <div className="space-y-2">
                <div className="text-sm font-bold text-white">🎮 Duolingo Gamification</div>
                <p className="text-xs text-zinc-400">2-5 minute micro-missions, XP rewards, streak fire, and node roadmaps.</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-white">⚡ Notion × Linear Clarity</div>
                <p className="text-xs text-zinc-400">Minimalist distraction-free UI designed for focused execution.</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-white">🍎 Apple-Grade Aesthetics</div>
                <p className="text-xs text-zinc-400">Curated dark mode theme, fluid animations, and QR-verified credentials.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. COMPREHENSIVE FAQ SECTION
            ============================================================ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 sm:px-6">
          <Reveal className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Student & Parent Guide</div>
            <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-card/70 p-4 transition hover:border-brand/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-white"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform", isOpen && "rotate-180 text-brand")} />
                  </button>
                  {isOpen && <p className="mt-3 text-xs leading-relaxed text-zinc-300 pt-2 border-t border-line/40">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            8. FINAL CTA & FOOTER
            ============================================================ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/20 via-card to-base p-10 text-center sm:p-14 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand via-brand-bright to-brand-deep shadow-brand">
              <Hexagon className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="mt-6 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Your Public Portfolio Starts With Mission One.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300">
              Pick your first skill, ship a real project, and let every approved mission compound into proof.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={primaryHref} className="btn-primary px-8 py-3 text-sm font-bold">
                {isAuthenticated ? "Go to Dashboard" : "Create Your Free Account"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm text-emerald-400 hover:text-emerald-300"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                WhatsApp Helpline (+91 9342366833)
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Widget */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 transition hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line/60 bg-surface/80 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <BrandMark />
            <div className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Skill Edge Learning v2. Powered by ARIA Neural Intelligence.
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
              <Link href="/skills" className="hover:text-brand">
                Skills Catalog
              </Link>
              <Link href="/pricing" className="hover:text-brand">
                Pricing
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {guideOpen && <UserGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
