"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  FolderKanban,
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
import { fmtNum } from "@/lib/utils";
import { Modal } from "./ui";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "skill" | "page" | "quiz";
  href: string;
  icon: typeof Search;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { catalog, state } = useApp();
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
      { id: "p-dash", title: "Dashboard", subtitle: "Your learning HQ", category: "page", href: "/dashboard", icon: LayoutDashboard },
      { id: "p-skills", title: "Skills Catalog", subtitle: "All skill tracks", category: "page", href: "/skills", icon: BookOpen },
      { id: "p-port", title: "Portfolio", subtitle: "Your approved projects", category: "page", href: "/portfolio", icon: FolderKanban },
      { id: "p-certs", title: "Certificates", subtitle: "Earned certificates", category: "page", href: "/certificates", icon: Award },
      { id: "p-lead", title: "Leaderboard", subtitle: "Top builders", category: "page", href: "/leaderboard", icon: Trophy },
      { id: "p-quiz", title: "Tournaments", subtitle: "Weekly quiz arena", category: "page", href: "/quizzes", icon: Swords },
      { id: "p-wall", title: "Wallet", subtitle: "Neurons & transactions", category: "page", href: "/wallet", icon: Wallet2 },
      { id: "p-prof", title: "Profile", subtitle: "Stats, badges & bio", category: "page", href: "/profile", icon: UserRound },
    ];

    const skillItems: SearchResult[] = catalog.map((s) => ({
      id: `s-${s.id}`,
      title: s.title,
      subtitle: `${s.category} · ${s.missions.length} missions`,
      category: "skill",
      href: `/learn/${s.id}`,
      icon: BookOpen,
    }));

    const quizItems: SearchResult[] = state.quizzes.map((q) => ({
      id: `q-${q.id}`,
      title: q.title,
      subtitle: `Tournament · Prize pool ${fmtNum(q.prizePoolNeurons)} Neurons`,
      category: "quiz",
      href: `/quiz/${q.id}`,
      icon: Zap,
    }));

    return [...pages, ...skillItems, ...quizItems];
  }, [catalog, state.quizzes]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q));
  }, [items, query]);

  const handleSelect = (href: string) => {
    playClickSound();
    onClose();
    router.push(href);
  };

  return (
    <Modal open={open} onClose={onClose} title="Search">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            autoFocus
            placeholder="Search skills, tournaments, pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-dark py-3 pl-10"
          />
        </div>

        <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">No results for &quot;{query}&quot;.</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-card/60 p-3 text-left transition hover:border-brand/50 hover:bg-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-zinc-500">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
