"use client";

import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { playClickSound } from "@/lib/sound";

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
  const router = useRouter();
  const { currentUser, isAdmin, logout } = useApp();
  const ref = useClickOutside(onClose);

  if (!open || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-sm p-6 space-y-4 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <div className="font-bold text-base text-white flex items-center gap-1.5">
                {currentUser.name}
                {isAdmin && (
                  <span className="chip border-amber-400/40 bg-amber-500/20 text-amber-300 font-mono text-[9px] py-0 px-1.5">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-mono">{currentUser.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white px-2 py-1">✕</button>
        </div>

        <div className="space-y-1">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2.5">
              <UserRound className="h-4 w-4 text-amber-400" />
              <span>Identity & Profile Settings</span>
            </div>
            <span className="font-mono text-zinc-500">→</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Admin Command Center</span>
              </div>
              <span className="font-mono text-amber-400">→</span>
            </Link>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              logout();
              playClickSound();
              onClose();
              router.push("/login");
            }}
            className="btn-ghost text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border-rose-500/30"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
