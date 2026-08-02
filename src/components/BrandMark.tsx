"use client";

import React from "react";
import { Hexagon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandMark({ className, size = "md", href = "/" }: Props) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const svgSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 group cursor-pointer", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-brand via-brand-bright to-brand-deep shadow-[0_0_20px_rgba(232,80,2,0.4)] transition group-hover:scale-105",
          iconSizes[size]
        )}
      >
        <Hexagon className={cn("text-white stroke-[2.5]", svgSizes[size])} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-black tracking-tight text-white transition group-hover:text-brand", textSizes[size])}>
          SKILL EDGE
        </span>
        <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand">
          LEARNING OS
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Skill Edge Learning OS home">
        {content}
      </Link>
    );
  }

  return content;
}
