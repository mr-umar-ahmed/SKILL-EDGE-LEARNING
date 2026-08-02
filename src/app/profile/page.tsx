"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Flame,
  FolderOpen,
  Lock,
  Mail,
  Pencil,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { UserAvatar } from "@/components/UserAvatar";
import {
  AnimatedNumber,
  EmptyState,
  NeuronBadge,
  PageHeader,
  ProgressBar,
  SectionTitle,
  Skeleton,
  SkeletonCard,
  StatCard,
} from "@/components/ui";
import { BADGES, STUDENT_TIERS, findSkill, studentTierForXp } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, fmtDate, fmtNum, isPaidPlan, levelForXp, planDef, timeAgo, todayKey } from "@/lib/utils";

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-44 w-full" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { hydrated, currentUser, myProgress, myPortfolio, state, updateProfile } = useApp();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", title: "", bio: "" });

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <ProfileSkeleton />
      </AppShell>
    );
  }

  const user = currentUser;
  const plan = planDef(user.subscription.plan);
  const paid = isPaidPlan(user.subscription);
  const approvedCount = Object.keys(myProgress.completed).length;
  const myCerts = state.certificates.filter((c) => c.userId === user.id);
  const portfolioPreview = [...myPortfolio]
    .filter((p) => !p.hidden)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);
  const earnedBadges = user.badges.length;

  /* student tier */
  const tier = studentTierForXp(user.xp);
  const nextTier = STUDENT_TIERS.find((t) => t.tierNumber === tier.tierNumber + 1) ?? null;
  const tierPct = nextTier ? Math.min(1, (user.xp - tier.minXp) / Math.max(1, nextTier.minXp - tier.minXp)) : 1;

  /* streak — last 14 days, reconstructed from streakCount ending at lastActiveDay */
  const activeDays = new Set<string>();
  if (user.lastActiveDay) {
    const last = new Date(`${user.lastActiveDay}T00:00:00`);
    for (let i = 0; i < Math.min(user.streakCount, 60); i++) {
      const d = new Date(last);
      d.setDate(last.getDate() - i);
      activeDays.add(todayKey(d));
    }
  }
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = todayKey(d);
    return {
      key,
      weekday: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1),
      active: activeDays.has(key),
      isToday: i === 13,
    };
  });

  const startEdit = () => {
    setDraft({ name: user.name, title: user.title ?? "", bio: user.bio ?? "" });
    setEditing(true);
  };
  const saveEdit = () => {
    if (!draft.name.trim()) return;
    updateProfile({ name: draft.name.trim(), title: draft.title.trim(), bio: draft.bio.trim() });
    setEditing(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Profile"
        subtitle="Your builder identity — stats, badges, certificates and shipped work."
        icon={<UserRound className="h-5 w-5" />}
      />

      {/* profile header card */}
      <div className="card-glow relative overflow-hidden p-5 sm:p-6 animate-fade-up">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand opacity-10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <UserAvatar user={user} size={88} className="ring-2 ring-brand/40 ring-offset-2 ring-offset-card" />

          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="input-dark"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Your name"
                    maxLength={60}
                  />
                  <input
                    className="input-dark"
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Title (e.g. Builder in Training)"
                    maxLength={60}
                  />
                </div>
                <textarea
                  className="input-dark min-h-[84px] resize-y"
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  placeholder="A short bio — what are you building?"
                  maxLength={280}
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} disabled={!draft.name.trim()} className="btn-primary px-4 py-2 text-xs">
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-ghost px-4 py-2 text-xs">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{user.name}</h2>
                  <span
                    className={cn(
                      "chip px-2.5 py-0.5 text-[11px]",
                      paid && "border-premium/40 bg-premium/10 text-premium"
                    )}
                  >
                    {paid && <Crown className="h-3 w-3" />}
                    {plan.name}
                  </span>
                  <span className="chip px-2.5 py-0.5 text-[11px]">Level {levelForXp(user.xp)}</span>
                </div>
                {user.title && <div className="mt-1 text-sm font-semibold text-brand">{user.title}</div>}
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                  {user.bio || "No bio yet — tell the world what you're building."}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> Joined {fmtDate(user.createdAt)}
                  </span>
                </div>
              </>
            )}
          </div>

          {!editing && (
            <button onClick={startEdit} className="btn-ghost shrink-0 self-start px-4 py-2 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* stats grid */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up">
        <StatCard
          label="Total XP"
          value={<AnimatedNumber value={user.xp} />}
          sub={`Level ${levelForXp(user.xp)}`}
          icon={<Zap className="h-4 w-4" />}
          accent="#3b82f6"
        />
        <StatCard
          label="Neurons"
          value={<NeuronBadge amount={user.neurons} size={18} className="text-xl" />}
          sub="Wallet balance"
          icon={<Award className="h-4 w-4" />}
          accent="#06b6d4"
        />
        <StatCard
          label="Streak"
          value={
            <>
              <AnimatedNumber value={user.streakCount} /> days
            </>
          }
          sub={user.lastActiveDay === todayKey() ? "Active today" : "Show up today"}
          icon={<Flame className="h-4 w-4" />}
          accent="#f97316"
        />
        <StatCard
          label="Projects"
          value={<AnimatedNumber value={approvedCount} />}
          sub="Approved missions"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="#22c55e"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* ------------------------------ main column ------------------------------ */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* badges wall */}
          <section className="animate-fade-up">
            <SectionTitle
              action={
                <span className="text-xs font-semibold text-zinc-500">
                  {earnedBadges} of {BADGES.length} earned
                </span>
              }
            >
              Badges
            </SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BADGES.map((b) => {
                const earned = user.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={cn("clay-card relative p-4", !earned && "opacity-45 saturate-0")}
                    title={earned ? b.description : `Locked — ${b.description}`}
                  >
                    {!earned && <Lock className="absolute right-3 top-3 h-3.5 w-3.5 text-zinc-500" />}
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${b.color}1f`, color: b.color }}
                    >
                      <SkillIcon name={b.iconName} className="h-5 w-5" />
                    </div>
                    <div className="mt-2.5 text-sm font-semibold text-white">{b.name}</div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500">{b.description}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* portfolio preview */}
          <section className="animate-fade-up">
            <SectionTitle
              action={
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  View portfolio <ChevronRight className="h-3 w-3" />
                </Link>
              }
            >
              Portfolio
            </SectionTitle>
            {portfolioPreview.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {portfolioPreview.map((p) => {
                  const skill = findSkill(state.catalog, p.skillId);
                  return (
                    <Link key={p.id} href="/portfolio" className="clay-card group overflow-hidden">
                      <div className="relative h-24 w-full overflow-hidden bg-hover">
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ background: `${skill?.color ?? "#3b82f6"}14` }}
                          >
                            <SkillIcon
                              name={skill?.iconName ?? "Sparkles"}
                              className="h-7 w-7"
                              style={{ color: skill?.color ?? "#3b82f6" }}
                            />
                          </div>
                        )}
                        {typeof p.score === "number" && (
                          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-success backdrop-blur">
                            {p.score}/100
                          </span>
                        )}
                      </div>
                      <div className="p-3.5">
                        <div className="line-clamp-1 text-sm font-semibold text-white">{p.title}</div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">{timeAgo(p.completedAt)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<FolderOpen className="h-7 w-7" />}
                title="No shipped projects yet"
                text="Every approved mission becomes a portfolio piece. Start a mission and build your first one."
                action={
                  <Link href="/skills" className="btn-primary px-4 py-2 text-xs">
                    Browse skills
                  </Link>
                }
              />
            )}
          </section>

          {/* certificates strip */}
          <section className="animate-fade-up">
            <SectionTitle
              action={
                myCerts.length > 0 ? (
                  <Link href="/certificates" className="text-xs font-semibold text-brand hover:underline">
                    All certificates
                  </Link>
                ) : undefined
              }
            >
              Certificates
            </SectionTitle>
            {myCerts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {myCerts.slice(0, 4).map((c) => {
                  const skill = findSkill(state.catalog, c.skillId);
                  return (
                    <Link key={c.id} href={`/certificate/${c.id}`} className="clay-card group flex items-center gap-3.5 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">
                          {skill?.title ?? c.skillId}
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">
                          {c.certType ?? "Certificate"} · {fmtDate(c.issuedAt)}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-zinc-600">{c.verificationCode}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-brand" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="glass p-5 text-sm text-zinc-500">
                Complete mission 5 or 10 of any skill to earn verifiable certificates.
              </div>
            )}
          </section>
        </div>

        {/* ------------------------------ side column ------------------------------ */}
        <div className="min-w-0 space-y-6">
          {/* student tier progress */}
          <section className="animate-fade-up">
            <SectionTitle>Student Tier</SectionTitle>
            <div className="clay-card p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${tier.hexColor}1f`, color: tier.hexColor }}
                >
                  <SkillIcon name={tier.iconName} className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-bold text-white">{tier.name}</div>
                  <div className="text-[11px] text-zinc-500">
                    Tier {tier.tierNumber} of {STUDENT_TIERS.length}
                  </div>
                </div>
              </div>
              <ProgressBar progress={tierPct} className="mt-4" height={8} />
              <div className="mt-2 text-[11px] font-semibold text-zinc-400">
                {nextTier
                  ? `${fmtNum(Math.max(0, nextTier.minXp - user.xp))} XP to ${nextTier.name}`
                  : "Top tier reached — legendary."}
              </div>
              {nextTier && (
                <div className="mt-3 border-t border-line/60 pt-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Next: {nextTier.name}
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {nextTier.requirements.slice(0, 3).map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* streak — last 14 days */}
          <section className="animate-fade-up">
            <SectionTitle>Streak</SectionTitle>
            <div className="clay-card p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">{user.streakCount}-day streak</div>
                  <div className="text-[11px] text-zinc-500">Last 14 days</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {last14.map((d) => (
                  <div key={d.key} className="flex flex-col items-center gap-1">
                    <div
                      title={d.key}
                      className={cn(
                        "h-8 w-full rounded-md border transition",
                        d.active
                          ? "border-transparent bg-gradient-to-b from-orange-400 to-danger shadow-[0_0_10px_rgba(249,115,22,0.35)]"
                          : "border-line bg-base",
                        d.isToday && !d.active && "border-brand/60"
                      )}
                    />
                    <span className={cn("text-[9px] font-semibold", d.isToday ? "text-brand" : "text-zinc-600")}>
                      {d.weekday}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-zinc-500">
                {user.lastActiveDay === todayKey()
                  ? "You showed up today. Momentum compounds."
                  : "Complete any mission activity today to keep the flame alive."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
