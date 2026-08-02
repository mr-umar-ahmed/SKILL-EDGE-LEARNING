"use client";

import React, { useState } from "react";
import {
  Plus,
  Save,
  Sparkles,
  Swords,
  Target,
  Trash2,
  Zap,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Hexagon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import type { GamifiedStep, MiniMissionType, Mission, Skill } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AdminBuilderTab() {
  const { skills, adminSaveSkill } = useApp();
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id ?? "");
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");

  const currentSkill = skills.find((s: Skill) => s.id === selectedSkillId) ?? skills[0];
  const currentMission = currentSkill?.missions.find((m: Mission) => m.id === selectedMissionId) ?? currentSkill?.missions[0];

  // Local state for micro-lesson builder
  const [hookText, setHookText] = useState(
    currentMission?.steps?.find((s: GamifiedStep) => s.type === "HOOK")?.hookText ??
      `Imagine a world where you could finish ${currentMission?.title ?? "this skill"} in under 5 minutes...`
  );
  const [storyText, setStoryText] = useState(
    currentMission?.steps?.find((s: GamifiedStep) => s.type === "STORY")?.storyText ?? currentMission?.objective ?? ""
  );
  const [discoveryText, setDiscoveryText] = useState(
    currentMission?.steps?.find((s: GamifiedStep) => s.type === "DISCOVERY")?.discoveryText ?? currentMission?.expectedOutcome ?? ""
  );
  const [miniMissionType, setMiniMissionType] = useState<MiniMissionType>(
    currentMission?.steps?.find((s: GamifiedStep) => s.type === "MINI_MISSION")?.miniMission?.type ?? "MATCH_PAIRS"
  );
  const [miniQuestion, setMiniQuestion] = useState(
    currentMission?.steps?.find((s: GamifiedStep) => s.type === "MINI_MISSION")?.miniMission?.question ??
      "Match the concepts with their real-world outcomes:"
  );
  const [isBoss, setIsBoss] = useState(Boolean(currentMission?.isBossBattle));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [validationError, setValidationError] = useState("");

  if (!currentSkill || !currentMission) {
    return <div className="p-6 text-center text-xs text-zinc-400">No skills or missions found to edit.</div>;
  }

  const handleSaveLesson = () => {
    if (!hookText.trim() || !storyText.trim() || !discoveryText.trim() || !miniQuestion.trim()) {
      setValidationError("ALL fields are mandatory. Please complete Curiosity Hook, Story Card, Discovery, and Mini-Mission prompt before saving.");
      return;
    }
    setValidationError("");
    const updatedSteps: GamifiedStep[] = [
      {
        id: "step-1",
        type: "HOOK",
        title: "Curiosity Hook",
        hookText,
      },
      {
        id: "step-2",
        type: "STORY",
        title: "Story Card",
        storyText,
        storyAnalogy: `Think of ${currentSkill.title} like building Lego blocks.`,
      },
      {
        id: "step-3",
        type: "DISCOVERY",
        title: "The Discovery",
        discoveryText,
      },
      {
        id: "step-4",
        type: "MINI_MISSION",
        title: "Mini Mission Activity",
        miniMission: {
          type: miniMissionType,
          question: miniQuestion,
          pairs: [
            { left: "Objective", right: storyText.slice(0, 30) + "..." },
            { left: "Outcome", right: discoveryText.slice(0, 30) + "..." },
          ],
          explanation: "Great job! Understanding how objectives map to outcomes is key.",
        },
      },
      {
        id: "step-5",
        type: "REFLECTION",
        title: "Quick Reflection",
        reflectionQuestion: `How will mastering ${currentMission.title} help you build real products?`,
      },
      {
        id: "step-6",
        type: "REWARD",
        title: "Mission Victory!",
        xpReward: currentMission.xpReward,
        neuronReward: currentMission.neuronReward,
      },
    ];

    const updatedMissions = currentSkill.missions.map((m: Mission) =>
      m.id === currentMission.id ? { ...m, steps: updatedSteps, isBossBattle: isBoss } : m
    );

    const updatedSkill: Skill = {
      ...currentSkill,
      missions: updatedMissions,
    };

    adminSaveSkill(updatedSkill);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" /> No-Code Campaign & Micro-Lesson Builder
          </h2>
          <p className="text-xs text-zinc-400">
            Create Duolingo / Brilliant style 2-5 min story lessons, mini-missions, and Boss Battles without code.
          </p>
        </div>

        <button onClick={handleSaveLesson} className="btn-primary">
          <Save className="h-4 w-4" /> Publish Micro-Lesson Instantly
        </button>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/15 p-3 text-xs font-bold text-warning">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/15 p-3 text-xs font-bold text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Micro-lesson updated and published live to student catalog!</span>
        </div>
      )}

      {/* Selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase">Select Target Skill Track</label>
          <select
            value={selectedSkillId}
            onChange={(e) => {
              setSelectedSkillId(e.target.value);
              const s = skills.find((x: Skill) => x.id === e.target.value);
              if (s?.missions[0]) setSelectedMissionId(s.missions[0].id);
            }}
            className="input-dark mt-1.5 text-xs font-semibold"
          >
            {skills.map((s: Skill) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.missions.length} Missions)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase">Select Mission Campaign Node</label>
          <select
            value={selectedMissionId || currentSkill.missions[0]?.id}
            onChange={(e) => setSelectedMissionId(e.target.value)}
            className="input-dark mt-1.5 text-xs font-semibold"
          >
            {currentSkill.missions.map((m: Mission) => (
              <option key={m.id} value={m.id}>
                Mission {m.order}: {m.title} ({m.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step Editor Cards */}
      <div className="space-y-4">
        {/* Step 1: Curiosity Hook */}
        <div className="clay-card p-5 space-y-3 border-brand/30">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <HelpCircle className="h-4 w-4" /> Step 1: Curiosity Hook Card
          </div>
          <textarea
            rows={2}
            value={hookText}
            onChange={(e) => setHookText(e.target.value)}
            placeholder="Ask an intriguing question or premise..."
            className="input-dark text-xs"
          />
        </div>

        {/* Step 2: Story Card */}
        <div className="clay-card p-5 space-y-3 border-brand/30">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <BookOpen className="h-4 w-4" /> Step 2: Story Card & Analogy
          </div>
          <textarea
            rows={3}
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Explain the concept using a small story or analogy (no textbooks)..."
            className="input-dark text-xs"
          />
        </div>

        {/* Step 3: Discovery */}
        <div className="clay-card p-5 space-y-3 border-accent/30">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
            <Lightbulb className="h-4 w-4" /> Step 3: Concept Discovery Reveal
          </div>
          <textarea
            rows={2}
            value={discoveryText}
            onChange={(e) => setDiscoveryText(e.target.value)}
            placeholder="Reveal the key concept slowly..."
            className="input-dark text-xs"
          />
        </div>

        {/* Step 4: Mini Mission Activity */}
        <div className="clay-card p-5 space-y-4 border-warning/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
              <Target className="h-4 w-4" /> Step 4: Interactive Mini-Mission Activity
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-zinc-400">Boss Battle Node:</label>
              <input
                type="checkbox"
                checked={isBoss}
                onChange={(e) => setIsBoss(e.target.checked)}
                className="h-4 w-4 rounded accent-brand"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400">Activity Type</label>
              <select
                value={miniMissionType}
                onChange={(e) => setMiniMissionType(e.target.value as MiniMissionType)}
                className="input-dark mt-1 text-xs"
              >
                <option value="MATCH_PAIRS">Match Pairs</option>
                <option value="FILL_BLANKS">Fill in the Blanks</option>
                <option value="SCENARIO">Scenario Choice</option>
                <option value="PREDICT">Predict Outcome</option>
                <option value="FIND_MISTAKE">Find Mistake</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400">Prompt Question</label>
              <input
                type="text"
                value={miniQuestion}
                onChange={(e) => setMiniQuestion(e.target.value)}
                className="input-dark mt-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
