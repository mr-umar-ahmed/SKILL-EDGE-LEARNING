"use client";

import { CheckCircle2, Flame, Gift, Hexagon, Sparkles, Target, Zap } from "lucide-react";
import { useApp } from "@/lib/store";
import { playCoinSound, playXpSound } from "@/lib/sound";
import { Modal } from "./ui";

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
  neurons: number;
  xp: number;
  current: number;
  target: number;
}

export function DailyMissionsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { myProgress, mySubmissions, claimDailyMission } = useApp();

  const approvedCount = Object.keys(myProgress.completed).length;
  const submittedToday = mySubmissions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const QUESTS: DailyQuest[] = [
    {
      id: "q-submit-project",
      title: "Ship One Project",
      description: "Submit any mission assignment for review today.",
      icon: Target,
      neurons: 20,
      xp: 50,
      current: Math.min(submittedToday, 1),
      target: 1,
    },
    {
      id: "q-first-approval",
      title: "Get Work Approved",
      description: "Have at least one approved project in your portfolio.",
      icon: Sparkles,
      neurons: 30,
      xp: 75,
      current: Math.min(approvedCount, 1),
      target: 1,
    },
    {
      id: "q-streak-defender",
      title: "Defend the Streak",
      description: "Show up and make progress on any mission today.",
      icon: Flame,
      neurons: 15,
      xp: 40,
      current: 1,
      target: 1,
    },
  ];

  const handleClaim = (q: DailyQuest) => {
    playCoinSound();
    setTimeout(() => playXpSound(), 200);
    claimDailyMission(q.id, q.neurons, q.xp);
  };

  return (
    <Modal open={open} onClose={onClose} title="Daily Quests">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-brand/30 bg-brand/10 p-3">
          <div className="flex items-center gap-2.5">
            <Gift className="h-5 w-5 text-brand" />
            <div className="text-xs font-semibold text-zinc-200">Quests refresh daily at midnight</div>
          </div>
          <span className="chip text-[10px]">3 active</span>
        </div>

        <div className="space-y-3">
          {QUESTS.map((q) => {
            const isReady = q.current >= q.target;
            const isClaimed = !!myProgress.claimedMissions?.[q.id];
            const Icon = q.icon;

            return (
              <div key={q.id} className="glass flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{q.title}</h4>
                    <p className="text-xs text-zinc-400">{q.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="chip text-[10px] text-accent">
                        <Hexagon className="inline h-3 w-3 fill-accent/20" /> +{q.neurons}
                      </span>
                      <span className="chip text-[10px] text-premium">
                        <Zap className="inline h-3 w-3" /> +{q.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  {isClaimed ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                      <CheckCircle2 className="h-4 w-4" /> Claimed
                    </div>
                  ) : isReady ? (
                    <button onClick={() => handleClaim(q)} className="btn-primary w-full px-4 py-2 text-xs sm:w-auto">
                      Claim Reward
                    </button>
                  ) : (
                    <div className="text-xs text-zinc-500">
                      {q.current}/{q.target} progress
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
