"use client";

/* eslint-disable @next/next/no-img-element */
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Figma,
  Github,
  HardDrive,
  Link2,
  LucideIcon,
  MessageSquare,
  NotebookText,
  Palette,
  Paperclip,
  Play,
  RefreshCw,
  Search,
  XCircle,
  Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { fireBigConfetti } from "@/components/confetti";
import { EmptyState, Modal, SectionTitle, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { SubmissionKind, SubmissionStatus } from "@/lib/types";
import { cn, fmtBytes, timeAgo } from "@/lib/utils";

type Filter = "QUEUE" | "ALL" | SubmissionStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "QUEUE", label: "Review Queue" },
  { id: "PENDING", label: "Pending" },
  { id: "UNDER_REVIEW", label: "Under Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "NEEDS_IMPROVEMENT", label: "Needs Improvement" },
  { id: "REJECTED", label: "Rejected" },
  { id: "ALL", label: "All" },
];

const LINK_ICONS: Record<SubmissionKind, LucideIcon> = {
  TEXT: FileText,
  FILE: Paperclip,
  URL: Link2,
  GOOGLE_DRIVE: HardDrive,
  GITHUB: Github,
  FIGMA: Figma,
  CANVA: Palette,
  NOTION: NotebookText,
  YOUTUBE: Youtube,
};

export function AdminReviewsTab() {
  const { state, missionById, adminSetSubmissionStatus, adminReviewSubmission } = useApp();
  const [filter, setFilter] = useState<Filter>("QUEUE");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [scoreStr, setScoreStr] = useState("");

  const submissions = useMemo(() => {
    const sorted = [...state.submissions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (filter === "ALL") return sorted;
    if (filter === "QUEUE") return sorted.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW");
    return sorted.filter((s) => s.status === filter);
  }, [state.submissions, filter]);

  // derive from live state so the modal reflects status changes instantly
  const selected = selectedId ? state.submissions.find((s) => s.id === selectedId) ?? null : null;
  const selectedMission = selected ? missionById(selected.missionId) : null;
  const selectedStudent = selected ? state.users.find((u) => u.id === selected.userId) ?? null : null;

  const countFor = (f: Filter) => {
    if (f === "ALL") return state.submissions.length;
    if (f === "QUEUE")
      return state.submissions.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length;
    return state.submissions.filter((s) => s.status === f).length;
  };

  const openSubmission = (id: string) => {
    setSelectedId(id);
    setFeedback("");
    setScoreStr("");
  };

  const closeModal = () => setSelectedId(null);

  const parsedScore = (() => {
    if (!scoreStr.trim()) return undefined;
    const n = Number(scoreStr);
    if (Number.isNaN(n)) return undefined;
    return Math.max(0, Math.min(100, Math.round(n)));
  })();

  const decide = (verdict: "APPROVED" | "REJECTED" | "NEEDS_IMPROVEMENT") => {
    if (!selected || !feedback.trim()) return;
    const result = adminReviewSubmission(selected.id, verdict, feedback.trim(), parsedScore);
    if (result?.approved) void fireBigConfetti();
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "chip shrink-0 transition",
              filter === f.id && "border-brand/60 bg-brand/15 text-white"
            )}
          >
            {f.label}
            <span className="text-[10px] font-bold text-zinc-500">{countFor(f.id)}</span>
          </button>
        ))}
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-10 w-10" />}
          title="Queue clear"
          text={
            filter === "QUEUE"
              ? "No submissions waiting for review. New student projects land here the moment they're submitted."
              : "No submissions match this filter."
          }
        />
      ) : (
        <div className="space-y-2.5">
          {submissions.map((sub) => {
            const found = missionById(sub.missionId);
            const student = state.users.find((u) => u.id === sub.userId);
            return (
              <button
                key={sub.id}
                onClick={() => openSubmission(sub.id)}
                className="clay-card flex w-full items-center gap-3 p-4 text-left"
              >
                <UserAvatar user={student} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-white">{student?.name ?? "Unknown student"}</span>
                    <span className="text-[11px] text-zinc-500">{timeAgo(sub.createdAt)}</span>
                    {sub.resubmissionOf && (
                      <span className="chip px-2 py-0.5 text-[10px]">
                        <RefreshCw className="h-3 w-3" /> Resubmission
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">
                    {found ? (
                      <>
                        <span className="font-semibold text-zinc-300">{found.mission.title}</span>
                        <span className="mx-1.5 text-zinc-600">·</span>
                        {found.skill.title}
                      </>
                    ) : (
                      sub.missionId
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={sub.status} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* --------------------------- detail modal --------------------------- */}
      <Modal
        open={Boolean(selected)}
        onClose={closeModal}
        wide
        title={
          selected && (
            <span className="flex flex-wrap items-center gap-2">
              {selectedMission?.mission.title ?? "Submission"}
              <StatusPill status={selected.status} />
            </span>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            {/* student + mission meta */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-base/60 p-3">
              <UserAvatar user={selectedStudent} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white">{selectedStudent?.name ?? "Unknown student"}</div>
                <div className="truncate text-xs text-zinc-500">
                  {selectedMission
                    ? `${selectedMission.skill.title} · Mission ${selectedMission.mission.order}`
                    : selected.missionId}
                  <span className="mx-1.5 text-zinc-600">·</span>
                  {timeAgo(selected.createdAt)}
                </div>
              </div>
            </div>

            {/* note */}
            <div>
              <SectionTitle>Student note</SectionTitle>
              <p className="whitespace-pre-wrap rounded-xl border border-line bg-base/60 p-3.5 text-sm leading-relaxed text-zinc-300">
                {selected.note || "No written note provided."}
              </p>
            </div>

            {/* links */}
            {selected.links.length > 0 && (
              <div>
                <SectionTitle>Links</SectionTitle>
                <div className="space-y-2">
                  {selected.links.map((link, i) => {
                    const Icon = LINK_ICONS[link.kind] ?? Link2;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 rounded-xl border border-line bg-base/60 p-3 transition hover:border-brand/50 hover:bg-hover"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-brand" />
                        <span className="min-w-0 flex-1 truncate text-sm text-zinc-300 group-hover:text-white">
                          {link.label || link.url}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* files */}
            {selected.files.length > 0 && (
              <div>
                <SectionTitle>Files</SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selected.files.map((f, i) =>
                    f.dataUrl && f.mime.startsWith("image/") ? (
                      <div key={i} className="overflow-hidden rounded-xl border border-line bg-base/60">
                        <img src={f.dataUrl} alt={f.name} className="max-h-56 w-full object-contain" />
                        <div className="flex items-center justify-between gap-2 border-t border-line p-2.5">
                          <span className="truncate text-xs text-zinc-400">{f.name}</span>
                          <span className="shrink-0 text-[10px] text-zinc-500">{fmtBytes(f.size)}</span>
                        </div>
                      </div>
                    ) : f.dataUrl ? (
                      <a
                        key={i}
                        download={f.name}
                        href={f.dataUrl}
                        className="flex items-center gap-2.5 rounded-xl border border-line bg-base/60 p-3 transition hover:border-brand/50 hover:bg-hover"
                      >
                        <Download className="h-4 w-4 shrink-0 text-brand" />
                        <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">{f.name}</span>
                        <span className="shrink-0 text-[10px] text-zinc-500">{fmtBytes(f.size)}</span>
                      </a>
                    ) : (
                      <div key={i} className="flex items-center gap-2.5 rounded-xl border border-line bg-base/60 p-3">
                        <Paperclip className="h-4 w-4 shrink-0 text-zinc-500" />
                        <span className="min-w-0 flex-1 truncate text-sm text-zinc-400">{f.name}</span>
                        <span className="shrink-0 text-[10px] text-zinc-500">{fmtBytes(f.size)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* reflections */}
            {selected.reflections.length > 0 && (
              <div>
                <SectionTitle>Reflections</SectionTitle>
                <div className="space-y-2.5">
                  {selected.reflections.map((r, i) => (
                    <div key={i} className="rounded-xl border border-line bg-base/60 p-3.5">
                      <div className="flex items-start gap-2 text-xs font-semibold text-zinc-400">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        {r.question}
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-300">{r.answer || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* previous review outcome */}
            {(selected.status === "APPROVED" ||
              selected.status === "REJECTED" ||
              selected.status === "NEEDS_IMPROVEMENT") && (
              <div className="rounded-xl border border-line bg-base/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SectionTitle>Review outcome</SectionTitle>
                  {typeof selected.score === "number" && (
                    <span className="chip">Score: {selected.score}/100</span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-zinc-300">{selected.feedback || "No feedback recorded."}</p>
                {selected.reviewedAt && (
                  <p className="mt-2 text-[11px] text-zinc-500">Reviewed {timeAgo(selected.reviewedAt)}</p>
                )}
                <button
                  onClick={() => adminSetSubmissionStatus(selected.id, "UNDER_REVIEW")}
                  className="btn-ghost mt-3 px-4 py-2 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reopen review
                </button>
              </div>
            )}

            {/* actions */}
            {selected.status === "PENDING" && (
              <button
                onClick={() => adminSetSubmissionStatus(selected.id, "UNDER_REVIEW")}
                className="btn-primary w-full py-3"
              >
                <Search className="h-4 w-4" /> Start Review
              </button>
            )}

            {selected.status === "UNDER_REVIEW" && (
              <div className="space-y-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
                <SectionTitle>Verdict</SectionTitle>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Feedback for the student (required) — what worked, what to improve, next steps…"
                  rows={4}
                  className="input-dark resize-y"
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-zinc-400">Score (optional)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={scoreStr}
                    onChange={(e) => setScoreStr(e.target.value)}
                    placeholder="0–100"
                    className="input-dark w-28"
                  />
                </div>
                {!feedback.trim() && (
                  <p className="text-[11px] text-zinc-500">Write feedback to unlock the verdict buttons.</p>
                )}
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => decide("APPROVED")}
                    disabled={!feedback.trim()}
                    className="btn-primary py-2.5 text-xs"
                    style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 8px 24px -6px rgba(34,197,94,0.4)" }}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => decide("NEEDS_IMPROVEMENT")}
                    disabled={!feedback.trim()}
                    className="btn-premium py-2.5 text-xs"
                  >
                    <RefreshCw className="h-4 w-4" /> Needs Improvement
                  </button>
                  <button
                    onClick={() => decide("REJECTED")}
                    disabled={!feedback.trim()}
                    className="btn-danger py-2.5 text-xs"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            )}

            {selected.status === "PENDING" && (
              <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Play className="h-3 w-3" /> Start the review to unlock approve / reject actions.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
