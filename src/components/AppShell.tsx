"use client";

import {
  Award,
  Bell,
  ChevronDown,
  Compass,
  Flame,
  Globe,
  Layers,
  LayoutDashboard,
  Moon,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
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
import { cn, fmtNum, levelForXp, timeAgo, xpProgress } from "@/lib/utils";
import { getAudioMuted, playClickSound, setAudioMuted } from "@/lib/sound";
import { DailyMissionsModal } from "./DailyMissionsModal";
import { SearchModal } from "./SearchModal";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("skilledge-theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
      document.documentElement.className = saved;
      document.body.className = `${saved} font-sans antialiased selection:bg-yellow-400 selection:text-black`;
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("skilledge-theme", next);
    document.documentElement.className = next;
    document.body.className = `${next} font-sans antialiased selection:bg-yellow-400 selection:text-black`;
    playClickSound();
  };

  return (
    <button
      onClick={toggle}
      className="neo-button p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
      title={theme === "dark" ? "Switch to Soft Linen Light Theme" : "Switch to Anima Agrawal Dark Theme"}
      aria-label="Theme toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] text-amber-300" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[18px] w-[18px] text-stone-700" strokeWidth={1.75} />
      )}
    </button>
  );
}

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
      className="neo-button p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label="Sound toggle"
    >
      {muted ? <VolumeX className="h-[18px] w-[18px] text-zinc-500" strokeWidth={1.75} /> : <Volume2 className="h-[18px] w-[18px] text-amber-400" strokeWidth={1.75} />}
    </button>
  );
}

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
        className="neo-button relative p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[10px] font-bold text-white shadow-md">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-80 max-w-[85vw] p-2 shadow-2xl">
          <div className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {mine.length === 0 && <div className="px-2 py-6 text-center text-xs text-zinc-400">All quiet for now.</div>}
            {mine.map((n) => (
              <div key={n.id} className="rounded-xl px-2 py-2 text-xs text-zinc-200 hover:bg-white/[0.04]">
                <div>{n.message}</div>
                <div className="mt-0.5 text-[10px] text-zinc-400">{timeAgo(n.createdAt)}</div>
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
        className="neo-button flex items-center gap-2 py-1.5 pl-2 pr-2.5 transition hover:scale-105 active:scale-95"
      >
        <span className="text-lg leading-none">{currentUser.avatar}</span>
        <span className="hidden max-w-28 truncate text-xs font-semibold md:block text-white">{currentUser.name}</span>
        {currentUser.role === "ADMIN" && <ShieldCheck className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />}
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} />
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-64 p-2 shadow-2xl">
          <div className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            Demo Session Switcher
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
                <span className="block truncate text-xs font-bold text-white">{u.name}</span>
                <span className="block truncate text-[11px] text-zinc-400">{u.email}</span>
              </span>
              <span
                className={cn(
                  "chip text-[10px]",
                  u.role === "ADMIN" ? "border-amber-400/40 text-amber-400 font-mono font-bold" : "border-amber-400/40 text-amber-300 font-mono"
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
  const { state, currentUser, isAdmin } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const badgeLevel = levelForXp(currentUser.xp);
  const pendingTxns = state.transactions.filter((t) => t.status === "PENDING").length;

  const NAV_GROUPS = [
    {
      group: "CORE PLATFORM",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/learn/ai-prompt-engineering/practice", label: "Practice Deck", icon: Layers },
      ],
    },
    {
      group: "COMMUNITY & REWARDS",
      items: [
        { href: "/quizzes", label: "Tournaments", icon: Swords, badge: "● LIVE" },
        { href: "/leaderboard", label: "Hall of Fame", icon: Trophy },
        { href: "/profile", label: "Identity & Profile", icon: UserRound },
      ],
    },
    {
      group: "ECONOMY & VAULT",
      items: [
        { href: "/payment", label: "EdgeCoin Wallet", icon: Wallet2, badge: `ↁ ${fmtNum(currentUser.edgeCoins)}` },
      ],
    },
  ];

  if (isAdmin) {
    NAV_GROUPS.push({
      group: "ADMINISTRATION",
      items: [
        { href: "/admin", label: "Command Center", icon: ShieldCheck, badge: pendingTxns > 0 ? `${pendingTxns} Review` : undefined },
      ],
    });
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl">
      {/* Production Level SaaS Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-4 border-r border-white/[0.08] p-4 lg:flex bg-zinc-950/40 backdrop-blur-3xl">
        {/* Brand Header */}
        <div className="flex flex-col gap-3 px-2 pt-1">
          <Link href="/" className="flex items-center gap-3">
            <span className="clay-badge flex h-10 w-10 items-center justify-center bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 font-mono text-xl font-black text-black shadow-lg shadow-amber-500/20">
              S
            </span>
            <div>
              <div className="font-mono text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                SKILL<span className="text-amber-400">EDGE</span>
                <span className="chip border-amber-400/40 bg-amber-500/10 text-[9px] font-mono text-amber-300 py-0.5 px-1.5">
                  OS v1.0
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">Gamified Skill Learning System</p>
            </div>
          </Link>

          {/* Quick Workspace Switcher Pill */}
          <div className="neo-box flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">Pro Builder Workspace</span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
        </div>

        {/* Grouped SaaS Navigation */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          {NAV_GROUPS.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200",
                      active
                        ? "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:rounded-r-full before:bg-amber-400 bg-amber-400/10 text-amber-300 border border-amber-400/20 shadow-md"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-white hover:translate-x-0.5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn("h-4 w-4 transition-colors", active ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200")}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "chip font-mono text-[9px] py-0.5 px-1.5",
                        item.badge.includes("LIVE") ? "animate-pulse border-rose-500/40 text-rose-400" : "border-amber-400/30 text-amber-300"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Production SaaS User Footer */}
        <div className="clay-card p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white">{currentUser.name}</div>
              <div className="font-mono text-[10px] text-amber-300 font-semibold">
                LVL {badgeLevel} · {fmtNum(currentUser.xp)} XP
              </div>
            </div>
          </div>

          {/* XP Progress Bar in Sidebar */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-zinc-400">
              <span>Badge Progress</span>
              <span className="text-amber-300">{Math.round(xpProgress(currentUser.xp) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress(currentUser.xp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-white/[0.08] backdrop-blur-2xl bg-zinc-950/30">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="clay-badge flex h-8 w-8 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-500 font-mono text-base font-black text-black">
                S
              </span>
              <span className="font-mono font-bold text-white">
                SKILL<span className="text-amber-400">EDGE</span>
              </span>
            </Link>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="neo-button chip hidden font-mono transition hover:scale-105 sm:inline-flex"
                title="Search skills (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} /> Search <span className="text-[10px] text-zinc-500">Ctrl+K</span>
              </button>
              <button
                onClick={() => setMissionsOpen(true)}
                className="neo-button chip font-mono text-amber-300 transition hover:scale-105"
                title="Daily Cyber Quests"
              >
                <Target className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} /> Quests
              </button>
              <div className="chip font-mono text-orange-400">
                <Flame className="h-3.5 w-3.5" strokeWidth={1.75} /> {currentUser.streakCount}
              </div>
              <Link href="/payment" className="chip font-mono text-yellow-300 transition hover:scale-105">
                <span className="font-bold">ↁ</span> {fmtNum(currentUser.edgeCoins)}
              </Link>
              <div className="chip hidden font-mono text-violet-300 sm:inline-flex">
                <Zap className="h-3.5 w-3.5" strokeWidth={1.75} /> LVL {badgeLevel}
              </div>

              <ThemeToggle />
              <SoundToggle />
              <NotificationsBell />
              <UserSwitcher />
            </div>
          </div>
        </header>

        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

        <main className="flex-1 px-3 pb-28 pt-4 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="pb-safe glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/quizzes", label: "Tournaments", icon: Swords },
            { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
            { href: "/payment", label: "Wallet", icon: Wallet2 },
            { href: "/profile", label: "Profile", icon: UserRound },
          ].map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold transition",
                  active ? "text-amber-300 font-bold" : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_rgba(253,228,195,0.7)]")} strokeWidth={active ? 2 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
