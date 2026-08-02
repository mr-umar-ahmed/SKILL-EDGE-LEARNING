"use client";

import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Calendar,
  CloudOff,
  GraduationCap,
  Hexagon,
  Home,
  ShieldAlert,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui";
import { findSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

/* ------------------------------ public navbar ------------------------------ */

function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
            <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">Skill Edge Learning</span>
        </Link>
        <span className="chip">Certificate Verification</span>
      </div>
    </header>
  );
}

/* --------------------------------- page --------------------------------- */

export default function VerifyPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code ?? "").trim();
  const { state, hydrated } = useApp();

  const cert = state.certificates.find((c) => c.verificationCode.toUpperCase() === code.toUpperCase());
  const user = cert ? state.users.find((u) => u.id === cert.userId) : undefined;
  const skill = cert ? findSkill(state.catalog, cert.skillId) : undefined;

  if (!hydrated) {
    return (
      <div className="min-h-dvh">
        <PublicNav />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <Skeleton className="h-72 w-full rounded-card" />
        </main>
      </div>
    );
  }

  /* not resolvable on this device — honest, not an error */
  if (!cert) {
    return (
      <div className="flex min-h-dvh flex-col">
        <PublicNav />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="clay-card w-full max-w-lg space-y-5 p-8 text-center animate-scale-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-card text-zinc-400">
              <CloudOff className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-xl font-bold text-white">Not verifiable on this device</h1>
              <p className="text-sm leading-relaxed text-zinc-400">
                No certificate matching code <span className="font-mono font-semibold text-zinc-300">{code}</span> was
                found on this device. Skill Edge Learning currently stores records locally, so verification works on the
                device where the certificate was earned. Global cloud verification ships with our backend — soon.
              </p>
            </div>
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" /> Back to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const revoked = cert.status === "Revoked";
  const certType = cert.certType ?? (cert.levelTier >= 10 ? "Skill Completion" : "Phase Completion");

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicNav />
      <main className="flex flex-1 items-start justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-2xl animate-fade-up">
          {/* verdict banner */}
          <div
            className={
              revoked
                ? "flex items-center gap-4 rounded-t-[18px] border border-danger/40 bg-danger/10 p-5"
                : "flex items-center gap-4 rounded-t-[18px] border border-success/40 bg-success/10 p-5"
            }
          >
            <div
              className={
                revoked
                  ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/20 text-danger"
                  : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/20 text-success"
              }
            >
              {revoked ? <ShieldAlert className="h-6 w-6" /> : <BadgeCheck className="h-6 w-6" />}
            </div>
            <div>
              <div className={revoked ? "font-display text-lg font-bold text-danger" : "font-display text-lg font-bold text-success"}>
                {revoked ? "Certificate Revoked" : "Certificate Verified"}
              </div>
              <div className="text-xs text-zinc-400">
                {revoked
                  ? "This credential was issued but has since been revoked by Skill Edge Learning."
                  : "This is an authentic credential issued by Skill Edge Learning."}
              </div>
            </div>
          </div>

          {/* details */}
          <div className="rounded-b-[18px] border border-t-0 border-line bg-card p-6 shadow-card sm:p-8">
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <UserIcon className="h-3.5 w-3.5" /> Student
                </dt>
                <dd className="mt-1.5 font-display text-lg font-bold text-white">{user?.name ?? "Skill Edge Learner"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <GraduationCap className="h-3.5 w-3.5" /> Skill
                </dt>
                <dd className="mt-1.5 font-display text-lg font-bold" style={{ color: skill?.color ?? "#3b82f6" }}>
                  {skill?.title ?? cert.skillId}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <Award className="h-3.5 w-3.5" /> Certificate Type
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-zinc-300">{certType}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" /> Issued
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-zinc-300">{fmtDate(cert.issuedAt)}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-xl border border-line bg-base/60 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Verification Code</div>
              <div className="mt-1 break-all font-mono text-sm font-bold text-accent">{cert.verificationCode}</div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-5">
              <div className="break-all font-mono text-[11px] text-zinc-500">Certificate ID: {cert.id}</div>
              <Link href={`/certificate/${cert.id}`} className="btn-ghost px-4 py-2 text-xs">
                View Certificate <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500">
            Verification currently runs against records on this device. Global cloud verification ships with the Skill
            Edge Learning backend.
          </p>
        </div>
      </main>
    </div>
  );
}
