"use client";

import {
  Bell,
  ChevronDown,
  Flame,
  LayoutDashboard,
  Moon,
  Search,
  ShieldCheck,
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
import { cn, fmtNum, levelForXp, timeAgo } from "@/lib/utils";
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
        className="neo-button flex items-center gap-2 py-1.5 pl-2 pr-2.5 transition hover:scale-105 active:scale-95"
      >
        <span className="text-lg leading-none">{currentUser.avatar}</span>
        <span className="hidden max-w-28 truncate text-xs font-semibold md:block">{currentUser.name}</span>
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
                <span className="block truncate text-sm font-semibold">{u.name}</span>
                <span className="block truncate text-[11px] text-zinc-400">{u.email}</span>
              </span>
              <span
                className={cn(
                  "chip",
                  u.role === "ADMIN" ? "border-amber-400/30 text-amber-400" : "border-amber-400/30 text-amber-300"
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
  const [searchOpen, setSearchOpen] = useState(false);
  const badgeLevel = levelForXp(currentUser.xp);
  const nav = isAdmin ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldCheck }] : NAV;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 border-r border-white/[0.06] p-4 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-3 px-2">
          <span className="clay-badge flex h-10 w-10 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-500 font-mono text-xl font-black text-black shadow-lg">
            S
          </span>
          <span className="font-mono text-lg font-bold tracking-tight">
            SKILL<span className="text-amber-400">EDGE</span>
          </span>
        </Link>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                active
                  ? "neo-box bg-amber-400/10 text-amber-300 shadow-inner"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}

        {/* User Card in Sidebar */}
        <div className="mt-auto clay-card p-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="min-w-0">
              <div className="truncate font-bold">{currentUser.name}</div>
              <div className="font-mono text-[11px] text-zinc-400">LVL {badgeLevel} · {fmtNum(currentUser.xp)} XP</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="clay-badge flex h-8 w-8 items-center justify-center bg-gradient-to-br from-amber-300 to-yellow-500 font-mono text-base font-black text-black">
                S
              </span>
              <span className="font-mono font-bold">
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

      {/* Mobile Bottom Nav with Linear Outline Icons */}
      <nav className="pb-safe glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {nav.map((item) => {
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
