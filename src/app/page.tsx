"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Hammer,
  Hexagon,
  Layers,
  QrCode,
  Rocket,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SkillIcon } from "@/components/SkillIcon";
import { SKILLS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { PLANS, cn, fmtInr, fmtNum } from "@/lib/utils";
import type { PlanDef } from "@/lib/utils";

/* ------------------------------ derived stats ------------------------------ */

const TOTAL_MISSIONS = SKILLS.reduce((n, s) => n + s.missions.length, 0);
const TOTAL_HOURS = SKILLS.reduce((n, s) => n + s.estimatedHours, 0);
const CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category)));

const DIFF_COLORS: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#facc15",
  Advanced: "#f97316",
  Expert: "#ef4444",
};

/* ------------------------------ static content ------------------------------ */

const LOOP_STEPS = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "Curated videos, guides and templates — just enough theory to start acting.",
    color: "#3b82f6",
  },
  {
    icon: Hammer,
    title: "Do the assignment",
    text: "Every mission has a real brief with deliverables and an execution checklist.",
    color: "#06b6d4",
  },
  {
    icon: UploadCloud,
    title: "Submit your work",
    text: "Ship it as links, files or a write-up — GitHub, Figma, Drive, whatever fits.",
    color: "#8b5cf6",
  },
  {
    icon: ClipboardCheck,
    title: "Get reviewed",
    text: "A human reviews every submission with feedback, a score and a verdict.",
    color: "#facc15",
  },
  {
    icon: Briefcase,
    title: "Portfolio grows",
    text: "Approved work lands in your portfolio — plus XP, Neurons and badges.",
    color: "#22c55e",
  },
];

const OUTCOME_CARDS: { skillId: string; outcomes: string[] }[] = [
  {
    skillId: "entrepreneurship",
    outcomes: [
      "5 real customer interviews, logged",
      "A validated problem and lean canvas",
      "A landing page with a live waitlist",
      "A pitch deck and a shipped MVP",
    ],
  },
  {
    skillId: "vibe-coding",
    outcomes: [
      "A Next.js app deployed on Vercel",
      "Reusable components with real state",
      "API-driven pages with loading states",
      "5 seeded bugs fixed with AI pairing",
    ],
  },
  {
    skillId: "content-creation",
    outcomes: [
      "3 published threads and 5 posts",
      "A 30-day multi-platform calendar",
      "A lead magnet with email capture",
      "Your documented content flywheel",
    ],
  },
];

function periodLabel(p: PlanDef) {
  switch (p.period) {
    case "forever":
      return "forever";
    case "month":
      return "/ month";
    case "year":
      return "/ year";
    case "lifetime":
      return "one-time";
  }
}

/* ------------------------------ tiny helpers ------------------------------ */

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
        <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-sm font-bold tracking-tight text-white">Skill Edge Learning</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Skill OS</span>
      </span>
    </span>
  );
}

/* --------------------------------- page --------------------------------- */

export default function LandingPage() {
  const { hydrated, isAuthenticated } = useApp();

  const primaryHref = isAuthenticated ? "/dashboard" : "/register";
  const skillHref = (skillId: string) => (isAuthenticated ? `/learn/${skillId}` : "/register");

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-base text-white">
      {/* ---------- ambient background ---------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[130px]" />
        <div className="absolute -left-40 top-64 h-[420px] w-[420px] rounded-full bg-premium/10 blur-[110px]" />
        <div className="absolute -right-40 top-32 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[110px]" />
        <div
          className="absolute inset-x-0 top-0 h-[720px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      {/* ---------- sticky glass navbar ---------- */}
      <header className="sticky top-0 z-50 border-b border-line/60 bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Skill Edge Learning home">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-zinc-400 md:flex">
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#skills" className="transition hover:text-white">
              Skills
            </a>
            <a href="#outcomes" className="transition hover:text-white">
              Outcomes
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {!hydrated ? (
              <>
                <div className="skeleton hidden h-9 w-20 sm:block" />
                <div className="skeleton h-9 w-28" />
              </>
            ) : isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost hidden px-4 py-2 text-xs sm:inline-flex sm:text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ---------- hero ---------- */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <div className="chip animate-fade-up border-brand/40 bg-brand/10 text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            The Skill Operating System
          </div>

          <h1
            className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white animate-fade-up sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            Don&apos;t watch.
            <br />
            <span className="bg-gradient-to-r from-brand via-accent to-premium bg-clip-text text-transparent">
              Build.
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-base text-zinc-400 animate-fade-up sm:text-lg"
            style={{ animationDelay: "0.16s" }}
          >
            Ten-mission skill tracks where every mission ends in real work — reviewed by humans, rewarded with XP and
            Neurons, and stacked into a portfolio you can actually show.
          </p>

          <div
            className="mt-9 flex flex-col items-center gap-3 animate-fade-up sm:flex-row"
            style={{ animationDelay: "0.24s" }}
          >
            {!hydrated ? (
              <>
                <div className="skeleton h-12 w-48" />
                <div className="skeleton h-12 w-40" />
              </>
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn-primary px-7 py-3 text-sm sm:text-base">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#skills" className="btn-ghost px-7 py-3 text-sm sm:text-base">
                  Browse skills
                </a>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-primary px-7 py-3 text-sm sm:text-base">
                  Start building — free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how" className="btn-ghost px-7 py-3 text-sm sm:text-base">
                  See how it works
                </a>
              </>
            )}
          </div>

          <p className="mt-5 text-xs text-zinc-500 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            Free plan includes the first 4 missions of every skill. No credit card required.
          </p>
        </section>

        {/* ---------- social proof strip ---------- */}
        <section className="border-y border-line/60 bg-surface/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
              {[
                { icon: Layers, value: `${SKILLS.length}`, label: "Skill tracks" },
                { icon: Rocket, value: fmtNum(TOTAL_MISSIONS), label: "Hands-on missions" },
                { icon: Clock3, value: `${fmtNum(TOTAL_HOURS)}+ hrs`, label: "Of guided building" },
                { icon: QrCode, value: "QR-verified", label: "Certificates" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <s.icon className="h-5 w-5 text-brand" />
                  <div className="font-display text-xl font-bold text-white sm:text-2xl">{s.value}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((c) => (
                <span key={c} className="chip text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- how it works ---------- */}
        <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand">The mission loop</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One loop. Repeated until you&apos;re dangerous.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              No passive completion bars. A mission only counts when your work is submitted, reviewed and approved.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LOOP_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07} className="h-full">
                <div className="clay-card relative flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${step.color}1f`, color: step.color }}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-600">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- skills showcase ---------- */}
        <section id="skills" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">The catalog</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Skills the market actually pays for
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Every track is 10 missions deep — from first principles to a portfolio-grade capstone.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.slice(0, 8).map((skill, i) => (
              <Reveal key={skill.id} delay={(i % 4) * 0.06} className="h-full">
                <Link href={skillHref(skill.id)} className="card-glow group flex h-full flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${skill.color}1f`, color: skill.color }}
                    >
                      <SkillIcon name={skill.iconName} className="h-5 w-5" />
                    </span>
                    <span className="chip !text-[10px]">{skill.category}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold leading-snug text-white transition group-hover:text-brand">
                      {skill.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">{skill.description}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] font-semibold text-zinc-400">
                    <span style={{ color: DIFF_COLORS[skill.difficulty] ?? "#9ca3af" }}>{skill.difficulty}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {skill.estimatedHours}h
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {skill.missions.length} missions
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link href={isAuthenticated ? "/skills" : "/register"} className="btn-ghost px-6 py-2.5 text-sm">
              View all {SKILLS.length} skills
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>

        {/* ---------- outcomes ---------- */}
        <section id="outcomes" className="border-y border-line/60 bg-surface/40">
          <div className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-success">Proof of work</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Finish a skill. Walk away with proof.
              </h2>
              <p className="mt-3 text-sm text-zinc-400 sm:text-base">
                Not a completion percentage — a stack of reviewed, real-world deliverables.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {OUTCOME_CARDS.map((card, i) => {
                const skill = SKILLS.find((s) => s.id === card.skillId);
                if (!skill) return null;
                return (
                  <Reveal key={card.skillId} delay={i * 0.08} className="h-full">
                    <div className="clay-card flex h-full flex-col gap-4 p-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: `${skill.color}1f`, color: skill.color }}
                        >
                          <SkillIcon name={skill.iconName} className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-display text-sm font-bold text-white">{skill.title}</h3>
                          <div className="text-[11px] font-semibold text-zinc-500">By mission 10, you have:</div>
                        </div>
                      </div>
                      <ul className="space-y-2.5">
                        {card.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2.5 text-sm text-zinc-300">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- pricing preview ---------- */}
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-premium">Pricing</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start free. Upgrade when you&apos;re hooked.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              The first 4 missions of every skill are free, forever. Pro unlocks the full depth of every track.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.06} className="h-full">
                <div
                  className={cn(
                    "clay-card relative flex h-full flex-col gap-4 p-6",
                    plan.highlight && "border-brand/60 ring-1 ring-brand/40"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
                      Most popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{plan.name}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{plan.tagline}</p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-bold text-white">{fmtInr(plan.priceInr)}</span>
                    <span className="text-xs text-zinc-500">{periodLabel(plan)}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 h-3.5 w-3.5 shrink-0",
                            plan.id === "FOUNDER_LIFETIME" ? "text-premium" : "text-success"
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/pricing"
                      className={cn(
                        "w-full py-2.5 text-xs",
                        plan.id === "FOUNDER_LIFETIME" ? "btn-premium" : plan.highlight ? "btn-primary" : "btn-ghost"
                      )}
                    >
                      {plan.priceInr === 0 ? "Start free" : `Get ${plan.name}`}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center">
            <Link href="/pricing" className="text-sm font-semibold text-brand transition hover:text-accent">
              Compare all plans and features
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </Reveal>
        </section>

        {/* ---------- final CTA ---------- */}
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-card border border-brand/30 bg-gradient-to-br from-brand/15 via-card to-premium/10 p-10 text-center sm:p-14">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-brand/25 blur-[100px]" aria-hidden />
              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
                  <Hexagon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Your portfolio starts with mission one.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
                  Pick a skill, ship your first project this week, and let every approved mission compound into proof.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href={primaryHref} className="btn-primary px-8 py-3 text-sm sm:text-base">
                    {isAuthenticated ? "Open Dashboard" : "Create your free account"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {!isAuthenticated && (
                    <Link href="/login" className="btn-ghost px-8 py-3 text-sm sm:text-base">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="relative z-10 border-t border-line/60 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <BrandMark />
              <p className="mt-4 max-w-sm text-sm text-zinc-400">
                The Skill Operating System. Learn by executing real missions, get human feedback, and graduate with a
                portfolio and verifiable certificates — not just watch time.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Product</div>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>
                  <a href="#how" className="transition hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#skills" className="transition hover:text-white">
                    Skills catalog
                  </a>
                </li>
                <li>
                  <a href="#outcomes" className="transition hover:text-white">
                    Outcomes
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="transition hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Account</div>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>
                  <Link href="/login" className="transition hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition hover:text-white">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="transition hover:text-white">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-6 text-xs text-zinc-500 sm:flex-row">
            <span>© {new Date().getFullYear()} Skill Edge Learning. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5">
              <Hexagon className="h-3.5 w-3.5 text-accent" />
              Earn Neurons. Ship missions. Build proof.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
