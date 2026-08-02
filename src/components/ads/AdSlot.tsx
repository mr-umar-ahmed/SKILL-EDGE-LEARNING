"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Responsive AdSense unit, shown to FREE-plan users only.
 * - Pro/Founder users: renders nothing.
 * - Publisher ID not configured: renders nothing in production,
 *   a subtle placeholder in development so placements are visible.
 */
export function AdSlot({ slot, className }: { slot?: string; className?: string }) {
  const { hydrated, isPro } = useApp();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !adSlot || isPro || !hydrated || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not ready — the script retries on load
    }
  }, [client, adSlot, isPro, hydrated]);

  if (!hydrated || isPro) return null;

  if (!client || !adSlot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className={cn("glass flex flex-col items-center justify-center gap-1 p-6 text-center", className)}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Ad placement (dev preview)</span>
        <span className="text-xs text-zinc-500">Set NEXT_PUBLIC_ADSENSE_CLIENT to activate AdSense here.</span>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Sponsored</span>
        <Link href="/pricing" className="text-[10px] font-semibold text-brand hover:underline">
          Remove ads with Pro →
        </Link>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/** Banner nudging free users toward the ad-free Pro experience. */
export function UpgradeBanner({ className }: { className?: string }) {
  const { hydrated, isPro, isAuthenticated } = useApp();
  if (!hydrated || isPro || !isAuthenticated) return null;
  return (
    <Link
      href="/pricing"
      className={cn(
        "card-glow group flex items-center justify-between gap-3 p-4 transition",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-premium/15 text-premium">
          <Sparkles className="h-4.5 w-4.5 h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Upgrade to SEL Pro</div>
          <div className="text-xs text-zinc-400">Ad-free learning, all missions, priority reviews.</div>
        </div>
      </div>
      <span className="btn-primary px-4 py-2 text-xs">Go Pro</span>
    </Link>
  );
}
