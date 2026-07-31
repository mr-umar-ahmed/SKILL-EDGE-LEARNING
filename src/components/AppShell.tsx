"use client";

import {
  Bell,
  ChevronDown,
  Flame,
  LayoutDashboard,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  UserRound,
  Volume2,
  VolumeX,
  Wallet2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { cn, fmtNum, levelForXp, timeAgo } from "@/lib/utils";
import { getAudioMuted, playClickSound, setAudioMuted } from "@/lib/sound";
import { DailyMissionsModal } from "./DailyMissionsModal";

function SoundToggle() {
  const [muted, setMute] = useState(false);

  useEffect(() => {
    setMute(getAudioMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setAudioMuted(next);
    setMute(next);
    if (!next) playClickSound();
  };

  return (
    <button
      onClick={toggle}
      className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition hover:bg-white/[0.1]"
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label="Sound toggle"
    >
      {muted ? <VolumeX className="h-[18px] w-[18px] text-zinc-500" /> : <Volume2 className="h-[18px] w-[18px] text-cyan-400" />}
    </button>
  );
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quizzes", label: "Tournaments", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/payment", label: "Wallet", icon: Wallet2 },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

function NotificationsBell() {
  const { state, currentUser, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const mine = state.notifications.filter((n) => n.userId === currentUser.id).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread > 0) markNotificationsRead();
        }}
        className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition hover:bg-white/[0.1]"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-80 max-w-[85vw] p-2">
          <div className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {mine.length === 0 && <div className="px-2 py-6 text-center text-sm text-zinc-500">All quiet for now.</div>}
            {mine.map((n) => (
              <div key={n.id} className="rounded-xl px-2 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">
                <div>{n.message}</div>
                <div className="mt-0.5 text-[11px] text-zinc-500">{timeAgo(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserSwitcher() {
  const { state, currentUser, switchUser } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const switchable = state.users.filter((u) => u.id === "u-student" || u.id === "u-admin");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-2.5 transition hover:bg-white/[0.1]"
      >
        <span className="text-lg leading-none">{currentUser.avatar}</span>
        <span className="hidden max-w-28 truncate text-sm font-medium text-zinc-200 md:block">{currentUser.name}</span>
        {currentUser.role === "ADMIN" && <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />}
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-64 p-2">
          <div className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            Demo session switcher
          </div>
          {switchable.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/[0.06]",
                u.id === currentUser.id && "bg-white/[0.06]"
              )}
            >
              <span className="text-xl">{u.avatar}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">{u.name}</span>
                <span className="block truncate text-[11px] text-zinc-500">{u.email}</span>
              </span>
              <span
                className={cn(
                  "chip",
                  u.role === "ADMIN" ? "border-amber-400/30 text-amber-300" : "border-cyan-400/30 text-cyan-300"
                )}
              >
                {u.role === "ADMIN" ? "Admin" : "Student"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isAdmin } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const badgeLevel = levelForXp(currentUser.xp);
  const nav = isAdmin ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldCheck }] : NAV;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-1 border-r border-white/[0.06] p-4 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 font-mono text-lg font-black text-white shadow-lg shadow-cyan-500/30">
            S
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-zinc-100">
            SKILL<span className="neon-text-cyan">EDGE</span>
          </span>
        </Link>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-300 shadow-inner"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
              )}
            >
              <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-auto glass p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xl">{currentUser.avatar}</span>
            <div className="min-w-0">
              <div className="truncate font-medium text-zinc-200">{currentUser.name}</div>
              <div className="font-mono text-[11px] text-zinc-500">LVL {badgeLevel} · {fmtNum(currentUser.xp)} XP</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030303cc] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 font-mono text-base font-black text-white">
                S
              </span>
              <span className="font-mono font-bold text-zinc-100">
                SKILL<span className="neon-text-cyan">EDGE</span>
              </span>
            </Link>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMissionsOpen(true)}
                className="chip border-cyan-400/40 bg-cyan-500/10 font-mono text-cyan-300 transition hover:bg-cyan-500/20"
                title="Daily Cyber Quests"
              >
                <Target className="h-3.5 w-3.5 text-cyan-400" /> Quests
              </button>
              <div className="chip border-orange-400/30 font-mono text-orange-300">
                <Flame className="h-3.5 w-3.5" /> {currentUser.streakCount}
              </div>
              <Link href="/payment" className="chip border-yellow-400/30 font-mono text-yellow-300 transition hover:bg-yellow-400/10">
                <span className="font-bold">ↁ</span> {fmtNum(currentUser.edgeCoins)}
              </Link>
              <div className="chip hidden border-violet-400/30 font-mono text-violet-300 sm:inline-flex">
                <Zap className="h-3.5 w-3.5" /> LVL {badgeLevel}
              </div>
              <SoundToggle />
              <NotificationsBell />
              <UserSwitcher />
            </div>
          </div>
        </header>

        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />

        <main className="flex-1 px-4 pb-28 pt-5 lg:pb-10">{children}</main>
      </div>

      {/* mobile bottom nav */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0a0a0ce6] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition",
                  active ? "text-cyan-300" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]")} />
                {item.label}
              </Link>
            );
          })}
          {!isAdmin && (
            <Link
              href="/dashboard"
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300"
            >
              <UserRound className="h-5 w-5" />
              Profile
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
