"use client";

import { SignIn } from "@clerk/nextjs";
import { Briefcase, ClipboardCheck, Hammer, Hexagon, QrCode } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";


const PITCH = [
  {
    icon: Hammer,
    title: "Build, don't binge",
    text: "Every mission ends in real work — not watch time.",
  },
  {
    icon: ClipboardCheck,
    title: "Human review on every mission",
    text: "Submissions get feedback, a score and an approval.",
  },
  {
    icon: Briefcase,
    title: "Portfolio on autopilot",
    text: "Approved projects become portfolio pieces instantly.",
  },
  {
    icon: QrCode,
    title: "Certificates that verify",
    text: "Every certificate carries a QR verification code.",
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh w-full bg-base">
      {/* ---------- left brand panel ---------- */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden border-r border-line/60 bg-surface lg:flex">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/15 blur-[110px]" />
          <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-premium/10 blur-[110px]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 80% 70% at 30% 30%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 30%, black, transparent)",
            }}
          />
        </div>

        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Skill Edge Learning home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
              <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-tight text-white">Skill Edge Learning</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Skill OS
              </span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 px-10 pb-10">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              Welcome back,
              <br />
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">builder.</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm text-zinc-400">
              Your missions, streak and portfolio are waiting exactly where you left them.
            </p>
          </div>

          <ul className="space-y-4">
            {PITCH.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-brand">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-zinc-400">{item.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-t border-line/60 px-10 py-6">
          <p className="text-sm italic text-zinc-400">&ldquo;Learn to build, learn to sell. You&apos;ll be unstoppable.&rdquo;</p>
          <p className="mt-1 text-xs font-semibold text-zinc-500">Naval Ravikant</p>
        </div>
      </aside>

      {/* ---------- right auth panel ---------- */}
      <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 left-1/2 h-96 w-[560px] -translate-x-1/2 rounded-full bg-brand/10 blur-[110px]" />
        </div>

        {/* mobile brand header */}
        <Link href="/" className="relative z-10 flex flex-col items-center gap-3 text-center lg:hidden">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
            <Hexagon className="h-6 w-6 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">Skill Edge Learning</span>
        </Link>

        <div className="relative z-10 flex w-full flex-col items-center gap-6 animate-scale-in max-w-md">
          <SignIn routing="path" path="/login" signUpUrl="/register" fallbackRedirectUrl="/dashboard" />

          {/* ---------- Direct Credentials / Admin Login Card ---------- */}
          <AdminDirectLoginCard />
        </div>

        <p className="relative z-10 text-center text-sm text-zinc-400">
          New to Skill Edge?{" "}
          <Link href="/register" className="font-semibold text-brand transition hover:text-accent">
            Create a free account
          </Link>
        </p>
      </main>
    </div>
  );
}

function AdminDirectLoginCard() {
  const { loginWithCredentials } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = loginWithCredentials(email, password);
    if (!res.ok) {
      setError(res.reason || "Login failed.");
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes("learningskilledge") || cleanEmail.includes("admin");
    router.push(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="w-full clay-card p-5 space-y-3.5 border-line/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Official Admin Sign In</span>
        <span className="chip text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10">Production</span>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        {error && <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{error}</p>}
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="learningskilledge@gmail.com"
            className="input-dark text-xs"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="SelAdmin#2026!"
            className="input-dark text-xs"
          />
        </div>
        <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold">
          Sign In to Admin OS
        </button>
      </form>
    </div>
  );
}


