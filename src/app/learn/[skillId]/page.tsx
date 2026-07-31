"use client";

import { ArrowLeft, Check, Crown, Layers, Lock, Play, Star } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { Modal, ProgressRing } from "@/components/ui";
import { fireConfetti } from "@/components/confetti";
import { useApp } from "@/lib/store";
import { cn, fmtCoins, fmtNum } from "@/lib/utils";

export default function SkillMapPage() {
  const params = useParams<{ skillId: string }>();
  const { skills, myProgress, isLevelUnlocked, currentUser, unlockPremium } = useApp();
  const [premiumOpen, setPremiumOpen] = useState(false);
  const skill = skills.find((s) => s.id === params.skillId);
  if (!skill) notFound();

  const done = skill.levels.filter((l) => myProgress.completed[l.id]).length;
  const premiumUnlocked = !!myProgress.premiumUnlocks[skill.id];

  const handleUnlock = () => {
    if (unlockPremium(skill.id)) {
      fireConfetti();
      setPremiumOpen(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Skill Map
        </Link>

        {/* Skill Header Card with Realistic Cover Banner */}
        <div className="clay-card relative mb-8 overflow-hidden p-0">
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={skill.imageUrl}
              alt={skill.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-black/20" />
            <div className="absolute bottom-4 left-5 right-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div className="flex items-center gap-4">
                <ProgressRing progress={done / 10} size={64} stroke={6} color={skill.color}>
                  <SkillIcon name={skill.iconName} className="h-6 w-6" style={{ color: skill.color }} />
                </ProgressRing>
                <div>
                  <span className="chip border-white/20 bg-black/50 font-mono text-[10px] text-zinc-300 backdrop-blur-md">
                    {skill.category}
                  </span>
                  <h1 className="font-mono text-xl font-bold text-white drop-shadow-md sm:text-2xl mt-1">
                    {skill.title}
                  </h1>
                  <div className="mt-0.5 font-mono text-xs font-semibold" style={{ color: skill.color }}>
                    {done}/10 Tiers Cleared {premiumUnlocked && "· 👑 Premium Unlocked"}
                  </div>
                </div>
              </div>

              <Link
                href={`/learn/${skill.id}/practice`}
                className="btn-ghost flex items-center gap-2 border-white/20 bg-black/60 font-mono text-xs text-amber-300 backdrop-blur-md hover:border-amber-400/50"
              >
                <Layers className="h-4 w-4 text-amber-400" /> Practice Deck
              </Link>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-zinc-300 leading-relaxed">{skill.description}</p>
          </div>
        </div>

        {/* Level Winding Progression Path */}
        <div className="relative">
          <div className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-amber-400/30 via-white/10 to-amber-400/30" />
          <div className="space-y-4">
            {skill.levels.map((level, i) => {
              const completed = myProgress.completed[level.id];
              const unlocked = isLevelUnlocked(skill, level.levelNumber);
              const isPremiumGate = level.levelNumber === 7 && !premiumUnlocked;
              const side = i % 2 === 0 ? "sm:mr-auto sm:ml-0" : "sm:ml-auto sm:mr-0";
              return (
                <div key={level.id}>
                  {isPremiumGate && (
                    <button
                      onClick={() => setPremiumOpen(true)}
                      className="clay-card relative z-10 mx-auto mb-4 flex w-full max-w-md items-center gap-3 border-amber-400/40 p-4 text-left transition hover:scale-105"
                    >
                      <Crown className="h-8 w-8 shrink-0 text-amber-400" />
                      <div className="flex-1">
                        <div className="font-mono text-sm font-bold text-amber-300">Premium Tiers 7–10</div>
                        <div className="text-xs text-zinc-400">
                          Unlock Specialist → Sovereign Master for {fmtCoins(skill.premiumCost)}
                        </div>
                      </div>
                      <span className="btn-gold !px-3 !py-1.5 text-xs">Unlock</span>
                    </button>
                  )}
                  <LevelNode
                    skillId={skill.id}
                    level={level}
                    color={skill.color}
                    completed={!!completed}
                    score={completed?.score}
                    unlocked={unlocked}
                    className={side}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Unlock Modal */}
      <Modal open={premiumOpen} onClose={() => setPremiumOpen(false)} title="👑 Unlock Premium Tiers">
        <p className="text-sm text-zinc-300">
          Tiers 7–10 of <span className="font-semibold text-white">{skill.title}</span> contain Specialist,
          Strategist, Vanguard and Sovereign Master missions — the levels that separate hobbyists from professionals.
        </p>
        <div className="glass mt-4 flex items-center justify-between p-4">
          <span className="text-xs text-zinc-400">One-time unlock cost</span>
          <span className="font-mono text-xl font-bold text-amber-300">{fmtCoins(skill.premiumCost)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between px-1 text-xs text-zinc-500">
          <span>Your balance</span>
          <span className="font-mono">{fmtCoins(currentUser.edgeCoins)}</span>
        </div>
        {currentUser.edgeCoins < skill.premiumCost ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-300">
              You need {fmtCoins(skill.premiumCost - currentUser.edgeCoins)} more. Top up via UPI or win them in
              tournaments!
            </div>
            <Link href="/payment" className="btn-gold w-full">
              Buy EdgeCoins
            </Link>
          </div>
        ) : (
          <button onClick={handleUnlock} className="btn-gold mt-4 w-full">
            <Crown className="h-4 w-4" /> Unlock for {fmtCoins(skill.premiumCost)}
          </button>
        )}
      </Modal>
    </AppShell>
  );
}

function LevelNode({
  skillId,
  level,
  color,
  completed,
  score,
  unlocked,
  className,
}: {
  skillId: string;
  level: { id: string; levelNumber: number; title: string; tier: string; coinReward: number; xpReward: number; isPremium: boolean };
  color: string;
  completed: boolean;
  score?: number;
  unlocked: boolean;
  className?: string;
}) {
  const inner = (
    <div
      className={cn(
        "neo-box relative z-10 flex w-full max-w-md items-center gap-4 p-4 transition-all duration-300",
        unlocked && "hover:scale-105 cursor-pointer",
        !unlocked && "opacity-60 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-mono text-lg font-black transition-all",
          completed ? "text-zinc-950" : "text-white"
        )}
        style={{
          background: completed ? color : unlocked ? `${color}30` : "rgba(255,255,255,0.06)",
          boxShadow: completed ? `0 0 16px ${color}90` : undefined,
        }}
      >
        {completed ? <Check className="h-6 w-6" /> : unlocked ? level.levelNumber : <Lock className="h-5 w-5 text-zinc-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
            Tier {level.levelNumber} · {level.tier}
          </span>
          {level.isPremium && <Crown className="h-3.5 w-3.5 text-amber-400" />}
        </div>
        <div className="truncate text-sm font-bold text-white">{level.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="font-mono text-amber-300">+ↁ{level.coinReward}</span>
          <span className="font-mono text-violet-300">+{fmtNum(level.xpReward)} XP</span>
          {completed && (
            <span className="ml-auto flex items-center gap-0.5 font-mono font-bold text-emerald-400">
              <Star className="h-3 w-3 fill-emerald-400" /> {score}%
            </span>
          )}
        </div>
      </div>
      {unlocked && !completed && <Play className="h-4 w-4 shrink-0 text-amber-400" />}
    </div>
  );

  return unlocked ? (
    <Link href={`/learn/${skillId}/level-${level.levelNumber}`} className={cn("block", className)}>
      {inner}
    </Link>
  ) : (
    <div className={cn("block cursor-not-allowed", className)}>{inner}</div>
  );
}
