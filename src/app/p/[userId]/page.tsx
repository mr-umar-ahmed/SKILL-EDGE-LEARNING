"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Award,
  Calendar,
  CloudOff,
  Figma,
  FileText,
  Flame,
  FolderKanban,
  Github,
  HardDrive,
  Hexagon,
  Home,
  Link2,
  NotebookText,
  Palette,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Target,
  Youtube,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { UserAvatar } from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui";
import { badgeDef, findSkill, studentTierForXp } from "@/lib/data";
import { useApp } from "@/lib/store";
import type { SubmissionKind } from "@/lib/types";
import { cn, fmtDate, fmtNum } from "@/lib/utils";

/* ------------------------- link kind → lucide icon ------------------------- */

const LINK_META: Record<SubmissionKind, { Icon: typeof Link2; label: string }> = {
  TEXT: { Icon: FileText, label: "Write-up" },
  FILE: { Icon: Paperclip, label: "File" },
  URL: { Icon: Link2, label: "Link" },
  GOOGLE_DRIVE: { Icon: HardDrive, label: "Drive" },
  GITHUB: { Icon: Github, label: "GitHub" },
  FIGMA: { Icon: Figma, label: "Figma" },
  CANVA: { Icon: Palette, label: "Canva" },
  NOTION: { Icon: NotebookText, label: "Notion" },
  YOUTUBE: { Icon: Youtube, label: "YouTube" },
};

/* ------------------------------ public navbar ------------------------------ */

function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
            <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">Skill Edge Learning</span>
        </Link>
        <Link href="/register" className="btn-primary px-4 py-2 text-xs">
          Build Yours
        </Link>
      </div>
    </header>
  );
}

/* --------------------------------- page --------------------------------- */

export default function PublicPortfolioPage() {
  const params = useParams<{ userId: string }>();
  const userId = decodeURIComponent(params.userId ?? "");
  const { state, hydrated, portfolioFor } = useApp();

  const user = state.users.find((u) => u.id === userId);
  const items = useMemo(() => {
    const list = portfolioFor(userId);
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
  }, [portfolioFor, userId]);
  const certs = useMemo(
    () =>
      state.certificates
        .filter((c) => c.userId === userId && c.status !== "Revoked")
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
    [state.certificates, userId]
  );

  /* loading */
  if (!hydrated) {
    return (
      <div className="min-h-dvh">
        <PublicNav />
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div className="flex items-center gap-5">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* user not on this device */
  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col">
        <PublicNav />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="clay-card w-full max-w-lg space-y-5 p-8 text-center animate-scale-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-card text-zinc-400">
              <CloudOff className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-xl font-bold text-white">Portfolio not available on this device yet</h1>
              <p className="text-sm leading-relaxed text-zinc-400">
                Skill Edge Learning currently stores portfolios on the device where the account was created. This link
                works perfectly in the owner&apos;s browser — global public links arrive with cloud sync, which is
                shipping soon.
              </p>
            </div>
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" /> Explore Skill Edge Learning
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const tier = studentTierForXp(user.xp);

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {/* hero */}
        <section className="clay-card relative overflow-hidden p-6 sm:p-10 animate-fade-up">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: tier.hexColor }}
          />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand opacity-10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <UserAvatar user={user} size={104} className="ring-4 ring-brand/30" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{user.name}</h1>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold"
                  style={{ borderColor: `${tier.hexColor}55`, background: `${tier.hexColor}1a`, color: tier.hexColor }}
                >
                  <SkillIcon name={tier.iconName} className="h-3.5 w-3.5" />
                  {tier.name}
                </span>
              </div>
              {user.title && <p className="mt-1 text-sm font-semibold text-brand">{user.title}</p>}
              {user.bio && <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:mx-0">{user.bio}</p>}

              {/* badges */}
              {user.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {user.badges.map((id) => {
                    const b = badgeDef(id);
                    if (!b) return null;
                    return (
                      <span
                        key={id}
                        title={b.description}
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                        style={{ borderColor: `${b.color}45`, background: `${b.color}14`, color: b.color }}
                      >
                        <SkillIcon name={b.iconName} className="h-3 w-3" />
                        {b.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* stats */}
              <div className="mt-5 flex flex-wrap justify-center gap-4 sm:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="font-bold text-white">{fmtNum(user.xp)}</span>
                  <span className="text-zinc-500">XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FolderKanban className="h-4 w-4 text-brand" />
                  <span className="font-bold text-white">{fmtNum(items.length)}</span>
                  <span className="text-zinc-500">projects</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-premium" />
                  <span className="font-bold text-white">{fmtNum(certs.length)}</span>
                  <span className="text-zinc-500">certificates</span>
                </div>
                {user.streakCount > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-danger" />
                    <span className="font-bold text-white">{fmtNum(user.streakCount)}</span>
                    <span className="text-zinc-500">day streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* projects */}
        <section className="mt-10">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Shipped Projects</h2>
          {items.length === 0 ? (
            <div className="glass flex flex-col items-center gap-3 p-10 text-center">
              <FolderKanban className="h-9 w-9 text-zinc-500" />
              <div className="max-w-sm text-sm text-zinc-500">No public projects yet — the first one is on its way.</div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const skill = findSkill(state.catalog, item.skillId);
                const color = skill?.color ?? "#3b82f6";
                return (
                  <div
                    key={item.id}
                    className={cn("card-glow flex flex-col overflow-hidden animate-fade-up", item.featured && "ring-2 ring-premium/60")}
                  >
                    <div className="relative h-32 w-full overflow-hidden">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${color}26, rgba(11,15,25,0.9))` }}
                        >
                          <SkillIcon name={skill?.iconName ?? "Sparkles"} className="h-9 w-9 opacity-70" style={{ color }} />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      {item.featured && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-premium/40 bg-premium/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-premium backdrop-blur">
                          <Sparkles className="h-3 w-3" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div>
                        <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                        {item.description && (
                          <p className="mt-1 text-xs leading-relaxed text-zinc-400 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip">
                          <SkillIcon name={skill?.iconName ?? "Sparkles"} className="h-3.5 w-3.5" style={{ color }} />
                          {skill?.title ?? item.skillId}
                        </span>
                        {typeof item.score === "number" && (
                          <span className="chip border-success/40 bg-success/10 text-success">
                            <Target className="h-3.5 w-3.5" />
                            {item.score}/100
                          </span>
                        )}
                      </div>
                      {item.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.links.map((l, i) => {
                            const meta = LINK_META[l.kind] ?? LINK_META.URL;
                            const Icon = meta.Icon;
                            return (
                              <a
                                key={`${l.url}-${i}`}
                                href={l.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-base/60 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition hover:border-brand/50 hover:text-white"
                              >
                                <Icon className="h-3.5 w-3.5 text-brand" />
                                {l.label || meta.label}
                              </a>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-auto flex items-center gap-1.5 border-t border-line/60 pt-3 text-[11px] text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Shipped {fmtDate(item.completedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* certificates */}
        {certs.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Verified Certificates</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c) => {
                const skill = findSkill(state.catalog, c.skillId);
                return (
                  <Link key={c.id} href={`/certificate/${c.id}`} className="card-glow flex items-center gap-4 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-premium/15 text-premium">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-white">{skill?.title ?? c.skillId}</div>
                      <div className="text-[11px] text-zinc-400">
                        {c.certType ?? "Skill Completion"} · {fmtDate(c.issuedAt)}
                      </div>
                    </div>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* footer CTA */}
      <footer className="border-t border-line/60 bg-surface/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
            <Hexagon className="h-6 w-6 text-white" strokeWidth={2.5} />
          </span>
          <div>
            <div className="font-display text-lg font-bold text-white">Built on Skill Edge Learning</div>
            <p className="mt-1 max-w-md text-sm text-zinc-400">
              Real missions, real projects, real proof of skill. Start building a portfolio like this one today.
            </p>
          </div>
          <Link href="/register" className="btn-primary">
            Start Building Free
          </Link>
        </div>
      </footer>
    </div>
  );
}
