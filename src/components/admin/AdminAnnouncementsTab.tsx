"use client";

import { BellRing, CheckCircle2, Megaphone, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { EmptyState, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

export function AdminAnnouncementsTab() {
  const { state, adminAnnounce, adminDeleteAnnouncement, adminBroadcastNotification } = useApp();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);

  const [notifMessage, setNotifMessage] = useState("");
  const [notifTarget, setNotifTarget] = useState(""); // "" = all users
  const [notifSent, setNotifSent] = useState(false);

  const publish = () => {
    if (!title.trim() || !body.trim()) return;
    adminAnnounce(title.trim(), body.trim());
    setTitle("");
    setBody("");
    setPublished(true);
    window.setTimeout(() => setPublished(false), 2500);
  };

  const broadcast = () => {
    if (!notifMessage.trim()) return;
    adminBroadcastNotification(notifMessage.trim(), notifTarget || undefined);
    setNotifMessage("");
    setNotifSent(true);
    window.setTimeout(() => setNotifSent(false), 2500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        {/* compose announcement */}
        <div className="clay-card space-y-3.5 p-5">
          <SectionTitle>New announcement</SectionTitle>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title — e.g. New skill launched: UX Writing"
            className="input-dark"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Body — shows on every student's dashboard."
            className="input-dark resize-y"
          />
          <div className="flex items-center gap-3">
            <button onClick={publish} disabled={!title.trim() || !body.trim()} className="btn-primary px-5 py-2.5 text-xs">
              <Megaphone className="h-4 w-4" /> Publish announcement
            </button>
            {published && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" /> Published
              </span>
            )}
          </div>
        </div>

        {/* list */}
        <div>
          <SectionTitle>Published announcements</SectionTitle>
          {state.announcements.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="h-9 w-9" />}
              text="Nothing published yet. Announcements appear on every student's dashboard."
            />
          ) : (
            <div className="space-y-2.5">
              {state.announcements.map((a) => (
                <div key={a.id} className="clay-card flex items-start gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-brand/10 text-brand">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-white">{a.title}</span>
                      <span className="text-[11px] text-zinc-500">{timeAgo(a.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">{a.body}</p>
                  </div>
                  <button
                    onClick={() => adminDeleteAnnouncement(a.id)}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-hover hover:text-danger"
                    title="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* broadcast notification */}
      <div className="lg:col-span-2">
        <div className="clay-card space-y-3.5 p-5">
          <SectionTitle>Push a notification</SectionTitle>
          <p className="text-xs leading-relaxed text-zinc-500">
            Sends an in-app notification to every user, or a single user — it lands in their bell menu instantly.
          </p>
          <textarea
            value={notifMessage}
            onChange={(e) => setNotifMessage(e.target.value)}
            rows={3}
            placeholder="Message — e.g. Weekend tournament starts Saturday 6 PM!"
            className="input-dark resize-y"
          />
          <select value={notifTarget} onChange={(e) => setNotifTarget(e.target.value)} className="input-dark">
            <option value="">All users ({state.users.length})</option>
            {state.users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <button onClick={broadcast} disabled={!notifMessage.trim()} className="btn-primary px-5 py-2.5 text-xs">
              <Send className="h-4 w-4" /> Send notification
            </button>
            {notifSent && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <BellRing className="h-4 w-4" /> Sent
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
