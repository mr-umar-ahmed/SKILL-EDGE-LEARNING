"use client";

import { CheckCircle2, Flame, Gift, Sparkles, Target, Zap } from "lucide-react";
import { useApp } from "@/lib/store";
import { playCoinSound, playXpSound } from "@/lib/sound";
import { Modal } from "./ui";

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
  coins: number;
  xp: number;
  current: number;
  target: number;
}

export function DailyMissionsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { myProgress, claimDailyMission } = useApp();

  const completedCountToday = Object.values(myProgress.completed).length;

  const MISSIONS: Mission[] = [
    {
      id: "m-complete-level",
      title: "Master 1 Skill Level",
      description: "Pass any level assessment with 80%+ score.",
      icon: Target,
      coins: 20,
      xp: 50,
      current: Math.min(completedCountToday, 1),
      target: 1,
    },
    {
      id: "m-high-score",
      title: "Score 100% Perfection",
      description: "Ace an assessment with a perfect 100% score.",
      icon: Sparkles,
      coins: 30,
      xp: 75,
      current: Math.min(
        Object.values(myProgress.completed).filter((c) => c.score === 100).length,
        1
      ),
      target: 1,
    },
    {
      id: "m-streak-defender",
      title: "Keep the Cyber Streak Alive",
      description: "Log in and complete at least one mission step today.",
      icon: Flame,
      coins: 15,
      xp: 40,
      current: 1, // Always active if user is logged in
      target: 1,
    },
  ];

  const handleClaim = (m: Mission) => {
    playCoinSound();
    setTimeout(() => playXpSound(), 200);
    claimDailyMission(m.id, m.coins, m.xp);
  };

  return (
    <Modal open={open} onClose={onClose} title="🎯 Daily Cyber Quests">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2.5">
            <Gift className="h-5 w-5 text-amber-400" />
            <div className="text-xs font-semibold text-amber-200">
              Quests refresh daily at midnight GMT
            </div>
          </div>
          <span className="chip border-amber-400/40 font-mono text-[10px] text-amber-300">
            3 Active Quests
          </span>
        </div>

        <div className="space-y-3">
          {MISSIONS.map((m) => {
            const isReady = m.current >= m.target;
            const isClaimed = !!myProgress.claimedMissions?.[m.id];
            const Icon = m.icon;

            return (
              <div
                key={m.id}
                className="glass flex flex-col justify-between gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <p className="text-xs text-zinc-400">{m.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="chip border-yellow-400/30 font-mono text-[10px] text-yellow-300">
                        +ↁ{m.coins}
                      </span>
                      <span className="chip border-violet-400/30 font-mono text-[10px] text-violet-300">
                        <Zap className="h-3 w-3 inline" /> +{m.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  {isClaimed ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Claimed
                    </div>
                  ) : isReady ? (
                    <button
                      onClick={() => handleClaim(m)}
                      className="btn-primary w-full text-xs font-bold sm:w-auto"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <div className="font-mono text-xs text-zinc-500">
                      {m.current}/{m.target} Progress
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
