"use client";

import React from "react";
import { Check, Crown, Hexagon, Lock, Play, Star, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { playClickSound } from "@/lib/sound";
import type { Mission, Skill, Submission } from "@/lib/types";
import { cn, fmtMinutes, fmtNum } from "@/lib/utils";

interface Props {
  skill: Skill;
  phases: { tier: string; missions: Mission[] }[];
}

function latestSubmission(subs: Submission[]): Submission | null {
  if (subs.length === 0) return null;
  return [...subs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

export function DuolingoMissionPath({ skill, phases }: Props) {
  const { missionUnlocked, myProgress, submissionsForMission } = useApp();

  let globalIndex = 0;

  return (
    <div className="space-y-12 py-4">
      {phases.map((phase, phaseIdx) => {
        return (
          <div key={phase.tier} className="relative">
            {/* Phase Header Banner */}
            <div className="sticky top-16 z-20 mb-8 flex items-center justify-between rounded-2xl border border-brand/30 bg-surface/95 px-5 py-3.5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/20 text-brand font-bold">
                  {phaseIdx + 1}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                    {phase.tier}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {phase.missions.length} Missions in this phase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="chip border-brand/40 bg-brand/10 text-xs font-semibold text-brand">
                  Phase {phaseIdx + 1}
                </span>
              </div>
            </div>

            {/* Duolingo Snake Node Path */}
            <div className="relative mx-auto flex max-w-md flex-col items-center gap-8 py-4">
              {/* Connecting Vertical Track */}
              <div className="absolute bottom-8 top-8 w-1.5 rounded-full bg-gradient-to-b from-brand/60 via-brand-deep/30 to-line" />

              {phase.missions.map((mission) => {
                globalIndex++;
                const unlock = missionUnlocked(skill, mission.order);
                const approved = Boolean(myProgress.completed[mission.id]);
                const latest = latestSubmission(submissionsForMission(mission.id));
                const isProLock = !unlock.unlocked && unlock.reason === "NEEDS_PRO";
                const clickable = unlock.unlocked || approved || isProLock;
                const href = isProLock && !approved ? "/pricing" : `/mission/${mission.id}`;

                // Determine horizontal offset for Duolingo snake effect: -48px, 0px, 48px, 0px
                const offsets = [0, 56, 0, -56];
                const xOffset = offsets[globalIndex % offsets.length];

                return (
                  <div
                    key={mission.id}
                    className="relative z-10 flex flex-col items-center group"
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    {/* Mission Node Button */}
                    {clickable ? (
                      <Link href={href} onClick={playClickSound} className="relative block">
                        {/* Node Halo Effect */}
                        {approved ? (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-success bg-success/20 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] transition group-hover:scale-110">
                            <Check className="h-8 w-8 stroke-[3]" />
                          </div>
                        ) : unlock.unlocked ? (
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand bg-gradient-to-br from-brand via-brand-bright to-brand-deep text-white shadow-[0_0_28px_rgba(232,80,2,0.8)] animate-pulse transition group-hover:scale-110">
                            <Play className="h-7 w-7 fill-white ml-1" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-bright"></span>
                            </span>
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
                      </Link>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-line bg-card text-zinc-600">
                        <Lock className="h-6 w-6" />
                      </div>
                    )}

                    {/* Mission Card Popover / Label below */}
                    <div className="mt-2.5 flex flex-col items-center text-center max-w-[200px]">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                        Mission {mission.order}
                      </span>
                      <h4 className="font-display text-xs font-bold text-white line-clamp-1 group-hover:text-brand transition">
                        {mission.title}
                      </h4>

                      {/* Reward Chips */}
                      <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold">
                        <span className="text-warning flex items-center gap-0.5">
                          <Zap className="h-3 w-3" /> +{mission.xpReward} XP
                        </span>
                        <span className="text-accent flex items-center gap-0.5">
                          <Hexagon className="h-3 w-3 fill-accent/20" /> +{mission.neuronReward}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
