/* ============================================================
   Skill Edge Learning v2 — core types
   Mirrors the target PostgreSQL/Supabase schema so the client
   store can be swapped for a real backend without page changes.
   ============================================================ */

export type Role = "USER" | "ADMIN";

/* ------------------------------ plans ------------------------------ */

export type PlanId = "FREE" | "INDIVIDUAL_SKILL" | "PRO_MONTHLY" | "PRO_YEARLY" | "FAMILY" | "FOUNDER_LIFETIME";

export interface Subscription {
  plan: PlanId;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startedAt: string; // ISO
  expiresAt: string | null; // null = lifetime / free
  paymentId?: string;
}

/* ------------------------------ users ------------------------------ */

export interface FamilyChildProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  neurons: number;
  streakCount: number;
  completedMissions: string[];
  createdAt: string;
}

export interface User {
  id: string; // Clerk user id
  name: string;
  email: string;
  role: Role;
  avatar: string; // emoji fallback for legacy data; prefer avatarUrl
  avatarUrl?: string;
  bio?: string;
  title?: string;
  avatarFrame?: string;
  neurons: number; // in-app currency
  xp: number;
  streakCount: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  subscription: Subscription;
  badges: string[]; // earned badge ids
  familyProfiles?: FamilyChildProfile[];
  activeChildId?: string | null;
  createdAt: string;
}

/* --------------------------- learning content --------------------------- */

export type ResourceType = "VIDEO" | "PDF" | "ARTICLE" | "TEMPLATE" | "DOCUMENT" | "LINK" | "IMAGE";

export interface LearningResource {
  id: string;
  type: ResourceType;
  title: string;
  url: string; // YouTube id or full URL depending on type
  creator?: string; // e.g. Fireship, Theo - t3.gg, Figma, OpenAI
  isOfficialDocs?: boolean; // true if official documentation link
  minutes?: number;
}

export type SubmissionKind =
  | "TEXT"
  | "FILE"
  | "URL"
  | "GOOGLE_DRIVE"
  | "GITHUB"
  | "FIGMA"
  | "CANVA"
  | "NOTION"
  | "YOUTUBE";

export interface Assignment {
  brief: string; // what to actually build/do
  deliverables: string[]; // concrete outputs expected
  checklist: string[]; // step-by-step execution checklist
  allowedSubmissionTypes: SubmissionKind[];
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type MiniMissionType =
  | "MATCH_PAIRS"
  | "DRAG_ORDER"
  | "FILL_BLANKS"
  | "FIND_MISTAKE"
  | "SCENARIO"
  | "PREDICT";

export interface MatchPair {
  left: string;
  right: string;
}

export interface MiniMissionData {
  type: MiniMissionType;
  question: string;
  pairs?: MatchPair[]; // for MATCH_PAIRS
  orderItems?: string[]; // for DRAG_ORDER
  fillBlankSentence?: string; // e.g. "AI works by recognizing ___"
  blankOptions?: string[]; // for FILL_BLANKS
  correctAnswer?: string | number;
  options?: string[]; // for SCENARIO, PREDICT, FIND_MISTAKE
  explanation: string;
}

export interface GamifiedStep {
  id: string;
  type: "HOOK" | "STORY" | "DISCOVERY" | "PATTERN" | "MINI_MISSION" | "REFLECTION" | "REWARD";
  title?: string;
  hookText?: string;
  storyText?: string;
  storyAnalogy?: string;
  discoveryText?: string;
  patternPrompt?: string;
  patternAnswer?: string;
  miniMission?: MiniMissionData;
  reflectionQuestion?: string;
  xpReward?: number;
  neuronReward?: number;
}

export interface Mission {
  id: string; // `${skillId}-level-${n}` (kept from v1 so progress migrates)
  skillId: string;
  order: number; // 1-10+
  title: string;
  tier: string; // display tier name / phase
  objective: string; // one-line mission objective
  expectedOutcome: string; // what the student walks away with
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites: string[]; // mission ids
  resources: LearningResource[];
  assignment: Assignment;
  reflectionQuestions: string[];
  quiz: Question[]; // optional knowledge check — never the completion criterion
  xpReward: number;
  neuronReward: number;
  isPremium: boolean; // required Pro/Family plan
  isLocked: boolean; // admin hard-lock overrides everything
  isBossBattle?: boolean;
  steps?: GamifiedStep[];
  starsEarned?: number;
}

export interface SkillTransformation {
  become: string; // e.g. "AI Software Engineer"
  headline: string; // e.g. "By completing this skill, you'll become an AI Software Engineer..."
  canBuild: string[];
  realWorldOutcomes: string[];
  projectsCompleted: string[];
  careerOpportunities: string[];
}

export interface Skill {
  id: string; // slug
  title: string;
  category: string;
  iconName: string;
  description: string;
  color: string; // accent hex
  thumbnailUrl: string;
  difficulty: Difficulty;
  estimatedHours: number;
  transformation?: SkillTransformation;
  missions: Mission[];
  isPublished: boolean;
}

/* ----------------------------- submissions ----------------------------- */

export type SubmissionStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "NEEDS_IMPROVEMENT";

export interface SubmissionLink {
  kind: SubmissionKind;
  url: string;
  label?: string;
}

export interface SubmissionFile {
  name: string;
  size: number; // bytes
  mime: string;
  dataUrl?: string; // small files inline; large files should be shared as links
}

export interface Submission {
  id: string;
  userId: string;
  missionId: string;
  skillId: string;
  note: string; // student's writeup
  links: SubmissionLink[];
  files: SubmissionFile[];
  reflections: { question: string; answer: string }[];
  status: SubmissionStatus;
  feedback?: string;
  score?: number; // 0-100 set on review
  reviewedBy?: string;
  reviewedAt?: string;
  resubmissionOf?: string; // previous submission id
  createdAt: string;
}

/* ------------------------------ portfolio ------------------------------ */

export interface PortfolioItem {
  id: string;
  userId: string;
  missionId: string;
  skillId: string;
  title: string;
  description: string;
  links: SubmissionLink[];
  coverImage?: string; // dataUrl or URL
  score?: number;
  completedAt: string;
  featured: boolean;
  hidden: boolean;
}

/* ------------------------------- economy ------------------------------- */

export type TxnType =
  | "EARNED"
  | "PURCHASED"
  | "SPENT_COURSE"
  | "SPENT_QUIZ"
  | "ADMIN_GRANT"
  | "PRIZE"
  | "STREAK"
  | "CHALLENGE";
export type TxnStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Transaction {
  id: string;
  userId: string;
  amountNeurons: number; // positive = credit, negative = debit
  amountInr: number | null;
  type: TxnType;
  status: TxnStatus;
  utrNumber?: string;
  proofImageName?: string;
  note: string;
  createdAt: string;
}

export type PaymentMethod = "UPI" | "RAZORPAY" | "STRIPE";
export type PaymentPurpose = "PLAN" | "NEURONS";

export interface PaymentRecord {
  id: string;
  userId: string;
  purpose: PaymentPurpose;
  planId?: PlanId; // when purpose = PLAN
  neurons?: number; // when purpose = NEURONS
  amountInr: number;
  method: PaymentMethod;
  status: TxnStatus;
  utrNumber?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  couponCode?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Coupon {
  code: string;
  percentOff: number; // 1-100
  active: boolean;
}

/* ----------------------------- gamification ----------------------------- */

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon name
  color: string;
  tierColor?: string;
  shape?: "Hexagon" | "Shield";
}

export interface StudentTier {
  tierNumber: number;
  name: string;
  color: string;
  hexColor: string;
  iconName: string; // lucide icon name
  requirements: string[];
  rewards: string[];
  minXp: number;
  minSkillsCompleted: number;
  minStreak: number;
}

/* ------------------------------ tournaments ------------------------------ */

export interface Quiz {
  id: string;
  title: string;
  category: string;
  entryFeeNeurons: number;
  prizePoolNeurons: number;
  startTime: string; // ISO
  durationMins: number;
  secondsPerQuestion: number;
  questions: Question[];
  isActive: boolean;
  winnersDeclared: boolean;
}

export interface QuizEntry {
  quizId: string;
  userId: string;
  joinedAt: string;
  score: number | null;
  rank?: number;
  prizeWonNeurons?: number;
}

/* ------------------------------ certificates ------------------------------ */

export type CertificateType =
  | "Phase Completion"
  | "Skill Completion"
  | "Skill Excellence"
  | "Master Practitioner"
  | "Pro Certificate"
  | "Elite Certificate"
  | "Legend Certificate"
  | "Founding Ambassador"
  | "Founding Creator"
  | "Growth Leader"
  | "City Launch Head"
  | "Elite Ambassador"
  | "Ambassador"
  | "Special";

export interface Certificate {
  id: string;
  userId: string;
  skillId: string;
  levelTier: number;
  title?: string;
  certType?: CertificateType;
  phaseName?: string;
  verificationCode: string;
  issuedAt: string;
  status?: "Active" | "Revoked";
  themeColor?: string; // hex or preset theme
  badgeLevel?: string;
  badgeShape?: "Hexagon" | "Shield";
  description?: string;
}

/* ------------------------------- messaging ------------------------------- */

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  kind: "success" | "info" | "warning";
  createdAt: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

/* -------------------------------- progress -------------------------------- */

export interface ProgressEntry {
  score: number;
  completedAt: string;
  submissionId?: string;
}

export interface UserProgress {
  completed: Record<string, ProgressEntry>; // missionId -> entry
  premiumUnlocks: Record<string, boolean>; // legacy skill unlocks (v1)
  claimedMissions?: Record<string, boolean>; // daily quest claims
  unlockedSingleSkills?: string[]; // skill IDs unlocked individually for ₹99
}

/* -------------------------------- app state -------------------------------- */

export interface AppState {
  version: number; // 2
  currentUserId: string;
  users: User[];
  catalog: Skill[]; // fully editable by admin
  progress: Record<string, UserProgress>; // userId -> progress
  submissions: Submission[];
  portfolio: PortfolioItem[];
  transactions: Transaction[];
  payments: PaymentRecord[];
  coupons: Coupon[];
  quizzes: Quiz[];
  quizEntries: QuizEntry[];
  certificates: Certificate[];
  notifications: AppNotification[];
  announcements: Announcement[];
}

/* ------------------------- v1 state (for migration) ------------------------- */

export interface V1User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  title?: string;
  avatarFrame?: string;
  edgeCoins: number;
  xp: number;
  streakCount: number;
  lastActiveDay: string | null;
  createdAt: string;
}

export interface V1AppState {
  version: number; // 1
  currentUserId: string;
  users: V1User[];
  progress: Record<string, UserProgress>;
  transactions: {
    id: string;
    userId: string;
    amountCoins: number;
    amountInr: number | null;
    type: TxnType;
    status: TxnStatus;
    utrNumber?: string;
    proofImageName?: string;
    note: string;
    createdAt: string;
  }[];
  quizzes: {
    id: string;
    title: string;
    category: string;
    entryFeeCoins: number;
    prizePoolCoins: number;
    startTime: string;
    durationMins: number;
    secondsPerQuestion: number;
    questions: Question[];
    isActive: boolean;
    winnersDeclared: boolean;
  }[];
  quizEntries: {
    quizId: string;
    userId: string;
    joinedAt: string;
    score: number | null;
    rank?: number;
    prizeWonCoins?: number;
  }[];
  certificates: Certificate[];
  notifications: AppNotification[];
  overrides: Record<string, unknown>;
}
