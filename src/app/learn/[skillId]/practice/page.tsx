"use client";

import { ArrowLeft, CheckCircle2, ChevronRight, Layers, RotateCcw, Zap } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fireConfetti } from "@/components/confetti";
import { playClickSound, playVictorySound, playXpSound } from "@/lib/sound";
import { useApp } from "@/lib/store";

export default function PracticeDeckPage() {
  const params = useParams<{ skillId: string }>();
  const { skills, currentUser, adminGrantXp } = useApp();

  const skill = skills.find((s) => s.id === params.skillId);
  if (!skill) notFound();

  // Combine questions from all 10 levels for practice deck
  const deck = skill.levels.flatMap((l) =>
    l.questions.map((q) => ({
      ...q,
      tier: l.tier,
      levelNumber: l.levelNumber,
    }))
  ).slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    playClickSound();
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (gotIt: boolean) => {
    if (gotIt) {
      playXpSound();
      setMasteredCount((prev) => prev + 1);
    } else {
      playClickSound();
    }

    setIsFlipped(false);

    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed deck!
      playVictorySound();
      fireConfetti();
      const bonusXp = (masteredCount + (gotIt ? 1 : 0)) * 10;
      if (bonusXp > 0) {
        adminGrantXp(currentUser.id, bonusXp);
      }
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setIsCompleted(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link
          href={`/learn/${skill.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {skill.title} Map
        </Link>

        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              <Layers className="h-4 w-4" /> Flashcard Recall Deck
            </div>
            <h1 className="text-xl font-bold text-white">{skill.title} Rapid Practice</h1>
          </div>
          <span className="chip border-amber-400/40 font-mono text-xs text-amber-300">
            {currentIndex + 1} / {deck.length} Cards
          </span>
        </div>

        {!isCompleted && currentCard && (
          <div className="space-y-6">
            {/* 3D Flip Card Container */}
            <div
              onClick={handleFlip}
              className="clay-card min-h-72 cursor-pointer relative p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01]"
              style={{
                boxShadow: isFlipped
                  ? `0 0 30px ${skill.color}40`
                  : undefined,
              }}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Tier {currentCard.levelNumber} · {currentCard.tier}</span>
                <span className="text-amber-400 font-bold">
                  {isFlipped ? "Answer Side" : "Tap card to flip 🔄"}
                </span>
              </div>

              <div className="my-6 text-center">
                {!isFlipped ? (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      {currentCard.prompt}
                    </h3>
                    <p className="mt-4 text-xs font-mono text-zinc-400">
                      Think of your answer, then tap to reveal key insight.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="inline-block rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 font-mono text-xs font-bold text-emerald-300 mb-3">
                      ✓ Correct Key Concept
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-emerald-200 leading-relaxed">
                      {currentCard.options[currentCard.answerIndex]}
                    </h4>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-t border-white/10 pt-4">
                <span>{skill.category}</span>
                <span>Card {currentIndex + 1} of {deck.length}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                <button
                  onClick={() => handleAnswer(false)}
                  className="neo-button p-3.5 font-mono text-xs font-bold text-rose-300 hover:text-rose-200"
                >
                  Review Later 🔁
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="btn-primary p-3.5 font-mono text-xs font-bold"
                >
                  Got It! (+10 XP) ⚡
                </button>
              </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="clay-card p-8 text-center space-y-6">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400 animate-bounce" />
            <div>
              <h2 className="text-2xl font-black text-white">Deck Completed!</h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-300">
                You mastered {masteredCount} out of {deck.length} flashcards in this session.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="chip border-violet-400/40 bg-violet-500/10 font-mono text-sm text-violet-300">
                <Zap className="h-4 w-4 inline" /> +{masteredCount * 10} XP Earned
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleRestart} className="btn-ghost flex-1 text-xs sm:text-sm">
                <RotateCcw className="h-4 w-4" /> Practice Again
              </button>
              <Link href={`/learn/${skill.id}`} className="btn-primary flex-1 text-xs sm:text-sm">
                Skill Map <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
