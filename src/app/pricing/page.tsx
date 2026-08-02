"use client";

import {
  ArrowRight,
  BadgePercent,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Crown,
  Hexagon,
  Loader2,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { UpiQr } from "@/components/UpiQr";
import { fireBigConfetti } from "@/components/confetti";
import { Modal } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Coupon } from "@/lib/types";
import { PLANS, type PlanDef, cn, fmtInr } from "@/lib/utils";

/* ----------------------------- Razorpay globals ----------------------------- */

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* --------------------------------- helpers --------------------------------- */

function discounted(price: number, coupon: Coupon | null) {
  if (!coupon || price <= 0) return price;
  return Math.round(price * (1 - coupon.percentOff / 100));
}

function periodLabel(p: PlanDef) {
  switch (p.period) {
    case "month":
      return "/month";
    case "year":
      return "/year";
    case "lifetime":
      return "one-time";
    default:
      return "forever";
  }
}

const PLAN_ICONS: Record<string, typeof Zap> = {
  FREE: Rocket,
  PRO_MONTHLY: Zap,
  PRO_YEARLY: TrendingUp,
  FAMILY: ShieldCheck,
};

/* ------------------------------ checkout modal ------------------------------ */

type PayMethod = "UPI" | "RAZORPAY" | "STRIPE";

function CheckoutModal({
  plan,
  coupon,
  onClose,
}: {
  plan: PlanDef;
  coupon: Coupon | null;
  onClose: () => void;
}) {
  const { currentUser, purchasePlanUpi, activatePlan } = useApp();
  const finalAmount = discounted(plan.priceInr, coupon);

  const [method, setMethod] = useState<PayMethod>("UPI");
  const [utr, setUtr] = useState("");
  const [upiSubmitted, setUpiSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const submitUpi = () => {
    if (utr.trim().length < 8) return;
    purchasePlanUpi(plan.id, finalAmount, utr.trim(), coupon?.code);
    setUpiSubmitted(true);
  };

  const startRazorpay = async () => {
    setGatewayError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: finalAmount, planId: plan.id }),
      });
      if (res.status === 503) {
        setGatewayError("Gateway not configured yet — use UPI (manual verify) instead.");
        return;
      }
      if (!res.ok) {
        setGatewayError("Could not create the payment order. Try again, or use UPI.");
        return;
      }
      const order = (await res.json()) as { orderId: string; amount: number; currency: string; keyId: string };
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok || !window.Razorpay) {
        setGatewayError("Could not load Razorpay checkout. Check your connection and retry.");
        return;
      }
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Skill Edge Learning",
        description: `${plan.name} plan`,
        order_id: order.orderId,
        prefill: { name: currentUser?.name, email: currentUser?.email },
        theme: { color: "#3B82F6" },
        handler: async (resp: RazorpayResponse) => {
          try {
            const vr = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              }),
            });
            const data = (await vr.json().catch(() => null)) as { valid?: boolean } | null;
            if (vr.ok && data?.valid) {
              activatePlan(plan.id, "RAZORPAY", finalAmount, {
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                couponCode: coupon?.code,
              });
              fireBigConfetti();
              setPaid(true);
            } else {
              setGatewayError("Payment verification failed. Contact support if you were charged.");
            }
          } catch {
            setGatewayError("Payment verification failed. Contact support if you were charged.");
          }
        },
      });
      rzp.open();
    } catch {
      setGatewayError("Something went wrong starting Razorpay. Try again, or use UPI.");
    } finally {
      setBusy(false);
    }
  };

  const startStripe = async () => {
    setGatewayError(null);
    setBusy(true);
    try {
      const origin = window.location.origin;
      const res = await fetch("/api/payments/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amountInr: finalAmount,
          successUrl: origin + "/billing",
          cancelUrl: origin + "/pricing",
        }),
      });
      if (res.status === 503) {
        setGatewayError("Gateway not configured yet — use UPI (manual verify) instead.");
        setBusy(false);
        return;
      }
      if (!res.ok) {
        setGatewayError("Could not start Stripe checkout. Try again, or use UPI.");
        setBusy(false);
        return;
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      setGatewayError("Something went wrong starting Stripe. Try again, or use UPI.");
      setBusy(false);
    }
  };

  const methods: { id: PayMethod; label: string; sub: string; Icon: typeof Smartphone }[] = [
    { id: "UPI", label: "UPI (manual verify)", sub: "Always available", Icon: Smartphone },
    { id: "RAZORPAY", label: "Razorpay", sub: "UPI · Cards · Netbanking", Icon: Zap },
    { id: "STRIPE", label: "Card (Stripe)", sub: "International cards", Icon: CreditCard },
  ];

  /* success states */
  if (paid) {
    return (
      <Modal open onClose={onClose} title="Payment successful">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div>
            <div className="font-display text-xl font-bold text-white">{plan.name} is active</div>
            <p className="mt-1 text-sm text-zinc-400">
              All missions are unlocked. Time to build something real.
            </p>
          </div>
          <Link href="/dashboard" className="btn-primary w-full">
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Modal>
    );
  }

  if (upiSubmitted) {
    return (
      <Modal open onClose={onClose} title="Payment submitted">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
            <Clock3 className="h-9 w-9" />
          </div>
          <div>
            <div className="font-display text-xl font-bold text-white">We&apos;re verifying your payment</div>
            <p className="mt-1 text-sm text-zinc-400">
              Your {plan.name} plan activates after verification — usually within a few hours. Track the status on your
              billing page.
            </p>
          </div>
          <Link href="/billing" className="btn-primary w-full">
            View billing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={`Checkout — ${plan.name}`}>
      <div className="space-y-4">
        {/* order summary */}
        <div className="flex items-center justify-between rounded-xl border border-line bg-base p-3.5">
          <div>
            <div className="text-sm font-semibold text-white">{plan.name}</div>
            <div className="text-xs text-zinc-500">
              Billed {plan.period === "month" ? "monthly" : plan.period === "year" ? "yearly" : "once"}
              {coupon && (
                <span className="ml-2 inline-flex items-center gap-1 text-success">
                  <BadgePercent className="h-3 w-3" />
                  {coupon.code} · {coupon.percentOff}% off
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {coupon && <div className="text-xs text-zinc-500 line-through">{fmtInr(plan.priceInr)}</div>}
            <div className="font-display text-lg font-bold text-white">{fmtInr(finalAmount)}</div>
          </div>
        </div>

        {/* method picker */}
        <div className="grid gap-2 sm:grid-cols-3">
          {methods.map(({ id, label, sub, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMethod(id);
                setGatewayError(null);
              }}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                method === id
                  ? "border-brand bg-brand/10 shadow-brand"
                  : "border-line bg-card hover:border-brand/40 hover:bg-hover"
              )}
            >
              <Icon className={cn("h-4 w-4", method === id ? "text-brand" : "text-zinc-400")} />
              <span className="text-xs font-semibold text-white">{label}</span>
              <span className="text-[10px] text-zinc-500">{sub}</span>
            </button>
          ))}
        </div>

        {gatewayError && (
          <div className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            {gatewayError}
          </div>
        )}

        {/* method body */}
        {method === "UPI" && (
          <div className="space-y-3">
            <UpiQr amountInr={finalAmount} />
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
                Pay {fmtInr(finalAmount)} via any UPI app, then paste the 12-digit UTR from your payment receipt. Your
                plan activates once we verify it.
              </p>
            </div>
            <button onClick={submitUpi} disabled={utr.trim().length < 8} className="btn-primary w-full">
              Submit for verification
            </button>
          </div>
        )}

        {method === "RAZORPAY" && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Pay securely with UPI, cards, netbanking or wallets via Razorpay. Your plan activates instantly after
              payment.
            </p>
            <button onClick={startRazorpay} disabled={busy} className="btn-primary w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Pay {fmtInr(finalAmount)} with Razorpay
            </button>
          </div>
        )}

        {method === "STRIPE" && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              You&apos;ll be redirected to Stripe&apos;s secure checkout. Your plan activates when you return.
            </p>
            <button onClick={startStripe} disabled={busy} className="btn-primary w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Pay {fmtInr(finalAmount)} with card
            </button>
          </div>
        )}

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payments are processed securely. We never store card details.
        </p>
      </div>
    </Modal>
  );
}

/* ------------------------------ comparison data ------------------------------ */

const COMPARISON: { label: string; free: boolean; pro: boolean }[] = [
  { label: "Missions 1–4 of every skill", free: true, pro: true },
  { label: "Advanced missions 5–10", free: false, pro: true },
  { label: "Project submissions & feedback", free: true, pro: true },
  { label: "Priority review queue", free: false, pro: true },
  { label: "Portfolio with public share link", free: true, pro: true },
  { label: "All certificates + QR verification", free: false, pro: true },
  { label: "Weekly challenges & tournaments", free: true, pro: true },
  { label: "Yearly progress report", free: false, pro: true },
  { label: "Ad-free experience", free: false, pro: true },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How does UPI manual verification work?",
    a: "Scan the QR, pay the exact amount, and submit the UTR number from your payment receipt. Our team verifies it (usually within a few hours) and your plan activates automatically. You can track the status on the billing page.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing page whenever you like — you keep full Pro access until the end of your current billing period. No hidden lock-ins.",
  },
  {
    q: "What exactly do free users get?",
    a: "The first 4 missions of every skill, real project submissions with feedback, basic certificates and community access. Missions 5–10, advanced certificates and the ad-free experience need Pro.",
  },
  {
    q: "How does the Family Plan work?",
    a: "The Family Plan allows parents to purchase one subscription for multiple children/siblings. Each child gets a separate profile with independent progress tracking, individual portfolios, certificates, XP, and Neurons.",
  },
  {
    q: "Do you offer refunds?",
    a: "If something went wrong with a payment (double charge, plan not activating), contact support and we'll sort it out. For change-of-mind on monthly plans, simply cancel and the plan won't renew.",
  },
];

/* ---------------------------------- page ---------------------------------- */

export default function PricingPage() {
  const { hydrated, currentUser, isAuthenticated, validateCoupon } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanDef | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentPlanId = currentUser?.subscription.plan;

  const applyCoupon = () => {
    const code = couponInput.trim();
    if (!code) return;
    const found = validateCoupon(code);
    if (found) {
      setCoupon(found);
      setCouponError(null);
    } else {
      setCoupon(null);
      setCouponError("That code isn't valid or has expired.");
    }
  };

  return (
    <AppShell>
      <div className="min-h-dvh w-full">
        {/* slim public header */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-bold text-white">Skill Edge Learning</span>
          </Link>
          {hydrated && isAuthenticated ? (
            <Link href="/dashboard" className="btn-ghost px-4 py-2 text-xs">
              Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost px-4 py-2 text-xs">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-xs">
                Get started
              </Link>
            </div>
          )}
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          {/* hero */}
          <section className="py-10 text-center animate-fade-up sm:py-14">
            <div className="chip mx-auto mb-4 border-brand/40 bg-brand/10 text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              Simple, honest pricing
            </div>
            <h1 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Invest in skills that <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">compound</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
              Every plan is built around real projects, real feedback and a portfolio you can show. Start free, upgrade
              when you&apos;re ready to go all in.
            </p>
          </section>

          {/* coupon */}
          <section className="mx-auto mb-8 max-w-md animate-fade-up">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success/10 px-4 py-2.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-success">
                  <BadgePercent className="h-4 w-4" />
                  {coupon.code} applied — {coupon.percentOff}% off paid plans
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCoupon(null);
                    setCouponInput("");
                  }}
                  className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Remove coupon"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Have a coupon code?"
                    className="input-dark flex-1 uppercase"
                  />
                  <button type="button" onClick={applyCoupon} className="btn-ghost shrink-0 px-4">
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-1.5 text-xs text-danger">{couponError}</p>}
              </div>
            )}
          </section>

          {/* plan cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan, i) => {
              const Icon = PLAN_ICONS[plan.id] ?? Zap;
              const isCurrent = hydrated && currentPlanId === plan.id;
              const price = discounted(plan.priceInr, coupon);
              const hasDiscount = coupon !== null && plan.priceInr > 0 && price < plan.priceInr;
              const isFounder = plan.id === "FOUNDER_LIFETIME";
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "card-glow relative flex flex-col p-6 animate-fade-up",
                    plan.highlight && "ring-2 ring-brand",
                    isFounder && "ring-1 ring-premium/50"
                  )}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
                      Most popular
                    </span>
                  )}
                  {isFounder && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-premium to-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Launch offer
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        isFounder ? "bg-premium/15 text-premium" : "bg-brand/15 text-brand"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-base font-bold text-white">{plan.name}</div>
                      <div className="text-[11px] text-zinc-500">{plan.tagline}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    {hasDiscount && <span className="text-sm text-zinc-500 line-through">{fmtInr(plan.priceInr)}</span>}
                    <span className="font-display text-3xl font-bold text-white">{fmtInr(price)}</span>
                    <span className="text-xs text-zinc-500">{periodLabel(plan)}</span>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check
                          className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", isFounder ? "text-premium" : "text-success")}
                          strokeWidth={3}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrent ? (
                      <button disabled className="btn-ghost w-full opacity-60">
                        <CheckCircle2 className="h-4 w-4 text-success" /> Current plan
                      </button>
                    ) : plan.priceInr === 0 ? (
                      isAuthenticated ? (
                        <button disabled className="btn-ghost w-full opacity-60">
                          Included
                        </button>
                      ) : (
                        <Link href="/register" className="btn-ghost w-full">
                          Start free
                        </Link>
                      )
                    ) : isAuthenticated ? (
                      <button
                        onClick={() => setCheckoutPlan(plan)}
                        className={cn("w-full", isFounder ? "btn-premium" : "btn-primary")}
                      >
                        {isFounder ? <Crown className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        Choose {plan.name}
                      </button>
                    ) : (
                      <Link href="/register" className={cn("w-full", isFounder ? "btn-premium" : "btn-primary")}>
                        Get started <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* comparison table */}
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold text-white">Free vs Pro</h2>
            <p className="mt-2 text-center text-sm text-zinc-400">Everything at a glance.</p>
            <div className="clay-card mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Feature</th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Free
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-brand">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.label} className="border-b border-line/50 last:border-0">
                      <td className="px-5 py-3.5 text-zinc-300">{row.label}</td>
                      <td className="px-5 py-3.5 text-center">
                        {row.free ? (
                          <Check className="mx-auto h-4 w-4 text-success" strokeWidth={3} />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-zinc-600" strokeWidth={3} />
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {row.pro ? (
                          <Check className="mx-auto h-4 w-4 text-success" strokeWidth={3} />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-zinc-600" strokeWidth={3} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="text-center font-display text-2xl font-bold text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="clay-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{faq.q}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform", openFaq === i && "rotate-180")}
                    />
                  </button>
                  {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* bottom CTA */}
          <section className="mt-16 text-center">
            <div className="clay-card mx-auto max-w-2xl bg-gradient-to-br from-card to-surface p-8 sm:p-10">
              <ShieldCheck className="mx-auto h-8 w-8 text-brand" />
              <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                Built for outcomes, not certificates alone
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                Every rupee goes toward reviews, better missions and a platform that makes you employable. Questions?
                Reach us any time.
              </p>
              {!isAuthenticated && (
                <Link href="/register" className="btn-primary mx-auto mt-5">
                  Start building free <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>
        </main>
      </div>

      {checkoutPlan && <CheckoutModal plan={checkoutPlan} coupon={coupon} onClose={() => setCheckoutPlan(null)} />}
    </AppShell>
  );
}
