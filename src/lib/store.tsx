"use client";

import { useUser } from "@clerk/nextjs";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BADGES, CERT_TIERS, SKILLS, findMission, findSkill, seedState } from "./data";
import type {
  Announcement,
  AppNotification,
  AppState,
  Certificate,
  Coupon,
  FamilyChildProfile,
  Mission,
  PaymentMethod,
  PaymentRecord,
  PlanId,
  PortfolioItem,
  Quiz,
  Skill,
  Submission,
  SubmissionFile,
  SubmissionKind,
  SubmissionLink,
  SubmissionStatus,
  Subscription,
  Transaction,
  User,
  UserProgress,
  V1AppState,
} from "./types";
import {
  INR_TO_NEURONS,
  adminEmails,
  isPaidPlan,
  isYesterdayKey,
  todayKey,
  uid,
  verificationHash,
} from "./utils";

const STORAGE_KEY_V2 = "skilledge-state-v2";
const STORAGE_KEY_V1 = "skilledge-state-v1";

/* ------------------------------ migration v1 → v2 ------------------------------ */

const V1_DEMO_IDS = new Set(["u-student", "u-admin", "u-zara", "u-kabir", "u-ishita"]);

function migrateV1(v1: V1AppState): AppState {
  const keptUsers = v1.users.filter((u) => !V1_DEMO_IDS.has(u.id));
  const keptIds = new Set(keptUsers.map((u) => u.id));
  const users: User[] = keptUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    title: u.title,
    avatarFrame: u.avatarFrame,
    bio: "",
    neurons: u.edgeCoins,
    xp: u.xp,
    streakCount: u.streakCount,
    lastActiveDay: u.lastActiveDay,
    subscription: { plan: "FREE", status: "ACTIVE", startedAt: u.createdAt, expiresAt: null },
    badges: [],
    createdAt: u.createdAt,
  }));

  const fresh = seedState();
  return {
    ...fresh,
    currentUserId: keptIds.has(v1.currentUserId) ? v1.currentUserId : "",
    users,
    progress: Object.fromEntries(Object.entries(v1.progress).filter(([userId]) => keptIds.has(userId))),
    transactions: v1.transactions
      .filter((t) => keptIds.has(t.userId))
      .map((t) => ({
        id: t.id,
        userId: t.userId,
        amountNeurons: t.amountCoins,
        amountInr: t.amountInr,
        type: t.type,
        status: t.status,
        utrNumber: t.utrNumber,
        proofImageName: t.proofImageName,
        note: t.note,
        createdAt: t.createdAt,
      })),
    quizzes: v1.quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      category: q.category,
      entryFeeNeurons: q.entryFeeCoins,
      prizePoolNeurons: q.prizePoolCoins,
      startTime: q.startTime,
      durationMins: q.durationMins,
      secondsPerQuestion: q.secondsPerQuestion,
      questions: q.questions,
      isActive: q.isActive,
      winnersDeclared: q.winnersDeclared,
    })),
    quizEntries: v1.quizEntries
      .filter((e) => keptIds.has(e.userId))
      .map((e) => ({
        quizId: e.quizId,
        userId: e.userId,
        joinedAt: e.joinedAt,
        score: e.score,
        rank: e.rank,
        prizeWonNeurons: e.prizeWonCoins,
      })),
    certificates: v1.certificates.filter((c) => keptIds.has(c.userId)),
    notifications: v1.notifications.filter((n) => keptIds.has(n.userId)),
  };
}

function loadInitialState(): AppState {
  return seedState();
}

/* --------------------------------- helpers --------------------------------- */

function makeNotification(userId: string, message: string, kind: AppNotification["kind"] = "success"): AppNotification {
  return { id: uid("ntf"), userId, message, kind, createdAt: new Date().toISOString(), read: false };
}

function subscriptionFor(planId: PlanId, prev?: Subscription): Subscription {
  const now = new Date();
  const expires =
    planId === "PRO_MONTHLY"
      ? new Date(now.getTime() + 30 * 86400000).toISOString()
      : planId === "PRO_YEARLY"
        ? new Date(now.getTime() + 365 * 86400000).toISOString()
        : null;
  return {
    plan: planId,
    status: "ACTIVE",
    startedAt: prev?.plan === planId ? prev.startedAt : now.toISOString(),
    expiresAt: expires,
  };
}

/** apply daily streak bump to a user (mutably-safe copy) */
function withStreak(u: User): User {
  const today = todayKey();
  if (u.lastActiveDay === today) return u;
  const streak = u.lastActiveDay && isYesterdayKey(u.lastActiveDay) ? u.streakCount + 1 : 1;
  return { ...u, streakCount: streak, lastActiveDay: today };
}

function grantBadges(u: User, approvedCount: number, extra: string[] = []): { user: User; earned: string[] } {
  const want = new Set(u.badges);
  const earned: string[] = [];
  const tryAdd = (id: string) => {
    if (!want.has(id)) {
      want.add(id);
      earned.push(id);
    }
  };
  if (approvedCount >= 1) tryAdd("first-mission");
  if (approvedCount >= 5) tryAdd("projects-5");
  if (approvedCount >= 20) tryAdd("projects-20");
  if (u.streakCount >= 7) tryAdd("streak-7");
  if (u.streakCount >= 30) tryAdd("streak-30");
  extra.forEach(tryAdd);
  if (earned.length === 0) return { user: u, earned };
  return { user: { ...u, badges: Array.from(want) }, earned };
}

export interface UnlockInfo {
  unlocked: boolean;
  reason?: "ADMIN_LOCKED" | "LOCKED_PREV" | "NEEDS_PRO";
}

export interface SubmitPayload {
  note: string;
  links: SubmissionLink[];
  files: SubmissionFile[];
  reflections: { question: string; answer: string }[];
  resubmissionOf?: string;
}

export interface ReviewResult {
  approved: boolean;
  neuronsEarned: number;
  xpEarned: number;
  badgesEarned: string[];
  certificate: Certificate | null;
}

interface AppApi {
  state: AppState;
  hydrated: boolean;
  /** published skills for students; admin sees all via state.catalog */
  catalog: Skill[];
  skills: Skill[];
  currentUser: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  /** active paid plan (Pro or Founder) */
  isPro: boolean;
  adminSaveSkill: (skill: Skill) => void;
  progressFor: (userId: string) => UserProgress;
  myProgress: UserProgress;
  missionById: (missionId: string) => { skill: Skill; mission: Mission } | null;
  missionUnlocked: (skill: Skill, order: number, userId?: string) => UnlockInfo;

  /* submissions */
  submitMission: (missionId: string, payload: SubmitPayload) => Submission | null;
  submissionsForMission: (missionId: string, userId?: string) => Submission[];
  mySubmissions: Submission[];
  adminSetSubmissionStatus: (submissionId: string, status: SubmissionStatus) => void;
  adminReviewSubmission: (
    submissionId: string,
    verdict: "APPROVED" | "REJECTED" | "NEEDS_IMPROVEMENT",
    feedback: string,
    score?: number
  ) => ReviewResult | null;

  /* portfolio */
  myPortfolio: PortfolioItem[];
  portfolioFor: (userId: string) => PortfolioItem[];
  setPortfolioFeatured: (itemId: string, featured: boolean) => void;
  setPortfolioHidden: (itemId: string, hidden: boolean) => void;

  /* knowledge check */
  recordKnowledgeCheck: (missionId: string, scorePct: number) => { firstPass: boolean; xpEarned: number };

  /* economy */
  requestNeuronPurchase: (amountInr: number, utrNumber: string, proofImageName?: string) => Transaction;
  adminSetTxnStatus: (txnId: string, status: "APPROVED" | "REJECTED") => void;
  adminAdjustNeurons: (userId: string, delta: number, note: string) => void;
  adminGrantXp: (userId: string, amount: number) => void;
  /* admin user management */
  adminToggleUserRole: (userId: string) => void;
  adminDeleteUser: (userId: string) => void;
  adminResetUserProgress: (userId: string) => void;
  adminPurgeUserbase: () => void;

  /* family plan */
  createFamilyChildProfile: (name: string) => void;
  switchFamilyChildProfile: (childId: string | null) => void;

  /* plans & payments */
  purchasePlanUpi: (planId: PlanId, amountInr: number, utrNumber: string, couponCode?: string) => PaymentRecord;
  activatePlan: (planId: PlanId, method: PaymentMethod, amountInr: number, meta?: { orderId?: string; paymentId?: string; couponCode?: string }) => void;
  adminResolvePayment: (paymentId: string, status: "APPROVED" | "REJECTED") => void;
  adminGrantPlan: (userId: string, planId: PlanId) => void;
  cancelSubscription: () => void;
  validateCoupon: (code: string) => Coupon | null;
  adminUpsertCoupon: (coupon: Coupon) => void;
  adminDeleteCoupon: (code: string) => void;

  /* catalog CRUD (admin) */
  adminUpsertSkill: (skill: Skill) => void;
  adminDeleteSkill: (skillId: string) => void;
  adminUpsertMission: (skillId: string, mission: Mission) => void;
  adminDeleteMission: (skillId: string, missionId: string) => void;
  adminMoveMission: (skillId: string, missionId: string, dir: -1 | 1) => void;
  adminSetMissionLocked: (missionId: string, locked: boolean) => void;
  adminResetCatalog: () => void;

  /* tournaments */
  adminCreateQuiz: (quiz: Omit<Quiz, "id" | "isActive" | "winnersDeclared">) => Quiz;
  adminDeclareWinners: (quizId: string) => void;
  joinQuiz: (quizId: string) => { ok: boolean; reason?: string };
  submitQuizScore: (quizId: string, score: number) => void;

  /* messaging */
  markNotificationsRead: () => void;
  adminBroadcastNotification: (message: string, targetUserId?: string) => void;
  adminAnnounce: (title: string, body: string) => void;
  adminDeleteAnnouncement: (id: string) => void;

  /* certificates */
  adminIssueCertificate: (userId: string, skillId: string, levelTier: number) => void;

  /* profile */
  updateProfile: (patch: Partial<Pick<User, "avatar" | "avatarUrl" | "bio" | "title" | "avatarFrame" | "name">>) => void;
  claimDailyMission: (missionId: string, neuronReward: number, xpReward: number) => void;

  /* credentials auth fallback */
  loginWithCredentials: (emailInput: string, passInput: string) => { ok: boolean; reason?: string };

  /* data management */
  importDatabase: (jsonStr: string) => { ok: boolean; reason?: string };
  exportDatabase: () => string;
  resetAllData: () => void;
}


const AppContext = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadInitialState());
  const [hydrated, setHydrated] = useState(false);

  /* hydrate from localStorage, migrating v1 if needed */
  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        const parsed = JSON.parse(rawV2) as AppState;
        if (parsed?.version === 2) {
          // catalog may gain new fields over releases — merge defensively
          const seededUsers = seedState().users;
          const cleanUsers = (parsed.users || []).filter((u) => !V1_DEMO_IDS.has(u.id));
          const hasOfficialAdmin = cleanUsers.some((u) => u.email.toLowerCase() === "learningskilledge@gmail.com");
          const mergedUsers = hasOfficialAdmin ? cleanUsers : [...seededUsers, ...cleanUsers];
          const activeUserId = parsed.currentUserId && mergedUsers.some((u) => u.id === parsed.currentUserId)
            ? parsed.currentUserId
            : mergedUsers[0]?.id || "";
          setState({
            ...seedState(),
            ...parsed,
            currentUserId: activeUserId,
            users: mergedUsers,
            catalog: parsed.catalog?.length ? parsed.catalog : SKILLS,
          });
          setHydrated(true);
          return;
        }


      }
      const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1) as V1AppState;
        if (parsedV1?.version === 1) {
          setState(migrateV1(parsedV1));
          localStorage.removeItem(STORAGE_KEY_V1);
        }
      }
    } catch {
      // corrupted state — fall back to seeds
    }
    setHydrated(true);
  }, []);

  /* persist */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
    } catch {
      // storage full/unavailable — app still works in-memory
    }
  }, [state, hydrated]);

  /* Clerk → app user sync. Clerk is the only source of identity. */
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  useEffect(() => {
    if (!hydrated || !isLoaded) return;
    if (!isSignedIn || !clerkUser) {
      return;
    }
    const email = (clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || "").toLowerCase();

    if (!email) return;
    const fullName = clerkUser.fullName || clerkUser.firstName || clerkUser.username || email.split("@")[0] || "Learner";
    const role: "USER" | "ADMIN" = adminEmails().includes(email) ? "ADMIN" : "USER";
    const avatarUrl = clerkUser.imageUrl || undefined;

    setState((s) => {
      const existing = s.users.find((u) => u.id === clerkUser.id || u.email.toLowerCase() === email);
      if (existing) {
        const unchanged =
          existing.name === fullName &&
          existing.email === email &&
          existing.role === role &&
          existing.avatarUrl === avatarUrl &&
          s.currentUserId === existing.id;
        if (unchanged) return s;
        return {
          ...s,
          users: s.users.map((u) => (u.id === existing.id ? { ...u, name: fullName, email, role, avatarUrl } : u)),
          currentUserId: existing.id,
        };
      }
      const nowIso = new Date().toISOString();
      const newUser: User = {
        id: clerkUser.id,
        name: fullName,
        email,
        role,
        avatar: "",
        avatarUrl,
        bio: "",
        title: role === "ADMIN" ? "Administrator" : "Builder in Training",
        neurons: 100, // welcome bonus
        xp: 0,
        streakCount: 1,
        lastActiveDay: todayKey(),
        subscription: { plan: "FREE", status: "ACTIVE", startedAt: nowIso, expiresAt: null },
        badges: [],
        createdAt: nowIso,
      };
      return {
        ...s,
        users: [...s.users, newUser],
        currentUserId: newUser.id,
        transactions: [
          {
            id: uid("txn"),
            userId: newUser.id,
            amountNeurons: 100,
            amountInr: null,
            type: "EARNED",
            status: "APPROVED",
            note: "Welcome bonus",
            createdAt: nowIso,
          },
          ...s.transactions,
        ],
        notifications: [
          makeNotification(newUser.id, `Welcome to Skill Edge Learning, ${newUser.name}! 100 Neurons credited as your welcome bonus.`),
          ...s.notifications,
        ],
      };
    });
  }, [hydrated, isLoaded, isSignedIn, clerkUser]);

  /* ------------------------------ derived state ------------------------------ */

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const isAdmin = Boolean(currentUser && currentUser.role === "ADMIN");
  const isPro = isPaidPlan(currentUser?.subscription);

  const catalog = useMemo(
    () => (isAdmin ? state.catalog : state.catalog.filter((s) => s.isPublished)),
    [state.catalog, isAdmin]
  );

  const progressFor = useCallback(
    (userId: string): UserProgress => state.progress[userId] ?? { completed: {}, premiumUnlocks: {} },
    [state.progress]
  );

  const myProgress = currentUser ? progressFor(currentUser.id) : { completed: {}, premiumUnlocks: {} };

  const missionById = useCallback(
    (missionId: string) => findMission(state.catalog, missionId),
    [state.catalog]
  );

  const missionUnlocked = useCallback(
    (skill: Skill, order: number, userId?: string): UnlockInfo => {
      const targetUid = userId ?? currentUser?.id;
      const mission = skill.missions.find((m) => m.order === order);
      if (!mission) return { unlocked: false, reason: "LOCKED_PREV" };
      if (mission.isLocked) return { unlocked: false, reason: "ADMIN_LOCKED" };
      const user = state.users.find((u) => u.id === targetUid);
      if (mission.isPremium && !isPaidPlan(user?.subscription)) return { unlocked: false, reason: "NEEDS_PRO" };
      if (order === 1) return { unlocked: true };
      if (!targetUid) return { unlocked: false, reason: "LOCKED_PREV" };
      const prog = progressFor(targetUid);
      const prev = skill.missions.find((m) => m.order === order - 1);
      return prev && prog.completed[prev.id] ? { unlocked: true } : { unlocked: false, reason: "LOCKED_PREV" };
    },
    [currentUser?.id, progressFor, state.users]
  );

  /* ------------------------------- submissions ------------------------------- */

  const submitMission = useCallback(
    (missionId: string, payload: SubmitPayload): Submission | null => {
      if (!currentUser) return null;
      const found = findMission(state.catalog, missionId);
      if (!found) return null;
      const sub: Submission = {
        id: uid("sub"),
        userId: currentUser.id,
        missionId,
        skillId: found.skill.id,
        note: payload.note,
        links: payload.links,
        files: payload.files,
        reflections: payload.reflections,
        status: "PENDING",
        resubmissionOf: payload.resubmissionOf,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        submissions: [sub, ...s.submissions],
        notifications: [
          makeNotification(
            currentUser.id,
            `Submission received for "${found.mission.title}". You'll get feedback after review.`,
            "info"
          ),
          ...s.notifications,
        ],
      }));
      return sub;
    },
    [currentUser, state.catalog]
  );

  const submissionsForMission = useCallback(
    (missionId: string, userId?: string) => {
      const targetUid = userId ?? currentUser?.id;
      return state.submissions.filter((s) => s.missionId === missionId && (!targetUid || s.userId === targetUid));
    },
    [state.submissions, currentUser?.id]
  );

  const mySubmissions = useMemo(
    () => (currentUser ? state.submissions.filter((s) => s.userId === currentUser.id) : []),
    [state.submissions, currentUser]
  );

  const adminSetSubmissionStatus = useCallback((submissionId: string, status: SubmissionStatus) => {
    setState((s) => ({
      ...s,
      submissions: s.submissions.map((sub) => (sub.id === submissionId ? { ...sub, status } : sub)),
    }));
  }, []);

  const adminReviewSubmission = useCallback(
    (
      submissionId: string,
      verdict: "APPROVED" | "REJECTED" | "NEEDS_IMPROVEMENT",
      feedback: string,
      score?: number
    ): ReviewResult | null => {
      const sub = state.submissions.find((x) => x.id === submissionId);
      if (!sub) return null;
      const found = findMission(state.catalog, sub.missionId);
      if (!found) return null;
      const { skill, mission } = found;
      const nowIso = new Date().toISOString();
      const reviewerId = currentUser?.id ?? "admin";

      const result: ReviewResult = { approved: verdict === "APPROVED", neuronsEarned: 0, xpEarned: 0, badgesEarned: [], certificate: null };

      setState((s) => {
        let submissions = s.submissions.map((x) =>
          x.id === submissionId
            ? { ...x, status: verdict as SubmissionStatus, feedback, score, reviewedBy: reviewerId, reviewedAt: nowIso }
            : x
        );
        let users = s.users;
        let transactions = s.transactions;
        let certificates = s.certificates;
        let notifications = s.notifications;
        let portfolio = s.portfolio;
        let progress = s.progress;

        const student = s.users.find((u) => u.id === sub.userId);
        if (!student) return { ...s, submissions };

        if (verdict === "APPROVED") {
          const prog = s.progress[sub.userId] ?? { completed: {}, premiumUnlocks: {} };
          const firstPass = !prog.completed[sub.missionId];

          progress = {
            ...s.progress,
            [sub.userId]: {
              ...prog,
              completed: {
                ...prog.completed,
                [sub.missionId]: {
                  score: Math.max(score ?? 100, prog.completed[sub.missionId]?.score ?? 0),
                  completedAt: prog.completed[sub.missionId]?.completedAt ?? nowIso,
                  submissionId,
                },
              },
            },
          };

          if (firstPass) {
            result.neuronsEarned = mission.neuronReward;
            result.xpEarned = mission.xpReward;

            const approvedCount = Object.keys(progress[sub.userId].completed).length;
            const skillDone = skill.missions.every((m) => progress[sub.userId].completed[m.id]);
            const extraBadges: string[] = [];
            if (mission.order === 5) extraBadges.push("phase-complete");
            if (skillDone) extraBadges.push("skill-complete");

            users = s.users.map((u) => {
              if (u.id !== sub.userId) return u;
              let updated = withStreak({ ...u, neurons: u.neurons + mission.neuronReward, xp: u.xp + mission.xpReward });
              const badged = grantBadges(updated, approvedCount, extraBadges);
              result.badgesEarned = badged.earned;
              return badged.user;
            });

            transactions = [
              {
                id: uid("txn"),
                userId: sub.userId,
                amountNeurons: mission.neuronReward,
                amountInr: null,
                type: "EARNED" as const,
                status: "APPROVED" as const,
                note: `Project approved: ${skill.title} · ${mission.title}`,
                createdAt: nowIso,
              },
              ...s.transactions,
            ];

            // portfolio item from the approved submission
            const item: PortfolioItem = {
              id: uid("pf"),
              userId: sub.userId,
              missionId: sub.missionId,
              skillId: skill.id,
              title: `${mission.title} — ${skill.title}`,
              description: sub.note || mission.objective,
              links: sub.links,
              coverImage: sub.files.find((f) => f.mime.startsWith("image/"))?.dataUrl ?? skill.thumbnailUrl,
              score,
              completedAt: nowIso,
              featured: false,
              hidden: false,
            };
            portfolio = [item, ...s.portfolio];

            // certificates at phase (order 5) and completion (order 10)
            if (CERT_TIERS.includes(mission.order)) {
              const exists = s.certificates.some(
                (c) => c.userId === sub.userId && c.skillId === skill.id && c.levelTier === mission.order
              );
              if (!exists) {
                const cert: Certificate = {
                  id: `${skill.id}-t${mission.order}-${sub.userId}`,
                  userId: sub.userId,
                  skillId: skill.id,
                  levelTier: mission.order,
                  certType: mission.order === 10 ? "Skill Completion" : "Phase Completion",
                  verificationCode: verificationHash(`${sub.userId}:${skill.id}:${mission.order}:${nowIso}`),
                  issuedAt: nowIso,
                  status: "Active",
                };
                certificates = [...s.certificates, cert];
                result.certificate = cert;
                notifications = [
                  makeNotification(sub.userId, `Certificate earned: ${skill.title} — ${cert.certType}!`),
                  ...notifications,
                ];
              }
            }

            notifications = [
              makeNotification(
                sub.userId,
                `"${mission.title}" approved! +${mission.neuronReward} Neurons, +${mission.xpReward} XP. Project added to your portfolio.`
              ),
              ...notifications,
            ];
          } else {
            notifications = [
              makeNotification(sub.userId, `Resubmission for "${mission.title}" approved. Feedback: ${feedback || "Great work!"}`),
              ...notifications,
            ];
          }
        } else if (verdict === "NEEDS_IMPROVEMENT") {
          notifications = [
            makeNotification(
              sub.userId,
              `"${mission.title}" needs another pass. Check the feedback and resubmit — you've got this.`,
              "warning"
            ),
            ...notifications,
          ];
        } else {
          notifications = [
            makeNotification(sub.userId, `"${mission.title}" submission was rejected. Read the feedback and try again.`, "warning"),
            ...notifications,
          ];
        }

        return { ...s, submissions, users, transactions, certificates, notifications, portfolio, progress };
      });

      return result;
    },
    [state.submissions, state.catalog, currentUser?.id]
  );

  /* -------------------------------- portfolio -------------------------------- */

  const myPortfolio = useMemo(
    () => (currentUser ? state.portfolio.filter((p) => p.userId === currentUser.id) : []),
    [state.portfolio, currentUser]
  );

  const portfolioFor = useCallback(
    (userId: string) => state.portfolio.filter((p) => p.userId === userId && !p.hidden),
    [state.portfolio]
  );

  const setPortfolioFeatured = useCallback((itemId: string, featured: boolean) => {
    setState((s) => ({ ...s, portfolio: s.portfolio.map((p) => (p.id === itemId ? { ...p, featured } : p)) }));
  }, []);

  const setPortfolioHidden = useCallback((itemId: string, hidden: boolean) => {
    setState((s) => ({ ...s, portfolio: s.portfolio.map((p) => (p.id === itemId ? { ...p, hidden } : p)) }));
  }, []);

  /* ----------------------------- knowledge check ----------------------------- */

  const recordKnowledgeCheck = useCallback(
    (missionId: string, scorePct: number) => {
      const key = `kc-${missionId}`;
      const res = { firstPass: false, xpEarned: 0 };
      if (!currentUser || scorePct < 80) return res;
      const prog = state.progress[currentUser.id] ?? { completed: {}, premiumUnlocks: {} };
      if (prog.claimedMissions?.[key]) return res;
      res.firstPass = true;
      res.xpEarned = 15;
      setState((s) => {
        const p = s.progress[currentUser.id] ?? { completed: {}, premiumUnlocks: {} };
        return {
          ...s,
          progress: {
            ...s.progress,
            [currentUser.id]: { ...p, claimedMissions: { ...(p.claimedMissions ?? {}), [key]: true } },
          },
          users: s.users.map((u) => (u.id === currentUser.id ? { ...u, xp: u.xp + 15 } : u)),
        };
      });
      return res;
    },
    [currentUser, state.progress]
  );

  /* --------------------------------- economy --------------------------------- */

  const requestNeuronPurchase = useCallback(
    (amountInr: number, utrNumber: string, proofImageName?: string) => {
      const txn: Transaction = {
        id: uid("txn"),
        userId: state.currentUserId,
        amountNeurons: Math.round(amountInr * INR_TO_NEURONS),
        amountInr,
        type: "PURCHASED",
        status: "PENDING",
        utrNumber,
        proofImageName,
        note: "Neuron top-up via UPI",
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        transactions: [txn, ...s.transactions],
        notifications: [
          makeNotification(
            s.currentUserId,
            `Payment of ₹${amountInr} submitted for verification. ${txn.amountNeurons} Neurons will be credited once approved.`,
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
        users = s.users.map((u) => (u.id === txn.userId ? { ...u, neurons: u.neurons + txn.amountNeurons } : u));
        notifications = [
          makeNotification(txn.userId, `Payment approved! ${txn.amountNeurons} Neurons credited to your wallet.`),
          ...notifications,
        ];
      } else {
        notifications = [
          makeNotification(txn.userId, `Payment (UTR ${txn.utrNumber ?? "—"}) was rejected. Contact support if this is a mistake.`, "warning"),
          ...notifications,
        ];
      }
      return { ...s, transactions, users, notifications };
    });
  }, []);

  const adminAdjustNeurons = useCallback((userId: string, delta: number, note: string) => {
    if (!delta) return;
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === userId ? { ...u, neurons: Math.max(0, u.neurons + delta) } : u)),
      transactions: [
        {
          id: uid("txn"),
          userId,
          amountNeurons: delta,
          amountInr: null,
          type: "ADMIN_GRANT" as const,
          status: "APPROVED" as const,
          note: note || (delta > 0 ? "Admin grant" : "Admin adjustment"),
          createdAt: new Date().toISOString(),
        },
        ...s.transactions,
      ],
      notifications: [
        makeNotification(
          userId,
          delta > 0 ? `Admin granted you ${delta} Neurons!` : `Admin adjusted your wallet by ${delta} Neurons.`,
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
      notifications: [makeNotification(userId, `Admin boosted you +${amount} XP!`), ...s.notifications],
    }));
  }, []);

  const adminToggleUserRole = useCallback((userId: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === "ADMIN" ? "USER" : "ADMIN";
          return { ...u, role: nextRole };
        }
        return u;
      }),
    }));
  }, []);

  const adminDeleteUser = useCallback((userId: string) => {
    setState((s) => {
      const nextUsers = s.users.filter((u) => u.id !== userId);
      const nextProgress = { ...s.progress };
      delete nextProgress[userId];
      return {
        ...s,
        users: nextUsers,
        progress: nextProgress,
        submissions: s.submissions.filter((sub) => sub.userId !== userId),
        certificates: s.certificates.filter((cert) => cert.userId !== userId),
      };
    });
  }, []);

  const adminResetUserProgress = useCallback((userId: string) => {
    setState((s) => {
      const nextProgress = { ...s.progress };
      delete nextProgress[userId];
      return {
        ...s,
        progress: nextProgress,
        submissions: s.submissions.filter((sub) => sub.userId !== userId),
        users: s.users.map((u) => (u.id === userId ? { ...u, xp: 0, neurons: 100, streakCount: 0 } : u)),
      };
    });
  }, []);

  const adminPurgeUserbase = useCallback(() => {
    setState((s) => {
      const adminUsers = s.users.filter((u) => u.role === "ADMIN" || adminEmails().includes(u.email.toLowerCase()));
      const adminIds = new Set(adminUsers.map((u) => u.id));
      const nextProgress = Object.fromEntries(Object.entries(s.progress).filter(([uid]) => adminIds.has(uid)));
      return {
        ...s,
        users: adminUsers.length ? adminUsers : seedState().users,
        progress: nextProgress,
        submissions: s.submissions.filter((sub) => adminIds.has(sub.userId)),
        certificates: s.certificates.filter((cert) => adminIds.has(cert.userId)),
        transactions: s.transactions.filter((tx) => adminIds.has(tx.userId)),
        payments: s.payments.filter((p) => adminIds.has(p.userId)),
      };
    });
  }, []);

  /* ----------------------------- family plan ----------------------------- */

  const createFamilyChildProfile = useCallback((name: string) => {
    if (!name.trim()) return;
    const newChild: FamilyChildProfile = {
      id: uid("child"),
      name: name.trim(),
      xp: 0,
      neurons: 100,
      streakCount: 0,
      completedMissions: [],
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id === s.currentUserId) {
          const list = u.familyProfiles ?? [];
          return { ...u, familyProfiles: [...list, newChild] };
        }
        return u;
      }),
    }));
  }, []);

  const switchFamilyChildProfile = useCallback((childId: string | null) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id === s.currentUserId) {
          return { ...u, activeChildId: childId };
        }
        return u;
      }),
    }));
  }, []);

  /* ----------------------------- plans & payments ----------------------------- */

  const validateCoupon = useCallback(
    (code: string): Coupon | null => {
      const c = state.coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase() && x.active);
      return c ?? null;
    },
    [state.coupons]
  );

  const purchasePlanUpi = useCallback(
    (planId: PlanId, amountInr: number, utrNumber: string, couponCode?: string): PaymentRecord => {
      const rec: PaymentRecord = {
        id: uid("pay"),
        userId: state.currentUserId,
        purpose: "PLAN",
        planId,
        amountInr,
        method: "UPI",
        status: "PENDING",
        utrNumber,
        couponCode,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        payments: [rec, ...s.payments],
        notifications: [
          makeNotification(
            s.currentUserId,
            `Plan payment of ₹${amountInr} submitted. Your ${planId.replace(/_/g, " ")} plan activates once the payment is verified.`,
            "info"
          ),
          ...s.notifications,
        ],
      }));
      return rec;
    },
    [state.currentUserId]
  );

  const applyPlanToUser = (s: AppState, userId: string, planId: PlanId): AppState => {
    const users = s.users.map((u) => {
      if (u.id !== userId) return u;
      let updated: User = { ...u, subscription: subscriptionFor(planId, u.subscription) };
      if (planId === "FOUNDER_LIFETIME" && !updated.badges.includes("founder")) {
        updated = { ...updated, badges: [...updated.badges, "founder"] };
      }
      return updated;
    });
    return {
      ...s,
      users,
      notifications: [
        makeNotification(userId, `Your ${planId.replace(/_/g, " ")} plan is now active. Welcome to the full Skill OS!`),
        ...s.notifications,
      ],
    };
  };

  const activatePlan = useCallback(
    (planId: PlanId, method: PaymentMethod, amountInr: number, meta?: { orderId?: string; paymentId?: string; couponCode?: string }) => {
      if (!currentUser) return;
      const rec: PaymentRecord = {
        id: uid("pay"),
        userId: currentUser.id,
        purpose: "PLAN",
        planId,
        amountInr,
        method,
        status: "APPROVED",
        gatewayOrderId: meta?.orderId,
        gatewayPaymentId: meta?.paymentId,
        couponCode: meta?.couponCode,
        createdAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
      };
      setState((s) => applyPlanToUser({ ...s, payments: [rec, ...s.payments] }, currentUser.id, planId));
    },
    [currentUser]
  );

  const adminResolvePayment = useCallback((paymentId: string, status: "APPROVED" | "REJECTED") => {
    setState((s) => {
      const rec = s.payments.find((p) => p.id === paymentId);
      if (!rec || rec.status !== "PENDING") return s;
      const payments = s.payments.map((p) =>
        p.id === paymentId ? { ...p, status, resolvedAt: new Date().toISOString() } : p
      );
      let next: AppState = { ...s, payments };
      if (status === "APPROVED" && rec.purpose === "PLAN" && rec.planId) {
        next = applyPlanToUser(next, rec.userId, rec.planId);
      } else if (status === "REJECTED") {
        next = {
          ...next,
          notifications: [
            makeNotification(rec.userId, `Your payment (₹${rec.amountInr}) was rejected. Contact support if this is a mistake.`, "warning"),
            ...next.notifications,
          ],
        };
      }
      return next;
    });
  }, []);

  const adminGrantPlan = useCallback((userId: string, planId: PlanId) => {
    setState((s) => applyPlanToUser(s, userId, planId));
  }, []);

  const cancelSubscription = useCallback(() => {
    if (!currentUser) return;
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === currentUser.id ? { ...u, subscription: { ...u.subscription, status: "CANCELLED" } } : u
      ),
      notifications: [
        makeNotification(currentUser.id, "Subscription cancelled. You keep access until the end of the billing period.", "info"),
        ...s.notifications,
      ],
    }));
  }, [currentUser]);

  const adminUpsertCoupon = useCallback((coupon: Coupon) => {
    setState((s) => {
      const exists = s.coupons.some((c) => c.code.toLowerCase() === coupon.code.toLowerCase());
      return {
        ...s,
        coupons: exists
          ? s.coupons.map((c) => (c.code.toLowerCase() === coupon.code.toLowerCase() ? coupon : c))
          : [...s.coupons, coupon],
      };
    });
  }, []);

  const adminDeleteCoupon = useCallback((code: string) => {
    setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.code.toLowerCase() !== code.toLowerCase()) }));
  }, []);

  /* ------------------------------ catalog CRUD ------------------------------ */

  const adminUpsertSkill = useCallback((skill: Skill) => {
    setState((s) => {
      const exists = s.catalog.some((x) => x.id === skill.id);
      return { ...s, catalog: exists ? s.catalog.map((x) => (x.id === skill.id ? skill : x)) : [...s.catalog, skill] };
    });
  }, []);

  const adminDeleteSkill = useCallback((skillId: string) => {
    setState((s) => ({ ...s, catalog: s.catalog.filter((x) => x.id !== skillId) }));
  }, []);

  const adminUpsertMission = useCallback((skillId: string, mission: Mission) => {
    setState((s) => ({
      ...s,
      catalog: s.catalog.map((sk) => {
        if (sk.id !== skillId) return sk;
        const exists = sk.missions.some((m) => m.id === mission.id);
        const missions = exists
          ? sk.missions.map((m) => (m.id === mission.id ? mission : m))
          : [...sk.missions, mission].sort((a, b) => a.order - b.order);
        return { ...sk, missions };
      }),
    }));
  }, []);

  const adminDeleteMission = useCallback((skillId: string, missionId: string) => {
    setState((s) => ({
      ...s,
      catalog: s.catalog.map((sk) =>
        sk.id === skillId
          ? { ...sk, missions: sk.missions.filter((m) => m.id !== missionId).map((m, i) => ({ ...m, order: i + 1 })) }
          : sk
      ),
    }));
  }, []);

  const adminMoveMission = useCallback((skillId: string, missionId: string, dir: -1 | 1) => {
    setState((s) => ({
      ...s,
      catalog: s.catalog.map((sk) => {
        if (sk.id !== skillId) return sk;
        const idx = sk.missions.findIndex((m) => m.id === missionId);
        const j = idx + dir;
        if (idx < 0 || j < 0 || j >= sk.missions.length) return sk;
        const missions = [...sk.missions];
        [missions[idx], missions[j]] = [missions[j], missions[idx]];
        return { ...sk, missions: missions.map((m, i) => ({ ...m, order: i + 1 })) };
      }),
    }));
  }, []);

  const adminSetMissionLocked = useCallback((missionId: string, locked: boolean) => {
    setState((s) => ({
      ...s,
      catalog: s.catalog.map((sk) => ({
        ...sk,
        missions: sk.missions.map((m) => (m.id === missionId ? { ...m, isLocked: locked } : m)),
      })),
    }));
  }, []);

  const adminResetCatalog = useCallback(() => {
    setState((s) => ({ ...s, catalog: SKILLS }));
  }, []);

  /* ------------------------------- tournaments ------------------------------- */

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
        const prize = idx < 3 ? Math.round(quiz.prizePoolNeurons * splits[idx]) : 0;
        if (prize > 0) {
          users = users.map((u) => {
            if (u.id !== e.userId) return u;
            const withPrize = { ...u, neurons: u.neurons + prize };
            return idx === 0 && !withPrize.badges.includes("tournament-winner")
              ? { ...withPrize, badges: [...withPrize.badges, "tournament-winner"] }
              : withPrize;
          });
          transactions = [
            {
              id: uid("txn"),
              userId: e.userId,
              amountNeurons: prize,
              amountInr: null,
              type: "PRIZE" as const,
              status: "APPROVED" as const,
              note: `Rank #${idx + 1} in ${quiz.title}`,
              createdAt: new Date().toISOString(),
            },
            ...transactions,
          ];
          notifications = [
            makeNotification(e.userId, `You ranked #${idx + 1} in ${quiz.title} and won ${prize} Neurons!`),
            ...notifications,
          ];
        }
        return { ...e, rank: idx + 1, prizeWonNeurons: prize };
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

  const joinQuiz = useCallback(
    (quizId: string): { ok: boolean; reason?: string } => {
      if (!currentUser) return { ok: false, reason: "Sign in to join tournaments." };
      const quiz = state.quizzes.find((q) => q.id === quizId);
      if (!quiz) return { ok: false, reason: "Tournament not found." };
      if (state.quizEntries.some((e) => e.quizId === quizId && e.userId === currentUser.id))
        return { ok: false, reason: "Already joined." };
      if (quiz.entryFeeNeurons > currentUser.neurons)
        return { ok: false, reason: `Not enough Neurons — entry costs ${quiz.entryFeeNeurons}.` };
      setState((s) => {
        let users = s.users;
        let transactions = s.transactions;
        if (quiz.entryFeeNeurons > 0) {
          users = s.users.map((u) => (u.id === s.currentUserId ? { ...u, neurons: u.neurons - quiz.entryFeeNeurons } : u));
          transactions = [
            {
              id: uid("txn"),
              userId: s.currentUserId,
              amountNeurons: -quiz.entryFeeNeurons,
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
          quizEntries: [...s.quizEntries, { quizId, userId: s.currentUserId, joinedAt: new Date().toISOString(), score: null }],
        };
      });
      return { ok: true };
    },
    [state.quizzes, state.quizEntries, currentUser]
  );

  const submitQuizScore = useCallback((quizId: string, score: number) => {
    setState((s) => ({
      ...s,
      quizEntries: s.quizEntries.map((e) =>
        e.quizId === quizId && e.userId === s.currentUserId ? { ...e, score: Math.max(score, e.score ?? 0) } : e
      ),
    }));
  }, []);

  /* -------------------------------- messaging -------------------------------- */

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.userId === s.currentUserId ? { ...n, read: true } : n)),
    }));
  }, []);

  const adminBroadcastNotification = useCallback((message: string, targetUserId?: string) => {
    setState((s) => {
      const targets = targetUserId ? [targetUserId] : s.users.map((u) => u.id);
      const newNotifs = targets.map((userId) => makeNotification(userId, message, "info"));
      return { ...s, notifications: [...newNotifs, ...s.notifications] };
    });
  }, []);

  const adminAnnounce = useCallback((title: string, body: string) => {
    setState((s) => ({
      ...s,
      announcements: [{ id: uid("ann"), title, body, createdAt: new Date().toISOString() }, ...s.announcements],
    }));
  }, []);

  const adminDeleteAnnouncement = useCallback((id: string) => {
    setState((s) => ({ ...s, announcements: s.announcements.filter((a) => a.id !== id) }));
  }, []);

  /* ------------------------------- certificates ------------------------------- */

  const adminIssueCertificate = useCallback((userId: string, skillId: string, levelTier: number) => {
    setState((s) => {
      const u = s.users.find((x) => x.id === userId);
      const sk = findSkill(s.catalog, skillId);
      if (!u || !sk) return s;
      const cert: Certificate = {
        id: uid("cert"),
        userId,
        skillId,
        levelTier,
        certType: levelTier >= 10 ? "Skill Completion" : "Phase Completion",
        verificationCode: verificationHash(`${userId}:${skillId}:${levelTier}`),
        issuedAt: new Date().toISOString(),
        status: "Active",
      };
      return {
        ...s,
        certificates: [cert, ...s.certificates],
        notifications: [makeNotification(userId, `Admin issued you a certificate in ${sk.title}!`), ...s.notifications],
      };
    });
  }, []);

  /* --------------------------------- profile --------------------------------- */

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, "avatar" | "avatarUrl" | "bio" | "title" | "avatarFrame" | "name">>) => {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
      }));
    },
    []
  );

  const claimDailyMission = useCallback((missionId: string, neuronReward: number, xpReward: number) => {
    setState((s) => {
      const u = s.users.find((x) => x.id === s.currentUserId);
      if (!u) return s;
      const userProg = s.progress[s.currentUserId] || { completed: {}, premiumUnlocks: {} };
      if (userProg.claimedMissions?.[missionId]) return s;
      const updatedProg: UserProgress = {
        ...userProg,
        claimedMissions: { ...(userProg.claimedMissions || {}), [missionId]: true },
      };
      const updatedUser = withStreak({ ...u, neurons: u.neurons + neuronReward, xp: u.xp + xpReward });
      return {
        ...s,
        users: s.users.map((x) => (x.id === s.currentUserId ? updatedUser : x)),
        progress: { ...s.progress, [s.currentUserId]: updatedProg },
        transactions: [
          {
            id: uid("txn"),
            userId: s.currentUserId,
            amountNeurons: neuronReward,
            amountInr: null,
            type: "EARNED" as const,
            status: "APPROVED" as const,
            note: `Daily quest reward (${missionId})`,
            createdAt: new Date().toISOString(),
          },
          ...s.transactions,
        ],
        notifications: [
          makeNotification(s.currentUserId, `Daily quest claimed: +${neuronReward} Neurons & +${xpReward} XP!`),
          ...s.notifications,
        ],
      };
    });
  }, []);

  const loginWithCredentials = useCallback((emailInput: string, passInput: string) => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return { ok: false, reason: "Please enter your email." };

    const isAdminEmail = adminEmails().includes(email);
    if (isAdminEmail && passInput) {
      const validPasswords = ["SelAdmin#2026!", "learningskilledge@123", "seladmin@123"];
      if (!validPasswords.includes(passInput)) {
        return { ok: false, reason: "Invalid admin password." };
      }
    }

    const role: "USER" | "ADMIN" = isAdminEmail ? "ADMIN" : "USER";
    const nowIso = new Date().toISOString();

    setState((s) => {
      const existing = s.users.find((u) => u.email.toLowerCase() === email);
      if (existing) {
        return {
          ...s,
          users: s.users.map((u) => (u.id === existing.id ? { ...u, role } : u)),
          currentUserId: existing.id,
        };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: email.includes("learningskilledge") || email.includes("admin") ? "Skill Edge Admin" : email.split("@")[0],
        email,
        role,
        avatar: "",
        title: role === "ADMIN" ? "Administrator" : "Builder in Training",
        neurons: role === "ADMIN" ? 1000 : 100,
        xp: role === "ADMIN" ? 500 : 0,
        streakCount: 1,
        lastActiveDay: todayKey(),
        subscription: { plan: role === "ADMIN" ? "FOUNDER_LIFETIME" : "FREE", status: "ACTIVE", startedAt: nowIso, expiresAt: null },
        badges: [],
        createdAt: nowIso,
      };
      return {
        ...s,
        users: [...s.users, newUser],
        currentUserId: newUser.id,
      };
    });

    return { ok: true };
  }, []);

  /* ------------------------------ data management ------------------------------ */

  const importDatabase = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr) as AppState;
      if (!parsed || parsed.version !== 2 || !Array.isArray(parsed.users) || !Array.isArray(parsed.catalog)) {
        return { ok: false, reason: "Invalid v2 database structure." };
      }
      setState(parsed);
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: (e as Error).message || "JSON parsing error" };
    }
  }, []);

  const exportDatabase = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const resetAllData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_V2);
      localStorage.removeItem(STORAGE_KEY_V1);
    } catch {}
    setState(seedState());
  }, []);

  /* ---------------------------------- expose ---------------------------------- */

  const api: AppApi = {
    state,
    hydrated,
    catalog,
    skills: catalog,
    currentUser,
    isAdmin,
    isAuthenticated: Boolean(currentUser),
    isPro,
    loginWithCredentials,
    adminSaveSkill: adminUpsertSkill,

    progressFor,
    myProgress,
    missionById,
    missionUnlocked,
    submitMission,
    submissionsForMission,
    mySubmissions,
    adminSetSubmissionStatus,
    adminReviewSubmission,
    myPortfolio,
    portfolioFor,
    setPortfolioFeatured,
    setPortfolioHidden,
    recordKnowledgeCheck,
    requestNeuronPurchase,
    adminSetTxnStatus,
    adminAdjustNeurons,
    adminGrantXp,
    adminToggleUserRole,
    adminDeleteUser,
    adminResetUserProgress,
    adminPurgeUserbase,
    createFamilyChildProfile,
    switchFamilyChildProfile,
    purchasePlanUpi,
    activatePlan,
    adminResolvePayment,
    adminGrantPlan,
    cancelSubscription,
    validateCoupon,
    adminUpsertCoupon,
    adminDeleteCoupon,
    adminUpsertSkill,
    adminDeleteSkill,
    adminUpsertMission,
    adminDeleteMission,
    adminMoveMission,
    adminSetMissionLocked,
    adminResetCatalog,
    adminCreateQuiz,
    adminDeclareWinners,
    joinQuiz,
    submitQuizScore,
    markNotificationsRead,
    adminBroadcastNotification,
    adminAnnounce,
    adminDeleteAnnouncement,
    adminIssueCertificate,
    updateProfile,
    claimDailyMission,
    importDatabase,
    exportDatabase,
    resetAllData,
  };

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export type { SubmissionKind };
