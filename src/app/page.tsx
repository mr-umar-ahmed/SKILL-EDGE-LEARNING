"use client";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Code2,
  Coins,
  Cpu,
  Flame,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/store";
import NeuralVortexBg from "@/components/NeuralVortexBg";

export default function LandingPage() {
  const { skills, isAuthenticated } = useApp();

  const WHATSAPP_NUMBER = "919342366833";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Skill%20Edge%20Learning%2C%20I%20want%20to%20know%20more%20about%20the%20platform!`;

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-[#F5F5F7] antialiased selection:bg-orange-500/30 selection:text-white overflow-x-hidden">
      {/* 1. WebGL NeuralVortex Shader Background */}
      <NeuralVortexBg />

      {/* 2. Top Header Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Lightbulb className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase leading-none">
                SKILL EDGE
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase leading-tight">
                LEARNING OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-wide text-zinc-400">
            <a href="#home" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#manifesto" className="hover:text-white transition-colors">
              Manifesto
            </a>
            <a href="#ambassador" className="hover:text-white transition-colors">
              Ambassador
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Let&apos;s Talk</span>
            </a>

            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary !py-2 !px-4 text-xs font-mono shadow-lg">
                Terminal <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link href="/login" className="btn-primary !py-2 !px-4 text-xs font-mono shadow-lg">
                Launch App <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Hero & Sections */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col items-center text-center">
          {/* Hero Subtitle Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-xl text-xs font-mono text-orange-400 tracking-wider uppercase mb-8 shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
            ✨ BUILT BY STUDENTS, FOR STUDENTS
          </div>

          {/* Floating Skill Pill Left (Desktop) */}
          <div className="hidden lg:flex absolute top-40 left-4 z-20 neo-box p-3 border border-orange-500/30 text-left max-w-xs rounded-2xl bg-black/60 backdrop-blur-xl animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs font-bold border border-orange-500/40">
                🧠
              </div>
              <div>
                <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-bold">SKILL 01</div>
                <div className="text-xs font-bold text-white">AI Tools Mastery</div>
                <div className="text-[10px] text-zinc-400 font-mono">6 weeks • Foundational</div>
              </div>
            </div>
          </div>

          {/* Floating Skill Pill Right (Desktop) */}
          <div className="hidden lg:flex absolute top-44 right-4 z-20 neo-box p-3 border border-rose-500/30 text-left max-w-xs rounded-2xl bg-black/60 backdrop-blur-xl animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold border border-rose-500/40">
                🎨
              </div>
              <div>
                <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold">SKILL 10</div>
                <div className="text-xs font-bold text-white">Content & Branding</div>
                <div className="text-[10px] text-zinc-400 font-mono">Build an audience that builds you.</div>
              </div>
            </div>
          </div>

          {/* Hero Main Headline */}
          <div className="relative max-w-4xl z-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400">
                future
              </span>{" "}
              of learning starts with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                you.
              </span>
            </h1>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Skill Edge Learning is a student-led learning OS that complements formal education with practical,
              future-ready skills — built by students, for the world you&apos;ll graduate into.
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 z-10 w-full">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="btn-primary py-4 px-8 text-sm font-bold shadow-xl shadow-orange-500/20 flex items-center gap-2 rounded-2xl w-full sm:w-auto justify-center"
            >
              <span>Join the Movement</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#manifesto"
              className="btn-ghost py-4 px-8 text-sm font-bold border border-white/10 rounded-2xl hover:bg-white/10 text-white w-full sm:w-auto justify-center"
            >
              Read the Manifesto
            </a>
          </div>

          {/* Hero Bottom Tags Strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
            <span className="chip border-white/10 bg-white/5 py-1.5 px-3">12 Future Skills</span>
            <span className="chip border-white/10 bg-white/5 py-1.5 px-3">Built in India 🇮🇳</span>
            <span className="chip border-white/10 bg-white/5 py-1.5 px-3">Student-Led</span>
            <span className="chip border-white/10 bg-white/5 py-1.5 px-3">Free Forever at Launch</span>
          </div>
        </section>

        {/* SECTION: MANIFESTO */}
        <section id="manifesto" className="py-20 border-t border-white/10 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[11px] font-mono text-orange-400 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" /> THE MANIFESTO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              We exist to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                redefine
              </span>{" "}
              what learning can be.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Not another EdTech platform. A movement — built by students, for students, to complement formal education with
              the skills the future actually rewards.
            </p>
          </div>

          {/* System Conflict Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {/* // System Conflict */}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                TODAY&apos;S EDUCATION CREATES TEST-TAKERS.
              </h3>
              <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed">
                The future belongs to builders, yet teenagers are forced through an industrial system optimized for routine
                memory tasks.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="font-mono text-3xl font-bold text-rose-400">15 Years</span>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Spent consuming static theory</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-8 flex-1">
                  <span className="font-mono text-3xl font-bold text-emerald-400">0 Years</span>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Spent practicing high-leverage tools</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
                <h4 className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  {/* // Missing School Tracks */}
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
                      className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-1.5"
                    >
                      <CircleX className="h-3.5 w-3.5 text-rose-400" /> {track}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SKILLS & FLAGSHIP */}
        <section id="skills" className="py-20 border-t border-white/10">
          <div className="space-y-3 mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[11px] font-mono text-orange-400 uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5" /> 12 FUTURE SKILLS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Master the 12 Foundational Disciplines</h2>
          </div>

          {/* Flagship Transformation Hero Card */}
          <div className="neo-box p-6 sm:p-8 rounded-3xl border border-orange-500/40 bg-gradient-to-r from-orange-950/30 via-black to-black mb-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-3xl shrink-0">
                  🤖
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="chip border-orange-400/40 text-[9px] font-mono text-orange-400 uppercase">
                      FLAGSHIP TRANSFORMATION
                    </span>
                    <span className="chip border-emerald-400/40 text-[9px] font-mono text-emerald-400 uppercase">
                      • Live
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">AI Mastery Transformation</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                    Transform from an AI Beginner into an AI-Native Creator. 7 Worlds · 35 Missions · 4,200 XP · 12-16 weeks.
                  </p>
                </div>
              </div>

              <Link
                href={isAuthenticated ? "/learn/ai-prompt-engineering" : "/login"}
                className="btn-primary py-3.5 px-6 text-xs font-mono font-bold shadow-lg shrink-0 rounded-2xl"
              >
                Start AI Mastery →
              </Link>
            </div>
          </div>

          {/* Skill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="clay-card p-5 space-y-4 hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{skill.imageUrl ? "🚀" : "🧠"}</span>
                    <span className="chip border-white/10 text-[9px] font-mono text-zinc-400">
                      Foundational
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{skill.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{skill.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">10 Levels Available</span>
                  <Link
                    href={isAuthenticated ? `/learn/${skill.id}` : "/login"}
                    className="text-xs font-bold text-orange-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Explore Skill</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: AMBASSADOR PROGRAM */}
        <section id="ambassador" className="py-20 border-t border-white/10 relative">
          <div className="clay-card p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto rounded-3xl border border-orange-500/30">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[11px] font-mono text-orange-400 uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" /> AMBASSADOR PROGRAM
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Become a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Founding Member
              </span>{" "}
              of Skill Edge Learning
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Help grow the community and shape the future of the platform. Be there from day one — and leave your mark on
              how a generation of students learns.
            </p>
            <div className="chip border-white/20 bg-white/5 py-1.5 px-4 font-mono text-xs text-amber-300 mx-auto w-fit">
              🕒 Detailed program information will be announced officially during launch
            </div>
          </div>
        </section>

        {/* SECTION: ABOUT US */}
        <section id="about" className="py-20 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[11px] font-mono text-orange-400 uppercase tracking-widest">
              <Heart className="h-3.5 w-3.5" /> ABOUT US
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              We&apos;re building the learning OS we{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400">
                wish we had.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Skill Edge Learning exists to bridge the gap between what school teaches and what the world now rewards — built
              by students, for students, in India, for the world.
            </p>
          </div>
        </section>

        {/* SECTION: CONTACT / LET'S TALK & WHATSAPP INTEGRATION */}
        <section id="contact" className="py-20 border-t border-white/10">
          <div className="neo-box p-8 sm:p-12 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-black to-black max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
              <MessageCircle className="h-3.5 w-3.5" /> LET&apos;S TALK
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Have questions or want to partner with us?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
              Reach out to our team directly on WhatsApp for instantaneous assistance, program inquiries, or partnership opportunities.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white py-4 px-8 text-sm font-mono font-bold shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 rounded-2xl w-full sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
                <span>Chat on WhatsApp (+91 9342366833)</span>
              </a>

              <a
                href="tel:9342366833"
                className="btn-ghost py-4 px-6 text-sm font-mono font-bold border border-white/10 rounded-2xl hover:bg-white/10 text-white flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Call +91 9342366833</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom-Left WhatsApp Chat Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with Skill Edge OS on WhatsApp"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 text-black font-bold font-mono text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-400"
      >
        <MessageCircle className="h-5 w-5 fill-black text-emerald-500" />
        <span className="hidden sm:inline">WhatsApp (+91 9342366833)</span>
      </a>
    </div>
  );
}
