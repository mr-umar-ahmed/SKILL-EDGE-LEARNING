"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { DailyMissionsModal } from "./DailyMissionsModal";
import { SearchModal } from "./SearchModal";
import { MobileDrawer } from "./shell/MobileDrawer";
import { Sidebar } from "./shell/Sidebar";
import { TopBar } from "./shell/TopBar";
import { UserProfileModal } from "./shell/UserProfileModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* 1. Desktop Floating Dual-Rail Sidebar */}
      <Sidebar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenUserMenu={() => setUserMenuOpen(true)}
      />

      {/* 2. Main Content Container */}
      <div className="flex min-w-0 flex-1 flex-col bg-transparent">
        {/* Top Sticky Header */}
        <TopBar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
          onOpenUserMenu={() => setUserMenuOpen(true)}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* Global Modals */}
        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        <UserProfileModal open={userMenuOpen} onClose={() => setUserMenuOpen(false)} />
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
