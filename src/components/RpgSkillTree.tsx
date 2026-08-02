"use client";

import React, { useState } from "react";
import { Check, Crown, Flame, Hexagon, Lock, Play, ShieldAlert, Sparkles, Star, Swords, Trophy, Zap } from "lucide-react";
import { InteractiveLessonRunner } from "@/components/InteractiveLessonRunner";
import { useApp } from "@/lib/store";
import type { Mission, Skill } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

interface Props {
  skill: Skill;
}

export function RpgSkillTree({ skill }: Props) {
  const { missionUnlocked, myProgress } = useApp();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Group missions into Campaign Worlds / Phases
  const phases = Array.from(new Set(skill.missions.map((m) => m.tier))).map((tier) => ({
    tier,
    missions: skill.missions.filter((m) => m.tier === tier),
  }));

  let globalNodeIndex = 0;

  return (
    <div className="space-y-12 py-6">
      {/* Daily Challenge & Practice Arena Bar */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-warning tracking-wider">Daily Quest</div>
              <div className="text-sm font-bold text-white">Complete 1 Micro-Lesson</div>
            </div>
          </div>
          <span className="chip border-warning/40 text-xs font-bold text-warning">+50 XP</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-accent tracking-wider">Practice Arena</div>
              <div className="text-sm font-bold text-white">Endless Mastery Review</div>
            </div>
          </div>
          <span className="chip border-accent/40 text-xs font-bold text-accent">+25 Neurons</span>
        </div>
      </div>

      {/* RPG Skill Tree Campaign Map */}
      {phases.map((phase, phaseIdx) => (
        <div key={phase.tier} className="relative space-y-6">
          {/* Phase Header */}
          <div className="sticky top-16 z-20 flex items-center justify-between rounded-2xl border border-brand/30 bg-surface/95 px-5 py-3.5 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white font-black text-sm">
                W{phaseIdx + 1}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  World {phaseIdx + 1} · {phase.tier}
                </h3>
                <p className="text-[11px] text-zinc-400">{phase.missions.length} Campaign Nodes</p>
              </div>
            </div>
            <span className="chip border-brand/40 bg-brand/10 text-xs font-bold text-brand">
              Phase {phaseIdx + 1}
            </span>
          </div>

          {/* Snake Node Path */}
          <div className="relative mx-auto flex max-w-md flex-col items-center gap-10 py-4">
            {/* Vertical Connecting Track */}
            <div className="absolute bottom-10 top-10 w-2 rounded-full bg-gradient-to-b from-brand via-brand-deep/50 to-line" />

            {phase.missions.map((mission) => {
              globalNodeIndex++;
              const unlock = missionUnlocked(skill, mission.order);
              const approved = Boolean(myProgress.completed[mission.id]);
              const isBoss = mission.order % 5 === 0 || mission.isBossBattle;
              const isProLock = !unlock.unlocked && unlock.reason === "NEEDS_PRO";
              const clickable = unlock.unlocked || approved || isProLock;

              // Horizontal snake offsets: -50px, 0px, 50px, 0px
              const offsets = [0, 56, 0, -56];
              const xOffset = offsets[globalNodeIndex % offsets.length];

              return (
                <div
                  key={mission.id}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                  style={{ transform: `translateX(${xOffset}px)` }}
                  onClick={() => {
                    if (clickable) setSelectedMission(mission);
                  }}
                >
                  {/* Node Icon */}
                  {approved ? (
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-success bg-success/20 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] transition group-hover:scale-110">
                      <Check className="h-8 w-8 stroke-[3]" />
                      <div className="absolute -bottom-2 flex gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      </div>
                    </div>
                  ) : isBoss ? (
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-danger bg-gradient-to-br from-danger via-brand-deep to-black text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse transition group-hover:scale-110">
                      <Swords className="h-9 w-9 text-white" />
                      <span className="absolute -top-2 rounded-full bg-danger px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                        Boss Battle
                      </span>
                    </div>
                  ) : unlock.unlocked ? (
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand bg-gradient-to-br from-brand via-brand-bright to-brand-deep text-white shadow-[0_0_28px_rgba(232,80,2,0.8)] animate-pulse transition group-hover:scale-110">
                      <Play className="h-7 w-7 fill-white ml-1" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full border-4 text-zinc-500 transition group-hover:scale-105",
                        isProLock
                          ? "border-premium bg-premium/20 text-premium shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                          : "border-line bg-card text-zinc-600"
                      )}
                    >
                      {isProLock ? <Crown className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
                    </div>
                  )}

                  {/* Node Label Below */}
                  <div className="mt-2.5 flex flex-col items-center text-center max-w-[180px]">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                      Mission {mission.order}
                    </span>
                    <h4 className="font-display text-xs font-bold text-white line-clamp-1 group-hover:text-brand transition">
                      {mission.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-warning">
                      <Zap className="h-3 w-3" /> +{mission.xpReward} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Interactive Microlearning Runner Modal */}
      {selectedMission && (
        <InteractiveLessonRunner
          skill={skill}
          mission={selectedMission}
          open={Boolean(selectedMission)}
          onClose={() => setSelectedMission(null)}
        />
      )}
    </div>
  );
}
