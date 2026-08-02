"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Crown,
  Flag,
  Medal,
  Radio,
  Swords,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EmptyState, NeuronBadge, PageHeader, SectionTitle, SkeletonCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Quiz } from "@/lib/types";
import { cn, countdownParts, fmtDateTime, fmtNum, msUntil } from "@/lib/utils";

type Phase = "live" | "upcoming" | "ended";

/** re-render every second so countdowns and live/upcoming boundaries stay fresh */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function quizPhase(q: Quiz): Phase {
  const start = msUntil(q.startTime);
  if (q.winnersDeclared) return "ended";
  if (start > 0) return "upcoming";
  if (start > -q.durationMins * 60000) return "live";
  return "ended";
}

function Countdown({ iso }: { iso: string }) {
  const { d, h, m, s } = countdownParts(msUntil(iso));
  const cell = (v: number, label: string) => (
    <div className="min-w-[2.75rem] rounded-xl border border-line bg-base/70 px-1.5 py-1.5 text-center">
      <div className="font-mono text-sm font-bold text-white sm:text-base">{String(v).padStart(2, "0")}</div>
      <div className="text-[8px] font-semibold uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
  return (
    <div className="flex shrink-0 gap-1.5">
      {d > 0 && cell(d, "days")}
      {cell(h, "hrs")}
      {cell(m, "min")}
      {cell(s, "sec")}
    </div>
  );
}

const MEDAL_COLORS = ["#FACC15", "#A1A1AA", "#D97706"];

export default function QuizzesPage() {
  const { state, hydrated, currentUser, joinQuiz } = useApp();
  useNow();
  const [joinErrors, setJoinErrors] = useState<Record<string, string>>({});

  const phases: Record<Phase, Quiz[]> = { live: [], upcoming: [], ended: [] };
  for (const q of state.quizzes) phases[quizPhase(q)].push(q);
  phases.upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  phases.ended.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const participants = (id: string) => state.quizEntries.filter((e) => e.quizId === id);
  const joined = (id: string) => Boolean(currentUser && participants(id).some((e) => e.userId === currentUser.id));

  const handleJoin = (q: Quiz) => {
    const res = joinQuiz(q.id);
    setJoinErrors((prev) => ({ ...prev, [q.id]: res.ok ? "" : res.reason ?? "Could not join." }));
  };

  const card = (q: Quiz, phase: Phase) => {
    const people = participants(q.id);
    const isJoined = joined(q.id);
    const winners = people
      .filter((e) => (e.prizeWonNeurons ?? 0) > 0)
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
    const error = joinErrors[q.id];

    return (
      <div
        key={q.id}
        className={cn(
          "card-glow p-4 animate-fade-up sm:p-5",
          phase === "live" && "border-danger/40 shadow-[0_0_30px_-10px_rgba(239,68,68,0.35)]"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* left: identity + stats */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {phase === "live" && (
                <span className="chip animate-pulse border-danger/50 text-rose-300">
                  <Radio className="h-3 w-3" /> Live
                </span>
              )}
              {phase === "upcoming" && (
                <span className="chip border-accent/40 text-accent">
                  <CalendarClock className="h-3 w-3" /> Upcoming
                </span>
              )}
              {phase === "ended" && (
                <span className="chip">
                  <Flag className="h-3 w-3" /> Completed
                </span>
              )}
              <span className="chip">{q.category}</span>
            </div>

            <h3 className="mt-2 truncate font-display text-lg font-bold text-white sm:text-xl">{q.title}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 font-semibold text-warning">
                <Trophy className="h-3.5 w-3.5" />
                Prize pool <NeuronBadge amount={q.prizePoolNeurons} className="text-warning" />
              </span>
              {q.entryFeeNeurons > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  Entry <NeuronBadge amount={q.entryFeeNeurons} />
                </span>
              ) : (
                <span className="font-semibold text-success">Free entry</span>
              )}
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {fmtNum(people.length)} joined
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" /> {q.durationMins} min
              </span>
            </div>
          </div>

          {/* right: countdown + actions */}
          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
            {phase === "upcoming" && <Countdown iso={q.startTime} />}
            <div className="flex items-center gap-2">
              {phase !== "ended" && !isJoined && (
                <button onClick={() => handleJoin(q)} className="btn-primary !px-4 !py-2 text-xs sm:text-sm">
                  <Zap className="h-4 w-4" />
                  {q.entryFeeNeurons > 0 ? `Join · ${fmtNum(q.entryFeeNeurons)} Neurons` : "Join free"}
                </button>
              )}
              {phase === "live" && isJoined && (
                <Link href={`/quiz/${q.id}`} className="btn-primary animate-pulse-glow !px-4 !py-2 text-xs sm:text-sm">
                  <Swords className="h-4 w-4" /> Enter Arena
                </Link>
              )}
              {phase === "upcoming" && isJoined && (
                <span className="chip border-success/40 text-success">
                  <CheckCircle2 className="h-3 w-3" /> Seat reserved
                </span>
              )}
              <Link
                href={`/quiz/${q.id}`}
                className="btn-ghost !px-3 !py-2 text-xs sm:text-sm"
                aria-label={`Open ${q.title} lobby`}
              >
                {phase === "ended" ? "Results" : "Lobby"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {error && <div className="mt-2 text-xs font-semibold text-danger">{error}</div>}

        {phase === "upcoming" && (
          <div className="mt-2 text-[11px] text-zinc-500" suppressHydrationWarning>
            Starts {fmtDateTime(q.startTime)}
          </div>
        )}

        {/* winners podium */}
        {phase === "ended" && q.winnersDeclared && winners.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
            {winners.slice(0, 3).map((w, i) => {
              const u = state.users.find((x) => x.id === w.userId);
              const rank = w.rank ?? i + 1;
              const color = MEDAL_COLORS[rank - 1] ?? "#9CA3AF";
              return (
                <span key={w.userId} className="chip" style={{ borderColor: `${color}66`, color }}>
                  {rank === 1 ? <Crown className="h-3 w-3" /> : <Medal className="h-3 w-3" />}
                  #{rank} {u?.name.split(" ")[0] ?? "Player"}
                  <NeuronBadge amount={w.prizeWonNeurons ?? 0} size={12} className="!text-inherit" />
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          icon={<Swords className="h-5 w-5" />}
          title="Tournament Arena"
          subtitle="Compete live against other builders. Answer fast for speed bonuses and win Neuron prize pools."
          action={
            currentUser ? (
              <span className="header-chip-btn">
                Balance <NeuronBadge amount={currentUser.neurons} />
              </span>
            ) : undefined
          }
        />

        {!hydrated ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : state.quizzes.length === 0 ? (
          <EmptyState
            icon={<Swords className="h-10 w-10" />}
            title="No tournaments yet"
            text="New tournaments are announced regularly. Check back soon — or keep shipping missions to stack Neurons for entry fees."
          />
        ) : (
          <>
            {phases.live.length > 0 && (
              <section>
                <SectionTitle>Live now</SectionTitle>
                <div className="space-y-4">{phases.live.map((q) => card(q, "live"))}</div>
              </section>
            )}
            {phases.upcoming.length > 0 && (
              <section>
                <SectionTitle>Upcoming</SectionTitle>
                <div className="space-y-4">{phases.upcoming.map((q) => card(q, "upcoming"))}</div>
              </section>
            )}
            {phases.ended.length > 0 && (
              <section>
                <SectionTitle>Past tournaments</SectionTitle>
                <div className="space-y-4">{phases.ended.map((q) => card(q, "ended"))}</div>
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
