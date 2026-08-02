"use client";

import {
  Activity,
  ChevronRight,
  Clock3,
  Flame,
  Lock,
  Megaphone,
  PlayCircle,
  Quote,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AdSlot, UpgradeBanner } from "@/components/ads/AdSlot";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import {
  AnimatedNumber,
  NeuronBadge,
  PageHeader,
  ProgressBar,
  ProgressRing,
  SectionTitle,
  Skeleton,
  SkeletonCard,
  StatCard,
  StatusPill,
} from "@/components/ui";
import { QUOTES, STUDENT_TIERS, findMission, studentTierForXp } from "@/lib/data";
import { useApp } from "@/lib/store";
import type { Mission, Skill } from "@/lib/types";
import { fmtMinutes, fmtNum, levelForXp, timeAgo } from "@/lib/utils";

interface HeroPick {
  skill: Skill;
  mission: Mission;
  needsPro: boolean;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-14 w-full" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Skeleton className="h-56 w-full" />
          <SkeletonCard />
        </div>
        <div className="space-y-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { hydrated, currentUser, catalog, myProgress, mySubmissions, missionUnlocked, state } = useApp();

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const user = currentUser;
  const firstName = user.name.split(/\s+/)[0] || user.name;

  /* daily quote — rotated by day of year */
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  /* per-skill progress */
  const completed = myProgress.completed;
  const skillProgress = catalog.map((skill) => {
    const done = skill.missions.filter((m) => completed[m.id]).length;
    const total = skill.missions.length;
    return { skill, done, total, pct: total ? done / total : 0 };
  });
  const continueLearning = skillProgress.filter((s) => s.done > 0 && s.done < s.total);

  /* leaderboard rank by XP */
  const rank = [...state.users].sort((a, b) => b.xp - a.xp).findIndex((u) => u.id === user.id) + 1;

  /* submissions awaiting a verdict */
  const pendingReviews = mySubmissions.filter(
    (s) => s.status === "PENDING" || s.status === "UNDER_REVIEW" || s.status === "NEEDS_IMPROVEMENT"
  );
  const awaitingIds = new Set(
    mySubmissions.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").map((s) => s.missionId)
  );

  /* today's mission — first unlocked-but-uncompleted mission, in-progress skills first */
  const orderedSkills = [...skillProgress].sort(
    (a, b) => Number(!(a.done > 0 && a.done < a.total)) - Number(!(b.done > 0 && b.done < b.total))
  );
  let hero: HeroPick | null = null;
  let proPick: HeroPick | null = null;
  for (const sp of orderedSkills) {
    const next = sp.skill.missions.find((m) => !completed[m.id]);
    if (!next || awaitingIds.has(next.id)) continue;
    const unlock = missionUnlocked(sp.skill, next.order);
    if (unlock.unlocked) {
      hero = { skill: sp.skill, mission: next, needsPro: false };
      break;
    }
    if (unlock.reason === "NEEDS_PRO" && !proPick) proPick = { skill: sp.skill, mission: next, needsPro: true };
  }
  const todays = hero ?? proPick;

  /* activity + announcements */
  const myTxns = state.transactions.filter((t) => t.userId === user.id).slice(0, 6);
  const announcements = state.announcements.slice(0, 3);

  /* student tier */
  const tier = studentTierForXp(user.xp);
  const nextTier = STUDENT_TIERS.find((t) => t.tierNumber === tier.tierNumber + 1) ?? null;
  const tierPct = nextTier ? Math.min(1, (user.xp - tier.minXp) / Math.max(1, nextTier.minXp - tier.minXp)) : 1;

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Your skill operating system is live. Ship something today."
      />

      {/* daily quote */}
      <div className="glass mb-5 flex items-start gap-3 p-4 animate-fade-up">
        <Quote className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-sm text-zinc-300">
          {quote.text} <span className="text-xs font-semibold text-zinc-500">— {quote.author}</span>
        </p>
      </div>

      {/* stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up">
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
          icon={<Sparkles className="h-4 w-4" />}
          accent="#06b6d4"
        />
        <StatCard
          label="Streak"
          value={
            <>
              <AnimatedNumber value={user.streakCount} /> days
            </>
          }
          sub="Keep it alive daily"
          icon={<Flame className="h-4 w-4" />}
          accent="#f97316"
        />
        <StatCard
          label="Rank"
          value={rank > 0 ? `#${rank}` : "—"}
          sub={`of ${fmtNum(state.users.length)} learners`}
          icon={<Trophy className="h-4 w-4" />}
          accent="#facc15"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* ------------------------------ main column ------------------------------ */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* today's mission hero */}
          <section className="animate-fade-up">
            <SectionTitle>Today&apos;s Mission</SectionTitle>
            {todays ? (
              <div className="card-glow relative overflow-hidden p-5 sm:p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
                  style={{ background: todays.needsPro ? "#8b5cf6" : todays.skill.color }}
                />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip">
                      <SkillIcon
                        name={todays.skill.iconName}
                        className="h-3.5 w-3.5"
                        style={{ color: todays.skill.color }}
                      />
                      {todays.skill.title}
                    </span>
                    <span className="chip">
                      Mission {todays.mission.order} of {todays.skill.missions.length}
                    </span>
                    {todays.needsPro && (
                      <span className="chip border-premium/40 bg-premium/10 text-premium">
                        <Lock className="h-3 w-3" /> Pro
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                    {todays.mission.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm text-zinc-400">{todays.mission.objective}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" /> {fmtMinutes(todays.mission.estimatedMinutes)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-brand">
                      <Zap className="h-3.5 w-3.5" /> +{todays.mission.xpReward} XP
                    </span>
                    <NeuronBadge amount={todays.mission.neuronReward} className="text-xs" />
                    <span className="chip px-2.5 py-0.5">{todays.mission.difficulty}</span>
                  </div>
                  <div className="mt-5">
                    {todays.needsPro ? (
                      <Link href="/pricing" className="btn-premium">
                        <Sparkles className="h-4 w-4" /> Unlock with Pro
                      </Link>
                    ) : (
                      <Link href={`/mission/${todays.mission.id}`} className="btn-primary">
                        <PlayCircle className="h-4 w-4" /> Start Mission
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass flex flex-col items-center gap-2 p-8 text-center">
                <Target className="h-6 w-6 text-brand" />
                <div className="font-display text-base font-semibold text-white">All caught up</div>
                <p className="max-w-sm text-sm text-zinc-500">
                  {awaitingIds.size > 0
                    ? "Your latest work is under review — feedback (and rewards) land soon."
                    : "You've completed every available mission. New skills are on the way."}
                </p>
              </div>
            )}
          </section>

          {/* continue learning */}
          {continueLearning.length > 0 && (
            <section className="animate-fade-up">
              <SectionTitle
                action={
                  <Link href="/skills" className="text-xs font-semibold text-brand hover:underline">
                    All skills
                  </Link>
                }
              >
                Continue Learning
              </SectionTitle>
              <div className="space-y-3">
                {continueLearning.slice(0, 4).map(({ skill, done, total, pct }) => (
                  <Link
                    key={skill.id}
                    href={`/learn/${skill.id}`}
                    className="clay-card group flex items-center gap-4 p-4"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${skill.color}1f`, color: skill.color }}
                    >
                      <SkillIcon name={skill.iconName} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-white">{skill.title}</span>
                        <span className="shrink-0 text-xs font-semibold text-zinc-400">
                          {done}/{total} missions
                        </span>
                      </div>
                      <ProgressBar progress={pct} className="mt-2" height={6} />
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-brand" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* skills overview */}
          <section className="animate-fade-up">
            <SectionTitle
              action={
                <Link href="/skills" className="text-xs font-semibold text-brand hover:underline">
                  Explore catalog
                </Link>
              }
            >
              Skills Overview
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {skillProgress.map(({ skill, done, total, pct }, i) => (
                <Link
                  key={skill.id}
                  href={`/learn/${skill.id}`}
                  className="clay-card flex items-center gap-3.5 p-4 animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProgressRing progress={pct} size={52} stroke={5} color={skill.color}>
                    <SkillIcon name={skill.iconName} className="h-5 w-5" style={{ color: skill.color }} />
                  </ProgressRing>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{skill.title}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">
                      {done > 0 ? `${done}/${total} complete` : skill.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* pending reviews */}
          <section className="animate-fade-up">
            <SectionTitle>Pending Reviews</SectionTitle>
            {pendingReviews.length > 0 ? (
              <div className="clay-card divide-y divide-line/60">
                {pendingReviews.slice(0, 5).map((sub) => {
                  const found = findMission(state.catalog, sub.missionId);
                  return (
                    <Link
                      key={sub.id}
                      href={`/mission/${sub.missionId}`}
                      className="flex items-center justify-between gap-3 p-4 transition hover:bg-hover/40"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {found?.mission.title ?? sub.missionId}
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">
                          {found?.skill.title ?? "Mission"} · {timeAgo(sub.createdAt)}
                        </div>
                      </div>
                      <StatusPill status={sub.status} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="glass p-5 text-sm text-zinc-500">
                Nothing in review — ship your next mission and it&apos;ll show up here.
              </div>
            )}
          </section>
        </div>

        {/* ------------------------------ side column ------------------------------ */}
        <div className="min-w-0 space-y-6">
          {/* student tier */}
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
            </div>
          </section>

          {/* announcements */}
          <section className="animate-fade-up">
            <SectionTitle>Announcements</SectionTitle>
            <div className="clay-card p-5">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                        <Megaphone className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white">{a.title}</div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-400">{a.body}</p>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                          {timeAgo(a.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No announcements right now.</p>
              )}
            </div>
          </section>

          {/* recent activity */}
          <section className="animate-fade-up">
            <SectionTitle>Recent Activity</SectionTitle>
            <div className="clay-card p-5">
              {myTxns.length > 0 ? (
                <div className="space-y-3.5">
                  {myTxns.map((t) => (
                    <div key={t.id} className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-hover text-zinc-400">
                          <Activity className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-medium text-zinc-300">{t.note}</div>
                          <div className="text-[10px] text-zinc-600">{timeAgo(t.createdAt)}</div>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold ${t.amountNeurons >= 0 ? "text-success" : "text-danger"}`}
                      >
                        {t.amountNeurons >= 0 ? "+" : ""}
                        {fmtNum(t.amountNeurons)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No activity yet — your first mission changes that.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* below the fold — free users only */}
      <UpgradeBanner className="mt-8" />

      <AdSlot className="mt-8" />
    </AppShell>
  );
}
