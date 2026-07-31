"use client";

import { ArrowRight, Coins, Flame, GraduationCap, Swords, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";

export default function LandingPage() {
  const { skills } = useApp();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <span className="clay-badge flex h-9 w-9 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-500 font-mono text-lg font-black text-black">
            S
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            SKILL<span className="text-amber-400">EDGE</span> OS
          </span>
        </div>
        <Link href="/dashboard" className="btn-primary !py-2 text-xs sm:text-sm">
          Launch App <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative py-12 text-center sm:py-20">
        <div className="chip mx-auto mb-6 border-amber-400/40 text-amber-300 font-mono text-xs">
          <Zap className="h-3.5 w-3.5 text-amber-400" /> Gamified Learning OS for Builders
        </div>
        <h1 className="mx-auto max-w-3xl font-mono text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Master the skills the <span className="text-amber-400">future</span> actually{" "}
          <span className="text-amber-300">pays</span> for.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-xs sm:text-base text-zinc-400 leading-relaxed">
          12 trending skills. 10 tiers each — from Starter to Sovereign Master. Earn XP, EdgeCoins ↁ and verifiable
          certificates while you build real things.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary text-xs sm:text-sm">
            Start Learning Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/quizzes" className="btn-ghost text-xs sm:text-sm">
            <Swords className="h-4 w-4 text-amber-400" /> Weekly Tournaments
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <GraduationCap className="h-5 w-5" />, big: "12", small: "Skill Tracks" },
            { icon: <Trophy className="h-5 w-5" />, big: "120", small: "Levels to Conquer" },
            { icon: <Coins className="h-5 w-5" />, big: "ↁ", small: "EdgeCoin Economy" },
            { icon: <Flame className="h-5 w-5" />, big: "∞", small: "Streak Potential" },
          ].map((s) => (
            <div key={s.small} className="clay-card p-4 text-center">
              <div className="mx-auto mb-1 w-fit text-amber-400">{s.icon}</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">{s.big}</div>
              <div className="text-[10px] text-zinc-400 font-mono">{s.small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Showcase with Cover Images */}
      <section className="pb-20">
        <h2 className="mb-6 text-center font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
          The 12 Trending Skill Tracks
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/learn/${skill.id}`}
              className="clay-card group overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={skill.imageUrl}
                  alt={skill.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="chip border-white/20 bg-black/60 font-mono text-[9px] text-white">
                    {skill.category}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1 leading-tight">{skill.title}</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-zinc-400 line-clamp-2">{skill.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14 pb-10 text-center text-xs text-zinc-500 font-mono">
          Skill Edge OS · Learn → Prove → Earn · Built for the builders of tomorrow
        </div>
      </section>
    </div>
  );
}
