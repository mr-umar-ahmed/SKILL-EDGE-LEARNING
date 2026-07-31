"use client";

import { ArrowRight, Coins, Flame, GraduationCap, Swords, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { SkillIcon } from "@/components/SkillIcon";
import { useApp } from "@/lib/store";

export default function LandingPage() {
  const { skills } = useApp();

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* header */}
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 font-mono text-lg font-black text-white shadow-lg shadow-cyan-500/30">
            S
          </span>
          <span className="font-mono text-lg font-bold text-zinc-100">
            SKILL<span className="neon-text-cyan">EDGE</span> OS
          </span>
        </div>
        <Link href="/dashboard" className="btn-ghost !py-2 text-sm">
          Launch App <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* hero */}
      <section className="relative py-16 text-center sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="chip mx-auto mb-6 border-violet-400/30 text-violet-300">
          <Zap className="h-3.5 w-3.5" /> The Learning OS for Future Builders
        </div>
        <h1 className="mx-auto max-w-3xl font-mono text-4xl font-black leading-tight tracking-tight text-zinc-50 sm:text-6xl">
          Master the skills the <span className="neon-text-cyan">future</span> actually{" "}
          <span className="neon-text-violet">pays</span> for.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
          12 trending skills. 10 tiers each — from Starter to Sovereign Master. Earn XP, EdgeCoins ↁ and verifiable
          certificates while you build real things.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary text-base">
            Start Learning Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/quizzes" className="btn-ghost text-base">
            <Swords className="h-4 w-4" /> Weekly Tournaments
          </Link>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <GraduationCap className="h-5 w-5" />, big: "12", small: "Skill Tracks" },
            { icon: <Trophy className="h-5 w-5" />, big: "120", small: "Levels to Conquer" },
            { icon: <Coins className="h-5 w-5" />, big: "ↁ", small: "EdgeCoin Economy" },
            { icon: <Flame className="h-5 w-5" />, big: "∞", small: "Streak Potential" },
          ].map((s) => (
            <div key={s.small} className="glass p-4 text-center">
              <div className="mx-auto mb-1 w-fit text-cyan-300">{s.icon}</div>
              <div className="font-mono text-2xl font-bold text-zinc-100">{s.big}</div>
              <div className="text-xs text-zinc-500">{s.small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* skills preview */}
      <section className="pb-20">
        <h2 className="mb-6 text-center font-mono text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
          The 12 Trending Skill Tracks
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/learn/${skill.id}`}
              className="glass group p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <span
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${skill.color}22`, color: skill.color }}
              >
                <SkillIcon name={skill.iconName} className="h-5 w-5" />
              </span>
              <div className="text-sm font-semibold leading-snug text-zinc-200 group-hover:text-white">{skill.title}</div>
              <div className="mt-1 text-[11px] text-zinc-500">{skill.category}</div>
            </Link>
          ))}
        </div>
        <div className="mt-14 pb-10 text-center text-xs text-zinc-600">
          Skill Edge OS · Learn → Prove → Earn · Built for the builders of tomorrow
        </div>
      </section>
    </div>
  );
}
