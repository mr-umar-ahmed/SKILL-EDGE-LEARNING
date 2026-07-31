"use client";

import { Award, ChevronRight, Coins, Flame, Lock, Quote, Sparkles, Swords, Zap } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { ProgressRing, SectionTitle, StatCard } from "@/components/ui";
import { QUOTES, getSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { XP_THRESHOLDS, fmtDateTime, fmtNum, levelForXp, msUntil, timeAgo, xpProgress } from "@/lib/utils";

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
        {/* greeting + quote */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="font-mono text-2xl font-bold text-zinc-50 sm:text-3xl">
              Welcome back, <span className="neon-text-cyan">{currentUser.name.split(" ")[0]}</span> {currentUser.avatar}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Keep the streak alive — one mission today keeps the fire burning. 🔥
            </p>
            <div className="glass mt-4 flex gap-3 p-4">
              <Quote className="h-5 w-5 shrink-0 text-violet-400" />
              <div>
                <p className="text-sm italic text-zinc-200">&ldquo;{quote.text}&rdquo;</p>
                <p className="mt-1 font-mono text-xs text-zinc-500">— {quote.author}</p>
              </div>
            </div>
          </div>
          <div className="glass flex items-center justify-center gap-5 p-4">
            <ProgressRing progress={xpProgress(currentUser.xp)} size={92} stroke={8} color="#8b5cf6">
              <div className="text-center">
                <div className="font-mono text-2xl font-black text-zinc-50">{badgeLevel}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Level</div>
              </div>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-mono font-bold text-zinc-100">{fmtNum(currentUser.xp)} XP</div>
              <div className="mt-0.5 text-xs text-zinc-500">
                {nextXp ? `${fmtNum(nextXp - currentUser.xp)} XP to Level ${badgeLevel + 1}` : "Max level reached!"}
              </div>
              <div className="chip mt-2 border-violet-400/30 text-violet-300">
                <Zap className="h-3 w-3" /> Level {badgeLevel} Badge
              </div>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="EdgeCoins"
            value={<span className="neon-text-gold">ↁ{fmtNum(currentUser.edgeCoins)}</span>}
            sub="≈ ₹0.50 per coin"
            icon={<Coins className="h-4 w-4" />}
            accent="#eab308"
          />
          <StatCard
            label="Streak"
            value={
              <span className="flex items-center gap-1.5">
                {currentUser.streakCount} <Flame className="h-5 w-5 text-orange-400" />
              </span>
            }
            sub="days in a row"
            icon={<Flame className="h-4 w-4" />}
            accent="#f97316"
          />
          <StatCard
            label="Total XP"
            value={fmtNum(currentUser.xp)}
            sub={`Level ${badgeLevel} of 10`}
            icon={<Zap className="h-4 w-4" />}
            accent="#8b5cf6"
          />
          <StatCard
            label="Certificates"
            value={myCerts.length}
            sub="verified credentials"
            icon={<Award className="h-4 w-4" />}
            accent="#06b6d4"
          />
        </div>

        {/* certificates strip */}
        {myCerts.length > 0 && (
          <div>
            <SectionTitle>Your Certificates</SectionTitle>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {myCerts.map((c) => {
                const skill = getSkill(c.skillId);
                return (
                  <Link
                    key={c.id}
                    href={`/certificate/${c.id}`}
                    className="glass flex min-w-56 items-center gap-3 p-3 transition hover:bg-white/[0.06]"
                  >
                    <Award className="h-8 w-8 shrink-0" style={{ color: skill?.color }} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-100">{skill?.title}</div>
                      <div className="font-mono text-[11px] text-zinc-500">Tier {c.levelTier} · {c.verificationCode}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* skill map hub */}
        <div>
          <SectionTitle
            action={
              <span className="font-mono text-xs text-zinc-500">
                {Object.keys(myProgress.completed).length} / 120 levels cleared
              </span>
            }
          >
            Skill Map Hub
          </SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => {
              const done = skill.levels.filter((l) => myProgress.completed[l.id]).length;
              const nextLevel = skill.levels.find((l) => !myProgress.completed[l.id]);
              const nextUnlocked = nextLevel ? isLevelUnlocked(skill, nextLevel.levelNumber) : false;
              return (
                <Link
                  key={skill.id}
                  href={`/learn/${skill.id}`}
                  className="glass group relative overflow-hidden p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl transition group-hover:opacity-30"
                    style={{ background: skill.color }}
                  />
                  <div className="flex items-start gap-3">
                    <ProgressRing progress={done / 10} size={56} stroke={5} color={skill.color}>
                      <SkillIcon name={skill.iconName} className="h-5 w-5" style={{ color: skill.color }} />
                    </ProgressRing>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">
                        {skill.title}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500">{skill.category}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-xs font-bold" style={{ color: skill.color }}>
                          {done}/10
                        </span>
                        <div className="flex gap-[3px]">
                          {skill.levels.map((l) => (
                            <span
                              key={l.id}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                background: myProgress.completed[l.id] ? skill.color : "rgba(255,255,255,0.12)",
                                boxShadow: myProgress.completed[l.id] ? `0 0 6px ${skill.color}` : undefined,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
                  </div>
                  {nextLevel && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                      {nextUnlocked ? (
                        <>
                          <Sparkles className="h-3 w-3 text-cyan-400" /> Next: L{nextLevel.levelNumber} —{" "}
                          {nextLevel.title}
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" /> Next: L{nextLevel.levelNumber} locked
                        </>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* activity + tournaments */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <SectionTitle>Recent Activity</SectionTitle>
            <div className="glass divide-y divide-white/[0.05] p-1">
              {myTxns.length === 0 && <div className="p-6 text-center text-sm text-zinc-500">No activity yet — go clear a level!</div>}
              {myTxns.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span
                    className={`font-mono text-sm font-bold ${t.amountCoins >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {t.amountCoins >= 0 ? "+" : ""}
                    {t.amountCoins}ↁ
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">{t.note}</span>
                  <span className="shrink-0 text-[11px] text-zinc-500">{timeAgo(t.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle
              action={
                <Link href="/quizzes" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">
                  View all →
                </Link>
              }
            >
              Tournaments
            </SectionTitle>
            <div className="space-y-2">
              {upcoming.map((q) => {
                const live = msUntil(q.startTime) <= 0;
                return (
                  <Link
                    key={q.id}
                    href={`/quiz/${q.id}`}
                    className="glass flex items-center gap-3 p-3 transition hover:bg-white/[0.06]"
                  >
                    <Swords className="h-8 w-8 shrink-0 rounded-xl bg-violet-500/15 p-1.5 text-violet-300" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-zinc-100">{q.title}</div>
                      <div className="text-[11px] text-zinc-500">
                        {live ? "LIVE NOW" : fmtDateTime(q.startTime)} · Prize ↁ{q.prizePoolCoins}
                      </div>
                    </div>
                    {live ? (
                      <span className="chip animate-pulse border-rose-400/40 font-mono text-rose-300">● LIVE</span>
                    ) : (
                      <span className="chip font-mono">
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
