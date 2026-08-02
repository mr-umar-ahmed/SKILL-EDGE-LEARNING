"use client";

import {
  ClipboardCheck,
  CreditCard,
  HardDrive,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdminAnnouncementsTab } from "@/components/admin/AdminAnnouncementsTab";
import { AdminBuilderTab } from "@/components/admin/AdminBuilderTab";
import { AdminMissionsTab } from "@/components/admin/AdminMissionsTab";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminPaymentsTab } from "@/components/admin/AdminPaymentsTab";
import { AdminReviewsTab } from "@/components/admin/AdminReviewsTab";
import { AdminSkillsTab } from "@/components/admin/AdminSkillsTab";
import { AdminSystemTab } from "@/components/admin/AdminSystemTab";
import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { EmptyState, PageHeader, Skeleton, SkeletonCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import { adminEmails, cn } from "@/lib/utils";

type TabId = "overview" | "builder" | "reviews" | "skills" | "missions" | "users" | "payments" | "announcements" | "system";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "builder", label: "Mission Builder", icon: Sparkles },
  { id: "reviews", label: "Reviews", icon: ClipboardCheck },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "missions", label: "Missions", icon: Target },
  { id: "users", label: "Users", icon: Users2 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "system", label: "System & Data", icon: HardDrive },
];

export default function AdminPage() {
  const { hydrated, isAdmin, currentUser, loginWithCredentials, state } = useApp();
  const [tab, setTab] = useState<TabId>("overview");


  const pendingReviews = state.submissions.filter(
    (s) => s.status === "PENDING" || s.status === "UNDER_REVIEW"
  ).length;

  if (!hydrated) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  const isAllowed = isAdmin || (currentUser && adminEmails().includes(currentUser.email.toLowerCase()));

  if (!isAllowed) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg py-16">
          <EmptyState
            icon={<ShieldAlert className="h-12 w-12" />}
            title="Admins only"
            text="This command center is reserved for Skill Edge Learning administrators. Sign in with learningskilledge@gmail.com to access the command center."
            action={
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    loginWithCredentials("learningskilledge@gmail.com", "SelAdmin#2026!");
                  }}
                  className="btn-primary"
                >
                  Sign In as Admin (learningskilledge@gmail.com)
                </button>
                <Link href="/dashboard" className="btn-ghost">
                  Back to Dashboard
                </Link>
              </div>
            }
          />
        </div>
      </AppShell>
    );
  }


  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Admin Command Center"
          subtitle="Analytics, review queue, catalog CRUD, users, payments and broadcasts — full control over the Skill OS."
        />

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                  active
                    ? "nav-active-pill border-transparent"
                    : "border-line bg-card/60 text-zinc-400 hover:bg-hover hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {t.id === "reviews" && pendingReviews > 0 && (
                  <span
                    className={cn(
                      "min-w-[18px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold",
                      active ? "bg-white/25 text-white" : "bg-danger text-white"
                    )}
                  >
                    {pendingReviews}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="animate-fade-up" key={tab}>
          {tab === "overview" && <AdminOverviewTab />}
          {tab === "builder" && <AdminBuilderTab />}
          {tab === "reviews" && <AdminReviewsTab />}
          {tab === "skills" && <AdminSkillsTab />}
          {tab === "missions" && <AdminMissionsTab />}
          {tab === "users" && <AdminUsersTab />}
          {tab === "payments" && <AdminPaymentsTab />}
          {tab === "announcements" && <AdminAnnouncementsTab />}
          {tab === "system" && <AdminSystemTab />}
        </div>
      </div>
    </AppShell>
  );
}
