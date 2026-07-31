"use client";

import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Shield,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { playClickSound, playVictorySound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { cn, fmtNum, levelForXp } from "@/lib/utils";

const AVATARS = [
  "🤖", "⚡", "🚀", "💻", "🔮", "🧬",
  "🏆", "💎", "🐉", "🎯", "🌌", "🧠",
  "⚔️", "🎓", "👑", "🛡️", "🔥", "✨"
];

const FRAMES = [
  { id: "default", name: "Standard Glass", border: "border-white/20", shadow: "" },
  { id: "cyan", name: "Neon Cyan", border: "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]", text: "text-cyan-300" },
  { id: "gold", name: "Sovereign Gold", border: "border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]", text: "text-yellow-300" },
  { id: "violet", name: "Violet Cyber", border: "border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.6)]", text: "text-violet-300" },
  { id: "emerald", name: "Emerald Matrix", border: "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]", text: "text-emerald-300" },
];

const TITLES = [
  { name: "🌱 Novice Learner", reqXp: 0 },
  { name: "⚡ Prompt Architect", reqXp: 200 },
  { name: "🤖 AI Strategist", reqXp: 500 },
  { name: "🚀 Growth Hacker", reqXp: 1000 },
  { name: "👑 Sovereign Master", reqXp: 2500 },
];

export default function ProfilePage() {
  const { currentUser, skills, myProgress, state, updateProfile } = useApp();

  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || "🤖");
  const [selectedFrame, setSelectedFrame] = useState(currentUser.avatarFrame || "cyan");
  const [selectedTitle, setSelectedTitle] = useState(currentUser.title || "🌱 Novice Learner");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentLvl = levelForXp(currentUser.xp);
  const activeFrame = FRAMES.find((f) => f.id === selectedFrame) || FRAMES[0];

  const myCerts = state.certificates.filter((c) => c.userId === currentUser.id);

  const handleSave = () => {
    playVictorySound();
    updateProfile(selectedAvatar, selectedTitle, selectedFrame);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Hero Banner */}
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar with selected frame */}
            <div
              className={cn(
                "relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-zinc-900/80 text-5xl transition-all duration-300",
                activeFrame.border
              )}
            >
              {selectedAvatar}
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500 text-xs font-black text-black">
                {currentLvl}
              </div>
            </div>

            {/* Main User Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold tracking-tight text-white">{currentUser.name}</h1>
                <span className="chip border-cyan-400/30 bg-cyan-500/10 font-mono text-xs text-cyan-300">
                  {selectedTitle}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-zinc-400">{currentUser.email} · Joined {new Date(currentUser.createdAt).toLocaleDateString()}</p>

              {/* Stat Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <div className="chip border-yellow-400/30 font-mono text-sm text-yellow-300">
                  <span className="font-bold">ↁ</span> {fmtNum(currentUser.edgeCoins)} EdgeCoins
                </div>
                <div className="chip border-violet-400/30 font-mono text-sm text-violet-300">
                  <Zap className="h-4 w-4 text-violet-400" /> {fmtNum(currentUser.xp)} XP
                </div>
                <div className="chip border-orange-400/30 font-mono text-sm text-orange-300">
                  <Flame className="h-4 w-4 text-orange-400" /> {currentUser.streakCount} Day Streak
                </div>
                <div className="chip border-emerald-400/30 font-mono text-sm text-emerald-300">
                  <Award className="h-4 w-4 text-emerald-400" /> {myCerts.length} Certificates
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Sparkles className="h-5 w-5 text-amber-400" /> Cyber Identity & Customization
              </h2>
              <p className="text-xs text-zinc-400">Personalize your avatar, cyber frame, and unlockable titles.</p>
            </div>
            <button onClick={handleSave} className="btn-primary">
              <UserCheck className="h-4 w-4" /> Save Profile
            </button>
          </div>

          {savedSuccess && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs font-semibold text-emerald-300">
              ✓ Identity customization updated successfully!
            </div>
          )}

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {/* Avatar Choice */}
            <div>
              <label className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                1. Select Avatar Emoji
              </label>
              <div className="grid grid-cols-6 gap-2 rounded-2xl border border-white/[0.08] bg-black/40 p-3">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      playClickSound();
                      setSelectedAvatar(av);
                    }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-xl transition hover:scale-110 hover:bg-white/10",
                      selectedAvatar === av ? "bg-cyan-500/20 ring-2 ring-cyan-400" : "bg-white/[0.02]"
                    )}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Cyber Frame Choice */}
            <div>
              <label className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                2. Cyber Glow Frame
              </label>
              <div className="space-y-2">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedFrame(f.id);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                      selectedFrame === f.id
                        ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("h-3 w-3 rounded-full border", f.border)} />
                      <span>{f.name}</span>
                    </div>
                    {selectedFrame === f.id && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Choice */}
            <div>
              <label className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                3. Title Badge (Unlocked via XP)
              </label>
              <div className="space-y-2">
                {TITLES.map((t) => {
                  const unlocked = currentUser.xp >= t.reqXp;
                  return (
                    <button
                      key={t.name}
                      disabled={!unlocked}
                      onClick={() => {
                        if (!unlocked) return;
                        playClickSound();
                        setSelectedTitle(t.name);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                        !unlocked && "opacity-40 cursor-not-allowed border-white/5 bg-black/20 text-zinc-600",
                        unlocked && selectedTitle === t.name
                          ? "border-violet-400/50 bg-violet-500/10 text-violet-200"
                          : unlocked && "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
                      )}
                    >
                      <span>{t.name}</span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {unlocked ? (selectedTitle === t.name ? "Active" : "Select") : `${t.reqXp} XP req`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Mastery Matrix */}
        <div className="glass rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">🎯 Skill Mastery Matrix</h2>
              <p className="text-xs text-zinc-400">Track your 10-tier progression across all 12 real-world skills.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s) => {
              const compCount = Object.keys(myProgress.completed).filter((k) => k.startsWith(s.id)).length;
              const pct = Math.round((compCount / 10) * 100);

              return (
                <Link
                  key={s.id}
                  href={`/learn/${s.id}`}
                  className="glass flex flex-col justify-between rounded-2xl p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                      style={{ background: `${s.color}30`, border: `1px solid ${s.color}60` }}
                    >
                      {s.title[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white">{s.title}</h3>
                      <div className="font-mono text-[11px] text-zinc-400">
                        {compCount}/10 Tiers Cleared ({pct}%)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: s.color }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Earned Certificates Grid */}
        <div className="glass rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Award className="h-5 w-5 text-amber-400" /> Certificates Earned
              </h2>
              <p className="text-xs text-zinc-400">Verified credentials issued at Tiers 5, 8, and 10.</p>
            </div>
          </div>

          {myCerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-zinc-500">
              No certificates unlocked yet. Complete Tier 5 in any skill to claim your first verified credential!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myCerts.map((cert) => {
                const skill = skills.find((s) => s.id === cert.skillId);
                return (
                  <Link
                    key={cert.id}
                    href={`/certificate/${cert.id}`}
                    className="glass-strong flex flex-col justify-between rounded-2xl p-4 transition hover:border-amber-400/40"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="chip border-amber-400/40 font-mono text-[10px] text-amber-300">
                          Tier {cert.levelTier} Certified
                        </span>
                        <Shield className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="mt-3 text-sm font-bold text-white">{skill?.title}</div>
                      <div className="mt-1 font-mono text-[10px] text-zinc-400">Hash: {cert.verificationCode}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between font-mono text-xs font-semibold text-amber-300">
                      <span>View & Download</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
