"use client";

import { BadgePercent, Check, CreditCard, Hexagon, Plus, Ticket, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, SectionTitle, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { PaymentRecord, Transaction } from "@/lib/types";
import { cn, fmtInr, fmtNum, planDef, timeAgo } from "@/lib/utils";

function pendingFirst<T extends { status: string; createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.status === "PENDING" && b.status !== "PENDING") return -1;
    if (a.status !== "PENDING" && b.status === "PENDING") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function AdminPaymentsTab() {
  const {
    state,
    adminResolvePayment,
    adminSetTxnStatus,
    adminUpsertCoupon,
    adminDeleteCoupon,
  } = useApp();

  const [couponCode, setCouponCode] = useState("");
  const [couponPct, setCouponPct] = useState("");
  const [couponError, setCouponError] = useState("");

  const payments = useMemo(() => pendingFirst(state.payments), [state.payments]);
  const topups = useMemo(
    () => pendingFirst(state.transactions.filter((t) => t.type === "PURCHASED")),
    [state.transactions]
  );

  const userName = (id: string) => state.users.find((u) => u.id === id)?.name ?? "Unknown user";

  const addCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const pct = Math.round(Number(couponPct));
    if (!code) {
      setCouponError("Coupon code is required.");
      return;
    }
    if (!pct || pct < 1 || pct > 100) {
      setCouponError("Percent off must be between 1 and 100.");
      return;
    }
    adminUpsertCoupon({ code, percentOff: pct, active: true });
    setCouponCode("");
    setCouponPct("");
    setCouponError("");
  };

  const renderPayment = (p: PaymentRecord) => (
    <div key={p.id} className="clay-card flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-white">{userName(p.userId)}</span>
          <span className="text-[11px] text-zinc-500">{timeAgo(p.createdAt)}</span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">
            {p.purpose === "PLAN" && p.planId ? planDef(p.planId).name : `${fmtNum(p.neurons ?? 0)} Neurons`}
          </span>
          <span className="font-bold text-white">{fmtInr(p.amountInr)}</span>
          <span className="chip px-2 py-0.5 text-[10px]">{p.method}</span>
          {p.utrNumber && <span className="font-mono text-[11px]">UTR: {p.utrNumber}</span>}
          {p.couponCode && (
            <span className="chip px-2 py-0.5 text-[10px]">
              <Ticket className="h-3 w-3" /> {p.couponCode}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StatusPill status={p.status} />
        {p.status === "PENDING" && (
          <>
            <button onClick={() => adminResolvePayment(p.id, "APPROVED")} className="btn-primary px-3 py-1.5 text-xs">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button onClick={() => adminResolvePayment(p.id, "REJECTED")} className="btn-danger px-3 py-1.5 text-xs">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderTopup = (t: Transaction) => (
    <div key={t.id} className="clay-card flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-white">{userName(t.userId)}</span>
          <span className="text-[11px] text-zinc-500">{timeAgo(t.createdAt)}</span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            <Hexagon className="h-3 w-3 fill-accent/20" /> {fmtNum(t.amountNeurons)} Neurons
          </span>
          {t.amountInr != null && <span className="font-bold text-white">{fmtInr(t.amountInr)}</span>}
          {t.utrNumber && <span className="font-mono text-[11px]">UTR: {t.utrNumber}</span>}
          {t.proofImageName && <span className="text-[11px]">Proof: {t.proofImageName}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StatusPill status={t.status} />
        {t.status === "PENDING" && (
          <>
            <button onClick={() => adminSetTxnStatus(t.id, "APPROVED")} className="btn-primary px-3 py-1.5 text-xs">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button onClick={() => adminSetTxnStatus(t.id, "REJECTED")} className="btn-danger px-3 py-1.5 text-xs">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* plan payments */}
      <section>
        <SectionTitle>Plan payments</SectionTitle>
        {payments.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-9 w-9" />}
            text="No plan payments yet. UPI plan purchases land here for verification."
          />
        ) : (
          <div className="space-y-2.5">{payments.map(renderPayment)}</div>
        )}
      </section>

      {/* neuron top-ups */}
      <section>
        <SectionTitle>Neuron top-ups</SectionTitle>
        {topups.length === 0 ? (
          <EmptyState
            icon={<Hexagon className="h-9 w-9" />}
            text="No Neuron top-up requests yet. UPI wallet top-ups appear here for approval."
          />
        ) : (
          <div className="space-y-2.5">{topups.map(renderTopup)}</div>
        )}
      </section>

      {/* coupons */}
      <section>
        <SectionTitle>Coupons</SectionTitle>
        <div className="clay-card space-y-4 p-5">
          <div className="grid gap-2.5 sm:grid-cols-[1fr_150px_auto]">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Code, e.g. LAUNCH20"
              className="input-dark font-mono uppercase"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={couponPct}
              onChange={(e) => setCouponPct(e.target.value)}
              placeholder="% off"
              className="input-dark"
            />
            <button onClick={addCoupon} className="btn-primary px-4 py-2 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add coupon
            </button>
          </div>
          {couponError && <p className="text-xs font-semibold text-danger">{couponError}</p>}

          {state.coupons.length === 0 ? (
            <p className="text-xs text-zinc-500">No coupons yet — add one above to offer discounts at checkout.</p>
          ) : (
            <div className="space-y-2">
              {state.coupons.map((c) => (
                <div
                  key={c.code}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-base/60 p-3"
                >
                  <span className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                    <Ticket className="h-4 w-4 text-accent" /> {c.code}
                  </span>
                  <span className="chip px-2 py-0.5 text-[10px]">
                    <BadgePercent className="h-3 w-3" /> {c.percentOff}% off
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => adminUpsertCoupon({ ...c, active: !c.active })}
                      className={cn(
                        "chip transition",
                        c.active ? "border-success/40 bg-success/10 text-success" : "text-zinc-500"
                      )}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => adminDeleteCoupon(c.code)}
                      className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-hover hover:text-danger"
                      title="Delete coupon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
