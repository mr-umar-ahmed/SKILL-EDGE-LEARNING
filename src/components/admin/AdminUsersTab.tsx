"use client";

import { Pencil, Search } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import { fmtNum, levelForXp } from "@/lib/utils";

export function AdminUsersTab() {
  const { state, skills, adminAdjustCoins, adminGrantXp, adminIssueCertificate } = useApp();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [coinDelta, setCoinDelta] = useState(50);
  const [xpDelta, setXpDelta] = useState(100);
  const [note, setNote] = useState("");
  const [certSkillId, setCertSkillId] = useState(skills[0]?.id || "ai-prompt-engineering");
  const [certTier, setCertTier] = useState<number>(5);

  const users = state.users.filter(
    (u) => u.role !== "ADMIN" && (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  );
  const targetUser = state.users.find((u) => u.id === target);

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-dark !pl-9"
          placeholder="Search by name or email…"
        />
      </div>
      <div className="glass divide-y divide-white/[0.05]">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span className="text-2xl">{u.avatar}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-zinc-100">{u.name}</span>
                {u.title && <span className="chip border-cyan-400/30 text-[10px] text-cyan-300">{u.title}</span>}
              </div>
              <div className="truncate text-xs text-zinc-500">{u.email}</div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="chip border-yellow-400/30 text-yellow-300">ↁ{fmtNum(u.edgeCoins)}</span>
              <span className="chip border-violet-400/30 text-violet-300">LVL {levelForXp(u.xp)}</span>
              <span className="chip border-orange-400/30 text-orange-300">🔥 {u.streakCount}</span>
            </div>
            <button onClick={() => setTarget(u.id)} className="btn-ghost !px-3 !py-1.5 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Manage User
            </button>
          </div>
        ))}
        {users.length === 0 && <div className="p-8 text-center text-sm text-zinc-500">No users match that search.</div>}
      </div>

      <Modal open={!!targetUser} onClose={() => setTarget(null)} title={`Manage ${targetUser?.name ?? ""}`}>
        {targetUser && (
          <div className="space-y-5">
            <div className="glass flex items-center justify-between p-3 text-sm">
              <span className="text-zinc-400">Current Wallet & XP</span>
              <div className="flex items-center gap-3 font-mono font-bold">
                <span className="text-yellow-300">ↁ{fmtNum(targetUser.edgeCoins)}</span>
                <span className="text-violet-300">{fmtNum(targetUser.xp)} XP</span>
              </div>
            </div>

            {/* Wallet adjustment */}
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                1. Grant / Revoke EdgeCoins
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={coinDelta}
                  onChange={(e) => setCoinDelta(Number(e.target.value))}
                  className="input-dark flex-1"
                />
                <button
                  onClick={() => {
                    adminAdjustCoins(targetUser.id, coinDelta, note || "Admin adjustment");
                    setNote("");
                  }}
                  className="btn-primary !px-4 text-xs font-bold"
                >
                  Apply Coins
                </button>
              </div>
            </div>

            {/* XP adjustment */}
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                2. Grant XP
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={xpDelta}
                  onChange={(e) => setXpDelta(Number(e.target.value))}
                  className="input-dark flex-1"
                />
                <button
                  onClick={() => {
                    adminGrantXp(targetUser.id, xpDelta);
                    setNote("");
                  }}
                  className="btn-primary !px-4 text-xs font-bold"
                >
                  Apply XP
                </button>
              </div>
            </div>

            {/* Certificate issue */}
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                3. Issue Verifiable Certificate
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={certSkillId}
                  onChange={(e) => setCertSkillId(e.target.value)}
                  className="input-dark text-xs"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <select
                  value={certTier}
                  onChange={(e) => setCertTier(Number(e.target.value))}
                  className="input-dark text-xs"
                >
                  <option value={5}>Tier 5 (Operator)</option>
                  <option value={8}>Tier 8 (Strategist)</option>
                  <option value={10}>Tier 10 (Sovereign)</option>
                </select>
              </div>
              <button
                onClick={() => {
                  adminIssueCertificate(targetUser.id, certSkillId, certTier);
                  setTarget(null);
                }}
                className="btn-primary w-full py-2 text-xs font-bold"
              >
                Issue Official Certificate
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
