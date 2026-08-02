"use client";

import { ArrowUpRight, Award, Calendar, GraduationCap, Milestone, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { EmptyState, PageHeader, SkeletonCard } from "@/components/ui";
import { findSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

export default function CertificatesPage() {
  const { hydrated, currentUser, state } = useApp();

  const certs = useMemo(
    () =>
      currentUser
        ? state.certificates
            .filter((c) => c.userId === currentUser.id)
            .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
        : [],
    [state.certificates, currentUser]
  );

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        icon={<Award className="h-5 w-5" />}
        title="Certificates"
        subtitle="Issued automatically when your phase (mission 5) and skill-completion (mission 10) projects are approved. Every certificate carries a public verification code."
      />

      {certs.length === 0 ? (
        <EmptyState
          icon={<Award className="h-10 w-10" />}
          title="No certificates yet"
          text="Certificates are earned by shipping, not by watching. Get your mission 5 project approved for a Phase Completion certificate, and mission 10 for the full Skill Completion certificate."
          action={
            <Link href="/skills" className="btn-primary">
              <Rocket className="h-4 w-4" /> Browse Skills
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => {
            const skill = findSkill(state.catalog, c.skillId);
            const isSkillComplete = (c.certType ?? (c.levelTier >= 10 ? "Skill Completion" : "Phase Completion")) !== "Phase Completion";
            const TypeIcon = isSkillComplete ? GraduationCap : Milestone;
            const accent = isSkillComplete ? "#8b5cf6" : "#06b6d4";
            return (
              <Link
                key={c.id}
                href={`/certificate/${c.id}`}
                className="card-glow group relative flex flex-col overflow-hidden p-5 animate-fade-up"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl"
                  style={{ background: accent }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${accent}1f`, color: accent }}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ borderColor: `${accent}45`, background: `${accent}14`, color: accent }}
                  >
                    {c.certType ?? (c.levelTier >= 10 ? "Skill Completion" : "Phase Completion")}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {skill && <SkillIcon name={skill.iconName} className="h-4 w-4 shrink-0" style={{ color: skill.color }} />}
                  <h3 className="font-display text-lg font-bold text-white">{skill?.title ?? c.skillId}</h3>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Issued {fmtDate(c.issuedAt)}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/60 pt-3.5">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                    <span className="truncate font-mono text-[11px] font-semibold text-zinc-400">{c.verificationCode}</span>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand transition group-hover:gap-1.5">
                    View <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
