"use client";

import { Crown, Radio, Swords, Timer, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, countdownParts, fmtDateTime, fmtNum, msUntil } from "@/lib/utils";
import type { Quiz } from "@/lib/types";

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Countdown({ iso }: { iso: string }) {
  useNow();
  const { d, h, m, s } = countdownParts(msUntil(iso));
  const cell = (v: number, l: string) => (
    <div className="neo-box px-2 py-1 text-center shrink-0">
      <div className="font-mono text-xs sm:text-base font-bold text-white">{String(v).padStart(2, "0")}</div>
      <div className="text-[8px] uppercase text-zinc-400 font-mono">{l}</div>
    </div>
  );
  return (
    <div className="flex gap-1 sm:gap-1.5 shrink-0">
      {d > 0 && cell(d, "day")}
      {cell(h, "hrs")}
      {cell(m, "min")}
      {cell(s, "sec")}
    </div>
  );
}

function quizPhase(q: Quiz): "live" | "upcoming" | "ended" {
  const start = msUntil(q.startTime);
  if (q.winnersDeclared) return "ended";
  if (start > 0) return "upcoming";
  if (start > -q.durationMins * 60000) return "live";
  return "ended";
}

export default function QuizzesPage() {
  const { state } = useApp();
  useNow();
  const phases = { live: [] as Quiz[], upcoming: [] as Quiz[], ended: [] as Quiz[] };
  for (const q of state.quizzes) phases[quizPhase(q)].push(q);
  phases.upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  phases.ended.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const participants = (id: string) => state.quizEntries.filter((e) => e.quizId === id);

  const card = (q: Quiz, phase: "live" | "upcoming" | "ended") => {
    const people = participants(q.id);
    const winners = people.filter((e) => (e.prizeWonCoins ?? 0) > 0).sort((a, b) => (a.rank ?? 9) - (b.rank ?? 9));
    return (
      <Link
        key={q.id}
        href={`/quiz/${q.id}`}
        className={cn(
          "clay-card block p-4 sm:p-5 transition hover:scale-[1.01]",
          phase === "live" && "border-rose-400/50 shadow-rose-500/20"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {phase === "live" && (
                <span className="chip animate-pulse border-rose-400/50 font-mono text-rose-300">
                  <Radio className="h-3 w-3" /> LIVE
                </span>
              )}
              <span className="chip border-white/20 text-zinc-300">{q.category}</span>
            </div>
            <div className="mt-1.5 truncate font-mono text-base font-bold text-white sm:text-lg">{q.title}</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
              <span className="font-mono text-amber-300 font-bold">
                <Trophy className="mr-1 inline h-3.5 w-3.5" />
                Prize ↁ{fmtNum(q.prizePoolCoins)}
              </span>
              <span className="font-mono">{q.entryFeeCoins > 0 ? `Entry ↁ${q.entryFeeCoins}` : "FREE entry"}</span>
              <span>
                <Users className="mr-1 inline h-3.5 w-3.5 text-zinc-400" />
                {people.length} joined
              </span>
              <span>
                <Timer className="mr-1 inline h-3.5 w-3.5 text-zinc-400" />
                {q.durationMins} min
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
            {phase === "upcoming" && <Countdown iso={q.startTime} />}
            {phase === "live" && <span className="btn-primary !px-4 !py-2 text-xs sm:text-sm">Play →</span>}
          </div>
        </div>
        {phase === "upcoming" && <div suppressHydrationWarning className="mt-2 text-[11px] text-zinc-400 font-mono">Starts {fmtDateTime(q.startTime)}</div>}
        {phase === "ended" && winners.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {winners.slice(0, 3).map((w) => {
              const u = state.users.find((x) => x.id === w.userId);
              return (
                <span key={w.userId} className="chip border-amber-400/40 text-amber-300 font-mono">
                  <Crown className="h-3 w-3 text-amber-400" /> #{w.rank} {u?.name.split(" ")[0]} · +ↁ{w.prizeWonCoins}
                </span>
              );
            })}
          </div>
        )}
      </Link>
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="flex items-center gap-2 font-mono text-2xl font-bold text-white">
            <Swords className="h-6 w-6 text-amber-400" strokeWidth={1.75} /> Weekly Tournaments
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Compete live, answer fast for speed multipliers, and win EdgeCoin prize pools.
          </p>
        </div>

        {phases.live.length > 0 && (
          <div>
            <SectionTitle>🔴 Live Now</SectionTitle>
            <div className="space-y-3">{phases.live.map((q) => card(q, "live"))}</div>
          </div>
        )}
        {phases.upcoming.length > 0 && (
          <div>
            <SectionTitle>⏳ Upcoming</SectionTitle>
            <div className="space-y-3">{phases.upcoming.map((q) => card(q, "upcoming"))}</div>
          </div>
        )}
        {phases.ended.length > 0 && (
          <div>
            <SectionTitle>🏁 Completed</SectionTitle>
            <div className="space-y-3">{phases.ended.map((q) => card(q, "ended"))}</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
