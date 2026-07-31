"use client";

import { ArrowLeft, CheckSquare, Crown, ListChecks, Lock, PlaySquare, Square, Swords, Youtube } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AssessmentModal } from "@/components/AssessmentModal";
import { cn, fmtNum } from "@/lib/utils";
import { useApp } from "@/lib/store";

export default function LevelPage() {
  const params = useParams<{ skillId: string; levelId: string }>();
  const { skills, myProgress, isLevelUnlocked, completeLevel } = useApp();
  const [tab, setTab] = useState<"activity" | "video">("activity");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [quizOpen, setQuizOpen] = useState(false);

  const skill = skills.find((s) => s.id === params.skillId);
  const levelNumber = Number(String(params.levelId).replace("level-", ""));
  const level = skill?.levels.find((l) => l.levelNumber === levelNumber);
  if (!skill || !level) notFound();

  const unlocked = isLevelUnlocked(skill, level.levelNumber);
  const completed = myProgress.completed[level.id];

  if (!unlocked) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg py-16 text-center">
          <Lock className="mx-auto h-12 w-12 text-zinc-600" />
          <h1 className="mt-4 font-mono text-xl font-bold text-zinc-200">Tier {level.levelNumber} is locked</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {level.isPremium && !myProgress.premiumUnlocks[skill.id]
              ? "This is a premium tier — unlock Tiers 7-10 from the skill map with EdgeCoins."
              : `Clear Tier ${level.levelNumber - 1} with ${level.minPassScore}%+ to open this node.`}
          </p>
          <Link href={`/learn/${skill.id}`} className="btn-primary mt-6">
            Back to {skill.title}
          </Link>
        </div>
      </AppShell>
    );
  }

  const allChecked = level.activityContent.every((_, i) => checked[i]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/learn/${skill.id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" /> {skill.title}
        </Link>

        {/* header */}
        <div className="glass relative mb-5 overflow-hidden p-5">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
            style={{ background: skill.color }}
          />
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span style={{ color: skill.color }}>
              Tier {level.levelNumber} · {level.tier}
            </span>
            {level.isPremium && (
              <span className="flex items-center gap-1 text-amber-400">
                <Crown className="h-3.5 w-3.5" /> Premium
              </span>
            )}
            {completed && <span className="text-emerald-400">✓ Cleared at {completed.score}%</span>}
          </div>
          <h1 className="mt-1 font-mono text-2xl font-bold text-zinc-50">{level.title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{level.description}</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="chip border-yellow-400/30 font-mono text-yellow-300">Reward +ↁ{level.coinReward}</span>
            <span className="chip border-violet-400/30 font-mono text-violet-300">+{fmtNum(level.xpReward)} XP</span>
            <span className="chip font-mono">Pass ≥ {level.minPassScore}%</span>
          </div>
        </div>

        {/* dual-track tabs */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab("activity")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              tab === "activity"
                ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
            )}
          >
            <ListChecks className="h-4 w-4" /> Activity Mission
          </button>
          <button
            onClick={() => setTab("video")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              tab === "video"
                ? "border-rose-400/50 bg-rose-500/15 text-rose-300 shadow-lg shadow-rose-500/10"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
            )}
          >
            <Youtube className="h-4 w-4" /> Video Mission
          </button>
        </div>

        {tab === "activity" && (
          <div className="glass p-5">
            <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              Hands-on practical mission
            </div>
            <div className="space-y-2">
              {level.activityContent.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                    checked[i]
                      ? "border-emerald-400/30 bg-emerald-500/10 text-zinc-300"
                      : "border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06]"
                  )}
                >
                  {checked[i] ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                  )}
                  <span className={cn(checked[i] && "line-through opacity-70")}>{step}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Check off each step as you complete it, then prove your mastery in the assessment.
            </div>
          </div>
        )}

        {tab === "video" && (
          <div className="glass p-5">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              <PlaySquare className="h-4 w-4 text-rose-400" /> Curated guided mission
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${level.youtubeVideoId}`}
                  title={level.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-zinc-300">
              <div className="font-semibold text-zinc-200">Watch notes</div>
              <p className="text-zinc-400">
                🎯 While watching, capture: the 3 core ideas, 1 technique you can apply within 24 hours, and 1 question
                you still have. Then attempt the mission from the Activity tab — the assessment covers both tracks.
              </p>
            </div>
          </div>
        )}

        {/* assessment CTA */}
        <div className="glass-strong sticky bottom-24 mt-5 flex items-center gap-3 p-4 lg:bottom-6">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-zinc-100">Gated Assessment</div>
            <div className="text-xs text-zinc-500">
              {level.questions.length} questions · score {level.minPassScore}%+ to unlock Tier {Math.min(10, level.levelNumber + 1)}
            </div>
          </div>
          <button
            onClick={() => setQuizOpen(true)}
            className="btn-primary"
            style={tab === "activity" && !allChecked && !completed ? { opacity: 0.85 } : undefined}
          >
            <Swords className="h-4 w-4" /> {completed ? "Retake" : "Start"} Assessment
          </button>
        </div>
      </div>

      <AssessmentModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        skill={skill}
        level={level}
        onSubmit={(score) => completeLevel(level.id, score)}
      />
    </AppShell>
  );
}
