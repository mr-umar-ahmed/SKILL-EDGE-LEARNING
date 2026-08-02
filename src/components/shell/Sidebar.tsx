"use client";

import {
  ChevronDown,
  Folder,
  Home,
  Layers,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Swords,
  Trophy,
  UserRound,
  Wallet2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn, fmtNum } from "@/lib/utils";

export function Sidebar({
  onOpenSearch,
  onOpenUserMenu,
}: {
  onOpenSearch: () => void;
  onOpenUserMenu: () => void;
}) {
  const pathname = usePathname();
  const { currentUser, isAdmin, skills } = useApp();

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
    <>
      {/* 1. Far-Left Floating Primary Command Rail */}
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center justify-between py-6 px-2 lg:flex z-50">
        {/* Floating Rail Capsule */}
        <div className="sidebar-floating-capsule flex flex-col items-center gap-5 py-4 px-2.5 rounded-full shadow-2xl">
          {/* Top Brand Star Icon */}
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full btn-primary font-mono text-xl font-black shadow-lg hover:scale-110 transition"
          >
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
            onClick={onOpenUserMenu}
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
          onClick={onOpenUserMenu}
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
            <button onClick={onOpenSearch} className="text-zinc-400 hover:text-white">
              +
            </button>
          </div>

          <button
            onClick={onOpenSearch}
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
    </>
  );
}
