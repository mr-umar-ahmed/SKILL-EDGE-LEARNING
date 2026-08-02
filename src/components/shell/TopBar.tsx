"use client";

import { Flame, Hexagon, Menu, Search, Target, Zap } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/UserAvatar";
import { useApp } from "@/lib/store";
import { fmtNum, levelForXp } from "@/lib/utils";
import { NotificationsBell } from "./NotificationsBell";
import { SoundToggle } from "./Toggles";

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
  const { currentUser } = useApp();
  const badgeLevel = currentUser ? levelForXp(currentUser.xp) : 1;

  return (
    <header className="top-header-bar sticky top-0 z-40 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Mobile brand */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-deep">
            <Hexagon className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold text-white">Skill Edge</span>
        </Link>
        <div className="hidden lg:block" />

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 py-1 lg:flex">
          <button onClick={onOpenSearch} className="header-chip-btn" title="Search (Ctrl+K)">
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} /> Search
          </button>
          <button onClick={onOpenMissions} className="header-chip-btn text-brand" title="Daily Quests">
            <Target className="h-3.5 w-3.5" strokeWidth={1.75} /> Quests
          </button>
          <div className="header-chip-btn text-warning" title="Learning streak">
            <Flame className="h-3.5 w-3.5" strokeWidth={1.75} /> {currentUser?.streakCount ?? 0}
          </div>
          <Link href="/wallet" className="header-chip-btn text-accent" title="Neuron wallet">
            <Hexagon className="h-3.5 w-3.5 fill-accent/20" strokeWidth={2} /> {fmtNum(currentUser?.neurons ?? 0)}
          </Link>
          <div className="header-chip-btn text-premium" title="XP level">
            <Zap className="h-3.5 w-3.5" strokeWidth={1.75} /> LVL {badgeLevel}
          </div>

          <SoundToggle />
          <NotificationsBell />

          <button
            onClick={onOpenUserMenu}
            className="flex items-center rounded-full transition hover:scale-105 active:scale-95"
            title="Account"
          >
            <UserAvatar user={currentUser} size={32} />
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/wallet" className="header-chip-btn text-accent">
            <Hexagon className="h-3.5 w-3.5 fill-accent/20" strokeWidth={2} /> {fmtNum(currentUser?.neurons ?? 0)}
          </Link>
          <NotificationsBell />
          <button
            onClick={onOpenMobileDrawer}
            className="header-chip-btn p-2"
            title="Menu"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
