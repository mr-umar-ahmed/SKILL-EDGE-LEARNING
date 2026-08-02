"use client";

import {
  ArrowDown,
  ArrowUp,
  Crown,
  Hexagon,
  Layers,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { EmptyState, Modal, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Difficulty, LearningResource, Mission, ResourceType, SubmissionKind } from "@/lib/types";
import { cn, fmtMinutes, uid } from "@/lib/utils";

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const RESOURCE_TYPES: ResourceType[] = ["VIDEO", "PDF", "ARTICLE", "TEMPLATE", "DOCUMENT", "LINK", "IMAGE"];
const SUBMISSION_KINDS: SubmissionKind[] = [
  "TEXT",
  "FILE",
  "URL",
  "GOOGLE_DRIVE",
  "GITHUB",
  "FIGMA",
  "CANVA",
  "NOTION",
  "YOUTUBE",
];

const KIND_LABELS: Record<SubmissionKind, string> = {
  TEXT: "Text",
  FILE: "File upload",
  URL: "Any URL",
  GOOGLE_DRIVE: "Google Drive",
  GITHUB: "GitHub",
  FIGMA: "Figma",
  CANVA: "Canva",
  NOTION: "Notion",
  YOUTUBE: "YouTube",
};

function tierForOrder(order: number): string {
  if (order <= 3) return "Foundation";
  if (order <= 6) return "Practice";
  if (order <= 8) return "Advanced";
  if (order === 9) return "Pro";
  return "Capstone";
}

interface ResourceRow {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  minutes: string;
}

interface MissionForm {
  title: string;
  objective: string;
  expectedOutcome: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: string;
  xpReward: string;
  neuronReward: string;
  isPremium: boolean;
  resources: ResourceRow[];
  brief: string;
  deliverables: string; // one per line
  checklist: string; // one per line
  allowedTypes: SubmissionKind[];
  reflections: string; // one per line
}

const EMPTY_FORM: MissionForm = {
  title: "",
  objective: "",
  expectedOutcome: "",
  description: "",
  difficulty: "Beginner",
  estimatedMinutes: "45",
  xpReward: "50",
  neuronReward: "15",
  isPremium: false,
  resources: [],
  brief: "",
  deliverables: "",
  checklist: "",
  allowedTypes: ["TEXT", "URL", "FILE"],
  reflections: "",
};

const splitLines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function AdminMissionsTab() {
  const {
    state,
    adminUpsertMission,
    adminDeleteMission,
    adminMoveMission,
    adminSetMissionLocked,
  } = useApp();

  const [skillId, setSkillId] = useState<string>(state.catalog[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MissionForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Mission | null>(null);

  const skill = state.catalog.find((s) => s.id === skillId) ?? state.catalog[0];
  const missions = skill ? [...skill.missions].sort((a, b) => a.order - b.order) : [];

  const set = <K extends keyof MissionForm>(key: K, value: MissionForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    if (!skill) return;
    const nextOrder = skill.missions.length + 1;
    setEditingId(null);
    setForm({ ...EMPTY_FORM, isPremium: nextOrder >= 5, xpReward: String(nextOrder * 50) });
    setModalOpen(true);
  };

  const openEdit = (m: Mission) => {
    setEditingId(m.id);
    setForm({
      title: m.title,
      objective: m.objective,
      expectedOutcome: m.expectedOutcome,
      description: m.description,
      difficulty: m.difficulty,
      estimatedMinutes: String(m.estimatedMinutes),
      xpReward: String(m.xpReward),
      neuronReward: String(m.neuronReward),
      isPremium: m.isPremium,
      resources: m.resources.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        url: r.url,
        minutes: r.minutes != null ? String(r.minutes) : "",
      })),
      brief: m.assignment.brief,
      deliverables: m.assignment.deliverables.join("\n"),
      checklist: m.assignment.checklist.join("\n"),
      allowedTypes: m.assignment.allowedSubmissionTypes,
      reflections: m.reflectionQuestions.join("\n"),
    });
    setModalOpen(true);
  };

  const save = () => {
    if (!skill || !form.title.trim()) return;
    const existing = editingId ? skill.missions.find((m) => m.id === editingId) : undefined;
    const order = existing ? existing.order : skill.missions.length + 1;
    const prevMission = skill.missions.find((m) => m.order === order - 1);

    const resources: LearningResource[] = form.resources
      .filter((r) => r.title.trim() || r.url.trim())
      .map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title.trim(),
        url: r.url.trim(),
        minutes: r.minutes.trim() ? Math.max(0, Number(r.minutes) || 0) : undefined,
      }));

    const mission: Mission = {
      id: existing ? existing.id : `${skill.id}-level-${order}`,
      skillId: skill.id,
      order,
      title: form.title.trim(),
      tier: existing ? existing.tier : tierForOrder(order),
      objective: form.objective.trim(),
      expectedOutcome: form.expectedOutcome.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      estimatedMinutes: Math.max(0, Number(form.estimatedMinutes) || 0),
      prerequisites: existing ? existing.prerequisites : prevMission ? [prevMission.id] : [],
      resources,
      assignment: {
        brief: form.brief.trim(),
        deliverables: splitLines(form.deliverables),
        checklist: splitLines(form.checklist),
        allowedSubmissionTypes: form.allowedTypes.length ? form.allowedTypes : ["TEXT"],
      },
      reflectionQuestions: splitLines(form.reflections),
      quiz: existing ? existing.quiz : [],
      xpReward: Math.max(0, Number(form.xpReward) || 0),
      neuronReward: Math.max(0, Number(form.neuronReward) || 0),
      isPremium: form.isPremium,
      isLocked: existing ? existing.isLocked : false,
    };
    adminUpsertMission(skill.id, mission);
    setModalOpen(false);
  };

  const toggleKind = (kind: SubmissionKind) =>
    set(
      "allowedTypes",
      form.allowedTypes.includes(kind)
        ? form.allowedTypes.filter((k) => k !== kind)
        : [...form.allowedTypes, kind]
    );

  const addResourceRow = () =>
    set("resources", [...form.resources, { id: uid("res"), type: "LINK", title: "", url: "", minutes: "" }]);

  const updateResourceRow = (id: string, patch: Partial<ResourceRow>) =>
    set(
      "resources",
      form.resources.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );

  const removeResourceRow = (id: string) =>
    set(
      "resources",
      form.resources.filter((r) => r.id !== id)
    );

  if (state.catalog.length === 0) {
    return (
      <EmptyState
        icon={<Layers className="h-10 w-10" />}
        title="No skills in catalog"
        text="Create a skill first — missions live inside skills."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={skill?.id ?? ""}
          onChange={(e) => setSkillId(e.target.value)}
          className="input-dark w-full sm:w-auto sm:min-w-[280px]"
        >
          {state.catalog.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.missions.length} missions){s.isPublished ? "" : " — draft"}
            </option>
          ))}
        </select>
        <button onClick={openCreate} className="btn-primary px-4 py-2 text-xs">
          <Plus className="h-4 w-4" /> Add Mission
        </button>
      </div>

      {missions.length === 0 ? (
        <EmptyState
          icon={<Target className="h-10 w-10" />}
          title="No missions yet"
          text="Add the first mission — it becomes level 1 of this skill."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> Add Mission
            </button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {missions.map((m, idx) => (
            <div key={m.id} className="clay-card flex items-center gap-3 p-3.5 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-base font-display text-sm font-bold text-brand">
                {m.order}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="truncate text-sm font-semibold text-white">{m.title}</span>
                  <span className="chip px-2 py-0.5 text-[10px]">{m.tier}</span>
                  {m.isPremium && (
                    <span className="chip border-premium/40 bg-premium/10 px-2 py-0.5 text-[10px] text-premium">
                      <Crown className="h-3 w-3" /> Pro
                    </span>
                  )}
                  {m.isLocked && (
                    <span className="chip border-danger/40 bg-danger/10 px-2 py-0.5 text-[10px] text-danger">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Zap className="h-3 w-3 text-warning" /> {m.xpReward} XP
                  </span>
                  <span className="inline-flex items-center gap-1 text-accent">
                    <Hexagon className="h-3 w-3 fill-accent/20" /> {m.neuronReward}
                  </span>
                  <span>{fmtMinutes(m.estimatedMinutes)}</span>
                  <span>{m.difficulty}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => adminMoveMission(skill!.id, m.id, -1)}
                  disabled={idx === 0}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-hover hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => adminMoveMission(skill!.id, m.id, 1)}
                  disabled={idx === missions.length - 1}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-hover hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => adminSetMissionLocked(m.id, !m.isLocked)}
                  className={cn(
                    "rounded-lg p-1.5 transition hover:bg-hover",
                    m.isLocked ? "text-danger" : "text-zinc-400 hover:text-white"
                  )}
                  title={m.isLocked ? "Unlock mission" : "Lock mission"}
                >
                  {m.isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openEdit(m)}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-hover hover:text-white"
                  title="Edit mission"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(m)}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-hover hover:text-danger"
                  title="Delete mission"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --------------------------- create / edit modal --------------------------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        wide
        title={editingId ? "Edit Mission" : `Add Mission — Level ${(skill?.missions.length ?? 0) + 1}`}
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Title</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className="input-dark" placeholder="e.g. Ship Your First Landing Page" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Objective (one line)</label>
              <input value={form.objective} onChange={(e) => set("objective", e.target.value)} className="input-dark" placeholder="What is the student trying to achieve?" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Expected outcome</label>
              <input value={form.expectedOutcome} onChange={(e) => set("expectedOutcome", e.target.value)} className="input-dark" placeholder="What do they walk away with?" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="input-dark resize-y" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)} className="input-dark">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Estimated minutes</label>
              <input type="number" min={0} value={form.estimatedMinutes} onChange={(e) => set("estimatedMinutes", e.target.value)} className="input-dark" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">XP reward</label>
              <input type="number" min={0} value={form.xpReward} onChange={(e) => set("xpReward", e.target.value)} className="input-dark" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Neuron reward</label>
              <input type="number" min={0} value={form.neuronReward} onChange={(e) => set("neuronReward", e.target.value)} className="input-dark" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
                <input type="checkbox" checked={form.isPremium} onChange={(e) => set("isPremium", e.target.checked)} className="h-4 w-4 accent-[#8b5cf6]" />
                <Crown className="h-4 w-4 text-premium" /> Premium mission (requires Pro plan)
              </label>
            </div>
          </div>

          {/* resources editor */}
          <div className="space-y-2.5 rounded-xl border border-line bg-base/60 p-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Learning resources</SectionTitle>
              <button onClick={addResourceRow} className="btn-ghost px-3 py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add resource
              </button>
            </div>
            {form.resources.length === 0 && (
              <p className="text-xs text-zinc-500">No resources yet — add videos, PDFs, articles, templates or links.</p>
            )}
            {form.resources.map((r) => (
              <div key={r.id} className="grid grid-cols-2 gap-2 rounded-lg border border-line p-2.5 sm:grid-cols-[110px_1fr_1fr_80px_36px]">
                <select
                  value={r.type}
                  onChange={(e) => updateResourceRow(r.id, { type: e.target.value as ResourceType })}
                  className="input-dark px-2 py-2 text-xs"
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  value={r.title}
                  onChange={(e) => updateResourceRow(r.id, { title: e.target.value })}
                  placeholder="Title"
                  className="input-dark px-2.5 py-2 text-xs"
                />
                <input
                  value={r.url}
                  onChange={(e) => updateResourceRow(r.id, { url: e.target.value })}
                  placeholder="URL / YouTube id"
                  className="input-dark px-2.5 py-2 text-xs"
                />
                <input
                  type="number"
                  min={0}
                  value={r.minutes}
                  onChange={(e) => updateResourceRow(r.id, { minutes: e.target.value })}
                  placeholder="min"
                  className="input-dark px-2.5 py-2 text-xs"
                />
                <button
                  onClick={() => removeResourceRow(r.id)}
                  className="flex items-center justify-center rounded-lg border border-line text-zinc-500 transition hover:border-danger/50 hover:text-danger"
                  title="Remove resource"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* assignment editor */}
          <div className="space-y-3.5 rounded-xl border border-line bg-base/60 p-4">
            <SectionTitle>Practical assignment</SectionTitle>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Brief — what to build/do</label>
              <textarea value={form.brief} onChange={(e) => set("brief", e.target.value)} rows={3} className="input-dark resize-y" />
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Deliverables (one per line)</label>
                <textarea value={form.deliverables} onChange={(e) => set("deliverables", e.target.value)} rows={4} className="input-dark resize-y" placeholder={"A published landing page\nA 60-second demo video"} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Checklist (one step per line)</label>
                <textarea value={form.checklist} onChange={(e) => set("checklist", e.target.value)} rows={4} className="input-dark resize-y" placeholder={"Research 3 examples\nDraft the copy\nBuild and publish"} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Allowed submission types</label>
              <div className="flex flex-wrap gap-2">
                {SUBMISSION_KINDS.map((kind) => (
                  <button
                    key={kind}
                    onClick={() => toggleKind(kind)}
                    className={cn(
                      "chip transition",
                      form.allowedTypes.includes(kind) && "border-brand/60 bg-brand/15 text-white"
                    )}
                  >
                    {KIND_LABELS[kind]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Reflection questions (one per line)</label>
            <textarea value={form.reflections} onChange={(e) => set("reflections", e.target.value)} rows={3} className="input-dark resize-y" placeholder={"What was the hardest part?\nWhat would you do differently?"} />
          </div>

          <div className="flex gap-2.5 border-t border-line pt-4">
            <button onClick={save} disabled={!form.title.trim()} className="btn-primary flex-1">
              {editingId ? "Save changes" : "Create mission"}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* --------------------------- delete confirm --------------------------- */}
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete mission?">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              Delete <span className="font-semibold text-white">Level {deleteTarget.order} — {deleteTarget.title}</span>?
              Later missions shift down one level. This cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  adminDeleteMission(skill!.id, deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="btn-danger flex-1"
              >
                <Trash2 className="h-4 w-4" /> Delete mission
              </button>
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1">
                Keep it
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
