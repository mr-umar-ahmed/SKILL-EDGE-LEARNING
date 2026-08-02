"use client";

import {
  Award,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Flame,
  Folder,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
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
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
      className="header-chip-btn p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
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
      className="header-chip-btn p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
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

  if (!currentUser) return null;

  const mine = state.notifications.filter((n) => n.userId === currentUser.id).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread > 0) markNotificationsRead();
        }}
        className="header-chip-btn relative p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
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
                <div suppressHydrationWarning className="mt-0.5 text-[10px] text-zinc-400">{timeAgo(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* User Account Profile Menu */
function UserMenuDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { currentUser, isAdmin, logout } = useApp();
  const ref = useClickOutside(onClose);

  if (!open || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-sm p-6 space-y-4 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <div className="font-bold text-base text-white flex items-center gap-1.5">
                {currentUser.name}
                {isAdmin && (
                  <span className="chip border-amber-400/40 bg-amber-500/20 text-amber-300 font-mono text-[9px] py-0 px-1.5">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-mono">{currentUser.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white px-2 py-1">✕</button>
        </div>

        <div className="space-y-1">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2.5">
              <UserRound className="h-4 w-4 text-amber-400" />
              <span>Identity & Profile Settings</span>
            </div>
            <span className="font-mono text-zinc-500">→</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Admin Command Center</span>
              </div>
              <span className="font-mono text-amber-400">→</span>
            </Link>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              logout();
              playClickSound();
              onClose();
              router.push("/login");
            }}
            className="btn-ghost text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border-rose-500/30"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* Mobile Hamburger Off-Canvas Drawer */
function MobileDrawer({
  open,
  onClose,
  onOpenSearch,
  onOpenMissions,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenMissions: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAdmin, skills, logout } = useApp();

  if (!open) return null;

  const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/learn/ai-prompt-engineering/practice", label: "Practice Deck", icon: Layers },
    { href: "/quizzes", label: "Tournaments", icon: Swords, badge: "LIVE" },
    { href: "/leaderboard", label: "Hall of Fame", icon: Trophy },
    { href: "/payment", label: "EdgeCoin Wallet", icon: Wallet2, badge: `ↁ ${currentUser?.edgeCoins ?? 0}` },
    { href: "/profile", label: "Identity & Profile", icon: UserRound },
  ];

  if (isAdmin) {
    NAV_ITEMS.push({ href: "/admin", label: "Admin Command Center", icon: ShieldCheck, badge: "Admin" });
  }

  const SKILL_CATEGORIES = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200 lg:hidden">
      <div className="sidebar-expanded-panel flex h-full w-4/5 max-w-sm flex-col p-5 shadow-2xl border-l border-white/20 overflow-y-auto">
        {/* Header with Brand & Close */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="clay-badge flex h-8 w-8 items-center justify-center btn-primary font-mono text-base font-black">
              S
            </span>
            <span className="font-mono font-bold text-white text-base">
              SKILL<span className="text-amber-500">EDGE</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="header-chip-btn p-2 text-zinc-300 hover:text-white"
            aria-label="Close Mobile Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="my-4 flex items-center gap-3 rounded-2xl neo-box p-3 border border-amber-400/30">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-white truncate flex items-center gap-1">
                {currentUser.name}
                {isAdmin && (
                  <span className="chip border-amber-400/40 text-[9px] font-mono py-0 px-1 font-bold text-amber-400">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono truncate">{currentUser.email}</div>
            </div>
          </div>
        )}

        {/* Quick Utilities Row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="header-chip-btn w-full justify-center py-2 text-xs font-mono"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenMissions();
            }}
            className="header-chip-btn w-full justify-center py-2 text-xs font-mono text-amber-500"
          >
            <Target className="h-3.5 w-3.5" /> Quests
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1 flex-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 mb-1">
            Menu Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-3 text-xs font-bold transition-all",
                  active
                    ? "nav-active-pill shadow-md"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="chip text-[9px] font-mono py-0 px-1.5 border-amber-400/40 text-amber-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Skill Tracks Foldout */}
          <div className="pt-3 space-y-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
              Skill Categories
            </div>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-1 pl-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 py-1">
                  <Folder className="h-3.5 w-3.5 text-amber-500" />
                  <span>{cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SoundToggle />
          </div>

          {currentUser && (
            <button
              onClick={() => {
                logout();
                playClickSound();
                onClose();
                router.push("/login");
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, isAdmin, isAuthenticated, skills } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  // Auth Guard for Protected App Routes
  if (!isAuthenticated && !isPublicPage) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
        <div className="clay-card w-full max-w-md p-8 space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl btn-primary font-mono text-3xl font-black shadow-xl shadow-amber-500/20">
            S
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Authentication Required</h2>
            <p className="text-xs text-zinc-400">
              Please sign in to access your Skill Edge OS dashboard and learning modules.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link href="/login" className="btn-primary w-full py-3 text-sm font-bold shadow-lg">
              Sign In to Continue
            </Link>
            <Link href="/register" className="btn-ghost w-full py-3 text-sm font-bold">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If public page (Landing / Login / Register), render page cleanly
  if (isPublicPage) {
    return <div className="w-full selection:bg-amber-400 selection:text-black">{children}</div>;
  }

  const badgeLevel = currentUser ? levelForXp(currentUser.xp) : 1;

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
        <div className="sidebar-floating-capsule flex flex-col items-center gap-5 py-4 px-2.5 rounded-full shadow-2xl">
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
                    ? "nav-active-pill shadow-lg scale-105"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
              </Link>
            );
          })}
        </div>

        {/* Bottom Floating Profile Capsule */}
        <div className="sidebar-floating-capsule flex flex-col items-center py-2 px-2 rounded-full shadow-2xl">
          <button
            onClick={() => setUserMenuOpen(true)}
            title="User Profile & Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-amber-500 hover:bg-white/10 transition"
          >
            <UserRound className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      {/* 2. Secondary Expanded Navigation Panel */}
      <aside className="sidebar-expanded-panel sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-5 border-r border-white/[0.08] p-5 lg:flex backdrop-blur-3xl overflow-y-auto">
        {/* User Card Header */}
        <button
          onClick={() => setUserMenuOpen(true)}
          title="Click to Open Profile Settings"
          className="flex items-center gap-3 border-b border-white/[0.08] pb-4 text-left group hover:opacity-90 transition"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl neo-box border border-amber-400/40 text-2xl shadow-md group-hover:scale-105 transition">
            {currentUser?.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-white">{currentUser?.name}</span>
              <span className="chip border-amber-400/40 text-[9px] font-mono py-0 px-1 font-bold text-amber-500">
                {currentUser?.role}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0 group-hover:translate-y-0.5 transition" />
            </div>
            <div className="truncate text-[11px] text-zinc-400 font-mono">{currentUser?.email}</div>
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
                ? "nav-active-pill shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              <span>Dashboard</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px]">0</span>
          </Link>
          <Link
            href="/learn/ai-prompt-engineering/practice"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.includes("practice")
                ? "nav-active-pill shadow-lg"
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
                ? "nav-active-pill shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Swords className="h-4 w-4" strokeWidth={1.75} />
              <span>Tournaments</span>
            </div>
            <span className="rounded-full bg-rose-500/20 text-rose-400 border border-rose-400/40 px-2 py-0.5 font-mono text-[10px]">
              3
            </span>
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300",
              pathname.startsWith("/leaderboard")
                ? "nav-active-pill shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="h-4 w-4" strokeWidth={1.75} />
              <span>Hall of Fame</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px]">2</span>
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
                ? "nav-active-pill shadow-lg"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Wallet2 className="h-4 w-4" strokeWidth={1.75} />
              <span>EdgeCoin Wallet</span>
            </div>
            <span className="rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-400/40 px-2 py-0.5 font-mono text-[10px] font-bold">
              ↁ {fmtNum(currentUser?.edgeCoins ?? 0)}
            </span>
          </Link>
        </div>

        {/* Category Section: Skill Tracks */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Skill Tracks</span>
            <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-white">
              +
            </button>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="neo-inset flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white transition"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">Search skills...</span>
          </button>

          <div className="space-y-1 pl-1">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 py-1 px-2">
                  <Folder className="h-3.5 w-3.5 text-amber-500" />
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

      {/* 3. Main Content Container */}
      <div className="flex min-w-0 flex-1 flex-col bg-transparent">
        {/* Top Sticky Header */}
        <header className="top-header-bar sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span className="clay-badge flex h-8 w-8 items-center justify-center btn-primary font-mono text-base font-black">
                S
              </span>
              <span className="font-mono font-bold text-white">
                SKILL<span className="text-amber-500">EDGE</span>
              </span>
            </Link>
            <div className="hidden lg:block" />

            {/* Desktop Topbar Actions */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="header-chip-btn font-mono transition hover:scale-105"
                title="Search skills (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} /> Search <span className="text-[10px] text-zinc-400">Ctrl+K</span>
              </button>
              <button
                onClick={() => setMissionsOpen(true)}
                className="header-chip-btn font-mono text-amber-500 transition hover:scale-105"
                title="Daily Cyber Quests"
              >
                <Target className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} /> Quests
              </button>
              <div className="header-chip-btn font-mono text-orange-500">
                <Flame className="h-3.5 w-3.5" strokeWidth={1.75} /> {currentUser?.streakCount ?? 0}
              </div>
              <Link href="/payment" className="header-chip-btn font-mono text-yellow-600 transition hover:scale-105">
                <span className="font-bold">ↁ</span> {fmtNum(currentUser?.edgeCoins ?? 0)}
              </Link>
              <div className="header-chip-btn font-mono text-violet-500">
                <Zap className="h-3.5 w-3.5" strokeWidth={1.75} /> LVL {badgeLevel}
              </div>

              <ThemeToggle />
              <SoundToggle />
              <NotificationsBell />

              {/* User Profile Trigger Button */}
              <button
                onClick={() => setUserMenuOpen(true)}
                className="header-chip-btn flex items-center gap-2 py-1.5 pl-2 pr-2.5 transition hover:scale-105 active:scale-95"
                title="User Profile & Settings"
              >
                <span className="text-lg leading-none">{currentUser?.avatar}</span>
                <span className="hidden max-w-28 truncate text-xs font-semibold md:block">{currentUser?.name}</span>
                {isAdmin && <ShieldCheck className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />}
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} />
              </button>
            </div>

            {/* Mobile Header Right Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <Link href="/payment" className="header-chip-btn font-mono text-yellow-600">
                <span className="font-bold">ↁ</span> {fmtNum(currentUser?.edgeCoins ?? 0)}
              </Link>

              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="header-chip-btn p-2 text-zinc-300 hover:text-white"
                title="Open Mobile Navigation Menu"
                aria-label="Open Mobile Navigation Menu"
              >
                <Menu className="h-5 w-5 text-amber-500" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        <UserMenuDropdown open={userMenuOpen} onClose={() => setUserMenuOpen(false)} />
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
        />

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
                  active ? "text-amber-400 font-bold" : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_rgba(233,99,26,0.7)]")} strokeWidth={active ? 2 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
