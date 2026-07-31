"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CERT_TIERS, SKILLS, getLevelById, getSkill, seedState } from "./data";
import type {
  AppNotification,
  AppState,
  Certificate,
  Level,
  LevelOverride,
  Quiz,
  Skill,
  Transaction,
  User,
  UserProgress,
} from "./types";
import { INR_TO_COINS, isYesterdayKey, todayKey, uid, verificationHash } from "./utils";

const STORAGE_KEY = "skilledge-state-v1";

export interface CompleteLevelResult {
  passed: boolean;
  firstPass: boolean;
  coinsEarned: number;
  xpEarned: number;
  certificate: Certificate | null;
}

interface AppApi {
  state: AppState;
  hydrated: boolean;
  skills: Skill[];
  currentUser: User;
  isAdmin: boolean;
  progressFor: (userId: string) => UserProgress;
  myProgress: UserProgress;
  isLevelUnlocked: (skill: Skill, levelNumber: number, userId?: string) => boolean;
  levelWithOverrides: (level: Level) => Level;
  switchUser: (userId: string) => void;
  completeLevel: (levelId: string, score: number) => CompleteLevelResult;
  unlockPremium: (skillId: string) => boolean;
  requestCoinPurchase: (amountInr: number, utrNumber: string, proofImageName?: string) => Transaction;
  adminSetTxnStatus: (txnId: string, status: "APPROVED" | "REJECTED") => void;
  adminAdjustCoins: (userId: string, delta: number, note: string) => void;
  adminGrantXp: (userId: string, amount: number) => void;
  adminCreateQuiz: (quiz: Omit<Quiz, "id" | "isActive" | "winnersDeclared">) => Quiz;
  adminDeclareWinners: (quizId: string) => void;
  adminUpdateLevel: (levelId: string, patch: LevelOverride) => void;
  joinQuiz: (quizId: string) => { ok: boolean; reason?: string };
  submitQuizScore: (quizId: string, score: number) => void;
  markNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppApi | null>(null);

function makeNotification(userId: string, message: string, kind: AppNotification["kind"] = "success"): AppNotification {
  return { id: uid("ntf"), userId, message, kind, createdAt: new Date().toISOString(), read: false };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => seedState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed?.version === 1) setState(parsed);
      }
    } catch {
      // corrupted state — fall back to seeds
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/unavailable — app still works in-memory
    }
  }, [state, hydrated]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? state.users[0],
    [state.users, state.currentUserId]
  );

  const progressFor = useCallback(
    (userId: string): UserProgress => state.progress[userId] ?? { completed: {}, premiumUnlocks: {} },
    [state.progress]
  );

  const myProgress = progressFor(currentUser.id);

  const levelWithOverrides = useCallback(
    (level: Level): Level => {
      const o = state.overrides[level.id];
      return o ? { ...level, ...o } : level;
    },
    [state.overrides]
  );

  const skills = useMemo(() => {
    if (Object.keys(state.overrides).length === 0) return SKILLS;
    return SKILLS.map((s) => ({
      ...s,
      levels: s.levels.map((l) => (state.overrides[l.id] ? { ...l, ...state.overrides[l.id] } : l)),
    }));
  }, [state.overrides]);

  const isLevelUnlocked = useCallback(
    (skill: Skill, levelNumber: number, userId?: string) => {
      const prog = progressFor(userId ?? currentUser.id);
      const level = skill.levels.find((l) => l.levelNumber === levelNumber);
      if (!level) return false;
      if (level.isPremium && !prog.premiumUnlocks[skill.id]) return false;
      if (levelNumber === 1) return true;
      const prev = skill.levels.find((l) => l.levelNumber === levelNumber - 1);
      return !!prev && !!prog.completed[prev.id];
    },
    [currentUser.id, progressFor]
  );

  const switchUser = useCallback((userId: string) => {
    setState((s) => (s.users.some((u) => u.id === userId) ? { ...s, currentUserId: userId } : s));
  }, []);

  const completeLevel = useCallback(
    (levelId: string, score: number): CompleteLevelResult => {
      const found = getLevelById(levelId);
      const empty: CompleteLevelResult = { passed: false, firstPass: false, coinsEarned: 0, xpEarned: 0, certificate: null };
      if (!found) return empty;
      const override = state.overrides[levelId];
      const level = override ? { ...found.level, ...override } : found.level;
      const skill = found.skill;
      const passed = score >= level.minPassScore;
      if (!passed) return { ...empty, passed: false };

      const uidNow = state.currentUserId;
      const prog = state.progress[uidNow] ?? { completed: {}, premiumUnlocks: {} };
      const firstPass = !prog.completed[levelId];
      const nowIso = new Date().toISOString();
      let certificate: Certificate | null = null;

      setState((s) => {
        const p = s.progress[uidNow] ?? { completed: {}, premiumUnlocks: {} };
        const already = p.completed[levelId];
        const completed = {
          ...p.completed,
          [levelId]: { score: Math.max(score, already?.score ?? 0), completedAt: already?.completedAt ?? nowIso },
        };
        const progress = { ...s.progress, [uidNow]: { ...p, completed } };

        let users = s.users;
        let transactions = s.transactions;
        let certificates = s.certificates;
        let notifications = s.notifications;

        if (!already) {
          const today = todayKey();
          users = s.users.map((u) => {
            if (u.id !== uidNow) return u;
            let streak = u.streakCount;
            if (u.lastActiveDay !== today) {
              streak = u.lastActiveDay && isYesterdayKey(u.lastActiveDay) ? streak + 1 : Math.max(1, u.lastActiveDay ? 1 : streak + 1);
            }
            return {
              ...u,
              edgeCoins: u.edgeCoins + level.coinReward,
              xp: u.xp + level.xpReward,
              streakCount: streak,
              lastActiveDay: today,
            };
          });
          transactions = [
            {
              id: uid("txn"),
              userId: uidNow,
              amountCoins: level.coinReward,
              amountInr: null,
              type: "EARNED" as const,
              status: "APPROVED" as const,
              note: `Completed ${skill.title} · Level ${level.levelNumber} — ${level.title}`,
              createdAt: nowIso,
            },
            ...s.transactions,
          ];
          if (CERT_TIERS.includes(level.levelNumber)) {
            const exists = s.certificates.some(
              (c) => c.userId === uidNow && c.skillId === skill.id && c.levelTier === level.levelNumber
            );
            if (!exists) {
              certificate = {
                id: `${skill.id}-t${level.levelNumber}-${uidNow}`,
                userId: uidNow,
                skillId: skill.id,
                levelTier: level.levelNumber,
                verificationCode: verificationHash(`${uidNow}:${skill.id}:${level.levelNumber}:${nowIso}`),
                issuedAt: nowIso,
              };
              certificates = [...s.certificates, certificate];
              notifications = [
                makeNotification(uidNow, `🏆 Certificate earned: ${skill.title} — Tier ${level.levelNumber}!`),
                ...notifications,
              ];
            }
          }
          notifications = [
            makeNotification(uidNow, `+${level.coinReward} ↁ and +${level.xpReward} XP for clearing ${level.title}!`),
            ...notifications,
          ];
        }

        return { ...s, progress, users, transactions, certificates, notifications };
      });

      return {
        passed: true,
        firstPass,
        coinsEarned: firstPass ? level.coinReward : 0,
        xpEarned: firstPass ? level.xpReward : 0,
        certificate,
      };
    },
    [state.currentUserId, state.overrides, state.progress]
  );

  const unlockPremium = useCallback(
    (skillId: string) => {
      const skill = getSkill(skillId);
      if (!skill) return false;
      const user = state.users.find((u) => u.id === state.currentUserId);
      if (!user || user.edgeCoins < skill.premiumCost) return false;
      setState((s) => {
        const p = s.progress[s.currentUserId] ?? { completed: {}, premiumUnlocks: {} };
        if (p.premiumUnlocks[skillId]) return s;
        return {
          ...s,
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, edgeCoins: u.edgeCoins - skill.premiumCost } : u)),
          progress: {
            ...s.progress,
            [s.currentUserId]: { ...p, premiumUnlocks: { ...p.premiumUnlocks, [skillId]: true } },
          },
          transactions: [
            {
              id: uid("txn"),
              userId: s.currentUserId,
              amountCoins: -skill.premiumCost,
              amountInr: null,
              type: "SPENT_COURSE" as const,
              status: "APPROVED" as const,
              note: `Unlocked premium tiers 7-10 · ${skill.title}`,
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ],
          notifications: [
            makeNotification(s.currentUserId, `🔓 Premium tiers unlocked for ${skill.title}. Go claim Sovereign Master!`),
            ...s.notifications,
          ],
        };
      });
      return true;
    },
    [state.users, state.currentUserId]
  );

  const requestCoinPurchase = useCallback(
    (amountInr: number, utrNumber: string, proofImageName?: string) => {
      const txn: Transaction = {
        id: uid("txn"),
        userId: state.currentUserId,
        amountCoins: Math.round(amountInr * INR_TO_COINS),
        amountInr,
        type: "PURCHASED",
        status: "PENDING",
        utrNumber,
        proofImageName,
        note: "EdgeCoin top-up via UPI",
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        transactions: [txn, ...s.transactions],
        notifications: [
          makeNotification(
            s.currentUserId,
            `Payment of ₹${amountInr} submitted for verification. ${txn.amountCoins} ↁ will be credited once approved.`,
            "info"
          ),
          ...s.notifications,
        ],
      }));
      return txn;
    },
    [state.currentUserId]
  );

  const adminSetTxnStatus = useCallback((txnId: string, status: "APPROVED" | "REJECTED") => {
    setState((s) => {
      const txn = s.transactions.find((t) => t.id === txnId);
      if (!txn || txn.status !== "PENDING") return s;
      const transactions = s.transactions.map((t) => (t.id === txnId ? { ...t, status } : t));
      let users = s.users;
      let notifications = s.notifications;
      if (status === "APPROVED") {
        users = s.users.map((u) => (u.id === txn.userId ? { ...u, edgeCoins: u.edgeCoins + txn.amountCoins } : u));
        notifications = [
          makeNotification(txn.userId, `✅ Payment approved! ${txn.amountCoins} ↁ credited to your wallet.`),
          ...notifications,
        ];
      } else {
        notifications = [
          makeNotification(txn.userId, `❌ Payment (UTR ${txn.utrNumber ?? "—"}) was rejected. Contact support if this is a mistake.`, "warning"),
          ...notifications,
        ];
      }
      return { ...s, transactions, users, notifications };
    });
  }, []);

  const adminAdjustCoins = useCallback((userId: string, delta: number, note: string) => {
    if (!delta) return;
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === userId ? { ...u, edgeCoins: Math.max(0, u.edgeCoins + delta) } : u)),
      transactions: [
        {
          id: uid("txn"),
          userId,
          amountCoins: delta,
          amountInr: null,
          type: "ADMIN_GRANT" as const,
          status: "APPROVED" as const,
          note: note || (delta > 0 ? "Admin coin grant" : "Admin coin revoke"),
          createdAt: new Date().toISOString(),
        },
        ...s.transactions,
      ],
      notifications: [
        makeNotification(
          userId,
          delta > 0 ? `🎁 Admin granted you ${delta} ↁ!` : `⚠️ Admin adjusted your wallet by ${delta} ↁ.`,
          delta > 0 ? "success" : "warning"
        ),
        ...s.notifications,
      ],
    }));
  }, []);

  const adminGrantXp = useCallback((userId: string, amount: number) => {
    if (!amount) return;
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === userId ? { ...u, xp: Math.max(0, u.xp + amount) } : u)),
      notifications: [makeNotification(userId, `⭐ Admin boosted you +${amount} XP!`), ...s.notifications],
    }));
  }, []);

  const adminCreateQuiz = useCallback((quiz: Omit<Quiz, "id" | "isActive" | "winnersDeclared">) => {
    const created: Quiz = { ...quiz, id: uid("quiz"), isActive: true, winnersDeclared: false };
    setState((s) => ({ ...s, quizzes: [created, ...s.quizzes] }));
    return created;
  }, []);

  const adminDeclareWinners = useCallback((quizId: string) => {
    setState((s) => {
      const quiz = s.quizzes.find((q) => q.id === quizId);
      if (!quiz || quiz.winnersDeclared) return s;
      const entries = s.quizEntries
        .filter((e) => e.quizId === quizId && e.score !== null)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      const splits = [0.5, 0.3, 0.2];
      let users = s.users;
      let transactions = s.transactions;
      let notifications = s.notifications;
      const updatedEntries = s.quizEntries.map((e) => {
        const idx = entries.indexOf(e);
        if (e.quizId !== quizId || idx === -1) return e;
        const prize = idx < 3 ? Math.round(quiz.prizePoolCoins * splits[idx]) : 0;
        if (prize > 0) {
          users = users.map((u) => (u.id === e.userId ? { ...u, edgeCoins: u.edgeCoins + prize } : u));
          transactions = [
            {
              id: uid("txn"),
              userId: e.userId,
              amountCoins: prize,
              amountInr: null,
              type: "PRIZE" as const,
              status: "APPROVED" as const,
              note: `🏆 Rank #${idx + 1} in ${quiz.title}`,
              createdAt: new Date().toISOString(),
            },
            ...transactions,
          ];
          notifications = [
            makeNotification(e.userId, `🏆 You ranked #${idx + 1} in ${quiz.title} and won ${prize} ↁ!`),
            ...notifications,
          ];
        }
        return { ...e, rank: idx + 1, prizeWonCoins: prize };
      });
      return {
        ...s,
        users,
        transactions,
        notifications,
        quizEntries: updatedEntries,
        quizzes: s.quizzes.map((q) => (q.id === quizId ? { ...q, winnersDeclared: true, isActive: false } : q)),
      };
    });
  }, []);

  const adminUpdateLevel = useCallback((levelId: string, patch: LevelOverride) => {
    setState((s) => ({
      ...s,
      overrides: { ...s.overrides, [levelId]: { ...s.overrides[levelId], ...patch } },
    }));
  }, []);

  const joinQuiz = useCallback(
    (quizId: string): { ok: boolean; reason?: string } => {
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (!quiz) return { ok: false, reason: "Quiz not found." };
      if (state.quizEntries.some((e) => e.quizId === quizId && e.userId === state.currentUserId))
        return { ok: false, reason: "Already joined." };
      const user = state.users.find((u) => u.id === state.currentUserId)!;
      if (quiz.entryFeeCoins > user.edgeCoins)
        return { ok: false, reason: `Not enough EdgeCoins — entry costs ${quiz.entryFeeCoins} ↁ.` };
      setState((s) => {
        let users = s.users;
        let transactions = s.transactions;
        if (quiz.entryFeeCoins > 0) {
          users = s.users.map((u) =>
            u.id === s.currentUserId ? { ...u, edgeCoins: u.edgeCoins - quiz.entryFeeCoins } : u
          );
          transactions = [
            {
              id: uid("txn"),
              userId: s.currentUserId,
              amountCoins: -quiz.entryFeeCoins,
              amountInr: null,
              type: "SPENT_QUIZ" as const,
              status: "APPROVED" as const,
              note: `Entry fee · ${quiz.title}`,
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ];
        }
        return {
          ...s,
          users,
          transactions,
          quizEntries: [
            ...s.quizEntries,
            { quizId, userId: s.currentUserId, joinedAt: new Date().toISOString(), score: null },
          ],
        };
      });
      return { ok: true };
    },
    [state.quizzes, state.quizEntries, state.users, state.currentUserId]
  );

  const submitQuizScore = useCallback((quizId: string, score: number) => {
    setState((s) => ({
      ...s,
      quizEntries: s.quizEntries.map((e) =>
        e.quizId === quizId && e.userId === s.currentUserId ? { ...e, score: Math.max(score, e.score ?? 0) } : e
      ),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.userId === s.currentUserId ? { ...n, read: true } : n)),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(seedState());
  }, []);

  const api: AppApi = {
    state,
    hydrated,
    skills,
    currentUser,
    isAdmin: currentUser.role === "ADMIN",
    progressFor,
    myProgress,
    isLevelUnlocked,
    levelWithOverrides,
    switchUser,
    completeLevel,
    unlockPremium,
    requestCoinPurchase,
    adminSetTxnStatus,
    adminAdjustCoins,
    adminGrantXp,
    adminCreateQuiz,
    adminDeclareWinners,
    adminUpdateLevel,
    joinQuiz,
    submitQuizScore,
    markNotificationsRead,
    resetDemoData,
  };

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
