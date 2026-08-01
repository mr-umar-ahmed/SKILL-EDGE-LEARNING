"use client";

import { ArrowRight, Coins, Flame, GraduationCap, ShieldCheck, Swords, Trophy, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";

export default function LandingPage() {
  const { skills, isAuthenticated } = useApp();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="clay-badge flex h-9 w-9 items-center justify-center btn-primary font-mono text-lg font-black">
            S
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            SKILL<span className="text-amber-400">EDGE</span> OS
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn-primary !py-2 text-xs sm:text-sm">
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-2 text-xs sm:text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary !py-2 text-xs sm:text-sm">
                Create Account <UserPlus className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
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

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={isAuthenticated ? "/dashboard" : "/login"} className="btn-primary text-xs sm:text-sm">
            {isAuthenticated ? "Launch OS Dashboard" : "Get Started Now"} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/quizzes" className="btn-ghost text-xs sm:text-sm">
            <Swords className="h-4 w-4 text-amber-400" /> Weekly Tournaments
          </Link>
        </div>

        {/* Admin Credentials Info Callout */}
        <div className="mt-6 mx-auto max-w-md neo-box p-3 border border-amber-400/30 text-xs text-zinc-300 font-mono text-center flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-1.5 font-bold text-amber-400">
            <ShieldCheck className="h-4 w-4" /> Admin Login:
          </div>
          <div>
            <span className="text-white font-bold">skilledgelearning@gmail.com</span> · <span className="text-amber-300">seladmin</span>
          </div>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.id} className="clay-card group overflow-hidden p-0">
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={skill.imageUrl}
                  alt={skill.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="chip mb-1 border-white/20 bg-black/60 font-mono text-[9px] text-white">
                    {skill.category}
                  </span>
                  <h3 className="font-bold text-white text-base drop-shadow-md">{skill.title}</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-zinc-400 line-clamp-2">{skill.description}</p>
                <Link
                  href={isAuthenticated ? `/learn/${skill.id}` : "/login"}
                  className="neo-button flex w-full items-center justify-between px-3 py-2 text-xs font-bold text-amber-400 hover:text-white transition"
                >
                  <span>Explore 10 Tiers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
