"use client";

import { ArrowRight, Clock3, Layers, Play, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { EmptyState, PageHeader, ProgressBar, SkeletonCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-success border-success/40 bg-success/10",
  Intermediate: "text-warning border-warning/40 bg-warning/10",
  Advanced: "text-accent border-accent/40 bg-accent/10",
  Expert: "text-premium border-premium/40 bg-premium/10",
};

function SkillCard({ skill, approved }: { skill: Skill; approved: number }) {
  const total = skill.missions.length;
  const progress = total ? approved / total : 0;
  const started = approved > 0;
  const completed = total > 0 && approved >= total;

  return (
    <Link
      href={`/learn/${skill.id}`}
      className="card-glow group flex flex-col overflow-hidden animate-fade-up"
    >
      {/* thumbnail */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={skill.thumbnailUrl}
          alt={skill.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div
          className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 shadow-lg backdrop-blur-md"
          style={{ background: `${skill.color}26` }}
        >
          <SkillIcon name={skill.iconName} className="h-5 w-5" style={{ color: skill.color }} />
        </div>
        <span className={cn("absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold", DIFFICULTY_COLORS[skill.difficulty])}>
          {skill.difficulty}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{skill.category}</div>
          <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-brand">
            {skill.title}
          </h3>

          {/* Outcome transformation badge */}
          {skill.transformation && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand">
              <span>Become: {skill.transformation.become}</span>
            </div>
          )}

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">{skill.description}</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" /> {skill.estimatedHours}h
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> {total} missions
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-zinc-500">
              {approved}/{total} approved
            </span>
            <span style={{ color: skill.color }}>{Math.round(progress * 100)}%</span>
          </div>
          <ProgressBar progress={progress} height={6} />
          <span className="btn-primary mt-1 w-full py-2 text-xs">
            {completed ? (
              <>
                Review skill <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : started ? (
              <>
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Start
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SkillsPage() {
  const { hydrated, catalog, myProgress } = useApp();
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(catalog.map((s) => s.category)))], [catalog]);

  const filtered = useMemo(
    () => (category === "All" ? catalog : catalog.filter((s) => s.category === category)),
    [catalog, category]
  );

  const approvedCount = (skill: Skill) => skill.missions.filter((m) => myProgress.completed[m.id]).length;

  return (
    <AppShell>
      <PageHeader
        icon={<Layers className="h-5 w-5" />}
        title="Skills Catalog"
        subtitle="Pick a skill, execute 10 real missions, walk away with a portfolio. Every mission produces reviewable work."
      />

      {/* category filter chips */}
      <div className="mb-6 flex flex-wrap gap-2 animate-fade-up">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn("chip transition-all", category === c && "nav-active-pill border-transparent")}
          >
            {c}
          </button>
        ))}
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title="No skills here yet"
          text="No published skills match this category. Try another filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} approved={approvedCount(skill)} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
