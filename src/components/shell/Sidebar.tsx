"use client";

import {
  Award,
  FolderKanban,
  Hexagon,
  LayoutDashboard,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
  Wallet2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { useApp } from "@/lib/store";
import { cn, fmtNum, isPaidPlan } from "@/lib/utils";

const NAV_GROUPS: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    label: "Learn",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/skills", label: "Skills", icon: Library },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/portfolio", label: "Portfolio", icon: FolderKanban },
      { href: "/certificates", label: "Certificates", icon: Award },
    ],
  },
  {
    label: "Compete",
    items: [
      { href: "/quizzes", label: "Tournaments", icon: Swords },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/wallet", label: "Wallet", icon: Wallet2 },
      { href: "/profile", label: "Profile", icon: UserRound },
    ],
  },
];

export function Sidebar({
  onOpenSearch,
  onOpenUserMenu,
}: {
  onOpenSearch: () => void;
  onOpenUserMenu: () => void;
}) {
  const pathname = usePathname();
  const { currentUser, isAdmin, isPro } = useApp();

  return (
    <aside className="sidebar-expanded-panel sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-4 p-4 backdrop-blur-3xl lg:flex">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 pt-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
          <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-tight text-white">Skill Edge</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Learning OS</div>
        </div>
      </Link>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="neo-inset flex w-full items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 transition hover:border-brand/40 hover:text-white"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <span className="ml-auto rounded-md border border-line bg-card px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
          Ctrl K
        </span>
      </button>

      {/* Nav groups */}
      <nav className="flex-1 space-y-4 overflow-y-auto pb-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">{group.label}</div>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200",
                    active ? "nav-active-pill" : "text-zinc-400 hover:bg-hover/60 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {isAdmin && (
          <div className="space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Manage</div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200",
                pathname.startsWith("/admin") ? "nav-active-pill" : "text-zinc-400 hover:bg-hover/60 hover:text-white"
              )}
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              <span>Admin</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Upgrade nudge (free users) */}
      {currentUser && !isPro && (
        <Link
          href="/pricing"
          className="card-glow flex items-center gap-2.5 p-3 transition"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-premium/15 text-premium">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-xs font-bold text-white">Upgrade to Pro</div>
            <div className="truncate text-[10px] text-zinc-500">All missions · ad-free</div>
          </div>
        </Link>
      )}

      {/* User footer */}
      {currentUser && (
        <button
          onClick={onOpenUserMenu}
          className="flex items-center gap-2.5 rounded-xl border border-line bg-card/70 p-2.5 text-left transition hover:border-brand/40"
        >
          <UserAvatar user={currentUser} size={32} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-xs font-bold text-white">{currentUser.name}</div>
            <div className="truncate text-[10px] text-zinc-500">
              {isPaidPlan(currentUser.subscription) ? "Pro Member" : "Free Plan"} · {fmtNum(currentUser.neurons)} Neurons
            </div>
          </div>
        </button>
      )}
    </aside>
  );
}
