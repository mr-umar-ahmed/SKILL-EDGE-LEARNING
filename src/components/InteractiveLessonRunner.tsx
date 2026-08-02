"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  HelpCircle,
  Hexagon,
  Lightbulb,
  PartyPopper,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { fireConfetti } from "@/components/confetti";
import { playClickSound, playCoinSound, playVictorySound, playXpSound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import type { GamifiedStep, MatchPair, MiniMissionData, Mission, Skill } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

interface Props {
  skill: Skill;
  mission: Mission;
  open: boolean;
  onClose: () => void;
}

export function InteractiveLessonRunner({ skill, mission, open, onClose }: Props) {
  const { recordKnowledgeCheck, adminGrantXp, adminAdjustNeurons } = useApp();

  // Generate fallback steps if mission doesn't have custom admin steps yet
  const steps: GamifiedStep[] = mission.steps?.length
    ? mission.steps
    : [
        {
          id: "step-1",
          type: "HOOK",
          title: "Curiosity Hook",
          hookText: `Imagine a world where you could finish ${mission.title} in under 5 minutes without reading a single textbook...`,
        },
        {
          id: "step-2",
          type: "STORY",
          title: "Story Card",
          storyText: mission.objective,
          storyAnalogy: `Think of ${skill.title} like building Lego blocks: each mission connects to form a real product.`,
        },
        {
          id: "step-3",
          type: "DISCOVERY",
          title: "The Discovery",
          discoveryText: mission.expectedOutcome,
        },
        {
          id: "step-4",
          type: "MINI_MISSION",
          title: "Mini Mission Activity",
          miniMission: {
            type: "MATCH_PAIRS",
            question: "Match the concepts with their real-world outcomes:",
            pairs: [
              { left: "Objective", right: mission.objective.slice(0, 30) + "..." },
              { left: "Outcome", right: mission.expectedOutcome.slice(0, 30) + "..." },
            ],
            explanation: "Great job! Understanding how objectives map to outcomes is the key pattern.",
          },
        },
        {
          id: "step-5",
          type: "REFLECTION",
          title: "Quick Reflection",
          reflectionQuestion: `In your own words, how will mastering ${mission.title} help you in the real world?`,
        },
        {
          id: "step-6",
          type: "REWARD",
          title: "Mission Victory!",
          xpReward: mission.xpReward,
          neuronReward: mission.neuronReward,
        },
      ];

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<Record<string, string>>({});
  const [fillBlankSelected, setFillBlankSelected] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!open) return null;

  const currentStep = steps[stepIndex] ?? steps[steps.length - 1];
  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);

  const handleNextStep = () => {
    playClickSound();
    setChecked(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setMatchSelectedLeft(null);

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // Victory completed
      playVictorySound();
      fireConfetti();
      recordKnowledgeCheck(mission.id, 100);
      onClose();
    }
  };

  const handleCheckMiniMission = () => {
    playClickSound();
    setChecked(true);
    const mm = currentStep.miniMission;
    if (!mm) {
      setIsCorrect(true);
      return;
    }

    if (mm.type === "MATCH_PAIRS" && mm.pairs) {
      const allMatched = mm.pairs.every((p) => completedMatches[p.left] === p.right);
      setIsCorrect(allMatched);
      if (allMatched) playXpSound();
    } else if (mm.type === "FILL_BLANKS") {
      const correct = fillBlankSelected === mm.correctAnswer;
      setIsCorrect(correct);
      if (correct) playXpSound();
    } else {
      const correct = selectedAnswer === mm.correctAnswer || selectedAnswer !== null;
      setIsCorrect(correct);
      if (correct) playXpSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-fade-up">
      <div className="relative flex h-full max-h-[680px] w-full max-w-xl flex-col justify-between rounded-3xl border border-brand/40 bg-card p-6 shadow-2xl overflow-hidden">
        {/* Top Header Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/20 text-brand">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  {skill.title} · Mission {mission.order}
                </div>
                <div className="font-display text-sm font-bold text-white">{mission.title}</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-hover hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="progress-track h-2.5">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Card Content Area */}
        <div className="my-auto py-6 space-y-6">
          {/* HOOK CARD */}
          {currentStep.type === "HOOK" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 text-brand shadow-brand">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">Curiosity Hook</div>
              <h2 className="font-display text-xl font-bold leading-relaxed text-white sm:text-2xl">
                &ldquo;{currentStep.hookText}&rdquo;
              </h2>
            </div>
          )}

          {/* STORY CARD */}
          {currentStep.type === "STORY" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
                <BookOpen className="h-4 w-4" />
                <span>Story Card</span>
              </div>
              <p className="text-base leading-relaxed text-zinc-200">{currentStep.storyText}</p>
              {currentStep.storyAnalogy && (
                <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4 text-xs text-brand font-semibold leading-relaxed">
                  💡 <strong>Analogy:</strong> {currentStep.storyAnalogy}
                </div>
              )}
            </div>
          )}

          {/* DISCOVERY CARD */}
          {currentStep.type === "DISCOVERY" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <Lightbulb className="h-4 w-4" />
                <span>Discovery</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">The Concept Revealed:</h3>
              <div className="rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-zinc-200">
                {currentStep.discoveryText}
              </div>
            </div>
          )}

          {/* MINI MISSION CARD */}
          {currentStep.type === "MINI_MISSION" && currentStep.miniMission && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
                  <Target className="h-4 w-4" />
                  <span>Mini Mission Activity</span>
                </div>
                <span className="chip border-brand/40 bg-brand/10 text-[10px] font-bold text-brand">
                  {currentStep.miniMission.type.replace(/_/g, " ")}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white">{currentStep.miniMission.question}</h3>

              {/* MATCH PAIRS */}
              {currentStep.miniMission.type === "MATCH_PAIRS" && currentStep.miniMission.pairs && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Left Column</div>
                    {currentStep.miniMission.pairs.map((p) => (
                      <button
                        key={p.left}
                        onClick={() => {
                          playClickSound();
                          setMatchSelectedLeft(p.left);
                        }}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left text-xs font-bold transition",
                          matchSelectedLeft === p.left
                            ? "border-brand bg-brand/20 text-brand"
                            : completedMatches[p.left]
                            ? "border-success bg-success/15 text-success"
                            : "border-line bg-surface text-zinc-300"
                        )}
                      >
                        {p.left}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Right Column</div>
                    {currentStep.miniMission.pairs.map((p) => (
                      <button
                        key={p.right}
                        onClick={() => {
                          if (!matchSelectedLeft) return;
                          playClickSound();
                          setCompletedMatches((prev) => ({ ...prev, [matchSelectedLeft]: p.right }));
                          setMatchSelectedLeft(null);
                        }}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left text-xs font-bold transition",
                          Object.values(completedMatches).includes(p.right)
                            ? "border-success bg-success/15 text-success"
                            : "border-line bg-surface text-zinc-300"
                        )}
                      >
                        {p.right}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SCENARIO / MULTIPLE CHOICE */}
              {(currentStep.miniMission.type === "SCENARIO" || currentStep.miniMission.type === "PREDICT") &&
                currentStep.miniMission.options && (
                  <div className="space-y-2">
                    {currentStep.miniMission.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          playClickSound();
                          setSelectedAnswer(i);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs font-semibold transition",
                          selectedAnswer === i
                            ? "border-brand bg-brand/20 text-brand font-bold"
                            : "border-line bg-surface text-zinc-300 hover:border-brand/40"
                        )}
                      >
                        <span>{opt}</span>
                        {selectedAnswer === i && <Check className="h-4 w-4 text-brand" />}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* REFLECTION CARD */}
          {currentStep.type === "REFLECTION" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-warning">
                <Flame className="h-4 w-4 text-warning" />
                <span>Reflection & Active Recall</span>
              </div>
              <h3 className="font-display text-base font-bold text-white">{currentStep.reflectionQuestion}</h3>
              <textarea
                rows={3}
                value={userReflection}
                onChange={(e) => setUserReflection(e.target.value)}
                placeholder="Type your reflection in your own words..."
                className="input-dark text-xs"
              />
            </div>
          )}

          {/* REWARD CARD */}
          {currentStep.type === "REWARD" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand via-brand-bright to-brand-deep text-white shadow-[0_0_40px_rgba(232,80,2,0.6)] animate-bounce">
                <Trophy className="h-10 w-10" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-brand">Mission Victory!</div>
                <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Concept Mastered</h2>
              </div>
              <div className="flex justify-center gap-3">
                <span className="chip border-warning/40 bg-warning/10 px-4 py-2 text-sm font-bold text-warning">
                  <Zap className="h-4 w-4" /> +{fmtNum(mission.xpReward)} XP
                </span>
                <span className="chip border-accent/40 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
                  <Hexagon className="h-4 w-4 fill-accent/20" /> +{mission.neuronReward} Neurons
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="border-t border-line/80 pt-4 space-y-3">
          {currentStep.type === "MINI_MISSION" && !checked ? (
            <button onClick={handleCheckMiniMission} className="btn-primary w-full py-3 text-sm font-bold">
              Check Answer
            </button>
          ) : (
            <button onClick={handleNextStep} className="btn-primary w-full py-3 text-sm font-bold">
              {stepIndex < steps.length - 1 ? "Continue" : "Complete Mission"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {checked && (
            <div
              className={cn(
                "rounded-xl border p-3 text-xs font-bold flex items-center gap-2",
                isCorrect ? "border-success/40 bg-success/15 text-success" : "border-warning/40 bg-warning/15 text-warning"
              )}
            >
              {isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{isCorrect ? "Spot on! That's correct." : currentStep.miniMission?.explanation ?? "Great effort! Review the concept and continue."}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
