"use client";

import { Award, BadgeCheck, CreditCard, FolderCheck, TrendingUp, Users2, Zap } from "lucide-react";
import { useMemo } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { EmptyState, SectionTitle, StatCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { SubmissionStatus } from "@/lib/types";
import { fmtInr, fmtNum, planDef, todayKey } from "@/lib/utils";

const FUNNEL: { status: SubmissionStatus; label: string; color: string }[] = [
  { status: "PENDING", label: "Pending", color: "#facc15" },
  { status: "UNDER_REVIEW", label: "Under Review", color: "#06b6d4" },
  { status: "APPROVED", label: "Approved", color: "#22c55e" },
  { status: "NEEDS_IMPROVEMENT", label: "Needs Improvement", color: "#a78bfa" },
  { status: "REJECTED", label: "Rejected", color: "#ef4444" },
];

const PLAN_COLORS: Record<string, string> = {
  FREE: "#9ca3af",
  PRO_MONTHLY: "#3b82f6",
  PRO_YEARLY: "#06b6d4",
  FOUNDER_LIFETIME: "#8b5cf6",
};

export function AdminOverviewTab() {
  const { state } = useApp();

  const metrics = useMemo(() => {
    const today = todayKey();
    const totalUsers = state.users.length;
    const activeToday = state.users.filter((u) => u.lastActiveDay === today).length;

    const paymentRevenue = state.payments
      .filter((p) => p.status === "APPROVED")
      .reduce((sum, p) => sum + p.amountInr, 0);
    const topupRevenue = state.transactions
      .filter((t) => t.type === "PURCHASED" && t.status === "APPROVED")
      .reduce((sum, t) => sum + (t.amountInr ?? 0), 0);
    const revenue = paymentRevenue + topupRevenue;

    const plansCount: Record<string, number> = { FREE: 0, PRO_MONTHLY: 0, PRO_YEARLY: 0, FOUNDER_LIFETIME: 0 };
    state.users.forEach((u) => {
      plansCount[u.subscription.plan] = (plansCount[u.subscription.plan] ?? 0) + 1;
    });
    const paidSubs = totalUsers - (plansCount.FREE ?? 0);

    // approved missions per skill across all users' progress
    const missionToSkill = new Map<string, string>();
    state.catalog.forEach((sk) => sk.missions.forEach((m) => missionToSkill.set(m.id, sk.id)));
    const skillCounts = new Map<string, number>();
    let approvedProjects = 0;
    Object.values(state.progress).forEach((prog) => {
      Object.keys(prog.completed).forEach((missionId) => {
        approvedProjects += 1;
        const skillId = missionToSkill.get(missionId);
        if (skillId) skillCounts.set(skillId, (skillCounts.get(skillId) ?? 0) + 1);
      });
    });
    const popularSkills = state.catalog
      .map((sk) => ({ skill: sk, count: skillCounts.get(sk.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const maxSkillCount = Math.max(1, ...popularSkills.map((p) => p.count));

    const funnel = FUNNEL.map((f) => ({
      ...f,
      count: state.submissions.filter((s) => s.status === f.status).length,
    }));
    const totalSubs = Math.max(1, state.submissions.length);

    // user growth by month (from createdAt)
    const byMonth = new Map<string, number>();
    state.users.forEach((u) => {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    });
    const months: { key: string; label: string; count: number }[] = [];
    const cursor = new Date();
    cursor.setDate(1);
    cursor.setMonth(cursor.getMonth() - 11);
    for (let i = 0; i < 12; i++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        key,
        label: cursor.toLocaleDateString("en-IN", { month: "short" }),
        count: byMonth.get(key) ?? 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const maxMonth = Math.max(1, ...months.map((m) => m.count));

    return {
      totalUsers,
      activeToday,
      revenue,
      paidSubs,
      plansCount,
      approvedProjects,
      popularSkills,
      maxSkillCount,
      funnel,
      totalSubs,
      months,
      maxMonth,
      certificates: state.certificates.length,
    };
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total users" value={fmtNum(metrics.totalUsers)} icon={<Users2 className="h-4 w-4" />} accent="#3b82f6" />
        <StatCard label="Active today" value={fmtNum(metrics.activeToday)} icon={<Zap className="h-4 w-4" />} accent="#facc15" />
        <StatCard label="Revenue" value={fmtInr(metrics.revenue)} icon={<CreditCard className="h-4 w-4" />} accent="#22c55e" />
        <StatCard label="Paid plans" value={fmtNum(metrics.paidSubs)} icon={<Award className="h-4 w-4" />} accent="#8b5cf6" />
        <StatCard label="Certificates" value={fmtNum(metrics.certificates)} icon={<BadgeCheck className="h-4 w-4" />} accent="#06b6d4" />
        <StatCard label="Approved projects" value={fmtNum(metrics.approvedProjects)} icon={<FolderCheck className="h-4 w-4" />} accent="#22c55e" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Popular skills */}
        <div className="clay-card p-5">
          <SectionTitle>Popular skills</SectionTitle>
          {metrics.popularSkills.every((p) => p.count === 0) ? (
            <EmptyState
              icon={<TrendingUp className="h-8 w-8" />}
              text="No approved missions yet — rankings appear once students start shipping."
            />
          ) : (
            <div className="space-y-3.5">
              {metrics.popularSkills.map(({ skill, count }) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line"
                    style={{ background: `${skill.color}1a`, color: skill.color }}
                  >
                    <SkillIcon name={skill.iconName} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-white">{skill.title}</span>
                      <span className="shrink-0 text-xs font-bold text-zinc-400">
                        {fmtNum(count)} approved
                      </span>
                    </div>
                    <div className="progress-track mt-1.5" style={{ height: 6 }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / metrics.maxSkillCount) * 100}%`,
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`,
                          transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission funnel */}
        <div className="clay-card p-5">
          <SectionTitle>Submission funnel</SectionTitle>
          {state.submissions.length === 0 ? (
            <EmptyState
              icon={<FolderCheck className="h-8 w-8" />}
              text="No submissions yet. The funnel fills up as students submit mission projects."
            />
          ) : (
            <div className="space-y-3.5">
              {metrics.funnel.map((f) => (
                <div key={f.status}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-300">{f.label}</span>
                    <span className="text-xs font-bold" style={{ color: f.color }}>
                      {fmtNum(f.count)}
                    </span>
                  </div>
                  <div className="progress-track mt-1.5" style={{ height: 6 }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(f.count / metrics.totalSubs) * 100}%`,
                        background: f.color,
                        transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* User growth */}
        <div className="clay-card p-5 lg:col-span-2">
          <SectionTitle>User growth — last 12 months</SectionTitle>
          <div className="flex h-36 items-end gap-1.5 sm:gap-2">
            {metrics.months.map((m) => (
              <div key={m.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5" title={`${m.label}: ${m.count} signups`}>
                <span className="text-[10px] font-bold text-zinc-400">{m.count > 0 ? m.count : ""}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-brand-deep to-accent"
                    style={{
                      height: `${Math.max(m.count > 0 ? 8 : 2, (m.count / metrics.maxMonth) * 100)}%`,
                      opacity: m.count > 0 ? 1 : 0.15,
                      transition: "height 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions by plan */}
        <div className="clay-card p-5">
          <SectionTitle>Subscriptions by plan</SectionTitle>
          <div className="space-y-3">
            {(["FREE", "PRO_MONTHLY", "PRO_YEARLY", "FOUNDER_LIFETIME"] as const).map((planId) => {
              const count = metrics.plansCount[planId] ?? 0;
              const pct = metrics.totalUsers > 0 ? (count / metrics.totalUsers) * 100 : 0;
              return (
                <div key={planId}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                      <span className="h-2 w-2 rounded-full" style={{ background: PLAN_COLORS[planId] }} />
                      {planDef(planId).name}
                    </span>
                    <span className="text-xs font-bold text-white">{fmtNum(count)}</span>
                  </div>
                  <div className="progress-track mt-1.5" style={{ height: 6 }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: PLAN_COLORS[planId], transition: "width 0.8s ease" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
