"use client";

import {
  Bot,
  Briefcase,
  Clapperboard,
  Code2,
  Handshake,
  LucideIcon,
  Megaphone,
  MessageSquare,
  Mic,
  Rocket,
  Sparkles,
  Timer,
  Users,
  Wallet,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Bot,
  Code2,
  Rocket,
  Wallet,
  Briefcase,
  Megaphone,
  Clapperboard,
  Handshake,
  MessageSquare,
  Mic,
  Timer,
  Users,
};

export function SkillIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} style={style} />;
}
