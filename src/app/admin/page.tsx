"use client";

import {
  BadgeCheck,
  BookOpenCheck,
  Coins,
  FileJson,
  Megaphone,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Swords,
  Users2,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdminAnnouncementsTab } from "@/components/admin/AdminAnnouncementsTab";
import { AdminAuditTab } from "@/components/admin/AdminAuditTab";
import { AdminCurriculumTab } from "@/components/admin/AdminCurriculumTab";
import { AdminPaymentsTab } from "@/components/admin/AdminPaymentsTab";
import { AdminQuizzesTab } from "@/components/admin/AdminQuizzesTab";
import { AdminSystemTab } from "@/components/admin/AdminSystemTab";
import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { StatCard } from "@/components/ui";
import { playClickSound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "users" | "payments" | "tournaments" | "curriculum" | "announcements" | "audit" | "system";

export default function AdminPage() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>("users");

  // Strict Security Authorization Check
  if (!app.isAdmin) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-20 text-center space-y-4">
          <ShieldX className="mx-auto h-16 w-16 text-rose-500 animate-pulse" />
          <h1 className="font-mono text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The Admin Command Center requires Super Admin privileges. Please log in with authorized credentials to access platform controls.
          </p>
        </div>
      </AppShell>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "users", label: "Users & Certs", icon: <Users2 className="h-4 w-4" /> },
    { id: "payments", label: "Payments", icon: <Coins className="h-4 w-4" /> },
    { id: "tournaments", label: "Tournaments", icon: <Swords className="h-4 w-4" /> },
    { id: "curriculum", label: "Curriculum & Qs", icon: <BookOpenCheck className="h-4 w-4" /> },
    { id: "announcements", label: "Broadcast", icon: <Megaphone className="h-4 w-4" /> },
    { id: "audit", label: "Audit Ledger", icon: <FileJson className="h-4 w-4" /> },
    { id: "system", label: "Backup & Reset", icon: <RefreshCw className="h-4 w-4" /> },
  ];

  const pendingCount = app.state.transactions.filter((t) => t.status === "PENDING").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="flex items-center gap-2 font-mono text-2xl font-bold text-zinc-50">
            <ShieldCheck className="h-6 w-6 text-amber-400" /> Admin Command Center
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Full control panel for users, payments, quizzes, curriculum questions, broadcasts & database backups.
          </p>
        </div>

        {/* System Metric Overview Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total users" value={app.state.users.length} accent="#06b6d4" icon={<Users2 className="h-4 w-4" />} />
          <StatCard label="Pending payments" value={pendingCount} accent="#f59e0b" icon={<Coins className="h-4 w-4" />} />
          <StatCard label="Tournaments" value={app.state.quizzes.length} accent="#8b5cf6" icon={<Swords className="h-4 w-4" />} />
          <StatCard label="Certificates issued" value={app.state.certificates.length} accent="#10b981" icon={<BadgeCheck className="h-4 w-4" />} />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                playClickSound();
                setTab(t.id);
              }}
              className={cn(
                "neo-button flex shrink-0 items-center gap-2 px-3.5 py-2 text-xs font-semibold transition rounded-xl border",
                tab === t.id
                  ? "border-amber-400/50 bg-amber-500/10 text-amber-300 shadow-md"
                  : "text-zinc-400 hover:text-white border-white/10"
              )}
            >
              {t.icon} {t.label}
              {t.id === "payments" && pendingCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 font-mono text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sub-Tab Components */}
        {tab === "users" && <AdminUsersTab />}
        {tab === "payments" && <AdminPaymentsTab />}
        {tab === "tournaments" && <AdminQuizzesTab />}
        {tab === "curriculum" && <AdminCurriculumTab />}
        {tab === "announcements" && <AdminAnnouncementsTab />}
        {tab === "audit" && <AdminAuditTab />}
        {tab === "system" && <AdminSystemTab />}
      </div>
    </AppShell>
  );
}
