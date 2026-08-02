"use client";

import { useClerk } from "@clerk/nextjs";
import { CreditCard, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { playClickSound } from "@/lib/sound";
import { useApp } from "@/lib/store";
import { planDef } from "@/lib/utils";

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export function UserProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useClerk();
  const { currentUser, isAdmin } = useApp();
  const ref = useClickOutside(onClose);

  if (!open || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-sm animate-scale-in space-y-4 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={currentUser} size={44} />
            <div>
              <div className="flex items-center gap-1.5 text-base font-bold text-white">
                {currentUser.name}
                {isAdmin && <span className="chip px-1.5 py-0 text-[9px] text-brand">Admin</span>}
              </div>
              <div className="text-xs text-zinc-500">{currentUser.email}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                {planDef(currentUser.subscription.plan).name} plan
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-hover/60"
          >
            <UserRound className="h-4 w-4 text-brand" />
            <span>Profile & Achievements</span>
          </Link>
          <Link
            href="/billing"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-hover/60"
          >
            <CreditCard className="h-4 w-4 text-accent" />
            <span>Billing & Subscription</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl border border-brand/30 bg-brand/10 px-3 py-2.5 text-xs font-bold text-brand transition hover:bg-brand/20"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        <div className="flex justify-end border-t border-line pt-3">
          <button
            onClick={() => {
              playClickSound();
              onClose();
              void signOut({ redirectUrl: "/" });
            }}
            className="btn-ghost border-danger/30 px-3 py-1.5 text-xs text-danger hover:bg-danger/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
