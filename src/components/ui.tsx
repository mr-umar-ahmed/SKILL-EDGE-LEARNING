"use client";

import { CheckCircle2, Clock3, Hexagon, RefreshCw, Search, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SubmissionStatus } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";

/* ------------------------------ progress ring ------------------------------ */

export function ProgressRing({
  progress,
  size = 64,
  stroke = 6,
  color = "#3b82f6",
  trackColor = "rgba(255,255,255,0.08)",
  children,
  className,
}: {
  progress: number; // 0-1
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 0.8s ease", filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ------------------------------ progress bar ------------------------------ */

export function ProgressBar({
  progress,
  className,
  height = 8,
}: {
  progress: number; // 0-1
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("progress-track w-full", className)} style={{ height }}>
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
    </div>
  );
}

/* --------------------------------- modal --------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "glass-strong relative m-0 max-h-[92dvh] w-full overflow-y-auto rounded-b-none rounded-t-3xl p-5 animate-scale-in sm:m-4 sm:rounded-3xl sm:p-6",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="font-display text-lg font-bold text-white">{title}</div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------- stat card -------------------------------- */

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "#3b82f6",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="clay-card relative overflow-hidden p-3.5 sm:p-4">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        {icon && <span style={{ color: accent }}>{icon}</span>}
      </div>
      <div className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{value}</div>
      {sub && <div className="mt-0.5 truncate text-[11px] text-zinc-400">{sub}</div>}
    </div>
  );
}

/* ------------------------------ section title ------------------------------ */

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{children}</h2>
      {action}
    </div>
  );
}

/* ------------------------------ page header ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 animate-fade-up">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-card text-brand">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------- empty state ------------------------------- */

export function EmptyState({
  icon,
  text,
  title,
  action,
}: {
  icon?: React.ReactNode;
  text: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center gap-3 p-10 text-center">
      {icon && <div className="text-zinc-500">{icon}</div>}
      {title && <div className="font-display text-base font-semibold text-white">{title}</div>}
      <div className="max-w-sm text-sm text-zinc-500">{text}</div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/* -------------------------------- skeleton -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="clay-card space-y-3 p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

/* ---------------------------- animated number ---------------------------- */

export function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{fmtNum(display)}</>;
}

/* ------------------------------ neuron badge ------------------------------ */

export function NeuronBadge({ amount, className, size = 14 }: { amount: number; className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold text-accent", className)}>
      <Hexagon style={{ width: size, height: size }} className="fill-accent/20" strokeWidth={2} />
      <AnimatedNumber value={amount} />
    </span>
  );
}

/* ------------------------------ status pill ------------------------------ */

const STATUS_META: Record<SubmissionStatus, { cls: string; label: string; Icon: typeof Clock3 }> = {
  PENDING: { cls: "status-pending", label: "Pending", Icon: Clock3 },
  UNDER_REVIEW: { cls: "status-review", label: "Under Review", Icon: Search },
  APPROVED: { cls: "status-approved", label: "Approved", Icon: CheckCircle2 },
  REJECTED: { cls: "status-rejected", label: "Rejected", Icon: XCircle },
  NEEDS_IMPROVEMENT: { cls: "status-improve", label: "Needs Improvement", Icon: RefreshCw },
};

export function StatusPill({ status }: { status: SubmissionStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.Icon;
  return (
    <span className={meta.cls}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}
