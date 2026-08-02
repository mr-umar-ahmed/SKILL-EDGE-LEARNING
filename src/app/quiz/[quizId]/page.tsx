"use client";

import {
  ArrowLeft,
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
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fireBigConfetti, fireConfetti } from "@/components/confetti";
import { UserAvatar } from "@/components/UserAvatar";
import { NeuronBadge, ProgressBar, ProgressRing, SectionTitle, Skeleton, SkeletonCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, countdownParts, fmtDateTime, fmtNum, msUntil } from "@/lib/utils";

const MEDAL_COLORS = ["#FACC15", "#A1A1AA", "#D97706"];

export default function QuizRunnerPage() {
  const params = useParams<{ quizId: string }>();
  const { state, hydrated, currentUser, joinQuiz, submitQuizScore } = useApp();
  const quiz = state.quizzes.find((q) => q.id === params.quizId);

  const [phase, setPhase] = useState<"lobby" | "playing" | "done">("lobby");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [, setNow] = useState(() => Date.now());
  const scoreRef = useRef(0);

  /* tick every second so countdowns and the live window stay fresh */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const q = quiz?.questions[idx];
  const perQ = quiz?.secondsPerQuestion ?? 15;
  const totalQ = quiz?.questions.length ?? 0;
  const pointsPerQ = totalQ > 0 ? 100 / totalQ : 0;

  const advance = useCallback(
    (gained: number) => {
      if (!quiz) return;
      const newScore = scoreRef.current + gained;
      scoreRef.current = newScore;
      setScore(newScore);
      setSelected(null);
      if (idx + 1 < quiz.questions.length) {
        setIdx((i) => i + 1);
        setTimeLeft(perQ);
      } else {
        const finalPct = Math.round(newScore);
        const bestOther = state.quizEntries
          .filter((e) => e.quizId === quiz.id && e.score !== null && e.userId !== currentUser?.id)
          .reduce((mx, e) => Math.max(mx, e.score ?? 0), 0);
        submitQuizScore(quiz.id, finalPct);
        setPhase("done");
        if (finalPct > 0 && finalPct >= bestOther) fireBigConfetti();
        else if (finalPct >= 70) fireConfetti();
      }
    },
    [quiz, idx, perQ, submitQuizScore, state.quizEntries, currentUser?.id]
  );

  /* per-question countdown — paused while an answer is locking in */
  useEffect(() => {
    if (phase !== "playing" || selected !== null) return;
    if (timeLeft <= 0) {
      advance(0); // time out = 0 points
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, selected, advance]);

  /* skeleton until localStorage state lands — admin-created quizzes only exist after hydration */
  if (!hydrated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-5 w-32" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    );
  }
  if (!quiz) notFound();

  const myEntry = currentUser
    ? state.quizEntries.find((e) => e.quizId === quiz.id && e.userId === currentUser.id)
    : undefined;
  const entries = state.quizEntries
    .filter((e) => e.quizId === quiz.id && e.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const players = state.quizEntries.filter((e) => e.quizId === quiz.id).length;
  const startsIn = msUntil(quiz.startTime);
  const ended = quiz.winnersDeclared || startsIn < -quiz.durationMins * 60000;
  const live = !ended && startsIn <= 0;
  const myRank = currentUser ? entries.findIndex((e) => e.userId === currentUser.id) + 1 : 0;
  const speedMult = 0.5 + 0.5 * (timeLeft / perQ);

  const startPlaying = () => {
    setIdx(0);
    scoreRef.current = 0;
    setScore(0);
    setSelected(null);
    setTimeLeft(perQ);
    setPhase("playing");
  };

  const handleJoin = () => {
    const res = joinQuiz(quiz.id);
    setJoinError(res.ok ? null : res.reason ?? "Could not join.");
  };

  const choose = (i: number) => {
    if (!q || selected !== null) return;
    setSelected(i);
    const gained = i === q.answerIndex ? pointsPerQ * speedMult : 0;
    window.setTimeout(() => advance(gained), 450);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          href="/quizzes"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Tournaments
        </Link>

        {/* header */}
        <div className="clay-card mb-5 p-5 animate-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            {live && (
              <span className="chip animate-pulse border-danger/50 text-rose-300">
                <Radio className="h-3 w-3" /> Live
              </span>
            )}
            {ended && (
              <span className="chip">
                <Flag className="h-3 w-3" /> Completed
              </span>
            )}
            {!live && !ended && (
              <span className="chip border-accent/40 text-accent">
                <CalendarClock className="h-3 w-3" /> Upcoming
              </span>
            )}
            <span className="chip">{quiz.category}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">{quiz.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 font-semibold text-warning">
              <Trophy className="h-3.5 w-3.5" />
              Prize pool <NeuronBadge amount={quiz.prizePoolNeurons} className="text-warning" />
            </span>
            {quiz.entryFeeNeurons > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                Entry <NeuronBadge amount={quiz.entryFeeNeurons} />
              </span>
            ) : (
              <span className="font-semibold text-success">Free entry</span>
            )}
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {fmtNum(players)} players
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" /> {perQ}s per question · {totalQ} questions
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Medal className="h-3.5 w-3.5 text-warning" />
            Prize split 50% / 30% / 20% — paid out when winners are declared.
          </div>
        </div>

        {/* upcoming: countdown + reserve */}
        {!live && !ended && (
          <div className="clay-card mb-5 flex flex-col items-center gap-4 p-8 animate-fade-up">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Arena opens in</div>
            <CountdownBig ms={startsIn} />
            <div className="text-xs text-zinc-500" suppressHydrationWarning>
              Starts {fmtDateTime(quiz.startTime)}
            </div>
            {!myEntry ? (
              <>
                <button onClick={handleJoin} className="btn-primary mt-1">
                  <Zap className="h-4 w-4" />
                  {quiz.entryFeeNeurons > 0 ? `Reserve seat · ${fmtNum(quiz.entryFeeNeurons)} Neurons` : "Reserve free seat"}
                </button>
                {joinError && <div className="text-sm font-semibold text-danger">{joinError}</div>}
              </>
            ) : (
              <span className="chip border-success/40 text-success">
                <CheckCircle2 className="h-3 w-3" /> Seat reserved — come back at start time
              </span>
            )}
          </div>
        )}

        {/* live: lobby */}
        {live && phase === "lobby" && (
          <div className="clay-card mb-5 flex flex-col items-center gap-4 p-8 text-center animate-fade-up">
            {!myEntry ? (
              <>
                <div className="max-w-sm text-sm text-zinc-300">
                  The arena is open. Join now — faster answers earn up to a{" "}
                  <span className="font-semibold text-accent">1.0x speed bonus</span> per question.
                </div>
                <button onClick={handleJoin} className="btn-primary">
                  <Zap className="h-4 w-4" />
                  {quiz.entryFeeNeurons > 0 ? `Join battle · ${fmtNum(quiz.entryFeeNeurons)} Neurons` : "Join free battle"}
                </button>
                {joinError && <div className="text-sm font-semibold text-danger">{joinError}</div>}
              </>
            ) : myEntry.score === null ? (
              <>
                <div className="max-w-sm text-sm text-zinc-300">
                  You are in. {totalQ} questions · {perQ}s each. Answer fast — the timer eats your multiplier.
                </div>
                <button onClick={startPlaying} className="btn-primary animate-pulse-glow">
                  <Swords className="h-4 w-4" /> Enter the arena
                </button>
              </>
            ) : (
              <div className="text-sm text-zinc-300">
                You scored <span className="font-display text-lg font-bold text-accent">{myEntry.score}</span> pts.
                Waiting for winners to be declared…
              </div>
            )}
          </div>
        )}

        {/* playing */}
        {live && phase === "playing" && q && (
          <div className="glass-strong mb-5 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Question {idx + 1} of {totalQ}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="chip border-accent/40 text-accent">{Math.round(score)} pts</span>
                  <span className="chip border-warning/40 text-warning">
                    <Zap className="h-3 w-3" /> Speed x{speedMult.toFixed(2)}
                  </span>
                </div>
              </div>
              <ProgressRing
                progress={timeLeft / perQ}
                size={60}
                stroke={5}
                color={timeLeft <= 5 ? "#EF4444" : "#06B6D4"}
              >
                <span
                  className={cn(
                    "font-display text-lg font-bold",
                    timeLeft <= 5 ? "animate-pulse text-danger" : "text-white"
                  )}
                >
                  {timeLeft}
                </span>
              </ProgressRing>
            </div>

            <ProgressBar progress={idx / totalQ} height={6} className="mb-5" />

            <div key={idx} className="animate-scale-in">
              <h2 className="mb-4 font-display text-base font-semibold leading-snug text-white sm:text-lg">
                {q.prompt}
              </h2>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectPick = isSelected && i === q.answerIndex;
                  const isWrongPick = isSelected && i !== q.answerIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={selected !== null}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left text-sm transition active:scale-[0.99] disabled:cursor-default",
                        !isSelected &&
                          "border-line bg-base/40 text-zinc-300 hover:border-brand/60 hover:bg-brand/10 hover:text-white",
                        isCorrectPick && "border-success bg-success/10 text-success",
                        isWrongPick && "border-danger bg-danger/10 text-danger"
                      )}
                    >
                      <span className="mr-2.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-line bg-card text-[11px] font-bold text-zinc-400">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* finished run */}
        {phase === "done" && (
          <div className="clay-card mb-5 p-8 text-center animate-scale-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-warning/40 bg-warning/10">
              <Trophy className="h-8 w-8 text-warning" />
            </div>
            <div className="mt-3 font-display text-5xl font-black text-white">{Math.round(score)}</div>
            <div className="mt-1 text-sm text-zinc-400">points banked</div>
            {myRank > 0 && (
              <div className="mt-3 inline-flex items-center gap-2">
                <span
                  className={cn(
                    "chip",
                    myRank === 1 ? "border-warning/50 text-warning" : "border-accent/40 text-accent"
                  )}
                >
                  {myRank === 1 ? <Crown className="h-3 w-3" /> : <Medal className="h-3 w-3" />}
                  Rank #{myRank} of {entries.length}
                </span>
              </div>
            )}
            <p className="mx-auto mt-3 max-w-sm text-xs text-zinc-500">
              Your best score is locked on the leaderboard. Prizes are paid automatically when winners are declared.
            </p>
            <Link href="/quizzes" className="btn-ghost mt-4 !px-4 !py-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to tournaments
            </Link>
          </div>
        )}

        {/* leaderboard */}
        <SectionTitle>Leaderboard</SectionTitle>
        <div className="clay-card divide-y divide-line/60 overflow-hidden">
          {entries.length === 0 && (
            <div className="p-6 text-center text-sm text-zinc-500">No scores yet — be the first to enter the arena.</div>
          )}
          {entries.map((e, i) => {
            const u = state.users.find((x) => x.id === e.userId);
            const rank = e.rank ?? i + 1;
            const medalColor = rank <= 3 ? MEDAL_COLORS[rank - 1] : undefined;
            const isMe = currentUser?.id === e.userId;
            return (
              <div key={e.userId} className={cn("flex items-center gap-3 px-4 py-3", isMe && "bg-brand/[0.07]")}>
                <span className="flex w-8 shrink-0 items-center justify-center">
                  {medalColor ? (
                    rank === 1 ? (
                      <Crown style={{ color: medalColor, width: 18, height: 18 }} />
                    ) : (
                      <Medal style={{ color: medalColor, width: 18, height: 18 }} />
                    )
                  ) : (
                    <span className="font-mono text-xs text-zinc-500">#{rank}</span>
                  )}
                </span>
                <UserAvatar user={u} size={30} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200">
                  {u?.name ?? "Player"} {isMe && <span className="text-accent">(you)</span>}
                </span>
                {(e.prizeWonNeurons ?? 0) > 0 && (
                  <NeuronBadge amount={e.prizeWonNeurons ?? 0} className="text-warning" />
                )}
                <span className="font-display text-sm font-bold text-white">{e.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function CountdownBig({ ms }: { ms: number }) {
  const { d, h, m, s } = countdownParts(ms);
  const cell = (v: number, label: string) => (
    <div className="min-w-16 rounded-xl border border-line bg-base/70 px-3 py-2 text-center">
      <div className="font-mono text-2xl font-black text-white">{String(v).padStart(2, "0")}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
    </div>
  );
  return (
    <div className="flex gap-2">
      {d > 0 && cell(d, "days")}
      {cell(h, "hours")}
      {cell(m, "mins")}
      {cell(s, "secs")}
    </div>
  );
}
