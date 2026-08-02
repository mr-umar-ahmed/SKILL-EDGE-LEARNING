"use client";

import { ChevronDown, Flame, Menu, Search, ShieldCheck, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { fmtNum, levelForXp, studentTierForXp } from "@/lib/utils";
import { NotificationsBell } from "./NotificationsBell";
import { SoundToggle, ThemeToggle } from "./Toggles";

export function TopBar({
  onOpenSearch,
  onOpenMissions,
  onOpenUserMenu,
  onOpenMobileDrawer,
}: {
  onOpenSearch: () => void;
  onOpenMissions: () => void;
  onOpenUserMenu: () => void;
  onOpenMobileDrawer: () => void;
}) {
  const { currentUser, isAdmin } = useApp();
  const badgeLevel = currentUser ? levelForXp(currentUser.xp) : 1;
  const studentTier = studentTierForXp(currentUser?.xp ?? 0);

  return (
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
            onClick={onOpenSearch}
            className="header-chip-btn font-mono transition hover:scale-105"
            title="Search skills (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.75} /> Search{" "}
            <span className="text-[10px] text-zinc-400">Ctrl+K</span>
          </button>
          <button
            onClick={onOpenMissions}
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
          <div className="header-chip-btn font-mono text-cyan-400 font-bold flex items-center gap-1 border border-cyan-500/30 bg-cyan-500/10">
            <span>{studentTier.icon}</span>
            <span>{studentTier.name}</span>
          </div>

          <ThemeToggle />
          <SoundToggle />
          <NotificationsBell />

          {/* User Profile Trigger Button */}
          <button
            onClick={onOpenUserMenu}
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
            onClick={onOpenMobileDrawer}
            className="header-chip-btn p-2 text-zinc-300 hover:text-white"
            title="Open Mobile Navigation Menu"
            aria-label="Open Mobile Navigation Menu"
          >
            <Menu className="h-5 w-5 text-amber-500" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
