"use client";

import React, { useState } from "react";
import { Check, Plus, ShieldCheck, UserCheck, Users, X } from "lucide-react";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { FamilyChildProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function FamilyProfileSwitcher({ open, onClose }: Props) {
  const { currentUser, switchFamilyChildProfile, createFamilyChildProfile } = useApp();
  const [newChildName, setNewChildName] = useState("");
  const [adding, setAdding] = useState(false);

  if (!currentUser) return null;

  const isFamily = currentUser.subscription.plan === "FAMILY";
  const familyProfiles = currentUser.familyProfiles ?? [];
  const activeId = currentUser.activeChildId;

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    createFamilyChildProfile(newChildName.trim());
    setNewChildName("");
    setAdding(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Family Plan — Student Profiles">
      <div className="space-y-5 py-2">
        {/* Plan Header Info */}
        <div className="flex items-center justify-between rounded-xl border border-brand/40 bg-brand/10 p-3.5 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <div>
              <div className="font-bold text-white">Family Plan Active</div>
              <div className="text-[11px] text-zinc-400">1 subscription for your entire family (up to 5 child profiles)</div>
            </div>
          </div>
        </div>

        {/* Profile List */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Active Student Profile</div>

          {/* Primary Account */}
          <button
            onClick={() => {
              switchFamilyChildProfile(null);
              onClose();
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border p-3 text-left transition",
              !activeId
                ? "border-brand bg-brand/15 shadow-brand text-white font-bold"
                : "border-line bg-card hover:border-brand/40 hover:bg-hover text-zinc-300"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-sm">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold">{currentUser.name} (Parent / Main)</div>
                <div className="text-[11px] text-zinc-400">{currentUser.xp} XP · {currentUser.neurons} Neurons</div>
              </div>
            </div>
            {!activeId && <Check className="h-4 w-4 text-brand" />}
          </button>

          {/* Children Profiles */}
          {familyProfiles.map((child) => {
            const isSelected = activeId === child.id;
            return (
              <button
                key={child.id}
                onClick={() => {
                  switchFamilyChildProfile(child.id);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3 text-left transition",
                  isSelected
                    ? "border-brand bg-brand/15 shadow-brand text-white font-bold"
                    : "border-line bg-card hover:border-brand/40 hover:bg-hover text-zinc-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-sm">
                    {child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{child.name}</div>
                    <div className="text-[11px] text-zinc-400">
                      {child.xp} XP · {child.neurons} Neurons · {child.completedMissions.length} Missions Completed
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-brand" />}
              </button>
            );
          })}
        </div>

        {/* Add Child Profile Button */}
        {adding ? (
          <div className="rounded-xl border border-line bg-card p-3 space-y-3">
            <div className="text-xs font-semibold text-white">Add Sibling / Child Profile</div>
            <input
              type="text"
              placeholder="e.g. Kabir"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              className="input-dark text-xs"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleAddChild} disabled={!newChildName.trim()} className="btn-primary flex-1 py-1.5 text-xs">
                Save Child Profile
              </button>
              <button onClick={() => setAdding(false)} className="btn-ghost py-1.5 text-xs">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          familyProfiles.length < 5 && (
            <button onClick={() => setAdding(true)} className="btn-ghost w-full py-2.5 text-xs">
              <Plus className="h-4 w-4 text-brand" /> Add Child Profile ({familyProfiles.length}/5)
            </button>
          )
        )}
      </div>
    </Modal>
  );
}
