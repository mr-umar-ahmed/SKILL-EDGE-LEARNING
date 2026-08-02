export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const COIN = "ↁ";
export const INR_TO_COINS = 2; // 10 INR = 20 EdgeCoins

export function fmtCoins(n: number) {
  return `${COIN}${n.toLocaleString("en-IN")}`;
}

export function fmtNum(n: number) {
  return n.toLocaleString("en-IN");
}

/** XP thresholds for level badges 1-10 */
export const XP_THRESHOLDS = [0, 250, 600, 1050, 1600, 2250, 3000, 3900, 4900, 6000];

export const STUDENT_TIER_THRESHOLDS = [
  { tierNumber: 1, name: "Starter", icon: "🌱", color: "#9ca3af", minXp: 0 },
  { tierNumber: 2, name: "Explorer", icon: "🧭", color: "#3b82f6", minXp: 1000 },
  { tierNumber: 3, name: "Builder", icon: "🔨", color: "#a855f7", minXp: 3000 },
  { tierNumber: 4, name: "Operator", icon: "🚀", color: "#f97316", minXp: 6000 },
  { tierNumber: 5, name: "Pro", icon: "👑", color: "#eab308", minXp: 10000 },
  { tierNumber: 6, name: "Elite", icon: "💎", color: "#d97706", minXp: 15000 },
  { tierNumber: 7, name: "Master Practitioner", icon: "🏆", color: "#e2e8f0", minXp: 25000 },
];

export function levelForXp(xp: number) {
  let lvl = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) lvl = i + 1;
  }
  return lvl;
}

export function studentTierForXp(xp: number) {
  let tier = STUDENT_TIER_THRESHOLDS[0];
  for (const t of STUDENT_TIER_THRESHOLDS) {
    if (xp >= t.minXp) tier = t;
  }
  return tier;
}

/** progress (0-1) toward the next level badge */
export function xpProgress(xp: number) {
  const lvl = levelForXp(xp);
  if (lvl >= 10) return 1;
  const cur = XP_THRESHOLDS[lvl - 1];
  const next = XP_THRESHOLDS[lvl];
  return Math.min(1, (xp - cur) / (next - cur));
}

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
