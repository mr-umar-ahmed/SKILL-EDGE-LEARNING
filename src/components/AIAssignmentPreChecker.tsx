"use client";

import React, { useMemo } from "react";
import { AlertCircle, CheckCircle2, Cpu, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { SubmissionLink } from "@/lib/types";

interface Props {
  note: string;
  links: SubmissionLink[];
  checklistItems: string[];
  completedChecklistIndices: number[];
}

export function AIAssignmentPreChecker({ note, links, checklistItems, completedChecklistIndices }: Props) {
  const analysis = useMemo(() => {
    const issues: string[] = [];
    const wins: string[] = [];

    // 1. Link check
    if (links.length === 0) {
      issues.push("No project link attached. Add a GitHub, Figma, Canva, or Drive link.");
    } else {
      const validUrls = links.filter((l) => l.url.trim().startsWith("http://") || l.url.trim().startsWith("https://"));
      if (validUrls.length < links.length) {
        issues.push("Some links are missing http:// or https:// prefix.");
      } else {
        wins.push(`${links.length} valid project deliverables attached.`);
      }
    }

    // 2. Writeup check
    const words = note.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) {
      issues.push("Writeup is too brief. Add 2-3 sentences explaining what you built.");
    } else {
      wins.push(`Clear project description provided (${words} words).`);
    }

    // 3. Checklist check
    const totalChecklist = checklistItems.length;
    const doneChecklist = completedChecklistIndices.length;
    if (totalChecklist > 0) {
      if (doneChecklist < totalChecklist) {
        issues.push(`Checklist incomplete (${doneChecklist}/${totalChecklist} steps completed).`);
      } else {
        wins.push("All project checklist requirements completed!");
      }
    }

    const maxPoints = (links.length ? 35 : 0) + (words >= 10 ? 35 : 15) + (totalChecklist ? (doneChecklist / totalChecklist) * 30 : 30);
    const score = Math.round(Math.min(100, maxPoints));

    return {
      score,
      issues,
      wins,
      isReady: issues.length === 0 && score >= 80,
    };
  }, [note, links, checklistItems, completedChecklistIndices]);

  return (
    <div className="rounded-2xl border border-brand/40 bg-surface/90 p-4 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
          <Cpu className="h-4 w-4 text-brand animate-pulse" />
          <span>ARIA Neural Pre-Flight Checker</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span>Score: {analysis.score}%</span>
        </div>
      </div>

      {/* Wins & Recommendations */}
      <div className="space-y-1.5">
        {analysis.wins.map((win, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{win}</span>
          </div>
        ))}
        {analysis.issues.map((issue, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-warning">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{issue}</span>
          </div>
        ))}
      </div>

      {analysis.isReady && (
        <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-2.5 text-xs font-bold text-success">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Pre-flight passed! You will earn +10 Bonus XP on submission.</span>
        </div>
      )}
    </div>
  );
}
