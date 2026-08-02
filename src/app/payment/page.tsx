"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Coins,
  ImageUp,
  QrCode,
  ShieldQuestion,
  Wallet2,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { UpiQr } from "@/components/UpiQr";
import { Modal, SectionTitle, StatCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import { INR_TO_COINS, cn, fmtCoins, fmtNum, timeAgo } from "@/lib/utils";
import type { TxnStatus } from "@/lib/types";

const PACKS = [
  { inr: 50, tag: "Starter" },
  { inr: 100, tag: "Popular" },
  { inr: 250, tag: "Builder" },
  { inr: 500, tag: "Whale" },
];

const STATUS_UI: Record<TxnStatus, { icon: React.ReactNode; cls: string; label: string }> = {
  APPROVED: { icon: <BadgeCheck className="h-3.5 w-3.5" />, cls: "border-emerald-400/40 text-emerald-300 font-mono", label: "Approved" },
  PENDING: { icon: <Clock className="h-3.5 w-3.5" />, cls: "border-amber-400/40 text-amber-300 font-mono", label: "Pending" },
  REJECTED: { icon: <XCircle className="h-3.5 w-3.5" />, cls: "border-rose-400/40 text-rose-300 font-mono", label: "Rejected" },
};

export default function PaymentPage() {
  const { state, currentUser, requestCoinPurchase } = useApp();
  const [buyOpen, setBuyOpen] = useState(false);
  const [amountInr, setAmountInr] = useState(100);
  const [utr, setUtr] = useState("");
  const [proofName, setProofName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myTxns = useMemo(
    () => state.transactions.filter((t) => t.userId === currentUser.id),
    [state.transactions, currentUser.id]
  );
  const earned = myTxns
    .filter((t) => t.status === "APPROVED" && t.amountCoins > 0 && (t.type === "EARNED" || t.type === "PRIZE"))
    .reduce((a, t) => a + t.amountCoins, 0);
  const spent = myTxns
    .filter((t) => t.status === "APPROVED" && t.amountCoins < 0)
    .reduce((a, t) => a - t.amountCoins, 0);
  const pending = myTxns.filter((t) => t.status === "PENDING");

  const coins = Math.round(amountInr * INR_TO_COINS);

  const submit = () => {
    setError(null);
    if (!/^\d{10,16}$/.test(utr.trim())) {
      setError("Enter a valid UPI UTR / Transaction ID (10-16 digits).");
      return;
    }
    if (amountInr < 10) {
      setError("Minimum top-up is ₹10.");
      return;
    }
    requestCoinPurchase(amountInr, utr.trim(), proofName ?? undefined);
    setSubmitted(true);
  };

  const closeBuy = () => {
    setBuyOpen(false);
    setSubmitted(false);
    setUtr("");
    setProofName(null);
    setError(null);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold text-white sm:text-3xl">EdgeCoin Wallet</h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">10 INR = 20 ↁ · 1 EdgeCoin = ₹0.50</p>
          </div>
          <button onClick={() => setBuyOpen(true)} className="btn-gold text-xs sm:text-sm">
            <QrCode className="h-4 w-4" /> Buy EdgeCoins
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Balance"
            value={<span className="text-amber-300">{fmtCoins(currentUser.edgeCoins)}</span>}
            sub={`≈ ₹${fmtNum(Math.round(currentUser.edgeCoins / INR_TO_COINS))}`}
            icon={<Wallet2 className="h-4 w-4" strokeWidth={1.75} />}
            accent="#eab308"
          />
          <StatCard label="Earned" value={`+${fmtNum(earned)}`} sub="missions & prizes" icon={<ArrowDownLeft className="h-4 w-4" strokeWidth={1.75} />} accent="#10b981" />
          <StatCard label="Spent" value={`-${fmtNum(spent)}`} sub="courses & entries" icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />} accent="#f43f5e" />
          <StatCard label="Pending" value={pending.length} sub="awaiting admin review" icon={<Clock className="h-4 w-4" strokeWidth={1.75} />} accent="#f59e0b" />
        </div>

        <div className="clay-card p-4 sm:p-6">
          <SectionTitle>Transaction Ledger</SectionTitle>
          <div className="divide-y divide-white/[0.05]">
            {myTxns.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-500">No transactions yet. Complete a mission to earn your first ↁ!</div>
            )}
            {myTxns.map((t) => {
              const st = STATUS_UI[t.status];
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold",
                        t.amountCoins >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      )}
                    >
                      {t.amountCoins >= 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-white">{t.note}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 font-mono">
                        <span>{t.type}</span>
                        {t.utrNumber && <span>UTR {t.utrNumber}</span>}
                        <span suppressHydrationWarning>{timeAgo(t.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={cn(
                        "font-mono text-sm font-bold",
                        t.amountCoins >= 0 ? "text-amber-300" : "text-rose-400"
                      )}
                    >
                      {t.amountCoins >= 0 ? "+" : ""}
                      {fmtNum(t.amountCoins)}ↁ
                    </div>
                    <span className={cn("chip mt-1 text-[10px]", st.cls)}>
                      {st.icon} {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal open={buyOpen} onClose={closeBuy} title={submitted ? "Payment Submitted" : "💰 Buy EdgeCoins via UPI"}>
        {!submitted ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PACKS.map((p) => (
                <button
                  key={p.inr}
                  onClick={() => setAmountInr(p.inr)}
                  className={cn(
                    "neo-button p-2.5 text-center transition",
                    amountInr === p.inr
                      ? "border-amber-400/60 bg-amber-500/15"
                      : "text-zinc-300"
                  )}
                >
                  <div className="font-mono text-sm font-bold text-white">₹{p.inr}</div>
                  <div className="font-mono text-[11px] text-amber-300 font-bold">ↁ{p.inr * INR_TO_COINS}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-400">{p.tag}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                value={amountInr}
                onChange={(e) => setAmountInr(Math.max(0, Number(e.target.value)))}
                className="input-dark flex-1 font-mono"
                placeholder="Custom amount (₹)"
              />
              <div className="chip border-amber-400/40 font-mono text-sm sm:text-base text-amber-300 shrink-0">
                <Coins className="h-4 w-4" /> ↁ{fmtNum(coins)}
              </div>
            </div>

            <div className="clay-card flex flex-col items-center gap-3 p-4">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                Scan & pay with any UPI app
              </div>
              <UpiQr seed={`skilledge@upi|${amountInr}`} />
              <div className="font-mono text-sm text-white font-bold">
                skilledge@upi · <span className="text-amber-300">₹{fmtNum(amountInr)}</span>
              </div>
              <div className="text-center text-[11px] text-zinc-400">
                Pay ₹{fmtNum(amountInr)}, then paste the UTR / Transaction ID from your UPI app below.
              </div>
            </div>

            <input
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="input-dark font-mono"
              placeholder="UTR / Transaction ID (e.g. 417223981102)"
              inputMode="numeric"
            />

            <label className="neo-button flex cursor-pointer items-center gap-3 p-3.5 text-xs text-zinc-300 transition hover:text-white">
              <ImageUp className="h-5 w-5 text-amber-400" />
              {proofName ? (
                <span className="truncate text-white font-semibold">📎 {proofName}</span>
              ) : (
                "Attach payment screenshot (optional)"
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProofName(e.target.files?.[0]?.name ?? null)}
              />
            </label>

            {error && <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</div>}

            <button onClick={submit} className="btn-gold w-full text-xs sm:text-sm" disabled={amountInr < 10}>
              Submit for verification → ↁ{fmtNum(coins)}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <ShieldQuestion className="mx-auto h-14 w-14 text-amber-400" />
            <div className="mt-3 font-mono text-lg font-bold text-white">Pending Verification</div>
            <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Your payment of <span className="font-mono text-amber-300 font-bold">₹{fmtNum(amountInr)}</span> is queued for admin
              review. <span className="font-mono text-amber-300 font-bold">ↁ{fmtNum(coins)}</span> will land in your wallet with an
              instant notification once approved.
            </p>
            <button onClick={closeBuy} className="btn-primary mt-5 w-full text-xs sm:text-sm">
              Got it
            </button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
