"use client";

import {
  Award,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  Coins,
  Crown,
  Download,
  FileJson,
  HelpCircle,
  Megaphone,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldX,
  Swords,
  Trash2,
  Upload,
  Users2,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Modal, SectionTitle, StatCard } from "@/components/ui";
import { playClickSound, playVictorySound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { cn, fmtDateTime, fmtNum, levelForXp, timeAgo } from "@/lib/utils";
import type { Level, Question, Skill } from "@/lib/types";

type Tab = "users" | "payments" | "tournaments" | "curriculum" | "announcements" | "audit" | "system";

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
                "neo-button flex shrink-0 items-center gap-2 px-3.5 py-2 text-xs font-semibold transition",
                tab === t.id
                  ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                  : "text-zinc-400 hover:text-white"
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

        {tab === "users" && <UsersTab />}
        {tab === "payments" && <PaymentsTab />}
        {tab === "tournaments" && <TournamentsTab />}
        {tab === "curriculum" && <CurriculumTab />}
        {tab === "announcements" && <AnnouncementsTab />}
        {tab === "audit" && <AuditTab />}
        {tab === "system" && <SystemTab />}
      </div>
    </AppShell>
  );
}

/* --------------------------------- users tab -------------------------------- */

function UsersTab() {
  const { state, skills, adminAdjustCoins, adminGrantXp, adminIssueCertificate } = useApp();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [coinDelta, setCoinDelta] = useState(50);
  const [xpDelta, setXpDelta] = useState(100);
  const [note, setNote] = useState("");
  const [certSkillId, setCertSkillId] = useState(skills[0].id);
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
                    adminAdjustCoins(targetUser.id, Math.abs(coinDelta), note);
                    setTarget(null);
                  }}
                  className="btn-primary !px-4"
                >
                  Grant Coins
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

            {/* XP Boost */}
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                2. Promote Level (Grant XP)
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

            {/* Certificate Issuance */}
            <div className="border-t border-white/10 pt-4">
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" /> 3. Manually Issue Certificate
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={certSkillId}
                  onChange={(e) => setCertSkillId(e.target.value)}
                  className="input-dark text-xs"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900">
                      {s.title}
                    </option>
                  ))}
                </select>
                <select
                  value={certTier}
                  onChange={(e) => setCertTier(Number(e.target.value))}
                  className="input-dark text-xs font-mono"
                >
                  <option value={5} className="bg-zinc-900">Tier 5 (Operator)</option>
                  <option value={8} className="bg-zinc-900">Tier 8 (Strategist)</option>
                  <option value={10} className="bg-zinc-900">Tier 10 (Master)</option>
                </select>
              </div>
              <button
                onClick={() => {
                  adminIssueCertificate(targetUser.id, certSkillId, certTier);
                  playVictorySound();
                  setTarget(null);
                }}
                className="btn-gold w-full text-xs"
              >
                <Award className="h-4 w-4" /> Mint & Issue Verified Certificate
              </button>
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
          <Plus className="h-4 w-4" /> Create Tournament
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
          <button onClick={create} className="btn-primary w-full">
            <Swords className="h-4 w-4" /> Launch tournament
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------ curriculum & questions tab ------------------------------ */

function CurriculumTab() {
  const { skills, adminUpdateLevel } = useApp();
  const [skillId, setSkillId] = useState(skills[0].id);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [form, setForm] = useState({ title: "", youtubeVideoId: "", minPassScore: 80, coinReward: 15 });

  // Question Editor state
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editingQIndex, setEditingQIndex] = useState<number | null>(null);
  const [qPrompt, setQPrompt] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qAnswerIndex, setQAnswerIndex] = useState<number>(0);

  const skill: Skill = useMemo(() => skills.find((s) => s.id === skillId) ?? skills[0], [skills, skillId]);

  const openEdit = (l: Level) => {
    setEditingLevel(l);
    setForm({ title: l.title, youtubeVideoId: l.youtubeVideoId, minPassScore: l.minPassScore, coinReward: l.coinReward });
  };

  const saveLevel = () => {
    if (!editingLevel) return;
    adminUpdateLevel(editingLevel.id, {
      title: form.title.trim() || editingLevel.title,
      youtubeVideoId: form.youtubeVideoId.trim() || editingLevel.youtubeVideoId,
      minPassScore: Math.min(100, Math.max(1, form.minPassScore)),
      coinReward: Math.max(0, form.coinReward),
    });
    setEditingLevel(null);
  };

  const openAddQuestion = () => {
    setEditingQIndex(null);
    setQPrompt("");
    setQOptions(["Option A", "Option B", "Option C", "Option D"]);
    setQAnswerIndex(0);
    setQModalOpen(true);
  };

  const openEditQuestion = (index: number) => {
    if (!editingLevel) return;
    const q = editingLevel.questions[index];
    setEditingQIndex(index);
    setQPrompt(q.prompt);
    setQOptions([...q.options]);
    setQAnswerIndex(q.answerIndex);
    setQModalOpen(true);
  };

  const saveQuestion = () => {
    if (!editingLevel) return;
    const newQ: Question = {
      id: editingQIndex !== null ? editingLevel.questions[editingQIndex].id : `q-${Date.now()}`,
      prompt: qPrompt.trim() || "New Question Prompt",
      options: qOptions.map((o, idx) => o.trim() || `Option ${String.fromCharCode(65 + idx)}`),
      answerIndex: qAnswerIndex,
    };

    let updatedQuestions = [...editingLevel.questions];
    if (editingQIndex !== null) {
      updatedQuestions[editingQIndex] = newQ;
    } else {
      updatedQuestions.push(newQ);
    }

    adminUpdateLevel(editingLevel.id, { questions: updatedQuestions });
    setEditingLevel({ ...editingLevel, questions: updatedQuestions });
    setQModalOpen(false);
  };

  const deleteQuestion = (index: number) => {
    if (!editingLevel) return;
    const updatedQuestions = editingLevel.questions.filter((_, i) => i !== index);
    adminUpdateLevel(editingLevel.id, { questions: updatedQuestions });
    setEditingLevel({ ...editingLevel, questions: updatedQuestions });
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
          <div key={l.id} className="flex items-center gap-3 px-4 py-3">
            <span className="w-8 text-center font-mono text-sm font-bold" style={{ color: skill.color }}>
              L{l.levelNumber}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-200">{l.title}</div>
              <div className="font-mono text-[11px] text-zinc-500">
                🎬 {l.youtubeVideoId} · pass ≥{l.minPassScore}% · +ↁ{l.coinReward} · {l.questions.length} questions
              </div>
            </div>
            <button onClick={() => openEdit(l)} className="btn-ghost !px-3 !py-1.5 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Edit Level & Questions
            </button>
          </div>
        ))}
      </div>

      {/* Level & Question Editor Modal */}
      <Modal open={!!editingLevel} onClose={() => setEditingLevel(null)} title={`Edit L${editingLevel?.levelNumber} · ${skill.title}`}>
        {editingLevel && (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-3 border-b border-white/10 pb-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                Level Configuration
              </h4>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Level title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">YouTube Video ID</label>
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
              <button onClick={saveLevel} className="btn-primary w-full">
                Save Level Config
              </button>
            </div>

            {/* Question Bank Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> Question Bank ({editingLevel.questions.length})
                </h4>
                <button onClick={openAddQuestion} className="btn-ghost !px-2.5 !py-1 text-xs text-cyan-300">
                  <Plus className="h-3.5 w-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-2">
                {editingLevel.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-zinc-200">
                        {qIdx + 1}. {q.prompt}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditQuestion(qIdx)} className="text-cyan-400 hover:text-cyan-300 p-1">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deleteQuestion(qIdx)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                      {q.options.map((opt, optIdx) => (
                        <span
                          key={optIdx}
                          className={cn(
                            "rounded px-2 py-1",
                            optIdx === q.answerIndex
                              ? "bg-emerald-500/20 font-bold text-emerald-300"
                              : "bg-white/[0.03] text-zinc-400"
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Single Question Editor Sub-modal */}
      <Modal open={qModalOpen} onClose={() => setQModalOpen(false)} title={editingQIndex !== null ? "Edit Question" : "Add New Question"}>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Question Prompt</label>
            <textarea
              rows={2}
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              className="input-dark"
              placeholder="e.g. What is temperature parameter in LLM generation?"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Options (A, B, C, D)</label>
            <div className="space-y-2">
              {qOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400">{String.fromCharCode(65 + idx)}.</span>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const copy = [...qOptions];
                      copy[idx] = e.target.value;
                      setQOptions(copy);
                    }}
                    className="input-dark flex-1"
                  />
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={qAnswerIndex === idx}
                    onChange={() => setQAnswerIndex(idx)}
                    className="h-4 w-4 accent-emerald-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 font-mono text-[10px] text-zinc-500 text-right">Select radio for correct answer</div>
          </div>
          <button onClick={saveQuestion} className="btn-primary w-full">
            Save Question
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------ announcements tab ------------------------------ */

function AnnouncementsTab() {
  const { state, adminBroadcastNotification } = useApp();
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState<string>("ALL");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = () => {
    if (!message.trim()) return;
    adminBroadcastNotification(
      message.trim(),
      targetUserId === "ALL" ? undefined : targetUserId
    );
    playVictorySound();
    setMessage("");
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Bell className="h-5 w-5 text-cyan-400" /> Broadcast System Announcement
        </h3>
        <p className="text-xs text-zinc-400">
          Dispatch instant notifications to all active students or target a specific user.
        </p>

        {sentSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-300">
            ✓ Broadcast notification dispatched successfully!
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-zinc-400">Target Recipient</label>
          <select
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="input-dark"
          >
            <option value="ALL" className="bg-zinc-900">🌐 All Students & Admins (Broadcast)</option>
            {state.users.map((u) => (
              <option key={u.id} value={u.id} className="bg-zinc-900">
                👤 {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-400">Announcement Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-dark"
            placeholder="e.g. 🎉 Double XP Weekend is now active! Complete any assessment for 2x XP."
          />
        </div>

        <button onClick={handleBroadcast} className="btn-primary w-full">
          <Megaphone className="h-4 w-4" /> Send Announcement Notification
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ audit tab ------------------------------ */

function AuditTab() {
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

/* ------------------------------ system backup & reset tab ------------------------------ */

function SystemTab() {
  const { state, importDatabase, resetDemoData } = useApp();
  const [jsonText, setJsonText] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skilledge-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playVictorySound();
  };

  const handleImport = () => {
    if (!jsonText.trim()) return;
    const res = importDatabase(jsonText.trim());
    if (res.ok) {
      playVictorySound();
      setImportStatus({ ok: true, msg: "Database state restored successfully!" });
      setJsonText("");
    } else {
      setImportStatus({ ok: false, msg: res.reason || "Failed to parse JSON backup." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Download className="h-5 w-5 text-cyan-400" /> Export Database Backup
        </h3>
        <p className="text-xs text-zinc-400">
          Download a complete JSON snapshot of all users, level overrides, transactions, quizzes, and certificates.
        </p>
        <button onClick={handleExport} className="btn-primary w-full">
          <Download className="h-4 w-4" /> Download JSON Backup
        </button>
      </div>

      {/* Import */}
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Upload className="h-5 w-5 text-amber-400" /> Restore Database Backup
        </h3>
        <p className="text-xs text-zinc-400">
          Paste a valid Skill Edge OS JSON backup payload below to restore state.
        </p>

        {importStatus && (
          <div
            className={cn(
              "rounded-xl border p-3 font-mono text-xs font-bold",
              importStatus.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            )}
          >
            {importStatus.msg}
          </div>
        )}

        <textarea
          rows={4}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="input-dark font-mono text-xs"
          placeholder='{"version": 1, "users": [...]}'
        />
        <button onClick={handleImport} className="btn-gold w-full">
          <Upload className="h-4 w-4" /> Restore JSON Database
        </button>
      </div>

      {/* Factory Reset */}
      <div className="glass border-rose-500/30 p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-rose-400">
          <RefreshCw className="h-5 w-5 text-rose-400" /> Factory Reset Seed Data
        </h3>
        <p className="text-xs text-zinc-400">
          Wipe all local storage mutations and reset the platform back to pristine seed data.
        </p>
        <button onClick={() => setResetConfirmOpen(true)} className="btn-ghost w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
          Factory Reset State
        </button>
      </div>

      <Modal open={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} title="⚠️ Confirm Factory Reset">
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-300">
            Are you sure you want to reset all mock store data back to default seeds? This action will clear custom updates.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setResetConfirmOpen(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setResetConfirmOpen(false);
              }}
              className="btn-primary flex-1 !bg-rose-600 hover:!bg-rose-500"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
