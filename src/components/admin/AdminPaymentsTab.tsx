"use client";

import { BadgeCheck, XCircle } from "lucide-react";
import { SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, fmtNum, timeAgo } from "@/lib/utils";

export function AdminPaymentsTab() {
  const { state, adminSetTxnStatus } = useApp();

  const purchases = state.transactions.filter((t) => t.type === "PURCHASED");
  const pending = purchases.filter((t) => t.status === "PENDING");
  const history = purchases.filter((t) => t.status !== "PENDING");
  const userOf = (id: string) => state.users.find((u) => u.id === id);

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Pending Verification Queue ({pending.length})</SectionTitle>
        {pending.length === 0 && (
          <div className="glass p-8 text-center text-sm text-zinc-500">Queue clear — no pending payment requests. 🎉</div>
        )}
        <div className="space-y-3">
          {pending.map((t) => {
            const u = userOf(t.userId);
            return (
              <div key={t.id} className="glass border-amber-400/20 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl">{u?.avatar}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-100">{u?.name}</div>
                    <div className="text-xs text-zinc-500">{u?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-yellow-300">₹{fmtNum(t.amountInr ?? 0)} → ↁ{fmtNum(t.amountCoins)}</div>
                    <div suppressHydrationWarning className="text-[11px] text-zinc-500">{timeAgo(t.createdAt)}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="chip font-mono">UTR {t.utrNumber ?? "—"}</span>
                  <span className="chip">{t.proofImageName ? `📎 ${t.proofImageName}` : "No screenshot attached"}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => adminSetTxnStatus(t.id, "APPROVED")} className="btn-primary flex-1 !py-2 text-sm font-bold">
                    <BadgeCheck className="h-4 w-4" /> Approve & credit ↁ{fmtNum(t.amountCoins)}
                  </button>
                  <button onClick={() => adminSetTxnStatus(t.id, "REJECTED")} className="btn-ghost flex-1 !py-2 text-sm text-rose-300">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <SectionTitle>Processed History Log</SectionTitle>
        <div className="glass divide-y divide-white/[0.05]">
          {history.map((t) => {
            const u = userOf(t.userId);
            return (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span>{u?.avatar}</span>
                <span className="min-w-0 flex-1 truncate text-zinc-300">
                  {u?.name} · ₹{fmtNum(t.amountInr ?? 0)} · UTR {t.utrNumber}
                </span>
                <span
                  className={cn(
                    "chip",
                    t.status === "APPROVED" ? "border-emerald-400/30 text-emerald-300" : "border-rose-400/30 text-rose-300"
                  )}
                >
                  {t.status}
                </span>
              </div>
            );
          })}
          {history.length === 0 && <div className="p-6 text-center text-sm text-zinc-500">No processed payments yet.</div>}
        </div>
      </div>
    </div>
  );
}
