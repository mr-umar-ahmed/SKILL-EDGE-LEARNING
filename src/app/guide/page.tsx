"use client";

import React from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  Flame,
  Globe,
  Hexagon,
  MessageCircle,
  Play,
  Printer,
  QrCode,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SKILLS } from "@/lib/data";

const PRINT_CSS = `
@media print {
  body {
    background-color: #ffffff !important;
    color: #111827 !important;
  }
  .print-hide {
    display: none !important;
  }
  .print-card {
    border: 1px solid #e5e7eb !important;
    background: #ffffff !important;
    color: #111827 !important;
    box-shadow: none !important;
  }
  .print-text-dark {
    color: #111827 !important;
  }
  .print-text-muted {
    color: #4b5563 !important;
  }
  @page {
    size: A4;
    margin: 15mm;
  }
}
`;

export default function UserGuidePage() {
  return (
    <AppShell>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Top Action Bar */}
      <div className="print-hide mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="btn-ghost text-xs">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <button onClick={() => window.print()} className="btn-primary">
          <Printer className="h-4 w-4" /> Download / Save as PDF
        </button>
      </div>

      {/* Printable PDF Content */}
      <div className="print-card mx-auto max-w-4xl rounded-3xl border border-line bg-card p-6 sm:p-10 space-y-10 text-white">
        {/* Document Header */}
        <div className="border-b border-line pb-8 text-center space-y-3">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand via-brand-bright to-brand-deep shadow-brand">
              <Hexagon className="h-7 w-7 text-white" strokeWidth={2.5} />
            </span>
          </div>
          <div className="font-display text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
            Skill Edge Learning v2
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Official Platform User Guide & Manual
          </div>
          <p className="mx-auto max-w-xl text-xs text-zinc-400">
            Powered by ARIA Neural Intelligence · Master 12 High-Income Skills Through Practical Real-World Missions
          </p>
        </div>

        {/* Section 1: Platform Summary */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-brand border-b border-line/60 pb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-brand" /> 1. Executive Summary & Purpose
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300">
            <strong>Skill Edge Learning (SEL v2)</strong> is a practical <strong>Skill Operating System</strong> designed for students and practitioners. Unlike traditional course platforms that measure completion by video watch time, Skill Edge Learning measures mastery by <strong>deliverables shipped</strong>.
          </p>
          <ul className="grid gap-2 text-xs text-zinc-300 sm:grid-cols-2">
            <li className="flex items-start gap-2 rounded-xl border border-line/60 bg-surface/60 p-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <span><strong>12 Catalog Skills:</strong> AI Coding, AI Productivity, Product Building, Entrepreneurship, Design, etc.</span>
            </li>
            <li className="flex items-start gap-2 rounded-xl border border-line/60 bg-surface/60 p-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <span><strong>10 Missions per Skill:</strong> Sequential hands-on projects with real-world briefs and checklists.</span>
            </li>
            <li className="flex items-start gap-2 rounded-xl border border-line/60 bg-surface/60 p-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <span><strong>Public Proof Portfolio:</strong> Approved mission submissions auto-populate your public portfolio.</span>
            </li>
            <li className="flex items-start gap-2 rounded-xl border border-line/60 bg-surface/60 p-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <span><strong>QR Verified Credentials:</strong> Authenticated digital certificates with 1-click LinkedIn export.</span>
            </li>
          </ul>
        </div>

        {/* Section 2: The 5-Step Learning Loop */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-brand border-b border-line/60 pb-2 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-brand" /> 2. The 5-Step Learning Loop Guide
          </h2>
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="rounded-xl border border-line bg-surface/70 p-3 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">1</span>
                Step 01: Choose Your Skill Transformation
              </div>
              <p className="text-zinc-400 pl-7">Select a high-income skill track. Every skill displays its target role (e.g. <em>AI Software Engineer</em>, <em>Startup Founder</em>) and build capabilities before you begin.</p>
            </div>

            <div className="rounded-xl border border-line bg-surface/70 p-3 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">2</span>
                Step 02: Follow the Duolingo Mission Roadmap
              </div>
              <p className="text-zinc-400 pl-7">Missions unlock sequentially down a visual snake path. Green checkmarks mark finished work, pulsing orange nodes mark your current project, and milestone chests award bonus Neurons.</p>
            </div>

            <div className="rounded-xl border border-line bg-surface/70 p-3 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">3</span>
                Step 03: Ship Real Deliverable Links
              </div>
              <p className="text-zinc-400 pl-7">Complete the mission brief and attach proof-of-work: GitHub repositories, Figma prototypes, Canva decks, Google Drive folders, or live URL links.</p>
            </div>

            <div className="rounded-xl border border-line bg-surface/70 p-3 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">4</span>
                Step 04: ARIA AI Pre-Flight & Admin Evaluation
              </div>
              <p className="text-zinc-400 pl-7">The ARIA AI Pre-Flight Checker inspects link health and writeup completeness. Submissions are reviewed by expert admins with custom scores and feedback.</p>
            </div>

            <div className="rounded-xl border border-line bg-surface/70 p-3 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">5</span>
                Step 05: Portfolio Addition & QR Certificate Minting
              </div>
              <p className="text-zinc-400 pl-7">Approved projects automatically appear on your public profile. Phase completion (Mission 5) and full skill completion (Mission 10) issue QR-verified certificates.</p>
            </div>
          </div>
        </div>

        {/* Section 3: ARIA AI Pre-Checker & Evaluation */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-brand border-b border-line/60 pb-2 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-brand" /> 3. ARIA AI Pre-Flight Assistant & Admin Review
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300">
            The <strong>ARIA Neural Pre-Flight Assistant</strong> provides real-time readiness analysis before submission.
          </p>
          <div className="rounded-xl border border-brand/40 bg-brand/10 p-3 text-xs text-brand font-bold">
            Note: ARIA Pre-Flight is an intelligent AI Assistant Simulation preview. Final project approvals and scoring are conducted by the Admin review team. Automated LLM code evaluation pipeline is in active development (Future Scope).
          </div>
        </div>

        {/* Section 4: Family Plan & Sibling Profiles */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-brand border-b border-line/60 pb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-brand" /> 4. Family Plan & Multi-Profile Switcher
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300">
            The <strong>Family Plan (₹9,999/yr)</strong> allows 1 parent subscription to manage up to 5 child profiles. Each child gets an isolated learning state, XP leaderboard rank, separate portfolio, and individual certificates.
          </p>
          <div className="rounded-xl border border-line bg-surface/70 p-3 text-xs text-zinc-400">
            To switch profiles: Click the <strong className="text-white">Family Profile Switcher</strong> button in the top navigation bar to select or add a child profile.
          </div>
        </div>

        {/* Section 5: Certificates & LinkedIn Export */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-brand border-b border-line/60 pb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-brand" /> 5. QR Certificates & LinkedIn Credentials
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300">
            Every certificate features a unique Certificate ID (`SE-XXXXX`) and public QR verification URL (`/verify/[code]`). Click <strong className="text-white">Add to LinkedIn Profile</strong> on any certificate page to export directly to LinkedIn.
          </p>
        </div>

        {/* Document Footer */}
        <div className="border-t border-line pt-6 text-center space-y-2 text-xs text-zinc-500">
          <div className="font-bold text-white">Skill Edge Learning Support & Helpline</div>
          <div>WhatsApp Helpline: +91 9342366833 · Support Email: learningskilledge@gmail.com</div>
          <div className="text-[10px]">© {new Date().getFullYear()} Skill Edge Learning v2. All rights reserved.</div>
        </div>
      </div>
    </AppShell>
  );
}
