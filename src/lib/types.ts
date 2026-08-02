export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string; // emoji avatar
  title?: string; // custom title badge (e.g. "Prompt Architect")
  avatarFrame?: string; // custom frame style ("cyan" | "gold" | "violet" | "emerald")
  edgeCoins: number;
  xp: number;
  streakCount: number;
  lastActiveDay: string | null; // YYYY-MM-DD of last completed mission
  createdAt: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface Level {
  id: string; // `${skillId}-level-${n}`
  skillId: string;
  levelNumber: number; // 1-10
  title: string;
  tier: string;
  description: string;
  activityContent: string[]; // mission steps
  youtubeVideoId: string;
  minPassScore: number; // percent, default 80
  coinReward: number;
  xpReward: number;
  isPremium: boolean; // levels 7-10
  questions: Question[];
}

export interface Skill {
  id: string; // slug
  title: string;
  category: string;
  iconName: string;
  description: string;
  color: string; // accent hex
  imageUrl: string; // online visual cover image URL (Unsplash/Pixabay)
  premiumCost: number; // EdgeCoins to unlock tiers 7-10
  levels: Level[];
}

export type TxnType =
  | "EARNED"
  | "PURCHASED"
  | "SPENT_COURSE"
  | "SPENT_QUIZ"
  | "ADMIN_GRANT"
  | "PRIZE";
export type TxnStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Transaction {
  id: string;
  userId: string;
  amountCoins: number; // positive = credit, negative = debit
  amountInr: number | null;
  type: TxnType;
  status: TxnStatus;
  utrNumber?: string;
  proofImageName?: string;
  note: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  entryFeeCoins: number;
  prizePoolCoins: number;
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
  score: number | null; // null until submitted
  rank?: number;
  prizeWonCoins?: number;
}

export interface StudentTier {
  tierNumber: number;
  name: string;
  color: string;
  hexColor: string;
  icon: string;
  requirements: string[];
  rewards: string[];
  minXp: number;
  minSkillsCompleted: number;
  minStreak: number;
}

export type CertificateType =
  | "Phase Completion"
  | "Skill Completion"
  | "Skill Excellence"
  | "Master Practitioner"
  | "Ambassador"
  | "Special";

export interface Certificate {
  id: string;
  userId: string;
  skillId: string;
  levelTier: number; // 5 | 8 | 10
  title?: string;
  certType?: CertificateType;
  phaseName?: string;
  verificationCode: string;
  issuedAt: string;
  status?: "Active" | "Revoked";
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  kind: "success" | "info" | "warning";
  createdAt: string;
  read: boolean;
}

export interface ProgressEntry {
  score: number;
  completedAt: string;
}

export interface UserProgress {
  completed: Record<string, ProgressEntry>; // levelId -> entry
  premiumUnlocks: Record<string, boolean>; // skillId -> unlocked tiers 7-10
  claimedMissions?: Record<string, boolean>; // missionId -> claimed
}

export interface LevelOverride {
  title?: string;
  youtubeVideoId?: string;
  minPassScore?: number;
  coinReward?: number;
  questions?: Question[];
}

export interface AppState {
  version: number;
  currentUserId: string;
  users: User[];
  progress: Record<string, UserProgress>; // userId -> progress
  transactions: Transaction[];
  quizzes: Quiz[];
  quizEntries: QuizEntry[];
  certificates: Certificate[];
  notifications: AppNotification[];
  overrides: Record<string, LevelOverride>; // levelId -> patch
}
