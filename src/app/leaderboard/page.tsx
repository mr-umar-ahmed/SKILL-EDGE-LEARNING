"use client";

import {
  Award,
  Crown,
  Flame,
  Medal,
  Search,
  Shield,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { cn, fmtNum, levelForXp } from "@/lib/utils";

type SortTab = "xp" | "coins" | "streak" | "certs";

export default function LeaderboardPage() {
  const { state, currentUser, skills } = useApp();
  const [tab, setTab] = useState<SortTab>("xp");
  const [query, setQuery] = useState("");

  const leaderboardData = useMemo(() => {
    return state.users.map((u) => {
      const userProgress = state.progress[u.id] || { completed: {}, premiumUnlocks: {} };
      const certsCount = state.certificates.filter((c) => c.userId === u.id).length;
      const completedCount = Object.keys(userProgress.completed).length;

      return {
        ...u,
        certsCount,
        completedCount,
        level: levelForXp(u.xp),
      };
    });
  }, [state.users, state.progress, state.certificates]);

  const sortedData = useMemo(() => {
    const copy = [...leaderboardData];
    if (tab === "xp") copy.sort((a, b) => b.xp - a.xp);
    if (tab === "coins") copy.sort((a, b) => b.edgeCoins - a.edgeCoins);
    if (tab === "streak") copy.sort((a, b) => b.streakCount - a.streakCount);
    if (tab === "certs") copy.sort((a, b) => b.certsCount - a.certsCount);
    return copy;
  }, [leaderboardData, tab]);

  const filteredData = useMemo(() => {
    if (!query.trim()) return sortedData;
    const q = query.toLowerCase();
    return sortedData.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [sortedData, query]);

  const topThree = sortedData.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                <Trophy className="h-4 w-4" /> Global Hall of Fame
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Skill Edge Leaderboard
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Compete with top skill earners across the nation for glory, rank, and tournament bragging rights.
              </p>
            </div>

            {/* Sort Filter Tabs */}
            <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1">
              <button
                onClick={() => setTab("xp")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
                  tab === "xp" ? "bg-violet-500/20 text-violet-300 shadow-inner" : "text-zinc-400 hover:text-white"
                )}
              >
                <Zap className="h-3.5 w-3.5" /> Total XP
              </button>
              <button
                onClick={() => setTab("coins")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
                  tab === "coins" ? "bg-yellow-500/20 text-yellow-300 shadow-inner" : "text-zinc-400 hover:text-white"
                )}
              >
                <Wallet className="h-3.5 w-3.5" /> Coins
              </button>
              <button
                onClick={() => setTab("streak")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
                  tab === "streak" ? "bg-orange-500/20 text-orange-300 shadow-inner" : "text-zinc-400 hover:text-white"
                )}
              >
                <Flame className="h-3.5 w-3.5" /> Streak
              </button>
              <button
                onClick={() => setTab("certs")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
                  tab === "certs" ? "bg-amber-500/20 text-amber-300 shadow-inner" : "text-zinc-400 hover:text-white"
                )}
              >
                <Award className="h-3.5 w-3.5" /> Certs
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Cyber Podium */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* #2 Rank */}
          {topThree[1] && (
            <div className="glass order-2 flex flex-col items-center justify-between rounded-3xl p-6 text-center border-slate-400/30 sm:order-1">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 text-4xl border border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)]">
                  {topThree[1].avatar}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-300 p-1 text-black">
                  <Medal className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="chip border-slate-400/30 font-mono text-[10px] text-slate-300 mb-1">Rank #2</div>
                <h3 className="font-bold text-white">{topThree[1].name}</h3>
                <div className="font-mono text-xs text-slate-400">{topThree[1].title || "Prompt Architect"}</div>
              </div>
              <div className="mt-4 w-full rounded-2xl bg-slate-500/10 p-3 font-mono text-xs font-bold text-slate-300">
                {tab === "xp" && `${fmtNum(topThree[1].xp)} XP`}
                {tab === "coins" && `ↁ ${fmtNum(topThree[1].edgeCoins)}`}
                {tab === "streak" && `${topThree[1].streakCount} Days`}
                {tab === "certs" && `${topThree[1].certsCount} Certs`}
              </div>
            </div>
          )}

          {/* #1 Rank Sovereign Podium */}
          {topThree[0] && (
            <div className="glass-strong order-1 flex flex-col items-center justify-between rounded-3xl p-6 text-center border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] sm:order-2 sm:-mt-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-900 text-5xl border-2 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)]">
                  {topThree[0].avatar}
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 p-1.5 text-black shadow-lg">
                  <Crown className="h-5 w-5 fill-black" />
                </div>
              </div>
              <div className="mt-4">
                <div className="chip border-yellow-400/40 bg-yellow-400/10 font-mono text-xs font-bold text-yellow-300 mb-1">
                  👑 Sovereign #1
                </div>
                <h3 className="text-lg font-bold text-white">{topThree[0].name}</h3>
                <div className="font-mono text-xs text-yellow-400">{topThree[0].title || "Sovereign Master"}</div>
              </div>
              <div className="mt-4 w-full rounded-2xl bg-yellow-500/15 p-3 font-mono text-sm font-black text-yellow-300">
                {tab === "xp" && `${fmtNum(topThree[0].xp)} XP`}
                {tab === "coins" && `ↁ ${fmtNum(topThree[0].edgeCoins)}`}
                {tab === "streak" && `${topThree[0].streakCount} Days`}
                {tab === "certs" && `${topThree[0].certsCount} Certs`}
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {topThree[2] && (
            <div className="glass order-3 flex flex-col items-center justify-between rounded-3xl p-6 text-center border-amber-700/30 sm:order-3">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 text-4xl border border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                  {topThree[2].avatar}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 p-1 text-black">
                  <Medal className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="chip border-amber-600/30 font-mono text-[10px] text-amber-400 mb-1">Rank #3</div>
                <h3 className="font-bold text-white">{topThree[2].name}</h3>
                <div className="font-mono text-xs text-amber-500/80">{topThree[2].title || "AI Strategist"}</div>
              </div>
              <div className="mt-4 w-full rounded-2xl bg-amber-600/10 p-3 font-mono text-xs font-bold text-amber-400">
                {tab === "xp" && `${fmtNum(topThree[2].xp)} XP`}
                {tab === "coins" && `ↁ ${fmtNum(topThree[2].edgeCoins)}`}
                {tab === "streak" && `${topThree[2].streakCount} Days`}
                {tab === "certs" && `${topThree[2].certsCount} Certs`}
              </div>
            </div>
          )}
        </div>

        {/* Full Ranking Table */}
        <div className="glass rounded-3xl p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-bold text-white">🏆 Full Ranking Standings</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search learner..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] font-mono text-zinc-500 uppercase">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Learner</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Streak</th>
                  <th className="pb-3">Coins</th>
                  <th className="pb-3 pr-2 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredData.map((u, idx) => {
                  const rank = sortedData.findIndex((item) => item.id === u.id) + 1;
                  const isMe = u.id === currentUser.id;

                  return (
                    <tr
                      key={u.id}
                      className={cn(
                        "transition hover:bg-white/[0.04]",
                        isMe && "bg-cyan-500/10 font-medium"
                      )}
                    >
                      <td className="py-3.5 pl-2 font-mono font-bold">
                        {rank === 1 && <span className="text-yellow-400">🥇 #1</span>}
                        {rank === 2 && <span className="text-slate-300">🥈 #2</span>}
                        {rank === 3 && <span className="text-amber-500">🥉 #3</span>}
                        {rank > 3 && <span className="text-zinc-500">#{rank}</span>}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{u.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{u.name}</span>
                              {isMe && <span className="chip border-cyan-400/40 text-[10px] text-cyan-300">You</span>}
                            </div>
                            <div className="font-mono text-[10px] text-zinc-500">{u.title || "Learner"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-violet-300">LVL {u.level}</td>
                      <td className="py-3.5 font-mono text-orange-400">🔥 {u.streakCount}d</td>
                      <td className="py-3.5 font-mono text-yellow-300">ↁ {fmtNum(u.edgeCoins)}</td>
                      <td className="py-3.5 pr-2 text-right font-mono font-bold text-cyan-300">
                        {fmtNum(u.xp)} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
