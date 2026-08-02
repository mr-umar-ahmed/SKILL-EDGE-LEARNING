"use client";

import { AlertTriangle, Clock3, Eye, EyeOff, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { EmptyState, Modal, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Difficulty, Skill } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SkillForm {
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  iconName: string;
  color: string;
  difficulty: Difficulty;
  estimatedHours: string;
  isPublished: boolean;
}

const EMPTY_FORM: SkillForm = {
  title: "",
  category: "",
  description: "",
  thumbnailUrl: "",
  iconName: "Sparkles",
  color: "#3b82f6",
  difficulty: "Beginner",
  estimatedHours: "10",
  isPublished: false,
};

export function AdminSkillsTab() {
  const { state, adminUpsertSkill, adminDeleteSkill } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = creating
  const [form, setForm] = useState<SkillForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const set = <K extends keyof SkillForm>(key: K, value: SkillForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      title: skill.title,
      category: skill.category,
      description: skill.description,
      thumbnailUrl: skill.thumbnailUrl,
      iconName: skill.iconName,
      color: skill.color,
      difficulty: skill.difficulty,
      estimatedHours: String(skill.estimatedHours),
      isPublished: skill.isPublished,
    });
    setError("");
    setModalOpen(true);
  };

  const save = () => {
    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.description.trim() ||
      !form.iconName.trim() ||
      !form.color.trim() ||
      !form.estimatedHours.trim()
    ) {
      setError("ALL fields are mandatory. Please enter values for title, category, description, icon, color, and estimated hours.");
      return;
    }
    const existing = editingId ? state.catalog.find((s) => s.id === editingId) : undefined;
    const id = existing ? existing.id : slugify(form.title);
    if (!existing) {
      if (!id) {
        setError("Title must contain at least one letter or number.");
        return;
      }
      if (state.catalog.some((s) => s.id === id)) {
        setError(`A skill with the slug "${id}" already exists — pick a different title.`);
        return;
      }
    }
    const skill: Skill = {
      id,
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
      iconName: form.iconName.trim() || "Sparkles",
      color: form.color || "#3b82f6",
      difficulty: form.difficulty,
      estimatedHours: Math.max(1, Number(form.estimatedHours) || 1),
      missions: existing ? existing.missions : [],
      isPublished: form.isPublished,
    };
    adminUpsertSkill(skill);
    setModalOpen(false);
  };

  const togglePublished = (skill: Skill) => {
    adminUpsertSkill({ ...skill, isPublished: !skill.isPublished });
  };

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const handleImportSkillsJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const skillsArray: Skill[] = Array.isArray(parsed) ? parsed : parsed.catalog ? parsed.catalog : [parsed];
      let count = 0;
      for (const sk of skillsArray) {
        if (sk && sk.id && sk.title) {
          adminUpsertSkill(sk);
          count++;
        }
      }
      setImportStatus(`Successfully imported ${count} skill(s) into the live catalog!`);
      setTimeout(() => {
        setImportModalOpen(false);
        setImportStatus("");
        setImportJsonText("");
      }, 2000);
    } catch (e) {
      setImportStatus(`Invalid JSON error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          {fmtNum(state.catalog.length)} skills in catalog ·{" "}
          {fmtNum(state.catalog.filter((s) => s.isPublished).length)} published
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setImportModalOpen(true)} className="btn-ghost px-4 py-2 text-xs border-brand/40 text-brand font-bold">
            Import JSON Catalog
          </button>
          <button onClick={openCreate} className="btn-primary px-4 py-2 text-xs">
            <Plus className="h-4 w-4" /> Add Mandatory Skill
          </button>
        </div>
      </div>

      {state.catalog.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-10 w-10" />}
          title="No skills yet"
          text="Create your first skill to start building the catalog."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> Add Skill
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {state.catalog.map((skill) => (
            <div key={skill.id} className="card-glow flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line"
                  style={{ background: `${skill.color}1a`, color: skill.color }}
                >
                  <SkillIcon name={skill.iconName} className="h-5 w-5" />
                </div>
                <button
                  onClick={() => togglePublished(skill)}
                  className={cn(
                    "chip transition",
                    skill.isPublished
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-line text-zinc-500"
                  )}
                  title={skill.isPublished ? "Click to unpublish" : "Click to publish"}
                >
                  {skill.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {skill.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              <h3 className="mt-3 font-display text-base font-bold text-white">{skill.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">{skill.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip px-2 py-0.5 text-[10px]">{skill.category}</span>
                <span className="chip px-2 py-0.5 text-[10px]">{skill.difficulty}</span>
                <span className="chip px-2 py-0.5 text-[10px]">
                  <Layers className="h-3 w-3" /> {skill.missions.length} missions
                </span>
                <span className="chip px-2 py-0.5 text-[10px]">
                  <Clock3 className="h-3 w-3" /> {skill.estimatedHours}h
                </span>
              </div>

              <div className="mt-4 flex gap-2 border-t border-line pt-3.5">
                <button onClick={() => openEdit(skill)} className="btn-ghost flex-1 px-3 py-2 text-xs">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(skill)}
                  className="btn-ghost px-3 py-2 text-xs text-danger hover:border-danger/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
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
        title={editingId ? "Edit Skill" : "Add Skill"}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Title</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. UX Writing"
                className="input-dark"
              />
              {!editingId && form.title.trim() && (
                <p className="mt-1 text-[11px] text-zinc-500">
                  Slug: <span className="font-mono text-zinc-400">{slugify(form.title) || "—"}</span>
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Category</label>
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Design & Creativity"
                className="input-dark"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value as Difficulty)}
                className="input-dark"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="What does the student learn to actually do?"
                className="input-dark resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Thumbnail URL</label>
              <input
                value={form.thumbnailUrl}
                onChange={(e) => set("thumbnailUrl", e.target.value)}
                placeholder="https://…"
                className="input-dark"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Icon name (Lucide)</label>
              <div className="flex items-center gap-2.5">
                <input
                  value={form.iconName}
                  onChange={(e) => set("iconName", e.target.value)}
                  placeholder="e.g. Rocket"
                  className="input-dark flex-1"
                />
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line"
                  style={{ background: `${form.color}1a`, color: form.color }}
                >
                  <SkillIcon name={form.iconName} className="h-5 w-5" />
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Accent color</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-base p-1"
                />
                <input value={form.color} onChange={(e) => set("color", e.target.value)} className="input-dark flex-1" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Estimated hours</label>
              <input
                type="number"
                min={0}
                value={form.estimatedHours}
                onChange={(e) => set("estimatedHours", e.target.value)}
                className="input-dark"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => set("isPublished", e.target.checked)}
                  className="h-4 w-4 accent-[#3b82f6]"
                />
                Published (visible to students)
              </label>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-danger">
              <AlertTriangle className="h-3.5 w-3.5" /> {error}
            </p>
          )}

          <div className="flex gap-2.5 border-t border-line pt-4">
            <button onClick={save} className="btn-primary flex-1">
              {editingId ? "Save changes" : "Create skill"}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* --------------------------- delete confirm --------------------------- */}
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete skill?">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              Delete <span className="font-semibold text-white">{deleteTarget.title}</span> and its{" "}
              {deleteTarget.missions.length} missions from the catalog? Student progress records remain, but the
              skill disappears everywhere. This cannot be undone.
            </p>
            <SectionTitle>Confirm</SectionTitle>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  adminDeleteSkill(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="btn-danger flex-1"
              >
                <Trash2 className="h-4 w-4" /> Delete skill
              </button>
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1">
                Keep it
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* --------------------------- import JSON catalog modal --------------------------- */}
      <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)} title="Import Complete JSON Skills Catalog">
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Paste a JSON array of complete Skill objects (with all mandatory fields: title, category, description, icon, color, missions, and micro-lesson steps):
          </p>
          <textarea
            rows={8}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder='[ { "id": "ai-vibe-coding", "title": "AI Vibe Coding", "category": "Engineering", "description": "...", "iconName": "Code", "color": "#E85002", "difficulty": "Intermediate", "estimatedHours": 10, "isPublished": true, "missions": [...] } ]'
            className="input-dark font-mono text-[11px]"
          />

          {importStatus && (
            <div className="rounded-xl border border-line bg-card p-3 text-xs font-bold text-white">
              {importStatus}
            </div>
          )}

          <div className="flex gap-2 border-t border-line pt-4">
            <button onClick={handleImportSkillsJson} className="btn-primary flex-1">
              Import & Publish to Catalog
            </button>
            <button onClick={() => setImportModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
