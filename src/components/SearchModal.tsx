"use client";

import {
  ArrowRight,
  BookOpen,
  Compass,
  LayoutDashboard,
  Search,
  Swords,
  Trophy,
  UserRound,
  Wallet2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { playClickSound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Modal } from "./ui";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "skill" | "page" | "quiz";
  href: string;
  icon: typeof Search;
}

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { skills, state } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const items: SearchResult[] = useMemo(() => {
    const pages: SearchResult[] = [
      { id: "p-dash", title: "Dashboard Hub", subtitle: "User metrics & skill map", category: "page", href: "/dashboard", icon: LayoutDashboard },
      { id: "p-lead", title: "Global Leaderboard", subtitle: "Top skill rankings & podium", category: "page", href: "/leaderboard", icon: Trophy },
      { id: "p-quiz", title: "Tournament Lobby", subtitle: "Weekly paid quizzes", category: "page", href: "/quizzes", icon: Swords },
      { id: "p-[#wall]", title: "EdgeCoin Wallet", subtitle: "Buy coins & transaction history", category: "page", href: "/payment", icon: Wallet2 },
      { id: "p-prof", title: "User Profile", subtitle: "Customize avatar, frame & title", category: "page", href: "/profile", icon: UserRound },
    ];

    const skillItems: SearchResult[] = skills.map((s) => ({
      id: `s-${s.id}`,
      title: s.title,
      subtitle: `${s.category} · 10 Tiers`,
      category: "skill",
      href: `/learn/${s.id}`,
      icon: BookOpen,
    }));

    const quizItems: SearchResult[] = state.quizzes.map((q) => ({
      id: `q-${q.id}`,
      title: q.title,
      subtitle: `Tournament · Prize Pool ↁ${q.prizePoolCoins}`,
      category: "quiz",
      href: `/quiz/${q.id}`,
      icon: Zap,
    }));

    return [...pages, ...skillItems, ...quizItems];
  }, [skills, state.quizzes]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleSelect = (href: string) => {
    playClickSound();
    onClose();
    router.push(href);
  };

  return (
    <Modal open={open} onClose={onClose} title="🔍 Quick Navigation & Search">
      <div className="space-y-4">
        {/* Search input field */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search skills, tournaments, or pages... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/60 py-3 pl-10 pr-4 font-mono text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching skills or pages found for &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="font-mono text-xs text-zinc-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
