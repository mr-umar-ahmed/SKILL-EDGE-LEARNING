"use client";

import { Award, CheckCircle2, ChevronRight, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CompleteLevelResult } from "@/lib/store";
import type { Level, Question, Skill } from "@/lib/types";
import { fmtNum } from "@/lib/utils";
import { fireBigConfetti, fireConfetti } from "./confetti";
import { Modal } from "./ui";

export function AssessmentModal({
  open,
  onClose,
  skill,
  level,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  skill: Skill;
  level: Level;
  onSubmit: (scorePct: number) => CompleteLevelResult;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; res: CompleteLevelResult } | null>(null);
  const questions = level.questions;
  const q: Question | undefined = questions[idx];

  const reset = () => {
    setIdx(0);
    setAnswers({});
    setResult(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const finish = (finalAnswers: Record<string, number>) => {
    const correct = questions.filter((qq) => finalAnswers[qq.id] === qq.answerIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    const res = onSubmit(score);
    setResult({ score, res });
    if (res.passed) {
      if (res.certificate) fireBigConfetti();
      else fireConfetti();
    }
  };

  const pick = (option: number) => {
    if (!q) return;
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
    if (idx + 1 < questions.length) setIdx(idx + 1);
    else finish(next);
  };

  return (
    <Modal open={open} onClose={close} title={result ? "Assessment Result" : `⚔️ Tier ${level.levelNumber} Assessment`}>
      {!result && q && (
        <div>
          {/* progress */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(idx / questions.length) * 100}%`, background: skill.color }}
              />
            </div>
            <span className="font-mono text-xs text-zinc-400">
              {idx + 1}/{questions.length}
            </span>
          </div>
          <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Pass mark: {level.minPassScore}%
          </div>
          <h3 className="mb-4 text-base font-semibold leading-snug text-zinc-100">{q.prompt}</h3>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 active:scale-[0.98]"
              >
                <span className="mr-2 font-mono text-xs text-zinc-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="text-center">
          {result.res.passed ? (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
              <div className="mt-3 font-mono text-3xl font-black text-emerald-400">{result.score}%</div>
              <div className="mt-1 text-sm text-zinc-300">
                Tier {level.levelNumber} cleared — <span className="font-semibold">{level.tier}</span> rank earned!
              </div>
              {result.res.firstPass ? (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="chip animate-coin-pop border-yellow-400/40 font-mono text-base text-yellow-300">
                    +ↁ{result.res.coinsEarned}
                  </span>
                  <span className="chip border-violet-400/40 font-mono text-base text-violet-300">
                    +{fmtNum(result.res.xpEarned)} XP
                  </span>
                </div>
              ) : (
                <div className="mt-3 text-xs text-zinc-500">Score updated — rewards were already claimed for this level.</div>
              )}
              {result.res.certificate && (
                <Link
                  href={`/certificate/${result.res.certificate.id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
                >
                  <Award className="h-5 w-5" /> Certificate unlocked — view & download!
                </Link>
              )}
              <div className="mt-5 flex gap-2">
                <button onClick={close} className="btn-ghost flex-1">
                  Back to mission
                </button>
                {level.levelNumber < 10 ? (
                  <Link href={`/learn/${skill.id}/level-${level.levelNumber + 1}`} className="btn-primary flex-1" onClick={reset}>
                    Next level <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link href={`/learn/${skill.id}`} className="btn-primary flex-1" onClick={reset}>
                    Skill map
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-14 w-14 text-rose-400" />
              <div className="mt-3 font-mono text-3xl font-black text-rose-400">{result.score}%</div>
              <div className="mt-1 text-sm text-zinc-300">
                You need {level.minPassScore}% to clear this tier. Review the mission and strike again.
              </div>
              <button onClick={reset} className="btn-primary mt-5 w-full">
                <RotateCcw className="h-4 w-4" /> Retake assessment
              </button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
