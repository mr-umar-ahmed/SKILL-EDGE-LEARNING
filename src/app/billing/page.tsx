"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Crown,
  Hexagon,
  Infinity as InfinityIcon,
  Loader2,
  Receipt,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { fireBigConfetti } from "@/components/confetti";
import { EmptyState, Modal, PageHeader, SectionTitle, Skeleton, SkeletonCard, StatusPill } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { PlanId } from "@/lib/types";
import { cn, fmtDate, fmtDateTime, fmtInr, fmtNum, isPaidPlan, planDef } from "@/lib/utils";

const PLAN_IDS: PlanId[] = ["FREE", "PRO_MONTHLY", "PRO_YEARLY", "FAMILY"];

type StripeVerifyState = "idle" | "verifying" | "success" | "failed";

export default function BillingPage() {
  const { state, hydrated, currentUser, activatePlan, cancelSubscription } = useApp();

  const [stripeState, setStripeState] = useState<StripeVerifyState>("idle");
  const [cancelOpen, setCancelOpen] = useState(false);
  const stripeHandled = useRef(false);

  /* ---- Stripe return: ?session_id= → verify → activate once ---- */
  useEffect(() => {
    if (!hydrated || !currentUser || stripeHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    stripeHandled.current = true;
    setStripeState("verifying");
    (async () => {
      try {
        const res = await fetch(`/api/payments/stripe/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = (await res.json().catch(() => null)) as
          | { paid?: boolean; planId?: string | null; amountInr?: number | null }
          | null;
        if (res.ok && data?.paid && data.planId && PLAN_IDS.includes(data.planId as PlanId)) {
          activatePlan(data.planId as PlanId, "STRIPE", data.amountInr ?? 0);
          fireBigConfetti();
          setStripeState("success");
        } else {
          setStripeState("failed");
        }
      } catch {
        setStripeState("failed");
      }
      window.history.replaceState({}, "", "/billing");
    })();
  }, [hydrated, currentUser, activatePlan]);

  const myPayments = useMemo(
    () =>
      currentUser
        ? state.payments
            .filter((p) => p.userId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [],
    [state.payments, currentUser]
  );

  const myTopups = useMemo(
    () =>
      currentUser
        ? state.transactions
            .filter((t) => t.userId === currentUser.id && t.type === "PURCHASED")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [],
    [state.transactions, currentUser]
  );

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Skeleton className="h-10 w-1/3" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    );
  }

  const sub = currentUser.subscription;
  const plan = planDef(sub.plan);
  const paid = isPaidPlan(sub);
  const isFree = sub.plan === "FREE";
  const isLifetime = sub.plan === "FOUNDER_LIFETIME";

  const statusChip =
    sub.status === "ACTIVE"
      ? { cls: "border-success/40 bg-success/10 text-success", label: "Active" }
      : sub.status === "CANCELLED"
        ? { cls: "border-warning/40 bg-warning/10 text-warning", label: "Cancelled" }
        : { cls: "border-danger/40 bg-danger/10 text-danger", label: "Expired" };

  return (
    <AppShell>
      <PageHeader
        icon={<CreditCard className="h-5 w-5" />}
        title="Billing"
        subtitle="Manage your subscription, payments and neuron top-ups."
      />

      <div className="space-y-6">
        {/* Stripe verification banners */}
        {stripeState === "verifying" && (
          <div className="glass flex items-center gap-3 p-4 text-sm text-zinc-300 animate-fade-up">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
            Verifying your Stripe payment…
          </div>
        )}
        {stripeState === "success" && (
          <div className="flex items-center gap-3 rounded-card border border-success/40 bg-success/10 p-4 text-sm text-success animate-fade-up">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Payment confirmed — your plan is now active. Welcome to the full Skill OS!
          </div>
        )}
        {stripeState === "failed" && (
          <div className="flex items-center gap-3 rounded-card border border-danger/40 bg-danger/10 p-4 text-sm text-danger animate-fade-up">
            <XCircle className="h-5 w-5 shrink-0" />
            We couldn&apos;t confirm that payment. If you were charged, contact support with your session details.
          </div>
        )}

        {/* Current plan */}
        <section className="card-glow relative overflow-hidden p-6 animate-fade-up">
          <div
            className={cn(
              "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl",
              isFree ? "bg-brand" : isLifetime ? "bg-premium" : "bg-brand"
            )}
          />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl",
                  isLifetime ? "bg-premium/15 text-premium" : "bg-brand/15 text-brand"
                )}
              >
                {isLifetime ? <Crown className="h-6 w-6" /> : <Hexagon className="h-6 w-6" strokeWidth={2.5} />}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-white">{plan.name}</h2>
                  <span className={cn("chip px-2.5 py-0.5 text-[10px]", statusChip.cls)}>{statusChip.label}</span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-400">{plan.tagline}</p>
              </div>
            </div>
            {isFree ? (
              <Link href="/pricing" className="btn-premium">
                <Sparkles className="h-4 w-4" /> Upgrade to Pro
              </Link>
            ) : paid && sub.status === "ACTIVE" ? (
              <button onClick={() => setCancelOpen(true)} className="btn-ghost text-danger hover:border-danger/50">
                Cancel subscription
              </button>
            ) : (
              <Link href="/pricing" className="btn-primary">
                Renew plan <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-base p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" /> Started
              </div>
              <div className="mt-1 text-sm font-semibold text-white">{fmtDate(sub.startedAt)}</div>
            </div>
            <div className="rounded-xl border border-line bg-base p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {sub.expiresAt ? <CalendarDays className="h-3.5 w-3.5" /> : <InfinityIcon className="h-3.5 w-3.5" />}
                {sub.expiresAt ? "Renews / expires" : "Valid until"}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                {sub.expiresAt ? fmtDate(sub.expiresAt) : isFree ? "Forever (free)" : "Lifetime"}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-base p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <Receipt className="h-3.5 w-3.5" /> Price
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                {plan.priceInr === 0 ? "₹0" : fmtInr(plan.priceInr)}
                <span className="ml-1 text-xs font-normal text-zinc-500">
                  {plan.period === "month" ? "/mo" : plan.period === "year" ? "/yr" : plan.period === "lifetime" ? "once" : ""}
                </span>
              </div>
            </div>
          </div>

          {sub.status === "CANCELLED" && sub.expiresAt && (
            <p className="mt-4 flex items-center gap-2 text-xs text-warning">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Your plan is cancelled but you keep full access until {fmtDate(sub.expiresAt)}.
            </p>
          )}
        </section>

        {/* Payment history */}
        <section className="animate-fade-up">
          <SectionTitle>Payment history</SectionTitle>
          {myPayments.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-8 w-8" />}
              title="No payments yet"
              text="Plan purchases made via UPI, Razorpay or Stripe will show up here."
              action={
                <Link href="/pricing" className="btn-primary px-4 py-2 text-xs">
                  View plans <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
          ) : (
            <div className="clay-card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Date</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Item</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Method</th>
                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Amount
                    </th>
                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myPayments.map((p) => (
                    <tr key={p.id} className="border-b border-line/50 last:border-0">
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-zinc-400">{fmtDateTime(p.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-semibold text-white">
                          {p.purpose === "PLAN" && p.planId ? `${planDef(p.planId).name} plan` : `Neuron top-up`}
                        </div>
                        {p.couponCode && <div className="text-[10px] text-success">Coupon: {p.couponCode}</div>}
                        {p.utrNumber && <div className="font-mono text-[10px] text-zinc-500">UTR {p.utrNumber}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="chip px-2 py-0.5 text-[10px]">{p.method}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-bold text-white">
                        {fmtInr(p.amountInr)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusPill status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Neuron top-up history */}
        <section className="animate-fade-up">
          <SectionTitle>Neuron top-ups</SectionTitle>
          {myTopups.length === 0 ? (
            <EmptyState
              icon={<Hexagon className="h-8 w-8" />}
              title="No top-ups yet"
              text="When you buy Neurons from your wallet, the purchases appear here."
              action={
                <Link href="/wallet" className="btn-ghost px-4 py-2 text-xs">
                  Open wallet <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
          ) : (
            <div className="clay-card divide-y divide-line/50">
              {myTopups.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Hexagon className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        +{fmtNum(t.amountNeurons)} Neurons
                        {t.amountInr != null && <span className="ml-1.5 text-zinc-500">· {fmtInr(t.amountInr)}</span>}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {fmtDateTime(t.createdAt)}
                        {t.utrNumber && <span className="ml-1.5 font-mono">UTR {t.utrNumber}</span>}
                      </div>
                    </div>
                  </div>
                  <StatusPill status={t.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Cancel confirmation */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel subscription?">
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            You&apos;ll keep full <span className="font-semibold text-white">{plan.name}</span> access until{" "}
            <span className="font-semibold text-white">{sub.expiresAt ? fmtDate(sub.expiresAt) : "the end of your term"}</span>
            . After that, your account moves to the Free plan — your portfolio, certificates and progress stay safe.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <button
              onClick={() => {
                cancelSubscription();
                setCancelOpen(false);
              }}
              className="btn-danger flex-1"
            >
              Yes, cancel my plan
            </button>
            <button onClick={() => setCancelOpen(false)} className="btn-ghost flex-1">
              Keep my plan
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
