"use client";

import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, User, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { playClickSound } from "@/lib/sound";

const EMOJI_AVATARS = ["🚀", "🤖", "⚡", "🧠", "🔥", "🔮", "💎", "🛡️", "👾", "👑"];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [avatar, setAvatar] = useState("🚀");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const res = register(name, email, password, role, avatar);
    if (res.ok) {
      playClickSound();
      router.push("/dashboard");
    }
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
            Create Account
          </h1>
          <p className="text-xs text-zinc-400">Join Skill Edge OS & claim 100 ↁ bonus coins</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" /> Full Name
            </label>
            <input
              type="text"
              placeholder="Aarav Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-dark"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-400" /> Email Address
            </label>
            <input
              type="email"
              placeholder="aarav@skilledge.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
              required
            />
          </div>

          {/* Avatar Emoji Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Choose Cyber Avatar</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`h-9 w-9 rounded-xl text-lg flex items-center justify-center transition ${
                    avatar === emoji
                      ? "neo-box bg-amber-500/20 border-2 border-amber-400 scale-110"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Account Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`neo-button p-2.5 text-xs font-bold transition text-center ${
                  role === "USER" ? "bg-amber-500/20 border border-amber-400 text-amber-300" : "text-zinc-400"
                }`}
              >
                🎓 Learner
              </button>
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`neo-button p-2.5 text-xs font-bold transition text-center ${
                  role === "ADMIN" ? "bg-amber-500/20 border border-amber-400 text-amber-300" : "text-zinc-400"
                }`}
              >
                👑 System Admin
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-lg">
            Create Account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-amber-400 hover:underline">
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
