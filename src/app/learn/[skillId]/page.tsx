"use client";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  Hexagon,
  Layers,
  Lock,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { AdSlot } from "@/components/ads/AdSlot";
import { EmptyState, ProgressBar, Skeleton, SkeletonCard, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Mission, Skill, Submission } from "@/lib/types";
import { cn, fmtMinutes, fmtNum } from "@/lib/utils";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-success border-success/40 bg-success/10",
  Intermediate: "text-warning border-warning/40 bg-warning/10",
  Advanced: "text-accent border-accent/40 bg-accent/10",
  Expert: "text-premium border-premium/40 bg-premium/10",
};

function latestSubmission(subs: Submission[]): Submission | null {
  if (subs.length === 0) return null;
  return [...subs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

function MissionRow({ skill, mission }: { skill: Skill; mission: Mission }) {
  const { missionUnlocked, myProgress, submissionsForMission } = useApp();
  const unlock = missionUnlocked(skill, mission.order);
  const approved = Boolean(myProgress.completed[mission.id]);
  const latest = latestSubmission(submissionsForMission(mission.id));

  const isProLock = !unlock.unlocked && unlock.reason === "NEEDS_PRO";
  const clickable = unlock.unlocked || approved || isProLock;
  const href = isProLock && !approved ? "/pricing" : `/mission/${mission.id}`;

  const ring = approved ? (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-success bg-success/15 text-success shadow-[0_0_14px_rgba(34,197,94,0.35)]">
      <Check className="h-5 w-5" strokeWidth={3} />
    </div>
  ) : !unlock.unlocked ? (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
        isProLock ? "border-premium/60 bg-premium/10 text-premium" : "border-line bg-surface text-zinc-500"
      )}
    >
      {isProLock ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </div>
  ) : (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold text-white"
      style={{ borderColor: skill.color, background: `${skill.color}1f`, boxShadow: `0 0 14px ${skill.color}40` }}
    >
      {mission.order}
    </div>
  );

  const statusEl = approved ? (
    <StatusPill status="APPROVED" />
  ) : latest ? (
    <StatusPill status={latest.status} />
  ) : !unlock.unlocked ? (
    <span className="chip text-[11px]">
      {isProLock ? (
        <>
          <Crown className="h-3 w-3 text-premium" /> <span className="text-premium">Pro</span>
        </>
      ) : (
        <>
          <Lock className="h-3 w-3" /> {unlock.reason === "ADMIN_LOCKED" ? "Locked by admin" : "Locked"}
        </>
      )}
    </span>
  ) : (
    <span className="chip border-brand/40 bg-brand/10 text-[11px] text-brand">Available</span>
  );

  const body = (
    <div
      className={cn(
        "flex flex-1 items-start gap-3 rounded-card border border-line bg-card p-4 transition-all",
        clickable && "group-hover:border-brand/50 group-hover:bg-hover",
        !unlock.unlocked && !approved && !isProLock && "opacity-60"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Mission {mission.order}
          </span>
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", DIFFICULTY_COLORS[mission.difficulty])}>
            {mission.difficulty}
          </span>
          {mission.isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-premium/40 bg-premium/10 px-2 py-0.5 text-[10px] font-bold text-premium">
              <Crown className="h-3 w-3" /> Pro
            </span>
          )}
        </div>
        <h3 className="mt-1 font-display text-sm font-bold text-white sm:text-base">{mission.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">{mission.objective}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" /> {fmtMinutes(mission.estimatedMinutes)}
          </span>
          <span className="inline-flex items-center gap-1 text-warning">
            <Zap className="h-3.5 w-3.5" /> +{fmtNum(mission.xpReward)} XP
          </span>
          <span className="inline-flex items-center gap-1 text-accent">
            <Hexagon className="h-3.5 w-3.5 fill-accent/20" /> +{mission.neuronReward}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        {statusEl}
        {clickable && (
          <ChevronRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* timeline rail */}
      <div className="flex flex-col items-center">
        {ring}
        <div className="w-px flex-1 bg-line" />
      </div>
      {clickable ? (
        <Link href={href} className="group mb-4 flex min-w-0 flex-1">
          {body}
        </Link>
      ) : (
        <div className="mb-4 flex min-w-0 flex-1">{body}</div>
      )}
    </div>
  );
}

export default function SkillMapPage() {
  const params = useParams<{ skillId: string }>();
  const { hydrated, catalog, myProgress } = useApp();
  const skill = catalog.find((s) => s.id === params.skillId);

  if (!hydrated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-52 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!skill) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl pt-10">
          <EmptyState
            icon={<Compass className="h-8 w-8" />}
            title="Skill not found"
            text="This skill doesn't exist or isn't published yet. Browse the catalog to find your next mission."
            action={
              <Link href="/skills" className="btn-primary">
                Browse skills
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const total = skill.missions.length;
  const done = skill.missions.filter((m) => myProgress.completed[m.id]).length;
  const progress = total ? done / total : 0;

  /* group missions by tier/phase, preserving mission order */
  const phases: { tier: string; missions: Mission[] }[] = [];
  for (const m of [...skill.missions].sort((a, b) => a.order - b.order)) {
    const last = phases[phases.length - 1];
    if (last && last.tier === m.tier) last.missions.push(m);
    else phases.push({ tier: m.tier, missions: [m] });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/skills"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All skills
        </Link>

        {/* hero */}
        <div className="clay-card relative mb-8 overflow-hidden animate-fade-up">
          <div className="relative h-44 w-full overflow-hidden sm:h-52">
            <Image
              src={skill.thumbnailUrl}
              alt={skill.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <div
              className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 shadow-lg backdrop-blur-md"
              style={{ background: `${skill.color}26` }}
            >
              <SkillIcon name={skill.iconName} className="h-6 w-6" style={{ color: skill.color }} />
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{skill.category}</span>
              <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold", DIFFICULTY_COLORS[skill.difficulty])}>
                {skill.difficulty}
              </span>
            </div>
            <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {skill.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{skill.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" /> ~{skill.estimatedHours} hours
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> {total} missions
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-400">
                  {done} of {total} missions approved
                </span>
                <span style={{ color: skill.color }}>{Math.round(progress * 100)}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>

        {/* mission timeline grouped by phase */}
        <div className="animate-fade-up">
          {phases.map((phase) => (
            <div key={phase.tier} className="mb-2">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                  style={{ borderColor: `${skill.color}55`, background: `${skill.color}14`, color: skill.color }}
                >
                  {phase.tier}
                </span>
                <div className="h-px flex-1 bg-line" />
              </div>
              {phase.missions.map((m) => (
                <MissionRow key={m.id} skill={skill} mission={m} />
              ))}
            </div>
          ))}
        </div>

        <AdSlot className="mt-8" />
      </div>
    </AppShell>
  );
}
