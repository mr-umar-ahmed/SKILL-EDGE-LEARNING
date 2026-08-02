"use client";

import { Award, BadgeCheck, Flame, Hexagon, Search, Settings2, ShieldCheck, Users2, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { EmptyState, Modal, NeuronBadge, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { PlanId } from "@/lib/types";
import { PLANS, cn, fmtDate, fmtNum, planDef } from "@/lib/utils";

export function AdminUsersTab() {
  const { state, adminAdjustNeurons, adminGrantXp, adminGrantPlan, adminIssueCertificate } = useApp();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // action form state
  const [neuronDelta, setNeuronDelta] = useState("");
  const [neuronNote, setNeuronNote] = useState("");
  const [xpAmount, setXpAmount] = useState("");
  const [planChoice, setPlanChoice] = useState<PlanId>("PRO_MONTHLY");
  const [certSkillId, setCertSkillId] = useState<string>(state.catalog[0]?.id ?? "");
  const [certTier, setCertTier] = useState<5 | 10>(10);
  const [flash, setFlash] = useState("");

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...state.users].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!q) return sorted;
    return sorted.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [state.users, query]);

  // derive from live state so neurons/xp/plan update inside the open modal
  const selected = selectedId ? state.users.find((u) => u.id === selectedId) ?? null : null;

  const openUser = (id: string) => {
    setSelectedId(id);
    setNeuronDelta("");
    setNeuronNote("");
    setXpAmount("");
    setPlanChoice("PRO_MONTHLY");
    setCertSkillId(state.catalog[0]?.id ?? "");
    setCertTier(10);
    setFlash("");
  };

  const say = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 2500);
  };

  const applyNeurons = () => {
    if (!selected) return;
    const delta = Math.trunc(Number(neuronDelta));
    if (!delta || Number.isNaN(delta)) return;
    adminAdjustNeurons(selected.id, delta, neuronNote.trim());
    setNeuronDelta("");
    setNeuronNote("");
    say(`${delta > 0 ? "+" : ""}${fmtNum(delta)} Neurons applied.`);
  };

  const applyXp = () => {
    if (!selected) return;
    const amount = Math.trunc(Number(xpAmount));
    if (!amount || Number.isNaN(amount)) return;
    adminGrantXp(selected.id, amount);
    setXpAmount("");
    say(`${amount > 0 ? "+" : ""}${fmtNum(amount)} XP granted.`);
  };

  const applyPlan = () => {
    if (!selected) return;
    adminGrantPlan(selected.id, planChoice);
    say(`${planDef(planChoice).name} plan activated.`);
  };

  const issueCert = () => {
    if (!selected || !certSkillId) return;
    adminIssueCertificate(selected.id, certSkillId, certTier);
    say("Certificate issued.");
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="input-dark pl-10"
        />
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={<Users2 className="h-10 w-10" />}
          title={query ? "No matches" : "No users yet"}
          text={query ? "No users match your search." : "Users appear here the moment they sign up."}
        />
      ) : (
        <div className="clay-card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Neurons</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Streak</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line/60 transition last:border-0 hover:bg-hover/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar user={u} size={32} />
                      <div className="min-w-0">
                        <div className="max-w-[180px] truncate font-semibold text-white">{u.name}</div>
                        <div className="max-w-[180px] truncate text-xs text-zinc-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? (
                      <span className="chip border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] text-warning">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="chip px-2 py-0.5 text-[10px]">Student</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "chip px-2 py-0.5 text-[10px]",
                        u.subscription.plan !== "FREE" && "border-premium/40 bg-premium/10 text-premium"
                      )}
                    >
                      {planDef(u.subscription.plan).name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <NeuronBadge amount={u.neurons} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-300">{fmtNum(u.xp)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-zinc-300">
                      <Flame className="h-3.5 w-3.5 text-warning" /> {u.streakCount}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">{fmtDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openUser(u.id)} className="btn-ghost px-3 py-1.5 text-xs">
                      <Settings2 className="h-3.5 w-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --------------------------- manage modal --------------------------- */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        wide
        title={
          selected && (
            <span className="flex items-center gap-2.5">
              <UserAvatar user={selected} size={32} />
              {selected.name}
            </span>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="chip">
                <Hexagon className="h-3.5 w-3.5 fill-accent/20 text-accent" /> {fmtNum(selected.neurons)} Neurons
              </span>
              <span className="chip">
                <Zap className="h-3.5 w-3.5 text-warning" /> {fmtNum(selected.xp)} XP
              </span>
              <span className="chip">
                <Flame className="h-3.5 w-3.5 text-warning" /> {selected.streakCount}-day streak
              </span>
              <span className="chip border-premium/40 bg-premium/10 text-premium">
                {planDef(selected.subscription.plan).name}
              </span>
            </div>

            {flash && (
              <p className="flex items-center gap-1.5 rounded-xl border border-success/40 bg-success/10 px-3.5 py-2.5 text-xs font-semibold text-success">
                <BadgeCheck className="h-4 w-4" /> {flash}
              </p>
            )}

            {/* adjust neurons */}
            <div className="space-y-2.5 rounded-xl border border-line bg-base/60 p-4">
              <SectionTitle>Adjust Neurons</SectionTitle>
              <div className="grid gap-2.5 sm:grid-cols-[130px_1fr_auto]">
                <input
                  type="number"
                  value={neuronDelta}
                  onChange={(e) => setNeuronDelta(e.target.value)}
                  placeholder="+100 / -50"
                  className="input-dark"
                />
                <input
                  value={neuronNote}
                  onChange={(e) => setNeuronNote(e.target.value)}
                  placeholder="Note (shows in the student's ledger)"
                  className="input-dark"
                />
                <button onClick={applyNeurons} disabled={!Number(neuronDelta)} className="btn-primary px-4 py-2 text-xs">
                  Apply
                </button>
              </div>
            </div>

            {/* grant xp */}
            <div className="space-y-2.5 rounded-xl border border-line bg-base/60 p-4">
              <SectionTitle>Grant XP</SectionTitle>
              <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="XP amount, e.g. 250"
                  className="input-dark"
                />
                <button onClick={applyXp} disabled={!Number(xpAmount)} className="btn-primary px-4 py-2 text-xs">
                  <Zap className="h-3.5 w-3.5" /> Grant
                </button>
              </div>
            </div>

            {/* grant plan */}
            <div className="space-y-2.5 rounded-xl border border-line bg-base/60 p-4">
              <SectionTitle>Grant plan</SectionTitle>
              <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
                <select value={planChoice} onChange={(e) => setPlanChoice(e.target.value as PlanId)} className="input-dark">
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button onClick={applyPlan} className="btn-premium px-4 py-2 text-xs">
                  <Award className="h-3.5 w-3.5" /> Activate
                </button>
              </div>
            </div>

            {/* issue certificate */}
            <div className="space-y-2.5 rounded-xl border border-line bg-base/60 p-4">
              <SectionTitle>Issue certificate</SectionTitle>
              {state.catalog.length === 0 ? (
                <p className="text-xs text-zinc-500">No skills in catalog to certify.</p>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-[1fr_170px_auto]">
                  <select value={certSkillId} onChange={(e) => setCertSkillId(e.target.value)} className="input-dark">
                    {state.catalog.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={certTier}
                    onChange={(e) => setCertTier(Number(e.target.value) === 5 ? 5 : 10)}
                    className="input-dark"
                  >
                    <option value={5}>Phase (Level 5)</option>
                    <option value={10}>Skill Completion (Level 10)</option>
                  </select>
                  <button onClick={issueCert} className="btn-primary px-4 py-2 text-xs">
                    <BadgeCheck className="h-3.5 w-3.5" /> Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
