"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  Flame,
  Hexagon,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { UpiQr } from "@/components/UpiQr";
import { AnimatedNumber, EmptyState, PageHeader, SectionTitle, Skeleton, SkeletonCard, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { TxnType } from "@/lib/types";
import { INR_TO_NEURONS, cn, fmtInr, fmtNum, timeAgo } from "@/lib/utils";

const TOPUP_PRESETS = [49, 99, 199, 499];

const TXN_META: Record<TxnType, { Icon: LucideIcon; color: string; bg: string }> = {
  EARNED: { Icon: Zap, color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  PURCHASED: { Icon: CreditCard, color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
  SPENT_COURSE: { Icon: BookOpen, color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  SPENT_QUIZ: { Icon: Swords, color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  ADMIN_GRANT: { Icon: ShieldCheck, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  PRIZE: { Icon: Trophy, color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  STREAK: { Icon: Flame, color: "#FACC15", bg: "rgba(250,204,21,0.12)" },
  CHALLENGE: { Icon: Target, color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
};

export default function WalletPage() {
  const { state, hydrated, currentUser, requestNeuronPurchase } = useApp();

  const [selectedInr, setSelectedInr] = useState<number | null>(null);
  const [utr, setUtr] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const myTxns = useMemo(
    () =>
      currentUser
        ? state.transactions
            .filter((t) => t.userId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [],
    [state.transactions, currentUser]
  );

  const pendingTopups = useMemo(
    () => myTxns.filter((t) => t.type === "PURCHASED" && t.status === "PENDING"),
    [myTxns]
  );

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </AppShell>
    );
  }

  const submitTopup = () => {
    if (!selectedInr || utr.trim().length < 8) return;
    requestNeuronPurchase(selectedInr, utr.trim());
    setUtr("");
    setSelectedInr(null);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 6000);
  };

  return (
    <AppShell>
      <PageHeader
        icon={<Wallet className="h-5 w-5" />}
        title="Neuron Wallet"
        subtitle="Your in-app currency — earn it by building, spend it on tournaments and more."
      />

      <div className="space-y-6">
        {/* Balance hero */}
        <section className="card-glow relative overflow-hidden p-6 animate-fade-up sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent opacity-15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-brand opacity-10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/25 to-brand/25 text-accent">
                <Hexagon className="h-8 w-8 fill-accent/20" strokeWidth={2} />
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Current balance</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-white sm:text-5xl">
                    <AnimatedNumber value={currentUser.neurons} />
                  </span>
                  <span className="text-sm font-semibold text-accent">Neurons</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-base/60 px-4 py-3 text-xs text-zinc-400">
              <span className="font-semibold text-white">₹10 = {10 * INR_TO_NEURONS} Neurons</span> on top-ups
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* What are Neurons */}
          <section className="clay-card p-6 animate-fade-up">
            <SectionTitle>What are Neurons?</SectionTitle>
            <p className="text-sm leading-relaxed text-zinc-400">
              Neurons are the currency of your learning. You earn them by doing real work — and spend them on
              competitive and premium experiences.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-success">You earn from</div>
                <div className="space-y-2.5">
                  {[
                    { Icon: Rocket, text: "Approved mission projects" },
                    { Icon: Flame, text: "Daily streaks & quests" },
                    { Icon: Trophy, text: "Tournament prizes & challenges" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-accent">You spend on</div>
                <div className="space-y-2.5">
                  {[
                    { Icon: Swords, text: "Tournament entry fees" },
                    { Icon: ShoppingBag, text: "Marketplace & cosmetics (coming soon)" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Buy Neurons */}
          <section className="clay-card p-6 animate-fade-up">
            <SectionTitle
              action={
                <span className="chip border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                  UPI · manual verify
                </span>
              }
            >
              Buy Neurons
            </SectionTitle>

            {justSubmitted && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-success/40 bg-success/10 p-3 text-xs text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Payment submitted! Neurons will be credited once we verify the UTR.
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TOPUP_PRESETS.map((inr) => (
                <button
                  key={inr}
                  type="button"
                  onClick={() => setSelectedInr(selectedInr === inr ? null : inr)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-3 transition",
                    selectedInr === inr
                      ? "border-accent bg-accent/10 shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                      : "border-line bg-base hover:border-accent/40 hover:bg-hover"
                  )}
                >
                  <span className="font-display text-base font-bold text-white">{fmtInr(inr)}</span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                    <Hexagon className="h-3 w-3 fill-accent/20" strokeWidth={2.5} />
                    {fmtNum(inr * INR_TO_NEURONS)}
                  </span>
                </button>
              ))}
            </div>

            {selectedInr ? (
              <div className="mt-5 space-y-4 animate-fade-up">
                <UpiQr amountInr={selectedInr} />
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    UTR / Transaction reference number
                  </label>
                  <input
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 415023456789"
                    className="input-dark font-mono"
                  />
                  <p className="mt-1.5 text-[11px] text-zinc-500">
                    Pay {fmtInr(selectedInr)}, then paste the UTR from your UPI app receipt.{" "}
                    <span className="text-accent">{fmtNum(selectedInr * INR_TO_NEURONS)} Neurons</span> are credited
                    after verification.
                  </p>
                </div>
                <button onClick={submitTopup} disabled={utr.trim().length < 8} className="btn-primary w-full">
                  <Sparkles className="h-4 w-4" />
                  Submit {fmtInr(selectedInr)} for verification
                </button>
              </div>
            ) : (
              <p className="mt-4 text-center text-[11px] text-zinc-500">
                Pick an amount to reveal the UPI QR and payment steps.
              </p>
            )}
          </section>
        </div>

        {/* Pending verification */}
        {pendingTopups.length > 0 && (
          <section className="animate-fade-up">
            <SectionTitle>Pending verification</SectionTitle>
            <div className="clay-card divide-y divide-line/50">
              {pendingTopups.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/15 text-warning">
                      <Clock3 className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        +{fmtNum(t.amountNeurons)} Neurons
                        {t.amountInr != null && <span className="ml-1.5 text-zinc-500">· {fmtInr(t.amountInr)}</span>}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {timeAgo(t.createdAt)}
                        {t.utrNumber && <span className="ml-1.5 font-mono">UTR {t.utrNumber}</span>}
                      </div>
                    </div>
                  </div>
                  <StatusPill status={t.status} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transaction ledger */}
        <section className="animate-fade-up">
          <SectionTitle>Transaction history</SectionTitle>
          {myTxns.length === 0 ? (
            <EmptyState
              icon={<Wallet className="h-8 w-8" />}
              title="No transactions yet"
              text="Complete missions, keep your streak alive and join tournaments to start earning Neurons."
              action={
                <Link href="/skills" className="btn-primary px-4 py-2 text-xs">
                  Explore skills <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
          ) : (
            <div className="clay-card divide-y divide-line/50">
              {myTxns.map((t) => {
                const meta = TXN_META[t.type];
                const Icon = meta.Icon;
                const credit = t.amountNeurons >= 0;
                return (
                  <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-white">{t.note}</div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                          {timeAgo(t.createdAt)}
                          {t.status !== "APPROVED" && <StatusPill status={t.status} />}
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-sm font-bold",
                        credit ? "text-success" : "text-danger",
                        t.status === "PENDING" && "opacity-60"
                      )}
                    >
                      {credit ? "+" : "−"}
                      {fmtNum(Math.abs(t.amountNeurons))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
