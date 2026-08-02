"use client";

import { Folder, Home, Layers, LogOut, Search, ShieldCheck, Swords, Target, Trophy, UserRound, Wallet2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { playClickSound } from "@/lib/sound";
import { SoundToggle, ThemeToggle } from "./Toggles";

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
              className="btn-ghost text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border-rose-500/30 py-1.5 px-3"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
