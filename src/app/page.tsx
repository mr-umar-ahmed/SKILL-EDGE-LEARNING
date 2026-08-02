"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock3,
  Compass,
  Flame,
  Globe,
  Hammer,
  Hexagon,
  Layers,
  MessageCircle,
  QrCode,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  UploadCloud,
  Users2,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { SKILLS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { PLANS, cn, fmtInr, fmtNum } from "@/lib/utils";
import type { PlanDef } from "@/lib/utils";

/* ------------------------------ derived stats ------------------------------ */

const TOTAL_MISSIONS = SKILLS.reduce((n, s) => n + s.missions.length, 0);
const TOTAL_HOURS = SKILLS.reduce((n, s) => n + s.estimatedHours, 0);
const CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category)));

const WHATSAPP_NUMBER = "919342366833";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Skill%20Edge%20Learning%2C%20I%20want%20to%20know%20more%20about%20the%20learning%20OS!`;

const DIFF_COLORS: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#facc15",
  Advanced: "#f97316",
  Expert: "#ef4444",
};

/* ------------------------------ static content ------------------------------ */

const LOOP_STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "Curated videos, guides and templates — just enough theory to start acting.",
    color: "#3b82f6",
  },
  {
    icon: Hammer,
    title: "Do the assignment",
    text: "Every mission has a real brief with deliverables and an execution checklist.",
    color: "#06b6d4",
  },
  {
    icon: UploadCloud,
    title: "Submit your work",
    text: "Ship it as links, files or a write-up — GitHub, Figma, Drive, whatever fits.",
    color: "#8b5cf6",
  },
  {
    icon: ClipboardCheckHelper,
    title: "Get reviewed",
    text: "A human reviews every submission with feedback, a score and a verdict.",
    color: "#facc15",
  },
  {
    icon: Briefcase,
    title: "Portfolio grows",
    text: "Approved work lands in your portfolio — plus XP, Neurons and badges.",
    color: "#22c55e",
  },
];

function ClipboardCheckHelper(props: { className?: string }) {
  return <CheckCircle2 {...props} />;
}

const OUTCOME_CARDS: { skillId: string; outcomes: string[] }[] = [
  {
    skillId: "entrepreneurship",
    outcomes: [
      "5 real customer interviews, logged",
      "A validated problem and lean canvas",
      "A landing page with a live waitlist",
      "A pitch deck and a shipped MVP",
    ],
  },
  {
    skillId: "vibe-coding",
    outcomes: [
      "A Next.js app deployed on Vercel",
      "Reusable components with real state",
      "API-driven pages with loading states",
      "5 seeded bugs fixed with AI pairing",
    ],
  },
  {
    skillId: "content-creation",
    outcomes: [
      "3 published threads and 5 posts",
      "A 30-day multi-platform calendar",
      "A lead magnet with email capture",
      "Your documented content flywheel",
    ],
  },
];

function periodLabel(p: PlanDef) {
  switch (p.period) {
    case "forever":
      return "forever";
    case "month":
      return "/ month";
    case "year":
      return "/ year";
    case "lifetime":
      return "one-time";
  }
}

/* ------------------------------ tiny helpers ------------------------------ */

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand via-brand-deep to-orange-500 shadow-brand">
        <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-sm font-bold tracking-tight text-white">SKILL EDGE</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-amber-500">LEARNING</span>
      </span>
    </span>
  );
}

/* --------------------------------- page --------------------------------- */

export default function LandingPage() {
  const { hydrated, isAuthenticated } = useApp();

  const primaryHref = isAuthenticated ? "/dashboard" : "/register";
  const skillHref = (skillId: string) => (isAuthenticated ? `/learn/${skillId}` : "/register");

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-base text-white">
      {/* ---------- ambient background ---------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-64 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -right-40 top-32 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div
          className="absolute inset-x-0 top-0 h-[800px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      {/* ---------- sticky glass navbar ---------- */}
      <header className="sticky top-0 z-50 border-b border-line/60 bg-base/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Skill Edge Learning home">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-semibold text-zinc-400 md:flex">
            <a href="#hero" className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              Home
            </a>
            <a href="#skills" className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              Skills
            </a>
            <a href="#manifesto" className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              Manifesto
            </a>
            <a href="#ambassador" className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              Ambassador
            </a>
            <a href="#about" className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              About
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-emerald-400 transition hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost hidden gap-1.5 border-emerald-500/30 text-xs text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 sm:inline-flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: 9342366833
            </a>

            {!hydrated ? (
              <>
                <div className="skeleton hidden h-9 w-20 sm:block" />
                <div className="skeleton h-9 w-28" />
              </>
            ) : isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost hidden px-4 py-2 text-xs sm:inline-flex sm:text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ============================================================
            HERO SECTION (Image 1 reference design)
            ============================================================ */}
        <section id="hero" className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-400 animate-fade-up">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              BUILT BY STUDENTS, FOR STUDENTS
            </div>

            {/* Main Headline */}
            <h1
              className="mt-8 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.08s" }}
            >
              The{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                future of learning
              </span>{" "}
              starts with you.
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 animate-fade-up sm:text-lg"
              style={{ animationDelay: "0.16s" }}
            >
              Skill Edge Learning is a student-led learning OS that complements formal education with practical,
              future-ready skills — built by students, for the world you&apos;ll graduate into.
            </p>

            {/* Hero CTAs */}
            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-4 animate-fade-up"
              style={{ animationDelay: "0.24s" }}
            >
              <Link
                href={primaryHref}
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-orange-500/40 sm:text-base"
              >
                Join the Movement
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#manifesto"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-zinc-500 hover:bg-zinc-800 sm:text-base"
              >
                Read the Manifesto
              </a>
            </div>

            {/* Hero Floating Cards (Left & Right showcase) */}
            <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
              <div className="clay-card flex items-center justify-between gap-3 p-4 text-left border-orange-500/30 bg-orange-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">SKILL 01</span>
                    <h4 className="font-display text-sm font-bold text-white">AI Tools Mastery</h4>
                    <span className="text-[11px] text-zinc-400">6 weeks • Foundational</span>
                  </div>
                </div>
                <span className="chip border-amber-500/40 bg-amber-500/10 text-[10px] font-semibold text-amber-400">
                  Coming Soon
                </span>
              </div>

              <div className="clay-card flex items-center justify-between gap-3 p-4 text-left border-rose-500/30 bg-rose-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">SKILL 10</span>
                    <h4 className="font-display text-sm font-bold text-white">Content & Branding</h4>
                    <span className="text-[11px] text-zinc-400">Build an audience that builds you.</span>
                  </div>
                </div>
                <span className="chip border-emerald-500/40 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400">
                  Live
                </span>
              </div>
            </div>

            {/* Bottom tags strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
              <span className="chip border-zinc-700 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-300">
                12 Future Skills
              </span>
              <span className="chip border-zinc-700 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-300">
                Built in India 🇮🇳
              </span>
              <span className="chip border-zinc-700 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-300">
                Student-Led
              </span>
              <span className="chip border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs text-amber-300">
                Free Forever at Launch
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================
            MANIFESTO SECTION (Image 2 reference design)
            ============================================================ */}
        <section id="manifesto" className="scroll-mt-20 border-y border-line/60 bg-zinc-950/70 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                THE MANIFESTO
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                We exist to{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  redefine
                </span>{" "}
                what learning can be.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
                Not another EdTech platform. A movement — built by students, for students, to complement formal
                education with the skills the future actually rewards.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-12 flex justify-center">
              <div className="flex flex-col items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                <span>SCROLL TO EXPLORE</span>
                <span className="h-6 w-0.5 rounded-full bg-amber-500 animate-bounce" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================
            SKILLS & FLAGSHIP TRANSFORMATION (Image 3 reference design)
            ============================================================ */}
        <section id="skills" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-orange-400 uppercase">
              <Flame className="h-3.5 w-3.5" />
              THE CATALOG
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Skills the market actually pays for
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Every track is 10 missions deep — from first principles to a portfolio-grade capstone.
            </p>
          </Reveal>

          {/* Flagship Transformation Banner (Image 3 Top Card) */}
          <Reveal delay={0.1} className="mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-r from-orange-950/40 via-card to-zinc-900/80 p-6 sm:p-10 shadow-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-3xl shadow-lg shadow-orange-500/30">
                    🤖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                        FLAGSHIP TRANSFORMATION
                      </span>
                      <span className="chip border-emerald-500/40 bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                        LIVE
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">AI Mastery</h3>
                    <p className="mt-1.5 text-sm text-zinc-300">
                      Transform from an AI Beginner into an AI-Native Creator.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-zinc-400">
                      <span>7 Worlds</span>
                      <span>•</span>
                      <span>35 Missions</span>
                      <span>•</span>
                      <span className="text-amber-400">4,200 XP</span>
                      <span>•</span>
                      <span>12-16 weeks</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={skillHref("ai-prompt-engineering")}
                  className="btn-primary shrink-0 self-start px-6 py-3.5 text-sm font-bold shadow-lg shadow-orange-500/20 lg:self-center"
                >
                  Start AI Mastery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Skills Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Live Flagship item 1 */}
            <Reveal delay={0.15}>
              <div className="clay-card flex h-full flex-col justify-between p-6 border-emerald-500/30">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">
                      🧠
                    </div>
                    <span className="chip border-emerald-500/40 bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                      • Live
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-white">AI Mastery Transformation</h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    Transform from beginner to AI-native creator. The flagship transformation with 7 worlds, 35
                    missions, and 7 real-world projects.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                  <div className="flex gap-2 text-[10px] font-semibold text-zinc-400">
                    <span className="chip text-[10px]">Foundational</span>
                    <span>12-16 wks</span>
                  </div>
                  <Link href={skillHref("ai-prompt-engineering")} className="text-xs font-bold text-brand hover:underline">
                    Start Transformation →
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Skill item 2 */}
            <Reveal delay={0.2}>
              <div className="clay-card flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl">
                      🧠
                    </div>
                    <span className="chip border-zinc-700 bg-zinc-800/60 text-[10px] font-medium text-zinc-400">
                      🔒 Coming Soon
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-white">AI Tools Mastery</h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    Work at the speed of thought. Master ChatGPT, Claude, Midjourney, and the AI stack that&apos;s reshaping
                    every industry.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                  <div className="flex gap-2 text-[10px] font-semibold text-zinc-400">
                    <span className="chip text-[10px]">Foundational</span>
                    <span>6 weeks</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">Explore Skill →</span>
                </div>
              </div>
            </Reveal>

            {/* Skill item 3 */}
            <Reveal delay={0.25}>
              <div className="clay-card flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-2xl">
                      &lt;/&gt;
                    </div>
                    <span className="chip border-zinc-700 bg-zinc-800/60 text-[10px] font-medium text-zinc-400">
                      🔒 Coming Soon
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-white">Vibe Coding</h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    Build apps without fear of code. Code by intent. Use AI assistants, modern frameworks, and no-code
                    tools to ship real products fast.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                  <div className="flex gap-2 text-[10px] font-semibold text-zinc-400">
                    <span className="chip text-[10px]">Intermediate</span>
                    <span>8 weeks</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">Explore Skill →</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 text-center">
            <Link href={isAuthenticated ? "/skills" : "/register"} className="btn-ghost px-7 py-3 text-sm">
              View All {SKILLS.length} Skills Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>

        {/* ============================================================
            AMBASSADOR PROGRAM (Image 4 reference design)
            ============================================================ */}
        <section id="ambassador" className="scroll-mt-20 border-t border-line/60 bg-zinc-950/80 py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase">
                <Users2 className="h-3.5 w-3.5" />
                AMBASSADOR PROGRAM
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                Become a{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  Founding Member
                </span>{" "}
                of Skill Edge Learning
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
                Help grow the community and shape the future of the platform. Be there from day one — and leave your
                mark on how a generation of students learns.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-5 py-2.5 text-xs text-zinc-400">
                <Clock3 className="h-4 w-4 text-amber-400" />
                Detailed program information will be announced officially during launch
              </div>
            </Reveal>

            {/* Direct WhatsApp connection CTA */}
            <Reveal delay={0.4} className="mt-10">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                Connect with Founders on WhatsApp (+91 9342366833)
              </a>
            </Reveal>
          </div>
        </section>

        {/* ============================================================
            ABOUT US SECTION (Image 5 reference design)
            ============================================================ */}
        <section id="about" className="scroll-mt-20 border-t border-line/60 bg-base py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
                <Globe className="h-3.5 w-3.5" />
                ABOUT US
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                We&apos;re building the learning OS we{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  wish we had.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
                Skill Edge Learning exists to bridge the gap between what school teaches and what the world now
                rewards — built by students, for students, in India, for the world.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- how it works loop ---------- */}
        <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 border-t border-line/60">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">The mission loop</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One loop. Repeated until you&apos;re dangerous.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              No passive completion bars. A mission only counts when your work is submitted, reviewed and approved.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LOOP_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07} className="h-full">
                <div className="clay-card relative flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${step.color}1f`, color: step.color }}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-600">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- pricing preview ---------- */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 border-t border-line/60">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-premium">Pricing</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start free. Upgrade when you&apos;re hooked.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              The first 4 missions of every skill are free, forever. Pro unlocks the full depth of every track.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.06} className="h-full">
                <div
                  className={cn(
                    "clay-card relative flex h-full flex-col gap-4 p-6",
                    plan.highlight && "border-brand/60 ring-1 ring-brand/40"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
                      Most popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{plan.name}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{plan.tagline}</p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-bold text-white">{fmtInr(plan.priceInr)}</span>
                    <span className="text-xs text-zinc-500">{periodLabel(plan)}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 h-3.5 w-3.5 shrink-0",
                            plan.id === "FOUNDER_LIFETIME" ? "text-premium" : "text-success"
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/pricing"
                      className={cn(
                        "w-full py-2.5 text-xs",
                        plan.id === "FOUNDER_LIFETIME" ? "btn-premium" : plan.highlight ? "btn-primary" : "btn-ghost"
                      )}
                    >
                      {plan.priceInr === 0 ? "Start free" : `Get ${plan.name}`}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- final CTA ---------- */}
        <section className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-950/30 via-card to-zinc-900/80 p-10 text-center sm:p-14">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[100px]"
                aria-hidden
              />
              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                  <Hexagon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Your portfolio starts with mission one.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
                  Pick a skill, ship your first project this week, and let every approved mission compound into proof.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href={primaryHref} className="btn-primary px-8 py-3 text-sm sm:text-base">
                    {isAuthenticated ? "Open Dashboard" : "Create your free account"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm text-emerald-400 sm:text-base hover:text-emerald-300"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                    Chat on WhatsApp (9342366833)
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ---------- Floating WhatsApp Widget ---------- */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 transition-all hover:scale-110 hover:bg-emerald-400"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* ---------- footer ---------- */}
      <footer className="relative z-10 border-t border-line/60 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <BrandMark />
              <p className="mt-4 max-w-sm text-sm text-zinc-400">
                The Skill Operating System. Learn by executing real missions, get human feedback, and graduate with a
                portfolio and verifiable certificates — built by students, for students.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <MessageCircle className="h-4 w-4" />
                <span>Support & WhatsApp: +91 9342366833</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Navigation</div>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>
                  <a href="#hero" className="transition hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#skills" className="transition hover:text-white">
                    Skills Catalog
                  </a>
                </li>
                <li>
                  <a href="#manifesto" className="transition hover:text-white">
                    The Manifesto
                  </a>
                </li>
                <li>
                  <a href="#ambassador" className="transition hover:text-white">
                    Ambassador Program
                  </a>
                </li>
                <li>
                  <a href="#about" className="transition hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Account & Community</div>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>
                  <Link href="/login" className="transition hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition hover:text-white">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    WhatsApp Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-6 text-xs text-zinc-500 sm:flex-row">
            <span>© {new Date().getFullYear()} Skill Edge Learning. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5">
              <Hexagon className="h-3.5 w-3.5 text-amber-400" />
              Earn Neurons. Ship missions. Build proof.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
