"use client";

import { ArrowLeft, Crown, Radio, Timer, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fireBigConfetti } from "@/components/confetti";
import { SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, countdownParts, fmtDateTime, fmtNum, msUntil } from "@/lib/utils";

export default function QuizRunnerPage() {
  const params = useParams<{ quizId: string }>();
  const { state, currentUser, joinQuiz, submitQuizScore } = useApp();
  const quiz = state.quizzes.find((q) => q.id === params.quizId);

  const [phase, setPhase] = useState<"lobby" | "playing" | "done">("lobby");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const scoreRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const q = quiz?.questions[idx];
  const perQ = quiz?.secondsPerQuestion ?? 15;

  const advance = useCallback(
    (gained: number) => {
      if (!quiz) return;
      const newScore = scoreRef.current + gained;
      scoreRef.current = newScore;
      setScore(newScore);
      if (idx + 1 < quiz.questions.length) {
        setIdx((i) => i + 1);
        setTimeLeft(perQ);
      } else {
        const finalPct = Math.round(newScore);
        submitQuizScore(quiz.id, finalPct);
        setPhase("done");
        if (finalPct >= 70) fireBigConfetti();
      }
    },
    [quiz, idx, perQ, submitQuizScore]
  );

  // per-question countdown
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      advance(0); // time out = 0 points
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, advance]);

  if (!quiz) notFound();

  const myEntry = state.quizEntries.find((e) => e.quizId === quiz.id && e.userId === currentUser.id);
  const entries = state.quizEntries
    .filter((e) => e.quizId === quiz.id && e.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const startsIn = msUntil(quiz.startTime);
  const ended = quiz.winnersDeclared || startsIn < -quiz.durationMins * 60000;
  const live = !ended && startsIn <= 0;

  const startPlaying = () => {
    setIdx(0);
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(perQ);
    setPhase("playing");
  };

  const handleJoin = () => {
    const res = joinQuiz(quiz.id);
    if (!res.ok) setJoinError(res.reason ?? "Could not join.");
    else setJoinError(null);
  };

  const pointsPerQ = 100 / quiz.questions.length;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link href="/quizzes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" /> Tournaments
        </Link>

        {/* header */}
        <div className="glass mb-5 p-5">
          <div className="flex items-center gap-2">
            {live && (
              <span className="chip animate-pulse border-rose-400/50 font-mono text-rose-300">
                <Radio className="h-3 w-3" /> LIVE
              </span>
            )}
            {ended && <span className="chip">🏁 Completed</span>}
            {!live && !ended && <span className="chip border-cyan-400/40 text-cyan-300">⏳ Upcoming</span>}
            <span className="chip">{quiz.category}</span>
          </div>
          <h1 className="mt-2 font-mono text-2xl font-bold text-zinc-50">{quiz.title}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
            <span className="font-mono text-yellow-300">
              <Trophy className="mr-1 inline h-3.5 w-3.5" /> Prize pool ↁ{fmtNum(quiz.prizePoolCoins)}
            </span>
            <span className="font-mono">{quiz.entryFeeCoins > 0 ? `Entry ↁ${quiz.entryFeeCoins}` : "FREE entry"}</span>
            <span>
              <Users className="mr-1 inline h-3.5 w-3.5" /> {state.quizEntries.filter((e) => e.quizId === quiz.id).length} players
            </span>
            <span>
              <Timer className="mr-1 inline h-3.5 w-3.5" /> {perQ}s per question · {quiz.questions.length} questions
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Prize split: 🥇 50% · 🥈 30% · 🥉 20% — paid out when the admin declares winners.
          </div>
        </div>

        {/* upcoming countdown */}
        {!live && !ended && (
          <div className="glass mb-5 flex flex-col items-center gap-3 p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">Battle begins in</div>
            <CountdownBig ms={startsIn} />
            <div className="text-xs text-zinc-500">Starts {fmtDateTime(quiz.startTime)}</div>
            {!myEntry ? (
              <button onClick={handleJoin} className="btn-primary mt-2">
                <Zap className="h-4 w-4" />
                {quiz.entryFeeCoins > 0 ? `Reserve seat · ↁ${quiz.entryFeeCoins}` : "Reserve free seat"}
              </button>
            ) : (
              <span className="chip border-emerald-400/40 text-emerald-300">✓ Seat reserved — come back at start time</span>
            )}
            {joinError && <div className="text-sm text-rose-400">{joinError}</div>}
          </div>
        )}

        {/* live — join / play */}
        {live && phase === "lobby" && (
          <div className="glass mb-5 flex flex-col items-center gap-4 p-8 text-center">
            {!myEntry ? (
              <>
                <div className="text-sm text-zinc-300">
                  The arena is open! Join now — fast answers earn up to{" "}
                  <span className="font-mono text-yellow-300">1.0×</span> speed bonus per question.
                </div>
                <button onClick={handleJoin} className="btn-primary">
                  <Zap className="h-4 w-4" />
                  {quiz.entryFeeCoins > 0 ? `Join battle · ↁ${quiz.entryFeeCoins}` : "Join free battle"}
                </button>
                {joinError && <div className="text-sm text-rose-400">{joinError}</div>}
              </>
            ) : myEntry.score === null ? (
              <>
                <div className="text-sm text-zinc-300">
                  You&apos;re in. {quiz.questions.length} questions · {perQ}s each. Answer fast — the timer eats your
                  multiplier.
                </div>
                <button onClick={startPlaying} className="btn-primary animate-pulse-glow">
                  ⚔️ Enter the arena
                </button>
              </>
            ) : (
              <div className="text-sm text-zinc-300">
                You scored <span className="font-mono text-lg font-bold text-cyan-300">{myEntry.score}</span> pts.
                Waiting for the admin to declare winners…
              </div>
            )}
          </div>
        )}

        {/* playing */}
        {live && phase === "playing" && q && (
          <div className="glass-strong mb-5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-zinc-400">
                Q{idx + 1}/{quiz.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="chip border-cyan-400/40 font-mono text-cyan-300">{Math.round(score)} pts</span>
                <span
                  className={cn(
                    "chip font-mono text-base",
                    timeLeft <= 5 ? "animate-pulse border-rose-400/60 text-rose-300" : "border-yellow-400/40 text-yellow-300"
                  )}
                >
                  <Timer className="h-3.5 w-3.5" /> {timeLeft}s
                </span>
              </div>
            </div>
            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000"
                style={{ width: `${(timeLeft / perQ) * 100}%` }}
              />
            </div>
            <h2 className="mb-4 mt-4 text-base font-semibold leading-snug text-zinc-100">{q.prompt}</h2>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const speedMult = 0.5 + 0.5 * (timeLeft / perQ);
                    advance(i === q.answerIndex ? pointsPerQ * speedMult : 0);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-violet-400/50 hover:bg-violet-500/10 active:scale-[0.98]"
                >
                  <span className="mr-2 font-mono text-xs text-zinc-500">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* finished run */}
        {phase === "done" && (
          <div className="glass mb-5 p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-yellow-400" />
            <div className="mt-2 font-mono text-4xl font-black neon-text-cyan">{Math.round(score)}</div>
            <div className="text-sm text-zinc-400">points banked</div>
            <p className="mx-auto mt-3 max-w-sm text-xs text-zinc-500">
              Your best score is locked on the leaderboard. Prizes are paid automatically when the admin declares
              winners.
            </p>
          </div>
        )}

        {/* leaderboard */}
        <SectionTitle>Leaderboard</SectionTitle>
        <div className="glass divide-y divide-white/[0.05]">
          {entries.length === 0 && <div className="p-6 text-center text-sm text-zinc-500">No scores yet — be the first.</div>}
          {entries.map((e, i) => {
            const u = state.users.find((x) => x.id === e.userId);
            const medal = ["🥇", "🥈", "🥉"][e.rank ? e.rank - 1 : i] ?? `#${i + 1}`;
            return (
              <div
                key={e.userId}
                className={cn("flex items-center gap-3 px-4 py-3", e.userId === currentUser.id && "bg-cyan-500/[0.06]")}
              >
                <span className="w-8 text-center font-mono text-sm">{medal}</span>
                <span className="text-lg">{u?.avatar}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200">
                  {u?.name} {e.userId === currentUser.id && <span className="text-cyan-400">(you)</span>}
                </span>
                {(e.prizeWonCoins ?? 0) > 0 && (
                  <span className="chip border-amber-400/40 font-mono text-amber-300">
                    <Crown className="h-3 w-3" /> +ↁ{e.prizeWonCoins}
                  </span>
                )}
                <span className="font-mono text-sm font-bold text-zinc-100">{e.score}</span>
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
  const cell = (v: number, l: string) => (
    <div className="glass min-w-16 px-3 py-2 text-center">
      <div className="font-mono text-2xl font-black text-zinc-50">{String(v).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{l}</div>
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
