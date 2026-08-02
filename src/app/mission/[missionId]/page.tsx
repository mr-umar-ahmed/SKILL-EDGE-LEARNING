"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  Figma,
  FileText,
  FileType2,
  Github,
  HardDrive,
  Hexagon,
  Image as ImageIcon,
  LayoutTemplate,
  Link2,
  ListChecks,
  Lock,
  LucideIcon,
  MessageSquare,
  Newspaper,
  Palette,
  PartyPopper,
  Plus,
  Send,
  Square,
  StickyNote,
  Target,
  Trophy,
  UploadCloud,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AssessmentModal } from "@/components/AssessmentModal";
import { AIAssignmentPreChecker } from "@/components/AIAssignmentPreChecker";
import { InteractiveLessonRunner } from "@/components/InteractiveLessonRunner";
import { AdSlot } from "@/components/ads/AdSlot";
import { fireConfetti } from "@/components/confetti";
import { EmptyState, SectionTitle, Skeleton, SkeletonCard, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type {
  LearningResource,
  Mission,
  ResourceType,
  Skill,
  Submission,
  SubmissionFile,
  SubmissionKind,
} from "@/lib/types";
import { cn, fmtBytes, fmtDateTime, fmtMinutes, fmtNum } from "@/lib/utils";

/* ------------------------------ metadata maps ------------------------------ */

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-success border-success/40 bg-success/10",
  Intermediate: "text-warning border-warning/40 bg-warning/10",
  Advanced: "text-accent border-accent/40 bg-accent/10",
  Expert: "text-premium border-premium/40 bg-premium/10",
};

const RESOURCE_META: Record<ResourceType, { label: string; Icon: LucideIcon }> = {
  VIDEO: { label: "Video", Icon: Youtube },
  PDF: { label: "PDF", Icon: FileText },
  ARTICLE: { label: "Article", Icon: Newspaper },
  TEMPLATE: { label: "Template", Icon: LayoutTemplate },
  DOCUMENT: { label: "Document", Icon: FileType2 },
  LINK: { label: "Link", Icon: Link2 },
  IMAGE: { label: "Image", Icon: ImageIcon },
};

const KIND_META: Record<SubmissionKind, { label: string; Icon: LucideIcon }> = {
  TEXT: { label: "Text", Icon: FileText },
  FILE: { label: "File", Icon: UploadCloud },
  URL: { label: "Link", Icon: Link2 },
  GOOGLE_DRIVE: { label: "Google Drive", Icon: HardDrive },
  GITHUB: { label: "GitHub", Icon: Github },
  FIGMA: { label: "Figma", Icon: Figma },
  CANVA: { label: "Canva", Icon: Palette },
  NOTION: { label: "Notion", Icon: StickyNote },
  YOUTUBE: { label: "YouTube", Icon: Youtube },
};

const MAX_FILES = 3;
const MAX_FILE_BYTES = 300 * 1024; // 300 KB — larger work should be shared via link

function sortNewestFirst(subs: Submission[]): Submission[] {
  return [...subs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/* ------------------------------ small pieces ------------------------------ */

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("clay-card p-5 sm:p-6 animate-fade-up", className)}>{children}</div>;
}

function ResourceRow({ resource }: { resource: LearningResource }) {
  const meta = RESOURCE_META[resource.type];
  const Icon = meta.Icon;

  if (resource.type === "VIDEO") {
    return (
      <div className="overflow-hidden rounded-xl border border-line bg-base">
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${resource.url}`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Youtube className="h-4 w-4 shrink-0 text-danger" />
            <span className="truncate text-sm font-semibold text-white">{resource.title}</span>
          </div>
          {resource.minutes ? (
            <span className="shrink-0 text-[11px] font-semibold text-zinc-500">{fmtMinutes(resource.minutes)}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition hover:border-brand/50 hover:bg-hover"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white group-hover:text-brand">{resource.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-zinc-500">
          <span className="uppercase tracking-wider">{meta.label}</span>
          {resource.minutes ? <span>· {fmtMinutes(resource.minutes)}</span> : null}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-brand" />
    </a>
  );
}

/* ------------------------------ submission form ------------------------------ */

interface LinkRow {
  kind: SubmissionKind;
  url: string;
}

function SubmissionForm({
  mission,
  completedChecklistIndices = [],
  resubmissionOf,
  onDone,
  onCancel,
}: {
  mission: Mission;
  completedChecklistIndices?: number[];
  resubmissionOf?: string;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const { submitMission } = useApp();

  const linkKinds = useMemo(() => {
    const kinds = mission.assignment.allowedSubmissionTypes.filter((k) => k !== "TEXT" && k !== "FILE");
    return kinds.length ? kinds : (["URL"] as SubmissionKind[]);
  }, [mission.assignment.allowedSubmissionTypes]);

  const [note, setNote] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([{ kind: linkKinds[0], url: "" }]);
  const [files, setFiles] = useState<SubmissionFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>(() => mission.reflectionQuestions.map(() => ""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const addLink = () => setLinks((ls) => [...ls, { kind: linkKinds[0], url: "" }]);
  const removeLink = (i: number) => setLinks((ls) => ls.filter((_, idx) => idx !== i));
  const patchLink = (i: number, patch: Partial<LinkRow>) =>
    setLinks((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const onFiles = (list: FileList | null) => {
    setFileError(null);
    if (!list) return;
    const incoming = Array.from(list);
    const room = MAX_FILES - files.length;
    if (incoming.length > room) {
      setFileError(`Max ${MAX_FILES} files per submission.`);
    }
    incoming.slice(0, Math.max(0, room)).forEach((f) => {
      if (f.size > MAX_FILE_BYTES) {
        setFileError(
          `"${f.name}" is ${fmtBytes(f.size)} — over the ${fmtBytes(MAX_FILE_BYTES)} limit. Upload it to Drive and share the link instead.`
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) =>
          prev.length < MAX_FILES
            ? [...prev, { name: f.name, size: f.size, mime: f.type || "application/octet-stream", dataUrl: String(reader.result) }]
            : prev
        );
      };
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async () => {
    if (!note.trim()) {
      setError("Write a short note about your work — reviewers read this first.");
      return;
    }
    setError(null);
    setBusy(true);
    const payload = {
      note: note.trim(),
      links: links.filter((l) => l.url.trim()).map((l) => ({ kind: l.kind, url: l.url.trim() })),
      files,
      reflections: mission.reflectionQuestions.map((q, i) => ({ question: q, answer: answers[i]?.trim() ?? "" })),
      resubmissionOf,
    };
    const sub = submitMission(mission.id, payload);
    setBusy(false);
    if (sub) {
      fireConfetti();
      onDone();
    } else {
      setError("Could not submit — please make sure you're signed in and try again.");
    }
  };

  return (
    <div className="space-y-5">
      {resubmissionOf && (
        <div className="rounded-xl border border-premium/40 bg-premium/10 px-4 py-3 text-xs font-semibold text-premium">
          Resubmission — your reviewer will see the previous attempt and feedback alongside this one.
        </div>
      )}

      {/* note */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
          What did you build? <span className="text-danger">*</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="3-5 lines: what you built, what broke, what you learned…"
          className="input-dark resize-y"
        />
      </div>

      {/* links */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Proof-of-work links</label>
        <div className="space-y-2">
          {links.map((row, i) => {
            const Icon = KIND_META[row.kind].Icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-zinc-400">
                  <Icon className="h-4 w-4" />
                </span>
                <select
                  value={row.kind}
                  onChange={(e) => patchLink(i, { kind: e.target.value as SubmissionKind })}
                  className="input-dark w-32 shrink-0 sm:w-40"
                >
                  {linkKinds.map((k) => (
                    <option key={k} value={k}>
                      {KIND_META[k].label}
                    </option>
                  ))}
                </select>
                <input
                  value={row.url}
                  onChange={(e) => patchLink(i, { url: e.target.value })}
                  placeholder="https://…"
                  className="input-dark min-w-0 flex-1"
                  type="url"
                />
                {links.length > 1 && (
                  <button
                    onClick={() => removeLink(i)}
                    className="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-danger"
                    aria-label="Remove link"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addLink} className="btn-ghost mt-2 px-3 py-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add another link
        </button>
      </div>

      {/* files */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Attachments <span className="font-normal normal-case text-zinc-500">(optional · max {MAX_FILES} · {fmtBytes(MAX_FILE_BYTES)} each)</span>
        </label>
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-center transition hover:border-brand/60 hover:bg-hover",
            files.length >= MAX_FILES && "pointer-events-none opacity-50"
          )}
        >
          <UploadCloud className="h-6 w-6 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-400">Click to attach images, PDFs or ZIPs</span>
          <span className="text-[11px] text-zinc-600">Bigger files? Share a Drive link above instead.</span>
          <input
            type="file"
            accept="image/*,.pdf,.zip"
            multiple
            className="hidden"
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
            disabled={files.length >= MAX_FILES}
          />
        </label>
        {fileError && <div className="mt-2 text-xs font-semibold text-danger">{fileError}</div>}
        {files.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 shrink-0 text-accent" />
                <span className="min-w-0 flex-1 truncate font-semibold text-zinc-300">{f.name}</span>
                <span className="shrink-0 text-zinc-500">{fmtBytes(f.size)}</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="shrink-0 rounded p-1 text-zinc-500 transition hover:text-danger"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* reflections */}
      {mission.reflectionQuestions.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Reflection</label>
          <div className="space-y-3">
            {mission.reflectionQuestions.map((q, i) => (
              <div key={i}>
                <div className="mb-1 text-xs text-zinc-400">{q}</div>
                <input
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers((a) => a.map((v, idx) => (idx === i ? e.target.value : v)))}
                  placeholder="Your honest answer…"
                  className="input-dark"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger">{error}</div>}

      {/* ARIA AI Pre-Flight Checker */}
      <AIAssignmentPreChecker
        note={note}
        links={links}
        checklistItems={mission.assignment.checklist}
        completedChecklistIndices={completedChecklistIndices}
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button onClick={handleSubmit} disabled={busy} className="btn-primary">
          <Send className="h-4 w-4" /> {resubmissionOf ? "Resubmit for review" : "Submit for review"}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- page --------------------------------- */

export default function MissionPage() {
  const params = useParams<{ missionId: string }>();
  const { hydrated, missionById, missionUnlocked, myProgress, submissionsForMission } = useApp();

  const [quizOpen, setQuizOpen] = useState(false);
  const [lessonRunnerOpen, setLessonRunnerOpen] = useState(false);
  const [showOptionalResources, setShowOptionalResources] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [resubmitFrom, setResubmitFrom] = useState<string | null>(null);

  const found = missionById(params.missionId);

  if (!hydrated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 w-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!found) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl pt-10">
          <EmptyState
            icon={<Compass className="h-8 w-8" />}
            title="Mission not found"
            text="This mission doesn't exist or was removed from the catalog. Head back to the skills catalog to keep building."
            action={
              <Link href="/skills" className="btn-primary">
                Browse skills
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const { skill, mission } = found as { skill: Skill; mission: Mission };
  const unlock = missionUnlocked(skill, mission.order);
  const subs = sortNewestFirst(submissionsForMission(mission.id));
  const latest: Submission | null = subs[0] ?? null;
  const approvedEntry = myProgress.completed[mission.id];
  const isApproved = Boolean(approvedEntry) || latest?.status === "APPROVED";
  const inReview = !isApproved && (latest?.status === "PENDING" || latest?.status === "UNDER_REVIEW");
  const kcDone = Boolean(myProgress.claimedMissions?.[`kc-${mission.id}`]);
  const nextMission = skill.missions.find((m) => m.order === mission.order + 1) ?? null;

  const prereqs = mission.prerequisites
    .map((id) => missionById(id))
    .filter((x): x is { skill: Skill; mission: Mission } => x !== null);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        {/* breadcrumb */}
        <Link
          href={`/learn/${skill.id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {skill.title}
        </Link>

        {/* header */}
        <Card className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ borderColor: `${skill.color}55`, background: `${skill.color}14`, color: skill.color }}
            >
              {mission.tier}
            </span>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold", DIFFICULTY_COLORS[mission.difficulty])}>
              {mission.difficulty}
            </span>
            {mission.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full border border-premium/40 bg-premium/10 px-2.5 py-0.5 text-[10px] font-bold text-premium">
                <Crown className="h-3 w-3" /> Pro
              </span>
            )}
            <span className="ml-auto">
              {isApproved ? <StatusPill status="APPROVED" /> : latest ? <StatusPill status={latest.status} /> : null}
            </span>
          </div>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Mission {mission.order} of {skill.missions.length}
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{mission.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" /> {fmtMinutes(mission.estimatedMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-warning">
              <Zap className="h-4 w-4" /> +{fmtNum(mission.xpReward)} XP
            </span>
            <span className="inline-flex items-center gap-1.5 text-accent">
              <Hexagon className="h-4 w-4 fill-accent/20" /> +{mission.neuronReward} Neurons
            </span>
          </div>
        </Card>

        {/* Gen-Z Motivational Hook Card */}
        <Card className="mb-5 border-brand/40 bg-gradient-to-br from-brand/20 via-surface to-base p-6 text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-widest text-brand">
            🔥 MISSION BRIEF · STEP 01
          </div>
          <h2 className="font-display text-xl font-black text-white sm:text-2xl">
            &ldquo;Bro, today&apos;s mission is to make AI obey your commands 😎. Let&apos;s turn you into a {skill.title} Wizard.&rdquo;
          </h2>
          <p className="text-xs text-zinc-300">
            No endless theory or boring lectures. Play through this 2-5 minute interactive Duolingo mission to master the concept.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setLessonRunnerOpen(true)}
              className="btn-primary w-full py-3.5 text-sm font-black shadow-[0_0_25px_rgba(232,80,2,0.5)] animate-pulse"
            >
              🚀 Launch Interactive Duolingo Mission (2-5 Mins)
            </button>
          </div>
        </Card>

        {/* 1 · Overview */}
        <Card className="mb-5">
          <SectionTitle>Mission Overview & Objectives</SectionTitle>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Target className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Objective</div>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-300">{mission.objective}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                <Trophy className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Expected outcome</div>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-300">{mission.expectedOutcome}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 2 · (Optional) Supplementary Learning Resources Drawer */}
        {mission.resources.length > 0 && (
          <Card className="mb-5">
            <div className="flex items-center justify-between">
              <SectionTitle>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-brand" /> (Optional) Supplementary Learning Resources
                </span>
              </SectionTitle>
              <button
                onClick={() => setShowOptionalResources((v) => !v)}
                className="text-xs font-bold text-brand hover:underline"
              >
                {showOptionalResources ? "Hide Resources ▲" : "Show Resources (Videos, PDFs, Templates) ▼"}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              * Optional reference materials for deep-diving. You can complete the mission directly via the interactive cards above.
            </p>
            {showOptionalResources && (
              <div className="space-y-3 pt-2">
                {mission.resources.map((res) => (
                  <ResourceRow key={res.id} resource={res} />
                ))}
              </div>
            )}
          </Card>
        )}

        {/* 3 · knowledge check */}
        {mission.quiz.length > 0 && (
          <Card className="mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white">Knowledge Check</div>
                <div className="text-xs text-zinc-400">
                  Test your understanding · {mission.quiz.length} questions ·{" "}
                  <span className="font-semibold text-warning">+15 XP</span>
                </div>
              </div>
              {kcDone ? (
                <span className="chip border-success/40 bg-success/10 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                </span>
              ) : (
                <button onClick={() => setQuizOpen(true)} className="btn-ghost px-4 py-2 text-xs">
                  Start check
                </button>
              )}
            </div>
          </Card>
        )}

        {/* 4 · assignment */}
        <Card className="mb-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" /> Assignment
            </span>
          </SectionTitle>
          <p className="text-sm leading-relaxed text-zinc-300">{mission.assignment.brief}</p>

          <div className="mt-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Deliverables</div>
            <ul className="space-y-2">
              {mission.assignment.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Execution checklist</div>
            <ul className="space-y-1.5">
              {mission.assignment.checklist.map((step, i) => {
                const done = Boolean(checked[i]);
                return (
                  <li key={i}>
                    <button
                      onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left text-sm transition hover:bg-hover",
                        done ? "text-zinc-500 line-through" : "text-zinc-300"
                      )}
                    >
                      {done ? (
                        <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      ) : (
                        <Square className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                      )}
                      {step}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {mission.reflectionQuestions.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Reflection questions</div>
              <ul className="space-y-2">
                {mission.reflectionQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-premium" />
                    {q}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-zinc-500">You&apos;ll answer these in the submission form below.</p>
            </div>
          )}
        </Card>

        {/* 7 · approved celebration */}
        {isApproved && (
          <div className="clay-card relative mb-5 overflow-hidden border-success/40 p-5 animate-scale-in sm:p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-success/20 blur-3xl" />
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                <PartyPopper className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold text-white">Mission approved — project shipped</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  This project is now in your portfolio. Rewards earned:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="chip border-warning/40 bg-warning/10 text-warning">
                    <Zap className="h-3.5 w-3.5" /> +{fmtNum(mission.xpReward)} XP
                  </span>
                  <span className="chip border-accent/40 bg-accent/10 text-accent">
                    <Hexagon className="h-3.5 w-3.5 fill-accent/20" /> +{mission.neuronReward} Neurons
                  </span>
                  {approvedEntry?.score !== undefined && (
                    <span className="chip border-success/40 bg-success/10 text-success">Score {approvedEntry.score}%</span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nextMission ? (
                    <Link href={`/mission/${nextMission.id}`} className="btn-primary text-xs">
                      Next mission: {nextMission.title} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link href={`/learn/${skill.id}`} className="btn-primary text-xs">
                      Back to skill map <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <Link href="/portfolio" className="btn-ghost text-xs">
                    View portfolio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5 · submission area */}
        {!isApproved && (
          <Card className="mb-5">
            <SectionTitle>
              <span className="inline-flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" /> Submit your work
              </span>
            </SectionTitle>

            {!unlock.unlocked ? (
              unlock.reason === "NEEDS_PRO" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-premium/15 text-premium">
                    <Crown className="h-6 w-6" />
                  </span>
                  <div className="font-display text-base font-bold text-white">This is a Pro mission</div>
                  <p className="max-w-sm text-sm text-zinc-400">
                    Missions 5-10 of every skill — the advanced, portfolio-defining projects — are part of SEL Pro.
                  </p>
                  <Link href="/pricing" className="btn-premium mt-1">
                    <Crown className="h-4 w-4" /> Upgrade to Pro
                  </Link>
                </div>
              ) : unlock.reason === "ADMIN_LOCKED" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-zinc-500">
                    <Lock className="h-6 w-6" />
                  </span>
                  <div className="font-display text-base font-bold text-white">Temporarily locked</div>
                  <p className="max-w-sm text-sm text-zinc-400">
                    An admin has locked this mission for now. Check back soon or continue with another skill.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-zinc-500">
                    <Lock className="h-6 w-6" />
                  </span>
                  <div className="font-display text-base font-bold text-white">Complete the previous mission first</div>
                  <p className="max-w-sm text-sm text-zinc-400">
                    Missions unlock in order — get your previous submission approved to open this one.
                  </p>
                  {prereqs.length > 0 && (
                    <Link href={`/mission/${prereqs[prereqs.length - 1].mission.id}`} className="btn-primary mt-1 text-xs">
                      Go to mission {prereqs[prereqs.length - 1].mission.order}
                    </Link>
                  )}
                </div>
              )
            ) : inReview && !resubmitFrom ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning">
                  <Clock3 className="h-6 w-6" />
                </span>
                <div className="font-display text-base font-bold text-white">Submission in review</div>
                <p className="max-w-sm text-sm text-zinc-400">
                  Your work is with the review team. You&apos;ll get a notification with feedback — approvals unlock the
                  next mission and add this project to your portfolio.
                </p>
                {latest && <div className="text-[11px] text-zinc-500">Submitted {fmtDateTime(latest.createdAt)}</div>}
              </div>
            ) : latest && !resubmitFrom ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-premium/15 text-premium">
                  <MessageSquare className="h-6 w-6" />
                </span>
                <div className="font-display text-base font-bold text-white">
                  {latest.status === "REJECTED" ? "Submission rejected" : "Needs another pass"}
                </div>
                <p className="max-w-sm text-sm text-zinc-400">
                  Read the feedback in the review thread below, improve your work, and resubmit. Resubmissions are
                  encouraged — that&apos;s how real work gets shipped.
                </p>
                <button onClick={() => setResubmitFrom(latest.id)} className="btn-primary mt-1">
                  <Send className="h-4 w-4" /> Resubmit
                </button>
              </div>
            ) : (
              <SubmissionForm
                key={resubmitFrom ?? "first"}
                mission={mission}
                completedChecklistIndices={Object.keys(checked).filter((k) => checked[Number(k)]).map(Number)}
                resubmissionOf={resubmitFrom ?? undefined}
                onDone={() => setResubmitFrom(null)}
                onCancel={resubmitFrom ? () => setResubmitFrom(null) : undefined}
              />
            )}
          </Card>
        )}

        {/* 6 · review thread */}
        {subs.length > 0 && (
          <Card className="mb-5">
            <SectionTitle>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Review thread
              </span>
            </SectionTitle>
            <div className="space-y-3">
              {subs.map((sub, i) => {
                const canResubmit =
                  i === 0 &&
                  !isApproved &&
                  unlock.unlocked &&
                  (sub.status === "NEEDS_IMPROVEMENT" || sub.status === "REJECTED");
                return (
                  <div key={sub.id} className="rounded-xl border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={sub.status} />
                      {sub.resubmissionOf && <span className="chip text-[10px]">Resubmission</span>}
                      <span className="ml-auto text-[11px] font-semibold text-zinc-500">{fmtDateTime(sub.createdAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-300">{sub.note}</p>
                    {sub.links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {sub.links.map((l, li) => {
                          const Icon = KIND_META[l.kind]?.Icon ?? Link2;
                          return (
                            <a
                              key={li}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="chip text-[10px] transition hover:border-brand/50 hover:text-white"
                            >
                              <Icon className="h-3 w-3" /> {KIND_META[l.kind]?.label ?? "Link"}
                            </a>
                          );
                        })}
                      </div>
                    )}
                    {(sub.feedback || sub.score !== undefined) && (
                      <div className="mt-3 rounded-lg border border-line bg-card p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Reviewer feedback
                          </span>
                          {sub.score !== undefined && (
                            <span className="text-xs font-bold text-success">Score {sub.score}%</span>
                          )}
                        </div>
                        {sub.feedback && <p className="mt-1 text-sm leading-relaxed text-zinc-300">{sub.feedback}</p>}
                      </div>
                    )}
                    {canResubmit && !resubmitFrom && (
                      <button onClick={() => setResubmitFrom(sub.id)} className="btn-ghost mt-3 px-4 py-2 text-xs">
                        <Send className="h-3.5 w-3.5" /> Resubmit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <AdSlot className="mt-8" />
      </div>

      {lessonRunnerOpen && (
        <InteractiveLessonRunner
          skill={skill}
          mission={mission}
          open={lessonRunnerOpen}
          onClose={() => setLessonRunnerOpen(false)}
        />
      )}

      {mission.quiz.length > 0 && (
        <AssessmentModal mission={mission} open={quizOpen} onClose={() => setQuizOpen(false)} />
      )}
    </AppShell>
  );
}
