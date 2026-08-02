"use client";

import { useMemo, useState } from "react";
import { SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, fmtNum, timeAgo } from "@/lib/utils";

export function AdminAuditTab() {
  const { state } = useApp();
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredTxns = useMemo(() => {
    if (filterType === "ALL") return state.transactions;
    return state.transactions.filter((t) => t.type === filterType);
  }, [state.transactions, filterType]);

  const userOf = (id: string) => state.users.find((u) => u.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Global Financial & Reward Audit Log ({filteredTxns.length})</SectionTitle>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-dark !w-48 text-xs font-mono"
        >
          <option value="ALL" className="bg-zinc-900">All Transaction Types</option>
          <option value="PURCHASED" className="bg-zinc-900">PURCHASED</option>
          <option value="EARNED" className="bg-zinc-900">EARNED</option>
          <option value="ADMIN_GRANT" className="bg-zinc-900">ADMIN_GRANT</option>
          <option value="PRIZE" className="bg-zinc-900">PRIZE</option>
          <option value="SPENT_COURSE" className="bg-zinc-900">SPENT_COURSE</option>
        </select>
      </div>

      <div className="glass divide-y divide-white/[0.05]">
        {filteredTxns.map((t) => {
          const u = userOf(t.userId);
          return (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-xl">{u?.avatar || "👤"}</span>
                <div>
                  <div className="font-semibold text-zinc-100">{u?.name} ({u?.email})</div>
                  <div suppressHydrationWarning className="font-mono text-[11px] text-zinc-500">{t.note} · {timeAgo(t.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span
                  className={cn(
                    "chip",
                    t.amountCoins >= 0 ? "border-yellow-400/30 text-yellow-300" : "border-rose-400/30 text-rose-300"
                  )}
                >
                  {t.amountCoins >= 0 ? `+ↁ${fmtNum(t.amountCoins)}` : `-ↁ${fmtNum(Math.abs(t.amountCoins))}`}
                </span>
                <span className="chip border-white/10 text-zinc-400">{t.type}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
