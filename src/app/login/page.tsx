"use client";

import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, User, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { playClickSound } from "@/lib/sound";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser, state } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    const res = login(email, password);
    if (res.ok) {
      playClickSound();
      router.push("/dashboard");
    } else {
      setError(res.reason || "Invalid email or password.");
    }
  };

  const handleQuickDemo = (userId: string) => {
    switchUser(userId);
    playClickSound();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center p-4">
      <div className="clay-card w-full max-w-md p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl btn-primary font-mono text-2xl font-black shadow-xl shadow-amber-500/20">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Skill Edge <span className="text-amber-400">OS</span>
          </h1>
          <p className="text-xs text-zinc-400">Sign in to your gamified learning account</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-400" /> Email Address
            </label>
            <input
              type="email"
              placeholder="aarav@skilledge.app"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="input-dark"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-400" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="input-dark"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-lg">
            Sign In <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Quick Sign-in Section */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center">
            ⚡ Quick Demo 1-Click Login
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo("u-student")}
              className="neo-button p-3 text-left transition hover:scale-[1.02] flex flex-col gap-1 border border-amber-400/30"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>🤖</span> Student
              </div>
              <div className="text-[10px] text-zinc-400 truncate">Aarav Mehta</div>
            </button>

            <button
              onClick={() => handleQuickDemo("u-admin")}
              className="neo-button p-3 text-left transition hover:scale-[1.02] flex flex-col gap-1 border border-amber-400/40"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Admin
              </div>
              <div className="text-[10px] text-zinc-400 truncate">Skill Edge Admin</div>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-amber-400 hover:underline">
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
