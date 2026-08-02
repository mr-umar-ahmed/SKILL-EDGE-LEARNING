"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Award,
  FolderKanban,
  Hexagon,
  LayoutDashboard,
  Library,
  LogOut,
  Search,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  UserRound,
  Wallet2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { UserAvatar } from "@/components/UserAvatar";
import { playClickSound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { cn, fmtNum } from "@/lib/utils";
import { SoundToggle } from "./Toggles";

export function MobileDrawer({
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
  const { signOut } = useClerk();
  const { currentUser, isAdmin } = useApp();

  if (!open) return null;

  const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/skills", label: "Skills", icon: Library },
    { href: "/portfolio", label: "Portfolio", icon: FolderKanban },
    { href: "/certificates", label: "Certificates", icon: Award },
    { href: "/quizzes", label: "Tournaments", icon: Swords },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/wallet", label: "Wallet", icon: Wallet2, badge: fmtNum(currentUser?.neurons ?? 0) },
    { href: "/profile", label: "Profile", icon: UserRound },
  ];

  if (isAdmin) {
    NAV_ITEMS.push({ href: "/admin", label: "Admin", icon: ShieldCheck, badge: "Admin" });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md lg:hidden">
      <div className="glass-strong flex h-full w-4/5 max-w-sm flex-col overflow-y-auto rounded-none border-l border-line p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div onClick={onClose}>
            <BrandMark href="/dashboard" size="sm" />
          </div>
          <button onClick={onClose} className="header-chip-btn p-2" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User card */}
        {currentUser && (
          <div className="my-4 flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
            <UserAvatar user={currentUser} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate text-sm font-bold text-white">
                {currentUser.name}
                {isAdmin && <span className="chip px-1.5 py-0 text-[9px] text-brand">Admin</span>}
              </div>
              <div className="truncate text-[11px] text-zinc-500">{currentUser.email}</div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="header-chip-btn w-full justify-center py-2 text-xs"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenMissions();
            }}
            className="header-chip-btn w-full justify-center py-2 text-xs text-brand"
          >
            <Target className="h-3.5 w-3.5" /> Quests
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-semibold transition-all",
                  active ? "nav-active-pill" : "text-zinc-300 hover:bg-hover/60 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="chip px-1.5 py-0 text-[9px]">{item.badge}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line pt-4">
          <SoundToggle />
          {currentUser && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
                void signOut({ redirectUrl: "/" });
              }}
              className="btn-ghost border-danger/30 px-3 py-1.5 text-xs text-danger hover:bg-danger/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
