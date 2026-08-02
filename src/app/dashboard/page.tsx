"use client";

import {
  Award,
  ChevronRight,
  Coins,
  Flame,
  Layers,
  Lock,
  Quote,
  Sparkles,
  Swords,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { ProgressRing, SectionTitle, StatCard } from "@/components/ui";
import { QUOTES, STUDENT_TIERS, getSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { XP_THRESHOLDS, fmtDateTime, fmtNum, levelForXp, msUntil, studentTierForXp, timeAgo, xpProgress } from "@/lib/utils";

function dayOfYear() {
  const now = new Date();
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
}

export default function DashboardPage() {
  const { state, currentUser, skills, myProgress, isLevelUnlocked } = useApp();
  const quote = QUOTES[dayOfYear() % QUOTES.length];
  const badgeLevel = levelForXp(currentUser.xp);
  const nextXp = badgeLevel < 10 ? XP_THRESHOLDS[badgeLevel] : null;
  const myCerts = state.certificates.filter((c) => c.userId === currentUser.id);
  const myTxns = state.transactions.filter((t) => t.userId === currentUser.id).slice(0, 6);
  const upcoming = state.quizzes
    .filter((q) => q.isActive && !q.winnersDeclared)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Bento Row 1: Hero & XP Level */}
        <div className="bento-grid">
          {/* Bento Card 1: Claymorphic Welcome Hero (Span 2) */}
          <div className="clay-card bento-span-2 relative overflow-hidden p-6 sm:p-8">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="chip border-amber-400/40 bg-amber-500/10 text-amber-300 font-mono text-xs">
                    🔥 {currentUser.streakCount} Day Cyber Streak
                  </span>
                  <span className="chip border-cyan-400/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
                    {currentUser.title || "Learner"}
                  </span>
                </div>
                <h1 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Welcome back, <span className="text-amber-400">{currentUser.name.split(" ")[0]}</span> {currentUser.avatar}
                </h1>
                <p className="mt-1 text-xs text-zinc-400">
                  Master 12 trending real-world skills through 10-tier level progression.
                </p>
              </div>

              <div className="glass mt-4 flex items-start gap-3 p-4">
                <Quote className="h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.75} />
                <div>
                  <p className="text-xs italic text-zinc-200">&ldquo;{quote.text}&rdquo;</p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-400">— {quote.author}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Claymorphic XP Ring & Level Progress */}
          <div className="clay-card flex flex-col items-center justify-center p-6 text-center">
            <ProgressRing progress={xpProgress(currentUser.xp)} size={100} stroke={8} color="#eab308">
              <div className="text-center">
                <div className="font-mono text-3xl font-black text-white">{badgeLevel}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Level</div>
              </div>
            </ProgressRing>
            <div className="mt-3">
              <div className="font-mono font-bold text-white text-base">{fmtNum(currentUser.xp)} XP</div>
              <div className="mt-0.5 text-xs text-zinc-400">
                {nextXp ? `${fmtNum(nextXp - currentUser.xp)} XP to LVL ${badgeLevel + 1}` : "Max level reached!"}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Row 2: 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="EdgeCoins"
            value={<span className="text-amber-300">ↁ{fmtNum(currentUser.edgeCoins)}</span>}
            sub="≈ ₹0.50 per coin"
            icon={<Coins className="h-4 w-4" strokeWidth={1.75} />}
            accent="#eab308"
          />
          <StatCard
            label="Active Streak"
            value={
              <span className="flex items-center gap-1.5 text-orange-400">
                {currentUser.streakCount} <Flame className="h-5 w-5 fill-orange-400/20" strokeWidth={1.75} />
              </span>
            }
            sub="days in a row"
            icon={<Flame className="h-4 w-4" strokeWidth={1.75} />}
            accent="#f97316"
          />
          <StatCard
            label="Total XP"
            value={fmtNum(currentUser.xp)}
            sub={`Level ${badgeLevel} of 10`}
            icon={<Zap className="h-4 w-4" strokeWidth={1.75} />}
            accent="#8b5cf6"
          />
          <StatCard
            label="Certificates"
            value={myCerts.length}
            sub="verified credentials"
            icon={<Award className="h-4 w-4" strokeWidth={1.75} />}
            accent="#06b6d4"
          />
        </div>

        {/* Student Tier System Progression Card */}
        <div className="clay-card p-6 space-y-4">
          <SectionTitle>Student Tier System Progression</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STUDENT_TIERS.map((t) => {
              const activeTier = studentTierForXp(currentUser.xp);
              const isUnlocked = currentUser.xp >= t.minXp;
              const isCurrent = activeTier.tierNumber === t.tierNumber;

              return (
                <div
                  key={t.tierNumber}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? "neo-box bg-amber-500/20 border-amber-400 scale-105 shadow-xl"
                      : isUnlocked
                      ? "bg-white/5 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/5 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="font-bold text-xs text-white">{t.name}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-1">
                    {t.minXp === 0 ? "0 XP" : `${fmtNum(t.minXp)} XP`}
                  </div>
                  {isCurrent && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold font-mono uppercase">
                      ACTIVE TIER
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates Strip */}
        {myCerts.length > 0 && (
          <div>
            <SectionTitle>Your Certified Credentials</SectionTitle>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {myCerts.map((c) => {
                const skill = getSkill(c.skillId);
                return (
                  <Link
                    key={c.id}
                    href={`/certificate/${c.id}`}
                    className="clay-card flex min-w-60 items-center gap-3 p-3.5 transition hover:scale-105"
                  >
                    <Award className="h-8 w-8 shrink-0 text-amber-400" strokeWidth={1.75} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-white">{skill?.title}</div>
                      <div className="font-mono text-[11px] text-zinc-400">Tier {c.levelTier} · Hash: {c.verificationCode}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Master Bento Grid: Skill Showcase with Realistic Images */}
        <div>
          <SectionTitle
            action={
              <span className="font-mono text-xs text-zinc-400">
                {Object.keys(myProgress.completed).length} / 120 levels cleared
              </span>
            }
          >
            🎯 12 Real-World Skills Hub
          </SectionTitle>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map((skill) => {
              const done = skill.levels.filter((l) => myProgress.completed[l.id]).length;
              const nextLevel = skill.levels.find((l) => !myProgress.completed[l.id]);
              const nextUnlocked = nextLevel ? isLevelUnlocked(skill, nextLevel.levelNumber) : false;

              return (
                <div
                  key={skill.id}
                  className="clay-card group relative flex flex-col justify-between overflow-hidden p-0 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Skill Realistic Media Cover Banner */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={skill.imageUrl}
                      alt={skill.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute left-3 top-3">
                      <span className="chip border-white/20 bg-black/60 font-mono text-[10px] text-white backdrop-blur-md">
                        {skill.category}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <ProgressRing progress={done / 10} size={36} stroke={4} color={skill.color}>
                        <span className="font-mono text-[10px] font-bold text-white">{done}</span>
                      </ProgressRing>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-base leading-tight drop-shadow-md">
                        {skill.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-zinc-400 line-clamp-2">{skill.description}</p>

                    {/* Progress Nodes Dots */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-zinc-400">Progression</span>
                        <span className="font-bold" style={{ color: skill.color }}>{done}/10 Tiers</span>
                      </div>
                      <div className="flex gap-1">
                        {skill.levels.map((l) => (
                          <div
                            key={l.id}
                            className="h-1.5 flex-1 rounded-full transition-all"
                            style={{
                              background: myProgress.completed[l.id] ? skill.color : "rgba(255,255,255,0.12)",
                              boxShadow: myProgress.completed[l.id] ? `0 0 6px ${skill.color}` : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Link
                        href={`/learn/${skill.id}`}
                        className="btn-primary flex-1 !py-1.5 text-xs font-bold"
                      >
                        Explore Map <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/learn/${skill.id}/practice`}
                        className="neo-button p-2 text-zinc-300 hover:text-amber-400"
                        title="Rapid Practice Flashcards"
                      >
                        <Layers className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento Row 4: Recent Activity & Tournaments Rail */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="clay-card p-6">
            <SectionTitle>Recent Activity & Transactions</SectionTitle>
            <div className="divide-y divide-white/[0.05]">
              {myTxns.length === 0 && <div className="p-6 text-center text-xs text-zinc-500">No activity yet — clear your first skill level!</div>}
              {myTxns.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold ${t.amountCoins >= 0 ? "text-amber-300" : "text-rose-400"}`}
                    >
                      {t.amountCoins >= 0 ? "+" : ""}
                      {t.amountCoins}ↁ
                    </span>
                    <span className="truncate text-zinc-300 max-w-48 sm:max-w-64">{t.note}</span>
                  </div>
                  <span suppressHydrationWarning className="shrink-0 font-mono text-[10px] text-zinc-500">{timeAgo(t.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tournaments Rail */}
          <div className="clay-card p-6">
            <SectionTitle
              action={
                <Link href="/quizzes" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
                  View all →
                </Link>
              }
            >
              Live & Upcoming Tournaments
            </SectionTitle>
            <div className="space-y-3">
              {upcoming.map((q) => {
                const live = msUntil(q.startTime) <= 0;
                return (
                  <Link
                    key={q.id}
                    href={`/quiz/${q.id}`}
                    className="glass flex items-center justify-between p-3.5 transition hover:border-amber-400/40"
                  >
                    <div className="flex items-center gap-3">
                      <Swords className="h-8 w-8 shrink-0 rounded-xl bg-amber-500/10 p-1.5 text-amber-400" strokeWidth={1.5} />
                      <div>
                        <div className="truncate font-bold text-white text-xs">{q.title}</div>
                        <div suppressHydrationWarning className="text-[10px] text-zinc-400">
                          {live ? "LIVE NOW" : fmtDateTime(q.startTime)} · Prize ↁ{q.prizePoolCoins}
                        </div>
                      </div>
                    </div>

                    {live ? (
                      <span className="chip animate-pulse border-rose-500/40 text-rose-400 font-mono text-[10px]">
                        ● LIVE
                      </span>
                    ) : (
                      <span className="chip font-mono text-[10px] text-amber-300">
                        {q.entryFeeCoins > 0 ? `ↁ${q.entryFeeCoins} entry` : "FREE"}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
