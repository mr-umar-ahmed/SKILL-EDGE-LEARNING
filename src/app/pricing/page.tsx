"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";
import { PLANS, PlanDef, discounted, periodLabel } from "@/lib/utils";
import type { Coupon, PaymentMethod, Skill } from "@/lib/types";
import { Modal } from "@/components/ui";
import { fmtInr, cn } from "@/lib/utils";
import { SkillIcon } from "@/components/SkillIcon";
import {
  Zap,
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  BadgePercent,
  X,
  ChevronDown,
  ArrowRight,
  Hexagon,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Clock3,
  BookOpen,
  Lock,
  Layers,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const PLAN_ICONS: Record<string, typeof Zap> = {
  FREE: Sparkles,
  INDIVIDUAL_SKILL: BookOpen,
  PRO: Zap,
  PREMIUM: Crown,
  PRO_MONTHLY: Zap,
  PRO_YEARLY: Crown,
};

function fireBigConfetti() {
  if (typeof window === "undefined") return;
  import("canvas-confetti")
    .then((mod) => {
      const confetti = mod.default;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    })
    .catch(() => {});
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(false);
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ------------------------------ checkout modal ------------------------------ */

type PayMethod = "UPI" | "RAZORPAY" | "STRIPE";

function CheckoutModal({
  plan,
  skill,
  coupon,
  onClose,
}: {
  plan: PlanDef;
  skill?: Skill | null;
  coupon: Coupon | null;
  onClose: () => void;
}) {
  const { currentUser, purchasePlanUpi, activatePlan, unlockSingleSkill } = useApp();
  const basePrice = skill ? 99 : plan.priceInr;
  const finalAmount = discounted(basePrice, coupon);

  const [method, setMethod] = useState<PayMethod>("UPI");
  const [utr, setUtr] = useState("");
  const [upiSubmitted, setUpiSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const checkoutTitle = skill ? `Unlock Skill — ${skill.title}` : `Checkout — ${plan.name}`;

  const submitUpi = () => {
    if (utr.trim().length < 8) return;
    if (skill) {
      unlockSingleSkill(skill.id, "UPI", finalAmount);
    } else {
      purchasePlanUpi(plan.id, finalAmount, utr.trim(), coupon?.code);
    }
    setUpiSubmitted(true);
  };

  const startRazorpay = async () => {
    setGatewayError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          currency: "INR",
          receipt: skill ? `skill_${skill.id}_${Date.now()}` : `plan_${plan.id}_${Date.now()}`,
        }),
      });
      if (res.status === 401 || res.status === 503) {
        setGatewayError("Gateway credentials missing — use UPI (manual verify) instead.");
        setBusy(false);
        return;
      }
      if (!res.ok) {
        setGatewayError("Could not create the payment order. Try again, or use UPI.");
        setBusy(false);
        return;
      }
      const order = (await res.json()) as { order_id: string; amount: number; currency: string; key_id: string };
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok || !window.Razorpay) {
        setGatewayError("Could not load Razorpay checkout script. Check your internet connection.");
        setBusy(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Skill Edge Learning",
        description: skill ? `Unlock ${skill.title}` : `${plan.name} plan`,
        order_id: order.order_id,
        prefill: { name: currentUser?.name, email: currentUser?.email },
        theme: { color: "#E85002" },
        modal: {
          ondismiss: () => setBusy(false),
        },
        handler: async (resp: RazorpayResponse) => {
          try {
            const vr = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            const data = (await vr.json().catch(() => null)) as { success?: boolean; error?: string } | null;
            if (vr.ok && data?.success) {
              if (skill) {
                unlockSingleSkill(skill.id, "RAZORPAY", finalAmount, {
                  orderId: resp.razorpay_order_id,
                  paymentId: resp.razorpay_payment_id,
                });
              } else {
                activatePlan(plan.id, "RAZORPAY", finalAmount, {
                  orderId: resp.razorpay_order_id,
                  paymentId: resp.razorpay_payment_id,
                  couponCode: coupon?.code,
                });
              }
              fireBigConfetti();
              setPaid(true);
            } else {
              setGatewayError(data?.error || "Payment verification failed. Contact support if you were charged.");
            }
          } catch {
            setGatewayError("Payment verification failed. Contact support if you were charged.");
          } finally {
            setBusy(false);
          }
        },
      });
      rzp.open();
    } catch {
      setGatewayError("Something went wrong starting Razorpay. Try again, or use UPI.");
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
          planId: skill ? "INDIVIDUAL_SKILL" : plan.id,
          planName: skill ? `Skill: ${skill.title}` : plan.name,
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
        setGatewayError("Could not start Stripe session. Try again or use UPI.");
        setBusy(false);
        return;
      }
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setGatewayError("No checkout URL returned from Stripe.");
        setBusy(false);
      }
    } catch {
      setGatewayError("Something went wrong starting Stripe. Try again, or use UPI.");
      setBusy(false);
    }
  };

  const methods: { id: PayMethod; label: string; sub: string; Icon: typeof Smartphone }[] = [
    { id: "UPI", label: "UPI (manual verify)", sub: "Instant QR / UTR", Icon: Smartphone },
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
            <div className="font-display text-xl font-bold text-white">
              {skill ? `Unlocked ${skill.title}` : `${plan.name} is active`}
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              {skill
                ? `You now have lifetime access to all 10 missions of ${skill.title}.`
                : "All 12 skills & 120 missions are unlocked. Time to build something real."}
            </p>
          </div>
          <Link href={skill ? `/learn/${skill.id}` : "/dashboard"} className="btn-primary w-full">
            {skill ? "Start Skill Missions" : "Go to dashboard"} <ArrowRight className="h-4 w-4" />
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
              Your {skill ? skill.title : plan.name} access activates after verification — usually within a few hours. Track status on your billing page.
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
    <Modal open onClose={onClose} title={checkoutTitle}>
      <div className="space-y-4">
        {/* order summary */}
        <div className="flex items-center justify-between rounded-xl border border-line bg-base p-3.5">
          <div>
            <div className="text-sm font-semibold text-white">{skill ? skill.title : plan.name}</div>
            <div className="text-xs text-zinc-500">
              {skill ? "One-time lifetime access" : `Billed ${plan.period === "month" ? "monthly" : plan.period === "year" ? "yearly" : "once"}`}
              {coupon && (
                <span className="ml-2 inline-flex items-center gap-1 text-success">
                  <BadgePercent className="h-3 w-3" />
                  {coupon.code} · {coupon.percentOff}% off
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {coupon && <div className="text-xs text-zinc-500 line-through">{fmtInr(basePrice)}</div>}
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
                  ? "border-brand bg-brand/10 text-white shadow-brand"
                  : "border-line bg-card text-zinc-400 hover:border-zinc-700 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", method === id ? "text-brand" : "text-zinc-500")} />
              <div className="text-xs font-semibold text-white">{label}</div>
              <div className="text-[10px] text-zinc-500">{sub}</div>
            </button>
          ))}
        </div>

        {gatewayError && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger">
            {gatewayError}
          </div>
        )}

        {/* method views */}
        {method === "UPI" && (
          <div className="space-y-3 rounded-xl border border-line bg-base p-4">
            <div className="text-xs text-zinc-400">
              Pay <strong className="text-white">{fmtInr(finalAmount)}</strong> to UPI ID below or scan with GPay / PhonePe / Paytm:
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface p-2.5 text-xs">
              <span className="font-mono text-zinc-300">learningskilledge@upi</span>
              <span className="rounded bg-brand/15 px-2 py-0.5 font-bold text-brand">GPay / PhonePe / Paytm</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Transaction UTR Number (12 digits)</label>
              <input
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 402918274619"
                className="input-dark"
              />
            </div>
            <button
              type="button"
              disabled={utr.trim().length < 8}
              onClick={submitUpi}
              className="btn-primary w-full disabled:opacity-50"
            >
              Submit UTR for verification
            </button>
          </div>
        )}

        {method === "RAZORPAY" && (
          <div className="space-y-3 rounded-xl border border-line bg-base p-4 text-center">
            <p className="text-xs text-zinc-400">
              Instant payment via Razorpay Web Checkout (UPI Apps, Debit/Credit Cards, Netbanking).
            </p>
            <button type="button" disabled={busy} onClick={startRazorpay} className="btn-primary w-full">
              {busy ? "Opening Razorpay..." : `Pay ${fmtInr(finalAmount)} with Razorpay`}
            </button>
          </div>
        )}

        {method === "STRIPE" && (
          <div className="space-y-3 rounded-xl border border-line bg-base p-4 text-center">
            <p className="text-xs text-zinc-400">Secure international card payments processed via Stripe.</p>
            <button type="button" disabled={busy} onClick={startStripe} className="btn-primary w-full">
              {busy ? "Redirecting..." : `Pay ${fmtInr(finalAmount)} with Credit/Debit Card`}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------------------------------- page Content ---------------------------------- */

function PricingContent() {
  const searchParams = useSearchParams();
  const initialSkillId = searchParams.get("skillId");

  const { hydrated, catalog, currentUser, isAuthenticated, isPro, myProgress, validateCoupon } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanDef | null>(null);
  const [checkoutSkill, setCheckoutSkill] = useState<Skill | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentPlanId = currentUser?.subscription.plan;

  // Auto-open checkout if skillId param is provided
  React.useEffect(() => {
    if (initialSkillId && catalog.length > 0 && !checkoutSkill) {
      const target = catalog.find((s) => s.id === initialSkillId);
      if (target) {
        const indPlan = PLANS.find((p) => p.id === "INDIVIDUAL_SKILL") ?? PLANS[1];
        setCheckoutSkill(target);
        setCheckoutPlan(indPlan);
      }
    }
  }, [initialSkillId, catalog, checkoutSkill]);

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

  const COMPARISON: { label: string; free: boolean; pro: boolean }[] = [
    { label: "Missions 1–3 of every skill", free: true, pro: true },
    { label: "All 10 missions per skill", free: false, pro: true },
    { label: "Project submissions & feedback", free: true, pro: true },
    { label: "Priority AI & Admin review queue", free: false, pro: true },
    { label: "Portfolio with public share link", free: true, pro: true },
    { label: "QR-verified completion certificates", free: false, pro: true },
    { label: "Weekly tournaments & leaderboard", free: true, pro: true },
    { label: "Completely ad-free experience", free: false, pro: true },
  ];

  const FAQS: { q: string; a: string }[] = [
    {
      q: "How does purchasing an Individual Skill for ₹99 work?",
      a: "When you purchase a single skill for ₹99, you get lifetime access to all 10 missions, project submissions, portfolio hosting, and QR-verified completion certificate for that specific skill. You don't need to subscribe to Pro unless you want access to all 12 skills.",
    },
    {
      q: "What is included in the Free Plan (₹0)?",
      a: "The Free Plan gives you access to the first 2-3 missions of every skill, community access, basic project feedback, and basic certificates. It lets you test the gamified learning loop before buying.",
    },
    {
      q: "What is the difference between Pro Plan (₹299) and Premium Plan (₹499)?",
      a: "The Pro Plan (₹299/mo) gives you full access to all 12 skills, all 120 missions, portfolio hosting, and standard project reviews. The Premium Plan (₹499/mo) adds priority AI & Admin project reviews, 1-on-1 portfolio review feedback, exclusive Mastermind challenges, and direct Founder support.",
    },
    {
      q: "Can I upgrade from an Individual Skill to Pro or Premium later?",
      a: "Yes! You can upgrade to Pro (₹299/mo) or Premium (₹499/mo) at any time to instantly unlock all 12 skills and future skill drops.",
    },
    {
      q: "How does UPI manual verification work?",
      a: "Scan the QR / enter the UPI ID, pay ₹99 or plan fee, and submit your 12-digit UTR number. Our team verifies it (usually within a few hours) and your access activates automatically. You can track status on your billing page.",
    },
  ];

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
              Honest Skill OS Pricing
            </div>
            <h1 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Buy one skill for <span className="text-brand">₹99</span> or unlock all 12 with <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">Pro</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
              Every skill is a game campaign that produces a real-world portfolio project. Start free, buy skills individually, or get unlimited access.
            </p>
          </section>

          {/* coupon */}
          <section className="mx-auto mb-10 max-w-md animate-fade-up">
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

          {/* Subscription Plans Section */}
          <section className="mb-16">
            <h2 className="mb-6 font-display text-xl font-bold text-white text-center">Subscription & Membership Plans</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PLANS.filter((p) => p.id !== "INDIVIDUAL_SKILL").map((plan, i) => {
                const Icon = PLAN_ICONS[plan.id] ?? Zap;
                const isCurrent = hydrated && currentPlanId === plan.id;
                const price = discounted(plan.priceInr, coupon);
                const hasDiscount = coupon !== null && plan.priceInr > 0 && price < plan.priceInr;
                const isPremium = plan.id === "PREMIUM";

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "card-glow relative flex flex-col p-6 animate-fade-up",
                      plan.highlight && "ring-2 ring-brand",
                      isPremium && "ring-1 ring-premium/50"
                    )}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
                        Most popular
                      </span>
                    )}
                    {isPremium && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-premium to-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Full Perks
                      </span>
                    )}

                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl",
                          isPremium ? "bg-premium/15 text-premium" : "bg-brand/15 text-brand"
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
                            className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", isPremium ? "text-premium" : "text-success")}
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
                            Free Plan Active
                          </button>
                        ) : (
                          <Link href="/register" className="btn-ghost w-full">
                            Start Free
                          </Link>
                        )
                      ) : isAuthenticated ? (
                        <button
                          onClick={() => {
                            setCheckoutSkill(null);
                            setCheckoutPlan(plan);
                          }}
                          className={cn("w-full", isPremium ? "btn-premium" : "btn-primary")}
                        >
                          {isPremium ? <Crown className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                          Choose {plan.name}
                        </button>
                      ) : (
                        <Link href="/register" className={cn("w-full", isPremium ? "btn-premium" : "btn-primary")}>
                          Get started <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Individual Skill Purchase Grid Section (₹99) */}
          <section className="mb-16">
            <div className="mb-6 text-center">
              <div className="chip mx-auto mb-2 border-brand/40 bg-brand/10 text-brand">
                <BookOpen className="h-3.5 w-3.5" /> Single Skill Unlocks
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Purchase Any Skill Separately — ₹99</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Want just 1 skill? Get lifetime access to all 10 missions, deliverables, portfolio hosting & certificate for ₹99 one-time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((s) => {
                const isSingleUnlocked = Boolean(myProgress.unlockedSingleSkills?.includes(s.id));
                const isFullProAccess = isPro;
                const isUnlocked = isSingleUnlocked || isFullProAccess;

                return (
                  <div
                    key={s.id}
                    className="card-glow flex flex-col justify-between rounded-2xl border border-line bg-card p-5 transition hover:border-brand/40"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
                          style={{ background: `${s.color}22` }}
                        >
                          <SkillIcon name={s.iconName} className="h-5 w-5" style={{ color: s.color }} />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{s.category}</span>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-400">{s.description}</p>

                      <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-success" /> All 10 Campaign Missions
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-success" /> Real Portfolio Project Deliverable
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-success" /> QR-Verified Completion Certificate
                        </li>
                      </ul>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                      <div>
                        <div className="text-[10px] text-zinc-500">One-time payment</div>
                        <div className="font-display text-lg font-bold text-white">₹99</div>
                      </div>

                      {isUnlocked ? (
                        <Link href={`/learn/${s.id}`} className="btn-ghost text-xs">
                          <CheckCircle2 className="h-4 w-4 text-success" /> {isFullProAccess ? "Pro Unlocked" : "Unlocked ✓"}
                        </Link>
                      ) : isAuthenticated ? (
                        <button
                          type="button"
                          onClick={() => {
                            const indPlan = PLANS.find((p) => p.id === "INDIVIDUAL_SKILL") ?? PLANS[1];
                            setCheckoutSkill(s);
                            setCheckoutPlan(indPlan);
                          }}
                          className="btn-primary text-xs px-4"
                        >
                          Unlock for ₹99
                        </button>
                      ) : (
                        <Link href="/register" className="btn-primary text-xs px-4">
                          Unlock for ₹99
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* comparison table */}
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold text-white">Free vs Pro Comparison</h2>
            <p className="mt-2 text-center text-sm text-zinc-400">Everything at a glance.</p>
            <div className="clay-card mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Feature</th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Free (₹0)
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-brand">
                      Single Skill (₹99)
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-accent">
                      Pro / Family
                    </th>
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
                        <Check className="mx-auto h-4 w-4 text-success" strokeWidth={3} />
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
                Every rupee goes toward AI project reviews, better missions, and building a platform that makes you employable.
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

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          skill={checkoutSkill}
          coupon={coupon}
          onClose={() => {
            setCheckoutPlan(null);
            setCheckoutSkill(null);
          }}
        />
      )}
    </AppShell>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-base" />}>
      <PricingContent />
    </Suspense>
  );
}
