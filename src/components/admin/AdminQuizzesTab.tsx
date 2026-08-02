"use client";

import { Crown, Plus } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import { fmtDateTime, fmtNum } from "@/lib/utils";

export function AdminQuizzesTab() {
  const { state, skills, adminCreateQuiz, adminDeclareWinners } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [skillId, setSkillId] = useState(skills[0]?.id || "ai-prompt-engineering");
  const [entryFee, setEntryFee] = useState(0);
  const [prizePool, setPrizePool] = useState(300);
  const [startsInHours, setStartsInHours] = useState(24);
  const [duration, setDuration] = useState(30);

  const create = () => {
    const skill = skills.find((s) => s.id === skillId)!;
    const bank = skill.levels.flatMap((l) => l.questions);
    const seen = new Set<string>();
    const questions = bank.filter((q) => !seen.has(q.prompt) && seen.add(q.prompt) !== undefined).slice(0, 6);
    adminCreateQuiz({
      title: title.trim() || `${skill.title} Weekly Showdown`,
      category: skill.category,
      entryFeeCoins: Math.max(0, entryFee),
      prizePoolCoins: Math.max(0, prizePool),
      startTime: new Date(Date.now() + startsInHours * 3600000).toISOString(),
      durationMins: duration,
      secondsPerQuestion: 15,
      questions,
    });
    setCreateOpen(false);
    setTitle("");
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button onClick={() => setCreateOpen(true)} className="btn-primary !py-2 text-sm font-bold">
          <Plus className="h-4 w-4" /> Create Tournament
        </button>
      </div>
      <div className="space-y-3">
        {state.quizzes.map((q) => {
          const entries = state.quizEntries.filter((e) => e.quizId === q.id);
          const scored = entries.filter((e) => e.score !== null);
          return (
            <div key={q.id} className="glass p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm font-bold text-zinc-100">{q.title}</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span suppressHydrationWarning>{fmtDateTime(q.startTime)}</span>
                    <span className="font-mono text-yellow-300">Prize ↁ{fmtNum(q.prizePoolCoins)}</span>
                    <span className="font-mono">{q.entryFeeCoins > 0 ? `Entry ↁ${q.entryFeeCoins}` : "Free"}</span>
                    <span>{entries.length} joined · {scored.length} scored</span>
                  </div>
                </div>
                {q.winnersDeclared ? (
                  <span className="chip border-emerald-400/30 text-emerald-300">
                    <Crown className="h-3 w-3" /> Winners paid
                  </span>
                ) : (
                  <button
                    onClick={() => adminDeclareWinners(q.id)}
                    disabled={scored.length === 0}
                    className="btn-gold !px-4 !py-2 text-xs font-bold"
                  >
                    <Crown className="h-3.5 w-3.5" /> Declare winners & pay out
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="🏟️ Create Weekly Tournament">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" placeholder="Tournament title" />
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Skill category (question source)</label>
            <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="input-dark">
              {skills.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900">
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Entry fee (ↁ, 0 = free)</label>
              <input type="number" min={0} value={entryFee} onChange={(e) => setEntryFee(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Prize pool (ↁ)</label>
              <input type="number" min={0} value={prizePool} onChange={(e) => setPrizePool(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Starts in (hours)</label>
              <input type="number" min={1} value={startsInHours} onChange={(e) => setStartsInHours(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Duration (mins)</label>
              <input type="number" min={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input-dark" />
            </div>
          </div>
          <button onClick={create} className="btn-primary w-full py-2.5 text-xs font-bold shadow-lg">
            Publish Tournament
          </button>
        </div>
      </Modal>
    </div>
  );
}
