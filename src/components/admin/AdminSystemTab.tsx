"use client";

import React, { useState } from "react";
import { Download, HardDrive, RefreshCw, ShieldAlert, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { EmptyState, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";

export function AdminSystemTab() {
  const { state, exportDatabase, importDatabase, adminPurgeUserbase, resetAllData } = useApp();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportDatabase();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skilledge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importDatabase(String(reader.result));
      if (res.ok) {
        setImportStatus("Database restored successfully!");
      } else {
        setImportStatus(`Restore failed: ${res.reason}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="clay-card p-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Super Admin Account</div>
          <div className="text-sm font-bold text-brand">learningskilledge@gmail.com</div>
          <div className="text-[11px] text-zinc-400">Full platform controls enabled</div>
        </div>
        <div className="clay-card p-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Registered Users</div>
          <div className="text-xl font-bold text-white">{state.users.length}</div>
          <div className="text-[11px] text-zinc-400">{state.users.filter((u) => u.role === "ADMIN").length} Admins</div>
        </div>
        <div className="clay-card p-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Catalog Skills</div>
          <div className="text-xl font-bold text-white">{state.catalog.length}</div>
          <div className="text-[11px] text-zinc-400">
            {state.catalog.reduce((acc, s) => acc + s.missions.length, 0)} Total Missions
          </div>
        </div>
        <div className="clay-card p-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Submissions Processed</div>
          <div className="text-xl font-bold text-white">{state.submissions.length}</div>
          <div className="text-[11px] text-zinc-400">{state.certificates.length} Certificates Issued</div>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="clay-card p-5 space-y-4">
        <SectionTitle>Database Backup & Restore</SectionTitle>
        <p className="text-xs leading-relaxed text-zinc-400">
          Export your entire platform database (users, submissions, progress, catalog, certificates) as a JSON file, or restore from a previous backup.
        </p>

        {importStatus && (
          <div className="rounded-xl border border-brand/40 bg-brand/10 p-3 text-xs font-bold text-brand">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-primary">
            <Download className="h-4 w-4" /> Export Backup (JSON)
          </button>
          <label className="btn-ghost cursor-pointer">
            <UploadCloud className="h-4 w-4 text-brand" /> Restore Backup (JSON)
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Platform Reset Controls */}
      <div className="clay-card border-danger/30 p-5 space-y-4">
        <div className="flex items-center gap-2 text-danger font-bold">
          <ShieldAlert className="h-5 w-5" />
          <span>System Reset & User Base Purge</span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">
          Reset student accounts to start completely fresh. Your catalog, skills, and admin access for{" "}
          <strong className="text-white">learningskilledge@gmail.com</strong> will be preserved.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => {
              if (confirm("Clear all student profiles and reset the user base? Only Admin accounts will remain.")) {
                adminPurgeUserbase();
                alert("User base cleared! Application is ready for new students.");
              }
            }}
            className="btn-ghost border-danger/50 text-danger font-bold text-xs"
          >
            Clear User Base & Start Fresh
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all platform data to initial seed state? This cannot be undone.")) {
                resetAllData();
                alert("Platform reset to clean seed state.");
              }
            }}
            className="btn-danger text-xs"
          >
            Reset Platform to Factory Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
