"use client";

import {
  BadgeCheck,
  BookOpenCheck,
  Coins,
  Crown,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShieldX,
  Swords,
  Users2,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Modal, SectionTitle, StatCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn, fmtDateTime, fmtNum, levelForXp, timeAgo } from "@/lib/utils";
import type { Level, Skill } from "@/lib/types";

type Tab = "users" | "payments" | "tournaments" | "curriculum";

export default function AdminPage() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>("users");

  if (!app.isAdmin) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <ShieldX className="mx-auto h-12 w-12 text-rose-400" />
          <h1 className="mt-4 font-mono text-xl font-bold text-zinc-100">Admins only</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Switch to the <span className="font-semibold text-amber-300">Admin</span> session from the profile menu in
            the top-right corner to open the command center.
          </p>
        </div>
      </AppShell>
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "users", label: "Users", icon: <Users2 className="h-4 w-4" /> },
    { id: "payments", label: "Payments", icon: <Coins className="h-4 w-4" /> },
    { id: "tournaments", label: "Tournaments", icon: <Swords className="h-4 w-4" /> },
    { id: "curriculum", label: "Curriculum", icon: <BookOpenCheck className="h-4 w-4" /> },
  ];

  const pendingCount = app.state.transactions.filter((t) => t.status === "PENDING").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="flex items-center gap-2 font-mono text-2xl font-bold text-zinc-50">
            <ShieldCheck className="h-6 w-6 text-amber-400" /> Admin Command Center
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Users, payments, tournaments and curriculum — full control.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total users" value={app.state.users.length} accent="#06b6d4" icon={<Users2 className="h-4 w-4" />} />
          <StatCard label="Pending payments" value={pendingCount} accent="#f59e0b" icon={<Coins className="h-4 w-4" />} />
          <StatCard label="Tournaments" value={app.state.quizzes.length} accent="#8b5cf6" icon={<Swords className="h-4 w-4" />} />
          <StatCard label="Certificates issued" value={app.state.certificates.length} accent="#10b981" icon={<BadgeCheck className="h-4 w-4" />} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                tab === t.id
                  ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
              )}
            >
              {t.icon} {t.label}
              {t.id === "payments" && pendingCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 font-mono text-[10px] font-bold text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "users" && <UsersTab />}
        {tab === "payments" && <PaymentsTab />}
        {tab === "tournaments" && <TournamentsTab />}
        {tab === "curriculum" && <CurriculumTab />}
      </div>
    </AppShell>
  );
}

/* --------------------------------- users tab -------------------------------- */

function UsersTab() {
  const { state, adminAdjustCoins, adminGrantXp } = useApp();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [coinDelta, setCoinDelta] = useState(50);
  const [xpDelta, setXpDelta] = useState(100);
  const [note, setNote] = useState("");

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
              <div className="truncate text-sm font-semibold text-zinc-100">{u.name}</div>
              <div className="truncate text-xs text-zinc-500">{u.email}</div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="chip border-yellow-400/30 text-yellow-300">ↁ{fmtNum(u.edgeCoins)}</span>
              <span className="chip border-violet-400/30 text-violet-300">LVL {levelForXp(u.xp)}</span>
              <span className="chip border-orange-400/30 text-orange-300">🔥 {u.streakCount}</span>
            </div>
            <button onClick={() => setTarget(u.id)} className="btn-ghost !px-3 !py-1.5 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Manage
            </button>
          </div>
        ))}
        {users.length === 0 && <div className="p-8 text-center text-sm text-zinc-500">No users match that search.</div>}
      </div>

      <Modal open={!!targetUser} onClose={() => setTarget(null)} title={`Manage ${targetUser?.name ?? ""}`}>
        {targetUser && (
          <div className="space-y-5">
            <div className="glass flex items-center justify-between p-3 text-sm">
              <span className="text-zinc-400">Current wallet</span>
              <span className="font-mono font-bold text-yellow-300">ↁ{fmtNum(targetUser.edgeCoins)}</span>
            </div>
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                Grant / revoke EdgeCoins
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
                    adminAdjustCoins(targetUser.id, Math.abs(coinDelta), note);
                    setTarget(null);
                  }}
                  className="btn-primary !px-4"
                >
                  Grant
                </button>
                <button
                  onClick={() => {
                    adminAdjustCoins(targetUser.id, -Math.abs(coinDelta), note);
                    setTarget(null);
                  }}
                  className="btn-ghost !px-4 text-rose-300"
                >
                  Revoke
                </button>
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-dark mt-2"
                placeholder="Reason (shows in user's ledger)"
              />
            </div>
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                Promote level (grant XP)
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
                    adminGrantXp(targetUser.id, Math.abs(xpDelta));
                    setTarget(null);
                  }}
                  className="btn-primary !px-4"
                >
                  <Zap className="h-4 w-4" /> Boost XP
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ------------------------------- payments tab ------------------------------- */

function PaymentsTab() {
  const { state, adminSetTxnStatus } = useApp();
  const purchases = state.transactions.filter((t) => t.type === "PURCHASED");
  const pending = purchases.filter((t) => t.status === "PENDING");
  const history = purchases.filter((t) => t.status !== "PENDING");
  const userOf = (id: string) => state.users.find((u) => u.id === id);

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Pending verification ({pending.length})</SectionTitle>
        {pending.length === 0 && (
          <div className="glass p-8 text-center text-sm text-zinc-500">Queue clear — no payments waiting. 🎉</div>
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
                    <div className="text-[11px] text-zinc-500">{timeAgo(t.createdAt)}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="chip font-mono">UTR {t.utrNumber ?? "—"}</span>
                  <span className="chip">{t.proofImageName ? `📎 ${t.proofImageName}` : "No screenshot attached"}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => adminSetTxnStatus(t.id, "APPROVED")} className="btn-primary flex-1 !py-2 text-sm">
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
        <SectionTitle>History</SectionTitle>
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

/* ------------------------------ tournaments tab ----------------------------- */

function TournamentsTab() {
  const { state, skills, adminCreateQuiz, adminDeclareWinners } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [skillId, setSkillId] = useState(skills[0].id);
  const [entryFee, setEntryFee] = useState(0);
  const [prizePool, setPrizePool] = useState(300);
  const [startsInHours, setStartsInHours] = useState(24);
  const [duration, setDuration] = useState(30);

  const create = () => {
    const skill = skills.find((s) => s.id === skillId)!;
    const bank = skill.levels.flatMap((l) => l.questions);
    const seen = new Set<string>();
    const questions = bank.filter((q) => !seen.has(q.prompt) && seen.add(q.prompt) !== undefined).slice(0, 6);
    adminCreateQuiz({
      title: title.trim() || `${skill.title} Weekly Showdown`,
      category: skill.category,
      entryFeeCoins: Math.max(0, entryFee),
      prizePoolCoins: Math.max(0, prizePool),
      startTime: new Date(Date.now() + startsInHours * 3600000).toISOString(),
      durationMins: duration,
      secondsPerQuestion: 15,
      questions,
    });
    setCreateOpen(false);
    setTitle("");
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button onClick={() => setCreateOpen(true)} className="btn-primary !py-2 text-sm">
          <Plus className="h-4 w-4" /> Create tournament
        </button>
      </div>
      <div className="space-y-3">
        {state.quizzes.map((q) => {
          const entries = state.quizEntries.filter((e) => e.quizId === q.id);
          const scored = entries.filter((e) => e.score !== null);
          return (
            <div key={q.id} className="glass p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm font-bold text-zinc-100">{q.title}</div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span>{fmtDateTime(q.startTime)}</span>
                    <span className="font-mono text-yellow-300">Prize ↁ{fmtNum(q.prizePoolCoins)}</span>
                    <span className="font-mono">{q.entryFeeCoins > 0 ? `Entry ↁ${q.entryFeeCoins}` : "Free"}</span>
                    <span>{entries.length} joined · {scored.length} scored</span>
                  </div>
                </div>
                {q.winnersDeclared ? (
                  <span className="chip border-emerald-400/30 text-emerald-300">
                    <Crown className="h-3 w-3" /> Winners paid
                  </span>
                ) : (
                  <button
                    onClick={() => adminDeclareWinners(q.id)}
                    disabled={scored.length === 0}
                    className="btn-gold !px-4 !py-2 text-xs"
                  >
                    <Crown className="h-3.5 w-3.5" /> Declare winners & pay out
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="🏟️ Create Weekly Tournament">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" placeholder="Tournament title" />
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Skill category (question source)</label>
            <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="input-dark">
              {skills.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900">
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Entry fee (ↁ, 0 = free)</label>
              <input type="number" min={0} value={entryFee} onChange={(e) => setEntryFee(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Prize pool (ↁ)</label>
              <input type="number" min={0} value={prizePool} onChange={(e) => setPrizePool(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Starts in (hours)</label>
              <input type="number" min={0} value={startsInHours} onChange={(e) => setStartsInHours(Number(e.target.value))} className="input-dark" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Duration (mins)</label>
              <input type="number" min={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="input-dark" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-500">
            6 questions are auto-drafted from the selected skill&apos;s question bank · 15s per question · prize split
            50/30/20 to the top 3.
          </div>
          <button onClick={create} className="btn-primary w-full">
            <Swords className="h-4 w-4" /> Launch tournament
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------ curriculum tab ------------------------------ */

function CurriculumTab() {
  const { skills, adminUpdateLevel } = useApp();
  const [skillId, setSkillId] = useState(skills[0].id);
  const [editing, setEditing] = useState<Level | null>(null);
  const [form, setForm] = useState({ title: "", youtubeVideoId: "", minPassScore: 80, coinReward: 15 });

  const skill: Skill = useMemo(() => skills.find((s) => s.id === skillId) ?? skills[0], [skills, skillId]);

  const openEdit = (l: Level) => {
    setEditing(l);
    setForm({ title: l.title, youtubeVideoId: l.youtubeVideoId, minPassScore: l.minPassScore, coinReward: l.coinReward });
  };

  const save = () => {
    if (!editing) return;
    adminUpdateLevel(editing.id, {
      title: form.title.trim() || editing.title,
      youtubeVideoId: form.youtubeVideoId.trim() || editing.youtubeVideoId,
      minPassScore: Math.min(100, Math.max(1, form.minPassScore)),
      coinReward: Math.max(0, form.coinReward),
    });
    setEditing(null);
  };

  return (
    <div>
      <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="input-dark mb-3">
        {skills.map((s) => (
          <option key={s.id} value={s.id} className="bg-zinc-900">
            {s.title}
          </option>
        ))}
      </select>
      <div className="glass divide-y divide-white/[0.05]">
        {skill.levels.map((l) => (
          <div key={l.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-8 text-center font-mono text-sm font-bold" style={{ color: skill.color }}>
              L{l.levelNumber}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-200">{l.title}</div>
              <div className="font-mono text-[11px] text-zinc-500">
                🎬 {l.youtubeVideoId} · pass ≥{l.minPassScore}% · +ↁ{l.coinReward}
              </div>
            </div>
            <button onClick={() => openEdit(l)} className="btn-ghost !px-3 !py-1.5 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit L${editing?.levelNumber} · ${skill.title}`}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Level title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">YouTube video ID</label>
            <input
              value={form.youtubeVideoId}
              onChange={(e) => setForm({ ...form, youtubeVideoId: e.target.value })}
              className="input-dark font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Pass mark (%)</label>
              <input
                type="number"
                value={form.minPassScore}
                onChange={(e) => setForm({ ...form, minPassScore: Number(e.target.value) })}
                className="input-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Coin reward (ↁ)</label>
              <input
                type="number"
                value={form.coinReward}
                onChange={(e) => setForm({ ...form, coinReward: Number(e.target.value) })}
                className="input-dark"
              />
            </div>
          </div>
          <button onClick={save} className="btn-primary w-full">
            Save changes
          </button>
        </div>
      </Modal>
    </div>
  );
}
