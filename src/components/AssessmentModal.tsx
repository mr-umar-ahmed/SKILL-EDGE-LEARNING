"use client";

import { BrainCircuit, CheckCircle2, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import type { Mission, Question } from "@/lib/types";
import { playClickSound, playVictorySound, playXpSound } from "@/lib/sound";
import { fireConfetti } from "./confetti";
import { Modal } from "./ui";

const PASS_PCT = 80;

/**
 * Knowledge-check modal — an optional MCQ inside a mission.
 * Never the completion criterion; awards +15 XP (once) at >= 80%.
 */
export function AssessmentModal({
  mission,
  open,
  onClose,
}: {
  mission: Mission;
  open: boolean;
  onClose: () => void;
}) {
  const { recordKnowledgeCheck } = useApp();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ scorePct: number; firstPass: boolean; xpEarned: number } | null>(null);

  const questions = mission.quiz;
  const q: Question | undefined = questions[idx];

  const reset = () => {
    setIdx(0);
    setCorrect(0);
    setResult(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const finish = (correctCount: number) => {
    const scorePct = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    // recordKnowledgeCheck is called exactly once per attempt — the store
    // guards repeat XP claims internally.
    const res = recordKnowledgeCheck(mission.id, scorePct);
    setResult({ scorePct, firstPass: res.firstPass, xpEarned: res.xpEarned });
    if (scorePct >= PASS_PCT) {
      playVictorySound();
      if (res.xpEarned > 0) playXpSound();
      fireConfetti();
    }
  };

  const pick = (option: number) => {
    if (!q) return;
    playClickSound();
    const nextCorrect = option === q.answerIndex ? correct + 1 : correct;
    setCorrect(nextCorrect);
    if (idx + 1 < questions.length) setIdx(idx + 1);
    else finish(nextCorrect);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        <span className="inline-flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-accent" />
          {result ? "Knowledge Check Result" : "Knowledge Check"}
        </span>
      }
    >
      {!result && q && (
        <div>
          {/* progress */}
          <div className="mb-4 flex items-center gap-3">
            <div className="progress-track h-1.5 flex-1">
              <div className="progress-fill" style={{ width: `${(idx / questions.length) * 100}%` }} />
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              {idx + 1}/{questions.length}
            </span>
          </div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            Score {PASS_PCT}%+ to earn +15 XP
          </div>
          <h3 className="mb-4 font-display text-base font-semibold leading-snug text-white">{q.prompt}</h3>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-brand/60 hover:bg-hover hover:text-white active:scale-[0.98]"
              >
                <span className="mr-2 text-xs font-bold text-zinc-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="text-center">
          {result.scorePct >= PASS_PCT ? (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <div className="mt-3 font-display text-4xl font-bold text-success">{result.scorePct}%</div>
              <div className="mt-1 text-sm text-zinc-300">You understood this mission&apos;s concepts. Nice work.</div>
              {result.xpEarned > 0 ? (
                <span className="chip mt-4 border-warning/40 bg-warning/10 text-sm text-warning">
                  <Zap className="h-4 w-4" /> +{result.xpEarned} XP earned
                </span>
              ) : (
                <div className="mt-3 text-xs text-zinc-500">
                  XP for this knowledge check was already claimed — score noted.
                </div>
              )}
              <div className="mt-2 text-xs text-zinc-500">
                Remember: the mission completes when your project submission is approved.
              </div>
              <button onClick={close} className="btn-primary mt-5 w-full">
                Back to mission
              </button>
            </>
          ) : (
            <>
              <BrainCircuit className="mx-auto h-14 w-14 text-zinc-500" />
              <div className="mt-3 font-display text-4xl font-bold text-danger">{result.scorePct}%</div>
              <div className="mt-1 text-sm text-zinc-300">
                You need {PASS_PCT}% for the XP bonus. Revisit the resources and try again — retakes are free.
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={close} className="btn-ghost flex-1">
                  Review resources
                </button>
                <button onClick={reset} className="btn-primary flex-1">
                  <RotateCcw className="h-4 w-4" /> Retake
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
