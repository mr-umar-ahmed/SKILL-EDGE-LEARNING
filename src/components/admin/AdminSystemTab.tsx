"use client";

import { Download, RefreshCw, Upload } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { playVictorySound } from "@/lib/sound";

export function AdminSystemTab() {
  const { state, importDatabase, resetDemoData } = useApp();
  const [jsonText, setJsonText] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skilledge-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playVictorySound();
  };

  const handleImport = () => {
    if (!jsonText.trim()) return;
    const res = importDatabase(jsonText.trim());
    if (res.ok) {
      playVictorySound();
      setImportStatus({ ok: true, msg: "Database state restored successfully!" });
      setJsonText("");
    } else {
      setImportStatus({ ok: false, msg: res.reason || "Failed to parse JSON backup." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Export */}
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Download className="h-5 w-5 text-cyan-400" /> Export Database Backup
        </h3>
        <p className="text-xs text-zinc-400">
          Download a complete JSON snapshot of all users, level overrides, transactions, quizzes, and certificates.
        </p>
        <button onClick={handleExport} className="btn-primary w-full py-2.5 text-xs font-bold shadow-lg">
          <Download className="h-4 w-4" /> Download JSON Backup
        </button>
      </div>

      {/* Import */}
      <div className="glass p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <Upload className="h-5 w-5 text-amber-400" /> Restore Database Backup
        </h3>
        <p className="text-xs text-zinc-400">
          Paste a valid Skill Edge OS JSON backup payload below to restore state.
        </p>

        {importStatus && (
          <div
            className={cn(
              "rounded-xl border p-3 font-mono text-xs font-bold",
              importStatus.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            )}
          >
            {importStatus.msg}
          </div>
        )}

        <textarea
          rows={4}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="input-dark font-mono text-xs"
          placeholder='{"version": 1, "users": [...]}'
        />
        <button onClick={handleImport} className="btn-gold w-full py-2.5 text-xs font-bold shadow-lg">
          <Upload className="h-4 w-4" /> Restore JSON Database
        </button>
      </div>

      {/* Factory Reset */}
      <div className="glass border-rose-500/30 p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-rose-400">
          <RefreshCw className="h-5 w-5 text-rose-400" /> Factory Reset Seed Data
        </h3>
        <p className="text-xs text-zinc-400">
          Wipe all local storage mutations and reset the platform back to pristine seed data.
        </p>
        <button onClick={() => setResetConfirmOpen(true)} className="btn-ghost w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10 py-2.5 text-xs font-bold">
          Factory Reset State
        </button>
      </div>

      <Modal open={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} title="⚠️ Confirm Factory Reset">
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-300">
            Are you sure you want to reset all mock store data back to default seeds? This action will clear custom updates.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setResetConfirmOpen(false)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setResetConfirmOpen(false);
              }}
              className="btn-primary flex-1 !bg-rose-600 hover:!bg-rose-500 text-xs font-bold"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
