"use client";

import React, { useState } from "react";
import { Award, BookOpen, CheckCircle2, Cpu, HelpCircle, Hexagon, Play, ShieldCheck, Sparkles, UploadCloud, Users, Zap } from "lucide-react";
import { Modal } from "@/components/ui";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function UserGuideModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"loop" | "family" | "certs" | "neurons" | "ai">("loop");

  return (
    <Modal open={open} onClose={onClose} wide title="Skill Edge Learning — Complete Platform User Guide">
      <div className="space-y-5 py-2">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-line pb-3 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => setActiveTab("loop")}
            className={activeTab === "loop" ? "text-brand font-bold border-b-2 border-brand pb-1" : "hover:text-white pb-1"}
          >
            The 5-Step Loop
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={activeTab === "ai" ? "text-brand font-bold border-b-2 border-brand pb-1" : "hover:text-white pb-1"}
          >
            ARIA AI Pre-Flight
          </button>
          <button
            onClick={() => setActiveTab("family")}
            className={activeTab === "family" ? "text-brand font-bold border-b-2 border-brand pb-1" : "hover:text-white pb-1"}
          >
            Family Plan & Profiles
          </button>
          <button
            onClick={() => setActiveTab("certs")}
            className={activeTab === "certs" ? "text-brand font-bold border-b-2 border-brand pb-1" : "hover:text-white pb-1"}
          >
            Certificates & Badges
          </button>
          <button
            onClick={() => setActiveTab("neurons")}
            className={activeTab === "neurons" ? "text-brand font-bold border-b-2 border-brand pb-1" : "hover:text-white pb-1"}
          >
            Neuron Economy & XP
          </button>
        </div>

        {/* Tab 1: The 5-Step Loop */}
        {activeTab === "loop" && (
          <div className="space-y-4 text-xs text-zinc-300">
            <div className="rounded-xl border border-brand/40 bg-brand/10 p-3 text-brand font-bold">
              Skill Edge Learning is a skill operating system, not a passive video course site.
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand font-bold">1</div>
                <div>
                  <div className="font-bold text-white">Select a High-Income Skill Track</div>
                  <p className="text-zinc-400">Browse 12 catalog skills. Each skill shows exact build capabilities and target role outcomes.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand font-bold">2</div>
                <div>
                  <div className="font-bold text-white">Follow the Duolingo Mission Roadmap</div>
                  <p className="text-zinc-400">Every skill contains 10 sequential missions. Green checkmark nodes show completed missions, pulsing orange nodes show active work.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand font-bold">3</div>
                <div>
                  <div className="font-bold text-white">Attach Real Deliverable Links</div>
                  <p className="text-zinc-400">Submit GitHub repos, Figma prototypes, Canva decks, Google Drive folders, or live URLs as proof-of-work.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand font-bold">4</div>
                <div>
                  <div className="font-bold text-white">Admin & ARIA Review</div>
                  <p className="text-zinc-400">Instant ARIA AI pre-flight feedback checks link health, followed by expert admin review with custom scores.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand font-bold">5</div>
                <div>
                  <div className="font-bold text-white">Portfolio & Public Verification</div>
                  <p className="text-zinc-400">Approved projects land on your public portfolio with QR-verified certificates & one-click LinkedIn export.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ARIA AI Pre-Flight */}
        {activeTab === "ai" && (
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-brand font-bold">
              <Cpu className="h-5 w-5 shrink-0" />
              <span>ARIA Neural Intelligence Assistant</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              The ARIA AI Pre-Flight Checker provides instant submission suggestions before sending your project to the admin review queue.
            </p>
            <div className="space-y-2 rounded-xl border border-line bg-card p-3">
              <div className="font-bold text-white">What ARIA Pre-Flight checks:</div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Valid URL prefixes (`http://` / `https://`) for GitHub, Figma, Canva, and Drive links.</li>
                <li>Project writeup description depth (recommends 10+ words).</li>
                <li>Completion of mission assignment checklist items.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-line/60 bg-surface/80 p-3 text-[11px] text-zinc-500">
              <span className="font-bold text-white">Future Scope Notice:</span> ARIA Pre-Flight is currently an AI Assistant Simulation preview. Full automated LLM code evaluation and multi-file code review pipeline are in active development.
            </div>
          </div>
        )}

        {/* Tab 3: Family Plan */}
        {activeTab === "family" && (
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-brand font-bold">
              <Users className="h-5 w-5 shrink-0" />
              <span>Family Plan & Multi-Profile Switcher</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              The Family Plan (₹9,999/yr) allows 1 parent subscription to manage up to 5 sibling profiles with individual progress tracking.
            </p>
            <div className="space-y-2 rounded-xl border border-line bg-card p-3">
              <div className="font-bold text-white">How to switch child profiles:</div>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                <li>Click the <strong className="text-white">Family Profile Switcher</strong> button in the top bar navigation.</li>
                <li>Click <strong className="text-white">Add Child Profile</strong> to create a new profile for a sibling.</li>
                <li>Select any child profile to switch active state. All progress, XP, Neurons, and certificates will isolate to that profile.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 4: Certificates */}
        {activeTab === "certs" && (
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-brand font-bold">
              <Award className="h-5 w-5 shrink-0" />
              <span>Certificates & LinkedIn Integration</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Certificates auto-issue at Mission 5 (Phase Completion) and Mission 10 (Skill Completion).
            </p>
            <div className="space-y-2 rounded-xl border border-line bg-card p-3">
              <div className="font-bold text-white">Key Features:</div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Unique Certificate ID (`SE-XXXXX`) and public QR verification URL (`/verify/[code]`).</li>
                <li>One-Click <strong className="text-white">Add to LinkedIn Profile</strong> button pre-filling LinkedIn&apos;s credential portal.</li>
                <li>Printable PDF template (`window.print()`) formatted for high-res downloading.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Neurons & XP */}
        {activeTab === "neurons" && (
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 p-3 text-brand font-bold">
              <Hexagon className="h-5 w-5 shrink-0 text-accent" />
              <span>Neuron Economy & Weekly Tournaments</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Neurons are the native in-app currency earned by completing missions, passes knowledge checks, and winning weekly tournaments.
            </p>
            <div className="space-y-2 rounded-xl border border-line bg-card p-3">
              <div className="font-bold text-white">Earning & Spending:</div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Earn +25 to +50 Neurons per approved mission.</li>
                <li>Earn +15 Neurons on knowledge checks.</li>
                <li>Use Neurons in the Neuron Store or join weekly Neuron Quizzes for prize pools.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
