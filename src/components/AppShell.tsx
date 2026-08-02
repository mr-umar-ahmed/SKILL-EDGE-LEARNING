"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Hexagon } from "lucide-react";
import { useApp } from "@/lib/store";
import { DailyMissionsModal } from "./DailyMissionsModal";
import { SearchModal } from "./SearchModal";
import { MobileDrawer } from "./shell/MobileDrawer";
import { Sidebar } from "./shell/Sidebar";
import { TopBar } from "./shell/TopBar";
import { UserProfileModal } from "./shell/UserProfileModal";
import { Skeleton } from "./ui";

const PUBLIC_PREFIXES = ["/login", "/register", "/pricing", "/certificate/", "/verify/", "/p/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hydrated, isAuthenticated } = useApp();
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isPublicPage = pathname === "/" || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

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

  // Public pages render without the app chrome
  if (isPublicPage) {
    return <div className="w-full">{children}</div>;
  }

  // Waiting for hydration / Clerk sync — skeleton shell, no flash of "sign in"
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh w-full">
        <div className="sidebar-expanded-panel hidden h-dvh w-64 shrink-0 flex-col gap-4 p-4 lg:flex">
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-full" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="top-header-bar flex items-center justify-end gap-2 px-6 py-3.5">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
        {/* If truly signed out, middleware already redirects; this is a graceful fallback */}
        {hydrated && !isAuthenticated && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-base/80 backdrop-blur-sm">
            <div className="clay-card w-full max-w-md space-y-5 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
                <Hexagon className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-xl font-bold text-white">Sign in to continue</h2>
                <p className="text-xs text-zinc-400">Your missions, portfolio and progress live behind your account.</p>
              </div>
              <div className="space-y-2.5">
                <Link href="/login" className="btn-primary w-full py-3 text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-ghost w-full py-3 text-sm">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden">
      <Sidebar onOpenSearch={() => setSearchOpen(true)} onOpenUserMenu={() => setUserMenuOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col bg-transparent">
        <TopBar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
          onOpenUserMenu={() => setUserMenuOpen(true)}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        <DailyMissionsModal open={missionsOpen} onClose={() => setMissionsOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        <UserProfileModal open={userMenuOpen} onClose={() => setUserMenuOpen(false)} />
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMissions={() => setMissionsOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
