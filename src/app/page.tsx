"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Code2,
  Coins,
  Cpu,
  Eye,
  Flame,
  FolderGit2,
  GraduationCap,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import NeuralVortexBg from "@/components/NeuralVortexBg";

export default function LandingPage() {
  const { skills, isAuthenticated } = useApp();
  const [activeSkillId, setActiveSkillId] = useState(skills[0]?.id || "ai-prompt-engineering");

  const selectedSkill = skills.find((s) => s.id === activeSkillId) || skills[0];

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-[#F5F5F7] antialiased selection:bg-cyan-500/30 selection:text-white overflow-hidden">
      {/* 1. Shader WebGL Neural Vortex Background - FIXED on Landing Page only */}
      <NeuralVortexBg />

      {/* 2. Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-mono text-base font-black text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              S
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
              SKILL EDGE <span className="text-zinc-500">// OS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wide text-zinc-400">
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#curriculum" className="hover:text-white transition-colors">
              Curriculum
            </a>
            <a href="#manifesto" className="hover:text-white transition-colors">
              Manifesto
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary !py-2 !px-4 text-xs font-mono shadow-lg">
                Launch Terminal <Terminal className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost !py-2 !px-3 text-xs font-mono hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary !py-2 !px-4 text-xs font-mono shadow-lg">
                  Access Terminal <Terminal className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 flex flex-col items-center text-center overflow-hidden">
          {/* Subtle Grid Backdrop Overlay */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Overdrive Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-xs font-mono text-cyan-400 tracking-wider uppercase mb-8 shadow-2xl">
            <Zap className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
            SYSTEM OVERDRIVE: FROM LEARNING TO EARNING
          </div>

          {/* Main Title */}
          <div className="relative max-w-5xl z-10 px-4">
            <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] text-white pb-2 drop-shadow-2xl">
              SKILL EDGE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-600">
                LEARNING
              </span>
            </h1>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-light font-mono text-zinc-400 mt-6 tracking-tight flex flex-col sm:flex-row items-center justify-center gap-3">
              The Gamified AI-Powered
              <span className="relative font-medium text-white flex items-center gap-1">
                Future Builder OS
                <Sparkles className="text-cyan-400 w-5 h-5 animate-pulse hidden sm:block" />
              </span>
            </h2>
            <p className="mt-8 text-sm sm:text-base md:text-lg text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
              Replace uninspired, legacy classes with hyper-tactile,{" "}
              <strong className="text-white font-medium">Duolingo-style missions</strong>. Master 12 future-ready
              foundational disciplines, launch verified production portfolios, and secure sovereign leverage before age 18.
            </p>
          </div>

          {/* Progression Level Strip */}
          <div className="z-10 w-full mt-10 max-w-4xl relative hidden md:block">
            <div className="flex justify-center items-center gap-3 font-mono text-[11px] text-zinc-500 font-medium tracking-widest uppercase bg-black/40 backdrop-blur-md py-2.5 px-6 rounded-full border border-white/10 shadow-2xl w-max mx-auto">
              <span className="hover:text-white transition-colors">Starter</span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="hover:text-white transition-colors">Explorer</span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="text-white border border-white/20 px-3 py-1 rounded-md bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] transform scale-105">
                Builder
              </span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="hover:text-white transition-colors">Operator</span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="hover:text-white transition-colors">Pro</span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="hover:text-white transition-colors">Elite</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 z-10 w-full justify-center px-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="group relative px-8 py-4 rounded-xl font-semibold bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:scale-95 select-none"
            >
              <span className="relative z-10 flex items-center gap-2 font-mono text-sm font-bold">
                {isAuthenticated ? "Launch OS Dashboard" : "Launch OS Terminal"}
                <Terminal className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <a
              href="#curriculum"
              className="group px-8 py-4 rounded-xl font-semibold border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-white flex items-center justify-center gap-2 active:scale-95 text-sm font-mono"
            >
              Explore the 12-Skill Stack
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </section>

        {/* SECTION 1: SYSTEM CONFLICT */}
        <section className="py-24 border-t border-white/10 relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> // System Conflict
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                TODAY'S EDUCATION CREATES TEST-TAKERS.
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base">
                The future belongs to builders, yet teenagers are forced through an industrial system optimized for routine
                memory tasks.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="font-mono text-3xl font-bold text-rose-400">15 Years</span>
                  <p className="text-xs font-mono text-zinc-400 mt-1 leading-relaxed">Spent consuming static theory</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-8 flex-1">
                  <span className="font-mono text-3xl font-bold text-emerald-400">0 Years</span>
                  <p className="text-xs font-mono text-zinc-400 mt-1 leading-relaxed">
                    Spent practicing high-leverage tools
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
                <h4 className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  // Missing School Tracks
                </h4>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                  {[
                    "AI Tools",
                    "Entrepreneurship",
                    "Vibe Coding",
                    "Sales & Negotiation",
                    "Freelancing",
                    "Financial Literacy",
                    "Content Creation",
                  ].map((track) => (
                    <span
                      key={track}
                      className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-1.5"
                    >
                      <CircleX className="h-3.5 w-3.5 text-rose-400" /> {track}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROTOCOL SHIFT */}
        <section className="py-16 border-t border-white/10 bg-gradient-to-b from-transparent to-black/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { num: "01", old: "Teaches Information", next: "Teaches Transformation" },
              { num: "02", old: "Sells Static Courses", next: "Sells Verifiable Outcomes" },
              { num: "03", old: "Rewards Pure Watching", next: "Rewards Production Doing" },
            ].map((proto) => (
              <div
                key={proto.num}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md font-mono flex flex-col justify-center transition-all hover:bg-white/[0.06]"
              >
                <span className="text-[10px] font-semibold text-amber-400 block mb-3 uppercase tracking-widest">
                  PROTOCOL {proto.num}
                </span>
                <div className="text-zinc-500 text-xs line-through mb-2">{proto.old}</div>
                <div className="text-white text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="leading-tight">{proto.next}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: MANIFESTO */}
        <section id="manifesto" className="py-24 border-t border-white/10 relative overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs text-purple-400 font-semibold uppercase tracking-widest">
                // Paradigm Shift
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                THE SEL MANIFESTO
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base">
                The current educational system was structured during the Industrial Revolution to create compliant
                operators. We are in the deployment phase of hyper-intelligence. Compounding leverage belongs to those who
                build, distribute, and orchestrate.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col hover:border-amber-400/40 transition-all">
                <Zap className="h-5 w-5 text-amber-400 mb-4" />
                <h4 className="font-mono text-sm font-bold text-white mb-2">Zero Standard Testing</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  We do not grade capabilities via memory retrieval. Your terminal profile velocity and live platform
                  deployment states serve as your verifiable resume.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col hover:border-amber-400/40 transition-all">
                <Eye className="h-5 w-5 text-purple-400 mb-4" />
                <h4 className="font-mono text-sm font-bold text-white mb-2">Sovereign Leverage</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Mastering audience aggregation, digital product economics, and capital management protocols before
                  maturity parameters trigger.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ARCHITECTURE */}
        <section id="architecture" className="py-24 border-t border-white/10 relative px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-7xl mx-auto space-y-3">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-widest">
              // System Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">HOW THE OPERATING SYSTEM WORKS</h2>
            <p className="text-zinc-400 font-light max-w-2xl leading-relaxed text-sm md:text-base">
              We dismantled traditional classroom curricula and completely re-engineered learning into a fast, non-linear
              platform built for real-world execution metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-7xl mx-auto">
            {/* Left: 12-Skill Architecture */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-400">
                    The 12-Skill Architecture
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-6 text-white tracking-tight">
                  Future-Ready Capabilities Blueprint
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="font-mono text-[11px] font-medium text-zinc-300 truncate">{skill.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-zinc-500 text-xs font-mono mt-8 leading-relaxed">
                // Complete daily micro-missions to systematically unlock nodes.
              </p>
            </div>

            {/* Right: 7-Tier Protocol */}
            <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-400">
                    Progression Pipeline
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">7-Tier Evolution Protocol</h3>

                <div className="space-y-2">
                  {[
                    { tier: "Tier 01", name: "Starter", badge: "Base Integration" },
                    { tier: "Tier 02", name: "Explorer", badge: "Active Sandbox" },
                    { tier: "Tier 03", name: "Builder", badge: "MVP Execution" },
                    { tier: "Tier 04", name: "Operator", badge: "Systems Deploy" },
                    { tier: "Tier 05", name: "Pro", badge: "Commercial Capture" },
                    { tier: "Tier 06", name: "Elite", badge: "Sovereign Master" },
                  ].map((t) => (
                    <div
                      key={t.tier}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">{t.tier}</span>
                        <span className="font-bold text-white">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/30">
                        {t.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Non-Linear Liquidity Banner */}
            <div className="lg:col-span-12 p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-xl shadow-xl mt-2 relative overflow-hidden">
              <div className="max-w-3xl relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FolderGit2 className="h-4 w-4 text-pink-400" />
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-400">
                    Verifiable Output Protocol
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                  The Non-Linear Liquidity Shift: From Learning to Earning
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  As students execute missions, they generate a verifiable cryptographic portfolio showing actual running
                  source instances, live product pipelines, distribution analytics, and practical capital mechanics. It's an
                  unforgeable track record that opens immediate pathways into tech, high-leverage freelancing, or modern
                  venture-building before adulthood parameters trigger.
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-mono font-medium">
                  <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-400/30">
                    ✔ No Outdated Resumes
                  </span>
                  <span className="text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-400/30">
                    ✔ Live Code Repositories
                  </span>
                  <span className="text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30">
                    ✔ Liquid Market Inbounds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CURRICULUM DISCOVERY */}
        <section id="curriculum" className="py-24 border-t border-white/10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto mb-12">
            <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              // System Core Curriculum
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 text-white">THE 12 FUTURE BUILDER SKILLS</h2>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left skill selector tabs */}
            <div className="lg:col-span-4 space-y-1.5 max-h-[400px] overflow-y-auto pr-2">
              {skills.map((skill, idx) => (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkillId(skill.id)}
                  className={`w-full text-left p-3 rounded-xl font-mono text-xs font-medium transition-all flex items-center justify-between border ${
                    activeSkillId === skill.id
                      ? "bg-white/10 border-amber-400/60 text-white shadow-lg"
                      : "bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>
                    {idx + 1}. {skill.title}
                  </span>
                  {activeSkillId === skill.id && <Terminal className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              ))}
            </div>

            {/* Right active module spec */}
            <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  // Active Module Specification
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">{selectedSkill.title}</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">{selectedSkill.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs">
                    <div className="text-zinc-500 font-semibold mb-1">PHASE 01</div>
                    <div className="text-white font-bold">Foundations & Anatomy</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs">
                    <div className="text-zinc-500 font-semibold mb-1">PHASE 02</div>
                    <div className="text-white font-bold">Advanced Workflows</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs">
                    <div className="text-zinc-500 font-semibold mb-1">PHASE 03</div>
                    <div className="text-white font-bold">Automations & Agents</div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs">
                    <div className="text-zinc-500 font-semibold mb-1">PHASE 04</div>
                    <div className="text-white font-bold">Commercial MVP Launch</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                  10 Tiers Available
                </span>
                <Link
                  href={isAuthenticated ? `/learn/${selectedSkill.id}` : "/login"}
                  className="btn-primary !py-2 !px-4 text-xs font-mono"
                >
                  Start Track →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: USER JOURNEY LOOP */}
        <section className="py-24 border-t border-white/10 text-center bg-black/40 px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-7xl mx-auto space-y-2">
            <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-widest">
              // Engine Sequence
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">THE USER JOURNEY LOOP</h2>
          </div>

          <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto font-mono text-xs">
            {[
              "Initialize Signup",
              "Configure Goals",
              "Map 12 Skills",
              "Personalized Roadmap",
              "Execute Missions",
              "Accumulate XP",
              "Mint Verifiable Certs",
            ].map((step, index, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-4 py-2.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl shadow-md">
                  {step}
                </div>
                {index < arr.length - 1 && <ChevronRight className="h-4 w-4 text-zinc-500 hidden md:block" />}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: FINAL CALLOUT BANNER */}
        <section className="py-24 border-t border-white/10 text-center relative overflow-hidden px-4">
          <div className="max-w-3xl mx-auto clay-card p-8 sm:p-12 space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl btn-primary font-mono text-3xl font-black shadow-xl shadow-amber-500/20">
              S
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">READY TO ACCESS THE TERMINAL?</h2>
            <p className="text-xs sm:text-base text-zinc-400 font-light max-w-xl mx-auto">
              Join thousands of future builders mastering AI, Vibe Coding, and Entrepreneurship on Skill Edge OS.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="btn-primary py-4 px-8 text-sm font-mono font-bold shadow-xl"
              >
                {isAuthenticated ? "Launch OS Dashboard" : "Enter Terminal Room"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
