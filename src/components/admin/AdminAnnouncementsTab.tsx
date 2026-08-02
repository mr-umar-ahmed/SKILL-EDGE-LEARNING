"use client";

import { Bell, Megaphone } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { playVictorySound } from "@/lib/sound";

export function AdminAnnouncementsTab() {
  const { state, adminBroadcastNotification } = useApp();
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState<string>("ALL");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = () => {
    if (!message.trim()) return;
    adminBroadcastNotification(
      message.trim(),
      targetUserId === "ALL" ? undefined : targetUserId
    );
    playVictorySound();
    setMessage("");
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Bell className="h-5 w-5 text-cyan-400" /> Broadcast System Announcement
        </h3>
        <p className="text-xs text-zinc-400">
          Dispatch instant notifications to all active students or target a specific user.
        </p>

        {sentSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs font-bold text-emerald-300">
            ✓ Broadcast notification dispatched successfully!
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-zinc-400 font-semibold">Target Recipient</label>
          <select
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="input-dark font-mono text-xs"
          >
            <option value="ALL" className="bg-zinc-900">🌐 All Students & Admins (Broadcast)</option>
            {state.users.map((u) => (
              <option key={u.id} value={u.id} className="bg-zinc-900">
                👤 {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-400 font-semibold">Announcement Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-dark"
            placeholder="e.g. 🎉 Double XP Weekend is now active! Complete any assessment for 2x XP."
          />
        </div>

        <button onClick={handleBroadcast} className="btn-primary w-full py-3 text-xs font-bold shadow-lg">
          <Megaphone className="h-4 w-4" /> Send Announcement Notification
        </button>
      </div>
    </div>
  );
}
