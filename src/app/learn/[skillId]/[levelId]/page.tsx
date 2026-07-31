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
          <Lock className="mx-auto h-12 w-12 text-zinc-500" />
          <h1 className="mt-4 font-mono text-xl font-bold text-white">Tier {level.levelNumber} is locked</h1>
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
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {skill.title}
        </Link>

        {/* Level Header Card */}
        <div className="clay-card relative mb-5 overflow-hidden p-5 sm:p-6">
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
          <h1 className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">{level.title}</h1>
          <p className="mt-2 text-xs text-zinc-300 sm:text-sm">{level.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="chip border-yellow-400/40 font-mono text-amber-300">Reward +ↁ{level.coinReward}</span>
            <span className="chip border-violet-400/40 font-mono text-violet-300">+{fmtNum(level.xpReward)} XP</span>
            <span className="chip font-mono text-zinc-300">Pass ≥ {level.minPassScore}%</span>
          </div>
        </div>

        {/* Dual-Track Tabs */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setTab("activity")}
            className={cn(
              "neo-button flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition sm:text-sm",
              tab === "activity"
                ? "border-amber-400/50 bg-amber-500/15 text-amber-300"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <ListChecks className="h-4 w-4" /> Activity Track
          </button>
          <button
            onClick={() => setTab("video")}
            className={cn(
              "neo-button flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition sm:text-sm",
              tab === "video"
                ? "border-rose-400/50 bg-rose-500/15 text-rose-300"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Youtube className="h-4 w-4" /> Video Track
          </button>
        </div>

        {tab === "activity" && (
          <div className="clay-card p-5 sm:p-6">
            <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              Hands-on practical mission
            </div>
            <div className="space-y-2.5">
              {level.activityContent.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                  className={cn(
                    "neo-button flex w-full items-start gap-3 p-3.5 text-left text-xs sm:text-sm transition",
                    checked[i]
                      ? "border-emerald-400/40 bg-emerald-500/10 text-zinc-200"
                      : "text-zinc-200 hover:text-white"
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
            <div className="mt-3 text-xs text-zinc-400">
              Check off each step as you complete it, then prove your mastery in the assessment.
            </div>
          </div>
        )}

        {tab === "video" && (
          <div className="clay-card p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
              <PlaySquare className="h-4 w-4 text-rose-400" /> Guided video tutorial
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
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
            <div className="mt-4 space-y-1.5 text-xs sm:text-sm text-zinc-300">
              <div className="font-bold text-white">Guided Watch Notes</div>
              <p className="text-zinc-400 leading-relaxed">
                🎯 While watching, capture 3 core ideas and 1 practical technique. Then attempt the assessment below — questions cover both practical & video tracks.
              </p>
            </div>
          </div>
        )}

        {/* Assessment CTA Bar */}
        <div className="clay-card sticky bottom-20 mt-5 flex items-center justify-between gap-3 p-4 sm:bottom-6 z-30">
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-bold text-white">Gated Assessment</div>
            <div className="text-[11px] text-zinc-400">
              {level.questions.length} questions · Pass ≥ {level.minPassScore}% to unlock Tier {Math.min(10, level.levelNumber + 1)}
            </div>
          </div>
          <button
            onClick={() => setQuizOpen(true)}
            className="btn-primary shrink-0 text-xs sm:text-sm"
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
