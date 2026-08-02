"use client";

import { HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Level, Question, Skill } from "@/lib/types";

export function AdminCurriculumTab() {
  const { skills, adminUpdateLevel } = useApp();
  const [skillId, setSkillId] = useState(skills[0]?.id || "ai-prompt-engineering");
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [form, setForm] = useState({ title: "", youtubeVideoId: "", minPassScore: 80, coinReward: 15 });

  // Question Editor state
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editingQIndex, setEditingQIndex] = useState<number | null>(null);
  const [qPrompt, setQPrompt] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qAnswerIndex, setQAnswerIndex] = useState<number>(0);

  const skill: Skill = useMemo(() => skills.find((s) => s.id === skillId) ?? skills[0], [skills, skillId]);

  const openEdit = (l: Level) => {
    setEditingLevel(l);
    setForm({ title: l.title, youtubeVideoId: l.youtubeVideoId, minPassScore: l.minPassScore, coinReward: l.coinReward });
  };

  const saveLevel = () => {
    if (!editingLevel) return;
    adminUpdateLevel(editingLevel.id, {
      title: form.title.trim() || editingLevel.title,
      youtubeVideoId: form.youtubeVideoId.trim() || editingLevel.youtubeVideoId,
      minPassScore: Math.min(100, Math.max(1, form.minPassScore)),
      coinReward: Math.max(0, form.coinReward),
    });
    setEditingLevel(null);
  };

  const openAddQuestion = () => {
    setEditingQIndex(null);
    setQPrompt("");
    setQOptions(["Option A", "Option B", "Option C", "Option D"]);
    setQAnswerIndex(0);
    setQModalOpen(true);
  };

  const openEditQuestion = (index: number) => {
    if (!editingLevel) return;
    const q = editingLevel.questions[index];
    setEditingQIndex(index);
    setQPrompt(q.prompt);
    setQOptions([...q.options]);
    setQAnswerIndex(q.answerIndex);
    setQModalOpen(true);
  };

  const saveQuestion = () => {
    if (!editingLevel) return;
    const newQ: Question = {
      id: editingQIndex !== null ? editingLevel.questions[editingQIndex].id : `q-${Date.now()}`,
      prompt: qPrompt.trim() || "New Question Prompt",
      options: qOptions.map((o, idx) => o.trim() || `Option ${String.fromCharCode(65 + idx)}`),
      answerIndex: qAnswerIndex,
    };

    let updatedQuestions = [...editingLevel.questions];
    if (editingQIndex !== null) {
      updatedQuestions[editingQIndex] = newQ;
    } else {
      updatedQuestions.push(newQ);
    }

    adminUpdateLevel(editingLevel.id, { questions: updatedQuestions });
    setEditingLevel({ ...editingLevel, questions: updatedQuestions });
    setQModalOpen(false);
  };

  const deleteQuestion = (index: number) => {
    if (!editingLevel) return;
    const updatedQuestions = editingLevel.questions.filter((_, i) => i !== index);
    adminUpdateLevel(editingLevel.id, { questions: updatedQuestions });
    setEditingLevel({ ...editingLevel, questions: updatedQuestions });
  };

  return (
    <div>
      <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="input-dark mb-3 font-semibold">
        {skills.map((s) => (
          <option key={s.id} value={s.id} className="bg-zinc-900">
            {s.title}
          </option>
        ))}
      </select>

      <div className="glass divide-y divide-white/[0.05]">
        {skill.levels.map((l) => (
          <div key={l.id} className="flex items-center gap-3 px-4 py-3">
            <span className="w-8 text-center font-mono text-sm font-bold" style={{ color: skill.color }}>
              L{l.levelNumber}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-200">{l.title}</div>
              <div className="font-mono text-[11px] text-zinc-500">
                🎬 {l.youtubeVideoId} · pass ≥{l.minPassScore}% · +ↁ{l.coinReward} · {l.questions.length} questions
              </div>
            </div>
            <button onClick={() => openEdit(l)} className="btn-ghost !px-3 !py-1.5 text-xs font-semibold">
              <Pencil className="h-3.5 w-3.5" /> Edit Level & Questions
            </button>
          </div>
        ))}
      </div>

      {/* Level & Question Editor Modal */}
      <Modal open={!!editingLevel} onClose={() => setEditingLevel(null)} title={`Edit L${editingLevel?.levelNumber} · ${skill.title}`}>
        {editingLevel && (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-3 border-b border-white/10 pb-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                Level Configuration
              </h4>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Level title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">YouTube Video ID</label>
                <input
                  value={form.youtubeVideoId}
                  onChange={(e) => setForm({ ...form, youtubeVideoId: e.target.value })}
                  className="input-dark font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Pass mark (%)</label>
                  <input
                    type="number"
                    value={form.minPassScore}
                    onChange={(e) => setForm({ ...form, minPassScore: Number(e.target.value) })}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">Coin reward (ↁ)</label>
                  <input
                    type="number"
                    value={form.coinReward}
                    onChange={(e) => setForm({ ...form, coinReward: Number(e.target.value) })}
                    className="input-dark"
                  />
                </div>
              </div>
              <button onClick={saveLevel} className="btn-primary w-full py-2.5 text-xs font-bold">
                Save Level Config
              </button>
            </div>

            {/* Question Bank Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> Question Bank ({editingLevel.questions.length})
                </h4>
                <button onClick={openAddQuestion} className="btn-ghost !px-2.5 !py-1 text-xs text-cyan-300">
                  <Plus className="h-3.5 w-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-2">
                {editingLevel.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-zinc-200">
                        {qIdx + 1}. {q.prompt}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditQuestion(qIdx)} className="text-cyan-400 hover:text-cyan-300 p-1">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deleteQuestion(qIdx)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                      {q.options.map((opt, optIdx) => (
                        <span
                          key={optIdx}
                          className={cn(
                            "rounded px-2 py-1",
                            optIdx === q.answerIndex
                              ? "bg-emerald-500/20 font-bold text-emerald-300"
                              : "bg-white/[0.03] text-zinc-400"
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Single Question Editor Sub-modal */}
      <Modal open={qModalOpen} onClose={() => setQModalOpen(false)} title={editingQIndex !== null ? "Edit Question" : "Add New Question"}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Question Prompt</label>
            <textarea
              rows={2}
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              className="input-dark"
              placeholder="e.g. What is temperature parameter in LLM generation?"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Options (A, B, C, D)</label>
            <div className="space-y-2">
              {qOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400">{String.fromCharCode(65 + idx)}.</span>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const copy = [...qOptions];
                      copy[idx] = e.target.value;
                      setQOptions(copy);
                    }}
                    className="input-dark flex-1"
                  />
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={qAnswerIndex === idx}
                    onChange={() => setQAnswerIndex(idx)}
                    className="h-4 w-4 accent-emerald-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 font-mono text-[10px] text-zinc-500 text-right">Select radio for correct answer</div>
          </div>
          <button onClick={saveQuestion} className="btn-primary w-full py-2.5 text-xs font-bold">
            Save Question
          </button>
        </div>
      </Modal>
    </div>
  );
}
