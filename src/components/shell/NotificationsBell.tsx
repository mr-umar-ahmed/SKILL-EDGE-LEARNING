"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

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

export function NotificationsBell() {
  const { state, currentUser, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  if (!currentUser) return null;

  const mine = state.notifications.filter((n) => n.userId === currentUser.id).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread > 0) markNotificationsRead();
        }}
        className="header-chip-btn relative p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[10px] font-bold text-white shadow-md">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-50 mt-2 w-80 max-w-[85vw] p-2 shadow-2xl">
          <div className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {mine.length === 0 && <div className="px-2 py-6 text-center text-xs text-zinc-400">All quiet for now.</div>}
            {mine.map((n) => (
              <div key={n.id} className="rounded-xl px-2 py-2 text-xs text-zinc-200 hover:bg-white/[0.04]">
                <div>{n.message}</div>
                <div suppressHydrationWarning className="mt-0.5 text-[10px] text-zinc-400">{timeAgo(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
