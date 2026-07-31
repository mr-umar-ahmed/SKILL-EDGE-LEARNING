"use client";

import {
  Award,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Folder,
  Globe,
  Grid,
  Home,
  Layers,
  LayoutDashboard,
  Moon,
  Radio,
  Search,
  Settings,
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
      document.body.className = `${saved} font-sans antialiased selection:bg-amber-400 selection:text-black`;
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("skilledge-theme", next);
    document.documentElement.className = next;
    document.body.className = `${next} font-sans antialiased selection:bg-amber-400 selection:text-black`;
    playClickSound();
  };

  return (
    <button
      onClick={toggle}
      className="neo-button p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
      title={theme === "dark" ? "Switch to Oatmilk Latte Light Theme" : "Switch to Rich Black Dark Theme"}
      aria-label="Theme toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] text-amber-300" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[18px] w-[18px] text-amber-600" strokeWidth={1.75} />
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

/* Interactive Role & Session Switcher Modal / Dropdown */
function RoleSwitcherDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, currentUser, switchUser } = useApp();
  const ref = useClickOutside(onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-sm p-5 space-y-4 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-mono text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" /> Demo Role Switcher
            </h3>
            <p className="text-[11px] text-zinc-400">Switch instantly between Student & Admin roles</p>
          </div>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white px-2 py-1">✕</button>
        </div>

        <div className="space-y-2">
          {state.users.map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  playClickSound();
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all duration-200",
                  isSelected
                    ? "neo-box bg-amber-500/20 border border-amber-400/40 shadow-lg"
                    : "hover:bg-white/[0.08] border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{u.avatar}</span>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      {u.name}
                      {u.role === "ADMIN" && (
                        <span className="chip border-amber-400/40 bg-amber-500/20 text-amber-300 font-mono text-[9px] py-0 px-1.5">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </div>
                </div>

                {isSelected ? (
                  <Check className="h-5 w-5 text-amber-400 shrink-0" strokeWidth={2.5} />
                ) : (
                  <span className="text-xs text-zinc-400 font-mono">Switch →</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, currentUser, isAdmin, skills } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const badgeLevel = levelForXp(currentUser.xp);

  const PRIMARY_RAIL = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/quizzes", label: "Tournaments", icon: Swords },
    { href: "/leaderboard", label: "Hall of Fame", icon: Trophy },
    { href: "/payment", label: "Wallet", icon: Wallet2 },
    { href: "/profile", label: "Identity & Profile", icon: UserRound },
  ];

  if (isAdmin) {
    PRIMARY_RAIL.push({ href: "/admin", label: "Admin Panel", icon: ShieldCheck });
  }

  const SKILL_CATEGORIES = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* 1. Far-Left Floating Primary Command Rail */}
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center justify-between py-6 px-2 lg:flex z-50">
        {/* Floating Rail Capsule */}
        <div className="neo-box flex flex-col items-center gap-5 py-4 px-2.5 border border-white/10 rounded-full shadow-2xl">
          {/* Top Brand Star Icon */}
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full btn-primary font-mono text-xl font-black shadow-lg hover:scale-110 transition">
            ✳
          </Link>

          <div className="h-px w-6 bg-white/10" />

          {/* Primary Nav Icons */}
          {PRIMARY_RAIL.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                  active
                    ? "btn-primary shadow-lg scale-105"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
              </Link>
            );
          })}
        </div>

        {/* Bottom Floating Settings Capsule */}
        <div className="neo-box flex flex-col items-center py-2 px-2 border border-white/10 rounded-full shadow-2xl">
          <button
            onClick={() => setRoleSwitcherOpen(true)}
            title="Switch User Role (Student / Admin)"
            className="flex h-10 w-10 items-center justify-center rounded-full text-amber-400 hover:bg-white/10 transition"
          >
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      {/* 2. Secondary Expanded Navigation Panel */}
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-5 border-r border-white/[0.08] p-5 lg:flex backdrop-blur-3xl overflow-y-auto">
        {/* User Card Header — Clickable Role Switcher Trigger */}
        <button
          onClick={() => setRoleSwitcherOpen(true)}
          title="Click to Switch Role (Student / Admin)"
          className="flex items-center gap-3 border-b border-white/[0.08] pb-4 text-left group hover:opacity-90 transition"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl neo-box border border-amber-400/40 text-2xl shadow-md group-hover:scale-105 transition">
            {currentUser.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-white">{currentUser.name}</span>
              <span className="chip border-amber-400/40 text-[9px] font-mono py-0 px-1 font-bold text-amber-400">
                {currentUser.role}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 group-hover:translate-y-0.5 transition" />
            </div>
            <div className="truncate text-[11px] text-zinc-400 font-mono">{currentUser.email}</div>
          </div>
        </button>

        {/* Category Section: Navigation */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
            Projects & Navigation
          </div>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname === "/dashboard"
                ? "neo-box bg-amber-500/20 text-white border border-amber-400/30 shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              <span>Dashboard</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">0</span>
          </Link>
          <Link
            href="/learn/ai-prompt-engineering/practice"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.includes("practice")
                ? "neo-box bg-amber-500/20 text-white border border-amber-400/30 shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4" strokeWidth={1.75} />
              <span>Practice Deck</span>
            </div>
          </Link>
        </div>

        {/* Category Section: Status & Competitions */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
            Status & Events
          </div>
          <Link
            href="/quizzes"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.startsWith("/quizzes")
                ? "neo-box bg-amber-500/20 text-white border border-amber-400/30 shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Swords className="h-4 w-4 text-rose-400" strokeWidth={1.75} />
              <span>Tournaments</span>
            </div>
            <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 px-2 py-0.5 font-mono text-[10px]">
              3
            </span>
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.startsWith("/leaderboard")
                ? "neo-box bg-amber-500/20 text-white border border-amber-400/30 shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="h-4 w-4 text-amber-400" strokeWidth={1.75} />
              <span>Hall of Fame</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">2</span>
          </Link>
        </div>

        {/* Category Section: Economy & Vault */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
            Economy & Vault
          </div>
          <Link
            href="/payment"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.startsWith("/payment")
                ? "neo-box bg-amber-500/20 text-white border border-amber-400/30 shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Wallet2 className="h-4 w-4 text-yellow-300" strokeWidth={1.75} />
              <span>EdgeCoin Wallet</span>
            </div>
            <span className="rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 font-mono text-[10px] font-bold">
              ↁ {fmtNum(currentUser.edgeCoins)}
            </span>
          </Link>
        </div>

        {/* Category Section: Documents & Skills Tree */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Skill Tracks</span>
            <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-white">
              +
            </button>
          </div>

          {/* Search Pill Input */}
          <button
            onClick={() => setSearchOpen(true)}
            className="neo-inset flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white transition"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">Search skills...</span>
          </button>

          {/* Tree Skill Folders */}
          <div className="space-y-1 pl-1">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 py-1 px-2">
                  <Folder className="h-3.5 w-3.5 text-amber-400" />
                  <span className="truncate">{cat}</span>
                </div>
                <div className="pl-4 space-y-1 border-l border-white/10 ml-3">
                  {skills
                    .filter((s) => s.category === cat)
                    .slice(0, 3)
                    .map((s) => (
                      <Link
                        key={s.id}
                        href={`/learn/${s.id}`}
                        className="flex items-center justify-between text-[11px] font-medium text-zinc-400 hover:text-white py-1 px-2 rounded-lg hover:bg-white/[0.04]"
                      >
                        <span className="truncate">{s.title}</span>
                        <span className="font-mono text-[9px] text-zinc-500">10L</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 3. Main Full-Width Content Container */}
      <div className="flex min-w-0 flex-1 flex-col bg-transparent">
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-white/[0.08] backdrop-blur-2xl bg-zinc-950/30">
          <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6">
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

              {/* Role Switcher Trigger Button */}
              <button
                onClick={() => setRoleSwitcherOpen(true)}
                className="neo-button flex items-center gap-2 py-1.5 pl-2 pr-2.5 transition hover:scale-105 active:scale-95"
                title="Switch Role (Student / Admin)"
              >
                <span className="text-lg leading-none">{currentUser.avatar}</span>
                <span className="hidden max-w-28 truncate text-xs font-semibold md:block text-white">{currentUser.name}</span>
                {currentUser.role === "ADMIN" && <ShieldCheck className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />}
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>

        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        <RoleSwitcherDropdown open={roleSwitcherOpen} onClose={() => setRoleSwitcherOpen(false)} />

        <main className="flex-1 w-full px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="pb-safe glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {[
            { href: "/dashboard", label: "Dashboard", icon: Home },
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
