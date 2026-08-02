"use client";

import {
  Award,
  Bot,
  Briefcase,
  Clapperboard,
  Code2,
  Compass,
  Crown,
  Flag,
  Flame,
  Gem,
  GraduationCap,
  Hammer,
  Handshake,
  LucideIcon,
  Megaphone,
  MessageSquare,
  Mic,
  Milestone,
  Package,
  Rocket,
  Sparkles,
  Sprout,
  Timer,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

/** Registry for icon names stored in data (skills, badges, student tiers). */
const ICONS: Record<string, LucideIcon> = {
  Award,
  Bot,
  Briefcase,
  Clapperboard,
  Code2,
  Compass,
  Crown,
  Flag,
  Flame,
  Gem,
  GraduationCap,
  Hammer,
  Handshake,
  Megaphone,
  MessageSquare,
  Mic,
  Milestone,
  Package,
  Rocket,
  Sprout,
  Timer,
  Trophy,
  Users,
  Wallet,
};

export function SkillIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} style={style} />;
}
