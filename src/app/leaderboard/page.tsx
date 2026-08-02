"use client";

import { Crown, Flame, Hexagon, Medal, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { AppShell } from "@/components/AppShell";
import { UserAvatar } from "@/components/UserAvatar";
import { EmptyState, NeuronBadge, PageHeader, Skeleton } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { User } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

type TabId = "XP" | "NEURONS" | "STREAK";

const TABS: { id: TabId; label: string; Icon: typeof Zap }[] = [
  { id: "XP", label: "XP", Icon: Zap },
  { id: "NEURONS", label: "Neurons", Icon: Hexagon },
  { id: "STREAK", label: "Streak", Icon: Flame },
];

const PODIUM_STYLE: Record<number, { card: string; chip: string; Icon: typeof Crown }> = {
  1: {
    card: "border-warning/60 bg-gradient-to-b from-warning/15 to-transparent",
    chip: "bg-warning/15 text-warning",
    Icon: Crown,
  },
  2: {
    card: "border-zinc-400/40 bg-gradient-to-b from-zinc-400/10 to-transparent",
    chip: "bg-zinc-400/15 text-zinc-300",
    Icon: Medal,
  },
  3: {
    card: "border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-transparent",
    chip: "bg-orange-500/15 text-orange-400",
    Icon: Medal,
  },
};

function metricOf(u: User, tab: TabId) {
  return tab === "XP" ? u.xp : tab === "NEURONS" ? u.neurons : u.streakCount;
}

function MetricValue({ user, tab, className }: { user: User; tab: TabId; className?: string }) {
  if (tab === "NEURONS") return <NeuronBadge amount={user.neurons} className={className} />;
  if (tab === "STREAK")
    return (
      <span className={cn("inline-flex items-center gap-1 font-semibold text-orange-400", className)}>
        <Flame className="h-3.5 w-3.5" />
        {fmtNum(user.streakCount)}d
      </span>
    );
  return <span className={cn("font-semibold text-brand", className)}>{fmtNum(user.xp)} XP</span>;
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-72 rounded-full" />
      <div className="grid grid-cols-3 items-end gap-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export default function LeaderboardPage() {
  const { hydrated, currentUser, state, progressFor } = useApp();
  const [tab, setTab] = useState<TabId>("XP");

  if (!hydrated) {
    return (
      <AppShell>
        <LeaderboardSkeleton />
      </AppShell>
    );
  }

  const sorted = [...state.users].sort((a, b) => metricOf(b, tab) - metricOf(a, tab) || b.xp - a.xp);
  const enoughPlayers = sorted.length >= 2;

  /* podium render order: 2nd · 1st · 3rd (1st centered and elevated) */
  const podium =
    sorted.length >= 3
      ? [
          { user: sorted[1], rank: 2 },
          { user: sorted[0], rank: 1 },
          { user: sorted[2], rank: 3 },
        ]
      : sorted.slice(0, 2).map((u, i) => ({ user: u, rank: i + 1 }));

  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        subtitle="Where builders stack up — ranked by XP, Neurons and streaks."
        icon={<Trophy className="h-5 w-5" />}
      />

      {/* tabs */}
      <div className="glass mb-6 inline-flex items-center gap-1 rounded-full p-1 animate-fade-up">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition",
              tab === id ? "nav-active-pill" : "text-zinc-400 hover:text-white"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {!enoughPlayers ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="The arena is warming up"
          text="Invite friends — the arena is warming up. Rankings appear once at least two builders are competing."
        />
      ) : (
        <>
          {/* podium */}
          <div
            className={cn(
              "grid items-end gap-3 animate-fade-up",
              podium.length === 3 ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            {podium.map(({ user: u, rank }) => {
              const style = PODIUM_STYLE[rank];
              const first = rank === 1;
              const isMe = u.id === currentUser?.id;
              return (
                <div
                  key={u.id}
                  className={cn(
                    "clay-card relative flex flex-col items-center gap-2 border px-3 pb-4 text-center",
                    style.card,
                    first ? "pt-6 sm:pt-8" : "pt-4 sm:pt-5",
                    isMe && "ring-1 ring-brand/60"
                  )}
                >
                  <span
                    className={cn(
                      "absolute -top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                      style.chip
                    )}
                  >
                    <style.Icon className="h-3 w-3" /> #{rank}
                  </span>
                  <UserAvatar
                    user={u}
                    size={first ? 72 : 56}
                    className={cn(first && "ring-2 ring-warning/60 ring-offset-2 ring-offset-card")}
                  />
                  <div className="w-full min-w-0">
                    <div
                      className={cn(
                        "truncate font-display font-bold text-white",
                        first ? "text-base sm:text-lg" : "text-sm"
                      )}
                    >
                      {u.name}
                    </div>
                    {u.title && <div className="truncate text-[10px] text-zinc-500">{u.title}</div>}
                  </div>
                  <MetricValue user={u} tab={tab} className="text-sm" />
                  <span className="text-[10px] font-semibold text-zinc-500">
                    {fmtNum(Object.keys(progressFor(u.id).completed).length)} projects
                  </span>
                </div>
              );
            })}
          </div>

          {/* full ranking */}
          <div className="clay-card mt-6 overflow-hidden animate-fade-up">
            <div className="hidden items-center gap-3 border-b border-line/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 sm:flex">
              <span className="w-10 text-center">Rank</span>
              <span className="flex-1">Builder</span>
              <span className="w-24 text-right">Projects</span>
              <span className="w-28 text-right">{tab === "XP" ? "XP" : tab === "NEURONS" ? "Neurons" : "Streak"}</span>
            </div>
            <div className="divide-y divide-line/60">
              {sorted.map((u, i) => {
                const rank = i + 1;
                const isMe = u.id === currentUser?.id;
                const projects = Object.keys(progressFor(u.id).completed).length;
                return (
                  <div
                    key={u.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition",
                      isMe ? "border-l-2 border-l-brand bg-brand/10" : "hover:bg-hover/40"
                    )}
                  >
                    <span
                      className={cn(
                        "w-10 shrink-0 text-center font-display text-sm font-bold",
                        rank === 1
                          ? "text-warning"
                          : rank === 2
                            ? "text-zinc-300"
                            : rank === 3
                              ? "text-orange-400"
                              : "text-zinc-500"
                      )}
                    >
                      {rank}
                    </span>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <UserAvatar user={u} size={34} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-white">{u.name}</span>
                          {isMe && (
                            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand">
                              You
                            </span>
                          )}
                        </div>
                        {u.title && <div className="truncate text-[11px] text-zinc-500">{u.title}</div>}
                      </div>
                    </div>
                    <span className="hidden w-24 shrink-0 text-right text-xs font-semibold text-zinc-400 sm:block">
                      {fmtNum(projects)}
                    </span>
                    <span className="w-28 shrink-0 text-right text-xs">
                      <MetricValue user={u} tab={tab} className="text-xs" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <AdSlot className="mt-8" />
    </AppShell>
  );
}
