import type { PlanId, Subscription } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------ neurons ------------------------------ */

export const NEURON = "⬢"; // hexagon glyph — pair with the Lucide Hexagon icon in UI
export const INR_TO_NEURONS = 2; // 10 INR = 20 Neurons

export function fmtNeurons(n: number) {
  return `${NEURON} ${n.toLocaleString("en-IN")}`;
}

/** @deprecated v1 aliases — use NEURON / fmtNeurons */
export const COIN = NEURON;
export const INR_TO_COINS = INR_TO_NEURONS;
export const fmtCoins = fmtNeurons;

export function fmtNum(n: number) {
  return n.toLocaleString("en-IN");
}

export function fmtInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ------------------------------- plans ------------------------------- */

export interface PlanDef {
  id: PlanId;
  name: string;
  priceInr: number; // 0 for free
  period: "forever" | "month" | "year" | "lifetime";
  tagline: string;
  features: string[];
  highlight?: boolean;
}

export const PLANS: PlanDef[] = [
  {
    id: "FREE",
    name: "Free",
    priceInr: 0,
    period: "forever",
    tagline: "Start building today",
    features: [
      "First 4 missions of every skill",
      "Project submissions & feedback",
      "Basic certificates",
      "Community access",
      "Ad-supported",
    ],
  },
  {
    id: "PRO_MONTHLY",
    name: "Pro Monthly",
    priceInr: 499,
    period: "month",
    tagline: "The full Skill OS",
    features: [
      "All skills, all missions",
      "Priority project reviews",
      "Full portfolio & share link",
      "All certificates + QR verification",
      "Weekly challenges & tournaments",
      "Completely ad-free",
    ],
    highlight: true,
  },
  {
    id: "PRO_YEARLY",
    name: "Pro Yearly",
    priceInr: 4999,
    period: "year",
    tagline: "2 months free",
    features: ["Everything in Pro Monthly", "₹417/month effective", "Yearly progress report", "Completely ad-free"],
  },
  {
    id: "FAMILY",
    name: "Family Plan",
    priceInr: 9999,
    period: "year",
    tagline: "One subscription for siblings",
    features: [
      "Up to 5 child profiles with separate progress",
      "Separate portfolios, certificates & badges",
      "Independent XP & Neurons for each child",
      "All 12 skills & missions fully unlocked",
      "Parent oversight & progress reports",
      "Completely ad-free for all profiles",
    ],
  },
];

export function planDef(id: PlanId): PlanDef {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function isPaidPlan(sub: Subscription | undefined | null): boolean {
  if (!sub) return false;
  if (sub.plan === "FREE") return false;
  if (sub.status !== "ACTIVE") return false;
  if (sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now()) return false;
  return true;
}

/* ---------------------------- xp & tiers ---------------------------- */

/** XP thresholds for level badges 1-10 */
export const XP_THRESHOLDS = [0, 250, 600, 1050, 1600, 2250, 3000, 3900, 4900, 6000];

export function levelForXp(xp: number) {
  let lvl = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) lvl = i + 1;
  }
  return lvl;
}

/** progress (0-1) toward the next level badge */
export function xpProgress(xp: number) {
  const lvl = levelForXp(xp);
  if (lvl >= 10) return 1;
  const cur = XP_THRESHOLDS[lvl - 1];
  const next = XP_THRESHOLDS[lvl];
  return Math.min(1, (xp - cur) / (next - cur));
}

/* ------------------------------- ids ------------------------------- */

let counter = 0;
export function uid(prefix = "id") {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Deterministic verification hash for certificates */
export function verificationHash(input: string) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
  return `SE-${hex.padStart(13, "0")}`;
}

/* ------------------------------- dates ------------------------------- */

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isYesterdayKey(key: string) {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return todayKey(y) === key;
}

export function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** millis until a start time; negative if already started */
export function msUntil(iso: string) {
  return new Date(iso).getTime() - Date.now();
}

export function countdownParts(ms: number) {
  const clamped = Math.max(0, ms);
  const d = Math.floor(clamped / 86400000);
  const h = Math.floor((clamped % 86400000) / 3600000);
  const m = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  return { d, h, m, s };
}

/* --------------------------- misc formatting --------------------------- */

export function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fmtMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** admin allowlist — env-driven with sane defaults */
export function adminEmails(): string[] {
  const env = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const defaults = [
    "skilledgeadmin@gmail.com",
    "learningskilledge@gmail.com",
    "skilledgelearning@gmail.com",
    "mylearning069@gmail.com",
    "admin@gmail.com",
  ];
  return Array.from(new Set([...defaults, ...env.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)]));
}



