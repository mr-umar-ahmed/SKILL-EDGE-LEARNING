"use client";

import React from "react";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Cpu,
  FolderGit2,
  Rocket,
  Sparkles,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import type { SkillTransformation } from "@/lib/types";

interface Props {
  transformation?: SkillTransformation;
  skillTitle: string;
  skillColor?: string;
}

export function SkillTransformationHero({ transformation, skillTitle, skillColor = "#E85002" }: Props) {
  if (!transformation) return null;

  return (
    <div className="clay-card relative mb-8 overflow-hidden border-brand/30 bg-gradient-to-br from-surface via-card to-base p-6 sm:p-8 animate-fade-up">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-deep/10 blur-3xl" />

      {/* Target Transformation Tag */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand">
        <Sparkles className="h-4 w-4" />
        TARGET TRANSFORMATION
      </div>

      {/* Main Title & Role */}
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
        Become a <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-sand bg-clip-text text-transparent">{transformation.become}</span>
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        {transformation.headline}
      </p>

      {/* Grid of Outcome Columns */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: What You'll Build */}
        <div className="rounded-2xl border border-line/80 bg-base/60 p-4 backdrop-blur-md transition hover:border-brand/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <Wrench className="h-4 w-4" />
            What You&apos;ll Build
          </div>
          <ul className="space-y-2">
            {transformation.canBuild.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Real-World Outcomes */}
        <div className="rounded-2xl border border-line/80 bg-base/60 p-4 backdrop-blur-md transition hover:border-brand/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
            <Zap className="h-4 w-4" />
            Real-World Outcomes
          </div>
          <ul className="space-y-2">
            {transformation.realWorldOutcomes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Projects You'll Complete */}
        <div className="rounded-2xl border border-line/80 bg-base/60 p-4 backdrop-blur-md transition hover:border-brand/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
            <FolderGit2 className="h-4 w-4" />
            Projects Completed
          </div>
          <ul className="space-y-2">
            {transformation.projectsCompleted.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Career Opportunities */}
        <div className="rounded-2xl border border-line/80 bg-base/60 p-4 backdrop-blur-md transition hover:border-brand/40">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-premium">
            <Briefcase className="h-4 w-4" />
            Career Opportunities
          </div>
          <ul className="space-y-2">
            {transformation.careerOpportunities.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-premium" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
